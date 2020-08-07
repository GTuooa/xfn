import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { message } from 'antd'
import { showMessage } from 'app/utils'
import moment from 'moment'
import * as thirdParty from 'app/thirdParty'
import { Modal } from 'antd'
import { ROOTURL } from 'app/constants/fetch.constant.js'

// import { loading }

//获取模块组合之后的价格
export const getPayProductFetch = () => (dispatch) => {

    // dispatch(switchLoadingMask())
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })

    fetchApi('payProductInfo', 'GET', '', json => {
		if (showMessage(json)) {

            dispatch({
				type: ActionTypes.GET_PAY_PRODUCT_FETCH,
				receivedData: json.data
			})

		}

        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
	})
}

// export const tcgmSelectBuyItem = (key) => ({
//     type: ActionTypes.TCGM_SELECT_BUY_ITEM,
//     key
// })

// export const tcgmSelectBuyItemIndex = (key, index) => ({
//     type: ActionTypes.TCGM_SELECT_BUY_ITEM_INDEX,
//     key,
//     index
// })
export const tcgmSelectUpgradeItem = (key) => ({
    type: ActionTypes.TCGM_SELECT_UPGRADE_ITEM,
    key
})

export const tcgmSelectUpgradeItemIndex = (key, index) => ({
    type: ActionTypes.TCGM_SELECT_UPGRADE_ITEM_INDEX,
    key,
    index
})

// export const switchTcgmBuyOrUpgrade = (buyOrUpgrade) => ({
//     type: ActionTypes.SWITCH_TCGM_BUY_OR_UPGRADE,
//     buyOrUpgrade
// })

// export const submitOrderTcgm = (buy) => dispatch => {

//     fetchApi('payNewOrder', 'POST', JSON.stringify({
//         subjectName: buy.get('equityName'),
//         body: '小番财务账套套餐',
//         orderWay: '1',
//         orderType: '0',
//         payAmount: Math.floor(buy.get('payFee')),
//         goodsCode: [buy.get('equityCode')]
//     }), json => {
//         if (showMessage(json)) {
//             dispatch({
//                 type: ActionTypes.AFTER_SUBMIT_ORDER_TCGM,
//                 orderNumber: json.data,
//                 orderAmount: buy.get('payFee')
//             })
//         }
//     })
// }

// 提交升级订单
export const submitOrderTcsj = (subjectName, amount, goodsCode) => dispatch => {

    fetchApi('payNewOrder', 'POST', JSON.stringify({
        subjectName: subjectName,
        body: '小番财务帐套套餐',
        orderWay: '1',
        orderType: '2',
        payAmount: Math.floor(amount),
        goodsCode: goodsCode
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_SUBMIT_ORDER_TCSJ,
                orderNumber: json.data,
                orderAmount: Math.floor(amount)
            })
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

export const payment = (corpId, ddUserId, orderNo, history) => dispatch => {
    thirdParty.openLink({
        url: `${ROOTURL}/index.html#/paycode?corpId=${corpId}&ddUserId=${ddUserId}&orderNo=${orderNo}`
    })
}

export const fromTcxqJumpToTcgm = (productName) => ({
    type: ActionTypes.FROM_TCXQ_JUMP_TO_TCGM,
    productName
})
