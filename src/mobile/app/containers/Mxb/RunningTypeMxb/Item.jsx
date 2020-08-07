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

		const directionName = {
            'debit' : '借',
            'credit' : '贷',
            '' : ''
        }

		return (
			<div className={'ba' + ' ' + className} style={style}
			onClick={(e) => {
				dispatch(runningPreviewActions.getRunningPreviewBusinessFetch(item.get('oriUuid'), item, detailsTemp, 'mxb', history))
			}}>
				<div>
					<span
						className='name'
						>
						<span className='name-name'>{item.get('jrJvCardAbstract') ? `${item.get('oriDate')}_${item.get('oriAbstract')}${item.get('jrJvCardAbstract')}` : `${item.get('oriDate')}_${item.get('oriAbstract')}`}</span>
					</span>
				</div>
				<div className='ba-info'>
					<span className="ba-type-name">{ `${item.get('jrIndex')}号`}</span>
					<span>{item.get('direction') === 'debit' ? item.get('debitAmount') === 0 && item.get('creditAmount') !== 0 ? '贷' : '借' : item.get('creditAmount') === 0 && item.get('debitAmount') !== 0 ? '借' : '贷'}</span>
					<Amount showZero={true}>{item.get('direction') === 'debit' ? item.get('debitAmount') === 0 ? item.get('creditAmount') : item.get('debitAmount') : item.get('creditAmount') === 0 ? item.get('debitAmount') : item.get('creditAmount')}</Amount>
					<Amount showZero={true}>{item.get('balanceAmount')}</Amount>
				</div>
			</div>
		)
	}
}
