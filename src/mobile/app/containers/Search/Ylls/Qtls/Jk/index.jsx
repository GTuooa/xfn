import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { jkAccountActions } from 'app/redux/Edit/Lrls/Qtls/jkAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

import { Row, Icon, ScrollView, Amount } from 'app/components'
import { ylProject, hxCom } from 'app/containers/Edit/Lrls/components'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Jk extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false,
			showProject: true
		}
    }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showList, showProject } = this.state

		const data = yllsState.get('data')
		const flowNumber = data.get('flowNumber')
		const categoryName = data.get('categoryName')
		const runningState = data.get('runningState')
		const runningStateName = {'STATE_JK_YS': '已收','STATE_JK_JTLX': '计提利息', 'STATE_JK_ZFLX': '支付利息', 'STATE_JK_YF': '已付'}[runningState]
		const accountName = data.get('accountName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		const propertyCost = data.get('propertyCost')
		const propertyCostName = {XZ_QDJK: '取得借款', XZ_CHLX: '偿还利息', XZ_CHBJ: '偿还本金'}[propertyCost]

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick, '计提利息')
		}

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
			const projectCard = data.get('projectCard')
			let onClick = () => this.setState({'showProject': !showProject})
			ProjectCom = ylProject(projectCard, showProject, onClick)
		}


		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningStateName}</div>
					</div>
					<div className='ylls-padding'>处理类型： {propertyCostName} </div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					<div className='ylls-padding'>金额：<Amount className='ylls-bold'>{amount}</Amount></div>
					{ runningState != 'STATE_JK_JTLX' ? <div className='ylls-padding'>账户：{accountName} </div> : null }
				</Row>
				{ ProjectCom }
				{ HxCom }
				{
					data.get('enclosureList') && data.get('enclosureList').size ?
					<Ylfj
						enclosureList={data.get('enclosureList')}
						label={data.get('label')}
						dispatch={dispatch}
						history={history}
					/> : ''
				}
			</ScrollView>
		)
	}
}
