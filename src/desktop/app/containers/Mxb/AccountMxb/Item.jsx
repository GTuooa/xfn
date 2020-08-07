import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as accountMxbActions from 'app/redux/Mxb/AccountMxb/accountMxb.action.js'
import { Tooltip } from 'antd'
import { TableItem, TableOver, Amount } from 'app/components'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			line,
            className,
            item,
			accountDetailType,
            dispatch,
			uuidList,
			issuedate,
			endissuedate,
			currentAccoountUuid,
			currentTreeSelectItem,
			currentPage,
			jrAbstract,
			accountType,
			index,
			totalSize,
		} = this.props

		return (
			<TableItem className={className} line={line}>
				<Tooltip title={`本页行次：${index}/${totalSize}`}><li className="account-mxb-table-item-date">{item.get('oriDate')}</li></Tooltip>
                <li
					className="account-mxb-table-item-id table-item-cur"
					onClick={(e) => {
						e.stopPropagation()
						dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'mxb',uuidList,() => {
							dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, currentTreeSelectItem, currentPage,'',jrAbstract))
							dispatch(accountMxbActions.getAccountMxbTree(issuedate, endissuedate, currentAccoountUuid,accountType))
						}))
					}}
				>
					{item.get('jrIndex')}号
				</li>
				<Tooltip title={item.get('jrJvCardAbstract') ? `${item.get('oriAbstract')}${item.get('jrJvCardAbstract')}` : item.get('oriAbstract')}>
					<li className="account-mxb-table-item-abstract">
						<span className="over-ellipsis" style={{textAlign: 'left', padding: '0 0 0 4px'}}>
							<span>
								{item.get('jrJvCardAbstract') ? `${item.get('oriAbstract')}${item.get('jrJvCardAbstract')}` : item.get('oriAbstract')}
							</span>
						</span>
					</li>
				</Tooltip>

                {
                    accountDetailType === 'OTHER_CATEGORY' ?
                    <li className="account-mxb-table-item-type">{item.get('typeName')}</li>
                    : ''
                }
                <li className="account-mxb-table-item-debit-amount">
                    <Amount>{item.get('debitAmount')}</Amount>
                </li>
                <li className="account-mxb-table-item-credit-amount">
                    <Amount>{item.get('creditAmount')}</Amount>
                </li>
                {
                    accountDetailType === 'OTHER_TYPE' ?
                    <li className="account-mxb-table-item-direction">{item.get('direction') === 'credit' ? '贷' : '借'}</li>
                    : ''
                }
                <li className="account-mxb-table-item-closed-amount">
                    <Amount>{item.get('balance')}</Amount>
                </li>
			</TableItem>
		)
	}
}
