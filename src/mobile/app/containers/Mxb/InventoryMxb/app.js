import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import './style.less'
import { toJS, fromJS, Map, List } from 'immutable'
import { Container, Row, ScrollView,Single,Icon ,ChosenPicker,SwitchText} from 'app/components'
import { MutiPeriodMoreSelect } from 'app/containers/components'
import TableAmount from 'app/containers/components/table/TableAmount'
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
import Item from "./Item"
import * as Limit from 'app/constants/Limit.js'
import * as allActions from 'app/redux/Home/All/other.action'
import XfnIcon from 'app/components/Icon'
@connect(state => state)
export default
class InventoryMxb extends React.Component {

    static displayName = 'InventoryMxb'

    static propTypes = {
        allState: PropTypes.instanceOf(Map),
        dispatch: PropTypes.func
    }
    constructor(props) {
		super(props)
		this.state = {
			showModal: false
		}
	}
    componentDidMount() {
		thirdParty.setTitle({title: '存货明细表'})
        thirdParty.setIcon({showIcon: false})
        //thirdParty.setRight({show: false})

		// if (sessionStorage.getItem('previousPage') === 'inventoryYeb') {
		// 	sessionStorage.removeItem('previousPage')
		// }
	}
    render(){
        const {
            dispatch,
            allState,
            inventoryMxbState,
            history
        } = this.props
        const { showModal } = this.state
        const issues = allState.get('issues')
        const issuedate =inventoryMxbState.get('issuedate')
        const endissuedate =inventoryMxbState.get('endissuedate')
        const idx = issues.findIndex(v => v.get('value') === issuedate)
        const nextperiods = issues.slice(0, idx)
        const cardList = inventoryMxbState.get('cardList')
        const cardName= inventoryMxbState.get('cardName')
        const cardValue= inventoryMxbState.get('cardValue')
        const stockCategoryList = inventoryMxbState.get('stockCategoryList')
        const stockStoreList = inventoryMxbState.get('stockStoreList')
        const stockStoreValue = inventoryMxbState.get('stockStoreValue')
        const stockStoreLabel = inventoryMxbState.get('stockStoreLabel')
        const baseData = inventoryMxbState.get('baseData')
        const listData = inventoryMxbState.get('listData')
        const beginningData = inventoryMxbState.get('beginningData')
        const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])
        const chooseValue = inventoryMxbState.get('chooseValue')
        const stockCategoryValue = inventoryMxbState.get('stockCategoryValue')

        const stockCategorylabel = inventoryMxbState.get('stockCategorylabel')
        const inventoryType = inventoryMxbState.get('inventoryType')
        const stockStoreListOther = inventoryMxbState.get('stockStoreListOther')
        const stockStoreListOtherValue = inventoryMxbState.get('stockStoreListOtherValue')
        const stockStoreListOtherLabel = inventoryMxbState.get('stockStoreListOtherLabel')
        const typeList = inventoryMxbState.get('typeList')
        const typeListValue = inventoryMxbState.get('typeListValue')
        const typeListLabel = inventoryMxbState.get('typeListLabel')
        const balanceDeirection = inventoryMxbState.get('balanceDeirection')
        const showReverseAmount = inventoryMxbState.get('showReverseAmount')
        const quantityScale = inventoryMxbState.get('quantityScale')
        const priceScale = inventoryMxbState.get('priceScale')
        // export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

        const topCategoryUuid =inventoryMxbState.get('topCategoryUuid')
        const subCategoryUuid =inventoryMxbState.get('subCategoryUuid')
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendInventoryMxbExcel', {
			begin: begin,
			end: end,
            topCategoryUuid,
            subCategoryUuid,
            stockCardUuid:cardValue ? cardValue : '',
            storeCardUuid:inventoryType === 'Inventory'?stockStoreValue:stockStoreListOtherValue,
            exportAll:false,
            acId:typeListValue?typeListValue:'',
            isType:inventoryType === 'Other'
		}))
		const allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendInventoryMxbExcel', {
            begin: begin,
			end: end,
            topCategoryUuid,
            subCategoryUuid,
            stockCardUuid:cardValue ? cardValue : '',
            storeCardUuid:inventoryType === 'Inventory'?stockStoreValue:stockStoreListOtherValue,
            exportAll:true,
            acId:typeListValue?typeListValue:'',
            isType:inventoryType === 'Other'
		}))

		dispatch(allActions.navigationSetMenu('runningReport', '', ddExcelCallback, '', allddExcelCallback))
        return(
            <Container className="inventoryMxb">
                <MutiPeriodMoreSelect
                    start={issuedate}
                    issues={issues} //默认显示日期
                    end={endissuedate}
                    nextperiods={nextperiods}
                    chooseValue={chooseValue}
                    onBeginOk={(value) => {//跨期选择完开始时间后
                        dispatch(inventoryMxbActions.setInventoryMxbDate(value,''))
                        if(inventoryType === 'Inventory'){
                            dispatch(inventoryMxbActions.getInventoryMxbStockCategory(value,''))
                        }else{
                            dispatch(inventoryMxbActions.getOtherTypeStockStore(value,''))
                        }

                    }}
                    onEndOk={(value1,value2) => {//跨期选择完结束时间后
                        dispatch(inventoryMxbActions.setInventoryMxbDate(value1,value2))
                        if(inventoryType === 'Inventory'){
                            dispatch(inventoryMxbActions.getInventoryMxbStockCategory(value1,value2))
                        }else{
                            dispatch(inventoryMxbActions.getOtherTypeStockStore(value1,value2))
                        }
                    }}
                    changeChooseValue={(value)=>{
                        dispatch(inventoryMxbActions.handleInventoryMxbDateChooseValue(value))
                    }}
                />
                <div className="inventory-mxb-select">
                    <div className="select-change-table" onClick={()=> {
                        dispatch(inventoryMxbActions.changeInventoryYebType(inventoryType))
                        if(inventoryType === 'Other'){
                            dispatch(inventoryMxbActions.getInventoryMxbStockCategory(issuedate,endissuedate))
                        }else{
                            dispatch(inventoryMxbActions.getOtherTypeStockStore(issuedate,endissuedate))
                        }
                    }}>
                        <span>{inventoryType === 'Inventory' ? '库存' : '其他类型'}</span>
                        <XfnIcon type='type-change' />
                    </div>
                    {inventoryType === 'Other' && stockStoreListOther.length>0 &&
                        <div className='stock-store-other'>
                            <div className='stock-store-box-other'>
                                <ChosenPicker
                                    district={stockStoreListOther}
                                    parentDisabled={false}
                                    value={stockStoreListOtherValue}
                                    title='请选择仓库'
                                    onChange={(item) => {
                                        dispatch(inventoryMxbActions.changeOtherTypeStockStoreValue(item.key,item.label))
                                        dispatch(inventoryMxbActions.getOtherTypeStockCategory(item.key))
                                    }}
                                >
                                    <Row className='stock-store-label'>
                                        <span className='overElli'>{stockStoreListOtherLabel==='全部'?'全部仓库':stockStoreListOtherLabel}</span>
                                        <Icon type="triangle" style={{width:'16px'}}/>
                                    </Row>
                                </ChosenPicker>
                            </div>
                        </div>
                    }
                    <div className='card-list'>
                        <ChosenPicker
                            type={'card'}
                            parentDisabled={false}
                            title='请选择存货'
                            district={stockCategoryList}
                            cardList={cardList}
                            cardValue={[cardValue]}
                            children={cardName}
                            value={stockCategoryValue}
                            onChange={(item)=>{//district
                                const valueList = item.key.split(Limit.TREE_JOIN_STR)
                                const topCategoryUuid =item.key.split(Limit.TREE_JOIN_STR)[1]
                                const subCategoryUuid=item.key.split(Limit.TREE_JOIN_STR)[item.key.split(Limit.TREE_JOIN_STR).length-1]
                                if(topCategoryUuid===subCategoryUuid){
                                    dispatch(inventoryMxbActions.changeStockCategoryValue(item.key,topCategoryUuid,''))
                                    if(inventoryType==='Inventory'){
                                        dispatch(inventoryMxbActions.getInventoryMxbStockDetailCard(topCategoryUuid,''))
                                    }else{
                                        dispatch(inventoryMxbActions.getOtherTypeStockCardDetail(topCategoryUuid,''))
                                    }
                                }else{
                                    dispatch(inventoryMxbActions.changeStockCategoryValue(item.key,topCategoryUuid,subCategoryUuid))
                                    if(inventoryType==='Inventory'){
                                        dispatch(inventoryMxbActions.getInventoryMxbStockDetailCard(topCategoryUuid,subCategoryUuid))
                                    }else{
                                        dispatch(inventoryMxbActions.getOtherTypeStockCardDetail(topCategoryUuid,subCategoryUuid))
                                    }
                                }
                            }}
                            onOk={(value) => {//cardList
                                dispatch(inventoryMxbActions.changeCardList(value[0].uuid,value[0].name))
                                if(inventoryType==='Inventory'){
                                    dispatch(inventoryMxbActions.getInventoryStockStore(value[0].uuid))
                                }else{
                                    dispatch(inventoryMxbActions.getOtherTypeStockTypeList(value[0].uuid))
                                }

                            }}
                        >
                            <Row className='card-item'>
                                <span className='overElli'>{cardName ==='全部' || cardName ==='' ? stockCategorylabel : cardName}</span>
                                <Icon type="triangle" />
                            </Row>
                        </ChosenPicker>
                    </div>
                    {stockStoreList.length >0 && inventoryType === 'Inventory' &&
                        <div className='stock-store'>
                            <div className='stock-store-box'>
                                <ChosenPicker
                                    district={stockStoreList}
                                    parentDisabled={false}
                                    title='请选择仓库'
                                    value={stockStoreValue}
                                    onChange={(item) => {
                                        dispatch(inventoryMxbActions.changeStockStoreList(item.key,item.label))
                                        dispatch(inventoryMxbActions.getInventoryMxbSelectedData(item.key))
                                    }}
                                >
                                    <Row className='stock-store-label'>
                                        <span className='overElli'>{stockStoreLabel==='全部'?'全部仓库':stockStoreLabel}</span>
                                        <Icon type="triangle" />
                                    </Row>
                                </ChosenPicker>
                            </div>
                        </div>
                    }
                    {inventoryType === 'Other' &&
                    <div className='type-list'>
                        <div className='type-list-box'>
                            <ChosenPicker
                                district={typeList}
                                parentDisabled={false}
                                title='请选择类型'
                                value={typeListValue}
                                onChange={(item) => {
                                    dispatch(inventoryMxbActions.changeTypeListValue(item.key,item.label))
                                    dispatch(inventoryMxbActions.getOtherTypeMxbData(item.key))
                                }}
                            >
                                <Row className='type-list-label'>
                                    <span className='overElli'>{typeListLabel==='全部'?'全部类型':typeListLabel}</span>
                                    <Icon type="triangle" />
                                </Row>
                            </ChosenPicker>
                        </div>
                    </div>
                    }
                </div>

                <Row className="item-title">
                    <div className='title-item'>
                        期初
                        {inventoryType === 'Other'?
                            typeListLabel==="全部"?
                                <SwitchText
                                    checked={balanceDeirection == 'debit' ? false : true}
                                    className='balance-deirection'
                                    checkedChildren="贷"
                                    unCheckedChildren="借"
                                    onChange={()=>{
                                        dispatch(inventoryMxbActions.changeInventoryMxbBalanceDirection(balanceDeirection))
                                        dispatch(inventoryMxbActions.changeReverseAmount(showReverseAmount))
                                    }}
                                />:
                            <span style={{color:'rgb(153,153,153)'}}>{balanceDeirection==='debit'?'(借方)':'(贷方)'}</span>
                        :
                        ''}
                    </div>
                        <div className='title-account'>
                            <div>
                                <TableAmount direction={'debit'} isTitle={true}>{beginningData.balanceAmount?beginningData.balanceAmount:''}</TableAmount>
                            </div>
                            <div>
                                <TableAmount direction={'debit'} isTitle={true} decimalPlaces={quantityScale}>{beginningData.balanceQuantity?beginningData.balanceQuantity:''}</TableAmount>{baseData.unitCardName}*
                                <TableAmount direction={'debit'} isTitle={true} decimalPlaces={priceScale}>{beginningData.balancePrice?beginningData.balancePrice:''}</TableAmount>
                            </div>
                        </div>
                </Row>
                <ScrollView flex="1" uniqueKey="kcmxb-scroll"  className='scroll-item' savePosition>
                    {listData && listData.map((data,index)=>{
                        return(
                            <div key={index}>
                                <Item
                                    className="balance-running-tabel-width"
                                    data={data}
                                    dispatch={dispatch}
                                    unitCardName={baseData.unitCardName}
                                    unitDecimalCount={unitDecimalCount}
                                    baseData={listData}
                                    history={history}
                                    showReverseAmount={showReverseAmount}
                                    quantityScale={quantityScale}
                                    priceScale={priceScale}
                                />
                            </div>
                        )
                    })}
                </ScrollView>
                <Row className="item-title">
                    <div className='title-item'>期末 {inventoryType === 'Other'?<span style={{color:'rgb(153,153,153)'}}>{showReverseAmount?baseData.allBalanceDirection==='debit'?'(贷方)':'(借方)':baseData.allBalanceDirection==='debit'?'(借方)':'(贷方)'}</span>:''} </div>
                    <div className='title-account'>
						<div>
							<TableAmount direction={'debit'} isTitle={true}>{showReverseAmount?0-baseData.allBalanceAmount:baseData.allBalanceAmount}</TableAmount>
						</div>
                        <div>
                            <TableAmount direction={'debit'} isTitle={true} decimalPlaces={quantityScale}>{showReverseAmount?0-baseData.allBalanceQuantity:baseData.allBalanceQuantity}</TableAmount>{baseData.unitCardName}*
                            <TableAmount direction={'debit'} isTitle={true} decimalPlaces={priceScale}>{baseData.allBalancePrice}</TableAmount>
                        </div>
					</div>
                </Row>
            </Container>
        )
    }

}
