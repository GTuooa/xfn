import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS, Map, List } from 'immutable'

import { Select, Menu, Pagination }  from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { TableTree, XfnIcon, Icon } from 'app/components'
import CategorySelect from './CategorySelect'
const { Option } = Select;
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
import TypeListTree from './TypeListTree'
import StockTree from './StockTree'
@immutableRenderDecorator
export default
class TreeContain extends React.Component {
    constructor() {
        super()
        this.state = {
            showRunningType: false,
            chooseCategoryValue: '全部',
        }
    }
    render(){
        const {
            dispatch,
            categoryList,
            cardList,
            categoryValue,
            cardValue,
            stockStoreList,
            stockStoreValue,
            topCategoryUuid,
            subCategoryUuid,
            stockStoreLabel,
            inventoryType,
            typeList,
            typeListValue,
            otherTypeStockStoreValue,
            stockCardMessage,
			cardPages,
			cardPageNum,
        }=this.props
        const { chooseCategoryValue } = this.state
        let typeListName = '全部'
        const loop = (data)=>data.map(item=>{
            if(item.acId === typeListValue){
                typeListName =item.name
            }
            if (item.childList && item.childList.length) {
                loop(item.childList)
            }
        })
        loop(typeList)
        return(
            <TableTree className="inventory-mxb-tree-contain">
                <div className="inventory-mxb-relative-category-select">
                    <span className='inventory-mxb-top-name'>存货类别：</span>
                    <span className="inventory-mxb-top-search-select-wrap">
						<span>
                            <CategorySelect
                                className="inventory-mxb-top-search-select "
                                value={categoryValue}
                                categoryList={categoryList}
                                onChange={(value,label)=>{
                                    // dispatch(inventoryMxbActions.changeInventoryMxbCardInit())
                                    const topCategoryUuid = value.split("-")[1]
                                    const subCategoryUuid = value.split("-")[value.split("-").length-1]
                                    this.setState({
                                        chooseCategoryValue: value
                                    })
                                    if(inventoryType==='Other'){
                                        if(value==='全部'){
                                            dispatch(inventoryMxbActions.setCategoryValue(value,'',''))
                                            dispatch(inventoryMxbActions.getOtherTypeStockCardDetail(otherTypeStockStoreValue,'',''))
                                        }else{
                                            if(topCategoryUuid===subCategoryUuid){
                                                dispatch(inventoryMxbActions.setCategoryValue(value,topCategoryUuid,''))
                                                dispatch(inventoryMxbActions.getOtherTypeStockCardDetail(otherTypeStockStoreValue,topCategoryUuid,''))
                                            }else{
                                                dispatch(inventoryMxbActions.setCategoryValue(value,topCategoryUuid,subCategoryUuid))
                                                dispatch(inventoryMxbActions.getOtherTypeStockCardDetail(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid))
                                            }
                                        }
                                    }else{
                                        if(value==='全部'){
                                            dispatch(inventoryMxbActions.setCategoryValue(value,'',''))
                                            dispatch(inventoryMxbActions.getStockDetailCard('',''))
                                        }else{
                                            if(topCategoryUuid===subCategoryUuid){
                                                dispatch(inventoryMxbActions.setCategoryValue(value,topCategoryUuid,''))
                                                dispatch(inventoryMxbActions.getStockDetailCard(topCategoryUuid,''))
                                            }else{
                                                dispatch(inventoryMxbActions.setCategoryValue(value,topCategoryUuid,subCategoryUuid))
                                                dispatch(inventoryMxbActions.getStockDetailCard(topCategoryUuid,subCategoryUuid))
                                            }
                                        }
                                    }

                                }}
                            />
						</span>
                    </span>
                </div>
                <div className="inventory-mxb-relative-search">
                    <Select
                        value={stockCardMessage.get('sockCardName')}
                        showSearch
                        width={'100%'}
                        placeholder="搜索卡片"
                        className="inventory-mxb-relative-select"
                        optionFilterProp="children"
                        notFoundContent="无法找到相应卡片"
                        onSelect={(value,options) => {
                            dispatch(inventoryMxbActions.changeInventoryMxbCardInit())
                            dispatch(inventoryMxbActions.setInventoryCardValue(options.props.label))
                            if(inventoryType==='Other'){
                                dispatch(inventoryMxbActions.getOtherTypeStockTypeList(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid,options.props.label.stockCardUuid))
                            }else{
                                dispatch(inventoryMxbActions.getStockStoreTree(topCategoryUuid,subCategoryUuid,options.props.label.stockCardUuid))
                            }
                        }}
                        showArrow={false}
                    >
                            {cardList.map((data,index)=>{
                                return(
                                    <Option key={index} value={data.sockCardName} label={data}>{data.sockCardName}</Option>
                                )
                            })}
                    </Select>
                    <Icon type="search" className="inventory-mxb-relative-search-icon"/>
                </div>
                <div className={cardPages > 1 ? "inventory-mxb-inventory-card" :  "inventory-mxb-inventory-no-pages"}>
					<div className="mxb-inventory-card-content">
						<div className='inventory-card-content-items'>
							{cardList && cardList.map((v, i) => {
								return (
									<div
										className='inventory-mxb-relative-card-box'
										onClick={() => {
                                            dispatch(inventoryMxbActions.changeInventoryMxbCardInit())
											dispatch(inventoryMxbActions.setInventoryCardValue(v))
											dispatch(inventoryMxbActions.changeDetailCurrentPages(1))
                                            if(inventoryType==='Other'){
                                                dispatch(inventoryMxbActions.getOtherTypeStockTypeList(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid,v.stockCardUuid))
                                            }else{
                                                dispatch(inventoryMxbActions.getStockStoreTree(topCategoryUuid,subCategoryUuid,v.stockCardUuid))
                                            }
										}}
									>
                                        <span className={cardValue === v.stockCardUuid ? "inventory-mxb-relative-card-item inventory-mxb-relative-card-item-cur" : "inventory-mxb-relative-card-item"}>{v.sockCardName}</span>
									</div>
								)
							})}

						</div>
					</div>
                    {
						cardPages > 1 ?
						<div className='inventory-card-pagination'>
						<Pagination
							simple
							current={cardPageNum}
							total={cardPages*10}
							onChange={(value) => {
                                const topCategoryUuid = chooseCategoryValue.split("-")[1]
                                const subCategoryUuid = chooseCategoryValue.split("-")[chooseCategoryValue.split("-").length-1]
                                if(inventoryType==='Other'){
                                    if(chooseCategoryValue==='全部'){
                                        dispatch(inventoryMxbActions.getOtherTypeStockCardDetail(otherTypeStockStoreValue,'','',value))
                                    }else{
                                        if(topCategoryUuid===subCategoryUuid){
                                            dispatch(inventoryMxbActions.getOtherTypeStockCardDetail(otherTypeStockStoreValue,topCategoryUuid,'',value))
                                        }else{
                                            dispatch(inventoryMxbActions.getOtherTypeStockCardDetail(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid,value))
                                        }
                                    }
                                }else{
                                    if(chooseCategoryValue==='全部'){
                                        dispatch(inventoryMxbActions.getStockDetailCard('','',value))
                                    }else{
                                        if(topCategoryUuid===subCategoryUuid){
                                            dispatch(inventoryMxbActions.getStockDetailCard(topCategoryUuid,'',value))
                                        }else{
                                            dispatch(inventoryMxbActions.getStockDetailCard(topCategoryUuid,subCategoryUuid,value))
                                        }
                                    }
                                }
							}}
						/>
						</div>: ''

					}
                </div>
                {stockStoreList.length>0 && inventoryType==="Inventory" &&
                    <div className="inventory-mxb-relative-category-select">
                        <span className='inventory-mxb-category-type'>{`仓库：${stockStoreLabel}`} </span>
                        <span
                            className="inventory-mxb-hide-icon"
                            onClick={() => {
                                this.setState({showRunningType: !this.state.showRunningType})
                            }}
                            >
                            <XfnIcon type={this.state.showRunningType ? "double-down" : 'double-up'} className='inventory-mxb-arrow-icon'/>
                        </span>
                    </div>
                }
                {stockStoreList.length>0 && inventoryType==="Inventory" &&
                    <div style={{display: this.state.showRunningType ? '' : 'none'}}  className="inventory-mxb-inventory-no-pages">
                        <div className="mxb-inventory-card-content">
                            <div className='inventory-mxb-stock-tree '>
                                <StockTree
                                    stockStoreList={stockStoreList}
                                    dispatch={dispatch}
                                    stockStoreValue={stockStoreValue}
                                    onClick={(uuid,name)=>{
                                        // dispatch(inventoryMxbActions.changeInventoryMxbCardInit())
                                        dispatch(inventoryMxbActions.changeDetailCurrentPages(1))
                                        dispatch(inventoryMxbActions.setStockStoreValue(uuid,name))
                                        dispatch(inventoryMxbActions.getInventoryMxbData(topCategoryUuid,subCategoryUuid,cardValue,uuid))
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                }
                {inventoryType==="Other" &&
                    <div className="inventory-mxb-relative-category-select">
                        <span className='inventory-mxb-category-type'>{`类型：${typeListName}`} </span>
                        <span
                            className="inventory-mxb-hide-icon"
                            onClick={() => {
                                this.setState({showRunningType: !this.state.showRunningType})
                            }}
                            >
                            <XfnIcon type={this.state.showRunningType ? "double-down" : 'double-up'} className='inventory-mxb-arrow-icon'/>
                        </span>
                    </div>
                }
                {inventoryType==="Other" &&
                    <div style={{display: this.state.showRunningType ? '' : 'none'}}  className="inventory-mxb-inventory-no-pages">
                        <div className="mxb-inventory-card-content">
                            <div className='inventory-mxb-stock-tree '>
                                <TypeListTree
                                    typeList={typeList}
                                    typeListValue={typeListValue}
                                    dispatch={dispatch}
                                    onClick={(item)=>{
                                        if (item.length === 0) {
                                            return
                                        }
                                         // dispatch(inventoryMxbActions.changeInventoryMxbCardInit())
                                         dispatch(inventoryMxbActions.changeDetailCurrentPages(1))
                                         dispatch(inventoryMxbActions.setOtherTypeListValue(item[0]))
                                         dispatch(inventoryMxbActions.getOtherTypeMxbDataList(otherTypeStockStoreValue,topCategoryUuid,subCategoryUuid,cardValue,item[0]==='全部'?'':item[0]))
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                }
            </TableTree>
        )
    }
}
