import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

const xmyeState = fromJS({
    flags:{
        "categoryUuid":"",
        "year":"",
        "month":"",
        "endYear":"",
        "endMonth":"",
        "subordinateUuid":"",
        "runningCategoryUuid":"",
        propertyCost:'',
        categoryList:[
            {
                children:[]
            }
        ],
        projectCategoryList:[
            {
                children:[]
            }
        ],
        xmType:'损益项目',
        runningType:'全部',
        endissuedate:'',
        menuLeftIdx: 0,
        lbMenuLeftIdx: 0,
        menuType:''
    },
    issues:[],
    "code": "",
    "uuid": "489391919097446400",
    "categoryUuid":"",
    "incomeAmount" :'',  //收入
    "expenseAmount" :'',  //支出
    "balanceAmount" :'',  //收支净额
    "realIncomeAmount":'',    //实收
    "realExpenseAmount" :'',  //实付
    "realBalanceAmount"  :'',   //收付净额
    "childList": [],
    balanceTemp:[]
})

export default function handleLrb(state = xmyeState, action) {
    return ({
        [ActionTypes.INIT_XMYEB]                                      : () => xmyeState,
        [ActionTypes.GET_XM_BALANCE_LIST]  : () => {
            if(action.isReflash) {
                // yezi
                state = state.set('balanceTemp', xmyeState)
            }

            if (action.getPeriod === 'true') {
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            if (action.changeDate) {
                state = state.setIn(['flags', 'xmType'],xmyeState.getIn(['flags','xmType']))
                            .setIn(['flags', 'runningType'],xmyeState.getIn(['flags','runningType']))
            }
            let selectList = []
            const looplist = (data) => data.map((item,i) => {
                if(item.childList && item.childList.length){
                    looplist(item.childList)
                }
                selectList.push(item.uuid)
            })
            if (action.receivedData.length) {
                selectList.push(action.receivedData[0].uuid)
                action.receivedData[0].childList.length && looplist(action.receivedData[0].childList)
            }
            let newList = []
            if(action.shouldConcat){
				let oldList = state.get('balanceTemp').toJS()
				newList = oldList.concat(action.receivedData)
			}else{
				newList = action.receivedData
			}
            return state.set('balanceTemp',fromJS(newList))
                  .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                  .setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
                  .setIn(['flags', 'balanceAmount'],action.balanceAmount)
                  .setIn(['flags', 'expenseAmount'],action.expenseAmount)
                  .setIn(['flags', 'incomeAmount'],action.incomeAmount)
                  .setIn(['flags', 'realBalanceAmount'],action.realBalanceAmount)
                  .setIn(['flags', 'realExpenseAmount'],action.realExpenseAmount)
                  .setIn(['flags', 'realIncomeAmount'],action.realIncomeAmount)
                  .setIn(['flags', 'categoryUuid'],action.categoryUuid)
                  .setIn(['flags', 'runningCategoryUuid'],action.runningCategoryUuid)
                  .setIn(['flags', 'isTop'],action.isTop)
                  .setIn(['flags', 'propertyCost'],action.propertyCost)
                  .setIn(['flags', 'runningShowChild'],fromJS([]))
                  .set('currentPage',action.currentPage)
                  .set('pageCount',action.pages)
    },
    // 流水类别是否显示下级
    [ActionTypes.ACCOUNTCONF_XM_BALANCE_TRIANGLE_SWITCH]          : () => {
        const showLowerList = state.getIn(['flags', 'runningShowChild'])

        if (!action.showChild) {
            // 原来不显示
            const newShowLowerList = showLowerList.push(action.uuid)
            return state.setIn(['flags', 'runningShowChild'], newShowLowerList)
        } else {
            // 原来显示
            const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
            return state.setIn(['flags', 'runningShowChild'], newShowLowerList)
        }
    },
    [ActionTypes.CHANGE_ZHYE_MORE_PERIODS] 	 : () => {
        if (action.chooseperiods) {
            return state.set('chooseperiods', true)
        } else {
            return state.update('chooseperiods', v => !v)
        }
    },
    [ActionTypes.CHANGE_XMYE_COMMON_STRING] 	 : () => {
        return state.setIn(action.placeArr, action.value)
    },
    [ActionTypes.XMYE_MENU_DATA]       : () => {
        return state.setIn(['flags', action.dataType], action.value)
    }
  }[action.type] || (() => state))()

}
