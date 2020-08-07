import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {

        const { className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className}>
					<li>
						<span>
							账户
						</span>
					</li>
					<li><span>类型</span></li>
					<li><span>期初余额</span></li>
					<li>
						<div>
							<span>本期收付额</span>
							<span>本年累计收付额</span>
						</div>
						<div>
							<span>收款额</span>
							<span>付款额</span>
							<span>收款额</span>
							<span>付款额</span>
						</div>
					</li>
					<li><span>期末余额</span></li>
				</ul>
			</div>
		)
	}
}
