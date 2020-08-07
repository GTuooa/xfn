import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class JvTitleItem extends React.Component {

	render() {

		const { className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title table-title-amountmxb`}>
					<li><span>日期</span></li>
					<li><span>凭证字号</span></li>
					<li><span>摘要</span></li>
					<li className="amountmxb-title-cell">
						<div className="amountmxb-item-first">
							借方发生额
						</div>
						<div className="amountmxb-item-second-one">
							<span>数量</span>
							<span>单价</span>
							<span>金额</span>
						</div>
					</li>
					<li className="amountmxb-title-cell">
						<div className="amountmxb-item-first">
							贷方发生额
						</div>
						<div className="amountmxb-item-second-one">
							<span>数量</span>
							<span>单价</span>
							<span>金额</span>
						</div>
					</li>
					<li className="amountmxb-title-cell">
						<div className="amountmxb-item-first">
							余额
						</div>
						<div className="amountmxb-item-second-two">
							<span>方向</span>
							<span>数量</span>
							<span>单价</span>
							<span>金额</span>
						</div>
					</li>
				</ul>
				<i className="shadow-title-amountmxb"></i>
			</div>
		)
	}
}
