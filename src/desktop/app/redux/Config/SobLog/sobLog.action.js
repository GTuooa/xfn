import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { fromJS } from 'immutable'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

// dispatch(sobLogActions.getLogListFetch({ begin: date.formatDayBegin, end: date.format, searchType: 'SEARCH_TYPE_ALL', searchContent: '', sobid: 'sob_11d2738ad7074853ae77d8d15d5dcc2920190606143335' }, 1))
//获取日志信息
export const getLogListFetch = (param, init) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const begin = param.begin ? param.begin : ''
	const end = param.end ? param.end : ''
	const searchType = param.searchType ? param.searchType : 'SEARCH_TYPE_ALL'
	const searchContent = param.searchContent ? param.searchContent : ''
	const backSobId = param.backSobId ? param.backSobId : ''
	const currentPage = param.currentPage ? param.currentPage : 1

	fetchApi('operationTrafficList', 'GET', `sobId=${backSobId}&from=${begin}&to=${end}&keyword=${searchContent}&offset=${currentPage}&line=${Limit.LOG_PAGE_SIZE}&searchType=${searchType}`, json => {
		if (showMessage(json, 'show')) {
			dispatch({
				type: ActionTypes.GET_LOG_LIST_FETCH,
				receivedData: json.data,
				currentPage,
				begin,
				end,
				backSobId,
				pageCount: json.data.length >= Limit.LOG_PAGE_SIZE ? currentPage+1 : currentPage
			})
			if (init === 'init') {
				dispatch(changeLogConfigCommonString('searchType', 'SEARCH_TYPE_ALL'))
				dispatch(changeLogConfigCommonString('searchContent', ''))
			}
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

// 换页
export const getChangeLogListPaginationFetch = (param, pageCount) => dispatch => {

	const begin = param.begin ? param.begin : ''
	const end = param.end ? param.end : ''
	const searchType = param.searchType ? param.searchType : 'SEARCH_TYPE_ALL'
	const searchContent = param.searchContent ? param.searchContent : ''
	const backSobId = param.backSobId ? param.backSobId : ''
	const currentPage = param.currentPage ? param.currentPage : 1

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('operationTrafficList', 'GET', `sobId=${backSobId}&from=${begin}&to=${end}&keyword=${searchContent}&offset=${currentPage}&line=${Limit.LOG_PAGE_SIZE}&searchType=${searchType}`, json => {
		if (showMessage(json, 'show')) {
			if (json.data.length === 0) {
				message.info('没有更多操作记录了')
			}
			dispatch({
				type: ActionTypes.GET_LOG_LIST_FETCH,
				receivedData: json.data,
				currentPage,
				begin,
				end,
				backSobId,
				pageCount: (currentPage < pageCount) ? pageCount : ((json.data.length >= Limit.LOG_PAGE_SIZE) ? currentPage+1 : pageCount)
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}


export const getLogListSelectListFetch = (sobId) => dispatch => {
	fetchApi('operationUsersList', 'GET', `sobId=${sobId}`, json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_LOG_LIST_SELECT_LIST_FETCH,
				receivedData: json.data
			})
		}
	})
}

export const changeLogConfigCommonString = (place, value) => ({
	type: ActionTypes.CHANGE_LOG_CONFIG_COMMON_STRING,
	place,
	value
})