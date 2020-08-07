import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import * as thirdParty from 'app/thirdParty'
import { showMessage, DateLib } from 'app/utils'
import { message } from 'antd'
import { toJS, fromJS } from 'immutable'
import { categoryTypeAll, categoryTypeObjList } from 'app/containers/components/moduleConstants/common.js'

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
import * as homeActions from 'app/redux/Home/home.action.js'

export const getRunningSettingInfo = (first,needOpen,data) => dispatch => {
	needOpen && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi('getRunningSettingInfo', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_SETTING_INFO,
                receivedData: json.data
            })
            if(needOpen){
                dispatch(homeActions.openModalChooseToGo(data))
            }
        }
        needOpen && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 单独获取账户列表
export const getRunningAccount = () => dispatch => {
    fetchApi('getRunningAccount', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_ACCOUNT,
                receivedData: json.data
            })
        }
    })
}

// 流水类别保存与保存并新增  saveFrom区分录入流水
// export const saveAccountConfAccount = (saveAndNew,saveFrom) => (dispatch, getState) => {
export const saveAccountConfAccount = (fromPage, saveAndNew, onClose) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const accountConfigState = getState().accountConfigState
    const insertOrModify = accountConfigState.getIn(['views', 'insertOrModify'])

    let accountTemp = accountConfigState.get('accountTemp').toJS()

    const fromPageType = {
        'editRunning': 'SAVE_JR-QUICK_MANAGER-SAVE_ACCOUNT',
        'accountConfig': 'MANAGER-ACCOUNT_SETTING-CUD_ACCOUNT'
    }

    if (insertOrModify === 'insert'){
        accountTemp.action = fromPageType[fromPage]
    }

    fetchApi(`${insertOrModify}RunningAccount`, 'POST', JSON.stringify({
        ...accountTemp
    }), json => {
        if (showMessage(json,'show')) {

            dispatch({
                type: ActionTypes.GET_RUNNING_ACCOUNT,
                receivedData: json.data
            })

            dispatch({
                type: ActionTypes.AFTER_UPDATE_ACCOUNTCONF_ACCOUNT,
                saveAndNew,
                receivedData: json.data
            })

            if (!saveAndNew) {
                onClose()
            }
            // 重构时注释掉的
            // if(saveFrom === 'fromLrAccount'){
            //     dispatch({
            //       type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING,
            //       tab:'',
            //       placeArr:['flags', 'showAccountModal'],
            //       value:false
            //     })
            // }
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 删除账户
export const deleteAccountConfAccount = () => (dispatch, getState) => {

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
                    deleteList
                }), json => {
                    if (showMessage(json )) {
                        dispatch({
                            type: ActionTypes.GET_RUNNING_ACCOUNT,
                            receivedData: json.data
                        })
                        dispatch({
                            type: ActionTypes.AFTER_UPDATE_ACCOUNTCONF_ACCOUNT,
                            receivedData: json.data
                        })
                    }

                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        }
    })
}

// 税费保存与保存并新增
export const saveAccountConfTaxRate = (saveAndNew) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const allState = getState().allState
    const taxConfState = getState().taxConfState
    const insertOrModify = taxConfState.getIn(['views', 'insertOrModify'])

    const taxRateTemp = allState.get('taxRate')
    const scale = taxRateTemp.get('scale')
    let data = {}
    if (scale === 'small') {
        const payableAcId = taxRateTemp.get('payableAcId')
        const notBillingAcId = taxRateTemp.get('notBillingAcId')
        const payableRate = taxRateTemp.get('payableRate')
        data = { payableAcId, notBillingAcId, payableRate, scale }

    } else {
        const inputAcId = taxRateTemp.get('inputAcId')
        const certifiedAcId = taxRateTemp.get('certifiedAcId')
        const outputAcId = taxRateTemp.get('outputAcId')
        const waitOutputAcId = taxRateTemp.get('waitOutputAcId')
        const turnOutUnpaidAcId = taxRateTemp.get('turnOutUnpaidAcId')
        const unpaidAcId = taxRateTemp.get('unpaidAcId')
        const preAcId = taxRateTemp.get('preAcId')
        const outputRate = taxRateTemp.get('outputRate')
        data = { inputAcId, certifiedAcId, outputAcId, waitOutputAcId, turnOutUnpaidAcId, unpaidAcId, outputRate, scale, preAcId }
    }
    fetchApi(`modifyRunningTaxRate`, 'POST', JSON.stringify({
        ...data
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CHANGE_TAX_CONF_QUERY,
                isTaxQuery: true
            })
        }

    })
}
export const getRunningTaxRate = () => dispatch => {
    fetchApi('getRunningTaxRate', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_COMMON_TAX_RATE,
                receivedData: json.data
            })
        }
    })
}
export const modifyRateOption = (rateOptionList,cb) => dispatch => {
	fetchApi('modifyRateOption', 'POST', JSON.stringify({
		rateOptionList
		}), json => {
        if (showMessage(json,'show')) {
			dispatch({
                type: ActionTypes.CHANGE_RATE_LIST,
                receivedData: json.data
            })
			cb && cb()
        }
    })
}
// 流水设置类别列表
export const getRunningCategory = (fresh) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRunningCategory', 'GET', '', json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_CONFIG_CATEGORY,
                receivedData: json.data
            })
            dispatch({
                type: ActionTypes.CHANGE_RUNNING_CONF_STATUS,
                receivedData: json.data,
                fresh
            })
        }
    })
}

// 删除流水类别
export const deleteRunningConfCategory = () => (dispatch, getState) => {

    const runningConfState = getState().runningConfState
    const deleteList = runningConfState.getIn(['views', 'runningSelect'])

    if (deleteList.size === 0)
        return

    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if (result.buttonIndex === 1) {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                fetchApi('deleteRunningCategory', 'POST', JSON.stringify({
                    deleteList
                }), json => {
                    if (showMessage(json )) {
                        if (json.data.errorMsg) {
                            message.info(json.data.errorMsg)
                        } else {
                            message.success(json.message)
                        }
                        dispatch({
                            type: ActionTypes.UPDATE_CONFIG_RUNNING_CATEGORY,
                            receivedData: json.data
                        })
                        dispatch({
                            type:ActionTypes.UPDATE_RUNNINGCONF_RUNNING_CATEGORY
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        }
    })
}

export const swapRunningItem = (fromCategoryUuid,toCategoryUuid) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('runningSwapItem','POST', JSON.stringify({
            fromCategoryUuid,
            toCategoryUuid
        }),json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_CATEGORY_ORDER,
                receivedData: json.data.categoryList[0]
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const enabledCategory = (enabledList) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('enabledCategory','POST', JSON.stringify({
        enabledList
    }), json => {
        if (showMessage(json,'show')) {
            dispatch(changeItemDisableStatus(enabledList[0],false))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const disabledCategory = (disabledList,index) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('disabledCategory','POST', JSON.stringify({
        disabledList
    }), json => {
        if (showMessage(json,'show')) {
            const parentUuidList = json.data.parentList
            dispatch(changeItemDisableStatus(disabledList[0],true,parentUuidList))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeItemDisableStatus = (uuid,disabled,parentUuidList) => (dispatch,getState) => {
    const allState = getState().allState
    const list = allState.getIn(['runningCategory',0,'childList'])
    const disableList = allState.getIn(['runningCategory',0,'disableList'])
    let uuidList = [uuid]
    if (disabled && parentUuidList.length) {
        uuidList = uuidList.concat(parentUuidList)
    }
    const loop = (uuidList, list, placeArr,findMode) => {
        list && list.size && list.find((item, index) => {
            if(uuidList.find(w => w === item.get('uuid'))) {
                dispatch({
                    type:ActionTypes.CHANGE_RUNNING_ITEM_DISABLE_STATUS,
                    placeArr:[...placeArr,index],
                    disabled
                })
                return true
            } else {
                loop(uuidList,item.get('childList'),[...placeArr, index,'childList'],findMode)
                loop(uuidList,item.get('disableList'),[...placeArr, index,'disableList'],findMode)
            }
        })
    }
    loop(uuidList,list,['childList'],true)
    loop(uuidList,disableList,['disableList'],true)
}

// 流水类别保存与保存并新增
const getCategoryType = (categoryType) => {
    const categoryTypeObj = categoryTypeAll[categoryType]
    categoryTypeObjList.splice(categoryTypeObjList.indexOf(categoryTypeObj),1)
    return categoryTypeObjList
}

export const saveAccountConfRunningCategory = (saveAndNew) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const runningConfState = getState().runningConfState
    const insertOrModify = runningConfState.getIn(['views', 'insertOrModify'])
    const runningTemp = runningConfState.get('runningTemp')
    const uuid = runningTemp.get('parentUuid')
    const categoryType = runningTemp.get('categoryType')
    const level = runningTemp.get('level')
    let data = runningTemp.toJS()
    const deleteCategoryList = getCategoryType(categoryType)
    for(let i in deleteCategoryList) {
        delete data[deleteCategoryList[i]]
    }
    fetchApi(`${insertOrModify}RunningCategory`, 'POST', JSON.stringify({
        ...data
    }), json => {
        if (showMessage(json,'show')) {
            dispatch({
                type: ActionTypes.UPDATE_CONFIG_RUNNING_CATEGORY,
                receivedData: json.data
            })
            if(saveAndNew) {
                dispatch(runningConfActions.beforeInsertRunningConf('running', fromJS({uuid,level})))
                // dispatch(getRunningCategory())
            } else {
                dispatch({
                    type:ActionTypes.UPDATE_RUNNINGCONF_RUNNING_CATEGORY
                })
                // 录入流水
                dispatch({
                    type: ActionTypes.AFTER_UPDATE_ACCOUNTCONF_RUNNING_CATEGORY,
                    receivedData: json.data
                })
            }

        }

        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 流水报表 获取账期 与 更新账期
export const reportGetIssuedateAndFreshPeriod = (json) => dispatch => {

    //  1、从“首页”进入报表：
    // （1）若起始账期早于等于当前账期，默认显示当前账期；
    // （2）若起始账期晚于当期账期，默认显示第一个未结账账期；

    let issuedate
    const firstyear = json.data.periodDtoJson.firstyear
    const firstmonth = json.data.periodDtoJson.firstmonth

	// const lastDate = new Date(openedyear, openedyear, 0)
	const currentDate = new Date()
	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	if (Number(firstyear) < Number(currentYear)) {   //本年之前
		issuedate = `${currentYear}年第${currentMonth >= 10 ? currentMonth : '0'+currentMonth}期`
	} else if (Number(firstmonth) <= Number(currentMonth)) {  //本月及之前
		issuedate = `${currentYear}年第${currentMonth >= 10 ? currentMonth : '0'+currentMonth}期`
	} else {   //本月之后
        const openedyear = json.data.periodDtoJson.openedyear
        const openedmonth = json.data.periodDtoJson.openedmonth
		issuedate = `${openedyear}年第${openedmonth}期`
	}

	const period = {data: json.data.periodDtoJson}
	dispatch({
		type: ActionTypes.GET_ACCOUNT_PERIOD_FETCH,
		receivedData: period
	})
	return issuedate
}

export const changeMxbRunningPreviewVisibility = (bool) => ({
    type: ActionTypes.CHANGE_MXB_RUNNING_PREVIEW_VISIBILITY,
    bool
})

export const changeSearchRunningPreviewVisibility = (bool) => ({
    type: ActionTypes.CHANGE_SEARCH_RUNNING_PREVIEW_VISIBILITY,
    bool
})

export const changeMxbSerialDrawerVisibility = (bool) => ({
    type: ActionTypes.CHANGE_MXB_SERIAL_DRAWER_VISIBILITY,
    bool
})
