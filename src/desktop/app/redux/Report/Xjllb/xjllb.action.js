import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import { showMessage, jsonifyDate } from 'app/utils'
import thirdParty from 'app/thirdParty'
import fetchApi from 'app/constants/fetch.constant.js'

//
export const getPeriodAndCachFlowFetch = (issuedate, endissuedate) => (dispatch,getState) => {
    // if(!issuedate){
    //     allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(getXjllbFetch(issuedate, issuedate)))
    // } else if (issuedate === 'NO_VALID_ISSUE_DATE') {
    //     dispatch({
    //         type: ActionTypes.INIT_XJLLB
    //     })
    // } else {
    //     allActions.refreshPeriodHandle(issuedate, dispatch, (issuedate) => dispatch(getXjllbFetch(issuedate, endissuedate)), () => dispatch({type: ActionTypes.INIT_XJLLB}))
    // }
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    let options = {}
	if (!issuedate) {
		// 进入页面发送的参数
		options = {
			getPeriod: 'true',
            needPeriod: 'true',
			begin: '',
			end: ''
		}
	} else {

        // 如果是获取多账期，暂时不获取period
        // if (issuedate && issuedate !== endissuedate)
		// 	dispatch(getXjllbFetch(issuedate, endissuedate))

		// 刷新时获得的参数
        const begin = `${issuedate.substr(0, 4)}${isRunning?'-':''}${issuedate.substr(6, 2)}`
        const end =  `${endissuedate.substr(0, 4)}${isRunning?'-':''}${endissuedate.substr(6, 2)}`

		options = {
			begin,
            end,
            getPeriod: 'true',
            needPeriod: 'true'
		}
	}
	// dispatch(alertGetPeriodAndXjllb(options, issuedate))
    dispatch(alertGetPeriodAndXjllb(options, issuedate, endissuedate))

}

const alertGetPeriodAndXjllb = (options, issuedate, endissuedate) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    fetchApi(`${isRunning?'getJrCachFlow':'getcachFlow'}`, 'POST', JSON.stringify(options), json => {
        if (showMessage(json)) {

			// 更新得到的period数据并返回openedyear,openedmonth拼接的issuedate
            const openedissuedate = isRunning ? dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json)) : dispatch(allActions.everyTableGetPeriod(json))
            const issuedateNew = issuedate ? issuedate : openedissuedate
            const endissuedateNew = endissuedate ? endissuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
			dispatch({
				type: ActionTypes.GET_CACH_FLOW_FETCH,
				receivedData: json.data.jsonArray,
                issues

			})

            dispatch({
                type: ActionTypes.CHANGE_XJLLB_ISSUDATE,
                issuedate: issuedateNew,
                endissuedate: endissuedateNew
            })
		} else {
            dispatch({type: ActionTypes.INIT_XJLLB})
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}


export const getXjllbFetch = (issuedate, endissuedate) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    // 2012年第02期 --> 201202
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    const begin = `${issuedate.substr(0, 4)}${isRunning?'-':''}${issuedate.substr(6, 2)}`
    const end =  `${endissuedate.substr(0, 4)}${isRunning?'-':''}${endissuedate.substr(6, 2)}`


    fetchApi(`${isRunning?'getJrCachFlow':'getcachFlow'}`, 'POST', JSON.stringify({
        begin: begin,
        end: end,
        getPeriod:true,
        needPeriod:true
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_CACH_FLOW_FETCH,
                receivedData: json.data.jsonArray
            })
            dispatch({
                type: ActionTypes.CHANGE_XJLLB_ISSUDATE,
                issuedate,
                endissuedate
            })
        } else {
            showMessage(json)
        }

    })

}

//点击复选框
export const changeXjllbChooseMorePeriods = () => ({
    type: ActionTypes.CHANGE_XJLLB_CHOOSE_MORE_PERIODS
})

export const showInitXjllb = (value) => ({
	type: ActionTypes.SHOW_INIT_XJLLB,
	value
})
// xjllb期初设置
export const getInitXjllbFetch = (firstyear, firstmonth, periodStartMonth) => (dispatch,getState) => {
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    fetchApi(`${isRunning?'getInitJrXjllbFetch':'getInitXjllbFetch'}`, 'GET', '', json => {
		if (showMessage(json)) {

			dispatch({
                type: ActionTypes.GET_INIT_XJLLB_INCOMESTATEMENT,
				receivedData: json.data
			})

			// const lastMonth = Number(firstmonth) - 1
            // const lastMonthStr = lastMonth < 10 ? `0${lastMonth}` : `${lastMonth}`
            
            const lastMonthstr = firstmonth <= 10 ? `0${firstmonth- 1}` : `${firstmonth- 1}`
            const messageYearStart = Number(firstmonth) > Number(periodStartMonth) ? firstyear : firstyear - 1
            // const messageMonthStart = Number(periodStartMonth
            const messageYearEnd = Number(firstmonth) > Number(periodStartMonth) ? firstyear : Number(firstmonth) === 1 ? firstyear-1 : firstyear
            const messageMonthEnd =  Number(firstmonth) > Number(periodStartMonth) ? lastMonthstr : Number(firstmonth) === 1 ? 12 : lastMonthstr 

            // const message = `当前账套起始账期为${firstyear}-${firstmonth}期,请填写下列项目${firstyear}-01期至${firstyear}-${lastMonthStr}期的累计发生额,以修正现金流量表本年累计金额(注：起始账期修改后,调整数据将会被清零)。`
            const message = `当前账套起始账期为${firstyear}-${firstmonth}期,请填写下列项目${messageYearStart}-${periodStartMonth}期至${messageYearEnd}-${messageMonthEnd}期的累计发生额,以修正现金流量表本年累计金额(注：起始账期修改后,调整数据将会被清零)。`

			thirdParty.Alert(message)
		}
	})
}
export const clearInitXjllb = () => ({
	type: ActionTypes.CLEAR_INIT_XJLLB
})
export const changeInitXjllbAmount = (lineIndex, amount) => ({
	type: ActionTypes.CHANGE_INIT_XJLLB_AMOUNT,
	lineIndex,
	amount
})
export const saveInitXjllbFetch = () => (dispatch, getState) => {
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	let initPeriodList = getState().xjllbState.get('initPeriodList')
	initPeriodList = initPeriodList.filter(v => v.get('amount') !== '' && v.get('amount') !== 0)
	fetchApi(`${isRunning?'saveInitJrXjllbFetch':'saveInitXjllbFetch'}`, 'POST', JSON.stringify({initCashFlowList:initPeriodList}), json => showMessage(json, 'show'))
}
