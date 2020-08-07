import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver, TablePagination } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'
// import TableTitle from './TableTitle'
import ZhTitleItem from './ZhTitleItem'
import Item from './Item'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class CardTable extends React.Component {

	render() {
		const {
			dispatch,
			balanceTemp,
			issuedate,
			zhyeState,
			runningTemp,
			endissuedate,
			allBeginAmount,
			allIncomeAmount,
			allExpenseAmount,
			allBalanceAmount
		} = this.props
console.log(balanceTemp.size);
		let lineNum = 0
		const runningShowChild = zhyeState.getIn(['flags', 'runningShowChild'])
		// const runningSelect = zhyeState.getIn(['flags', 'runningSelect'])
		const loop = (data, leve, upperArr) => data.map((item, i) => {
			let line = ++lineNum
			const showChild = runningShowChild.indexOf(item.get('categoryUuid')) > -1
			// console.log(showChild);
			if (item.get('childList') && item.get('childList').size) {
				return (
					<div key={`${item.get('categoryUuid')}${line}`}>
						<Item
							leve={leve}
							className="zh-balance-running-tabel-width"
							item={item}
							haveChild={true}
							showChild={showChild}
							line={line}
							upperArr={upperArr}
							dispatch={dispatch}
							issuedate={issuedate}
							runningTemp={runningTemp}
							endissuedate={endissuedate}
						/>
						{showChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('categoryUuid'))) : ''}
					</div>
				)
			} else {
				return (
					<div key={`${item.get('categoryUuid')}${line}`}>
						<Item
							leve={leve}
							className="zh-balance-running-tabel-width"
							item={item}
							line={line}
							upperArr={upperArr}
							dispatch={dispatch}
							issuedate={issuedate}
							runningTemp={runningTemp}
							endissuedate={endissuedate}
						/>
					</div>
				)
			}
		})

		return (
			<TableAll className="mxb-table-left zhye-table" style={{width:'100%'}}>
				<ZhTitleItem className="amountzhye-table-width"/>
				<TableBody>
					{loop(balanceTemp, 1, fromJS([]))}
					<TableItem className={'amountzhye-table-width-footer'} line={balanceTemp.size ? balanceTemp.size+1 : 1}>
						<li>合计</li>
						<li></li>
						<TableOver textAlign="right"><Amount>{allBeginAmount}</Amount></TableOver>
						<TableOver textAlign="right"><Amount>{allIncomeAmount}</Amount></TableOver>
						<TableOver textAlign="right"><Amount>{allExpenseAmount}</Amount></TableOver>
						<TableOver textAlign="right"><Amount>{allBalanceAmount}</Amount></TableOver>

					</TableItem>
				</TableBody>

			</TableAll>
		)
	}
}
