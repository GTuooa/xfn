import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { Select, Button, Modal, DatePicker, Checkbox, Tooltip, message } from 'antd'
import { Icon } from 'app/components'
import moment from 'moment'
const Option = Select.Option
import { fromJS, toJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import { formatDate } from 'app/utils'
import XfnSelect from 'app/components/XfnSelect'
import AccountPandge from './AccountPandge'
import ZeroInventory from './ZeroInventory'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
	class Modals extends React.Component {

	render() {

		const {
            showAccountModal,
            showReceiveModal,
			showPayModal,
			showBookKeepingModal,
            cancelShowPayModal,
            cancelShowAccountModal,
            cancelShowReceiveModal,
            cancelShowBookKeepingModal,
            selectList,
            dispatch,
			allState,
			canSetAccount,
			confirmAccountingApprovalDetail,
			confirmReceiveApprovalDetail,
			confirmPayApprovalDetail,
			confirmBookKeepingApprovalDetail,
			cancelSetReceiveMoney,
			// editRunningModalState,
			approalCalculateState,
			editLrAccountPermission,
		} = this.props
		
		const formPos = approalCalculateState.get('formPos')
		const accountDate = approalCalculateState.get('accountDate')
		const account = approalCalculateState.get('account')
		const receiveTotalMoney = approalCalculateState.get('receiveTotalMoney')
		const setAccount = approalCalculateState.get('setAccount')
		const needUsedPoundage = approalCalculateState.get('needUsedPoundage')
		const beZeroInventory = approalCalculateState.get('beZeroInventory')
		const beCarryoverOut = approalCalculateState.get('beCarryoverOut')
		const carryoverCategoryList = approalCalculateState.get('carryoverCategoryList')
		const carryoverCategoryItem = approalCalculateState.get('carryoverCategoryItem')
		const usedCarryoverProject = approalCalculateState.get('usedCarryoverProject')
		const carryoverProjectCardList = approalCalculateState.get('carryoverProjectCardList')
		const carryoverProjectList = approalCalculateState.get('carryoverProjectList')
		const propertyCost = approalCalculateState.get('propertyCost')
		const propertyCostList = approalCalculateState.get('propertyCostList')
		const handlingFeeType = approalCalculateState.get('handlingFeeType')
		
		let carryoverCategory = []
		const loop = data => data.map(item => {
			if (item.get('childList').size > 0) {
				loop(item.get('childList'))
			} else {
				carryoverCategory.push(item.toJS())
			}
		})
		loop(carryoverCategoryList)
        
        const accountList = allState.get('accountList')
		const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([])

		const dateFormat = 'YYYY-MM-DD'
		const dateFormatList = ['DD-MM-YYYY', 'DD-MM-YY']

		return (
			<div>
				{
					showPayModal ?
					<Modal
						ref="modal"
						visible={true}
						title="填写付款信息"
						onCancel={() => {
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', false))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', ''))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCostList', fromJS([])))
                            cancelShowPayModal()
                        }}
						footer={[
                            <Button
                                key="back"
                                type="ghost"
                                size="large"
                                onClick={() => {
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', false))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', ''))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCostList', fromJS([])))
                                    cancelShowPayModal()
                                }}
                            >
								取消
							</Button>,
							<Button key="submit" type="primary" size="large"
								disabled={!editLrAccountPermission}
								onClick={() => {

									if (!(account && account.get('accountUuid'))) {
										return message.info('请选择账户')
									}
									if (!accountDate) {
										return message.info('请选择付款日期')
									}
								
									if (beCarryoverOut && !(carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationCategoryUuid']))) {
										return message.info('请选择处理类别')
									}
									if (propertyCostList.size && !propertyCost) {
										return message.info('请选择费用性质')
									}
									if (usedCarryoverProject && !(carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0, 'cardUuid']))) {
										return message.info('请选择项目')
									}

									confirmPayApprovalDetail([account, accountDate, beCarryoverOut, carryoverCategoryItem, carryoverProjectCardList, propertyCost], () => {
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', ''))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCostList', fromJS([])))
										cancelShowPayModal()
									})
									// dispatch(searchApprovalActions.payingApprovalProcessDetailInfo(selectList, account, payData, () => {
									// 	this.setState({ account: null, payData: formatDate().substr(0,10) })
									// 	callBack()
									// 	cancelShowPayModal()
									// }))
								}}>
								确定
							</Button>
						]}>
						<div className="approval-running-modal-wrap">
							<div className="approval-running-base-config-wrap">
								<div className="approval-running-card-input-wrap">
									<span className="approval-running-card-input-tip">日期：</span>
									<span className="approval-running-card-input">
										<DatePicker
											format={dateFormat}
											value={accountDate ? moment(accountDate, dateFormat) : ''}
											onChange={(date, dateString) => {
												dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', dateString))
											}}
										/>
									</span>
								</div>
								<div className="approval-running-card-input-wrap">
									<span className="approval-running-card-input-tip">账户：</span>
									<span className="approval-running-card-input">
										<XfnSelect
											showSearch
											value={account ? `${account.get('accountName')}` : ''}
											onSelect={(value,options) => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const poundageObj = options.props.poundage

												dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
													accountUuid: valueList[0],
													accountName: valueList[1]
												}) ))
											}}
										>
											{accountSelectList && accountSelectList.map((v, i) =>
												<Option
													key={i}
													value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
													poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
												>
													{v.get('name')}
												</Option>
											)}
										</XfnSelect>
									</span>
								</div>
								{
									beZeroInventory ?
									<ZeroInventory
										oriDate={accountDate}
										dispatch={dispatch}
										beCarryoverOut={beCarryoverOut}
										carryoverCategory={carryoverCategory}
										carryoverCategoryItem={carryoverCategoryItem}
										usedCarryoverProject={usedCarryoverProject}
										carryoverProjectCardList={carryoverProjectCardList}
										carryoverProjectList={carryoverProjectList}
										propertyCost={propertyCost}
										propertyCostList={propertyCostList}
									/>
									:
									null
								}
							</div>
						</div>
					</Modal>
					: null
				}
				{
					showReceiveModal ? 
					<Modal
						ref="modal2"
						visible={true}
						title="填写收款信息"
						onCancel={() => {

							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('formPos', ''))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', false))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('setAccount', false))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))

							cancelShowReceiveModal()
							cancelSetReceiveMoney()
						}}
						footer={[
							<Button key="back" type="ghost" size="large" onClick={() => {
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('formPos', ''))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', false))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('setAccount', false))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))

								cancelShowReceiveModal()
								cancelSetReceiveMoney()
							}}>
								取消
							</Button>,
							<Button key="submit" type="primary" size="large" disabled={!editLrAccountPermission}
								onClick={() => {

									if (!(account && account.get('accountUuid'))) {
										return message.info('请选择账户')
									}
									if (!accountDate) {
										return message.info('请选择收款日期')
									}
									
									const poundageCurrentCardList = approalCalculateState.get('poundageCurrentCardList')
									const poundageProjectCardList = approalCalculateState.get('poundageProjectCardList')
								
									if (poundageCurrentCardList.size && !poundageCurrentCardList.getIn([0, 'cardUuid'])) {
										return message.info('请选择往来单位')
									}
									if (poundageProjectCardList.size && !poundageProjectCardList.getIn([0, 'cardUuid'])) {
										return message.info('请选择项目')
									}

									confirmReceiveApprovalDetail([accountDate,  formPos === 'modal' ? true : setAccount, needUsedPoundage, account, receiveTotalMoney], () => {
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('formPos', ''))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('setAccount', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))

										cancelShowReceiveModal()
										cancelSetReceiveMoney()
									})
									// dispatch(searchApprovalActions.receiveApprovalProcessDetailInfo(selectList, accountUuid, payData, setAccount, needUsedPoundage, account, poundageAmount, receiveTotalMoney, () => {
									// 	this.setState({ setAccount: false, payData: formatDate().substr(0,10), account: null, poundageAmount: 0, needUsedPoundage: false  })
									// 	cancelShowReceiveModal()
									// 	callBack()
									// }))
								}}>
								确定
							</Button>
						]}>
						<div className="approval-running-modal-wrap">
							<div className="approval-running-base-config-wrap">
								<div className="approval-running-card-input-wrap">
									<span className="approval-running-card-input-tip">日期：</span>
									<span className="approval-running-card-input">
										<DatePicker
											format={dateFormat}
											value={accountDate ? moment(accountDate, dateFormat) : ''}
											onChange={(date, dateString) => {
												dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', dateString))
											}}
										/>
									</span>
								</div>
								<div className="approval-running-card-input-wrap">
									<span className="approval-running-card-input-tip">账户：</span>
									<span className="approval-running-card-input">
										<XfnSelect
											showSearch
											value={account ? `${account.get('accountName')}` : ''}
											onSelect={(value,options) => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const poundageObj = options.props.poundage
												const poundage = poundageObj.get('poundage')
												const poundageRate = poundageObj.get('poundageRate')
												const amount = receiveTotalMoney
												const sxAmount = ((Math.abs(amount || 0)*poundageRate/1000 > poundage) && poundage > 0) ? poundage : Math.abs(amount || 0)*poundageRate/1000
												
												dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
													accountUuid: valueList[0],
													accountName: valueList[1],
													poundage: poundageObj.toJS(),
													poundageAmount: (sxAmount || 0).toFixed(2)
												}) ))
												
												if (!poundageObj.get('needPoundage')) {
													dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
													dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
												}
											}}
										>
											{accountSelectList && accountSelectList.map((v, i) =>
											<Option
												key={i}
												value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
												poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
											>
												{v.get('name')}
											</Option>)}
										</XfnSelect>
									</span>
								</div>
								<div>
									<span style={{display: canSetAccount && formPos !== 'modal' ? '' : 'none'}}>
										<Checkbox checked={setAccount} onClick={() => {
											dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('setAccount', !setAccount))
										}}> 批量设置“明细账户”<Tooltip placement="bottom" title={'不勾选，已选择账户的明细保留原“明细账户”'}><Icon type="question-circle" /></Tooltip></Checkbox>
									</span>
								</div>
								{
									account && account.getIn(['poundage', 'needPoundage']) && receiveTotalMoney > 0 ? 
									<AccountPandge
										needUsedPoundage={needUsedPoundage}
										receiveTotalMoney={receiveTotalMoney}
										poundageAmount={account.get('poundageAmount')}
									/>
									: null
								}
							</div>
						</div>
					</Modal>
					: null
				}
				{
					showAccountModal ?
						<Modal
						ref="modal3"
						visible={true}
						title="填写挂账信息"
						onCancel={() => {
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', false))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
                            cancelShowAccountModal()
                        }}
						footer={[
							<Button key="back" type="ghost" size="large" onClick={() => {
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', false))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
								cancelShowAccountModal()
							}}>
								取消
							</Button>,
							<Button key="submit" type="primary" size="large" disabled={!editLrAccountPermission}
								onClick={() => {

									if (!accountDate) {
										return message.info('请选择挂账日期')
									}
								
									if (beCarryoverOut && !(carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationCategoryUuid']))) {
										return message.info('请选择处理类别')
									}
									if (propertyCostList.size && !propertyCost) {
										return message.info('请选择费用性质')
									}
									if (usedCarryoverProject && !(carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0, 'cardUuid']))) {
										return message.info('请选择项目')
									}

									confirmAccountingApprovalDetail([accountDate, beCarryoverOut, carryoverCategoryItem, carryoverProjectCardList, propertyCost], () => {
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
										cancelShowAccountModal()
									})
									// dispatch(searchApprovalActions.accountingApprovalProcessDetailInfo(selectList, accountDate, () => {
									// 	this.setState({ accountDate: formatDate().substr(0,10) })
									// 	cancelShowAccountModal()
									// 	callBack()
									// }))
								}}>
								确定
							</Button>
						]}>
						<div className="approval-running-modal-wrap">
							<div className="approval-running-base-config-wrap">
								<div className="approval-running-card-input-wrap">
									<span className="approval-running-card-input-tip">日期：</span>
									<span className="approval-running-card-input">
										<DatePicker
											format={dateFormat}
											value={accountDate ? moment(accountDate, dateFormat) : ''}
											onChange={(date, dateString) => {
												dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', dateString))
											}}
										/>
									</span>
								</div>
								{
									beZeroInventory ?
									<ZeroInventory
										oriDate={accountDate}
										dispatch={dispatch}
										beCarryoverOut={beCarryoverOut}
										carryoverCategory={carryoverCategory}
										carryoverCategoryItem={carryoverCategoryItem}
										usedCarryoverProject={usedCarryoverProject}
										carryoverProjectCardList={carryoverProjectCardList}
										carryoverProjectList={carryoverProjectList}
										propertyCost={propertyCost}
										propertyCostList={propertyCostList}
									/>
									:
									null
								}
							</div>
						</div>
					</Modal>
					: null
				}
				{
					showBookKeepingModal ?
						<Modal
						ref="modal4"
						visible={true}
						title="填写核记信息"
						onCancel={() => {
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('formPos', ''))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', false))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('handlingFeeType', 'INCLUDE'))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
                            cancelShowBookKeepingModal()
                        }}
						footer={[
							<Button key="back" type="ghost" size="large" onClick={() => {
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('formPos', ''))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', false))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('handlingFeeType', 'INCLUDE'))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
								cancelShowBookKeepingModal()
							}}>
								取消
							</Button>,
							<Button key="submit" type="primary" size="large" disabled={!editLrAccountPermission}
								onClick={() => {

									// if (!accountDate) {
									// 	return message.info('请选择挂账日期')
									// }
								
									// if (beCarryoverOut && !(carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationCategoryUuid']))) {
									// 	return message.info('请选择处理类别')
									// }
									// if (propertyCostList.size && !propertyCost) {
									// 	return message.info('请选择费用性质')
									// }
									// if (usedCarryoverProject && !(carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0, 'cardUuid']))) {
									// 	return message.info('请选择项目')
									// }

									confirmBookKeepingApprovalDetail([accountDate], () => {
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('formPos', ''))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', formatDate().substr(0,10)))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', false))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('handlingFeeType', 'INCLUDE'))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
										cancelShowBookKeepingModal()
									})
									// dispatch(searchApprovalActions.accountingApprovalProcessDetailInfo(selectList, accountDate, () => {
									// 	this.setState({ accountDate: formatDate().substr(0,10) })
									// 	cancelShowAccountModal()
									// 	callBack()
									// }))
								}}>
								确定
							</Button>
						]}>
						<div className="approval-running-modal-wrap">
							<div className="approval-running-base-config-wrap">
								<div className="approval-running-card-input-wrap">
									<span className="approval-running-card-input-tip">日期：</span>
									<span className="approval-running-card-input">
										<DatePicker
											format={dateFormat}
											value={accountDate ? moment(accountDate, dateFormat) : ''}
											onChange={(date, dateString) => {
												dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', dateString))
											}}
										/>
									</span>
								</div>
								{
									account && account.getIn(['poundage', 'needPoundage']) && receiveTotalMoney > 0 ? 
									<AccountPandge
										type={'核记'}
										needUsedPoundage={needUsedPoundage}
										receiveTotalMoney={receiveTotalMoney}
										poundageAmount={account.get('poundageAmount')}
										handlingFeeType={handlingFeeType}
										poundage={account.get('poundage')}
									/>
									: null
								}
							</div>
						</div>
					</Modal>
					: null
				}
			</div>
		)
	}
}
