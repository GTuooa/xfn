import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import * as currencyMxbActions from 'app/redux/Mxb/CurrencyMxb/currencyMxb.action.js'
import * as currencyYebActions from 'app/redux/Yeb/CurrencyYeb/currencyYeb.action.js'

@immutableRenderDecorator
export default
class Item extends React.Component {

	render() {
		const {
			key,
			idx,
			item,
            dispatch,
			issuedate,
			endissuedate,
			history,
			style,
			level,
			hasSub,
			isExpanded,
		} = this.props

		return (
			<div className="item"
				line={idx + 1}
				style={style}
				>
				{level===1?
					<div >
						<span
							className="item-number" 
							onClick={() => {
								sessionStorage.setItem('previousPage', 'currencyYeb')
								dispatch(currencyMxbActions.getCurrencyMxbAcListFetch(item.get('fcNumber'), issuedate, endissuedate,item.get('acid'),item.get('acName')))
								history.push('/currencymxb')
							}}
						>
							<span>{`${item.get('fcNumber')}_${item.get('numberName')}`}</span>
						</span>
						<span className='btn' onClick={() => hasSub && dispatch(currencyYebActions.showCurrencyBaChildItiem(item.get('fcNumber')))}>
							<Icon
								type='arrow-down'
								style={{visibility: hasSub ? 'visible' : 'hidden', transform: isExpanded ? 'rotate(180deg)' : ''}}
							/>
						</span>
					</div>
					:
					<div >
						<span
							className="item-number" 
							onClick={() => {
								sessionStorage.setItem('previousPage', 'currencyYeb')
								dispatch(currencyMxbActions.getCurrencyMxbAcListFetch(item.get('fcNumber'), issuedate, endissuedate,item.get('acid'),item.get('acName')))
								history.push('/currencymxb')
							}}
						>
							<span>{`${item.get('acid')}_${item.get('acName')}`}</span>
						</span>
						<span className='btn' onClick={() => hasSub && dispatch(currencyYebActions.showCurrencyBaChildItiem(item.get('acid')))}>
							<Icon
								type='arrow-down'
								style={{visibility: hasSub ? 'visible' : 'hidden', transform: isExpanded ? 'rotate(180deg)' : ''}}
							/>
						</span>
				</div>
				}
				{
					level===1?
					<div onClick={() => hasSub && dispatch(currencyYebActions.showCurrencyBaChildItiem(item.get('fcNumber')))}>
						<div className="item-name" ><span>原币：</span></div>
						<div className="item-amount item-amount-color">
							<Amount  showZero={true}>{item.get('fcDebitOpeningBalance') || -item.get('fcCreditOpeningBalance') || 0}</Amount>
							<Amount  showZero={true}>{item.get('fcDebit')}</Amount>
							<Amount  showZero={true}>{item.get('fcCredit')}</Amount>
							<Amount  showZero={true}>{item.get('fcDebitClosingBalance') || -item.get('fcCreditClosingBalance') || 0}</Amount>
						</div>
						<div className="item-name">本位币：</div>
						<div className="item-amount">
							<Amount  showZero={true}>{item.get('debitOpeningBalance') || -item.get('creditOpeningBalance') || 0}</Amount>
							<Amount  showZero={true}>{item.get('debit')}</Amount>
							<Amount  showZero={true}>{item.get('credit')}</Amount>
							<Amount  showZero={true}>{item.get('debitClosingBalance') || -item.get('creditClosingBalance') || 0}</Amount>
						</div>
					</div>:
					<div  onClick={() => hasSub && dispatch(currencyYebActions.showCurrencyBaChildItiem(item.get('acid')))}>
					<div className="item-name" ><span>原币：</span></div>
					<div className="item-amount item-amount-color">
						<Amount  showZero={true}>{item.get('fcDebitOpeningBalance') || -item.get('fcCreditOpeningBalance') || 0}</Amount>
						<Amount  showZero={true}>{item.get('fcDebit')}</Amount>
						<Amount  showZero={true}>{item.get('fcCredit')}</Amount>
						<Amount  showZero={true}>{item.get('fcDebitClosingBalance') || -item.get('fcCreditClosingBalance') || 0}</Amount>
					</div>
					<div className="item-name">本位币：</div>
					<div className="item-amount">
						<Amount  showZero={true}>{item.get('debitOpeningBalance') || -item.get('creditOpeningBalance') || 0}</Amount>
						<Amount  showZero={true}>{item.get('debit')}</Amount>
						<Amount  showZero={true}>{item.get('credit')}</Amount>
						<Amount  showZero={true}>{item.get('debitClosingBalance') || -item.get('creditClosingBalance') || 0}</Amount>
					</div>
				</div>
				}
			</div>
		)
	}
}
