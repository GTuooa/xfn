import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import * as allActions from 'app/redux/Home/All/all.action'

export const getFirstProjectList = (issuedate,endissuedate) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getProjectBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        getPeriod: "true",
        "subordinateUuid":"",
        "runningCategoryUuid":"",
        categoryUuid:'',
        currentPage:1,
        propertyCost:''
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
            const issuedateNew = issuedate ? issuedate : openedissuedate
            const {
                balanceAmount,
                expenseAmount,
                incomeAmount,
                pages,
                realBalanceAmount,
                realExpenseAmount,
                realIncomeAmount,
            } = json.data.result
            fetchApi('getProjectDetailCategoryList', 'POST',JSON.stringify({
                year: issuedateNew.substr(0, 4),
                month: issuedateNew.substr(6, 2),
                endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
                getPeriod: "",
            }),json => {
                if (showMessage(json)) {
                    dispatch(changeXmYeInnerCommonString(['flags','projectCategoryList',0,'childList'],fromJS(json.data.categoryList)))
                }
            })
            fetchApi('getProjectCategoryList', 'POST',JSON.stringify({
                year: issuedateNew.substr(0, 4),
                month: issuedateNew.substr(6, 2),
                endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
                categoryUuid:"",
                subordinateUuid:''
            }),json => {
                if (showMessage(json)) {
                    dispatch(changeXmYeInnerCommonString(['flags','categoryList'],fromJS(json.data.result)))
                }
            })
            const issues = dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson))
            dispatch({
                type: ActionTypes.GET_XM_BALANCE_LIST,
                receivedData: json.data.result.childList,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                getPeriod: "true",
                balanceAmount,
                expenseAmount,
                incomeAmount,
                pages,
                issues,
                realBalanceAmount,
                realExpenseAmount,
                realIncomeAmount,
                currentPage:1,
                changeDate:true,
                endissuedate
	           })
       }
    })
}
export const getProjectDetailRunningCategoryList = (issuedate,endissuedate,uuid) => dispatch => {
    fetchApi('getProjectDetailRunningCategoryList', 'POST',JSON.stringify({
        year: issuedate.substr(0, 4),
        month: issuedate.substr(6, 2),
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',

    }),json => {
        if (showMessage(json)) {
            dispatch(changeXmYeInnerCommonString(['flags','categoryList'],fromJS(json.data.result)))
        }
    })
}
export const getProjectBalanceList = (issuedate,endissuedate,currentPage=1,isTop,categoryUuid='',runningCategoryUuid='',propertyCost='') => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getProjectBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
		endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        getPeriod: "true",
        subordinateUuid:isTop == 'true' ?'':categoryUuid,
        runningCategoryUuid,
        categoryUuid:isTop == 'true' ?categoryUuid:'',
        pageNum:currentPage,
        propertyCost
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const {
                balanceAmount,
                expenseAmount,
                incomeAmount,
                pages,
                realBalanceAmount,
                realExpenseAmount,
                realIncomeAmount,
            } = json.data.result
            const issues = dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson))
          dispatch({
            type: ActionTypes.GET_XM_BALANCE_LIST,
            receivedData: json.data.result.childList,
            period: json.data.periodDtoJson,
            issues,
            issuedate,
            endissuedate,
            getPeriod: "",
            balanceAmount,
            expenseAmount,
            incomeAmount,
            pages,
            realBalanceAmount,
            realExpenseAmount,
            realIncomeAmount,
            currentPage,
            isTop,
            categoryUuid,
            runningCategoryUuid,
            propertyCost
          })
        }
	})
}
export const getProjectCategoryList = (issuedate,endissuedate,uuid,isTop) => dispatch => {
    fetchApi('getProjectCategoryList', 'POST',JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        subordinateUuid:isTop == 'true' ?'':uuid,
        categoryUuid:isTop == 'true' ?uuid:'',
    }),json => {
        if (showMessage(json)) {
            dispatch(changeXmYeInnerCommonString(['flags','categoryList'],fromJS(json.data.result)))
        }
    })
}
// export const changeEndPeriod = (lastChooseperiods) => dispatch => {
//     if (!lastChooseperiods) {
//         dispatch(changeXmYeInnerCommonString(['flags','endissuedate'],''))
//     } else {
//
//     }
// }
export const changeXmYeInnerCommonString = (placeArr,value) => dispatch => {
    dispatch({
      type: ActionTypes.CHANGE_XMYE_COMMON_STRING,
      placeArr,
      value
    })
}
export const accountBalanceTriangleSwitch = (showChild, uuid) => ({
      type: ActionTypes.ACCOUNTCONF_ZH_BALANCE_TRIANGLE_SWITCH,
      showChild,
      uuid
  })

export const changeZhyeMorePeriods = (chooseperiods) => ({
    type: ActionTypes.CHANGE_ZHYE_MORE_PERIODS,
    chooseperiods
})
