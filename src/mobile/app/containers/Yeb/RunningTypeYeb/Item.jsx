import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import moment from 'moment'

import * as runningTypeYebActions from 'app/redux/Yeb/RunningTypeYeb/runningTypeYeb.action.js'
import * as runningTypeMxbActions from 'app/redux/Mxb/RunningTypeMxb/runningTypeMxb.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			item,
			style,
			dispatch,
			className,
			leve,
			haveChild,
			showChild,
			history,
			issuedate,
			endissuedate,
			categoryTop,
			categoryUuid,
			ylDataList,
			chooseValue,
		} = this.props
		const articlePaddingLeft = (leve - 1) / 100 * 10 + 'rem'

		const flagColor = {
			1: '#fff',
			2: '#D1C0A5',
			3: '#7E6B5A',
			4: '#59493f'
		}[leve]

		const flagstyle = {
			background: flagColor,
			width: articlePaddingLeft
		}

		return (
			<div className={'ba' + ' ' + className} style={style}>
				<div>
					<span className={'childName'} >
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span
						className='name-name'
						onClick={(e) => {
							dispatch(runningTypeMxbActions.getRunningTypeMxbListFromRunningTypeYeb(issuedate, endissuedate,item,history,item.get('mergeName')))
							dispatch(runningTypeMxbActions.changeRunningTypeMxbChooseValue(chooseValue))
						}}
						>{item.get('acName')}</span>
					</span>
					<span className='btn'
						onClick={() => dispatch(runningTypeYebActions.runningTypeBalanceTriangleSwitch(showChild, item.get('acId')))}
					>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='ba-info'>
					<Amount showZero={true}>{item.get('direction') == 'debit' ? item.get('beginDebitAmount')  : item.get('beginCreditAmount')}</Amount>
					<Amount showZero={true}>{item.get('monthDebitAmount')}</Amount>
					<Amount showZero={true}>{item.get('monthCreditAmount')}</Amount>
					<Amount showZero={true}>{item.get('direction') == 'debit' ? item.get('endDebitAmount') : item.get('endCreditAmount')}</Amount>
				</div>
			</div>
		)
	}
}
