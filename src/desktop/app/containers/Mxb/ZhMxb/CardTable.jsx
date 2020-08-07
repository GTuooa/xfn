import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver, TablePagination} from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'
import MxTitleItem from './MxTitleItem'
import Item from './Item'
import * as Limit from 'app/constants/Limit.js'

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
			detailsTemp,
			issuedate,
			endissuedate,
			panes,
			zhmxState,
			accountConfState,
			runningCategory,
			curAccountUuid,
			editLrAccountPermission,
			propertyCost,
			showDrawer
		} = this.props

		const currentPage = zhmxState.get('currentPage')
		const pageCount = zhmxState.get('pageCount')

		const property = zhmxState.getIn(['flags', 'property'])
		const accountType = zhmxState.getIn(['flags', 'accountType'])
		const paymentType = zhmxState.getIn(['flags', 'paymentType'])
		const detailQuota = zhmxState.getIn(['flags', 'amountType'])
		const allHappenAmount = zhmxState.getIn(['flags', 'allHappenAmount'])
		const allHappenBalanceAmount = zhmxState.getIn(['flags', 'allHappenBalanceAmount'])
		const allIncomeAmount = zhmxState.getIn(['flags', 'allIncomeAmount'])
		const allExpenseAmount = zhmxState.getIn(['flags', 'allExpenseAmount'])
		const allBalanceAmount = zhmxState.getIn(['flags', 'allBalanceAmount'])
		let lineNum = 0
		const runningShowChild = zhmxState.getIn(['flags', 'runningShowChild'])
		const loop = (data, leve ,isAdd=true) => data.map((item, i) => {
			let line =  isAdd ? (++lineNum) : lineNum
			const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
			if (item.get('childList').size) {
				return (
					<div key={`${item.get('uuid')}${line}`}>
						<Item
							leve={leve}
							className="zhmxb-table-width"
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
						{showChild ? loop(item.get('childList'), leve+1 , false) : ''}
					</div>
				)
			} else {
				return (
					<div key={`${item.get('uuid')}${line}`}>
						<Item
							leve={leve}
							className="zhmxb-table-width"
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
			<TableAll  className="zhmxb-table-left">
				<div className="zhmxb-table-title-first">
					<div className="mxb-title-lb">流水类别: {accountType}</div>
					<div className="mxb-title-fx">方向: {property} </div>
				</div>
				<MxTitleItem
					className={"amountzhmx-table-width"}
					accountType={accountType}
					curAccountUuid={curAccountUuid}
					property={property}
				/>
				<TableBody>
					{loop(detailsTemp,1)}

					<TableItem className={'zhmxb-table-width mxb-table-justify'} line={detailsTemp.size ? detailsTemp.size+1 : 1}>
						<li></li>
						<li></li>
						<li>合计</li>
						<li></li>
						<TableOver><Amount>{allIncomeAmount}</Amount></TableOver>
						<TableOver><Amount>{allExpenseAmount}</Amount></TableOver>
						<TableOver><Amount>{allBalanceAmount}</Amount></TableOver>

					</TableItem>
				</TableBody>
				<TablePagination
					currentPage={currentPage}
					pageCount={pageCount}
					paginationCallBack={(value) => dispatch(zhmxActions.getDetailList(curCategory,issuedate,value,curAccountUuid,endissuedate,propertyCost))}
				/>
			</TableAll>
		)
	}
}
