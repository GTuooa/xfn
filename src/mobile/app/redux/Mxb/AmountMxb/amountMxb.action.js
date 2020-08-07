import { showMessage, jsonifyDate } from 'app/utils'
import { fromJS, toJS }	from 'immutable'
import fetchApi from 'app/constants/fetch.constant'
import * as ActionTypes from './ActionTypes.js'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import { pushVouhcerToLrpzReducer } from 'app/redux/Search/Cxpz/cxpz.action'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

export const getAmountMxbAclist = (issuedate, endissuedate, currentAcid, ass) => dispatch => {
	const date = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
	const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : date
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

	fetchApi('getmxbaclist', 'POST', JSON.stringify({
		begin: date,
		end: end,
		needCount: "true"
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_AMOUNT_MXB_ACLIST,
				receivedData: json
			})
			dispatch(getAmountMxbSubsidiaryLedgerFetch(issuedate, endissuedate, currentAcid, ass))
		}
	})
}

export const getAmountMxbSubsidiaryLedgerFetch = (issuedate, endissuedate, acid, ass, showAss) => dispatch => {

	const info = ass ? ass.split(Limit.TREE_JOIN_STR) : []

	const date = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
	const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : date

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getsubsidiaryledger', 'POST', JSON.stringify({
		begin: date,
		end: end,
		acid,
		asscategory: ass ? info[0] : '',
		assid: ass ? info[1] : ''
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_AMOUNT_MXB_SUBSIDIARY_LEDGER_FETCH,
				receivedData: json.data.numberDetails,
				issuedate,
				endissuedate,
				currentAcid: acid,
				// currentAss: ass || ''
				currentAss: showAss || ''
			})
			dispatch(changeData(['views', 'queryByAss'], false))
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
			sessionStorage.setItem('router-from', 'amountmxb')
			history.push('/lrpz')
			dispatch(lrpzExportActions.setVcList(jvlist))
			dispatch(lrpzExportActions.setCkpzIsShow(true))
		}
	})
}

export const changeData = (dataType, value) => ({
    type: ActionTypes.CHANGE_DATA_AMOUNTMXB,
    dataType,
    value
})

export const changeShortData = (dataType, value) => ({
    type: ActionTypes.CHANGE_SHORT_DATA_AMOUNTMXB,
    dataType,
    value
})

export const getAmountMxByAss = (issuedate, endissuedate) => (dispatch, getState) => {

	const date = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
	const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : date
	const mxAssObj = getState().amountMxbState.get('mxAssObj').toJS()

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getAmountMxByAss', 'POST', JSON.stringify({
		begin: date,
		end: end,
		...mxAssObj
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch(changeData(['views', 'queryByAss'], true))
			dispatch(changeShortData('issuedate', issuedate))
			dispatch(changeShortData('endissuedate', endissuedate))
			dispatch(changeShortData('ledger', fromJS(json.data)))
			dispatch(changeData(['views', 'currentPage'], 1))
		}
	})
}

export const getAmountMxTerrByAss = (issuedate, endissuedate) => (dispatch, getState) => {

	const date = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
	const end = endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : date
	const mxAssObj = getState().amountMxbState.get('mxAssObj').toJS()

	fetchApi('getAmountMxTerrByAss', 'POST', JSON.stringify({
		begin: date,
		end: end,
		assCategory: mxAssObj['assCategory']
	}), json => {
		if (showMessage(json)) {
			let acTree = [], assTree = [{uuid: '', name: '全部', assid: '', assname: '全部'}]
			for (let item of json.data) {
				if (item['assid']==mxAssObj['assId']) {
					item['acDtoList'].forEach(v => {
						v['childList'] = []
						v['key'] = v['acid']
						v['label'] = `${v['acid']} ${v['acfullname']}`

						if (v['acid']==mxAssObj['acId']) {
							v['assList'].forEach(w => {
								w['uuid'] = w['assid']
								w['name'] = w['assname']
								w['disabled'] = w['disableTime'] ? true : false
								assTree.push(w)
							})
						}
					})
					acTree = item['acDtoList']
					break
				}
			}
			acTree.unshift({acid: '', acname: '全部科目', key: '', label: '全部科目', childList: [], assList: []})
			dispatch(changeShortData('acTree', fromJS(acTree)))
			dispatch(changeShortData('assTree', fromJS(assTree)))
		}
	})
}

export const initMxAssObj = () => (dispatch) => {
	dispatch(changeData(['mxAssObj', 'acId'], ''))
	dispatch(changeData(['mxAssObj', 'acName'], '全部科目'))
	dispatch(changeData(['mxAssObj', 'assCategoryTwo'], ''))
	dispatch(changeData(['mxAssObj', 'assIdTwo'], ''))
	dispatch(changeData(['mxAssObj', 'assNameTwo'], '全部'))
}
