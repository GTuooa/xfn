import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import {fromJS,toJS} from 'immutable'
import {message,Modal} from 'antd'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action'

const confirm = Modal.confirm;

const getTitleList = (dispatch,isDeleteBtn) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageListTitle`, 'GET', '', titleList => {
        if (showMessage(titleList)) {
            dispatch({
                type:ActionTypes.GET_IUMANAGE_LIST_TITLE,
                title:titleList.data,
                deleteBtn:isDeleteBtn
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

//改变往来关系管理内容
export const changeIUMangeContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_IUMANAGE_CONTENT,
		name,
        value
	})
}

export const changeIUMangeContentAc = (typeId,typeName,acid,acName) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_IUMANAGE_CONTENT_AC,
		acid,
        acName,
        typeId,
        typeName,
	})
}

export const getIUManageCard = (value,showModal) => dispatch =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageTypeContent`, 'GET', `ctgyUuid=${value.get('uuid')}`, cardInfo => {
        if (showMessage(cardInfo)) {
            dispatch({
                type:ActionTypes.GET_IUMANAGE_CARD,
                value:value,
                data:cardInfo.data
            })
            if(showModal){
                showModal()
            }
        }

        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const beforeAddNewManageType = () => dispatch => {
	dispatch({
		type: ActionTypes.BEFORE_ADD_NEW_MANAGE_TYPE,
	})
}

export const beforeAddNewManageTypeType = (showModal) => dispatch =>{
    dispatch({
		type: ActionTypes.BEFORE_ADD_NEW_MANAGE_TYPE_TYPE,
	})

    showModal();
}

export const saveIUMangeContent = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().iuConfigState.get('iuManageCard').toJS()
    fetchApi('saveIUManageHighType', 'POST', JSON.stringify({
        psiData:psiData
    }), json => {
		if (showMessage(json)) {
            if(json.code === 0){
                message.info('保存成功')
            }
            getTitleList(dispatch)
		}
	})
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
}

export const getIUmanageListTitle = () => dispatch =>{
    getTitleList(dispatch)
}

export const getIUmanageListAndTree = (value) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const name = value.get('categoryName')
    const uuid = value.get('uuid')
    const anotherTabName = getState().iuConfigState.get('anotherTabName')

    if(name === anotherTabName){
        fetchApi(`getIUmanageListAll`, 'GET', 'listFrom=', list => {
            if (showMessage(list)) {
                dispatch({
                    type:ActionTypes.GET_IUMANAGE_LIST_BY_TYPE,
                    list:list.data.resultList,
                    name:name,
                    tree:[{uuid:''}],
                    uuid:''
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })

    }else{
        fetchApi('getIUmanageListAll', 'GET', `listFrom=${uuid}`, list => {
            if (showMessage(list)) {
                fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${uuid}`, json => {
                    if (showMessage(json)) {
                        dispatch({
                            type:ActionTypes.GET_IUMANAGE_LIST_BY_TYPE,
                            list:list.data.resultList,
                            name:name,
                            tree:json.data.resultList,
                            uuid:uuid,
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        })

    }
}

export const changeIUManageTypeBoxChecked = (list) => dispatch =>{
    dispatch({
        type:ActionTypes.CHANGE_IUMANAGE_TYPE_BOX_CHECKED,
        list
    })
}

export const cancelIUManageType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const isAdd = getState().iuConfigState.getIn(['iuManageTypeBtnStatus','isAdd'])
    if(isAdd){
        const treeUuid = getState().iuConfigState.getIn(['iuManageTypeBtnStatus','treeUuid'])
        const allUuid = getState().iuConfigState.getIn(['treeList',0,'uuid'])
        if(treeUuid === allUuid){
            dispatch({
                type:ActionTypes.CANCLE_IUMANAGE_TYPE_BTN,
                data:{}
            })
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }else{
            fetchApi(`getIUManagetTreeSingleType`, 'GET', `uuid=${treeUuid}`, typeInfo => {
                if (showMessage(typeInfo)) {
                    dispatch({
                        type:ActionTypes.CANCLE_IUMANAGE_TYPE_BTN,
                        data:typeInfo.data
                    })
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        }
    }else{
        dispatch({
            type:ActionTypes.CANCLE_IUMANAGE_TYPE_BTN,
            data:{}
        })
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    }
}

export const getIUManageTypeInfo = (uuid) => (dispatch,getState) =>{

    const allUuid = getState().iuConfigState.getIn(['treeList','0','uuid'])
    const isAll = allUuid === uuid ? true : false
    if(isAll){
        dispatch({
            type:ActionTypes.GET_IUMANAGE_TYPE_CONTENT,
            uuid:uuid,
            data:{},
            isAll:isAll
        })
    }else{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi(`getIUManagetTreeSingleType`, 'GET', `uuid=${uuid}`, typeInfo => {
            if (showMessage(typeInfo)) {
                dispatch({
                    type:ActionTypes.GET_IUMANAGE_TYPE_CONTENT,
                    uuid:uuid,
                    data:typeInfo.data,
                    isAll:isAll
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

export const upIUManageType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const selectedSubordinateUuid = getState().iuConfigState.getIn(['iuManageTypeBtnStatus','treeUuid'])
    const swappedSubordinateUuid = getState().iuConfigState.getIn(['iuManageTypeBtnStatus','upUuid'])
    const categoryUuid = getState().iuConfigState.get('activeTapKeyUuid')

    fetchApi('swapIUmanageTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_IUMANAGE_TYPE_POSITION,
                list:json.data.resultList
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const downIUManageType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const selectedSubordinateUuid = getState().iuConfigState.getIn(['iuManageTypeBtnStatus','treeUuid'])
    const swappedSubordinateUuid = getState().iuConfigState.getIn(['iuManageTypeBtnStatus','downUuid'])
    const categoryUuid = getState().iuConfigState.get('activeTapKeyUuid')

    fetchApi('swapIUmanageTypePosition', 'POST', JSON.stringify({
        psiData:{
            selectedSubordinateUuid,
            swappedSubordinateUuid,
            categoryUuid
        }
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_IUMANAGE_TYPE_POSITION,
                list:json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const adjustCardTyepList = (name,uuid,adjustModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    let cardList = getState().iuConfigState.get('iuManageSelectList').toJS()
    cardList.map((item,index) =>{
        item.subordinateName = name
    })
    const subordinateUuid = uuid
    const adjustFrom = getState().iuConfigState.get('activeTapKeyUuid')
    const treeFrom = getState().iuConfigState.get('sonUuid')

    fetchApi('adjustIUmanageCardTypeList', 'POST', JSON.stringify({
        cardList,
        subordinateUuid,
        adjustFrom,
        treeFrom
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.ADJUST_IUMANAGE_CARD_TYPE_LIST,
                list:json.data.resultList
            })
            adjustModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeIUMangeTypeContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_IUMANAGE_TYPE_CONTENT,
		name,
        value
	})
}

export const changeIUMangeTypeSelect = (value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
    const parentName = valueList[1]
    const parentUuid = valueList[0]

	dispatch({
		type: ActionTypes.CHANGE_IUMANAGE_TYPE_SELECT,
		parentName,
        parentUuid
	})
}

export const saveIUManageType = (btnFlag,showConfirmModal,closeConfirmModal) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    let psiData = getState().iuConfigState.get('iuManageType')
    const activeTapKeyUuid = getState().iuConfigState.get('activeTapKeyUuid')
    const name = getState().iuConfigState.get('activeTapKey')
    psiData = psiData.set('currentUnitCtgyUuid',activeTapKeyUuid)

    const saveType = () => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('saveIUManageType', 'POST', JSON.stringify({
            psiData:psiData
        }), json => {
            if (showMessage(json)) {
                fetchApi('getIUmanageListAll', 'GET', `listFrom=${activeTapKeyUuid}`, list => {
                    if (showMessage(list)) {
                        dispatch({
                            type:ActionTypes.SAVE_IUMANAGE_TYPE,
                            list:list.data.resultList,
                            name:name,
                            tree:json.data.resultList,
                            activeTapKeyUuid:activeTapKeyUuid,
                            btnFlag:btnFlag,
                            uuid:psiData.get('uuid'),
                            typeInfo:json.data.info
                        })
                        message.info('保存成功')
                    }
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
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
                    showConfirmModal()
                    confirm({
                       title: '名称重复',
                       content: '卡片类别名称与已有卡片类别名称重复，确定保存吗？',
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

export const insertIUManageType = () => dispatch =>{
    dispatch({
        type:ActionTypes.INSERT_IUMANAGE_TYPE,
    })
}

// export const editIUManageType = () => dispatch =>{
//
// }
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

// 导入结束

export const beforeAddManageTypeCard = (showModal) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.BEFORE_ADD_MANAGE_TYPE_CARD,
                data:json.data
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
    showModal()
}

export const getUndefineCard = (showModal) => dispatch => {
    fetchApi(`getIUManageUndefienCard`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.GET_IUMANAGE_UNDEFINE_CARD,
                data:json.data
            })
        }
    })
    showModal()
}

export const changeIUMangeCardContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_IUMANAGE_CARD_CONTENT,
		name,
        value
	})
}

export const changeManageCardRelation = (item,value) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${item.get('uuid')}`, json => {    
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_MANAGE_CARD_RELATION,
                tag:item,
                checked:value,
                tree:json.data.resultList,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeManageCardRelationType = (item,value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
	dispatch({
		type: ActionTypes.CHANGE_MANAGE_CARD_RELATION_TYPE,
		tag:item,
        uuid:valueList[0],
        name:valueList[1],
	})
}

export const changeIUMangeCardAc = (value,acId,acName) => dispatch =>{
    const valueList = value.split(' ');
    dispatch({
		type: ActionTypes.CHANGE_IUMANAGE_CARD_AC,
        uuid:valueList[0],
        name:valueList[1],
        acId,
        acName,
	})
}

export const changeUndefineCardAc = (value,acId,acName) => dispatch =>{
    const valueList = value.split(' ');
    dispatch({
		type: ActionTypes.CHANGE_IUMANAGE_UNDEFINE_CARD_AC,
        uuid:valueList[0],
        name:valueList[1],
        acId,
        acName,
	})
}

export const saveUndefineCard = (closeModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().iuConfigState.get('undefineCard').toJS()
    fetchApi('editIUManageUndefienCard', 'POST', JSON.stringify({
        psiData:psiData,
    }), json => {
        if (showMessage(json)) {
            message.info('保存成功')
            closeModal()
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const saveIUManageTypeCard = (closeModal,flag,showConfirmModal,closeConfirmModal) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().iuConfigState.get('iuManageTypeCard').toJS()
    const insertOrModify = getState().iuConfigState.getIn(['iuManageTypeCard','insertOrModify'])
    const activeTapKey = getState().iuConfigState.get('activeTapKey')
    const activeTapKeyUuid = getState().iuConfigState.get('activeTapKeyUuid')
    const anotherTabName = getState().iuConfigState.get('anotherTabName')
    const sonUuid = getState().iuConfigState.get('sonUuid')
    // const insertUrl = activeTapKey === anotherTabName ? 'saveIUManageCard' :'saveIUManageDefineCard'
    // const editUrl = activeTapKey === '往来单位' ? 'editIUManageCard' :'editIUManageDefineCard'
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
    const contactsRange = cardTemp.getIn([categoryTypeObj,'contactsRange'])
    const runningState = cardTemp.get('runningState')
    const saveContent = () =>{
        if(insertOrModify === 'insert'){
            fetchApi('saveIUManageCard', 'POST', JSON.stringify({
                psiData:psiData,
                insertFrom:activeTapKeyUuid,
                treeFrom:sonUuid,
                needAutoIncrementCode:flag === 'insert' ? false : true
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.SAVE_IUMANAGE_TYPE_CARD,
                        list:json.data.resultList,
                        treeList:json.data.typeList,
                        flag:flag,
                        code:json.data.autoIncrementCode
                    })
                    if(flag === 'insert'){
                        closeModal()
                    }else{
                        message.info('保存成功')
                    }
                    contactsRange && contactsRange.size && dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,runningState))

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
                        type: ActionTypes.SAVE_IUMANAGE_TYPE_CARD,
                        list:json.data.resultList,
                        treeList:json.data.typeList,
                    })
                    closeModal()
                    contactsRange && contactsRange.size && dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,runningState))
                }
            })
        }
    }

    fetchApi('adjustIUmanageCardTitleSame', 'POST', JSON.stringify({
        psiData:{name:psiData.name,uuid:psiData.uuid}
    }), json => {
        if (showMessage(json)) {
            if(json.data.repeat){
                showConfirmModal()
                confirm({
                   title: '名称重复',
                   content: '卡片名称与已有卡片名称重复，确定保存吗？',
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

export const getOneCardEdit = (uuid,showModal) => (dispatch) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
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
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
}

export const deleteIUManageHighType = (uuid,deleteModal) => (dispatch) =>{
    fetchApi('deleteIUManageHighType', 'POST', JSON.stringify({
        currentUnitCtgyUuid:uuid
    }), json => {
        if (showMessage(json)) {
            message.info('删除成功')
            getTitleList(dispatch,true)
            deleteModal()
        }
    })
}

export const deleteIUManageType = () => (dispatch,getState) =>{
    dispatch({
        type:ActionTypes.IUMANGE_TYPE_DELETE_BTN_SHOW,
    })
}

export const confirmDeleteIUManageType = () => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const iuTreeSelectList = getState().iuConfigState.get('iuTreeSelectList')
    const activeTapKeyUuid = getState().iuConfigState.get('activeTapKeyUuid')
    fetchApi('deleteIUManageTreeList', 'POST', JSON.stringify({
        currentUnitCtgyUuid:activeTapKeyUuid,
        deleteList:iuTreeSelectList
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CONFIRM_DELETE_IUMANAGE_TYPE,
                data:json.data.resultList,
            })
            message.info('删除成功')
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const deleteIUManageListCard = () =>(dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const iuManageSelectList = getState().iuConfigState.get('iuManageSelectList').toJS()
    if(iuManageSelectList.length === 0){
        message.info('请选择需要删除的卡片')
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        return ;
    }
    const activeTapKey = getState().iuConfigState.get('activeTapKey')
    const activeTapKeyUuid = getState().iuConfigState.get('activeTapKeyUuid')
    const treeFrom = getState().iuConfigState.get('sonUuid')
    const anotherTabName = getState().iuConfigState.get('anotherTabName')

    fetchApi('deleteIUManageListCard', 'POST', JSON.stringify({
        deleteList:iuManageSelectList,
        deleteFrom:activeTapKeyUuid,
        treeFrom
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.DELETE_IUMANAGE_LIST_CARD,
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

export const checkIUManageListCardBox = (checked,uuid) => (dispatch) =>{
    dispatch({
        type : ActionTypes.CHECK_IUMANAGE_LIST_CARD_BOX,
        checked:checked,
        uuid:uuid,
    })
}

export const selectIUManageCardAll = (selectAll) => dispatch =>{
    dispatch({
        type:ActionTypes.SELECT_IUMANAGE_CARD_ALL,
        selectAll
    })
}

export const getIUmanageListBySontype = (uuid,sonUuid,sonName) => dispatch =>{
    fetchApi(`getIUmanageListBySontype`, 'GET', `categoryUuid=${uuid}&subordinateUuid=${sonUuid}`, list => {
        if (showMessage(list)) {
            dispatch({
                type:ActionTypes.GET_IUMANAGE_LIST_BY_SON_TYPE,
                data:list.data.resultList,
                sonUuid:sonUuid,
                sonName:sonName,
            })
        }

    })
}

export const switchCardStatus = (value,item) => dispatch =>{
    let psiData = item.toJS()
    psiData.used = value
    fetchApi('switchCardStatus', 'POST', JSON.stringify({
        psiData:psiData,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.SWITCH_CARD_STATUS,
                uuid:psiData.uuid,
                used:value,
            })
            message.info('改变状态成功')
        }
    })
}

export const exportToNotification = () => (dispatch) => {

    fetchApi('wlExport', 'GET', '', json => {
        showMessage(json, 'show')
    })
}
