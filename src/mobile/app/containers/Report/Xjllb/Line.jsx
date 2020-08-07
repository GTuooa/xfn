import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as xjllbActions from 'app/redux/Report/Xjllb/xjllb.action.js'
import { Icon, Amount }	from 'app/components'
import { browserNavigator } from 'app/utils'

const levels = {
	firstlrb: [0],
	firstlrblast: [20, 22],
	second: [21],
	thirdlrb: [7, 13, 19],
	fourthlrb: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18],
}

@immutableRenderDecorator
export default
class ProfitLine extends React.Component {
	render() {
		const { lr, dispatch, showedLineBlockIdxList, ...other } = this.props;
		let lineIndex = lr.get('lineIndex')

		let level;
		if (lineIndex == 23 || lineIndex == 24 || lineIndex == 25) {
			level = 'firstlrb'
		} else if (lineIndex == 20 || lineIndex == 22) {
			level = 'firstlrblast'
		} else if (lineIndex == 7 || lineIndex == 13 || lineIndex == 19 ) {
			level = 'second'
		} else if (lineIndex == 21) {
			level = 'thirdlrb'
		} else {
			level = 'fourthlrb'
		}
		const show = showedLineBlockIdxList.find(v => v == lr.get('lineIndex'));
		const nameLength = lr.get('lineName').trim().length;

		//lineName长度大于16，截取字符串，达到两行显示的效果
		// const lineName = lineIndex < 23 ? ((lineIndex == 1 || lineIndex == 3) ? (nameLength > 15 ? (lr.get('lineName').trim().substr(0,15) + '...') :lr.get('lineName').trim() ) :  nameLength > 14 ? (lr.get('lineName').trim().substr(0,14) + '...') : lr.get('lineName').trim()) : lr.get('lineName')
		let lineName = ''
		if (browserNavigator.versions.android) {
			lineName = lineIndex < 23 ? ((lineIndex == 1 || lineIndex == 3) ? (nameLength > 15 ? (lr.get('lineName').trim().substr(0,15) + '...') :lr.get('lineName').trim() ) :  nameLength > 14 ? (lr.get('lineName').trim().substr(0,14) + '...') : lr.get('lineName').trim()) : lr.get('lineName')
		} else {
			lineName = lineIndex < 23 ? ((lineIndex == 1 || lineIndex == 3) ? (nameLength > 18 ? (lr.get('lineName').trim().substr(0,16) + '...') :lr.get('lineName').trim() ) :  nameLength > 18 ? (lr.get('lineName').trim().substr(0,16) + '...') : lr.get('lineName').trim()) : lr.get('lineName')

		}
		return (
			<dd
				{...other}
				className='xjllb-line'
				className={['xjllb-line', level].join(' ')}
				onClick={() => {level === 'firstlrb' && dispatch(xjllbActions.toggleCachFlowLineDisplay(lineIndex))}}
				>
				<span className="linename">
					<span
						className="linenametext"
						style={{lineHeight: level === 'firstlrb' ? '' : (nameLength>8 ? '.14rem' : ''), marginTop: level === 'firstlrb' ? '' :  (nameLength > 8 ? '.08rem' : '')}}
						>
						{level === 'firstlrb' || level === 'firstlrblast' ? lineName.replace('、', '.') : lineName}
					</span>
					{level=='firstlrb' ? <Icon style={show ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/> : ''}
				</span>
				{level === 'firstlrb' ? '' : <span className="lineindex">{lr.get('lineIndex')}</span>}
				{level === 'firstlrb' ? '' : (lineIndex ==7 || lineIndex ==13 || lineIndex ==19 || lineIndex ==20 || lineIndex ==21 || lineIndex ==22) ? <Amount showZero="true" className="amount">{lr.get('sumAmount')}</Amount> : <Amount className="amount">{lr.get('sumAmount')}</Amount>}
				{level === 'firstlrb' ? '' : (lineIndex ==7 || lineIndex ==13 || lineIndex ==19 || lineIndex ==20 || lineIndex ==21 || lineIndex ==22) ? <Amount showZero="true" className="amount-right">{lr.get('amount')}</Amount> : <Amount className="amount-right">{lr.get('amount')}</Amount>}

			</dd>
		)
	}
}
