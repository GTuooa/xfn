import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { showMessage } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

export const getPeriodAndBalistFetch = (issuedate, endissuedate) => dispatch => {
    if(!issuedate){
		allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(AllGetCurrencyYebListFetch(issuedate, issuedate)))

	} else {
		allActions.refreshPeriodHandle(issuedate, dispatch, (issuedate) => dispatch(AllGetCurrencyYebListFetch(issuedate, endissuedate)), () => dispatch({type: ActionTypes.INIT_CURRENCYYEB}))
	}
}

export const AllGetCurrencyYebListFetch = (issuedate, endissuedate) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getFCYebList', 'POST', JSON.stringify({
        begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
        end: `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.ALL_GET_CURRENCY_YEB_LIST_FETCH,
                receivedData: json.data,
                issuedate,
                endissuedate
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const showCurrencyChildItiem = (fcNumber) => ({
	type: ActionTypes.SHOW_CURRENCY_CHILD_ITIEM,
	fcNumber
})
export const changeFCYebChooseMorePeriods = () => ({
    type: ActionTypes.CHANGE_FC_YEB_CHOOSE_MORE_PERIODS
})

export const changeCurrencyYebShow = () => ({
    type: ActionTypes.CHANGE_CURRENCY_YEB_SHOW
})
