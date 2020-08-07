import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { XfInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, Single } from 'app/components'
import { TopDatePicker, EnclosurePublic } from 'app/containers/components'
import Poundage from './Poundage.jsx'

import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js'


@connect(state => state)
export default
class Xczc extends React.Component {
	componentDidMount() {
		const notHandleAmount = this.props.searchRunningState.getIn(['data', 'notHandleAmount'])
		thirdParty.setTitle({ title: `${notHandleAmount >= 0 ? '付款核销' : '收款核销'}` })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		sessionStorage.setItem('prevPage','searchrunning')
	}

	render () {
		const { dispatch, searchRunningState, allState, history } = this.props

		const data = searchRunningState.get('data')
		const accountName = data.getIn(['accounts', 0, 'accountName'])
		const accountUuid = data.getIn(['accounts', 0, 'accountUuid'])
		const oriDate = data.get('oriDate')
		const oriAbstract = data.get('oriAbstract')
		const amount = data.get('amount')
		const notHandleAmount = data.get('notHandleAmount')

		const accountListOri = allState.get('accountList')
		let accountListJson = []
		accountListOri.size && accountListOri.getIn([0, 'childList']).forEach((v, i) => {
			let item = v.toJS()
			item['key'] = v.get('name')
			item['value'] = `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`
			accountListJson.push(item)
		})

		//手续费
		const accountPoundage = allState.get('accountPoundage')
		const poundageCurrentList = searchRunningState.get('poundageCurrentList')
		const poundageProjectList = searchRunningState.get('poundageProjectList')
		const accounts = data.get('accounts')

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

					<Row className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={oriAbstract}
							onChange={(value) => {
								dispatch(searchRunningActions.changeCxlsData(['data', 'oriAbstract'], value))
							}}
						/>
					</Row>

					<div className='lrls-card'>
						<Row className='yysr-amount'>
							<label>{notHandleAmount >= 0 ? '付款金额:' : '收款金额:'}</label>
							<XfInput.BorderInputItem
							    mode='amount'
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									dispatch(searchRunningActions.changeCxlsData(['data', 'amount'], value))
									dispatch(searchRunningActions.changeCxlsData(['data', 'payment', 'actualAmount'], value))
								}}
							/>
							<Single
								className='lrls-single'
								district={accountListJson}
								value={`${accountUuid}${Limit.TREE_JOIN_STR}${accountName}`}
								onOk={value => {
									const arr = value.value.split(Limit.TREE_JOIN_STR)
									const poundage = {
										needPoundage: value.needPoundage,
										poundage: value.poundage,
										poundageRate: value.poundageRate
									}
									dispatch(searchRunningActions.changeCxlsData(['data', 'accounts', 0, 'accountUuid'], arr[0]))
									dispatch(searchRunningActions.changeCxlsData(['data', 'accounts', 0, 'accountName'], arr[1]))
									dispatch(searchRunningActions.changeCxlsData(['data', 'accounts', 0, 'poundage'], fromJS(poundage)))
								}}
							>
								<Row style={{color: accountName ? '' : '#999'}} className='lrls-account lrls-type'>
									<span className='overElli'>{ accountName ? accountName : '点击选择账户' }</span>
									<Icon type="triangle" />
								</Row>
							</Single>
						</Row>
					</div>
					{
						notHandleAmount < 0 && accountPoundage.get('uuid') ? <Poundage
							dispatch={dispatch}
							data={data}
							accounts={accounts}
							accountPoundage={accountPoundage}
							poundageCurrentList={poundageCurrentList}
							poundageProjectList={poundageProjectList}
						/> : null
					}
					<EnclosurePublic history={history}/>
				</ScrollView>

				<ButtonGroup style={{backgroundColor: '#F8F8F8'}}>
					<Button onClick={() => {
						history.goBack()
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(searchRunningActions.saveXczc(history))
					}}>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
