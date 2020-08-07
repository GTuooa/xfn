import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import 'app/containers/Edit/EditRunning/EditCalculateComp/index.less'

import { Select, Divider, Button, Modal,Tooltip, message } from 'antd'
import { numberCalculate, formatMoney } from 'app/utils'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'

import StockModal  from './StockModal'
import StockList  from './StockList'
import AddCardModal from 'app/containers/Config/Inventory/AddCardModal.jsx'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
class Inventory extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
            warehouseModal:false,
            warehouseCards:{
                warehouseCardUuid:'',
                warehouseCardCode:'',
                warehouseCardName:''
            },
            showModal:false,
            showInventoryModal: false,
		}
	}

    render() {

        const {
            dispatch,
            stockCardList,
            carryoverCardList,
            stockList,
            warehouseList,
            stockRange,
            amount,
            taxRate,
            showStockModal,
            MemberList,
            thingsList,
            selectThingsList,
            selectedKeys,
            categoryTypeObj,
            currentCardType,
            insertOrModify,
            enableWarehouse,
            warehouseCanUse,
            openQuantity,
            selectList,
            selectItem,
            stockTitleName,
            oriState,
            oriDate,
            stockTemplate,
            sectionTemp,
            callback,
            selectTreeCallBack,
            amountDisable,
            isCardUuid,
            needTotalAmount,//是否显示合计金额
            assemblyNumber, //组装单数量
            needHidePrice, //不填入金额
            addInBatchesFun,//批量添加调用函数
            selectStockFun,//选择存货调用函数
            deleteStockFun,//删除存货调用函数
            notNeedOpenModal,
            notNeedMessage,//不需要打开弹窗时提示信息
            warehouseUuid,//存货调拨调出仓库Uuid
            totalAmountName,
            dealTypeUuid,
            needSpliceChoosedStock, //弹框全选是否需要拼接已选存货
            stockCardIdList,//已选的存货ID
            noPrice,//按仓库调整，不显示单价
            notFoundContent,//
        } = this.props
        const { showCardModal, warehouseModal, warehouseCards, showInventoryModal } = this.state

        const cardUuidName = isCardUuid ? 'cardUuid' : 'uuid'
        const cardNameString = oriState === 'STATE_CHZZ_ZZD' ? (stockTitleName === '物料' ? 'materialUuid': 'productUuid') : 'cardUuid'

        const saleOrPurchase = {
            acBusinessIncome: 'sale',
            acBusinessExpense: 'purchase'
        }
        let className = ''
        if (enableWarehouse && openQuantity) {
            if(noPrice){
                className = 'inventory-content-area-warehouse-no-price'
            }else{
                className = 'inventory-content-area-warehouse'
            }

        } else if (enableWarehouse && !openQuantity) {
            className = 'inventory-content-area-warehouse-no-open'
        } else if (!enableWarehouse && openQuantity) {
            className = 'inventory-content-area'
        } else {
            className = 'inventory-content-area-no-open'
        }
        const type = stockTitleName === '物料' || stockTitleName === '存货' ? 'notFinish' : 'finish'
        let totalAmount = 0
        stockCardList.map((v,i) =>{
            totalAmount = numberCalculate(totalAmount,v.get('amount'))
        })

        return (
            <div className='calculate-inventory-content'>
                <div className={className} style={{marginBottom:'10px'}}>
                    <span>{stockTitleName}</span>
                    {
                        enableWarehouse?
                        <span>
                            <span style={{marginRight:'5px'}}>仓库</span>
                            <XfIcon
                                type="editConfig"
                                onClick={() => {
                                    this.setState({
                                        warehouseModal:true
                                    })
                                }}
                            />
                        </span>
                        :''
                    }
                    {
                        openQuantity?
                        <span>数量</span>
                        :''
                    }
                    {
                        openQuantity && !noPrice?
                        <span>单价</span>
                        :''
                    }
                    <span>金额</span>
                    <span></span>
                </div>
                {
                    <StockList
                        dispatch={dispatch}
                        stockCardList={stockCardList}
                        stockList={stockList}
                        warehouseList={warehouseList}
                        stockRange={stockRange}
                        categoryTypeObj={categoryTypeObj}
                        enableWarehouse={enableWarehouse}
                        openQuantity={openQuantity}
                        stockTitleName={stockTitleName}
                        oriState={oriState}
                        oriDate={oriDate}
                        stockTemplate={stockTemplate}
                        sectionTemp={sectionTemp}
                        isCardUuid={isCardUuid}
                        assemblyNumber={assemblyNumber}
                        needHidePrice={needHidePrice}
                        selectStockFun={selectStockFun}
                        deleteStockFun={deleteStockFun}
                        needTooltip={openQuantity}
                        warehouseUuid={warehouseUuid}
                        noPrice={noPrice}
                        notFoundContent={notFoundContent}
                        showAddCardModal={()=>{
                            this.setState({
                                showCardModal: true
                            })
                        }}

                    />
                }
                {
                    oriState === 'STATE_CHZZ_ZZD' ? null :
                    <div className='inventory-button chzz-inventory-button'>
                        <Button
                            onClick={() => {
                                if(!notNeedOpenModal){
                                    // dispatch(editCalculateActions.deleteStockList(stockCardList, stockCardList.size -1, 'add',sectionTemp,stockTemplate))
                                    dispatch(searchApprovalActions.addSearchApprovalStock(stockCardList,stockCardList.size -1))
                                }else{
                                    message.info(notNeedMessage)
                                }

                            }}
                        >
                            <XfIcon type='big-plus'/>{`添加${stockTitleName}明细`}
                        </Button>
                        <Button
                            onClick={() => {
                                if(!notNeedOpenModal){
                                    this.setState({
                                        showInventoryModal: true
                                    })
                                }

                                dispatch(searchApprovalActions.getInventoryAllCardList([], 'hidecategory'))
                                // addInBatchesFun ? addInBatchesFun() : dispatch(editCalculateActions.getStockCardCategoryAndList())
                                
                            }}
                        >
                            <XfIcon type='editPlus'/>{`批量添加${stockTitleName}`}
                        </Button>
                        {
                            // oriState === 'STATE_YYSR_ZJ' || oriState === 'STATE_CHDB' || oriState === 'STATE_CHYE_CK' || oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHZZ_ZZCX' || oriState === 'STATE_CHTRXM'?
                            // <Button
                            //     style={{width:88}}
                            //     onClick={() => {
                            //         if(oriState === 'STATE_YYSR_ZJ' || oriState === 'STATE_CHDB'){
                            //             if(!notNeedOpenModal){
                            //                 dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showall', true))
                            //             }else{
                            //                 message.info(notNeedMessage)
                            //             }
                            //         }else{
                            //             dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showall', true))
                            //         }
                            //         dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'isCount', false))

                            //         stockTitleName === '成品' ?
                            //         dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'isProduct', true)) :
                            //         dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'isProduct', false))
                            //     }}
                            // >
                            //     <XfIcon type='upload'/>批量导入
                            // </Button> : null
                        }
                        {
                            // oriState === 'STATE_YYSR_ZJ' && openQuantity && enableWarehouse && insertOrModify === 'insert' ?
                            // <Button
                            //     onClick={() => {
                            //         if(!notNeedOpenModal){
                            //             dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showCount', true))
                            //             dispatch(editCalculateActions.getCarryoverWhareHouseTreeList(oriDate,oriState,dealTypeUuid,[],true))
                            //         }else{
                            //             message.info('请先选择处理类别')
                            //         }
                            //     }}
                            //     style={{marginRight: '10px',width: 88}}
                            // >
                            //     <XfIcon type='count-inventory' />&nbsp; 盘点结转
                            // </Button> : null
                        }
                        {
                            (oriState === 'STATE_CHYE_CK' || oriState === 'STATE_YYSR_ZJ') && openQuantity && insertOrModify === 'insert' ?
                            <Button
                                onClick={() => {
                                    if(!notNeedOpenModal && oriState === 'STATE_YYSR_ZJ' || oriState === 'STATE_CHYE_CK' ){
                                        dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showCount', true))
                                        enableWarehouse && dispatch(editCalculateActions.getWarehouseCardTree({
                                            haveQuantity: false,
                                            inventoryUuid: '',
                                            oriDate,
                                            tempName: oriState === 'STATE_CHYE_CK' ? 'Balance' : 'CostTransfer',
                                            isNeedHaveQuantity: false
                                        }))
                                        const temp = oriState === 'STATE_CHYE_CK' ? 'BalanceTemp' : 'CostTransferTemp'
                                        dispatch(editCalculateActions.getStockCardList(temp, null, true))
                                    }else{
                                        message.info('请先选择处理类别')
                                    }

                                }}
                                style={{marginRight: '10px',width: 88}}
                            >
                                <XfIcon type='count-inventory' />&nbsp; { oriState === 'STATE_CHYE_CK' ? '盘点调整' : '盘点结转'}
                            </Button> : null
                        }
                        {
                                oriState === 'STATE_CHYE_CH' && openQuantity && enableWarehouse && insertOrModify === 'insert' ?
                                <Button
                                    onClick={() => {
                                        dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showCount', true))
                                        dispatch(editCalculateActions.getWarehouseCardTree({
                                            haveQuantity: false,
                                            inventoryUuid: '',
                                            oriDate,
                                            tempName: 'Balance',
                                            isNeedHaveQuantity: false
                                        }))
                                        dispatch(editCalculateActions.getStockCardList('BalanceTemp', null, true))
                                    }}
                                    style={{marginRight: '10px',width: 113}}
                                >
                                    <XfIcon type='count-inventory' />&nbsp; 调整统一单价
                                </Button> : null
                        }
                        {
                            needTotalAmount  ?
                            <span className={'chzz-inventory-total'}>{totalAmountName ? totalAmountName : '合计'}：{formatMoney(totalAmount)}</span> : null
                        }
                    </div>
                }

                <AddCardModal
					showModal={showCardModal}
					closeModal={() => this.setState({showCardModal: false})}
					dispatch={dispatch}
                    enableWarehouse={warehouseCanUse}
                    fromPage='searchApprovalHideCategory'
                    // type={saleOrPurchase[categoryTypeObj]}
                />
                
                <StockModal
                    showCommonChargeModal={showStockModal}
                    MemberList={MemberList}
                    thingsList={thingsList}
                    dispatch={dispatch}
                    oriState={oriState}
                    selectedKeys={selectedKeys}
                    selectItem={selectItem}
                    selectList={selectList}
                    stockCard={stockCardList}
                    temp={sectionTemp}
                    showSelectAll={true}
                    stockTemplate={stockTemplate}
                    cancel={() => {
                        this.setState({ showStockModal: false })
                    }}
                    selectTreeFunc={selectTreeCallBack}
                    callback={callback}
                    needSpliceChoosedStock={needSpliceChoosedStock}
                    stockCardIdList={stockCardIdList}

                />
               
{/*
                <MultipleModal
                    MemberList={MemberList}
                    selectThingsList={selectThingsList}
                    thingsList={thingsList}
                    dispatch={dispatch}
                    showModal={showStockModal}
                    selectList={selectList}
                    categoryList={stockRange}
                    selectItem={selectItem}
                    stockCardList={stockCardList}
                    selectedKeys={selectedKeys}
                />
                 */}
                <Modal
                    visible={warehouseModal}
                    title={'批量设置仓库'}
                    onCancel={() => {this.setState({warehouseModal:false})}}
                    onOk={() => {
                        const { warehouseCardUuid, warehouseCardCode, warehouseCardName } = warehouseCards
                        // const carryoverCardListJ = carryoverCardList.toJS()
                        const stockCardListJ = stockCardList.toJS()
                        // dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, 'carryoverCardList', fromJS(carryoverCardListJ.map(v => {
                        //     v.warehouseCardUuid = warehouseCardUuid
                        //     v.warehouseCardCode = warehouseCardCode
                        //     v.warehouseCardName = warehouseCardName
                        //     return v
                        // }))))
                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, stockTemplate, fromJS(stockCardListJ.map(v => {
                            v.warehouseCardUuid = warehouseCardUuid
                            v.warehouseCardCode = warehouseCardCode
                            v.warehouseCardName = warehouseCardName
                            return v
                        }))))
                        let selectUuidList = [],cardUuidList = []
                        stockCardListJ && stockCardListJ.map(item => {
                            selectUuidList.push({
                                cardUuid: item.cardUuid ? item.cardUuid : '',
                                storeUuid: warehouseCardUuid
                            })
                            item.cardUuid && cardUuidList.push(item.cardUuid)
                        })

                        cardUuidList.length && oriState !== 'STATE_YYSR_XS' && oriState !== 'STATE_YYSR_TS' && dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, 0,sectionTemp,'notFinish'))

                        this.setState({warehouseModal:false,warehouseCards:{}})

                    }}
                >
                    <div style={{display:'flex'}}>
                        <span style={{width:'100px',lineHeight:'28px'}}>仓库：</span>
                        <Select
                            style={{flex:1}}
                            placeholder='请选择'
                            combobox
                            showSearch
                            value={warehouseCards.warehouseCardUuid ?`${warehouseCards.warehouseCardCode || ''} ${warehouseCards.warehouseCardName || ''}`:undefined}
                            onChange={value => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const warehouseCardUuid = valueList[0]
                                const warehouseCardCode = valueList[1]
                                const warehouseCardName = valueList[2]
                                this.setState({warehouseCards:{
                                    warehouseCardUuid,
                                    warehouseCardCode,
                                    warehouseCardName
                                }})
                            }}
                            >
                            {
                                warehouseList && warehouseList.map((v, i) => {
                                    return (
                                        <Option
                                            key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                        >
                                            {`${v.get('code')} ${v.get('name')}`}
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </Modal>
            </div>
        )
    }
}
