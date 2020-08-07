import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const zcfzbState = fromJS({
	issuedate: '',
	nullBalanceItemVisible: false,
	balancesheet: [/*{
		linename: '',
		yearopeningbalance: 0,
		closingbalance: 0,
		lineindex:1
	}*/],
	initBaSheetList: [
		// {
		// 	"lineName":"一.营业收入",
		// 	"lineIndex":1,
		// 	"amount":200
		// },{
		// 	"lineName":"减:营业成本",
		// 	"lineIndex":2,
		// 	"amount":100
		// }
	],
	focusRef: 0,
	showInitZcfzb: false,
	issues:[]
})


export default function handleZcfzb(state = zcfzbState, action) {
	return ({
		[ActionTypes.INIT_ZCFZB]					: () => action.issuedate ? zcfzbState.set('issuedate', action.issuedate) : zcfzbState,
		// [ActionTypes.BEFORE_GET_BALANCE_SHEET_FETCH]: () => state,
		[ActionTypes.GET_BALANCE_SHEET_FETCH]  		: () => {
			if (action.issues) {
				state = state.set('issues',fromJS(action.issues))
			}
			return state.set('issuedate', action.issuedate).set('balancesheet', fromJS(action.receivedData.data))
		},
		[ActionTypes.GET_INIT_BAL_SHEET_VALUE]		: () => {
			const balancesheet = state.get('balancesheet')
			let initBaSheetList = []
			// 构造zcfzb年初余额设置的列表
			balancesheet.forEach(v => {
				const lineindex = v.get('lineindex')
				const linename = v.get('linename')
				const amount = v.get('yearopeningbalance')
				initBaSheetList.push({
					lineName: linename,
					lineIndex: lineindex,
					amount: amount ? amount : ''
				})
			})
			return state.set('initBaSheetList', fromJS(initBaSheetList))
		},
		[ActionTypes.CHANGE_INIT_ZCFZB_AMOUNT]		: () => {
			const amount = action.value
			const lineIndex = action.lineIndex

			// 校验金额为数字且小数只有两位
			if (/^[-\d]\d*\.?\d{0,2}$/g.test(amount) || action.value === '') {
				state = state.setIn(['initBaSheetList', lineIndex-1, 'amount'], amount)
			} else {
				return state
			}
			let amontTwo = '', amontTree = '', amontFour = '', amontFive = '', amontSix = '', amontSeven = '', amontEight = '', amontNine = '', amountTen = ''
			let baSheetList = state.get('initBaSheetList')

			// 自动计算---start
			amontTwo = circle(0,9) + getAmount(13)  //流动资产合计
			amontTree = getAmount(17) - getAmount(18)	//固定资产账面价值
			amontFour = getAmount(15) + getAmount(16) + amontTree +  circle(20, 28)	//非流动资产合计
			amontFive = amontTwo + amontFour	//资产总计
			amontSix = circle(30, 40)	//流动负债合计
			amontSeven = circle(41, 45)	//非流动负债合计
			amontEight = amontSix + amontSeven	//负债合计
			amontNine = circle(47, 51)	//所有者权益合计
			amountTen = amontEight + amontNine	//负债和权益总计

			function circle(index1, index2) {
				let number = 0
				for (var i = index1; i<index2; i++) {
					number += getAmount(i)
				}
				return number
			}

			function getAmount(idx) {
				const amount = baSheetList.getIn([idx, 'amount'])
				return amount == '' ? 0 : Number(amount)
			}

			if (baSheetList.size) {
				baSheetList = baSheetList.setIn([14, 'amount'], amontTwo.toFixed(2))
									.setIn([19, 'amount'], amontTree.toFixed(2))
									.setIn([28, 'amount'], amontFour.toFixed(2))
									.setIn([29, 'amount'], amontFive.toFixed(2))
									.setIn([40, 'amount'], amontSix.toFixed(2))
									.setIn([45, 'amount'], amontSeven.toFixed(2))
									.setIn([46, 'amount'], amontEight.toFixed(2))
									.setIn([51, 'amount'], amontNine.toFixed(2))
									.setIn([52, 'amount'], amountTen.toFixed(2))
			}
			// 自动计算---end
			return state.set('initBaSheetList', baSheetList)
		},
		[ActionTypes.CLEAR_INIT_AMOUNT]		: () => {
			let initBaSheetList = state.get('initBaSheetList')
			initBaSheetList.map((u, i) => {
				initBaSheetList = initBaSheetList.setIn([i, 'amount'], '')
			})
			return state.set('initBaSheetList', initBaSheetList)
		},
		[ActionTypes.SHOW_INIT_ZCFZB]	    : () => state.set('showInitZcfzb', action.value)

	}[action.type] || (() => state))()
}
