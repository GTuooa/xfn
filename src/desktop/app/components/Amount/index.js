import React, { Component } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
class Amount extends Component {

	render() {
		const {
			className,
			showZero,
			realityAmount,
			decimalPlaces
		} = this.props

		const amount = this.props.children ? Number(this.props.children) : 0
		const decimalPlacesNum = decimalPlaces || decimalPlaces === 0 ? Number(decimalPlaces) : 2
		// const Amount = amount.toFixed(2).toString()

		let showAmount = formatMoney(amount, decimalPlacesNum, '')
		// if (Amount.indexOf('-') === 0) {
		// 	const _amount= Amount.replace('-', '')
		// 	showAmount = '-' + formatNum(_amount)
		// } else {
		// 	showAmount = formatNum(Amount)
		// }

		return (
			<span className={className ? `${className} over-ellipsis` : "over-ellipsis"} style={{color: realityAmount ? realityAmount < 0 ? 'red' : undefined : (this.props.children < 0 ? 'red' : undefined)}}>{showZero ? showAmount : (amount == 0 || Number(showAmount) == 0? '' : showAmount)}</span>
		)
	}
}

export default Amount