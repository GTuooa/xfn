import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Radio, TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom } from '../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { sfzcAccountActions } from 'app/redux/Edit/Lrls/sfzcAccount'
import * as Limit from 'app/constants/Limit.js'
import { DateLib, decimal } from 'app/utils'
import { UploadFj } from '../components'

@connect(state => state)
export default
class Grsf extends React.Component {

	render () {
		const { dispatch, homeAccountState, sfzcAccountState, history, editPermission, enCanUse, checkMoreFj, showlsfj, label, enclosureList,enclosureCountUser } = this.props

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')
		const data = sfzcAccountState.get('data')
		const insertOrModify = sfzcAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false
		const flowNumber = sfzcAccountState.getIn(['data', 'flowNumber'])

		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const amount = data.get('amount')
		const radioList = [{key: 'STATE_SF_JN', value: '缴纳'}]

		const propertyTax = data.get('propertyTax')//属性
		const acTax = data.get('acTax')

		return(
			<Container className="lrls">
				<TopDatePicker
					disabled={isModify}
					value={runningDate}
					onChange={date => {
						dispatch(sfzcAccountActions.changeSfzcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
					}}
					callback={(value) => {
						dispatch(sfzcAccountActions.changeSfzcData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
					}}
				/>

				{ isModify ? <Row className='lrls-row'> {`流水号： ${flowNumber}`} </Row> : null }

				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
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

					<Row className='lrls-card'>
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
