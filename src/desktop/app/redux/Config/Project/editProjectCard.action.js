import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { message } from 'antd'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
import * as projectConfActions from 'app/redux/Config/Project/project.action.js'

export const beforeProjectAddCard = (showCardModal, originTags,projectPropertyName,noFresh) => (dispatch, getState) => {
    let code = ''
    const originTags = originTags || getState().projectConfState.get('originTags')
    const key = originTags.findIndex(v => v.get('name') === '损益项目')
    const activeTapKey = getState().projectConfState.getIn(['views','activeKey'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getDefaultProjectCode`, 'GET', '', json => {
            if (showMessage(json)) {
                code = json.data.code
                fetchApi(`getProjectTree`, 'GET', `uuid=${originTags.getIn([key, 'uuid'])}`, list => {
                    if (showMessage(list)) {
                        dispatch({
                            type: ActionTypes.BEFORE_ADD_PROJECT_CARD,
                            data: list.data.resultList,
                            code,
                            noFresh,
                        })
                        showCardModal && showCardModal()
                    }
                })
            }
    })
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
}
export const changeProjectPropertyState = (projectProperty,projectPropertyName) =>  (dispatch, getState) => {
    let code = ''
    const originTags = originTags || getState().projectConfState.get('originTags')
    const key = originTags.findIndex(v => v.get('name') === projectPropertyName)
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getProjectTree`, 'GET', `uuid=${originTags.getIn([key, 'uuid'])}`, list => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(list)) {
            dispatch({
                type: ActionTypes.CHANGE_PROJECT_PROPERTY,
                data: list.data.resultList,
                projectProperty,
                projectPropertyName
            })
        }
    })
}
export const beforeEditProjectCard = (item, showModal, originTags) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getProjectCardOne`, 'GET', `uuid=${item.get('uuid')}`, card => {
        if (showMessage(card)) {
            dispatch({
                type: ActionTypes.BEFORE_EDIT_PROJECT_CARD,
                data: card.data,
                originTags
            })
            showModal()
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

export const changeProjectCardContent = (name, value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_PROJECT_CARD_CONTENT,
		name,
        value
	})
}

export const changeProjectViewsContent = (name, value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
		name,
        value
	})
}

// 选类别
export const changeProjectCardCategoryType = (value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
    dispatch({
        type: ActionTypes.CHANGE_PROJECT_CARD_CATEGORY_TYPE,
        uuid: valueList[0],
        name: valueList[1],
    })
}

export const saveProjectCard = (fromPage, flag, closeModal, showConfirmModal, closeConfirmModal) => (dispatch, getState) => {

    const homeState = getState().homeState
    const allPanes = homeState.get('allPanes')
    const psiData = getState().projectCardState.get('projectCardTemp').toJS()
    const insertOrModify = getState().projectCardState.getIn(['views', 'insertOrModify'])
    const activeTapKey = getState().projectConfState.getIn(['views', 'activeTapKey'])
    const projectPropertyName = getState().projectCardState.getIn(['projectCardTemp','projectPropertyName'])
    const originTags = getState().projectConfState.get('originTags')
    const key = originTags.findIndex(v => v.get('name') === projectPropertyName)
    const currentKey = originTags.findIndex(v => v.get('name') === activeTapKey)
    let from = ''
    let treeFrom = ''
    let categoryTypeList = []
    if (allPanes.get('ConfigPanes').find(v => v.get('title') === '项目设置')) {
        // 项目设置里的新增
        from = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])
        treeFrom = getState().projectConfState.getIn(['views', 'selectTypeId'])
    }
    categoryTypeList = [{'ctgyUuid': originTags.getIn([key,'uuid']), 'subordinateUuid': psiData.selectUuid}]
    psiData.categoryTypeList = categoryTypeList
    const save = () => {
        if (insertOrModify === 'insert') {

            const fromPageType = {
                'editRunning': 'SAVE_JR-QUICK_MANAGER-SAVE_PROJECT',
                'projectConfig': 'MANAGER-PROJECT_SETTING-CUD_CARD',
                'searchApproval': 'QUERY_PROCESS-QUICK_MANAGER-SAVE_PROJECT'
            }
            fetchApi('insertProjectCard', 'POST', JSON.stringify({
                psiData:psiData,
                insertFrom:from,
                treeFrom,
                needAutoIncrementCode: flag === 'insert' ? false : true,
                action: fromPageType[fromPage]
            }), json => {
                if (showMessage(json, 'show')) {
                    dispatch(projectConfActions.refreshProjectList(fromJS({'name': activeTapKey, 'uuid': from})))
                    dispatch({
                        type: ActionTypes.NEW_SAVE_PROJECT_CARD,
                        flag: flag,
                        code: json.data.autoIncrementCode
                        })
                    flag === 'insert' && closeModal()
                    // 同步录入流水数据
                    dispatch(afterEditProjectConf(fromPage))
                    if (fromPage === 'editRunning') {
                        const newProjectRange = getState().editRunningState.getIn(['oriTemp','newProjectRange']) || fromJS([])
                        const categoryType = getState().editRunningState.getIn(['oriTemp','categoryType']) || fromJS([])
                        let itemList = []
                        switch(categoryType) {
                            case 'LB_CQZC':
                                itemList = json.data.resultList.filter(v => v.projectProperty !== 'XZ_PRODUCE')
                                break
                            default:
                                itemList = json.data.resultList
                        }
                        const item = itemList.filter(v => newProjectRange.some(w => w.get('name') === v.projectPropertyName)).find(v => v.code ===  psiData.code)
                        if (item) {
                            dispatch(editRunningActions.changeLrAccountCommonString('ori','projectCardList',fromJS([{code:psiData.code,name:psiData.name,cardUuid:item.uuid,projectProperty:item.projectProperty}])))
                        }
                    }
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        } else {
            fetchApi('editProjectCard', 'POST', JSON.stringify({
                psiData:psiData,
                modifyFrom:from,
                treeFrom,
            }), json => {
                if (showMessage(json, 'show')) {
                    dispatch(projectConfActions.refreshProjectList(fromJS({'name': activeTapKey, 'uuid': from})))
                    closeModal()
                    // 同步录入流水数据
                    dispatch(afterEditProjectConf())
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('adjustProjectCardNameSame', 'POST', JSON.stringify({
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
export const deleteProjectCardList = () => (dispatch,getState) => {

    const from = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])
    const treeFrom = getState().projectConfState.getIn(['views', 'activeTreeKeyUuid'])
    const deleteList = getState().projectConfState.getIn(['views', 'cardSelectList'])

    thirdParty.Confirm({
        message: '确定删除卡片？',
        title: "提示",
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if (result.buttonIndex === 1) {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                fetchApi('deleteProjectCard', 'POST', JSON.stringify({
                    deleteList,
                    deleteFrom: from,
                    treeFrom,
                }), json => {
                    if (showMessage(json)) {
                        dispatch({
                            type: ActionTypes.DELETE_PROJECT_CONF_CARD,
                            list: json.data.resultList,
                            treeList: json.data.typeList
                        })
                        if (json.data.error === "") {
                            message.info('删除成功')
                        } else {
                            message.info(json.data.error)
                        }
                        // 同步录入流水数据 都删不掉判断一下
                        dispatch(afterEditProjectConf())
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        },
        onFail: (err) => console.log(err)
    })
}

export const afterEditProjectConf = (fromPage) => (dispatch, getState) => {

    const homeState = getState().homeState
    const allPanes = homeState.get('allPanes')
    const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])

    if (fromPage === 'searchApproval') {
        dispatch(configCallbackActions.getApprovalProjectCardList())

        if (allPanes.get('EditPanes').find(v => v.get('title') === '录入流水')) {
            setTimeout(() => {
                dispatch(configCallbackActions.getProjectCardListForchangeConfig())
            },800)
        }
    } else if (allPanes.get('EditPanes').find(v => v.get('title') === '录入流水')) {
        dispatch(configCallbackActions.getProjectCardListForchangeConfig())
    }
}
