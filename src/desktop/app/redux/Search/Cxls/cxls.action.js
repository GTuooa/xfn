import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
// import fetchGlApi from 'app/constants/fetch.constant.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { formatDate } from 'app/utils'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
// yezi
import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'

export const cxlsDownloadEnclosure = (enclosureUrl, fileName) => dispatch => {
	dispatch(lrAccountActions.lsDownloadEnclosure(enclosureUrl, fileName))
}

export const getPeriodAndBusinessList = (issuedate, waterType = 'allWater', accountUuid = '', curPage = '') => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const listUrl = waterType == 'allWater' ? 'getRunningBusinessList' : 'getRunning'+waterType+'List'
    const cxlsState = getState().cxlsState
    const currentPage = curPage === '' ? 1 : curPage
	fetchApi(listUrl, 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        getPeriod: "true",
        accountUuid,
        currentPage,
        pageSize:Limit.CXLS_LIMIE_LENGTH
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
			// if (json.code === 0 && !json.data.vcList.length) {
			// 	message.info('当前月份无任何凭证')
			// }

			const openedissuedate = json.data.periodDtoJson.openedyear + '年第' + json.data.periodDtoJson.openedmonth + '期'
			const issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_BUSINESS_LIST,
                receivedData: json.data.result.childList,
                receivedExtra: json.data.result,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                getPeriod: "true",
                issues,
                waterType,
                accountUuid,
                currentPage,
                pageCount: json.data.pageCount
            })
        }
	})
  dispatch(accountConfActions.getRunningAccount())


}

export const getBusinessList = (issuedate, waterType, accountUuid, curPage = '',orderBy = '',searchContent='',isAsc = false, isAccount = false) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const listUrl = waterType == 'allWater' ? 'getRunningBusinessList' : 'getRunning'+waterType+'List'

    const aUuid = !isAccount ? '' :
                              accountUuid ? accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
  const cxlsState = getState().cxlsState
const currentPage = curPage === '' ? cxlsState.get('currentPage') : curPage
const searchType = searchContent ? cxlsState.getIn(['flags','searchType']) : ''
	fetchApi(listUrl, 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
    accountUuid:aUuid,
    getPeriod: "true",
    orderBy,
    searchType,
    searchContent,
    isAsc,
    currentPage:currentPage,
    pageSize:Limit.CXLS_LIMIE_LENGTH,
    isAccount
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
          dispatch({
            type: ActionTypes.GET_BUSINESS_LIST,
            receivedData: json.data.result.childList,
            receivedExtra: json.data.result,
            period: json.data.periodDtoJson,
            issuedate,
            issues,
            waterType,
            accountUuid,
            currentPage,
            isAsc,
            orderBy,
            isAccount,
            pageCount: json.data.pageCount,
            getPeriod: "true"
          })
          if (json.data.result.msg) {
              message.info(json.data.result.msg)
          }
        }
	})
}
export const accountItemCheckboxCheckAll = (selectAll, list) => ({
    type: ActionTypes.CXLS_ITEM_CHECKBOX_CHECK_ALL,
    selectAll,
    list
})
export const accountItemCheckboxCheck = (checked, item) => ({
    type: ActionTypes.CXLS_ITEM_CHECKBOX_CHECK,
    checked,
    item
})


export const deleteAccountItemCardAndRunning = (main,inputValue='',deleteItemList) => (dispatch, getState) => {

    const deleteList = deleteItemList || getState().cxlsState.getIn(['flags', 'selectList'])
	const deleteType = main == 'reality' ? 'payment' : 'business'

    const cxlsState = getState().cxlsState
	const issuedate = cxlsState.getIn(['flags', 'issuedate'])
    const mainWater = cxlsState.getIn(['flags','mainWater'])
    const isAsc = cxlsState.getIn(['flags','isAsc'])
    const isAccount = cxlsState.getIn(['flags','isAccount'])
    const curAccountUuid = cxlsState.getIn(['flags','curAccountUuid'])

    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
            if(result.buttonIndex === 1){
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                fetchApi(`deleteRunning${deleteType}`, 'POST', JSON.stringify({
                    deleteList
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
                            dispatch(getBusinessList(issuedate,mainWater,curAccountUuid,'','',inputValue,isAsc,isAccount))
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        }
    })
}

//生成凭证
export const runningInsertVc = (uuidList, routeStr, issuedate,inputValue='',fromYlls,refreshList,item,showDrawer) => (dispatch, getState) => {

	// const cxlsState = getState().cxlsState
	// const issuedate = cxlsState.getIn(['flags', 'issuedate'])
	// const main = cxlsState.getIn(['flags', 'main'])
	// const categoryUuid = cxlsState.getIn(['flags', 'curCategory'])
	// const accountUuid = cxlsState.getIn(['flags', 'curAccountUuid'])
	// const assId = cxlsState.getIn(['flags', 'assId'])
	// const assCategory = cxlsState.getIn(['flags', 'assCategory'])
	// const acId = cxlsState.getIn(['flags', 'acId'])
  const cxlsState = getState().cxlsState
  const currentPage = cxlsState.get('currentPage')
  const waterType = cxlsState.getIn(['flags','mainWater'])
  const curAccountUuid = cxlsState.getIn(['flags','curAccountUuid'])
  const isAsc = cxlsState.getIn(['flags','isAsc'])
  const isAccount = cxlsState.getIn(['flags','isAccount'])
  let pzDealNum = 0
  dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum))
  dispatch(changePzCommonString(['flags','pzDealType'],'insert'))
  const pzSelectAllList = uuidList.sort((x,y)=>{
      return parseInt(x.get('flowNumber')) - parseInt(y.get('flowNumber'))
  })
  const loop = (data) => {
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
      fetchApi(`insertRunning${routeStr}Vc`, 'POST', JSON.stringify({
          uuidList: [data]
      }), json => {
          // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
          if (showMessage(json)) {
              if (json.message) {
                  if(json.data.result.length) {
                      const error = json.data.result.join(',')
                      message.error(error)
                      clearInterval(insertTimer)
                      dispatch(changePzCommonString(['flags','pzDealStatus'],false))
                      dispatch(getBusinessList(issuedate,waterType,curAccountUuid,currentPage,'',inputValue,isAsc,isAccount))
                  }
                  else{
                      // message.success(json.message)
                      pzDealNum += 1
                      dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum))
                      if(pzDealNum < pzSelectAllList.size){
                          clearInterval(insertTimer)
                          loop(pzSelectAllList.getIn([pzDealNum,'uuid']))
                      }else{
                          clearInterval(insertTimer)
                          dispatch(changePzCommonString(['flags','pzDealStatus'],false))
                          dispatch(getBusinessList(issuedate,waterType,curAccountUuid,currentPage,'',inputValue,isAsc,isAccount))
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
              dispatch(getBusinessList(issuedate,waterType,curAccountUuid,currentPage,'',inputValue,isAsc,isAccount))


          }
      })
  }
  if(uuidList && uuidList.size > 1){
      dispatch(changePzCommonString(['flags','pzDealStatus'],true))
      loop(pzSelectAllList.getIn([0,'uuid']))
  }else{
      let newUuidList = uuidList.getIn([0,'uuid'])
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      fetchApi(`insertRunning${routeStr}Vc`, 'POST', JSON.stringify({
          uuidList: [newUuidList]
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
                  refreshList && refreshList() || dispatch(afterModifyAccountAllList())
                  if (fromYlls) {
                      dispatch(yllsActions.getYllsBusinessData(item,showDrawer))
                  }
                  // dispatch(getAccountDimensionFetch(issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId))
              }
          }
      })
  }


	// dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

}

export const changePzCommonString = (name, value) => dispatch => {
    dispatch({
      type: ActionTypes.CHANGE_PZ_COMMON_STRING,
      name,
      value
    })
}

// 为了增删改后页面的刷新
export const afterModifyAccountAllList = (isReflash) => (dispatch, getState) => {

	// 刷新时更新设置的数据
	// if (getPeriod) {
	// 	fetchApi('getRunningSettingInfo', 'GET', '', json => {
	// 		if (showMessage(json)) {
	// 			dispatch({
	// 				type: ActionTypes.GET_ACCOUNTCONF_ALL_SETTINGS,
	// 				receivedData: json.data
	// 			})
	// 		}
	// 	})
	// }
	const cxlsState = getState().cxlsState
	const issuedate = cxlsState.getIn(['flags', 'issuedate'])
  const waterType = cxlsState.getIn(['flags', 'mainWater'])
  const accountUuid = cxlsState.getIn(['flags', 'curAccountUuid'])
  const isAccount = cxlsState.getIn(['flags', 'isAccount'])
  const isAsc = cxlsState.getIn(['flags', 'isAsc'])
  const currentPage = cxlsState.get('currentPage')

  const listUrl = waterType == 'allWater' ? 'getRunningBusinessList' : 'getRunning'+waterType+'List'
  const aUuid = !isAccount ? '' :
  accountUuid ? accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
	// const assCategory = cxlsState.getIn(['flags', 'assCategory'])
	// const acId = cxlsState.getIn(['flags', 'acId'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(listUrl, 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        accountUuid: aUuid,
        getPeriod: "true",
        orderBy:'',
        isAsc,
        currentPage,
        pageSize:Limit.CXLS_LIMIE_LENGTH,
        isAccount
	}),json => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json )) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_BUSINESS_LIST,
                receivedData: json.data.result.childList,
                receivedExtra: json.data.result,
                period: json.data.periodDtoJson,
                issuedate,
                issues,
                isReflash,
                waterType,
                isAccount,
                accountUuid,
                currentPage,
                isAsc,
                pageCount: json.data.pageCount,
                getPeriod: "true"
            })
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
      type: ActionTypes.GET_CXLSCONF_ALL_SETTINGS,
      receivedData: json.data
    })
  }
})
}
export const deleteVcItemFetch = (year, month, vcindexlist, issuedate,inputValue,fromYlls,refreshList,item,showDrawer) => (dispatch, getState) => {
    const cxlsState = getState().cxlsState
    const currentPage = cxlsState.get('currentPage')
    const waterType = cxlsState.getIn(['flags','mainWater'])
    const isAccount = cxlsState.getIn(['flags','isAccount'])
    const isAsc = cxlsState.getIn(['flags','isAsc'])
    const curAccountUuid = cxlsState.getIn(['flags','curAccountUuid'])
    let pzDealNum = 0
    dispatch(changePzCommonString(['flags','pzDealNum'],pzDealNum))
    dispatch(changePzCommonString(['flags','pzDealType'],'delete'))

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
        fetchApi(`deletevc`, 'POST', JSON.stringify({
            year,
            month,
            vcindexlist: [data]
        }), json => {
            // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json,'show')) {
                pzDealNum += 1
                dispatch(changePzCommonString(['flags','pzDealNum'],Math.floor(pzDealNum)))
                if(pzDealNum < vcindexlist.length){
                    clearInterval(deleteTimer)
                    loop(vcindexlist[pzDealNum])
                }else{
                    clearInterval(deleteTimer)
                    dispatch(changePzCommonString(['flags','pzDealStatus'],false))
                    dispatch(getBusinessList(issuedate,waterType,curAccountUuid,currentPage,'',inputValue,isAsc,isAccount))
                }

            }else{
                clearInterval(deleteTimer)
                dispatch(changePzCommonString(['flags','pzDealStatus'],false))
                dispatch(getBusinessList(issuedate,waterType,curAccountUuid,currentPage,'',inputValue,isAsc,isAccount))

            }
        })
    }

    if(vcindexlist && vcindexlist.length > 1){
        dispatch(changePzCommonString(['flags','pzDealStatus'],true))
        loop(vcindexlist[0])
    }else{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('deletevc', 'POST', JSON.stringify({
            year,
            month,
            vcindexlist
        }), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json,'show')){
                const cxlsState = getState().cxlsState
                const currentPage = cxlsState.get('currentPage')
                const waterType = cxlsState.getIn(['flags','mainWater'])
                const curAccountUuid = cxlsState.getIn(['flags','curAccountUuid'])
                const isAsc = cxlsState.getIn(['flags','isAsc'])
                const isAccount = cxlsState.getIn(['flags','isAccount'])
                refreshList && refreshList() || dispatch(afterModifyAccountAllList())
                if (fromYlls) {
                    dispatch(yllsActions.getYllsBusinessData(item,showDrawer))
                }
            }
        })
    }


}
export const  currentPz = (year, month, vcIndexList) =>  ({
    type:ActionTypes.SET_CURRENT_PZ,
    year,
    month,
    vcIndexList
})



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

export const getBusinessPayment = (item, stateType,uuidList) => (dispatch) => {
  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
  const uuid = item.get('uuid')
  fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (showMessage(json)) {
      const result = json.data.result
      let assName
      const assList = result.assList
      if(!assList || !assList.length) {
          const acList = result.acList
          if (acList.length) {
              assName = acList[0].acFullName
          } else {
              assName = ''
          }

      }else {
        assName = assList[0].assId + ' ' + assList[0].assName
      }
      dispatch({
        type: ActionTypes.INIT_PAYMENT_STATE,
        item,
        result,
        assName,
        stateType,
        uuidList,
        fromCxls:true
      })
      dispatch(lrAccountActions.getRunningSettingInfo())
      dispatch(lrAccountActions.accountTotalAmount())
    //   dispatch(homeActions.addTabpane('LrAccount'))
	dispatch(homeActions.addPageTabPane('EditPanes', 'LrAccount', 'LrAccount', '录入流水'))
	dispatch(homeActions.addHomeTabpane('Edit', 'LrAccount', '录入流水'))
    }
  })




}
export const getBusinessManagerModal = (item,callBack,type) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('uuid')
    const beOpened = item.get('beOpened')
    const assType = item.get('assType')
    const lrCalculateState = getState().lrCalculateState
    const usedCard  = lrCalculateState.getIn(['calculateTemp','usedCard'])
    const cardUuid  = lrCalculateState.getIn(['calculateTemp','cardUuid'])
    fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS(json.data.result)))
          dispatch(changeCxAccountCommonOutString(['runningFlowTemp','magenerType'],type))
          dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],fromJS([{uuid,assType}])))
          dispatch(changeCxAccountCommonOutString(['modalTemp','handlingAmount'],json.data.result.notHandleAmount))
          dispatch(changeCxAccountCommonOutString(['modalTemp','runningAbstract'],json.data.result.runningAbstract))
          dispatch(changeCxAccountCommonOutString(['modalTemp','beOpened'],beOpened))
          dispatch(changeCxAccountCommonOutString(['modalTemp','assType'],assType))
          if (beOpened) {
              dispatch(changeCxAccountCommonOutString(['modalTemp','usedCard'],usedCard))
              dispatch(changeCxAccountCommonOutString(['modalTemp','cardUuid'],cardUuid))
              dispatch(getManagerCategoryList(0,assType))
          }
          callBack()
      }
    })
}
export const getBusinessCarryoverModal = (item,callBack,type) => (dispatch) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('uuid')
    fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = json.data.result
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS(json.data.result)))
          dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],fromJS([data.uuid])))
          dispatch(changeCxAccountCommonOutString(['modalTemp','runningState'],data.runningState))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','runningAbstract'],data.runningAbstract))
          dispatch(changeCxAccountCommonOutString(['modalTemp','stockCardList'],data.acBusinessIncome.stockCardList))
          callBack()
      }
    })
}
export const getBusinessJzsyModal = (item,callBack,type) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('uuid')
    fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = json.data.result
          dispatch(changeCxAccountCommonOutString('runningFlowTemp',fromJS(json.data.result)))
          dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],fromJS([data.uuid])))
          dispatch(changeCxAccountCommonOutString(['modalTemp','runningState'],data.runningState))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','runningAbstract'],data.runningAbstract))
          dispatch(changeCxAccountCommonOutString(['modalTemp','amount'],data.amount-data.tax))
          dispatch(changeCxAccountCommonOutString(['modalTemp','businessList'],fromJS({...json.data.result,beSelect:true})))
          if (json.data.result.beProject) {
              const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
              const projectRange = json.data.result.projectRange
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
          callBack()
      }
    })
}
export const calculateGainForJzsy =  () => (dispatch, getState) => {
    const cxlsState = getState().cxlsState
    const modalTemp = cxlsState.get('modalTemp')
    const runningFlowTemp = cxlsState.get('runningFlowTemp')
    const selectAmount = runningFlowTemp.get('amount')-runningFlowTemp.get('tax')
    const depreciationAmount = modalTemp.getIn(['acAssets','depreciationAmount'])?modalTemp.getIn(['acAssets','depreciationAmount']):0
    const originalAssetsAmount = modalTemp.getIn(['acAssets','originalAssetsAmount'])?modalTemp.getIn(['acAssets','originalAssetsAmount']):0
    console.log(depreciationAmount,originalAssetsAmount)
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
    if (originalAssetsAmount || depreciationAmount) {
        dispatch({
          type:ActionTypes.CXLS_CALCULATE_GAIN_OR_LOSS,
          deletePlace,
          place,
          diff
        })
    }
}
export const getBusinessInvioceModal = (item,callBack,type) => (dispatch) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('uuid')
    fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = json.data.result
          const billMakeOutType = {
              'STATE_YYSR_TS':'BILL_MAKE_OUT_TYPE_TS',
              'STATE_YYSR_XS':'BILL_MAKE_OUT_TYPE_XS'
          }[data.runningState]
          dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],fromJS([data.uuid])))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','runningAbstract'],data.runningAbstract))
          dispatch(changeCxAccountCommonOutString(['modalTemp','billMakeOutType'],billMakeOutType))
          callBack()
      }
  })
}
export const getBusinessDefineModal = (item,callBack,type) => (dispatch) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('uuid')
    fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if (showMessage(json)) {
          const data = json.data.result
          const billAuthType = {
              'STATE_YYZC_GJ':'BILL_AUTH_TYPE_CG',
              'STATE_YYZC_TG':'BILL_AUTH_TYPE_TG'
          }[data.runningState] || 'BILL_AUTH_TYPE_CG'
          dispatch(changeCxAccountCommonOutString(['modalTemp','uuidList'],fromJS([data.uuid])))
          dispatch(changeCxAccountCommonOutString(['modalTemp','runningAbstract'],data.runningAbstract))
          dispatch(changeCxAccountCommonOutString(['modalTemp','categoryUuid'],data.categoryUuid))
          dispatch(changeCxAccountCommonOutString(['modalTemp','billAuthType'],billAuthType))
          callBack()
      }
  })
}
export const insertlrAccountManagerModal = (callBack,categoryTypeObj,fromcalCultion) => (dispatch,getState) => {
    const cxlsState = getState().cxlsState
    const runningFlowTemp = cxlsState.get('runningFlowTemp')
    const modalTemp = cxlsState.get('modalTemp')
    const runningDate = modalTemp.get('runningDate')
    const runningAbstract = modalTemp.get('runningAbstract')
    const accountUuid = modalTemp.get('accountUuid')
    const amount = modalTemp.get('handlingAmount')
    const beOpened = modalTemp.get('beOpened')
    const uuidList = modalTemp.get('uuidList').toJS()
    const cardUuid = beOpened ? modalTemp.get('cardUuid') : runningFlowTemp.getIn([categoryTypeObj, 'contactsCardRange','uuid'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertRunningpayment', 'POST', JSON.stringify({
      runningDate,
      runningAbstract,
      accountUuid,
      amount,
      uuidList,
      cardUuid,
      uuid:''
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
          if(showMessage(json)) {
              callBack()
              dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
              if (fromcalCultion === 'fromcalCultion') {
                  dispatch(refreshCalCultion())
              } else {
                  dispatch(afterModifyAccountAllList())
              }

          }
  })
}
export const insertlrAccountCarryoverModal = (callBack,fromcalCultion) => (dispatch,getState) => {
    const cxlsState = getState().cxlsState
    const modalTemp = cxlsState.get('modalTemp')
    const uuidList = modalTemp.get('uuidList')
    const runningState = modalTemp.get('runningState')
    const runningDate = modalTemp.get('runningDate')
    const runningAbstract = modalTemp.get('runningAbstract')
    const stockCardList = modalTemp.get('stockCardList')
    const carryoverAmount = modalTemp.get('carryoverAmount')
    let cardUuidList = []
    stockCardList && stockCardList.map(item => {
        cardUuidList.push({uuid:item.uuid,amount:carryoverAmount})
    })
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertCarryoverItem', 'POST', JSON.stringify({
        uuidList,
        runningState,
        runningDate,
        cardList:cardUuidList,
        runningAbstract
    }), json => {
      if (showMessage(json, 'show')) {
          callBack()
          dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
          if (fromcalCultion === 'fromcalCultion') {
              dispatch(refreshCalCultion())
          } else {
               dispatch(afterModifyAccountAllList())
          }

      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const insertlrAccountJzsyModal = (callBack,fromcalCultion) => (dispatch,getState) => {
    const cxlsState = getState().cxlsState
    const modalTemp = cxlsState.get('modalTemp').toJS()
    // const uuidList = modalTemp.get('uuidList')
    // const runningState = modalTemp.get('runningState')
    // const runningDate = modalTemp.get('runningDate')
    // const runningAbstract = modalTemp.get('runningAbstract')
    // const stockCardList = modalTemp.get('stockCardList')
    // const carryoverAmount = modalTemp.get('carryoverAmount')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertAssetsCleaning', 'POST', JSON.stringify({
        ...modalTemp
    }), json => {
      if (showMessage(json, 'show')) {
          callBack()
          dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
          if (fromcalCultion === 'fromcalCultion') {
              dispatch(refreshCalCultion())
          } else {
               dispatch(afterModifyAccountAllList())
          }

      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const insertlrAccountInvioceModal = (callBack,fromcalCultion) => (dispatch,getState) => {
    const cxlsState = getState().cxlsState
    const modalTemp = cxlsState.get('modalTemp')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertBusinessMakeoutItem', 'POST', JSON.stringify(modalTemp), json => {
      if (showMessage(json, 'show')) {
          callBack()
          dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
          if (fromcalCultion === 'fromcalCultion') {
              dispatch(refreshCalCultion())
          } else {
               dispatch(afterModifyAccountAllList())
          }
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const insertlrAccountInvioceDefineModal = (callBack,fromcalCultion) => (dispatch,getState) => {
    const cxlsState = getState().cxlsState
    const modalTemp = cxlsState.get('modalTemp')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertBusinessAuthItem', 'POST', JSON.stringify(modalTemp), json => {
      if (showMessage(json, 'show')) {
          callBack()
          dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
          if (fromcalCultion === 'fromcalCultion') {
              dispatch(refreshCalCultion())
          } else {
               dispatch(afterModifyAccountAllList())
          }
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const getBusinessBeforeSwitch = (item,uuidList) => dispatch => {
    const uuid = item.get('parentUuid')?item.get('parentUuid'):item.get('uuid')
    const beBusiness = item.get('beBusiness')
    const runningState = item.get('runningState')
    if (!beBusiness && runningState !== 'STATE_ZZ') {
        dispatch(getBusinessPayment(item))
    } else {
        if (runningState === 'STATE_YYSR_JZCB') {
            dispatch(jumpCalculateCxToLr(item, 'modify', 'LB_JZCB'))
        } else if (runningState === 'STATE_FPRZ_CG' || runningState === 'STATE_FPRZ_TG') {
            dispatch(jumpCalculateCxToLr(item, 'modify', 'LB_FPRZ'))
        } else if (runningState === 'STATE_KJFP_XS' || runningState === 'STATE_KJFP_TS') {
            dispatch(jumpCalculateCxToLr(item, 'modify', 'LB_KJFP'))
        } else if (runningState === 'STATE_ZCWJZZS') {
            dispatch(jumpCalculateCxToLr(item, 'modify', 'LB_ZCWJZZS'))
        } else if (runningState === 'STATE_ZZ') {
            dispatch(jumpCalculateCxToLr(item, 'modify', 'LB_ZZ'))
        } else if (runningState === 'STATE_CQZC_ZJTX') {
            dispatch(jumpCalculateCxToLr(item, 'modify', 'LB_ZJTX'))
        } else if (runningState === 'STATE_GGFYFT') {
             dispatch(jumpCommonCharge(item,uuidList))
        }else if (runningState === 'STATE_CQZC_JZSY') {
            dispatch(lrAccountActions.getInitLraccountJzsy(item,uuidList))
        } else {
            dispatch(accountActions.getRunningBusinessDuty('',uuid))
        }
    }
}
// yezi
// 结转成本 查询流水 跳转到 录流水， 修改状态
export const jumpCalculateCxToLr = (item, insertOrModify, paymentType,uuidList) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('parentUuid')?item.get('parentUuid'):item.get('uuid')
    fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
        if (showMessage(json)) {
            fetchApi('getRunningSettingInfo', 'GET', '', settingjson => {
                if (showMessage(json)) {
                    // fetchApi('getRunningSettingInfo', 'GET', '', settingjson => {
                    const setActionType = ({
                        'LB_JZCB': () => 'COST_TRANSFER_FROM_CXLS_JUMP_TO_LRLS',
                        'LB_FPRZ': () => 'INVOICE_AUTH_FROM_CXLS_JUMP_TO_LRLS',
                        'LB_KJFP': () => 'INVOICING_FROM_CXLS_JUMP_TO_LRLS',
                        'LB_ZCWJZZS': () => 'TRANSFER_OUT_FROM_CXLS_JUMP_TO_LRLS',
                        'LB_ZZ': () => 'TRANSFER_OUT_FROM_CXLS_JUMP_TO_NBZZ',
                        'LB_ZJTX': () => 'TRANSFER_OUT_FROM_CXLS_JUMP_TO_ZJTX',
                    }[paymentType])()

                        // if (showMessage(settingjson)) {
                            // accountConfState 修改
                    dispatch({
                        type: ActionTypes.GET_ACCOUNTCONF_ALL_SETTINGS,
                        receivedData: settingjson.data
                    })
                            // lrAccountState 修改 有没有必要不知道
                    dispatch({
                        type: ActionTypes.CALCULATE_FROM_CXLS_JUMP_TO_LRLS,
                        // pageType: 'LB_JZCB',
                        // pageType: 'LB_FPRZ',
                        // pageType: 'LB_KJFP',
                        // pageType: 'LB_ZCWJZZS',
                        pageType: paymentType,
                        rate: settingjson.data.rate,
                        hideCategoryList: settingjson.data.hideCategoryList
                    })
                    // lrCalculateState 修改
                    dispatch({
                        type: ActionTypes.CALCULATE_CHANGE_QUERY
                    })
                    dispatch({
                        // type: ActionTypes.CALCULATE_FROM_CXLS_JUMP_TO_LRLS,
                        type: ActionTypes[setActionType],
                        item,
                        // pageType:paymentType,
                        receivedData: json.data,
                        insertOrModify,
                        fromRefresh: true,
                        rate: settingjson.data.rate,
                        hideCategoryList: settingjson.data.hideCategoryList,
                        uuidList
                    })
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                //   }
                //     }
                        // else {
                        //     dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        // }
                    // })
                    // dispatch(homeActions.addTabpane('LrAccount'))
					dispatch(homeActions.addPageTabPane('EditPanes', 'LrAccount', 'LrAccount', '录入流水'))
					dispatch(homeActions.addHomeTabpane('Edit', 'LrAccount', '录入流水'))
                } else {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            })
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
    type: ActionTypes.CHANGE_CX_ACCOUNT_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}
export const changeCxAccountCommonOutString = (place, value) => (dispatch) => {
    if(typeof place === 'string') {
        dispatch({
          type: ActionTypes.CHANGE_CX_ACCOUNT_COMMON_STRING,
          place,
          value
        })
    } else {
        dispatch({
          type: ActionTypes.CHANGE_CX_ACCOUNT_COMMON_STRING,
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

export const insertManagerModal = (callBack) => (dispatch,getState) => {
    const cxlsState = getState().cxlsState
    const modalTemp = cxlsState.get('modalTemp')
    const runningDate = modalTemp.get('runningDate')
    const runningAbstract = modalTemp.get('runningAbstract')
    const accountUuid = modalTemp.get('accountUuid')
    const cardUuid = modalTemp.get('cardUuid')
    const amount = modalTemp.get('handlingAmount')? Math.abs(modalTemp.get('handlingAmount')) : 0
    const uuidList = modalTemp.get('uuidList').toJS()
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('insertRunningpayment', 'POST', JSON.stringify({
      runningDate,
      runningAbstract,
      accountUuid,
      amount,
      uuidList,
      cardUuid,
      uuid:''
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
          if(showMessage(json)) {
              callBack()
              dispatch(changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate(),uuidList:[]})))
              dispatch(refreshCalCultion())
          }
  })
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
export const jumpCommonCharge = (item,uuidList) => dispatch => {
    const uuid = item.get('uuid')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(json)) {
            dispatch({
                type:ActionTypes.INIT_COMMON_CHARGE_FROM_CXLS,
                data:json.data.result,
                uuidList,
                uuid
            })
        }
        dispatch(lrAccountActions.getRunningSettingInfo())
		dispatch(homeActions.addPageTabPane('EditPanes', 'LrAccount', 'LrAccount', '录入流水'))
		dispatch(homeActions.addHomeTabpane('Edit', 'LrAccount', '录入流水'))

    })
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

                fetchApi(`deleteRunningbusiness`, 'POST', JSON.stringify({
                    deleteList
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
                            // dispatch(getBusinessList(issuedate,mainWater,curAccountUuid,'','',inputValue,isAsc,isAccount))
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }
        }
    })
}
export const getInitLraccountJzsy = (item,uuidList) => dispatch => {
    const uuid = item.get('uuid')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(json)) {
            dispatch({
                type:ActionTypes.INIT_JZSY_FROM_CXLS,
                data:json.data.result,
                uuidList,
                uuid
            })
            if (json.data.result.beProject) {
                dispatch(lrAccountActions.getJzsyProjectCardList(json.data.result.projectRange))
            }
        }
        dispatch(lrAccountActions.getRunningSettingInfo())
		dispatch(homeActions.addPageTabPane('EditPanes', 'LrAccount', 'LrAccount', '录入流水'))
		dispatch(homeActions.addHomeTabpane('Edit', 'LrAccount', '录入流水'))
        dispatch(lrAccountActions.calculateGainForJzsy())


    })
}
