import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.running.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'


const runningPreviewState = fromJS({
    views: {
        fromPage: '',
		uuidList: [],
    },

    currentItem: {},

    jrOri: {},

    category: {},

    processInfo: null,
})

// Reducer
export default function handleRunningPreview(state = runningPreviewState, action) {
    return ({
        [ActionTypes.GET_RUNNING_PREVIEW_BUSINESS_FETCH]						: () => {
            return state = state.set('jrOri', fromJS(action.receivedData.jrOri))
                                .set('category', fromJS(action.receivedData.category))
                                .set('processInfo', action.receivedData.processInfo ? fromJS(action.receivedData.processInfo) : null)
								.set('currentItem', action.currentItem)
								.setIn(['views', 'fromPage'], action.fromPage)
								.setIn(['views', 'uuidList'], action.uuidList)
        },
        [ActionTypes.GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH]          : () => {
			return state = state.set('jrOri', fromJS(action.receivedData.jrOri))
                                .set('category', fromJS(action.receivedData.category))
                                .set('processInfo', action.receivedData.processInfo ? fromJS(action.receivedData.processInfo) : null)
								.set('lsItemData', fromJS({...action.receivedData.category,...action.receivedData.jrOri}))
		},
        [ActionTypes.PREVIEW_RUNNING_DATA] : () => {
            return state = state.setIn(['views', 'uuidList'], fromJS(action.data))
        }

    }[action.type] || (() => state))()
}



const runningPreviewActions = {
    getRunningPreviewBusinessFetch: (oriUuid, currentItem, uuidList, fromPage, history) => (dispatch) => {
        //history, selectedIndex 顶部的大类, uuid, idx 下标 shouldJump 需不需要跳转
        if (oriUuid) {
            thirdParty.toast.loading('加载中...', 0)
            fetchApi('getRunningPreview', 'GET', `oriUuid=${oriUuid}`, json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_RUNNING_PREVIEW_BUSINESS_FETCH,
                        receivedData: json.data,
                        currentItem,
                        uuidList,
                        fromPage,
                    })
                    history.push('/runningpreview')
                }
            })
        }
    },
    getPreviewNextRunningBusinessFetch: (oriUuid, callBack) => dispatch => {
        if (oriUuid) {
            thirdParty.toast.loading('加载中...', 0)
            fetchApi('getRunningPreview', 'GET', `oriUuid=${oriUuid}`, json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH,
                        receivedData: json.data,
                    })
                }
            })
        }
    },
    insertRunningBusinessVc: (oriUuid, oriDate, jrIndex) => (dispatch, getState) => {//审核流水
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('insertRunningBusinessVc', 'POST', JSON.stringify({
            uuidList: [oriUuid],
            vcindexlist: [jrIndex],
            year: oriDate.slice(0,4),
            month: oriDate.slice(5,7),
            action: 'QUERY_JR-AUDIT'
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                if (json.data.result.length) {
                    let info = json.data.result.reduce((v, pre) => v + ',' + pre)
                    thirdParty.Alert(info)
                    return
                }
                dispatch(runningPreviewActions.getPreviewNextRunningBusinessFetch(oriUuid))

            }
        })
    },
    deleteRunningBusinessVc: (year, month, vcindexlist, oriUuid) => (dispatch, getState) => {//反审核流水
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('deletevc', 'POST', JSON.stringify({
            year,
            month,
            vcindexlist,
            action: 'QUERY_JR-CANCEL_AUDIT'
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch(runningPreviewActions.getPreviewNextRunningBusinessFetch(oriUuid))
            }
        })
    },
    deleteRunning: (oriUuid, uuidList, history) => (dispatch) => {//删除流水
        thirdParty.Confirm({
            message: '确定删除吗',
            title: "提示",
            buttonLabels: ['取消', '确定'],
            onSuccess : (result) => {
                if (result.buttonIndex === 1) {
                    const idx = uuidList.findIndex(v => v.get('oriUuid') === oriUuid)
                    const nextIdx = idx + 1

                    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                    fetchApi('deleteRunningbusiness', 'POST', JSON.stringify({
                        deleteList: [oriUuid]
                    }), json => {
                        if (showMessage(json)) {
                            if (json.data.errorList.length) {
                                let info = json.data.errorList.reduce((v, pre) => v + ',' + pre)
                                thirdParty.Alert(info)
                            }
                            if (json.data.errorList.length==0) {//删除成功
                                const list = uuidList.delete(idx)
                                dispatch({
                                    type: ActionTypes.PREVIEW_RUNNING_DATA,
                                    data: list,
                                })
                                if (nextIdx < uuidList.size) {
                                    dispatch(runningPreviewActions.getPreviewNextRunningBusinessFetch(uuidList.getIn([nextIdx, 'oriUuid'])))
                                } else {
                                    history.goBack()
                                }
                            }
                        }
                    })
                }
            },
            onFail : (err) => alert(err)
        })
    }

}

export const ActionTypes = {
    GET_RUNNING_PREVIEW_BUSINESS_FETCH : 'GET_RUNNING_PREVIEW_BUSINESS_FETCH',
    GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH : 'GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH',
    PREVIEW_RUNNING_DATA: 'PREVIEW_RUNNING_DATA',
}

export { runningPreviewActions }
