import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage, jsonifyDate } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { toJS, fromJS } from 'immutable'
import { message } from 'antd'

// 老版流水

export const getRunningCategory = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRunningCategory', 'GET', '', json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_CATEGORY,
                receivedData: json.data
            })
        }
    })
}

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

export const getRunningTaxRate = () => dispatch => {
    fetchApi('getRunningTaxRate', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_TAX_RATE,
                receivedData: json.data
            })
        }
    })
}

export const changeAccountConfCurrentPage = (currentPage) => ({
    type: ActionTypes.CHANGE_ACCOUNTCONF_CURRENTPAGE,
    currentPage
})

export const beforeInsertAccountConf = (currentPage, item, insertFrom) => (dispatch) => {
    if (item) {
        const uuid = item.get('uuid')
        if (currentPage === 'running') {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi('getRunningDetail', 'GET', 'uuid='+uuid, json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                if (showMessage(json)) {
                    const data = json.data.result
                    dispatch({
                      type: ActionTypes.BEFORE_INSERT_ACCOUNTCONF,
                      currentPage,
                      item,
                      data,
                      insertFrom
                    })
                }
              })
        } else {
            dispatch({
              type: ActionTypes.BEFORE_INSERT_ACCOUNTCONF,
              currentPage,
              item,
              insertFrom
              // data
            })
        }
    } else {
        dispatch({
          type: ActionTypes.BEFORE_INSERT_ACCOUNTCONF,
          currentPage,
          item,
          insertFrom
          // data
        })
    }


}



export const beforeModifyaccountConfRunningOld = (currentPage, item, old) => ({  // 可能出错
    type: ActionTypes.BEFORE_MODIFY_ACCOUNTCONF_RUNNING_OLD,
    currentPage,
    item,
    old
})

export const beforeModifyaccountConfRunning = (currentPage, item) => (dispatch) => { // 可能出错
    const uuid =  item.get('uuid')
    fetchApi('getRunningDetail', 'GET', 'uuid='+uuid, json => {
        if (showMessage(json)) {
            const data = json.data
            const name = data.result
            dispatch({
                type: ActionTypes.BEFORE_MODIFY_ACCOUNTCONF_RUNNING_OLD,
                currentPage,
                name,
                item
            })
            }
        })
}


export const closeAccountconfModal = () => ({
    type: ActionTypes.CLOSE_ACCOUNTCONF_MODAL
})

export const accountConfRunningTriangleSwitch = (showChild, uuid) => ({
    type: ActionTypes.ACCOUNTCONF_RUNNING_TRIANGLE_SWITCH,
    showChild,
    uuid
})

export const accountconfRunningCheckboxCheck = (item, upperArr) => ({
    type: ActionTypes.ACCOUNTCONF_RUNNING_CHECKBOX_CHECK,
    item,
    upperArr
})

// export const selectOrUnselectRunningAll = (selectAll) => ({
//     type: ActionTypes.SELECT_OR_UNSELECT_RUNNING_ALL,
//     selectAll
// })

export const accountconfAccountCheckboxCheck = (checked, uuid) => ({
    type: ActionTypes.ACCOUNTCONF_ACCOUNT_CHECKBOX_CHECK,
    checked,
    uuid
})

export const selectOrUnselectAccountAll = (selectAll) => ({
    type: ActionTypes.SELECT_OR_UNSELECT_ACCOUNT_ALL,
    selectAll
})

export const accountConfTaxRateSettingScale = (value) => ({
    type: ActionTypes.ACCOUNTCONF_TAX_RATE_SETTING_SCALE,
    value
})

export const selectAccountConfUpperCategory = (value) => ({
    type: ActionTypes.SELECT_ACCOUNTCONF_UPPER_CATEGORY,
    value
})

export const changeAccountConfCommonString = (tab, place, value) =>(dispatch) => {
    let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
    dispatch({
      type: ActionTypes.CHANGE_ACCOUNTCONF_COMMON_STRING,
      placeArr,
      value
    })
}
export const changeAccountConfCommonFlagsString = (place, value) => (dispatch) => {
    const placeArr = typeof place === 'string' ? ['flags', place] : ['flags', ...place]
    dispatch({
      type: ActionTypes.CHANGE_ACCOUNTCONF_COMMON_STRING,
      placeArr,
      value
    })
}
export const changeAccountConfRunningCategory = (value) => (dispatch) => {
    const placeArr = ['runningCategory', 0]
    dispatch({
      type: ActionTypes.CHANGE_ACCOUNTCONF_COMMON_STRING,
      placeArr,
      value
    })
}
export const selectAccountConfAllAc = (acId, acFullName, asscategorylist, tab, place) => ({
    type: ActionTypes.SELECT_ACCOUNTCONF_ALL_AC,
    acId,
    acFullName,
    asscategorylist,
    tab,
    place
})

export const selectAccountConfMultipleAc = (acList, place, assList, assPlace) => (dispatch) => {
  const placeArr = typeof place === 'string' ?['runningTemp', place] :['runningTemp', ...place]
  dispatch({
    type: ActionTypes.SELECT_ACCOUNTCONF_MULTIPLE_AC,
    acList,
    placeArr,
    assList,
    assPlace
  })
}

export const changeAccountConfAccountNumber = (accountType, value) => ({
    type: ActionTypes.CHANGE_ACCOUNTCONF_ACCOUNT_NUMBER,
    accountType,
    value
})

// 流水类别保存与保存并新增
export const saveAccountConfRunningCategory = (saveAndNew) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const accountConfState = getState().accountConfState
    const insertOrModify = accountConfState.getIn(['flags', 'insertOrModify'])
    const runningTemp = accountConfState.get('runningTemp')
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

        if (showMessage(json)) {
            if(saveAndNew) {
                dispatch(beforeInsertAccountConf('running', fromJS({uuid,level})))
                // dispatch(getRunningCategory())

            } else {
                dispatch({
                    type: ActionTypes.AFTER_UPDATE_ACCOUNTCONF_RUNNING_CATEGORY,
                    receivedData: json.data
                })
            }

        }

        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 流水类别保存与保存并新增  saveFrom区分录入流水
export const saveAccountConfAccount = (saveAndNew,saveFrom) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const accountConfState = getState().accountConfState
    const insertOrModify = accountConfState.getIn(['flags', 'insertOrModify'])

    const accountTemp = accountConfState.get('accountTemp').toJS()

    fetchApi(`${insertOrModify}RunningAccount`, 'POST', JSON.stringify({
        ...accountTemp
    }), json => {
    //
        if (showMessage(json)) {

            dispatch({
                type: ActionTypes.AFTER_UPDATE_ACCOUNTCONF_ACCOUNT,
                saveAndNew,
                receivedData: json.data
            })
            if(saveFrom === 'fromLrAccount'){
                dispatch({
                  type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING,
                  tab:'',
                  placeArr:['flags', 'showAccountModal'],
                  value:false
                })
            }
        }

        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })

}
// 税费保存与保存并新增
export const saveAccountConfTaxRate = (saveAndNew) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const accountConfState = getState().accountConfState
    const insertOrModify = accountConfState.getIn(['flags', 'insertOrModify'])

    const taxRateTemp = accountConfState.get('taxRateTemp')
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
    fetchApi(`canModifyRunningTaxRate`, 'POST', JSON.stringify({
        ...data
    }), json => {
        if(!json.data.result.hasBusiness){
            fetchApi(`modifyRunningTaxRate`, 'POST', JSON.stringify({
                ...data
            }), json => {
                if (showMessage(json, 'show')) {
                    dispatch(changeAccountConfCommonFlagsString('isTaxQuery', true))
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }else{
            if(json.data.result.canModify){
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                thirdParty.Confirm({
                    message: json.data.result.msg,
                    title: '温馨提示',
                    buttonLabels: ['取消', '确定'],
                    onSuccess: (result) => {
                        if (result.buttonIndex === 1) {
                            fetchApi(`modifyRunningTaxRate`, 'POST', JSON.stringify({
                                ...data
                            }), json => {
                                if (showMessage(json, 'show')) {
                                    dispatch(changeAccountConfCommonFlagsString('isTaxQuery', true))
                                }

                            })
                        }else{
                            dispatch(getRunningTaxRate())
                        }
                    }
                })
            }else{
                message.error(json.data.result.msg)
                dispatch(getRunningTaxRate())
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            }
        }
    })


}

// 删除流水类别
export const deleteAccountConfRunning = () => (dispatch, getState) => {

    const accountConfState = getState().accountConfState
    const deleteList = accountConfState.getIn(['flags', 'runningSelect'])

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
                        message.success(json.message)
                        dispatch({
                            type: ActionTypes.AFTER_UPDATE_ACCOUNTCONF_RUNNING_CATEGORY,
                            receivedData: json.data
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        }
    })
}

export const deleteAccountConfAccount = () => (dispatch, getState) => {

    const accountConfState = getState().accountConfState
    const deleteList = accountConfState.getIn(['flags', 'accountSelect'])

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

export const changeAccountConfcCheckboxArr = (placeArr, values) => (dispatch) => {
    let valArr = []
    values.forEach(v => {
      switch (v) {
        case '销售费用': valArr.push('XZ_SALE')
          break
        case '管理费用': valArr.push('XZ_MANAGE')
          break
        case '财务费用': valArr.push('XZ_FINANCE')
          break
        default:
      }
    })
    dispatch({
      type: ActionTypes.CHANGE_ACCOUNTCONF_PROPERTY,
      placeArr,
      valArr

    })
}
export const changeCardCheckboxArr = (categoryTypeObj, rangeType, uuid,checked) => (dispatch, getState) => {
    const range = getState().accountConfState.getIn(['runningTemp', categoryTypeObj, rangeType])
    let valArr
    if (checked) {
        valArr = range.update(v => v.concat(uuid))
    } else {
        valArr = range.update(v => v.filter(w => w !== uuid))
    }
    const placeArr = ['runningTemp',categoryTypeObj,rangeType]
    dispatch({
      type: ActionTypes.CHANGE_ACCOUNTCONF_PROPERTY,
      placeArr,
      valArr

    })
}
export const changeCardCheckboxArrOut = (rangeType, uuid,checked) => (dispatch, getState) => {
    const range = getState().accountConfState.getIn(['runningTemp', rangeType])
    let valArr
    if (checked) {
        valArr = range.update(v => v.concat(uuid))
    } else {
        valArr = range.update(v => v.filter(w => w !== uuid))
    }
    const placeArr = ['runningTemp',rangeType]
    dispatch({
      type: ActionTypes.CHANGE_ACCOUNTCONF_PROPERTY,
      placeArr,
      valArr

    })
}
export const changeDefaultAccount = (defaultAc,property,categoryTypeObj) => (dispatch) => {
    const type = {
        'SX_SHBX':'AC_JT_YFSB',
        'SX_ZFGJJ':'AC_JT_YFGJJ',
        'SX_QTXC':'AC_JT_YFXC',
        'SX_QYSDS':['AC_YFQYSDS','AC_QYSDS'],
        'SX_QTSF':['AC_YFSF','AC_SF'],
        'SX_GRSF':'AC_SDS',
        'SX_FLF':'AC_FLF',
        'SX_GQ':['AC_TZ','AC_TZ_SY'],
        'SX_ZQ':['AC_TZ','AC_TZ_SY'],
        'SX_GDZC':['AC_ZC_ASSETS','AC_ZC_CLEANING','AC_ZC_ZJ'],
        'SX_WXZC':['AC_ZC_ASSETS','AC_ZC_CLEANING','AC_ZC_ZJ'],
        'SX_TZXFDC':['AC_ZC_ASSETS','AC_ZC_CLEANING','AC_ZC_ZJ'],
    }[property]
    const getAcItem = (defaultAc,type,property) => {
        const JTAc = defaultAc.find(v => v.get('type') === type && v.get('property') === property)
        const acId = JTAc ? JTAc.get('acId') : ''
        const acFullName = JTAc ? JTAc.get('acFullName'): ''
        return {acId,acFullName}
    }
    if (property === 'SX_GRSF') {
        dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type,property)], [categoryTypeObj, 'payAc']))
    } else if(typeof type === 'string') {
        dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type,property)], [categoryTypeObj, 'accruedAc']))
    } else {
        if (property === 'SX_QYSDS' || property === 'SX_QTSF') {
            dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type[0],property)], [categoryTypeObj, 'accruedAc']))
            dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type[1],property)], [categoryTypeObj, 'payAc']))
        } else if (property === 'SX_GQ' || property === 'SX_ZQ') {
            dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type[0],property)], [categoryTypeObj, 'investAc']))
            dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type[1],property)], [categoryTypeObj, 'profitAc']))
        } else if (property === 'SX_GDZC' || property === 'SX_WXZC' || property === 'SX_TZXFDC') {
            dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type[0],property)], [categoryTypeObj, 'assetsAc']))
            dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type[1],property)], [categoryTypeObj, 'cleaningAc']))
            dispatch(selectAccountConfMultipleAc([getAcItem(defaultAc,type[2],property)], [categoryTypeObj, 'depreciationAc']))

        }


    }

}
export const emptyAccountCheck = (deleteArr) => (dispatch) => {
  deleteArr.forEach(deleteItem => {
    const { tab, place, value } = deleteItem
    let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
    dispatch({
      type: ActionTypes.CHANGE_ACCOUNTCONF_COMMON_STRING,
      placeArr,
      value
    })
  })
}
export const swapRunningItem = (fromCategoryUuid,toCategoryUuid) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('runningSwapItem','POST', JSON.stringify({
            fromCategoryUuid,
            toCategoryUuid
        }),json => {
        if (showMessage(json)) {
            dispatch(changeAccountConfRunningCategory(fromJS(json.data.categoryList[0])))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const enabledCategory = (enabledList) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('enabledCategory','POST', JSON.stringify({
        enabledList
    }), json => {
        if (showMessage(json)) {
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
        if (showMessage(json)) {
            const parentUuidList = json.data.parentList
            dispatch(changeItemDisableStatus(disabledList[0],true,parentUuidList))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const changeItemDisableStatus = (uuid,disabled,parentUuidList) => (dispatch,getState) => {
    const accountConfState = getState().accountConfState
    const list = accountConfState.getIn(['runningCategory',0,'childList'])
    const disableList = accountConfState.getIn(['runningCategory',0,'disableList'])
    let uuidList = [uuid]
    if (disabled && parentUuidList.length) {
        uuidList = uuidList.concat(parentUuidList)
    }
    const loop = (uuidList, list, placeArr,findMode) => {
        list && list.size && list.find((item, index) => {
            if(uuidList.find(w => w === item.get('uuid'))) {
                dispatch({
                    type:ActionTypes.CHANGE_ITEM_DISABLE_STATUS,
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
const getCategoryType = (categoryType) => {
    const categoryTypeObj = {
        'LB_YYSR': 'acBusinessIncome',
        'LB_YYZC': 'acBusinessExpense',
        'LB_YYWSR': 'acBusinessOutIncome',
        'LB_YYWZC': 'acBusinessOutExpense',
        'LB_JK': 'acLoan',
        'LB_TZ': 'acInvest',
        'LB_ZB': 'acCapital',
        'LB_CQZC': 'acAssets',
        'LB_FYZC': 'acCost',
        'LB_ZSKX': 'acTemporaryReceipt',
        'LB_ZFKX': 'acTemporaryPay',
        'LB_XCZC': 'acPayment',
        'LB_SFZC': 'acTax',
    }[categoryType]

    const categoryTypeObjList = [
        'acAssets',
        'acBusinessExpense',
        'acBusinessIncome',
        'acBusinessOutExpense',
        'acBusinessOutIncome',
        'acCapital',
        'acCost',
        'acInvest',
        'acLoan',
        'acPayment',
        'acTax',
        'acTemporaryReceipt',
        'acTemporaryPay'

    ]
    categoryTypeObjList.splice(categoryTypeObjList.indexOf(categoryTypeObj),1)
    return categoryTypeObjList
}

// add regret
export const getRegretCategory = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRegretCategory', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_REGRET_CATEGORY,
                receivedData: json.data
            })
        }

        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeRegretAccountAccountName = (tab, placeUUid, placeName,isBalance,isBusiness, value) => ({
    type: ActionTypes.CHANGE_REGRET_ACCOUNT_ACCOUNT_NAME,
	tab,
	placeUUid,
	placeName,
    isBalance,
    isBusiness,
    value
})

export const changeRegretAccountCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
  if(place[0] === 'flags') {placeArr = place}
  dispatch({
    type: ActionTypes.CHANGE_REGRET_ACCOUNT_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}

export const changeRegretCancle = () => ({
    type: ActionTypes.CHANGE_REGRET_CANCLE
})
export const saveRegretMessage = () => (dispatch,getState) => {
    const accountConfState = getState().accountConfState
    const name = accountConfState.getIn(['regretTemp','subordinateName'])
    const uuid = accountConfState.getIn(['regretTemp','categoryUuid'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('saveRegretMessage', 'POST',JSON.stringify({
        name,
        uuid
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_CATEGORY,
                receivedData: json.data
            })
            dispatch(changeRegretAccountCommonString('regret', 'showConfirmModal',false))
        }else{
            dispatch(changeRegretAccountCommonString('regret', 'showConfirmModal',false))
            dispatch(changeRegretAccountCommonString('regret', 'showModal',true))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
