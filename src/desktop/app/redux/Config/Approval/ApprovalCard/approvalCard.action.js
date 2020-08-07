import * as ActionTypes from '../ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import { message }	from 'antd'
import thirdParty from 'app/thirdParty'

import { approvalActions } from 'app/redux/Config/Approval/index.js'
import { checkComponentList } from 'app/redux/Config/Approval/ApprovalTemplate/approvalTemplate.action.js'

export const beforeInsertOrModifyDetail = (code, callBack) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getApprovalDetail', 'GET', `detailCode=${code === 'insert' ? '' : code}`, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.BEFORE_INSERT_OR_MODIFY_DETAIL,
                receivedData: json.data,
                insertOrMidify: code === 'insert' ? 'insert' : 'modify'
            })
            callBack()
        }
    })
}

export const changeApprovalCardCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_CARD_COMMON_STRING,
    place,
    value
})

export const addApprovalCardFormComponent = (component) => ({
    type: ActionTypes.ADD_APPROVAL_CARD_FORM_COMPONENT,
    component
})
export const deleteApprovalCardFormComponent = (index) => ({
    type: ActionTypes.DELETE_APPROVAL_CARD_FORM_COMPONENT,
    index
})
export const adjustPositionApprovalCardComponent = (fromPost, toPost) => ({
    type: ActionTypes.ADJUST_POSITION_APPROVAL_CARD_COMPONENT,
    fromPost,
    toPost
})
export const changeApprovalCardFormOptionString = (arr, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_CARD_FORM_OPTION_STRING,
    arr,
    value
})

// 保存明细
export const saveApprovalCard = (cardData, insertOrModify, callBack) => (dispatch, getState) => {

    cardData = cardData.delete('modelList')

    let checkoutList = []
    const formSetting = cardData.get('formSetting')
    const componentList = formSetting.get('componentList')
		
    if (!cardData.get('detailLabel')) {
        checkoutList.push('明细名称必填')
    } else if (cardData.get('detailLabel').length > 50) {
        checkoutList.push('明细名称最长50个字符')
    }
    if (cardData.get('placeHolder').length > 50) {
        checkoutList.push('提示文字最长50个字符')
    }

    if (!componentList.size) {
        checkoutList.push('必须有自定义组件')
    }

    const newList = checkComponentList(componentList, checkoutList, cardData)
    checkoutList = newList.checkoutList
    cardData = newList.approvalTemp

	if (checkoutList.length){
		return thirdParty.Alert(checkoutList.reduce((v, pre) => v + ',' + pre))
	}

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    if (insertOrModify === 'insert') {
        fetchApi('createApprovalDetail', 'POST', JSON.stringify(cardData), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                message.info(json.message)
                dispatch(approvalActions.getProcessSelectModel())
                callBack()
            }
        })
    } else if (insertOrModify === 'modify') {
        fetchApi('modifyApprovalDetail', 'POST', JSON.stringify(cardData), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                message.info(json.message)
                dispatch(approvalActions.getProcessSelectModel())
                callBack()
            }
        })
    }
}

export const deleteApprovalCard = (checkList, callBack) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi('deleteApprovalDetail', 'POST', JSON.stringify(checkList), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            message.info(json.message ? json.message : '成功')
            dispatch(approvalActions.getProcessSelectModel())
            callBack()
        }
    })
}

export const cancelModifyApprovalCard = () => ({
    type: ActionTypes.CANCEL_MODIFY_APPROVAL_CARD
})