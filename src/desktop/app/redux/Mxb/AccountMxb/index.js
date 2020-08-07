import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const accountMxbState = fromJS({
	views: {
		chooseValue: 'MONTH',
		currentAccoountUuid: '', // 选中的账户
		currentTab: 'left', // 当前右边树选的 账户流水(left) 还是 对方流水(right)
		categoryOrType: 'category', // 对方流水下选的 流水类型 还是 类别
		currentTreeSelectItem: {
			uuid: '',
			direction: 'undefined',
			fullname:'全部',
			name: '全部'
		}, // 树形选择选中
		jrAbstract:'',
	},
	issuedate: '',
	endissuedate: '',
	// 类别树
	accountCategory: {
		childList: []
	},
	accountTypeList: [],
	accountType: '',
	otherCategory: {
		childList: []
	},
	otherType: {
		childList: []
	},
	accountList: [{
		childList: []
	}],

	// 期初
	beginDetail: {
		// balance: 0
		// creditAmount: 0
		// debitAmount: 0
		oriAbstract: "期初余额"
	},
	// 列表
	detailList: [],
	// 合计
	totalDetail: {
		// balance: 0
		// creditAmount: 0
		// debitAmount: 0
		// oriAbstract: "本期合计"
	},

	currentPage: 1,
	pageCount: 0,
	// 右侧卡片分页
	cardPageObj: {
		pages: 1,
		currentPage: 1,
	}
})


export default function handleAccountMxb(state = accountMxbState, action) {
	return ({
		[ActionTypes.INIT_ACCOUNTMXB]							        : () => accountMxbState,
		[ActionTypes.GET_PERIOD_AND_ACCOUNT_MXB_BALANCE_LIST]           : () => {

			return state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('beginDetail', fromJS(action.receivedData.beginDetail))
						.set('detailList', fromJS(action.receivedData.detailList))
						.set('totalDetail', fromJS(action.receivedData.totalDetail))
						.set('currentPage', fromJS(action.receivedData.currentPage))
						.set('pageCount', fromJS(action.receivedData.pages))
						.setIn(['views','jrAbstract'], action.jrAbstract)
		},
		[ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_ACCOUNT]           : () => {

			return state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.setIn(['views', 'currentAccoountUuid'], action.currentAccoountUuid)
						.setIn(['views', 'jrAbstract'], action.jrAbstract)
						.set('beginDetail', fromJS(action.receivedData.beginDetail))
						.set('detailList', fromJS(action.receivedData.detailList))
						.set('totalDetail', fromJS(action.receivedData.totalDetail))
						.set('currentPage', fromJS(action.receivedData.currentPage))
						.set('pageCount', fromJS(action.receivedData.pages))
						// 重置 树的数据
						.update('views', v => action.typeUuid ? v : v.set('currentTreeSelectItem', fromJS({uuid: '',direction: 'undefined',fullname:'全部',name: '全部'})))
		},
		// [ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_ACCOUNT]           : () => {
		//
		// 	return state.set('issuedate', action.issuedate)
		// 				.set('endissuedate', action.endissuedate)
		// 				.setIn(['views', 'currentAccoountUuid'], action.currentAccoountUuid)
		// 				.set('beginDetail', action.receivedData.beginDetail ? fromJS(action.receivedData.beginDetail) : fromJS({}))
		// 				.set('detailList', fromJS(action.receivedData.detailList))
		// 				.set('totalDetail', fromJS(action.receivedData.totalDetail))
		// 				.set('currentPage', fromJS(action.receivedData.currentPage))
		// 				.set('pageCount', fromJS(action.receivedData.pages))
		// 				// 重置 树的数据
		// 				.update('views', v => v.set('currentTab', 'left').set('categoryOrType', 'category').set('currentTreeSelectItem', fromJS({uuid: ''})))
		// },
		[ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_ACCOUNTYEB]           : () => {

			return state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.setIn(['views', 'chooseperiods'], action.issuedate !== action.endissuedate ? true : false)
						.setIn(['views', 'currentAccoountUuid'], action.currentAccoountUuid)
						.setIn(['views', 'jrAbstract'], action.jrAbstract)
						.set('beginDetail',fromJS(action.receivedData.beginDetail))
						.set('detailList', fromJS(action.receivedData.detailList))
						.set('totalDetail', fromJS(action.receivedData.totalDetail))
						.set('currentPage', fromJS(action.receivedData.currentPage))
						.set('pageCount', fromJS(action.receivedData.pages))
						// 重置 树的数据
						.update('views', v => v.set('currentTab', 'left').set('categoryOrType', 'category').set('currentTreeSelectItem', fromJS({uuid: '',direction: 'undefined',fullname:'全部',name: '全部'})))
		},
		[ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_TREE_OR_PAGE]           : () => {

			return state.set('beginDetail', fromJS(action.receivedData.beginDetail))
						.set('detailList', fromJS(action.receivedData.detailList))
						.set('totalDetail', fromJS(action.receivedData.totalDetail))
						.set('currentPage', fromJS(action.receivedData.currentPage))
						.set('pageCount', fromJS(action.receivedData.pages))
						.update('views', v => v.set('currentTreeSelectItem', action.treeData))
						.setIn(['views','jrAbstract'], action.jrAbstract)
		},
		[ActionTypes.GET_ACCOUNT_MXB_TREE]								: () => {
			const initAccountCategory = [{
				jrCategoryName: '全部',
				jrCategoryUuid: '',
				direction: 'double_credit',
				childList:[]
			}]
			const cardPageObj = {
				currentPage: action.receivedData.currentPage ? action.receivedData.currentPage : 1,
				pages: action.receivedData.pages ? action.receivedData.pages : 1,

			}

			return state.set('accountCategory', fromJS(action.receivedData.accountCategory))
						.set('otherCategory', fromJS(action.receivedData.otherCategory))
						.set('otherType', fromJS(action.receivedData.otherType))
						.set('accountList', fromJS(action.receivedData.accountList))
						.set('accountTypeList', fromJS(action.receivedData.accountTypeList))
						.set('cardPageObj', fromJS(cardPageObj))
		},
		[ActionTypes.CHANGE_ACCOUNT_MXB_ACTIVE_TAB]						: () => {

			return state.setIn(['views', action.place], action.value)
						.set('beginDetail', fromJS(action.receivedData.beginDetail))
						.set('detailList', fromJS(action.receivedData.detailList))
						.set('totalDetail', fromJS(action.receivedData.totalDetail))
						.set('currentPage', fromJS(action.receivedData.currentPage))
						.set('pageCount', fromJS(action.receivedData.pages))
						.setIn(['views', 'currentTreeSelectItem'], fromJS({uuid: '',direction: 'undefined',fullname:'全部',name: '全部'}))
		},
		// 修改是否多选账期修改
		[ActionTypes.CHANGE_ACCOUNT_MXB_CHOOSE_VALUE] 	        : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},
		[ActionTypes.CHANGE_ACCOUNT_MXB_SEARCH_CONTENT]               : () => {
			return state.setIn(['views', 'jrAbstract'], action.value)
		},
		[ActionTypes.CHANGE_ACCOUNT_MXB_ACCOUNT_TYPE]               : () => {
			return state.set('accountType', action.value)
		},

	}[action.type] || (() => state))()
}
