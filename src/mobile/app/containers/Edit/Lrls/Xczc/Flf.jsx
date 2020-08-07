import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Radio, TextListInput, Row, SinglePicker, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, costList, propertyCostObj, CategoryCom, ProjectCom } from '../components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { xczcAccountActions } from 'app/redux/Edit/Lrls/xczcAccount'
import * as Common from '../CommonData.js'
import { DateLib } from 'app/utils'
import { UploadFj } from '../components'

@connect(state => state)
export default
class Flf extends React.Component {

	render () {
		const { dispatch, homeAccountState, xczcAccountState, history, editPermission, enCanUse, checkMoreFj, showlsfj, label, enclosureList, enclosureCountUser } = this.props

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')
		const data = xczcAccountState.get('data')
		const insertOrModify = xczcAccountState.getIn(['views', 'insertOrModify'])
		const flowNumber = xczcAccountState.getIn(['data', 'flowNumber'])
		const isModify = insertOrModify === 'modify' ? true : false

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
		const beWelfare = acPayment.get("beWelfare")// 是否过渡福利费

		//费用性质
		const propertyCostList = data.get('propertyCostList')
		const propertyList = costList(propertyCostList)
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acPayment, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		let projectCardCom = null
		let showAmount = true//是否显示金额组件
		const beProject = data.get('beProject')
		const project = homeAccountState.get('project')
		if (beProject) {
			const usedProject = project.get('usedProject')
			if (usedProject) {
				showAmount = false
			}
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

		return(
			<Container className="lrls">
				<TopDatePicker
					disabled={isModify}
					value={runningDate}
					onChange={date => {
						dispatch(xczcAccountActions.changeXczcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
					}}
					callback={(value) => {
						dispatch(xczcAccountActions.changeXczcData('runningDate', value))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
					}}
				/>

				{ isModify ? <Row className='lrls-row'> {`流水号： ${flowNumber}`} </Row> : null }

				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					<div className='lrls-card'>
						<CategoryCom
							isModify={isModify}
							dispatch={dispatch}
							lastCategory={lastCategory}
							categoryUuid={categoryUuid}
							categoryName={categoryName}
							showProject={beProject}
							project={project}
							changeAmount = {(value) => {
								dispatch(xczcAccountActions.changeXczcData('amount', value))
							}}
						/>

						{
							propertyList.length > 1 ?
							<Row className='lrls-more-card lrls-margin-top'>
								<label>费用性质: </label>
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

					<div className='lrls-card'>
						{/* 金额组件 */}
						<Row className='yysr-amount'>
							<label>{showAmount ? '金额:' : '账户：'}</label>
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

							<Account
								history={history}
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(value) => dispatch(xczcAccountActions.changeXczcAccount(value))}
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
						history={history}
					/>
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
