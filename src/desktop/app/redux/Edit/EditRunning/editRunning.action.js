import * as ActionTypes from './ActionTypes.js'
import { showMessage, numberCalculate } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { toJS, is ,fromJS } from 'immutable'
import { message, Modal } from 'antd'
const confirm = Modal.confirm
import { getCategorynameByType } from 'app/containers/Edit/EditRunning/common/common'
import { editRunningTemp } from './template'
import * as allActions from 'app/redux/Home/All/all.action'
import fetch from 'isomorphic-fetch'
import { NotificationModal } from 'app/containers/components/NotificationModal'
import { notification } from 'antd'
import { XFNVERSION } from 'app/constants/fetch.constant.js'
import fetchApi from 'app/constants/fetch.account.js'
import { ROOTPKT } from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'

//选择流水类别
export const selectAccountRunningCategory = (uuid,isFresh) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if (uuid) {
        fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
				const name = json.data.result
				dispatch({
				type: ActionTypes.SELECT_EDIT_RUNNING_CATEGORY,
                    uuid,
                    name,
                    isFresh
				})
                dispatch(copyRunning(name))
                // if (beManagemented && (categoryType === 'LB_YYWSR' || categoryType === 'LB_YYWZC')) {
                //     const oriState = {
                //         LB_YYWSR:'STATE_YYWSR',
                //         LB_YYWZC:'STATE_YYWZC',
                //     }[categoryType]
                //     dispatch(getFirstContactsCardList(fromJS(contactsRange),oriState))
                // }
            }
        })
    } else {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    }

}

export const copyRunning = (name,isInsert) => dispatch => {
    const {categoryType, propertyPay, propertyCostList, propertyCost, propertyTax, assetType } = name
    const {
        propertyShow,
        categoryTypeObj,
        direction,
        showInvoice,
        isShowAbout,
    } = getCategorynameByType(categoryType)
    const beProject = name.beProject
    const projectRange = name.projectRange
    const beManagemented = name[categoryTypeObj].beManagemented
    const beAccrued = name[categoryTypeObj].beAccrued
    const beInAdvance = name[categoryTypeObj].beInAdvance
    const contactsRange = name[categoryTypeObj].contactsRange
    const stockRange = name[categoryTypeObj].stockRange
    const beWithholding = name[categoryTypeObj].beWithholding
    const beWithholdSocial = name[categoryTypeObj].beWithholdSocial
    const beWithholdTax = name[categoryTypeObj].beWithholdTax
    const beWelfare = name[categoryTypeObj].beWelfare
    if (beProject) {
        dispatch(getProjectCardList(projectRange))
    }
    let newOriState
    switch (name.categoryType) {
        case 'LB_FYZC':
            newOriState = 'STATE_FY'
            if (name.propertyCostList.length === 1 ) {
                dispatch(changeLrAccountCommonString('ori','propertyCost',name.propertyCostList[0]))
            }
            break
        case 'LB_ZSKX':
            newOriState = 'STATE_ZS_SQ'
            break
        case 'LB_ZFKX':
            newOriState = 'STATE_ZF_FC'
            break
        case 'LB_YYWSR':
            newOriState = 'STATE_YYWSR'
            break
        case 'LB_YYWZC':
            newOriState = 'STATE_YYWZC'
            break
        case 'LB_XCZC':
            if (name.propertyCostList.length === 1 ) {
                dispatch(changeLrAccountCommonString('ori','propertyCost',name.propertyCostList[0]))
            }
            if (beWithholding || beWithholdSocial) {
                dispatch(getJrPaymentAmountInfo(name.uuid))
            }
            if (beWithholdTax && name.propertyPay ==='SX_GZXJ') {
                dispatch(getJrPaymentTaxInfo(name.uuid))
            }
            if (name.propertyPay ==='SX_GZXJ' || name.propertyPay ==='SX_QTXC' || name.propertyPay ==='SX_FLF') {
                newOriState = 'STATE_XC_FF'
            } else {
                newOriState = 'STATE_XC_JN'
            }
            (beAccrued || beWelfare) && dispatch(getJrNotHandleList(name.uuid,'Payment'))
            break
        case 'LB_SFZC':
            newOriState = 'STATE_SF_JN'
            if (name.propertyTax === 'SX_ZZS') {
                dispatch(getJrVatPrepayList())
            }
            if (beInAdvance || beAccrued || name.propertyTax === 'SX_ZZS') {
                dispatch(getJrNotHandleList(name.uuid,'Vat'))
            }
            if (name.propertyTax === 'SX_GRSF') {
                dispatch(getJrPaymentTaxInfo(name.uuid))
            }
            break
        case 'LB_YYSR':
            newOriState = 'STATE_YYSR_XS'
            if (name.propertyCarryover === 'SX_HW' || name.propertyCarryover === 'SX_HW_FW' && stockRange.length) {
                dispatch(getStockCardList('STATE_YYSR_XS',stockRange))
                dispatch(getWarehouseCardList())
            }
            break
        case 'LB_YYZC':
            newOriState = 'STATE_YYZC_GJ'
            if (name.propertyCarryover === 'SX_HW' || name.propertyCarryover === 'SX_HW_FW' && stockRange.length) {
                dispatch(getStockCardList('STATE_YYZC_GJ',stockRange))
                dispatch(getWarehouseCardList())
            }
            break
        case 'LB_TZ':
            if (isInsert && (name.oriState === 'STATE_TZ_SRGL' || name.oriState ==='STATE_TZ_SRLX')) {
                dispatch(getJrNotHandleList(name.categoryUuid,'Invest'))
            }
            break
        case 'LB_JK':
            if (isInsert && name.oriState === 'STATE_JK_ZFLX') {
                dispatch(getJrNotHandleList(name.categoryUuid,'Loan'))
            }
            break
        case 'LB_ZB':
            if (isInsert && name.oriState === 'STATE_ZB_ZFLR') {
                dispatch(getJrNotHandleList(name.categoryUuid,'Capital'))
            }
            break
            default:
        }
         if (newOriState && !isInsert) {
             dispatch(changeLrAccountCommonString('ori','oriState',newOriState))
             dispatch(changeStateAndAbstract(fromJS(name),newOriState))
         }
}

//修改时选择流水类别
export const selectModifyRunningCategory = (uuid) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const oriState = getState().editRunningState.getIn(['oriTemp','oriState'])
    const propertyCost = getState().editRunningState.getIn(['oriTemp','propertyCost'])
    const preCategoryType = getState().editRunningState.getIn(['oriTemp','categoryType'])
    const accounts = getState().editRunningState.getIn(['oriTemp','accounts'])
    if (uuid) {
        fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
				const name = json.data.result
				dispatch({
				type: ActionTypes.SELECT_MODIFY_RUNNING_CATEGORY,
                    uuid,
                    name,
				})
                const {categoryType, propertyPay, propertyCostList, propertyCost, propertyTax, assetType } = name
                const {
                    propertyShow,
                    categoryTypeObj,
                    direction,
                    showInvoice,
                    isShowAbout,
                } = getCategorynameByType(categoryType)
				const beProject = name.beProject
                const projectRange = name.projectRange
                const propertyCarryover = name.propertyCarryover
                const beManagemented = name[categoryTypeObj].beManagemented
                const beAccrued = name[categoryTypeObj].beAccrued
                const beInAdvance = name[categoryTypeObj].beInAdvance
                const contactsRange = name[categoryTypeObj].contactsRange
                const stockRange = name[categoryTypeObj].stockRange || []
                const beWithholding = name[categoryTypeObj].beWithholding
                const beWithholdSocial = name[categoryTypeObj].beWithholdSocial
                const beWithholdTax = name[categoryTypeObj].beWithholdTax
                const beDeposited = name[categoryTypeObj].beDeposited
                const beWelfare = name[categoryTypeObj].beWelfare
                const isChangedCategroy = preCategoryType  !== categoryType
                dispatch(changeLrAccountCommonString('ori','stockCardList',fromJS([{}])))
                dispatch(changeLrAccountCommonString('ori','carryoverCardList',fromJS([])))
                if (propertyCarryover === 'SX_HW' || propertyCarryover === 'SX_HW_FW' && stockRange.length) {
                    dispatch(getStockCardList(`${categoryType === 'LB_YYSR'?'STATE_YYSR_XS':'STATE_YYZC_TG'}`,stockRange))
                    dispatch(getWarehouseCardList())
                }
                if (beProject) {
                    dispatch(getProjectCardList(projectRange))
                }
                let newOriState
                switch (name.categoryType) {
                    case 'LB_YYSR':
                        newOriState = isChangedCategroy?'STATE_YYSR_XS':oriState
                        break
                    case 'LB_YYZC':
                        newOriState = isChangedCategroy?'STATE_YYZC_GJ':oriState
                        break
                    case 'LB_YYWSR':
                        newOriState = 'STATE_YYWSR'
                        break
                    case 'LB_YYWZC':
                        newOriState = 'STATE_YYWZC'
                        break
                    case 'LB_ZSKX':
                        newOriState = isChangedCategroy?'STATE_ZS_SQ':oriState
                        break
                    case 'LB_ZFKX':
                        newOriState = isChangedCategroy?'STATE_ZF_FC':oriState
                        break
                    case 'LB_FYZC':
                        newOriState = isChangedCategroy?'STATE_FY':oriState
                        break
                        default:
                    }
                 if (newOriState) {
                     dispatch(changeLrAccountCommonString('ori','oriState',newOriState))
                     dispatch(changeStateAndAbstract(fromJS(name),newOriState))
                 }
                 if (propertyCost === 'XZ_FINANCE') {
                     dispatch(changeLrAccountCommonString('ori','propertyCost',''))
                 }
                 dispatch(changeLrAccountCommonString('ori','usedAccounts',false))
                 dispatch(changeLrAccountCommonString('ori','accounts',accounts.slice(0,1)))
            }
        })
    } else {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    }

}

export const changeModifyState = (oriState) => dispatch => {
    dispatch({
    type: ActionTypes.CHANGE_MODIFY_RUNNING_CATEGORY,
        oriState
    })
}
export const changeLrAccountCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
  if (place[0] === 'flags') {placeArr = place}
  dispatch({
    type: ActionTypes.CHANGE_EDIT_RUNNING_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}
export const changeEditOutCommonString = (place,value) => (dispatch) => {
    dispatch({
      type: ActionTypes.CHANGE_EDIT_RUNNING_COMMON_STRING,
      place,
      value
    })
}

export const changeStateAndAbstract = (oriTemp,oriState) => dispatch => {
    const propertyCarryover = oriTemp.get('propertyCarryover')
    const name = oriTemp.get('name')
    const propertyPay = oriTemp.get('propertyPay')
    const propertyTax = oriTemp.get('propertyTax')
    const oriAbstractDemo = {
        STATE_YYSR_DJ:'收到预收款',
        STATE_YYSR_XS:`${name}`,
        STATE_YYSR_TS:`${name}`,
        STATE_YYZC_DJ:'支付预付款',
        STATE_YYZC_GJ:`${name}`,
        STATE_YYZC_TG:`${name}`,
        STATE_FY_DJ:'支付预付款',
        STATE_FY:`${name}支出`,
        STATE_XC_JT:`计提${{SX_GZXJ:'工资薪金',SX_SHBX:'社会保险’公司’部分',SX_ZFGJJ:'住房公积金’公司’部分',SX_QTXC:name,SX_FLF:name}[propertyPay]}`,
        STATE_XC_FF:`${propertyPay === 'SX_FLF'?'支付':'发放'}${{SX_GZXJ:'工资薪金',SX_QTXC:name,SX_FLF:name}[propertyPay]}`,
        STATE_XC_JN:`缴纳${{SX_SHBX:'社会保险',SX_ZFGJJ:'住房公积金'}[propertyPay]}`,
        STATE_SF_YJZZS:'预缴增值税',
        STATE_SF_JN:`${{SX_QYSDS:'缴纳企业所得税',SX_GRSF:'代缴个人税费',SX_QTSF:`缴纳${name}`,SX_ZZS:'缴纳增值税'}[propertyTax]}`,
        STATE_SF_JT:`计提${{SX_QYSDS:'企业所得税',SX_GRSF:'个人税费',SX_QTSF:`${name}`,SX_ZZS:'增值税'}[propertyTax]}`,
        STATE_YYWSR:name,
        STATE_YYWZC:name,
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
        STATE_ZB_ZZ:'取得货币资本',
        STATE_ZB_ZFLR:'支付分配利润',
        STATE_ZB_LRFP:'计提分配利润',
        STATE_ZB_JZ:'减少注册资本',
        STATE_SF_ZCWJZZS:'转出未交增值税',
        STATE_ZB_ZBYJ:'资本溢价',

    }[oriState]
    dispatch(changeLrAccountCommonString('ori','oriAbstract',oriAbstractDemo))
}

export const changeLrAccountAccountName = (accountUuid, accountName,poundage) => ({
    type: ActionTypes.CHANGE_EDIT_RUNNING_ACCOUNT_NAME,
	accountUuid,
	accountName,
    poundage
})

export const getProjectCardList = (projectRange) => (dispatch,getState) => {
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
            dispatch(changeEditOutCommonString('projectList',fromJS(json.data.result)))
        }
    })
}

export const addProject = (projectCard,index) => dispatch => {
    let projectCardList = projectCard.toJS()
    projectCardList.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeLrAccountCommonString('ori','projectCardList',  fromJS(projectCardList)))
}

export const deleteProject = (projectCard,index,taxRate) => dispatch => {
    let projectCardList = projectCard.toJS()
    projectCardList.splice(index,1)
    dispatch(changeLrAccountCommonString('ori','projectCardList',  fromJS(projectCardList)))
    dispatch(autoCalculateProjectAmount())
    taxRate && dispatch(changeAccountTaxRate())
}

export const autoCalculateProjectAmount = () => (dispatch,getState) => {
    const projectCard = getState().editRunningState.getIn(['oriTemp','projectCardList'])
    let amount = projectCard.reduce((total,cur) => {
        const amount = Number(cur.get('amount')) ? Number(cur.get('amount')) : 0
        return total + amount
    },0)
    dispatch(changeLrAccountCommonString('ori','amount', amount.toFixed(2)))

}
export const autoCalculateStockAmount = () => (dispatch,getState) => {
    const stockCardList = getState().editRunningState.getIn(['oriTemp','stockCardList'])
    let amount = stockCardList.reduce((total,cur) => {
        const amount = cur.get('amount') && cur.get('amount')!=='.' ? Number(cur.get('amount')) : 0
        return  (total * 100 + amount * 100) / 100
    },0)
    dispatch(changeLrAccountCommonString('ori','amount', amount.toFixed(2)))

}

export const addStock = (stockCardList,index) => dispatch => {
    let stockCardListJ = stockCardList.toJS()
    stockCardListJ.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeLrAccountCommonString('ori','stockCardList',  fromJS(stockCardListJ)))
}
export const addCarrayover = (carryoverCardList,index) => dispatch => {
    let carryoverCardListJ = carryoverCardList.toJS()
    carryoverCardListJ.push({amount:'',uuid:'',index})
    dispatch(changeLrAccountCommonString('ori','carryoverCardList',  fromJS(carryoverCardListJ)))
}
export const addAccounts = (accounts,index) => dispatch => {
    let accountsJ = accounts.toJS()
    accountsJ.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeLrAccountCommonString('ori','accounts',  fromJS(accountsJ)))
}
export const deleteStock = (stockCardList,index,taxRate) => dispatch => {
    let stockCardListJ = stockCardList.toJS()
    stockCardListJ.splice(index,1)
    dispatch(changeLrAccountCommonString('ori','stockCardList', fromJS(stockCardListJ)))
    dispatch(autoCalculateStockAmount())
    taxRate && dispatch(changeAccountTaxRate())
}
export const deleteCarrayover = (carryoverCardList,index) => dispatch => {
    let carryoverCardListJ = carryoverCardList.toJS()
    carryoverCardListJ.splice(index,1)
    dispatch(changeLrAccountCommonString('ori','carryoverCardList', fromJS(carryoverCardListJ)))
}
export const deleteAccounts = (accounts,index) => dispatch => {
    let accountsJ = accounts.toJS()
    accountsJ.splice(index,1)
    dispatch(changeLrAccountCommonString('ori','accounts', fromJS(accountsJ)))
}
export const testCarrayover = (index,stockCard={},warehouseCard={},enableWarehouse) => (dispatch,getState) => {
    const carryoverCardList  = getState().editRunningState.getIn(['oriTemp','carryoverCardList']).toJS()
    if (enableWarehouse) {
        if (carryoverCardList.some((v,i) => warehouseCard.warehouseCardName === v.warehouseCardName && v.warehouseCardName !== '' && stockCard.cardUuid === v.cardUuid && v.cardUuid !== '')) {
            carryoverCardList.splice(index,1)
            dispatch(changeLrAccountCommonString('ori','carryoverCardList', fromJS(carryoverCardList)))
        } else {
            dispatch(changeLrAccountCommonString('ori', ['carryoverCardList',index], fromJS({...carryoverCardList[index],...stockCard,...warehouseCard})))
        }
    } else {
        if (carryoverCardList.some(v => stockCard.cardUuid === v.cardUuid && v.cardUuid !== '')) {
            carryoverCardList.splice(index,1)
            dispatch(changeLrAccountCommonString('ori','carryoverCardList', fromJS(carryoverCardList)))
        } else {
            dispatch(changeLrAccountCommonString('ori', ['carryoverCardList',index], fromJS({...carryoverCardList[index],...stockCard})))
        }
    }
}
//保存流水
export const saveRunningbusiness = (saveAndNew) => (dispatch, getState) => {
    const editRunningState = getState().editRunningState
	const homeState = getState().homeState
    // const accountConfState = getState().accountConfState
    // const insertOrModify = editRunningState.getIn(['flags', 'insertOrModify'])
    const enableWarehouse = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    let oriTemp = editRunningState.get('oriTemp')
	let flags = editRunningState.get('flags')
	let categoryType = oriTemp.get('categoryType')
	let oriState = oriTemp.get('oriState')
    let categoryUuid = oriTemp.get('categoryUuid')
	let propertyCarryover = oriTemp.get('propertyCarryover')
	let url = {
        LB_YYSR:`${insertOrModify}JrIncome`,
        LB_YYZC:`${insertOrModify}JrExpense`,
        LB_JK:`${insertOrModify}JrLoan`,
        LB_TZ:`${insertOrModify}JrInvest`,
        LB_ZB:`${insertOrModify}JrCapital`,
        LB_XCZC:`${insertOrModify}JrPayment`,
        LB_FYZC:`${insertOrModify}JrOutlay`,
        LB_SFZC:`${insertOrModify}JrTax`,
        LB_ZFKX:`${insertOrModify}JrTemporaryPay`,
        LB_ZSKX:`${insertOrModify}JrTemporaryReceipt`,
        LB_CQZC:`${insertOrModify}JrAssets`,
        LB_YYWZC:`${insertOrModify}JrNonOperatingExpenses`,
        LB_YYWSR:`${insertOrModify}JrNonOperatingIncome`,
    }[categoryType]
	const { categoryTypeObj } = getCategorynameByType(categoryType)
	let data = {}
	for (let key in editRunningTemp[categoryType][oriState]) {
		data[key] = oriTemp.toJS()[key]

	}
    if (insertOrModify==='modify') {
        data['oriUuid'] = oriTemp.toJS()['oriUuid']
        data['jrUuid'] = oriTemp.toJS()['jrUuid']
        data['jrIndex'] = oriTemp.toJS()['jrIndex']
        data['encodeType'] = oriTemp.toJS()['encodeType']
    }
    if (!oriTemp.get('beProject') && insertOrModify === 'insert') {
        data.usedProject = false
    }
    if (data.projectCardList && data.projectCardList.length) {
        data.projectCardList = data.projectCardList.filter(v => !!v.cardUuid)
    }
    if (data.billList && data.billList.length) {
        data.billList = data.billList.filter(v => !!v.billType)
    }
    if (data.stockCardList && data.stockCardList.length) {
        data.stockCardList = data.stockCardList.filter(v => !!v.cardUuid)
    }
    if (data.accounts && data.accounts.length) {
        data.accounts = data.accounts.filter(v => !!v.accountUuid)
    }
    if (insertOrModify=== 'insert' && data.carryoverCardList && data.carryoverCardList.length) {
        let newCarryoverCardList = []
        data.carryoverCardList.forEach((v,index) => {
            if (enableWarehouse && !newCarryoverCardList.some(w => w.warehouseCardUuid === v.warehouseCardUuid && w.warehouseCardUuid && w.cardUuid === v.cardUuid && w.cardUuid)) {
                newCarryoverCardList.push(data.carryoverCardList[index])
            } else if (!enableWarehouse && !newCarryoverCardList.some(w => w.cardUuid === v.cardUuid && v.cardUuid)) {
                newCarryoverCardList.push(data.carryoverCardList[index])
            }
        })
        data.carryoverCardList = newCarryoverCardList

    }

    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')
    data.enclosureList = enclosureList

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(url, 'POST', JSON.stringify({
        ...data,
    }), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(json.code !== 0) {
          message.info(json.code + ' ' + json.message)
        } else if (json.data.encodeType) {
            dispatch(initJrIndexModal(saveAndNew))
        } else {
          const { jrIndexList } = json.data
          if (insertOrModify==='modify') {
              message.success('保存成功')
          } else {
              message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
          }
          if (saveAndNew) {
              dispatch(selectAccountRunningCategory(categoryUuid))
          } else {
              let currentUuid
              if(insertOrModify === 'insert') {
                  currentUuid = json.data.oriUuid
              } else {
                  currentUuid = oriTemp.get('oriUuid')
              }
              dispatch(refreshRunningbusiness(currentUuid))
          }
        }

	})
}

export const initJrIndexModal = (saveAndNew) => (dispatch,getState) => {
    dispatch(changeLrAccountCommonString('',['flags','indexModal'], saveAndNew?2:1))
    const oriTemp = getState().editRunningState.get('oriTemp')
    const strongList = oriTemp.get('strongList')
    const carryoverStrongList = oriTemp.get('carryoverStrongList')
    const pendingStrongList = oriTemp.get('pendingStrongList')
    const billStrongList = oriTemp.get('billStrongList')
    const currentOriDate = oriTemp.get('currentOriDate')
    const oriDate = oriTemp.get('oriDate')
    ;(strongList.size || billStrongList.size || carryoverStrongList.size)&& currentOriDate.substr(0,7) < oriDate.substr(0,7)?
    dispatch(changeLrAccountCommonString('ori','encodeType','2'))
    :
    dispatch(changeLrAccountCommonString('ori','encodeType','1'))
}
export const refreshRunningbusiness = (uuid,fromCxls,uuidList,data,isInsert) => (dispatch,getState) => {
    const oriUuid = uuid || getState().editRunningState.getIn(['oriTemp','oriUuid'])
    const callBack = (data) => {
        const { oriState } = data.jrOri
        const { categoryType, beProject, propertyCarryover, propertyTax } = data.category
        if (typeof fromCxls === 'function') {
            fromCxls(oriState)
        }
        dispatch({
            type: ActionTypes.GET_JR_ORI,
            receivedData: data.jrOri,
            category:data.category,
            uuidList,
            isInsert
        })
        const {
            categoryTypeObj,
        } = getCategorynameByType(categoryType)
        const beInAdvance = data.category[categoryTypeObj].beInAdvance
        const stockRange = data.category[categoryTypeObj].stockRange
        if (beProject && !isInsert) {
            const projectRange = data.category.projectRange
            dispatch(getProjectCardList(projectRange))
        }
        switch (categoryType) {
            case 'LB_YYSR':
            case 'LB_YYZC':
                if ((propertyCarryover === 'SX_HW' || propertyCarryover === 'SX_HW_FW' && stockRange.length) && !isInsert) {
                    dispatch(getStockCardList(`${categoryType === 'LB_YYSR'?'STATE_YYSR_XS':'STATE_YYZC_TG'}`,stockRange))
                    dispatch(getWarehouseCardList())
                }
                break
            case 'LB_SFZC':
                if (beInAdvance && oriState === 'STATE_SF_JN' && !isInsert) {
                    dispatch(getJrVatPrepayList())
                }
                break
        }
    }
    if (data) {
        callBack(data)
    } else {
        if (!oriUuid) {
            dispatch(allActions.sendMessageToDeveloper({
                title: '获取单条流水',
                message: 'oriUuid不存在，function:refreshRunningbusiness',
                remark: '录入刷新或查询流水跳转录入流水',
            }))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getJrOri', 'GET', `oriUuid=${oriUuid}`, json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                callBack(json.data)
            }
         })
    }

}
export const changeStateInitOriTemp = (state) => ({
    type: ActionTypes.CHANGE_STATE_INIT_ORITEMP,
    state
})

export const getFirstContactsCardList = (contactsRange,oriState) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const propertyContacts = {
        STATE_YYSR_DJ:'PREIN',
        STATE_YYSR_XS:'NEEDIN',
        STATE_YYSR_TS:'NEEDIN',
        STATE_YYZC_DJ:'PREPAY',
        STATE_YYZC_TG:'NEEDPAY',
        STATE_YYZC_GJ:'NEEDPAY',
        STATE_FY_DJ:'PREPAY',
        STATE_FY:'NEEDPAY',
        STATE_CQZC_WF:'NEEDPAY',
        STATE_CQZC_YF:'NEEDPAY',
        STATE_CQZC_YS:'NEEDIN',
        STATE_CQZC_WS:'NEEDIN',
        STATE_YYWSR:'NEEDIN',
        STATE_YYWZC:'NEEDPAY',
        STATE_ZS_SQ:'NEEDIN',
        STATE_ZS_TH:'NEEDIN',
        STATE_ZF_FC:'NEEDPAY',
        STATE_ZF_SH:'NEEDPAY',
    }[oriState]
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getContactsCategoryList','POST', JSON.stringify({
            sobId,
            categoryList:contactsRange.toJS(),
            property:propertyContacts || 'NEEDPAY'
        }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('contactsList',  fromJS(json.data.result)))
                dispatch(changeLrAccountCommonString('',['flags','dropManageFetchAllowed'], false))
            }
        })
}
export const billChange = (billState) => (dispatch, getState) => {
    const editRunningState = getState().editRunningState
    const allState = getState().allState
    const taxRateTemp = allState.get('taxRate')
    const outputRate = taxRateTemp.get('outputRate')
    const payableRate = taxRateTemp.get('payableRate')
    const scale = taxRateTemp.get('scale')
    const amount = editRunningState.getIn(['oriTemp','amount']) || 0
    let taxRate
    if (scale === 'general') {
        taxRate = outputRate
    } else {
        taxRate = payableRate
    }
    let tax = (Number(amount) /(1 + Number(taxRate)/100) * Number(taxRate)/100).toFixed(2)
    dispatch({
    type: ActionTypes.CHANGE_EDIT_BILL_STATES,
    billState,
    taxRate,
    tax
    })
}

export const calculateGain =  (currentBillType) => (dispatch, getState) => {
    const editRunningState = getState().editRunningState
    const oriTemp = editRunningState.get('oriTemp')
    let amount = Number(oriTemp.get('amount')) || 0
    const tax = Number(oriTemp.getIn(['billList',0,'tax'])) || 0
    const billType = currentBillType ? currentBillType : oriTemp.getIn(['billList',0,'billType'])
    // const insertOrModify = editRunningState.getIn(['flags', 'insertOrModify'])
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    if (billType === 'bill_common' && insertOrModify === 'insert') {
        amount = (Number(amount) - Number(tax)).toFixed(2)
    }
    const originalAssetsAmount = oriTemp.getIn(['assets', 'originalAssetsAmount'])?oriTemp.getIn(['assets', 'originalAssetsAmount']):0// 资产原值
    const depreciationAmount = oriTemp.getIn(['assets', 'depreciationAmount'])?oriTemp.getIn(['assets', 'depreciationAmount']):0// 折旧累计
    const cleaningAmount = oriTemp.getIn(['assets', 'cleaningAmount']) // 清理费用
    const loss = (Number(originalAssetsAmount) - Number(depreciationAmount)).toFixed(2)
    const diff = Math.abs(loss - amount).toFixed(2)
    let place, deletePlace
    if (Number(loss) <= amount) {
        place =  ['oriTemp','assets','netProfitAmount']
        deletePlace = ['oriTemp','assets','lossAmount']
    } else if(Number(loss) > amount) {
        place =  ['oriTemp','assets','lossAmount']
        deletePlace = ['oriTemp','assets','netProfitAmount']
    }
    dispatch({
      type:ActionTypes.EDIT_CALCULATE_GAIN_OR_LOSS,
      deletePlace,
      place,
      diff

    })

}

export const getProjectAllCardList = (categoryList,modalName,leftNotNeed,currentPage=1,condition='') => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const editRunningState = getState().editRunningState
    const categoryType = editRunningState.getIn(['oriTemp','categoryType'])
    const oriState = editRunningState.getIn(['oriTemp','oriState'])
    const beAccrued = editRunningState.getIn(['oriTemp','beAccrued'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if(!leftNotNeed) {
        fetchApi('getProjectTreeList','POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('MemberList', fromJS(json.data.typeList)))
            }
        })
    }
    fetchApi('getProjectCardList','POST', JSON.stringify({
        sobId,
        categoryList,
        needCommonCard:true,
        needAssist:true,
        needMake:true,
        needIndirect:true,
        needMechanical:true,
        currentPage,
        condition,
        pageSize:Limit.CONFIG_PAGE_SIZE
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeEditOutCommonString('selectThingsList',  fromJS(json.data.result)))
            dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.result)))
            dispatch(changeLrAccountCommonString('', ['flags', modalName], true))
            dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
        }
    })
}

export const getProjectSomeCardList = (uuid,level,currentPage=1,condition='') =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (level == 1) {
        fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            categoryUuid:uuid,
            listByCategory:true,
            subordinateUuid:'',
            currentPage,
            condition,
            pageSize:Limit.CONFIG_PAGE_SIZE
        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditOutCommonString('selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
            }
        })
    } else {
        fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            subordinateUuid:uuid,
            listByCategory:false,
            categoryUuid:uuid,
            currentPage,
            condition,
            pageSize:Limit.CONFIG_PAGE_SIZE
        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditOutCommonString('selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
            }
        })
    }
}

export const changeAccountTaxRate = (value,amount) => ({
	type: ActionTypes.CHANGE_RUNNING_TAX_RATE,
	value,
    amount
})

export const getJrNotHandleList = (categoryUuid,type,oriDate,currentCardUuid) => (dispatch,getState) => {
    const oriDate = oriDate || getState().editRunningState.getIn(['oriTemp','oriDate'])
    currentCardUuid = currentCardUuid || ''
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getJr${type}NotHandleList`, 'GET','categoryUuid='+categoryUuid+'&oriDate='+oriDate+'&currentCardUuid='+currentCardUuid, json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('ori','pendingStrongList',fromJS(json.data.jrList)))
		}
	})
}

// 获取存货可选卡片
export const getStockCardList = (oriState,categoryList) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const property = {
        STATE_YYSR_XS:'4',
        STATE_YYSR_TS:'4',
        STATE_YYZC_TG:'5',
        STATE_YYZC_GJ:'5',
    }[oriState]
    if (property) {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getStockCategoryList','POST', JSON.stringify({
            sobId,
            categoryList,
            property
        }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('stockList',fromJS(json.data.result)))
            }
        })
    }
}

// 获取仓库可选卡片
export const getWarehouseCardList = (oriState,categoryList) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('canUseWarehouseCardTree','GET', '',json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('warehouseList',fromJS(json.data.cardList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'enableWarehouse'], json.data.enableWarehouse))
            }
        })
}

// 获取存货的选择里的类别和卡片
export const getInventoryAllCardList = (categoryList, modalName, leftNotNeed,currentPage=1,condition='') => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const editRunningState = getState().editRunningState
    const categoryType = editRunningState.getIn(['oriTemp','categoryType'])
    const oriState = editRunningState.getIn(['oriTemp','oriState'])
    if(!leftNotNeed) {
        fetchApi('getStockCardList', 'POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('MemberList', fromJS(json.data.typeList)))
            }
        })
    }
    const property = {
        STATE_YYSR_XS:'4',
        STATE_YYSR_TS:'4',
        STATE_YYZC_TG:'5',
        STATE_YYZC_GJ:'5',
    }[oriState]
    if (property) {
        fetchApi('getStockCategoryList', 'POST', JSON.stringify({
            sobId,
            categoryList,
            property,
            currentPage,
            condition,
            pageSize:Limit.CONFIG_PAGE_SIZE
        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('selectThingsList',  fromJS(json.data.result)))
                dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.result)))
                dispatch(changeLrAccountCommonString('', ['flags', modalName], true))
                dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

// 存货选择框里选择类别下的卡片
export const getInventorySomeCardList = (uuid,level,currentPage=1,condition='') =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    const editRunningState = getState().editRunningState
    const categoryType = editRunningState.getIn(['oriTemp','categoryType'])
    const oriState = editRunningState.getIn(['oriTemp','oriState'])

    const property = {
        STATE_YYSR_XS:'4',
        STATE_YYSR_TS:'4',
        STATE_YYZC_TG:'5',
        STATE_YYZC_GJ:'5',
    }[oriState]

    if (level == 1) {
        fetchApi('getRunningStockMemberList','POST', JSON.stringify({
            sobId,
            categoryUuid: uuid,
            listByCategory: true,
            subordinateUuid: '',
            property,
            currentPage,
            condition,
            pageSize:Limit.CONFIG_PAGE_SIZE
        }), json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditOutCommonString('selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
            }
        })
    } else {
        fetchApi('getRunningStockMemberList', 'POST', JSON.stringify({
            sobId,
            subordinateUuid: uuid,
            listByCategory: false,
            categoryUuid: '',
            property,
            currentPage,
            condition,
            pageSize:Limit.CONFIG_PAGE_SIZE
        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditOutCommonString('selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
            }
        })
    }
}
// 获取往来的选择里的类别和
export const getRelativeAllCardList = (categoryList, modalName, leftNotNeed,currentPage=1,condition='') => (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const editRunningState = getState().editRunningState
    // const categoryType = editRunningState.getIn(['oriTemp','categoryType'])
    const oriState = editRunningState.getIn(['oriTemp','oriState'])
    if(!leftNotNeed) {
        fetchApi('getContactsCardList', 'POST', JSON.stringify({
            sobId,
            categoryList,


        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('MemberList', fromJS(json.data.typeList)))
            }
        })
    }

    let property = {
        STATE_YYSR_DJ:'PREIN',
        STATE_YYSR_XS:'NEEDIN',
        STATE_YYSR_TS:'NEEDIN',
        STATE_YYZC_DJ:'PREPAY',
        STATE_YYZC_TG:'NEEDPAY',
        STATE_YYZC_GJ:'NEEDPAY',
        STATE_FY_DJ:'PREPAY',
        STATE_FY:'NEEDPAY',
        STATE_CQZC_WF:'NEEDPAY',
        STATE_CQZC_YF:'NEEDPAY',
        STATE_CQZC_YS:'NEEDIN',
        STATE_CQZC_WS:'NEEDIN',
        STATE_YYWSR:'NEEDIN',
        STATE_YYWZC:'NEEDPAY',
        STATE_ZS_SQ:'NEEDIN',
        STATE_ZS_TH:'NEEDIN',
        STATE_ZF_FC:'NEEDPAY',
        STATE_ZF_SH:'NEEDPAY',
    }[oriState]
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getContactsCategoryList','POST', JSON.stringify({
        sobId,
        categoryList,
        property:property || 'NEEDPAY',
        currentPage,
        condition,
        pageSize:Limit.CONFIG_PAGE_SIZE
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeEditOutCommonString('selectThingsList',  fromJS(json.data.result)))
            dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.result)))
            dispatch(changeLrAccountCommonString('', ['flags', modalName], true))
            dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
        }
    })
}

// 往来选择框里选择类别下的卡片
export const getRelativeSomeCardList = (uuid,level,currentPage=1,condition='') =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    const editRunningState = getState().editRunningState
    const categoryType = editRunningState.getIn(['oriTemp','categoryType'])
    const oriState = editRunningState.getIn(['oriTemp','oriState'])

    const property = {
        STATE_YYSR_DJ:'PREIN',
        STATE_YYSR_XS:'NEEDIN',
        STATE_YYSR_TS:'NEEDIN',
        STATE_YYZC_DJ:'PREPAY',
        STATE_YYZC_TG:'NEEDPAY',
        STATE_YYZC_GJ:'NEEDPAY',
        STATE_FY_DJ:'PREPAY',
        STATE_FY:'NEEDPAY',
        STATE_CQZC_WF:'NEEDPAY',
        STATE_CQZC_YF:'NEEDPAY',
        STATE_CQZC_YS:'NEEDIN',
        STATE_CQZC_WS:'NEEDIN',
        STATE_YYWSR:'NEEDIN',
        STATE_YYWZC:'NEEDPAY',
        STATE_ZS_SQ:'NEEDIN',
        STATE_ZS_TH:'NEEDIN',
        STATE_ZF_FC:'NEEDPAY',
        STATE_ZF_SH:'NEEDPAY',
    }[oriState]

    if (level == 1) {
        fetchApi('getRunningContactsMemberList', 'POST', JSON.stringify({
            sobId,
            categoryUuid: uuid,
            listByCategory: true,
            property,
            subordinateUuid:'',
            currentPage,
            condition,
            pageSize:Limit.CONFIG_PAGE_SIZE
        }), json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditOutCommonString('selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
            }
        })
    } else {
        fetchApi('getRunningContactsMemberList', 'POST', JSON.stringify({
            sobId,
            subordinateUuid: uuid,
            property,
            listByCategory: false,
            categoryUuid: '',
            currentPage,
            condition,
            pageSize:Limit.CONFIG_PAGE_SIZE
        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditOutCommonString('thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditOutCommonString('selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeLrAccountCommonString('', ['flags', 'pageCount'], json.data.pages))
            }
        })
    }
}

export const autoCalculateAmount = () => (dispatch,getState) => {
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    const pendingStrongList = getState().editRunningState.getIn(['oriTemp', 'pendingStrongList'])
    let totalNotHandleAmount = 0
    pendingStrongList && pendingStrongList.forEach(v => {if (v.get('beSelect')) {
            insertOrModify === 'modify'?
            totalNotHandleAmount += Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
            :
            totalNotHandleAmount += Number(v.get('notHandleAmount'))

        }
    })
    dispatch({
      type:ActionTypes.EDIT_RUNNING_CALCULATE_AMOUNT,
      insertOrModify,
      totalNotHandleAmount
    })
}

export const getYyszPreAmount = ({oriDate,oriState,cardUuid,categoryUuid}) => (dispatch,getState) => {
    const oriTemp = getState().editRunningState.get('oriTemp')
    const newOriDate = oriDate || oriTemp.get('oriDate')
    const newOriState = oriState || oriTemp.get('oriState') || 'STATE_YYSR_XS'
    const newCardUuid = cardUuid || ''
    const newCategoryUuid = categoryUuid || oriTemp.get('categoryUuid')
    fetchApi('getYyszPreAmountInfo','GET','oriDate='+newOriDate+'&oriState='+newOriState+'&cardUuid='+newCardUuid+'&categoryUuid='+newCategoryUuid
    ,json => {
        if (showMessage(json)) {
            const { preAmount, payableAmount } = json.data
            dispatch({
                type:ActionTypes.GET_PREAMOUNT_INFO,
                preAmount,
                payableAmount
            })
        }
    })
}

export const getJrVatPrepayList = (oriDate) => (dispatch,getState) => {
    const oriTemp = getState().editRunningState.get('oriTemp')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    const newOriDate = oriDate || oriTemp.get('oriDate')
    const oriUuid = oriTemp.get('oriUuid')
    const offsetAmount = oriTemp.get('offsetAmount')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getJrVatPrepayList','GET','oriDate='+newOriDate+'&oriUuid='+ (insertOrModify === 'modify' && offsetAmount > 0 ?oriUuid:'')
    ,json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const { notHandleAmount } = json.data
            if (!notHandleAmount) {
                dispatch(changeLrAccountCommonString('ori','offsetAmount',0))
            }
            dispatch(changeLrAccountCommonString('ori','dikouAmount',notHandleAmount))
        }
    })
}

export const getJrPaymentAmountInfo = (categoryUuid,oriDate) => (dispatch,getState) => {
    const oriTemp = getState().editRunningState.get('oriTemp')
    const newCategoryUuid = categoryUuid || oriTemp.get('categoryUuid')
    const newOriDate = oriDate || oriTemp.get('oriDate')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getJrPaymentAmountInfo','GET','oriDate='+newOriDate+'&categoryUuid='+newCategoryUuid
    ,json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const { accumulationAmount, socialSecurityAmount } = json.data
            dispatch(changeLrAccountCommonString('ori','accumulationAmount',accumulationAmount))
            dispatch(changeLrAccountCommonString('ori','socialSecurityAmount',socialSecurityAmount))
        }
    })
}
export const getJrPaymentTaxInfo = (categoryUuid,oriDate) => (dispatch,getState) => {
    const oriTemp = getState().editRunningState.get('oriTemp')
    const newCategoryUuid = categoryUuid || oriTemp.get('categoryUuid')
    const newOriDate = oriDate || oriTemp.get('oriDate')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getJrPaymentTaxInfo','GET','oriDate='+newOriDate+'&categoryUuid='+newCategoryUuid
    ,json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const { payableAmount } = json.data
            dispatch(changeLrAccountCommonString('ori','payableAmount',payableAmount))
        }
    })
}
export const getCostStockList = (oriDate,oriState,categoryUuid) => dispatch => {
    fetchApi('getCarryoverCard','GET',`oriDate=${oriDate}&oriState=${oriState}&categoryUuid=${categoryUuid}`,json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('', ['flags', 'costStockList'], fromJS(json.data.cardList)))
            dispatch(changeLrAccountCommonString('', ['flags', 'thingsList'], fromJS(json.data.cardList)))
            dispatch(changeLrAccountCommonString('', ['flags', 'selectThingsList'],  fromJS(json.data.cardList)))
        }
    })
}





export const chargeItemCheckboxCheck = (checked,item) => ({
    type: ActionTypes.COMMON_CHARGE_ITEM_CHECKBOX_SELECT,
    checked,
    item
})

export const chargeItemCheckboxCheckAll =  (checked,allList,thingsList) => dispatch => {
    allList.map(v => {
        const item = thingsList.find(w => w.get('uuid') === v.uuid).toJS()
        dispatch(chargeItemCheckboxCheck(checked,item))
    })
}

export const getTransferAmount = (oriDate) => (dispatch,getState) => {
    const oriDate = oriDate || getState().editRunningState.getIn(['oriTemp','oriDate'])
    fetchApi('getTransferAmount','GET', `oriDate=${oriDate}`, json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('ori','transferAmount' , fromJS(json.data.amount)))
        }
    })
}

export const calculateCurAmount = () => (dispatch,getState) => {
    const accounts = getState().editRunningState.getIn(['oriTemp','accounts'])
    let currentAmount = accounts.reduce((pre,cur) => pre+= Number(cur.get('amount') || 0),0)
        dispatch(changeLrAccountCommonString('ori','currentAmount' , currentAmount.toFixed(2)))
}

export const getPaymentCardList = (oriDate,categoryUuid) => dispatch => {
    fetchApi('getPaymentCardList','GET', `oriDate=${oriDate}&categoryUuid=${categoryUuid}`, json => {
        if (showMessage(json)) {
            dispatch(changeEditOutCommonString('contactsList',  fromJS(json.data.cardList)))
        }
    })

}

export const getPaymentManageList = (oriDate,cardUuidList=[],condition='') => (dispatch,getState) => {
    const categoryUuid = getState().editRunningState.getIn(['oriTemp','categoryUuid'])
    fetchApi('getPaymentManageList','POST',  JSON.stringify({
        oriDate,
        cardUuidList,
        condition,
        categoryUuidList:[categoryUuid],
        currentPage:1,
        pageSize:Limit.CONFIG_PAGE_SIZE
    }), json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('ori','pendingStrongList',  fromJS(json.data.pendingManageList)))
            dispatch(changeLrAccountCommonString('ori','condition',  condition))
        }
    })
}
export const getAccountRunningCate = (uuid) => (dispatch,getState) => {
    fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
        if (showMessage(json)) {
            const accountProjectRange = json.data.result.projectRange
            const accountContactsRange = json.data.result.acCost.contactsRange
            dispatch(changeLrAccountCommonString('',['flags','accountProjectRange'] ,fromJS(accountProjectRange)))
            dispatch(changeLrAccountCommonString('',['flags','accountContactsRange'] , fromJS(accountContactsRange)))
        }
    })
}
export const getAccountContactsCardList = (contactsRange) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const categoryType = getState().editRunningState.getIn(['oriTemp','categoryType'])
    const { categoryTypeObj } = getCategorynameByType(categoryType)
    const oldContactsRange = getState().editRunningState.getIn(['oriTemp',categoryTypeObj,'contactsRange']) || fromJS([])
    const currentCardList = getState().editRunningState.getIn(['oriTemp','currentCardList']) || fromJS([])
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getContactsCategoryList','POST', JSON.stringify({
            sobId,
            categoryList:contactsRange.toJS(),
            property:'NEEDPAY'
        }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('',['flags','accountContactsRangeList'], fromJS(json.data.result)))
                if (oldContactsRange.some(v => contactsRange.some(w => w === v))) {
                    dispatch(changeLrAccountCommonString('ori','poundageCurrentCardList',currentCardList.size?currentCardList:fromJS([{}])))
                } else {
                    dispatch(changeLrAccountCommonString('ori','poundageCurrentCardList',fromJS([{}])))
                }
            }
        })
}

export const getAccountProjectCardList = (projectRange) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const oldProjectRange = getState().editRunningState.getIn(['oriTemp','projectRange']) || fromJS([])
    const projectCardList = getState().editRunningState.getIn(['oriTemp','projectCardList'])
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
            dispatch(changeLrAccountCommonString('',['flags','accountProjectList'], fromJS(json.data.result)))
            if (oldProjectRange.some(v => projectRange.some(w => w === v))) {
                dispatch(changeLrAccountCommonString('ori','poundageProjectCardList',projectCardList.size?projectCardList:fromJS([{}])))
            } else {
                dispatch(changeLrAccountCommonString('ori','poundageProjectCardList',fromJS([{}])))
            }
        }
    })
}

export const changeCommonChargeInvnetory = (oldInventoryCardList,selectItem) => (dispatch, getState) => {
    let newSelectItem = selectItem.toJS()
    const oriDate = getState().editRunningState.getIn(['oriTemp','oriDate'])
     newSelectItem = newSelectItem.map((item,i) => {
        item.cardUuid = item.uuid
        if (item.unitPriceList && item.unitPriceList.length) {
            let unitUuid = '', unitName = ''
            if (item.unit.uuid === item.unitPriceList[0].unitUuid) {
                unitName = item.unit.name
                unitUuid = item.unit.uuid
            } else {
                item.unit.unitList.map(v => {
                    if (v.uuid === item.unitPriceList[0].unitUuid) {
                        unitName = v.name
                        unitUuid = v.uuid
                    }
                })
            }
            Object.assign(item,{
                    price:item.unitPriceList[0].defaultPrice,
                    unitUuid:unitUuid,
                    unitName:unitName
                })
        } else if (item.unit && !item.unit.unitList.length) {
                Object.assign(item,{
                    unitUuid:item.unit.uuid,
                    unitName:item.unit.name
                })
        }
        return item
    })
    const stockCardList = fromJS(oldInventoryCardList.concat(fromJS(newSelectItem)))
    dispatch(changeLrAccountCommonString('ori', 'stockCardList', stockCardList))
    dispatch(changeLrAccountCommonString('ori', 'carryoverCardList', fromJS(oldInventoryCardList.concat(fromJS(newSelectItem)))))
    dispatch(getStockCardPrice(oriDate,oldInventoryCardList.toJS().concat(newSelectItem).map(v => {v.storeUuid=v.warehouseCardUuid;return v}),stockCardList))

}

export const getCarryoverCategory = (oriDate) => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    if (oriDate) {
        fetchApi('getCarryoverCategory', 'POST', JSON.stringify({
            oriDate,
            oriState:'STATE_YYSR_ZJ',
        }), json => {
            if (showMessage(json)) {
                dispatch(changeLrAccountCommonString('',['flags','carryoverCategoryList'], fromJS(json.data.categoryList)))
            }
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        })
    }
}

export const getCarrayProjectCardList = (projectRange,projectCardList) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectCardList','POST',JSON.stringify({
        sobId,
        categoryList:projectRange,
        needCommonCard:true,
        needAssist:true,
        needMake:true,
        needIndirect:true,
        needMechanical:true,
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            if (json.data.result.some(v => v.uuid === projectCardList.getIn([0,'cardUuid']))) {
                const cardUuid = projectCardList.getIn([0,'cardUuid'])
                const name = projectCardList.getIn([0,'name'])
                const code = projectCardList.getIn([0,'code'])
                dispatch(changeLrAccountCommonString('ori','carryoverProjectCardList',fromJS([{ cardUuid, name, code}])))
            } else {
                dispatch(changeLrAccountCommonString('ori','carryoverProjectCardList',fromJS([{}])))
            }
            dispatch(changeLrAccountCommonString('ori','usedCarryoverProject',true))
            dispatch(changeLrAccountCommonString('',['flags','carryoverProjectList'], fromJS(json.data.result)))
        }
    })
}

export const getFileUploadFetch = (form,categoryUuid,oriDate,close) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    let source = 'source=desktop'
    let network = 'network=wifi'
    const psiSobId = `psiSobId=${sessionStorage.getItem('psiSobId')}`
	const psiCorpId = `psiCorpId=${sessionStorage.getItem('corpId')}`

	const isPlayStr = `isPlay=${global.isPlay}`
	const version = `version=${XFNVERSION}`
	const timestamp = `timestamp=${new Date().getTime()}`
    categoryUuid = 'categoryUuid=' + categoryUuid
    const newOriDate = 'oriDate=' + oriDate
	let ssid = `ssid=''`

	if (global.isInWeb) {
		source = 'source=webDesktop'
	}

	if (global.ssid) {
		ssid = `ssid=${global.ssid}`
	}
    const url = `${ROOTPKT}/data/import/stock/with/insert` + '?' + [network, source, psiSobId, version, timestamp, isPlayStr, ssid, categoryUuid, newOriDate].join('&')
    const option = {
        method: 'POST',
        credentials: 'include',
        body: form
    }
	fetch(url, option)
	.then(res => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (res.status === 200) {
            return res.json()
		} else {
			return {
				code: '-2',
				message: `通信异常，服务器返回码${res.status}`
			}
		}

	})
    .then(json => {
        if (json.code === 1) {
            notification.open({
                key: 'errNotification',
                message: '系统发生了未知错误',
                placement: 'bottomRight',
                duration: null,
                description: NotificationModal(url, '200', json.code, json.message),
            });
        } else {
            if (showMessage(json)) {
                dispatch(getStockCardPrice(oriDate,json.data.importList.map(v =>{
                    v.storeUuid = v.warehouseCardUuid
                    v.cardUuid = v.inventoryUuid
                    return v;
                    }),fromJS(json.data.importList)))
                dispatch({
                    type: ActionTypes.AFTER_INVENTORY_IMPORT,
                    receivedData:json
                    })
            } else {
                close && close()
            }
            }
        })
	.catch(err => {
		return {
			code: '-2',
			message: `系统无响应`
		}
	})
}

export const getStockCardPrice = (oriDate,stockPriceList) => (dispatch,getState) => {
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    if (insertOrModify === 'modify')return;
    stockPriceList = stockPriceList.map(v => ({
        cardUuid:v.cardUuid,
        storeUuid:v.storeUuid,
        assistList:v.assistList || [],
        batchUuid:v.batchUuid,
        }))
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
        oriDate,
        stockPriceList
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            let stockNameList = []
            dispatch({
                type: ActionTypes.CHANGE_PRICE_LIST,
                data:json.data,
                stockPriceList,
            })
        }
    })
}
export const saveDefaultPrice = (inventory,stockRange,oriState) => (dispatch,getState) => {
    fetchApi('saveDefaultPrice','POST',JSON.stringify({
        ...inventory
        }), json => {
            if (showMessage(json,'show')) {
                const stockCardList = getState().editRunningState.getIn(['oriTemp','stockCardList']).toJS()
                dispatch(getStockCardList(oriState,stockRange))
                let newStockCardList = stockCardList.map((v,i) => {
                    if (i === inventory.index) {
                        const item = inventory.defaultPriceList.find(w => w.unitUuid === v.unitUuid) || {}
                        const price =  item.defaultPrice || 0
                        v.price = price
                        if (v.quantity > 0) {
                            v.amount = price * v.quantity
                        }
                    }
                    return v
                    })
                dispatch(changeLrAccountCommonString('ori', 'stockCardList', fromJS(newStockCardList)))
                dispatch(autoCalculateStockAmount())

            }
        })
}

export const getInSerialList = (item,oriUuid,oriState,cb) => (dispatch,getState) => {
    const inventoryUuid = item.get('cardUuid')
    const warehouseUuid = item.get('warehouseCardUuid')
    const assistList = (item.toJS().assistList || []).map(v => ({propertyUuid:v.propertyUuid}))
    const batchUuid = item.get('batchUuid')
    let isPre = false
    if (oriUuid && oriState === 'STATE_YYSR_XS') {
        isPre = true
    }
    fetchApi('getInSerialList','POST',JSON.stringify({inventoryUuid,warehouseUuid,assistList,batchUuid,oriUuid,isPre}),json => {
        if (showMessage(json)) {
            cb && cb(json.data)
            dispatch(changeLrAccountCommonString('',['flags','serialList'],fromJS(json.data)))
        }
    })
}

export const getBatchList = (item) => (dispatch,getState) => {
    const inventoryUuid = item.get('cardUuid')
    fetchApi('getBatchList','POST',JSON.stringify({
        inventoryUuid
        }),json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('',['flags','batchList'],fromJS(json.data.batchList)))

        }
    })
}

export const insertBatch= (batch,productionDate,expirationDate,inventoryUuid='',cb) => (dispatch,getState) => {
        fetchApi('insertBatch','POST',JSON.stringify({
            batch,
            productionDate,
            inventoryUuid,
            expirationDate
            }),json => {
                if(showMessage(json,'show')) {
                    const {
                        batch,
                        batchUuid,
                        expirationDate
                    } = json.data
                    cb && cb(batch, batchUuid, expirationDate)
                }
            })
}

export const getSerialList = (item,index,oriState,cb) => (dispatch,getState) => {
    const inventoryUuid = item.get('cardUuid')
    const jrOriCardUuid = item.get('jrOriCardUuid')
    let objStr = {
        STATE_YYSR_XS:'preOutJrOriCardUuid',
        STATE_YYZC_TG:'outJrOriCardUuid',
        STATE_YYSR_TS:'preInJrOriCardUuid',
        STATE_YYZC_GJ:'inJrOriCardUuid'
    }[oriState] || 'inJrOriCardUuid'
    if (!jrOriCardUuid) {
        cb && cb()
        return;
    }
    fetchApi('getSerialList','POST',JSON.stringify({inventoryUuid,[objStr]:jrOriCardUuid}),json => {
        if (showMessage(json)) {
            dispatch(changeLrAccountCommonString('ori',['stockCardList',index,'serialList'],fromJS(json.data)))
            cb && cb()
        }
    })
}

export const insertAssist = (classificationUuid,name,inventoryUuid,placeArr,cb) => dispatch => {
    fetchApi('insertAssist','POST',JSON.stringify({
        name,
        classificationUuid,
        inventoryUuid
        }),json => {
            if(showMessage(json,'show')) {
                cb && cb()
                dispatch(changeLrAccountCommonString('ori',placeArr,fromJS(json.data)))
                // dispatch(configCallbackActions.getInventoryCardListForchangeConfig())
            }
        })
}

 export const modifyBatch = (batch,batchUuid,productionDate,expirationDate,inventoryUuid,cb) => (dispatch,getState) => {
    fetchApi('batchUsedCheck','GET',`inventoryUuid=${inventoryUuid}&batchUuid=${batchUuid}`,json => {
            if(showMessage(json)) {
                if (json.data.used) {
                    Modal.confirm({
                        title:'提示',
                        content:'原批次在期初值或流水中已被使用，修改后所有信息将同步修改。确认更改该批次的信息吗？',
                        className:'inventory-are-for-dom',
                        onOk() {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            fetchApi('modifyBatch','POST',JSON.stringify({
                                batch,
                                productionDate,
                                inventoryUuid,
                                batchUuid,
                                expirationDate
                                }),json => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if(showMessage(json,'show')) {
                                        cb && cb()
                                        dispatch(changeLrAccountCommonString('',['flags','batchList'],fromJS(json.data.batchList)))
                                    }
                            })
                        }
                    })
                } else {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    fetchApi('modifyBatch','POST',JSON.stringify({
                        batch,
                        productionDate,
                        inventoryUuid,
                        batchUuid,
                        expirationDate
                        }),json => {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            if(showMessage(json,'show')) {
                                cb && cb()
                                dispatch(changeLrAccountCommonString('',['flags','batchList'],fromJS(json.data.batchList)))
                            }
                    })
                }
            }
        })
}
