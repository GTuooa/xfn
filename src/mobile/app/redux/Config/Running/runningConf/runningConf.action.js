import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'

export const changeRunningConfData = (dataType, value) => ({
    type: ActionTypes.CHANGE_RUNNING_CONF_DATA,
    dataType,
    value
})

export const showAllItemModifyButton = () => ({
	type: ActionTypes.RUNNING_SHOW_ALL_ITEM_MODIFY_BUTTON
})

export const showAllItemCheckBox = () => ({
	type: ActionTypes.RUNNING_SHOW_ALL_ITEM_CHECKBOX
})

export const hideChooseItemCheckBox = () => ({
	type:ActionTypes.HIDE_CHOOSE_ITEM_CEHCKBOX
})

export const hideAllItemModifyButton = () => ({
	type: ActionTypes.RUNNING_HIDE_ALL_ITEM_MODIFY_BUTTON
})

// 选择流水类别
export const selectItem = (uuid,uuidList) => ({
	type:ActionTypes.RUNNINGCONF_RUNNING_CHECKBOX_CHECK,
	uuid,
	uuidList
})

export const beforeInsertRunningConf = (item,history) => (dispatch) => {
    if (item) {
        const uuid = item.get('uuid')
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningDetail', 'GET', 'uuid='+uuid, json => {
			thirdParty.toast.hide()
            if (showMessage(json)) {
                const data = json.data.result
                dispatch({
                    type: ActionTypes.BEFORE_INSERT_RUNNING_CONF,
                    item,
                    data
                })
				history.push('/config/running/insert')
            }
          })
    } else {
        dispatch({
            type: ActionTypes.BEFORE_INSERT_RUNNING_CONF,
            item,
          // data
        })
    }
}

// export const beforeModifyRunningConfRunningOld = (item, history) => dispatch => {
//     dispatch({
//         type: ActionTypes.BEFORE_MODIFY_RUNNING_CONF_RUNNING,
//         item
//     })
// }

export const beforeModifyRunningConfRunning = (item, history) => (dispatch) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const uuid =  item.get('uuid')
    fetchApi('getRunningDetail', 'GET', 'uuid='+uuid, json => {
		thirdParty.toast.hide()
        if (showMessage(json)) {
            const data = json.data
            const name = data.result
            dispatch({
                type: ActionTypes.BEFORE_MODIFY_RUNNING_CONF_RUNNING,
                name,
				item: json.data.result,
                parentName: item.get('parentName')
            })
			history.push('/config/running/insert')
        }
    })
}

export const toggleLowerItem = (uuid) => ({
	type:ActionTypes.RUNNINGCONF_RUNNING_TRIANGLE_SWITCH,
	uuid
})

export const changeRunningTemp = (place, value) =>(dispatch) => {
    let placeArr = typeof place === 'string'?['runningTemp',place]:['runningTemp', ...place]
    dispatch({
        type: ActionTypes.CHANGE_RUNNING_TEMP,
        placeArr,
        value
    })
}

export const changeCardCheckboxArr = (placeArr, checked, value) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.CHANGE_RUNNING_CONF_PROPERTY,
      placeArr,
      checked,
      value,
    })
}
export const changeXczcCardCheckboxArr = (placeArr, checked, value) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.CHANGE_XCZC_RUNNING_CONF_PROPERTY,
      placeArr,
      checked,
      value,
    })
}
export const changeRegretTemp = (place, value) =>(dispatch) => {
    let placeArr = typeof place === 'string'?['regretTemp',place]:['regretTemp', ...place]
    dispatch({
        type: ActionTypes.CHANGE_RUNNING_TEMP,
        placeArr,
        value
    })
}

export const emptyAccountCheck = (deleteArr) => (dispatch) => {
    deleteArr.forEach(deleteItem => {
        const { tab, place, value } = deleteItem
        let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
        dispatch({
            type: ActionTypes.CHANGE_RUNNING_TEMP,
            placeArr,
            value
        })
    })
}

export const changeRegretChildList = (uuid) => ({
	type: ActionTypes.RUNNING_CONF_REGRET_CHANGE_CHILD,
    uuid
})

export const beforeEditRnningRegret = () => ({
    type: ActionTypes.BEFORE_EDIT_RNNING_REGRET
})

export const getRegretCategory = (history) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getRegretCategory', 'GET', '', json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_REGRET_RUNNING_CATEGORY,
                receivedData: json.data
            })
        }
    })
}

export const saveRegretMessage = (history) => (dispatch,getState) => {
    const runningConfState = getState().runningConfState
    const name = runningConfState.getIn(['regretTemp','subordinateName'])
    const uuid = runningConfState.getIn(['regretTemp','categoryUuid'])
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('saveRegretMessage', 'POST',JSON.stringify({
        name,
        uuid
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json,'show')) {
            dispatch({
                type: ActionTypes.GET_RUNNING_CONF_CATEGORY,
                receivedData: json.data
            })
            dispatch({
                type: ActionTypes.CHANGE_RUNNING_CONF_STATUS,
                receivedData: json.data
            })
            history.goBack()
        }
    })
}


export const runningConfigSelectCardRange = (rangeSelectTitle, rangeSelectGroup, groupData, history) => dispatch => {
    dispatch({
        type: ActionTypes.RUNNING_CONFIG_SELECT_CARD_RANGE,
        rangeSelectTitle,
        rangeSelectGroup,
        groupData,
    })
    history.push('/config/running/rangeselect')
}
