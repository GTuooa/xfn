import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Radio, TextListInput, Row, SinglePicker, Icon, Switch, SwitchText, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, ContancsCom, hxCom, ProjectCom, StockCom, abstractFun } from '../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { yysrAccountActions } from 'app/redux/Edit/Lrls/yysrAccount'
import * as Common from '../CommonData.js'
import { UploadFj } from '../components'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Yysr extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false
		}
    }

	render () {
		const { dispatch, homeAccountState, yysrAccountState, history, homeState, editPermission } = this.props
		const { showList } = this.state

		const rate = homeAccountState.get('rate')
		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = yysrAccountState.get('data')
		const insertOrModify = yysrAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = yysrAccountState.getIn(['views', 'fromYl'])

		const flowNumber = data.get('flowNumber')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const propertyCarryover = data.get('propertyCarryover')
		const isHw = propertyCarryover=='SX_HW' ? true : false//是否是货物属性

		const acBusinessIncome = data.get('acBusinessIncome')
		const beManagemented = acBusinessIncome.get('beManagemented')//收付管理
		const beDeposited = acBusinessIncome.get('beDeposited')//定金管理
		const beCarryover = acBusinessIncome.get('beCarryover')//结转成本
		const beSellOff = acBusinessIncome.get('beSellOff')//开启退售
		const contactsRange = acBusinessIncome.get('contactsRange')//往来单位范围
		const businessList = data.get('businessList')

		const radioList = [
			{key: 'STATE_YYSR_DJ', value: '预收', disabled: !beDeposited, message: '流水设置中未启用'},
			{key: 'STATE_YYSR_XS', value: '销售'},
			{key: 'STATE_YYSR_TS', value: '退销', disabled: !beSellOff, message: '流水设置中未启用'}
		]

		const currentAmount = data.get('currentAmount')//本次收付款
		const runningBeCarryover = data.get('beCarryover')//流水是否启用结转成本
        const carryoverAmount = data.get('carryoverAmount')//成本金额
		const billType = data.get('billType')
		const billStates = data.get('billStates')
		const billList = data.get('billList')
		let billChecked = false, fromNoToYes = false
		if (billList && billList.size) {//未开票
			billChecked = true
			fromNoToYes = true//从未开票到开票
		} else {
			billChecked = billStates === 'bill_states_not_make_out' ? true : false
		}
		const scale = rate.get('scale')
		const taxRate = data.get('taxRate')
		const tax = data.get('tax')

		const preData = yysrAccountState.get('preData')
		const preAmount = preData.get('preAmount')//预收款
		const receiveAmount = preData.get('receiveAmount')//应收款
		const offsetAmount = data.get('offsetAmount')//预收款抵扣

		let stockCardCom = null//存货卡片组件
		let carryoverCom = null//成本结转
		let invoiceCom = null//发票
		let taxRateCom = null//税率组件

		const componentAss = () => {
			//存货卡片
			if (isHw) {//是货物
				const stockCardList = yysrAccountState.get('stockCardList')//存货卡片列表
				const stockCardRange = acBusinessIncome.get('stockCardList')//选择的存货卡片
				const stockRange = acBusinessIncome.get('stockRange')
				const changeAmount = (value) => dispatch(yysrAccountActions.changeAmount(value))
				const onOk = (dataType, value, idx) => dispatch(yysrAccountActions.changeYysrStockCard(dataType, value, idx))
				stockCardCom = <StockCom
					dispatch={dispatch}
					stockCardList={stockCardList}
					stockCardRange={stockCardRange}
					changeAmount={changeAmount}
					onOk={onOk}
					stockRange={stockRange}
					history={history}
					cardDisabled={isModify && runningBeCarryover}
				/>
			}

			if (isHw && beCarryover && !isModify) {//开启成本结转属性
				const stockCardList = acBusinessIncome.get('stockCardList')//选择的存货卡片
				const carryoverCardList = acBusinessIncome.get('carryoverCardList')
				carryoverCom = <Row className='lrls-card'>
					<Row className='lrls-more-card'>
						<span>结转成本</span>
						<div className='noTextSwitchShort'>
							<Switch
								checked={runningBeCarryover}
								color='#FF8348'
								onClick={() => {
									dispatch(yysrAccountActions.changeYysrData('beCarryover', !runningBeCarryover))
								}}
							/>
						</div>
					</Row>
					<div style={{display: runningBeCarryover ? '' : 'none'}}>
						{
							stockCardList.map((v ,i) => {
								return (
									<div key={i} className='lrls-padding-top lrls-margin-bottom'>
										<Row className='lrls-more-card lrls-bottom'>
											<span>存货明细({i+1})：</span>
											<span className="overElli" style={{flex: '1'}}>
												{v.get('uuid') ? `${v.get('code')} ${v.get('name')}` : '请先选择存货卡片'}
											</span>
										</Row>
										<Row className='lrls-more-card'>
											<label>金额:</label>
											<TextListInput
												placeholder='填写成本金额'
												value={carryoverCardList.getIn([i, 'amount'])}
												onChange={(value) => {
													if (/^\d*\.?\d{0,2}$/g.test(value)) {
														dispatch(yysrAccountActions.changeYysrStockCard('carryoverCardList', value, i))
													}
												}}
											/>
										</Row>
									</div>
								)
							})
						}
					</div>
				</Row>
			}

			taxRateCom = (<Row className='lrls-more-card lrls-margin-top'>
				<label>税率:</label>
				<SinglePicker
					district={scale == 'general' ? Common.taxRateList : Common.smallTaxRateList}
					value={taxRate}
					onOk={value => {
						if (fromNoToYes) {
							return
						}
						dispatch(yysrAccountActions.changeTaxRate(value.value))
					}}
				>
					<Row className='lrls-category lrls-padding'>
						<span>
							{ `${taxRate}%` }
							<span className='lrls-placeholder'>
								(税额：<Amount showZero>{tax}</Amount> 价税合计: <Amount showZero>{amount}</Amount>)
							</span>
						</span>
						<Icon type="triangle" />
					</Row>
				</SinglePicker>
			</Row>)

			invoiceCom = (<Row className='lrls-card' style={{display: scale == 'isEnable' ? 'none' : ''}}>
				<Row className='yysr-bill'>
					<div className='lrls-more-card'>
						<label>票据类型:</label>
						<SinglePicker
							district={[{key: '发票', value: 'bill_common'}, {key: '其他票据', value: 'bill_other'}]}
							value={billType}
							onOk={value => {
								if (fromNoToYes) {
									return
								}
								dispatch(yysrAccountActions.changeYysrData('billType', value.value))
							}}
						>
							<Row className='lrls-category lrls-padding'>
								<span> { billType == 'bill_common' ? '发票' : '其他票据' } </span>
								<Icon type="triangle" />
							</Row>
						</SinglePicker>
					</div>

					{
						billType == 'bill_common' ? <SwitchText
							checked={!billChecked}
							checkedChildren='已开票'
							unCheckedChildren='未开票'
							className='threeTextSwitch'
							onChange={() => {
								if (fromNoToYes) {
									return
								}
								dispatch(yysrAccountActions.changeBillStates())
							}}
						/> : null
					}
				</Row>

				{
					billType == 'bill_common' ? <Row>
						{ taxRateCom }
						{ fromNoToYes ? <Row className='lrls-margin-top'>开票流水：{billList.getIn([0, 'flowNumber'])}(发票已开票)</Row> : null }
					</Row> : null
				}
			</Row>)

		}

		let showAccount = false//是否显示账户
		let showPreAmount = false//是否显示预收预付
		let amountTitle = '总金额:'
		let getPreAmount = false//是否获取预处理金额
		let handleAmountCom = null//预收预付
		let preAmountCom = null

		;({
			'STATE_YYSR_DJ': () => {
				showAccount = true
				showPreAmount = false
				amountTitle = '预收金额:'
			},
			'STATE_YYSR_XS': () => {
				componentAss()

				showAccount = beManagemented ? false : true
				if (fromYl && data.get('isFullPayment')) {//全收全付
					showAccount = true
				}
				showPreAmount = (beManagemented && !fromYl) ? true : false
				getPreAmount = beManagemented ? true : false

				preAmountCom = preAmount > 0 ? (<Row>
					<div style={{paddingLeft: '.6rem'}} className='lrls-placeholder'>
						<span style={{marginRight: '.2rem'}}>
							预收款: <Amount showZero>{preAmount}</Amount>
						</span>
						<span>
							应收款: <Amount showZero>{receiveAmount}</Amount>
						</span>
					</div>

					<Row className='yysr-amount margin-top-bot'>
						<label>预收抵扣:</label>
						<TextListInput
							placeholder='填写金额'
							value={offsetAmount}
							onChange={(value) => {
								if (/^\d*\.?\d{0,2}$/g.test(value)) {
									dispatch(yysrAccountActions.changeYysrData('offsetAmount', value))
								}
							}}
						/>
					</Row>
				</Row>) : null

				handleAmountCom = <Row className='yysr-amount'>
					<label>本次收款:</label>
					<TextListInput
						placeholder='填写金额'
						value={currentAmount}
						onChange={(value) => {
							if (/^\d*\.?\d{0,2}$/g.test(value)) {
								dispatch(yysrAccountActions.changeYysrData('currentAmount', value))
							}
						}}
						onFocus={() => {
							const value = amount-offsetAmount
							dispatch(yysrAccountActions.changeYysrData('currentAmount', value == 0 ? '' : value))
						}}
					/>
					{
						currentAmount > 0 ? <Account
							history={history}
							accountList={accountList}
							accountUuid={accountUuid}
							accountName={accountName}
							onOk={(value) => dispatch(yysrAccountActions.changeAccount(value))}
						/> : null
					}
				</Row>
			},
			'STATE_YYSR_TS': () => {
				componentAss()
				showAccount = beManagemented ? false : true
				if (fromYl && data.get('isFullPayment')) {//全收全付
					showAccount = true
				}
				showPreAmount = (beManagemented && !fromYl) ? true : false
				getPreAmount = beManagemented ? true : false

				preAmountCom = receiveAmount > 0 ? (<Row>
					<div style={{paddingLeft: '.6rem'}} className='lrls-placeholder'>
						<span style={{marginRight: '.2rem'}}>
							预收款: <Amount showZero>{preAmount}</Amount>
						</span>
						<span>
							应收款: <Amount showZero>{receiveAmount}</Amount>
						</span>
					</div>
					<Row className='yysr-amount margin-top-bot'>
						<label>应收抵扣:</label>
						<TextListInput
							placeholder='填写金额'
							value={offsetAmount}
							onChange={(value) => {
								if (/^\d*\.?\d{0,2}$/g.test(value)) {
									dispatch(yysrAccountActions.changeYysrData('offsetAmount', value))
								}
							}}
						/>
					</Row>
				</Row>) : null

				handleAmountCom = <Row className='yysr-amount'>
					<label>本次付款:</label>
					<TextListInput
						placeholder='填写金额'
						value={currentAmount}
						onChange={(value) => {
							if (/^\d*\.?\d{0,2}$/g.test(value)) {
								dispatch(yysrAccountActions.changeYysrData('currentAmount', value))
							}
						}}
						onFocus={() => {
							const value = amount-offsetAmount
							dispatch(yysrAccountActions.changeYysrData('currentAmount', value == 0 ? '' : value))
						}}
					/>
					{
						currentAmount > 0 ? <Account
							history={history}
							accountList={accountList}
							accountUuid={accountUuid}
							accountName={accountName}
							onOk={(value) => dispatch(yysrAccountActions.changeAccount(value))}
						/> : null
					}
				</Row>
			}
		}[runningState] || (() => null))()




		let projectCardCom = null
		const beProject = data.get('beProject')
		let showAmount = isHw && runningState != 'STATE_YYSR_DJ' ? false : true//是否显示金额组件
		const project = homeAccountState.get('project')
		const usedProject = project.get('usedProject')
		if (beProject && runningState != 'STATE_YYSR_DJ') {
			if (!isHw && usedProject) {
				showAmount = false
			}
			const changeAmount = (value) => dispatch(yysrAccountActions.changeAmount(value))
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
				noMore={isHw}
				noAmount={isHw}
			/>
		}

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
		}

		let contactsCardCom = null
		if (beManagemented) {
			const contactsCardList = yysrAccountState.get('contactsCardList')//往来关系列表
			const contactsCardRange = acBusinessIncome.get('contactsCardRange')//往来关系卡片
			let onOk = (value) => {
				dispatch(yysrAccountActions.changeAcList(value.value, 'contactsCardRange'))
				if (getPreAmount) {
					dispatch(yysrAccountActions.getYysrPreAmount())
				}
			}
			let showBottom = (showAmount || showAccount || showPreAmount) ? 'showBottom' : 'noBottom'
			contactsCardCom = <ContancsCom
				cardList={contactsCardList}
				cardObj={contactsCardRange}
				noBottom={showBottom}
				onOk={onOk}
				history={history}
				dispatch={dispatch}
				isPayUnit={false}
				contactsRange={contactsRange}
				disabled={isModify}
			/>
		}

		// 图片上传
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//有没有开启附件
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		// const enCanUse = false
		// const checkMoreFj = false

		const showlsfj = homeAccountState.getIn(['flags', 'showlsfj'])
		const previewImageList = homeAccountState.get('previewImageList').toJS();
		const label = homeAccountState.get('label');
		const enclosureList = homeAccountState.get('enclosureList');
		const enclosureCountUser = homeAccountState.get('enclosureCountUser');

		return(
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => {
						dispatch(yysrAccountActions.changeYysrData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (getPreAmount) {
							dispatch(yysrAccountActions.getYysrPreAmount())
						}
					}}
					callback={(value) => {
						dispatch(yysrAccountActions.changeYysrData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						if (getPreAmount) {
							dispatch(yysrAccountActions.getYysrPreAmount())
						}
					}}
				/>

				{ isModify ? <Row className='lrls-row'> {`流水号： ${flowNumber}`} </Row> : null }

				<ScrollView flex="1">
					<div className='lrls-card'>
						<CategoryCom
							isModify={isModify}
							dispatch={dispatch}
							lastCategory={lastCategory}
							categoryUuid={categoryUuid}
							categoryName={categoryName}
							showProject={beProject && runningState != 'STATE_YYSR_DJ'}
							project={project}
							noAmount={isHw}
							changeAmount={(value) => dispatch(yysrAccountActions.changeAmount(value))}
						/>
						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								if (key==runningState) {//同一状态
									return
								}
								dispatch(yysrAccountActions.changeRunningState(key))
								dispatch(yysrAccountActions.changeYysrData('runningAbstract', abstractFun(key, data)))

								if (beManagemented) {
									dispatch(yysrAccountActions.getYysrCardList('contactsRange'))
									if (key != 'STATE_YYSR_DJ') {
										dispatch(yysrAccountActions.getYysrPreAmount())
									}
								}
							}}
						/>
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(yysrAccountActions.changeYysrData('runningAbstract', value))
							}}
						/>
					</div>

					{ projectCardCom }
					{/* 存货卡片 */}
					{ stockCardCom }

					<div className='lrls-card' style={{display: beManagemented || showAmount || showAccount ? '' : 'none'}}>
						{/* 往来关系卡片 */}
						{ contactsCardCom }

						<Row className={showAmount || showAccount ? 'yysr-amount lrls-bottom' : 'yysr-amount'}>
							{ showAmount ? <label>{amountTitle}</label> : null}
							{
								showAmount ? <TextListInput
									placeholder='填写金额'
									value={amount}
									onChange={(value) => {
										if (/^\d*\.?\d{0,2}$/g.test(value)) {
											dispatch(yysrAccountActions.changeAmount(value))
										}
									}}
								/> : null
							}
							{ !showAmount && showAccount ? <label>账户：</label> : null }
							{ showAccount ? <Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(yysrAccountActions.changeAccount(value))}
							/> : null }
						</Row>

						{
							showPreAmount ? <div>
								{ preAmountCom }
								{ handleAmountCom }
							</div> : null
						}
					</div>

					{/* 发票 */}
					{ invoiceCom }
					{/* 成本结转 */}
					{ carryoverCom }
					{
						businessList && businessList.size ?
							<Row className='lrls-margin-top'>结转成本流水：{businessList.getIn([0, 'flowNumber'])}(已结转成本)</Row>
						: null
					}
					{/* 核销 */}
					{ HxCom }
					<UploadFj
						dispatch={dispatch}
						enCanUse={enCanUse}
						editPermission={editPermission}
						enclosureList={enclosureList}
						showlsfj={showlsfj}
						checkMoreFj={checkMoreFj}
						label={label}
						enclosureCountUser={enclosureCountUser}
						history={history}
					/>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(yysrAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>

					<Button onClick={() => {
						dispatch(yysrAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
