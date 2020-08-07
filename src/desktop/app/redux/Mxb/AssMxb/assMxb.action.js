import { fromJS } from 'immutable'
import { showMessage, jsonifyDate } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.constant.js'

export const getPeriodAndMxbAclistFetch = (issuedate, endissuedate, asscategory, assid, assidTwo = '', asscategoryTwo = '', assNameTwo='', acid) => dispatch => {
	if (!asscategory) {
		asscategory = dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
	}
	dispatch(AllGetAssAclistListFetch(issuedate, endissuedate, asscategory, assid, assidTwo, asscategoryTwo, assNameTwo, acid, 'true'))
}

// 获取明细表的aclist
export const getAssMxbAclistFetch = (issuedate, endissuedate, asscategory, assid, assidTwo = '', asscategoryTwo = '', assNameTwo='', acid) => dispatch => {

	if (acid) {
		fetchApi('reportassac', 'POST', JSON.stringify({
			begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : '',
			end: issuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : '',
			asscategory
		}), json => {
			if (showMessage(json)) {

				dispatch(freshAssMxbAcList(json.data, issuedate, endissuedate, asscategory, assid, assidTwo, asscategoryTwo, assNameTwo,acid))
			} else if (json.code === 16004) {
				const defaultAsscategory = dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
				dispatch(AllGetAssAclistListFetch('', '', defaultAsscategory, '', '', '', '', '', 'true'))
			} else {
				dispatch({
					type: ActionTypes.INIT_ASSMXB
				})
			}
		})
	} else {
		dispatch(AllGetAssAclistListFetch(issuedate, endissuedate, asscategory, assid, assidTwo, asscategoryTwo, assNameTwo, acid))
	}
}

const AllGetAssAclistListFetch = (issuedate, endissuedate, asscategory, assid, assidTwo, asscategoryTwo, assNameTwo, acid, getPeriod) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('reportassac', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : '',
		end: issuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : '',
		asscategory,
		getPeriod
	}), json => {
		if (showMessage(json)) {

			if (getPeriod == 'true') {

				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate
				const endissuedateNew = endissuedate ? endissuedate : openedissuedate

				dispatch(freshAssMxbAcList(json.data.jsonArray, issuedateNew, endissuedateNew, asscategory, assid, assidTwo, asscategoryTwo, assNameTwo, acid))

			} else {
				dispatch(freshAssMxbAcList(json.data, issuedate, endissuedate, asscategory, assid, assidTwo, asscategoryTwo, assNameTwo, acid))
			}

		} else if (json.code === 16004) {
			const defaultAsscategory = dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
			dispatch(AllGetAssAclistListFetch('', '', defaultAsscategory, '', '', '', '', '', 'true'))
		} else {
			dispatch({type: ActionTypes.INIT_ASSMXB})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}


const freshAssMxbAcList = (data, issuedate, endissuedate, asscategory, assid, assidTwo, asscategoryTwo, assNameTwo, acid = '') => dispatch => {

	dispatch({
		type: ActionTypes.GET_ASS_MXB_ACLIST_TFETCH,
		receivedData: data,
		asscategory,
		endissuedate,
		issuedate
	})
	// dispatch({
	// 	type: ActionTypes.CHANGE_ASSMXB_ENDISSUEDATE,
	// 	endissuedate
	// })
	// dispatch({
	// 	type: ActionTypes.CHANGE_ASSMXB_ISSUEDATE,
	// 	issuedate
	// })

	if (assid) {
		let selectedKeys = ''
		let selectedKeysAssid = fromJS(data).findIndex(v => v.get('assid') === assid)
		let selectedKeysAcid = ''
		let selectedKeysAssidTwo = ''
		if (acid) {
			const acacDtoList = fromJS(data).filter(v => v.get('assid') === assid)

			if (acacDtoList.size) {
				selectedKeysAcid = acacDtoList.getIn([0, 'acDtoList']).findIndex(v => v.get('acid') === acid)
			}
			if (assidTwo) {
				const ac = acacDtoList.getIn([0, 'acDtoList']).filter(v => v.get('acid') === acid)

				if (ac.size) {
					selectedKeysAssidTwo = ac.getIn([0, 'assList']).findIndex(v => v.get('assid') === assidTwo)
				}
			}
		}
		selectedKeys = `${selectedKeysAssid}${selectedKeysAcid === '' ? '' : `-${selectedKeysAcid}`}${selectedKeysAssidTwo === '' ? '' : `-${selectedKeysAssidTwo}`}`
		// dispatch(changeTreeSelectedkeys(selectedKeys.toString()))
		dispatch(getreportassdetailFetch(issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo, assNameTwo, '1', selectedKeys))

	} else {
		if (data.length) {
			const assid = data[0].assid
			// dispatch(changeTreeSelectedkeys(0))
			dispatch(getreportassdetailFetch(issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo, assNameTwo, '1', 0))
		} else {
			dispatch({
				type: ActionTypes.GET_REPORT_ASS_DETAIL_FETCH,
				receivedData: {"jvlist": []},
				currentPage: 0,
				pageCount: 0,
				assidTwo,
				asscategoryTwo,
				assNameTwo
			})
		}
	}
}

export const getreportassdetailFetch = (issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo, assNameTwo, currentPage = '1', selectedKeys, callback) => dispatch => {
	const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
	const end = `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('reportassdetail', 'POST', JSON.stringify({
		begin,
		end,
		acid: acid ? acid : '',
		assid,
		asscategory,
		currentPage: currentPage,
		pageSize: '500',
		assIdTwo: assidTwo,
		assCategoryTwo: asscategoryTwo
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_REPORT_ASS_DETAIL_FETCH,
				receivedData: json.data.pageData,
				currentPage: json.data.currentPage,
				pageCount: json.data.pageCount,
				assidTwo,
				asscategoryTwo,
				assNameTwo,
				selectedKeys
			})
		}
		callback && callback()
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

// export const changeTreeSelectedkeys = (selectedKeys) => ({
// 	type: ActionTypes.CHANGE_TREE_SELECTEDKEYS,
// 	selectedKeys
// })

export const changeAssmxbChooseperiods = (bool) => ({
	type: ActionTypes.CHANGE_ASSMXB_CHOOSEPERIODS,
	bool
})
