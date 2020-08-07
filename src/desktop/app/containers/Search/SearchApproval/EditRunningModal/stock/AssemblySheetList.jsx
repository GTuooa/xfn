// import React from 'react'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
// import { toJS, is ,fromJS } from 'immutable'
// import { connect }	from 'react-redux'

// import { Select, Divider, Icon, Button, Modal, message, Tooltip } from 'antd'
// import Input from 'app/components/Input'
// import XfnSelect from 'app/components/XfnSelect'
// import { numberCalculate, formatMoney,formatFour, numberFourTest } from 'app/utils'
// const Option = Select.Option
// import * as Limit from 'app/constants/Limit.js'
// import XfIcon from 'app/components/Icon'
// import {  numberTest } from '../component/numberTest'

// import AddCardModal from 'app/containers/Config/Inventory/AddCardModal.jsx'
// import AssemblySheetModal from './AssemblySheetModal'
// import InputFour from 'app/components/InputFour'

// import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
// import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

// @immutableRenderDecorator
// export default
// class AssemblySheetList extends React.Component {

//     constructor(props) {
// 		super(props)
// 		this.state = {
// 			showCardModal: false,
//             warehouseModal:false,
//             showSingleInventoryModal: false,
//             warehouseCards:{
//                 warehouseCardUuid:'',
//                 warehouseCardCode:'',
//                 warehouseCardName:''
//             },
//             showModal:false,
//             assemblyNumberModal: false,
//             assemblyIndex: 0,
//             assemblyNumber: '',
//             assemblyUuid: ''
// 		}
// 	}

//     render() {

//         const {
//             dispatch,
//             stockCardList,
//             carryoverCardList,
//             stockList,
//             warehouseList,
//             stockRange,
//             amount,
//             taxRate,
//             showSingleModal,
//             showStockModal,
//             selectThingsList,
//             selectedKeys,
//             categoryTypeObj,
//             currentCardType,
//             insertOrModify,
//             enableWarehouse,
//             openQuantity,
//             selectList,
//             selectItem,
//             oriState,
//             oriDate,
//             oriStockCardList,
//             sectionTemp,
//             callback,
//             amountDisable,
//             assemblySheet,
//             MemberList,
//             thingsList,
//             curItemIsAvailable,
//         } = this.props

//         const { showCardModal, warehouseModal,showSingleInventoryModal, warehouseCards, assemblyNumberModal,assemblyIndex, assemblyNumber, assemblyUuid } = this.state

//         const saleOrPurchase = {
//             acBusinessIncome: 'sale',
//             acBusinessExpense: 'purchase'
//         }
//         let className = ''
//         if (enableWarehouse && openQuantity) {
//             className = 'assembly-content-area-warehouse'
//         } else if (enableWarehouse && !openQuantity) {
//             className = 'assembly-content-area-warehouse-no-open'
//         } else if (!enableWarehouse && openQuantity) {
//             className = 'assembly-content-area'
//         } else {
//             className = 'assembly-content-area-no-open'
//         }

//         const materialList = assemblySheet.get('materialList')

//         const curQuantityForModal = assemblySheet.getIn([assemblyIndex,'curQuantity'])

//         return (
//             <div className='assembly-content'>
//                 <div className={`${className} assembly-content-title`} style={{marginBottom:'10px'}}>
//                     <span>存货</span>
//                     {
//                         enableWarehouse?
//                         <span>
//                             <span style={{marginRight:'5px'}}>仓库</span>
//                             <XfIcon
//                                 type="editConfig"
//                                 onClick={() => {
//                                     this.setState({
//                                         warehouseModal:true
//                                     })
//                                 }}
//                             />
//                         </span>
//                         :''
//                     }
//                     {
//                         openQuantity?
//                         <span>数量</span>
//                         :''
//                     }
//                     {
//                         openQuantity?
//                         <span>单价</span>
//                         :''
//                     }
//                     <span>金额</span>
//                     <span></span>
//                 </div>
//                 {
//                     assemblySheet && assemblySheet.map((item ,index) => {
//                         let totalAmount = 0
//                         return <div key={`${item.get('productUuid')}+${index}`}>
//                                     <section className='product-content'>
//                                         <div>组装成品({index+1})</div>
//                                         <div className={className}>
//                                             <span
//                                                 className='chzz-assembly-sheet'
//                                                 onClick={()=>{
//                                                     this.setState({assemblyIndex:index})
//                                                     this.setState({
//                                                         showSingleInventoryModal: true
//                                                     })
//                                                     dispatch(editCalculateActions.getStockBuildUpAssembly('',1,true))
//                                                 }}
//                                             >
//                                                 {`${item.get('code')} ${item.get('name')}`}<XfIcon type='edit-pen'/>
//                                             </span>
//                                             {
//                                                 enableWarehouse?
//                                                 <span className='warehouse-select'>
//                                                     <XfnSelect
//                                                         placeholder='请选择'
//                                                         combobox
//                                                         showSearch
//                                                         value={item.get('warehouseCardName') ?`${item.get('warehouseCardCode') ? item.get('warehouseCardCode'):''} ${item.get('warehouseCardName') ? item.get('warehouseCardName') : ''}`:undefined}
//                                                         dropdownRender={menu => (
//                                                             <div>
//                                                                 {menu}
//                                                             </div>
//                                                         )}
//                                                         onChange={value => {
//                                                             const valueList = value.split(Limit.TREE_JOIN_STR)
//                                                             const cardUuid = valueList[0]
//                                                             const code = valueList[1]
//                                                             const name = valueList[2]
//                                                             const amount = item.get('amount')
//                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'warehouseCardUuid'], cardUuid))
//                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'warehouseCardCode'], code))
//                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'warehouseCardName'], name))

//                                                         }}
//                                                         >
//                                                         {
//                                                             warehouseList.map((v, i) => {
//                                                                 return (
//                                                                     <Option
//                                                                         key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
//                                                                     >
//                                                                         {`${v.get('code')} ${v.get('name')}`}
//                                                                     </Option>
//                                                                 )
//                                                             })
//                                                         }
//                                                     </XfnSelect>
//                                                 </span>
//                                                 :''
//                                             }
//                                             <span className='chzz-assembly-number'>
//                                                 <span
//                                                     className='chzz-assembly-sheet'
//                                                     onClick={()=>{
//                                                         this.setState({
//                                                             assemblyNumberModal:true,
//                                                             assemblyIndex:index,
//                                                             assemblyNumber: item.get('curQuantity')
//                                                         })

//                                                         dispatch(editCalculateActions.getAssemblyListByProduct([item.get('productUuid')],index))
//                                                     }}
//                                                 >{formatFour(item.get('curQuantity'))}<XfIcon type='edit-pen'/>
//                                                 </span>
//                                                 <div>
//                                                     {item.get('unitName') ?`${item.get('unitCode') ? item.get('unitCode'):''} ${item.get('unitName') ? item.get('unitName') : ''}`:undefined}
//                                                 </div>
//                                             </span>

//                                             <span className='chzz-assembly-price'>
//                                                 {formatFour(item.get('price'))}
//                                             </span>
//                                             <span className='chzz-assembly-amount'>
//                                                 {formatMoney(item.get('amount'))}
//                                             </span>
//                                             <span>
//                                             {
//                                                 assemblySheet && assemblySheet.size > 1 ?
//                                                 <XfIcon
//                                                     type='smallDel'
//                                                     onClick={() => {
//                                                         dispatch(editCalculateActions.deleteStockList(assemblySheet, index, 'delete','StockBuildUp','assemblySheet'))
//                                                     }}
//                                                 /> : null
//                                             }

//                                             </span>
//                                         </div>
//                                     </section>
//                                     <section className='materialList-content'>
//                                         <div>物料详情</div>
//                                         {
//                                             item.get('materialList') && item.get('materialList').map((v,i) =>{
//                                                 totalAmount = numberCalculate(totalAmount,v.get('amount'))

//                                                 return   <Tooltip
//                                                         title={JSON.parse(v.get('isOpenQuantity') || false) ? <div><p>仓库数量：{v.get('referenceQuantity') ? formatFour(v.get('referenceQuantity')) : 0}</p>{Number(v.get('referencePrice')) > 0 ? <p>参考单价：{formatFour(v.get('referencePrice'))}</p> : null}</div> : ''}
//                                                         placement="right"
//                                                     >
//                                                         <div key={i} className={`${className} material-content-box`}>
//                                                             <span>
//                                                                 <span className='material-item-index'>({i+1})</span>
//                                                                 {
//                                                                     <XfnSelect
//                                                                         combobox
//                                                                         showSearch
//                                                                         placeholder={`请选择存货`}
//                                                                         value={v.get('code') ?`${ v.get('code')?v.get('code'):''} ${v.get('name') ? v.get('name'):''}`:undefined}
//                                                                         dropdownRender={menu => (
//                                                                             <div>
//                                                                                 {menu}
//                                                                                 <Divider style={{ margin: '4px 0'}} />
//                                                                                 {
//                                                                                     <div
//                                                                                         style={{ padding: '8px', cursor: 'pointer' }}
//                                                                                         onMouseDown={() => {
//                                                                                             const showModal = () => {
//                                                                                                 this.setState({showCardModal: true})
//                                                                                             }
//                                                                                             dispatch(configCallbackActions.beforeRunningAddInventoryCard(showModal ))
//                                                                                         }}
//                                                                                     >
//                                                                                         <Icon type="plus" /> 新增存货
//                                                                                     </div>
//                                                                                 }

//                                                                             </div>
//                                                                         )}
//                                                                         onChange={(value,options) => {
//                                                                             const valueList = value.split(Limit.TREE_JOIN_STR)
//                                                                             const cardUuid = valueList[0]
//                                                                             const code = valueList[1]
//                                                                             const name = valueList[2]
//                                                                             const isOpenQuantity = valueList[3]
//                                                                             const amount = v.get('amount')
//                                                                             const warehouseCardUuid = v.get('warehouseCardUuid')
//                                                                             const warehouseCardCode = v.get('warehouseCardCode')
//                                                                             const warehouseCardName = v.get('warehouseCardName')
//                                                                             const unit = v.get('unit')
//                                                                             const obj = {
//                                                                                 unit: options.props.unit ? options.props.unit.toJS() : null,
//                                                                                 cardUuid,
//                                                                                 materialUuid: cardUuid,
//                                                                                 name,
//                                                                                 code,
//                                                                                 amount,
//                                                                                 isOpenQuantity,
//                                                                                 warehouseCardUuid,
//                                                                                 warehouseCardCode,
//                                                                                 warehouseCardName,
//                                                                             }
//                                                                             if (isOpenQuantity === 'true' && options.props.unit && !options.props.unit.get('unitList').size) {
//                                                                                 dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'unitName'], options.props.unit.get('name')))
//                                                                                 dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'unitUuid'], options.props.unit.get('uuid')))
//                                                                                 dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i], fromJS({
//                                                                                     ...obj,
//                                                                                     unitUuid:options.props.unit.get('uuid'),
//                                                                                     unitName:options.props.unit.get('name')
//                                                                                 })))
//                                                                             } else {
//                                                                                 dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i], fromJS({
//                                                                                     ...obj
//                                                                                 })))
//                                                                             }
//                                                                             dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [{cardUuid:cardUuid, storeUuid:warehouseCardUuid,index,materialIndex:i}],i,sectionTemp,'assemblySheet'))

//                                                                         }}
//                                                                         >
//                                                                         {
//                                                                             stockList.map((v, i) => {

//                                                                                 return (
//                                                                                     <Option
//                                                                                         key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${i}`}
//                                                                                         unit={v.get('unit')}
//                                                                                         itemV={v.toJS()}
//                                                                                     >
//                                                                                         {`${v.get('code')} ${v.get('name')}`}
//                                                                                     </Option>
//                                                                                 )
//                                                                             })
//                                                                         }
//                                                                     </XfnSelect>
//                                                                 }

//                                                             </span>
//                                                             {
//                                                                 enableWarehouse?
//                                                                 <span className='warehouse-select'>
//                                                                     <XfnSelect
//                                                                         placeholder='请选择'
//                                                                         combobox
//                                                                         showSearch
//                                                                         value={v.get('warehouseCardName') ?`${v.get('warehouseCardCode') ? v.get('warehouseCardCode'):''} ${v.get('warehouseCardName') ? v.get('warehouseCardName') : ''}`:undefined}
//                                                                         dropdownRender={menu => (
//                                                                             <div>
//                                                                                 {menu}
//                                                                             </div>
//                                                                         )}
//                                                                         onChange={value => {
//                                                                             const valueList = value.split(Limit.TREE_JOIN_STR)
//                                                                             const cardUuid = valueList[0]
//                                                                             const code = valueList[1]
//                                                                             const name = valueList[2]
//                                                                             const amount = v.get('amount')
//                                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'warehouseCardUuid'], cardUuid))
//                                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'warehouseCardCode'], code))
//                                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'warehouseCardName'], name))

//                                                                             v.get('materialUuid') && dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [{cardUuid:v.get('materialUuid'), storeUuid:cardUuid,index: index,materialIndex: i}],i,sectionTemp,'assemblySheet'))

//                                                                         }}
//                                                                         >
//                                                                         {
//                                                                             warehouseList.map((v, i) => {
//                                                                                 return (
//                                                                                     <Option
//                                                                                         key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
//                                                                                     >
//                                                                                         {`${v.get('code')} ${v.get('name')}`}
//                                                                                     </Option>
//                                                                                 )
//                                                                             })
//                                                                         }
//                                                                     </XfnSelect>
//                                                                 </span>
//                                                                 :''
//                                                             }
//                                                             {
//                                                                 openQuantity?
//                                                                 <span>
//                                                                     {
//                                                                         JSON.parse(v.get('isOpenQuantity') || false)  ?
//                                                                         <InputFour
//                                                                             placeholder='输入数量'
//                                                                             value={v.get('quantity')}
//                                                                             onChange={(e) => {
//                                                                                 numberFourTest(e, (value) => {
//                                                                                     dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'quantity'], value))
//                                                                                     if (v.get('price') > 0) {
//                                                                                         const amount = numberCalculate(value,v.get('price'),2,'multiply')
//                                                                                         const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
//                                                                                         const newTotalAmount = numberCalculate(numberCalculate(totalAmount,oldAmount,2,'subtract'),amount)
//                                                                                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'amount'], amount))
//                                                                                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'], newTotalAmount))
//                                                                                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'], numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)))

//                                                                                     }
//                                                                                 })
//                                                                             }}
//                                                                         />:''
//                                                                     }

//                                                                         {
//                                                                             JSON.parse(v.get('isOpenQuantity') || false) ?
//                                                                             (() => {
//                                                                                 const curItem = v
//                                                                                 return(
//                                                                                     <Select
//                                                                                         placeholder='单位'
//                                                                                         style={{marginLeft:'8px',alignSelf:'flex-end'}}
//                                                                                         dropdownClassName='auto-width'
//                                                                                         value={v.get('unitName') ?`${v.get('unitCode') ? v.get('unitCode'):''} ${v.get('unitName') ? v.get('unitName') : ''}`:undefined}
//                                                                                         onChange={(value) => {
//                                                                                             const valueList = value.split(Limit.TREE_JOIN_STR)
//                                                                                             const uuid = valueList[0]
//                                                                                             const name = valueList[1]
//                                                                                             const basicUnitQuantity = JSON.parse(valueList[2]) ? JSON.parse(valueList[2]) : 1
//                                                                                             const oldBasicUnitQuantity = assemblySheet.getIn([index,'materialList',i,'basicUnitQuantity']) ? assemblySheet.getIn([index,'materialList',i,'basicUnitQuantity']) : 1
//                                                                                             const gap = basicUnitQuantity/oldBasicUnitQuantity

//                                                                                             const price = numberCalculate(v.get('price'),gap,4,'multiply',4)
//                                                                                             const amount = numberCalculate(v.get('quantity'),price,2,'multiply')

//                                                                                             const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
//                                                                                             const newTotalAmount = numberCalculate(numberCalculate(totalAmount,oldAmount,2,'subtract'),amount)

//                                                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'], newTotalAmount))
//                                                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'], numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)))

//                                                                                             const materialListItem = assemblySheet.getIn([index,'materialList',i]).toJS()
//                                                                                             const newItem = {
//                                                                                                 ...materialListItem,
//                                                                                                 unitUuid: uuid,
//                                                                                                 unitName: name,
//                                                                                                 basicUnitQuantity,
//                                                                                                 price,
//                                                                                                 amount
//                                                                                             }
//                                                                                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i], fromJS(newItem)))


//                                                                                         }}
//                                                                                     >
//                                                                                         {
//                                                                                             curItem.getIn(['unit','uuid'])?
//                                                                                             <Option key={curItem.getIn(['unit','uuid'])} value={
//                                                                                                 `${curItem.getIn(['unit','uuid'])}${Limit.TREE_JOIN_STR}${curItem.getIn(['unit','name'])}${Limit.TREE_JOIN_STR}1`
//                                                                                             }>
//                                                                                                 {curItem.getIn(['unit','name'])}
//                                                                                             </Option>:''
//                                                                                         }

//                                                                                         {
//                                                                                             (curItem.getIn(['unit','unitList']) || []).map(v =>
//                                                                                                 <Option key={v.get('uuid')} value={
//                                                                                                     `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('basicUnitQuantity')}`
//                                                                                                 }>
//                                                                                                     {v.get('name')}
//                                                                                                 </Option>
//                                                                                             )
//                                                                                         }

//                                                                                         {
//                                                                                             (curItem.get('unitList') || []).map(v =>
//                                                                                                 <Option key={v.get('uuid')} value={
//                                                                                                     `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('basicUnitQuantity')}`
//                                                                                                 }>
//                                                                                                     {v.get('name')}
//                                                                                                 </Option>
//                                                                                             )
//                                                                                         }
//                                                                                     </Select>
//                                                                                 )
//                                                                             })():''
//                                                                         }
//                                                                 </span>
//                                                                 :''
//                                                             }
//                                                             {
//                                                                 openQuantity?
//                                                                 <span>
//                                                                     {
//                                                                         JSON.parse(v.get('isOpenQuantity') || false) ?
//                                                                         <InputFour
//                                                                             placeholder='请输入单价'
//                                                                             value={v.get('price')}
//                                                                             onChange={(e) => {
//                                                                                 numberFourTest(e, (value) => {
//                                                                                     dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'price'], value))
//                                                                                     if (v.get('quantity') > 0) {
//                                                                                         const amount =((value || 0) * v.get('quantity')).toFixed(2)
//                                                                                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'amount'], amount))
//                                                                                         const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
//                                                                                         const newTotalAmount = numberCalculate(numberCalculate(totalAmount,oldAmount,2,'subtract'),amount)
//                                                                                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'], newTotalAmount))
//                                                                                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'], numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)))
//                                                                                         // dispatch(editRunningActions.autoCalculateStockAmount())
//                                                                                         // taxRate && dispatch(editRunningActions.changeAccountTaxRate())

//                                                                                     }
//                                                                                 })
//                                                                             }}
//                                                                         />:''
//                                                                     }
//                                                                 </span>:''
//                                                             }

//                                                             <span>
//                                                                 {
//                                                                     <Input
//                                                                         placeholder='请输入金额'
//                                                                         value={v.get('amount')}
//                                                                         onChange={(e) => {
//                                                                             numberTest(e, (value) => {
//                                                                                 dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'amount'], value))
//                                                                                 const oldAmount = assemblySheet.getIn([index,'materialList',i,'amount'])
//                                                                                 const newTotalAmount = numberCalculate(numberCalculate(totalAmount,oldAmount,2,'subtract'),value)
//                                                                                 dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'], newTotalAmount))
//                                                                                 if (v.get('quantity') > 0) {
//                                                                                     const price = ((value || 0) / v.get('quantity')).toFixed(4)
//                                                                                     dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',i,'price'], price))
//                                                                                 }
//                                                                                 dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'], numberCalculate(newTotalAmount,item.get('curQuantity'),4,'divide',4)))
//                                                                             })
//                                                                         }}
//                                                                     />
//                                                                 }

//                                                             </span>
//                                                             <span>

//                                                             <XfIcon
//                                                                 type='smallAdd'
//                                                                 onClick={() => {
//                                                                     dispatch(editCalculateActions.changeMaterialList(index, i, item.get('materialList'), 'add'))
//                                                                 }}
//                                                             />
//                                                             {
//                                                                 item.get('materialList') && item.get('materialList').size > 1 ?
//                                                                 <XfIcon
//                                                                     type='smallDel'
//                                                                     onClick={() => {
//                                                                         dispatch(editCalculateActions.changeMaterialList(index, i, item.get('materialList'), 'delete'))
//                                                                         const curItemAmount = item.getIn(['materialList',i,'amount'])
//                                                                         const curQuantity = item.get('curQuantity')
//                                                                         const productAmount = item.get('amount')
//                                                                         const amount = numberCalculate(productAmount,curItemAmount,2,'subtract')
//                                                                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'amount'],amount ))
//                                                                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'price'],numberCalculate(amount,curQuantity,2,'divide') ))
//                                                                     }}
//                                                                 /> : null
//                                                             }

//                                                             </span>
//                                                         </div>
//                                                     </Tooltip>
//                                             })
//                                         }
//                                     </section>
//                                 </div>
//                     })
//                 }

//                 <Modal
//                     visible={assemblyNumberModal}
//                     title={'修改组装数量'}
//                     onCancel={() => {
//                         this.setState({
//                             assemblyNumberModal:false,
//                             assemblyIndex:0,
//                             assemblyUuid: ''
//                         })
//                     }}
//                     onOk={() => {
//                         if(Number(assemblyNumber)){
//                             const quantity = assemblySheet.getIn([assemblyIndex,'quantity'])
//                             const multiple = numberCalculate(assemblyNumber,quantity,4,'divide',4)

//                             dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', ['assemblySheet',assemblyIndex,'curQuantity'], assemblyNumber))

//                             if(curItemIsAvailable){
//                                 const oriMaterialList = assemblySheet.getIn([assemblyIndex,'oriMaterialList']) && assemblySheet.getIn([assemblyIndex,'oriMaterialList']).toJS() || []
//                                 let productAmount = 0, selectUuidList = []
//                                 dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',assemblyIndex,'materialList'], fromJS(oriMaterialList.map((v,i) => {
//                                     selectUuidList.push({
//                                         cardUuid: v.materialUuid,
//                                         storeUuid: v.warehouseCardUuid ? v.warehouseCardUuid : '',
//                                         index: assemblyIndex,
//                                         materialIndex: i
//                                     })
//                                     productAmount = numberCalculate(productAmount,v.amount)
//                                     v.quantity = numberCalculate(multiple,v.quantity,4,'multiply',4)
//                                     return v
//                                 }))))
//                                 if(selectUuidList.length > 0 ){
//                                     dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, assemblyIndex,'StockBuildUp','assemblySheet'))
//                                 }else{
//                                     const productPrice = numberCalculate(productAmount,assemblyNumber,4,'divide',4)
//                                     dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',assemblyIndex,'amount'],productAmount ))
//                                     dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',assemblyIndex,'price'],productPrice ))
//                                 }

//                             }

//                             this.setState({
//                                 assemblyNumberModal:false,
//                                 assemblyIndex:0,
//                                 assemblyUuid: ''
//                             })
//                         }else{
//                             message.info('请输入勾选组装单的数量')
//                         }

//                     }}
//                 >
//                     <div className={'assembly-number-modal'}>
//                         <span>数量：</span>
//                         <div className={'assembly-number-modal-input'}>
//                         <InputFour
//                             value={assemblyNumber}
//                             onChange={(e)=>{
//                                 numberFourTest(e, (value) => {
//                                     this.setState({
//                                         assemblyNumber: value
//                                     })
//                                 })
//                         }}/>
//                         </div>

//                     </div>
//                 </Modal>

//                 <AssemblySheetModal
//                     showCommonChargeModal={showSingleInventoryModal}
//                     MemberList={MemberList}
//                     thingsList={thingsList}
//                     dispatch={dispatch}
//                     oriState={oriState}
//                     selectedKeys={selectedKeys}
//                     selectItem={selectItem}
//                     selectList={selectList}
//                     assemblySheet={assemblySheet}
//                     assemblyNumber={assemblyNumber}
//                     sectionTemp={'StockBuildUp'}
//                     cancel={() => {
//                         this.setState({ showSingleInventoryModal: false })
//                     }}
//                     title={'选择存货'}
//                     callback={(assemblySheet,curSelectItem) => {
//                         const curSelectItemToJS = curSelectItem.toJS()
//                         const assemblySheetToJS = assemblySheet.toJS()
//                         const chooseStockIndex = assemblySheet.size
//                         let selectUuidList = []
//                         const newitem = curSelectItemToJS.length && curSelectItemToJS.map((item,i) => {
//                             const multiple = numberCalculate(item.curQuantity,item.quantity,4,'divide',4)

//                             return {
//                                 ...item,
//                                 materialList:item.materialList && item.materialList.length && item.materialList.map((v,j) => {
//                                     selectUuidList.push({
//                                         cardUuid: v.materialUuid,
//                                         storeUuid: v.warehouseCardUuid ? v.warehouseCardUuid : '',
//                                         index: assemblyIndex + i,
//                                         materialIndex: j
//                                     })

//                                     return {
//                                         ...v,
//                                         quantity: numberCalculate(multiple,v.quantity,4,'multiply',4)
//                                     }
//                                 }) || []
//                             }
//                         }) || []

//                         let newAssemblySheet = assemblySheetToJS
//                         newAssemblySheet = assemblySheetToJS.fill(newitem[0],assemblyIndex,assemblyIndex+1)

//                         const [firstItem, ...otherItem] = newitem
//                         newAssemblySheet.splice(assemblyIndex+1,0,...otherItem)
//                         dispatch(editCalculateActions.changeEditCalculateCommonString('StockBuildUp', 'assemblySheet',fromJS(newAssemblySheet)))

//                         if(selectUuidList.length > 0 ){
//                             dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, chooseStockIndex,'StockBuildUp','assemblySheet'))
//                         }

//                     }}

//                     selectTreeFunc={(uuid, level) => {
//                         if (uuid === 'all') {
//                             dispatch(editCalculateActions.getStockBuildUpAssembly('',1))
//                         } else {
//                             dispatch(editCalculateActions.getStockBuildUpAssembly(uuid, level))
//                         }

//                     }}
//                 />

//                 <AddCardModal
// 					showModal={showCardModal}
// 					closeModal={() => this.setState({showCardModal: false})}
// 					dispatch={dispatch}
//                     enableWarehouse={enableWarehouse}
//                     fromPage='payment'
//                     // type={saleOrPurchase[categoryTypeObj]}
// 				/>
//                 <Modal
//                     visible={warehouseModal}
//                     title={'批量设置仓库'}
//                     onCancel={() => {this.setState({warehouseModal:false})}}
//                     onOk={() => {
//                         const { warehouseCardUuid, warehouseCardCode, warehouseCardName } = warehouseCards
//                         const carryoverCardListJ = carryoverCardList.toJS()
//                         const assemblySheetJ = assemblySheet.toJS()
//                         dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, 'assemblySheet', fromJS(assemblySheetJ.map(v => {
//                             v.warehouseCardUuid = warehouseCardUuid
//                             v.warehouseCardCode = warehouseCardCode
//                             v.warehouseCardName = warehouseCardName
//                             return v
//                         }))))

//                         let selectUuidList = [],cardUuidList = []
//                         assemblySheet && assemblySheet.size && assemblySheet.map( (item,i) => {
//                             const materialListJ = item.get('materialList').toJS()
//                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',i,'materialList'], fromJS(materialListJ.map(v => {
//                                 v.warehouseCardUuid = warehouseCardUuid
//                                 v.warehouseCardCode = warehouseCardCode
//                                 v.warehouseCardName = warehouseCardName
//                                 return v
//                             }))))
//                             item.get('materialList').size && item.get('materialList').map((itemM,k) => {
//                                 selectUuidList.push({
//                                     cardUuid: itemM.get('materialUuid'),
//                                     storeUuid: warehouseCardUuid,
//                                     index: i,
//                                     materialIndex: k
//                                 })
//                                 itemM.get('materialUuid') && cardUuidList.push(itemM.get('materialUuid'))
//                             })


//                         })

//                         cardUuidList.length && dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, 0,'StockBuildUp','assemblySheet'))

//                         this.setState({warehouseModal:false,warehouseCards:{}})

//                     }}
//                 >
//                     <div style={{display:'flex'}}>
//                         <span style={{width:'100px',lineHeight:'28px'}}>仓库：</span>
//                         <Select
//                             style={{flex:1}}
//                             placeholder='请选择'
//                             combobox
//                             showSearch
//                             value={warehouseCards.warehouseCardUuid ?`${warehouseCards.warehouseCardCode || ''} ${warehouseCards.warehouseCardName || ''}`:undefined}
//                             onChange={value => {
//                                 const valueList = value.split(Limit.TREE_JOIN_STR)
//                                 const warehouseCardUuid = valueList[0]
//                                 const warehouseCardCode = valueList[1]
//                                 const warehouseCardName = valueList[2]
//                                 this.setState({warehouseCards:{
//                                     warehouseCardUuid,
//                                     warehouseCardCode,
//                                     warehouseCardName
//                                 }})
//                             }}
//                             >
//                             {
//                                 warehouseList && warehouseList.map((v, i) => {
//                                     return (
//                                         <Option
//                                             key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
//                                         >
//                                             {`${v.get('code')} ${v.get('name')}`}
//                                         </Option>
//                                     )
//                                 })
//                             }
//                         </Select>
//                     </div>
//                 </Modal>
//             </div>
//         )
//     }
// }
