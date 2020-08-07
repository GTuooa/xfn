import { showMessage } from 'app/utils'
import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

const getCardListAndTree = (dispatch,getState,v) => {
    const anotherName = getState().inventoryConfState.getIn(['views','anotherName'])
    if(v.get('name') === anotherName){
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=`, cardList => {
            thirdParty.toast.hide()
            if (showMessage(cardList)) {
                dispatch({
                    type:ActionTypes.CHANGE_ACTIVE_INVENTORY_CONFIG_HIGH_TYPE,
                    name:v.get('name'),
                    uuid:v.get('uuid'),
                    cardList:cardList.data.resultList,
                })
            }
        })
    }else{
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=${v.get('uuid')}`, cardList => {
            thirdParty.toast.hide()
            if (showMessage(cardList)) {
                fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${v.get('uuid')}`, tree => {
                    if (showMessage(tree)) {
                        dispatch({
                            type:ActionTypes.CHANGE_ACTIVE_INVENTORY_CONFIG_HIGH_TYPE,
                            treelist:tree.data.resultList,
                            name:v.get('name'),
                            uuid:v.get('uuid'),
                            cardList:cardList.data.resultList,
                        })
                    }
                })
            }
        })
    }
}

export const inventorySettingInit = () => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=`, cardList => {
        if (showMessage(cardList)) {
            fetchApi(`getInventoryHighTypeList`, 'GET', '', titleList => {
                thirdParty.toast.hide()
                if (showMessage(titleList)) {
                    dispatch({
                        type:ActionTypes.INVENTORY_CONFIG_INIT,
                        title:titleList.data,
                        cardList:cardList.data.resultList,
                    })
                }
            })
        } else {
            thirdParty.toast.hide()
        }
    })
}
export const changeActiveHighType = (v) => (dispatch,getState) => {
    getCardListAndTree(dispatch,getState,v)
}

export const getHighTypeTree = (inventoryHighTypeTemp) => (dispatch) => {//获取主类别类别列表
    dispatch(changeData('inventoryHighTypeTemp', inventoryHighTypeTemp.set('treeList', fromJS([])), true))

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${inventoryHighTypeTemp.get('uuid')}`, tree => {
        thirdParty.toast.hide()
        if (showMessage(tree)) {
            dispatch(changeData(['inventoryHighTypeTemp', 'treeList'], fromJS(tree.data.resultList)))
        }
    })
}

export const getCardListByType = (parentUuid, uuid, name) => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getInventorySettingCardListByType`, 'GET', `ctgyUuid=${parentUuid}&&subordinateUuid=${uuid}`, json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.SELECT_INVENTORY_CONFIG_CARD_BY_TYPE,
                list:json.data.resultList,
                uuid,
                name,
            })
        }
    })
}

export const beforeAddCard = (showCardModal,fromPage) => (dispatch, getState) => {

    const getCode = () => {
        fetchApi(`getInitStockCard`, 'GET', '', json => {
            if (showMessage(json)) {
                dispatch(changeCardContent('code', json.data.code))
            }
        })
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', typeInfo => {
        thirdParty.toast.hide()
        if (showMessage(typeInfo)) {
            getCode()
            dispatch({
                type: ActionTypes.BEFORE_ADD_INVENTORY_CONFIG_CARD,
                data:typeInfo.data,
                fromPage
            })
        }
        showCardModal()
        const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')
        if (isOpenedWarehouse) {
            dispatch(getWarehouseTree())
        }
    })
}

export const changeCardContent = (name,value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_CONTENT,
		name,
        value
	})
}

export const changeCardNature = (name,value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_NATURE,
		name,
        value
	})
}
export const changeCardCategoryStatus = (item,value) => dispatch => {
    //thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    if (value) {
        fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${item.get('uuid')}`, tree => {
            //thirdParty.toast.hide()
            if (showMessage(tree)) {
                dispatch({
                    type:ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_CATEGORY_STATUS,
                    list:tree.data.resultList,
                    item:item,
                    value:value,
                })
            }
        })
    } else {
        dispatch({
            type:ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_CATEGORY_STATUS,
            list:[],
            item:item,
            value:value,
        })
    }

}

export const addCardShowType = (item) => ({
    type:ActionTypes.INVENTORY_CONFIG_ADD_CARD_SHOW_MODAL,
    item
})

export const changeCardCategoryType = (uuid, name) => dispatch => {
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_CATEGORY_TYPE,
        uuid,
        name,
    })
}

export const changeCardAc = (value,acId,acName) => dispatch => {
    const valueList = value.get('title').split('_');
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_AC,
        uuid:valueList[0],
        name:valueList[1],
        acId,
        acName,
	})
}

export const saveCard = (fromPage, flag,closeModal) => (dispatch,getState) => {
    const inventoryConfState = getState().inventoryConfState
    const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理
    let psiData = inventoryConfState.get('inventoryCardTemp').toJS()
    const from = inventoryConfState.getIn(['views','activeTabKeyUuid'])
    const insertOrModify = inventoryConfState.getIn(['views','insertOrModify'])
    const treeFrom = inventoryConfState.getIn(['views','selectTypeId'])

    if (psiData['isOpenedQuantity']==false) {
        psiData['unit'] = {}
        psiData['openedQuantity'] = ''
    }

    if (isOpenedWarehouse) {//开启仓库时期初特殊处理
        const openTree = psiData['openList']
        let openList = []
        const loop = (data) => {
            data.map(v => {
                if (v['childList'].length) {
                    loop(v['childList'])
                } else {
                    openList.push(v)
                }
            })
        }

        loop(openTree)
        psiData['openList'] = openList
    }

    let unitPriceList = [], errorList = []
    if (psiData['isOpenedQuantity'] && psiData['unit']['name']=='') {
        errorList.push(`请选择计量单位`)
    }

    //保存时单位列表做特殊处理
    if (psiData['isOpenedQuantity']) {
        const purchasePriceList = inventoryConfState.get('purchasePriceList').toJS()
        const salePriceList = inventoryConfState.get('salePriceList').toJS()

        purchasePriceList.forEach((v, i) => {
            if (Math.abs(v['defaultPrice'])>0 && v['name']=='') {
                errorList.push(`默认采购价${i+1}请选择计量单位`)
            }
            unitPriceList.push(v)
        })
        salePriceList.forEach((v, i) => {
            if (Math.abs(v['defaultPrice'])>0 && v['name']=='') {
                errorList.push(`默认采购价${i+1}请选择计量单位`)
            }
            unitPriceList.push(v)
        })
    }

    //组装单的校验
    if (['OPEN', 'INVALID_DELETE', 'INVALID'].includes(psiData['assemblyState'])) {
        psiData['assemblyState']='OPEN'
    }

    //期初值校验
    if (psiData['openList'].length) {
        const financialInfo = psiData['financialInfo']
        const openAssist = psiData['financialInfo']['openAssist']//辅助属性
        const openBatch = psiData['financialInfo']['openBatch']//批次管理
        const openShelfLife = psiData['financialInfo']['openShelfLife']//保质期管理
        const openSerial = psiData['financialInfo']['openSerial']//序列号
        const assistUuidList = financialInfo['assistClassificationList'].map(v => v['uuid'])
        const isOpenedQuantity = psiData['isOpenedQuantity']

        psiData['openList'].forEach(v => {
            const openedQuantity = v['openedQuantity'] ? v['openedQuantity'] : 0
            const openedAmount = v['openedAmount'] ? v['openedAmount'] : 0
            if (openAssist) {
                v['assistList'] = v['assistList'].filter(w => assistUuidList.includes(w['classificationUuid']))
                if (assistUuidList.length!=v['assistList'].length) {
                    errorList.push(`期初中有属性未选择完整`)
                }
            }
            if (openBatch) {
                if (!v['batch']) {
                    errorList.push(`期初中有批次未选择`)
                }
                if (openShelfLife && (!v['expirationDate'])) {
                    errorList.push(`期初中有批次未选择截止日期`)
                }
            }

        })
    }

    if (errorList.length) {
        return thirdParty.toast.info(errorList[0])
    }
    psiData['unitPriceList'] = unitPriceList

    const save = () => {
        if(insertOrModify === 'insert'){
            thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

            const fromPage = getState().inventoryConfState.getIn(['views', 'fromPage'])

            const fromPageType = {
                'editRunning': 'SAVE_JR-QUICK_MANAGER-SAVE_STOCK', // 外部流水
                'payment': 'SAVE_JR-QUICK_MANAGER-SAVE_STOCK', // 内部流水
                'inventory': 'MANAGER-STOCK_SETTING-CUD_CARD',
                'searchApproval': 'QUERY_PROCESS-QUICK_MANAGER-SAVE_STOCK',
                'editApproval':'INITIATE_PROCESS-QUICK_MANAGER-SAVE_STOCK'
            }

            fetchApi('addInventorySettingCard', 'POST', JSON.stringify({
                psiData:psiData,
                insertFrom:from,
                treeFrom,
                needAutoIncrementCode:flag === 'insert' ? false : true,
                action: fromPageType[fromPage]
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type:ActionTypes.SAVE_INVENTORY_CONFIG_CARD,
                        list:json.data.resultList,
                        flag:flag,
                        autoIncrementCode:json.data.autoIncrementCode,
                    })

                    if (fromPage !== 'inventory' && fromPage !== 'editApproval') {
                        // 刷新录入页面
                        dispatch(editRunningConfigActions.getInventoryCardListForchangeConfig())
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

                    if (flag === 'insert') {
                        thirdParty.toast.info('保存成功', 2, closeModal())
                    } else {//保存并新增
                        thirdParty.toast.info('保存成功')
                    }
                    dispatch(getUnit())
                }
            })
        }else{
            thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
            fetchApi('editInventorySettingCard', 'POST', JSON.stringify({
                psiData:psiData,
                modifyFrom:from,
                treeFrom,
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type:ActionTypes.SAVE_INVENTORY_CONFIG_CARD,
                        list:json.data.resultList,
                    })
                    thirdParty.toast.info('修改成功',2,closeModal())
                    dispatch(getUnit())
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
                    thirdParty.Confirm({
                        message: `卡片名称与[编码：${json.data.card.code}]卡片重复，确定保存吗？`,
                        title: '名称重复',
                        buttonLabels: ['取消', '确定'],
                        onSuccess : (result) => {
                            if (result.buttonIndex==1) {
                                save()
                            }
                        },
                        onFail : (err) => {}
                   })
                }else{
                    save()
                }
        }
    })
}

export const beforeEditCard = (item,showModal) => (dispatch, getState) => {
    const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')

    async function getList (inventoryUuid) {
        await new Promise(resolve => {
            fetchApi('getBatchList', 'POST', JSON.stringify({inventoryUuid, canUse: true, needPage: false}), json => {
                if (showMessage(json)) {
                    if (json.code === 0) {
                        dispatch(changeData(['inventoryCardTemp', 'financialInfo', 'batchList'], fromJS(json.data.batchList)))
                        resolve()
                    }
                }
            })
        })
        dispatch(getBatchList({inventoryUuid, needPage: false, }))
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getInventorySettingOneCard`, 'GET', `uuid=${item.get('uuid')}`, card => {
        thirdParty.toast.hide()
        if (showMessage(card)) {
            dispatch({
                type:ActionTypes.BEFORE_EDIT_INVENTORY_CONFIG_CARD,
                data:card.data,
                isOpenedWarehouse,
            })
            showModal()
            if (card.data.assemblyState=='INVALID_DELETE') {
                thirdParty.toast.info('组装单的部分物料已被删除，建议重新设置并保存该存货')
            }
            if (card.data.financialInfo && card.data.financialInfo.openBatch) {
                getList(card.data.uuid)
            }
        }
    })
    dispatch(getUnit())
    if (isOpenedWarehouse) {
        dispatch(getWarehouseTree())
    }
}
export const modifyCardUsedStatus = (uuid,value) => dispatch => {
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_USED_STATUS,
        used:value
    })
}

export const changeCardBoxStatus = (status,uuid) => dispatch => {
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_BOX_STATUS,
        status:status,
        uuid:uuid
    })
}

export const changeHighTypeBoxStatus = (status,uuid) => dispatch => {
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_CONFIG_HIGHT_TYPE_BOX_STATUS,
        status:status,
        uuid:uuid
    })
}

export const deleteCardList = (closeModal) => (dispatch,getState) => {
    const from = getState().inventoryConfState.getIn(['views','activeTabKeyUuid'])
    const treeFrom = getState().inventoryConfState.getIn(['views','selectTypeId'])
    const deleteList = getState().inventoryConfState.getIn(['views','cardSelectList']).toJS()
    if(deleteList.length === 0){
        thirdParty.toast.info('请选择要删除的卡片')
        return ;
    }

    async function checkBeforeDelete () {
        let shouldDelete = false
        await new Promise(resolve => {
            fetchApi('checkBeforeDelete', 'POST', JSON.stringify({
                deleteList:deleteList,
            }), json => {
                if (showMessage(json)) {
                    if (json.data.inMaterialList.length) {//该存货存在于存货组装中
                        const message = `${json.data.inMaterialList.reduce((p, c) => `${p}${p?';':''}${c['code']} ${c['name']}`, '')} 属于其他存货的组装物料，删除后将导致组装单失效。继续删除吗？`
                        thirdParty.Confirm({
                            title: '确定删除么',
                            message: message,
                            buttonLabels: ['取消', '确定'],
                            onSuccess : (result) => {
                                if (result.buttonIndex==1) {
                                    shouldDelete = true
                                    resolve();
                                }
                            },
                            onFail : (err) => {}
                       })

                    } else {
                        shouldDelete = true
                        resolve();
                    }

                }
            })
        })

        if (shouldDelete) {
            thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
            fetchApi('deleteInventorySettingCardList', 'POST', JSON.stringify({
                deleteList:deleteList,
                deleteFrom:from,
                treeFrom,
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type:ActionTypes.DELETE_INVENTORY_CONFIG_CARD_LIST,
                        list:json.data.resultList,
                        treeList:json.data.typeList
                    })
                    if(json.data.error === ""){
                        thirdParty.toast.info('删除成功')
                        closeModal()
                    }else{
                        thirdParty.toast.info(json.data.error)
                    }
                }
            })
        }

    }

    checkBeforeDelete()
}

/*export const changeModalActiveHighType = (v) => dispatch => {
    // thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    // fetchApi(`getOneInventorySettingHighType`, 'GET', `uuid=${v.get('uuid')}`, oneHighType => {
    //     thirdParty.toast.hide()
    //     if (showMessage(oneHighType)) {
    //         dispatch({
    //             type:ActionTypes.CHANGE_MODAL_ACTIVE_HIGH_TYPE,
    //             info:oneHighType.data,
    //             name:v.get('name'),
    //             uuid:v.get('uuid'),
    //         })
    //     }
    // })
    dispatch({
        type: ActionTypes.CHANGE_MODAL_ACTIVE_HIGH_TYPE,
        info: v,
        name: v.get('name'),
        uuid: v.get('uuid'),
    })
}*/

export const changeHighTypeContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONFIG_HIGH_TYPE_CONTENT,
		name,
        value
	})
}

export const saveInventorySettingContent = () => (dispatch, getState) => {
    const psiData = getState().inventoryConfState.get('inventoryHighTypeTemp').toJS()
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('insertInventoryHighType', 'POST', JSON.stringify({
        psiData:psiData
    }), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if (json.code === 0) {
                dispatch({
                    type:ActionTypes.GET_INVENTORY_CONFIG_HIGH_TYPE_LIST,
                    title:json.data,
                })
                thirdParty.toast.info('保存成功',2)
            }
		}
	})
}

export const beforeAddModalHighType = () => ({
    type:ActionTypes.INSERT_INVENTORY_CONFIG_HGIH_TYPE,
})

export const clearCardSelectList = (clearType) => ({
    type: ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_SELECT_LIST,
    clearType
})

export const deleteHighType = (closeModal) => (dispatch,getState) => {
    const state = getState().inventoryConfState
    const highTypeSelectList = state.get('highTypeSelectList')
    const activeTabKeyUuid = state.getIn(['views','activeTabKeyUuid'])//选中的顶级类别uuid
    if(highTypeSelectList.size === 0){
        thirdParty.toast.info('请选择需要删除的类别')
        return ;
    }
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('deleteInventorySettingHighTypeList', 'POST', JSON.stringify({
        deleteList:highTypeSelectList
    }), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if(json.code === 0){
                dispatch({
                    type:ActionTypes.DELETE_INVENTORY_CONFIG_HGIH_TYPE,
                    title:json.data.resultList,
                })
                thirdParty.toast.info('删除成功')
                closeModal()

                let uuidList = highTypeSelectList.map(v => v.get('uuid'))
                if (uuidList.includes(activeTabKeyUuid)) {
                    dispatch(changeActiveHighType(fromJS({'uuid':'','name':'全部'})))
                }
            }
		}
	})
}

export const insertAddInventoryCardType = (uuid, name) => dispatch => {
    dispatch({
        type:ActionTypes.INSERT_INVENTORY_CONFIG_CARD_TYPE,
        uuid,
        name
    })
}

export const changeCardTypeContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONFIG_CARD_TYPE_CONTENT,
		name,
        value
	})
}

export const changeCardTypeSelect = (parentUuid, parentName) => ({
    type: ActionTypes.SELECT_INVENTORY_CONFIG_CARD_TYPE,
	parentName,
    parentUuid
})

export const saveInventoryCardType = (toInventoryType) => (dispatch,getState) => {
    const psiData = getState().inventoryConfState.get('inventoryTypeTemp').toJS()
    psiData.ctgyUuid = getState().inventoryConfState.getIn(['inventoryHighTypeTemp', 'uuid'])

    const save = () =>{
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('addInventorySettingCardType', 'POST', JSON.stringify({
            psiData:psiData
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch(changeData(['inventoryHighTypeTemp', 'treeList'], fromJS(json.data.resultList)))
                thirdParty.toast.info('保存成功',2,toInventoryType())
            }
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
                    thirdParty.Confirm({
                        message: '确定保存吗',
                        title: "卡片类别名称与已有卡片类别名称重复，确定保存吗？",
                        buttonLabels: ['取消', '确定'],
                        onSuccess : (result) => {
                            save()
                        },
                        onFail : (err) => {}
                   })
                }else{
                    save()
                }
        }
    })
}

export const getInvetTypeInfo = (uuid) => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`getInventorySettingOneCardType`, 'GET', `uuid=${uuid}`, typeInfo => {
            thirdParty.toast.hide()
            if (showMessage(typeInfo)) {
                dispatch({
                    type:ActionTypes.GET_INVENTORY_CONFIG_TYPE_CONTENT,
                    uuid:uuid,
                    data:typeInfo.data,
                })
            }
        })
}

export const changeTypeSelectList = (uuid,value) => (dispatch,getState) => {
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_CONFIG_TYPE_SELECT_LIST,
        uuid:uuid,
        value:value
    })
}

export const confirmDeleteType = (typeList, closeModal) => (dispatch,getState) => {
    let cardTypeSelectList = []
    const loop = (data) => data.map((item) => {
            if (item.get('checked')) {
                cardTypeSelectList.push(item.get('uuid'))
            }
            if (item.get('childList').size > 0) {
                loop(item.get('childList'))
            }
        })

    loop(typeList)
    if(cardTypeSelectList.size === 0){
        thirdParty.toast.info('请选择要删除的类别')
        return ;
    }

    const activeTapKeyUuid = getState().inventoryConfState.getIn(['inventoryHighTypeTemp', 'uuid'])
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('deleteInventorySettingOneCardType', 'POST', JSON.stringify({
        ctgyUuid:activeTapKeyUuid,
        deleteList:cardTypeSelectList
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CONFIRM_DELETE_INVENTORY_CONFIG_TYPE,
                data:json.data.resultList,
            })
            thirdParty.toast.info('删除成功')
            closeModal()
        }
    })
}

export const typeSwapPosition = (uuid,swapUuid) => (dispatch,getState) => {
    const categoryUuid = getState().inventoryConfState.getIn(['inventoryHighTypeTemp', 'uuid'])
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('swapInventorySettingTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid:uuid,
            swappedSubordinateUuid:swapUuid,
            categoryUuid:categoryUuid,
        }
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_INVENTORY_CONFIG_TYPE_POSITION,
                list:json.data.resultList
            })
        }
    })
}

export const getWarehouseTree =  (uuidList=[], inventoryUuid='') => (dispatch) => {
    fetchApi(`getWarehouseTree`, 'POST', JSON.stringify({uuidList, inventoryUuid}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_INVENTORY_WAREHOUSE_TREE,
                data: json.data.cardList,
            })
        }
    })
}

export const getOpenWarehouseTree =  (warehouseUuidList=[], inventoryUuid='') => (dispatch) => {
    fetchApi(`getOpenWarehouseTree`, 'POST', JSON.stringify({warehouseUuidList, inventoryUuid}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_INVENTORY_OPEN_TREE,
                data: json.data.openList,
            })
        }
    })
}

export const getUnit =  () => (dispatch) => {
    fetchApi(`getUnit`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_INVENTORY_UNIT_LIST,
                data: json.data,
            })
        }
    })
}

//修改期初数量或金额
export const changeOpened = (dataType, uuidList, value, selfValue, idx) => ({
    type:ActionTypes.CHANGE_INVENTORY_OPENED,
    dataType,
    uuidList,
    value,
    selfValue,
    idx,
})

export const toggleLowerItem = (uuid) => ({
    type:ActionTypes.INVENTORY_TOGGLELOWER_ITEM,
    uuid
})

export const changeData = (dataType, value, short) => ({
    type:ActionTypes.CHANGE_INVENTORY_DATA,
    dataType,
    value,
    short
})

export const getStockCategoryTree = () => (dispatch, getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
    fetchApi('getStockCategoryTree', 'POST', JSON.stringify({
        categoryList: [],
        sobId
    }), json => {
        const loop = (data) => {
            data.forEach(v => {
                v['key'] = v['uuid']
                v['label'] = v['name']
                if (v['childList'].length) {
                    loop(v['childList'])
                }
            })
        }
        let list = json.data.typeList
        loop(list)
        list.unshift({key: 'ALL', label: '全部', top: true, uuid: '', childList: []})

        dispatch(changeData('stockCategoryTree', fromJS(list), true))
    })
}

export const getStockListByCategory =(value) => (dispatch, getState) => {
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	fetchApi('getRunningStockMemberList','POST', JSON.stringify({
		sobId,
		property:'0',
        openQuantity: true,
		listByCategory: value['top'] ? true : false,
		categoryUuid: value['uuid'],
		subordinateUuid: value['uuid']
	}),json => {
		if (showMessage(json)) {
            json.data.resultList.forEach(v => {
                v['oriName'] = v['name']
                v['name'] = `${v['code']} ${v['name']}`
            })
			dispatch(changeData('stockList', fromJS(json.data.resultList), true))
		}
	})
}

export const inventoryAssistList =  () => (dispatch) => {//获取存货辅助属性结构列表
    fetchApi(`inventoryAssistList`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch(changeData('assistClassificationList',fromJS(json.data.assistClassificationList), true))
        }
    })
}

export const saveInventoryAssist = (closeModal) => (dispatch,getState) => {
    const assist = getState().inventoryConfState.get('assist').toJS()
    const type = assist['type']

    let data = {}, url = ''
    ;({
        assistClassInsert: () => {
            url = 'assistClassInsert'
            data = {name: assist['classificationName']}
        },
        assistClassModify: () => {
            url = 'assistClassModify'
            data = {uuid: assist['classificationUuid'], name: assist['classificationName']}
        },
        assistPropertyInsert: () => {
            url = 'assistPropertyInsert'
            data = {name: assist['name'], classificationUuid: assist['classificationUuid']}
        },
        assistPropertyModify: () => {
            url = 'assistPropertyModify'
            data = {name: assist['name'], uuid: assist['uuid'], classificationUuid: assist['classificationUuid']}
        },
    }[type]())

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(url, 'POST', JSON.stringify(
        data
    ), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if(json.code === 0){
                if (['assistPropertyInsert', 'assistPropertyModify'].includes(type)) {
                    dispatch(changeData(['assist','propertyList'],fromJS(json.data)))
                }
                dispatch(inventoryAssistList())
                thirdParty.toast.info('保存成功',2,closeModal())
            }
		}
	})
}

export const deleteInventoryAssist = (closeModal) => (dispatch,getState) => {
    const assist = getState().inventoryConfState.get('assist').toJS()
    const type = assist['type']
    let uuid = '', url = ''

    ;({
        assistClassDelete: () => {
            url = 'assistClassDelete'
            uuid = assist['classificationUuid']
        },
        assistPropertyDelete: () => {
            url = 'assistPropertyDelete'
            uuid = assist['uuid']
        },
    }[type]())

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(url, 'GET', `uuid=${uuid}`, json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if (json.code === 0) {
                if (['assistPropertyDelete'].includes(type)) {
                    dispatch(changeData(['assist','propertyList'],fromJS(json.data)))
                }
                dispatch(inventoryAssistList())
                thirdParty.toast.info('保存成功',2,closeModal())
            }
		}
	})
}

export const saveInventoryBatch = (closeModal) => (dispatch,getState) => {
    const batch = getState().inventoryConfState.get('batch').toJS()
    const batchType = batch['batchType']
    const editPage = batch['editPage']

    let data = {}, url = ''
    if (batchType=='MODIFY-INSERT') {
        url = 'batchInsert'
        data={
            inventoryUuid: batch['inventoryUuid'],
            batch: batch['batch'],
            productionDate: batch['productionDate'],
            expirationDate: batch['expirationDate'],
            needPage: false,//不需要分页
            canUse: editPage=='inventory' ? true : undefined,//启用的
        }
    }
    if (batchType=='MODIFY-MODIFY') {
        url = 'batchModify'
        data={
            inventoryUuid: batch['inventoryUuid'],
            batch: batch['batch'],
            batchUuid: batch['batchUuid'],
            productionDate: batch['productionDate'],
            expirationDate: batch['expirationDate'],
            needPage: false,//不需要分页
            canUse: editPage=='inventory' ? true : undefined,//启用的
        }
    }

    async function checkBeforeModify () {
        let shouldSave = batchType=='MODIFY-INSERT'
        if (batchType=='MODIFY-MODIFY') {
            await new Promise(resolve => {
                fetchApi('batchCheckUsed', 'GET', `inventoryUuid=${batch['inventoryUuid']}&batchUuid=${batch['batchUuid']}`, json => {
                    if (showMessage(json)) {
                        if (json.data.used) {//被使用
                            const message = `原批次在期初值或流水中已被使用，修改后所有信息将同步修改。确认更新该批次的信息吗？`
                            thirdParty.Confirm({
                                title: '提示',
                                message: message,
                                buttonLabels: ['取消', '确定'],
                                onSuccess : (result) => {
                                    if (result.buttonIndex==1) {
                                        shouldSave = true
                                        resolve();
                                    }
                                },
                                onFail : (err) => {}
                           })

                        } else {
                            shouldSave = true
                            resolve();
                        }

                    }
                })
            })
        }

        if (shouldSave) {
            thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
            fetchApi(url, 'POST', JSON.stringify(
                data
            ), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    if(json.code === 0){
                        if (batch['editPage']=='inventory') {//期初值页面
                            dispatch(changeData(['inventoryCardTemp', 'financialInfo', 'batchList'], fromJS(json.data.batchList)))
                            thirdParty.toast.info('保存成功',2,closeModal())
                        }
                        if (batch['editPage']=='inventoryBatchList') {//批次管理页面
                            dispatch(changeData(['batch', 'allBatchList'], fromJS(json.data.batchList)))
                            thirdParty.toast.info('保存成功',2,closeModal())
                        }
                        if (batch['editPage']=='editRunning') {
                            if (batchType=='MODIFY-MODIFY') {
                                dispatch(editRunningConfigActions.updateStockBatch({
                                    batch: json.data['batch'],
                                    batchUuid: json.data['batchUuid'],
                                    expirationDate: json.data['expirationDate'],
                                    cardUuid: json.data['inventoryUuid'],
                                }))
                            }
                            closeModal()
                        }
                    }
                }
            })
        }

    }

    checkBeforeModify()
}

export const getBatchList = (data, type='allBatchList') => (dispatch,getState) => {
    fetchApi('getBatchList', 'POST', JSON.stringify(data), json => {
		if (showMessage(json,'','','',true)) {
            if (json.code === 0) {
                if (type == 'allBatchList') {//allBatchList 批次管理用
                    dispatch(changeData(['batch', 'allBatchList'], fromJS(json.data.batchList)))
                }
                if (type == 'batchList') {//可用的批次
                    dispatch(changeData(['inventoryCardTemp', 'financialInfo', 'batchList'], fromJS(json.data.batchList)))
                }
            }
		}
	})
}

export const modifyBatchStatus = (data) => (dispatch, getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('modifyBatchStatus', 'POST', JSON.stringify(data), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if (json.code === 0) {
                dispatch(changeData(['batch', 'allBatchList'], fromJS(json.data.batchList)))
            }
		}
	})
}

export const deleteBatchList = (data) => (dispatch, getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('deleteBatchList', 'POST', JSON.stringify(data), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if (json.code === 0) {
                dispatch(changeData(['batch', 'allBatchList'], fromJS(json.data.batchList)))
                if (json.data.usedList && json.data.usedList.length) {
                    let message = json.data.usedList.reduce((p, c) => `${p}${p?';':''}${c['batch']}`, '')
                    thirdParty.toast.info(`批次${message}已被期初值/流水使用，无法删除`, 2)
                }
                dispatch(getBatchList({inventoryUuid: data.inventoryUuid, canUse: true, needPage: false}, 'batchList'))
            }
        }
    })
}

export const getSerialList = (inventoryUuid, inUuid) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getSerialList', 'POST', JSON.stringify({
        inventoryUuid,
        inUuid,
        inType: 'O',
    }), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if (json.code === 0) {
                dispatch(changeData(['serial', 'serialList'], fromJS(json.data)))
            }
		}
	})
}

export const clearOpenedQuantity = (openType) => ({
    type:ActionTypes.INVENTORY_CLEAR_OPENED_QUANTITY,
    openType,
})
