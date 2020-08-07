import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as assMxbActions from 'app/redux/Mxb/AssMxb/assMxb.action'
import { Amount } from 'app/components'

@immutableRenderDecorator
export default
class Jv extends React.Component {

	render() {
		const {
			idx,
			jv,
			issuedate,
			dispatch,
			history,
			jvlist
		} = this.props

		const vcdate = jv.get('vcdate').replace(/-/g, '.')

		return (
			<div
				className="assmxb-jv"
				onClick={() => dispatch(assMxbActions.getVcFetch(jv.get('vcdate').slice(0,7), jv.get('vcindex'), history,jvlist))}
				>
				<div className="assmxb-jv-title">
					<span className="assmxb-jv-abstract">{`${vcdate}-${jv.get('jvabstract')}`}</span>
				</div>
				<div className="assmxb-jv-content">
					<span className="assmxb-vcindex">记 {jv.get('vcindex')} 号</span>
					<span className="assmxb-jvdirection">{jv.get('jvdirection') == 'credit' ? '贷' : '借'}</span>
					<Amount className="assmxb-amount" showZero={true}>{jv.get('jvamount')}</Amount>
					<Amount className="assmxb-amount" showZero={true}>{jv.get('balance')}</Amount>
				</div>
			</div>

		)
	}
}
