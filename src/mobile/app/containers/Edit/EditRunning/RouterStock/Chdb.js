import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, XfInput, Single, Icon, Multiple } from 'app/components'

import { decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'


export default class Chdb extends Component {
    state={
        visible: false,//序列号多选的显示
    }

    render () {
        const { dispatch, idx, cardData, onClick, stockListArr, warehouseCardUuid, assistClick, batchList, serialMultipleList, isModify, oriUuid } = this.props
        const { visible } = this.state

        const onOk = (dataType, value) => dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx, 'CHDB'))

        const i = idx
        const v = cardData
        const isOpenedQuantity = v.get('isOpenedQuantity')
        const cardUuid = v.get('cardUuid')
        const isUniformPrice = v.get('isUniformPrice')
        const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
        const price = v.get('price') ? Number(v.get('price')) : 0
        const amount = v.get('amount') ? Number(v.get('amount')) : 0
        let unitList = []

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
            if (openAssist && assistList.size==0) {
                errorList.push('请先选择完整的属性')
            }
            if (openBatch && !batch) {
                errorList.push('请先选择批次')
            }
            if (!warehouseCardUuid) {
                errorList.push('请先选择调出仓库')
            }
            if (errorList.length) {
                return thirdParty.toast.info(errorList[0])
            }

            const asyncFun = async () => {
                //获取所有的序列号列表
                await new Promise (resolve => {
                    dispatch(editRunningActions.getSerialListIn({inventoryUuid: cardUuid, warehouseUuid: warehouseCardUuid, assistList, batchUuid, oriUuid,}, resolve))
                })

                if (quantity && isModify && serialList.size==0) {//修改时获取当前选择的序列号列表
                    await new Promise (resolve => {
                        dispatch(editRunningActions.getSerialListChecked({inventoryUuid: cardUuid, outJrOriCardUuid: v.get('jrOriCardUuid') }, (serialList) => {
                            onOk('serialList', serialList)
                            resolve()
                        }, true))
                    })
                }

                this.setState({visible: true})
            }
            asyncFun()
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

                <Row className='yysr-amount lrls-bottom' style={{display: isOpenedQuantity ? '' : 'none'}}>
                    <label>数量:</label>
                    { openSerial ?
                        <span className='serial' style={{display: (openSerial) ? '' : 'none', flex: 1, textAlign: 'left'}}
                            onClick={() => serialClick()}>
                            {quantity?<Amount decimalPlaces={4} decimalZero={false}>{quantity}</Amount>:'点击输入'}
                            <Icon type="edit"/>
                        </span> :
                        <XfInput.BorderInputItem
                            mode='number'
                            placeholder='填写数量'
                            value={v.get('quantity')}
                            onChange={(value) => {
                                if (/^\d*\.?\d{0,4}$/g.test(value)) {
                                    onOk('quantity', value, i)

                                    if (price > 0) {//计算金额
                                        const autoAmount = decimal(price*Number(value))
                                        onOk('amount', autoAmount, i)
                                        return
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
                            if (v.get('unitPrice')) {
                                const basicUnitQuantity = value['basicUnitQuantity'] ? value['basicUnitQuantity'] : 1
                                let price = decimal(v.get('unitPrice')*Number(basicUnitQuantity))
                                onOk('price', price, i)
                                if (v.get('quantity')) {
                                    const autoAmount = decimal(price*Number(v.get('quantity')))
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

                <Row className='lrls-more-card lrls-bottom' style={{display: isOpenedQuantity ? '' : 'none'}}>
                    <label>单价：</label>
                    <XfInput.BorderInputItem
                        mode='number'
                        //disabled={isUniformPrice}
                        placeholder='填写单价'
                        value={v.get('price')}
                        onChange={(value) => {
                            if (/^\d*\.?\d{0,4}$/g.test(value)) {
                                onOk('price', value, i)
                                if (quantity > 0) {//计算金额
                                    const autoAmount = decimal(quantity*Number(value))
                                    onOk('amount', autoAmount, i)
                                }
                            }
                        }}
                    />
                    <span className='lrls-margin-left' style={{display: v.get('unitPrice') ? '' : 'none'}}>
                        {isUniformPrice ? '统一单价：' : '参考单价：'}
                        <Amount>{v.get('unitPrice')}</Amount>
                    </span>
                </Row>

                <Row className='lrls-more-card lrls-bottom'>
                    <label>金额：</label>
                    <XfInput.BorderInputItem
                        mode='amount'
                        //disabled={isUniformPrice}
                        placeholder='填写成本金额'
                        value={v.get('amount')}
                        onChange={(value) => {
                            if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                onOk('amount', value, i)
                            }
                            if (isOpenedQuantity) {
                                if (quantity > 0) {//计算价格
                                    const autoPrice = decimal(Number(value)/quantity, 4)
                                    onOk('price', autoPrice, i)
                                    return
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
                        onOk('quantity', value.length)
                        onOk('serialList', fromJS(value))

                        if (price > 0) {//计算金额
                            const autoAmount = decimal(price*Number(value.length))
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