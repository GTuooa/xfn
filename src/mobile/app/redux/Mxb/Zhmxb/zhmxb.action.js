import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.account'
import * as ActionTypes from './ActionTypes.js'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import { pushVouhcerToLrpzReducer } from 'app/redux/Search/Cxpz/cxpz.action'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as allActions from 'app/redux/Home/All/other.action'


export const getPeriodDetailList = (issuedate) => (dispatch, getState) => {
  dispatch(getDetailsListInfo(issuedate,'','',true))
  // dispatch(getCalculateListInfo(issuedate))
  thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
  const zhmxState = getState().zhmxbState
  const currentPage = 1
  const curCategory = ''
  const accountUuid = ''
  fetchApi('getAccountDetailList', 'POST', JSON.stringify({
    year: issuedate ? issuedate.substr(0, 4) : '',
    month: issuedate ? issuedate.substr(5, 2) : '',
    endYear: '',
	endMonth: '',
    propertyCost:'',
    getPeriod: "true",
    categoryUuid: curCategory,
    currentPage,
    accountUuid,
    pageSize: Limit.ZHMX_LIMIE_LENGTH
  }), json => {
    thirdParty.toast.hide()
    if (showMessage(json)) {
      // if (json.code === 0 && !json.data.vcList.length) {
      // 	message.info('当前月份无任何凭证')
      // }
      const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
      const issuedateNew = issuedate ? issuedate : openedissuedate
       const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
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
  dispatch(getRunningAccount())

}
// 账户
export const getRunningAccount = () => dispatch => {
    fetchApi('getRunningAccount', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.ZHMX_GET_RUNNING_ACCOUNT,
                receivedData: json.data
            })
        }
    })
}
export const changeCommonStr = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
  if(place[0] === 'flags') {placeArr = place}
  dispatch({
    type: ActionTypes.CHANGE_ZHMX_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}

export const getDetailList = (categorValue, issuedate, curPage,accountUuid,endissuedate='',propertyCost='',shouldConcat, issueChanged, isScroll,_self) => (dispatch, getState) => {
  const zhmxState = getState().zhmxbState
  const aUuid = accountUuid ? accountUuid=== '全部' ? '' : accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''

  const currentPage = curPage === '' ? zhmxState.get('currentPage') : curPage
  categorValue = categorValue == '全部' ? '' : categorValue
  const accountType = zhmxState.getIn(['flags', 'accountType'])
  const defaultCategory = zhmxState.getIn(['flags', 'defaultCategory'])
  const acountName = accountUuid=== '全部' ? '' : zhmxState.getIn(['flags', 'acountName'])
  dispatch(getDetailsListInfo(issuedate,endissuedate,accountUuid))
  !isScroll && thirdParty.toast.loading('加载中...', 0)
  fetchApi('getAccountDetailList', 'POST', JSON.stringify({
    year: issuedate ? issuedate.substr(0, 4) : '',
    month: issuedate ? issuedate.substr(5, 2) : '',
    endYear: endissuedate ? endissuedate.substr(0, 4) : '',
    endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
    getPeriod: "true",
    propertyCost,
    accountUuid: aUuid,
    categoryUuid: categorValue,
    currentPage: currentPage,
    pageSize: Limit.ZHMX_LIMIE_LENGTH
  }), json => {
    !isScroll && thirdParty.toast.hide()
    if (showMessage(json)) {
        if(isScroll) {
            _self.setState({
                isLoading: false
            })
        }
         const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
      dispatch({
        type: ActionTypes.GET_ZH_DETAIL_LIST,
        receivedData: json.data.result.detailList,
        period: json.data.periodDtoJson,
        issues,
        issuedate,
        endissuedate,
        currentPage,
        categorValue,
        accountUuid,
        acountName,
        allIncomeAmount: json.data.result.allIncomeAmount,
        allExpenseAmount: json.data.result.allExpenseAmount,
        allBalanceAmount: json.data.result.allBalanceAmount,
        pageCount: json.data.result.pages,
        getPeriod: "true",
        property: json.data.result.propertyName,
        shouldConcat
      })
    }
  })




}

export const getCalculateListInfo = (issuedate)  => (dispatch, getState) => {
const zhmxState = getState().zhmxbState
  fetchApi('getRunningSettingInfo', 'GET', '', json => {
    let hideCategoryList = []
    if (showMessage(json)) {
      json.data.hideCategoryList.map(item => {
        if (item.categoryType !== 'LB_SFGL')
          hideCategoryList.push(item)
      })
      dispatch({type: ActionTypes.INIT_DETAIL_ACCOUNT_LIST, hideCategoryList: hideCategoryList})
    }
  })

}
export const getDetailsListInfo = (issuedate,endissuedate,accountUuid='',defaultCategory = false) => (dispatch, getState) => {
  const zhmxState = getState().zhmxbState
  const aUuid = accountUuid ? accountUuid=== '全部' ? '' : accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
  fetchApi('getAccountDetailCategory', 'POST', JSON.stringify({
      year: issuedate ? issuedate.substr(0, 4) : '',
      month: issuedate ? issuedate.substr(5, 2) : '',
      endYear: endissuedate ? endissuedate.substr(0, 4) : '',
      endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
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

export const getBusinessDetail = (history,item, issuedate,endissuedate) => (dispatch) => {
  thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
  dispatch(getRunningAccount())
  const uuid = item.get('uuid')
  const accountUuid = `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}`
  const monthExpenseAmount = item.get('monthExpenseAmount')
  const monthIncomeAmount = item.get('monthIncomeAmount')
  const accountType = item.get('type')

  fetchApi('getAccountDetailList', 'POST', JSON.stringify({
      year: issuedate ? issuedate.substr(0, 4) : '',
      month: issuedate ? issuedate.substr(5, 2) : '',
      endYear: endissuedate ? endissuedate.substr(0, 4) : '',
      endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
      categoryUuid: '',
      accountUuid: uuid,
      currentPage: 1,
      pageSize: Limit.ZHMX_LIMIE_LENGTH,
      getPeriod: "true"
  }), json => {
    thirdParty.toast.hide()
    if (showMessage(json)) {
      dispatch(getDetailsListInfo(issuedate,endissuedate,accountUuid))
       const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
      dispatch({
        type: ActionTypes.GET_ZH_DETAIL_LIST,
        receivedData: json.data.result.detailList,
        period: json.data.periodDtoJson,
        issues,
        issuedate,
        accountUuid,
        endissuedate,
        categoryType:'全部',
        accountType:item.get('name'),
        currentPage: 1,
        categorValue: '',
        allIncomeAmount: json.data.result.allIncomeAmount,
        allExpenseAmount: json.data.result.allExpenseAmount,
        allBalanceAmount: json.data.result.allBalanceAmount,
        pageCount: json.data.result.pages,
        getPeriod: "true",
        property: json.data.result.propertyName
      })
     history.push('Zhmxb')
    }
  })

}

export const changeZhmxMorePeriods = (chooseperiods) => ({
	type: ActionTypes.CHANGE_ZHMX_MORE_PERIODS,
	chooseperiods
})

export const accountDetailTriangleSwitch = (showChild, uuid) => ({
    type: ActionTypes.ZHMX_DETAIL_TRIANGLE_SWITCH,
    showChild,
    uuid
})
export const changeMenuData = (dataType, value) => ({
    type: ActionTypes.ZHMX_MENU_DATA,
    value,
	dataType
})
