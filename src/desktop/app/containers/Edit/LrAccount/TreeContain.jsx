import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Trees from './Trees.jsx'
import { Select, Icon, Menu, Input }  from 'antd'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import { TableTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {
	render() {
		const {
			dispatch,
			runningCategory,
			curCategory,
			curAccountUuid,
			issuedate,
			main,
			assId,
			assCategory,
			acId,
			taxRateTemp,
			flags,
			hideCategoryList,
			disabledChangeCategory,
			cardTemp,
			PageTab,
			homeState
		} = this.props
		let categoryList = []
	    const scale = taxRateTemp.get('scale')
		const payableRate =taxRateTemp.get('payableRate')
	    const outputRate =taxRateTemp.get('outputRate')

		const loop = data => data.forEach((item, i) => {

			if (item.get('childList') && item.get('childList').size) {
				categoryList.push({
					value: item.get('name'),
					key: item.get('uuid')
				})
				loop(item.get('childList'))
			} else {
				categoryList.push({
					value: item.get('name'),
					key: item.get('uuid')
				})
			}
		})

		loop(runningCategory.getIn([0, 'childList']))



		return (
			<TableTree className='account-tree'>
				<Menu
					onClick={(e) => {
						dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'PageTab'], e.key))
						// e.key === 'payment' && !issues.size && dispatch(lrAccountActions.getBusinessList('init'))
					}}
					selectedKeys={[PageTab]}
					mode="horizontal"
					>
					<Menu.Item key="business" className='right-tab'>
						所有流水
					</Menu.Item>
					<Menu.Item key="payment" className='right-tab'>
						核算管理
					</Menu.Item>
				</Menu>
				<div className="table-right-tree">
					{
						runningCategory && runningCategory.size ?
						<Trees
							cardTemp={cardTemp}
							flags={flags}
							hideCategoryList={hideCategoryList}
							category={runningCategory}
							selectedKeys={[curCategory]}
							dispatch={dispatch}
							homeState={homeState}
							disabledChangeCategory={disabledChangeCategory}
							onSelect={(value,self,expandedKeys) => {

								if (value[0]) {
									const category = runningCategory
									const valueList = value[0].split(Limit.TREE_JOIN_STR)
									const uuid = valueList[0]
									const hasChild = valueList[2]
									const canClick = valueList[3]
									if(hasChild !== 'hasChild' && canClick === 'canClick') {
										dispatch(lrAccountActions.selectAccountRunningCategory(uuid, valueList[1], category, scale, payableRate, outputRate))
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
			</TableTree>
		)
	}
}
