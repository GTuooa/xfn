import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'

// import { Input } from 'antd'
import XfnInput from 'app/components/XfnInput'
import { formatMoney } from 'app/utils'
import { TableItem, Amount } from 'app/components'

const levels = {
	// first: [1, 21, 30, 32],
	// second: [2, 20, 22, 24, 31],
	// third: [3, 11, 14, 18],
	// fourth: [4, 12, 15, 19, 23, 25],
	// fifth: [5, 6, 7, 8, 9, 10, 13, 16, 17, 26, 27, 28, 29]
	first: [1, 23, 32, 34],
	second: [2, 21, 24, 26, 33],
	third: [3, 11, 14, 18],
	fourth: [4, 12, 15, 19, 20, 22, 25, 27],
	fifth: [5, 6, 7, 8, 9, 10, 13, 16, 17, 28, 29, 30, 31]
}

@immutableRenderDecorator
export default
class InitLrItem extends React.Component {

	// constructor() {
	// 	super()
	// 	this.state = {lrbClickBool: false}
	// }

	render() {
		const { lrItem, className, dispatch, disabledModify, idx, isAdmin } = this.props
		// const { lrbClickBool } = this.state

		const amount = lrItem.get('amount')
		const lineName = lrItem.get('lineName')
		const lineIndex = lrItem.get('lineIndex')

		let level = ''

		for (const v of Object.keys(levels)) {
			if (levels[v].indexOf(lineIndex) > -1) {
				level = v
				break
			}
		}

		return (
			<TableItem className={className} line={idx+1}>
				<li><span className={level ? `lrb-text-index-${level}` : ''}>{lineName ? lineName.replace(/\./g, '、').replace(/:/g, '：') : ''}</span></li>
				<li>{lineIndex}</li>
				<li>{disabledModify ?
					<Amount className="initlrb-amount-line">{amount}</Amount> :
					<XfnInput
						autoSelect={true}
						showFormatMoney={true}
						disabled={!isAdmin}
						value={amount}
						// onBlur={e => this.setState({lrbClickBool: false})}
						onFocus={e => {
							// this.setState({lrbClickBool: true})
							e.target.value = amount ? amount : ''
						}}
						onChange={(e) =>
							dispatch(lrbActions.changeInitLrbAmount(lineIndex, e.target.value))
						}
					/>}
				</li>
			</TableItem>
		)
	}
}
