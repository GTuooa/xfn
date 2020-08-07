import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'

// 资产余额表
export const getPeriodAndDetailAssetsFetch = (issuedate, endissuedate) => dispatch => {
	dispatch(AllZcyebFetch(issuedate, endissuedate, 'true'))
}

//折旧摊新余额表的数据
export const getDetailAssetsFetch = (issuedate, endissuedate) => dispatch => {
	dispatch(AllZcyebFetch(issuedate, endissuedate))
}

const AllZcyebFetch = (issuedate, endissuedate, getPeriod) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getDetailAssets', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : '',
		getPeriod
    }), json => {
        if (showMessage(json)) {

			if (getPeriod == 'true') {

				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate
				const endissuedateNew = endissuedate ? endissuedate : openedissuedate

				dispatch(freshZcyeb(json.data.mainData, issuedateNew, endissuedateNew))

			} else {
				dispatch(freshZcyeb(json.data.mainData, issuedate, endissuedate))
			}

        } else {
			return
        }

		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

const freshZcyeb = (data, issuedate, endissuedate) => dispatch => {

	dispatch({
		type: ActionTypes.GET_DETAIL_ASSETS_FETCH,
		receivedData: data,
		issuedate,
		endissuedate
	})
}

export const changeAssetsYebChooseMorePeriods = () => ({
	type: ActionTypes.CHANGE_ASSETSYEB_CHOOSE_MORE_PERIODS
})

export const changeDetailChildShow = (serialNumber) => ({
    type: ActionTypes.CHANGE_DETAILCHILDSHOW,
    serialNumber
})


// 资产明细表
// export const getPeriodAndMxbAssetsFetch = (issuedate, serialNumber = '1', label) => dispatch => {
// 	// if (!issuedate) {
// 	// 	allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(getMxListFetch(issuedate, '1')))
// 	// }
//
// 	dispatch(AllGetAssetsMxbListFetch(issuedate, serialNumber, label, 'true'))
// }
//
// //top树的数据
// // export const getAssetsListFetch = () => dispatch => {
// //     fetchApi('initclassification', 'GET', '', json => {
// //         if (showMessage(json)) {
// //             dispatch({
// //                 type: ActionTypes.GET_ASSESTS_LIST_FETCH,
// //                 receivedData: json.data
// //             })
// //         }
// //     })
// // 	fetchApi('getlabelList', 'GET', '', json => {
// // 		showMessage(json) && dispatch({
// // 			type: ActionTypes.GET_ASSESTS_TREE_FETCH,
// // 			receivedData: json.data
// // 		})
// // 	})
// // }
//
// //折旧摊新明细表的数据
// export const getMxListFetch = (issuedate, serialNumber) => dispatch => {
//     // fetchApi('getMxList', 'POST', JSON.stringify({
//     //     year: issuedate.substr(0, 4),
//     //     month: issuedate.substr(6, 2),
//     //     serialNumber:serialNumber
//     // }), json => {
//     //     if (showMessage(json)) {
//     //         dispatch({
//     //             type: ActionTypes.GET_MX_LIST_FETCH,
//     //             receivedData: json.data,
// 	// 			issuedate,
// 	// 			serialNumber
//     //         })
//     //     }
//     // })
// 	dispatch(AllGetAssetsMxbListFetch(issuedate, serialNumber))
// }
//
// //折旧摊新明细表的数据byLabel
// export const getMxListByLabelFetch = (issuedate, label) => dispatch => {
//     // fetchApi('getMxList', 'POST', JSON.stringify({
// 	// 	year: issuedate.substr(0, 4),
//     //     month: issuedate.substr(6, 2),
// 	// 	label:serialNumber
// 	// }), json => {
//     //     if (showMessage(json)) {
//     //         dispatch({
//     //             type: ActionTypes.GET_MX_LIST_FETCH,
//     //             receivedData: json.data,
// 	// 			issuedate,
// 	// 			serialNumber
//     //         })
//     //     }
//     // })
// 	dispatch(AllGetAssetsMxbListFetch(issuedate, '', label))
// }
//
// const AllGetAssetsMxbListFetch = (issuedate, serialNumber, label, getPeriod) => dispatch => {
//
// 	const options = label ?
// 		{
// 			year: issuedate ? issuedate.substr(0, 4) : '',
// 			month: issuedate ? issuedate.substr(6, 2) : '',
// 			label,
// 			getPeriod
// 		} : {
// 			year: issuedate ? issuedate.substr(0, 4) : '',
// 			month: issuedate ? issuedate.substr(6, 2) : '',
// 			serialNumber,
// 			getPeriod
// 		}
//
//
// 	fetchApi('getMxList', 'POST', JSON.stringify(options), json => {
//         if (showMessage(json)) {
//
// 			if (getPeriod == 'true') {
//
// 				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
// 				const issuedateNew = issuedate ? issuedate : openedissuedate
//
// 				dispatch(freshAssetsMxbList(json.data.dtoList, issuedateNew, serialNumber ? serialNumber : label))
//
// 			} else {
//
// 				dispatch(freshAssetsMxbList(json.data, issuedate, serialNumber ? serialNumber : label))
// 			}
//
//         } else {
// 			return
//         }
//     })
// }
//
// const freshAssetsMxbList = (data, issuedate, serialNumber) => dispatch => {
//
// 	dispatch({
// 		type: ActionTypes.GET_MX_LIST_FETCH,
// 		receivedData: data,
// 		issuedate,
// 		serialNumber
// 	})
//
// }
