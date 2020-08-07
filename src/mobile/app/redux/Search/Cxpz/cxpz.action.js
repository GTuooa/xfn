import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getPeriodAndVcListFetch = (issuedate, currentPage = 0) => dispatch => {
	// if (!issuedate) {
	// 	allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(pagingVc(issuedate)))
	// } else {
	// 	fetchApi('getperiod', 'GET', '', json => {
	// 		if (showMessage(json)) {
	// 			dispatch({
	// 				type: ActionTypes.GET_PERIOD_FETCH,
	// 				receivedData: json
	// 			})
	// 			dispatch(pagingVc(issuedate))
	// 		}
	// 	})
	// }
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('pagindvc', 'POST', JSON.stringify({
		year: issuedate ? issuedate.substr(0,4) : '',
		month: issuedate ? issuedate.substr(5,2) : '',
		pageSize: 20,
		currentPage: currentPage + 1,
		getPeriod: 'true'
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
			const assKmyebList = {data: json.data.jsonArray}

			// const vclist = {data: json.data.jsonArray}

			dispatch({
				type: ActionTypes.AFTER_PAGING_VC,
				receivedData: json,
				issuedate: issuedateNew,
				currentPage
			})
		}
	})
}

export const getVcListFetch = (_issuedate) => dispatch => {
	// console.log('issuedate', issuedate);

	const issuedate = _issuedate.substring(0,7)
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getvclist', 'POST', JSON.stringify(jsonifyDate(_issuedate)), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_VC_LIST_FETCH,
				receivedData: json,
				issuedate
			})
		}
	})
}

// 查询凭证整理功能
// sort：‘1’，表示断号重排
// sort：‘2’，表示日期重排
export const getSortVcFetch = (issuedate , index) => dispatch => {
	if (index == 0)
		return

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('sortvc', 'POST', JSON.stringify({
		year: issuedate.substr(0, 4),
		month: issuedate.substr(5, 2),
		sort: index
	}), json => {
		// showMessage(json, 'show', 800) && dispatch(getVcListFetch(issuedate))
		if (showMessage(json, 'show', 800)) {
			dispatch(pagingVc(issuedate))
		}
	})
}


export const deleteVcFetch = (state) => (dispatch, getState) => {
	const vcList = state.get('vclist')
	const has = vcList.filter(v => v.get('selected')).some(v => v.get('enclosurecount'))
	const message = has ? '凭证下存在附件,附件也将被删除' : '确定删除吗'
	thirdParty.Confirm({
		message: message,
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {

				const vclist = state.get('vclist')
				const vcindexlist = state.get('vclist').filter(v => v.get('selected')).map(v => v.get('vcindex'))
				const selectall = vclist.size === vcindexlist.size ? true : false

				thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
				fetchApi('deletevc', 'POST', JSON.stringify({
					year: state.getIn(['vclist', 0, 'year']),
					month: state.getIn(['vclist', 0, 'month']),
					vcindexlist,
					action: 'QUERY_VC-DELETE_VC-BATCH_DELETE'
				}), json => {
					if (showMessage(json)) {
						dispatch({
							type: ActionTypes.DELETE_VC_FETCH,
							receivedData: json
						})

						fetchApi('getperiod', 'GET', '', json => {
							if (showMessage(json)) {
								thirdParty.toast.hide()

								dispatch({
									type: ActionTypes.GET_PERIOD_FETCH,
									receivedData: json
								})
							}
						})

						if (selectall) {
							const issuedate = `${state.getIn(['vclist', 0, 'year'])}-${state.getIn(['vclist', 0, 'month'])}`

							dispatch(pagingVc(issuedate))
						}
						dispatch(cancelChangeVcCheckBoxDisplay())
					}
				})
			}
		},
		onFail : (err) => alert(err)
	})
}

export const pagingVc = (_issuedate, currentPage = 0, fromScroll = false, _self) => (dispatch, getState) => {
	// const _data = issuedate.replace(/\D/g, '')
	// const year = _data.substr(0, 4)
	// const month = _data.length === 6 ? _data.substr(4, 2) : '0' + _data.substr(-1)
	const jsonDate = jsonifyDate(_issuedate)
	const issuedate = _issuedate.substring(0,7)
	const cxpzState = getState().cxpzState
	const searchContentType = cxpzState.get('searchContentType')
	const condition = cxpzState.get('condition')
	// console.log(issuedate)
	// const currentPage = cxpzState.get('currentPage')
	//fromScroll 是否是下拉加载 true 是
	!fromScroll && thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('pagindvc', 'POST', JSON.stringify({
		...jsonDate,
		pageSize: 20,
		currentPage: currentPage + 1,
		searchContentType,
		condition,
	}), json => {
		!fromScroll && thirdParty.toast.hide()
		if (showMessage(json)) {
			if(fromScroll) {
				_self.setState({
					isLoading: false
				})
			}
			dispatch({
				type: ActionTypes.AFTER_PAGING_VC,
				receivedData: json,
				issuedate,
				currentPage
			})
		}
	})
}

export const selectVc = idx => ({
	type: ActionTypes.SELECT_VC,
	idx
})

export const selectVcAll = () => ({
	type: ActionTypes.SELECT_VC_ALL
})

export const changeVcCheckBoxDisplay = idx => ({
	type: ActionTypes.CHANGE_ALL_VC_CHECKBOX_DISPLAY,
	idx
})

export const cancelChangeVcCheckBoxDisplay = () => ({
	type: ActionTypes.CANCEL_CHANGE_VC_CHECKBOX_DISPALY
})

// export const sortAndChangeVcId = () => ({
// 	type: ActionTypes.SORT_AND_CHANGE_VC_ID
// })

export const reverseVcList = () => ({
	type: ActionTypes.REVERSE_VC_LIST
})

export const pushVouhcerToLrpzReducer = (voucher) => ({
	type: ActionTypes.PUSH_VOUCHER_TO_LRPZ_REDUCER,
	voucher
})
//发送附件管理需要的数据
export const setFjglData = () => (dispatch,getState) =>{
	const issuedate = getState().cxpzState.get('issuedate');
	dispatch({
		type: ActionTypes.CHANGE_FJGL_ISSUEDATE,
		issuedate
	})
}

export const changeData = (dataType, value) => ({
	type: ActionTypes.CXPZ_CHANGE_DATA,
	dataType, 
	value,
})

//审核
export const reviewedJvlist = (issuedate) => (dispatch, getState) => {
	
	const cxpzState = getState().cxpzState
	const vclist = cxpzState.get('vclist')
	const issuedateArr = issuedate.split('-')

	let vcindexlist = []
	vclist.forEach(v => {
		if (v.get('selected') && !v.get('reviewedby')) {
			vcindexlist.push(v.get('vcindex'))
		}
	})

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('reviewvc', 'POST', JSON.stringify({
		year: issuedateArr[0],
		month: issuedateArr[1],
		vcindexlist,
		action: 'QUERY_VC-AUDIT',
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			if (json.data.success == 0) {
				thirdParty.Alert(json.data.failList.join('、'))
			}
			dispatch(pagingVc(issuedate))
		}
	})
}

//反审核
export const cancelReviewedJvlist = (issuedate) => (dispatch, getState) => {
	const cxpzState = getState().cxpzState
	const vclist = cxpzState.get('vclist')
	const issuedateArr = issuedate.split('-')

	let vcindexlist = []
	vclist.forEach(v => {
		if (v.get('selected') && v.get('reviewedby')) {
			vcindexlist.push(v.get('vcindex'))
		}
	})

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('backreviewvc', 'POST', JSON.stringify({
		year: issuedateArr[0],
		month: issuedateArr[1],
		vcindexlist,
		action: 'QUERY_VC-CANCEL_AUDIT',
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			if (json.data.success == 0) {
				thirdParty.Alert(json.data.failList.join('、'))
			}
			dispatch(pagingVc(issuedate))
		}
	})
}
