import React, { PropTypes } from 'react'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import { yllsActions } from 'app/redux/Ylls'
import { Checkbox, Icon, Amount }	from 'app/components'
import { formatNum, formatMoney } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
export default
class Vc extends React.Component {

	render() {
		const {
			className,
			item,
			dispatch,
			history,
			selectedIndex,
			idx,
			categoryName
		} = this.props
		const cardAbstract = item.get('cardAbstract') ? item.get('cardAbstract') : ''
		const runningAbstract = `${item.get('runningAbstract')}${cardAbstract}`
		return (
			<div className={'ba' + ' ' + className}
				onClick={(e) => {
					sessionStorage.setItem("ylPage", "lsmxb")
					dispatch(yllsActions.getYllsSingleAccount(history, selectedIndex, item.get('uuid'), idx, true))
				}}
			>
				<div>
					<span className='name'>
						<span className='name-name'>
							{`${item.get('runningDate')}_${item.get('flowNumber')}_${runningAbstract}`}
						</span>
					</span>
				</div>
				{
					selectedIndex == 1 && categoryName === '全部'?
					<div className='ba-info'>
						<span className="ba-type-name">{Common.runningType[item.get('runningType')]}</span>
						<Amount showZero={true}>{item.get('incomeAmount')}</Amount>
						<Amount showZero={true}>{item.get('expenseAmount')}</Amount>
						<Amount showZero={true}>{item.get('balanceAmount')}</Amount>
					</div>
					:
					selectedIndex == 1 && categoryName !== '全部'?
					<div className='ba-info'>
						<span className="ba-type-name">{Common.runningType[item.get('runningType')]}</span>
						<Amount showZero={true}>
							{
								item.get('incomeAmount') == 0 ? item.get('expenseAmount') : item.get('incomeAmount')

							}
						</Amount>
						<Amount showZero={true}>{item.get('balanceAmount')}</Amount>
					</div>
					:
					<div className='ba-info'>
						<span className="ba-type-name">{Common.runningType[item.get('runningType')]}</span>
						<Amount showZero={true}>{item.get('happenAmount')}</Amount>
						<Amount showZero={true}>{item.get('happenBalanceAmount')}</Amount>
					</div>
				}
			</div>
		)
	}
}
