import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { showMessage } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'

export const getPeriodAndFCMxbAclistFetch = (issuedate, endissuedate, fcNumber,currentPage, acid) => dispatch => {
    if (!issuedate) {
		allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(getFCMxbAclistFetch(issuedate, issuedate,fcNumber ,currentPage, acid)))
	} else if (issuedate === 'NO_VALID_ISSUE_DATE') {
		dispatch({
			type: ActionTypes.INIT_AMMXB
		})
	} else {
		allActions.refreshPeriodHandle(issuedate, dispatch, (issuedate) => dispatch(getFCMxbAclistFetch(issuedate, endissuedate ,fcNumber , currentPage,acid)), () => dispatch({type: ActionTypes.INIT_AMMXB}))
	}
}

// 获取明细表的aclist
export const getFCMxbAclistFetch = (issuedate, endissuedate, fcNumber ,currentPage, acid) => (dispatch, getState) => {

	const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
	const end = `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`

    fetchApi('getFCDetailAc', 'POST', JSON.stringify({
		begin,
		end,
		fcNumber:fcNumber ? fcNumber : '',
		acid : acid ? acid : '',
	}), json => {

		if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_FC_MXB_ACLIST,
				receivedData: json.data,
				fcNumber,
				acid,
            })

			if (!json.data[0]) {
				dispatch({
					type: ActionTypes.AFTER_GET_FC_MXB_NO_ACLIST,
					issuedate,
					endissuedate,
					fcNumber,
                	acid,
				})
				// thirdParty.Alert('当前月份无凭证')
                message.info('当前月份无凭证')
				// dispatch({
				// 	type: ActionTypes.INIT_FCMXB,
				// 	issuedate,
                //     endissuedate
				// })
			} 
			else {
					dispatch(getFCDetailListFetch(issuedate, endissuedate, fcNumber || json.data[0]&&json.data[0].fcNumber ,acid || json.data[0]&&json.data[0].acList.acid ))
					if(fcNumber && acid){
						const selectedKeys = fcNumber + Limit.TREE_JOIN_STR + acid 
						dispatch(changeTreeSelectedkeys(selectedKeys))
					}
					else{
						const selectedKeys =fcNumber || json.data[0]&&json.data[0].acList.fcNumber 
						dispatch(changeTreeSelectedkeys(selectedKeys))
					}
			}
		}
	})
}

export const getFCDetailListFetch = (issuedate, endissuedate, fcNumber, acid, asscategory, assid, currentPage='1') => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
	const end = `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`

    fetchApi('getFCDetail', 'POST', JSON.stringify({
		begin,
		end,
		fcNumber,
		acid : acid ? acid : '',
        asscategory: asscategory ? asscategory : '',
		assid: assid ? assid : '',
		currentPage: currentPage,
		pageSize: '500',
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_FC_DETAIL_FETCH,
				receivedData: json.data.pageData,
                issuedate,
                endissuedate,
                fcNumber,
                acid,
                asscategory,
				assid,
				currentPage:json.data.currentPage,
				pageCount:json.data.pageCount
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const changeTreeSelectedkeys = (selectedKeys) => ({
    type: ActionTypes.CHANGE_TREE_SELECTED_KEYS_FC,
    selectedKeys
})

export const changeFCMxbChooseMorePeriods = (bool) => ({
    type: ActionTypes.CHANGE_FC_MXB_CHOOSR_MORE_PERIODS,
    bool
})
