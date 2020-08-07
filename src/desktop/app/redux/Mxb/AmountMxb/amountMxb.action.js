import { showMessage, jsonifyDate } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.constant.js'
import * as thirdParty from 'app/thirdParty'
import { fromJS } from 'immutable'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as Limit from 'app/constants/Limit.js'
import { message } from 'antd'

// 明细表刷新操作，用于重新获取账期
export const getPeriodAndMxbAclistFetch = (issuedate, endissuedate, acid, asscategory, assid,currentPage=1) => dispatch => {
	dispatch(AllGetAmountAclistListFetch(issuedate, endissuedate, acid, asscategory, assid, '', 'true',currentPage))
}

// 获取明细表的aclist
export const getMxbAclistFetch = (issuedate, endissuedate, currentAcid, asscategory, assid, chooseperiods) => dispatch => {
	dispatch(AllGetAmountAclistListFetch(issuedate, endissuedate, currentAcid, asscategory, assid, chooseperiods))
}

const AllGetAmountAclistListFetch = (issuedate, endissuedate, acid, asscategory, assid, chooseperiods, getPeriod,currentPage) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getmxbaclist', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : '',
		// end: endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`,
		end: endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : issuedate?`${issuedate.substr(0,4)}${issuedate.substr(6,2)}`:'',
		needCount:"true",
		getPeriod
	}), json => {

		if (showMessage(json)) {

			if (getPeriod == 'true') {

				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate
				const endissuedateNew = endissuedate ? endissuedate : openedissuedate

				dispatch({
					type: ActionTypes.GET_AMMXB_ACLIST,
					receivedData: json.data.jsonArray
				})
				if (!json.data.jsonArray[0]) {
					dispatch({
						type: ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_FETCH_NOAC_AM,
						issuedate: issuedateNew,
						endissuedate: endissuedateNew
					})
					// thirdParty.Alert('当前月份无凭证')
					message.info('当前月份无凭证')
					dispatch({
						type: ActionTypes.INIT_AMMXB,
						issuedate: issuedateNew,
						endissuedate: endissuedateNew
					})
				} else {
					dispatch(getSubsidiaryLedgerFetch(issuedateNew, endissuedateNew, '', acid || json.data.jsonArray[0].acid, asscategory, assid,currentPage))
				}

			} else {

				dispatch({
					type: ActionTypes.GET_AMMXB_ACLIST,
					receivedData: json.data
				})
				if (!json.data[0]) {
					dispatch({
						type: ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_FETCH_NOAC_AM,
						issuedate,
						endissuedate
					})
					// thirdParty.Alert('当前月份无凭证')
					message.info('当前月份无凭证')
					dispatch({
						type: ActionTypes.INIT_AMMXB,
						issuedate,
						endissuedate
					})
				} else {
					dispatch(getSubsidiaryLedgerFetch(issuedate, endissuedate, '', acid || json.data[0].acid, asscategory, assid,currentPage))
				}

			}

		} else {
			dispatch({type: ActionTypes.INIT_AMMXB})
		}

		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	})

	if (issuedate !== endissuedate) {
		if (chooseperiods)
			dispatch(changeMxbChooseMorePeriods(chooseperiods))
	} else {
		if (issuedate && !endissuedate) {
			dispatch(changeMxbChooseMorePeriods(false))
		}
	}

}

export const getMxbAsslistFetch = (issuedate, endissuedate, assCategory, acId,acName, assId,assName,assIdTwo='',assCategoryTwo='',assidTwoName,currentPage=1) => (dispatch,getState) => {
	if (!assCategory) {
		assCategory = dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
	}
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getmxbasslist', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : '',
		// end: endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`,
		end: endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : issuedate?`${issuedate.substr(0,4)}${issuedate.substr(6,2)}`:'',
		getPeriod:'true',
		assCategory,
	}), json => {
		if (showMessage(json)) {
			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
			const endissuedateNew = endissuedate ? endissuedate : openedissuedate
			dispatch({
				type: ActionTypes.GET_AMMXB_ASSLIST,
				receivedData: json.data.jsonArray,
				assCategory
			})
			if (!json.data.jsonArray[0]) {
				dispatch({
					type: ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_AM_FETCH,
					receivedData: [],
					issuedate,
					endissuedate,
					beSupport:true,
					assCategory
				})
				message.info('当前月份无凭证')
				// dispatch({
				// 	type: ActionTypes.INIT_AMMXB,
				// 	issuedate,
				// 	endissuedate
				// })
			} else {
				assId = assId || json.data.jsonArray[0].assid
				assName = assName || json.data.jsonArray[0].assname
				dispatch(getAssSubsidiaryLedgerFetch(issuedate, endissuedate, assCategory, acId,acName, assId,assName,assIdTwo,assCategoryTwo,assidTwoName,currentPage))
			}
		} else {
			dispatch({type: ActionTypes.INIT_AMMXB})
		}

		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	})

}


// 获取明细表的subsidiaryledger数据
// 树形结构传info，别的表格跳转传具体的
export const getSubsidiaryLedgerFetch = (issuedate, endissuedate, info, clickAcid, clickAsscategory, clickAssid,currentPage = '1', ) => dispatch => {

	let acid = ''
	let assid = ''
	let asscategory = ''

	if (info) {
		// const infoArr = info.split(' ')
		const infoArr = info.split(Limit.TREE_JOIN_STR)
		acid = infoArr[0]
		assid = (infoArr[1] === 'asscategory' ? '' : infoArr[1]) || '',
		asscategory = infoArr[2] || ''
	} else {
		acid = clickAcid ? clickAcid : ''
		assid = clickAssid ? clickAssid : '',
		asscategory = clickAsscategory ? clickAsscategory : ''
	}

	if (!issuedate)
		return

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
	const end = endissuedate?`${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`:`${issuedate.substr(0,4)}${issuedate.substr(6,2)}`

	fetchApi('getsubsidiaryledger', 'POST', JSON.stringify({
		begin,
		end,
		acid,
		assid,
		asscategory,
		currentPage: currentPage,
		pageSize: '500',
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_AM_FETCH,
				receivedData: json.data.pageData,
				issuedate,
				endissuedate,
				acId: acid,
				currentAsscategory: asscategory,
				currentPage: json.data.currentPage,
				pageCount: json.data.pageCount,
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const getAssSubsidiaryLedgerFetch = (issuedate, endissuedate, clickAsscategory, clickAcid,acName, clickAssid,assName,assIdTwo='',assCategoryTwo='',assTwoName, pos='0',currentPage='1') => dispatch => {
	let acId = ''
	let assId = ''
	let assCategory = ''
	acId = clickAcid ? clickAcid : ''
	assId = clickAssid ? clickAssid : '',
	assCategory = clickAsscategory ? clickAsscategory : ''
	if (!issuedate)
		return

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
	const end = endissuedate?`${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`:`${issuedate.substr(0,4)}${issuedate.substr(6,2)}`

	fetchApi('getAsssubsidiaryledger', 'POST', JSON.stringify({
		begin,
		end,
		acId,
		assId,
		assCategory,
		assIdTwo,
		assCategoryTwo,
		currentPage: currentPage,
		pageSize: '500',
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_AM_FETCH,
				receivedData: json.data.pageData,
				issuedate,
				endissuedate,
				acId,
				acName,
				assName,
				assId,
				assCategory,
				assIdTwo,
				assCategoryTwo,
				assTwoName,
				beSupport:true,
				currentAsscategory: assCategory,
				pos,
				currentPage: json.data.currentPage,
				pageCount: json.data.pageCount,
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const changeMxbChooseMorePeriods = (chooseperiods) => ({
	type: ActionTypes.CHANGE_AMXB_CHOOSE_MORE_PERIODS,
	chooseperiods
})
