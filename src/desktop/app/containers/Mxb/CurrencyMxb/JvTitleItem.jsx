import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class JvTitleItem extends React.Component {

	render() {

		const { className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title table-title-currencyMxb`}>
					<li><span>日期</span></li>
					<li><span>凭证字号</span></li>
					<li><span>摘要</span></li>
					<li><span>汇率</span></li>
					<li className="currencyMxb-title-cell">
						<div className="currencyMxb-item-first">
							借方
						</div>
						<div className="currencyMxb-item-second-one">
							<span>原币</span>
							<span>本位币</span>
						</div>
					</li>
					<li className="currencyMxb-title-cell">
						<div className="currencyMxb-item-first">
							贷方
						</div>
						<div className="currencyMxb-item-second-one">
							<span>原币</span>
							<span>本位币</span>
						</div>
					</li>
					<li className="currencyMxb-title-cell">
						<div className="currencyMxb-item-first">
							余额
						</div>
						<div className="currencyMxb-item-second-two">
							<span>方向</span>
							<span>原币</span>
							<span>本位币</span>
						</div>
					</li>
				</ul>
			</div>
		)
	}
}
