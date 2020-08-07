import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Checkbox }	from 'antd'
import { debounce } from 'app/utils'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action.js'

@immutableRenderDecorator
export default
class TableTit extends React.Component {

	render() {

		const {
			dispatch,
			issuedate,
			selectVcAll,
			vcindexSort,
			vcdateSort,
			vcreviewedSort,
			inputValue,
			sortByTimeOnClick,
			sortByIndexOnClick,
			className,
			sortByReviewedOnClick, 
			searchType,
			intelligentStatus,
			pageSize
		} = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className + ' ' + "table-title"}>

					<li onClick={() => dispatch(cxpzActions.selectVcAll())}>
						<Checkbox checked={selectVcAll}/>
					</li>
					<li
						className="cxpz-cur"
						onClick={() => debounce(() => {
							sortByTimeOnClick()
							dispatch(cxpzActions.sortVcListByDate())
							// dispatch(cxpzActions.getVcListFetch(issuedate, '1', (vcdateSort === 'DESC' ? 'ASC' : 'DESC'), '', '', {condition: inputValue, conditionType: searchType}))
							dispatch(cxpzActions.getVcListFetch(issuedate, {currentPage:'1', pageSize, sortTime:(vcdateSort === 'DESC' ? 'ASC' : 'DESC'), sortIndex:'', sortReviewed:'', condition:{condition: inputValue, conditionType: searchType}}))
						})()}
						>
						<span>日期</span>
						<span className="cxpz-sort-icon"></span>
					</li>
					<li
						className="cxpz-cur"
						onClick={() => debounce(() => {
							sortByIndexOnClick()
							dispatch(cxpzActions.reverseVcList())
							// dispatch(cxpzActions.getVcListFetch(issuedate, '1', '', (vcindexSort === 'DESC' ? 'ASC' : 'DESC'), '', {condition: inputValue, conditionType: searchType}))
							dispatch(cxpzActions.getVcListFetch(issuedate, {currentPage:'1', pageSize, sortTime:'', sortIndex:(vcindexSort === 'DESC' ? 'ASC' : 'DESC'), sortReviewed:'', condition:{condition: inputValue, conditionType: searchType}}))
						})()}
						>
						<span>凭证字号</span>
						<span className="cxpz-sort-icon"></span>
					</li>
					<li>摘要</li>
					<li>科目</li>
					<li>借方金额</li>
					<li>贷方金额</li>

					<li>制单人</li>
					{/* <li>审核人</li> */}
					{
						!intelligentStatus?
						<li className="cxpz-cur"
							onClick={() => debounce(() => {
								sortByReviewedOnClick()
								dispatch(cxpzActions.sortVcListByReviewed())
								// dispatch(cxpzActions.getVcListFetch(issuedate, '1', '', '', (vcreviewedSort === 'DESC' ? 'ASC' : 'DESC'), {condition: inputValue, conditionType: searchType}))
								dispatch(cxpzActions.getVcListFetch(issuedate,{currentPage:'1', pageSize, sortTime:'', sortIndex:'', sortReviewed:(vcreviewedSort === 'DESC' ? 'ASC' : 'DESC'), condition:{condition: inputValue, conditionType: searchType}}))
						})()}>
							审核人
							<span className="cxpz-sort-icon"></span>
						</li>:''
					}

				</ul>
			</div>
		)
	}
}
