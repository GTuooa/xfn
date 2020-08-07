import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, ScrollView, Amount } from 'app/components'
import Ylfj from '../Ylfj'


@connect(state => state)
export default
class Grsr extends React.Component {
	constructor(props) {
		super(props)
    }

	render () {
		const { yllsState, dispatch, history } = this.props

		const data = yllsState.get('data')
		const flowNumber = data.get('flowNumber')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const amount = data.get('amount')
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		return(
			<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>缴纳</div>
					</div>
					<div className='ylls-padding'>摘要：{runningAbstract}</div>
					<div className='ylls-padding'>金额：<Amount className='ylls-bold'>{amount}</Amount></div>
					<div className='ylls-padding'>账户：{accountName} </div>
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
