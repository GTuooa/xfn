import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import { message }	from 'antd'
import * as thirdParty from 'app/thirdParty'
import * as allActions from 'app/redux/Home/All/all.action'

// 进入辅助核算页，以及修改类别时获取辅助核算列表
export const changeActiveAssCategory = (category, asslist) => ({
	type: ActionTypes.CHANGE_ACTIVE_ASS_CATEGORY,
	category,
	asslist
})

export const changeFzModalDisplay = (ass) => ({
	type: ActionTypes.CHANGE_FZ_MODAL_DISPLAY,
	ass
})

export const changeAclistModalDisplay = (aclist) => ({
	type: ActionTypes.CHANGE_ACLIST_MODAL_DISPLAY,
	aclist
})


export const modifyAclistInAssItem = (idx, aclist) => ({
	type: ActionTypes.MODIFY_ACLIST_IN_ASS_ITEM,
	idx,
	aclist
})

export const deleteAcInAssItem = (acid) => ({
	type: ActionTypes.DELETE_AC_IN_ASS_ITEM,
	acid
})
// export const addRelatedAc = (acid, aclist) => ({
// 	type: ActionTypes.ADD_RELATED_AC,
// 	acid,
// 	aclist
// })
export const changeAcInAssTabKey = (key) => ({
	type: ActionTypes.CHANGE_AC_IN_ASS_TAB_KEY,
	key
})

export const selectAssAll = () => ({
	type: ActionTypes.SELECT_ASS_ALL
})

export const selectAssItem = (assid) => ({
	type: ActionTypes.SELECT_ASS_ITEM,
	assid
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

export const getFileUploadFetch = (form,openModal) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('assImport', 'UPLOAD', form, json => {
		if(showMessage(json)){
			dispatch(afterAssImport(json))
			openModal()
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			const loop = function (accessToken) {
				const time = setTimeout(() => {
					let showMessageMask = getState().fzhsState.get('assshowMessageMask')
					fetchApi('acImportProgress', 'GET', `accessToken=${accessToken}`, json => {
						if(showMessage(json)){
							dispatch({
								type:ActionTypes.GET_ASS_IMPORT_PROGRESS,
								receivedData:json
							})
							if ((json.data.progress >= 100) && (json.data.successList.length > 0)) {
								dispatch(allActions.getAssListFetch())
							}

							if(showMessageMask && json.data.progress < 100){
								loop(accessToken)
							}
						}
					})
					clearTimeout(time)
				},500)
			}
			loop(json.data.accessToken)
		}else{
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		}
	})
}

export const beforeAssImport = () => ({
	type: ActionTypes.BEFORE_ASS_IMPORT
})

export const afterAssImport = (receivedData) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_ASS_IMPORT,
		receivedData
	})

	// if (receivedData.data && receivedData.data.successJsonList.length) {
	// 	dispatch(allActions.getAssListFetch())
	// } else {
	// 	return
	// }
}

export const closeAssImportContent = () => ({
	type: ActionTypes.CLOSE_ASS_IMPORT_CONTENT
})

export const getAssGetAMB = () => dispatch => {
    fetchApi('assgetAMB', 'GET', '', json => {
        if (showMessage(json)) {
			dispatch({
				type: ActionTypes.AFTER_ASSGETAMB_GET,
				receivedData: json.data
			})
        }
    })
}

export const getAssrelateAMB = (assCategoryList, successCallback) => dispatch => {

	thirdParty.Confirm({
		message: `确定开通辅助核算类别[${assCategoryList.get(0)}]为默认阿米巴？`,
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				fetchApi('assrelateAMB', 'POST', JSON.stringify({
					assCategoryList
				}), json => {
					if (showMessage(json, 'show')) {
                        successCallback()
                    }
				})
			}
		},
		onFail : (err) => alert(err)
	})

    // fetchApi('assrelateAMB', 'POST', JSON.stringify({
	// 	assCategoryList
	// }), json => {
    //     if (showMessage(json)) {
	// 		successCallback()
    //     }
    // })
}

export const changeAMBRelateAssCategroyList = (assCategory) => ({
	type: ActionTypes.CHANGE_AMB_RELATE_ASSCATEGROY_LIST,
	assCategory
})

//启用、禁用
export const changeAssDisableState = (value) => ({
	type: ActionTypes.CHANGE_ASS_DISABLE_STATE,
	value
})

//反悔模式
export const changeReversAssModal = (bool) => ({
	type: ActionTypes.CHANGE_REVERS_ASS_MODAL,
	bool
})

export const changeReversCategory = (category) => ({
	type: ActionTypes.CHANGE_REVERS_CATEGORY,
	category
})

export const clearReversAss = () => ({
	type: ActionTypes.CLEAR_REVERS_ASS,
})


export const selectReversAssCheck = (assCategory, assId, assName ) => dispatch => {

	fetchApi('assCheck', 'POST', JSON.stringify({
		assCategory: assCategory,
		assId: assId,
		assName: assName,
	}), json => {
		if (showMessage(json)) {
			if (!json.data.message.length) {
				return thirdParty.Alert(assId + '不需要使用反悔模式')
			}
			dispatch({
				type: ActionTypes.SELECT_REVERS_ASS_CHECK,
				assId,
				assName,
				assMessage: json.data.message
			})
		}
	})
}

export const changeReversAssId = (newAssId) => ({
	type: ActionTypes.CHANGE_REVERS_ASS_ID,
	newAssId
})

export const changeReversAssConfirmShow = (bool) => ({
	type: ActionTypes.CHANGE_REVERSASS_CONFIRM_SHOW,
	bool
})

export const reversAssFetch = (reversAss ) => dispatch => {

	fetchApi('assRegret', 'POST', JSON.stringify({
		assCategory: reversAss.get('assCategory'),
		oldAssId: reversAss.get('oldAssId'),
		assId: reversAss.get('assId'),
		assName: reversAss.get('assName'),
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.REVERS_ASS_FETCH
			})
		}
	})
}

//分页
export const changeCurrentPage = (assList, value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_CURRENT_PAGE_FZHE,
		assList,
		value
	})
}

export const changeMessageMask = () => ({
	type: ActionTypes.CHANGE_ASS_MESSAGEMASK,
})

export const changeReverseOldName=(value)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.CHANGE_REVERSE_OLD_NAME,
		value
	})
}
export const changeReverseNewName = (value) =>(dispatch)=>{[
	dispatch({
		type:ActionTypes.CHANGE_REVERSE_NEW_NAME,
		value
	})
]}
export const changeAssCategoryName =(oldName,newName,ass,confirmModifyAnyWay="false")=>(dispatch,getState)=>{
	fetchApi('changeAssCategoryName', 'POST', JSON.stringify({
		oldName,
		newName,
		confirmModifyAnyWay
	}),resp=>{
		if(showMessage(resp)) {
			if(resp.data.countMoreThenRestrict){//修改不成功
				dispatch({
					type:ActionTypes.CHANGE_ASS_CATEGORY_MODAL_VISIBLE,
					visible:true
				})
			}else{
				dispatch({
					type:ActionTypes.CHANGE_ASS_CATEGORY_MODAL_VISIBLE,
					visible:false
				})
				dispatch({type: ActionTypes.REVERS_ASS_FETCH})
				dispatch(allActions.getAcListFetch())
				dispatch(allActions.getAssListFetch())
				dispatch({
					type:ActionTypes.CHANGE_REVERSE_NEW_NAME,
					value:''
				})
				dispatch({
					type:ActionTypes.CHANGE_REVERSE_OLD_NAME,
					value:''
				})
				dispatch(changeActiveAssCategory(newName, ass))
			}
		}
	})
}
export const changeAssCategoryModalVisible=(visible)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.CHANGE_ASS_CATEGORY_MODAL_VISIBLE,
		visible
	})
}
