import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'

import XfIcon from 'app/components/Icon'
import { XfnSelect, XfInput } from 'app/components'
import { Select, Divider, Icon, Button, Modal } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import AddCardModal from 'app/containers/Config/Inventory/AddCardModal.jsx'
import MultipleModal  from './MultipleModal'

import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
	class Inventory extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
			warehouseModal:false,
			warehouseCards:{
				warehouseCardUuid:'',
				warehouseCardCode:'',
				warehouseCardName:''
			},
		}
	}

	render() {

		const {
			dispatch,
            stockCardList,
            // carryoverCardList,
            stockList,
            warehouseList,
            oriState,
            stockRange,
            amount,
            taxRate,
            showSingleModal,
            showStockModal,
            MemberList,
            selectThingsList,
            thingsList,
            selectedKeys,
            categoryTypeObj,
            currentCardType,
            insertOrModify,
            enableWarehouse,
            openQuantity,
            selectList,
            selectItem,
            jrAmount
		} = this.props

		const { showCardModal, warehouseModal, warehouseCards } = this.state

		const saleOrPurchase = {
            acBusinessIncome: 'sale',
            acBusinessExpense: 'purchase'
        }
        let className = ''
        if (enableWarehouse && openQuantity) {
            className = 'inventory-content-area-warehouse'
        } else if (enableWarehouse && !openQuantity) {
            className = 'inventory-content-area-warehouse-no-open'
        } else if (!enableWarehouse && openQuantity) {
            className = 'inventory-content-area'
        } else {
            className = 'inventory-content-area-no-open'
        }

		return (
			<div className='inventory-content'>
                <div className={className} style={{marginBottom:'10px'}}>
                    <span>存货</span>
                    {
                        enableWarehouse?
                        <span>
                            <span style={{marginRight:'5px'}}>仓库</span>
                            <XfIcon
                                type="editConfig"
                                onClick={() => {
                                    this.setState({
                                        warehouseModal:true
                                    })
                                }}
                            />
                        </span>
                        :''
                    }
                    {
                        openQuantity?
                        <span>数量</span>
                        :''
                    }
                    {
                        openQuantity?
                        <span>单价</span>
                        :''
                    }
                    <span>金额</span>
                    <span></span>
				</div>
				{
                    stockCardList.map((v,i) =>
                        <div key={i} className={className}>
                            <span>
                                <XfnSelect
                                    combobox
                                    showSearch
                                    placeholder='请选择存货'
                                    value={v.get('stockCode') ?`${v.get('stockCode')?v.get('stockCode'):''} ${v.get('stockName') ? v.get('stockName'):''}`:undefined}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{ margin: '4px 0',display:stockRange.size?'':'none' }} />
                                            {
                                                stockRange.size?
                                                <div
                                                    style={{ padding: '8px', cursor: 'pointer' }}
                                                    onMouseDown={() => {
                                                        const showModal = () => {
                                                            this.setState({showCardModal: true})
                                                        }
                                                        dispatch(configCallbackActions.beforeRunningAddInventoryCard(showModal, stockRange, saleOrPurchase[categoryTypeObj]))
                                                    }}
                                                >
                                                    <Icon type="plus" /> 新增存货
                                                </div>:''
                                            }

                                        </div>
                                    )}
                                    onChange={(value,options) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const stockUuid = valueList[0]
                                        const stockCode = valueList[1]
                                        const stockName = valueList[2]
                                        const isOpenedQuantity = valueList[3]
                                        const amount = v.get('amount')
                                        const depotUuid = v.get('depotUuid')
                                        const depotCode = v.get('depotCode')
                                        const depotName = v.get('depotName')
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
                                        // dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['carryoverCardList',i], fromJS({
                                        //     stockUuid,
                                        //     stockName,
                                        //     stockCode,
                                        //     depotUuid,
                                        //     depotCode,
                                        //     depotName})
                                        // ))
                                        if (options.props.priceList && options.props.priceList.size) {
                                            let unitUuid = '', unitName = ''
                                            if (options.props.unit.get('uuid') === options.props.priceList.getIn([0,'unitUuid'])) {
                                                unitName = options.props.unit.get('name')
                                                unitUuid = options.props.unit.get('uuid')
                                            } else {
                                                options.props.unit.get('unitList').map(v => {
                                                    if (v.get('uuid') === options.props.priceList.getIn([0,'unitUuid'])) {
                                                        unitName = v.get('name')
                                                        unitUuid = v.get('uuid')
                                                    }
                                                })
                                            }
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i], fromJS({
                                                ...obj,
                                                unitPrice:options.props.priceList.getIn([0,'defaultPrice']),
                                                unitUuid:unitUuid,
                                                unitName:unitName
                                            })))
                                        } else {
                                            if (options.props.unit && !options.props.unit.get('unitList').size) {
                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i], fromJS({
                                                    ...obj,
                                                    unitUuid:options.props.unit.get('uuid'),
                                                    unitName:options.props.unit.get('name')
                                                })))
                                            } else {
                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i], fromJS({
                                                    ...obj
                                                })))
                                            }
                                        }
                                    }}
                                >
                                    {
                                        stockList.map((v, i) => {
                                            return (
                                                <Option
                                                    key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${i}`}
                                                    priceList={v.get('unitPriceList')}
                                                    unit={v.get('unit')}
                                                >
                                                    {`${v.get('code')} ${v.get('name')}`}
                                                </Option>
                                            )
                                        })
                                    }
                                </XfnSelect>
                                {/* <span
                                    className='chosen-word'
                                    onClick={() => {
                                        dispatch(editRunningActions.getInventoryAllCardList(stockRange, 'showSingleModal'))
                                        dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'stock'))
                                        this.setState({
                                            index:i,
                                            curAmount:v.get('amount')
                                        })
                                    }}
                                >
                                    选择
                                </span> */}
                            </span>
                            {
                                enableWarehouse?
                                <span className='warehouse-select'>
                                    <XfnSelect
                                        placeholder='请选择'
                                        combobox
                                        showSearch
                                        value={v.get('depotName') ?`${v.get('depotCode') ? v.get('depotCode'):''} ${v.get('depotName') ? v.get('depotName') : ''}`:undefined}
                                        dropdownRender={menu => (
                                            <div>
                                                {menu}
                                            </div>
                                        )}
                                        onChange={value => {
                                            const valueList = value.split(Limit.TREE_JOIN_STR)
                                            const cardUuid = valueList[0]
                                            const code = valueList[1]
                                            const name = valueList[2]
                                            const amount = v.get('amount')
                                            // dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['carryoverCardList',i], fromJS({
                                            //     stockUuid:v.get('stockUuid'),
                                            //     stockName:v.get('stockName'),
                                            //     stockCode:v.get('stockCode'),
                                            //     depotUuid:cardUuid,
                                            //     depotCode:code,
                                            //     depotName:name})
                                            // ))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'depotUuid'], cardUuid))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'depotCode'], code))
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'depotName'], name))
                                        }}
                                        >
                                        {
                                            warehouseList.map((v, i) => {
                                                return (
                                                    <Select.Option
                                                        key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                                    >
                                                        {`${v.get('code')} ${v.get('name')}`}
                                                    </Select.Option>
                                                )
                                            })
                                        }
                                    </XfnSelect>
                                </span>
                                :''
                            }
                            {
                                openQuantity?
                                <span>
                                    {
                                        (stockList.find(w => w.get('uuid') === v.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                        <XfInput
                                            mode="number"
                                            tipTit="数量"
                                            placeholder='输入数量'
                                            value={v.get('number')}
                                            negativeAllowed={true}
                                            onChange={(e) => {
                                                // numberFourTest(e, (value) => {
                                                    let value = e.target.value
                                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'number'], value))
                                                    if (v.get('unitPrice') > 0) {
                                                        const amount =((value || 0) * v.get('unitPrice')).toFixed(2)
                                                        dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], amount))
                                                        dispatch(searchApprovalActions.autoCalculateStockAmount())
                                                        taxRate && dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate))
                                                    }
                                                // }, true)
                                            }}
                                        />:''
                                    }

                                        {
                                            (stockList.find(w => w.get('uuid') === v.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                            (() => {
                                                const curItem = stockList.find(w => w.get('uuid') === v.get('stockUuid')) || fromJS([])
                                                return(
                                                    <Select
                                                        placeholder='单位'
                                                        style={{marginLeft:'8px',alignSelf:'flex-end'}}
                                                        dropdownClassName='auto-width'
                                                        value={v.get('unitName') ?`${v.get('unitCode') ? v.get('unitCode'):''} ${v.get('unitName') ? v.get('unitName') : ''}`:undefined}
                                                        onChange={(value) => {
                                                            const valueList = value.split(Limit.TREE_JOIN_STR)
                                                            const uuid = valueList[0]
                                                            const name = valueList[1]
                                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitUuid'], uuid))
                                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitName'], name))
                                                            const curPriceItem = (curItem.get('unitPriceList') || []).find(v => v.get('unitUuid') === uuid) || fromJS({})
                                                            const curPrice = curPriceItem.get('defaultPrice') || 0
                                                            curPrice && dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], curPrice))
                                                            // if (curPrice && v.get('number') > 0) {
                                                            if (curPrice && v.get('number') !== '') {
                                                                const amount =((v.get('number') || 0) * curPrice).toFixed(2)
                                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], amount))
                                                                dispatch(searchApprovalActions.autoCalculateStockAmount())
                                                                taxRate && dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate))

                                                            }
                                                        }}
                                                    >
                                                        {
                                                            curItem.getIn(['unit','uuid'])?
                                                            <Option key={curItem.getIn(['unit','uuid'])} value={
                                                                `${curItem.getIn(['unit','uuid'])}${Limit.TREE_JOIN_STR}${curItem.getIn(['unit','name'])}`
                                                            }>
                                                                {curItem.getIn(['unit','name'])}
                                                            </Option>:''
                                                        }

                                                        {
                                                            (curItem.getIn(['unit','unitList']) || []).map(v =>
                                                                <Option key={v.get('uuid')} value={
                                                                    `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`
                                                                }>
                                                                    {v.get('name')}
                                                                </Option>
                                                            )
                                                        }
                                                    </Select>
                                                )
                                            })():''
                                        }
                                </span>
                                :''
                            }
                            {
                                openQuantity?
                                <span>
                                    {
                                        (stockList.find(w => w.get('uuid') === v.get('stockUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                        <XfInput
                                            mode="number"
                                            tipTit="单价"
                                            placeholder='请输入单价'
                                            value={v.get('unitPrice')}
                                            onChange={(e) => {
                                                // numberFourTest(e, (value) => {
                                                    let value = e.target.value
                                                    dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], value))
                                                    if (v.get('number') !== '') {
                                                        const amount =((value || 0) * v.get('number')).toFixed(2)
                                                        dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], amount))
                                                        dispatch(searchApprovalActions.autoCalculateStockAmount())
                                                        taxRate && dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate))
                                                    }
                                                // })
                                            }}
                                        /> : ''
                                    }
                                </span> : ''
                            }
                            <span>
                                <XfInput
                                    mode="amount"
                                    negativeAllowed={true}
                                    placeholder='请输入金额'
                                    value={v.get('amount')}
                                    onChange={(e) => {
                                        // numberTest(e, (value) => {
                                            let value = e.target.value
                                            dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'amount'], value))
                                            dispatch(searchApprovalActions.autoCalculateStockAmount())
                                            taxRate && dispatch(searchApprovalActions.searchApprovalChangeRunningTaxRate(taxRate))

                                            if ((value > 0 && v.get('number') < 0) || (value < 0 && v.get('number') > 0)) {
                                                const price = ((value || 0) / -v.get('number')).toFixed(4)
                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'number'], -v.get('number')))
                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], price))
                                            } else if (v.get('number')>0 || v.get('number')<0) {
                                                const price = ((value || 0) / v.get('number')).toFixed(4)
                                                dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], price))
                                            }

                                            // if (v.get('number') > 0) {
                                            //     const price = ((value || 0) / v.get('number')).toFixed(2)
                                            //     dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', ['stockList',i,'unitPrice'], price))
                                            // }
                                        // }, true)
                                    }}
                                />
                            </span>
                            <span>

                            {
                                stockCardList.size > 1 ?
                                    <XfIcon
                                        type="bigDel"
                                        theme="outlined"
                                        onClick={() => {
                                            dispatch(searchApprovalActions.deleteSearchApprovalStock(stockCardList, i, taxRate))
                                            // dispatch(searchApprovalActions.deleteSearchApprovalCarrayover(carryoverCardList,i))
                                        }}
                                    />
                                 : ''
                            }
                            </span>
                        </div>
                    )
				}
				<div className='inventory-button'>
                    <Button
                        onClick={() => {
                            dispatch(searchApprovalActions.addSearchApprovalStock(stockCardList,stockCardList.size -1))
                            // dispatch(searchApprovalActions.addSearchApprovalCarrayover(carryoverCardList,stockCardList.size -1))
                            // if (stockCardList.size === 1) {
                            //     dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp',['stockList',0,'amount'], amount))
                            // }
                        }}
                    >
                        <XfIcon type='big-plus'/>添加存货明细
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(searchApprovalActions.getInventoryAllCardList(stockRange, 'showStockModal'))
                        }}
                    >
                        <XfIcon type='editPlus'/>批量添加存货
                    </Button>
				</div>
				<AddCardModal
					showModal={showCardModal}
					closeModal={() => this.setState({showCardModal: false})}
					dispatch={dispatch}
                    enableWarehouse={enableWarehouse}
                    fromPage='searchApproval'
                    // type={saleOrPurchase[categoryTypeObj]}
				/>
                <MultipleModal
                    MemberList={MemberList}
                    selectThingsList={selectThingsList}
                    thingsList={thingsList}
                    dispatch={dispatch}
                    showModal={showStockModal}
                    selectList={selectList}
                    categoryList={stockRange}
                    selectItem={selectItem}
                    stockCardList={stockCardList}
                    selectedKeys={selectedKeys}
                />
                
                <Modal
                    visible={warehouseModal}
                    title={'批量设置仓库'}
                    onCancel={() => {this.setState({warehouseModal:false})}}
                    onOk={() => {
                        const { warehouseCardUuid, warehouseCardCode, warehouseCardName } = warehouseCards
                        // const carryoverCardListJ = carryoverCardList.toJS()
                        const stockCardListJ = stockCardList.toJS()
                        // dispatch(editRunningActions.changeLrAccountCommonString('ori', 'carryoverCardList', fromJS(carryoverCardListJ.map(v => {
                        //     v.warehouseCardUuid = warehouseCardUuid
                        //     v.warehouseCardCode = warehouseCardCode
                        //     v.warehouseCardName = warehouseCardName
                        //     return v
                        // }))))
                        dispatch(searchApprovalActions.changeSearchApprovalString('editRunningModalTemp', 'stockList', fromJS(stockCardListJ.map(v => {
                            v.depotUuid = warehouseCardUuid
                            v.depotCode = warehouseCardCode
                            v.depotName = warehouseCardName
                            return v
                        }))))
                        this.setState({warehouseModal:false,warehouseCards:{}})
                    }}
                >
                    <div style={{display:'flex'}}>
                        <span style={{width:'100px',lineHeight:'28px'}}>仓库：</span>
                        <Select
                            style={{flex:1}}
                            placeholder='请选择'
                            combobox
                            showSearch
                            value={warehouseCards.warehouseCardUuid ?`${warehouseCards.warehouseCardCode || ''} ${warehouseCards.warehouseCardName || ''}`:undefined}
                            onChange={value => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const warehouseCardUuid = valueList[0]
                                const warehouseCardCode = valueList[1]
                                const warehouseCardName = valueList[2]
                                this.setState({warehouseCards:{
                                    warehouseCardUuid,
                                    warehouseCardCode,
                                    warehouseCardName
                                }})
                            }}
                            >
                            {
                                warehouseList.map((v, i) => {
                                    return (
                                        <Option
                                            key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                        >
                                            {`${v.get('code')} ${v.get('name')}`}
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </Modal>
			</div>
		)
	}
}