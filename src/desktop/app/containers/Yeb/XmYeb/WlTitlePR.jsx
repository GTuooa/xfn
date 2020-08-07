import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class wlTitlePR extends React.Component {
	render() {
		// console.log('JvTitleItem')
		const { className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title`} style={{height:'55px'}}>
					<li><span>项目</span></li>
					<li className="amountxmye-title-cell">
						<div className="amountxmye-item-first">
							收支发生额
						</div>
						<div className="amountxmye-item-second-two amountxmye-item-second-title">
							<span>收入额</span>
							<span>支出额</span>
							<span>收支净额</span>
						</div>
					</li>
					<li className="amountxmye-title-cell">
						<div className="amountxmye-item-first">
							实收实付额
						</div>
						<div className="amountxmye-item-second-two amountxmye-item-second-title">
							<span>实收额</span>
							<span>实付额</span>
							<span>收付净额</span>
						</div>
					</li>
				</ul>
				<i className="shadow-title-amountzhye"></i>
			</div>
		)
	}
}
