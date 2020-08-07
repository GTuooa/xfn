import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { TextListInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { CategoryCom } from '../components'
import { cqzcAccountActions } from 'app/redux/Edit/Lrls/cqzcAccount'
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

		const flowNumber = data.get('flowNumber')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const acAssets = data.get('acAssets')
		const businessList = data.get('businessList')

		const amount = data.get('amount')
		const originalAssetsAmount = acAssets.get('originalAssetsAmount')// 资产原值
		const depreciationAmount = acAssets.get('depreciationAmount')// 折旧累计
		let totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)

		return(
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => { return }}
					callback={(value) => { return }}
				/>

				<Row className='lrls-row'> {`流水号： ${flowNumber}`} </Row>

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
						<Row>
							<label style={{marginRight: '.15rem'}}>{totalAmount >= 0 ? '净收益金额：' : '净损失金额：'}</label>
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
						<Row className='yysr-amount margin-top-bot lrls-jzsy'>
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
					<Row className='lrls-card'>
						<div>流水号：{businessList.getIn([0, 'flowNumber'])}</div>
						<div className='lrls-padding-top'>金额：<Amount showZero>{businessList.getIn([0, 'acAssets', 'cleaningAmount'])}</Amount></div>
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
