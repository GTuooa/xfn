import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { fromJS, toJS } from 'immutable'

import { showMessage, formatDate } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

export const getPeriodDetailList = (issuedate,endissuedate,isTop,typeUuid,curCardUuid,isYeJump = false,history) => (dispatch, getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const wlmxbState = getState().wlmxbState
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
    fetchApi('getContactsDetailCardList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        pageNum: 1,
        // pageSize: Limit.MXB_PAGE_SIZE,
        pageSize: undefined,
        getPeriod: 'true'
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
             const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_WLMX_CARD_LIST,
                receivedData: json.data.cardList,
                period: json.data.periodDtoJson,
                cardPages:json.data.pages,
                cardCurPage: 1,
                issues,
                getPeriod: 'true',
            })
            let hasCard = false
            json.data.cardList.map(item => {
                if(item.uuid === curCardUuid){
                    hasCard = true
                }
            })

            const cUuid = hasCard ? curCardUuid : (json.data.cardList[0] ? json.data.cardList[0].uuid : '')
            const cName = hasCard ? wlmxbState.getIn(['flags','curCardName']) : (json.data.cardList[0] ? `${json.data.cardList[0].code} ${json.data.cardList[0].name}` : '暂无卡片')
            dispatch(getDetailList(issuedateNew,endissuedate,cUuid,'','',1,'true'))
            dispatch(getContactsRunningCategory(issuedateNew,endissuedate,cUuid,'true'))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardUuid'],cUuid))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardName'],cName))
        }
	})
    dispatch(getContactsTypeList(issuedate,endissuedate,'true'))
    if(isYeJump){
        history.push('Wlmxb')
        dispatch(changeMenuData('menuType', ''))
        dispatch(changeDetailAccountCommonString('', ['flags', 'categoryName'], '全部'))
    }
}
export const reflashDetailList = (issuedate,endissuedate,isTop,typeUuid,curCardUuid,categoryUuid,propertyCost,currentPage,cardCurPage) => (dispatch, getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const wlmxbState = getState().wlmxbState
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
    fetchApi('getContactsDetailCardList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        pageNum: currentPage,
        // pageSize: Limit.MXB_PAGE_SIZE,
        pageSize: undefined,
        getPeriod: 'true'
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
             const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_WLMX_CARD_LIST,
                receivedData: json.data.cardList,
                period: json.data.periodDtoJson,
                cardPages:json.data.pages,
                cardCurPage: cardCurPage,
                issues,
                getPeriod: 'true',
            })
            const cUuid = curCardUuid ? curCardUuid : json.data.cardList[0] ? json.data.cardList[0].uuid : ''
            const cName = curCardUuid ? wlmxbState.getIn(['flags','curCardName']) :json.data.cardList[0] ? `${json.data.cardList[0].code} ${json.data.cardList[0].name}` : '暂无卡片'
            dispatch(getDetailList(issuedate,endissuedate,cUuid,categoryUuid,propertyCost,currentPage,'true'))
            dispatch(getContactsRunningCategory(issuedate,endissuedate,cUuid,'true'))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardUuid'],cUuid))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardName'],cName))
        }
	})
    dispatch(getContactsTypeList(issuedate,endissuedate,'true'))

}

export const getDetailList = (issuedate, endissuedate,cardUuid,categoryUuid,propertyCost,pageNum,getPeriod,shouldConcat, isScroll,_self) => (dispatch, getState) => {
  !isScroll && thirdParty.toast.loading('加载中...', 0)
  dispatch(changeDetailAccountCommonString('',['flags', 'categoryUuid'],categoryUuid))
  dispatch(changeDetailAccountCommonString('',['flags', 'propertyCost'],propertyCost))
  fetchApi('getContactsDetailList', 'POST', JSON.stringify({
    year: issuedate ? issuedate.substr(0, 4) : '',
    month: issuedate ? issuedate.substr(5, 2) : '',
    endYear: endissuedate ? endissuedate.substr(0, 4) : '',
    endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
    cardUuid,
    categoryUuid,
    propertyCost,
    pageNum,
    // pageSize: Limit.MXB_PAGE_SIZE,
    pageSize: undefined,
    getPeriod: "true",

  }), json => {
    thirdParty.toast.hide()
    if (showMessage(json)) {
        if(isScroll) {
            _self.setState({
                isLoading: false
            })
        }
        const { allHappenIncomeAmount, allHappenExpenseAmount, allPaymentIncomeAmount, allPaymentExpenseAmount, allBalanceAmount, direction, relation:wlRelate, pages:pageNum } = json.data.result
        const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
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
        shouldConcat,
        getPeriod: "true",
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


export const getBusinessDetail = (item, issuedate,endissuedate,typeUuid,wlType,history) => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const curCardName = item.get('code') ? `${item.get('code')} ${item.get('name')}` : ''
    const curCardUuid = item.get('code') ? item.get('uuid') : ''
    fetchApi('getContactsDetailList', 'POST', JSON.stringify({
      year: issuedate ? issuedate.substr(0, 4) : '',
      month: issuedate ? issuedate.substr(5, 2) : '',
      endYear: endissuedate ? endissuedate.substr(0, 4) : '',
      endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
      cardUuid:curCardUuid,
      categoryUuid:'',
      propertyCost:'',
      pageNum: 1,
    //   pageSize: Limit.MXB_PAGE_SIZE,
      pageSize: undefined,
      getPeriod: "true",

    }), json => {
      thirdParty.toast.hide()
      if (showMessage(json)) {
          const { allHappenIncomeAmount, allHappenExpenseAmount, allPaymentIncomeAmount, allPaymentExpenseAmount, allBalanceAmount, direction, relation:wlRelate, pages:pageNum } = json.data.result
          const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
        dispatch({
          type: ActionTypes.GET_WLMX_DETAIL_LIST,
          receivedData: json.data.result.detailList,
          period: json.data.periodDtoJson,
          issues,
          issuedate,
          endissuedate,
          typeUuid,
          wlType,
          curCardName,
          curCardUuid,
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
        })
      }
    })
    dispatch(changeMenuData('menuType', ''))
    dispatch(changeDetailAccountCommonString('', ['flags', 'categoryName'], '全部'))
      history.push('Wlmxb')


}

export const changeWlmxMorePeriods = (chooseperiods) => ({
	type: ActionTypes.CHANGE_WLMX_MORE_PERIODS,
	chooseperiods
})


export const getContactsTypeList = (issuedate, endissuedate, getPeriod = '') => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getContactsDetailCategory', 'POST',JSON.stringify({
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
                type: ActionTypes.GET_WLMX_TYPE_LIST,
                receivedData: json.data.categoryList,
                period: json.data.periodDtoJson,
                issues,
                getPeriod,
            })
        }
	})
}

export const getContactsCardList = (issuedate, endissuedate, isTop, typeUuid, getPeriod = '',curPage = 1, isYeJump = false, cardUuid = '',cardName = '请选择卡片',typeJump = false) => (dispatch, getState) => {
    let cardCategoryUuid = '', cardSubUuid = ''
    isTop === 'true' ? cardCategoryUuid = typeUuid : cardSubUuid = typeUuid
    const wlmxbState = getState().wlmxbState
    // const categoryUuid = wlmxbState.getIn(['flags','categoryUuid'])
    // const propertyCost = wlmxbState.getIn(['flags','propertyCost'])
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getContactsDetailCardList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        cardCategoryUuid,
        cardSubUuid,
        pageNum: curPage,
        // pageSize: Limit.MXB_PAGE_SIZE,
        pageSize: undefined,
        getPeriod
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_WLMX_CARD_LIST,
                receivedData: json.data.cardList,
                period: json.data.periodDtoJson,
                cardPages:json.data.pages,
                cardCurPage:curPage,
                issues,
                getPeriod,
            })
            const resultList = fromJS(json.data.cardList)
			const cardList = resultList.map(v => {return {key: `${v.get('code')} ${v.get('name')}`, value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('code')}`}})
            if(!isYeJump){
                if(cardList.size > 0){
                    thirdParty.chosen({
                        source : cardList.toJS(),
                        onSuccess(result) {
                            if(result){
                                const valueList = result.value.split(Limit.TREE_JOIN_STR)
                                const code = valueList[2]
                                const name = valueList[1]
                                dispatch(changeDetailAccountCommonString('',['flags', 'curCardName'],`${code} ${name}`))
                                dispatch(getDetailList(issuedate,endissuedate,valueList[0],'','',1,'true'))
                            }
                        }
                    })
                }else{
                    thirdParty.toast.info('无可选对象')
                }
            }
            const cUuid = !isYeJump || typeJump ? (json.data.cardList[0] ? json.data.cardList[0].uuid : '') : cardUuid
            const cName = !isYeJump || typeJump ? (json.data.cardList[0] ? `${json.data.cardList[0].code} ${json.data.cardList[0].name}` : '暂无卡片') : cardName
            // dispatch(getDetailList(issuedate,endissuedate,cUuid,categoryUuid,propertyCost,1,'true',shouldConcat, isScroll,_self))
            dispatch(getContactsRunningCategory(issuedate, endissuedate,cUuid))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardUuid'],cUuid))
            dispatch(changeDetailAccountCommonString('',['flags', 'curCardName'],cName))
        }
	})
}
export const getContactsRunningCategory = (issuedate, endissuedate,cardUuid, getPeriod = '') => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getContactsRunningCategory', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        cardUuid,
        getPeriod
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
         const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_WLMX_RUNNING_CATEGORY,
                receivedData: json.data.runningCategoryList,
                period: json.data.periodDtoJson,
                issues,
                getPeriod,
            })
        }
	})
}
export const changeMenuData = (dataType, value) => (dispatch) => {
    dispatch({
        type: ActionTypes.WLMX_MENU_DATA,
        value,
        dataType
    })
}
