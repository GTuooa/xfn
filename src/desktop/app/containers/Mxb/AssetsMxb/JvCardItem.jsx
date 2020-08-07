import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Checkbox }	from 'antd'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import { TableItem, TableOver, Amount } from 'app/components'

@immutableRenderDecorator
export default
class JvCardItem extends React.Component {

	render() {

		const {
			idx,
			mxItem,
			dispatch,
			className
		} = this.props

		return (
			<TableItem className={className} line={idx+1}>
				<TableOver
					isLink={true}
					onClick={() => {
						sessionStorage.setItem("assetsCardfrom", "AssetsMxb")
						dispatch(assetsActions.getCardDetailFetch(mxItem.get('cardNumber')))
						// dispatch(homeActions.addTabpane('AssetsCardOption'))
						dispatch(assetsActions.showAssetsCardOption(true))
					}}>
					{mxItem.get('cardNumber')}
				</TableOver>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						sessionStorage.setItem("assetsCardfrom", "AssetsMxb")
						dispatch(assetsActions.getCardDetailFetch(mxItem.get('cardNumber')))
						// dispatch(homeActions.addTabpane('AssetsCardOption'))
						dispatch(assetsActions.showAssetsCardOption(true))
					}}>
					{mxItem.get('cardName')}
				</TableOver>
				<li><Amount>{mxItem.get('cardValue')}</Amount></li>
				<li><span>{mxItem.get('salvage') + '%'}</span></li>
				<li><Amount>{mxItem.get('residualValue')}</Amount></li>
				<li><span>{mxItem.get('alreadyTime') + "/" + mxItem.get('totalMonth')}</span></li>
				<li><Amount>{mxItem.get('sumStarDepreciation')}</Amount></li>
				<li><Amount>{mxItem.get('starNetWorth')}</Amount></li>
				<li><Amount>{mxItem.get('currentDepreciation')}</Amount></li>
				<li><Amount>{mxItem.get('sumEndDepreciation')}</Amount></li>
				<li><Amount>{mxItem.get('endNetWorth')}</Amount></li>
			</TableItem>
		);
	}
}
