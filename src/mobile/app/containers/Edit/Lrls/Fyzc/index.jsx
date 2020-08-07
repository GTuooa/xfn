import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Radio, TextListInput, Row, SinglePicker, Icon, SwitchText, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, ContancsCom, costList, propertyCostObj, CategoryCom, hxCom, ProjectCom, abstractFun } from '../components'
import * as Limit from 'app/constants/Limit.js'
import * as Common from '../CommonData.js'
import { DateLib } from 'app/utils'
import { UploadFj } from '../components'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { fyzcAccountActions } from 'app/redux/Edit/Lrls/fyzcAccount'

@connect(state => state)
export default
class Fyzc extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false
		}
    }

	render () {
		const { dispatch, homeAccountState, fyzcAccountState, history, homeState, editPermission } = this.props
		const { showList } = this.state

		const rate = homeAccountState.get('rate')
		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')
		const data = fyzcAccountState.get('data')
		const insertOrModify = fyzcAccountState.getIn(['views', 'insertOrModify'])
		const flowNumber = fyzcAccountState.getIn(['data', 'flowNumber'])
		const isModify = insertOrModify === 'modify' ? true : false

		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const showAccount = runningState === 'STATE_FY_WF' ? false : true //是否显示账户
		const amount = data.get('amount')
		const acCost = data.get('acCost')
		const beManagemented = acCost.get('beManagemented')//收付管理
		const beDeposited = acCost.get('beManagemented')//是否启用预付

		const radioList = [
			{key: 'STATE_FY_DJ', value: '预付', disabled: beManagemented && beDeposited ? false : true, message: '流水设置中未启用'},
			{key: 'STATE_FY_YF', value: '已付款'},
			{key: 'STATE_FY_WF', value: '未付款', disabled: beManagemented ? false : true, message: '流水设置中未启用'}
		]
		//费用性质
		const propertyCostList = data.get('propertyCostList')
		const propertyList = costList(propertyCostList)
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acCost, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

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
		const scale = rate.get('scale')

		const taxRate = data.get('taxRate')
		const tax = data.get('tax')
		let invoiceCom = null//发票
		let taxRateCom = null//税率组件

		if (scale == 'general' && runningState != 'STATE_FY_DJ') {
			taxRateCom = (<Row className='lrls-more-card lrls-margin-top'>
				<label>税率:</label>
				<SinglePicker
					district={Common.taxRateList}
					value={taxRate}
					onOk={value => {
						if (fromNoToYes) {
							return
						}
						dispatch(fyzcAccountActions.changeFyzcTaxRateOrAmount('taxRate', value.value))
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
								dispatch(fyzcAccountActions.changeFyzcData('billType', value.value))
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
								dispatch(fyzcAccountActions.changeFyzcBillStates())
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


		let projectCardCom = null
		const beProject = data.get('beProject')
		let showAmount = true
		const project = homeAccountState.get('project')
		if (beProject && runningState != 'STATE_FY_DJ') {
			const usedProject = project.get('usedProject')
			showAmount = !usedProject//开启项目不显示总金额
			const changeAmount = (value) => dispatch(fyzcAccountActions.changeFyzcTaxRateOrAmount('amount',value))
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
				showCommon={true}
				isFyzc={true}
			/>
		}

		let contactsCardCom = null
		if (beManagemented) {
			const contactsCardList = fyzcAccountState.get('contactsCardList')//往来关系列表
			const contactsCardRange = acCost.get('contactsCardRange')//往来关系卡片
			const contactsRange = acCost.get('contactsRange')
			let onOk = (value) => {
				dispatch(fyzcAccountActions.changeFyzcAssList(value.value, 'contactsCardRange'))
			}
			let showBottom = (showAmount || (showAccount && amount != 0)) ? 'showBottom' : 'noBottom'
			contactsCardCom = <ContancsCom
				cardList={contactsCardList}
				cardObj={contactsCardRange}
				noBottom={showBottom}
				onOk={onOk}
				history={history}
				dispatch={dispatch}
				isPayUnit={true}
				contactsRange={contactsRange}
				disabled={isModify}
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
					disabled={isModify}
					value={runningDate}
					onChange={date => {
						dispatch(fyzcAccountActions.changeFyzcDate(new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
					}}
					callback={(value) => {
						dispatch(fyzcAccountActions.changeFyzcDate(value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
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
							showProject={beProject && runningState != 'STATE_FY_DJ'}
							project={project}
							showCommon={true}
							isFyzc={true}
							changeAmount = {(value) => dispatch(fyzcAccountActions.changeFyzcTaxRateOrAmount('amount',value))}
						/>

						{
							(propertyList.length > 1 && runningState != 'STATE_FY_DJ') ?
								<Row className='lrls-more-card lrls-margin-top'>
									<label>费用性质: </label>
									<SinglePicker
										district={propertyList}
										value={propertyCost}
										onOk={value => {
											dispatch(fyzcAccountActions.changeFyzcData('propertyCost', value.value))
										}}
									>
										<Row className='lrls-padding lrls-category'>
											<span className={propertyCostName !='请选择费用性质' ? '' : 'lrls-placeholder'}>
												{ propertyCostName }
											</span>
											<Icon type="triangle" />
										</Row>
									</SinglePicker>
								</Row>

							: null
						}
						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								dispatch(fyzcAccountActions.changeFyzcRunningState(key))
								dispatch(fyzcAccountActions.getFyzcCardList('contactsRange'))
								dispatch(fyzcAccountActions.changeFyzcData('runningAbstract', abstractFun(key, data)))
							}}
						/>

					</div>


					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(fyzcAccountActions.changeFyzcData('runningAbstract',value))
							}}
						/>
					</div>
					{ projectCardCom }
					<div className='lrls-card' style={{display: beManagemented || showAmount || showAccount ? '' : 'none'}}>
						{/* 往来关系 */}
						{ contactsCardCom }
						<Row className='yysr-amount'>
							{ showAmount ? <label>{runningState == 'STATE_FY_DJ' ? '预付金额:' : '金额: '}</label> : null }
							{
								showAmount ? <TextListInput
									placeholder='填写金额'
									value={amount}
									onChange={(value) => {
										if (/^[-\d]\d*\.?\d{0,2}$/g.test(value) || value == '') {
											dispatch(fyzcAccountActions.changeFyzcTaxRateOrAmount('amount',value))
										}
									}}
								/> : null
							}
							{ !showAmount && amount != 0 && showAccount ? <label>账户:</label> : null }
							{ (amount != 0 && showAccount) ? <Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(fyzcAccountActions.changeFyzcAccount(value))}
							/> : null }
						</Row>
					</div>

					{/* 发票 */}
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
						dispatch(fyzcAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(fyzcAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}
