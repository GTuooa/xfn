import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Radio, TextListInput, Row, SinglePicker, Icon, Switch, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, xczcCom, abstractFun, hxCom } from '../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { sfzcAccountActions } from 'app/redux/Edit/Lrls/sfzcAccount'
import * as Limit from 'app/constants/Limit.js'
import * as Common from '../CommonData.js'
import { DateLib, decimal } from 'app/utils'
import { UploadFj } from '../components'

@connect(state => state)
export default
class Zzs extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			beOffsetAmount: false,//是否开启预交抵扣
			showList: true
        }
    }

	render () {
		const { dispatch, homeAccountState, sfzcAccountState, history, editPermission, enCanUse, checkMoreFj, showlsfj, label, enclosureList, enclosureCountUser  } = this.props
		const { beOffsetAmount, showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')
		const data = sfzcAccountState.get('data')
		const insertOrModify = sfzcAccountState.getIn(['views', 'insertOrModify'])
		const flowNumber = sfzcAccountState.getIn(['data', 'flowNumber'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = sfzcAccountState.getIn(['views', 'fromYl'])

		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const amount = data.get('amount')
		const handleAmount = data.get('handleAmount')//支付金额
		const offsetAmount = data.get("offsetAmount")// 预交抵扣金额
		const deductedAmount = data.get("deductedAmount")// 待抵扣金额
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额
		const reduceAmount = data.get('reduceAmount')//减免金额
		const totalPay = Number(offsetAmount) + Number(handleAmount) + Number(reduceAmount)//税费总额

		const propertyTax = data.get('propertyTax')//属性
		const acTax = data.get('acTax')
		const beInAdvance = acTax.get("beInAdvance")// 是否预交增值税
		const beReduce =  acTax.get("beReduce")// 设置中是否开启减免
		const usedReduce =  data.get("beReduce")// 流水中是否开启减免

		const radioList = [
			{key: 'STATE_SF_JN', value: '缴纳'},
			{key: 'STATE_SF_YJZZS', value: '预缴增值税', disabled: !beInAdvance, message: '流水设置中未启用'}
		]
		let shouldGetPaymentList = false//是否获取未处理金额
		let amountCom = null//金额组件
		let yjCom = null//预交组件
		let lsCom = null//税费总额组件
		let reduceCom = null//税费减免组件

		;({
			'STATE_SF_JN': () => {//缴纳
				shouldGetPaymentList = true
				amountCom = <Row className='lrls-card'>
					<Row className='yysr-amount'>
						<label>支付金额： </label>
						<TextListInput
							placeholder='填写金额'
							value={handleAmount}
							onChange={(value) => {
								if (/^\d*\.?\d{0,2}$/g.test(value)) {
									dispatch(sfzcAccountActions.changeSfzcData('handleAmount', value))
								}
							}}
						/>
						{ (handleAmount > 0) ? <Account
							history={history}
							accountList={accountList}
							accountUuid={accountUuid}
							accountName={accountName}
							onOk={(value) => dispatch(sfzcAccountActions.changeSfzcAccount(value))}
						/> : null }
					</Row>
				</Row>

				lsCom = <Row className='lrls-card'>
							<div>处理税费：<Amount showZero>{decimal(totalPay)}</Amount></div>
						</Row>

				if (beInAdvance) {//开启预交
					yjCom = <Row className='lrls-card'>
						<Row className='lrls-more-card'>
							<span>预交抵扣</span>
							<span className='noTextSwitchShort'>
								<Switch
									checked={beOffsetAmount || offsetAmount}
									color='#FF8348'
									onClick={() => {
										if (beOffsetAmount) {//变为不开启
											this.setState({beOffsetAmount: false})
											dispatch(sfzcAccountActions.changeSfzcData('offsetAmount', 0))
										} else {
											this.setState({beOffsetAmount: true})
										}
									}}
								/>
							</span>
						</Row>
						{
							(beOffsetAmount || offsetAmount) ? <Row className='lrls-padding-top'>
								<Row className='yysr-amount'>
									<label>金额： </label>
									<TextListInput
										placeholder='填写金额'
										value={offsetAmount}
										onChange={(value) => {
											if (/^\d*\.?\d{0,2}$/g.test(value)) {
												dispatch(sfzcAccountActions.changeSfzcData('offsetAmount', value))
											}
										}}
									/>
								</Row>
								{
									(isModify) ? null : <Row className='lrls-padding-top lrls-placeholder'>
										<span>待抵扣金额： <Amount showZero>{deductedAmount}</Amount></span>
									</Row>
								}
							</Row> : null
						}

					</Row>
				}

				if (beReduce) {//开启预交
					reduceCom = <Row className='lrls-card'>
						<Row className='lrls-more-card'>
							<span>税费减免</span>
							<span className='noTextSwitchShort'>
								<Switch
									checked={usedReduce}
									color='#FF8348'
									onClick={() => {
										if (usedReduce) {//变为不开启
											dispatch(sfzcAccountActions.changeSfzcData('beReduce', false))
											dispatch(sfzcAccountActions.changeSfzcData('reduceAmount', ''))
										} else {
											dispatch(sfzcAccountActions.changeSfzcData('beReduce', true))
										}
									}}
								/>
							</span>
						</Row>
						{
							(usedReduce) ? <Row className='yysr-amount lrls-padding-top'>
								<label>金额： </label>
								<TextListInput
									placeholder='填写金额'
									value={reduceAmount}
									onChange={(value) => {
										if (/^\d*\.?\d{0,2}$/g.test(value)) {
											dispatch(sfzcAccountActions.changeSfzcData('reduceAmount', value))
										}
									}}
								/>
							</Row> : null
						}
					</Row>
				}


			},
			'STATE_SF_YJZZS': () => {//预缴增值税
				shouldGetPaymentList = false
				amountCom = <Row className='lrls-card'>
					<Row className='yysr-amount'>
						<label> 金额： </label>
						<TextListInput
							placeholder='填写金额'
							value={amount}
							onChange={(value) => {
								if (/^\d*\.?\d{0,2}$/g.test(value)) {
									dispatch(sfzcAccountActions.changeSfzcData('amount', value))
								}
							}}
						/>
						{ (amount > 0) ? <Account
							history={history}
							accountList={accountList}
							accountUuid={accountUuid}
							accountName={accountName}
							onOk={(value) => dispatch(sfzcAccountActions.changeSfzcAccount(value))}
						/> : null }
					</Row>
				</Row>
			}
		}[runningState] || (() => null))()

		let HxCom = null
		const paymentList = data.get('paymentList')
		const showHs = paymentList.some(v => v.get('beSelect'))
		if (runningState === 'STATE_SF_JN' && showHs) {
			HxCom = xczcCom('待处理税费', jtAmount, paymentList, '未交增值税')
		}


		return(
			<Container className="lrls">
				<TopDatePicker
					disabled={isModify}
					value={runningDate}
					onChange={date => {
						dispatch(sfzcAccountActions.changeSfzcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (shouldGetPaymentList) {
							dispatch(sfzcAccountActions.getSfzcPaymentList())
						}
					}}
					callback={(value) => {
						dispatch(sfzcAccountActions.changeSfzcData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
						if (shouldGetPaymentList) {
							dispatch(sfzcAccountActions.getSfzcPaymentList())
						}
					}}
				/>

				<ScrollView flex="1">
					{ isModify ? <Row className='lrls-row'> {`流水号： ${flowNumber}`} </Row> : null }

					<Row className='lrls-card'>
						<CategoryCom
							isModify={isModify}
							dispatch={dispatch}
							lastCategory={lastCategory}
							categoryUuid={categoryUuid}
							categoryName={categoryName}
						/>
						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								dispatch(sfzcAccountActions.changeSfzcRunningState(propertyTax, key))
								dispatch(sfzcAccountActions.changeSfzcData('runningAbstract', abstractFun(key, data)))
								if (key == 'STATE_SF_JN') {
									dispatch(sfzcAccountActions.getSfzcPaymentList())
								}
							}}
						/>
					</Row>
					<Row className='lrls-card lrls-line'>
						<label>摘要:</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(sfzcAccountActions.changeSfzcData('runningAbstract',value))
							}}
						/>
					</Row>
					{ lsCom }

					{/* 金额组件 */}
					{ amountCom }
					{/* 预交 */}
					{ yjCom }
					{/* 减免 */}
					{ reduceCom }

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
						runningState === 'STATE_SF_JN' ? <Row className='lrls-button-wrap'>
							<span
								className='lrls-button'
								onClick={() => {
									dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_SFZC_LS'))
								}}>
									{showHs ? '修改单据' : '请选择单据'}
							</span>
						</Row> : null
					}

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(sfzcAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(sfzcAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
