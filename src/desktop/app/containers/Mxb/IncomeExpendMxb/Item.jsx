import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Checkbox, Button, message, Tooltip } from 'antd'
import { TableItem, ItemTriangle, TableOver,Amount } from 'app/components'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {

    render() {
        const {
            index,
            item,
            dispatch,
            line,
            className,
            issuedate,
            endissuedate,
            showChildList,
            uuidList,
            refreshList,
            totalSize,
        } = this.props

        const directionName = {
            'debit' : '收入',
            'credit' : '支出',
            'debitAndCredit' : '收支'
        }
        return (
            <TableItem line={line+1} className={className}>
                <Tooltip title={`本页行次：${index}/${totalSize}`}>
                    <li
                        textAlign="left"
                        className='incomeExpend-mxb-table-item-date'
                    >
                        <span >{`${item.get('jrDate')}`}</span>
                    </li>
                </Tooltip>
                <TableOver
                    isLink={true}
                    className='incomeExpend-mxb-table-item-id'
                    onClick={(e)=>{
                        e.stopPropagation()
                        dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'mxb', uuidList,refreshList))
                    }}
                >
                    {`${item.get('jrIndex')}号`}
                </TableOver>
                <Tooltip title={item.get('jrAbstract')}>
					<li className='incomeExpend-mxb-table-item-abstract'><span>{item.get('jrAbstract')}</span></li>
				</Tooltip>
                <li className='incomeExpend-mxb-table-item-balance-content'>
                    <span><Amount>{item.get('incomeAmount')}</Amount></span>
                    <span><Amount>{item.get('expenseAmount')}</Amount></span>
                </li>
                <li className='incomeExpend-mxb-table-item-balance-content'>
                    <span><Amount>{item.get('realIncomeAmount')}</Amount></span>
                    <span><Amount>{item.get('realExpenseAmount')}</Amount></span>
                </li>
                <li className='incomeExpend-mxb-table-item-direction'><span>{directionName[item.get('direction')]}</span></li>
                <li className='incomeExpend-mxb-table-item-balance-content'>
                    <span><Amount>{item.get('closeARBalance')}</Amount></span>
                    <span><Amount>{item.get('closeAPBalance')}</Amount></span>
                </li>
            </TableItem>
        )
    }
}
