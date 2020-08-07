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
            'debit' : '借',
            'credit' : '贷',
            '' : ''
        }
        return (
            <TableItem line={line+1} className={className}>
                <Tooltip title={item.get('oriDate') ? `本页行次：${index}/${totalSize}` : ''}>
                    <li
                        textAlign="left"
                        className='runningType-mxb-table-item-date'
                    >
                        <span >{item.get('oriDate') ? item.get('oriDate') : ''}</span>
                    </li>
                </Tooltip>
                <TableOver
                    isLink={true}
                    onClick={(e)=>{
                        e.stopPropagation()
                        dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'mxb', uuidList,refreshList))
                    }}
                >
                    {item.get('jrIndex') ? `${item.get('jrIndex')}号` : ''}
                </TableOver>
                <Tooltip title={item.get('jrJvCardAbstract') ? `${item.get('oriAbstract')}${item.get('jrJvCardAbstract')}` : item.get('oriAbstract')}>
					<li><span>{item.get('jrJvCardAbstract') ? `${item.get('oriAbstract')}${item.get('jrJvCardAbstract')}` : item.get('oriAbstract')}</span></li>
				</Tooltip>

                <li>
                    <span><Amount>{item.get('debitAmount')}</Amount></span>
                </li>
                <li>
                    <span><Amount>{item.get('creditAmount')}</Amount></span>
                </li>
                <li><span>{directionName[item.get('direction')]}</span></li>
                <li>
                    <span><Amount>{item.get('balanceAmount')}</Amount></span>
                </li>
            </TableItem>
        )
    }
}
