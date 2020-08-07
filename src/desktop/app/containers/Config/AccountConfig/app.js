import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { fromJS } from 'immutable'
import './style/index.less'

import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { Button, Dropdown, Menu, Icon } from 'antd'
import { typeList, typeStr } from './commom.js'
import * as thirdParty from 'app/thirdParty'

import Table from './Table'
import AccountModifyModal from './AccountModifyModal'
import PoundageModal from './PoundageModal'
import RepentanceModal from './RepentanceModal'

import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class AccountCongig extends React.Component {

	static displayName = 'AccountCongig'

	constructor() {
		super()
		this.state = {
			showModal: false,
			showPoundageModal:false
		}
	}

	// static propTypes = {
	// 	allState: PropTypes.instanceOf(Map),
	// 	assmxbState: PropTypes.instanceOf(Map),
	// 	homeState: PropTypes.instanceOf(Map),
	// 	dispatch: PropTypes.func
	// }

	componentDidMount() {
		this.props.dispatch(accountConfigActions.getRunningAccount())
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.accountConfigState != nextprops.accountConfigState || this.props.homeState != nextprops.homeState || this.state !== nextstate
	}

	render() {

		const { dispatch, allState, accountConfigState, homeState } = this.props
		const { showModal, showPoundageModal, regretModal } = this.state

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const views = accountConfigState.get('views')
		const pageCount = views.get('pageCount')
		const currentPage = views.get('currentPage')
		const accountSelect = accountConfigState.getIn(['views', 'accountSelect'])

		const accountList = accountConfigState.get('accountList').size ? accountConfigState.getIn(['accountList', 0, 'childList']) : fromJS([])
		const disableList = accountConfigState.getIn(['accountList', 0, 'disableList']) ? accountConfigState.getIn(['accountList', 0, 'disableList']) : fromJS([])
		const runningCategory = allState.get('runningCategory')
		const financeCategory = (runningCategory.getIn([0,'childList']).find(v => v.get('categoryType') === 'LB_FYZC') || fromJS({childList:[]})).get('childList').find(w => w.getIn(['propertyCostList',0]) === 'XZ_FINANCE') || ''
		// selectAll checkBox是否全选
		const selectAll = accountList.size ? accountList.every(v => accountSelect.indexOf(v.get('uuid')) > -1) && disableList.every(v => accountSelect.indexOf(v.get('uuid')) > -1) : false
		const poundageTemp = accountConfigState.get('poundageTemp')
		const regretTemp = accountConfigState.get('regretTemp')
		return (
			<ContainerWrap type="config-one" className="account-config">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread ? '' :
							<PageSwitch
								pageItem={pageList.get('Config')}
								onClick={(page, name, key) => {
									dispatch(homeActions.addPageTabPane('ConfigPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
					</div>
					<div className="flex-title-right">
						<Button
							disabled={!editPermission}
							className="title-right"
							type="ghost"
							onClick={() => {
								this.setState({showModal: true})
								dispatch(accountConfigActions.beforeInsertAccountConf())
							}}
							>
							新增
						</Button>
						<Button
							disabled={!editPermission || !accountSelect.size}
							className="title-right"
							type="ghost"
							onClick={() => dispatch(accountConfigActions.deleteAccountConfAccount())}
						>
							删除
						</Button>
						{
							<span className="title-right title-dropdown regret-title-more">
								<Dropdown overlay={
									<Menu>
										<Menu.Item>
											<span
												className="setting-common-ant-dropdown-menu-item"
												onClick={() => {
													this.setState({showPoundageModal: true})
													dispatch(accountConfigActions.getPaoundgeConfig())
												}}
											>
												手续费设置
											</span>
										</Menu.Item>
										<Menu.Item>
											<span
												className="setting-common-ant-dropdown-menu-item"
												onClick={() => {
													// this.setState({showPoundageModal: true})
													dispatch(accountConfigActions.getAccountRegretList(() => {
														this.setState({regretModal:true})
													}))
												}}
											>
												反悔模式
											</span>
										</Menu.Item>
									</Menu>
									}>
									<span>更多 <Icon className="title-dropdown-icon" type="down"/></span>
								</Dropdown>
							</span>
						}
						{/* <Button
							className="title-right"
							type="ghost"
							onClick={() => {
								this.setState({showPoundageModal: true})
								dispatch(accountConfigActions.getPaoundgeConfig())
								}}
							>
							手续费设置
						</Button> */}
						<Button
							className="title-right"
							type="ghost"
							onClick={() => dispatch(accountConfigActions.getRunningAccount(currentPage))}
							>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<Table
					selectAll={selectAll}
					accountList={accountList}
					disableList={disableList}
					accountSelect={accountSelect}
					dispatch={dispatch}
					editPermission={editPermission}
					pageCount={pageCount}
					currentPage={currentPage}
					showEditModal={() => this.setState({showModal: true})}
				/>
				<AccountModifyModal
					dispatch={dispatch}
					showModal={showModal}
					onClose={() => this.setState({showModal: false})}
					cardList={accountList.concat(disableList)}
					typeList={typeList}
					typeStr={typeStr}
					fromPage='accountConfig'
				/>
				<PoundageModal
					dispatch={dispatch}
					showModal={showPoundageModal}
					financeCategory={financeCategory}
					poundageTemp={poundageTemp}
					onClose={() => this.setState({showPoundageModal: false})}
				/>
				<RepentanceModal
					dispatch={dispatch}
					showModal={regretModal}
					regretTemp={regretTemp}
					typeList={typeList}
					typeStr={typeStr}
					onClose={() => this.setState({regretModal: false})}
					open={() => this.setState({regretModal: true})}
				/>
			</ContainerWrap>
		)
	}
}
