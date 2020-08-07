import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Radio, TextListInput, Row, SinglePicker, Icon, Switch, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, costList, propertyCostObj, CategoryCom, xczcCom, ProjectCom, abstractFun, hxCom } from '../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { xczcAccountActions } from 'app/redux/Edit/Lrls/xczcAccount'
import * as Common from '../CommonData.js'
import { DateLib } from 'app/utils'
import './index.less'
import { UploadFj } from '../components'

@connect(state => state)
export default
class Zfgjj extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			bePersonAccumulation: false, // 住房公积金(个人部分)
			showList: true
        }
    }

	render () {
		const { dispatch, homeAccountState, xczcAccountState, history, editPermission, enCanUse, checkMoreFj, showlsfj, label, enclosureList,enclosureCountUser } = this.props
		const { bePersonAccumulation, showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')
		const project = homeAccountState.get('project')
		const usedProject = project.get('usedProject')

		const data = xczcAccountState.get('data')
		const insertOrModify = xczcAccountState.getIn(['views', 'insertOrModify'])
		const flowNumber = xczcAccountState.getIn(['data', 'flowNumber'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = xczcAccountState.getIn(['views', 'fromYl'])


		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const amount = data.get('amount')
		const propertyPay = data.get('propertyPay')//薪酬属性
		const acPayment = data.get('acPayment')
		const beAccrued = acPayment.get("beAccrued")// 是否计提
		const beWithholding = acPayment.get("beWithholding")// 是否代扣代缴
		const actualAmount = acPayment.get("actualAmount")// 支付金额
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额

		//费用性质
		const propertyCostList = data.get('propertyCostList')
		const propertyList = costList(propertyCostList)
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acPayment, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		const radioList = [
			{key: 'STATE_XC_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
			{key: 'STATE_XC_JN', value: '缴纳'}
		]
		let showPropertyCost = false//是否显示费用性质
		let amountName = '金额'
		let shouldGetAmount = false//是否获取未处理金额
		let amountCom = null//金额组件
		let fundCom = null//公积金辅助核算

		;({
			'STATE_XC_JT': () => {//计提
				showPropertyCost = true
				amountName = '金额(公司部分)'
				amountCom = usedProject ? null : <Row className='lrls-card'>
					<Row className='yysr-amount'>
						<label>金额： </label>
						<TextListInput
							placeholder={amountName}
							value={amount}
							onChange={(value) => {
								if (/^\d*\.?\d{0,2}$/g.test(value)) {
									dispatch(xczcAccountActions.changeXczcData('amount', value))
								}
							}}
						/>
					</Row>
				</Row>
			},
			'STATE_XC_JN': () => {
				//开启计提 发放 不显示费用性质
				showPropertyCost = beAccrued ? false : true
				shouldGetAmount = beAccrued ? true : false

				if (beAccrued) {
					const personAccumulationAmount = acPayment.get('personAccumulationAmount')// 公积金(个人部分)
					const companyAccumulationAmount = acPayment.get('companyAccumulationAmount') // 公积金(公司部分)

					amountCom = <div className='lrls-card'>
						<Row className='yysr-amount lrls-bottom lrls-home-account'>
							<label>支付金额： </label>
							<Amount showZero className='amount'>{actualAmount}</Amount>
							<Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(xczcAccountActions.changeXczcAccount(value))}
							/>
						</Row>
						<Row className='yysr-amount'>
							<label>公积金额： </label>
							<TextListInput
								placeholder='填写公司部分金额'
								value={companyAccumulationAmount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(xczcAccountActions.xczcPersonAmount('companyAccumulationAmount',value))
										dispatch(xczcAccountActions.autoCalculateAmount(propertyPay))
									}
								}}
							/>
						</Row>
					</div>

					fundCom = beWithholding ? <Row className='lrls-card'>
						<Row className='lrls-more-card'>
							<span>代缴个人公积金：</span>
							<div className='noTextSwitchShort'>
								<Switch
									checked={bePersonAccumulation || personAccumulationAmount}
									color='#FF8348'
									onClick={() => {
										if (bePersonAccumulation) {//变为不代缴
											this.setState({bePersonAccumulation: false})
											dispatch(xczcAccountActions.xczcClearAcList('socialSecurityList'))
											dispatch(xczcAccountActions.xczcPersonAmount('personAccumulationAmount', 0))
											dispatch(xczcAccountActions.autoCalculateAmount(propertyPay))
										} else {
											this.setState({bePersonAccumulation: true})
										}
									}}
								/>
							</div>
						</Row>
						{
							(bePersonAccumulation || personAccumulationAmount) ?
								<Row className='yysr-amount lrls-margin-top'>
									<label>金额：</label>
									<TextListInput
										placeholder='填写个人部分金额'
										value={personAccumulationAmount}
										onChange={(value) => {
											if (/^\d*\.?\d{0,2}$/g.test(value)) {
												dispatch(xczcAccountActions.xczcPersonAmount('personAccumulationAmount',value))
												dispatch(xczcAccountActions.autoCalculateAmount(propertyPay))
											}
										}}
									/>
								</Row> : null
						}
					</Row> : null

				} else {
					amountCom = <Row className='lrls-card'>
						<Row className='yysr-amount'>
							<label>{usedProject ? '账户:' : '金额:'}</label>
							{ usedProject ? null :  <TextListInput
								placeholder={amountName}
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(xczcAccountActions.changeXczcData('amount', value))
									}
								}}
							/> }
							<Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(xczcAccountActions.changeXczcAccount(value))}
							/>
						</Row>
					</Row>
				}
			}
		}[runningState] || (() => null))()

		let projectCardCom = null
		const beProject = data.get('beProject')
		if (beProject && !(beAccrued && runningState == 'STATE_XC_JN')) {
			const changeAmount = (value) => {
				dispatch(xczcAccountActions.changeXczcData('amount', value))
			}
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
				showCommon={true}
			/>

		}

		let HxCom = null
		const paymentList = data.get('paymentList')
		const showHs = paymentList.some(v => v.get('beSelect'))
		if (beAccrued && runningState === 'STATE_XC_JN' && showHs) {
			HxCom = xczcCom('待发放公积金', jtAmount, paymentList, '计提公积金')
		}
		if (fromYl && beAccrued && runningState === 'STATE_XC_JT' && paymentList.size) {//从查询流水跳进来显示计提的核销情况
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
		}


		return(
			<Container className="lrls">
				<TopDatePicker
					disabled={isModify}
					value={runningDate}
					onChange={date => {
						dispatch(xczcAccountActions.changeXczcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (shouldGetAmount) {
							dispatch(xczcAccountActions.getXczcPaymentList())
						}
					}}
					callback={(value) => {
						dispatch(xczcAccountActions.changeXczcData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						if (shouldGetAmount) {
							dispatch(xczcAccountActions.getXczcPaymentList())
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
							showProject={beProject && !(beAccrued && runningState == 'STATE_XC_JN')}
							project={project}
							changeAmount = {(value) => {
								dispatch(xczcAccountActions.changeXczcData('amount', value))
							}}
						/>
						{	//费用性质
							(showPropertyCost && propertyList.length) > 1 ?
							<Row className='lrls-more-card lrls-margin-top'>
								<label>费用性质:</label>
								<SinglePicker
									district={propertyList}
									value={propertyCost}
									onOk={value => {
										dispatch(xczcAccountActions.changeXczcData('propertyCost', value.value))
									}}
								>
									<Row className='lrls-padding lrls-category'>
										<span className={propertyCostName !='请选择费用性质' ? '' : 'lrls-placeholder'}>
											{ propertyCostName }
										</span>
										<Icon type="triangle" />
									</Row>
								</SinglePicker>
							</Row> : null
						}
						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								dispatch(xczcAccountActions.changeXczcRunningState(propertyPay, key))
								dispatch(xczcAccountActions.changeXczcData('runningAbstract', abstractFun(key, data)))
								if (beAccrued && key == 'STATE_XC_JN') {
									dispatch(xczcAccountActions.getXczcPaymentList())
								}
							}}
						/>
					</div>

					<Row className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(xczcAccountActions.changeXczcData('runningAbstract',value))
							}}
						/>
					</Row>
					{ projectCardCom }
					{/* 金额组件 */}
					{ amountCom }
					{/* 代扣个人公积金 */}
					{ fundCom }
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
					{
						(beAccrued && runningState === 'STATE_XC_JN') ? <Row className='lrls-button-wrap'>
							<span
								className='lrls-button'
								onClick={() => {
									dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_XCZC_LS'))
								}}>
									{showHs ? '修改单据' : '请选择单据'}
							</span>
						</Row> : null
					}

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(xczcAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(xczcAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
