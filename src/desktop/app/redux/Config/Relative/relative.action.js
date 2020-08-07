import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { fromJS, toJS } from 'immutable'
import { message, Modal } from 'antd'
const confirm = Modal.confirm;

// 首次获取往来设置
export const getRelativeConfInit = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUmanageListAll`, 'GET', `listFrom=&currentPage=${1}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=`, cardList => {
        if (showMessage(cardList)) {
            fetchApi(`getIUManageListTitle`, 'GET', '', titleList => {
                if (showMessage(titleList)) {
                    dispatch({
                        type: ActionTypes.GET_RELATIVE_CONF_INIT,
                        title: titleList.data,
                        cardList: cardList.data.resultList,
                        currentPage:1,
                        pageCount:cardList.data.pages,
                        condition:''
                    })
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

// 切换往来设置类别
export const changeRelativeActiveHighType = (currentCategory) => (dispatch, getState) => {
    dispatch(getCardListAndTree(currentCategory))
}
// 刷新
export const refreshRelativeConfList = (currentCategory,curPage=1,searchContent='') => (dispatch,getState) => {
    dispatch(getCardListAndTree(currentCategory,curPage,searchContent))
}

const getCardListAndTree = (currentCategory,curPage=1,searchContent) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const name = currentCategory.get('name')
    const uuid = currentCategory.get('uuid')
    const views = getState().relativeConfState.get('views')
    const currentPage = curPage || views.get('currentPage')
    const condition = searchContent === undefined ? views.get('searchContent') : searchContent

    if (name === Limit.ALL_TAB_NAME_STR) { // 全部
        fetchApi(`getIUmanageListAll`, 'GET', `listFrom=&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=${condition}`, json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.CHANGE_ACTIVE_RELATIVE_CONF_HIGH_TYPE,
                    name,
                    uuid,
                    cardList: json.data.resultList,
                    treeList: [],
                    currentPage,
                    pageCount:json.data.pages,
                    condition
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    } else {
        fetchApi(`getIUmanageListAll`, 'GET', `listFrom=${currentCategory.get('uuid')}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=${condition}`, cardList => {
            if (showMessage(cardList)) {
                fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${currentCategory.get('uuid')}`, tree => {
                    if (showMessage(tree)) {
                        dispatch({
                            type: ActionTypes.CHANGE_ACTIVE_RELATIVE_CONF_HIGH_TYPE,
                            name,
                            uuid,
                            cardList: cardList.data.resultList,
                            treeList: tree.data.resultList,
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
export const modifyRelativeCardUsedStatus = (uuid,value) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('switchCardStatus', 'POST', JSON.stringify({
        psiData:{
            uuid: uuid,
            used: value
        },
    }), json => {
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CHANGE_RELATIVE_CARD_USED_STATUS,
                uuid: uuid,
                used: value,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// checkedBox
export const changeRelativeCardBoxStatus = (status, uuid) => dispatch => {
    dispatch({
        type: ActionTypes.CHANGE_RELATIVE_CARD_BOX_STATUS,
        status: status,
        uuid: uuid
    })
}

// 全选
export const selectRelativeCardAll = (value) => dispatch =>{
    dispatch({
        type: ActionTypes.SELECT_RELATIVE_CARD_ALL,
        value: value,
    })
}

// 右边树形选择切换
export const getRelativeCardListByType = (parentUuid, uuid, name,curPage,searchContent) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const views = getState().relativeConfState.get('views')
    const condition = searchContent === undefined ? views.get('searchContent') : searchContent
    const currentPage = curPage || views.get('currentPage')
    fetchApi(`getIUmanageListBySontype`, 'GET', `ctgyUuid=${parentUuid}&&subordinateUuid=${uuid}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=${condition}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.SELECT_RELATIVE_CARD_BY_TYPE,
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
export const beforeEditRelativeHighType = (showModal) => (dispatch,getState) => {

    const relativeConfState = getState().relativeConfState
    const activeTapKey = relativeConfState.getIn(['views', 'activeTapKey'])
    const activeTapKeyUuid = relativeConfState.getIn(['views', 'activeTapKeyUuid'])
    const originTags = relativeConfState.get('originTags')

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
    fetchApi(`getIUManageTypeContent`, 'GET', `uuid=${uuid}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.BEFORE_EDIT_RELATIVE_HIGH_TYPE,
                receivedData: json.data,
                activeName: name,
                activeUuid: uuid
            })
            showModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
// 在往来管理编辑框里切换
export const changeRelativeHighTypeActiveHighType = (v) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageTypeContent`, 'GET', `uuid=${v.get('uuid')}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.BEFORE_EDIT_RELATIVE_HIGH_TYPE,
                receivedData: json.data,
                activeName: v.get('name'),
                activeUuid: v.get('uuid'),
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 点击新增大类别
export const beforeAddRelativeHighType = () => ({
    type:ActionTypes.BEFORE_INSERT_RELATIVE_HGIH_TYPE,
})

// 修改大类别字段
export const changeRelativeHighTypeContent = (name, value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_RELATIVE_HIGH_TYPE_CONTENT,
		name,
        value
	})
}

// 保存大类别
export const saveRelativeHighType = () => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const psiData = getState().relativeConfState.get('relativeHighTypeTemp')
    const insertOrModify = psiData.get('uuid') ? 'modify' : 'insert'
    fetchApi('saveIUManageHighType', 'POST', JSON.stringify({
        psiData
    }), json => {
		if (showMessage(json, 'show')) {
            if (json.code === 0) {
                dispatch({
                    type: ActionTypes.AFTER_SAVE_RELATIVE_HIGH_TYPE,
                    title: json.data,
                    insertOrModify
                })
            }
		}
	})
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
}

// 删除大类别
export const deleteRelativeHighType = (deleteModal) => (dispatch, getState) => {
    const relativeConfState = getState().relativeConfState
    const uuid = relativeConfState.getIn(['views', 'activeRelativeTypeUuid'])
    const activeTapKeyUuid = relativeConfState.getIn(['views', 'activeTapKeyUuid'])
    const views = getState().relativeConfState.get('views')
    const condition = views.get('searchContent')
    const currentPage = views.get('currentPage')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteIUManageHighType', 'POST', JSON.stringify({
        ctgyUuid: uuid
    }), json => {
		if (showMessage(json, 'show')) {
            if (uuid == activeTapKeyUuid) {  // 删除的是当前的类别
                fetchApi(`getIUmanageListAll`, 'GET', `listFrom=&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=${condition}`, cardList => {
                    if (showMessage(json)) {
                        dispatch({
                            type: ActionTypes.DELETE_CURRENT_RELATIVE_HGIH_TYPE,
                            title: json.data.resultList,
                            name: Limit.ALL_TAB_NAME_STR,
                            uuid: '',
                            cardList: cardList.data.resultList,
                            treeList: [],
                            currentPage,
                            pageCount:json.data.pages,
                            condition
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            } else {
                dispatch({
                    type: ActionTypes.DELETE_RELATIVE_HGIH_TYPE,
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

// ################

// 小类别
// 点小齿轮
export const beginAddProjectType = () => dispatch => {
    dispatch({
        type: ActionTypes.BEFORE_ADD_RELATIVE_CARD_TYPE,
    })
}

// 点新增
export const beforeInsertAddRelativeConfType = () => dispatch => {
    dispatch({
        type:ActionTypes.BEFORE_INSERT_RELATIVE_CARD_TYPE,
    })
}

// 修改名称字段
export const changeRelativeTypeContent = (name, value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_RELATIVE_TYPE_CONTENT,
		name,
        value
	})
}

// 上级类别修改
export const changeRelativeTypeSelect = (value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
    const parentName = valueList[1]
    const parentUuid = valueList[0]

	dispatch({
		type: ActionTypes.SELECT_RELATIVE_TYPE_PARENT,
		parentName,
        parentUuid
	})
}

// 新增或保存
export const saveRelativeType = (btnFlag, showConfirmModal, closeConfirmModal) => (dispatch,getState) => {

    const psiData = getState().relativeConfState.get('relativeTypeTemp').toJS()
    // 后端改
    // psiData.ctgyUuid = getState().relativeConfState.getIn(['views', 'activeTapKeyUuid'])
    psiData.currentUnitCtgyUuid = getState().relativeConfState.getIn(['views', 'activeTapKeyUuid'])

    const save = () => {
        fetchApi('saveIUManageType', 'POST', JSON.stringify({
            psiData:psiData
        }), json => {
            if (showMessage(json, 'show')) {
                dispatch({
                    type: ActionTypes.SAVE_RELATIVE_CARD_TYPE,
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
    fetchApi('adjustIUmanageTypeTitleSame', 'POST', JSON.stringify({
        psiData:{
            parentUuid: psiData.parentUuid,
            name: psiData.name,
            uuid: psiData.uuid
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
export const getRelativeTypeInfo = (uuid) => (dispatch, getState) => {

    const allUuid = getState().relativeConfState.getIn(['typeTree', '0', 'uuid'])
    const isAll = allUuid === uuid ? true : false
    if (isAll) {
        dispatch({
            type: ActionTypes.GET_RELATIVE_TYPE_CONTENT,
            uuid: uuid,
            data: {},
            isAll: isAll
        })
    } else {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi(`getIUManagetTreeSingleType`, 'GET', `uuid=${uuid}`, typeInfo => {
            if (showMessage(typeInfo)) {
                dispatch({
                    type: ActionTypes.GET_RELATIVE_TYPE_CONTENT,
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
export const changeRelativeTypeBoxChecked = (list) => dispatch => {
    dispatch({
        type:ActionTypes.CHANGE_RELATIVE_TYPE_BOX_STATUS,
        list
    })
}
// 删除前
export const beforeDeleteRelativeType = () => (dispatch, getState) => {
    dispatch({
        type:ActionTypes.RELATIVE_TYPE_DELETE_BTN_SHOW,
    })
}

// 删除
export const confirmDeleteRelativeType = () => (dispatch, getState) => {

    const typeTreeSelectList = getState().relativeConfState.getIn(['views', 'typeTreeSelectList'])
    if (typeTreeSelectList.size === 0) {
        message.info('请选择要删除的类别')
        return
    }

    const activeTapKeyUuid = getState().relativeConfState.getIn(['views', 'activeTapKeyUuid'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteIUManageTreeList', 'POST', JSON.stringify({
        currentUnitCtgyUuid: activeTapKeyUuid,
        // ctgyUuid: activeTapKeyUuid, 后端改
        deleteList: typeTreeSelectList
    }), json => {
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CONFIRM_DELETE_RELATIVE_TYPE,
                data: json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 上移
export const relativeUpType = () => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const selectedSubordinateUuid = getState().relativeConfState.getIn(['relativeTypeBtnStatus', 'treeUuid'])
    const swappedSubordinateUuid = getState().relativeConfState.getIn(['relativeTypeBtnStatus', 'upUuid'])
    const categoryUuid = getState().relativeConfState.getIn(['views', 'activeTapKeyUuid'])

    fetchApi('swapIUmanageTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_RELATIVE_TYPE_POSITION,
                list:json.data.resultList
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 下移
export const RelativeDownType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const selectedSubordinateUuid = getState().relativeConfState.getIn(['relativeTypeBtnStatus','treeUuid'])
    const swappedSubordinateUuid = getState().relativeConfState.getIn(['relativeTypeBtnStatus','downUuid'])
    const categoryUuid = getState().relativeConfState.getIn(['views', 'activeTapKeyUuid'])

    fetchApi('swapIUmanageTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_RELATIVE_TYPE_POSITION,
                list: json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 调整
export const adjustRelativeCardTyepList = (name, uuid, adjustModal) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    let cardSelectList = getState().relativeConfState.getIn(['views', 'cardSelectList']).toJS()
    cardSelectList.map((item, index) => {
        item.subordinateName = name
    })
    const subordinateUuid = uuid
    const adjustFrom = getState().relativeConfState.getIn(['views', 'activeTapKeyUuid'])
    const treeFrom = getState().relativeConfState.getIn(['views', 'activeTreeKeyUuid'])

    fetchApi('adjustIUmanageCardTypeList', 'POST', JSON.stringify({
        cardList: cardSelectList,
        subordinateUuid,
        adjustFrom,
        treeFrom
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.ADJUST_RELATIVE_CONF_CARD_TYPE_LIST,
                list:json.data.resultList
            })
            adjustModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 新增 和 删除 的取消
export const cancelRelativeTypeInsertOrDelete = () => (dispatch,getState) => {
    const isAdd = getState().relativeConfState.getIn(['relativeTypeBtnStatus', 'isAdd'])
    if (isAdd) {
        const treeUuid = getState().relativeConfState.getIn(['relativeTypeBtnStatus', 'treeUuid'])
        const allUuid = getState().relativeConfState.getIn(['typeTree', 0, 'uuid'])
        if (treeUuid === allUuid) {
            dispatch({
                type:ActionTypes.CANCLE_RELATIVE_TYPE_BTN,
                data: {}
            })
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi(`getIUManagetTreeSingleType`, 'GET', `uuid=${treeUuid}`, typeInfo => {
                if (showMessage(typeInfo)) {
                    dispatch({
                        type:ActionTypes.CANCLE_RELATIVE_TYPE_BTN,
                        data: typeInfo.data
                    })
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }
    } else {
        dispatch({
            type: ActionTypes.CANCLE_RELATIVE_TYPE_BTN,
            data: {}
        })
    }
}

// 导入
export const beforeWLImport = () => ({
	type: ActionTypes.BEFORE_WL_IMPORT
})
export const closeVcImportContent = () => ({
	type: ActionTypes.CLOSE_WL_IMPORT_CONTENT
})
export const getFileUploadFetch = (form) => dispatch => {
	fetchApi('wlUpload', 'UPLOAD', form, json => {
		// dispatch(afterWlImport(json))
        if (showMessage(json)) {
            if(json.data){
                dispatch({
                    type: ActionTypes.CHANGE_WL_IMPORT_NUM,
                    name: 'totalNumber',
                    value: json.data.pages
                })
                dispatch({
                    type: ActionTypes.CHANGE_WL_IMPORT_NUM,
                    name: 'importKey',
                    value: json.data.importKey
                })
                dispatch({
                    type: ActionTypes.CHANGE_WL_IMPORT_STATUS,
                    value: true
                })
                const loop = (data) => {
                    if(data <= json.data.pages){
                        setTimeout(() => {
                            fetchApi(`wlImport`, 'POST', JSON.stringify({
                                importKey: json.data.importKey,
                                current: data
                            }), importJson => {
                                if (showMessage(importJson)) {
                                    if(data < json.data.pages){
                                        loop(data+1)
                                    }else{
                                        dispatch({
                                            type: ActionTypes.CHANGE_WL_IMPORT_STATUS,
                                            value: false
                                        })
                                        fetchApi(`wlImportError`, 'GET', 'importKey='+json.data.importKey+'&needDownload=false', errorJson => {
                                            dispatch(afterWlImport(errorJson))
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
                                type: ActionTypes.CHANGE_WL_IMPORT_NUM,
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
export const afterWlImport = (receivedData) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_WL_IMPORT,
		receivedData
	})


}

export const exportToNotification = () => (dispatch) => {

    fetchApi('wlExport', 'GET', '', json => {
        showMessage(json, 'show')
    })
}
// 导入结束

export const adjustCardListFetch=(object,closeModal)=>dispatch=>{
    fetchApi(`relativeOriginTags`, 'POST', JSON.stringify(object), resp => {
        if (showMessage(resp)) {
            closeModal()
            dispatch(getRelativeConfInit())
        }
    })
}

export const adjustCategoryOrder=(object)=>dispatch=>{
    fetchApi("adjustCategoryOrder","POST",JSON.stringify(object),resp=>{
        if(showMessage(resp)){
            let resultList=[{name: "全部", uuid: ""}].concat(resp.data.resultList)
            dispatch({
                type:ActionTypes.ADJUST_CATEGORY_ORDER_RELATIVE,
                payload:resultList
            })
        }
    })
}
export const getRegretCategoryTree = (currentCategory,currentPage=1,cb) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (!currentCategory.get('parentUuid')) {
        fetchApi("getIUmanageListAll",'GET', `listFrom=${currentCategory.get('uuid')}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}`,json => {
            if(showMessage(json)){
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            dispatch({
                type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
                name:'cardList',
                value:fromJS(json.data.resultList)
            })
            dispatch({
                type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
                name:'regretPages',
                value:json.data.pages
            })
            cb && cb()
            }
        })
        if (currentCategory.get('uuid')) {
            fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${currentCategory.get('uuid')}`, json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
                        name:'cardTypeList',
                        value: fromJS(json.data.resultList),
                    })
                }
            })
        }
    } else {
        fetchApi(`getIUmanageListBySontype`, 'GET', `ctgyUuid=${currentCategory.get('parentUuid')}&&subordinateUuid=${currentCategory.get('uuid')}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}`, json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if(showMessage(json)){
            dispatch({
                type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
                name:'cardList',
                value:fromJS(json.data.resultList)
            })
            dispatch({
                type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
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
        regretType: "CODE_CURRENT",
        cardList: cardList.map(v => ({cardUuid:v.uuid,newCode:v.newCode})),
        action: 'MANAGER-CONTACT_SETTING-REGRET_MODEL'
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
                                    type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
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
                                type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
                                name:'regretResultIndex',
                                value:json.data.index
                            })
                            dispatch({
                                type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
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
                    type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
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
                type:ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT,
                name:'usedCardList',
                value:(fromJS(json.data.usedCard))
            })
        })
}
