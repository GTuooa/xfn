import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, SwitchText, XfInput, Single } from 'app/components'
import { TopDatePicker, EnclosurePublic } from 'app/containers/components'

import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js'


@connect(state => state)
export default
class Jzsy extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({ title: '处置损益' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		sessionStorage.setItem('prevPage','searchrunning')

		const searchRunningState = this.props.searchRunningState
		if (searchRunningState.getIn(['data', 'beProject'])) {//获取项目卡片
			const projectRange = searchRunningState.getIn(['data', 'projectRange'])
			this.props.dispatch(searchRunningActions.getProjectCardList(projectRange))
		}
	}

	render () {
		const { dispatch, searchRunningState, history } = this.props
		const data = searchRunningState.get('data')

		const oriDate = data.get('oriDate')
		const oriAbstract = data.get('oriAbstract')
		const categoryName = data.get('categoryName')

		const beProject =  data.get('beProject')
		const usedProject = data.get('usedProject')
		const projectList = searchRunningState.get('projectList')
		const projectCard = data.getIn(['projectCardList', 0])
		const showName = `${projectCard.get('code')} ${projectCard.get('name')}`

		const amount = data.get('amount')
		const originalAssetsAmount = data.getIn(['assets', 'originalAssetsAmount'])
		const depreciationAmount = data.getIn(['assets', 'depreciationAmount'])
		const cleaningAmount = data.getIn(['assets', 'cleaningAmount'])

		return(
			<Container className="edit-running">
				<TopDatePicker
					value={oriDate}
					onChange={date => {
						dispatch(searchRunningActions.changeCxlsData(['data', 'oriDate'], new DateLib(date).valueOf()))

					}}
					callback={(value) => {
						dispatch(searchRunningActions.changeCxlsData(['data', 'oriDate'], value))

					}}
				/>

				<ScrollView flex="1">
					<div className='lrls-card'>
						<Row className='lrls-more-card lrls-switch'>
							<label>处理类别: </label>
							<Row className='antd-single-picker lrls-padding lrls-category'>
								<span>{categoryName}</span>
								<Icon type="triangle" style={{color: '#ccc'}}/>
							</Row>
							{
								(beProject) ? <SwitchText
									checked={usedProject}
									checkedChildren='项目'
									unCheckedChildren=''
									className='topBarSwitch'
									onChange={(value) => {
										dispatch(searchRunningActions.changeCxlsData(['data', 'usedProject'], !usedProject))
									}}
								/> : null
							}
						</Row>
					</div>

					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={oriAbstract}
							onChange={(value) => {
								dispatch(searchRunningActions.changeCxlsData(['data', 'oriAbstract'], value))
							}}
						/>
					</div>

					{
						usedProject ? <div className='lrls-card'>
							<div className='lrls-more-card'>
								<label>项目:</label>
								<Single
									className='lrls-single'
									district={projectList.toJS()}
									value={projectCard.get('cardUuid') ? `${projectCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${projectCard.get('code')}${Limit.TREE_JOIN_STR}${projectCard.get('name')}` : ''}
									onOk={value => {
										const arr = value.value.split(Limit.TREE_JOIN_STR)
										dispatch(searchRunningActions.changeCxlsData(['data', 'projectCardList', 0, 'cardUuid'], arr[0]))
										dispatch(searchRunningActions.changeCxlsData(['data', 'projectCardList', 0, 'code'], arr[1]))
										dispatch(searchRunningActions.changeCxlsData(['data', 'projectCardList', 0, 'name'], arr[2]))
									}}
								>
									<Row className='lrls-category lrls-padding'>
										{
											projectCard.get('cardUuid') ? <span> {showName} </span>
											: <span className='lrls-placeholder'>点击选择项目卡片</span>
										}
										<Icon type="triangle" />
									</Row>
								</Single>
							</div>
						</div> : null
					}

					<div className='lrls-card'>
						<Row>
							<label style={{marginRight: '.15rem'}}>{amount >= 0 ? '净收益金额：' : '净损失金额：'}</label>
							<Amount showZero>{Math.abs(amount)}</Amount>
						</Row>
						<Row className='yysr-amount margin-top-bot lrls-jzsy'>
							<label>资产原值:</label>
							<XfInput.BorderInputItem
							    mode='amount'
								placeholder='请填写资产原值'
								value={originalAssetsAmount}
								onChange={(value) => {
									const amountValue = Number(depreciationAmount) + Number(cleaningAmount) - Number(value)
									dispatch(searchRunningActions.changeCxlsData(['data', 'assets', 'originalAssetsAmount'], value))
									dispatch(searchRunningActions.changeCxlsData(['data', 'amount'], amountValue))
								}}
							/>
						</Row>
						<Row className='yysr-amount lrls-margin-top lrls-jzsy'>
							<label>累计折旧余额:</label>
							<XfInput.BorderInputItem
							    mode='amount'
								placeholder='请填写累计折旧余额'
								value={depreciationAmount}
								onChange={(value) => {
									const amountValue = Number(value) + Number(cleaningAmount) - Number(originalAssetsAmount)
									dispatch(searchRunningActions.changeCxlsData(['data', 'assets', 'depreciationAmount'], value))
									dispatch(searchRunningActions.changeCxlsData(['data', 'amount'], amountValue))
								}}
							/>
						</Row>
						<Row className='yysr-amount lrls-margin-top lrls-jzsy'>
							<label>处置金额:</label>
							<Amount showZero>{cleaningAmount}</Amount>
						</Row>
					</div>
					<EnclosurePublic history={history}/>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						history.goBack()
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(searchRunningActions.saveJzsy(history))
					}}>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
