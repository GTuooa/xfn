import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver, TablePagination} from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'
import WlTitleAll from './WlTitleAll'
import WlTitlePR from './WlTitlePR'
import Item from './Item'
import ItemAll from './ItemAll'
import * as Limit from 'app/constants/Limit.js'

// yezi
// import * as accountActions from 'app/actions/account.action'
import * as wlmxActions from 'app/redux/Mxb/WlMxb/wlMxb.action'

@immutableRenderDecorator
export default
class CardTable extends React.Component {

	render() {
		const {
			dispatch,
			// selectList,
			curCategory,
			detailsTemp,
			issuedate,
			panes,
			wlmxState,
			accountConfState,
			runningCategory,
			curAccountUuid,
			editLrAccountPermission,
			showDrawer
		} = this.props


		const currentPage = wlmxState.get('currentPage')
		const pageCount = wlmxState.get('pageCount')

		const allHappenIncomeAmount = wlmxState.getIn(['flags', 'allHappenIncomeAmount'])
		const allHappenExpenseAmount = wlmxState.getIn(['flags', 'allHappenExpenseAmount'])
		const allPaymentIncomeAmount = wlmxState.getIn(['flags', 'allPaymentIncomeAmount'])
		const allPaymentExpenseAmount = wlmxState.getIn(['flags', 'allPaymentExpenseAmount'])
		const allBalanceAmount = wlmxState.getIn(['flags', 'allBalanceAmount'])
		const direction = wlmxState.getIn(['flags', 'direction'])


		const wlRelate = wlmxState.getIn(['flags', 'wlRelate'])
		const wlType = wlmxState.getIn(['flags', 'wlType'])
		const typeUuid = wlmxState.getIn(['flags', 'typeUuid'])
		const endissuedate = wlmxState.getIn(['flags', 'endissuedate'])
		const cardUuid = wlmxState.getIn(['flags', 'curCardUuid'])
		const categoryUuid = wlmxState.getIn(['flags', 'categoryUuid'])
		const propertyCost = wlmxState.getIn(['flags', 'propertyCost'])
		const wlmxStyle = wlRelate === '' || wlRelate === '3' ? 'wlmxb-table-left' : 'wlmxb-table-left-small'

		return (
			<TableAll  className={wlmxStyle}>
				{
					wlRelate === '' || wlRelate === '3' ?
					<WlTitlePR
						className={"amountwlmx-table-width"}
						wlRelate={wlRelate}
					/> :
					<WlTitleAll
						className={"amountwlmx-table-width-all"}
						wlRelate={wlRelate}
					/>
				}

				<TableBody>
					{
						wlRelate === '' || wlRelate === '3' ?
						(detailsTemp || []).map((v, i) =>
							<Item
								idx={i+1}
								key={i}
								mxitem={v}
								issuedate={issuedate}
								dispatch={dispatch}
								panes={panes}
								uuidList={detailsTemp.filter((v,i) => i>0 ? v.get('uuid') !== detailsTemp.getIn([i-1,'uuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值')}
								className={"amountwlmx-table-width"}
								editLrAccountPermission={editLrAccountPermission}
								showDrawer={showDrawer}
							/>
						) :
						(detailsTemp || []).map((v, i) =>
							<ItemAll
								idx={i+1}
								key={i}
								mxitem={v}
								issuedate={issuedate}
								dispatch={dispatch}
								panes={panes}
								uuidList={detailsTemp.filter((v,i) => i>0 ? v.get('uuid') !== detailsTemp.getIn([i-1,'uuid']) && v.get('runningAbstract')!=='期初值' : v.get('runningAbstract')!=='期初值')}
								className={"amountwlmx-table-width-all"}
								wlRelate={wlRelate}
								editLrAccountPermission={editLrAccountPermission}
								showDrawer={showDrawer}
							/>
						)
					}

					{
						wlRelate === '' || wlRelate === '3' ?
						<TableItem className={'amountwlmx-table-width amountwlmx-table-hj'} line={detailsTemp.size ? detailsTemp.size + 1 : 1}>
							<li></li>
							<li></li>
							<li>合计</li>
							<TableOver className="amountwlmx-title-cell">
								<div className="amountwlmx-item-second-footer">
									<Amount>{allHappenIncomeAmount}</Amount>
									<Amount>{allHappenExpenseAmount}</Amount>
								</div>
							</TableOver>
							<TableOver className="amountwlmx-title-cell">
								<div className="amountwlmx-item-second-footer">
									<Amount>{allPaymentIncomeAmount}</Amount>
									<Amount>{allPaymentExpenseAmount}</Amount>
								</div>
							</TableOver>
							<li>{direction}</li>
							<li>
								<div className="wlmx-amount-center">
								<Amount>{allBalanceAmount}</Amount>
								</div>
							</li>
						</TableItem> :
						<TableItem className={'amountwlmx-table-width-all amountwlmx-table-hj'}  line={detailsTemp.size ? detailsTemp.size + 1 : 1}>
							<li></li>
							<li></li>
							<li>合计</li>
							<TableOver>
								<div className="wlmx-amount-center">
									<Amount>{wlRelate == '2' ? allHappenIncomeAmount : allHappenExpenseAmount}</Amount>
								</div>
							</TableOver>
							<TableOver>
								<div className="wlmx-amount-center">
									<Amount>{wlRelate == '2' ? allPaymentIncomeAmount : allPaymentExpenseAmount}</Amount>
								</div>
							</TableOver>
							<TableOver>
								<div className="wlmx-amount-center">
									<Amount>{allBalanceAmount}</Amount>
								</div>
							</TableOver>

						</TableItem>
					}

				</TableBody>
				<TablePagination
					currentPage={currentPage}
					pageCount={pageCount}
					paginationCallBack={(value) => dispatch(wlmxActions.getDetailList(issuedate, endissuedate,cardUuid,categoryUuid,propertyCost,value))}
				/>
			</TableAll>
		)
	}
}
