import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver, TablePagination } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import Item from './Item'
import TableTitle from './TableTitle'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {
		const {
            dispatch,
            issuedate,
            endissuedate,
			incomeExpendBalanceList,
			showChildList,
			paginationCallBack,
			totalBalance,
			allItemShow,
			chooseValue,
		} = this.props

		return (
            <TableWrap notPosition={true}>
                <TableAll type="kmye" newTable="true">
                    <TableTitle
						dispatch={dispatch}
                        className="incomeExpend-yeb-table-width incomeExpend-yeb-table-title"
						allItemShow={allItemShow}
                    />
                    <TableBody>
						{
							incomeExpendBalanceList && incomeExpendBalanceList.map((v, i) => {
								return (
									<Item
										key={i}
										index={i}
										className="incomeExpend-yeb-table-width incomeExpend-yeb-table-item"
										topItem={v}
										line={i+1}
										dispatch={dispatch}
										issuedate={issuedate}
										endissuedate={endissuedate}
										showChildList={showChildList}
										chooseValue={chooseValue}
									/>
								)
							})
						}

                        <TableItem className="incomeExpend-yeb-table-width incomeExpend-yeb-table-item"
						line={incomeExpendBalanceList.size ? incomeExpendBalanceList.size+1 : 1}
						>
                            <li>合计</li>
                            <li></li>
                            <li>
                                <span><Amount>{totalBalance.get('openARBalance')}</Amount></span>
                                <span><Amount>{totalBalance.get('openAPBalance')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{totalBalance.get('incomeAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('expenseAmount')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{totalBalance.get('realIncomeAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('realExpenseAmount')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{totalBalance.get('closeARBalance')}</Amount></span>
                                <span><Amount>{totalBalance.get('closeAPBalance')}</Amount></span>
                            </li>
                        </TableItem>
                    </TableBody>
					{
						// <TablePagination
						// 	currentPage={currentPage}
						// 	pageCount={pageCount}
						// 	paginationCallBack={(value) => paginationCallBack(value)}
						// />
					}
                </TableAll>
			</TableWrap>
		)
	}
}
