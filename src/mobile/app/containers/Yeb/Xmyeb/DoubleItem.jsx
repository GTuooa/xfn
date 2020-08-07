import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import { yllsActions } from 'app/redux/Ylls'
import * as xmyebActions from 'app/redux/Yeb/Xmyeb/Xmyeb.action.js'
import * as xmmxActions from 'app/redux/Mxb/Xmmxb/xmMxb.action.js'

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
			isTop,
			xmType,
			runningType,
			categoryUuid,
			runningCategoryUuid,
			propertyCost
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
					<span
						className='name'
						onClick={(e) => {
							sessionStorage.setItem("fromPage", "xmyeb")
							dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'categoryName'],runningType))
							if(haveChild){
								dispatch(xmmxActions.getFirstProjectDetailList(issuedate,endissuedate,1,'DETAIL_AMOUNT_TYPE_HAPPEN',ba.get('uuid'),'','false',runningCategoryUuid,propertyCost,'',history,true))
							}else{
								dispatch(xmmxActions.getFirstProjectDetailList(issuedate,endissuedate,1,'DETAIL_AMOUNT_TYPE_HAPPEN',categoryUuid,ba.get('uuid'),isTop,runningCategoryUuid,propertyCost,`${ba.get('code')} ${ba.get('name')}`,history,true))
							}
							dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'xmType'], xmType))

						}}
						>
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className='name-name'>{ba.get('code') ? `${ba.get('code')}_${ba.get('name')}` : ba.get('name')}</span>
					</span>
					<span className='btn' onClick={() =>  dispatch(xmyebActions.accountBalanceTriangleSwitch(showChild, ba.get('uuid')))}>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='double-ba-info'>
					<span className="double-item-list">
						<Amount showZero={true}>{ba.get('incomeAmount')}</Amount>
						<Amount showZero={true}>{ba.get('realIncomeAmount')}</Amount>
					</span>
					<span className="double-item-list">
						<Amount showZero={true}>{ba.get('expenseAmount')}</Amount>
						<Amount showZero={true}>{ba.get('realExpenseAmount')}</Amount>
					</span>
					<span className="double-item-list">
						<Amount showZero={true}>{ba.get('balanceAmount')}</Amount>
						<Amount showZero={true}>{ba.get('realBalanceAmount')}</Amount>
					</span>
				</div>
			</div>
		)
	}
}
