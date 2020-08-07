import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, message, Tooltip, Switch }	from 'antd'
import { TableItem, TableOver, Icon } from 'app/components'

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@immutableRenderDecorator
export default class Item extends React.Component {

	static displayName = 'RunningConfigItem'

	render() {

		const {
            item,
            dispatch,
            line,
            className,
			haveChild,
			showChild,
			leve,
			upperArr,
			checked,
			runningTemp,
			index,
			lastItemUuid,
			nextItemUuid,
			dataSize,
			runningSelect,
			isDisableList,
			isValid,
			editPermission
        } = this.props

		// 工资支出及内部转账大类的复选框置灰、不可删除
		const name = item.get('name')
		const runningAbstract = item.get('runningAbstract')
		const remark = item.get('remark')
		const canDelete = item.get('canDelete')
		const categoryType = item.get('categoryType')
		const parentName = runningTemp.get('parentName')
		const canValid = item.get('canValid')
		const unValidReason = item.get('unValidReason')
		const beSpecial = item.get('beSpecial')
		const leveHolder = ({
			1: () => '',
			2: () => '-',
			3: () => '--',
			4: () => '---'
		}[leve])()
		const canNoChild = []  //测试全开
		let uuidList = [item.get('uuid')]
		const loop = (childList) => {
			childList && childList.size && childList.map(v => {
				uuidList.push(v.get('uuid'))
				v.get('childList').size && loop(v.get('childList'))
				v.get('disableList') && v.get('disableList').size && loop(v.get('disableList'))
			})
		}
		loop(item.get('childList'))
		loop(item.get('disableList'))

		return (
			<TableItem  className={haveChild || leve === 1 ? className : [className].join(' ')}>
				<li
					onClick={(e) => {
						e.stopPropagation()
						dispatch(runningConfActions.runningConfCheckboxCheck(item,upperArr))

					}}
				>
					{
						<label>
							<Checkbox
								checked={
									uuidList.every(v => runningSelect.indexOf(v)> -1)
								}
								disabled={false}
							/>
						</label>
					}
				</li>
				<li>
					{
						// (categoryType === 'LB_JK' || categoryType === 'LB_ZFKX'|| categoryType === 'LB_XCZC') && leve<3
						// || leve < 4 && name !== '增值税' && name !== '资本' && categoryType !== 'LB_JK' && categoryType !=='LB_ZFKX' ?
						categoryType == 'LB_ZB' ||
						(name == '增值税' && parentName === '税费支出') ||
						(name == 'LB_ZB') ||
						((categoryType === 'LB_JK' || categoryType === 'LB_ZFKX' || categoryType === 'LB_XCZC') && leve>=3) ||
						leve >= 4 ?
						<Icon
							type="plus"
							style={{opacity:'0.5'}}
						/> :
						<Icon
							type="plus"
							className={canNoChild.indexOf(item.get('categoryType')) > -1 ? "accountconf-plus-disable" : ''}
							onClick={(e) => {
								if (canNoChild.indexOf(item.get('categoryType')) === -1) {
									e.stopPropagation()
									dispatch(runningConfActions.beforeInsertRunningConf('running', item))
								}
							}}
						/>
					}
				</li>
				<li
					className={`${haveChild ? "table-item-with-triangle trianglePointer" :  'table-item-with-triangle'} item-place`}
					onClick={() => {
						if(haveChild){
							dispatch(runningConfActions.runningConfTriangleSwitch(showChild, item.get('uuid')))
						}
					}}
				>
					{
						(leve !== 1) ?
						<span className='change-place'>
							{
								index > 0 && !isDisableList ?
								<Icon
									type='arrow-up'
									className='go-up'
									onClick={(e) => {
										e.stopPropagation()
										dispatch(allRunningActions.swapRunningItem(item.get('uuid'),lastItemUuid))
									}}
								></Icon> : null
							}
							{
								index !== dataSize-1 && !isDisableList ?
								<Icon
									type='arrow-down'
									className='go-down'
									onClick={(e) => {
										e.stopPropagation()
										dispatch(allRunningActions.swapRunningItem(item.get('uuid'),nextItemUuid))
									}}
								></Icon> : null
							}
						</span> : null
					}
					<span
						className={leve === 1 && !beSpecial? "table-item-name" : 'table-item-name cxls-table-item-cur'}
						style={{paddingLeft: `${leve==1?'5':(leve-2)*10}px`}}
					>
						<span
							onClick={(e) => {
								e.stopPropagation()
								if (leve === 1 && !beSpecial) {
									return
								} else {
									dispatch(runningConfActions.beforeModifyaccountConfRunning('running' ,item))
								}
							}}
						>
							{`${leveHolder} ${name}`}
						</span>
					</span>
					{
						haveChild ?
						<span className="table-item-triangle-account-wrap">
							<Icon
								className="table-item-triangle-account"
								type={showChild ? 'up' : 'down'}>
							</Icon>
						</span> : ''
					}
				</li>
                <TableOver textAlign="left">
					{remark}
                </TableOver>
				<li >
					{
						// item.get('canDelete')?
						canValid?
							<Switch
								checked={item.get('canUse')}
								checkedChildren=""
								unCheckedChildren=""
								className='switch-width use-unuse-style switch-width-account'
								onChange={(checked) => {
									if(editPermission){
										checked ? dispatch(allRunningActions.enabledCategory([item.get('uuid')])) :
											dispatch(allRunningActions.disabledCategory([item.get('uuid')]))
									}else{
										message.info('当前角色无该请求权限');
									}

								}}
							/> :
							<div style={{textAlign:'center'}}>
								失效
								<Tooltip placement="topLeft" title={unValidReason}>
									<Icon type="question-circle-o" />
								</Tooltip>
							</div>
					}
                </li>
			</TableItem>
		)
	}
}
