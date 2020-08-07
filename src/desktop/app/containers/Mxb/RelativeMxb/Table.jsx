import React, { PropTypes, Fragment } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableBody, TableTitle, TableItem, TableAll, TableOver, Amount, TablePagination } from 'app/components'
import { Switch, Checkbox, Tooltip } from 'antd'
import { formatMoney } from 'app/utils'
import { isShowTooltip } from '../MxbModal/CommonFun'

import OverviewItem from './OverviewItem.jsx'
import OverviewTitle from './OverviewTitle.jsx'

import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
			dispatch,
			reportData,
			paginationCallBack,
			currentRelativeItem,
			chooseDirection,
			needBranch,
			mergeStockBranch,
			analysisType,
			showAccount,
			showProject,
			showJrCategory,
			showStock,
			openQuantity,
			currentCardItem,

			issuedate,
			endissuedate,
			chooseStockCard,
			chooseProjectCard,
			chooseAccountCard,
			chooseJrCategoryCard,
			selectAccountUuid,
			projectCardList,
			stockCardList,
			accountCardList,
			jrCategoryList,
			curSelectProjectUuid,
			curSelectStockUuid,
			curSelectAccountUuid,
			curSelectJrCategoryUuid,
			modalName,

		} = this.props

		const currentPage = reportData.get('currentPage')
		const pageCount = reportData.get('pages')
		const balanceList = reportData.get('detailList')

		const uuidListJs = balanceList.toJS()
		let hash = {}
		const newUuidList = uuidListJs.reduce((item, next) => {
			hash[next.oriUuid] ? '' : hash[next.oriUuid] = true && item.push(next);
			return item
		}, [])
		const finalUuidList = newUuidList.length ? newUuidList.filter(v => v.oriUuid) : []

		const isDebit = chooseDirection == 'double_debit' || chooseDirection == 'debit'

		let titleClassName =''

		switch(analysisType){
			case 'HAPPEN':
				titleClassName= showStock ?
								( openQuantity ?
									( showProject || showJrCategory ? 'relative-mxb-stock-quantity-project' : 'relative-mxb-stock-quantity' ):
									( showProject || showJrCategory ? 'relative-mxb-stock-project' : 'relative-mxb-stock')
								) :
								(showProject ?
									( showJrCategory ? 'relative-mxb-stock-project' : 'relative-mxb-project' ) :
									( showJrCategory ? 'relative-mxb-project' : 'relative-mxb-happen')
								)
				break;
			case 'PAYMENT':
				titleClassName= showAccount ? (showJrCategory ? 'relative-mxb-stock-project' : 'relative-mxb-account') : (showJrCategory ? 'relative-mxb-project' : 'relative-mxb-receive')
				break;
			case 'RECEIVABLE':
				titleClassName= showProject ? 'table-title-relative-overview-project' : 'table-title-relative-overview'
				break;
			case '':
			default:
				titleClassName= showJrCategory ? 'table-title-relative-overview-jrcategory' : 'table-title-relative-overview'
				break;
		}
		const amountPlaces = 8, balancePlaces = 9

		return (
			<TableAll type="lsmxb" newTable="true" shadowTop={'31px'}>
				<div className="relative-mxb-title">
					<span>
						往来: {currentCardItem.get('name') ? currentCardItem.get('name') : '全部'}
					</span>
					<span className='relative-mxb-title-checkbox'>
					{
						analysisType === '' && needBranch ||
						analysisType === 'HAPPEN' || analysisType === 'PAYMENT' ?
						<span>
							<Tooltip title={showProject && showStock ? '最多勾选两项显示，可勾除后重新勾选' : ''}>
								<Checkbox
									className='relative-mxb-top-branch'
									checked={showJrCategory}
									disabled={showProject && showStock }
									onChange={(e)=>{
										dispatch(relativeMxbActions.changeCommonValue('showJrCategory',e.target.checked))
										if(!e.target.checked){
											dispatch(relativeMxbActions.changeFilterCardValue('chooseJrCategoryCard',fromJS([])))
											dispatch(relativeMxbActions.changeFilterCardValue('curSelectJrCategoryUuid',fromJS([])))
										}
										const filterCardObj = {
											showAccount,
											showStock,
											showProject,
											showJrCategory: e.target.checked,
											accountList: chooseAccountCard,
											projectList: chooseProjectCard,
											jrCategoryList: [],
											stockList: chooseStockCard,
											analysisType,
											needBranch,
											mergeStockBranch
										}
										dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangeAnalysisValue(issuedate,endissuedate,currentCardItem,chooseDirection,filterCardObj))

									}}
								/>
							</Tooltip>
							&nbsp;
							显示流水类别
						</span> : null
					}
						{
							analysisType === 'HAPPEN' || analysisType === 'RECEIVABLE'?
							<span>
								<Tooltip title={showJrCategory && showStock ? '最多勾选两项显示，可勾除后重新勾选' : ''}>
									<Checkbox
										className='relative-mxb-top-branch'
										checked={showProject}
										disabled={showJrCategory && showStock}
										onChange={(e)=>{
											dispatch(relativeMxbActions.changeCommonValue('showProject',e.target.checked))
											if(!e.target.checked){
												dispatch(relativeMxbActions.changeFilterCardValue('chooseProjectCard',fromJS([])))
												dispatch(relativeMxbActions.changeFilterCardValue('curSelectProjectUuid',fromJS([])))
											}
											const filterCardObj = {
												showAccount,
												showStock,
												showProject: e.target.checked,
												accountList: chooseAccountCard,
												showJrCategory,
												jrCategoryList: chooseJrCategoryCard,
												projectList: [],
												stockList: chooseStockCard,
												analysisType,
											}
											dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangeAnalysisValue(issuedate,endissuedate,currentCardItem,chooseDirection,filterCardObj))

										}}
									/>
								</Tooltip>
								&nbsp;
								显示项目
							</span> : null
						}
						{
							analysisType === 'HAPPEN' ?
							<span>
								<Tooltip title={showJrCategory && showProject ? '最多勾选两项显示，可勾除后重新勾选' : ''}>
									<Checkbox
										className='relative-mxb-top-branch'
										checked={showStock}
										disabled={showJrCategory && showProject}
										onChange={(e)=>{
											dispatch(relativeMxbActions.changeCommonValue('showStock',e.target.checked))
											if(!e.target.checked){
												dispatch(relativeMxbActions.changeFilterCardValue('chooseStockCard',fromJS([])))
												dispatch(relativeMxbActions.changeFilterCardValue('curSelectStockUuid',fromJS([])))
											}
											const filterCardObj = {
												showAccount,
												showStock: e.target.checked,
												showProject,
												showJrCategory,
												jrCategoryList: chooseJrCategoryCard,
												accountList: chooseAccountCard,
												projectList: chooseProjectCard,
												stockList: [],
												analysisType,
											}
											dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangeAnalysisValue(issuedate,endissuedate,currentCardItem,chooseDirection,filterCardObj))
										}}
									/>
								</Tooltip>&nbsp;
								显示存货
							</span> : null
						}
						{
							analysisType === 'PAYMENT' ?
							<span>
								<Checkbox
									className='relative-mxb-top-branch'
									checked={showAccount}
									onChange={(e)=>{
										dispatch(relativeMxbActions.changeCommonValue('showAccount',e.target.checked))
										if(!e.target.checked){
                                            dispatch(relativeMxbActions.changeFilterCardValue('chooseAccountCard',fromJS([])))
                                            dispatch(relativeMxbActions.changeFilterCardValue('curSelectAccountUuid',fromJS([])))
                                        }
										const filterCardObj = {
											showAccount: e.target.checked,
											showStock,
											showProject,
											showJrCategory,
											jrCategoryList: chooseJrCategoryCard,
											accountList: [],
											projectList: chooseProjectCard,
											stockList: chooseStockCard,
											analysisType,
										}
										dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangeAnalysisValue(issuedate,endissuedate,currentCardItem,chooseDirection,filterCardObj))
									}}
								/>&nbsp;
								显示账户
							</span> : null
						}
					</span>




				</div>
				<OverviewTitle
					className={`table-title-relative ${titleClassName}`}
					analysisType={analysisType}
					showStock={showStock}
					showProject={showProject}
					showAccount={showAccount}
					showJrCategory={showJrCategory}
					openQuantity={openQuantity}
					isDebit={isDebit}
					dispatch={dispatch}

					issuedate={issuedate}
					endissuedate={endissuedate}
					currentCardItem={currentCardItem}
					chooseDirection={chooseDirection}
					chooseStockCard={chooseStockCard}
					chooseProjectCard={chooseProjectCard}
					chooseAccountCard={chooseAccountCard}
					chooseJrCategoryCard={chooseJrCategoryCard}
					accountCardList={accountCardList}
					jrCategoryList={jrCategoryList}
					stockCardList={stockCardList}
					projectCardList={projectCardList}
					projectCardList={projectCardList}
					curSelectProjectUuid={curSelectProjectUuid}
					curSelectStockUuid={curSelectStockUuid}
					curSelectAccountUuid={curSelectAccountUuid}
					curSelectJrCategoryUuid={curSelectJrCategoryUuid}
					modalName={modalName}
					needBranch={needBranch}
					mergeStockBranch={mergeStockBranch}
				/>

				<TableBody>
					<TableItem className={`table-title-relative ${titleClassName}`} line={1}>
						<li></li>
						<li></li>
						<li>{reportData.get('openDetail')  ? '期初余额' : ''}</li>
						{ (analysisType == '' || analysisType == 'HAPPEN' || analysisType == 'PAYMENT') && showJrCategory ? <li><span></span></li> : null }
						{ analysisType == 'RECEIVABLE' && showProject ? <li><span></span></li> : null }
						{
							analysisType == '' || analysisType == 'RECEIVABLE' ?
							<Fragment>
								<li>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','debitAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','debitAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','debitAmount'])}</Amount></span></Tooltip>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','creditAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','creditAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','creditAmount'])}</Amount></span></Tooltip>
								</li>
								<li>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','realDebitAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','realDebitAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','realDebitAmount'])}</Amount></span></Tooltip>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','realCreditAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','realCreditAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','realCreditAmount'])}</Amount></span></Tooltip>
								</li>
							</Fragment> : null
						}
						{ analysisType == 'HAPPEN' && showProject ? <li><span></span></li> : null }
						{ analysisType == 'HAPPEN' && showStock ? <li><span></span></li> : null }
						{ analysisType == 'HAPPEN' && showStock && openQuantity ? <li><span></span></li> : null }
						{ analysisType == 'PAYMENT' && showAccount ? <li><span></span></li> : null }
						{
							analysisType == 'HAPPEN' || analysisType == 'PAYMENT' ?
							<Fragment>
								<li>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','realDebitAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','realDebitAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','realDebitAmount'])}</Amount></span></Tooltip>
								</li>
								<li>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','realCreditAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','realCreditAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','realCreditAmount'])}</Amount></span></Tooltip>
								</li>
							</Fragment>: null
						}

						<li>
							{
								chooseDirection == 'double_debit' || chooseDirection == 'double_credit' ?
								<Switch
									className="use-unuse-style lend-bg"
									checked={chooseDirection == 'double_debit' ? false : true}
									checkedChildren={analysisType === 'PAYMENT' ? '付款' : "支出"}
									unCheckedChildren={analysisType === 'PAYMENT' ? '收款' : "收入"}
									style={{width: 56}}
									onChange={() => {
										dispatch(relativeMxbActions.changeRelativeMxbReportDirection(chooseDirection == 'double_debit' ? 'double_credit' : 'double_debit'))
									}}
								/> :
								<span>{chooseDirection == 'debit' ? (analysisType === 'PAYMENT' ? '收款' : '收入') : (analysisType === 'PAYMENT' ? '付款' :'支出')}</span>
							}


						</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.getIn(['openDetail', 'balance']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail', 'balance'])) : ''}><span><Amount>{reportData.getIn(['openDetail', 'balance'])}</Amount></span></Tooltip>
						</li>
					</TableItem>
					{
						balanceList && balanceList.map((v, i) => {
							return (
								<OverviewItem
									key={i}
									item={v}
									line={i}
									index={i+1}
									dispatch={dispatch}
									uuidList={fromJS(finalUuidList)}
									direction={chooseDirection}
									className={`table-title-relative ${titleClassName}`}
									needBranch={needBranch}
									analysisType={analysisType}
									showStock={showStock}
									showProject={showProject}
									showAccount={showAccount}
									showJrCategory={showJrCategory}
									openQuantity={openQuantity}
									amountPlaces={amountPlaces}
									balancePlaces={balancePlaces}
									totalSize={balanceList ? balanceList.size : 0}
								/>
							)
						})
					}
					<TableItem className={`table-title-relative ${titleClassName}`} line={balanceList && balanceList.size ? balanceList.size : 0}>
						<li></li>
						<li></li>
						<li>合计</li>
						{ (analysisType == '' || analysisType == 'HAPPEN' || analysisType == 'PAYMENT') && showJrCategory ? <li><span></span></li> : null }
						{ analysisType == 'RECEIVABLE' && showProject ? <li><span></span></li> : null }
						{
							analysisType == '' || analysisType == 'RECEIVABLE' ?
							<Fragment>
								<li>
									<Tooltip title={isShowTooltip(analysisType === '' ? reportData.get('debitAmount') : reportData.get('receivableDebitAmount'),2,amountPlaces) ? (analysisType === '' ? formatMoney(reportData.get('debitAmount')) : formatMoney(reportData.get('receivableDebitAmount'))) : ''}><span><Amount>{analysisType === '' ? reportData.get('debitAmount') : reportData.get('receivableDebitAmount')}</Amount></span></Tooltip>
									<Tooltip title={isShowTooltip(analysisType === '' ? reportData.get('creditAmount') : reportData.get('receivableCreditAmount'),2,amountPlaces) ? (analysisType === '' ? formatMoney(reportData.get('creditAmount')) : formatMoney(reportData.get('receivableCreditAmount'))) : ''}><span><Amount>{analysisType === '' ? reportData.get('creditAmount') : reportData.get('receivableCreditAmount')}</Amount></span></Tooltip>
								</li>
								<li>
									<Tooltip title={isShowTooltip(analysisType === '' ? reportData.get('realDebitAmount') : reportData.get('receivableRealDebitAmount'),2,amountPlaces) ? (analysisType === '' ? formatMoney(reportData.get('realDebitAmount')) : formatMoney(reportData.get('receivableRealDebitAmount'))) : ''}><span><Amount>{analysisType === '' ? reportData.get('realDebitAmount') : reportData.get('receivableRealDebitAmount')}</Amount></span></Tooltip>
									<Tooltip title={isShowTooltip(analysisType === '' ? reportData.get('realCreditAmount') : reportData.get('receivableRealCreditAmount'),2,amountPlaces) ? (analysisType === '' ? formatMoney(reportData.get('realCreditAmount')) : formatMoney(reportData.get('receivableRealCreditAmount'))) : ''}><span><Amount>{analysisType === '' ? reportData.get('realCreditAmount') : reportData.get('receivableRealCreditAmount')}</Amount></span></Tooltip>
								</li>
							</Fragment> : null
						}
						{ analysisType == 'HAPPEN' && showProject ? <li><span></span></li> : null }
						{ analysisType == 'HAPPEN' && showStock ? <li><span></span></li> : null }
						{ analysisType == 'HAPPEN' && showStock && openQuantity ? <li><span></span></li> : null }
						{ analysisType == 'PAYMENT' && showAccount ? <li><span></span></li> : null }
						{
							analysisType == 'HAPPEN' || analysisType == 'PAYMENT' ?
							<Fragment>
								<li>
									<Tooltip title={isShowTooltip(analysisType === 'HAPPEN' ? reportData.get('debitAmount') : reportData.get('realDebitAmount'),2,amountPlaces)  ? (analysisType === 'HAPPEN' ? formatMoney(reportData.get('debitAmount')) : formatMoney(reportData.get('realDebitAmount'))) : ''}><span><Amount>{analysisType === 'HAPPEN' ? reportData.get('debitAmount') : reportData.get('realDebitAmount')}</Amount></span></Tooltip>
								</li>
								<li>
									<Tooltip title={isShowTooltip(analysisType === 'HAPPEN' ? reportData.get('creditAmount') : reportData.get('realCreditAmount'),2,amountPlaces)  ? (analysisType === 'HAPPEN' ? formatMoney(reportData.get('creditAmount')) : formatMoney(reportData.get('realCreditAmount'))) : ''}><span><Amount>{analysisType === 'HAPPEN' ? reportData.get('creditAmount'): reportData.get('realCreditAmount')}</Amount></span></Tooltip>
								</li>
							</Fragment>: null
						}


						<li>
							<span>{chooseDirection === 'debit'  || chooseDirection === 'double_debit' ? (analysisType === 'PAYMENT' ? '收款' : '收入') : (analysisType === 'PAYMENT' ? '付款' :'支出') }</span>
						</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.get('balance'),2,balancePlaces) ? formatMoney(reportData.get('balance')) : ''}><span><Amount textAlign={'right'}>{reportData.get('balance')}</Amount></span></Tooltip>
						</li>
					</TableItem>
				</TableBody>
				<TablePagination
					currentPage={currentPage}
					pageCount={pageCount}
					paginationCallBack={(value) => paginationCallBack(value)}
				/>
			</TableAll>
		)
	}
}
