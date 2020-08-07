import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'
import { numberCalculate } from 'app/utils'

import Item from './Item'
import TableTitle from './TableTitle'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {
		const {
            dispatch,
            issuedate,
            endissuedate,
            accountBalanceList,
            totalBalance,
			chooseValue,
		} = this.props

		return (
            <TableWrap notPosition={true}>
                <TableAll type="zhyeb" newTable="true">
                    <TableTitle
                        className="account-yeb-table-width account-yeb-table-title"
                    />
                    <TableBody>
                        {
                            accountBalanceList && accountBalanceList.map((v, i) => {
                                return (
                                    <Item
										key={i}
                                        className="account-yeb-table-width account-yeb-table-item"
                                        item={v}
                                        line={i+1}
                                        dispatch={dispatch}
                                        issuedate={issuedate}
                                        endissuedate={endissuedate}
										chooseValue={chooseValue}
                                    />
                                )
                            })
                        }
                        <TableItem className="account-yeb-table-width account-yeb-table-item" line={accountBalanceList.size ? accountBalanceList.size+1 : 1}>
                            <li>合计</li>
                            <li></li>
                            <li><span><Amount>{numberCalculate(totalBalance.get('openDebit'),totalBalance.get('openCredit'),2,'subtract') }</Amount></span></li>
                            <li>
                                <span><Amount>{totalBalance.get('currentDebit')}</Amount></span>
                                <span><Amount>{totalBalance.get('currentCredit')}</Amount></span>
                                <span><Amount>{totalBalance.get('yearDebit')}</Amount></span>
                                <span><Amount>{totalBalance.get('yearCredit')}</Amount></span>
                            </li>
							<li><span><Amount>{numberCalculate(totalBalance.get('closeDebit'),totalBalance.get('closeCredit'),2,'subtract') }</Amount></span></li>
                        </TableItem>
                    </TableBody>
                </TableAll>
			</TableWrap>
		)
	}
}
