import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'

import Item from './Item'
import TableTitle from './TableTitle'
import * as Limit from 'app/constants/Limit.js'

import * as relativeYebActions from 'app/redux/Yeb/RelativeYeb/relativeYeb.action.js'

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
			chooseValue,
			currentRunningItem,
			currentRelativeItem,
			orderBy,
			analysisType,
		} = this.props

		const balanceList = balanceReport.get('childList')

		const titleNameList = analysisType === '' ? [
			{name:'往来单位'},
			{name:'期初余额',childList:[{name:'应收余额'},{name:'应付余额'}]},
			{name:'本期发生额',childList:[{name:'收入发生额'},{name:'支出发生额'}]},
			{name:'本期收付额',childList:[{name:'收款额'},{name:'付款额'}]},
			{
				name:'期末余额',
				onClick:()=>{
					if(currentRelativeItem.get('name') === '全部'){
						const newOrderBy = orderBy === '' ? 'receive' : orderBy === 'receive' ? 'pay' : 'receive'
						dispatch(relativeYebActions.getRelativeYebBalanceListRefresh(issuedate, endissuedate, currentRelativeItem,currentRunningItem,newOrderBy))
						dispatch(relativeYebActions.getRelativeYebCategoryFetch(issuedate, endissuedate))
					}
				},
				showSort: currentRelativeItem.get('name') === '全部' ? true : false,
				childList:[{name:'应收余额'},{name:'应付余额'}]
			}
		] :
		[
			{name:'往来单位'},
			{name:'期初余额',childList:[{name:'应收余额'},{name:'应付余额'}]},
			{name:'本期新增',childList:[{name:'应收额'},{name:'应付额'}]},
			{name:'本期核销',childList:[{name:'应收核销额'},{name:'应付核销额'}]},
			{
				name:'期末余额',
				onClick:()=>{
					if(currentRelativeItem.get('name') === '全部'){
						const newOrderBy = orderBy === '' ? 'receive' : orderBy === 'receive' ? 'pay' : 'receive'
						dispatch(relativeYebActions.getRelativeYebBalanceListRefresh(issuedate, endissuedate, currentRelativeItem,currentRunningItem,newOrderBy))
						dispatch(relativeYebActions.getRelativeYebCategoryFetch(issuedate, endissuedate))
					}
				},
				showSort: currentRelativeItem.get('name') === '全部' ? true : false,
				childList:[{name:'应收余额'},{name:'应付余额'}]
			}
		]

		return (
            <TableWrap type="yeb-one" notPosition={true} shadowTwo={true}>
                <TableAll type="kmye" newTable="true">
					<TableTitle
                        className="relative-yeb-table-width"
						titleNameList={titleNameList}
                    />
                    <TableBody>
                        {
                            balanceList && balanceList.map((v, i) => {
                                return (
                                    <Item
										key={i}
										index={i}
                                        className="relative-yeb-table-width relative-yeb-table-item"
                                        topItem={v}
                                        line={i+1}
                                        dispatch={dispatch}
                                        issuedate={issuedate}
                                        endissuedate={endissuedate}
										showChildList={showChildList}
										chooseValue={chooseValue}
										currentRunningItem={currentRunningItem}
										currentRelativeItem={currentRelativeItem}
										analysisType={analysisType}
                                    />
                                )
                            })
                        }
                        <TableItem className="relative-yeb-table-width relative-yeb-table-item" line={balanceList.size ? balanceList.size+1 : 1}>
                            <li>合计</li>
                            <li>
                                <span><Amount>{balanceReport.get('openDebit')}</Amount></span>
                                <span><Amount>{balanceReport.get('openCredit')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisType === '' ? balanceReport.get('currentDebit') : balanceReport.get('receivableDebit')}</Amount></span>
                                <span><Amount>{analysisType === '' ? balanceReport.get('currentCredit') : balanceReport.get('receivableCredit')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisType === '' ? balanceReport.get('currentRealDebit') : balanceReport.get('receivableRealDebit')}</Amount></span>
                                <span><Amount>{analysisType === '' ? balanceReport.get('currentRealCredit') : balanceReport.get('receivableRealCredit')}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{balanceReport.get('closeDebit')}</Amount></span>
                                <span><Amount>{balanceReport.get('closeCredit')}</Amount></span>
                            </li>
                        </TableItem>
                    </TableBody>
                </TableAll>
			</TableWrap>
		)
	}
}
