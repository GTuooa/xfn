import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { yywsrAccountActions } from 'app/redux/Edit/Lrls/Qtls/yywsrAccount'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { ylProject, hxCom } from 'app/containers/Edit/Lrls/components'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Yywsr extends React.Component {
	state = {
		showProject: true,
		showList: true
	}

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showProject, showList } = this.state
		const data = yllsState.get('data')

		const flowNumber = data.get('flowNumber')
		const categoryName = data.get('categoryName')
		const runningState = data.get('runningState')
		const runningStateName = {'STATE_YYWSR_YS': '已收款', 'STATE_YYWSR_WS': '未收款'}[runningState]
		const accountName = data.get('accountName')
		const showAccount = runningState === 'STATE_YYWSR_YS' ? true : false//是否显示账户
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		const acBusinessOutIncome = data.get('acBusinessOutIncome')
		const beManagemented = acBusinessOutIncome.get('beManagemented')//收付管理

		let contactsCardCom = null
		if (beManagemented) {
			const contactsCardRange = acBusinessOutIncome.get('contactsCardRange')//往来关系卡片
			contactsCardCom = <div className='ylls-padding'>往来单位： {`${contactsCardRange.get('code')} ${contactsCardRange.get('name')}`} </div>
		}

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
			const projectCard = data.get('projectCard')
			let onClick = () => this.setState({'showProject': !showProject})
			ProjectCom = ylProject(projectCard, showProject, onClick)
		}

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
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
					{/* 往来关系卡片 */}
					{ contactsCardCom }
					<div className='ylls-padding'>金额：<Amount className='ylls-bold'>{amount}</Amount></div>
					{ showAccount ? <div className='ylls-padding'>账户：{accountName} </div> : null }
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
