import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Amount } from 'app/components'

import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'

@immutableRenderDecorator
export default
class Jv extends React.Component {

	render() {
		const {
			jv,
			issuedate,
			dispatch,
			direction,
			history,
			jvlist
		} = this.props

		const vcDate = jv.get('vcDate').replace(/-/g, '.')

		return (
			<div
				className="mxb-jv"
				onClick={() => {
					sessionStorage.setItem('router-from', 'mxb')
					dispatch(kmmxbActions.getVcFetch(jv.get('vcDate').slice(0,7), jv.get('vcindex'), history, jvlist))
				}}>
				<div className="mxb-jv-title">
					<span className="mxb-jv-abstract">{`${vcDate}-${jv.get('jvAbstract')}`}</span>
				</div>
				<div className="mxb-jv-content">
					<span className="mxb-vcindex">记 {jv.get('vcindex')} 号</span>
					<span className="mxb-jvdirection">{jv.get('creditAmount') ? '贷' : '借'}</span>
					<Amount className="mxb-amount" showZero={true}>{jv.get('creditAmount') || jv.get('debitAmount')}</Amount>
					<Amount className="mxb-amount" showZero={true}>{jv.get('balanceAmount')}</Amount>
				</div>
			</div>

		)
	}
}
