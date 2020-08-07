import { showMessage, jsonifyDate } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { fromJS, Map, List } from 'immutable'
import fetchApi from 'app/constants/fetch.constant.js'

export const initAmountKmyeb = () => ({
	type: ActionTypes.INIT_AMOUNT_KMYEB
})

export const getPeriodAndBalistFetch = (issuedate, endissuedate) => dispatch => {

	dispatch(AllGetAmountKmyebListFetch(issuedate, endissuedate, 'true'))
}

export const getCountList = (issuedate, endissuedate) => dispatch => {//数量余额表

	dispatch(AllGetAmountKmyebListFetch(issuedate, endissuedate))
}

const AllGetAmountKmyebListFetch = (issuedate, endissuedate, getPeriod) => (dispatch,getState) => {
	const chooseperiods = getState().AmyebState.get('chooseperiods')
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	let url = ''
	let options = {}

	if (issuedate === endissuedate || endissuedate === '' || !chooseperiods) {

		url = 'getCountList'
		options = {
			year: issuedate ? issuedate.substr(0, 4) : '',
			month: issuedate ? issuedate.substr(6, 2) : '',
			getPeriod
		}

	} else {

		url = 'getMoreCountList'
		options = {
			beginYear: issuedate ? issuedate.substr(0, 4) : '',
			beginMonth: issuedate ? issuedate.substr(6, 2) : '',
			endYear: endissuedate.substr(0, 4),
			endMonth: endissuedate.substr(6, 2),
			getPeriod
		}
	}

	fetchApi(url, 'POST', JSON.stringify(options), json => {
		if (showMessage(json)) {

			if (getPeriod == 'true') {

				// 合并单双账期刷新时重新获取数据
				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate
				const endissuedateNew = endissuedate ? endissuedate : ''

				dispatch(freshAmountList(json.data.jsonArray, issuedateNew, endissuedateNew))

			} else {
				dispatch(freshAmountList(json.data.baList, issuedate, endissuedate))
			}

		} else {
			// dispatch({type: ActionTypes.INIT_KMYEB})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})

}

const freshAmountList = (data, issuedate, endissuedate) => dispatch => {

	dispatch({
		type: ActionTypes.GET_AC_AM_BA_LIST_FETCH,
		receivedData: data,
		issuedate,
		endissuedate,
	})
}

export const changeKmyeChooseMorePeriods = () => ({
	type: ActionTypes.CHANGE_AMMYE_CHOOSE_MORE_PERIODS
})

export const changeAmyebShow = () => ({
	type: ActionTypes.CHANGE_AMMYE_SHOW
})

// clear字段可选，如果为true，则整个清空
export const changeAmountYebChildShow = (acid, clear) => ({
	type: ActionTypes.CHANGE_AMOUNTYEB_CHILD_SHOW,
	acid,
	clear
})
// export const getAssEveryKmyebListFetch = (issuedate, endissuedate, kmyeAssCategory = '客户', condition = '', filterZero = false, kmyeAssAcId = '', currentPage = '1',isFilterZero) => dispatch => {
// 	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
// 	dispatch(AllGetAmountKmyebAndAclistFetch(issuedate, endissuedate, kmyeAssCategory, condition,filterZero, kmyeAssAcId, currentPage,undefined,isFilterZero))
// }

// export const AllGetAmountKmyebAndAclistFetch = (issuedate, endissuedate, kmyeAssCategory, condition = '',filterZero, kmyeAssAcId, currentPage = '1', getPeriod,isFilterZero) => dispatch => {
// 	fetchApi('reportassbalance', 'POST', JSON.stringify({
// 		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
// 		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
// 		asscategory: kmyeAssCategory,
// 		acid: kmyeAssAcId ? kmyeAssAcId : '',
// 		currentPage: currentPage,
// 		pageSize: '200',
// 		getPeriod,
// 		condition,
// 		filterZero
// 	}), json => {
// 		if (showMessage(json)) {
// 			if (getPeriod === 'true') {
// 				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
// 				const issuedateNew = issuedate ? issuedate : openedissuedate
// 				const endissuedateNew = endissuedate ? endissuedate : openedissuedate

// 				// dispatch(getKmyebList(json, issuedateNew, endissuedateNew, kmyeAssCategory, kmyeAssAcId,condition,filterZero,isFilterZero))

// 				dispatch(getAssTreeListFetch(issuedateNew, endissuedateNew, kmyeAssCategory))

// 				console.log('dasdfadfe');
// 				dispatch(checkHaveDoubleAssFetch(issuedateNew, endissuedateNew, kmyeAssCategory, kmyeAssAcId ? kmyeAssAcId : ''))

// 			} else {
// 				// dispatch(getKmyebList(json, issuedate, endissuedate, kmyeAssCategory, kmyeAssAcId,condition,filterZero,isFilterZero))

// 				dispatch(getAssTreeListFetch(issuedate, endissuedate, kmyeAssCategory))

// 				dispatch(checkHaveDoubleAssFetch(issuedate, endissuedate, kmyeAssCategory, kmyeAssAcId ? kmyeAssAcId : ''))
// 			}

// 		} else {
// 			dispatch({
// 				type: ActionTypes.INIT_ASS_KMYEB
// 			})
// 		}
// 		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
// 	})
// }
//辅助核算余额表科目的数据
// export const getAssTreeListFetch = (issuedate, endissuedate, asscategory = '客户') => dispatch => {

// 	fetchApi('getAssYebTree', 'POST', JSON.stringify({
// 		begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
// 		end: endissuedate?`${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`:`${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
// 		asscategory: asscategory
// 	}), json => {

// 		if (showMessage(json)) {
// 			dispatch({
// 				type: ActionTypes.GET_ASS_TREE,
// 				receivedData: json
// 			})
// 		}
// 	})
// }
//检查该科目是否关联两个辅助核算
// export const checkHaveDoubleAssFetch = (issuedate, endissuedate, kmyeAssCategory, acid) => dispatch => {
// 	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

// 	console.log('djjin');

// 	fetchApi('checkHaveDoubleAssFetch', 'POST', JSON.stringify({
// 		begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
// 		end: endissuedate?`${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`:`${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
// 		asscategory: kmyeAssCategory,
// 		acid: acid
// 	}), json => {
// 		if (showMessage(json)) {
// 			dispatch({
// 				type: ActionTypes.CHECK_HAVE_DOUBLE_ASS,
// 				receivedData: json.data[0]
// 			})
// 		}
// 		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
// 	})
// }
export const getTypeList = (beSupport,issuedate, endissuedate,assCategory,acId='') => (dispatch,getState) => {
	if (!assCategory) {
		assCategory = dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
	}
	const chooseperiods = getState().AmyebState.get('chooseperiods')
	if (beSupport) {
		if (endissuedate && endissuedate !== issuedate && chooseperiods ) {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			fetchApi('getMoreAmountKmyueList', 'POST', JSON.stringify({
				beginYear: issuedate.substr(0, 4),
				beginMonth: issuedate.substr(6, 2),
				endYear: endissuedate.substr(0, 4),
				endMonth: endissuedate.substr(6, 2),
				getPeriod:false,
				assObject:{
					assCategory,
					acId,
					queryBySingleAc:acId?true:false,
				},
			}), json => {
				if (showMessage(json)) {
					dispatch({
						type: ActionTypes.GET_AMOUNT_KM_LIST,
						receivedData: json.data,
						issuedate,
						endissuedate,
						beSupport,
						assCategory,
						acId,
					})
				}
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			})
		} else {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			fetchApi('getAmountKmyueList', 'POST', JSON.stringify({
				year: issuedate.substr(0, 4),
				month: issuedate.substr(6, 2),
				getPeriod:false,
				assObject:{
					assCategory,
					acId,
					queryBySingleAc:acId?true:false,
				},
			}), json => {
				if (showMessage(json)) {
					dispatch({
						type: ActionTypes.GET_AMOUNT_KM_LIST,
						receivedData: json.data,
						issuedate,
						endissuedate,
						beSupport,
						assCategory,
						acId,
					})
				}
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			})
		}
	} else {
		dispatch(getCountList(issuedate, endissuedate))
		const assCategory = dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
		dispatch({
			type: ActionTypes.INIT_AMOUNT_KM_STATE,
			assCategory
			})
	}
}
// clear字段可选，如果为true，则整个清空
export const changeAmountYebKmChildShow = (acid, clear) => ({
	type: ActionTypes.CHANGE_AMOUNTYEB_KM_CHILD_SHOW,
	acid,
	clear
})
export const getAmountKmTree = (issuedate,endissuedate,assCategory) => dispatch => {
	assCategory = assCategory || dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getAmountKmTree', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
		assCategory,
	}), json => {
		if (showMessage(json)) {
			dispatch(changeAmountYebString('assTree',[{acid:'',acname:'全部',ackey:''},...json.data]))
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}
export const changeAmountYebString = (palce,value)=> dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_AMOUNT_YEB_STRING,
		palce,
		value
		})
}
export const getAmountAssTwoTree = (issuedate,endissuedate,assCategory,acId,acKey) => dispatch => {
	assCategory = assCategory || dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getAmountAssTwoTree', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
		assCategory,
		acId,
		acKey:acKey?acKey:''
	}), json => {
		if (showMessage(json)) {
			dispatch(changeAmountYebString('assTwoCategory',json.data.assCategory))
			dispatch(changeAmountYebString('assTwoTree',[{asskey:'',assname:'全部'},...json.data.assList]))
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}
export const getAmountAssTwoKmyueList = (issuedate,endissuedate,assCategory,assSecondCategory,acId,ackey,secondAssKey) => dispatch => {
	assCategory = assCategory || dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getAmountAssTwoKmyueList', 'POST', JSON.stringify({
		beginYear:issuedate.substr(0, 4),
		beginMonth:issuedate.substr(6, 2),
		endYear: endissuedate && issuedate !== endissuedate ? endissuedate.substr(0, 4):'',
		endMonth: endissuedate && issuedate !== endissuedate ? endissuedate.substr(6, 2):'',
		assObject:{
			assCategory,
		    assSecondCategory,
		    secondAssKey,
		    acId,
		    queryBySingleAc: acId?true:false
		}
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_AMOUNT_KM_LIST,
				receivedData: json.data,
				issuedate,
				endissuedate,
				beSupport:true,
				assCategory,
				acId,
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}
