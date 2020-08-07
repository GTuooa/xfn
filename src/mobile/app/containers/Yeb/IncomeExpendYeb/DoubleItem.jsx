import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon } from 'app/components'
import { yllsActions } from 'app/redux/Ylls'
import * as incomeExpendYebActions from 'app/redux/Yeb/IncomeExpendYeb/incomeExpendYeb.action.js'
import * as incomeExpendMxbActions from 'app/redux/Mxb/IncomeExpendMxb/incomeExpendMxb.action.js'

import TableAmount from 'app/containers/components/Table/TableAmount'

@immutableRenderDecorator
export default
class DoubleItem extends React.Component {

	render() {
		const {
			ba,
			style,
			dispatch,
			className,
			leve,
			haveChild,
			showChild,
			history,
			issuedate,
			endissuedate,
			chooseValue,
		} = this.props
		const articlePaddingLeft = (leve - 1) / 100 * 10 + 'rem'

		const flagColor = {
			1: '#fff',
			2: '#D1C0A5',
			3: '#7E6B5A',
			4: '#59493f'
		}[leve]

		const flagstyle = {
			background: flagColor,
			minWidth: articlePaddingLeft
		}

		return (
			<div className={'ba' + ' ' + className} style={style}>
				<div>
					<span className='name' >
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span
						className='name-name'
						onClick={(e) => {
							sessionStorage.setItem("fromPage", "incomeExpendyeb")
							dispatch(incomeExpendMxbActions.getIncomeExpendMxbListFromIncomeExpendYeb(issuedate,endissuedate,ba.get('jrCategoryUuid'),ba.get('completeName'),history))
							dispatch(incomeExpendMxbActions.changeIncomeExpendMxbChooseValue(chooseValue))
						}}
						>{ba.get('name')}</span>
					</span>
					<span className='btn' onClick={() =>  dispatch(incomeExpendYebActions.incomeExpendBalanceTriangleSwitch(showChild, ba.get('jrCategoryUuid')))}>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='double-ba-info'>
					<span className="double-item-list">
						<TableAmount direction={'credit'}>{ba.get('openARBalance')}</TableAmount>
						<TableAmount direction={'debit'}>{ba.get('openAPBalance')}</TableAmount>
					</span>
					<span className="double-item-list">
						<TableAmount direction={'credit'}>{ba.get('incomeAmount')}</TableAmount>
						<TableAmount direction={'debit'}>{ba.get('expenseAmount')}</TableAmount>
					</span>
					<span className="double-item-list">
						<TableAmount direction={'credit'}>{ba.get('realIncomeAmount')}</TableAmount>
						<TableAmount direction={'debit'}>{ba.get('realExpenseAmount')}</TableAmount>
					</span>
					<span className="double-item-list">
						<TableAmount direction={'credit'}>{ba.get('closeARBalance')}</TableAmount>
						<TableAmount direction={'debit'}>{ba.get('closeAPBalance')}</TableAmount>
					</span>
				</div>
			</div>
		)
	}
}
