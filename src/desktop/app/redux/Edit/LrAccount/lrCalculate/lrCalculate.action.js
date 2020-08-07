import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { fromJS, toJS } from 'immutable'

import { showMessage, formatDate } from 'app/utils'
import { message } from 'antd'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

export const initLrCalculate = () => ({type: ActionTypes.INIT_LR_CALCULATE_STATE})

export const changeLrCalculateCommonState = (parent, position, value) => ({type: ActionTypes.CHANGE_LR_CALCULATE_COMMON_STATE, parent, position, value})

export const initLrAccount = (strJudgeType, data, callBackObj,temp) => ({
    type: ActionTypes.INIT_CLR_ACCOUNT,
    strJudgeType,
    receivedData: data,
    callBackObj,
    temp
})
export const changeLrCostTransferCategoryUuidAndName = (valueList) => dispatch => {
    fetchApi('getRunningDetail', 'GET', `uuid=${valueList[0]}`, json => {
        if (showMessage(json)) {
            // const carryoverAc = json.data.result.acBusinessIncome.carryoverAc
            // const stockAc = json.data.result.acBusinessIncome.stockAc
            const acBusinessIncome = json.data.result.acBusinessIncome

            dispatch({type: ActionTypes.CHANGE_LR_COST_TRANSFER_CATEGORY_UUID_AND_NAME, valueList, acBusinessIncome})
        }

    })
}

export const selectLrCalculateItem = (uuid, Tem, stockCardUuid,amount) => ({type: ActionTypes.SELECT_LR_CALCULATE_ITEM, uuid, Tem, stockCardUuid,amount})

export const selectLrCalculateItemAll = (selectAll, Tem, ListName) => ({type: ActionTypes.SELECT_LR_CALCULATE_ITEM_ALL, selectAll, Tem, ListName})

export const changeLrCostTransferRunningAssList = (ass, index) => ({type: ActionTypes.CHANGE_LR_COST_TRANSFER_RUNNING_ASSLIST, ass, index})
export const changeLrCalculateRateAssList = (ass, index) => ({type: ActionTypes.CHANGE_LR_CALCULATE_RATE_ASSLIST, ass, index})
export const changeLrAccountAccountName = (tab, placeUUid, placeName, value) => ({type: ActionTypes.CHANGE_LR_ACCOUNT_ACCOUNT_NAME, tab, placeUUid, placeName, value})

export const getCostTransferList = (runningState, runningDate) => (dispatch,getState) => {
    const lrCalculateState = getState().lrCalculateState
    const stockCardList = lrCalculateState.getIn(['costTransferTemp','stockCardList'])
    let cardUuidList = []
    stockCardList.map((item) => {
        cardUuidList.push(item.get('uuid'))
    })
  if (runningDate) {
    fetchApi('getCarryoverList', 'POST', JSON.stringify({runningState, runningDate, cardUuidList}), json => {
      if (showMessage(json)) {
        dispatch({type: ActionTypes.AFTER_GET_COMMON_LIST, receivedData: json.data, ListName: 'costTransferList', temp: 'costTransferTemp'})
      }
    })
  }
}
export const getInvoiceAuthList = (billAuthType, runningDate, setAss) => (dispatch, getState) => {
  if (runningDate) {
    fetchApi('getBusinessAuthList', 'POST', JSON.stringify({billAuthType, runningDate}), json => {
      if (showMessage(json)) {
        dispatch({type: ActionTypes.AFTER_GET_COMMON_LIST, receivedData: json.data, ListName: 'invoiceAuthList', temp: 'invoiceAuthTemp'})
      }
    })
  }
}
export const getInvoicingList = (billMakeOutType, runningDate) => (dispatch, getState) => {
  if (runningDate) {
    fetchApi('getBusinessMakeoutList', 'POST', JSON.stringify({billMakeOutType, runningDate}), json => {
      if (showMessage(json)) {
        dispatch({type: ActionTypes.AFTER_GET_COMMON_LIST, receivedData: json.data, ListName: 'invoicingList', temp: 'invoicingTemp'})
      }
    })
  }
}
export const getTransferOutList = (runningDate) => (dispatch, getState) => {
  fetchApi('getBusinessTurnoutList', 'POST', JSON.stringify({runningDate}), json => {
    if (showMessage(json)) {
      dispatch({type: ActionTypes.AFTER_GET_TRANSFER_OUT_LIST, receivedData: json.data})
    }
  })
}

const runningDateCheck = (runningDate, list) => {
  return list.every(v => new Date(v.get('runningDate')) <= new Date(runningDate))
}

export const changeLrAccountCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'
    ? [`${tab}Temp`, place]
    : [
      `${tab}Temp`, ...place
    ]
  if (place[0] === 'flags') {
    placeArr = place
  }
  dispatch({type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING, tab, placeArr, value})

}
export const changeCalculateCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'
    ? [`${tab}Temp`, place]
    : [
      `${tab}Temp`, ...place
    ]
  if (place[0] === 'flags') {
    placeArr = place
  }
  dispatch({type: ActionTypes.CHANGE_CALCULATE_COMMON_STRING, tab, placeArr, value})

}
//保存或修改  内部转账

export const insertOrModifyLrInternalTransfer = (saveAndNew) => (dispatch, getState) => {
    const lrAccountState = getState().lrAccountState
    const hideCategoryList = lrAccountState.get('hideCategoryList')
    const categoryUuid = hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZ').get('uuid')

  const lrCalculateState = getState().lrCalculateState
  let InternalTransferTemp = lrCalculateState.get('InternalTransferTemp')
  const oldEnclosureList = InternalTransferTemp.get('enclosureList').toJS()
  const needDeleteUrl = InternalTransferTemp.get('needDeleteUrl').toJS()
  const enclosureList = oldEnclosureList.concat(needDeleteUrl)

  const runningState = InternalTransferTemp.get('runningState')
  InternalTransferTemp = InternalTransferTemp.set('categoryUuid', categoryUuid).set('categoryType', 'LB_ZZ')
  InternalTransferTemp = InternalTransferTemp.set('amount', parseFloat(InternalTransferTemp.get('amount')))
  InternalTransferTemp = InternalTransferTemp.set('enclosureList',fromJS(enclosureList) )
  const insertOrModify = lrCalculateState.getIn(['flags', 'insertOrModify'])

  InternalTransferTemp = InternalTransferTemp.get('uuid') ? InternalTransferTemp : InternalTransferTemp.set('uuid', lrAccountState.getIn(['cardTemp','uuid']))
  InternalTransferTemp = InternalTransferTemp.get('flowNumber') ? InternalTransferTemp : InternalTransferTemp.set('flowNumber', lrAccountState.getIn(['cardTemp','flowNumber']))

    const runningDate = InternalTransferTemp.get('runningDate')
    const runningAbstract = InternalTransferTemp.get('runningAbstract')
    const fromuuid = InternalTransferTemp.get('fromAccountUuid')
    const touuid = InternalTransferTemp.get('toAccountUuid')

    if (!runningDate) {
        return message.info('日期必填')
    }

    if (!categoryUuid) {
        return message.info('流水类别未获取')
    }

    if (!runningAbstract) {
        return message.info('摘要必填')
    } else if (runningAbstract.length > 50) {
        return message.info('摘要长度不能超过50个字符')
    }
    if (!fromuuid) {
        return message.info('转出账户未获取')
    }
    if (!touuid) {
        return message.info('转入账户未获取')
    }
    if(insertOrModify === 'insert') {delete InternalTransferTemp.get('uuid')} //insert时不传uuid
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    if(insertOrModify === 'insert'){
        fetchApi('insertVirement', 'POST', JSON.stringify(InternalTransferTemp), json => {

            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (json.code !== 0) {
                message.info(json.code + ' ' + json.message)
                if (json.message.indexOf('已生成凭证') > -1) {
                    dispatch(lrAccountActions.changeLrAccountCommonString('', [
                        'flags', 'pzFailedButtonShow'
                    ], true))

                }
            } else {
                message.success(json.message)
                if (saveAndNew) { //保存并新增
                    dispatch(initLrAccount('saveAndNew', '', '', 'InternalTransferTemp'))
                } else { //保存
                    dispatch(initLrAccount('afterSave', InternalTransferTemp, json.data,'InternalTransferTemp'))
                }
            }
        })
    }else{
        fetchApi('modifyRunningbusiness', 'POST', JSON.stringify(InternalTransferTemp), json => {

            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (json.code !== 0) {
                message.info(json.code + ' ' + json.message)
                if (json.message.indexOf('已生成凭证') > -1) {
                    dispatch(lrAccountActions.changeLrAccountCommonString('', [
                        'flags', 'pzFailedButtonShow'
                    ], true))

                }
            } else {
                message.success(json.message)
                if (saveAndNew) { //保存并新增
                    dispatch(initLrAccount('saveAndNew','','','InternalTransferTemp'))
                } else { //保存
                    dispatch(initLrAccount('afterSave', InternalTransferTemp, json.data,'InternalTransferTemp'))
                }
            }
        })
    }
}
// 保存或修改  长期资产折旧摊销
export const insertOrModifyLrDepreciation = (saveAndNew) => (dispatch, getState) => {
    const lrAccountState = getState().lrAccountState
    const hideCategoryList = lrAccountState.get('hideCategoryList')

    const lrCalculateState = getState().lrCalculateState
    let DepreciationTemp = lrCalculateState.get('DepreciationTemp')
    const oldEnclosureList = DepreciationTemp.get('enclosureList').toJS()
    const needDeleteUrl = DepreciationTemp.get('needDeleteUrl').toJS()
    const enclosureList = oldEnclosureList.concat(needDeleteUrl)
    const runningState = DepreciationTemp.get('runningState')
    DepreciationTemp = DepreciationTemp.set('categoryType', 'LB_ZJTX')
    DepreciationTemp = DepreciationTemp.set('amount', parseFloat(DepreciationTemp.get('amount')))
    const insertOrModify = lrCalculateState.getIn(['flags', 'insertOrModify'])

    DepreciationTemp = DepreciationTemp.get('uuid') ? DepreciationTemp : DepreciationTemp.set('uuid', lrAccountState.getIn(['cardTemp','uuid']))
    DepreciationTemp = DepreciationTemp.get('flowNumber') ? DepreciationTemp : DepreciationTemp.set('flowNumber', lrAccountState.getIn(['cardTemp','flowNumber']))

    const runningDate = DepreciationTemp.get('runningDate')
    const runningAbstract = DepreciationTemp.get('runningAbstract')
    const categoryUuid = DepreciationTemp.get('categoryUuid')

    if (!runningDate) {
        return message.info('日期必填')
    }

    if (!categoryUuid) {
        return message.info('处理类别未获取')
    }

    if (!runningAbstract) {
        return message.info('摘要必填')
    } else if (runningAbstract.length > 50) {
        return message.info('摘要长度不能超过50个字符')
    }
    if(insertOrModify === 'insert') {delete DepreciationTemp.get('uuid')} //insert时不传uuid
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    if(insertOrModify === 'insert'){
        fetchApi('insertAssets', 'POST', JSON.stringify({
            ...DepreciationTemp.toJS(),
            enclosureList
        }), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if(json.code !== 0) {
                message.info(json.code + ' ' + json.message)
            }else {
                const { businessFlowNumberList } = json.data
                message.success(json.message)
                if (saveAndNew) { //保存并新增
                    dispatch(initLrAccount('saveAndNew','','','DepreciationTemp'))
                    dispatch(getAssetsList('LB_ZJTX'))
                } else { //保存
                    dispatch(initLrAccount('afterSave', DepreciationTemp, json.data,'DepreciationTemp'))
                }
            }
        })
    }else{
        fetchApi('modifyRunningbusiness', 'POST', JSON.stringify({
            ...DepreciationTemp.toJS(),
            enclosureList
        }), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (json.code !== 0) {
                message.info(json.code + ' ' + json.message)
                if (json.message.indexOf('已生成凭证') > -1) {
                    dispatch(lrAccountActions.changeLrAccountCommonString('', [ 'flags', 'pzFailedButtonShow'], true))
                }
            } else {
                message.success(json.message)
                if (saveAndNew) { //保存并新增
                    dispatch(initLrAccount('saveAndNew','','','DepreciationTemp'))
                } else { //保存
                    dispatch(initLrAccount('afterSave', DepreciationTemp, json.data,'DepreciationTemp'))
                }
            }
        })
    }
}
export const initLrBussiness = () => ({
	type: ActionTypes.INIT_LR_ACOUNT_STATE
})
// 保存或修改 成本结转
export const insertOrModifyLrCostTransferPz = (saveAndNew) => (dispatch, getState) => {
  const lrCalculateState = getState().lrCalculateState

  let costTransferTemp = lrCalculateState.get('costTransferTemp')
  const costTransferList = lrCalculateState.get('costTransferList')
  const insertOrModify = lrCalculateState.getIn(['flags', 'insertOrModify'])
  const uuidList = costTransferTemp.get('uuidList')
  const categoryUuid = costTransferTemp.get('categoryUuid')
  const runningState = costTransferTemp.get('runningState')
  const runningDate = costTransferTemp.get('runningDate')
  const runningAbstract = costTransferTemp.get('runningAbstract')
  const carryoverAmount = costTransferTemp.get('carryoverAmount')
  const assList = costTransferTemp.get('assList')
  const categoryName = costTransferTemp.get('categoryName')
  const stockCardList = costTransferTemp.get('stockCardList')
  const stockCardUuidList = costTransferTemp.get('stockCardUuidList')
  const carryoverBusinessUuid = costTransferTemp.get('carryoverBusinessUuid')
  const oldEnclosureList = costTransferTemp.get('enclosureList').toJS()
  const needDeleteUrl = costTransferTemp.get('needDeleteUrl').toJS()
  const enclosureList = oldEnclosureList.concat(needDeleteUrl)
  let cardUuidList = []
   stockCardUuidList && stockCardUuidList.map(item => {
       cardUuidList.push(item.get('uuid'))
   })
  if (!runningDate) {
    return message.info('日期必填')
  } else {
    const isLegal = runningDateCheck(runningDate, costTransferList)
    if (!isLegal) {
      return message.info('日期不能比所选流水的日期前')
    }
  }

  // if (!categoryUuid &&) {
  //   return message.info('流水类别必选')
  // }

  if (!runningAbstract) {
    return message.info('摘要必填')
  } else if (runningAbstract.length > 50) {
    return message.info('摘要长度不能超过50个字符')
  }

  if (assList.some(v => !v.get('assId') && !v.get('assName'))) {
    return message.info('辅助核算未填')
  }

  if (!uuidList.size) {
    return message.info('请勾选要结转的流水')
  }
  let amountCorrect = 'false',stockName = []
  stockCardList && stockCardList.forEach(v => {
      if(!v.get('amount')){
          amountCorrect = 'amountTrue'
          stockName.push(`${v.get('code')} ${v.get('name')}`)
          return false
      }
      if(cardUuidList.indexOf(v.get('uuid')) === -1){
          amountCorrect = 'ListTrue'
          stockName.push(`${v.get('code')} ${v.get('name')}`)
          return false
      }
  })
  if (amountCorrect === 'amountTrue') {
    return message.info(`请填入${stockName}的成本金额`)
  }
  if (amountCorrect === 'ListTrue') {
    return message.info(`请选择${stockName}的待处理流水`)
  }
  // if (!carryoverAmount) {
  //   return message.info('成本金额必填且不能为0')
  // } else {
  //   let totalAmount = 0
  //   costTransferList.forEach(v => {
  //     if (uuidList.indexOf(v.get('uuid')) > -1) {
  //       totalAmount = totalAmount + v.get('amount')
  //     }
  //   })
    //皇马修改
    // if (carryoverAmount > totalAmount) {
    //     return message.info('成本金额不能大于合计金额')
    // }
  // }

  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

  if (insertOrModify === 'insert') {
    fetchApi('insertCarryoverItem', 'POST', JSON.stringify({
        uuidList,
        runningState,
        runningDate,
        cardList:stockCardList,
        runningAbstract,
        enclosureList
    }), json => {
      if (showMessage(json, 'show')) {
        dispatch({type: ActionTypes.AFTER_SUCCESS_INSERT_CARRYOVER_ITEM, saveAndNew, carryoverBusinessUuid: json.data.result})
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
  } else if (insertOrModify === 'modify') {
    fetchApi('modifyCarryoverItem', 'POST', JSON.stringify({
        carryoverBusinessUuid,
        uuidList,
        runningState,
        runningDate,
        cardList:stockCardList,
        runningAbstract,
        enclosureList
    }), json => {
      if (showMessage(json, 'show')) {
        dispatch({type: ActionTypes.AFTER_SUCCESS_INSERT_CARRYOVER_ITEM, saveAndNew, carryoverBusinessUuid: json.data.result})
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
  }
}

// 保存或修改 发票认证
export const insertOrModifyLrInvoiceAuthPz = (saveAndNew) => (dispatch, getState) => {
  const lrAccountState = getState().lrAccountState
  const hideCategoryList = lrAccountState.get('hideCategoryList')
  const categoryUuid = hideCategoryList.find(v => v.get('categoryType') === 'LB_FPRZ').get('uuid')
  const lrCalculateState = getState().lrCalculateState
  let invoiceAuthTemp = lrCalculateState.get('invoiceAuthTemp')
  const oldEnclosureList = invoiceAuthTemp.get('enclosureList').toJS()
  const needDeleteUrl = invoiceAuthTemp.get('needDeleteUrl').toJS()
  const enclosureList = oldEnclosureList.concat(needDeleteUrl)
  invoiceAuthTemp = invoiceAuthTemp.set('enclosureList',fromJS(enclosureList))
  const invoiceAuthList = lrCalculateState.get('invoiceAuthList')
  const insertOrModify = lrCalculateState.getIn(['flags', 'insertOrModify'])
  const uuidList = invoiceAuthTemp.get('uuidList')
  const billAuthType = invoiceAuthTemp.get('billAuthType')
  const runningDate = invoiceAuthTemp.get('runningDate')
  const runningAbstract = invoiceAuthTemp.get('runningAbstract')
  invoiceAuthTemp = invoiceAuthTemp.set('categoryUuid', categoryUuid)

  const rateAcAndAsslist = lrCalculateState.get('rateAcAndAsslist')
  const filterList = [Limit.ACCOUNT_RATE_TYPE_OF_INPUT, Limit.ACCOUNT_RATE_TYPE_OF_CERTIFIED]

  const acList = rateAcAndAsslist.get('acList').filter(v => filterList.indexOf(v.get('type')) > -1)

  const assList = rateAcAndAsslist.get('assList').filter(v => filterList.indexOf(v.get('type')) > -1)

  invoiceAuthTemp = invoiceAuthTemp.set('acList', acList).set('assList', assList)


  if (!runningDate) {
    return message.info('日期必填')
  } else {
    const isLegal = runningDateCheck(runningDate, invoiceAuthList)
    if (!isLegal) {
      return message.info('日期不能比所选流水的日期前')
    }
  }

  if (!categoryUuid) {
    return message.info('流水类别未获取')
  }

  if (!runningAbstract) {
    return message.info('摘要必填')
  } else if (runningAbstract.length > 50) {
    return message.info('摘要长度不能超过50个字符')
  }

  if (!uuidList.size) {
    return message.info('请勾选要认证的流水')
  }

  if (assList.some(v => !v.get('assId') && !v.get('assName'))) {
    return message.info('辅助核算未填')
  }

  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

  if (insertOrModify === 'insert') {
    fetchApi('insertBusinessAuthItem', 'POST', JSON.stringify({
        ...invoiceAuthTemp.toJS()
    }), json => {
      if (showMessage(json, 'show')) {
           saveAndNew && dispatch(getInvoiceAuthList(billAuthType, runningDate))
           dispatch({type: ActionTypes.AFTER_SUCCESS_INSERT_INVOICEAUTH_ITEM, saveAndNew, authBusinessUuid: json.data.result})
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
  } else if (insertOrModify === 'modify') {
    fetchApi('modifyBusinessAuthItem', 'POST', JSON.stringify({
        ...invoiceAuthTemp.toJS()
    }), json => {
      if (showMessage(json, 'show')) {
           saveAndNew && dispatch(getInvoiceAuthList(billAuthType, runningDate))
           dispatch({type: ActionTypes.AFTER_SUCCESS_INSERT_INVOICEAUTH_ITEM, saveAndNew, authBusinessUuid: json.data.result})
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
  }

}
// 保存或修改 开具发票
export const insertOrModifyLrInvoicingPz = (saveAndNew) => (dispatch, getState) => {
  const lrAccountState = getState().lrAccountState
  const hideCategoryList = lrAccountState.get('hideCategoryList')
  const categoryUuid = hideCategoryList.find(v => v.get('categoryType') === 'LB_KJFP').get('uuid')

  const lrCalculateState = getState().lrCalculateState
  let invoicingTemp = lrCalculateState.get('invoicingTemp')
  const oldEnclosureList = invoicingTemp.get('enclosureList').toJS()
  const needDeleteUrl = invoicingTemp.get('needDeleteUrl').toJS()
  const enclosureList = oldEnclosureList.concat(needDeleteUrl)
  invoicingTemp = invoicingTemp.set('enclosureList',fromJS(enclosureList) )
  invoicingTemp = invoicingTemp.set('categoryUuid', categoryUuid)
  const invoicingList = lrCalculateState.get('invoicingList')
  const insertOrModify = lrCalculateState.getIn(['flags', 'insertOrModify'])
  const uuidList = invoicingTemp.get('uuidList')
  const billMakeOutType = invoicingTemp.get('billMakeOutType')
  const runningDate = invoicingTemp.get('runningDate')
  const runningAbstract = invoicingTemp.get('runningAbstract')

  const rateAcAndAsslist = lrCalculateState.get('rateAcAndAsslist')
  const scale = getState().accountConfState.getIn(['taxRateTemp', 'scale'])
  let filterList = []
  if (scale === 'small') {
    filterList = [Limit.ACCOUNT_RATE_TYPE_OF_PAYABLE, Limit.ACCOUNT_RATE_TYPE_OF_NOTBILLING]
  } else if (scale === 'general') {
    filterList = [Limit.ACCOUNT_RATE_TYPE_OF_WAITOUTPUT, Limit.ACCOUNT_RATE_TYPE_OF_OUTPUT]
  }
  const acList = rateAcAndAsslist.get('acList').filter(v => filterList.indexOf(v.get('type')) > -1)
  const assList = rateAcAndAsslist.get('assList').filter(v => filterList.indexOf(v.get('type')) > -1)
  invoicingTemp = invoicingTemp.set('acList', acList).set('assList', assList)


  if (!runningDate) {
    return message.info('日期必填')
  } else {
    const isLegal = runningDateCheck(runningDate, invoicingList)
    if (!isLegal) {
      return message.info('日期不能比所选流水的日期前')
    }
  }

  if (!categoryUuid) {
    return message.info('流水类别未获取')
  }

  if (!runningAbstract) {
    return message.info('摘要必填')
  } else if (runningAbstract.length > 50) {
    return message.info('摘要长度不能超过50个字符')
  }

  if (!uuidList.size) {
    return message.info('请勾选要认证的流水')
  }

  if (assList.some(v => !v.get('assId') && !v.get('assName'))) {
    return message.info('辅助核算未填')
  }

  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

  if (insertOrModify === 'insert') {
    fetchApi('insertBusinessMakeoutItem', 'POST', JSON.stringify({
        ...invoicingTemp.toJS()
    }), json => {
      if (showMessage(json, 'show')) {
          saveAndNew && dispatch(getInvoicingList(billMakeOutType, runningDate))
        dispatch({type: ActionTypes.AFTER_SUCCESS_INSERT_INVOICING_ITEM, saveAndNew, makeOutBusinessUuid: json.data.result})
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
  } else if (insertOrModify === 'modify') {
    fetchApi('modifyBusinessMakeoutItem', 'POST', JSON.stringify({
        ...invoicingTemp.toJS()
    }), json => {
      if (showMessage(json, 'show')) {
          saveAndNew && dispatch(getInvoicingList(billMakeOutType, runningDate))
        dispatch({type: ActionTypes.AFTER_SUCCESS_INSERT_INVOICING_ITEM, saveAndNew, makeOutBusinessUuid: json.data.result})
      }
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
  }
}
// 保存或修改 转出未交
export const insertOrModifyLrTransferOutPz = (saveAndNew) => (dispatch, getState) => {

    const lrAccountState = getState().lrAccountState
    const hideCategoryList = lrAccountState.get('hideCategoryList')
    const categoryUuid = hideCategoryList.find(v => v.get('categoryType') === 'LB_ZCWJZZS').get('uuid')

    const lrCalculateState = getState().lrCalculateState
    let transferOutTemp = lrCalculateState.get('transferOutTemp')
    const oldEnclosureList = transferOutTemp.get('enclosureList').toJS()
    const needDeleteUrl = transferOutTemp.get('needDeleteUrl').toJS()
    const enclosureList = oldEnclosureList.concat(needDeleteUrl)
    transferOutTemp = transferOutTemp.set('enclosureList',fromJS(enclosureList))
    const transferOutObj = lrCalculateState.get('transferOutObj')
    const flowDtoList = transferOutObj.get('flowDtoList')
    const inputAmount = transferOutObj.get('inputAmount')
    const outputAmount = transferOutObj.get('outputAmount')
    const insertOrModify = lrCalculateState.getIn(['flags', 'insertOrModify'])
    const uuidList = flowDtoList.map(v => v.get('uuid'))

    const runningDate = transferOutTemp.get('runningDate')
    const runningAbstract = transferOutTemp.get('runningAbstract')
    transferOutTemp = transferOutTemp.set('categoryUuid', categoryUuid).set('uuidList', uuidList)

    const rateAcAndAsslist = lrCalculateState.get('rateAcAndAsslist')
    const filterList = [Limit.ACCOUNT_RATE_TYPE_OF_TURNOUTUNPAID, Limit.ACCOUNT_RATE_TYPE_OF_UNPAID]

    const acList = rateAcAndAsslist.get('acList').filter(v => filterList.indexOf(v.get('type')) > -1)
    const assList = rateAcAndAsslist.get('assList').filter(v => filterList.indexOf(v.get('type')) > -1)
    transferOutTemp = transferOutTemp.set('acList', acList).set('assList', assList)

    if (!runningDate) {
        return message.info('日期必填')
    } else {
        const isLegal = runningDateCheck(runningDate, flowDtoList)
        if (!isLegal) {
            return message.info('日期不能在流水的日期前')
        }
    }

    if (!categoryUuid) {
        return message.info('流水类别未获取')
    }

    if (!runningAbstract) {
        return message.info('摘要必填')
    } else if (runningAbstract.length > 50) {
        return message.info('摘要长度不能超过50个字符')
    }

    if (!uuidList.size) {
        return message.info('没有要转出的流水')
    }

    if (inputAmount >= outputAmount) {
        return message.info('进项税额大于销项税额，无需转出未交增值税')
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    if (insertOrModify === 'insert') {
        fetchApi('insertBusinessTurnoutItem', 'POST', JSON.stringify({
            ...transferOutTemp.toJS()
        }), json => {
            if (showMessage(json, 'show')) {
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_INSERT_TRANSFER_OUT_ITEM,
                    saveAndNew,
                    turnOutBusinessUuid: json.data.result
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    } else if (insertOrModify === 'modify') {
        fetchApi('modifyBusinessTurnoutItem', 'POST', JSON.stringify({
            ...transferOutTemp.toJS()
        }), json => {
            if (showMessage(json, 'show')) {
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_INSERT_TRANSFER_OUT_ITEM,
                    saveAndNew,
                    turnOutBusinessUuid: json.data.result
                })
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
  }

  export const getCostCategory = (sobId, runningState, runningDate) => dispatch => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      fetchApi('getCostCategory', 'POST', JSON.stringify({
          sobId,
          runningState,
          runningDate
      }), json => {
          dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
          dispatch({
              type: ActionTypes.GET_COST_CATEGORY,
              receivedData: json.data
          })
        }
      })
  }
  export const changeStockList = (stockCardList,index,dealType='add') => (dispatch, getState) => {
      const lrCalculateState = getState().lrCalculateState
      const runningDate = lrCalculateState.getIn(['costTransferTemp','runningDate'])
      const runningState = lrCalculateState.getIn(['costTransferTemp','runningState'])
      let stockCardListJ = stockCardList.toJS()
      if(dealType == 'delete'){
          stockCardListJ.splice(index,1)
          dispatch(changeCalculateCommonString('costTransfer','stockCardList',  fromJS(stockCardListJ)))
          dispatch(getCostTransferList(runningState, runningDate))
      }else{
          stockCardListJ.splice(index+1,0,{amount:'',uuid:''})
          dispatch(changeCalculateCommonString('costTransfer','stockCardList',  fromJS(stockCardListJ)))
      }
  }

  export const getAssetsList = (type) => dispatch => {
      dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      fetchApi('getAssetsList', 'POST', JSON.stringify({
          type,
      }), json => {
          dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_DEAL_TYPE_CATEGORY,
                receivedData: json.data.result
            })
        }
      })
  }
  export const getProjectCardList = (projectRange) => (dispatch,getState) => {
      const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
      fetchApi('getProjectCardList','POST',JSON.stringify({
          sobId,
          categoryList:projectRange,
          needCommonCard:true
      }), json => {
          if (showMessage(json)) {
              dispatch(changeLrCalculateCommonState('flags','projectList',fromJS(json.data.result)))
          }
      })
  }
