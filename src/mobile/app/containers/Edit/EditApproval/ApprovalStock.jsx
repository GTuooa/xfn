import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Button, ButtonGroup, Container, Row, ScrollView, Single, Icon, Amount, TextListInput, ChosenPicker } from 'app/components'

import { decimal, formatMoney } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'


const loop = (data) => {
    data.forEach(v => {
        v['key'] = `${v.uuid}`
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}


@connect(state => state)
export default
class RouterStock extends React.Component {
    state = {
        isAll: true,
        visible: false,
        idx: -1,
        categoryValue: 'ALL',
    }
    componentDidMount() {
        thirdParty.setTitle({title:'存货明细'})
        const componentList = this.props.editApprovalState.get('componentList')
        const item = componentList.find(v => v.get('jrComponentType') === 'MX')
        const stockItem = (item.getIn(['detailList',0])|| []).find(v => v.get('jrComponentType') === 'CH') || fromJS({})
        const selectValueScope = stockItem.get('selectValueScope')
        this.props.dispatch(editApprovalActions.getApprovalStockCard('ALL',true,selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))
    }
    confirmInfo = () => {
        const { editApprovalState, dispatch } = this.props
        const componentList  = editApprovalState.get('componentList')
        const views  = editApprovalState.get('views')
        const idx = views.get('idx')
        const mxItem = componentList.find(v => v.get('jrComponentType') === 'MX')
        const detailList = mxItem.get('detailList')
        const itemList = detailList.get(idx) || fromJS([])
        const amountItem = itemList.find(v => v.get('jrComponentType') === 'MX_AMOUNT') || fromJS({})
        const unitName = amountItem.get('unit') || ''
        const mxIndex = componentList.findIndex(v => v.get('jrComponentType') === 'MX')
        const amountIndex = itemList.findIndex(v => v.get('jrComponentType') === 'MX_AMOUNT')
        const amount = amountItem.get('amount') ? Number(amountItem.get('amount')) : 0
        const quantityItem = itemList.find(v => v.get('label') === '数量') || fromJS({})
        const quantity = quantityItem.get('value')
        const price = amountItem.get('price') ? Number(amountItem.get('price')) : 0
        if (unitName) {
            dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,amountIndex,'value'],`${formatMoney(amount)}${unitName?`(${quantity || '0.00'}${unitName} | ${price || '0.00'}元/${unitName})`:''}`))
        } else {
            dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,amountIndex,'value'],`${formatMoney(amount)}`))
        }
    }
    componentWillUnmount() {
        this.confirmInfo()
    }
	render () {
		const {
            dispatch,
            history,
            editApprovalState,
        } = this.props
		const {
            isAll,
            visible,
            categoryValue,
            stockValue,
            warehouseValue,
        } = this.state
        const componentList  = editApprovalState.get('componentList')
        const views  = editApprovalState.get('views')
        const idx = views.get('idx')
        const mxItem = componentList.find(v => v.get('jrComponentType') === 'MX')
        const mxIndex = componentList.findIndex(v => v.get('jrComponentType') === 'MX')
        const detailList = mxItem.get('detailList')
        const cardSize = detailList.size
        const itemList = detailList.get(idx) || fromJS([])
        const enableWarehouse = itemList.some(w => w.get('jrComponentType') === 'CK')
        const isOpenedQuantity = itemList.some(w => w.get('label') === '数量')
        const stockIndex = itemList.findIndex(v => v.get('jrComponentType') === 'CH')
        const stockItem = itemList.find(v => v.get('jrComponentType') === 'CH') || fromJS({})
        const warehouseItem = itemList.find(v => v.get('jrComponentType') === 'CK') || fromJS({})
        const warehouseIndex = itemList.findIndex(v => v.get('jrComponentType') === 'CK')
        const amountItem = itemList.find(v => v.get('jrComponentType') === 'MX_AMOUNT') || fromJS({})
        const amountIndex = itemList.findIndex(v => v.get('jrComponentType') === 'MX_AMOUNT')
        const quantityItem = itemList.find(v => v.get('label') === '数量') || fromJS({})
        const quantityIndex = itemList.findIndex(v => v.get('label') === '数量')
        const stockCardTree  = editApprovalState.get('stockCardTree') || fromJS([])
        const stockCardList  = editApprovalState.get('stockCardList') || fromJS([])
        const warehouseList  = warehouseItem.get('selectValueList') || fromJS([])
        const unit  = stockItem.get('unit') || fromJS({})
        const unitList  = unit.get('unitList') || fromJS([])
        let unitListJ = [{key:unit.get('name'),value:unit.get('name')},...unitList.toJS().map(v => ({key:v.name,value:v.name}))]
        const unitPriceList  = stockItem.get('unitPriceList') || fromJS([])
        let categoryList = stockCardTree.toJS()
        categoryList.unshift({name:'全部',key:'ALL',uuid:'ALL',childList:[]})
        let stockListArr = stockCardList.toJS().map(v => ({...v,name:`${v.code} ${v.name}`,label:v.name}))
        let warehouseListJ = warehouseList.toJS()
        const selectValueScope = stockItem.get('selectValueScope')
        const amount = amountItem.get('amount') ? Number(amountItem.get('amount')) : 0
        const price = amountItem.get('price') ? Number(amountItem.get('price')) : 0
        const unitName = amountItem.get('unit') || ''
        const quantity = quantityItem.get('value')
        loop(categoryList)
        const preIdx = idx - 1
		const nextIdx = idx + 1

		return(
			<Container className="edit-running">
                <ChosenPicker
                    visible={visible}
                    type='card'
                    title='请选择存货'
                    icon={{
                            type: 'inventory-add',
                            onClick: () => {
                                const showCardModal = () => {
                                    history.push('/config/inventory/inventoryInsert')
                                }
                                dispatch(editApprovalActions.changeModelString(['modelInfo','callback'],(item) => {
                                    let newList = itemList
                                    newList = newList.setIn([stockIndex,'value'],`${item.code}-${item.name}`)
                                                     .setIn([stockIndex,'code'],item.code)
                                                     .setIn([stockIndex,'name'],item.name)
                                                     .setIn([stockIndex,'unit'],fromJS(item.unit))
                                                     .setIn([stockIndex,'unitPriceList'],fromJS(item.unitPriceList))
                                                     .setIn([amountIndex,'unit'],'')
                                                     .setIn([amountIndex,'price'],'')
                                    if (!item.isOpenedQuantity) {
                                        newList = newList.filter(v => v.get('label') !== '数量')
                                    } else if (item.isOpenedQuantity && itemList.every(v => v.get('label') !== '数量')) {
                                        newList = newList.push(fromJS({label:'数量',componentType: "NumberField"}))
                                    }
                                    if (stockItem.get('value')) {
                                        dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',detailList.size],newList))
                                    } else {
                                        dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx],newList))
                                    }
                                }))
                                dispatch(inventoryConfAction.inventorySettingInit())
                                dispatch(inventoryConfAction.beforeAddCard(showCardModal,'editApproval'))
                            }
                        }}
                    district={categoryList}
                    cardList={stockListArr}
                    value={categoryValue}
                    onChange={(value) => {
                        this.setState({categoryValue: value.key})
                        dispatch(editApprovalActions.getApprovalStockCard(value.key,value.top,selectValueScope.get('categoryList'),selectValueScope.get('inCardList'),selectValueScope.get('outCardList'),selectValueScope.get('subCategoryList')))
                    }}
                    onOk={value => {
                        if (value.length) {
                            let newList = itemList
                            newList = newList.setIn([stockIndex,'value'],`${value[0].code}-${value[0].label}`)
                                             .setIn([stockIndex,'code'],value[0].code)
                                             .setIn([stockIndex,'name'],value[0].label)
                                             .setIn([stockIndex,'unit'],fromJS(value[0].unit))
                                             .setIn([stockIndex,'unitPriceList'],fromJS(value[0].unitPriceList))
                                             .setIn([amountIndex,'unit'],'')
                                             .setIn([amountIndex,'price'],'')
                            if (!value[0].isOpenedQuantity) {
                                newList = newList.filter(v => v.get('label') !== '数量')
                            } else if (value[0].isOpenedQuantity && itemList.every(v => v.get('label') !== '数量')) {
                                newList = newList.push(fromJS({label:'数量',componentType: "NumberField"}))
                            }
                            dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx],newList))

                        }
                    }}
                    onCancel={()=> { this.setState({visible: false}) }}
                >
                    <span></span>
                </ChosenPicker>

				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll">
                    <div className='lrls-card'>
                        <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                            <span>存货明细({idx+1})</span>
                        </div>

                        <div className='lrls-more-card lrls-bottom'>
                            <label>存货:</label>
                            <div className='lrls-single' onClick={()=>{ this.setState({visible: true}) }}>
                               <Row className='lrls-category lrls-padding'>
                                   {
                                       stockItem.get('value') ? <span> {`${stockItem.get('value').replace('-',' ') }`} </span>
                                       : <span className='lrls-placeholder'>点击选择存货卡片</span>
                                   }
                                   <Icon type="triangle" />
                               </Row>
                            </div>
                        </div>

                        <div className='lrls-more-card lrls-bottom' style={{display: enableWarehouse ? '' : 'none'}}>
                            <label>仓库:</label>
                            <Single
                                className='lrls-single'
                                district={warehouseList.toJS().map(v => ({
                                    key:v,
                                    value:v
                                }))}
                                value={warehouseItem.get('value')}
                                onOk={value => {
                                    dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,warehouseIndex,'value'],value.value))
                                    // onOk('warehouse', value)
                                }}
                            >
                               <Row className='lrls-category lrls-padding'>
                                   {
                                      warehouseItem.get('value') ? <span>{warehouseItem.get('value')} </span>
                                       : <span className='lrls-placeholder'>点击选择仓库卡片</span>
                                   }
                                   <Icon type="triangle" />
                               </Row>
                            </Single>
                        </div>

                        <Row className={'yysr-amount lrls-bottom'} style={{display: isOpenedQuantity ? '' : 'none'}}>
                            <label>数量:</label>
                            <TextListInput
                                placeholder='填写数量'
                                value={quantityItem.get('value')}
                                onChange={(value) => {
                                    if (/^-{0,1}\d*\.?\d{0,4}$/g.test(value)) {
                                        dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,quantityIndex,'value'],value))
                                        if (amountItem.get('price') > 0) {//计算金额
                                            const autoAmount = decimal(amountItem.get('price')*Number(value))
                                            dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,amountIndex,'amount'],autoAmount))
                                        }

                                    }
                                }}
                            />
                            <Single
                                className='lrls-single'
                                district={unitListJ}
                                value={unitName}
                                onOk={value => {
                                    // onOk('unit', value)
                                    //填写默认单价
                                    dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,amountIndex,'unit'],value.value))

                                    // unitPriceList.map(itemPrice => {
                                    //     if (value.value==itemPrice['unitUuid']) {
                                    //         onOk('price', itemPrice['defaultPrice'])
                                    //         if (quantity > 0) {//计算金额
                                    //             const autoAmount = decimal(quantity*Number(itemPrice['defaultPrice']))
                                    //             onOk('amount', autoAmount)
                                    //
                                    //             const autoTotal = totalAmount  - Number(v.get('amount')) + Number(autoAmount)
                                    //             changeAmount(decimal(autoTotal))
                                    //         }
                                    //     }
                                    // })
                                }}
                            >
                               <Row className='lrls-account lrls-type'>
                                   {
                                       unitName? <span> {unitName} </span>
                                       : <span className='lrls-placeholder'>选择数量单位</span>
                                   }
                                   <Icon type="triangle" />
                               </Row>
                            </Single>
                        </Row>

                        <div className='lrls-more-card lrls-bottom' style={{display: isOpenedQuantity ? '' : 'none'}}>
                            <label>单价:</label>
                            <TextListInput
                                placeholder='请填写单价'
                                value={amountItem.get('price')}
                                onChange={(value) => {
                                    if (/^\d*\.?\d{0,4}$/g.test(value)) {
                                        dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,amountIndex,'price'],value))

                                        if (quantityItem.get('value') > 0) {//计算金额
                                            const autoAmount = decimal(quantityItem.get('value')*Number(value))
                                            dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,amountIndex,'amount'],autoAmount))

                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className='lrls-more-card'
                            onClick={() => {
                                if (!stockItem.get('value')) {
                                    thirdParty.toast.info('请先选择存货卡片')
                                }
                            }}
                        >
                            <label>金额:</label>
                            <TextListInput
                                placeholder='请填写金额'
                                value={amountItem.get('amount')}
                                onChange={(value) => {
                                    if (/^-{0,1}\d*\.?\d{0,4}$/g.test(value)) {
                                        dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,amountIndex,'amount'],value))
                                        if (quantityItem.get('value') > 0) {//计算金额
                                            const autoAmount = decimal(Number(value)/quantityItem.get('value'), 4)
                                            dispatch(editApprovalActions.changeModelString(['componentList',mxIndex,'detailList',idx,amountIndex,'price'],autoAmount))

                                        }
                                        // const autoTotal = totalAmount - Number(v.get('amount')) + Number(value)
                                        // changeAmount(decimal(autoTotal))
                                        //
                                        // if (quantity > 0) {//计算价格
                                        //     const autoPrice = decimal(Number(value)/quantity, 4)
                                        //     onOk('price', autoPrice, i)
                                        //     return
                                        // }
                                    }
                                }}
                            />
                        </div>
                    </div>
				</ScrollView>
                <ButtonGroup>
                    <Button
                        disabled={preIdx <= -1 ? true : false}
                        onClick={() => {
                            this.confirmInfo()
                            dispatch(editApprovalActions.changeModelString(['views','idx'],preIdx))
                        }}
                    >
						<Icon type="arrow-right" style={{transform: 'rotate(180deg)'}}/>
                        <span>上一明细</span>
					</Button>
					<Button onClick={() => {
                        this.confirmInfo()
                        history.goBack()
                    }}>
						<Icon type="confirm"/>
						<span>确定</span>
					</Button>
                    <Button
                        disabled={nextIdx == cardSize ? true : false}
                        onClick={() => {
                            this.confirmInfo()
                            dispatch(editApprovalActions.changeModelString(['views','idx'],nextIdx))
                        }}
                    >
                        <span>下一明细</span>
						<Icon type="arrow-right"/>
					</Button>
				</ButtonGroup>

			</Container>

		)
	}
}
