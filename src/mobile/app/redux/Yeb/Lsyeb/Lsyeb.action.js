import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.account'

import * as allActions from 'app/redux/Home/All/other.action'
import * as lsmxbActions from 'app/redux/Mxb/Lsmxb/lsmxb.action'

import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

export const getPeriodAndBalanceList = (issuedate,endissuedate,getPeriod) => (dispatch,getState) => {
	let url = ''
	let options = {}
	if (!endissuedate) {//单账期
		url = 'getbalist'
		options = {
			year: issuedate ? issuedate.substr(0, 4) : '',
			month: issuedate ? issuedate.substr(5, 2) : '',
			getPeriod
		}

	} else {//多账期
		url = 'getbamorelist'
		options = {
			beginYear: issuedate ? issuedate.substr(0, 4) : '',
			beginMonth: issuedate ? issuedate.substr(5, 2) : '',
			endYear: endissuedate ? endissuedate.substr(0, 4) : issuedate.substr(0, 4),
			endMonth: endissuedate ? endissuedate.substr(5, 2) : issuedate.substr(5, 2),
			getPeriod
		}
	}

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getBusinessBalanceList', 'POST',JSON.stringify(options),json => {
        if (showMessage(json)) {
			thirdParty.toast.hide()
			const baList = {data: json.data.result}
			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate

			if(!endissuedate){
				const period = {data:json.data.periodDtoJson}
				dispatch(freshLsyeb(baList, issuedateNew, '',period,getPeriod))
			}else{
				dispatch(freshLsyeb(baList, issuedateNew, endissuedate))
			}
        }
	})
}

const freshLsyeb = (json, issuedate, endissuedate, period,getPeriod) => dispatch => {
	dispatch({
		type: ActionTypes.GET_BALANCE_LIST,
		receivedData: json,
		issuedate,
		endissuedate,
		period,
		getPeriod
	})
}

export const accountBalanceTriangleSwitch = (showChild, uuid) => ({
      type: ActionTypes.ACCOUNTCONF_BALANCE_TRIANGLE_SWITCH,
      showChild,
      uuid
  })
