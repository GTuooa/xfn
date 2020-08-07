import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { message } from 'antd'
import { showMessage } from 'app/utils'
import moment from 'moment'
import * as thirdParty from 'app/thirdParty'
import { Modal } from 'antd'

//获取模块组合之后的价格
export const getPackageAmountListAndgetAdminCorpinfoFetch = () => (dispatch) => {

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })

    fetchApi('adminCorpEquity', 'GET', '', json => {
		if (showMessage(json)) {

            dispatch({
				type: ActionTypes.GET_ADMIN_CORPINFO_EQUITY,
				receivedData: json.data
			})

		}

        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
	})
}


export const getTrailEquityFetch = (productCode) => (dispatch) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('trailEquity', 'POST', JSON.stringify({productCode}), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
		if (showMessage(json, 'show')) {
            dispatch(getPackageAmountListAndgetAdminCorpinfoFetch())
		}
	})
}

//显示订单详情
export const showOrderInfo = (idx) => ({
   type: ActionTypes.SHOW_ORDER_INFO,
   idx
})

export const cancelShowOrderInfo = () => ({
    type: ActionTypes.CANCEL_SHOW_ORDER_INFO
})

// 支付页面 验证支付
export const completePayOrder = (orderNo) => (dispatch) =>{
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('complete', 'POST', JSON.stringify({
        orderNo: orderNo
    }), json =>{
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json, 'show')) {
            // dispatch({
            //     type: ActionTypes.COMPLETE_PAY_SUCCESS_ORDER,
            //     receivedData: json.data
            // })
        }

    })
}
// 待付款 取消订单
export const cancelWaitPayOrder = (orderNo) => dispatch => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('cancelOrder', 'POST', JSON.stringify({
        orderNo: [orderNo]
    }), json =>{
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json, 'show')) {
            dispatch({
                type: ActionTypes.CANCEL_WAIT_PAY_ORDER,
                receivedData: json.data
            })
            dispatch(getPackageAmountListAndgetAdminCorpinfoFetch())
        }
    })
}

//单击选中单个账套
export const selectOneButtonOrder = (itemID) => ({
    type: ActionTypes.SELECT_ONE_BUTTON_ORDER,
    itemID
})

//单击选中所有账套
export const selectAllButtonOrder = () => ({
    type: ActionTypes.SELECT_ALL_BUTTON_ORDER
})

// 显示申请发票弹框
export const showBillMessage = () => ({
    type: ActionTypes.SOW_BILL_MESSAGE
})

export const closeBillMessage = () => ({
    type: ActionTypes.CLOSE_BILL_MESSAGE
})

export const showPrompt = (orderNoList, invoice) => ({
    type: ActionTypes.SHOW_PROMPT,
    orderNoList,
    invoice
})

export const closeShowPrompt = () => ({
    type: ActionTypes.CLOSE_SHOW_PROMPT
})

export const showEmailOrder = (payAmount, orderNo) => ({
    type: ActionTypes.SHOW_EMAIL_ORDER
})

export const successSubmitOrder = (orderAmount, orderNumber) => dispatch => {
    dispatch({
        type: ActionTypes.CANCEL_WAIT_PAY_ORDER
    })

    dispatch({
        type: ActionTypes.SUCCESS_SUBMIT_ORDER,
        orderAmount,
        orderNumber
    })
}
//联系电话格式不正确
export const showTelephoneOrder = () => ({
   type: ActionTypes.SHOW_TELEPHONE_ORDER
})
//税号格式不正确
export const showDutyIdOrder = () => ({
    type: ActionTypes.SHOW_DUTY_ID_ORDER
})

//显示字段为空的提示信息
 export const showInvoiceStatus = (spaceArr) => ({
    type: ActionTypes.SHOW_INVOICE_STATUS,
    spaceArr
})

//用户写的发票抬头的值
export const changeInvoiceTitleOrder = (value) => ({
    type: ActionTypes.CHANGE_INVOICE_TITLE_ORDER,
    value
})

//用户写的税号的值
export const changeDutyIdOrder = (value) => ({
    type: ActionTypes.CHANGE_DUTY_ID_ORDER,
    value
})

//用户写的联系电话的值
 export const changeTelephoneOrder = (value) => ({
     type: ActionTypes.CHANGE_TELEPHONE_ORDER,
     value
 })

 //邮箱
export const changeEmailOrder = (value) => ({
    type: ActionTypes.CHANGE_EMAIL_ORDER,
    value
})

//用户写的备注的值
export const changeRemarkOrder = (value) => ({
     type: ActionTypes.CHANGE_REMARK_ORDER,
     value
})

//向后台发送发票信息
export const createInvoiceToserver = (orderNoList, invoice)=> dispatch => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('createInvoiceUrl', 'POST', JSON.stringify({
        orderNoList: orderNoList,
        invoice: invoice
    }), json =>{
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {

            dispatch(getPackageAmountListAndgetAdminCorpinfoFetch())

            dispatch({
                type: ActionTypes.CREATE_INVOICE_TO_SERVER
            })

        }
    })
}

//申请退款
export const applyRefund = (orderNo) => dispatch => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('refund', 'POST', JSON.stringify({
        orderNo: orderNo
    }), json =>{
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (json.code!==0) {
            if(json.code == 31014) {
                dispatch(cancelShowOrderInfo())
                thirdParty.Alert(`错误信息：${json.message} `)
            } else {
                thirdParty.Alert(`错误信息：${json.message} `)
            }
        } else {
            dispatch(getPackageAmountListAndgetAdminCorpinfoFetch())
            thirdParty.Alert('退款申请成功，款项将于1～3个工作日退回，请及时查看支付宝款项信息。若有疑问请联系客服电话：0571-28121680。')

            // dispatch({
            //     type : ActionTypes.APPLY_REFUND_ORDER
            // })

        }
    })
}
