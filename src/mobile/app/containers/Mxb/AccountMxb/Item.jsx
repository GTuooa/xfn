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
						<span className='name-name'>{`${item.get('oriDate')}_${item.get('oriAbstract')}`}</span>
					</span>
				</div>
				<div className='ba-info'>
					<span className="ba-type-name">{ `${item.get('jrIndex')}号`}</span>
					<span>{item.get('creditAmount') === 0 ? '收款' : '付款' }</span>
					<Amount showZero={true}>{item.get('debitAmount') === 0 ? item.get('creditAmount') : item.get('debitAmount')}</Amount>
					<Amount showZero={true}>{item.get('balance')}</Amount>
				</div>
			</div>
		)
	}
}
