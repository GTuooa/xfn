import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import { yllsActions } from 'app/redux/Ylls'
import * as zhmxbActions from 'app/redux/Mxb/Zhmxb/zhmxb.action.js'
import moment from 'moment'

@immutableRenderDecorator
export default
class Ba extends React.Component {

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
							sessionStorage.setItem("ylPage", "zhmxb")
							dispatch(yllsActions.getYllsSingleAccount(history,0, ba.get('uuid'), idx, true))
						}}
						>
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className='name-name'>{`${ba.get('runningDate')}_${runningAbstract}`}</span>
					</span>
					<span className='btn' onClick={() => dispatch(zhmxbActions.accountDetailTriangleSwitch(showChild, ba.get('uuid')))}>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='ba-info'>
					<span className="ba-type-name">{ba.get('runningIndex') > 0 ? ba.get('flowNumber')+'_'+ba.get('runningIndex') : ba.get('flowNumber')}</span>
					<span>{ba.get('incomeAmount') === 0 ? '付款' : '收款' }</span>
					<Amount showZero={true}>{ba.get('incomeAmount') === 0 ? ba.get('expenseAmount') : ba.get('incomeAmount')}</Amount>
					<Amount showZero={true}>{ba.get('balanceAmount')}</Amount>
				</div>
			</div>
		)
	}
}
