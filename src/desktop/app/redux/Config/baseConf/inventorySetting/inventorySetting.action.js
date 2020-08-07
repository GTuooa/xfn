import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import {fromJS,toJS} from 'immutable'
import {message,Modal} from 'antd'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action'

const confirm = Modal.confirm;

const getCardListAndTree = (dispatch,getState,v) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const anotherTabName = getState().inventorySettingState.get('anotherTabName')
    if(v.get('name') === anotherTabName){
        fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=`, cardList => {
            if (showMessage(cardList)) {
                dispatch({
                    type:ActionTypes.CHANGE_ACTIVE_INVENTORY_SETTING_HIGH_TYPE,
                    name:v.get('name'),
                    uuid:v.get('uuid'),
                    cardList:cardList.data.resultList,
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }else{
        fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=${v.get('uuid')}`, cardList => {
            if (showMessage(cardList)) {
                fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${v.get('uuid')}`, tree => {
                    if (showMessage(tree)) {
                        dispatch({
                            type:ActionTypes.CHANGE_ACTIVE_INVENTORY_SETTING_HIGH_TYPE,
                            treelist:tree.data.resultList,
                            name:v.get('name'),
                            uuid:v.get('uuid'),
                            cardList:cardList.data.resultList,
                        })
                    }
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

export const inventorySettingInit = () => dispatch =>{
    fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=`, cardList => {
        if (showMessage(cardList)) {
            fetchApi(`getInventoryHighTypeList`, 'GET', '', titleList => {
                if (showMessage(titleList)) {
                    dispatch({
                        type:ActionTypes.INVENTORY_SETTING_INIT,
                        title:titleList.data,
                        cardList:cardList.data.resultList,
                    })
                }
            })
        }
    })
}

export const getInventoryHighTypeList = () => dispatch =>{
    fetchApi(`getInventoryHighTypeList`, 'GET', '', titleList => {
        if (showMessage(titleList)) {
            dispatch({
                type:ActionTypes.GET_INVENTORY_SETTING_HIGH_TYPE_LIST,
                title:titleList.data,
            })
        }
    })
}

export const changeHighTypeContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_INVENTORY_SETTING_HIGH_TYPE_CONTENT,
		name,
        value
	})
}

export const saveInventorySettingContent = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().inventorySettingState.get('inventoryHighType').toJS()
    fetchApi('insertInventoryHighType', 'POST', JSON.stringify({
        psiData:psiData
    }), json => {
		if (showMessage(json)) {
            if(json.code === 0){
                dispatch({
                    type:ActionTypes.GET_INVENTORY_SETTING_HIGH_TYPE_LIST,
                    title:json.data,
                })
                message.info('保存成功')
            }
		}
	})
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
}

export const editHighType = (showModal) => (dispatch,getState) =>{
    const activeTapKey = getState().inventorySettingState.get('activeTapKey')
    const activeTapKeyUuid = getState().inventorySettingState.get('activeTapKeyUuid')
    const tags = getState().inventorySettingState.get('tags')
    let uuid = "";
    if(tags.size != 1){
        uuid = activeTapKeyUuid === '' ? tags.getIn([1,'uuid']) : activeTapKeyUuid
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getOneInventorySettingHighType`, 'GET', `uuid=${uuid}`, oneHighType => {
        if (showMessage(oneHighType)) {
            dispatch({
                type:ActionTypes.EDIT_INVENETORY_HIGH_TYPE,
                info:oneHighType.data,
            })
            showModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeActiveHighType = (v) => (dispatch,getState) =>{
    getCardListAndTree(dispatch,getState,v)
}

export const refreshInventoryList = (v) => (dispatch,getState) =>{
    getCardListAndTree(dispatch,getState,v)
}

export const changeModalActiveHighType = (v) => dispatch =>{
    fetchApi(`getOneInventorySettingHighType`, 'GET', `uuid=${v.get('uuid')}`, oneHighType => {
        if (showMessage(oneHighType)) {
            dispatch({
                type:ActionTypes.CHANGE_MODAL_ACTIVE_HIGH_TYPE,
                info:oneHighType.data,
                name:v.get('name'),
                uuid:v.get('uuid'),
            })
        }
    })
}

export const beforeAddModalHighType = () => dispatch =>{
    dispatch({
        type:ActionTypes.INSERT_INVENTORY_SETTING_HGIH_TYPE,
    })
}

export const deleteHighType = (deleteModal) => (dispatch,getState) => {
    const uuid = getState().inventorySettingState.get('activeInventoryTypeUuid')
    fetchApi('deleteInventorySettingHighType', 'POST', JSON.stringify({
        ctgyUuid:uuid
    }), json => {
		if (showMessage(json)) {
            if(json.code === 0){
                dispatch({
                    type:ActionTypes.DELETE_INVENTORY_SETTING_HGIH_TYPE,
                    title:json.data.resultList,
                })
                message.info('删除成功')
                deleteModal()
            }
		}
	})
}

export const adjustCardTyepList = (name,uuid,adjustModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    let cardList = getState().inventorySettingState.get('cardSelectList').toJS()
    cardList.map((item,index) =>{
        item.subordinateName = name
    })
    const subordinateUuid = uuid
    const adjustFrom = getState().inventorySettingState.get('activeTapKeyUuid')
    const treeFrom = getState().inventorySettingState.get('activeTreeKeyUuid')

    fetchApi('adjustInventorySettingCardTypeList', 'POST', JSON.stringify({
        cardList,
        subordinateUuid,
        adjustFrom,
        treeFrom
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.ADJUST_INVENTORY_SETTING_CARD_TYPE_LIST,
                list:json.data.resultList
            })
            adjustModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeCardTypeContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_INVENTORY_SETTING_CARD_TYPE_CONTENT,
		name,
        value
	})
}

export const changeCardTypeSelect = (value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
    const parentName = valueList[1]
    const parentUuid = valueList[0]

	dispatch({
		type: ActionTypes.SELECT_INVENTORY_SETTING_CARD_TYPE,
		parentName,
        parentUuid
	})
}

export const saveInventoryCardType = (btnFlag,showConfirmModal,closeConfirmModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().inventorySettingState.get('inventoryCardType').toJS()
    psiData.ctgyUuid = getState().inventorySettingState.get('activeTapKeyUuid')


    const save = () =>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('addInventorySettingCardType', 'POST', JSON.stringify({
            psiData:psiData
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type:ActionTypes.SAVE_INVENTORY_SETTING_CARD_TYPE,
                    typeTree:json.data.resultList,
                    uuid:psiData.uuid,
                    btnFlag,
                    typeInfo:json.data.info
                })
                message.info('保存成功')
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }

    fetchApi('adjustInventorySettingTypeTitleSame', 'POST', JSON.stringify({
        psiData:{
            parentUuid:psiData.parentUuid,
            name:psiData.name,
            uuid:psiData.uuid
        }
    }), json => {
            if (showMessage(json)) {
                if(json.data.repeat){
                    showConfirmModal()
                    confirm({
                       title: '名称重复',
                       content: `卡片名称与【编码：${json.data.card.code}】卡片重复，确定保存吗？`,
                       onOk() {
                         save()
                         closeConfirmModal()
                       },
                       onCancel() {
                           closeConfirmModal()
                       }
                    });
                }else{
                    save()
                }
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const deleteInventoryType = () => (dispatch,getState) =>{
    dispatch({
        type:ActionTypes.INVENTORY_SETTING_TYPE_DELETE_BTN_SHOW,
    })
}

export const insertAddInventoryCardType = () => dispatch =>{
    dispatch({
        type:ActionTypes.INSERT_INVENTORY_SETTING_CARD_TYPE,
    })
}

export const beforeAddInventoryCardType = (showModal) => dispatch =>{
    dispatch({
        type:ActionTypes.BEFORE_ADD_INVENTORY_SETTING_CARD_TYPE,
    })
    showModal()
}

export const changeCardTypeBoxChecked = (list) => dispatch =>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_SETTING_CARD_TYPE_BOX_STATUS,
        list
    })
}

export const cancelIUManageType = () => (dispatch,getState) =>{
    const isAdd = getState().inventorySettingState.getIn(['inventorySettingBtnStatus','isAdd'])
    if(isAdd){
        const treeUuid = getState().inventorySettingState.getIn(['inventorySettingBtnStatus','treeUuid'])
        const allUuid = getState().inventorySettingState.getIn(['typeTree',0,'uuid'])
        if(treeUuid === allUuid){
            dispatch({
                type:ActionTypes.CANCLE_INVENTORY_SETTING_TYPE_BTN,
                data:{}
            })
        }else{
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi(`getInventorySettingOneCardType`, 'GET', `uuid=${treeUuid}`, typeInfo => {
                if (showMessage(typeInfo)) {
                    dispatch({
                        type:ActionTypes.CANCLE_INVENTORY_SETTING_TYPE_BTN,
                        data:typeInfo.data
                    })
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }
    }else{
        dispatch({
            type:ActionTypes.CANCLE_INVENTORY_SETTING_TYPE_BTN,
            data:{}
        })
    }
}

export const upType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const selectedSubordinateUuid = getState().inventorySettingState.getIn(['inventorySettingBtnStatus','treeUuid'])
    const swappedSubordinateUuid = getState().inventorySettingState.getIn(['inventorySettingBtnStatus','upUuid'])
    const categoryUuid = getState().inventorySettingState.get('activeTapKeyUuid')

    fetchApi('swapInventorySettingTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_INVENTORY_SETTING_TYPE_POSITION,
                list:json.data.resultList
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const downType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const selectedSubordinateUuid = getState().inventorySettingState.getIn(['inventorySettingBtnStatus','treeUuid'])
    const swappedSubordinateUuid = getState().inventorySettingState.getIn(['inventorySettingBtnStatus','downUuid'])
    const categoryUuid = getState().inventorySettingState.get('activeTapKeyUuid')

    fetchApi('swapInventorySettingTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_INVENTORY_SETTING_TYPE_POSITION,
                list:json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const confirmDeleteType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const typeTreeSelectList = getState().inventorySettingState.get('typeTreeSelectList')
    if(typeTreeSelectList.size === 0){
        message.info('请选择要删除的类别')
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        return ;
    }
    const activeTapKeyUuid = getState().inventorySettingState.get('activeTapKeyUuid')
    fetchApi('deleteInventorySettingOneCardType', 'POST', JSON.stringify({
        ctgyUuid:activeTapKeyUuid,
        deleteList:typeTreeSelectList
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CONFIRM_DELETE_INVENTORY_SETTING_TYPE,
                data:json.data.resultList,
            })
            message.info('删除成功')
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const getIUManageTypeInfo = (uuid) => (dispatch,getState) =>{

    const allUuid = getState().inventorySettingState.getIn(['typeTree','0','uuid'])
    const isAll = allUuid === uuid ? true : false
    if(isAll){
        dispatch({
            type:ActionTypes.GET_INVENTORY_SETTING_TYPE_CONTENT,
            uuid:uuid,
            data:{},
            isAll:isAll
        })
    }else{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi(`getInventorySettingOneCardType`, 'GET', `uuid=${uuid}`, typeInfo => {
            if (showMessage(typeInfo)) {
                dispatch({
                    type:ActionTypes.GET_INVENTORY_SETTING_TYPE_CONTENT,
                    uuid:uuid,
                    data:typeInfo.data,
                    isAll:isAll
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

export const beforeAddCard = (showCardModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', typeInfo => {
        if (showMessage(typeInfo)) {
            dispatch({
        		type: ActionTypes.BEFORE_ADD_INVENTORY_SETTING_CARD,
                data:typeInfo.data
        	})
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
    showCardModal()
}

export const saveUndefineCard = (closeModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().inventorySettingState.get('undefineCard').toJS()
    fetchApi('editInventorySettingUndefienCard', 'POST', JSON.stringify({
        psiData:psiData,
    }), json => {
        if (showMessage(json)) {
            message.info('保存成功')
            closeModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeCardContent = (name,value) => dispatch =>{
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_SETTING_CARD_CONTENT,
		name,
        value
	})
}

export const changeCardAc = (value,acId,acName) => dispatch =>{
    const valueList = value.split(' ');
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_SETTING_CARD_AC,
        uuid:valueList[0],
        name:valueList[1],
        acId,
        acName,
	})
}

export const changeCardCategoryStatus = (item,value) => dispatch =>{
    fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${item.get('uuid')}`, tree => {
        if (showMessage(tree)) {
            dispatch({
                type:ActionTypes.CHANGE_INVENTORY_SETTING_CARD_CATEGORY_STATUS,
                list:tree.data.resultList,
                item:item,
                value:value,
            })
        }
    })
}

export const changeCardCategoryType = (item,value) => dispatch =>{
    const valueList = value.split(Limit.TREE_JOIN_STR)

    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_SETTING_CARD_CATEGORY_TYPE,
        item:item,
        uuid:valueList[0],
        name:valueList[1],
    })
}

export const changeCardNature = (name,value) => dispatch =>{
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_SETTING_CARD_NATURE,
		name,
        value
	})
}

export const saveCard = (flag,closeModal,showConfirmModal,closeConfirmModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().inventorySettingState.get('inventorySettingCard').toJS()
    const from = getState().inventorySettingState.get('activeTapKeyUuid')
    const insertOrModify = getState().inventorySettingState.get('insertOrModify')
    const treeFrom = getState().inventorySettingState.get('selectTypeId')
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
    const stockRange = cardTemp.getIn([categoryTypeObj,'stockRange'])
    const runningState = cardTemp.get('runningState')
    const save = () => {
        if(insertOrModify === 'insert'){
            fetchApi('addInventorySettingCard', 'POST', JSON.stringify({
                psiData:psiData,
                insertFrom:from,
                treeFrom,
                needAutoIncrementCode:flag === 'insert' ? false : true
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type:ActionTypes.SAVE_INVENTORY_SETTING_CARD,
                        list:json.data.resultList,
                        flag:flag,
                        autoIncrementCode:json.data.autoIncrementCode,
                    })
                    if(closeModal){
                        closeModal()
                    }
                    message.info('保存成功')
                    stockRange && stockRange.size && dispatch(lrAccountActions.getFirstStockCardList(stockRange,runningState))

                }
            })
        }else{
            fetchApi('editInventorySettingCard', 'POST', JSON.stringify({
                psiData:psiData,
                modifyFrom:from,
                treeFrom,
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type:ActionTypes.SAVE_INVENTORY_SETTING_CARD,
                        list:json.data.resultList,
                    })
                    message.info('修改成功')
                    closeModal()
                    stockRange && stockRange.size && dispatch(lrAccountActions.getFirstStockCardList(stockRange,runningState))

                }
            })
        }
    }

    fetchApi('adjustInventorySettingCardTitleSame', 'POST', JSON.stringify({
        psiData:{
            name:psiData.name,
            uuid:psiData.uuid
        }
    }), json => {
            if (showMessage(json)) {
                if(json.data.repeat){
                    showConfirmModal()
                    confirm({
                       title: '名称重复',
                       content: `卡片名称与【编码：${json.data.card.code}】卡片重复，确定保存吗？`,
                       onOk() {
                         save()
                         closeConfirmModal()
                       },
                       onCancel() {
                           closeConfirmModal()
                       }
                    })
                }else{
                    save()
                }
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })

}

export const changeUndefineCardAc = (value,acId,acName) => dispatch =>{
    const valueList = value.split(' ');
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_SETTING_UNDEFINE_CARD_AC,
        uuid:valueList[0],
        name:valueList[1],
        acId,
        acName,
	})
}

export const getUndefineCard = (showModal) => dispatch => {
    fetchApi(`getInventorySettingUndefienCard`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.GET_INVENTORY_SETTING_UNDEFINE_CARD,
                data:json.data
            })
        }
    })
    showModal()
}

export const beforeEditCard = (item,showModal) => dispatch =>{
    fetchApi(`getInventorySettingOneCard`, 'GET', `uuid=${item.get('uuid')}`, card => {
        if (showMessage(card)) {
            dispatch({
                type:ActionTypes.BEFORE_EDIT_INVENTORY_SETTING_CARD,
                data:card.data,
            })
            showModal()
        }
    })
}

export const changeCardBoxStatus = (status,uuid) => dispatch =>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_SETTING_CARD_BOX_STATUS,
        status:status,
        uuid:uuid
    })
}

export const deleteCardList = () => (dispatch,getState) =>{
    const from = getState().inventorySettingState.get('activeTapKeyUuid')
    const treeFrom = getState().inventorySettingState.get('activeTreeKeyUuid')
    const deleteList = getState().inventorySettingState.get('cardSelectList').toJS()

    fetchApi('deleteInventorySettingCardList', 'POST', JSON.stringify({
        deleteList:deleteList,
        deleteFrom:from,
        treeFrom,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.DELETE_INVENTORY_SETTING_CARD_LIST,
                list:json.data.resultList,
                treeList:json.data.typeList
            })
            if(json.data.error === ""){
                message.info('删除成功')
            }else{
                message.info(json.data.error)
            }
        }
    })
}

export const modifyCardUsedStatus = (uuid,value) => dispatch =>{
    fetchApi('modifyInventorySettingCardUsedStatus', 'POST', JSON.stringify({
        psiData:{
            "uuid":uuid,
            "used":value
        },
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_INVENTORY_SETTING_CARD_USED_STATUS,
                list:json.data.resultList,
                uuid:uuid,
                used:value,
            })
            message.info('修改成功')
        }
    })
}

export const getCardListByType = (parentUuid,uuid,name) => dispatch =>{
    fetchApi(`getInventorySettingCardListByType`, 'GET', `ctgyUuid=${parentUuid}&&subordinateUuid=${uuid}`, json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.SELECT_INVENTORY_SETTING_CARD_BY_TYPE,
                list:json.data.resultList,
                uuid:uuid,
                name:name,
            })
        }
    })
}

export const selectCardAll = (value) => dispatch =>{
    dispatch({
        type:ActionTypes.SELECT_INVENTORY_SETTING_CARD_ALL,
        value:value,
    })
}

// 导入
export const beforeCHImport = () => ({
	type: ActionTypes.BEFORE_CH_IMPORT
})
export const closeVcImportContent = () => ({
	type: ActionTypes.CLOSE_CH_IMPORT_CONTENT
})
export const getFileUploadFetch = (form) => dispatch => {
	fetchApi('chUpload', 'UPLOAD', form, json => {
		// dispatch(afterWlImport(json))
        if (showMessage(json)) {
            if(json.data){
                dispatch({
                    type: ActionTypes.CHANGE_CH_IMPORT_NUM,
                    name: 'totalNumber',
                    value: json.data.pages
                })
                dispatch({
                    type: ActionTypes.CHANGE_CH_IMPORT_NUM,
                    name: 'importKey',
                    value: json.data.importKey
                })
                dispatch({
                    type: ActionTypes.CHANGE_CH_IMPORT_STATUS,
                    value: true
                })
                const loop = (data) => {
                    if(data <= json.data.pages){
                        setTimeout(() => {
                            fetchApi(`chImport`, 'POST', JSON.stringify({
                                importKey: json.data.importKey,
                                current: data
                            }), importJson => {
                                if (showMessage(importJson)) {
                                    if(data < json.data.pages){
                                        loop(data+1)
                                    }else{
                                        dispatch({
                                            type: ActionTypes.CHANGE_CH_IMPORT_STATUS,
                                            value: false
                                        })
                                        fetchApi(`chImportError`, 'GET', 'importKey='+json.data.importKey+'&needDownload=false', errorJson => {
                                            dispatch(afterChImport(errorJson))
                                        })

                                    }
                                }else{
                                    Modal.error({
                                        title: '异常提示',
                                        content: '请求异常，请稍后重试',
                                      });
                                    dispatch(closeVcImportContent())
                                }
                            })
                            dispatch({
                                type: ActionTypes.CHANGE_CH_IMPORT_NUM,
                                name: 'curNumber',
                                value: data
                            })
                        },500)
                    }
                }
                loop(1)
            }
        }else{
            dispatch(closeVcImportContent())
        }
	})
}
export const afterChImport = (receivedData) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_CH_IMPORT,
		receivedData
	})


}
export const exportToNotification = () => (dispatch) => {

    fetchApi('chExport', 'GET', '', json => {
        showMessage(json, 'show')
    })
}

// 导入结束
