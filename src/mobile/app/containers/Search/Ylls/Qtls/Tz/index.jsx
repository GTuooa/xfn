import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { tzAccountActions } from 'app/redux/Edit/Lrls/Qtls/tzAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

import { Row, Icon, ScrollView, Amount } from 'app/components'
import { ylProject, hxCom } from 'app/containers/Edit/Lrls/components'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Tz extends React.Component {
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
		const accountName = data.get('accountName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		const propertyCost = data.get('propertyCost')
		const propertyCostName = {XZ_DWTZ: '对外投资', XZ_QDSY: '取得收益', XZ_SHTZ: '收回投资'}[propertyCost]
		const runningState = data.get('runningState')
		const runningStateName = {'STATE_TZ_YF': '已付','STATE_TZ_JTGL': '计提股利', 'STATE_TZ_SRGL': '收入股利','STATE_TZ_JTLX': '计提利息', 'STATE_TZ_SRLX': '收入利息','STATE_TZ_YS': '已收'}[runningState]

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			const showName = data.get('propertyInvest') == 'SX_ZQ' ? '计提利息' : '计提股利'
			HxCom = hxCom(paymentList, showList, onClick, showName)
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
					{ runningState != 'STATE_TZ_JTGL' &&  runningState != 'STATE_TZ_JTLX' ? <div className='ylls-padding'>账户：{accountName} </div> : null }
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
