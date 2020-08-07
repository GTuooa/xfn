import * as ActionTypes from './ActionTypes'
import fetchApi from 'app/constants/fetch.constant.js'
import { homeActions } from 'app/redux/Home/home.js'
import thirdParty from 'app/thirdParty'
import { showMessage, showError } from 'app/utils'
import * as sobConfigActions from 'app/redux/Config/Sob/sobconfig.action'

import * as Limit from 'app/constants/Limit.js'

// export const enterFirstSobFetch = (sobname, template) => (dispatch, getState) => {
//
// 	dispatch({
// 		type: ActionTypes.CHANGE_SOBNAME,
// 		sobname
// 	})
// 	dispatch({
// 		type: ActionTypes.CHANGE_TEMPLATE,
// 		template
// 	})
//
// 	if (template === '1') {
// 		const date = new Date()
// 		const year = date.getFullYear()
// 		const month = date.getMonth() + 1
// 		dispatch({
// 			type: ActionTypes.CHANGE_SOB_FIRSTYEAR,
// 			firstyear: `${year}`
// 		})
// 		dispatch({
// 			type: ActionTypes.CHANGE_SOB_FIRSTMONTH,
// 			firstmonth: `${month >= 10 ? month : '0' + month}`
// 		})
// 	}
//
// 	const sobConfigState = getState().sobConfigState
// 	const sob = sobConfigState.get('sob')
//
// 	fetchApi('insertsob', 'POST', JSON.stringify(sob), json => {
// 		if (json.code === 11099) {
// 			const isAdmin = getState().homeState.getIn(['info', 'isAdmin'])
// 			if (isAdmin === 'TRUE') {
// 				thirdParty.Confirm({
// 					message: JSON.stringify(json.message),
// 					title: "提示",
// 					buttonLabels: ['知道了', '前往超级管理'],
// 					onSuccess : function(result) {
// 						if (result.buttonIndex === 1) {
// 							history.push('/ztxq')
// 						}
// 					},
// 					onFail : function(err) {alert(err)}
// 				})
// 			} else {
// 				thirdParty.Alert({
// 					message: json.message,
// 					buttonName: '确认'
// 				})
// 			}
// 		} else if (showMessage(json)) {
// 			dispatch(homeActions.getDbListFetch())
// 		}
// 	})
// }

//确认编辑
export const enterSobFetch = (history) => (dispatch, getState) => {
	const state = getState().sobConfigState
	//获取当前选中编号
	const sobSelectedIndex = state.get('sobSelectedIndex')
	//获取当前选中编辑后账套
	const sob = state.get('sob')

	if (!sob.get('sobname'))
		return showMessage('', '', '', '账套名称内容未输入')
	if (sob.get('sobname').length > Limit.SOB_NAME_LENGTH)
		return showMessage('', '', '', '账套名称长度不能超过20个')
	if (!sob.get('firstyear'))
		return showMessage('', '', '', '起始账期未输入')

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	;({
		//确认修改
		modify() {                       //当模式为modify时，发送请求以及相应数据到相应地址
			fetchApi('modifysob', 'POST', JSON.stringify(sob), json => {
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				if (showMessage(json, 'show')) {
					dispatch(modifySob(json, sob, sobSelectedIndex))
					dispatch(homeActions.getDbListFetch('', history))
					history.goBack()
				}
			})
		},
		//确认新增
		insert() {						//当模式为insert....
			fetchApi('insertsob', 'POST', JSON.stringify(sob), json => {
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				if (showMessage(json, 'show')) {
					dispatch(insertSob(json, sob))
					dispatch(homeActions.getDbListFetch('', history))
					history.goBack()
				}
			})
		}
	}[state.get('sobConfigMode')])()
}

const insertSob = (receivedData, sob) => ({
	type: ActionTypes.INSERT_SOB,
	receivedData,
	sob
})

const modifySob = (receivedData, sob, idx) => ({
	type: ActionTypes.MODIFY_SOB,
	receivedData,
	sob,
	idx
})

export const deleteSobFetch = (history) => (dispatch, getState) => {

	thirdParty.Confirm({
		message: "确定删除？",
		title: "提示",
        buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			const sobidlist = getState().allState.get('soblist').toSeq().filter(v => v.get('selected')).map(v => v.get('sobid'))
			if (result.buttonIndex === 1) {
				fetchApi('deletesob', 'POST', JSON.stringify({sobidlist}), json => {
					if (showMessage(json)) {
						dispatch(homeActions.getDbListFetch('', history))
						dispatch({
							type: ActionTypes.DELETE_SOB_FETCH,
							receivedData: json
						})
						!dispatch(unselectSobAll()) & dispatch(sobConfigActions.hideAllSobCheckbox())
						// showError(json)
					}
				})
			}
		},
		onFail : (err) => alert(err)
	})
}


// export const cancelEnterSobFetch = () => ({
// 	type: ActionTypes.CANCEL_ENTER_SOB_FETCH
// })

export const selectSob = idx => ({
	type: ActionTypes.SELECT_SOB,
	idx
})

export const selectSobAll = () => ({
	type: ActionTypes.SELECT_SOB_ALL
})

export const unselectSobAll = () => ({
	type: ActionTypes.UNSELECT_SOB_ALL
})
