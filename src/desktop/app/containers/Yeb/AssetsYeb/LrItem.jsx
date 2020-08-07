import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as AssetsMxbActions from 'app/redux/Mxb/AssetsMxb/assetsMxb.action.js'

import { Amount } from 'app/components'
import { TableItem, ItemTriangle, TableOver } from 'app/components'

@immutableRenderDecorator
export default
class LrItem extends React.Component {

	constructor() {
		super()
		this.state = {arrowDown: true}
	}

	render() {

		const {
			lrItem,
			line,
			isShow,
			upperidList,
			AssetsConfigRowClick,
			dispatch,
			issuedate,
			endissuedate,
			className,
			chooseperiods
		} = this.props

		const serialNumber = lrItem.get('serialNumber')
		const { arrowDown } = this.state

		return (
			<TableItem
				className={className}
				line={line}
				onClick={() => {
					// 要显示下级或不显示下级类别
					// AssetsConfigRowClick(serialNumber)
					// 控制箭头的上下
					// this.setState({'arrowDown': !arrowDown})
				}}>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						sessionStorage.setItem('previousPage', 'assetsMx')
						// dispatch(homeActions.addTabpane('AssetsMx'))
						dispatch(homeActions.addPageTabPane('MxbPanes', 'AssetsMxb', 'AssetsMxb', '资产明细表'))
						dispatch(homeActions.addHomeTabpane('Mxb', 'AssetsMxb', '资产明细表'))
						dispatch(AssetsMxbActions.getMxListFetch(issuedate, endissuedate, serialNumber))
						dispatch(AssetsMxbActions.changeAssetsMxbChooseMorePeriods(chooseperiods))
					}}>
					{serialNumber}
				</TableOver>
				<ItemTriangle
					onClick={(e) => {
						e.stopPropagation()
						// 要显示下级或不显示下级类别
						AssetsConfigRowClick(serialNumber)
						// 控制箭头的上下
						this.setState({'arrowDown': !arrowDown})
					}}
					isLink={true}
					paddingLeft={serialNumber.length == 1 ? '' : "14px"}
					showchilditem={!arrowDown}
					showTriangle={upperidList.indexOf(serialNumber) > -1}
					IdOnClick={() => {
						sessionStorage.setItem('previousPage', 'assetsMx')
						// dispatch(homeActions.addTabpane('AssetsMx'))
						dispatch(homeActions.addPageTabPane('MxbPanes', 'AssetsMxb', 'AssetsMxb', '资产明细表'))
						dispatch(homeActions.addHomeTabpane('Mxb', 'AssetsMxb', '资产明细表'))
						dispatch(AssetsMxbActions.getMxListFetch(issuedate, endissuedate, serialNumber))
						dispatch(AssetsMxbActions.changeAssetsMxbChooseMorePeriods(chooseperiods))
					}}
					className={(upperidList.indexOf(serialNumber) > -1) ? 'haveChild' : 'notHave'}
					>
					{lrItem.get('serialName')}
				</ItemTriangle>
				<li><Amount>{lrItem.get('cardValue')}</Amount></li>
				<li><Amount>{lrItem.get('sumStarDepreciation')}</Amount></li>
				<li><Amount>{lrItem.get('starNetWorth')}</Amount></li>
				<li><Amount>{lrItem.get('currentDepreciation')}</Amount></li>
				<li><Amount>{lrItem.get('yearDepreciation')}</Amount></li>
				<li><Amount>{lrItem.get('sumEndDepreciation')}</Amount></li>
				<li><Amount>{lrItem.get('endNetWorth')}</Amount></li>
			</TableItem>
		)
	}
}
