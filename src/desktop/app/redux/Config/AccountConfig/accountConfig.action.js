import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import fetchApiGL from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import { toJS, fromJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as Limit from 'app/constants/Limit.js'

// 新增预置
// export const beforeInsertAccountConf = (currentPage, item, insertFrom) => (dispatch) => {
export const beforeInsertAccountConf = () => (dispatch) => {
    dispatch({
        type: ActionTypes.BEFORE_INSERT_ACCOUNTCONF
    })
}

export const selectOrUnselectAccountAll = (selectAll) => (dispatch,getState)=>{
    const allState = getState().allState
    const accountList = allState.get('accountList').size ? allState.getIn(['accountList', 0, 'childList']) : fromJS([])
    const disableList = allState.get('accountList', 0, 'disableList').size ? allState.getIn(['accountList', 0, 'disableList']) : fromJS([])
    dispatch({
        type: ActionTypes.SELECT_OR_UNSELECT_ACCOUNT_ALL,
        selectAll,
        accountList,
        disableList
    })
}

export const accountconfAccountCheckboxCheck = (checked, uuid) => ({
    type: ActionTypes.ACCOUNTCONF_ACCOUNT_CHECKBOX_CHECK,
    checked,
    uuid
})

export const beforeModifyaccountConfRunningOld = (item) => ({
    type: ActionTypes.BEFORE_MODIFY_ACCOUNTCONF_RUNNING,
    item
})

export const changeAccountConfingCommonString = (tab, place, value) =>(dispatch) => {
    let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
    dispatch({
        type: ActionTypes.CHANGE_ACCOUNTCONFIG_COMMON_STRING,
        placeArr,
        value
    })
}

export const closeAccountconfModal = () => ({
    type: ActionTypes.CLOSE_ACCOUNTCONF_MODAL
})

export const changeAccountConfAccountNumber = (accountType, value) => ({
    type: ActionTypes.CHANGE_ACCOUNTCONF_ACCOUNT_NUMBER,
    accountType,
    value
})
export const runningAccountUsed = (accountUuid,used) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('runningAccountUsed', 'POST', JSON.stringify({
        accountUuid,
        used
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json,'show')) {
            dispatch({
                type: ActionTypes.CHANGE_ACCOUNT_CARD_USED_STATUS,
                accountUuid,
                used
            })
        }
    })
}

export const swapRunningAccount = (fromUuid,toUuid) => (dispatch,getState) => {
    const currentPage = getState().accountConfigState.getIn(['views','currentPage'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('swapRunningAccount', 'POST', JSON.stringify({
        fromUuid,
        toUuid,
        currentPage,
        pageSize:Limit.CONFIG_PAGE_SIZE
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json,'show')) {
            dispatch({
                type: ActionTypes.GET_ACCOUNT_CONFIG_LIST,
                list: json.data.resultList,
				currentPage,
				pageCount:json.data.pages,
            })
        }
    })
}

export const selectAccountRunningCategory = (uuid) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeAccountConfingCommonString('poundage','item',fromJS(json.data.result)))
            dispatch(changeAccountConfingCommonString('poundage','name',json.data.result.name))
        }
    })
}

export const savePoundageConfig = (insertOrModify='insert',callBack) => (dispatch,getState) => {
    const poundageTemp = getState().accountConfigState.get('poundageTemp')
    const categoryUuid = poundageTemp.get('categoryUuid')
    const poundageNeedProject = poundageTemp.get('poundageNeedProject')
    const poundageNeedCurrent = poundageTemp.get('poundageNeedCurrent')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApiGL(`${insertOrModify}Poundage`,'POST',JSON.stringify({
        categoryUuid,
        poundageNeedProject,
        poundageNeedCurrent
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json,'show')) {
            callBack()
            dispatch(initPoundageTemp())
        }
    })
}
export const initPoundageTemp = () => ({
    type:ActionTypes.INIT_POUNDAGE_TEMP
})

export const getPaoundgeConfig = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApiGL(`getPoundage`,'GET','', json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.GET_POUNDGE_ACCOUNT,
                data:json.data
            })
            if (json.data.categoryUuid) {
                dispatch(selectAccountRunningCategory(json.data.categoryUuid))
            }
        }
    })
}

export const getAccountRegretList = (cb) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getAccountRegretList`,'GET','', json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeAccountConfingCommonString('regret','accountRegretList',fromJS(json.data.accountRegretList)))
            cb && cb()
        }
    })
}

export const saveAccountRegret = (uuid,newType,cb) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`saveAccountRegret`,'POST',JSON.stringify({
        uuid,
        newType
        }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json,'show')) {
            dispatch({type:ActionTypes.INIT_REGRETTEMP})
            dispatch(allRunningActions.getRunningAccount())
            cb && cb()
        }
    })
}

export const getRunningAccount = (currentPage=1) => dispatch => {
    fetchApi('getRunningAccount', 'GET', `currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_ACCOUNT_CONFIG_LIST,
                list: json.data.resultList,
				currentPage,
				pageCount:json.data.pages,
            })
        }
    })
}

export const saveAccountConfAccount = (saveAndNew, onClose) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const currentPage = getState().accountConfigState.getIn(['views','currentPage'])
    const accountConfigState = getState().accountConfigState
    const insertOrModify = accountConfigState.getIn(['views', 'insertOrModify'])
    let accountTemp = accountConfigState.get('accountTemp').toJS()

    if (insertOrModify === 'insert'){
        accountTemp.action = 'MANAGER-ACCOUNT_SETTING-CUD_ACCOUNT'
    }

    fetchApi(`${insertOrModify}RunningAccount`, 'POST', JSON.stringify({
        ...accountTemp,
        currentPage,
        pageSize:Limit.CONFIG_PAGE_SIZE
    }), json => {
        if (showMessage(json,'show')) {
            dispatch({
                type: ActionTypes.AFTER_UPDATE_ACCOUNTCONF_ACCOUNT,
                saveAndNew,
                receivedData: json.data
            })
            dispatch({
                type: ActionTypes.GET_ACCOUNT_CONFIG_LIST,
                list: json.data.resultList,
                currentPage,
                pageCount:json.data.pages,

            })
            if (!saveAndNew) {
                onClose()
            }
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 删除账户
export const deleteAccountConfAccount = () => (dispatch, getState) => {
    const currentPage = getState().accountConfigState.getIn(['views','currentPage'])
    const accountConfigState = getState().accountConfigState
    const deleteList = accountConfigState.getIn(['views', 'accountSelect'])

    if (deleteList.size === 0)
        return

    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if (result.buttonIndex === 1) {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                fetchApi('deleteRunningAccount', 'POST', JSON.stringify({
                    deleteList,
                    currentPage,
                    pageSize:Limit.CONFIG_PAGE_SIZE
                }), json => {
                    if (showMessage(json )) {
                        dispatch({
                            type: ActionTypes.AFTER_UPDATE_ACCOUNTCONF_ACCOUNT,
                            receivedData: json.data
                        })
                        dispatch({
                            type: ActionTypes.GET_ACCOUNT_CONFIG_LIST,
                            list: json.data.resultList,
                            currentPage,
                            pageCount:json.data.pages,

                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        }
    })
}
