import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

export const getFCListFetch = () => dispatch => {
    fetchApi('getFCList', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_FC_LIST_FETCH,
                receivedData: json.data
            })
        }
    })
}

export const getFCRelateAcListFetch = () => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getFCRelateAcList', 'GET', '', json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.GET_FC_RELATE_AC_LIST_FETCH,
                receivedData: json.data
            })
        }
    })
}

export const getModelFCListFetch = () => dispatch => {
    // thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getModelFCList', 'GET', '', json => {
        if (showMessage(json)) {
            // thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.GET_MODEL_FC_LIST_FETCH,
                receivedData: json.data
            })
        }
    })
}

export const showAllCurrencyCheckBox = () => ({
    type: ActionTypes.SHOW_ALL_CURRENCY_CHECKBOX
})

export const hideAllCurrencyCheckBox = () => ({
    type: ActionTypes.HIDE_ALL_CURRENCY_CHECKBOX
})

export const selectCurrencyItem = (idx) => ({
    type: ActionTypes.SELECT_CURRENCY_ITEM,
    idx
})

export const selectAllCurrencyCheckBox = () => ({
    type: ActionTypes.SELECT_ALL_CURRENCY_CHECKBOX
})

//新增／修改
export const insertCurrency = () => ({
    type: ActionTypes.INSERT_CURRENCY
})

export const modifyCurrency = (fcNumber, exchange) => ({
    type: ActionTypes.MODIFY_CURRENCY,
    fcNumber,
    exchange
})

export const changeFcNumber = (fcNumber, name) => ({
    type: ActionTypes.CHANGE_FC_NUMBER,
    fcNumber,
    name
})

export const changeExchange = (value) => ({
    type: ActionTypes.CHANGE_EXCHANGE,
    value
})

export const cancelSaveCurrency = () => ({
    type: ActionTypes.CANCEL_SAVE_CURRENCY
})

export const saveCurrencyFetch = (currency, handleCurrency, history) => dispatch => {
    const decimal = currency.get('exchange').toString().split('.')
    let prompt = [];

    if (!currency.get('fcNumber')) {
        prompt.push('币别不能为空')
    }
    if (!currency.get('exchange')) {
        prompt.push('汇率不能为空')
    } else if (Number(currency.get('exchange')) <= 0) {
        prompt.push('汇率不能小于等于0')
    } else {
        if (decimal[1] && decimal[1].length > Limit.FC_EXCHANGE_DECIMAL_LENGTH ) {
            prompt.push('汇率只支持小数点后四位')
        }
    }
    if (prompt.length){
		return thirdParty.Alert(prompt.reduce((v, pre) => v + ',' + pre))
	}

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    ;({
        modify() {
            fetchApi('modifyFC', 'POST', JSON.stringify({
                fcNumber: currency.get('fcNumber'),
                exchange: currency.get('exchange'),
            }), json => {
                if (showMessage(json)) {
                    thirdParty.toast.hide()
                    // dispatch(getFCListFetch())
                    history.goBack()
                }
            })
        },
        insert() {
            fetchApi('insertFC', 'POST', JSON.stringify({
                fcNumber: currency.get('fcNumber'),
                name: currency.get('name'),
                exchange: currency.get('exchange'),
            }), json => {
                if (showMessage(json)) {
                    thirdParty.toast.hide()
                    // dispatch(getFCListFetch())
                    history.goBack()
                }
            })
        }
    }[handleCurrency])()
}

//删除
export const deleteCurrencyFetch = (currencyList) => (dispatch) => {

    const list =  currencyList.filter(v => v.get('standard') != '1')
    const fcNumber = list.filter(v => v.get('selected')).map((u,i) => u.get('fcNumber'))

    // 不要删除，不在钉钉环境时要用
    // if (!confirm("确定删除该币别吗？删除后可在“添加币别”中重新添加"))
    // 	return
    // fetchApi('deleteFC', 'POST', JSON.stringify({numberList: fcNumber}), json => {
    //     if (showMessage(json)) {
    //         if (json.data && json.data.length) {
    //             alert(json.data[0].message)
    //         }
    //         dispatch(getFCListFetch())
    //         dispatch(hideAllCurrencyCheckBox())
    //     }
    // })

    thirdParty.Confirm({
		message: "确定删除该币别吗？删除后可在“添加币别”中重新添加",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                fetchApi('deleteFC', 'POST', JSON.stringify({numberList: fcNumber}), json => {
                    if (showMessage(json)) {
                        thirdParty.toast.hide()
                        if (json.data && json.data.length) {
                            thirdParty.Alert(json.data[0].message)
                        }
                        dispatch(getFCListFetch())
                        dispatch(hideAllCurrencyCheckBox())
                    }
                })
            }
		}
	})

}

//关联科目
export const changeTabIndexCurrency = (idx) => ({
    type: ActionTypes.CHANGE_TAB_INDEX_CURRENCY,
    idx
})


export const changeRelatedAcListFetch = (history) => (dispatch, getState) => {
	const { allState } = getState()
	const list = allState.get('aclist').toSeq().filter(v => v.get('selected')).map(v => v.get('acid'))
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('relateFCList', 'POST', JSON.stringify({list}), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch(acAllActions.getAcListFetch())
            dispatch(getFCRelateAcListFetch())

            if (json.data && json.data.length) {
                if (json.data.length > 1) {
                    const error = json.data.map(v => v.message).reduce((prev, v) => prev + ',' + v)
                    thirdParty.Alert(error)
                } else {
                    thirdParty.Alert(json.data[0].message)
                }
            }
            history.goBack()
		}
	})
}
