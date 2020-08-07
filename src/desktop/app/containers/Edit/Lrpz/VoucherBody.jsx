import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { chineseAmount } from 'app/utils'
import VoucherBodyTitle from './VoucherBodyTitle.jsx'
import JvItem from './JvItem.jsx'

const voidAmount = ' '.repeat(12).split('')

@immutableRenderDecorator
export default
class VoucherBody extends React.Component {

	convertToStandardAmount(amount) {
		if (amount === '') {
			return voidAmount
		}
		const amountArray = parseFloat(amount).toFixed(2).replace('\.', '').replace('-', '').split('')
		while(amountArray.length < 12)
			amountArray.unshift('')
		return amountArray
	}

	render() {

		const {
			jvList,
			vcDate,
			allAssList,
			closedBy,
			reviewedBy,
			amountDisplay,
			dispatch,
			focusRef,
			selectAcList,
			debitTotal,
			creditTotal,
			assDropListFull,
			currencyList,
			currencyDisplay,
			showAssDisableInfo,
			unitDecimalCount
		 } = this.props

		const convertDebitTotal = this.convertToStandardAmount(debitTotal)
 		const convertCreditTotal = this.convertToStandardAmount(creditTotal)
 		const debitColor = {color: debitTotal.indexOf('-') == 0 ? 'red' : 'black'}
 		const creditColor = {color: creditTotal.indexOf('-') == 0 ? 'red' : 'black'}
		const jvListLength = jvList.size

		return (
			<div className="voucher-body">
				<VoucherBodyTitle
					amountDisplay={amountDisplay}
					currencyDisplay={currencyDisplay}
				/>
				{jvList.map((v, i) =>
					<JvItem
						key={i}
						idx={i}
						jvItem={v}
						vcDate={vcDate}
						dispatch={dispatch}
						jvListLength={jvListLength}
						selectAcList={selectAcList}
						creditAmount={v.get('jvdirection') === 'credit' ? this.convertToStandardAmount(v.get('jvamount')) : voidAmount}
						debitAmount={v.get('jvdirection') === 'debit' ? this.convertToStandardAmount(v.get('jvamount')) : voidAmount}
						focusRef={focusRef}
						allAssList={allAssList}
						closedBy={closedBy}
						reviewedBy={reviewedBy}
						assDropListFull={assDropListFull}
						amountDisplay={amountDisplay}
						currencyList={currencyList}
						currencyDisplay={currencyDisplay}
						showAssDisableInfo={showAssDisableInfo}
						unitDecimalCount={unitDecimalCount}
					/>
				)}
				<div className="voucher-summary">
					<div>合计：{debitTotal === creditTotal ? chineseAmount(debitTotal) : ''}</div>
					<div className="voucher-de">
						<ul className="voucher-amount text-show-wrap text-show-wrap-left">
							{convertDebitTotal.map((v , i) => <li key={i} style={debitColor}>{v}</li>)}
						</ul>
					</div>
					<div className="voucher-cr">
						<ul className="voucher-amount text-show-wrap">
							{convertCreditTotal.map((v , i) => <li key={i} style={creditColor}>{v}</li>)}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}
