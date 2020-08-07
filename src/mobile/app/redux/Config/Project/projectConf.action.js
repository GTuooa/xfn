import { showMessage } from 'app/utils'
import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

export const projectHighType =  () => (dispatch) => {
    fetchApi(`getProjectConfigHighType`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.PROJECT_HIGH_TYPE,
                list: json.data
            })
        }
    })
}

export const changeProjectData = (dataType, value) => ({
    type: ActionTypes.CHANGE_PROJECT_DATA,
    dataType,
    value
})

export const changeProjectTopData = (dataType, value) => ({
    type: ActionTypes.CHANGE_PROJECT_TOP_DATA,
    dataType,
    value
})

export const getProjectListAndTree = () => (dispatch, getState) => {
    const state = getState().projectConfState
    const listFrom = state.getIn(['views', 'currentType'])

    fetchApi(`getProjectListAndTree`, 'GET', `listFrom=${listFrom}&treeFrom=''`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_LIST_AND_TREE,
                data: json.data
            })
        }
    })
}

export const getProjectCardOne = (uuid, history) => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getProjectCardOne`, 'GET', `uuid=${uuid}`, json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_CARD_ONE,
                data: json.data
            })
            history.push('/config/project/projectCard')
        }
    })
}

export const getProjectCardByType =  (ctgyUuid, subordinateUuid) => (dispatch) => {//通过类别获取卡片
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getProjectCardByType`, 'GET', `ctgyUuid=${ctgyUuid}&subordinateUuid=${subordinateUuid}`, json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch(changeProjectTopData('cardList', fromJS(json.data.resultList)))
        }
    })
}

export const deleteProjectCard = (dataList, deleteFrom, treeFrom, callBack) => (dispatch) => {
    const deleteList = dataList.filter(v => v.get('checked')).map(v => ({uuid: v.get('uuid')}))
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`deleteProjectCard`, 'POST', JSON.stringify({
        deleteFrom,
        treeFrom,
        deleteList
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if (json.data.error) {
                thirdParty.toast.info(json.data.error)
            } else {
                thirdParty.toast.success('删除成功')
            }
            dispatch(changeProjectTopData('cardList', fromJS(json.data.resultList)))
            dispatch(changeProjectTopData('treeList', fromJS(json.data.typeList)))
            callBack()
        }
    })
}

export const getProjectConfigHighTypeOne = (uuid) => (dispatch) => {//获取顶级类别详细信息

    const getHighTypeData = new Promise(resolve => {
        fetchApi(`getProjectConfigHighTypeOne`, 'GET', `uuid=${uuid}`, json => {
            if (showMessage(json)) {
                resolve(json.data)
            }
        })
    })

    const treeList = new Promise(resolve => {
        fetchApi(`getProjectListAndTree`, 'GET', `listFrom=${uuid}&treeFrom=''`, json => {
            if (showMessage(json)) {
                resolve(json.data.typeList)
            }
        })
    })

    Promise.all([getHighTypeData, treeList]).then(results => {
        let highTypeData = results[0]
        highTypeData['treeList'] = results[1]
        dispatch(changeProjectTopData('highTypeData', fromJS(highTypeData)))
    })


}

export const modifyProjectConfigHighType = () => (dispatch, getState) => {//修改顶级类别
    const state = getState().projectConfState
    const psiData = state.get('highTypeData').toJS()

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`modifyProjectConfigHighType`, 'POST', JSON.stringify({
        psiData
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            thirdParty.toast.info(json.message)
            if (json.code == 0) {
                thirdParty.toast.success('保存成功')
            }

        }
    })
}

export const checkedProjectCategory = (uuid, value) => ({
    type: ActionTypes.CHECKED_PROJECT_CATEGORY,
    uuid,
    value
})

export const deleteProjectType = (ctgyUuid, treeList, callBack) => (dispatch, getState) => {//删除卡片类别
    let deleteList = []
    const loop = (data) => data.map((item) => {
            if (item.get('checked')) {
                deleteList.push(item.get('uuid'))
            }
            if (item.get('childList').size > 0) {
                loop(item.get('childList'))
            }
        })

    loop(treeList)

    if (deleteList.length == 0) {
        return thirdParty.toast.info('请选择需要删除的类别')
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`deleteProjectType`, 'POST', JSON.stringify({
        ctgyUuid,
        deleteList
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            thirdParty.toast.info(json.message)
            if (json.code == 0) {
                dispatch(changeProjectData(['highTypeData', 'treeList'], fromJS(json.data.resultList)))
                callBack()
            }

        }
    })
}

export const swapProjectTypePosition = (categoryUuid, selectedSubordinateUuid, swappedSubordinateUuid) => (dispatch) => {//上下移
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`swapProjectTypePosition`, 'POST', JSON.stringify({
        psiData: {
            categoryUuid,
            selectedSubordinateUuid,
            swappedSubordinateUuid
        }
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            thirdParty.toast.info(json.message)
            if (json.code == 0) {
                dispatch(changeProjectTopData('treeList', fromJS(json.data.resultList)))
            }

        }
    })
}

export const getProjectTreeOne = (uuid) => (dispatch) => {//获取类别详情
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getProjectTreeOne`, 'GET', `uuid=${uuid}`, json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch(changeProjectTopData('treeData', fromJS(json.data)))
        }
    })
}

export const saveProjectTypeInsert = (currentType, treeData, history) => (dispatch) => {
    const name = treeData.get('name')
    if (name.length == 0) {
        return thirdParty.toast.info('请填写类别名称')
    }
    if (name.length > 30) {
        return thirdParty.toast.info('类别名称最多30个字符')
    }
    if (name == '全部') {
        return thirdParty.toast.info('类别名称不能为全部')
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('adjustProjectTypeNameSame', 'POST', JSON.stringify({
        psiData: treeData.toJS()
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if (json.data.repeat) {
                thirdParty.Confirm({
                    message: '卡片类别名称与已有卡片类别名称重复，确定保存吗？',
                    title: "名称重复",
                    buttonLabels: ['取消', '确定'],
                    onSuccess : (result) => {
                        if (result.buttonIndex === 1) {
                            dispatch(insertProjectTreeOne(currentType, treeData, history))
                        }
                    },
                    onFail : (err) => alert(err)
                })
            } else {
                dispatch(insertProjectTreeOne(currentType, treeData, history))
            }
        }
    })
}

export const insertProjectTreeOne = (currentType, treeData, history) => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`insertProjectTreeOne`, 'POST', JSON.stringify({
        psiData: {
            ctgyUuid: currentType,
            ...treeData.toJS()
        }
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            thirdParty.toast.info(json.message)
            if (json.code == 0) {
                history.goBack()
                dispatch(changeProjectTopData('treeList', fromJS(json.data.resultList)))
            }

        }
    })
}

export const initProjectData = (dataType,fromPage='project') => ({
    type: ActionTypes.INIT_PROJECT_DATA,
    dataType,
    fromPage
})

// editRunning
// searchApproval
export const checkProjectCard = (fromPage, history, saveAndNew) => (dispatch, getState) => {
    const state = getState().projectConfState
    const psiData = state.getIn(['data', 'psiData'])

    const selectUuid = psiData.get('selectUuid')
    if (selectUuid == '') {
        return thirdParty.toast.info('请选择类别')
    }
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('adjustProjectCardNameSame', 'POST', JSON.stringify({
        psiData: {
            name: psiData.get('name'),
            uuid: psiData.get('uuid')
        }
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if (json.data.repeat) {
                thirdParty.Confirm({
                    message: `卡片名称与[编码：${json.data.card.code}]卡片重复，确定保存吗？`,
                    title: "名称重复",
                    buttonLabels: ['取消', '确定'],
                    onSuccess : (result) => {
                        if (result.buttonIndex === 1) {
                            dispatch(saveProjectCard(fromPage, history, saveAndNew))
                        }
                    },
                    onFail : (err) => alert(err)
                })
            } else {
                dispatch(saveProjectCard(fromPage, history, saveAndNew))
            }
        }
    })
}

export const saveProjectCard = (fromPage, history, saveAndNew) => (dispatch, getState) => {
    const state = getState().projectConfState
    const psiData = state.getIn(['data', 'psiData'])
    const isInsert = state.getIn(['views', 'insertOrModify']) == 'insert' ? true : false

    const fromPageType = {
        'editRunning': 'SAVE_JR-QUICK_MANAGER-SAVE_PROJECT',
        'project': 'MANAGER-PROJECT_SETTING-CUD_CARD',
        'searchApproval': 'QUERY_PROCESS-QUICK_MANAGER-SAVE_PROJECT',
        'editApproval':'INITIATE_PROCESS-QUICK_MANAGER-SAVE_PROJECT'
    }

    console.log('fromPage', fromPage);


    const data = isInsert ? {
        insertFrom: state.getIn(['views', 'currentType']),
        needAutoIncrementCode: saveAndNew ? true : false,
        treeFrom: state.getIn(['views', 'treeUuid']),
        psiData: psiData.toJS(),
        action: fromPageType[fromPage]
    } : {
        modifyFrom : state.getIn(['views', 'currentType']),
        treeFrom: state.getIn(['views', 'treeUuid']),
        psiData: psiData.toJS()
    }
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`${isInsert ? 'insertProjectCard' : 'editProjectCard'}`, 'POST', JSON.stringify(data), json => {
        thirdParty.toast.hide()
        if (showMessage(json, fromPage === 'editApproval'?'':'show')) {
            if (saveAndNew) {
                dispatch(changeProjectData(['data', 'psiData', 'name'], ''))
                dispatch(changeProjectData(['data', 'psiData', 'code'], json.data['autoIncrementCode']))
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_EDIT_PROJECT_CARD,
                    receivedData: json.data.resultList
                })
            } else {
                if (fromPage === 'editApproval') {
                    const callback = getState().editApprovalState.getIn(['modelInfo','callback'])
                    callback(psiData.toJS())
                //     const modelCode = getState().editApprovalState.getIn(['modelInfo','modelCode'])
                //     dispatch(editApprovalActions.updateInstanceModel(modelCode,'contactCard',{
                //         code:psiData.code,
                //         name:psiData.name,
                //         property:psiData.property,
                //         },closeModal))
                //         return
                }
                // const fromPage = state.getIn(['views', 'fromPage'])
                if (fromPage !== 'project' && fromPage !== 'editApproval') {
                    // 刷新录入页面
                    dispatch(editRunningConfigActions.getPrejectCardListForchangeConfig())
                } else {
                    dispatch({
                        type: ActionTypes.AFTER_SUCCESS_EDIT_PROJECT_CARD,
                        receivedData: json.data.resultList
                    })
                }

                history.goBack()
            }
        }
    })
}

export const getProjectTree = (uuid) => (dispatch) => {//获取类别树
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getProjectTree`, 'GET', `uuid=${uuid}`, json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch(changeProjectTopData('treeList', fromJS(json.data.resultList)))
            const data = json.data.resultList[0]

            if (data['childList'].length == 0) {
                dispatch(changeProjectData(['data', 'psiData', 'selectName'], data['name']))
                dispatch(changeProjectData(['data', 'psiData', 'selectUuid'], data['uuid']))
                dispatch(changeProjectData(['data', 'psiData', 'categoryTypeList', 0], fromJS({
                    ctgyUuid: uuid,
                    subordinateUuid: data['uuid']
                })))
            } else {
                dispatch(changeProjectData(['data', 'psiData', 'selectName'],''))
                dispatch(changeProjectData(['data', 'psiData', 'selectUuid'], ''))
                dispatch(changeProjectData(['data', 'psiData', 'categoryTypeList', 0], fromJS({
                    ctgyUuid: uuid,
                    subordinateUuid: ''
                })))
            }
        }
    })
}

export const uncheckedProject = (dataType) => ({
    type: ActionTypes.UNCHECKED_PROJECT,
    dataType
})

export const getProjectCardCode = () => (dispatch) => {
    fetchApi(`getProjectCardCode`, 'GET', ``, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.BEFORE_ADD_PROJECT_CARD_GET_CODE,
                value: json.data.code
            })
        }
    })
}
