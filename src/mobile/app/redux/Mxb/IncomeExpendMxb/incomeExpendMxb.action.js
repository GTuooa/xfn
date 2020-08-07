import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

// 从余额表跳明细表
export const getIncomeExpendMxbListFromIncomeExpendYeb = (issuedate, endissuedate, currentCategoryUuid,categoryName, history) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    dispatch(getIncomeExpendDetailCategory(issuedate, endissuedate))

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate ? endissuedate : '',
        jrCategoryUuid: currentCategoryUuid,
        jrAbstract:'',
        currentPage: 1,
        pageSize: Limit.LSMX_LIMIE_LENGTH,
        needPeriod: 'true',
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            let  issuedateNew = issuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            issuedateNew = issuedate ? issuedate : openedissuedate
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,
                receivedData: json.data,
                issuedate: issuedateNew,
                endissuedate: endissuedate,
                currentCategoryUuid,
                categoryName,
                jrAbstract: '',
                currentPage: 1,
                issues,
                needPeriod:'true'
            })
        }
    })
    history.push('incomeExpendMxb')
}
export const getPeriodAndIncomeExpendMxbList = (issuedate, endissuedate,currentCategoryUuid = '',jrAbstract = '') => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const incomeExpendMxbState = getState().incomeExpendMxbState
    const categoryUuid = incomeExpendMxbState.getIn(['views','categoryUuid'])
    const categoryName = incomeExpendMxbState.getIn(['views','categoryName'])
    fetchApi('getIncomeExpendMxbCategory', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        needPeriod: 'true',
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            let  issuedateNew = issuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            issuedateNew = issuedate ? issuedate : openedissuedate
            if(json.data.result[0]){
                dispatch({
                    type: ActionTypes.GET_INCOME_EXPEND_MXB_CATEGORY,
                    receivedData: json.data.result,
                })
                let hasCategoryItem = false
                let newCategoryUuid = categoryUuid
                let newCategoryName = categoryName
                const loop = (data) => data.map(item => {
                    if(item.jrCategoryUuid === categoryUuid){
                        hasCategoryItem = true
                    }
                    if(item.childList.length > 0){
                        loop(item.childList)
                    }
                })
                loop(json.data.result)
                if(!hasCategoryItem){
                    newCategoryUuid = json.data.result[0].jrCategoryUuid
                    newCategoryName = json.data.result[0].jrCategoryCompleteName
                }
                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
                    begin: issuedate ? issuedate : '',
                    end: endissuedate ? endissuedate : '',
                    jrCategoryUuid: newCategoryUuid,
                    jrAbstract: jrAbstract,
                    currentPage: 1,
                    pageSize: Limit.LSMX_LIMIE_LENGTH,
                    needPeriod: '',
                }), result => {
                    if (showMessage(result)) {
                        dispatch({
                            type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,
                            receivedData: result.data,
                            issuedate: issuedateNew,
                            endissuedate: endissuedate,
                            currentCategoryUuid: newCategoryUuid,
                            categoryName: newCategoryName,
                            jrAbstract,
                            currentPage: 1,
                            issues,
                        })
                    }
                    thirdParty.toast.hide()
                })
            }else{
                dispatch({
                    type: ActionTypes.GET_INCOME_EXPEND_MXB_NO_CATEGORY,
                    issuedate: issuedateNew,
                    issues,
                })
            }

        }
    })

}
// 切换账期获取列表
export const getIncomeExpendMxbBalanceList = (issuedate, endissuedate) => (dispatch, getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate ? endissuedate : '',
        jrCategoryUuid: '',
        jrAbstract: '',
        currentPage: 1,
        pageSize: Limit.LSMX_LIMIE_LENGTH,
        needPeriod: 'true',
    }), json => {
        if (showMessage(json)) {
            let  issuedateNew = issuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            issuedateNew = issuedate ? issuedate : openedissuedate
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,
                receivedData: json.data,
                issuedate: issuedateNew,
                endissuedate: endissuedate,
                currentCategoryUuid: '',
                jrAbstract: '',
                currentPage: 1,
                issues,
            })
        }
        thirdParty.toast.hide()
    })
}
export const getIncomeExpendMxbBalanceListPages = (issuedate, endissuedate,currentCategoryUuid = '',jrAbstract = '',currentPage = 1,shouldConcat, isScroll,_self) => (dispatch, getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    !isScroll && thirdParty.toast.loading('加载中...', 0)

    fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate ? endissuedate : '',
        jrCategoryUuid: currentCategoryUuid,
        jrAbstract,
        currentPage,
        pageSize: Limit.LSMX_LIMIE_LENGTH,
        needPeriod: 'true',
    }), json => {
    !isScroll && thirdParty.toast.hide()
        if (showMessage(json)) {
            if(isScroll) {
                _self.setState({
                    isLoading: false
                })
            }
            let  issuedateNew = issuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            issuedateNew = issuedate ? issuedate : openedissuedate
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_PAGE,
                receivedData: json.data,
                issuedate: issuedateNew,
                endissuedate: endissuedate,
                currentCategoryUuid,
                jrAbstract,
                currentPage,
                issues,
                shouldConcat
            })
        }
    })
}
export const getIncomeExpendDetailCategory = (issuedate, endissuedate) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getIncomeExpendMxbCategory', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_MXB_CATEGORY,
                receivedData: json.data.result,
            })
        }
        thirdParty.toast.hide()
    })
}

// export const changeIncomeExpendMxbChooseMorePeriods = (chooseperiods) => ({
//     type: ActionTypes.CHANGE_INCOME_EXPEND_MXB_CHOOSE_MORE_PERIODS,
//     chooseperiods
// })

// export const changeIncomeExpendMxbSearchContent = (value) => ({
//     type: ActionTypes.CHANGE_INCOME_EXPEND_MXB_SEARCH_CONTENT,
//     value
// })

export const changeIncomeExpendMxbCommonState = (parent, position, value) => ({type: ActionTypes.CHANGE_INCOME_EXPEND_MXB_COMMON_STATE, parent, position, value})

export const changeIncomeExpendMxbChooseValue = (value) => ({
      type: ActionTypes.CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE,
      value,
})
