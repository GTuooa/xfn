import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/all.action'

export const getPeriodAndBalanceList = (issuedate) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getContactsBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: '',
        endMonth: '',
        cardCategoryUuid: '',
        cardSubUuid: '',
        relation: '',
        pageNum: 1,
        pageSize: Limit.YEB_PAGE_SIZE,
        getPeriod: "true"
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
            const {
                allBeginIncomeAmount,
                allBeginExpenseAmount,
                allHappenIncomeAmount,
                allHappenExpenseAmount,
                allPaymentIncomeAmount,
                allPaymentExpenseAmount,
                allBalanceIncomeAmount,
                allBalanceExpenseAmount,
                pages,
                count
            } = json.data.result
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_WL_BALANCE_LIST,
                receivedData: json.data.result.childList,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                issues,
                endissuedate: '',
                getPeriod: "true",
                typeUuid: '',
                wlType: '全部',
                wlRelate: '',
                isTop: '',
                currentPage:1,
                pages,
                count,
                allBeginIncomeAmount,
                allBeginExpenseAmount,
                allHappenIncomeAmount,
                allHappenExpenseAmount,
                allPaymentIncomeAmount,
                allPaymentExpenseAmount,
                allBalanceIncomeAmount,
                allBalanceExpenseAmount
            })
        }
	})

    // 获取往来类别树
    dispatch(getContactsTypeList('','','true'))
    // 获取往来关系
    dispatch(getContactsRelationList('','','','','true'))


}

export const getContactsBalanceList = (issuedate,endissuedate='',isTop,typeUuid = '',wlType = '全部',wlRelate = '',currentPage = 1) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
	fetchApi('getContactsBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
		endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        relation: wlRelate,
        pageNum:currentPage,
        pageSize: Limit.YEB_PAGE_SIZE,
        getPeriod: ""
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const {
                allBeginIncomeAmount,
                allBeginExpenseAmount,
                allHappenIncomeAmount,
                allHappenExpenseAmount,
                allPaymentIncomeAmount,
                allPaymentExpenseAmount,
                allBalanceIncomeAmount,
                allBalanceExpenseAmount,
                pages,
                count
            } = json.data.result

            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
          dispatch({
            type: ActionTypes.GET_WL_BALANCE_LIST,
            receivedData: json.data.result.childList,
            period: json.data.periodDtoJson,
            issuedate,
            issues,
            endissuedate,
            getPeriod: "",
            typeUuid,
            wlType,
            wlRelate,
            isTop,
            currentPage,
            pages,
            count,
            allBeginIncomeAmount,
            allBeginExpenseAmount,
            allHappenIncomeAmount,
            allHappenExpenseAmount,
            allPaymentIncomeAmount,
            allPaymentExpenseAmount,
            allBalanceIncomeAmount,
            allBalanceExpenseAmount
          })
        }
	})

        // 获取往来类别树
        dispatch(getContactsTypeList(issuedate,endissuedate,''))
        // 获取往来关系
        dispatch(getContactsRelationList(issuedate, endissuedate, isTop,typeUuid,'true'))

}

export const contactsBalanceTriangleSwitch = (showChild, uuid) => ({
      type: ActionTypes.ACCOUNTCONF_WL_BALANCE_TRIANGLE_SWITCH,
      showChild,
      uuid
  })

export const changeWlyeMorePeriods = (chooseperiods) => ({
    type: ActionTypes.CHANGE_WLYE_MORE_PERIODS,
    chooseperiods
})

export const getContactsTypeList = (issuedate, endissuedate, getPeriod = '') => (dispatch) => {
    fetchApi('getContactsBalanceCategory', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        getPeriod
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_WL_TYPE_LIST,
                receivedData: json.data.categoryList,
                period: json.data.periodDtoJson,
                issues,
                getPeriod,
            })
        }
	})
}
export const changeWlyebCommonString = () => (dispatch) => {

}

export const getContactsRelationList = (issuedate, endissuedate, isTop, typeUuid, getPeriod = '') => (dispatch) => {
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
    fetchApi('getContactsRelation', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        getPeriod
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_WL_RELATION_LIST,
                receivedData: json.data.relationList,
                period: json.data.periodDtoJson,
                getPeriod,
                issues
            })
            if(json.data.relationList.length == 2){
                json.data.relationList.map((item) => {
                    if(item.name !== '全部'){
                        dispatch({
                            type: ActionTypes.CHANGE_WLYEB_COMMON_STRING,
                            place: ['flags','wlOnlyRelate'],
                            value: item.relation
                        })
                    }
                })
            }else{
                dispatch({
                    type: ActionTypes.CHANGE_WLYEB_COMMON_STRING,
                    place: ['flags','wlOnlyRelate'],
                    value: ''
                })
            }
        }
	})
}
