import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import { yllsActions } from 'app/redux/Ylls'
import * as wlyebActions from 'app/redux/Yeb/Wlyeb/Wlyeb.action.js'
import * as wlmxbActions from 'app/redux/Mxb/Wlmxb/WlMxb.action.js'

@immutableRenderDecorator
export default
class SingleItem extends React.Component {

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
			wlRelate,
			wlOnlyRelate,
			issuedate,
			endissuedate,
			typeUuid,
			wlType,
			isTop
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
							sessionStorage.setItem("fromPage", "wlyeb")
							if(haveChild){
								dispatch(wlmxbActions.getPeriodDetailList(issuedate,endissuedate,'false',ba.get('uuid'),'',true,history))
							}else{
								dispatch(wlmxbActions.getBusinessDetail(ba,issuedate,endissuedate,typeUuid,wlType,history))
								dispatch(wlmxbActions.getContactsTypeList(issuedate,endissuedate,'true'))
								dispatch(wlmxbActions.getContactsCardList(issuedate,endissuedate,isTop,typeUuid,'',1,true,ba.get('uuid'),`${ba.get('code')} ${ba.get('name')}`))
							}

						}}
						>
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className='name-name'>{ba.get('code') ? `${ba.get('code')}_${ba.get('name')}` : ba.get('name')}</span>
					</span>
					<span className='btn' onClick={() => dispatch(wlyebActions.contactsBalanceTriangleSwitch(showChild, ba.get('uuid')))}>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='ba-info'>
					<Amount showZero={true}>
						{
							wlRelate == '2' || wlOnlyRelate == '2' ? ba.get('beginIncomeAmount') : ba.get('beginExpenseAmount')
						}
					</Amount>
					<Amount showZero={true}>
						{
							wlRelate == '2' || wlOnlyRelate == '2' ? ba.get('happenIncomeAmount') : ba.get('happenExpenseAmount')
						}
					</Amount>
					<Amount showZero={true}>
						{
							wlRelate == '2' || wlOnlyRelate == '2' ? ba.get('paymentIncomeAmount') : ba.get('paymentExpenseAmount')
						}
					</Amount>
					<Amount showZero={true}>
						{
							wlRelate == '2' || wlOnlyRelate == '2' ? ba.get('balanceIncomeAmount') : ba.get('balanceExpenseAmount')
						}
					</Amount>
				</div>
			</div>
		)
	}
}
