import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Tooltip } from 'antd'
import { TableItem, TableOver, Amount } from 'app/components'
import { formatMoney } from 'app/utils'
import { isShowTooltip } from '../../MxbModal/CommonFun'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class TypeItem extends React.Component {

	render() {
		const {
			line,
            className,
            item,
			direction,
            dispatch,
			uuidList,
			refreshList,
			amountPlaces,
			balancePlaces,
			index,
            totalSize,
		} = this.props

		const debitBalance = direction == 'double_debit' || direction == 'debit' ?
		item.get('direction') == 'debit' ? item.get('balance') : -item.get('balance') : ''

		const creditBalance = direction == 'double_credit' || direction == 'credit' ?
		item.get('direction') == 'credit' ? item.get('balance') : -item.get('balance') : ''

		const balanceAmount = direction === 'debit'  || direction === 'double_debit' ? debitBalance : creditBalance

		return (
			<TableItem className={className} line={line}>
				<Tooltip title={`本页行次：${index}/${totalSize}`}>
					<li
						textAlign="left"
					>
						<span >{`${item.get('jrDate')}`}</span>
					</li>
				</Tooltip>
				<TableOver
					isLink={true}
					onClick={(e)=>{
						e.stopPropagation()
						dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'mxb', uuidList,refreshList))
					}}
				>
					{`${item.get('jrIndex')}号`}
				</TableOver>

				<Tooltip title={item.get('jrAbstract')}>
					<li><span>{item.get('jrAbstract')}</span></li>
				</Tooltip>
				<li>
					<Tooltip title={isShowTooltip(item.get('debitAmount'),2,amountPlaces) ? formatMoney(item.get('debitAmount')) : ''}><span><Amount>{item.get('debitAmount')}</Amount></span></Tooltip>
				</li>
				<li>
					<Tooltip title={isShowTooltip(item.get('creditAmount'),2,amountPlaces) ? formatMoney(item.get('creditAmount')) : ''}><span><Amount>{item.get('creditAmount')}</Amount></span></Tooltip>
				</li>
				<li>
					<span>{direction === 'debit'  || direction === 'double_debit' ? '借' : '贷' }</span>
				</li>
				<li>
					<Tooltip title={isShowTooltip(balanceAmount,2,balancePlaces) ? formatMoney(balanceAmount) : ''}><span><Amount>{balanceAmount}</Amount></span></Tooltip>
				</li>
			</TableItem>
		)
	}
}
