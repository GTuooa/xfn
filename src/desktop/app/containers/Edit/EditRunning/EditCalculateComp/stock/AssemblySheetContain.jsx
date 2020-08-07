import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import { connect }	from 'react-redux'
import moment from 'moment'

import { Select, Divider, Icon, Button, Modal, message, Tooltip, DatePicker } from 'antd'
import Input from 'app/components/Input'
import XfnSelect from 'app/components/XfnSelect'
import { numberCalculate, formatMoney,formatFour, numberFourTest, DateLib } from 'app/utils'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import {  numberTest } from '../component/numberTest'

import AddCardModal from 'app/containers/Config/Inventory/AddCardModal.jsx'
import AssemblySheetModal from './AssemblySheetModal'
import AssemblySheetList from './AssemblySheetList'
import InputFour from 'app/components/InputFour'
import SerialModal  from '../../SerialModal'
import InventorySerialModal from 'app/containers/Config/Inventory/SerialModal.jsx'

import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class AssemblySheetContain extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
            warehouseModal:false,
            showSingleInventoryModal: false,
            warehouseCards:{
                warehouseCardUuid:'',
                warehouseCardCode:'',
                warehouseCardName:''
            },
            showModal:false,
            assemblyNumberModal: false,
            assemblyIndex: 0,
            assemblyNumber: '',
            assemblyUuid: '',
            // 辅助属性
            showSerial: false,
            showEditSerial: false,
            curProductItem: fromJS([]),
            curMaterialItem: fromJS([]),
            chooseSerialList: fromJS([]),
            curIndex: -1,
            curMaterialIndex: -1,
            curMaterialPrice:'',
            // 分页
            selectTreeUuid: 'all',
            selectTreeLevel: 0,
		}
	}


    render() {

        const {
            dispatch,
            stockCardList,
            carryoverCardList,
            stockList,
            warehouseList,
            stockRange,
            amount,
            taxRate,
            showSingleModal,
            showStockModal,
            selectThingsList,
            selectedKeys,
            categoryTypeObj,
            currentCardType,
            insertOrModify,
            enableWarehouse,
            openQuantity,
            selectList,
            selectItem,
            oriState,
            oriDate,
            oriStockCardList,
            sectionTemp,
            callback,
            amountDisable,
            assemblySheet,
            MemberList,
            thingsList,
            curItemIsAvailable,
            serialList,
            oriUuid,
            cardPageObj,
        } = this.props

        const { showCardModal, warehouseModal,showSingleInventoryModal, warehouseCards, assemblyNumberModal,assemblyIndex, assemblyNumber, assemblyUuid, showEditSerial,showSerial, curProductItem, curMaterialItem, curIndex, curMaterialIndex,curMaterialPrice,chooseSerialList, selectTreeUuid, selectTreeLevel } = this.state
        const saleOrPurchase = {
            acBusinessIncome: 'sale',
            acBusinessExpense: 'purchase'
        }
        let className = ''
        if (enableWarehouse && openQuantity) {
            className = 'assembly-content-area-warehouse'
        } else if (enableWarehouse && !openQuantity) {
            className = 'assembly-content-area-warehouse-no-open'
        } else if (!enableWarehouse && openQuantity) {
            className = 'assembly-content-area'
        } else {
            className = 'assembly-content-area-no-open'
        }

        const materialList = assemblySheet.get('materialList')

        const curQuantityForModal = assemblySheet.getIn([assemblyIndex,'curQuantity'])

        let allMaterialList = []
        assemblySheet.map((v,index) => {
            v.get('materialList').map((w,i) => {
                allMaterialList.push({
                    ...(w.toJS()),
                    index,
                    i
                })
            })
        })
        const selectedList = allMaterialList.filter((w,index) => w.materialUuid === curMaterialItem.get('materialUuid') && !(w.index === curIndex && w.i === curMaterialIndex)).reduce((pre,cur) => pre.concat(cur.serialList || []),[])

// console.log(111);
        return (
            <div className='assembly-content'>
                <div className={`${className} assembly-content-title`} style={{marginBottom:'10px'}}>
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
                    assemblySheet && assemblySheet.map((item ,index) => {
                        const serialList = item.get('serialList') || fromJS([])

                        let totalAmount = 0
                        return <AssemblySheetList
                                    dispatch={dispatch}
                                    stockList={stockList}
                                    warehouseList={warehouseList}
                                    enableWarehouse={enableWarehouse}
                                    openQuantity={openQuantity}
                                    oriDate={oriDate}
                                    sectionTemp={sectionTemp}
                                    assemblySheet={assemblySheet}
                                    insertOrModify={insertOrModify}

                                    item={item}
                                    index={index}
                                    className={className}

                                    assemblyIndex={assemblyIndex}
                                    allMaterialList={fromJS(allMaterialList)}

                                    assemblyOnclick={()=>{
                                        this.setState({
                                            assemblyIndex:index,
                                            showSingleInventoryModal: true,
                                        })
                                    }}
                                    assemblyNumberOnClick={()=>{
                                        this.setState({
                                            assemblyNumberModal:true,
                                            assemblyIndex:index,
                                            assemblyNumber: item.get('curQuantity')
                                        })
                                    }}
                                    showModal={()=>{
                                        this.setState({showCardModal: true})
                                    }}
                                    assemblySerialOnclick={(data)=>{
                                        this.setState({
                                            curIndex: index,
                                            curProductItem: item,
                                            chooseSerialList: data ? fromJS(data) : item.get('serialList') || fromJS([]),
                                            showEditSerial:true,
                                        })
                                    }}
                                    showEditSerialFun={(value)=>{
                                        this.setState({showEditSerial:value})
                                    }}
                                    serialOnClick={(v,i,data)=>{
                                        this.setState({
                                            // selectedList,
                                            curIndex: index,
                                            curProductItem: item,
                                            curMaterialItem: v,
                                            curMaterialIndex: i,
                                            curMaterialPrice: v.get('price'),
                                            chooseSerialList: data ? fromJS(data) : v.get('serialList') || fromJS([]),
                                            showSerial:true,
                                        })
                                    }}
                                />
                    })
                }
                {
                    showSerial ?
                    <SerialModal
                        visible={true}
                        dispatch={dispatch}
                        serialList={this.props.serialList}
                        curSerialList={chooseSerialList.toJS()}
                        item={fromJS({
                            ...(curMaterialItem.toJS()),
                            cardUuid: curMaterialItem.get('materialUuid'),
                        })}
                        oriUuid={oriUuid}
                        selectedList={selectedList}
                        onClose={()=>{this.setState({showSerial: false})}}
                        onOK={(curSerialList)=>{
                            const list = curSerialList.filter(v => v.serialNumber)
                            const amount = numberCalculate(curMaterialPrice,list.length,4,'multiply',2)
                            const materialList = curProductItem.get('materialList')
                            let totalAmount = 0
                            let oldAmount = materialList.getIn([curMaterialIndex,'amount'])
                            materialList && materialList.size && materialList.map(v => {
                                totalAmount = numberCalculate(totalAmount,v.get('amount'))
                            })
                            const finallyAmount = numberCalculate(numberCalculate(totalAmount,oldAmount,2,'subtract'),amount)
                            const finallyPrice = numberCalculate(finallyAmount,curProductItem.get('curQuantity'),4,'divide',4)
                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',curIndex,'materialList',curMaterialIndex,'serialList'],fromJS(list) ))
                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',curIndex,'materialList',curMaterialIndex,'quantity'],list.length ))
                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',curIndex,'materialList',curMaterialIndex,'isModify'],true ))
                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',curIndex,'materialList',curMaterialIndex,'amount'],amount ))
                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',curIndex,'amount'],finallyAmount ))
                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',curIndex,'price'],finallyPrice ))
                        }}
                    /> : ''
                }

                {
                    showEditSerial ?
                    <InventorySerialModal
                        visible={true}
                        dispatch={dispatch}
                        serialList={chooseSerialList}
                        item={curProductItem}
                        onClose={()=>{this.setState({showEditSerial: false})}}
                        onOk={curSerialList => {
                            const list = curSerialList.filter(v => v.serialNumber)
                            // selectItem.map( (item,k) => {
                            //     if(item.get('index') === curIndex){
                            //         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp,['assemblySheet',curIndex,'curQuantity'],list.length))
                            //         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp,['assemblySheet',curIndex,'serialList'],fromJS(list)))
                            //     }
                            // })


                            const quantity = assemblySheet.getIn([curIndex,'quantity'])
                            const openShelfLife = assemblySheet.getIn([curIndex,'financialInfo','openShelfLife'])
                            const multiple = numberCalculate(list.length,quantity,4,'divide',4)
                            //
                            // dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', ['assemblySheet',curIndex,'curQuantity'], list.length))
                            // dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp',['assemblySheet',curIndex,'serialList'],fromJS(list)))

                            if(curItemIsAvailable){
                                const oriMaterialList = assemblySheet.getIn([curIndex,'oriMaterialList']) && assemblySheet.getIn([curIndex,'oriMaterialList']).toJS() || []
                                let productAmount = 0, selectUuidList = []
                                let newAssembly = assemblySheet.toJS()
                                newAssembly[curIndex].materialList = oriMaterialList.map((v,i) => {
                                    v.cardUuid = v.materialUuid
                                    v.storeUuid = v.warehouseCardUuid ? v.warehouseCardUuid : ''
                                    v.parentIndex = curIndex
                                    const openSerial = v['financialInfo']['openSerial']
                                    v.quantity = openSerial ? '' : numberCalculate(multiple,v.quantity,4,'multiply',4)
                                    selectUuidList.push(v)
                                    productAmount = numberCalculate(productAmount,v.amount)
                                    return v
                                })
                                newAssembly[curIndex].curQuantity = list.length
                                newAssembly[curIndex].serialList = list
                                newAssembly[curIndex].isModify = true
                                if(selectUuidList.length > 0 ){
                                    dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, curIndex,'StockBuildUp','assemblySheet',newAssembly,true))
                                }else{
                                    const productPrice = numberCalculate(productAmount,list.length,4,'divide',4)
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',curIndex,'amount'],productAmount ))
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',curIndex,'price'],productPrice ))
                                }

                            }

                        }}
                    /> : ''
                }

                <Modal
                    visible={assemblyNumberModal}
                    title={'修改组装数量'}
                    onCancel={() => {
                        this.setState({
                            assemblyNumberModal:false,
                            assemblyIndex:0,
                            assemblyUuid: ''
                        })
                    }}
                    onOk={() => {
                        if(Number(assemblyNumber)){
                            const quantity = assemblySheet.getIn([assemblyIndex,'quantity'])
                            const openShelfLife = assemblySheet.getIn([assemblyIndex,'financialInfo','openShelfLife'])
                            const multiple = numberCalculate(assemblyNumber,quantity,4,'divide',4)

                            // dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', ['assemblySheet',assemblyIndex,'curQuantity'], assemblyNumber))

                            if(curItemIsAvailable){
                                const oriMaterialList = assemblySheet.getIn([assemblyIndex,'oriMaterialList']) && assemblySheet.getIn([assemblyIndex,'oriMaterialList']).toJS() || []
                                let productAmount = 0, selectUuidList = []
                                let newAssembly = assemblySheet.toJS()
                                newAssembly[assemblyIndex].materialList = oriMaterialList.map((v,i) => {
                                    v.cardUuid = v.materialUuid
                                    v.storeUuid = v.warehouseCardUuid ? v.warehouseCardUuid : ''
                                    v.parentIndex = assemblyIndex
                                    const openSerial = v['financialInfo']['openSerial']
                                    v.quantity = openSerial ? '' : numberCalculate(multiple,v.quantity,4,'multiply',4)
                                    selectUuidList.push(v)
                                    productAmount = numberCalculate(productAmount,v.amount)
                                    return v
                                })
                                newAssembly[assemblyIndex].curQuantity = assemblyNumber
                                // dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',assemblyIndex,'materialList'], fromJS(oriMaterialList.map((v,i) => {
                                //     selectUuidList.push({
                                //         cardUuid: v.materialUuid,
                                //         storeUuid: v.warehouseCardUuid ? v.warehouseCardUuid : '',
                                //         index: assemblyIndex,
                                //         materialIndex: i
                                //     })
                                //     productAmount = numberCalculate(productAmount,v.amount)
                                //     v.quantity = openShelfLife ? '' : numberCalculate(multiple,v.quantity,4,'multiply',4)
                                //     return v
                                // }))))
                                if(selectUuidList.length > 0 ){
                                    dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, assemblyIndex,'StockBuildUp','assemblySheet',newAssembly,true))
                                }else{
                                    const productPrice = numberCalculate(productAmount,assemblyNumber,4,'divide',4)
                                    let assemblySheetItem = assemblySheet.get(assemblyIndex).toJS()

                                    const newItem = {
                                        ...assemblySheetItem,
                                        amount: productAmount,
                                        price: productPrice
                                    }

                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',assemblyIndex],fromJS(newItem) ))
                                }

                            }

                            this.setState({
                                assemblyNumberModal:false,
                                assemblyIndex:0,
                                assemblyUuid: ''
                            })
                        }else{
                            message.info('请输入勾选组装单的数量')
                        }

                    }}
                >
                    <div className={'assembly-number-modal'}>
                        <span>数量：</span>
                        <div className={'assembly-number-modal-input'}>
                        <InputFour
                            value={assemblyNumber}
                            onChange={(e)=>{
                                numberFourTest(e, (value) => {
                                    this.setState({
                                        assemblyNumber: value
                                    })
                                })
                        }}/>
                        </div>

                    </div>
                </Modal>

                <AssemblySheetModal
                    showCommonChargeModal={showSingleInventoryModal}
                    MemberList={MemberList}
                    thingsList={thingsList}
                    dispatch={dispatch}
                    oriState={oriState}
                    selectedKeys={selectedKeys}
                    selectItem={selectItem}
                    selectList={selectList}
                    assemblySheet={assemblySheet}
                    assemblyNumber={assemblyNumber}
                    sectionTemp={'StockBuildUp'}
                    cancel={() => {
                        this.setState({ showSingleInventoryModal: false })
                    }}
                    title={'选择存货'}
                    serialList={chooseSerialList}
                    callback={(assemblySheet,curSelectItem) => {
                        const curSelectItemToJS = curSelectItem.toJS()
                        const assemblySheetToJS = assemblySheet.toJS()
                        const chooseStockIndex = assemblySheet.size
                        let selectUuidList = []
                        const newitem = curSelectItemToJS.length && curSelectItemToJS.map((item,i) => {
                            const multiple = numberCalculate(item.curQuantity,item.quantity,4,'divide',4)
                            return {
                                ...item,
                                materialList:item.materialList && item.materialList.length && item.materialList.map((v,j) => {
                                    v.cardUuid = v.materialUuid
                                    v.storeUuid = v.warehouseCardUuid ? v.warehouseCardUuid : ''
                                    v.parentIndex = i
                                    const openSerial = v['financialInfo']['openSerial']
                                    v.quantity = openSerial ? '' : numberCalculate(multiple,v.quantity,4,'multiply',4)

                                    selectUuidList.push(v)
                                    return v
                                }) || []
                            }
                        }) || []

                        let newAssemblySheet = assemblySheetToJS
                        newAssemblySheet = assemblySheetToJS.fill(newitem[0],assemblyIndex,assemblyIndex+1)

                        const [firstItem, ...otherItem] = newitem
                        newAssemblySheet.splice(assemblyIndex+1,0,...otherItem)
                        // dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', 'assemblySheet',fromJS(newAssemblySheet)))

                        if(selectUuidList.length > 0 ){
                            dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, chooseStockIndex,'StockBuildUp','assemblySheet',newAssemblySheet,true))
                        }

                    }}

                    selectTreeFunc={(uuid, level) => {
                        if (uuid === 'all') {
                            dispatch(editCalculateActions.getStockBuildUpAssembly('',1,false,1))
                        } else {
                            dispatch(editCalculateActions.getStockBuildUpAssembly(uuid, level,false,1))
                        }

                    }}
                    cardPageObj={cardPageObj}
                    cardPaginationCallBack={(value)=>{
                        if (selectTreeUuid === 'all') {
                            dispatch(editCalculateActions.getStockBuildUpAssembly('',1,false,value))
                        } else {
                            dispatch(editCalculateActions.getStockBuildUpAssembly(selectTreeUuid, selectTreeLevel,false,value))
                        }
                    }}
                />

                <AddCardModal
					showModal={showCardModal}
					closeModal={() => this.setState({showCardModal: false})}
					dispatch={dispatch}
                    enableWarehouse={enableWarehouse}
                    fromPage='payment'
                    // type={saleOrPurchase[categoryTypeObj]}
				/>
                <Modal
                    visible={warehouseModal}
                    title={'批量设置仓库'}
                    onCancel={() => {this.setState({warehouseModal:false})}}
                    onOk={() => {
                        const { warehouseCardUuid, warehouseCardCode, warehouseCardName } = warehouseCards
                        const carryoverCardListJ = carryoverCardList.toJS()
                        const assemblySheetJ = assemblySheet.toJS()
                        // dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, 'assemblySheet', fromJS(assemblySheetJ.map(v => {
                        //     v.warehouseCardUuid = warehouseCardUuid
                        //     v.warehouseCardCode = warehouseCardCode
                        //     v.warehouseCardName = warehouseCardName
                        //     return v
                        // }))))

                        let selectUuidList = [],cardUuidList = []
                        assemblySheetJ && assemblySheetJ.length && assemblySheetJ.map( (item,i) => {
                            // const materialListJ = item.get('materialList').toJS()
                            // dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',i,'materialList'], fromJS(materialListJ.map(v => {
                            //     v.warehouseCardUuid = warehouseCardUuid
                            //     v.warehouseCardCode = warehouseCardCode
                            //     v.warehouseCardName = warehouseCardName
                            //     return v
                            // }))))
                            item.amount=''
                            item.materialList && item.materialList.map((itemM,k) => {
                                itemM.cardUuid = itemM.materialUuid
                                itemM.storeUuid = warehouseCardUuid
                                itemM.parentIndex = i
                                selectUuidList.push(itemM)
                                itemM.materialUuid && cardUuidList.push(itemM.materialUuid)
                            })


                        })

                        cardUuidList.length && dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, 0,'StockBuildUp','assemblySheet',assemblySheetJ,true,warehouseCards))

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
                                warehouseList && warehouseList.map((v, i) => {
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
