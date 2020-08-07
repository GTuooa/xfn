import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const assMxbState = fromJS({
	issuedate: '',
	endissuedate: '',
    assidTwo: '',
    asscategory: '',
	asscategoryTwo: '',
    assmxbAclist: [
        // {
        //     "assid": "1",
        //     "acDtoList": [{
        //         "acfullname": "应付职工薪酬_工资",
        //         "category": "流动负债",
        //         "acname": "工资",
        //         "acid": "2211",
        //         "asscategorylist": [],
        //         "direction": "credit",
        //         "upperid": "",
        //         "sobid": "sob_4551a4426a7b407faa629997d55e876f20170117171103"
        //     },{
        //         "acfullname": "应付职工薪酬_工资",
        //         "category": "流动负债",
        //         "acname": "工资",
        //         "acid": "221101",
        //         "asscategorylist": [],
        //         "direction": "credit",
        //         "upperid": "2211",
        //         "sobid": "sob_4551a4426a7b407faa629997d55e876f20170117171103"
        //     }],
        //     "asscategory": "部门",
        //     "assname": "业务部"
        // }
    ],
    reportassdetail: {
        "acid": "",
        "acname": "",
        "acfullname": "",
        "debit": 0,
        "credit": 0,
        "direction": "debit",
        "openingbalance": 0,
        "closingbalance": 0,
        "assid": "",
        "assname": "",
        "jvlist": [
		// 	{
        //     "vcindex": 1,
        //     "vcdate": "2016-09-02",
        //     "jvabstract": "交通费报销",
        //     "jvamount": 68,
        //     "jvdirection": "debit",
        //     "balance": 68
        // }
		],
        "code": 0,
        "message": "成功"
    },
	isDouble: false,//是否是双辅助
	doubleAss: []//第二个辅助核算的列表
})

export default function handleLrb(state = assMxbState, action) {
	return ({
		[ActionTypes.INIT_ASSMXB]    								: () => assMxbState,
		[ActionTypes.CHANGE_ASSMXB_ISSUEDATE]						: () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate).set('asscategory', action.asscategory),
		[ActionTypes.GET_ASS_MXB_ACLIST_TFETCH]						: () => state.set('assmxbAclist', fromJS(action.receivedData)).set('assidTwo', '').set('asscategoryTwo', ''),
        [ActionTypes.GET_REPORT_ASS_DETAIL_FETCH]                   : () => state.set('reportassdetail', fromJS(action.receivedData))
		.set('assidTwo',action.assidTwo)
		.set('asscategoryTwo',action.asscategoryTwo),
		[ActionTypes.CHANGE_ASSMX_BEGIN_DATE]				        : () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},
		[ActionTypes.SET_DOUBLEASS]						              : () => state.set('doubleAss', fromJS(action.doubleAss))


	}[action.type] || (() => state))()
}
