import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class lsTitleItem extends React.Component {
	render() {
		// console.log('JvTitleItem')
		const { className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title`}>
					<li><span>账户</span></li>
					<li><span>类型</span></li>
					<li><span>期初余额</span></li>
					<li><span>本期收款额</span></li>
					<li><span>本期付款额</span></li>
					<li><span>期末余额</span></li>
				</ul>
				<i className="shadow-title-amountzhye"></i>
			</div>
		)
	}
}
