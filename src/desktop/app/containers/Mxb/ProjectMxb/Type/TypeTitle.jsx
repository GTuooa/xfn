import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class TypeTitle extends React.Component{

	render() {

        const { className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className ? `${className} table-title` : "table-title"}>
					<li><span>日期</span></li>
					<li><span>流水号</span></li>
					<li><span>摘要</span></li>
					<li className='overview-mxb-table-item-amount'>
						<span>借方</span>
					</li>
					<li className='overview-mxb-table-item-amount'>
						<span>贷方</span>
					</li>
					<li><span>方向</span></li>
					<li className='overview-mxb-table-item-balance'>
						<span>余额</span>
					</li>
				</ul>
			</div>
		)
	}
}
