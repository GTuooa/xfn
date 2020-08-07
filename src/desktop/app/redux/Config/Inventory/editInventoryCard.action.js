import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { message, Modal } from 'antd'

import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action'
import * as inventoryConfActions from 'app/redux/Config/Inventory/inventory.action.js'

// 新增存货卡片前 存货页面
export const beforeInventoryAddCard = (showCardModal, originTags) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', typeInfo => {
        if (showMessage(typeInfo)) {
            fetchApi(`getInitStockCard`, 'GET', '', json => {
                if (showMessage(json)) {
                let code = json.data.code
                dispatch({
                    type: ActionTypes.BEFORE_ADD_INVENTORY_CONF_CARD_INVENTORY,
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
export const beforeInventoryEditCard = (item, showModal, originTags,assemblyState,fromOpen=false) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getInventorySettingOneCard`, 'GET', `uuid=${item.get('uuid')}`, card => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(card)) {
            const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
            if (card.data.unitPriceList && !card.data.unitPriceList.some(v => v.type === 1)) {
                card.data.unitPriceList.push({type:1})
            }
            if (card.data.unitPriceList && !card.data.unitPriceList.some(v => v.type === 2)) {
                card.data.unitPriceList.push({type:2})
            }
            if (card.data.isOpenedQuantity) {
                dispatch(getUnitCardList())
            }
            if (card.data.financialInfo && card.data.financialInfo.openBatch) {
                dispatch(getInitBatchList(card.data.uuid))
            }
            if (assemblyState === 'OPEN' || assemblyState === 'INVALID') {
                fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=&isOpenQuantity=true&isUsed=true`, json => {
                    if (showMessage(json)) {
                        dispatch(changeInventoryCardViews('stockList',fromJS(json.data.resultList)))
                    }
                })
            }
            dispatch({
                type: ActionTypes.BEFORE_EDIT_INVENTORY_CONF_CARD,
                data: card.data,
                originTags,
                assemblyState,
                fromOpen,
                enableWarehouse
            })
            showModal()
        }
    })
}

// 修改存货卡片字段
export const changeInventoryCardContent = (name, value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CARD_CONTENT,
		name,
        value
	})
}

export const changeInventoryCardViews = (name, value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONF_CARD_VIEWS,
        name,
        value
    })
}
export const changeInventoryViewsContent = (name, value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONF_VIEWS_CONTENT,
		name,
        value
	})
}

// 修改 存货性质 字段
export const changeInventoryCardNature = (name,value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONF_CARD_NATURE,
		name,
        value
	})
}


export const changeInventoryInnerSrting = (arr,value) => dispatch => {
    dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONF_INNER_STRING,
		arr,
        value
	})
}

// 修改 存货用途 字段
// export const changeInventoryCardContentUsed = (name,value) => dispatch => {
//     dispatch({
// 		type: ActionTypes.CHANGE_INVENTORY_CONF_CARD_USED,
// 		name,
//         value
// 	})
// }

// 勾选后要获取到对应的类别
export const changeInventoryCardCategoryStatus = (item, value) => dispatch => {
    fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${item.get('uuid')}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_INVENTORY_CONF_CARD_CATEGORY_STATUS,
                list: json.data.resultList,
                item: item,
                value: value,
            })
        }
    })
}

// 选类别
export const changeInventoryCardCategoryType = (item, value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
    dispatch({
        type: ActionTypes.CHANGE_INVENTORY_CONF_CARD_CATEGORY_TYPE,
        item: item,
        uuid: valueList[0],
        name: valueList[1],
    })
}

// 保存 存货设置页面的存货 卡片
export const saveInventoryCard = (fromPage, flag, closeModal, showConfirmModal, closeConfirmModal) => (dispatch, getState) => {
    const homeState = getState().homeState
    const allPanes = homeState.get('allPanes')
    let psiData = getState().inventoryCardState.get('inventoryCardTemp').toJS()
    const enableWarehouse = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    let openList = []
    const financialInfo = psiData.financialInfo || {}
    const assistClassificationList = financialInfo.assistClassificationList
    const insertOrModify = getState().inventoryCardState.getIn(['views', 'insertOrModify'])
    const loop = (data) => data.forEach(v => {
        if (!v.isEnd) {
            loop(v.childList)
        } else {
            let newItem
            if (financialInfo.openAssist || financialInfo.openBatch) {

                 newItem = v.childList.map(w => {
                    w.warehouseName = v.warehouseName
                    w.warehouseUuid = v.warehouseUuid
                    w.warehouseCode = v.warehouseCode
                    return w
                    })
                if (financialInfo.openAssist) {
                    newItem = newItem.map(v => ({...v,assistList:v.assistList.filter(w => assistClassificationList.some(z => z.uuid === w.classificationUuid))}))
                }
            } else {
                newItem = v
            }
            openList = openList.concat(newItem)
        }
        })
    if (enableWarehouse) {
        loop(psiData.openList)
        psiData.openList = openList
    } else if (insertOrModify === 'modify') {
         psiData.openList = psiData.openList.map(v => ({...v,assistList:v.assistList.filter(w => assistClassificationList.some(z => z.uuid === w.classificationUuid))}))
    }

    let from = ''
    let treeFrom = ''
    if (allPanes.get('ConfigPanes').find(v => v.get('title') === '存货设置')) {
        from = getState().inventoryConfState.getIn(['views', 'activeTapKeyUuid'])
        treeFrom = getState().inventoryConfState.getIn(['views', 'selectTypeId'])
    }
    if (psiData.assemblyState === 'INVALID') {
        psiData.assemblyState = 'OPEN'
    }
    if (psiData.assemblySheet && psiData.assemblySheet.materialList && psiData.assemblySheet.materialList.length) {
        psiData.assemblySheet.materialList = psiData.assemblySheet.materialList.filter(v => v.materialUuid)
    }
    const save = () => {
        if (insertOrModify === 'insert') {

            const fromPageType = {
                'editRunning': 'SAVE_JR-QUICK_MANAGER-SAVE_STOCK', // 外部流水
                'payment': 'SAVE_JR-QUICK_MANAGER-SAVE_STOCK', // 内部流水
                'inventoryConfig': 'MANAGER-STOCK_SETTING-CUD_CARD',
                'searchApproval': 'QUERY_PROCESS-QUICK_MANAGER-SAVE_STOCK',
                'searchApprovalHideCategory': 'QUERY_PROCESS-QUICK_MANAGER-SAVE_STOCK'
            }

            fetchApi('addInventorySettingCard', 'POST', JSON.stringify({
                psiData:psiData,
                insertFrom:from,
                treeFrom,
                needAutoIncrementCode: flag === 'insert' ? false : true,
                action: fromPageType[fromPage]
            }), json => {
                if (showMessage(json, 'show')) {
                    dispatch({
                        type: ActionTypes.SAVE_INVENTORY_CONF_CARD_INVENTORY,
                        // list: json.data.resultList,
                        flag: flag,
                        autoIncrementCode: json.data.autoIncrementCode,
                    })
                    if (closeModal) {
                        closeModal()
                    }
                    // 同步修改录入流水数据
                    dispatch(afterEditInventoryConf(fromPage === 'payment', fromPage))
                    if (fromPage === 'inventoryConfig') {
                        const activeTapKey = getState().inventoryConfState.getIn(['views','activeTapKey'])
                        const activeTapKeyUuid = getState().inventoryConfState.getIn(['views','activeTapKeyUuid'])
                        const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
                        dispatch(inventoryConfActions.refreshInventoryList(currentItem))
                    }
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        } else {
            fetchApi('editInventorySettingCard', 'POST', JSON.stringify({
                psiData:psiData,
                modifyFrom:from,
                treeFrom,
            }), json => {
                if (showMessage(json, 'show')) {
                    dispatch({
                        type:ActionTypes.SAVE_INVENTORY_CONF_CARD_INVENTORY,
                        // list:json.data.resultList,
                    })
                    closeModal()
                    // 同步修改录入流水数据
                    dispatch(afterEditInventoryConf())
                    if (fromPage === 'inventoryConfig') {
                        const activeTapKey = getState().inventoryConfState.getIn(['views','activeTapKey'])
                        const activeTapKeyUuid = getState().inventoryConfState.getIn(['views','activeTapKeyUuid'])
                        const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
                        dispatch(inventoryConfActions.refreshInventoryList(currentItem))
                    }
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }

    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('adjustInventorySettingCardTitleSame', 'POST', JSON.stringify({
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
export const deleteInventoryCardList = () => (dispatch,getState) => {


    const deleteList = getState().inventoryConfState.getIn(['views', 'cardSelectList'])

    thirdParty.Confirm({
        message: '确定删除卡片？',
        title: "提示",
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if (result.buttonIndex === 1) {
                fetchApi('deleteInventoryCheck', 'POST', JSON.stringify({deleteList}), json => {
                    if (showMessage(json)) {
                        if (json.data.inMaterialList && json.data.inMaterialList.length) {
                            thirdParty.Confirm({
                                message: `${json.data.inMaterialList.map(v => `【${v.code}】【${v.name}】`).join('、')}属于其他存货的组装物料，删除后将导致组装单失效。确认删除吗？`,
                                title: "提示",
                                buttonLabels: ['取消', '确定'],
                                onSuccess: (result) => {
                                    if (result.buttonIndex === 1) {
                                        dispatch(deleteInventorySettingCardList(deleteList))
                                    }
                                },
                                onFail: (err) => console.log(err)
                                })
                        } else {
                            dispatch(deleteInventorySettingCardList(deleteList))
                        }
                    }
                })

            }
        },
        onFail: (err) => console.log(err)
    })
}
const deleteInventorySettingCardList = (deleteList) => (dispatch,getState) => {
    const from = getState().inventoryConfState.getIn(['views', 'activeTapKeyUuid'])
    const treeFrom = getState().inventoryConfState.getIn(['views', 'activeTreeKeyUuid'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteInventorySettingCardList', 'POST', JSON.stringify({
        deleteList,
        deleteFrom: from,
        treeFrom,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.DELETE_INVENTORY_CONF_CARD_LIST,
                list: json.data.resultList,
                treeList: json.data.typeList
            })
            if (json.data.error === "") {
                message.info('删除成功')
            } else {
                message.info(json.data.error)
            }
            // 同步修改录入流水数据
            dispatch(afterEditInventoryConf())
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const afterEditInventoryConf = (fromPayment, fromPage) => (dispatch, getState) => {

    const homeState = getState().homeState
    const allPanes = homeState.get('allPanes')
    const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])

    if (newJr === true) {
        // 还有逻辑不严谨之处，fromPayment不能判断其他页面修改时录入流水页面是fromPayment
        if (allPanes.get('SearchPanes').find(v => v.get('title') === '查询审批')) {
            if (fromPage === 'searchApproval') {
                dispatch(configCallbackActions.getApprovalStockCardList())
            } else {
                dispatch(configCallbackActions.getApprovalStockCardList([], 'hidecategory'))
            }
            if (allPanes.get('EditPanes').find(v => v.get('title') === '录入流水')) {
                setTimeout(() => {
                    dispatch(configCallbackActions.getStokcListFromConfig())
                },800)
            }
        } else if (allPanes.get('EditPanes').find(v => v.get('title') === '录入流水') && fromPayment) {
            dispatch(configCallbackActions.getStokcListFromConfig())
        } else if (allPanes.get('EditPanes').find(v => v.get('title') === '录入流水')) {
            dispatch(configCallbackActions.getInventoryCardListForchangeConfig())
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
        const stockRange = cardTemp.getIn([categoryTypeObj,'stockRange'])
        const runningState = cardTemp.get('runningState')

        stockRange && stockRange.size && dispatch(lrAccountActions.getFirstStockCardList(stockRange,runningState))
    }
}

export const getUnitCardList = () => dispatch => {
    fetchApi('getUnitList', 'GET', 'inventoryUuid=',json => {
        if (showMessage(json)) {
            dispatch(changeInventoryCardViews('standardList',fromJS(json.data.standardList)))
            dispatch(changeInventoryCardViews('customList',fromJS(json.data.customList)))
        }
    })
}

export const addUnit = (unitList,index) => dispatch => {
    let unitListJ = unitList.toJS()
    unitListJ.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeInventoryCardContent(['unit','unitList'],  fromJS(unitListJ)))
}
export const deleteUnit = (unitList,index) => dispatch => {
    let unitListJ = unitList.toJS()
    unitListJ.splice(index,1)
    dispatch(changeInventoryCardContent(['unit','unitList'],  fromJS(unitListJ)))
}

export const initUnitState = () => ({
    type: ActionTypes.INIT_UNIT_STATE,
})

export const getWarehouseTree = (callback) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi('warehouseCardTree', 'POST', JSON.stringify({
        uuidList:[]
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeInventoryCardViews('warehouseList',fromJS(json.data.cardList[0].childList)))
            callback()
        }
    })

}

export const getSomeWarehouseTree = (uuidList,callback) => (dispatch,getState) => {
    const insertOrModify = getState().inventoryCardState.getIn(['views','insertOrModify'])
    const inventoryUuid = insertOrModify === 'insert'?'':getState().inventoryCardState.getIn(['inventoryCardTemp','uuid'])
    if (!uuidList.length) {
        dispatch(changeInventoryCardContent('openList',fromJS([])))
        callback()
        return
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getOpenWarehouseCardTree', 'POST', JSON.stringify({
        warehouseUuidList:uuidList,
        inventoryUuid
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeInventoryCardContent('openList',fromJS(json.data.openList[0].childList?json.data.openList[0].childList:[])))
            dispatch(changeInventoryCardViews('selectedKeys',fromJS([])))
            callback()
        }
    })

}

export const addUnitPrice = (unitList,index,type) => dispatch => {
    let unitListJ = unitList.toJS()
    unitListJ.splice(index+1,0,{amount:'',uuid:'',type})
    dispatch(changeInventoryCardContent('unitPriceList',  fromJS(unitListJ)))
}
export const deleteunitPrice = (unitList,index) => dispatch => {
    let unitListJ = unitList.toJS()
    unitListJ.splice(index,1)
    dispatch(changeInventoryCardContent('unitPriceList',  fromJS(unitListJ)))
}

export const initInventoryCard = () => ({
    type: ActionTypes.INIT_ADD_INVENTORY_STATE
})

export const addMaterial = (materialList,index) => dispatch => {
    let stockCardListJ = materialList.toJS()
    stockCardListJ.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeInventoryInnerSrting(['assemblySheet','materialList'],  fromJS(stockCardListJ)))
}
export const deleteMaterial = (materialList,index) => dispatch => {
    let stockCardListJ = materialList.toJS()
    stockCardListJ.splice(index,1)
    dispatch(changeInventoryInnerSrting(['assemblySheet','materialList'], fromJS(stockCardListJ)))
}

export const getInventorySettingOneCard = (uuid,index) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getInventorySettingOneCard`, 'GET', `uuid=${uuid}`, card => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(card)) {
                let unitList = card.data.unit.unitList || []
                unitList.unshift({uuid:card.data.unit.uuid,name:card.data.unit.name})
                if (unitList.length === 1) {
                    dispatch(changeInventoryInnerSrting(['assemblySheet','materialList',index,'unitUuid'],unitList[0].uuid))
                    dispatch(changeInventoryInnerSrting(['assemblySheet','materialList',index,'unitName'],unitList[0].name))
                }
                dispatch(changeInventoryInnerSrting(['assemblySheet','materialList',index,'unitList'],fromJS(unitList)))
            }
        })

}

// 获取存货的选择里的类别和卡片
export const getInventoryAllCardList = (categoryList =[], modalName, leftNotNeed) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const editRunningState = getState().editRunningState

    if(!leftNotNeed) {
        fetchApi('getStockCardList', 'POST', JSON.stringify({
            sobId,
            categoryList:[],
            openQuantity:true
        }),json => {
            if (showMessage(json)) {
                dispatch(changeInventoryCardViews('MemberList', fromJS(json.data.typeList)))

            }
        })
    }
    fetchApi('getStockCategoryList', 'POST', JSON.stringify({
        sobId,
        categoryList,
        property:0,
        openQuantity:true
    }),json => {
        if (showMessage(json)) {
            dispatch(changeInventoryCardViews('thingsList', fromJS(json.data.result)))
            dispatch(changeInventoryCardViews(modalName, true))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const chargeItemCheckboxCheckAll =  (checked,allList,thingsList) => dispatch => {
    allList.map(v => {
        const item = thingsList.find(w => w.get('uuid') === v.uuid).toJS()
        const { uuid, code, name } = item
        let unitList = item.unit.unitList || []
        unitList.unshift({uuid:item.unit.uuid,name:item.unit.name})
        dispatch(chargeItemCheckboxCheck(checked,uuid, code, name, unitList))
    })
}

export const chargeItemCheckboxCheck = (checked,uuid,code,name,unitList) => ({
    type: ActionTypes.IVNENTORY_CHARGE_ITEM_CHECKBOX_SELECT,
    checked,
    uuid,
    name,
    code,
    unitList
})

export const getInventorySomeCardList = (uuid,level) =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (level == 1) {
        fetchApi('getRunningStockMemberList','POST', JSON.stringify({
            sobId,
            categoryUuid: uuid,
            listByCategory: true,
            subordinateUuid: '',
            property:0,
            openQuantity:true
        }), json => {
            if (showMessage(json)) {
                dispatch(changeInventoryCardViews('thingsList', fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApi('getRunningStockMemberList', 'POST', JSON.stringify({
            sobId,
            subordinateUuid: uuid,
            listByCategory: false,
            categoryUuid: '',
            property:0,
            openQuantity:true
        }),json => {
            if (showMessage(json)) {
                dispatch(changeInventoryCardViews('thingsList', fromJS(json.data.resultList)))
            }
        })
    }
}
export const getAssistList = (uuid,cb) => dispatch => {
        fetchApi('getInventoryAssistList', 'GET', `inventoryUuid=` ,json => {
                dispatch(changeInventoryCardViews('allAssistClassificationList', fromJS(json.data.assistClassificationList)))
                cb && cb()
        })

}
export const chooseAssitUniform = (uuidList,bool) => dispatch => {
    dispatch({
        type: ActionTypes.CHOOSE_ASSIST_UNIFORM,
        uuidList,
        bool
    })

}

export const insertAssistCategroy = (name,cb) => dispatch => {
    fetchApi('insertAssistCategroy','POST',JSON.stringify({
        name
        }),json => {
            if(showMessage(json,'show')) {
                cb && cb()
                dispatch(getAssistList())
            }
        })
}

export const modifyAssistCategroy = (uuid,name,cb) => dispatch => {
    fetchApi('modifyAssistCategroy','POST',JSON.stringify({
        name,
        uuid
        }),json => {
            if(showMessage(json,'show')) {
                cb && cb()
                dispatch(getAssistList())
            }
        })
}

export const deleteAssistCategroy = (uuid,cb) => dispatch => {
    fetchApi('deleteAssistCategroy','GET','uuid='+uuid,json => {
            if(showMessage(json,'show')) {
                cb && cb()
                dispatch(getAssistList())
            }
        })
}

export const insertAssist = (classificationUuid,name,cb) => dispatch => {
    fetchApi('insertAssist','POST',JSON.stringify({
        name,
        classificationUuid
        }),json => {
            if(showMessage(json,'show')) {
                cb && cb()
                dispatch(getAssistList())
            }
        })
}

export const modifyAssist = (uuid,classificationUuid,name) => dispatch => {
    fetchApi('modifyAssist','POST',JSON.stringify({
        name,
        uuid,
        classificationUuid
        }),json => {
            if(showMessage(json,'show')) {
                dispatch(getAssistList())
            }
        })
}

export const deleteAssist= (uuid,cb) => dispatch => {
    fetchApi('deleteAssist','GET','uuid='+uuid,json => {
            if(showMessage(json,'show')) {
                cb && cb()
                dispatch(getAssistList())
            }
        })
}

export const insertInventoryBatch = (batch,productionDate,expirationDate,inventoryUuid,condition,orderBy,currentPage,isAsc,cb) => (dispatch,getState) => {
    fetchApi('insertBatch','POST',JSON.stringify({
        batch,
        productionDate,
        expirationDate,
        inventoryUuid,
        condition,
        orderBy,
        currentPage,
        isAsc
        }),json => {
            if(showMessage(json,'show')) {
                cb && cb()
                dispatch(changeInventoryCardViews('batchList',fromJS(json.data.batchList) || fromJS([])))
            }
        })

}

export const insertBatch = (batch,productionDate,expirationDate,inventoryUuid='',close,cb) => (dispatch,getState) => {
    const inventoryCardState = getState().inventoryCardState
    const insertOrModify = inventoryCardState.getIn(['views', 'insertOrModify'])
    const initOpenBatch = inventoryCardState.getIn(['views', 'initOpenBatch'])
    const batchList = inventoryCardState.getIn(['inventoryCardTemp','financialInfo','batchList']) || fromJS([])
    if ((insertOrModify === 'insert' || !initOpenBatch) &&  batchList.some(v => v.get('batch') === batch && batch) ) {
        message.info('批次号重复')
    } else if (insertOrModify === 'insert' || !initOpenBatch) {
        message.success('成功')
        cb && cb(batch,expirationDate)
        close && close()
        dispatch(changeInventoryCardContent(['financialInfo','batchList'],batchList.push(fromJS({batch,productionDate,expirationDate,inventoryUuid}))))
    } else {
        fetchApi('insertBatch','POST',JSON.stringify({
            batch,
            productionDate,
            expirationDate,
            inventoryUuid
            }),json => {
                if(showMessage(json,'show')) {
                    const {
                        batch,
                        batchUuid,
                        expirationDate
                    } = json.data
                    cb && cb(batch,batchUuid,expirationDate)
                    close && close()
                    dispatch(changeInventoryCardContent(['financialInfo','batchList'],fromJS(json.data.batchList)))
                }
            })
    }

}

export const modifyBatch = (batch,batchUuid,productionDate,expirationDate,inventoryUuid,cb) => (dispatch,getState) => {
    fetchApi('batchUsedCheck','GET',`inventoryUuid=${inventoryUuid}&batchUuid=${batchUuid}`,json => {
            if(showMessage(json)) {
                if (json.data.used) {
                    Modal.confirm({
                        title:'提示',
                        content:'原批次在期初值或流水中已被使用，修改后所有信息将同步修改。确认更改该批次的信息吗？',
                        onOk() {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            fetchApi('modifyBatch','POST',JSON.stringify({
                                batch,
                                productionDate,
                                inventoryUuid,
                                batchUuid,
                                expirationDate
                                }),json => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if(showMessage(json,'show')) {
                                        cb && cb()
                                        dispatch(changeInventoryCardContent(['financialInfo','batchList'],fromJS(json.data.batchList)))
                                    }
                            })
                        }
                    })
                } else {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    fetchApi('modifyBatch','POST',JSON.stringify({
                        batch,
                        productionDate,
                        inventoryUuid,
                        batchUuid,
                        expirationDate
                        }),json => {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            if(showMessage(json,'show')) {
                                cb && cb()
                                dispatch(changeInventoryCardContent(['financialInfo','batchList'],fromJS(json.data.batchList)))
                            }
                    })
                }
            }
        })
}

export const getSerialList = (inventoryUuid,inUuid) => (dispatch,getState) => {
    const inventoryCardState = getState().inventoryCardState
    const inventoryUuid = inventoryCardState.getIn(['inventoryCardTemp','uuid'])
    const uuid = inventoryCardState.getIn(['inventoryCardTemp','uuid'])
    fetchApi('getSerialList','POST',JSON.stringify({inventoryUuid,inUuid}),json => {
        if (showMessage(json)) {
            dispatch(changeInventoryCardViews('serialList',fromJS(json.data) || fromJS([])))
            dispatch(changeInventoryCardViews('serialModal',true))
        }
    })
}
export const emptyWarehouseListQuantity = () => ({
    type:ActionTypes.EMPTY_WAREHOUSE_LIST_QUANTITY
})

export const getBatchList = (uuid,currentPage=1,condition,orderBy,isAsc,cb) => (dispatch,getState) => {
    const inventoryUuid = uuid || getState().inventoryCardState.getIn(['views','batchUuid'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getBatchList','POST',JSON.stringify({
        inventoryUuid,
        condition,
        orderBy,
        currentPage,
        isAsc
        }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeInventoryCardViews('batchList',fromJS(json.data.batchList) || fromJS([])))
            dispatch(changeInventoryCardViews('batchUuid',inventoryUuid))
            dispatch(changeInventoryCardViews('batchManageModal',true))
            dispatch(changeInventoryCardViews('shelfLife',json.data.shelfLife))
            cb && cb()
        }
    })
}

export const getInitBatchList = (inventoryUuid) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getBatchList','POST',JSON.stringify({
        inventoryUuid,
        }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeInventoryCardContent(['financialInfo','batchList'],fromJS(json.data.batchList)))
        }
    })
}

export const deleteBatch = (inventoryUuid,deleteList,currentPage=1,condition,orderBy,isAsc,cb) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteBatch','POST',JSON.stringify({
        inventoryUuid,
        deleteList,
        condition,
        orderBy,
        currentPage,
        isAsc
        }), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                if (json.data.usedList && json.data.usedList.length) {
                    message.info(`${json.data.usedList.map(v => `【${v.batch}】`).join('、')}批次已在期初值或流水中使用，不可删除`)
                } else {
                    message.success('成功')
                }
                dispatch(changeInventoryCardViews('batchList',fromJS(json.data.batchList) || fromJS([])))
                cb && cb()
            }
        })
}

export const toggleBatch = (inventoryUuid,batchUuid,canUse,currentPage=1,condition,orderBy,isAsc,cb) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('toggleBatch','POST',JSON.stringify({
        inventoryUuid,
        canUse,
        condition,
        orderBy,
        currentPage,
        isAsc,
        batchUuid
        }), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                // dispatch(changeInventoryCardViews('batchList',fromJS(json.data.batchList) || fromJS([])))
                cb && cb()
            }
        })
}
