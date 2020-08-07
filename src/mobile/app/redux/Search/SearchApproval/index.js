import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const searchApprovalState = fromJS({
    views: {

        currentPageType: 'ApprovalAll', // ApprovalAll Detail


        searchType: 'PROCESS_SEARCH_TITLE',
        searchContent: '',
        accountingType: 'ALL',
        dateType: 'DATE_TYPE_END',
        beginDate: '',
        endDate: '',
        processCode: 'PROCESS_CODE_ALL',


        showChildList: [],

        currentPage: 1,
        pageCount: 1,
    },

    approvalList: [],
    detailList: [],
    processModelList: [
        {
            modelName: "全部",
            processCode: "PROCESS_CODE_ALL"
        }
    ],

})

export default function handleSearchApproval(state = searchApprovalState, action) {
    return ({
        [ActionTypes.INIT_SEARCH_APPROVAL]: () => searchApprovalState,

        [ActionTypes.AFTER_GET_APPROVAL_PROCESSLIST]: () => {

            // state = state.set('approvalList', action.receivedData.currentPage > 1 ? fromJS(state.get('approvalList').toJS().concat(action.receivedData.processList)) : fromJS(action.receivedData.processList))
            state = state.set('approvalList', fromJS(action.receivedData.processList))
                .setIn(['views', 'currentPage'], action.currentPage)
                // .setIn(['views', 'pageCount'], action.receivedData.pageCount)
            if (action.currentPage === 1) {
                state = state.setIn(['views', 'pageCount'], action.receivedData.pageCount)
            }

            if (action.param.refresh !== true) {
                state = state.setIn(['views', 'searchType'], action.param.searchType)
                            .setIn(['views', 'searchContent'], action.param.searchContent)
                            .setIn(['views', 'dateType'], action.param.dateType)
                            .setIn(['views', 'beginDate'], action.receivedData.beginDate)
                            .setIn(['views', 'endDate'], action.receivedData.endDate)
                            .setIn(['views', 'processCode'], action.param.processCode)
            }

            return state
        },
        [ActionTypes.AFTER_GET_APPROVAL_PROCESSLIST_DETAILLIST]: () => {

            // state = state.set('detailList', action.receivedData.currentPage > 1 ? fromJS(state.get('approvalList').toJS().concat(action.receivedData.processList)) : fromJS(action.receivedData.detailList))
            state = state.set('detailList', fromJS(action.receivedData.detailList))
                .setIn(['views', 'currentPage'], action.currentPage)

            if (action.currentPage === 1) {
                state = state.setIn(['views', 'pageCount'], action.receivedData.pageCount)
            }

            if (action.param.refresh !== true) {
                state = state.setIn(['views', 'searchType'], action.param.searchType)
                            .setIn(['views', 'searchContent'], action.param.searchContent)
                            .setIn(['views', 'dateType'], action.param.dateType)
                            .setIn(['views', 'beginDate'], action.receivedData.beginDate)
                            .setIn(['views', 'endDate'], action.receivedData.endDate)
                            .setIn(['views', 'accountingType'], action.param.accountingType)
            }

            return state
        },
        [ActionTypes.AFTER_GET_APPROVAL_PROCESS_MODEL_LIST]: () => {

            state = state.set('processModelList', fromJS(action.receivedData))

            return state
        },
        [ActionTypes.CHANGE_SEARCH_APPROVAL_COMMON_STRING]: () => {

            state = state.setIn(['views', action.place], action.value)
            return state
        },
        
    }[action.type] || (() => state))()
}