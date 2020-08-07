import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Dropdown, message, Modal,Tooltip,TreeSelect, Select, Input, DatePicker, Divider } from 'antd'
import { Icon } from 'app/components'
const { TreeNode } = TreeSelect;
import { fromJS } from 'immutable'
import moment from 'moment'

import thirdParty from 'app/thirdParty'
import { Export,Amount } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { numberCalculate,formatFour, numberFourTest, formatMoney, DateLib } from 'app/utils'
import { ROOTJR } from 'app/constants/fetch.constant.js'
import XfIcon from 'app/components/Icon'
import XfnSelect from 'app/components/XfnSelect'
import WarehouseTreeModal from './WarehouseTreeModal'
import CountStockModal from './CountStockModal'
import StockSingleModal from '../component//StockSingleModal'
import InputFour from 'app/components/InputFour'

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as allActions from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class UniformAdjustment extends React.Component{
	static displayName = 'Chye UniformAdjustment'
	constructor() {
		super()
		this.state = {
			showWarehouseModal: false,
			showStockModal: false,
			showSingleModal: false,
			checkable: false,
			unitPriceModal: false,
			selectIndex: 0,
			selectValue: '',
			inventoryUuid: '',

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
			curIndex: -1,
			curAssistClassificationList: fromJS([]),
			curItemOpenAssist: false,
			curItemOpenBatch: false,
			curWarehouseCardUuid: '',
			addBatchChange: false,

			selectTreeUuid: 'all',
            selectTreeLevel: 0,
		}
	}
	closeFocus = e => {
		let t = e.target || e.srcElement, list = [];
		let i = 1
		while(t.parentNode && i < 20) {
			if (t.parentNode.className && typeof t.parentNode.className === 'string' && t.parentNode.className.indexOf(`uniform-inventory-are-for-dom`) > -1) {
				// this.setState({focus:true})
				return
			}
			t = t.parentNode
			i++
		}
		this.setState({focus:false,addBatch: false,curIndex: -1,assistModal: false})
	}
	componentDidMount() {
		const body = document.getElementsByTagName("body")[0]
		body.addEventListener('click',this.closeFocus)
	}
	componentWillUnmount() {
		const body = document.getElementsByTagName("body")[0]
		body.removeEventListener('click',this.closeFocus)
	}
	render() {
		const {
			dispatch,
			returnBackFun,
			calculateViews,
			oriDate,
			BalanceTemp,
			insertOrModify,
			commonCardObj,
			enableWarehouse,
			homeState,
			enclosureCountUser,
		} = this.props
		const { showWarehouseModal, showStockModal, showSingleModal,checkable, unitPriceModal,selectIndex, selectValue,inventoryUuid, batchDate, expirationDate, batchNumber, focus, addBatch, batchModal, assistModal, asssistName,classificationUuid, assIndex, curIndex,curAssistClassificationList, curItemOpenAssist, curItemOpenBatch, curWarehouseCardUuid, addBatchChange,selectTreeUuid, selectTreeLevel } = this.state

		const showCount = calculateViews.get('showCount')
		const stockTitleName = calculateViews.get('stockTitleName')
		const countInsert = calculateViews.get('countInsert')
        const pdfInsertFirst = calculateViews.get('pdfInsertFirst')//首次保存pdf
		const selectI = calculateViews.get('selectI')
		const hasNumber = calculateViews.get('hasNumber')
        const singleUrl = calculateViews.get('singleUrl')
        const chooseWarehouseTreeList = calculateViews.get('warehouseTreeList')
		const countStockCardList = BalanceTemp.get('countStockCardList')
		const chooseIndex = countStockCardList.size
		const oriState = BalanceTemp.get('oriState')
		const warehouseTreeList = BalanceTemp.get('wareHouseCardList')
		const wareHouseCardList = BalanceTemp.get('wareHouseCardList') //所有仓库
		const allStockCardList = BalanceTemp.get('allStockCardList') //所有存货
		const stockCardList = BalanceTemp.get('stockCardList') //已选存货
		const chooseWareHouseCard = BalanceTemp.get('chooseWareHouseCard') //单选仓库
        const chooseStockCard = BalanceTemp.get('chooseStockCard') // 单选存货
        const oriStockCardList = BalanceTemp.get('oriStockCardList')
        const oriWarehouseCardList = BalanceTemp.get('oriWarehouseCardList')
		const oldChooseWareHouseCard = BalanceTemp.get('oldChooseWareHouseCard')
        const oldChooseStockCard = BalanceTemp.get('oldChooseStockCard')

		// 修改状态下已有的存货
        const oriWareHouseList = BalanceTemp.get('oriWareHouseList')
        const oriStockList = BalanceTemp.get('oriStockList')
        const warehouseSelectedKeys = BalanceTemp.get('warehouseSelectedKeys')
        const countWarehouseList = BalanceTemp.get('countWarehouseList')

		// 存货弹框
		const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const stockSelectedKeys = commonCardObj.get('selectedKeys')
        const cardPageObj = commonCardObj.get('cardPageObj')
        const wareHouseList = BalanceTemp.get('wareHouseList')
// 导出
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        const isPlay = homeState.getIn(['views', 'isPlay'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])

		const selectedKeys = enableWarehouse ? oriState === 'STATE_CHYE_CH' ? warehouseSelectedKeys.toJS() : chooseWareHouseCard ? [`${chooseWareHouseCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${chooseWareHouseCard.get('name')}${Limit.TREE_JOIN_STR}${chooseWareHouseCard.get('isUniform')}`] : [] : []

		let stockCardIdList = []
        stockCardList.map(v => stockCardIdList.push(v.get('cardUuid')))
		const singlethingsList = thingsList.size ? thingsList.filter(item => stockCardIdList.indexOf(item.get('uuid')) === -1) : fromJS([])

		let countstockCardIdList = [],uniformPriceUuidList = []
        countStockCardList && countStockCardList.map(v => {
            countstockCardIdList.push(v.get('cardUuid'))
			if(v.get('isUniformPrice')){
				uniformPriceUuidList.push(v.get('cardUuid'))
			}
        })

		let selectChildList = []
		const loop = (data, upperIndex,selectUuid) => data.map((item, i) => {
			if(selectUuid === item.uuid){
				selectChildList = item.childList ? item.childList : []
			}

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item.name}
					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.code}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.isUniform}`}
					key={item.uuid}
					// disabled={parentDisabled}
					>
                    {loop(item.childList, upperIndex + '_' + i)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
                value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.code}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.isUniform}${Limit.TREE_JOIN_STR}${true}`}
                key={item.uuid}
            />
        })
		let showAssistColumn = false
		countStockCardList && countStockCardList.map((item,index) => {
			showAssistColumn = item.getIn(['financialInfo','openAssist']) || item.getIn(['financialInfo','openBatch']) || showAssistColumn
		})

		return (
			<div className="count-adjustment-mask import-mask" style={{display: showCount ? 'block' : 'none'}}>
				<div className='count-container'>
					<div className='count-inventory'>

						<div className='count-inventory-content' style={{marginTop: '10px'}}>
							<div className={showAssistColumn ? 'count-inventory-area-title-assist' : 'count-inventory-area-title'}>
								<span>仓库</span>
								{
									showAssistColumn ? <span>属性|批次</span> : null
								}

								<span>数量</span>
								<span>调整前单价</span>
								<span>调整后单价</span>
								<span>调整金额</span>
								<span></span>
							</div>

							{
								countStockCardList && countStockCardList.map((item,index) => {
									let cardValue = ''
									const assistList = item.get('assistList') || fromJS([])
									const openBatch = item.getIn(['financialInfo','openBatch'])
									const openAssist = item.getIn(['financialInfo','openAssist'])
									const openShelfLife = item.getIn(['financialInfo','openShelfLife'])
									const assistClassificationList = item.getIn(['financialInfo','assistClassificationList']) || fromJS([])
									const batchItem = (item.get('batchList') || fromJS([])).find(z => z.get('batchUuid') === item.get('batchUuid') || z.get('batch') === item.get('batch')) || fromJS({})
									const batchValue = batchItem.get('batch') || item.get('batch')?`${batchItem.get('batch') || item.get('batch')}${openShelfLife && batchItem.get('expirationDate') && batchItem.get('expirationDate') !== 'undefined' ?`(${batchItem.get('expirationDate')})`:openShelfLife &&  item.get('expirationDate') && item.get('expirationDate') !== 'undefined' ? `(${item.get('expirationDate')})` : ''}`:undefined

									if (openAssist && openBatch) {
										cardValue = `${assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'} | ${item.get('batch')?batchValue:'批次'}`
									} else if (openAssist || openBatch) {
										cardValue =  openAssist ?
										assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():'属性'
										:item.get('batch')?batchValue:'批次'
									} else {
										cardValue = item.get('code') ?`${ item.get('code')?item.get('code'):''} ${item.get('name') ? item.get('name'):''}`:undefined
									}
									let amount = 0
									return <div className={`${showAssistColumn ? 'count-inventory-area-stock-assist' : 'count-inventory-area-stock'} count-inventory-childList`}>
										<div className="count-unit-title">
											<span>调整存货({index+1})</span>
											<span>单价仓库</span>
											{showAssistColumn ? <span></span> : null }
											<span></span>
											<span>统一单价</span>
											<span></span>
											<span></span>
										</div>
										<div className={showAssistColumn ? 'count-unit-stock-assist' : "count-unit-stock"}>
											<span className={`${showAssistColumn ? 'count-unit-stock-box-assist' : 'count-unit-stock-box'} uniform-inventory-are-for-dom`}>
												<span
													className={`${countInsert ? 'count-unit-stock-insert' : 'count-unit-stock-modify'} `}
													style={{border: 'none'}}
													onClick={()=>{
														if(countInsert){
															this.setState({
																showSingleModal : true,
																selectIndex: index,
															})
															dispatch(editCalculateActions.getStockCardCategoryAndList({
																isUniform: null,
																openQuantity: true,
																warehouseUuid: '',
																oriDate,
																haveQuantity: hasNumber,
																type: 'count',
																currentPage: 1,
															}))
														}

													}}
												>
													{`${item.get('code')} ${item.get('name')}`}
													{
														countInsert ? <XfIcon type='edit-pen'/> : null
													}
												</span>
												{
                                                    openAssist || openBatch ?
                                                    <span
                                                        onClick={(e)=>{
                                                            this.setState({
                                                                focus: true,
																curIndex: index,
                                                            })
                                                        }}
                                                    >
                                                        {cardValue}
                                                    </span> : null
                                                }
												{
													<div
														className='assembly-produce-drop-content uniform-adjustment-drop-content'
														style={{display:focus && curIndex === index ?'':'none'}}
														ref={(node) => this.nameInput = node}
														onClick={(e)=>{
															e.stopPropagation()
															addBatchChange && this.setState({addBatch: false,addBatchChange:false})
														}}
														>
														{
															openAssist ?
															<div>
																<span>属性:</span>
																{
																	assistClassificationList.map((w,i) =>
																		<Select
																			key={w.get('uuid')}
																			dropdownClassName={`uniform-inventory-are-for-dom${i}`}
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
																				let newAssistList = fromJS([])
																				if (size === 0) {
																					newAssistList = fromJS([{
																						classificationUuid:w.get('uuid'),
																						classificationName:w.get('name'),
																						propertyUuid,
																						propertyName
																					}])
																					dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'assistList'],fromJS(newAssistList)))
																				} else if (childIndex === -1) {
																					newAssistList = assistList.concat(fromJS([{
																						classificationUuid:w.get('uuid'),
																						classificationName:w.get('name'),
																						propertyUuid,
																						propertyName
																					}]))
																					dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'assistList',size],fromJS({
																						classificationUuid:w.get('uuid'),
																						classificationName:w.get('name'),
																						propertyUuid,
																						propertyName
																					})))

																				} else {
																					newAssistList = assistList.updateIn([i,'propertyUuid'],v => propertyUuid).updateIn([i,'propertyName'],v=> propertyName)
																					dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'assistList',i,'propertyUuid'],propertyUuid))
																					dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'assistList',i,'propertyName'],propertyName))
																				}
																				const oldAssistList = BalanceTemp.getIn(['countStockCardList',index,'assistList']) ? BalanceTemp.getIn(['countStockCardList',index,'assistList']).toJS() : []

																				// assistList.map((item,k) => {
																				// 	if(k === i){
																				// 		newAssistList.push({
																				// 			...(item.toJS()),
																				// 			propertyUuid,
																				// 			propertyName,
																				// 		})
																				// 	}else{
																				// 		newAssistList.push(item.toJS())
																				// 	}
																				// })

																				if(assistClassificationList.size === newAssistList.size && ( openBatch && countStockCardList.getIn([index,'batch']) || !openBatch) && countStockCardList.getIn([index,'warehouseCardUuid'])){
																					dispatch(editCalculateActions.getBalanceUniformPrice({
																						inventoryUuid: countStockCardList.getIn([index,'uuid']),
																						oriDate,
																						warehouseUuid: countStockCardList.getIn([index,'warehouseCardUuid']),
																						batchUuid: countStockCardList.getIn([index,'batchUuid']),
																						assistList: newAssistList.toJS(),
																						selectIndex: index,
																						temp: 'BalanceTemp',
																						stockCardTemp: 'countStockCardList'

																					}))
																				}

																			}}
																		>

																			<Option key={w.get('uuid')} value={`${Limit.TREE_JOIN_STR}全部${w.get('name')}`}>
																				{`全部${w.get('name')}`}
																			</Option>
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
															</div>:''
														}
														{
															openBatch ?
															<div style={{position:'relative'}}>
																<span>批次:</span>
																<Fragment>
																	<Select
																		showSearch
																		key={item.get('uuid')}
																		showArrow={false}
																		placeholder='请选择/新增批次'
																		dropdownClassName={`uniform-inventory-are-for-dom${index}`}
																		dropdownRender={menu => (
																			<div>
																				{menu}
																				<Divider style={{ margin: '4px 0' }} />
																				<div
																					style={{ padding: '4px 8px', cursor: 'pointer' }}
																					onMouseDown={e => e.preventDefault()}
																					onClick={() => this.setState({batchModal:true})}
																				>
																					<XfIcon type='edit-pen'/>修改批次信息
																				</div>
																			</div>
																		)}
																		onDropdownVisibleChange={(open)=> {
																			open && dispatch(innerCalculateActions.getStockBatchList({
																				inventoryUuid:item.get('cardUuid'),
																				sectionTemp:'Balance',
																				stockTemplate: 'countStockCardList',
																				index
																			}))
																		}}
																		value={batchValue}
																		onChange={(value,options) => {
																			const valueList = value.split(Limit.TREE_JOIN_STR)
																			const batchUuid = options.props.batchUuid
																			const batch = valueList[0] || ''
																			const expirationDate = valueList[1]
																			dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'batch'], batch))
																			dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'batchUuid'], batchUuid))
																			dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'expirationDate'], expirationDate))
																			if( (openAssist && countStockCardList.getIn([index,'assistList']).size === assistClassificationList.size || !openAssist) && countStockCardList.getIn([index,'warehouseCardUuid']) ){
																				dispatch(editCalculateActions.getBalanceUniformPrice({
																					inventoryUuid: countStockCardList.getIn([index,'uuid']),
																					oriDate,
																					warehouseUuid: countStockCardList.getIn([index,'warehouseCardUuid']),
																					batchUuid,
																					assistList: countStockCardList.getIn([index,'assistList']),
																					selectIndex: index,
																					temp: 'BalanceTemp',
																					stockCardTemp: 'countStockCardList'

																				}))
																			}

																		}}
																	>

																	<Option
																		key={'uniformtotal'}
																		value={`全部批次${Limit.TREE_JOIN_STR}`}
																		batchUuid={''}
																		>
																		全部批次
																	</Option>
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
																	openShelfLife?
																	<div>
																		<span><span style={{color:'red'}}>*</span>截止日期：</span>
																		<DatePicker
																			placeholder='请选择生产日期'
																			allowClear={false}
																			size='small'
																			value={expirationDate ? moment(expirationDate) : ''}
																			onChange={value => {
																				const date = value.format('YYYY-MM-DD')
																				this.setState({expirationDate:date})
																			}}
																		/>
																	</div>:''
																}
																{
																	openShelfLife ?
																	<div>
																		<span>生产日期：</span>
																		<DatePicker
																			placeholder='请选择生产日期'
																			allowClear={false}
																			size='small'
																			value={batchDate ? moment(batchDate) : ''}
																			onChange={value => {
																				const date = value.format('YYYY-MM-DD')
																				this.setState({batchDate:date})
																			}}
																		/>
																	</div> : ''
																}

																<div>
																	<Button onClick={() => this.setState({addBatch:false})}>取消</Button>
																	<Button
																		type='primary'
																		onClick={() => {
																			dispatch(editRunningActions.insertBatch(batchNumber,batchDate,expirationDate,item.get('cardUuid'),(json)=> {
																				const batchUuid = json.batchUuid
																				const batch = json.batch
																				const expirationDate = json.expirationDate
																				dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'batch'], batch))
																				dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'batchUuid'], batchUuid))
																				dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'expirationDate'], expirationDate))
																				if( (openAssist && countStockCardList.getIn([index,'assistList']).size === assistClassificationList.size || !openAssist ) && countStockCardList.getIn([index,'warehouseCardUuid']) ){
																					dispatch(editCalculateActions.getBalanceUniformPrice({
																						inventoryUuid: countStockCardList.getIn([index,'uuid']),
																						oriDate,
																						warehouseUuid: countStockCardList.getIn([index,'warehouseCardUuid']),
																						batchUuid,
																						assistList: countStockCardList.getIn([index,'assistList']),
																						selectIndex: index,
																						temp: 'BalanceTemp',
																						stockCardTemp: 'countStockCardList'

																					}))
																				}

																				this.setState({addBatch:false,batchNumber:'',expirationDate:'', batchDate:''})
																			}))
																		}}
																	>新增</Button>
																</div>
															</div>
															</div>:''
														}
													</div>
												}
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
																	sectionTemp: 'Balance',
																	stockTemplate: 'countStockCardList',
																	index,
																	assIndex
																},(data,name) => {
																	const curAssistItem = data.filter( v => v.name === name)
																	const size = assistList.size
																	const childIndex = assistList.findIndex(z => z.get('classificationUuid') === classificationUuid)
																	const propertyUuid = curAssistItem[0].uuid
																	const propertyName = curAssistItem[0].name
																	if (childIndex === -1) {
																		dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'assistList'],assistList.concat(fromJS([{
																			classificationUuid,
																			propertyUuid,
																			propertyName
																		}]))))

																	} else {
																		dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'assistList',assIndex,'propertyUuid'],propertyUuid))
																		dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',index,'assistList',assIndex,'propertyName'],propertyName))
																	}
																	const oldAssistList = BalanceTemp.getIn(['countStockCardList',index,'assistList']).toJS() || []
																	let newAssistList = []
																	assistList.map((item,k) => {
																		if(k === assIndex){
																			newAssistList.push({
																				...item,
																				propertyUuid,
																				propertyName,
																			})
																		}else{
																			newAssistList.push(item)
																		}
																	})
																	if(assistClassificationList.size === newAssistList.length && ( openBatch && countStockCardList.getIn([index,'batch']) || !openBatch) && countStockCardList.getIn([index,'warehouseCardUuid'])){
																		dispatch(editCalculateActions.getBalanceUniformPrice({
																			inventoryUuid: countStockCardList.getIn([index,'uuid']),
																			oriDate,
																			warehouseUuid: countStockCardList.getIn([index,'warehouseCardUuid']),
																			batchUuid: countStockCardList.getIn([index,'batchUuid']),
																			assistList: fromJS(newAssistList),
																			selectIndex: index,
																			temp: 'BalanceTemp',
																			stockCardTemp: 'countStockCardList'

																		}))
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
																inventoryUuid: item.get('cardUuid'),
																sectionTemp: 'Balance',
																stockTemplate: 'countStockCardList',
																index,
																batch: modifyBatch,
																batchUuid: modifyBatchUuid,
																productionDate: openShelfLife?modifyBatchDate:'',
																expirationDate: openShelfLife?modifyExpirationDate:'',
															},() => {
																this.setState({batchModal:false})
															}))
														}}
														saveAndNewForbidden={true}
														batchList={item.get('batchList')}
														openShelfLife={openShelfLife}
													/>:''
												}
											</span>

											{
												<span className={countInsert ? 'count-unit-stock-insert' : 'count-unit-stock-modify'}
													onClick={()=>{
														if(countInsert){
															this.setState({
																showWarehouseModal: true,
																checkable: false,
																selectIndex: index,
																inventoryUuid:  item.get('cardUuid'),
																curAssistClassificationList:assistClassificationList,
																curItemOpenAssist: openAssist,
																curItemOpenBatch: openBatch,
																curWarehouseCardUuid: item.get('warehouseCardUuid')
															})

															// dispatch(editCalculateActions.getCanUseWarehouseCardList({
															// 	temp: 'BalanceTemp',
															// 	isUniform: item.get('isUniformPrice'),
															// 	inventoryUuid: item.get('cardUuid'),
															// 	uniformUuid:'',
															// 	oriDate,
															// 	conditionType: 'QUANTITY_OR_BALANCE',
															// 	canUse: true,
															// }))
														}


													}}
												>
													{item.get('warehouseCardCode') || item.get('warehouseCardName') ? `${item.get('warehouseCardCode') ? item.get('warehouseCardCode') : ''} ${item.get('warehouseCardName') ? item.get('warehouseCardName') : ''}` : '请选择仓库'}
													{
														countInsert ? <XfIcon type='edit-pen'/> : null
													}
												</span>

											}

											<span className={countInsert ? 'count-unit-stock-insert' : 'count-unit-stock-modify'}
												onClick={()=>{
													if(countInsert){
														this.setState({
															unitPriceModal: true,
															selectIndex: index,
															selectValue: item.get('price')
														})
													}

												}}
											>
												<span>{formatFour(item.get('price'))}</span>
												{
													countInsert ? <XfIcon type='edit-pen'/> : null
												}
											</span>
											<span>元/{item.getIn(['unit','name'])}</span>
											{
												countInsert ?
												<XfIcon
													type="bigDel"
													theme="outlined"
													onClick={() => {
														if(countStockCardList.size > 1){
															dispatch(editCalculateActions.deleteStockList(countStockCardList, index, 'delete','Balance','countStockCardList'))
														}else{
															Modal.confirm({
																title: '确认',
																content: "该存货列表将被清空，是否确认删除",
																okText: '确认',
																cancelText: '取消',
																onOk:()=>{
																	dispatch(editCalculateActions.deleteStockList(countStockCardList, index, 'delete','Balance','countStockCardList'))
																}
															})
														}

													}}
												/>
												: ''
											}

										</div>
										<div className="count-unit-stock-child">
											{
												item.get('childList') && item.get('childList').size && item.get('childList').map(v => {

													const assistValueChild = v.get('assistList') && v.get('assistList').some(w => w.get('propertyName'))? v.get('assistList').map(w => w.get('propertyName')).join():''
													const batchValueChild = v.get('batch') ? v.get('batch') : ''

													amount = numberCalculate(amount,v.get('amount'))
													return  <div className="count-unit-list">
																<span>{`${v.get('warehouseCode')} ${v.get('warehouseName')}`}</span>
																{
																	showAssistColumn ? (openAssist || openBatch) ?
																	<span>{`${assistValueChild ? assistValueChild : ''} ${batchValueChild && assistValueChild  ? `|${batchValueChild}` : batchValueChild ? batchValueChild : ''}`}</span> : <span style={{border:'none'}}></span>:
																	null
																}
																<span>{v.get('quantity')? formatFour(v.get('quantity')) : 0}</span>
																<span>{v.get('price') ? formatFour(v.get('price')) : 0}</span>
																<span>{item.get('price') ? formatFour(item.get('price')) : 0}</span>
																<span>{formatMoney(v.get('amount'))}</span>
																<span></span>
															</div>
												}) || ''
											}
											<div className='count-unit-stock-total'><span>调整金额合计：</span><Amount>{amount}</Amount></div>
										</div>



									</div>
								})
							}


							{

								<div className='count-inventory-button'>
									<Button
										onClick={() => {
											this.setState({
												showStockModal: true
											})
											dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
											dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))
											dispatch(editCalculateActions.getStockCardCategoryAndList({
												isUniform: null,
												openQuantity: true,
												warehouseUuid: '',
												oriDate,
												haveQuantity: hasNumber,
												type: 'count',
												currentPage: 1,

											}))

										}}
									>
										<XfIcon type='editPlus'/>{`批量添加存货`}
									</Button>
								</div>
							}

						</div>
						<div className="count-bottom-btn title-right">
						{
							!countInsert ?
							<Button key="print" type="ghost" size="large"
								onClick={() => {
									if(singleUrl){
										thirdParty.openLink({
											url: singleUrl
										})
									}else{
										message.info('暂无可打印的内容')
									}
								}}
							>
								打印
							</Button> : null
						}
						{
							countInsert ?
							<Tooltip title={!countStockCardList.size ? '请录入盘点数据' : '保存后将生成PDF文件'}>
								<Button
									disabled={!countStockCardList.size}
									className="count-adjustment-mask-btn"
									onClick={() => {
										let canSave = true,messageList = '', noRepeatList = []
										countStockCardList && countStockCardList.size &&  countStockCardList.toJS().map((item,index) => {
											if((!item.isUniformPrice && !item.warehouseCardUuid) || !Number(item.price)){
												canSave = false,
												messageList = '调整存货未填写完整信息'
												return
											}
											if(!item.isUniformPrice){
												if(noRepeatList.indexOf(`${item.warehouseCardUuid}+${item.cardUuid}`) > -1){
													const oldIndex = noRepeatList.findIndex(v => v === `${item.get('warehouseCardUuid')}+${item.get('cardUuid')}`)
													canSave = false,
													messageList = `调整存货(${index})和调整存货(${oldIndex})的调整数据重复 `
													return
												}else{
													noRepeatList.push(`${item.warehouseCardUuid}+${item.cardUuid}`)
												}
											}else{
												if(noRepeatList.indexOf(item.cardUuid) > -1){
													canSave = false,
													messageList = `【${item.code} ${item.name}】统一单价的存货不支持重复选择 `
													return
												}else{
													noRepeatList.push(item.cardUuid)
												}
											}

										})
										if(canSave){
											const cantSave = enclosureCountUser > 8 ? true : false
											dispatch(editCalculateActions.saveAdjustmentEnclosure(countStockCardList,oriDate,pdfInsertFirst,cantSave,(url)=>{
												Modal.confirm({
													title: '保存失败',
													content: "流水附件达到上限9个，无法新增附件，您可通过'打印'保存盘点单",
													okText: '打印',
													cancelText: '取消',
													onOk:()=>{
														thirdParty.openLink({
															url: url
														})

													}
												})
											},oriState))
											dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'countInsert', false))
											dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'pdfInsertFirst', false))
										}else{
											message.info(messageList)
										}

									}}>
									保存盘点单
								</Button>
							</Tooltip> :
							<Button
								className="count-adjustment-mask-btn"
								onClick={() => {

									dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'countInsert', true))
								}}>
								修改盘点单
							</Button>
						}

							<Button
								className="count-adjustment-mask-btn"
								onClick={() => {
									dispatch(innerCalculateActions.saveCountList([],[],false))
									dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp',isUniform:false}))
									this.setState({
										checkable: false
									})
									returnBackFun()
								}}>
								取消
							</Button>
							<Button
								className="count-adjustment-mask-btn"
								onClick={() => {
									let newCountStockCardList = [], hasNoQuantity = false
									let canSave = true,messageList = '', noRepeatList = [],noRepeatStock = []
									countStockCardList && countStockCardList.size &&  countStockCardList.toJS().map((item,index) => {
										if(!Number(item.price)){
											canSave = false,
											messageList = '调整存货未填写完整信息'
											return
										}
										if(!item.isUniformPrice){
											if(noRepeatList.indexOf(`${item.warehouseCardUuid}+${item.cardUuid}`) > -1){
												const oldIndex = noRepeatList.findIndex(v => v === `${item.get('warehouseCardUuid')}+${item.get('cardUuid')}`)
												canSave = false,
												messageList = `调整存货(${index})和调整存货(${oldIndex})的调整数据重复 `
												return
											}else{
												noRepeatList.push(`${item.warehouseCardUuid}+${item.cardUuid}`)
											}
										}else{
											if(noRepeatList.indexOf(item.cardUuid) > -1){
												canSave = false,
												messageList = `【${item.code} ${item.name}】统一单价的存货不支持重复选择 `
												return
											}else{
												noRepeatList.push(item.cardUuid)
											}
										}
										let chidItem = []
										item.childList && item.childList.map(k => {
											Number(k.amount) !== 0 && chidItem.push({
												...item,
												...k,
												name: item.name,
												code: item.code,
												cardUuid: item.cardUuid,
												warehouseCardCode: k.warehouseCode,
												warehouseCardName: k.warehouseName,
												warehouseCardUuid: k.warehouseUuid,
												price: numberCalculate(item.price,k.price,2,'subtract'),
												referenceQuantity: k.quantity,
												amount: k.amount,
												quantity:'',
												unitUuid:'',
												unitName:'',
											})
										})

										newCountStockCardList = newCountStockCardList.concat(chidItem)

									})
									if(canSave){
										dispatch(editCalculateActions.changeEditCalculateCommonState('BalanceTemp', 'stockCardList', fromJS(newCountStockCardList)))
										dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
										dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))
										dispatch(editCalculateActions.changeEditCalculateCommonState('BalanceTemp', 'countStockCardList', fromJS([])))
										dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp',isUniform:false}))
										this.setState({
											checkable: false
										})
										returnBackFun()
									}else{
										message.info(messageList)
									}
								}}>
								确定
							</Button>
						</div>

					</div>
					<div className='count-right'></div>
				</div>


				<WarehouseTreeModal
					treeList={chooseWarehouseTreeList}
					showWarehouseModal={showWarehouseModal}
					onClose={() => this.setState({showWarehouseModal:false})}
					dispatch={dispatch}
					selectedKeys={selectedKeys}
					countStockCardList={countStockCardList}
					countstockCardIdList={countstockCardIdList}
					checkable={checkable}
					canClick={true}
					needTotal={true}
					onSelect={(uuid,code,name,isUniform,selectChildList,price)=>{
						this.setState({
							checkable: false
						})
						loop(selectChildList)

						// dispatch(editCalculateActions.getCanUseWarehouseCardList({
						// 	temp: 'BalanceTemp',
						// 	isUniform: false,
						// 	inventoryUuid,
						// 	uniformUuid: uuid,
						// 	oriDate,
						// 	conditionType: 'QUANTITY_OR_BALANCE',
						// 	canUse: true,
						// 	cardFrom: 'count',
						// 	selectIndex,
						// 	stockCardTemp: 'countStockCardList'
						// }))
						const batchUuid = countStockCardList.getIn([selectIndex,'batchUuid']) || ''
						const batch = countStockCardList.getIn([selectIndex,'batch']) || ''
						const assistList = countStockCardList.getIn([selectIndex,'assistList']) || fromJS([])
						if((assistList.size === curAssistClassificationList.size && curItemOpenAssist || !curItemOpenAssist ) && (batch && curItemOpenBatch || !curItemOpenBatch) ){
							dispatch(editCalculateActions.getBalanceUniformPrice({
								inventoryUuid,
								oriDate,
								warehouseUuid: uuid,
								batchUuid,
								assistList,
								selectIndex,
								temp: 'BalanceTemp',
								stockCardTemp: 'countStockCardList'

							}))
						}

						dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',selectIndex,'price'], price))
						dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',selectIndex,'warehouseCardCode'], code))
						dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',selectIndex,'warehouseCardName'], name))
						dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',selectIndex,'warehouseCardUuid'], uuid))

					}}
					onCheck={()=>{}}

				/>
				<CountStockModal
					showCommonChargeModal={this.state.showStockModal}
					MemberList={memberList}
					thingsList={thingsList}
					dispatch={dispatch}
					oriDate={oriDate}
					oriState={oriState}
					// categoryTypeObj={categoryTypeObj}
					selectedKeys={stockSelectedKeys}
					selectItem={selectItem}
					selectList={selectList}
					stockCard={countStockCardList}
					stockCardIdList={countstockCardIdList}
					showSelectAll={true}
					notNeedChangeStockItem={true}
					temp='Balance'
					hasNumber={hasNumber}
					stockTemplate={'countStockCardList'}
					needConcat={true}
					cancel={() => {
						this.setState({ showStockModal: false })
					}}
					getNumberCallback={(haveQuantity,uuid,level)=>{
						if (uuid === 'all') {
							dispatch(editCalculateActions.getStockCardCategoryAndList({
								isUniform: null,
								openQuantity: true,
								warehouseUuid: '',
								oriDate,
								haveQuantity,
								type: 'count'
							}))
						} else {
							dispatch(editCalculateActions.getStockSomeCardList({uuid, level, isUniform: null, openQuantity: true,warehouseUuid:'',haveQuantity,type:'count'}))
						}
					}}
					selectTreeFunc={(uuid, level) => {
						this.setState({
							selectTreeUuid: uuid,
							selectTreeLevel: level
						})
						if (uuid === 'all') {
							dispatch(editCalculateActions.getStockCardCategoryAndList({
								isUniform: null,
								openQuantity: true,
								warehouseUuid: '',
								oriDate,
								haveQuantity: hasNumber,
								type: 'count',
								currentPage: 1,
							}))
						} else {
							dispatch(editCalculateActions.getStockSomeCardList({uuid, level, isUniform: null, openQuantity: true,warehouseUuid:'',haveQuantity: hasNumber,type:'count',currentPage: 1}))
						}
					}}
					callback={(selectItem) => {
						const chooseWareHouseCardUuid = !enableWarehouse  ? '' : chooseWareHouseCard.get('cardUuid')
						let selectUuidList = [],uniformSelectList=[],stockName = []

						const countIndex = countStockCardList.size
						let newStockList = countStockCardList.toJS()

						selectItem && selectItem.size && selectItem.map((item, index) => {
							const name = `${item.get('code')} ${item.get('name')}`
							if(uniformPriceUuidList.indexOf(item.get('uuid')) === -1){
								if(item.get('isUniformPrice')){
									uniformSelectList.push(item.get('uuid'))
									selectUuidList.push({
										cardUuid: item.get('uuid'),
										storeUuid: '',
										isUniformPrice: item.get('isUniformPrice'),
										index: index,
									})

								}
								const assistClassificationList = item.getIn(['financialInfo','assistClassificationList']) || fromJS([])
								let assistList = []
								assistClassificationList && assistClassificationList.map(v => {
									// assistList.push({
									// 	propertyUuid: '',
									// 	propertyName: `全部${v.get('name')}`,
									// 	classificationName: v.get('name'),
									// 	classificationUuid: v.get('uuid')
									// })
								})
								newStockList.push({
									...(item.toJS()),
									// assistList
								})
							}else{
								stockName.push(name)
							}

						})
						if(stockName.length > 0){
							message.info(`${stockName}已在列表中，统一单价的存货不支持重复选择`)
						}

						// if(uniformSelectList.length > 0){
						// 	dispatch(editCalculateActions.getWarehouseLastStage(uniformSelectList,oriDate,selectUuidList, 'BalanceTemp'))
						// }
						dispatch(editCalculateActions.changeSelectStock(fromJS(newStockList),'Balance','countStockCardList',true))


					}}
					cardPageObj={cardPageObj}
					paginationCallBack={(value)=>{
						if (selectTreeUuid === 'all') {
							dispatch(editCalculateActions.getStockCardCategoryAndList({
								isUniform: null,
								openQuantity: true,
								warehouseUuid: '',
								oriDate,
								haveQuantity: hasNumber,
								type: 'count',
								currentPage: value,
							}))
						} else {
							dispatch(editCalculateActions.getStockSomeCardList({uuid: selectTreeUuid, level: selectTreeLevel, isUniform: null, openQuantity: true,warehouseUuid:'',haveQuantity: hasNumber,type:'count',currentPage: value}))
						}
					}}

				/>

				<StockSingleModal
					dispatch={dispatch}
					showSingleModal={showSingleModal}
					MemberList={memberList}
					thingsList={singlethingsList}
					selectedKeys={stockSelectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : stockSelectedKeys}
					stockCardList={stockCardList}
					title={'选择存货'}
					selectFunc={(item, cardUuid) => {
						const code = item.code
						const name = `${item.code} ${item.name}`
						const isOpenedQuantity = item.isOpenedQuantity
						const isUniformPrice = item.isUniformPrice
						const allUnit = item.unit ? item.unit : ''
						const selectItem = countStockCardList.get(selectIndex).toJS()
						const selectUuid = countStockCardList.getIn([selectIndex,'cardUuid'])
						const newUniformPriceUuidList = uniformPriceUuidList

						const uniformPriceLength =  newUniformPriceUuidList.filter(v => v !== selectUuid) //去除原本uuid

						const newItem = {
							...item,
							cardUuid,
							name: item.name,
							code,
							isOpenedQuantity,
							isUniformPrice,
							allUnit,
							amount: ''
						}
						const selectUuidList =[{
							cardUuid,
							storeUuid: '',
							assistList: item.assistList,
							batchUuid: item.batchUuid,
							isUniformPrice,
						}]
						if(isUniformPrice && uniformPriceLength.indexOf(cardUuid) > -1){
							message.info(`${name}已在列表中，统一单价的存货不支持重复选择`)
						}else{
							dispatch(innerCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList', selectIndex], fromJS(newItem)))
							if(isUniformPrice){
								dispatch(editCalculateActions.getWarehouseLastStage([cardUuid],oriDate,selectUuidList, 'BalanceTemp',selectIndex,true))
							}

						}
						this.setState({
							showSingleModal : false
						})
					}}
					cancel={()=>{
						this.setState({
							showSingleModal : false
						})
					}}

					selectListFunc={(uuid, level) => {
						const isUniform = null
						const openQuantity =  true
						this.setState({
							selectTreeUuid: uuid,
							selectTreeLevel: level
						})
						if (uuid === 'all') {
							dispatch(editCalculateActions.getStockCardList('BalanceTemp', isUniform, openQuantity,'',1))
						} else {
							dispatch(editCalculateActions.getStockSomeCardList({uuid, level, isUniform, openQuantity,currentPage: 1}))
						}

					}}
					cardPageObj={cardPageObj}
					paginationCallBack={(value)=>{
						const isUniform = null
						const openQuantity =  true
						if (selectTreeUuid === 'all') {
							dispatch(editCalculateActions.getStockCardList('BalanceTemp', isUniform, openQuantity,'',value))
						} else {
							dispatch(editCalculateActions.getStockSomeCardList({uuid: selectTreeUuid, level: selectTreeLevel, isUniform, openQuantity,currentPage: value}))
						}
					}}
				/>

				<Modal
                    visible={unitPriceModal}
                    title={'修改统一单价'}
                    onCancel={() => {this.setState({unitPriceModal:false})}}
                    onOk={() => {
						if(Number(selectValue) > 0){
							dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',selectIndex,'price'], selectValue))
							const childList = countStockCardList.getIn([selectIndex,'childList'])
							if(childList && childList.size){
								childList.map((v,i) => {
									dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',selectIndex,'childList',i,'afterPrice'], selectValue))
									const amount = numberCalculate(numberCalculate(selectValue,v.get('quantity'),4,'multiply'),v.get('oldAmount'),4,'subtract')
									dispatch(editCalculateActions.changeEditCalculateCommonString('Balance', ['countStockCardList',selectIndex,'childList',i,'amount'], amount))
								})
							}
							this.setState({
								unitPriceModal: false,
								selectValue: '',
							})
						}else{
							message.info('统一单价不可为0或负数')
						}

                    }}
                >
                    <div style={{display:'flex'}}>
                        <span style={{width:'100px',lineHeight:'28px'}}>单价：</span>
						<InputFour
							value={selectValue}
							onChange={(e)=>{
								numberFourTest(e, (value) => {
									this.setState({
										selectValue: value
									})
								}, true)
							}}
						/>

                    </div>
                </Modal>
			</div>
		)
	}
}
