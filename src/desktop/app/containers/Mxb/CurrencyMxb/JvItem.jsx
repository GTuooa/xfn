import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import { Amount, TableItem, TableOver, Price } from 'app/components'

@immutableRenderDecorator
export default
class JvItem extends React.Component {

	render() {
		const {
			idx,
			jvItem,
			issuedate,
			dispatch,
			vcindexList,
			fcDirection,
			className
		} = this.props

		return (
			<TableItem className="currencyMxb-table-width currencyMxb-item-width" line={idx}>
				<li>{jvItem.get('vcdate')}</li>
				<TableOver isLink={true}
					onClick={() => {
						dispatch(lrpzActions.getPzVcFetch(jvItem.get('vcdate').substr(0, 7), jvItem.get('vcindex'), vcindexList.findIndex(v => v == [jvItem.get('vcdate'), jvItem.get('vcindex')].join('_')), vcindexList))
						dispatch(allActions.showPzBomb(true,'CurrencyMxb'))
					}}
					>
					记 {jvItem.get('vcindex')} 号
				</TableOver>
				<TableOver textAlign="left">{jvItem.get('jvabstract')}</TableOver>
				<li><Price>{jvItem.get('exchange')}</Price></li>
				<li className="currencyMxb-title-cell">
					<div className="currencyMxb-item-second-one">
						{/* 借方 原币 本位币 */}
						<span><Amount>{jvItem.get('jvdirection') === 'debit' ?  jvItem.get('standardAmount'): ''}</Amount></span>
						<span><Amount>{jvItem.get('jvdirection') === 'debit' ? jvItem.get('jvamount') : ''}</Amount></span>
					</div>
				</li>
				<li className="currencyMxb-title-cell">
					<div className="currencyMxb-item-second-one">
						{/* 贷方 原币 本位币 */}
						<span><Amount>{jvItem.get('jvdirection') === 'credit' ?  jvItem.get('standardAmount'): ''}</Amount></span>
						<span><Amount>{jvItem.get('jvdirection') === 'credit' ?  jvItem.get('jvamount'): ''}</Amount></span>
					</div>
				</li>
				<li className="currencyMxb-title-cell">
					<div className="currencyMxb-item-second-two">
						{/* 余额 方向 原币 本位币 */}
						<span>{fcDirection ? '借' : '贷'}</span>
						<span><Amount>{fcDirection ? jvItem.get('fcBalance') : -jvItem.get('fcBalance')}</Amount></span>
						<span><Amount>{fcDirection ? jvItem.get('balance') : -jvItem.get('balance')}</Amount></span>
					</div>
				</li>
			</TableItem>

		)
	}
}
