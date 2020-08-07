import { fromJS } from 'immutable'
import { DateLib } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const measureState = fromJS({
    issuedate: '',
    endissuedate: '',
    showResult:false,   //结果页与计算页切换
    incomeTotal:[],     //营业收入
    profit:[],          //营业利润
    detailList:[],       //列表,
    amountInput:'0',
    checkedList:[],
    showChildList:[],
    testProfit:false,    //true测利润 false测盈亏
    cannotChecked:['减：营业费用'],    //不可勾选的项
    haveSwitchList:['减：营业成本','减：营业税金','销售费用','管理费用','财务费用'], //有切换按钮的项
    cannotTestList:['减：营业费用'],    //没有待测项的项
    profitResult:0,     //利润结果
    ProfitAndLossResult:0,  //盈亏结果
    resultList:[],
    resultListShowChildList:[],
    resultShowChild:[],     //测算页的展开收拢同步到结果页
})
export default function handleTest(state = measureState, action) {
    return ({
		[ActionTypes.INIT_MEASURE]					         : () => measureState,
        [ActionTypes.SET_MEASURE_INIT_DATE]:()=>{
            return state.set('issuedate',action.issuedate).set('endissuedate',action.endissuedate)
        },
        [ActionTypes.SET_MEASURE_INIT_DATA]:()=>{
            return state.set("incomeTotal",action.incomeTotal)
                        .set('profit',action.profit)
                        .set("detailList",fromJS(action.detailList))
                        .set('checkedList',fromJS(action.checkedList))
                        .set('showChildList',fromJS(action.showChildList))
                        .set('resultShowChild',fromJS([]))
        },
        [ActionTypes.CHANGE_AMOUNT_INPUT]:()=>{
            return state.set("amountInput",action.value)
        },
        [ActionTypes.HANDLE_SHOW_CHILD_LIST]:()=>{
            let uniqueId = action.uniqueId
			let showChildList = state.get("showChildList").toJS()
			let newShowChildList
            if(showChildList.includes(uniqueId)){
				let index =showChildList.findIndex((value,index)=>{
					return value ==uniqueId
				})
				showChildList.splice(index,1)
				newShowChildList = showChildList
			}else{
				newShowChildList = showChildList.concat(uniqueId)
			}
            return state.set("showChildList",fromJS(newShowChildList))
        },
        [ActionTypes.HANDLE_CHECKED_LIST]:()=>{
            let uniqueId = action.uniqueId
            let checkedList = state.get("checkedList").toJS()
            let newCheckedList
            if(checkedList.includes(uniqueId)){
				let index =checkedList.findIndex((value,index)=>{
					return value ==uniqueId
				})
				checkedList.splice(index,1)
				newCheckedList = checkedList
			}else{
				newCheckedList = checkedList.concat(uniqueId)
			}
            return state.set("checkedList",fromJS(newCheckedList))
        },
        [ActionTypes.CHANGE_MEASURE_TEST_TYPE]:()=>state.update('testProfit',v=>!v),
        [ActionTypes.UPDATE_MEASURE_DETAIL_LIST]:()=>{
            return state.set('detailList',fromJS(action.detailList))
        },
        [ActionTypes.SHOW_MEASURE_RESULT]:()=>{
            let resultShowChild = state.get('resultShowChild').toJS()
            if(resultShowChild.includes('销售费用')||resultShowChild.includes('管理费用')||resultShowChild.includes('财务费用')){
                resultShowChild.push("营业费用")
            }

            return state.set('showResult',action.bool)
                        .set('resultListShowChildList',fromJS(resultShowChild))
        },
        [ActionTypes.SET_MEASURE_RESULT]:()=>{
            return state.set('profitResult',action.profitResult)
                        .set('ProfitAndLossResult',action.ProfitAndLossResult)
                        .set('resultList',action.resultList)
        },
        [ActionTypes.HANDLE_MEASURE_RESULT_LIST_SHOW_CHILD]:()=>{
            let id = action.id
            let resultListShowChildList = state.get("resultListShowChildList").toJS()
            let newResultListShowChildList
            if(resultListShowChildList.includes(id)){
				let index =resultListShowChildList.findIndex((value,index)=>{
					return value === id
				})
				resultListShowChildList.splice(index,1)
				newResultListShowChildList = resultListShowChildList
			}else{
				newResultListShowChildList = resultListShowChildList.concat(id)
			}
            return state.set('resultListShowChildList',fromJS(newResultListShowChildList))
        },
        [ActionTypes.CLEAR_MEASURE_RESULT_SHOW_CHILD_LIST]:()=>{
            return state.set('resultListShowChildList',fromJS([]))
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
        }


	}[action.type] || (() => state))()
}
