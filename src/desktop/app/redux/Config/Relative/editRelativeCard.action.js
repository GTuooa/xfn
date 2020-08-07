import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import { fromJS, toJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { message } from 'antd'

import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action'

// 新增存货卡片前 存货页面
export const beforeRelativeAddCard = (showCardModal, originTags) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', typeInfo => {
        if (showMessage(typeInfo)) {
            let code
            fetchApi(`getInitRelaCard`, 'GET', '', json => {
                if (showMessage(json)) {
                    code = json.data.code
                    dispatch({
                        type: ActionTypes.BEFORE_ADD_RELATIVE_CARD,
                        data: typeInfo.data,
                        originTags,
                        code
                    })
                }
            })
        }
        showCardModal()
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 修改存货卡片前
export const beforeRelativeEditCard = (item, showModal, originTags) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageOneCardInfo`, 'GET', `uuid=${item.get('uuid')}`, card => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(card)) {
            dispatch({
                type: ActionTypes.BEFORE_EDIT_RELATIVE_CARD,
                data: card.data,
                originTags
            })
            showModal()
        }
    })
}

// 修改存货卡片字段
export const changeRelativeCardContent = (name, value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_RELATIVE_CARD_CONTENT,
		name,
        value
	})
}

// 修改存货卡片字段
export const changeRelativeViewsContent = (name, value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
		name,
        value
	})
}
// 修改 往来关系： 字段
// export const changeRelativeCardRelative = (name,value) => dispatch => {
//     dispatch({
// 		type: ActionTypes.CHANGE_RELATIVE_CARD_RELATIVE,
// 		name,
//         value
// 	})
// }

// 勾选后要获取到对应的类别
export const changeRelativeCardCategoryStatus = (item, value) => dispatch => {
    fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${item.get('uuid')}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_RELATIVE_CARD_CATEGORY_STATUS,
                list: json.data.resultList,
                item: item,
                value: value,
            })
        }
    })
}

// 选类别
export const changeRelativeCardCategoryType = (item, value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
    dispatch({
        type: ActionTypes.CHANGE_RELATIVE_CARD_CATEGORY_TYPE,
        item: item,
        uuid: valueList[0],
        name: valueList[1],
    })
}

// 保存 存货设置页面的存货 卡片
export const saveRelativeCard = (fromPage, flag, closeModal, showConfirmModal, closeConfirmModal) => (dispatch, getState) => {

    const homeState = getState().homeState
    const allPanes = homeState.get('allPanes')
    const psiData = getState().relativeCardState.get('relativeCardTemp').toJS()
    const insertOrModify = getState().relativeCardState.getIn(['views', 'insertOrModify'])
    const range = getState().relativeCardState.getIn(['views', 'range'])

    let from = ''
    let treeFrom = ''
    if (allPanes.get('ConfigPanes').find(v => v.get('title') === '往来设置')) {
        from = getState().relativeConfState.getIn(['views', 'activeTapKeyUuid'])
        treeFrom = getState().relativeConfState.getIn(['views', 'selectTypeId'])
    }

    const save = () => {
        if (insertOrModify === 'insert') {

            const fromPageType = {
                'editRunning': 'SAVE_JR-QUICK_MANAGER-SAVE_CONTACT', 
                'relativeConfig': 'MANAGER-CONTACT_SETTING-CUD_CONTACT_CARD',
                'searchApproval': 'QUERY_PROCESS-QUICK_MANAGER-SAVE_CONTACT'
            }
            fetchApi('saveIUManageCard', 'POST', JSON.stringify({
                psiData: psiData,
                insertFrom: from,
                treeFrom,
                needAutoIncrementCode: flag === 'insert' ? false : true,
                action: fromPageType[fromPage]
            }), json => {
                if (showMessage(json, 'show')) {
                    dispatch({
                        type: ActionTypes.SAVE_RELATIVE_CARD,
                        list: json.data.resultList,
                        flag: flag,
                        autoIncrementCode: json.data.autoIncrementCode,
                    })
                    if (closeModal) {
                        closeModal()
                    }

                    // 同步录入流水数据
                    dispatch(afterEditRelativeConf(fromPage))

                    if (fromPage === 'editRunning' && range.some(v => psiData.categoryTypeList.some(w =>  w.ctgyUuid === v))) {
                        const cardItem = json.data.resultList.find(v => v.code ===  psiData.code)
                        if (cardItem) {
                            const cardUuid = cardItem.uuid
                            dispatch(editRunningActions.changeLrAccountCommonString('ori','currentCardList',fromJS([{code: psiData.code, name: psiData.name, cardUuid}])))
                        } 
                    }
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        } else {
            fetchApi('editIUManageCard', 'POST', JSON.stringify({
                psiData:psiData,
                modifyFrom:from,
                treeFrom,
            }), json => {
                if (showMessage(json, 'show')) {
                    // dispatch({
                    //     type:ActionTypes.SAVE_RELATIVE_CARD,
                    //     list:json.data.resultList,
                    // })
                    dispatch({
                        type: ActionTypes.SAVE_RELATIVE_CARD,
                        list: json.data.resultList,
                        flag: flag,
                        autoIncrementCode: json.data.autoIncrementCode,
                    })
                    closeModal()

                    // 同步录入流水数据
                    dispatch(afterEditRelativeConf())

                    if (fromPage === 'editRunning' && range.some(v => psiData.categoryTypeList.some(w =>  w.ctgyUuid === v))) {
                        const cardItem = json.data.resultList.find(v => v.code ===  psiData.code)
                        if (cardItem) {
                            const cardUuid = cardItem.uuid
                            dispatch(editRunningActions.changeLrAccountCommonString('ori','currentCardList',fromJS([{code: psiData.code, name: psiData.name, cardUuid}])))
                        } 
                    }
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('adjustIUmanageCardTitleSame', 'POST', JSON.stringify({
        psiData:{
            name: psiData.name,
            uuid: psiData.uuid
        }
    }), json => {
        if (showMessage(json)) {
            if (json.data.repeat) {
                showConfirmModal()
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                thirdParty.Confirm({
                    message: `卡片名称与【编码：${json.data.card.code}】卡片重复，确定保存吗？`,
                    title: "名称重复",
                    buttonLabels: ['取消', '确定'],
                    onSuccess: (result) => {
                        if (result.buttonIndex === 1) {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            save()
                            closeConfirmModal()
                        } else {
                            closeConfirmModal()
                        }
                    },
                    onFail: (err) => console.log(err)
                })
            } else {
                save()
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

// 删除卡片
export const deleteRelativeCardList = () => (dispatch,getState) => {

    const from = getState().relativeConfState.getIn(['views', 'activeTapKeyUuid'])
    const treeFrom = getState().relativeConfState.getIn(['views', 'activeTreeKeyUuid'])
    const deleteList = getState().relativeConfState.getIn(['views', 'cardSelectList'])

    thirdParty.Confirm({
        message: '确定删除卡片？',
        title: "提示",
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if (result.buttonIndex === 1) {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                fetchApi('deleteIUManageListCard', 'POST', JSON.stringify({
                    deleteList,
                    deleteFrom: from,
                    treeFrom,
                }), json => {
                    if (showMessage(json)) {
                        dispatch({
                            type: ActionTypes.DELETE_RELATIVE_CARD_LIST,
                            list: json.data.resultList,
                            treeList: json.data.typeList
                        })
                        if (json.data.error === "") {
                            message.info('删除成功')
                        } else {
                            message.info(json.data.error)
                        }
                        // 同步录入流水数据
                        dispatch(afterEditRelativeConf())
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        },
        onFail: (err) => console.log(err)
    })
}


export const afterEditRelativeConf = (fromPage) => (dispatch, getState) => {

    const homeState = getState().homeState
    const allPanes = homeState.get('allPanes')
    const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    if (newJr === true) {
        if (fromPage === 'searchApproval') {
            dispatch(configCallbackActions.getApprovalRelativeCardList())

            if (allPanes.get('EditPanes').find(v => v.get('title') === '录入流水')) {
                setTimeout(() => {
                    dispatch(configCallbackActions.getRelativeCardListForchangeConfig())
                },800) 
            }
        } else if (allPanes.get('EditPanes').find(v => v.get('title') === '录入流水')) {
            dispatch(configCallbackActions.getRelativeCardListForchangeConfig())
        }
    } else {
        const cardTemp = getState().lrAccountState.get('cardTemp')
        const categoryType = cardTemp.get('categoryType')
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
        const contactsRange = cardTemp.getIn([categoryTypeObj,'contactsRange'])
        const runningState = cardTemp.get('runningState')

        contactsRange && contactsRange.size && dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,runningState))
    }
}
export const adjustAllRelativeCardList=(openAdjustAllCardListModal)=>dispatch=>{
    openAdjustAllCardListModal()
}
