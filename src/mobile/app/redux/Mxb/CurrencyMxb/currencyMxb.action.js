import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import { pushVouhcerToLrpzReducer } from 'app/redux/Search/Cxpz/cxpz.action'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getCurrencyMxbAcListFetch = (fcNumber, issuedate, endissuedate,acid,acName) => dispatch => {
    const date = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
    const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : date
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getFCDetailAc', 'POST', JSON.stringify({
        begin: date,
        end: end
    }), json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.GET_CURRENCY_MXB_ACLIST,
                receivedData: json.data
			})
			dispatch({
                type: ActionTypes.GET_CURRENCY_MXB_ACNAME,
				acid:acid,
				acName:acName,
            })
			dispatch(getCurrencyDetailListFetch(issuedate, endissuedate, fcNumber,acid,acName))
        }
    })
}

export const getCurrencyDetailListFetch = (issuedate, endissuedate, fcNumber, acid,acName, asscategory, assid) => dispatch => {
	const date = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
    const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : date
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getFCDetail', 'POST', JSON.stringify({
		begin: date,
		end: end,
		fcNumber,
		acid : acid ? acid : '',
        asscategory: asscategory ? asscategory : '',
		assid: assid ? assid : '',
	}), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_CURRENCY_DETAIL_FETCH,
				receivedData: json.data,
                issuedate,
                endissuedate,
                fcNumber,
				acid: acid ? acid : '',
			})
		}
	})
}

export const getVcFetch = (issuedate, vcindex, history,jvlist) => dispatch => {
	const jsonDate = jsonifyDate(issuedate)
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getvc', 'POST', JSON.stringify({
		...jsonDate,
		vcindex
	}), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
			sessionStorage.setItem('lrpzHandleMode', 'modify')
			dispatch(pushVouhcerToLrpzReducer(json.data))
			sessionStorage.setItem('router-from', 'currencymxb')
			history.push('/lrpz')
            dispatch(lrpzExportActions.setVcList(jvlist))
			dispatch(lrpzExportActions.setCkpzIsShow(true))
		}
	})
}
//第二个参数代表是否需要把end还原成begin
export const changeCurMxbBeginDate = (begin, bool) => ({
	type: ActionTypes.CHANGE_CUR_MXB_BEGIN_DATE,
	begin,
	bool
})
export const changeCurrencyCurrentPage = (currentPage) => ({
	type: ActionTypes.CHANGE_CURRENCY_CURRENTPAGE,
	currentPage
})
