import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import {fromJS,toJS} from 'immutable'
import {message,Modal} from 'antd'

const confirm = Modal.confirm;


export const getHighType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi(`getProjectConfigHighType`, 'GET', '', list => {
        if (showMessage(list)) {
            dispatch({
                type:ActionTypes.GET_HTIGH_TYPE,
                list:list.data,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const getHighTypeOne = (value,showModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = value.get('uuid')
    const name = value.get('name')
    fetchApi(`getProjectConfigHighTypeOne`, 'GET', `uuid=${uuid}`, list => {
        if (showMessage(list)) {
            dispatch({
                type:ActionTypes.GET_HTIGH_TYPE_ONE,
                data:list.data,
                name:name,
                uuid:uuid,
            })
            showModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeContent = (parentName,name,value) => (dispatch,getState) =>{
    dispatch({
        type:ActionTypes.CHANGE_CONTENT,
        parentName,
        name,
        value
    })
}

export const saveHighType = (closeModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const highTypeInfo = getState().projectConfigState.get('highTypeInfo').toJS()
    fetchApi('modifyProjectConfigHighType', 'POST', JSON.stringify({
        psiData:highTypeInfo
    }), json => {
        if (showMessage(json)) {
            closeModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const beforeAddCard = (showModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const tabTags = getState().projectConfigState.get('tabTags').toJS()
    fetchApi(`getProjectTree`, 'GET', `uuid=${tabTags[1].uuid}`, list => {
        if (showMessage(list)) {
            dispatch({
                type:ActionTypes.BEFORE_ADD_PROJECT_CARD,
                data:list.data.resultList,
            })
            showModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeCardCategoryType = (value) => dispatch =>{
    const valueList = value.split(Limit.TREE_JOIN_STR)
    dispatch({
        type:ActionTypes.CHANGE_PROJECT_CARD_CATEGORY,
        uuid:valueList[0],
        name:valueList[1],
    })
}

export const saveCard = (closeModal,flag,showConfirmModal,closeConfirmModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().projectConfigState.get('cardInfo').toJS()
    const insertOrModify = getState().projectConfigState.get('insertOrModify')
    const activeTapKeyUuid = getState().projectConfigState.get('activeTapKeyUuid')
    const treeSelectUuid = getState().projectConfigState.get('treeSelectUuid')
    const tabTags = getState().projectConfigState.get('tabTags')
    const cardTemp = getState().lrAccountState.get('cardTemp')
    const beProject = cardTemp.get('beProject')
    const projectRange = cardTemp.get('projectRange')
    const projectRelation = [{'ctgyUuid':tabTags.getIn([1,'uuid']),'subordinateUuid':psiData.selectUuid}]
    psiData.projectRelation = projectRelation

    const saveContent = () =>{
        if(insertOrModify === 'insert'){
            fetchApi('insertProjectCard', 'POST', JSON.stringify({
                psiData:psiData,
                insertFrom:activeTapKeyUuid,
                treeFrom:treeSelectUuid,
                needAutoIncrementCode:flag === 'insert' ? false : true
            }), json => {
                if (showMessage(json)) {
                    if(flag === 'insert'){
                        dispatch({
                            type: ActionTypes.SAVE_PROJECT_CARD,
                            cardlist:json.data.resultList,
                            treeList:json.data.typeList,
                            flag:flag,
                            code:json.data.autoIncrementCode
                        })
                        closeModal()
                    }else{
                        const tabTags = getState().projectConfigState.get('tabTags').toJS()
                        fetchApi(`getProjectTree`, 'GET', `uuid=${tabTags[1].uuid}`, list => {
                            if (showMessage(list)) {
                                dispatch({
                                    type: ActionTypes.SAVE_PROJECT_CARD,
                                    cardlist:json.data.resultList,
                                    treeList:list.data.resultList,
                                    flag:flag,
                                    code:json.data.autoIncrementCode
                                })
                            }
                        })
                        message.info('保存成功')
                    }
                    if (beProject) {
                        dispatch(lrAccountActions.getProjectCardList(projectRange))
                    }
                }
            })
        }
        else{
            fetchApi('editProjectCard', 'POST', JSON.stringify({
                psiData:psiData,
                modifyFrom:activeTapKeyUuid,
                treeFrom:treeSelectUuid
            }), json => {
                if (showMessage(json)) {

                    const tabTags = getState().projectConfigState.get('tabTags').toJS()
                    fetchApi(`getProjectTree`, 'GET', `uuid=${tabTags[1].uuid}`, list => {
                        if (showMessage(list)) {
                            dispatch({
                                type: ActionTypes.SAVE_PROJECT_CARD,
                                cardlist:json.data.resultList,
                                treeList:list.data.resultList,
                            })
                        }
                    })
                    closeModal()
                    if (beProject) {
                        dispatch(lrAccountActions.getProjectCardList(projectRange))
                    }
                }
            })
        }
    }

    fetchApi('adjustProjectCardNameSame', 'POST', JSON.stringify({
        psiData:{name:psiData.name,uuid:psiData.uuid}
    }), json => {
        if (showMessage(json)) {
            if(json.data.repeat){
                showConfirmModal()
                confirm({
                   title: '名称重复',
                   content:`卡片名称与【编码：${json.data.card.code}】卡片重复，确定保存吗？`,
                   onOk() {
                     saveContent()
                     closeConfirmModal()
                   },
                   onCancel() {
                       closeConfirmModal()
                   }
                });
            }else{
                saveContent()
            }
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const getListAndTree = () => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const listFrom = getState().projectConfigState.get('activeTapKeyUuid')
    const treeFrom = getState().projectConfigState.get('treeSelectUuid')

    fetchApi(`getProjectListAndTree`, 'GET', `listFrom=${listFrom}&treeFrom=${treeFrom}`, list => {
        if (showMessage(list)) {
            dispatch({
                type:ActionTypes.GET_PROJECT_LIST_AND_TREE,
                cardlist:list.data.resultList,
                treelist:list.data.typeList
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const switchHighType = (value) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const name = value.get('name')
    const uuid = value.get('uuid')

    fetchApi(`getProjectListAndTree`, 'GET', `listFrom=${uuid}&treeFrom=`, list => {
        if (showMessage(list)) {
            dispatch({
                type:ActionTypes.SWITCH_HIGH_TYPE,
                cardlist:list.data.resultList,
                treelist:list.data.typeList,
                name,
                uuid,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const getOneCardEdit = (uuid,showModal) => (dispatch) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getProjectCardOne`, 'GET', `uuid=${uuid}`, cardInfo => {
        if (showMessage(cardInfo)) {
            dispatch({
                type:ActionTypes.BEFORE_PROJECT_CARD_EDIT,
                data:cardInfo.data,
            })
            showModal()
        }

    })
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
}

export const changeCardBoxStatus = (status,uuid) => dispatch =>{
    dispatch({
        type:ActionTypes.PROJECT_CARD_CHECKBOX_STATUS,
        status:status,
        uuid:uuid
    })
}

export const selectCardAll = (value) => dispatch =>{
    dispatch({
        type:ActionTypes.SELECT_PROJECT_CARD_ALL,
        value:value,
    })
}

export const beforeAddCardType = (showModal) => dispatch =>{
    dispatch({
        type:ActionTypes.BEFORE_ADD_PROJECT_CARD_TYPE,
    })
    showModal()
}

export const changeCardUsed =(value,item) => dispatch =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('changeProjectCardUsedStatus', 'POST', JSON.stringify({
        psiData:{
            'uuid':item.get('uuid'),
            'used':value
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_PROJECT_CARD_USED,
                uuid:item.get('uuid'),
                used:value
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const insertNewTypeBtn = () => dispatch =>{
    dispatch({
        type:ActionTypes.INSERT_PROJECT_CARD_TYPE_BTN,
    })
}

export const changeCardTypeCategoryType = (value) => dispatch =>{
    const valueList = value.split(Limit.TREE_JOIN_STR)
    dispatch({
        type:ActionTypes.CHANGE_PROJECT_CARD_TYPE_CATEGORY,
        uuid:valueList[0],
        name:valueList[1],
    })
}

export const cancelProjectTypeBtn = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const treeUuid = getState().projectConfigState.getIn(['ProjectTypeBtnStatus','treeUuid'])
    const allUuid = getState().projectConfigState.getIn(['tree',0,'uuid'])
    if(treeUuid === allUuid){
        dispatch({
            type:ActionTypes.CANCLE_PROJECT_TYPE_BTN,
            data:{}
        })
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    }else{
        fetchApi(`getProjectTreeOne`, 'GET', `uuid=${treeUuid}`, typeInfo => {
            if (showMessage(typeInfo)) {
                dispatch({
                    type:ActionTypes.CANCLE_PROJECT_TYPE_BTN,
                    data:typeInfo.data
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

export const saveProjectType = (btnFlag,showConfirmModal,closeConfirmModal) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    let psiData = getState().projectConfigState.get('projectType')
    const activeTapKeyUuid = getState().projectConfigState.get('activeTapKeyUuid')
    const name = getState().projectConfigState.get('activeTapKey')
    psiData = psiData.set('ctgyUuid',activeTapKeyUuid)
    const saveType = () => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('insertProjectTreeOne', 'POST', JSON.stringify({
            psiData:psiData
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type:ActionTypes.SAVE_PROJECT_TREE_ONE,
                    cardlist:json.data.cardList,
                    name:name,
                    treelist:json.data.resultList,
                    activeTapKeyUuid:activeTapKeyUuid,
                    btnFlag:btnFlag,
                    uuid:psiData.get('uuid'),
                    typeInfo:json.data.info
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }

    fetchApi('adjustProjectTypeNameSame', 'POST', JSON.stringify({
        psiData:{
            parentUuid:psiData.get('parentUuid'),
            name:psiData.get('name'),
            uuid:psiData.get('uuid')
        }
    }), json => {
            if (showMessage(json)) {
                if(json.data.repeat){
                    showConfirmModal()
                    confirm({
                       title: '名称重复',
                       content: `卡片名称与【编码：${json.data.card.code}】卡片重复，确定保存吗？`,
                       onOk() {
                         saveType()
                         closeConfirmModal()
                       },
                       onCancel() {
                           closeConfirmModal()
                       }
                    });
                }else{
                    saveType()
                }
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const upProjectType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const selectedSubordinateUuid = getState().projectConfigState.getIn(['ProjectTypeBtnStatus','treeUuid'])
    const swappedSubordinateUuid = getState().projectConfigState.getIn(['ProjectTypeBtnStatus','upUuid'])
    const categoryUuid = getState().projectConfigState.get('activeTapKeyUuid')

    fetchApi('swapProjectTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_PROJECT_TYPE_POSITION,
                list:json.data.resultList
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const downProjectType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const selectedSubordinateUuid = getState().projectConfigState.getIn(['ProjectTypeBtnStatus','treeUuid'])
    const swappedSubordinateUuid = getState().projectConfigState.getIn(['ProjectTypeBtnStatus','downUuid'])
    const categoryUuid = getState().projectConfigState.get('activeTapKeyUuid')

    fetchApi('swapProjectTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_PROJECT_TYPE_POSITION,
                list:json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const switchProjectType = (uuid) => (dispatch,getState) =>{
    const allUuid = getState().projectConfigState.getIn(['tree','0','uuid'])
    const isAll = allUuid === uuid ? true : false

    if(isAll){
        dispatch({
            type:ActionTypes.SWITCH_PROJECT_TYPE,
            uuid:uuid,
            data:{},
            isAll:isAll
        })
    }else{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi(`getProjectTreeOne`, 'GET', `uuid=${uuid}`, typeInfo => {
            if (showMessage(typeInfo)) {
                dispatch({
                    type:ActionTypes.SWITCH_PROJECT_TYPE,
                    uuid:uuid,
                    data:typeInfo.data,
                    isAll:isAll
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

export const deleteCard = () =>(dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const cardSelectList = getState().projectConfigState.get('cardSelectList').toJS()
    if(cardSelectList.length === 0){
        message.info('请选择需要删除的卡片')
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        return ;
    }
    const activeTapKey = getState().projectConfigState.get('activeTapKey')
    const activeTapKeyUuid = getState().projectConfigState.get('activeTapKeyUuid')
    const treeFrom = getState().projectConfigState.get('treeSelectUuid')
    const anotherTabName = getState().projectConfigState.get('anotherTabName')

    fetchApi('deleteProjectCard', 'POST', JSON.stringify({
        deleteList:cardSelectList,
        deleteFrom:activeTapKeyUuid,
        treeFrom
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.DELETE_PROJECT_CARD,
                data:json.data.resultList,
                treeList:json.data.typeList
            })
            if(json.data.error === ""){
                message.info('删除成功')
            }else{
                message.info(json.data.error)
            }
        }
    })
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
}

export const deleteProjectTypeBtn = () => (dispatch,getState) =>{
    dispatch({
        type:ActionTypes.BEFORE_DELETE_PROJECT_TYPE,
    })
}
export const changeTypeBoxStatus = (list) => dispatch =>{
    dispatch({
        type:ActionTypes.PROJECT_TYPE_CHECKBOX_STATUS,
        list
    })
}

export const confirmDeleteProjectType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const projectTypeTreeSelectList = getState().projectConfigState.get('projectTypeTreeSelectList')
    const activeTapKeyUuid = getState().projectConfigState.get('activeTapKeyUuid')
    fetchApi('deleteProjectType', 'POST', JSON.stringify({
        ctgyUuid:activeTapKeyUuid,
        deleteList:projectTypeTreeSelectList
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.DELETE_PROJECT_TYPE,
                data:json.data.resultList,
            })
            message.info('删除成功')
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const getProjectCardByType = (uuid,sonUuid,sonName) => dispatch =>{
    fetchApi(`getProjectCardByType`, 'GET', `ctgyUuid=${uuid}&subordinateUuid=${sonUuid}`, list => {
        if (showMessage(list)) {
            dispatch({
                type:ActionTypes.GET_PROJECT_CARD_BY_TYPE,
                data:list.data.resultList,
                sonUuid:sonUuid,
                sonName:sonName,
            })
        }

    })
}

export const adjustCardTyepList = (name,uuid,adjustModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    let cardList = getState().projectConfigState.get('cardSelectList').toJS()
    cardList.map((item,index) =>{
        item.subordinateName = name
    })

    const subordinateUuid = uuid
    const adjustFrom = getState().projectConfigState.get('activeTapKeyUuid')
    const treeFrom = getState().projectConfigState.get('treeSelectUuid')

    fetchApi('adjustProjectCardType', 'POST', JSON.stringify({
        cardList,
        subordinateUuid,
        adjustFrom,
        treeFrom
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.ADJUST_PROJECT_CARD_TYPE,
                list:json.data.resultList
            })
            adjustModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
