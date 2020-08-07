import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { XfnIcon } from 'app/components'

import * as runningTypeYebActions from 'app/redux/Yeb/RunningTypeYeb/runningTypeYeb.action.js'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{
	constructor() {
		super()
		this.state = { isShowAll: false }
	}
	render() {

        const { className,dispatch } = this.props
		const { isShowAll } = this.state
		return (
			<div className="table-title-wrap">
				<ul className={["table-title-kmyeb", className].join(' ')}>
					<li>
						<span onClick={() => {
							dispatch(runningTypeYebActions.changeRunningTypeYebChildItemAllShow(!isShowAll))
							this.setState({isShowAll: !isShowAll})
						}}>
							类型
							<XfnIcon type={isShowAll ? 'kmyeUp' : 'kmyeDown'} className={isShowAll ? 'kmyeDown kmyeUp' : 'kmyeDown'}/>
						</span>
					</li>
					<li><span>方向</span></li>
					<li>
						<div>
							<span>期初余额</span>
							<span>本期发生额</span>
							<span>本年累计发生额</span>
							<span>期末余额</span>
						</div>
						<div>
							<span>借方</span>
							<span>贷方</span>
							<span>借方</span>
							<span>贷方</span>
							<span>借方</span>
							<span>贷方</span>
							<span>借方</span>
							<span>贷方</span>
						</div>
					</li>
				</ul>
			</div>
		)
	}
}
