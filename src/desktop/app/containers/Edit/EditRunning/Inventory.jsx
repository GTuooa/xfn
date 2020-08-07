import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Select, Divider, Icon, Button, Modal, message, Tooltip } from 'antd'
import Input from 'app/components/Input'
import { NumberInput, TableItem, InputFour, XfnSelect, XfToolTip } from 'app/components'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney, formatFour, numberFourTest } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from './common/common'
import SingleModal  from './SingleModal'
import MultipleModal  from './MultipleModal'
import InventoryDrop  from './InventoryDrop'
import SerialModal  from './SerialModal'

import AddCardModal from 'app/containers/Config/Inventory/AddCardModal.jsx'
import InventorySerialModal from 'app/containers/Config/Inventory/SerialModal.jsx'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'

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
            showModal:false,
            showPriceModal:false,
            inventory:{
                inventoryUuid:'',
                type:1,
                defaultPriceList:[]
            },
            unitList:[],
            unit:fromJS({}),
            drop:false,
            serialModal:false

		}
	}
    render() {

        const {
            dispatch,
            stockCardList,
            carryoverCardList,
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
            oriDate,
            pageCount,
            batchList,
            serialList,
            oriUuid
        } = this.props

        const {
            showCardModal,
            warehouseModal,
            warehouseCards,
            showall,
            showPriceModal,
            inventory,
            unitList,
            unit,
            drop,
            serialModal
        } = this.state
        const { defaultPriceList } = inventory
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
                    stockCardList.map((v,i) => {
                        let element = ''
                        const assistList = v.get('assistList') || fromJS([])
                        const serialList = v.get('serialList') || fromJS([])
                        const selectedList = stockCardList.filter((w,index) => w.get('cardUuid') === v.get('cardUuid') && index !== i).toJS().reduce((pre,cur) => pre.concat(cur.serialList || []),[])
                        if (v.get('cardUuid') && (v.get('isOpenedQuantity') === 'true' || v.get('isOpenedQuantity') === true)) {
                            const words = categoryTypeObj === 'acBusinessIncome'?'销售':'采购'
                            const item = stockList.find(w => v.get('cardUuid') === w.get('uuid')) || fromJS({})
                            const unit  = item.get('unit')
                            const unitList  = item.getIn(['unit','unitList'])
                            const unitPriceList = item.get('unitPriceList') || fromJS([])
                            const priceItem = unitPriceList.find(w => w.get('unitUuid') === v.get('unitUuid')) || fromJS({})
                            const defaultPrice = priceItem.get('defaultPrice')
                            const quantity = priceItem.get('quantity')
                            if (defaultPrice) {
                                element = <span style={{color:'white'}} key={i}>
                                    {v.get('warehouseCardUuid') && v.get('cardUuid') && v.get('showQuantity')?`仓库数量：${formatFour(v.get('currentQuantity'))}`:''}
                                    {v.get('warehouseCardUuid') && v.get('cardUuid') && v.get('showQuantity')?<br/>:''}
                                    {`默认${words}价：${formatFour(defaultPrice)}元/${v.get('unitName')}`}
                                     <br/>
                                    <p
                                     className='tool-high-light'
                                     onClick={() => {
                                         this.setState({
                                             showPriceModal:true,
                                             inventory:{
                                                 inventoryUuid:v.get('cardUuid'),
                                                 type:categoryTypeObj === 'acBusinessIncome'?2:1,
                                                 defaultPriceList:unitPriceList.toJS().map(v =>
                                                     ({
                                                         unitUuid:v.unitUuid,
                                                         name:unit.get('uuid') === v.unitUuid?unit.get('name'):unitList.find(w => w.get('uuid') === v.unitUuid).get('name'),
                                                         defaultPrice:v.defaultPrice
                                                     })
                                                 ),
                                                 index:i
                                             },
                                             unitList,
                                             unit
                                         })
                                     }}
                                     >
                                         更新
                                     </p>
                                </span>
                            } else {
                                element = <span
                                    key={i}
                                    style={{color:'white'}}
                                     onClick={() => {
                                     this.setState({
                                         showPriceModal:true,
                                         inventory:{
                                             inventoryUuid:v.get('cardUuid'),
                                             type:categoryTypeObj === 'acBusinessIncome'?2:1,
                                             defaultPriceList:[{
                                                 unitUuid:v.get('unitUuid'),
                                                 name:v.get('unitName'),
                                             }].concat(
                                                 unitPriceList.toJS().map(v =>
                                                     ({
                                                         unitUuid:v.unitUuid,
                                                         name:unit.get('uuid') === v.unitUuid?unit.get('name'):unitList.find(w => w.get('uuid') === v.unitUuid).get('name'),
                                                         defaultPrice:v.defaultPrice
                                                     })
                                                 )
                                             ),
                                             index:i
                                         },
                                         unitList,
                                         unit
                                     })
                                 }}>
                                    {v.get('warehouseCardUuid') && v.get('cardUuid') && v.get('showQuantity')?`仓库数量：${formatFour(v.get('currentQuantity'))}`:''}
                                    {v.get('warehouseCardUuid') && v.get('cardUuid') && v.get('showQuantity')?<br/>:''}
                                    <p className='tool-high-light'>
                                        设置默认{words}单价
                                    </p>
                                </span>
                            }
                        }

                        return <XfToolTip title={element} placement="right" key={i}>
                        <div key={i} className={className}>
                            <InventoryDrop
                                v={v}
                                i={i}
                                stockRange={stockRange}
                                stockCardList={stockCardList}
                                oriDate={oriDate}
                                categoryTypeObj={categoryTypeObj}
                                stockList={stockList}
                                dispatch={dispatch}
                                showModal={() => this.setState({showCardModal:true})}
                                batchList={batchList}
                                oriState={oriState}
                                oriUuid={oriUuid}
                                insertOrModify={insertOrModify}
                            />
                            {
                                enableWarehouse?
                                <span className='warehouse-select' >
                                    <XfnSelect
                                        placeholder='请选择'
                                        combobox
                                        showSearch
                                        value={v.get('warehouseCardName') ?`${v.get('warehouseCardCode') ? v.get('warehouseCardCode'):''} ${v.get('warehouseCardName') ? v.get('warehouseCardName') : ''}`:undefined}
                                        dropdownRender={menu => (
                                            <div>
                                                {menu}
                                            </div>
                                        )}
                                        selectId={'warehouse-select'+i}
                                        onChange={value => {
                                            const valueList = value.split(Limit.TREE_JOIN_STR)
                                            const cardUuid = valueList[0]
                                            const code = valueList[1]
                                            const name = valueList[2]
                                            const amount = v.get('amount')
                                            const item = carryoverCardList.get(i)
                                            insertOrModify === 'insert' && dispatch(editRunningActions.changeLrAccountCommonString('ori', ['carryoverCardList',i], item
                                            .set('warehouseCardUuid',cardUuid)
                                            .set('warehouseCardCode',code)
                                            .set('warehouseCardName',name)))
                                            const newStockCardList = stockCardList.toJS().map((v,ii) => {
                                                if (ii === i) {
                                                    v.storeUuid = cardUuid
                                                    v.warehouseCardUuid = cardUuid
                                                } else {
                                                    v.storeUuid = v.warehouseCardUuid
                                                }
                                                return v
                                            })
                                            dispatch(editRunningActions.getStockCardPrice(oriDate,newStockCardList,stockCardList))
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'warehouseCardUuid'], cardUuid))
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'warehouseCardCode'], code))
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'warehouseCardName'], name))
                                            if (v.getIn(['financialInfo','openSerial'])) {
                                                if (oriState === 'STATE_YYSR_TS' || oriState === 'STATE_YYZC_GJ') {
                                                    dispatch(editRunningActions.getSerialList(v,i,oriState))
                                                } else {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'quantity'], ''))
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'jrOriCardUuid'], ''))
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'serialList'], fromJS([])))
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'isModify'], false))
                                                }

											}
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
                                    </XfnSelect>
                                </span>
                                :''
                            }
                            {
                                openQuantity?
                                <span>
                                    {
                                        v.getIn(['financialInfo','openSerial'])?
                                        <span
                                            onClick={() => {
                                                if (['STATE_YYSR_XS','STATE_YYZC_TG'].includes(oriState)) {
                                                    if (enableWarehouse && !v.get('warehouseCardUuid')) {
                                                        message.info('请先填写仓库')
                                                        return
                                                    } else if (v.getIn(['financialInfo','openBatch']) && !v.get('batchUuid')) {
                                                        message.info('请先填写批次')
                                                        return
                                                    } else if (v.getIn(['financialInfo','openAssist']) && (assistList.some(v => !v.get('propertyName')) || v.getIn(['financialInfo','assistClassificationList']).size !== assistList.size)) {
                                                        message.info('请先填写辅助属性')
                                                        return
                                                    }
                                                }
                                                if (insertOrModify === 'modify' && !v.get('isModify')) {
                                                    dispatch(editRunningActions.getSerialList(v,i,oriState,() => this.setState({serialModal:true,serialIndex:i})))
                                                } else {
                                                    this.setState({serialModal:true,serialIndex:i})
                                                }

                                            }}
                                            className={v.getIn(['financialInfo','openSerial'])?'serial-count':''}
                                            >
                                            {v.get('quantity') > 0 ? v.get('quantity') : '点击输入'}
                                            <XfIcon type='edit-pen'/>
                                        </span>
                                        :
                                        (stockList.find(w => w.get('uuid') === v.get('cardUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                        <InputFour
                                            placeholder='输入数量'
                                            value={v.get('quantity')}
                                            onChange={(e) => {
                                                numberFourTest(e, (value) => {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'quantity'], value))
                                                    if (v.get('price') > 0) {
                                                        const amount =((value || 0) * v.get('price')).toFixed(2)
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'amount'], amount))
                                                        dispatch(editRunningActions.autoCalculateStockAmount())
                                                        taxRate && dispatch(editRunningActions.changeAccountTaxRate())

                                                    }
                                                })
                                            }}
                                        />:''
                                    }
                                    {
                                        (stockList.find(w => w.get('uuid') === v.get('cardUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                        (() => {
                                            const curItem = stockList.find(w => w.get('uuid') === v.get('cardUuid')) || fromJS([])
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
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'unitUuid'], uuid))
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'unitName'], name))
                                                        const curPriceItem = (curItem.get('unitPriceList') || []).find(v => v.get('unitUuid') === uuid) || fromJS({})
                                                        const curPrice = curPriceItem.get('defaultPrice') || 0
                                                        curPrice && dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'price'], curPrice))
                                                        if (curPrice && v.get('quantity') > 0) {
                                                            const amount =((v.get('quantity') || 0) * curPrice).toFixed(2)
                                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'amount'], amount))
                                                            dispatch(editRunningActions.autoCalculateStockAmount())
                                                            taxRate && dispatch(editRunningActions.changeAccountTaxRate())

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
                                    {
                                        serialModal && this.state.serialIndex === i?
                                            oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYZC_TG'?
                                                <SerialModal
                                                    visible={true}
                                                    dispatch={dispatch}
                                                    serialList={this.props.serialList}
                                                    selectedList={selectedList}
                                                    curSerialList={serialList.toJS()}
                                                    item={v}
                                                    stockIndex={i}
                                                    oriUuid={oriUuid}
                                                    taxRate={taxRate}
                                                    oriState={oriState}
                                                    onClose={() => {
                                                        this.setState({serialModal:false})
                                                    }}
                                                />
                                                :
                                                <InventorySerialModal
                                                    visible={true}
                                                    serialList={serialList}
                                                    item={v}
                                                    stockIndex={i}
                                                    onClose={() => {
                                                        this.setState({serialModal:false})
                                                    }}
                                                    onOk={curSerialList => {
                                                        if (curSerialList.length > 100 ) {
                                                            message.info('序列号不能超过100个')
                                                            return
                                                        }
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'serialList'],fromJS(curSerialList)))
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'quantity'],curSerialList.length))
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'isModify'],true))
                                                        if (v.get('price') > 0) {
                                                            const amount = (curSerialList.length * v.get('price')).toFixed(2)
                                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'amount'], amount))
                                                            dispatch(editRunningActions.autoCalculateStockAmount())
                                                            taxRate && dispatch(editRunningActions.changeAccountTaxRate())
                                                        }
                                                    }}
                                                />:''
                                    }
                                </span>
                                :''
                            }
                            {
                                openQuantity?
                                <span>
                                    {
                                        (stockList.find(w => w.get('uuid') === v.get('cardUuid')) || fromJS([])).get('isOpenedQuantity') || JSON.parse(v.get('isOpenedQuantity') || false)?
                                        <InputFour
                                            placeholder='请输入单价'
                                            value={v.get('price')}
                                            onChange={(e) => {
                                                numberFourTest(e, (value) => {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'price'], value))
                                                    if (v.get('quantity') > 0 ) {
                                                        // const quantity = v.getIn(['financialInfo','openSerial']) ? serialList.size : v.get('quantity')
                                                        const quantity = v.get('quantity')
                                                        const amount =((value || 0) * quantity).toFixed(2)
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'amount'], amount))
                                                        dispatch(editRunningActions.autoCalculateStockAmount())
                                                        taxRate && dispatch(editRunningActions.changeAccountTaxRate())

                                                    }
                                                })
                                            }}
                                        />:''
                                    }
                                </span>:''
                            }

                            <span>
                                <Input
                                    placeholder='请输入金额'
                                    value={v.get('amount')}
                                    onChange={(e) => {
                                        numberTest(e, (value) => {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'amount'], value))
                                            dispatch(editRunningActions.autoCalculateStockAmount())
                                            taxRate && dispatch(editRunningActions.changeAccountTaxRate())
                                            if (v.get('quantity') > 0) {
                                                // const quantity = v.getIn(['financialInfo','openSerial']) ? serialList.size : v.get('quantity')
                                                const quantity = v.get('quantity')
                                                const price = ((value || 0) / quantity).toFixed(4)
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i,'price'], parseFloat(price)))
                                            }
                                        })
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
                                            dispatch(editRunningActions.deleteStock(stockCardList, i, taxRate))
                                            dispatch(editRunningActions.deleteCarrayover(carryoverCardList,i))
                                        }}
                                    />
                                 : ''
                            }
                            </span>
                        </div>
                        </XfToolTip>
                        }
                    )
                }
                <div className='inventory-button'>
                    <Button
                        onClick={() => {
                            if (!stockRange.size) {
                                message.info('请在流水设置中选择存货范围')
                                return
                            }
                            dispatch(editRunningActions.addStock(stockCardList,stockCardList.size -1))
                            dispatch(editRunningActions.addCarrayover(carryoverCardList,stockCardList.size -1))
                            if (stockCardList.size === 1) {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',0,'amount'], amount))
                            }
                        }}
                    >
                        <XfIcon type='big-plus'/>添加存货明细
                    </Button>
                    <Button
                        onClick={() => {
                            if (!stockRange.size) {
                                message.info('请在流水设置中选择存货范围')
                                return
                            }
                            dispatch(editRunningActions.getInventoryAllCardList(stockRange, 'showStockModal'))
                        }}
                    >
                        <XfIcon type='editPlus'/>批量添加存货
                    </Button>
                    <Button
                        style={{width:88}}
                        onClick={() => {
                            if (!stockRange.size) {
                                message.info('请在流水设置中选择存货范围')
                                return
                            }
                            dispatch(editRunningActions.changeLrAccountCommonString('', ['flags','showall'], true))
                            // dispatch(editRunningActions.getInventoryAllCardList(stockRange, 'showStockModal'))
                        }}
                    >
                        <XfIcon type='upload'/>批量导入
                    </Button>
                </div>
                <AddCardModal
					showModal={showCardModal}
					closeModal={() => this.setState({showCardModal: false})}
					dispatch={dispatch}
                    enableWarehouse={enableWarehouse}
                    fromPage='editRunning'
                    // type={saleOrPurchase[categoryTypeObj]}
				/>
                <SingleModal
                    dispatch={dispatch}
                    showSingleModal={showSingleModal && currentCardType === 'stock'}
                    MemberList={MemberList}
                    selectThingsList={selectThingsList}
                    thingsList={thingsList}
                    selectedKeys={selectedKeys}
                    title={'选择存货'}
                    selectFunc={(code, name, cardUuid) => {
                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList', this.state.index], fromJS({code, name, cardUuid, amount: this.state.curAmount})))
                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['carryoverCardList', this.state.index], fromJS({code, name, cardUuid, amount: this.state.curAmount})))
                        dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'showSingleModal'], false))
                    }}
                    selectListFunc={(uuid, level) => {
                        if (uuid === 'all') {
                            dispatch(editRunningActions.getInventoryAllCardList(stockRange, 'showSingleModal', true))
                        } else {
                            dispatch(editRunningActions.getInventorySomeCardList(uuid, level))
                        }
                    }}
                />
                {
                    showStockModal?
                    <MultipleModal
                        MemberList={MemberList}
                        selectThingsList={selectThingsList}
                        thingsList={thingsList}
                        dispatch={dispatch}
                        showModal={showStockModal}
                        selectList={selectList}
                        oriState={oriState}
                        categoryList={stockRange}
                        selectItem={selectItem}
                        stockCardList={stockCardList}
                        selectedKeys={selectedKeys}
                        pageCount={pageCount}
                    />:''
                }

                <Modal
                    visible={warehouseModal}
                    title={'批量设置仓库'}
                    onCancel={() => {this.setState({warehouseModal:false})}}
                    onOk={() => {
                        const { warehouseCardUuid, warehouseCardCode, warehouseCardName } = warehouseCards
                        const carryoverCardListJ = carryoverCardList.toJS()
                        const stockCardListJ = stockCardList.toJS()
                        const newCarryoverCardList = fromJS(carryoverCardListJ.map(v => {
                            v.warehouseCardUuid = warehouseCardUuid
                            v.warehouseCardCode = warehouseCardCode
                            v.warehouseCardName = warehouseCardName
                            return v
                        }))
                        const newStockCardList = fromJS(stockCardListJ.map(v => {
                            v.warehouseCardUuid = warehouseCardUuid
                            v.warehouseCardCode = warehouseCardCode
                            v.warehouseCardName = warehouseCardName
                            return v
                        }))
                        if (insertOrModify === 'insert') {
                            dispatch(editRunningActions.changeLrAccountCommonString('ori', 'carryoverCardList', newCarryoverCardList))
                        }
                        dispatch(editRunningActions.changeLrAccountCommonString('ori', 'stockCardList', newStockCardList))
                        dispatch(editRunningActions.getStockCardPrice(oriDate,newStockCardList.toJS().map(v => {v.storeUuid = v.warehouseCardUuid;return v}),newStockCardList))
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
                <Modal
                    width='480px'
                    visible={showPriceModal}
                    title={`更新${{1:'采购',2:'销售'}[inventory.type]}单价`}
                    onCancel={() => {this.setState({showPriceModal:false})}}
                    onOk={() => {
                        dispatch(editRunningActions.saveDefaultPrice(inventory,stockRange,oriState))
                        this.setState({showPriceModal:false})
                    }}
                    >
                        <div>
                            <div className="ls-flex-row" >
                                {
                                    defaultPriceList.map((v,i) =>
                                        <div className="ls-flex-row-item" key={i}>
                                            <label className="ls-flex-row-label">{{1:'默认采购价：',2:'默认销售价：'}[inventory.type]}</label>
                                            <div className="ls-flex-row-input" style={{display:'flex'}}>
                                                <InputFour
                                                    style={{width:'221px'}}
                                                    placeholder="选填，请输入金额"
                                                    value={v.defaultPrice}
                                                    onChange={e => {
                                                        numberFourTest(e, (value) => {
                                                            inventory.defaultPriceList[i].defaultPrice = value
                                                            this.setState({inventory})
                                                        })
                                                    }}
                                                />
                                                {
                                                    unitList.size?
                                                        <div>
                                                            <span style={{margin:'0 8px'}}>元/</span>
                                                            <Select
                                                                style={{width:'78px'}}
                                                                onChange={(value) => {
                                                                    const valueList = value.split(Limit.TREE_JOIN_STR)
                                                                    const unitUuid = valueList[0]
                                                                    const name = valueList[1]
                                                                    const isStandard = valueList[2]
                                                                    inventory.defaultPriceList[i].name = name
                                                                    inventory.defaultPriceList[i].unitUuid = unitUuid
                                                                    this.setState({inventory})
                                                                }}
                                                                value={v.name}
                                                            >
                                                                {
                                                                    defaultPriceList.every(w => w.name !== unit.get('name'))?
                                                                        <Option key={unit.get('uuid')} value={`${unit.get('uuid')}${Limit.TREE_JOIN_STR}${unit.get('name')}${Limit.TREE_JOIN_STR}${unit.get('isStandard')}`}>{unit.get('name')}</Option>:''
                                                                }
                                                                {
                                                                    unitList.filter(v => defaultPriceList.every(w => w.name !== v.get('name'))).map(v =>
                                                                        <Option key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isStandard')}`}>{v.get('name')}</Option>
                                                                    )
                                                                }
                                                            </Select>
                                                        </div>
                                                        :
                                                        unit.get('name')?<span style={{marginLeft:'5px'}}>{`元/${unit.get('name')}`}</span>:''
                                                }
                                                {
                                                    unitList.size ?
                                                    <div className='ls-flex-row-content'>
                                                        {
                                                            defaultPriceList.length <= unitList.size ?
                                                            <XfIcon type='bigPlus'
                                                                style={defaultPriceList.length === 1?{lineHeight:'28px',fontSize:'15px'}:{}}
                                                                onClick={() => {
                                                                    inventory.defaultPriceList.push({})
                                                                    this.setState({inventory})
                                                                }}
                                                            />:''
                                                        }

                                                        {
                                                            defaultPriceList.length > 1 ?
                                                            <XfIcon type='bigDel' onClick={() => {
                                                                inventory.defaultPriceList.splice(i,1)
                                                                this.setState({inventory})
                                                            }}/>:''
                                                        }
                                                    </div>:''
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                </Modal>
            </div>
        )
    }
}
