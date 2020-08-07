import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

// 余额表跳转明细表
export const getBusinessDetail = (history,item, begin,end) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const accountMxbState = getState().accountMxbState
    const accountDetailType = accountMxbState.getIn(['views','accountDetailType'])
    const uuid = item.get('uuid')
    const accountNameAndUuid = `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}`

    fetchApi('getAccountReportDetail', 'POST', JSON.stringify({
        begin,
        end,
        typeUuid: '',
        accountUuid: uuid,
        accountType:'',
        accountDetailType,
        needPeriod: "true",
        currentPage: 1,
        pageSize: Limit.ZHMX_LIMIE_LENGTH,
    }), json => {
      thirdParty.toast.hide()
      if (showMessage(json)) {
        dispatch(getDetailsCategoryInfo(begin,end,accountNameAndUuid))
        const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
        dispatch({
          type: ActionTypes.GET_ACCOUNT_DETAIL_LIST,
          receivedData: json.data,
          period: json.data.periodDtoJson,
          issues,
          issuedate: begin,
          endissuedate: end,
          accountUuid: uuid,
          categoryName:'全部',
          accountName:item.get('name'),
          currentPage: 1,
          pageCount: json.data.pages,
          needPeriod: "true",
        })
        history.push('accountmxb')
      }
    })


}
// 获取流水类别树
export const getDetailsCategoryInfo = (begin,end,accountNameAndUuid='',accountType='') => (dispatch) => {
    const accountName = accountNameAndUuid ? accountNameAndUuid=== '全部' ? '全部' : accountNameAndUuid.split(Limit.TREE_JOIN_STR)[1] : '全部'
    const accountUuid = accountNameAndUuid ? accountNameAndUuid=== '全部' ? '' : accountNameAndUuid.split(Limit.TREE_JOIN_STR)[0] : ''
    fetchApi('getAccountReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        accountUuid,
        accountType,
    }), json => {
        if (showMessage(json)) {
            dispatch({
              type: ActionTypes.GET_ACCOUNT_DETAIL_CATEGORY_DETAIL,
              accountCategory: json.data.accountCategory,
              otherCategory: json.data.otherCategory,
              otherType: json.data.otherType,
              accountList:json.data.accountList,
              accountTypeList:json.data.accountTypeList,
              accountName,
              accountUuid
            })
        }
    })
}
// 切换账期 或 切换账户 重新获取列表
export const getAccountMxbBalanceListFromSwitchPeriodOrAccount = (begin,end='',needPeriod='',currentAccoountUuid, currentAccoountName, accountDetailType,accountType) => (dispatch, getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getAccountReportCategory', 'POST', JSON.stringify({
        begin: begin,
        end: end,
        accountUuid: currentAccoountUuid,
        accountType
    }), json => {
        if (showMessage(json)) {
            let hasAccount = false
            let newAccoountName = '全部',newAccoountUuid = ''
            json.data.accountList && json.data.accountList.map(item => {
                if(item.uuid === currentAccoountUuid){
                    hasAccount = true
                    newAccoountName = item.name
                    newAccoountUuid = item.uuid
                }
            })
            dispatch({
              type: ActionTypes.GET_ACCOUNT_DETAIL_CATEGORY_DETAIL,
              accountCategory: json.data.accountCategory,
              otherCategory: json.data.otherCategory,
              otherType: json.data.otherType,
              accountList:json.data.accountList,
              accountTypeList:json.data.accountTypeList,
              accountName: newAccoountName,
              accountUuid: newAccoountUuid,
            })
            const categoryUuid = getState().accountMxbState.getIn(['views', 'categoryUuid'])
            const categoryName = getState().accountMxbState.getIn(['views', 'categoryName'])
            let typeUuid = ''
            let typeName = '全部'
            if (categoryUuid) {
                const currentTree = {
                    'ACCOUNT_CATEGORY': json.data.accountCategory,
                    'OTHER_CATEGORY': json.data.otherCategory,
                    'OTHER_TYPE': json.data.otherType,
                }[accountDetailType]

                let haveChildItem = false
                const loop = item => item.forEach(v => {
                    if (v.uuid === categoryUuid) {
                        haveChildItem = true
                        typeName = v.name
                    }
                    if (v.childList && v.childList.length) {
                        loop(v.childList)
                    }
                })
                loop(currentTree.childList)

                if (haveChildItem) {
                    typeUuid = categoryUuid
                }
            }

            fetchApi('getAccountReportDetail', 'POST', JSON.stringify({
                begin: begin,
                end: end,
                accountUuid: newAccoountUuid,
                accountType,
                accountDetailType, // OTHER_CATEGORY,  OTHER_TYPE
                typeUuid: typeUuid,
                currentPage: 1,
                pageSize: Limit.ZHMX_LIMIE_LENGTH,
                needPeriod,
            }), json => {
                if (showMessage(json)) {
                    const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
                    // dispatch({
                    //     type: ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_ACCOUNT,
                    //     receivedData: json.data,
                    //     issuedate: issuedate,
                    //     endissuedate: endissuedate,
                    //     currentAccoountUuid,
                    //     typeUuid
                    // })
                    dispatch({
                      type: ActionTypes.GET_ACCOUNT_DETAIL_LIST,
                      receivedData: json.data,
                      period: json.data.periodDtoJson,
                      issues,
                      issuedate: begin,
                      endissuedate: end,
                      currentPage: 1,
                      categoryName: typeName,
                      categoryUuid: typeUuid,
                      pageCount: json.data.pages,
                      accountUuid:newAccoountUuid
                    })
                }
                thirdParty.toast.hide()
            })
        } else {
            thirdParty.toast.hide()
        }
    })
}

// 明细表列表
export const getDetailList = (begin,end='',needPeriod='',accountUuid,accountDetailType,typeUuid,currentPage=1,shouldConcat, isScroll,_self) => (dispatch, getState) => {
  !isScroll && thirdParty.toast.loading('加载中...', 0)
  const accountMxbState = getState().accountMxbState
  const accountType = accountMxbState.getIn(['views','accountType'])
  fetchApi('getAccountReportDetail', 'POST', JSON.stringify({
    begin: begin ? begin : '',
    end: end ? end : '',
    needPeriod,
    accountUuid,
    accountType,
    accountDetailType,
    typeUuid,
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
           type: ActionTypes.GET_ACCOUNT_DETAIL_LIST,
           receivedData: json.data,
           period: json.data.periodDtoJson,
           issues,
           issuedate: begin,
           endissuedate: end,
           currentPage,
           categorValue: '',
           pageCount: json.data.pages,
           accountUuid,
           needPeriod,
           shouldConcat
         })
    }
  })
}

export const changeAccountDetailCommonString = (parent, position, value) => (dispatch) => {
    dispatch({type: ActionTypes.CHANGE_ACCOUNT_DETAIL_COMMON_STRING, parent, position, value})
}

export const changeAccountMxbChooseValue = (value) => ({
      type: ActionTypes.CHANGE_ACCOUNT_MXB_CHOOSE_VALUE,
      value,
})
export const changeAccountMxbAccountType = (value) => ({
    type: ActionTypes.CHANGE_ACCOUNT_MXB_ACCOUNT_TYPE,
    value
})
