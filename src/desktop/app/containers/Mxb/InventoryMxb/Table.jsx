import React, { PropTypes, Fragment } from 'react'
import { Map, List ,fromJS} from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Tooltip ,Switch, Checkbox } from 'antd';
import { formatMoney } from 'app/utils'
import { TableBody, TableTitle, TableItem, TableAll, TableOver, Amount, TablePagination } from 'app/components'
import XfIcon from 'app/components/Icon'
import TableItems from './TableItems'
import CommonModal from '../MxbModal/CommonModal'
import CheckBoxModal from '../MxbModal/CheckBoxModal'
import { isShowTooltip } from '../MxbModal/CommonFun'
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
@immutableRenderDecorator
export default
class Table extends React.Component {
    render(){
        const {
            dispatch,
            dataList,
            balanceData,
            refreshInventoryMxbList,
            inventoryType,
            allBalanceDirection,
            balanceChanged,
            typeListValue,
            quantityScale,
            priceScale,
            showAssist,
            showBatch,
            modalName,

            batchList,
            curSelectBatchUuid,
            chooseBatchCard,
            assistList,
            curSelectAssistUuid,
            chooseAssistCard,

            begin,
            end,
            stockCardMessage,
            storeCardUuid,
            isType,
            serialList,
            mxbSerialDrawerVisibility,
            enableWarehouse,

            detailCurrentPage,
            detailPages,
            paginationCallBack,


        } =this.props

        let hash = {}
		const newUuidList = dataList.filter(v=>v.oriAbstract!=='期初余额').reduce((item, next) => {
			hash[next.oriUuid] ? '' : hash[next.oriUuid] = true && item.push(next);
			return item
		}, [])
		const finalUuidList = newUuidList.length ? newUuidList.filter(v => v.oriUuid) : []
        let titleClassName = ''
        switch(inventoryType){
			case 'Inventory':
				titleClassName= showAssist && showBatch ? 'table-title-inventory-assist-and-batch' :
								showAssist || showBatch ? 'table-title-inventory-assist-or-batch' : 'table-title-inventory-overview'
				break;
			case 'Other':
				titleClassName= showAssist && showBatch ? 'table-title-other-assist-and-batch' :
                                showAssist || showBatch ? 'table-title-other-assist-or-batch' :
                                'table-title-inventory-overview-type'
				break;
			default:
				break;
		}
        const openSerial = stockCardMessage.get('openSerial')

        const priceQuantityPlaces = 5, balancePlaces = 6

        return(
            <TableAll shadowTop="54px" type="kcmxb" newTable="true" shadowThree={true}>
                <div className="table-title-base">
                    <span>
                        存货： {balanceData.stockCardName}{balanceData.unitCardName?`(基本单位：${balanceData.unitCardName})`:''}
                    </span>
                    <span className='inventory-mxb-title-checkbox'>
                    {
                        stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openAssist') ?
                        <span>
                            <Checkbox
                                className='relative-mxb-top-branch'
                                checked={showAssist}
                                onChange={(e)=>{
                                    dispatch(inventoryMxbActions.changeCommonValue('showAssist',e.target.checked))
                                }}
                            />
                            &nbsp;
                            显示属性
                        </span> : null
                    }
                    {
                        stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openBatch') ?
                        <span>
                            <Checkbox
                                className='relative-mxb-top-branch'
                                checked={showBatch}
                                onChange={(e)=>{
                                    dispatch(inventoryMxbActions.changeCommonValue('showBatch',e.target.checked))
                                }}
                            />
                            &nbsp;
                            显示批次
                        </span> : null
                    }


                    </span>
                </div>
                <div className="table-title-wrap">
                    <ul className={`table-title-kmyeb ${titleClassName}`}>
                        <li><span>日期</span></li>
                        <li><span>流水号</span></li>
                        <li className='table-title-abstract'><span>摘要</span></li>
                        {
                            showAssist && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openAssist') ?
                            <li
                                className={'position-item'}
                                onClick={(e)=>{
                                    e.stopPropagation()
                                    dispatch(inventoryMxbActions.getInventoryMxbAssistList(begin, end, stockCardMessage.get('stockCardUuid'), storeCardUuid, isType))
                                    dispatch(inventoryMxbActions.changeCommonValue('modalName','属性'))
                                    dispatch(inventoryMxbActions.changeCommonValue('curSelectAssistUuid',chooseAssistCard))
                                }}
                            >
                                <span>
                                    属性
                                    {
										chooseAssistCard.size ?
										<XfIcon type='filter'/> :
										<XfIcon  type='not-filter'/>
									}
                                </span>
                                {
                                    <Fragment>
                                        <div
                                            className="common-modal-mask"
                                            style={{display: modalName ===  '属性' ? 'block' : 'none'}}
                                            onClick={(e)=>{
                                                e.stopPropagation()
                                                dispatch(inventoryMxbActions.changeCommonValue('modalName',''))
                                                dispatch(inventoryMxbActions.changeCommonValue('curSelectAssistUuid',fromJS([])))
                                            }}
                                        ></div>
                                        <div className={'position-item-modal'}>
                                            <CheckBoxModal
                                                modalStyle={{display: modalName === '属性' ? 'block' : 'none'}}
                                                modalName={modalName}
                                                moudleList={assistList}
                                                chooseCardObj={chooseAssistCard}
                                                onOkCallback={(newChooseObj) => {

                                                    dispatch(inventoryMxbActions.changeCommonValue('chooseAssistCard',fromJS(newChooseObj)))
                                                    if(inventoryType==='Other'){
                                                        dispatch(inventoryMxbActions.getOtherTypeStockStore())
                                                    }else{
                                                        dispatch(inventoryMxbActions.refreshInventoryMxbList())
                                                    }
												}}

                                                dispatch={dispatch}
                                                cancel={() => {
                                                    dispatch(inventoryMxbActions.changeCommonValue('modalName',''))
                                                    dispatch(inventoryMxbActions.changeCommonValue('curSelectBatchUuid',fromJS([])))
                                                }}

                                            />
                                        </div>
                                    </Fragment>
                                }
                            </li> : ''
                        }
                        {
                            showBatch && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openBatch') ?
                            <li
                                className={'position-item'}
                                onClick={(e)=>{
                                    e.stopPropagation()
                                    dispatch(inventoryMxbActions.getInventoryMxbBatchList(begin, end, stockCardMessage.get('stockCardUuid'), storeCardUuid, isType))
                                    dispatch(inventoryMxbActions.changeCommonValue('modalName','批次'))
                                    dispatch(inventoryMxbActions.changeCommonValue('curSelectBatchUuid',chooseBatchCard))
                                }}
                            >
                                <span>
                                    批次
                                    {
										chooseBatchCard.size ?
										<XfIcon type='filter'/> :
										<XfIcon  type='not-filter'/>
									}
                                </span>
                                {
                                    <Fragment>
                                        <div
                                            className="common-modal-mask"
                                            style={{display: modalName ===  '批次' ? 'block' : 'none'}}
                                            onClick={(e)=>{
                                                e.stopPropagation()
                                                dispatch(inventoryMxbActions.changeCommonValue('modalName',''))
                                                dispatch(inventoryMxbActions.changeCommonValue('curSelectBatchUuid',fromJS([])))
                                            }}
                                        ></div>
                                        <div className={'position-item-modal'}>
                                            <CommonModal
                                                modalStyle={{display: modalName === '批次' ? 'block' : 'none'}}
                                                modalName={modalName}
                                                cardList={ batchList }
                                                curSelectUuid={curSelectBatchUuid}
                                                dispatch={dispatch}
                                                hideEmpty={true}
                                                cancel={() => {
                                                    dispatch(inventoryMxbActions.changeCommonValue('modalName',''))
                                                    dispatch(inventoryMxbActions.changeCommonValue('curSelectBatchUuid',fromJS([])))
                                                }}
                                                onOkCallback={(curSelectUuid) => {
                                                    dispatch(inventoryMxbActions.changeCommonValue('chooseBatchCard',curSelectUuid))
                                                    if(inventoryType==='Other'){
                                                        dispatch(inventoryMxbActions.getOtherTypeStockStore())
                                                    }else{
                                                        dispatch(inventoryMxbActions.refreshInventoryMxbList())
                                                    }

                                                }}
                                                singleCheckBoxClick={(checked,uuid)=>{
                                                    dispatch(inventoryMxbActions.changeItemCheckboxCheck(checked,uuid,'curSelectBatchUuid'))
                                                }}
                                                allCheckBoxClick={(checkedAll,allList)=>{
                                                    dispatch(inventoryMxbActions.changeItemCheckboxCheck(checkedAll,'','curSelectBatchUuid',allList,true))
                                                }}
                                            />
                                        </div>
                                    </Fragment>
                                }
                            </li> : ''
                        }
                        <li className='overview-inventory-mxb-table-item-amount'>
                            <div>
                                <span>{inventoryType==='Other'?'借方':'入库'}</span>
                            </div>
                            <div className='inventory-mxb-amount-content'>
                                <span><span>数量</span></span>
                                <span><span>单价</span></span>
                                <span><span>金额</span></span>
                            </div>
                        </li>
                        <li className='overview-inventory-mxb-table-item-amount'>
                            <div>
                                <span>{inventoryType==='Other'?'贷方':'出库'}</span>
                            </div>
                            <div className='inventory-mxb-amount-content'>
                                <span><span>数量</span></span>
                                <span><span>单价</span></span>
                                <span><span>金额</span></span>
                            </div>
                        </li>
                        {inventoryType==="Other" ?
                        <li className='overview-inventory-mxb-table-item-amount-other'>
                            <div>
                                <span>余额</span>
                            </div>
                            <div>
                                <div>方向</div>
                                <span><span>数量</span></span>
                                <span><span>单价</span></span>
                                <span><span>金额</span></span>
                            </div>
                        </li>
                        :
                        <li className='overview-inventory-mxb-table-item-amount'>
                            <div>
                                <span>余额</span>
                            </div>
                            <div className='inventory-mxb-amount-content'>
                                <span>数量</span>
                                <span>单价</span>
                                <span>金额</span>
                            </div>
                        </li>
                        }

                    </ul>

                </div>
                <TableBody>
                    {dataList.length ?
                        dataList[0].oriAbstract==='期初余额'?
                        <TableItem  className={`${titleClassName}`}>
                            <li>{dataList[0].oriDate}</li>
                            <TableOver isLink={true}  onClick={e => {
                                e.stopPropagation()
                                dispatch(previewRunningActions.getPreviewRunningBusinessFetch(fromJS(dataList[0]), 'mxb',fromJS(dataList),refreshInventoryMxbList ))
                            }}>
                                {dataList[0].jrIndex && `${dataList[0].jrIndex}号`}
                            </TableOver>
                            <Tooltip title={dataList[0].oriAbstract}>
                                <li style={{ justifyContent: 'left'}}>
                                    <span style={{paddingLeft:'4px',textAlign:'left'}}>{dataList[0].oriAbstract}</span>
                                </li>
                            </Tooltip>
                            {
                                showAssist && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openAssist') ?
                                <li><span></span></li> : ''
                            }
                            {
                                showBatch && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openBatch') ?
                                <li><span></span></li> : ''
                            }
                            <li>
                                <Tooltip title={isShowTooltip(dataList[0].inQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(dataList[0].inQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{dataList[0].inQuantity}</Amount></span></Tooltip>
                                <Tooltip title={isShowTooltip(dataList[0].inPrice,priceScale,priceQuantityPlaces) ? formatMoney(dataList[0].inPrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{dataList[0].inPrice}</Amount></span></Tooltip>
                                <Tooltip title={isShowTooltip(dataList[0].inAmount,2,balancePlaces) ? formatMoney(dataList[0].inAmount) : ''}><span><Amount>{dataList[0].inAmount}</Amount></span></Tooltip>
                            </li>
                            <li>
                                <Tooltip title={isShowTooltip(dataList[0].outQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(dataList[0].outQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{dataList[0].outQuantity}</Amount></span></Tooltip>
                                <Tooltip title={isShowTooltip(dataList[0].outPrice,priceScale,priceQuantityPlaces) ? formatMoney(dataList[0].outPrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{dataList[0].outPrice}</Amount></span></Tooltip>
                                <Tooltip title={isShowTooltip(dataList[0].outAmount,2,balancePlaces) ? formatMoney(dataList[0].outAmount) : ''}><span><Amount>{dataList[0].outAmount}</Amount></span></Tooltip>
                            </li>
                            <li>
                                {inventoryType==="Other" &&
                                    <span>
                                        {typeListValue==="全部" ? <Switch
                                            className="use-unuse-style lend-bg"
                                            checked={allBalanceDirection == 'debit' ? false : true}
                                            checkedChildren="贷"
                                            unCheckedChildren="借"
                                            style={{width: 50}}
                                            onChange={() => {
                                                dispatch(inventoryMxbActions.changeOtherTypeBalanceDirection(allBalanceDirection == 'debit' ? 'credit' : 'debit',!balanceChanged))
                                            }}
                                        />
                                        :allBalanceDirection==='debit'?'借':'贷'
                                        }
                                    </span>
                                }
                                <Tooltip title={isShowTooltip(balanceChanged?0-dataList[0].balanceQuantity:dataList[0].balanceQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(balanceChanged?0-dataList[0].balanceQuantity:dataList[0].balanceQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{balanceChanged?0-dataList[0].balanceQuantity:dataList[0].balanceQuantity}</Amount></span></Tooltip>
                                <Tooltip title={isShowTooltip(dataList[0].balancePrice,priceScale,priceQuantityPlaces) ? formatMoney(dataList[0].balancePrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{dataList[0].balancePrice}</Amount></span></Tooltip>
                                <Tooltip title={isShowTooltip(balanceChanged?0-dataList[0].balanceAmount:dataList[0].balanceAmount,2,balancePlaces) ? formatMoney(balanceChanged?0-dataList[0].balanceAmount:dataList[0].balanceAmount) : ''}><span><Amount>{balanceChanged?0-dataList[0].balanceAmount:dataList[0].balanceAmount}</Amount></span></Tooltip>
                            </li>
                        </TableItem>
                        :
                        <div>
                            {inventoryType==="Other"&&
                                <TableItem  className={`${titleClassName}`}>
                                    <li></li>
                                    <li></li>
                                    <li style={{ justifyContent: 'left'}}>
                                        <span></span>
                                    </li>
                                    {
                                        showAssist && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openAssist') ?
                                        <li><span></span></li> : ''
                                    }
                                    {
                                        showBatch && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openBatch') ?
                                        <li><span></span></li> : ''
                                    }
                                    <li>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </li>
                                    <li>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </li>
                                    <li>
                                        {inventoryType==="Other" &&
                                            <span>
                                                {typeListValue==="全部" ? <Switch
                                                    className="use-unuse-style lend-bg"
                                                    checked={allBalanceDirection == 'debit' ? false : true}
                                                    checkedChildren="贷"
                                                    unCheckedChildren="借"
                                                    style={{width: 50}}
                                                    onChange={() => {
                                                        dispatch(inventoryMxbActions.changeOtherTypeBalanceDirection(allBalanceDirection == 'debit' ? 'credit' : 'debit',!balanceChanged))
                                                    }}
                                                />
                                                :allBalanceDirection==='debit'?'借':'贷'
                                                }
                                            </span>
                                        }
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </li>
                                </TableItem>
                            }
                            <TableItem  className={`${titleClassName}`}>
                                <Tooltip title={`本页行次：1/${dataList.length}`}><li>{dataList[0].oriDate}</li></Tooltip>
                                <TableOver isLink={true}  onClick={e => {
                                    e.stopPropagation()
                                    dispatch(previewRunningActions.getPreviewRunningBusinessFetch(fromJS(dataList[0]), 'mxb',fromJS(dataList),refreshInventoryMxbList ))
                                }}>
                                    {dataList[0].jrIndex && `${dataList[0].jrIndex}号`}
                                </TableOver>
                                <Tooltip title={`${dataList[0].oriAbstract}${dataList[0].jrJvCardAbstract}`}>
                                    <li style={{ justifyContent: 'left'}}>
                                        <span style={{paddingLeft:'4px',textAlign:'left'}}>{`${dataList[0].oriAbstract}${dataList[0].jrJvCardAbstract}`}</span>
                                    </li>
                                </Tooltip>
                                {
                                    showAssist && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openAssist') ?
                                    <Tooltip title={dataList[0].assist ? dataList[0].assist : ''}>
                                        <li style={{ justifyContent: 'left'}}>
                                            <span style={{paddingLeft:'4px',textAlign:'left'}}>{dataList[0].assist ? dataList[0].assist : ''}</span>
                                        </li>
                                    </Tooltip> : ''
                                }
                                {
                                    showBatch && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openBatch') ?
                                    <Tooltip title={dataList[0].batch ? dataList[0].batch : ''}>
                                        <li style={{ justifyContent: 'left'}}>
                                            <span style={{paddingLeft:'4px',textAlign:'left'}}>{dataList[0].batch ? dataList[0].batch : ''}</span>
                                        </li>
                                    </Tooltip> : ''
                                }
                                <li>
                                    <Tooltip title={isShowTooltip(dataList[0].inQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(dataList[0].inQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{dataList[0].inQuantity}</Amount></span></Tooltip>
                                    <Tooltip title={isShowTooltip(dataList[0].inPrice,priceScale,priceQuantityPlaces) ? formatMoney(dataList[0].inPrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{dataList[0].inPrice}</Amount></span></Tooltip>
                                    <Tooltip title={isShowTooltip(dataList[0].inAmount,2,balancePlaces) ? formatMoney(dataList[0].inAmount) : ''}><span><Amount>{dataList[0].inAmount}</Amount></span></Tooltip>
                                </li>
                                <li>
                                    <Tooltip title={isShowTooltip(dataList[0].outQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(dataList[0].outQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{dataList[0].outQuantity}</Amount></span></Tooltip>
                                    <Tooltip title={isShowTooltip(dataList[0].outPrice,priceScale,priceQuantityPlaces) ? formatMoney(dataList[0].outPrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{dataList[0].outPrice}</Amount></span></Tooltip>
                                    <Tooltip title={isShowTooltip(dataList[0].outAmount,2,balancePlaces) ? formatMoney(dataList[0].outAmount) : ''}><span><Amount>{dataList[0].outAmount}</Amount></span></Tooltip>
                                </li>
                                <li>
                                    {inventoryType==="Other" &&
                                        <span>
                                            {allBalanceDirection==='debit'?'借':'贷'}
                                        </span>
                                    }
                                    <Tooltip title={isShowTooltip(balanceChanged?0-dataList[0].balanceQuantity:dataList[0].balanceQuantity,quantityScale,priceQuantityPlaces,quantityScale) ? formatMoney(balanceChanged?0-dataList[0].balanceQuantity:dataList[0].balanceQuantity) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{balanceChanged?0-dataList[0].balanceQuantity:dataList[0].balanceQuantity}</Amount></span></Tooltip>
                                    <Tooltip title={isShowTooltip(dataList[0].balancePrice,priceScale,priceQuantityPlaces) ? formatMoney(dataList[0].balancePrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{dataList[0].balancePrice}</Amount></span></Tooltip>
                                    <Tooltip title={isShowTooltip(balanceChanged?0-dataList[0].balanceAmount:dataList[0].balanceAmount,2,balancePlaces) ? formatMoney(balanceChanged?0-dataList[0].balanceAmount:dataList[0].balanceAmount) : ''}><span><Amount>{balanceChanged?0-dataList[0].balanceAmount:dataList[0].balanceAmount}</Amount></span></Tooltip>
                                </li>
                            </TableItem>
                        </div>
                        :''
                    }
                    {dataList.length>0 ? dataList.slice(1).map((data,index)=>{
                        return (
                            <TableItems
                                key={index}
                                idx={index}
                                index={dataList[0].oriAbstract !== '期初余额' ? index+2 : index+1}
                                dispatch={dispatch}
                                data={data}
                                uuidList={finalUuidList}
                                inventoryType={inventoryType}
                                className={`${titleClassName}`}
                                refreshInventoryMxbList={refreshInventoryMxbList}
                                allBalanceDirection={allBalanceDirection}
                                balanceChanged={balanceChanged}
                                quantityScale={quantityScale}
                                priceScale={priceScale}
                                showAssist={showAssist}
                                showBatch={showBatch}
                                openSerial={openSerial}
                                stockCardMessage={stockCardMessage}
                                serialList={serialList}
                                mxbSerialDrawerVisibility={mxbSerialDrawerVisibility}
                                priceQuantityPlaces={priceQuantityPlaces}
                                balancePlaces={balancePlaces}
                                totalSize={dataList ? dataList[0].oriAbstract === '期初余额' ? dataList.length -1 : dataList.length : 0}
                            />
                        )
                    }):''}
                    <TableItem line={dataList.length+1} className={`${titleClassName}`}>
                        <li></li>
                        <li></li>
                        <li>合计</li>
                        {
                            showAssist && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openAssist') ?
                            <li><span></span></li> : ''
                        }
                        {
                            showBatch && stockCardMessage.get('stockCardUuid') && stockCardMessage.get('openBatch') ?
                            <li><span></span></li> : ''
                        }
                        <li>
                            <Tooltip title={isShowTooltip(balanceData.allInQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(balanceData.allInQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{balanceData.allInQuantity}</Amount></span></Tooltip>
                            <Tooltip title={isShowTooltip(balanceData.allInPrice,priceScale,priceQuantityPlaces) ? formatMoney(balanceData.allInPrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{balanceData.allInPrice}</Amount></span></Tooltip>
                            <Tooltip title={isShowTooltip(balanceData.allInAmount,2,balancePlaces) ? formatMoney(balanceData.allInAmount) : ''}><span><Amount>{balanceData.allInAmount}</Amount></span></Tooltip>
                        </li>
                        <li>
                            <Tooltip title={isShowTooltip(balanceData.allOutQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(balanceData.allOutQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{balanceData.allOutQuantity}</Amount></span></Tooltip>
                            <Tooltip title={isShowTooltip(balanceData.allOutPrice,priceScale,priceQuantityPlaces) ? formatMoney(balanceData.allOutPrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{balanceData.allOutPrice}</Amount></span></Tooltip>
                            <Tooltip title={isShowTooltip(balanceData.allOutAmount,2,balancePlaces) ? formatMoney(balanceData.allOutAmount) : ''}><span><Amount>{balanceData.allOutAmount}</Amount></span></Tooltip>
                        </li>
                        <li>
                            {inventoryType==="Other" &&<span>{allBalanceDirection==='debit'?'借':'贷'}</span>}
                            <Tooltip title={isShowTooltip(balanceChanged?0-balanceData.allBalanceQuantity:balanceData.allBalanceQuantity,quantityScale,priceQuantityPlaces) ? formatMoney(balanceChanged?0-balanceData.allBalanceQuantity:balanceData.allBalanceQuantity,quantityScale) : ''}><span><Amount decimalPlaces={Number(quantityScale)}>{balanceChanged?0-balanceData.allBalanceQuantity:balanceData.allBalanceQuantity}</Amount></span></Tooltip>
                            <Tooltip title={isShowTooltip(balanceData.allBalancePrice,priceScale,priceQuantityPlaces) ? formatMoney(balanceData.allBalancePrice,priceScale) : ''}><span><Amount decimalPlaces={Number(priceScale)}>{balanceData.allBalancePrice}</Amount></span></Tooltip>
                            <Tooltip title={isShowTooltip(balanceChanged?0-balanceData.allBalanceAmount:balanceData.allBalanceAmount,2,balancePlaces) ? formatMoney(balanceChanged?0-balanceData.allBalanceAmount:balanceData.allBalanceAmount) : ''}><span><Amount>{balanceChanged?0-balanceData.allBalanceAmount:balanceData.allBalanceAmount}</Amount></span></Tooltip>
                        </li>
                    </TableItem>
                </TableBody>
                <TablePagination
					currentPage={detailCurrentPage}
					pageCount={detailPages}
					paginationCallBack={(value) => {
                        dispatch(inventoryMxbActions.changeDetailCurrentPages(value))
                        paginationCallBack()
                    }}
				/>
            </TableAll>
        )
    }
}
