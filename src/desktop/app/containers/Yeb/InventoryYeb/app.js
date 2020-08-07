import React from 'react'
import { connect } from 'react-redux'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import Table from './Table'
import Title from './Title'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import * as inventoryActions from "app/redux/Yeb/InventoryYeb/inventory.action.js"
import './style/style.less'

@connect(state => state)
export default
class InventoryYeb extends React.Component {
    constructor(props){
        super(props)
        this.state={}
    }
    componentDidMount(){
        this.props.dispatch(inventoryActions.getInventoryYebData())
    }
    shouldComponentUpdate(nextprops) {
		return this.props.allState !== nextprops.allState || this.props.inventoryYebState !== nextprops.inventoryYebState || this.props.homeState !== nextprops.homeState
	}
    render(){
        const { dispatch, allState, homeState, inventoryYebState } = this.props;
        const accountIssues = allState.get('accountIssues')
        const isShow = inventoryYebState.get("isShow")
        const choosePeriods = inventoryYebState.get("choosePeriods")
        const issuedate = inventoryYebState.get('issuedate')
        const endissuedate = inventoryYebState.get('endissuedate')
        const idx = accountIssues.findIndex(v => v === issuedate)
        const inventoryData = inventoryYebState.get('inventoryData')
        const nextperiods = accountIssues.slice(0, idx)
        const baseData = inventoryYebState.get('baseData')
        const quantityList = inventoryYebState.get('quantityList')
        const categoryList = inventoryYebState.get('categoryList')
        const stockStoreList = inventoryYebState.get('stockStoreList')
        const stockQuantity = inventoryYebState.get('stockQuantity')
        const storeCardUuid = inventoryYebState.get('storeCardUuid')
        const topCategoryUuid = inventoryYebState.get('topCategoryUuid')
        const subCategoryUuid = inventoryYebState.get('subCategoryUuid')
        const categoryValue = inventoryYebState.get('categoryValue')
        const showChildList = inventoryYebState.get('showChildList')
        const chooseValue = inventoryYebState.get('chooseValue')
        const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
        const isPlay = homeState.getIn(['views', 'isPlay'])
        const inventoryType = inventoryYebState.get('inventoryType')
        const typeList = inventoryYebState.get('typeList')
        const typeListValue = inventoryYebState.get('typeListValue')
        const quantityScale = inventoryYebState.get('quantityScale')
        const priceScale = inventoryYebState.get('priceScale')
        return(
            <ContainerWrap type="fjgl-one" className="inventory-yeb">
                <Title
                    issues={accountIssues}
                    dispatch={dispatch}
                    choosePeriods={choosePeriods}
                    issuedate={issuedate}
                    endissuedate={endissuedate}
                    nextperiods={nextperiods}
                    quantityList={quantityList}
                    categoryList={categoryList}
                    stockStoreList={stockStoreList}
                    stockQuantity={stockQuantity}
                    storeCardUuid={storeCardUuid}
                    topCategoryUuid={topCategoryUuid}
                    subCategoryUuid={subCategoryUuid}
                    categoryValue={categoryValue}
                    chooseValue={chooseValue}
                    reportPermissionInfo={reportPermissionInfo}
                    URL_POSTFIX={URL_POSTFIX}
                    isPlay={isPlay}
                    inventoryType={inventoryType}
                    typeList={typeList}
                    typeListValue={typeListValue}
                />
                <Table
                    dispatch={dispatch}
                    isShow={isShow}
                    inventoryData={inventoryData}
                    baseData={baseData}
                    issuedate={issuedate}
                    endissuedate={endissuedate}
                    categoryValue={categoryValue}
                    storeCardUuid={storeCardUuid}
                    showChildList={showChildList}
                    chooseValue={chooseValue}
                    inventoryType={inventoryType}
                    typeList={typeList}
                    typeListValue={typeListValue}
                    quantityScale={quantityScale}
                    priceScale={priceScale}

                />
            </ContainerWrap>
        )
    }
}
