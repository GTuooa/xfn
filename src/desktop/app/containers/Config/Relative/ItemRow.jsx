import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { Icon, Checkbox, Button, message, Switch }	from 'antd'
import { TableItem, ItemTriangle, TableOver } from 'app/components'

import * as relativeConfActions from 'app/redux/Config/Relative/relative.action.js'
import * as editRelativeCardActions from 'app/redux/Config/Relative/editRelativeCard.action.js'

@immutableRenderDecorator
export default
class ItemRow extends React.Component {

	static displayName = 'RelativeConfItemRow'

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

		const receiveUnit = item.get('isReceiveUnit') ? '向他收款' : ''
		const payUnit = item.get('isPayUnit') ? '向他付款' : ''
		const flag = item.get('isReceiveUnit') && item.get('isPayUnit') ? ',' : ''

		return (
			<TableItem
				line={line}
				className={className}
			>
				<li
					onClick={(e) => {
						e.stopPropagation()
						dispatch(relativeConfActions.changeRelativeCardBoxStatus(e.target.checked, item.get('uuid')))
					}}
				>
					<Checkbox checked={checked}/>
				</li>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						dispatch(editRelativeCardActions.beforeRelativeEditCard(item, showCardModal, originTags))
					}}
					>
					{item.get('code')}
				</TableOver>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={() => {
						dispatch(editRelativeCardActions.beforeRelativeEditCard(item, showCardModal, originTags))
					}}
					>
					{item.get('name')}
				</TableOver>
				<li>
					{/* {
						showLastLine ?
						<span>{receiveUnit}{flag}{payUnit}</span>
						: <span>{item.get('currentUnit')}</span>
					} */}
					<span>{item.get('currentUnit')}</span>
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
											dispatch(relativeConfActions.modifyRelativeCardUsedStatus(item.get('uuid'), value))
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
