import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { formatMoney, numberCalculate } from 'app/utils'
import { DatePicker, Input, Select, message, Tree, Icon, Button } from 'antd'
import NumberInput from 'app/components/Input'
import XfIcon from 'app/components/Icon'
const Option = Select.Option
import { fromJS } from 'immutable'
import moment from 'moment'

import * as Limit from 'app/constants/Limit.js'
import { Amount } from 'app/components'
// import StockModal from './component/StockModal'
import StockSingleModal from './component/StockSingleModal'
import CategorySelect from './component/CategorySelect'
import { numberTest } from '../common/common'
import Inventory from './stock/Inventory'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@immutableRenderDecorator
export default
    class Chdb extends React.Component {

    static displayName = 'Chdb'

    constructor() {
        super()
        this.state = {
            selectTreeUuid: 'all',
            selectTreeLevel: 0,
        }
    }
    render() {
        const {
            dispatch,
            StockTemp,
            hideCategoryList,
            insertOrModify,
            paymentType,
            disabledDate,
            commonCardObj,
            calculateViews,
            enableWarehouse,
            openQuantity,
            serialList,
        } = this.props
        const { selectTreeUuid, selectTreeLevel } = this.state
        const reg = /^-{0,1}\d*\.?\d{0,2}$/
        const paymentTypeStr = calculateViews.get('paymentTypeStr')
        const modify = insertOrModify === 'modify' ? true : false
        const oriDate = this.props.oriDate
        const oriAbstract = StockTemp.get('oriAbstract')
        const oriUuid = StockTemp.get('oriUuid')
        const runningIndex = StockTemp.get('runningIndex')
        const jrIndex = StockTemp.get('jrIndex')
        const amount = StockTemp.get('amount') ? StockTemp.get('amount') : 0
        const stockCardList = StockTemp.get('stockCardList')
        const allStockCardList = StockTemp.get('allStockCardList')
        const stockCardUuidList = StockTemp.get('stockCardUuidList')
        const wareHouseCardList = StockTemp.get('wareHouseCardList')
        const selectI = calculateViews.get('selectI')

        // const showSingleModal = commonCardObj.get('showSingleModal')
        const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        const cardPageObj = commonCardObj.get('cardPageObj')
        const modalName = commonCardObj.get('modalName')
        const chooseWareHouseCardList = StockTemp.get('chooseWareHouseCardList')
        let toWareHouse = {}, fromWareHouse = {}
        chooseWareHouseCardList.toJS().map(item => {
            if (item.warehouseStatus === 'WAREHOUSE_STATUS_TO') {
                toWareHouse = item
            } else {
                fromWareHouse = item
            }
        })


        let totalCbAmount = 0.00

        let costStockOption = [], stockCardIdList = [],selectUuidForPrice=[]
        stockCardList.map(v => {
            stockCardIdList.push(v.get('cardUuid'))
            if(v.get('isOpenedQuantity')){
                selectUuidForPrice.push({
                    cardUuid:v.get('cardUuid'),
                    storeUuid: fromWareHouse.cardUuid,
                    assistList: v.get('assistList'),
                    batchUuid: v.get('batchUuid'),
                    isUniformPrice: v.get('isUniformPrice')
                })
            }
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
            paymentType === 'LB_CHDB' ?
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
                                                dispatch(editCalculateActions.changeEditCalculateCommonState('StockTemp', 'jrIndex', e.target.value))
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
                                    selectUuidForPrice && selectUuidForPrice.length && dispatch(editCalculateActions.getCostTransferPrice(date, selectUuidForPrice ,0, 'Stock'))
                                }} />
                        </div>
                    </div>
                    <CategorySelect
                        dispatch={dispatch}
                        insertOrModify={insertOrModify}
                        paymentTypeStr={paymentTypeStr}
                        hideCategoryList={hideCategoryList}
                    />
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
                                    dispatch(innerCalculateActions.changeEditCalculateCommonString('Stock', 'oriAbstract', e.target.value))
                                }}
                            />
                        </div>
                    </div>
                    <div className="edit-running-modal-list-item">
                        <label>调出仓库：</label>
                        <Select
                            combobox
                            showSearch
                            value={fromWareHouse.name}
                            onChange={(value,options) => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const name = `${valueList[0]} ${valueList[1]}`
                                const uuid = options.props.uuid
                                if (toWareHouse.cardUuid === uuid) {
                                    return message.info('调入与调出不能选择同一仓库')
                                } else {
                                    dispatch(editCalculateActions.changeWareHouseCardList('WAREHOUSE_STATUS_FROM', name, uuid))
                                    dispatch(editCalculateActions.getStockCardList())
                                }
                                let selectUuidList = []
                                stockCardList && stockCardList.map((item, i) => {
                                    if(item.get('isOpenedQuantity')){
                                        selectUuidList.push({
                                            cardUuid:item.get('cardUuid'),
                                            storeUuid: uuid,
                                            assistList: item.get('assistList'),
                                            batchUuid: item.get('batchUuid'),
                                            isUniformPrice: item.get('isUniformPrice')
                                        })
                                    }

                                })
                                selectUuidList && selectUuidList.length && dispatch(editCalculateActions.getCostTransferPrice(oriDate, selectUuidList,0, 'Stock'))
                            }}
                        >
                            {
                                wareHouseCardList && wareHouseCardList.map((v, i) => {
                                    return <Option
                                        key={v.get('code')}
                                        value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                        uuid={v.get('uuid')}
                                    >
                                         {
                                             // v.get('code') && v.get('code') !== 'DFTCRD' ? `${v.get('code')} ${v.get('name')}` : v.get('name')
                                         }
                                        {`${v.get('code')} ${v.get('name')}`}
                                    </Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className="edit-running-modal-list-item">
                        <label>调入仓库：</label>
                        <Select
                            combobox
                            showSearch
                            value={toWareHouse.name}
                            onChange={(value,options) => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const name = `${valueList[0]} ${valueList[1]}`
                                const uuid = options.props.uuid
                                if (fromWareHouse.cardUuid === uuid) {
                                    return message.info('调入与调出不能选择同一仓库')
                                } else {
                                    dispatch(editCalculateActions.changeWareHouseCardList('WAREHOUSE_STATUS_TO', name, uuid))
                                }

                            }}
                        >
                            {
                                wareHouseCardList && wareHouseCardList.map((v, i) => {
                                    return <Option
                                        key={v.get('code')}
                                        value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                        uuid={v.get('uuid')}
                                    >
                                        {`${v.get('code')} ${v.get('name')}`}
                                    </Option>
                                })
                            }
                        </Select>
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
                        enableWarehouse={false}
                        oriState={'STATE_CHDB'}
                        openQuantity={openQuantity}
                        selectList={selectList}
                        selectItem={selectItem}
                        stockTitleName={'存货'}
                        stockTemplate={'stockCardList'}
                        sectionTemp={'Stock'}
                        amountDisable={false}
                        isCardUuid={false}
                        needTotalAmount={true}
                        notNeedOpenModal={!fromWareHouse.cardUuid}
                        notNeedMessage={'请选择调出仓库'}
                        warehouseUuid={fromWareHouse.cardUuid}
                        serialList={serialList}
						addInBatchesFun={()=>{
                            if (fromWareHouse.cardUuid) {
                                dispatch(editCalculateActions.getStockCardCategoryAndList({currentPage: 1}))
                            } else {
                                return message.info('请选择调出仓库')
                            }
						}}
						selectStockFun={(cardUuid,i)=>{}}
						deleteStockFun={(i)=>{}}
						callback={(item) => {
                            const chooseIndex = stockCardList.size
                            let selectUuidList = []
                            selectItem && selectItem.size && selectItem.map((item, index) => {
                                if(item.get('isOpenedQuantity')){
                                    selectUuidList.push({
                                        cardUuid:item.get('uuid'),
                                        storeUuid: fromWareHouse.cardUuid,
                                        assistList: item.get('assistList'),
                                        batchUuid: item.get('batchUuid'),
                                        isUniformPrice: item.get('isUniformPrice')
                                    })
                                }

                            })
                            selectUuidList && selectUuidList.length && dispatch(editCalculateActions.getCostTransferPrice(oriDate, selectUuidList ,chooseIndex, 'Stock'))
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

                    {
                        // <StockSingleModal
                        //     dispatch={dispatch}
                        //     showSingleModal={showSingleModal}
                        //     MemberList={memberList}
                        //     thingsList={singlethingsList}
                        //     selectedKeys={selectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : selectedKeys}
                        //     stockCardList={stockCardList}
                        //     title={'选择存货'}
                        //     cancel={()=>{
                        //         dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'showSingleModal', false))
                        //     }}
                        //     selectFunc={(item, cardUuid) => {
                        //         const code = item.code
                        //         const name = item.name
                        //         const isOpenedQuantity = item.isOpenedQuantity
                        //         const isUniformPrice = item.isUniformPrice
                        //         const allUnit = item.unit ? item.unit : ''
                        //         dispatch(innerCalculateActions.changeEditCalculateCommonString('Stock', 'cardUuid', cardUuid))
                        //         dispatch(innerCalculateActions.changeEditCalculateCommonString('Stock', ['stockCardList', selectI], fromJS({ cardUuid, name, code, isOpenedQuantity, isUniformPrice, allUnit })))
                        //         dispatch(innerCalculateActions.changeEditCalculateCommonString('Stock', 'stockCardRange', fromJS({ cardUuid, name, code })))
                        //
                        //         dispatch(innerCalculateActions.changeEditCalculateCommonString('Stock', ['stockCardList', selectI, 'amount'], ''))
                        //         dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'showSingleModal', false))
                        //
                        //         isOpenedQuantity && dispatch(editCalculateActions.getCostTransferPrice(oriDate, [
                        //             {
                        //                 cardUuid: cardUuid,
                        //                 storeUuid: fromWareHouse.cardUuid,
                        //                 assistList: item.assistList,
                        //                 batchUuid: item.batchUuid,
                        //                 isUniformPrice
                        //             }
                        //         ],selectI, 'Stock'))
                        //     }}
                        //
                        //     selectListFunc={(uuid, level) => {
                        //         if (uuid === 'all') {
                        //             dispatch(innerCalculateActions.getStockCardList({currentPage: 1}))
                        //         } else {
                        //             dispatch(editCalculateActions.getStockSomeCardList({uuid, level}))
                        //         }
                        //
                        //     }}
                        // />
                    }

                </div> : null
        )
    }
}
