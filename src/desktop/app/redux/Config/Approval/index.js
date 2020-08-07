import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'

//生产环境应当设置为空
const approvalState = fromJS({
	views: {
		currentPage: 'ApprovalTemplate',
	},
	detailList: [],
	modelList: [],
	basicComponentList: [],
})

export default function handleApproval(state = approvalState, action) {
	return ({
		[ActionTypes.INIT_APPROVAL_CONFIG]       : () => approvalState,
		[ActionTypes.SWITCH_APPROVAL_ACTIVE_PAGE]: () => {
			return state = state.setIn(['views', 'currentPage'], action.page)
		},
		[ActionTypes.GET_APPROVAL_MODEL_LIST]: () => {
			return state = state.set('modelList', fromJS(action.modelList))
		},
		[ActionTypes.GET_APPROVAL_DETAIL_LIST]: () => {
			return state = state.set('detailList', fromJS(action.detailList))
		},
		[ActionTypes.CHANGE_APPROVAL_MODEL_STATE]: () => {
			return state = state.updateIn(['modelList', action.index, 'modelStatus'], v => v === 'ENABLE' ? 'DISABLE' : 'ENABLE')
		},
		[ActionTypes.GET_APPROVAL_BASIC_COMPONENT_LIST]: () => {
			return state = state.set('basicComponentList', action.basicComponentList)
		}
	}[action.type] || (() => state))()
}

const approvalActions = {
	switchApprovalActivePage: (page) => ({
		type: ActionTypes.SWITCH_APPROVAL_ACTIVE_PAGE,
		page
	}),
	getProcessSelectModel: () => dispatch => {
		fetchApi('getApprovalModelList', 'GET', '', json => {
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.GET_APPROVAL_MODEL_LIST,
					modelList: json.data,
				})
			}
		})
		fetchApi('getApprovalDetailList', 'GET', '', json => {
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.GET_APPROVAL_DETAIL_LIST,
					detailList: json.data,
				})
			}
		})
	},
	getApprovalBasicComponentList: () => dispatch => {
		fetchApi('getApprovalBasicComponentList', 'GET', '', json => {
			if (showMessage(json)) {
				const unSupport = ['CalculateField', 'TableField']
				const basicComponentList = fromJS(json.data).filter(v => unSupport.indexOf(v.get('componentType')) === -1)
				dispatch({
					type: ActionTypes.GET_APPROVAL_BASIC_COMPONENT_LIST,
					basicComponentList: basicComponentList
				})
			}
		})
	},
	// createProcessModel: () => dispatch => {
	// 	fetchApi('createProcessModel', 'GET', '', json => {
	// 		if (showMessage(json, 'show')) {
	// 			fetchApi('getProcessSelectModel', 'GET', '', json => {
	// 				if (showMessage(json)) {
	// 					dispatch({
	// 						type: ActionTypes.GET_PROCESS_SELECT_MODEL,
	// 						detailList: json.data.detailList,
	// 						modelList: json.data.modelList,
	// 					})
	// 				}
	// 			})
	// 		}
	// 	})
	// },
	// disableProcessModel: (index) => dispatch => {
	// 	fetchApi('disableProcessModel', 'GET', '', json => {
	// 		if (showMessage(json, 'show')) {
	// 			fetchApi('getProcessSelectModel', 'GET', '', json => {
	// 				if (showMessage(json)) {
	// 					dispatch({
	// 						type: ActionTypes.GET_PROCESS_SELECT_MODEL,
	// 						detailList: json.data.detailList,
	// 						modelList: json.data.modelList,
	// 					})
	// 				}
	// 			})
	// 		}
	// 	})
	// },
}

export { approvalActions }
