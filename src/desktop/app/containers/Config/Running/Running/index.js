import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Tab, Icon } from 'app/components'
import { Button, Modal, Dropdown, Menu, Tabs } from 'antd'
const { TabPane } = Tabs
import thirdParty from 'app/thirdParty'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'

import RunningConf from './RunningConf'
import RepentanceModal from './RepentanceModal'

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
import { runningIndexActions } from 'app/redux/Config/Running/index'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@immutableRenderDecorator
export default class Account extends React.Component {
	componentDidMount() {

	}
	componentWillUnmount() {
		// this.props.dispatch(runningIndexActions.switchRunningIndexPage('running'))
	}

	render() {

		const {
			dispatch,
			editPermission,
			pageList,
			isSpread,
			currentPage,
			runningTemp,
			regretCategory,
			flags,
			regretTemp,
			taxRateTemp,
			runningCategory,
			newJr,
			enableInventory,
			enableProject
		} = this.props

		const categoryName = regretTemp.get('categoryName')
		const categoryUuid = regretTemp.get('categoryUuid')
		const subordinateName = regretTemp.get('subordinateName')
		const isBalance = regretTemp.get('isBalance')
		const isBusiness = regretTemp.get('isBusiness')
		const showConfirmModal = regretTemp.get('showConfirmModal')
		const showModal = regretTemp.get('showModal')

		const titleList = [
			{
				value: '流水设置',
				key: 'running'
			},{
				value: '税费设置',
				key: 'taxRate'
			}
		]

		const more = (
			<Menu>
				<Menu.Item>
					<span
						className="setting-common-ant-dropdown-menu-item"
						onClick={() => {
							dispatch(runningConfActions.getRegretCategory())
							dispatch(runningConfActions.changeRegretAccountCommonString('regret', 'showModal',true))
						}}
					>
						反悔模式
					</span>
				</Menu.Item>
			</Menu>
		)


		return (
			<ContainerWrap type="config-one" className="running-config">
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
						<Tab
							tabList={titleList}
							activeKey={currentPage}
							tabFunc={(item) => {
								dispatch(runningIndexActions.switchRunningIndexPage(item.key))
							}}
						/>

						{/* {titleList.map(v =>
							<span
								key={v.key}
								className={`title-conleft ${currentPage == v.key ? 'title-selectd' : ''}`}
								onClick={() => {
										dispatch(runningIndexActions.switchRunningIndexPage(v.key))

								}}
								>
								{v.value}
							</span>
						)} */}
						<Button
							className="title-btn"
							type="ghost"
							onClick={() => {
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'Lsqc', 'Lsqc', '流水期初值'))
								dispatch(homeActions.addHomeTabpane('Config', 'Lsqc', '期初值'))
								dispatch(lsqcActions.getBeginningList(true,true))
							}}
						>
							期初值
						</Button>
					</div>
					<div className="flex-title-right">
						{
							<Button
								disabled={!editPermission}
								className="title-right"
								type="ghost"
								onClick={()=>{
									dispatch(allRunningActions.deleteRunningConfCategory())
								}}
							>
								删除
							</Button>
						}
						{
							// 新版暂时屏蔽
							// newJr !== true ?
							<span className="title-right title-dropdown regret-title-more">
								<Dropdown overlay={more}>
									<span>更多 <Icon className="title-dropdown-icon" type="down"/></span>
								</Dropdown>
							</span>
							// : null
						}
						{
							<Button
								className="title-right"
								type="ghost"
								onClick={()=>{
									dispatch(allRunningActions.getRunningCategory('fresh'))
								}}
							>
								刷新
							</Button>

						}
					</div>
					<RepentanceModal
						editPermission={editPermission}
						dispatch={dispatch}
						showModal={showModal}
						showConfirmModal={showConfirmModal}
						regretCategory={regretCategory}
						categoryName={categoryName}
						categoryUuid={categoryUuid}
						subordinateName={subordinateName}
						isBalance={isBalance}
						isBusiness={isBusiness}
						changeState={(showModal) => this.setState({showModal: showModal})}
					/>
					<RunningConf
						dispatch={dispatch}
						taxRateTemp={taxRateTemp}
						runningCategory={runningCategory}
						editPermission={editPermission}
						flags={flags}
						runningTemp={runningTemp}
						newJr={newJr}
						enableInventory={enableInventory}
						enableProject={enableProject}
					/>

				</FlexTitle>
			</ContainerWrap>


		)
	}
}
