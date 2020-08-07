import { showMessage, jsonifyDate } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.constant.js'

export const initKmyeb = () => ({
	type: ActionTypes.INIT_KMYEB
})

export const getPeriodAndBalistFetch = (issuedate, endissuedate) => dispatch => {
	dispatch(AllGetKmyebListFetch(issuedate, endissuedate, 'true'))
}

export const getBaListFetch = (issuedate, endissuedate) => dispatch => {

	dispatch(AllGetKmyebListFetch(issuedate, endissuedate))
}

const AllGetKmyebListFetch = (issuedate, endissuedate, getPeriod) => (dispatch, getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	
	const chooseValue =  getState().kmyebState.getIn(['views', 'chooseValue'])

	fetchApi('getreportacbalance', 'POST', JSON.stringify({
		begin: issuedate ? issuedate : '',
		end: endissuedate ? endissuedate : '',
		getPeriod
	}), json => {
		if (showMessage(json)) {
			if (getPeriod == 'true') {
				// 单账期刷新合并获取period
				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : `${openedissuedate.substr(0, 4)}-${openedissuedate.substr(6, 2)}`
				const endissuedateNew = endissuedate ? endissuedate : `${openedissuedate.substr(0, 4)}-${openedissuedate.substr(6, 2)}`

				dispatch(freshKmyeb(json.data.balance, issuedateNew, endissuedateNew))

			} else {
				dispatch(freshKmyeb(json.data.balance, issuedate, endissuedate))
			}
		} else {
			dispatch({type: ActionTypes.INIT_KMYEB})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

const freshKmyeb = (data, issuedate, endissuedate) => dispatch => {

	dispatch({
		type: ActionTypes.GET_AC_BA_LIST_FETCH,
		receivedData: data,
		issuedate,
		endissuedate
	})
}

export const showChildItiem = (acId) => ({
	type: ActionTypes.SHOW_CHILD_ITIEM,
	acId
})

export const changeKmyeChooseMorePeriods = () => ({
	type: ActionTypes.CHANGE_KMYE_CHOOSE_MORE_PERIODS
})
//是否逐级展开
export const isShowAll = (value) => ({
	type: ActionTypes.IS_SHOW_ALL,
	value
})

export const changeAcYebChooseValue = (chooseValue) => ({
	type: ActionTypes.CHANGE_AC_YEB_CHOOSE_VALUE,
	chooseValue
})
