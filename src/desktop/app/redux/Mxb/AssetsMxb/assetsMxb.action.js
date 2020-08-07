import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'

// 资产明细表
export const getPeriodAndMxbAssetsFetch = (issuedate, endissuedate, serialNumber = '1', label,currentPage) => dispatch => {
	dispatch(AllGetAssetsMxbListFetch(issuedate, endissuedate, serialNumber, label, 'true',currentPage))
}

//top树的数据
export const getAssetsListFetch = () => dispatch => {
    fetchApi('initclassification', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_ASSESTS_LIST_FETCH,
                receivedData: json.data
            })
        }
    })
	fetchApi('getlabelList', 'GET', '', json => {
		showMessage(json) && dispatch({
			type: ActionTypes.GET_ASSESTS_TREE_FETCH,
			receivedData: json.data
		})
	})
}

//折旧摊新明细表的数据
export const getMxListFetch = (issuedate, endissuedate, serialNumber,currentPage) => dispatch => {
    // fetchApi('getMxList', 'POST', JSON.stringify({
    //     year: issuedate.substr(0, 4),
    //     month: issuedate.substr(6, 2),
    //     serialNumber:serialNumber
    // }), json => {
    //     if (showMessage(json)) {
    //         dispatch({
    //             type: ActionTypes.GET_MX_LIST_FETCH,
    //             receivedData: json.data,
	// 			issuedate,
	// 			serialNumber
    //         })
    //     }
    // })
	dispatch(AllGetAssetsMxbListFetch(issuedate, endissuedate, serialNumber,currentPage))
}

//折旧摊新明细表的数据byLabel
export const getMxListByLabelFetch = (issuedate, endissuedate, label,currentPage) => dispatch => {
    // fetchApi('getMxList', 'POST', JSON.stringify({
	// 	year: issuedate.substr(0, 4),
    //     month: issuedate.substr(6, 2),
	// 	label:serialNumber
	// }), json => {
    //     if (showMessage(json)) {
    //         dispatch({
    //             type: ActionTypes.GET_MX_LIST_FETCH,
    //             receivedData: json.data,
	// 			issuedate,
	// 			serialNumber
    //         })
    //     }
    // })
	dispatch(AllGetAssetsMxbListFetch(issuedate, endissuedate, '', label,currentPage))
}

const AllGetAssetsMxbListFetch = (issuedate, endissuedate, serialNumber, label, getPeriod,currentPage='1') => dispatch => {

	const options = label ?
		{
			begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
			end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : '',
			label,
			getPeriod,
			currentPage:currentPage,
			pageSize: '500',
		} : {
			begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
			end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : '',
			serialNumber,
			getPeriod,
			currentPage:currentPage,
			pageSize: '500',
		}


	fetchApi('getMxList', 'POST', JSON.stringify(options), json => {
        if (showMessage(json)) {

			if (getPeriod == 'true') {

				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate
				const endissuedateNew = endissuedate ? endissuedate : openedissuedate
				dispatch(freshAssetsMxbList(json.data.mainData, issuedateNew, endissuedateNew, serialNumber ? serialNumber : label, json.data.currentPage,json.data.pageCount))

			} else {

				dispatch(freshAssetsMxbList(json.data.mainData, issuedate, endissuedate, serialNumber ? serialNumber : label, json.data.currentPage,json.data.pageCount))
			}

        } else {
			return
        }
    })
}

const freshAssetsMxbList = (data, issuedate, endissuedate, serialNumber,currentPage,pageCount) => dispatch => {

	dispatch({
		type: ActionTypes.GET_MX_LIST_FETCH,
		receivedData: data,
		issuedate,
		endissuedate,
		serialNumber,
		currentPage,
		pageCount,
	})
}

export const changeAssetsMxbChooseMorePeriods = (bool) => ({
	type: ActionTypes.CHANGE_ASSETS_MXB_CHOOSE_MORE_PERIODS,
	bool
})
