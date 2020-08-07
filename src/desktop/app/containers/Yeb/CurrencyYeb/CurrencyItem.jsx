import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as currencyMxbActions from 'app/redux/Mxb/CurrencyMxb/currencyMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as currencyYebActions from 'app/redux/Yeb/CurrencyYeb/currencyYeb.action.js'

import { TableItem, TableOver, ItemTriangle, Amount, Price, Icon } from 'app/components'

@immutableRenderDecorator
export default
class KmItem extends React.Component {

	render() {

		const {
            idx,
            isShow,
            className,
			item,
			dispatch,
			issuedate,
			endissuedate,
			chooseperiods,
			hasChild,
			showChild,
			level,
			currentPage
		} = this.props
		return (
			<TableItem line={idx + 1} className={className}>
				{
					level===1 ?
					<li
					className="currencyYeb-table-one table-item-cur"
					isLink={true}
					onClick={() => {
						sessionStorage.setItem('previousPage', 'currencyYeb')
						dispatch(currencyMxbActions.getFCMxbAclistFetch(issuedate, endissuedate, item.get('fcNumber'),currentPage))
						dispatch(homeActions.addPageTabPane('MxbPanes', 'CurrencyMxb', 'CurrencyMxb', '外币明细表'))
						dispatch(homeActions.addHomeTabpane('Mxb', 'CurrencyMxb', '外币明细表'))
						dispatch(currencyMxbActions.changeFCMxbChooseMorePeriods(chooseperiods))
					}}
					>
						<span>{item.get('fcNumber')}</span>
					</li>
					
					:
					<li
					className="currencyYeb-table-one table-item-cur"
					style={{paddingLeft:'4px'}}
					isLink={true}
					onClick={() => {
						sessionStorage.setItem('previousPage', 'currencyYeb')
						dispatch(currencyMxbActions.getFCMxbAclistFetch(issuedate, endissuedate, item.get('fcNumber'),currentPage,item.get('acid')))
						dispatch(homeActions.addPageTabPane('MxbPanes', 'CurrencyMxb', 'CurrencyMxb', '外币明细表'))
						dispatch(homeActions.addHomeTabpane('Mxb', 'CurrencyMxb', '外币明细表'))
						dispatch(currencyMxbActions.changeFCMxbChooseMorePeriods(chooseperiods))
					}}
					>
						<span>{item.get('acid')}</span>
					</li>
				}
				{
					level===1?
					<li
						className="currencyYeb-table-two table-item-cur"
					>
					<span
						onClick={() => {
							sessionStorage.setItem('previousPage', 'currencyYeb')
							dispatch(currencyMxbActions.getFCMxbAclistFetch(issuedate, endissuedate, item.get('fcNumber'),currentPage))
							dispatch(homeActions.addPageTabPane('MxbPanes', 'CurrencyMxb', 'CurrencyMxb', '外币明细表'))
							dispatch(homeActions.addHomeTabpane('Mxb', 'CurrencyMxb', '外币明细表'))
							dispatch(currencyMxbActions.changeFCMxbChooseMorePeriods(chooseperiods))
						}}
					>{item.get('numberName')}</span> 
					{
						hasChild?
						<Icon type={showChild?"up":"down"}
							style={{marginRight:'4px'}}
							onClick={(e) => {
							e.stopPropagation()
							dispatch(currencyYebActions.showCurrencyChildItiem(item.get('fcNumber')))
						}}/>
						:''
					}
					</li>
					:
					<li
					className="currencyYeb-table-two table-item-cur"
					>
					<span
						onClick={() => {
							sessionStorage.setItem('previousPage', 'currencyYeb')
							dispatch(currencyMxbActions.getFCMxbAclistFetch(issuedate, endissuedate,item.get('fcNumber'),currentPage,item.get('acid')))
							dispatch(homeActions.addPageTabPane('MxbPanes', 'CurrencyMxb', 'CurrencyMxb', '外币明细表'))
							dispatch(homeActions.addHomeTabpane('Mxb', 'CurrencyMxb', '外币明细表'))
							dispatch(currencyMxbActions.changeFCMxbChooseMorePeriods(chooseperiods))
						}}
					>{item.get('acName')}</span> 
					{
						hasChild?
						<Icon type={showChild?"up":"down"}
							style={{marginRight:'4px'}}
							onClick={(e) => {
							e.stopPropagation()
							dispatch(currencyYebActions.showCurrencyChildItiem(item.get('acid')))
						}}/>
						:''
					}
				</li>
				}
				<li className="currencyYeb-table-three">
					<div className="currencyYeb-table-title-item">
						<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('fcDebitOpeningBalance')}</Amount></span>
						<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('debitOpeningBalance')}</Amount></span>
                        <span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('fcCreditOpeningBalance')}</Amount></span>
                        <span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('creditOpeningBalance')}</Amount></span>
					</div>
				</li>
				<li className="currencyYeb-table-four">
					<div className="currencyYeb-table-title-item">
						<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('fcDebit')}</Amount></span>
						<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('debit')}</Amount></span>
                        <span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('fcCredit')}</Amount></span>
                        <span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('credit')}</Amount></span>
					</div>
				</li>
				{
					isShow ?
					<li className="currencyYeb-table-five" >
						<div className="currencyYeb-table-title-item">
							<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('sumFcDebit')}</Amount></span>
							<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('sumDebit')}</Amount></span>
							<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('sumFcCredit')}</Amount></span>
	                        <span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('sumCredit')}</Amount></span>
						</div>
					</li> :
					<li className="currencyYeb-table-show">....</li>

				}

				<li className="currencyYeb-table-six">
					<div className="currencyYeb-table-title-item">
						<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('fcDebitClosingBalance')}</Amount></span>
						<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('debitClosingBalance')}</Amount></span>
						<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('fcCreditClosingBalance')}</Amount></span>
						<span className="currencyYeb-table-title-item-align-right"><Amount>{item.get('creditClosingBalance')}</Amount></span>
					</div>
				</li>
			</TableItem>

		)
	}
}
