import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'

// 反悔模式
export const getRegretCategory = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRegretCategory', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_REGRET_RUNNING_CATEGORY,
                receivedData: json.data
            })
        }

        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeRegretAccountAccountName = (tab, placeUUid, placeName,isBalance,isBusiness, value) => (dispatch) => {
    dispatch({
        type: ActionTypes.CHANGE_REGRET_RUNNING_NAME,
        tab,
        placeUUid,
        placeName,
        isBalance,
        isBusiness,
        value
    })
}

export const changeRegretAccountCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
  if(place[0] === 'flags') {placeArr = place}
  dispatch({
    type: ActionTypes.CHANGE_REGRET_RUNNING_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}

export const changeRegretCancle = () => ({
    type: ActionTypes.CHANGE_RUNNING_REGRET_CANCLE
})
export const saveRegretMessage = () => (dispatch,getState) => {
    const runningConfState = getState().runningConfState
    const name = runningConfState.getIn(['regretTemp','subordinateName'])
    const uuid = runningConfState.getIn(['regretTemp','categoryUuid'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('saveRegretMessage', 'POST',JSON.stringify({
        name,
        uuid
    }), json => {
        if (showMessage(json,'show')) {
            dispatch({
                type: ActionTypes.GET_RUNNING_CONF_CATEGORY,
                receivedData: json.data
            })
            dispatch({
                type: ActionTypes.CHANGE_RUNNING_CONF_STATUS,
                receivedData: json.data,
                fresh:'fresh'
            })
            dispatch(changeRegretCancle())
        }else{
            dispatch(changeRegretAccountCommonString('regret', 'showConfirmModal',false))
            dispatch(changeRegretAccountCommonString('regret', 'showModal',true))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const runningConfCheckboxCheck = (item, upperArr,checked) => ({
    type: ActionTypes.RUNNING_CONF_CHECKBOX_CHECK,
    item,
    upperArr,
    checked
})

export const beforeInsertRunningConf = (currentPage, item, insertFrom) => (dispatch) => {
    if (item) {
        const uuid = item.get('uuid')
        if (currentPage === 'running') {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi('getRunningDetail', 'GET', 'uuid='+uuid, json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                if (showMessage(json)) {
                    const data = json.data.result
                    dispatch({
                      type: ActionTypes.BEFORE_INSERT_RUNNGIN_CONF,
                      currentPage,
                      item,
                      data,
                      insertFrom
                    })
                }
              })
        } else {
            dispatch({
              type: ActionTypes.BEFORE_INSERT_RUNNGIN_CONF,
              currentPage,
              item,
              insertFrom
              // data
            })
        }
    } else {
        dispatch({
          type: ActionTypes.BEFORE_INSERT_RUNNGIN_CONF,
          currentPage,
          item,
          insertFrom
          // data
        })
    }
}

export const runningConfTriangleSwitch = (showChild, uuid) => ({
    type: ActionTypes.RUNNING_CONF_TRIANGLE_SWITCH,
    showChild,
    uuid
})

export const beforeModifyaccountConfRunning = (currentPage, item) => (dispatch) => {
    const uuid =  item.get('uuid')
    fetchApi('getRunningDetail', 'GET', 'uuid='+uuid, json => {
        if (showMessage(json)) {
            const data = json.data
            const name = data.result
            dispatch({
                type: ActionTypes.BEFORE_MODIFY_CONFIG_RUNNING,
                currentPage,
                name,
                item
            })
            }
        })
}

export const closeRunningConfModal = () => ({
    type: ActionTypes.CLOSE_RUNNING_CONF_MODAL
})

export const changeRunningConfCommonString = (tab, place, value) =>(dispatch) => {
    let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
    dispatch({
      type: ActionTypes.CHANGE_RUNNING_CONF_COMMON_STRING,
      placeArr,
      value
    })
}

export const selectRunningConfUpperCategory = (value) => ({
    type: ActionTypes.SELECT_RUNNING_CONF_UPPER_CATEGORY,
    value
})

export const emptyAccountCheck = (deleteArr) => (dispatch) => {
  deleteArr.forEach(deleteItem => {
    const { tab, place, value } = deleteItem
    let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
    dispatch({
      type: ActionTypes.CHANGE_RUNNING_CONF_COMMON_STRING,
      placeArr,
      value
    })
  })
}
export const changeCardCheckboxArr = (categoryTypeObj, rangeType, uuid,checked) => (dispatch, getState) => {
    const range = getState().runningConfState.getIn(['runningTemp', categoryTypeObj, rangeType])
    let valArr
    if (checked) {
        valArr = range.update(v => v.concat(uuid))
    } else {
        valArr = range.update(v => v.filter(w => w !== uuid))
    }
    const placeArr = ['runningTemp',categoryTypeObj,rangeType]
    dispatch({
      type: ActionTypes.CHANGE_RUNNING_CONF_PROPERTY,
      placeArr,
      valArr

    })
}

export const changeCardCheckboxArrOut = (rangeType, uuid,checked) => (dispatch, getState) => {
    const range = getState().runningConfState.getIn(['runningTemp', rangeType])
    let valArr
    if (checked) {
        valArr = range.update(v => v.concat(uuid))
    } else {
        valArr = range.update(v => v.filter(w => w !== uuid))
    }
    const placeArr = ['runningTemp',rangeType]
    dispatch({
      type: ActionTypes.CHANGE_RUNNING_CONF_PROPERTY,
      placeArr,
      valArr

    })
}
