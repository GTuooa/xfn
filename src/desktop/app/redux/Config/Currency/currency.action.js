import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import { showError } from 'app/redux/Home/All/all.action.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

export const getFCListFetch = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getFCList', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_FC_LIST_FETCH,
                receivedData: json.data
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// export const getModelFCListFetch = () => dispatch => {
//     dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
//     fetchApi('getModelFCList', 'GET', '', json => {
//         if (showMessage(json)) {
//             dispatch({
//                 type: ActionTypes.GET_MODEL_FC_LIST_FETCH,
//                 receivedData: json.data
//             })
//         }
//         dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
//     })
// }

export const getFCRelateAcListFetch = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getFCRelateAcList', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_FC_RELATE_AC_LIST_FETCH,
                receivedData: json.data
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

//新增／修改币别
export const changeCurrencyModalDisplay = (fcNumber, exchange) => ({
    type: ActionTypes.CHANGE_CURRENCY_MODAL_DISPLAY,
    fcNumber,
    exchange
})

export const cancelCurrencyModalDisplay = () => ({
    type: ActionTypes.CANCEL_CURRENCY_MODAL_DISPLAY
})

export const changeCurrency = (item) => ({
    type: ActionTypes.CHANGE_CURRENCY,
    item
})

export const changeInsertExchange = (exchangeValue) => ({
    type: ActionTypes.CHANGE_INSERT_EXCHANGE,
    exchangeValue
})

export const saveCurrencyFetch = (insertCurrencyList) => dispatch => {
    const decimal = insertCurrencyList.get('exchnge') ? insertCurrencyList.get('exchange').split('.') : []
    let prompt = [];

    if (!insertCurrencyList.get('fcNumber')) {
        prompt.push('币别不能为空')
    }
    if (!insertCurrencyList.get('exchange')) {
        prompt.push('汇率不能为空')
    } else if (Number(insertCurrencyList.get('exchange')) <= 0) {
        prompt.push('汇率不能小于等于0')
    } else {
        if (decimal[1] && decimal[1].length > Limit.FC_EXCHANGE_DECIMAL_LENGTH ) {
            prompt.push('汇率只支持小数点后四位')
        }
    }
    if (prompt.length){
        // console.log(prompt.reduce((v, pre) => v + ',' + pre))
		return thirdParty.Alert(prompt.reduce((v, pre) => v + ',' + pre))
	}

    ({
        modify() {
            fetchApi('modifyFC', 'POST', JSON.stringify({
                fcNumber: insertCurrencyList.get('fcNumber'),
                exchange: insertCurrencyList.get('exchange'),
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.SAVE_CURRENCY_FETCH
                    })
                    dispatch(getFCListFetch())
                }
            })
        },
        insert() {
            fetchApi('insertFC', 'POST', JSON.stringify({
                fcNumber: insertCurrencyList.get('fcNumber'),
                name: insertCurrencyList.get('name'),
                exchange: insertCurrencyList.get('exchange')
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.SAVE_CURRENCY_FETCH
                    })
                    dispatch(getFCListFetch())
                }
            })
        }
    }[sessionStorage.getItem('handleCurrency')])()
}


//关联科目
export const changeAcTabKey = (key) => ({
    type: ActionTypes.CHANGE_AC_TAB_KEY,
    key
})

export const changeSelectAcListModalDisplay = () => ({
    type: ActionTypes.CHANGE_SELECT_AC_LIST_MODAL_DISPLAY
})

export const modifyRelatedAcList = (selectedAclist) => ({
    type: ActionTypes.MODIFY_RELATED_AC_LIST,
    selectedAclist
})

export const changeRelatedAcListFetch = (relatedAclist) => dispatch => {

    fetchApi('relateFCList', 'POST', JSON.stringify({
        list: relatedAclist.map(v => v.get('acid'))

    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_SELECT_AC_LIST_MODAL_DISPLAY
            })
            dispatch(allActions.getAcListFetch())

            dispatch(getFCListFetch())
            dispatch(getFCRelateAcListFetch())
            // if (json.data && json.data.length) {
            //     dispatch(showCurrencyInfo(json.data))
            // }
            showError(json)
        }
    })
}
//关联科目时，后台返回的提示信息
export const showCurrencyInfo = (data) => ({
    type: ActionTypes.SHOW_NOT_CANCEL_CURRENCY_INFO,
    data
})


export const deleteRelateAcItem = (acid) => ({
    type: ActionTypes.DELETE_RELATE_AC_ITEM,
    acid
})


//删除
export const deleteCurrencyFetch = (fcNumber) => (dispatch) => {
    // 不要删除，不在钉钉环境时要用
    // if (!confirm('确定删除？'))
    // 	return
    // fetchApi('deleteFC', 'POST', JSON.stringify({numberList: [fcNumber]}), json => {
    //     if (showMessage(json)) {
    //         if (json.data && json.data.length) {
    //             thirdparty.alert(json.data[0].message)
    //         }
    //         dispatch(getFCListFetch())
    //     }
    // })

    thirdParty.Confirm({
		message: "确定删除该币别吗？删除后可在“添加币别”中重新添加",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
                fetchApi('deleteFC', 'POST', JSON.stringify({numberList: [fcNumber]}), json => {
                    if (showMessage(json)) {
                        if (json.data && json.data.length) {
                            thirdParty.Alert(json.data[0].message)
                        }
                        dispatch(getFCListFetch())
                    }
                })
            }
		},
		onFail : (err) => console.log(err)
	})

}
