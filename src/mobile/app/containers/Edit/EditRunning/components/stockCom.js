import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon, Amount, Switch, TextListInput, ChosenPicker } from 'app/components'
import { decimal, formatMoney } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
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
const amountProps = {decimalZero: false, decimalPlaces: 4}

//营业收入存货卡片
export default class StockCom extends Component {
    state = {
        isAll: true,
        visible: false,
        idx: -1,
        categoryValue: 'ALL',
    }
    componentDidMount() {
        this.props.dispatch(editRunningActions.changeLrlsData('commonCardList', fromJS([]), true))
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.categoryType != nextProps.categoryType) {
            this.setState({categoryValue: 'ALL', isAll: true,})
        }
    }

    render () {
        const {
            dispatch,
            stockList,
            stockCardList,
            cardDisabled,
            stockRange,
            categoryType,
            history,
            propertyCarryover,
            usedStock,
            isOpenedWarehouse,
            warehouseList,
            allStockRange,
            commonCardList
        } = this.props
        const { isAll, visible, idx, categoryValue } = this.state

        let totalAmount = 0
        const isOne = stockCardList.size == 1 ? true : false
        stockCardList.forEach(v => totalAmount += Number(v.get('amount')))

        const changeAmount = (value) => dispatch(editRunningActions.changeLrlsAmount(value))
        const onOk = (dataType, value, idx) => dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx))
        const showSwitch = propertyCarryover == 'SX_HW_FW' && stockRange.size ? true : false

        let categoryList = [{uuid: 'ALL', name: '全部', childList: []}]
        allStockRange.map(v => {
            if (stockRange.includes(v.get('uuid'))) {
                categoryList.push(v.toJS())
            }
        })
        loop(categoryList)

        let stockListArr = isAll ? stockList.toJS() : commonCardList
        stockListArr.map(v => {
            v['name'] = v['key']
        })

        return (
                <div className={stockRange.size ? 'lrls-card' : ''}>
                    <Row className='lrls-more-card' style={{display: (showSwitch && !usedStock) ? '' : 'none'}}>
                        <span>{usedStock ? '存货：' : '存货'}</span>
                        <div className='noTextSwitch'>
                            <Switch
                                checked={usedStock}
                                onClick={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedStock'], !usedStock))
                                    if (stockCardList.size == 0) {
                                        onOk('add', '', 0)
                                    }
                                }}
                            />
                        </div>
                    </Row>
                    <ChosenPicker
                        visible={visible}
                        type='card'
                        multiSelect={true}
                        title='请选择存货'
                        icon={{
                                type: 'inventory-add',
                                onClick: () => {
                                    dispatch(editRunningConfigActions.beforeAddInventoryCardFromEditRunning(stockRange, history))
                                }
                            }}
                        district={categoryList}
                        cardList={stockListArr}
                        value={categoryValue}
                        onChange={(value) => {
                            this.setState({categoryValue: value.key})
                            if (value.key=='ALL') {// || categoryList.length==1
                                this.setState({isAll: true})
                                return
                            }
                            this.setState({isAll: false})
                            dispatch(editRunningActions.getStockListByCategory(value))
                        }}
                        onOk={value => {
                            if (value.length) {
                                onOk('card', value, idx)
                            }
                        }}
                        onCancel={()=> { this.setState({visible: false}) }}
                    >
                        <span></span>
                    </ChosenPicker>

                    <div style={{display: propertyCarryover == 'SX_HW' || usedStock ? '' : 'none'}}>
                        {
                            stockCardList.map((v, i) => {
                                const isOpenedQuantity = v.get('isOpenedQuantity')
                                const cardUuid = v.get('cardUuid')
                                const warehouseCardUuid = v.get('warehouseCardUuid')
                                const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
                                const price = v.get('price') ? Number(v.get('price')) : 0
                                const amount = v.get('amount') ? Number(v.get('amount')) : 0

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
                                                className={cardDisabled ? 'lrls-placeholder' : 'lrls-blue'}
                                                style={{display: isOne ? 'none' : ''}}
                                                onClick={() => {
                                                    if (cardDisabled) {
                                                        return
                                                    }
                                                    onOk('delete', '', i)
                                                    changeAmount(totalAmount - Number(v.get('amount')))
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
                                                            { warehouseCardUuid ? `${v.get('warehouseCardCode')} ${v.get('warehouseCardName')}` : ' 未选择' }
                                                        </span>
                                                    </div>
                                                </Row>
                                                <Row className='lrls-more-card lrls-card-bottom'
                                                    style={{display: (openAssist || openBatch) ? '' : 'none'}}
                                                    >
                                                    {/* <div className='lrls-single overElli lrls-padding-right'>
                                                        {openAssist ? <span>
                                                            <span>属性：</span>
                                                            <span className={assistName ? '' : 'lrls-placeholder'}>
                                                                { assistName ? assistName : ' 未选择' }
                                                            </span>
                                                        </span> : null}
                                                        { openBatch ? <span>
                                                            <span>批次：</span>
                                                            <span className={batchName ? '' : 'lrls-placeholder'}>
                                                                { batchName ? batchName : ' 未选择' }
                                                            </span>
                                                        </span> : null }
                                                    </div> */}
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
                                                        <Amount {...amountProps}>{quantity}</Amount>
                                                        <span>{ v.get('unitUuid') ? v.get('unitName') : null }</span>
                                                    </div>
                                                    <div style={{display: isOpenedQuantity ? '' : 'none'}}
                                                       className='lrls-single overElli lrls-padding-right'
                                                    >
                                                        <span>单价:</span>
                                                        <Amount {...amountProps}>{price}</Amount>
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
                    </div>

                    <div className='lrls-more-card lrls-margin-top'
                        style={{display: propertyCarryover == 'SX_HW' || usedStock ? '' : 'none', fontWeight: 'bold'}}
                    >
                        {
                            stockCardList.size > 1 ? <div>
                                总金额：<Amount showZero>{totalAmount}</Amount>
                            </div> : <div></div>
                        }
                        <div className='lrls-stock-bottom'>
                            <div className={cardDisabled ? 'lrls-placeholder' : 'lrls-blue'}
                                onClick={() => {
                                    if (cardDisabled) { return }
                                    this.setState({ visible: true, idx: stockCardList.size, })
                                }}
                            >
                                +添加存货明细
                            </div>

                            <div className='noTextSwitch' style={{display: showSwitch && usedStock ? '' : 'none'}}>
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
