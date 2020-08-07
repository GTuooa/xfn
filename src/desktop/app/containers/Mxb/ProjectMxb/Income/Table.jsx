import React, { PropTypes, Fragment } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableBody, TableTitle, TableItem, TableAll, TableOver, Amount, TablePagination } from 'app/components'
import { Switch,Checkbox, Tooltip } from 'antd'

import { formatMoney } from 'app/utils'
import { isShowTooltip } from '../../MxbModal/CommonFun'
import OverviewItem from './OverviewItem.jsx'
import OverviewTitle from './OverviewTitle.jsx'

import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
			dispatch,
			reportData,
			paginationCallBack,
			currentProjectItem,
			issuedate,
			endissuedate,
			currentCardItem,
			chooseDirection,
			refreshList,
			analysisValue,
			showAccount,
			showCurrent,
			showStock,
			openQuantity,

			chooseStockCard,
			chooseContactCard,
			chooseAccountCard,
			selectAccountUuid,
			showAccountModal,
			curSelectAccountUuid,
			curSelectContactUuid,
			curSelectStockUuid,
			modalName,
			accountCardList,
			contactCardList,
			stockCardList,
			showAll,
			amountPlaces,
			balancePlaces,

		} = this.props

		// accountDetailType : ACCOUNT_CATEGORY、 OTHER_CATEGORY、 OTHER_TYPE

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

		switch(analysisValue){
			case '1':
				titleClassName= showStock ?
								( openQuantity ?
									( showCurrent ? 'project-mxb-stock-quantity-project' : 'project-mxb-stock-quantity' ):
									(showCurrent ? 'project-mxb-stock-project' : 'project-mxb-stock')
								) :
								(showCurrent ? 'project-mxb-project' : 'project-mxb-happen')
				break;
			case '2':
				titleClassName= showAccount ? 'project-mxb-account' : 'project-mxb-receive'
				break;
			case '3':
				titleClassName= showCurrent ? 'table-title-project-overview-project' : 'table-title-project-overview'
				break;
			case '0':
			default:
				titleClassName='table-title-project-overview'
				break;
		}

		return (
			<TableAll type="lsmxb" newTable="true" shadowTop={'31px'}>
				<div className="project-mxb-title">
					<span>项目: {currentCardItem.get('name') ? currentCardItem.get('name') : '全部'}</span>
					<span className='project-mxb-title-checkbox'>
						{
							analysisValue === '1' || analysisValue === '3'?
							<span>
								<Checkbox
									className='project-mxb-top-branch'
									checked={showCurrent}
									onChange={(e)=>{
										dispatch(projectMxbActions.changeFilterCardValue('showCurrent',e.target.checked))
										if(!e.target.checked){
											dispatch(projectMxbActions.changeFilterCardValue('chooseContactCard',fromJS([])))
											dispatch(projectMxbActions.changeFilterCardValue('curSelectContactUuid',fromJS([])))
										}
										const filterCardObj = {
											showAccount,
											showStock,
											showCurrent: e.target.checked,
											accountList: chooseAccountCard,
											currentList: [],
											stockList: chooseStockCard,
											analyse: analysisValue,
										}
										dispatch(projectMxbActions.getProjectMxbBalanceListFromChangeAnalysisValue(issuedate, endissuedate, currentCardItem, chooseDirection,filterCardObj))
									}}
								/>&nbsp;
								显示往来
							</span> : null
						}
						{
							analysisValue === '1' ?
							<span>
								<Checkbox
									className='project-mxb-top-branch'
									checked={showStock}
									onChange={(e)=>{
										dispatch(projectMxbActions.changeFilterCardValue('showStock',e.target.checked))
                                        if(!e.target.checked){
                                            dispatch(projectMxbActions.changeFilterCardValue('chooseStockCard',fromJS([])))
                                            dispatch(projectMxbActions.changeFilterCardValue('curSelectStockUuid',fromJS([])))
                                        }
										const filterCardObj = {
											showAccount,
											showStock: e.target.checked,
											showCurrent,
											accountList: chooseAccountCard,
											currentList: chooseContactCard,
											stockList: [],
											analyse: analysisValue,
										}
										dispatch(projectMxbActions.getProjectMxbBalanceListFromChangeAnalysisValue(issuedate, endissuedate, currentCardItem, chooseDirection,filterCardObj))
									}}
								/>&nbsp;
								显示存货
							</span> : null
						}
						{
							analysisValue === '2' ?
							<span>
								<Checkbox
									className='project-mxb-top-branch'
									checked={showAccount}
									onChange={(e)=>{
										dispatch(projectMxbActions.changeFilterCardValue('showAccount',e.target.checked))
                                        if(!e.target.checked){
                                            dispatch(projectMxbActions.changeFilterCardValue('chooseAccountCard',fromJS([])))
                                            dispatch(projectMxbActions.changeFilterCardValue('curSelectAccountUuid',fromJS([])))
                                        }
										const filterCardObj = {
											showAccount: e.target.checked,
											showStock,
											showCurrent,
											accountList: [],
											currentList: chooseContactCard,
											stockList: chooseStockCard,
											analyse: analysisValue,
										}
										dispatch(projectMxbActions.getProjectMxbBalanceListFromChangeAnalysisValue(issuedate, endissuedate, currentCardItem, chooseDirection,filterCardObj))
									}}
								/>&nbsp;
								显示账户
							</span> : null
						}
					</span>
				</div>
				<OverviewTitle
					className={`table-title-project ${titleClassName}`}
					analysisValue={analysisValue}
					showStock={showStock}
					showCurrent={showCurrent}
					showAccount={showAccount}
					openQuantity={openQuantity}
					isDebit={isDebit}
					dispatch={dispatch}
					chooseStockCard={chooseStockCard}
					chooseContactCard={chooseContactCard}
					chooseAccountCard={chooseAccountCard}
					selectAccountUuid={selectAccountUuid}
					issuedate={issuedate}
					endissuedate={endissuedate}
					currentCardItem={currentCardItem}
					chooseDirection={chooseDirection}

					showAccountModal={showAccountModal}
					curSelectAccountUuid={curSelectAccountUuid}
					curSelectContactUuid={curSelectContactUuid}
					curSelectStockUuid={curSelectStockUuid}
					modalName={modalName}
					accountCardList={accountCardList}
					stockCardList={stockCardList}
					contactCardList={contactCardList}
					showAll={showAll}

				/>

				<TableBody>
					<TableItem className={`table-title-project ${titleClassName}`} line={1}>
						<li></li>
						<li></li>
						<li>{reportData.get('openDetail')  ? '期初余额' : ''}</li>

						{ analysisValue == '1' && showStock ? <li><span>{reportData.getIn(['openDetail','stockName'])}</span></li> : null }
						{ analysisValue == '1' && showStock && openQuantity ? <li><span>{reportData.getIn(['openDetail','number'])}</span></li> : null }
						{ (analysisValue == '1' || analysisValue == '3') && showCurrent ? <li><span>{reportData.getIn(['openDetail','currentName'])}</span></li> : null }
						{ analysisValue == '2' && showAccount ? <li><span>{reportData.getIn(['openDetail','accountName'])}</span></li> : null }
						{
							analysisValue == '0' || analysisValue == '3' ?
							<Fragment>
								<li>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','incomeAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','incomeAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','incomeAmount'])}</Amount></span></Tooltip>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','expenseAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','expenseAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','expenseAmount'])}</Amount></span></Tooltip>
								</li>
								<li>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','realIncomeAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','realIncomeAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','realIncomeAmount'])}</Amount></span></Tooltip>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','realExpenseAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','realExpenseAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','realExpenseAmount'])}</Amount></span></Tooltip>
								</li>
							</Fragment> :
							<Fragment>
								<li>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','incomeAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','incomeAmount'])) : ''}><span><Amount>{analysisValue == '1' ? reportData.getIn(['openDetail','incomeAmount']) : reportData.getIn(['openDetail','realIncomeAmount'])}</Amount></span></Tooltip>
								</li>
								<li>
									<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','expenseAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','expenseAmount'])) : ''}><span><Amount>{analysisValue == '1' ? reportData.getIn(['openDetail','expenseAmount']) : reportData.getIn(['openDetail','realExpenseAmount'])}</Amount></span></Tooltip>
								</li>
							</Fragment>
						}
						<li>
							{
								chooseDirection == 'double_debit' || chooseDirection == 'double_credit' ?
								<Switch
									className="use-unuse-style lend-bg"
									checked={chooseDirection == 'double_debit' ? false : true}
									checkedChildren={analysisValue == '2' ? '付款' : "支出"}
									unCheckedChildren={analysisValue == '2' ? '收款' : "收入" }
									style={{width: 56}}
									onChange={() => {
										dispatch(projectMxbActions.changeProjectMxbReportDirection(chooseDirection == 'double_debit' ? 'double_credit' : 'double_debit','Income'))
									}}
								/> :
								<span>{chooseDirection == 'debit' ? (analysisValue == '2' ? '收款' : '收入') : (analysisValue == '2' ? '付款' : '支出')}</span>
							}


						</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','balance']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','balance'])) : ''}><span><Amount>{reportData.getIn(['openDetail', 'balance'])}</Amount></span></Tooltip>
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
									refreshList={refreshList}
									// className={`project-mxb-table-width project-mxb-table-justify table-title-project ${titleClassName}`}
									className={`table-title-project ${titleClassName}`}
									analysisValue={analysisValue}
									showStock={showStock}
									showCurrent={showCurrent}
									showAccount={showAccount}
									openQuantity={openQuantity}
									showAll={showAll}
									amountPlaces={amountPlaces}
									balancePlaces={balancePlaces}
									totalSize={balanceList ? balanceList.size : 0}
								/>
							)
						})
					}
					<TableItem className={`table-title-project ${titleClassName}`} line={balanceList && balanceList.size ? balanceList.size : 0}>
						<li></li>
						<li></li>
						<li>合计</li>
						{ analysisValue == '1' && showStock ? <li><span>{reportData.get('stockName')}</span></li> : null }
						{ analysisValue == '1' && showStock && openQuantity ? <li><span>{reportData.get('number')}</span></li> : null }
						{ (analysisValue == '1' || analysisValue == '3') && showCurrent ? <li><span>{reportData.get('currentName')}</span></li> : null }
						{ analysisValue == '2' && showAccount ? <li><span>{reportData.get('accountName')}</span></li> : null }
						{
							analysisValue == '0' || analysisValue == '3' ?
							<Fragment>
								<li>
									<Tooltip title={isShowTooltip(reportData.get('incomeAmount'),2,amountPlaces) ? formatMoney(reportData.get('incomeAmount')) : ''}><span><Amount>{reportData.get('incomeAmount')}</Amount></span></Tooltip>
									<Tooltip title={isShowTooltip(reportData.get('expenseAmount'),2,amountPlaces) ? formatMoney(reportData.get('expenseAmount')) : ''}><span><Amount>{reportData.get('expenseAmount')}</Amount></span></Tooltip>
								</li>
								<li>
									<Tooltip title={isShowTooltip(reportData.get('realIncomeAmount'),2,amountPlaces) ? formatMoney(reportData.get('realIncomeAmount')) : ''}><span><Amount>{reportData.get('realIncomeAmount')}</Amount></span></Tooltip>
									<Tooltip title={isShowTooltip(reportData.get('realExpenseAmount'),2,amountPlaces) ? formatMoney(reportData.get('realExpenseAmount')) : ''}><span><Amount>{reportData.get('realExpenseAmount')}</Amount></span></Tooltip>
								</li>
							</Fragment> :
							<Fragment>
								<li>
									<Tooltip title={isShowTooltip(analysisValue == '1' ? reportData.get('incomeAmount') : reportData.get('realIncomeAmount'),2,amountPlaces) ? formatMoney(analysisValue == '1' ? reportData.get('incomeAmount') : reportData.get('realIncomeAmount')) : ''}><span><Amount>{analysisValue == '1' ? reportData.get('incomeAmount') : reportData.get('realIncomeAmount') }</Amount></span></Tooltip>
								</li>
								<li>
									<Tooltip title={isShowTooltip(analysisValue == '1' ? reportData.get('expenseAmount') : reportData.get('realExpenseAmount'),2,amountPlaces) ? formatMoney(analysisValue == '1' ? reportData.get('expenseAmount') : reportData.get('realExpenseAmount')) : ''}><span><Amount>{analysisValue == '1' ? reportData.get('expenseAmount') : reportData.get('realExpenseAmount')}</Amount></span></Tooltip>
								</li>
							</Fragment>
						}

						<li><span>{chooseDirection == 'double_debit' || chooseDirection == 'debit' ? (analysisValue == '2' ? '收款' : '收入') : (analysisValue == '2' ? '付款' : "支出")}</span>
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
