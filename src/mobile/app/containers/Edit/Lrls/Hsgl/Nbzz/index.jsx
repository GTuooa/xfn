import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'
import { TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, UploadFj  } from '../../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { nbzzAccountActions } from 'app/redux/Edit/Lrls/Hsgl/nbzzAccount'
import { DateLib } from 'app/utils'

@connect(state => state)
export default
class Nbzz extends React.Component {

	render () {
		const { dispatch, homeAccountState, nbzzAccountState, history, homeState, editPermission } = this.props

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')

		const data = nbzzAccountState.get('data')
		const insertOrModify = nbzzAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const fromAccountName = data.get('fromAccountName')//转出账户
		const fromAccountUuid = data.get('fromAccountUuid')
		const toAccountName = data.get('toAccountName')//转入账户
		const toAccountUuid = data.get('toAccountUuid')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')

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
						dispatch(nbzzAccountActions.changeNbzzData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))

					}}
					callback={(value) => {
						dispatch(nbzzAccountActions.changeNbzzData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
					}}
				/>

				<ScrollView flex="1">
					<div className='lrls-card'>
						<CategoryCom
							isModify={isModify}
							dispatch={dispatch}
							lastCategory={lastCategory}
							categoryUuid={categoryUuid}
							categoryName={categoryName}
						/>
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要:</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(nbzzAccountActions.changeNbzzData('runningAbstract', value))
							}}
						/>
					</div>

					<div className='lrls-card'>
						<Row className='yysr-amount'>
							<label> 金额: </label>
							<TextListInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(nbzzAccountActions.changeNbzzData('amount', value))
									}
								}}
							/>
						</Row>
						<Row className='yysr-amount lrls-home-account margin-top-bot'>
							<label> 转出账户: </label>
							<Account
								history={history}
								accountList={accountList}
								accountUuid={fromAccountUuid}
								accountName={fromAccountName}
								onOk={(value) => dispatch(nbzzAccountActions.changeNbzzAccount('fromAccount', value))}
							/>
						</Row>
						<Row className='yysr-amount lrls-home-account'>
							<label> 转入账户: </label>
							<Account
								history={history}
								accountList={accountList}
								accountUuid={toAccountUuid}
								accountName={toAccountName}
								onOk={(value) => dispatch(nbzzAccountActions.changeNbzzAccount('toAccount', value))}
							/>
						</Row>
					</div>
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
						dispatch(nbzzAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button onClick={() => {
						dispatch(nbzzAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
