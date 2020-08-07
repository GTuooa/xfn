import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS, Map, List } from 'immutable'

import { Select, Icon, Menu, Pagination }  from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { TableTree, XfnIcon } from 'app/components'

import Trees from './Trees'

import * as accountMxbActions from 'app/redux/Mxb/AccountMxb/accountMxb.action.js'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {

	constructor() {
		super()
		this.state = {
			showRunningType: false,
		}
	}

	render() {

		const {
			dispatch,
			currentPage,
			issuedate,
			endissuedate,
			accountDetailType,
			currentAccoountUuid,
			accountSelectList,
			currentTreeSelectItem,
			showTreeList,
			accountTypeList,
			accountType,

			cardPageObj,
		} = this.props
		const { showRunningType } = this.state

		const typeStr = (type) => ({
			'': ()=> '全部',
			'cash': () => '现金',
			'general': () => '一般户',
			'basic': () => '基本户',
			'Alipay': () => '支付宝',
			'WeChat': () => '微信',
			'spare': () => '备用金',
			'other': () => '其它'
		}[type] || (() => '未匹配'))()

		return (
			<TableTree className="account-mxb-tree-contain">
				<div className="account-mxb-account-search">
					<Select
						showSearch
						searchPlaceholder="筛选账户类型"
						className="account-mxb-account-select"
						optionFilterProp="children"
						notFoundContent="无法找到相应账户类型"
						value={accountType}
						onSelect={value => {
							dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(issuedate, endissuedate, '', accountDetailType,'',value))
							dispatch(accountMxbActions.changeAccountMxbAccountType(value))
						}}
						showArrow={false}
						>
						<Select.Option key={'mxbAllType'} value={''}>{'全部'}</Select.Option>
						{issuedate && accountTypeList ? accountTypeList.map((v, i) => <Select.Option key={i} value={`${v}`}>{typeStr(v)}</Select.Option>) : ''}
					</Select>
					<Icon type="search" className="account-mxb-account-search-icon"/>
				</div>
				<div className={cardPageObj.pages > 1 ? "account-mxb-account-card" : "account-mxb-account-no-pages"}>
					<div className="mxb-account-card-content">
						<div className="account-card-content-items">
							{
								accountSelectList && accountSelectList.map((v, i) => {
									return (<div
												className='account-mxb-account-card-box'
												onClick={() => {
													dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(issuedate, endissuedate, v.uuid, accountDetailType,'',accountType))
												}}
											>
												<span className={currentAccoountUuid === v.uuid ? "account-mxb-account-card-item account-mxb-account-card-item-cur" : "account-mxb-account-card-item"}>{v.name}</span>
											</div>)
								})
							}
						</div>
					</div>
					{
						cardPageObj.pages > 1 ?
						<div className='account-card-pagination'>
						<Pagination
							simple
							current={cardPageObj.currentPage}
							total={cardPageObj.pages*10}
							onChange={(value) => {
								dispatch(accountMxbActions.getAccountMxbTree(issuedate, endissuedate, currentAccoountUuid,accountType,value))
							}}
						/>
						</div>: ''

					}
				</div>
				<div className="account-mxb-account-category-select">
					<span
						className='account-mxb-category-type'
						style={{display: showRunningType ? '' : 'none'}}
					>
						{`流水类别：${currentTreeSelectItem.get('name') ? currentTreeSelectItem.get('name') : '全部'} `}
					</span>
					<span
						className="account-mxb-hide-icon"
						onClick={() => {
							this.setState({showRunningType: false})
						}}
						style={{display: showRunningType ? '' : 'none'}}
					>
						<XfnIcon type="double-down"  className='account-mxb-arrow-icon'/>
					</span>
					<span
						className="account-mxb-show-icon"
						style={{display: showRunningType ? 'none' : ''}}
						onClick={() => {
							this.setState({showRunningType: true})
						}}
					>
						<span>流水类别：{currentTreeSelectItem.get('name') ? currentTreeSelectItem.get('name') : '全部'}</span>
						<span>
							<XfnIcon
								type="double-up"
								className='account-mxb-arrow-icon'

							/>
						</span>
					</span>
				</div>
				<div style={{display: showRunningType ? '' : 'none'}} className="account-mxb-account-category">
					{
						<div className="account-mxb-account-tree">
							<Trees
								data={showTreeList}
								onSelect={info => {
									if (info.length === 0) {
										return
									}

									const valueList = info[0].split(Limit.TREE_JOIN_STR)
									const treeData = fromJS({
										uuid: valueList[0],
										direction: valueList[1],
										fullname: valueList[2],
										name: valueList[3]
									})
									dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, treeData, currentPage))

								}}
								currentTreeSelectItem={currentTreeSelectItem}
							/>
						</div>
					}
				</div>
			</TableTree>
		)
	}
}

// import React from 'react'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
// import { toJS, fromJS, Map, List } from 'immutable'
//
// import { Select, Icon, Menu }  from 'antd'
// import * as Limit from 'app/constants/Limit.js'
// import { TableTree } from 'app/components'
//
// import Trees from './Trees'
//
// import * as accountMxbActions from 'app/redux/Mxb/AccountMxb/accountMxb.action.js'
//
// @immutableRenderDecorator
// export default
// class TreeContain extends React.Component {
//
// 	render() {
//
// 		const { currentTab, categoryOrType, showTreeList, accountDetailType, issuedate, endissuedate, currentPage, currentAccoountUuid, currentTreeSelectItem, dispatch } = this.props
//
// 		return (
// 			<TableTree className="account-mxb-tree-contain">
//                 <Menu
//                     onClick={value => {
//                         dispatch(accountMxbActions.changeAccountMxbActiveTab('currentTab', value.key))
//                     }}
//                     selectedKeys={[currentTab]}
//                     mode="horizontal"
//                     >
//                     <Menu.Item key="left" className='account-mxb-left-tab'>
//                         账户流水
//                     </Menu.Item>
//                     {/* <Menu.Item key="right" className='account-mxb-right-tab'>
//                         对方流水
//                     </Menu.Item> */}
//                 </Menu>
// 				<div className="account-mxb-table-right-top" style={{display: currentTab === 'right' ? '' : 'none'}}>
// 					<span
// 						onClick={() => {
// 							dispatch(accountMxbActions.changeAccountMxbActiveTab('categoryOrType', categoryOrType === 'category' ? 'type' : 'category'))
// 						}}
// 					>
// 						{categoryOrType === 'category' ? '流水类别' : '类型'} <Icon type="swap" />
// 					</span>
// 				</div>
// 				<div className="account-mxb-table-right-top">
// 					<span
// 						className={!currentTreeSelectItem.get('uuid') ? "account-mxb-table-right-top-current" : ''}
// 						onClick={() => {
// 							const treeData = fromJS({
// 								uuid: '',
// 								direction: '',
// 								fullname: ''
// 							})
// 							dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, treeData, currentPage))
// 						}}
// 					>
// 						全部
// 					</span>
// 				</div>
// 				<div className="account-mxb-table-right-tree" style={{display: issuedate ? 'block' : 'none',paddingTop: '3px'}}>
// 					<Trees
// 						data={showTreeList}
// 						currentTreeSelectItem={currentTreeSelectItem}
// 						accountDetailType={accountDetailType}
// 						onSelect={(info) => {
// 							if (info.length === 0) {
// 								return
// 							}
//
// 							const valueList = info[0].split(Limit.TREE_JOIN_STR)
// 							const treeData = fromJS({
// 								uuid: valueList[0],
// 								direction: valueList[1],
// 								fullname: valueList[2]
// 							})
// 							dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, treeData, currentPage))
// 						}}
// 					/>
// 				</div>
// 			</TableTree>
// 		)
// 	}
// }
