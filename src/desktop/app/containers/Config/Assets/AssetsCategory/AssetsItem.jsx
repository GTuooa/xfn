import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

import { Checkbox, Button, message }	from 'antd'
import { TableItem, TableOver, ItemTriangle, Icon } from 'app/components'

@immutableRenderDecorator
export default
class AssetsItem extends React.Component {

	constructor() {
		super()
		this.state = {arrowDown: true}
	}

	render() {
		const {
			idx,
			line,
			isShow,
			dispatch,
			sortItem,
			className,
			assetsItem,
			upperidList,
			selectClass,
			disableAddChild,
			AssetsConfigRowClick,
			sortItemCheckedStatus
		} = this.props
		const { arrowDown } = this.state

		const serialNumber = sortItem?sortItem.get('serialNumber'):''
		const serialName = sortItem?sortItem.get('serialName'):''

		return (
			<TableItem className={className} style={{display: isShow ? '' : 'none'}} line={line}>
				<li>
					<Checkbox
						disabled={serialNumber.length === 1}
						checked={sortItemCheckedStatus}
						onChange={(e) => {
							e.stopPropagation()
							dispatch(assetsActions.selectOneSortButton(idx))
						}}
					/>
				</li>
				<li>
					<Icon
						type="plus"
						className={serialNumber.length === 3 || disableAddChild ? "assetssort-plus-disable" : 'assetssort-plus'}
						onClick={() => {
							if (serialNumber.length === 3 || disableAddChild)
								return
							// 清空
							dispatch(assetsActions.clearClassification())
							// 显示编辑框
							dispatch(assetsActions.changeClassificationModalDisplay())
							// 设置修改
                            dispatch(assetsActions.changeClassAssetsModeDisplay('insert'))
							// 指定新增的是某某的下级
							dispatch(assetsActions.beforeInsertClassification(serialNumber, serialName, '', sortItem.get('totalMonth'), sortItem.get('salvage')))
						}}
					/>
				</li>
				<ItemTriangle
					paddingLeft={serialNumber.length == 1 ? '' : "10px"}
					showTriangle={upperidList.indexOf(serialNumber) > -1}
					showchilditem={arrowDown}
					onClick={(e) => {
						e.stopPropagation()
						AssetsConfigRowClick(serialNumber)
						this.setState({'arrowDown': !arrowDown})
					}}
					className={upperidList.indexOf(serialNumber) > -1 ? 'haveChild' : 'notHave'}
					>
					{serialNumber}
				</ItemTriangle>
				<TableOver textAlign="left" isLink={true}
					onClick={() => {
						// 显示编辑框
						dispatch(assetsActions.changeClassificationModalDisplay())
						// 设置模式
						dispatch(assetsActions.changeClassAssetsModeDisplay('modify'))
						// 将要修改的类别内容设置进去
						dispatch(assetsActions.beforeModefyClassification(serialNumber, serialName))
					}}>
					{sortItem.get('serialName')}
				</TableOver>
				<li>{sortItem.get('depreciationMethod')}</li>
				<TableOver>{`${sortItem.get('totalMonth') === null ? '' : (sortItem.get('totalMonth') + '月')}`}</TableOver>
				<li>{`${sortItem.get('salvage') === null ? '' : (sortItem.get('salvage') + '%')}`}</li>
				<TableOver textAlign="left">{sortItem.get('assetsAcName')}</TableOver>
				<TableOver textAlign="left">{sortItem.get('debitName')}</TableOver>
				<TableOver textAlign="left">{sortItem.get('creditName')}</TableOver>
				<TableOver textAlign="left">{sortItem.get('remark')}</TableOver>
			</TableItem>
		)
	}
}
