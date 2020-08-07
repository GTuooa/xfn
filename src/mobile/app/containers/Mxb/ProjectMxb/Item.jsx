import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import moment from 'moment'
import TableAmount from 'app/containers/components/Table/TableAmount'

import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			item,
			style,
			dispatch,
			className,
			history,
			detailsTemp,
			chooseDirection
		} = this.props

		const directionPR = item.get('incomeAmount') ? 'debit' : 'credit'
		const directionRealPR = item.get('realIncomeAmount') ? 'debit' : 'credit'
		const directionBalance = chooseDirection === 'debit' || chooseDirection === 'double_debit' ? 'debit' : 'credit'
		const balance = chooseDirection == 'double_debit' || chooseDirection == 'debit' ?
		item.get('direction') == 'debit' ? item.get('balance') : -item.get('balance') :
		item.get('direction') == 'credit' ? item.get('balance') : -item.get('balance')

		return (
			<div className={'ba' + ' ' + className} style={style}>
				<div>
					<span
						className='name'
						onClick={(e) => {
							dispatch(runningPreviewActions.getRunningPreviewBusinessFetch(item.get('oriUuid'), item, detailsTemp, 'mxb', history))
						}}
						>
						<span className='name-name'>{`${item.get('jrDate')}_${item.get('jrAbstract')}`}</span>
					</span>
				</div>
				<div className='ba-info'>
					<span className="ba-type-name">{ `${item.get('jrIndex')}号`}</span>
					<TableAmount direction={directionPR}>{item.get('incomeAmount') ? item.get('incomeAmount') : item.get('expenseAmount') ? item.get('expenseAmount') : null}</TableAmount>
					<TableAmount direction={directionRealPR}>{item.get('realIncomeAmount')? item.get('realIncomeAmount') : item.get('realExpenseAmount') ? item.get('realExpenseAmount') : null}</TableAmount>
					<TableAmount direction={directionBalance}>{balance}</TableAmount>
				</div>
			</div>
		)
	}
}
