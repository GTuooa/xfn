import React from 'react'
import { connect } from 'react-redux'
import { fromJS, toJS } from 'immutable'

import thirdParty from 'app/thirdParty'
import { Button, ButtonGroup, Container, Row, ScrollView, Single, Icon, XfInput, ChosenPicker } from 'app/components'
import { getCategorynameByType, numberTest } from 'app/containers/Config/Approval/components/common.js'
import { numberFourTest } from 'app/utils'

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

@connect(state => state)
export default
    class RouterStock extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isAll: true,
            visible: false,
            categoryValue: 'ALL',
        }
    }

    componentDidMount() {
        thirdParty.setTitle({ title: '存货明细' })
        thirdParty.setIcon({ showIcon: false })
        thirdParty.setRight({ show: false })
    }

    render() {
        const { dispatch, history, homeState, editRunningModalState } = this.props
        const { visible, categoryValue } = this.state

        const idx = editRunningModalState.get('currentEditInvetoryIndex')
        console.log('idx', idx);
        
        const categoryData = editRunningModalState.get('categoryData')
        const editRunningModalTemp = editRunningModalState.get('editRunningModalTemp')
        const stockList = editRunningModalTemp.get('stockList')
        const billList = editRunningModalTemp.get('billList')
        const taxRate = billList.getIn([0, 'taxRate'])
        const stockItem = stockList.get(idx)

        const invetorySourceCategoryList = editRunningModalState.get('invetorySourceCategoryList')  // 可选类别列表
        const invetorySourceCardList = editRunningModalState.get('invetorySourceCardList')  // 可选类别列表
        const warehouseSourceCategoryList = editRunningModalState.get('warehouseSourceCategoryList')  // 可选类别列表
        const allInvetoryList = editRunningModalState.get('allInvetoryList')  // 可选类别列表
        const enableWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).indexOf('WAREHOUSE') > -1
        const openQuantity = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).indexOf('QUANTITY') > -1

        const jrCategoryType = editRunningModalTemp.get('jrCategoryType')
        const { categoryTypeObj } = jrCategoryType ? getCategorynameByType(jrCategoryType) : { categoryTypeObj: '' }
        const stockRange = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'stockRange']) : fromJS([])

        const stockCategoryList = invetorySourceCategoryList //卡片类别列表
        const warehouseList = warehouseSourceCategoryList

        let categoryList = [{ uuid: 'ALL', name: '全部', childList: [] }]//存货类别列表
        let stockListArr = invetorySourceCardList ? invetorySourceCardList.toJS() : []
        let cardSize = stockList.size

        stockCategoryList.map(v => {
            if (stockRange.includes(v.get('uuid'))) {
                categoryList.push(v.toJS())
            }
        })
        stockListArr.map(v => {
            v['cardName'] = v.name
            v['key'] = `${v.code} ${v.name}`
            v['name'] = v['key']
        })

        const cardDisabled = false

        loop(categoryList)
        const preIdx = idx - 1
        const nextIdx = idx + 1

        let unitList = [], unitPriceList = []
        const cardUuid = stockItem.get('stockUuid')
        if (openQuantity) {
            for (const item of stockListArr) {
                if (item['isOpenedQuantity']) {
                    if (item['uuid'] == cardUuid) {
                        unitList.push({
                            key: item['unit']['name'],
                            value: item['unit']['uuid'],
                        });
                        item['unit']['unitList'].map(unitItem => {
                            unitList.push({
                                key: unitItem['name'],
                                value: unitItem['uuid'],
                            });
                        });
                        if (item['unitPriceList']) {
                            unitPriceList = item['unitPriceList'];
                        };
                        break;
                    }
                }
            }
        };

        return (
            <Container className="edit-running">
                <ChosenPicker
                    visible={visible}
                    type='card'
                    title='请选择存货'
                    icon={{
                        type: 'inventory-add',
                        onClick: () => {
                            if (stockRange.size) {
                                dispatch(editRunningConfigActions.beforeAddInventoryCardFromEditRunning(stockRange, history, 'searchApproval'))
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
                            return this.setState({ isAll: true })
                        }
                        this.setState({ isAll: false })
                        dispatch(searchApprovalActions.getStockSomeCardList(value.key, value.top === true ? 1 : ''))
                    }}
                    onOk={value => {
                        if (value.length) {
                            const valueItem = value[0]

                            const stockUuid = valueItem['uuid']
                            const stockCode = valueItem['code']
                            const stockName = valueItem['cardName']
                            const isOpenedQuantity = valueItem['isOpenedQuantity']
                            const amount = stockItem.get('amount')
                            const depotUuid = stockItem.get('depotUuid')
                            const depotCode = stockItem.get('depotCode')
                            const depotName = stockItem.get('depotName')
                            const obj = {
                                stockUuid,
                                stockName,
                                stockCode,
                                amount,
                                isOpenedQuantity,
                                depotUuid,
                                depotCode,
                                depotName
                            }
                            if (valueItem.priceList && valueItem.priceList.length) {
                                let unitUuid = '', unitName = ''
                                if (valueItem.unit.uuid === valueItem.priceList[0].unitUuid) {
                                    unitName = valueItem.unit.name
                                    unitUuid = valueItem.unit.uuid
                                } else {
                                    valueItem.unit.unitList.forEach(v => {
                                        if (v.uuid === valueItem.priceList[0].unitUuid) {
                                            unitName = v.name
                                            unitUuid = v.uuid
                                        }
                                    })
                                }
                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx], fromJS({
                                    ...obj,
                                    unitPrice: valueItem.priceList[0].defaultPrice,
                                    unitUuid: unitUuid,
                                    unitName: unitName
                                })))
                            } else {
                                if (valueItem.unit && !valueItem.unit.unitList.length) {
                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'unitName'], valueItem.unit.name))
                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'unitUuid'], valueItem.unit.uuid))
                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx], fromJS({
                                        ...obj,
                                        unitUuid: valueItem.unit.uuid,
                                        unitName: valueItem.unit.name
                                    })))
                                } else {
                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx], fromJS({
                                        ...obj
                                    })))
                                }
                            }
                        }
                    }}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    <span></span>
                </ChosenPicker>

                <ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll">

                    <div className='lrls-card'>
                        <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                            <span>存货明细({idx + 1})</span>
                        </div>

                        <div className='lrls-more-card lrls-bottom'>
                            <label>存货:</label>
                            <div className='lrls-single' onClick={() => {
                                if (cardDisabled) { return }
                                this.setState({ visible: true })
                            }}
                            >
                                <Row className='lrls-category lrls-padding'>
                                    {
                                        stockItem.get('stockUuid') ? <span> {`${stockItem.get('stockCode')} ${stockItem.get('stockName')}`} </span>
                                            : <span className='lrls-placeholder'>点击选择存货卡片</span>
                                    }
                                    <Icon type="triangle" color={cardDisabled ? '#999' : ''} />
                                </Row>
                            </div>
                        </div>
                        {
                            enableWarehouse ?
                                <div className='lrls-more-card lrls-bottom' style={{ display: enableWarehouse ? '' : 'none' }}>
                                    <label>仓库:</label>
                                    <Single
                                        className='lrls-single'
                                        district={warehouseList ? warehouseList.toJS() : []}
                                        value={stockItem.get('depotUuid')}
                                        onOk={value => {
                                            const cardUuid = value['uuid']
                                            const code = value['code']
                                            const name = value['name']
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'depotUuid'], cardUuid))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'depotCode'], code))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'depotName'], name))
                                        }}
                                    >
                                        <Row className='lrls-category lrls-padding'>
                                            {
                                                stockItem.get('depotUuid') ? <span> {stockItem.get('depotCode')} {stockItem.get('depotName')} </span>
                                                    : <span className='lrls-placeholder'>点击选择仓库卡片</span>
                                            }
                                            <Icon type="triangle" />
                                        </Row>
                                    </Single>
                                </div>
                                : null
                        }

                        {
                            openQuantity ?
                                <Row className={'yysr-amount lrls-bottom'} style={{ display: (allInvetoryList.find(w => w.get('uuid') === stockItem.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(stockItem.get('isOpenedQuantity') || false) ? '' : 'none' }}>
                                    <label>数量:</label>
                                    <XfInput.BorderInputItem
                                        mode={'number'}
                                        placeholder='填写数量'
                                        tipTit="数量"
                                        value={stockItem.get('number')}
                                        negativeAllowed={true}
                                        onChange={(value) => {

                                            // numberFourTest(value, (value) => {
                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'number'], value))
                                                if (stockItem.get('unitPrice') > 0) {
                                                    const amount = ((value || 0) * stockItem.get('unitPrice')).toFixed(2)
                                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'amount'], amount))
                                                    dispatch(searchApprovalActions.autoCalculateStockAmount())
                                                    taxRate && dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate))
                                                }
                                            // }, true)
                                        }}
                                    />
                                    <Single
                                        className='lrls-single'
                                        district={unitList}
                                        value={stockItem.get('unitUuid')}
                                        onOk={value => {

                                            const uuid = value['value']
                                            const name = value['key']

                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'unitUuid'], uuid))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'unitName'], name))

                                            const curItem = allInvetoryList.find(w => w.get('uuid') === stockItem.get('stockUuid')) || fromJS([])

                                            const curPriceItem = (curItem.get('unitPriceList') || []).find(v => v.get('unitUuid') === uuid) || fromJS({})
                                            const curPrice = curPriceItem.get('defaultPrice') || 0
                                            curPrice && dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'unitPrice'], curPrice))

                                            if (curPrice && stockItem.get('number') !== '') {
                                                const amount = ((stockItem.get('number') || 0) * curPrice).toFixed(2)
                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'amount'], amount))
                                                dispatch(searchApprovalActions.autoCalculateStockAmount())
                                                taxRate && dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate))

                                            }
                                        }}
                                    >
                                        <Row className='lrls-account lrls-type'>
                                            {
                                                stockItem.get('unitUuid') ? <span> {stockItem.get('unitName')} </span>
                                                    : <span className='lrls-placeholder'>选择数量单位</span>
                                            }
                                            <Icon type="triangle" />
                                        </Row>
                                    </Single>
                                </Row>
                                : null
                        }

                        {
                            openQuantity ?
                                <div className='lrls-more-card lrls-bottom' style={{ display: (allInvetoryList.find(w => w.get('uuid') === stockItem.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(stockItem.get('isOpenedQuantity') || false) ? '' : 'none' }}>
                                    <label>单价:</label>
                                    <XfInput.BorderInputItem
                                        placeholder='请填写单价'
                                        mode={'number'}
                                        tipTit="单价"
                                        value={stockItem.get('unitPrice')}
                                        onChange={(value) => {
                                            // numberFourTest(value, (value) => {
                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'unitPrice'], value))

                                                if (stockItem.get('number') !== '') {
                                                    const amount = ((value || 0) * stockItem.get('number')).toFixed(2)
                                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'amount'], amount))
                                                    dispatch(searchApprovalActions.autoCalculateStockAmount())
                                                    taxRate && dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate))

                                                }
                                            // })
                                        }}
                                    />
                                </div>
                                : null
                        }

                        <div className='lrls-more-card'
                            onClick={() => {
                                if (!cardUuid) {
                                    thirdParty.toast.info('请先选择存货卡片')
                                }
                            }}
                        >
                            <label>金额:</label>
                            <XfInput.BorderInputItem
                                mode="amount"
                                disabled={cardDisabled || (cardUuid ? false : true)}
                                placeholder='请填写金额'
                                negativeAllowed={true}
                                value={stockItem.get('amount')}
                                onChange={(value) => {
                                    // numberTest(value, (value) => {
                                        dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'amount'], value))
                                        dispatch(searchApprovalActions.autoCalculateStockAmount())
                                        taxRate && dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate))

                                        if ((value > 0 && stockItem.get('number') < 0) || (value < 0 && stockItem.get('number') > 0)) {
                                            const price = parseFloat(((value || 0) / -stockItem.get('number')).toFixed(4))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'number'], -stockItem.get('number')))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'unitPrice'], price))
                                        } else if (stockItem.get('number') > 0 || stockItem.get('number') < 0) {
                                            const price = parseFloat(((value || 0) / stockItem.get('number')).toFixed(4))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList', idx, 'unitPrice'], price))
                                        }
                                    // }, true)
                                }}
                            />
                        </div>
                    </div>
                </ScrollView>
                <ButtonGroup>
                    <Button
                        disabled={preIdx <= -1 ? true : false}
                        onClick={() => {
                            dispatch(searchApprovalActions.changeSearchApprovalString('', 'currentEditInvetoryIndex', preIdx))
                        }}
                    >
                        <Icon type="arrow-right" style={{ transform: 'rotate(180deg)' }} />
                        <span>上一明细</span>
                    </Button>
                    <Button onClick={() => { history.goBack() }}>
                        <Icon type="confirm" />
                        <span>确定</span>
                    </Button>
                    <Button
                        disabled={nextIdx == cardSize ? true : false}
                        onClick={() => {
                            dispatch(searchApprovalActions.changeSearchApprovalString('', 'currentEditInvetoryIndex', nextIdx))
                        }}
                    >
                        <span>下一明细</span>
                        <Icon type="arrow-right" />
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}