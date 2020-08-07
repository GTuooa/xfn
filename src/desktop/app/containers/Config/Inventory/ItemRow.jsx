import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { Icon, Checkbox, Button, message, Switch, Tooltip }	from 'antd'
import { TableItem, ItemTriangle, TableOver, XfnIcon } from 'app/components'

import * as inventoryConfActions from 'app/redux/Config/Inventory/inventory.action.js'
import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'

@immutableRenderDecorator
export default
class ItemRow extends React.Component {

	static displayName = 'InventoryConfItemRow'

	render() {
		const {
			item,
			line,
			className,
			checked,
			dispatch,
			showLastLine,
			showCardModal,
			editPermission,
			originTags,
			openQuantity,
			BATCH,
			Psi
		} = this.props

		const purchase = item.get('isAppliedPurchase') ? '采购' : ''
		const sale = item.get('isAppliedSale') ? '销售' : ''
		const flag = item.get('isAppliedPurchase') && item.get('isAppliedSale') ? ',' : ''

		return (
			<TableItem
				line={line}
				className={className}
			>
				<li
					onClick={(e) => {
						e.stopPropagation()

						dispatch(inventoryConfActions.changeInventoryCardBoxStatus(e.target.checked, item.get('uuid')))
					}}
				>
					<Checkbox checked={checked}/>
				</li>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						dispatch(editInventoryCardActions.beforeInventoryEditCard(item, showCardModal, originTags,item.get('assemblyState')))
					}}
					>
					{item.get('code')}
				</TableOver>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						dispatch(editInventoryCardActions.beforeInventoryEditCard(item, showCardModal, originTags,item.get('assemblyState')))
					}}
					>
					{item.get('name')}
				</TableOver>
				<li>
					{/* {
						showLastLine ?
						<span>{purchase}{flag}{sale}</span>
						: <span>{item.get('belongedCtgy')}</span>
					} */}
					<span>{item.get('belongedCtgy')}</span>
				</li>
				{
					BATCH?
						item.getIn(['financialInfo','openBatch'])?
						<li>
							已启用
							<span
								class='batch-li'
								onClick={() => {
									dispatch(editInventoryCardActions.getBatchList(item.get('uuid')))
									dispatch(editInventoryCardActions.changeInventoryCardViews('openShelfLife',item.getIn(['financialInfo','openShelfLife'])))
							}}>
								管理<XfnIcon type='edit-pen'/>
							</span>
						</li>:<li></li>
					:''
				}
				{
					openQuantity && Psi ?
						<li className="jxc-row-switch" style={{position:'relative'}}>
							<Tooltip title={item.get('assemblyState') === 'DISABLE'?'存货未开启数量核算，不可启用组装':''}>
								<span className={item.get('assemblyState') === 'DISABLE'?'hover-disable-area':''}></span>
							</Tooltip>
							<span className='title-category-switch-inventory-no-left'>
									<Switch
										className="use-unuse-style"
										checked={item.get('assemblyState') === 'OPEN' || item.get('assemblyState') === 'INVALID'}
										onChange={(value) => {
											if (editPermission) {
												if (!value) {
													dispatch(inventoryConfActions.beforeCloseMaterial(item))
												} else {

													dispatch(inventoryConfActions.modifyInventoryAssemblyStatus(item.get('uuid'), value,() => {
														dispatch(editInventoryCardActions.beforeInventoryEditCard(item, showCardModal, originTags,'OPEN',true))
													}))
												}
											} else {
												message.info('当前角色无该请求权限')
											}
										}}
										checkedChildren={item.get('assemblyState') === 'INVALID'?'失效':''}
										unCheckedChildren={item.get('assemblyState') === 'INVALID'?'失效':''}
										disabled={item.get('assemblyState') === 'INVALID' || item.get('assemblyState') === 'DISABLE'}
									/>

							</span>
						</li>
					: null
				}

				<li className="jxc-row-switch">
					<span className='title-category-switch-inventory-no-left'>
						<Switch
							className="use-unuse-style"
							checked={item.get('used')}
							onChange={(value) => {
								if (editPermission) {
									dispatch(inventoryConfActions.modifyInventoryCardUsedStatus(item.get('uuid'), value))
								} else {
									message.info('当前角色无该请求权限')
								}
							}}
						/>
					</span>
				</li>
			</TableItem>
		)
	}
}
