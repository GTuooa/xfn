import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { Icon, Checkbox, Button, message, Switch }	from 'antd'
import { TableItem, ItemTriangle, TableOver } from 'app/components'

import * as projectConfActions from 'app/redux/Config/Project/project.action.js'
import * as editProjectCardActions from 'app/redux/Config/Project/editProjectCard.action.js'

@immutableRenderDecorator
export default
class ItemRow extends React.Component {

	static displayName = 'ProjectConfItemRow'

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
			originTags
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
						dispatch(projectConfActions.changeProjectCardBoxStatus(e.target.checked, item.get('uuid')))
					}}
				>
					<Checkbox checked={checked}/>
				</li>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						dispatch(editProjectCardActions.beforeEditProjectCard(item, showCardModal, originTags))
					}}
					>
					{item.get('code')}
				</TableOver>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						dispatch(editProjectCardActions.beforeEditProjectCard(item, showCardModal, originTags))
					}}
					>
					{item.get('name')}
				</TableOver>
				<li>
					{
						showLastLine ?
						<span>{item.get('projectPropertyName')}</span>
						: <span>{item.get('belongedSubCtgy')}</span>
					}
				</li>
				{
					showLastLine ?
						<li className="jxc-row-switch">
							<span className='title-category-switch-inventory-no-left'>
								<Switch
									className="use-unuse-style"
									checked={item.get('used')}
									onChange={(value) => {
										if (editPermission) {
											dispatch(projectConfActions.modifyProjectCardUsedStatus(item.get('uuid'), value))
										} else {
											message.info('当前角色无该请求权限')
										}
									}}
								/>
							</span>
						</li>
					: null
				}
			</TableItem>
		)
	}
}
