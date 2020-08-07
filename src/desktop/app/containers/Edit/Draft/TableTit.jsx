import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox } from 'antd'
import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'

@immutableRenderDecorator
export default
class TableTit extends React.Component {
	render() {
		const {
			className,
			dateSort,
			indexSort,
			dispatch,
			selectDraftAll
		} = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className + ' ' + "table-title"}>
					<li onClick={() => dispatch(draftActions.selectDraftAll())}>
						<Checkbox checked={selectDraftAll}/>
					</li>
					<li>状态</li>
					<li
						className="cxpz-cur"
						onClick={() => dispatch(draftActions.sortDraftListByDate())}
						>
						<span>日期</span>
						<span className="cxpz-sort-icon"></span>
					</li>
					<li
						className="cxpz-cur"
						onClick={() => dispatch(draftActions.reverseDraftList())}
						>
						<span>凭证字号</span>
						<span className="cxpz-sort-icon"></span>
					</li>
					<li>摘要</li>
					<li>科目</li>
					<li>借方金额</li>
					<li>贷方金额</li>
				</ul>
			</div>
		)
	}
}
