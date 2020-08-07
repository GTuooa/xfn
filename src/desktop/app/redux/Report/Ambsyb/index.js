import { fromJS, toJS } from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const ambsybState = fromJS({
	view: {
		chooseperiods: false,
		// status: '损益',
		assId: '',
		assCategory: '',
		// didMount: false
		yearAmountSort: 1,
		currentAmountSort: 1,
		increaseAmountSort: 1,
		propYearAmountSort: 1,
		yearIncreaseAmountSort: 1,
		didMount: false,
		currentAc: '损益净额',
		tableShowChild: []
	},
	issuedate: '',
    endissuedate: '',
    ambSourceList: [],
	"assList":[
        // {
        //     "aclist":[
		//
        //     ],
        //     "asscategory":"阿米巴",
        //     "asslist":[
        //         {
        //             "assid":"2",
        //             "assname":"甲事业部"
        //         },
        //         {
        //             "assid":"3",
        //             "assname":"乙事业部"
        //         }
        //     ]
        // }
    ],
    "detailDrawing":{
        // "ginAndLossForMonth":[
        //     {
        //         "amount":20000,
        //         "name":"甲事业部"
        //     },
        //     {
        //         "amount":18000,
        //         "name":"乙事业部"
        //     },
		// 	{
        //         "amount":18000,
        //         "name":"乙事业部"
        //     },
		// 	{
        //         "amount":18000,
        //         "name":"乙事业部"
        //     },
		// 	{
        //         "amount":18000,
        //         "name":"乙事业部"
        //     },
		// 	{
        //         "amount":18000,
        //         "name":"乙事业部"
        //     },
		// 	{
        //         "amount":18000,
        //         "name":"乙事业部"
        //     }
        // ],
        "incomeForMonth":[
            // {
            //     "amount":100000,
            //     "name":"甲事业部"
            // },
            // {
            //     "amount":90000,
            //     "name":"乙事业部"
            // }
        ],
        "payForMonth":[
            // {
            //     "amount":80000,
            //     "name":"甲事业部"
            // },
            // {
            //     "amount":72000,
            //     "name":"乙事业部"
            // },
			// {
            //     "amount":80000,
            //     "name":"甲事业部"
            // },
            // {
            //     "amount":72000,
            //     "name":"乙事业部"
            // },
			// {
            //     "amount":80000,
            //     "name":"甲事业部"
            // },
            // {
            //     "amount":72000,
            //     "name":"乙事业部"
            // },
			// {
            //     "amount":80000,
            //     "name":"甲事业部"
            // },
            // {
            //     "amount":72000,
            //     "name":"乙事业部"
            // }
        ]
    },
    "firstAcList":[
        // {
        //     "amount":10190000,
        //     "category":"income",
        //     "name":"主营业务收入主营业务收入主营业务收入"
        // },
		// {
        //     "amount":10190000,
        //     "category":"income",
        //     "name":"主营业务收入主营业务收入主营业务收入"
        // },
		// {
        //     "amount":10190000,
        //     "category":"income",
        //     "name":"主营业务收入主营业务收入主营业务收入"
        // },
		// {
        //     "amount":10190000,
        //     "category":"income",
        //     "name":"主营业务收入主营业务收入主营业务收入"
        // },
		// {
        //     "amount":10190000,
        //     "category":"income",
        //     "name":"主营业务收入主营业务收入主营业务收入"
        // },
        // {
        //     "amount":152000,
        //     "category":"pay",
        //     "name":"主营业务成本"
        // },
		// {
        //     "amount":152000,
        //     "category":"pay",
        //     "name":"主营业务成本"
        // },
		// {
        //     "amount":152000,
        //     "category":"pay",
        //     "name":"主营业务成本"
        // },
		// {
        //     "amount":152000,
        //     "category":"pay",
        //     "name":"主营业务成本"
        // }
    ],
    "gainAndLoss":{
        "ginAndLoss": 0,
        "income": 0,
        "pay": 0
    },
    "trendMap":{
        "ginAndLossForMonth":[
            // {
            //     "amount":0,
            //     "name":"201511"
            // },
            // {
            //     "amount":0,
            //     "name":"201512"
            // },
            // {
            //     "amount":0,
            //     "name":"201601"
            // },
            // {
            //     "amount":1232476,
            //     "name":"201602"
            // },
            // {
            //     "amount":0,
            //     "name":"201603"
            // },
            // {
            //     "amount":0,
            //     "name":"201604"
            // },
            // {
            //     "amount":0,
            //     "name":"201605"
            // },
            // {
            //     "amount":0,
            //     "name":"201606"
            // },
            // {
            //     "amount":0,
            //     "name":"201607"
            // },
            // {
            //     "amount":0,
            //     "name":"201608"
            // },
            // {
            //     "amount":0,
            //     "name":"201609"
            // },
            // {
            //     "amount":38000,
            //     "name":"201610"
            // }
        ],
        "incomeForMonth":[
            // {
            //     "amount":0,
            //     "name":"201511"
            // },
            // {
            //     "amount":0,
            //     "name":"201512"
            // },
            // {
            //     "amount":0,
            //     "name":"201601"
            // },
            // {
            //     "amount":0,
            //     "name":"201602"
            // },
            // {
            //     "amount":0,
            //     "name":"201603"
            // },
            // {
            //     "amount":140,
            //     "name":"201604"
            // },
            // {
            //     "amount":0,
            //     "name":"201605"
            // },
            // {
            //     "amount":0,
            //     "name":"201606"
            // },
            // {
            //     "amount":0,
            //     "name":"201607"
            // },
            // {
            //     "amount":0,
            //     "name":"201608"
            // },
            // {
            //     "amount":0,
            //     "name":"201609"
            // },
            // {
            //     "amount":190000,
            //     "name":"201610"
            // }
        ],
        "payForMonth":[
            // {
            //     "amount":0,
            //     "name":"201511"
            // },
            // {
            //     "amount":10000,
            //     "name":"201512"
            // },
            // {
            //     "amount":0,
            //     "name":"201601"
            // },
            // {
            //     "amount":0,
            //     "name":"201602"
            // },
            // {
            //     "amount":0,
            //     "name":"201603"
            // },
            // {
            //     "amount":0,
            //     "name":"201604"
            // },
            // {
            //     "amount":0,
            //     "name":"201605"
            // },
            // {
            //     "amount":0,
            //     "name":"201606"
            // },
            // {
            //     "amount":0,
            //     "name":"201607"
            // },
            // {
            //     "amount":0,
            //     "name":"201608"
            // },
            // {
            //     "amount":0,
            //     "name":"201609"
            // },
            // {
            //     "amount":152000,
            //     "name":"201610"
            // }
        ]
    },
	"ambDetailTable":{
        "isForOneMonth": "TRUE",
		totalLine:{
			// "name":"合计",
			// "yearAmount":107404.85,
			// "currentAmount":107404.85,
			// "increaseAmount":107404.85,
			// "increaseScaleAmount":-9999,
			// "propYearAmount":0
		},
		acIdList: [
            // {
            //     "acId":"5001",
            //     "name":"主营业务收入",
            //     "upperId":null
            // },
            // {
            //     "acId":"5401",
            //     "name":"主营业务成本",
            //     "upperId":null
            // }
		],
        "acTable": [
			// {
            //     "acId":"01",
            //     "name":"一.总收入",
            //     "upperId":"",
            //     "yearAmount":100000,
            //     "currentAmount":100000,
            //     "increaseAmount":100000,
            //     "increaseScaleAmount":-9999,
            //     "propYearAmount":0
            // },
            // {
            //     "acId":"5001",
            //     "name":"主营业务收入",
            //     "upperId":"",
            //     "yearAmount":100000,
            //     "currentAmount":100000,
            //     "increaseAmount":100000,
            //     "increaseScaleAmount":-9999,
            //     "propYearAmount":0
            // },
			// {
            //     "acId":"500101",
            //     "name":"主营业收入1",
            //     "upperId":"5001",
            //     "yearAmount":100000,
            //     "currentAmount":100000,
            //     "increaseAmount":100000,
            //     "increaseScaleAmount":-9999,
            //     "propYearAmount":0
            // },
			// {
            //     "acId":"50010101",
            //     "name":"主营业收入2",
            //     "upperId":"500101",
            //     "yearAmount":100000,
            //     "currentAmount":100000,
            //     "increaseAmount":100000,
            //     "increaseScaleAmount":-9999,
            //     "propYearAmount":0
            // },
			// {
            //     "acId":"5001010101",
            //     "name":"主营业收入3",
            //     "upperId":"50010101",
            //     "yearAmount":100000,
            //     "currentAmount":100000,
            //     "increaseAmount":100000,
            //     "increaseScaleAmount":-9999,
            //     "propYearAmount":0
            // },
            // {
            //     "acId":"02",
            //     "name":"二.总支出",
            //     "upperId":"",
            //     "yearAmount":80000,
            //     "currentAmount":80000,
            //     "increaseAmount":80000,
            //     "increaseScaleAmount":-9999,
            //     "propYearAmount":0
            // },
            // {
            //     "acId":"5401",
            //     "name":"主营业务成本",
            //     "upperId":"",
            //     "yearAmount":80000,
            //     "currentAmount":80000,
            //     "increaseAmount":80000,
            //     "increaseScaleAmount":-9999,
            //     "propYearAmount":0
            // },
            // {
            //     "acId":"03",
            //     "name":"三.损益核算结果",
            //     "upperId":"",
            //     "yearAmount":20000,
            //     "currentAmount":20000,
            //     "increaseAmount":20000,
            //     "increaseScaleAmount":-9999,
            //     "propYearAmount":0
            // }
		],
        "assTable":[
            // {
            //     "name":"乙事业部",
            //     "upperId":null,
            //     "yearAmount":16000,
            //     "currentAmount":16000,
            //     "increaseAmount": -162000,
            //     "increaseScaleAmount": -0.34,
            //     "propYearAmount":0
            // },
            // {
            //     "name":"甲事业部",
            //     "upperId":null,
            //     "yearAmount":180000,
            //     "currentAmount":180000,
            //     "increaseAmount":180000,
            //     "increaseScaleAmount":0.7,
            //     "propYearAmount":0
            // }
        ]
    }
})

export default function handleLrb(state = ambsybState, action) {
	return ({
		[ActionTypes.INIT_AMBSYB]							: () => ambsybState,
		[ActionTypes.CHANGE_AMBSYB_CHOOSE_MORE_PERIODS]		: () => state.updateIn(['view', 'chooseperiods'], v => !v),
		[ActionTypes.AMB_SORT_BY_SORTNAME]				: () => {
			// 三个排序通过传参不同统一转换排序
			const sortStandardStr = action.sortStandardStr //'yearAmountSort'
			const sortName = action.sortName //'yearAmount'
			const sortStandard = -state.getIn(['view', sortStandardStr])
			return state
				.updateIn(['view', sortStandardStr], v => -v)
				.updateIn(['ambDetailTable', 'assTable'], v => v.sort((a, b) => a.get(sortName) > b.get(sortName) ? sortStandard : - sortStandard))
		},
		[ActionTypes.GET_AMB_ASS_CATEGORY_LIST]				: () => {
			return state.set('ambSourceList', fromJS(action.receivedData))
		},
		[ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH]			: () => {

			state = state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate).setIn(['view', 'currentAc'], '损益净额')

			// 首次进入没有assid和assCategory，就要将后台数据填入state，后面切换账期等就看传入等参数了
			if (!action.assId) {
				// state = state.set('assList', fromJS(action.receivedData.assList)).setIn(['view', 'assId'], '').setIn(['view', 'assCategory'], action.receivedData.assList.length ? action.receivedData.assList[0].asscategory : '')
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
							// .set('firstAcList', fromJS(action.receivedData.firstAcList))
							.set('ambDetailTable', fromJS(action.receivedData.ambDetailTable))

			return state
		},
		// 是否接收到后台数据，如果为true就可以开始渲染
		[ActionTypes.CHANGE_CHAR_DIDMOUNT]					: () => state.setIn(['view', 'didMount'], action.bool),
		[ActionTypes.SELECT_AMB_CURRENT_AC]					: () => state.setIn(['view', 'currentAc'], action.info),
		[ActionTypes.CHANGE_TABLE_SHOW_CHILD]			    : () => {

			const tableShowChild = state.getIn(['view', 'tableShowChild'])

			if (tableShowChild.indexOf(action.id) > -1)
				return state.updateIn(['view', 'tableShowChild'], v => v.map(w => w.indexOf(action.id) > -1 ? '' : w).filter(w => !!w))
			else
				return state.updateIn(['view', 'tableShowChild'], v => v.push(action.id))
		},
		// 科目树选择
		[ActionTypes.AMB_SELECT_AC]							: () => state.update('ambDetailTable', v => v.set('assTable', fromJS(action.receivedData.assTable)).set('isForOneMonth', action.receivedData.isForOneMonth).set('totalLine', fromJS(action.receivedData.totalLine)))
	}[action.type] || (() => state))()
}
