import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Radio, TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, costList, propertyCostObj, CategoryCom, xczcCom, ProjectCom, abstractFun, hxCom } from '../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { xczcAccountActions } from 'app/redux/Edit/Lrls/xczcAccount'
import * as Limit from 'app/constants/Limit.js'
import * as Common from '../CommonData.js'
import { DateLib } from 'app/utils'
import './index.less'
import { UploadFj } from '../components'

@connect(state => state)
export default
class Qtxc extends React.Component {
	state = {
		showList: true
	}

	render () {
		const { dispatch, homeAccountState, xczcAccountState, history, editPermission, enCanUse, checkMoreFj, showlsfj, label, enclosureList, enclosureCountUser } = this.props
		const { showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')
		const data = xczcAccountState.get('data')
		const insertOrModify = xczcAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false
		const fromYl = xczcAccountState.getIn(['views', 'fromYl'])

		const flowNumber = xczcAccountState.getIn(['data', 'flowNumber'])
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
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额

		//费用性质
		const propertyCostList = data.get('propertyCostList')
		const propertyList = costList(propertyCostList)
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acPayment, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		const radioList = [
			{key: 'STATE_XC_JT', value: '计提', disabled: !beAccrued, message: '流水设置中未启用'},
			{key: 'STATE_XC_FF', value: '发放'}
		]
		let showPropertyCost = false//是否显示费用性质
		let showAccount = false //是否显示账户
		let shouldGetAmount = false//是否获取未处理金额
		let showJtAmount = false //是否显示待发放薪酬
		let amountCom = null//金额组件

		;({
			'STATE_XC_JT': () => {//计提
				showPropertyCost = true
			},
			'STATE_XC_FF': () => {
				//开启计提 发放 不显示费用性质
				showPropertyCost = beAccrued ? false : true
				showAccount = true
				shouldGetAmount = beAccrued ? true : false
				// accruedCom = beAccrued ? accruedCom : null
				showJtAmount = beAccrued ? true : false
			}
		}[runningState] || (() => null))()

		let projectCardCom = null
		const beProject = data.get('beProject')
		let showAmount = true
		const project = homeAccountState.get('project')
		if (beProject && !(beAccrued && runningState == 'STATE_XC_FF')) {
			const usedProject = project.get('usedProject')
			showAmount = !usedProject//开启项目不显示总金额
			const changeAmount = (value) => dispatch(xczcAccountActions.changeXczcData('amount', value))
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
				showCommon={runningState == 'STATE_XC_JT' ? true : false}
			/>
		}

		let HxCom = null
		const paymentList = data.get('paymentList')
		const showHs = paymentList.some(v => v.get('beSelect'))
		if (showJtAmount && showHs) {
			HxCom = xczcCom('待发放薪酬', jtAmount, paymentList, '计提其他薪酬')
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
						if (isModify) {
							return
						}
						dispatch(xczcAccountActions.changeXczcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
						if (shouldGetAmount) {
							dispatch(xczcAccountActions.getXczcPaymentList())
						}
					}}
					callback={(value) => {
						if (isModify) {
							return
						}
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
							showProject={beProject && !(beAccrued && runningState == 'STATE_XC_FF')}
							project={project}
							changeAmount = {(value) => dispatch(xczcAccountActions.changeXczcData('amount', value))}
						/>

						{	//费用性质
							(showPropertyCost && propertyList.length > 1) ?
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
								if (beAccrued && key == 'STATE_XC_FF') {
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

					<Row className='lrls-card' style={{display: (showAmount || showAccount) ? '' : 'none'}}>
						<Row className='yysr-amount'>
							{ showAmount ? <label> 金额： </label> : null }
							{
								showAmount ? <TextListInput
									placeholder='填写金额'
									value={amount}
									onChange={(value) => {
										if (/^\d*\.?\d{0,2}$/g.test(value)) {
											dispatch(xczcAccountActions.changeXczcData('amount', value))
										}
									}}
								/> : null
							}
							{ !showAmount && showAccount ? <label>账户: </label> : null }
							{ showAccount ? <Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(xczcAccountActions.changeXczcAccount(value))}
							/> : null }
						</Row>
					</Row>

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
						(showJtAmount) ? <Row className='lrls-button-wrap'>
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
