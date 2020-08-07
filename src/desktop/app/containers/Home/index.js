import React from 'react'
import { connect }	from 'react-redux'
import PropTypes from 'prop-types'

import { Button, Tabs, Spin, Tooltip, Modal } from 'antd'
import XfnIcon from 'app/components/Icon'
import Navbar from './Navbar.jsx'
import Title from './Title.jsx'
import * as components from 'app/containers/Home/app.js'
import './style.less'
import FuncList from './FuncList'
import GuideModal from './GuideModal'
import browserNavigator from 'app/utils/browserNavigator'
import thirdParty from 'app/thirdParty'
import { XFNVERSION, ROOTURL, SERVERURL } from 'app/constants/fetch.constant.js'
import LockFilter from 'app/containers/Other/LockFilter/index.js'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

const TabPane = Tabs.TabPane

@connect(state => state)
export default
class Home extends React.Component {

	constructor() {
		super()
		this.state = {
			showModal: false,
		}
	}

	static contextTypes = {
        store: PropTypes.object
    }


	componentDidMount() {
		this.props.dispatch(homeActions.getDbListFetch('first'))
		sessionStorage.setItem('enterLrpz', 'Home')
	}
	componentWillReceiveProps(nextprops) {
		const mxbRunningPreviewVisibility = nextprops.allState.getIn(['views','mxbRunningPreviewVisibility'])
		const searchRunningPreviewVisibility = nextprops.allState.getIn(['views','searchRunningPreviewVisibility'])
		const mxbSerialDrawerVisibility = nextprops.allState.getIn(['views','mxbSerialDrawerVisibility'])
		if ((this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive') || this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey'))
		&& (mxbRunningPreviewVisibility || searchRunningPreviewVisibility || mxbSerialDrawerVisibility)) {
			this.props.dispatch(previewRunningActions.closePreviewRunning())
		}
	}
	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.homeState != nextprops.homeState || this.props.allState != nextprops.allState || this.state !== nextstate
	}

	render() {
		const { dispatch, homeState, allState } = this.props
		const { showModal } = this.state

		const panes = homeState.get('panes')
		const homeActiveKey = homeState.get('homeActiveKey')
		const pageActive = homeState.get('pageActive')
		const userInfo = homeState.getIn(['data', 'userInfo'])
		// 是否存在账套
		const sobexist = homeState.getIn(['views', 'sobexist'])
		// 发请求后出现的蒙层
		const isLoading = allState.getIn(['views', 'isLoading'])
		const loadingUserInfo = homeState.getIn(['views', 'loadingUserInfo'])
		// 导航栏是否展开
		const isSpread = homeState.getIn(['views', 'isSpread'])
		// 显示要展开下级的模块
		const showChildPape = homeState.getIn(['views', 'showChildPape'])
		// 是否用户手动展开了导航栏
		const manualExpansion = homeState.getIn(['views', 'manualExpansion'])
		// 是否用户手动展开了子级
		const manualShowChildPape = homeState.getIn(['views', 'manualShowChildPape'])
		// 是否是体验模式
		const isPlay = homeState.getIn(['views', 'isPlay'])
		// 总账是否已到期
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'moduleInfo'])
		const GLCanUse = moduleInfo ? (moduleInfo.get('GL') && moduleInfo.get('GL') === true ? true : false) : false
		// 是否锁屏
		const lockTime = userInfo.getIn(['lockSecret', 'lockTime'])
		const secret = userInfo.getIn(['lockSecret', 'secret'])
		const showLockFilter = homeState.getIn(['views', 'showLockFilter'])

		const pageController = userInfo.get('pageController')
		const sobInfo = userInfo.get('sobInfo')
		const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 : false
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
		const defaultSobId = sobInfo ? sobInfo.get('sobId') : ''
		const sobList = userInfo.get('sobList')
		// const extensionInfo = userInfo.get('extensionInfo')
		const noticeList = userInfo.get('noticeList')
		const noticeUrl = noticeList.size ? noticeList.getIn([0, 'url']) : ''
		const newEquity = userInfo.get('newEquity')
		// const corpId = userInfo.get('corpId')
		const isAdmin = userInfo.get('isAdmin')
		const isDdAdmin = userInfo.get('isDdAdmin')
		const isDdPriAdmin = userInfo.get('isDdPriAdmin')
		const isFinance = userInfo.get('isFinance')
		const xfnVersion = userInfo.get('xfnVersion')
		const packInfoList = userInfo.get('packInfoList')
		const corpName = userInfo.get('corpName')
		// const isBuy = packInfoList.some(v => v.get('isBuy') === true)
		// const defaultSob = sobInfo ? sobInfo.get('sobName') : '请点击［账套编辑］创建账套'
						// defaultSobId ?
						// (sobList.find(v => v.get('sobId') === defaultSobId) ? sobList.find(v => v.get('sobId') === defaultSobId).get('sobName') : '无效默认id，请切换账套')
						// : sobList.getIn([0, 'sobName'])
		const defaultSobName = sobInfo ? sobInfo.get('sobName') : '请点击［账套编辑］创建账套'

		const period = allState.get('period')
		const year = period.get('openedyear')
		const month = period.get('openedmonth')

		const pageList = homeState.get('pageList')
		const navbarList = homeState.get('navbarList')
		const allPanes = homeState.get('allPanes')
		const moduleList = homeState.get('moduleList')

		const isWindows = browserNavigator.versions.Windows
		// const winOrMac = isWindows ? 'win' : 'mac'
		const winOrMac = 'mac'
		const adminList = homeState.getIn(['views', 'adminList'])
		// let manageList = []
		// if (!sobInfo && isAdmin === 'FALSE' && isFinance === 'FALSE' && isDdAdmin === 'FALSE' && isDdPriAdmin === 'FALSE') {
		// 	// const financeList = homeState.getIn(['views', 'financeList'])
		// 	const adminList = homeState.getIn(['views', 'adminList'])
		// 	const allList = Array.from(new Set(adminList))
		// 	// const allList = Array.from(new Set(financeList.concat(adminList)))
		// 	manageList = allList.slice(0, 5)
		// }

		const firstToSecurity = homeState.getIn(['views', 'firstToSecurity'])
		const firstToSobInsert = homeState.getIn(['views', 'firstToSobInsert'])
		const firstToSob = homeState.getIn(['views', 'firstToSob'])
		const firstToWelcome = homeState.getIn(['views', 'firstToWelcome'])
		const guideGL = homeState.getIn(['views', 'guideGL'])
		const guideZN = homeState.getIn(['views', 'guideZN'])

		// <div className="home-wrap home-wrap-filer" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
		return (
			<div className={"home-wrap"} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
				e.preventDefault()
			}}>
				<Navbar
					isSpread={isSpread}
					manualExpansion={manualExpansion}
					manualShowChildPape={manualShowChildPape}
					showChildPape={showChildPape}
					dispatch={dispatch}
					year={year}
					month={month}
					pageList={pageList}
					navbarList={navbarList}
					newEquity={newEquity}
					pageActive={pageActive}
					winOrMac={winOrMac}
					isAdmin={isAdmin}
					isDdAdmin={isDdAdmin}
					isDdPriAdmin={isDdPriAdmin}
					isFinance={isFinance}
					allPanes={allPanes}
					packInfoList={packInfoList}
					isPlay={isPlay}
					noticeUrl={noticeUrl}
					pageController={pageController}
					openHelpCenter={() => this.setState({showModal: true})}
				/>
				<LockFilter
					lockTime={lockTime}
					secret={secret}
					showLockFilter={showLockFilter}
					doShowLockFilter={() => dispatch(homeActions.changeHomeLockFilterShow(true))}
					cancelLockFilter={() => dispatch(homeActions.changeHomeLockFilterShow(false))}
				/>
				{
					!sobexist && homeActiveKey == 'Home' && (firstToSecurity || guideGL || guideZN || firstToWelcome) ?
					<GuideModal
						showModal={true}
						firstToSecurity={firstToSecurity}
						firstToSobInsert={firstToSobInsert}
						firstToSob={firstToSob}
						firstToWelcome={firstToWelcome}
						guideGL={guideGL}
						guideZN={guideZN}
						onCancel={() => {}}
						onClick={() => {}}
						dispatch={dispatch}
						adminList={adminList}
					/>: null
				}

				{
					(guideGL || guideZN) ?
					<GuideModal
						showModal={true}
						firstToSecurity={firstToSecurity}
						firstToSobInsert={firstToSobInsert}
						firstToSob={firstToSob}
						firstToWelcome={firstToWelcome}
						guideGL={guideGL}
						guideZN={guideZN}
						onCancel={() => {}}
						onClick={() => {}}
						dispatch={dispatch}
					/>: null
				}

				{/* 加载中蒙层 (网页版还未进入游乐模式时可以没有) */}
				{
					global.isplayground && !isPlay ? '' :
					<div className="home-loading-mask" style={{display: isLoading || !loadingUserInfo ? '' : 'none'}}>
					{/* <div className="home-loading-mask" style={{display: isLoading ? '' : 'none'}}> */}
						<div className="home-loading-mask-container">
							<div className="home-loading-mask-text"><Spin/></div>
							<div className="home-loading-mask-text">努力加载中</div>
						</div>
					</div>
				}
				{/* 覆盖于导航栏以外的区域，鼠标点击触发收拢导航栏 */}
				{
					isSpread && !manualExpansion ?
					<div
						className="home-navbar-spread-mask"
						onClick={() => {
							dispatch(homeActions.spreadHomeNavber())
						}}
					></div> : ''
				}

				<div className={isSpread ? `home-main-wrap home-main-wrap-small-${winOrMac}` : `home-main-wrap home-main-wrap-large-${winOrMac}`}>
					<Title
						defaultSobName={defaultSobName}
						sobList={sobList}
						dispatch={dispatch}
						itemlist={noticeList}
						isPlay={isPlay}
						packInfoList={packInfoList}
						moduleList={moduleList}
						corpName={corpName}
						openHelpCenter={() => this.setState({showModal: true})}
						secret={secret}
						showLockFilter={showLockFilter}
					/>
					<div className={showLockFilter ? "home-main-body home-wrap-filer" : "home-main-body"}>
						<Tabs
							className={[`home-main-tabs-${winOrMac}`,isSpread ? '' : `home-main-tabs-nospread-${winOrMac}`].join(' ')}
							hideAdd
							type="editable-card"
							onChange={(key) => dispatch(homeActions.addHomeTabpane(key))}
							activeKey={homeActiveKey}
							onEdit={(targetKey, action) => {
								if (action === 'remove') {
									dispatch(homeActions.removeHomeTabpane(targetKey))
								}
							}}>
							{panes.map(v => {
								const Component = v.get('key') === 'Home' ? '' : components[v.get('key')]
								return <TabPane tab={<span><XfnIcon type={v.get('key')} style={{fontSize: '14px'}}/> {v.get('title')}</span>} key={v.get('key')} closable={v.get('closable')}>{
									v.get('key') === 'Home' ?
									<FuncList
										pageList={pageList}
										navbarList={navbarList}
										dispatch={dispatch}
										year={year}
										month={month}
										allPanes={allPanes}
										isRunning={isRunning}
										GLCanUse={GLCanUse}
										newJr={newJr}
									/> :
									<Component/>
								}</TabPane>
							})}
						</Tabs>
					</div>
				</div>
				<div className="home-version">
					<Tooltip placement="topLeft" title={xfnVersion.get('createTime') ? xfnVersion.get('createTime') : ''}>
						<span className="home-version-text">{xfnVersion.get('version') ? xfnVersion.get('version') : ''}</span>
					</Tooltip>
				</div>
				<Modal
					title="帮助中心"
					visible={showModal}
					onCancel={() => this.setState({showModal: false})}
					footer=''
					maskClosable={false}
					>
					<div className="help-center-wrap-wrap">
						<div className="help-center-wrap">
							<div className="help-center-img-wrap">
								<img
									className="help-center-img"
									src="https://www.xfannix.com/utils/img/icons/customservice.png"
								/>
							</div>
							<div className="help-center-right-wrap">
								<div className="help-center-right-text-wrap">
									<p>扫描左侧二维码</p>
									<p>添加客服在线解答</p>
								</div>
								<p className="help-center-right-text-de"></p>
								<div className="help-center-right-text-wrap">
									<p>拨打客服电话咨询</p>
									<p>0571-28121680转1</p>
								</div>
								<p className="help-center-right-text-de"></p>
								<div className="help-center-right-text-wrap-link">
									<p
										onClick={() => {
											thirdParty.openLink({
												url: isRunning ? 'http://www.xfannix.com/support/desktop/app/index.html?id=1.1#/sysczn' : 'http://www.xfannix.com/support/desktop/app/index.html?id=1.1#/sysc'
											})
										}}
									>自助查询帮助文档</p>
								</div>
							</div>
						</div>
						<div className="help-center-version">{`f${XFNVERSION}@xfn-version`}</div>
						<div className="help-center-version" style={{display: SERVERURL.indexOf('xfannixapp1948.eapps.dingtalkcloud.com') > -1 ? '' : 'none'}}>
							<p
								onClick={() => {
									thirdParty.Confirm({
										title: '提示',
										message: '点击“确认”可切换至备用通道。请注意：线路切换将重新登录。',
										buttonLabels: ['取消', '确认'],
										onSuccess : (result) => {
											if (result.buttonIndex === 1) {

												const href = window.location.href
												const post = href.indexOf('?')
												const endPost = href.indexOf('#/') == -1 ? href.length : href.indexOf('#/')
												let serverMessage = href.slice(post+1, endPost)

												window.location.href = `${ROOTURL}/index.html?${serverMessage}&urlbackup=true`
											}
										}
									})
								}}
							>切换至备用服务器</p>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}

// new Promise((resolve, reject) => {
// 	alrt('ss')
// })
// .catch((err) => {console.log(`UNHANDLED PROMISE REJECTION: ${err}`)});
//   \.catch((err) => { })
