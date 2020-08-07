import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage, formatDate, upfileLs } from 'app/utils'
import { message, Modal } from 'antd'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { getCategorynameByType } from 'app/containers/Edit/EditRunning/common/common.js'
export { getApprovalProjectCardList, getApprovalRelativeCardList, getApprovalStockCardList } from 'app/redux/Search/SearchApproval/searchApproval.action.js'
export { getStokcListFromConfig } from 'app/redux/Edit/EditCalculate/editCalculate.action.js'

// export const changeLrAccountCommonString = (tab, place, value) => (dispatch) => {
//     let placeArr = typeof place === 'string' ? [`${tab}Temp`,place] : [`${tab}Temp`, ...place]
//     if (place[0] === 'flags') {
//         placeArr = place
//     }
//     dispatch({
//         type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING,
//         tab,
//         placeArr,
//         value
//     })
// }

export const changeViewString = (place, value) => (dispatch) => {

    dispatch({
        type: ActionTypes.CHANGE_EDIT_VIEWA_COMMON_STRING,
        place,
        value
    })
}

export const changeEditOutCommonString = (place,value) => (dispatch) => {
    dispatch({
      type: ActionTypes.CHANGE_EDIT_RUNNING_COMMON_STRING,
      place,
      value
    })
}

export const beforeRunningAddInventoryCard = (showCardModal, range) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi(`getInventoryHighTypeList`, 'GET', '', tagList => {
        if (showMessage(tagList)) {
            fetchApi(`getInitStockCard`, 'GET', '', json => {
                if (showMessage(json)) {
                    let originTags = range ? tagList.data.filter(v => range.indexOf(v.uuid) > -1) : tagList.data
                    // const str = saleOrPurchase == 'sale' ? 'isAppliedPurchase' : 'isAppliedSale'
                    // 将顶级类别处理成只受销售或采购影响
                    // originTags = originTags.map(v => {
                    //     v[str] = false
                    //     return v
                    // })

                    dispatch({
                        type: ActionTypes.BEFORE_ADD_INVENTORY_CONF_CARD_RUNNING,
                        receivedData: json.data,
                        originTags: fromJS(originTags)
                    })
                    showCardModal()
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

export const beforeRunningAddRelativeCard = (showCardModal, range,fromPosition) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageListTitle`, 'GET', '', tagList => {
        if (showMessage(tagList)) {
            fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', typeInfo => {
                if (showMessage(typeInfo)) {
                    fetchApi(`getInitRelaCard`, 'GET', '', json => {
                        if (showMessage(json)) {
                            const originTags = tagList.data
                            originTags.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid': ''})
                            dispatch({
                                type: ActionTypes.BEFORE_ADD_RELATIVE_CARD_FROM_RUNNING,
                                receivedData: json.data,
                                originTags: fromJS(originTags),
                                fromPosition,
                                isCheckOut:typeInfo.data.isCheckOut,
                                range
                            })
                            showCardModal()
                        }
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    })
                } else {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            })
        }
    })
}

export const beforeRunningAddProjectCard = (showCardModal, range,fromPosition) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectConfigHighType', 'GET', '', list => {
        if (showMessage(list)) {
            dispatch({
                type: ActionTypes.PROJECT_GET_HTIGH_TYPE,
                list: list.data,
            })
            fetchApi(`getProjectTree`, 'GET', `uuid=${list.data[1].uuid}`, json => {
                if (showMessage(json)) {
                    let code = ''
                    fetchApi(`getDefaultProjectCode`, 'GET', '', data => {
                            if (showMessage(data)) {
                                code = data.data.code
                            }
                            dispatch({
                                type: ActionTypes.BEFORE_ADD_PROJECT_CARD_FROM_RUNNING,
                                receivedData: json.data.resultList,
                                ctgyUuid: list.data[1].uuid,
                                fromPosition,
                                code
                            })
                            showCardModal()
                    })

                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }
    })

}

// export const getFirstStockCardList = (stockRange, runningState) => (dispatch, getState) => {
//     const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
//     const propertyStock = {
//         STATE_YYSR_XS:'4',
//         STATE_YYSR_TS:'4',
//         STATE_YYZC_TG:'5',
//         STATE_YYZC_GJ:'5',
//     }[runningState]
//     fetchApi('getStockCategoryList', 'POST', JSON.stringify({
//         sobId,
//         categoryList: stockRange,
//         property: propertyStock
//     }),json => {
//         if (showMessage(json)) {
//             dispatch(changeLrAccountCommonString('', ['flags', 'stockThingsList'],  fromJS(json.data.result)))
//         }
//     })
//
// }

// export const getProjectCardList = (projectRange) => (dispatch,getState) => {
//     const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
//     fetchApi('getProjectCardList','POST',JSON.stringify({
//         sobId,
//         categoryList:projectRange,
//         needCommonCard:true
//     }), json => {
//         if (showMessage(json)) {
//             dispatch(changeLrAccountCommonString('', ['flags','projectList'], fromJS(json.data.result)))
//         }
//     })
// }

// 更新项目列表
export const getProjectCardListForchangeConfig = () => (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    const editRunningState = getState().editRunningState
    const beProject = editRunningState.getIn(['oriTemp', 'beProject'])

    if (beProject) {
        const projectRange = editRunningState.getIn(['oriTemp','projectRange'])
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getProjectCardList','POST', JSON.stringify({
            sobId,
            categoryList: projectRange,
            needCommonCard: true,
            needAssist:true,
            needMake:true,
            needIndirect:true,
            needMechanical:true,
        }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('projectList',fromJS(json.data.result)))
            }
        })
    }
}

// 新增存货之后
export const getInventoryCardListForchangeConfig = () => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    const editRunningState = getState().editRunningState
    const oriState = editRunningState.getIn(['oriTemp', 'oriState'])
    const categoryType = editRunningState.getIn(['oriTemp', 'categoryType'])

    const propertyStock = {
        STATE_YYSR_XS:'4',
        STATE_YYSR_TS:'4',
        STATE_YYZC_TG:'5',
        STATE_YYZC_GJ:'5',
    }[oriState]

    const { categoryTypeObj } = getCategorynameByType(categoryType)

    if (propertyStock) {
        const stockRange = editRunningState.getIn(['oriTemp', categoryTypeObj, 'stockRange'])

        if (stockRange && stockRange.size) {
            fetchApi('getStockCategoryList', 'POST', JSON.stringify({
                sobId,
                categoryList: stockRange,
                property: propertyStock
            }), json => {
                if (showMessage(json)) {
                    dispatch(changeEditOutCommonString('stockList', fromJS(json.data.result)))
                }
            })
        }
    }
}

// 新增往来之后
export const getRelativeCardListForchangeConfig = () => (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    const editRunningState = getState().editRunningState
    const oriState = editRunningState.getIn(['oriTemp', 'oriState'])
    const categoryType = editRunningState.getIn(['oriTemp', 'categoryType'])

    const { categoryTypeObj } = getCategorynameByType(categoryType)
    const contactsRange = editRunningState.getIn(['oriTemp', categoryTypeObj, 'contactsRange'])

    if (contactsRange && contactsRange.size) {
        fetchApi('getContactsCategoryList', 'POST', JSON.stringify({
            sobId,
            categoryList: contactsRange,
            property: 'NEEDPAY'
        }), json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('contactsList', fromJS(json.data.result)))
            }
        })
    }
}
