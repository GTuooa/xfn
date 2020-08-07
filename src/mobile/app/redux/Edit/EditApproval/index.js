import { fromJS }	from 'immutable'
import { DateLib, decimal } from 'app/utils'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const editApprovalState = fromJS({
    dataList:[],
    modelInfo:{},
    views:{
        idx:0,
        isLoaded:false,
        currentPage:1,
        pageCount:1,
        relationType:'APPROVER',
        processCode:'',
        searchContent:'',
        selectList:[]
        },
    componentList:[],
    categoryList:[],
    enclosureList:[],
    processModelList:[],
    approvalList:[]
})

export default function handleEditApproval(state = editApprovalState, action) {
    return({
        [ActionTypes.INIT_EDIT_APPROVAL_STATE]                      : () => editApprovalState,
        [ActionTypes.GET_APPROVAL_LIST]						: () => {
            return state.set('dataList', fromJS(action.data))
                        .setIn(['views','isLoaded'],true)
        },
        [ActionTypes.GET_APPROVAL_MODEL_INFO]						: () => {
            return state.set('componentList', fromJS(action.data.componentList))
                        .set('departmentId', fromJS(action.data.departmentId))
                        .set('modelInfo', fromJS(action.data.modelInfo))
        },
        [ActionTypes.CHANGE_APPROVAL_STATUS]						: () => {
            return state.set(action.name, action.value)
        },
        [ActionTypes.CHANGE_APPROVAL_MODAL_STATUS]						: () => {
            return state.set(['modelInfo',action.name], action.value)
        },
        [ActionTypes.CHANGE_MODEL_STRING]						: () => {
            return state.setIn(action.place, action.value)
        },
        [ActionTypes.AFTER_APPROVAL_GET_UPLOAD_SIGNATURE]                      : () => {
			if (!action.code) {
				return state = state.set('uploadKeyJson', fromJS(action.receivedData))
									.set('expire', parseInt(action.receivedData.expire))
			} else if (action.code === 40040)  {
				return state = state.set('uploadKeyJson', fromJS({checkMoreFj: false}))
									.set('expire', 0)
			} else {
				return state
			}
		},
        [ActionTypes.CHANGE_MODEL_ENCLOSURE_STRING]                      : () => {
            return state = state.updateIn(action.placeArr,v => (v || fromJS([])).concat(action.value))
        },
        [ActionTypes.AFTER_GET_EDIT_APPROVAL_PROCESSLIST]: () => {

            state = state.set('approvalList', action.receivedData.currentPage > 1 ? fromJS(state.get('approvalList').toJS().concat(action.receivedData.processList)) : fromJS(action.receivedData.processList))
            // state = state.set('approvalList', fromJS(action.receivedData.processList))
                .setIn(['views', 'currentPage'], action.currentPage)
                // .setIn(['views', 'pageCount'], action.receivedData.pageCount)
            if (action.currentPage === 1) {
                state = state.setIn(['views', 'pageCount'], action.receivedData.pageCount)
            }

            if (action.param.refresh !== true) {
                state = state.setIn(['views', 'relationType'], action.param.relationType)
                            .setIn(['views', 'searchContent'], action.param.searchContent)
                            .setIn(['views', 'processCode'], action.param.processCode)
            }

            return state
        },


        }[action.type] || (() => state))();
}
