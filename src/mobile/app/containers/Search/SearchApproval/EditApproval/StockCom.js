import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'

import { Row, Icon, Amount, Switch, ChosenPicker } from 'app/components'
import * as thirdParty from 'app/thirdParty'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
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

const amountProps = {decimalZero: false, decimalPlaces: 4}

//营业收入存货卡片
export default class StockCom extends Component {
    static contextTypes = { router: PropTypes.object }
    state = {
        isAll: true,
        visible: false,
        idx: -1,
        categoryValue: 'ALL',
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.categoryType != nextProps.categoryType) {
            this.setState({ categoryValue: 'ALL', isAll: true, })
        }
    }

    render() {
        const {
            dispatch,
            invetorySourceCardList,
            invetorySourceCategoryList,
            stockList,
            cardDisabled,
            stockRange,
            propertyCarryover,
            usedStock,
            openQuantity,
            isOpenedWarehouse,
            taxRate,
            amount,
        } = this.props
        const { isAll, visible, idx, categoryValue } = this.state
        const { router } = this.context

        const isOne = stockList.size == 1 ? true : false
        const showSwitch = false

        let categoryList = [{ uuid: 'ALL', name: '全部', childList: [] }]
        invetorySourceCategoryList && invetorySourceCategoryList.map(v => {
            if (stockRange.includes(v.get('uuid'))) {
                categoryList.push(v.toJS())
            }
        })
        loop(categoryList)

        let stockListArr = invetorySourceCardList ? invetorySourceCardList.toJS() : []
        stockListArr.map(v => {
            v['cardName'] = v['name']
            v['key'] = `${v['code']} ${v['name']}`
            v['name'] = v['key']
        })

        return (
            <div className={stockRange.size ? 'lrls-card' : ''}>
                <Row className='lrls-more-card' style={{ display: !usedStock ? '' : 'none' }}>
                    <span>{usedStock ? '存货：' : '存货'}</span>
                </Row>
                <ChosenPicker
                    visible={visible}
                    type='card'
                    multiSelect={true}
                    title='请选择存货'
                    icon={{
                        type: 'inventory-add',
                        onClick: () => {
                            if (stockRange.size) {
                                dispatch(editRunningConfigActions.beforeAddInventoryCardFromEditRunning(stockRange, router.history, 'searchApproval'))
                            } else {
                                thirdParty.toast.info('请选择存货范围')
                            }
                        }
                    }}
                    district={categoryList}
                    cardList={stockListArr}
                    value={categoryValue}
                    onChange={(value) => {
                        this.setState({ categoryValue: value.key })
                        if (value.key == 'ALL') {
                            dispatch(searchApprovalActions.getStockAllCardList(stockRange, 'stock', true))
                            this.setState({ isAll: true })
                            return
                        }
                        this.setState({ isAll: false })
                        dispatch(searchApprovalActions.getStockSomeCardList(value.key, value.top === true ? 1 : ''))
                    }}
                    onOk={value => {
                        if (value.length) {
                            dispatch(searchApprovalActions.changeSearchApprovalCommonChargeInvnetory(stockList, value))
                        }
                    }}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    <span></span>
                </ChosenPicker>

                <div style={{ display: propertyCarryover == 'SX_HW' || usedStock ? '' : 'none' }}>
                    {
                        stockList.map((v, i) => {

                            const cardUuid = v.get('stockUuid')
                            const warehouseCardUuid = v.get('depotUuid')
                            const quantity = v.get('number') ? Number(v.get('number')) : 0
                            const price = v.get('unitPrice') ? Number(v.get('unitPrice')) : 0
                            const amount = v.get('amount') ? Number(v.get('amount')) : 0

                            return (
                                <div key={i} className='lrls-bottom-line lrls-card-bottom'>
                                    <div className='lrls-more-card lrls-placeholder lrls-card-bottom'>
                                        <span>存货明细({i + 1})</span>
                                        <span
                                            className={cardDisabled ? 'lrls-placeholder' : 'lrls-blue'}
                                            style={{ display: isOne ? 'none' : '' }}
                                            onClick={() => {
                                                if (cardDisabled) {
                                                    return
                                                }
                                                dispatch(searchApprovalActions.deleteSearchApprovalStock(stockList, i, taxRate))
                                            }}
                                        >
                                            删除
                                            </span>
                                    </div>
                                    <div className='lrls-more-card' onClick={() => {
                                        dispatch(searchApprovalActions.changeSearchApprovalString('', 'currentEditInvetoryIndex', i))
                                        router.history.push('/searchapproval/stockedit')
                                    }}>
                                        <div className='lrls-single'>
                                            <Row className='lrls-more-card lrls-card-bottom'>
                                                <div className='lrls-single overElli lrls-padding-right'>
                                                    <span>存货:</span>
                                                    <span className={cardUuid ? '' : 'lrls-placeholder'}>
                                                        {cardUuid ? `${v.get('stockCode')} ${v.get('stockName')}` : ' 未选择'}
                                                    </span>
                                                </div>
                                                <div className='lrls-single overElli lrls-padding-right'
                                                    style={{ display: isOpenedWarehouse ? '' : 'none' }}
                                                >
                                                    <span>仓库:</span>
                                                    <span className={warehouseCardUuid ? '' : 'lrls-placeholder'}>
                                                        {warehouseCardUuid ? `${v.get('depotCode')} ${v.get('depotName')}` : ' 未选择'}
                                                    </span>
                                                </div>
                                            </Row>
                                            <Row className='lrls-more-card lrls-card-bottom'>
                                                {
                                                    // stockList.find(w => w.get('uuid') === v.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false
                                                    openQuantity ?
                                                    <div style={{ display: (invetorySourceCardList.find(w => w.get('uuid') === v.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false) ? '' : 'none' }}
                                                        className='lrls-padding-right'
                                                    >
                                                        <span>数量:</span>
                                                        <Amount {...amountProps}>{quantity}</Amount>
                                                        <span>{v.get('unitUuid') ? v.get('unitName') : null}</span>
                                                    </div>
                                                    : <div style={{ display: 'none' }} className='lrls-padding-right'
                                                    >
                                                    </div>
                                                }
                                                {
                                                    openQuantity ?
                                                    <div style={{ display: (invetorySourceCardList.find(w => w.get('uuid') === v.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false) ? '' : 'none' }}
                                                        className='lrls-single overElli lrls-padding-right'
                                                    >
                                                        <span>单价:</span>
                                                        <Amount {...amountProps}>{price}</Amount>
                                                    </div>
                                                    : <div style={{ display: 'none' }} className='lrls-single overElli lrls-padding-right'
                                                    >
                                                    </div>
                                                }
                                                <div className='lrls-padding-right'>
                                                    <span>金额:</span>
                                                    <Amount>{amount}</Amount>
                                                </div>
                                            </Row>
                                        </div>
                                        <Icon type="arrow-right" />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className='lrls-more-card lrls-margin-top'
                    style={{ display: propertyCarryover == 'SX_HW' || usedStock ? '' : 'none', fontWeight: 'bold' }}
                >
                    <div>
                        总金额：<Amount showZero>{amount}</Amount>
                    </div>
                    <div className='lrls-stock-bottom'>
                        <div className={cardDisabled ? 'lrls-placeholder' : 'lrls-blue'}
                            onClick={() => {
                                if (cardDisabled) { return }
                                this.setState({ visible: true, idx: stockList.size, })
                            }}
                        >
                            +添加存货明细
                        </div>
                        <div className='noTextSwitch' style={{ display: showSwitch && usedStock ? '' : 'none' }}>
                            <Switch
                                disabled={cardDisabled}
                                checked={usedStock}
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedStock'], !usedStock))
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
