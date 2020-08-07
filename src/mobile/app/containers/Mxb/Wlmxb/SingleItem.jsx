import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import { yllsActions } from 'app/redux/Ylls'
import * as wlyebActions from 'app/redux/Yeb/Wlyeb/Wlyeb.action.js'

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
			ylDataList
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
		let idx = 0
		ylDataList.forEach((v,i) =>{
			if(v.get('uuid') === ba.get('uuid')){
				idx = v.get('idx')
			}
		})
		const cardAbstract = ba.get('cardAbstract') ? ba.get('cardAbstract') : ''
		const runningAbstract = `${ba.get('runningAbstract')}${cardAbstract}`

		return (
			<div className={'ba' + ' ' + className} style={style}>
				<div>
					<span
						className='name'
						onClick={(e) => {
							sessionStorage.setItem("ylPage", "wlmxb")
							dispatch(yllsActions.getYllsSingleAccount(history,0, ba.get('uuid'), idx, true))
						}}
						>
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className='name-name'>{`${ba.get('runningDate')}_${runningAbstract}`}</span>
					</span>
					<span className='btn' onClick={() => dispatch(wlyebActions.contactsBalanceTriangleSwitch(showChild, ba.get('uuid')))}>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='ba-info'>
					<span className="ba-info-items">
						<span className="item-direction">
							{ba.get('happenIncomeAmount') !== 0 ? '应收' : ba.get('happenExpenseAmount') !== 0 ? '应付' : ''}
						</span>
						<Amount showZero={false} className="item-amount">
							{
								ba.get('happenIncomeAmount') !== 0 ? ba.get('happenIncomeAmount') : ba.get('happenExpenseAmount') !== 0 ? ba.get('happenExpenseAmount') : ''
							}
						</Amount>
					</span>
					<span className="ba-info-items">
						<span className="item-direction">
							{ba.get('paymentIncomeAmount') !== 0 ? '实收' : ba.get('paymentExpenseAmount') !== 0 ? '实付' : ''}
						</span>
						<Amount showZero={false} className="item-amount">
							{
								ba.get('paymentIncomeAmount') !== 0 ? ba.get('paymentIncomeAmount') : ba.get('paymentExpenseAmount') !== 0 ? ba.get('paymentExpenseAmount') : ''
							}
						</Amount>
					</span>
					<span className="ba-info-items">
						<Amount showZero={false} className="item-amount">
							{
								ba.get('balanceAmount')
							}
						</Amount>
					</span>
				</div>
			</div>
		)
	}
}
