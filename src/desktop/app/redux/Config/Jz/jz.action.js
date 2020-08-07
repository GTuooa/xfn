import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as homeActions from 'app/redux/Home/home.action.js'

//结账刷新操作，重新获取period
export const getBalanceStatus = () => dispatch => {
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
					receivedData:  {
						code: json.data.lastyear ? 0 : 17000,
						message: json.data.lastyear ? '成功' : '当前无凭证',
						data: json.data
					}
				})
			}
		}
	})
}

// 结账页结账或反结账操作
// 操作成功，返回的json的code为0时，设置allState的period为json返回的data，并重新设置defaultIssuedate
export const closeSobFetch = (year, month, fcList, circleStatus) => dispatch => {
	let promptInfo = []
	fcList.map((u,i) => {
		if (u.get('newExchange') == '') {
			fcList = fcList.setIn([i, 'newExchange'], fcList.getIn([i, 'exchange']))
		}
		if (u.get('newExchange') !='' && Number(u.get('newExchange')) <=0) {
			const line = i + 1
			promptInfo.push(u.get('fcNumber') + '编码所修改的汇率不能小于等于0')
		}
	})
	const getLastDay = (year,month) =>{
		let new_year = year;    //取当前的年份
		let new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
		if(month>12) {
			new_month -=12;        //月份减
			new_year++;            //年份增
		}
		const new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天
		return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
	}
	const jzcbDay = getLastDay(year,month)

	const lastJzDate = `${year}-${month}-${jzcbDay}`

	if (promptInfo.length){
		return thirdParty.Alert(promptInfo.reduce((v, pre) => v + ',' + pre))
	}

	thirdParty.Confirm({
		message: `本操作将结账${year}年第${month}期`,
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

				fetchApi('closesob', 'POST', JSON.stringify({
					year: year,
					month: month,
					fcList: !circleStatus ? fcList : []
				}), json => {
					dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

					if(json.message.indexOf('存在流水未结转货物成本') > -1){
						thirdParty.Confirm({
							message: '结账异常，该账期存在流水未结转货物成本',
							title: "提示",
							buttonLabels: ['取消', '前往结转'],
							onSuccess : (result) => {
								if (result.buttonIndex === 1) {
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', lastJzDate))
									dispatch({type: ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_JZCB})
									dispatch({
										type: ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_EDIT,
										pageType: 'LB_JZCB',
										PageTab: 'payment',
										insertOrModify: 'insert',
										needSendRequest: true
									})
									dispatch(homeActions.addPageTabPane('EditPanes', 'EditRunning', 'EditRunning', '录入流水'))
									dispatch(homeActions.addHomeTabpane('Edit', 'EditRunning', '录入流水'))
								}
							}
						})
					}else if (showMessage(json)) {
						if (json.data.message) {
							thirdParty.Confirm({
								message: json.data.message,
								title: "提示",
								buttonLabels: ['取消', '确定'],
								onSuccess : (result) => {
									if (result.buttonIndex === 1) {
										dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

										fetchApi('closesob', 'POST', JSON.stringify({
											year: year,
											month: month,
											needCheckVcIndex: false,
											fcList: !circleStatus ? fcList : []
										}), json => {
											dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
											if(json.message.indexOf('存在流水未结转货物成本') > -1){
												thirdParty.Confirm({
													message: '结账异常，该账期存在流水未结转货物成本',
													title: "提示",
													buttonLabels: ['取消', '前往结转'],
													onSuccess : (result) => {
														if (result.buttonIndex === 1) {
															dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', lastJzDate))
															dispatch({type: ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_JZCB})
															dispatch({
																type: ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_EDIT,
																pageType: 'LB_JZCB',
																PageTab: 'payment',
																insertOrModify: 'insert',
																needSendRequest: true
															})
															dispatch(homeActions.addPageTabPane('EditPanes', 'EditRunning', 'EditRunning', '录入流水'))
															dispatch(homeActions.addHomeTabpane('Edit', 'EditRunning', '录入流水'))
														}
													}
												})
											}else if (showMessage(json, 'show')) {
												dispatch({
													type: ActionTypes.CLOSE_OR_OPEN_PERIED_FETCH,
													receivedData: json
												})
												dispatch(getCurrencyListFetch())
											}
										})
									}
								}
							})
						} else {
							message.success('操作成功！', 1)
							dispatch({
								type: ActionTypes.CLOSE_OR_OPEN_PERIED_FETCH,
								receivedData: json
							})
							dispatch(getCurrencyListFetch())
						}
					}
				})
			}
		}
	})
}

export const openSobFetch = (year, month) => dispatch => {
	thirdParty.Confirm({
		message: `本操作将反结账${year}年第${month}期`,
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

				fetchApi('opensob', 'POST', JSON.stringify({
					year: year,
					month: month
				}), json => {
					if (showMessage(json, 'show')) {
						dispatch({
							type: ActionTypes.CLOSE_OR_OPEN_PERIED_FETCH,
							receivedData: json
						})
					}
					dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
				})
			}
		}
	})
}

export const changeIcon = () => ({
	type: ActionTypes.CHANGE_ICON
})

export const getCurrencyListFetch = () => dispatch =>{
	fetchApi('getFCList', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_CURRENCY_LIST_FETCH_JZ,
                receivedData: json.data
            })
        }
    })
}

export const changeExchangeJz = (idx, value) => ({
	type: ActionTypes.CHANGE_EXCHANNGE_JZ,
	idx,
	value
})
