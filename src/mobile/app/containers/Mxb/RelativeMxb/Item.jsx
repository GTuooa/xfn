import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import moment from 'moment'
import TableAmount from 'app/containers/components/table/TableAmount'

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

		const direction = chooseDirection === 'debit' || chooseDirection === 'double_debit'  ? 'debit' : 'credit'

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
					<TableAmount direction={item.get('debitAmount') ? 'debit' : 'credit'}>{item.get('debitAmount') ? item.get('debitAmount') : item.get('creditAmount') ? item.get('creditAmount') : null}</TableAmount>
					<TableAmount direction={item.get('realDebitAmount') ? 'debit' : 'credit'}>{item.get('realDebitAmount') ? item.get('realDebitAmount') : item.get('realCreditAmount') ? item.get('realCreditAmount') : null}</TableAmount>
					<TableAmount direction={direction}>{balance}</TableAmount>
				</div>
			</div>
		)
	}
}
