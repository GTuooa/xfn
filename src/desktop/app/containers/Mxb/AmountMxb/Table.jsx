import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action.js'

import JvItem from './JvItem.jsx'
import JvTitleItem from './JvTitleItem.jsx'
import { Amount, TableBody, TableItem, TableTitle, TableAll, TableOver,TablePagination } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { dispatch, acinfo, ledger, jvlist, vcindexList, issuedate, unitDecimalCount, beSupport ,currentPage,pageCount,paginationCallBack} = this.props

		const acDirection = ledger.get('direction') === 'debit' ? '借' : '贷'

		let openingDirection = '';//期初方向
		if(ledger.get('openingDirection')=='debit'){
			openingDirection='借'
		}else if(ledger.get('openingDirection')=='credit'){
			openingDirection='贷'
		}else if(ledger.get('openingDirection')=='平'){
			openingDirection='平'
		}

		let closingDirection = '';//期末方向
		if(ledger.get('closingDirection')=='debit'){
			closingDirection='借'
		}else if(ledger.get('closingDirection')=='credit'){
			closingDirection='贷'
		}else if(ledger.get('closingDirection')=='平'){
			closingDirection='平'
		}
		return (
			<TableAll shadowTop="58px" type="amount-mxb">
				<div className="amountmxb-table-title">
					{beSupport?'辅助对象：':'科目：'} {acinfo}
				</div>
				<JvTitleItem className="amountmxb-table-width"/>
				<TableBody>
					<TableItem className="amountmxb-table-width amountmxb-item-width">
						<li></li>
						<li></li>
						<TableOver textAlign="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期初余额</TableOver>
						<li className="amountmxb-title-cell">
							<div className="amountmxb-item-second-one">
								{/* 借方发生额 数量 单价 金额 */}
								<span></span>
								<span></span>
								<span></span>
							</div>
						</li>
						<li className="amountmxb-title-cell">
							<div className="amountmxb-item-second-one">
								{/* 贷方发生额 数量 单价 金额 */}
								<span></span>
								<span></span>
								<span></span>
							</div>
						</li>
						<li className="amountmxb-title-cell">
							<div className="amountmxb-item-second-two">
								{/* 余额 方向 数量 单价 金额 */}
								<span>{openingDirection}</span>
								<span><Amount decimalPlaces={unitDecimalCount}>{ledger.get('begincount')}</Amount></span>
								<span><Amount>{ledger.get('openingprice')}</Amount></span>
								<span><Amount>{ledger.get('openingbalance')}</Amount></span>
							</div>
						</li>
					</TableItem>
					{(jvlist || []).map((v, i) =>
						<JvItem
							className="amountmxb-table-width amountmxb-item-width"
							idx={i}
							key={i}
							jvitem={v}
							issuedate={issuedate}
							dispatch={dispatch}
							vcindexList={vcindexList}
							acDirection={acDirection}
							unitDecimalCount={unitDecimalCount}
						/>
					)}
					<TableItem className="amountmxb-table-width amountmxb-item-width" line={jvlist.size ? jvlist.size : 2}>
						<li></li>
						<li></li>
						<TableOver textAlign="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本期合计</TableOver>
						<li className="amountmxb-title-cell">
							<div className="amountmxb-item-second-one">
								{/* 借方发生额 数量 单价 金额 */}
								<span><Amount decimalPlaces={unitDecimalCount}>{ledger.get('debitcount')}</Amount></span>
								<span><Amount>{ledger.get('debitprice')}</Amount></span>
								<span><Amount>{ledger.get('debit')}</Amount></span>
							</div>
						</li>
						<li className="amountmxb-title-cell">
							<div className="amountmxb-item-second-one">
								{/* 贷方发生额 数量 单价 金额 */}
								<span><Amount decimalPlaces={unitDecimalCount}>{ledger.get('creditcount')}</Amount></span>
								<span><Amount>{ledger.get('creditprice')}</Amount></span>
								<span><Amount>{ledger.get('credit')}</Amount></span>
							</div>
						</li>
						<li className="amountmxb-title-cell">
							<div className="amountmxb-item-second-two">
								{/* 余额 方向 数量 单价 金额 */}
								<span>{closingDirection}</span>
								<span><Amount decimalPlaces={unitDecimalCount}>{ledger.get('closingcount')}</Amount></span>
								<span><Amount>{ledger.get('closeingprice')}</Amount></span>
								<span><Amount>{ledger.get('closingbalance')}</Amount></span>
							</div>
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
