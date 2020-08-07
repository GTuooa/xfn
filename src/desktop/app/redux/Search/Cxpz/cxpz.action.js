import { jsonifyDate, showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import fetchApi from 'app/constants/fetch.constant.js'
import { message }	from 'antd'
import * as thirdParty from 'app/thirdParty'
import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as Limit from 'app/constants/Limit.js'

const showError = (json) => {
	const errorlist = json.data
	if (errorlist.failJsonList.length) {
		const error = errorlist.failJsonList.reduce((prev, v) => prev + ',' + v)
		message.error(error)
	}
}

// export const getPeriodAndVcListFetch = (issuedate, currentPage, sortTime, sortIndex, sortReviewed, condition) => dispatch => {
// 	dispatch(AllGetCxpzListFetch(issuedate, currentPage, sortTime, sortIndex, sortReviewed, condition, null, 'true'))
// }
export const getPeriodAndVcListFetch = (issuedate,option) => dispatch => {
	// {currentPage:1, pageSize:_pageSize, sortTime: '', sortIndex: '', sortReviewed: '',condition:'',callback:null, getPeriod:'true'}
	dispatch(AllGetCxpzListFetch(issuedate, option))
}

// export const getVcListFetch = (issuedate, currentPage, sortTime, sortIndex, sortReviewed, condition, callback) => dispatch => {
// 	dispatch(AllGetCxpzListFetch(issuedate, currentPage, sortTime, sortIndex, sortReviewed, condition, callback))
// }
// export const getVcListFetch = (issuedate, {currentPage, pageSize, sortTime, sortIndex, sortReviewed, condition, callback}) => dispatch => {
export const getVcListFetch = (issuedate,option) => dispatch => {
//{currentPage, pageSize, sortTime, sortIndex, sortReviewed, condition, callback, getImport}
	dispatch(AllGetCxpzListFetch(issuedate, option))
}

// const AllGetCxpzListFetch = (issuedate,{ currentPage = '1', pageSize, sortTime, sortIndex, sortReviewed, condition = {}, callback, getPeriod, getImport}) => dispatch => {
const AllGetCxpzListFetch = (issuedate,option) => dispatch => {
	console.log(option,'option')
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	
	// fetchApi('getvclist', 'POST', JSON.stringify({
	// 	year: issuedate ? issuedate.substr(0, 4) : '',
	// 	month: issuedate ? issuedate.substr(6, 2) : '',
	// 	getPeriod
	// }), json => {
	// 	// dispatch({
	// 	// 	type: ActionTypes.BEFORE_GET_VC_LIST_FETCH
	// 	// })
	//
	// 	if (showMessage(json)) {
	//
	// 		if (getPeriod == 'true') {
	//
	// 			if (json.code === 0 && !json.data.jsonArray.length) {
	// 				message.info('当前月份无任何凭证')
	// 			}
	//
	// 			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
	// 			const issuedateNew = issuedate ? issuedate : openedissuedate
	//
	// 			dispatch(freshCxpz(json.data.jsonArray, issuedateNew))
	//
	// 		} else {
	//
	// 			if (json.code === 0 && !json.data.length) {
	// 				message.info('当前月份无任何凭证')
	// 			}
	//
	// 			dispatch(freshCxpz(json.data, issuedate))
	// 		}
	//
	// 	} else {
	// 		dispatch({type: ActionTypes.INIT_CXPZ})
	// 	}
	//
	// 	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	// })
	let currentPage = option.currentPage ? option.currentPage : 1
	let pageSize = option.pageSize ? option.pageSize : Limit.SEARCH_CXPZ_LINE_LENGTH
	let sortTime = option.sortTime ? option.sortTime :''
	let sortIndex = option.sortIndex ? option.sortIndex :''
	let sortReviewed = option.sortReviewed ? option.sortReviewed :''
	let condition = option.condition ? option.condition  : {}
	let callback = option.callback ? option.callback : null
	let getPeriod = option.getPeriod ? option.getPeriod : undefined
	let getImport = option.getImport ? option.getImport : false

	fetchApi('getvcpaging', 'POST', JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
		// pageSize: '200',
		pageSize: pageSize,
		currentPage: currentPage,
		sortTime: sortTime ? sortTime : '',
		sortIndex: sortIndex ? sortIndex : '',
		sortReviewedby: sortReviewed ? sortReviewed : '',
		condition: condition.condition ? condition.condition : '',
		searchContentType: condition.conditionType ? condition.conditionType : '',
		getPeriod
	}), json => {

		if (showMessage(json)) {

			if (getPeriod == 'true') {

				if (json.code === 0 && !json.data.vcList.length) {
					message.info('当前月份无任何凭证')
				}

				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate

				// dispatch(freshCxpz(json.data.vcList, issuedateNew, json.data.currentPage, json.data.pageCount))
				dispatch(freshCxpz(json.data.vcList, issuedateNew, json.data.currentPage, json.data.pageCount, json.data.pageSize))

			} else {

				if (json.code === 0 && !json.data.vcList.length) {
					message.info('当前月份无任何凭证')
				}

				// dispatch(freshCxpz(json.data.vcList, issuedate, json.data.currentPage, json.data.pageCount))
				dispatch(freshCxpz(json.data.vcList, issuedate, json.data.currentPage, json.data.pageCount, json.data.pageSize))
			}
			(json.data.pageSize > 50 && !getImport ) ? vcListSum(json.data.vcList, json.data.pageSize) : ''
		} else {
			dispatch({type: ActionTypes.INIT_CXPZ})
		}
		callback && callback()
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}
//校验数据量是否超过5000
export function vcListSum(vcList, pageSize) {
	let mxListsum = 0
	let mxListLength = 0
	//遍历vcList 获取总的jvlist的长度
	vcList.map(v => {
		mxListsum = mxListsum + v.jvlist.length
	})
	if (mxListsum > 5000) {
		thirdParty.Alert(`本次加载数据量过大，请调整每页显示数据量 (当前:${pageSize}条/页)`)
	}
}

// const freshCxpz = (data, issuedate, currentPage, pageCount) => dispatch => {
const freshCxpz = (data, issuedate, currentPage, pageCount, pageSize) => dispatch => {
	dispatch({
		type: ActionTypes.GET_VC_LIST_FETCH,
		receivedData: data,
		issuedate,
		currentPage,
		pageCount,
		pageSize
	})
}

// 查询凭证整理功能
// sort：‘1’，表示断号重排
// sort：‘2’，表示日期重排
export const getSortVcFetch = (issuedate) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const sort = sessionStorage.getItem('sort')

	fetchApi('sortvc', 'POST', JSON.stringify({
		year: issuedate.substr(0, 4),
		month: issuedate.substr(6, 2),
		sort: sort
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json, 'show')) {
			dispatch(getVcListFetch(issuedate))
		}
	})
}

export const beforeVcImport = () => ({
	type: ActionTypes.BEFORE_VC_IMPORT
})

export const getFileUploadFetch = (form,openModal,callback) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('vcImport', 'UPLOAD', form, json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if(showMessage(json)){
			dispatch(afterVcImport(json))
			openModal()
			let delayTime = 500;
			if(json.data.total > 400){
				delayTime = 2000;
			}
			const loop = function (accessToken) {
				const time = setTimeout(() => {
					let showMessageMask = getState().cxpzState.getIn(['flags','showMessageMask'])
					fetchApi('acImportProgress', 'GET', `accessToken=${accessToken}`, json => {
						if(showMessage(json)){
							dispatch({
								type:ActionTypes.GET_CXPZ_IMPORT_PROGRESS,
								receivedData:json,
                                accessToken:accessToken
							})
							if ((json.data.progress >= 100) && (json.data.successList.length > 0)) {
								const issuedate = getState().cxpzState.get('issuedate')//导入前帐期保留
								const getImport = true//导入刷新标记
								dispatch(getVcListFetch(issuedate,{getImport}))
								callback && callback()
							}
							if(showMessageMask && json.data.progress < 100){
								loop(accessToken)
							}
						}
					})
					clearTimeout(time)
				},delayTime)
			}
			loop(json.data.accessToken)
		}
	})
}

export const afterVcImport = (receivedData) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_VC_IMPORT,
		receivedData
	})
}

export const closeVcImportContent = () => ({
	type: ActionTypes.CLOSE_VC_IMPORT_CONTENT
})

// 删除选中的vclist，接收到删除成功的信息后，过滤出没被勾选的item来显示
export const deleteVcItemFetch = (state, refreshCxpzCallBack) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const vclist = state.get('vclist')
	const vcindexlist = vclist.filter(v => v.get('checkboxDisplay')).map(v => v.get('vcindex'))

	fetchApi('deletevc', 'POST', JSON.stringify({
		year: state.getIn(['vclist', 0, 'year']),
		month: state.getIn(['vclist', 0, 'month']),
		vcindexlist,
		action: 'QUERY_VC-DELETE_VC-BATCH_DELETE'
	}), json => {
		if (showMessage(json)){
			// dispatch({
			// 	type: ActionTypes.AFTER_DELETE_VC_ITEM_FETCH,
			// 	receivedData: json
			// })

			if (vclist.size === vcindexlist.size) {
				fetchApi('getperiod', 'GET', '', json => {
					if (showMessage(json)) {
						if (json.data.lastyear) {
							dispatch({
								type: ActionTypes.GET_PERIOD_FETCH,
								receivedData: json
							})
						} else {
							dispatch({
								type: ActionTypes.GET_PERIOD_FETCH,
								receivedData: {
									code: json.data.lastyear ? 0 : 17000,
									message: json.data.lastyear ? '成功' : '当前无凭证',
									data: json.data
								}
							})
						}
					} else {
						dispatch({
							type: ActionTypes.INIT_CXPZ
						})
					}
				})
			}

			refreshCxpzCallBack && refreshCxpzCallBack()

			if (json.data.failJsonList && json.data.failJsonList.length) {
				message.warn(json.data.failJsonList.join(';'))
			}
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

// 单个选择框被点击中后，将当前项的checkboxDisplay设为true，并判断所有的checkboxDisplay是否为true，箬是将selectall设为true
export const selectVcItem = idx => ({
	type: ActionTypes.SELECT_VC_ITEM,
	idx
})

// 让每一条的checkboxDisplay都与selectall的值相等，来达到选择全部的目的
export const selectVcAll = () => ({
	type: ActionTypes.SELECT_VC_ALL
})

export const notSelectVcAll = () => ({
	type: ActionTypes.NOT_SELECT_VC_ALL
})

// 按日期排序
export const sortVcListByDate = () => ({
	type: ActionTypes.SORT_VC_LIST_BY_DATE
})

// 凭证号排序
export const reverseVcList = () => ({
	type: ActionTypes.REVERSE_VC_LIST
})
//审核人排序
export const sortVcListByReviewed = () => ({
	type: ActionTypes.SORT_VC_LIST_BY_REVIEWED
})

// export const batchVcReviewed = (issuedate, currentPage, sortTime, sortIndex, sortByReviewed, condition) => (dispatch, getState) => {
	//{currentPage, pageSize, sortTime, sortIndex, sortReviewed:sortByReviewed, condition}
export const batchVcReviewed = (issuedate,option) => (dispatch, getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const issuedate = getState().cxpzState.get('issuedate')
	const currentPage = option.currentPage ? option.currentPage : getState().cxpzState.get('issuedate') 
	const pageSize = option.pageSize 
	const sortTime = option.sortTime
	const sortIndex = option.sortIndex
	const sortReviewed = option.sortReviewed
	const condition = option.condition

	const vclist = getState().cxpzState.get('vclist')
	const vcindexlist = vclist.filter(v => v.get('checkboxDisplay')).map(v => v.get('vcindex'))

	fetchApi('reviewVc', 'POST', JSON.stringify({
		year: issuedate.substr(0, 4),
		month: issuedate.substr(6, 2),
		vcindexlist: vcindexlist,
		action: 'QUERY_VC-AUDIT-BATCH_AUDIT'
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			if (json.data.success > 0) {
				// dispatch(getVcListFetch(issuedate, currentPage, sortTime, sortIndex, sortByReviewed, condition))
				dispatch(getVcListFetch(issuedate, {currentPage, pageSize, sortTime, sortIndex, sortReviewed, condition}))
			}
			if (json.data.failList.length > 0) {
				thirdParty.Alert(json.data.failList.reduce((v, pre) => v + ';' + pre))
			}
		}
	})
}

// export const cancelBatchVcReviewed = (issuedate, currentPage, sortTime, sortIndex, sortByReviewed, condition) => (dispatch, getState) => {
	// {currentPage, pageSize, sortTime, sortIndex, sortReviewed:sortByReviewed, condition}
export const cancelBatchVcReviewed = (issuedate, option) => (dispatch, getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const issuedate = getState().cxpzState.get('issuedate')

	const vclist = getState().cxpzState.get('vclist')
	const vcindexlist = vclist.filter(v => v.get('checkboxDisplay')).map(v => v.get('vcindex'))
	
	fetchApi('cancelReviewVc', 'POST', JSON.stringify({
		year: issuedate.substr(0, 4),
		month: issuedate.substr(6, 2),
		vcindexlist: vcindexlist,
		action: 'QUERY_VC-CANCEL_AUDIT-BATCH_CANCEL_AUDIT'
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			if (json.data.success > 0) {
				// dispatch(getVcListFetch(issuedate, currentPage, sortTime, sortIndex, sortByReviewed, condition))
				dispatch(getVcListFetch(issuedate, {currentPage:option.currentPage, pageSize:option.pageSize, sortTime:option.sortTime, sortIndex:option.sortIndex, sortReviewed:option.sortReviewed, condition:option.condition}))
			}
			if (json.data.failList.length > 0) {
				thirdParty.Alert(json.data.failList.reduce((v, pre) => v + ';' + pre))
			}
		}
	})
}

//发送附件管理需要的数据
export const setFjglData = () => (dispatch,getState) =>{
	const issuedate = getState().cxpzState.get('issuedate');
	dispatch({
		type: ActionTypes.CHANGE_FJGL_ISSUEDATE,
		issuedate
	})
}

export const changeMessageMask = () => ({
	type: ActionTypes.CHANGE_CXPZ_MESSAGEMASK,
})
export const transferDraftPz =(vcList,SAVE_VC)=>(dispatch,getState)=>{
	const vcindexlist = vcList.map(v => v.get('vcindex'))
	const issuedate = getState().cxpzState.get('issuedate')
	// const saveVc = getState().cxpzState.get('SAVE_VC')
	const saveDraftPermission = SAVE_VC.getIn(['preDetailList','DRAFT_BOX','open'])

	fetchApi('transferDraftPz','POST', JSON.stringify({
			year: issuedate.substr(0, 4),
			month: issuedate.substr(6, 2),
			vcindexlist: vcindexlist
		}),resp=>{
			if (showMessage(resp)) {
				if(saveDraftPermission){
					dispatch(homeActions.addPageTabPane('EditPanes', 'Draft', 'Draft', '草稿箱'))
					dispatch(homeActions.addHomeTabpane('Edit', 'Draft', '草稿箱'))
					dispatch(draftActions.getDraftListFetch('全部'))
				}
			}
	})
}
