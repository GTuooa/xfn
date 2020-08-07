import React from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { Input, Radio, Checkbox, TreeSelect, Select, Icon, message } from 'antd'
import { getCategorynameByType } from 'app/containers/Edit/EditRunning/common/common.js'
import { formatWarehouseCardList, formatCommonCardList } from '../components/common.js'
import { CommonProjectTest } from 'app/containers/Edit/EditRunning/common/common.js'

import SingleModal from './SingleModal'

import * as approvalTemplateActions from 'app/redux/Config/Approval/ApprovalTemplate/approvalTemplate.action.js'

@immutableRenderDecorator
export default
	class CategoryCom extends React.Component {

	constructor() {
		super()
		this.state = {
			showChoosenModal: false,
			showContactChoosenModal: false,
			showStockChoosenModal: false
		}
	}

	componentDidMount() {
		// 同步账户数据
		if (this.props.jrAccountScope.size) {
			let newJrAccountScope = []
			const accountSelectList = this.props.accountList.size ? this.props.accountList.getIn([0, 'childList']) : fromJS([])
			this.props.jrAccountScope.forEach(v => {
				const post = v.indexOf('-')
				const uuid = v.substring(0, post)
				
				const accountItem = accountSelectList.find(w => w.get('uuid') === uuid)

				if (accountItem) {
					newJrAccountScope.push(`${accountItem.get('uuid')}${Limit.APPROVAL_JOIN_STR}${accountItem.get('name')}`)
				}
			})
			// 同步
			this.props.dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrAccountScope', fromJS(newJrAccountScope)))
			if (this.props.jrAccount === 'IN_MODEL') {
				this.props.dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.ZH_COMPONENT_TYPE, 'selectValueList', fromJS(newJrAccountScope)))
			}
		}
    }

	render() {

		const {
			dispatch,
			jrCategoryType,
			jrCategoryProperty,
			use,
			selectPerson,
			nature,
			natureScope,
			jrAccount,
			jrAccountScope,
			jrAccountRequired,
			contact,
			contactScope,
			contactRequired,
			project,
			projectScope,
			projectRequired,
			depot,
			depotScope,
			categoryData,
			stockCardList,
			projectCardList,
			contactCardList,
			modelComponentList,
			jrCategoryName,
			contactsRange,
			projectRange,
			newProjectRange,
			stockRange,
			modalCategoryList,
			modalCardList,
			jrCategory,
			jrCategoryScope,
			digest,
			digestRequired,
			payOrReceive,
			accountList,
			enableWarehouse,
			warehouseCardList,
			stock,
			stockScope,
			outContactScope,
			outProjectScope,
			outStockScope,
			propertyCarryover,
			incomeExpensesProperty
		} = this.props
		const { showChoosenModal, showContactChoosenModal, showStockChoosenModal } = this.state

		const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([])

		if (jrCategoryName) {

			const { categoryTypeObj } = getCategorynameByType(jrCategoryType)
			const propertyCostList = categoryData.get('propertyCostList')
			const beProject = categoryData.get('beProject')
			const contactsManagement = categoryData.getIn([categoryTypeObj, 'contactsManagement'])

			const showDetailStyle = {display: incomeExpensesProperty === 'SX_HW' ? 'none' : ''}

			const systemCommom = ['COMNCRD', 'ASSIST', 'MAKE']
			let oriState = ''
			if (incomeExpensesProperty === 'SX_DJ') {
				if (jrCategoryType === 'LB_YYSR') {
					oriState = 'STATE_YYSR_DJ'
				} else if (jrCategoryType === 'LB_YYZC') {
					oriState = 'STATE_YYZC_DJ'
				} else if (jrCategoryType === 'LB_FYZC') {
					oriState = 'STATE_FY_DJ'
				}
			} else if (jrCategoryType==='LB_FYZC') {
				oriState = 'STATE_FY'
			}
			const oriTemp = fromJS({
				categoryType: jrCategoryType,
				handleType: '',
				// oriState: jrCategoryType==='LB_FYZC' ? 'STATE_FY' : '',
				oriState: oriState,
				propertyCarryover: jrCategoryType === 'LB_YYZC' ? (propertyCarryover === 'SX_HW_FW' ? (incomeExpensesProperty === 'SX_DJ' || incomeExpensesProperty === 'SX_FW' ? 'SX_FW' : 'SX_HW') : propertyCarryover) : propertyCarryover
			})

			return (
				<div>
					<div>
						{
							payOrReceive === 'RECEIPT' ?
							<div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip">收款账户：</span>
									<span className="approval-card-input">
										<Radio.Group
											onChange={(e) => {
												if (e.target.value === 'NO') {
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrAccount', e.target.value))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrAccountScope', fromJS([])))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrAccountRequired', false))
												} else {
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrAccount', e.target.value))

													if (e.target.value === 'IN_MODEL') {
														let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.ZH_COMPONENT_TYPE)
														if (component) {
															let selectValueList = jrAccountScope.size ? jrAccountScope.toJS() : ['', '', '']
															component = component.toJS()
															component.selectValueList = selectValueList
															component.required = jrAccountRequired
															dispatch(approvalTemplateActions.addApprovalFormComponent(component))
														}
													}
												}

												if (jrAccount === 'IN_MODEL' && e.target.value !== 'IN_MODEL') {
													dispatch(approvalTemplateActions.deleteApprovalFormComponentFromType(Limit.ZH_COMPONENT_TYPE))
												}
											}}
											value={jrAccount}
										>
											<Radio value={'NO'} key="1">不启用</Radio>
											<Radio value={'IN_MODEL'} key="2">在模版中选择</Radio>
											<Radio value={'IN_DETAIL'} key="3" style={showDetailStyle}>在明细中选择</Radio>
										</Radio.Group>
									</span>
								</div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span>范围：</span>
									<span className="approval-card-input approval-card-input-choosen">
										<Select
											mode="multiple"
											showSearch
											disabled={jrAccount === 'NO'}
											value={jrAccountScope.size ? jrAccountScope.toJS() : []}
											style={{ width: '100%' }}
											placeholder="启用必填"

											onChange={value => {
												const valueList = value
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrAccountScope', fromJS(valueList)))
												if (jrAccount === 'IN_MODEL') {
													dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.ZH_COMPONENT_TYPE, 'selectValueList', fromJS(valueList)))
												}
											}}
										>
											{
												accountSelectList && accountSelectList.toJS().map((v, i) => <Select.Option value={`${v.uuid}${Limit.APPROVAL_JOIN_STR}${v.name}`} key={v.name}>{`${v.name}`}</Select.Option>)
											}
										</Select>
									</span>
								</div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span className="approval-card-input">
										<span
											onClick={() => {
												if (jrAccount === 'NO')
													return
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrAccountRequired', !jrAccountRequired))
												dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.ZH_COMPONENT_TYPE, 'required', !jrAccountRequired))
											}}
										><Checkbox disabled={jrAccount === 'NO'} checked={jrAccountRequired} /> 必填</span>
									</span>
								</div>
							</div>
							:
							null
							// <div>
							// 	<div className="approval-card-input-wrap">
							// 		<span className="approval-card-input-tip">费用用途：</span>
							// 		<span className="approval-card-input">
							// 			<Radio.Group
							// 				onChange={(e) => dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('use', e.target.value))}
							// 				value={use}
							// 			>
							// 				<Radio value={'BX'} key="1">报销</Radio>
							// 				<Radio value={'ZF'} key="2" disabled={true}>支付</Radio>
							// 			</Radio.Group>
							// 		</span>
							// 	</div>
							// 	<div className="approval-card-input-wrap">
							// 		<span className="approval-card-input-tip"></span>
							// 		<span className="approval-card-input">
							// 			<span
							// 				onClick={(e) => {
							// 					dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('selectPerson', e.target.checked))
							// 					if (e.target.checked === true) {
							// 						const component = modelComponentList.find(v => v.get('jrComponentType') === Limit.BXR_COMPONENT_TYPE)
							// 						if (component) {
							// 							dispatch(approvalTemplateActions.addApprovalFormComponent(component.toJS()))
							// 						}
							// 					} else {
							// 						dispatch(approvalTemplateActions.deleteApprovalFormComponentFromType(Limit.BXR_COMPONENT_TYPE))
							// 					}
							// 				}}
							// 			><Checkbox checked={selectPerson} disabled={true} /> 选择{use === 'BX' ? '报销' : '支付'}人（不勾选，则默认为发起人自己）</span>
							// 		</span>
							// 	</div>
							// </div>
						}
						<div className="approval-card-input-wrap">
							<span className="approval-card-input-tip">摘要：</span>
							<span className="approval-card-input">
								<Radio.Group
									onChange={(e) => {
										dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('digest', e.target.value))

										if (e.target.value === 'NO') {
											dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('digest', e.target.value))
											dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('digestRequired', false))
										} else {
											dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('digest', e.target.value))

											if (e.target.value === 'IN_MODEL') {
												let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.ZY_COMPONENT_TYPE)
												if (component) {
													component = component.toJS()
													component.required = digestRequired
													dispatch(approvalTemplateActions.addApprovalFormComponent(component))
												}
											}
										}

										if (digest === 'IN_MODEL' && e.target.value !== 'IN_MODEL') {
											dispatch(approvalTemplateActions.deleteApprovalFormComponentFromType(Limit.ZY_COMPONENT_TYPE))
										}
									}}
									value={digest}
								>
									<Radio value={'NO'} key="1">不启用</Radio>
									<Radio value={'IN_MODEL'} key="2">在模版中输入</Radio>
									<Radio value={'IN_DETAIL'} key="3" style={showDetailStyle}>在明细中输入</Radio>
								</Radio.Group>
							</span>
						</div>
						<div className="approval-card-input-wrap">
							<span className="approval-card-input-tip"></span>
							<span className="approval-card-input">
								<span
									onClick={() => {
										if (digest === 'NO')
											return
										dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('digestRequired', !digestRequired))
										dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.ZY_COMPONENT_TYPE, 'required', !digestRequired))
									}}
								><Checkbox disabled={digest === 'NO'} checked={digestRequired} /> 必填</span>
							</span>
						</div>
					</div>
					<div className="approval-card-break"></div>
					{
						jrCategoryScope.size ?
							<div className="approval-card-input-wrap">
								<span className="approval-card-input-tip">流水类别：</span>
								<span className="approval-card-input">
									<Radio.Group
										onChange={(e) => {
											dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrCategory', e.target.value))

											if (e.target.value === 'IN_MODEL') {
												let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.LSLB_COMPONENT_TYPE)
												if (component) {  
													component = component.toJS()
													// component.selectValueList = jrCategoryScope.toJS()
													dispatch(approvalTemplateActions.addApprovalFormComponent(component))
												}
											}

											if (e.target.value === 'IN_DETAIL') {
												dispatch(approvalTemplateActions.deleteApprovalFormComponentFromType(Limit.LSLB_COMPONENT_TYPE))
											}
										}}
										value={jrCategory}
									>
										<Radio value={'IN_MODEL'} key="1">在模版中选择</Radio>
										<Radio value={'IN_DETAIL'} key="2" style={showDetailStyle}>在明细中选择</Radio>
									</Radio.Group>
								</span>
							</div>
						:null
					}
					{
						propertyCostList.size > 1 && incomeExpensesProperty !== 'SX_DJ' ?
							<div className="approval-card-input-wrap">
								<span className="approval-card-input-tip">费用性质：</span>
								<span className="approval-card-input">
									<Radio.Group
										onChange={(e) => {
											dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('nature', e.target.value))

											const selectValueList = [
												'销售费用',
												'管理费用',
											]
											if (e.target.value === 'IN_MODEL') {
												let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.FYXZ_COMPONENT_TYPE)
												if (component) {
													component = component.toJS()
													component.selectValueList = selectValueList
													dispatch(approvalTemplateActions.addApprovalFormComponent(component))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('natureScope', fromJS(selectValueList)))
												}
											}
											if (e.target.value === 'IN_DETAIL') {
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('natureScope', fromJS(selectValueList)))
											}
											if (e.target.value === 'XSFY' || e.target.value === 'GLFY') {
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('natureScope', fromJS([])))
											}
											if (nature === 'IN_MODEL' && e.target.value !== 'IN_MODEL') {
												dispatch(approvalTemplateActions.deleteApprovalFormComponentFromType(Limit.FYXZ_COMPONENT_TYPE))
											}
										}}
										value={nature}
									>
										<Radio value={'XSFY'} key="1">销售费用</Radio>
										<Radio value={'GLFY'} key="2">管理费用</Radio>
										<Radio value={'IN_MODEL'} key="3">在模版中选择</Radio>
										<Radio value={'IN_DETAIL'} key="4">在明细中选择</Radio>
									</Radio.Group>
								</span>
							</div>
							: null
					}

					{
						incomeExpensesProperty === 'SX_HW' ?
							<div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip">存货：</span>
									<span>选择范围：</span>
									<span className="approval-card-input approval-card-input-choosen">
										<div className={["approval-card-input-item-wrap", stock === 'NO' ? 'approval-card-input-item-wrap-disabled' : ''].join(' ')}>
											<div>
												<ul className="approval-card-input-item-container">
													{stockScope.map((v, i) => <li>
														<span>{`${v.get('code') ? v.get('code') + '-' : ''}` + v.get('name')}</span>
														<Icon type="close" onClick={() => {
															if (stock === 'NO') {
																return
															}
															const newStockScope = stockScope.delete(i)
															dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('stockScope', newStockScope))
														}} />
													</li>
													)}
												</ul>
											</div>
										</div>
										<div
											style={{ display: stock === 'NO' ? 'none' : '' }}
											className='approval-card-chosen-word'
											onClick={() => {
												if (stockRange.size) {
													dispatch(approvalTemplateActions.getStockAllCardList(stockRange, 'stock', '', () => this.setState({ showStockChoosenModal: true })))
												} else {
													message.info('请在流水设置中选择存货范围')
												}
											}}
										>
											选择
										</div>
									</span>
								</div>
								{
									showStockChoosenModal ?
										<SingleModal
											modalCategoryList={modalCategoryList}
											modalCardList={modalCardList}
											dispatch={dispatch}
											selectList={stockScope.size ? stockScope.toJS() : []}
											title={'选择存货'}
											closeModal={() => this.setState({ showStockChoosenModal: false })}
											onOk={value => {
												const valueList = value
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('stockScope', fromJS(valueList)))
												// if (contact === 'IN_MODEL') {
												// 	dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.WLDW_COMPONENT_TYPE, 'selectValueList', fromJS(valueList)))
												// }
											}}
											selectListFunc={(uuid, level) => {
												if (uuid === 'all') {
													dispatch(approvalTemplateActions.getStockAllCardList(stockRange, 'stock', true))
												} else {
													dispatch(approvalTemplateActions.getStockSomeCardList(uuid, level))
												}
											}}
										/> : null
								}
							</div>
							: null
					}
					{
						// jrCategoryProperty === 'SX_HW' || incomeExpensesProperty === 'SX_HW' ?
						incomeExpensesProperty === 'SX_HW' ?
							<div className="approval-card-input-wrap">
								<span className="approval-card-input-tip"></span>
								<span>排除范围：</span>
								<span className="approval-card-input approval-card-input-choosen">
									<TreeSelect
										multiple
										style={{ width: '100%' }}
										disabled={stock === 'NO'}
										value={outStockScope.size ? outStockScope.map(v => `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`).toJS() : []}										
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										treeData={formatCommonCardList(stockCardList)}
										placeholder="选填"
										treeDefaultExpandAll
										onChange={(value) => {
											// console.log('valuetree', value)
											let valueList = []
											value.forEach(v => {
												const strList = v.split(Limit.TREE_JOIN_STR)
												valueList.push({
													uuid: strList[0],
													code: strList[1],
													name: strList[2],
													top: false,
													type: 'CARD',
												})
											})
											dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('outStockScope', fromJS(valueList)))
											// if (depot === 'IN_MODEL') {
												// dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.CK_COMPONENT_TYPE, 'selectValueList', fromJS(valueList)))
											// }
										}}
									/>
								</span>
							</div>
							: null
					}
					{
						// enableWarehouse && (jrCategoryProperty === 'SX_HW' || incomeExpensesProperty === 'SX_HW')?
						enableWarehouse && incomeExpensesProperty === 'SX_HW' ?
							<div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip">仓库：</span>
									<span className="approval-card-input">
										<Radio.Group
											onChange={(e) => {
												if (e.target.value === 'NO') {
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('depot', e.target.value))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('depotScope', fromJS([])))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('depotRequired', false))
												} else {
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('depot', e.target.value))

													if (e.target.value === 'IN_MODEL') {
														let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.CK_COMPONENT_TYPE)
														if (component) {
															// const selectValueList = depotScope.size ? depotScope.toJS() : ['', '', '']
															component = component.toJS()
															// component.selectValueList = selectValueList
															dispatch(approvalTemplateActions.addApprovalFormComponent(component))
														}
													}
												}

												if (depot === 'IN_MODEL' && e.target.value !== 'IN_MODEL') {
													dispatch(approvalTemplateActions.deleteApprovalFormComponentFromType(Limit.CK_COMPONENT_TYPE))
												}
											}}
											value={depot}
										>
											<Radio value={'IN_MODEL'} key="2">在模版中选择</Radio>
											<Radio value={'IN_DETAIL'} key="3">在套件明细中选择</Radio>
										</Radio.Group>
									</span>
								</div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span>范围：</span>
									<span className="approval-card-input approval-card-input-choosen">
										<TreeSelect
											multiple
											style={{ width: '100%' }}
											value={depotScope.size ? depotScope.map(v => `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`).toJS() : []}										
											dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
											treeData={formatWarehouseCardList(warehouseCardList)}
											placeholder="必填，请选择仓库"
											treeDefaultExpandAll
											onChange={(value) => {
												// console.log('valuetree', value)
												let valueList = []
												value.forEach(v => {
													const strList = v.split(Limit.TREE_JOIN_STR)
													valueList.push({
														uuid: strList[0],
														code: strList[1],
														name: strList[2],
														top: false,
														type: 'CTGY',
													})
												})
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('depotScope', fromJS(valueList)))
												// if (depot === 'IN_MODEL') {
													// dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.CK_COMPONENT_TYPE, 'selectValueList', fromJS(valueList)))
												// }
											}}
										/>
									</span>
								</div>
							</div>
							: null
					}
					{
						contactsManagement ?
							<div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip">往来单位：</span>
									<span className="approval-card-input">
										<Radio.Group
											onChange={(e) => {
												if (e.target.value === 'NO') {
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('contact', e.target.value))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('contactScope', fromJS([])))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('outContactScope', fromJS([])))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('contactRequired', false))
												} else {
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('contact', e.target.value))

													if (e.target.value === 'IN_MODEL') {
														let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.WLDW_COMPONENT_TYPE)
														if (component) {
															// const selectValueList = contactScope.size ? contactScope.toJS() : ['', '', '']
															component = component.toJS()
															// component.selectValueList = selectValueList
															component.required = contactRequired
															dispatch(approvalTemplateActions.addApprovalFormComponent(component))
														}
													}
												}

												if (contact === 'IN_MODEL' && e.target.value !== 'IN_MODEL') {
													dispatch(approvalTemplateActions.deleteApprovalFormComponentFromType(Limit.WLDW_COMPONENT_TYPE))
												}
											}}
											value={contact}
										>
											<Radio value={'NO'} key="1">不启用</Radio>
											<Radio value={'IN_MODEL'} key="2">在模版中选择</Radio>
											<Radio value={'IN_DETAIL'} key="3" style={showDetailStyle}>在明细中选择</Radio>
										</Radio.Group>
									</span>
								</div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span>选择范围：</span>
									<span className="approval-card-input approval-card-input-choosen">
										<div className={["approval-card-input-item-wrap", contact === 'NO' ? 'approval-card-input-item-wrap-disabled' : ''].join(' ')}>
											<div>
												<ul className="approval-card-input-item-container">
													{contactScope.map((v, i) => <li>
														<span>{`${v.get('code') ? v.get('code') + '-' : ''}` + v.get('name')}</span>
														<Icon type="close" onClick={() => {
															if (contact === 'NO') {
																return
															}
															const newContactScope = contactScope.delete(i)
															dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('contactScope', newContactScope))
														}} />
													</li>
													)}
												</ul>
											</div>
										</div>
										<div
											style={{ display: contact === 'NO' ? 'none' : '' }}
											className='approval-card-chosen-word'
											onClick={() => {
												if (contactsRange.size) {
													dispatch(approvalTemplateActions.getRelativeAllCardList(contactsRange, 'contact', '', () => this.setState({ showContactChoosenModal: true })))
												} else {
													message.info('请在流水设置中选择往来范围')
												}
											}}
										>
											选择
										</div>
									</span>
								</div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span>排除范围：</span>
									<span className="approval-card-input approval-card-input-choosen">
										<TreeSelect
											multiple
											style={{ width: '100%' }}
											disabled={contact === 'NO'}
											value={outContactScope.size ? outContactScope.map(v => `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`).toJS() : []}										
											dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
											treeData={formatCommonCardList(contactCardList)}
											placeholder="选填"
											treeDefaultExpandAll
											onChange={(value) => {
												// console.log('valuetree', value)
												let valueList = []
												value.forEach(v => {
													const strList = v.split(Limit.TREE_JOIN_STR)
													valueList.push({
														uuid: strList[0],
														code: strList[1],
														name: strList[2],
														top: false,
														type: 'CARD',
													})
												})
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('outContactScope', fromJS(valueList)))
												// if (depot === 'IN_MODEL') {
													// dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.CK_COMPONENT_TYPE, 'selectValueList', fromJS(valueList)))
												// }
											}}
										/>
									</span>
								</div>
								{
									showContactChoosenModal ?
										<SingleModal
											modalCategoryList={modalCategoryList}
											modalCardList={modalCardList}
											dispatch={dispatch}
											selectList={contactScope.size ? contactScope.toJS() : []}
											title={'选择往来'}
											closeModal={() => this.setState({ showContactChoosenModal: false })}
											onOk={value => {
												const valueList = value
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('contactScope', fromJS(valueList)))
												// if (contact === 'IN_MODEL') {
													// dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.WLDW_COMPONENT_TYPE, 'selectValueList', fromJS(valueList)))
												// }
											}}
											selectListFunc={(uuid, level) => {
												if (uuid === 'all') {
													dispatch(approvalTemplateActions.getRelativeAllCardList(contactsRange, 'contact', true))
												} else {
													dispatch(approvalTemplateActions.getRelativeSomeCardList(uuid, level))
												}
											}}
										/> : null
								}
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span className="approval-card-input">
										<span
											onClick={() => {
												if (contact === 'NO')
													return
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('contactRequired', !contactRequired))
												dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.WLDW_COMPONENT_TYPE, 'required', !contactRequired))
											}}
										><Checkbox disabled={contact === 'NO'} checked={contactRequired} /> 必填</span>
									</span>
								</div>
							</div>
							: null
					}

					{
						beProject ?
							<div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip">项目：</span>
									<span className="approval-card-input">
										<Radio.Group
											onChange={(e) => {
												if (e.target.value === 'NO') {
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('project', e.target.value))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('projectScope', fromJS([])))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('outProjectScope', fromJS([])))
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('projectRequired', false))
												} else {
													dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('project', e.target.value))

													if (e.target.value === 'IN_MODEL') {
														let component = modelComponentList.find(v => v.get('jrComponentType') === Limit.XM_COMPONENT_TYPE)
														if (component) {
															// let selectValueList = projectScope.size ? projectScope.toJS() : ['', '', '']
															component = component.toJS()
															// component.selectValueList = selectValueList
															component.required = projectRequired
															dispatch(approvalTemplateActions.addApprovalFormComponent(component))
														}
													}
												}

												if (project === 'IN_MODEL' && e.target.value !== 'IN_MODEL') {
													dispatch(approvalTemplateActions.deleteApprovalFormComponentFromType(Limit.XM_COMPONENT_TYPE))
												}
											}}
											value={project}
										>
											<Radio value={'NO'} key="1">不启用</Radio>
											<Radio value={'IN_MODEL'} key="2">在模版中选择</Radio>
											<Radio value={'IN_DETAIL'} key="3" style={showDetailStyle}>在明细中选择</Radio>
										</Radio.Group>
									</span>
								</div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span>选择范围：</span>
									<span className="approval-card-input approval-card-input-choosen">
										<div className={["approval-card-input-item-wrap", project === 'NO' ? 'approval-card-input-item-wrap-disabled' : ''].join(' ')}>
											<div>
												<ul className="approval-card-input-item-container">
													{projectScope.map((v, i) => <li>
														<span>{`${v.get('code') ? v.get('code') + '-' : ''}` + v.get('name')}</span>
														<Icon type="close" onClick={() => {
															if (project === 'NO') {
																return
															}
															const newProjectScope = projectScope.delete(i)
															dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('projectScope', newProjectScope))
														}} />
													</li>
													)}
												</ul>
											</div>
										</div>
										<div
											style={{ display: project === 'NO' ? 'none' : '' }}
											className='approval-card-chosen-word'
											onClick={() => {
												// if (stockStrongList.size || carryoverStrongList.size) {
												// 	return
												// }
												if (projectRange.size) {

													let projectRangeList = projectRange
													// if (jrCategoryType === 'LB_YYZC' && incomeExpensesProperty === 'SX_HW') {
													// 	projectRangeList = newProjectRange.filter(v => v.get('name') === '损益项目' || v.get('name') === '施工项目').map(v => v.get('uuid'))
													// }
													dispatch(approvalTemplateActions.getProjectAllCardList(projectRangeList, 'project', '', () => this.setState({ showChoosenModal: true })))
												} else {
													message.info('请在流水设置中选择项目范围')
												}
											}}
										>
											选择
										</div>
									</span>
								</div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span>排除范围：</span>
									<span className="approval-card-input approval-card-input-choosen">
										<TreeSelect
											multiple
											style={{ width: '100%' }}
											disabled={project === 'NO'}
											value={outProjectScope.size ? outProjectScope.map(v => `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`).toJS() : []}										
											dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
											treeData={formatCommonCardList(CommonProjectTest(oriTemp, projectCardList))}
											placeholder="选填"
											treeDefaultExpandAll
											onChange={(value) => {
												// console.log('valuetree', value)
												let valueList = []
												value.forEach(v => {
													const strList = v.split(Limit.TREE_JOIN_STR)
													valueList.push({
														uuid: strList[0],
														code: strList[1],
														name: strList[2],
														top: false,
														type: 'CARD',
													})
												})
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('outProjectScope', fromJS(valueList)))
												// if (depot === 'IN_MODEL') {
													// dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.CK_COMPONENT_TYPE, 'selectValueList', fromJS(valueList)))
												// }
											}}
										/>
									</span>
								</div>
								{
									showChoosenModal ?
										<SingleModal
											modalCategoryList={modalCategoryList}
											// modalCardList={modalCardList}
											modalCardList={CommonProjectTest(oriTemp, modalCardList)}
											dispatch={dispatch}
											selectList={projectScope.size ? projectScope.toJS() : []}
											title={'选择项目'}
											closeModal={() => this.setState({ showChoosenModal: false })}
											onOk={value => {
												const valueList = value
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('projectScope', fromJS(valueList)))
												if (project === 'IN_MODEL') {
													dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.XM_COMPONENT_TYPE, 'selectValueList', fromJS(valueList)))
												}
											}}
											selectListFunc={(uuid, level) => {
												if (uuid === 'all') {
													dispatch(approvalTemplateActions.getProjectAllCardList(projectRange, 'project', true))
												} else {
													dispatch(approvalTemplateActions.getProjectSomeCardList(uuid, level))
												}
											}}
										/> : null
								}
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip"></span>
									<span className="approval-card-input">
										<span
											onClick={() => {
												if (project === 'NO')
													return
												dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('projectRequired', !projectRequired))
												dispatch(approvalTemplateActions.changeApprovalFormOptionStringFromType(Limit.XM_COMPONENT_TYPE, 'required', !projectRequired))
											}}
										><Checkbox disabled={project === 'NO'} checked={projectRequired} /> 必填</span>
									</span>
								</div>
							</div>
							: null
					}
				</div>
			)
		}
	}
}