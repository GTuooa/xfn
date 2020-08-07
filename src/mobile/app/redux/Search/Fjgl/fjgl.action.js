import { jsonifyDate, showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

//获取附件的数据
export const getFjListFetch = () => (dispatch,getState) => {
	const state=getState().fjglState;
	const issuedate = state.get('issuedate');
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getFjData', 'POST', JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
		label: state.get('labelValue')==='全部' ? '' : state.get('labelValue')
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_FJGL_DATA,
				receivedData: json.data
			})
		}
		thirdParty.toast.hide()
	})
}

// 删除选中的vclist，接收到删除成功的信息后，过滤出没被勾选的item来显示
export const deleteFjItemFetch = () => (dispatch,getState) => {
	dispatch({type:ActionTypes.GET_DELETE_DATA})
	const state = getState().fjglState;
	const issuedate = state.get('issuedate');
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('deleteFj', 'POST', JSON.stringify({
		year: issuedate.substr(0, 4),
		month: issuedate.substr(5, 2),
		enclosureList:state.get('needDeleteUrl'),
		vcIndexArray:state.get('vcIndexArray')
	}), json => {
		if (showMessage(json)){
			dispatch(getFjListFetch())
		}
		thirdParty.toast.hide()
	})
}

// 单个选择框被点击中后，将当前项的checkboxDisplay设为true，并判断所有的checkboxDisplay是否为true，箬是将selectall设为true，并让所有的附件都为选中或没选中的状态
export const selectFjVcItem = idx => ({
	type: ActionTypes.SELECT_FJ_VC_ITEM,
	idx
})

// 让每一条的checkboxDisplay都与selectall的值相等，来达到选择全部的目的
// export const selectFjVcAll = () => ({
// 	type: ActionTypes.SELECT_FJ_VC_ALL
// })

//选择附件的选择框
export const selectFjItem = (idx,fjIdx) => ({
	type: ActionTypes.SELECT_FJ_ITEM,
	idx,
	fjIdx
})
//更改issuedate
export const changeFjglIssudate = (issuedate) => ({
	type: ActionTypes.CHANGE_FJGL_ISSUEDATE,
	issuedate
})
//更改labelValue标签
export const changeLabelValue = (labelValue) => ({
	type: ActionTypes.CHANGE_LABEL_VALUE,
	labelValue
})

//下载
export const getDownloadData = () => ({
	type: ActionTypes.GET_DOWNLOAD_DATA
})
//打开修改标签的组件
export const openLabelModal = (idx,fjIdx) => ({
	type: ActionTypes.OPEN_LABEL_MODAL,
	idx,
	fjIdx
})

//向后台发送修改标签的数据
export const updateLabel = (updatePath,currentLabel)=> (dispatch) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('updateLabel', 'POST', JSON.stringify({
		enKey:updatePath,
		label:currentLabel
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.CHANGE_CURRENT_LABEL,
				currentLabel
			})
		}
	})
}
//下载
export const download = () => (dispatch, getState) => {
	const emplId = getState().homeState.getIn(['data', 'userInfo', 'emplID'])
	let needDownLoad=getState().fjglState.get('needDownLoad').toJS()
	let enclosureList=[];
	if(needDownLoad.length>9){
		enclosureList=needDownLoad.slice(0,9);
	}else{
		enclosureList=needDownLoad
	}

	// thirdParty.requestOperateAuthCode({
	// 	corpId: sessionStorage.getItem('corpId'),
	// 	agentId: sessionStorage.getItem('agentId'),
	// 	onSuccess: (result) => {
	// 		const code = result.code
	// 		thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	// 		fetchApi("fjglDown", 'POST', JSON.stringify({
	// 			code,
	// 			userIdList: [emplId],
	// 			enclosureList
	// 		}), json => {
	// 			showMessage(json, 'show')
	// 		})
	// 	},
	// 	onFail: (err) => {
			thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
			fetchApi("fjglDown", 'POST', JSON.stringify({
					userIdList: [emplId],
					enclosureList
				}), json => {
					showMessage(json, 'show')
				})
		// }
	// })
}
//显示所有的复选框
export const changeFjCheckBoxDisplay = () => ({
	type: ActionTypes.CHANGE_ALL_FJ_CHECKBOX_DISPLAY
})

export const cancelChangeFjCheckBoxDisplay = () => ({
	type: ActionTypes.CANCEL_CHANGE_FJ_CHECKBOX_DISPALY
})
