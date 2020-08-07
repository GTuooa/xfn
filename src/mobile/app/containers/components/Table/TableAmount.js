import React, { Component, PropTypes } from 'react'
import { formatMoney } from 'app/utils'

export default
class TableAmount extends Component {
	render() {
		const {
			className,
			style,
			decimalPlaces,
			direction,
			isTitle
		} = this.props
		const amount = this.props.children == null ? '' : Number(this.props.children)
		const decimalPlacesNum = decimalPlaces || decimalPlaces === 0 ? Number(decimalPlaces) : 2
		let showAmount = amount === '' ? '' : (Number(formatMoney(amount, decimalPlacesNum, '')) === 0 ? formatMoney(0, decimalPlacesNum, '') : formatMoney(amount, decimalPlacesNum, ''))

		const isTenMillion = Math.abs(amount) >= 10000000 ? true : false

		return (
			<span className={className}
				style={{color: direction === 'debit' ? '#4166b8' : '#ff8348',fontSize: isTenMillion ? isTitle ? '.11rem' : '.1rem' : ''}}
			>
				{showAmount}
			</span>
		)
	}
}
