import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { TableItem, TableOver} from 'app/components'

@immutableRenderDecorator
export default
class wlTitlePR extends React.Component {
	render() {
		// console.log('JvTitleItem')
		const { className, wlRelate } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title`} style={{height:'55px'}}>
					<li><span>日期</span></li>
					<li><span>流水号</span></li>
					<li><span>摘要</span></li>

					<TableOver className="amountwlmx-title-cell">
						<div className="amountwlmx-item-first">
							发生额
						</div>
						<div className="amountwlmx-item-second-one">
							<span>应收额</span>
							<span>应付额</span>
						</div>
					</TableOver>
					<TableOver className="amountwlmx-title-cell">
						<div className="amountwlmx-item-first">
							收付额
						</div>
						<div className="amountwlmx-item-second-one">
							<span>实收额</span>
							<span>实付额</span>
						</div>
					</TableOver>
					<li><span>方向</span></li>
					<li>
						<span>
							{
								wlRelate == '' || wlRelate == '3' ? '应收应付余额' : (wlRelate == '1' ? '应收余额' : '应付余额')
							}
						</span>
					</li>
				</ul>
				<i className="shadow-title-amountwlmx"></i>
			</div>
		)
	}
}
