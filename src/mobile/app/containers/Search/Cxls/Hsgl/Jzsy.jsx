import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { TextInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, SwitchText, TextListInput, SinglePicker } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account } from 'app/containers/Edit/Lrls/components'

import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import { cxAccountActions } from 'app/redux/Search/Cxls'


@connect(state => state)
export default
class Jzsy extends React.Component {

	componentDidMount() {
		const runningDate = new DateLib(new Date()).valueOf()
		this.props.dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], runningDate))
		const cxAccountState = this.props.cxAccountState
		if (cxAccountState.getIn(['data', 'beProject'])) {//获取项目卡片
			const projectRange = cxAccountState.getIn(['data', 'projectRange'])
			this.props.dispatch(cxAccountActions.getProjectCardList(projectRange))
		}
	}

	render () {
		const { dispatch, cxAccountState } = this.props
		const data = cxAccountState.get('data')

		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const categoryName = data.get('categoryName')
		const fromRouter = cxAccountState.getIn(['views', 'fromRouter'])

		const beProject =  data.get('beProject')
		const usedProject = data.get('usedProject')
		const projectCardList = cxAccountState.get('projectCardList')
		const projectCard = data.getIn(['projectCard', 0])
		const showName = `${projectCard.get('code')} ${projectCard.get('name')}`

		const amount = data.get('amount')
		const originalAssetsAmount = data.getIn(['acAssets', 'originalAssetsAmount'])
		const depreciationAmount = data.getIn(['acAssets', 'depreciationAmount'])
		let totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)

		return(
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => {
						dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], new DateLib(date).valueOf()))

					}}
					callback={(value) => {
						dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], value))

					}}
				/>

				<ScrollView flex="1">
					<div className='lrls-card'>
						<Row className='lrls-more-card lrls-switch'>
							<label>处理类别: </label>
							<Row className='antd-single-picker lrls-padding lrls-category'>
								<span>{categoryName}</span>
								<Icon type="triangle"/>
							</Row>
							{
								(beProject) ? <SwitchText
									checked={usedProject}
									checkedChildren='项目'
									unCheckedChildren=''
									className='topBarSwitch'
									onChange={(value) => {
										dispatch(cxAccountActions.changeCxlsData(['data', 'usedProject'], !usedProject))
									}}
								/> : null
							}
						</Row>
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(cxAccountActions.changeCxlsData(['data', 'runningAbstract'], value))
							}}
						/>
					</div>

					{
						usedProject ? <div className='lrls-card'>
							<div className='lrls-more-card'>
								<label>项目:</label>
								<SinglePicker
									district={projectCardList.toJS()}
									value={projectCard.get('uuid') ? `${projectCard.get('uuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
									onOk={value => {
										const arr = value.value.split(Limit.TREE_JOIN_STR)
										dispatch(cxAccountActions.changeCxlsData(['data', 'projectCard', 0, 'uuid'], arr[0]))
										dispatch(cxAccountActions.changeCxlsData(['data', 'projectCard', 0, 'code'], arr[1]))
										dispatch(cxAccountActions.changeCxlsData(['data', 'projectCard', 0, 'name'], arr[2]))
									}}
								>
									<Row className='lrls-category lrls-padding'>
										{
											projectCard.get('uuid') ? <span> {showName} </span>
											: <span className='lrls-placeholder'>点击选择项目卡片</span>
										}
										<Icon type="triangle" />
									</Row>
								</SinglePicker>
							</div>
						</div> : null
					}

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
										dispatch(cxAccountActions.changeCxlsData(['data', 'acAssets', 'originalAssetsAmount'], value))
									}
								}}
							/>
						</Row>
						<Row className='yysr-amount lrls-margin-top lrls-jzsy'>
							<label>累计折旧余额:</label>
							<TextListInput
								placeholder='请填写累计折旧余额'
								value={depreciationAmount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(cxAccountActions.changeCxlsData(['data', 'acAssets', 'depreciationAmount'], value))
									}
								}}
							/>
						</Row>
						<Row className='yysr-amount lrls-margin-top lrls-jzsy'>
							<label>处置金额:</label>
							<Amount showZero>{amount}</Amount>
						</Row>
					</div>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(cxAccountActions.saveJzsy())
					}}>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
