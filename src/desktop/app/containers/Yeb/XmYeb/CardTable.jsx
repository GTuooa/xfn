import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver, TablePagination } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'
// import TableTitle from './TableTitle'
import WlTitlePR from './WlTitlePR'
import ItemPR from './ItemPR'
import TitleItem from './TitleItem'
import * as Limit from 'app/constants/Limit.js'
import * as xmyeActions from 'app/redux/Yeb/XmYeb/xmYeb.action'

@immutableRenderDecorator
export default
class CardTable extends React.Component {

	render() {
		const {
			dispatch,
			balanceTemp,
			issuedate,
			xmyeState,
			runningTemp,
			endissuedate,
			incomeAmount,
			expenseAmount,
			balanceAmount,
			realIncomeAmount,
			realExpenseAmount,
			realBalanceAmount,
			currentPage,
			pageCount,
			typeUuid
		} = this.props
		let lineNum = 0
		const runningShowChild = xmyeState.getIn(['flags', 'runningShowChild'])
		const isTop = xmyeState.getIn(['flags', 'isTop'])
		const categoryUuid = xmyeState.getIn(['flags', 'categoryUuid'])
		const runningCategoryUuid = xmyeState.getIn(['flags', 'runningCategoryUuid'])
		const propertyCost = xmyeState.getIn(['flags', 'propertyCost'])
		const runningType = xmyeState.getIn(['flags', 'runningType'])
		const xmType = xmyeState.getIn(['flags', 'xmType'])
		let hasChild = false
		// const runningSelect = xmyeState.getIn(['flags', 'runningSelect'])
		const loop = (data, leve,isAdd=true) => data.map((item, i) => {
			let line = isAdd ? ++lineNum: lineNum
			const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
			// console.log(showChild);
			if (item.get('childList') && item.get('childList').size) {
				hasChild = true
				return (
					<div key={`${item.get('uuid')}${line}`}>
						<TitleItem
							leve={leve}
							className="xm-balance-running-tabel-width"
							item={item}
							haveChild={true}
							line={line}
							// upperArr={upperArr}
							dispatch={dispatch}
							issuedate={issuedate}
							endissuedate={endissuedate}
							showChild={showChild}
							runningShowChild={runningShowChild}
							runningCategoryUuid={runningCategoryUuid}
							propertyCost={propertyCost}
							runningType={runningType}
						/>
						{showChild && loop(item.get('childList'), leve+1,false)}
					</div>
				)
			} else {
				return (
					<div key={`${item.get('uuid')}${line}`}>
						<ItemPR
							leve={leve}
							line={line}
							className="amountxmye-table-width-item"
							item={item}
							dispatch={dispatch}
							issuedate={issuedate}
							endissuedate={endissuedate}
							categoryUuid={categoryUuid}
							isTop={isTop}
							propertyCost={propertyCost}
							runningCategoryUuid={runningCategoryUuid}
							runningType={runningType}
							xmType={xmType}
						/>
					</div>
				)
			}
		})

		return (
			<TableAll className="mxb-table-left xmye-table" style={{width:'100%'}}>
				<WlTitlePR className="amountxmye-table-width"/>
				<TableBody>
					{loop(balanceTemp,0)}
						<TableItem className={'amountxmye-table-width-item'} line={balanceTemp.size ? balanceTemp.size + 1 : 1}>
							<li>合计</li>
							<li>
								<div className='xmyeb-item-divide'>
									<Amount className='amount-right'>{incomeAmount}</Amount>
									<Amount className='amount-right'>{expenseAmount}</Amount>
									<Amount className='amount-right'>{balanceAmount}</Amount>
								</div>
							</li>
							<li>
								<div className='xmyeb-item-divide'>
									<Amount className='amount-right'>{realIncomeAmount}</Amount>
									<Amount className='amount-right'>{realExpenseAmount}</Amount>
									<Amount className='amount-right'>{realBalanceAmount}</Amount>
								</div>
							</li>
						</TableItem>


				</TableBody>
				{
					!hasChild?
					<TablePagination
						currentPage={currentPage}
						pageCount={pageCount?pageCount:1}
						paginationCallBack={(value) => dispatch(xmyeActions.getProjectBalanceList(issuedate,endissuedate,value,isTop,categoryUuid,runningCategoryUuid))}
					/>:''
				}
			</TableAll>
		)
	}
}
