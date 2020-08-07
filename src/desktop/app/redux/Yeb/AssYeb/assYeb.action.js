import { showMessage, jsonifyDate } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.constant.js'

export const initAssKmyeb = () => ({
	type: ActionTypes.INIT_ASS_KMYEB
})

export const getPeriodAndAssKmyebListFetch = (issuedate, endissuedate, kmyeAssCategory, condition = '',filterZero = false, kmyeAssAcId, currentPage = '1') => (dispatch, getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	if (!kmyeAssCategory) {
		kmyeAssCategory = dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
	}
	dispatch(AllGetAmountKmyebAndAclistFetch(issuedate, endissuedate, kmyeAssCategory, condition,filterZero, kmyeAssAcId, currentPage, 'true'))

}

export const getAssEveryKmyebListFetch = (issuedate, endissuedate, kmyeAssCategory = '客户', condition = '', filterZero = false, kmyeAssAcId = '', currentPage = '1',isFilterZero, callback) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	dispatch(AllGetAmountKmyebAndAclistFetch(issuedate, endissuedate, kmyeAssCategory, condition,filterZero, kmyeAssAcId, currentPage,undefined,isFilterZero, callback))
}

export const AllGetAmountKmyebAndAclistFetch = (issuedate, endissuedate, kmyeAssCategory, condition = '',filterZero, kmyeAssAcId, currentPage = '1', getPeriod,isFilterZero, callback) => dispatch => {
	fetchApi('reportassbalance', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}` : '',
		asscategory: kmyeAssCategory,
		acid: kmyeAssAcId ? kmyeAssAcId : '',
		currentPage: currentPage,
		pageSize: '200',
		getPeriod,
		condition,
		filterZero
	}), json => {
		if (showMessage(json)) {
			if (getPeriod === 'true') {
				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate
				const endissuedateNew = endissuedate ? endissuedate : openedissuedate

				dispatch(getKmyebList(json, issuedateNew, endissuedateNew, kmyeAssCategory, kmyeAssAcId,condition,filterZero,isFilterZero))

				dispatch(getAssTreeListFetch(issuedateNew, endissuedateNew, kmyeAssCategory))

				dispatch(checkHaveDoubleAssFetch(issuedateNew, endissuedateNew, kmyeAssCategory, kmyeAssAcId ? kmyeAssAcId : ''))

			} else {
				dispatch(getKmyebList(json, issuedate, endissuedate, kmyeAssCategory, kmyeAssAcId,condition,filterZero,isFilterZero))

				dispatch(getAssTreeListFetch(issuedate, endissuedate, kmyeAssCategory))

				dispatch(checkHaveDoubleAssFetch(issuedate, endissuedate, kmyeAssCategory, kmyeAssAcId ? kmyeAssAcId : ''))
			}

		} else {
			dispatch({
				type: ActionTypes.INIT_ASS_KMYEB,
			})
		};
		callback && callback();
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK});
	})
}

const getKmyebList = (json, issuedate, endissuedate, kmyeAssCategory, kmyeAssAcId,condition,filterZero,isFilterZero) => dispatch => {

	dispatch({
		type: ActionTypes.GET_ASS_KMYEB_LIST_FETCH,
		receivedData: json,
		issuedate,
		endissuedate,
		kmyeAssCategory,
		kmyeAssAcId,
		condition,
		filterZero,
		isFilterZero
	})
}

// 点击切换科目时调用（此时不需要获取科目树）
export const getAssKmyebListFetch = (issuedate, endissuedate, asscategory = '客户', acid = '', currentPage = '1',condition) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('reportassbalance', 'POST', JSON.stringify({
		begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
		end: `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`,
		asscategory: asscategory,
		acid: acid,
		currentPage: currentPage,
		pageSize: '200'
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_ASS_KMYEB_LIST_FETCH,
				receivedData: json,
				issuedate,
				endissuedate,
				kmyeAssCategory: asscategory,
				kmyeAssAcId: acid
			})
			// if(isCheck){
			// 	dispatch(checkHaveDoubleAssFetch(issuedate, endissuedate, asscategory, acid))
			// }
			dispatch(checkHaveDoubleAssFetch(issuedate, endissuedate, asscategory, acid))
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const showAssKmyebChildItiem = (idx) => ({
	type: ActionTypes.SHOW_ASS_KMYEB_CHILD_ITIEM,
	idx
})

export const changeAssKmyeChooseMorePeriods = () => ({
	type: ActionTypes.CHANGE_ASS_KMYE_CHOOSE_MORE_PERIODS
})
//辅助核算余额表科目的数据
export const getAssTreeListFetch = (issuedate, endissuedate, asscategory = '客户') => dispatch => {

	fetchApi('getAssYebTree', 'POST', JSON.stringify({
		begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
		end: `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`,
		asscategory: asscategory
	}), json => {

		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_ASS_TREE,
				receivedData: json
			})
		}
	})
}
//是否逐级展开
export const assYebShowAll = (value) => ({
	type: ActionTypes.ASS_YEB_SHOW_ALL,
	value
})
//检查该科目是否关联两个辅助核算
export const checkHaveDoubleAssFetch = (issuedate, endissuedate, kmyeAssCategory, acid) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('checkHaveDoubleAssFetch', 'POST', JSON.stringify({
		begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
		end: `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`,
		asscategory: kmyeAssCategory,
		acid: acid
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHECK_HAVE_DOUBLE_ASS,
				receivedData: json.data[0]
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}
// 获取带双辅助时的数据
export const getAssKmyebDoubleListFetch = (issuedate, endissuedate, asscategory , acid, currentPage = '1', assIdTwo, assCategoryTwo,condition) => dispatch => {

	fetchApi('assKmyueDoubleList', 'POST', JSON.stringify({
		begin: `${issuedate.substr(0, 4)}${issuedate.substr(6, 2)}`,
		end: `${endissuedate.substr(0, 4)}${endissuedate.substr(6, 2)}`,
		asscategory: asscategory ? asscategory : '',
		acid: acid ? acid : '',
		currentPage: currentPage,
		pageSize: '200',
		assIdTwo: assIdTwo ? assIdTwo : '',
		assCategoryTwo: assIdTwo ? assCategoryTwo : ''
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_ASS_KMYEB_LIST_FETCH,
				receivedData: json,
				issuedate,
				endissuedate,
				kmyeAssCategory: asscategory,
				kmyeAssAcId: acid,
				assIdTwo,
				assCategoryTwo
			})
		}
	})
}
