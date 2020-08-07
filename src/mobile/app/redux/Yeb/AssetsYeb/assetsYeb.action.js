import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const AllZcyebFetch = (issuedate, endissuedate) => dispatch => {
	dispatch(getPeriodAndAssetsDetailFetch(issuedate, endissuedate, 'true'))
}

export const getPeriodAndAssetsDetailFetch = (issuedate,endissuedate,getPeriod) => dispatch => {
	const begin = issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : ''
	const end = endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : begin
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getassetsdetailmore', 'POST', JSON.stringify({begin,end,getPeriod}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
			dispatch(freshAssetsKmyeb(json.data.mainData.detailList, issuedateNew, ''))
		}
	})
}

export const getAssetsDetailFetch = (issuedate, endissuedate) => dispatch => {
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

export const toggleLowerDetailAssets = (serialNumber) => ({
	type: ActionTypes.TOGGLELOWERDETAILASSETS,
	serialNumber
})

export const getDetailListSingle = (serialNumber, serialName, prePage,issuedate,endissuedate) => dispatch => {
	const begin = issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : ''
	const end = endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : begin
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getMxList', 'POST', JSON.stringify({begin,end,serialNumber}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_DETAIL_LIST_SINGLE,
				serialNumber,
				serialName,
				prePage,
				issuedate,
				endissuedate,
				receivedData:json.data.mainData
			})
		}
	})
}

export const changeAssetsMxbCurrentPage = (currentPage) => ({
	type: ActionTypes.CHANGE_ASSETS_MXB_CURRENTPAGE,
	currentPage
})