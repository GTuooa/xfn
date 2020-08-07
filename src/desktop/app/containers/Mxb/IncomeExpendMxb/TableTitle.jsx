import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { TableOver} from 'app/components'
@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {
		const { accountDetailType, className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className ? `${className} table-title-kmyeb` : "table-title-kmyeb"}>
                    <li><span>日期</span></li>
                    <li><span>流水号</span></li>
                    <li><span>摘要</span></li>
					<li className="incomeExpend-mxb-table-item-balance">
						<div>
							<span>发生额</span>
						</div>
						<div>
							<span>收入发生额</span>
							<span>支出发生额</span>
						</div>
					</li>
					<li className="incomeExpend-mxb-table-item-balance">
						<div>
							<span>收付款</span>
						</div>
						<div>
							<span>收入实收额</span>
							<span>支出实付额</span>
						</div>
					</li>

                    <li><span>方向</span></li>

					<li className="incomeExpend-mxb-table-item-balance">
						<div>
							<span>余额</span>
						</div>
						<div>
							<span>应收余额</span>
							<span>应付余额</span>
						</div>
					</li>
				</ul>
			</div>
		)
	}
}
