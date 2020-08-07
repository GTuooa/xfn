import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { fromJS, Map, List }	from 'immutable'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { TableWrap } from 'app/components'
import { Select, Button, Checkbox ,Input, Radio} from 'antd'
import { Icon } from 'app/components'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;
import Table from './Table'
import TreeContain from './TreeContain'
import './style.less'
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import { ROOT } from 'app/constants/fetch.account.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { Export, Tab } from 'app/components'
import StockStoreTree from './StockStoreTree'
import SerialDrawer from './SerialDrawer'
@connect(state => state)
export default
class InventoryMxb extends React.Component {
    componentDidMount(){
        const previousPage = sessionStorage.getItem('previousPage')
        if (previousPage === 'home') {
            sessionStorage.setItem('previousPage', '')
            this.props.dispatch(inventoryMxbActions.getInventoryMxbInitData())
        }
    }
    shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.inventoryMxbState != nextprops.inventoryMxbState || this.props.homeState != nextprops.homeState
	}
    render(){
        const { allState, inventoryMxbState, dispatch, homeState } = this.props
        const chooseperiods = inventoryMxbState.get('chooseperiods')
        const accountIssues = allState.get('accountIssues')
        const issuedate = inventoryMxbState.get('issuedate')
        const endissuedate = inventoryMxbState.get('endissuedate')
        const idx = accountIssues.findIndex(v => v === issuedate)
        const nextperiods = accountIssues.slice(0, idx)
        const cardList = inventoryMxbState.get('cardList')
        const dataList = inventoryMxbState.get('dataList')
        const balanceData = inventoryMxbState.get('balanceData')
        const categoryList = inventoryMxbState.get('categoryList')
        const categoryValue = inventoryMxbState.get('categoryValue')
        const cardValue = inventoryMxbState.get('cardValue')
        const stockStoreList = inventoryMxbState.get('stockStoreList')
        const stockStoreValue = inventoryMxbState.get('stockStoreValue')
        const stockStoreLabel = inventoryMxbState.get('stockStoreLabel')
        const topCategoryUuid = inventoryMxbState.get('topCategoryUuid')
        const subCategoryUuid = inventoryMxbState.get('subCategoryUuid')
        const jrAbstract = inventoryMxbState.get('jrAbstract')
        const chooseValue = inventoryMxbState.get('chooseValue')
        const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        const isPlay = homeState.getIn(['views', 'isPlay'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
        const moduleInfo = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo'])
        const enableWarehouse = moduleInfo.indexOf('WAREHOUSE') > -1
        const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
        const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
        const inventoryType = inventoryMxbState.get('inventoryType')
        const typeList = inventoryMxbState.get('typeList')
        const typeListValue = inventoryMxbState.get('typeListValue')
        const otherTypeStockStoreList = inventoryMxbState.get('otherTypeStockStoreList')
        const otherTypeStockStoreValue = inventoryMxbState.get('otherTypeStockStoreValue')
        const allBalanceDirection = inventoryMxbState.get('allBalanceDirection')
        const balanceChanged = inventoryMxbState.get('balanceChanged')
        const quantityScale = inventoryMxbState.get('quantityScale')
        const priceScale = inventoryMxbState.get('priceScale')

        const showAssist = inventoryMxbState.get('showAssist')
        const showBatch = inventoryMxbState.get('showBatch')
        const modalName = inventoryMxbState.get('modalName')
        const batchList = inventoryMxbState.get('batchList')
        const curSelectBatchUuid = inventoryMxbState.get('curSelectBatchUuid')
        const chooseBatchCard = inventoryMxbState.get('chooseBatchCard')
        const assistList = inventoryMxbState.get('assistList')
        const curSelectAssistUuid = inventoryMxbState.get('curSelectAssistUuid')
        const chooseAssistCard = inventoryMxbState.get('chooseAssistCard')
        const stockCardMessage = inventoryMxbState.get('stockCardMessage')
        const serialList = inventoryMxbState.get('serialList')
        const serialFollow = inventoryMxbState.get('serialFollow')
        // const showSerialDrawer = inventoryMxbState.get('showSerialDrawer')
        const curInOrOut = inventoryMxbState.get('curInOrOut')
        const chooseSerialUuid = inventoryMxbState.get('chooseSerialUuid')
        const mxbSerialDrawerVisibility = allState.getIn(['views', 'mxbSerialDrawerVisibility'])

		const cardPages = inventoryMxbState.get('cardPages')
		const cardPageNum = inventoryMxbState.get('cardPageNum')
		const detailCurrentPage = inventoryMxbState.get('detailCurrentPage')
		const detailPages = inventoryMxbState.get('detailPages')

        return(
            <ContainerWrap type="mxb-three" className="inventoryMxb">

                <div
                    style={{height: '100%'}}
                >
                <FlexTitle>
                    <div className="flex-title-left">
                        <MutiPeriodMoreSelect
                            issuedate={issuedate}
                            endissuedate={endissuedate}
                            issues={accountIssues}
                            chooseValue={chooseValue}
                            changeChooseperiodsStatu={(value) => {
                                dispatch(inventoryMxbActions.handleInventoryMxbChooseStatus(value))
                            }}
                            changePeriodCallback={(value1, value2) => {
                                dispatch(inventoryMxbActions.changeDetailCurrentPages(1))
                                dispatch(inventoryMxbActions.setInventoryMxbDate(value1, value2))
                                if(inventoryType==='Inventory'){
                                    dispatch(inventoryMxbActions.getInventoryMxbStockCategoryTree(value1, value2))
                                }else{
                                    dispatch(inventoryMxbActions.getOtherTypeStockStore())
                                }
                            }}
                        />
                        <span className="inventorymxbType-change">
                            <Tab
                                radius
                                tabList={[{key:'Inventory',value:'库存'},{key:'Other',value:'其他类型'}]}
                                activeKey={inventoryType}
                                tabFunc={(v) => {
                                    dispatch(inventoryMxbActions.changeInventoryMxbType(v.key))
                                    dispatch(inventoryMxbActions.changeOtherTypeBalanceDirection(allBalanceDirection == 'debit' ? 'credit' : 'debit',false))
                                    if(v.key === 'Inventory'){
                                       dispatch(inventoryMxbActions.getInventoryMxbStockCategoryTree(issuedate, endissuedate))
                                    }else{
                                         dispatch(inventoryMxbActions.getOtherTypeStockStore())
                                         //dispatch(inventoryMxbActions.getOtherTypeMxbDataList(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid,cardValue,typeListValue==="全部"?'':typeListValue))
                                    }
                                }}
                            />
                        </span>
                        <div className="inventory-mxb-search">
                            <span>摘要：</span>
                            <span>
                                {
                                    jrAbstract ?
                                    <Icon className="normal-search-delete" type="close-circle" theme='filled'
                                        onClick={() => {
                                            dispatch(inventoryMxbActions.changeJrAbstract(''))
                                            dispatch(inventoryMxbActions.changeDetailCurrentPages(1))
                                            if(inventoryType==='Other'){
                                                dispatch(inventoryMxbActions.getOtherTypeMxbDataList(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid,cardValue,typeListValue==="全部"?'':typeListValue,detailCurrentPage))
                                            }else{
                                                dispatch(inventoryMxbActions.getInventoryMxbData(topCategoryUuid,subCategoryUuid,cardValue,stockStoreValue))
                                            }
                                        }}
                                    /> : null
                                }
                                <Icon className="cxpz-serch-icon" type="search"
                                    onClick={() => {
                                        dispatch(inventoryMxbActions.changeDetailCurrentPages(1))
                                        if(inventoryType==='Other'){
                                            dispatch(inventoryMxbActions.getOtherTypeMxbDataList(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid,cardValue,typeListValue==="全部"?'':typeListValue,detailCurrentPage))
                                        }else{
                                            dispatch(inventoryMxbActions.getInventoryMxbData(topCategoryUuid,subCategoryUuid,cardValue,stockStoreValue))
                                        }
                                    }}
                                />
                                <Input
                                    className="inventory-mxb-search-abstract"
                                    placeholder="根据摘要搜索流水"
                                    value={jrAbstract}
                                    onChange={(e)=>{
                                        dispatch(inventoryMxbActions.changeJrAbstract(e.target.value))
                                    }}
                                    onPressEnter={()=>{
                                        dispatch(inventoryMxbActions.changeDetailCurrentPages(1))
                                        if(inventoryType==='Other'){
                                            dispatch(inventoryMxbActions.getOtherTypeMxbDataList(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid,cardValue,typeListValue==="全部"?'':typeListValue,detailCurrentPage))
                                        }else{
                                            dispatch(inventoryMxbActions.getInventoryMxbData(topCategoryUuid,subCategoryUuid,cardValue,stockStoreValue))
                                        }
                                    }}
                                />
                            </span>
                        </div>
                        {otherTypeStockStoreList.length>0 && inventoryType==="Other" &&
                            <span className="inventorymxbdepot-select">
                                <span className="asskmyebdepot-select-title">仓库：</span>
                                <span>
                                    <StockStoreTree
                                        className="inventorymxbdepot-select-item"
                                        value={otherTypeStockStoreValue}
                                        stockStoreList={otherTypeStockStoreList}
                                        onChange={(value,label) => {
                                            dispatch(inventoryMxbActions.changeDetailCurrentPages(1))
                                            dispatch(inventoryMxbActions.setOtherTypeStockStoreValue(value))
                                            dispatch(inventoryMxbActions.getOtherTypeStockCategory(value))
                                        }}
                                    />
                                </span>
                            </span>
                        }
                    </div>
                    <div className="flex-title-right">
                        <span className="title-right title-dropdown">
                            <Export
                                isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
                                type="fifth"
                                exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

                                excelDownloadUrl={`${ROOT}/jr/excel/export/stock/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&topCategoryUuid=${topCategoryUuid}&subCategoryUuid=${subCategoryUuid}&storeCardUuid=${inventoryType==='Other'?otherTypeStockStoreValue:stockStoreValue}&stockCardUuid=${cardValue ? cardValue : ''}&exportAll=false&isType=${inventoryType==='Other'}&acId=${typeListValue==="全部"?'':typeListValue}`}
                                ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendInventortMxbStockBalance', {begin: begin, end: end,topCategoryUuid: topCategoryUuid,subCategoryUuid:subCategoryUuid,storeCardUuid:inventoryType==='Other'?otherTypeStockStoreValue:stockStoreValue,stockCardUuid:cardValue ? cardValue : '',exportAll:false,isType:inventoryType==='Other',acId:typeListValue==="全部"?'':typeListValue}))}

                                allexcelDownloadUrl={`${ROOT}/jr/excel/export/stock/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&topCategoryUuid=${topCategoryUuid}&subCategoryUuid=${subCategoryUuid}&storeCardUuid=${inventoryType==='Other'?otherTypeStockStoreValue:stockStoreValue}&stockCardUuid=${cardValue ? cardValue : ''}&exportAll=true&isType=${inventoryType==='Other'}&acId=${typeListValue==="全部"?'':typeListValue}`}
                                allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendInventortMxbStockBalance', {begin: begin, end: end,topCategoryUuid: topCategoryUuid,subCategoryUuid:subCategoryUuid,storeCardUuid:inventoryType==='Other'?otherTypeStockStoreValue:stockStoreValue,stockCardUuid:cardValue ? cardValue : '',exportAll:true,isType:inventoryType==='Other',acId:typeListValue==="全部"?'':typeListValue}))}

                                onErrorSendMsg={(type, valueFirst, valueSecond) => {
                                    dispatch(allActions.sendMessageToDeveloper({
                                        title: '导出发送钉钉文件异常',
                                        message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
                                        remark: '库存明细表',
                                    }))
                                }}
                            />
                        </span>
                        <Button
                            className="title-right"
                            type="ghost"
                            onClick={() => {
                                if(inventoryType==='Other'){
                                    dispatch(inventoryMxbActions.getOtherTypeStockStore())
                                }else{
                                    dispatch(inventoryMxbActions.refreshInventoryMxbList())
                                }
                            }}
                        >
                            刷新
                        </Button>
                    </div>
                </FlexTitle>
                <TableWrap notPosition={true}>
                    <Table
                        dispatch={dispatch}
                        dataList={dataList}
                        balanceData={balanceData}
                        inventoryType={inventoryType}
                        allBalanceDirection={allBalanceDirection}
                        balanceChanged={balanceChanged}
                        typeListValue={typeListValue}
                        quantityScale={quantityScale}
                        priceScale={priceScale}
                        showBatch={showBatch}
                        showAssist={showAssist}
                        modalName={modalName}
                        curSelectBatchUuid={curSelectBatchUuid}
                        chooseBatchCard={chooseBatchCard}
                        batchList={batchList}
                        curSelectAssistUuid={curSelectAssistUuid}
                        chooseAssistCard={chooseAssistCard}
                        assistList={assistList}
                        begin={begin}
                        end={end}
                        stockCardMessage={stockCardMessage}
                        storeCardUuid={stockStoreValue}
                        isType={inventoryType}
                        serialList={serialList}
                        mxbSerialDrawerVisibility={mxbSerialDrawerVisibility}
                        detailCurrentPage={detailCurrentPage}
                        detailPages={detailPages}
                        refreshInventoryMxbList={()=>{
                            if(inventoryType==='Other'){
                                dispatch(inventoryMxbActions.getOtherTypeStockStore())
                            }else{
                                dispatch(inventoryMxbActions.refreshInventoryMxbList())
                            }
                        }}
                        paginationCallBack={()=>{
                            if(inventoryType==='Other'){
                                dispatch(inventoryMxbActions.getOtherTypeStockStore())
                            }else{
                                dispatch(inventoryMxbActions.refreshInventoryMxbList())
                            }
                        }}
                    />
                    <TreeContain
                        dispatch={dispatch}
                        categoryList={categoryList}
                        cardList={cardList}
                        cardValue={cardValue}
                        categoryValue={categoryValue}
                        stockStoreList={stockStoreList}
                        stockStoreValue={stockStoreValue}
                        stockStoreLabel={stockStoreLabel}
                        topCategoryUuid={topCategoryUuid}
                        subCategoryUuid={subCategoryUuid}
                        inventoryType={inventoryType}
                        typeList={typeList}
                        typeListValue={typeListValue}
                        otherTypeStockStoreValue={otherTypeStockStoreValue}
                        stockCardMessage={stockCardMessage}
						cardPages={cardPages}
						cardPageNum={cardPageNum}
                    />
                </TableWrap>
                </div>
                {
                    mxbSerialDrawerVisibility ?
                    <SerialDrawer
                        dispatch={dispatch}
                        serialFollow={serialFollow}
                        serialList={serialList}
                        // showSerialDrawer={showSerialDrawer}
                        chooseSerialUuid={chooseSerialUuid}
                        stockCardMessage={stockCardMessage}
                        enableWarehouse={enableWarehouse}
                        refreshInventoryMxbList={()=>{
                            if(inventoryType==='Other'){
                                dispatch(inventoryMxbActions.getOtherTypeStockStore())
                            }else{
                                dispatch(inventoryMxbActions.refreshInventoryMxbList())
                            }
                        }}
                    /> : ''
                }

            </ContainerWrap>
        )
    }
}
