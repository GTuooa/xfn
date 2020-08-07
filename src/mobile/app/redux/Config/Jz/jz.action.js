import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getBalanceStatus = () => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getperiod', 'get', '', json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_BALANCE_STATUS,
				receivedData: json
			})
			// if (!json.data.closedyear && !json.data.openedyear) {
			// 	thirdparty.toast({icon: 'error', text: '尚未创建凭证'})
			// 	return history.goBack()
			// }
		}
	})
}

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

	if (promptInfo.length){
		return thirdParty.Alert(promptInfo.reduce((v, pre) => v + ',' + pre))
	}

	thirdParty.Confirm({
		message: `本操作将结账${year}年第${month}期`,
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				// fetchApi('closesob', 'POST', JSON.stringify({
				// 	year,
				// 	month,
				// 	fcList: circleStatus ? fcList : []
				// }), json => showMessage(json, 'show') && dispatch({
				// 	type: ActionTypes.CLOSE_SOB_FETCH,
				// 	receivedData: json
				// }) && dispatch(getCurrencyListFetch()) )
				thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
				fetchApi('closesob', 'POST', JSON.stringify({
					year,
					month,
					fcList: circleStatus ? fcList : []
				}), json => {

					if (showMessage(json, 'show')) {
						if (json.data.message) {
							thirdParty.toast.hide()
							thirdParty.Confirm({
								message: json.data.message,
								title: "提示",
								buttonLabels: ['取消', '确定'],
								onSuccess : (result) => {
									if (result.buttonIndex === 1) {
										thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
										fetchApi('closesob', 'POST', JSON.stringify({
											year,
											month,
											needCheckVcIndex: false,
											fcList: circleStatus ? fcList : []
										}), json => {
											if (showMessage(json, 'show')) {
												dispatch({
													type: ActionTypes.CLOSE_SOB_FETCH,
													receivedData: json
												})
												if (circleStatus) {
													dispatch(getCurrencyListFetch())
												}
											}
										})
									}
								}
							})
						} else {
							thirdParty.toast.success('操作成功', 2)
							dispatch({
								type: ActionTypes.CLOSE_SOB_FETCH,
								receivedData: json
							})
							if (circleStatus) {
								dispatch(getCurrencyListFetch())
							}
						}
					}
				})
			}
		},
		onFail : (err) => alert(err)
	})
}

export const openSobFetch = (year, month) => dispatch => {
	thirdParty.Confirm({
		message: `本操作将反结账${year}年第${month}期`,
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
				fetchApi('opensob', 'POST', JSON.stringify({
					year,
					month
				}), json => showMessage(json, 'show') && dispatch({
					type: ActionTypes.OPEN_SOB_FETCH,
					receivedData: json
				}))
			}
		},
		onFail : (err) => alert(err)
	})
}

export const getCurrencyListFetch = () => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getFCList', 'GET', '', json => {
        if (showMessage(json)) {
			thirdParty.toast.hide()
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
