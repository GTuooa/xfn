import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, XfInput, Single, Icon, Multiple } from 'app/components'

import { decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'

const SinglePortal = Single.SinglePortal

export default class StockCom extends Component {
    state={
        visible: false,//序列号多选的显示
    }

    render () {
        const { dispatch, idx, cardData, cardDisabled, stockCardList, stockListArr, isOpenedWarehouse, warehouseList, onClick, assistClick, batchList, oriState, serialMultipleList, isModify, oriUuid } = this.props
        const { visible, } = this.state

        const changeAmount = (value) => dispatch(editRunningActions.changeLrlsAmount(value))
        const onOk = (dataType, value) => dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx))

        const i = idx
        const v = cardData
        let totalAmount = 0
        stockCardList.forEach(v => totalAmount += Number(v.get('amount')))

        let unitList = [], unitPriceList = []
        const isOpenedQuantity = v.get('isOpenedQuantity')
        const cardUuid = v.get('cardUuid')
        const warehouseCardUuid = v.get('warehouseCardUuid')
        const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
        const price = v.get('price') ? Number(v.get('price')) : 0
        const amount = v.get('amount') ? Number(v.get('amount')) : 0
        if (isOpenedQuantity) {
            for (const item of stockListArr) {
                if (item['uuid']==v.get('cardUuid')) {
                    unitList.push({
                        key: item['unit']['name'],
                        value: item['unit']['uuid'],
                    })
                    item['unit']['unitList'].map(unitItem => {
                        unitList.push({
                            key: unitItem['name'],
                            value: unitItem['uuid'],
                        })
                    })
                    if (item['unitPriceList']) {
                        unitPriceList = item['unitPriceList']
                    }
                    break
                }
            }
        }

        //属性
        const openAssist = v.getIn(['financialInfo', 'openAssist'])//属性
        const openSerial = v.getIn(['financialInfo', 'openSerial'])//序列号
        const openBatch = v.getIn(['financialInfo', 'openBatch'])//批次
        const openShelfLife = v.getIn(['financialInfo', 'openShelfLife'])//保质期
        const shelfLife = v.getIn(['financialInfo', 'shelfLife'])//保质期天数
        const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])//选择的属性
        const serialList = v.get('serialList') ? v.get('serialList') : fromJS([])//选择的序列号
        const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
        const batch = v.get('batch') ? v.get('batch') : ''
        const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
        const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
        const batchName = expirationDate ? `${batch}(${expirationDate})` : batch
console.log(v.toJS());
        const serialClick = () => {
            let errorList = []
            if (!cardUuid) { return thirdParty.toast.info('请先选择存货卡片') }
            let serialType = 'JR_ENTRY'//流水入库  JR_OUT 流水出库
            let serialTypeModel = {
                STATE_YYSR_XS: 'preOutJrOriCardUuid', 
                STATE_YYSR_TS: 'preInJrOriCardUuid', 
                STATE_YYZC_GJ: 'inJrOriCardUuid',
                STATE_YYZC_TG: 'outJrOriCardUuid', 
            }[oriState]
            if (['STATE_YYSR_XS', 'STATE_YYZC_TG'].includes(oriState)) {//出库
                serialType = 'JR_OUT'
                let isPre = oriState == 'STATE_YYSR_XS'
                if (openAssist && assistList.size==0) {
                    errorList.push('请先选择完整的属性')
                }
                if (openBatch && !batch) {
                    errorList.push('请先选择批次')
                }
                if (isOpenedWarehouse && (!warehouseCardUuid)) {
                    errorList.push('请先选择仓库')
                }
                if (errorList.length) {
                    return thirdParty.toast.info(errorList[0])
                }

                const asyncFun = async () => {
                    //获取所有的序列号列表
                    await new Promise (resolve => {
                        dispatch(editRunningActions.getSerialListIn({inventoryUuid: cardUuid, warehouseUuid: warehouseCardUuid, assistList, batchUuid, oriUuid, isPre,}, resolve))
                    })
                    

                    if (quantity && isModify && serialList.size==0) {//修改时获取当前选择的序列号列表
                        await new Promise (resolve => {
                            dispatch(editRunningActions.getSerialListChecked({inventoryUuid: cardUuid, [serialTypeModel]: v.get('jrOriCardUuid') }, (serialList) => {
                                onOk('serialList', serialList)
                                resolve()
                            }, true))
                        })
                    }

                    this.setState({visible: true})
                }
                asyncFun()
            }
            if (serialType == 'JR_ENTRY') {//流水入库
                const setSerial = (serialList) => {
                    dispatch(editRunningConfigActions.changeInventoryData('serial', fromJS({
                        serialList,
                        type: 'JR_ENTRY',
                        afterAdd: (serialList) => {
                            const value = serialList.size
                            onOk('quantity', value)
                            onOk('serialList', serialList)

                            if (price > 0) {//计算金额
                                const autoAmount = decimal(price*Number(value))
                                onOk('amount', autoAmount)

                                const autoTotal = totalAmount  - Number(v.get('amount')) + Number(autoAmount)
                                changeAmount(decimal(autoTotal))
                            }
                        }
                    }), true))
                    global.routerHistory.push('/config/inventory/serial')
                }
                if (quantity && isModify && serialList.size==0) {//修改时获取当前选择的序列号列表
                    dispatch(editRunningActions.getSerialListChecked({inventoryUuid: cardUuid, inType: 'J', [serialTypeModel]: v.get('jrOriCardUuid') }, (serialList) => setSerial(serialList)))
                    return
                }
                setSerial(serialList)
            }
        }

        return (
            <div className='lrls-card'>
                <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                    <span>存货明细({idx+1})</span>
                </div>

                <div className='lrls-more-card lrls-bottom'>
                    <label>存货:</label>
                    <div className='lrls-single' onClick={()=>{ onClick() }}>
                       <Row className='lrls-category lrls-padding'>
                           {
                               v.get('cardUuid') ? <span> {`${v.get('code')} ${v.get('name')}`} </span>
                               : <span className='lrls-placeholder'>点击选择存货卡片</span>
                           }
                           <Icon type="triangle" color={cardDisabled ? '#999' : ''}/>
                       </Row>
                    </div>
                </div>

                <div className='lrls-more-card lrls-bottom' style={{display: openAssist ? '' : 'none'}}>
                    <label>属性:</label>
                    <div className='lrls-single' onClick={()=>{ assistClick() }}>
                       <Row className='lrls-category lrls-padding'>
                           {
                               assistName ? <span> {assistName} </span>
                               : <span className='lrls-placeholder'>点击选择属性</span>
                           }
                           <Icon type="triangle" color={cardDisabled ? '#999' : ''}/>
                       </Row>
                    </div>
                </div>

                <div className='lrls-more-card lrls-bottom' style={{display: openBatch ? '' : 'none'}}>
                    <label>批次:</label>
                    <SinglePortal
                        className='lrls-single'
                        district={batchList}
                        value={batch}
                        icon={{
                            type: 'add-plus',
                            onClick: () => {
                                dispatch(editRunningConfigActions.editInventoryBatch('MODIFY-INSERT', cardUuid, openShelfLife, shelfLife))
                            }
                        }}
                        iconTwo={{
                            type: 'home',
                            onClick: () => {
                                dispatch(editRunningConfigActions.editInventoryBatch('MODIFY-MODIFY', cardUuid, openShelfLife, shelfLife))
                            }
                        }}
                        onOk={value => {
                            onOk('bitch', fromJS({
                                batch: value['batch'],
                                batchUuid: value['batchUuid'],
                                expirationDate: value['expirationDate']
                            }))
                            if (openSerial) {
                                onOk('quantity', '')
                                onOk('serialList', fromJS([]))
                            }
                        }}
                    >
                       <Row className='lrls-category lrls-padding' onClick={() => { dispatch(editRunningActions.getBatchList(cardUuid)) }}>
                           {
                               batchName ? <span>{batchName}</span>
                               : <span className='lrls-placeholder'>点击选择批次</span>
                           }
                           <Icon type="triangle" />
                       </Row>
                    </SinglePortal>
                </div>

                <div className='lrls-more-card lrls-bottom' style={{display: isOpenedWarehouse ? '' : 'none'}}>
                    <label>仓库:</label>
                    <SinglePortal
                        className='lrls-single'
                        district={warehouseList.toJS()}
                        value={v.get('warehouseCardUuid')}
                        onOk={value => {
                            onOk('warehouse', value)
                            if (openSerial) {
                                onOk('quantity', '')
                                onOk('serialList', fromJS([]))
                            }
                        }}
                    >
                       <Row className='lrls-category lrls-padding'>
                           {
                               v.get('warehouseCardUuid') ? <span> {v.get('warehouseCardCode')} {v.get('warehouseCardName')} </span>
                               : <span className='lrls-placeholder'>点击选择仓库卡片</span>
                           }
                           <Icon type="triangle" />
                       </Row>
                    </SinglePortal>
                </div>

                <Row className={'yysr-amount lrls-bottom'} style={{display: isOpenedQuantity ? '' : 'none'}}>
                    <label>数量:</label>
                    { openSerial ?
                        <span className='serial' style={{display: (openSerial) ? '' : 'none'}} onClick={() => serialClick()}>
                            {quantity?<Amount decimalPlaces={4} decimalZero={false}>{quantity}</Amount>:'点击输入'}
                            <Icon type="edit"/>
                        </span> :
                        <XfInput.BorderInputItem
                            mode='number'
                            placeholder='填写数量'
                            value={v.get('quantity')}
                            onChange={(value) => {
                                if (/^\d*\.?\d{0,4}$/g.test(value)) {
                                    onOk('quantity', value)

                                    if (price > 0) {//计算金额
                                        const autoAmount = decimal(price*Number(value))
                                        onOk('amount', autoAmount)

                                        const autoTotal = totalAmount  - Number(v.get('amount')) + Number(autoAmount)
                                        changeAmount(decimal(autoTotal))
                                        return
                                    }

                                }
                            }}
                        />
                    }
                    <SinglePortal
                        className='lrls-single'
                        district={unitList}
                        value={v.get('unitUuid')}
                        onOk={value => {
                            onOk('unit', value)
                            //填写默认单价
                            unitPriceList.map(itemPrice => {
                                if (value.value==itemPrice['unitUuid']) {
                                    onOk('price', itemPrice['defaultPrice'])
                                    if (quantity > 0) {//计算金额
                                        const autoAmount = decimal(quantity*Number(itemPrice['defaultPrice']))
                                        onOk('amount', autoAmount)

                                        const autoTotal = totalAmount  - Number(v.get('amount')) + Number(autoAmount)
                                        changeAmount(decimal(autoTotal))
                                    }
                                }
                            })
                        }}
                    >
                       <Row className='lrls-account lrls-type'>
                           {
                               v.get('unitUuid') ? <span> {v.get('unitName')} </span>
                               : <span className='lrls-placeholder'>选择数量单位</span>
                           }
                           <Icon type="triangle" />
                       </Row>
                    </SinglePortal>
                </Row>

                <div className='lrls-more-card lrls-bottom' style={{display: isOpenedQuantity ? '' : 'none'}}>
                    <label>单价:</label>
                    <XfInput.BorderInputItem
                        mode='number'
                        placeholder='请填写单价'
                        value={v.get('price')}
                        onChange={(value) => {
                            if (/^\d*\.?\d{0,4}$/g.test(value)) {
                                onOk('price', value, i)

                                if (quantity > 0) {//计算金额
                                    const autoAmount = decimal(quantity*Number(value))
                                    onOk('amount', autoAmount, i)

                                    const autoTotal = totalAmount  - Number(v.get('amount')) + Number(autoAmount)
                                    changeAmount(decimal(autoTotal))
                                }
                            }
                        }}
                    />
                </div>

                <div className='lrls-more-card'
                    onClick={() => {
                        if (!v.get('cardUuid')) {
                            thirdParty.toast.info('请先选择存货卡片')
                        }
                    }}
                >
                    <label>金额:</label>
                    <XfInput.BorderInputItem
                        mode='amount'
                        disabled={cardDisabled || (v.get('cardUuid') ? false : true)}
                        placeholder='请填写金额'
                        value={v.get('amount')}
                        onChange={(value) => {
                            if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                onOk('amount', value, i)
                                const autoTotal = totalAmount - Number(v.get('amount')) + Number(value)
                                changeAmount(decimal(autoTotal))

                                if (quantity > 0) {//计算价格
                                    const autoPrice = decimal(Number(value)/quantity, 4)
                                    onOk('price', autoPrice, i)
                                    return
                                }
                            }
                        }}
                    />
                </div>

                <Multiple
                    visible={visible}
                    district={serialMultipleList}
                    value={serialList.toJS().map(v => v['serialUuid'])}
                    title={'选择序列号'}
                    showPreview={true}
                    previewTitle='已选择序列号'
                    onOk={(value) => {
                        this.setState({visible: false})
                        onOk('quantity', value.length)
                        onOk('serialList', fromJS(value))

                        if (price > 0) {//计算金额
                            const autoAmount = decimal(price*Number(value.length))
                            onOk('amount', autoAmount)

                            const autoTotal = totalAmount - Number(amount) + Number(autoAmount)
                            changeAmount(decimal(autoTotal))
                        }

                    }}
                    onCancel={() => { this.setState({visible: false}) }}
                >
                    <span></span>
                </Multiple>
            </div>
        )
    }
}
