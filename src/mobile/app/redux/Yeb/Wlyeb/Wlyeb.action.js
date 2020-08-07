import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

export const getPeriodAndBalanceList = (issuedate) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getContactsBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: '',
        endMonth: '',
        cardCategoryUuid: '',
        cardSubUuid: '',
        relation: '',
        pageNum: 1,
        // pageSize: Limit.YEB_PAGE_SIZE,
        pageSize: '',
        getPeriod: "true"
	}),json => {
        thirdParty.toast.hide()
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
             const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_WL_BALANCE_LIST,
                receivedData: json.data.result.childList,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                endissuedate: '',
                getPeriod: "true",
                typeUuid: '',
                wlType: '全部',
                wlRelate: '',
                isTop: '',
                currentPage:1,
                issues,
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

export const getContactsBalanceList = (issuedate,endissuedate='',isTop,typeUuid = '',wlType = '全部',wlRelate = '',currentPage = 1,shouldConcat, issueChanged, isScroll,_self) => (dispatch,getState) => {
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid

    !isScroll && thirdParty.toast.loading('加载中...', 0)
	fetchApi('getContactsBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
		endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        relation: wlRelate,
        pageNum:currentPage,
        // pageSize: Limit.YEB_PAGE_SIZE,
        pageSize: '',
        getPeriod: ""
	}),json => {
        if(isScroll) {
            _self.setState({
                isLoading: false
            })
        }
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
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
          dispatch({
            type: ActionTypes.GET_WL_BALANCE_LIST,
            receivedData: json.data.result.childList,
            period: json.data.periodDtoJson,
            issuedate,
            endissuedate,
            getPeriod: "",
            issues,
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
            allBalanceExpenseAmount,
            shouldConcat
          })
        }
	})

        // 获取往来类别树
        dispatch(getContactsTypeList(issuedate,endissuedate,''))
        // 获取往来关系
        dispatch(getContactsRelationList(issuedate, endissuedate, isTop,typeUuid,'true'))

}

export const contactsBalanceTriangleSwitch = (showChild, uuid) => (dispatch) =>{
    dispatch({
          type: ActionTypes.ACCOUNTCONF_WL_BALANCE_TRIANGLE_SWITCH,
          showChild,
          uuid
      })
}


export const changeWlyeMorePeriods = (chooseperiods) => ({
    type: ActionTypes.CHANGE_WLYE_MORE_PERIODS,
    chooseperiods
})

export const getContactsTypeList = (issuedate, endissuedate, getPeriod = '') => (dispatch) => {
    fetchApi('getContactsBalanceCategory', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        getPeriod
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_WL_TYPE_LIST,
                receivedData: json.data.categoryList,
                period: json.data.periodDtoJson,
                getPeriod,
                issues,
            })
        }
	})
}
export const changeWlyebCommonString = () => (dispatch) => {

}
export const changeMenuData = (dataType, value) => (dispatch) => {
    dispatch({
        type: ActionTypes.WLYE_MENU_DATA,
        value,
        dataType
    })
}

export const getContactsRelationList = (issuedate, endissuedate, isTop, typeUuid, getPeriod = '') => (dispatch) => {
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
    fetchApi('getContactsRelation', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        getPeriod
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_WL_RELATION_LIST,
                receivedData: json.data.relationList,
                period: json.data.periodDtoJson,
                getPeriod,
                issues,
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
