import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { fromJS, toJS } from 'immutable'

import { showMessage, formatDate } from 'app/utils'
import { message } from 'antd'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/all.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as homeActions from 'app/redux/Home/home.action.js'

export const getPeriodDetailList = (issuedate) => (dispatch, getState) => {
  dispatch(getDetailsListInfo(issuedate,'','',true))
  // dispatch(getCalculateListInfo(issuedate))
  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
  const zhmxState = getState().zhmxState
  const currentPage = 1
  const curCategory = ''
  const accountUuid = ''
  fetchApi('getAccountDetailList', 'POST', JSON.stringify({
    year: issuedate ? issuedate.substr(0, 4) : '',
    month: issuedate ? issuedate.substr(6, 2) : '',
    endYear: '',
	endMonth: '',
    propertyCost:'',
    getPeriod: "true",
    categoryUuid: curCategory,
    currentPage,
    accountUuid,
    pageSize: Limit.LSMX_LIMIE_LENGTH
  }), json => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (showMessage(json)) {
      // if (json.code === 0 && !json.data.vcList.length) {
      // 	message.info('当前月份无任何凭证')
      // }
      const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
      const issuedateNew = issuedate ? issuedate : openedissuedate
      const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
      dispatch({
        type: ActionTypes.GET_ZH_DETAIL_LIST,
        receivedData: json.data.result.detailList,
        period: json.data.periodDtoJson,
        issuedate: issuedateNew,
        endissuedate:'',
        getPeriod: "true",
        currentPage,
        issues,
        allIncomeAmount: json.data.result.allIncomeAmount,
        allExpenseAmount: json.data.result.allExpenseAmount,
        allBalanceAmount: json.data.result.allBalanceAmount,
        pageCount: json.data.result.pages,
        property: json.data.result.propertyName
      })
    }
  })
  dispatch(accountConfActions.getRunningAccount())

}

export const getDetailList = (categorValue, issuedate, curPage,accountUuid,endissuedate='',propertyCost='',searchContent = '') => (dispatch, getState) => {
  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
  const zhmxState = getState().zhmxState
  const aUuid = accountUuid ? accountUuid=== '全部' ? '' : accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''

  const currentPage = curPage === '' ? zhmxState.get('currentPage') : curPage
  categorValue = categorValue == '全部' ? '' : categorValue
  const paymentType = zhmxState.getIn(['flags', 'paymentType'])
  const accountType = zhmxState.getIn(['flags', 'accountType'])
  const defaultCategory = zhmxState.getIn(['flags', 'defaultCategory'])
  dispatch(getDetailsListInfo(issuedate,endissuedate,accountUuid))
  fetchApi('getAccountDetailList', 'POST', JSON.stringify({
    year: issuedate ? issuedate.substr(0, 4) : '',
    month: issuedate ? issuedate.substr(6, 2) : '',
    endYear: endissuedate ? endissuedate.substr(0, 4) : '',
    endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
    getPeriod: "true",
    propertyCost,
    accountUuid: aUuid,
    categoryUuid: categorValue,
    currentPage: currentPage,
    pageSize: Limit.LSMX_LIMIE_LENGTH,
    searchContent
  }), json => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (showMessage(json)) {
        const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
      dispatch({
        type: ActionTypes.GET_ZH_DETAIL_LIST,
        receivedData: json.data.result.detailList,
        period: json.data.periodDtoJson,
        issuedate,
        issues,
        endissuedate,
        currentPage,
        categorValue,
        accountUuid,
        allIncomeAmount: json.data.result.allIncomeAmount,
        allExpenseAmount: json.data.result.allExpenseAmount,
        allBalanceAmount: json.data.result.allBalanceAmount,
        pageCount: json.data.result.pages,
        getPeriod: "true",
        property: json.data.result.propertyName,
        searchContent
      })
    }
  })




}

// export const getCalculateListInfo = (issuedate)  => (dispatch, getState) => {
// const zhmxState = getState().zhmxState
//   fetchApi('getRunningSettingInfo', 'GET', '', json => {
//     let hideCategoryList = []
//     if (showMessage(json)) {
//       json.data.hideCategoryList.map(item => {
//         if (item.categoryType !== 'LB_SFGL')
//           hideCategoryList.push(item)
//       })
//       dispatch({type: ActionTypes.INIT_DETAIL_ACCOUNT_LIST, hideCategoryList: hideCategoryList})
//     }
//   })

// }
export const getDetailsListInfo = (issuedate,endissuedate,accountUuid='',defaultCategory = false) => (dispatch, getState) => {
  const zhmxState = getState().zhmxState
  const aUuid = accountUuid ? accountUuid=== '全部' ? '' : accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
  fetchApi('getAccountDetailCategory', 'POST', JSON.stringify({
      year: issuedate ? issuedate.substr(0, 4) : '',
      month: issuedate ? issuedate.substr(6, 2) : '',
      endYear: endissuedate ? endissuedate.substr(0, 4) : '',
      endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
      accountUuid: aUuid,
  }), json => {
    if (showMessage(json)) {
      dispatch({
        type: ActionTypes.GET_ZH_RUNNING_CATEGORY_DETAIL,
        receivedData: json.data,
        accountUuid,
        defaultCategory
      })
    }
  })
}

export const changeDetailAccountCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'
    ? [`${tab}Temp`, place]
    : [
      `${tab}Temp`, ...place
    ]
  if (place[0] === 'flags') {
    placeArr = place
  }
  dispatch({type: ActionTypes.CHANGE_ZH_DETAIL_ACCOUNT_COMMON_STRING, tab, placeArr, value})

}

export const getBusinessDetail = (item, issuedate,endissuedate) => (dispatch) => {
  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
  const uuid = item.get('uuid')
  const accountUuid = `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}`
  const monthExpenseAmount = item.get('monthExpenseAmount')
  const monthIncomeAmount = item.get('monthIncomeAmount')
  const categoryType = item.get('categoryType')
  const accountType = item.get('categoryName')

  fetchApi('getAccountDetailList', 'POST', JSON.stringify({
      year: issuedate ? issuedate.substr(0, 4) : '',
      month: issuedate ? issuedate.substr(6, 2) : '',
      endYear: endissuedate ? endissuedate.substr(0, 4) : '',
      endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
      categoryUuid: '',
      accountUuid: uuid,
      currentPage: 1,
      pageSize: Limit.LSMX_LIMIE_LENGTH,
      getPeriod: "true"
  }), json => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (showMessage(json)) {
      dispatch(getDetailsListInfo(issuedate,endissuedate,accountUuid))
      const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
      dispatch({
        type: ActionTypes.GET_ZH_DETAIL_LIST,
        receivedData: json.data.result.detailList,
        period: json.data.periodDtoJson,
        issuedate,
        issues,
        accountName:item.get('name'),
        accountUuid,
        endissuedate,
        categoryType,
        accountType,
        currentPage: 1,
        categorValue: '',
        allIncomeAmount: json.data.result.allIncomeAmount,
        allExpenseAmount: json.data.result.allExpenseAmount,
        allBalanceAmount: json.data.result.allBalanceAmount,
        pageCount: json.data.result.pages,
        getPeriod: "true",
        property: json.data.result.propertyName
      })
      // yezi
      // dispatch(homeActions.addTabpane('Lsmx'))
      dispatch(homeActions.addPageTabPane('MxbPanes', 'ZhMxb', 'ZhMxb', '账户明细表'))
      dispatch(homeActions.addHomeTabpane('Mxb', 'ZhMxb', '账户明细表'))
    }
  })

}

export const changeZhmxMorePeriods = (chooseperiods) => ({
	type: ActionTypes.CHANGE_ZHMX_MORE_PERIODS,
	chooseperiods
})

export const accountDetailTriangleSwitch = (showChild, uuid) => ({
    type: ActionTypes.ACCOUNTCONF_DETAIL_TRIANGLE_SWITCH,
    showChild,
    uuid
})
