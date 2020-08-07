import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import fetchGlApi from 'app/constants/fetch.constant.js'
import { showMessage, formatDate, upfile } from 'app/utils'
import { message, Modal } from 'antd'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
const confirm = Modal.confirm;

import { allDownloadEnclosure } from 'app/redux/Home/All/all.action.js'

export const lsDownloadEnclosure = (enclosureUrl, fileName) => dispatch => {
	dispatch(allDownloadEnclosure(enclosureUrl, fileName))
}

export const initLrAccount = (strJudgeType, data, callBackObj) => (dispatch) => {
    dispatch({
        type: ActionTypes.INIT_LR_ACCOUNT,
        strJudgeType,
        receivedData: data,
        callBackObj
    })
}

export const getRunningSettingInfo = (fromType) => dispatch => {
    fetchApi('getRunningSettingInfo', 'GET', '', json => {
        if (showMessage(json)) {
            const rate = json.data.rate
            dispatch({
                type: ActionTypes.GET_ACCOUNTCONF_ALL_SETTINGS,
                receivedData: json.data,

            })
            dispatch({
                type: ActionTypes.INIT_LR_ACCOUNT_SETTINGS,
                rate,
                hideCategoryList: json.data.hideCategoryList
            })
            dispatch({
                type: ActionTypes.SET_INVOIC_ASSLIST_FROM_SETTINGS,
                rate
            })
        }
    })
}

//选择流水类别
export const selectAccountRunningCategory = (uuid, nameIndex, category, scale, payableRate, outputRate) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if(uuid){
        fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                const name = json.data.result
                dispatch({
                type: ActionTypes.SELECT_ACCOUNT_RUNNING_CATEGORY,
                uuid,
                name,

              })
              const {categoryType, propertyPay, propertyCostList, propertyCost, propertyTax, assetType } = name
              let showManagemented, propertyShow, categoryTypeObj
              let direction = 'debit'
              let isShowAbout = false
              ;({
                  'LB_YYSR': () => {
                      showManagemented = true
                      propertyShow = '营业收入'
                      categoryTypeObj = 'acBusinessIncome'
                  },
                  'LB_YYZC': () => {
                      showManagemented = true
                      propertyShow = '营业支出'
                      categoryTypeObj = 'acBusinessExpense'
                      direction = 'credit'
                  },
                  'LB_YYWSR': () => {
                      showManagemented = true
                      propertyShow = '营业外收入'
                      categoryTypeObj = 'acBusinessOutIncome'
                      isShowAbout = true
                  },
                  'LB_YYWZC': () => {
                      showManagemented = true
                      propertyShow = '营业外支出'
                      categoryTypeObj = 'acBusinessOutExpense'
                      direction = 'credit'
                      isShowAbout = true
                  },
                  'LB_JK': () => {
                      showManagemented = true
                      propertyShow = '借款'
                      categoryTypeObj = 'acLoan'
                  },
                  'LB_TZ': () => {
                      showManagemented = true
                      propertyShow = '投资'
                      categoryTypeObj = 'acInvest'
                  },
                  'LB_ZB': () => {
                      showManagemented = true
                      propertyShow = '资本'
                      categoryTypeObj = 'acCapital'
                  },
                  'LB_CQZC': () => {
                      showManagemented = true
                      propertyShow = '长期资产'
                      categoryTypeObj = 'acAssets',
                      direction = 'debit'
                  },
                  'LB_FYZC': () => {
                      showManagemented = true
                      propertyShow = '费用支出'
                      categoryTypeObj = 'acCost',
                      direction = 'credit'
                  },
                  'LB_ZSKX': () => {
                      showManagemented = false
                      propertyShow = '暂收款项'
                      categoryTypeObj = 'acTemporaryReceipt'
                      isShowAbout = true
                  },
                  'LB_ZFKX': () => {
                      showManagemented = false
                      propertyShow = '暂付款项'
                      categoryTypeObj = 'acTemporaryPay'
                      isShowAbout = true
                  },
                  'LB_XCZC': () => {
                      showManagemented = false
                      propertyShow = '薪酬支出'
                      categoryTypeObj = 'acPayment',
                      direction = 'credit'
                  },
                  'LB_SFZC': () => {
                      showManagemented = false
                      propertyShow = '税费支出'
                      categoryTypeObj = 'acTax',
                      direction = 'credit'
                  }
              }[categoryType] || (() => ''))()
                const beSellOff = name[categoryTypeObj].beSellOff
                const beManagemented = name[categoryTypeObj].beManagemented
                const beAccrued = name[categoryTypeObj].beAccrued
                const beInAdvance = name[categoryTypeObj].beInAdvance
                const beTurnOut = name[categoryTypeObj].beTurnOut
                const beDeposited = name[categoryTypeObj].beDeposited
                const stockRange = name[categoryTypeObj].stockRange
                const contactsRange = name[categoryTypeObj].contactsRange
                const beProject = name.beProject
                const projectRange = name.projectRange
              scale === 'small' ?
                  dispatch(changeLrAccountCommonString('card', 'taxRate', payableRate))
                  :
                  dispatch(changeLrAccountCommonString('card', 'taxRate', outputRate))
              //无收付管理 默认流水状态已付／收款
                if(categoryType ==='LB_YYSR' && !beDeposited && !beSellOff) {
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_YYSR_XS'))
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_YYSR_XS'))
                    dispatch(getFirstStockCardList(stockRange,'STATE_YYSR_XS'))
                    dispatch(getFirstContactsCardList(contactsRange,'STATE_YYSR_XS'))
                } else if(categoryType ==='LB_YYZC' && !beDeposited && !beSellOff) {
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_YYZC_GJ'))
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_YYZC_GJ'))
                    dispatch(getFirstStockCardList(stockRange,'STATE_YYZC_GJ'))
                    dispatch(getFirstContactsCardList(contactsRange,'STATE_YYZC_GJ'))
                } else if(categoryType ==='LB_FYZC'&& !beManagemented) {
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_FY_YF'))
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_FY_YF'))
                } else if(categoryType ==='LB_XCZC' && !beAccrued) {
                    if (propertyPay === 'SX_FLF') {
                        dispatch(changeStateAndAbstract(fromJS(name),'STATE_XC_YF'))
                        dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_XC_YF'))
                    } else if (propertyPay === 'SX_QTXC' || propertyPay === 'SX_GZXJ') {
                        dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_XC_FF'))
                        dispatch(changeStateAndAbstract(fromJS(name),'STATE_XC_FF'))
                    } else {
                        dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_XC_JN'))
                        dispatch(changeStateAndAbstract(fromJS(name),'STATE_XC_JN'))
                    }
                } else if (categoryType ==='LB_SFZC' &&  !beInAdvance && propertyTax === 'SX_ZZS') {
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_SF_JN'))
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_SF_JN'))

                } else if (categoryType ==='LB_SFZC' &&  !beTurnOut && propertyTax === 'SX_GRSF') {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_SF_JN'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_SF_JN'))
                } else if (categoryType ==='LB_SFZC' &&  !beAccrued && (propertyTax === 'SX_QYSDS' || propertyTax === 'SX_QTSF')) {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_SF_JN'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_SF_JN'))
                } else if(categoryType ==='LB_YYWSR' && !beManagemented) {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_YYWSR_YS'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_YYWSR_YS'))
                } else if(categoryType ==='LB_YYWZC' && !beManagemented) {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_YYWZC_YF'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_YYWZC_YF'))
                } else if(categoryType ==='LB_CQZC' && !beManagemented) {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_CQZC_YF'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_CQZC_YF'))
                } else if(categoryType ==='LB_JK' && !beAccrued) {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_JK_YF'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_JK_YF'))
                } else if(categoryType ==='LB_TZ' && !beAccrued) {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_TZ_YS'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_TZ_YS'))
                } else if(categoryType ==='LB_ZSKX') {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_ZS_SQ'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_ZS_SQ'))
                } else if(categoryType ==='LB_ZFKX') {
                    dispatch(changeStateAndAbstract(fromJS(name),'STATE_ZF_FC'))
                    dispatch(changeLrAccountCommonString('card', 'runningState', 'STATE_ZF_FC'))
                } else {
                    dispatch(changeLrAccountCommonString('card', 'runningState', ''))
                }
                if (propertyCostList && propertyCostList.length === 1) {
                    dispatch(changeLrAccountCommonString('card', 'propertyCost', propertyCostList[0]))
                } else {
                    dispatch(changeLrAccountCommonString('card', 'propertyCost', ''))
                }
                    dispatch(changeLrAccountCommonString('card', 'billStates', ''))
                if(scale === 'small' && (direction === 'credit' ||  assetType === 'XZ_GJZC')) {
                    dispatch(changeLrAccountCommonString('card', 'billType', 'bill_other'))
                } else {
                    dispatch(changeLrAccountCommonString('card', 'billType', ''))
                }
                if (beProject) {
                    dispatch(getProjectCardList(projectRange))
                }
                if(name.acBusinessIncome && name.acBusinessIncome.beCarryover) {
                    dispatch(changeLrAccountCommonString('card',['acBusinessIncome','carryoverCardList'], fromJS([{uuid:''}])))
                }
            }
        })
    }else{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    }

}
export const getProjectCardList = (projectRange) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    fetchApi('getProjectCardList','POST',JSON.stringify({
        sobId,
        categoryList:projectRange,
        needCommonCard:true
    }), json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags','projectList'],fromJS(json.data.result)))
        }
    })
}
export const getCostStockList = (runningDate,runningState) => dispatch => {
    fetchApi('getCostStock','POST',JSON.stringify({
        runningDate,
        runningState
    }),json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'costStockList'], fromJS(json.data.result)))
            dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'], fromJS(json.data.result)))
            dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
        }
    })
}

//科目选择
export const selectRunningAcInfo = (acid, acFullName, idPlace, namePlace, assPlace) => ({
	type: ActionTypes.SELECT_RUNNING_AC_INFO,
	acid,
	acFullName,
	idPlace,
	namePlace,
	assPlace
})

//辅助核算选择
export const selectAccountAss = (assId, assName, assCategory, place) => ({
    type: ActionTypes.SELECT_ACCOUNT_ASS,
    assId,
    assName,
    assCategory,
    place
})

export const changeLrAccountCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
  if(place[0] === 'flags') {placeArr = place}
  dispatch({
    type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}

export const changeLrAccountOutString = (place, value) => (dispatch) => {
    if (typeof place === 'string') {
        dispatch({
          type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING,
          place,
          value
        })
    } else {
        dispatch({
          type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING,
          placeArr:place,
          value
        })
    }

}
export const changeIUMangeCardAc = (value,acId,acName,place) => dispatch =>{
    const valueList = value.split(' ');
    dispatch({
		type: ActionTypes.ACCOUNT_CHANGE_IUMANAGE_CARD_AC,
        uuid:valueList[0],
        name:valueList[1],
        acId,
        acName,
        place
	})
}
export const saveCard = (flag,closeModal,showConfirmModal,closeConfirmModal,stockRange) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().lrAccountState.get('inventorySettingCard').toJS()
    const runningState = getState().lrAccountState.getIn(['cardTemp','runningState'])
    const save = () => {
        fetchApi('addInventorySettingCard', 'POST', JSON.stringify({
            psiData:psiData,
            needAutoIncrementCode:flag === 'insert' ? false : true,
            insertFrom:'',
            treeFrom:''
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type:ActionTypes.ACCOUNT_SAVE_INVENTORY_SETTING_CARD,
                    list:json.data.resultList,
                    flag:flag,
                    autoIncrementCode:json.data.autoIncrementCode,
                })
                if(closeModal){
                    closeModal()
                }
                message.info('保存成功')
                dispatch(getFirstStockCardList(stockRange,runningState))
            }
        })
    }
    fetchApi('adjustInventorySettingCardTitleSame', 'POST', JSON.stringify({
        psiData:{
            name:psiData.name,
            uuid:psiData.uuid
        }
    }), json => {
            if (showMessage(json)) {
                if(json.data.repeat){
                    showConfirmModal()
                    confirm({
                       title: '名称重复',
                       content: '卡片类别名称与已有卡片类别名称重复，确定保存吗？',
                       onOk() {
                         save()
                         closeConfirmModal()
                       },
                       onCancel() {
                           closeConfirmModal()
                       }
                    })
                }else{
                    save()
                }
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
//业务收入／成本支出获取预／应付款、预／应收款
export const getRunningAccountInfo = (categoryUuid, runningDate, mediumAssList, acId, fetchType, runningInsertOrModify, uuid) => (dispatch,getState) => {
	let assId1 = '', assCategory1 = '', assId2 = '', assCategory2 = '',acId1 = ''
    runningDate = runningDate.substr(0,10)
	if (mediumAssList.size) {


		assId1 = mediumAssList.getIn(['0', 'assId'])
		assCategory1 = mediumAssList.getIn(['0', 'assCategory'])
		assId2 = mediumAssList.size == 2 ? mediumAssList.getIn(['1', 'assId']) : ''
		assCategory2 = mediumAssList.size == 2 ? mediumAssList.getIn(['1', 'assCategory']) : ''
	}else {
    acId1=acId
  }
  switch (fetchType) {
      case 'other':
          fetchApi('getRunningOtherAccountInfo', 'POST', JSON.stringify({
                categoryUuid: categoryUuid,
                runningDate: runningDate,
                acId: acId1,
                assId1: assId1,
                assCategory1: assCategory1,
                assId2: assId2,
                assCategory2: assCategory2,
                uuid: runningInsertOrModify === 'modify'? uuid : '',
            }) , json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                        receivedData: json.data,
                        wordType:'other'
                    })
                }
            })
          break
      case 'VAT':
          fetchApi('getBusinessVATInfo', 'POST', JSON.stringify({
                categoryUuid: categoryUuid,
                runningDate: runningDate,
                acId: acId1,
                assId1: assId1,
                assCategory1: assCategory1,
                assId2: assId2,
                assCategory2: assCategory2,
                uuid: runningInsertOrModify === 'modify'? uuid : ''
            }) , json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                        receivedData: json.data,
                        wordType:'VAT'
                    })
                }
            })
          break
      case 'dikou':
          fetchApi('getRunningAccountInfo', 'POST', JSON.stringify({
                categoryUuid: categoryUuid,
                runningDate: runningDate,
                cardUuid:acId,
                uuid: runningInsertOrModify === 'modify'? uuid : ''
            }) , json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                        receivedData: json.data.result,
                        wordType:'dikou'
                    })
                }
            })
          break
      case 'accruedXCZC':
          fetchApi('getPaymentTaxInfo', 'POST', JSON.stringify({
                categoryUuid: categoryUuid,
                runningDate: runningDate,
                acId: acId1,
                assId1: assId1,
                assCategory1: assCategory1,
                assId2: assId2,
                assCategory2: assCategory2
            }) , json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                        receivedData: json.data,
                        wordType:'other'
                    })
                }
            })
          break
      case 'accruedZZS':
          fetchApi('getPaymentTaxInfo', 'POST', JSON.stringify({
                categoryUuid: categoryUuid,
                runningDate: runningDate,
                acId: acId1,
                assId1: assId1,
                assCategory1: assCategory1,
                assId2: assId2,
                assCategory2: assCategory2
            }) , json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                        receivedData: json.data.result,
                        wordType:'accruedZZS'
                    })
                }
            })
          break
      case 'socialSecurity':
          fetchApi('getPaymentInfo', 'POST', JSON.stringify({
              categoryUuid: categoryUuid,
              runningDate: runningDate,
              acType:'AC_SB'
          }) , json => {
              if (showMessage(json)) {
              dispatch({
                type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                  receivedData: json.data.result,
                  wordType:'socialSecurity'
              })
              }
          })
          break
      case 'sfAmount':
          fetchApi('getIncomeTax', 'POST', JSON.stringify({
            categoryUuid: categoryUuid,
              runningDate: runningDate,
              acId: acId1,
              assId1: assId1,
              assCategory1: assCategory1,
              assId2: assId2,
              assCategory2: assCategory2
          }) , json => {
              if (showMessage(json)) {
              dispatch({
                type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                  receivedData: json.data.result,
                  wordType:'sfAmount'
              })
              }
          })
          break
      case 'fund':
          fetchApi('getPaymentInfo', 'POST', JSON.stringify({
              categoryUuid: categoryUuid,
              runningDate: runningDate,
              acType:'AC_GJJ'
          }) , json => {
              if (showMessage(json)) {
                  dispatch({
                        type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                        receivedData: json.data.result,
                        wordType:'fund'
                  })
              }
          })
          break
      default:
          fetchApi('getOutPutTax', 'POST', JSON.stringify({
              categoryUuid: categoryUuid,
              runningDate: runningDate,
              acId: acId1,
              assId1: assId1,
              assCategory1: assCategory1,
              assId2: assId2,
              assCategory2: assCategory2
          }) , json => {
            if (showMessage(json)) {
                  dispatch({
                      type: ActionTypes.GET_RUNNING_ACCOUNT_INFO,
                      receivedData: json.data.result,
                      wordType:'tax'
                  })
              }
          })

  }


}



export const changeLrAccountAccountName = (tab, placeUUid, placeName, value) => ({
    type: ActionTypes.CHANGE_LR_ACCOUNT_ACCOUNT_NAME,
	tab,
	placeUUid,
	placeName,
    value
})
export const changeAccountSalary = (place, value) => ({
      type: ActionTypes.CHANGE_ACCOUNT_SALARY,
      place,
      value
    })

export const changeAccountSalaryCheckbox = (place, checkplace, checked) => (dispatch) => {
    if (!checked) {     //薪酬支出 公积金个税社保checkbox未选中清空辅助核算
        switch (checkplace) {
            case 'personAccumulationAmountchecked':
                dispatch(updateAssList(['acPayment', 'fundList'],''))
            break
            case 'personSocialSecurityAmountchecked':
                dispatch(updateAssList(['acPayment', 'socialSecurityList'],''))
                break
            case 'incomeTaxAmountchecked':
                dispatch(updateAssList(['acPayment', 'incomeTaxList'],''))
                break
            default:

        }
    }
  const value = 0
  dispatch({
    type: ActionTypes.CHANGE_ACCOUNT_SALARY,
    place,
    value,
    checkplace,
    checked
  })
}
//发票
export const changeAccountAmount = (value) => ({
	type: ActionTypes.CHANGE_ACCOUNT_BILL_TYPE,
	value,
})

export const changeAccountTaxRate = (value) => ({
	type: ActionTypes.CHANGE_ACCOUNT_TAX_RATE,
	value
})

export const autoCalculateBillInfo = (strJudgeType) => ({
	type: ActionTypes.AUTO_CALCULATE_BILL_INFO,
	strJudgeType

})

export const changeAccountFzhsModalDisplay = () => ({
    type: ActionTypes.CHANGE_ACCOUNT_FZHS_MODAL_DISPLAY
})

export const changeAccountAssCategory = (assCategory) => ({
    type: ActionTypes.CHANGE_ACCOUNT_ASS_CATEGORY,
    assCategory
})

export const changeAccountFzhsModalClear = () => ({
    type: ActionTypes.CHANGE_ACCOUNT_FZHS_MODAL_CLEAR
})

export const changeAccountAssId = (value) => ({
    type: ActionTypes.CHANGE_ACCOUNT_ASSID,
    value
})

export const changeAccountAssName = (value) => ({
    type: ActionTypes.CHANGE_ACCOUNT_ASSNAME,
    value
})
export const autoCalculateAmount = () => ({
  type:ActionTypes.CALCULATE_AMOUNT
})
export const saveRunningbusiness = (saveAndNew) => (dispatch, getState) => {

    dispatch(initCalculate())
    const lrAccountState = getState().lrAccountState
    const accountConfState = getState().accountConfState
    const insertOrModify = lrAccountState.getIn(['flags', 'insertOrModify'])
    const specialStateforAssets = lrAccountState.getIn(['flags', 'specialStateforAssets'])
    const runningInsertOrModify = lrAccountState.getIn(['flags', 'runningInsertOrModify'])
	let cardTemp = lrAccountState.get('cardTemp')
    const runningState = cardTemp.get('runningState')
    const categoryType = cardTemp.get('categoryType')

    const runningUuid = cardTemp.get('categoryUuid')
    const scale = cardTemp.get('scale')
    const payableRate = cardTemp.get('payableRate')
    const outputRate = cardTemp.get('outputRate')
    const runningCategory = accountConfState.get('runningCategory')
    const oldEnclosureList = lrAccountState.get('enclosureList').toJS()
    const needDeleteUrl = lrAccountState.get('needDeleteUrl').toJS()
    const enclosureList = oldEnclosureList.concat(needDeleteUrl)
    let url = {
        LB_YYSR:'insertIncome',
        LB_YYZC:'insertExpense',
        LB_JK:'insertLoan',
        LB_TZ:'insertInvest',
        LB_ZB:'insertCapital',
        LB_ZZ:'insertVirement',
        LB_XCZC:'insertPayment',
        LB_FYZC:'insertCost',
        LB_SFZC:'insertTax',
        LB_ZFKX:'insertTemporaryPay',
        LB_ZSKX:'insertTemporaryReceipt',
        LB_CQZC:'insertAssets',
        LB_YYWZC:'insertOutIncome',
        LB_YYWSR:'insertOutExpense',
    }[categoryType]
    const categoryTypeObj = {
        'LB_YYSR': 'acBusinessIncome',
        'LB_YYZC': 'acBusinessExpense',
        'LB_YYWSR': 'acBusinessOutIncome',
        'LB_YYWZC': 'acBusinessOutExpense',
        'LB_JK': 'acLoan',
        'LB_TZ': 'acInvest',
        'LB_ZB': 'acCapital',
        'LB_CQZC': 'acAssets',
        'LB_FYZC': 'acCost',
        'LB_ZSKX': 'acTemporaryReceipt',
        'LB_ZFKX': 'acTemporaryPay',
        'LB_XCZC': 'acPayment',
        'LB_SFZC': 'acTax',
    }[categoryType]
    let amount
	// 如果流水类别为预付，将金额处理为相反数
	if (runningState === 'STATE_YYSR_DJ' ||runningState === 'STATE_ZS'||runningState === 'STATE_ZF'||runningState === 'STATE_YYZC_DJ') {
		// cardTemp = cardTemp.update('amount', v => -Number(v))
        amount = -Math.abs(cardTemp.get('amount'))

	} else {
        amount = cardTemp.get('amount')
    }

    let data =cardTemp.toJS()
    const deleteCategoryList = getCategoryType(categoryType)
    for(let i in deleteCategoryList) {
        delete data[deleteCategoryList[i]]
    }
    delete data['queryObj']
    if (data.usedProject && data.projectCard.size) {
        data.projectCard = data.projectCard.filter(v => v.uuid)
    }
    if(data[categoryTypeObj].stockCardList && data[categoryTypeObj].stockCardList.size) {
        data[categoryTypeObj].stockCardList = data[categoryTypeObj].stockCardList.filter(v => v.uuid)
    }
    if(runningInsertOrModify === 'insert' && !specialStateforAssets) {delete data['uuid']} //insert时不传uuid
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`${runningInsertOrModify==='modify'?'modifyRunningbusiness':url}`, 'POST', JSON.stringify({
        ...data,
        amount,
        enclosureList
    }), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
          if(json.code !== 0) {
            message.info(json.code + ' ' + json.message)
          }else {
            const { businessFlowNumberList } = json.data
            if (businessFlowNumberList && businessFlowNumberList.length) {
              message.success(`已生成如下流水：${json.data.flowNumber}、${businessFlowNumberList.map((v,i) => `${v}${i<businessFlowNumberList.length-1?'、':''}`)}`)
            } else {
              message.success(json.message)
            }
            if (saveAndNew) { //保存并新增
				dispatch(initLrAccount('saveAndNew'))
                dispatch(selectAccountRunningCategory(runningUuid,'', runningCategory, scale, payableRate, outputRate))

			} else { //保存

                if (runningState === 'STATE_JK_ZFLX'
                || runningState === 'STATE_TZ_SRGL'
                || runningState === 'STATE_TZ_SRLX'
                || runningState === 'STATE_ZB_ZFLR'
                || runningState === 'STATE_XC_FF'
                || runningState === 'STATE_XC_JN'
                || runningState === 'STATE_SF_JN'
                || runningState === 'STATE_ZS_TH'
                || runningState === 'STATE_ZF_SH'
                || runningState === 'STATE_CQZC_JZSY'
                || runningState === 'STATE_CQZC_YS'
                || runningState === 'STATE_CQZC_WS') {
                    let currentUuid
                    if(runningInsertOrModify === 'insert') {
                        currentUuid = json.data.uuid
                    } else {
                        const uuid = cardTemp.get('uuid')
                        currentUuid = uuid
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    fetchApi('getRunningBusiness', 'GET', `uuid=${currentUuid}`, json => {
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        if (showMessage(json)) {
                            dispatch({
                                type: ActionTypes.INIT_LR_ACCOUNT,
                                strJudgeType: 'fromCxAccount',
                                receivedData: json.data,
                            })
                            if (runningState === 'STATE_CQZC_JZSY') {
                                dispatch(calculateGain())
                            }
                        }
                })

            } else {
                dispatch(initLrAccount('afterSave', cardTemp, json.data))
            }
          }
      }
    })

}
export const initCalculate = () => ({
	type: ActionTypes.INIT_LR_CALCULATE_STATE
})
export const initBussiness = () => ({
	type: ActionTypes.INIT_LR_ACOUNT_STATE
})
export const justNewRunningbusiness = (PageTab,paymentType) => (dispatch, getState) => {
    const lrAccountState = getState().lrAccountState
    const accountConfState = getState().accountConfState
	let cardTemp = lrAccountState.get('cardTemp')

    const runningUuid = cardTemp.get('categoryUuid')
    const scale = cardTemp.get('scale')
    const payableRate = cardTemp.get('payableRate')
    const outputRate = cardTemp.get('outputRate')
    const runningCategory = accountConfState.get('runningCategory')
    const calculateTemp = lrAccountState.get('calculateTemp')
    const runningDate = calculateTemp.get('runningDate')
    PageTab ==='business' && dispatch(initCalculate())
    if(PageTab ==='business' || PageTab === 'payment' && (paymentType === '' )) {
        dispatch(initLrAccount('saveAndNew'))
        dispatch(selectAccountRunningCategory(runningUuid,'', runningCategory, scale, payableRate, outputRate))
    }else{
        switch(paymentType){
            case 'LB_ZZ':
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_INSERT_LB_ZZ_ITEM,
                    saveAndNew:true
                })
                break
            case 'LB_SFGL':
                dispatch(getAccountObjectList(runningDate))
                dispatch({
                  type:ActionTypes.INIT_LR_ACCOUNT_PAYMENT,
                  saveAndNew:true,
                  paymentInsertOrModify:'insert',
                })
                break
            case 'LB_JZCB':
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_INSERT_CARRYOVER_ITEM,
                    saveAndNew:true
                })
                break
            case 'LB_FPRZ':
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_INSERT_INVOICEAUTH_ITEM,
                    saveAndNew:true
                })
                break
            case 'LB_KJFP':
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_INSERT_INVOICING_ITEM,
                    saveAndNew:true
                })
                dispatch(lrCalculateActions.getInvoicingList('BILL_MAKE_OUT_TYPE_XS', runningDate))
                break
            case 'LB_ZCWJZZS':
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_INSERT_TRANSFER_OUT_ITEM,
                    saveAndNew:true
                })
                break
            case 'LB_GGFYFT':
                dispatch(getProjectShareList())
                dispatch({
                    type:ActionTypes.INIT_COMMON_CHARGE,
                    saveAndNew:true,
                })
                break
            case 'LB_ZJTX':
                dispatch({
                    type:ActionTypes.INIT_LR_CALCULATE_STATE
                })
                dispatch(lrCalculateActions.getAssetsList('LB_ZJTX'))
                break
            case 'LB_JZSY':
                dispatch(getProjectShareList())
                dispatch({
                    type:ActionTypes.AFTER_INSERT_JZSY,
                    saveAndNew:true,
                })
                break
            default:
                break
        }
    }

}
export const updateAssList = (place, valueStr) => (dispatch) => {
  let placeArr = typeof place === 'string'?['cardTemp',place]:['cardTemp', ...place]
  let empty = false
  let value
  if(valueStr) {
    const valueList = valueStr.split(Limit.TREE_JOIN_STR)
    value = {
      assName: valueList[0],
      assId: valueList[1],
      assCategory: valueList[2]
    }
  }else {
    empty = true
  }


  dispatch({
    type: ActionTypes.UPDATE_ACCOUNT_LIST,
    placeArr,
    value,
    empty
  })
}
export const calculateGain =  (currentBillType) => (dispatch, getState) => {
  const lrAccountState = getState().lrAccountState
  const cardTemp = lrAccountState.get('cardTemp')
  let amount =cardTemp.get('amount')
  const taxRate = cardTemp.get('taxRate')
  const businessList = cardTemp.get('businessList')
  const billType = currentBillType ? currentBillType : cardTemp.get('billType')
  const isQueryByBusiness = lrAccountState.getIn(['flags', 'isQueryByBusiness'])
  const specialStateforAssets = lrAccountState.getIn(['flags', 'specialStateforAssets'])
  if (billType === 'bill_common' && (!isQueryByBusiness || specialStateforAssets)) {
      amount = (amount /(1 + Number(taxRate)/100)).toFixed(2)
  } else if (isQueryByBusiness && businessList.size && businessList.getIn([0, 'billType']) === 'bill_common') {
      amount = (amount /(1 + Number(businessList.getIn([0, 'taxRate']))/100)).toFixed(2)
  }
  const originalAssetsAmount = cardTemp.getIn(['acAssets', 'originalAssetsAmount'])// 资产原值
  const depreciationAmount = cardTemp.getIn(['acAssets', 'depreciationAmount'])// 折旧累计
  const cleaningAmount = cardTemp.getIn(['acAssets', 'cleaningAmount']) // 清理费用
  const upgradingAmount = cardTemp.getIn(['acAssets', 'upgradingAmount'])// 升级改造
  const loss = (Number(originalAssetsAmount) - Number(depreciationAmount) + Number(upgradingAmount)).toFixed(2)
  const diff = Math.abs(loss - amount).toFixed(2)
  let place, deletePlace
  if(Number(loss) <= amount ) {
     place =  ['cardTemp', 'acAssets', 'netProfitAmount']
     deletePlace = ['cardTemp', 'acAssets', 'lossAmount']
   }else if(Number(loss) >amount) {
     place =  ['cardTemp', 'acAssets', 'lossAmount']
     deletePlace = ['cardTemp', 'acAssets', 'netProfitAmount']
   }
    dispatch({
      type:ActionTypes.CALCULATE_GAIN_OR_LOSS,
      deletePlace,
      place,
      diff

    })

}
export const billChange = (scale, billState, direction, leftAcId, rightAcId) => (dispatch, getState) => {
  const lrAccountState = getState().lrAccountState
  const cardTemp = lrAccountState.get('cardTemp')
  let acId
  if ( scale === 'small' && billState === 'bill_states_make_out' ) {
      acId = leftAcId
  } else if (scale === 'small' && billState === 'bill_states_not_make_out') {
      acId = rightAcId
  } else if (scale === 'general' && (billState === 'bill_states_make_out' || billState === 'bill_states_auth')) {
      acId = leftAcId
  } else if (scale === 'general' && (billState === 'bill_states_not_make_out' || billState === 'bill_states_not_auth')) {
      acId = rightAcId
  }

  dispatch({
    type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING,
    placeArr: ['cardTemp', 'billStates'],
    value: billState
  })
  dispatch({
    type: ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING,
    placeArr: ['cardTemp', 'billAcList'],
    value: [{acId}]
  })

}


export const getBusinessList = (runningDate,cardUuid) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      fetchApi('getManageList', 'POST',JSON.stringify({
          runningDate,
          cardUuid,
          isCheck:false
      }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json )) {
                  dispatch({
                    type:ActionTypes.GET_PAYMENT_PERIOD,
                    receivedData:json.data.result.childList,
                  })
            }
        })
}
export const AsssetsInsert = () => dispatch => {
    dispatch(changeLrAccountCommonString('', ['flags', 'specialStateforAssets'], true))
    dispatch(changeLrAccountCommonString('', ['flags', 'runningInsertOrModify'], 'insert'))

}
export const getAccountObjectList = (runningDate) => dispatch => {
  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
fetchApi('getBusinessManagerCardList', 'POST',JSON.stringify({
    runningDate
  }),json => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (showMessage(json)) {
       // dispatch(changeLrAccountCommonString('calculate', 'assList', fromJS(json.data.assList)))
       dispatch(changeLrAccountCommonString('calculate', 'cardList', fromJS(json.data.cardList)))

    }
	})
}
export const accountItemCheckboxCheck = (checked, uuid, index) => ({
    type: ActionTypes.LRACCOUNT_ITEM_CHECKBOX_CHECK,
    checked,
    uuid,
    index
})
export const accountItemCheckboxCheckAll = (selectAll, list) =>(dispatch,getState) => {
    const lrAccountState = getState().lrAccountState
    const detail = lrAccountState.getIn(['calculateTemp','detail'])
    const managerCategoryList = lrAccountState.getIn(['flags','managerCategoryList'])

    detail.forEach((item,index) => {
        if(item.get('beOpened') && !managerCategoryList.get(index)) {
            dispatch(getManagerCategoryList(index,item.get('assType')))
        }
    })

    dispatch({
        type: ActionTypes.LRACCOUNT_ITEM_CHECKBOX_CHECK_ALL,
        selectAll,
        list
    })
}
export const accountTotalAmount = (needChangeHanle) => (dispatch, getState) => {
  const lrAccountState = getState().lrAccountState
  const calculateTemp = lrAccountState.get('calculateTemp')
  const indexList = lrAccountState.getIn(['flags', 'indexList'])
  const detail = lrAccountState.getIn(['calculateTemp', 'detail'])
  const flags = lrAccountState.get('flags')
  const isQuery = flags.get('isQuery')
  const modify = flags.get('modify')
  const accountType = flags.get('accountType')
  let totalAmount = 0
  const direction = calculateTemp.get('direction')
  const flowType = calculateTemp.get('flowType')
  const runningState = calculateTemp.get('runningState')
  let notHandleAmount, handleAmount;
  detail && detail.size && detail.map((v, i) => {
    const direction = v.get('direction')
    const flowType = v.get('flowType')
    const runningState = v.get('runningState')
    let showAmount
    let notHandleAmount = Number(v.get('notHandleAmount'))
    let handleAmount = Number(v.get('handleAmount'))
    if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') { //退销退购 状态下前端取负数
        notHandleAmount = -Math.abs(notHandleAmount)
        handleAmount = -Math.abs(handleAmount)
    }
    if(isQuery) {
      showAmount = handleAmount.toFixed(2)
    }else if (modify) {
      showAmount = (notHandleAmount+handleAmount).toFixed(2)
    }else {
      showAmount = notHandleAmount.toFixed(2)
    }
    if(indexList.some(v => v === i)) {
      if(direction === 'debit') {
        if(flowType === 'FLOW_INADVANCE') {
          totalAmount -= Number(showAmount)
        }else {
          totalAmount += Number(showAmount)
        }
      }else {
        if(flowType === 'FLOW_INADVANCE') {
          totalAmount += Number(showAmount)
        }else {
          totalAmount -= Number(showAmount)
        }
      }
    }
    })
  dispatch(changeLrAccountCommonString('', ['flags', 'totalAmount'], totalAmount.toFixed(2)))
  if( needChangeHanle ) {
      dispatch(changeLrAccountCommonString('calculate', 'handlingAmount', Math.abs(totalAmount).toFixed(2)))
  }

}

export const insertlrAccount = (saveAndNew) => (dispatch, getState) => {
    const lrAccountState = getState().lrAccountState
    const calculateTemp = lrAccountState.get('calculateTemp')
    const flags = lrAccountState.get('flags')
    const runningDate = calculateTemp.get('runningDate')
    const runningAbstract = calculateTemp.get('runningAbstract')
    const accountUuid = calculateTemp.get('accountUuid')
    const amount = calculateTemp.get('handlingAmount')
    const detail = calculateTemp.get('detail')
    const moedAmount = calculateTemp.get('moedAmount')
    const indexList = flags.get('indexList')
    const beMoed = calculateTemp.get('beMoed')
    const oldEnclosureList = lrAccountState.get('enclosureList').toJS()
    const needDeleteUrl = lrAccountState.get('needDeleteUrl').toJS()
    const enclosureList = oldEnclosureList.concat(needDeleteUrl)
    const uuidList = indexList.map(v => {
        if(detail.getIn([v,'beOpened'])) {
            return {
                    uuid:detail.getIn([v,'uuid']),
                    categoryUuid:detail.getIn([v,'categoryUuid']),
                    beOpened:true,
                    assType:detail.getIn([v,'assType']),
                    }
        } else {
            return {
                uuid:detail.getIn([v,'uuid']),
                assType:detail.getIn([v,'assType']),
            }
        }

    })
    const uuid =calculateTemp.get('uuid')
    const cardUuid = calculateTemp.get('cardUuid')
    const paymentInsertOrModify = flags.get('paymentInsertOrModify')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`${paymentInsertOrModify}Runningpayment`, 'POST', JSON.stringify({
      runningDate,
      runningAbstract,
      accountUuid,
      amount,
      uuidList,
      cardUuid,
      beMoed,
      moedAmount,
      enclosureList,
      uuid:`${paymentInsertOrModify === 'modify' ? uuid : ''}`
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      if(showMessage(json)) {
          message.success(json.message)
          if(saveAndNew) {

              dispatch(getAccountObjectList(runningDate))
              dispatch({
                type:ActionTypes.INIT_LR_ACCOUNT_PAYMENT,
                saveAndNew,
                paymentInsertOrModify,
              })
          } else {
              let currentUuid
              if(paymentInsertOrModify === 'insert') {
                  currentUuid = json.data
              } else {
                  const uuid = calculateTemp.get('uuid')
                  currentUuid = uuid
              }
              dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
              fetchApi('getRunningBusiness', 'GET', `uuid=${currentUuid}`, json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                if (showMessage(json)) {
                  const result = json.data.result
                  let assName
                  dispatch({
                    type: ActionTypes.AFTER_SAVE_ACCOUNT_PAYMENT,
                    result,
                    currentUuid
                  })
                }
              })
          }

      }


    })
}
export const getManagerCategoryList = (index,assType) => dispatch => {
    fetchApi('getManagerCategoryList','POST',JSON.stringify({
        assType
    }),json => {
        dispatch(changeLrAccountCommonString('', ['flags', 'managerCategoryList',index], fromJS(json.data)))
    })
}
export const initLrAccountAfterFailed = () => (dispatch, getState) => {
    dispatch(changeLrAccountCommonString('', ['flags', 'pzFailedButtonShow'], false))
    dispatch(changeLrAccountCommonString('', ['flags', 'specialStateforAccrued'], false))
    dispatch(initLrAccount('saveAndNew'))
}
export const changeBeforeAmount = (item,value,index) => (dispatch,getState) => {
    const code = value.split(Limit.TREE_JOIN_STR)[0]
    const name = value.split(Limit.TREE_JOIN_STR)[1]
    const categoryUuid = value.split(Limit.TREE_JOIN_STR)[2]
    dispatch(changeLrAccountCommonString('calculate', ['detail', index,'categoryUuid'], categoryUuid))
    dispatch(changeLrAccountCommonString('calculate', ['detail', index,'categoryName'], name))

}
export const calculateAccruedAmount = (isQueryByBusiness, paymentList, index, checked) => (dispatch, getState) => {
    let totalNotHandleAmount = 0
    const propertyPay = getState().lrAccountState.getIn(['cardTemp', 'propertyPay'])
    const propertyTax = getState().lrAccountState.getIn(['cardTemp', 'propertyTax'])
    if (!isQueryByBusiness) {
        paymentList && paymentList.forEach((v,i) => {
            if(i === index && checked) {
                totalNotHandleAmount += v.get('notHandleAmount')
            } else if (v.get('beSelect') && i !== index) {
                totalNotHandleAmount += v.get('notHandleAmount')
            }
        })
    } else {
        paymentList && paymentList.forEach((v,i) => {
            if(i === index && checked) {
                totalNotHandleAmount += Number(v.get('handleAmount')) + Number(v.get('notHandleAmount'))
            } else if (v.get('beSelect') && i !== index) {
                totalNotHandleAmount += Number(v.get('handleAmount')) + Number(v.get('notHandleAmount'))
            }
        })
    }
    totalNotHandleAmount = totalNotHandleAmount.toFixed(2)
    switch (propertyPay) {
        case 'SX_GZXJ':
            dispatch(changeLrAccountCommonString('card','amount',totalNotHandleAmount))
            break
        case 'SX_SHBX':
            dispatch(changeLrAccountCommonString('card',['acPayment', 'companySocialSecurityAmount'],totalNotHandleAmount))
            break
        case 'SX_ZFGJJ':
            dispatch(changeLrAccountCommonString('card',['acPayment', 'companyAccumulationAmount'],totalNotHandleAmount))
            break
        case 'SX_QTXC':
            dispatch(changeLrAccountCommonString('card','amount',totalNotHandleAmount))
            break
        default:
    }
    if (propertyTax === 'SX_QTSF') {
        dispatch(changeLrAccountCommonString('card','amount',totalNotHandleAmount))
    } else if (propertyTax === 'SX_ZZS') {
        dispatch(changeLrAccountCommonString('card','handleAmount',totalNotHandleAmount))
    } else {
        dispatch(changeLrAccountCommonString('card','amount',totalNotHandleAmount))
    }
}
export const getFirstStockCardList = (stockRange,runningState) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const propertyStock = {
        STATE_YYSR_XS:'4',
        STATE_YYSR_TS:'4',
        STATE_YYZC_TG:'5',
        STATE_YYZC_GJ:'5',
    }[runningState]
    fetchApi('getStockCategoryList','POST', JSON.stringify({
        sobId,
        categoryList:stockRange,
        property:propertyStock
    }),json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'stockThingsList'],  fromJS(json.data.result)))
        }
    })

}
export const getFirstContactsCardList = (contactsRange,runningState) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const propertyContacts = {
        STATE_YYSR_DJ:'PREIN',
        STATE_YYSR_XS:'NEEDIN',
        STATE_YYSR_TS:'NEEDIN',
        STATE_YYZC_DJ:'PREPAY',
        STATE_YYZC_TG:'NEEDPAY',
        STATE_YYZC_GJ:'NEEDPAY',
        STATE_FY_DJ:'PREPAY',
        STATE_FY_YF:'NEEDPAY',
        STATE_FY_WF:'NEEDPAY',
        STATE_CQZC_WF:'NEEDPAY',
        STATE_CQZC_YF:'NEEDPAY',
        STATE_CQZC_YS:'NEEDIN',
        STATE_CQZC_WS:'NEEDIN',
        STATE_YYWSR_WS:'NEEDIN',
        STATE_YYWSR_YS:'NEEDIN',
        STATE_YYWZC_WF:'NEEDPAY',
        STATE_YYWZC_YF:'NEEDPAY',
    }[runningState]
    if (propertyContacts) {
        fetchApi('getContactsCategoryList','POST', JSON.stringify({
            sobId,
            categoryList:contactsRange,
            property:propertyContacts
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'contactsThingsList'],  fromJS(json.data.result)))
            }
        })
    }

}
export const getCardList = (cardType, runningState, categoryList,modalName) => (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (cardType === 'stock') {
        const property = {
            STATE_YYSR_XS:'4',
            STATE_YYSR_TS:'4',
            STATE_YYZC_TG:'5',
            STATE_YYZC_GJ:'5',
        }[runningState]
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getStockCardList','POST', JSON.stringify({
            sobId,
            categoryList,
            property
        }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'MemberList'], fromJS(json.data.typeList)))

            }
        })
        fetchApi('getStockCategoryList','POST', JSON.stringify({
            sobId,
            categoryList,
            property
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', modalName], true))
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.result)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
            }
        })
    } else if (cardType === 'contacts') {
        const property = {
            STATE_YYSR_DJ:'PREIN',
            STATE_YYSR_XS:'NEEDIN',
            STATE_YYSR_TS:'NEEDIN',
            STATE_YYZC_DJ:'PREPAY',
            STATE_YYZC_TG:'NEEDPAY',
            STATE_YYZC_GJ:'NEEDPAY',
            STATE_FY_DJ:'PREPAY',
            STATE_FY_YF:'NEEDPAY',
            STATE_FY_WF:'NEEDPAY',
            STATE_CQZC_WF:'NEEDPAY',
            STATE_CQZC_YF:'NEEDPAY',
            STATE_CQZC_YS:'NEEDIN',
            STATE_CQZC_WS:'NEEDIN',
            STATE_YYWSR_WS:'NEEDIN',
            STATE_YYWSR_YS:'NEEDIN',
            STATE_YYWZC_WF:'NEEDPAY',
            STATE_YYWZC_YF:'NEEDPAY',
        }[runningState]
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getContactsCardList','POST', JSON.stringify({
            sobId,
            categoryList,
            property
        }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'MemberList'], fromJS(json.data.typeList)))

            }
        })
        fetchApi('getContactsCategoryList','POST', JSON.stringify({
            sobId,
            categoryList,
            property
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'showContactsModal'], true))
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.result)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
            }
        })
    }

}
export const getProjectAllCardList = (categoryList,modalName,leftNotNeed) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const lrAccountState = getState().lrAccountState
    const categoryType = lrAccountState.getIn(['cardTemp','categoryType'])
    const runningState = lrAccountState.getIn(['cardTemp','runningState'])
    const beAccrued = lrAccountState.getIn(['cardTemp','beAccrued'])
    const propertyCost = lrAccountState.getIn(['cardTemp','propertyCost'])
    let needCommonCard = false
    if (categoryType === 'LB_FYZC'
    || runningState === 'STATE_XC_JT'
    || !beAccrued && runningState === 'STATE_XC_JN'
    || propertyCost === 'XZ_CHLX' && (runningState === 'STATE_JK_JTLX' || !beAccrued && runningState === 'STATE_JK_ZFLX' )) {
        needCommonCard = true
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if(!leftNotNeed) {
        fetchApi('getProjectTreeList','POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'MemberList'], fromJS(json.data.typeList)))

            }
        })
    }
    fetchApi('getProjectCardList','POST', JSON.stringify({
        sobId,
        categoryList,
        needCommonCard
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
            dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'], fromJS(json.data.result)))
            dispatch(changeLrAccountCommonString('', ['flags', modalName], true))
        }
    })
}
export const getProjectSomeCardList = (uuid,level) =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (level == 1) {
        fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            categoryUuid:uuid,
            listByCategory:true,
            subordinateUuid:'',
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.resultList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            subordinateUuid:uuid,
            listByCategory:false,
            categoryUuid:uuid,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.resultList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.resultList)))
            }
        })
    }
}
export const getAllCardList = (cardType, runningState, categoryList,modalName) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (cardType === 'stock') {
        const property = {
            STATE_YYSR_XS:'4',
            STATE_YYSR_TS:'4',
            STATE_YYZC_TG:'5',
            STATE_YYZC_GJ:'5',
        }[runningState]
        fetchApi('getStockCategoryList','POST', JSON.stringify({
            sobId,
            categoryList,
            property
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', modalName], true))
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.result)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
            }
        })
    }else if (cardType === 'contacts'){
        const property = {
            STATE_YYSR_DJ:'PREIN',
            STATE_YYSR_XS:'NEEDIN',
            STATE_YYSR_TS:'NEEDIN',
            STATE_YYZC_DJ:'PREPAY',
            STATE_YYZC_TG:'NEEDPAY',
            STATE_YYZC_GJ:'NEEDPAY',
            STATE_FY_DJ:'PREPAY',
            STATE_FY_YF:'NEEDPAY',
            STATE_FY_WF:'NEEDPAY',
            STATE_CQZC_WF:'NEEDPAY',
            STATE_CQZC_YF:'NEEDPAY',
            STATE_CQZC_YS:'NEEDIN',
            STATE_CQZC_WS:'NEEDIN',
            STATE_YYWSR_WS:'NEEDIN',
            STATE_YYWSR_YS:'NEEDIN',
            STATE_YYWZC_WF:'NEEDPAY',
            STATE_YYWZC_YF:'NEEDPAY',
        }[runningState]
        fetchApi('getContactsCategoryList','POST', JSON.stringify({
            sobId,
            categoryList,
            property
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'showContactsModal'], true))
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.result)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
            }
        })
    }
}
export const getCurrentCardList = (cardType, runningState, uuid,level) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (cardType === 'stock') {
        const property = {
            STATE_YYSR_XS:'4',
            STATE_YYSR_TS:'4',
            STATE_YYZC_TG:'5',
            STATE_YYZC_GJ:'5',
        }[runningState]
        if (level == 1) {
            fetchApi('getRunningStockMemberList','POST', JSON.stringify({
                sobId,
                categoryUuid:uuid,
                listByCategory:true,
                subordinateUuid:'',
                property
            }),json => {
                if (showMessage(json)) {
                    dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.resultList)))
                    dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.resultList)))
                }
            })
        } else {
            fetchApi('getRunningStockMemberList','POST', JSON.stringify({
                sobId,
                subordinateUuid:uuid,
                listByCategory:false,
                categoryUuid:'',
                property
            }),json => {
                if (showMessage(json)) {
                    dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.resultList)))
                    dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.resultList)))
                }
            })
        }

    } else if (cardType === 'contacts') {
        const property = {
            STATE_YYSR_DJ:'PREIN',
            STATE_YYSR_XS:'NEEDIN',
            STATE_YYSR_TS:'NEEDIN',
            STATE_YYZC_DJ:'PREPAY',
            STATE_YYZC_TG:'NEEDPAY',
            STATE_YYZC_GJ:'NEEDPAY',
            STATE_FY_DJ:'PREPAY',
            STATE_FY_YF:'NEEDPAY',
            STATE_FY_WF:'NEEDPAY',
            STATE_CQZC_WF:'NEEDPAY',
            STATE_CQZC_YF:'NEEDPAY',
            STATE_CQZC_YS:'NEEDIN',
            STATE_CQZC_WS:'NEEDIN',
            STATE_YYWSR_WS:'NEEDIN',
            STATE_YYWSR_YS:'NEEDIN',
            STATE_YYWZC_WF:'NEEDPAY',
            STATE_YYWZC_YF:'NEEDPAY',
        }[runningState]
        if (level == 1) {
            fetchApi('getRunningContactsMemberList','POST', JSON.stringify({
                sobId,
                categoryUuid:uuid,
                listByCategory:true,
                property,
                subordinateUuid:''
            }),json => {
                if (showMessage(json)) {
                    dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.resultList)))
                    dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.resultList)))
                }
            })
        } else {
            fetchApi('getRunningContactsMemberList','POST', JSON.stringify({
                sobId,
                subordinateUuid:uuid,
                property,
                listByCategory:false,
                categoryUuid:''
            }),json => {
                if (showMessage(json)) {
                    dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.resultList)))
                    dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.resultList)))
                }
            })
        }

    }
}
export const searchCardList = (isSearch, list) => ({
    type: ActionTypes.LRACCOUNT_ITEM_SEARCH_CARD_LIST,
    isSearch,
    list
})
export const getIUmanageListTitle = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getIUManageListTitle`, 'GET', '', json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.ACCOUNT_IUMANAGE_LIST_TITLE,
                data:json.data,
                // deleteBtn:isDeleteBtn
            })
        }

    })
}
export const changeManageCardRelation = (item,value) => dispatch => {
    fetchApi(`getIUManageTreeByType`, 'GET', `ctgyUuid=${item.get('uuid')}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_ACCOUNT_MANAGE_CARD_RELATION,
                tag:item,
                checked:value,
                tree:json.data.resultList,
            })
        }
    })
}
export const saveIUManageTypeCard = (closeModal,flag,showConfirmModal,closeConfirmModal,contactsRange) => (dispatch,getState) =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const psiData = getState().lrAccountState.get('iuManageTypeCard').toJS()
    const runningState = getState().lrAccountState.getIn(['cardTemp','runningState'])
    const saveContent = () =>{
        fetchApi('saveIUManageCard', 'POST', JSON.stringify({
            psiData:psiData,
            insertFrom:'',
            treeFrom:'',
            needAutoIncrementCode:flag === 'insert' ? false : true,
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.ACCOUNT_SAVE_IUMANAGE_TYPE_CARD,
                    list:json.data.resultList,
                    treeList:json.data.typeList,
                    flag:flag,
                    code:json.data.autoIncrementCode
                })
                if(flag === 'insert'){
                    closeModal()
                }else{
                    message.info('保存成功')
                }
                dispatch(getFirstContactsCardList(contactsRange,runningState))
            }
        })
    }

    fetchApi('adjustIUmanageCardTitleSame', 'POST', JSON.stringify({
        psiData:{name:psiData.name,uuid:psiData.uuid}
    }), json => {
        if (showMessage(json)) {
            if(json.data.repeat){
                showConfirmModal()
                confirm({
                   title: '名称重复',
                   content: '卡片名称与已有卡片名称重复，确定保存吗？',
                   onOk() {
                     saveContent()
                     closeConfirmModal()
                   },
                   onCancel() {
                       closeConfirmModal()
                   }
                });
            }else{
                saveContent()
            }
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const changeManageCardRelationType = (item,value) => dispatch => {
    const valueList = value.split(Limit.TREE_JOIN_STR)
	dispatch({
		type: ActionTypes.CHANGE_ACCOUNT_CARD_RELATION_TYPE,
		tag:item,
        uuid:valueList[0],
        name:valueList[1],
	})
}
export const changeCardNature = (name,value) => dispatch =>{
    dispatch({
		type: ActionTypes.ACCOUNT_CHANGE_INVENTORY_CARD_NATURE,
		name,
        value
	})
}
export const changeCardCategoryStatus = (item,value) => dispatch =>{
    fetchApi(`getInventorySettingCardTypeList`, 'GET', `ctgyUuid=${item.get('uuid')}`, tree => {
        if (showMessage(tree)) {
            dispatch({
                type:ActionTypes.ACCOUNT_CHANGE_INVENTORY_CARD_CATEGORY_STATUS,
                list:tree.data.resultList,
                item:item,
                value:value,
            })
        }
    })
}
export const changeCardCategoryType = (item,value) => dispatch =>{
    const valueList = value.split(Limit.TREE_JOIN_STR)

    dispatch({
        type:ActionTypes.ACCOUNT_CHANGE_INVENTORY_CARD_CATEGORY_TYPE,
        item:item,
        uuid:valueList[0],
        name:valueList[1],
    })
}
export const inventorySettingInit = () => dispatch =>{
    fetchApi(`getInventorySettingCardList`, 'GET', `listFrom=`, cardList => {
        if (showMessage(cardList)) {
            fetchApi(`getInventoryHighTypeList`, 'GET', '', titleList => {
                if (showMessage(titleList)) {
                    dispatch({
                        type:ActionTypes.ACCOUNT_INVENTORY_SETTING_INIT,
                        title:titleList.data,
                        cardList:cardList.data.resultList,
                    })
                }
            })
        }
    })
}
export const initRelaCard = (direction,showModal) => dispatch =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getInitRelaCard`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.INIT_RELA_CARD,
                data:json.data,
                direction
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
    showModal()
}

export const initStockCard = (direction,showModal) => dispatch =>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getInitStockCard`, 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.INIT_STOCK_CARD,
                data:json.data,
                direction
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
    showModal()
}

const getCategoryType = (categoryType) => {
    const categoryTypeObj = {
        'LB_YYSR': 'acBusinessIncome',
        'LB_YYZC': 'acBusinessExpense',
        'LB_YYWSR': 'acBusinessOutIncome',
        'LB_YYWZC': 'acBusinessOutExpense',
        'LB_JK': 'acLoan',
        'LB_TZ': 'acInvest',
        'LB_ZB': 'acCapital',
        'LB_CQZC': 'acAssets',
        'LB_FYZC': 'acCost',
        'LB_ZSKX': 'acTemporaryReceipt',
        'LB_ZFKX': 'acTemporaryPay',
        'LB_XCZC': 'acPayment',
        'LB_SFZC': 'acTax',
    }[categoryType]

    const categoryTypeObjList = [
        'acAssets',
        'acBusinessExpense',
        'acBusinessIncome',
        'acBusinessOutExpense',
        'acBusinessOutIncome',
        'acCapital',
        'acCost',
        'acInvest',
        'acLoan',
        'acPayment',
        'acTax',
        'acTemporaryReceipt',
        'acTemporaryPay'

    ]
    categoryTypeObjList.splice(categoryTypeObjList.indexOf(categoryTypeObj),1)
    return categoryTypeObjList
}

export const refreshRunningbusiness = (currentUuid,paymentType) => (dispatch, getState) => {
    let lrAccountState = getState().lrAccountState
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRunningBusiness', 'GET', `uuid=${currentUuid}`, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const beBusiness = json.data.result.beBusiness
            const runningState = json.data.result.runningState
            if(!beBusiness){
                dispatch({
                  type: ActionTypes.INIT_PAYMENT_STATE,
                  item: fromJS(json.data.result),
                  result:json.data.result
                })
            }else{
                runningState === 'STATE_YYSR_JZCB' ||
                runningState === 'STATE_FPRZ_CG' ||
                runningState === 'STATE_FPRZ_TG' ||
                runningState === 'STATE_KJFP_XS' ||
                runningState === 'STATE_KJFP_TS' ||
                runningState === 'STATE_ZCWJZZS' ||
                runningState === 'STATE_ZZ' ?
                fetchApi('getRunningSettingInfo', 'GET', '', settingjson => {
                    if (showMessage(json)) {
                    // fetchApi('getRunningSettingInfo', 'GET', '', settingjson => {
                        const setActionType = ({
                            'LB_JZCB': () => 'COST_TRANSFER_FROM_CXLS_JUMP_TO_LRLS',
                            'LB_FPRZ': () => 'INVOICE_AUTH_FROM_CXLS_JUMP_TO_LRLS',
                            'LB_KJFP': () => 'INVOICING_FROM_CXLS_JUMP_TO_LRLS',
                            'LB_ZCWJZZS': () => 'TRANSFER_OUT_FROM_CXLS_JUMP_TO_LRLS',
                            'LB_ZZ': () => 'TRANSFER_OUT_FROM_CXLS_JUMP_TO_NBZZ',
                        }[paymentType])()
                        dispatch({
                            type: ActionTypes.GET_ACCOUNTCONF_ALL_SETTINGS,
                            receivedData: settingjson.data
                        })
                                // lrAccountState 修改 有没有必要不知道
                        dispatch({
                            type: ActionTypes.CALCULATE_FROM_CXLS_JUMP_TO_LRLS,
                            pageType: paymentType,
                            rate: settingjson.data.rate,
                            hideCategoryList: settingjson.data.hideCategoryList
                        })
                        // lrCalculateState 修改
                        dispatch({
                            type: ActionTypes.CALCULATE_CHANGE_QUERY
                        })
                        dispatch({
                            type: ActionTypes[setActionType],
                            item:fromJS(json.data.result),
                            receivedData: json.data,
                            insertOrModify:'modify',
                            fromRefresh: true,
                            rate: settingjson.data.rate,
                            hideCategoryList: settingjson.data.hideCategoryList
                        })
                    }
                }) : ''
                if(paymentType !== 'LB_JZCB'){
                    dispatch({
                        type: ActionTypes.INIT_LR_ACCOUNT,
                        strJudgeType: 'fromCxAccount',
                        receivedData: json.data,
                    })
                }
                // if (runningState === 'STATE_CQZC_JZSY') {
    			// 	dispatch(calculateGain())
    			// }
                if(json.data.result.beProject) {
                    dispatch(getProjectCardList(json.data.result.projectRange))
                }
            }
        }
    })
}
export const closeAccountconfModal = () => ({
    type: ActionTypes.CLOSE_ACCOUNTCONF_MODAL_LR
})
export const getManagesCardList = (runningDate) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getManageCardTree','GET', '',json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'MemberList'], fromJS(json.data.array)))

        }
    })
    fetchApi('getBusinessManagerCardList','POST',JSON.stringify({
        sobId,
        runningDate,
    }),json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'showContactsModal'], true))
            dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.cardList)))
            dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.cardList)))
        }
    })

}
export const getAllManagesCardList = (runningDate) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    fetchApi('getBusinessManagerCardList','POST',JSON.stringify({
        sobId,
        runningDate,
    }),json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'showContactsModal'], true))
            dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.cardList)))
            dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.cardList)))
        }
    })

}
export const getCalculateCardList = (runningDate,uuid,level) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (level == 1) {
        fetchApi('getManagerCardList','POST', JSON.stringify({
            sobId,
            categoryUuid:uuid,
            subordinateUuid:'',
            runningDate
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.cardList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.cardList)))
            }
        })
    } else {
        fetchApi('getManagerCardList','POST', JSON.stringify({
            sobId,
            subordinateUuid:uuid,
            categoryUuid:'',
            runningDate
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.cardList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.cardList)))
            }
        })
    }
}
export const addProject = (projectCard,index) => dispatch => {
    let projectCardList = projectCard.toJS()
    projectCardList.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeLrAccountCommonString('card','projectCard',  fromJS(projectCardList)))
}
export const deleteProject = (projectCard,index,taxRate) => dispatch => {
    let projectCardList = projectCard.toJS()
    projectCardList.splice(index,1)
    dispatch(changeLrAccountCommonString('card','projectCard',  fromJS(projectCardList)))
    dispatch(autoCalculateProjectAmount())
    taxRate && dispatch(changeAccountTaxRate())
}
export const autoCalculateProjectAmount = () => (dispatch,getState) => {
    const projectCard = getState().lrAccountState.getIn(['cardTemp','projectCard'])
    let amount = projectCard.reduce((total,cur) => {
        const amount = cur.get('amount') ? Number(cur.get('amount')) : 0
        return total + amount
    },0)
    dispatch(changeLrAccountCommonString('card','amount', amount))

}
export const autoCalculateStockAmount = (categoryTypeObj) => (dispatch,getState) => {
    const stockCardList = getState().lrAccountState.getIn(['cardTemp', categoryTypeObj, 'stockCardList'])
    let amount = stockCardList.reduce((total,cur) => {
        const amount = cur.get('amount') && cur.get('amount')!=='.' ? Number(cur.get('amount')) : 0
        return  (total * 100 + amount * 100) / 100
    },0)
    dispatch(changeLrAccountCommonString('card','amount', amount))

}
export const addStock = (stockCardList,index,categoryTypeObj) => dispatch => {
    let stockCardListJ = stockCardList.toJS()
    stockCardListJ.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeLrAccountCommonString('card',[categoryTypeObj,'stockCardList'],  fromJS(stockCardListJ)))
}
export const deleteStock = (stockCardList,index,taxRate,categoryTypeObj) => dispatch => {
    let stockCardListJ = stockCardList.toJS()
    stockCardListJ.splice(index,1)
    dispatch(changeLrAccountCommonString('card',[categoryTypeObj,'stockCardList'], fromJS(stockCardListJ)))
    dispatch(autoCalculateStockAmount(categoryTypeObj))
    taxRate && dispatch(changeAccountTaxRate())
}
export const getCostCardList = (runningDate,runningState,modalName) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getCostCardList','POST', JSON.stringify({
        runningState,
        runningDate,
        categoryUuid:'',
        subordinateUuid:''
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', modalName], true))
            dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.result)))
            dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
        }
    })
    fetchApi('getCostCategoryTree','GET','',json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'MemberList'], fromJS(json.data.typeList)))
        }
    })

}
export const getCostCardTypeList = (runningDate,runningState, uuid,level) => (dispatch,getState) => {
    const property = {
        STATE_YYSR_XS:'4',
        STATE_YYSR_TS:'4',
        STATE_YYZC_TG:'5',
        STATE_YYZC_GJ:'5',
    }[runningState]
    if (level == 1) {
        fetchApi('getCostCardList','POST', JSON.stringify({
            categoryUuid:uuid,
            subordinateUuid:'',
            runningDate,
            runningState
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.result)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
            }
        })
    } else {
        fetchApi('getCostCardList','POST', JSON.stringify({
            subordinateUuid:uuid,
            categoryUuid:'',
            runningDate,
            runningState
        }),json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.result)))
                dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.result)))
            }
        })
    }

}
export const deleteCarryStock = (carryoverCardList,index,categoryTypeObj) => dispatch => {
    let carryoverCardListJ = carryoverCardList ? carryoverCardList.toJS() : []
    carryoverCardListJ.splice(index,1)
    dispatch(changeLrAccountCommonString('card',[categoryTypeObj,'carryoverCardList'], fromJS(carryoverCardListJ)))
}
export const addCarryStock = (carryoverCardList,index,categoryTypeObj) => dispatch => {
    if (carryoverCardList === null)
        return
    let carryoverCardListJ = carryoverCardList.toJS()
    carryoverCardListJ.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeLrAccountCommonString('card',[categoryTypeObj,'carryoverCardList'],  fromJS(carryoverCardListJ)))
}
export const getProjectShareList = (date) => (dispatch,getState) => {
    const commonChargeTemp = getState().lrAccountState.get('commonChargeTemp')
    const runningDate = date || commonChargeTemp.get('runningDate')
    fetchApi('getProjectShareList','POST',JSON.stringify({
        runningDate
    }), json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('commonCharge', 'paymentList',fromJS(json.data)))
            // dispatch(changeLrAccountCommonString('commonCharge', 'paymentList',fromJS([{amount:111},{amount:222},{amount:333},{amount:-333},{amount:-444}])))
        }
    })
}
export const getChargeProjectCard = () => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getProjectAllTreeList`, 'POST', JSON.stringify({
        sobId,
    }), json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'MemberList'], fromJS(json.data.typeList)))
        }
    })
    fetchApi(`getProjectListAndTree`, 'GET', `listFrom=&treeFrom=`, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'],  fromJS(json.data.resultList)))
            dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.resultList)))
        }
    })

}
export const chargeItemCheckboxCheck = (checked,uuid,code,name) => ({
    type: ActionTypes.CHARGE_ITEM_CHECKBOX_SELECT,
    checked,
    uuid,
    name,
    code
})
export const calculateCommonChargeAmount = (index,checked) => (dispatch,getState) => {
    const commonChargeTemp = getState().lrAccountState.get('commonChargeTemp')
    const paymentList = commonChargeTemp.get('paymentList')
    let amount = paymentList.size ? paymentList.reduce((total,item,i) => {
        if(index === i) {
            return checked? total + Number(item.get('amount')):total
        } else {
            return item.get('beSelect')? total + Number(item.get('amount')):total
        }
    },0):0
    dispatch(changeLrAccountCommonString('commonCharge', 'amount',  amount.toFixed(2)))
}
export const insertProjectShare = (saveAndNew) => (dispatch,getState) => {
    const lrAccountState = getState().lrAccountState
    let commonChargeTemp = lrAccountState.get('commonChargeTemp')
    const paymentInsertOrModify = lrAccountState.getIn(['flags','paymentInsertOrModify'])
    const oldEnclosureList = lrAccountState.get('enclosureList').toJS()
    const needDeleteUrl = lrAccountState.get('needDeleteUrl').toJS()
    const enclosureList = oldEnclosureList.concat(needDeleteUrl)
    commonChargeTemp = commonChargeTemp.set('enclosureList',fromJS(enclosureList) )
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`${paymentInsertOrModify}ProjectShare`,'POST',JSON.stringify({
        ...commonChargeTemp.toJS()
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            saveAndNew && dispatch(getProjectShareList())
            dispatch({
                type:ActionTypes.INIT_COMMON_CHARGE,
                saveAndNew,
                uuid:json.data.uuid,
                flowNumber:json.data.flowNumber
            })
            message.info('保存成功')

            // dispatch(changeLrAccountCommonString('commonCharge', 'paymentList',fromJS([{amount:111},{amount:222},{amount:333},{amount:-333},{amount:-444}])))
        }
    })
}
export const changeStateAndAbstract = (cardTemp,runningState) => dispatch => {
    const propertyCarryover = cardTemp.get('propertyCarryover')
    const name = cardTemp.get('name')
    const propertyPay = cardTemp.get('propertyPay')
    const propertyTax = cardTemp.get('propertyTax')
    const runningAbstractDemo = {
        STATE_YYSR_DJ:'收到预收款',
        STATE_YYSR_XS:`销售${propertyCarryover === 'SX_HW'?'存货':''}收入`,
        STATE_YYSR_TS:`${propertyCarryover === 'SX_HW'?'销货':'销售'}退回支出`,
        STATE_YYZC_DJ:'支付预付款',
        STATE_YYZC_GJ:`采购${propertyCarryover === 'SX_HW'?'存货':''}支出`,
        STATE_YYZC_TG:`${propertyCarryover === 'SX_HW'?'购货':'采购'}退还收入`,
        STATE_FY_DJ:'支付预付款',
        STATE_FY_YF:`${name}支出`,
        STATE_FY_WF:`${name}支出`,
        STATE_XC_JT:`计提${{SX_GZXJ:'工资薪金',SX_SHBX:'社会保险',SX_ZFGJJ:'住房公积金',SX_QTXC:name}[propertyPay]}`,
        STATE_XC_FF:`发放${{SX_GZXJ:'工资薪金',SX_QTXC:name}[propertyPay]}`,
        STATE_XC_JN:`缴纳${{SX_SHBX:'社会保险',SX_ZFGJJ:'住房公积金'}[propertyPay]}`,
        STATE_XC_YF:'福利费支出',
        STATE_SF_YJZZS:'预缴增值税',
        STATE_SF_JN:`${{SX_QYSDS:'缴纳企业所得税',SX_GRSF:'代缴个人税费',SX_QTSF:`缴纳${name}`,SX_ZZS:'缴纳增值税'}[propertyTax]}`,
        STATE_SF_JT:`计提${{SX_QYSDS:'企业所得税',SX_GRSF:'个人税费',SX_QTSF:`${name}`,SX_ZZS:'增值税'}[propertyTax]}`,
        STATE_YYWSR_WS:name,
        STATE_YYWSR_YS:name,
        STATE_YYWZC_WF:name,
        STATE_YYWZC_YF:name,
        STATE_ZS_SQ:'暂收款',
        STATE_ZS_TH:'暂收款退还',
        STATE_ZF_FC:'暂付款',
        STATE_ZF_SH:'暂付款收回',
        STATE_CQZC_WF:'购进资产支出',
        STATE_CQZC_YF:'购进资产支出',
        STATE_CQZC_ZJTX:'资产折旧摊销',
        STATE_CQZC_WS:'处置资产收入',
        STATE_CQZC_YS:'处置资产收入',
        STATE_CQZC_JZSY:'长期资产处置损益',
        STATE_JK_YS:'收到借款',
        STATE_JK_JTLX:'计提借款利息',
        STATE_JK_ZFLX:'支付借款利息',
        STATE_JK_YF:'偿还本金支出',
        STATE_TZ_YF:'对外投资支出',
        STATE_TZ_SRGL:'收到投资收益',
        STATE_TZ_JTGL:'计提投资收益',
        STATE_TZ_JTLX:'计提投资收益',
        STATE_TZ_SRLX:'收到投资收益',
        STATE_TZ_WS:'收回投资款',
        STATE_TZ_YS:'收回投资款',
        STATE_ZB_ZZ:'增加注册资本',
        STATE_ZB_ZFLR:'支付分配利润',
        STATE_ZB_LRFP:'计提分配利润',
        STATE_ZB_JZ:'减少注册资本',

    }[runningState]
    dispatch(changeLrAccountCommonString('card','runningAbstract',runningAbstractDemo))
}

// 附件上传
export const getUploadGetTokenFetch = () => (dispatch, getState) => {
    // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	// fetchGlApi('uploadgettoken', 'GET', '', json => {
    //     // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	// 	showMessage(json) &&
	// 	// sessionStorage.setItem('uploadToken' ,json.data.token)
	// 	sessionStorage.setItem('token', json.data.token)
	// })
	const expire = getState().allState.get('expire')
	const now = Date.parse(new Date()) / 1000

	console.log(expire, now, expire < now + 300);
	if (expire < now + 300) {
		fetchGlApi('aliyunOssPolicy', 'GET', '', json => {
			// if (showMessage(json)) {
				dispatch({
					type: ActionTypes.AFTER_GET_UPLOAD_SIGNATURE,
					receivedData: json.data,
					code: json.code
				})
			// }
		})
	}
}
export const switchLoadingMask = () => ({
    type: ActionTypes.SWITCH_LOADING_MASK
})
export const uploadFiles = (PageTab, paymentType, name, files, callbackJson, isLast) => dispatch => {

	let fileArr = []

	fileArr.push({
		fileName: name,
		// thumbnail: callbackJson.data.enclosurePath,
		enclosurePath: callbackJson.data.enclosurePath,
		size: (callbackJson.data.size/1024).toFixed(2),
		imageOrFile: callbackJson.data.mimeType.toString().toUpperCase().indexOf('IMAGE') > -1 ? 'TRUE' : 'FALSE',
		label: "无标签",
		beDelete: false,
		mimeType: callbackJson.data.mimeType
	})
	fetchApi('insertEnclosure', 'POST', JSON.stringify({
		enclosureList: fileArr
	}), json => {
		if (showMessage(json)) {
			if (PageTab === 'business' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY') {
                dispatch({
                    type: ActionTypes.CHANGE_RUNNING_ENCLOSURE_LIST,
                    imgArr:json.data.enclosureList
                })
            } else {
                const setPlace = ({
                    'LB_JZCB': () => 'costTransferTemp',
                    'LB_FPRZ': () => 'invoiceAuthTemp',
                    'LB_KJFP': () => 'invoicingTemp',
                    'LB_ZCWJZZS': () => 'transferOutTemp',
                    'LB_ZZ': () => 'InternalTransferTemp',
                    'LB_ZJTX': () => 'DepreciationTemp'
                }[paymentType])();
                dispatch({
                    type: ActionTypes.CHANGE_CALCULATE_ENCLOSURE_LIST,
                    imgArr: json.data.enclosureList,
                    place: setPlace
                })
            }
        }
        if (isLast) {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
	})
    // upfile({
    //     file: files,   //文件，必填,html5 file类型，不需要读数据流，files[0]
    //     name: name, //文件名称，选填，默认为文件名称
    //     token: sessionStorage.getItem('token'),  //token，必填
    //     dir: dirUrl,  //目录，选填，默认根目录''
    //     retries: 0,  //重试次数，选填，默认0不重试
    //     maxSize: 10*1024*1024,  //上传大小限制，选填，默认0没有限制 10M
    //     mimeLimit: 'image/*', //image/jpeg
    //     insertOnly: 1,//0可覆盖  1 不可覆盖
    //     callback: function (percent, result) {
    //         // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    //         // percent（上传百分比）：-1失败；0-100上传的百分比；100即完成上传
    //         // result(服务端返回的responseText，json格式)
    //         // result = JSON.stringify(result);
    //         if (result.code == 'OK') {
    //             let fileArr=[];
    //             fileArr.push({
    //                 fileName:result.name,
    //                 thumbnail:result.url+'@50w_50h_90Q',
    //                 enclosurepath:result.url,
    //                 size:(result.fileSize/1024).toFixed(2),
    //                 imageOrFile:result.isImage.toString().toUpperCase(),
    //                 label:"无标签",
    //                 beDelete: false,
    //                 mimeType:result.mimeType
    //             })
    //             // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	//
    //             fetchApi('insertEnclosure','POST',JSON.stringify({
    //                 enclosureList: fileArr
    //             }), json => {
    //                 if (showMessage(json)) {
    //                     if(PageTab === 'business' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY') {
    //                         dispatch({
    //                             type: ActionTypes.CHANGE_RUNNING_ENCLOSURE_LIST,
    //                             imgArr:json.data.enclosureList
    //                         })
    //                     }else{
    //                         const setPlace = ({
    //                             'LB_JZCB': () => 'costTransferTemp',
    //                             'LB_FPRZ': () => 'invoiceAuthTemp',
    //                             'LB_KJFP': () => 'invoicingTemp',
    //                             'LB_ZCWJZZS': () => 'transferOutTemp',
    //                             'LB_ZZ': () => 'InternalTransferTemp',
    //                             'LB_ZJTX': () => 'DepreciationTemp'
    //                         }[paymentType])()
    //                         dispatch({
    //                             type: ActionTypes.CHANGE_CALCULATE_ENCLOSURE_LIST,
    //                             imgArr: json.data.enclosureList,
    //                             place: setPlace
    //                         })
    //                     }
    //                 }
    //                 if (index+1 === filesLength) {
    //                     dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    //                 }
    //                 // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    //             })
    //         } else if (result.code == 'InvalidArgument') {
    //             if (index+1 === filesLength) {
    //                 dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    //             }
    //             return message.error('上传失败，文件名中不能包含 \ : * ? " < > | ; ／等字符')
    //         }
	//
    //         if (percent === -1) {
    //             if (index+1 === filesLength) {
    //                 dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    //             }
    //             return message.error(result)
    //         }
	//
    //     }
    // })
}
export const deleteUploadFJUrl = (index,PageTab,paymentType) => (dispatch) => {
    if(PageTab === 'business' || paymentType === 'LB_GGFYFT'  || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY' ){
        dispatch({
            type: ActionTypes.DELETE_UPLOAD_FJ_URL,
            index
        })
    }else{
        const setPlace = ({
            'LB_JZCB': () => 'costTransferTemp',
            'LB_FPRZ': () => 'invoiceAuthTemp',
            'LB_KJFP': () => 'invoicingTemp',
            'LB_ZCWJZZS': () => 'transferOutTemp',
            'LB_ZZ': () => 'InternalTransferTemp',
			'LB_ZJTX': () => 'DepreciationTemp'
        }[paymentType] || (() => ''))();
        dispatch({
            type: ActionTypes.DELETE_CALCULATE_UPLOAD_FJ_URL,
            index,
            place: setPlace
        })
    }

}
//初始化标签
export const initLabel = () => dispatch => {
	fetchApi('initLsLabel', 'POST', '',json => {showMessage(json)})
}

//获取标签
export const getLabelFetch = (PageTab,paymentType) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    ;const setPlace = ({
        'LB_JZCB': () => 'costTransferTemp',
        'LB_FPRZ': () => 'invoiceAuthTemp',
        'LB_KJFP': () => 'invoicingTemp',
        'LB_ZCWJZZS': () => 'transferOutTemp',
        'LB_ZZ': () => 'InternalTransferTemp',
        'LB_ZJTX': () => 'DepreciationTemp'
    }[paymentType] || (() => ''))();
	fetchApi('getLsLabel', 'POST', '',json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(json)){
            (PageTab === 'business' || paymentType === '' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY')  ?
            dispatch({
                type: ActionTypes.GET_LS_LABEL_FETCH,
                receivedData: json
            }) :
            dispatch({
                type: ActionTypes.GET_CAL_LABEL_FETCH,
                receivedData: json,
                setPlace
            })
        }

        })
}

export const changeTagName = (index,value,PageTab,paymentType) => (dispatch) => {
    const setPlace = ({
        'LB_JZCB': () => 'costTransferTemp',
        'LB_FPRZ': () => 'invoiceAuthTemp',
        'LB_KJFP': () => 'invoicingTemp',
        'LB_ZCWJZZS': () => 'transferOutTemp',
        'LB_ZZ': () => 'InternalTransferTemp',
        'LB_ZJTX': () => 'DepreciationTemp'
    }[paymentType] || (() => ''))();
    if(PageTab === 'business' || paymentType === '' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_SFGL' || paymentType === 'LB_JZSY'){
        dispatch({
            type: ActionTypes.CHANGE_LS_TAG_NAME,
            index,
            value
        })
    }else{
        dispatch({
            type: ActionTypes.CHANGE_CAL_TAG_NAME,
            index,
            value,
            setPlace
        })
    }
}
export const getAssetsCleaningCategory = () => dispatch => {
    fetchApi('getAssetsCleaningCategory', 'POST', JSON.stringify({
        "type":"LB_JZSY"
    }), json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('Cqzc','assetsCategory',fromJS(json.data.result)))
        }
    })
}
export const getAssetsCarryoverList = (runningDate,categoryUuid) => dispatch => {
    fetchApi('getAssetsCarryoverList', 'POST', JSON.stringify({
        runningDate,
        categoryUuid
    }), json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('Cqzc',['detail','businessList'],fromJS(json.data.result)))
        }
    })
}
export const calculateGainForJzsy =  () => (dispatch, getState) => {
    const lrAccountState = getState().lrAccountState
    const CqzcTemp = lrAccountState.get('CqzcTemp')
    const detail = CqzcTemp.get('detail')
    const businessList = detail.get('businessList')
    const selectAmount = businessList.reduce((total,cur) => cur.get('beSelect')?total+(Number(cur.get('amount'))-Number(cur.get('tax'))):total,0)
    const depreciationAmount = CqzcTemp.getIn(['detail','acAssets','depreciationAmount'])
    const originalAssetsAmount = CqzcTemp.getIn(['detail','acAssets','originalAssetsAmount'])
    const loss = (Number(originalAssetsAmount) - Number(depreciationAmount)).toFixed(2)
    const diff = Math.abs(loss - selectAmount).toFixed(2)
    let place, deletePlace
    if (Number(loss) <= selectAmount ) {
     place =  ['CqzcTemp', 'detail', 'netProfitAmount']
     deletePlace = ['CqzcTemp', 'detail', 'lossAmount']
    } else {
     place =  ['CqzcTemp', 'detail', 'lossAmount']
     deletePlace = ['CqzcTemp', 'detail', 'netProfitAmount']
    }
    dispatch(changeLrAccountCommonString('Cqzc',['detail','amount'],selectAmount))
    if ((originalAssetsAmount || depreciationAmount) && selectAmount > 0 ) {
        dispatch({
          type:ActionTypes.CALCULATE_GAIN_OR_LOSS,
          deletePlace,
          place,
          diff
        })
    }
}
export const insertlrAccountJzsy = (saveAndNew) => (dispatch,getState) => {
    const lrAccountState = getState().lrAccountState
    const paymentInsertOrModify = lrAccountState.getIn(['flags','paymentInsertOrModify'])
    const CqzcTemp = lrAccountState.get('CqzcTemp')
    const detail = CqzcTemp.get('detail').toJS()
    const uuidList = lrAccountState.getIn(['flags','uuidList'])
    const oldEnclosureList = lrAccountState.get('enclosureList').toJS()
    const needDeleteUrl = lrAccountState.get('needDeleteUrl').toJS()
    const enclosureList = oldEnclosureList.concat(needDeleteUrl)
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`${paymentInsertOrModify}AssetsCleaning`, 'POST', JSON.stringify({
        ...detail,
        enclosureList
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            message.success('成功')
            if (saveAndNew) {
                dispatch({
                    type:ActionTypes.AFTER_INSERT_JZSY,
                    saveAndNew
                })
                dispatch(getAssetsCleaningCategory())
            } else {
              const { flowNumber, uuid } = json.data
              dispatch({
                  type:ActionTypes.AFTER_INSERT_JZSY,
                  saveAndNew,
                  flowNumber,
                  uuid
              })
              dispatch(getInitLraccountJzsy(fromJS({uuid:json.data.uuid}),uuidList))
            }

        }
    })
}
export const getJzsyProjectCardList = (projectRange) => (dispatch,getState) => {
    dispatch(changeLrAccountCommonString('Cqzc', ['detail','beProject'],true))
    dispatch(changeLrAccountCommonString('Cqzc', 'projectRange',projectRange))
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    fetchApi('getProjectCardList','POST',JSON.stringify({
        sobId,
        categoryList:projectRange,
        needCommonCard:false
    }), json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('Cqzc', 'projectList',fromJS(json.data.result)))
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
            dispatch(calculateGainForJzsy())
            if (json.data.beProject) {
                dispatch(getJzsyProjectCardList(json.data.projectRange))
            }
        }
    })
}
