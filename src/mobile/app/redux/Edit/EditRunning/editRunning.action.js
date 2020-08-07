import { toJS, fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.running.js'
import fetchGlApi from 'app/constants/fetch.constant.js'
import { upfile, decimal, showMessage, DateLib } from 'app/utils'
import { save, getCard, oriDateFunc, oriStateFunc, handleTypeFunc } from './EditFunc/index.js'

import * as ActionTypes from './ActionTypes.js'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import * as editRunning from 'app/constants/editRunning.js'

export const accountSaveAndNew = () => (dispatch, getState) => {

	const period = getState().allState.get('period')
	const year = period.get('openedyear')
	const month = period.get('openedmonth')

	let oriDate = ''

	if (!year) {
		oriDate = new Date()
	} else {
		const lastDate = new Date(year, month, 0)
		const currentDate = new Date()
		const currentYear = new Date().getFullYear()
		const currentMonth = new Date().getMonth() + 1

		if (lastDate < currentDate) {   //本月之前
			oriDate = currentDate
		} else if (Number(year) == Number(currentYear) && Number(month) == Number(currentMonth)) {  //本月
			oriDate = currentDate
		} else {   //本月之后
			oriDate = new Date(year, Number(month)-1, 1)
		}
	}

	oriDate = new DateLib(oriDate).toString()

	dispatch({
		type: ActionTypes.RUNNING_ACCOUNT_SAVE_AND_NEW,
		date: oriDate
	})
}

export const changeLrlsData = (dataType, value, set) => ({
	type: ActionTypes.RUNNING_CHANGE_LRLS_DATA,
	dataType,
	value,
	set
})

//获取类别详情
export const getCardDetail = (uuid, isModify) => (dispatch, getState) => {
	const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')
	fetchApi('getRunningDetail', 'GET', `uuid=${uuid}`, json => {
		if (showMessage(json)) {
			let jsonData = json.data.result
			delete jsonData['parentUuid']

			dispatch({
				type: ActionTypes.RUNNING_GET_HOMEACCOUNT_CARD_DETAIL,
				receivedData: jsonData,
				isModify,
				isOpenedWarehouse
			})

			getCard(fromJS(jsonData), dispatch)

		}
	})
}

//修改账户
export const changeLrlsAccount = (value, accountStatus) => ({
	type: ActionTypes.RUNNING_CHANGE_LRLS_ACCOUNT,
	value,
	accountStatus
})

//保存
export const saveEditRunning = (saveAndNew, showRepeatJrindex) => (dispatch, getState) => {
	const state = getState().editRunningState
	const scale = getState().allState.getIn(['taxRate', 'scale'])
	const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理
	save(dispatch, state, scale, saveAndNew, isOpenedWarehouse, showRepeatJrindex)
}

//修改流水状态
export const changeLrlsOriState = (oriState) => (dispatch, getState) => {
	dispatch(clearCardTemp())//切换oriState清空状态
	dispatch(changeLrlsData(['oriTemp', 'oriState'], oriState))

	const state = getState().editRunningState
	oriStateFunc(dispatch, state)
}

//暂收--获取退还未核销流水列表
export const getZskxPaymentList = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const categoryUuid = getState().editRunningState.getIn(['oriTemp', 'categoryUuid'])
	const currentCardUuid = getState().editRunningState.getIn(['oriTemp', 'currentCardList']).toJS()

	let cardUuid = []
	currentCardUuid.forEach(v => {
		cardUuid.push(v['uuid'])
	})

	if (cardUuid.includes('')) {
		cardUuid = []
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getManageList', 'POST', JSON.stringify({
		oriDate,
		categoryUuidList: [categoryUuid],
		cardUuidList: cardUuid,
		oriUuid:'',
		currentPage: '',
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.pendingManageList,
			})
		}
	})
}

//单据被选中
export const pendingStrongListBeSelect = (idx, value) => ({
	type: ActionTypes.RUNNING_PENDINGSTRONGLIST_BESELECT,
	value,
	idx
})

//修改项目
export const changeProjectCard = (dataType, value, idx) => ({
	type: ActionTypes.RUNNING_CHANGE_PROJECT_CARD,
	dataType,
	value,
	idx
})

//获取项目卡片
export const getProjectCardList = (categoryList, cardType='projectList') => (dispatch, getState) => {
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getProjectCardList', 'POST', JSON.stringify({
		sobId,
		categoryList,
		needCommonCard: true,
		needAssist: true,
		needMake: true,
		needIndirect: true,
		needMechanical: true,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_PROJECT_CARDLIST,
				receivedData: json.data.result,
				cardType
			})
		}
	})
}

//清空CardTemp
export const clearCardTemp = () => ({
	type: ActionTypes.RUNNING_CLEAR_CARDTEMP
})

//更改日期
export const changeHomeAccountOriDate = (oriDate, isModify) => (dispatch, getState) => {
	dispatch(changeLrlsData(['oriTemp', 'oriDate'], oriDate))
	if (isModify) { return }
	const state = getState().editRunningState
	oriDateFunc(dispatch, state)
}

//获取单条流水
export const getOriRunning = (oriUuid, shouldGetCard, ylType) => (dispatch, getState) => {
	fetchApi('getRunningBusiness', 'GET', `oriUuid=${oriUuid}`, json => {
		if (showMessage(json, '', '', '', true)) {
			dispatch({
				type: ActionTypes.RUNNING_ORIRUNNING,
				receivedData: json.data,
				ylType
			})
			//增值税获取待抵扣金额
			const state = getState().editRunningState
			const propertyTax = state.getIn(['oriTemp', 'propertyTax'])
			const oriState = state.getIn(['oriTemp', 'oriState'])
            if (propertyTax == 'SX_ZZS' && oriState == 'STATE_SF_JN') {
                dispatch(getSfzcZzsList())
            }
			//结转成本-直接结转
			if (oriState=='STATE_YYSR_ZJ') {
				dispatch(getJzcbCardList())
				dispatch(getCostStockByCategory('', true))
				dispatch(getCostStockCategory())
				if (ylType=='COPY') {
					dispatch(getJzcbCategoryList())
				}
				if (json.data.jrOri.beProject) {
					dispatch(getProjectCardList(json.data.jrOri.projectRange))
					dispatch(getProjectTreeList())
				}
			}

			if (shouldGetCard) {
				getCard(fromJS(json.data.category), dispatch, true, ylType)
				if (oriState=='STATE_CHYE_TYDJ') {
					dispatch(getWarehouseCardList('STATE_CHYE_TYDJ'))
				}
				if (oriState=='STATE_CQZC_ZJTX' && ylType=='COPY') {
					dispatch(getCqzcCategoryList('LB_ZJTX'))
				}
			}
			if (!shouldGetCard && ['STATE_XMJZ_JZRK', 'STATE_XMJZ_QRSRCB'].includes(oriState)) {//项目结转入库保存后重新获取列表
				dispatch(getXmjzList())
			}
		}
	})
}

//修改处理类型
export const changeHandleType = (value) => (dispatch, getState) => {
	dispatch(clearCardTemp())//切换处理类型清空状态
	dispatch({
		type: ActionTypes.RUNNING_HANDLETYPE,
		value: value
	})

	const state = getState().editRunningState
	handleTypeFunc(dispatch, state)
}

//获取借款的支付利息未核销流水
export const getJkPendingStrongList = () => (dispatch, getState) => {
	const state = getState().editRunningState
	const categoryType = state.getIn(['oriTemp', 'categoryType'])
	const oriState = state.getIn(['oriTemp', 'oriState'])
	const beAccrued = state.getIn(['oriTemp', editRunning.categoryTypeObj[categoryType], 'beAccrued'])//是否开启计提

	if (!beAccrued || (oriState != 'STATE_JK_ZFLX')) { return }

	const categoryUuid = state.getIn(['oriTemp', 'categoryUuid'])
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const usedCurrent = state.getIn(['oriTemp', 'usedCurrent'])

	let cardUuid = ''
	if (usedCurrent) {
		const currentCardUuid = state.getIn(['oriTemp', 'currentCardList', 0, 'cardUuid'])
		cardUuid = currentCardUuid ? currentCardUuid : ''
	}

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getJkPendingStrongList', 'GET', `categoryUuid=${categoryUuid}&oriDate=${oriDate}&currentCardUuid=${cardUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.jrList,
			})
		}
	})
}

//获取投资的支付利息未核销流水
export const getTzPendingStrongList = () => (dispatch, getState) => {
	const state = getState().editRunningState
	const categoryType = state.getIn(['oriTemp', 'categoryType'])
	const oriState = state.getIn(['oriTemp', 'oriState'])

	const beAccrued = state.getIn(['oriTemp', editRunning.categoryTypeObj[categoryType], 'beAccrued'])//是否开启计提
	if (!beAccrued) { return }
	if (!['STATE_TZ_SRGL', 'STATE_TZ_SRLX'].includes(oriState)) { return }

	const categoryUuid = state.getIn(['oriTemp', 'categoryUuid'])
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const usedCurrent = state.getIn(['oriTemp', 'usedCurrent'])

	let cardUuid = ''
	if (usedCurrent) {
		const currentCardUuid = state.getIn(['oriTemp', 'currentCardList', 0, 'cardUuid'])
		cardUuid = currentCardUuid ? currentCardUuid : ''
	}

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getTzPendingStrongList', 'GET', `categoryUuid=${categoryUuid}&oriDate=${oriDate}&currentCardUuid=${cardUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.jrList,
			})
		}
	})
}

//获取资本的支付利息未核销流水
export const getZbPendingStrongList = () => (dispatch, getState) => {
	const state = getState().editRunningState
	const categoryType = state.getIn(['oriTemp', 'categoryType'])
	const oriState = state.getIn(['oriTemp', 'oriState'])
	const beAccrued = state.getIn(['oriTemp', editRunning.categoryTypeObj[categoryType], 'beAccrued'])//是否开启计提

	if (!beAccrued || oriState != 'STATE_ZB_ZFLR') { return }

	const categoryUuid = state.getIn(['oriTemp', 'categoryUuid'])
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const usedCurrent = state.getIn(['oriTemp', 'usedCurrent'])

	let cardUuid = ''
	if (usedCurrent) {
		const currentCardUuid = state.getIn(['oriTemp', 'currentCardList', 0, 'cardUuid'])
		cardUuid = currentCardUuid ? currentCardUuid : ''
	}

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getZbPendingStrongList', 'GET', `categoryUuid=${categoryUuid}&oriDate=${oriDate}&currentCardUuid=${cardUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.jrList,
			})
		}
	})
}

//获取结转项目流水列表
export const getXmjzList = (fromYl) => (dispatch, getState) => {
	const state = getState().editRunningState

	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const oriState = state.getIn(['oriTemp', 'oriState'])
	const projectCardList = state.getIn(['oriTemp', 'projectCardList'])
	const oriUuid = state.getIn(['oriTemp', 'oriUuid'])

	if (fromYl && oriState=='STATE_XMJZ_XMJQ') {
		return
	}

	let projectUuid = '', projectProperty = ''
	if (projectCardList) {
		const cardUuid = projectCardList.getIn([0, 'cardUuid'])
		projectUuid = cardUuid ? cardUuid : ''
		projectProperty = projectCardList.getIn([0, 'projectProperty'])
	}

	fetchApi('getXmjzList', 'GET', `oriDate=${oriDate}&projectUuid=${projectUuid}&oriUuid=${oriUuid ? oriUuid : ''}`, json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.carryoverList,
			})
			let jrAmount = decimal(json.data.allHappenAmount-json.data.allStoreAmount)
			// if (projectProperty=='XZ_CONSTRUCTION') {
			// 	jrAmount = decimal(json.data.allStoreAmount-json.data.allHappenAmount)
			// }
			dispatch(changeLrlsData(['oriTemp', 'jrAmount'], jrAmount))
		}
	})
}

//改变金额--连带发票信息
export const changeLrlsAmount = (value) => ({
	type: ActionTypes.RUNNING_LRLS_AMOUNT,
	value
})

//改变税率
export const changeTaxRate = (value) => ({
	type: ActionTypes.RUNNING_TAXRATE,
	value
})

//获取往来 存货卡片
export const getCardList = (cardType, commonCardList)=> (dispatch, getState) => {
	//stockRange contactsRange
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	const state = getState().editRunningState
	const categoryType = state.getIn(['oriTemp', 'categoryType'])
	const oriState = state.getIn(['oriTemp', 'oriState'])

	let categoryList = state.getIn(['oriTemp', editRunning.categoryTypeObj[categoryType], cardType])
	if (commonCardList) {
		categoryList = commonCardList
	}
	let property = ''// NEEDIN应收 PREIN预收 NEEDPAY应付 PREPAY预付  1：原材料，2：半成品，3：库存商品，4：易耗品  空则查全部
	const url = cardType=='stockRange' ? 'getStockCardList' : 'getCurrentCardList'

	switch (categoryType) {
		case 'LB_YYSR': {
			if (oriState==='STATE_YYSR_DJ') {
				if (cardType=='stockRange') {
					property = '4'
				} else {
					property = 'PREIN'
				}
			} else {
				if (cardType=='stockRange') {
					property = '4'
				} else {
					property = 'NEEDIN'
				}
			}
			break
		}
		case 'LB_YYZC': {
			if (oriState==='STATE_YYZC_DJ') {
				if (cardType=='stockRange') {
					property = '5'
				} else {
					property = 'PREPAY'
				}
			} else {
				if (cardType=='stockRange') {
					property = '5'
				} else {
					property = 'NEEDPAY'
				}
			}
			break
		}
		case 'LB_YYWSR': {
			property = 'NEEDIN'
			break
		}
		case 'LB_YYWZC': {
			property = 'NEEDPAY'
			break
		}
		case 'LB_CQZC': {
			const handleType = state.getIn(['oriTemp', 'handleType'])
			property = handleType === 'JR_HANDLE_GJ' ? 'NEEDPAY' : 'NEEDIN'// NEEDIN应收 PREIN预收 NEEDPAY应付 PREPAY预付
			break
		}
		case 'LB_FYZC': {
			const oriState = state.getIn(['oriTemp', 'oriState'])
			property = oriState == 'STATE_FY_DJ' ? 'PREPAY' : 'NEEDPAY'
			break
		}
		case 'LB_ZSKX': {
			property = 'NEEDIN'
			if (oriState=='STATE_ZS_TH') {
				return
			}
			break
		}
		case 'LB_ZFKX': {
			property = 'NEEDPAY'
			if (oriState=='STATE_ZF_SH') {
				return
			}
			break
		}
		case 'LB_CHDB':
		case 'LB_CHYE':
		case 'LB_CHTRXM':
		case 'LB_XMJZ': {
			categoryList = []
			property = '0'
			break
		}
		case 'LB_JXSEZC': {
			categoryList = state.getIn(['oriTemp', 'stockRange'])
			property = '5'
			break
		}
		default: null

	}
	if (commonCardList) {
		cardType = 'commonCardList'
	}

	fetchApi(url, 'POST', JSON.stringify({
		sobId,
		property,
		categoryList,
		isUniform: oriState=='STATE_CHYE_TYDJ' ? true : null,
		openQuantity: oriState=='STATE_CHYE_TYDJ' ? true : null,
	}),json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_CARDLIST,
				data: json.data.result,
				cardType,
			})
		}

	})
}

//改变往来单位
export const changeCurrentCardList = (value, cardType) => ({
	type: ActionTypes.RUNNING_CHANGE_CURRENT_CARDLIST,
	value,
	cardType
})

//计算长期资产处置的金额
export const autoCqzcCzAmount = () => ({
	type: ActionTypes.RUNNING_AUTO_CQZC_CZAMOUNT
})

//修改存货卡片
export const changeYysrStockCard = (dataType, value, idx, categoryType='YYSZ', cardType='stockCardList') => ({
	type: ActionTypes.RUNNING_CHANGE_YYSR_STOCKCARD,
	dataType,
	value,
	idx,
	categoryType,
	cardType
})

//税费支出预交增值税
export const getSfzcZzsList = () => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const insertOrModify = state.getIn(['views', 'insertOrModify'])
	const isModify = insertOrModify === 'modify' ? true : false
	const oriUuid = isModify ? state.getIn(['oriTemp', 'oriUuid']) : ''

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getSfzcZzsList', 'GET', `oriDate=${oriDate}&oriUuid=${oriUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch(changeLrlsData(['oriTemp', 'deductedAmount'], json.data.notHandleAmount))
		}
	})
}

//税费支出未缴增值税
export const getSfzcNotPayList = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const categoryUuid = getState().editRunningState.getIn(['oriTemp', 'categoryUuid'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getSfzcNotPayList', 'GET', `oriDate=${oriDate}&categoryUuid=${categoryUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.jrList
			})
		}
	})
}

//获取待转出未交增值税金额
export const getSfzcTransferAmount = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getSfzcTransferAmount', 'GET', `oriDate=${oriDate}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch(changeLrlsData(['oriTemp', 'transferAmount'], json.data.amount))
		}
	})
}

//获取薪酬支出工资薪金未处理金额 个人税费未处理金额
export const getSfzcNotHandleAmount = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const categoryUuid = getState().editRunningState.getIn(['oriTemp', 'categoryUuid'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getSfzcNotHandleAmount', 'GET', `oriDate=${oriDate}&categoryUuid=${categoryUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch(changeLrlsData(['oriTemp', 'payableAmount'], json.data.payableAmount))
		}
	})
}

//薪酬支出计算金额
export const xczcCalculateAmount = (propertyPay) => ({
	type: ActionTypes.RUNNING_XCZC_CALCULATE_AMOUNT,
	propertyPay
})

//获取薪酬支出工资薪金未处理金额 个人税费未处理金额
export const getPaymentInfo = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const categoryUuid = getState().editRunningState.getIn(['oriTemp', 'categoryUuid'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getPaymentInfo', 'GET', `oriDate=${oriDate}&categoryUuid=${categoryUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch(changeLrlsData(['oriTemp', 'accumulationAmount'], json.data.accumulationAmount))
			dispatch(changeLrlsData(['oriTemp', 'socialSecurityAmount'], json.data.socialSecurityAmount))
		}
	})
}

//获取薪酬支出计提列表
export const getXczcPaymentList = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const categoryUuid = getState().editRunningState.getIn(['oriTemp', 'categoryUuid'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getXczcPaymentList', 'GET', `oriDate=${oriDate}&categoryUuid=${categoryUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.jrList,
			})
		}
	})
}

//获取营业收入营业支出未处理金额
export const getYysrYyzcAmount = () => (dispatch, getState) => {
	const oriTemp = getState().editRunningState.get('oriTemp')
	const oriDate = oriTemp.get('oriDate')
	const categoryUuid = oriTemp.get('categoryUuid')
	const oriState = oriTemp.get('oriState')
	const currentCardUuid = oriTemp.getIn(['currentCardList', 0, 'cardUuid'])
	const usedCurrent = oriTemp.get('usedCurrent')
	const cardUuid = usedCurrent && currentCardUuid ? currentCardUuid : ''

	if (['STATE_FY_DJ', 'STATE_YYSR_DJ', 'STATE_YYZC_DJ'].includes(oriState)) {
		return
	}

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(`getRunningAccountInfo`, 'GET', `oriDate=${oriDate}&categoryUuid=${categoryUuid}&oriState=${oriState}&cardUuid=${cardUuid}`,json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch(changeLrlsData(['oriTemp', 'payableAmount'], json.data.payableAmount))
			dispatch(changeLrlsData(['oriTemp', 'preAmount'], json.data.preAmount))
			dispatch(changeLrlsData(['oriTemp', 'offsetAmount'], ''))
		}

	})
}

//录入核算管理
export const toManageType = (jsonData) => (dispatch, getState) => {
	const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')
	dispatch({
		type: ActionTypes.RUNNING_GET_HOMEACCOUNT_CARD_DETAIL,
		receivedData: jsonData,
		isOpenedWarehouse
	})

	getCard(fromJS(jsonData), dispatch)
}

//获取开具发票列表
export const getKjfpList = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const billType = getState().editRunningState.getIn(['oriTemp', 'billType'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getBusinessMakeoutList', 'GET', `oriDate=${oriDate}&billType=${billType}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.result,
			})
		}
	})
}
//获取发票认证列表
export const getFprzList = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const billType = getState().editRunningState.getIn(['oriTemp', 'billType'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getBusinessAuthList', 'GET', `oriDate=${oriDate}&billType=${billType}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.result,
			})
		}
	})
}

//获取结转损益 折旧摊销类别列表
export const getCqzcCategoryList = (type) => (dispatch) => {
	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getCategoryList', 'POST', JSON.stringify({
		type
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_CQZC_CATEGORY,
				receivedData: json.data.result[0]['childList']
			})
		}
	})
}

//获取结转损益列表
export const getJzsyList = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const uuid = getState().editRunningState.getIn(['oriTemp', 'relationCategoryUuid'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getJzsyList', 'GET', `oriDate=${oriDate}&categoryUuid=${uuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.jrList,
			})
		}
	})
}

export const autoJzsyAmount = () => ({
	type: ActionTypes.RUNNING_AUTO_JZSY_AMOUNT
})


export const zjtxSelectCategory = (data) => ({
	type: ActionTypes.RUNNING_ZJTX_SELECT_CATEGORY,
	data
})

//转出未缴增值税列表
export const getWjzzsList = (oriDate) => (dispatch) => {
	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getBusinessTurnoutList', 'GET', `oriDate=${oriDate}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.jrJvVatDtoList,
			})
		}
	})
}

//获取待收付管理往来卡片列表
export const getSfglCardList = () => (dispatch, getState) => {
	const oriTemp = getState().editRunningState.get('oriTemp')
	const oriDate = oriTemp.get('oriDate')
	const categoryUuid = oriTemp.get('categoryUuid')
	const categoryType = oriTemp.get('categoryType')
	let fetchStr = `oriDate=${oriDate}`
	if (['LB_ZSKX','LB_ZFKX'].includes(categoryType)) {
		fetchStr = `oriDate=${oriDate}&categoryUuid=${categoryUuid}`
	}
	fetchApi('getSfglCardList', 'GET', `${fetchStr}`, json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_CARDLIST,
				data: json.data.cardList,
				cardType: 'contactsRange'
			})
		}
	})
}

//获取收付管理处理类别
export const getSfglCategoryList = () => (dispatch, getState) => {
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getSfglCategoryList', 'GET', `oriDate=${oriDate}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_SFGL_CATEGORYLIST,
				data: json.data.category,
			})
		}
	})
}

//获取收付管理单据列表
export const getSfglList = () => (dispatch, getState) => {//暂收暂付也调用此接口
	const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
	const categoryUuid = getState().editRunningState.getIn(['oriTemp', 'pendingManageDto', 'categoryUuid']).toJS()
	const currentCardUuid = getState().editRunningState.getIn(['oriTemp', 'currentCardList']).toJS()

	let categoryUuidList = [], cardUuid = []
	categoryUuid.forEach(v => {
		categoryUuidList.push(v['uuid'])
	})
	currentCardUuid.forEach(v => {
		cardUuid.push(v['uuid'])
	})
	if (categoryUuidList.includes('')) {
		categoryUuidList = []
	}
	if (cardUuid.includes('')) {
		cardUuid = []
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getManageList', 'POST', JSON.stringify({
		oriDate,
		categoryUuidList: categoryUuidList,
		cardUuidList: cardUuid,
		oriUuid:'',
		currentPage: '',
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.pendingManageList,
			})
		}
	})
}

//获取收付管理期初值的类别
export const getSfglQcCategoryList = (idx, uuid) => (dispatch) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getManagerCategoryList', 'GET', `uuid=${uuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch(changeLrlsData(['oriTemp', 'pendingStrongList', idx, 'categoryList'], fromJS(json.data.category.childList)))
		}
	})
}

//获取结转成本卡片列表
export const getJzcbCardList = () => (dispatch, getState) => {
	const editRunningState = getState().editRunningState
	const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
	const oriState = editRunningState.getIn(['oriTemp', 'oriState'])
	const relationCategoryUuid = editRunningState.getIn(['oriTemp', 'relationCategoryUuid'])
	if (!relationCategoryUuid) {
		return
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getCostStock', 'GET', `categoryUuid=${relationCategoryUuid}&oriDate=${oriDate}&oriState=${oriState}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_CARDLIST,
				cardType: 'carryoverStockRange',
				data: json.data.cardList
			})
		}
	})
}

//获取结转成本处理类别列表
export const getJzcbCategoryList = (isYyzc) => (dispatch, getState) => {
	const editRunningState = getState().editRunningState
	const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
	const oriState = editRunningState.getIn(['oriTemp', 'oriState'])
	const stockCardList = editRunningState.getIn(['oriTemp', 'stockCardList'])
	let cardUuidList = []
	stockCardList.map(v => {
		if (v.get('cardUuid')) {
			cardUuidList.push(v.get('cardUuid'))
		}
	})
	if (oriState!=='STATE_YYSR_ZJ' && !isYyzc) {//结转成本的销售和退销
		cardUuidList = []
	}

	fetchApi('getCostCategory', 'POST', JSON.stringify({
		oriDate,
		oriState,
		cardUuidList
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JZCB_CATEGORYLIST,
				data: json.data.categoryList
			})
		}
	})

}

//获取结转成本仓库列表 销售 退销时用
export const getJzcbWarehouseList = () => (dispatch, getState) => {
	const editRunningState = getState().editRunningState
	const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')
	if (!isOpenedWarehouse) { return }

	const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
	const oriState = editRunningState.getIn(['oriTemp', 'oriState'])

	fetchApi('getCostWarehouse', 'POST', JSON.stringify({
		oriDate,
		oriState,
		cardUuidList:[]
	}), json => {
		if (showMessage(json)) {
			let warehouseList = []
			json.data.warehouseList.map(v => {
				v['key'] = `${v['code']} ${v['name']}`,
                v['value'] = v['uuid']
				warehouseList.push(v)
			})
			dispatch(changeLrlsData(['cardAllList', 'warehouseList'], fromJS(warehouseList)))
		}
	})

}


//获取结转成本卡片列表通过类别
export const getCostStockByCategory = (cardCategoryUuid, isTop, cardType='carryoverStockRange') => (dispatch, getState) => {
	const editRunningState = getState().editRunningState
	const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
	const oriState = editRunningState.getIn(['oriTemp', 'oriState'])
	const relationCategoryUuid = editRunningState.getIn(['oriTemp', 'relationCategoryUuid'])

	if (oriState=='STATE_YYSR_ZJ' && !relationCategoryUuid) {
		return
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getCostStockByCategory', 'POST', JSON.stringify({
		oriDate,
		oriState,
		categoryUuid: relationCategoryUuid,
		cardCategoryUuid: isTop ? cardCategoryUuid : '',
		subordinateUuid: isTop ? '' : cardCategoryUuid,
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_CARDLIST,
				cardType,
				data: json.data.result
			})

			// if (cardType=='carryoverStockRange' && editRunningState.getIn(['views', 'insertOrModify'])=='insert') {
			// 	dispatch(changeLrlsData(['oriTemp', 'pendingStrongList'], fromJS([])))
			// 	dispatch(changeLrlsData(['oriTemp', 'stockCardList'], fromJS([{amount: ''}])))
			// }

		}
	})
}

//获取结转成本单据列表
export const getJzcbList = (shouldSelected) => (dispatch, getState) => {
	const editRunningState = getState().editRunningState
	const oriTemp = editRunningState.get('oriTemp')
	const oriDate = oriTemp.get('oriDate')
	const oriState = oriTemp.get('oriState')
	const categoryUuidList = oriTemp.get('relationCategoryUuid') ? oriTemp.get('relationCategoryUuid') : []
	const stockCardList = editRunningState.getIn(['cardAllList', 'stockCardList'])
	const warehouseCardList =  editRunningState.getIn(['cardAllList', 'warehouseCardList'])

	let cardUuidList = []
	stockCardList.map(v => {
		if (v.get('cardUuid')) {
			cardUuidList.push(v.get('cardUuid'))
		}
	})
	// if (cardUuidList.length == 0) {
	// 	return
	// }
	let jrJvUuidList = []
	if (shouldSelected) {
		oriTemp.get('pendingStrongList').map(v => {
			if (v.get('beSelect')) {
				jrJvUuidList.push(v.get('jrJvUuid'))
			}
		})
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getCarryoverList', 'POST', JSON.stringify({
		oriDate,
		oriState,
		// categoryUuid,
		cardUuidList,
		categoryUuidList: categoryUuidList.map(v => v.get('uuid')),
		storeUuidList: warehouseCardList.map(v => v.get('uuid')),
		// condition: '',
		// currentPage: null,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			let receivedData = json.data.carryoverList
			let totalAmount = 0
			if (shouldSelected) {
				receivedData.map(v => {
					if (jrJvUuidList.includes(v['jrJvUuid'])) {
						v['beSelect'] = true
						totalAmount += Math.abs(v['amount'])
					}
				})
			}
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: receivedData,
			})
			if (shouldSelected) {
				dispatch(changeLrlsData(['oriTemp', 'jrAmount'], decimal(totalAmount)))
				dispatch(setJzcbPrice())
			} else {
				dispatch(changeLrlsData(['oriTemp', 'stockCardList'], fromJS([])))
			}
		}
	})
}

//修改状态时筛选结转成本单据列表
export const filterJzcbList = () => ({
	type: ActionTypes.RUNNING_FILTER_JZCBLIST
})

//直接结转成本获取参考 统一单价
export const getJzcbPrice =  (idx) => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const storeUuid = state.getIn(['oriTemp', 'stockCardList', idx, 'warehouseCardUuid'])
	const item = state.getIn(['oriTemp', 'stockCardList', idx])
	const cardUuid = item.get('cardUuid')
	if (!cardUuid) {// || !storeUuid
		return
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		//canNegate: 'true',
		stockPriceList: [{
			cardUuid,
			storeUuid
		}]
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			const unitPrice = json.data[0].price == 0 ? '' : json.data[0].price
			let price = unitPrice > 0 ? unitPrice : '', amount = ''

			if (item.get('isOpenedQuantity')) {
				const basicUnitQuantity = item.get('basicUnitQuantity') ? item.get('basicUnitQuantity') : 1
				price = decimal(unitPrice*basicUnitQuantity, 4)
				if (item.get('quantity')) {
					amount = decimal(price*item.get('quantity'))
				}
			}
			let newItem = item.toJS()
			newItem['price'] = price
			newItem['unitPrice'] = unitPrice
			newItem['amount'] = amount
			dispatch(changeLrlsData(['oriTemp', 'stockCardList', idx], fromJS(newItem)))
		}
	})
}

//直接结转成本获取参考 统一单价 多存货
export const getJzcbListPrice =  (idx, list) => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const oriStoreUuid = state.getIn(['oriTemp', 'stockCardList', idx, 'warehouseCardUuid'])
	const cardUuid = state.getIn(['oriTemp', 'stockCardList', idx, 'cardUuid'])

	let stockPriceList = []
	list.forEach((v, i) => {
		let cardUuid = v['cardUuid'], storeUuid = ''
		if (i==0 && oriStoreUuid) {
			storeUuid = oriStoreUuid
		}
		stockPriceList.push({cardUuid, storeUuid, name: v['oriName']})
	})
    thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		//canNegate: 'true',
		stockPriceList,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			let newStockCardList = state.getIn(['oriTemp', 'stockCardList']).toJS()
			const listLength = list.length
			newStockCardList.forEach((v, i) => {
				if (i >= idx && i <= idx+listLength-1) {
					const index = i-idx
					const price = json.data[index].price <= 0 ? '' : json.data[index].price
					v['price'] = price
					v['unitPrice'] = json.data[index].price
					v['amount'] = ''
				}
			})
			dispatch(changeLrlsData(['oriTemp', 'stockCardList'], fromJS(newStockCardList)))
		}
	})
}

//设置结转成本单价
export const setJzcbPrice = () => (dispatch, getState) => {
	dispatch({
		type: ActionTypes.RUNNING_SET_JZCB_PRICE,
	})

	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const stockCardList = state.getIn(['oriTemp', 'stockCardList'])

	let stockPriceList = []
	stockCardList.forEach((v, i) => {
		stockPriceList.push({cardUuid: v.get('cardUuid'), storeUuid: ''})
	})

    thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			let newStockCardList = state.getIn(['oriTemp', 'stockCardList']).toJS()
			newStockCardList.forEach((v, i) => {
				const price = json.data[i].price == 0 ? '' : json.data[i].price
					v['unitPrice'] = price
				}
			)
			dispatch(changeLrlsData(['oriTemp', 'stockCardList'], fromJS(newStockCardList)))
		}
	})

}

//公共费用分摊
export const changeGgfyftProjectCard = (dataType, value, idx) => ({
	type: ActionTypes.RUNNING_CHANGE_GGFYFT_PROJECT_CARD,
	dataType,
	value,
	idx
})

//公共费用分摊计算
export const autoCalculate = () => ({
	type: ActionTypes.RUNNING_GGFYFT_AUTO_CALCULATE
})

//公共费用分摊卡片列表
export const getGgfyftProjectList = () => (dispatch, getState) => {
	const editRunningState = getState().editRunningState
	const categoryType = editRunningState.getIn(['oriTemp', 'categoryType'])
	const oriState = editRunningState.getIn(['oriTemp', 'oriState'])

	let str = 'listFrom=&treeFrom='
	if (['LB_CHTRXM', 'LB_XMJZ'].includes(categoryType)) {
		str=`listFrom=&treeFrom=&notProjectProperty=XZ_LOSS&needCommon=false&needAssist=true&needMake=true&needIndirect=true&needMechanical=true&used=true`
	}
	if (categoryType=='LB_GGFYFT') {
		str={
			'STATE_GGFYFT':'listFrom=&treeFrom=&projectProperty=XZ_LOSS&needCommon=false&needAssist=false&needMake=false&needIndirect=false&needMechanical=false&needEmptyCard=true&used=true',
			'STATE_FZSCCB': 'listFrom=&treeFrom=&projectProperty=XZ_PRODUCE&needCommon=true&needAssist=false&needMake=false&needIndirect=false&needMechanical=false&used=true',
			'STATE_ZZFY': 'listFrom=&treeFrom=&projectProperty=XZ_PRODUCE&needCommon=true&needAssist=true&needMake=false&needIndirect=false&needMechanical=false&used=true',
			'STATE_JJFY': 'listFrom=&treeFrom=&projectProperty=XZ_CONSTRUCTION&needCommon=true&needAssist=false&needMake=false&needIndirect=false&needMechanical=false&used=true',
			'STATE_JXZY': 'listFrom=&treeFrom=&projectProperty=XZ_CONSTRUCTION&needCommon=true&needAssist=false&needMake=false&needIndirect=true&needMechanical=false&used=true',
		}[oriState]
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi(`getProjectListAndTree`, 'GET', str, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_PROJECT_CARDLIST,
				receivedData: json.data.resultList,
				cardType: 'projectList'
			})
		}
	})
}

//公共费用分摊单据列表
export const getGgfyftList =  () => (dispatch, getState) => {
	const editRunningState = getState().editRunningState
	const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
	const oriState = editRunningState.getIn(['oriTemp', 'oriState'])
	const shareType = oriState==='STATE_GGFYFT' ? editRunningState.getIn(['oriTemp', 'shareType']) : 0

	fetchApi('getProjectShareList', 'GET', `oriDate=${oriDate}&oriState=${oriState}&shareType=${shareType}&pageSize=`, json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_JRLIST,
				receivedData: json.data.shareList
			})
		}
	})
}
//项目分摊oriState列表
export const getProjectShareType =  () => (dispatch) => {
	fetchApi('getProjectShareType', 'GET', ``, json => {
		if (showMessage(json)) {
			dispatch(changeLrlsData(['cardAllList', 'projectShareType'], fromJS(json.data.typeList)))
		}
	})
}

//项目结转项目列表
export const getXmjzProjectList = () => (dispatch, getState) => {
	const editRunningState = getState().editRunningState
	const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi(`getXmjzProjectList`, 'GET', `oriDate=${oriDate}&currentPage=0&pageSize=200`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_PROJECT_CARDLIST,
				receivedData: json.data.resultList,
				cardType: 'projectList'
			})
		}
	})
}

//从预览跳入录入页面
export const fromYlToLr = (ylType) => (dispatch, getState) => {
	const runningPreviewState = getState().runningPreviewState
	const oriUuid = runningPreviewState.getIn(['jrOri', 'oriUuid'])

	dispatch(getOriRunning(oriUuid, true, ylType))
}

// 附件
// export const initLabel = () => dispatch => {
// 	fetchApi('initLsLabel', 'POST', '', json => {showMessage(json)})
// }

export const getUploadGetTokenFetch = () => (dispatch, getState) => {
	// thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	// fetchGlApi('uploadgettoken', 'GET', '', json => {
	// 	// thirdParty.toast.hide()
	// 	showMessage(json) &&
	// 	sessionStorage.setItem('uploadToken' ,json.data.token)
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

// export const uploadFiles = (file, index, filesLength, Orientation) => (dispatch, getState )=> {
export const uploadFiles = (callbackJson, file, filesName, isLast) => (dispatch, getState )=> {

	let fileArr = []

	fileArr.push({
		fileName: filesName,
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
		if (json.code === 0) {
			dispatch({
				type: ActionTypes.CHANGE_EDIT_RUNNING_ENCLOSURE_LIST,
				imgArr: json.data.enclosureList,
				isLast
			})
		}
		if (isLast) {
			thirdParty.toast.hide()
		}
	})

	// const homeState = getState().homeState
	// const sobid = homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
	// const useruuid = homeState.getIn(['data', 'userInfo', 'useruuid'])
	// //begin：本url影响编译环境，不可做任何修改
	// // const dirUrl = `test/${sobid}/${year}-${month}/${vcIndex}`;
	// const timestamp = new Date().getTime()
	// const dirUrl = `test/${sobid}/${useruuid}/${timestamp}`
	//
	//
	// // const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
	// // // thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	// // let fileName = isIPhone ? (new Date()).valueOf()+ '.jpg' : ''
	// // if (files['name'].indexOf('@') > -1) {
	// //     fileName = (new Date()).valueOf()+ '.jpg'
	// // }
	// let fileName = file['name']
	// const fileExtend = fileName.substring(fileName.lastIndexOf('.')).toUpperCase()
	//
	// if (fileExtend === '.JPG' || fileExtend === '.JPEG' || fileExtend === '.PNG' || fileExtend === '.GIF') {
	// 	fileName = (new Date()).valueOf()+ '.jpg'
	// }
	//
	// let orientationNum = Orientation ? Orientation : 1
	//
	// upfile({
	// 	file: file,   //文件，必填,html5 file类型，不需要读数据流，files[0]
	// 	name: fileName, //文件名称，选填，默认为文件名称
	// 	token: sessionStorage.getItem('uploadToken'),  //token，必填
	// 	dir: dirUrl,  //目录，选填，默认根目录''
	// 	retries: 0,  //重试次数，选填，默认0不重试
	// 	maxSize: 10*1024*1024,  //上传大小限制，选填，默认0没有限制 10M
	// 	mimeLimit: 'image/*', //image/jpeg
	// 	insertOnly: 1,//0可覆盖  1 不可覆盖
	// 	callback: function (percent, result) {
	// 		// percent（上传百分比）：-1失败；0-100上传的百分比；100即完成上传
	// 		// result(服务端返回的responseText，json格式)
	// 		// result = JSON.stringify(result);
	// 		// thirdParty.toast.hide()
	//
	// 		if (result.code == 'OK') {
	// 			let fileArr=[];
	// 			fileArr.push({
	// 				fileName:result.name,
	// 				thumbnail:result.url+'@50w_50h_90Q',
	// 				enclosurepath:result.url,
	// 				size:(result.fileSize/1024).toFixed(2),
	// 				imageOrFile:result.isImage.toString().toUpperCase(),
	// 				label:"无标签",
	// 				beDelete: false,
	// 				mimeType:result.mimeType,
	// 				orientation: orientationNum
	// 			})
	// 			fetchApi('insertEnclosure','POST',JSON.stringify({
	// 				enclosureList: fileArr
	// 			}), json => {
	//
	// 				if (showMessage(json,'','','',true)) {
	// 					dispatch({
	// 						type: ActionTypes.CHANGE_EDIT_RUNNING_ENCLOSURE_LIST,
	// 						imgArr:json.data.enclosureList,
	// 						// length: enclosureCountNumber
	// 					})
	// 				}
	// 				if (index + 1 === filesLength) {
	// 					thirdParty.toast.hide()
	// 				}
	// 			})
	//
	// 		} else if (result.code == 'InvalidArgument') {
	// 			if(index + 1 === filesLength){
	// 				thirdParty.toast.hide()
	// 			}
	// 			return thirdParty.toast.info('上传失败，文件名中不能包含 \ : * ? " < > | ; ／等字符')
	// 		} else {
	// 			if(index + 1 === filesLength){
	// 				thirdParty.toast.hide()
	// 			}
	// 		}
	//
	// 		if (percent === -1) {
	// 			return thirdParty.toast.info(result)
	// 		}
	// 	}
	// })
}

export const deleteUploadFJUrl = (index,PageTab,paymentType) => (dispatch) => {
	dispatch({
		type: ActionTypes.DELETE_EDIT_RUNNING_UPLOAD_FJ_URL,
		index
	})

}

export const changeLrlsEnclosureList= () => ({
	type: ActionTypes.EDIT_RUNNING_INIT_FJ_LIST,
})

export const getLabelFetch = () => dispatch => {
	fetchApi('getLsLabel', 'POST', '', json => {
		if(showMessage(json,'','','', true)){
			dispatch({
				type: ActionTypes.EDIT_RUNNING_GET_LS_LABEL_FETCH,
				receivedData: json
			})
		}
	})
}

export const changeTagName = (index,value) => (dispatch) => {
	dispatch({
		type: ActionTypes.CHANGE_EDIT_RUNNING_TAG_NAME,
		index,
		value
	})
}

export const getWarehouseCardList = (oriState) => (dispatch, getState) => {
	const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理
    if (isOpenedWarehouse) {
		fetchApi('getWarehouseList', 'GET', `isUniform=${oriState=='STATE_CHYE_TYDJ' ? true : ''}`, json => {
			if (showMessage(json,'','','',true)) {
				dispatch({
					type: ActionTypes.RUNNING_GET_WAREHOUSE,
					receivedData: json.data.cardList,
					oriState
				})

			}
		})
    }

}

export const accountMoreCard = (dataType, value, idx) => ({
	type: ActionTypes.RUNNING_ACCOUNT_MORE_CARD,
	dataType,
	value,
	idx
})

//存货调拨获取参考单价 统一单价
export const getChdbPrice =  (idx, list) => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const storeUuid = state.getIn(['oriTemp', 'warehouseCardList', 0, 'cardUuid'])

	let stockPriceList = []
	list.forEach((v, i) => {
		let cardUuid = v['uuid']
		stockPriceList.push({cardUuid, storeUuid})
	})

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			const price = json.data[0].price == 0 ? '' : decimal(json.data[0].price, 4)

			let newStockCardList = state.getIn(['oriTemp', 'stockCardList']).toJS()
			const listLength = list.length
			newStockCardList.forEach((v, i) => {
				if (i >= idx && i <= idx+listLength-1) {
					const index = i-idx
					const price = json.data[index].price <= 0 ? '' : json.data[index].price
					v['price'] = price
					v['unitPrice'] = json.data[index].price
					v['amount'] = ''
				}
			})
			dispatch(changeLrlsData(['oriTemp', 'stockCardList'], fromJS(newStockCardList)))
		}
		// if (cardItem.get('isUniformPrice') && json.data.price <= 0) {
		// 	thirdParty.Alert(`[${cardItem.get('code')} ${cardItem.get('name')}]的单价异常，请调整单价后再录入`, '确定')
		// }
	})
}

//存货调拨获取参考单价 统一单价
export const getChdbPriceAll =  () => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const storeUuid = state.getIn(['oriTemp', 'warehouseCardList', 0, 'cardUuid'])
	const stockCardList = state.getIn(['oriTemp', 'stockCardList'])
	if (!storeUuid) {
		return
	}

	let stockPriceList = []
	stockCardList.forEach((v,idx) => {
		if (v.get('isOpenedQuantity') && v.get('cardUuid')) {
			stockPriceList.push({
				storeUuid,
				cardUuid: v.get('cardUuid')
			})
		}
	})

	if (stockPriceList.length==0) {
		return
	}
    thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			let newStockCardList = stockCardList.toJS()
			newStockCardList.forEach((v, idx) => {
				const openSerial = v['financialInfo'] ? v['financialInfo']['openSerial'] : false
				if (openSerial) {
					v['serialList'] = []
					v['quantity'] = ''
				}
				for (let item of json.data) {
					if (v['cardUuid']==item['cardUuid']) {
						const price = item.price <= 0 ? '' : decimal(item.price, 4)
						let amount = ''
						let quantity = v['quantity']

						if (price && quantity) {//计算金额
							amount = decimal(Number(price)*Number(quantity))
						}
						v['price'] = price
						v['unitPrice'] = decimal(item.price, 4)
						v['amount'] = amount
						break
					}
				}
			})
			dispatch(changeLrlsData(['oriTemp', 'stockCardList'], fromJS(newStockCardList)))
		}
	})


}

//存货余额调整获取单价
export const getChyePrice =  (list, idx, changeType) => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const oriState = state.getIn(['oriTemp', 'oriState'])

	const cardItem = state.getIn(['oriTemp', 'stockCardList', idx])
	const cardUuid = cardItem.get('cardUuid')
	const isUniformPrice = cardItem.get('isUniformPrice')
	const isOpenedQuantity = cardItem.get('isOpenedQuantity')

	let stockPriceList = []
	if (changeType=='stock') {//选择存货后
		list.forEach((v, i) => {
			let cardUuid = v['uuid']
			let storeUuid = ''
			if (i==0) {
				storeUuid = cardItem.get('warehouseCardUuid')
			}
			stockPriceList.push({cardUuid, storeUuid})
		})
	} else {//修改仓库
		stockPriceList = [{cardUuid, storeUuid: cardItem.get('warehouseCardUuid')}]
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			let newStockCardList = state.getIn(['oriTemp', 'stockCardList']).toJS()
			const listLength = list.length
			newStockCardList.forEach((v, i) => {
				if (i >= idx && i <= idx+listLength-1) {
					const index = i-idx
					const unitPrice = json.data[index].price == 0 ? '' : decimal(json.data[index].price, 4)
					v['unitPrice'] = unitPrice
					v['price'] = unitPrice <= 0 ? '' : unitPrice

					if (changeType!='stock') {//改变仓库
										
						let quantity = cardItem.get('quantity')
						const basicUnitQuantity = cardItem.get('basicUnitQuantity') ? cardItem.get('basicUnitQuantity') : 1
						const openSerial = cardItem.getIn(['financialInfo', 'openSerial'])
						if (openSerial) {
							v['serialList'] = []
							v['quantity'] = ''
							quantity = ''
						}
						v['price'] = decimal(unitPrice*basicUnitQuantity, 4)
						if (quantity) {
							v['amount'] = decimal(v['price']*quantity)
						}
					}
				}
			})
			dispatch(changeLrlsData(['oriTemp', 'stockCardList'], fromJS(newStockCardList)))
		}
	})
}

//获取进项税额类别
export const getJxsezcCategory =  () => (dispatch, getState) => {
	const lastCategory = getState().allState.get('oriCategory').toJS()
	let categoryList = []
	for (let item of lastCategory) {
		if (['LB_YYZC', 'LB_FYZC', 'LB_CQZC', 'LB_YYWZC'].includes(item['categoryType'])) {
			categoryList.push(item)
		}
	}
	dispatch({
		type: ActionTypes.RUNNING_GET_JZCB_CATEGORYLIST,
		data: categoryList
	})
}

//获取进项税额处理类别详情
export const changeHandleCategory = (item) => (dispatch, getState) => {
	const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'enableWarehouse'])
	fetchApi('getRunningDetail', 'GET', `uuid=${item['uuid']}`, json => {
		if (showMessage(json)) {
			const data = json.data.result
			if (data['beProject']) {
				dispatch(getProjectCardList(json.data.result['projectRange']))
				dispatch(getProjectTreeList())
			}
			if (data['propertyCarryover']=='SX_HW') {
				dispatch(changeLrlsData(['oriTemp', 'stockRange'], data.acBusinessExpense.stockRange))
				dispatch(getCardList('stockRange'))
				dispatch(getCostStockCategory())
			}
			dispatch({
				type: ActionTypes.RUNNING_CHANGE_HANDLECATEGORY,
				data: data
			})
		}
	})
}

//获取手续费类别详情
export const getPoundageCategory = (uuid, poundageNeedCurrent, poundageNeedProject) => (dispatch) => {
	fetchApi('getRunningDetail', 'GET', `uuid=${uuid}`, json => {
		if (showMessage(json)) {
			let jsonData = json.data.result
			if (poundageNeedCurrent && jsonData['acCost']['contactsManagement']) {
				dispatch(getPoundageCurrentList(jsonData['acCost']['contactsRange']))
				dispatch(changeLrlsData('poundageCurrentRange', fromJS(jsonData['acCost']['contactsRange']), true))
			}
			if (poundageNeedProject && jsonData['beProject']) {
				dispatch(getPoundageProjectList(jsonData['projectRange']))
				dispatch(changeLrlsData('poundageProjectRange', fromJS(jsonData['projectRange']), true))
			}
		}
	})
}

//获取手续费往来列表
export const getPoundageCurrentList = (categoryList) => (dispatch, getState) => {
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	fetchApi('getCurrentCardList', 'POST', JSON.stringify({
		sobId,
		property: 'NEEDPAY',
		categoryList,
	}),json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_CARDLIST,
				data: json.data.result,
				cardType: 'poundageCurrent'
			})
		}
	})
}

//获取手续费项目列表
export const getPoundageProjectList = (categoryList) => (dispatch, getState) => {
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	fetchApi('getProjectCardList', 'POST', JSON.stringify({
		sobId,
		categoryList,
		needCommonCard: true,
		needAssist: true,
		needMake: true,
		needIndirect: true,
		needMechanical: true,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_PROJECT_CARDLIST,
				receivedData: json.data.result,
				cardType: 'poundageProjectList'
			})
		}
	})
}

//获取结转成本卡片类别--营业收入 支出
export const getCostStockCategory = () => (dispatch, getState) => {
	const state = getState().editRunningState
	const categoryType = state.getIn(['oriTemp', 'categoryType'])
	let str = ''
	if (categoryType=='LB_JZCB') {
		const oriDate = state.getIn(['oriTemp', 'oriDate'])
		const oriState = state.getIn(['oriTemp', 'oriState'])
		const categoryUuid = state.getIn(['oriTemp', 'relationCategoryUuid'])
		let oriUuid = state.getIn(['oriTemp', 'oriUuid'])
		oriUuid = oriUuid ? oriUuid : ''
		str = `oriDate=${oriDate}&oriState=${oriState}&oriUuid=${oriUuid}`
		if (oriState=='STATE_YYSR_ZJ') {
			if (!categoryUuid) {
				return
			}
			str = `oriDate=${oriDate}&oriState=${oriState}&oriUuid=${oriUuid}&categoryUuid=${categoryUuid}`
		}
	}
	fetchApi('getCostStockCategory', 'GET', str, json => {
		if (showMessage(json)) {
			dispatch(changeLrlsData('stockCategoryList', fromJS(json.data.typeList), true))
		}
	})
}

export const getStockListByCategory =(value, cardType='commonCardList') => (dispatch, getState) => {
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	const state = getState().editRunningState
	const oriState = state.getIn(['oriTemp', 'oriState'])

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getRunningStockMemberList','POST', JSON.stringify({
		sobId,
		property:'0',
		listByCategory: value['top'] ? 'true' : 'false',
		categoryUuid: value['uuid'],
		subordinateUuid: value['uuid'],
		isUniform: oriState=='STATE_CHYE_TYDJ' ? true : null,
		openQuantity: oriState=='STATE_CHYE_TYDJ' ? true : null,
	}),json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_CARDLIST,
				data: json.data.resultList,
				cardType,
			})
		}
	})
}


export const getCurrentTree =() => (dispatch, getState) => {
	const state = getState().editRunningState
	const categoryType = state.getIn(['oriTemp', 'categoryType'])
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	let categoryList = state.getIn(['oriTemp', editRunning.categoryTypeObj[categoryType], 'contactsRange'])
	fetchApi('getCurrentTree','POST', JSON.stringify({
		sobId,
		categoryList
	}),json => {
		if (showMessage(json)) {
			dispatch(changeLrlsData('currentCategoryList', fromJS(json.data.typeList), true))
		}
	})
}

export const getCurrentListByCategory =(value) => (dispatch, getState) => {
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	fetchApi('getCurrentListByCategory','POST', JSON.stringify({
		sobId,
		property:'',
		used: true,
		listByCategory: value['top'] ? true : false,
		categoryUuid: value['uuid'],
		subordinateUuid: value['uuid']
	}),json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_CARDLIST,
				data: json.data.resultList,
				cardType: 'commonCurrentList'
			})
		}
	})
}


export const getProjectTreeList =() => (dispatch, getState) => {
	const state = getState().editRunningState
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	const categoryType = state.getIn(['oriTemp', 'categoryType'])
	const oriState = state.getIn(['oriTemp', 'oriState'])

	let projectProperty = undefined, notProjectProperty = undefined
	if (categoryType=='LB_CHTRXM') {
		notProjectProperty = 'XZ_LOSS'
	}
	if (categoryType=='LB_GGFYFT') {
		projectProperty = {
			'STATE_GGFYFT': 'XZ_LOSS',
			'STATE_FZSCCB': 'XZ_PRODUCE',
			'STATE_ZZFY': 'XZ_PRODUCE',
			'STATE_JJFY': 'XZ_CONSTRUCTION',
			'STATE_JXZY': 'XZ_CONSTRUCTION'
		}[oriState]
	}
	if (categoryType=='LB_XMJZ') {
		fetchApi('xmjzProjectTree','GET', '',json => {
			if (showMessage(json)) {
				dispatch(changeLrlsData('projectCategoryList', fromJS(json.data.typeList), true))
			}
		})
		return
	}

	fetchApi('getProjectAllCardList','POST', JSON.stringify({
		sobId,
		projectProperty,
		notProjectProperty,
	}),json => {
		if (showMessage(json)) {
			dispatch(changeLrlsData('projectCategoryList', fromJS(json.data.typeList), true))
		}
	})
}

export const getProjectListByCategory =(value, cardType='commonProjectList') => (dispatch, getState) => {
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
	const editRunningState = getState().editRunningState
	const categoryType = editRunningState.getIn(['oriTemp', 'categoryType'])

	if (categoryType=='LB_XMJZ') {
		const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
		fetchApi('xmjzProjectListByCategory','POST', JSON.stringify({
			oriDate,
			cardCategoryUuid: value['top'] ? value['uuid'] : '',
			subordinateUuid: value['top'] ? '' : value['uuid'],
		}),json => {
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.RUNNING_GET_PROJECT_CARDLIST,
					receivedData: json.data.result,
					cardType,
				})
			}
		})
		return
	}
	fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
		sobId,
		listByCategory: value['top'] ? true : false,
		categoryUuid: value['uuid'],
		subordinateUuid: value['uuid'],
		projectProperty: categoryType=='LB_CHTRXM' ? 'XZ_PRODUCE' : undefined

	}),json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.RUNNING_GET_PROJECT_CARDLIST,
				receivedData: json.data.resultList,
				cardType,
			})
		}
	})
}

//存货组装批量获取单价
export const getChzzListPrice =  (idx, list, cardType='stockCardList') => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const oriStoreUuid = state.getIn(['oriTemp', cardType, idx, 'warehouseCardUuid'])

	let stockPriceList = []
	list.forEach((v, i) => {
		let cardUuid = v['uuid'], storeUuid = ''
		if (i==0 && oriStoreUuid) {
			storeUuid = oriStoreUuid
		}
		stockPriceList.push({cardUuid, storeUuid, name: v['oriName']})
	})

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			let newStockCardList = state.getIn(['oriTemp', cardType]).toJS()
			const listLength = list.length
			newStockCardList.forEach((v, i) => {
				if (i >= idx && i <= idx+listLength-1) {
					const index = i-idx
					const price = json.data[index].price <= 0 ? '' : json.data[index].price
					v['price'] = price
					v['unitPrice'] = json.data[index].price
					v['amount'] = ''
				}
			})
			dispatch(changeLrlsData(['oriTemp', cardType], fromJS(newStockCardList)))
		}
	})
}

//存货组装获取单价 修改仓库后
export const getChzzPrice =  (idx, cardType='stockCardList') => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const storeUuid = state.getIn(['oriTemp', cardType, idx, 'warehouseCardUuid'])
	const item = state.getIn(['oriTemp', cardType, idx])
	const cardUuid = item.get('cardUuid')
	if (!cardUuid) {
		return
	}

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList: [{
			cardUuid,
			storeUuid
		}]
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			const unitPrice = json.data[0].price == 0 ? '' : json.data[0].price
			let price = unitPrice <= 0 ? '' : unitPrice, amount = ''

			if (item.get('isOpenedQuantity')) {
				const basicUnitQuantity = item.get('basicUnitQuantity') ? item.get('basicUnitQuantity') : 1
				price = decimal(unitPrice*basicUnitQuantity, 4)
				if (item.get('quantity')) {
					amount = decimal(price*item.get('quantity'))
				}
			}
			let newItem = item.toJS()
			newItem['price'] = price
			newItem['unitPrice'] = unitPrice
			newItem['amount'] = amount
			dispatch(changeLrlsData(['oriTemp', cardType, idx], fromJS(newItem)))
		}
	})
}

//存货组装 组装单 批量获取单价
export const getChzzZzdListPrice =  (idx) => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])

	let stockPriceList = []
	state.getIn(['oriTemp', 'stockCardList', idx, 'childCardList']).forEach((v, i) => {
		let cardUuid = v.get('cardUuid'), storeUuid = ''
		stockPriceList.push({cardUuid, storeUuid})
	})

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			let newStockCardList = state.getIn(['oriTemp', 'stockCardList', idx]).toJS()

			newStockCardList['childCardList'].forEach((v, i) => {
				const price = json.data[i].price <= 0 ? '' : json.data[i].price
				const basicUnitQuantity = v['basicUnitQuantity'] ? v['basicUnitQuantity'] : 1
				const amount = decimal(Number(v['quantity'])*Number(price)*Number(basicUnitQuantity))
				v['price'] = price
				v['unitPrice'] = json.data[i].price
				v['amount'] = amount ? amount : ''
			})
			dispatch(changeLrlsData(['oriTemp', 'stockCardList', idx], fromJS(newStockCardList)))
		}
	})
}

//存货组装 组装单 获取单价 修改仓库后
export const getChzzZzdPrice =  (idx, cardType='stockCardList') => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const storeUuid = state.getIn(['oriTemp', cardType, idx[0], 'childCardList', idx[1], 'warehouseCardUuid'])
	const item = state.getIn(['oriTemp', cardType, idx[0], 'childCardList', idx[1]])
	const cardUuid = item.get('cardUuid')

	if (!cardUuid) { return }

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList: [{
			cardUuid,
			storeUuid
		}]
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			const unitPrice = json.data[0].price == 0 ? '' : json.data[0].price
			let price = unitPrice, amount = ''

			if (item.get('isOpenedQuantity')) {
				const basicUnitQuantity = item.get('basicUnitQuantity') ? item.get('basicUnitQuantity') : 1
				price = decimal(unitPrice*basicUnitQuantity, 4)
				if (item.get('quantity')) {
					amount = decimal(price*item.get('quantity'))
				}
			}
			let newItem = item.toJS()
			newItem['price'] = price
			newItem['unitPrice'] = unitPrice
			newItem['amount'] = amount
			dispatch(changeLrlsData(['oriTemp', cardType, idx[0], 'childCardList', idx[1]], fromJS(newItem)))
		}
	})
}

//获取存货组装单存货成品列表
export const chzzAssemblyList =(value, cardType='commonAssemblyList') => (dispatch) => {
	fetchApi('chzzAssemblyList','GET', `listByCategory=${value['top'] ? true : false}&categoryUuid=${value['uuid']}&currentPage=0&pageSize=200`,json => {
		if (showMessage(json)) {
			let list = []
			json.data.resultList.forEach(v => {
				v['oriName'] = v['name']
				v['name'] = `${v['code']} ${v['name']}`
				v['uuid'] = v['productUuid']
                list.push(v)
			})

			dispatch(changeLrlsData(['cardAllList', cardType], fromJS(list)))
		}
	})
}

//存货卡片新增属性
export const addInventoryAssist = (data, cardType, oriState) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('assistPropertyInsert', 'POST', JSON.stringify(
        data// {inventoryUuid, classificationUuid, name}
    ), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if (json.code == 0) {
				dispatch(changeYysrStockCard('addAssist', fromJS({cardData: data, propertyList: json.data}), '', undefined, cardType))

				if (oriState=='STATE_CHZZ_ZZD') {//组装单组装
					return dispatch(chzzAssemblyList({top: true, uuid: ''}, 'assemblyList'))
				}
				dispatch(getCardList('stockRange'))
            }
		}
	})
}

//获取存货批次列表
export const getBatchList = (inventoryUuid, resolve) => (dispatch, getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getBatchList', 'POST', JSON.stringify({
		inventoryUuid,
		canUse: true,
	}), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if (json.code === 0) {
				let batchList = []
				const openShelfLife = json.data.openShelfLife
				json.data.batchList.forEach(v => {
					const batch = v['batch']
					const expirationDate = v['expirationDate'] ? v['expirationDate'] : ''
					const keyStr = (openShelfLife && expirationDate) ? `${batch}(${expirationDate})` : batch

					v['key']=keyStr
					v['value']=batch
					batchList.push(v)
				})
				dispatch(changeLrlsData(['cardAllList', 'batchList'], fromJS(batchList)))
				resolve ? resolve() : null
            }
		}
	})
}

//获取存货在库的所有序列号列表（出库时用）
export const getSerialListIn = (data, resolve) => (dispatch, getState) => {
	const state = getState().editRunningState
	const oriDate = state.getIn(['oriTemp', 'oriDate'])
	const jrIndex = state.getIn(['oriTemp', 'jrIndex'])
	const oriState = state.getIn(['oriTemp', 'oriState'])
	
	data['oriDate']= ['STATE_YYSR_ZJ'].includes(oriState) ? undefined : oriDate
	data['jrIndex']= jrIndex ? jrIndex : undefined

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getSerialListIn', 'POST', JSON.stringify(data), json => {
        thirdParty.toast.hide()
		if (showMessage(json)) {
            if (json.code === 0) {
				let serialList = []
				json.data.forEach(v => {
					v['key']=v['serialNumber']
					v['value']=v['serialUuid']
					serialList.push(v)
				})
				dispatch(changeLrlsData(['cardAllList', 'serialList'], fromJS(serialList)))
				resolve ? resolve() : null
            }
		}
	})
}

//获取存货卡片选择的序列号列表
export const getSerialListChecked = (data, setSerial) => (dispatch, getState) => {
    fetchApi('getSerialList', 'POST', JSON.stringify(data), json => {
		if (showMessage(json)) {
            if (json.code === 0) {
				setSerial(fromJS(json.data))
            }
		}
	})
}
