import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const accountMxbState = fromJS({
	views: {
		issuedate:'',
		endissuedate: '',
		accountUuid: '',
		accountName: '',
		categoryUuid: '',
		categoryName: '请选择类别',
		accountDetailType : 'ACCOUNT_CATEGORY',
		accountDetailName:'账户流水',
		needPeriod:'',
		QcqmDirection:'',
		chooseValue: 'ISSUE',
		accountType:'',

	},
	category: {
		accountCategory : [{childList:[]}],
		otherCategory : [{childList:[]}],
		otherType : [{childList:[]}],
		accountList : [{childList:[]}],
		accountTypeList : [],
	},
	QcData:[],
	QmData:[],
	issues:[],
	detailsTemp:[]


})


export default function handleAccountMxb(state = accountMxbState, action) {
	return ({
		[ActionTypes.INIT_ACCOUNT_MXB]							 : () => accountMxbState,
		[ActionTypes.GET_ACCOUNT_DETAIL_CATEGORY_DETAIL]		 : () => {
			let accountCategoryArr = [{uuid:action.accountCategory.uuid,name:action.accountCategory.name,childList:[]}]
			accountCategoryArr.push(...action.accountCategory.childList)

			// let otherCategoryArr = [{uuid:action.otherCategory.uuid,name:action.otherCategory.name,childList:[]}]
			// otherCategoryArr.push(...action.otherCategory.childList)
			// let otherTypeArr = [{uuid:action.otherType.uuid,name:action.otherType.name,childList:[]}]
			// otherTypeArr.push(...action.otherType.childList)
			let initAccountType = [{
				key:``,
				label:'全部',
				childList:[]
			}]
			const typeNameList = {cash: '现金', general: '一般户', basic: '基本户', Alipay: '支付宝', 'WeChat': '微信', other: '其它', spare: '备用金'}
			action.accountTypeList && action.accountTypeList.length && action.accountTypeList.map(item => {
				initAccountType.push({
					key: item,
					label: typeNameList[item],
					childList:[]
				})
			})

			return state.setIn(['category','accountCategory'],fromJS(accountCategoryArr))
						// .setIn(['category','otherCategory'],fromJS(otherCategoryArr))
						// .setIn(['category','otherType'],fromJS(otherTypeArr))
						.setIn(['category','accountList'],fromJS(action.accountList.length > 0 ? action.accountList : [{childList:[]}]))
						.setIn(['category','accountTypeList'],fromJS(initAccountType))
						.setIn(['views','accountUuid'],fromJS(action.accountUuid))
						.setIn(['views','accountName'],fromJS(action.accountName))
		},
		[ActionTypes.GET_ACCOUNT_DETAIL_LIST]  : () => {
			if (action.needPeriod === 'true') {
				const period = action.period

				state = state.set('period',fromJS(action.period))
							.set('issues',fromJS(action.issues))
			}
			let newList = []

			if(action.shouldConcat){
				let oldList = state.get('detailsTemp').toJS()
				newList = oldList.concat(action.receivedData.detailList)
			}else{
				newList = action.receivedData.detailList
			}

			if(action.categoryName){
				state = state.setIn(['views','categoryName'],action.categoryName)
							.setIn(['views','categoryUuid'],action.categoryUuid)
			}
			if(action.accountName){
				state = state.setIn(['views','accountName'],action.accountName)
			}
			return state.set('detailsTemp',fromJS(newList))
						.set('QcData',fromJS(action.receivedData.beginDetail))
						.set('QmData',fromJS(action.receivedData.totalDetail))
						.set('currentPage',action.currentPage)
						.set('pageCount',action.pageCount)
						.setIn(['views', 'issuedate'],fromJS(action.issuedate))
						.setIn(['views', 'endissuedate'],fromJS(action.endissuedate))
						.setIn(['views', 'accountUuid'],fromJS(action.accountUuid))
		},
		[ActionTypes.CHANGE_ACCOUNT_DETAIL_COMMON_STRING]				: () => {
			return state.setIn([action.parent, action.position], action.value)
		},
		[ActionTypes.CHANGE_ACCOUNT_MXB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},
		[ActionTypes.CHANGE_ACCOUNT_MXB_ACCOUNT_TYPE]               : () => {
			return state.setIn(['views','accountType'],action.value)
		},

	}[action.type] || (() => state))()
}
