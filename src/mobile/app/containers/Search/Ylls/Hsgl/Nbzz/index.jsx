import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'
import { Row, ScrollView, Amount } from 'app/components'
import { nbzzAccountActions } from 'app/redux/Edit/Lrls/Hsgl/nbzzAccount'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Nbzz extends React.Component {

	render () {
		const { dispatch, yllsState, history } = this.props

		const data = yllsState.get('data')
		const flowNumber = data.get('flowNumber')
		const fromAccountName = data.getIn(['childList', 0, 'accountName'])//转出账户
		const toAccountName = data.getIn(['childList', 1, 'accountName'])//转入账户
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')

		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='ylls-item'>
						<div className='overElli ylls-bold'>{categoryName}</div>
					</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						{/* <div>{runningDate}</div> */}
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					<div className='ylls-padding'>金额：<Amount className='ylls-bold'>{amount}</Amount></div>
					<div className='ylls-padding'>转出账户：{fromAccountName} </div>
					<div className='ylls-padding'>转入账户：{toAccountName} </div>
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
