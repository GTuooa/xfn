import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class wlTitlePR extends React.Component {
	render() {
		const { className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title`} style={{height:'55px'}}>
					<li><span>往来单位</span></li>

					<li className="amountwlye-title-cell">
						<div className="amountwlye-item-first">
							期初余额
						</div>
						<div className="amountwlye-item-second-two amountwlye-item-second-title">
							<span>应收额</span>
							<span>应付额</span>
						</div>
					</li>
					<li className="amountwlye-title-cell">
						<div className="amountwlye-item-first">
							本期发生额
						</div>
						<div className="amountwlye-item-second-two amountwlye-item-second-title">
							<span>应收额</span>
							<span>应付额</span>
						</div>
					</li>
					<li className="amountwlye-title-cell">
						<div className="amountwlye-item-first">
							本期收付额
						</div>
						<div className="amountwlye-item-second-two amountwlye-item-second-title">
							<span>实收额</span>
							<span>实付额</span>
						</div>
					</li>
					<li className="amountwlye-title-cell">
						<div className="amountwlye-item-first">
							期末余额
						</div>
						<div className="amountwlye-item-second-two amountwlye-item-second-title">
							<span>应收额</span>
							<span>应付额</span>
						</div>
					</li>
				</ul>
				<i className="shadow-title-amountzhye"></i>
			</div>
		)
	}
}
