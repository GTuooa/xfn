import { fromJS, toJS } from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

const sobLogState = fromJS({
	beginData: '',
	endData: '',
	searchType: 'SEARCH_TYPE_ALL',
	searchContent: '',
	log: {
		showLog: false,//是否显示日志页面
		pageCount: 0,
		currentPage:1,
		backSobId:'',
		logList:[]
	},
	operationList: []
})

export default function handleSobLog(state = sobLogState, action) {
	return ({
		[ActionTypes.INIT_SOB_LOG]									 : () => sobLogState,
		[ActionTypes.GET_LOG_LIST_FETCH]						 : () => {
			return state.setIn(['log', 'logList'], fromJS(action.receivedData))
					.setIn(['log', 'currentPage'], action.currentPage)
					.setIn(['log', 'backSobId'], action.backSobId)
					.setIn(['log', 'pageCount'], action.pageCount >=5 ? 5 : action.pageCount)
					.set('beginData', action.begin)
					.set('endData', action.end)
			// .setIn(['log', 'pageCount'], action.pageCount)
		},
		[ActionTypes.CHANGE_LOG_CONFIG_COMMON_STRING]						 : () => {
			return state.set(action.place, action.value)
					
			// .setIn(['log', 'pageCount'], action.pageCount)
		},
		[ActionTypes.GET_LOG_LIST_SELECT_LIST_FETCH]						 : () => {
			return state.set('operationList', fromJS(action.receivedData))
					
			// .setIn(['log', 'pageCount'], action.pageCount)
		},
	}[action.type] || (() => state))()
}
