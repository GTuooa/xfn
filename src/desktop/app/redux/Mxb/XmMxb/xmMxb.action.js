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

export const changeDetailXmmxCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'
    ? [`${tab}Temp`, place]
    : [
      `${tab}Temp`, ...place
    ]
  if (place[0] === 'flags') {
    placeArr = place
  }
  dispatch({type: ActionTypes.CHANGE_XM_DETAIL_ACCOUNT_COMMON_STRING, tab, placeArr, value})

}
export const clearXmState = () => ({
    type:ActionTypes.CLEAR_XM_STATE
})

export const getFirstProjectDetailList = (issuedate,endissuedate,currentPage=1,amountType='DETAIL_AMOUNT_TYPE_HAPPEN',typeUuid='',curCardUuid='',isTop='true',categoryUuid='',propertyCost='',searchContent='') => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectDetailCategoryList', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        getPeriod:'true',
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeDetailXmmxCommonString('',['flags','projectTypeTree'],fromJS(json.data.categoryList)))
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
            const issuedateNew = issuedate ? issuedate : openedissuedate
            if (!json.data.categoryList.length) {
                dispatch(clearXmState())
                dispatch(changeDetailXmmxCommonString('',['flags','issuedate'],issuedateNew))
                return;
            }
            const cardCategoryUuid = typeUuid || json.data.categoryList[0].uuid
            // const propertyCost = json.data.resultList[0].propertyCost
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi('getProjectDetailCardList', 'POST', JSON.stringify({
                year: issuedateNew.substr(0, 4),
                month: issuedateNew.substr(6, 2),
                endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
                cardCategoryUuid:isTop == 'true' ? cardCategoryUuid : '',
                cardSubUuid:isTop != 'true' ? cardCategoryUuid : '',
                cardPageNum:1,
                getPeriod:'false',
            }),json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                if (showMessage(json)) {
                    dispatch(changeDetailXmmxCommonString('',['flags','cardList'],fromJS(json.data.cardList)))
                    const cardUuid = curCardUuid || json.data.cardList[0].uuid
                    const cardPages = json.data.pages
                    dispatch(changeDetailXmmxCommonString('',['flags','cardPages'],cardPages))
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    fetchApi('getProjectDetailList', 'POST', JSON.stringify({
                        year: issuedateNew.substr(0, 4),
                        month: issuedateNew.substr(6, 2),
                        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
                        getPeriod:false,
                        cardUuid,
                        amountType,
                        categoryUuid,
                        propertyCost,
                        currentPage,
                        searchContent,
                    }),json => {
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        if (showMessage(json)) {
                            const { debitSum, creditSum, total, detailList, pages } = json.data.result
                            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
                            dispatch({
                                type:ActionTypes.GET_XMMX_PROJECT_LIST,
                                detailList,
                                debitSum,
                                creditSum,
                                total,
                                issues,
                                period: json.data.periodDtoJson,
                                getPeriod:'true',
                                issuedate: issuedateNew,
                                endissuedate,
                                curCardUuid:cardUuid,
                                isTop,
                                categoryUuid,
                                propertyCost,
                                amountType,
                                currentPage,
                                cardPageNum:1,
                                pages,
                                typeUuid:cardCategoryUuid,
                                searchContent
                            })
                        }
                    })
                    fetchApi('getProjectDetailRunningCategoryList', 'POST', JSON.stringify({
                        year: issuedate ? issuedate.substr(0, 4) : '',
                        month: issuedate ? issuedate.substr(6, 2) : '',
                        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
                        cardUuid,
                        getPeriod:'false',
                    }), json => {
                        if (showMessage(json)) {
                            dispatch(changeDetailXmmxCommonString('',['flags','runningCategory'],fromJS(json.data.result)))
                        }
                    })
                    dispatch(homeActions.addPageTabPane('MxbPanes', 'XmMxb', 'XmMxb', '项目明细表'))
                    dispatch(homeActions.addHomeTabpane('Mxb', 'XmMxb', '项目明细表'))
                }
            })
        }
    })
}
export const getProjectDetailCardList = (issuedate,endissuedate,amountType,typeUuid,isTop,cardPageNum=1,currentPage=1,searchContent='') => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectDetailCardList', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        cardCategoryUuid:isTop == 'true' ? typeUuid : '',
        cardSubUuid:isTop != 'true' ? typeUuid : '',
        pageNum:cardPageNum,
        getPeriod:'false',
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeDetailXmmxCommonString('',['flags','cardList'],fromJS(json.data.cardList)))
            if (!json.data.cardList.length) {
                return
            }
            const cardUuid = json.data.cardList[0].uuid
            const cardPages = json.data.pages
            dispatch(changeDetailXmmxCommonString('',['flags','cardPages'],cardPages))
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi('getProjectDetailList', 'POST', JSON.stringify({
                year: issuedate ? issuedate.substr(0, 4) : '',
                month: issuedate ? issuedate.substr(6, 2) : '',
                endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
                getPeriod:false,
                cardUuid,
                amountType,
                categoryUuid:'',
                propertyCost:'',
                currentPage,
                searchContent,
            }),json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                if (showMessage(json)) {
                    const { debitSum, creditSum, total, detailList, pages } = json.data.result
                    const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
                    dispatch({
                        type:ActionTypes.GET_XMMX_PROJECT_LIST,
                        detailList,
                        debitSum,
                        creditSum,
                        total,
                        issues,
                        period: json.data.periodDtoJson,
                        getPeriod:'true',
                        issuedate: issuedate,
                        endissuedate,
                        amountType,
                        categoryUuid:'',
                        propertyCost:'',
                        typeUuid,
                        isTop,
                        cardPageNum,
                        currentPage,
                        curCardUuid:cardUuid,
                        pages,
                        searchContent,
                    })
                }
            })
            fetchApi('getProjectDetailRunningCategoryList', 'POST', JSON.stringify({
                year: issuedate ? issuedate.substr(0, 4) : '',
                month: issuedate ? issuedate.substr(6, 2) : '',
                endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
                cardUuid,
                getPeriod:'false',
            }), json => {
                if (showMessage(json)) {
                    dispatch(changeDetailXmmxCommonString('',['flags','runningCategory'],fromJS(json.data.result)))
                }
            })
        }
    })
}
export const getProjectDetailList = (issuedate,endissuedate,currentPage=1,cardUuid,amountType,categoryUuid='',propertyCost='',searchContent='') => (dispatch,getState) => {
    const xmmxState = getState().xmmxState
    const flags = xmmxState.get('flags')
    const typeUuid = flags.get('typeUuid')
    const isTop = flags.get('isTop')
    const cardPageNum = flags.get('cardPageNum')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectDetailList', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        getPeriod:false,
        cardUuid,
        amountType,
        categoryUuid,
        propertyCost,
        currentPage,
        searchContent
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const { debitSum, creditSum, total, detailList, pages } = json.data.result
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type:ActionTypes.GET_XMMX_PROJECT_LIST,
                detailList,
                debitSum,
                creditSum,
                total,
                issues,
                period: json.data.periodDtoJson,
                getPeriod:'true',
                issuedate,
                endissuedate,
                amountType,
                categoryUuid,
                propertyCost,
                typeUuid,
                isTop,
                cardPageNum,
                currentPage,
                curCardUuid:cardUuid,
                pages,
                searchContent
            })
        }
    })
    if (!categoryUuid) {
        fetchApi('getProjectDetailRunningCategoryList', 'POST', JSON.stringify({
            year: issuedate ? issuedate.substr(0, 4) : '',
            month: issuedate ? issuedate.substr(6, 2) : '',
            endYear: endissuedate ? endissuedate.substr(0, 4) : '',
            endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
            cardUuid,
            getPeriod:'false',
        }), json => {
            if (showMessage(json)) {
                dispatch(changeDetailXmmxCommonString('',['flags','runningCategory'],fromJS(json.data.result)))
            }
        })
    }

}
