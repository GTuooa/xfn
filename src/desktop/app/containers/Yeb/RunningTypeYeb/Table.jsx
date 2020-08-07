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
			runningTypeBalanceList,
			showChildList,
			paginationCallBack,
			totalBalance,
			chooseValue,
		} = this.props

		return (
            <TableWrap notPosition={true}>
                <TableAll type="kmye" newTable="true">
                    <TableTitle
                        className="runningType-yeb-table-width"
						dispatch={dispatch}
                    />
                    <TableBody>
						{
							runningTypeBalanceList && runningTypeBalanceList.map((v, i) => {
								return (
									<Item
										key={i}
										index={i}
										className="runningType-yeb-table-width runningType-yeb-table-item"
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

                        <TableItem className="runningType-yeb-table-width runningType-yeb-table-item"
						line={runningTypeBalanceList.size ? runningTypeBalanceList.size+1 : 1}
						>
                            <li>合计</li>
                            <li></li>
                            <li>
                                <span><Amount>{totalBalance.get('allBeginDebitAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('allBeginCreditAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('allMonthDebitAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('allMonthCreditAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('allYearDebitAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('allYearCreditAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('allEndDebitAmount')}</Amount></span>
                                <span><Amount>{totalBalance.get('allEndCreditAmount')}</Amount></span>
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
