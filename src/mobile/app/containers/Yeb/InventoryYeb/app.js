import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import { DateLib } from 'app/utils'
import './style.less'
import thirdParty from 'app/thirdParty'
import { Container, Row, ScrollView,Single,Icon ,ChosenPicker} from 'app/components'
import { MutiPeriodMoreSelect} from 'app/containers/components'
import Item from './Item'
import * as inventoryYebActions from 'app/redux/Yeb/InventoryYeb/inventoryYeb.action.js'
import * as Limit from 'app/constants/Limit.js'
import * as allActions from 'app/redux/Home/All/other.action'
import XfnIcon from 'app/components/Icon'
@connect(state => state)
export default
class InventoryYeb extends React.Component {
    componentDidMount() {
		thirdParty.setTitle({title: '存货余额表'})
		thirdParty.setIcon({showIcon: false})
	//	thirdParty.setRight({show: false})

		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(inventoryYebActions.getInventoryYebInitData())
		}
	}
    render(){
        const {
            dispatch,
            allState,
            inventoryYebState,
            history
        } = this.props

        const issues = allState.get('issues')
        const issuedate =inventoryYebState.get('issuedate')
        const endissuedate =inventoryYebState.get('endissuedate')
        const idx = issues.findIndex(v => v.get('value') === issuedate)
        const nextperiods = issues.slice(0, idx)
        const dataList = inventoryYebState.get('dataList')
        const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])
        const stockQuabtityList = inventoryYebState.get('stockQuabtityList')
        const stockQuantity = inventoryYebState.get('stockQuantity')
        const stockQuantityName = inventoryYebState.get('stockQuantityName')
        const stockCategoryList = inventoryYebState.get('stockCategoryList')
        const stockCategoryValue = inventoryYebState.get('stockCategoryValue')
        const stockCategorylabel = inventoryYebState.get('stockCategorylabel')
        const stockStoreList = inventoryYebState.get('stockStoreList')
        const stockStoreValue = inventoryYebState.get('stockStoreValue')
        const stockStoreLabel = inventoryYebState.get('stockStoreLabel')
        const topCategoryUuid = inventoryYebState.get('topCategoryUuid')
        const subCategoryUuid = inventoryYebState.get('subCategoryUuid')
        const showChildList = inventoryYebState.get('showChildList')
        const chooseValue = inventoryYebState.get('chooseValue')
        const inventoryType = inventoryYebState.get('inventoryType')
        const typeList = inventoryYebState.get('typeList')
        const typeListValue = inventoryYebState.get('typeListValue')
        const typeListLabel = inventoryYebState.get('typeListLabel')
        const quantityScale = inventoryYebState.get('quantityScale')
        const priceScale = inventoryYebState.get('priceScale')
        const dateSelectList = [
			{key: '按账期查询', value: 'ISSUE'},
			{key: '按日期查询', value: 'DATE'},
			{key: '按账期区间查询', value: 'ISSUE_RANGE'},
			{key: '按日期区间查询', value: 'DATE_RANGE'}
		]
        const dateCheck = (date) => {
            const issuesList = issues.toJS()
            let issuesEnd = issuesList.shift()['value']
            let issuesStart = issuesList.pop()
            issuesStart = issuesStart ? issuesStart['value'] : issuesEnd
            let issuesEndDay = new Date(issuesEnd.slice(0,4), issuesEnd.slice(5,7), 0)

            let returnValue = false
            if (Date.parse(date) < Date.parse(issuesStart) || Date.parse(date) > Date.parse(issuesEndDay)) {
                thirdParty.Alert('请选择账期内的日期', '好的')
                returnValue = true
            }
            return returnValue
        }
        // export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendInventoryYebExcel', {
			begin: begin,
			end: end,
            topCategoryUuid,
            subCategoryUuid,
            storeCardUuid:stockStoreValue,
            isType:inventoryType === 'Other',
            acId:typeListValue?typeListValue:'',
		}))

		dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))
        return(
            <Container className="inventoryYeb">
                <MutiPeriodMoreSelect
					start={issuedate}
					issues={issues} //默认显示日期
					end={endissuedate}
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
                        dispatch(inventoryYebActions.setInventoryYebDate(value,''))
                        dispatch(inventoryYebActions.getInventoryYebSelectedStockCategory(value,''))
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
                        dispatch(inventoryYebActions.setInventoryYebDate(value1,value2))
                        dispatch(inventoryYebActions.getInventoryYebSelectedStockCategory(value1,value2))
					}}
					changeChooseValue={(value)=>{
                        dispatch(inventoryYebActions.changeInventoryChooseValue(value))
                    }}
				/>
                <Row className='inventoryYeb-search'>
                    <div className="select-change-table" onClick={()=> {
                        dispatch(inventoryYebActions.changeInventoryYebType(inventoryType))
                        dispatch(inventoryYebActions.getInventoryYebSelectedStockCategory(issuedate,endissuedate))
                    }}>
                        <span>{inventoryType === 'Inventory' ? '库存' : '其他类型'}</span>
                        <XfnIcon type='type-change' />
                    </div>
                    {/*{stockQuabtityList.length>0 &&
                        <Single
                            className='inventoryYeb-stock-quantity'
                            district={stockQuabtityList}
                            value={stockQuantity}
                            onOk={value=>{
                                dispatch(inventoryYebActions.setStockQuantityValue(value.label,value.value))
                                dispatch(inventoryYebActions.getInventoryYebSelectedStockCategory(value.value))
                            }}
                        >
                            <Row className='stock-quantity'>
                                <span className='overElli'>{stockQuantityName==="全部"?"全部存货":stockQuantityName}</span>
                                <Icon type="triangle" />
                            </Row>
                        </Single>
                    }*/}
                    <ChosenPicker
                        className='inventoryYeb-stock-catogory'
                        district={stockCategoryList}
                        title='请选择存货类别'
                        parentDisabled={false}
                        value={stockCategoryValue}
                        onChange={(item) => {
                            const valueList = item.key.split(Limit.TREE_JOIN_STR)
                            const topCategoryUuid =item.key.split(Limit.TREE_JOIN_STR)[1]
                            const subCategoryUuid=item.key.split(Limit.TREE_JOIN_STR)[item.key.split(Limit.TREE_JOIN_STR).length-1]

                            if(topCategoryUuid===subCategoryUuid){
                                dispatch(inventoryYebActions.setStockCategoryUuid(item.key,item.label,topCategoryUuid,''))
                                dispatch(inventoryYebActions.getInventoryYebSeclectedStockStore(topCategoryUuid,''))
                            }else{
                                dispatch(inventoryYebActions.setStockCategoryUuid(item.key,item.label,topCategoryUuid,subCategoryUuid))
                                dispatch(inventoryYebActions.getInventoryYebSeclectedStockStore(topCategoryUuid,subCategoryUuid))
                            }
                        }}
                    >
                        <Row className='stock-category-label'>
                            <span className='overElli'>{stockCategorylabel}</span>
                            <Icon type="triangle" />
                        </Row>
                    </ChosenPicker>
                    {stockStoreList.length >0 &&
                        <ChosenPicker
                            className='inventoryYeb-stock-store'
                            district={stockStoreList}
                            parentDisabled={false}
                            title='请选择仓库'
                            value={stockStoreValue}
                            onChange={(item) => {
                                dispatch(inventoryYebActions.setStockStoreValue(item.key,item.label))
                                if(inventoryType === 'Inventory'){
                                    dispatch(inventoryYebActions.getInventoryYebSelectedList(topCategoryUuid,subCategoryUuid,item.key))
                                }else{
                                    dispatch(inventoryYebActions.getInventoryYebTypeList(topCategoryUuid,subCategoryUuid,item.key))
                                }

                            }}
                        >
                            <Row className='stock-store-label'>
                                <span className='overElli'>{stockStoreLabel==="全部"?"全部仓库":stockStoreLabel}</span>
                                <Icon type="triangle" />
                            </Row>
                        </ChosenPicker>
                    }
                    {inventoryType=='Other'&&
                        <ChosenPicker
                            className='inventoryYeb-type-list'
                            district={typeList}
                            parentDisabled={false}
                            title='请选择类型'
                            value={typeListValue}
                            onChange={(item)=>{
                                dispatch(inventoryYebActions.setTypeListValue(item.key,item.label))
                                dispatch(inventoryYebActions.getInventoryYebSelectedList(topCategoryUuid,subCategoryUuid,stockStoreValue,item.key))
                            }}
                        >
                            <Row className='type-list-label'>
                                <span className='overElli'>{typeListLabel}</span>
                                <Icon type="triangle" />
                            </Row>
                        </ChosenPicker>
                    }
                </Row>
                <Row className='ba-title'>
                    <div className='ba-title-item'>期初余额</div>
                    <div className='ba-title-item'>{inventoryType=='Other'?'本期借方':'本期入库'}</div>
                    <div className='ba-title-item'>{inventoryType=='Other'?'本期贷方':'本期出库'}</div>
                    <div className='ba-title-item'>期末余额</div>
                </Row>
                <ScrollView  flex="1" uniqueKey="inventoryYeb-scroll" savePosition>
                    {dataList.map((data,index)=>{
                        return(
                            <Item
                                unitDecimalCount={unitDecimalCount}
                                key={index}
                                data={data}
                                history={history}
                                dispatch={dispatch}
                                issuedate={issuedate}
                                endissuedate={endissuedate}
                                stockCategoryValue={stockCategoryValue}
                                topCategoryUuid={topCategoryUuid}
                                subCategoryUuid={subCategoryUuid}
                                stockCategoryList={stockCategoryList}
                                stockQuantity={stockQuantity}
                                stockStoreList={stockStoreList}
                                stockStoreValue={stockStoreValue}
                                stockStoreLabel={stockStoreLabel}
                                showChildList={showChildList}
                                chooseValue={chooseValue}
                                inventoryType={inventoryType}
                                typeListValue={typeListValue}
                                typeListLabel={typeListLabel}
                                stockCategorylabel={stockCategorylabel}
                                quantityScale={quantityScale}
                                priceScale={priceScale}
                            />
                        )
                    })}
                </ScrollView>
            </Container >
        )
    }
}
