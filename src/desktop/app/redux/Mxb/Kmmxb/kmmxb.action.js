import { showMessage, jsonifyDate } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import thirdParty from 'app/thirdParty'
import { DateLib, getTreeData } from 'app/utils'
import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import { message } from 'antd'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

// 明细表刷新操作，用于重新获取账期
// param = {issuedate endissuedate acId assId assCategory condition currentPage}
export const getPeriodAndMxbAclistFetch = (param) => dispatch => {
	dispatch(AllGetMxbAclistListFetch(param, 'true'))
}

// 获取明细表的aclist
export const getMxbAclistFetch = (param) => dispatch => {
	dispatch(AllGetMxbAclistListFetch(param))
}

const AllGetMxbAclistListFetch = (param, getPeriod) => (dispatch, getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const issuedate = param.issuedate
	const endissuedate = param.endissuedate

	fetchApi('getreportacdetailtree', 'POST', JSON.stringify({
		begin: issuedate ? issuedate : '',
		end: endissuedate ? endissuedate : '',
		getPeriod
	}), json => {
		if (showMessage(json)) {

			if (getPeriod == 'true') {

				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : `${openedissuedate.substr(0, 4)}-${openedissuedate.substr(6, 2)}`
				const endissuedateNew = endissuedate ? endissuedate : `${openedissuedate.substr(0, 4)}-${openedissuedate.substr(6, 2)}`

				param.issuedate = issuedateNew
				param.endissuedate = endissuedateNew

				dispatch(freshMxbAcList(json.data.tree, param))
			} else {
				dispatch(freshMxbAcList(json.data.tree, param))
			}

		} else {
			dispatch({type: ActionTypes.INIT_MXB})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})

}

const freshMxbAcList = (data, param) => dispatch => {

	dispatch({
		type: ActionTypes.GET_MXB_ACLIST,
		receivedData: data
	})

	if (!data[0]) {
		dispatch({
			type: ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_FETCH_NOAC,
			param
		})
		message.info('当前账期无凭证')
	} else {
		param.acId = param.acId ? param.acId : data[0].acId
		dispatch(getSubsidiaryLedgerFetch(param))
	}
}

// 获取明细表的subsidiaryledger数据
// issuedate, endissuedate, info, currentPage = '1', condition
export const getSubsidiaryLedgerFetch = (param, callback) => (dispatch, getState) => {

	const issuedate = param.issuedate
	const endissuedate = param.endissuedate
	const acId = param.acId
	const assId = param.assId
	const assCategory = param.assCategory
	const currentPage = param.currentPage ? param.currentPage : 1
	const condition = param.condition ? param.condition : ''

	if (!issuedate)
		return

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const begin = issuedate ? issuedate : ''
	const end = endissuedate ? endissuedate : ''
	
	fetchApi('getreportacdetail', 'POST', JSON.stringify({
		begin,
		end,
		acId: acId ? acId : '',
		assId: assId ? assId : '' ,
		assCategory: assCategory ? assCategory : '',
		pageNum: currentPage,
		condition: condition,
		pageSize: '500',
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_FETCH,
				receivedData: json.data.detail,
				param
			})
			dispatch({
				type:ActionTypes.SHOW_MULTI_COLUMN_ACCOUNT_TABLE,
				ifShow:false
			})
			if (json.data.detail.needDownSize) {
				thirdParty.Alert('本次查询数据量较大，目前仅返回前7500条。若需查询后续数据，请缩小账期及科目范围。')
			}
		}
		callback && callback()
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const changeMxbChooseMorePeriods = (chooseperiods) => ({
	type: ActionTypes.CHANGE_MXB_CHOOSE_MORE_PERIODS,
	chooseperiods
})

const getIssudateReturn = (endYear, endMonth) => (dispatch, getState) => {

	const allState = getState().allState
	const year = endYear ? endYear : allState.getIn(['period', 'openedyear'])
	const month = endMonth ? endMonth : allState.getIn(['period', 'openedmonth'])

	let vcDate = ''
	if (!year) {
		vcDate = new Date()
	} else {
		const lastDate = new Date(year, month, 0)
		const currentDate = new Date()
		const currentYear = new Date().getFullYear()
		const currentMonth = new Date().getMonth() + 1
		if (lastDate < currentDate) {   //本月之前
			vcDate = lastDate
		} else if (Number(year) == Number(currentYear) && Number(month) == Number(currentMonth)) {  //本月
			vcDate = currentDate
		} else {   //本月之后
			vcDate = new Date(year, Number(month)-1, 1)
		}
	}
	return vcDate
}

// 一键收款：当前为 1122 和 2202 的末端不带辅助核算的科目或者辅助核算项目可以发起一键收款，直接跳到lrpz并生成数据
export const mxbConvenientPaymentToLrpz = (parentAcid, asscategory, type) => (dispatch, getState) => {

	const allState = getState().allState
	const vcDate = dispatch(getIssudateReturn())

	// 找出1002及1002的子科目
	const aclist = allState.getIn(['categoryAclist', '资产']).filter(v => v.get('acid').indexOf('1002') === 0)

	// 找1002的第一个末端科目赋值给acitem
	let acitem = fromJS({})

	if (aclist.size === 0) {
		acitem = fromJS({})
	} else if (aclist.size === 1) {
		acitem = aclist.get(0)
	} else if (aclist.size > 1) {
		// 判断除最后一个子科目外是否为第一个末端科目
		aclist.forEach((v, i) => {
			if (i > 0 && acitem.size === 0) {
				if (aclist.getIn([i-1, 'acid']) !== v.get('upperid')) {
					acitem = aclist.get(i-1)
				}
			}
		})
		// acitem.size === 0说明最后一个子科目为第一个末端科目
		if (acitem.size === 0)
			acitem = aclist.get(aclist.size-1)
	}

	// 判断acitem是否有辅助核算，若有找各类别下的第一个辅助核算赋给acAsslist
	let acAsslist = []
	const asscategorylist = acitem.get('asscategorylist')
	const allasscategorylist = getState().allState.get('allasscategorylist')
	if (acitem.size !== 0 && asscategorylist.size !== 0) {
		acitem.get('asscategorylist').map(w => {
			const asscategoryAsslist = allasscategorylist.find(v => v.get('asscategory') === w).getIn(['asslist', 0])
			const asslist = {
				assid: asscategoryAsslist.get('assid'),
				assname: asscategoryAsslist.get('assname'),
				asscategory: w
			}
			acAsslist.push(asslist)
		})
	}

	// 找到当前明细数据
	let creditAsslist = []
	let jvabstractOne = ''
	let jvabstractTwo = ''
	let creditAcid = ''
	let creditAcname = ''
	let creditAcfullname = ''
	let jvAmount = 0
	let ledger = {}
	let ledgerAcitem = {}
	let direction = 'debit'

	if (!type) { //明细表

		ledger = getState().kmmxbState.get('ledger')
		jvabstractOne = `收${ledger.get('assName') ? ledger.get('assName')+'应收账款' : ledger.get('acName')}`
		jvabstractTwo = `支付${ledger.get('assName') ? ledger.get('assName') + '应付账款' : ledger.get('acName')}`
		jvAmount = ledger.get('allBalanceAmount')
		creditAcid = ledger.get('acId')
		creditAcname = ledger.get('acName')
		creditAcfullname = ledger.get('acFullName')
		direction = ledger.get('direction')
		const acid = ledger.get('acId')
		ledgerAcitem = allState.get('aclist').filter(v => v.get('acid').indexOf(acid) === 0).get(0)
		const creditAsscategory = ledgerAcitem.get('asscategorylist')

		if (creditAsscategory.size !== 0) {
			const firstAsslist = {
				assid: ledger.get('assId'),
				assname: ledger.get('assName'),
				asscategory: asscategory
			}
			creditAsslist.push(firstAsslist)
		}
	} else if (type === 'assmxb') {
		const assmxbState = getState().assmxbState
		ledger = assmxbState.get('reportassdetail')

		jvabstractOne = `收${ledger.get('assname')}应收账款`
		jvabstractTwo = `支付${ledger.get('assname')}应付账款`

		jvAmount = ledger.get('closingbalance')
		creditAcid = ledger.get('acid')
		creditAcname = ledger.get('acname')
		creditAcfullname = ledger.get('acfullname')
		direction = ledger.get('direction')

		ledgerAcitem = allState.get('aclist').filter(v => v.get('acid').indexOf(creditAcid) === 0).get(0)
		const creditAsscategory = ledgerAcitem.get('asscategorylist')

		const firstAsslist = {
			assid: ledger.get('assid'),
			assname: ledger.get('assname'),
			asscategory: assmxbState.get('currentAssCategory')
		}
		creditAsslist.push(firstAsslist)

		creditAsscategory.map(w => {
			if (w === assmxbState.get('currentAssCategory')) {
				return
			} else {
				const assmxbState = getState().assmxbState
				const assidTwo = assmxbState.get('assidTwo')
				const assname = assmxbState.get('assNameTwo').split(Limit.TREE_JOIN_STR)[1]
			
				const asslist = {
					assid: assidTwo,
					assname: assname,
					asscategory: assmxbState.get('asscategoryTwo')
				}
				creditAsslist.push(asslist)
			}
		})
	}

	let acitemFcInfo = {}
	let creditFcInfo = {}
	let creditAcunitInfo = {}

	if (acitem.get('fcStatus') === '1' || ledgerAcitem.get('fcStatus') === '1') {
		dispatch(getFirstFcTypeOfMxb())
	}
	if (acitem.get('fcStatus') === '1') {
		acitemFcInfo = {
			fcStatus: acitem.get('fcStatus'),
			fcNumber: "CNY",
			exchange: acitem.get('fcStatus') === '1' ? 1 : '',
			standardAmount: acitem.get('fcStatus') === '1' ? jvAmount : ''
		}
	}

	if (ledgerAcitem.get('fcStatus') === '1') {
		creditFcInfo = {
			fcStatus: ledgerAcitem.get('fcStatus'),
			fcNumber: "CNY",
			exchange: ledgerAcitem.get('fcStatus') === '1' ? 1 : '',
			standardAmount: ledgerAcitem.get('fcStatus') === '1' ? jvAmount : ''
		}
	}
	if (acitem.get('acunitOpen') === '1') {
		// 0 和 1 表示jv的第几行
		dispatch(getEveryAmountDataFetch(acitem.get('acid'), vcDate, parentAcid === '1122' ? 0 : 1))
	}
	if (ledgerAcitem.get('acunitOpen') === '1') {
		creditAcunitInfo = {
			acunitOpen: '1',
			jvcount: '',
			price: '',
			jvunit: ledgerAcitem.get('acunit')
		}
	}

	let jvlist

	if (!type) {
		jvlist = ({
			'1122': () => {
				const jvlist = fromJS([{
					jvdirection: 'debit',
					jvabstract: jvabstractOne,
					acid: acitem.size ? acitem.get('acid') : '',
					acname: acitem.size ? acitem.get('acname') : '',
					acfullname: acitem.size ? acitem.get('acfullname') : '',
					jvamount: jvAmount,
					asslist: acAsslist,
					...acitemFcInfo //外币
				}, {
					jvdirection: 'credit',
					jvabstract: jvabstractOne,
					acid: creditAcid,
					acname: creditAcname,
					acfullname: creditAcfullname,
					jvamount: jvAmount,
					asslist: creditAsslist,
					...creditAcunitInfo,
					...creditFcInfo
				}])
				return jvlist
			},
			'2202': () => {
				const jvlist = fromJS([{
					jvdirection: 'debit',
					jvabstract: jvabstractTwo,
					acid: creditAcid,
					acname: creditAcname,
					acfullname: creditAcfullname,
					jvamount: jvAmount,
					asslist: creditAsslist,
					...creditAcunitInfo,
					...creditFcInfo
				}, {
					jvdirection: 'credit',
					jvabstract: jvabstractTwo,
					acid: acitem.size ? acitem.get('acid') : '',
					acname: acitem.size ? acitem.get('acname') : '',
					acfullname: acitem.size ? acitem.get('acfullname') : '',
					jvamount: jvAmount,
					asslist: acAsslist,
					...acitemFcInfo //外币
				}])
				return jvlist
			}
		}[parentAcid])()
	} else if (type === 'assmxb') {
		jvlist = ({
			'1122': () => {
				const jvlist = fromJS([{
					jvdirection: 'debit',
					jvabstract: jvabstractOne,
					acid: acitem.size ? acitem.get('acid') : '',
					acname: acitem.size ? acitem.get('acname') : '',
					acfullname: acitem.size ? acitem.get('acfullname') : '',
					jvamount: jvAmount,
					asslist: acAsslist,
					...acitemFcInfo //外币
				}, {
					jvdirection: 'credit',
					jvabstract: jvabstractOne,
					acid: creditAcid,
					acname: creditAcname,
					acfullname: creditAcfullname,
					jvamount: jvAmount,
					asslist: creditAsslist,
					...creditAcunitInfo,
					...creditFcInfo
				}])
				return jvlist
			},
			'2202': () => {
				const jvlist = fromJS([{
					jvdirection: 'debit',
					jvabstract: jvabstractTwo,
					acid: creditAcid,
					acname: creditAcname,
					acfullname: creditAcfullname,
					jvamount: -jvAmount,
					asslist: creditAsslist,
					...creditAcunitInfo,
					...creditFcInfo
				}, {
					jvdirection: 'credit',
					jvabstract: jvabstractTwo,
					acid: acitem.size ? acitem.get('acid') : '',
					acname: acitem.size ? acitem.get('acname') : '',
					acfullname: acitem.size ? acitem.get('acfullname') : '',
					jvamount: -jvAmount,
					asslist: acAsslist,
					...acitemFcInfo //外币
				}])
				return jvlist
			}
		}[parentAcid])()
	}

	if (jvlist.size < 4) {
		for (let i = 0; jvlist.size < 4; i++) {
			jvlist = jvlist.push(fromJS({
				jvdirection: '',
				jvabstract: '',
				acid: '',
				acname: '',
				acfullname: '',
				jvamount: '',
				asslist: []
			}))
		}
	}

	dispatch(mxbCreatePzJumpToLrpz(jvlist, vcDate))
}

// 明细表一键结转
export const mxbTransferToLrpz = (transferList, endYear, endMonth) => (dispatch, getState) => {

	let jvlist = fromJS([])
	let diffAmount = 0
	let vcId = 0
	let firstGetFcList = true
	const allState = getState().allState
	const vcDate = dispatch(getIssudateReturn(endYear, endMonth))

	// 找出1002及1002的子科目
	const acMap = {}
	allState.getIn(['categoryAclist', '成本']).forEach(v => {
		acMap[v.get('acid')] = v
	})

	transferList.forEach(v => {

		const acItem = acMap[v.get('acId')] // 从科目列表找到对应的科目
		diffAmount = acItem.get('direction') === 'debit' ? diffAmount + v.get('closingbalance') : diffAmount - v.get('closingbalance')

		// 填写每一条jv
		let jvItem = {
			jvdirection: acItem.get('direction') === 'debit' ? 'credit' : 'debit',
			jvabstract: '结转成本',
			acid: v.get('acId'),
			acname: v.get('acName'),
			acfullname: acItem.get('acfullname'),
			jvamount: v.get('closingbalance'),
			asslist: []
		}

		if (acItem.get('acunitOpen') === '1') {
			jvItem.acunitOpen = '1'
			jvItem.jvcount = ''
			jvItem.price = ''
			jvItem.jvunit = acItem.get('acunit')
		}
		if (acItem.get('fcStatus') === '1') {
			// 首次获取外币列表
			if (firstGetFcList) {
				dispatch(getFirstFcTypeOfMxb())
				firstGetFcList = false
			}
			jvItem.fcStatus = '1',  //外币
			jvItem.fcNumber = "CNY",
			jvItem.exchange = 1,
			jvItem.standardAmount = v.get('closingbalance')
		}
		jvlist = jvlist.push(fromJS(jvItem))
		vcId++
	})

	jvlist = jvlist.push(fromJS({
		jvdirection: diffAmount > 0 ? 'debit' : 'credit',
		jvabstract: '结转成本',
		acid: '',
		acname: '',
		acfullname: '',
		jvamount: Number((diffAmount).toFixed(2)) > 0 ? Number((diffAmount).toFixed(2)) : - Number((diffAmount).toFixed(2)),
		asslist: []
	}))

	if (jvlist.size < 4) {
		for (let i = 0; jvlist.size < 4; i++) {
			jvlist = jvlist.push(fromJS({
				jvdirection: '',
				jvabstract: '',
				acid: '',
				acname: '',
				acfullname: '',
				jvamount: '',
				asslist: []
			}))
		}
	}
	dispatch(mxbCreatePzJumpToLrpz(jvlist, vcDate))
}

// 辅助核算一键结转
export const assMxbTransferToLrpz = (transferAcList, curAssAcList, assidTwo, endYear, endMonth) => (dispatch, getState) => {

	const allState = getState().allState
	const vcDate = dispatch(getIssudateReturn(endYear, endMonth))
	let jvlist = fromJS([])
	let diffAmount = 0
	let count = 0
	let firstGetFcList = true

	transferAcList.forEach(v => {
		let fcInfo = {}
		let acunitInfo = {}
		if (v.get('acunitOpen') === '1') {
			acunitInfo = {
				acunitOpen: '1',
				jvcount: '',
				price: '',
				jvunit: v.get('acunit')
			}
		}

		if (v.get('assList').size) {
			for (let i = 0; i < v.get('assList').size; i++) {
				const closingbalance = v.getIn(['assList', i, 'closingbalance'])
				if (closingbalance !== 0) {
					// 没有双辅助核算就遍历所有
					// 当前选择的是某辅助核算时，assidTwo有值，是双辅助核算查询，取其中一个
					if (!assidTwo || (assidTwo && v.getIn(['assList', i, 'assid']) === assidTwo)) {
						count++
						if (count >= 30) {
							break
						}
						diffAmount = v.get('direction') === 'debit' ? diffAmount + closingbalance : diffAmount - closingbalance
						if (v.get('fcStatus') === '1') {
							if (firstGetFcList) {
								dispatch(getFirstFcTypeOfMxb())
								firstGetFcList = false
							}
							fcInfo = {
								fcStatus: '1',
								fcNumber: "CNY",
								exchange: v.get('fcStatus') === '1' ? 1 : '',
								standardAmount: closingbalance
							}
						}
						jvlist = jvlist.push(fromJS({
							jvdirection: v.get('direction') === 'debit' ? 'credit' : 'debit',
							jvabstract: '结转成本',
							acid: v.get('acid'),
							acname: v.get('acname'),
							acfullname: v.get('acfullname'),
							jvamount: closingbalance,
							...fcInfo,
							...acunitInfo,
							asslist: [
								{
									assid: curAssAcList.getIn([0, 'assid']),
									assname: curAssAcList.getIn([0, 'assname']),
									asscategory: curAssAcList.getIn([0, 'asscategory'])
								},
								{
									assid: v.getIn(['assList', i, 'assid']),
									assname: v.getIn(['assList', i, 'assname']),
									asscategory: v.getIn(['assList', i, 'asscategory'])
								}
							]
						}))
					}
				}
			}
		} else {
			count++
			if (count < 29) {
				diffAmount = v.get('direction') === 'debit' ? diffAmount + v.get('closingbalance') : diffAmount - v.get('closingbalance')
				if (v.get('fcStatus') === '1') {
					if (firstGetFcList) {
						dispatch(getFirstFcTypeOfMxb())
						firstGetFcList = false
					}
					fcInfo = {
						fcStatus: '1',
						fcNumber: "CNY",
						exchange: v.get('fcStatus') === '1' ? 1 : '',
						standardAmount: v.get('closingbalance')
					}
				}
				jvlist = jvlist.push(fromJS({
					jvdirection: v.get('direction') === 'debit' ? 'credit' : 'debit',
					jvabstract: '结转成本',
					acid: v.get('acid'),
					acname: v.get('acname'),
					acfullname: v.get('acfullname'),
					jvamount: v.get('closingbalance'),
					...fcInfo,
					...acunitInfo,
					asslist: [{
						assid: curAssAcList.getIn([0, 'assid']),
						assname: curAssAcList.getIn([0, 'assname']),
						asscategory: curAssAcList.getIn([0, 'asscategory'])
					}]
				}))
			}
		}

	})

	jvlist = jvlist.push(fromJS({
		jvdirection: diffAmount > 0 ? 'debit' : 'credit',
		jvabstract: '结转成本',
		acid: '',
		acname: '',
		acfullname: '',
		jvamount: Number((diffAmount).toFixed(2)) > 0 ? Number((diffAmount).toFixed(2)) : - Number((diffAmount).toFixed(2)),
		asslist: []
	}))

	if (jvlist.size < 4) {
		for (let i = 0; jvlist.size < 4; i++) {
			jvlist = jvlist.push(fromJS({
				jvdirection: '',
				jvabstract: '',
				acid: '',
				acname: '',
				acfullname: '',
				jvamount: '',
				asslist: []
			}))
		}
	}
	dispatch(mxbCreatePzJumpToLrpz(jvlist, vcDate))
}

const mxbCreatePzJumpToLrpz = (jvlist, vcdate) => (dispatch, getState) => {
	sessionStorage.setItem("lrpzHandleMode", "insert")
	// dispatch(homeActions.addTabpane('Lrpz'))
	dispatch(homeActions.addPageTabPane('EditPanes', 'Lrpz', 'Lrpz', '录入凭证'))
	dispatch(homeActions.addHomeTabpane('Edit', 'Lrpz', '录入凭证'))

	fetchApi('getLastVcIndex', 'POST', JSON.stringify({
		year: new DateLib(vcdate).getYear(),
		month: new DateLib(vcdate).getMonth()
	}), json => {
		if (showMessage(json)) {
			const data = {
				jvList: jvlist,
				receivedData: json.data,
				vcDate: new DateLib(vcdate)
			}
			dispatch({
				type: ActionTypes.INIT_LRPZ,
				strJudgeEnter: 'oneKeyCollection',
				data: data
			})
		}
	})
}

// 获取指定的科目的数量
const getEveryAmountDataFetch = (acId, vcDate, idx) => dispatch => {
	const date = new DateLib(vcDate)
	fetchApi('getAmountData', 'POST',JSON.stringify({
		acid: acId,
		date: date.toString(),
		year: date.getYear(),
		month: date.getMonth()
	}), json => {
		showMessage(json) && dispatch({
			type: ActionTypes.GET_AMOUNT_TYPE_MXB_DATA,
			receivedData: json.data,
			idx: idx
		})
	})
}

// 获取外币数据
const getFirstFcTypeOfMxb = () => dispatch => {
	fetchApi('getFCList', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_FC_LIST_DATA_MXB_FETCH,
				receivedData: json.data
			})
		}
	})
}
export const showMutilColumnAccount=(show)=>dispatch=>{
	dispatch({
		type:ActionTypes.SHOW_MULTI_COLUMN_ACCOUNT,
		show
	})
}

export const getMoreColumnData = (issuedate, endissuedate, currentAcId, currentPage='1') => (dispatch, getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	
	fetchApi('getreportacdetailcolumn','POST',JSON.stringify({
		begin: issuedate ? issuedate : '',
		end: endissuedate ? endissuedate : '',
		acId: currentAcId,
		pageSize: "500",
		pageNum: currentPage
	}),resp=>{
		if (showMessage(resp)) {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

			// dispatch({
			// 	type: ActionTypes.SET_MULTI_COLUMN_ACCOUNT_TABLE_DATA,
			// 	mutilColumnAccountTableAcDetails:resp.data.acDetails,
			// 	mutilColumnAccountTableAcList:resp.data.acList,
			// 	mutilColumnAccountTableBalanceSumList:resp.data.balanceSumList,
			// 	mutilColumnAccountTableOpeningBalanceList:resp.data.openingBalanceList,
			// 	mutilColumnAccountTableDirection:resp.data.direction,
			// 	issuedate,
			// 	endissuedate,
			// 	currentPage:resp.data.currentPage,
			// 	pageCount:resp.data.pageCount,
			// })
			dispatch({
				type: ActionTypes.SET_MULTI_COLUMN_ACCOUNT_TABLE_DATA,
				receivedData: resp.data,
				// mutilColumnAccountTableAcDetails:resp.data.acDetails,
				// mutilColumnAccountTableAcList:resp.data.acList,
				// mutilColumnAccountTableBalanceSumList:resp.data.balanceSumList,
				// mutilColumnAccountTableOpeningBalanceList:resp.data.openingBalanceList,
				// mutilColumnAccountTableDirection:resp.data.direction,
				issuedate,
				endissuedate,
			})
			dispatch({
				type:ActionTypes.SHOW_MULTI_COLUMN_ACCOUNT_TABLE,
				ifShow:true
			})
			dispatch({
				type:ActionTypes.SHOW_MULTI_COLUMN_ACCOUNT,
				show:false
			})
			dispatch({
				type:ActionTypes.SHOW_MORE_COLUMN,
				show:false
			})
		} else {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		}
	})
}

export const handleColumnAccountTable = () =>(dispatch)=>{
	dispatch({
		type:ActionTypes.SHOW_MULTI_COLUMN_ACCOUNT_TABLE,
		ifShow:false
	})
	dispatch({
		type:ActionTypes.SHOW_MULTI_COLUMN_ACCOUNT,
		show:true
	})
}
export const handleShowMoreColumn = (show)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.SHOW_MORE_COLUMN,
		show
	})
}

export const changeAcMxbChooseValue = (chooseValue) => ({
	type: ActionTypes.CHANGE_AC_MXB_CHOOSE_VALUE,
	chooseValue
})