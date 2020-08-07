import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Item from './Item.jsx'
import TableTitle from './TableTitle.jsx'

import { TableBody, TableItem, TableAll, Amount, TablePagination, TableOver} from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { dispatch, currentPage, pageCount, paginationCallBack,incomeExpendDetailList,openDetail, totalAmountList, categoryName, refreshList, chooseValue } = this.props

		const uuidListJs = incomeExpendDetailList.toJS()
		let hash = {}
		const newUuidList = uuidListJs.reduce((item, next) => {
			hash[next.oriUuid] ? '' : hash[next.oriUuid] = true && item.push(next);
			return item
		}, [])
		const finalUuidList = newUuidList.length ? newUuidList.filter(v => v.oriUuid) : []
		const directionName = {
            'debit' : '收入',
            'credit' : '支出',
            'debitAndCredit' : '收支'
        }
		return (
			<TableAll shadowTop="54px" type="lsmxb" newTable="true" shadowThree={true}>
				<div className="incomeExpend-mxb-title">流水类别: {categoryName}</div>
				<TableTitle
					accountDetailType={''}
					className="incomeExpend-mxb-table-width"
				/>
				<TableBody>
				{
					openDetail.get('beShow') ?
					<TableItem className="incomeExpend-mxb-table-width" line={1} >
						<li></li>
						<li></li>
						<li>{openDetail.get('jrAbstract')}</li>
						<li>
							<span><Amount>{openDetail.get('incomeAmount')}</Amount></span>
							<span><Amount>{openDetail.get('expenseAmount')}</Amount></span>
						</li>
						<li>
							<span><Amount>{openDetail.get('realIncomeAmount')}</Amount></span>
							<span><Amount>{openDetail.get('realExpenseAmount')}</Amount></span>
						</li>
						<li><span>{directionName[openDetail.get('direction')]}</span></li>
						<li>
						<span><Amount>{openDetail.get('closeARBalance')}</Amount></span>
						<span><Amount>{openDetail.get('closeAPBalance')}</Amount></span>
						</li>
					</TableItem> : null
				}

					{
						incomeExpendDetailList && incomeExpendDetailList.map((item,i) => {
							return (
								<Item
									key={i}
									index={i+1}
									className="incomeExpend-mxb-table-width"
									item={item}
									line={i+1}
									uuidList={fromJS(finalUuidList)}
									dispatch={dispatch}
									refreshList={refreshList}
									chooseValue={chooseValue}
									totalSize={incomeExpendDetailList ? incomeExpendDetailList.size : 0}
								/>
							)
						})
					}
					<TableItem className="incomeExpend-mxb-table-width"
					line={incomeExpendDetailList.size ? incomeExpendDetailList.size : 0}
					>
						<li></li>
						<li></li>
						<li>合计</li>
						<li>
							<span><Amount>{totalAmountList.get('incomeAmount')}</Amount></span>
							<span><Amount>{totalAmountList.get('expenseAmount')}</Amount></span>
						</li>
						<li>
							<span><Amount>{totalAmountList.get('realIncomeAmount')}</Amount></span>
							<span><Amount>{totalAmountList.get('realExpenseAmount')}</Amount></span>
						</li>
						<li><span>{directionName[totalAmountList.get('direction')]}</span></li>
						<li>
						<span><Amount>{totalAmountList.get('closeARBalance')}</Amount></span>
						<span><Amount>{totalAmountList.get('closeAPBalance')}</Amount></span>
						</li>
					</TableItem>

				</TableBody>
				{
					<TablePagination
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(value) => paginationCallBack(value)}
					/>
				}
			</TableAll>
		)
	}
}
