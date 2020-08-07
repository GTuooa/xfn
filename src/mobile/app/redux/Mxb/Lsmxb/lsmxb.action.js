import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.account'
import * as ActionTypes from './ActionTypes.js'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import { pushVouhcerToLrpzReducer } from 'app/redux/Search/Cxpz/cxpz.action'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as allActions from 'app/redux/Home/All/other.action'

export const getPeriodDetailList = (issuedate) => dispatch => {
	dispatch(getDetailsListInfo(issuedate))
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getBusinessDetailList', 'POST', JSON.stringify({
      year: issuedate ? issuedate.substr(0, 4) : '',
      month: issuedate ? issuedate.substr(5, 2) : '',
      getPeriod: "true",
      categoryUuid: '',
      currentPage: 1,
      amountType: 'DETAIL_AMOUNT_TYPE_HAPPEN',
      accountUuid: "",
      pageSize: Limit.LSMX_LIMIE_LENGTH
    }), json => {
      thirdParty.toast.hide()
      if (showMessage(json)) {
        const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
        const issuedateNew = issuedate ? issuedate : openedissuedate
        dispatch({
          type: ActionTypes.GET_DETAIL_LIST,
          receivedData: json.data.result.detailList,
          period: json.data.periodDtoJson,
          issuedate: issuedateNew,
          getPeriod: "true",
          currentPage: 1,
          amountType: 'DETAIL_AMOUNT_TYPE_HAPPEN',
          allHappenAmount: json.data.result.allHappenAmount,
          allHappenBalanceAmount: json.data.result.allHappenBalanceAmount,
          allIncomeAmount: json.data.result.allIncomeAmount,
          allExpenseAmount: json.data.result.allExpenseAmount,
          allBalanceAmount: json.data.result.allBalanceAmount,
          pageCount: json.data.result.pages,
          property: json.data.result.property
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
                type: ActionTypes.LSMX_GET_RUNNING_ACCOUNT,
                receivedData: json.data
            })
        }
    })
}

export const getDetailList = (categorValue,issuedate, curPage, amountType, accountUuid, propertyCost='', shouldConcat, issueChanged, isScroll,_self) => (dispatch, getState) => {
  const lsmxbState = getState().lsmxbState
  amountType = amountType ? amountType : lsmxbState.getIn(['flags', 'amountType'])
  const aUuid = accountUuid ? accountUuid=== '全部' ? '' : accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
  dispatch(getDetailsListInfo(issuedate, amountType, accountUuid))
  const currentPage = curPage === '' ? lsmxbState.get('currentPage') : curPage
  categorValue =  categorValue == '全部' ? '' : categorValue
  !isScroll && thirdParty.toast.loading('加载中...', 0)
  fetchApi('getBusinessDetailList', 'POST', JSON.stringify({
    year: issuedate ? issuedate.substr(0, 4) : '',
    month: issuedate ? issuedate.substr(5, 2) : '',
    getPeriod: "true",
    accountUuid: aUuid,
    categoryUuid: categorValue,
    amountType,
    propertyCost,
    currentPage,
    pageSize: Limit.LSMX_LIMIE_LENGTH
  }), json => {
	  !isScroll && thirdParty.toast.hide()
	  if (showMessage(json)) {
		  if(isScroll) {
			  _self.setState({
				  isLoading: false
			  })
		  }
		  dispatch({
			  type: ActionTypes.GET_DETAIL_LIST,
			  receivedData: json.data.result.detailList,
			  issuedate,
			  currentPage,
			  categorValue,
			  amountType,
			  accountUuid,
	          getPeriod: "true",
	          period: json.data.periodDtoJson,
			  allHappenAmount: json.data.result.allHappenAmount,
			  allHappenBalanceAmount: json.data.result.allHappenBalanceAmount,
			  allIncomeAmount: json.data.result.allIncomeAmount,
			  allExpenseAmount: json.data.result.allExpenseAmount,
			  allBalanceAmount: json.data.result.allBalanceAmount,
			  pageCount:json.data.result.pages,
			  property: json.data.result.propertyName,
			  shouldConcat
	      })
	      dispatch(getRunningAccount())
	  }
  })
}

// 类别树
export const getDetailsListInfo = (issuedate,amountType,accountUuid='') => (dispatch, getState) => {
  const lsmxbState = getState().lsmxbState
  amountType = amountType ? amountType :lsmxbState.getIn(['flags', 'amountType'])
  const aUuid = accountUuid ? accountUuid=== '全部' ? '' : accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
  fetchApi('getRunningDetailCategory', 'POST', JSON.stringify({
    year: issuedate ? issuedate.substr(0, 4) : '',
    month: issuedate ? issuedate.substr(5, 2) : '',
    accountUuid: aUuid,
    amountType
  }), json => {
    if (showMessage(json)) {
      dispatch({
        type: ActionTypes.GET_RUNNING_CATEGORY_DETAIL,
        receivedData: json.data,
        accountUuid,
		amountType
      })
    }
  })
}

export const changeCommonStr = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
  if(place[0] === 'flags') {placeArr = place}
  dispatch({
    type: ActionTypes.CHANGE_LSMX_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}

export const getBusinessDetail = (history, item, issuedate) => (dispatch) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
  	const uuid = item.get('categoryUuid')
  	const monthHappenAmount = item.get('monthHappenAmount')
  	const amountType = monthHappenAmount == 0 ? 'DETAIL_AMOUNT_TYPE_BALANCE' : 'DETAIL_AMOUNT_TYPE_HAPPEN'
  	// const categoryType = item.get('categoryType')
  	const categoryType = item.get('categoryName')
  	const propertyCost = item.get('propertyCost')

  	fetchApi('getBusinessDetailList', 'POST', JSON.stringify({
  		  year: issuedate ? issuedate.substr(0, 4) : '',
  		  month: issuedate ? issuedate.substr(5, 2) : '',
	  	  categoryUuid: uuid,
	  	  currentPage: 1,
	  	  amountType,
	  	  propertyCost,
	  	  pageSize: Limit.LSMX_LIMIE_LENGTH,
	  	  getPeriod: "true"
	  	  }), json => {
			  thirdParty.toast.hide()
		  	  if (showMessage(json)) {
				  dispatch(getDetailsListInfo(issuedate,amountType,''))
				  dispatch({
			  		  type: ActionTypes.GET_DETAIL_LIST,
			  		  receivedData: json.data.result.detailList,
			  		  issuedate,
			  		  categoryType,
			  		  currentPage: 1,
			  		  categorValue: uuid,
			  		  amountType,
			  		  allHappenAmount: json.data.result.allHappenAmount,
			  		  allHappenBalanceAmount: json.data.result.allHappenBalanceAmount,
			  		  allIncomeAmount: json.data.result.allIncomeAmount,
			  		  allExpenseAmount: json.data.result.allExpenseAmount,
			  		  allBalanceAmount: json.data.result.allBalanceAmount,
			  		  pageCount: json.data.result.pages,
			  		  getPeriod: "true",
			          period: json.data.periodDtoJson,
			  		  property: json.data.result.propertyName,
					  shouldConcat: false
				  })

				  history.push('Lsmxb')
			  }
  	})
}

export const changeMenuData = (dataType, value) => ({
    type: ActionTypes.LSMX_MENU_DATA,
    value,
	dataType
})
