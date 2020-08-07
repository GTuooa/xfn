import React from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { Input, Radio, Checkbox, TreeSelect, Select, Icon, message } from 'antd'
import { getCategorynameByType } from 'app/containers/Edit/EditRunning/common/common.js'
import { formatAccountCardList, formatCommonCardList, formatWarehouseCardList } from '../components/common.js'
import { CommonProjectTest } from 'app/containers/Edit/EditRunning/common/common.js'

import SingleModal from './SingleModal'

import * as approvalTemplateActions from 'app/redux/Config/Approval/ApprovalTemplate/approvalTemplate.action.js'

@immutableRenderDecorator
export default
	class HideCategory extends React.Component {

	constructor() {
		super()
		this.state = {
			showChoosenModal: false,
			showContactChoosenModal: false,
			showStockChoosenModal: false
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
        // const accountSelectList = accountList

		if (jrCategoryName) {

            // const { categoryTypeObj } = getCategorynameByType(jrCategoryType)
			// const propertyCostList = categoryData.get('propertyCostList')
			// const beProject = categoryData.get('beProject')
			// const contactsManagement = categoryData.getIn([categoryTypeObj, 'contactsManagement'])

            // const showDetailStyle = {display: jrCategoryProperty === 'SX_HW' || incomeExpensesProperty === 'SX_HW' ? 'none' : ''}
            const cannotInDetail = ['LB_CHDB']
            const showDetailStyle = {display: cannotInDetail.indexOf(jrCategoryType) > -1 ? 'none' : ''}

			// const systemCommom = ['COMNCRD', 'ASSIST', 'MAKE']
			// const oriTemp = fromJS({
			// 	categoryType: jrCategoryType,
			// 	handleType: '',
			// 	oriState: jrCategoryType==='LB_FYZC' ? 'STATE_FY' : '',
			// 	propertyCarryover: (propertyCarryover === '' && jrCategoryType === 'LB_YYZC') ? incomeExpensesProperty : propertyCarryover
            // })
            
			return (
				<div>
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

                    <div className="approval-card-break"></div>
                            
                    {
                        jrCategoryType === 'LB_ZZ' ?
                        <div className="approval-card-input-wrap">
                            <span className="approval-card-input-tip">账户范围：</span>
                            <span className="approval-card-input approval-card-input-choosen">
                                <Select
                                    mode="multiple"
                                    showSearch
                                    value={jrAccountScope.size ? jrAccountScope.toJS() : []}
                                    style={{ width: '100%' }}
                                    placeholder="必填"
                                    onChange={value => {
                                        const valueList = value
                                        dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('jrAccountScope', fromJS(valueList)))
                                    }}
                                >
                                    {
                                        accountSelectList && accountSelectList.toJS().map((v, i) => <Select.Option value={`${v.uuid}${Limit.APPROVAL_JOIN_STR}${v.name}`} key={v.name}>{`${v.name}`}</Select.Option>)
                                    }
                                </Select>
                            </span>
                        </div>
                        : null
                    }

                    {
                        jrCategoryType === 'LB_CHDB' ?
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
												dispatch(approvalTemplateActions.getStockAllCardList([], 'hidecategory', '', () => this.setState({ showStockChoosenModal: true })))
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
													dispatch(approvalTemplateActions.getStockAllCardList([], 'hidecategory', true))
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
						jrCategoryType === 'LB_CHDB' ?
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
						enableWarehouse && jrCategoryType === 'LB_CHDB' ?
							<div>
								<div className="approval-card-input-wrap">
									<span className="approval-card-input-tip">仓库：</span>
									<span className="approval-card-input">
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
				</div>
			)
		}
	}
}