import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Amount, TextListInput, Single, Icon, ChosenPicker } from 'app/components'

import { decimal } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
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
const amountProps = {decimalZero: false, decimalPlaces: 4}


export default class JzcbCom extends Component {
    state = {
        isAll: true,
        visible: false,
        idx: -1,
        categoryValue: 'ALL',
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.oriState != nextProps.oriState) {
            this.setState({categoryValue: 'ALL', isAll: true,})
        }
    }

    render () {
        const { dispatch, oriState, stockCardList, stockList, isModify, isOpenedWarehouse, stockCategoryList, commonCardList, relationCategoryUuid, history } = this.props
        const { isAll, visible, idx, categoryValue } = this.state

        const isOne = stockCardList.size == 1 ? true : false
        const onOk = (dataType, value, idx) => dispatch(editRunningActions.changeYysrStockCard(dataType, value, idx, 'JZCB'))
        const stockCardUuidList = stockCardList.map(v => v.get('cardUuid'))
        const filterStockList = stockList.filter(v => !stockCardUuidList.includes(v.get('cardUuid')))
        const isJz = oriState=='STATE_YYSR_ZJ' ? true : false//是否是直接结转

        let categoryList = [{uuid: 'ALL', name: '全部', top: true, childList: []}]
        stockCategoryList.map(v => {
            categoryList.push(v.toJS())
        })
        loop(categoryList)
        if (isModify && !isJz) {
            categoryList = [{key: 'ALL', label: '全部', top: true, childList: []}]
        }

        let stockListArr = isAll ? stockList.toJS() : commonCardList
        stockListArr.map(v => {
            v['name'] = v['key']
            v['uuid'] = v['cardUuid']
            if (['STATE_YYSR_XS', 'STATE_YYSR_TS'].includes(oriState) && stockCardUuidList.includes(v['cardUuid'])) {
                v['disabled'] = true
            }
        })

        return (
            <div className={stockCardList.size ? 'lrls-card' : ''}>
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
                        dispatch(editRunningActions.getCostStockByCategory(value.key, value['top'], 'commonCardJzcbList'))
                    }}
                    onOk={value => {
                        if (value.length==0) { return }
                        onOk('card', value, idx)
                        // if (!isModify && oriState != 'STATE_YYSR_ZJ') {
                        //     dispatch(editRunningActions.getJzcbList(true))
                        //     dispatch(editRunningActions.getJzcbCategoryList())
                        //     if (isOpenedWarehouse) {
                        //         dispatch(editRunningActions.getJzcbWarehouseList())
                        //     }
                        // }
                        if (oriState == 'STATE_YYSR_ZJ') {
                            dispatch(editRunningActions.getJzcbListPrice(idx, value))
                        }
                        if (isModify) {//筛选单据
                            dispatch(editRunningActions.filterJzcbList())
                        }

                    }}
                    onCancel={()=> { this.setState({visible: false}) }}
                >
                    <span></span>
                </ChosenPicker>

                {
                    stockCardList.map((v, i) => {
                        //直接结转
                        const cardUuid = v.get('cardUuid')
                        const warehouseCardUuid = v.get('warehouseCardUuid')
                        const warehouseCardCode = v.get('warehouseCardCode')
                        const warehouseCardName = v.get('warehouseCardName')
                        const isOpenedQuantity = v.get('isOpenedQuantity')
                        const quantity = v.get('quantity') ? Number(v.get('quantity')) : 0
                        const price = v.get('price') ? Number(v.get('price')) : 0
                        const amount = v.get('amount') ? Number(v.get('amount')) : 0
                        const unitName = v.get('unitName') ? v.get('unitName') : ''

                        //属性 直接结转用
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
                                        style={{display: (isOne || !isJz) ? 'none' : ''}}
                                        onClick={() => {
                                            onOk('delete', '', i)
                                            // if (!isModify && v.get('cardUuid') && oriState != 'STATE_YYSR_ZJ') {
                                            //     dispatch(editRunningActions.getJzcbList(true))
                                            // }
                                            // if (isModify) {//筛选单据
                                            //     dispatch(editRunningActions.filterJzcbList())
                                            // }
                                        }}
                                    >
                                            删除
                                    </span>
                                </div>
                                <div className='lrls-more-card' onClick={() => {
                                    if (isJz && !relationCategoryUuid) {
                                        return thirdParty.toast.info('请先选择处理类别', 2)
                                    }
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
                                                <span className={isJz && openSerial ? 'sn' : ''}>数量:</span>
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
                            </div>
                        )
                    })
                }

                <div className='lrls-more-card' style={{fontWeight: 'bold', display: isJz ? '' : 'none'}}>
                    <div></div>
                    <div className='lrls-blue'
                        onClick={() => {
                            if (!relationCategoryUuid) {
                                return thirdParty.toast.info('请先选择处理类别', 2)
                            }
                            this.setState({ visible: true, idx: stockCardList.size, })
                        }}
                    >
                        +添加存货明细
                    </div>
                </div>
            </div>
        )
    }
}
