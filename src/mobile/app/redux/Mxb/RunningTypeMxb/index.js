import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const runningTypeMxbState = fromJS({
	views: {
		typeUuid: '',
		acName: '全部',
		chooseValue: 'ISSUE',
	},
	issuedate: '',
	endissuedate: '',
	issues:[{
		value:'',
		key:''
	}],
	runningCategoryList:[
		{
			key:'',
			label:'',
			childList:[]
		}

	],
	opendetail: {
		direction:'',
		balanceAmount: 0
	},
	totalAmountList: {
		direction:'',
		allBalanceAmount: 0
	},
	runningTypeDetailList:[],
	pageCount: 1,
	currentPage: 1,
})


export default function handleProjectMxb(state = runningTypeMxbState, action) {
	return ({
		[ActionTypes.INIT_RUNNING_TYPE_MXB]							 : () => runningTypeMxbState,
		[ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPE_YEB]							 : () => {
			const { allBalanceAmount, direction } = action.receivedData.detail
			const totalAmountList = { allBalanceAmount,direction }
			const receiveList = action.receivedData.detail.childList
			const opendetail = receiveList[0]
			const detailList = receiveList.splice(1,receiveList.length-1)
			state = state.set('runningTypeDetailList',fromJS(detailList))
						.set('totalAmountList',fromJS(totalAmountList))
						.set('issuedate',action.issuedate)
						.set('endissuedate',action.endissuedate)
						.set('pageCount',action.receivedData.detail.pages)
						.set('currentPage',action.currentPage)
						.set('opendetail',fromJS(opendetail))
						.setIn(['views','typeUuid'],action.currentTypeUuid)
			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}
			if(!action.currentTypeUuid){
				state = state.setIn(['views','acName'],'')
			}
			if(action.acName){
				state = state.setIn(['views','acName'],action.acName)
			}
			return state
		},
		[ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_PAGE]							 : () => {
			const { allBalanceAmount, direction } = action.receivedData.detail
			const totalAmountList = { allBalanceAmount,direction }
			const receiveList = action.receivedData.detail.childList
			const opendetail = receiveList[0]
			let newList = []
			let detailList = []
			if(action.shouldConcat){
				let oldList = state.get('runningTypeDetailList').toJS()
				detailList = receiveList.splice(1,receiveList.length-1)
				newList = oldList.concat(detailList)
			}else{
				detailList = receiveList.splice(1,receiveList.length-1)
				newList = detailList
			}
			state = state.set('runningTypeDetailList',fromJS(newList))
						.set('totalAmountList',fromJS(totalAmountList))
						.set('issuedate',action.issuedate)
						.set('endissuedate',action.endissuedate)
						.set('pageCount',action.receivedData.detail.pages)
						.set('currentPage',action.currentPage)
						.set('opendetail',fromJS(opendetail))
						.setIn(['views','typeUuid'],action.currentTypeUuid)
			if(!action.currentTypeUuid){
				state = state.setIn(['views','acName'],'')
			}
			if(action.acName){
				state = state.setIn(['views','acName'],action.acName)
			}
			if(action.direction){
				state = state.setIn(['views','direction'],action.direction)
			}
			if(action.issues){
				state = state.set('issues',fromJS(action.issues))
			}

			return state
		},
		[ActionTypes.GET_RUNNING_TYPE_MXB_CATEGORY]							 : () => {
			const loop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.acId}${Limit.TREE_JOIN_STR}${v.mergeName}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v.acName,
						childList: loop(v.childList)
					}
				} else {
					return {
						key: `${v.acId}${Limit.TREE_JOIN_STR}${v.mergeName}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v.acName,
						childList: [],
					}
				}
			})
			const runningCategoryList = loop(action.receivedData)

			return state = state.set('runningCategoryList',fromJS(runningCategoryList))
		},
		[ActionTypes.CHANGE_RUNNING_TYPE_MXB_COMMON_STATE]               : () => {
			return state.setIn([action.parent, action.position], action.value)
		},
		[ActionTypes.GET_RUNNING_TYPE_MXB_LIST_NO_TYPE_TREE]							 : () => {
			const totalAmountList = { allBalanceAmount: '',direction: '' }
			state = state.set('runningTypeDetailList',fromJS([]))
						.set('runningCategoryList',fromJS([{key:'',label:'',childList:[]}]))
						// .set('openDetail',fromJS(action.receivedData.result.openDetail))
						.set('totalAmountList',fromJS(totalAmountList))
						.set('issuedate',action.issuedate)
						.set('endissuedate',action.endissuedate)
						.set('pageCount',1)
						.set('currentPage',1)
						.setIn(['views','typeUuid'],'')
						.setIn(['views','acName'],'')
			if(!action.currentTypeUuid){
				state = state.setIn(['views','acName'],'')
			}
			if(action.acName){
				state = state.setIn(['views','acName'],action.acName)
			}
			return state
		},
		[ActionTypes.CHANGE_RUNNING_TYPE_MXB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},
		[ActionTypes.CHANGE_RUNNING_TYPE_STRING]          : () => {
			return state = state.setIn(['views',action.name],action.value)
		},

	}[action.type] || (() => state))()
}
