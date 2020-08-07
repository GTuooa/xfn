import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import * as zcfzbActions from 'app/redux/Report/Zcfzb/zcfzb.action.js'
import { Icon, Amount }	from 'app/components'

const levels = {
	// first: [15, 29, 30],
	third: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 48, 49, 50, 51],
	fifth: [11, 12, 13],
	strong: [15, 29, 30, 41, 46, 47, 52, 53]
}

@immutableRenderDecorator
export default
class BalanceLine extends React.Component {

	render() {
		const {
			zc,
			className,
			dispatch,
			showedBalanceLineBlockIdxList,
			...other
		} = this.props

		let level = zc.get('title')
		if (level) {
			level = 'zcfzb-tilte'
		} else {
			const lineindex = zc.get('lineindex')
			if (levels.fifth.indexOf(lineindex) > -1) {
				level = 'fifth'
			}
			else if (levels.third.indexOf(lineindex) > -1) {
				level = 'third'
			}
			// for (const v of Object.keys(levels)) {
			// 	if (levels[v].indexOf(zc.get('lineindex')) > -1) {
			// 		level = v
			// 		break
			// 	}
			// }
		}
		const show = showedBalanceLineBlockIdxList.find(v => v == zc.get('blockIdx'))

		return (
			<dd
				{...other}
				className={['sheet-line', level, className].join(' ')}
				onClick={() => {level === 'zcfzb-tilte' && dispatch(zcfzbActions.toggleBalanceLineDisplay(zc.get('blockIdx')))}}
				>
				<span className="linename">{zc.get('linename')}</span>
				<span className="lineindex">{zc.get('lineindex')}</span>
				<Amount className="amount">{zc.get('closingbalance')}</Amount>
				{
					level=='zcfzb-tilte' ? <Icon style={show ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/> : <Amount className="amount-right">{zc.get('yearopeningbalance')}</Amount>
				}
			</dd>
		)
	}
}
