import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { fromJS } from 'immutable'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

// export const sobOptionInit = (sobId,init, sobname) => dispatch => {
// 	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
// 	fetchApi('sobOptionInit', 'GET', `sobId=${sobId}`, json => {
// 		if(showMessage(json)){
// 			dispatch({
// 				type: ActionTypes.SOB_OPTION_INIT,
// 				receivedData: json.data,
// 				sobname
// 			})
// 			init()
// 		}
// 		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
// 	})
// }

export const sobOptionChangeContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.SOB_OPTION_CHANGE_CONTENT,
		name,
		value,
	})
}
export const sobOptionChangeSobTemplate = (value) => dispatch => {
	dispatch({
		type: ActionTypes.SOB_OPTION_CHANGE_SOB_TEMPLATE,
		value,
	})
}

export const sobOptionChangeTime = (value) => dispatch =>{
	const valueList = value.split('-');
	const firstyear = valueList[0];
	const firstmonth = valueList[1];
	dispatch({
		type: ActionTypes.SOB_OPTION_CHANGE_TIME,
		firstyear,
		firstmonth,
	})
}

export const sobOptionChangeFunModuel = (item,value) => dispatch =>{
	dispatch({
		type: ActionTypes.SOB_OPTION_CHANGE_FUN_MODUEL,
		moduleCode:item.get('moduleCode'),
		value,
	})
}

export const sobOptionSave = () => (dispatch,getState) =>{

	let data = getState().sobOptionState.get('tempSob')

	if (data.getIn(['moduleInfo', 'GL']) && data.getIn(['moduleInfo', 'GL', 'beOpen'])) {
		data = data.setIn(['moduleInfo', 'ENCLOSURE_GL', 'beOpen'], true)
	}

	if (data.getIn(['moduleInfo', 'GL']) && data.getIn(['moduleInfo', 'GL', 'beOpen']) === false) {
		data = data.set('operatorlist', fromJS([]))
					.set('vcObserverList', fromJS([]))
	}

	if (data.getIn(['moduleInfo', 'RUNNING']) && data.getIn(['moduleInfo', 'RUNNING', 'beOpen'])) {
		data = data.setIn(['moduleInfo', 'ENCLOSURE_RUN', 'beOpen'], true)
	}

	if (data.getIn(['moduleInfo', 'RUNNING']) && data.getIn(['moduleInfo', 'RUNNING', 'beOpen']) === false) {
		data = data.set('cashierList', fromJS([]))
					.set('flowObserverList', fromJS([]))
	}

	data = data.delete('customizeList').delete('jrModelList')

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('checkRoleIsRepeat', 'POST', JSON.stringify(data), json => {
		if (showMessage(json)) {
			if (json.message === '成功') {
				dispatch(saveSob(data))
			} else {
				thirdParty.Confirm({
					message: json.message,
					title: "提示",
					buttonLabels: ['取消', '确定'],
					onSuccess : (result) => {
						if (result.buttonIndex === 1) {
							dispatch(saveSob(data))
						}
					}
				})
			}
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})	
}

const saveSob = (data) => (dispatch, getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('sobOptionSave', 'POST', JSON.stringify(data), json => {
		if (showMessage(json, 'show')) {
			const sobOptionModal = getState().sobConfigState.get('sobOptionModal')

			if (data.get('sobid') === '') { // 新增
				dispatch({
					type: ActionTypes.CLEAR_HOME_TAB_PANE
				})
				dispatch(homeActions.getDbListFetch())
				// dispatch(homeActions.getDbListFetch())
				thirdParty.Confirm({
					message: '账套创建成功！',
					title: "提示",
					buttonLabels: ['设置账套角色', '进入新账套'],
					onSuccess : (result) => {
						if (result.buttonIndex === 0) {
							// dispatch(homeActions.)
							const sobid = json.data.sobid
							const sobType = data.get('template') === '3' ? 'SMART' : 'ACCOUNTING'
							const sobname = data.get('sobname')
							dispatch(sobRoleActions.getSobRoleListFromSobConfig(sobid, sobType, sobname))
							dispatch(homeActions.addPageTabPane('ConfigPanes', 'SobRole', 'SobRole', '角色编辑'))
							dispatch(homeActions.addHomeTabpane('Config', 'SobRole', '角色编辑'))
						} else if (result.buttonIndex === 1) {
							
						}
					}
				})

			} else { // 修改
				const sobInfo = getState().homeState.getIn(['data', 'userInfo', 'sobInfo'])
				const sobId = sobInfo ? getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId']) : ''
				if (sobId === data.get('sobid')) { // 修改当前账套
					dispatch({
						type: ActionTypes.CLEAR_HOME_TAB_PANE
					})
					dispatch(getSobList('hideLoad'))
					dispatch(homeActions.getDbListFetch())
				} else {  // 修改不是当前的账套， 刷新账套列表
					fetchApi('sobOptionInit', 'GET', `sobId=${data.get('sobid')}`, json => {
						if(showMessage(json)){
							dispatch({
								type: ActionTypes.SOB_OPTION_INIT,
								receivedData: json.data
							})
						}
					})
					dispatch(homeActions.getDbListFetch())
					dispatch(getSobList('hideLoad'))
				}
			}
		} else {
			if (json.code !== Limit.REPEAT_REQUEST_CODE) {
				if (data.get('sobid')) {
					fetchApi('sobOptionInit', 'GET', `sobId=${data.get('sobid')}`, json => {
						if(showMessage(json)){
							dispatch({
								type: ActionTypes.SOB_OPTION_INIT,
								receivedData: json.data
							})
						}
					})
				}
			}
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const getSobList = (hideLoad) => dispatch => {
	hideLoad !== 'hideLoad' && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getNewSobList', 'GET', '', json => {
		if(showMessage(json)){
			dispatch({
				type: ActionTypes.GET_SOB_LIST,
				list: json.data
			})
		}
		hideLoad !== 'hideLoad' && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const sobOptionCensorChange = (listName,index,lastStatus) => dispatch => {
	dispatch({
		type: ActionTypes.SOB_OPTION_ROLE_CHECK_STATE,
		listName,
		index,
		lastStatus
	})
}

export const sobOptionRoleDelete = (listName, listIndex, index) => dispatch =>{
	dispatch({
		type: ActionTypes.SOB_OPTION_ROLE_DELETE,
		listName,
		listIndex,
		index,
	})
}

export const deleteSobItemFetch = (sobIdList) => (dispatch, getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('deletesob', 'POST', JSON.stringify({
		sobidlist: sobIdList
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
			if (sobId === sobIdList[0]) { // 删除当前账套

				dispatch(allActions.freshReportPage())
				dispatch(allActions.freshYebPage())
				dispatch(allActions.freshMxbPage())
				dispatch(allActions.freshSearchPage())
				dispatch(allActions.freshEditPage())
				dispatch(allActions.freshConfigPage('账套设置'))
				dispatch({
					type: ActionTypes.CLEAR_HOME_TAB_PANE,
					exclude: 'Config'
				})

				dispatch(homeActions.getDbListFetch())
				dispatch(getSobList())
			} else {
				dispatch(getSobList())
			}
		}
	})
}

export const changeSobPermissionList = (listName, index, list) => ({
	type: ActionTypes.CHANGE_SOB_PERMISSION_LIST,
	listName,
	index,
	list
})

export const getIdentifyingCodeList = () => dispatch => {
	fetchApi('getsobcopycode', 'GET', '', json => {
		if(showMessage(json)){
			dispatch({
				type: ActionTypes.AFTER_GET_IDENTIFYING_CODE_LIST,
				receivedData: json.data
			})
		}
	})
}

export const initIdentifyingCodeTemp = () => ({
	type: ActionTypes.INIT_IDENTIFYING_CODE_TEMP
})

export const setSobChangeCopyModuleItem = (item, newJr) => ({
	type: ActionTypes.SET_SOB_CHANGE_COPY_MODULE_ITEM,
	item,
	newJr
})

export const sobChangeCopyModuleItem = (moduleCode, value) => ({
	type: ActionTypes.SOB_OPTION_CHANGE_COPY_MODULE_ITEM,
	moduleCode,
	value
})