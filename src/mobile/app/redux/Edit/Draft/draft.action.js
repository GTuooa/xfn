import { toJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

//获取数据
export const getDraftListFetch = (value) => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    if (value === '全部' ) {
        fetchApi('getdraftlist', 'POST', JSON.stringify({
            status: '-1'
        }), json => {
            if (showMessage(json)) {
                thirdParty.toast.hide()
                dispatch({
                    type: ActionTypes.GET_DRAFT_LIST_FETCH,
                    receivedData: json.data,
                    selectDraftType: '全部'
                })
            }
        })
    } else if (value === '未锁定' ) {
        fetchApi('getdraftlist', 'POST', JSON.stringify({
            status: '0'
        }), json => {
            if (showMessage(json)) {
                thirdParty.toast.hide()
                dispatch({
                    type: ActionTypes.GET_DRAFT_LIST_FETCH,
                    receivedData: json.data,
                    selectDraftType: '未锁定'
                })
            }
        })
    } else {
        fetchApi('getdraftlist', 'POST', JSON.stringify({
            status: '1'
        }), json => {
            if (showMessage(json)) {
                thirdParty.toast.hide()
                dispatch({
                    type: ActionTypes.GET_DRAFT_LIST_FETCH,
                    receivedData: json.data,
                    selectDraftType: '已锁定'
                })
            }
        })
    }
}

//

export const searchDraftItem = (value) => ({
    type: ActionTypes.SEARCH_DRAFT_ITEM,
    value
})
