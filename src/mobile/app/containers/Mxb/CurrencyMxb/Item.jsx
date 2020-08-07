import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as currencyMxbActions from 'app/redux/Mxb/CurrencyMxb/currencyMxb.action.js'
import { Amount } from 'app/components'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			key,
			idx,
			item,
			dispatch,
			issuedate,
			history,
			jvList
		} = this.props

		const vcdate = item.get('vcdate').replace(/-/g, '.')

		return (
			<div
				className="amountmxb-jv"
				onClick={() => dispatch(currencyMxbActions.getVcFetch(item.get('vcdate').slice(0,7), item.get('vcindex'), history, jvList))}
				>
				<div className="amountmxb-jv-title">
					<span className="amountmxb-jv-abstract">{`${vcdate}-${item.get('jvabstract')}`}</span>
				</div>
				<div className="amountmxb-jv-content">
					<span className="mxb-vcindex">记 {item.get('vcindex')} 号</span>
					<Amount className="mxb-amount" showZero={true}>{item.get('jvamount')}</Amount>
					<Amount className="mxb-amount-right" showZero={true}>{item.get('balance')}</Amount>
				</div>
				<div className="amountmxb-jv-content">
					<span className="mxb-jvdirection">{item.get('jvdirection') == 'debit' ? '借' : '贷'}</span>
					<span className="mxb-amount mxb-amount-color">
						<Amount showZero={true}>{item.get('standardAmount')}</Amount>
						&nbsp;*<Amount showZero={true}>{item.get('exchange')}</Amount>
					</span>
					<span className="mxb-amount mxb-amount-color">
						<Amount showZero={true}>{item.get('fcBalance')}</Amount>
					</span>

				</div>
			</div>

		)
	}
}
