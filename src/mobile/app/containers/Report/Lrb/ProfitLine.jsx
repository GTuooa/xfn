import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { Icon, Amount }	from 'app/components'

const levels = {
	// firstlrb: [1, 21],
	// firstlrblast: [30, 32],
	// second: [2, 20, 22, 24, 31],
	// thirdlrb: [3, 11, 14, 18],
	// fourthlrb: [4, 12, 15, 19, 23, 25],
	// fifthlrb: [5, 6, 7, 8, 9, 10, 13, 16, 17, 26, 27, 28, 29]
	firstlrb: [1, 23],
	firstlrblast: [32, 34],
	second: [2, 21, 24, 26, 33],
	thirdlrb: [3, 11, 14, 18],
	fourthlrb: [4, 12, 15, 19, 25, 27],
	fifthlrb: [5, 6, 7, 8, 9, 10, 13, 16, 17, 28, 29, 30, 31]
}

@immutableRenderDecorator
export default
class ProfitLine extends React.Component {
	render() {
		const { lr, className, dispatch, showedProfitLineBlockIdxList, ...other } = this.props

		let level
		// for (const v of Object.keys(levels)) {
		// 	if (levels[v].indexOf(lr.get('lineindex')) > -1) {
		// 		level = v
		// 		break
		// 	}
		// }
		const lineindex = lr.get('lineindex')
		// if (lineindex == 1 || lineindex == 21) {
		if (lineindex == 1 || lineindex == 23) {
			level = 'firstlrb'
		// } else if (lineindex == 30 || lineindex == 32) {
		} else if (lineindex == 32 || lineindex == 34) {
			level = 'firstlrblast'
		// } else if (lineindex == 2 || lineindex == 20 || lineindex == 22 || lineindex == 24 || lineindex == 31) {
		} else if (lineindex == 2 || lineindex == 21 || lineindex == 24 || lineindex == 26 || lineindex == 33) {
			level = 'second'
		// } else if (lineindex == 3 || lineindex == 11 || lineindex == 14 || lineindex == 18) {
		} else if (lineindex == 3 || lineindex == 11 || lineindex == 14 || lineindex == 18 || lineindex == 20 || lineindex == 22) {
			level = 'thirdlrb'
		// } else if (lineindex == 4 || lineindex == 12 || lineindex == 15 || lineindex == 19 || lineindex == 23 || lineindex == 25) {
		} else if (lineindex == 4 || lineindex == 12 || lineindex == 15 || lineindex == 19 || lineindex == 25 || lineindex == 27) {
			level = 'fourthlrb'
		} else {
			level = 'fifthlrb'
		}


		const show = showedProfitLineBlockIdxList.find(v => v == lr.get('lineindex'))

		return (
			<dd
				{...other}
				className={['sheet-line', level, className].join(' ')}
				onClick={() => {level === 'firstlrb' && dispatch(lrbActions.toggleProfitLineDisplay(lr.get('lineindex')))}}
				>
				<span className="linename">
					<span className="linenametext">{lr.get('linename')}</span>
					{
						level=='firstlrb' ? <Icon style={show ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/> : ''
					}
				</span>
				<span className="lineindex">{lr.get('lineindex')}</span>
				<Amount className="amount">{lr.get('yearaccumulation')}</Amount>
				<Amount className="amount-right">{lr.get('monthaccumulation')}</Amount>
			</dd>
		)
	}
}
