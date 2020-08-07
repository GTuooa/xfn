import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, Switch, message }	from 'antd'
import { Icon } from 'app/components'
import { TableItem, TableOver } from 'app/components'

import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'

@immutableRenderDecorator
export default
class Item extends React.Component {

	static displayName = 'AccountCongigItem'

	// static propTypes = {
	// 	allState: PropTypes.instanceOf(Map),
	// 	assmxbState: PropTypes.instanceOf(Map),
	// 	homeState: PropTypes.instanceOf(Map),
	// 	dispatch: PropTypes.func
	// }

	render() {
		const {
			className,
			item,
			line,
			checked,
			dispatch,
			showEditModal,
			listSize,
			lastItemUuid,
			nextItemUuid,
			isDisabled,
			editPermission
        } = this.props

		const typeStr = (type) => ({
			'cash': () => '现金',
			'general': () => '一般户',
			'basic': () => '基本户',
			'Alipay': () => '支付宝',
			'WeChat': () => '微信',
			'spare': () => '备用金',
			'other': () => '其它'
		}[type] || (() => '未匹配'))()

		return (
			<TableItem line={line+1} className={item.get('available') ? className : [className, 'table-item-disable'].join(' ')}>
				<li
					onClick={(e) => {
						e.stopPropagation()
						dispatch(accountConfigActions.accountconfAccountCheckboxCheck(checked, item.get('uuid')))
					}}
				>
					<Checkbox checked={checked}/>
				</li>
				<TableOver
					textAlign="left"
					className='table-item-with-triangle item-place'
					onClick={(e) => {
						e.stopPropagation()
						dispatch(accountConfigActions.beforeModifyaccountConfRunningOld(item))
						showEditModal()
					}}>
					{
						editPermission?
						<span className='change-place'>
							{
								line > 0 && item.get('canUse') && !isDisabled?
								<Icon
									type='arrow-up'
									className='go-up'
									onClick={(e) => {
										e.stopPropagation()
										dispatch(accountConfigActions.swapRunningAccount(item.get('uuid'),lastItemUuid))
									}}
								></Icon> : null
							}
							{
								line !== listSize-1 && item.get('canUse') && !isDisabled ?
								<Icon
									type='arrow-down'
									className='go-down'
									onClick={(e) => {
										e.stopPropagation()
										dispatch(accountConfigActions.swapRunningAccount(item.get('uuid'),nextItemUuid))
									}}
								></Icon> : null
							}
						</span>:''
					}

					<span className='account-name'>
						{item.get('name')}
					</span>
				</TableOver>
                <TableOver>
					{typeStr(item.get('type'))}
                </TableOver>
                <TableOver textAlign="left">
					{item.get('openingName')}
                </TableOver>
                <TableOver textAlign="left">
					{item.get('accountNumber')}
                </TableOver>
                <TableOver textAlign="left">
					{item.get('openingBank')}
                </TableOver>
				<TableOver>
					<Switch
						onChange={(checked) => {
							if (editPermission) {
								dispatch(accountConfigActions.runningAccountUsed(item.get('uuid'),checked))
							} else {
								message.info('当前角色无该请求权限')
							}
						}}
						checked={item.get('canUse')}
						checkedChildren=""
						unCheckedChildren=""
						className='switch-width use-unuse-style switch-width-account'
					/>
				</TableOver>
			</TableItem>
		)
	}
}
