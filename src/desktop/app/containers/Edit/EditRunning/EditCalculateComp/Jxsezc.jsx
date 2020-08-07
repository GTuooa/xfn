import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import XfnInput from 'app/components/Input'
import { DatePicker, Input, Select, Checkbox, Radio, Switch, message, Tooltip } from 'antd'
import NumberInput from 'app/components/Input'
import XfIcon from 'app/components/Icon'
import XfnSelect from 'app/components/XfnSelect'
import { formatMoney } from 'app/utils'
const RadioGroup = Radio.Group
const Option = Select.Option
import { RunCategorySelect } from 'app/components'
import moment from 'moment'

import StockSingleModal  from './component/StockSingleModal'
import CategorySelect from './component/CategorySelect'
import { numberTest } from './component/numberTest'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'


@immutableRenderDecorator
export default
class Jxsezc extends React.Component {

	static displayName = 'Jxsezc'

	constructor() {
		super()
		this.state = {
			index: 0,
			selectTreeUuid: 'all',
            selectTreeLevel: 0,
		}
	}
	componentDidMount() {

	}
	render() {

		const {
			TaxTransferTemp,
			dispatch,
			disabledDate,
			commonCardObj,
			insertOrModify,
			hideCategoryList,
			flags,
			panes,
			calculateViews,
			runningCategory,
			enableWarehouse,
			oriDate
		} = this.props
		const { selectTreeUuid, selectTreeLevel } = this.state
		const taxTransferList = TaxTransferTemp.get('taxTransferList')
		const selectI = calculateViews.get('selectI')
		const categoryMessage = calculateViews.get('categoryMessage')
		const uuidList = TaxTransferTemp.get('uuidList')
		const jrIndex = TaxTransferTemp.get('jrIndex')
		const categoryUuid = TaxTransferTemp.get('categoryUuid')
		const oriState = TaxTransferTemp.get('oriState')
		const amount = TaxTransferTemp.get('amount')
		const oriAbstract = TaxTransferTemp.get('oriAbstract')
		const carryoverAmount = TaxTransferTemp.get('carryoverAmount')
		const categoryName  = TaxTransferTemp.get('categoryName')
		const dealTypeName = TaxTransferTemp.get('dealTypeName')
		const dealTypeUuid = TaxTransferTemp.get('dealTypeUuid')
		const propertyCarryover = TaxTransferTemp.get('propertyCarryover')
		const projectList = TaxTransferTemp.get('projectList')
		const projectCard = TaxTransferTemp.get('projectCard')
		const wareHouseCardList = TaxTransferTemp.get('wareHouseCardList')
		// const selectedKeys = flags.get('selectedKeys')

		const paymentTypeStr = calculateViews.get('paymentTypeStr')
		const position = "TaxTransferTemp"
        const beProject = categoryMessage.get('beProject')
        const propertyCostList = categoryMessage.get('propertyCostList')
        const projectRange = categoryMessage.get('projectRange')
        const categoryType = categoryMessage.get('categoryType')
        const newProjectRange = categoryMessage.get('newProjectRange')
        const usedProject = TaxTransferTemp.get('usedProject')

		const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        const modalName = commonCardObj.get('modalName')
        const cardPageObj = commonCardObj.get('cardPageObj')
		const showSingleModal = commonCardObj.get('showSingleModal')


		const stockRange = TaxTransferTemp.get('stockRange')
		const stockCardList = TaxTransferTemp.get('stockCardList')
		const cardUuid = TaxTransferTemp.get('cardUuid')
		const selectThingsList = flags.get('selectThingsList')
		const currentCardType = flags.get('currentCardType')
		const stockCardUuidList = TaxTransferTemp.get('stockCardUuidList')
		const propertyCost = TaxTransferTemp.get('propertyCost')
		const propertyCostName = {
			'XZ_SALE':'销售费用',
			'XZ_MANAGE':'管理费用',
			'XZ_FINANCE':'财务费用',
			'XZ_SCCB':'生产成本',
            'XZ_FZSCCB':'辅助生产成本',
            'XZ_ZZFY':'制造费用',
            'XZ_HTCB':'合同成本',
            'XZ_JJFY':'间接费用',
            'XZ_JXZY':'机械作业',
			'':''
		}[propertyCost]
		let totalAmount = 0
		taxTransferList.forEach(v => {
            if (uuidList.indexOf(v.get('jrJvUuid')) > -1) {
                totalAmount = totalAmount + v.get('amount')
            }
        })
		const selectAll = uuidList.size ? taxTransferList.every((v, i) => uuidList.indexOf(v.get('jrJvUuid')) > -1) : false

		let  costStockOption =[],stockCardIdList=[]
		stockCardList.map(v =>{
			stockCardIdList.push(v.get('cardUuid'))
		})
		if(thingsList && thingsList.size) {
			thingsList.forEach((v, i) => {
				// if(stockCardIdList.indexOf(v.get('uuid')) === -1){
					costStockOption.push(
						<Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('uuid')}`}>
						{`${v.get('code')} ${v.get('name')}`}
					</Option>)
				// }

		})
		}
		const yysrCategory = runningCategory.getIn([0,'childList']).filter((item) => {
			return item.get('categoryType') === 'LB_YYZC' || item.get('categoryType') === 'LB_FYZC' || item.get('categoryType') === 'LB_CQZC' || item.get('categoryType') === 'LB_YYWZC'
		})
		let costDealType = []
		const loop = data => data.map(item => {
			if(item.get('childList').size > 0){
				loop(item.get('childList'))
			}else{
				costDealType.push({
                    uuid:item.get('uuid'),
                    dealName:item.get('name'),
					propertyCarryover: item.get('propertyCarryover')
                })
			}
		})
		loop(yysrCategory)

		let totalSeAmount = 0

		let needCommonCard = false,needIndirect = false,needMechanical = false,needAssist = false,needMake = false
		if(categoryType === 'LB_YYZC' && propertyCarryover === 'SX_FW' || categoryType === 'LB_FYZC'){
			needCommonCard = true,needIndirect = true,needMechanical = true,needAssist = true,needMake = true
		}
		if(categoryType === 'LB_YYWZC'){
			needCommonCard = true
		}

		const filterProjectList = categoryType === 'LB_CQZC' ? projectList ? projectList.filter(v => v.get('projectProperty') == 'XZ_LOSS') : fromJS([]) : projectList
		const filterMemberList = categoryType === 'LB_CQZC' ? memberList ? memberList.filter(v => v.get('name') == '损益项目') : fromJS([]) : memberList
		const filterThingsList = categoryType === 'LB_CQZC' ? thingsList ? thingsList.filter(v => v.get('projectProperty') == 'XZ_LOSS') : fromJS([]) : thingsList

		return (
			<div className="accountConf-modal-list accountConf-modal-list-hidden">
				{
					insertOrModify === 'modify' && jrIndex ?
						<div className="edit-running-modal-list-item">
							<label>流水号：</label>
							<div>
								<NumberInput
									style={{ width: '70px', marginRight: '5px' }}
									value={jrIndex}
									onChange={(e) => {
										if (/^\d{0,6}$/.test(e.target.value)) {
											dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer', 'jrIndex', e.target.value))
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
							disabledDate={disabledDate}
							value={oriDate?moment(oriDate):''}
							onChange={value => {
								const date = value.format('YYYY-MM-DD')
								dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								if (insertOrModify === 'insert') {
									dispatch(editRunningActions.getCostStockList(date,oriState,dealTypeUuid))

									dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer','stockCardList', fromJS([{cardUuid:'',name:'',code:'',amount:'',}])))
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
				{
					// <div className="edit-running-modal-list-item">
					// 	<label></label>
					// 	<div>
					// 		<RadioGroup
					// 			value={oriState}
					// 			disabled={insertOrModify === 'modify'}
					// 			onChange={e => {
					// 				dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriState', e.target.value))
					// 				dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', {STATE_JXSEZC_FS:'进项税额转出',STATE_JXSEZC_TFS:'进项税额转出'}[e.target.value]))
					// 				dispatch(editRunningActions.getCostStockList(oriDate,e.target.value,dealTypeUuid))
					// 				dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer','stockCardList', fromJS([{cardUuid:'',name:'',code:'',amount:''}])))
					// 				dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer','taxTransferList', fromJS([])))
					// 			}}>
					// 			<Radio key="a" value={'STATE_JXSEZC_FS'}>发生</Radio>
					// 			<Radio key="b" value={'STATE_JXSEZC_TFS'}>退发生</Radio>
					// 		</RadioGroup>
					// 	</div>
					// </div>
				}
				<div className="edit-running-modal-list-item">
					<label>处理类别：</label>
					<div>
						<Select
							disabled={insertOrModify === 'modify'}
							value={dealTypeName}
							onChange={value => {
								const valueList = value.split(Limit.TREE_JOIN_STR)
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'dealTypeName', valueList[1]))
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'dealTypeUuid', valueList[0]))
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCarryover', valueList[2]))
                                dispatch(editCalculateActions.getCategoryMessage(valueList[0]))

								dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer','stockCardList', fromJS([{cardUuid:'',name:'',code:'',amount:''}])))
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS([{ cardUuid: '', code: '', name: '' }])))
								dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer','taxTransferList', fromJS([])))
							}}
							>
							{
								costDealType.map((v, i) => {
									return <Option key={i} value={`${v.uuid}${Limit.TREE_JOIN_STR}${v.dealName}${Limit.TREE_JOIN_STR}${v.propertyCarryover}`}>
										{v.dealName}
									</Option>
								})
							}
						</Select>
					</div>
                    {
                        // propertyCarryover !== 'SX_HW' && categoryType !== 'LB_CQZC' &&
						categoryType === 'LB_CQZC'  && newProjectRange.some(v => v.get('name') === '损益项目') ||
						categoryType !== 'LB_CQZC' && (beProject && insertOrModify === 'insert' || ((projectCard && projectCard.get('cardUuid') || beProject)  && insertOrModify === 'modify')) ?
						<Switch
							className="use-unuse-style lrls-jzsy-box"
							style={{ margin: '.1rem 0 0 .2rem' }}
							checked={usedProject}
							checkedChildren={'项目'}
							unCheckedChildren={'项目'}
							onChange={() => {
								if (!usedProject ) {
									insertOrModify === 'insert' && dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS([{ cardUuid: '', code: '', name: '' }])))

								}else{
									dispatch(editCalculateActions.changeEditCalculateCommonState(position,'propertyCost',propertyCostList.size === 1 ? propertyCostList.get(0) : ''))
								}
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'usedProject', !usedProject))
							}}
						/> : ''
                    }
				</div>
				{
					propertyCostList && propertyCostList.size > 1 && categoryType !== 'LB_CQZC' ?
					<div className="edit-running-modal-list-item">
						<label>费用性质：</label>
						<div>
							<Tooltip title={
								{
									XZ_SCCB:`已选择生产项目`,
									XZ_FZSCCB:`已选择"辅助生产成本"项目`,
									XZ_ZZFY:`已选择"制造费用"项目`,
									XZ_JJFY:`已选择"间接费用"项目`,
									XZ_JXZY:`已选择"机械作业"项目`,
									XZ_HTCB:`已选择施工项目`
								}[propertyCost] || ''}
								placement='topLeft'
								>
								<Select
									disabled={
										propertyCost === 'XZ_SCCB' ||
										propertyCost === 'XZ_FZSCCB' ||
										propertyCost === 'XZ_ZZFY' ||
										propertyCost === 'XZ_JJFY' ||
										propertyCost === 'XZ_JXZY' ||
										propertyCost === 'XZ_HTCB'
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
												XZ_FINANCE:'财务费用'
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

				<div className='accountConf-separator'></div>

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
					// propertyCarryover !== 'SX_HW' && categoryType !== 'LB_CQZC' &&
					categoryType === 'LB_CQZC'  && newProjectRange.some(v => v.get('name') === '损益项目') && usedProject ||
					categoryType !== 'LB_CQZC'  && ( usedProject && (beProject && insertOrModify === 'insert' || ((projectCard && projectCard.get('cardUuid') || beProject) && insertOrModify === 'modify')) )?
					<div className="edit-running-modal-list-item" >
						<label>项目：</label>
						<div className='chosen-right'>
							<Select
								combobox
								showSearch
								value={`${projectCard.get('code') !== 'COMNCRD'  && projectCard.get('code') !== 'INDIRECT' && projectCard.get('code') !== 'MECHANICAL' && projectCard.get('code') !== 'ASSIST' && projectCard.get('code') !== 'MAKE' && projectCard.get('code') ? projectCard.get('code') : ''} ${projectCard.get('name') ? projectCard.get('name') : ''}`}
								onChange={(value,options) => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									const cardUuid = options.props.uuid
									const code = valueList[0]
									const name = valueList[1]
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS({ cardUuid, name, code })))
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
											} else if (propertyCost !== 'XZ_FINANCE' && propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE') {
												propertyCost && dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', propertyCostList.get(0)))
											}
									}
								}}
							>
								{filterProjectList && filterProjectList.map((v, i) =>
									<Option
										key={v.get('uuid')}
										value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
										uuid={v.get('uuid')}
										projectProperty={v.get('projectProperty')}
									>
										{`${v.get('code') !== 'COMNCRD' && v.get('code') !== 'INDIRECT' && v.get('code') !== 'MECHANICAL' && v.get('code') !== 'ASSIST' && v.get('code') !== 'MAKE' ? v.get('code') : ''} ${v.get('name')}`}
									</Option>
								)}
							</Select>
							{
								<div className='chosen-word'
									onClick={() => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'modalName', 'singleModalProject'))

										dispatch(editCalculateActions.getProjectAllCardList(projectRange, 'showSingleModal',false,needCommonCard,'',needIndirect,needMechanical,needAssist,needMake,1))

									}}>选择</div>
							}
						</div>
					</div> : null
				}
				{
					propertyCarryover !== 'SX_HW' ?
					<div className="edit-running-modal-list-item">
						<label>税额：</label>
						<div>
							<NumberInput
								value={amount}
								onChange={(e) =>{
									numberTest(e,(value) => {
										dispatch(editCalculateActions.changeEditCalculateCommonState(position,'amount',value))
									},true)
								}}
							/>
						</div>
					</div> : null
				}



				<div className='accountConf-separator'></div>
				{
					propertyCarryover === 'SX_HW' && stockCardList && stockCardList.map((v,i) =>{
						let curStockUuid,curStockAmount=0
						stockCardUuidList && stockCardUuidList.map((item,j) => {
							if(item.get('uuid') === v.get('cardUuid')){
								curStockUuid = item.get('uuid')
								curStockAmount += item.get('amount')
							}
						})
						totalSeAmount += Number(v.get('amount'))
						return <div key={i}>
						<div className="edit-running-modal-list-item">
							<label>存货：</label>
							<div className='chosen-right'>
								<Select
									showSearch
									combobox
									// disabled={insertOrModify === 'modify'}
									value={`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
									onChange={
										value => {
											const valueList = value.split(Limit.TREE_JOIN_STR)
											const code =  valueList[0]
											const name = valueList[1]
											const cardUuid = valueList[2]
											const amount = v.get('amount')
											const warehouseCardUuid = v.get('warehouseCardUuid') ? v.get('warehouseCardUuid') : ''
											const warehouseCardName = v.get('warehouseCardName') ? v.get('warehouseCardName') : ''
											const warehouseCardCode = v.get('warehouseCardCode') ? v.get('warehouseCardCode') : ''
											const stockCardListItem = {
												cardUuid,
												name,
												code,
												amount,
												warehouseCardUuid,
												warehouseCardName,
												warehouseCardCode
											}
											dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer',['stockCardList',i], fromJS(stockCardListItem)))

										}
									}
									>
										{costStockOption}
								</Select>
								{
									// insertOrModify !== 'modify' ?
									<div className='chosen-word'
										onClick={() => {
											dispatch(editCalculateActions.getStockCategoryList(categoryMessage.getIn(['acBusinessExpense','stockRange']),true))
											dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'modalName', 'singleModalStock'))
											dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'showSingleModal', true))
											dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'selectI', i))


									}}>选择</div>
									// : ''
								}

							</div>
							{
								// insertOrModify === 'modify' ? '' :
								<span className='icon-content'>
									<span className="icon-plus-margin">
										<XfIcon
											type="simple-plus"
											theme="outlined"
											onClick={() => {
												dispatch(editCalculateActions.changeJxsStockList(stockCardList,i,'add',dealTypeUuid))

											}}
										/>
									</span>
									{
										stockCardList.size >1 ?
											<span>
												<XfIcon
													type="sob-delete"
													theme="outlined"
													onClick={() => {
														dispatch(editCalculateActions.changeJxsStockList(stockCardList,i,'delete',dealTypeUuid))
													}}
												/>
											</span> : ''
									}

								</span>
							}


						</div>
						{
							enableWarehouse ?
							<div className="edit-running-modal-list-item">
								<label>仓库：</label>
								<Select
									value={`${v.get('warehouseCardCode')?v.get('warehouseCardCode'):''} ${v.get('warehouseCardName')?v.get('warehouseCardName'):''}`}
									onChange={(value) => {
										const valueList = value.split(Limit.TREE_JOIN_STR)
										const warehouseCardName = valueList[1]
										const warehouseCardCode = valueList[0]
										const warehouseCardUuid = valueList[2]
										dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer', ['stockCardList',i,'warehouseCardName'], warehouseCardName))
										dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer', ['stockCardList',i,'warehouseCardCode'], warehouseCardCode))
										dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer', ['stockCardList',i,'warehouseCardUuid'], warehouseCardUuid))
									}}
								>
									{
										wareHouseCardList && wareHouseCardList.size && wareHouseCardList.map((v, i) => {
											return <Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('uuid')}`}>
												{v.get('code') && v.get('code') !== 'DFTCRD' ? `${v.get('code')} ${v.get('name')}` : v.get('name')}
											</Option>
										})
									}
								</Select>
							</div>
							: null
						}
						{
							<div className="edit-running-modal-list-item">
								<label>税额：</label>
								<div>
									<NumberInput
										value={v.get('amount')}
										onChange={(e) =>{
											numberTest(e,(value) => dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer', ['stockCardList',i,'amount'], value)),true)
										}}

									/>
								</div>
							</div>
						}

						</div>
					}

					)
				}
				{
					propertyCarryover === 'SX_HW' ?
					<div className="edit-running-modal-list-item">
						<label>合计税额：{formatMoney(totalSeAmount)}</label>
					</div> : null
				}


				{
					<StockSingleModal
						dispatch={dispatch}
						showSingleModal={showSingleModal}
						MemberList={filterMemberList}
						thingsList={filterThingsList}
						selectedKeys={selectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : selectedKeys}
						stockCardList={stockCardList}
						title={modalName === 'singleModalStock' ? '选择存货' : '选择项目'}
						selectFunc={(item, cardUuid) => {
							const code = item.code
							const name = item.name
							const projectProperty = item.projectProperty
							if (modalName === 'singleModalStock') {
								dispatch(innerCalculateActions.changeEditCalculateCommonString('TaxTransfer', ['stockCardList', selectI], fromJS({ cardUuid, name, code,amount:''})))
							} else {
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
										} else if (propertyCost !== 'XZ_FINANCE' && propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE') {
											propertyCost && dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'propertyCost', propertyCostList.get(0)))
										}
								}
								dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS({ cardUuid, name, code })))
							}
							dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'showSingleModal', false))
						}}
						cancel={()=>{
							dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'showSingleModal', false))
						}}

						selectListFunc={(uuid, level) => {
							this.setState({
								selectTreeUuid: uuid,
								selectTreeLevel: level
							})
							if (modalName === 'singleModalStock') {
								if (uuid === 'all') {
									dispatch(editCalculateActions.getStockCategoryList(categoryMessage.getIn(['acBusinessExpense','stockRange']),true,1))
								} else {
									dispatch(editCalculateActions.getStockCategoryList(categoryMessage.getIn(['acBusinessExpense','stockRange']),false,1))
								}
							} else {

								if (uuid === 'all') {
									dispatch(editCalculateActions.getProjectAllCardList(projectRange, 'showSingleModal',true,needCommonCard,'',needIndirect,needMechanical,needAssist,needMake,1))
								} else {
									dispatch(editCalculateActions.getProjectSomeCardList(uuid, level,'',1))
								}
							}

						}}
						cardPageObj={cardPageObj}
						paginationCallBack={(value)=>{
							if (modalName === 'singleModalStock') {
								if (selectTreeUuid === 'all') {
									dispatch(editCalculateActions.getStockCategoryList(categoryMessage.getIn(['acBusinessExpense','stockRange']),true,value))
								} else {
									dispatch(editCalculateActions.getStockCategoryList(categoryMessage.getIn(['acBusinessExpense','stockRange']),false,value))
								}
							} else {
								if (selectTreeUuid === 'all') {
									dispatch(editCalculateActions.getProjectAllCardList(projectRange, 'showSingleModal',true,needCommonCard,'',needIndirect,needMechanical,needAssist,needMake,value))
								} else {
									dispatch(editCalculateActions.getProjectSomeCardList(selectTreeUuid,selectTreeLevel,'',value))
								}
							}
						}}
					/>
                }

			</div>
		)
    }
}
