import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'

import ItemPR from './ItemPR'
import TableTitle from './TableTitle'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class TablePR extends React.Component {

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

		const titleNameList = analysisType === 'HAPPEN' ?
		[{name:'往来单位'},{name:'本期发生额',childList:[{name:'收入发生额'},{name:'支出发生额'},{name:'发生净额'}]},{name:'本年累计发生额',childList:[{name:'收入发生额'},{name:'支出发生额'},{name:'发生净额'}]}] :
		[{name:'往来单位'},{name:'本期收付额',childList:[{name:'收入实收额'},{name:'支出实付额'},{name:'收付净额'}]},{name:'本年累计收付额',childList:[{name:'收入实收额'},{name:'支出实付额'},{name:'收付净额'}]}]

		return (
            <TableWrap type="yeb-one" notPosition={true} shadowTwo={true}>
                <TableAll type="kmye" newTable="true">
                    <TableTitle
                        className="relative-yeb-table-pay-receive-width"
						titleNameList={titleNameList}
                    />
                    <TableBody>
                        {
                            balanceList && balanceList.map((v, i) => {
                                return (
                                    <ItemPR
										key={i}
										index={i}
                                        className="relative-yeb-table-pay-receive-width relative-yeb-table-pay-receive-item"
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
                        <TableItem className="relative-yeb-table-pay-receive-width relative-yeb-table-pay-receive-item" line={balanceList.size ? balanceList.size+1 : 1}>
                            <li>合计</li>
                            <li>
                                <span><Amount>{analysisType === 'HAPPEN' ? balanceReport.get('currentDebit') : balanceReport.get('currentRealDebit')}</Amount></span>
                                <span><Amount>{analysisType === 'HAPPEN' ? balanceReport.get('currentCredit') : balanceReport.get('currentRealCredit')}</Amount></span>
                                <span>
									<label>{analysisType === 'HAPPEN' ? (balanceReport.get('currentBalance') > 0 ? '收入' : balanceReport.get('currentBalance') < 0 ? '支出' : '') : (balanceReport.get('currentRealBalance') > 0 ? '收款' : balanceReport.get('currentRealBalance') < 0 ? '付款' : '')}</label>
									<Amount>{analysisType === 'HAPPEN' ? balanceReport.get('currentBalance') > 0 ? balanceReport.get('currentBalance') : -balanceReport.get('currentBalance') : balanceReport.get('currentRealBalance') > 0 ? balanceReport.get('currentRealBalance') : -balanceReport.get('currentRealBalance')}</Amount>
								</span>
                            </li>
                            <li>
                                <span><Amount>{balanceReport.get('yearDebit')}</Amount></span>
                                <span><Amount>{balanceReport.get('yearCredit')}</Amount></span>
                                <span><label>{balanceReport.get('yearBalance') > 0 ? analysisType === 'HAPPEN' ? '收入' : '收款' : balanceReport.get('yearBalance') < 0 ? analysisType === 'HAPPEN' ? '支出' : '付款': ''}</label><Amount>{balanceReport.get('yearBalance') > 0 ? balanceReport.get('yearBalance') : -balanceReport.get('yearBalance')}</Amount></span>
                            </li>
                        </TableItem>
                    </TableBody>
                </TableAll>
			</TableWrap>
		)
	}
}
