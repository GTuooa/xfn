import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
// import fetchGlApi from 'app/constants/fetch.constant.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

export const getRunningBusinessDuty = (flowNumber, uuid,uuidList, canMakeVc, openModifyCard) => (dispatch, getState) => {

	console.log(uuidList);
	// 后台数据有问题，所以自己查询，以后要删掉

	const accountConfState = getState().accountConfState
	const runningCategory = accountConfState.get('runningCategory')

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
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
			const categoryType = json.data.result.categoryType
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
			const runningState = json.data.result.runningState
			const beManagemented = json.data.result[categoryTypeObj].beManagemented
			const contactsRange = json.data.result[categoryTypeObj].contactsRange
			const stockRange = json.data.result[categoryTypeObj].stockRange
			const beProject = json.data.result.beProject
			const projectRange = json.data.result.projectRange
			const propertyCarryover = json.data.result.propertyCarryover
			if (runningState === 'STATE_JK_ZFLX'
			|| runningState === 'STATE_TZ_SRGL'
			|| runningState === 'STATE_TZ_SRLX'
			|| runningState === 'STATE_ZB_ZFLR'
			|| runningState === 'STATE_XC_JN'
			|| runningState === 'STATE_XC_FF'
			|| runningState === 'STATE_SF_JN'
			|| runningState === 'STATE_ZS_TH'
			|| runningState === 'STATE_ZF_SH'
			|| runningState === 'STATE_SF_SFJM') {
				dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'specialStateforAccrued'], true))
			}
			dispatch(lrAccountActions.getRunningSettingInfo())
			dispatch(homeActions.addPageTabPane('EditPanes', 'LrAccount', 'LrAccount', '录入流水'))
			dispatch(homeActions.addHomeTabpane('Edit', 'LrAccount', '录入流水'))
			// dispatch(homeActions.addTabpane('LrAccount'))
			dispatch({
				type: ActionTypes.INIT_LR_ACCOUNT,
				strJudgeType: 'fromCxAccount',
				receivedData: json.data,
				category,
				canMakeVc,
				flowNumber,
				uuidList,
				uuid,
			})
			if (runningState === 'STATE_CQZC_JZSY') {
				dispatch(lrAccountActions.calculateGain())
			}
			if (beProject) {
				dispatch(lrAccountActions.getProjectCardList(projectRange,json.data.result))
			}
			if (beManagemented) {
				dispatch(lrAccountActions.getFirstContactsCardList(contactsRange,runningState))
			}
			if (propertyCarryover === 'SX_HW') {
				dispatch(lrAccountActions.getFirstStockCardList(stockRange,runningState))
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

//生成凭证
// export const runningInsertVc = (uuidList, routeStr) => (dispatch, getState) => {
//
// 	const accountState = getState().accountState
// 	const issuedate = accountState.getIn(['flags', 'issuedate'])
// 	const main = accountState.getIn(['flags', 'main'])
// 	const categoryUuid = accountState.getIn(['flags', 'curCategory'])
// 	const accountUuid = accountState.getIn(['flags', 'curAccountUuid'])
// 	const assId = accountState.getIn(['flags', 'assId'])
// 	const assCategory = accountState.getIn(['flags', 'assCategory'])
// 	const acId = accountState.getIn(['flags', 'acId'])
//
// 	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
// 	fetchApi(`insertRunning${routeStr}Vc`, 'POST', JSON.stringify({
// 		uuidList: uuidList
// 	}), json => {
// 		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
//
// 		if (showMessage(json)) {
// 			if (json.data.result && json.data.result.length) {
// 				let info = json.data.result.reduce((v, pre) => v + ',' + pre)
// 				thirdParty.Alert(info)
// 			}
// 			dispatch(getAccountDimensionFetch(issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId))
// 		}
// 	})
// }
//

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

						const accountState = getState().accountState
						const issuedate = accountState.getIn(['flags', 'issuedate'])
						const main = accountState.getIn(['flags', 'main'])
						const categoryUuid = accountState.getIn(['flags', 'curCategory'])
						const accountUuid = accountState.getIn(['flags', 'curAccountUuid'])
						const assId = accountState.getIn(['flags', 'assId'])
						const assCategory = accountState.getIn(['flags', 'assCategory'])
						const acId = accountState.getIn(['flags', 'acId'])

						dispatch(getAccountDimensionFetch(issuedate, main, categoryUuid, accountUuid, acId, assCategory, assId))

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
