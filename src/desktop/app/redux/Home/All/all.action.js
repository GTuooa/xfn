import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import thirdParty from 'app/thirdParty'
import { showMessage, DateLib } from 'app/utils'
import { message } from 'antd'
import { toJS } from 'immutable'
import * as middleActions from 'app/redux/Home/middle.action.js'

// 切换账套，设置模块 全部刷新
// 修改账套信息关闭除了账套信息外的东西
export const freshConfigPage = (currentPage) => dispatch => {

	if (currentPage === '账套设置') { // 删除账套
		dispatch({type: ActionTypes.INIT_ALL})
		dispatch({type: ActionTypes.INIT_AC_CONFIG})
		dispatch({type: ActionTypes.INIT_FZHS})
		dispatch({type: ActionTypes.INIT_ASSETS_CONFIG})
		dispatch({type: ActionTypes.INIT_CURRENCY_CONFIG})
		dispatch({type: ActionTypes.INIT_JZ})
		dispatch({type: ActionTypes.INIT_QCYE})
		dispatch({type: ActionTypes.INIT_SECURITY})
	} else {
		dispatch({type: ActionTypes.INIT_ALL})
		dispatch({type: ActionTypes.INIT_SOB})
		dispatch({type: ActionTypes.INIT_AC_CONFIG})
		dispatch({type: ActionTypes.INIT_FZHS})
		dispatch({type: ActionTypes.INIT_ASSETS_CONFIG})
		dispatch({type: ActionTypes.INIT_CURRENCY_CONFIG})
		dispatch({type: ActionTypes.INIT_JZ})
		dispatch({type: ActionTypes.INIT_QCYE})
		dispatch({type: ActionTypes.INIT_LSQC})
		dispatch({type: ActionTypes.INIT_SECURITY})
		dispatch({type: ActionTypes.INIT_APPROVAL_CONFIG})

		// 待删
		dispatch({type: ActionTypes.INIT_ACCOUNTCONF})
		dispatch({type: ActionTypes.INIT_IUCONFIG})
		dispatch({type: ActionTypes.INIT_INVENTORYSETTING})
		dispatch({type: ActionTypes.INIT_PROJECTCONFIG})

		dispatch({type: ActionTypes.INIT_ACCOUNT_CONFIG})
		dispatch({type: ActionTypes.INIT_INVENTORY_CONF})
		dispatch({type: ActionTypes.INIT_PROJECT_CONF})
		dispatch({type: ActionTypes.INIT_RELATIVE_CONF})


	}

	dispatch({
		type: ActionTypes.CLOSE_PAGE_TAB_PANE,
		currentPage,
		pagePanesName: 'ConfigPanes'
	})
}

// 设置的刷新，都只是刷新本页面的东西，关闭其他页面，不清空其他的设置的数据
export const closeConfigPage = (currentPage) => dispatch => {

	if (currentPage !== '账套设置') {
		dispatch({type: ActionTypes.INIT_SOB})
	} else if (currentPage !== '期初值') {
		dispatch({type: ActionTypes.INIT_QCYE})
	}

	dispatch({
		type: ActionTypes.CLOSE_PAGE_TAB_PANE,
		currentPage,
		pagePanesName: 'ConfigPanes'
	})
}

// 有 currentPage 参数的说明是页面内刷新，否则为 tab页面关闭时清空数据
export const freshReportPage = (currentPage) => dispatch => {

	if (currentPage) {
		({
			'阿米巴损益表': () => {
				dispatch({type: ActionTypes.INIT_LRB})
				dispatch({type: ActionTypes.INIT_XJLLB})
				dispatch({type: ActionTypes.INIT_SJB})
				dispatch({type: ActionTypes.INIT_ZCFZB})
				dispatch({type: ActionTypes.INTI_SYXMB})
			},
			'利润表': () => {
				dispatch({type: ActionTypes.INIT_AMBSYB})
				dispatch({type: ActionTypes.INIT_XJLLB})
				dispatch({type: ActionTypes.INIT_SJB})
				dispatch({type: ActionTypes.INIT_ZCFZB})
				dispatch({type: ActionTypes.INTI_SYXMB})
			},
			// '损益项目表':()=>{
			// 	dispatch({type: ActionTypes.INIT_AMBSYB})
			// 	dispatch({type: ActionTypes.INIT_LRB})
			// 	dispatch({type: ActionTypes.INIT_XJLLB})
			// 	dispatch({type: ActionTypes.INIT_SJB})
			// 	dispatch({type: ActionTypes.INIT_ZCFZB})
			// },
			// '利润表调整': () => {
			// 	dispatch({type: ActionTypes.INIT_AMBSYB})
			// 	dispatch({type: ActionTypes.INIT_XJLLB})
			// 	dispatch({type: ActionTypes.INIT_SJB})
			// 	dispatch({type: ActionTypes.INIT_ZCFZB})
			// },
			'现金流量表': () => {
				dispatch({type: ActionTypes.INIT_AMBSYB})
				dispatch({type: ActionTypes.INIT_LRB})
				dispatch({type: ActionTypes.INIT_SJB})
				dispatch({type: ActionTypes.INIT_ZCFZB})
				dispatch({type: ActionTypes.INTI_SYXMB})
			},
			// '现金流量调整': () => {
			// 	dispatch({type: ActionTypes.INIT_AMBSYB})
			// 	dispatch({type: ActionTypes.INIT_LRB})
			// 	dispatch({type: ActionTypes.INIT_SJB})
			// 	dispatch({type: ActionTypes.INIT_ZCFZB})
			// },
			'应交税费表': () => {
				dispatch({type: ActionTypes.INIT_AMBSYB})
				dispatch({type: ActionTypes.INIT_LRB})
				dispatch({type: ActionTypes.INIT_XJLLB})
				dispatch({type: ActionTypes.INIT_ZCFZB})
				dispatch({type: ActionTypes.INTI_SYXMB})
			},
			'资产负债表': () => {
				dispatch({type: ActionTypes.INIT_AMBSYB})
				dispatch({type: ActionTypes.INIT_LRB})
				dispatch({type: ActionTypes.INIT_XJLLB})
				dispatch({type: ActionTypes.INIT_SJB})
				dispatch({type: ActionTypes.INTI_SYXMB})
			},
			// '资产负债调整': () => {
			// 	dispatch({type: ActionTypes.INIT_AMBSYB})
			// 	dispatch({type: ActionTypes.INIT_LRB})
			// 	dispatch({type: ActionTypes.INIT_XJLLB})
			// 	dispatch({type: ActionTypes.INIT_SJB})
			// },
		}[currentPage] || (() => console.log('参数不匹配')))()

	} else {
		dispatch({type: ActionTypes.INIT_AMBSYB})
		dispatch({type: ActionTypes.INIT_LRB})
		dispatch({type: ActionTypes.INIT_XJLLB})
		dispatch({type: ActionTypes.INIT_SJB})
		dispatch({type: ActionTypes.INIT_ZCFZB})
		dispatch({type: ActionTypes.INTI_SYXMB})
	}

	dispatch({
		type: ActionTypes.CLOSE_PAGE_TAB_PANE,
		currentPage,
		pagePanesName: 'ReportPanes'
	})
}

export const freshYebPage = (currentPage) => dispatch => {

	if (currentPage) {
		({
			'科目余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_XMYEB})
				dispatch({type: ActionTypes.INIT_WLYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			'辅助余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_XMYEB})
				dispatch({type: ActionTypes.INIT_WLYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			'数量余额表': () => {
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_XMYEB})
				dispatch({type: ActionTypes.INIT_WLYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			'外币余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_XMYEB})
				dispatch({type: ActionTypes.INIT_WLYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			'资产余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_XMYEB})
				dispatch({type: ActionTypes.INIT_WLYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			// '流水余额表': () => {
			// 	dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
			// 	dispatch({type: ActionTypes.INIT_ASS_KMYEB})
			// 	dispatch({type: ActionTypes.INIT_CURRENCYYEB})
			// 	dispatch({type: ActionTypes.INIT_KMYEB})
			// 	dispatch({type: ActionTypes.INIT_ASSETSYEB})
			// 	dispatch({type: ActionTypes.INIT_ZHYEB})
			// 	dispatch({type: ActionTypes.INIT_XMYEB})
			// 	dispatch({type: ActionTypes.INIT_WLYEB})
			// },
			'账户余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_XMYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_WLYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			'往来余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_XMYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			'项目余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			'收支余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
			},
			'类型余额表': () => {
				dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASS_KMYEB})
				dispatch({type: ActionTypes.INIT_CURRENCYYEB})
				dispatch({type: ActionTypes.INIT_KMYEB})
				dispatch({type: ActionTypes.INIT_ASSETSYEB})
				dispatch({type: ActionTypes.INIT_LSYEB})
				dispatch({type: ActionTypes.INIT_ZHYEB})
				dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
				dispatch({type: ActionTypes.INIT_PROJECTYEB})
				dispatch({type: ActionTypes.INIT_RELATIVEYEB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
			},
		}[currentPage] || (() => console.log('参数不匹配')))()

	} else {
		dispatch({type: ActionTypes.INIT_AMOUNT_KMYEB})
		dispatch({type: ActionTypes.INIT_ASSETSYEB})
		dispatch({type: ActionTypes.INIT_ASS_KMYEB})
		dispatch({type: ActionTypes.INIT_CURRENCYYEB})
		dispatch({type: ActionTypes.INIT_KMYEB})
		dispatch({type: ActionTypes.INIT_LSYEB})
		dispatch({type: ActionTypes.INIT_ZHYEB})
		dispatch({type: ActionTypes.INIT_ACCOUNTYEB})
		dispatch({type: ActionTypes.INIT_WLYEB})
		dispatch({type: ActionTypes.INIT_XMYEB})
		dispatch({type: ActionTypes.INIT_RELATIVEYEB})
		dispatch({type: ActionTypes.INIT_PROJECTYEB})
		dispatch({type: ActionTypes.INIT_INCOME_EXPENDYEB})
		dispatch({type: ActionTypes.INIT_RUNNING_TYPEYEB})
		dispatch({type: ActionTypes.INIT_INVENTORY_YEB})
	}

	dispatch({
		type: ActionTypes.CLOSE_PAGE_TAB_PANE,
		currentPage,
		pagePanesName: 'YebPanes'
	})
}

export const freshMxbPage = (currentPage) => dispatch => {

	if (currentPage) {
		({
			'科目明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_XMMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'辅助明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_XMMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'数量明细表': () => {
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_XMMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'外币明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_XMMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'资产明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_XMMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'账户明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_XMMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'往来明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_XMMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'项目明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'收支明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
			},
			'类型明细表': () => {
				dispatch({type: ActionTypes.INIT_AMMXB})
				dispatch({type: ActionTypes.INIT_ASSMXB})
				dispatch({type: ActionTypes.INIT_ASSETSMXB})
				dispatch({type: ActionTypes.INIT_FCMXB})
				dispatch({type: ActionTypes.INIT_LSMXB})
				dispatch({type: ActionTypes.INIT_MXB})
				dispatch({type: ActionTypes.INIT_ZHMXB})
				dispatch({type: ActionTypes.INIT_WLMXB})
				dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
				dispatch({type: ActionTypes.INIT_PROJECTMXB})
				dispatch({type: ActionTypes.INIT_RELATIVEMXB})
				dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
			},
		}[currentPage] || (() => console.log('参数不匹配')))()

	} else {
		dispatch({type: ActionTypes.INIT_AMMXB})
		dispatch({type: ActionTypes.INIT_ASSETSMXB})
		dispatch({type: ActionTypes.INIT_ASSMXB})
		dispatch({type: ActionTypes.INIT_FCMXB})
		dispatch({type: ActionTypes.INIT_MXB})
		dispatch({type: ActionTypes.INIT_LSMXB})
		dispatch({type: ActionTypes.INIT_ZHMXB})
		dispatch({type: ActionTypes.INIT_ACCOUNTMXB})
		dispatch({type: ActionTypes.INIT_WLMXB})
		dispatch({type: ActionTypes.INIT_XMMXB})
		dispatch({type: ActionTypes.INIT_PROJECTMXB})
		dispatch({type: ActionTypes.INIT_RELATIVEMXB})
		dispatch({type: ActionTypes.INIT_INCOME_EXPEND_MXB})
		dispatch({type: ActionTypes.INIT_RUNNING_TYPE_MXB})
		dispatch({type: ActionTypes.INIT_INVENTORY_MXB})
	}

	dispatch({
		type: ActionTypes.CLOSE_PAGE_TAB_PANE,
		currentPage,
		pagePanesName: 'MxbPanes'
	})
}

export const freshSearchPage = (currentPage) => dispatch => {

	if (currentPage) {
		({
			'查询凭证': () => {
				dispatch({type: ActionTypes.INIT_FJGL})
				dispatch({type: ActionTypes.INIT_SEARCH_RUNNING})
				dispatch({type: ActionTypes.INIT_SEARCH_CALCULATION})
				dispatch({type: ActionTypes.INIT_SEARCH_APPROVAL})
			},
			// '附件管理': () => {
			// 	dispatch({type: ActionTypes.INIT_CXPZ})
			// 	dispatch({type: ActionTypes.INIT_CXLS})
			// },
			'查询流水': () => {
				dispatch({type: ActionTypes.INIT_CXPZ})
				dispatch({type: ActionTypes.INIT_SEARCH_CALCULATION})
				dispatch({type: ActionTypes.INIT_SEARCH_APPROVAL})
			},
			'查询审批': () => {
				dispatch({type: ActionTypes.INIT_CXPZ})
				dispatch({type: ActionTypes.INIT_SEARCH_RUNNING})
			},
		}[currentPage] || (() => console.log('参数不匹配')))()

	} else {
		dispatch({type: ActionTypes.INIT_CXPZ})
		dispatch({type: ActionTypes.INIT_FJGL})
		dispatch({type: ActionTypes.INIT_CXLS})
		dispatch({type: ActionTypes.INIT_SEARCH_RUNNING})
		dispatch({type: ActionTypes.INIT_SEARCH_CALCULATION})
		dispatch({type: ActionTypes.INIT_SEARCH_APPROVAL})
	}

	dispatch({
		type: ActionTypes.CLOSE_PAGE_TAB_PANE,
		currentPage,
		pagePanesName: 'SearchPanes'
	})
}

export const freshEditPage = (currentPage) => dispatch => {

	if (currentPage) {
		({
			'录入凭证': () => {
				dispatch({type: ActionTypes.INIT_DRAFT})
			},
			'草稿箱': () => {
				dispatch({type: ActionTypes.INIT_LRPZ})
			},
		}[currentPage] || (() => console.log('参数不匹配')))()

	} else {
		dispatch({type: ActionTypes.INIT_LRPZ})
		dispatch({type: ActionTypes.INIT_DRAFT})
		dispatch({type: ActionTypes.INIT_LR_ACCOUNT,strJudgeType:'init'})
		dispatch({type: ActionTypes.INIT_EIDT_CALCULATE})
		dispatch({type: ActionTypes.INIT_EDIT_RUNNING})
		dispatch({type: ActionTypes.INIT_EDIT_RUNNING_ALL})
	}

	dispatch({
		type: ActionTypes.CLOSE_PAGE_TAB_PANE,
		currentPage,
		pagePanesName: 'EditPanes'
	})
}

export const switchLoadingMask = () => ({
	type: ActionTypes.SWITCH_LOADING_MASK
})

// 获取period后判断issuedate为何值
// 判断规则为：openyear存在即为openyear和openmonth，否则为判断closeyear是否存在，
export const getPeriodFetch = (issuedate, dispatch, callback) => {
	fetchApi('getperiod', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_PERIOD_FETCH,
				receivedData: json
			})
			const period = json.data

			if (!period.openedyear && !period.closedyear){
				const today = new Date()
				const todayis = new DateLib(today).toString()
				const year = todayis.substr(0,4)
				const month = todayis.substr(5,2)
				issuedate = `${year}年第${month}期`
			} else if (period.openedyear && period.openedmonth)
				issuedate = `${period.openedyear}年第${period.openedmonth}期`
			else if (period.closedyear && period.closedmonth)
				issuedate = `${period.closedyear}年第${period.closedmonth}期`

			callback(issuedate)
		}
	})
}

export const refreshPeriodHandle = (issuedate, dispatch, callback, initCallback) => {
	fetchApi('getperiod', 'GET', '', json => {
		fetchApi('getperiod', 'GET', '', json => {
			if (showMessage(json)) {
				if (json.data.lastyear) {
					dispatch({
						type: ActionTypes.GET_PERIOD_FETCH,
						receivedData: json
					})
					callback(issuedate)
				} else {
					dispatch({
						type: ActionTypes.GET_PERIOD_FETCH,
						receivedData: {
							code: json.data.lastyear ? 0 : 17000,
							message: json.data.lastyear ? '成功' : '当前无凭证',
							data: json.data
						}
					})
					initCallback()
				}
			} else {
				initCallback()
			}
		})
	})
}

export const everyTableGetPeriod = (json) => dispatch => {
	// console.log('sd', json.data)

	if (!json.data.periodDtoJson) {
		return
	}

	const issuedate = json.data.periodDtoJson.openedyear + '年第' + json.data.periodDtoJson.openedmonth + '期'
	const period = {data: json.data.periodDtoJson}

	dispatch({
		type: ActionTypes.GET_PERIOD_FETCH,
		receivedData: period
	})

	return issuedate
}
export const everyTableGetIssuedate = (period) => dispatch => {
	const firstyear = Number(period.firstyear)
	const lastyear = Number(period.lastyear)
	const firstmonth = Number(period.firstmonth)
	const lastmonth = Number(period.lastmonth)
	const openyear = Number(period.openedyear)
	const openmonth = Number(period.openedmonth)
	const issues= []
	// 当前账期大于最后流水账期，起始账期到当前账期；当前账期小于最后流水账期，起始账期到最后流水账期；
	if(openyear > lastyear || openyear == lastyear && openmonth > lastmonth){

		for (let year = openyear; year >= firstyear; -- year) {
			if (firstyear === 0)
				break
			for (let month = (year === openyear ? openmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month) {
				issues.push(`${year}年第${month < 10 ? '0' + month : month}期`)
			}
		}
	}else{
		for (let year = lastyear; year >= firstyear; -- year) {
			if (firstyear === 0)
				break
			for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month) {
				issues.push(`${year}年第${month < 10 ? '0' + month : month}期`)
			}
		}
	}

	return issues
}

export const AccountTableGetPeriod = (json) => dispatch => {
	const issuedate = json.data.periodDtoJson.openedyear + '年第' + json.data.periodDtoJson.openedmonth + '期'
	const period = {data: json.data.periodDtoJson}
	dispatch({
		type: ActionTypes.GET_ACCOUNT_PERIOD_FETCH,
		receivedData: period
	})

	return issuedate
}


// 获取asslist，并赋给state
export const getAssListFetch = (loadMask) => dispatch => {
	loadMask && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getasslist', 'GET', '',json => {
		loadMask && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		showMessage(json) && dispatch({
			type: ActionTypes.AFTER_GET_ASS_FETCH,
			receivedData: json.data
		})
	})
}

// 获取aclist，并赋给state
export const getAcListFetch = (loadMask) => dispatch => {
	loadMask && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getaclist', 'GET', '', json => {
		loadMask && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.AFTER_GET_AC_LIST_FETCH,
				receivedData: json.data
			})
		}
	})
}

// 提取错误全局显示的方法
export const showError = (json) => {
	const errorlist = json.data
	if (errorlist && errorlist.length) {
		if (errorlist.length > 1) {
			const error = errorlist.map(v => v.message).reduce((prev, v) => prev + ',' + v)
			message.warn(error)
		} else {
			message.warn(json.data[0].message)
		}
	} else {
		message.success('操作成功！', 1)
	}
}

// 辅助核算的关联科目model的确认操作，json.code＝0为成功，
// 成功发送relateass请求后，隐藏model，重新获取aclist，asslist，并显示返回的message
export const modifyRelatedAclistFetch = (asscategory, aclist) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('relateass', 'POST', JSON.stringify({
		asscategory,
		acidlist: aclist.map(v => v.get('acid'))
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RELATED_ACLIST_MODEL_DISAPEAR
			})
			dispatch(getAssListFetch())
			dispatch(getAcListFetch())
			showError(json)
		}
	})
}

// 辅助核算页删除操作，json.code＝0为成功，
// 不能删除的项， 需显示返回的message
export const deleteAss = (asscategory, assidlist) => dispatch => {

	thirdParty.Confirm({
		message: "确定删除？",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				fetchApi('deleteass', 'POST', JSON.stringify({
						asscategory,
						assidlist
				}), json => {
					if (showMessage(json)) {
						dispatch(getAssListFetch())
						dispatch(getAcListFetch())
						showError(json)
					}
				})
			} else {
				return
			}
		},
		onFail : (err) => console.log(err)
	})
}

// 辅助核算的新增和修改
// 1.判断是否有未输入的项，有则提示
// 2.以handleAss为标记，确认是修改还是新增操作
export const enterAssItemFetch = (fromPage, ass, save, index) => (dispatch, getState) => {

	const asscategory = ass.get('asscategory').replace(/(^\s*)|(\s*$)/g, '')
	let newAss = ass
	// 替换文本前与后的空格
	newAss =  newAss.set('asscategory', ass.get('asscategory').replace(/(^\s*)|(\s*$)/g, ''))
					.set('assname', ass.get('assname').replace(/(^\s*)|(\s*$)/g, ''))

	if (!newAss.get('assid'))
		return thirdParty.Alert('辅助核算编码未输入')
	if (!newAss.get('assname'))
		return thirdParty.Alert('辅助核算名称未输入')
	if (!newAss.get('asscategory'))
		return thirdParty.Alert('辅助核算类别未输入')

	const assCurrentList = getState().allState.get('allasscategorylist').filter(v => v.get('asscategory') === asscategory)

	// 校验是否有有已存在的辅助核算项目
	if (assCurrentList.size) {  // 如果有长度，说明本来是存在这个类别的， 否则就是新增的，不需要校验

		const asslist = assCurrentList.getIn([0, 'asslist'])
		if (newAss.get('handleAss') === 'insertass') {
			if (asslist.some(v => v.get('assname') === newAss.get('assname'))) {
				dispatch(confirmInsertSameAss(fromPage, newAss, save))
			} else {
				dispatch(insertAssItem(fromPage, newAss, save))
			}
		} else if (newAss.get('handleAss') === 'modifyass') {
			if (asslist.getIn([index, 'assname']) !== newAss.get('assname')) { // 改了名字的
				if (asslist.some((v, i) => v.get('assname') === newAss.get('assname') && index !== i)) { // 存在除了自己以外还有一样的名字
					dispatch(confirmInsertSameAss('', newAss, save)) // 提示是否保存同名的辅助核算
				} else {
					dispatch(insertAssItem('', newAss, save))
				}
			} else { // 没改就不检验
				dispatch(insertAssItem('', newAss, save))
			}
		}

	} else {
		dispatch(insertAssItem(fromPage, newAss, save))
	}
}

const confirmInsertSameAss = (fromPage, newAss, save) => dispatch => {
	thirdParty.Confirm({
		message: "已存在名称相同的核算对象，是否确定保存？",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				dispatch(insertAssItem(fromPage, newAss, save))
			} else {
				return
			}
		},
		onFail : (err) => console.log(err)
	})
}

const insertAssItem = (fromPage, newAss, save) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	if (save === undefined) {
		newAss = newAss.set('needNewAssId', true)
	}

	const fromPageType = {
		'assConfig': 'MANAGER-ASS_SETTING-CUD_ASS',
		'Lrpz': 'SAVE_VC-SAVE_ASS'
	}

	fetchApi(newAss.get('handleAss'), 'POST', JSON.stringify((newAss).merge({
		action: fromPageType[fromPage]
	})), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (json.code === 12000){
			thirdParty.Alert('这有可能是因为类别名称中包含特殊字符（表情及异形字等），请修改后重试。若还出现该错误，请联系客服人员支持。')
		} else if (showMessage(json)) {
			const type = newAss.get('handleAss') === 'insertass' ? ActionTypes.INSERT_ASS_ITEM_FETCH : ActionTypes.MODIFY_ASS_ITEM_FETCH
			dispatch({
				type: type,
				receivedData: json,
				ass: newAss,
				save
			})
			const enterLrModal = sessionStorage.getItem('enterLrModal')
			// dispatch(allActions.getAssListFetch())
			if (enterLrModal == 'lrpz' && !json.code){
				dispatch(middleActions.changeLrFzhsModalClear())
				sessionStorage.removeItem('enterLrModal')
			}
			if (enterLrModal == 'account' && !json.code){
				dispatch({type: ActionTypes.CHANGE_ACCOUNT_FZHS_MODAL_CLEAR})
				sessionStorage.removeItem('enterLrModal')
			}
			if (save === 'save' && newAss.get('handleAss') === 'insertass') {
				dispatch({
					type: ActionTypes.SAVE_ENTER_ASSITE_MFETCH
				})
			}
			if (json.data && json.data.length) {  //禁用辅助核算时提示信息
				thirdParty.Alert(json.data[0])
			}
			dispatch(getAssListFetch())
			// if (newAss.get('handleAss') !== 'insertass') {
			// 	dispatch(getAssListFetch())
			// 	dispatch(allActions.getAssListFetch())
				// if (ass.get('disable') === 'TRUE') {
				// 	dispatch(lrpzActions.changeLrpzAssInfo(relatedAclist))
				// }
			// }
		}
	})
}

//科目设置页的新增或编辑操作
export const enterAcItemFetch = (fromPage, acItem, acConfigMode, category, nextacid) => dispatch => {
	//当编辑后科目编码、名称、类别、方向或与编辑前编码相等时return
	if (!acItem.get('acid'))
		return thirdParty.Alert('科目编码未输入')
	if (!acItem.get('acname'))
		return thirdParty.Alert('科目名称未输入')
	if (!acItem.get('category'))
		return thirdParty.Alert('科目类别未输入')
	// if (!acItem.get('direction'))
	// 	return alert('科目余额未输入')

	const acid = acItem.get('acid')
	if (acid.length < 4 || acid.length === 5 || acid.length === 7 || acid.length === 9)
		return thirdParty.Alert('科目编码长度仅限4/6/8/10位数字')
	if (acid.substr(-2) === '00')
		return thirdParty.Alert('科目编码不能以00结束，该编码为系统预留')
	if (acid.length !== 4 && !acItem.get('upperid'))
		return thirdParty.Alert('上级科目不存在，不允许添加子科目')

	if (acid.length !== 4 && acItem.get('upperid')) {  //判断acid中的前几个编码是否与upperid一致
		const upperiId = acid.substr(0, acid.length-2)
		if (upperiId !== acItem.get('upperid')) {
			return thirdParty.Alert(`科目${acid}不属于上级科目${acItem.get('upperid')}`)
		}
	}
		//获取当前编辑后科目
	const AcItem = acItem.remove('oldacid')
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	;({
		//确认修改
		modify() {
			const oldacid = acItem.get('oldacid') //获取当前选中编辑前科目
			fetchApi('modifyac', 'POST', JSON.stringify(AcItem.merge({
				oldacid
			// })), json => showMessage(json) && dispatch(afterEnterAcItemFetch(json, acItem, category, nextacid)))
			})), json =>{
				if (showMessage(json)) {
					dispatch(afterEnterAcItemFetch(json, acItem, category, nextacid))
				}
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			})
		},
		//确认新增
		insert() {
			const fromPageType = {
				'acConfig': 'MANAGER-AC_SETTING-CUD_AC_SETTING',
				'Lrpz': 'SAVE_VC-SAVE_AC'
			}
			fetchApi('insertac', 'POST', JSON.stringify(AcItem.merge({
				action: fromPageType[fromPage]
			})), json => {
				if (showMessage(json)) {
					dispatch(afterEnterAcItemFetch(json, AcItem, category, nextacid))
				}
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

			})
		}
	}[acConfigMode])() //编辑模式
}

const afterEnterAcItemFetch = (receivedData, AcItem, category, nextacid) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_ENTER_AC_ITEM_FETCH,
		receivedData,
		AcItem,
		category,
		nextacid
	})
	dispatch(getAcListFetch())
	const enterLrModal = sessionStorage.getItem('enterLrModal')
	if (enterLrModal == 'lrpz' && !receivedData.code){
		dispatch(middleActions.changelrAcModalClear())
		sessionStorage.removeItem('enterLrModal')
	}
}

// 科目设置删除操作
export const deleteAcItemFetch = (acidlist, redirect, idx) => dispatch => {

	thirdParty.Confirm({
		message: "确定删除？",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {

			if (result.buttonIndex === 1) {
				fetchApi('deleteac', 'POST', JSON.stringify({acidlist}), json => {
					if (showMessage(json)) {
						dispatch(getAcListFetch())
						showError(json)
					}
				})
			} else {
				return
			}
		},
		onFail : (err) => console.log(err)
	})
}

export const allExportReceiverlist = (receiverlist, url, option) => (dispatch, getState) => {

	const emplID = getState().homeState.getIn(['data', 'userInfo', 'emplID'])

	// thirdParty.requestOperateAuthCode({
	// 	corpId: sessionStorage.getItem('corpId'),
	// 	agentId: sessionStorage.getItem('agentId'),
	// 	onSuccess: (result) => {
	// 		const code = result.code
	// 		fetchApi(url, 'POST', JSON.stringify({
	// 			code,
	// 			// userIdList: receiverlist,
	// 			userIdList: [emplID],
	// 			...option
	// 		}), json => {
	// 			showMessage(json, 'show')
	// 		})
	// 	},
	// 	onFail: (err) => {
			// if (err.code == 404) {
				fetchApi(url, 'POST', JSON.stringify({
					// userIdList: receiverlist,
					userIdList: [emplID],
					...option
				}), json => {
					showMessage(json, 'show')
				})
			// }
		// }
	// })
}


// export const usersUseLog = (userAction) => ({
// 	type: ActionTypes.USERS_USE_LOG,
// 	userAction
// })


export const getActionInsertFetch = () => (dispatch, getState) => {

	const actionList = getState().allState.get('userLog')

	fetchApi('actioninsert', 'POST', JSON.stringify({
		actionList
	}), json => {
		showMessage(json)
	})
}
export const showPzBomb = (value,fromOther, callback) => ({
	type: ActionTypes.SHOW_PZ_BOMB,
	value,
	callback,
	fromOther
})

// 获取 有辅助核算项目 和 关联了科目 的辅助核算类别
// 调用者： 辅助核算余额表， 辅助核算明细表
export const getDefaultAssCategoryOfAssMxbAndAssYeb = () => (dispatch, getState) => {

	const allState = getState().allState
	const assTags = allState.get('assTags')
	const allasscategorylist = allState.get('allasscategorylist')
	let defaultAssCatagory = ''

	if (allasscategorylist.size > 0) {
		const matchList = allasscategorylist.filter(v => v.get('asslist').size && v.get('aclist').size).map(v => v.get('asscategory'))
		if (matchList.size) {
			for (let i = 0; i < assTags.size; i ++) {
				if (matchList.indexOf(assTags.get(i)) > -1) {
					defaultAssCatagory = assTags.get(i)
					break
				}
			}
		} else {
			defaultAssCatagory = assTags.get(0)
		}
	} else {
		defaultAssCatagory = assTags.get(0)
	}
	return defaultAssCatagory
}

export const changeSystemInfo = () => dispatch => {
	fetchApi('getSobSetting', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.AFTER_GET_ASS_FETCH,
				receivedData: json.data.assList ? json.data.assList : []
			})
			dispatch({
				type: ActionTypes.AFTER_GET_AC_LIST_FETCH,
				receivedData: json.data.acList ? json.data.acList : []
			})
			dispatch({
				type: ActionTypes.GET_PERIOD_FETCH,
				receivedData: {
					code: 0,
					data: json.data.period
				}
			})
			// fetchApi('getModelFCList', 'GET', '', currencyModelList => {
				dispatch({
					type: ActionTypes.CHANGE_SYSTEM_INFO,
					receivedData: json.data.settingInfo,
					currencyModelList: json.data.currencyModelList
					// currencyModelList: currencyModelList.data
				})
			// })
		}
	})
}

export const changeSystemunitDecimalCount = (value, cbSuccess, cbFail) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('modifyUnitDecimalCount', 'POST', JSON.stringify({unitDecimalCount: value}), json => {
		if (showMessage(json, 'show')) {
			cbSuccess()
			dispatch({
				type: ActionTypes.CHANGE_SYSTEM_UNIT_DECIMAL_COUNT,
				value
			})
		} else {
			cbFail()
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

// 统一的下载附件的入口
export const allDownloadEnclosure = (enclosureUrl, fileName) => dispatch => {
    // fetchApi('enclosureDownLoadNative', 'GET', `url=${enclosureUrl}&fileName=${fileName}`, json => {})
	thirdParty.downloadFile({
		url: enclosureUrl, //要下载的文件的url
		name: fileName, //定义下载文件名字
		onProgress: function(msg) {},
		onSuccess: function(result) {},
		onFail: function() {}
	})
    // thirdParty.openLink({
    //     // url: 'http://www.fannix.com.cn/xfn/support/desktop/app/index.html'
    //     url: enclosureUrl
    // })
}

export const changeInternalFrameStatus = (opt) => ({
	type: ActionTypes.CHANGE_INTERNAL_FRAME_STATUS,
	opt
})

export const sendMessageToDeveloper = (opt) => dispatch => {
	fetchApi('msgTextSend', 'POST', JSON.stringify({message: `标题：${opt.title}；` + '\n' + ` 信息：${opt.message}；` + '\n' + ` 备注：${opt.remark}；` + '\n' + ` 时间：${new DateLib()}`}), json => {
		showMessage(json)
	})
}
export const handlePrintModalVisible = (visible)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANDLD_PRINT_MODAL_VISIBLE,
        visible
    })
}
