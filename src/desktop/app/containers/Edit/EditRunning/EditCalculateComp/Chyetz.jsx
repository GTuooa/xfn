import React, { Fragment } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { formatMoney, numberCalculate } from 'app/utils'
import { DatePicker, Input, Select, Icon, Radio, message, Button } from 'antd'
const RadioGroup = Radio.Group
import XfIcon from 'app/components/Icon'
const Option = Select.Option
import { fromJS } from 'immutable'
import moment from 'moment'
import { Amount } from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import StockModal from './component/StockModal'
import NumberInput from './component/NumberInput'
import StockSingleModal from './component/StockSingleModal'
import CategorySelect from './component/CategorySelect'
import { numberTest } from './component/numberTest'
import Inventory from './stock/Inventory'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@immutableRenderDecorator
export default
    class Chyetz extends React.Component {

    static displayName = 'Chyetz'

    constructor() {
        super()
        this.state = {
            showCommonChargeModal: false,
            showWarehouseModal: false,
            showChSingleModal: false,
			checkable: false,
            isCHSingleModal: false,
            selectTreeUuid: 'all',
            selectTreeLevel: 0,
        }
    }
    render() {
        const {
            dispatch,
            BalanceTemp,
            disabledBeginDate,
            hideCategoryList,
            panes,
            calculateViews,

            insertOrModify,
            paymentType,
            disabledDate,
            commonCardObj,
            enableWarehouse,
            isOpenQuantity,
			batchList,
			serialList,
        } = this.props
        const { showWarehouseModal, showStockModal,showChSingleModal,isCHSingleModal,checkable, selectTreeUuid, selectTreeLevel } = this.state

        const reg = /^-{0,1}\d*\.?\d{0,2}$/
        const paymentTypeStr = calculateViews.get('paymentTypeStr')

        const modify = insertOrModify === 'modify' ? true : false
        const oriDate = this.props.oriDate
        const oriAbstract = BalanceTemp.get('oriAbstract')
        const oriState = BalanceTemp.get('oriState')
        const oriUuid = BalanceTemp.get('oriUuid')
        const runningIndex = BalanceTemp.get('runningIndex')
        const jrIndex = BalanceTemp.get('jrIndex')
        const amount = BalanceTemp.get('amount') ? BalanceTemp.get('amount') : 0
        const stockCardList = BalanceTemp.get('stockCardList')
        const allStockCardList = BalanceTemp.get('allStockCardList')
        const stockCardUuidList = BalanceTemp.get('stockCardUuidList')
        const wareHouseList = BalanceTemp.get('wareHouseList')
        const wareHouseCardList = BalanceTemp.get('wareHouseCardList')
        const oriStockCardList = BalanceTemp.get('oriStockCardList')
        const oriWarehouseCardList = BalanceTemp.get('oriWarehouseCardList')
        const selectI = calculateViews.get('selectI')
        const showCount = calculateViews.get('showCount')
        const warehouseTreeList = calculateViews.get('warehouseTreeList')


        // 保存后的存货
        const oriWareHouseList = BalanceTemp.get('oriWareHouseList')
        const oriStockList = BalanceTemp.get('oriStockList')

        const showSingleModal = commonCardObj.get('showSingleModal')
        const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        const cardPageObj = commonCardObj.get('cardPageObj')
        const modalName = commonCardObj.get('modalName')
        const chooseWareHouseCard = BalanceTemp.get('chooseWareHouseCard')
        const chooseStockCard = BalanceTemp.get('chooseStockCard')

        let totalCbAmount = 0.00

        let costStockOption = [], stockCardIdList = [],selectUuidForPrice=[]
        stockCardList.map(v => {
            stockCardIdList.push(v.get('cardUuid'))

            selectUuidForPrice.push({
                cardUuid: v.get('cardUuid'),
                storeUuid: v.get('warehouseCardUuid'),
                assistList: v.get('assistList'),
                batchUuid: v.get('batchUuid'),
                isUniformPrice: v.get('isUniformPrice'),
                index: 0
            })
            totalCbAmount = numberCalculate(totalCbAmount,v.get('amount'))
        })
        const singlethingsList = thingsList.size ? thingsList.filter(item => stockCardIdList.indexOf(item.get('uuid')) === -1) : fromJS([])
        if (allStockCardList && allStockCardList.size) {
            allStockCardList.forEach((v, i) => {
                if (stockCardIdList.indexOf(v.get('uuid')) === -1) {
                    const itemCard = v.toJS();
                    const unit = itemCard.unit ? JSON.stringify(itemCard.unit) : JSON.stringify({ unitList: [] })
                    costStockOption.push(
                        <Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${v.get('isUniformPrice')}${Limit.TREE_JOIN_STR}${unit}`}>
                            {`${v.get('code')} ${v.get('name')}`}
                        </Option>
                    )
                }


            })
        }

        return (
            paymentType === 'LB_CHYE' ?
                <div className="accountConf-modal-list">
                    {
                        insertOrModify === 'modify' ?
                            <div className="edit-running-modal-list-item">
                                <label>流水号：</label>
                                <div>
                                    <NumberInput
                                        style={{ width: '70px', marginRight: '5px' }}
                                        value={jrIndex}
                                        onChange={(e) => {
                                            if (/^\d{0,6}$/.test(e.target.value)) {
                                                dispatch(editCalculateActions.changeEditCalculateCommonState('BalanceTemp', 'jrIndex', e.target.value))
                                            } else {
                                                message.info('流水号不能超过6位')
                                            }
                                        }}
                                        PointDisabled={true}
                                    />
                                    号
                            </div>
                            </div>
                            :
                            null
                    }
                    <div className="edit-running-modal-list-item">
                        <label>日期：</label>
                        <div>
                            <DatePicker
                                allowClear={false}
                                disabledDate={disabledDate}
                                value={moment(oriDate)}
                                onChange={value => {
                                    const date = value.format('YYYY-MM-DD')
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                                    if(selectUuidForPrice.length > 0){
                                        dispatch(editCalculateActions.getBalanceAdjustPrice(date,selectUuidForPrice, 'stockCardList', 'Balance'))
                                    }
                                }} />
                        </div>
                    </div>
                    <CategorySelect
                        dispatch={dispatch}
                        insertOrModify={insertOrModify}
                        paymentTypeStr={paymentTypeStr}
                        hideCategoryList={hideCategoryList}
                    />
                    {
                        enableWarehouse ?
                            <div className="edit-running-modal-list-item">
                                <label></label>
                                <div>
                                    <RadioGroup
                                        value={oriState}
                                        disabled={insertOrModify === 'modify'}
                                        onChange={e => {
                                            dispatch(innerCalculateActions.changeEditCalculateCommonString('Balance', 'oriState', e.target.value))
                                            dispatch(editCalculateActions.clearBalanceTemp(e.target.value))
                                            if (e.target.value === 'STATE_CHYE_TYDJ') {
                                                dispatch(editCalculateActions.getStockCardList('BalanceTemp', true,true))
                                                dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp',isUniform:true}))
                                            } else {
                                                dispatch(editCalculateActions.getStockCardList('BalanceTemp'))
                                                dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp',isUniform:false}))
                                            }

                                        }}>
                                        <Radio key="a" value={'STATE_CHYE_CK'}>按仓库调整</Radio>
                                        <Radio key="b" value={'STATE_CHYE_CH'}>按存货调整</Radio>
                                        {
                                            // isOpenQuantity ? <Radio key="c" value={'STATE_CHYE_TYDJ'}>调整统一单价</Radio> : null
                                        }


                                    </RadioGroup>
                                </div>
                            </div> : null
                    }

                    <div className='accountConf-separator'></div>
                    <div className="edit-running-modal-list-item">
                        <label>摘要：</label>
                        <div>
                            <Input className="focus-input"
                                onFocus={(e) => {
                                    document.getElementsByClassName('focus-input')[0].select();
                                }}
                                value={oriAbstract}
                                onChange={(e) => {
                                    dispatch(innerCalculateActions.changeEditCalculateCommonString('Balance', 'oriAbstract', e.target.value))
                                }}
                            />
                        </div>
                    </div>

                    <div className='accountConf-separator'></div>

                    <Inventory
                        dispatch={dispatch}
                        stockCardList={stockCardList}
                        stockList={allStockCardList}
                        stockRange={[]}
                        // amount={amount}
                        oriDate={oriDate}
                        oriUuid={oriUuid}
                        MemberList={memberList}
                        thingsList={thingsList}
                        // carryoverCardList={wareHouseCardList}
                        currentCardType={'stock'}
                        selectedKeys={selectedKeys}
                        warehouseList={wareHouseCardList}
                        insertOrModify={insertOrModify}
                        enableWarehouse={enableWarehouse}
                        oriState={oriState}
                        openQuantity={isOpenQuantity}
                        selectList={selectList}
                        selectItem={selectItem}
                        serialList={serialList}
                        stockTitleName={'存货'}
                        stockTemplate={'stockCardList'}
                        sectionTemp={'Balance'}
                        amountDisable={false}
                        noPrice={oriState === 'STATE_CHYE_CH' ? true : false}
                        isCardUuid={false}
                        needTotalAmount={false}
                        needHidePrice={oriState === 'STATE_CHYE_CH' ? true : false}
                        selectStockFun={(cardUuid,i)=>{}}
                        deleteStockFun={(i)=>{}}
                        callback={(item) => {
                            const chooseIndex = stockCardList.size
                            let selectUuidList = []
                            selectItem && selectItem.size && selectItem.map((item, index) => {
                                // if(item.get('isOpenedQuantity')){
                                    selectUuidList.push({
                                        cardUuid:item.get('uuid'),
                                        // storeUuid: fromWareHouse.cardUuid,
                                        assistList: item.get('assistList'),
                                        batchUuid: item.get('batchUuid'),
                                        index,
                                        isUniformPrice: item.get('isUniformPrice')
                                    })
                                // }

                            })
                            selectUuidList && selectUuidList.length && dispatch(editCalculateActions.getCostTransferPrice(oriDate, selectUuidList ,chooseIndex, 'Balance'))
                        }}
                        selectTreeCallBack={(uuid, level) => {
                            if (uuid === 'all') {
                                dispatch(innerCalculateActions.getStockCardList({currentPage: 1}))
                            } else {
                                dispatch(editCalculateActions.getStockSomeCardList({uuid, level, currentPage: 1}))
                            }
                            this.setState({
                                selectTreeUuid: uuid,
                                selectTreeLevel: level
                            })
                        }}
                        cardPageObj={cardPageObj}
                        cardPaginationCallBack={(value)=>{
                            if (selectTreeUuid === 'all') {
                                dispatch(innerCalculateActions.getStockCardList({currentPage: value}))
                            } else {
                                dispatch(editCalculateActions.getStockSomeCardList(
                                    {
                                        uuid: selectTreeUuid,
                                        level: selectTreeLevel,
                                        currentPage: value
                                    }
                                ))
                            }
                        }}
                    />

                    <div className="edit-running-modal-list-item">
                        <label>调整净额：{formatMoney(totalCbAmount)}</label>

                    </div>



                    {
                        // <StockModal
                        //     showCommonChargeModal={this.state.showCommonChargeModal}
                        //     MemberList={memberList}
                        //     thingsList={thingsList}
                        //     dispatch={dispatch}
                        //     oriDate={oriDate}
                        //     oriState={oriState}
                        //     // categoryTypeObj={categoryTypeObj}
                        //     selectedKeys={selectedKeys}
                        //     selectItem={selectItem}
                        //     selectList={selectList}
                        //     stockCard={stockCardList}
                        //     // stockCardIdList={stockCardIdList}
                        //     showSelectAll={true}
                        //     temp='Balance'
                        //     cancel={() => {
                        //         this.setState({ showCommonChargeModal: false })
                        //     }}
                        //     selectTreeFunc={(uuid, level) => {
                        //         const isUniform = null
                        //         const openQuantity = oriState === 'STATE_CHYE_TYDJ' ? true : null
                        //         if (uuid === 'all') {
                        //             dispatch(editCalculateActions.getStockCardList('BalanceTemp', isUniform, openQuantity))
                        //         } else {
                        //             dispatch(editCalculateActions.getStockSomeCardList({uuid, level, isUniform, openQuantity}))
                        //         }
                        //     }}
                        //     callback={() => {
                        //         if (oriState === 'STATE_CHYE_CH') {
                        //             const chooseIndex = wareHouseList.size
                        //         } else {
                        //             const chooseIndex = stockCardList.size
                        //             const chooseWareHouseCardUuid = !enableWarehouse || enableWarehouse && oriState === 'STATE_CHYE_TYDJ' ? '' : chooseWareHouseCard.get('cardUuid')
                        //             let selectUuidList = []
                        //             const storeUuid = oriState === 'STATE_CHYE_CK' ? chooseWareHouseCard.get('cardUuid') : ''
                        //
                        //             selectItem && selectItem.size && selectItem.map((item, index) => {
                        //                 const name = `${item.get('code')} ${item.get('name')}`
                        //                 if(insertOrModify === 'insert' || (insertOrModify === 'modify' && !(oriStockCardList.indexOf(item.get('uuid')) !== -1 && oriWarehouseCardList.indexOf(chooseWareHouseCard.get('cardUuid')) !== -1 ))){
                        //                     selectUuidList.push({
                        //                         cardUuid: item.get('uuid'),
                        //                         storeUuid: storeUuid,
                        //                         assistList: item.get('assistList'),
                        //                         batchUuid: item.get('batchUuid'),
                        //                         isUniformPrice: item.get('isUniformPrice'),
                        //                         index: chooseIndex + index
                        //                     })
                        //                 }else{
                        //                     oriStockList && oriStockList.map(v => {
                        //                         if(v.get('cardUuid') === item.get('uuid')){
                        //                             dispatch(innerCalculateActions.changeEditCalculateCommonString('Balance',['stockCardList',chooseIndex + index],v))
                        //                         }
                        //                     })
                        //                 }
                        //
                        //             })
                        //             if(selectUuidList.length > 0){
                        //                 dispatch(editCalculateActions.getBalanceAdjustPrice(oriDate,selectUuidList, 'stockCardList', 'Balance'))
                        //             }
                        //
                        //         }
                        //
                        //     }}
                        //
                        // />
                    }

                </div> : null
        )
    }
}
