import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

export const getPeriodAndIncomeStatementFetch = (issuedate) => (dispatch,getState) => {
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
	// allActions.getPeriodFetch(issuedate, dispatch, (issuedate) => dispatch(getIncomeStatementFetch(issuedate)))
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(isRunning?'getJrincomestatement':'getincomestatement', 'POST', JSON.stringify({
		year: '',
		month: '',
		begin:'',
		end:'',
		getPeriod: 'true',
		needPeriod:'true'
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
            const openedissuedate = isRunning ? dispatch(allActions.reportGetIssuedateAndFreshPeriod(json)) : dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate

			dispatch({
				type: ActionTypes.CHANGE_INCOME_STATEMENT,
				receivedData: json.data.profitlist
			})
			if (json.data.assList) {
				if (json.data.assList.length > 1) {
					let assSelectableList = json.data.assList
					assSelectableList.unshift({assid: 0, assname: '全部', asscategory: 'asscategory'})
					dispatch({
						type: ActionTypes.CHANGE_ASSSELECTABLELIST,
						assSelectableList
					})
				} else {
					let assSelectableList = []
					dispatch({
						type: ActionTypes.CHANGE_ASSSELECTABLELIST,
						assSelectableList
					})
				}
			}
			dispatch({
				type: ActionTypes.CHANGE_SELECTASSID,
				selectAssId: 0
			})

			dispatch({
				type: ActionTypes.CHANGE_ISSUDATE,
				issuedate: issuedateNew,
				endissuedate: ''
			})
		}
	})
}

// export const getIncomeStatementFetch = (issuedate) => dispatch => {
// 	fetchApi('getincomestatement', 'POST', JSON.stringify(jsonifyDate(issuedate)), json => showMessage(json) && dispatch({
// 		type: ActionTypes.GET_INCOME_STATEMENT_FETCH,
// 		receivedData: json,
// 		issuedate
// 	}))
// }
export const getIncomeStatementFetch = (issuedate, endissuedate, selectAssId = 0) => (dispatch, getState) => {
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
	/*if (selectAssId == 0) {

		fetchApi('getincomestatement', 'POST', JSON.stringify(jsonifyDate(issuedate)), json => {
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.CHANGE_INCOME_STATEMENT,
					receivedData: json.data.profitlist
				})
				if (json.data.assList) {
					if (json.data.assList.length > 1) {
						let assSelectableList = json.data.assList
						assSelectableList.unshift({assid: 0, assname: '全部', asscategory: 'asscategory'})
						dispatch({
							type: ActionTypes.CHANGE_ASSSELECTABLELIST,
							assSelectableList
						})
					} else {
						let assSelectableList = []
						dispatch({
							type: ActionTypes.CHANGE_ASSSELECTABLELIST,
							assSelectableList
						})
					}
				}
				dispatch({
					type: ActionTypes.CHANGE_SELECTASSID,
					selectAssId
				})
			}
		})
	} else {
		const assSelectableList = getState().lrbState.get('assSelectableList')
		const assid = assSelectableList.getIn([selectAssId, 'assid'])
		const asscategory = assSelectableList.getIn([selectAssId, 'asscategory'])
		fetchApi('getincomestatementass', 'POST', JSON.stringify({
			year: issuedate.substr(0, 4),
			month: issuedate.substr(5, 2),
			asscategory,
			assid
		}), json =>
		showMessage(json) &&
		dispatch({
			type: ActionTypes.CHANGE_INCOME_STATEMENT,
			receivedData: json.data.profitlist
		}))
	}
	dispatch({
		type: ActionTypes.CHANGE_ISSUDATE,
		issuedate
	})*/
	/*多账期修改*/

	let url = ''
	let options = {}
	if (isRunning) {
		url = 'getJrincomestatement'
		const begin = issuedate ? `${issuedate.substr(0,4)}-${issuedate.substr(5,2)}` : ''
		options = {
			begin,
			end: endissuedate ? `${endissuedate.substr(0,4)}-${endissuedate.substr(5,2)}` : begin,
			needPeriod:'',
		}
		thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
		fetchApi(url, 'POST', JSON.stringify(options), json => {
			if (showMessage(json)) {
				thirdParty.toast.hide()
				dispatch({
					type: ActionTypes.CHANGE_INCOME_STATEMENT,
					receivedData: json.data.profitlist
				})
			}
		})
	} else if (selectAssId == 0) {//无AMB

		if (!endissuedate) {
			// 单月
			url = 'getincomestatement'
			options = {
				year: issuedate ? issuedate.substr(0, 4) : '',
				month: issuedate ? issuedate.substr(5, 2) : ''
			}
		} else {
			// 多月
			url = 'getincomestatementquarter'
			options = {
				begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(5,2)}` : '',
				end: endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : ''
			}
		}
		thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
		fetchApi(url, 'POST', JSON.stringify(options), json => {
			if (showMessage(json)) {
				thirdParty.toast.hide()
				dispatch({
					type: ActionTypes.CHANGE_INCOME_STATEMENT,
					receivedData: json.data.profitlist
				})
				if (json.data.assList) {
					if (json.data.assList.length > 1) {
						let assSelectableList = json.data.assList
						assSelectableList.unshift({assid: 0, assname: '全部', asscategory: 'asscategory'})
						dispatch({
							type: ActionTypes.CHANGE_ASSSELECTABLELIST,
							assSelectableList
						})
					} else {
						let assSelectableList = []
						dispatch({
							type: ActionTypes.CHANGE_ASSSELECTABLELIST,
							assSelectableList
						})
					}
				}
				dispatch({
					type: ActionTypes.CHANGE_SELECTASSID,
					selectAssId
				})
			}
		})
	} else {//有AMB
		const assSelectableList = getState().lrbState.get('assSelectableList')
		const assid = assSelectableList.getIn([selectAssId, 'assid'])
		const asscategory = assSelectableList.getIn([selectAssId, 'asscategory'])
		if (!endissuedate) {
			// 单月
			url = 'getincomestatementass'
			options = {
				year: issuedate ? issuedate.substr(0, 4) : '',
				month: issuedate ? issuedate.substr(5, 2) : '',
				asscategory,
				assid
			}
		} else {
			// 多月
			url = 'getincomestatementquarterass'
			options = {
				begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(5,2)}` : '',
				end: endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : '',
				asscategory,
				assid
			}
		}
		thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
		fetchApi(url, 'POST', JSON.stringify(options), json => {
			if (showMessage(json)) {
				thirdParty.toast.hide()
				dispatch({
					type: ActionTypes.CHANGE_INCOME_STATEMENT,
					receivedData: json.data.profitlist
				})
			}
		}
	)}
	dispatch({
		type: ActionTypes.CHANGE_ISSUDATE,
		issuedate,
		endissuedate
	})

}

export const toggleProfitLineDisplay = (blockIdx) => ({
	type: ActionTypes.TOGGLE_PROFIT_LINE_DISPLAY,
	blockIdx
})

/**
*
* 获取阿米巴模式利润表
* 2016-12-14
* 修改的state有： selectAssId，incomestatement
*/
export const getSelectAssIncomeFetch = (issuedate, endissuedate, value) => dispatch => {

	const info = value.split('_')
	const selectAssId = info[0]
	const assid = info[1]
	const asscategory = info[2]

	/****************************单账期*****************/
	// selectAssId有两种可能，一种是数字0，一种是字符串0
	/*if (selectAssId == 0) {
		fetchApi('getincomestatement', 'POST', JSON.stringify(jsonifyDate(issuedate)), json =>
				showMessage(json) &&
				dispatch({
					type: ActionTypes.CHANGE_INCOME_STATEMENT,
					receivedData: json.data.profitlist
				})
		)
	} else {
		fetchApi('getincomestatementass', 'POST', JSON.stringify({
			year: issuedate.substr(0, 4),
			month: issuedate.substr(5, 2),
			asscategory,
			assid
		}), json =>
		showMessage(json) &&
		dispatch({
			type: ActionTypes.CHANGE_INCOME_STATEMENT,
			receivedData: json.data.profitlist
		}))
	}

	dispatch({
		type: ActionTypes.CHANGE_SELECTASSID,
		selectAssId: selectAssId
	})*/
	/****************************多账期*****************/
	let url = ''
	let options = {}
	if (selectAssId == 0) {
		if (!endissuedate) {
			// 单月
			url = 'getincomestatement'
			options = {
				year: issuedate ? issuedate.substr(0, 4) : '',
				month: issuedate ? issuedate.substr(5, 2) : ''
			}
		} else {
			// 多月
			url = 'getincomestatementquarter'
			options = {
				begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(5,2)}` : '',
				end: endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : ''
			}
		}
		fetchApi(url, 'POST', JSON.stringify(options), json =>
				showMessage(json) &&
				dispatch({
					type: ActionTypes.CHANGE_INCOME_STATEMENT,
					receivedData: json.data.profitlist
				})
		)
	} else {//有AMB
		if (!endissuedate) {
			// 单月
			url = 'getincomestatementass'
			options = {
				year: issuedate ? issuedate.substr(0, 4) : '',
				month: issuedate ? issuedate.substr(5, 2) : '',
				asscategory,
				assid
			}
		} else {
			// 多月
			url = 'getincomestatementquarterass'
			options = {
				begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(5,2)}` : '',
				end: endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : '',
				asscategory,
				assid
			}
		}
		thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
		fetchApi(url, 'POST', JSON.stringify(options), json => {
			if (showMessage(json)) {
				thirdParty.toast.hide()
				dispatch({
					type: ActionTypes.CHANGE_INCOME_STATEMENT,
					receivedData: json.data.profitlist
				})
			}
		}
	)}

	dispatch({
		type: ActionTypes.CHANGE_SELECTASSID,
		selectAssId: selectAssId
	})

}
export const changeLrbBeginDate = (begin) => ({
	type: ActionTypes.CHANGE_LRB_BEGIN_DATE,
	begin
})
export const changeListType = (bool)=>({
	type:ActionTypes.CHANGE_LIST_TYPE,
	bool
})

export const getInitList=(issuedate,endissuedate,referBegin,referEnd,getPeriod="true") => (dispatch,getState) =>{
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
	const begin = issuedate ? `${issuedate.substr(0,4)}${isRunning?'-':''}${issuedate.substr(5,2)}` : ''
	let object={
		begin,
		end: endissuedate ? `${endissuedate.substr(0,4)}${isRunning?'-':''}${endissuedate.substr(5,2)}` : begin,
		referBegin:referBegin?isRunning ?referBegin.substr(0,4)+'-'+referBegin.substr(4,2):referBegin:'',
		referEnd:referEnd?isRunning ?referEnd.substr(0,4)+'-'+referEnd.substr(4,2):referEnd:'',
		getPeriod,
		needPeriod:getPeriod
	}
	dispatch(getSelfListData(object))
	dispatch(changeListType(true))
}

export const getSelfListData =(object)=>(dispatch,getState)=>{
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
	fetchApi(isRunning?'getJrProfit':'getSelfTypeListData', 'POST', JSON.stringify(
		object
	),resp=>{
		if (showMessage(resp)){
			thirdParty.toast.hide()
            const openedissuedate = isRunning ? dispatch(allActions.reportGetIssuedateAndFreshPeriod(resp)) : dispatch(allActions.everyTableGetPeriod(resp))
            const issues = resp.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(resp.data.periodDtoJson)) : ''
			const newIssuedate = object.begin ?object.begin.substr(0,4)+"-"+object.begin.substr(isRunning?5:4,2): openedissuedate
			const endissuedate = object.end ?object.end:`${resp.data.periodDtoJson.lastyear}-${resp.data.periodDtoJson.lastmonth}`
			let selfListData = []
			let extraMessage = []
			for(let i in resp.data.result){
				if(resp.data.result[i].linename){
					selfListData.push(resp.data.result[i])
				}else{
					extraMessage.push(resp.data.result[i])
				}
			}
			dispatch({
				type:ActionTypes.SET_SELF_TYPE_LIST_DATA,
				selfListData,
				extraMessage,
				issues
			})
			dispatch(setReferDate(object.referBegin?object.referBegin:'',object.referEnd?object.referEnd:""))
			dispatch({
				type:ActionTypes.SET_REFER_CHOOSE_VALUE,
				value:'YEAR_TOTAL'
			})

			if(object.end===object.begin){
				dispatch({
					type: ActionTypes.CHANGE_ISSUDATE,
					issuedate: newIssuedate,
					endissuedate:""
				})
			}else{
				dispatch({
					type:ActionTypes.CHANGE_LRB_BEGIN_DATE,
					begin:newIssuedate
				})
			}
		}
	})
}
export const changeShowChildProfitList = (payload)=>({
	type:ActionTypes.CHANGE_SHOW_CHILD_PROFIT_LIST,
	payload
})
export const getInitListFetch=(issuedate,endissuedate,referBegin,referEnd,getPeriod="true")=>(dispatch,getState)=>{
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
	const begin = issuedate ? `${issuedate.substr(0,4)}${isRunning?'-':''}${issuedate.substr(5,2)}` : ''
	let object={
		begin,
		end: endissuedate ? `${endissuedate.substr(0,4)}${isRunning?'-':''}${endissuedate.substr(5,2)}` : begin,
		referBegin:referBegin?isRunning ?referBegin.substr(0,4)+'-'+referBegin.substr(4,2):referBegin:'',
		referEnd:referEnd?isRunning ?referEnd.substr(0,4)+'-'+referEnd.substr(4,2):referEnd:'',
		getPeriod,
		needPeriod:getPeriod
	}
	fetchApi(isRunning?'getJrProfit':'getSelfTypeListData', 'POST', JSON.stringify(
		object
	),resp=>{
		if(showMessage(resp)){
			//console.log(resp);
			thirdParty.toast.hide()
            const openedissuedate = isRunning ? dispatch(allActions.reportGetIssuedateAndFreshPeriod(resp)) : dispatch(allActions.everyTableGetPeriod(resp))
            const issues = resp.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(resp.data.periodDtoJson)) : ''
			const newIssuedate = object.begin ?object.begin.substr(0,4)+"-"+object.begin.substr(isRunning?5:4,2): openedissuedate
			const newEndissuedate = endissuedate?endissuedate:``
			let selfListData = []
			let extraMessage = []
			for(let i in resp.data.result){
				if(resp.data.result[i].linename){
					selfListData.push(resp.data.result[i])
				}else{
					extraMessage.push(resp.data.result[i])
				}
			}
			dispatch({
				type:ActionTypes.SET_SELF_TYPE_LIST_DATA,
				selfListData,
				extraMessage,
				issues
			})
			dispatch({
				type: ActionTypes.CHANGE_ISSUDATE,
				issuedate: newIssuedate,
				endissuedate:newEndissuedate
			})
			dispatch(setReferDate(referBegin?referBegin:'',referEnd?referEnd:""))
		}
	})
}
export const setReferDate=(referBegin, referEnd)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.SET_REFER_DATE,
		referBegin,
		referEnd
	})
}
export const changeReferChooseValue=(value)=>dispatch=>{
	dispatch({
		type:ActionTypes.SET_REFER_CHOOSE_VALUE,
		value
	})
}
export const getSelfTypeListExtraMessage=()=>(dispatch,getState)=>{
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
	fetchApi(isRunning?'getJrExtraMessage':'getSelfTypeListExtraMessage','GET','',resp=>{
		if(showMessage(resp)){
			dispatch({
				type:ActionTypes.SET_SELF_LIST_EXTRA_MESSAGE,
				data:resp.data
			})
		}
	})
}
export const changeDifferType=(differenceType)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.CHANGE_DIFFERENCE_TYPE,
		value:differenceType
	})
}
