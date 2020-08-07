import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import * as ActionTypes from './ActionTypes.js'

const runningPreviewState = fromJS({
	views: {
		fromPage: '',
		uuidList: [],
		showMask: false,
		refreshList:{}
	},
	lsItemData: {},

	currentItem: {

	},

	jrOri: {

	},
	category: {

	},
	processInfo: null, // 审批

	relatedJrOri: { // 二级展开的流水数据

	},
	relatedCategory: { // 二级展开的类别数据

	},
	relatedProcessInfo: null, // 审批
})

export default function handlePreviewRunning(state = runningPreviewState, action) {
	return ({
		[ActionTypes.INIT_YLLS]								      : () => runningPreviewState,
		// [ActionTypes.CANCEL_YLLS_VISIBLE]					  : () => state.setIn(['views', 'yllsVisible'], false),
        [ActionTypes.GET_PREVIEW_RUNNING_BUSINESS_FETCH]          : () => {
			state =  state.setIn(['views', 'refreshList'], action.refreshList)
			return state = state.set('jrOri', fromJS(action.receivedData.jrOri))
								.set('category', fromJS(action.receivedData.category))
								.set('processInfo', action.receivedData.processInfo ? fromJS(action.receivedData.processInfo): null)
								.set('lsItemData', fromJS({...action.receivedData.category,...action.receivedData.jrOri}))
								.set('currentItem', action.currentItem)
								.setIn(['views', 'fromPage'], action.fromPage)
								.setIn(['views', 'uuidList'], action.uuidList)
		},
        [ActionTypes.GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH]          : () => {
			return state = state.set('jrOri', fromJS(action.receivedData.jrOri))
								.set('category', fromJS(action.receivedData.category))
								.set('processInfo', action.receivedData.processInfo ? fromJS(action.receivedData.processInfo): null)
								.set('lsItemData', fromJS({...action.receivedData.category,...action.receivedData.jrOri}))
								.set('currentItem', action.item)
		},
        [ActionTypes.GET_PREVIEW_RELATED_RUNNING_BUSINESS_FETCH]          : () => {
			return state = state.set('relatedJrOri', fromJS(action.receivedData.jrOri))
								.set('relatedCategory', fromJS(action.receivedData.category))
								.set('relatedProcessInfo', action.receivedData.processInfo ? fromJS(action.receivedData.processInfo): null)
								.setIn(['relatedJrOri','uuidList'],action.uuidList)
		},

	}[action.type] || (() => state))();
}
