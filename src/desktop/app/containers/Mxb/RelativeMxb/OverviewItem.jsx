import React, { PropTypes, Fragment } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Tooltip } from 'antd'
import { formatMoney } from 'app/utils'
import { TableItem, TableOver, Amount } from 'app/components'
import { isShowTooltip } from '../MxbModal/CommonFun'

import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'
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
			needBranch,
			analysisType,
			showAccount,
			showProject,
			showStock,
			showJrCategory,
			openQuantity,
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
			<TableItem className={`${className}`} line={line}>
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
						dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'mxb', uuidList,() => {
							dispatch(relativeMxbActions.getRelativeMxbBalanceListFresh(needBranch))
						}))
					}}
				>
					{`${item.get('jrIndex')}号`}
				</TableOver>
				<Tooltip title={item.get('jrAbstract')}>
					<li className='relative-mxb-table-item-abstract' textAlign={'left'}><span>{item.get('jrAbstract')}</span></li>
				</Tooltip>
				{
					(analysisType == '' || analysisType == 'HAPPEN' || analysisType == 'PAYMENT')  &&  showJrCategory?
					<Tooltip title={item.get('jrCategoryFullName')}>
						<li style={{display:'flex',justifyContent:'flex-start'}} className='relative-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('jrCategoryName')}</span></li>
					</Tooltip>  : null
				}
				{
					(analysisType === 'HAPPEN' || analysisType === 'RECEIVABLE') &&  showProject?
					<Tooltip title={item.get('projectName')}>
						<li style={{display:'flex',justifyContent:'flex-start'}} className='relative-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('projectName')}</span></li>
					</Tooltip>  : null
				}
				{
					analysisType === 'HAPPEN' && showStock ?
					<Tooltip title={item.get('stockName')}>
						<li style={{display:'flex',justifyContent:'flex-start'}} className='relative-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('stockName')}</span></li>
					</Tooltip>  : null
				}
				{
					analysisType === 'HAPPEN' && showStock && openQuantity ?
					<Tooltip title={`${item.get('number') ? item.get('number') : ''}${item.get('unitName') ? item.get('unitName') : ''}`}>
						<li style={{display:'flex',justifyContent:'flex-end'}} className='relative-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('number') ? item.get('number') : ''}{item.get('unitName') ? item.get('unitName') : ''}</span></li>
					</Tooltip>  : null
				}
				{
					analysisType === 'PAYMENT' &&  showAccount?
					<Tooltip title={item.get('accountName')}>
						<li style={{display:'flex',justifyContent:'flex-start'}} className='relative-mxb-table-item-abstract'><span style={{padding:'0 4px'}}>{item.get('accountName')}</span></li>
					</Tooltip>  : null
				}
				{
					analysisType === '' || analysisType === 'RECEIVABLE' ?
					<Fragment>
						<li>
							<Tooltip title={isShowTooltip(item.get('debitAmount'),2,amountPlaces) ? formatMoney(item.get('debitAmount')) : ''}><span><Amount>{analysisType === '' ? item.get('debitAmount') : item.get('receivableDebitAmount')}</Amount></span></Tooltip>
							<Tooltip title={isShowTooltip(item.get('creditAmount'),2,amountPlaces) ? formatMoney(item.get('creditAmount')) : ''}><span><Amount>{analysisType === '' ? item.get('creditAmount') : item.get('receivableCreditAmount')}</Amount></span></Tooltip>
						</li>
						<li>
							<Tooltip title={isShowTooltip(item.get('realDebitAmount'),2,amountPlaces) ? formatMoney(item.get('realDebitAmount')) : ''}><span><Amount>{analysisType === '' ? item.get('realDebitAmount') : item.get('receivableRealDebitAmount')}</Amount></span></Tooltip>
							<Tooltip title={isShowTooltip(item.get('realCreditAmount'),2,amountPlaces) ? formatMoney(item.get('realCreditAmount')) : ''}><span><Amount>{analysisType === '' ? item.get('realCreditAmount') : item.get('receivableRealCreditAmount')}</Amount></span></Tooltip>
						</li>
					</Fragment> :
					<Fragment>
						<Tooltip title={isShowTooltip(analysisType === 'HAPPEN' ? item.get('debitAmount') : item.get('realDebitAmount'),2,amountPlaces) ? (analysisType === 'HAPPEN' ? formatMoney(item.get('debitAmount')) : formatMoney(item.get('realDebitAmount'))) : ''}><li><span><Amount>{analysisType === 'HAPPEN' ? item.get('debitAmount') : item.get('realDebitAmount')}</Amount></span></li></Tooltip>
						<Tooltip title={isShowTooltip(analysisType === 'HAPPEN' ? item.get('creditAmount'): item.get('realCreditAmount'),2,amountPlaces) ? (analysisType === 'HAPPEN' ? formatMoney(item.get('creditAmount')): formatMoney(item.get('realCreditAmount'))) : ''}><li><span><Amount>{analysisType === 'HAPPEN' ? item.get('creditAmount'): item.get('realCreditAmount')}</Amount></span></li></Tooltip>
					</Fragment>
				}

				<li>
					<span>{direction === 'debit'  || direction === 'double_debit' ? (analysisType === 'PAYMENT' ? '收款' : '收入') : (analysisType === 'PAYMENT' ? '付款' :'支出') }</span>
				</li>
				<li>
					<Tooltip title={isShowTooltip(balanceAmount,2,balancePlaces) ? formatMoney(balanceAmount) : ''}><span><Amount>{balanceAmount}</Amount></span></Tooltip>
				</li>
			</TableItem>
		)
	}
}
