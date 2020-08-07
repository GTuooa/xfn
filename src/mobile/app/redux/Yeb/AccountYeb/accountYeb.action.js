import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

export const getPeriodAndBalanceList = (begin,end, needPeriod = '') => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getAccountReportBalance', 'POST',JSON.stringify({
		begin: begin ? begin : '',
		end: end ? end : '',
        needPeriod: needPeriod
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            let  issuedateNew = begin
            if(needPeriod){
                const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
                issuedateNew = begin ? begin : openedissuedate
            }
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []

            dispatch({
                type: ActionTypes.GET_ACCOUNT_BALANCE_LIST,
                receivedData: json.data.accountBalanceList,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                endissuedate: end,
                getPeriod: needPeriod,
                issues,
            })
        }
	})
}
export const changeAccountYebChooseValue = (value) => ({
      type: ActionTypes.CHANGE_ACCOUNT_YEB_CHOOSE_VALUE,
      value,
})
export const initState = () => ({
      type: ActionTypes.INIT_ACCOUNT_YEB
})
