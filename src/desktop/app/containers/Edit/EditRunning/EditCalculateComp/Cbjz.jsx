import React, { Fragment } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Radio, Switch, message, Icon, Button, Tooltip } from 'antd'
const { Search } = Input
import NumberInput from './component/NumberInput'
import XfIcon from 'app/components/Icon'
import { formatMoney, formatDate,formatFour, numberCalculate, numberFourTest } from 'app/utils'
const RadioGroup = Radio.Group
const Option = Select.Option
import { TableBody, TableTitle, TableItem, TableAll, TableOver, Amount, TableBottomPage } from 'app/components'
// import StockModal from './component/StockModal'
import moment from 'moment'

import StockSingleModal from './component/StockSingleModal'
import CategorySelect from './component/CategorySelect'
import  PayCategorySelect  from './component/PayCategorySelect'
import Inventory from './stock/Inventory'
import { numberTest } from '../common/common'
import InputFour from 'app/components/InputFour'
import { getUuidList } from './component/CommonFun'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import { editRunningAllActions } from 'app/redux/Edit/EditRunning/runningAll.js'


@immutableRenderDecorator
export default
	class Cbjz extends React.Component {

	static displayName = 'Cbjz'

	constructor() {
		super()
		this.state = {
			index: 0,
			selectTreeUuid: 'all',
            selectTreeLevel: 0,
		}
	}
	componentDidMount() {
		const CostTransferTemp = this.props.CostTransferTemp
		const oriState = CostTransferTemp.get('oriState')
		const oriDate = this.props.oriDate
		if (this.props.needSendRequest && this.props.insertOrModify === 'insert') {
			this.props.dispatch(editCalculateActions.getCostTransferList(oriState, oriDate, [],[],[],'',1))
			this.props.dispatch(editCalculateActions.getCarryoverCategory(oriDate, oriState))
			this.props.dispatch(editRunningAllActions.changeEditCalculateNeedSendRequest())
		}
	}

	render() {

		const {
			CostTransferTemp,
			dispatch,
			disabledDate,
			// accountConfState,
			insertOrModify,
			hideCategoryList,
			flags,
			panes,
			calculateViews,
			runningCategory,
			disabledBeginDate,
			commonCardObj,
			enableWarehouse,
			openQuantity,
			serialList,
		} = this.props
		const { selectTreeUuid, selectTreeLevel } = this.state
		const selectI = calculateViews.get('selectI')
		const selectAllItem = calculateViews.get('selectItem')
		const selectAllList = calculateViews.get('selectList')
		const uuidList = CostTransferTemp.get('uuidList')
		const jrIndex = CostTransferTemp.get('jrIndex')
		const categoryUuid = CostTransferTemp.get('categoryUuid')
		const oriState = CostTransferTemp.get('oriState')
		// const oriDate = insertOrModify === 'insert'?this.props.oriDate:CostTransferTemp.get('oriDate')
		const oriDate = this.props.oriDate
		const oriAbstract = CostTransferTemp.get('oriAbstract')
		const carryoverAmount = CostTransferTemp.get('carryoverAmount')
		const categoryName = CostTransferTemp.get('categoryName')
		const dealTypeName = CostTransferTemp.get('dealTypeName')
		const dealTypeUuid = CostTransferTemp.get('dealTypeUuid')
		const carryoverCategory = CostTransferTemp.get('carryoverCategory')
		const beProject = CostTransferTemp.get('beProject')
		const usedProject = CostTransferTemp.get('usedProject')
		const projectCard = CostTransferTemp.get('projectCard') ? CostTransferTemp.get('projectCard') : fromJS([])
		const projectList = CostTransferTemp.get('projectList')
		const projectRange = CostTransferTemp.get('projectRange')
		const wareHouseCardList = CostTransferTemp.get('wareHouseCardList')
		const categoryNameAll = CostTransferTemp.get('categoryNameAll')
		const dealCategoryType = CostTransferTemp.get('dealCategoryType')
		const oriUuid = CostTransferTemp.get('oriUuid')
		const modalName = commonCardObj.get('modalName')

		const currentCardType = flags.get('currentCardType')

		const showSingleModal = commonCardObj.get('showSingleModal')
		const memberList = commonCardObj.get('memberList')
		const thingsList = commonCardObj.get('thingsList')
		const selectItem = commonCardObj.get('selectItem')
		const selectList = commonCardObj.get('selectList')
		const selectedKeys = commonCardObj.get('selectedKeys')
        const cardPageObj = commonCardObj.get('cardPageObj')

		const paymentTypeStr = calculateViews.get('paymentTypeStr')
		const position = "CostTransferTemp"

		const stockRange = CostTransferTemp.get('stockRange')
		const stockCardList = CostTransferTemp.get('stockCardList')
		const cardUuid = CostTransferTemp.get('cardUuid')
		const costStockList = CostTransferTemp.get('costStockList')
		const stockCardUuidList = CostTransferTemp.get('stockCardUuidList')
		const propertyCostList = CostTransferTemp.get('propertyCostList')
		const propertyCost = CostTransferTemp.get('propertyCost')
		const cardPages = CostTransferTemp.get('cardPages')
		const currentCardPage = CostTransferTemp.get('currentCardPage')
		const modifycurrentPage = CostTransferTemp.get('modifycurrentPage')
		const pageSize = CostTransferTemp.get('pageSize')
		const start = (modifycurrentPage - 1) * pageSize
		const end = modifycurrentPage * pageSize
		const oriDetail = CostTransferTemp.get('costTransferList')
		const costTransferList = insertOrModify === 'insert' ? CostTransferTemp.get('costTransferList') : CostTransferTemp.get('costTransferList').slice(start,end)

		const categoryUuidList = CostTransferTemp.get('categoryUuidList')
		const storeUuidList = CostTransferTemp.get('storeUuidList')
		const condition = CostTransferTemp.get('condition')
		const warehouseOptionList = CostTransferTemp.get('warehouseOptionList')
		const wareHouseNameAll = CostTransferTemp.get('wareHouseNameAll')
		const stockNameAll = CostTransferTemp.get('stockNameAll')
		const stockUuidList = CostTransferTemp.get('stockUuidList')
		const totalNumber = CostTransferTemp.get('totalNumber')
		const selectStockItem = CostTransferTemp.get('selectStockItem')

		const propertyCostName = {
			'XZ_SALE':'销售费用',
			'XZ_MANAGE':'管理费用',
			'XZ_HTCB':'合同成本',
			'XZ_JJFY':'间接费用',
			'XZ_JXZY':'机械作业',
			'XZ_SCCB':'生产成本',
			'XZ_FZSCCB':'辅助生产成本',
			'XZ_ZZFY':'制造费用',
			'':''
		}[propertyCost]

		let totalCbAmount = 0
		selectAllItem && selectAllItem.forEach(v => {
			totalCbAmount = totalCbAmount + v.get('amount')
		})
		// const selectAll = uuidList.size ? costTransferList.every((v, i) => uuidList.indexOf(v.get('jrJvUuid')) > -1) : false

		let selectAll = true
		costTransferList && costTransferList.size && costTransferList.map( item => {
			if(selectAllList.indexOf(item.get('jrJvUuid')) === -1){
				selectAll = false
			}
		})

		let costStockOption = [], stockCardIdList = [], unitOption = []
		stockCardList.map(v => {
			stockCardIdList.push(v.get('cardUuid'))
		})
		let allStockCardList = []
		if (costStockList && costStockList.size) {
			costStockList.forEach((v, i) => {
				if(oriState === 'STATE_YYSR_ZJ'){
					const itemCard = v.toJS();
					const unit = itemCard.unit ? JSON.stringify(itemCard.unit) : JSON.stringify({ unitList: [] })
					costStockOption.push(
						<Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('cardUuid')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${v.get('isUniformPrice')}${Limit.TREE_JOIN_STR}${unit}`}>
							{`${v.get('code')} ${v.get('name')}`}
						</Option>)
					allStockCardList.push(v.toJS())
				}else{
					if (stockCardIdList.indexOf(v.get('cardUuid')) === -1) {
						const itemCard = v.toJS();
						const unit = itemCard.unit ? JSON.stringify(itemCard.unit) : JSON.stringify({ unitList: [] })
						costStockOption.push(
							<Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('cardUuid')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${v.get('isUniformPrice')}${Limit.TREE_JOIN_STR}${unit}`}>
								{`${v.get('code')} ${v.get('name')}`}
							</Option>)
						allStockCardList.push(v.toJS())
					}
				}

			})
		}
		let costDealType = []
		const loop = data => data.map(item => {
			if (item.get('childList').size > 0) {
				loop(item.get('childList'))
			} else {
				const itemCard = item.toJS();
				const propertyCostList = itemCard.propertyCostList ? JSON.stringify(itemCard.propertyCostList) : JSON.stringify([])
				costDealType.push({ uuid: item.get('uuid'), dealName: item.get('name'), beProject: item.get('beProject'), projectRange: item.get('projectRange'), propertyCostList, categoryType: item.get('categoryType')})
			}
		})
		loop(carryoverCategory)

		// const titleList = oriState === 'STATE_YYSR_TS' ? ['日期', '流水号', '流水类别','摘要','存货', '退还金额'] : ['日期', '流水号', '流水类别','摘要','存货', '收入金额']
		const titleList = ['日期', '流水号', '摘要', '存货','仓库', '数量', '金额']

		const modify = insertOrModify === 'modify' ? true : false

		const disabledDateFun = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}
		let detailElementList = []
		let detailDate = formatDate().slice(0, 10)
		let curDateTime = 0

		selectAllItem && selectAllItem.size && selectAllItem.map(item => {
			const itemDate = new Date(item.get('oriDate')).getTime()
			// 不能早于前置流水最晚日期
			if(selectAllList.indexOf(item.get('jrJvUuid')) > -1){
				detailDate = curDateTime > itemDate ? detailDate : item.get('oriDate')
				curDateTime = new Date(detailDate).getTime()
			}

		})
        const finalUuidList = getUuidList(costTransferList)  // 上下条

		costTransferList && costTransferList.size && costTransferList.forEach((v, index) => {
			const checked = selectAllList.indexOf(v.get('jrJvUuid')) > -1
			let assistValue = ''
			const batchValue = v.get('batch') ? v.get('productionDate') ? `${v.get('batch')}(${v.get('productionDate')})` : v.get('batch') :''
			if (v.get('assistList') && v.get('assistList').some(w => w.get('propertyName')) && v.get('batch')) {
				assistValue = `${v.get('assistList').map(w => w.get('propertyName')).join()} | ${batchValue}`
			} else if (v.get('assistList') && v.get('assistList').some(w => w.get('propertyName')) || v.get('batch')) {
				assistValue =  v.get('assistList') && v.get('assistList').some(w => w.get('propertyName')) ?
				v.get('assistList').map(w => w.get('propertyName')).join()
				:batchValue
			}

			detailElementList.push(
				<TableItem className='account-cost-transfer-table-width' key={v.get('jrJvUuid')}>
					<li
						onClick={(e) => {
							e.stopPropagation()
							dispatch(editCalculateActions.selectEditCbjzItem(v,checked,oriDate))
						}}
					>
						<Checkbox checked={checked} />
					</li>
					<li>{v.get('oriDate')}</li>
					<TableOver
						textAlign='left'
						className='account-flowNumber'
						onClick={(e) => {
							e.stopPropagation()
							dispatch(previewRunningActions.getPreviewRunningBusinessFetch(v, 'lrls', fromJS(finalUuidList),()=>{
								dispatch(editCalculateActions.getCostTransferList(oriState, oriDate, stockUuidList,categoryUuidList,storeUuidList,condition,1))
							}))
						}}
					>
						<span>{`${v.get('jrIndex')}号`}</span>
					</TableOver>
					<li><span>{v.get('oriAbstract')}</span></li>
					<li className='cbjz-stock-items'>
						<span>{`${v.get('stockCardCode')} ${v.get('stockCardName')}`}</span>
						{
							assistValue ?
							<span>{assistValue}</span> : ''
						}

					</li>
					<li><p>{`${v.get('storeCardCode') ? v.get('storeCardCode') : ''} ${v.get('storeCardName') ? v.get('storeCardName') : ''}`}</p></li>
					<li><p>{`${v.get('quantity') ? formatFour(v.get('quantity')) : ''} ${v.get('unitCardName') ? v.get('unitCardName') : ''}`}</p></li>
					<li><p>{formatMoney(v.get('amount'), 2, '')}</p></li>
				</TableItem>
			)
		})

		const regNegative = /^-{0,1}\d{0,14}(\.\d{0,2})?$/

		let costTotalAmount = 0

		return (
			<div className="accountConf-modal-list">
				{
					insertOrModify === 'modify' ?
						<div className="edit-running-modal-list-item">
							<label>流水号：</label>
							<div>
								<NumberInput
									style={{ width: '70px', marginRight: '5px' }}
									value={jrIndex}
									onChange={(e) => {
										if (/^\d{0,6}$/.test(e.target.value)) {
											dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', 'jrIndex', e.target.value))
										} else {
											message.info('流水号不能超过6位')
										}
									}}
									PointDisabled={true}
								/>
								号
						</div>
						</div>
						:
						null
				}
				<div className="edit-running-modal-list-item">
					<label>日期：</label>
					<div>
						<DatePicker
							allowClear={false}
							disabledDate={(current) => {
								if (modify && oriState !== 'STATE_YYSR_ZJ') {
									return disabledDateFun(current, modify, detailDate)
								} else {
									return disabledDateFun(current)
								}

							}}
							value={oriDate ? moment(oriDate) : ''}
							onChange={value => {
								const date = value.format('YYYY-MM-DD')
								if (insertOrModify === 'insert') {
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
									dispatch(editCalculateActions.getCarryoverCategory(date, oriState))
									const categoryUuid = oriState === 'STATE_YYSR_ZJ' ? dealTypeUuid : ''
									dispatch(editCalculateActions.getCostCarryoverStockList(date, oriState,categoryUuid))

									// dispatch(editRunningActions.getCostStockList(date,oriState,dealTypeUuid))
									dispatch(editCalculateActions.getCostTransferList(oriState, date, stockUuidList,categoryUuidList,storeUuidList,condition,1))
									dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', 'stockCardList', fromJS([{ cardUuid: '', name: '', code: '', amount: '' }])))
									dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', 'cardUuid', ''))
									dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', 'costTransferList', fromJS([])))
									dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', ['stockCardRange', 'code'], ''))
									dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', ['stockCardRange', 'name'], ''))

								} else {
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								}
								// dispatch(editCalculateActions.getCostCategory(sessionStorage.getItem('psiSobId'),oriState,date))
							}}
						/>
					</div>
				</div>

				<CategorySelect
					dispatch={dispatch}
					insertOrModify={insertOrModify}
					paymentTypeStr={paymentTypeStr}
					hideCategoryList={hideCategoryList}
				/>
				<div className="edit-running-modal-list-item">
					<label></label>
					<div>
						<RadioGroup
							value={oriState}
							disabled={insertOrModify === 'modify'}
							onChange={e => {
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriState', e.target.value))
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', { STATE_YYSR_XS: '销售存货结转成本', STATE_YYSR_TS: '销货退回结转成本', STATE_YYSR_ZJ: '直接结转成本' }[e.target.value]))
								dispatch(editCalculateActions.initCarryoverFromChangeOriState())

								dispatch(editCalculateActions.getCarryoverCategory(oriDate, e.target.value))
								e.target.value !== 'STATE_YYSR_ZJ' && dispatch(editCalculateActions.getCostCarryoverStockList(oriDate, e.target.value, ''))
								e.target.value !== 'STATE_YYSR_ZJ' && dispatch(editCalculateActions.getCostTransferList(e.target.value, oriDate, [],[],[],'',1 ))
								e.target.value === 'STATE_YYSR_ZJ' && this.props.dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'CostTransferTemp'}))
							}}>
							<Radio key="a" value={'STATE_YYSR_XS'}>销售成本结转</Radio>
							<Radio key="b" value={'STATE_YYSR_TS'}>退销转回成本</Radio>
							<Radio key="c" value={'STATE_YYSR_ZJ'}>直接成本结转</Radio>
						</RadioGroup>
					</div>
				</div>

				<div className='accountConf-separator'></div>
				{
					oriState === 'STATE_YYSR_ZJ' ?
					<div className="edit-running-modal-list-item">
						<label>处理类别：</label>
						<div className='chosen-right' style={{ display: 'flex' }}>
							<Select
								disabled={insertOrModify === 'modify'}
								value={dealTypeName}
								onChange={value => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'dealTypeName', valueList[1]))
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'dealTypeUuid', valueList[0]))
									// dispatch(editCalculateActions.getCostCarryoverStockList(oriDate, oriState, valueList[0]))
									dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', 'stockCardList', fromJS([{}])))
									dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', 'costTransferList', fromJS([])))
									if (oriState === 'STATE_YYSR_ZJ') {
										dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'dealCategoryType', valueList[4]))
										dispatch(editCalculateActions.getCostCarryoverStockList(oriDate, oriState, valueList[0]))
										const beProjectBollen = valueList[2] === 'true' ? true : false
										const propertyCostList = JSON.parse(valueList[3])
										dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'beProject', beProjectBollen))
										dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCostList', fromJS(propertyCostList)))
										if(propertyCostList.length === 1){
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', propertyCostList[0]))
										}
										let newProjectRange = []
										costDealType.map((v, i) => {
											if (v.uuid == valueList[0]) {
												newProjectRange = v.projectRange
											}
										})
										if (valueList[2]) {
											if (newProjectRange.size) {
												const categoryType = valueList[4]
												// const needCommonCard = valueList[4] === 'LB_YYSR' ? false : true
												const needCommonCard = true
												const needIndirect = valueList[4] === 'LB_FYZC' ? true : false
												const needMechanical = valueList[4] === 'LB_FYZC' ? true : false
												const needAssist = valueList[4] === 'LB_FYZC' ? true : false
												const needMake = valueList[4] === 'LB_FYZC' ? true : false
												dispatch(editCalculateActions.getJzsyProjectCardList(newProjectRange, position,needCommonCard,'',needIndirect,needMechanical,needAssist,needMake))
												dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS([{ uuid: '', code: '', name: '' }])))
											} else {
												dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'beProject', false))
											}
										}
									}

								}}
							>
								{
									costDealType.map((v, i) => {
										return <Option key={i} value={`${v.uuid}${Limit.TREE_JOIN_STR}${v.dealName}${Limit.TREE_JOIN_STR}${v.beProject}${Limit.TREE_JOIN_STR}${v.propertyCostList}${Limit.TREE_JOIN_STR}${v.categoryType}`}>
											{v.dealName}
										</Option>
									})
								}
							</Select>
							{
								beProject ?
									<Switch
										className="use-unuse-style lrls-jzsy-box"
										style={{ margin: '.1rem 0 0 .2rem' }}
										checked={usedProject}
										checkedChildren={'项目'}
										unCheckedChildren={'项目'}
										onChange={() => {
											if (!usedProject) {
												dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS([{ uuid: '', code: '', name: '' }])))
											}
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'usedProject', !usedProject))
										}}
									/> : ''
							}
						</div>
					</div> : null
				}

				{
					propertyCostList && propertyCostList.size > 1 ?
					<div className="edit-running-modal-list-item">
						<label>费用性质：</label>
						<div>
						<Tooltip title={
                            {
                                XZ_HTCB:`已选择施工项目`,
                                XZ_JJFY:`已选择"间接费用"项目`,
                                XZ_JXZY:`已选择"机械作业"项目`,
								XZ_SCCB:`已选择生产项目`,
                                XZ_FZSCCB:`已选择"辅助生产成本"项目`,
                                XZ_ZZFY:`已选择"制造费用"项目`,
                            }[propertyCost] || ''}
                            placement='topLeft'
                            >
								<Select
									disabled={
										propertyCost === 'XZ_SCCB' ||
										propertyCost === 'XZ_FZSCCB' ||
										propertyCost === 'XZ_ZZFY' ||
										propertyCost === 'XZ_HTCB' ||
										propertyCost === 'XZ_JJFY' ||
										propertyCost === 'XZ_JXZY'
									}
									value={propertyCostName}
									onChange={value => {
										dispatch(editCalculateActions.changeEditCalculateCommonState(position,'propertyCost',value))
									}}
								>
									{
										propertyCostList && propertyCostList.size?
										propertyCostList.map((v, i) =>{
											const name ={
												XZ_SALE:'销售费用',
												XZ_MANAGE:'管理费用',
											}[v]
											return <Option key={i} value={v}>
												{name}
											</Option>
										})
										:
										null
									}

								</Select>
							</Tooltip>
						</div>
					</div> : ''
				}

				<div className="edit-running-modal-list-item">
					<label>摘要：</label>
					<div>
						<Input className="focus-input"
							onFocus={(e) => {
								document.getElementsByClassName('focus-input')[0].select();
							}}
							value={oriAbstract}
							onChange={(e) => {
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', e.target.value))
							}}
						/>
					</div>
				</div>
				{
					usedProject && beProject && oriState === 'STATE_YYSR_ZJ' ?
						projectCard.map((v, i) =>
							<div key={i} className='project-content-area' style={projectCard.size > 1 ? {} : { border: 'none', marginBottom: '0' }}>
								<div className="edit-running-modal-list-item" >
									<label>项目：</label>
									<div className='chosen-right'>
										<Select
											combobox
											showSearch
											value={`${v.get('code') !== 'COMNCRD' && v.get('code') !== 'INDIRECT' && v.get('code') !== 'MECHANICAL' && v.get('code') !== 'ASSIST' && v.get('code') !== 'MAKE' && v.get('code') ? v.get('code') : ''} ${v.get('name') ? v.get('name') : ''}`}
											onChange={(value,options) => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const cardUuid = options.props.uuid
												const code = valueList[0]
												const name = valueList[1]
												dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS([{ cardUuid, name, code }])))
												switch(code) {
													case 'ASSIST':
														dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_FZSCCB'))
														break
													case 'MAKE':
														dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_ZZFY'))
														break
													case 'INDIRECT':
														dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JJFY'))
														break
													case 'MECHANICAL':
														dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JXZY'))
														break
													default:
													if (options.props.projectProperty === 'XZ_PRODUCE') {
														dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_SCCB'))
													}else if (options.props.projectProperty === 'XZ_CONSTRUCTION') {
															dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_HTCB'))
														}else{
															dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', ''))
														}
														break
												}

											}}
										>
											{projectList && (dealCategoryType !== 'LB_FYZC' ? projectList.filter(v => v.get('projectProperty') !== 'XZ_PRODUCE') : projectList).map((v, i) =>

												<Option
													key={v.get('uuid')}
													value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
													projectProperty={v.get('projectProperty')}
													uuid={v.get('uuid')}
												>
													{v.get('code') !== 'COMNCRD' && v.get('code') !== 'INDIRECT' && v.get('code') !== 'MECHANICAL' && v.get('code') !== 'ASSIST' && v.get('code') !== 'MAKE'? `${v.get('code')} ${v.get('name')}` : v.get('name')}
												</Option>
											)}
										</Select>
										{
											<div className='chosen-word'
												onClick={() => {
													const needCommonCard = true
													const needIndirect = dealCategoryType === 'LB_FYZC' ? true : false
													const needMechanical = dealCategoryType === 'LB_FYZC' ? true : false
													const needAssist = dealCategoryType === 'LB_FYZC' ? true : false
													const needMake = dealCategoryType === 'LB_FYZC' ? true : false
													dispatch(editCalculateActions.getProjectAllCardList(projectRange, 'showSingleModal',false,needCommonCard,'',needIndirect,needMechanical,needAssist,needMake, 1))
													// dispatch(editRunningActions.changeEditCalculateCommonString('', ['views', 'currentCardType'], 'project'))
													dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'modalName', 'singleModalProject'))
													this.setState({
														index: i,
													})

											}}>选择</div>
										}
									</div>
								</div>
							</div>
						) : null
				}


				{oriState === 'STATE_YYSR_ZJ' ? <div className='accountConf-separator'></div> :null}

				{
					oriState === 'STATE_YYSR_ZJ' ?
					<Inventory
                        dispatch={dispatch}
                        stockCardList={stockCardList}
                        stockList={fromJS(allStockCardList)}
                        stockRange={[]}
                        // amount={amount}
                        oriDate={oriDate}
						oriUuid={oriUuid}
                        MemberList={memberList}
                        thingsList={thingsList}
                        // carryoverCardList={wareHouseCardList}
                        currentCardType={'stock'}
                        selectedKeys={selectedKeys}
                        warehouseList={wareHouseCardList}
                        insertOrModify={insertOrModify}
                        enableWarehouse={enableWarehouse && oriState === 'STATE_YYSR_ZJ'}
                        openQuantity={openQuantity}
                        selectList={selectList}
                        selectItem={selectItem}
                        stockTitleName={'存货'}
                        stockTemplate={'stockCardList'}
                        oriStockTemplate={'oriStockCardList'}
                        sectionTemp={'CostTransfer'}
                        amountDisable={false}
                        isCardUuid={true}
						oriState={oriState}
						needTotalAmount={true}
						needSpliceChoosedStock={true}
						serialList={serialList}
						stockCardIdList={oriState === 'STATE_YYSR_ZJ' ? '' : stockCardIdList}
						totalAmountName={'成本合计'}
						notNeedOpenModal={oriState === 'STATE_YYSR_ZJ' && !dealTypeUuid}
						notNeedMessage={'请先选择处理类别'}
						notFoundContent={oriState === 'STATE_YYSR_ZJ' && !dealTypeUuid ? '请先选择处理类别' : undefined}
						dealTypeUuid={dealTypeUuid}
						addInBatchesFun={()=>{
							if(oriState === 'STATE_YYSR_ZJ' && !dealTypeUuid){
								message.info('请先选择处理类别')
							}else{
								dispatch(editCalculateActions.getCarryoverStock(oriDate, oriState, 'showSingleModal', dealTypeUuid, false,1))
							}

						}}
						selectStockFun={(cardUuid,i)=>{
							dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', ['stockCardList',i, 'amount'], ''))

						}}
						deleteStockFun={(i)=>{
							let newStockList = stockCardList
							newStockList = newStockList.splice(i,1)
							dispatch(editCalculateActions.changeStockList(stockCardList, i, 'delete'))
						}}
						callback={(item) => {
							const chooseIndex = stockCardList.size
							let selectUuidList = []
							selectItem && selectItem.size && selectItem.map((item, index) => {
								selectUuidList.push({
									cardUuid: item.get('uuid'),
									storeUuid: '',
									assistList: item.get('assistList'),
									batchUuid: item.get('batchUuid'),
								})
							})
							selectItem && selectItem.size && dispatch(editCalculateActions.getCostTransferPrice(oriDate, selectUuidList,chooseIndex ))
						}}
						selectTreeCallBack={(uuid, level) => {
							if (uuid === 'all') {
								dispatch(editCalculateActions.getCarryoverStock(oriDate, oriState, '', dealTypeUuid,true,1))
							} else {
								dispatch(editCalculateActions.getCarryoverStockTypeList(oriDate, oriState, uuid, level, dealTypeUuid,1))
							}
						}}
						cardPageObj={cardPageObj}
                        cardPaginationCallBack={(value)=>{
                            if (selectTreeUuid === 'all') {
                                dispatch(editCalculateActions.getCarryoverStock(oriDate, oriState, '', dealTypeUuid,true,value))
                            } else {
								dispatch(editCalculateActions.getCarryoverStockTypeList(oriDate, oriState, selectTreeUuid, selectTreeLevel, dealTypeUuid,value))
                                dispatch(editCalculateActions.getStockSomeCardList(
                                    {
                                        uuid: selectTreeUuid,
                                        level: selectTreeLevel,
                                        currentPage: value
                                    }
                                ))
                            }
                        }}
                    /> :
					<div className={'cbjz-stock-list'}>
						<div className={openQuantity ? (enableWarehouse ? 'cbjz-stock-list-title-warehouse' : 'cbjz-stock-list-title') : enableWarehouse ? 'cbjz-stock-list-title-warehouse-no-quantity' : 'cbjz-stock-list-title-no-quantity'}>
							<span>存货</span>
							{ enableWarehouse ? <span>仓库</span> : '' }
							{
								openQuantity?
								<Fragment>
									<span>数量</span>
									<span>单价</span>
								</Fragment> :''
							}
							<span>金额</span>
						</div>
						<div className="cbjz-stock-list-content">
							{
								selectStockItem.size > 0 ?
								<ul className={openQuantity ? (enableWarehouse ? 'stock-list-content-items-warehouse' : 'stock-list-content-items') : ( enableWarehouse ? 'stock-list-content-items-warehouse-no-quantity' : 'stock-list-content-items-no-quantity')}>
									{
										selectStockItem.map((item,index) => {
											costTotalAmount = numberCalculate(item.get('amount'),costTotalAmount)
											const curItem = allStockCardList.find(w => w.cardUuid === item.get('cardUuid')) || fromJS([])

											let assistValue = ''
											const batchValue = item.get('batch') ? item.get('productionDate') ? `${item.get('batch')}(${item.get('productionDate')})` : item.get('batch') :''
											if (item.get('assistList') && item.get('assistList').some(w => w.get('propertyName')) && item.get('batch')) {
												assistValue = `${item.get('assistList').map(w => w.get('propertyName')).join()} | ${batchValue}`
											} else if (item.get('assistList') && item.get('assistList').some(w => w.get('propertyName')) || item.get('batch')) {
												assistValue =  item.get('assistList') && item.get('assistList').some(w => w.get('propertyName')) ?
												item.get('assistList').map(w => w.get('propertyName')).join()
												:batchValue
											}

											return <Tooltip
											title={
												openQuantity && item.get('isOpenedQuantity') ?
												<div>
													<p>仓库数量：{item.get('referenceQuantity') ? formatFour(item.get('referenceQuantity')) : 0}</p>
													{
														// Number(item.get('referencePrice')) > 0 ?
															oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS' ?
																<p>参考单价：{item.get('unitName') ? `${formatFour(item.get('referencePrice'))}元 / ${item.get('unitName')}` : formatFour(item.get('referencePrice')) }</p> :
															<p>{item.get('isUniformPrice') && oriState === 'STATE_CHDB' ? '统一' : '参考'}单价：{curItem.getIn(['unit','name']) ? `${formatFour(item.get('referencePrice'))}元 / ${curItem.getIn(['unit','name'])}` :
														formatFour(item.get('referencePrice'))}</p>
														// : null
													}
												</div> : ''
											}
											placement="right"
											>
												<li className={item.get('isOpenedQuantity') ? (enableWarehouse ? '' : 'items-no-warehouse') : (enableWarehouse ? 'items-warehouse-no-quantity' : 'items-no-warehouse-no-quantity')}>
													<span className='cbjz-stock-items'>
														<span className='stock-items-number'>({index+1})</span>
														<span>{item.get('code')} {item.get('name')}</span>
														{assistValue ? <span>{assistValue}</span> : ''}
													</span>
													{ enableWarehouse ? <span>{`${item.get('warehouseCardCode') ? item.get('warehouseCardCode') : ''} ${item.get('warehouseCardName') ? item.get('warehouseCardName') : ''}`}</span> : '' }
													{
														openQuantity ?
														item.get('isOpenedQuantity') ?
														<Fragment>
															<span>{`${formatMoney(item.get('quantity'))} ${item.get('unitName') ? item.get('unitName') : ''}`}</span>
															<span>
																<InputFour
																	placeholder='请输入单价'
																	value={item.get('price')}
																	onChange={(e) => {
																		numberFourTest(e, (value) => {
																			dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', ['selectStockItem',index, 'price'], value))
																			dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', ['selectStockItem',index, 'amount'], numberCalculate(value,item.get('quantity'),2,'multiply')))
																		})
																	}}
																/>
															</span>
														</Fragment> :
														<Fragment>
															<span></span>
															<span></span>
														</Fragment> : null
													}
													<span>
														<NumberInput
															placeholder='请输入金额'
															value={item.get('amount')}
															onChange={(e) => {
																numberTest(e, (value) => {
																	dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', ['selectStockItem',index, 'amount'], value))
																	openQuantity && item.get('isOpenedQuantity') && dispatch(innerCalculateActions.changeEditCalculateCommonString('CostTransfer', ['selectStockItem',index, 'price'], numberCalculate(value,item.get('quantity'),2,'divide')))
																})
															}}
														/>
													</span>
												</li>
											</Tooltip>
										})
									}
								</ul> :
								<div className='cbjz-stock-list-empty'>
									<div><img src="https://www.xfannix.com/utils/img/icons/emptyStock.png" alt="无存货"/></div>
									<div className="empty-words">请勾选待结转成本的流水</div>
								</div>
							}


						</div>


						<div className="cbjz-stock-list-bottom">
							<div><label>成本合计：</label><Amount>{costTotalAmount}</Amount></div>
						</div>
					</div>
				}


				{
					// <div className="edit-running-modal-list-item">
					// 	<label>成本总金额：{formatMoney(totalCbAmount)}</label>
					// </div>
				}


				{
					oriState === 'STATE_YYSR_ZJ' ? null :
						<div className='editRunning-detail-title-single'>
							{
								// <div className='editRunning-detail-title-top'></div>
							}

							<div className='editRunning-detail-title-bottom'>

								<span>已勾选流水：{selectAllList.size}条</span>
								<span></span>
								{
									<span>
										{oriState === 'STATE_YYSR_XS' ? '收入' : '退销'}
										金额合计：
										<span>{formatMoney(totalCbAmount, 2, '')}</span>
									</span>
								}
							</div>
						</div>
				}
				{
					oriState === 'STATE_YYSR_ZJ' ? null :
						<TableAll className="lrAccount-table">
						{
							insertOrModify === 'insert' ?
							<div className="sfgl-table-top-select">
								<PayCategorySelect
									showSearch={true}
									disabled={modify}
									treeData={carryoverCategory && carryoverCategory.size ? carryoverCategory : fromJS([])}
									value={categoryNameAll.toJS()}
									// className={categoryNameAll.size === 1 ? 'table-top-select-long' : 'table-top-select-short'}
									placeholder=""
									parentsDisable={false}
									treeCheckable={true}
									treeCheckStrictly={true}
									placeholder={'筛选流水类别...'}
									id='sfgl-select-running'
									size={'small'}
									onChange={value => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'categoryNameAll', fromJS(value)))
										let newCategoryUuidList = []
										let newCategoryNameList = []
										value && value.forEach(v => {
											const valueList = v.value.split(Limit.TREE_JOIN_STR)
											if(valueList[1]){
												newCategoryUuidList.push(valueList[0])
												newCategoryNameList.push(valueList[1])
											}

										})
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'categoryUuidList', fromJS(newCategoryUuidList)))
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'categoryNameList', fromJS(newCategoryNameList)))

										dispatch(editCalculateActions.getCostTransferList(oriState, oriDate, stockUuidList,newCategoryUuidList,storeUuidList,condition,1))

									}}
								/>
								<PayCategorySelect
									showSearch={true}
									disabled={modify}
									treeData={allStockCardList && allStockCardList.length ? fromJS(allStockCardList) : fromJS([])}
									value={stockNameAll.toJS()}
									placeholder=""
									parentsDisable={false}
									treeCheckable={true}
									treeCheckStrictly={true}
									placeholder={'筛选存货...'}
									id='sfgl-select-running'
									size={'small'}
									isCardUuid={true}
									onChange={value => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'stockNameAll', fromJS(value)))
										let newStockUuidList = []
										let newStockNameList = []
										value && value.forEach(v => {
											const valueList = v.value.split(Limit.TREE_JOIN_STR)
											if(valueList[1]){
												newStockUuidList.push(valueList[0])
												newStockNameList.push(`${valueList[2]} ${valueList[1]}`)
											}

										})
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'stockUuidList', fromJS(newStockUuidList)))
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'stockNameList', fromJS(newStockNameList)))

										dispatch(editCalculateActions.getCostTransferList(oriState, oriDate, newStockUuidList,categoryUuidList,storeUuidList,condition,1))

									}}
								/>
								<PayCategorySelect
									showSearch={true}
									disabled={modify}
									treeData={warehouseOptionList && warehouseOptionList.size ? warehouseOptionList : fromJS([])}
									value={wareHouseNameAll.toJS()}
									placeholder=""
									parentsDisable={false}
									treeCheckable={true}
									chooseAll={true}
									placeholder={'筛选仓库...'}
									id='sfgl-select-running'
									size={'small'}
									onChange={value => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'wareHouseNameAll', fromJS(value)))
										let newWareHouseUuidList = []
										let newWareHouseNameList = []
										value && value.forEach(v => {
											const valueList = v.split(Limit.TREE_JOIN_STR)
											if(valueList[1]){
												newWareHouseUuidList.push(valueList[0])
												newWareHouseNameList.push(`${valueList[2]} ${valueList[1]}`)
											}

										})
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'storeUuidList', fromJS(newWareHouseUuidList)))
										dispatch(editCalculateActions.changeEditCalculateCommonState('CostTransferTemp', 'wareHouseNameList', fromJS(newWareHouseNameList)))

										dispatch(editCalculateActions.getCostTransferList(oriState, oriDate, stockUuidList,categoryUuidList,newWareHouseUuidList,condition,1))

									}}
								/>
								<div className='table-top-write-off'>
									<Search
										placeholder="搜索摘要、金额..."
										value={condition}
										onSearch={value => {
											dispatch(editCalculateActions.getCostTransferList(oriState, oriDate, stockUuidList,categoryUuidList,storeUuidList,value,1))
										}}
										onChange={e => {
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'condition', e.target.value))
										}}
										style={{ width: 166 }}
									/>
								</div>

							</div> : null
						}
							<TableTitle
								className="account-cost-transfer-table-width"
								titleList={titleList}
								hasCheckbox={true}
								selectAcAll={selectAll}
								onClick={(e) => {
									e.stopPropagation()
									dispatch(editCalculateActions.selectEditCbjzItemAll(selectAll, position, 'costTransferList',insertOrModify))
								}}
							/>
							<TableBody>
								{detailElementList}
							</TableBody>
							{
								<TableBottomPage
									total={cardPages*pageSize == 0 ? 1 : cardPages*pageSize}
									current={insertOrModify === 'insert' ? currentCardPage : modifycurrentPage}
									onChange={(page) => {
										insertOrModify === 'insert' ?
										dispatch(editCalculateActions.getCostTransferList(oriState, oriDate, stockUuidList,categoryUuidList,storeUuidList,condition,page)) :
										dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'modifycurrentPage', page))

									}}
									pageList={['20','50','80','100']}
									hideOnSinglePage={true}
									className={'payment-table-select' }
									totalPages={cardPages}
									pageSize={pageSize}
									showSizeChanger={true}
									hideOnSinglePage={false}
									onShowSizeChange={(curPageSize) => {
										dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'pageSize', curPageSize))
										if(insertOrModify === 'insert'){
											dispatch(editCalculateActions.getCostTransferList(oriState, oriDate, stockUuidList,categoryUuidList,storeUuidList,condition,1))
										}else{
											const listLength = CostTransferTemp.get('costTransferList').size
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'modifycurrentPage', 1))
											dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'cardPages',Math.ceil(listLength/curPageSize) ))
										}

									}}
								/>
							}
						</TableAll>
				}

				<StockSingleModal
					dispatch={dispatch}
					showSingleModal={showSingleModal}
					MemberList={dealCategoryType !== 'LB_FYZC' ? memberList.filter(v => v.get('name') !== '生产项目') : memberList}
					thingsList={dealCategoryType !== 'LB_FYZC' ? thingsList.filter(v => v.get('projectProperty') !== 'XZ_PRODUCE') : thingsList}
					selectedKeys={selectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : selectedKeys}
					stockCardList={stockCardList}
					notNeedProduct={false}
					title={'选择项目'}
					cancel={()=>{
						dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'showSingleModal', false))
					}}
					selectFunc={(item, cardUuid) => {
						const code = item.code
						const name = item.name
						const isOpenedQuantity = item.isOpenedQuantity
						const isUniformPrice = item.isUniformPrice
						const projectProperty = item.projectProperty
						const allUnit = item.unit ? item.unit : ''
						switch(code) {
							case 'ASSIST':
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_FZSCCB'))
								break
							case 'MAKE':
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_ZZFY'))
								break
							case 'INDIRECT':
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JJFY'))
								break
							case 'MECHANICAL':
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_JXZY'))
								break
							default:
							if (projectProperty === 'XZ_PRODUCE') {
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_SCCB'))
							}else if (projectProperty === 'XZ_CONSTRUCTION') {
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', 'XZ_HTCB'))
								}else{
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', ''))
								}
								break
						}
						dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS([{ cardUuid, name, code, isOpenedQuantity, isUniformPrice, allUnit }])))
						dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'showSingleModal', false))
					}}
					selectListFunc={(uuid, level) => {
						this.setState({
							selectTreeUuid: uuid,
							selectTreeLevel: level
						})
						if (uuid === 'all') {
							const needCommonCard = true
							const needIndirect = dealCategoryType === 'LB_FYZC' ? true : false
							const needMechanical = dealCategoryType === 'LB_FYZC' ? true : false
							const needAssist = dealCategoryType === 'LB_FYZC' ? true : false
							const needMake = dealCategoryType === 'LB_FYZC' ? true : false
							dispatch(editCalculateActions.getProjectAllCardList(projectRange, 'showSingleModal',false,needCommonCard,'',needIndirect,needMechanical,needAssist,needMake))
						} else {
							dispatch(editCalculateActions.getProjectSomeCardList(uuid, level,'STATE_YYSR_ZJ'))
						}

					}}
					cardPageObj={cardPageObj}
					paginationCallBack={(value)=>{
						if (selectTreeUuid === 'all') {
							const needCommonCard = true
							const needIndirect = dealCategoryType === 'LB_FYZC' ? true : false
							const needMechanical = dealCategoryType === 'LB_FYZC' ? true : false
							const needAssist = dealCategoryType === 'LB_FYZC' ? true : false
							const needMake = dealCategoryType === 'LB_FYZC' ? true : false
							dispatch(editCalculateActions.getProjectAllCardList(projectRange, 'showSingleModal',false,needCommonCard,'',needIndirect,needMechanical,needAssist,needMake,value))
						} else {
							dispatch(editCalculateActions.getProjectSomeCardList(selectTreeUuid,selectTreeLevel,'STATE_YYSR_ZJ',value))
						}
					}}
				/>

			</div>
		)
	}
}
