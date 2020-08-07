import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as ActionTypes from './ActionTypes.js'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import { pushVouhcerToLrpzReducer } from 'app/redux/Search/Cxpz/cxpz.action'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

// 单独获取科目列表(刷新用)
export const getOnlyMxbAclistFetch = (issuedate, endissuedate) => dispatch => {
	
	fetchApi('getreportacdetailtree', 'POST', JSON.stringify({
		begin: issuedate ? issuedate : '',
		end: endissuedate ? endissuedate : ''
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_MXB_ACLIST,
				receivedData: json.data.tree
			})
		}
	})
}

export const getMxbAclistFetch = (issuedate, endissuedate, currentAcid) => dispatch => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getreportacdetailtree', 'POST', JSON.stringify({
		begin: issuedate ? issuedate : '',
		end: endissuedate ? endissuedate : '',
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_MXB_ACLIST,
				receivedData: json.data.tree
			})
			dispatch(getSubsidiaryLedgerFetch({issuedate, endissuedate, acId: currentAcid, assId: '', assCategory: ''}))
			thirdParty.toast.hide()
		}
	})
}

// issuedate, endissuedate, acid, ass, showAss
export const getSubsidiaryLedgerFetch = (param) => dispatch => {

	const issuedate = param.issuedate
	const endissuedate = param.endissuedate
	const acId = param.acId
	const assCategory = param.assCategory
	const assId = param.assId

	// const info = ass ? ass.split('_') : []
	// const info = ass ? ass.split(Limit.TREE_JOIN_STR) : []

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getreportacdetail', 'POST', JSON.stringify({
		begin: issuedate ? issuedate :'',
		end: endissuedate ? endissuedate : '',
		acId,
		assCategory: assCategory ? assCategory : '',
		assId: assId ? assId : '',
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_SUBSIDIARY_LEDGER_FETCH,
				receivedData: json.data.detail,
				param
			})
			if (json.data.detail.needDownSize) {
				thirdParty.Alert('本次查询数据量较大，目前仅返回前7500条。若需查询后续数据，请缩小账期及科目范围。')
			}
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
			sessionStorage.setItem('router-from', 'mxb')
			history.push('/lrpz')
			dispatch(lrpzExportActions.setVcList(jvlist))
			dispatch(lrpzExportActions.setCkpzIsShow(true))
		}
	})
}

export const changeCascadeDisplay = () => ({
	type: ActionTypes.CHANGE_CASCADE_VISIBLE
})


export const reverseLedgerJvlist = () => ({
	type: ActionTypes.REVERSE_LEDGER_JV_LIST
})
//第二个参数代表是否需要把end还原成begin
export const changeMxbBeginDate = (begin, bool) => ({
	type: ActionTypes.CHANGE_MXB_BEGIN_DATE,
	begin,
	bool
})


export const changeAcMxbChooseValue = (value) => ({
	type: ActionTypes.CHANGE_AC_MXB_CHOOSE_VALUE,
	value,
})