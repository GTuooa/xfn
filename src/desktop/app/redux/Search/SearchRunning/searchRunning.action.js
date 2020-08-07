import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { formatDate } from 'app/utils'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
// yezi
import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'
//附件
import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'

export const getPeriodAndBusinessList = (issuedate, accountUuid = '', curPage = '') => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const searchRunningState = getState().searchRunningState
    const currentPage = curPage === '' ? 1 : curPage
	fetchApi('getSearchRunningList', 'POST',JSON.stringify({
		start: issuedate ? issuedate : '',
		end: issuedate ? issuedate : '',
        getPeriod: "true",
        accountUuid,
        currentPage,
        pageSize: Limit.SEARCH_RUNNING_LINE_LENGTH
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
			// if (json.code === 0 && !json.data.vcList.length) {
			// 	message.info('当前月份无任何凭证')
			// }
            const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
			// const openedissuedate = json.data.periodDtoJson.openedyear + '年第' + json.data.periodDtoJson.openedmonth + '期'
			const issuedateNew = issuedate ? issuedate : openedissuedate

            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''

            dispatch({
                type: ActionTypes.GET_SEARCH_BUSINESS_LIST,
                receivedData: json.data.result.jrList,
                receivedExtra: json.data.result,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                endissuedate: issuedateNew,
                getPeriod: "true",
                issues,
                accountUuid,
                currentPage,
                pageSize: json.data.result.pageSize,
                pageCount: json.data.result.pageCount
            })
            json.data.result.pageSize > 50 ? jrListSum(json.data.result.jrList, json.data.result.pageSize) : ''
        }
	})
  dispatch(accountConfActions.getRunningAccount())


}

// issuedate,endissuedate, accountUuid, curPage = '',pageSize,orderBy,searchContent='',isAsc, isAccount = false
export const getBusinessList = (issuedate, endissuedate, option) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const accountUuid = option.accountUuid
    const curPage = option.curPage ? option.curPage : ''
    let pageSize = option.pageSize
    const orderBy = option.orderBy
    const searchContent = option.searchContent ? option.searchContent : ''
    const isAsc = option.isAsc
    const isAccount = option.isAccount ? option.isAccount : false

    const aUuid = !isAccount ? '' : accountUuid ? accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
    const searchRunningState = getState().searchRunningState
    const currentPage = curPage === '' ? searchRunningState.get('currentPage') : curPage
    //设置默认值
    pageSize = pageSize === '' ? searchRunningState.get('pageSize') : pageSize
    const searchType = searchContent ? searchRunningState.getIn(['flags','searchType']) : ''
    const orderType  = orderBy ? orderBy : searchRunningState.getIn(['flags','orderType'])
    const chooseValue  = searchRunningState.getIn(['flags','chooseValue'])
    const start = issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`
    const end = endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`
    let isAscFlag
    switch (orderType) {
        case 'SEARCH_ORDER_DATE':
            isAscFlag = searchRunningState.getIn([ 'orderByList', 'dateSortType' ])
            break
        case 'SEARCH_ORDER_JR_INDEX':
            isAscFlag = searchRunningState.getIn(['orderByList', 'indexSortType'])
            break
        case 'SEARCH_ORDER_CATEGORY_TYPE':
            isAscFlag = searchRunningState.getIn(['orderByList', 'categorySortType'])
            break
        case 'SEARCH_ORDER_CERTIFICATE':
            isAscFlag = searchRunningState.getIn(['orderByList', 'certificateSortType'])
            break
        case 'SEARCH_ORDER_CREATE_NAME':
            isAscFlag = searchRunningState.getIn(['orderByList', 'nameSortType'])
            break
        default:
    }
    isAscFlag = isAsc === '' ? isAscFlag : isAsc
	fetchApi('getSearchRunningList', 'POST',JSON.stringify({
		start: start ? start: '',
		end: end ? end : start,
        accountUuid:aUuid,
        getPeriod: "true",
        orderBy: orderType,
        searchType,
        searchContent,
        isAsc: isAscFlag,
        currentPage:currentPage,
        // pageSize:Limit.SEARCH_RUNNING_LINE_LENGTH,
        pageSize:pageSize,
        isAccount
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
          dispatch({
            type: ActionTypes.GET_SEARCH_BUSINESS_LIST,
            receivedData: json.data.result.jrList,
            receivedExtra: json.data.result,
            period: json.data.periodDtoJson,
            issuedate,
            endissuedate,
            issues,
            accountUuid,
            currentPage,
            isAsc: isAscFlag,
            orderBy: orderType,
            isAccount,
            pageCount: json.data.result.pageCount,
            pageSize: json.data.result.pageSize,
            getPeriod: "true",
          })
          if (json.data.result.msg) {
              message.info(json.data.result.msg)
          }
          json.data.result.pageSize > 50 ? jrListSum(json.data.result.jrList, json.data.result.pageSize) : ''
        }
	})
}
//计算明细长度
export function jrListSum(jrList, pageSize) {
    let mxListsum = 0
    let mxListLength = 0
    //遍历jrlist  获取总的childlist的长度
    jrList.map( v => {
        mxListsum =  mxListsum + v.childList.length
    })
    //用childlist+jrlist 的长度就是明细表的总长 即所有明细数量
    mxListLength = mxListsum +  jrList.length
    if (mxListLength > 5000) {
        thirdParty.Alert(`本次加载数据量过大，请调整每页显示数据量 (当前:${pageSize}条/页)`)
    }
} 

export const accountItemCheckboxCheckAll = (selectAll, list) => ({
    type: ActionTypes.SEARCH_ITEM_CHECKBOX_CHECK_ALL,
    selectAll,
    list
})
export const accountItemCheckboxCheck = (checked, item) => ({
    type: ActionTypes.SEARCH_ITEM_CHECKBOX_CHECK,
    checked,
    item
})


export const deleteAccountItemCardAndRunning = (main,inputValue='',deleteItemList, action) => (dispatch, getState) => {

    const deleteList = deleteItemList || getState().searchRunningState.getIn(['flags', 'selectList'])

    const searchRunningState = getState().searchRunningState
	const issuedate = searchRunningState.getIn(['flags', 'issuedate'])
	const endissuedate = searchRunningState.getIn(['flags', 'endissuedate'])
    const isAccount = searchRunningState.getIn(['flags','isAccount'])
    const curAccountUuid = searchRunningState.getIn(['flags','curAccountUuid'])
    const orderType = searchRunningState.getIn(['flags','orderType'])



    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if(result.buttonIndex === 1){
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                fetchApi(`deleteRunningItems`, 'POST', JSON.stringify({
                    deleteList,
                    action
                }), json => {
                    if (showMessage(json )) {
                      if (json.message) {
                        if(json.data.errorList.length) {
                            const error = json.data.errorList.join(',')
                            message.error(error)
                        }
                        else{
                            message.success(json.message)
                        }
                    }
                    // 更新 
                    // dispatch(afterModifyAccountAllList())
                            // dispatch(getBusinessList(issuedate,endissuedate,curAccountUuid,'',orderType,inputValue,'',isAccount))
                        dispatch(getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: '', pageSize: '', orderBy: orderType, searchContent: inputValue, isAsc: '', isAccount: isAccount }))
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        }
    })
}

//生成凭证
export const runningInsertOrModifyVc  = (fromPage, uuidList,insertOrDelete, issuedate,inputValue='',fromYlls,item,refreshList) => (dispatch, getState) => {
  const searchRunningState = getState().searchRunningState
  const currentPage = searchRunningState.get('currentPage')
  const pageSize = searchRunningState.get('pageSize')
  const curAccountUuid = searchRunningState.getIn(['flags','curAccountUuid'])
  // const isAsc = searchRunningState.getIn(['flags','isAsc'])
  const isAccount = searchRunningState.getIn(['flags','isAccount'])
  const orderType = searchRunningState.getIn(['flags','orderType'])
  const endissuedate = searchRunningState.getIn(['flags','endissuedate'])
  let pzDealNum = 0
  dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum))
  dispatch(changePzCommonString(['flags','pzDealType'],'insert'))
  const pzSelectAllList = uuidList.sort((x,y)=>{
      return parseInt(x.get('oriDate')) - parseInt(y.get('oriDate'))
  }).sort((x,y) => {
      return parseInt(x.get('jrNumber')) - parseInt(y.get('jrNumber'))
  })

  const fromPageType = {
    'runningPreview': 'QUERY_JR-AUDIT',
    'searchRunning': 'QUERY_JR-AUDIT',
    'searchRunningBatch': 'QUERY_JR-AUDIT-BATCH_AUDIT',
    // 'searchApproval': 'QUERY_JR-AUDIT',
    // 'searchApprovalBatch': 'QUERY_JR-AUDIT-BATCH_AUDIT',
  }

  const loop = (data,index) => {
      let addNum = 0
      const insertTimer = setInterval(()=>{
          if(addNum < 0.9){
              addNum += 0.01
              dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum+addNum))
          }else{
              clearInterval(insertTimer)
              dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum))
          }
      },100)

      fetchApi(`${insertOrDelete}VcList`, 'POST', JSON.stringify({
          uuidList: [data.getIn([index,'oriUuid'])],
          year: data.getIn([index,'currentYear']),
          month: data.getIn([index,'currentMonth']),
          vcindexlist: [data.getIn([index,'jrNumber'])],
          action: fromPageType[fromPage]
      }), json => {
          // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
          if (showMessage(json)) {
              if (json.message) {
                  if(json.data.result.length) {
                      const error = json.data.result.join(',')
                      message.error(error)
                      clearInterval(insertTimer)
                      dispatch(changePzCommonString(['flags','pzDealStatus'],false))
                    //   dispatch(getBusinessList(issuedate,endissuedate,curAccountUuid,currentPage,orderType,inputValue,'',isAccount))
                      dispatch(getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: currentPage, pageSize: pageSize, orderBy: orderType, searchContent: inputValue, isAsc: '', isAccount: isAccount }))
                  }
                  else{
                      // message.success(json.message)
                      pzDealNum += 1
                      dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum))
                      if(pzDealNum < pzSelectAllList.size){
                          clearInterval(insertTimer)
                          loop(pzSelectAllList,pzDealNum)
                      }else{
                          clearInterval(insertTimer)
                          dispatch(changePzCommonString(['flags','pzDealStatus'],false))
                        //   dispatch(getBusinessList(issuedate,endissuedate,curAccountUuid,currentPage,orderType,inputValue,'',isAccount))
                          dispatch(getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: currentPage, pageSize: pageSize, orderBy: orderType, searchContent: inputValue, isAsc: '', isAccount: isAccount }))
                      }
                  }
              }else{
                  clearInterval(insertTimer)
                  dispatch(changePzCommonString(['flags','pzDealStatus'],false))
              }

              // dispatch(getAccountDimensionFetch(issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId))
          }else{
              clearInterval(insertTimer)
              dispatch(changePzCommonString(['flags','pzDealStatus'],false))
            //   dispatch(getBusinessList(issuedate,endissuedate,curAccountUuid,currentPage,orderType,inputValue,'',isAccount))
              dispatch(getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: currentPage, pageSize: pageSize, orderBy: orderType, searchContent: inputValue, isAsc: '', isAccount: isAccount }))


          }
      })
  }
  if(uuidList && uuidList.size > 1){
      dispatch(changePzCommonString(['flags','pzDealStatus'],true))
      loop(pzSelectAllList,0)
  }else{
      let newUuidList = uuidList.getIn([0,'oriUuid'])
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      fetchApi(`${insertOrDelete}VcList`, 'POST', JSON.stringify({
          uuidList: [newUuidList],
          year: uuidList.getIn([0,'currentYear']),
          month: uuidList.getIn([0,'currentMonth']),
          vcindexlist: [uuidList.getIn([0,'jrNumber'])],
          action: fromPageType[fromPage]
      }), json => {
          dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
          if (showMessage(json)) {
              if (json.message) {
                  if(json.data.result.length) {
                      const error = json.data.result.join(',')
                      message.error(error)
                  }
                  else{
                      message.success(json.message)
                  }
                  if (fromYlls) {
                      dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item,() => {
                          refreshList ? refreshList() : dispatch(afterModifyAccountAllList())
                          }))
                  } else {
                      refreshList ? refreshList() : dispatch(afterModifyAccountAllList())
                  }
                  // dispatch(getAccountDimensionFetch(issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId))
              }
          }
      })
  }


	// dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

}

export const deleteVcItemFetch = (fromPage, currentYear, currentMonth, vcindexlist, issuedate,inputValue,fromYlls,item,refreshList,showDrawer) => (dispatch, getState) => {
    const searchRunningState = getState().searchRunningState
    const currentPage = searchRunningState.get('currentPage')
    const pageSize = searchRunningState.get('pageSize')
    const isAccount = searchRunningState.getIn(['flags','isAccount'])
    // const isAsc = searchRunningState.getIn(['flags','isAsc'])
    const curAccountUuid = searchRunningState.getIn(['flags','curAccountUuid'])
    const orderType = searchRunningState.getIn(['flags','orderType'])
    const endissuedate = searchRunningState.getIn(['flags','endissuedate'])
    let pzDealNum = 0
    dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum))
    dispatch(changePzCommonString(['flags','pzDealType'],'delete'))

    const fromPageType = {
        'runningPreview': 'QUERY_JR-CANCEL_AUDIT',
        'searchRunning': 'QUERY_JR-CANCEL_AUDIT',
        'searchRunningBatch': 'QUERY_JR-CANCEL_AUDIT-BATCH_AUDIT'
    }

    // console.log('ddd', fromPageType[fromPage]);

    const loop = (data) => {
        let addNum = 0
        const deleteTimer = setInterval(()=>{
            if(addNum < 0.99){
                addNum += 0.01
                dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum+addNum))
            }else{
                clearInterval(deleteTimer)
                dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum+0.99))
            }
        },100)


        fetchApi(`deleteVcList`, 'POST', JSON.stringify({
            year: currentYear ? currentYear : data.year,
            month: currentMonth ? currentMonth : data.month,
            vcindexlist: [data.vcIndex],
            action: fromPageType[fromPage]
        }), json => {
            // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                pzDealNum += 1
                dispatch(changePzCommonString(['flags','pzDealNum'],Math.floor(pzDealNum)))
                if(pzDealNum < vcindexlist.length){
                    clearInterval(deleteTimer)
                    loop(vcindexlist[pzDealNum])
                }else{
                    clearInterval(deleteTimer)
                    dispatch(changePzCommonString(['flags','pzDealStatus'],false))
                    // dispatch(getBusinessList(issuedate,endissuedate,curAccountUuid,currentPage,orderType,inputValue,'',isAccount))
                    dispatch(getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: currentPage, pageSize: pageSize, orderBy: orderType, searchContent: inputValue, isAsc: '', isAccount: isAccount }))
                }

            }else{
                clearInterval(deleteTimer)
                dispatch(changePzCommonString(['flags','pzDealStatus'],false))
                // dispatch(getBusinessList(issuedate,endissuedate,curAccountUuid,currentPage,orderType,inputValue,'',isAccount))
                dispatch(getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: currentPage, pageSize: pageSize, orderBy: orderType, searchContent: inputValue, isAsc: '', isAccount: isAccount }))

            }
        })
    }

    if(vcindexlist && vcindexlist.length > 1){
        dispatch(changePzCommonString(['flags','pzDealStatus'],true))
        loop(vcindexlist[0])
    }else{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('deleteVcList', 'POST', JSON.stringify({
            year: currentYear ? currentYear : vcindexlist[0]['year'],
            month: currentMonth ? currentMonth : vcindexlist[0]['month'],
            vcindexlist: [vcindexlist[0]['vcIndex']],
            action: fromPageType[fromPage]
        }), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json,'show')){
                const searchRunningState = getState().searchRunningState
                const currentPage = searchRunningState.get('currentPage')
                const curAccountUuid = searchRunningState.getIn(['views','curAccountUuid'])
                // const isAsc = searchRunningState.getIn(['flags','isAsc'])
                const isAccount = searchRunningState.getIn(['flags','isAccount'])
                if (fromYlls) {
                    dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item,() => {
                        refreshList ? refreshList() : dispatch(afterModifyAccountAllList())
                        }))
                } else {
                    refreshList ? refreshList() : dispatch(afterModifyAccountAllList())
                }
            }
        })
    }


}

export const changePzCommonString = (name, value) => dispatch => {
    dispatch({
      type: ActionTypes.SEARCH_CHANGE_PZ_COMMON_STRING,
      name,
      value
    })
}

// 为了增删改后页面的刷新 
// afterModifyAccountAllList改一下参数
export const afterModifyAccountAllList = (isReflash) => (dispatch, getState) => {

	const searchRunningState = getState().searchRunningState
	const issuedate = searchRunningState.getIn(['flags', 'issuedate'])
	const endissuedate = searchRunningState.getIn(['flags', 'endissuedate'])
	const accountUuid = searchRunningState.getIn(['flags', 'curAccountUuid'])
	const isAccount = searchRunningState.getIn(['flags', 'isAccount'])
	// const isAsc = searchRunningState.getIn(['flags', 'isAsc'])
	const currentPage = searchRunningState.get('currentPage')
	const aUuid = !isAccount ? '' : accountUuid ? accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
    const inputValue = searchRunningState.getIn(['flags','inputValue'])
    const pageSize = searchRunningState.get('pageSize')
    const searchType = inputValue ? searchRunningState.getIn(['flags','searchType']) : ''
    const orderType = searchRunningState.getIn(['flags','orderType'])
    const start = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    let isAscFlag
    switch (orderType) {
        case 'SEARCH_ORDER_DATE':
            isAscFlag = searchRunningState.getIn([ 'orderByList', 'dateSortType' ])
            break
        case 'SEARCH_ORDER_JR_INDEX':
            isAscFlag = searchRunningState.getIn(['orderByList', 'indexSortType'])
            break
        case 'SEARCH_ORDER_CATEGORY_TYPE':
            isAscFlag = searchRunningState.getIn(['orderByList', 'categorySortType'])
            break
        case 'SEARCH_ORDER_CERTIFICATE':
            isAscFlag = searchRunningState.getIn(['orderByList', 'certificateSortType'])
            break
        case 'SEARCH_ORDER_CREATE_NAME':
            isAscFlag = searchRunningState.getIn(['orderByList', 'nameSortType'])
            break
        default:
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getSearchRunningList', 'POST',JSON.stringify({
		start: start ? start : '',
		end: end ? end : '',
        accountUuid: aUuid,
        getPeriod: "true",
        orderBy:orderType,
        searchType,
        searchContent: inputValue,
        isAsc: isAscFlag,
        currentPage,
        // pageSize:Limit.CXLS_LIMIE_LENGTH,
        pageSize,
        isAccount
	}),json => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_SEARCH_BUSINESS_LIST,
                receivedData: json.data.result.jrList,
                receivedExtra: json.data.result,
                period: json.data.periodDtoJson,
                issuedate,
                endissuedate,
                issues,
                isReflash,
                isAccount,
                accountUuid,
                currentPage,
                isAsc: isAscFlag,
                orderBy:orderType,
                pageCount: json.data.result.pageCount,
                pageSize: json.data.result.pageSize,
                getPeriod: "true"
            })
            json.data.result.pageSizee > 50 ? jrListSum(json.data.result.jrList, json.data.result.pageSize) : ''
        }
	})
}

// 不需要刷新period
export const getAccountDimensionFetch = (issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId) => dispatch => {
	dispatch(AllGetAccountDimensionFetch(issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId))
}

const AllGetAccountDimensionFetch = (issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId, getPeriod) => dispatch => {
fetchApi('getRunningSettingInfo', 'GET', '', json => {
  if (showMessage(json)) {
    dispatch({
      type: ActionTypes.GET_SEARCH_CONF_ALL_SETTINGS,
      receivedData: json.data
    })
  }
})
}

// export const  currentPz = (year, month, vcIndexList) =>  ({
//     type:ActionTypes.SEARCH_SET_CURRENT_PZ,
//     year,
//     month,
//     vcIndexList
// })



// 单条收款准备
export const beforeRunningPayOrReceive = (payDirection, assList, notHandleAmount, uuidList, runningList) => dispatch => {

	if (notHandleAmount < 0) {
		notHandleAmount = -notHandleAmount
		payDirection = payDirection === '收' ? '付' : '收'
	}

	dispatch({
		type: ActionTypes.BEFORE_RUNNING_PAY_OR_RECEIVE,
		payDirection,
		assList,
		notHandleAmount,
		uuidList,
		runningList
	})
}

export const getBusinessManagerModal = (item,childItem,callBack,type, actionFrom) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    const categoryUuidOut = hideCategoryList.find(v => v.get('categoryType') === 'LB_SFGL').get('uuid')
    const jrJvUuid = childItem.get('jrJvUuid')
    const uuid = item.get('oriUuid')
    const categoryUuid = item.get('categoryUuid')
    const oriDate = item.get('oriDate')
    const beOpened = item.get('beOpened')?true:false
    if (!uuid) {
        dispatch(allActions.sendMessageToDeveloper({
            title: '获取单条流水',
            message: 'oriUuid不存在，function:getBusinessManagerModal',
            remark: '单笔流水核销',
        }))
    }
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const { notHandleAmount, oriState, handleType, oriDate } = json.data.jrOri
          if (notHandleAmount < 0 ) {
              handleType === 'JR_HANDLE_CZ'?
              type = 'credit'
              :
              type = type === 'debit'?'credit':'debit'
              if (oriState === 'STATE_YYWSR') {
                  type = 'credit'
              }
          } else {
              type = type === 'credit' && oriState !== 'STATE_YYZC_TG' && oriState !== 'STATE_YYZC_DJ' && oriState !== 'STATE_FY_DJ' && oriState !== 'STATE_SF_YJZZS'?'credit':'debit'

          }
          const toDay = formatDate().substr(0,10)
          if (oriDate > toDay) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],oriDate))
          }
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS({...json.data.jrOri,...json.data.category})))
          dispatch(changeCxAccountCommonOutString(['runningFlowTemp','magenerType'],type))
          dispatch(changeCxAccountCommonOutString(['runningFlowTemp','actionFrom'], actionFrom))
          dispatch(changeCxAccountCommonOutString(['modalTemp','pendingManageDto'],fromJS({categoryUuid,pendingManageList:[{uuid:jrJvUuid,beOpened,oriDate}]})))
          dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],Math.abs(json.data.jrOri.notHandleAmount)))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriAbstract'],'核销账款'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','beOpened'],beOpened))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],categoryUuidOut))
          // if (beOpened) {
          //     dispatch(changeCxAccountCommonOutString(['modalTemp','usedCard'],usedCard))
          //     dispatch(changeCxAccountCommonOutString(['modalTemp','cardUuid'],cardUuid))
          // }
          callBack()
      }
    })
}
export const getBusinessJzsyModal = (item,childItem,callBack,type) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('oriUuid')
    if (!uuid) {
        dispatch(allActions.sendMessageToDeveloper({
            title: '获取单条流水',
            message: 'oriUuid不存在，function:getBusinessJzsyModal',
            remark: '单笔流水核销',
        }))
    }
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = {...json.data.jrOri,...json.data.category}
          const tax = data.billList.length?data.billList[0].tax:0
          const amount = (data.amount - tax).toFixed(2)
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS(data)))
          dispatch(changeCxAccountCommonOutString(['modalTemp','pendingStrongList'],fromJS([{
              jrJvUuid:childItem.get('jrJvUuid'),
              jrIndex:data.jrIndex,
              oriDate:item.get('oriDate'),
              jrNumber:childItem.get('jrNumber'),
              beSelect:true,
              amount
              }])
          ))
          const toDay = formatDate().substr(0,10)
          if (data.oriDate > toDay) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],data.oriDate))
          }
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriState'],'STATE_CQZC_JZSY'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriAbstract'],'长期资产处置损益'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','assets','cleaningAmount'],amount))
          if (data.beProject) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','usedProject'],true))
              const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
              const projectRange = data.projectRange
              fetchApi('getProjectCardList','POST',JSON.stringify({
                  sobId,
                  categoryList:projectRange,
                  needCommonCard:false
              }), json => {
                  if (showMessage(json)) {
                      dispatch(changeCxAccountCommonOutString(['flags', 'projectList'],fromJS(json.data.result)))
                  }
              })
          }
          dispatch(calculateGainForJzsy())
          callBack()
      }
    })
}
export const getBusinessGrantModal = (item,childItem,callBack,type) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('oriUuid')
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = {...json.data.jrOri,...json.data.category}
          const amount = (item.get('amount') - (item.get('tax') || 0)).toFixed(2)
          const type = data.notHandleAmount < 0 ? 'debit' : 'credit'
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS(data)))
          dispatch(changeCxAccountCommonOutString(['runningFlowTemp','magenerType'],type))
          dispatch(changeCxAccountCommonOutString(['modalTemp','pendingStrongList'],fromJS([{
              jrJvUuid:childItem.get('jrJvUuid'),
              jrIndex:data.jrIndex,
              oriDate:item.get('oriDate'),
              beSelect:true,
              amount
              }])
          ))
          const toDay = formatDate().substr(0,10)
          if (data.oriDate > toDay) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],data.oriDate))
          }
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriState'],'STATE_XC_FF'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriAbstract'],{SX_GZXJ:'发放工资薪金',SX_FLF:`支付${data.categoryName}`,SX_QTXC:`发放${data.categoryName}`}[data.propertyPay]))
          dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],Math.abs(data.notHandleAmount)))
          dispatch(changeCxAccountCommonOutString(['modalTemp','payment','actualAmount'],Math.abs(data.notHandleAmount)))
          callBack()
      }
    })
}

export const getBusinessDefrayModal = (item,childItem,callBack,type) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('oriUuid')
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = {...json.data.jrOri,...json.data.category}
          const categoryType = data.categoryType
          const amount = (item.get('amount') - (item.get('tax') || 0)).toFixed(2)
          const type = data.notHandleAmount < 0 ? 'debit' : 'credit'
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS(data)))
          dispatch(changeCxAccountCommonOutString(['runningFlowTemp','magenerType'],type))
          dispatch(changeCxAccountCommonOutString(['modalTemp','pendingStrongList'],fromJS([{
              jrJvUuid:childItem.get('jrJvUuid'),
              jrIndex:data.jrIndex,
              oriDate:item.get('oriDate'),
              beSelect:true,
              amount,
              notHandleAmount:data.notHandleAmount,
              oriUuid:uuid
              }])
          ))
          const toDay = formatDate().substr(0,10)
          if (data.oriDate > toDay) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],data.oriDate))
          }
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriState'],categoryType === 'LB_SFZC'?'STATE_SF_JN':'STATE_XC_JN'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriAbstract'],`${
              categoryType === 'LB_SFZC'?
              {SX_QYSDS:'缴纳企业所得税',SX_QTSF:`缴纳${data.categoryName}`,SX_ZZS:'缴纳增值税'}[data.propertyTax]
              :`缴纳${{SX_SHBX:'社会保险',SX_ZFGJJ:'住房公积金'}[data.propertyPay]}`
              }`))
          if (categoryType === 'LB_XCZC') {
              dispatch(changeCxAccountCommonOutString(['modalTemp','payment','actualAmount'],Math.abs(data.notHandleAmount)))
              data.propertyPay === 'SX_ZFGJJ'?
              dispatch(changeCxAccountCommonOutString(['modalTemp','payment','companyAccumulationAmount'],Math.abs(data.notHandleAmount)))
              :
              dispatch(changeCxAccountCommonOutString(['modalTemp','payment','companySocialSecurityAmount'],Math.abs(data.notHandleAmount)))
          } else {
              dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],Math.abs(data.notHandleAmount)))
          }
          callBack()
      }
    })
}

export const getBusinessTakeBackModal = (item,childItem,callBack,type) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('oriUuid')
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = {...json.data.jrOri,...json.data.category}
          const amount = (item.get('amount') - (item.get('tax') || 0)).toFixed(2)
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS(data)))
          dispatch(changeCxAccountCommonOutString(['modalTemp','pendingStrongList'],fromJS([{
              jrJvUuid:childItem.get('jrJvUuid'),
              jrIndex:data.jrIndex,
              oriDate:item.get('oriDate'),
              beSelect:true,
              amount
              }])
          ))
          const toDay = formatDate().substr(0,10)
          if (data.oriDate > toDay) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],data.oriDate))
          }
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriState'],'STATE_ZF_SH'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriAbstract'],'暂付款收回'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],data.notHandleAmount))
          callBack()
      }
    })
}

export const getBusinessBackModal = (item,childItem,callBack,type) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('oriUuid')
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = {...json.data.jrOri,...json.data.category}
          const amount = (item.get('amount') - (item.get('tax') || 0)).toFixed(2)
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS(data)))
          dispatch(changeCxAccountCommonOutString(['modalTemp','pendingStrongList'],fromJS([{
              jrJvUuid:childItem.get('jrJvUuid'),
              jrIndex:data.jrIndex,
              oriDate:item.get('oriDate'),
              beSelect:true,
              amount
              }])
          ))
          const toDay = formatDate().substr(0,10)
          if (data.oriDate > toDay) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],data.oriDate))
          }
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriState'],'STATE_ZS_TH'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriAbstract'],'暂收款退还'))
          dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],data.notHandleAmount))
          callBack()
      }
    })
}

export const calculateGainForJzsy =  () => (dispatch, getState) => {
    const searchRunningState = getState().searchRunningState
    const modalTemp = searchRunningState.get('modalTemp')
    const runningFlowTemp = searchRunningState.get('runningFlowTemp')
    const tax = runningFlowTemp.getIn(['billList',0,'tax']) || 0
    const selectAmount = runningFlowTemp.get('amount') - tax
    const depreciationAmount = modalTemp.getIn(['assets','depreciationAmount'])?modalTemp.getIn(['assets','depreciationAmount']):0
    const originalAssetsAmount = modalTemp.getIn(['assets','originalAssetsAmount'])?modalTemp.getIn(['assets','originalAssetsAmount']):0
    const loss = (Number(originalAssetsAmount) - Number(depreciationAmount)).toFixed(2)
    const diff = Math.abs(loss - selectAmount).toFixed(2)
    let place, deletePlace
    if (Number(loss) <= selectAmount ) {
     place =  ['modalTemp', 'netProfitAmount']
     deletePlace = ['modalTemp', 'lossAmount']
    } else {
     place =  ['modalTemp', 'lossAmount']
     deletePlace = ['modalTemp', 'netProfitAmount']
    }
    dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],diff))
    dispatch({
      type:ActionTypes.SEARCH_CALCULATE_GAIN_OR_LOSS,
      deletePlace,
      place,
      diff
    })
}
export const getBusinessInvioceModal = (item,childItem,callBack,type) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('oriUuid')
    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    const categoryItem = hideCategoryList.find(v => {
        v.get('categoryType') === 'LB_KJFP'
    })
    const categoryUuid = categoryItem && categoryItem.get('uuid')
    if (!uuid) {
        dispatch(allActions.sendMessageToDeveloper({
            title: '获取单条流水',
            message: 'oriUuid不存在，function:getBusinessInvioceModal',
            remark: '单笔流水核销',
        }))
    }
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const jrOri = json.data.jrOri
          const fpOriState = jrOri.billList[0].oriState
          const billMakeOutType = {
              'STATE_KJFP_TS':'BILL_MAKE_OUT_TYPE_TS',
              'STATE_KJFP_XS':'BILL_MAKE_OUT_TYPE_XS'
          }[fpOriState]
          const oriAbstract = {
              'STATE_KJFP_TS':'退销开具红字发票',
              'STATE_KJFP_XS':'收入开具发票'
          }[fpOriState]

          const { oriUuid, tax: taxAmount, taxRate, notHandleAmount } = jrOri.billList[0]
          const pendingStrongList = [{
              oriUuid,
              taxAmount,
              taxRate,
              categoryUuid: jrOri.categoryUuid,
              oriState:jrOri.billList[0].oriState,
              oriAmount: jrOri.amount,
              jrJvUuid: childItem.get('jrJvUuid'),
              oriDate: jrOri.oriDate,
          }]
          const toDay = formatDate().substr(0,10)
          if (jrOri.oriDate > toDay) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],jrOri.oriDate))
          }
          // dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],fromJS([jrOri.oriUuid])))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriAbstract'],oriAbstract))
          dispatch(changeCxAccountCommonOutString(['modalTemp','billType'],billMakeOutType))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriState'],fpOriState))
          dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],notHandleAmount))
          dispatch(changeCxAccountCommonOutString(['modalTemp','pendingStrongList'],fromJS(pendingStrongList)))
          callBack()
      }
  })
}
export const getBusinessDefineModal = (item,childItem,callBack,type) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('oriUuid')
    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    const categoryItem = hideCategoryList.find(v => {
        v.get('categoryType') === 'LB_FPRZ'
    })
    const categoryUuid = categoryItem && categoryItem.get('uuid')
    if (!uuid) {
        dispatch(allActions.sendMessageToDeveloper({
            title: '获取单条流水',
            message: 'oriUuid不存在，function:getBusinessDefineModal',
            remark: '单笔流水核销',
        }))
    }
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = json.data.jrOri
          const fyState = data.billList[0].tax > 0 ? 'STATE_FPRZ_CG' : 'BILL_AUTH_TYPE_TG'
          const fyType = data.billList[0].tax > 0 ? 'BILL_AUTH_TYPE_CG' : 'BILL_AUTH_TYPE_TG'
          const fpOriState = data.billList[0].oriState
          const billAuthType = {
              'STATE_FPRZ_CG':'BILL_AUTH_TYPE_CG',
              'STATE_FPRZ_TG':'BILL_AUTH_TYPE_TG',
          }[fpOriState] || 'BILL_AUTH_TYPE_CG'
          const oriAbstract = {
              'STATE_FPRZ_CG':'增值税专用发票认证',
              'STATE_FPRZ_TG':'退购红字发票认证'
          }[fpOriState]
          const { oriUuid, tax: taxAmount, notHandleAmount } = data.billList[0]
          const pendingStrongList = [{
              oriUuid,
              taxAmount,
              taxRate: null,
              categoryUuid: data.categoryUuid,
              oriAmount: null,
              jrJvUuid: childItem.get('jrJvUuid'),
              oriDate: data.oriDate,
          }]
          const toDay = formatDate().substr(0,10)
          if (data.oriDate > toDay) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],data.oriDate))
          }
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriAbstract'],oriAbstract))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','billType'],billAuthType))
          dispatch(changeCxAccountCommonOutString(['modalTemp','oriState'],fpOriState))
          dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],notHandleAmount))
          dispatch(changeCxAccountCommonOutString(['modalTemp','pendingStrongList'],fromJS(pendingStrongList)))
          callBack()
      }
  })
}
export const insertRunningManagerModal = (callBack,categoryTypeObj,fromcalCultion) => (dispatch,getState) => {
    const searchRunningState = getState().searchRunningState
    const runningFlowTemp = searchRunningState.get('runningFlowTemp')
    const modalTemp = searchRunningState.get('modalTemp')
    const oriDate = modalTemp.get('oriDate')
    const oriAbstract = modalTemp.get('oriAbstract')
    const accounts = modalTemp.get('accounts')
    const amount = modalTemp.get('amount')
    const categoryUuid = modalTemp.get('categoryUuid')
    const poundageCurrentCardList = (modalTemp.get('poundageCurrentCardList') || fromJS([])).toJS()
    const poundageProjectCardList = (modalTemp.get('poundageProjectCardList') || fromJS([])).toJS()
    const needUsedPoundage = modalTemp.get('needUsedPoundage')
    const pendingManageDto = modalTemp.get('pendingManageDto').toJS()
    const currentCardList = runningFlowTemp.get('currentCardList').toJS()
    // 附件
    const enclosureList = getState().searchRunningAllState.get('enclosureList')
    if (oriAbstract.length>45) {
        message.info('摘要不得大于45个字')
        return
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    // // 判断是收入，支出，收入退 还是 支出退
    const magenerType = runningFlowTemp.get('magenerType')
    const actionFrom = runningFlowTemp.get('actionFrom')
    let fromPageType = ''
    if (magenerType === 'debit') {
        if (actionFrom === 'shouldReturn') {
            fromPageType = 'QUERY_JR-QUICK_OPERATION-PAYMENT_REFUND'
        } else {
            fromPageType = 'QUERY_JR-QUICK_OPERATION-COLLECTION'
        }
    } else if (magenerType === 'credit') {
        if (actionFrom === 'shouldReturn') {
            fromPageType = 'QUERY_JR-QUICK_OPERATION-INCOME_REFUND'
        } else {
            fromPageType = 'QUERY_JR-QUICK_OPERATION-PAYMENT'
        }
    }

    fetchApi('insertPaymentManage', 'POST', JSON.stringify({
        oriDate,
        oriAbstract,
        accounts,
        amount,
        pendingManageDto,
        categoryUuid,
        currentCardList,
        moedAmount:'',
        poundageCurrentCardList,
        poundageProjectCardList,
        needUsedPoundage,
        enclosureList,
        action: fromPageType
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if(showMessage(json,'show')) {
                callBack()
                dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({oriDate:formatDate().substr(0,10)})))
                dispatch(searchRunningAllActions.clearEnclosureList())
                if (fromcalCultion === 'fromcalCultion') {
                    dispatch(refreshCalCultion())
                } else {
                    dispatch(afterModifyAccountAllList())
                }
          }
  })
}

export const insertCommonModal = (callBack,categoryTypeObj,fromcalCultion,url) => (dispatch,getState) => {
    const searchRunningState = getState().searchRunningState
    const runningFlowTemp = searchRunningState.get('runningFlowTemp')
    const modalTemp = searchRunningState.get('modalTemp').toJS()
    const enclosureList = getState().searchRunningAllState.get('enclosureList')
    if (modalTemp.oriAbstract.length>45) {
        message.info('摘要不得大于45个字')
        return
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(url, 'POST', JSON.stringify({
        ...modalTemp,
        enclosureList
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if(showMessage(json,'show')) {
                callBack()
                dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({oriDate:formatDate().substr(0,10)})))
                dispatch(searchRunningAllActions.clearEnclosureList())
                if (fromcalCultion === 'fromcalCultion') {
                    dispatch(refreshCalCultion())
                } else {
                    dispatch(afterModifyAccountAllList())
                }
          }
  })
}

export const insertlrAccountCarryoverModal = (callBack,fromcalCultion) => (dispatch,getState) => {
    const searchRunningState = getState().searchRunningState
    const modalTemp = searchRunningState.get('modalTemp')
    const uuidList = modalTemp.get('uuidList')
    const runningState = modalTemp.get('runningState')
    const oriDate = modalTemp.get('oriDate')
    const oriAbstract = modalTemp.get('oriAbstract')
    const stockCardList = modalTemp.get('stockCardList')
    const carryoverAmount = modalTemp.get('carryoverAmount')
    const enclosureList = getState().searchRunningAllState.get('enclosureList')
    if (oriAbstract.length>45) {
        message.info('摘要不得大于45个字')
        return
    }
    let cardUuidList = []
    stockCardList && stockCardList.map(item => {
        cardUuidList.push({uuid:item.uuid,amount:carryoverAmount})
    })
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertCarryoverItem', 'POST', JSON.stringify({
        uuidList,
        runningState,
        oriDate,
        cardList:cardUuidList,
        oriAbstract,
        enclosureList
    }), json => {
      if (showMessage(json, 'show')) {
          callBack()
          dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({oriDate:formatDate()})))
          if (fromcalCultion === 'fromcalCultion') {
              dispatch(refreshCalCultion())
          } else {
               dispatch(afterModifyAccountAllList())
          }

      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const insertlrAccountJzsyModal = (callBack, fromcalCultion) => (dispatch,getState) => {
    const searchRunningState = getState().searchRunningState
    const modalTemp = searchRunningState.get('modalTemp').toJS()
    // const uuidList = modalTemp.get('uuidList')
    // const runningState = modalTemp.get('runningState')
    // const oriDate = modalTemp.get('oriDate')
    // const oriAbstract = modalTemp.get('oriAbstract')
    // const stockCardList = modalTemp.get('stockCardList')
    // const carryoverAmount = modalTemp.get('carryoverAmount')
    const enclosureList = getState().searchRunningAllState.get('enclosureList')
    if (modalTemp.oriAbstract.length>45) {
        message.info('摘要不得大于45个字')
        return
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    // const pageFromType = {
    //     'runningPreview': '',
    //     'searchRunning': 'QUERY_JR-QUICK_OPERATION-DISPOSAL_PROFIT_LOSS',
    //     'searchApproval': 'QUERY_PROCESS-QUICK_MANAGER-DISPOSAL_PROFIT_LOSS',
    // }

    fetchApi('insertCarryover', 'POST', JSON.stringify({
        ...modalTemp,
        enclosureList,
        action: 'QUERY_JR-QUICK_OPERATION-DISPOSAL_PROFIT_LOSS'
    }), json => {
      if (showMessage(json, 'show')) {
          callBack()
          dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({oriDate:formatDate()})))
          dispatch(searchRunningAllActions.clearEnclosureList())
          if (fromcalCultion === 'fromcalCultion') {
              dispatch(refreshCalCultion())
          } else {
               dispatch(afterModifyAccountAllList())
          }

      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const insertRunningInvioceModal = (callBack,fromcalCultion,) => (dispatch,getState) => {
    const searchRunningState = getState().searchRunningState
    const modalTemp = searchRunningState.get('modalTemp').toJS()
    const enclosureList = getState().searchRunningAllState.get('enclosureList')
    if (modalTemp.oriAbstract.length>45) {
        message.info('摘要不得大于45个字')
        return
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertInvoice', 'POST', JSON.stringify({
        ...modalTemp,
        enclosureList,
        action: 'QUERY_JR-QUICK_OPERATION-INVOICE'
        }), json => {
      if (showMessage(json, 'show')) {
          callBack()
          dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({oriDate:formatDate()})))
          dispatch(searchRunningAllActions.clearEnclosureList())
          if (fromcalCultion === 'fromcalCultion') {
              dispatch(refreshCalCultion())
          } else {
               dispatch(afterModifyAccountAllList())
          }
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const insertRunningInvioceDefineModal = (callBack,fromcalCultion) => (dispatch,getState) => {
    const searchRunningState = getState().searchRunningState
    const modalTemp = searchRunningState.get('modalTemp').toJS()
    const enclosureList = getState().searchRunningAllState.get('enclosureList')
    if (modalTemp.oriAbstract.length>45) {
        message.info('摘要不得大于45个字')
        return
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertInvoice', 'POST', JSON.stringify({
        ...modalTemp,
        enclosureList,
        action: 'QUERY_JR-QUICK_OPERATION-INVOICE'
        }), json => {
      if (showMessage(json, 'show')) {
          callBack()
          dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({oriDate:formatDate()})))
          dispatch(searchRunningAllActions.clearEnclosureList())
          if (fromcalCultion === 'fromcalCultion') {
              dispatch(refreshCalCultion())
          } else {
              dispatch(afterModifyAccountAllList())
          }
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const getBusinessBeforeSwitch = (item,index,switchUuidList) => dispatch => {
    dispatch(getSearchRunningItem(switchUuidList.get(index), 'modify', switchUuidList,'edit',index))

}
// 核算管理 查询流水 跳转到 录入流水， 修改状态
export const getSearchRunningItem = (item, insertOrModify,uuidList,page='search',index,disabledChange) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('oriUuid')
    if (!uuid) {
        dispatch(allActions.sendMessageToDeveloper({
            title: '获取单条流水',
            message: `oriUuid不存在，function:getSearchRunningItem,状态：${insertOrModify}，item：${item},page:${page},uuidList:${uuidList},index:${index}`,
            remark: '核算管理 查询流水 跳转到 录入流水',
        }))
    }
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
        if (showMessage(json)) {
            const { oriState, jrState, oriDate, relationCategoryUuid }= json.data.jrOri
            const paymentType = oriState === 'STATE_CQZC_ZJTX' ? 'LB_ZJTX' :
                                oriState === 'STATE_CQZC_JZSY' ? 'LB_JZSY' :
                                json.data.category.categoryType
            const isLR = paymentType === 'LB_KJFP' ||
            paymentType === 'LB_ZCWJZZS' ||
            paymentType === 'LB_ZZ' ||
            paymentType === 'LB_FPRZ' ||
            paymentType === 'LB_JZCB' ||
            paymentType === 'LB_SFGL' ||
            paymentType === 'LB_GGFYFT' ||
            paymentType === 'LB_ZJTX' ||
            paymentType === 'LB_JZSY' ||
            paymentType === 'LB_CHDB' ||
            paymentType === 'LB_CHYE' ||
            paymentType === 'LB_JXSEZC' ||
            paymentType === 'LB_CHZZ' ||
            paymentType === 'LB_CHTRXM' ||
            paymentType === 'LB_SYJZ' ||
            paymentType === 'LB_XMJZ'
            if (disabledChange) {
                dispatch(configCallbackActions.changeViewString('disabledChange', true))
                !isLR ?
                dispatch(editRunningActions.copyRunning({...json.data.jrOri,...json.data.category,uuid:json.data.jrOri.categoryUuid},true))
                :
                dispatch(editCalculateActions.justNewCalculatebusiness(paymentType,oriState,true))
                json.data.jrOri.oriDate = formatDate()
                json.data.jrOri.beCertificate = false
                json.data.jrOri.currentAmount = ''
                const propertyPay = json.data.category.propertyPay
                if (oriState === 'STATE_XC_DJ' && (propertyPay === 'SX_SHBX' || propertyPay === 'SX_ZFGJJ')) {
                    const amount = json.data.jrOri.amount
                    json.data.jrOri.oriState = 'STATE_XC_JN'
                    json.data.jrOri.payment.companySocialSecurityAmount = ''
                    json.data.jrOri.payment.companyAccumulationAmount = ''
                    json.data.jrOri.payment.actualAmount = amount
                } else if (oriState === 'STATE_XC_JN' && (propertyPay === 'SX_SHBX' || propertyPay === 'SX_ZFGJJ')) {
                    const amount = json.data.jrOri.amount
                    json.data.jrOri.payment.personSocialSecurityAmount = ''
                    json.data.jrOri.payment.personAccumulationAmount = ''
                    json.data.jrOri.payment.companyAccumulationAmount = amount
                    json.data.jrOri.payment.companySocialSecurityAmount = amount
                    json.data.jrOri.payment.actualAmount = amount
                }
                if (propertyPay === 'SX_GZXJ' && oriState === 'STATE_XC_FF' && json.data.category.acPayment.beAccrued) {
                    json.data.jrOri.payment.actualAmount = json.data.jrOri.amount
                }
            }
            // 折旧摊销、结转损益 paymentType = 'LB_CQZC' 结转成本oriState = 'STATE_SSYR_XX'
            if(isLR){
                const setActionType = ({
                    'LB_KJFP': () => 'INVOICING_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_ZCWJZZS': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_ZZ': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_NBZZ',
                    'LB_ZJTX': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_ZJTX',
                    'LB_JZSY': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_JZSY',
                    'LB_FPRZ': () => 'INVOICE_AUTH_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_JZCB': () => 'COST_TRANSFER_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_SFGL': () => 'PAYMANAGE_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_GGFYFT': () => 'COMMONCHARGE_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_CHDB': () => 'INVENTORY_TRANSFER_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_CHYE': () => 'INVENTORY_BALANCE_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_JXSEZC': () => 'TAX_TRANSTER_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_CHZZ': () => 'STOCK_BUILDUP_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_CHTRXM': () => 'STOCK_INTO_PROJECT_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_XMJZ': () => 'PROJECT_CARROVER_FROM_SEARCH_JUMP_TO_LRLS',
                    'LB_SYJZ': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_SYJZ',
                }[paymentType])()
                dispatch({
                    type: ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_EDIT,
                    pageType: paymentType,
                    PageTab: paymentType === 'LB_SFGL' ? 'business' : 'payment',
                    insertOrModify,
                    disabledChange,
                    enclosureList: json.data.jrOri.enclosureList
                })
                dispatch({
                    type: ActionTypes[setActionType],
                    item,
                    receivedData: json.data,
                    insertOrModify,
                    disabledChange,
                    uuidList
                })
                dispatch({
                    type: ActionTypes.CHANGE_ORITEMP_ORIDATE,
                    date:json.data.jrOri.oriDate,
                })
                let stockPriceList = [],stockOtherPrice = [],materialListPrice=[],dbWarehouseUuid=''
                if(oriState === 'LB_CHDB'){
                    json.data.jrOri.warehouseCardList.map(v => {
                        if(v.warehouseStatus === 'WAREHOUSE_STATUS_FROM'){
                            dbWarehouseUuid = v.cardUuid
                        }
                    })
                }
                if(json.data.jrOri.stockCardList && json.data.jrOri.stockCardList.length){
                    json.data.jrOri.stockCardList.map((item,index) => {
                        if(oriState!== 'STATE_CHZZ_ZZD' && !item.childCardList){
                            stockPriceList.push({
                                cardUuid: item.cardUuid,
                                storeUuid: oriState !== 'LB_CHDB' ? item.warehouseCardUuid : dbWarehouseUuid,
                                assistList: item.assistList,
                                batchUuid: item.batchUuid,
                            })
                        }else{
                            item.amount = 0
                            item.childCardList.map((childItem,childIndex) => {
                                childItem.storeUuid = childItem.warehouseCardUuid
                                childItem.parentIndex = index
                                stockPriceList.push(childItem)
                            })
                        }
                    })
                }
                if(json.data.jrOri.stockCardOtherList && json.data.jrOri.stockCardOtherList.length){
                    json.data.jrOri.stockCardOtherList.map((item,index) => {
                        stockOtherPrice.push({
                            cardUuid: item.cardUuid,
                            storeUuid: item.warehouseCardUuid,
                            assistList: item.assistList,
                            batchUuid: item.batchUuid,
                        })

                    })
                }
                if(paymentType === 'LB_JZSY'){
                    dispatch(editCalculateActions.getJzsyProjectCardList(json.data.category.projectRange,'CqzcTemp',true))
                }
                if(paymentType === 'LB_JZCB'){
                    const needCommonCard = true
                    const needIndirect = json.data.jrOri.relationCategoryType === 'LB_FYZC' ? true : false
                    const needMechanical = json.data.jrOri.relationCategoryType === 'LB_FYZC' ? true : false
                    const needAssist = json.data.jrOri.relationCategoryType === 'LB_FYZC' ? true : false
                    const needMake = json.data.jrOri.relationCategoryType === 'LB_FYZC' ? true : false
                    dispatch(editCalculateActions.getJzsyProjectCardList(json.data.jrOri.projectRange,'CostTransferTemp',needCommonCard,'',needIndirect,needMechanical,needAssist,needMake))
                    if(json.data.jrOri.oriState === 'STATE_YYSR_ZJ'){
                        stockPriceList.length && dispatch(innerCalculateActions.getModifyStockPrice(oriDate,stockPriceList,'CostTransfer','stockCardList',''))
                        dispatch(editCalculateActions.getCarryoverCategory(oriDate,oriState,true))
                    }
                }
                if(paymentType === 'LB_ZJTX'){
                    dispatch(editCalculateActions.getProjectCardList(json.data.category.projectRange))
                }
                if(paymentType === 'LB_CHDB'){
                    dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'StockTemp'}))
                    dispatch(editCalculateActions.getStockCardList())
                    dispatch(editCalculateActions.getJrProjectShareType())
                    dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList,'Stock','stockCardList',''))
                }
                if(paymentType === 'LB_CHYE'){
                    dispatch(editCalculateActions.getStockCardList('BalanceTemp'))
                    dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp'}))
                    dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList,'Balance','stockCardList',''))

                }
                if(paymentType === 'LB_CHZZ'){
                    dispatch(editCalculateActions.getStockCardList('StockBuildUpTemp'))
                    dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'StockBuildUpTemp'}))
                    if(oriState === 'STATE_CHZZ_ZZCX'){
                        dispatch(innerCalculateActions.getModifyStockPrice(oriDate,stockPriceList.concat(stockOtherPrice),'StockBuildUp','stockCardList','stock'))
                    }else{
                        stockPriceList.length && dispatch(innerCalculateActions.getModifyStockPrice(oriDate,stockPriceList,'StockBuildUp','stockCardList','Assembly',json.data.jrOri.stockCardList))
                    }
                }
                if (paymentType === 'LB_JXSEZC') {
                    const categoryType = json.data.category.relationCategoryType
                    const propertyCarryover = json.data.category.propertyCarryover
                    const projectRange = json.data.category.projectRange
                    const acBusinessExpense = json.data.category.acBusinessExpense
                    let needCommonCard = false,needIndirect = false,needMechanical = false,needAssist = false,needMake = false
                    if(categoryType === 'LB_YYZC' && propertyCarryover === 'SX_FW' || categoryType === 'LB_FYZC'){
                        needCommonCard = true,needIndirect = true,needMechanical = true,needAssist = true,needMake = true
                    }
                    if(categoryType === 'LB_YYWZC'){
                        needCommonCard = true
                    }
                    dispatch(editCalculateActions.getJzsyProjectCardList(projectRange,'TaxTransferTemp',needCommonCard,'',needIndirect,needMechanical,needAssist,needMake))
                    if(categoryType === 'LB_YYZC' && propertyCarryover === 'SX_HW'){
                        dispatch(editCalculateActions.getStockCategoryList(acBusinessExpense.stockRange))
                        dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'TaxTransferTemp'}))
                    }
                }
                // if(paymentType === 'LB_SFGL'){
                //     const pendingManageList = json.data.jrOri.pendingManageDto.pendingManageList
                //     pendingManageList.forEach((item,index) => {
                //         if(item.beCard) {
                //             dispatch(editCalculateActions.getManagerCategoryList(index,item.uuid))
                //         }
                //     })
                //
                // }
                if(paymentType === 'LB_JZCB' && oriState === 'STATE_YYSR_ZJ'){
                    dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'CostTransferTemp'}))
                    dispatch(editCalculateActions.getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ',relationCategoryUuid))
                }
                if(paymentType === 'LB_GGFYFT'){
                    dispatch(editCalculateActions.getJrProjectShareType())
                    dispatch(editCalculateActions.getChargeProjectCard(oriState))
                }
                if(paymentType === 'LB_CHTRXM'){
                    dispatch(editCalculateActions.getChargeProjectCard('STATE_CHTRXM','StockIntoProjectTemp'))
                    dispatch(editCalculateActions.getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ','','StockIntoProjectTemp'))
                    dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'StockIntoProjectTemp'}))
                    stockPriceList.length && dispatch(innerCalculateActions.getModifyStockPrice(oriDate,stockPriceList,'StockIntoProject','stockCardList',''))
                }
                if(paymentType === 'LB_XMJZ'){
                    dispatch(editCalculateActions.getProjectCarryoverCard({
                        oriDate: json.data.jrOri.oriDate,
                        categoryUuid: '',
                        level: '',
                        justCard: true,
                        needLeft: false
                    }))
                    dispatch(editCalculateActions.getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ','','ProjectCarryoverTemp'))
                    dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'ProjectCarryoverTemp'}))
                    if(json.data.jrOri.oriState === 'STATE_XMJZ_JZRK' || json.data.jrOri.oriState === 'STATE_XMJZ_QRSRCB'){
                        dispatch(editCalculateActions.getProjectCarryoverList(oriDate,json.data.jrOri.projectCardList[0].cardUuid,json.data.jrOri.oriUuid))
                        stockPriceList.length && dispatch(innerCalculateActions.getModifyStockPrice(oriDate,stockPriceList,'ProjectCarryover','stockCardList',''))
                    }
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            }else{
                dispatch(editRunningActions.refreshRunningbusiness(item.get('oriUuid'), (oriState)=>{
                    dispatch(getRunningBusinessDuty(oriState))
                },uuidList,json.data,insertOrModify === 'insert'))
            }
            dispatch(homeActions.addPageTabPane('EditPanes', 'EditRunning', 'EditRunning', '录入流水'))
            dispatch(homeActions.addHomeTabpane('Edit', 'EditRunning', '录入流水'))
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })

}

// 分页
export const changeCurrentPage = (assList, value) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_CURRENT_PAGE_FZHE,
		assList,
		value
	})

}

export const changeCxAccountCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
  if(place[0] === 'flags') {placeArr = place}
  dispatch({
    type: ActionTypes.CHANGE_SEARCH_ACCOUNT_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}
export const changeCxAccountCommonOutString = (place, value) => (dispatch) => {
    if(typeof place === 'string') {
        dispatch({
          type: ActionTypes.CHANGE_SEARCH_ACCOUNT_COMMON_STRING,
          place,
          value
        })
    } else {
        dispatch({
          type: ActionTypes.CHANGE_SEARCH_ACCOUNT_COMMON_STRING,
          placeArr:place,
          value
        })
    }


}
export const setManageMadalInitState = () =>(dispatch,getState) => {
    const calculationState = getState().calculationState
    const manageList = calculationState.getIn(['payManageList','childList'])
    const selectDate  = calculationState.getIn(['flags','selectDate'])
    const selectList  = calculationState.getIn(['flags','selectList'])
    const cardUuid  = calculationState.getIn(['calculateTemp','cardUuid'])
    const usedCard  = calculationState.getIn(['calculateTemp','usedCard'])
    let uuidList  = []
    let totalAmount = 0
    selectList.forEach(v => {
        const item = manageList.find(w => w.get('uuid') === v)
        const direction = item.get('direction')
        const flowType = item.get('flowType')
        const assType = item.get('assType')
        uuidList.push({uuid:v,assType})
        let notHandleAmount = item.get('notHandleAmount')
        const runningState = item.get('runningState')
        if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') { //退销退购 状态下前端取负数
			notHandleAmount = -Math.abs(notHandleAmount)
		}
        if (direction === 'debit') {
          if(flowType === 'FLOW_INADVANCE') {
            totalAmount -= Number(notHandleAmount)
          }else {
            totalAmount += Number(notHandleAmount)
          }
        } else {
          if(flowType === 'FLOW_INADVANCE') {
            totalAmount += Number(notHandleAmount)
          }else {
            totalAmount -= Number(notHandleAmount)
          }
        }

    })
    dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],fromJS(uuidList)))
    dispatch(changeCxAccountCommonOutString(['modalTemp','handlingAmount'],totalAmount))
    dispatch(changeCxAccountCommonOutString(['modalTemp','cardUuid'],cardUuid))
    dispatch(changeCxAccountCommonOutString(['modalTemp','usedCard'],usedCard))
}
export const setCarryoverMadalInitState = () =>(dispatch,getState) => {
    const calculationState = getState().calculationState
    const selectList  = calculationState.getIn(['flags','selectList'])
    const stockUuid  = calculationState.getIn(['calculateTemp','stockUuid'])
    const costTransferType  = calculationState.getIn(['flags','costTransferType'])
    dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],selectList))
    dispatch(changeCxAccountCommonOutString(['modalTemp','runningState'],costTransferType))
    dispatch(changeCxAccountCommonOutString(['modalTemp','cardList'],fromJS([{uuid:stockUuid,amount:''}])))
}
export const setInvioceMadalInitState = () =>(dispatch,getState) => {
    const calculationState = getState().calculationState
    const selectList  = calculationState.getIn(['flags','selectList'])
    const invoicingType  = calculationState.getIn(['flags','invoicingType'])
    dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],selectList))
    dispatch(changeCxAccountCommonOutString(['modalTemp','billMakeOutType'],invoicingType))
}
export const setDefineMadalInitState = () =>(dispatch,getState) => {
    const calculationState = getState().calculationState
    const selectList  = calculationState.getIn(['flags','selectList'])
    const certifiedType  = calculationState.getIn(['flags','certifiedType'])
    dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],selectList))
    dispatch(changeCxAccountCommonOutString(['modalTemp','billAuthType'],certifiedType))
}
export const getManagerCategoryList = (index,assType) => dispatch => {
    fetchApi('getManagerCategoryList','POST',JSON.stringify({
        assType
    }),json => {
        dispatch(changeCxAccountCommonOutString(['flags', 'managerCategoryList',index], fromJS(json.data)))
    })
}
export const changeBeforeAmount = (item,value,index) => (dispatch,getState) => {
    const code = value.split(Limit.TREE_JOIN_STR)[0]
    const categoryName = value.split(Limit.TREE_JOIN_STR)[1]
    const categoryUuid = value.split(Limit.TREE_JOIN_STR)[2]
    const  uuid = item.get('uuid')
    dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList', index], fromJS({beOpened:true, categoryUuid, uuid, categoryName})))

}
const refreshCalCultion = () => (dispatch,getState) => {
    const calculationState = getState().calculationState
    const flags = calculationState.get('flags')
    const cardUuid  = calculationState.getIn(['calculateTemp','cardUuid'])
    const stockUuid  = calculationState.getIn(['calculateTemp','stockUuid'])
    const issuedate = flags.get('issuedate')
    const curCategory = flags.get('curCategory')
    const isCheck = flags.get('isCheck')
    const accountingType = flags.get('accountingType')
    const certificationList = calculationState.get('certificationList')
    const invoicingList = calculationState.get('invoicingList')
    const billAuthType = certificationList.get('billAuthType')
    const billMakeOutType = invoicingList.get('billMakeOutType')
    const runningState = calculationState.getIn(['costTransferList', 'runningState'])
    const enclosureList = getState().searchRunningAllState.get('enclosureList')
    switch(accountingType){
      case 'manages':
         dispatch(calculationActions.getCalculateList(issuedate, accountingType,'',curCategory,cardUuid, isCheck,''))
         break
       case 'invoicing':
         dispatch(calculationActions.getCalculateInvoicingList(issuedate,curCategory,billMakeOutType, ''))
         break
      case 'certification':
        dispatch(calculationActions.getCalculateCertificationList(issuedate,curCategory,billAuthType, ''))
        break
      case 'costTransfer':
        dispatch(calculationActions.getCalculateCarryoverList(issuedate,runningState, '','', stockUuid))
        break
      default:

     }
}
export const deleteSingleFlow = (uuid,callBack) => dispatch => {
    const deleteList = [uuid]
    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if(result.buttonIndex === 1){
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                // fetchApi(`deleteRunningbusiness`, 'POST', JSON.stringify({
                fetchApi(`deleteRunningItems`, 'POST', JSON.stringify({
                    deleteList,
                    action: 'COMMON-DELETE',
                }), json => {
                    if (showMessage(json )) {
                      if (json.message) {
                        if(json.data.errorList.length) {
                            const error = json.data.errorList.join(',')
                            message.error(error)
                        }
                        else{
                            message.success(json.message)
                        }
                    }
                    !json.data.errorList.length && callBack()
                    // 更新
                    // dispatch(afterModifyAccountAllList())
                            // dispatch(getBusinessList(issuedate,curAccountUuid,'','',inputValue,isAsc,isAccount))
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        }
    })
}


// 跳转
export const getRunningBusinessDuty = (oriState) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    dispatch({
        type:ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_EDIT,
        PageTab: 'business',
        pageType: oriState
    })
}

// 整理流水号
export const getgetSearchRunningSortFun = (issuedate,sortModel,inputValue,orderType) => (dispatch,getState) => {
    const year = issuedate.substr(0,4)
    const month = issuedate.substr(4,1) ==='-' ? issuedate.substr(5,2) : issuedate.substr(6,2)
    const searchRunningState = getState().searchRunningState
    const isAccount = searchRunningState.getIn(['flags','isAccount'])
    const curAccountUuid = searchRunningState.getIn(['flags','curAccountUuid'])
    const endissuedate = searchRunningState.getIn(['flags','endissuedate'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getSearchRunningSort', 'POST', JSON.stringify({
        year,
        month,
        sortModel
    }), json => {
        if (showMessage(json, 'show')) {
            // dispatch(getBusinessList(issuedate,endissuedate,curAccountUuid,'',orderType,inputValue,'',isAccount))
            dispatch(getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: '', pageSize: '', orderBy: orderType, searchContent: inputValue, isAsc: '', isAccount: isAccount }))
        }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeSearchRunningChildItemShow = (showChild, uuid) => ({
    type: ActionTypes.SEARCH_RUNNING_TRIANGLE_SWITCH,
    showChild,
    uuid
})
export const changeSearchRunningAllChildItemShow = (allItemShow) => ({
    type: ActionTypes.SEARCH_RUNNING_ALL_TRIANGLE_SWITCH,
    allItemShow
})
export const changeSearchRunningChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_SEARCH_RUNNING_CHOOSE_VALUE,
    chooseValue
})

export const getAccountRunningCate = (uuid) => (dispatch,getState) => {
    fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
        if (showMessage(json)) {
            const accountProjectRange = json.data.result.projectRange
            const accountContactsRange = json.data.result.acCost.contactsRange
            dispatch(changePzCommonString(['flags','accountProjectRange'] ,fromJS(accountProjectRange)))
            dispatch(changePzCommonString(['flags','accountContactsRange'] , fromJS(accountContactsRange)))
        }
    })
}
export const getAccountContactsCardList = (contactsRange) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getContactsCategoryList','POST', JSON.stringify({
            sobId,
            categoryList:contactsRange.toJS(),
            property:'NEEDPAY'
        }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changePzCommonString(['flags','accountContactsRangeList'], fromJS(json.data.result)))
            }
        })
}

export const getAccountProjectCardList = (projectRange) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    fetchApi('getProjectCardList','POST',JSON.stringify({
        sobId,
        categoryList:projectRange,
        needCommonCard:true,
        needAssist:true,
        needMake:true,
        needIndirect:true,
        needMechanical:true,
    }), json => {
        if (showMessage(json)) {
            dispatch(changePzCommonString(['flags','accountProjectList'], fromJS(json.data.result)))
        }
    })
}
