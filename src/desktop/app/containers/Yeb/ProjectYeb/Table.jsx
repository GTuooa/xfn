import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'

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
			balanceReport,
			showChildList,
			tableName,
			runningJrTypeItem,
			chooseValue,
			currentProjectItem,
			analysisValue,
		} = this.props

		const balanceList = balanceReport.get('childList')

		const titleNameList = tableName === 'Type' ? [
			{name:'项目'},
			{name:'期初余额',childList:[{name:'借方'},{name:'贷方'}]},
			{name:'本期发生额',childList:[{name:'借方'},{name:'贷方'}]},
			{name:'本年累计发生额',childList:[{name:'借方'},{name:'贷方'}]},
			{
				name:'期末余额',
				onClick:()=>{
					// console.log(11);
				},
				showSort: currentProjectItem.get('name') === '全部' ? true : false,
				childList:[{name:'借方'},{name:'贷方'}]
			}
		] :
		(
			analysisValue === '0' ? [
				{name:'项目'},
				{name:'期初余额',childList:[{name:'应收余额'},{name:'应付余额'}]},
				{name:'本期发生额',childList:[{name:'收入发生额'},{name:'支出发生额'}]},
				{name:'本期收付额',childList:[{name:'收款额'},{name:'付款额'}]},
				{
					name:'期末余额',
					onClick:()=>{
						// console.log(11);
					},
					showSort: currentProjectItem.get('name') === '全部' ? true : false,
					childList:[{name:'应收余额'},{name:'应付余额'}]
				}
			] :
			[
				{name:'项目'},
				{name:'期初余额',childList:[{name:'应收余额'},{name:'应付余额'}]},
				{name:'本期新增',childList:[{name:'应收额'},{name:'应付额'}]},
				{name:'本期核销',childList:[{name:'应收核销额'},{name:'应付核销额'}]},
				{
					name:'期末余额',
					onClick:()=>{
						// console.log(11);
					},
					showSort: currentProjectItem.get('name') === '全部' ? true : false,
					childList:[{name:'应收余额'},{name:'应付余额'}]
				}
			]
		)

		return (
            <TableWrap type="yeb-one" notPosition={true}>
                <TableAll type="kmye" newTable="true">
                    <TableTitle
                        className="project-yeb-table-width"
						// tableName={tableName}
						titleNameList={titleNameList}
                    />
                    <TableBody>
                        {
                            balanceList && balanceList.map((v, i) => {
                                return (
                                    <Item
										key={i}
										index={i}
                                        className="project-yeb-table-width project-yeb-table-item"
                                        topItem={v}
                                        line={i+1}
                                        dispatch={dispatch}
                                        issuedate={issuedate}
                                        endissuedate={endissuedate}
										showChildList={showChildList}
										tableName={tableName}
										runningJrTypeItem={runningJrTypeItem}
										chooseValue={chooseValue}
										currentProjectItem={currentProjectItem}
										analysisValue={analysisValue}
                                    />
                                )
                            })
                        }
                        <TableItem className="project-yeb-table-width project-yeb-table-item" line={balanceList.size ? balanceList.size+1 : 1}>
                            <li>合计</li>
                            <li>
                                <span><Amount>{analysisValue === '0' ? balanceReport.get('openDebit') : balanceReport.getIn(['shouldBalance','openDebitAmount'])}</Amount></span>
                                <span><Amount>{analysisValue === '0' ? balanceReport.get('openCredit') : balanceReport.getIn(['shouldBalance','openCreditAmount'])}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisValue === '0' ? balanceReport.get('currentDebit') : balanceReport.getIn(['shouldBalance','debitAmount'])}</Amount></span>
                                <span><Amount>{analysisValue === '0' ? balanceReport.get('currentCredit') : balanceReport.getIn(['shouldBalance','creditAmount'])}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisValue === '0' ? balanceReport.get('currentRealDebit') : balanceReport.getIn(['shouldBalance','debitWriteOffAmount'])}</Amount></span>
                                <span><Amount>{analysisValue === '0' ? balanceReport.get('currentRealCredit') : balanceReport.getIn(['shouldBalance','creditWriteOffAmount'])}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisValue === '0' ? balanceReport.get('closeDebit') : balanceReport.getIn(['shouldBalance','closeDebitAmount'])}</Amount></span>
                                <span><Amount>{analysisValue === '0' ? balanceReport.get('closeCredit') : balanceReport.getIn(['shouldBalance','closeCreditAmount'])}</Amount></span>
                            </li>
                        </TableItem>
                    </TableBody>
                </TableAll>
			</TableWrap>
		)
	}
}
