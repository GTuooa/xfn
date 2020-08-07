import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Radio, TextListInput, Row, SinglePicker, Icon, SwitchText, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, ContancsCom, CategoryCom, hxCom, ProjectCom, StockCom, abstractFun } from '../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { yyzcAccountActions } from 'app/redux/Edit/Lrls/yyzcAccount'
import * as Common from '../CommonData.js'
import { UploadFj } from '../components'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Yyzc extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false
		}
    }

	render () {

		const { dispatch, homeAccountState, yyzcAccountState, history, homeState, editPermission } = this.props
		const { showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = yyzcAccountState.get('data')
		const preData = yyzcAccountState.get('preData')
		const insertOrModify = yyzcAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = yyzcAccountState.getIn(['views', 'fromYl'])

		const flowNumber = data.get('flowNumber')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const amount = data.get('amount')
		const propertyCarryover = data.get('propertyCarryover')
		const isHw = propertyCarryover=='SX_HW' ? true : false//是否是货物属性

		const acBusinessExpense = data.get('acBusinessExpense')
		const beManagemented = acBusinessExpense.get('beManagemented')//收付管理
		const beDeposited = acBusinessExpense.get('beDeposited')//定金管理
		const beSellOff = acBusinessExpense.get('beSellOff')//退购

		const radioList = [
			{key: 'STATE_YYZC_DJ', value: '预付', disabled: !beDeposited, message: '流水设置中未启用'},
			{key: 'STATE_YYZC_GJ', value: '购进'},
			{key: 'STATE_YYZC_TG', value: '退购', disabled: !beSellOff, message: '流水设置中未启用'}
		]

		//发票组件
		const rate = homeAccountState.get('rate')
		const scale = rate.get('scale')
		const billType = data.get('billType')
		const billStates = data.get('billStates')
		const billList = data.get('billList')
		let billChecked = false, fromNoToYes = false
		if (billList && billList.size) {//未认证
			billChecked = true
			fromNoToYes = true//从未认证到认证
		} else {
			billChecked = billStates === 'bill_states_not_auth' ? true : false
		}
		const taxRate = data.get('taxRate')
		const tax = data.get('tax')
		let invoiceCom = null

		const preAmount = preData.get('preAmount')//预付款
		const receiveAmount = preData.get('receiveAmount')//应付款
		const offsetAmount = data.get('offsetAmount')//预付款 应付款 抵扣
		const currentAmount = data.get('currentAmount')//本次付 收 款
		let handleAmountCom = null//本次收付款组件
		let preAmountCom = null//预收付款组件
		let stockCardCom = null//存货卡片组件

		const componentAss = () => {
			//存货卡片
			if (isHw) {//是货物
				const stockCardList = yyzcAccountState.get('stockCardList')//存货卡片列表
				const stockCardRange = acBusinessExpense.get('stockCardList')//存货卡片
				const stockRange = acBusinessExpense.get('stockRange')
				const changeAmount = (value) => dispatch(yyzcAccountActions.changeYyzcTaxRateOrAmount('amount',value))
				const onOk = (dataType, value, idx) => dispatch(yyzcAccountActions.changeYyzcStockCard(dataType, value, idx))
				stockCardCom = <StockCom
					dispatch={dispatch}
					stockCardList={stockCardList}
					stockCardRange={stockCardRange}
					changeAmount={changeAmount}
					onOk={onOk}
					stockRange={stockRange}
					history={history}
				/>
			}

			//发票组件
			let taxRateCom = null//税率组件

			if (scale === 'general') {
				taxRateCom = (<Row className='lrls-more-card lrls-margin-top'>
					<label>税率:</label>
					<SinglePicker
						district={Common.taxRateList}
						value={taxRate}
						onOk={value => {
							if (fromNoToYes) {
								return
							}
							dispatch(yyzcAccountActions.changeYyzcTaxRateOrAmount('taxRate', value.value))
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

				invoiceCom = (<Row className='lrls-card'>
					<Row className='yysr-bill'>
						<div className='lrls-more-card'>
							<label>票据类型:</label>
							<SinglePicker
								district={[{key: '增值税专用发票', value: 'bill_special'}, {key: '其他票据', value: 'bill_other'}]}
								value={billType}
								onOk={value => {
									if (fromNoToYes) {
										return
									}
									dispatch(yyzcAccountActions.changeYyzcData('billType', value.value))
								}}
							>
								<Row className='lrls-category lrls-padding'>
									<span>
										{ billType == 'bill_special' ? '增值税专用发票' : '其他票据' }
									</span>
									<Icon type="triangle" />
								</Row>
							</SinglePicker>
						</div>
						{
							billType == 'bill_special' ? <SwitchText
								checked={!billChecked}
								checkedChildren='已认证'
								unCheckedChildren='未认证'
								className='threeTextSwitch'
								onChange={() => {
									if (fromNoToYes) {
										return
									}
									dispatch(yyzcAccountActions.changeYyzcBillStates())
								}}
							/> : null
						}
					</Row>

					{
						billType == 'bill_special' ? <Row>
							{ taxRateCom }
							{ fromNoToYes ? <Row className='lrls-margin-top'>认证流水：{billList.getIn([0, 'flowNumber'])}(发票已认证)</Row> : null }
						</Row> : null
					}
				</Row>)
			}
		}

		let showAccount = false//是否显示账户
		let showPreAmount = false//是否显示预收预付
		let amountTitle = '总金额:'
		let getPreAmount = false//是否获取预处理金额

		;({
			'STATE_YYZC_DJ': () => {
				showAccount = true
				showPreAmount = false
				amountTitle = '预付金额:'

			},
			'STATE_YYZC_GJ': () => {
				componentAss()
				showAccount = beManagemented ? false : true
				if (fromYl && data.get('isFullPayment')) {//全收全付
					showAccount = true
				}
				showPreAmount = (!fromYl && beManagemented) ? true : false
				getPreAmount = beManagemented ? true : false

				preAmountCom = preAmount > 0  ? (<Row>
					<div style={{paddingLeft: '.6rem'}} className='lrls-placeholder'>
						<span style={{marginRight: '.2rem'}}>
							预付款： <Amount showZero>{preAmount}</Amount>
						</span>
						<span className='lrls-placeholder'>
							应付款： <Amount showZero>{receiveAmount}</Amount>
						</span>
					</div>
					<Row className='yysr-amount margin-top-bot'>
						<label>预付抵扣:</label>
						<TextListInput
							placeholder='填写金额'
							value={offsetAmount}
							onChange={(value) => {
								if (/^\d*\.?\d{0,2}$/g.test(value)) {
									dispatch(yyzcAccountActions.changeYyzcData('offsetAmount', value))
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
								dispatch(yyzcAccountActions.changeYyzcData('currentAmount', value))
							}
						}}
						onFocus={() => {
							const value = amount-offsetAmount
							dispatch(yyzcAccountActions.changeYyzcData('currentAmount', value==0 ? '' : value))
						}}
					/>
					{ currentAmount > 0 ? <Account
							history={history}
							accountList={accountList}
							accountUuid={accountUuid}
							accountName={accountName}
							onOk={(value) => dispatch(yyzcAccountActions.changeYyzcAccount(value))}
						/> : null
					}
				</Row>
			},
			'STATE_YYZC_TG': () => {
				componentAss()
				showAccount = beManagemented ? false : true
				if (fromYl && data.get('isFullPayment')) {//全收全付
					showAccount = true
				}
				showPreAmount = (!fromYl && beManagemented) ? true : false
				getPreAmount = beManagemented ? true : false

				preAmountCom = receiveAmount > 0 ? (<Row>
					<div style={{paddingLeft: '.6rem'}} className='lrls-placeholder'>
						<span style={{marginRight: '.2rem'}}>
							预付款： <Amount>{preAmount}</Amount>
						</span>
						<span>
							应付款： <Amount>{receiveAmount}</Amount>
						</span>
					</div>
					<Row className='yysr-amount margin-top-bot'>
						<label>应付抵扣:</label>
						<TextListInput
							placeholder='填写金额'
							value={offsetAmount}
							onChange={(value) => {
								if (/^\d*\.?\d{0,2}$/g.test(value)) {
									dispatch(yyzcAccountActions.changeYyzcData('offsetAmount', value))
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
								dispatch(yyzcAccountActions.changeYyzcData('currentAmount', value))
							}
						}}
						onFocus={() => {
							const value = amount-offsetAmount
							dispatch(yyzcAccountActions.changeYyzcData('currentAmount', value == 0 ? '' : value))
						}}
					/>
					{ currentAmount > 0 ? <Account
						history={history}
						accountList={accountList}
						accountUuid={accountUuid}
						accountName={accountName}
						onOk={(value) => dispatch(yyzcAccountActions.changeYyzcAccount(value))}
					/> : null }
				</Row>
			}
		}[runningState] || (() => null))()

		let contactsCardCom = null
		if (beManagemented) {//开启收付管理
			const contactsCardList = yyzcAccountState.get('contactsCardList')//往来关系列表
			const contactsCardRange = acBusinessExpense.get('contactsCardRange')//往来关系卡片
			const contactsRange = acBusinessExpense.get('contactsRange')//往来关系卡片
			let onOk = (value) => {
				dispatch(yyzcAccountActions.changeYyzcAssList(value.value, 'contactsCardRange'))
				if (getPreAmount) {
					dispatch(yyzcAccountActions.getYyzcPreAmount())
				}
			}
			contactsCardCom = <ContancsCom
				cardList={contactsCardList}
				cardObj={contactsCardRange}
				noBottom={'contactsCardRange'}
				onOk={onOk}
				history={history}
				dispatch={dispatch}
				isPayUnit={true}
				contactsRange={contactsRange}
				disabled={isModify}
			/>
		}

		let projectCardCom = null
		const beProject = data.get('beProject')
		let showAmount = isHw && runningState != 'STATE_YYZC_DJ' ? false : true
		const project = homeAccountState.get('project')
		const usedProject = project.get('usedProject')
		if (!isHw && beProject && runningState != 'STATE_YYZC_DJ') {
			if (usedProject) {
				showAmount = false
			}
			//const propertyCarryover = data.get('propertyCarryover')
			const changeAmount = (value) => dispatch(yyzcAccountActions.changeYyzcTaxRateOrAmount('amount',value))
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
			/>
		}

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
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
						dispatch(yyzcAccountActions.changeYyzcDate(new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (getPreAmount) {
							dispatch(yyzcAccountActions.getYyzcPreAmount())
						}
					}}
					callback={(value) => {
						dispatch(yyzcAccountActions.changeYyzcDate(value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						if (getPreAmount) {
							dispatch(yyzcAccountActions.getYyzcPreAmount())
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
							showProject={!isHw && beProject && runningState != 'STATE_YYZC_DJ'}
							project={project}
							changeAmount = {(value) => dispatch(yyzcAccountActions.changeYyzcTaxRateOrAmount('amount',value))}
						/>
						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								dispatch(yyzcAccountActions.changeYyzcRunningState(key))
								dispatch(yyzcAccountActions.changeYyzcData('runningAbstract', abstractFun(key, data)))
								if (beManagemented) {
									dispatch(yyzcAccountActions.getYyzcCardList('contactsRange'))
									if (key != 'STATE_YYZC_DJ') {
										dispatch(yyzcAccountActions.getYyzcPreAmount())
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
								dispatch(yyzcAccountActions.changeYyzcData('runningAbstract',value))
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
							{ showAmount ? <label>{amountTitle}</label> : null }
							{
								showAmount ? <TextListInput
									placeholder='填写金额'
									value={amount}
									onChange={(value) => {
										if (/^\d*\.?\d{0,2}$/g.test(value)) {
											dispatch(yyzcAccountActions.changeYyzcTaxRateOrAmount('amount',value))
										}
									}}
								/> : null
							}
							{ !showAmount && showAccount ? <label>账户:</label> : null }
							{ showAccount ? <Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => {
									dispatch(yyzcAccountActions.changeYyzcAccount(value))
								}}
							/> : null }
						</Row>
						{
							showPreAmount ? <div>
								{ preAmountCom }
								{ handleAmountCom }
							</div> : null
						}
					</div>

					{/* 发票组件 */}
					{ invoiceCom }
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
						dispatch(yyzcAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(yyzcAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
