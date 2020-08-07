import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

export const getPeriodAndCachFlowFetch = (issuedate) => (dispatch,getState) => {
	// allActions.getPeriodFetch(issuedate, dispatch, (issuedate) => dispatch(getXjllbFetch(issuedate)))
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
	fetchApi(isRunning?'getJrcachFlow':'getcachFlow', 'POST', JSON.stringify({
        begin: '',
        end: '',
		getPeriod: 'true',
		needPeriod:'true'
    }), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
            const openedissuedate = isRunning ? dispatch(allActions.reportGetIssuedateAndFreshPeriod(json)) : dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
			dispatch(freshXjllb(json.data.jsonArray, issuedateNew, '',issues))
		}
    })
}


export const getXjllbFetch = (issuedate, endissuedate) => (dispatch, getState) => {
	// 2012年第02期 --> 201202
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
    const begin = `${issuedate.substr(0, 4)}${isRunning?'-':''}${issuedate.substr(5, 2)}`
    const end = endissuedate? `${endissuedate.substr(0, 4)}${isRunning?'-':''}${endissuedate.substr(5, 2)}` : begin
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(isRunning?'getJrcachFlow':'getcachFlow', 'POST', JSON.stringify({
        begin: begin,
        end: end
    }), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch(freshXjllb(json.data, issuedate, endissuedate))
		}
    })

}

const freshXjllb = (data, issuedate, endissuedate,issues) => dispatch => {
	dispatch({
		type: ActionTypes.GET_CACH_FLOW_FETCH,
		receivedData: data
	})
	dispatch({
		type: ActionTypes.CHANGE_XJLLB_ISSUDATE,
		issuedate,
		endissuedate,
		issues
	})
}

export const toggleCachFlowLineDisplay = (blockIdx) => ({
	type: ActionTypes.TOGGLE_CACH_FLOW_LINE_DISPLAY,
	blockIdx
})
//第二个参数代表是否需要把end还原成begin
export const changeXjllbBeginDate = (begin, bool) => ({
	type: ActionTypes.CHANGE_XJLLB_BEGIN_DATE,
	begin,
	bool
})
