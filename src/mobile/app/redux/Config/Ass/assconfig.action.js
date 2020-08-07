import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getAssGetAMB = () => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('assgetAMB', 'GET', '', json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.AFTER_ASSGETAMB_GET,
				receivedData: json.data
			})
        }
    })
}

export const getAssrelateAMB = (assCategoryList, history) => dispatch => {

	thirdParty.Confirm({
		message: `确定开通辅助核算类别[${assCategoryList.get(0)}]为默认阿米巴？`,
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
				fetchApi('assrelateAMB', 'POST', JSON.stringify({
					assCategoryList
				}), json => {
					if (showMessage(json, 'show')) {
                        history.goBack()
                    }
				})
			}
		},
		onFail : (err) => alert(err)
	})

    // fetchApi('assrelateAMB', 'POST', JSON.stringify({
	// 	assCategoryList
	// }), json => {
    //     // if (showMessage(json)) {
    //     //
    //     // }
    // })
}

export const setAssrelateAMB = (asscategory) => ({
	type: ActionTypes.SET_ASSRELATE_AMB,
	asscategory
})

export const changeAssId = (assid) => ({
	type: ActionTypes.CHANGE_ASS_ID,
	assid
})

export const changeAssName = (assname) => ({
	type: ActionTypes.CHANGE_ASS_NAME,
	assname
})

export const changeAssCategory = (asscategory) => ({
	type: ActionTypes.CHANGE_ASS_CATEGORY,
	asscategory
})


export const changeTabIndexAssConfig = (idx) => ({
	type: ActionTypes.CHANGE_TAB_INDEX_ASSCONFIG,
	idx
})



export const changeTabIndexAcAssconfig = (idx) => ({
	type: ActionTypes.CHANGE_TAB_INDEX_AC_ASSCONFIG,
	idx
})

// export const beforeModifyAss = (ass, idx) => ({
// 	type: ActionTypes.BEFORE_MODIFY_ASS,
// 	ass,
// 	idx
// })
export const beforeModifyAss = (ass, idx) => ({
	type: ActionTypes.BEFORE_MODIFY_ASS,
	ass,
    idx
})

export const beforeInsertAss = (tab) => ({
	type: ActionTypes.BEFORE_INSERT_ASS,
	tab
})

export const showAllAssCheckBox = () => ({
	type: ActionTypes.SHOW_ALL_ASS_CHECKBOX
})

export const hideAllAssCheckBox = () => ({
	type: ActionTypes.HIDE_ALL_ASS_CHECKBOX
})

export const changeAssDisableState = () => ({
    type: ActionTypes.CHANGE_ASS_DISABLE_STATE
})

//反悔
export const changeReversAssCategory = (assCategory) => ({
    type: ActionTypes.CHANGE_REVERS_ASS_CATEGORY,
    assCategory
})

export const checkReversAssIdFetch = (assCategory, assId, assName) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('assCheck', 'POST', JSON.stringify({
		assCategory: assCategory,
		assId: assId,
		assName: assName
	}), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
			if (!json.data.message.length) {
                return showMessage('', '', '', assId + '不需要使用反悔模式')
			}
			dispatch({
				type: ActionTypes.CHECK_REVERS_ASS_ID_CHECK,
				assId,
				assName,
				assMessage: json.data.message
			})
		}
	})
}
export const changeReversNewAssId = (newAssId) => ({
    type: ActionTypes.CHANGE_REVERS_NEW_ASS_ID,
    newAssId
})
export const showReversConfirmModal = (bool) => ({
    type: ActionTypes.SHOW_REVERS_CONFIR_MODAL,
    bool
})

export const reversAssFetch = (reversAss, history) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('assRegret', 'POST', JSON.stringify({
		assCategory: reversAss.get('assCategory'),
		oldAssId: reversAss.get('oldAssId'),
		assId: reversAss.get('assId'),
		assName: reversAss.get('assName'),
	}), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch(showReversConfirmModal(false))
            history.goBack()
		}
	})
}
export const changeAssConfigShowType=()=>(dispatch)=>{
    dispatch({
        type: ActionTypes.CHANGE_ASS_CONFIG_SHOW_TYPE,
    })
}
export const changeAssConfigOldName=(value)=>(dispatch)=>{
    dispatch({
        type: ActionTypes.SET_ASS_CONFIG_OLD_NAME,
        value
    })
}
export const changeAssConfigNewName=(value)=>(dispatch)=>{
    dispatch({
        type: ActionTypes.SET_ASS_CONFIG_NEW_NAME,
        value
    })
}
export const changeAssTypeConfirmModalVisible =(visible)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE,
        visible
    })
}
export const changeAssTypeName=(oldName,newName,history,confirmModifyAnyWay="false")=>(dispatch)=>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('changeAssName', 'POST', JSON.stringify({
        oldName,
        newName,
        confirmModifyAnyWay
    }),resp=>{
        if (showMessage(resp)) {
            if(resp.data.countMoreThenRestrict){//修改不成功
                dispatch({
                    type:ActionTypes.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE,
                    visible:true
                })
            }else{
                dispatch({
                    type:ActionTypes.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE,
                    visible:false
                })
                dispatch({type: ActionTypes.CHANGE_ASS_CONFIG_SHOW_TYPE,})
                dispatch({type: ActionTypes.SET_ASS_CONFIG_OLD_NAME,value:''})
                dispatch({type:ActionTypes.SET_ASS_CONFIG_NEW_NAME,value:''})
                thirdParty.toast.hide()
                dispatch(showReversConfirmModal(false))
                history.goBack()
            }
        }
    })
}
