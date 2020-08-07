import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import thirdParty from 'app/thirdParty'
import { showMessage, DateLib } from 'app/utils'
import { message } from 'antd'
import { toJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'

import { categoryTypeObj, categoryTypeObjList } from 'app/constants/editRunning.js'

import { runningIndexActions } from 'app/redux/Config/Running/index'
import * as taxConfActions from 'app/redux/Config/Running/Tax/taxConf.action'

export const getRunningSettingInfo = () => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('getRunningSettingInfo', 'GET', '', json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_SETTING_INFO,
                receivedData: json.data
            })
        }
        // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const getRunningCategory = () => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getRunningCategory', 'GET', '', json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.RUNNING_CONFIG_GET_CATEGORY,
                receivedData: json.data
            })
            dispatch({
                type: ActionTypes.CHANGE_RUNNING_CONF_STATUS,
                receivedData: json.data
            })
        }
    })
}

// 税费保存与保存并新增
export const saveAccountConfTaxRate = (toSetting) => (dispatch, getState) => {

    const allState = getState().allState
    const taxConfState = getState().taxConfState
    const taxRateTemp = allState.get('taxRate')
    const scale = taxRateTemp.get('scale')
    const rateOptionList = taxRateTemp.get('rateOptionList')

    let data = {}
    if (scale === 'small') {
        const payableAcId = taxRateTemp.get('payableAcId')
        const notBillingAcId = taxRateTemp.get('notBillingAcId')
        const payableRate = taxRateTemp.get('payableRate')
        data = { payableAcId, notBillingAcId, payableRate, scale }
        if (!rateOptionList.includes(Number(payableRate))) {
            return  thirdParty.toast.info('该税率已被删除，请重新选择')
        }

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
        if (!rateOptionList.includes(Number(outputRate))) {
            return  thirdParty.toast.info('该税率已被删除，请重新选择')
        }
    }
    fetchApi(`modifyRunningTaxRate`, 'POST', JSON.stringify({
        ...data
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json, 'show')) {
            if (toSetting) {
                thirdParty.setTitle({title: '流水设置'})
                dispatch(runningIndexActions.switchRunningIndexPage('流水设置'))
            } else {
                dispatch(taxConfActions.changeTaxConfQuery(true))
            }
        } else {
            dispatch(getRunningTaxRate())
        }
    })
    /*return null;

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`canModifyRunningTaxRate`, 'POST', JSON.stringify({
        ...data
    }), json => {
        if (!json.data.result.hasBusiness) {
            fetchApi(`modifyRunningTaxRate`, 'POST', JSON.stringify({
                ...data
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json, 'show')) {
                    if (toSetting) {
                        dispatch(runningIndexActions.switchRunningIndexPage('流水设置'))
                    } else {
                        dispatch(taxConfActions.changeTaxConfQuery(true))
                    }
                }
            })
        } else {
            if (json.data.result.canModify) {
                thirdParty.Confirm({
                    message: json.data.result.msg,
                    title: '温馨提示',
                    buttonLabels: ['取消', '确定'],
                    onSuccess: (result) => {
                        if (result.buttonIndex === 1) {
                            thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                            fetchApi(`modifyRunningTaxRate`, 'POST', JSON.stringify({
                                ...data
                            }), json => {
                                thirdParty.toast.hide()
                                if (showMessage(json, 'show')) {
                                    if (toSetting) {
                                        dispatch(runningIndexActions.switchRunningIndexPage('流水设置'))
                                    } else {
                                        dispatch(taxConfActions.changeTaxConfQuery(true))
                                    }
                                }
                            })
                        } else {
                            dispatch(getRunningTaxRate())
                        }
                    }
                })
               fetchApi(`modifyRunningTaxRate`, 'POST', JSON.stringify({
                   ...data
               }), json => {
                   if (showMessage(json, 'show')) {
                       if (toSetting) {
                           dispatch(runningIndexActions.switchRunningIndexPage('流水设置'))
                       } else {
                           dispatch(taxConfActions.changeTaxConfQuery(true))
                       }
                   }
               })
            } else {
                thirdParty.toast.info(json.data.result.msg, 5)
                dispatch(getRunningTaxRate())
            }
        }
    })*/
}

export const getRunningTaxRate = () => dispatch => {
    fetchApi('getRunningTaxRate', 'GET', '', json => {
        if (showMessage(json, '', '', '', true)) {
            dispatch({
                type: ActionTypes.GET_COMMON_TAX_RATE,
                receivedData: json.data
            })
        }
    })
}

// 修改taxRate
export const changeTaxRateData = (dataType, value) => ({
    type: ActionTypes.CHANGE_TAX_RATE_DATA,
    dataType,
    value
})

// 删除流水类别
export const deleteConfigRunningCategory = () => (dispatch, getState) => {

    const runningConfState = getState().runningConfState
    const deleteList = runningConfState.getIn(['views', 'runningSelect'])

    if (deleteList.size === 0)
        return

    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess : (result) => {
			if (result.buttonIndex === 1) {
                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                fetchApi('deleteRunningCategory', 'POST', JSON.stringify({
                    deleteList
                }), json => {
                    thirdParty.toast.hide()
                    if (showMessage(json)) {
                        if (json.data.errorMsg) {
                            thirdParty.toast.info(json.data.errorMsg)
                        } else {
                            thirdParty.toast.info(json.message)
                        }
                        dispatch({
                            type: ActionTypes.AFTER_UPDATE_ALLRUNNING_RUNNING_CATEGORY,
                            receivedData: json.data
                        })
                        dispatch({
                            type:ActionTypes.UPDATE_RUNNINGCONF_RUNNING_CATEGORY
                        })
                    }
                })
            }
        }
    })
}

export const swapRunningItem = (fromCategoryUuid,toCategoryUuid) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('runningSwapItem','POST', JSON.stringify({
            fromCategoryUuid,
            toCategoryUuid
        }),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_CATEGORY_ORDER,
                receivedData: json.data.categoryList[0]
            })
        }
        thirdParty.toast.hide()
    })
}

// 流水类别保存与保存并新增
export const saveAccountConfRunningCategory = (history) => (dispatch, getState) => {

    const runningConfState = getState().runningConfState
    const insertOrModify = runningConfState.getIn(['views', 'insertOrModify'])
    const runningTemp = runningConfState.get('runningTemp')
    const uuid = runningTemp.get('parentUuid')
    const categoryType = runningTemp.get('categoryType')
    let data = runningTemp.toJS()

    const deleteCategoryList = getCategoryType(categoryType)

    for(let i in deleteCategoryList) {
        delete data[deleteCategoryList[i]]
    }
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`${insertOrModify}RunningCategory`, 'POST', JSON.stringify({
        ...data
    }), json => {
		thirdParty.toast.hide()
        if (showMessage(json,'show')) {
            dispatch({
                type: ActionTypes.AFTER_UPDATE_ALLRUNNING_RUNNING_CATEGORY,
                receivedData: json.data
            })
            dispatch({
                type:ActionTypes.UPDATE_RUNNINGCONF_RUNNING_CATEGORY
            })
			history.goBack()
        }
    })
}

const getCategoryType = (categoryType) => {
    const curCategoryTypeObj = categoryTypeObj[categoryType]
    categoryTypeObjList.splice(categoryTypeObjList.indexOf(curCategoryTypeObj),1)
    return categoryTypeObjList
}

export const getRunningAccount = () => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getRunningAccount', 'GET', '', json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_ACCOUNT_LIST,
                receivedData: json.data.resultList,
                isCheckOut: json.data.isCheckOut
            })
        }
    })
}

export const saveAccountSetting = (fromPage, history) => (dispatch, getState) => {
    const state = getState().accountConfigState
    const flags = state.getIn(['views', 'flags'])

    //校验
    const data = state.get('data').toJS()
    if (data['beginAmount'].length > 12) {
        return thirdParty.toast.info('期初值长度最长为12位')
    }
    if (data['accountNumber'].length > Limit.ACCOUNT_STRING_LENGTH) {
        return thirdParty.toast.info(`账号不能超过${Limit.ACCOUNT_STRING_LENGTH}个字符`)
    }
    if (data['openingName'].length > Limit.ACCOUNT_STRING_LENGTH) {
        return thirdParty.toast.info(`开户名不能超过${Limit.ACCOUNT_STRING_LENGTH}个字符`)
    }
    if (data['openingBank'].length > Limit.ACCOUNT_STRING_LENGTH) {
        return thirdParty.toast.info(`开户行/机构不能超过${Limit.ACCOUNT_STRING_LENGTH}个字符`)
    }
	if (data['needPoundage'] && data['poundageRate'] > 1000) {
        return thirdParty.toast.info(`费用比率不能大于1000‰`)
    }

    if (flags === 'insert') {
        const fromPageType = {
            'editRunning': 'SAVE_JR-QUICK_MANAGER-SAVE_ACCOUNT',
            'account': 'MANAGER-ACCOUNT_SETTING-CUD_ACCOUNT'
        }
        data.action = fromPageType[fromPage] 
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`${flags}RunningAccount`, 'POST', JSON.stringify({
        ...data
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.GET_RUNNING_ACCOUNT_LIST,
                receivedData: json.data.resultList
            })
            history.goBack()
        }
    })
}

export const deleteAccountSetting = (deleteList, callBack) => (dispatch) => {
    thirdParty.Confirm({
        message: '确定删除吗',
        title: "提示",
        buttonLabels: ['取消', '确定'],
        onSuccess : (result) => {
            if (result.buttonIndex === 1) {
                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                fetchApi('deleteRunningAccount', 'POST', JSON.stringify({
                    deleteList
                }), json => {
                    if (showMessage(json, 'show')) {
                        dispatch({
                            type: ActionTypes.GET_RUNNING_ACCOUNT_LIST,
                            receivedData: json.data.resultList
                        })
                    }
                    callBack && callBack()
                })
            }
        },
        onFail : (err) => alert(err)
    })
}

export const swapItem = (fromUuid, toUuid) => (dispatch) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(`swapAccount`, 'POST', JSON.stringify({
		fromUuid,
		toUuid
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json, 'show')) {
			dispatch({
				type: ActionTypes.GET_RUNNING_ACCOUNT_LIST,
				receivedData: json.data.resultList
			})
		}

	})
}

export const saveRateOptionList = (rateOptionList) => (dispatch) => {//保存税率列表
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(`modifyRateOptionList`, 'POST', JSON.stringify({
		rateOptionList,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json, 'show')) {
			dispatch(changeTaxRateData('rateOptionList', json.data.result.rateOptionList))
		}

	})
}
