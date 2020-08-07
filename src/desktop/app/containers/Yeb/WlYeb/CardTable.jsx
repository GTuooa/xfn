import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS , toJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver, TablePagination } from 'app/components'
import { Tooltip, Icon, Checkbox } from 'antd'
// import TableTitle from './TableTitle'
import WlTitlePR from './WlTitlePR'
import WlTitleAll from './WlTitleAll'
import ItemPR from './ItemPR'
import ItemAll from './ItemAll'
import TitleItem from './TitleItem'
import SingleTitleItem from './SingleTitleItem'
import * as Limit from 'app/constants/Limit.js'
import * as wlyeActions from 'app/redux/Yeb/WlYeb/wlYeb.action'

@immutableRenderDecorator
export default
class CardTable extends React.Component {

	render() {
		const {
			dispatch,
			balanceTemp,
			issuedate,
			wlyeState,
			runningTemp,
			endissuedate,
			allBeginIncomeAmount,
			allBeginExpenseAmount,
			allHappenIncomeAmount,
			allHappenExpenseAmount,
			allPaymentIncomeAmount,
			allPaymentExpenseAmount,
			allBalanceIncomeAmount,
			allBalanceExpenseAmount,
			wlRelate,
			wlOnlyRelate,
			wlType,
			currentPage,
			pageCount,
			runningCount,
			typeUuid,
			isTop
		} = this.props
		const mxbStyle = (wlRelate == '1' || wlRelate == '2' ) || wlOnlyRelate == '1' || wlOnlyRelate == '2' ? 'mxb-table-left-small' : 'mxb-table-left'
		let lineNum = 0
		const runningShowChild = wlyeState.getIn(['flags', 'runningShowChild'])
		let hasChild = false
		const loop = (data, leve, upperArr,isAdd=true) => data && data.map((item, i) => {
			let line =  isAdd ? (++lineNum) : lineNum
			const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
			if (item.get('childList') && item.get('childList').size) {
				hasChild = true
				return (
					<div key={`${item.get('uuid')}${line}`}>
						{
							wlOnlyRelate == '1' || wlOnlyRelate == '2' || wlRelate == '1' || wlRelate == '2'?
							<SingleTitleItem
								leve={leve}
								item={item}
								haveChild={true}
								showChild={showChild}
								line={line}
								upperArr={upperArr}
								dispatch={dispatch}
								issuedate={issuedate}
								endissuedate={endissuedate}
								wlOnlyRelate={wlOnlyRelate}
								wlRelate={wlRelate}
							/> :
							<TitleItem
								leve={leve}
								className="wl-balance-running-tabel-width"
								item={item}
								haveChild={true}
								showChild={showChild}
								line={line}
								upperArr={upperArr}
								dispatch={dispatch}
								issuedate={issuedate}
								endissuedate={endissuedate}
								wlOnlyRelate={wlOnlyRelate}
							/>
						}

						{showChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('categoryUuid')),false) : ''}
					</div>
				)
			} else {
				return (
					<div key={`${item.get('uuid')}${line}`}>
						{
							wlOnlyRelate == '1' || wlOnlyRelate == '2' || wlRelate == '1' || wlRelate == '2'?
							<ItemAll
								className="wl-balance-running-tabel-width-all"
								leve={leve}
								item={item}
								line={line}
								dispatch={dispatch}
								issuedate={issuedate}
								endissuedate={endissuedate}
								isTop={isTop}
								typeUuid={typeUuid}
								wlType={wlType}
								wlOnlyRelate={wlOnlyRelate}
								wlRelate={wlRelate}
							/> :
							<ItemPR
								leve={leve}
								line={line}
								className="wl-balance-running-tabel-width"
								item={item}
								dispatch={dispatch}
								issuedate={issuedate}
								endissuedate={endissuedate}
								isTop={isTop}
								typeUuid={typeUuid}
								wlType={wlType}
							/>
						}

					</div>
				)
			}
		})

		return (
			<TableAll className={`${mxbStyle} wlye-table`} style={{width:'100%'}}>
				{
					wlOnlyRelate == '1' || wlOnlyRelate == '2' ?
					<WlTitleAll className="amountwlye-table-width-all" wlOnlyRelate={wlOnlyRelate}/> :
					(
						wlRelate === '' || wlRelate === '3' ?
						<WlTitlePR className="amountwlye-table-width"/> :
						<WlTitleAll className="amountwlye-table-width-all" wlRelate={wlRelate}/>
					)

				}
				<TableBody>
					{
						wlOnlyRelate == '1' || wlOnlyRelate == '2' || typeUuid !== '' ?
						loop(balanceTemp.get('childList'), 1, fromJS([])) :
						(
							typeUuid !== '' && wlRelate === '' ?
							loop(balanceTemp.get('childList'), 1, fromJS([])) :
								wlRelate === '' || wlRelate === '3'?
								balanceTemp.get('childList').map((item,i) => {
									return <ItemPR
										className="wl-balance-running-tabel-width"
										item={item}
										line={i+1}
										dispatch={dispatch}
										issuedate={issuedate}
										endissuedate={endissuedate}
										isTop={isTop}
										typeUuid={typeUuid}
										wlType={wlType}
									/>
								}) :
								balanceTemp.get('childList').map((item,i) => {
									return <ItemAll
										className="wl-balance-running-tabel-width-all"
										item={item}
										line={i+1}
										wlRelate={wlRelate}
										dispatch={dispatch}
										issuedate={issuedate}
										endissuedate={endissuedate}
										isTop={isTop}
										typeUuid={typeUuid}
										wlType={wlType}
									/>
								})
						)

					}



					{
						wlOnlyRelate == '1' || wlOnlyRelate == '2' ?
						<TableItem className={'amountwlye-table-width-all'} line={balanceTemp.get('childList').size ? balanceTemp.get('childList').size+1:1}>
							<li>合计</li>
							<TableOver textAlign="right"><Amount>{wlOnlyRelate == '2' ? allBeginIncomeAmount : allBeginExpenseAmount}</Amount></TableOver>
							<TableOver textAlign="right"><Amount>{wlOnlyRelate == '2' ? allHappenIncomeAmount : allHappenExpenseAmount}</Amount></TableOver>
							<TableOver textAlign="right"><Amount>{wlOnlyRelate == '2' ? allPaymentIncomeAmount : allPaymentExpenseAmount}</Amount></TableOver>
							<TableOver textAlign="right"><Amount>{wlOnlyRelate == '2' ? allBalanceIncomeAmount : allBalanceExpenseAmount}</Amount></TableOver>

						</TableItem> :
						(
							wlRelate === '' || wlRelate === '3'?
							<TableItem className={'amountwlye-table-width-footer'} line={balanceTemp.get('childList').size ? balanceTemp.get('childList').size+1:1}>
								<li>合计</li>
								<li className="amountwlye-title-cell">
									<div className="amountwlye-item-second-footer">
										<span><Amount>{allBeginIncomeAmount}</Amount></span>
										<span><Amount>{allBeginExpenseAmount}</Amount></span>
									</div>
								</li>
								<li className="amountwlye-title-cell">
									<div className="amountwlye-item-second-footer">
										<span><Amount>{allHappenIncomeAmount}</Amount></span>
										<span><Amount>{allHappenExpenseAmount}</Amount></span>
									</div>
								</li>
								<li className="amountwlye-title-cell">
									<div className="amountwlye-item-second-footer">
										<span><Amount>{allPaymentIncomeAmount}</Amount></span>
										<span><Amount>{allPaymentExpenseAmount}</Amount></span>
									</div>
								</li>
								<li className="amountwlye-title-cell">
									<div className="amountwlye-item-second-footer">
										<span><Amount>{allBalanceIncomeAmount}</Amount></span>
										<span><Amount>{allBalanceExpenseAmount}</Amount></span>
									</div>
								</li>

							</TableItem> :
							<TableItem className={'amountwlye-table-width-all'} line={balanceTemp.get('childList').size ? balanceTemp.get('childList').size+1:1}>
								<li>合计</li>
								<TableOver textAlign="right"><Amount>{wlRelate == '2' ? allBeginIncomeAmount : allBeginExpenseAmount}</Amount></TableOver>
								<TableOver textAlign="right"><Amount>{wlRelate == '2' ? allHappenIncomeAmount : allHappenExpenseAmount}</Amount></TableOver>
								<TableOver textAlign="right"><Amount>{wlRelate == '2' ? allPaymentIncomeAmount : allPaymentExpenseAmount}</Amount></TableOver>
								<TableOver textAlign="right"><Amount>{wlRelate == '2' ? allBalanceIncomeAmount : allBalanceExpenseAmount}</Amount></TableOver>

							</TableItem>
						)

					}




				</TableBody>
				{
					typeUuid !== '' && wlRelate === '' && hasChild ? '' || wlOnlyRelate == '1' || wlOnlyRelate == '2' :
					<TablePagination
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(value) => dispatch(wlyeActions.getContactsBalanceList(issuedate,endissuedate,isTop,typeUuid,wlType,wlRelate,value))}
					/>
				}

			</TableAll>
		)
	}
}
