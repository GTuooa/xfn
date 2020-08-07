import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import moment from 'moment'

import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'

@immutableRenderDecorator
export default
class TypeItem extends React.Component {

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

		const directionName = {
            'debit' : '借',
            'credit' : '贷',
            '' : ''
        }
		const direction = chooseDirection === 'debit' || chooseDirection === 'double_debit' ? 'debit' : 'credit'

		const balance = chooseDirection == 'double_debit' || chooseDirection == 'debit' ?
		item.get('direction') == 'debit' ? item.get('balance') : -item.get('balance') :
		item.get('direction') == 'credit' ? item.get('balance') : -item.get('balance')

		return (
			<div className={'ba' + ' ' + className} style={style}
			onClick={(e) => {
				dispatch(runningPreviewActions.getRunningPreviewBusinessFetch(item.get('oriUuid'), item, detailsTemp, 'mxb', history))
			}}>
				<div>
					<span
						className='name'
						>
						<span className='name-name'>{`${item.get('jrDate')}_${item.get('jrAbstract')}`}</span>
					</span>
				</div>
				<div className='ba-info ba-info-type'>
					<span className="ba-type-name">{ `${item.get('jrIndex')}号`}</span>
					<span>{item.get('debitAmount') ? '借' : '贷' }</span>
					<Amount showZero={true}>{item.get('debitAmount') ? item.get('debitAmount') : item.get('creditAmount') }</Amount>
					<Amount showZero={true}>{balance}</Amount>
				</div>
			</div>
		)
	}
}
