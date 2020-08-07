import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Row, Icon, ScrollView, Amount } from 'app/components'
import { ylProject, propertyCostObj } from 'app/containers/Edit/Lrls/components'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Zjtx extends React.Component {

	render () {
		const { dispatch, yllsState, history } = this.props

		const data = yllsState.get('data')
		const flowNumber = data.get('flowNumber')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const categoryName = data.get('categoryName')

		//费用性质
		const acAssets = data.get('acAssets')
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acAssets, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
			const projectCard = data.get('projectCard')
			let showName = `${projectCard.getIn([0, 'code'])} ${projectCard.getIn([0, 'name'])}`
			if (projectCard.getIn([0, 'name']) == '项目公共费用') {
				showName = '项目公共费用'
			}
			ProjectCom = <div className='ylls-padding'>项目： {showName} </div>
		}

		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='ylls-item'>
						<div className='overElli ylls-bold'>长期资产折旧摊销</div>
						<div></div>
					</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						{/* <div>{runningDate}</div> */}
					</div>
					<div className='ylls-padding'>处理类别： {categoryName} </div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					{ ProjectCom }
					<div className='ylls-padding'>
						金额：<Amount showZero>{amount}</Amount>
					</div>
				</Row>
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
