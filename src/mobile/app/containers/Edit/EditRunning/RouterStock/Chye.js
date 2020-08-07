import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, XfInput, Single, Icon, Multiple } from 'app/components'

import { decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'


export default class Chye extends Component {
    state={
        visible: false,//序列号多选的显示
    }

    render () {
        const { dispatch, idx, cardData, oriState, warehouseList, isOpenedWarehouse, onClick, stockList, assistClick, batchList, serialMultipleList, isModify, oriUuid } = this.props
        const { visible } = this.state

        const onOk = (dataType, value) => dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx, 'CHYE'))

        const i = idx
        const v = cardData
        let reg = /^[-\d]\d*\.?\d{0,4}$/g
        const cardUuid = v.get('cardUuid')
        const warehouseCardUuid = v.get('warehouseCardUuid')
        const isOpenedQuantity = v.get('isOpenedQuantity')
        const unitName = v.get('unitName')
        const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
        const price = v.get('price') ? Number(v.get('price')) : 0
        const amount = v.get('amount') ? Number(v.get('amount')) : 0
        const unitPrice = v.get('unitPrice') ? Number(v.get('unitPrice')) : 0

        let unitList = []
        if (isOpenedQuantity) {
            const stockListArr = stockList.toJS()
            for (const item of stockListArr) {
                if (item['uuid']==v.get('cardUuid')) {
                    unitList.push({
                        key: item['unit']['name'],
                        value: item['unit']['uuid'],
                        basicUnitQuantity: 1,
                    })
                    item['unit']['unitList'].map(unitItem => {
                        unitList.push({
                            key: unitItem['name'],
                            value: unitItem['uuid'],
                            basicUnitQuantity: unitItem['basicUnitQuantity']
                        })
                    })
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

         const serialClick = (serialType) => {//流水入库  JR_OUT 流水出库
            let errorList = []
            if (!cardUuid) { return thirdParty.toast.info('请先选择存货卡片') }
            if (serialType == 'JR_OUT') {//出库 数量负数
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

                //获取所有的序列号列表
                dispatch(editRunningActions.getSerialListIn({inventoryUuid: cardUuid, warehouseUuid: warehouseCardUuid, assistList, batchUuid, oriUuid,}))

                if (quantity > 0) {//改变了调整方向
                    onOk('quantity', '')
                    onOk('serialList', fromJS([]))
                    onOk('amount', '')
                    this.setState({visible: true})
                    return
                }

                if (quantity && isModify && serialList.size==0) {//修改时获取当前选择的序列号列表
                    dispatch(editRunningActions.getSerialListChecked({inventoryUuid: cardUuid, outJrOriCardUuid: v.get('jrOriCardUuid') }, (serialList) => {
                        onOk('serialList', serialList)
                        this.setState({visible: true})
                    }))
                    return
                }

                this.setState({visible: true})
            }
            if (serialType == 'JR_ENTRY') {//流水入库 数量正数 或 ''
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
                            }
                        }
                    }), true))
                    global.routerHistory.push('/config/inventory/serial')
                }

                if (quantity < 0) {//改变了调整方向
                    onOk('quantity', '')
                    onOk('serialList', fromJS([]))
                    onOk('amount', '')
                    setSerial(fromJS([]))
                    return
                }

                if (quantity && isModify && serialList.size==0) {//修改时获取当前选择的序列号列表
                    dispatch(editRunningActions.getSerialListChecked({inventoryUuid: cardUuid, inType: 'J', inJrOriCardUuid: v.get('jrOriCardUuid') }, (serialList) => setSerial(serialList)))
                    return
                }
                setSerial(serialList)
            }
        } 

        return (
            <div className='lrls-card'>
                <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                    <span>存货明细({i+1})</span>
                </div>

                <div className='lrls-more-card lrls-bottom'>
                    <label>存货:</label>
                    <div className='lrls-single' onClick={() => {onClick()}}>
                        <Row className='lrls-category lrls-padding'>
                            {
                                v.get('cardUuid') ? <span> {`${v.get('code')} ${v.get('name')}`} </span>
                                : <span className='lrls-placeholder'>点击选择存货卡片</span>
                            }
                            <Icon type="triangle"/>
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
                           <Icon type="triangle"/>
                       </Row>
                    </div>
                </div>

                <div className='lrls-more-card lrls-bottom' style={{display: openBatch ? '' : 'none'}}>
                    <label>批次:</label>
                    <Single
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
                       <Row className='lrls-category lrls-padding' onClick={()=>{dispatch(editRunningActions.getBatchList(cardUuid))}}>
                           {
                               batchName ? <span>{batchName}</span>
                               : <span className='lrls-placeholder'>点击选择批次</span>
                           }
                           <Icon type="triangle" />
                       </Row>
                    </Single>
                </div>

                <div className='lrls-more-card lrls-bottom'
                    style={{display: isOpenedWarehouse ? '' : 'none'}}
                >
                    <label>仓库:</label>
                    <Single
                        className='lrls-single'
                        district={warehouseList.toJS()}
                        value={v.get('warehouseCardUuid') ? v.get('warehouseCardUuid') : ''}
                        onOk={value => {
                            onOk('warehouse', value, i)
                            if (v.get('cardUuid') && oriState!='STATE_CHYE_CH') {
                                dispatch(editRunningActions.getChyePrice([value], i))
                            }
                            if (openSerial) {
                                onOk('quantity', '')
                                onOk('serialList', fromJS([]))
                            }
                        }}
                    >
                        <Row className='lrls-category lrls-padding'>
                            {
                                v.get('warehouseCardUuid') ? <span> {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`} </span>
                                : <span className='lrls-placeholder'>点击选择仓库卡片</span>
                            }
                            <Icon type="triangle"/>
                        </Row>
                    </Single>
                </div>

                <Row className='yysr-amount lrls-bottom'
                    style={{display: isOpenedQuantity ? '' : 'none'}}
                >
                    <label>数量:</label>
                    { openSerial ?
                        <Single
                            className='chey-serial'
                            title='请选择调整方向'
                            canSearch={false}
                            district={[{key: '增加存货', value: 'JR_ENTRY'}, {key: '减少存货', value: 'JR_OUT'}]}
                            value={quantity >= 0 ? 'JR_ENTRY' : 'JR_OUT'}
                            onOk={value => { serialClick(value.value) }}
                            >
                                <div className='serial'>
                                    {quantity?<Amount decimalPlaces={4} decimalZero={false}>{quantity}</Amount>:'点击输入'}
                                    <Icon type="edit"/>
                                </div>
                        </Single> :
                        <XfInput.BorderInputItem
                            mode='number'
                            negativeAllowed={true}
                            placeholder='填写数量'
                            value={v.get('quantity')}
                            onChange={(value) => {
                                if (reg.test(value) || value == '') {
                                    onOk('quantity', value, i)
                                    if (value == '-') { return }        
                                    if (['STATE_CHYE', 'STATE_CHYE_CK'].includes(oriState)) {
                                        if (price) {
                                            const autoAmount = decimal(Number(value)*price)
                                            onOk('amount', autoAmount, i)
                                        }
                                    }
                                }                            
                            }}
                        />
                    }
                   
                    <Single
                        className='lrls-single'
                        district={unitList}
                        value={v.get('unitUuid')}
                        onOk={value => {
                            onOk('unit', value, i)
                            if (unitPrice && ['STATE_CHYE', 'STATE_CHYE_CK'].includes(oriState)) {
                                let price = decimal(unitPrice*value['basicUnitQuantity'])
                                onOk('price', price, i)
                                if (v.get('quantity')) {
                                    const autoAmount = decimal(price*quantity)
                                    onOk('amount', autoAmount, i)
                                }
                            }
                        }}
                    >
                       <Row className='lrls-account lrls-type'>
                           {
                               v.get('unitUuid') ? <span> {v.get('unitName')} </span>
                               : <span className='lrls-placeholder'>选择数量单位</span>
                           }
                           <Icon type="triangle" />
                       </Row>
                   </Single>
                </Row>

                <Row className='lrls-more-card lrls-bottom'
                    style={{display: isOpenedQuantity && ['STATE_CHYE','STATE_CHYE_CK'].includes(oriState) ? '' : 'none'}}
                >
                    <label>单价:</label>
                    <XfInput.BorderInputItem
                        mode='number'
                        negativeAllowed={true}
                        placeholder='填写单价'
                        value={v.get('price')}
                        onChange={(value) => {
                            if (reg.test(value) || value == '') {
                                onOk('price', value, i)
                                if (value == '-') {
                                    return
                                }
                                if (quantity) {
                                    const autoAmount = decimal(Number(value)*quantity)
                                    onOk('amount', autoAmount, i)
                                }

                            }
                        }}
                    />
                </Row>

                <Row className='lrls-more-card'>
                    <label>金额：</label>
                    <XfInput.BorderInputItem
                        mode='amount'
                        negativeAllowed={true}
                        placeholder='填写金额'
                        value={v.get('amount')}
                        onChange={(value) => {
                            if (/^[-\d]\d*\.?\d{0,2}$/g.test(value) || value == '') {
                                onOk('amount', value, i)
                                if (value == '-') {
                                    return
                                }

                                if (isOpenedQuantity) {
                                    if (['STATE_CHYE', 'STATE_CHYE_CK'].includes(oriState)) {
                                        if (quantity) {
                                            const autoPrice = decimal(Number(value)/quantity, 4)
                                            onOk('price', autoPrice, i)
                                        }
                                    }
                                }
                            }

                        }}
                    />
                </Row>

                <Multiple
                    visible={visible}
                    district={serialMultipleList}
                    value={serialList.toJS().map(v => v['serialUuid'])}
                    title={'选择序列号'}
                    showPreview={true}
                    previewTitle='已选择序列号'
                    onOk={(value) => {
                        this.setState({visible: false})
                        onOk('quantity', -value.length)
                        onOk('serialList', fromJS(value))

                        if (price > 0) {//计算金额
                            const autoAmount = decimal(price*Number(-value.length))
                            onOk('amount', autoAmount, i)
                            return
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
