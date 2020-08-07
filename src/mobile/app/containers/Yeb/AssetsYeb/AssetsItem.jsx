import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as assetsYebActions from 'app/redux/Yeb/AssetsYeb/assetsYeb.action.js'
import { Icon, Amount } from 'app/components'

@immutableRenderDecorator
export default
class AssetsItem extends React.Component {
	render() {
		const {
			assetsItem,
			idx,
			style,
			hasSub,
			dispatch,
			className,
			issuedate,
			endissuedate,
			isExpanded,
			history
		} = this.props

		const serialNumber = assetsItem.get('serialNumber')
		const serialNumberLength = serialNumber.length

		const articlePaddingLeft = (serialNumberLength - 1) / 200 * 10 + 'rem'

		const flagColor = {
			1: '#fff',
			3: '#D1C0A5'
		}[serialNumberLength]

		const flagstyle = {
			background: flagColor,
			width: articlePaddingLeft
		}

		return (
			<div
				className={'assetsItem' + ' ' + className}
				style={style}
				>
				<div>
					<span
						className='name'
						onClick={(e) => {
							// if(!(assetsItem.get('debit') || assetsItem.get('credit')))
							// 	return
							// e.stopPropagation()
							dispatch(assetsYebActions.getDetailListSingle(serialNumber, assetsItem.get('serialName'), 'index',issuedate,endissuedate))
							history.push('/assetsmxb')
						}}
						>
						{articlePaddingLeft == '0rem' ? '' : <span className="ba-flag" style={flagstyle}></span>}
						<span className='name-name'>{assetsItem.get('serialNumber') + '_' + assetsItem.get('serialName')}</span>
					</span>
					<span className='btn' onClick={() => serialNumberLength === 1 ? dispatch(assetsYebActions.toggleLowerDetailAssets(assetsItem.get('serialNumber'))) : {}}>
						<Icon
							type='arrow-down'
							style={{visibility: hasSub ? 'visible' : 'hidden', transform: isExpanded ? 'rotate(180deg)' : '', marginTop: '.05rem'}}
						/>
					</span>
				</div>
				<div
					className='assetsitem-info'
					onClick={() => serialNumberLength === 1 ? dispatch(assetsYebActions.toggleLowerDetailAssets(assetsItem.get('serialNumber'))) : {}}
					>
					<Amount showZero={true}>{assetsItem.get('cardValue')}</Amount>
					<Amount showZero={true}>
						{/* {assetsItem.get('cardValue') - assetsItem.get('currentDepreciation') - assetsItem.get('termDepreciation')} */}
						{assetsItem.get('sumStarDepreciation')}
					</Amount>
					<Amount showZero={true}>{assetsItem.get('currentDepreciation')}</Amount>
					<Amount showZero={true}>{assetsItem.get('endNetWorth')}</Amount>
				</div>
			</div>
		)
	}
}
