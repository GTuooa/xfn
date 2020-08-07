import React, { PropTypes } from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as amountYebActions from 'app/redux/Yeb/AmountYeb/amountYeb.action.js'
import * as amountMxbActions from 'app/redux/Mxb/AmountMxb/amountMxb.action.js'

@immutableRenderDecorator
export default
class Ba extends React.Component {

	render() {
		const {
			baItem,
			dispatch,
			issuedate,
			endissuedate,
			idAndName,
			assClassName,
			hasSub,
			isExpanded,
			style,
			type,
			className,
			history,
			unitDecimalCount,
			queryByAss,
			mxAssObj
		} = this.props

		const ass = baItem.get('assid') ? baItem.get('asscategory') + Limit.TREE_JOIN_STR + baItem.get('assid') : ''
		const openingDirection = baItem.get('openingDirection') == 'credit' ? true : false
		const closingDirection = baItem.get('closingDirection') == 'credit' ? true : false

		if (queryByAss) {//按辅助类别查询
			const openingPrice = openingDirection ? -baItem.get('openingPrice') : baItem.get('openingPrice')
			const closingPrice = closingDirection ? -baItem.get('closingPrice') : baItem.get('closingPrice')
			const openingCount = openingDirection ? -baItem.get('openingCount') : baItem.get('openingCount')
			const closingCount = closingDirection ? -baItem.get('closingCount') : baItem.get('closingCount')
			return (
				<div
					style={style}
					className={[assClassName ? 'ba' + ' ' + assClassName : 'ba', className].join(' ')}
					onClick={() => hasSub && dispatch(amountYebActions.toggleLowerAmountYeb(baItem.get('assId'), queryByAss))}
				>
					<div>
						<span className='name name-asscategory'
							onClick={(e) => {
								e.stopPropagation()
								sessionStorage.setItem('previousPage', 'amountYeb')
								if (type=='acid') {
									mxAssObj['acId'] = baItem.get('acId')
									mxAssObj['acName'] = baItem.get('acFullName')
								}
								dispatch(amountMxbActions.changeShortData('mxAssObj', fromJS(mxAssObj)))
								dispatch(amountMxbActions.getAmountMxTerrByAss(issuedate, endissuedate))
								dispatch(amountMxbActions.getAmountMxByAss(issuedate, endissuedate))
								history.push('/amountmxb')
							}}
							>
							{idAndName}
						</span>
						<span className='btn'>
							<Icon
								type='arrow-down'
								style={{display: hasSub ? '' : 'none', transform: isExpanded ? 'rotate(180deg)' : ''}}
							/>
						</span>
					</div>
					<div className='ba-info ba-info-color'>
						<span className="amountyeb-ba-info">
							<span className="amountyeb-ba-number">数量</span>
							<Amount className="amountyeb-number-color" showZero={true} decimalPlaces={unitDecimalCount}>{openingCount}</Amount>
						</span>
						<Amount showZero={true} decimalPlaces={unitDecimalCount}>{baItem.get('debitCount')}</Amount>
						<Amount showZero={true} decimalPlaces={unitDecimalCount}>{baItem.get('creditCount')}</Amount>
						<Amount showZero={true} decimalPlaces={unitDecimalCount}>{closingCount}</Amount>
					</div>
					<div className='ba-info ba-info-color'>
						<span className="amountyeb-ba-info">
							<span className="amountyeb-ba-number">单价</span>
							<Amount className="amountyeb-number-color" showZero={true}>
								{Math.abs(baItem.get('openingUnitPrice'))}
							</Amount>
						</span>
						<Amount></Amount>
						<Amount></Amount>
						<Amount showZero={true}>{Math.abs(baItem.get('closingUnitPrice'))}</Amount>
					</div>
					<div className='ba-info'>
						<Amount showZero={true}>{openingPrice}</Amount>
						<Amount showZero={true}>{baItem.get('debitPrice')}</Amount>
						<Amount showZero={true}>{baItem.get('creditPrice')}</Amount>
						<Amount showZero={true}>{closingPrice}</Amount>
					</div>
				</div>
			)
		} else {
			return (
				<div
					style={style}
					className={[assClassName ? 'ba' + ' ' + assClassName : 'ba', className].join(' ')}
				>
					<div>
						<span className={type === 'asscategory' ? 'name name-asscategory' : 'name'}
							onClick={(e) => {
								if (type === 'asscategory')
									return
								sessionStorage.setItem('previousPage', 'amountYeb')
								dispatch(amountMxbActions.getAmountMxbAclist(issuedate, endissuedate, baItem.get('acid'), ass))
								history.push('/amountmxb')
							}}
							>
							{idAndName}
						</span>
						<span
							className='btn'
							onClick={() => hasSub && dispatch(amountYebActions.toggleLowerAmountYeb(baItem.get('acid')))}
							>
							<Icon
								type='arrow-down'
								style={{visibility: hasSub ? 'visible' : 'hidden', transform: isExpanded ? 'rotate(180deg)' : ''}}
							/>
						</span>
					</div>
					<div className='ba-info ba-info-color'
						onClick={() => hasSub && dispatch(amountYebActions.toggleLowerAmountYeb(baItem.get('acid')))}
					>
						<span className="amountyeb-ba-info">
							<span className="amountyeb-ba-number">数量</span>
							<Amount className="amountyeb-number-color" showZero={true} decimalPlaces={unitDecimalCount}>
								{openingDirection ? -baItem.get('beginCount') : baItem.get('beginCount')}
							</Amount>
						</span>
						<Amount showZero={true} decimalPlaces={unitDecimalCount}>{baItem.get('debitCount')}</Amount>
						<Amount showZero={true} decimalPlaces={unitDecimalCount}>{baItem.get('creditCount')}</Amount>
						<Amount showZero={true} decimalPlaces={unitDecimalCount}>
							{closingDirection ? -baItem.get('closingCount') : baItem.get('closingCount')}
						</Amount>
					</div>
					<div className='ba-info ba-info-color'
						onClick={() => hasSub && dispatch(amountYebActions.toggleLowerAmountYeb(baItem.get('acid')))}
					>
						<span className="amountyeb-ba-info">
							<span className="amountyeb-ba-number">单价</span>
							<Amount className="amountyeb-number-color" showZero={true}>
								{Math.abs(baItem.get('openingPrice'))}
							</Amount>
						</span>
						<Amount></Amount>
						<Amount></Amount>
						<Amount showZero={true}>{Math.abs(baItem.get('closingPrice'))}</Amount>
					</div>
					<div className='ba-info' onClick={() => hasSub && dispatch(amountYebActions.toggleLowerAmountYeb(baItem.get('acid')))}>
						<Amount showZero={true}>{openingDirection ? -baItem.get('openingbalance') : baItem.get('openingbalance')}</Amount>
						<Amount showZero={true}>{baItem.get('debit')}</Amount>
						<Amount showZero={true}>{baItem.get('credit')}</Amount>
						<Amount showZero={true}>{closingDirection ? -baItem.get('closingbalance') : baItem.get('closingbalance')}</Amount>
					</div>
				</div>
			)
		}


	}
}
