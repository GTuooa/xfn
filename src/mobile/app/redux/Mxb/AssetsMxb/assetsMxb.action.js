import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from 'app/constants/ActionTypes.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

export const getAssetsDetailFetch = (issuedate, endissuedate) => dispatch => {
	// fetchApi('getassetsdetail', 'POST', JSON.stringify(jsonifyDate(issuedate)), json => {
	// 	showMessage(json) &&
	// 	dispatch(freshAssetsKmyeb(json, issuedate))
	// })
	const begin = issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : ''
	const end = endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : begin

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getassetsdetailmore', 'POST', JSON.stringify({begin,end}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch(freshAssetsKmyeb(json.data.mainData.detailList, issuedate, endissuedate))
		}
	})

}

const freshAssetsKmyeb = (json, issuedate, endissuedate) => dispatch => {
	dispatch({
		type: ActionTypes.GET_ASSETS_DETAILFETCH,
		receivedData: json,
		issuedate,
		endissuedate
	})
}

export const getDetailListSingle = (serialNumber, serialName, prePage) => ({
	type: ActionTypes.GET_DETAIL_LIST_SINGLE,
	serialNumber,
	serialName,
	prePage
})
