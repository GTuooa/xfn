import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const assmxbState = fromJS({
	issuedate: '',
    endissuedate: '',
	currentAssCategory: '客户',
	chooseperiods: false,
	selectedKeys: '0',
	currentPage: 1,
	pageCount: 0,
	assidTwo: '',
	asscategoryTwo: '',
	assNameTwo:'',
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
    }
})

export default function handleLrb(state = assmxbState, action) {
	return ({
		[ActionTypes.INIT_ASSMXB]    								: () => assmxbState,
		// [ActionTypes.CHANGE_ASSMXB_ISSUEDATE]						: () => state.set('issuedate', action.issuedate),
		// [ActionTypes.CHANGE_ASSMXB_ENDISSUEDATE]				 	: () => state.set('endissuedate', action.endissuedate),
		[ActionTypes.GET_ASS_MXB_ACLIST_TFETCH]						: () => state.set('assmxbAclist', fromJS(action.receivedData)).set('currentAssCategory', action.asscategory)
																				.set('issuedate', action.issuedate)
																				.set('endissuedate', action.endissuedate),
        [ActionTypes.GET_REPORT_ASS_DETAIL_FETCH]                   : () => {
			return state.set('reportassdetail', fromJS(action.receivedData))
			.set('currentPage', action.currentPage)
			.set('pageCount', action.pageCount)
			.set('assidTwo', action.assidTwo)
			.set('asscategoryTwo', action.asscategoryTwo)
			.set('assNameTwo', action.assNameTwo)
			.set('selectedKeys', action.selectedKeys ? action.selectedKeys : assmxbState.get('selectedKeys'))
		},
		// [ActionTypes.CHANGE_TREE_SELECTEDKEYS]						: () => state.set('selectedKeys', action.selectedKeys ? action.selectedKeys : assmxbState.get('selectedKeys')),
		[ActionTypes.CHANGE_ASSMXB_CHOOSEPERIODS]					: () => action.bool === undefined ? state.update('chooseperiods', v => !v) : state.set('chooseperiods', action.bool)
	}[action.type] || (() => state))()
}
