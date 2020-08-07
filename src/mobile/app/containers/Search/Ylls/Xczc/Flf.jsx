import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { propertyCostObj, ylProject } from 'app/containers/Edit/Lrls/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { xczcAccountActions } from 'app/redux/Edit/Lrls/xczcAccount'
import Ylfj from '../Ylfj'

@connect(state => state)
export default
class Flf extends React.Component {
	state = {
		showProject: true
	}

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showProject } = this.state

		const data = yllsState.get('data')
		const flowNumber = yllsState.getIn(['data', 'flowNumber'])

		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const amount = data.get('amount')
		const propertyPay = data.get('propertyPay')//薪酬属性
		const acPayment = data.get('acPayment')
		const beWelfare = acPayment.get("beWelfare")// 是否过渡福利费
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		//费用性质
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acPayment, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
			const projectCard = data.get('projectCard')
			let onClick = () => this.setState({'showProject': !showProject})
			ProjectCom = ylProject(projectCard, showProject, onClick)
		}

		return(
			<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{propertyCostName}</div>
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					{/* 金额组件 */}
					<div className='ylls-padding'>金额：<Amount className='ylls-bold'>{amount}</Amount></div>
					<div className='ylls-padding'>账户：{accountName} </div>
				</Row>

				{ ProjectCom }
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
