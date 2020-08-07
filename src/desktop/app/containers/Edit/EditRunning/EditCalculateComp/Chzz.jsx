import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { formatMoney, numberCalculate } from 'app/utils'
import { DatePicker, Input, Select, message, Tree, Icon, Radio, Button, Modal } from 'antd'
import NumberInput from 'app/components/Input'
import XfIcon from 'app/components/Icon'
const Option = Select.Option
const RadioGroup = Radio.Group
import { fromJS } from 'immutable'
import moment from 'moment'

import * as Limit from 'app/constants/Limit.js'
import { Amount } from 'app/components'
import StockModal from './component/StockModal'
import CategorySelect from './component/CategorySelect'
import { numberTest } from './component/numberTest'
import Inventory from './stock/Inventory'
import AssemblySheetModal from './stock/AssemblySheetModal'
import AssemblySheetContain from './stock/AssemblySheetContain'
import TotalMaterial from './stock/TotalMaterial'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@immutableRenderDecorator
export default
    class Chzz extends React.Component {

    static displayName = 'Chzz'

    constructor() {
        super()
        this.state = {
            showSingleInventoryModal: false,
            selectTreeUuid: 'all',
            selectTreeLevel: 0,
        }
    }
    render() {
        const {
            dispatch,
            StockBuildUpTemp,
            hideCategoryList,
            insertOrModify,
            paymentType,
            disabledDate,
            commonCardObj,
            enableWarehouse,
            openQuantity,
            calculateViews,
            serialList
        } = this.props
        const { showSingleInventoryModal,selectTreeUuid, selectTreeLevel } = this.state
        const reg = /^-{0,1}\d*\.?\d{0,2}$/
        const paymentTypeStr = calculateViews.get('paymentTypeStr')

        const modify = insertOrModify === 'modify' ? true : false
        const oriDate = this.props.oriDate
        const oriAbstract = StockBuildUpTemp.get('oriAbstract')
        const runningIndex = StockBuildUpTemp.get('runningIndex')
        const jrIndex = StockBuildUpTemp.get('jrIndex')
        const oriState = StockBuildUpTemp.get('oriState')
        const amount = StockBuildUpTemp.get('amount') ? StockBuildUpTemp.get('amount') : 0
        const stockCardList = StockBuildUpTemp.get('stockCardList')
        const stockCardOtherList = StockBuildUpTemp.get('stockCardOtherList')
        const oriStockCardList = StockBuildUpTemp.get('oriStockCardList')
        const oriStockCardOtherList = StockBuildUpTemp.get('oriStockCardOtherList')
        const allStockCardList = StockBuildUpTemp.get('allStockCardList')
        const stockCardUuidList = StockBuildUpTemp.get('stockCardUuidList')
        const wareHouseCardList = StockBuildUpTemp.get('wareHouseCardList')
        const assemblySheet = StockBuildUpTemp.get('assemblySheet')
        const allWareHouseCardList = StockBuildUpTemp.get('allWareHouseCardList')
        const assemblyNumber = StockBuildUpTemp.get('assemblyNumber')
        const curItemIsAvailable = StockBuildUpTemp.get('curItemIsAvailable')
        const oriUuid = StockBuildUpTemp.get('oriUuid')
        const selectI = calculateViews.get('selectI')

        const showSingleModal = commonCardObj.get('showSingleModal')
        const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        const cardPageObj = commonCardObj.get('cardPageObj')
        const selectThingsList = commonCardObj.get('selectThingsList')
        const modalName = commonCardObj.get('modalName')
        let toWareHouse = {}, fromWareHouse = {}


        let totalCbAmount = 0.00

        let stockCardIdList = [], selectUuidForPrice = [],selectOtherForPrice = []
        stockCardList && stockCardList.toJS().map(v => {
            stockCardIdList.push(v.cardUuid)

            if(oriState === 'STATE_CHZZ_ZZCX'){
                v.cardUuid = v.materialUuid,
                v.storeUuid = v.warehouseCardUuid ? v.warehouseCardUuid : '',
                v.assistList = v.assistList,
                v.batchUuid = v.batchUuid,
                v.isUniformPrice = v.isUniformPrice,
                v.index = 0,
                v.noNeedPrice = false,
                v.moreUnit = v['unit'] && v['unit']['unitList'] && v['unit']['unitList'].length
                selectUuidForPrice.push(v)
            }
        })

        stockCardOtherList && stockCardOtherList.size && stockCardOtherList.toJS().map(v => {
            if(oriState === 'STATE_CHZZ_ZZCX'){
                v.cardUuid = v.materialUuid,
                v.storeUuid = v.warehouseCardUuid ? v.warehouseCardUuid : '',
                v.assistList = v.assistList,
                v.batchUuid = v.batchUuid,
                v.isUniformPrice = v.isUniformPrice,
                v.index = 0,
                v.noNeedPrice = false,
                v.moreUnit = v['unit'] && v['unit']['unitList'] && v['unit']['unitList'].length
                selectOtherForPrice.push(v)
            }
        })
        let zzdNewItem = []
        if(oriState === 'STATE_CHZZ_ZZD'){
            zzdNewItem = assemblySheet.toJS().length && assemblySheet.toJS().map((item,i) => {
                const multiple = numberCalculate(item.curQuantity,item.quantity,4,'divide',4)
                return {
                    ...item,
                    materialList:item.materialList && item.materialList.length && item.materialList.map((v,j) => {

                        const openSerial = v['financialInfo'] && v['financialInfo']['openSerial']
                        v.cardUuid = v.materialUuid
                        v.storeUuid = v.warehouseCardUuid ? v.warehouseCardUuid : ''
                        v.quantity = openSerial ? '' : numberCalculate(multiple,v.quantity,4,'multiply',4)
                        v.parentIndex = i
                        selectUuidForPrice.push(v)

                        return v
                    }) || []
                }
            }) || []
        }
        // const singlethingsList = thingsList.size ? thingsList.filter(item => stockCardIdList.indexOf(item.get('uuid')) === -1) : fromJS([])

        const stockTotalAmount = stockCardList.reduce((pre,cur) => pre += Number(cur.get('amount') || 0),0)
        const stockOtherTotalAmount = stockCardOtherList.reduce((pre,cur) => pre += Number(cur.get('amount') || 0),0)

        return (
            paymentType === 'LB_CHZZ' ?
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
                                                dispatch(editCalculateActions.changeEditCalculateCommonState('StockBuildUpTemp', 'jrIndex', e.target.value))
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
                                    // if(selectUuidForPrice.length > 0 ){
                                    //     if(oriState === 'STATE_CHZZ_ZZD'){
                                    //         dispatch(editCalculateActions.getStockBuildUpPrice(date,selectUuidForPrice, 0,'StockBuildUp','assemblySheet'))
                                    //     }else{
                                    //         dispatch(editCalculateActions.getStockBuildUpPrice(date,selectUuidForPrice, 0,'StockBuildUp','notFinish'))
                                    //     }
                                    // }
                                    // if(selectOtherForPrice.length > 0 ){
                                    //     dispatch(editCalculateActions.getStockBuildUpPrice(date,selectOtherForPrice, 0,'StockBuildUp','finish'))
                                    // }
                                    if(oriState === 'STATE_CHZZ_ZZCX' ){
                                        selectUuidForPrice.length + selectOtherForPrice.length > 0 && dispatch(innerCalculateActions.getModifyStockPrice(date,selectUuidForPrice.concat(selectOtherForPrice),'StockBuildUp','stockCardList','stock',[],true))
                                    }else{
                                        selectUuidForPrice.length > 0 && dispatch(innerCalculateActions.getModifyStockPrice(date,selectUuidForPrice,'StockBuildUp','stockCardList','Assembly',zzdNewItem,true))
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
                    <div className="edit-running-modal-list-item">
                        <label></label>
                        <div>
                            <RadioGroup
                                value={oriState}
                                disabled={insertOrModify === 'modify'}
                                onChange={e => {
                                    dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', 'oriState', e.target.value))
                                    dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', 'stockCardList', fromJS([{}])))
                                    dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', 'stockCardOtherList', fromJS([{}])))
                                    dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', 'assemblySheet', fromJS([])))

                                }}>
                                <Radio key="a" value={'STATE_CHZZ_ZZCX'}>组装拆卸</Radio>
                                {
                                    openQuantity ?
                                    <Radio key="b" value={'STATE_CHZZ_ZZD'} >组装单组装</Radio> : null
                                }
                            </RadioGroup>
                        </div>
                    </div>
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
                                    dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', 'oriAbstract', e.target.value))
                                }}
                            />
                        </div>
                    </div>
                    {
                        oriState === 'STATE_CHZZ_ZZD' && assemblySheet.size?
                        <AssemblySheetContain
                            dispatch={dispatch}
                            stockCardList={stockCardOtherList}
                            stockList={allStockCardList}
                            stockRange={[]}
                            amount={amount}
                            oriDate={oriDate}
                            oriUuid={oriUuid}
                            oriState={oriState}
                            amountDisable={true}
                            assemblyNumber={assemblyNumber}
                            showSingleModal={showSingleModal}
                            MemberList={memberList}
                            selectThingsList={selectThingsList}
                            thingsList={thingsList}
                            // categoryTypeObj={categoryTypeObj}
                            carryoverCardList={allWareHouseCardList}
                            currentCardType={'stock'}
                            warehouseList={wareHouseCardList}
                            insertOrModify={insertOrModify}
                            enableWarehouse={enableWarehouse}
                            openQuantity={openQuantity}
                            oriStockTemplate={oriStockCardOtherList}
                            sectionTemp={'StockBuildUp'}
                            assemblySheet={assemblySheet}
                            selectList={selectList}
                            selectItem={selectItem}
                            curItemIsAvailable={curItemIsAvailable}
                            serialList={serialList}
                            cardPageObj={cardPageObj}
                        />
                        : null
                    }


                    {
                        oriState === 'STATE_CHZZ_ZZCX' ?
                        <Inventory
                            dispatch={dispatch}
                            stockCardList={stockCardList}
                            stockAllLength={numberCalculate(stockCardList.size,stockCardOtherList.size)}
                            stockList={allStockCardList}
                            stockRange={[]}
                            amount={amount}
                            oriDate={oriDate}
                            oriUuid={oriUuid}
                            oriState={oriState}
                            showSingleModal={showSingleModal}
                            MemberList={memberList}
                            selectThingsList={selectThingsList}
                            thingsList={thingsList}
                            // categoryTypeObj={categoryTypeObj}
                            carryoverCardList={allWareHouseCardList}
                            currentCardType={'stock'}
                            selectedKeys={selectedKeys}
                            warehouseList={wareHouseCardList}
                            insertOrModify={insertOrModify}
                            enableWarehouse={enableWarehouse}
                            openQuantity={openQuantity}
                            selectList={selectList}
                            // showStockModal={showStockModal}
                            selectItem={selectItem}
                            stockTitleName={'物料'}
                            needTotalAmount={true}
                            stockTemplate={'stockCardList'}
                            oriStockTemplate={oriStockCardList}
                            sectionTemp={'StockBuildUp'}
                            amountDisable={false}
                            needHidePrice={false}
                            serialList={serialList}
                            assemblyNumber={assemblyNumber}
                            selectTreeCallBack={(uuid,level)=>{
                                if (uuid === 'all') {
                                    dispatch(innerCalculateActions.getStockCardList({temp: 'StockBuildUpTemp', currentPage: 1}))
                                } else {
                                    dispatch(editCalculateActions.getStockSomeCardList({uuid, level, currentPage: 1}))
                                }
                                this.setState({
                                    selectTreeUuid: uuid,
                                    selectTreeLevel: level
                                })
                            }}
                            callback={()=> {
                                const chooseIndex = stockCardList.size
                                let selectUuidList = []
                                selectItem && selectItem.size && selectItem.map((item, index) => {
                                    selectUuidList.push({
                                        cardUuid: item.get('uuid'),
                                        storeUuid: '',
                                        assistList: item.get('assistList'),
                                        batchUuid: item.get('batchUuid'),
                                        isUniformPrice: item.get('isUniformPrice'),
                                        index: chooseIndex + index,
                                        noNeedPrice: false,
                                        moreUnit: item.getIn(['unit','unitList']) && item.getIn(['unit','unitList']).size

                                    })

                                })
                                if(selectUuidList.length > 0){
                                    dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, chooseIndex,'StockBuildUp','notFinish'))
                                }
                            }}
                            cardPageObj={cardPageObj}
                            cardPaginationCallBack={(value)=>{
                                if (selectTreeUuid === 'all') {
                                    dispatch(innerCalculateActions.getStockCardList({temp: 'StockBuildUpTemp', currentPage: value}))
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
                            amountOnKeyDown={(callBackObj)=>{
                                const { keyCode, curAmount, curQuantity, curIndex } = callBackObj
                                if(keyCode === Limit.EQUAL_KEY_CODE){
                                    const allAmount = numberCalculate(stockTotalAmount,curAmount,2,'subtract')
                                    const value = numberCalculate(stockOtherTotalAmount,allAmount,2,'subtract')
                                    if(value > 0){
                                        dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', ['stockCardList',curIndex,'amount'], value))
                                        if (curQuantity > 0 ) {
                                            const price = numberCalculate(value, curQuantity,4,'divide',4)
                                            dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', ['stockCardList',curIndex,'price'], price))
                                        }
                                    }
                                }
                            }}
                        /> : null
                    }
                    {
                        oriState === 'STATE_CHZZ_ZZCX'  ?
                        <Inventory
                            dispatch={dispatch}
                            stockCardList={stockCardOtherList}
                            stockAllLength={numberCalculate(stockCardList.size,stockCardOtherList.size)}
                            stockList={allStockCardList}
                            stockRange={[]}
                            amount={amount}
                            oriDate={oriDate}
                            oriUuid={oriUuid}
                            oriState={oriState}
                            amountDisable={true}
                            assemblyNumber={assemblyNumber}
                            showSingleModal={showSingleModal}
                            MemberList={memberList}
                            selectThingsList={selectThingsList}
                            thingsList={thingsList}
                            // categoryTypeObj={categoryTypeObj}
                            carryoverCardList={allWareHouseCardList}
                            currentCardType={'stock'}
                            selectedKeys={selectedKeys}
                            warehouseList={wareHouseCardList}
                            insertOrModify={insertOrModify}
                            enableWarehouse={enableWarehouse}
                            openQuantity={openQuantity}
                            selectList={selectList}
                            // showStockModal={showStockModal}
                            selectItem={selectItem}
                            stockTitleName={'成品'}
                            needTotalAmount={true}
                            stockTemplate={'stockCardOtherList'}
                            oriStockCardList={oriStockCardList}
                            sectionTemp={'StockBuildUp'}
                            serialList={serialList}
                            needHidePrice={false}
                            selectTreeCallBack={(uuid,level)=>{
                                if (uuid === 'all') {
                                    dispatch(editCalculateActions.getStockCardList('StockBuildUpTemp'))
                                } else {
                                    dispatch(editCalculateActions.getStockSomeCardList({uuid, level, currentPage: 1}))
                                }
                                this.setState({
                                    selectTreeUuid: uuid,
                                    selectTreeLevel: level
                                })
                            }}
                            callback={()=> {
                                const chooseIndex = stockCardOtherList.size
                                let selectUuidList = []
                                selectItem && selectItem.size && selectItem.map((item, index) => {
                                    selectUuidList.push({
                                        cardUuid: item.get('uuid'),
                                        storeUuid: '',
                                        assistList: item.get('assistList'),
                                        batchUuid: item.get('batchUuid'),
                                        isUniformPrice: item.get('isUniformPrice'),
                                        index: chooseIndex + index,
                                        noNeedPrice: false,
                                        moreUnit: item.getIn(['unit','unitList']) && item.getIn(['unit','unitList']).size
                                    })

                                })
                                if(selectUuidList.length > 0 ){
                                    dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, chooseIndex,'StockBuildUp','finish'))
                                }
                            }}
                            cardPageObj={cardPageObj}
                            cardPaginationCallBack={(value)=>{
                                if (selectTreeUuid === 'all') {
                                    dispatch(innerCalculateActions.getStockCardList({temp: 'StockBuildUpTemp', currentPage: value}))
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
                            amountOnKeyDown={(callBackObj)=>{
                                const { keyCode, curAmount, curQuantity, curIndex } = callBackObj
                                if(keyCode === Limit.EQUAL_KEY_CODE){
                                    const allAmount = numberCalculate(stockOtherTotalAmount,curAmount,2,'subtract')
                                    const value = numberCalculate(stockTotalAmount,allAmount,2,'subtract')
                                    if(value > 0){
                                        dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', ['stockCardOtherList',curIndex,'amount'], value))
                                        if (curQuantity > 0 ) {
                                            const price = numberCalculate(value, curQuantity,4,'divide',4)
                                            dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', ['stockCardOtherList',curIndex,'price'], price))
                                        }
                                    }
                                }
                            }}
                        /> : null
                    }

                    {
                        oriState === 'STATE_CHZZ_ZZD' ?
                        <div className="edit-running-modal-list-item" >
                            <div  className='calculate-inventory-button'>
                                <Button
                                    onClick={() => {
                                        this.setState({
                                            showSingleInventoryModal: true
                                        })
                                        dispatch(editCalculateActions.getStockBuildUpAssembly('',1,true,1))

                                    }}
                                >
                                    <XfIcon type='big-plus' /> &nbsp;添加组装单
                                </Button>
                                <Button
                                    style={{marginLeft:'10px'}}
                                    onClick={() => {
                                        dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showall', true))
                                        dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'isAssembly', true))
                                        dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'isCount', false))
                                        dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'isProduct', false))
                                    }}
                                >
                                    <XfIcon type='upload' /> &nbsp;导入组装单
                                </Button>
                            </div>

                        </div> : null
                    }
                    {
                        oriState === 'STATE_CHZZ_ZZD' && assemblySheet.size ?
                        <TotalMaterial
                            assemblySheet={assemblySheet}
                            enableWarehouse={enableWarehouse}
                        /> : null
                    }
                    <AssemblySheetModal
                        showCommonChargeModal={showSingleInventoryModal}
                        MemberList={memberList}
                        thingsList={thingsList}
                        dispatch={dispatch}
                        oriState={oriState}
                        oriUuid={oriUuid}
                        selectedKeys={selectedKeys}
                        selectItem={selectItem}
                        selectList={selectList}
                        assemblySheet={assemblySheet}
                        assemblyNumber={assemblyNumber}
                        sectionTemp={'StockBuildUp'}
                        serialList={fromJS([])}
                        cancel={() => {
                            this.setState({ showSingleInventoryModal: false })
                        }}
                        title={'选择存货'}
                        callback={(assemblySheet,curSelectItem) => {
                            const curSelectItemToJS = curSelectItem.toJS()
                            const assemblySheetToJS = assemblySheet.toJS()
                            const chooseStockIndex = assemblySheet.size
                            let selectUuidList = []
                            const newitem = curSelectItemToJS.length && curSelectItemToJS.map((item,i) => {
                                const multiple = numberCalculate(item.curQuantity,item.quantity,4,'divide',4)
                                return {
                                    ...item,
                                    materialList:item.materialList && item.materialList.length && item.materialList.map((v,j) => {

                                        const openSerial = v['financialInfo']['openSerial']
                                        v.cardUuid = v.materialUuid
                                        v.storeUuid = v.warehouseCardUuid ? v.warehouseCardUuid : ''
                                        v.quantity = openSerial ? '' : numberCalculate(multiple,v.quantity,4,'multiply',4)
                                        v.parentIndex = i
                                        selectUuidList.push(v)

                                        return v
                                    }) || []
                                }
                            }) || []

                            if(selectUuidList.length > 0 ){
                                dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, chooseStockIndex,'StockBuildUp','assemblySheet',newitem))
                            }
                            this.setState({
                                selectTreeUuid: 'all',
                                selectTreeLevel: 0
                            })

                        }}

                        selectTreeFunc={(uuid, level) => {
                            if (uuid === 'all') {
                                dispatch(editCalculateActions.getStockBuildUpAssembly('',1,false,1))
                            } else {
                                dispatch(editCalculateActions.getStockBuildUpAssembly(uuid, level,false,1))
                            }
                            this.setState({
                                selectTreeUuid: uuid,
                                selectTreeLevel: level
                            })

                        }}
                        cardPageObj={cardPageObj}
                        cardPaginationCallBack={(value)=>{
                            if (selectTreeUuid === 'all') {
                                dispatch(editCalculateActions.getStockBuildUpAssembly('',1,false,value))
                            } else {
                                dispatch(editCalculateActions.getStockBuildUpAssembly(selectTreeUuid, selectTreeLevel,false,value))
                            }
                        }}
                    />

                </div> : null
        )
    }
}
