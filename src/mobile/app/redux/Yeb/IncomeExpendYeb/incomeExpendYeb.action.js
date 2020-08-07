import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

// 首次以及刷新获取列表
export const getPeriodAndIncomeExpendYebBalanceList = (issuedate, endissuedate, needPeriod) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getIncomeExpendYebReport', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        needPeriod: 'true',
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            let  issuedateNew = issuedate
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_YEB_BALANCE_LIST,
                receivedData: json.data.result,
                issues,
                issuedate: issuedateNew,
                endissuedate: endissuedate,
                getPeriod: 'true'
            })
        }
	})
}

export const incomeExpendBalanceTriangleSwitch = (showChild, uuid) => ({
      type: ActionTypes.INCOME_EXPEND_YEB_BALANCE_TRIANGLE_SWITCH,
      showChild,
      uuid
})

export const changeIncomeExpendYebChooseValue = (value) => ({
      type: ActionTypes.CHANGE_INCOME_EXPEND_YEB_CHOOSE_VALUE,
      value,
})

export const initState = () => ({
      type: ActionTypes.INIT_INCOME_EXPEND_YEB
})
