import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { zbAccountActions } from 'app/redux/Edit/Lrls/Qtls/zbAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { hxCom } from 'app/containers/Edit/Lrls/components'

import { Row, Icon, ScrollView, Amount } from 'app/components'
import Ylfj from '../../Ylfj'


@connect(state => state)
export default
class Zb extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: true
		}
    }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showList } = this.state

		const data = yllsState.get('data')
		const flowNumber = data.get('flowNumber')
		const categoryName = data.get('categoryName')
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)
		const accountName = data.get('accountName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')

		const propertyCost = data.get('propertyCost')
		const propertyCostName = {XZ_ZZ: '增资', XZ_LRFP: '利润分配', XZ_JZ: '减资'}[propertyCost]
		const runningState = data.get('runningState')
		const runningStateName = {'STATE_ZB_ZZ': '增资', 'STATE_ZB_LRFP': '利润分配', 'STATE_ZB_ZFLR': '支付利润', 'STATE_ZB_JZ': '减资'}[runningState]

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList && paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick, '利润分配')
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
					{ runningState != 'STATE_ZB_LRFP' ? <div className='ylls-padding'>账户：{accountName} </div> : null }
				</Row>

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
