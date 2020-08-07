import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { toJS } from 'immutable'
import { message } from 'antd'
import { showMessage } from 'app/utils'

//获取数据
export const getDraftListFetch = (value) => (dispatch) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (value === '全部' ) {
        fetchApi('getdraftlist', 'POST', JSON.stringify({
            status: '-1'
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_DRAFT_LIST_FETCH,
                    receivedData: json.data,
                    selectDraftType: '全部'
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    } else if (value === '未锁定' ) {
        fetchApi('getdraftlist', 'POST', JSON.stringify({
            status: '0'
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_DRAFT_LIST_FETCH,
                    receivedData: json.data,
                    selectDraftType: '未锁定'
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    } else {
        fetchApi('getdraftlist', 'POST', JSON.stringify({
            status: '1'
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_DRAFT_LIST_FETCH,
                    receivedData: json.data,
                    selectDraftType: '已锁定'
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

// 全选按钮
export const selectDraftAll = () => ({
    type: ActionTypes.SELECT_DRAFT_ALL
})

// 单选按钮
export const selectDraftItem = (idx) => ({
    type: ActionTypes.SELECT_DRAFT_ITEM,
    idx
})

//删除
export const deleteDraft = (selectDraftList, selectDraftType) => dispatch => {
    fetchApi('deletedraft', 'POST', JSON.stringify({
        vcKeyList: selectDraftList
    }), json => {
        showMessage(json) && dispatch(getDraftListFetch(selectDraftType))
    })
}

//锁定
export const lockDraft = (selectDraftList, selectDraftType) => dispatch => {
    fetchApi('lockdraft', 'POST', JSON.stringify({
        vcKeyList: selectDraftList
    }), json => {
        showMessage(json) && dispatch(getDraftListFetch(selectDraftType))
    })
}

//解锁
export const unLockDraft = (selectDraftList, selectDraftType) => dispatch => {
    fetchApi('unlockdraft', 'POST', JSON.stringify({
        vcKeyList: selectDraftList
    }), json => {
        showMessage(json) && dispatch(getDraftListFetch(selectDraftType))
    })
}

export const changeInputValue = (value) => ({
    type: ActionTypes.CHANGE_DRAFT_INPUT_VALUE,
    value
})

//关键字搜索模版
export const searchDraft = (value) => ({
    type: ActionTypes.SEARCH_DRAFT,
    value
})

//凭证号排序
export const reverseDraftList = () => ({
    type: ActionTypes.REVERSE_DRAFT_LIST
})

//日期排序
export const sortDraftListByDate = () => ({
    type: ActionTypes.SORT_DRAFT_LIST_BY_DATE
})
