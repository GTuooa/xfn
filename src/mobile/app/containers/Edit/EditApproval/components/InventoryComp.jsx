import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Single, Icon, Amount, Switch, TextListInput, ChosenPicker } from 'app/components'
import { decimal, formatMoney, numberFourTest } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'
import Star from './Star'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

//营业收入存货卡片
export default class InventoryComp extends Component {
    state = {
        isAll: true,
        visible: false,
        idx: -1,
        categoryValue: 'ALL',
    }
    componentDidMount() {
        const stockItem = (this.props.item.getIn(['detailList',0])|| []).find(v => v.get('jrComponentType') === 'CH') || fromJS({})
        const selectValueScope = stockItem.get('selectValueScope')
        this.props.dispatch(editApprovalActions.getApprovalStockList(selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))
        this.props.dispatch(editApprovalActions.getApprovalStockCard('ALL',true,selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))
    }

    render () {
        const {
            dispatch,
            district,
            cardList,
            cardDisabled,
            categoryType,
            history,
            item,
            index
        } = this.props
        const { isAll, visible, idx, categoryValue } = this.state
        const itemList = item.get('detailList') || fromJS([])
        const stockItem = item.getIn(['detailList',0]).find(v => v.get('jrComponentType') === 'CH') || fromJS({})
        const stockIndex = item.getIn(['detailList',0]).find(v => v.get('jrComponentType') === 'CH')
        const selectValueScope = stockItem.get('selectValueScope')
        let districtJ = district.toJS()
        let cardListJ = cardList.toJS().map(v => ({...v,name:`${v.code} ${v.name}`,label:v.name}))
        districtJ.unshift({name:'全部',key:'ALL',uuid:'ALL',childList:[]})
        loop(districtJ)
        return (
                <div className={''}>
                    <ChosenPicker
                        visible={visible}
                        type='card'
                        multiSelect={true}
                        title='请选择存货'
                        icon={{
                                type: 'inventory-add',
                                onClick: () => {
                                    const showCardModal = () => {
                                        history.push('/config/inventory/inventoryInsert')
                                    }
                                    dispatch(editApprovalActions.changeModelString(['modelInfo','callback'],(item) => {
                                        const curItem = itemList.get(0).map(v => v.set('value','').set('amount','').set('price','').set('unit',''))
                                        const stockIndex = curItem.findIndex(v => v.get('jrComponentType') === 'CH')
                                        const amountIndex = curItem.findIndex(v => v.get('jrComponentType') === 'MX_AMOUNT')
                                        let newList = curItem
                                        newList = newList.setIn([stockIndex,'value'],`${item.code}-${item.name}`)
                                                         .setIn([stockIndex,'code'],item.code)
                                                         .setIn([stockIndex,'name'],item.name)
                                                         .setIn([stockIndex,'unit'],fromJS(item.unit))
                                                         .setIn([stockIndex,'unitPriceList'],fromJS(item.unitPriceList))
                                                         .setIn([amountIndex,'unit'],'')
                                                         .setIn([amountIndex,'price'],'')
                                        if (!item.isOpenedQuantity) {
                                            newList = newList.filter(v => v.get('label') !== '数量')
                                        } else if (item.isOpenedQuantity && curItem.every(v => v.get('label') !== '数量')) {
                                            newList = newList.push(fromJS({label:'数量',componentType: "NumberField"}))
                                        }
                                        dispatch(editApprovalActions.changeModelString(['componentList',index,'detailList',itemList.size],newList))
                                    }))
                                    dispatch(inventoryConfAction.inventorySettingInit())
                                    dispatch(inventoryConfAction.beforeAddCard(showCardModal,'editApproval'))
                                }
                            }}
                        district={districtJ}
                        cardList={cardListJ}
                        value={categoryValue}
                        onChange={value => {
                            this.setState({categoryValue:value.key})
                            dispatch(editApprovalActions.getApprovalStockCard(value.key,value.top,selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))

                        }}
                        onOk={value => {
                            const item = itemList.get(0).map(v => v.set('value','').set('amount','').set('price','').set('unit',''))
                            const valueList = fromJS(value).map(v => {
                                let curItem = item
                                if (!v.get('isOpenedQuantity')) {
                                    curItem = item.filter(v => v.get('label') !== '数量')
                                } else if (v.get('isOpenedQuantity') && item.every(v => v.get('label') !== '数量')) {
                                    curItem = item.push(fromJS({label:'数量',componentType: "NumberField"}))
                                }
                                const stockIndex = curItem.findIndex(v => v.get('jrComponentType') === 'CH')
                                curItem = curItem.setIn([stockIndex,'value'],`${v.get('code')}-${v.get('label')}`)
                                                .setIn([stockIndex,'code'],v.get('code'))
                                                .setIn([stockIndex,'name'],v.get('label'))
                                                .setIn([stockIndex,'unit'],fromJS(v.get('unit')))
                                                .setIn([stockIndex,'unitPriceList'],fromJS(v.get('unitPriceList')))
                                return curItem
                            })
                            dispatch(editApprovalActions.changeModelString(['componentList',index,'detailList'],itemList.concat(valueList)))
                        }}
                        onCancel={()=> { this.setState({visible: false}) }}
                    >
                        <span></span>
                    </ChosenPicker>

                    <div>
                        {
                            itemList.map((v, i) => {
                                const enableWarehouse = v.some(w => w.get('jrComponentType') === 'CK')
                                const isOpenedQuantity = v.some(w => w.get('label') === '数量')
                                const stockItem = v.find(v => v.get('jrComponentType') === 'CH') || fromJS({})
                                const warehouseItem = v.find(v => v.get('jrComponentType') === 'CK') || fromJS({})
                                const amountItem = v.find(v => v.get('jrComponentType') === 'MX_AMOUNT') || fromJS({})
                                const quantityItem = v.find(v => v.get('label') === '数量') || fromJS({})
                                const amount = amountItem.get('amount') ? Number(amountItem.get('amount')) : 0
                                const price = amountItem.get('price') ? Number(amountItem.get('price')) : 0
                                const unit = amountItem.get('unit') || ''
                                const quantity = quantityItem.get('value') ? Number(quantityItem.get('value')) : 0
                                const cardValue = stockItem.get('value') || ''
                                const warehouseValue = warehouseItem.get('value')
                                return (
                                    <div
                                        key={i}
                                        className='approval-inventory'
                                        onClick={() => {
                                            history.push('/editApproval/stock')
                                            dispatch(editApprovalActions.changeModelString(['views','idx'],i))

                                        }}
                                        style={{borderBottom:'1px solid #eeeeee'}}
                                        >
                                        <div className='approval-inventory-title split-area'>
                                            <span>存货明细({i+1})</span>
                                            {
                                                itemList.size > 1?
                                                <span
                                                    className={cardDisabled ? 'approval-placeholder' : 'approval-blue'}
                                                    // style={{display: isOne ? 'none' : ''}}
                                                    onClick={e => {
                                                        e.stopPropagation()
                                                        dispatch(editApprovalActions.changeModelString(['componentList',index,'detailList'],itemList.splice(i,1)))
                                                        // changeAmount(totalAmount - Number(v.get('amount')))
                                                    }}
                                                >
                                                        删除
                                                </span>
                                                :
                                                <span></span>
                                            }

                                        </div>
                                        <div
                                            className='approval-more-card'
                                            onClick={() => {
                                        }}>
                                            <div className='approval-single'>
                                                <Row>
                                                    <div className='approval-inventory-item'>
                                                        <span><Star/>存货:</span>
                                                        <span className={cardValue ? '' : 'approval-placeholder'}>
                                                            {cardValue.replace('-',' ') || ' 未选择'}
                                                        </span>
                                                    </div>
                                                </Row>
                                                    {
                                                        enableWarehouse?
                                                            <Row>
                                                            <div className='approval-inventory-item'>
                                                                <span><Star/>仓库:</span>
                                                                <span className={warehouseValue ? '' : 'approval-placeholder'}>
                                                                    { warehouseValue || ' 未选择' }
                                                                </span>
                                                            </div>
                                                            </Row>:''
                                                    }
                                                <Row className='approval-inventory-item'>
                                                    <div className='approval-inventory-item'>
                                                        <span><Star/>金额:</span>
                                                        <span>
                                                            <span>{amountItem.get('value')}</span>
                                                        </span>
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

                    <div className='split-area'
                    >
                        {/* {
                            stockCardList.size > 1 ? <div>
                                总金额：<Amount showZero>{totalAmount}</Amount>
                            </div> : <div></div>
                        } */}
                        <div></div>
                        <div className='inventory-bottom' style={{marginTop:'0.1rem'}}>
                            <div className={cardDisabled ? 'approval-placeholder' : 'approval-blue'}
                                onClick={() => {
                                    this.setState({ visible: true, idx: itemList.size,})
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
