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
			runningJrTypeItem,
			currentProjectItem,
			orderBy,
			analysisValue,
			tableName,
		} = this.props

		const balanceList = balanceReport.get('childList')

		const directionName = {
            'debit' : analysisValue === '1' ? '收入' : '收款',
            'credit' : analysisValue === '1' ? '支出' : '付款',
            '' : ''
        }

		const titleNameList = analysisValue === '1' ?
		[{name:'项目'},{name:'本期发生额',childList:[{name:'收入发生额'},{name:'支出发生额'},{name:'发生净额'}]},{name:'本年累计发生额',childList:[{name:'收入发生额'},{name:'支出发生额'},{name:'发生净额'}]}] :
		[{name:'项目'},{name:'本期收付额',childList:[{name:'收入实收额'},{name:'支出实付额'},{name:'收付净额'}]},{name:'本年累计收付额',childList:[{name:'收入实收额'},{name:'支出实付额'},{name:'收付净额'}]}]

		return (
            <TableWrap type="yeb-one" notPosition={true} shadowTwo={true}>
                <TableAll type="kmye" newTable="true">
                    <TableTitle
                        className="project-yeb-table-pay-receive-width"
						titleNameList={titleNameList}
                    />
                    <TableBody>
                        {
                            balanceList && balanceList.map((v, i) => {
                                return (
                                    <ItemPR
										key={i}
										index={i}
                                        className="project-yeb-table-pay-receive-width project-yeb-table-pay-receive-item"
                                        topItem={v}
                                        line={i+1}
                                        dispatch={dispatch}
                                        issuedate={issuedate}
                                        endissuedate={endissuedate}
										showChildList={showChildList}
										chooseValue={chooseValue}
										tableName={tableName}
										runningJrTypeItem={runningJrTypeItem}
										currentProjectItem={currentProjectItem}
										analysisValue={analysisValue}
                                    />
                                )
                            })
                        }
                        <TableItem className="project-yeb-table-pay-receive-width project-yeb-table-pay-receive-item" line={balanceList.size ? balanceList.size+1 : 1}>
                            <li>合计</li>
                            <li>
                                <span><Amount>{analysisValue === '1' ? balanceReport.getIn(['happenBalance','currentDebitAmount']) : balanceReport.getIn(['realBalance','currentRealDebitAmount'])}</Amount></span>
                                <span><Amount>{analysisValue === '1' ? balanceReport.getIn(['happenBalance','currentCreditAmount']) : balanceReport.getIn(['realBalance','currentRealCreditAmount'])}</Amount></span>
                                <span><label>{directionName[analysisValue === '1' ? balanceReport.getIn(['happenBalance','currentDirection']) : balanceReport.getIn(['realBalance','currentDirection'])]}</label><Amount>{analysisValue === '1' ? balanceReport.getIn(['happenBalance','currentRealAmount']) : balanceReport.getIn(['realBalance','currentRealAmount'])}</Amount></span>
                            </li>
                            <li>
                                <span><Amount>{analysisValue === '1' ? balanceReport.getIn(['happenBalance','yearDebitAmount']) : balanceReport.getIn(['realBalance','yearRealDebitAmount'])}</Amount></span>
                                <span><Amount>{analysisValue === '1' ? balanceReport.getIn(['happenBalance','yearCreditAmount']) : balanceReport.getIn(['realBalance','yearRealCreditAmount'])}</Amount></span>
                                <span><label>{directionName[analysisValue === '1' ? balanceReport.getIn(['happenBalance','currentDirection']) : balanceReport.getIn(['realBalance','currentDirection'])]}</label><Amount>{analysisValue === '1' ? balanceReport.getIn(['happenBalance','yearRealAmount']) : balanceReport.getIn(['realBalance','yearRealAmount'])}</Amount></span>
                            </li>
                        </TableItem>
                    </TableBody>
                </TableAll>
			</TableWrap>
		)
	}
}
