import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, XfInput, Single, Icon, ChosenPicker, Multiple } from 'app/components'
import AssistSelect from './AssistSelect.jsx'

import { decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'

const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

export default class ChzzZzd extends Component {
    state = {
        isAll: true,
        visible: false,
        categoryValue: 'ALL',
        childIdx: [],
        serialVisible: false,//序列号多选的显示
        assistVisible: false,//物料属性选择
    }
    //物料的属性
    assistClassificationList = []//卡片属性列表
    oriAssistList = [] //当前选中的属性
    openSerial = false//当前选中的物料是否开启序列号
    serialList = fromJS([])
    price = ''

    render () {
        const { dispatch, idx, cardType, cardData, onClick, stockList, warehouseList, isOpenedWarehouse, isModify, assemblyList, stockCategoryList, commonCardList, assistClick, batchList, serialMultipleList, oriUuid } = this.props
        const { isAll, visible, categoryValue, childIdx, serialVisible, assistVisible, } = this.state

        const onOk = (dataType, value, idx, categoryType='CHZZ_ZZD') => {
            if (categoryType=='CHZZ_ZZD_CHILD' && ['quantity', 'price', 'amount', 'unitUuid', 'unitName', 'bitch', 'serialList', 'assistList'].includes(dataType)) {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'stockCardList', idx[0], 'childCardList', idx[1], dataType], value))
                return
            }
            dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx, categoryType, 'stockCardList'))
        }

        // 成品修改数量
        const showPrompt = (idx, stockCardItem) => {
            thirdParty.Prompt({
                title: '成品数量',
                message: `${isModify ? '修改组装数量' : '请输入组装数量'}`,
                buttonLabels: ['取消', '确认'],
                onSuccess: (result) => {
                    if (result.buttonIndex === 1) {
                        if (/^\d*\.?\d{0,2}$/g.test(result.value) && result.value > 0) {
                            let isAvailable = false
                            for (const item of assemblyList) {
                                if (item['uuid']==stockCardItem['cardUuid']) {
                                    isAvailable = item['isAvailable']
                                    break
                                }
                            }

                            if (!isAvailable) {//失效的
                                thirdParty.toast.info('组装单设置已失效，无法获取物料详情')
                                onOk('quantity', result.value, idx)
                                return
                            }
                            onOk('quantity_zzd', result.value, idx)
                            dispatch(editRunningActions.getChzzZzdListPrice(idx))

                        } else {
                            thirdParty.toast.info('请输入组装数量')
                        }
                    }
                }
            })
        }

        let categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
        stockCategoryList.map(v => { categoryList.push(v.toJS()) })
        loop(categoryList)

        //物料选择列表
        let stockListArr = isAll ? stockList.toJS() : commonCardList
        stockListArr.map(v => { v['name'] = v['key'] })

        const i = idx
        const v = cardData
        let unitList = []
        const isOpenedQuantity = v.get('isOpenedQuantity')
        const cardUuid = v.get('cardUuid')
        const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
        const childCardListSize = v.get('childCardList').size
        const warehouseCardUuid = v.get('warehouseCardUuid')

        let amount = 0, price = 0
        v.get('childCardList').map(child => {
            amount += Number(child.get('amount'))
        })
        if (quantity) {
            price = Number(amount)/Number(quantity)
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
            const setSerial = (serialList) => {
                dispatch(editRunningConfigActions.changeInventoryData('serial', fromJS({
                    serialList,
                    type: 'JR_ENTRY',
                    afterAdd: (serialList) => {
                        const value = serialList.size
                        onOk('serialList', serialList, i)

                        let isAvailable = false
                        for (const item of assemblyList) {
                            if (item['uuid']==v.toJS()['cardUuid']) {
                                isAvailable = item['isAvailable']
                                break
                            }
                        }

                        if (!isAvailable) {//失效的
                            thirdParty.toast.info('组装单设置已失效，无法获取物料详情')
                            onOk('quantity', value, i)
                            return
                        }
                        onOk('quantity_zzd', value, i)
                        dispatch(editRunningActions.getChzzZzdListPrice(i))
                    }
                }), true))
                global.routerHistory.push('/config/inventory/serial')
            }
            if (quantity && isModify && serialList.size==0) {//修改时获取当前选择的序列号列表
                dispatch(editRunningActions.getSerialListChecked({inventoryUuid: cardUuid, inType: 'J', inJrOriCardUuid: v.get('jrOriCardUuid') }, (serialList) => setSerial(serialList)))
                return
            }
            setSerial(serialList)
        }

        return (
            <div className='lrls-card'>
                {/* 物料的存货选择 */}
                <ChosenPicker
                    visible={visible}
                    type='card'
                    multiSelect={true}
                    title='请选择存货'
                    district={categoryList}
                    cardList={stockListArr}
                    value={categoryValue}
                    onChange={(value) => {
                        this.setState({categoryValue: value.key})
                        if (value.key=='ALL') {
                            this.setState({isAll: true})
                            return
                        }
                        this.setState({isAll: false})
                        dispatch(editRunningActions.getStockListByCategory(value))
                    }}
                    onOk={value => {
                        if (value.length) {
                            onOk('card', value, childIdx, 'CHZZ_ZZD_CHILD')
                        }
                    }}
                    onCancel={()=> { this.setState({visible: false}) }}
                >
                    <span></span>
                </ChosenPicker>
                <div style={{paddingBottom: '10px'}}>
                    <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                        <span>组装成品({i+1})</span>
                    </div>

                    <div className='lrls-more-card lrls-bottom'>
                        <label>存货:</label>
                        <div className='lrls-single' onClick={() => onClick()}>
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
                                }), i)
                                if (openSerial) {
                                    onOk('quantity', '', i)
                                    onOk('serialList', fromJS([]), i)
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

                    <div className='lrls-more-card lrls-bottom' style={{display: isOpenedWarehouse ? '' : 'none'}}>
                        <label>仓库:</label>
                        <Single
                            className='lrls-single'
                            district={warehouseList.toJS()}
                            value={v.get('warehouseCardUuid')}
                            onOk={value => {
                                onOk('warehouse', value, i)
                                if (openSerial) {
                                onOk('quantity', '', i)
                                onOk('serialList', fromJS([]), i)
                            }
                            }}
                        >
                           <Row className='lrls-category lrls-padding'>
                               {
                                   v.get('warehouseCardUuid') ? <span> {`${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}`} </span>
                                   : <span className='lrls-placeholder'>点击选择仓库卡片</span>
                               }
                               <Icon type="triangle" />
                           </Row>
                        </Single>
                    </div>

                    <Row className={'lrls-more-card lrls-bottom'}>
                        <label>数量:</label>
                        <div className='lrls-single' onClick={() => {
                            if (openSerial) {
                                serialClick()
                            } else {
                                showPrompt(i, v.toJS())
                            }
                        }}>
                            <Row className='lrls-category lrls-padding'>
                                 <span> {`${quantity} ${v.get('unitName')}`} </span>
                                <Icon type="triangle"/>
                            </Row>
                        </div>
                    </Row>

                    <Row className='lrls-more-card lrls-bottom'>
                        <label>单价：</label>
                        <div className='lrls-single lrls-placeholder'>
                            <Row className='lrls-category lrls-padding'>
                                <Amount showZero>{price}</Amount>
                            </Row>
                        </div>
                    </Row>

                    <Row className='lrls-more-card lrls-bottom'>
                        <label>金额：</label>
                        <div className='lrls-single lrls-placeholder'>
                            <Row className='lrls-category lrls-padding'>
                                <Amount showZero>{amount}</Amount>
                            </Row>
                        </div>
                    </Row>
                </div>

                {/* 物料明细 */}
                <div>
                    {
                        v.get('childCardList').map((childItem, j) => {
                            const isOpenedQuantity = childItem.get('isOpenedQuantity')
                            const cardUuid = childItem.get('cardUuid')
                            const warehouseCardUuid = childItem.get('warehouseCardUuid')
                            const warehouseCardCode = childItem.get('warehouseCardCode')
                            const warehouseCardName = childItem.get('warehouseCardName')
                            const unitUuid = childItem.get('unitUuid')
                            const unitName = childItem.get('unitName')

                            let unitList = [], basicUnitQuantity = 1
                            if (isOpenedQuantity) {
                                const stockListArr = stockList.toJS()
                                for (const item of stockListArr) {
                                    if (item['uuid']==cardUuid) {
                                        unitList.push({
                                            key: item['unit']['name'],
                                            value: item['unit']['uuid'],
                                            basicUnitQuantity: 1,
                                        })
                                        item['unit']['unitList'].map(unitItem => {
                                            unitList.push({
                                                key: unitItem['name'],
                                                value: unitItem['uuid'],
                                                basicUnitQuantity: unitItem['basicUnitQuantity'],
                                            })
                                            if (unitUuid==unitItem['uuid']) {
                                                basicUnitQuantity = unitItem['basicUnitQuantity']
                                            }
                                        })
                                        break
                                    }
                                }
                            }

                            const quantity = childItem.get('quantity') ? Number(childItem.get('quantity')) : ''
                            const price = childItem.get('price') ? Number(childItem.get('price')) : ''
                            const amount = childItem.get('amount') ? Number(childItem.get('amount')) : ''
                            let unitPrice = childItem.get('unitPrice')
                            if (!unitPrice && price) {
                                unitPrice = decimal(price/basicUnitQuantity)
                            }

                            //属性
                            const openAssist = childItem.getIn(['financialInfo', 'openAssist'])//属性
                            const openSerial = childItem.getIn(['financialInfo', 'openSerial'])//序列号
                            const openBatch = childItem.getIn(['financialInfo', 'openBatch'])//批次
                            const openShelfLife = childItem.getIn(['financialInfo', 'openShelfLife'])//保质期
                            const shelfLife = childItem.getIn(['financialInfo', 'shelfLife'])//保质期
                            const assistList = childItem.get('assistList') ? childItem.get('assistList') : fromJS([])//选择的属性
                            const serialList = childItem.get('serialList') ? childItem.get('serialList') : fromJS([])//选择的序列号
                            const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                            const batch = childItem.get('batch') ? childItem.get('batch') : ''
                            const batchUuid = childItem.get('batchUuid') ? childItem.get('batchUuid') : ''
                            const expirationDate = childItem.get('expirationDate') ? childItem.get('expirationDate') : ''
                            const batchName = expirationDate ? `${batch}(${expirationDate})` : batch
                            const assistClassificationList = childItem.getIn(['financialInfo', 'assistClassificationList'])
                            if (childIdx[0]==i && childIdx[1]==j) {
                                this.assistClassificationList = assistClassificationList ? assistClassificationList : fromJS([])
                            }


                            const serialClick = () => {//物料出库
                                let errorList = []
                                if (!cardUuid) { return thirdParty.toast.info('请先选择存货卡片') }
                                let serialType = 'JR_OUT'
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
                                    if (serialList.size==0) {//获取所有的序列号列表
                                        await new Promise (resolve => {
                                            dispatch(editRunningActions.getSerialListIn({inventoryUuid: cardUuid, warehouseUuid: warehouseCardUuid, assistList, batchUuid, oriUuid, }, resolve))
                                        })
                                    }
                                    this.serialList = serialList
                                    this.price = price
                                    if (quantity && isModify && serialList.size==0) {//修改时获取当前选择的序列号列表
                                        await new Promise (resolve => {
                                            dispatch(editRunningActions.getSerialListChecked({inventoryUuid: cardUuid, outJrOriCardUuid: childItem.get('jrOriCardUuid') }, (serialList) => {
                                                onOk('serialList', serialList)
                                                this.serialList = serialList
                                                resolve()
                                            }, true))
                                        })
                                    }
                                    this.setState({serialVisible: true, childIdx: [i, j]})
                                }
                                asyncFun()
                            }

                            return (
                                <div key={j} style={{paddingBottom: childCardListSize > 1 ? '10px' : '0'}}>
                                    <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                                        <span>物料明细({j+1})</span>
                                        <span
                                            className='lrls-blue'
                                            style={{display: childCardListSize==1 ? 'none' : ''}}
                                            onClick={() => {
                                                onOk('delete_zzd_child', '', [i, j])
                                            }}
                                        >
                                                删除
                                        </span>
                                    </div>

                                    <div className='lrls-more-card lrls-bottom'>
                                        <label>存货:</label>
                                        <div className='lrls-single'
                                            onClick={() => {this.setState({ visible: true, childIdx: [i, j] })
                                        }}>
                                            <Row className='lrls-category lrls-padding'>
                                                {
                                                    cardUuid ? <span> {`${childItem.get('code')} ${childItem.get('name')}`} </span>
                                                    : <span className='lrls-placeholder'>点击选择存货卡片</span>
                                                }
                                                <Icon type="triangle"/>
                                            </Row>
                                        </div>
                                    </div>

                                    <div className='lrls-more-card lrls-bottom' style={{display: openAssist ? '' : 'none'}}>
                                        <label>属性:</label>
                                        <div className='lrls-single' onClick={()=>{
                                            this.setState({assistVisible: true, childIdx: [i, j]})

                                            this.oriAssistList = assistList ? assistList.toJS(): []
                                            this.openSerial = openSerial
                                        }}>
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
                                                onOk('bitch_zzd_child', fromJS({
                                                    batch: value['batch'],
                                                    batchUuid: value['batchUuid'],
                                                    expirationDate: value['expirationDate']
                                                }), [i, j])
                                                if (openSerial) {
                                                    onOk('quantity', '', [i, j], 'CHZZ_ZZD_CHILD')
                                                    onOk('serialList', fromJS([]), [i, j], 'CHZZ_ZZD_CHILD')
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

                                    <div className='lrls-more-card lrls-bottom' style={{display: isOpenedWarehouse ? '' : 'none'}}>
                                        <label>仓库:</label>
                                        <Single
                                            className='lrls-single'
                                            district={warehouseList.toJS()}
                                            value={warehouseCardUuid}
                                            onOk={value => {
                                                onOk('warehouse_zzd_child', value, [i, j])
                                                if (isOpenedQuantity) {
                                                    if (openSerial) {
                                                        onOk('quantity', '', [i, j], 'CHZZ_ZZD_CHILD')
                                                        onOk('serialList', fromJS([]), [i, j], 'CHZZ_ZZD_CHILD')
                                                    }
                                                    dispatch(editRunningActions.getChzzZzdPrice([i, j]))
                                                }
                                            }}
                                        >
                                           <Row className='lrls-category lrls-padding'>
                                               {
                                                   warehouseCardUuid ? <span> {`${warehouseCardCode} ${warehouseCardName}`} </span>
                                                   : <span className='lrls-placeholder'>点击选择仓库卡片</span>
                                               }
                                               <Icon type="triangle" />
                                           </Row>
                                        </Single>
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
                                                value={childItem.get('quantity')}
                                                onChange={(value) => {
                                                    if (/^\d*\.?\d{0,4}$/g.test(value)) {
                                                        onOk('quantity', value, [i, j], 'CHZZ_ZZD_CHILD')

                                                        if (Number(price) > 0) {//计算金额
                                                            const autoAmount = decimal(Number(price)*Number(value))
                                                            onOk('amount', autoAmount, [i, j], 'CHZZ_ZZD_CHILD')
                                                            return
                                                        }
                                                    }
                                                }}
                                            />
                                        }
                                        <Single
                                            className='lrls-single'
                                            district={unitList}
                                            value={unitUuid}
                                            onOk={value => {
                                                onOk('unitUuid', value['value'], [i, j], 'CHZZ_ZZD_CHILD')
                                                onOk('unitName', value['key'], [i, j], 'CHZZ_ZZD_CHILD')
                                                if (unitPrice) {
                                                    let price = decimal(unitPrice*value['basicUnitQuantity'],4)
                                                    onOk('price', price, [i, j], 'CHZZ_ZZD_CHILD')
                                                    if (childItem.get('quantity')) {
                                                        const autoAmount = decimal(price*Number(childItem.get('quantity')))
                                                        onOk('amount', autoAmount, [i, j], 'CHZZ_ZZD_CHILD')
                                                    }
                                                }
                                            }}
                                        >
                                           <Row className='lrls-account lrls-type'>
                                               {
                                                   unitUuid ? <span> {unitName} </span>
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
                                            placeholder='填写单价'
                                            value={childItem.get('price')}
                                            onChange={(value) => {
                                                if (/^\d*\.?\d{0,4}$/g.test(value)) {
                                                    onOk('price', value, [i, j], 'CHZZ_ZZD_CHILD')
                                                    if (quantity > 0) {//计算金额
                                                        const autoAmount = decimal(quantity*Number(value))
                                                        onOk('amount', autoAmount, [i, j], 'CHZZ_ZZD_CHILD')
                                                    }
                                                }
                                            }}
                                        />
                                    </Row>

                                    <Row className='lrls-more-card lrls-bottom'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            disabled={!cardUuid}
                                            placeholder='填写金额'
                                            value={childItem.get('amount')}
                                            onChange={(value) => {
                                                if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                                    onOk('amount', value, [i, j], 'CHZZ_ZZD_CHILD')
                                                }
                                                if (isOpenedQuantity) {
                                                    if (Number(quantity) > 0) {//计算价格
                                                        const autoPrice = decimal(Number(value)/quantity, 4)
                                                        onOk('price', autoPrice, [i, j], 'CHZZ_ZZD_CHILD')
                                                    }

                                                }
                                            }}
                                        />
                                    </Row>
                                </div>
                            )
                        })
                    }
                </div>


                <div className='lrls-more-card' style={{fontWeight: 'bold'}}>
                    <div></div>
                    <div className='lrls-blue'
                        onClick={() => {
                            this.setState({ visible: true, childIdx: [i, v.get('childCardList').size] })
                        }}
                    >
                        +添加物料明细
                    </div>
                </div>

                {/* 物料的序列号和属性选择 */}
                <Multiple
                    visible={serialVisible}
                    district={serialMultipleList}
                    value={this.serialList.toJS().map(v => v['serialUuid'])}
                    title={'选择序列号'}
                    showPreview={true}
                    previewTitle='已选择序列号'
                    onOk={(value) => {
                        this.setState({serialVisible: false})
                        onOk('serialList', fromJS(value), childIdx, 'CHZZ_ZZD_CHILD')
                        onOk('quantity', value.length, childIdx, 'CHZZ_ZZD_CHILD')

                        if (Number(this.price) > 0) {//计算金额
                            const autoAmount = decimal(Number(this.price)*Number(value.length))
                            onOk('amount', autoAmount, childIdx, 'CHZZ_ZZD_CHILD')
                        }

                    }}
                    onCancel={() => { this.setState({serialVisible: false}) }}
                >
                    <span></span>
                </Multiple>

                <AssistSelect
                    assistVisible={assistVisible}
                    assistClassificationList={this.assistClassificationList}
                    oriAssistList={this.oriAssistList}
                    onOk={(assistList) => {
                        onOk('assistList', fromJS(assistList), childIdx, 'CHZZ_ZZD_CHILD')
                        if (this.openSerial) {
                            onOk('quantity', '', childIdx, 'CHZZ_ZZD_CHILD')
                            onOk('serialList', fromJS([]), childIdx, 'CHZZ_ZZD_CHILD')
                        }
                        this.setState({assistVisible: false})
                    }}
                    addClick={(data) => {
                        dispatch(editRunningActions.addInventoryAssist(data, 'CHZZ_ZZD_CHILD'))
                        this.setState({categoryValue: 'ALL', isAll: true})
                    }}
                />

            </div>

        )
    }
}
