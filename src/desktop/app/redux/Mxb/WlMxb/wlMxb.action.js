import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { fromJS, toJS } from 'immutable'

import { showMessage, formatDate } from 'app/utils'
import { message } from 'antd'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/all.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as homeActions from 'app/redux/Home/home.action.js'

export const getPeriodDetailList = (issuedate,endissuedate,isTop,typeUuid,curCardUuid,isYeJump = false) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const wlmxbState = getState().wlmxbState
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
    fetchApi('getContactsDetailCardList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        pageNum: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        getPeriod: 'true'
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_WLMX_CARD_LIST,
                receivedData: json.data.cardList,
                period: json.data.periodDtoJson,
                issues,
                cardPages:json.data.pages,
                cardCurPage: 1,
                getPeriod: 'true',
            })
            let hasCard = false
            json.data.cardList.map(item => {
                if(item.uuid === curCardUuid){
                    hasCard = true
                }
            })
            const cUuid = hasCard ? curCardUuid : (json.data.cardList[0] ? json.data.cardList[0].uuid : '')
            dispatch(getDetailList(issuedateNew,endissuedate,cUuid,'','',1,'true'))
            dispatch(getContactsRunningCategory(issuedateNew,endissuedate,cUuid,'true'))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardUuid'],cUuid))
        }
	})
    dispatch(getContactsTypeList(issuedate,endissuedate,'true'))
    if(isYeJump){
        dispatch(homeActions.addPageTabPane('MxbPanes', 'WlMxb', 'WlMxb', '往来明细表'))
        dispatch(homeActions.addHomeTabpane('Mxb', 'WlMxb', '往来明细表'))
    }

}
export const reflashDetailList = (issuedate,endissuedate,isTop,typeUuid,curCardUuid,categoryUuid,propertyCost,currentPage,cardCurPage,searchContent='') => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const wlmxbState = getState().wlmxbState
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
    fetchApi('getContactsDetailCardList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        pageNum: currentPage,
        pageSize: Limit.MXB_PAGE_SIZE,
        getPeriod: 'true'
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_WLMX_CARD_LIST,
                receivedData: json.data.cardList,
                period: json.data.periodDtoJson,
                cardPages:json.data.pages,
                cardCurPage: cardCurPage,
                getPeriod: 'true',
                issues
            })
            const cUuid = curCardUuid ? curCardUuid : json.data.cardList[0] ? json.data.cardList[0].uuid : ''
            dispatch(getDetailList(issuedate,endissuedate,cUuid,categoryUuid,propertyCost,currentPage,'true',searchContent))
            dispatch(getContactsRunningCategory(issuedate,endissuedate,cUuid,'true'))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardUuid'],cUuid))
        }
	})
    dispatch(getContactsTypeList(issuedate,endissuedate,'true'))

}

export const getDetailList = (issuedate, endissuedate,cardUuid,categoryUuid,propertyCost,pageNum,getPeriod,searchContent='') => (dispatch, getState) => {
  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

  fetchApi('getContactsDetailList', 'POST', JSON.stringify({
    year: issuedate ? issuedate.substr(0, 4) : '',
    month: issuedate ? issuedate.substr(6, 2) : '',
    endYear: endissuedate ? endissuedate.substr(0, 4) : '',
    endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
    cardUuid,
    categoryUuid,
    propertyCost,
    pageNum,
    pageSize: Limit.MXB_PAGE_SIZE,
    getPeriod: "true",
    searchContent
  }), json => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (showMessage(json)) {
        const { allHappenIncomeAmount, allHappenExpenseAmount, allPaymentIncomeAmount, allPaymentExpenseAmount, allBalanceAmount, direction, relation:wlRelate, pages:pageNum } = json.data.result
        const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
        dispatch({
        type: ActionTypes.GET_WLMX_DETAIL_LIST,
        receivedData: json.data.result.detailList,
        period: json.data.periodDtoJson,
        issuedate,
        issues,
        endissuedate,
        curCardUuid: cardUuid,
        curPage:pageNum,
        allHappenIncomeAmount,
        allHappenExpenseAmount,
        allPaymentIncomeAmount,
        allPaymentExpenseAmount,
        allBalanceAmount,
        direction,
        wlRelate,
        pageNum,
        getPeriod: "true",
        searchContent,
      })
    }
  })




}

export const changeDetailAccountCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string' ? [`${tab}Temp`, place] : [`${tab}Temp`, ...place ]
  if (place[0] === 'flags') {
    placeArr = place
  }
  dispatch({type: ActionTypes.CHANGE_WLMX_DETAIL_ACCOUNT_COMMON_STRING, tab, placeArr, value})

}


export const getBusinessDetail = (item, issuedate,endissuedate,typeUuid,wlType,searchContent='') => (dispatch) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getContactsDetailList', 'POST', JSON.stringify({
      year: issuedate ? issuedate.substr(0, 4) : '',
      month: issuedate ? issuedate.substr(6, 2) : '',
      endYear: endissuedate ? endissuedate.substr(0, 4) : '',
      endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
      cardUuid:item.get('uuid'),
      categoryUuid:'',
      propertyCost:'',
      pageNum: 1,
      pageSize: Limit.MXB_PAGE_SIZE,
      getPeriod: "true",
      searchContent
    }), json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const { allHappenIncomeAmount, allHappenExpenseAmount, allPaymentIncomeAmount, allPaymentExpenseAmount, allBalanceAmount, direction, relation:wlRelate, pages:pageNum } = json.data.result
          const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
          dispatch({
          type: ActionTypes.GET_WLMX_DETAIL_LIST,
          receivedData: json.data.result.detailList,
          period: json.data.periodDtoJson,
          issuedate,
          issues,
          endissuedate,
          typeUuid,
          wlType,
          curCardUuid: item.get('uuid'),
          curPage:pageNum,
          allHappenIncomeAmount,
          allHappenExpenseAmount,
          allPaymentIncomeAmount,
          allPaymentExpenseAmount,
          allBalanceAmount,
          direction,
          wlRelate,
          pageNum,
          getPeriod: "true",
          searchContent,
        })
      }
    })
    dispatch(homeActions.addPageTabPane('MxbPanes', 'WlMxb', 'WlMxb', '往来明细表'))
    dispatch(homeActions.addHomeTabpane('Mxb', 'WlMxb', '往来明细表'))


}

export const changeWlmxMorePeriods = (chooseperiods) => ({
	type: ActionTypes.CHANGE_WLMX_MORE_PERIODS,
	chooseperiods
})


export const getContactsTypeList = (issuedate, endissuedate, getPeriod = '') => (dispatch) => {
    fetchApi('getContactsDetailCategory', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        getPeriod
	}),json => {
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_WLMX_TYPE_LIST,
                receivedData: json.data.categoryList,
                period: json.data.periodDtoJson,
                issues,
                getPeriod,
            })
        }
	})
}

export const getContactsCardList = (issuedate, endissuedate, isTop, typeUuid, getPeriod = '',curPage = 1, isYeJump = false, cardUuid = '') => (dispatch, getState) => {
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
    const wlmxState = getState().wlmxState
    const categoryUuid = isYeJump ? '' : wlmxState.getIn(['flags','categoryUuid'])
    const propertyCost = isYeJump ? '' : wlmxState.getIn(['flags','propertyCost'])
    if(isYeJump){
        dispatch(changeDetailAccountCommonString('',['flags', 'categoryName'],'全部'))
    }

    fetchApi('getContactsDetailCardList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        pageNum: curPage,
        pageSize: Limit.MXB_PAGE_SIZE,
        getPeriod
	}),json => {
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_WLMX_CARD_LIST,
                receivedData: json.data.cardList,
                period: json.data.periodDtoJson,
                cardPages:json.data.pages,
                cardCurPage:curPage,
                issues,
                getPeriod,
            })

            const cUuid = !isYeJump ? (json.data.cardList[0] ? json.data.cardList[0].uuid : '') : cardUuid
            dispatch(getDetailList(issuedate,endissuedate,cUuid,categoryUuid,propertyCost,1,'true'))
            dispatch(getContactsRunningCategory(issuedate, endissuedate,cUuid))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardUuid'],cUuid))
        }
	})
}
export const getContactsRunningCategory = (issuedate, endissuedate,cardUuid, getPeriod = '') => (dispatch) => {
    fetchApi('getContactsRunningCategory', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        cardUuid,
        getPeriod
	}),json => {
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_WLMX_RUNNING_CATEGORY,
                receivedData: json.data.runningCategoryList,
                period: json.data.periodDtoJson,
                getPeriod,
                issues
            })
        }
	})
}
