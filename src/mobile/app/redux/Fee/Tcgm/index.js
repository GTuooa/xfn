import * as ActionTypes	from './ActionTypes.js'
import { fromJS } from 'immutable'

//生产环境应当设置为空
const tcgmState = fromJS({
	views: {
		buyOrUpgrade: 'upgrade',

		upgradeStatu: [],

		buyStatu: {
			equityName: '',
			index: ''
		},

		orderNumber: '',
		orderAmount: '',
		// orderWindowShow: false,

		agreeGm: false,
		agreeSj: false,

		untreatedOrderVisible: false, //未处理订单的mldal状态
	    untreatedOrderMessage: '', //未处理订单的提示信息
	    untreatedOrderList:[], //未处理订单的详细信息
	    untreatedOrderNo:[] //未处理订单的编号
    },
	aliPayAppInfo: '',
	data: {
        payInfo: {
			"corpId": "",
			"corpName": "",
			"expirationInfo": "",
			"equityList": [],
			"packageList": {}
		}
	}
})

export default function handleHome(state = tcgmState, action) {
	return ({
		[ActionTypes.GET_PAY_PRODUCT_FETCH]			   : () => {
			return state = state.setIn(['data', 'payInfo'], fromJS(action.receivedData))
        },

		[ActionTypes.TCGM_SELECT_BUY_ITEM]		   : () => {

			const equityName = state.getIn(['views', 'buyStatu', 'equityName'])

			if (equityName !== action.key) {
				state = state.setIn(['views', 'buyStatu', 'equityName'], action.key)
							.setIn(['views', 'buyStatu', 'index'], 0)
			} else {
				state = state.setIn(['views', 'buyStatu', 'equityName'], '')
							.setIn(['views', 'buyStatu', 'index'], '')
			}

			return state
		},

		[ActionTypes.TCGM_SELECT_BUY_ITEM_INDEX]		   : () => {

			const index = state.getIn(['views', 'buyStatu', 'index'])
			const equityName = state.getIn(['views', 'buyStatu', 'equityName'])

			if (equityName !== action.key) {
				state = state.setIn(['views', 'buyStatu', 'equityName'], action.key)
			}

			if (index !== action.index) {
				state = state.setIn(['views', 'buyStatu', 'index'], action.index)
			}

			return state
		},

		[ActionTypes.TCGM_SELECT_UPGRADE_ITEM]		   : () => {

			const upgradeStatu = state.getIn(['views', 'upgradeStatu'])

			const keyIndex = upgradeStatu.findIndex(v => v.get('productName') === action.key)

			if (keyIndex > -1) {
				// 如果有选中了的，就清空
				state = state.updateIn(['views', 'upgradeStatu'], v => v.delete(keyIndex))

			} else {
				state = state.updateIn(['views', 'upgradeStatu'], v => v.push(fromJS({
					productName: action.key,
					index: 0
				})))
			}

			return state
		},

		[ActionTypes.TCGM_SELECT_UPGRADE_ITEM_INDEX]		   : () => {

			const upgradeStatu = state.getIn(['views', 'upgradeStatu'])
			const keyIndex = upgradeStatu.findIndex(v => v.get('productName') === action.key)

			if (keyIndex > -1) { // 存在
				state = state.updateIn(['views', 'upgradeStatu'], v => v.setIn([keyIndex, 'index'], action.index))
			} else {
				state = state.updateIn(['views', 'upgradeStatu'], v => v.push(fromJS({
					productName: action.key,
					index: action.index
				})))
			}

			return state
		},

		// [ActionTypes.AFTER_SUBMIT_ORDER_TCSJ]					: () => {
		//
		// 	return state = state.setIn(['views', 'orderNumber'], action.orderNumber)
		// 						.setIn(['views', 'orderAmount'], action.orderAmount)
		// 						.setIn(['views', 'orderWindowShow'], true)
		// },

		[ActionTypes.SUBMIT_ORDER_TCGM]                         : () => {

			return state = state.setIn(['views', 'orderNumber'], action.orderNo)
								.setIn(['views', 'orderAmount'], action.orderAmount)
								.setIn(['views', 'orderWindowShow'], true)
								.set('aliPayAppInfo', action.receivedData.payInfo)
			// .set('orderNo', action.orderNo)
			// 					.setIn(['flags', 'showOrderStatus'], true)
			// 					.set('aliPayAppInfo', action.receivedData.payInfo)
		},
		// [ActionTypes.AFTER_SUBMIT_ORDER_TCGM]					: () => {
		//
		// 	return state = state.setIn(['views', 'orderNumber'], action.orderNumber)
		// 						.setIn(['views', 'orderAmount'], action.orderAmount)
		// 						.setIn(['views', 'orderWindowShow'], true)
		// },
		[ActionTypes.SUBMIT_ORDER_TCSJ]                     : () => {

			return state = state.setIn(['views', 'orderNumber'], action.orderNo)
								.setIn(['views', 'orderAmount'], action.orderAmount)
								.setIn(['views', 'orderWindowShow'], true)
								.set('aliPayAppInfo', action.receivedData.payInfo)
		},

		[ActionTypes.SUCCESS_SUBMIT_ORDER]					: () => {

			return state = state.setIn(['views', 'orderNumber'], action.orderNumber)
								.setIn(['views', 'orderAmount'], action.orderAmount)
		},

		[ActionTypes.SUCCESS_SUBMIT_TC]						: () => {

			return state.setIn(['views', 'orderWindowShow'], false)
		},
		[ActionTypes.CANCEL_SHOW_ORDER_TCSJ]						: () => {
			return state.setIn(['views', 'orderWindowShow'], false)
		},

		[ActionTypes.SWITCH_TCGM_BUY_OR_UPGRADE]				    : () => {
			return state = state.setIn(['views', 'buyOrUpgrade'], action.buyOrUpgrade)
		},

		[ActionTypes.FROM_TCXQ_JUMP_TO_TCGM]						: () => {
			state = state.setIn(['views', 'upgradeStatu'], fromJS([{
				productName: action.productName,
				index: 0
			}]))

			return state
		},

		[ActionTypes.AGREE_READ_CONTRACT_TCSJ]                         : () => {
			state = state.setIn(['views', 'agreeSj'], action.bool)
			return state
		},
		[ActionTypes.AGREE_READ_CONTRACT_TCGM]                         : () => {
			state = state.setIn(['views', 'agreeGm'], action.bool)
			return state
		},

		[ActionTypes.UNTREATED_ORDER_TC]								: () => {
			return state.setIn(['views', 'untreatedOrderVisible'], !state.get('untreatedOrderVisible'))
                        .setIn(['views', 'untreatedOrderMessage'], action.message)
                        .setIn(['views', 'untreatedOrderList'], action.receivedData)
                        .setIn(['views', 'untreatedOrderNo'], action.receivedData.map((u,i) =>  u.orderNo))
		},
		[ActionTypes.CANCEL_UNTREATED_ORDER_TC]   : () => state.setIn(['views', 'untreatedOrderVisible'], !state.getIn(['views', 'untreatedOrderVisible']))

	}[action.type] || (() => state))()
}
