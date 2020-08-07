import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { fromJS } from 'immutable'
import { message, Modal } from 'antd'
const confirm = Modal.confirm;
// 新增预置
export const beforeInsertWarehouseConfig = () => (dispatch) => {

}
export const getWarehouseTree = (first) => (dispatch) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`warehouseCardTree`, 'POST',JSON.stringify({
        uuidList:[]
        }), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_WAREHOUSE_TREE,
                cardList:json.data.cardList,
                first
            })
		}
	})

}

export const saveWarehouseConfAccount = (saveAndNew, close) => (dispatch,getState) => {
    const insertCardTemp = getState().warehouseConfigState.get('insertCardTemp').toJS()
    const name = insertCardTemp.name
    const uuid = insertCardTemp.uuid
    const insertOrModify = getState().warehouseConfigState.getIn(['views','insertOrModify'])
    if (insertOrModify == 'insert') {
        insertCardTemp.action = 'MANAGER-WAREHOUSE_SETTING-CUD_CARD'  
    }
    fetchApi(`repeatWarehouseCardName`, 'POST',JSON.stringify({
        name,
        uuid: insertOrModify === 'modify' ? uuid : '',
        }), json => {
        if (showMessage(json)) {
            if (json.data.codeList.length) {
                thirdParty.Confirm({
                    message: `卡片名称与【编码：${json.data.codeList[0]}】卡片重复，确定保存吗？`,
                    title: '名称重复',
                    buttonLabels: ['取消', '确定'],
                    onSuccess: (result) => {
                        if(result.buttonIndex === 1){
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            fetchApi(`${insertOrModify}WarehouseCard`, 'POST',JSON.stringify({
                                    ...insertCardTemp,
                                }), json => {
                                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                if (showMessage(json)) {
                                    if (!saveAndNew) {
                                        close()
                                    } else {
                                        dispatch(beforeInsertWarehouseCard())
                                    }
                                    dispatch(clearInsertModal(saveAndNew))
                                    dispatch(getWarehouseTree())

                                }
                            })
                        }
                    }
                })
            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                fetchApi(`${insertOrModify}WarehouseCard`, 'POST',JSON.stringify({
                        ...insertCardTemp
                    }), json => {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    if (showMessage(json,'show')) {
                        if (!saveAndNew) {
                            close()
                        } else {
                            dispatch(beforeInsertWarehouseCard())
                        }
                        dispatch(clearInsertModal(saveAndNew))
                        dispatch(getWarehouseTree())

                    }
                })
            }
        }
    })


}


export const getWarehouseCard = (item)  => (dispatch,getState) => {
    const uuid = item.get('uuid')
    fetchApi(`getWarehouseCard`, 'GET','uuid='+uuid, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_WAREHOUSE_CARD,
                data:json.data
                })
        }
    })
}

export const clearInsertModal = (saveAndNew) => ({
        type: ActionTypes.AFTER_INSERT_WAREHOUSE_CARD,
        saveAndNew
    })
export const accountconfAccountCheckboxCheck = (checked, uuid) => ({
    type: ActionTypes.ACCOUNTCONF_ACCOUNT_CHECKBOX_CHECK,
    checked,
    uuid
})

export const beforeModifyaccountConfRunningOld = (item) => ({
    type: ActionTypes.BEFORE_MODIFY_ACCOUNTCONF_RUNNING,
    item
})

export const changeWarehouseConfingCommonString = (tab, place, value) =>(dispatch) => {
    let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
    dispatch({
        type: ActionTypes.CHANGE_WAREHOUSECONFIG_COMMON_STRING,
        placeArr,
        value
    })
}

export const changeWarehouseConfingCommonViews = (place, value) =>(dispatch) => {
    let placeArr = typeof place === 'string'?[`views`,place]:[`views`, ...place]
    dispatch({
        type: ActionTypes.CHANGE_WAREHOUSECONFIG_COMMON_STRING,
        placeArr,
        value
    })
}

export const warehouseTraingleSwitch = (showChild,uuid) => ({
    type: ActionTypes.WAREHOUSE_TRIANGLE_SWITCH,
    showChild,
    uuid
})

export const warehouseCheckboxCheck = (item, upperArr,checked) => ({
    type: ActionTypes.WAREHOUSE_CHECKBOX_CHECK,
    item,
    upperArr,
    checked
})

export const enabledCategory = (uuid,canUse) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('modifyWarehouseCardStatus','GET', `uuid=${uuid}&canUse=${canUse}`, json => {
        if (showMessage(json)) {
            const parentUuidList = json.data.parentList || []
            dispatch(changeItemDisableStatus(uuid,!canUse,parentUuidList))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const deleteWarehouseCard = (deleteList) => dispatch => {
    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if(result.buttonIndex === 1){
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                fetchApi('deleteWarehouseCard','POST', JSON.stringify({
                        deleteList
                    }), json => {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    if (showMessage(json)) {
                        const data = json.data
                        if (data.errorChild) {
                            message.info(`删除仓库失败：${data.errorChild}拥有下级仓库；`)
                        } else if (data.errorJr) {
                            message.info(`删除仓库失败：${data.errorJr}已被流水使用`)
                        } else if (data.errorOpen) {
                            message.info(`删除仓库失败：${data.errorOpen}已设置期初值；`)
                        } else {
                            message.info('删除成功！')
                        }
                        dispatch(changeWarehouseConfingCommonViews('selectItem',fromJS([])))
                        dispatch(getWarehouseTree())
                    }
                })
            }
        }
    })
}


export const changeItemDisableStatus = (uuid,disabled,parentUuidList) => (dispatch,getState) => {
    const warehouseConfigState = getState().warehouseConfigState
    const list = warehouseConfigState.getIn(['warehouseTemp','cardList',0,'childList'])
    const disableList = warehouseConfigState.getIn(['warehouseTemp','cardList',0,'disableList'])
    let uuidList = [uuid]
    if (disabled && parentUuidList.length) {
        uuidList = uuidList.concat(parentUuidList)
    }
    const loop = (uuidList, list, placeArr,findMode) => {
        list && list.size && list.find((item, index) => {
            if(uuidList.find(w => w === item.get('uuid'))) {
                dispatch({
                    type:ActionTypes.CHANGE_WAREHOUSE_ITEM_DISABLE_STATUS,
                    placeArr:[...placeArr,index],
                    disabled
                })
                return true
            } else {
                loop(uuidList,item.get('childList'),[...placeArr, index,'childList'],findMode)
                loop(uuidList,item.get('disableList'),[...placeArr, index,'disableList'],findMode)
            }
        })
    }
    loop(uuidList,list,['childList'],true)
    loop(uuidList,disableList,['disableList'],true)
}
export const beforeInsertWarehouseCard = (callback) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getWarehouseDefaultCode','GET', '',json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            callback && callback()
            if (json.data.code) {
                dispatch(changeWarehouseConfingCommonString('insertCard','code',json.data.code))
            }
        }
    })
}
// 导入
export const beforeCkImport = () => ({
	type: ActionTypes.BEFORE_CK_IMPORT
})

export const closeVcImportContent = () => ({
	type: ActionTypes.CLOSE_CK_IMPORT_CONTENT
})

export const afterCkImport = (receivedData) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_CK_IMPORT,
		receivedData
	})


}
export const getFileUploadFetch = (form) => dispatch => {
	fetchApi('ckUpload', 'UPLOAD', form, json => {
		// dispatch(afterWlImport(json))
        if (showMessage(json)) {
            if(json.data){
                dispatch({
                    type: ActionTypes.CHANGE_CK_IMPORT_NUM,
                    name: 'totalNumber',
                    value: json.data.pages
                })
                dispatch({
                    type: ActionTypes.CHANGE_CK_IMPORT_NUM,
                    name: 'importKey',
                    value: json.data.importKey
                })
                dispatch({
                    type: ActionTypes.CHANGE_CK_IMPORT_NUM,
                    name:'wlImportantStatus',
                    value: true
                })
                const loop = (data) => {
                    if(data <= json.data.pages){
                        setTimeout(() => {
                            fetchApi(`ckImport`, 'POST', JSON.stringify({
                                importKey: json.data.importKey,
                                current: data
                            }), importJson => {
                                if (showMessage(importJson)) {
                                    if(data < json.data.pages){
                                        loop(data+1)
                                    }else{
                                        dispatch({
                                            type: ActionTypes.CHANGE_CK_IMPORT_NUM,
                                            name:'wlImportantStatus',
                                            value: false
                                        })
                                        fetchApi(`ckImportError`, 'GET', 'importKey='+json.data.importKey+'&needDownload=false', errorJson => {
                                            dispatch(afterCkImport(errorJson))
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
                                type: ActionTypes.CHANGE_CK_IMPORT_NUM,
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

export const exportToNotification = () => (dispatch) => {

    fetchApi('ckExport', 'GET', '', json => {
        showMessage(json, 'show')
    })
}

// export const deleteWarehouseConfAccount = () =>(dispatch,getState) => {
//     const selectItem = getState().warehouseConfigState.getIn(['views','selectItem'])
//     fetchApi(`warehouseCardTree`, 'GET','', json => {
// }
