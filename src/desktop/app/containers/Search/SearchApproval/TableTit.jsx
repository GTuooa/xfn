import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

import { Icon, Checkbox }	from 'antd'

@immutableRenderDecorator
export default
class TableTit extends React.Component {

	render() {

		const { dispatch, className, selectAll, onClick, sortByBeginDateCallBack, sortByEndDateCallBack, sortByDealtypeCallBack } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className + ' ' + "table-title"}>
					<li onClick={onClick}>
						<Checkbox checked={selectAll}/>
					</li>
					<li
						className="cxpz-cur"
						onClick={() => {
							sortByBeginDateCallBack()
						}}
					>
						提交日期
						<span className="cxpz-sort-icon"></span>
					</li>
					<li
						className="cxpz-cur"
						onClick={() => {
							sortByEndDateCallBack()
						}}
					>
						完成日期
						<span className="cxpz-sort-icon"></span>
					</li>
					<li>审批标题</li>
					<li>操作</li>
					<li>明细类型</li>
					<li>明细日期</li>
					<li>明细金额</li>
					<li
						className="cxpz-cur"
						onClick={() => {
							sortByDealtypeCallBack()
						}}
					>
						记账状态
						<span className="cxpz-sort-icon"></span>
					</li>
					<li>记账流水</li>
					<li>流水状态</li>
					<li>记账员</li>
				</ul>
			</div>
		)
	}
}

// <li className="cxpz-cur"
// 	onClick={() => {
// 		sortByReviewedOnClick()
// 		dispatch(cxpzActions.sortVcListByReviewed())
// 		dispatch(cxpzActions.getVcListFetch(issuedate, '1', '', '', (vcreviewedSort === 'DESC' ? 'ASC' : 'DESC'), {condition: inputValue, conditionType: searchType}))
// }}>
// 	审核人
// 	<span className="cxpz-sort-icon"></span>
// </li>