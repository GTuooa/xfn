import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'

export const getPeriodAndIncomeStatementSfbFetch = (issuedate, endissuedate) => (dispatch,getState) => {
	// if(!issuedate){
	// 	allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(getIncomeStatementSfbFetch(issuedate, issuedate)))
	// } else if (issuedate === 'NO_VALID_ISSUE_DATE') {
	// 	dispatch({
	// 		type: ActionTypes.INIT_SJB
	// 	})
	// } else {
	// 	allActions.refreshPeriodHandle(issuedate, dispatch, (issuedate) => dispatch(getIncomeStatementSfbFetch(issuedate, endissuedate)), () => dispatch({type: ActionTypes.INIT_SJB}))
	// }

	let options = {}
	if (!issuedate) {
		// 进入页面发送的参数
		options = {
			getPeriod: 'true',
			needPeriod:'true',
			begin: '',
			end: ''
		}
	} else {
		const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
		const begin = `${issuedate.substr(0, 4)}${isRunning?'-':''}${issuedate.substr(6, 2)}`
        const end =  `${endissuedate.substr(0, 4)}${isRunning?'-':''}${endissuedate.substr(6, 2)}`

		options = {
			begin,
            end,
			getPeriod: 'true',
			needPeriod:'true'
		}
	}
	dispatch(alertGetPeriodAndYjsfb(options, issuedate, endissuedate))
}

const alertGetPeriodAndYjsfb = (options, issuedate, endissuedate) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    fetchApi(isRunning ? 'getJrRate' : 'getYjsfbData', 'POST', JSON.stringify(options), json => {
        if (showMessage(json)) {

			// 更新得到的period数据并返回openedyear,openedmonth拼接的issuedate
            const openedissuedate = isRunning ? dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json)) : dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
			const endissuedateNew = endissuedate ? endissuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''

			dispatch({
				type: ActionTypes.GET_SFB_DATA,
				receivedData: json.data.dataList,
				issues
			})

            dispatch({
                type: ActionTypes.CHANGE_SFB_ISSUDATE,
                issuedate: issuedateNew,
                endissuedate: endissuedateNew
            })
		} else {
			dispatch({type: ActionTypes.INIT_SJB})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}


export const getIncomeStatementSfbFetch = (issuedate, endissuedate, selectAssId = 0, assid, asscategory) => (dispatch, getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	const begin = `${issuedate.substr(0, 4)}${isRunning?'-':''}${issuedate.substr(6, 2)}`
    const end =  `${endissuedate.substr(0, 4)}${isRunning?'-':''}${endissuedate.substr(6, 2)}`
    fetchApi(isRunning ? 'getJrRate' : 'getYjsfbData', 'POST', JSON.stringify({
        begin: begin,
        end: end
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_SFB_DATA,
                receivedData: json.data.dataList
            })
            dispatch({
                type: ActionTypes.CHANGE_SFB_ISSUDATE,
                issuedate,
                endissuedate
            })
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        } else {
            showMessage(json)
        }
    })
}


export const changeSjbChooseMorePeriods = () => ({
	type: ActionTypes.CHANGE_SFB_CHOOSE_MORE_PERIODS
})
export const changeSfbRuleModal = () => ({
	type: ActionTypes.CHANGE_SFB_RULE_MODAL
})
export const handleShowChildList=(lineIndex)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.HANDLE_YJSFB_SHOW_CHILD_LIST,
		lineIndex
	})
}
