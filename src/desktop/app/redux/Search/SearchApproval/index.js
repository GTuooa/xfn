import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const searchApprovalState = fromJS({
    views: {
        searchType: 'PROCESS_SEARCH_TITLE',
        searchContent: '',
        accountingType: 'ALL',
        dateType: 'DATE_TYPE_END',
        beginDate: '',
        endDate: '',
        orderField: 'ORDER_DATE_END',
        sortByBeginDate: false,
        sortByEndDate: false,
        sortByDealtype: false,
    },
    approvalList: [],
    currentPage: 1,
    pageCount: 1,
    pageSize: Limit.SEARCH_RUNNING_LINE_LENGTH,

    canDeleteIdList: [],
})

export default function handleSearchApproval(state = searchApprovalState, action) {
    return ({
        [ActionTypes.INIT_SEARCH_APPROVAL]: () => searchApprovalState,

        [ActionTypes.AFTER_GET_APPROVAL_PROCESSLIST]: () => {
            console.log('AFTER_GET_APPROVAL_PROCESSLIST',action.receivedData.pageSize)

            state = state.set('approvalList', fromJS(action.receivedData.processList))
                .set('currentPage', action.receivedData.currentPage)
                .set('pageCount', action.receivedData.pageCount)
                .set('pageSize', action.receivedData.pageSize)

            if (action.param.refresh !== true) {
                state = state.setIn(['views', 'searchType'], action.param.searchType)
                            .setIn(['views', 'searchContent'], action.param.searchContent)
                            .setIn(['views', 'accountingType'], action.param.accountingType)
                            .setIn(['views', 'dateType'], action.param.dateType)
                            .setIn(['views', 'beginDate'], action.receivedData.beginDate)
                            .setIn(['views', 'endDate'], action.receivedData.endDate)
                            .setIn(['views', 'orderField'], action.param.orderField)
                            .updateIn(['views', 'sortByBeginDate'], v => action.param.orderField === 'ORDER_DATE_START' ? action.param.isAsc : v)
                            .updateIn(['views', 'sortByEndDate'], v => action.param.orderField === 'ORDER_DATE_END' ? action.param.isAsc : v)
                            .updateIn(['views', 'sortByDealtype'], v => action.param.orderField === 'ORDER_DEAl_TYPE' ? action.param.isAsc : v)
            }

            return state
        },
        [ActionTypes.CHANGE_SEARCH_APPROVAL_COMMON_STRING]: () => {

            state = state.setIn(['views', action.place], action.value)
            return state
        },
        [ActionTypes.GET_APPROVAL_PROCESS_CAN_DELETE_LIST]: () => {
            return state = state.set('canDeleteIdList', fromJS(action.receivedData))
        }
    }[action.type] || (() => state))()
}