import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import JvItem from './JvItem.jsx'

import { TableBody, TableItem, TableTitle, TableAll, Amount, TablePagination } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const { dispatch, acinfo, ledger, jvlist, vcindexList, issuedate, currentPage, pageCount, paginationCallBack } = this.props

		const acDirection = ledger.get('direction') === 'debit' ? '借' : '贷'
		const titleList = ['日期', '凭证字号', '摘要', '借方', '贷方', '方向', '余额']

		let initIndex = 0
		return (
			<TableAll shadowTop="31px" type="kmmxb" className="mxb-table-left">
				<div className="mxb-table-title">科目: {acinfo}</div>
				<TableTitle
					titleList={titleList}
					className="mxb-table-width"
				/>
				<TableBody>
					{(jvlist || []).map((v, i) => {
						if (i === 0 && v.get('jvAbstract') === '期初余额') {
							initIndex = - 1
							return <TableItem className="mxb-table-width mxb-table-justify" line={i+1}>
								<li ></li>
								<li></li>
								<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期初余额</li>
								<li></li>
								<li></li>
								<li>{acDirection}</li>
								<li><Amount>{v.get('balanceAmount')}</Amount></li>
							</TableItem>
						} else {
							return (
								<JvItem
									idx={i}
									key={i}
									jvitem={v}
									index={i+1+initIndex}
									totalSize={jvlist ? jvlist.size + initIndex : 0}
									issuedate={issuedate}
									dispatch={dispatch}
									vcindexList={vcindexList}
									acDirection={acDirection}
									className="mxb-table-width mxb-table-justify"
								/>
							)
						}
					})}
					<TableItem className="mxb-table-width mxb-table-justify" line={jvlist.size ? jvlist.size+1 : 2}>
						<li></li>
						<li></li>
						<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本期合计{ledger.get('needDownSize') ? '(仅显示前7500条数据合计)' : ''}</li>
						<li><Amount>{ledger.get('allDebitAmount')}</Amount></li>
						<li><Amount>{ledger.get('allCreditAmount')}</Amount></li>
						<li>{acDirection}</li>
						<li><Amount>{ledger.get('allBalanceAmount')}</Amount></li>
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
