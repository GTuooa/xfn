import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as AmyebActions from 'app/redux/Yeb/AmountYeb/amountYeb.action.js'
import * as AmmxbActions from 'app/redux/Mxb/AmountMxb/amountMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { toJS } from 'immutable'
import { Amount, Price, TableItem, TableOver, Icon } from 'app/components'

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
			assCategory,
			assTwoCategory,
			assIdTwo,
			assSecondName,
			acId,
			acname,
			assId,
			assName
		} = this.props

		const openingbalance = kmitem.get('openingbalance') || ''
		const closingbalance = kmitem.get('closingbalance') || ''
		let openingDiretion = '';//期初方向
		if(kmitem.get('openingDirection')=='debit'){
			openingDiretion='借'
		}else if(kmitem.get('openingDirection')=='credit'){
			openingDiretion='贷'
		}else if(kmitem.get('openingDirection')=='平'){
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
					onClick={() => showArrow && dispatch(AmyebActions.changeAmountYebKmChildShow(kmitem.get('assId')))}
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
				<li className={type === 'acId'?"ammountyeb-table-two":"ammountyeb-table-one"}>
					<span
						style={{textIndent: type === 'acId' ? '1em' : '',cursor: 'pointer',textDecoration:'underline'}}
						onClick={() => {
							sessionStorage.setItem('previousPage', 'kmyeb')
							dispatch(AmmxbActions.getMxbAsslistFetch(issuedate, endissuedate, assCategory,type === 'acId' ?kmitem.get('acId'):acId,type === 'acId' ?kmitem.get('acFullName'):acname,type === 'acId' ?assId:kmitem.get('assId'),type === 'acId' ?assName:kmitem.get('assName'),assIdTwo,assTwoCategory,assSecondName))
							// dispatch(homeActions.addTabpane('AmountMxb'))
							dispatch(homeActions.addPageTabPane('MxbPanes', 'AmountMxb', 'AmountMxb', '数量明细表'))
							dispatch(homeActions.addHomeTabpane('Mxb', 'AmountMxb','数量明细表'))
						}}
					>
						{nameShow}
					</span>
				</li>

				<li className="ammountyeb-table-three">
					<span>{kmitem.get('unit')}</span>
				</li>

				<li className="ammountyeb-table-four">
					<div className="ammountyeb-table-title-item">
						<span>{openingDiretion}</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount decimalPlaces={unitDecimalCount}>
								{kmitem.get('openingCount')==0?'':kmitem.get('openingCount')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('openingUnitPrice')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('openingPrice')==0?'':kmitem.get('openingPrice')}
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
								{kmitem.get('debitPrice')==0?'':kmitem.get('debitPrice')}
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
								{kmitem.get('creditPrice')==0?'':kmitem.get('creditPrice')}
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
									{kmitem.get('debitSumPrice')==0?'':kmitem.get('debitSumPrice')}
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
									{kmitem.get('creditSumPrice')==0?'':kmitem.get('creditSumPrice')}
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
								{kmitem.get('closingUnitPrice')}
							</Amount>
						</span>
						<span className="ammountyeb-table-title-item-align-right">
							<Amount>
								{kmitem.get('closingPrice')==0?'':kmitem.get('closingPrice')}
							</Amount>
						</span>
					</div>
				</li>
			</TableItem>
		)
	}
}
