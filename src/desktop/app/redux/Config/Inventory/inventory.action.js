import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.account.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as warehouseConfigActions from 'app/redux/Config/warehouseConfig/warehouseConfig.action'

import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { fromJS, toJS } from 'immutable'
import { message, Modal } from 'antd'
const confirm = Modal.confirm
import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
// 首次获取存货设置
export const getInventoryConfigInit = () => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=&currentPage=${1}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=`, cardList => {
        if (showMessage(cardList)) {
            fetchApi(`getInventoryHighTypeList`, 'GET', '', titleList => {
                if (showMessage(titleList)) {
                    dispatch({
                        type: ActionTypes.GET_INVENTORY_CONFIG_INIT,
                        title: titleList.data,
                        cardList: cardList.data.resultList,
                        enableWarehouse: cardList.data.enableWarehouse,
                        pageCount:cardList.data.pages
                    })
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

// 切换存货设置类别
export const changeInventoryActiveHighType = (currentCategory,curPage) => (dispatch, getState) => {
    dispatch(getCardListAndTree(currentCategory,curPage))
}
// 刷新
export const refreshInventoryList = (currentCategory,curPage,searchContent) => (dispatch,getState) => {
    dispatch(getCardListAndTree(currentCategory,curPage,searchContent))
}

const getCardListAndTree = (currentCategory,curPage,searchContent) => (dispatch, getState) => {
    const views = getState().inventoryConfState.get('views')
    const currentPage = curPage || views.get('currentPage')
    const condition = searchContent === undefined ? views.get('searchContent') : searchContent
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    if (currentCategory.get('name') === Limit.ALL_TAB_NAME_STR) { // 全部
        fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=${condition}`, json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.CHANGE_ACTIVE_INVENTORY_CONF_HIGH_TYPE,
                    name: currentCategory.get('name'),
                    uuid: currentCategory.get('uuid'),
                    cardList: json.data.resultList,
                    enableWarehouse:json.data.enableWarehouse,
                    treeList: [],
                    currentPage,
                    pageCount:json.data.pages,
                    condition
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    } else {
        fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=${currentCategory.get('uuid')}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=${condition}`, cardList => {
            if (showMessage(cardList)) {
                fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${currentCategory.get('uuid')}`, tree => {
                    if (showMessage(tree)) {
                        dispatch({
                            type: ActionTypes.CHANGE_ACTIVE_INVENTORY_CONF_HIGH_TYPE,
                            name: currentCategory.get('name'),
                            uuid: currentCategory.get('uuid'),
                            cardList: cardList.data.resultList,
                            treeList: tree.data.resultList,
                            enableWarehouse:tree.data.enableWarehouse,
                            setDefault: true, // 预置类别树高亮
                            currentPage,
                            pageCount:cardList.data.pages,
                            condition
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            }
        })
    }
}

// 启用禁用类别
export const modifyInventoryCardUsedStatus = (uuid,value) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('modifyInventorySettingCardUsedStatus', 'POST', JSON.stringify({
        psiData:{
            "uuid":uuid,
            "used":value
        },
    }), json => {
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CHANGE_INVENTORY_CONF_CARD_USED_STATUS,
                list: json.data.resultList,
                uuid: uuid,
                used: value,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 启用禁用组装
export const modifyInventoryAssemblyStatus = (uuid,value,callBack) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`modifyInventoryAssembly${value?'Open':'Close'}`, 'GET',  `productUuid=${uuid}`, json => {
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CHANGE_INVENTORY_CONF_ASSEMBLY_STATUS,
                uuid: uuid,
                used: value,
            })
            callBack && callBack()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// checkedBox
export const changeInventoryCardBoxStatus = (status, uuid) => dispatch => {
    dispatch({
        type: ActionTypes.CHANGE_INVENTORY_CONF_CARD_BOX_STATUS,
        status: status,
        uuid: uuid
    })
}

// 全选
export const selectCardAll = (value) => dispatch =>{
    dispatch({
        type: ActionTypes.SELECT_INVENTORY_CONF_CARD_ALL,
        value: value,
    })
}

// 右边树形选择切换
export const getInventoryCardListByType = (parentUuid, uuid, name,curPage,searchContent) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const views = getState().inventoryConfState.get('views')
    const condition = searchContent === undefined ? views.get('searchContent') : searchContent
    const currentPage = curPage || views.get('currentPage')
    fetchApi(`getInventorySettingCardListByType`, 'GET', `ctgyUuid=${parentUuid}&&subordinateUuid=${uuid}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=${condition}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.SELECT_INVENTORY_CONF_CARD_BY_TYPE,
                list: json.data.resultList,
                uuid: uuid,
                name: name,
                currentPage,
                pageCount:json.data.pages,
                condition
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// ###################

// 新增大类别之前
export const beforeEditInventoryHighType = (showModal) => (dispatch,getState) => {

    const inventoryConfState = getState().inventoryConfState
    const activeTapKey = inventoryConfState.getIn(['views', 'activeTapKey'])
    const activeTapKeyUuid = inventoryConfState.getIn(['views', 'activeTapKeyUuid'])
    const originTags = inventoryConfState.get('originTags')

    let uuid = ""
    let name = ""
    if (originTags.size != 1) {
        // 设置默认添加的类别
        if (activeTapKey === Limit.ALL_TAB_NAME_STR) {
            uuid = originTags.getIn([1, 'uuid'])
            name = originTags.getIn([1, 'name'])
        } else {
            uuid = activeTapKeyUuid
            name = activeTapKey
        }
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getOneInventorySettingHighType`, 'GET', `uuid=${uuid}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.BEFORE_EDIT_INVENETORY_HIGH_TYPE,
                receivedData: json.data,
                activeName: name,
                activeUuid: uuid
            })
            showModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
// 在存货管理编辑框里切换
export const changeInventoryModalActiveHighType = (v) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getOneInventorySettingHighType`, 'GET', `uuid=${v.get('uuid')}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.BEFORE_EDIT_INVENETORY_HIGH_TYPE,
                receivedData: json.data,
                activeName: v.get('name'),
                activeUuid: v.get('uuid'),
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 点击新增大类别
export const beforeAddInventoryHighType = () => ({
    type:ActionTypes.BEFORE_INSERT_INVENTORY_CONF_HGIH_TYPE,
})

// 修改大类别字段
export const changeInventoryHighTypeContent = (name, value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONF_HIGH_TYPE_CONTENT,
		name,
        value
	})
}

// 保存大类别
export const saveInventoryHighType = () => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const psiData = getState().inventoryConfState.get('inventoryHighTypeTemp')
    const insertOrModify = psiData.get('uuid') ? 'modify' : 'insert'
    fetchApi('insertInventoryHighType', 'POST', JSON.stringify({
        psiData
    }), json => {
		if (showMessage(json, 'show')) {
            if(json.code === 0){
                dispatch({
                    type: ActionTypes.AFTER_SAVE_INVENTORYSETTING_CONTENT,
                    title: json.data,
                    insertOrModify
                })
            }
		}
	})
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
}

// 删除大类别
export const deleteInventoryHighType = (deleteModal) => (dispatch,getState) => {
    const inventoryConfState = getState().inventoryConfState
    const uuid = inventoryConfState.getIn(['views', 'activeInventoryTypeUuid'])
    const activeTapKeyUuid = inventoryConfState.getIn(['views', 'activeTapKeyUuid'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteInventorySettingHighType', 'POST', JSON.stringify({
        ctgyUuid: uuid
    }), json => {
		if (showMessage(json, 'show')) {
            if (uuid == activeTapKeyUuid) {  // 删除的是当前的类别
                fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=`, cardList => {
                    if (showMessage(json)) {
                        dispatch({
                            type: ActionTypes.DELETE_CURRENT_INVENTORY_CONF_HGIH_TYPE,
                            title: json.data.resultList,
                            name: Limit.ALL_TAB_NAME_STR,
                            uuid: '',
                            cardList: cardList.data.resultList,
                            treeList: []
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            } else {
                dispatch({
                    type: ActionTypes.DELETE_INVENTORY_CONF_HGIH_TYPE,
                    title: json.data.resultList,
                })
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            }
		} else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		}
        // 关闭
        deleteModal()
	})
}

// export const getInventoryHighTypeList = () => dispatch => {
//     fetchApi(`getInventoryHighTypeList`, 'GET', '', titleList => {
//         if (showMessage(titleList)) {
//             dispatch({
//                 type:ActionTypes.GET_INVENTORY_CONF_HIGH_TYPE_LIST,
//                 title:titleList.data,
//             })
//         }
//     })
// }

// ################

// 小类别
// 点小齿轮
export const beforeAddInventoryCardType = () => dispatch => {
    dispatch({
        type: ActionTypes.BEFORE_ADD_INVENTORY_CONF_CARD_TYPE,
    })
}

// 点新增
export const beforeInsertAddInventoryCardType = () => dispatch => {
    dispatch({
        type:ActionTypes.BEFORE_INSERT_INVENTORY_CONF_CARD_TYPE,
    })
}

// 修改名称字段
export const changeInventoryCardTypeContent = (name, value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_INVENTORY_CONF_CARD_TYPE_CONTENT,
		name,
        value
	})
}

// 上级类别修改
export const changeInventoryCardTypeSelect = (value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
    const parentName = valueList[1]
    const parentUuid = valueList[0]

	dispatch({
		type: ActionTypes.SELECT_INVENTORY_CONF_CARD_TYPE,
		parentName,
        parentUuid
	})
}

// 新增或保存
export const saveInventoryCardType = (btnFlag, showConfirmModal, closeConfirmModal) => (dispatch,getState) => {

    const psiData = getState().inventoryConfState.get('inventoryCardTypeTemp').toJS()
    psiData.ctgyUuid = getState().inventoryConfState.getIn(['views', 'activeTapKeyUuid'])
    const save = () => {
        fetchApi('addInventorySettingCardType', 'POST', JSON.stringify({
            psiData:psiData
        }), json => {
            if (showMessage(json, 'show')) {
                dispatch({
                    type: ActionTypes.SAVE_INVENTORY_CONF_CARD_TYPE,
                    typeTree: json.data.resultList,
                    uuid: psiData.uuid,
                    btnFlag,
                    typeInfo: json.data.info
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
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
                // confirm({
                //    title: '名称重复',
                //    content: '卡片类别名称与已有卡片类别名称重复，确定保存吗？',
                //    onOk() {
                //      save()
                //      closeConfirmModal()
                //    },
                //    onCancel() {
                //        closeConfirmModal()
                //    }
                // });
            } else {
                save()
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

// 点击切换高亮类别
export const getInventoryTypeInfo = (uuid) => (dispatch, getState) => {

    const allUuid = getState().inventoryConfState.getIn(['typeTree', '0', 'uuid'])
    const isAll = allUuid === uuid ? true : false
    if (isAll) {
        dispatch({
            type: ActionTypes.GET_INVENTORY_CONF_TYPE_CONTENT,
            uuid: uuid,
            data: {},
            isAll: isAll
        })
    } else {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi(`getInventorySettingOneCardType`, 'GET', `uuid=${uuid}`, typeInfo => {
            if (showMessage(typeInfo)) {
                dispatch({
                    type: ActionTypes.GET_INVENTORY_CONF_TYPE_CONTENT,
                    uuid: uuid,
                    data: typeInfo.data,
                    isAll: isAll
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

// 删除选中
export const changeInventoryCardTypeBoxChecked = (list) => dispatch => {
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_CONF_CARD_TYPE_BOX_STATUS,
        list
    })
}
// 删除前
export const deleteInventoryType = () => (dispatch, getState) => {
    dispatch({
        type:ActionTypes.INVENTORY_CONF_TYPE_DELETE_BTN_SHOW,
    })
}

// 删除
export const confirmDeleteInventoryType = () => (dispatch, getState) => {

    const typeTreeSelectList = getState().inventoryConfState.getIn(['views', 'typeTreeSelectList'])
    if (typeTreeSelectList.size === 0) {
        message.info('请选择要删除的类别')
        return
    }

    const activeTapKeyUuid = getState().inventoryConfState.getIn(['views', 'activeTapKeyUuid'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteInventorySettingOneCardType', 'POST', JSON.stringify({
        ctgyUuid: activeTapKeyUuid,
        deleteList: typeTreeSelectList
    }), json => {
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CONFIRM_DELETE_INVENTORY_CONF_TYPE,
                data: json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 上移
export const inventoryUpType = () => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const selectedSubordinateUuid = getState().inventoryConfState.getIn(['inventorySettingBtnStatus', 'treeUuid'])
    const swappedSubordinateUuid = getState().inventoryConfState.getIn(['inventorySettingBtnStatus', 'upUuid'])
    const categoryUuid = getState().inventoryConfState.getIn(['views', 'activeTapKeyUuid'])

    fetchApi('swapInventorySettingTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_INVENTORY_CONF_TYPE_POSITION,
                list:json.data.resultList
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 下移
export const inventoryDownType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const selectedSubordinateUuid = getState().inventoryConfState.getIn(['inventorySettingBtnStatus','treeUuid'])
    const swappedSubordinateUuid = getState().inventoryConfState.getIn(['inventorySettingBtnStatus','downUuid'])
    const categoryUuid = getState().inventoryConfState.getIn(['views', 'activeTapKeyUuid'])

    fetchApi('swapInventorySettingTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_INVENTORY_CONF_TYPE_POSITION,
                list: json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 调整
export const adjustInventoryCardTyepList = (name, uuid, adjustModal) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    let cardSelectList = getState().inventoryConfState.getIn(['views', 'cardSelectList']).toJS()
    cardSelectList.map((item, index) => {
        item.subordinateName = name
    })
    const subordinateUuid = uuid
    const adjustFrom = getState().inventoryConfState.getIn(['views', 'activeTapKeyUuid'])
    const treeFrom = getState().inventoryConfState.getIn(['views', 'activeTreeKeyUuid'])

    fetchApi('adjustInventorySettingCardTypeList', 'POST', JSON.stringify({
        cardList: cardSelectList,
        subordinateUuid,
        adjustFrom,
        treeFrom
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.ADJUST_INVENTORY_CONF_CARD_TYPE_LIST,
                list:json.data.resultList
            })
            adjustModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 新增 和 删除 的取消
export const cancelDeleteOrAddInventoryType = () => (dispatch,getState) => {
    const isAdd = getState().inventoryConfState.getIn(['inventorySettingBtnStatus', 'isAdd'])
    if (isAdd) {
        const treeUuid = getState().inventoryConfState.getIn(['inventorySettingBtnStatus', 'treeUuid'])
        const allUuid = getState().inventoryConfState.getIn(['typeTree', 0, 'uuid'])
        if (treeUuid === allUuid) {
            dispatch({
                type:ActionTypes.CANCLE_INVENTORY_CONF_TYPE_BTN,
                data: {}
            })
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi(`getInventorySettingOneCardType`, 'GET', `uuid=${treeUuid}`, typeInfo => {
                if (showMessage(typeInfo)) {
                    dispatch({
                        type:ActionTypes.CANCLE_INVENTORY_CONF_TYPE_BTN,
                        data: typeInfo.data
                    })
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }
    } else {
        dispatch({
            type: ActionTypes.CANCLE_INVENTORY_CONF_TYPE_BTN,
            data: {}
        })
    }
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
            if (json.data) {
                // dispatch 3个 认真的吗
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
                                } else {
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
                        }, 500)
                    }
                }
                loop(1)
            }
        } else {
            dispatch(closeVcImportContent())
        }
	})
}
export const getFileUploadInitialFetch = (form) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('chUploadInitial', 'UPLOAD', form, json => {
		// dispatch(afterWlImport(json))
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            if (json.data) {
                // dispatch 3个 认真的吗
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
                            fetchApi(`chImportInitial`, 'POST', JSON.stringify({
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
                                        fetchApi(`chImportErrorInitial`, 'GET', 'importKey='+json.data.importKey+'&needDownload=false', errorJson => {
                                            dispatch(afterChImport(errorJson))
                                        })
                                    }
                                } else {
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
                        }, 500)
                    }
                }
                loop(1)
            }
        } else {
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

export const exportToNotification = (value, url) => (dispatch) => {
    fetchApi(url, 'GET', '', json => {
        showMessage(json, 'show')
    })
}
// export const exportToNotification = () => (dispatch) => {
//     fetchApi('chExport', 'GET', '', json => {
//         showMessage(json, 'show')
//     })
// }

// 导入结束

export const switchWarehouse = (opened) => (dispatch,getState) => {
    if (opened) {
        thirdParty.Confirm({
            message: '“仓库管理”启用后不允许勾除，请谨慎操作。',
            title: "提示",
            buttonLabels: ['取消', '确定'],
            onSuccess : (result) => {
                if (result.buttonIndex === 1) {
                    const views = getState().inventoryConfState.get('views')
                    const activeTapKey = views.get('activeTapKey')
                    const activeTapKeyUuid = views.get('activeTapKeyUuid')
                    const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    fetchApi(`enableWarehouse`, 'GET', '', json => {
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        if (showMessage(json)) {
                            message.info('启用仓库成功！')
                            dispatch(refreshInventoryList(currentItem))
                            dispatch(warehouseConfigActions.getWarehouseTree())
                            dispatch(homeActions.getDbListFetch())
                        }
                    })
                }
            }
        })
    } else {
        fetchApi(`disableWarehouse`, 'GET', `needCheck=true`, json => {
            if (showMessage(json)) {
                if (json.data.canDisable) {
                    thirdParty.Confirm({
                        message: '关闭仓库管理，将同步删除仓库。确定删除并关闭吗？',
                        title: "提示",
                        buttonLabels: ['取消', '确定'],
                        onSuccess : (result) => {
                            if (result.buttonIndex === 1) {
                                const views = getState().inventoryConfState.get('views')
                                const activeTapKey = views.get('activeTapKey')
                                const activeTapKeyUuid = views.get('activeTapKeyUuid')
                                const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
                                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                fetchApi(`disableWarehouse`, 'GET', 'needCheck=false', json => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if (showMessage(json)) {
                                        message.info('关闭仓库成功！')
                                        dispatch(refreshInventoryList(currentItem))
                                        dispatch(homeActions.getDbListFetch())
                                    }
                                })
                            }
                        }
                    })
                } else {
                    thirdParty.Confirm({
                        message: '关闭仓库失败！有历史存货流水或存货期初值关联仓库。',
                        title: "提示",
                        buttonLabels: ['取消', '确定'],
                        onSuccess:() => {}
                    })
                }
            }
        })
    }
}
export const adjustAllRelativeCardList=(openAdjustAllCardListModal)=>dispatch=>{
    openAdjustAllCardListModal()
}

export const adjustInventoryCardList =(object,closeModal)=>dispatch=>{
    fetchApi(`relativeInventoryTags`, 'POST', JSON.stringify(object), resp => {
        if (showMessage(resp)) {
            closeModal()
            dispatch(getInventoryConfigInit())
        }
    })

}


export const adjustCategoryOrder=(object)=>dispatch=>{
    fetchApi("adjustCategoryOrder","POST",JSON.stringify(object),resp=>{
        if(showMessage(resp)){
            let resultList=[{name: "全部", uuid: ""}].concat(resp.data.resultList)
            dispatch({
                type:ActionTypes.ADJUST_CATEGORY_ORDER_INVENTORY,
                payload:resultList
            })
        }
    })
}

export const changeViews = (name,value) => ({
        type: ActionTypes.CHANGE_CH_IMPORT_NUM,
        name: name,
        value: value
})
// 修改存货卡片前
export const beforeCloseMaterial = (item) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getInventorySettingOneCard`, 'GET', `uuid=${item.get('uuid')}`, card => {
        if (showMessage(card)) {
            if (card.data.assemblySheet && card.data.assemblySheet.materialList) {
                dispatch(changeViews('materialModal',true))
                dispatch(changeViews('activeUuid',item.get('uuid')))
            } else {
                dispatch(modifyInventoryAssemblyStatus(item.get('uuid'), false))

            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

export const getRegretCategoryTree = (currentCategory,currentPage=1,cb) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (!currentCategory.get('parentUuid')) {
        fetchApi("getInventorySettingCardList",'GET', `listFrom=${currentCategory.get('uuid')}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}`,json => {
            if(showMessage(json)){
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            dispatch({
                type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                name:'cardList',
                value:fromJS(json.data.resultList)
            })
            dispatch({
                type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                name:'regretPages',
                value:json.data.pages
            })
            cb && cb()
            }
        })
        if (currentCategory.get('uuid')) {
            fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${currentCategory.get('uuid')}`, json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.CHANGE_CH_IMPORT_NUM,
                        name:'cardTypeList',
                        value: fromJS(json.data.resultList),
                    })
                }
            })
        }
    } else {
        fetchApi(`getInventorySettingCardListByType`, 'GET', `ctgyUuid=${currentCategory.get('parentUuid')}&&subordinateUuid=${currentCategory.get('uuid')}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}`, json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if(showMessage(json)){
            dispatch({
                type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                name:'cardList',
                value:fromJS(json.data.resultList)
            })
            dispatch({
                type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                name:'regretPages',
                value:json.data.pages
            })
            cb && cb()
            }
        })
    }

}
export const regretCode = (cardList) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi("regretCode","POST",JSON.stringify({
        regretType: "CODE_INVENTORY",
        cardList:cardList.map(v => ({cardUuid:v.uuid,newCode:v.newCode})),
        action: 'MANAGER-STOCK_SETTING-REGRET_MODEL',
        }),json=>{
        if (showMessage(json)) {
            const key = json.data.key
            if (key) {
                const startTime = new Date()
                const timer = setInterval(() => {
                    fetchApi("regretResult",'GET', `key=${json.data.key}`,json => {
                        if (showMessage(json)) {
                            const resultTime = new Date()
                            if (json.data.index == cardList.length && json.data.regretCardDto && json.data.regretCardDto.cardList.length == cardList.length) {
                                clearInterval(timer)
                                dispatch({
                                    type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                                    name:'regretResultList',
                                    value:fromJS(json.data.regretCardDto.cardList)
                                })
                                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            } else if (json.data.index == cardList.length && !json.data.regretCardDto && resultTime - startTime > 30*1000) {
                                clearInterval(timer)
                                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                message.info('系统出错，请重试')
                            }
                            dispatch({
                                type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                                name:'regretResultIndex',
                                value:json.data.index
                            })
                            dispatch({
                                type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                                name:'regretResultKey',
                                value:key
                            })
                        } else {
                            clearInterval(timer)
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        }
                    })
                    }, 500)

            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })

}
// export const downloadResult = (key) => dispatch => {
//     fetchApi("downloadRegretCode","GET",`key=${key}&needResult=true`,json=>{
//             download(json)
//         })
// }
export const downloadBefore = (cardList) => dispatch => {
    fetchApi("regretCardConfirm","POST",JSON.stringify({
        cardList:cardList.map(v => ({
            cardUuid:v.uuid,
            cardName:v.name,
            oldCode:v.code,
            newCode:v.newCode,
            }))
        }),json=>{
            if (showMessage(json)) {
                dispatch({
                    type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                    name:'regretResultKey',
                    value:json.data.key
                })
                const btn = document.getElementsByClassName('regret-download-click')[0]
                setTimeout(() => btn.click(),100)
            }
        })
}
export const checkUsed = (cardList) => dispatch => {
    fetchApi("checkCardUsed","POST",JSON.stringify({
        "cardUuidList": cardList.map(v => v.uuid),
        "cardType": "CARD4PERSON"
        }),json=>{
            dispatch({
                type:ActionTypes.CHANGE_CH_IMPORT_NUM,
                name:'usedCardList',
                value:(fromJS(json.data.usedCard))
            })
        })
}
