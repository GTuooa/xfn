import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox } from 'antd'
import { toJS } from 'immutable'
import { XfnIcon } from 'app/components'

import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{
	render() {
		const {
			dispatch,
			className,
			onClick,
			issuedate,
			endissuedate,
			curAccountUuid,
			selectAcAll,
			dateSortType,
			indexSortType,
			categorySortType,
			certificateSortType,
			nameSortType,
			inputValue,
			isAccount,
			isAsc,
			allItemShow,
			orderType,
			pageSize,
		} = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className ? `${className} table-title` : "table-title"}>
					<li onClick={onClick}>
						<Checkbox checked={selectAcAll}/>
					</li>
					<li
						onClick={() => {
							// dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate,curAccountUuid,'','SEARCH_ORDER_DATE',inputValue,!dateSortType,isAccount))
							dispatch(searchRunningActions.getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: '', pageSize: pageSize, orderBy: 'SEARCH_ORDER_DATE', searchContent: inputValue, isAsc: !dateSortType, isAccount: isAccount }))
						}}
					>
                        <span>日期</span>
						<span className="cxls-sort-icon"></span>
                    </li>
                    <li>
						<div onClick={() => {
							// dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate,curAccountUuid,'','SEARCH_ORDER_JR_INDEX',inputValue,!indexSortType,isAccount))
							dispatch(searchRunningActions.getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: '', pageSize: pageSize, orderBy: 'SEARCH_ORDER_JR_INDEX', searchContent: inputValue, isAsc: !indexSortType, isAccount: isAccount }))
						}}>
							<span>流水号</span>
							<span className="cxls-sort-icon sort-number"></span>
						</div>
						<span onClick={() => {
							// dispatch(searchRunningActions.changeCxAccountCommonOutString(['flags', 'allItemShow'], !allItemShow))
							dispatch(searchRunningActions.changeSearchRunningAllChildItemShow(!allItemShow))

						}}>
							<XfnIcon type={allItemShow ? 'kmyeUp' : 'kmyeDown'} style={{color:'#999'}}/>
						</span>
                    </li>
                    <li
						onClick={() => {
							// dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate,curAccountUuid,'','SEARCH_ORDER_CATEGORY_TYPE',inputValue,!categorySortType,isAccount))
							dispatch(searchRunningActions.getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: '', pageSize: pageSize, orderBy: 'SEARCH_ORDER_CATEGORY_TYPE', searchContent: inputValue, isAsc: !categorySortType, isAccount: isAccount }))
						}}
					>
                        <span>流水类别</span>
						<span className="cxls-sort-icon"></span>
                    </li>
                    <li>
                        <span>摘要</span>
                    </li>
                    <li>
                        <span>类型</span>
                    </li>
					{
						isAccount?
						<li>
							<span>收款金额</span>
						</li>
						:
						<li
							// onClick={() => {
							// 	dispatch(searchRunningActions.getBusinessList(issuedate,curAccountUuid,'','SEARCH_ORDER_AMOUNT',inputValue,isAsc,isAccount))
							// }}
						>
							<span>借方金额</span>
							{/*<span className="cxls-sort-icon"></span>*/}
						</li>
					}
					{
						isAccount? '' :
						<li
							// onClick={() => {
							// 	dispatch(searchRunningActions.getBusinessList(issuedate,curAccountUuid,'','SEARCH_ORDER_AMOUNT',inputValue,isAsc,isAccount))
							// }}
						>
							<span>贷方金额</span>
							{/*<span className="cxls-sort-icon"></span>*/}

						</li>
					}
					{
						isAccount?
						<li>
							<span>付款金额</span>
						</li>:''
					}
					{
						isAccount?
						<li>
							<span>余额</span>
						</li>:''
					}
                    <li>
                        <span>状态</span>
                    </li>
					<li
						onClick={() => {
							// dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate, curAccountUuid, '', 'SEARCH_ORDER_CREATE_NAME', inputValue, !nameSortType, isAccount))
							dispatch(searchRunningActions.getBusinessList(issuedate, endissuedate, { accountUuid:curAccountUuid, curPage: '', pageSize:pageSize, orderBy: 'SEARCH_ORDER_CREATE_NAME', searchContent:inputValue, isAsc: !nameSortType, isAccount:isAccount }))
						}}
					>
                        <span>制单人</span>
						<span className="cxls-sort-icon"></span>
                    </li>
                    <li
						onClick={() => {
							// dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate, curAccountUuid, '', 'SEARCH_ORDER_CERTIFICATE', inputValue, !certificateSortType, isAccount))
							dispatch(searchRunningActions.getBusinessList(issuedate, endissuedate, { accountUuid:curAccountUuid, curPage: '', pageSize:pageSize, orderBy: 'SEARCH_ORDER_CERTIFICATE', searchContent:inputValue, isAsc: !certificateSortType, isAccount:isAccount }))
						}}
					>
                        <span>
							审核人
						</span>
						<span className="cxls-sort-icon"></span>
                    </li>
				</ul>
			</div>
		)
	}
}
