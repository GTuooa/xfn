import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
// import fetchGlApi from 'app/constants/fetch.constant.js'
import { showMessage, jsonifyDate } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { toJS, fromJS } from 'immutable'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

export const getPeriodCalculateList = (issuedate, main = 'manages', getPeriod, categoryUuid, isCheck) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	dispatch(getAccountObjectList(issuedate))
	const isCheck = false
		fetchApi('getManageList', 'POST', JSON.stringify({
				year: issuedate ? issuedate.substr(0, 4) : '',
				month: issuedate ? issuedate.substr(6, 2) : '',
				categoryUuid: '',
				cardUuid:'',
				isCheck: false,
				getPeriod
		}), json => {
				if (showMessage(json)) {
			// const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const openedissuedate = dispatch(allActions.AccountTableGetPeriod(json)) //修改流水账的账期

			const issuedateNew = issuedate ? issuedate : openedissuedate
			// const issues = dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson))
			dispatch({
				type: ActionTypes.GET_CALCULATE_LIST,
				receivedData: json.data.result,
				period: json.data.periodDtoJson,
				// issuedate: issuedateNew,//暂未用到
				issuedate: '',//暂未用到
				// issues,
				getPeriod: "true",
				isCheck: false,
				categoryUuid: '',
				// assId: '',
				// assCategory: '',
				isCheck: false,
				searchType:'SEARCH_TYPE_DATE',
				accountingType: main

			})
				}
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		})

}
// 收付管理
export const getCalculateList = (issuedate, main = 'manages', getPeriod, categoryUuid, cardUuid, isCheck,searchContent='',preventGetTree) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const calculationState = getState().calculationState
	let searchType = searchContent ? calculationState.getIn(['flags','searchType']) : ''
	main = main ? main :  calculationState.getIn(['flags','accountingType'])
	isCheck = isCheck === true || isCheck === false ? isCheck : false
	// if(main === 'manages'){
		fetchApi('getManageList', 'POST', JSON.stringify({
				year: issuedate ? issuedate.substr(0, 4) : '',
				month: issuedate ? issuedate.substr(6, 2) : '',
				categoryUuid: categoryUuid ? (categoryUuid === '全部' ? '' : categoryUuid) :  calculationState.getIn(['flags','categoryUuid']),
				cardUuid,
				isCheck,
				getPeriod:'',
				searchType,
				searchContent
		}), json => {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				if (showMessage(json)) {
					searchType = searchType == '' ? 'SEARCH_TYPE_DATE' : searchType
					// const issues = dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson))
					dispatch({
						type: ActionTypes.GET_CALCULATE_LIST,
						receivedData: json.data.result,
						period: json.data.periodDtoJson,
						issuedate,
						// issues,
						getPeriod: "",
						isCheck,
						searchType,
						curCategory: categoryUuid,
						accountingType: main
					})
				}
		})
	// }else{
	// 	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	// }
	if(!preventGetTree){
		dispatch(getManageCategoryListInfo('',cardUuid,isCheck))
	}
}
// 开具发票
export const getCalculateInvoicingList = (runningDate = '',categoryUuid='', billMakeOutType='',searchContent='',preventGetTree) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const calculationState = getState().calculationState
	let searchType = searchContent ? calculationState.getIn(['flags','searchType']) : ''
		fetchApi('getBusinessMakeoutList', 'POST', JSON.stringify({
				runningDate:'',
				categoryUuid: categoryUuid ? (categoryUuid === '全部' ? '' : categoryUuid) :  calculationState.getIn(['flags','categoryUuid']),
				billMakeOutType,
				searchType,
				searchContent
		}), json => {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				if (showMessage(json)) {
					searchType = searchType == '' ? 'SEARCH_TYPE_DATE' : searchType
					dispatch({
						type: ActionTypes.GET_CALCULATE_INVOICING_LIST,
						receivedData: json.data.result,
						curCategory: categoryUuid,
						billMakeOutType,
						searchType,
						runningDate
					})
				}
		})
if(!preventGetTree){
		dispatch(getMakeoutCategoryListInfo('',billMakeOutType))
	}
}
// 发票认证
export const getCalculateCertificationList = (runningDate = '',categoryUuid='', billAuthType='',searchContent='',preventGetTree) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const calculationState = getState().calculationState
	let searchType = searchContent ? calculationState.getIn(['flags','searchType']) : ''
		fetchApi('getBusinessAuthList', 'POST', JSON.stringify({
				runningDate:'',
				categoryUuid: categoryUuid ? (categoryUuid === '全部' ? '' : categoryUuid) :  calculationState.getIn(['flags','categoryUuid']),
				billAuthType,
				searchType,
				searchContent
		}), json => {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				if (showMessage(json)) {
					searchType = searchType == '' ? 'SEARCH_TYPE_DATE' : searchType
					dispatch({
						type: ActionTypes.GET_CALCULATE_CERTIFICATE_LIST,
						receivedData: json.data.result,
						curCategory: categoryUuid,
						billAuthType,
						searchType,
						runningDate
					})
				}
		})
if(!preventGetTree){
		dispatch(getAuthCategoryListInfo('',billAuthType))
	}
}
// 成本结转
export const getCalculateCarryoverList = (runningDate = '', runningState='',searchContent='',preventGetTree,cardUuid='') => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	dispatch(getFirstStockCardList(runningDate,runningState))
	const calculationState = getState().calculationState
	let cardUuidList = cardUuid === '' ? [] :[cardUuid]
	let searchType = searchContent ? calculationState.getIn(['flags','searchType']) : ''
		fetchApi('getCarryoverList', 'POST', JSON.stringify({
				runningDate:'',
				runningState,
				searchType,
				searchContent,
				cardUuidList
		}), json => {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				if (showMessage(json)) {
					searchType = searchType == '' ? 'SEARCH_TYPE_DATE' : searchType
					dispatch({
						type: ActionTypes.GET_CALCULATE_COST_LIST,
						receivedData: json.data.result,
						runningState,
						searchType,
						runningDate
					})
				}
		})
if(!preventGetTree){
		dispatch(getCostCategoryListInfo('',runningState))
	}
}
// 收付管理类别
export const getManageCategoryListInfo = (runningDate='',cardUuid = '',isCheck=false) => (dispatch, getState) => {
	fetchApi('getRunningManageCategory', 'POST', JSON.stringify({
     runningDate,
      cardUuid,
      isCheck
  }), json => {
    if (showMessage(json)) {
      dispatch({
        type: ActionTypes.GET_MANAGE_CATEGORY_DETAIL,
        receivedData: json.data,
		isCheck
      })
    }
  })
}
// 开具发票类别
export const getMakeoutCategoryListInfo = (runningDate='',billMakeOutType='') => (dispatch, getState) => {
	fetchApi('getRunningMakeoutCategory', 'POST', JSON.stringify({
     runningDate,
     billMakeOutType
  }), json => {
    if (showMessage(json)) {
      dispatch({
        type: ActionTypes.GET_MANAGE_CATEGORY_DETAIL,
        receivedData: json.data
      })
    }
  })
}
// 发票认证类别
export const getAuthCategoryListInfo = (runningDate='',billAuthType='') => (dispatch, getState) => {
	fetchApi('getRunningAuthCategory', 'POST', JSON.stringify({
     runningDate,
     billAuthType
  }), json => {
    if (showMessage(json)) {
      dispatch({
        type: ActionTypes.GET_MANAGE_CATEGORY_DETAIL,
        receivedData: json.data
      })
    }
  })
}
// 成本结转类别
export const getCostCategoryListInfo = (runningDate='',runningState='') => (dispatch, getState) => {
	fetchApi('getRunningCarryoverCategory', 'POST', JSON.stringify({
     runningDate,
     runningState
  }), json => {
    if (showMessage(json)) {
      dispatch({
        type: ActionTypes.GET_MANAGE_CATEGORY_DETAIL,
        receivedData: json.data
      })
    }
  })
}


export const getAccountObjectList = (issuedate) => dispatch => {
	// cnost year = issuedate ? issuedate.substr(0, 4) : '',
	// cnost month= issuedate ? issuedate.substr(6, 2) : '',
	// const data  = issuedate ?
	fetchApi('getBusinessManagerCardList', 'POST',JSON.stringify({
	}),json => {
		if (showMessage(json)) {
			dispatch(changeCalculateCommonString('calculate', 'cardList', fromJS(json.data.cardList)))
			if(json.data.categoryList){
				dispatch(changeCalculateCommonString('calculate', 'typeList', fromJS(json.data.categoryList)))
			}
			// dispatch(changeCalculateCommonString('calculate', 'acList', fromJS(json.data.acList)))
		}
	})
}
export const getFirstStockCardList = (runningDate,runningState) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    fetchApi('getCostStock','POST', JSON.stringify({
        runningDate,
		runningState
    }),json => {
        if (showMessage(json)) {
            dispatch(changeCalculateCommonString('calculate','stockThingsList',  fromJS(json.data.result)))
        }
    })

}

export const changeCalculateCommonString = (tab, place, value) => (dispatch) => {
  let placeArr = typeof place === 'string'?[`${tab}Temp`,place]:[`${tab}Temp`, ...place]
  if(place[0] === 'flags') {placeArr = place}
  dispatch({
    type: ActionTypes.CHANGE_CALCULATE_COMMON_STRING,
    tab,
    placeArr,
    value
  })

}

export const changeSearchType = (placeArr,value) => dispatch => {
	switch(value){
		case 'manages' :
			dispatch(getCalculateList())
			dispatch(changeSearchType(['calculateTemp', 'usedCard'], fromJS({name:'',code:'全部'})))
			break
		case 'invoicing':
			dispatch(getCalculateInvoicingList())
			break
		case 'certification':
			dispatch(getCalculateCertificationList())
			break
		case 'costTransfer':
			dispatch(getCalculateCarryoverList())
			dispatch(changeSearchType(['calculateTemp', 'stockCard'], fromJS({name:'',code:'全部'})))
			break
		default:
	}
	dispatch({
		type: ActionTypes.CHANGE_TYPE_OF_SEARCH,
    placeArr,
    value
	})
}

// 为了增删改后页面的刷新
export const afterModifyAccountAllList = (getPeriod) => (dispatch, getState) => {

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

	const calculationState = getState().calculationState
	const issuedate = calculationState.getIn(['flags', 'issuedate'])
	const accountingType = calculationState.getIn(['flags', 'accountingType'])
	const categoryUuid = calculationState.getIn(['flags', 'curCategory'])
	const assId = calculationState.getIn(['calculateTemp','ass','assid'])
	const assCategory = calculationState.getIn(['calculateTemp','ass','asscategory'])
	const acId = calculationState.getIn(['calculateTemp','ass', 'acId'])
	const cardUuid = calculationState.getIn(['calculateTemp','cardUuid'])
  const isCheck = calculationState.getIn(['flags', 'isCheck'])
  const billMakeOutType = calculationState.getIn(['invoicingList', 'billMakeOutType'])
  const billAuthType = calculationState.getIn(['certificationList', 'billAuthType'])
  const runningState = calculationState.getIn(['costTransferList', 'runningState'])

	// dispatch(getAccountDimensionFetch(issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId))
	switch(accountingType){
		case 'manages' :
			dispatch(getCalculateList(issuedate, accountingType, 'true', categoryUuid,cardUuid, isCheck))
			break
		case 'invoicing':
			dispatch(getCalculateInvoicingList('', categoryUuid,billMakeOutType ))
			break
		case 'certification':
			dispatch(getCalculateCertificationList('', categoryUuid,billAuthType ))
			break
		case 'costTransfer':
			dispatch(getCalculateCarryoverList('',runningState))
			break
		default:
	}


}


export const changeAccountCommonString = (tab, place, value) => ({
    type: ActionTypes.CHANGE_ACCOUNT_COMMON_STRING,
    tab,
    place,
    value
})

export const changeAccountAccountName = (tab, placeUUid, placeName, value) => ({
    type: ActionTypes.CHANGE_ACCOUNT_ACCOUNT_NAME,
	tab,
	placeUUid,
	placeName,
    value
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

// 一键收付
export const oneClickPayment = (newRunning) => (dispatch, getState) => {

	const calculationState = getState().calculationState
	const selectList = calculationState.getIn(['flags', 'selectList'])
	const payManageList = calculationState.getIn(['payManageList', 'childList'])

	const assId = calculationState.getIn(['flags', 'assId'])
	const assCategory = calculationState.getIn(['flags', 'assCategory'])
	const acId = calculationState.getIn(['flags', 'acId'])

	const mediumAcAssList = calculationState.get('mediumAcAssList')
	let assList = ''

	if (acId) {
		mediumAcAssList.get('acList').forEach(v => {
			if (v.get('acId') === acId) {
				assList = v.get('acName')
			}
		})
	} else {
		mediumAcAssList.get('category').forEach(v => {
			if (v.get('category') === assCategory) {
				v.get('assList').forEach(w => {
					if (w.get('assId') === assId) {
						assList = w.get('assName')
					}
				})
			}
		})
	}

	let payList = fromJS([]) //支出列表
	let receivedList = fromJS([]) //收入列表
	let selectdetailList = fromJS([]) //勾选的列表（流水的详细信息）
	let uuidList = fromJS([])

	// 将勾选的
	payManageList.forEach(v => {
		if (selectList.indexOf(v.get('uuid')) > -1) {
			selectdetailList = selectdetailList.push(v)
			uuidList = uuidList.push(v.get('uuid'))
			if (v.get('property') === 'income' || v.get('property') === 'otherIncome') {
				receivedList = receivedList.push(v)
			} else {
				payList = payList.push(v)
			}
		}
	})

	if (receivedList.size && payList.size) {

		let receivedAmount = 0
		let payAmount = 0

		receivedList.forEach(v => receivedAmount = receivedAmount + v.get('notHandleAmount'))
		payList.forEach(v => payAmount = payAmount + v.get('notHandleAmount'))


		const differ = receivedAmount - payAmount

		if (differ > 0) {

			const payDirection = '收'
			const notHandleAmount = differ
			dispatch(beforeRunningPayOrReceive(payDirection, assList, notHandleAmount, uuidList, selectdetailList))
		} else {

			const payDirection = '付'
			const notHandleAmount = -differ
			dispatch(beforeRunningPayOrReceive(payDirection, assList, notHandleAmount, uuidList, selectdetailList))
		}

		newRunning() //显示弹窗

	} else if (receivedList.size && !payList.size) {

		let payDirection = '收'
		let notHandleAmount = 0
		receivedList.forEach(v => {
			notHandleAmount = notHandleAmount + v.get('notHandleAmount')
			uuidList.push(v.get('uuid'))
		})

		if (notHandleAmount < 0) {
			payDirection = '付'
			notHandleAmount = -notHandleAmount
		}

		dispatch(beforeRunningPayOrReceive(payDirection, assList, notHandleAmount, uuidList, selectdetailList))

		newRunning()

	} else if (!receivedList.size && payList.size){

		let payDirection = '付'
		let notHandleAmount = 0
		payList.forEach(v => {
			notHandleAmount = notHandleAmount + v.get('notHandleAmount')
			uuidList.push(v.get('uuid'))
		})

		if (notHandleAmount < 0) {
			payDirection = '收'
			notHandleAmount = -notHandleAmount
		}

		dispatch(beforeRunningPayOrReceive(payDirection, assList, notHandleAmount, uuidList, selectdetailList))

		newRunning()

	} else {
		console.log('异常情况：未匹配')
	}
}

// 收／付款
export const saveAccountPayOrReceive = (onSuccess) => (dispatch, getState) => {

    const calculationState = getState().calculationState
	const runningInsertOrModify = calculationState.getIn(['flags', 'runningInsertOrModify'])
    const runningTemp = calculationState.get('runningTemp').toJS()

    fetchApi(`${runningInsertOrModify}Runningpayment`, 'POST', JSON.stringify({
        ...runningTemp
    }), json => {
        if (showMessage(json)) {

			// 更新
			dispatch(afterModifyAccountAllList())

			onSuccess()
        }
    })
}

export const accountItemCheckboxCheck = (checked, uuid, runningDate) => ({
    type: ActionTypes.ACCOUNT_ITEM_CHECKBOX_SELECT,
    checked,
    uuid,
		runningDate
})

export const accountItemCheckboxCheckAll = (selectAll, listName) => ({
    type: ActionTypes.PAY_RECEIVE_ITEM_CHECKBOX_CHECK_ALL,
    selectAll,
    listName
})

export const deleteAccountItemCardAndRunning = (main) => (dispatch, getState) => {

    const deleteList = getState().calculationState.getIn(['flags', 'selectList'])
	// const deleteType = main == 'manages' ? 'business' : 'payment'

    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
			if(result.buttonIndex === 1){
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				fetchApi('deleteRunningbusiness', 'POST', JSON.stringify({
					deleteList
				}), json => {
					if (showMessage(json )) {
						if (json.data.errorList.length) {
							let info = json.data.errorList.reduce((v, pre) => v + ',' + pre)
							thirdParty.Alert(info)

						}
						// 更新
						dispatch(afterModifyAccountAllList())
					}
					dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				})
			}
        }
    })
}

export const getRunningBusinessDuty = (flowNumber, uuid, canMakeVc, openModifyCard) => (dispatch, getState) => {


	// 后台数据有问题，所以自己查询，以后要删掉

	const accountConfState = getState().accountConfState
	const runningCategory = accountConfState.get('runningCategory')

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getNewRunningBusiness', 'GET', `oriUuid=${uuid}`, json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

		if (showMessage(json)) {

			const categoryUuid = json.data.result.categoryUuid
			let category = fromJS([])

			const loop = (data) => data.map(v => {

				if (v.get('uuid') === categoryUuid) {

					category = category.push(v)
				}
				if (v.get('childList') && v.get('childList').size) {
					loop(v.get('childList'))
				}
			})

			loop(runningCategory)

			// openModifyCard()
			// dispatch({
			// 	type: ActionTypes.BEFORE_MODIFY_BUSINESS_CARD,
			// 	receivedData: json.data,
			// 	category,
			// 	canMakeVc
			// })
			const runningState = json.data.result.runningState
			if (runningState === 'STATE_JK_ZFLX' || runningState === 'STATE_TZ_SRGL' || runningState === 'STATE_TZ_SRLX' || runningState === 'STATE_ZB_ZFLR' || runningState === 'STATE_ZS_TH' || runningState === 'STATE_ZF_SH') {
				dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'specialStateforAccrued'], true))
			}
			dispatch(lrAccountActions.getRunningSettingInfo())

			// dispatch(homeActions.addTabpane('LrAccount'))
			dispatch(homeActions.addPageTabPane('EditPanes', 'LrAccount', 'LrAccount', '录入流水'))
			dispatch(homeActions.addHomeTabpane('Edit', 'LrAccount', '录入流水'))

			dispatch({
				type: ActionTypes.INIT_LR_ACCOUNT,
				strJudgeType: 'fromCxAccount',
				receivedData: json.data,
				category,
				canMakeVc,
				flowNumber
			})
			if (runningState === 'STATE_CQZC_JZSY') {
				dispatch(lrAccountActions.calculateGain())
			}
		}
	})
}

export const getRunningPayment = (uuid, openModifyCard) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getRunningPayment', 'GET', `uuid=${uuid}`, json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

		if (showMessage(json)) {
			openModifyCard()
			// dispatch({
			// 	type: ActionTypes.BEFORE_MODIFY_PAYMENT_CARD,
			// 	receivedData: json.data
			// })
			dispatch({
				type: ActionTypes.SHOW_RELATE_PAYMENT_FETCH,
				receivedData: json.data.result
			})
		}
	})
}

export const modifyRunningPayment = () => ({
	type: ActionTypes.MODIFY_RUNNING_PAYMENT
})

//核销中的流水查看
export const showRelateBusinessFetch = (uuid, openRunningInfoModal) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getRunningBusinessDuty', 'GET', `uuid=${uuid}`, json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			openRunningInfoModal()
			dispatch({
				type: ActionTypes.SHOW_RELATE_PAYMENT_FETCH,
				receivedData: json.data.result
			})
		}

	})
}
export const showRelatePaymentFetch = (uuid, openRunningInfoModal) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getRunningPayment', 'GET', `uuid=${uuid}`, json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			openRunningInfoModal()
			dispatch({
				type: ActionTypes.SHOW_RELATE_PAYMENT_FETCH,
				receivedData: json.data.result
			})
		}

	})

}


export const deleteRunningVc = (vcIndex, runningDate) => (dispatch, getState) => {

	// 日期格式 2018-03-21

    thirdParty.Confirm({
        message: '确定删除？',
        title: '温馨提示',
        buttonLabels: ['取消', '确定'],
        onSuccess: (result) => {
			if (result.buttonIndex === 1) {
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

				fetchApi('deletevc', 'POST', JSON.stringify({
					year: runningDate.substr(0, 4),
					month: runningDate.substr(5, 2),
					vcindexlist: [vcIndex]
				}), json => {
					dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
					if (showMessage(json)) {

						const calculationState = getState().calculationState
						const issuedate = calculationState.getIn(['flags', 'issuedate'])
						const main = calculationState.getIn(['flags', 'main'])
						const categoryUuid = calculationState.getIn(['flags', 'curCategory'])
						const accountUuid = calculationState.getIn(['flags', 'curAccountUuid'])
						const assId = calculationState.getIn(['flags', 'assId'])
						const assCategory = calculationState.getIn(['flags', 'assCategory'])
						const acId = calculationState.getIn(['flags', 'acId'])
						const isCheck = calculationState.getIn(['flags', 'isCheck'])
						const cardUuid = calculationState.getIn(['calculateTemp', 'cardUuid'])

						dispatch(getCalculateList(issuedate, main, '',categoryUuid,cardUuid,isCheck))

					}

				})
			}
        }
    })
}

// 展示子集
export const changeItemChildShow = (idx) => ({
	type: ActionTypes.CHANGE_ITEM_CHILD_SHOW,
	idx
})
