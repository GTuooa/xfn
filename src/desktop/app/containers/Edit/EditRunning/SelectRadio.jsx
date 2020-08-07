import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { getCategorynameByType } from './common/common'
import { RunCategorySelect, AcouontAcSelect } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Tooltip } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'

@immutableRenderDecorator
export default
class SelectRadio extends React.Component {
	constructor() {
		super()
		this.state = {
		}
	}
	componentWillReceiveProps(nextprops) {
		//state改变预置流水摘要等信息
		const newState = nextprops.oriTemp.get('oriState')
		const accounts = nextprops.oriTemp.get('accounts')
		const insertOrModify = nextprops.insertOrModify
		const disabledChange = nextprops.disabledChange
		if (newState !== this.props.oriTemp.get('oriState') && disabledChange) {
			this.props.dispatch(configCallbackActions.changeViewString('disabledChange', false))

		}
		if (newState !== this.props.oriTemp.get('oriState') && insertOrModify === 'insert' && !disabledChange) {
			this.props.dispatch(editRunningActions.changeStateAndAbstract(nextprops.oriTemp,newState))
			this.props.dispatch(editRunningActions.changeStateInitOriTemp(newState))
		} else if (newState !== this.props.oriTemp.get('oriState') && insertOrModify === 'modify' && !disabledChange) {
			this.props.dispatch(editRunningActions.changeLrAccountCommonString('ori','usedAccounts',false))
			this.props.dispatch(editRunningActions.changeLrAccountCommonString('ori','accounts',accounts.slice(0,1)))
		}
	}

	render() {
		const {
            isModify,
            oriTemp,
            dispatch,
            beSpecial,
            oriState,
            payOrReceive,
			flags,
			disabled,
			specialStateforAccrued,
			insertOrModify

		} = this.props
		const categoryType = oriTemp.get('categoryType')
		const {
			propertyShow,
			categoryTypeObj,
			direction,
			showInvoice,
			isShowAbout,
			specialState,
		} = getCategorynameByType(categoryType)
		const propertyPay = oriTemp.get('propertyPay')
		const categoryUuid = oriTemp.get('categoryUuid')
		const beAccrued = oriTemp.getIn([categoryTypeObj, 'beAccrued'])
		const beWelfare = oriTemp.getIn([categoryTypeObj, 'beWelfare'])
		const propertyTax = oriTemp.get('propertyTax')
		const beTurnOut = oriTemp.getIn([categoryTypeObj,'beTurnOut'])
		const beInAdvance = oriTemp.getIn([categoryTypeObj,'beInAdvance'])
		const beSellOff = oriTemp.getIn([categoryTypeObj,'beSellOff'])
		const propertyCarryover = oriTemp.getIn([categoryTypeObj,'propertyCarryover'])
		const beWithholding = oriTemp.getIn([categoryTypeObj,'beWithholding'])
		const beWithholdSocial = oriTemp.getIn([categoryTypeObj,'beWithholdSocial'])
		const beWithholdTax = oriTemp.getIn([categoryTypeObj,'beWithholdTax'])
		const handleType =oriTemp.get('handleType')
		const propertyInvest =oriTemp.get('propertyInvest')
		const handleAmount = oriTemp.get('handleAmount')
		const runningType = oriTemp.get('runningType')
		const pendingStrongList = oriTemp.get('pendingStrongList')
		const strongList = oriTemp.get('strongList')
		const beDeposited = oriTemp.getIn([categoryTypeObj,'beDeposited'])
		const assetType = oriTemp.get('assetType')
		const oriDate = oriTemp.get('oriDate')
		const stockRange = oriTemp.getIn([categoryTypeObj,'stockRange'])
		const contactsRange = oriTemp.getIn([categoryTypeObj,'contactsRange'])
		return (
					handleType!=='JR_HANDLE_QDJK'
				&& handleType!=='JR_HANDLE_CHBJ'
				&& handleType!=='JR_HANDLE_DWTZ'
				&& handleType!=='JR_HANDLE_SHTZ'
				&& handleType!=='JR_HANDLE_ZZ'
				&& handleType!=='JR_HANDLE_JZ'
				&& propertyTax !== 'SX_GRSF'?
            <div className="edit-running-modal-list-item" style={{minHeight:'auto'}}>
				<label></label>
				{/* 收入支出 */}
				{
					(categoryType ==='LB_YYSR' ||categoryType ==='LB_YYZC') ?
					<div>
						<RadioGroup
							disabled={insertOrModify === 'modify' && strongList.size}
							onChange={e => {
								dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
								dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
								if (propertyCarryover === 'SX_HW') {
									dispatch(editRunningActions.getStockCardList(e.target.value,stockRange))
								}
								// dispatch(editRunningActions.getFirstStockCardList(stockRange,e.target.value))
							}}

							value={oriState}
							>
								<Radio
								key="a"
								value={direction === "debit" ? 'STATE_YYSR_DJ':'STATE_YYZC_DJ'}
								disabled={!beDeposited}
							><Tooltip placement="topLeft" title={`${!beDeposited?'流水设置中未启用':''}`}>{`${direction === "debit" ? '预收' : '预付'}`}</Tooltip></Radio>
							<Radio key="b" value={direction === "debit" ? 'STATE_YYSR_XS' : 'STATE_YYZC_GJ'} >{`${direction === "debit" ? '销售' : '购进'}`}</Radio>
							<Radio key="c" value={direction === "debit" ? 'STATE_YYSR_TS':'STATE_YYZC_TG'} disabled={!beSellOff}><Tooltip placement="topLeft" title={`${!beSellOff?'流水设置中未启用':''}`}>{`${direction === "debit" ? '退销' : '退购'}`}</Tooltip></Radio>
						</RadioGroup>
					</div>
					:
					null
				}
				{/* 费用支出 */}
				{
					categoryType ==='LB_FYZC'?
					<div>
						<RadioGroup
							disabled={insertOrModify === 'modify' && strongList.size}
							onChange={e => {
								dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
								dispatch(editRunningActions.getFirstContactsCardList(contactsRange,e.target.value))
								dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
								if (insertOrModify === 'modify') {
									dispatch(editRunningActions.changeModifyState(e.target.value))
								}
							}}
							value={oriState}
						>
							<Radio key="a" value={'STATE_FY_DJ'} disabled={!beDeposited}><Tooltip placement="topLeft" title={`${!beDeposited?'流水设置中未启用':''}`}>预付</Tooltip></Radio>
							<Radio key="d" value={'STATE_FY'} >发生</Radio>
						</RadioGroup>
						</div>
					:
					null
					}
					{/* 营业外收入*/}
					{/* {
						categoryType ==='LB_YYWSR' ?
						<div>
		                    <RadioGroup
								//disabled={insertOrModify === 'modify'}
		                        onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.getFirstContactsCardList(contactsRange,e.target.value))
		                            dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
		                        }}

		                        value={oriState}
		                        >
		                        <Radio key="f" value={'STATE_YYWSR_YS'} >已收款</Radio>
		                        <Radio key="g" value={'STATE_YYWSR_WS'} disabled={!beManagemented}><Tooltip placement="topLeft" title={`${!beManagemented?'流水设置中未启用':''}`}>未收款</Tooltip></Radio>
		                    </RadioGroup>
		                </div>
						:
						null
					} */}
					{/* 投资*/}
					{
						categoryType ==='LB_TZ' && handleType === 'JR_HANDLE_QDSY'?
						<div>
							<RadioGroup
								disabled={insertOrModify === 'modify'}
								onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
									if (e.target.value === 'STATE_TZ_SRGL' || e.target.value === 'STATE_TZ_SRLX') {
										dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Invest'))
									}
								}}

								value={oriState}
								>
								<Radio key="j" value={'STATE_TZ_JTGL'} style={{display:propertyInvest === 'SX_GQ'?'':'none'}} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提股利</Tooltip></Radio>
								<Radio key="k" value={'STATE_TZ_SRGL'} style={{display:propertyInvest === 'SX_GQ'?'':'none'}}>收入股利</Radio>
								<Radio key="l" value={'STATE_TZ_JTLX'} style={{display:propertyInvest === 'SX_ZQ'?'':'none'}} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提利息</Tooltip></Radio>
								<Radio key="m" value={'STATE_TZ_SRLX'} style={{display:propertyInvest === 'SX_ZQ'?'':'none'}}>收入利息</Radio>
							</RadioGroup>
						</div>
						:
						null
					}
					{/* 营业外支出*/}
					{/* {
						categoryType ==='LB_YYWZC'?
						<div>
							<RadioGroup
								//disabled={insertOrModify === 'modify'}
								onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.getFirstContactsCardList(contactsRange,e.target.value))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
								}}

								value={oriState}
								>
								<Radio key="n" value={'STATE_YYWZC_YF'} >已付款</Radio>
								<Radio key="o" value={'STATE_YYWZC_WF'} disabled={!beManagemented}><Tooltip placement="topLeft" title={`${!beManagemented?'流水设置中未启用':''}`}>未付款</Tooltip></Radio>
							</RadioGroup>
						</div>
						:
						null
					} */}
					{/* 借款*/}
					{
						categoryType ==='LB_JK' && handleType === 'JR_HANDLE_CHLX'?
						<div>
							<RadioGroup
								disabled={insertOrModify === 'modify' && strongList.size}
								onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
									e.target.value === 'STATE_JK_ZFLX' && dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Loan'))
								}}

								value={oriState}
								>
								<Radio key="sa" value={'STATE_JK_JTLX'} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提利息</Tooltip></Radio>
								<Radio key="t" value={'STATE_JK_ZFLX'}>支付利息</Radio>
							</RadioGroup>
						</div>
						:
						null
					}
					{/* 薪酬支出 */}
					{
						categoryType ==='LB_XCZC' ?
						<div >
							<RadioGroup
								disabled={insertOrModify === 'modify'}
								onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
									if (e.target.value === 'STATE_XC_FF' || e.target.value === 'STATE_XC_JN') {
									dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Payment'))
									}
									if ((beWithholding || beWithholdSocial) && propertyPay ==='SX_GZXJ') {
										dispatch(editRunningActions.getJrPaymentAmountInfo())
									}
									if (beWithholdTax && name.propertyPay ==='SX_GZXJ') {
										dispatch(editRunningActions.getJrPaymentTaxInfo())
									}
								}}
								value={oriState}
							>
								{
									insertOrModify === 'modify' && oriState !== 'STATE_XC_DK' && oriState !== 'STATE_XC_DJ' || insertOrModify === 'insert'?
									<Radio key="v" value={'STATE_XC_JT'} disabled={!beAccrued && !beWelfare}><Tooltip placement="topLeft" title={`${!beAccrued && !beWelfare?'流水设置中未启用':''}`}>计提</Tooltip></Radio>
									:''
								}
								{
									insertOrModify === 'modify' && oriState !== 'STATE_XC_DK' && oriState !== 'STATE_XC_DJ' && propertyPay !== 'SX_FLF' || insertOrModify === 'insert'  && propertyPay !== 'SX_FLF'?
									<Radio
										key="x"
										value={propertyPay ==='SX_GZXJ' || propertyPay ==='SX_QTXC'?'STATE_XC_FF':'STATE_XC_JN'}
										>
											{propertyPay ==='SX_GZXJ' || propertyPay ==='SX_QTXC' ?'发放':'缴纳'}
									</Radio>
									:''
								}
								{
									propertyPay === 'SX_FLF'?
									<Radio key="x" value={'STATE_XC_FF'}>支付</Radio>:''
								}
								{
									oriState === 'STATE_XC_DK'?
									<Radio key="x" value={'STATE_XC_DK'}>代扣</Radio>:''
								}
								{
									oriState === 'STATE_XC_DJ'?
									<Radio key="x" value={'STATE_XC_DJ'}>代缴</Radio>:''
								}
							</RadioGroup>
						</div>
						:
						null
					}
					{/* 税费支出 */}
					{
						categoryType ==='LB_SFZC' ?
						<div>
							<RadioGroup
								disabled={insertOrModify === 'modify'}
								onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
									if (e.target.value === 'STATE_SF_JN' && (beAccrued || beInAdvance || propertyTax === 'SX_ZZS')) {
										dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Vat'))
										propertyTax && dispatch(editRunningActions.getJrVatPrepayList('STATE_SF_JN'))
									}
									if (e.target.value === 'STATE_SF_ZCWJZZS') {
										dispatch(editRunningActions.getTransferAmount())
									}
								}}

								value={oriState}
								>
								<Radio key="z" value={'STATE_SF_JT'} style={{display:(propertyTax === 'SX_QTSF' || propertyTax === 'SX_QYSDS') && oriState !== 'STATE_SF_SFJM'?'':'none'}} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提</Tooltip></Radio>
								<Radio key="ab" value={'STATE_SF_YJZZS'} style={{display:propertyTax === 'SX_ZZS' && oriState !== 'STATE_SF_SFJM' ?'':'none'}} disabled={!beInAdvance}><Tooltip placement="topLeft" title={`${!beInAdvance?'流水设置中未启用':''}`}>预缴增值税</Tooltip></Radio>
								<Radio key="aa" value={'STATE_SF_ZCWJZZS'} style={{display:propertyTax === 'SX_ZZS'?'':'none'}} >转出未交增值税</Radio>
								<Radio key="aa" value={'STATE_SF_JN'} style={{display:oriState !== 'STATE_SF_SFJM'?'':'none'}} >缴纳</Radio>
								{
									oriState === 'STATE_SF_SFJM'?
										<Radio key="aa" value={'STATE_SF_SFJM'} >减免</Radio>:''
								}
							</RadioGroup>
						</div>
						:
						null
					}
					{/* 暂收 */}
					{
						categoryType ==='LB_ZSKX'?
						<div>
							<RadioGroup
								disabled={insertOrModify === 'modify' && strongList.size}
								onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
									if (e.target.value === 'STATE_ZS_TH') {
										dispatch(editRunningActions.getPaymentManageList(oriDate))
									}

								}}

								value={oriState}
								>
									<Radio key="ba" value={'STATE_ZS_SQ'} >收取</Radio>
									<Radio key="ca" value={'STATE_ZS_TH'} >退还</Radio>

							</RadioGroup>
						</div>
						:
						null
					}
					{/* 暂付 */}
					{
						categoryType ==='LB_ZFKX'?
						<div>
							<RadioGroup
								disabled={insertOrModify === 'modify' && strongList.size}
								onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
									if (e.target.value === 'STATE_ZF_SH') {
										dispatch(editRunningActions.getPaymentManageList(oriDate))
									}
								}}

								value={oriState}
								>
									<Radio key="ae" value={'STATE_ZF_FC'} >付出</Radio>
									<Radio key="af" value={'STATE_ZF_SH'} >收回</Radio>

							</RadioGroup>
						</div>
						:
						null
					}
					{/* 资本*/}
					{
						handleType==='JR_HANDLE_LRFP' ?
						<div>
							<RadioGroup
								disabled={insertOrModify === 'modify'}
								onChange={e => {
									dispatch(editRunningActions.changeStateAndAbstract(oriTemp,e.target.value))
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriState', e.target.value))
									e.target.value === 'STATE_ZB_ZFLR' && dispatch(editRunningActions.getJrNotHandleList(categoryUuid,'Capital'))
								}}

								value={oriState}
								>
								<Radio key="ah" value={'STATE_ZB_LRFP'} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>利润分配</Tooltip></Radio>
								<Radio key="bj" value={'STATE_ZB_ZFLR'} >支付利润</Radio>
							</RadioGroup>
						</div>
						:
						null
					}
				</div>
				:
				null

		)
	}
}
