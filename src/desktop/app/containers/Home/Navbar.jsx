import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Menu, Dropdown, Popover, Button, Tooltip, message } from 'antd'
import Icon from 'app/components/AntdIcon'
import InternalFrame from 'app/containers/components/InternalFrame'
import XfnIcon from 'app/components/Icon'
import thirdParty from 'app/thirdParty'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js's
import * as middleActions from 'app/redux/Home/middle.action.js'
// import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

@immutableRenderDecorator
export default
class Navbar extends React.Component {

	render() {

		const {
			
			dispatch,
			isSpread,
			manualExpansion,
			manualShowChildPape,
			showChildPape,
			year,
			month,
			pageList,
			navbarList,
			newEquity,
			pageActive,
			winOrMac,
			isAdmin,
			isDdAdmin,
			isDdPriAdmin,
			isFinance,
			allPanes,
			packInfoList,
			isPlay,
			noticeUrl,
			openHelpCenter,
			pageController,
		} = this.props

		const config = pageList.get('Config')
		const canBuyPermission = isAdmin === 'TRUE' || isFinance === 'TRUE' || isDdAdmin === 'TRUE' || isDdPriAdmin === 'TRUE'

		const menu = (
			<Menu className={`home-navbar-menu-${winOrMac}`}>
				<Menu.Item key='BulletinCenter'>
					<span
						style={{width:'100%',display:'inline-block'}}
						onClick={() => {
							// noticeUrl && dispatch(allActions.changeInternalFrameStatus({
							// 	url: noticeUrl,
							// 	title: '公告',
							// 	visibile: true,
							// 	cancelText: '好的，知道了',
							// }))
							noticeUrl && thirdParty.openLink({
								url: noticeUrl
							})
							// window.location.href = 'http://xfncwhelp.file.alimmdn.com/notice/notice0522.html'
						}}
					>
						公告中心
					</span>
				</Menu.Item>
				<Menu.Item key='HelpCenter'>
					<span
						style={{width:'100%',display:'inline-block'}}
						onClick={openHelpCenter}
					>
						帮助中心
					</span>
				</Menu.Item>
				<Menu.Divider />
				{
					canBuyPermission ?
					<Menu.Item key={'Fee'}>
						<span
							style={{width:'100%',display:'inline-block'}}
							onClick={() => {
								if (isPlay) {
									return message.info('体验模式下不能进行套餐购买')
								}
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'Fee', 'Fee', '套餐购买'))
								dispatch(homeActions.addHomeTabpane('Config', 'Fee', '套餐购买'))
								// 如果不是手动打开的状态，切换后自动关闭导航栏
								if (isSpread && !manualExpansion) {
									dispatch(homeActions.spreadHomeNavber())
								}
							}}
						>
							套餐购买
						</span>
					</Menu.Item> : ''
				}
				<Menu.Item key='sobConfig'>
					<span
						style={{width:'100%',display:'inline-block'}}
						onClick={() => {
							dispatch(homeActions.addPageTabPane('ConfigPanes', 'Sob', 'Sob', '账套设置'))
							dispatch(homeActions.addHomeTabpane('Config', 'Sob', '账套设置'))
							if (isSpread && !manualExpansion) {
								dispatch(homeActions.spreadHomeNavber())
							}
						}}
					>
						账套设置
					</span>
				</Menu.Item>
				{
					<Menu.Item key={'security'}>
						<span
							style={{width:'100%',display:'inline-block'}}
							onClick={() => {
								if (isPlay) {
									return message.info('体验模式下不能进入安全中心')
								}
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'Security', 'Security', '安全中心'))
								dispatch(homeActions.addHomeTabpane('Config', 'Security', '安全中心'))
								// 如果不是手动打开的状态，切换后自动关闭导航栏
								if (isSpread && !manualExpansion) {
									dispatch(homeActions.spreadHomeNavber())
								}
							}}
						>
							安全中心
						</span>
					</Menu.Item>
				}
				<Menu.Divider />
				{
					config ?
					config.get('pageList') && config.get('pageList').map((v, i) => {
						return (
							<Menu.Item key={v.get('key')}>
								<span
									style={{width:'100%',display:'inline-block'}}
									onClick={() => {
									dispatch(homeActions.addPageTabPane('ConfigPanes', v.get('key'), v.get('key'), v.get('name')))
									dispatch(homeActions.addHomeTabpane('Config', v.get('key'), v.get('name')))
									if (isSpread && !manualExpansion) {
										dispatch(homeActions.spreadHomeNavber())
									}
								}}>{v.get('name')}</span>
							</Menu.Item>
						)
					}) : ''
				}
				{
					config && config.get('pageList').size ?
					<Menu.Divider /> : ''
				}
				{
					pageController && pageController.getIn(['MANAGER', 'preDetailList', 'CLOSE_SOB', 'display']) === 'SHOW' ?
					<Menu.Item key="jz">
						<span
							style={{width:'100%',display:'inline-block'}}
							onClick={() => {
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'Jz', 'Jz', '结账'))
								dispatch(homeActions.addHomeTabpane('Config', 'Jz', '结账'))
								if (isSpread && !manualExpansion) {
									dispatch(homeActions.spreadHomeNavber())
								}
							}}
						>
							结账
						</span>
					</Menu.Item>
					: null
				}
			</Menu>
		)

		let payPackage = []
        let tracingPackage = []
        packInfoList.map(v => {
            const info = v.toJS()
            if (v.get('isBuy')) {
                payPackage.push(info)
            } else {
                tracingPackage.push(info)
            }
        })

		const iconType = {
			'阿米巴': 'amiba',
			'附件': 'fujian1',
			'会计版': 'huijiban',
			'智能流水': 'liushuizhang',
			'智能版': 'zhinengban',
			'资产管理': 'zichanguanli',
			'试用版': 'shiyongban',
			'账套数': 'zhangtaoshu',
			'智能审批': 'shenpi',
			'智能仓管': 'jinxiaocun',
			'生产项目': 'shengchanxiangmu',
			'施工项目': 'shigongxiangmu',
		}

		const content = (
			<div>
				{
					payPackage.length ?
					<dl className="home-navbar-popover-list">
						<dt>已购：</dt>
						{
							payPackage.map((v, i) => {
								return (
									<dd key={i}>
										<div>
											<XfnIcon type={iconType[v.name]} size="40" style={{color: '#ff8248'}} />
										</div>
										<span>{v.name}</span>
										<span>{v.comments ? `(${v.comments})` : ''}</span>
									</dd>
								)
							})
						}
					</dl> : ''
				}
				{
					tracingPackage.length ?
					<dl className="home-navbar-popover-list">
						<dt>试用：</dt>
						{
							tracingPackage.map((v, i) => {
								return (
									<dd key={i}>
										<div>
											<XfnIcon type={iconType[v.name]} size="40" style={{color: '#5d81d1'}} />
										</div>
										<span>{v.name}</span>
										<span>{v.comments ? `(${v.comments})` : ''}</span>
									</dd>
								)
							})
						}
					</dl> : ''
				}
				<dl className="home-navbar-popover-button">
					<dt></dt>
					<dd>
						<Tooltip placement="topLeft" title={isPlay ? '体验模式下不能进行套餐购买' : (canBuyPermission ? '' : '钉钉管理员及小番内的超级管理员、财务经理可进入查看')}>
							<Button
								disabled={!canBuyPermission || isPlay}
								onClick={() => {
									if (canBuyPermission) {
										dispatch(homeActions.addPageTabPane('ConfigPanes', 'Fee', 'Fee', '套餐购买'))
										dispatch(homeActions.addHomeTabpane('Config', 'Fee', '套餐购买'))
										// 如果不是手动打开的状态，切换后自动关闭导航栏
										if (isSpread && !manualExpansion) {
											dispatch(homeActions.spreadHomeNavber())
										}
									}
								}}
							>
								查看更多
							</Button>
						</Tooltip>
					</dd>
				</dl>
			</div>
		)

		return (
			<div className={isSpread ? `home-navbar-wrap-spread-${winOrMac}` : `home-navbar-wrap-${winOrMac}`}>
				<InternalFrame
					visibile={true}
				/>
				<Popover content={content} trigger='hover' placement="bottom">
					<div className="home-navbar-icon">
						<XfnIcon type='fan' style={{display : isSpread ? '' : 'none'}} className="home-icon-normal"/>
						<XfnIcon type='xin' className="home-icon-red"/>
						<XfnIcon type='nix' style={{display : isSpread ? '' : 'none'}} className="home-icon-normal"/>
						{
							winOrMac === 'win' ? ''
							: <Icon type="down" style={{display : isSpread ? '' : 'none'}} className="down"/>
						}
					</div>
				</Popover>
				<dl className={showChildPape === 'Home' ? "home-navbar-item home-navbar-item-spread" : "home-navbar-item"}>
					<dt onClick={() => {
						dispatch(homeActions.addHomeTabpane('Home', ''))
						// 如果不是手动打开的状态，切换后自动关闭导航栏
						if (isSpread && !manualExpansion) {
							dispatch(homeActions.spreadHomeNavber())
						}
						dispatch(homeActions.showNavbarChildrenList('Home'))
					}}>
						<XfnIcon type='Home'/>
						<span className="home-navbar-item-title">首页</span>
					</dt>
				</dl>
                <div className="home-navbar-list">
					{
						navbarList.map((v, i) => {

							const item = pageList.get(v)
							return (
								<dl className={showChildPape === item.get('key') ? "home-navbar-item home-navbar-item-spread" : "home-navbar-item"}  key={i}>
									<dt onClick={() => {
										// 父级点击
										if (!isSpread) {
											dispatch(homeActions.spreadHomeNavber())
										}

										dispatch(homeActions.showNavbarChildrenList(item.get('key')))

									}}>
										{
											item.get('name') === 'unknow' ?
											<span className="home-navbar-item-place-hoder"></span> :
											<XfnIcon type={item.get('key')} className={item.get('key') === 'Report' ? 'special-icon' : ''}/>
										}
										<span className={["home-navbar-item-title",item.get('key') === 'Report' ? 'special-font' : '',item.get('key') === 'Search' ? 'special-font-search' : ''].join(' ')}>{item.get('name')}</span>
									</dt>
									{
										isSpread && (showChildPape === item.get('key') && manualShowChildPape) ?
										item.get('pageList').map((w, i) => {
											return (
												<dd
													key={i}
													onClick={() => {

														if (item.get('key') === 'Mxb') {
															sessionStorage.setItem('previousPage', 'home')
														} else if (item.get('key') === 'Edit') {

															if (w.get('key') === 'Lrpz') {   // 录入凭证

																sessionStorage.setItem("lrpzHandleMode", "insert")
																let vcDate = ''

																if (!year) {
																	vcDate = new Date()
																} else {
																	const lastDate = new Date(year, month, 0)
																	const currentDate = new Date()
																	const currentYear = new Date().getFullYear()
																	const currentMonth = new Date().getMonth() + 1
																	if (lastDate < currentDate) {   //本月之前
																		vcDate = lastDate
																	} else if (Number(year) == Number(currentYear) && Number(month) == Number(currentMonth)) {  //本月
																		vcDate = currentDate
																	} else {   //本月之后
																		vcDate = new Date(year, Number(month)-1, 1)
																	}
																}
																dispatch(middleActions.initAndGetLastVcIdFetch('initAndGetLastVcIdFetch', vcDate))
																// dispatch(lrpzActions.initLrpz())
																// dispatch(lrpzActions.getLastVcIdFetch(vcDate))
																// dispatch(homeActions.addTabpane('Lrpz'))
															} else if (w.get('key') === 'LrAccount') {
																dispatch(middleActions.getRunningSettingInfo())

																// add by pr
																// if (allPanes.get('EditPanes').find(v => v.get('key') === '录入流水')) {
																// 	dispatch(middleActions.initLrAccount('init'))
																// 	dispatch(middleActions.initLrCalculate('init'))
																// }
															} else if (w.get('key') === 'EditRunning') {
																sessionStorage.setItem('previousPage', 'home')
															}
														}

														dispatch(homeActions.addPageTabPane(`${item.get('key')}Panes`, w.get('key'), w.get('key'), w.get('name')))

														dispatch(homeActions.addHomeTabpane(item.get('key'), w.get('key'), w.get('name')))
														if (isSpread && !manualExpansion) {
															dispatch(homeActions.spreadHomeNavber())
														}
													}}
												>
													<span className={["home-navbar-item-title", pageActive === w.get('key') ? 'home-navbar-item-checked' : ''].join(' ')}>{w.get('name')}</span>
												</dd>
											)
										})
										: ''
									}
								</dl>
							)
						})
					}
                </div>
				<Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
					<div className="home-navbar-setting">
						<span>
							<XfnIcon type="Config"/>
							{
								isSpread ?
								<a className="ant-dropdown-link" href="#">
									管理
								</a> :
								''
							}
						</span>
					</div>
				</Dropdown>
                <div
					className="home-navbar-show"
					onClick={() => {
						dispatch(homeActions.spreadHomeNavber(!isSpread))
					}}
				>
                    {isSpread ? <Icon type="left" /> : <Icon type="right" />}
                </div>
			</div>
		)
	}
}
