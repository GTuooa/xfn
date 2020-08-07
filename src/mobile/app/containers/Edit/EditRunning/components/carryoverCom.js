import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon, Switch, XfInput } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

//营业收入结转成本
export default class CarryoverCom extends Component {
    render () {
        const { dispatch, beCarryover, stockCardList, carryoverCardList, isOpenedWarehouse, isCopy } = this.props
        let cardList = []//存货卡片列表-只出现一次
        let dupCard = []//重复的存货卡片列表
        let warehouseList = []//每个存货的仓库列表与uuidList一一对应
        let itemKey = 0

        //新版合并
        let cardSetList = []//所有的属性拼在一起的唯一卡片列表 拼接顺序 cardUuid warehouseCardUuid batch propertyUuid

        return (
            <Row className='lrls-card'>
                <Row className='lrls-more-card'>
                    <span>结转成本</span>
                    <div className='noTextSwitch'>
                        <Switch
                            checked={beCarryover}
                            onClick={() => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beCarryover'], !beCarryover))
                                if (isCopy && !beCarryover) {//关闭到开启
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'carryoverCardList'], stockCardList.map(v => v=v.set('amount', ''))))
                                }
                            }}
                        />
                    </div>
                </Row>
                <div style={{display: beCarryover ? '' : 'none'}}>
                    {
                        stockCardList.map((v ,i) => {
                            /*const cardUuid = v.get('cardUuid')
                            if (cardUuid && cardList.includes(cardUuid) && !dupCard.includes(cardUuid)) {
                                dupCard.push(cardUuid)
                            }
                            if (cardUuid && !cardList.includes(cardUuid)) {
                                cardList.push(cardUuid)
                                warehouseList.push([])
                            }

                            //不开启仓库存在重复的卡片
                            if (!isOpenedWarehouse && dupCard.includes(cardUuid)) {
                                return null
                            }

                            if (cardUuid && isOpenedWarehouse && v.get('warehouseCardUuid')) {
                                const index = cardList.findIndex(value => value==cardUuid)
                                if (warehouseList[index].includes(v.get('warehouseCardUuid'))){//同一卡片同一仓库
                                    return null
                                } else {
                                    warehouseList[index].push(v.get('warehouseCardUuid'))
                                }
                            }
                            itemKey++*/
                            const cardUuid = v.get('cardUuid')
                            const warehouseCardUuid = v.get('warehouseCardUuid') ? v.get('warehouseCardUuid') : ''
                            const batch = v.get('batch') ? v.get('batch') : ''
                            const propertyList = v.get('assistList') ? v.get('assistList').toJS().map(v => v['propertyUuid']).sort() : []
                            const allPropertyStr = `${cardUuid}_${warehouseCardUuid}_${batch}_${propertyList.join('_')}`
                            if (cardSetList.includes(allPropertyStr)) {
                                return null
                            } else {
                                cardSetList.push(allPropertyStr)
                            }

                            itemKey++

                            //属性
                            const openAssist = v.getIn(['financialInfo', 'openAssist'])//属性
                            const openSerial = v.getIn(['financialInfo', 'openSerial'])//序列号
                            const openBatch = v.getIn(['financialInfo', 'openBatch'])//批次
                            const openShelfLife = v.getIn(['financialInfo', 'openShelfLife'])//保质期
                            const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])
                            const assistName = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, '')
                            const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                            const batchName = expirationDate ? `${batch}(${expirationDate})` : batch

                            return (
                                <div key={i} className='lrls-bottom-line lrls-margin-bottom'>
                                    <Row className='lrls-more-card lrls-placeholder lrls-card-bottom'>
                                        <span>存货明细({itemKey})：</span>
                                    </Row>
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
                                            {openAssist ? <div className='lrls-single overElli lrls-padding-right'>
                                                <span>属性：</span>
                                                <span className={assistName ? '' : 'lrls-placeholder'}>
                                                    { assistName ? assistName : ' 未选择' }
                                                </span>
                                            </div> : null}
                                            { openBatch ? <div className='lrls-single overElli lrls-padding-right'>
                                                <span>批次：</span>
                                                <span className={batchName ? '' : 'lrls-placeholder'}>
                                                    { batchName ? batchName : ' 未选择' }
                                                </span>
                                            </div> : null }
                                        </Row>
                                        <Row className='lrls-more-card lrls-card-bottom'>
                                            <label>金额:</label>
                                            <XfInput.BorderInputItem
                                                mode='amount'
                                                disabled={v.get('cardUuid') ? false : true}
                                                placeholder='填写成本金额'
                                                value={carryoverCardList.getIn([i, 'amount'])}
                                                onChange={(value) => {
                                                    dispatch(editRunningActions.changeYysrStockCard('carryoverCardList', value, i))
                                                }}
                                            />
                                        </Row>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Row>
        )
    }

}
