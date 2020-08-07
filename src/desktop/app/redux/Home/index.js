import { fromJS }	from 'immutable';
import * as ActionTypes	from './ActionTypes.js';
import { tabNames, allPermission, loginInfo } from './moduleConstants.js';
import thirdParty from 'app/thirdParty';
import { XFNVERSION } from 'app/constants/fetch.constant.js';

//生产环境应当设置为空
const homeState = fromJS({
	views: {
		sobexist: true,
		// 本 loadingUserInfo 只在首页未获取到账套信息是false
		loadingUserInfo: false,
		ddReady: false,
		// 是否展开
		isSpread: true,
		manualExpansion: true,
		showChildPape: 'Home',
		manualShowChildPape: true,
		isPlay: false,
		URL_POSTFIX: `network=wifi&source=desktop&version=${XFNVERSION}&timestamp=${new Date().getTime()}`,

		// 这两个是没有账套且不是管理员的人才会去获取
		financeList: [],
		adminList: [],
		firstToSecurity: false, // 登录引导
		firstToSobInsert: false, // 登录引导
		firstToSob: false, // 登录引导
		firstToWelcome: false, // 登录引导
		guideGL: false, // 登录引导
		guideZN: false, // 登录引导
		setDingConfig: false,
		showLockFilter: false, // 是否锁屏
	},
	issuedate: '',
	panes: [{ key: 'Home', title: '首页', content: 'Home', closable: false }],
	// 当前打开的页面的 key
	homeActiveKey: 'Home',
	pageActive:'',
	data: {
		userInfo: {
			sobInfo: {
				sobId: '',
				sobName: '',
				// ["GL", "ENCLOSURE_RUN", "ASSETS", "CURRENCY", "ASS", "RUNNING", "AMB", "ENCLOSURE_GL", "NUMBER"]
				moduleInfo: [],
				roleInfo: [],
				newJr: false
			},
			ddId: '',
			dduserid: '',
			isAdmin: '',
			isFinance: '',
			password: '',
			noticeList: [],
			checkMoreFj:'',
			useruuid: '',
			username: '',
			corpId: '',
			corpName: '',
			authChannel: '',
			emplID: '',
			warning: [],
			sobList: [],
			newEquity: false,
			xfnVersion: {},
			moduleInfo: [],
			packInfoList: [],
			lockSecret: {
				lockTime: -1,
				secret: ''
			},
			pageController: {}
		}
	},
	pageList: {
		Edit: {
			name: '录入',
			key: 'Edit',
			pageList: []
		},
		Search: {
			name: '查询',
			key: 'Search',
			pageList: []
		},
		Report: {
			name: '报表',
			key: 'Report',
			pageList: []
		},
		Yeb: {
			name: '余额表',
			key: 'Yeb',
			pageList: []
		},
		Mxb: {
			name: '明细表',
			key: 'Mxb',
			pageList: []
		},
		Config: {
			name: '管理',
			key: 'Config',
			pageList: []
		}
	},
	permissionInfo: {
		Pz: {
			'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            // 导出excel
            'exportExcel': {
                permission: true,
                style: 'disabled',
                disabledTip: '',
            },
			'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
			'toMxb': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
			"arrange": {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            }
		},
		Report: {
			'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
            }
		},
		Config: {
			'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
            },
            'importExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
            }
		},
		LrAccount: {
			'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
            },
			review: {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            }
		}
	},
	navbarList: ['Edit', 'Search', 'Report', 'Yeb', 'Mxb'],

	allPanes: {
		ConfigPanes: [
			// { key: 'AcConfig', title: '科目设置', content: 'AcConfig' }
		],
		YebPanes: [],
		MxbPanes: [],
		ReportPanes: [],
		SearchPanes: [],
		EditPanes: [],
	},
	moduleList: {
		accountModelList: [],
		jrModelList: []
	}
});

export default function handleHome(state = homeState, action) {
	return ({
		[ActionTypes.CHANGE_DDREADY_TO_TRUE]		   : () => state.setIn(['views', 'ddReady'], true),

		// 切换账套刷新
		// [ActionTypes.AFTER_SET_DEFAULT_DB_FETCH]	   : () => state.update('panes', v => v.filter(w => w.get('key') === 'Home')).set('homeActiveKey', 'Home'),
		[ActionTypes.CLEAR_HOME_TAB_PANE]	           : () => {

			const excludePage = action.exclude
			if (excludePage) {
				state = state.update('panes', v => v.filter(w => w.get('key') === 'Home' || w.get('key') === excludePage))
			} else {
				state = state.update('panes', v => v.filter(w => w.get('key') === 'Home')).set('homeActiveKey', 'Home')
			}
			return state
		},
		//
		[ActionTypes.CHANGE_PLEASURE_GROUND_MODULE]	   : () => state.setIn(['views', 'isPlay'], action.bool).setIn(['views', 'URL_POSTFIX'], `network=wifi&source=desktop${action.bool ? '&isPlay=true' : ''}`),

		// [ActionTypes.GET_ADMIN_FINANCE_NAME_LIST]	   : () => state.setIn(['views', 'financeList'], fromJS(action.financeList)).setIn(['views', 'adminList'], fromJS(action.adminList)),
		[ActionTypes.GET_ADMIN_FINANCE_NAME_LIST]	   : () => state.setIn(['views', 'adminList'], fromJS(action.adminList)),

		// 新开tab页，或者切换tab页，或者tab页面内切换
		[ActionTypes.ADD_HOME_TAB_PANE]	               : () => {

			let panes = state.get('panes')

			const tabKeyIndex = panes.findIndex(v => v.get('key') === action.tabKey)

			if (tabKeyIndex > -1) {  // 存在 切换
				state = state.set('homeActiveKey', action.tabKey)
							.updateIn(['panes', tabKeyIndex, 'title'], v => action.title ? action.title : v)
							.updateIn(['panes', tabKeyIndex, 'content'], v => action.openPage ? action.openPage : v)
							.setIn(['views', 'showChildPape'], action.tabKey)
							.set('pageActive', action.openPage ? action.openPage : state.getIn(['panes', tabKeyIndex, 'content']))
			} else {  // 不存在 新增
				panes = panes.push(fromJS({ title: action.title, key: action.tabKey, content: action.openPage }))
				state = state.set('homeActiveKey', action.tabKey).set('panes', panes)
							.setIn(['views', 'showChildPape'], action.tabKey)
							.set('pageActive',action.openPage)
			}

			return state
		},

		// 每个大tab页下的小tab页 的新开页面
		[ActionTypes.ADD_PAGE_TAB_PANE]					: () => {

			const pagePanesName = action.pagePanesName
			let pagePanes = state.getIn(['allPanes', pagePanesName])
			const tabKeyIndex = pagePanes.findIndex(v => v.get('key') === action.tabKey)

			if (tabKeyIndex === -1) {  // 不存在 新增
				// { key: 'AcConfig', title: '科目设置', content: 'AcConfig' }
				// pagePanesName,
		        // tabKey,
		        // openPage,
		        // title
				pagePanes = pagePanes.push(fromJS({ title: action.title, key: action.tabKey, content: action.openPage }))
				state = state.setIn(['allPanes', pagePanesName], pagePanes)
			}

			return state
		},

		// 刷新时关闭除当前页面外的页面 或 关闭所有页面
		[ActionTypes.CLOSE_PAGE_TAB_PANE]					: () => {

			const currentPage = action.currentPage
			const pagePanesName = action.pagePanesName

			if (currentPage) {
				state = state.updateIn(['allPanes', pagePanesName], v => v.filter(v => v.get('title') === currentPage))
			} else {
				state = state.setIn(['allPanes', pagePanesName], fromJS([]))
			}

			return state
		},

		// 关闭tab页，可传入关闭后要打开的tab页，不传则默认打开最后一个tab页
		[ActionTypes.REMOVE_HOME_TAB_PANE]              : () => {

			// 移除
			state = state.update('panes', v => v.filter(w => w.get('key') !== action.tabKey))

			// 默认为最后一个
			const defaultActiveTabkey = state.get('panes').last().get('key')

			if (action.activeTabkey) {  //传入关闭后打开的tab页
				state = state.set('homeActiveKey', state.get('panes').some(v => v.get('key') === action.activeTabkey) ? action.activeTabkey : defaultActiveTabkey)
			} else {
				state = state.set('homeActiveKey', defaultActiveTabkey)
			}
			return state
		},

		// 展开收拢导航侧边栏，收拢时将高亮再次赋值给当前打开的页面
		[ActionTypes.SPREAD_HOME_NAVBER]		         : () => {

			// 两种打开和关闭的方式，一种不是通过箭头打开和关闭的，称为自动展开收拢， 一种是通过底部箭头展开收拢，称为是手动展开收拢

			// 是否手动关闭
			if (action.manualExpansion !== undefined) {
				state = state.setIn(['views', 'manualExpansion'], action.manualExpansion)
			}

			const isSpread = state.getIn(['views', 'isSpread'])

			if (isSpread) {  //原来是打开状态， 关闭时将高亮重新赋给当前显示的页面
				const homeActiveKey = state.get('homeActiveKey')
				state = state.setIn(['views', 'showChildPape'], homeActiveKey)
			}

			return state.updateIn(['views', 'isSpread'], v => !v)
		},

		// 展开某个侧边模块的子级
		[ActionTypes.SHOW_NAVBAR_CHILDREN_LIST]		      : () => {

			const showChildPape = state.getIn(['views', 'showChildPape'])
			return state.setIn(['views', 'showChildPape'], action.key)
						.updateIn(['views', 'manualShowChildPape'], v => action.key === 'Home' ? v : (showChildPape === action.key ? !v : true))
		},
		// 锁屏
		[ActionTypes.CHANGE_HOME_LOCK_FILTER_SHOW]		      : () => {

			return state = state.setIn(['views', 'showLockFilter'], action.bool)
		},
		// 锁屏
		[ActionTypes.AFTER_CHANGE_LOCK_SECRET]		      : () => {
			return state = state.updateIn(['data', 'userInfo', 'lockSecret'], v => v.set('lockTime', action.lockTime).set('secret', action.secret))
		},

		// 登录后，初始化页面的显示模块，权限模块
		[ActionTypes.AFTER_GET_DBLIST_FETCH]		      : () => {

			let receivedData = action.receivedData
			// 调试
			// receivedData = loginInfo

			const sobInfo = receivedData.sobInfo
			const expireInfo = receivedData.moduleInfo
			const pageController = receivedData.pageController ? receivedData.pageController : {}
			// const sobList = receivedData.sobList

			// showLockFilter
			if (receivedData.lockSecret.secret) {
				receivedData.lockSecret.secret = window.atob(receivedData.lockSecret.secret)
			}
			state = state.updateIn(['views', 'showLockFilter'], v => action.first === 'first' ? (receivedData.lockSecret.secret ? true : false) : v)

			if (!sobInfo) { // 无账套
				return state.set('pageList', homeState.get('pageList'))
							.set('permissionInfo', homeState.get('permissionInfo'))
							.setIn(['data', 'userInfo'], fromJS(receivedData))
							.setIn(['views', 'sobexist'], !!receivedData.sobList.length)
							.setIn(['views', 'loadingUserInfo'], true)
			}

			const moduleInfo = sobInfo.moduleInfo
			const roleInfo = sobInfo.roleInfo
			const newJr = sobInfo.newJr

			let pageList = homeState.get('pageList')

			// const roleList = ['ADMIN', 'CASHIER', 'FLOW_OBSERVER', 'FLOW_REVIEW', 'OBSERVER', 'REVIEW', 'OPERATOR', 'VC_OBSERVER', 'VC_REVIEW']
			// const moduleInfo = ["GL", "ENCLOSURE_RUN", "ASSETS", "CURRENCY", "ASS", "RUNNING", "AMB", "ENCLOSURE_GL", "NUMBER"]

			// 开启流水账的
			if (moduleInfo.indexOf('RUNNING') > -1 && !expireInfo.RUNNING) {
				thirdParty.Alert('智能版已过期，钉钉管理员可前往钉钉应用中心续费即可继续使用')
			}

			if (moduleInfo.indexOf('RUNNING') > -1) { // 智能版

				if (newJr === true) { // 新版

					if (pageController.SAVE_JR && (pageController.SAVE_JR.display === '全部权限' || pageController.SAVE_JR.display === '部分权限')) {
						pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
							name: '录入流水',
							key: 'EditRunning',
						})))
					}

					if (moduleInfo.indexOf('PROCESS') > -1 && pageController.QUERY_PROCESS && (pageController.QUERY_PROCESS.display === '全部权限' || pageController.QUERY_PROCESS.display === '部分权限')) {
						pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
							name: '查询审批',
							key: 'SearchApproval',
						})))
					}

					if (pageController.QUERY_JR && (pageController.QUERY_JR.display === '全部权限' || pageController.QUERY_JR.display === '部分权限')) {
						pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
							name: '查询流水',
							key: 'SearchRunning',
						})))
					}

					
					if (moduleInfo.indexOf('RUNNING_GL') > -1 && pageController.QUERY_VC && (pageController.QUERY_VC.display === '全部权限' || pageController.QUERY_VC.display === '部分权限')) {
						pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
							name: '查询凭证',
							key: 'Cxpz',
						})))
					}

					if (pageController.REPORT && (pageController.REPORT.display === '全部权限' || pageController.REPORT.display === '部分权限')) {
						if (pageController.REPORT.preDetailList.PROFIT_REPORT && pageController.REPORT.preDetailList.PROFIT_REPORT.open) {
							pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
								name: '利润表',
								key: 'Lrb',
							})))
						}
						if (pageController.REPORT.preDetailList.CASH_FLOW_REPORT && pageController.REPORT.preDetailList.CASH_FLOW_REPORT.open) {
							pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
								name: '现金流量表',
								key: 'Xjllb',
							})))
						}
						if (pageController.REPORT.preDetailList.TAX_PAYABLE_REPORT && pageController.REPORT.preDetailList.TAX_PAYABLE_REPORT.open) {
							pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
								name: '应交税费表',
								key: 'Yjsfb',
							})))
						}
						if (moduleInfo.indexOf('PROJECT') > -1 && pageController.REPORT.preDetailList.AMB_PROFIT_LOSS_REPORT && pageController.REPORT.preDetailList.AMB_PROFIT_LOSS_REPORT.open) {
							pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
								name: '阿米巴损益表',
								key: 'Syxmb'
							})))
						}
						if (pageController.REPORT.preDetailList.BALANCE_SHEET && pageController.REPORT.preDetailList.BALANCE_SHEET.open) {
							pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
								name: '资产负债表',
								key: 'Zcfzb',
							})))
						}
					}
					
					if (pageController.BALANCE_DETAIL && (pageController.BALANCE_DETAIL.display === '全部权限' || pageController.BALANCE_DETAIL.display === '部分权限')) {
						if (pageController.BALANCE_DETAIL.preDetailList.ACCOUNT_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.ACCOUNT_BALANCE_STATEMENT.open) {
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '账户余额表',
								key: 'AccountYeb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '账户明细表',
								key: 'AccountMxb',
							})))
						}
						
						if (pageController.BALANCE_DETAIL.preDetailList.CONTACT_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.CONTACT_BALANCE_STATEMENT.open) {
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '往来余额表',
								key: 'RelativeYeb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '往来明细表',
								key: 'RelativeMxb',
							})))
						}
						if (moduleInfo.indexOf('PROJECT') > -1 && pageController.BALANCE_DETAIL.preDetailList.PROJECT_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.PROJECT_BALANCE_STATEMENT.open) {
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '项目余额表',
								key: 'ProjectYeb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '项目明细表',
								key: 'ProjectMxb',
							})))
						}
						if (moduleInfo.indexOf('INVENTORY') > -1 && pageController.BALANCE_DETAIL.preDetailList.STOCK_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.STOCK_BALANCE_STATEMENT.open) {
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '存货余额表',
								key: 'InventoryYeb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '存货明细表',
								key: 'InventoryMxb',
							})))
						}
						if (pageController.BALANCE_DETAIL.preDetailList.INCOMING_OUTGOING_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.INCOMING_OUTGOING_BALANCE_STATEMENT.open) {
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '收支余额表',
								key: 'IncomeExpendYeb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '收支明细表',
								key: 'IncomeExpendMxb',
							})))
						}
						if (pageController.BALANCE_DETAIL.preDetailList.BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.BALANCE_STATEMENT.open) {
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '类型余额表',
								key: 'RunningTypeYeb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '类型明细表',
								key: 'RunningTypeMxb',
							})))
						}
						if (moduleInfo.indexOf('RUNNING_GL') > -1 && pageController.BALANCE_DETAIL.preDetailList.AC_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.AC_BALANCE_STATEMENT.open) {
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '科目余额表',
								key: 'Kmyeb'
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '科目明细表',
								key: 'Kmmxb',
							})))
						}
					}

					if (pageController.MANAGER && pageController.MANAGER.display === '全部权限' || pageController.MANAGER.display === '部分权限') {
						if (pageController.MANAGER.preDetailList.JR_SETTING && pageController.MANAGER.preDetailList.JR_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '流水设置',
								key: 'Running',
							})))
						}
						if (pageController.MANAGER.preDetailList.ACCOUNT_SETTING && pageController.MANAGER.preDetailList.ACCOUNT_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '账户设置',
								key: 'AccountConfig',
							})))
						}
						if (pageController.MANAGER.preDetailList.CONTACT_SETTING && pageController.MANAGER.preDetailList.CONTACT_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '往来设置',
								key: 'RelativeConf',
							})))
						}
						if (moduleInfo.indexOf('PROJECT') > -1 && pageController.MANAGER.preDetailList.PROJECT_SETTING && pageController.MANAGER.preDetailList.PROJECT_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '项目设置',
								key: 'ProjectConf',
							})))
						}
						if (moduleInfo.indexOf('INVENTORY') > -1 && pageController.MANAGER.preDetailList.STOCK_SETTING && pageController.MANAGER.preDetailList.STOCK_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '存货设置',
								key: 'InventoryConf',
							})))
						}
						if (moduleInfo.indexOf('WAREHOUSE') > -1 && pageController.MANAGER.preDetailList.WAREHOUSE_SETTING && pageController.MANAGER.preDetailList.WAREHOUSE_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '仓库设置',
								key: 'WarehouseConf',
							})))
						}
						if (moduleInfo.indexOf('PROCESS') > -1 && pageController.MANAGER.preDetailList.PROCESS_SETTING && pageController.MANAGER.preDetailList.PROCESS_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '审批设置',
								key: 'Approval',
							})))
						}
					}
				} else { // 旧版流水
					if (moduleInfo.indexOf('RUNNING') > -1 && expireInfo.RUNNING) {

						// 总管理员、 出纳员   => 录入流水
						if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('CASHIER') > -1) {
							pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
								name: '录入流水',
								key: 'LrAccount',
							})))
						}

						// 总管理员、 总观察员(及带审核的)、 记账员、 流水观察员(开启总账没有流水审核权限)   => 查询流水
						// 改： 凭证观察员(及带审核的)也能查看凭证
						if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1 || roleInfo.indexOf('CASHIER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
							pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
								name: '查询流水',
								key: 'Cxls',
							})))
						}

						// ADMIN,OBSERVER,REVIEW 可以查看凭证
						// 改： 智能版，带审核的流水观察员可以查看凭证
						if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
							if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
								pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
									name: '查询凭证',
									key: 'Cxpz',
								})))
							}
						}

						// 总管理员、 总观察员（及带审核的）  => 明细和余额表
						if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '账户余额表',
								key: 'ZhYeb',
							})))
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '往来余额表',
								key: 'WlYeb',
							})))
							pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
								name: '项目余额表',
								key: 'XmYeb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '账户明细表',
								key: 'ZhMxb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '往来明细表',
								key: 'WlMxb',
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '项目明细表',
								key: 'XmMxb',
							})))
						}

						// 带总账的不需要再次设置报表， 否则 总管理员、 总观察员（及带审核的）  => 报表
						if (moduleInfo.indexOf('GL') === -1) {
							if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {
								pageList = pageList.setIn(['Report', 'pageList'], fromJS([
									{
										name: '利润表',
										key: 'Lrb'
									},
									{
										name: '资产负债表',
										key: 'Zcfzb'
									},
									{
										name: '现金流量表',
										key: 'Xjllb'
									},
									{
										name: '应交税费表',
										key: 'Yjsfb'
									},

								]))

								if (moduleInfo.indexOf('RUNNING_GL') > -1) {
									pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
										name: '科目余额表',
										key: 'Kmyeb'
									})))
									pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
										name: '科目明细表',
										key: 'Kmmxb',
									})))
								}
							}

							// FLOW_REVIEW 也能查看科目余额表
							if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
								if (moduleInfo.indexOf('RUNNING_GL') > -1) {
									pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
										name: '科目余额表',
										key: 'Kmyeb'
									})))
									pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
										name: '科目明细表',
										key: 'Kmmxb',
									})))
								}
							}
						}

						// 总管理员、 总观察员（及带审核的），流水观察员(及带审核的)  => 设置
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '流水设置',
							key: 'Running',
						})))
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '账户设置',
							key: 'AccountConfig',
						})))
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '往来设置',
							key: 'RelativeConf',
						})))
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '存货设置',
							key: 'InventoryConf',
						})))
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '项目设置',
							key: 'ProjectConf',
						})))
					}
				}
			} else if (moduleInfo.indexOf('GL') > -1) {

				if (pageController.SAVE_VC && (pageController.SAVE_VC.display === '全部权限' || pageController.SAVE_VC.display === '部分权限')) {
					pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
						name: '录入凭证',
						key: 'Lrpz',
					})))
				}

				if (pageController.QUERY_VC && (pageController.QUERY_VC.display === '全部权限' || pageController.QUERY_VC.display === '部分权限')) {
					pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
						name: '查询凭证',
						key: 'Cxpz',
					})))
				}

				if (pageController.REPORT && (pageController.REPORT.display === '全部权限' || pageController.REPORT.display === '部分权限')) {
					if (pageController.REPORT.preDetailList.PROFIT_REPORT && pageController.REPORT.preDetailList.PROFIT_REPORT.open) {
						pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
							name: '利润表',
							key: 'Lrb',
						})))
					}
					if (pageController.REPORT.preDetailList.BALANCE_SHEET && pageController.REPORT.preDetailList.BALANCE_SHEET.open) {
						pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
							name: '资产负债表',
							key: 'Zcfzb',
						})))
					}
					if (pageController.REPORT.preDetailList.CASH_FLOW_REPORT && pageController.REPORT.preDetailList.CASH_FLOW_REPORT.open) {
						pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
							name: '现金流量表',
							key: 'Xjllb',
						})))
					}
					if (pageController.REPORT.preDetailList.TAX_PAYABLE_REPORT && pageController.REPORT.preDetailList.TAX_PAYABLE_REPORT.open) {
						pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
							name: '应交税费表',
							key: 'Yjsfb',
						})))
					}
					if (moduleInfo.indexOf('AMB') > -1 && expireInfo.AMB && pageController.REPORT.preDetailList.AMB_PROFIT_LOSS_REPORT && pageController.REPORT.preDetailList.AMB_PROFIT_LOSS_REPORT.open) {
						pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
							name: '阿米巴损益表',
							key: 'Ambsyb'
						})))
					}
					
				}

				if (pageController.BALANCE_DETAIL && (pageController.BALANCE_DETAIL.display === '全部权限' || pageController.BALANCE_DETAIL.display === '部分权限')) {
					if (pageController.BALANCE_DETAIL.preDetailList.AC_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.AC_BALANCE_STATEMENT.open) {
						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
							name: '科目余额表',
							key: 'Kmyeb'
						})))
						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
							name: '科目明细表',
							key: 'Kmmxb',
						})))
					}
					
					if (moduleInfo.indexOf('ASS') > -1 && pageController.BALANCE_DETAIL.preDetailList.ASS_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.ASS_BALANCE_STATEMENT.open) {
						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
							name: '辅助余额表',
							key: 'AssYeb',
						})))
						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
							name: '辅助明细表',
							key: 'AssMxb',
						})))
					}
					if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS && pageController.BALANCE_DETAIL.preDetailList.ASSETS_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.ASSETS_BALANCE_STATEMENT.open) {
						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
							name: '资产余额表',
							key: 'AssetsYeb',
						})))
						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
							name: '资产明细表',
							key: 'AssetsMxb',
						})))
					}
					if (moduleInfo.indexOf('CURRENCY') > -1 && pageController.BALANCE_DETAIL.preDetailList.FOREIGN_CURRENCY_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.FOREIGN_CURRENCY_BALANCE_STATEMENT.open) {
						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
							name: '外币余额表',
							key: 'CurrencyYeb',
						})))
						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
							name: '外币明细表',
							key: 'CurrencyMxb',
						})))
					}
					if (moduleInfo.indexOf('NUMBER') > -1 && pageController.BALANCE_DETAIL.preDetailList.NUMBER_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.NUMBER_BALANCE_STATEMENT.open) {
						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
							name: '数量余额表',
							key: 'AmountYeb',
						})))
						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
							name: '数量明细表',
							key: 'AmountMxb',
						})))
					}
				}

				if (pageController.MANAGER && pageController.MANAGER.display === '全部权限' || pageController.MANAGER.display === '部分权限') {
					if (pageController.MANAGER.preDetailList.AC_SETTING && pageController.MANAGER.preDetailList.AC_SETTING.open) {
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '科目设置',
							key: 'Ac',
						})))
					}
					if (moduleInfo.indexOf('ASS') > -1 && pageController.MANAGER.preDetailList.ASS_SETTING && pageController.MANAGER.preDetailList.ASS_SETTING.open) {
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '辅助设置',
							key: 'Ass',
						})))
					}
					if (moduleInfo.indexOf('CURRENCY') > -1 && pageController.MANAGER.preDetailList.FOREIGN_CURRENCY_SETTING && pageController.MANAGER.preDetailList.FOREIGN_CURRENCY_SETTING.open) {
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '外币设置',
							key: 'Currency',
						})))
					}
					if (moduleInfo.indexOf('ASSETS') > -1 && pageController.MANAGER.preDetailList.ASSETS_SETTING && pageController.MANAGER.preDetailList.ASSETS_SETTING.open) {
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '资产设置',
							key: 'Assets',
						})))
					}
				}
			}

			// 	// console.log('pageList', pageList.toJS());
			let permissionInfo = homeState.get('permissionInfo')	
			if (newJr === true || moduleInfo.indexOf('GL') > -1) { // 新版
				permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.ADMIN))
												.set('Config', fromJS(allPermission.Config.ADMIN))
												.set('Report', fromJS(allPermission.Report.ADMIN))
												.set('LrAccount', fromJS(allPermission.LrAccount.ADMIN))

				if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
					// 智能总账的管理员对于凭证操作的权限
					permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OBSERVER_EXPORT))
				}
			} else {
				// 	// 设置权限
				
				// 管理员的操作权限 （仅能有此一个身份）
				if (roleInfo.indexOf('ADMIN') > -1) {
					permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.ADMIN))
												.set('Config', fromJS(allPermission.Config.ADMIN))
												.set('Report', fromJS(allPermission.Report.ADMIN))
												.set('LrAccount', fromJS(allPermission.LrAccount.ADMIN))

					if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
						// 智能总账的管理员对于凭证操作的权限
						permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OBSERVER_EXPORT))
					}
				}

				// 总观察员(不能审核)
				if (roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1) {
					permissionInfo = permissionInfo.set('Pz',fromJS(allPermission.Pz.OBSERVER))
				}
				if (roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1) {
					permissionInfo = permissionInfo.set('LrAccount',fromJS(allPermission.LrAccount.OBSERVER))
				}
				// 总观察员(能审核)
				if (roleInfo.indexOf('REVIEW') > -1) {
					// 如果开启了总账，就只认凭证有审核功能， 流水没有审核， 否则有流水的审核
					if (moduleInfo.indexOf('GL') > -1) {
						permissionInfo = permissionInfo.set('Pz',fromJS(allPermission.Pz.REVIEW))
					} else {
						permissionInfo = permissionInfo.set('LrAccount',fromJS(allPermission.LrAccount.REVIEW))
					}

					if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
						permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OBSERVER_REVIEW))
					}
				}
				// 凭证观察员带省核权限
				if (roleInfo.indexOf('VC_REVIEW') > -1) {
					permissionInfo = permissionInfo.set('Pz',fromJS(allPermission.Pz.VC_REVIEW))
				}
				// 流水观察员带省核权限
				if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
					permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.FLOW_REVIEW))
													.set('Pz', fromJS(allPermission.Pz.FLOW_REVIEW))
				}
				// 凭证观察员带审核权限， 启用总账可以
				if (roleInfo.indexOf('VC_REVIEW') > -1) {
					if (moduleInfo.indexOf('GL') === -1) {
						permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.FLOW_REVIEW))
					}
				}

				// 记账员的权限
				if (roleInfo.indexOf('OPERATOR') > -1) {
					if (roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1) {
						permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OPERATOR_OBSERVER))
					} else if (roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
						permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OPERATOR_REVIEW))
					} else {
						permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OPERATOR))
					}
				}

				// 出纳员的权限
				if (roleInfo.indexOf('CASHIER') > -1) {
					if (roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1) {
						permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.CASHIER_OBSERVER))
					} else if (roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
						permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.CASHIER_REVIEW))
					} else {
						permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.CASHIER))
					}
				}
			}

			// 过滤掉没有子模块的部分
			pageList = pageList.filter(v => v.get('pageList').size > 0)
			// 首页侧边栏要显f示的模块名称
			let navbarList = []
			pageList.map((v, key) => key !== 'Config' && navbarList.push(key))

			state = state.set('pageList', pageList)
						.set('navbarList', fromJS(navbarList))
						.set('permissionInfo', fromJS(permissionInfo))
						.setIn(['data', 'userInfo'], fromJS(receivedData))
						.setIn(['views', 'sobexist'], !!receivedData.sobList.length)
						.setIn(['views', 'loadingUserInfo'], true)
						.setIn(['views', 'URL_POSTFIX'], `network=wifi&source=desktop&version=${XFNVERSION}&timestamp=${new Date().getTime()}&ssid=${global.ssid}`)

			return state
		},
		// // 登录后，初始化页面的显示模块，权限模块
		// [ActionTypes.AFTER_GET_DBLIST_FETCH]		      : () => {

		// 	let receivedData = action.receivedData
		// 	// 调试
		// 	// receivedData = loginInfo

		// 	const sobInfo = receivedData.sobInfo
		// 	const expireInfo = receivedData.moduleInfo
		// 	// const sobList = receivedData.sobList

		// 	// showLockFilter
		// 	if (receivedData.lockSecret.secret) {
		// 		receivedData.lockSecret.secret = window.atob(receivedData.lockSecret.secret)
		// 	}
		// 	state = state.updateIn(['views', 'showLockFilter'], v => action.first === 'first' ? (receivedData.lockSecret.secret ? true : false) : v)

		// 	if (!sobInfo) { // 无账套
		// 		return state.set('pageList', homeState.get('pageList'))
		// 					.set('permissionInfo', homeState.get('permissionInfo'))
		// 					.setIn(['data', 'userInfo'], fromJS(receivedData))
		// 					.setIn(['views', 'sobexist'], !!receivedData.sobList.length)
		// 					.setIn(['views', 'loadingUserInfo'], true)
		// 	}

		// 	const moduleInfo = sobInfo.moduleInfo
		// 	const roleInfo = sobInfo.roleInfo
		// 	const newJr = sobInfo.newJr

		// 	let pageList = homeState.get('pageList')

		// 	// const roleList = ['ADMIN', 'CASHIER', 'FLOW_OBSERVER', 'FLOW_REVIEW', 'OBSERVER', 'REVIEW', 'OPERATOR', 'VC_OBSERVER', 'VC_REVIEW']
		// 	// const moduleInfo = ["GL", "ENCLOSURE_RUN", "ASSETS", "CURRENCY", "ASS", "RUNNING", "AMB", "ENCLOSURE_GL", "NUMBER"]

		// 	// 开启流水账的
		// 	if (moduleInfo.indexOf('RUNNING') > -1 && !expireInfo.RUNNING) {
		// 		thirdParty.Alert('智能版已过期，钉钉管理员可前往钉钉应用中心续费即可继续使用')
		// 	}

		// 	if (newJr === true) { // 新版
		// 		// if (moduleInfo.indexOf('RUNNING') > -1 && expireInfo.RUNNING) {
		// 		if (moduleInfo.indexOf('RUNNING') > -1) {
		// 			// 总管理员、 出纳员   => 录入流水
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('CASHIER') > -1) {
		// 				pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
		// 					name: '录入流水',
		// 					key: 'EditRunning',
		// 				})))
		// 			}

		// 			// 总管理员、 总观察员(及带审核的)、 记账员、 流水观察员(开启总账没有流水审核权限)   => 查询流水
		// 			// 改： 凭证观察员(及带审核的)也能查看凭证
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('CASHIER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 				if (moduleInfo.indexOf('PROCESS') > -1) {
		// 				// if (receivedData.openProcess === true) { // 条件条件
		// 					pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
		// 						name: '查询审批',
		// 						key: 'SearchApproval',
		// 					})))
		// 				}
		// 				pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
		// 					name: '查询流水',
		// 					key: 'SearchRunning',
		// 				})))
		// 			}

		// 			// ADMIN,OBSERVER,REVIEW 可以查看凭证
		// 			// 改： 智能版，带审核的流水观察员可以查看凭证
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 				if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 					pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
		// 						name: '查询凭证',
		// 						key: 'Cxpz',
		// 					})))
		// 				}
		// 			}

		// 			// 总管理员、 总观察员（及带审核的）  => 明细和余额表
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '账户余额表',
		// 					key: 'AccountYeb',
		// 				})))
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '往来余额表',
		// 					key: 'RelativeYeb',
		// 				})))
		// 				if (moduleInfo.indexOf('PROJECT') > -1) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '项目余额表',
		// 						key: 'ProjectYeb',
		// 					})))
		// 				}
		// 				if (moduleInfo.indexOf('INVENTORY') > -1) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '存货余额表',
		// 						key: 'InventoryYeb',
		// 					})))
		// 				}
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '收支余额表',
		// 					key: 'IncomeExpendYeb',
		// 				})))
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '类型余额表',
		// 					key: 'RunningTypeYeb',
		// 				})))
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '账户明细表',
		// 					key: 'AccountMxb',
		// 				})))
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '往来明细表',
		// 					key: 'RelativeMxb',
		// 				})))
		// 				if (moduleInfo.indexOf('PROJECT') > -1) {
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '项目明细表',
		// 						key: 'ProjectMxb',
		// 					})))
		// 				}
		// 				if (moduleInfo.indexOf('INVENTORY') > -1) {
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '存货明细表',
		// 						key: 'InventoryMxb',
		// 					})))
		// 				}
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '收支明细表',
		// 					key: 'IncomeExpendMxb',
		// 				})))
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '类型明细表',
		// 					key: 'RunningTypeMxb',
		// 				})))
		// 			}

		// 			// 带总账的不需要再次设置报表， 否则 总管理员、 总观察员（及带审核的）  => 报表
		// 			if (moduleInfo.indexOf('GL') === -1) {
		// 				if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {

		// 					pageList = pageList.setIn(['Report', 'pageList'], fromJS([
		// 						{
		// 							name: '利润表',
		// 							key: 'Lrb'
		// 						},
		// 						{
		// 							name: '资产负债表',
		// 							key: 'Zcfzb'
		// 						},
		// 						{
		// 							name: '现金流量表',
		// 							key: 'Xjllb'
		// 						},
		// 						{
		// 							name: '应交税费表',
		// 							key: 'Yjsfb'
		// 						},

		// 					]))
		// 					if (moduleInfo.indexOf('PROJECT') > -1) {
		// 						pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
		// 							name: '阿米巴损益表',
		// 							key: 'Syxmb'
		// 						})))
		// 					}

		// 					if (moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 							name: '科目余额表',
		// 							key: 'Kmyeb'
		// 						})))
		// 						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 							name: '科目明细表',
		// 							key: 'Kmmxb',
		// 						})))
		// 					}
		// 				}

		// 				// FLOW_REVIEW 也能查看科目余额表
		// 				if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 					if (moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 							name: '科目余额表',
		// 							key: 'Kmyeb'
		// 						})))
		// 						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 							name: '科目明细表',
		// 							key: 'Kmmxb',
		// 						})))
		// 					}
		// 				}
		// 			}

		// 			// 总管理员、 总观察员（及带审核的），流水观察员(及带审核的)  => 设置
		// 			// if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 				// pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 				// 	name: '流水设置',
		// 				// 	key: 'AccountConfig',
		// 				// })))
		// 			pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 				name: '流水设置',
		// 				key: 'Running',
		// 			})))
		// 			pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 				name: '账户设置',
		// 				key: 'AccountConfig',
		// 			})))
		// 			pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 				name: '往来设置',
		// 				key: 'RelativeConf',
		// 			})))
		// 			if (moduleInfo.indexOf('PROJECT') > -1) {
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '项目设置',
		// 					key: 'ProjectConf',
		// 				})))
		// 			}
		// 			if (moduleInfo.indexOf('INVENTORY') > -1) {
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '存货设置',
		// 					key: 'InventoryConf',
		// 				})))
		// 			}
		// 			// if (sobInfo.enableWarehouse) {
		// 			if (moduleInfo.indexOf('WAREHOUSE') > -1) {
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '仓库设置',
		// 					key: 'WarehouseConf',
		// 				})))
		// 			}
		// 			// }
		// 			if (moduleInfo.indexOf('PROCESS') > -1) { // 条件条件
		// 			// if (receivedData.openProcess === true) { // 条件条件
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '审批设置',
		// 					key: 'Approval',
		// 				})))
		// 			}
		// 		}

		// 		// 开启了总账
		// 		if (moduleInfo.indexOf('GL') > -1) {
		// 			// 添加 各个模块
		// 			// 总管理员、 记账员   => 录入凭证
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OPERATOR') > -1) {
		// 				pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
		// 					name: '录入凭证',
		// 					key: 'Lrpz',
		// 				})))
		// 			}
		// 			// 总管理员、 总观察员(及带审核的)、 记账员、 凭证观察员(及带审核的)   => 查询凭证
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('OPERATOR') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
		// 				pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
		// 					name: '查询凭证',
		// 					key: 'Cxpz',
		// 				})))
		// 			}

		// 			// 总管理员、 总观察员（及带审核的）   => 报表
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {
		// 				pageList = pageList.setIn(['Report', 'pageList'], fromJS([
		// 					{
		// 						name: '利润表',
		// 						key: 'Lrb'
		// 					},
		// 					{
		// 						name: '资产负债表',
		// 						key: 'Zcfzb'
		// 					},
		// 					{
		// 						name: '现金流量表',
		// 						key: 'Xjllb'
		// 					},
		// 					{
		// 						name: '应交税费表',
		// 						key: 'Yjsfb'
		// 					}
		// 				]))

		// 				if (moduleInfo.indexOf('AMB') > -1 && expireInfo.AMB) {
		// 					pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
		// 						name: '阿米巴损益表',
		// 						key: 'Ambsyb'
		// 					})))
		// 				}
		// 			}

		// 			// 总管理员、 总观察员（及带审核的）  => 明细和余额表
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '科目余额表',
		// 					key: 'Kmyeb'
		// 				})))
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '科目明细表',
		// 					key: 'Kmmxb',
		// 				})))
		// 			}

		// 			// 总管理员、 总观察员（及带审核的）  => 明细和余额表
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {

		// 				if (moduleInfo.indexOf('ASS') > -1) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '辅助余额表',
		// 						key: 'AssYeb',
		// 					})))
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '辅助明细表',
		// 						key: 'AssMxb',
		// 					})))
		// 				}

		// 				if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '资产余额表',
		// 						key: 'AssetsYeb',
		// 					})))
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '资产明细表',
		// 						key: 'AssetsMxb',
		// 					})))
		// 				}

		// 				if (moduleInfo.indexOf('CURRENCY') > -1) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '外币余额表',
		// 						key: 'CurrencyYeb',
		// 					})))
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '外币明细表',
		// 						key: 'CurrencyMxb',
		// 					})))
		// 				}

		// 				if (moduleInfo.indexOf('NUMBER') > -1) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '数量余额表',
		// 						key: 'AmountYeb',
		// 					})))
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '数量明细表',
		// 						key: 'AmountMxb',
		// 					})))
		// 				}


		// 			}


		// 			// 总管理员、 总观察员（及带审核的），凭证观察员(带审核的)  => 设置
		// 			// if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '科目设置',
		// 					key: 'Ac',
		// 				})))

		// 				if (moduleInfo.indexOf('ASS') > -1) {
		// 					pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 						name: '辅助设置',
		// 						key: 'Ass',
		// 					})))
		// 				}

		// 				if (moduleInfo.indexOf('CURRENCY') > -1) {
		// 					pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 						name: '外币设置',
		// 						key: 'Currency',
		// 					})))
		// 				}
		// 				if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS) {
		// 					pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 						name: '资产设置',
		// 						key: 'Assets',
		// 					})))
		// 				}
		// 			// }
		// 		}

		// 	} else { // 旧版
		// 		if (moduleInfo.indexOf('RUNNING') > -1 && expireInfo.RUNNING) {
		// 		// if (moduleInfo.indexOf('RUNNING') > -1) {
		// 			// 总管理员、 出纳员   => 录入流水
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('CASHIER') > -1) {
		// 				pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
		// 					name: '录入流水',
		// 					key: 'LrAccount',
		// 				})))
		// 			}

		// 			// 总管理员、 总观察员(及带审核的)、 记账员、 流水观察员(开启总账没有流水审核权限)   => 查询流水
		// 			// 改： 凭证观察员(及带审核的)也能查看凭证
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1 || roleInfo.indexOf('CASHIER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 				pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
		// 					name: '查询流水',
		// 					key: 'Cxls',
		// 				})))
		// 			}

		// 			// ADMIN,OBSERVER,REVIEW 可以查看凭证
		// 			// 改： 智能版，带审核的流水观察员可以查看凭证
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 				if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 					pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
		// 						name: '查询凭证',
		// 						key: 'Cxpz',
		// 					})))
		// 				}
		// 			}

		// 			// 总管理员、 总观察员（及带审核的）  => 明细和余额表
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 				// pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 				// 	name: '流水余额表',
		// 				// 	key: 'LsYeb',
		// 				// })))
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '账户余额表',
		// 					key: 'ZhYeb',
		// 				})))
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '往来余额表',
		// 					key: 'WlYeb',
		// 				})))
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '项目余额表',
		// 					key: 'XmYeb',
		// 				})))
		// 				// pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 				// 	name: '流水明细表',
		// 				// 	key: 'LsMxb',
		// 				// })))
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '账户明细表',
		// 					key: 'ZhMxb',
		// 				})))
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '往来明细表',
		// 					key: 'WlMxb',
		// 				})))
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '项目明细表',
		// 					key: 'XmMxb',
		// 				})))
		// 			}

		// 			// 带总账的不需要再次设置报表， 否则 总管理员、 总观察员（及带审核的）  => 报表
		// 			if (moduleInfo.indexOf('GL') === -1) {
		// 				if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {
		// 					pageList = pageList.setIn(['Report', 'pageList'], fromJS([
		// 						{
		// 							name: '利润表',
		// 							key: 'Lrb'
		// 						},
		// 						{
		// 							name: '资产负债表',
		// 							key: 'Zcfzb'
		// 						},
		// 						{
		// 							name: '现金流量表',
		// 							key: 'Xjllb'
		// 						},
		// 						{
		// 							name: '应交税费表',
		// 							key: 'Yjsfb'
		// 						},

		// 					]))

		// 					if (moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 							name: '科目余额表',
		// 							key: 'Kmyeb'
		// 						})))
		// 						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 							name: '科目明细表',
		// 							key: 'Kmmxb',
		// 						})))
		// 					}
		// 				}

		// 				// FLOW_REVIEW 也能查看科目余额表
		// 				if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 					if (moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 							name: '科目余额表',
		// 							key: 'Kmyeb'
		// 						})))
		// 						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 							name: '科目明细表',
		// 							key: 'Kmmxb',
		// 						})))
		// 					}
		// 				}
		// 			}

		// 			// 总管理员、 总观察员（及带审核的），流水观察员(及带审核的)  => 设置
		// 			// if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 				// pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 				// 	name: '流水设置',
		// 				// 	key: 'AccountConfig',
		// 				// })))
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '流水设置',
		// 					key: 'Running',
		// 				})))
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '账户设置',
		// 					key: 'AccountConfig',
		// 				})))
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '往来设置',
		// 					key: 'RelativeConf',
		// 				})))
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '存货设置',
		// 					key: 'InventoryConf',
		// 				})))
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '项目设置',
		// 					key: 'ProjectConf',
		// 				})))
		// 			// }
		// 		}

		// 		// 开启了总账
		// 		if (moduleInfo.indexOf('GL') > -1) {
		// 			// 添加 各个模块
		// 			// 总管理员、 记账员   => 录入凭证
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OPERATOR') > -1) {
		// 				pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
		// 					name: '录入凭证',
		// 					key: 'Lrpz',
		// 				})))
		// 			}
		// 			// 总管理员、 总观察员(及带审核的)、 记账员、 凭证观察员(及带审核的)   => 查询凭证
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('OPERATOR') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
		// 				pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
		// 					name: '查询凭证',
		// 					key: 'Cxpz',
		// 				})))
		// 			}

		// 			// 总管理员、 总观察员（及带审核的）   => 报表
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {
		// 				pageList = pageList.setIn(['Report', 'pageList'], fromJS([
		// 					{
		// 						name: '利润表',
		// 						key: 'Lrb'
		// 					},
		// 					{
		// 						name: '资产负债表',
		// 						key: 'Zcfzb'
		// 					},
		// 					{
		// 						name: '现金流量表',
		// 						key: 'Xjllb'
		// 					},
		// 					{
		// 						name: '应交税费表',
		// 						key: 'Yjsfb'
		// 					}
		// 				]))

		// 				if (moduleInfo.indexOf('AMB') > -1 && expireInfo.AMB) {
		// 					pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
		// 						name: '阿米巴损益表',
		// 						key: 'Ambsyb'
		// 					})))
		// 				}
		// 			}

		// 			// 总管理员、 总观察员（及带审核的）  => 明细和余额表
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
		// 				pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 					name: '科目余额表',
		// 					key: 'Kmyeb'
		// 				})))
		// 				pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 					name: '科目明细表',
		// 					key: 'Kmmxb',
		// 				})))
		// 			}

		// 			// 总管理员、 总观察员（及带审核的）  => 明细和余额表
		// 			if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {

		// 				if (moduleInfo.indexOf('ASS') > -1) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '辅助余额表',
		// 						key: 'AssYeb',
		// 					})))
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '辅助明细表',
		// 						key: 'AssMxb',
		// 					})))
		// 				}

		// 				if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '资产余额表',
		// 						key: 'AssetsYeb',
		// 					})))
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '资产明细表',
		// 						key: 'AssetsMxb',
		// 					})))
		// 				}

		// 				if (moduleInfo.indexOf('CURRENCY') > -1) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '外币余额表',
		// 						key: 'CurrencyYeb',
		// 					})))
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '外币明细表',
		// 						key: 'CurrencyMxb',
		// 					})))
		// 				}

		// 				if (moduleInfo.indexOf('NUMBER') > -1) {
		// 					pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
		// 						name: '数量余额表',
		// 						key: 'AmountYeb',
		// 					})))
		// 					pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
		// 						name: '数量明细表',
		// 						key: 'AmountMxb',
		// 					})))
		// 				}


		// 			}


		// 			// 总管理员、 总观察员（及带审核的），凭证观察员(带审核的)  => 设置
		// 			// if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
		// 				pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 					name: '科目设置',
		// 					key: 'Ac',
		// 				})))

		// 				if (moduleInfo.indexOf('ASS') > -1) {
		// 					pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 						name: '辅助设置',
		// 						key: 'Ass',
		// 					})))
		// 				}

		// 				if (moduleInfo.indexOf('CURRENCY') > -1) {
		// 					pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 						name: '外币设置',
		// 						key: 'Currency',
		// 					})))
		// 				}
		// 				if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS) {
		// 					pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
		// 						name: '资产设置',
		// 						key: 'Assets',
		// 					})))
		// 				}
		// 			// }
		// 		}
		// 	}

		// 	// console.log('pageList', pageList.toJS());

		// 	// 设置权限
		// 	let permissionInfo = homeState.get('permissionInfo')
		// 	// 管理员的操作权限 （仅能有此一个身份）
		// 	if (roleInfo.indexOf('ADMIN') > -1) {
		// 		permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.ADMIN))
		// 									.set('Config', fromJS(allPermission.Config.ADMIN))
		// 									.set('Report', fromJS(allPermission.Report.ADMIN))
		// 									.set('LrAccount', fromJS(allPermission.LrAccount.ADMIN))

		// 		if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 			// 智能总账的管理员对于凭证操作的权限
		// 			permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OBSERVER_EXPORT))
		// 		}
		// 	}

		// 	// 总观察员(不能审核)
		// 	if (roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1) {
		// 		permissionInfo = permissionInfo.set('Pz',fromJS(allPermission.Pz.OBSERVER))
		// 	}
		// 	if (roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1) {
		// 		permissionInfo = permissionInfo.set('LrAccount',fromJS(allPermission.LrAccount.OBSERVER))
		// 	}
		// 	// 总观察员(能审核)
		// 	if (roleInfo.indexOf('REVIEW') > -1) {
		// 		// 如果开启了总账，就只认凭证有审核功能， 流水没有审核， 否则有流水的审核
		// 		if (moduleInfo.indexOf('GL') > -1) {
		// 			permissionInfo = permissionInfo.set('Pz',fromJS(allPermission.Pz.REVIEW))
		// 		} else {
		// 			permissionInfo = permissionInfo.set('LrAccount',fromJS(allPermission.LrAccount.REVIEW))
		// 		}

		// 		if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 			permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OBSERVER_REVIEW))
		// 		}
		// 	}
		// 	// 凭证观察员带省核权限
		// 	if (roleInfo.indexOf('VC_REVIEW') > -1) {
		// 		permissionInfo = permissionInfo.set('Pz',fromJS(allPermission.Pz.VC_REVIEW))
		// 	}
		// 	// 流水观察员带省核权限
		// 	if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 		permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.FLOW_REVIEW))
		// 										.set('Pz', fromJS(allPermission.Pz.FLOW_REVIEW))
		// 	}
		// 	// 凭证观察员带审核权限， 启用总账可以
		// 	if (roleInfo.indexOf('VC_REVIEW') > -1) {
		// 		if (moduleInfo.indexOf('GL') === -1) {
		// 			permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.FLOW_REVIEW))
		// 		}
		// 	}

		// 	// 记账员的权限
		// 	if (roleInfo.indexOf('OPERATOR') > -1) {
		// 		if (roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1) {
		// 			permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OPERATOR_OBSERVER))
		// 		} else if (roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
		// 			permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OPERATOR_REVIEW))
		// 		} else {
		// 			permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OPERATOR))
		// 		}
		// 	}

		// 	// 出纳员的权限
		// 	if (roleInfo.indexOf('CASHIER') > -1) {
		// 		if (roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1) {
		// 			permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.CASHIER_OBSERVER))
		// 		} else if (roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 			permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.CASHIER_REVIEW))
		// 		} else {
		// 			permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.CASHIER))
		// 		}
		// 	}

		// 	// 过滤掉没有子模块的部分
		// 	pageList = pageList.filter(v => v.get('pageList').size > 0)
		// 	// 首页侧边栏要显f示的模块名称
		// 	let navbarList = []
		// 	pageList.map((v, key) => key !== 'Config' && navbarList.push(key))

		// 	state = state.set('pageList', pageList)
		// 				.set('navbarList', fromJS(navbarList))
		// 				.set('permissionInfo', fromJS(permissionInfo))
		// 				.setIn(['data', 'userInfo'], fromJS(receivedData))
		// 				.setIn(['views', 'sobexist'], !!receivedData.sobList.length)
		// 				.setIn(['views', 'loadingUserInfo'], true)
		// 				.setIn(['views', 'URL_POSTFIX'], `network=wifi&source=desktop&version=${XFNVERSION}&timestamp=${new Date().getTime()}&ssid=${global.ssid}`)

		// 	return state
		// },
		[ActionTypes.CHANGE_LOGIN_GUIDE_STRING]							: () => {
			return state = state.setIn(['views', action.name], action.bool)
		},
		[ActionTypes.AFTER_GET_PLAY_SOBMODE_LIST]						: () => {
			return state = state.set('moduleList', fromJS(action.receivedData))
		},
		[ActionTypes.AFTER_SET_DD_CONFIG]						: () => {
			return state = state.setIn(['views', 'setDingConfig'], action.bool)
		},
	}[action.type] || (() => state))();
};
