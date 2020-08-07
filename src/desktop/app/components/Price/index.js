import React, { Component } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { formatPrice } from 'app/utils'

@immutableRenderDecorator
export default
class Price extends Component {

	render() {
		const {
			className,
			showZero
		} = this.props

		const amount = this.props.children ? Number(this.props.children) : 0
		const Amount = amount.toFixed(4).toString()

		let showAmount
		if (Amount.indexOf('-') === 0) {
			const _amount= Amount.replace('-', '')
			showAmount = '-' + formatPrice(_amount)
		} else {
			showAmount = formatPrice(Amount)
		}

		return (
			<span className={className} style={{color: this.props.children < 0 ? 'red' : undefined}}>{showZero ? showAmount : (amount == 0 ? '' : showAmount)}</span>
		)
	}
}
