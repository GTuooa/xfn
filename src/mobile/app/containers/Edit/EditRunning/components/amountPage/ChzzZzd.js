import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, TextListInput, Single, Icon, ChosenPicker } from 'app/components'

import { decimal } from 'app/utils'
import chzzSort from './chzzSort.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
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

export default class ChzzZzdCom extends Component {
    state = {
        assemblyCategoryValue: 'ALL',
        assemblyVisible: false,
        assemblyIdx: -1,
        showList: true,
    }
    componentDidMount () {
        const routerPage = sessionStorage.getItem('routerPage')
        if (['routerStock'].includes(routerPage)) {//从选择页面返回不需要重新获取
			return
        }
        this.props.dispatch(editRunningActions.chzzAssemblyList({top: true, uuid: ''}, 'assemblyList'))
    }

    render () {
        const { dispatch, stockCardList, isOpenedWarehouse, stockCategoryList, cardAllList, history, } = this.props
        const { assemblyVisible, assemblyCategoryValue, assemblyIdx, showList } = this.state

        const isOne = stockCardList.size == 1 ? true : false
        const onOk = (dataType, value, idx, categoryType='CHZZ_ZZD') => {
            if (categoryType=='CHZZ_ZZD_CHILD' && ['quantity', 'price', 'amount', 'unitUuid', 'unitName'].includes(dataType)) {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'stockCardList', idx[0], 'childCardList', idx[1], dataType], value))
                return
            }
            dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx, categoryType, 'stockCardList'))
        }

        let categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
        stockCategoryList.map(v => { categoryList.push(v.toJS()) })
        loop(categoryList)

        //成品列表
        const assemblyList = cardAllList.get('assemblyList').toJS()
        const commonAssemblyList = cardAllList.get('commonAssemblyList').toJS()
        let assemblyListArr = assemblyCategoryValue=='ALL' ? assemblyList : commonAssemblyList

        //物料汇总专用
        let totalAmount = 0//物料汇总合计
        const sortAssemblyList = chzzSort(stockCardList.toJS())

        return (
            <div>
                {/* 成品选择 */}
                <ChosenPicker
                    visible={assemblyVisible}
                    type='card'
                    multiSelect={true}
                    title='请选择成品'
                    icon={{
                        type: 'inventory-add',
                        onClick: () => {
                            dispatch(editRunningConfigActions.beforeAddInventoryCardFromEditRunning([], history))
                        }
                    }}
                    district={categoryList}
                    cardList={assemblyListArr}
                    value={assemblyCategoryValue}
                    onChange={(value) => {
                        this.setState({assemblyCategoryValue: value.key})
                        if (value.key=='ALL') { return }
                        dispatch(editRunningActions.chzzAssemblyList(value))
                    }}
                    onOk={value => {
                        if (value.length) { onOk('card', value, assemblyIdx) }
                    }}
                    onCancel={()=> { this.setState({assemblyVisible: false}) }}
                >
                    <span></span>
                </ChosenPicker>

                {/* 成品 物料明细 */}
                <div>
                    {
                        stockCardList.map((v, i) => {
                            const isOpenedQuantity = v.get('isOpenedQuantity')
                            const cardUuid = v.get('cardUuid')
                            const warehouseCardUuid = v.get('warehouseCardUuid')
                            const warehouseCardCode = v.get('warehouseCardCode')
                            const warehouseCardName = v.get('warehouseCardName')
                            const unitName = v.get('unitName') ? v.get('unitName') : null
                            const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
                            const childCardListSize = v.get('childCardList').size

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

                            let amount = 0, price = 0
                            v.get('childCardList').map(child => {
                                amount += Number(child.get('amount'))
                            })
                            if (quantity) {
                                price = Number(amount)/Number(quantity)
                            }

                            totalAmount += Number(amount)

                            return (
                                <div className='lrls-card' key={i} style={{paddingBottom: 0}}>
                                    <div className='lrls-more-card lrls-bottom lrls-bottom-line'>
                                        <span className='lrls-bottom'>组装单({i+1})</span>
                                        <span
                                            className='lrls-blue lrls-bottom'
                                            onClick={() => {
                                                onOk('delete', '', i)
                                            }}
                                        >
                                                删除
                                        </span>
                                    </div>
                                    <div className='lrls-more-card lrls-bottom lrls-bottom-line' onClick={() => {
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
                                            <Row className='lrls-more-card lrls-card-bottom'
                                                style={{display: (openAssist || openBatch) ? '' : 'none'}}
                                                >
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
                                                    <span>{unitName}</span>
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

                                    {/* 物料明细 */}
                                    <div>
                                        {
                                            v.get('childCardList').map((childItem, j) => {
                                                const isOpenedQuantity = childItem.get('isOpenedQuantity')
                                                const cardUuid = childItem.get('cardUuid')
                                                const warehouseCardUuid = childItem.get('warehouseCardUuid')
                                                const warehouseCardCode = childItem.get('warehouseCardCode')
                                                const warehouseCardName = childItem.get('warehouseCardName')
                                                const unitName = childItem.get('unitName') ? childItem.get('unitName') : null
                                                const quantity = childItem.get('quantity') ? Number(childItem.get('quantity')) : ''
                                                const price = childItem.get('price') ? Number(childItem.get('price')) : ''
                                                const amount = childItem.get('amount') ? Number(childItem.get('amount')) : ''
                                                let className = 'lrls-bottom-line lrls-card-bottom'
                                                if (j+1==childCardListSize) {
                                                    className=''
                                                }

                                                //属性
                                                const openAssist = childItem.getIn(['financialInfo', 'openAssist'])//属性
                                                const openSerial = childItem.getIn(['financialInfo', 'openSerial'])//序列号
                                                const openBatch = childItem.getIn(['financialInfo', 'openBatch'])//批次
                                                const openShelfLife = childItem.getIn(['financialInfo', 'openShelfLife'])//保质期
                                                const assistList = childItem.get('assistList') ? childItem.get('assistList') : fromJS([])
                                                const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                                const batch = childItem.get('batch') ? childItem.get('batch') : ''
                                                const expirationDate = childItem.get('expirationDate') ? childItem.get('expirationDate') : ''
                                                const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                                                return (
                                                    <div key={j} className={className}>
                                                        <div className='lrls-more-card lrls-placeholder lrls-card-bottom'>
                                                            <span>物料明细({j+1})</span>
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
                                                                            { cardUuid ? `${childItem.get('code')} ${childItem.get('name')}` : ' 未选择' }
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
                                                                <Row className='lrls-more-card lrls-card-bottom'
                                                                    style={{display: (openAssist || openBatch) ? '' : 'none'}}
                                                                    >
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
                                                                        <span>{unitName}</span>
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
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>

                            )
                        })
                    }
                </div>

                <div className='lrls-card'>
                    <div className='lrls-more-card'>
                        <span>添加组装单</span>
                        <span
                            className='lrls-placeholder'
                            onClick={() => {
                                this.setState({ assemblyVisible: true, assemblyIdx: stockCardList.size })
                            }}
                        >
                            点击添加组装单 <Icon type="arrow-right"/>
                        </span>
                    </div>
                </div>

                <Row className={'jr-card lrls-card-bottom'} style={{display: stockCardList.size ? '' : 'none'}}>
                    <div className='lrls-more-card lrls-card-bottom lrls-padding-top'
                        onClick={() => this.setState({'showList': !showList})}
                    >
                        <div>物料汇总合计：<Amount showZero>{decimal(totalAmount)}</Amount></div>
                        <div>
                            {showList ? '收起' : '展开'}
                            <Icon style={showList ? {transform: 'rotate(180deg)'} : ''} type="arrow-down"/>
                        </div>
                    </div>
                    <div style={{display: showList ? '' : 'none'}}>
                        {
                            sortAssemblyList.map((v,i) => {
                                const childItem = fromJS(v)
                                const openAssist = childItem.getIn(['financialInfo', 'openAssist'])//属性
                                const openBatch = childItem.getIn(['financialInfo', 'openBatch'])//批次
                                const openShelfLife = childItem.getIn(['financialInfo', 'openShelfLife'])//保质期
                                const assistList = childItem.get('assistList') ? childItem.get('assistList') : fromJS([])
                                const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                                const batch = childItem.get('batch') ? childItem.get('batch') : ''
                                const expirationDate = childItem.get('expirationDate') ? childItem.get('expirationDate') : ''
                                const batchName = expirationDate ? `${batch}(${expirationDate})` : batch
                                return (
                                    <div key={i} className='dashed-line'>
                                        <div className='jr-item'>
                                            <div>{`${v['code']} ${v['name']}`}</div>
                                            <div style={{display: v['isOpenedQuantity'] ? '' : 'none'}}>
                                                <Amount showZero {...amountProps}>{v['quantity']}</Amount>{v['unitName']}*<Amount showZero {...amountProps}>{v['price']}</Amount>
                                            </div>
                                        </div>
                                        <div className='jr-item' style={{display: (openAssist || openBatch) ? '' : 'none'}}>
                                            {openAssist ? <div>属性:{assistName}</div> : null}
                                            {openBatch ? <div>批次:{batchName}</div> : null}
                                        </div>
                                        <div className='jr-item'>
                                            <div>{isOpenedWarehouse ? `仓库：${v['warehouseCardCode']} ${v['warehouseCardName']}` : null}</div>
                                            <div><Amount className='hx-bold'>{v['amount']}</Amount></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Row>
            </div>

        )
    }
}
