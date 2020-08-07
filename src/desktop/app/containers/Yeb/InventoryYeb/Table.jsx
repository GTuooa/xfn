import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { TableScrollWrap, TableScroll, TableBody, TableAll, TablePagination,TableWrap,TableItem ,Amount} from 'app/components'
import { Icon } from 'antd'
import TableTitle from './TableTitle'
import TableItems from './TableItem'
@immutableRenderDecorator
export default
class Table extends React.Component {
    render(){
        const{dispatch,isShow,inventoryData,baseData,issuedate,endissuedate,categoryValue,storeCardUuid,showChildList,chooseValue,
            inventoryType,typeList,typeListValue,quantityScale,priceScale}=this.props
        const ulName = isShow ? 'spread' : 'noSpread'


        return(
            <TableWrap type="yeb-one" notPosition={true}>
                <TableAll type="kcyeb" newTable={'true'}>
                    <TableTitle
                        isShow={isShow}
                        dispatch={dispatch}
                        inventoryType={inventoryType}
                        quantityScale={quantityScale}
                        priceScale={priceScale}
                    />
                    <TableBody>
                        {inventoryData.map((data,index)=>{
                            return(
                                <TableItems
                                    key={index}
                                    idx={index}
                                    data={data}
                                    isShow={isShow}
                                    dispatch={dispatch}
                                    className={inventoryType==='Other'?`inventoryyeb-table-width-${ulName}-other`:`inventoryyeb-table-width-${ulName}`}
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
                            )
                        })}
                        <TableItem line={inventoryData.length + 1} className={inventoryType==='Other'?`inventoryyeb-table-width-${ulName}-other`:`inventoryyeb-table-width-${ulName}`}>
                            <li className="inventoryyeb-table-one">
                                <div>本期合计</div>
                            </li>
                            <li className="inventoryyeb-table-two">{baseData.unitName?baseData.unitName:''}</li>
                            <li className="inventoryyeb-table-three">
                                <div className={inventoryType==='Other'?"inventoryyeb-table-item-other":"inventoryyeb-table-item"}>
                                    {inventoryType==="Other"&&<div>{baseData.allBeginDirection==='debit'?"借":"贷"}</div>}
                                    <Amount decimalPlaces={Number(quantityScale)}>{baseData.allBeginQuantity}</Amount>
                                    <Amount decimalPlaces={Number(priceScale)}>{baseData.allBeginPrice}</Amount>
                                    <Amount>{baseData.allBeginAmount}</Amount>
                                </div>
                            </li>
                            <li className="inventoryyeb-table-four">
                                <div className="inventoryyeb-table-item">
                                    <Amount decimalPlaces={Number(quantityScale)}>{baseData.allMonthInQuantity}</Amount>
                                    <Amount>{baseData.allMonthInAmount}</Amount>
                                </div>
                            </li>
                            <li className="inventoryyeb-table-four">
                                <div className="inventoryyeb-table-item">
                                    <Amount decimalPlaces={Number(quantityScale)}>{baseData.allMonthOutQuantity}</Amount>
                                    <Amount>{baseData.allMonthOutAmount}</Amount>
                                </div>
                            </li>
                            <li className="inventoryyeb-table-six">
                                <div className={inventoryType==='Other'?"inventoryyeb-table-item-other":"inventoryyeb-table-item"}>
                                    {inventoryType==="Other"&&<div>{baseData.allEndDirection==='debit'?"借":"贷"}</div>}
                                    <Amount decimalPlaces={Number(quantityScale)}>{baseData.allEndQuantity}</Amount>
                                    <Amount decimalPlaces={Number(priceScale)}>{baseData.allEndPrice}</Amount>
                                    <Amount>{baseData.allEndAmount}</Amount>
                                </div>
                            </li>
                        </TableItem>
                    </TableBody>
                </TableAll>
            </TableWrap>
        )
    }
}
