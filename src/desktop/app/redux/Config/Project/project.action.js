import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { fromJS, toJS } from 'immutable'
import { message, Modal } from 'antd'
const confirm = Modal.confirm

// 首次获取项目设置
export const getProjectConfigInit = () => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectConfigHighType', 'GET', '', list => {
        if (showMessage(list)) {
            dispatch({
                type: ActionTypes.PROJECT_GET_HTIGH_TYPE,
                list: list.data,
            })
        }
    })

    const listFrom = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])
    const treeFrom = getState().projectConfState.get('treeSelectUuid')
    fetchApi('getProjectListAndTree', 'GET', `listFrom=&currentPage=${1}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=`, list => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(list)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_LIST_AND_TREE,
                cardList: list.data.resultList,
                treeList: list.data.typeList,
                pageCount:list.data.pages,
            })
        }
    })
}

// 切换存货设置类别
export const changeProjectActiveHighType = (value) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const name = value.get('name')
    const uuid = value.get('uuid')

    fetchApi(`getProjectListAndTree`, 'GET', `listFrom=${uuid}&currentPage=${1}&pageSize=${Limit.CONFIG_PAGE_SIZE}&condition=`, list => {
        if (showMessage(list)) {
            dispatch({
                type: ActionTypes.CHANGE_ACTIVE_PROJECT_HIGH_TYPE,
                cardList: list.data.resultList,
                treeList: list.data.typeList,
                name,
                uuid,
                pageCount:list.data.pages,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 刷新
export const refreshProjectList = (currentCategory,currentPage=1,searchContent) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const views = getState().projectConfState.get('views')
    const condition = searchContent === undefined ? views.get('searchContent') : searchContent
    const listFrom = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])
    const treeFrom = getState().projectConfState.getIn(['views', 'selectTypeId'])
    // fetchApi('getProjectListAndTree', 'GET', `listFrom=${listFrom}&treeFrom=${treeFrom}`, list => {
    fetchApi('getProjectListAndTree', 'GET', `listFrom=${listFrom}&condition=${condition}&pageSize=${Limit.CONFIG_PAGE_SIZE}&currentPage=${currentPage}`, list => {

        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(list)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_LIST_AND_TREE,
                cardList: list.data.resultList,
                treeList: list.data.typeList,
                isFresh: true,
                currentPage,
                searchContent,
                pageCount:list.data.pages,
            })
        }
    })
}

// 启用禁用类别
export const modifyProjectCardUsedStatus = (uuid,value) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('changeProjectCardUsedStatus', 'POST', JSON.stringify({
        psiData:{
            "uuid":uuid,
            "used":value
        },
    }), json => {
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CHANGE_PEOJECT_CONF_CARD_USED_STATUS,
                list: json.data.resultList,
                uuid: uuid,
                used: value,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// checkedBox
export const changeProjectCardBoxStatus = (status, uuid) => dispatch => {
    dispatch({
        type: ActionTypes.CHANGE_PEOJECT_CONF_CARD_BOX_STATUS,
        status: status,
        uuid: uuid
    })
}

// 全选
export const selectProjectCardAll = (value) => dispatch =>{
    dispatch({
        type: ActionTypes.SELECT_PEOJECT_CONF_CARD_ALL,
        value: value,
    })
}

// 右边树形选择切换
export const getProjectCardListByType = (parentUuid, uuid, name,currentPage=1,searchContent) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const views = getState().projectConfState.get('views')
    const condition = searchContent === undefined ? views.get('searchContent') : searchContent
    fetchApi(`getProjectCardByType`, 'GET', `ctgyUuid=${parentUuid}&&subordinateUuid=${uuid}&condition=${condition}&pageSize=${Limit.CONFIG_PAGE_SIZE}&currentPage=${currentPage}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.SELECT_PROJECT_CARD_BY_TYPE,
                list: json.data.resultList,
                uuid: uuid,
                name: name,
                parentUuid,
                currentPage,
                searchContent,
                pageCount:json.data.pages,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// ###################
// 大类别
export const getProjectHighTypeOne = (value, showModal) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = value.uuid
    const name = value.name
    fetchApi(`getProjectConfigHighTypeOne`, 'GET', `uuid=${uuid}`, list => {
        if (showMessage(list)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_HIGH_TYPE_ONE,
                data: list.data,
                name: name,
                uuid: uuid,
            })
            showModal && showModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 修改大类别字段
export const changePrejectHighTypeContent = (name, value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_PREJECT_HIGH_TYPE_CONTENT,
		name,
        value
	})
}

// 保存大类别
export const saveProjectHighType = (closeModal) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const projectHighTypeTemp = getState().projectConfState.get('projectHighTypeTemp').toJS()
    let  {
        commonFee,
        beMake,
        beAssist,
        beIndirect,
        beMechanical,
        assistOpen,
        makeOpen,
        indirectOpen,
        mechanicalOpen,
        saveProjectHighType,
    } = projectHighTypeTemp
    let type = {
        '生产项目':{beMake,beAssist,makeOpen,assistOpen},
        '施工项目':{beIndirect,beMechanical,indirectOpen,mechanicalOpen},
        '损益项目':{commonFee}
    }[projectHighTypeTemp.name]
    fetchApi('modifyProjectConfigHighType', 'POST', JSON.stringify({
        psiData:{...type,name:projectHighTypeTemp.name,uuid:projectHighTypeTemp.uuid}
    }), json => {
        if (showMessage(json,'show')) {
            closeModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// ################

// 小类别
// 点小齿轮
export const beforeAddProjectCardType = () => dispatch => {
    dispatch({
        type: ActionTypes.BEFORE_ADD_PROJECT_CONFIG_CARD_TYPE,
    })
}

// 点新增
export const beforeInsertProjectConfCardType = () => dispatch => {
    dispatch({
        type:ActionTypes.BEFORE_INSERT_PROJECT_CONF_CARD_TYPE,
    })
}

// 修改名称字段
export const changeProjectCardTypeContent = (name, value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_PROJECT_CONF_CARD_TYPE_CONTENT,
		name,
        value
	})
}

// 上级类别修改
export const changeProjectCardTypeSelect = (value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
    const parentName = valueList[1]
    const parentUuid = valueList[0]

	dispatch({
		type: ActionTypes.SELECT_PROJECT_CONF_CARD_TYPE,
		parentName,
        parentUuid
	})
}

// 新增或保存
export const saveProjectCardType = (btnFlag, showConfirmModal, closeConfirmModal) => (dispatch,getState) => {

    const psiData = getState().projectConfState.get('projectTypeTemp').toJS()
    psiData.ctgyUuid = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])

    const save = () => {
        fetchApi('insertProjectTreeOne', 'POST', JSON.stringify({
            psiData:psiData
        }), json => {
            if (showMessage(json, 'show')) {
                dispatch({
                    type: ActionTypes.SAVE_PROJECT_CONF_CARD_TYPE,
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
    fetchApi('adjustProjectTypeNameSame', 'POST', JSON.stringify({
        psiData:{
            parentUuid: psiData.parentUuid,
            name: psiData.name,
            uuid: psiData.uuid,
        }
    }), json => {
        if (showMessage(json)) {
            if(json.data.repeat){
                showConfirmModal()

                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                thirdParty.Confirm({
                    message: '卡片类别名称与已有卡片类别名称重复，确定保存吗？',
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

// 点击切换高亮类别
export const switchProjectType = (uuid) => (dispatch, getState) => {

    const allUuid = getState().projectConfState.getIn(['typeTree', '0', 'uuid'])
    const isAll = allUuid === uuid ? true : false
    if (isAll) {
        dispatch({
            type: ActionTypes.GET_PROJECT_CONF_TYPE_CONTENT,
            uuid: uuid,
            data: {},
            isAll: isAll
        })
    } else {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi(`getProjectTreeOne`, 'GET', `uuid=${uuid}`, typeInfo => {
            if (showMessage(typeInfo)) {
                dispatch({
                    type: ActionTypes.GET_PROJECT_CONF_TYPE_CONTENT,
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
export const changeProjectCardTypeBoxChecked = (list) => dispatch => {
    dispatch({
        type:ActionTypes.CHANGE_PROJECT_CONF_CARD_TYPE_BOX_STATUS,
        list
    })
}
// 删除前
export const deleteProjectType = () => (dispatch, getState) => {
    dispatch({
        type:ActionTypes.PROJECT_CONF_TYPE_DELETE_BTN_SHOW,
    })
}

// 删除
export const confirmDeleteProjectType = () => (dispatch, getState) => {

    const typeTreeSelectList = getState().projectConfState.getIn(['views', 'typeTreeSelectList'])
    if (typeTreeSelectList.size === 0) {
        message.info('请选择要删除的类别')
        return
    }

    const activeTapKeyUuid = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteProjectType', 'POST', JSON.stringify({
        ctgyUuid: activeTapKeyUuid,
        deleteList: typeTreeSelectList
    }), json => {
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CONFIRM_DELETE_PROJECT_CONF_TYPE,
                data: json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 上移
export const projectUpType = () => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const selectedSubordinateUuid = getState().projectConfState.getIn(['projectTypeBtnStatus', 'treeUuid'])
    const swappedSubordinateUuid = getState().projectConfState.getIn(['projectTypeBtnStatus', 'upUuid'])
    const categoryUuid = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])

    fetchApi('swapProjectTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_PROJECT_CONF_TYPE_POSITION,
                list:json.data.resultList,
                selectedSubordinateUuid
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 下移
export const projectDownType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const selectedSubordinateUuid = getState().projectConfState.getIn(['projectTypeBtnStatus', 'treeUuid'])
    const swappedSubordinateUuid = getState().projectConfState.getIn(['projectTypeBtnStatus', 'downUuid'])
    const categoryUuid = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])

    fetchApi('swapProjectTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_PROJECT_CONF_TYPE_POSITION,
                list: json.data.resultList,
                selectedSubordinateUuid
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 调整
export const adjustProjectCardTyepList = (name, uuid, adjustModal) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    let cardSelectList = getState().projectConfState.getIn(['views', 'cardSelectList']).toJS()
    cardSelectList.map((item, index) => {
        item.subordinateName = name
    })
    const subordinateUuid = uuid
    const adjustFrom = getState().projectConfState.getIn(['views', 'activeTapKeyUuid'])
    const treeFrom = getState().projectConfState.getIn(['views', 'activeTreeKeyUuid'])

    fetchApi('adjustProjectCardType', 'POST', JSON.stringify({
        cardList: cardSelectList,
        subordinateUuid,
        adjustFrom,
        treeFrom
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.ADJUST_PROJECT_CONF_CARD_TYPE_LIST,
                list:json.data.resultList
            })
            adjustModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 新增 和 删除 的取消
export const cancelInsertOrDeleteProjectType = () => (dispatch,getState) => {
    const isAdd = getState().projectConfState.getIn(['projectTypeBtnStatus', 'isAdd'])
    if (isAdd) {
        const treeUuid = getState().projectConfState.getIn(['projectTypeBtnStatus', 'treeUuid'])
        const allUuid = getState().projectConfState.getIn(['typeTree', 0, 'uuid'])
        if (treeUuid === allUuid) {
            dispatch({
                type:ActionTypes.CANCLE_PROJECT_CONF_TYPE_BTN,
                data: {}
            })
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi(`getProjectTreeOne`, 'GET', `uuid=${treeUuid}`, typeInfo => {
                if (showMessage(typeInfo)) {
                    dispatch({
                        type:ActionTypes.CANCLE_PROJECT_CONF_TYPE_BTN,
                        data: typeInfo.data
                    })
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }
    } else {
        dispatch({
            type: ActionTypes.CANCLE_PROJECT_CONF_TYPE_BTN,
            data: {}
        })
    }
}

// 导入
// export const beforeCHImport = () => ({
// 	type: ActionTypes.BEFORE_CH_IMPORT
// })
// export const closeVcImportContent = () => ({
// 	type: ActionTypes.CLOSE_CH_IMPORT_CONTENT
// })
// export const getFileUploadFetch = (form) => dispatch => {
// 	fetchApi('chUpload', 'UPLOAD', form, json => {
// 		// dispatch(afterWlImport(json))
//         if (showMessage(json)) {
//             if (json.data) {
//                 // dispatch 3个 认真的吗
//                 dispatch({
//                     type: ActionTypes.CHANGE_CH_IMPORT_NUM,
//                     name: 'totalNumber',
//                     value: json.data.pages
//                 })
//                 dispatch({
//                     type: ActionTypes.CHANGE_CH_IMPORT_NUM,
//                     name: 'importKey',
//                     value: json.data.importKey
//                 })
//                 dispatch({
//                     type: ActionTypes.CHANGE_CH_IMPORT_STATUS,
//                     value: true
//                 })
//                 const loop = (data) => {
//                     if(data <= json.data.pages){
//                         setTimeout(() => {
//                             fetchApi(`chImport`, 'POST', JSON.stringify({
//                                 importKey: json.data.importKey,
//                                 current: data
//                             }), importJson => {
//                                 if (showMessage(importJson)) {
//                                     if(data < json.data.pages){
//                                         loop(data+1)
//                                     }else{
//                                         dispatch({
//                                             type: ActionTypes.CHANGE_CH_IMPORT_STATUS,
//                                             value: false
//                                         })
//                                         fetchApi(`chImportError`, 'GET', 'importKey='+json.data.importKey+'&needDownload=false', errorJson => {
//                                             dispatch(afterChImport(errorJson))
//                                         })
//
//                                     }
//                                 } else {
//                                     Modal.error({
//                                         title: '异常提示',
//                                         content: '请求异常，请稍后重试',
//                                       });
//                                     dispatch(closeVcImportContent())
//                                 }
//                             })
//                             dispatch({
//                                 type: ActionTypes.CHANGE_CH_IMPORT_NUM,
//                                 name: 'curNumber',
//                                 value: data
//                             })
//                         }, 500)
//                     }
//                 }
//                 loop(1)
//             }
//         } else {
//             dispatch(closeVcImportContent())
//         }
// 	})
// }
//
// export const afterChImport = (receivedData) => dispatch => {
// 	dispatch({
// 		type: ActionTypes.AFTER_CH_IMPORT,
// 		receivedData
// 	})
// }
//
// export const exportToNotification = () => (dispatch) => {
//     fetchApi('chExport', 'GET', '', json => {
//         showMessage(json, 'show')
//     })
// }
// 导入结束

export const getRegretCategoryTree = (currentCategory,currentPage=1,cb) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (!currentCategory.get('parentUuid')) {
        fetchApi("getProjectListAndTree",'GET', `listFrom=${currentCategory.get('uuid')}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}`,json => {
            if(showMessage(json)){
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            dispatch({
                type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
                name:'cardList',
                value:fromJS(json.data.resultList)
            })
            dispatch({
                type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
                name:'regretPages',
                value:json.data.pages
            })
            dispatch({
                type: ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
                name:'cardTypeList',
                value: fromJS(json.data.typeList),
            })
            cb && cb()
            }
        })
        // if (currentCategory.get('uuid')) {
        //     fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${currentCategory.get('uuid')}`, json => {
        //         if (showMessage(json)) {
        //             dispatch({
        //                 type: ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
        //                 name:'cardTypeList',
        //                 value: fromJS(json.data.resultList),
        //             })
        //         }
        //     })
        // }
    } else {
        fetchApi(`getProjectCardByType`, 'GET', `ctgyUuid=${currentCategory.get('parentUuid')}&&subordinateUuid=${currentCategory.get('uuid')}&currentPage=${currentPage}&pageSize=${Limit.CONFIG_PAGE_SIZE}`, json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if(showMessage(json)){
            dispatch({
                type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
                name:'cardList',
                value:fromJS(json.data.resultList)
            })
            dispatch({
                type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
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
        regretType: "CODE_PROJECT",
        cardList:cardList.map(v => ({cardUuid:v.uuid,newCode:v.newCode})),
        action: 'MANAGER-PROJECT_SETTING-REGRET_MODEL',
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
                                    type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
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
                                type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
                                name:'regretResultIndex',
                                value:json.data.index
                            })
                            dispatch({
                                type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
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
                    type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
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
                type:ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT,
                name:'usedCardList',
                value:(fromJS(json.data.usedCard))
            })
        })
}
