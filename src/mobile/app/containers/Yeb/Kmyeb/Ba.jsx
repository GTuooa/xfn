import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
import * as kmyebActions from 'app/redux/Yeb/Kmyeb/kmyeb.action.js'

@immutableRenderDecorator
export default
class Ba extends React.Component {

	render() {
		const {
			ba,
			idx,
			style,
			hasSub,
			dispatch,
			className,
			issuedate,
			isExpanded,
			endissuedate,
			history,
			chooseValue
		} = this.props

		const articlePaddingLeft = (ba.get('acId').length - 4) / 200 * 10 + 'rem'

		const flagColor = {
			4: '#fff',
			6: '#D1C0A5',
			8: '#7E6B5A',
			10: '#59493f'
		}[ba.get('acId').length]

		const flagstyle = {
			background: flagColor,
			minWidth: articlePaddingLeft
		}

		return (
			<div
				className={'ba' + ' ' + className}
				style={style}
				>
				<div>
					<span
						className='name'
						onClick={(e) => {
							// 不要阻止冒泡，会导致记住滚动有问题
							// e.stopPropagation()
							sessionStorage.setItem('previousPage', 'kmyeb')
							dispatch(kmmxbActions.getMxbAclistFetch(issuedate, endissuedate, ba.get('acId')))
							dispatch(kmmxbActions.changeAcMxbChooseValue(chooseValue))
							history.push('/kmmxb')
						}}
						>
						{articlePaddingLeft == '0rem' ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className='name-name'>{ba.get('acId') + '_' + ba.get('acFullName')}</span>
					</span>
					<span className='btn' onClick={() => hasSub && dispatch(kmyebActions.toggleLowerBa(ba.get('acId')))}>
						<Icon
							type='arrow-down'
							style={{visibility: hasSub ? 'visible' : 'hidden', transform: isExpanded ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='ba-info' onClick={() => hasSub && dispatch(kmyebActions.toggleLowerBa(ba.get('acId')))}>
					<Amount showZero={true}>{ba.get('beginCreditAmount') || ba.get('beginDebitAmount')}</Amount>
					<Amount showZero={true}>{ba.get('happenDebitAmount')}</Amount>
					<Amount showZero={true}>{ba.get('happenCreditAmount')}</Amount>
					<Amount showZero={true}>{ba.get('endCreditAmount') || ba.get('endDebitAmount')}</Amount>
				</div>
			</div>
		)
	}
}
