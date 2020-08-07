import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { yywzcAccountActions } from 'app/redux/Edit/Lrls/Qtls/yywzcAccount'

import { Radio, TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, ContancsCom, ProjectCom, UploadFj, hxCom } from '../../components'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Yywzc extends React.Component {
	state = {
		showList: true
	}

	render () {
		const { dispatch, homeAccountState, yywzcAccountState, history, homeState, editPermission } = this.props
		const { showList } = this.state

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = yywzcAccountState.get('data')
		const insertOrModify = yywzcAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const flowNumber = data.get('flowNumber')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningState = data.get('runningState')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const showAccount = runningState === 'STATE_YYWZC_YF' ? true : false//是否显示账户
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')

		const acBusinessOutExpense = data.get('acBusinessOutExpense')
		const beManagemented = acBusinessOutExpense.get('beManagemented')//收付管理
		const radioList = [
			{key: 'STATE_YYWZC_WF', value: '未付款', disabled: !beManagemented, message: '流水设置中未启用'},
			{key: 'STATE_YYWZC_YF', value: '已付款'}
		]

		let projectCardCom = null
		const beProject = data.get('beProject')
		const project = homeAccountState.get('project')
		let showAmount = true
		if (beProject) {
			const usedProject = project.get('usedProject')
			showAmount = !usedProject//开启项目不显示总金额
			const changeAmount = (value) => dispatch(yywzcAccountActions.changeYywzcData('amount', value))
			projectCardCom = <ProjectCom
				project={project}
				dispatch={dispatch}
				changeAmount={changeAmount}
			/>
		}

		let contactsCardCom = null
		if (beManagemented) {
			const contactsCardList = yywzcAccountState.get('contactsCardList')//往来关系列表
			const contactsCardRange = acBusinessOutExpense.get('contactsCardRange')//往来关系卡片
			const contactsRange = acBusinessOutExpense.get('contactsRange')
			let onOk = (value) => {
				dispatch(yywzcAccountActions.changeYywzcCard(value.value, 'contactsCardRange'))
			}
			let showBottom = (showAmount || showAccount) ? 'showBottom' : 'noBottom'
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
		if (paymentList && paymentList.size) {
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
						dispatch(yywzcAccountActions.changeYywzcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
					}}
					callback={(value) => {
						dispatch(yywzcAccountActions.changeYywzcData('runningDate', value))
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
							project={project}
							showProject={beProject}
							changeAmount = {(value) => dispatch(yywzcAccountActions.changeYywzcData('amount', value))}
						/>
						<Radio
							disabled={isModify}
							list={radioList}
							value={runningState}
							onChange={(key) => {
								dispatch(yywzcAccountActions.changeYywzcData('runningState', key))
							}}
						/>
					</div>

					<Row className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(yywzcAccountActions.changeYywzcData('runningAbstract', value))
							}}
						/>
					</Row>

					{ projectCardCom }

					<div className='lrls-card' style={{display: beManagemented || showAmount || showAccount ? '' : 'none'}}>
						{/* 往来关系卡片 */}
						{ contactsCardCom }
						<Row className='yysr-amount'>
							{ showAmount ? <label>金额：</label> : null }
							{ showAmount ? <TextListInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(yywzcAccountActions.changeYywzcData('amount', value))
									}
								}}
							/> : null }
							{ !showAmount && showAccount ? <label>账户:</label> : null }
							{ showAccount ? <Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(yywzcAccountActions.changeAccount(value))}
							/> : null }
						</Row>
					</div>
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
					/>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(yywzcAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(yywzcAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
