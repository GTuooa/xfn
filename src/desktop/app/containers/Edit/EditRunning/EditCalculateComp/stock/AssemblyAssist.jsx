// import React,{ Fragment } from 'react'
// import PropTypes from 'prop-types'
// import { toJS, fromJS } from 'immutable'
// import { connect } from 'react-redux'
// // import 'app/components/common.less'
// import * as Limit from 'app/constants/Limit.js'
// import moment from 'moment'
//
// import { formatFour, formatMoney, DateLib } from 'app/utils'
// import { NumberInput, TableItem } from 'app/components'
// import { DatePicker, Input, Icon, Button, Modal, Divider, Select } from 'antd'
// import InputFour from 'app/components/InputFour'
// import XfnSelect from 'app/components/XfnSelect'
//
// import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
// import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
// import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
// import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
//
// let warehouseTotalAmount = 0
// import XfnInput from 'app/components/Input'
// export default
// class AssemblyAssist extends React.Component {
// 	constructor(props) {
// 		super(props)
// 		this.state={
// 			batchNumber:'',
// 			batchDate:new DateLib().toString(),
// 			focus:false,
// 			addBatch: false
// 		}
// 	}
// 	closeFocus = e => {
// 		let t = e.target || e.srcElement, list = [];
// 		let i = 1
// 		while(t.parentNode && i < 20) {
// 			if (t.parentNode.className && t.parentNode.className.indexOf(`inventory-are-for-dom`) > -1) {
// 				// this.setState({focus:true})
// 				return
// 			}
// 			t = t.parentNode
// 			i++
// 		}
// 		this.setState({focus:false})
// 	}
// 	openDrop = index => {
// 		this.setState({
// 			focus:true
// 		},() => {
// 			const domlist = document.getElementsByClassName('inventory-drop-content')
// 			for (let i = 0;i < domlist.length;i++) {
// 				if (domlist[i]) {
// 					domlist[i].style.display = 'none'
// 				}
// 			}
// 			this.nameInput.style.display = ''
// 		})
// 	}
// 	componentDidMount() {
// 		const body = document.getElementsByTagName("body")[0]
// 		body.addEventListener('click',this.closeFocus)
// 	}
// 	componentWillUnmount() {
// 		const body = document.getElementsByTagName("body")[0]
// 		body.removeEventListener('click',this.closeFocus)
// 	}
// 	render() {
// 		const { batchDate, batchNumber, focus, addBatch } = this.state
// 		const {
// 			dispatch,
// 			item,
// 			index,
// 			materIndex,
// 			oriDate,
// 			stockList,
//             stockTemplate,
//             sectionTemp,
//
// 		} = this.props
// 		let cardValue = ''
// 		const assistList = item.get('assistList') || fromJS([])
// 		const openBatch = item.getIn(['financialInfo','openBatch'])
// 		const openAssist = item.getIn(['financialInfo','openAssist'])
// 		const openShelfLife = item.getIn(['financialInfo','openShelfLife'])
// 		const assistClassificationList = item.getIn(['financialInfo','assistClassificationList']) || fromJS([])
//
// 		if (openAssist && openBatch) {
// 			cardValue = `${assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'} | ${item.get('batch')?item.get('batch'):'批次'}`
// 		} else if (openAssist || openBatch) {
// 			cardValue =  openAssist ?
// 			assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'
// 			:item.get('batch')?item.get('batch'):'批次'
// 		} else {
// 			cardValue = item.get('code') ?`${ item.get('code')?item.get('code'):''} ${item.get('name') ? item.get('name'):''}`:undefined
// 		}
//
// 		const showAssistBox = !openAssist && !openBatch|| !item.get('code') || !focus
// 		return(
// 			<span
// 				className={`stock-assist-items stock-assist-items-top`}
// 				style={{overflow:showAssistBox?'hidden':'visible',paddingLeft:'15px'}}
// 			>
// 				<span className='material-item-index'>({materIndex+1})</span>
// 				{
// 					!focus && (item.getIn(['financialInfo','openAssist']) || item.getIn(['financialInfo','openAssist'])) ?
// 					<span style={{paddingTop: '5px'}}>{item.get('code') ? `${item.get('code')} ${item.get('name')}` : item.get('name')}</span>:''
// 				}
// 				{
// 				showAssistBox?
// 				<XfnSelect
// 					combobox
// 					showSearch
// 					placeholder={`请选择存货`}
// 					className={item.getIn(['financialInfo','openAssist']) || item.getIn(['financialInfo','openAssist']) ?'extra-card':''}
//                     value={cardValue}
// 					onFocus={() => {
// 						if (item.getIn(['financialInfo','openAssist']) || item.getIn(['financialInfo','openAssist'])) {
// 							this.setState({focus:true})
// 						}
// 					}}
// 					dropdownRender={menu => (
// 						<div>
// 							{menu}
// 							<Divider style={{ margin: '4px 0'}} />
// 							{
// 								<div
// 									style={{ padding: '8px', cursor: 'pointer' }}
// 									onMouseDown={() => {
// 										const showModal = () => {
// 											this.setState({showCardModal: true})
// 										}
// 										dispatch(configCallbackActions.beforeRunningAddInventoryCard(showModal ))
// 									}}
// 								>
// 									<Icon type="plus" /> 新增存货
// 								</div>
// 							}
//
// 						</div>
// 					)}
// 					onChange={(value,options) => {
// 						const valueList = value.split(Limit.TREE_JOIN_STR)
// 						const cardUuid = valueList[0]
// 						const code = valueList[1]
// 						const name = valueList[2]
// 						const isOpenQuantity = valueList[3]
// 						const amount = item.get('amount')
// 						const warehouseCardUuid = item.get('warehouseCardUuid')
// 						const warehouseCardCode = item.get('warehouseCardCode')
// 						const warehouseCardName = item.get('warehouseCardName')
// 						const unit = item.get('unit')
// 						const financialInfo = options.props.financialInfo
// 						const obj = {
// 							unit: options.props.unit ? options.props.unit.toJS() : null,
// 							cardUuid,
// 							materialUuid: cardUuid,
// 							name,
// 							code,
// 							amount,
// 							isOpenQuantity,
// 							warehouseCardUuid,
// 							warehouseCardCode,
// 							warehouseCardName,
// 							financialInfo,
// 						}
// 						if (isOpenQuantity === 'true' && options.props.unit && !options.props.unit.get('unitList').size) {
// 							dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'unitName'], options.props.unit.get('name')))
// 							dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'unitUuid'], options.props.unit.get('uuid')))
// 							dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex], fromJS({
// 								...obj,
// 								unitUuid:options.props.unit.get('uuid'),
// 								unitName:options.props.unit.get('name')
// 							})))
// 						} else {
// 							dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex], fromJS({
// 								...obj
// 							})))
// 						}
// 						dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [{cardUuid:cardUuid, storeUuid:warehouseCardUuid,index,materialIndex:materIndex}],materIndex,sectionTemp,'assemblySheet'))
// 						if (financialInfo.get('openAssist') || financialInfo.get('openBatch')) {
// 							this.setState({focus:true})
// 						}
// 					}}
// 					>
// 					{
// 						stockList.map((v, i) => {
//
// 							return (
// 								<Option
// 									key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${i}`}
// 									unit={v.get('unit')}
// 									itemV={v.toJS()}
//                                     financialInfo={v.get('financialInfo')}
// 								>
// 									{`${v.get('code')} ${v.get('name')}`}
// 								</Option>
// 							)
// 						})
// 					}
// 				</XfnSelect>
// 				:
// 				<div style={{position:'relative'}}>
// 					<Input
// 						value={item.get('code') ?`${ item.get('code')?item.get('code'):''} ${item.get('name') ? item.get('name'):''}`:undefined}
// 						onChange={() => {
//                             dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex], fromJS({})))
// 						}}
// 						onFocus={() => {
// 							this.setState({focus:true})
// 						}}
//
// 					/>
// 					<div className='assembly-drop-content' style={{display:focus?'':'none'}}>
// 					<div
// 						className="stock-assist-list-mask"
// 						onClick={()=>{
// 							this.setState({focus:false})
// 						}}
// 					></div>
// 						{
// 							item.getIn(['financialInfo','openAssist'])?
// 							<div>
// 								<span>属性:</span>
// 								{
// 									assistClassificationList.map((w,i) =>
// 										<Select
// 											key={w.get('uuid')}
// 											value={((assistList || fromJS([])).find(z => z.get('classificationUuid') === w.get('uuid')) || fromJS({})).get('propertyName') || undefined}
// 											onChange={(value) => {
// 												const valueList = value.split(Limit.TREE_JOIN_STR)
// 												const propertyUuid = valueList[0]
// 												const propertyName = valueList[1]
// 												const size = assistList.size
// 												const childIndex = assistList.findIndex(z => z.get('classificationUuid') === w.get('uuid'))
// 												if (size === 0) {
// 													dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'assistList'],fromJS([{
// 														classificationUuid:w.get('uuid'),
// 														classificationName:w.get('name'),
// 														propertyUuid,
// 														propertyName
// 													}])))
// 												} else if (childIndex === -1) {
// 													dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'assistList',size],fromJS({
// 														classificationUuid:w.get('uuid'),
// 														classificationName:w.get('name'),
// 														propertyUuid,
// 														propertyName
// 													})))
//
// 												} else {
// 													dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'assistList',i,'propertyUuid'],propertyUuid))
// 													dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'assistList',i,'propertyName'],propertyName))
// 												}
// 											}}
// 										>
// 											{
// 												w.get('propertyList').map(z =>
// 													<Option key={z.get('uuid')} value={`${z.get('uuid')}${Limit.TREE_JOIN_STR}${z.get('name')}`}>
// 														{z.get('name')}
// 													</Option>
// 												)
// 											}
// 										</Select>
// 									)
// 								}
// 							</div>:''
// 						}
// 						{
// 							item.getIn(['financialInfo','openBatch'])?
// 							<div>
// 								<span>批次:</span>
// 								<Fragment>
// 								<Select
// 									key={item.get('uuid')}
// 									showArrow={false}
// 									placeholder='请选择/新增批次'
// 									onDropdownVisibleChange={(open)=> {
// 										open && dispatch(innerCalculateActions.getStockBatchList({
// 											inventoryUuid:item.get('materialUuid'),
// 											sectionTemp,
// 											stockTemplate,
// 											index,
// 											materIndex
// 										}))
// 									}}
// 									value={item.get('batch')?`${item.get('batch')}${openShelfLife && item.get('productionDate') ?`(${item.get('productionDate')})`:''}`:undefined}
// 									onChange={(value,options) => {
// 										const valueList = value.split(Limit.TREE_JOIN_STR)
// 										const batchUuid = options.props.batchUuid
// 										const batch = valueList[0] || ''
// 										const productionDate = valueList[1]
// 										dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'batch'], batch))
// 										dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'batchUuid'], batchUuid))
// 										dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'productionDate'], productionDate))
// 									}}
// 								>
// 									{
// 										item.get('batchList') && item.get('batchList').map(w =>
// 											<Option
// 												key={w.get('batchUuid')}
// 												value={`${w.get('batch')}${Limit.TREE_JOIN_STR}${w.get('productionDate')}`}
// 												batchUuid={w.get('batchUuid')}
// 												>
// 												{`${w.get('batch')}(${w.get('productionDate')})`}
// 											</Option>
// 										)
// 									}
// 								</Select>
// 								{
// 									<span className='add-button' onClick={e => {
// 										e.preventDefault()
// 										this.setState({
// 											addBatch:true,
// 										})
// 									}}>新增</span>
// 								}
// 							</Fragment>
// 							<div className={`ls-batch-select-frame`} style={{display: addBatch ? '' : 'none'}}>
// 								<div >
// 									<span>批次号：</span>
// 									<Input
// 										value={batchNumber}
// 										onChange={e => {
// 											e.preventDefault()
// 											this.setState({batchNumber:e.target.value})
// 										}}
// 										placeholder='请输入批次号'
//
// 									/>
// 								</div>
// 								<div>
// 									<span>生产日期：</span>
// 									<DatePicker
// 										placeholder='请选择生产日期'
// 										allowClear={false}
// 										size='small'
// 										value={moment(batchDate)}
// 										onChange={value => {
// 											const date = value.format('YYYY-MM-DD')
// 											this.setState({batchDate:date})
// 										}}
// 									/>
// 								</div>
// 								<div>
// 									<Button onClick={() => this.setState({addBatch:false})}>取消</Button>
// 									<Button
// 										type='primary'
// 										onClick={() => {
// 											dispatch(editRunningActions.insertBatch(batchNumber,batchDate,item.get('cardUuid'),()=> this.setState({batchDrop:false,batchNumber:'',batchDate:new DateLib().toString()})))
// 										}}
// 									>新增</Button>
// 								</div>
// 							</div>
// 							</div>:''
// 						}
// 						{
// 							<div>
// 								<Button
// 									type='primary'
// 									onClick={() => {
// 										this.setState({focus:false})
// 									}}
// 								>确定</Button>
// 							</div>
// 						}
// 					</div>
// 				</div>
//
// 				}
// 			</span>
// 		)
// 	}
// }
