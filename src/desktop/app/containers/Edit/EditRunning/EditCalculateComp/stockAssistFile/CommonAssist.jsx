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
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

let warehouseTotalAmount = 0
import XfnInput from 'app/components/Input'
export default
class CommonAssist extends React.Component {
	constructor(props) {
		super(props)
		this.state={
			batchNumber:'',
			batchDate:'',
			expirationDate:'',
			focus:false,
			addBatch: false,
			batchModal: false,
			assistModal: false,
			asssistName:'',
			classificationUuid:'',
			assIndex: -1,
			addBatchChange: false,
		}
	}
	closeFocus = e => {
		let t = e.target || e.srcElement, list = [];
		let i = 1
		while(t.parentNode && i < 20) {
			if (t.parentNode.className && typeof t.parentNode.className === 'string' &&  t.parentNode.className.indexOf(`inventory-are-for-dom`) > -1) {

				return
			}
			t = t.parentNode
			i++
		}
		this.setState({focus:false,addBatch: false,assistModal: false})


	}
	getCurShelfLife = (startDate,endDate) => {
		const sDate1 = Date.parse(startDate)
		const sDate2 = Date.parse(endDate)
		return sDate2 > sDate1 ? Math.floor((sDate2 - sDate1) / (24 * 3600 * 1000)):null
	}
	openDrop = (isAssemblySheet) => {
		this.setState({
			focus:true
		},() => {
			const domlist = isAssemblySheet ? document.getElementsByClassName('assembly-drop-content') : document.getElementsByClassName('inventory-drop-content')
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
	// shouldComponentUpdate(nextprops, nextstate) {
		// return this.props !== nextprops ||
		// 		this.state.batchNumber !== nextstate.batchNumber ||
		// 		this.state.batchDate !== nextstate.batchDate ||
		// 		this.state.expirationDate !== nextstate.expirationDate ||
		// 		this.state.focus !== nextstate.focus ||
		// 		this.state.addBatch !== nextstate.addBatch ||
		// 		this.state.batchModal !== nextstate.batchModal ||
		// 		this.state.assistModal !== nextstate.assistModal ||
		// 		this.state.asssistName !== nextstate.asssistName ||
		// 		this.state.classificationUuid !== nextstate.classificationUuid ||
		// 		this.state.assIndex !== nextstate.assIndex
	// }
	componentWillUnmount() {
		const body = document.getElementsByTagName("body")[0]
		body.removeEventListener('click',this.closeFocus)
	}

	render() {
		const { batchDate, expirationDate, batchNumber, focus, addBatch, batchModal, assistModal, asssistName,classificationUuid, assIndex, addBatchChange  } = this.state
		const {
			dispatch,
			item,
			index,
			oriDate,
			stockList,

            stockTitleName,
            notFoundContent,
            stockTemplate,
            sectionTemp,
            needHidePrice, //多单位选择单位前不默认填入金额
            selectStockFun,//选择存货调用函数
            oriState,
            warehouseUuid,//存货调拨调出仓库Uuid
            cardUuidName,
            type,
            onSelectChange,
			isAssemblySheet,//存储位置
			materIndex,
			isClearSerialList,
			noPrice,
			showModalFun,
		} = this.props
		let cardValue = ''
		const assistList = item.get('assistList') || fromJS([])
		const openBatch = item.getIn(['financialInfo','openBatch'])
		const openAssist = item.getIn(['financialInfo','openAssist'])
		const openShelfLife = item.getIn(['financialInfo','openShelfLife'])
		const shelfLife = item.getIn(['financialInfo','shelfLife'])
		const assistClassificationList = item.getIn(['financialInfo','assistClassificationList']) || fromJS([])
		const storagePlaceArr = isAssemblySheet ? ['assemblySheet',index,'materialList',materIndex] : [stockTemplate,index]
		const batchItem = (item.get('batchList') || fromJS([])).find(z => z.get('batchUuid') === item.get('batchUuid') || z.get('batch') === item.get('batch')) || fromJS({})
		const batchValue = batchItem.get('batch') || item.get('batch')?`${batchItem.get('batch') || item.get('batch')}${openShelfLife && batchItem.get('expirationDate') && batchItem.get('expirationDate') !== 'undefined' ?`(${batchItem.get('expirationDate')})`:openShelfLife && item.get('expirationDate') && item.get('expirationDate') !== 'undefined' ? `(${item.get('expirationDate')})` : ''}`:undefined

		if (openAssist && openBatch) {
			cardValue = `${assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'} | ${item.get('batch')?batchValue:'批次'}`
		} else if (openAssist || openBatch) {
			cardValue =  openAssist ?
			assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'
			:item.get('batch')?batchValue:'批次'
		} else {
			cardValue = item.get('code') ?`${ item.get('code')?item.get('code'):''} ${item.get('name') ? item.get('name'):''}`:undefined
		}
		const showAssistBox = !openAssist && !openBatch|| !item.get('code') || !focus

		const ownSelectChange = (value,options) => {
			const valueList = value.split(Limit.TREE_JOIN_STR)
			const cardUuid = valueList[0]
			const code = valueList[1]
			const name = valueList[2]
			const isOpenedQuantity = valueList[3] === 'true' ? true : false
			const isUniformPrice = valueList[4] === 'true' ? true : false
			const amount = item.get('amount')
			const warehouseCardUuid = item.get('warehouseCardUuid')
			const warehouseCardCode = item.get('warehouseCardCode')
			const warehouseCardName = item.get('warehouseCardName')
			const financialInfo = options.props.financialInfo
			const obj = {
				cardUuid,
				name,
				code,
				amount,
				isOpenedQuantity,
				isUniformPrice,
				warehouseCardUuid,
				warehouseCardCode,
				warehouseCardName,
				unit: options.props.unit,
				financialInfo,
			}

			if (isOpenedQuantity.toString() === 'true' && options.props.unit && !options.props.unit.get('unitList').size ) {
				dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,index], fromJS({
					...obj,
					unitUuid:options.props.unit.get('uuid'),
					unitName:options.props.unit.get('name')
				})))
			} else {
				dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,index], fromJS({
					...obj
				})))
			}
			let noNeedPrice = false,moreUnit = false
			if(needHidePrice){
				noNeedPrice = true
				moreUnit = oriState !== 'STATE_CHYE_CH' ? (!(isOpenedQuantity === 'true' && options.props.unit && !options.props.unit.get('unitList').size) ) : true
			}

			selectStockFun && selectStockFun(cardUuid,index)


			if(oriState !== 'STATE_YYSR_XS' && oriState !== 'STATE_YYSR_TS'){
				dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
					{
						cardUuid:cardUuid,
						storeUuid: oriState === 'STATE_CHDB' ? warehouseUuid : warehouseCardUuid,
						assistList: item.get('assistList'),
						batchUuid:item.get('batchUuid'),
						noNeedPrice,
						moreUnit
					}
				],index,sectionTemp,type))
			}
		}
		return(
			<span
				className={`stock-assist-items inventory-are-for-dom ${isAssemblySheet ? 'stock-assist-items-top' : ''}`}
				style={{overflow:showAssistBox?'hidden':'visible'}}
			>
				{
					(openAssist || openBatch) && !focus ?
					<span>{item.get('code') ? `${item.get('code')} ${item.get('name')}` : item.get('name')}</span>:''
				}
				{
					(openAssist || openBatch) && !focus?
					<XfnIcon type='circle-del' className='inventory-select-circle-del' onClick={e => {
						e.preventDefault()
						dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr, fromJS({})))
					}}/>:''
				}
				{
				showAssistBox ?
                <XfnSelect
                    combobox
                    showSearch
					showArrow={true}
                    placeholder={`请选择${stockTitleName}`}
					className={openBatch || openAssist ?'extra-card':''}
                    value={cardValue}
                    notFoundContent={notFoundContent ? <span><Icon type="info-circle" theme="filled" style={{color:'#1890ff'}}/> {notFoundContent}</span> : undefined}
					onFocus={() => {
						if (openAssist || openBatch) {
							this.openDrop(isAssemblySheet)
						}
					}}
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0',display:oriState === 'STATE_CHZZ_ZZCX' || oriState === 'STATE_XMJZ_JZRK'?'':'none' }} />
                            {
                                oriState === 'STATE_CHZZ_ZZCX' || oriState === 'STATE_XMJZ_JZRK' ?
                                <div
                                    style={{ padding: '8px', cursor: 'pointer' }}
                                    onMouseDown={() => {
										showModalFun()
                                        dispatch(configCallbackActions.beforeRunningAddInventoryCard(showModalFun))
                                    }}
                                >
                                    <Icon type="plus" /> 新增存货
                                </div>:''
                            }

                        </div>
                    )}
                    onChange={(value,options) => {
						onSelectChange ? onSelectChange(value,options) : ownSelectChange(value,options)
						if(isClearSerialList){
							dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['serialList']),fromJS([]) ))
							dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['quantity']),'' ))
							dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['isModify']),true ))
							if(!noPrice){
								dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['amount']), ''))
							}
						}
                        const financialInfo = options.props.financialInfo
                        if (financialInfo && (financialInfo.get('openAssist') || financialInfo.get('openBatch'))) {
                            this.openDrop(isAssemblySheet)
                        }
					}}
                    >
                    {
                        stockList.map((v, i) => {
                            return (
                                <Option
                                    key={v.get(cardUuidName)} value={`${v.get(cardUuidName)}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${v.get('isUniformPrice')}`}
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
				<div style={{position:'relative'}}>
					<Input
						value={item.get('code') ?`${ item.get('code')?item.get('code'):''} ${item.get('name') ? item.get('name'):''}`:undefined}
						onChange={() => {
                            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr, fromJS({})))
						}}
						onFocus={() => {
							this.openDrop(isAssemblySheet)
						}}

					/>
					<XfnIcon type='circle-del' className='inventory-circle-del' onClick={e => {
						e.preventDefault()
						dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr, fromJS({})))
					}}/>

					<div
						className={isAssemblySheet ? 'assembly-drop-content' : 'inventory-drop-content'}
						style={{display:focus?'':'none'}}
						ref={(node) => this.nameInput = node}
						onClick={(e)=>{
							e.stopPropagation()
							addBatchChange && this.setState({addBatch: false,addBatchChange:false})
						}}
					>

						<div style={{display:openAssist?'':'none'}}>
							<span>属性:</span>
							{
								assistClassificationList.map((w,i) =>
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
													onClick={() => this.setState({
														assistModal:true,
														classificationUuid:w.get('uuid'),
														assIndex: i,
													})}
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
											const childIndex = assistList.findIndex(z => z.get('classificationUuid') === w.get('uuid'))
											let changeAssist = item.get('assistList') ? item.get('assistList').toJS() : []
											if (size === 0) {
												changeAssist = [{
													classificationUuid:w.get('uuid'),
													classificationName:w.get('name'),
													propertyUuid,
													propertyName
												}]
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['assistList']),fromJS(changeAssist)))
											} else if (childIndex === -1) {
												changeAssist = changeAssist.concat([{
													classificationUuid:w.get('uuid'),
													classificationName:w.get('name'),
													propertyUuid,
													propertyName
												}])
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['assistList']),fromJS(changeAssist)))

											} else {
												const assistObj = item.getIn(['assistList',i]).toJS()
												changeAssist.splice(i,1,{...assistObj,propertyUuid,propertyName})
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['assistList']),fromJS(changeAssist)))
											}
											if(isClearSerialList){
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['serialList']),fromJS([]) ))
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['quantity']),'' ))
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['isModify']),true ))
												if(!noPrice){
													dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['amount']), ''))
												}
											}
											let noNeedPrice = false,moreUnit = false
											if(this.props.needHidePrice){
												noNeedPrice = true
												moreUnit = oriState !== 'STATE_CHYE_CH' ? (!(item.get('isOpenedQuantity') === 'true' && item.get('unit')  && !item.getIn(['unit','unitList']).size) ) : true
											}
											dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
												{
													cardUuid:item.get('cardUuid'),
													storeUuid: oriState === 'STATE_CHDB' ? this.props.warehouseUuid : item.get('warehouseCardUuid'),
													assistList: changeAssist || [],
													batchUuid: item.get('batchUuid'),
													noNeedPrice,
													moreUnit,
												}
											],index,sectionTemp,type))

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
							openBatch ?
							<div>
								<span style={{width:'36px'}}>批次:</span>
								<Fragment>
									<Select
										showSearch
										key={item.get('uuid')}
										showArrow={false}
										placeholder='请选择/新增批次'
										dropdownClassName={`inventory-are-for-dom${index}`}
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
											open && dispatch(innerCalculateActions.getStockBatchList({
												inventoryUuid: isAssemblySheet ? item.get('materialUuid') : item.get('cardUuid'),
												sectionTemp,
												stockTemplate,
												index,
												materIndex,
											}))
										}}
										value={batchValue}
										onChange={(value,options) => {
											const valueList = value.split(Limit.TREE_JOIN_STR)
											const batchUuid = options.props.batchUuid
											const batch = valueList[0] || ''
											const expirationDate = valueList[1] ? valueList[1] : ''
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['batch']), batch))
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['batchUuid']), batchUuid))
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['expirationDate']), expirationDate))
											if(isClearSerialList){
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['serialList']),fromJS([]) ))
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['quantity']),'' ))
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['isModify']),true ))
												if(!noPrice){
													dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['amount']), ''))
												}
											}
											let noNeedPrice = false,moreUnit = false
											if(this.props.needHidePrice){
												noNeedPrice = true
												moreUnit = oriState !== 'STATE_CHYE_CH' ? (!(item.get('isOpenedQuantity') === 'true' && item.get('unit')  && !item.getIn(['unit','unitList']).size) ) : true
											}
											dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
												{
													cardUuid:item.get('cardUuid'),
													storeUuid: oriState === 'STATE_CHDB' ? this.props.warehouseUuid : item.get('warehouseCardUuid'),
													assistList: item.get('assistList') ? item.get('assistList').toJS() : [],
													batchUuid,
													noNeedPrice,
													moreUnit,
												}
											],index,sectionTemp,type))
										}}
									>
										{
											item.get('batchList') && item.get('batchList').map(w =>
												<Option
													key={w.get('batchUuid')}
													value={`${w.get('batch')}${Limit.TREE_JOIN_STR}${w.get('expirationDate')}`}
													batchUuid={w.get('batchUuid')}
													>
													{`${w.get('batch')}${openShelfLife && w.get('expirationDate')?`(${w.get('expirationDate')})`:''}`}
												</Option>
											)
										}
									</Select>
									{
										<span className='add-button' onClick={e => {
											e.preventDefault()
											this.setState({
												addBatch:true,
												addBatchChange: true
											})
										}}>新增</span>
									}
								</Fragment>
								<div className={`ls-batch-select-frame`} style={{display: addBatch ? '' : 'none'}} onClick={(e)=>{e.stopPropagation()}}>
									<div >
										<span><span style={{color:'red'}}>*</span>批次号：</span>
										<Input
											value={batchNumber}
											onChange={e => {
												e.preventDefault()
												const reg =  /^[0-9a-zA-Z]{0,16}$/
												if (reg.test(e.target.value)) {
													this.setState({batchNumber:e.target.value})

												} else {
													message.info('批次只支持输入16位以内的数字或字母')
												}
											}}
											placeholder='请输入批次号'

										/>
									</div>
									{
										openShelfLife ?
										<div>
											<span>生产日期：</span>
											<DatePicker
												placeholder='请选择生产日期'
												allowClear={false}
												size='small'
												value={batchDate ? moment(batchDate) : ''}
												dropdownClassName={`inventory-are-for-dom${index}`}
												onChange={value => {
													const date = value.format('YYYY-MM-DD')
													this.setState({batchDate:date})
												}}
											/>
										</div> : ''
									}
									{
										openShelfLife?
										<div>
											<span><span style={{color:'red'}}>*</span>截止日期：</span>
											<DatePicker
												placeholder='请选择生产日期'
												allowClear={false}
												size='small'
												value={expirationDate ? moment(expirationDate) : ''}
												dropdownClassName={`inventory-are-for-dom${index}`}
												onChange={value => {
													const date = value.format('YYYY-MM-DD')
													this.setState({expirationDate:date})
												}}
											/>
										</div>:''
									}
									{
										openShelfLife && (shelfLife || batchDate && expirationDate)?
										<div>
											<span></span>
											<div>{`(${shelfLife?`默认保质期：${shelfLife}天 `:''}${this.getCurShelfLife(batchDate,expirationDate)?`实际保质期：${this.getCurShelfLife(batchDate,expirationDate)}天`:''})`}</div>
										</div>:''
									}

									<div>
										<Button onClick={() => this.setState({addBatch:false})}>取消</Button>
										<Button
											type='primary'
											onClick={() => {
												dispatch(editRunningActions.insertBatch(batchNumber,batchDate,expirationDate,item.get('cardUuid'),
													(batch, batchUuid, expirationDate)=> {
														dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['batch']), batch))
														dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['batchUuid']), batchUuid))
														dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['expirationDate']), expirationDate))
														if(isClearSerialList){
															dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['serialList']),fromJS([]) ))
															dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['quantity']),'' ))
															dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['isModify']),true ))
															if(!noPrice){
																dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['amount']), ''))
															}
														}
														this.setState({addBatch:false,batchNumber:'',batchDate:'',expirationDate:''})
													}
												))
											}}
										>新增</Button>
									</div>
								</div>
							</div>:''
						}
						{
							// <div>
							// 	<Button
							// 		type='primary'
							// 		onClick={() => {
							// 			this.setState({focus:false})
							// 		}}
							// 	>确定</Button>
							// </div>
						}
					</div>
					{
						assistModal?
							<Modal
								visible
								title='新增属性'
								className='inventory-are-for-dom'
								onCancel={() => this.setState({assistModal:false})}
								onOk={() => {
									// const index = assistClassificationList.findIndex(z => z.get('uuid') === classificationUuid)
									dispatch(innerCalculateActions.insertAssist({
										classificationUuid,
										name: asssistName,
										inventoryUuid: item.get('cardUuid'),
										sectionTemp,
										stockTemplate,
										isAssembly: isAssemblySheet,
										index,
										materIndex,
										assIndex
									},(data,name) => {
										const curAssistItem = data.filter( v => v.name === name)
										const size = curAssistItem.length
										const childIndex = assistList ? assistList.findIndex(z => z.get('classificationUuid') === classificationUuid) : -1
										const propertyUuid = curAssistItem[0].uuid
										const propertyName = curAssistItem[0].name
										if (childIndex === -1) {
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['assistList']),assistList.concat(fromJS([{
												classificationUuid:classificationUuid,
												propertyUuid,
												propertyName
											}]))))

										} else {
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['assistList',assIndex,'propertyUuid']),propertyUuid))
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['assistList',assIndex,'propertyName']),propertyName))
										}
										if(isClearSerialList){
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['serialList']),fromJS([]) ))
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['quantity']),'' ))
											dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['isModify']),true ))
											if(!noPrice){
												dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, storagePlaceArr.concat(['amount']), ''))
											}
										}


										this.setState({assistModal:false,asssistName:'',assIndex:-1})
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
								dispatch(innerCalculateActions.modifyBatch({
									inventoryUuid: isAssemblySheet ? item.get('materialUuid') : item.get('cardUuid'),
									sectionTemp,
									stockTemplate,
									index,
									materIndex,
									batch: modifyBatch,
									batchUuid: modifyBatchUuid,
									productionDate: openShelfLife?modifyBatchDate:'',
									expirationDate: openShelfLife?modifyExpirationDate:'',
									isAssembly: isAssemblySheet,
								},() => {
									this.setState({batchModal:false})
								}))
							}}
							saveAndNewForbidden={true}
							batchList={item.get('batchList')}
							openShelfLife={openShelfLife}
							shelfLife={shelfLife}
						/>:''
					}
				</div>

				}
			</span>
		)
	}
}
