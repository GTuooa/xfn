import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'

import * as lsyebActions from 'app/redux/Yeb/Lsyeb/Lsyeb.action.js'
import * as lsmxbActions from 'app/redux/Mxb/Lsmxb/lsmxb.action.js'

@immutableRenderDecorator
export default
class Ba extends React.Component {

	render() {
		const {
			ba,
			style,
			hasSub,
			dispatch,
			className,
			issuedate,
			endissuedate,
			leve,
			haveChild,
			showChild,
			history
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
							// 不要阻止冒泡，会导致记住滚动有问题
							e.stopPropagation()
							sessionStorage.setItem("fromPage", "lsyeb")
							dispatch(lsmxbActions.getBusinessDetail(history,ba,issuedate))
						}}
						>
						{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className='name-name'>{ba.get('categoryName')}</span>
					</span>
					<span className="lsye-category-type">{ba.get('propertyName')}</span>
					<span className='btn' onClick={() => dispatch(lsyebActions.accountBalanceTriangleSwitch(showChild, ba.get('categoryUuid')))}>
						<Icon
							type='arrow-down'
							style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='ba-info'>
					<Amount showZero={true}>{ba.get('monthHappenAmount')}</Amount>
					<Amount showZero={true}>{ba.get('monthIncomeAmount')}</Amount>
					<Amount showZero={true}>{ba.get('monthExpenseAmount')}</Amount>
				</div>
			</div>
		)
	}
}
