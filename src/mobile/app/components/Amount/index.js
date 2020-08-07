import React, { Component, PropTypes } from 'react'
import { formatMoney } from 'app/utils'

export default
class Amount extends Component {
	render() {
		const {
			className,
			showZero,
			style,
			decimalPlaces,
			isTitle,
			decimalZero,
			isBillion
		} = this.props

		const amount = this.props.children ? Number(this.props.children) : 0
		const decimalPlacesNum = decimalPlaces || decimalPlaces === 0 ? Number(decimalPlaces) : 2
		const showAmount = formatMoney(amount, decimalPlacesNum, '', decimalZero)
		const finalShowAmount = Number(showAmount) === 0 ? formatMoney(0, decimalPlacesNum, '', decimalZero) : showAmount //-0处理为0
		const style2 = style === undefined ? {} : style
		const isTenMillion = Math.abs(amount) >= (isBillion ? 10000000000 : 10000000) ? true : false
		return (
			<span className={className}
				style={{
					color: this.props.children < 0 && !style2.hasOwnProperty('color') ? 'red' :style2['color'],
					fontSize: isTenMillion ? (isTitle ? '.11rem' : '.1rem') : ''
				}}
			>
				{showZero ? finalShowAmount : (Number(amount) == 0 ? '' : finalShowAmount) }
			</span>
		)
	}
}
