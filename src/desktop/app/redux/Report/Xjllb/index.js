import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const xjllbState = fromJS({
    issuedate:'',     //开始日期
    endissuedate:'',    //结束日期
	chooseEndDate: false,    //复选框的状态
	issues:[],
    cachFlowList: [{    //每列的数据
        lineIndex: '',
		lineName: '',
        amount: '',
        sumAmount: ''
	}],
    initPeriodList: [
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
    showInitXjllb: false
})


export default function handleLrb(state = xjllbState, action) {
	return ({
        [ActionTypes.INIT_XJLLB]                        : () => xjllbState,
        [ActionTypes.GET_CACH_FLOW_FETCH]               : () => {
        	state = state.set('cachFlowList', fromJS(action.receivedData)).set('showInitXjllb',false)
        	if (action.issues) {
        		state = state.set('issues',fromJS(action.issues))
        	}
        	return state
        },
        [ActionTypes.CHANGE_XJLLB_ISSUDATE]             : () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate),
        [ActionTypes.CHANGE_XJLLB_CHOOSE_MORE_PERIODS]  : () => state.update('chooseEndDate', v => !v),
        [ActionTypes.SHOW_INIT_XJLLB]	                : () => state.set('showInitXjllb', action.value),
        [ActionTypes.GET_INIT_XJLLB_INCOMESTATEMENT]	: () => {
            const cachFlowList = state.get('cachFlowList')
            const receivedData = action.receivedData.initPeriodList ? action.receivedData.initPeriodList : []
			let initPeriodList = []
			cachFlowList.forEach(v => {
				const lineindex = v.get('lineIndex')
				const linename = v.get('lineName')
                const InitXjllb = receivedData.find(v => v.lineIndex === lineindex)
				const amount = InitXjllb ? InitXjllb.amount : ''
				initPeriodList.push({
					lineName: linename,
					lineIndex: lineindex,
					amount: amount
				})
			})
			return state.set('initPeriodList', fromJS(initPeriodList))
		},
        [ActionTypes.CHANGE_INIT_XJLLB_AMOUNT]				: () => {
			const amount = action.amount
			const lineIndex = action.lineIndex

			// 校验金额为数字且为2位数
			if (/^[-\d]\d*\.?\d{0,2}$/g.test(amount) || action.amount === '') {
				state = state.setIn(['initPeriodList', lineIndex, 'amount'], amount)
			}else{
                return state
            }
            //自动计算 --定义的的常量都是行次
            let initPeriodList = state.get('initPeriodList')
            const amontSeven = getAmount(1) + getAmount(2) - getAmount(3) - getAmount(4) - getAmount(5) - getAmount(6)
            const amontThirteen = getAmount(9) + getAmount(10) + getAmount(11) - getAmount(12) - getAmount(13)
            const amontNineteen = getAmount(16) + getAmount(17) - getAmount(18) - getAmount(19) - getAmount(20)
            const twenty        = amontSeven + amontThirteen + amontNineteen
            const twentyTwo     = twenty + getAmount(23)

            function getAmount(idx) {
                const amount = initPeriodList.getIn([idx, 'amount'])
                return amount == '' ? 0 : Number(amount)
            }
            return state = state.setIn(['initPeriodList', 7, 'amount'], amontSeven.toFixed(2))
            .setIn(['initPeriodList', 14, 'amount'], amontThirteen.toFixed(2))
            .setIn(['initPeriodList', 21, 'amount'], amontNineteen.toFixed(2))
            .setIn(['initPeriodList', 22, 'amount'], twenty.toFixed(2))
            .setIn(['initPeriodList', 24, 'amount'], twentyTwo.toFixed(2))
		},
        [ActionTypes.CLEAR_INIT_XJLLB]	: () => {
			let initPeriodList = state.get('initPeriodList')
			initPeriodList.map((u, i) => {
				initPeriodList = initPeriodList.setIn([i, 'amount'], '')
			})
			return state.set('initPeriodList', initPeriodList)
		}

	}[action.type] || (() => state))()
}
