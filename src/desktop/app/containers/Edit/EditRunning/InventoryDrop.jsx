import React,{ Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
// import 'app/components/common.less'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'

import { formatFour, formatMoney, DateLib } from 'app/utils'
import { NumberInput, TableItem, XfnIcon } from 'app/components'
import { DatePicker, Input, Icon, Button, Modal, Divider, Select, message } from 'antd'
import InputFour from 'app/components/InputFour'
import XfnSelect from 'app/components/XfnSelect'
import BatchModal from 'app/containers/Config/Inventory/BatchModal.jsx'

import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
let warehouseTotalAmount = 0
import XfnInput from 'app/components/Input'
export default
class InventoryDrop extends React.Component {
	state={
		batchDrop:false,
		value:'',
		focus:false,
		batchNumber:'',
		batchDate:'',
		expirationDate:'',
		focusIndex:0,
		assistModal:false,
		asssistName:'',
		classificationUuid:'',
		batchModal:false
	}
	closeFocus = e => {
		let t = e.target || e.srcElement, list = [];
		let i = 1
		if (t.className && t.className.indexOf('ant-modal-wrap') > -1) {
			return
		}
		while(t.parentNode && i < 20) {
			if (t.parentNode.className && t.parentNode.className.indexOf(`inventory-are-for-dom`) > -1) {
				// this.setState({focus:true})
				return
			}
			t = t.parentNode
			i++
		}
		this.setState({focus:false,batchDrop:false})
	}
	getCurShelfLife = (startDate,endDate) => {
		const sDate1 = Date.parse(startDate)
		const sDate2 = Date.parse(endDate)
		return sDate2 > sDate1 ? Math.floor((sDate2 - sDate1) / (24 * 3600 * 1000)):null
	}
	calculLife = (date,day) => {
		const sDate = Date.parse(date)
		const newDate = new Date(sDate + day*24*3600*1000)
		return new DateLib(newDate).toString()
	}
	openDrop = index => {
		this.setState({
			focus:true
		},() => {
			const domlist = document.getElementsByClassName('inventory-drop-content')
			for (let i = 0;i < domlist.length;i++) {
				if (domlist[i]) {
					domlist[i].style.display = 'none'
				}
			}
			this.nameInput.style.display = ''
		})
	}
	componentDidMount() {
		const body = document.getElementsByTagName("body")[0]
		body.addEventListener('click',this.closeFocus)
	}
	componentWillUnmount() {
		const body = document.getElementsByTagName("body")[0]
		body.removeEventListener('click',this.closeFocus)
	}
	componentsun
	render() {
		const {
			focus,
			batchDrop,
			batchNumber,
			batchDate,
			focusIndex,
			assistModal,
			asssistName,
			classificationUuid,
			batchModal,
			expirationDate,
			batchIndex
		} = this.state
		const {
			dispatch,
			v,
			i,
			stockRange,
			stockCardList,
			oriDate,
			categoryTypeObj,
			stockList,
			batchList=fromJS([]),
			showModal,
			oriState,
			oriUuid,
			insertOrModify
		} = this.props
		let cardValue = ''
		const assistList = v.get('assistList') || fromJS([])
		const openBatch = v.getIn(['financialInfo','openBatch'])
		const openAssist = v.getIn(['financialInfo','openAssist'])
		const openShelfLife = v.getIn(['financialInfo','openShelfLife'])
		const shelfLife = v.getIn(['financialInfo','shelfLife'])
		const assistClassificationList = v.getIn(['financialInfo','assistClassificationList']) || fromJS([])
		const batchItem = batchList.find(z => z.get('batchUuid') === v.get('batchUuid') || z.get('batch') === v.get('batch')) || v || fromJS({})
		const batchValue = batchItem.get('batch') || v.get('batch')?`${batchItem.get('batch') || v.get('batch')}${openShelfLife && batchItem.get('expirationDate') && batchItem.get('expirationDate') !== 'undefined' ?`(${batchItem.get('expirationDate')})`:''}`:undefined
		if (openAssist && openBatch) {
			cardValue = `${assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'} | ${v.get('batch')?batchValue:'批次'}`
		} else if (openAssist || openBatch) {
			cardValue =  openAssist ?
			assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'
			:v.get('batch')?batchValue:'批次'
		} else {
			cardValue = v.get('code') ?`${ v.get('code')?v.get('code'):''} ${v.get('name') ? v.get('name'):''}`:undefined
		}
		const saleOrPurchase = {
            acBusinessIncome: 'sale',
            acBusinessExpense: 'purchase'
        }
		return(
			<span style={{display:'flex',flexDirection:'row',overflow:'visible'}} className={`inventory-are-for-dom`}>
				<span style={{width:'30px',lineHeight:'27px'}}>({i+1})</span>
				<span
					key={i}
					style={{display:'flex',flexDirection:'column',overflow:!openAssist && !openBatch|| !v.get('code') || !focus ?'hidden':'visible',flex:1}}
				>
					{
						!focus && (openAssist || openBatch) ?
						<span>{`${v.get('code')} ${v.get('name')}`}</span>:''
					}
					{
						(openAssist || openBatch) && !focus?
						<XfnIcon type='circle-del' className='inventory-select-circle-del' onClick={e => {
							e.preventDefault()
							dispatch(editRunningActions.changeLrAccountCommonString('ori', ['carryoverCardList',i], fromJS({})))
							dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i], fromJS({})))
						}}/>:''
					}
					{
					!openAssist && !openBatch || !focus || !v.get('code')?
						<XfnSelect
							combobox
							showSearch
							placeholder='请选择存货'
							value={cardValue}
							onFocus={() => {
								if (openBatch || openAssist) {
									this.openDrop(i)
								}
							}}
							// open
							// disabled={v.getIn(['financialInfo','openAssist']) || v.getIn(['financialInfo','openAssist'])}
							className={openAssist || openBatch ?'extra-card':''}
							dropdownRender={menu => (
								<div>
									{menu}
									<Divider style={{ margin: '4px 0',display:stockRange.size?'':'none' }} />
									{
										stockRange.size?
										<div
											onMouseDown={e => e.preventDefault()}
											style={{ padding: '8px', cursor: 'pointer' }}
											onClick={() => {
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
								const cardUuid = valueList[0]
								const code = valueList[1]
								const name = valueList[2]
								const isOpenedQuantity = valueList[3]
								const amount = v.get('amount')
								const warehouseCardUuid = v.get('warehouseCardUuid')
								const warehouseCardCode = v.get('warehouseCardCode')
								const warehouseCardName = v.get('warehouseCardName')
								const financialInfo = options.props.financialInfo || fromJS({})
								const openAssist = financialInfo.get('openAssist')
								const openBatch = financialInfo.get('openBatch')
								const newStockCardList = stockCardList.toJS().map((v,ii) => {
									if (ii === i) {
										v.cardUuid = cardUuid
										v.storeUuid = v.warehouseCardUuid
									} else {
										v.storeUuid = v.warehouseCardUuid
									}
									return v
								})

								dispatch(editRunningActions.getStockCardPrice(oriDate,newStockCardList,stockCardList.setIn([i,'cardUuid'],cardUuid)))
								const obj = {
									cardUuid,
									name,
									code,
									amount,
									isOpenedQuantity,
									warehouseCardUuid,
									warehouseCardCode,
									warehouseCardName,
									financialInfo
								}
								dispatch(editRunningActions.changeLrAccountCommonString('ori', ['carryoverCardList',i], fromJS({
									cardUuid,
									name,
									code,
									warehouseCardUuid,
									warehouseCardCode,
									warehouseCardName,
									financialInfo})
								))
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
									dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i], fromJS({
										...obj,
										price:options.props.priceList.getIn([0,'defaultPrice']),
										unitUuid:unitUuid,
										unitName:unitName
									})))
								} else {
									if (options.props.unit && !options.props.unit.get('unitList').size) {
										dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i], fromJS({
											...obj,
											unitUuid:options.props.unit.get('uuid'),
											unitName:options.props.unit.get('name')
										})))
									} else {
										dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i], fromJS({
											...obj
										})))
									}
								}
								if (openAssist || openBatch) {
									this.openDrop(i)
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
											financialInfo={v.get('financialInfo')}
										>
											{`${v.get('code')} ${v.get('name')}`}
										</Option>
									)
								})
							}
					</XfnSelect>
					:
					<div style={{position:'relative'}} >
						<Input
							value={v.get('code') ?`${ v.get('code')?v.get('code'):''} ${v.get('name') ? v.get('name'):''}`:undefined}
							onChange={() => {
								dispatch(editRunningActions.changeLrAccountCommonString('ori', ['carryoverCardList',i], fromJS({})))
								dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i], fromJS({})))
							}}
							onFocus={() => {
								this.openDrop(i)
							}}

						/>
						<XfnIcon type='circle-del' className='inventory-circle-del' onClick={e => {
							e.preventDefault()
							dispatch(editRunningActions.changeLrAccountCommonString('ori', ['carryoverCardList',i], fromJS({})))
							dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',i], fromJS({})))
						}}/>
						<div
							className='inventory-drop-content'
							style={{display:focus?'':'none'}}
							ref={(node) => this.nameInput = node}
							>
							<div style={{display:openAssist?'':'none'}}>
								<span>属性：</span>
								{
									assistClassificationList.map((w,index) =>
										<Select
											key={w.get('uuid')}
											dropdownClassName={`inventory-are-for-dom${i}`}
											value={((assistList || fromJS([])).find(z => z.get('classificationUuid') === w.get('uuid')) || fromJS({})).get('propertyName') || undefined}
											dropdownRender={menu => (
												<div>
													{menu}
													<Divider style={{ margin: '4px 0' }} />
													<div
														style={{ padding: '4px 8px', cursor: 'pointer' }}
														onMouseDown={e => e.preventDefault()}
														onClick={() => this.setState({assistModal:true,classificationUuid:w.get('uuid')})}
													>
														<Icon type="plus" /> 新增
													</div>
												</div>
											)}
											onChange={(value) => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const propertyUuid = valueList[0]
												const propertyName = valueList[1]
												const size = assistList.size
												let curAssistList = fromJS([])
												const childIndex = assistList.findIndex(z => z.get('classificationUuid') === w.get('uuid'))
												let obj = {
													classificationUuid:w.get('uuid'),
													classificationName:w.get('name'),
													propertyUuid,
													propertyName
												}
												if (size === 0) {
													dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'assistList'],fromJS([obj])))
													insertOrModify === 'insert' && dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',i,'assistList'],fromJS([obj])))
													curAssistList = curAssistList.push(obj)
												} else if (childIndex === -1) {
													dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'assistList',size],fromJS(obj)))
													insertOrModify === 'insert' && dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',i,'assistList',size],fromJS(obj)))
													curAssistList = assistList.set(size,obj)
												} else {
													dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'assistList',index,'propertyUuid'],propertyUuid))
													insertOrModify === 'insert' && dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',i,'assistList',index,'propertyUuid'],propertyUuid))
													dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'assistList',index,'propertyName'],propertyName))
													curAssistList = assistList.set(index,obj)
												}
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
												dispatch(editRunningActions.getStockCardPrice(oriDate,stockCardList.setIn([i,'assistList'],curAssistList).toJS()))
												// dispatch(editRunningActions.changeLrAccountCommonString('ori', ['assistList',index], fromJS({uuid,name})))
											}}
										>
											{
												w.get('propertyList').map(z =>
													<Option key={z.get('uuid')} value={`${z.get('uuid')}${Limit.TREE_JOIN_STR}${z.get('name')}`}>
														{z.get('name')}
													</Option>
												)
											}
										</Select>
									)
								}
							</div>
							{
								openBatch?
								<div>
									<span>批次：</span>
									<Fragment>
									<XfnSelect
										showSearch
										key={v.get('uuid')}
										showArrow={false}
										placeholder='请选择/新增批次'
										dropdownClassName={`inventory-are-for-dom${i}`}
										dropdownRender={menu => (
											<div>
												{menu}
												<Divider style={{ margin: '4px 0' }} />
												<div
													style={{ padding: '4px 8px', cursor: 'pointer' }}
													onMouseDown={e => e.preventDefault()}
													onClick={() => this.setState({batchModal:true})}
												>
													<XfnIcon type='edit-pen'/>修改批次信息
												</div>
											</div>
										)}
										onDropdownVisibleChange={(open)=> {
											open && dispatch(editRunningActions.getBatchList(v))
										}}
										value={batchValue}
										onChange={value => {
											const valueList = value.split(Limit.TREE_JOIN_STR)
											const batchUuid = valueList[0]
											const batch = valueList[1] || ''
											const expirationDate = valueList[2]
											dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'batch'],batch))
											dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'batchUuid'],batchUuid))
											dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',i,'expirationDate'],expirationDate))
											dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',i,'expirationDate'],expirationDate))
											dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',i,'batchUuid'],batchUuid))
											dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',i,'batch'],batch))
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
											dispatch(editRunningActions.getStockCardPrice(oriDate,stockCardList.setIn([i,'batchUuid'],batchUuid).toJS()))
										}}
									>
										{
											batchList.filter(w => w.get('canUse')).map(w =>
												<Option
													key={w.get('batchUuid')}
													value={`${w.get('batchUuid')}${Limit.TREE_JOIN_STR}${w.get('batch')}${Limit.TREE_JOIN_STR}${w.get('expirationDate')}`}
													>
													{`${w.get('batch')}${v.getIn(['financialInfo','openShelfLife']) && w.get('expirationDate')?`(${w.get('expirationDate')})`:''}`}
												</Option>
											)
										}
									</XfnSelect>
									<span className='add-button' onClick={e => {
										e.preventDefault()
										e.stopPropagation()
										this.setState({
											batchDrop:true,
											batchIndex:i
										})
									}}>新增</span>
								</Fragment>
								<div className={`ls-batch-select-frame inventory-are-for-dom`} style={{display:batchDrop?'':'none'}} onClick={(e)=>{e.stopPropagation()}}>
									<div >
										<span><span style={{color:'red'}}>*</span>批次号：</span>
										<Input
											value={batchNumber}
											className={`inventory-are-for-dom${i}`}
											onChange={e => {
												e.preventDefault()
												const reg =  /^[0-9a-zA-Z]{0,8}$/
												if (reg.test(e.target.value)) {
													this.setState({batchNumber:e.target.value})

												} else {
													message.info('批次只支持输入8位以内的数字或字母')
												}
											}}
											placeholder='请输入批次号'

										/>
									</div>
									{
										openShelfLife?
										<div>
											<span>生产日期：</span>
											<DatePicker
												placeholder='请选择生产日期'
												allowClear={false}
												size='small'
												dropdownClassName={`inventory-are-for-dom${i}`}
												// disabledDate={curDisableDate}
												// value={moment(oriDate)}
												// value = {moment('')}
												value={batchDate?moment(batchDate):''}
												onChange={value => {
													const date = value.format('YYYY-MM-DD')
													this.setState({batchDate:date})
													if (!expirationDate && shelfLife) {
														this.setState({expirationDate:this.calculLife(date,shelfLife)})

													}
													// dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
												}}
											/>
										</div>:''
									}
									{
										openShelfLife?
										<div>
											<span><span style={{color:'red'}}>*</span>截止日期：</span>
											<DatePicker
												placeholder='请选择截止日期'
												allowClear={false}
												size='small'
												dropdownClassName={`inventory-are-for-dom${i}`}
												// disabledDate={curDisableDate}
												// value={moment(oriDate)}
												// value = {moment('')}
												value={expirationDate?moment(expirationDate):''}
												onChange={value => {
													const date = value.format('YYYY-MM-DD')
													this.setState({expirationDate:date})
													// dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
												}}
											/>
										</div>:''
									}
									{
										openShelfLife && batchDate && expirationDate?
										<div>
											<span></span>
											<div>{`(${this.getCurShelfLife(batchDate,expirationDate)?`实际保质期：${this.getCurShelfLife(batchDate,expirationDate)}天`:''})`}</div>
										</div>:''
									}

									<div>
										<Button onClick={() => this.setState({batchDrop:false})}>取消</Button>
										<Button type='primary' onClick={() => {
											dispatch(editRunningActions.insertBatch(batchNumber,batchDate,expirationDate,v.get('cardUuid'),(batch,batchUuid,expirationDate)=> {
												this.setState({batchDrop:false,batchNumber:'',batchDate:'',expirationDate:''})
												dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',batchIndex,'batch'],batch))
												dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',batchIndex,'batchUuid'],batchUuid))
												dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',batchIndex,'expirationDate'],expirationDate))
												dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',batchIndex,'expirationDate'],expirationDate))
												dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',batchIndex,'batchUuid'],batchUuid))
												dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',batchIndex,'batch'],batch))
											}

											))

										}}>新增</Button>
									</div>
								</div>
								</div>:''
							}
							{/* <div>
								<Button
									type='primary'
									onClick={() => {
										this.setState({focus:false})
									}}
								>确定
								</Button>
							</div> */}
						</div>
						{
							assistModal?
								<Modal
									visible
									title='新增属性'
									className='inventory-are-for-dom'
									onCancel={() => this.setState({assistModal:false})}
									onOk={() => {
										const index = assistClassificationList.findIndex(z => z.get('uuid') === classificationUuid)
										dispatch(editRunningActions.insertAssist(classificationUuid,asssistName,v.get('cardUuid'),['stockCardList',i,'financialInfo','assistClassificationList',index,'propertyList'],() => {
											this.setState({assistModal:false,asssistName:''})
										}))
									}}
								>
									<div style={{display:'flex'}}
										>
										<span style={{width:'72px',lineHeight:'28px'}}>属性名称：</span>
										<Input
											value={asssistName}
											onChange={e => {
												e.preventDefault()
												this.setState({
													asssistName:e.target.value
												})
										}}/>
									</div>
								</Modal>:''
						}
						{
							batchModal?
							<BatchModal
								className='inventory-are-for-dom'
								visible={true}
								onClose={() => {
									this.setState({batchModal:false})
								}}
								onOk={(modifyBatch,modifyBatchUuid,modifyBatchDate,modifyExpirationDate) => {
									dispatch(editRunningActions.modifyBatch(modifyBatch,modifyBatchUuid,openShelfLife?modifyBatchDate:'',openShelfLife?modifyExpirationDate:'',v.get('cardUuid'),() => {
										this.setState({batchModal:false})
									}))
								}}
								saveAndNewForbidden={true}
								batchList={batchList}
								openShelfLife={openShelfLife}
								shelfLife={shelfLife}
							/>:''
						}

					</div>
					}
				</span>
			</span>
		)
	}
}
