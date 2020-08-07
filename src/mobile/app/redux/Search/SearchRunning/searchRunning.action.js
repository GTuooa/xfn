import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import fetchConstantApi from 'app/constants/fetch.constant'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { fromJS }	from 'immutable'
import { pushVouhcerToLrpzReducer } from 'app/redux/Search/Cxpz/cxpz.action'

import { setCkpzIsShow } from 'app/redux/Edit/Lrpz/lrpzExport.action'
import * as allActions from 'app/redux/Home/All/other.action'

// 获取账期和列表
export const getPeriodAndBusinessList = () => (dispatch) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getRunningBusinessList', 'POST', JSON.stringify({
		isAccount: false,
		accountUuid: '',
		currentPage: 1,
		getPeriod: 'true',
		start: '',
		end: '',
		pageSize: 20,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			const issuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
			const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
			dispatch({
				type: ActionTypes.SEARCHRUNNING_GETPERIOD_AND_BUSINESSLIST,
				receivedData: json.data,
				issues,
				issuedate,
			})
		}
	})
}

//获取数据列表
export const getBusinessList = (currentPage, shouldConcat, _self) => (dispatch, getState) => {
	//页数 currentPage  //shouldConcat 需要连接接数据 是否因为滚动触发
	const views = getState().searchRunningState.get('views')
	const start = views.get('start')
	const end = views.get('end') ? views.get('end') : start
	const cardObj = views.get('cardObj')
	const cardType = cardObj.get('cardType')
	const searchContent = cardObj.get('searchContent')
	const isSearch = cardObj.get('isSearch')
	let isAccount = false
	if (cardType=='ACCOUNT') {
		isAccount = true
	}

	const cardName = {
		'ALL': 'noCard',
		'ACCOUNT': 'accountUuid',
		'PROJECT': 'projectCardUuid',
		'STOCK': 'stockCardUuid',
		'CURRENT': 'currentCardUuid',
		'SEARCH_TYPE_ABSTRACT': 'searchType',
		'SEARCH_TYPE_RUNNING_TYPE': 'searchType',
		'SEARCH_TYPE_AMOUNT': 'searchType',
		'SEARCH_TYPE_CREATE_NAME': 'searchType',
		'SEARCH_TYPE_CATEGORY_TYPE': 'searchType',
	}[cardType]

	!shouldConcat && thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getRunningBusinessList', 'POST', JSON.stringify({
		currentPage: currentPage,
		getPeriod: 'false',
		start,
		pageSize: 20,
		end,
		[cardName]: cardObj.get('cardUuid')=='SEARCH_TYPE_AMOUNT' && searchContent=='' ? '' : cardObj.get('cardUuid'),
		isAccount,
		searchContent: isSearch ? searchContent : '',
	}), json => {
		!shouldConcat && thirdParty.toast.hide()
		if (showMessage(json)) {
			if(shouldConcat) {
				_self.setState({
					isLoading: false
				})
			}
			dispatch({
				type: ActionTypes.SEARCHRUNNING_GET_BUSINESSLIST,
				receivedData: json.data,
				currentPage,
				shouldConcat
			})
		}
	})

}

export const changeCxlsData = (dataType, value) => ({
	type: ActionTypes.CHANGE_SEARCHRUNNING_DATA,
	dataType,
	value
})

//从新获取数据
export const recapture = (selectedIndex) => (dispatch) => {
	switch (selectedIndex) {
		case 'CXLS':
			dispatch(getBusinessList(1, false))
			break
		// case 'CX_SFGL':
		// 	dispatch(cxAccountActions.getManageList())
		// 	break
		// case 'CX_KJFP':
		// 	dispatch(cxAccountActions.getKjfpList())
		// 	break
		// case 'CX_FPRZ':
		// 	dispatch(cxAccountActions.getFprzList())
		// 	break
		// case 'CX_JZCB':
		// 	dispatch(cxAccountActions.getFirstStockCardList())
		// 	dispatch(cxAccountActions.getJzcbList())
		// 	break

		default: console.log('重新获取数据失败');
	}
}

//删除流水
export const deleteLs = (dataList, selectedIndex) => (dispatch) => {
	thirdParty.Confirm({
		message: '确定删除吗',
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				const deleteList = dataList.filter(v => v.get('selected')).map(v => v.get('oriUuid'))
				thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
				fetchApi('deleteRunningbusiness', 'POST', JSON.stringify({
					deleteList
				}), json => {
					if (showMessage(json)) {
						if (json.data.errorList.length) {
							let info = json.data.errorList.reduce((v, pre) => v + ',' + pre)
							thirdParty.Alert(info)
						}
						dispatch(recapture(selectedIndex))
					}
				})
			}
		},
		onFail : (err) => alert(err)
	})
}

//全选
export const selectLsAll = (selectedIndex, value) => ({
	type: ActionTypes.SEARCHRUNNING_SELECT_LS_ALL,
	selectedIndex,
	value
})

//单选
export const selectLs = (selectedIndex, idx) => ({
	type: ActionTypes.SEARCHRUNNING_SELECT_LS,
	selectedIndex,
	idx
})

//获取单笔流水
export const getCxlsSingle = (history, oriUuid, jrJvUuid, toRouter, direction, fromPage, actionFrom) => (dispatch) => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getRunningBusiness', 'GET', `oriUuid=${oriUuid}`, json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_SEARCHRUNNING_SINGLE,
				receivedData: json.data,
				toRouter,
				direction,
				jrJvUuid,
				// fromPage: 'searchRunning', // searchRunning || searchApproval
				fromPage: fromPage, // searchRunning || searchApproval
				actionFrom,
			})
			history.push(`/searchrunning/${toRouter.toLowerCase()}`)
		}
	})
}

//单笔开具发票
export const saveKjfp = (history) => (dispatch, getState) => {
	const state = getState().searchRunningState
	let data = state.get('data').toJS()
	const hideCategoryList = getState().allState.get('hideCategoryList')
	let categoryUuid = ''
	for (let v of hideCategoryList) {
		if (v.get('categoryType') == 'LB_KJFP') {
			categoryUuid = v.get('uuid')
			break
		}
	}
	data['categoryUuid'] = categoryUuid

	//校验
	if (data['oriAbstract'] == '') {
		return thirdParty.toast.info('请填写摘要')
	}
	if (data['oriAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
		return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
	}
	if (Math.abs(data['amount']) == 0) {
		return thirdParty.toast.info('请填写金额')
	}
	if (data['oriState'] == 'STATE_KJFP_TS') {
		data['amount'] = -Math.abs(data['amount'])
	}
	if (dateCheck(data['oriDate'], data['pendingStrongList'][0]['oriDate'])) {
		return thirdParty.toast.info('日期必须大于或等于待处理流水日期')
	}
	if (Math.abs(data['amount']) > Math.abs(data['jrAmount'])) {
		return thirdParty.toast.info('开票税额不能大于待开票税额')
	}

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('insertBusinessMakeoutItem', 'POST', JSON.stringify({
		...data,
		enclosureList: getState().enclosureState.get('enclosureList').toJS()
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			history.goBack()
		}
	})
}

//单笔发票认证
export const saveFprz = (history) => (dispatch, getState) => {
	const state = getState().searchRunningState
	const data = state.get('data').toJS()

	const hideCategoryList = getState().allState.get('hideCategoryList')
	let categoryUuid = ''
	for (let v of hideCategoryList) {
		if (v.get('categoryType') == 'LB_FPRZ') {
			categoryUuid = v.get('uuid')
			break
		}
	}
	data['categoryUuid'] = categoryUuid

	//校验
	if (data['oriAbstract'] == '') {
		return thirdParty.toast.info('请填写摘要')
	}
	if (data['oriAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
		return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
	}
	if (Math.abs(data['amount']) == 0) {
		return thirdParty.toast.info('请填写金额')
	}
	if (data['oriState'] == 'STATE_FPRZ_TG') {
		data['amount'] = -Math.abs(data['amount'])
	}
	if (dateCheck(data['oriDate'], data['pendingStrongList'][0]['oriDate'])) {
		return thirdParty.toast.info('日期必须大于或等于待处理流水日期')
	}

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('insertBusinessAuthItem', 'POST', JSON.stringify({
		...data,
		enclosureList: getState().enclosureState.get('enclosureList').toJS(),
		action: 'QUERY_JR-QUICK_OPERATION-INVOICE'
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			history.goBack()
		}
	})
}

//获取结转损益项目列表
export const getProjectCardList = (categoryList) => (dispatch, getState) => {//获取项目卡片列表
	const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getProjectCardList', 'POST', JSON.stringify({
		sobId,
		categoryList,
		needCommonCard: false
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.SEARCHRUNNING_GET_PROJECT_CARDLIST,
				receivedData: json.data.result
			})
		}
	})
}

//单笔结转损益
export const saveJzsy =  (history) => (dispatch, getState) => {
	const state = getState().searchRunningState
	const data = state.get('data').toJS()

	const usedProject = data['usedProject']
	const projectCardList = data['projectCardList']
	if (usedProject) {
		const hasEmpty = projectCardList.every(v => {
			return v['cardUuid']
		})
		if (!hasEmpty) {
			return thirdParty.toast.info('有未选择的项目卡片')
		}
	} else {
		delete data['projectCardList']
	}

	//校验
	if (data['oriAbstract'] == '') {
		return thirdParty.toast.info('请填写摘要')
	}
	if (data['oriAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
		return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
	}
	const originalAssetsAmount = data['assets']['originalAssetsAmount']
	const depreciationAmount = data['assets']['depreciationAmount']
	if ( originalAssetsAmount <= 0) {
		return thirdParty.toast.info('请填写资产原值')
	}
	if (Number(depreciationAmount) > Number(originalAssetsAmount)) {
		return thirdParty.toast.info('折旧额不能大于原值')
	}
	if (dateCheck(data['oriDate'], data['pendingStrongList'][0]['oriDate'])) {
		return thirdParty.toast.info('日期必须大于或等于待处理流水日期')
	}

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('insertJzsy', 'POST', JSON.stringify({
		...data,
		enclosureList: getState().enclosureState.get('enclosureList').toJS(),
		action: 'QUERY_JR-QUICK_OPERATION-DISPOSAL_PROFIT_LOSS',
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			history.goBack()
		}

	})
}

//单笔收付管理
export const saveSfgl = (history) => (dispatch, getState) => {
	const state = getState().searchRunningState
	const fromPage = state.getIn(['views', 'fromPage'])
	const fromPageType = state.getIn(['views', 'fromPageType'])

	let data = state.get('data').toJS()
	let amount = data['amount']
	let notHandleAmount = data['notHandleAmount']

	//校验
	if (data['accounts'][0]['accountUuid'] == '') {
		return thirdParty.toast.info('请选择账户')
	}
	if (data['oriAbstract'] == '') {
		return thirdParty.toast.info('请填写摘要')
	}
	if (data['oriAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
		return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
	}
	if (amount <=0) {
		return thirdParty.toast.info('请填写金额')
	}
	if (amount > notHandleAmount) {
		return thirdParty.toast.info('收付款金额大于实际发生金额')
	}
	if (dateCheck(data['oriDate'], data['pendingManageDto']['oriDate'])) {
		return thirdParty.toast.info('日期必须大于或等于待处理流水日期')
	}

	//账户手续费的校验
    let needUsedPoundage = false, poundageCurrentCardList = [], poundageProjectCardList = []
    if (data['amountTitle'].includes('收款')) {
        const hasNeedPoundage = state.getIn(['data', 'accounts']).some(v => v.getIn(['poundage', 'needPoundage']))
        if (hasNeedPoundage && data['needUsedPoundage']) {
            needUsedPoundage = true
            poundageCurrentCardList =data['poundageCurrentCardList']
            poundageProjectCardList = data['poundageProjectCardList']
        }
    }
    data['needUsedPoundage'] = needUsedPoundage
    data['poundageCurrentCardList'] = poundageCurrentCardList
	data['poundageProjectCardList'] = poundageProjectCardList


	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('insertRunningpayment', 'POST', JSON.stringify({
		...data,
		action: fromPageType,
		enclosureList: getState().enclosureState.get('enclosureList').toJS()
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			thirdParty.toast.success('保存成功', 2)
			history.goBack()
		}
	})
}

//单笔薪酬支出发放
export const saveXczc = (history) => (dispatch, getState) => {
	const state = getState().searchRunningState

	let data = state.get('data').toJS()
	let amount = data['amount']
	let notHandleAmount = data['notHandleAmount']

	//校验
	if (data['accounts'][0]['accountUuid'] == '') {
		return thirdParty.toast.info('请选择账户')
	}
	if (data['oriAbstract'] == '') {
		return thirdParty.toast.info('请填写摘要')
	}
	if (data['oriAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
		return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
	}
	if (amount <=0) {
		return thirdParty.toast.info('请填写金额')
	}
	if (amount > Math.abs(notHandleAmount)) {
		return thirdParty.toast.info('金额大于实际发生金额')
	}
	if (dateCheck(data['oriDate'], data['pendingStrongList'][0]['oriDate'])) {
		return thirdParty.toast.info('日期必须大于或等于待处理流水日期')
	}

	//账户手续费的校验
    let needUsedPoundage = false, poundageCurrentCardList = [], poundageProjectCardList = []
    if (notHandleAmount < 0) {
        const hasNeedPoundage = state.getIn(['data', 'accounts']).some(v => v.getIn(['poundage', 'needPoundage']))
        if (hasNeedPoundage && data['needUsedPoundage']) {
            needUsedPoundage = true
            poundageCurrentCardList =data['poundageCurrentCardList']
            poundageProjectCardList = data['poundageProjectCardList']
        }
    }
    data['needUsedPoundage'] = needUsedPoundage
    data['poundageCurrentCardList'] = poundageCurrentCardList
    data['poundageProjectCardList'] = poundageProjectCardList

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('insertPayment', 'POST', JSON.stringify({
		...data,
		enclosureList: getState().enclosureState.get('enclosureList').toJS()
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			thirdParty.toast.success('保存成功', 2)
			history.goBack()
		}
	})
}

//单笔薪酬支出 税费支出缴纳
export const saveDefray = (history) => (dispatch, getState) => {
	const state = getState().searchRunningState

	let data = state.get('data').toJS()
	const oriState = data['oriState']
	let notHandleAmount = Math.abs(data['notHandleAmount'])

	//校验
	if (data['accounts'][0]['accountUuid'] == '') {
		return thirdParty.toast.info('请选择账户')
	}
	if (data['oriAbstract'] == '') {
		return thirdParty.toast.info('请填写摘要')
	}
	if (data['oriAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
		return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
	}
	if (oriState=='STATE_SF_JN' && data['amount'] <=0) {
		return thirdParty.toast.info('请填写金额')
	}
	if (oriState=='STATE_SF_JN' && data['amount'] > notHandleAmount) {
		return thirdParty.toast.info('付款金额大于实际发生金额')
	}
	if (oriState=='STATE_XC_JN' && data['payment']['actualAmount'] <=0) {
		return thirdParty.toast.info('请填写金额')
	}
	if (oriState=='STATE_XC_JN' && data['payment']['actualAmount'] > notHandleAmount) {
		return thirdParty.toast.info('金额大于实际发生金额')
	}
	if (dateCheck(data['oriDate'], data['pendingStrongList'][0]['oriDate'])) {
		return thirdParty.toast.info('日期必须大于或等于待处理流水日期')
	}
	//账户手续费的校验
    let needUsedPoundage = false, poundageCurrentCardList = [], poundageProjectCardList = []
    if (data['notHandleAmount'] < 0) {
        const hasNeedPoundage = state.getIn(['data', 'accounts']).some(v => v.getIn(['poundage', 'needPoundage']))
        if (hasNeedPoundage && data['needUsedPoundage']) {
            needUsedPoundage = true
            poundageCurrentCardList =data['poundageCurrentCardList']
            poundageProjectCardList = data['poundageProjectCardList']
        }
    }
    data['needUsedPoundage'] = needUsedPoundage
    data['poundageCurrentCardList'] = poundageCurrentCardList
    data['poundageProjectCardList'] = poundageProjectCardList

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(oriState=='STATE_XC_JN' ? 'insertPayment' : 'insertTax', 'POST', JSON.stringify({
		...data,
		enclosureList: getState().enclosureState.get('enclosureList').toJS()
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			thirdParty.toast.success('保存成功', 2)
			history.goBack()
		}
	})
}

//单笔暂收暂付退还
export const saveZsfkx = (history) => (dispatch, getState) => {
	const state = getState().searchRunningState

	let data = state.get('data').toJS()
	const oriState = data['oriState']
	let notHandleAmount = data['notHandleAmount']

	//校验
	if (data['accounts'][0]['accountUuid'] == '') {
		return thirdParty.toast.info('请选择账户')
	}
	if (data['oriAbstract'] == '') {
		return thirdParty.toast.info('请填写摘要')
	}
	if (data['oriAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
		return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
	}
	if (data['amount'] <=0) {
		return thirdParty.toast.info('请填写金额')
	}
	if (data['amount'] > notHandleAmount) {
		return thirdParty.toast.info('收付款金额大于实际发生金额')
	}
	if (dateCheck(data['oriDate'], data['pendingStrongList'][0]['oriDate'])) {
		return thirdParty.toast.info('日期必须大于或等于待处理流水日期')
	}

	//账户手续费的校验
    let needUsedPoundage = false, poundageCurrentCardList = [], poundageProjectCardList = []
    if (oriState != 'STATE_ZS_TH') {
        const hasNeedPoundage = state.getIn(['data', 'accounts']).some(v => v.getIn(['poundage', 'needPoundage']))
        if (hasNeedPoundage && data['needUsedPoundage']) {
            needUsedPoundage = true
            poundageCurrentCardList =data['poundageCurrentCardList']
            poundageProjectCardList = data['poundageProjectCardList']
        }
    }
    data['needUsedPoundage'] = needUsedPoundage
    data['poundageCurrentCardList'] = poundageCurrentCardList
    data['poundageProjectCardList'] = poundageProjectCardList

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(oriState=='STATE_ZS_TH' ? 'insertTemporaryReceipt' : 'insertTemporaryPay', 'POST', JSON.stringify({
		...data,
		enclosureList: getState().enclosureState.get('enclosureList').toJS()
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			thirdParty.toast.success('保存成功', 2)
			history.goBack()
		}
	})
}

export const initCxls = () => ({
	type: ActionTypes.INIT_SEARCH_RUNNING
})

export const getVcFetch = (data, history) => dispatch => {//预览凭证
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchConstantApi('getvc', 'POST', JSON.stringify({
		vcindex: data.get('vcIndex'),
		year: data.get('year'),
		month: data.get('month')
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			history.push('/lrpz')
			dispatch(pushVouhcerToLrpzReducer(json.data))
			sessionStorage.setItem('from-cxls', true)
			dispatch(setCkpzIsShow(true))
		}
	})
}

function dateCheck (oriDate, jrDate) {
	let returnValue = false
	if (Date.parse(oriDate) < Date.parse(jrDate)) {
		returnValue = true
	}
	return returnValue
}

//获取卡片列表
export const getCardList = (checkCard=true) => (dispatch, getState) => {
	const views = getState().searchRunningState.get('views')
	const start = views.get('start')
	const end = views.get('end') ? views.get('end') : start
	const cardObj = views.get('cardObj')
	const cardType = cardObj.get('cardType')
	const cardUuid = cardObj.get('cardUuid')
	const cardTypeList = {
		'PROJECT': 'CARD4THING',
		'STOCK': 'CARD4STUFF',
		'CURRENT': 'CARD4PERSON',
		'ACCOUNT': 'CARD4ACCOUNT',
	}

	fetchApi('searchRunningCard', 'GET', `cardType=${cardTypeList[cardType]}&start=${start}&end=${end}`, json => {
		if (showMessage(json,'','','',true)) {
			dispatch({
				type: ActionTypes.GET_SEARCHRUNNING_CARD,
				receivedData: json.data,
				cardType: {
					'PROJECT':'projectCardList',
					'STOCK':'stockCardList',
					'CURRENT':'currentCardList',
					'ACCOUNT':'accounCardtList'
				}[cardType]
			})
			if (checkCard && cardUuid) {//具体卡片不为全部
				const cardUuidList = json.data.map(v => v['cardUuid'])
				if (!cardUuidList.includes(cardUuid)) {
					dispatch(changeCxlsData(['views', 'cardObj'], fromJS({
						cardType: cardType,
						cardUuid: '',
						name: '全部'
					})))

					dispatch(getBusinessList(1, false))
				}
			}

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
			}
			if (poundageNeedProject && jsonData['beProject']) {
				dispatch(getPoundageProjectList(jsonData['projectRange']))
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
				type: ActionTypes.SEARCHRUNNING_GET_CARDLIST,
				receivedData: json.data.result,
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
				type: ActionTypes.SEARCHRUNNING_GET_CARDLIST,
				receivedData: json.data.result,
				cardType: 'poundageProject'
			})
		}
	})
}

//审核流水
export const insertRunningBusinessVc = () => (dispatch, getState) => {
	const dataList = getState().searchRunningState.get('dataList').toJS()
	const filterList = dataList.filter(v => v['selected'] && !v['beCertificate'])
	let errMessage = []
	async function loop () {
		thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
		for (let index = 0; index < filterList.length; index++) {
			const item = filterList[index]
			await new Promise(resolve => {
				fetchApi('insertRunningBusinessVc', 'POST', JSON.stringify({
					uuidList: [item['oriUuid']],
					vcindexlist: [item['jrIndex']],
					year: item['oriDate'].slice(0,4),
					month: item['oriDate'].slice(5,7),
					action: 'QUERY_JR-AUDIT'
				}), json => {
					resolve()
					if (showMessage(json, '', '', '', true)) {
						if (json.data.result.length) {
							const info = json.data.result.reduce((v, pre) => v + ',' + pre)
							errMessage.push(info)
						}
			
					}
				})
			})
			
		}
		thirdParty.toast.hide()
		errMessage.length && thirdParty.Alert(errMessage.join('、'))
		dispatch(getBusinessList(1, false))
	}
	loop()
}

//反审核流水
export const deleteRunningBusinessVc = () => (dispatch, getState) => {
	const dataList = getState().searchRunningState.get('dataList').toJS()
	const filterList = dataList.filter(v => v['selected'] && v['beCertificate'])
	let errMessage = ''

	async function loop () {
		thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
		for (let index = 0; index < filterList.length; index++) {
			const item = filterList[index]['vcList'][0]
			await new Promise(resolve => {
				fetchApi('deletevc', 'POST', JSON.stringify({
					year: item['year'],
					month: item['month'],
					vcindexlist: [item['vcIndex']],
					action: 'QUERY_JR-CANCEL_AUDIT'
				}), json => {
					resolve()
					if (json.code==15008) {
						errMessage=json.message
					}
				})
			})
			
		}
		thirdParty.toast.hide()
		errMessage && thirdParty.Alert(errMessage)
		dispatch(getBusinessList(1, false))
	}

	loop()
}