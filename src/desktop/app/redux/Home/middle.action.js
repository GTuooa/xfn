import fetchApi from 'app/constants/fetch.constant.js'
import fetchJRApi from 'app/constants/fetch.account.js'
import * as ActionTypes from './ActionTypes.js'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action.js'

import { showMessage } from 'app/utils'
import { DateLib }from 'app/utils'

export const insertRunningFromHomePageAndSearchPage = ()  => dispatch => {
	dispatch(getEditSettingInfo())
	dispatch(beforeInsertRunning())
}

export const beforeInsertRunning = () => (dispatch, getState) => {

	const period = getState().allState.get('period')
	const year = period.get('openedyear')
	const month = period.get('openedmonth')

	let oriDate = ''

	if (!year) {
		oriDate = new Date()
	} else {
		const lastDate = new Date(year, month, 0)
		const currentDate = new Date()
		const currentYear = new Date().getFullYear()
		const currentMonth = new Date().getMonth() + 1

		if (lastDate < currentDate) {   //本月之前
			oriDate = currentDate
		} else if (Number(year) == Number(currentYear) && Number(month) == Number(currentMonth)) {  //本月
			oriDate = currentDate
		} else {   //本月之后
			oriDate = new Date(year, Number(month)-1, 1)
		}
	}

	oriDate = new DateLib(oriDate).toString()

	dispatch({type: ActionTypes.INIT_EIDT_CALCULATE})
	dispatch({
		type: ActionTypes.BEFORE_INSERT_RUNNING,
		date: oriDate
	})
	dispatch({type: ActionTypes.INIT_EDIT_RUNNING_ALL})
}

// 损益表跳入触发， 此处写的是复制来的
export const changeCharDidmount = (bool) => ({
	type: ActionTypes.CHANGE_CHAR_DIDMOUNT,
	bool
})
export const changeSYXMCharDidmount = (bool) => ({
	type: ActionTypes.CHANGE_SYXM_CHAR_DIDMOUNT,
	bool
})

// 初始化、获取日期和最大凭证号
export const initAndGetLastVcIdFetch = (strJudgeEnter, date) => dispatch => {

    // // 进入录入凭证获取科目和辅助核算
    // fetchApi('getasslist', 'GET', '', json => {
    //     showMessage(json) && dispatch({
    //         type: ActionTypes.AFTER_GET_ASS_FETCH,
    //         receivedData: json.data
    //     })
    // })
	//
    // fetchApi('getaclist', 'GET', '', json => {
    //     if (showMessage(json)) {
    //         dispatch({
    //             type: ActionTypes.AFTER_GET_AC_LIST_FETCH,
    //             receivedData: json.data
    //         })
    //     }
    // })

	const vcDate = new DateLib(date)
	fetchApi('getLastVcIndex', 'POST', JSON.stringify({
		year: vcDate.getYear(),
		month: vcDate.getMonth()
	}), json => {
		if (showMessage(json)) {
			const data = {
				receivedData: json.data,
				vcDate: vcDate
			}
			dispatch(initLrpz(strJudgeEnter, data))
		}
	})
}

export const initLrpz = (strJudgeEnter, data) => ({
	type: ActionTypes.INIT_LRPZ,
	strJudgeEnter,
	data
})

// 流水
export const initLrAccount = (strJudgeType, data, callBackObj) => ({
    type: ActionTypes.INIT_LR_ACCOUNT,
    strJudgeType,
    receivedData: data,
    callBackObj
})

// 和旧版一起删掉
export const getRunningSettingInfo = (mask) => dispatch => {
	mask && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchJRApi('getRunningSettingInfo', 'GET', '', json => {
		mask && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const rate = json.data.rate
            dispatch({
                type: ActionTypes.GET_ACCOUNTCONF_ALL_SETTINGS,
                receivedData: json.data,

            })
            dispatch({
                type: ActionTypes.INIT_LR_ACCOUNT_SETTINGS,
                rate,
                hideCategoryList: json.data.hideCategoryList
            })
            dispatch({
                type: ActionTypes.SET_INVOIC_ASSLIST_FROM_SETTINGS,
                rate
            })
        }
    })
}
//新版录入
export const getEditSettingInfo = (fromType) => dispatch => {
	// dispatch({
	// 	type: ActionTypes.INIT_EDIT_RUNNING,
	// })
	dispatch(allRunningActions.getRunningSettingInfo())
    // fetchJRApi('getRunningSettingInfo', 'GET', '', json => {
    //     if (showMessage(json)) {
    //         const rate = json.data.rate
    //         dispatch({
    //             type: ActionTypes.GET_ACCOUNTCONF_ALL_SETTINGS,
    //             receivedData: json.data,
    //         })
    //         dispatch({
    //             type: ActionTypes.INIT_EDIT_RUNNING_SETTINGS,
    //             rate,
    //             hideCategoryList: json.data.hideCategoryList
    //         })
	//
    //     }
    // })
}

export const initEditRunning = () => (dispatch) =>{
	dispatch({type: ActionTypes.INIT_EIDT_CALCULATE})
	dispatch({type: ActionTypes.INIT_EDIT_RUNNING})
	dispatch({type: ActionTypes.INIT_EDIT_RUNNING_ALL})
}

export const initLrCalculate = () => ({type: ActionTypes.INIT_LR_CALCULATE_STATE})

// allActions
export const changeLrFzhsModalClear = () => ({
	type: ActionTypes.CHANGE_LR_FZHS_MODAL_CLEAR
})

export const changelrAcModalClear = () => ({
	type: ActionTypes.CHANGE_LR_AC_MODAL_CLEAR
})

export const sobOptionInit = (sobId, init, sobname) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('sobOptionInit', 'GET', `sobId=${sobId}`, json => {
		if(showMessage(json)){
			dispatch({
				type: ActionTypes.SOB_OPTION_INIT,
				receivedData: json.data,
				sobname
			})
			init && init()
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}
