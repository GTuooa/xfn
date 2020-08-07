import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class wlTitleAll extends React.Component {
	render() {
		const { className, wlRelate, wlOnlyRelate } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title`}>
					<li><span>往来单位</span></li>
					<li><span>{wlRelate == '2' || wlOnlyRelate == '2' ? '期初应收额' : '期初应付额'}</span></li>
					<li><span>{wlRelate == '2' || wlOnlyRelate == '2' ? '本期应收额' : '本期应付额'}</span></li>
					<li><span>{wlRelate == '2' || wlOnlyRelate == '2' ? '本期实收额' : '本期实付额'}</span></li>
					<li><span>{wlRelate == '2' || wlOnlyRelate == '2' ? '期末应收额' : '期末应付额'}</span></li>
				</ul>
				<i className="shadow-title-amountzhye"></i>
			</div>
		)
	}
}
