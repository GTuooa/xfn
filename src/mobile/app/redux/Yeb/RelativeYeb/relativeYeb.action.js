import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

export const getPeriodAndRelativeBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getRelativeBalance', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        categoryUuid: '',
        cardCategoryUuid: '',
        jrCategoryUuid: '',
        needPeriod: 'true',
	}),json => {
        thirdParty.toast.hide()

        if (showMessage(json)) {
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_RELATIVE_YEB_BALANCE_LIST,
                receivedData: json.data.result,
                issuedate: issuedate ? issuedate : openedissuedate,
                endissuedate: endissuedate ? endissuedate : '',
                issues,
                needPeriod: 'true',
            })
        }
	})
}

export const getRelativeBalanceList = (issuedate, endissuedate, uuid, isTop,categoryUuid, needPeriod) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getRelativeBalance', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        categoryUuid: isTop === 'true' ? uuid : '',
        cardCategoryUuid: isTop === 'true' ? '' : uuid,
        jrCategoryUuid: categoryUuid
	}),json => {
        thirdParty.toast.hide()

        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []

            dispatch({
                type: ActionTypes.GET_RELATIVE_YEB_BALANCE_LIST,
                receivedData: json.data.result,
                issuedate: issuedate,
                endissuedate: endissuedate,
                needPeriod,
                issues
            })
        }
	})
}

export const getRelativeCategory = (issuedate, endissuedate) => dispatch => {
    fetchApi('getRelativeCategory', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_BALANCE_CATEGORY,
                cardCategory: json.data.cardCategory,
                jrCategory: json.data.jrCategory
            })
        }
    })
}
export const changeRelativeCategory = (item) => (dispatch) => {
    const categoryName = item.label
    const valueList = item.key.split(Limit.TREE_JOIN_STR)
    const categoryUuid = valueList[0]
    const categoryTop = valueList[1]

    dispatch({
        type: ActionTypes.CHANGE_RELATIVE_CATEGORY_STRING,
        categoryName,
        categoryUuid,
        categoryTop,
        categoryValue: item.key
    })
}
export const changeRunningCategory = (item) => (dispatch) => {
    const categoryName = item.label
    const valueList = item.key.split(Limit.TREE_JOIN_STR)
    const categoryUuid = valueList[0]
    const categoryTop = valueList[1]

    dispatch({
        type: ActionTypes.CHANGE_RUNNING_CATEGORY_STRING,
        categoryName,
        categoryUuid,
        categoryTop,
        categoryValue: item.key
    })
}

export const relativeBalanceTriangleSwitch = (showChild, uuid) => ({
    type: ActionTypes.RELATIVE_BALANCE_TRIANGLE_SWITCH,
    showChild,
    uuid
})

export const changeRelativeYebChooseValue = (value) => ({
      type: ActionTypes.CHANGE_RELATIVE_YEB_CHOOSE_VALUE,
      value,
})
export const changeRelativeYebChooseDirction = (value) => ({
      type: ActionTypes.CHANGE_RELATIVE_YEB_CHOOSE_DIRCTION,
      value,
})

export const initState = () => ({
      type: ActionTypes.INIT_RELATIVE_YEB
})
