import React, { PropTypes } from 'react'
import { Map, List,toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import { Amount,TableItem, TableOver } from 'app/components'

@immutableRenderDecorator
export default
class JvItem extends React.Component {

	render() {

		const {
			idx,
			jvitem,
			issuedate,
			vcindexList,
			acDirection,
			dispatch,
			className,
			unitDecimalCount,
		} = this.props

		return (
			<TableItem className={className} line={idx}>
				<li>{jvitem.get('vcdate')}</li>
				<TableOver
					isLink={true}
					onClick={() => {
						dispatch(lrpzActions.getPzVcFetch(jvitem.get('vcdate').substr(0, 7), jvitem.get('vcindex'), vcindexList.findIndex(v => v == [jvitem.get('vcdate'), jvitem.get('vcindex')].join('_')), vcindexList))
						dispatch(allActions.showPzBomb(true,'AmountMxb'))
					}}>
					记 {jvitem.get('vcindex')} 号
				</TableOver>
				<TableOver textAlign="left">{jvitem.get('jvabstract')}</TableOver>
				<li className="amountmxb-title-cell">
					<div className="amountmxb-item-second-one">
						{/* 借方发生额 数量 单价 金额 */}
						<span><Amount decimalPlaces={unitDecimalCount}>{jvitem.get('jvdirection')==='debit'?jvitem.get('jvcount'):''}</Amount></span>
						<span>
							<Amount>{jvitem.get('jvdirection')==='debit'?jvitem.get('price'):''}</Amount>
						</span>
						<span><Amount>{jvitem.get('jvdirection')==='debit'?jvitem.get('jvamount'):''}</Amount></span>
					</div>
				</li>
				<li className="amountmxb-title-cell">
					<div className="amountmxb-item-second-one">
						{/* 贷方发生额 数量 单价 金额 */}
						<span><Amount decimalPlaces={unitDecimalCount}>{jvitem.get('jvdirection')==='credit'?jvitem.get('jvcount'):''}</Amount></span>
						<span>
							<Amount>{jvitem.get('jvdirection')==='credit'?jvitem.get('price'):''}</Amount>
						</span>
						<span><Amount>{jvitem.get('jvdirection')==='credit'?jvitem.get('jvamount'):''}</Amount></span>
					</div>
				</li>
				<li className="amountmxb-title-cell">
					<div className="amountmxb-item-second-two">
						{/* 余额 方向 数量 单价 金额 */}
						<span>{acDirection}</span>
						<span><Amount decimalPlaces={unitDecimalCount}>{jvitem.get('balancecount')}</Amount></span>
						<span><Amount>{jvitem.get('balanceprice')}</Amount></span>
						<span><Amount>{jvitem.get('balance')}</Amount></span>
					</div>
				</li>
			</TableItem>
		)
	}
}
