import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'
import { zfkxAccountActions } from 'app/redux/Edit/Lrls/Qtls/zfkxAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { ylProject, hxCom } from 'app/containers/Edit/Lrls/components'
import Ylfj from '../../Ylfj'


@connect(state => state)
export default
class Zfkx extends React.Component {
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
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)
		const runningState = data.get('runningState')
		const runningStateName = {'STATE_ZF_FC': '付出', 'STATE_ZF_SH': '收回'}[runningState]
		const accountName = data.get('accountName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
			const projectCard = data.get('projectCard')
			let onClick = () => this.setState({'showProject': !showProject})
			ProjectCom = ylProject(projectCard, showProject, onClick)
		}

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList && paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
		}

		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningStateName}</div>
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					<div className='ylls-padding'>金额：<Amount className='ylls-bold'>{amount}</Amount></div>
					<div className='ylls-padding'>账户：{accountName} </div>
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
