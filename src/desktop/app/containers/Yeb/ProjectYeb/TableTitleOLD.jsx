import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {

        const { className, tableName } = this.props

		return (
			<div className="table-title-wrap">
			{
				tableName === 'Income' ?
				<ul className={["table-title table-title-project-yeb", className].join(' ')}>
					<li><span>项目</span></li>
					<li>
						<div>
							<span>期初余额</span>
						</div>
						<div>
							<span>应收余额</span>
							<span>应付余额</span>
						</div>
					</li>
					<li>
						<div>
							<span>本期发生额</span>
						</div>
						<div>
							<span>收入发生额</span>
							<span>支出发生额</span>
						</div>
					</li>
					<li>
						<div>
							<span>本期收付额</span>
						</div>
						<div>
							<span>收入实收额</span>
							<span>支出实付额</span>
						</div>
					</li>
					<li>
						<div>
							<span>期末余额</span>
						</div>
						<div>
							<span>应收余额</span>
							<span>应付余额</span>
						</div>
					</li>
				</ul> :
				<ul className={["table-title table-title-project-yeb", className].join(' ')}>
					<li><span>项目</span></li>
					<li>
						<div>
							<span>期初余额</span>
						</div>
						<div>
							<span>借方</span>
							<span>贷方</span>
						</div>
					</li>
					<li>
						<div>
							<span>本期发生额</span>
						</div>
						<div>
							<span>借方</span>
							<span>贷方</span>
						</div>
					</li>
					<li>
						<div>
							<span>本年累计发生额</span>
						</div>
						<div>
							<span>借方</span>
							<span>贷方</span>
						</div>
					</li>
					<li>
						<div>
							<span>期末余额</span>
						</div>
						<div>
							<span>借方</span>
							<span>贷方</span>
						</div>
					</li>
				</ul>
			}

			</div>
		)
	}
}
