import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { XfnIcon } from 'app/components'

import * as incomeExpendYebActions from 'app/redux/Yeb/IncomeExpendYeb/incomeExpendYeb.action.js'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {

        const { dispatch, className, allItemShow } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={["table-title-kmyeb", className].join(' ')}>
					<li>
						<span>
							流水类别
						</span>
						<span
						className='incomeExpend-yeb-itme-show'
						onClick={() => {
							dispatch(incomeExpendYebActions.changeIncomeExpendYebItemShow(!allItemShow))
						}}>
							<XfnIcon type={allItemShow ? 'running-number-up' : 'running-number-down'}/>
						</span>
					</li>
					<li><span>方向</span></li>
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

				</ul>
			</div>
		)
	}
}
