import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { TableItem, TableOver, ItemTriangle, Amount, Price } from 'app/components'
import { Icon ,Tooltip} from 'antd'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
import * as inventoryActions from "app/redux/Yeb/InventoryYeb/inventory.action.js"
@immutableRenderDecorator
export default
class TableItems extends React.Component {
    render(){
        const {
            key,
            idx,
            data,
            isShow,
            dispatch,
            className,
            issuedate,
            endissuedate,
            categoryValue,
            storeCardUuid,
            showChildList,
            chooseValue,
            inventoryType,
            typeList,
            typeListValue,
            quantityScale,
            priceScale,
        }=this.props

        let categoryValueAdd = categoryValue
        const loop =(data, leve, key, parentKey)=>{
            if(data.childList && data.childList.length>0){
                data.parentUuid = [data.uuid].concat(parentKey)

                const showChild = showChildList.indexOf(data.uuid) > -1
                categoryValueAdd = `${categoryValueAdd}-${data.uuid}`

                return(
                    <div key={key}>
                        <TableItem line={idx + 1} className={className}>
                            <ItemTriangle
                                textAlign="left"
                                isLink={true}
                                showTriangle={true}
                                showchilditem={showChild}
                                paddingLeft={`${leve*10+4}px`}
                                onClick={(e) => {
                                    e.stopPropagation()

                                    dispatch(inventoryActions.handleInventoryYebShowChildList(data.uuid, data.parentUuid))
                                }}
                            >
                                <Tooltip title={data.name}>
                                    <span
                                    style={{textAlign:'left',paddingLeft: `${leve*10}px`,cursor: 'pointer'}}
                                    // style={{width:'100%',display:'inline-block',}}
                                    className={`name-name name-click`}
                                    onClick={()=>{
                                        sessionStorage.setItem('previousPage', 'InventoryMx')
                                        dispatch(homeActions.addPageTabPane('MxbPanes', 'InventoryMxb', 'InventoryMxb', '存货明细表'))
                                        dispatch(homeActions.addHomeTabpane('Mxb', 'InventoryMxb', '存货明细表'))
                                        dispatch(inventoryMxbActions.getInventoryMxbDataFromYeb(issuedate,endissuedate ,data.name,null,categoryValueAdd,storeCardUuid,chooseValue,inventoryType,typeList,typeListValue))
                                    }}
                                    >{data.name}</span>
                                </Tooltip>
                            </ItemTriangle>
                            <li className="inventoryyeb-table-two">{data.unitName}</li>
                            <li className="inventoryyeb-table-three">
                                <div className={inventoryType==="Other"?'inventoryyeb-table-item-other':"inventoryyeb-table-item"}>
                                    {inventoryType==="Other"&&<div>{data.beginDirection==='debit'?"借":"贷"}</div>}
                                    <Amount decimalPlaces={Number(quantityScale)}>{data.beginQuantity}</Amount>
                                    <Amount decimalPlaces={Number(priceScale)}>{data.beginPrice}</Amount>
                                    <Amount>{data.beginAmount}</Amount>
                                </div>
                            </li>
                            <li className="inventoryyeb-table-four">
                                <div className="inventoryyeb-table-item">
                                    <Amount decimalPlaces={Number(quantityScale)}>{data.monthInQuantity}</Amount>
                                    <Amount>{data.monthInAmount}</Amount>
                                </div>
                            </li>
                            <li className="inventoryyeb-table-four">
                                <div className="inventoryyeb-table-item">
                                    <Amount decimalPlaces={Number(quantityScale)}>{data.monthOutQuantity}</Amount>
                                    <Amount>{data.monthOutAmount}</Amount>
                                </div>
                            </li>
                            <li className="inventoryyeb-table-six">
                                <div className={inventoryType==="Other"?'inventoryyeb-table-item-other':"inventoryyeb-table-item"}>
                                    {inventoryType==="Other"&&<div>{data.endDirection==='debit'?"借":"贷"}</div>}
                                    <Amount style={{textAlign:'right'}} decimalPlaces={Number(quantityScale)}>{data.endQuantity}</Amount>
                                    <Amount decimalPlaces={Number(priceScale)}>{data.endPrice}</Amount>
                                    <Amount>{data.endAmount}</Amount>
                                </div>
                            </li>
                        </TableItem>
                        {
                            showChild && data.childList.map((v, i) => loop(v, leve+1, `${key}_${i}`, data.parentUuid))
                        }
                    </div>
                )
            }else{
                return(
                    <TableItem line={idx + 1} className={className} key={key}>
                        <li className="inventoryyeb-table-one">
                            <Tooltip title={data.name}>
                                <span
                                    className="over-ellipsis"
                                    style={{textAlign:'left',paddingLeft: `${leve*10}px`,cursor: 'pointer'}}
                                    onClick={()=>{
                                        sessionStorage.setItem('previousPage', 'InventoryMx')
                                        dispatch(homeActions.addPageTabPane('MxbPanes', 'InventoryMxb', 'InventoryMxb', '存货明细表'))
                                        dispatch(homeActions.addHomeTabpane('Mxb', 'InventoryMxb', '存货明细表'))
                                        dispatch(inventoryMxbActions.getInventoryMxbDataFromYeb(issuedate,endissuedate ,data.name,data.uuid,categoryValue,storeCardUuid,chooseValue,inventoryType,typeList,typeListValue))
                                    }}
                                >
                                    {data.name}
                                </span>
                            </Tooltip>
                        </li>
                        <li className="inventoryyeb-table-two">{data.unitName}</li>
                        <li className="inventoryyeb-table-three">
                            <div className={inventoryType==="Other"?'inventoryyeb-table-item-other':"inventoryyeb-table-item"}>
                                {inventoryType==="Other"&&<div>{data.beginDirection==='debit'?"借":"贷"}</div>}
                                <Amount decimalPlaces={Number(quantityScale)}>{data.beginQuantity}</Amount>
                                <Amount decimalPlaces={Number(priceScale)}>{data.beginPrice}</Amount>
                                <Amount>{data.beginAmount}</Amount>
                            </div>
                        </li>
                        <li className="inventoryyeb-table-four">
                            <div className="inventoryyeb-table-item">
                                <Amount decimalPlaces={Number(quantityScale)}>{data.monthInQuantity}</Amount>
                                <Amount>{data.monthInAmount}</Amount>
                            </div>
                        </li>
                        <li className="inventoryyeb-table-four">
                            <div className="inventoryyeb-table-item">
                                <Amount decimalPlaces={Number(quantityScale)}>{data.monthOutQuantity}</Amount>
                                <Amount>{data.monthOutAmount}</Amount>
                            </div>
                        </li>

                        <li className="inventoryyeb-table-six">
                            <div className={inventoryType==="Other"?'inventoryyeb-table-item-other':"inventoryyeb-table-item"}>
                                {inventoryType==="Other"&&<div>{data.endDirection==='debit'?"借":"贷"}</div>}
                                <Amount style={{textAlign:'right'}} decimalPlaces={Number(quantityScale)}>{data.endQuantity}</Amount>
                                <Amount decimalPlaces={Number(priceScale)}>{data.endPrice}</Amount>
                                <Amount>{data.endAmount}</Amount>
                            </div>
                        </li>
                    </TableItem>
                )
            }

        }
        return loop(data,0,`${idx}`,[])
    }
}
