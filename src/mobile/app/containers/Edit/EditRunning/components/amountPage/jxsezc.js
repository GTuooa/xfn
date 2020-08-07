import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, XfInput, Single, Icon, ChosenPicker } from 'app/components'

import { decimal } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

export default class JxsezuCom extends Component {
    state = {
        isAll: true,
        visible: false,
        idx: -1,
        categoryValue: 'ALL'
    }

    render () {
        const { dispatch, stockCardList, stockList, isModify, warehouseList, usedStock, isOpenedWarehouse, amount, stockRange, stockCategoryList, commonCardList} = this.props

        const { isAll, visible, idx, categoryValue } = this.state

        const isOne = stockCardList.size == 1 ? true : false
        const onOk = (dataType, value, idx) => dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx, 'JXSEZC'))

        let totalAmount = 0

        let categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
        stockCategoryList.map(v => {
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
            <div>
                <div className='lrls-card'>
                    <Row className='yysr-amount' style={{display: usedStock ? 'none' : ''}}>
                        <label>税额：</label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            negativeAllowed={true}
                            placeholder='填写金额'
                            value={amount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                            }}
                        />
                    </Row>
                    {
                        usedStock ? <ChosenPicker
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
                                    onOk('card', value, idx)
                                }
                            }}
                            onCancel={()=> { this.setState({visible: false}) }}
                        >
                            <span></span>
                        </ChosenPicker> : null
                    }

                    {
                        usedStock && stockCardList.map((v, i) => {
                            const amount = v.get('amount') ? Number(v.get('amount')) : 0
                            totalAmount += amount

                            return (
                                <div key={i} style={{paddingBottom: isOne ? '0' : '10px'}}>
                                    <div className='lrls-more-card lrls-placeholder lrls-bottom'>
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

                                    <div className='lrls-more-card lrls-bottom'>
                                        <label>存货:</label>
                                        <div className='lrls-single'
                                            onClick={() => {this.setState({ visible: true, idx: i})
                                        }}>
                                            <Row className='lrls-category lrls-padding'>
                                                {
                                                    v.get('cardUuid') ? <span> {`${v.get('code')} ${v.get('name')}`} </span>
                                                    : <span className='lrls-placeholder'>点击选择存货卡片</span>
                                                }
                                                <Icon type="triangle"/>
                                            </Row>
                                        </div>
                                    </div>

                                    <div className='lrls-more-card lrls-bottom' style={{display: isOpenedWarehouse ? '' : 'none'}}>
                                        <label>仓库:</label>
                                        <Single
                                            className='lrls-single'
                                            district={warehouseList.toJS()}
                                            value={v.get('warehouseCardUuid')}
                                            onOk={value => {
                                                onOk('warehouse', value, i)
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

                                    <Row className='lrls-more-card lrls-bottom'>
                                        <label>税额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            negativeAllowed={true}
                                            placeholder='填写税额'
                                            value={v.get('amount')}
                                            onChange={(value) => {
                                                onOk('amount', value, i)
                                            }}
                                        />
                                    </Row>
                                </div>
                            )
                        })
                    }

                    <div className='lrls-more-card' style={{fontWeight: 'bold', display: usedStock ? '' : 'none'}}>
                        {
                            stockCardList.size > 1 ? <div>
                                总税额：<Amount showZero>{decimal(totalAmount)}</Amount>
                            </div> : <div></div>
                        }
                        <div className='lrls-blue'
                            onClick={() => {
                                this.setState({ visible: true, idx: stockCardList.size })
                            }}
                        >
                            +添加存货明细
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
