import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import VoucherTitle from './VoucherTitle.jsx'
import VoucherBody from './VoucherBody.jsx'
import VoucherBottom from './VoucherBottom.jsx'


@immutableRenderDecorator
export default
class Voucher extends React.Component {

	render() {
		const {
			vcIndex,
			year,
			month,
			jvList,
			vcDate,
			amountDisplay,
			allAssList,
			focusRef,
			closedBy,
			reviewedBy,
			dispatch,
			createdBy,
			modifiedTime,
			createdTime,
			debitTotal,
			creditTotal,
			selectAcList,
			assDropListFull,
			currencyList,
			currencyDisplay,
			showAssDisableInfo,
			disabledDate,
			enclosureCountUser,
			unitDecimalCount
		} = this.props




		return (

			<div className="voucher-wrap">
				{/* <div className={`voucher ${amountDisplay ? '' : 'voucher-amount'}`}> */}
				<div className={`voucher ${amountDisplay&&currencyDisplay ? 'voucher-amount-currency' : (amountDisplay || currencyDisplay ? 'voucher-amount' : '')}`}>
					<VoucherTitle
						vcDate={vcDate}
						year={year}
						month={month}
						vcIndex={vcIndex}
						closedBy={closedBy}
						reviewedBy={reviewedBy}
						dispatch={dispatch}
						disabledDate={disabledDate}
						enclosureCountUser={enclosureCountUser}
					/>
	                <VoucherBody
						vcDate={vcDate}
						jvList={jvList}
						amountDisplay={amountDisplay}
						allAssList={allAssList}
						closedBy={closedBy}
						reviewedBy={reviewedBy}
						dispatch={dispatch}
						focusRef={focusRef}
						selectAcList={selectAcList}
						debitTotal={debitTotal}
						creditTotal={creditTotal}
						assDropListFull={assDropListFull}
						currencyList={currencyList}
						currencyDisplay={currencyDisplay}
						showAssDisableInfo={showAssDisableInfo}
						unitDecimalCount={unitDecimalCount}
					/>
	                <VoucherBottom
						createdBy={createdBy}
						modifiedTime={modifiedTime}
						createdTime={createdTime}
					/>
				</div>
			</div>
		)
	}
}
