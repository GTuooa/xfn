import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { jsonifyDate, showMessage } from 'app/utils'
import * as allActions from 'app/redux/Home/All/all.action'
import { message }	from 'antd'
import thirdParty from 'app/thirdParty'

import { allDownloadEnclosure } from 'app/redux/Home/All/all.action.js'

export const fjglDownloadEnclosure = (enclosureUrl, fileName) => dispatch => {
	dispatch(allDownloadEnclosure(enclosureUrl, fileName))
}

const showError = (json) => {
	const errorlist = json.data
	if (errorlist.failJsonList.length) {
		const error = errorlist.failJsonList.reduce((prev, v) => prev + ',' + v)
		message.error(error)
	}
}
//获取附件的数据
export const getFjListFetch = () => (dispatch,getState) => {

	const state = getState().fjglState
	const issuedate = state.get('issuedate')

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getFjData', 'POST', JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
		label: state.get('labelValue')==='全部' ? '' : state.get('labelValue')
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_FJGL_DATA,
				receivedData: json.data
			})	
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

// 删除选中的vclist，接收到删除成功的信息后，过滤出没被勾选的item来显示
export const deleteFjItemFetch = () => (dispatch,getState) => {

	dispatch({type:ActionTypes.GET_DELETE_DATA})

	const state = getState().fjglState;
	const issuedate = state.get('issuedate');

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('deleteFj', 'POST', JSON.stringify({
		year: issuedate.substr(0, 4),
		month: issuedate.substr(6, 2),
		enclosureList:state.get('needDeleteUrl'),
		vcIndexArray:state.get('vcIndexArray')
	}), json => {
		if (showMessage(json)){
			dispatch(getFjListFetch())
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

// 单个选择框被点击中后，将当前项的checkboxDisplay设为true，并判断所有的checkboxDisplay是否为true，箬是将selectall设为true，并让所有的附件都为选中或没选中的状态
export const selectFjVcItem = idx => ({
	type: ActionTypes.SELECT_FJ_VC_ITEM,
	idx
})

// 让每一条的checkboxDisplay都与selectall的值相等，来达到选择全部的目的
export const selectFjVcAll = () => ({
	type: ActionTypes.SELECT_FJ_VC_ALL
})

// 按日期排序
export const sortFjVcListByDate = () => ({
	type: ActionTypes.SORT_FJ_VC_LIST_BY_DATE
})

// 凭证号排序
export const reverseFjVcList = () => ({
	type: ActionTypes.REVERSE_FJ_VC_LIST
})

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

//关闭预览
export const closePrewiew = () => ({
	type: ActionTypes.CLOSE_PREVIEW
})
//预览
export const previewImage = (idx,fjIdx) => ({
	type: ActionTypes.PREWIEW_IMAGE,
	idx,
	fjIdx
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
//修改标签
export const changeCurrentLabel = (currentLabel) => ({
	type: ActionTypes.CHANGE_CURRENT_LABEL,
	currentLabel
})
//关闭修改标签的组件
export const closeLabelModal = () => ({
	type: ActionTypes.CLOSE_LABEL_MODAL
})
//向后台发送修改标签的数据
export const updateLabel = (updatePath,currentLabel)=> (dispatch) => {
	fetchApi('updateLabel', 'POST', JSON.stringify({
		enKey:updatePath,
		label:currentLabel
	}), json => {
		if (showMessage(json)){
			dispatch({type: ActionTypes.CLOSE_LABEL_MODAL})
		}
	})
}
//下载
export const download = (enclosureList) => (dispatch, getState) => {

	const emplId = getState().homeState.getIn(['data', 'userInfo', 'emplID'])

	// thirdParty.requestOperateAuthCode({
	// 	corpId: sessionStorage.getItem('corpId'),
	// 	agentId: sessionStorage.getItem('agentId'),
	// 	onSuccess: (result) => {
	// 		const code = result.code
	// 		fetchApi("fjglDown", 'POST', JSON.stringify({
	// 			code,
	// 			userIdList: [emplId],
	// 			enclosureList
	// 		}), json => {
	// 			console.log(json)
	// 			showMessage(json, 'show')
	// 		})
	// 	},
	// 	onFail: (err) => {
			// if (err.code == 404) {
				fetchApi("fjglDown", 'POST', JSON.stringify({
						userIdList: [emplId],
						enclosureList
					}), json => {
						showMessage(json, 'show')
					})
			// }
	// 	}
	// })
}
//预览图片上下一张切换
export const changePreviewSrcIdx = (value) => ({
	type: ActionTypes.CHANGE_PREVIEW_SRC_IDX,
	value
})
