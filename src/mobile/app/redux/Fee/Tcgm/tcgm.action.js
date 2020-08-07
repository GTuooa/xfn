import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'

import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { feeActions } from 'app/redux/Fee'
import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'
import { homeActions } from 'app/redux/Home/home.js'

//获取模块组合之后的价格
export const getPayProductFetch = () => (dispatch) => {

    // thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('payProductInfo', 'GET', '', json => {
        // thirdParty.toast.hide()
		if (showMessage(json)) {

            dispatch({
				type: ActionTypes.GET_PAY_PRODUCT_FETCH,
				receivedData: json.data
			})
		}
	})
}

export const tcgmSelectBuyItem = (key) => ({
    type: ActionTypes.TCGM_SELECT_BUY_ITEM,
    key
})

export const tcgmSelectBuyItemIndex = (key, index) => ({
    type: ActionTypes.TCGM_SELECT_BUY_ITEM_INDEX,
    key,
    index
})
export const tcgmSelectUpgradeItem = (key) => ({
    type: ActionTypes.TCGM_SELECT_UPGRADE_ITEM,
    key
})

export const tcgmSelectUpgradeItemIndex = (key, index) => ({
    type: ActionTypes.TCGM_SELECT_UPGRADE_ITEM_INDEX,
    key,
    index
})

export const switchTcgmBuyOrUpgrade = (buyOrUpgrade) => ({
    type: ActionTypes.SWITCH_TCGM_BUY_OR_UPGRADE,
    buyOrUpgrade
})

export const submitOrderTcgm = (buy) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('payNewOrder', 'POST', JSON.stringify({
        subjectName: buy.get('equityName'),
        body: '小番财务帐套套餐',
        orderWay: '1',
        orderType: '0',
        payAmount: Math.floor(buy.get('payFee')),
        goodsCode: [buy.get('equityCode')]
    }), json => {

        if (json.code !== 0) { //失败
            thirdParty.toast.hide()
            if (json.code == 31011) {   //未处理的订单
                dispatch({
                    type: ActionTypes.UNTREATED_ORDER_TC,
                    message: json.message,
                    receivedData: json.data
                })

            } else {
                thirdParty.Alert(`错误代码：${json.code} 错误信息：${json.message} `)
            }
        } else {  //成功
            const orderNo = json.data

            fetchApi('aliPayAppInfo', 'GET', `orderNo=${orderNo}`, json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.SUBMIT_ORDER_TCGM,
                        orderNo: orderNo,
                        receivedData: json.data,
                        orderAmount: buy.get('payFee')
                    })
                }
            })
        }
    })
}

// 提交升级订单
export const submitOrderTcsj = (subjectName, amount, goodsCode) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('payNewOrder', 'POST', JSON.stringify({
        subjectName: subjectName,
        body: '小番财务帐套套餐',
        orderWay: '1',
        orderType: '2',
        payAmount: Math.floor(amount),
        goodsCode: goodsCode
    }), json => {

        if (json.code!==0) { //失败
            thirdParty.toast.hide()
            if(json.code == 31011){
                dispatch({
                    type: ActionTypes.UNTREATED_ORDER_TC,
                    message: json.message,
                    receivedData: json.data
                })
            }else{
                thirdParty.Alert(`错误代码：${json.code} 错误信息：${json.message} `)
            }
        } else {
            const orderNo = json.data
            fetchApi('aliPayAppInfo', 'GET', `orderNo=${orderNo}`, json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.SUBMIT_ORDER_TCSJ,
                        orderNo: orderNo,
                        receivedData: json.data,
                        orderAmount: Math.floor(amount)
                    })
                }
            })
        }
    })
}

// 关闭套餐购买升级的未处理订单弹窗
export const cancelUntreatedOrderTc = () => dispatch => {
    dispatch({
        type: ActionTypes.CANCEL_UNTREATED_ORDER_TC
    })
}

//未处理订单 取消订单
export const cancelOrderTc = (orderNo) => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('cancelOrder', 'POST', JSON.stringify({
        orderNo: orderNo
    }), json =>{
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CANCEL_UNTREATED_ORDER_TC
            })
            thirdParty.toast.info('取消订单成功', 1)
        }
    })
}

// //点击去支付
export const successSubmitTc = () => ({
    type: ActionTypes.SUCCESS_SUBMIT_TC
})

export const cancelShowOrderTcsj = () => ({
    type: ActionTypes.CANCEL_SHOW_ORDER_TCSJ
})

// 待付款 调用钉钉组件
export const payment = (orderNo) => dispatch => {

    fetchApi('aliPayAppInfo', 'GET', `orderNo=${orderNo}`, json => {
        if (showMessage(json)) {
            const aliPayAppInfo = json.data.payInfo

            thirdParty.pay({
                info: aliPayAppInfo, // 订单信息，
                onSuccess: function (result) {
                    dispatch(feeActions.switchFeeActivePage('Tcxq'))
                    dispatch(tcxqActions.getPackageAmountListAndgetAdminCorpinfoFetch())
                },
                onFail: function (err) {
                    thirdParty.Alert(JSON.stringify(err))
                }
            })
        }
    })
}

export const fromTcxqJumpToTcgm = (productName) => ({
    type: ActionTypes.FROM_TCXQ_JUMP_TO_TCGM,
    productName
})

// 用户服务协议点击同意
export const agreeReadContractTcsj = (bool) => ({
    type: ActionTypes.AGREE_READ_CONTRACT_TCSJ,
    bool
})

// 用户服务协议点击同意
export const agreeReadContractTcgm = (bool) => ({
    type: ActionTypes.AGREE_READ_CONTRACT_TCGM,
    bool
})
