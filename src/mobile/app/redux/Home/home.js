import fetchApi from 'app/constants/fetch.constant.js'
import thirdParty from 'app/thirdParty'
import { browserNavigator, showMessage, DateLib } from 'app/utils'
import { ROOT, ROOTURL, GET_DD_USER_INFO, XFNVERSION } from 'app/constants/fetch.constant.js'
import { tabNames, allPermission, loginInfo } from './moduleConstants.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action.js'
import * as sobConfigActions from 'app/redux/Config/Sob/sobconfig.action'
import { Icon } from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import { fromJS } from 'immutable'

export const ActionTypes = {
    CHANGE_DDREADY_TO_TRUE   : 'CHANGE_DDREADY_TO_TRUE',
    AFTER_GET_DBLIST_FETCH   : 'AFTER_GET_DBLIST_FETCH',
    SWITCH_SELECTED_TAB      : 'SWITCH_SELECTED_TAB',
    GET_PERIOD_FETCH         : 'GET_PERIOD_FETCH',
    GET_SOB_LIST             : 'GET_SOB_LIST',
    GET_AC_LIST_FETCH        : 'GET_AC_LIST_FETCH',
    GET_AC_ASS_LIST_FETCH    : 'GET_AC_ASS_LIST_FETCH',
    CHANGE_PLEASURE_GROUND_MODULE    : 'CHANGE_PLEASURE_GROUND_MODULE',
    CHANGE_SYSTEM_INFO       : 'CHANGE_SYSTEM_INFO',
    AFTER_GET_ADMINNAME_LIST : 'AFTER_GET_ADMINNAME_LIST',
    CHANGE_LOGIN_GUIDE_STRING : 'CHANGE_LOGIN_GUIDE_STRING',
    BEFORE_INSERT_GET_MODEL_FCLIST : 'BEFORE_INSERT_GET_MODEL_FCLIST',
    AFTER_GET_PLAY_SOBMODE_LIST    : 'AFTER_GET_PLAY_SOBMODE_LIST',
    AFTER_SET_DD_CONFIG            : 'AFTER_SET_DD_CONFIG',
    AFTER_CHANGE_LOCK_SECRET       : 'AFTER_CHANGE_LOCK_SECRET',
}

const homeState = fromJS({
    views: {
        ddReady: false,
        selectedTab: 'Home',
        isPlay: false,
        firstToSecurity: false, // 登录引导
		firstToSobInsert: false, // 登录引导
		firstToSob: false, // 登录引导
        firstToWelcome: false, // 登录引导
        setDingConfig: false, // 钉钉鉴权
    },
    data: {
		userInfo: {
			sobInfo: {
				sobId: '',
				sobName: '',
				// ["GL", "ENCLOSURE_RUN", "ASSETS", "CURRENCY", "ASS", "RUNNING", "AMB", "ENCLOSURE_GL", "NUMBER"]
				moduleInfo: [],
				roleInfo: [],
                //enableWarehouse: false//是否开启仓库管理
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
            moduleInfo: [],
            packInfoList: [],
            securityCenterModified: false,
            lockSecret: {
				lockTime: -1,
				secret: ''
			}
		}
	},
    adminNameList: {
        financeList: [],
        adminList: [],
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
                permission: false,
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
                disabledTip: '账套总管理员才可以导出Excel',
            }
		},
		Config: {
			'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '只有管理员可以修改',
            },
            'importExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '只有管理员可以导入',
            }
		},
		LrAccount: {
			'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '只有管理员可以修改',
            },
			review: {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            }
		}
	},
	navbarList: ['Edit', 'Search', 'Report', 'Yeb', 'Mxb'],
    moduleList: {
		accountModelList: [],
		jrModelList: []
	}
})

// Reducer
export default function reducer(state = homeState, action = {}) {
    return ({
        [ActionTypes.CHANGE_DDREADY_TO_TRUE]            : () => state.setIn(['views' ,'ddReady'], true),
        [ActionTypes.GET_DBLIST_FETCH]					: () => state.setIn(['data' ,'userInfo'], fromJS(action.receivedData)),
        [ActionTypes.SWITCH_SELECTED_TAB]			    : () => state.setIn(['views' ,'selectedTab'], action.selectedTab),
        [ActionTypes.CHANGE_PLEASURE_GROUND_MODULE]	    : () => state.setIn(['views', 'isPlay'], action.bool),
        // 登录后，初始化页面的显示模块，权限模块
		[ActionTypes.AFTER_GET_DBLIST_FETCH]		      : () => {

			let receivedData = action.receivedData
			// 调试
			// receivedData = loginInfo

			const sobInfo = receivedData.sobInfo
            const expireInfo = receivedData.moduleInfo
            const sobList = receivedData.sobList
            const pageController = receivedData.pageController

            if (receivedData.lockSecret.secret) {
				receivedData.lockSecret.secret = window.atob(receivedData.lockSecret.secret)
			}

			if (!sobInfo) { // 无账套
				return state.setIn(['data', 'userInfo'], fromJS(receivedData))
							.setIn(['views', 'sobexist'], !!receivedData.sobList.length)
			}

			const moduleInfo = sobInfo.moduleInfo
			const roleInfo = sobInfo.roleInfo
            const newJr = sobInfo.newJr
            const openProcess = true

			let pageList = homeState.get('pageList')

			// const roleList = ['ADMIN', 'CASHIER', 'FLOW_OBSERVER', 'FLOW_REVIEW', 'OBSERVER', 'REVIEW', 'OPERATOR', 'VC_OBSERVER', 'VC_REVIEW']
			// const moduleInfo = ["GL", "ENCLOSURE_RUN", "ASSETS", "CURRENCY", "ASS", "RUNNING", "AMB", "ENCLOSURE_GL", "NUMBER"]

            if (moduleInfo.indexOf('RUNNING') > -1) { // 智能版

                if (newJr === true) { // 新版

                    if (openProcess && moduleInfo.indexOf('PROCESS') > -1 && pageController.INITIATE_PROCESS && (pageController.INITIATE_PROCESS.display === '全部权限' || pageController.INITIATE_PROCESS.display === '部分权限')) {
						pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
							name: '发起审批',
							key: 'EditApproval',
						})))
					}

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
                        if (pageController.REPORT.preDetailList.BOSS_REPORT && pageController.REPORT.preDetailList.BOSS_REPORT.open) {
                            pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
                                name: '老板表',
                                key: 'Boss'
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
								key: 'kmyeb'
							})))
							pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
								name: '科目明细表',
								key: 'kmmxb',
							})))
						}
					}

					if (pageController.MANAGER && pageController.MANAGER.display === '全部权限' || pageController.MANAGER.display === '部分权限') {
						if (pageController.MANAGER.preDetailList.JR_SETTING && pageController.MANAGER.preDetailList.JR_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '流水设置',
								key: 'RunningConfig',
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
								key: 'RelativeConfig',
							})))
						}
						if (moduleInfo.indexOf('PROJECT') > -1 && pageController.MANAGER.preDetailList.PROJECT_SETTING && pageController.MANAGER.preDetailList.PROJECT_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '项目设置',
								key: 'ProjectConfig',
							})))
						}
						if (moduleInfo.indexOf('INVENTORY') > -1 && pageController.MANAGER.preDetailList.STOCK_SETTING && pageController.MANAGER.preDetailList.STOCK_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '存货设置',
								key: 'InventoryConfig',
							})))
						}
						if (moduleInfo.indexOf('WAREHOUSE') > -1 && pageController.MANAGER.preDetailList.WAREHOUSE_SETTING && pageController.MANAGER.preDetailList.WAREHOUSE_SETTING.open) {
							pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
								name: '仓库设置',
								key: 'WarehouseConfig',
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
								key: 'Lrls',
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
                                    {
                                        name: '老板表',
                                        key: 'Boss'
                                    },
								]))

								if (moduleInfo.indexOf('RUNNING_GL') > -1) {
									pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
										name: '科目余额表',
										key: 'kmyeb'
									})))
									pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
										name: '科目明细表',
										key: 'kmmxb',
									})))
								}
							}

							// FLOW_REVIEW 也能查看科目余额表
							if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
								if (moduleInfo.indexOf('RUNNING_GL') > -1) {
									pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
										name: '科目余额表',
										key: 'kmyeb'
									})))
									pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
										name: '科目明细表',
										key: 'kmmxb',
									})))
								}
							}
                        }

                        // 总管理员、 总观察员（及带审核的），流水观察员(及带审核的)  => 设置
                        if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
                            pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
                                name: '账户设置',
                                key: 'AccountConfig',
                            })))
                            pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
                                name: '流水设置',
                                key: 'RunningConfig',
                            })))
                            pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
                                name: '往来单位设置',
                                key: 'RelativeConfig',
                            })))
                            pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
                                name: '存货设置',
                                key: 'InventoryConfig',
                            })))
                            pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
                                name: '项目设置',
                                key: 'ProjectConfig',
                            })))
                        }
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
                    if (pageController.REPORT.preDetailList.BOSS_REPORT && pageController.REPORT.preDetailList.BOSS_REPORT.open) {
						pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
							name: '老板表',
							key: 'Boss'
						})))
                    }
				}

				if (pageController.BALANCE_DETAIL && (pageController.BALANCE_DETAIL.display === '全部权限' || pageController.BALANCE_DETAIL.display === '部分权限')) {
					if (pageController.BALANCE_DETAIL.preDetailList.AC_BALANCE_STATEMENT && pageController.BALANCE_DETAIL.preDetailList.AC_BALANCE_STATEMENT.open) {
						pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
							name: '科目余额表',
							key: 'kmyeb'
						})))
						pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
							name: '科目明细表',
							key: 'kmmxb',
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
							key: 'AcConfig',
						})))
					}
					if (moduleInfo.indexOf('ASS') > -1 && pageController.MANAGER.preDetailList.ASS_SETTING && pageController.MANAGER.preDetailList.ASS_SETTING.open) {
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '辅助设置',
							key: 'AssConfig',
						})))
					}
					if (moduleInfo.indexOf('CURRENCY') > -1 && pageController.MANAGER.preDetailList.FOREIGN_CURRENCY_SETTING && pageController.MANAGER.preDetailList.FOREIGN_CURRENCY_SETTING.open) {
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '外币设置',
							key: 'CurrencyConfig',
						})))
					}
					if (moduleInfo.indexOf('ASSETS') > -1 && pageController.MANAGER.preDetailList.ASSETS_SETTING && pageController.MANAGER.preDetailList.ASSETS_SETTING.open) {
						pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
							name: '资产设置',
							key: 'AssetsConfig',
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
                        permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OBSERVER))
                    }
                }
                // 凭证观察员带省核权限
                if (roleInfo.indexOf('VC_REVIEW') > -1) {
                    permissionInfo = permissionInfo.set('Pz',fromJS(allPermission.Pz.VC_REVIEW))
                }
                // 流水观察员带省核权限
                if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
                    permissionInfo = permissionInfo.set('LrAccount',fromJS(allPermission.LrAccount.FLOW_REVIEW))
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
			// 首页侧边栏要显示的模块名称
			let navbarList = []
			pageList.map((v, key) => (key !== 'Yeb' && key !== 'Mxb') && navbarList.push(key))

			state = state.set('pageList', pageList)
						.set('navbarList', fromJS(navbarList))
						.set('permissionInfo', fromJS(permissionInfo))
						.setIn(['data', 'userInfo'], fromJS(receivedData))
						.setIn(['views', 'sobexist'], !!receivedData.sobList.length)

			return state
		},
		// [ActionTypes.AFTER_GET_DBLIST_FETCH]		      : () => {

		// 	let receivedData = action.receivedData
		// 	// 调试
		// 	// receivedData = loginInfo

		// 	const sobInfo = receivedData.sobInfo
        //     const expireInfo = receivedData.moduleInfo
        //     const sobList = receivedData.sobList

        //     if (receivedData.lockSecret.secret) {
		// 		receivedData.lockSecret.secret = window.atob(receivedData.lockSecret.secret)
		// 	}

		// 	if (!sobInfo) { // 无账套
		// 		return state.setIn(['data', 'userInfo'], fromJS(receivedData))
		// 					.setIn(['views', 'sobexist'], !!receivedData.sobList.length)
		// 	}

		// 	const moduleInfo = sobInfo.moduleInfo
		// 	const roleInfo = sobInfo.roleInfo
        //     const newJr = sobInfo.newJr

		// 	let pageList = homeState.get('pageList')

		// 	// const roleList = ['ADMIN', 'CASHIER', 'FLOW_OBSERVER', 'FLOW_REVIEW', 'OBSERVER', 'REVIEW', 'OPERATOR', 'VC_OBSERVER', 'VC_REVIEW']
		// 	// const moduleInfo = ["GL", "ENCLOSURE_RUN", "ASSETS", "CURRENCY", "ASS", "RUNNING", "AMB", "ENCLOSURE_GL", "NUMBER"]

        //     if (newJr === true) { // 新版
        //         // 开启了总账
        //         if (moduleInfo.indexOf('GL') > -1) {
        //             // 添加 各个模块
        //             // 总管理员、 记账员   => 录入凭证
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OPERATOR') > -1) {
        //             	pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
        //             		name: '录入凭证',
        //             		key: 'Lrpz',
        //             	})))
        //             }
        //             // 总管理员、 总观察员(及带审核的)、 记账员、 凭证观察员(及带审核的)   => 查询凭证
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('OPERATOR') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
        //             	pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
        //             		name: '查询凭证',
        //             		key: 'Cxpz',
        //             	})))
        //             }
        //             // 总管理员、 总观察员（及带审核的）   => 报表
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {
        //             	pageList = pageList.setIn(['Report', 'pageList'], fromJS([
        //             		{
        //             			name: '利润表',
        //             			key: 'Lrb'
        //             		},
        //             		{
        //             			name: '资产负债表',
        //             			key: 'Zcfzb'
        //             		},
        //             		{
        //             			name: '现金流量表',
        //             			key: 'Xjllb'
        //             		},
        //             		{
        //             			name: '应交税费表',
        //             			key: 'Yjsfb'
        //             		},
        //                     {
        //             			name: '老板表',
        //             			key: 'Boss'
        //             		},
        //             	]))

        //             	if (moduleInfo.indexOf('AMB') > -1 && expireInfo.AMB) {
        //             		pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
        //             			name: '阿米巴损益',
        //             			key: 'Ambsyb'
        //             		})))
        //             	}
        //             }

        //             // 总管理员、 总观察员（及带审核的）  => 明细和余额表
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
        //             	pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             		name: '科目余额表',
        //             		key: 'kmyeb'
        //             	})))
        //             	pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             		name: '科目明细表',
        //             		key: 'kmmxb',
        //             	})))
        //             }

        //             // 总管理员、 总观察员（及带审核的）  => 明细和余额表
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {

        //             	if (moduleInfo.indexOf('ASS') > -1) {
        //             		pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             			name: '辅助余额表',
        //             			key: 'AssYeb',
        //             		})))
        //             		pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             			name: '辅助明细表',
        //             			key: 'AssMxb',
        //             		})))
        //             	}

        //             	if (moduleInfo.indexOf('CURRENCY') > -1) {
        //             		pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             			name: '外币余额表',
        //             			key: 'CurrencyYeb',
        //             		})))
        //             		pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             			name: '外币明细表',
        //             			key: 'CurrencyMxb',
        //             		})))
        //             	}

        //             	if (moduleInfo.indexOf('NUMBER') > -1) {
        //             		pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             			name: '数量余额表',
        //             			key: 'AmountYeb',
        //             		})))
        //             		pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             			name: '数量明细表',
        //             			key: 'AmountMxb',
        //             		})))
        //             	}

        //             	if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS) {
        //             		pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             			name: '资产余额表',
        //             			key: 'AssetsYeb',
        //             		})))
        //             		pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             			name: '资产明细表',
        //             			key: 'AssetsMxb',
        //             		})))
        //             	}
        //             }
        //             // 总管理员、 总观察员（及带审核的），凭证观察员(带审核的)  => 设置
        //             // if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
        //             	pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             		name: '科目设置',
        //             		key: 'AcConfig',
        //             	})))

        //             	if (moduleInfo.indexOf('ASS') > -1) {
        //             		pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             			name: '辅助设置',
        //             			key: 'AssConfig',
        //             		})))
        //             	}

        //             	if (moduleInfo.indexOf('CURRENCY') > -1) {
        //             		pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             			name: '外币设置',
        //             			key: 'CurrencyConfig',
        //             		})))
        //             	}
        //             	if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS) {
        //             		pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             			name: '资产设置',
        //             			key: 'AssetsConfig',
        //             		})))
        //             	}
        //             // }
        //             }
        //             // 开启流水账的
        //             if (moduleInfo.indexOf('RUNNING') > -1 && !expireInfo.RUNNING) {
        //             thirdParty.Alert('智能版已过期，钉钉管理员可前往钉钉应用中心续费即可继续使用')
        //             }
        //             // if (moduleInfo.indexOf('RUNNING') > -1 && expireInfo.RUNNING) {
        //             if (moduleInfo.indexOf('RUNNING') > -1) {
        //             // 总管理员、 出纳员   => 录入流水
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('CASHIER') > -1) {
        //             	pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
        //             		name: '录入流水',
        //             		key: 'EditRunning',
        //             	})))
        //             }

        //             // 总管理员、 总观察员(及带审核的)、 记账员、 流水观察员(开启总账没有流水审核权限)   => 查询流水
        //             // 改： 凭证观察员(及带审核的)也能查看凭证
        //             console.log('roleInfo', roleInfo);

        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1 || roleInfo.indexOf('CASHIER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //                 if (moduleInfo.indexOf('PROCESS') > -1) {
        //                     // if (receivedData.openProcess === true) { // 条件条件
        //                     pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
        //                         name: '查询审批',
        //                         key: 'SearchApproval',
        //                     })))
        //                 }
        //             	pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
        //             		name: '查询流水',
        //             		key: 'SearchRunning',
        //             	})))
        //             }
        //             // ADMIN,OBSERVER,REVIEW 可以查看凭证
        //             // 改： 智能版，带审核的流水观察员可以查看凭证
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //             	if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
        //             		pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
        //             			name: '查询凭证',
        //             			key: 'Cxpz',
        //             		})))
        //             	}
        //             }

        //             // 带总账的不需要再次设置报表， 否则 总管理员、 总观察员（及带审核的）  => 报表
        //             if (moduleInfo.indexOf('GL') === -1) {
        //             	if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {
        //             		pageList = pageList.setIn(['Report', 'pageList'], fromJS([
        //             			{
        //             				name: '利润表',
        //             				key: 'Lrb'
        //             			},
        //             			{
        //             				name: '资产负债表',
        //             				key: 'Zcfzb'
        //             			},
        //             			{
        //             				name: '现金流量表',
        //             				key: 'Xjllb'
        //             			},
        //             			{
        //             				name: '应交税费表',
        //             				key: 'Yjsfb'
        //             			},
        //                         {
        //                             name: '老板表',
        //                             key: 'Boss'
        //                         },
        //             		]))
        //                     if (moduleInfo.indexOf('PROJECT') > -1) {
        //                         pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
        //                           name: '阿米巴损益表',
        //                           key: 'Syxmb'
        //                         })))
        //                     }

        //                     if (moduleInfo.indexOf('RUNNING_GL') > -1) {
        //             			pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             				name: '科目余额表',
        //             				key: 'kmyeb'
        //             			})))
        //             			pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             				name: '科目明细表',
        //             				key: 'kmmxb',
        //             			})))
        //             		}
        //             	}

        //                 // FLOW_REVIEW 也能查看科目余额表
        //                 if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //                     if (moduleInfo.indexOf('RUNNING_GL') > -1) {
        //                         pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                             name: '科目余额表',
        //                             key: 'kmyeb'
        //                         })))
        //                         pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //                             name: '科目明细表',
        //                             key: 'kmmxb',
        //                         })))
        //                     }
        //                 }
        //             }

        //             // 总管理员、 总观察员（及带审核的）  => 明细和余额表
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //                 pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                     name: '收支余额表',
        //                     key: 'IncomeExpendYeb',
        //                 })))
        //                 pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                     name: '账户余额表',
        //                     key: 'AccountYeb',
        //                 })))
        //                 pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                     name: '往来余额表',
        //                     key: 'RelativeYeb',
        //                 })))
        //                 if (moduleInfo.indexOf('PROJECT') > -1) {
        //                     pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                         name: '项目余额表',
        //                         key: 'ProjectYeb',
        //                     })))
        //                 }
        //                 pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                     name: '类型余额表',
        //                     key: 'RunningTypeYeb',
        //                 })))
        //                 if (moduleInfo.indexOf('INVENTORY') > -1) {
        //                     pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                         name: '库存余额表',
        //                         key: 'InventoryYeb',
        //                     })))
        //                 }
        //             }

        //             // 总管理员、 总观察员（及带审核的），流水观察员(及带审核的)  => 设置
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //             	pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             		name: '账户设置',
        //             		key: 'AccountConfig',
        //             	})))
        //                 pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             		name: '流水设置',
        //             		key: 'RunningConfig',
        //             	})))
        //             	pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             		name: '往来单位设置',
        //             		key: 'RelativeConfig',
        //                 })))
        //                 if (moduleInfo.indexOf('INVENTORY') > -1) {
        //                     pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                         name: '存货设置',
        //                         key: 'InventoryConfig',
        //                     })))
        //                 }
        //                 if (moduleInfo.indexOf('PROJECT') > -1) {
        //                     pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                         name: '项目设置',
        //                         key: 'ProjectConfig',
        //                     })))
        //                 }
        //                 // if (sobInfo.enableWarehouse) {//开启了仓库设置
        //                 if (moduleInfo.indexOf('WAREHOUSE') > -1) {//开启了仓库设置
        //                     pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                 		name: '仓库设置',
        //                 		key: 'WarehouseConfig',
        //                 	})))
        //                 }
        //                 if (moduleInfo.indexOf('PROCESS') > -1) { // 条件条件
        //                     // if (receivedData.openProcess === true) { // 条件条件
        //                     pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                         name: '审批设置',
        //                         key: 'Approval',
        //                     })))
        //                 }
        //             }
        //         }
        //     } else {  // 旧版
        //         // 开启了总账
        //         if (moduleInfo.indexOf('GL') > -1) {
        //             // 添加 各个模块
        //             // 总管理员、 记账员   => 录入凭证
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OPERATOR') > -1) {
        //             	pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
        //             		name: '录入凭证',
        //             		key: 'Lrpz',
        //             	})))
        //             }
        //             // 总管理员、 总观察员(及带审核的)、 记账员、 凭证观察员(及带审核的)   => 查询凭证
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('OPERATOR') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
        //             	pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
        //             		name: '查询凭证',
        //             		key: 'Cxpz',
        //             	})))
        //             }
        //             // 总管理员、 总观察员（及带审核的）   => 报表
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {
        //             	pageList = pageList.setIn(['Report', 'pageList'], fromJS([
        //             		{
        //             			name: '利润表',
        //             			key: 'Lrb'
        //             		},
        //             		{
        //             			name: '资产负债表',
        //             			key: 'Zcfzb'
        //             		},
        //             		{
        //             			name: '现金流量表',
        //             			key: 'Xjllb'
        //             		},
        //             		{
        //             			name: '应交税费表',
        //             			key: 'Yjsfb'
        //             		},
        //                     {
        //             			name: '老板表',
        //             			key: 'Boss'
        //             		},
        //             	]))

        //             	if (moduleInfo.indexOf('AMB') > -1 && expireInfo.AMB) {
        //             		pageList = pageList.updateIn(['Report', 'pageList'], v => v.push(fromJS({
        //             			name: '阿米巴损益',
        //             			key: 'Ambsyb'
        //             		})))
        //             	}
        //             }

        //             // 总管理员、 总观察员（及带审核的）  => 明细和余额表
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
        //             	pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             		name: '科目余额表',
        //             		key: 'kmyeb'
        //             	})))
        //             	pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             		name: '科目明细表',
        //             		key: 'kmmxb',
        //             	})))
        //             }

        //             // 总管理员、 总观察员（及带审核的）  => 明细和余额表
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {

        //             	if (moduleInfo.indexOf('ASS') > -1) {
        //             		pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             			name: '辅助余额表',
        //             			key: 'AssYeb',
        //             		})))
        //             		pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             			name: '辅助明细表',
        //             			key: 'AssMxb',
        //             		})))
        //             	}

        //             	if (moduleInfo.indexOf('CURRENCY') > -1) {
        //             		pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             			name: '外币余额表',
        //             			key: 'CurrencyYeb',
        //             		})))
        //             		pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             			name: '外币明细表',
        //             			key: 'CurrencyMxb',
        //             		})))
        //             	}

        //             	if (moduleInfo.indexOf('NUMBER') > -1) {
        //             		pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             			name: '数量余额表',
        //             			key: 'AmountYeb',
        //             		})))
        //             		pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             			name: '数量明细表',
        //             			key: 'AmountMxb',
        //             		})))
        //             	}

        //             	if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS) {
        //             		pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             			name: '资产余额表',
        //             			key: 'AssetsYeb',
        //             		})))
        //             		pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             			name: '资产明细表',
        //             			key: 'AssetsMxb',
        //             		})))
        //             	}
        //             }
        //             // 总管理员、 总观察员（及带审核的），凭证观察员(带审核的)  => 设置
        //             // if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1) {
        //             	pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             		name: '科目设置',
        //             		key: 'AcConfig',
        //             	})))

        //             	if (moduleInfo.indexOf('ASS') > -1) {
        //             		pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             			name: '辅助设置',
        //             			key: 'AssConfig',
        //             		})))
        //             	}

        //             	if (moduleInfo.indexOf('CURRENCY') > -1) {
        //             		pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             			name: '外币设置',
        //             			key: 'CurrencyConfig',
        //             		})))
        //             	}
        //             	if (moduleInfo.indexOf('ASSETS') > -1 && expireInfo.ASSETS) {
        //             		pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //             			name: '资产设置',
        //             			key: 'AssetsConfig',
        //             		})))
        //             	}
        //             // }
        //             }
        //             // 开启流水账的
        //             if (moduleInfo.indexOf('RUNNING') > -1 && !expireInfo.RUNNING) {
        //             thirdParty.Alert('智能版已过期，钉钉管理员可前往钉钉应用中心续费即可继续使用')
        //             }
        //             if (moduleInfo.indexOf('RUNNING') > -1 && expireInfo.RUNNING) {
        //             // if (moduleInfo.indexOf('RUNNING') > -1) {
        //             // 总管理员、 出纳员   => 录入流水
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('CASHIER') > -1) {
        //             	pageList = pageList.updateIn(['Edit', 'pageList'], v => v.push(fromJS({
        //             		name: '录入流水',
        //             		key: 'Lrls',
        //             	})))
        //             }

        //             // 总管理员、 总观察员(及带审核的)、 记账员、 流水观察员(开启总账没有流水审核权限)   => 查询流水
        //             // 改： 凭证观察员(及带审核的)也能查看凭证
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('VC_OBSERVER') > -1 || roleInfo.indexOf('VC_REVIEW') > -1 || roleInfo.indexOf('CASHIER') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //             	pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
        //             		name: '查询流水',
        //             		key: 'Cxls',
        //             	})))
        //             }
        //             // ADMIN,OBSERVER,REVIEW 可以查看凭证
        //             // 改： 智能版，带审核的流水观察员可以查看凭证
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //             	if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
        //             		pageList = pageList.updateIn(['Search', 'pageList'], v => v.push(fromJS({
        //             			name: '查询凭证',
        //             			key: 'Cxpz',
        //             		})))
        //             	}
        //             }

        //             // 带总账的不需要再次设置报表， 否则 总管理员、 总观察员（及带审核的）  => 报表
        //             if (moduleInfo.indexOf('GL') === -1) {
        //             	if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1) {
        //             		pageList = pageList.setIn(['Report', 'pageList'], fromJS([
        //             			{
        //             				name: '利润表',
        //             				key: 'Lrb'
        //             			},
        //             			{
        //             				name: '资产负债表',
        //             				key: 'Zcfzb'
        //             			},
        //             			{
        //             				name: '现金流量表',
        //             				key: 'Xjllb'
        //             			},
        //             			{
        //             				name: '应交税费表',
        //             				key: 'Yjsfb'
        //             			},
        //                         {
        //                             name: '老板表',
        //                             key: 'Boss'
        //                         },
        //             		]))

        //                     if (moduleInfo.indexOf('RUNNING_GL') > -1) {
        //             			pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //             				name: '科目余额表',
        //             				key: 'kmyeb'
        //             			})))
        //             			pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //             				name: '科目明细表',
        //             				key: 'kmmxb',
        //             			})))
        //             		}
        //             	}

        //                 // FLOW_REVIEW 也能查看科目余额表
        //                 if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //                     if (moduleInfo.indexOf('RUNNING_GL') > -1) {
        //                         pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                             name: '科目余额表',
        //                             key: 'kmyeb'
        //                         })))
        //                         pageList = pageList.updateIn(['Mxb', 'pageList'], v => v.push(fromJS({
        //                             name: '科目明细表',
        //                             key: 'kmmxb',
        //                         })))
        //                     }
        //                 }
        //             }

        //             // 总管理员、 总观察员（及带审核的）  => 明细和余额表
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('OBSERVER_REVIEW') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //                 pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                 	name: '流水余额表',
        //                 	key: 'RunningYeb',
        //                 })))
        //                 pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                     name: '账户余额表',
        //                     key: 'ZhYeb',
        //                 })))
        //                 pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                     name: '往来余额表',
        //                     key: 'WlYeb',
        //                 })))
        //                 pageList = pageList.updateIn(['Yeb', 'pageList'], v => v.push(fromJS({
        //                     name: '项目余额表',
        //                     key: 'XmYeb',
        //                 })))
        //             }

        //             // 总管理员、 总观察员（及带审核的），流水观察员(及带审核的)  => 设置
        //             if (roleInfo.indexOf('ADMIN') > -1 || roleInfo.indexOf('OBSERVER') > -1 || roleInfo.indexOf('REVIEW') > -1 || roleInfo.indexOf('FLOW_OBSERVER') > -1 || roleInfo.indexOf('FLOW_REVIEW') > -1) {
        //                 pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                     name: '账户设置',
        //                     key: 'AccountConfig',
        //                 })))
        //                 pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                     name: '流水设置',
        //                     key: 'RunningConfig',
        //                 })))
        //                 pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                     name: '往来单位设置',
        //                     key: 'RelativeConfig',
        //                 })))
        //                 pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                     name: '存货设置',
        //                     key: 'InventoryConfig',
        //                 })))
        //                 pageList = pageList.updateIn(['Config', 'pageList'], v => v.push(fromJS({
        //                     name: '项目设置',
        //                     key: 'ProjectConfig',
        //                 })))
        //             }
        //         }
        //     }

        //     // 设置权限
		// 	let permissionInfo = homeState.get('permissionInfo')
		// 	// 管理员的操作权限 （仅能有此一个身份）
		// 	if (roleInfo.indexOf('ADMIN') > -1) {
		// 		permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.ADMIN))
		// 									.set('Config', fromJS(allPermission.Config.ADMIN))
		// 									.set('Report', fromJS(allPermission.Report.ADMIN))
		// 									.set('LrAccount', fromJS(allPermission.LrAccount.ADMIN))

        //         if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
        //             // 智能总账的管理员对于凭证操作的权限
        //             permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OBSERVER_EXPORT))
        //         }
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

        //         if (moduleInfo.indexOf('GL') === -1 && moduleInfo.indexOf('RUNNING_GL') > -1) {
		// 			permissionInfo = permissionInfo.set('Pz', fromJS(allPermission.Pz.OBSERVER))
		// 		}
		// 	}
		// 	// 凭证观察员带省核权限
		// 	if (roleInfo.indexOf('VC_REVIEW') > -1) {
		// 		permissionInfo = permissionInfo.set('Pz',fromJS(allPermission.Pz.VC_REVIEW))
		// 	}
		// 	// 流水观察员带省核权限
		// 	if (roleInfo.indexOf('FLOW_REVIEW') > -1) {
		// 		permissionInfo = permissionInfo.set('LrAccount',fromJS(allPermission.LrAccount.FLOW_REVIEW))
        //                                         .set('Pz', fromJS(allPermission.Pz.FLOW_REVIEW))
		// 	}
        //     // 凭证观察员带审核权限， 启用总账可以
        //     if (roleInfo.indexOf('VC_REVIEW') > -1) {
        //         if (moduleInfo.indexOf('GL') === -1) {
        //             permissionInfo = permissionInfo.set('LrAccount', fromJS(allPermission.LrAccount.FLOW_REVIEW))
        //         }
        //     }


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
		// 	// 首页侧边栏要显示的模块名称
		// 	let navbarList = []
		// 	pageList.map((v, key) => (key !== 'Yeb' && key !== 'Mxb') && navbarList.push(key))

		// 	state = state.set('pageList', pageList)
		// 				.set('navbarList', fromJS(navbarList))
		// 				.set('permissionInfo', fromJS(permissionInfo))
		// 				.setIn(['data', 'userInfo'], fromJS(receivedData))
		// 				.setIn(['views', 'sobexist'], !!receivedData.sobList.length)

		// 	return state
		// },
        [ActionTypes.AFTER_GET_ADMINNAME_LIST]                     : () => {
            return state = state.set('adminNameList', fromJS(action.receivedData))
        },
        [ActionTypes.CHANGE_LOGIN_GUIDE_STRING]						 : () => {
			return state = state.setIn(['views', action.name], action.bool)
		},
        [ActionTypes.AFTER_GET_PLAY_SOBMODE_LIST]						: () => {
			return state = state.set('moduleList', fromJS(action.receivedData))
		},
        [ActionTypes.AFTER_SET_DD_CONFIG]						: () => {
			return state = state.setIn(['views', 'setDingConfig'], action.bool)
        },
        // 锁屏
		[ActionTypes.AFTER_CHANGE_LOCK_SECRET]		      : () => {
			return state = state.updateIn(['data', 'userInfo', 'lockSecret'], v => v.set('lockTime', action.lockTime).set('secret', action.secret))
		},
    }[action.type] || (() => state))()
}

// Action Creators
const homeActions = {
    // 获取当前用户信息、当前账套信息、账套信息
    getDbListFetch                     : (first, history) => (dispatch, getState) => {

        if (global.isplayground || global.isPlay) {
            if (!browserNavigator.versions.mobile && !browserNavigator.versions.ios && !browserNavigator.versions.android && !browserNavigator.versions.iPhone && !browserNavigator.versions.iPad) {
                window.location.href = 'http://dtst.xfannix.com' + "/index.html?isOV=false&isplayground=true"
            } else if (global.isPlay) {
                thirdParty.toast.loading('正在加载当前账套...', 0)
                fetchApi('getdduserinfo', 'POST', JSON.stringify({code: ''}), json => {
                    // alert('getdduserinfo:'+JSON.stringify(json))
                    if (json.code === 3) { // 异常的用户
                        thirdParty.Alert(json.message, '确定')
                    } else if (json.code === 10006) { // 钉钉异常
                        dispatch(homeActions.codeError(history))
                    } else if (json.code === Limit.REPEAT_REQUEST_CODE) {
                        thirdParty.toast.hide()
                    } else {
                        if (json.code) {
                            return showMessage(json)
                        }
                        dispatch(homeActions.afterGetDbListFetch(json, first, history))
                    }
                })
            } else { // 刚进入游乐场
                dispatch(homeActions.getPlaySobModelList())
            }
        } else {
            thirdParty.toast.loading('正在加载当前账套...', 0)

            if (browserNavigator.versions.DingTalk) { // 钉钉环境

                const ddReady = getState().homeState.getIn(['views', 'ddReady'])
                if (ddReady) {
                    dispatch(homeActions.getdduserinfoFetch('', '', history))
                } else {
                    const href = window.location.href
                    const start = href.indexOf('?')
                    let serverMessage = window.location.href.slice(start+1).split('&')
                    let corpId = ''

                    for (let i=0; i < serverMessage.length; i++) {
                        if (serverMessage[i].substr(0, 7) === 'corpid=') {
                            corpId = serverMessage[i].slice(7).replace('#/', '')
                        }
                    }

                    sessionStorage.setItem('corpId', corpId)

                    thirdParty.ready(() => {
                        // alert('ready:' + JSON.stringify(conf))
                        try {
                            thirdParty.webViewBounceDisable()
                        } catch (err) {
                            alert('dd weberror: ' + err)
                        }
                        //dd请求用户信息
                        thirdParty.requestAuthCode({
                            // corpId: conf.corpId,
                            corpId: corpId,
                            onSuccess: (result) => {
                                // alert('result:'+JSON.stringify(result))
                                dispatch(homeActions.getdduserinfoFetch(result, first, history))
                            }
                        })

                        if (!ddReady) {
                            dispatch({
                                type: ActionTypes.CHANGE_DDREADY_TO_TRUE
                            })
                        }

                        // 网络连接断开的事件监听
                        document.addEventListener('offline', (e) => {
                            e.preventDefault();
                            // alert('断网了！')
                            dispatch(allActions.changeOfflineStatus())
                        }, false);
                    })


                    // fetchApi('getddconfig', 'GET', `refreshticket=0&version=${XFNVERSION}`,json => {

                    //     // 调试信息
                    //     // alert('getddconfig:'+JSON.stringify(json))
                    //     // alert('Url:'+window.location.href)
                    //     if (json.code === 3) { // 拦截异常用户
                    //         alert(json.message)
                    //         return
                    //     } else if (json.code === Limit.REPEAT_REQUEST_CODE) {
                    //         thirdParty.toast.hide()
                    //     } else {

                    //         if (json.code) {
                    //             showMessage(json)
                    //             return
                    //         }

                    //         if (json.data.isForceReload === true) {
                    //             window.location.href=window.location.href+"?timestamp=" + new Date().getTime()
                    //             window.location.reload()
                    //         }

                    //         const _config = json.data.config
                    //         let count = 0

                    //         //配置dd
                    //         ;(function setDD(conf) {

                    //             // alert('conf:'+JSON.stringify(conf))

                    //             sessionStorage.setItem('corpId', conf.corpId)
                    //             sessionStorage.setItem('agentId', conf.agentId)

                    //             thirdParty.ready(() => {
                    //                 // alert('ready:' + JSON.stringify(conf))
                    //                 try {
                    //                     thirdParty.webViewBounceDisable()
                    //                 } catch (err) {
                    //                     alert('dd weberror: ' + err)
                    //                 }
                    //                 //dd请求用户信息
                    //                 thirdParty.requestAuthCode({
                    //                     corpId: conf.corpId,
                    //                     onSuccess: (result) => {
                    //                         dispatch(homeActions.getdduserinfoFetch(result, first, history))
                    //                     }
                    //                 })
                    //                 if (!ddReady) {
                    //                     dispatch({
                    //                         type: ActionTypes.CHANGE_DDREADY_TO_TRUE
                    //                     })
                    //                 }
                    //             })
                            // })(_config)
                        // }
                    // })
                }
            } else { // 浏览器调试环境
                if (ROOTURL.indexOf('mobile.xfannix.com') >= 0) { // 发往正式的请求拦截
                    return
                } else {
                    fetchApi('login', 'POST', {code: ''}, json => {
                        // fetchApi('getuserinfo', 'POST', JSON.stringify({code: ''}),
                        if (json.code === 3) { // 异常的用户
                            thirdParty.Alert(json.message)
                        } else {
                            if (json.code) {
                                return showMessage(json)
                            }

                            const Today = new DateLib().toString()
                            const useruuid = json.data.useruuid
                            const lastLogInData = localStorage.getItem(useruuid)

                            if (lastLogInData !== Today) {
                                sessionStorage.setItem('TodayFirstIn', 'TRUE')
                                localStorage.setItem(useruuid, Today)
                            } else {
                                sessionStorage.setItem('TodayFirstIn', 'FALSE')
                            }

                            dispatch(homeActions.afterGetDbListFetch(json, first, history))
                        }
                    })
                }
            }
        }
    },
    setDdConfig: () => (dispatch, getState) => {

        if (!browserNavigator.versions.DingTalk || global.isPlay) { // 不是钉钉环境不用
            return
        }
        if (!getState().homeState.getIn(['views', 'setDingConfig'])) {
            dispatch({
                type: ActionTypes.AFTER_SET_DD_CONFIG,
                bool: true
            })
            fetchApi('getddconfig', 'GET', `refreshticket=0&version=${XFNVERSION}`,json => {

                // 调试信息
                // alert('getddconfig:'+JSON.stringify(json))
                // alert('Url:'+window.location.href)
                if (json.code === 3) { // 拦截异常用户
                    alert(json.message)
                    dispatch({
                        type: ActionTypes.AFTER_SET_DD_CONFIG,
                        bool: false
                    })
                    return
                } else {
                    if (json.code) {
                        showMessage(json)
                        dispatch({
                            type: ActionTypes.AFTER_SET_DD_CONFIG,
                            bool: false
                        })
                        return
                    }

                    const _config = json.data.config
                    let count = 0

                    //配置dd
                    ;(function setDD(conf) {
                        thirdParty.config(conf)
                        // dispatch({
                        //     type: ActionTypes.AFTER_SET_DD_CONFIG,
                        //     bool: true
                        // })
                        //dd配置校验失败时触发
                        thirdParty.error((err) => {
                            alert('dd error: ' + JSON.stringify(err))
                            if (++count > 1)
                                return alert('二次校验失败，请重新打开页面')

                            //请求更新ticket并重新装填新的配置
                            fetchApi('getddconfig', 'GET', 'refreshticket=1', json => {

                                // alert('Url:'+window.location.href)
                                // alert('getddconfig2'+JSON.stringify(json))
                                if (showMessage(json)) {
                                    setDD(json.data.config)
                                } else {
                                    dispatch({
                                        type: ActionTypes.AFTER_SET_DD_CONFIG,
                                        bool: false
                                    })
                                }
                            })
                        })
                    })(_config)
                }
            })
        }
    },
// // Action Creators
// const homeActions = {
//     // 获取当前用户信息、当前账套信息、账套信息
//     getDbListFetch                     : (first, history) => (dispatch, getState) => {

//         if (global.isplayground) {
//             if (!browserNavigator.versions.mobile && !browserNavigator.versions.ios && !browserNavigator.versions.android && !browserNavigator.versions.iPhone && !browserNavigator.versions.iPad) {
//                 window.location.href = 'http://dtst.xfannix.com' + "/index.html?isOV=false&isplayground=true"
//             } else if (global.isPlay) {
//                 thirdParty.toast.loading('正在加载当前账套...', 0)
//                 fetchApi('getdduserinfo', 'POST', JSON.stringify({code: ''}), json => {
//                     // alert('getdduserinfo:'+JSON.stringify(json))
//                     if (json.code === 3) { // 异常的用户
//                         thirdParty.Alert(json.message, '确定')
//                     } else if (json.code === 10006) { // 钉钉异常
//                         dispatch(homeActions.codeError(history))
//                     } else if (json.code === Limit.REPEAT_REQUEST_CODE) {
//                         thirdParty.toast.hide()
//                     } else {
//                         if (json.code) {
//                             return showMessage(json)
//                         }
//                         dispatch(homeActions.afterGetDbListFetch(json, first, history))
//                     }
//                 })
//             } else { // 刚进入游乐场
//                 dispatch(homeActions.getPlaySobModelList())
//             }
//         } else {
//             thirdParty.toast.loading('正在加载当前账套...', 0)

//             if (browserNavigator.versions.DingTalk) { // 钉钉环境

//                 const ddReady = getState().homeState.getIn(['views', 'ddReady'])
//                 if (ddReady) {
//                     dispatch(homeActions.getdduserinfoFetch('', '', history))
//                 } else {
//                     fetchApi('getddconfig', 'GET', `refreshticket=0&version=${XFNVERSION}`,json => {

//                         // 调试信息
//                         // alert('getddconfig:'+JSON.stringify(json))
//                         // alert('Url:'+window.location.href)
//                         if (json.code === 3) { // 拦截异常用户
//                             alert(json.message)
//                             return
//                         } else if (json.code === Limit.REPEAT_REQUEST_CODE) {
//                             thirdParty.toast.hide()
//                         } else {

//                             if (json.code) {
//                                 showMessage(json)
//                                 return
//                             }

//                             if (json.data.isForceReload === true) {
//                                 window.location.href=window.location.href+"?timestamp=" + new Date().getTime()
//                                 window.location.reload()
//                             }

//                             const _config = json.data.config
//                             let count = 0

//                             //配置dd
//                             ;(function setDD(conf) {

//                                 // alert('conf:'+JSON.stringify(conf))
//                                 thirdParty.config(conf)

//                                 //dd配置校验失败时触发
//                                 thirdParty.error((err) => {
//                                     alert('dd error: ' + JSON.stringify(err))
//                                     if (++count > 1)
//                                         return alert('二次校验失败，请重新打开页面')

//                                     //请求更新ticket并重新装填新的配置
//                                     fetchApi('getddconfig', 'GET', 'refreshticket=1', json => {

//                                         // alert('Url:'+window.location.href)
//                                         // alert('getddconfig2'+JSON.stringify(json))
//                                         setDD(json.data.config)
//                                     })
//                                 })

//                                 //dd配置校验成功时触发
//                                 thirdParty.ready(() => {

//                                     // alert('ready:' + JSON.stringify(conf))
//                                     try {
//                                         thirdParty.webViewBounceDisable()
//                                     } catch (err) {
//                                         alert('dd weberror: ' + err)
//                                     }

//                                     sessionStorage.setItem('corpId', conf.corpId)
//                                     sessionStorage.setItem('agentId', conf.agentId)

//                                     if (!ddReady) {
//                                         dispatch({
//                                             type: ActionTypes.CHANGE_DDREADY_TO_TRUE
//                                         })
//                                     }

//                                     //dd请求用户信息
//                                     thirdParty.requestAuthCode({
//                                         corpId: conf.corpId,
//                                         onSuccess: (result) => {
//                                             dispatch(homeActions.getdduserinfoFetch(result, first, history))
//                                         }
//                                     })
//                                 })
//                             })(_config)
//                         }
//                     })
//                 }
//             } else { // 浏览器调试环境
//                 if (ROOTURL.indexOf('mobile.xfannix.com') >= 0) { // 发往正式的请求拦截
//                     return
//                 } else {
//                     fetchApi('login', 'POST', {code: ''}, json => {
//                         // fetchApi('getuserinfo', 'POST', JSON.stringify({code: ''}),
//                         if (json.code === 3) { // 异常的用户
//                             thirdParty.Alert(json.message)
//                         } else {
//                             if (json.code) {
//                                 return showMessage(json)
//                             }

//                             const Today = new DateLib().toString()
//                             const useruuid = json.data.useruuid
//                             const lastLogInData = localStorage.getItem(useruuid)

//                             if (lastLogInData !== Today) {
//                                 sessionStorage.setItem('TodayFirstIn', 'TRUE')
//                                 localStorage.setItem(useruuid, Today)
//                             } else {
//                                 sessionStorage.setItem('TodayFirstIn', 'FALSE')
//                             }

//                             dispatch(homeActions.afterGetDbListFetch(json, first, history))
//                         }
//                     })
//                 }
//             }
//         }
//     },
    getPlaySobModelList                : () => dispatch => {
        fetchApi('getPlaySobModelList', 'GET', '', json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.AFTER_GET_PLAY_SOBMODE_LIST,
                    receivedData: json.data
                })
            }
        })
    },
    // 钉钉获取用户信息
    getdduserinfoFetch                 : (result, first, history) => dispatch => {
        fetchApi('getdduserinfo', 'POST', JSON.stringify(result ? result : {code: ''}), json => {
            // alert('getdduserinfo:'+JSON.stringify(json))
            if (json.code === 3) { // 异常的用户
                thirdParty.Alert(json.message, '确定')
            } else if (json.code === 10006) { // 钉钉异常
                dispatch(homeActions.codeError(history))
            } else if (json.code === Limit.REPEAT_REQUEST_CODE) {
                thirdParty.toast.hide()
            } else {
                if (json.code) {
                    return showMessage(json)
                }
                if (first === 'first') {
                    const Today = new DateLib().toString()
                    const useruuid = json.data.useruuid
                    const lastLogInData = localStorage.getItem(useruuid)

                    if (lastLogInData !== Today) {
                        sessionStorage.setItem('TodayFirstIn', 'TRUE')
                        localStorage.setItem(useruuid, Today)
                    } else {
                        sessionStorage.setItem('TodayFirstIn', 'FALSE')
                    }
                }
                dispatch(homeActions.afterGetDbListFetch(json, first, history))
            }
        })
        // 仅此蒙层提示 '正在加载当前账套...'
    },
    // 获取到用户信息
    afterGetDbListFetch                : (receivedData, first, history) => (dispatch, getState) => {
        // receivedData = loginInfo
        // 由后端开启调试 未启用

        sessionStorage.setItem('corpId', receivedData.data.corpId)
        if (receivedData.data.tracing && receivedData.data.tracing === 'TRUE') {
            global.TRACING = true
        }

        // if (receivedData.data.newEquity === false) {
        //     return thirdParty.Confirm({
        //         message: '当前为小番新版界面，升级后将不再收到本消息。返回之前版本，需进入“超级管理”自行升级。',
        //         title: "提示",  //可传空
        //         buttonLabels: ["返回之前版本", "升级新版"],
        //         onSuccess : function(result) {
        //             thirdParty.toast.loading('加载中...')
        //             if (result.buttonIndex === 0) {
        //                 window.location.replace(`https://fannixddfe1.hz.taeapp.com/build/v0/mobile/app/index.html?dd_nav_bgcolor=FF5EC9F6&isOV=true&corpid=${sessionStorage.getItem('corpId')}`) && sessionStorage.clear()
        //             } else if (result.buttonIndex === 1) {
        //                 // if (receivedData.data.isAdmin === 'TRUE') {
        //                     thirdParty.Confirm({
        //                         message: '升级新版后将不能返回之前版本',
        //                         title: "提示",  //可传空
        //                         buttonLabels: ["返回之前版本", "确认"],
        //                         onSuccess : function(result) {
        //                             if (result.buttonIndex === 0) {
        //                                 window.location.replace(`https://fannixddfe1.hz.taeapp.com/build/v0/mobile/app/index.html?dd_nav_bgcolor=FF5EC9F6&isOV=true&corpid=${sessionStorage.getItem('corpId')}`) && sessionStorage.clear()
        //                             } else if (result.buttonIndex === 1) {
        //                                 dispatch(homeActions.updateNewEntry(history))
        //                             }
        //                         }
        //                     })
        //                 // } else {
        //                 //     thirdParty.toast.info('请联系钉钉管理员升级', 0)
        //                 // }
        //             }
        //         },
        //         onFail : function(err) {}
        //     })
            // window.location.replace(`https://fannixddfe0.hz.taeapp.com/build/v0/mobile/app/index.html?dd_nav_bgcolor=FFFFFFFF&isOV=true&corpid=${sessionStorage.getItem('corpId')}`) && sessionStorage.clear()
        // }

        // 调试假数据
        // receivedData.data.warning = {
        //     "content":"亲爱的小番用户：",
        //     "webStyle":"alert",
        //     "context":["160账套版已到期"],
        //     "comments":"若体验不错，可由“账套设置”-“超级管理”进行购买，咨询热线：0571-28121680",
        //     "detail":"了解更多",
        //     "expirationTime":""
        // }

        const TodayFirstIn = sessionStorage.getItem('TodayFirstIn')
        if (first === 'first') { // 首次进入需要弹快到期的信息及到期信息

            const warning = receivedData.data.warning

            // warning.context.some(v => v.indexOf('增值包') === -1) 用来判断总账是否到期
            // 总账的每次都提示，增值包每天第一次提示
            if (warning.context.some(v => v.indexOf('增值包') === -1) || TodayFirstIn === 'TRUE') {
                let userTipStr = warning && warning.context.length ? warning.context.join(',') : ''

                if (userTipStr !== '') {

                    const connectTipStr = warning.content + userTipStr + '。' + warning.comments

                    if (warning.webStyle === 'alert') {

                        if (warning.detail === '了解更多') {

                            if (warning.context[0].indexOf('已到期') > -1) {
                                thirdParty.toast.hide()
                                thirdParty.Confirm({
                                    message: connectTipStr,
                                    title: "提示",
                                    buttonLabels: ['了解更多', '立即购买'],
                                    onSuccess : function(result) {
                                        if (result.buttonIndex === 0) {
                                            history.push('/other/payguide')
                                        } else if (result.buttonIndex === 1) {
                                            thirdParty.openLink({
                                                // url: `https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&goodsCode=FW_GOODS-1000302451&corpId=${sessionStorage.getItem('corpId')}`
                                                url: `https://h5.dingtalk.com/open-market/skuDetail.html?showmenu=false&dd_share=false&corpId=${sessionStorage.getItem('corpId')}&articleCode=FW_GOODS-1000302451&source=STORE_HOMEPAGE`
                                            })
                                        }
                                    },
                                    onFail : function(err) {}
                                })
                            } else {
                                thirdParty.toast.hide()
                                thirdParty.Confirm({
                                    message: connectTipStr,
                                    title: "提示",
                                    buttonLabels: ['知道了', warning.detail],
                                    onSuccess : function(result) {
                                        if (result.buttonIndex === 0) {
                                            return
                                        } else if (result.buttonIndex === 1) {
                                            history.push('/other/payguide')
                                        }
                                    },
                                    onFail : function(err) {}
                                })
                            }
                        } else {
                            thirdParty.toast.hide()
                            thirdParty.Alert(connectTipStr, '知道了')
                        }
                    } else {
                        thirdParty.toast.info(connectTipStr, 3)
                    }
                } else {
                    thirdParty.toast.hide()
                }
            } else {
                thirdParty.toast.hide()
            }

        } else {
            thirdParty.toast.hide()
        }

        if (receivedData.data.warning.detail === '了解更多') { // 需要升级指引
            if (receivedData.data.warning.expirationTime === '') { // 已到期
                // 拼接noticeList
                receivedData.data.noticeList.push({
                    content: '应用已到期, 点击查看详情',
                    url: `${ROOTURL}/index.html#/payguide`,
                    type: 'local'
                })
            } else { // 差3天以内,在noticeList提示
                const expirationTime = new DateLib(receivedData.data.warning.expirationTime)
                const expirationMonth = expirationTime.getMonth()
                const expirationDay = expirationTime.getDay()

                receivedData.data.noticeList.push({
                    content: `应用将于${parseInt(expirationMonth)}.${parseInt(expirationDay)}到期，点击查看详情`,
                    url: `${ROOTURL}/build/mobile/app/index.html#/payguide`,
                    type: 'local'
                })
            }
        }

        const sobInfo = receivedData.data.sobInfo
        sessionStorage.setItem('psiSobId', sobInfo ? sobInfo.sobId : '')
        global.ssid = receivedData.data.ssid

        // dispatch({
        //     type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
        //     name: 'firstToSecurity',
        //     bool: true
        // })
        // history.push('/config/security/index')

        if (!sobInfo) { // 名下没有账套

            if (receivedData.data.isAdmin === 'TRUE' || receivedData.data.isDdAdmin === 'TRUE' || receivedData.data.isDdPriAdmin === 'TRUE' || receivedData.data.isFinance === 'TRUE') {
                // 超级管理员、钉钉管理员，钉钉子管理员、财务经理 可以新增账套
                dispatch(homeActions.beforeInsertGetModelFCList())
                if (receivedData.data.isAdmin === 'TRUE') {
                    if (receivedData.data.securityCenterModified === 'FALSE') { //超级管理员 且公司从未保存过安全中心 跳安全中心
                        dispatch({
                            type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                            name: 'firstToSecurity',
                            bool: true
                        })
                        history.push('/config/security/index')
                    } else {
                        // if (receivedData.data.sobNumber > receivedData.data.usedSobNumber) { // 有账套余额
                        //     dispatch({
                        //         type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                        //         name: 'firstToSobInsert',
                        //         bool: true
                        //     })
                        //     const corpName = receivedData.data.corpName
                        //     sessionStorage.setItem('corpName', corpName)
                        //     dispatch(sobConfigActions.beforeHomeInsertOrModifySob(history))
                        // } else {
                            dispatch({
                                type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                                name: 'firstToSob',
                                bool: true
                            })
                            dispatch(homeActions.homePageGetSobList([]))
                            history.push('/config/sob/index')
                        // }
                    }

                } else {  //钉钉管理员，钉钉子管理员、财务经理

                    if (receivedData.data.sobNumber > receivedData.data.usedSobNumber) { // 有账套余额
                        // dispatch({
                        //     type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                        //     name: 'firstToSobInsert',
                        //     bool: true
                        // })
                        // const corpName = receivedData.data.corpName
                        // sessionStorage.setItem('corpName', corpName)
                        // dispatch(sobConfigActions.beforeHomeInsertOrModifySob(history))
                        dispatch({
                            type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                            name: 'firstToSob',
                            bool: true
                        })
                        history.push('/config/sob/index')
                    } else {
                        fetchApi('getAdminNameList', 'GET', '', json => {
                            if (showMessage(json)) {
                                dispatch({
                                    type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                                    name: 'firstToWelcome',
                                    bool: true
                                })
                                dispatch({
                                    type: ActionTypes.AFTER_GET_ADMINNAME_LIST,
                                    receivedData: json.data
                                })
                                history.push('/other/sobwelcome')
                            }
                        })
                        // history.push('/other/sobwelcome')
                    }
                }

            } else { // 普通员工不能新增账套

                fetchApi('getAdminNameList', 'GET', '', json => {
                    if (showMessage(json)) {
                        // const allList = Array.from(new Set(json.data.financeList.concat(json.data.adminList)))
                        // const allList = Array.from(new Set(json.data.adminList))
                        // const financeList = allList.slice(0, 5)
                        // if (allList.length > 5) {
                        //     thirdParty.Alert(`当前用户无有效账套，联系超级管理员创建：${financeList.join('、')}...`)
                        // } else {
                        //     thirdParty.Alert(`当前用户无有效账套，联系超级管理员创建：${financeList.join('、')}`)
                        // }
                        // sessionStorage.setItem('firstToWelcome', 'TRUE')
                        dispatch({
                            type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                            name: 'firstToWelcome',
                            bool: true
                        })
                        dispatch({
                            type: ActionTypes.AFTER_GET_ADMINNAME_LIST,
                            receivedData: json.data
                        })
                        history.push('/other/sobwelcome')
                    }
                })
            }

        } else {

            if (receivedData.data.needGuide === "JR") {
                history.push('/other/jrguide')
            } else if (receivedData.data.needGuide === "GL") {
                history.push('/other/glguide')
            }

            fetchApi('getSobSetting', 'GET', '', json => {
                if (json.code) {
                    showMessage(json)
                }
                dispatch({
                    type: ActionTypes.GET_AC_ASS_LIST_FETCH,
                    receivedData: json.data && json.data.assList ? json.data.assList : []
                })
                dispatch({
                    type: ActionTypes.GET_AC_LIST_FETCH,
                    receivedData: json.data && json.data.acList ? json.data.acList : []
                })
                dispatch({
                    type: ActionTypes.GET_PERIOD_FETCH,
                    receivedData: {
                        code: 0,
                        data: json.data && json.data.period ? json.data.period : []
                    }
                })
                dispatch({
                    type: ActionTypes.CHANGE_SYSTEM_INFO,
                    receivedData: json.data && json.data.settingInfo ? json.data.settingInfo : {},
                    currencyModelList: json.data && json.data.currencyModelList ? json.data.currencyModelList : []
                })
            })

            if (sobInfo.moduleInfo.indexOf('RUNNING') > -1) {
                dispatch(allRunningActions.getRunningSettingInfo())
            }
        }

        // fetchApi('getNewSobList', 'GET', '', json => {
        //     if (json.code) {
        //         showMessage(json)
        //     } else {
        //         dispatch({
        //             type: ActionTypes.GET_SOB_LIST,
        //             receivedData: json.data,
        //             mySobList: receivedData.data.sobList
        //         })
        //     }
        // })

        dispatch({
            type: ActionTypes.AFTER_GET_DBLIST_FETCH,
            receivedData: receivedData.data
        })

        // fetchApi('getaclist', 'GET', '', json =>
        // 	showMessage(json) &&
        // 	dispatch({
        // 		type: ActionTypes.GET_AC_LIST_FETCH,
        // 		receivedData: json.data
        // 	})
        // )
        // dispatch(allActions.getAcListFetch())
        // dispatch(allActions.getAssListFetch())
    },
    getAdminNameList: () => dispatch => {
        fetchApi('getAdminNameList', 'GET', '', json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.AFTER_GET_ADMINNAME_LIST,
                    receivedData: json.data
                })
            }
        })
    },
    homePageGetSobList : (sobList) => dispatch => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getNewSobList', 'GET', '', json => {
            if (json.code) {
                showMessage(json)
            } else {
                dispatch({
                    type: ActionTypes.GET_SOB_LIST,
                    receivedData: json.data,
                    mySobList: sobList
                })
                thirdParty.toast.hide()
            }
        })
    },
    beforeInsertGetModelFCList        : () => dispatch => {
        fetchApi('getModelFCList', 'GET', '', json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.BEFORE_INSERT_GET_MODEL_FCLIST,
                    receivedData: json.data
                })
            }
        })
    },
    // 首页、录入、查询等切换
    switchSelectedTab                  : (selectedTab) => ({
        type: ActionTypes.SWITCH_SELECTED_TAB,
        selectedTab
    }),
    // 切换账套
    modifyDefaultSobIdFetch            : (sobid, history) => (dispatch) => {

        thirdParty.toast.loading('正在加载当前账套...', 0)
        fetchApi('modifydefaultsobid', 'POST', JSON.stringify({defaultsobid: sobid}), json => {
            if (showMessage(json)) {
                dispatch(homeActions.getDbListFetch('', history))
            }
        })
    },
    codeError                           : (history) => dispatch => {
        history.push('/other/page10006')
    },
    updateNewEntry                      : (history) => (dispatch) => {
        fetchApi('adminNewEntry', 'POST', JSON.stringify({}), json => {
            if (!json.code) {
                dispatch(homeActions.getDbListFetch('first', history))
            } else {
                thirdParty.toast.loading('出错了，请刷新...', 0)
            }
        })
    },
    changePleasureGroundModule          : (bool) => ({
        type: ActionTypes.CHANGE_PLEASURE_GROUND_MODULE,
        bool
    }),
    // 进入体验模式
    enterPleasureGround                  : (history, from, demo, sobModel) => dispatch => {
        fetchApi('playOpen', 'POST', JSON.stringify({
            demo,
            sobModel
        }), json => {
           if (showMessage(json)) {
               global.isPlay = true
               dispatch(homeActions.changePleasureGroundModule(true))

               dispatch(allActions.initApp())
               dispatch(homeActions.getDbListFetch('', history))
               dispatch(homeActions.switchSelectedTab('Home'))

            //    if (from === 'welcome') {  // 从欢迎页来
                //    history.goBack()
            //    }
               // dispatch({
               // type: ActionTypes.CLEAR_HOME_TAB_PANE
               // })
           }
       })
    },
    // 退出体验模式
    quitPleasureGround                    : (history) => dispatch => {
        thirdParty.Confirm({
            message: '确定退出体验模式',
            title: "提示",
            buttonLabels: ['取消', '确定'],
            onSuccess : (result) => {
                if (result.buttonIndex === 0) {
                    history.goBack()
                } else if (result.buttonIndex === 1) {
                    global.isPlay = false
                    dispatch(homeActions.changePleasureGroundModule(false))

                    dispatch(allActions.initApp())
                    dispatch(homeActions.getDbListFetch('', history))
                    dispatch(homeActions.switchSelectedTab('Home'))
                    // dispatch({
                    //     type: ActionTypes.CLEAR_HOME_TAB_PANE
                    // })
                }
            }
        })
    },
    changeLoginGuideString                : (name, bool) => ({
        type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
        name,
        bool
    })
}

export { homeActions }

// if (receivedData.data.isAdmin === 'TRUE') { // 超级管理员
//     if (receivedData.data.securityCenterModified === 'FALSE') {  // 跳转去安全中心
//         if (receivedData.data.sobNumber > receivedData.data.usedSobNumber) {  // 可创建账套
//             sessionStorage.setItem('toSecurity', 'welcome')
//             // history.push('/other/sobwelcome')
//             history.push('/other/securityguide')
//         } else {
//             sessionStorage.setItem('toSecurity', 'welcome')
//             history.push('/config/sob/index')
//         }
//     } else {
//         if (receivedData.data.sobNumber > receivedData.data.usedSobNumber) {
//             history.push('/other/sobwelcome')
//         } else {
//             history.push('/config/sob/index')
//         }
//     }
// } else if (receivedData.data.isDdAdmin === 'TRUE' || receivedData.data.isDdPriAdmin === 'TRUE' || receivedData.data.isFinance === 'TRUE') {
//     if (receivedData.data.sobNumber > receivedData.data.usedSobNumber) {
//
//     }
// }
