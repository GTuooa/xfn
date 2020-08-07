import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, XfInput, Single, Icon, ChosenPicker } from 'app/components'

import { decimal } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
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

export default class Xmjz extends Component {
    state = {
        isAll: true,
        visible: false,
        idx: -1,
        cardType: 'stockCardList',
        categoryValue: 'ALL'
    }

    render () {
        const { dispatch, oriState, stockCardList, stockList, isModify, isOpenedWarehouse, stockCategoryList, commonCardList, jrAmount, amount, currentAmount, history, projectProperty } = this.props
        const { isAll, visible, idx, cardType, categoryValue } = this.state

        const isOne = stockCardList.size == 1 ? true : false
        const onOk = (dataType, value, idx, cardTypeValue='stockCardList') => {
            dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx, 'XMJZ', cardTypeValue))
        }
        const stockCardUuidList = stockCardList.map(v => v.get('cardUuid'))

        let categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
        stockCategoryList.map(v => {
            categoryList.push(v.toJS())
        })
        loop(categoryList)

        let stockListArr = isAll ? stockList.toJS() : commonCardList
        stockListArr.map(v => {
            v['name'] = v['key']
        })

        let stockCardListTotalAmount = 0
        let showStock = true, showAmount = false
        if (oriState=='STATE_XMJZ_XMJQ' && jrAmount <= 0) {
            showStock = false
        }
        if (projectProperty=='XZ_CONSTRUCTION') {
            showStock = false
            showAmount = true
            if (oriState=='STATE_XMJZ_XMJQ' && jrAmount ==0) {
                showAmount = false
            }
            if (oriState=='STATE_XMJZ_XMJQ' && isModify) {
                showAmount = false
            }
        }

        return (
            <div>
                <div style={{display: showStock ? '' : 'none'}}>
                    <ChosenPicker
                        visible={visible}
                        type='card'
                        multiSelect={true}
                        title='请选择存货'
                        icon={{
                            type: 'inventory-add',
                            onClick: () => {
                                dispatch(editRunningConfigActions.beforeAddInventoryCardFromEditRunning([], history))
                            }
                        }}
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
                                onOk('card', value, idx, cardType)
                                dispatch(editRunningActions.getChzzListPrice(idx, value, cardType))
                            }
                        }}
                        onCancel={()=> { this.setState({visible: false}) }}
                    >
                        <span></span>
                    </ChosenPicker>


                    <div className='lrls-card'>
                        {
                            stockCardList.map((v, i) => {
                                const isOpenedQuantity = v.get('isOpenedQuantity')
                                const cardUuid = v.get('cardUuid')
                                const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
                                const price = v.get('price') ? Number(v.get('price')) : 0
                                const amount = v.get('amount') ? Number(v.get('amount')) : 0
                                const unitUuid = v.get('unitUuid')
                                const warehouseCardUuid = v.get('warehouseCardUuid')
                                const warehouseCardCode = v.get('warehouseCardCode')
                                const warehouseCardName = v.get('warehouseCardName')
                                const unitName = v.get('unitName') ? v.get('unitName') : null
                                stockCardListTotalAmount += Number(amount)

                                //属性
                                const openAssist = v.getIn(['financialInfo', 'openAssist'])//属性
                                const openSerial = v.getIn(['financialInfo', 'openSerial'])//序列号
                                const openBatch = v.getIn(['financialInfo', 'openBatch'])//批次
                                const openShelfLife = v.getIn(['financialInfo', 'openShelfLife'])//保质期
                                const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])
                                const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                const batch = v.get('batch') ? v.get('batch') : ''
                                const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                                const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                                return (
                                    <div key={i} className='lrls-bottom-line lrls-card-bottom'>
                                        <div className='lrls-more-card lrls-placeholder lrls-card-bottom'>
                                            <span>存货明细({i+1})</span>
                                            <span
                                                className='lrls-blue'
                                                style={{display: isOne ? 'none' : ''}}
                                                onClick={() => {
                                                    onOk('delete', '', i)
                                                }}
                                            >
                                                    删除
                                            </span>
                                        </div>
                                        <div className='lrls-more-card' onClick={() => {
                                            dispatch(editRunningActions.changeLrlsData(['views', 'idx'], i))
                                            history.push('/editrunning/stock')
                                        }}>
                                            <div className='lrls-single'>
                                                <Row className='lrls-more-card lrls-card-bottom'>
                                                    <div className='lrls-single overElli lrls-padding-right'>
                                                        <span>存货:</span>
                                                        <span className={cardUuid ? '' : 'lrls-placeholder'}>
                                                            { cardUuid ? `${v.get('code')} ${v.get('name')}` : ' 未选择' }
                                                        </span>
                                                    </div>
                                                    <div className='lrls-single overElli lrls-padding-right'
                                                        style={{display: isOpenedWarehouse ? '' : 'none'}}
                                                    >
                                                        <span>仓库:</span>
                                                        <span className={warehouseCardUuid ? '' : 'lrls-placeholder'}>
                                                            { warehouseCardUuid ? `${warehouseCardCode} ${warehouseCardName}` : ' 未选择' }
                                                        </span>
                                                    </div>
                                                </Row>
                                                <Row className='lrls-more-card lrls-card-bottom' style={{display: (openAssist || openBatch) ? '' : 'none'}}>
                                                    {openAssist ? <div className='lrls-single overElli lrls-padding-right'>
                                                        <span>属性:</span>
                                                        <span className={assistName ? '' : 'lrls-placeholder'}>
                                                            { assistName ? assistName : ' 未选择' }
                                                        </span>
                                                    </div> : null}
                                                    { openBatch ? <div className='lrls-single overElli lrls-padding-right'>
                                                        <span>批次:</span>
                                                        <span className={batchName ? '' : 'lrls-placeholder'}>
                                                            { batchName ? batchName : ' 未选择' }
                                                        </span>
                                                    </div> : null }
                                                </Row>
                                                <Row className='lrls-more-card lrls-card-bottom'>
                                                    <div style={{display: isOpenedQuantity ? '' : 'none'}}
                                                       className='lrls-padding-right lrls-one-third'
                                                    >
                                                        <span className={openSerial ? 'sn' : ''}>数量:</span>
                                                        <Amount>{quantity}</Amount>
                                                        <span>{unitName}</span>
                                                    </div>
                                                    <div style={{display: isOpenedQuantity ? '' : 'none'}}
                                                       className='lrls-single overElli lrls-padding-right'
                                                    >
                                                        <span>单价:</span>
                                                        <Amount>{price}</Amount>
                                                    </div>
                                                    <div className='lrls-padding-right lrls-one-third'>
                                                        <span>金额:</span>
                                                        <Amount>{amount}</Amount>
                                                   </div>
                                              </Row>
                                            </div>
                                            <Icon type="arrow-right"/>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className='lrls-more-card' style={{fontWeight: 'bold'}}>
                            <div>入库金额：<Amount showZero>{decimal(stockCardListTotalAmount)}</Amount></div>
                            <div className='lrls-blue'
                                onClick={() => {
                                    this.setState({ visible: true, idx: stockCardList.size, cardType: 'stockCardList' })
                                }}
                            >
                                +添加存货明细
                            </div>
                        </div>
                    </div>
                </div>

                <div className='lrls-card' style={{display: showAmount ? '' : 'none'}}>
                    <Row className='yysr-amount'>
                        <label>收入金额:</label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            negativeAllowed={true}
                            placeholder='收入金额'
                            value={amount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                            }}
                        />
                    </Row>
                    <Row className='yysr-amount lrls-margin-top'>
                        <label>成本金额:</label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            negativeAllowed={true}
                            placeholder='成本金额'
                            value={currentAmount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value))
                            }}
                        />
                    </Row>
                    <Row className='yysr-amount lrls-margin-top'>
                        <label>合同毛利:</label>
                        <Amount showZero>{decimal(amount-currentAmount)}</Amount>
                    </Row>
                </div>

            </div>
        )
    }
}
