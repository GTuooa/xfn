import React from 'react'
import { connect }	from 'react-redux'

import { TabBar } from 'antd-mobile'
import { Icon, ExperienceModal } from 'app/components'

import HomeSection from './HomeSection'
// import EditSection from './EditSection'
// import SearchSection from './SearchSection'
// import ReportSection from './ReportSection'
import SettingSection from './SettingSection'

import { homeActions } from 'app/redux/Home/home.js'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action'
import * as thirdParty from 'app/thirdParty'
import 'app/style/app.less'
import './index.less'

import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'

@connect(state => state)
export default
class Home extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: '23',
			picker: ['2013'],
			pageText : '',
			getedSoblist: false,
			experientialModal: global.isplayground && !global.isPlay ? true : false,
		}
    }

	componentWillMount() {
		if (sessionStorage.getItem("firstload") === "first") {
			this.props.dispatch(homeActions.getDbListFetch('first', this.props.history))
		}
	}

	componentDidMount() {

		if (this.props.homeState.getIn(['views', 'firstToSecurity']) === true) {
			this.props.history.push('/config/security/index')
		}
		if (this.props.homeState.getIn(['views', 'firstToSobInsert']) === true) {

			this.props.dispatch(sobConfigActions.beforeHomeInsertOrModifySob(this.props.history))
		}
		if (this.props.homeState.getIn(['views', 'firstToSob']) === true) {
			this.props.history.push('/config/sob/index')
		}
		if (this.props.homeState.getIn(['views', 'firstToWelcome']) === true) {
			this.props.history.push('/other/sobwelcome')
		}


		sessionStorage.setItem('prevPage', 'home')
		thirdParty.setTitle({title: '小番财务'})

		if (this.swiper) {
			this.swiper.destroy(false)
		}
		this.swiper = new Swiper('.swiper-container', {
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollbar: {
				el: '.swiper-scrollbar',
			},
			mousewheel: true,
		})
	}

	componentWillUnmount() {
		if (sessionStorage.getItem("firstload") === 'first') {
			sessionStorage.removeItem("firstload")
		}
		if(this.swiper){
			this.swiper.destroy(false)
		}
	}

	componentDidUpdate(){
		if(this.swiper){
			this.swiper.destroy(false)
		}
		this.swiper = new Swiper('.swiper-container', {
		direction: 'vertical',
		slidesPerView: 'auto',
		freeMode: true,
		scrollbar: {
			el: '.swiper-scrollbar',
		},
		mousewheel: true,
		});
	}

	renderContent(pageText) {
		// console.log(pageText);

		const period = this.props.allState.get('period')
		const pageList = this.props.homeState.get('pageList')
		const Edit = pageList.get('Edit')
		const Search = pageList.get('Search')
		const Report = pageList.get('Report')
		const Mxb = pageList.get('Mxb')
		const Yeb = pageList.get('Yeb')
		const Config = pageList.get('Config')
		const userInfo = this.props.homeState.getIn(['data', 'userInfo'])
		const isPlay = this.props.homeState.getIn(['views', 'isPlay'])
		this.state.pageText = pageText
		const emplID = this.props.homeState.getIn(['data', 'userInfo', 'emplID'])
		const pageController = this.props.homeState.getIn(['data', 'userInfo', 'pageController'])
		
        const Component = ({
			'Home': () => {
				return (
					<HomeSection
						dispatch={this.props.dispatch}
						userInfo={userInfo}
						pageList={pageList}
						period={period}
						history={this.props.history}
					/>
				)
			},
            // 'Edit': () => {
            //     return (
			// 		<EditSection
			// 			dispatch={this.props.dispatch}
			// 			allState={this.props.allState}
			// 			Edit={Edit}
			// 		/>
			// 	)
            // },
			// 'Search': () => {
            //     return (
			// 		<SearchSection
			// 			dispatch={this.props.dispatch}
			// 			Search={Search}
			// 		/>
			// 	)
            // },
			// 'Report': () => {
			// 	return (
			// 		<ReportSection
			// 			dispatch={this.props.dispatch}
			// 			Report={Report}
			// 			Mxb={Mxb}
			// 			Yeb={Yeb}
			// 		/>
			// 	)
			// },

			'Config': () => {
				return (
					<SettingSection
						dispatch={this.props.dispatch}
						Config={Config}
						userInfo={userInfo}
						history={this.props.history}
						mySobDetailList={this.props.sobConfigState.get('mySobDetailList')}
						isPlay={isPlay}
						showExperientialModal={() => this.setState({experientialModal:true})}
						emplID={emplID}
						pageController={pageController}
					/>
				)
			}
        }[pageText] || (() => {
            return (
              <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
                <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
              </div>
            );
        }))()

        return Component
    }

	render() {

		const { dispatch, homeState, allState, history } = this.props
		const { getedSoblist, experientialModal } = this.state

		thirdParty.setRight({
			show: true,
			control: true,
			text: '刷新',
			// onSuccess: (result) => !location.reload(true) && sessionStorage.clear(),
			onSuccess: (result) => !location.reload(true),
			onFail: (err) => {alert(err)}
		})

		const userInfo = homeState.getIn(['data', 'userInfo'])
		const views = homeState.get('views')
		const selectedTab = views.get('selectedTab')
		const sobexist = views.get('sobexist')

		const navbarList = homeState.get('navbarList')
		const pageList = homeState.get('pageList')
		const moduleList = homeState.get('moduleList')

		const titleJson = {
			'Home': '首页',
			// 'Edit': '录入',
			// 'Search': '查询',
			// 'Report': '报表',
			'Config': '管理'
		}

		const sobInfo = userInfo.get('sobInfo')
		const sobList = userInfo.get('sobList')
		const defaultsobid = sobInfo ? sobInfo.get('sobId') : ''

		return (
				<div className="home-wrap">
					{
						!defaultsobid && global.isplayground == false ?
						<div className="home-no-sob-mask"></div> : null
					}
						<TabBar
							// 不高亮的字体颜色
							unselectedTintColor="#4a4a4a"
							// 高亮的字体颜色
							tintColor="#a90202"
							// 背景颜色
							barTintColor="#fff"
						>
							<TabBar.Item
								title={titleJson['Home']}
								key="Home"
								icon={
									<Icon type="home-unchecked"/>
								}
								selectedIcon={
									<Icon type="home-checked"/>
								}
								selected={selectedTab === 'Home'}
								// badge={1}
								onPress={() => {
									dispatch(homeActions.switchSelectedTab('Home'))
								}}
								data-seed="logId"
							>
								{this.renderContent('Home')}
							</TabBar.Item>
						{/* {
							navbarList.indexOf('Edit') > -1 ?
							<TabBar.Item
								title="录入"
								key="edit"
								icon={
									<div style={{
										width: '22px',
										height: '22px',
										background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
									/>
								}
								selectedIcon={
									<div style={{
										width: '22px',
										height: '22px',
										background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
									/>
								}
								selected={selectedTab === 'Edit'}
								// badge={1}
								onPress={() => {
									dispatch(homeActions.switchSelectedTab('Edit'))
								}}
								data-seed="logId"
							>
								{this.renderContent('Edit')}
							</TabBar.Item>
							: ''
						} */}
						{/* {
							navbarList.indexOf('Search') > -1 ?
							<TabBar.Item
								icon={
									<div style={{
										width: '22px',
										height: '22px',
										background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat' }}
									/>
								}
								selectedIcon={
									<div style={{
										width: '22px',
										height: '22px',
										background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat' }}
									/>
								}
								title="查询"
								key="Search"
								// badge={'new'}
								selected={selectedTab === 'Search'}
								onPress={() => {
									dispatch(homeActions.switchSelectedTab('Search'))
								}}
								data-seed="logId1"
								>
									{this.renderContent('Search')}
								</TabBar.Item>
							: ''
						} */}
						{/* {
							navbarList.indexOf('Report') > -1 ?
							<TabBar.Item
								icon={
									<div style={{
										width: '22px',
										height: '22px',
										background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }}
									/>
								}
								selectedIcon={
									<div style={{
										width: '22px',
										height: '22px',
										background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }}
									/>
								}
								title="统计"
								key="Report"
								// dot
								selected={selectedTab === 'Report'}
								onPress={() => {
									dispatch(homeActions.switchSelectedTab('Report'))
								}}
							>
								{this.renderContent('Report')}
							</TabBar.Item>
							: ''
						} */}
						{/* {
							navbarList.indexOf('Config') > -1 ?
							<TabBar.Item
								icon={
									<Icon type="setting-unchecked"/>
								}
								selectedIcon={
									<Icon type="setting-checked"/>
								}
								title="管理"
								key="Config"
								selected={selectedTab === 'Config'}
								onPress={() => {
									dispatch(homeActions.switchSelectedTab('Config'))
								}}
							>
							{this.renderContent('Config')}
							</TabBar.Item>
							: ''
						} */}
							<TabBar.Item
								icon={
									<Icon type="setting-unchecked"/>
								}
								selectedIcon={
									<Icon type="setting-checked"/>
								}
								title="管理"
								key="Config"
								selected={selectedTab === 'Config'}
								onPress={() => {
									if (!getedSoblist) {
										this.setState({getedSoblist: true})
										dispatch(homeActions.homePageGetSobList(sobList))
									}
									dispatch(homeActions.switchSelectedTab('Config'))
								}}
							>
								{this.renderContent('Config')}
							</TabBar.Item>
						{/* {
							navbarList.map(v => {
								return (
									<TabBar.Item
										title={titleJson[v]}
										key={v}
										icon={
											<div style={{
												width: '22px',
												height: '22px',
												background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
											/>
										}
										selectedIcon={
											<div style={{
												width: '22px',
												height: '22px',
												background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
											/>
										}
										selected={selectedTab === v}
										// 消息提示
										// badge={v}
										onPress={() => {
											console.log('hahah', v);
											dispatch(homeActions.switchSelectedTab(v))
										}}
										data-seed={v}
									>
										{this.renderContent(v)}
									</TabBar.Item>
								)
							})
						} */}
						</TabBar>
						{/* {
							pageText === 'Config'? */}
								<ExperienceModal
									experientialModal={experientialModal}
									moduleList={moduleList}
									closeModal={() => {
										if (global.isplayground)
											return

										let homeTabBarSet = document.getElementById('homeTabBarSet')
										homeTabBarSet.style.overflow='auto';
										this.setState({experientialModal:false})
									}}
									chooseSomeModal={(type, item) => {
										let homeTabBarSet = document.getElementById('homeTabBarSet')
										homeTabBarSet.style.overflow='auto';
										this.setState({experientialModal:false})
										dispatch(homeActions.enterPleasureGround(history, '', type, item))
									}}
									// chooseSmart={() => {
									//
									// 	let homeTabBarSet = document.getElementById('homeTabBarSet')
									// 	homeTabBarSet.style.overflow='auto';
									// 	this.setState({experientialModal:false})
									// 	dispatch(homeActions.enterPleasureGround(history,'','SMART_DEMO'))
									// }}
									// chooseAccount={() => {
									// 	let homeTabBarSet = document.getElementById('homeTabBarSet')
									// 	homeTabBarSet.style.overflow='auto';
									// 	this.setState({experientialModal:false})
									// 	dispatch(homeActions.enterPleasureGround(history,'','ACCOUNTING_DEMO'))
									// }}
								/>
							{/* : null
						} */}
				</div>
			)
	}
}

// new Promise((resolve, reject) => {
// 	alrt('ss')
// })
// .catch((err) => {console.log(`UNHANDLED PROMISE REJECTION: ${err}`)});
//   \.catch((err) => { })