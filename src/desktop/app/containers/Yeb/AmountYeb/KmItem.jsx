import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as AmyebActions from 'app/redux/Yeb/AmountYeb/amountYeb.action.js'
import * as AmmxbActions from 'app/redux/Mxb/AmountMxb/amountMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { toJS } from 'immutable'
import {  Icon } from 'antd'
import { Amount, Price, TableItem, TableOver } from 'app/components'

@immutableRenderDecorator
export default
class KmItem extends React.Component {

	render() {

		const {
			kmitem,
			idx,
			dispatch,
			issuedate,
			amountYebChildShow,
			chooseperiods,
			endissuedate,
			isShow,
			className,
			idShow,
			nameShow,
			line,
			showArrow,
			arrowType,
			type,
			unitDecimalCount,
		} = this.props

		const openingbalance = kmitem.get('openingbalance') || ''
		const closingbalance = kmitem.get('closingbalance') || ''
		let openingDiretion = '';//期初方向
		if(kmitem.get('openingDiretion')=='debit'){
			openingDiretion='借'
		}else if(kmitem.get('openingDiretion')=='credit'){
			openingDiretion='贷'
		}else if(kmitem.get('openingDiretion')=='平'){
			openingDiretion='平'
		}

		let closingDirection = '';//期末方向
		if(kmitem.get('closingDirection')=='debit'){
			closingDirection='借'
		}else if(kmitem.get('closingDirection')=='credit'){
			closingDirection='贷'
		}else if(kmitem.get('closingDirection')=='平'){
			closingDirection='平'
		}

		return (
			<TableItem line={line} className={className}>
				<li
					className="ammountyeb-table-one"
					isLink={true}
					onClick={() => showArrow && dispatch(AmyebActions.changeAmountYebChildShow(kmitem.get('acid')))}
					>
					{/* <span>{kmitem.get('acid')}</span> */}
					<span>{idShow}</span>
					{
						showArrow ?
						<Icon
							className="ammountyeb-table-one-icon"
							type={arrowType}
						/>
						: ''
					}
				</li>
				<li className="ammountyeb-table-two">
					<span
						style={{textIndent: type === 'assid' ? '1em' : ''}}
						onClick={() => {
							sessionStorage.setItem('previousPage', 'kmyeb')
							!dispatch(AmmxbActions.getMxbAclistFetch(issuedate, endissuedate, kmitem.get('acid'), kmitem.get('asscategory'), kmitem.get('assid'), chooseperiods)) &&
							// dispatch(homeActions.addTabpane('AmountMxb'))
							dispatch(homeActions.addPageTabPane('MxbPanes', 'AmountMxb', 'AmountMxb', '数量明细表'))
							dispatch(homeActions.addHomeTabpane('Mxb', 'AmountMxb','数量明细表'))
						}}
					>
						{nameShow}
					</span>
				</li>

				<li className="ammountyeb-table-three">
					<span>{kmitem.get('acunit')}</span>
				</li>

				<li className="ammountyeb-table-four">
					<div className="ammountyeb-table-title-item">
						<span>{openingDiretion}</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount decimalPlaces={unitDecimalCount}>
								{kmitem.get('beginCount')==0?'':kmitem.get('beginCount')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('openingPrice')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('openingbalance')==0?'':kmitem.get('openingbalance')}
							</Amount>
						</span>
					</div>
				</li>
				<li className="ammountyeb-table-five">
					<div className="ammountyeb-table-title-item">
						<span className="ammountyeb-table-title-item-align-right">
							<Amount decimalPlaces={unitDecimalCount}>
								{kmitem.get('debitCount')==0?'':kmitem.get('debitCount')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('debit')==0?'':kmitem.get('debit')}
							</Amount>
						</span>
					</div>
				</li>
				<li className="ammountyeb-table-six">
					<div className="ammountyeb-table-title-item">
						<span className="ammountyeb-table-title-item-align-right">
							<Amount decimalPlaces={unitDecimalCount}>
								{kmitem.get('creditCount')==0?'':kmitem.get('creditCount')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('credit')==0?'':kmitem.get('credit')}
							</Amount>
						</span>
					</div>
				</li>
				{
					isShow ?
					<li className="ammountyeb-table-seven" >
						<div className="ammountyeb-table-title-item">
							<span className="ammountyeb-table-title-item-align-right">
								<Amount decimalPlaces={unitDecimalCount}>
									{kmitem.get('debitSumCount')==0?'':kmitem.get('debitSumCount')}
								</Amount>
							</span>
							<span className="ammountyeb-table-title-item-align-right">
								<Amount>
									{kmitem.get('debitSum')==0?'':kmitem.get('debitSum')}
								</Amount>
							</span>
						</div>
					</li> :
					<li className="ammountyeb-table-show">....</li>

				}
				{
					isShow ?
					<li className="ammountyeb-table-eight">
						<div className="ammountyeb-table-title-item">
							<span className="ammountyeb-table-title-item-align-right">
								<Amount decimalPlaces={unitDecimalCount}>
									{kmitem.get('creditSumCount')==0?'':kmitem.get('creditSumCount')}
								</Amount>
							</span>
							<span className="ammountyeb-table-title-item-align-right">
								<Amount>
									{kmitem.get('creditSum')==0?'':kmitem.get('creditSum')}
								</Amount>
							</span>
						</div>
					</li> : ''
				}

				<li className="ammountyeb-table-nine">
					<div className="ammountyeb-table-title-item">
						<span>{closingDirection}</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount decimalPlaces={unitDecimalCount}>
								{kmitem.get('closingCount')==0?'':kmitem.get('closingCount')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('closingPrice')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('closingbalance')==0?'':kmitem.get('closingbalance')}
							</Amount>
						</span>
					</div>
				</li>
			</TableItem>
		)
	}
}
