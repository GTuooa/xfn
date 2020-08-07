import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as allActions from 'app/redux/Home/All/other.action'
import * as thirdParty from 'app/thirdParty'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

export const getPeriodAndAssKmyebListFetch = (issuedate, endissuedate, asscategory, acid = '', kmyeAssAcId = '全部') => dispatch => {

	if (!asscategory) {
        asscategory = dispatch(allActions.getDefaultAssCategoryOfAssMxbAndAssYeb())
    }

	const begin = issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : ''
	const end = endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : begin

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('reportassbalance', 'POST', JSON.stringify({
		begin: begin,
		end: end,
		asscategory: asscategory,
		currentPage: 0,
		pageSize: 0,
		getPeriod: 'true',
		acid: acid
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
			const endissuedateNew = endissuedate ? endissuedate : ''
			const assKmyebList = {data: json.data.pageData}

			dispatch(freshAssKmyeb(assKmyebList, issuedateNew, endissuedateNew, asscategory, kmyeAssAcId, '', false, true))
			dispatch(getAssTreeListFetch(issuedateNew, endissuedateNew, asscategory))
		}
	})
}

export const getAssKmyebListFetch = (issuedate, endissuedate, asscategory = '客户', acid, kmyeAssAcId, isCheck) => dispatch => {
	const begin = `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}`
	const end = endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : begin

	fetchApi('reportassbalance', 'POST', JSON.stringify({
		begin: `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}`,
		end: end,
		asscategory: asscategory,
		currentPage: 0,
		pageSize: 0,
		acid: acid
	}), json =>
		showMessage(json) && dispatch(freshAssKmyeb(json, issuedate, endissuedate, asscategory, kmyeAssAcId, acid,isCheck))
	)
}

const freshAssKmyeb = (json, issuedate, endissuedate, asscategory, kmyeAssAcId, acid, isCheck, notCheck) => dispatch => {
	dispatch({
		type: ActionTypes.GET_ASS_KMYEB_LIST_FETCH,
		receivedData: json,
		issuedate,
		endissuedate,
		kmyeAssCategory: asscategory,
		kmyeAssAcId: kmyeAssAcId
	})
	if(!notCheck){
		dispatch(checkHaveDoubleAssFetch(issuedate, endissuedate, asscategory, kmyeAssAcId, acid ? acid : ''))
	}
}
//辅助核算余额表科目的数据
export const getAssTreeListFetch = (issuedate, endissuedate, asscategory = '客户') => dispatch => {
	const begin = `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}`
	const end = endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : begin
	fetchApi('getAssYebTree', 'POST', JSON.stringify({
		begin: begin,
		end: end,
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
export const showAssKmyebChildItiem = (idx) => ({
	type: ActionTypes.SHOW_ASS_KMYEB_CHILD_ITIEM,
	idx
})
export const changeKmyeAssAcId = (key, value) => ({
	type: ActionTypes.CHANGE_KMYE_ASS_ACID,
	key,
	value
})
//第二个参数代表是否需要把end还原成begin
export const changeAssYebBeginDate = (begin, bool) => ({
	type: ActionTypes.CHANGE_ASS_YEB_BEGIN_DATE,
	begin,
	bool
})
//检查该科目是否关联两个辅助核算
export const checkHaveDoubleAssFetch = (issuedate, endissuedate, kmyeAssCategory, kmyeAssAcId,acid) => dispatch => {
	const begin = `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}`
	const end = endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : begin
	fetchApi('checkHaveDoubleAssFetch', 'POST', JSON.stringify({
		begin,
		end,
		asscategory: kmyeAssCategory,
		acid: acid
	}), json => {
		if (showMessage(json)) {
			const isDouble = json.data[0].asslist.length ? true : false
			if(isDouble){//该科目挂了双辅助核算
				let doubleAss=[];
				const doubleAssCategory = json.data[0].asscategory
				json.data[0].asslist.forEach((v)=>{
					doubleAss.push({
						key: `${v['assid']} ${v['assname']}`,
						value: v['assid']
					})
				})
				doubleAss.unshift({key:'全部',value:''})
				dispatch({
					type: ActionTypes.CHECK_HAVE_DOUBLE_ASS,
					isDouble,
					doubleAss,
					doubleAssCategory
				})
				dispatch({
					type: ActionTypes.SET_DOUBLEASS,
					doubleAss
				})
				thirdParty.chosen({
					source: doubleAss,
					onSuccess: (result) => {
						dispatch(getAssKmyebDoubleListFetch(issuedate, endissuedate, kmyeAssCategory, kmyeAssAcId,acid, result.value, doubleAssCategory))
					},
					onFail: (err) => {}
				})
			}
		}
	})
}
// 获取带双辅助时的数据
export const getAssKmyebDoubleListFetch = (issuedate, endissuedate, asscategory , kmyeAssAcId,acid, assIdTwo, assCategoryTwo) => dispatch => {
	const begin = `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}`
	const end = endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : begin
	fetchApi('assKmyueDoubleList', 'POST', JSON.stringify({
		begin,
		end,
		asscategory: asscategory,
		acid: acid ? acid : '',
		assIdTwo:assIdTwo,
		assCategoryTwo: assIdTwo ? assCategoryTwo : ''
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_ASS_KMYEB_LIST_FETCH,
				receivedData: json,
				issuedate,
				endissuedate,
				kmyeAssCategory: asscategory,
				kmyeAssAcId: kmyeAssAcId,
				assIdTwo
			})
		}
	})
}
