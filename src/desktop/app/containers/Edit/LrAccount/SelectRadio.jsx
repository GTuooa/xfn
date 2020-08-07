import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Tooltip } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option
import { toJS } from 'immutable'

import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

@immutableRenderDecorator
export default
class SelectRadio extends React.Component {
	constructor() {
		super()
		this.state = {
		}
	}


	render() {
		const {
            isModify,
            cardTemp,
            dispatch,
            beSpecial,
            beDeposited,
            runningState,
            payOrReceive,
            beManagemented,
			flags,
			disabled,
			specialStateforAccrued

		} = this.props
		const categoryType = cardTemp.get('categoryType')
		let showManagemented, propertyShow, categoryTypeObj
		let direction = 'debit'
		let isShowAbout = false
		;({
			'LB_YYSR': () => {
				showManagemented = true
				propertyShow = '营业收入'
				categoryTypeObj = 'acBusinessIncome'
			},
			'LB_YYZC': () => {
				showManagemented = true
				propertyShow = '营业支出'
				categoryTypeObj = 'acBusinessExpense'
				direction = 'credit'
			},
			'LB_YYWSR': () => {
				showManagemented = true
				propertyShow = '营业外收入'
				categoryTypeObj = 'acBusinessOutIncome'
				isShowAbout = true
			},
			'LB_YYWZC': () => {
				showManagemented = true
				propertyShow = '营业外支出'
				categoryTypeObj = 'acBusinessOutExpense'
				direction = 'credit'
				isShowAbout = true
			},
			'LB_JK': () => {
				showManagemented = true
				propertyShow = '借款'
				categoryTypeObj = 'acLoan'
			},
			'LB_TZ': () => {
				showManagemented = true
				propertyShow = '投资'
				categoryTypeObj = 'acInvest'
			},
			'LB_ZB': () => {
				showManagemented = true
				propertyShow = '资本'
				categoryTypeObj = 'acCapital'
			},
			'LB_CQZC': () => {
				showManagemented = true
				propertyShow = '长期资产'
				categoryTypeObj = 'acAssets'
			},
			'LB_FYZC': () => {
				showManagemented = true
				propertyShow = '费用支出'
				categoryTypeObj = 'acCost'
				direction = 'credit'
			},
			'LB_ZSKX': () => {
				showManagemented = false
				propertyShow = '暂收款项'
				categoryTypeObj = 'acTemporaryReceipt'
				isShowAbout = true
			},
			'LB_ZFKX': () => {
				showManagemented = false
				propertyShow = '暂付款项'
				categoryTypeObj = 'acTemporaryPay'
				isShowAbout = true
			},
			'LB_XCZC': () => {
				showManagemented = false
				propertyShow = '薪酬支出'
				categoryTypeObj = 'acPayment'
			},
			'LB_SFZC': () => {
				showManagemented = false
				propertyShow = '税费支出'
				categoryTypeObj = 'acTax'
			}
		}[categoryType] || (() => ''))()
		const propertyPay = cardTemp.get('propertyPay')
		const beAccrued = cardTemp.getIn([categoryTypeObj, 'beAccrued'])
		const propertyTax = cardTemp.get('propertyTax')
		const beTurnOut = cardTemp.getIn([categoryTypeObj,'beTurnOut'])
		const beInAdvance = cardTemp.getIn([categoryTypeObj,'beInAdvance'])
		const beSellOff = cardTemp.getIn([categoryTypeObj,'beSellOff'])
		const propertyCost =cardTemp.get('propertyCost')
		const propertyInvest =cardTemp.get('propertyInvest')
		const isQueryByBusiness = flags.get('isQueryByBusiness')
		const specialStateforAssets = flags.get('specialStateforAssets')
		const runningInsertOrModify = flags.get('runningInsertOrModify')
		const handleAmount = cardTemp.get('handleAmount')
		const runningType = cardTemp.get('runningType')
		const assetType = cardTemp.get('assetType')
		const stockRange = cardTemp.getIn([categoryTypeObj,'stockRange'])
		const contactsRange = cardTemp.getIn([categoryTypeObj,'contactsRange'])
		return (
				   propertyCost!=='XZ_QDJK'
				&& propertyCost!=='XZ_CHBJ'
				&& propertyCost!=='XZ_DWTZ'
				&& propertyCost!=='XZ_SHTZ'
				&& propertyCost!=='XZ_ZZ'
				&& propertyCost!=='XZ_JZ'
				&& propertyPay!=='SX_FLF'
				&& !specialStateforAssets?
            <div className="accountConf-modal-list-item" style={{minHeight:'auto'}}>
            	<label></label>
				{/* 收入支出 */}
				{
					(categoryType ==='LB_YYSR' ||categoryType ==='LB_YYZC') ?
					<div>
		                <RadioGroup
							disabled={runningInsertOrModify === 'modify'}
		                    onChange={e => {
								dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
		                        dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
								dispatch(lrAccountActions.getFirstStockCardList(stockRange,e.target.value))
			                    dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,e.target.value))
		                    }}

		                    value={runningState}
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
							disabled={runningInsertOrModify === 'modify'}
	                        onChange={e => {
								dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
								dispatch(lrAccountActions.getFirstStockCardList(stockRange,e.target.value))
			                    dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,e.target.value))
	                            dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
	                        }}

	                        value={runningState}
	                        >
							<Radio key="a" value={'STATE_FY_DJ'} disabled={!beDeposited}><Tooltip placement="topLeft" title={`${!beDeposited?'流水设置中未启用':''}`}>预付</Tooltip></Radio>
	                        <Radio key="d" value={'STATE_FY_YF'} >已付款</Radio>
	                        <Radio key="e" value={'STATE_FY_WF'} disabled={!beManagemented}><Tooltip placement="topLeft" title={`${!beManagemented?'流水设置中未启用':''}`}>未付款</Tooltip></Radio>
	                    </RadioGroup>
	                </div>
					:
					null
					}
					{/* 营业外收入*/}
					{
						categoryType ==='LB_YYWSR' ?
						<div>
		                    <RadioGroup
								disabled={runningInsertOrModify === 'modify'}
		                        onChange={e => {
									dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
									dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,e.target.value))
		                            dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
		                        }}

		                        value={runningState}
		                        >
		                        <Radio key="f" value={'STATE_YYWSR_YS'} >已收款</Radio>
		                        <Radio key="g" value={'STATE_YYWSR_WS'} disabled={!beManagemented}><Tooltip placement="topLeft" title={`${!beManagemented?'流水设置中未启用':''}`}>未收款</Tooltip></Radio>
		                    </RadioGroup>
		                </div>
						:
						null
					}
					{/* 投资*/}
					{
						categoryType ==='LB_TZ' && propertyCost === 'XZ_QDSY'?
						<div>
							{
								specialStateforAccrued?
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {

											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
										<Radio key="h" value={'STATE_TZ_SRGL'} style={{display:propertyInvest === 'SX_GQ'?'':'none'}}>收入股利</Radio>
										<Radio key="i" value={'STATE_TZ_SRLX'} style={{display:propertyInvest === 'SX_ZQ'?'':'none'}}>收入利息</Radio>
									</RadioGroup>
									:
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {

											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
										<Radio key="j" value={'STATE_TZ_JTGL'} style={{display:propertyInvest === 'SX_GQ'?'':'none'}} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提股利</Tooltip></Radio>
										<Radio key="k" value={'STATE_TZ_SRGL'} style={{display:propertyInvest === 'SX_GQ'?'':'none'}}>收入股利</Radio>
										<Radio key="l" value={'STATE_TZ_JTLX'} style={{display:propertyInvest === 'SX_ZQ'?'':'none'}} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提利息</Tooltip></Radio>
										<Radio key="m" value={'STATE_TZ_SRLX'} style={{display:propertyInvest === 'SX_ZQ'?'':'none'}}>收入利息</Radio>
									</RadioGroup>
							}
						</div>
						:
						null
					}
					{/* 营业外支出*/}
					{
						categoryType ==='LB_YYWZC'?
						<div>
							<RadioGroup
								disabled={runningInsertOrModify === 'modify'}
								onChange={e => {
									dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
									dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,e.target.value))
									dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
								}}

								value={runningState}
								>
								<Radio key="n" value={'STATE_YYWZC_YF'} >已付款</Radio>
								<Radio key="o" value={'STATE_YYWZC_WF'} disabled={!beManagemented}><Tooltip placement="topLeft" title={`${!beManagemented?'流水设置中未启用':''}`}>未付款</Tooltip></Radio>
							</RadioGroup>
						</div>
						:
						null
					}
					{/* 长期资产 */}
					{
						categoryType ==='LB_CQZC' && runningType !== 'LX_JZSY_SS' && runningType !== 'LX_JZSY_SY' && assetType !== 'XZ_ZJTX'?
						<div>
							<RadioGroup
								disabled={runningInsertOrModify === 'modify'}
								onChange={e => {
									dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
									dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,e.target.value))
									dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
								}}

								value={runningState}
								>
								<Radio key="p" value={`${assetType === 'XZ_CZZC'?'STATE_CQZC_YS':'STATE_CQZC_YF'}`} >{`已${assetType === 'XZ_CZZC'?'收':'付'}款`}</Radio>
								<Radio key="q" value={`${assetType === 'XZ_CZZC'?'STATE_CQZC_WS':'STATE_CQZC_WF'}`} disabled={!beManagemented}><Tooltip placement="topLeft" title={`${!beManagemented?'流水设置中未启用':''}`}>{`未${assetType === 'XZ_CZZC'?'收':'付'}款`}</Tooltip></Radio>
							</RadioGroup>
						</div>
						:
						null
					}
					{/* 借款*/}
					{
						categoryType ==='LB_JK' && propertyCost === 'XZ_CHLX'?
						<div>
							{
								specialStateforAccrued?
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {

											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
										<Radio key="r" value={'STATE_JK_ZFLX'}>支付利息</Radio>
									</RadioGroup>
									:
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {

											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
										<Radio key="sa" value={'STATE_JK_JTLX'} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提利息</Tooltip></Radio>
										<Radio key="t" value={'STATE_JK_ZFLX'}>支付利息</Radio>
									</RadioGroup>
							}

						</div>
						:
						null
					}
					{/* 薪酬支出 */}
					{
						categoryType ==='LB_XCZC' && propertyPay !== 'SX_FLF' ?
						<div >
							{
								specialStateforAccrued?
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {

											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
											<Radio
												key="u"
												value={propertyPay ==='SX_GZXJ'||propertyPay ==='SX_QTXC'?'STATE_XC_FF':'STATE_XC_JN'}
												>
													{propertyPay ==='SX_GZXJ'||propertyPay ==='SX_QTXC'?'发放':'缴纳'}
											</Radio>
									</RadioGroup>
									:
								    <RadioGroup
										disabled={runningInsertOrModify === 'modify'}
								        onChange={e => {
											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
								            dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
								        }}

								        value={runningState}
								        >
								        <Radio key="v" value={'STATE_XC_JT'} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提</Tooltip></Radio>
								        <Radio
											key="x"
											value={propertyPay ==='SX_GZXJ'||propertyPay ==='SX_QTXC'?'STATE_XC_FF':'STATE_XC_JN'}
											>
												{propertyPay ==='SX_GZXJ'||propertyPay ==='SX_QTXC'?'发放':'缴纳'}
										</Radio>
								    </RadioGroup>
								}
						</div>
						:
						null
					}
					{/* 税费支出 */}
					{
						categoryType ==='LB_SFZC' && runningState !== 'STATE_SF_SFJM' ?
						<div>
							{
								specialStateforAccrued?
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {
											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
										<Radio key="w" value={'STATE_SF_JN'} >缴纳</Radio>
									</RadioGroup>
									:
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {
											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
										<Radio key="z" value={'STATE_SF_JT'} style={{display:(propertyTax === 'SX_QTSF' || propertyTax === 'SX_QYSDS')?'':'none'}} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>计提</Tooltip></Radio>
										<Radio key="ab" value={'STATE_SF_YJZZS'} style={{display:propertyTax === 'SX_ZZS' ?'':'none'}} disabled={!beInAdvance}><Tooltip placement="topLeft" title={`${!beInAdvance?'流水设置中未启用':''}`}>预缴增值税</Tooltip></Radio>
										<Radio key="aa" value={'STATE_SF_JN'} >缴纳</Radio>
									</RadioGroup>
							}

						</div>
						:
						null
					}
					{/* 暂收 */}
					{
						categoryType ==='LB_ZSKX'?
						<div>
							{
								specialStateforAccrued?
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
											<Radio key="ac" value={'STATE_ZS_TH'} >退还</Radio>
									</RadioGroup>
									:
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {
											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
											<Radio key="ba" value={'STATE_ZS_SQ'} >收取</Radio>
											<Radio key="ca" value={'STATE_ZS_TH'} >退还</Radio>

									</RadioGroup>
							}

						</div>
						:
						null
					}
					{/* 暂付 */}
					{
						categoryType ==='LB_ZFKX'?
						<div>
							{
								specialStateforAccrued?
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
											<Radio key="ad" value={'STATE_ZF_SH'} >收回</Radio>
									</RadioGroup>
									:
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {
											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
											<Radio key="ae" value={'STATE_ZF_FC'} >付出</Radio>
											<Radio key="af" value={'STATE_ZF_SH'} >收回</Radio>

									</RadioGroup>
							}

						</div>
						:
						null
					}
					{/* 资本*/}
					{
						 propertyCost==='XZ_LRFP' ?
						<div>
							{
								specialStateforAccrued?
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {

												dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
										<Radio key="ag" value={'STATE_ZB_ZFLR'} >支付利润</Radio>
									</RadioGroup>
									:
									<RadioGroup
										disabled={runningInsertOrModify === 'modify'}
										onChange={e => {
											dispatch(lrAccountActions.changeStateAndAbstract(cardTemp,e.target.value))
											dispatch(lrAccountActions.changeLrAccountCommonString('card', 'runningState', e.target.value))
										}}

										value={runningState}
										>
										<Radio key="ah" value={'STATE_ZB_LRFP'} disabled={!beAccrued}><Tooltip placement="topLeft" title={`${!beAccrued?'流水设置中未启用':''}`}>利润分配</Tooltip></Radio>
										<Radio key="bj" value={'STATE_ZB_ZFLR'} >支付利润</Radio>
									</RadioGroup>
							}
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
