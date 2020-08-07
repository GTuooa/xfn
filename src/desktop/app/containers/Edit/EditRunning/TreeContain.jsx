import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Trees from './Trees.jsx'
// import { Select, Icon, Menu, Input }  from 'antd'
import { Icon, Menu }  from 'antd'
import { TableTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { XfnIcon } from 'app/components'
import { debounce } from 'app/utils'

// import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import { editRunningAllActions } from 'app/redux/Edit/EditRunning/runningAll.js'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {
	render() {
		const {
			dispatch,
			runningCategory,
			curCategory,
			// curAccountUuid,
			// issuedate,
			// main,
			taxRateTemp,
			flags,
			hideCategoryList,
			disabledChangeCategory,
			oriTemp,
			pageTab,
			paymentType,
			paymentTypeStr,
			insertOrModify,
			configPermission,
			newJr,
			sfglCategory
		} = this.props

		// let categoryList = []
		const scale = taxRateTemp.get('scale')
		const payableRate =taxRateTemp.get('payableRate')
		const outputRate =taxRateTemp.get('outputRate')
		// const loop = data => data && data.forEach((item, i) => {
		//
		// 	if (item.get('childList') && item.get('childList').size) {
		// 		categoryList.push({
		// 			value: item.get('name'),
		// 			key: item.get('uuid')
		// 		})
		// 		loop(item.get('childList'))
		// 	} else {
		// 		categoryList.push({
		// 			value: item.get('name'),
		// 			key: item.get('uuid')
		// 		})
		// 	}
		// })

		// loop(runningCategory.getIn([0, 'childList']))

		// “所有流水”改为“外部收支”； “核算管理”改为“内部核算”。
		return (
			<Fragment>
				<TableTree className='account-tree'>
					<Menu
						onClick={(e) => {
							// dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'PageTab'], e.key))
							dispatch(editRunningAllActions.switchEditRunningSwitchPageTab(e.key))
							// e.key === 'payment' && !issues.size && dispatch(editRunningActions.getBusinessList('init'))
							if(e.key === 'payment'){
								dispatch(innerCalculateActions.changeEditCalculateCommonString('',['views','paymentTypeStr'],'内部转账'))
							}
						}}
						selectedKeys={[pageTab]}
						mode="horizontal"
						>
						<Menu.Item key="business" className='right-tab'>
							外部收支
						</Menu.Item>
						<Menu.Item key="payment" className='right-tab'>
							内部核算
						</Menu.Item>
					</Menu>
					<div className={pageTab === 'business' ? `table-right-tree right-tree-padding` : 'table-right-tree editCalculate-right-tree-padding'}>
						{
							runningCategory && runningCategory.size ?
							<Trees
								pageTab={pageTab}
								paymentType={paymentType}
								paymentTypeStr={paymentTypeStr}
								insertOrModify={insertOrModify}
								oriTemp={oriTemp}
								flags={flags}
								hideCategoryList={hideCategoryList}
								category={runningCategory}
								selectedKeys={[curCategory]}
								dispatch={dispatch}
								configPermission={configPermission}
								disabledChangeCategory={disabledChangeCategory}
								curCategory={curCategory}
								newJr={newJr}
								onSelect={(value,self,expandedKeys) => {
									if(paymentType ==='LB_SFGL'){
										dispatch(editRunningAllActions.switchEditRunningSwitchPageTab('business'))
										dispatch(editRunningAllActions.changeEditCalculatePaymentType(''))
									}

									if (value[0]) {
										const category = runningCategory
										const valueList = value[0].split(Limit.TREE_JOIN_STR)
										const uuid = valueList[0]
										const hasChild = valueList[2]
										const canClick = valueList[3]
										if(hasChild !== 'hasChild' && canClick === 'canClick') {
											if (insertOrModify === 'insert') {
												dispatch(editRunningActions.selectAccountRunningCategory(uuid))
											} else {
												dispatch(editRunningActions.selectModifyRunningCategory(uuid))
											}
										} else if (hasChild !== 'hasChild' && canClick !== 'canClick') {
											if (expandedKeys.indexOf(uuid) > -1) {
												expandedKeys.splice(expandedKeys.indexOf(uuid),1)
												self.setState({expandedKeys,autoExpandParent: false})
											} else {
												expandedKeys.push(uuid)
												self.setState({expandedKeys,autoExpandParent: false})
											}
										}
									}
								}}
							/>
							: ''
						}
					</div>



					{
						pageTab === 'business' && sfglCategory && sfglCategory.get(0) ?
						<div
						className='tree-left-sfgl'
						onClick = {() => debounce(() => {
							dispatch(editCalculateActions.justNewCalculatebusiness('LB_SFGL')) //切换清空
							dispatch(editRunningAllActions.changeEditCalculatePaymentType('LB_SFGL'))
							// dispatch(changeEditCalculateCommonState('SfglTemp', 'projectList', ))
							dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'paymentUuid'], sfglCategory.getIn([0,'uuid'])))
							dispatch(innerCalculateActions.changeEditCalculateCommonString('',['views','paymentTypeStr'],sfglCategory.getIn([0,'fullCategoryName'])))
						})()}>
						<XfnIcon type='double-change' style={{fontSize: '14px'}}/>&nbsp;
							收付管理
						</div> : null
					}
				</TableTree>
			</Fragment>

		)
	}
}
