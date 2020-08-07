import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import moment from 'moment'

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
			detailsTemp
		} = this.props

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
					<Amount showZero={false}>{item.get('direction') === 'debit' ? item.get('incomeAmount') : item.get('expenseAmount')}</Amount>
					<Amount showZero={false}>{item.get('direction') === 'debit' ? item.get('realIncomeAmount') === 0 ? -item.get('realExpenseAmount') :item.get('realIncomeAmount') : item.get('realExpenseAmount') === 0 ? -item.get('realIncomeAmount') : item.get('realExpenseAmount')}</Amount>
					<Amount showZero={true}>{item.get('direction') === 'debit' ? item.get('closeARBalance') : item.get('closeAPBalance')}</Amount>
				</div>
			</div>
		)
	}
}
