import { fromJS,toJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const lrbState = fromJS({
	issuedate: '',
	endissuedate: '',
	chooseperiods: false,
	selectAssId: 0,
	lrbRuleModal: false,
	assSelectableList: [],
	issues:[],
	amountInput:0,
	incomestatement: [{
		balance: '',
		hashname: '',
		line: '',
		total: ''
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
	showInitLrb: false,//是否显示点击调整按钮后的页面
	selfMadeProfitList:[],//小番报表数据格式
	ifSelfMadeProfitList:true ,//是否显示小番报表
	showChildProfitList:[],
	proportionDifference:'increaseDecreasePercent',
	referChooseValue:'本年累计',
	curReferValue:'本年累计',
	selfListData:[],
	extraMessage:[],
	referBegin:'',
	referEnd:'',
	extraMessageList:[],
	cannotChecked:['减：营业费用'],    //不可勾选的项
    haveSwitchList:['减：营业成本','减：营业税金','销售费用','管理费用','财务费用'], //有切换按钮的项
    cannotTestList:['减：营业费用'],
	resultShowChild:[],
	resultListShowChildList:[],
	checkedList:[],
    showChildList:[],
	detailList:[],       //列表,
	resultList:[],
	calculType:'利润',
	incomeTotal:{},
})


export default function handleLrb(state = lrbState, action) {
	return ({
		[ActionTypes.INIT_LRB]							 : () => lrbState,
		[ActionTypes.BEFORE_GET_INCOME_STATEMENT_FETCH]  : () => state,
		[ActionTypes.CHANGE_SELECTASSID]				 : () => state.set('selectAssId', action.selectAssId),
		[ActionTypes.CHANGE_ASSSELECTABLELIST]			 : () => state.set('assSelectableList', fromJS(action.assSelectableList)),
		[ActionTypes.CHANGE_ISSUDATE]					 : () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate),
		[ActionTypes.CHANGE_INCOME_STATEMENT]			 : () => state.set('incomestatement', fromJS(action.receivedData)),
		[ActionTypes.CHANGE_LRB_RULE_MODAL]				 : () => state.update('lrbRuleModal', v => !v),
		[ActionTypes.GET_INIT_INCOMESTATEMENT]			 : () => {

				const incomestatement = state.get('incomestatement')
				const receivedData = action.receivedData.initPeriodList ? action.receivedData.initPeriodList : []
				// const receivedData = []

				let initPeriodList = []
				// 构造lrb期初值设置的列表
				incomestatement.forEach(v => {
					const lineindex = v.get('lineindex')
					const linename = v.get('linename')

					const InitLrb = receivedData.find(v => v.lineIndex === lineindex)
					const amount = InitLrb ? InitLrb.amount : ''

					initPeriodList.push({
						lineName: linename,
						lineIndex: lineindex,
						amount: amount
					})
				})

				return state.set('initPeriodList', fromJS(initPeriodList))
		},
		[ActionTypes.CHANGE_INIT_LRB_AMOUNT]				: () => {
			const amount = action.amount
			const lineIndex = action.lineIndex

			// 校验金额为数字且为2位数
			if (/^[-\d]\d*\.?\d{0,2}$/g.test(amount) || action.amount === '') {
				state = state.setIn(['initPeriodList', lineIndex-1, 'amount'], amount)
			}
			return state
		},
		[ActionTypes.CHANGE_LRB_CHOOSE_MORE_PERIODS]	 : () => state.update('chooseperiods', v => !v),
		[ActionTypes.SHOW_INIT_LRB]		: () => state.set('showInitLrb', action.value),
		[ActionTypes.CLEAR_INIT_LRB]	: () => {
			let initPeriodList = state.get('initPeriodList')
			initPeriodList.map((u, i) => {
				initPeriodList = initPeriodList.setIn([i, 'amount'], '')
			})
			return state.set('initPeriodList', initPeriodList)
		},
		[ActionTypes.CHANGE_LIST_TYPE]	: () => state.update('ifSelfMadeProfitList', v => !v),
		[ActionTypes.GET_SELF_MADE_PROFIT_LIST] :()=>{
			if (action.issues) {
				state = state.set('issues',fromJS(action.issues))
			}
			return state.set("selfMadeProfitList",fromJS(action.payload))
						.set('extraMessage',fromJS(action.extraMessage))
						.set('curReferValue','本年累计')
						.set('referBegin','')
						.set('referEnd','')
		},
		[ActionTypes.UPDATE_CHILD_PROFIT_LIST]:()=>{
			let uniqueId = action.payload
			let showChildProfitList = state.get("showChildProfitList").toJS()
			let newShowChildProfitList
			if(showChildProfitList.includes(uniqueId)){
				let index =showChildProfitList.findIndex((value,index)=>{
					return value ==uniqueId
				})
				showChildProfitList.splice(index,1)
				newShowChildProfitList = showChildProfitList
			}else{
				newShowChildProfitList = showChildProfitList.concat(uniqueId)
			}
			return state.set("showChildProfitList",fromJS(newShowChildProfitList))
		},
		[ActionTypes.EXPAND_TABLE]:()=>{
			let array=[]
			function showAll(list){
				if(list.childProfit && list.childProfit.length !==0){
					let id = list.lineindex !==0 ? list.lineindex:list.acId
					array.push(id)
					for(let i in list.childProfit){
						showAll(list.childProfit[i])
					}

				}
			}
			if(action.payload){
				let selfMadeProfitList = state.get("selfMadeProfitList").toJS()

				for(let i in selfMadeProfitList){
					showAll(selfMadeProfitList[i])
				}
			}
			return state.set("showChildProfitList",fromJS(array))
		},
		[ActionTypes.CHANGE_DIFFERENCE_TYPE]:()=>{
			return state.set('proportionDifference',action.value)
		},
		[ActionTypes.SET_REFER_CHOOSE_VALUE]:()=>{
			return state.set('referChooseValue',action.value)
		},
		[ActionTypes.SET_LRB_COMMON_VALUE]:()=>{
			return state.set(action.name,action.value)
		},
		[ActionTypes.SET_SELF_TYPE_LIST_DATA] :()=>{
			if (action.issues) {
				state = state.set('issues',fromJS(action.issues))
			}
			return state.set("selfMadeProfitList",fromJS(action.selfListData))
						.set("extraMessage",fromJS(action.extraMessage))
		},
		[ActionTypes.SET_REFER_DATE]:()=>{
			return state.set('referBegin',action.referBegin).set("referEnd",action.referEnd)
		},
		[ActionTypes.SET_MEASURE_INIT_DATA]:()=>{
            return state.set("incomeTotal",fromJS(action.incomeTotal))
                        .set('profit',action.profit)
                        .set("detailList",fromJS(action.detailList))
                        .set('checkedList',fromJS(action.checkedList))
                        .set('showChildList',fromJS(action.showChildList))
                        .set('resultShowChild',fromJS([]))
        },
		[ActionTypes.SET_MEASURE_INIT_DATE]:()=>{
            return state.set('measureIssuedate',action.issuedate)
						.set('measureIEndissuedate',action.endissuedate)
        },
		[ActionTypes.UPDATE_MEASURE_DETAIL_LIST]:()=>{
            return state.set('detailList',fromJS(action.detailList))
        },
		[ActionTypes.SET_RESULT_SHOW_CHILD_LIST]:()=>{
            let resultShowChildItem = action.resultShowChildItem
            let resultShowChild = state.get("resultShowChild").toJS()
            let newResultShowChild
            if(resultShowChild.includes(resultShowChildItem)){
				let index =resultShowChild.findIndex((value,index)=>{
					return value === resultShowChildItem
				})
				resultShowChild.splice(index,1)
				newResultShowChild = resultShowChild
			}else{
				newResultShowChild = resultShowChild.concat(resultShowChildItem)
			}
            return state.set('resultShowChild',fromJS(newResultShowChild))
        },
		[ActionTypes.SET_MEASURE_RESULT]:()=>{
            return state.set('profitResult',action.profitResult)
                        .set('ProfitAndLossResult',action.ProfitAndLossResult)
                        .set('resultList',action.resultList)
        },
		[ActionTypes.SHOW_MEASURE_RESULT]:()=>{
            let resultShowChild = state.get('resultShowChild').toJS()
            if(resultShowChild.includes('销售费用')||resultShowChild.includes('管理费用')||resultShowChild.includes('财务费用')){
                resultShowChild.push("减：营业费用")
            }

            return state.set('showResult',action.bool)
                        .set('resultListShowChildList',fromJS(resultShowChild))
        },
		[ActionTypes.HANDLE_MEASURE_RESULT_LIST_SHOW_CHILD]:()=>{
            let id = action.id
            let resultListShowChildList = state.get("resultListShowChildList").toJS()
            let newResultListShowChildList = resultListShowChildList
            if(resultListShowChildList.includes(id) && !action.show){
				let index =resultListShowChildList.findIndex((value,index)=>{
					return value === id
				})
				resultListShowChildList.splice(index,1)
				newResultListShowChildList = resultListShowChildList
			}else if (!resultListShowChildList.includes(id) && action.show) {
				newResultListShowChildList = resultListShowChildList.concat(id)
			}
            return state.set('resultListShowChildList',fromJS(newResultListShowChildList))
        },
	}[action.type] || (() => state))()
}
