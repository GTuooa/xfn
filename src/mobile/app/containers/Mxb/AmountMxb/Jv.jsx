import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as amountMxbActions from 'app/redux/Mxb/AmountMxb/amountMxb.action.js'
import { Amount } from 'app/components'

@immutableRenderDecorator
export default
class Jv extends React.Component {

	render() {
		const {
			idx,
			jv,
			acuint,
			issuedate,
			dispatch,
			history,
			unitDecimalCount,
			jvlist
		} = this.props

		const vcdate = jv.get('vcdate').replace(/-/g, '.')

		return (
			<div
				className="amountmxb-jv"
				onClick={() => dispatch(amountMxbActions.getVcFetch(jv.get('vcdate').slice(0,7), jv.get('vcindex'), history,jvlist))}
				>
				<div className="amountmxb-jv-title">
					<span className="amountmxb-jv-abstract">{`${vcdate}-${jv.get('jvabstract')}`}</span>
				</div>
				<div className="amountmxb-jv-content">
					<span className="mxb-vcindex">记 {jv.get('vcindex')} 号</span>
					{/* <Amount className="mxb-amount" showZero={true}>{jv.get('jvcount') * jv.get('price')}</Amount> */}
					<Amount className="mxb-amount" showZero={true}>{jv.get('jvamount')}</Amount>
					<Amount className="mxb-amount-right" showZero={true}>{jv.get('balance')}</Amount>
				</div>
				<div className="amountmxb-jv-content">
					<span className="mxb-jvdirection">{jv.get('jvdirection') == 'credit' ? '贷' : '借'}</span>
					<span className="mxb-amount mxb-amount-color">
						{/* ' * '不可删除 */}
						{/* <Amount showZero={true}>{jv.get('jvcount')}</Amount>{jv.get('jvunit')}
						&nbsp;*<Amount showZero={true}>{jv.get('price')}</Amount> */}
						<Amount showZero={true} decimalPlaces={unitDecimalCount}>{jv.get('jvcount')}</Amount>{acuint}
						&nbsp;*<Amount showZero={true}>{jv.get('price')}</Amount>
					</span>
					<span className="mxb-amount mxb-amount-color">
						{/* ' * '不可删除 */}
						{/* <Amount showZero={true}>{jv.get('balancecount')}</Amount>{jv.get('jvunit')}
						&nbsp;*<Amount showZero={true}>{jv.get('balanceprice')}</Amount> */}
						<Amount showZero={true} decimalPlaces={unitDecimalCount}>{jv.get('balancecount')}</Amount>{acuint}
						&nbsp;*<Amount showZero={true}>{jv.get('balanceprice')}</Amount>
					</span>

				</div>
			</div>

		)
	}
}
