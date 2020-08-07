import React, { PropTypes,Fragment } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Tooltip } from 'antd'
import { TableItem, TableOver, Amount } from 'app/components'
import { formatMoney } from 'app/utils'
import { isShowTooltip } from '../../MxbModal/CommonFun'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class OverviewItem extends React.Component {

	render() {
		const {
			line,
            className,
            item,
			direction,
            dispatch,
			uuidList,
			refreshList,
			analysisValue,
			showAccount,
			showCurrent,
			showStock,
			openQuantity,
			showAll,
			amountPlaces,
			balancePlaces,
			index,
            totalSize,
		} = this.props

		const debitBalance = direction == 'double_debit' || direction == 'debit' ?
		item.get('direction') == 'debit' ? item.get('balance') : -item.get('balance') : ''

		const creditBalance = direction == 'double_credit' || direction == 'credit' ?
		item.get('direction') == 'credit' ? item.get('balance') : -item.get('balance') : ''

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
				<Tooltip title={
					(analysisValue === '0' && showAll || analysisValue !== '0') && item.get('jrJvCardAbstract') ? `${item.get('jrAbstract')}${item.get('jrJvCardAbstract')}` : item.get('jrAbstract') ? `${item.get('jrAbstract')}` : ''
				}>
					<li className='project-mxb-table-item-abstract'>
						<span>
							{
								(analysisValue === '0' && showAll || analysisValue !== '0') && item.get('jrJvCardAbstract') ? `${item.get('jrAbstract')}${item.get('jrJvCardAbstract')}` : item.get('jrAbstract') ? `${item.get('jrAbstract')}` : ''
							}
						</span>
					</li>
				</Tooltip>
				{
					(analysisValue === '1' || analysisValue === '3') &&  showCurrent?
					<Tooltip title={item.get('currentName')}>
						<li style={{display:'flex',justifyContent:'flex-start'}}  className='project-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('currentName')}</span></li>
					</Tooltip>: null
				}
				{
					analysisValue === '1' && showStock ?
					<Tooltip title={item.get('stockName')}>
						<li style={{display:'flex',justifyContent:'flex-start'}} className='project-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('stockName')}</span></li>
					</Tooltip>: null
				}
				{
					analysisValue === '1' && showStock && openQuantity ?
					<Tooltip title={item.get('number') ? item.get('number') : ''}>
						<li style={{display:'flex',justifyContent:'flex-end'}} className='project-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('number') ? item.get('number') : ''}</span></li>
					</Tooltip>: null
				}
				{
					analysisValue === '2' &&  showAccount?
					<Tooltip title={item.get('accountName')}>
						<li style={{display:'flex',justifyContent:'flex-start'}} className='project-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('accountName')}</span></li>
					</Tooltip>: null
				}
				{
					analysisValue === '0' || analysisValue === '3' ?
					<Fragment>
						<li>
							<Tooltip title={isShowTooltip(item.get('incomeAmount'),2,amountPlaces) ? formatMoney(item.get('incomeAmount')) : ''}><span><Amount>{item.get('incomeAmount')}</Amount></span></Tooltip>
							<Tooltip title={isShowTooltip(item.get('expenseAmount'),2,amountPlaces) ? formatMoney(item.get('expenseAmount')) : ''}><span><Amount>{item.get('expenseAmount')}</Amount></span></Tooltip>
						</li>
						<li>
							<Tooltip title={isShowTooltip(item.get('realIncomeAmount'),2,amountPlaces) ? formatMoney(item.get('realIncomeAmount')) : ''}><span><Amount>{item.get('realIncomeAmount')}</Amount></span></Tooltip>
							<Tooltip title={isShowTooltip(item.get('realExpenseAmount'),2,amountPlaces) ? formatMoney(item.get('realExpenseAmount')) : ''}><span><Amount>{item.get('realExpenseAmount')}</Amount></span></Tooltip>
						</li>
					</Fragment> :
					<Fragment>
						<Tooltip title={isShowTooltip(analysisValue === '1' ? item.get('incomeAmount') : item.get('realIncomeAmount'),2,amountPlaces) ? (analysisValue === '1' ? formatMoney(item.get('incomeAmount')) : formatMoney(item.get('realIncomeAmount'))) : ''}><li><span><Amount>{analysisValue === '1' ? item.get('incomeAmount') : item.get('realIncomeAmount')}</Amount></span></li></Tooltip>
						<Tooltip title={isShowTooltip(analysisValue === '1' ? item.get('expenseAmount') : item.get('realExpenseAmount'),2,amountPlaces) ? (analysisValue === '1' ? formatMoney(item.get('expenseAmount')) : formatMoney(item.get('realExpenseAmount'))) : ''}><li><span><Amount>{analysisValue === '1' ? item.get('expenseAmount') : item.get('realExpenseAmount')}</Amount></span></li></Tooltip>
					</Fragment>
				}

				<li>
					<span>{direction === 'debit'  || direction === 'double_debit' ? (analysisValue == '2' ? '收款' : '收入') : (analysisValue == '2' ? '付款' : "支出") }</span>
				</li>
				<li>
					<Tooltip title={isShowTooltip(direction === 'debit'  || direction === 'double_debit' ? debitBalance : creditBalance,2,balancePlaces) ? formatMoney(direction === 'debit'  || direction === 'double_debit' ? debitBalance : creditBalance) : ''}><span><Amount>{direction === 'debit'  || direction === 'double_debit' ? debitBalance : creditBalance}</Amount></span></Tooltip>
				</li>
			</TableItem>
		)
	}
}
