import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableBody, TableTitle, TableItem, TableAll, TableOver, Amount, TablePagination } from 'app/components'
import { Switch, Tooltip } from 'antd'

// import Item from './Item.jsx'
import { formatMoney } from 'app/utils'
import { isShowTooltip } from '../../MxbModal/CommonFun'
import TypeItem from './TypeItem.jsx'
import TypeTitle from './TypeTitle.jsx'

import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'

@immutableRenderDecorator
export default
class TableType extends React.Component {

	render() {

		const {
			dispatch,
			reportData,
			paginationCallBack,
			currentProjectItem,
			currentCardItem,
			chooseDirection,
			refreshList,
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

		return (
			<TableAll shadowTop="31px" type="lsmxb" newTable="true" >
				<div className="project-mxb-title">项目: {currentCardItem.get('name') ? currentCardItem.get('name') : '全部'}</div>
				<TypeTitle
					className="table-title-project-type"
				/>

				<TableBody>
					<TableItem className={'table-title-project-type table-title-project-qc'} line={1}>
						<li></li>
						<li></li>
						<li>{reportData.get('openDetail')  ? '期初余额' : ''}</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','incomeAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','incomeAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','incomeAmount'])}</Amount></span></Tooltip>
						</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','realIncomeAmount']),2,amountPlaces) ? formatMoney(reportData.getIn(['openDetail','realIncomeAmount'])) : ''}><span><Amount>{reportData.getIn(['openDetail','realIncomeAmount'])}</Amount></span></Tooltip>
						</li>
						<li>
							{
								chooseDirection == 'double_debit' || chooseDirection == 'double_credit' ?
								<Switch
									className="use-unuse-style lend-bg"
									checked={chooseDirection == 'double_debit' ? false : true}
									checkedChildren="贷"
									unCheckedChildren="借"
									style={{width: 56}}
									onChange={() => {
										dispatch(projectMxbActions.changeProjectMxbReportDirection(chooseDirection == 'double_debit' ? 'double_credit' : 'double_debit','Type'))
									}}
								/> :
								<span>{chooseDirection == 'double_debit' || chooseDirection == 'debit' ? '借' : '贷'}</span>
							}


						</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.getIn(['openDetail','balance']),2,balancePlaces) ? formatMoney(reportData.getIn(['openDetail','balance'])) : ''}><span><Amount>{reportData.getIn(['openDetail', 'balance'])}</Amount></span></Tooltip>
						</li>
					</TableItem>
					{
						balanceList && balanceList.map((v, i) => {
							return (
								<TypeItem
									key={i}
									item={v}
									line={i}
									index={i+1}
									dispatch={dispatch}
									uuidList={fromJS(finalUuidList)}
									direction={chooseDirection}
									refreshList={refreshList}
									className={'project-mxb-table-type-width project-mxb-table-justify'}
									amountPlaces={amountPlaces}
									balancePlaces={balancePlaces}
									totalSize={balanceList ? balanceList.size : 0}
								/>
							)
						})
					}
					<TableItem className={'table-title-project-type table-title-project-qm'} line={balanceList && balanceList.size ? balanceList.size : 0}>
						<li></li>
						<li></li>
						<li>合计</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.get('debitAmount'),2,amountPlaces) ? formatMoney(reportData.get('debitAmount')) : ''}><span><Amount>{reportData.get('debitAmount')}</Amount></span></Tooltip>
						</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.get('creditAmount'),2,amountPlaces) ? formatMoney(reportData.get('creditAmount')) : ''}><span><Amount>{reportData.get('creditAmount')}</Amount></span></Tooltip>
						</li>
						<li><span>{chooseDirection == 'double_debit' || chooseDirection == 'debit' ? '借' : '贷'}</span>
						</li>
						<li>
							<Tooltip title={isShowTooltip(reportData.get('balance'),2,balancePlaces) ? formatMoney(reportData.get('balance')) : ''}><span><Amount>{reportData.get('balance')}</Amount></span></Tooltip>
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
