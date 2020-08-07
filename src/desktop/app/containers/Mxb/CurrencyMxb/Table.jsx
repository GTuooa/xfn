import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action.js'

import JvItem from './JvItem.jsx'
import JvTitleItem from './JvTitleItem.jsx'
import { Switch } from 'antd'
import { Amount, TableBody, TableItem, TableTitle, TableAll, TableOver ,TablePagination} from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {
	constructor() {
		super()
		this.state = {fcDirection: true}
	}
	render() {
		const {
			dispatch,
			jvList,
			vcindexList,
			issuedate,
			currencyDetailList,
			currentPage,
			pageCount,
			paginationCallBack
		} = this.props
		const { fcDirection } = this.state

		return (
			<TableAll type="max-mxb" shadowTwo={true}>
				<JvTitleItem className="currencyMxb-table-width"/>
				<TableBody>
					<TableItem className="currencyMxb-table-width currencyMxb-item-width">
						<li></li>
						<li></li>
						<TableOver textAlign="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期初余额</TableOver>
						<li></li>
						<li className="currencyMxb-title-cell">
							<div className="currencyMxb-item-second-one">
								{/* 借方 原币 本位币 */}
								<span></span>
								<span></span>
							</div>
						</li>
						<li className="currencyMxb-title-cell">
							<div className="currencyMxb-item-second-one">
								{/* 贷方 原币 本位币 */}
								<span></span>
								<span></span>
							</div>
						</li>
						<li className="currencyMxb-title-cell">
							<div className="currencyMxb-item-second-two">
								{/* 余额 方向 原币 本位币 */}
								<span>
									<Switch
										className="use-unuse-style lend-bg"
										checked={!fcDirection}
										checkedChildren="贷"
										unCheckedChildren="借"
										style={{width: 43}}
										onChange={() => this.setState({fcDirection: !fcDirection})}
									/>
								</span>
								<span><Amount>{fcDirection ? currencyDetailList.get('fcOpeningBalance') : -currencyDetailList.get('fcOpeningBalance')}</Amount></span>
								<span><Amount>{fcDirection ? currencyDetailList.get('openingBalance') : -currencyDetailList.get('openingBalance')}</Amount></span>
							</div>
						</li>
					</TableItem>
					{(jvList || []).map((v, i) =>
						<JvItem
							className="currencyMxb-table-width currencyMxb-item-width"
							idx={i}
							key={i}
							jvItem={v}
							issuedate={issuedate}
							dispatch={dispatch}
							vcindexList={vcindexList}
							fcDirection={fcDirection}
						/>
					)}
					<TableItem className="currencyMxb-table-width currencyMxb-item-width" line={jvList&&jvList.size ? jvList.size : 2}>
						<li></li>
						<li></li>
						<TableOver textAlign="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本期合计</TableOver>
						<li></li>
						<li className="currencyMxb-title-cell">
							<div className="currencyMxb-item-second-one">
								{/* 借方 原币 本位币*/}
								<span><Amount>{currencyDetailList.get('fcDebit')}</Amount></span>
								<span><Amount>{currencyDetailList.get('debit')}</Amount></span>
							</div>
						</li>
						<li className="currencyMxb-title-cell">
							<div className="currencyMxb-item-second-one">
								{/* 贷方 原币 本位币 */}
								<span><Amount>{currencyDetailList.get('fcCredit')}</Amount></span>
								<span><Amount>{currencyDetailList.get('credit')}</Amount></span>
							</div>
						</li>
						<li className="currencyMxb-title-cell">
							<div className="currencyMxb-item-second-two">
								{/* 余额 方向 原币 本位币*/}
								<span>{fcDirection ? '借' : '贷'}</span>
								<span><Amount>{fcDirection ? currencyDetailList.get('fcClosingBalance') : -currencyDetailList.get('fcClosingBalance')}</Amount></span>
								<span><Amount>{fcDirection ? currencyDetailList.get('closingBalance') : -currencyDetailList.get('closingBalance')}</Amount></span>
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
