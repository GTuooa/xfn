import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Select, TreeSelect, Button, message } from 'antd'
import { Icon } from 'app/components'
import { Amount, TableItem } from 'app/components'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { getCategorynameByType } from 'app/containers/Edit/LrAccount/common/common'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			dispatch,
			cardTemp,
			insertOrModify,
			acAssCategoryList,
			mediumAssCategoryList,
			depositAssCategoryList,
			flags,
			issues,
			calculateTemp,
			commonChargeTemp,
			CqzcTemp,
			runningCategory,
			lrCalculateState,
			editPermission
		} = this.props
// 开具发票、内部转账、转出未交、发票认证、结转成本
		const makeOutBusinessUuid = lrCalculateState.getIn(['invoicingTemp', 'makeOutBusinessUuid'])
		const internalTransferUuid = lrCalculateState.getIn(['InternalTransferTemp', 'uuid'])
		const turnOutBusinessUuid = lrCalculateState.getIn(['transferOutTemp', 'turnOutBusinessUuid'])
		const authBusinessUuid = lrCalculateState.getIn(['invoiceAuthTemp', 'authBusinessUuid'])
		const carryoverBusinessUuid = lrCalculateState.getIn(['costTransferTemp', 'carryoverBusinessUuid'])
		const runningDate = lrCalculateState.getIn(['costTransferTemp', 'runningDate'])
		const calInsertOrModify = lrCalculateState.getIn(['flags', 'insertOrModify'])
		const calRunningState = lrCalculateState.getIn(['costTransferTemp', 'runningState'])

		const categoryType = cardTemp.get('categoryType')
		const { categoryTypeObj, direction, } = getCategorynameByType(categoryType)
		const beManagemented = cardTemp.getIn([categoryTypeObj, 'beManagemented'])
		const amount = cardTemp.get('amount')
		const handleAmount = cardTemp.get('handleAmount')
		const currentAmount = cardTemp.get('currentAmount')
		const PageTab = flags.get('PageTab')
		const issuedate = flags.get('issuedate')
		const isQuery = flags.get('isQuery')
		const modify = flags.get('modify')
		const uuidList = flags.get('uuidList')
		const needRelaList = flags.get('needRelaList')
		const paymentType = flags.get('paymentType')
		const accountUuid = cardTemp.get('accountUuid')
		const runningUuid = cardTemp.get('uuid')
		const runningState = cardTemp.get('runningState')
		const runningType = cardTemp.get('runningType')
		const name = cardTemp.get('name')
		const scale = cardTemp.get('scale')
		const payableRate = cardTemp.get('payableRate')
		const outputRate = cardTemp.get('outputRate')
		const propertyCost = cardTemp.get('propertyCost')
		const billType = cardTemp.get('billType')
		const propertyPay = cardTemp.get('propertyPay')
		const propertyTax = cardTemp.get('propertyTax')
		const canBeCarryover = cardTemp.get('canBeCarryover')
		const beCarryover = cardTemp.get('beCarryover')
		const beBusiness = cardTemp.get('beBusiness')
		const assetType = cardTemp.get('assetType')
		const calculateHandleAmount = calculateTemp.get('handleAmount')
		const isQueryByBusiness = flags.get('isQueryByBusiness')
		const pzFailedButtonShow = flags.get('pzFailedButtonShow')
		const specialStateforAccrued = flags.get('specialStateforAccrued')
		const runningInsertOrModify = flags.get('runningInsertOrModify')
		const specialStateforAssets = flags.get('specialStateforAssets')
		const currentSwitchUuid = flags.get('currentSwitchUuid')
		const paymentInsertOrModify = flags.get('paymentInsertOrModify')
		const actualAmount = cardTemp.getIn([categoryTypeObj,'actualAmount'])
		const beCleaning = cardTemp.getIn([categoryTypeObj,'beCleaning'])
		const depreciationAmount = cardTemp.getIn([categoryTypeObj,'depreciationAmount'])
		const originalAssetsAmount = cardTemp.getIn([categoryTypeObj,'originalAssetsAmount'])
		const businessList = cardTemp.get('businessList')
		const cardUuid = cardTemp.get('uuid')
		const beReduce = cardTemp.get('beReduce')
		const offsetAmount = cardTemp.get('offsetAmount')
		const reduceAmount = cardTemp.get('reduceAmount')
		const calculateUuid = calculateTemp.get('uuid')
		const tax = cardTemp.get('tax')

		const refreshUuid = PageTab === 'business' ? cardUuid : calculateUuid

		let calUuid
		;({
			'LB_ZZ': () => {
				calUuid = internalTransferUuid
			},
			'LB_JZCB': () => {
				calUuid = carryoverBusinessUuid
			},
			'LB_FPRZ': () => {
				calUuid = authBusinessUuid
			},
			'LB_KJFP': () => {
				calUuid = makeOutBusinessUuid
			},
			'LB_ZCWJZZS': () => {
				calUuid = turnOutBusinessUuid
			},
		}[paymentType] || (() => ''))()
		// 业务流水 保存前要做的校验
		function beforeSaveCheck () {

			let errorList = []
			const asslist = document.getElementsByName('asslist')
			if (!name) {
				errorList.push('流水类别必填')
			}
			if(runningState !== 'STATE_FY_WF'
				&& runningState !== 'STATE_XC_JT'
				&& runningState !== 'STATE_YYWSR_WS'
				&& runningState !== 'STATE_YYWZC_WF'
				&& runningState !== 'STATE_CQZC_WF'
				&& runningState !== 'STATE_JK_WF'
				&& runningState !== 'STATE_TZ_WS'
				&& runningState !== 'STATE_ZB_LRFP'
				&& runningState !== 'STATE_SF_ZCWJSF'
				&& propertyCost !== 'XZ_CHBJ'
				&& runningState !== 'STATE_JK_JTLX'
				&& runningState !== 'STATE_TZ_JTGL'
				&& runningState !== 'STATE_TZ_JTLX'
				&& runningState !== 'STATE_TZ_WS'
				&& runningState !== 'STATE_SF_JT'
				&& runningState !== 'STATE_CQZC_JZSY'
				&& runningState !== 'STATE_CQZC_WS'
				&& assetType !== 'XZ_ZJTX'
				&& !specialStateforAssets) {
					if(!isQueryByBusiness && (categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC') && runningState !== 'STATE_YYSR_DJ' && runningState !== 'STATE_YYZC_DJ') {
						if (beManagemented && currentAmount>0) {
							if (!accountUuid) {
								errorList.push('账户必填')
							}
						} else if(!beManagemented) {
							if (!accountUuid) {
								errorList.push('账户必填')
							}
						}
					}else if (isQueryByBusiness && (categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC') && runningState !== 'STATE_YYSR_DJ' && runningState !== 'STATE_YYZC_DJ') {

					} else if (categoryType === 'LB_XCZC'  ) {
						if (!accountUuid && actualAmount != 0) {
							errorList.push('账户必填')
						}

					} else if (beReduce && reduceAmount > 0 || offsetAmount > 0){
						if (handleAmount >0 && !accountUuid) {
							errorList.push('账户必填')
						}
					} else if (!accountUuid) {
						errorList.push('账户必填')
					}
				}
			if (cardTemp.get('categoryUuid') === '') {
				errorList.push('流水类别必填')
			}
			if (cardTemp.get('runningDate') === '') {
				errorList.push('日期必填')
			}
			if (cardTemp.get('runningAbstract') === '') {
				errorList.push('摘要必填')
			} else if (cardTemp.get('runningAbstract').length > 45) {
				errorList.push('摘要最长45个字符')
			}
			if ((!amount || amount == 0 ) &&  propertyPay !== 'SX_ZFGJJ' && propertyPay !== 'SX_SHBX' && propertyTax !== 'SX_ZZS' && !beReduce) { //社会保险和公积金无需填金额amount
				errorList.push('金额必填')
			} else if (Number(amount) >= 1000000000000) {
				errorList.push('金额最大支持千亿级')
			}
			// if(Number(currentAmount) > Number(amount) && runningState === 'STATE_YYSR_TS'){
			// 	errorList.push('本次付款金额不能大于总金额')
			// }

			if(runningState === 'STATE_ZF_SH' && (!amount || amount == 0 )){
				errorList.push('金额必填')
			}
			if(runningState === '') {
				errorList.push('流水状态必选')
			}
			if(categoryType === 'LB_JK' || categoryType === 'LB_TZ' || categoryType === 'LB_ZB' || categoryType === 'LB_CQZC') {
				if (!propertyCost && categoryType !== 'LB_CQZC') {
					errorList.push('处理类别必选')
				} else if (categoryType === 'LB_CQZC' && !assetType) {
					errorList.push('处理类别必选')
				}
			}
			if (runningState === 'STATE_CQZC_JZSY'|| assetType === 'XZ_CZZC' && beCarryover) {
				if (Number(depreciationAmount) > Number(originalAssetsAmount)) {
					errorList.push('折旧金额不能大于原值')
				}
			}

			// if (insertOrModify == 'modify' && Math.abs(cardTemp.get('amount')) < Math.abs(cardTemp.get('handleAmount'))) {
			// 	errorList.push('金额不可小于所有已核销金额')
			// }
			if(runningState
			&& runningState != 'STATE_YYSR_DJ'
			&& runningState != 'STATE_YYZC_DJ'
			&& runningState != 'STATE_FY_DJ'
			&& categoryType != 'LB_XCZC'
			&& categoryType != 'LB_SFZC'
			&& categoryType != 'LB_ZSKX'
			&& categoryType != 'LB_ZFKX'
			&& categoryType != 'LB_ZZ'
			&& categoryType != 'LB_ZB'
			&& categoryType != 'LB_JK'
			&& categoryType != 'LB_TZ'
			&& (scale !== 'small' || (direction === 'debit' && assetType !== 'XZ_GJZC'))
			&& (categoryType !== 'LB_CQZC' || categoryType === 'LB_CQZC' && propertyCost !== '')
			&& categoryType !== 'LB_YYWSR'
			&& categoryType !== 'LB_YYWZC'
			&& runningType !== 'LX_JZSY_SS'
			&& runningType !== 'LX_JZSY_SY'
			&& assetType !== 'XZ_ZJTX'
			&& !specialStateforAssets) {
				if (!billType && scale !== 'isEnable') {
					// errorList.push('票据类型必填')
				}
			}
			return errorList
		}
		//收付管理 保存前的校验
		function beforeSaveCheckByPayMangement (calculateTemp, flags) {
			let errorList = []
			const accountUuid = calculateTemp.get('accountUuid')
			const runningAbstract = calculateTemp.get('runningAbstract')
			const handlingAmount = calculateTemp.get('handlingAmount')
			const beMoed = calculateTemp.get('beMoed')
			const moedAmount = calculateTemp.get('moedAmount')
			const totalAmount = flags.get('totalAmount')
			const selectList = flags.get('selectList')
			if (!runningAbstract) {
				errorList.push('摘要必填')
			}
			if ((!beMoed || beMoed && moedAmount == '') && !handlingAmount && Math.abs(totalAmount) !== 0) {
				errorList.push('金额必填')
			} else if (!selectList.size) {
				errorList.push('核账流水必须大于一条')
			} else if (Math.abs(totalAmount) < Math.abs(handlingAmount)) {
				errorList.push('待核销金额必须大于等于核销金额')
			}
			if (handlingAmount > 0 && !accountUuid) {
				errorList.push('账户必填')
			}

			return errorList
		}
		function beforeShareCheck() {
			let errorList = []
			const amount = commonChargeTemp.get('amount')
			const paymentList = commonChargeTemp.get('paymentList')
			const projectCard = commonChargeTemp.get('projectCard')
			let curAmount = projectCard.reduce((total,item) => total+Number(item.get('amount')),0)
			if (paymentList.every(v => !v.get('beSelect'))) {
				errorList.push('核账流水必须大于一条')
			} else if (Number(amount) != curAmount.toFixed(2)) {
				errorList.push('分摊金额总和必须等于勾选流水总待处理金额')
			}
			return errorList
		}
		//处置损益校验
		function beforeJzsyCheck() {
			let errorList = []
			const usedProject = CqzcTemp.getIn(['detail','usedProject'])
			const projectCard = CqzcTemp.getIn(['detail','projectCard'])
			if (usedProject && !projectCard.getIn([0,'uuid'])) {
				errorList.push('项目必填')
			}
			return errorList
		}
		return (
					<div className="title">
						{
							!isQuery  || PageTab ==='business'?
								specialStateforAccrued?
									<div>
										<Button
											type="ghost"
											disabled={!editPermission}
											className="title-right"
											onClick={() => {
												// dispatch(lrAccountActions.initLrAccountAfterFailed())
												dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'specialStateforAccrued'], false))
											}}
											>
											修改
										</Button>
										<Button
											type="ghost"
											className="title-right"
											disabled={!editPermission}
											onClick={() => {
												dispatch(lrAccountActions.justNewRunningbusiness(PageTab,paymentType))
												if(paymentType == 'LB_JZCB'){
													dispatch(lrAccountActions.getCostStockList(runningDate,calRunningState))
												} else if (paymentType == 'LB_JZSY') {
													dispatch(lrAccountActions.getAssetsCleaningCategory())
												}
											}}
											>
											新增
										</Button>
										<Button
											type="ghost"
											className="title-right"
											onClick={() => {
												dispatch(lrAccountActions.changeLrAccountCommonString('',['flags', 'runningInsertOrModify'], 'modify'))
												dispatch(lrAccountActions.changeLrAccountCommonString('',['flags', 'isQueryByBusiness'], true))
												if(paymentType == 'LB_ZZ' || paymentType == 'LB_JZCB' ||paymentType == 'LB_FPRZ' ||paymentType == 'LB_KJFP' ||paymentType == 'LB_ZCWJZZS'){
													dispatch(lrAccountActions.refreshRunningbusiness(calUuid,paymentType))
												}else{
													dispatch(lrAccountActions.refreshRunningbusiness(refreshUuid,paymentType))
												}
											}}
											>
											刷新
										</Button>
									</div>
									:
									<div>
									{
										cardTemp.get('categoryUuid') && PageTab ==='business' && runningInsertOrModify === 'insert' && runningState !== 'STATE_CQZC_JZSY'?
										<Button
											type="ghost"
											className="title-right"
											onClick={() => {
												dispatch(lrAccountActions.selectAccountRunningCategory(cardTemp.get('categoryUuid'),'', 'runningCategory', scale, payableRate, outputRate))
											}}
											>
											刷新
										</Button>:''
									}
									{
										(isQueryByBusiness || runningInsertOrModify === 'modify') && PageTab ==='business' ?
										<Button
											type="ghost"
											className="title-right"
											onClick={() => {
												dispatch(lrAccountActions.changeLrAccountCommonString('',['flags', 'runningInsertOrModify'], 'modify'))
												dispatch(lrAccountActions.changeLrAccountCommonString('',['flags', 'isQueryByBusiness'], true))
												if(paymentType == 'LB_ZZ' || paymentType == 'LB_JZCB' ||paymentType == 'LB_FPRZ' ||paymentType == 'LB_KJFP' ||paymentType == 'LB_ZCWJZZS'){
													dispatch(lrAccountActions.refreshRunningbusiness(calUuid,paymentType))
												}else{
													dispatch(lrAccountActions.refreshRunningbusiness(refreshUuid,paymentType))
												}
											}}
											>
											刷新
										</Button>
										: ''
									}
									{
										(isQueryByBusiness || runningInsertOrModify === 'modify') && PageTab ==='business' || (PageTab ==='payment' && (calInsertOrModify === 'modify' || modify ))?
										<Button
											type="ghost"
											className="title-right"
											disabled={!editPermission}
											onClick={() => {
												dispatch(lrAccountActions.justNewRunningbusiness(PageTab,paymentType))
												if(paymentType == 'LB_JZCB'){
													dispatch(lrAccountActions.getCostStockList(runningDate,calRunningState))
												} else if (paymentType == 'LB_JZSY') {
													dispatch(lrAccountActions.getAssetsCleaningCategory())
												}
											}}
											>
											新增
										</Button>
										: <Button
											type="ghost"
											className="title-right"
											disabled={!editPermission}
											// disabled={PageTab ==='payment' && paymentType === 'LB_ZCWJZZS'}
											onClick={() => {
												if(PageTab ==='business' || PageTab === 'payment' && paymentType === '') {
													const errorList = beforeSaveCheck()
													if (errorList.length) {
														message.info(errorList.join(','))
													} else {
														dispatch(lrAccountActions.saveRunningbusiness(true))
													}
												} else if (PageTab ==='payment' && paymentType === 'LB_SFGL') {
													const errorList = beforeSaveCheckByPayMangement(calculateTemp, flags)
													if (errorList.length) {
														message.info(errorList.join(','))
													} else {
													dispatch(lrAccountActions.insertlrAccount(true))
													}
												} else if (PageTab ==='payment' && paymentType === 'LB_JZCB') {
													dispatch(lrCalculateActions.insertOrModifyLrCostTransferPz(true))
													dispatch(lrAccountActions.getCostStockList(runningDate,calRunningState))
												} else if (PageTab ==='payment' && paymentType === 'LB_FPRZ') {
													dispatch(lrCalculateActions.insertOrModifyLrInvoiceAuthPz(true))
												} else if (PageTab ==='payment' && paymentType === 'LB_KJFP') {
													dispatch(lrCalculateActions.insertOrModifyLrInvoicingPz(true))
												} else if (PageTab ==='payment' && paymentType === 'LB_ZZ') {
													dispatch(lrCalculateActions.insertOrModifyLrInternalTransfer(true))
												} else if (PageTab ==='payment' && paymentType === 'LB_ZJTX') {
													dispatch(lrCalculateActions.insertOrModifyLrDepreciation(true))
												}  else if (PageTab ==='payment' && paymentType === 'LB_ZCWJZZS') {
													dispatch(lrCalculateActions.insertOrModifyLrTransferOutPz(true))
												} else if (PageTab ==='payment' && paymentType === 'LB_GGFYFT') {
													const errorList = beforeShareCheck()
													if (errorList.length) {
														message.info(errorList.join(','))
													} else {
													dispatch(lrAccountActions.insertProjectShare(true))
													}
												} else if (PageTab ==='payment' && paymentType === 'LB_JZSY') {
													const errorList = beforeJzsyCheck()
													if (errorList.length) {
														message.info(errorList.join(','))
													} else {
														dispatch(lrAccountActions.insertlrAccountJzsy(true))
													}
												} else {
													thirdParty.Alert('尽情期待')
													console.log('尽情期待')
												}

											}}
											>
											保存并新增
										</Button>

									}
									<Button
										type="ghost"
										disabled={!editPermission}
										className="title-right"
										// disabled={PageTab ==='payment'}
										onClick={() => {
											if(PageTab ==='business' || PageTab === 'payment' && paymentType === '') {
												const errorList = beforeSaveCheck()
												if (errorList.length) {
													message.info(errorList.join(','))
												} else {
													dispatch(lrAccountActions.saveRunningbusiness())
												}

											} else if (PageTab ==='payment' && paymentType === 'LB_SFGL') {
												const errorList = beforeSaveCheckByPayMangement(calculateTemp, flags)
												if (errorList.length) {
													message.info(errorList.join(','))
												} else {
												dispatch(lrAccountActions.insertlrAccount())
												}
											} else if(PageTab ==='payment' && paymentType === 'LB_JZCB') {
												dispatch(lrCalculateActions.insertOrModifyLrCostTransferPz())
											} else if (PageTab ==='payment' && paymentType === 'LB_FPRZ') {
												dispatch(lrCalculateActions.insertOrModifyLrInvoiceAuthPz())
											} else if (PageTab ==='payment' && paymentType === 'LB_KJFP') {
												dispatch(lrCalculateActions.insertOrModifyLrInvoicingPz())
											}else if (PageTab ==='payment' && paymentType === 'LB_ZZ') {
												dispatch(lrCalculateActions.insertOrModifyLrInternalTransfer())
											} else if (PageTab ==='payment' && paymentType === 'LB_ZJTX') {
												dispatch(lrCalculateActions.insertOrModifyLrDepreciation())
											} else if (PageTab ==='payment' && paymentType === 'LB_ZCWJZZS') {
												dispatch(lrCalculateActions.insertOrModifyLrTransferOutPz())
												// thirdparty.alert('尽情期待')
											} else if (PageTab ==='payment' && paymentType === 'LB_GGFYFT') {
												const errorList = beforeShareCheck()
												if (errorList.length) {
													message.info(errorList.join(','))
												} else {
												dispatch(lrAccountActions.insertProjectShare())
												}
											} else if (PageTab ==='payment' && paymentType === 'LB_JZSY') {
												const errorList = beforeJzsyCheck()
												if (errorList.length) {
													message.info(errorList.join(','))
												} else {
													dispatch(lrAccountActions.insertlrAccountJzsy())
												}
											} else {
												thirdParty.Alert('尽情期待')
											}
										}}
										>
										保存
									</Button>




								</div>
							:
							<div>
								<Button
									type="ghost"
									className="title-right"
									onClick={() => {
										dispatch(lrAccountActions.changeLrAccountCommonString('',['flags', 'runningInsertOrModify'], 'modify'))
										dispatch(lrAccountActions.changeLrAccountCommonString('',['flags', 'isQueryByBusiness'], true))
										if(paymentType == 'LB_JZCB'){
											dispatch(lrAccountActions.getCostStockList(runningDate,calRunningState))
										}
										if(paymentType == 'LB_ZZ' || paymentType == 'LB_JZCB' ||paymentType == 'LB_FPRZ' ||paymentType == 'LB_KJFP' ||paymentType == 'LB_ZCWJZZS'){
											dispatch(lrAccountActions.refreshRunningbusiness(calUuid,paymentType))
										}else{
											dispatch(lrAccountActions.refreshRunningbusiness(refreshUuid,paymentType))
										}
									}}
									>
									刷新
								</Button>
								<Button
									type="ghost"
									disabled={!editPermission}
									className="title-right"
									disabled={!editPermission}
									onClick={() => {
										dispatch(lrAccountActions.changeLrAccountCommonString('',['flags', 'isQuery'], false))
										dispatch(lrAccountActions.changeLrAccountCommonString('',['flags', 'modify'], true))
										dispatch(lrAccountActions.changeLrAccountCommonString('calculate','handlingAmount', calculateHandleAmount)) //查询流水跳到收付管理修改时处理金额赋值当前处理金额
										dispatch(lrAccountActions.accountTotalAmount())

									}}
									>
									修改
								</Button>
								<Button
									type="ghost"
									className="title-right"
									disabled={!editPermission}
									onClick={() => {
										dispatch(lrAccountActions.justNewRunningbusiness(PageTab,paymentType))
										if(paymentType == 'LB_JZCB'){
											dispatch(lrAccountActions.getCostStockList(runningDate,calRunningState))
										} else if (paymentType == 'LB_JZSY') {
											dispatch(lrAccountActions.getAssetsCleaningCategory())
										}
									}}
									>
									新增
								</Button>
							</div>
						}
						{
							needRelaList && (PageTab === 'business' && isQueryByBusiness || PageTab === 'payment' && (calInsertOrModify === 'modify' || paymentInsertOrModify === 'modify')) && uuidList.size?
							<div>
								<Button
									type="ghost"
									className="title-right"
									disabled={uuidList.some((v, i)=> {
										const uuid = v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')
										return uuid === currentSwitchUuid && i === uuidList.size-1
										})
									}
									onClick={() => {
										const index = uuidList.findIndex(v => {
											const uuid = v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')
											return uuid === currentSwitchUuid
										}) +1
										dispatch(cxlsActions.getBusinessBeforeSwitch(uuidList.get(index),uuidList))
									}}
									>
									<Icon type="caret-right" />
								</Button>
								<Button
									type="ghost"
									className="title-right"
									disabled={uuidList.some((v, i)=> {
										const uuid = v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')
										return uuid === currentSwitchUuid && i === 0
										})
									}
									onClick={() => {
										const index = uuidList.findIndex(v => {
											const uuid = v.get('parentUuid')?v.get('parentUuid'):v.get('uuid')
											return uuid === currentSwitchUuid
										}) -1
										dispatch(cxlsActions.getBusinessBeforeSwitch(uuidList.get(index),uuidList))
									}}
									>
									<Icon type="caret-left" />
								</Button>
							</div>
							:''
						}

					</div>
		)
	}
}
