import React from 'react'
import { connect }	from 'react-redux'
import { fromJS ,toJS } from 'immutable'

import { Radio, TextListInput, Row, SinglePicker, Icon, Switch, SwitchText, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account, CategoryCom, ProjectCom } from '../components'
import { cqzcAccountActions } from 'app/redux/Edit/Lrls/cqzcAccount'
import * as Limit from 'app/constants/Limit.js'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import * as Common from '../CommonData.js'
import { DateLib } from 'app/utils'
import { UploadFj } from '../components'

@connect(state => state)
export default
class Cqzc extends React.Component {

	render () {
		const { dispatch, homeAccountState, cqzcAccountState, editPermission, enCanUse, checkMoreFj, showlsfj, label, enclosureList,enclosureCountUser, history } = this.props
		const lastCategory = homeAccountState.get('lastCategory')

		const data = cqzcAccountState.get('data')
		const insertOrModify = cqzcAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const flowNumber = data.get('flowNumber')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const acAssets = data.get('acAssets')
		const tax = data.get('tax')
		const billType = data.get('billType')

		const originalAssetsAmount = acAssets.get('originalAssetsAmount')// 资产原值
		const depreciationAmount = acAssets.get('depreciationAmount')// 折旧累计
		let totalAmount = 0
		if (billType === 'bill_common') {
			totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount) - Number(tax)
		} else {
			totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)
		}

		let projectCardCom = null
		const beProject = data.get('beProject')
		const project = homeAccountState.get('project')
		const usedProject = project.get('usedProject')
		const projectCard = project.getIn(['projectCard', 0]) ? project.getIn(['projectCard', 0]) : fromJS({})
		let showName = ''
		if (usedProject) {
			showName = `${projectCard.get('code')} ${projectCard.get('name')}`
		}

		if (projectCard.get('name') == '项目公共费用') {
			showName = '项目公共费用'
		}


		return(
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => {
						dispatch(cqzcAccountActions.changeCqzcData('runningDate', new DateLib(date).valueOf()))
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))
					}}
					callback={(value) => {
						dispatch(cqzcAccountActions.changeCqzcData('runningDate', value))
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
						/>
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(cqzcAccountActions.changeCqzcData('runningAbstract', value))
							}}
						/>
					</div>

					<div className='lrls-card'>
						<div className='lrls-more-card lrls-jzsy' style={{display: beProject ? '' : 'none'}}>
							<label>项目:</label>
							<SinglePicker
								disabled={!usedProject}
								district={project.get('projectCardList').toJS()}
								value={projectCard.get('uuid') ? `${projectCard.get('uuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
								onOk={value => { dispatch(homeAccountActions.changeProjectCard('card', value.value, 0)) }}
							>
								<Row className='lrls-category lrls-padding'>
									{
										projectCard.get('uuid') ? <span> {showName} </span>
										: <span className='lrls-placeholder'>点击选择项目卡片</span>
									}
									<Icon type="triangle" />
								</Row>
							</SinglePicker>
							<div className='noTextSwitchShort' style={{marginLeft: '6px'}}>
								<Switch
									checked={usedProject}
									color='#FF8348'
									onClick={() => {
										dispatch(homeAccountActions.changeHomeAccountData('project', !usedProject))
										if (usedProject) {
											dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
										}
									}}
								/>
							</div>
						</div>

						<Row className='margin-top-bot'>
							<label style={{marginRight: '.15rem'}}>
								{totalAmount >= 0 ? '净收益金额：' : '净损失金额：'}
							</label>
							<Amount showZero>{Math.abs(totalAmount)}</Amount>
						</Row>
						<Row className='yysr-amount margin-top-bot lrls-jzsy'>
							<label>资产原值:</label>
							<TextListInput
								placeholder='请填写资产原值'
								value={originalAssetsAmount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(cqzcAccountActions.changeCqzcCzAmount('originalAssetsAmount', value))
										dispatch(cqzcAccountActions.autoCqzcCzAmount())
									}
								}}
							/>
						</Row>
						<Row className='yysr-amount lrls-jzsy'>
							<label>累计折旧余额:</label>
							<TextListInput
								placeholder='请填写累计折旧余额'
								value={depreciationAmount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(cqzcAccountActions.changeCqzcCzAmount('depreciationAmount', value))
										dispatch(cqzcAccountActions.autoCqzcCzAmount())
									}
								}}
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
						dispatch(cqzcAccountActions.saveRunningbusiness())
					}}>
						<Icon type="save"/>
						<span>保存</span>
					</Button>

					<Button onClick={() => {
						dispatch(cqzcAccountActions.saveRunningbusiness(true))
					}}>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
