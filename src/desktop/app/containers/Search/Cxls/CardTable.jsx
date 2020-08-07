import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver, TablePagination } from 'app/components'
import { Tooltip, Icon, Checkbox, Progress } from 'antd'

import TableTitle from './TableTitle'
import CardItem from './CardItem'
import * as Limit from 'app/constants/Limit.js'
import { formatMoney } from 'app/utils'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'

@immutableRenderDecorator
export default
class CardTable extends React.Component {

	render() {
		const {
			main,
			mainWater,
			dutyList,
			waitPayList,
			dispatch,
			selectList,
			openCardModal,
			openRunningModal,
			businessTemp,
			issuedate,
			curAccountUuid,
			panes,
			cxlsState,
			dateSortType,
			categorySortType,
			amountSortType,
			nameSortType,
			inputValue,
			accountList,
			editLrAccountPermission,
			reviewLrAccountPermission,
			editPzPermission,
			simplifyStatus,
			intelligentStatus,
			showDrawer,
			onClose
		} = this.props

		// const selectAcAll = main === 'duty' ? (showList.size ? selectList.size === showList.size : false) : false
		const selectAcAll = businessTemp.size ? selectList.size === businessTemp.size : false

		const currentPage = cxlsState.get('currentPage')
		const pageCount = cxlsState.get('pageCount')
		const waterType = cxlsState.getIn(['flags', 'mainWater'])
		const isAccount = cxlsState.getIn(['flags', 'isAccount'])
		const isAsc = cxlsState.getIn(['flags', 'isAsc'])
		const accountUuid = cxlsState.getIn(['flags', 'curAccountUuid'])
		const debitAmount = cxlsState.getIn(['flags', 'debitAmount'])
		const creditAmount = cxlsState.getIn(['flags', 'creditAmount'])
		const openedAmount = cxlsState.getIn(['flags', 'openedAmount'])
		const endedAmount = cxlsState.getIn(['flags', 'endedAmount'])

		return (
			<TableAll type="with-plus">
				<TableTitle
					className={isAccount ? 'account-waitFor-table-width' : 'account-duty-table-width'}
					main={main}
					mainWater={mainWater}
					dispatch={dispatch}
					curAccountUuid={curAccountUuid}
					selectAcAll={selectAcAll}
					issuedate={issuedate}
					dateSortType={dateSortType}
					categorySortType={categorySortType}
					amountSortType={amountSortType}
					nameSortType={nameSortType}
					inputValue={inputValue}
					simplifyStatus={simplifyStatus}
					isAccount={isAccount}
					isAsc={isAsc}
					intelligentStatus={intelligentStatus}
					onClick={() => dispatch(cxlsActions.accountItemCheckboxCheckAll(selectAcAll, businessTemp))}
				/>
				<TableBody>
					{
						isAccount?
						<div>
							<ul className='table-item account-waitFor-table-width'>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<TableOver textAlign='left'>
									期初余额
								</TableOver>
								<li></li>
								<li></li>
								<li></li>
								<TableOver textAlign='right'>
									{openedAmount?formatMoney(openedAmount):''}
								</TableOver>
								<li></li>
								<li></li>
								<li></li>
							</ul>
						</div>:''
					}
					{
						businessTemp.map((v, i) => {
							return <CardItem
								issuedate={issuedate}
								key={i}
								item={v}
								line={i}
								className={isAccount ? 'account-waitFor-table-width' : 'account-duty-table-width'}
								main={main}
								dispatch={dispatch}
								selectList={selectList}
								openCardModal={openCardModal}
								openRunningModal={openRunningModal}
								panes={panes}
								cxlsState={cxlsState}
								accountList={accountList}
								editLrAccountPermission={editLrAccountPermission}
								reviewLrAccountPermission={reviewLrAccountPermission}
								editPzPermission={editPzPermission}
								simplifyStatus={simplifyStatus}
								intelligentStatus={intelligentStatus}
								uuidList={businessTemp}   //上下条要带当页流水所有数据
								showDrawer={showDrawer}
								onClose={onClose}
								inputValue={inputValue}
							/>
						})
					}
					{
						isAccount?
						<ul className='table-item account-waitFor-table-width'>
							<li></li>
							<li></li>
							<TableOver textAlign='left'>
								合计
							</TableOver>
							<li></li>
							<li></li>
							<TableOver textAlign='left'>
								收入
							</TableOver>
							<TableOver textAlign='right'>
								{debitAmount?formatMoney(debitAmount):''}
							</TableOver>
							<TableOver textAlign='right'>
								{creditAmount?formatMoney(creditAmount):''}
							</TableOver>
							<TableOver textAlign='right'>
								{endedAmount?formatMoney(endedAmount):''}
							</TableOver>
							<li></li>
							<li></li>
							<li></li>
						</ul>:''
					}
					{/* <TableItem line={showList.size+1} className={main === 'waitFor' ? 'account-waitFor-table-width' : 'account-duty-table-width'}>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<TableOver textAlign="left">本期合计</TableOver>
						<li>
							<Amount className="account-pay-receive-amount">{main === 'duty' ? dutyList.get('debitSum') : waitPayList.get('debitSum')}</Amount>
						</li>
						<li>
							<Amount className="account-pay-receive-amount">{main === 'duty' ? dutyList.get('creditSum') : waitPayList.get('creditSum')}</Amount>
						</li>

						<li><span></span></li>
						<li><span></span></li>
						<li  style={{display: main == 'waitFor' ? 'none' : ''}}><span></span></li>
					</TableItem> */}
				</TableBody>
				<TablePagination
					currentPage={currentPage}
					pageCount={pageCount}
					paginationCallBack={(value) => dispatch(cxlsActions.getBusinessList(issuedate, waterType, accountUuid, value))}
				/>
			</TableAll>
		)
	}
}
