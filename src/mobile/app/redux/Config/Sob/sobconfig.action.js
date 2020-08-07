import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import { showMessage, browserNavigator } from 'app/utils'
import { homeActions } from 'app/redux/Home/home.js'
import { ROOTURL } from 'app/constants/fetch.constant.js'

// export const getSobListFetch = () => dispatch => {
// 	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
// 	fetchApi('getNewSobList', 'GET', '', json => {
// 		if(showMessage(json)){
// 			dispatch({
// 				type: ActionTypes.GET_SOB_LIST,
// 				receivedData: json.data
// 			})
// 		}
// 		thirdParty.toast.hide()
// 	})
// }


export const beforeInsertOrModifySob = (sobId, history, sobName) => dispatch => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('sobOptionInit', 'GET', `sobId=${sobId}`, json => {
		if(showMessage(json)){
			dispatch({
				type: ActionTypes.BEFORE_INSERT_OR_MODIFY_SOB,
				receivedData: json.data,
				history,
				sobName
			})
		}
		thirdParty.toast.hide()
	})
}

export const beforeHomeInsertOrModifySob = (history) => (dispatch, getState) => {

	const homeState = getState().homeState
	const userInfo = homeState.getIn(['data', 'userInfo'])

	const corpName = sessionStorage.getItem('corpName') ? sessionStorage.getItem('corpName') : userInfo.get('corpName')
	const sobList = sobList ? sobList : userInfo.get('sobList')

	// const defaultNameOne = `${corpName.indexOf('有限公司') > -1 ? corpName : corpName + '有限公司'}`
	// const defaultNameTwo = `${corpName}的账套`
	const defaultName = corpName

	if (sobList.every(v => v.get('sobName') !== defaultName)) {
		dispatch(beforeInsertOrModifySob('', history, defaultName))
	} else {
		dispatch(beforeInsertOrModifySob('', history))
	}
}

export const sobOptionChangeContent = (name,value) => dispatch => {
	dispatch({
		type: ActionTypes.SOB_OPTION_CHANGE_CONTENT,
		name,
		value,
	})
}

export const changeSobName = (sobname) => ({
	type: ActionTypes.CHANGE_SOBNAME,
	sobname
})
export const changeZNSobModel = (sobModel) => ({
	type: ActionTypes.CHANGE_ZN_SOBMODEL,
	sobModel
})

export const changeSobFirstYearMonth = (firstyear, firstmonth) => ({
	type: ActionTypes.CHANGE_SOB_FIRST_YEAR_MONTH,
	firstyear,
	firstmonth
})

export const changeSobTemplate = (template) => ({
	type: ActionTypes.CHANGE_SOB_TEMPLATE,
	template
})

// export const sobOptionChangeFunModuel = (item,value) => dispatch =>{ // 作废
// 	dispatch({
// 		type: ActionTypes.SOB_OPTION_CHANGE_FUN_MODUEL,
// 		moduleCode:item.get('moduleCode'),
// 		value,
// 	})
// }

export const sobOptionChangeFunMultipleModuel = (valueArr, selectModalList) => dispatch =>{
	dispatch({
		type: ActionTypes.SOB_OPTION_CHANGE_FUN_MULTIPLE_MODUEL,
		valueArr,
		selectModalList,
	})
}

export const sobOptionRoleDelete = (listName,index) => dispatch =>{
	dispatch({
		type: ActionTypes.SOB_OPTION_ROLE_DELETE,
		listName,
		index,
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

export const sobOptionSave = (history) => (dispatch,getState) =>{

	let data = getState().sobConfigState.get('tempSob')

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

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('checkRoleIsRepeat', 'POST', JSON.stringify(data), json => {
		if (json.code === 0) {
			if (json.message === '成功') {
				dispatch(saveSob(data, history))
			} else {
				thirdParty.toast.hide()
				thirdParty.Confirm({
					message: json.message,
					title: "提示",
					buttonLabels: ['取消', '确定'],
					onSuccess : (result) => {
						if (result.buttonIndex === 1) {
							thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
							dispatch(saveSob(data, history))
						}
					}
				})
			}
		}
	})
}

const saveSob = (data, history) => (dispatch, getState) => {
	// thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('sobOptionSave', 'POST', JSON.stringify(data), json => {
		// thirdParty.toast.hide()

		const sobInfo = getState().homeState.getIn(['data', 'userInfo', 'sobInfo'])
		const sobId = sobInfo ? getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId']) : ''

		if (showMessage(json, 'show')) {
			// const sobOptionModal = getState().sobConfigState.get('sobOptionModal')
			//
			if (data.get('sobid') === '') { // 新增
				// dispatch(homeActions.getDbListFetch('', history))

				if (!sobInfo) {
					// if (browserNavigator.versions.DingTalk) {
						// 新建第一个账套 sessionStorage.clear() 清掉之前sessionStorage里的东西
						// location.replace(`${ROOTURL}/index.html?dd_nav_bgcolor=FFFFFFFF&isOV=false&corpid=${sessionStorage.getItem('corpId')}`)
						dispatch(homeActions.getDbListFetch('', history))
						history.goBack()
					// } else {
					// 	// location.replace(`http://localhost:4800/build/mobile/index.html`)
					// 	dispatch(homeActions.getDbListFetch('', history))
					// 	history.goBack()
					// }
					if (getState().homeState.getIn(['views', 'firstToSob'])) {
						dispatch(homeActions.changeLoginGuideString('firstToSob', false))
					}
					thirdParty.Confirm({
						message: `创建账套成功`,
						title: "提示",
						buttonLabels: ['再次编辑', '进入账套'],
						onSuccess : (result) => {
							if (result.buttonIndex === 1) {
								history.goBack()
							}
						}
					})
				} else {
					dispatch(homeActions.getDbListFetch('', history))
					history.goBack()
				}
			} else { // 修改

				if (sobId === data.get('sobid')) { // 修改当前账套
					dispatch(homeActions.getDbListFetch('', history))
					history.goBack()
				} else {  // 修改不是当前的账套， 刷新账套列表
					fetchApi('sobOptionInit', 'GET', `sobId=${data.get('sobid')}`, json => {
						if(showMessage(json)){
							dispatch({
								type: ActionTypes.BEFORE_INSERT_OR_MODIFY_SOB,
								receivedData: json.data
							})
						}
					})
					// dispatch(getSobListFetch())
					dispatch(homeActions.getDbListFetch('', history))
					history.goBack()
				}
				if (getState().homeState.getIn(['views', 'firstToSob'])) {
					dispatch(homeActions.changeLoginGuideString('firstToSob', false))
				}
			}
		} else {
			if (json.code !== Limit.REPEAT_REQUEST_CODE) {
				if (data.get('sobid')) {
					fetchApi('sobOptionInit', 'GET', `sobId=${data.get('sobid')}`, json => {
						if(showMessage(json)){
							dispatch({
								type: ActionTypes.BEFORE_INSERT_OR_MODIFY_SOB,
								receivedData: json.data
							})
						}
					})
				}
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

export const deleteSobItemFetch = (sobIdList, history) => (dispatch, getState) => {
	fetchApi('deletesob', 'POST', JSON.stringify({
		sobidlist: sobIdList
	}), json => {
		if (showMessage(json)) {
			const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
			if (sobId === sobIdList[0]) { // 删除当前账套
				dispatch(homeActions.getDbListFetch('', history))
				// dispatch(getSobListFetch())
			} else {
				// dispatch(getSobListFetch())
			}
		}
	})
}

export const changeSobCurrencyModel = (currency) => ({
	type: ActionTypes.CHANGE_SOB_CURRENCYMODEL,
	currency,
})

export const changeAdminList = (adminlist, idx) => ({
	type: ActionTypes.CHANGE_ADMIN_LIST,
	adminlist,
	idx
})

export const changeObserverList = (observerlist, idx) => ({
	type: ActionTypes.CHANGE_OBSERVER_LIST,
	observerlist,
	idx
})

export const changeOperatorList = (operatorlist, idx) => ({
	type: ActionTypes.CHANGE_OPERATOR_LIST,
	operatorlist,
	idx
})

export const changeSobReviewPermissionList = (listName, resultlist) => ({
	type: ActionTypes.CHANGE_SOB_REVIEW_PERMISSION_LIST,
	listName,
	resultlist
})


// export const changeSobFirstMonth = (firstmonth) => ({
// 	type: ActionTypes.CHANGE_SOB_FIRSTMONTH,
// 	firstmonth
// })

export const beforeModifySob = (sob, idx) => ({
	type: ActionTypes.BEFORE_MODIFY_SOB,
	idx,
	sob
})

export const showAllSobCheckbox = idx => ({
	type: ActionTypes.SHOW_ALL_SOB_CHECKBOX,
	idx
})

export const hideAllSobCheckbox = () => ({
	type: ActionTypes.HIDE_ALL_SOB_CHECKBOX
})

export const cancelEnterSobFetch = () => ({
	type: ActionTypes.CANCEL_ENTER_SOB_FETCH
})

export const changeXuanzeboxStatus = () => ({
	type: ActionTypes.CHANGE_XUANZEBOX_STATUS
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

export const setSobChangeCopyModuleItem = (item, sobId, isIdentifyingCode) => ({
	type: ActionTypes.SET_SOB_CHANGE_COPY_MODULE_ITEM,
	item,
	sobId,
	isIdentifyingCode
})

export const sobChangeCopyModuleItem = (moduleCode, value) => ({
	type: ActionTypes.SOB_OPTION_CHANGE_COPY_MODULE_ITEM,
	moduleCode,
	value
})