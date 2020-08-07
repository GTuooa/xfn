import { fromJS, toJS  }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const ambsybState = fromJS({
	view: {
		status: '损益',
		assId: '',
		assCategory: '',
		didMount: false
	},
	issuedate: '',
	endissuedate: '',
	ambSourceList: [],
	assList: [
		// {
		// 	asscategory: '客户',
		// 	asslist: [
		// 		{
		// 			assid: '1',
		// 			assname: '独立核算A'
		// 		},
		// 		{
		// 			assid: '2',
		// 			assname: '独立核算B'
		// 		},
		// 		{
		// 			assid: '3',
		// 			assname: '独立核C'
		// 		}
		// 	]
		// },
		// {
		// 	asscategory: '供应商',
		// 	asslist: [
		// 		{
		// 			assid: '1',
		// 			assname: '独立核算A'
		// 		},
		// 		{
		// 			assid: '2',
		// 			assname: '独立核算B'
		// 		},
		// 		{
		// 			assid: '3',
		// 			assname: '独立核C'
		// 		}
		// 	]
		// }
	],
	gainAndLoss: {
		"income": 0,
        "pay": 0,
        "ginAndLoss": 0
	},
	trendMap: {
		"incomeForMonth":[
                // {
                //     "name":"201605",
                //     "amount":0
                // },
                // {
                //     "name":"201606",
                //     "amount":28000
                // },
                // {
                //     "name":"201607",
                //     "amount":1000
                // },
                // {
                //     "name":"201608",
                //     "amount":40000
                // },
                // {
                //     "name":"201609",
                //     "amount":50000
                // },
                // {
                //     "name":"201610",
                //     "amount":190000
                // }
            ],
            "payForMonth":[
				// {
				//     "name":"201605",
				//     "amount":0
				// },
				// {
				//     "name":"201606",
				//     "amount":0
				// },
				// {
				//     "name":"201607",
				//     "amount":0
				// },
				// {
				//     "name":"201608",
				//     "amount":0
				// },
				// {
				//     "name":"201609",
				//     "amount":0
				// },
				// {
				//     "name":"201610",
				//     "amount":1000
				// }
            ],
            "ginAndLossForMonth":[
				// {
				//     "name":"201605",
				//     "amount":0
				// },
				// {
				//     "name":"201606",
				//     "amount":28870
				// },
				// {
				//     "name":"201607",
				//     "amount":0
				// },
				// {
				//     "name":"201608",
				//     "amount":455657
				// },
				// {
				//     "name":"201609",
				//     "amount":0
				// },
				// {
				//     "name":"201610",
				//     "amount":4000
				// }
			]
		},
		"detailDrawing":{
			"incomeForMonth":[
				// {
				//     "name":"总部",
				//     "amount":100000
				// },
				// {
				//     "name":"乙事业部",
				//     "amount":90000
				// },
				// {
				//     "name":"甲事业部",
				//     "amount":800
				// },
				// {
				//     "name":"总部",
				//     "amount":100000
				// },
				// {
				//     "name":"乙事业部",
				//     "amount":90000
				// },
				// {
				//     "name":"甲事业部",
				//     "amount":800
				// }
			],
			"payForMonth":[
				// {
				//     "name":"总部",
				//     "amount":255000
				// },
				// {
				//     "name":"乙事业部",
				//     "amount":72000
				// },
				// {
				//     "name":"甲事业部",
				//     "amount":8000
				// }
			],
			"ginAndLossForMonth":[
				// {
				//     "name":"总部",
				//     "amount":177770
				// },
				// {
				//     "name":"乙事业部",
				//     "amount":18000
				// },
				// {
				//     "name":"甲事业部",
				//     "amount":20000
				// }
			]
		}
	}
)

export default function handleLrb(state = ambsybState, action) {
	return ({
		[ActionTypes.INIT_AMBSYB]				      	: () => ambsybState,
		[ActionTypes.CHANGE_CHAR_DIDMOUNT]				: () => state.setIn(['view', 'didMount'], action.bool),
		[ActionTypes.SWITCH_CHAR_STATUS]				: () => state.setIn(['view', 'status'], action.nextStatus),
		[ActionTypes.SET_AMB_ASSID]						: () => state.setIn(['view', 'assId'], action.assId),
		[ActionTypes.SET_AMB_ASSCATEGORY]			    : () => state.setIn(['view', 'assCategory'], action.assCategory),
		[ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH]		: () => {

			if (!action.assId) {
				state = state.set('assList', fromJS(action.receivedData.assList)).setIn(['view', 'assId'], '').setIn(['view', 'assCategory'], action.receivedData.assCategory)
			} else {
				state = state.setIn(['view', 'assId'], action.assId)
			}

			// if (!action.assCategory) {
			// 	state = state.setIn(['view', 'assCategory'], action.receivedData.assCategory)
			// }

			state = state.set('gainAndLoss', fromJS(action.receivedData.gainAndLoss))
			.set('trendMap', fromJS(action.receivedData.trendMap))
			.set('detailDrawing', fromJS(action.receivedData.detailDrawing))
			.set('issuedate', action.issuedate)
			.set('endissuedate', action.endissuedate)


			return state
		},
		[ActionTypes.GET_AMB_ASS_CATEGORY_LIST]				: () => {

			const ambSourceList = action.receivedData.map(v => {
				return {
					key: v.asscategory,
					value: v.asscategory,
				}
			})

			return state.set('ambSourceList', fromJS(ambSourceList))
		},
		[ActionTypes.CHANGE_AMB_BEGIN_DATE]				: () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		}

	}[action.type] || (() => state))()
}
