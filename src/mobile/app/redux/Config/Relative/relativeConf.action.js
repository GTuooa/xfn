import { showMessage } from 'app/utils'
import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

export const getRelativeListTitle = () => dispatch => {
    fetchApi(`getIUManageListTitle`, 'GET', '', titleList => {
        if (showMessage(titleList)) {
            dispatch({
                type:ActionTypes.GET_RELATIVE_LIST_TITLE,
                title:titleList.data,
            })
        }
    })
}

export const getRelativeListAndTree = (value) => (dispatch,getState) =>{
    const name = value.get('name')
    const uuid = value.get('uuid')
    const anotherTabName = getState().relativeConfState.getIn(['views','anotherTabName'])

    if (name === anotherTabName) {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`getIUmanageListAll`, 'GET', 'listFrom=', list => {
            thirdParty.toast.hide()
            if (showMessage(list)) {
                dispatch({
                    type:ActionTypes.GET_RELATIVE_LIST_BY_TYPE,
                    list:list.data.resultList,
                    name:name,
                    tree:[],
                    uuid:''
                })
            }
        })

    } else {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getIUmanageListAll', 'GET', `listFrom=${uuid}`, list => {
            if (showMessage(list)) {
                fetchApi('getIUManageTreeByType', 'GET', `ctgyUuid=${uuid}`, json => {
                    thirdParty.toast.hide()
                    if (showMessage(json)) {
                        dispatch({
                            type:ActionTypes.GET_RELATIVE_LIST_BY_TYPE,
                            list:list.data.resultList,
                            name:name,
                            tree:json.data.resultList,
                            uuid:uuid,
                        })
                    }
                })
            }
        })

    }
}

export const beforeAddManageTypeCard = (showModal,insertOrModify) => dispatch => {
    const getCode = () => {
        fetchApi(`getInitRelaCard`, 'GET', '', json => {
            if (showMessage(json)) {
                dispatch(changeRelativeCardContent('code', json.data.code))
            }
        })
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', json => {
        if (showMessage(json)) {
            getCode()
            dispatch({
                type:ActionTypes.BEFORE_ADD_MANAGE_TYPE_CARD,
                data:json.data,
                insertOrModify
            })
        }
        thirdParty.toast.hide()
    })
    showModal()
}

export const changeRelativeCardContent = (name,value) => ({
	type: ActionTypes.CHANGE_RELATIVE_CARD_CONTENT,
	name,
    value
})

export const changeManageCardRelative = (item,value) => dispatch => {
    if (value) {
        fetchApi('getIUManageTreeByType', 'GET', `ctgyUuid=${item.get('uuid')}`, json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.CHANGE_MANAGE_CARD_RELATION,
                    tag:item,
                    checked:value,
                    tree:json.data.resultList,
                })
            }
        })
    } else {
        dispatch({
            type: ActionTypes.CHANGE_MANAGE_CARD_RELATION,
            tag:item,
            checked:value,
            tree:[],
        })
    }

}

export const addCardShowType = (uuid) => ({
    type:ActionTypes.RELATIVE_CONFIG_ADD_CARD_SHOW_MODAL,
    uuid
})

export const changeManageCardRelativeType = (uuid, name) => ({
    type: ActionTypes.CHANGE_MANAGE_CARD_RELATION_TYPE,
    uuid,
    name
})

export const changeRelativeCardAc = (value) => dispatch => {
    const valueList = value.get('title').split('_');
    dispatch({
        type: ActionTypes.CHANGE_RELATIVE_CARD_AC,
        uuid: valueList[0],
        name: valueList[1],
    })
}

export const saveRelativeTypeCard = (fromPage, closeModal,flag) => (dispatch,getState) =>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const psiData = getState().relativeConfState.get('relativeCardTemp').toJS()
    const insertOrModify = getState().relativeConfState.getIn(['relativeCardTemp','insertOrModify'])
    const activeTapKeyUuid = getState().relativeConfState.getIn(['views','activeTapKeyUuid'])
    const sonUuid = getState().relativeConfState.getIn(['views','sonUuid'])
    const saveContent = () =>{
        if(insertOrModify === 'insert'){

            const fromPageType = {
                'editRunning': 'SAVE_JR-QUICK_MANAGER-SAVE_CONTACT',
                'relative': 'MANAGER-CONTACT_SETTING-CUD_CONTACT_CARD',
                'searchApproval': 'QUERY_PROCESS-QUICK_MANAGER-SAVE_CONTACT',
                'editApproval':'INITIATE_PROCESS-QUICK_MANAGER-SAVE_CONTACT'
            }

            fetchApi('saveIUManageCard', 'POST', JSON.stringify({
                psiData:psiData,
                insertFrom:activeTapKeyUuid,
                treeFrom:sonUuid,
                needAutoIncrementCode:flag === 'insert' ? false : true,
                action: fromPageType[fromPage]
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.SAVE_RELATIVE_TYPE_CARD,
                        list:json.data.resultList,
                        treeList:json.data.typeList,
                        flag:flag,
                        code:json.data.autoIncrementCode
                    })
                    // const fromPage = getState().relativeConfState.getIn(['views', 'fromPage'])
                    if (fromPage !== 'relative' && fromPage !== 'editApproval') {
                        // 刷新录入页面
                        dispatch(editRunningConfigActions.getRelativeCardListForchangeConfig())
                    }
                    if (fromPage === 'editApproval') {
                        const callback = getState().editApprovalState.getIn(['modelInfo','callback'])
                        callback(psiData)
                    //     const modelCode = getState().editApprovalState.getIn(['modelInfo','modelCode'])
                    //     dispatch(editApprovalActions.updateInstanceModel(modelCode,'contactCard',{
                    //         code:psiData.code,
                    //         name:psiData.name,
                    //         property:psiData.property,
                    //         },closeModal))
                    //         return
                    }
                    if (flag === 'insert'){
                        thirdParty.toast.info('保存成功', 2, closeModal())
                    }else{
                        thirdParty.toast.info('保存成功')
                    }
                }
            })
        }
        else{
            fetchApi('editIUManageCard', 'POST', JSON.stringify({
                psiData:psiData,
                modifyFrom:activeTapKeyUuid,
                treeFrom:sonUuid
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.SAVE_RELATIVE_TYPE_CARD,
                        list:json.data.resultList,
                        treeList:json.data.typeList,
                    })
                    thirdParty.toast.success('保存成功', 2, closeModal())
                }
            })
        }
    }

    fetchApi('adjustIUmanageCardTitleSame', 'POST', JSON.stringify({
        psiData:{name:psiData.name,uuid:psiData.uuid}
    }), json => {
        if (showMessage(json)) {
            if(json.data.repeat){
                thirdParty.Confirm({
                    message: `卡片名称与[编码：${json.data.card.code}]卡片重复，确定保存吗？`,
                    title: "名称重复",
                    buttonLabels: ['取消', '确定'],
                    onSuccess : (result) => {
                        if (result.buttonIndex === 1) {
                            saveContent()
                        }
                    },
                    onFail : (err) => {}
               })
            }else{
                saveContent()
            }
        }
        thirdParty.toast.hide()
    })
}

export const getOneCardEdit = (uuid,showModal) => (dispatch) =>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getIUManageOneCardInfo`, 'GET', `uuid=${uuid}`, cardInfo => {
        if (showMessage(cardInfo)) {
            dispatch({
                type:ActionTypes.BEFORE_ADD_MANAGE_TYPE_CARD,
                data:cardInfo.data,
                insertOrModify:'modify'
            })
            showModal()
        }

    })
    thirdParty.toast.hide()
}

export const clearCardSelectList = (clearType) => ({
    type:ActionTypes.CHANGE_RELATIVE_CONF_CARD_SELECT_LIST,
    clearType
})

export const checkRelativeListCardBox = (checked,uuid) => ({
    type : ActionTypes.CHECK_RELATIVE_LIST_CARD_BOX,
    checked:checked,
    uuid:uuid,
})

export const deleteRelativeListCard = (closeModal) =>(dispatch,getState) =>{
    const relativeCardSelectList = getState().relativeConfState.get('relativeCardSelectList').toJS()
    if(relativeCardSelectList.length === 0){
        thirdParty.toast.info('请选择需要删除的卡片')
        return ;
    }
    const activeTapKey = getState().relativeConfState.getIn(['views','activeTapKey'])
    const activeTapKeyUuid = getState().relativeConfState.getIn(['views','activeTapKeyUuid'])
    const treeFrom = getState().relativeConfState.getIn(['views','sonUuid'])

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('deleteIUManageListCard', 'POST', JSON.stringify({
        deleteList:relativeCardSelectList,
        deleteFrom:activeTapKeyUuid,
        treeFrom
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.DELETE_RELATIVE_LIST_CARD,
                data:json.data.resultList,
                treeList:json.data.typeList
            })
            if(json.data.error === ""){
                thirdParty.toast.info('删除成功',2,closeModal)
            }else{
                thirdParty.toast.info(json.data.error)
            }
        }
    })
}

export const getRelativeListBySontype = (uuid,sonUuid,sonName) => dispatch =>{
    fetchApi(`getIUmanageListBySontype`, 'GET', `ctgyUuid=${uuid}&&subordinateUuid=${sonUuid}`, list => {
        if (showMessage(list)) {
            dispatch({
                type:ActionTypes.GET_RELATIVE_LIST_BY_SON_TYPE,
                data:list.data.resultList,
                sonUuid:sonUuid,
                sonName:sonName,
            })
        }
    })
}

export const beforeAddNewManageType = () => ({
    type: ActionTypes.BEFORE_ADD_NEW_MANAGE_TYPE,
})

export const changeRelativeHighTypeContent = (name,value) => ({
	type: ActionTypes.CHANGE_RELATIVE_CONTENT,
	name,
    value
})

export const saveRelativeHighTypeContent = () => (dispatch,getState) =>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const psiData = getState().relativeConfState.get('relativeHighTypeTemp').toJS()
    fetchApi('saveIUManageHighType', 'POST', JSON.stringify({
        psiData:psiData
    }), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if(json.code === 0){
                dispatch(getRelativeListTitle())
                thirdParty.toast.info('保存成功',2)
            }
		}
	})
}

export const getRelativeHighType = (relativeHighTypeTemp, showModal) => dispatch =>{
    dispatch(changeRelativeData('relativeHighTypeTemp', relativeHighTypeTemp.set('treeList', fromJS([])), true))
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${relativeHighTypeTemp.get('uuid')}`, cardInfo => {
        thirdParty.toast.hide()
        if (showMessage(cardInfo)) {
            dispatch(changeRelativeData(['relativeHighTypeTemp', 'treeList'], fromJS(cardInfo.data.resultList)))
            if(showModal){
                showModal()
            }
        }
    })
}

export const changeHighTypeBoxStatus = (status,uuid) => ({
    type:ActionTypes.CHANGE_RELATIVE_CONF_HIGHT_TYPE_BOX_STATUS,
    status:status,
    uuid:uuid
})

export const deleteHighType = (closeModal) => (dispatch,getState) => {
    const state = getState().relativeConfState
    const cardHighTypeSelectList = state.get('cardHighTypeSelectList')
    const activeTabKeyUuid = state.getIn(['views','activeTapKeyUuid'])//选中的顶级类别uuid
    if(cardHighTypeSelectList.size === 0){
        thirdParty.toast.info('请选择需要删除的类别')
        return ;
    }
    fetchApi('deleteIUManageSettingHighTypeList', 'POST', JSON.stringify({
        deleteList:cardHighTypeSelectList
    }), json => {
		if (showMessage(json)) {
            if(json.code === 0){
                dispatch({
                    type:ActionTypes.DELETE_RELATIVE_CONF_HGIH_TYPE,
                    title:json.data.resultList,
                })
                thirdParty.toast.info('删除成功',2,closeModal)

                let uuidList = cardHighTypeSelectList.map(v => v.get('uuid'))
                if (uuidList.includes(activeTabKeyUuid)) {
                    dispatch(getRelativeListAndTree(fromJS({'uuid':'','name':'全部'})))
                }

            }
		}
	})
}

export const insertRelativeType = (uuid, name) => ({
    type:ActionTypes.INSERT_RELATIVE_TYPE,
    uuid,
    name
})

export const changeRelativeTypeContent = (name,value) => ({
	type: ActionTypes.CHANGE_RELATIVE_TYPE_CONTENT,
	name,
    value
})

export const changeRelativeTypeSelect = (parentUuid, parentName) => ({
    type: ActionTypes.CHANGE_RELATIVE_TYPE_SELECT,
    parentName,
    parentUuid
})

export const saveRelativeType = (toInventoryType) => (dispatch,getState) => {
    const state = getState().relativeConfState
    let psiData = state.get('relativeTypeTemp')
    const currentUnitCtgyUuid = state.getIn(['relativeHighTypeTemp','uuid'])
    psiData = psiData.set('currentUnitCtgyUuid',currentUnitCtgyUuid)

    const saveType = () => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('saveIUManageType', 'POST', JSON.stringify({
            psiData:psiData
        }), json => {
            if (showMessage(json)) {
                fetchApi('getIUmanageListAll', 'GET', `listFrom=${currentUnitCtgyUuid}`, list => {
                    thirdParty.toast.hide()
                    if (showMessage(list)) {
                        dispatch(changeRelativeData(['relativeHighTypeTemp', 'treeList'], fromJS(json.data.resultList)))
                        thirdParty.toast.info('保存成功',2,toInventoryType)
                    }
                })
            }
        })
    }

    fetchApi('adjustIUmanageTypeTitleSame', 'POST', JSON.stringify({
        psiData:{
            parentUuid:psiData.get('parentUuid'),
            name:psiData.get('name'),
            uuid:psiData.get('uuid')
        }
    }), json => {
            if (showMessage(json)) {
                if(json.data.repeat){
                    thirdParty.Confirm({
                        message: '名称重复',
                        title: "卡片类别名称与已有卡片类别名称重复，确定保存吗？",
                        buttonLabels: ['取消', '确定'],
                        onSuccess : (result) => {
                            saveType()
                        },
                        onFail : (err) => {}
                   })
                }else{
                    saveType()
                }
        }
    })
}

export const getRelativeTypeInfo = (uuid) => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getIUManagetTreeSingleType`, 'GET', `uuid=${uuid}`, typeInfo => {
        thirdParty.toast.hide()
        if (showMessage(typeInfo)) {
            dispatch({
                type:ActionTypes.GET_RELATIVE_TYPE_CONTENT,
                uuid:uuid,
                data:typeInfo.data,
            })
        }
    })
}

export const changeTypeSelectList = (uuid,value) => ({
    type:ActionTypes.CHANGE_RELATIVE_TYPE_BOX_CHECKED,
    uuid:uuid,
    value:value
})

export const confirmDeleteRelativeType = (treeList, closeModal) => (dispatch,getState) =>{
    const state = getState().relativeConfState
    const currentUnitCtgyUuid = state.getIn(['relativeHighTypeTemp', 'uuid'])
    let iuTreeSelectList = []
    const loop = (data) => data.map((item) => {
            if (item.get('checked')) {
                iuTreeSelectList.push(item.get('uuid'))
            }
            if (item.get('childList').size > 0) {
                loop(item.get('childList'))
            }
        })

    loop(treeList)
    if(iuTreeSelectList.size === 0){
        thirdParty.toast.info('请选择要删除的类别')
        return ;
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('deleteIUManageTreeList', 'POST', JSON.stringify({
        currentUnitCtgyUuid: currentUnitCtgyUuid,
        deleteList:iuTreeSelectList
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch(changeRelativeData(['relativeHighTypeTemp', 'treeList'], fromJS(json.data.resultList)))
            thirdParty.toast.info('删除成功',2,closeModal)
        }
    })
}

export const typeSwapPosition = (uuid,swapUuid) => (dispatch,getState) =>{
    const state = getState().relativeConfState
    const categoryUuid = state.getIn(['relativeHighTypeTemp','uuid'])

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('swapIUmanageTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid:uuid,
            swappedSubordinateUuid:swapUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch(changeRelativeData(['relativeHighTypeTemp', 'treeList'], fromJS(json.data.resultList)))
        }
    })
}

export const switchCardStatus = (uuid,value) => ({
    type:ActionTypes.SWITCH_CARD_STATUS,
    uuid:uuid,
    used:value,
})

export const changeRelativeData = (dataType, value, short) => ({
    type:ActionTypes.CHANGE_RELATIVE_DATA,
    dataType,
    value,
    short
})
