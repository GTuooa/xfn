import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox } from 'antd'
import { toJS } from 'immutable'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{
	render() {
		const {
			dispatch,
			className,
			main,
			mainWater,
			onClick,
			issuedate,
			curAccountUuid,
			selectAcAll,
			dateSortType,
			categorySortType,
			amountSortType,
			nameSortType,
			inputValue,
			simplifyStatus,
			isAccount,
			isAsc
		} = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className ? `${className} table-title` : "table-title"}>
					<li onClick={onClick}>
						<Checkbox checked={selectAcAll}/>
					</li>
					<li
						onClick={() => {
							dispatch(cxlsActions.getBusinessList(issuedate,mainWater,curAccountUuid,'','SEARCH_ORDER_DATE',inputValue,!isAsc,isAccount))
						}}
					>
                        <span>日期</span>
						<span className="cxls-sort-icon"></span>
                    </li>
                    <li>
                        <span>流水号</span>
                    </li>
                    <li
						onClick={() => {
							dispatch(cxlsActions.getBusinessList(issuedate,mainWater,curAccountUuid,'','SEARCH_ORDER_CATEGORY_TYPE',inputValue,!isAsc,isAccount))
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
							<span>收款额</span>
						</li>
						:
						<li
							onClick={() => {
								dispatch(cxlsActions.getBusinessList(issuedate,mainWater,curAccountUuid,'','SEARCH_ORDER_AMOUNT',inputValue,!isAsc,isAccount))
							}}
						>
							<span>金额</span>
							<span className="cxls-sort-icon"></span>
						</li>
					}
					{
						isAccount?
						<li>
							<span>付款额</span>
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
							dispatch(cxlsActions.getBusinessList(issuedate, mainWater, curAccountUuid, '', 'SEARCH_ORDER_CREATE_NAME', inputValue, !isAsc, isAccount))
						}}
					>
                        <span>制单人</span>
						<span className="cxls-sort-icon"></span>
                    </li>
                    <li style={{display: main == 'waitFor' ? 'none' : ''}}
						onClick={() => {
							dispatch(cxlsActions.getBusinessList(issuedate, mainWater, curAccountUuid, '', 'SEARCH_ORDER_CERTIFICATE', inputValue, !isAsc, isAccount))
						}}
					>
                        <span>
							{simplifyStatus ? '凭证' : '审核'}
						</span>
						<span className="cxls-sort-icon"></span>
                    </li>
				</ul>
			</div>
		)
	}
}
