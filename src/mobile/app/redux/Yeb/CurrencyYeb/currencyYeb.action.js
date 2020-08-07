import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

export const getPeriodAndCurrencyListFetch = (issuedate, endissuedate) => dispatch => {

    if (!issuedate) {
		allActions.getPeriodFetch('', dispatch, (issuedate, endissuedate) => dispatch(AllGetCurrencyYebListFetch(issuedate, endissuedate)))
	} else {
        fetchApi('getperiod', 'GET', '', json => {
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.GET_PERIOD_FETCH,
					receivedData: json
				})
				dispatch(AllGetCurrencyYebListFetch(issuedate, endissuedate))
			}
		})
    }
}

export const AllGetCurrencyYebListFetch = (issuedate, endissuedate) => dispatch => {
    const end = endissuedate ? endissuedate : issuedate
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getFCYebList', 'POST', JSON.stringify({
        begin: `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}`,
        end: `${end.substr(0, 4)}${end.substr(5, 2)}`
    }), json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.ALL_GET_CURRENCY_YEB_LIST_FETCH,
                receivedData: json.data,
                issuedate,
                endissuedate
            })
        }
    })
}
//第二个参数代表是否需要把end还原成begin
export const changeCurYebBeginDate = (begin, bool) => ({
	type: ActionTypes.CHANGE_CUR_YEB_BEGIN_DATE,
	begin,
	bool
})
export const showCurrencyBaChildItiem = (fcNumber) => ({
	type: ActionTypes.SHOW_CURRENCY_BACHILD_ITIEM,
	fcNumber
})
