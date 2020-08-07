import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver, TablePagination} from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'
import MxTitleItem from './MxTitleItem'
import Item from './Item'
import * as Limit from 'app/constants/Limit.js'
import * as xmmxActions from 'app/redux/Mxb/XmMxb/xmMxb.action'

// yezi
// import * as accountActions from 'app/actions/account.action'
import * as zhmxActions from 'app/redux/Mxb/ZhMxb/zhMxb.action'

@immutableRenderDecorator
export default
class CardTable extends React.Component {

	render() {
		const {
			dispatch,
			// selectList,
			curCategory,
			issuedate,
			panes,
			xmmxState,
			accountConfState,
			runningCategory,
			curAccountUuid,
			editLrAccountPermission,
			curCardUuid,
			typeUuid,
			isTop,
			categoryUuid,
			amountTypeName,
			pageNum,
			cardPages,
			propertyCost,
			endissuedate,
			showDrawer
		} = this.props


		const detailsTemp = xmmxState.getIn(['flags','detailsTemp'])
		const pageCount = xmmxState.getIn(['flags','pageCount'])
		const currentPage = xmmxState.getIn(['flags','currentPage'])

		const property = xmmxState.getIn(['flags', 'property'])
		const accountType = xmmxState.getIn(['flags', 'accountType'])
		const paymentType = xmmxState.getIn(['flags', 'paymentType'])
		const amountType = xmmxState.getIn(['flags', 'amountType'])
		const allHappenAmount = xmmxState.getIn(['flags', 'allHappenAmount'])
		const allHappenBalanceAmount = xmmxState.getIn(['flags', 'allHappenBalanceAmount'])
		const debitSum = xmmxState.getIn(['flags', 'debitSum'])
		const creditSum = xmmxState.getIn(['flags', 'creditSum'])
		const total = xmmxState.getIn(['flags', 'total'])

		let lineNum = 0
		const runningShowChild = xmmxState.getIn(['flags', 'runningShowChild'])
		const loop = (data, leve) => data.map((item, i) => {
			let line = ++lineNum
			const showChild = true //runningShowChild.indexOf(item.get('uuid')) > -1
			if (item.get('childList').size) {
				return (
					<div key={`${item.get('uuid')}${line}`}>
						<Item
							leve={leve}
							className="xmmxb-table-width"
							mxitem={item}
							haveChild={true}
							showChild={showChild}
							line={line}
							panes={panes}
							dispatch={dispatch}
							issuedate={issuedate}
							editLrAccountPermission={editLrAccountPermission}
							uuidList={detailsTemp.filter((v,i) => i>0 ? v.get('uuid') !== detailsTemp.getIn([i-1,'uuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值')}
							showDrawer={showDrawer}
						/>
						{showChild ? loop(item.get('childList'), leve+1) : ''}
					</div>
				)
			} else {
				return (
					<div key={`${item.get('uuid')}${line}`}>
						<Item
							leve={leve}
							className="xmmxb-table-width"
							mxitem={item}
							line={line}
							panes={panes}
							dispatch={dispatch}
							issuedate={issuedate}
							editLrAccountPermission={editLrAccountPermission}
							uuidList={detailsTemp.filter((v,i) => i>0 ? v.get('uuid') !== detailsTemp.getIn([i-1,'uuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值')}
							showDrawer={showDrawer}
						/>
					</div>
				)
			}
		})
		return (
			<TableAll  className="xmmxb-table">
				<MxTitleItem
					className={"amountxmmx-table-width"}
					accountType={accountType}
					curAccountUuid={curAccountUuid}
					property={property}
					amountType={amountType}
				/>
				<TableBody>
					{loop(detailsTemp,1)}

					<TableItem className={'xmmxb-table-width mxb-table-justify'} line={detailsTemp.size ? detailsTemp.size + 1 : 1}>
						<li></li>
						<li></li>
						<li>合计</li>
						<TableOver><Amount>{debitSum}</Amount></TableOver>
						<TableOver><Amount>{creditSum}</Amount></TableOver>
						<TableOver><Amount>{total}</Amount></TableOver>

					</TableItem>
				</TableBody>
				<TablePagination
					currentPage={currentPage}
					pageCount={pageCount}
					paginationCallBack={(value) => {
						dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,value,curCardUuid,amountType,categoryUuid,propertyCost))
					}}
				/>
			</TableAll>
		)
	}
}
