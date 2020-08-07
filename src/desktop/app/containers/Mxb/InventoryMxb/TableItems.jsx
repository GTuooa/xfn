import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'
import { Amount, TableItem, TableOver,} from 'app/components'
import { Tooltip, Popover } from 'antd'
import { formatMoney } from 'app/utils'

import { isShowTooltip } from '../MxbModal/CommonFun'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'

@immutableRenderDecorator
export default
class TableItems extends React.Component {
    render(){
        const {
            idx,
            dispatch,
            data,
            className,
            uuidList,
            refreshInventoryMxbList,
            inventoryType,
            allBalanceDirection,
            balanceChanged,
            quantityScale,
            priceScale,
            showAssist,
            showBatch,
            openSerial,
            stockCardMessage,
            serialList,
            mxbSerialDrawerVisibility,
            priceQuantityPlaces,
            balancePlaces,
            index,
            totalSize,
        } = this.props
        return(
            <TableItem line={idx+1} className={className}>
                <Tooltip title={`本页行次：${index}/${totalSize}`}><li>{data.oriDate}</li></Tooltip>
                <TableOver isLink={true}  onClick={e => {
					e.stopPropagation()
                    const fromPage = mxbSerialDrawerVisibility ? 'serialFollow' : 'mxb'
					dispatch(previewRunningActions.getPreviewRunningBusinessFetch(fromJS(data), fromPage,fromJS(uuidList),refreshInventoryMxbList ))
				}}>
                    {data.jrIndex && `${data.jrIndex}号`}
                </TableOver>
                <Tooltip title={`${data.oriAbstract}${data.jrJvCardAbstract}`}>
                    <li style={{ justifyContent: 'left'}}>
                        <span style={{paddingLeft:'4px',textAlign:'left'}}>{`${data.oriAbstract}${data.jrJvCardAbstract}`}</span>
                    </li>
                </Tooltip>
                {

                    showAssist ?
                    <Tooltip title={data.assist ? data.assist : ''}>
                        <li style={{ justifyContent: 'left'}}>
                            <span style={{paddingLeft:'4px',textAlign:'left'}}>{data.assist ? data.assist : ''}</span>
                        </li>
                    </Tooltip> : ''
                }
                {
                    showBatch ?
                    <Tooltip title={data.batch ? data.batch : ''}>
                        <li style={{ justifyContent: 'left'}}>
                            <span style={{paddingLeft:'4px',textAlign:'left'}}>{data.batch ? data.batch : ''}</span>
                        </li>
                    </Tooltip> : ''
                }
                <li>
                    {
                        stockCardMessage.get('openSerial') && Number(data.inQuantity) !== 0 && inventoryType !== "Other"  ?
                        <Popover
                            placement="leftTop"
                            title={<span>序列号</span>}
                            content={
                                <div className='inventory-mxb-popover-content'>
                                    {
                                        serialList && serialList.size ? serialList.map(v => {
                                            return <p
                                                        style={{cursor:'pointer'}}
                                                        onClick={(e)=>{
                                                            e.stopPropagation()
                                                            dispatch(inventoryMxbActions.getSerialListRunningFollow(stockCardMessage.get('stockCardUuid'),v.get('serialUuid')))
                                                            dispatch(allRunningActions.changeMxbSerialDrawerVisibility(true))
                                                        }}
                                                    >{v.get('serialNumber')}</p>
                                        }) : <p>暂无序列号</p>
                                    }
                                </div>
                            }
                            trigger="click"
                        >
                            <Tooltip title={isShowTooltip(data.inQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(data.inQuantity,quantityScale) : ''}>
                                <span
                                    className={'inventory-mxb-text-decoration'}
                                    onClick={(e)=>{
                                        e.stopPropagation()
                                        dispatch(inventoryMxbActions.getSerialList(data,stockCardMessage.get('stockCardUuid'),'in',(data) => {
                                            dispatch(inventoryMxbActions.changeCommonValue('serialList',fromJS(data)))

                                        }))
                                    }}
                                >
                                    <Amount decimalPlaces={Number(quantityScale)}>{data.inQuantity}</Amount>
                                </span>
                            </Tooltip>
                          </Popover> :
                          <Tooltip title={isShowTooltip(data.inQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(data.inQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{data.inQuantity}</Amount></span></Tooltip>
                    }




                    <Tooltip title={isShowTooltip(data.inPrice,priceScale,priceQuantityPlaces) ? formatMoney(data.inPrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{data.inPrice}</Amount></span></Tooltip>
                    <Tooltip title={isShowTooltip(data.inAmount,2,balancePlaces) ? formatMoney(data.inAmount) : ''}><span><Amount>{data.inAmount}</Amount></span></Tooltip>
                </li>
                <li>
                    {
                        stockCardMessage.get('openSerial') && Number(data.outQuantity) !== 0 && inventoryType !== "Other" ?
                        <Popover
                            placement="leftTop"
                            title={<span>序列号</span>}
                            content={
                                <div className='inventory-mxb-popover-content'>
                                    {
                                        serialList && serialList.size  ? serialList.map(v => {
                                            return <p
                                                        style={{cursor:'pointer'}}
                                                        onClick={(e)=>{
                                                            e.stopPropagation()
                                                            dispatch(inventoryMxbActions.getSerialListRunningFollow(stockCardMessage.get('stockCardUuid'),v.get('serialUuid')))
                                                            dispatch(allRunningActions.changeMxbSerialDrawerVisibility(true))
                                                        }}
                                                    >
                                                        {v.get('serialNumber')}
                                                    </p>
                                        }) : <p>暂无序列号</p>
                                    }
                                </div>
                            }
                            trigger="click"
                        >
                            <Tooltip title={isShowTooltip(data.outQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(data.outQuantity,quantityScale) : ''}>
                                <span
                                    className={stockCardMessage.get('openSerial') ? 'inventory-mxb-text-decoration' : ''}
                                    onClick={(e)=>{
                                        e.stopPropagation()
                                        dispatch(inventoryMxbActions.getSerialList(data,stockCardMessage.get('stockCardUuid'),'out',(data) => {
                                            dispatch(inventoryMxbActions.changeCommonValue('serialList',fromJS(data)))

                                        }))
                                    }}
                                >
                                    <Amount decimalPlaces={Number(quantityScale)}>{data.outQuantity}</Amount>
                                </span>
                            </Tooltip>
                      </Popover> :
                      <Tooltip title={isShowTooltip(data.outQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(data.outQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{data.outQuantity}</Amount></span></Tooltip>
                    }

                    <Tooltip title={isShowTooltip(data.outPrice,priceScale,priceQuantityPlaces) ? formatMoney(data.outPrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{data.outPrice}</Amount></span></Tooltip>
                    <Tooltip title={isShowTooltip(data.outAmount,2,balancePlaces) ? formatMoney(data.outAmount) : ''}><span><Amount>{data.outAmount}</Amount></span></Tooltip>
                </li>
                <li>
                    {inventoryType==="Other" &&<span>{allBalanceDirection==='debit'?'借':'贷'}</span>}
                    <Tooltip title={isShowTooltip(balanceChanged?0-data.balanceQuantity:data.balanceQuantity,quantityScale,priceQuantityPlaces,quantityScale) ? formatMoney(balanceChanged?0-data.balanceQuantity:data.balanceQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{balanceChanged?0-data.balanceQuantity:data.balanceQuantity}</Amount></span></Tooltip>
                    <Tooltip title={isShowTooltip(data.balancePrice,priceScale,priceQuantityPlaces) ? formatMoney(data.balancePrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{data.balancePrice}</Amount></span></Tooltip>
                    <Tooltip title={isShowTooltip(balanceChanged?0-data.balanceAmount:data.balanceAmount,2,balancePlaces) ? formatMoney(balanceChanged?0-data.balanceAmount:data.balanceAmount) : ''}><span><Amount>{balanceChanged?0-data.balanceAmount:data.balanceAmount}</Amount></span></Tooltip>
                </li>
            </TableItem>
        )
    }
}
