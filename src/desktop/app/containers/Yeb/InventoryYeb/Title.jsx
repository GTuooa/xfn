import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { Button, Select, Checkbox ,Input,Radio } from 'antd'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import * as inventoryActions from "app/redux/Yeb/InventoryYeb/inventory.action.js"
const { Option } = Select;
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import StockQuantityTree from './StockQuantityTree'
import StockStoreTree from './StockStoreTree'
import StockTree from './StockTree'
import TypeListTree from './TypeListTree'
import { ROOT } from 'app/constants/fetch.account.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { Export, Tab } from 'app/components'

@immutableRenderDecorator
export default
class Title extends React.Component {
    render(){
        const{issues,choosePeriods,dispatch,issuedate,endissuedate,nextperiods,chooseValue,reportPermissionInfo,URL_POSTFIX,isPlay,inventoryType,
            quantityList,categoryList,stockStoreList,stockQuantity,storeCardUuid,topCategoryUuid,subCategoryUuid,categoryValue,typeListValue,typeList}=this.props
        const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
        const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
        return(
            <FlexTitle>
                <div className="flex-title-left">
                    {/*<Select
                        className="title-date"
                        value={issuedate}
                        onChange={(value) =>{
                            dispatch(inventoryActions.changeInventoryYebDate(value,value))
                            dispatch(inventoryActions.getQuantityList(value,value))
                        }}>
                        {issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
                    </Select>
                    <span className="title-checkboxtext" >
                        <Checkbox className="title-checkbox" checked={choosePeriods} onClick={() => {
                            if (choosePeriods && endissuedate !== issuedate) {
                                dispatch(inventoryActions.changeInventoryYebDate(issuedate, issuedate))
                                dispatch(inventoryActions.getQuantityList(issuedate, issuedate))
                            }
                            dispatch(inventoryActions.changeInventoryChoosePeridos())
                        }}></Checkbox>
                        <span>至</span>
                    </span>
                    <Select
                        disabled={!choosePeriods}
                        className="title-date"
                        value={endissuedate === issuedate ? '' : endissuedate}
                        onChange={(value) =>{
                            dispatch(inventoryActions.changeInventoryYebDate(issuedate,value))
                            dispatch(inventoryActions.getQuantityList(issuedate,value))
                        }}>
                        {nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                    </Select>*/}
                    <MutiPeriodMoreSelect
						issuedate={issuedate}
						endissuedate={endissuedate}
						issues={issues}
						chooseValue={chooseValue}
						changeChooseperiodsStatu={(value) => {
                            dispatch(inventoryActions.handleInventoryYebChooseStatus(value))
                        }}
						changePeriodCallback={(value1, value2) => {
                            dispatch(inventoryActions.changeInventoryYebDate(value1, value2))
                            dispatch(inventoryActions.getQuantityList(value1, value2))
						}}
					/>
                    <span className="inventoryyebType-change">
                        <Tab
                            radius
                            tabList={[{key:'Inventory',value:'库存'},{key:'Other',value:'其他类型'}]}
                            activeKey={inventoryType}
                            tabFunc={(v) => {
                                dispatch(inventoryActions.changeInventoryType(v.key))
                                dispatch(inventoryActions.getQuantityList(issuedate,endissuedate))
                            }}
                        />
                        {/* <RadioGroup
                            value={inventoryType}
                            onChange={(e)=>{
                                dispatch(inventoryActions.changeInventoryType(e.target.value))
                                dispatch(inventoryActions.getQuantityList(issuedate,endissuedate))
                            }}
                        >
                            <RadioButton value="Inventory">库存</RadioButton>
                            <RadioButton value="Other">其他类型</RadioButton>
                        </RadioGroup> */}
                    </span>
                    {quantityList.length>0 &&
                        <span className="inventoryyebdepot-select">
                            <span className="asskmyebdepot-select-title">存货：</span>
                            <span>
                                <StockTree
                                    className="inventoryyebdepot-select-item"
                                    value={stockQuantity}
                                    onChange={(value) => {
                                        dispatch(inventoryActions.setInventoryStockQuantity(value))
                                        dispatch(inventoryActions.getStockCategoryTree(issuedate,endissuedate, value))
                                    }}
                                    quantityList={quantityList}
                                />

                            </span>
                        </span>
                    }
                    <span className="inventoryyebcategory-select">
                        <span className="asskmyebcategory-select-title">存货类别：</span>
                        <span>
                            <StockQuantityTree
                                className="inventoryyebcategory-select-item"
                                categoryList={categoryList}
                                value={categoryValue}
                                onChange={(value,label) => {
                                    const topCategoryUuid = value.split('-')[1]
                                    const subCategoryUuid = value.split('-')[value.split('-').length - 1]
                                    if(value==="全部"){
                                        dispatch(inventoryActions.setCategoryUuid('',''))
                                        dispatch(inventoryActions.getStockStoreTree(issuedate, endissuedate, stockQuantity, '',''))
                                    }else{
                                        if(topCategoryUuid ===subCategoryUuid){
                                            dispatch(inventoryActions.setCategoryUuid(topCategoryUuid,''))
                                            dispatch(inventoryActions.getStockStoreTree(issuedate, endissuedate, stockQuantity, topCategoryUuid,''))

                                        }else{
                                            dispatch(inventoryActions.setCategoryUuid(topCategoryUuid,subCategoryUuid))
                                            dispatch(inventoryActions.getStockStoreTree(issuedate, endissuedate, stockQuantity, topCategoryUuid,subCategoryUuid))
                                        }
                                    }
                                    dispatch(inventoryActions.setCategoryValue(value))
                                }}
                            />
                        </span>
                    </span>
                    {stockStoreList.length>0 &&
                        <span className="inventoryyebdepot-select">
                            <span className="asskmyebdepot-select-title">仓库：</span>
                            <span>
                                <StockStoreTree
                                    className="inventoryyebdepot-select-item"
                                    value={storeCardUuid}
                                    stockStoreList={stockStoreList}
                                    onChange={(value,label) => {
                                        dispatch(inventoryActions.setStoreCardUuid(value))
                                        if(inventoryType==='Other'){
                                            dispatch(inventoryActions.getInventoryTypeList(issuedate,endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,value))
                                        }else{
                                            dispatch(inventoryActions.getInventoryYebSelectedData(issuedate,endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,value,''))
                                        }
                                    }}
                                    />
                            </span>
                        </span>
                    }
                    {inventoryType==='Other' && typeList.length>0 &&
                        <span className="inventoryyebdepot-select">
                            <span className="asskmyebdepot-select-title">类型：</span>
                            <span>
                                <TypeListTree
                                    className="inventoryyebdepot-select-item"
                                    value={typeListValue}
                                    typeList={typeList}
                                    onChange={(value,label)=>{
                                        dispatch(inventoryActions.changeInventoryYebTypeListValue(value))
                                        dispatch(inventoryActions.getInventoryYebSelectedData(issuedate,endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid,value==='全部'?'':value))
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
                            type="first"
                            exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}
                            excelDownloadUrl={`${ROOT}/jr/excel/export/stock/balance?${URL_POSTFIX}&begin=${begin}&end=${end}&topCategoryUuid=${topCategoryUuid}&subCategoryUuid=${subCategoryUuid}&storeCardUuid=${storeCardUuid}&stockQuantity=${stockQuantity}&isType=${inventoryType==='Other'}&acId=${typeListValue==="全部"?'':typeListValue}`}
                            ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendInventortYebStockBalance', {begin: begin, end: end,topCategoryUuid: topCategoryUuid,subCategoryUuid:subCategoryUuid,storeCardUuid:storeCardUuid,stockQuantity:stockQuantity,isType:inventoryType==='Other',acId:typeListValue==="全部"?'':typeListValue}))}
                            onErrorSendMsg={(type, valueFirst, valueSecond) => {
                                dispatch(allActions.sendMessageToDeveloper({
                                    title: '导出发送钉钉文件异常',
                                    message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
                                    remark: '库存余额表',
                                }))
                            }}
                        />
                    </span>
                    <Button
                        className='title-right'
                        type="ghost"
                        onClick={()=>{
                            dispatch(inventoryActions.getQuantityList(issuedate,endissuedate))
                        }}
                    >刷新</Button>
                </div>
            </FlexTitle>
        )
    }
}
