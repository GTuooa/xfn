import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { Amount } from 'app/components'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class Vc extends React.Component {
	// static propTypes = {
	// 	idx: PropTypes.number,
	// 	jv: PropTypes.instanceOf(Map)
	// }
	render() {
		const {
			idx,
			jv
		} = this.props

		return (
			<div className="vc-jv" key={idx}>
				<div className="vc-jv-info">
					<span className="vc-jv-direction">{[jv.get('jvdirection') === 'debit' ? '借' : '贷', '：', jv.get('acfullname')].join('')}</span>
					<Amount className="vc-jv-amount" showZero={true}>{jv.get('jvamount') ? jv.get('jvamount') : 0}</Amount>
				</div>
				{
					jv.get('asslist').size ?
					<div className="vc-jv-ass">
						{
							jv.get('asslist').map((v, i) =>
								<div key={i} className={`vc-jv-ass-showtext ${i === 0 ? 'vc-jv-ass-showtext-tip' : ''}`}>
									{`${v.get('asscategory')+ '_' + v.get('assid') + ' ' + v.get('assname')}`}
								</div>
							)
						}
					</div>
					: ''
				}
				<div className="vc-jv-abstract">
					<span>摘要：</span>
					<span>{jv.get('jvabstract')}</span>
				</div>
			</div>
		)
	}
}
