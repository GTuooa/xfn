import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

const wlyeState = fromJS({
  flags: {
      issuedate: '',
      runningShowChild: [],
      selectList: [],
      allBeginIncomeAmount: 0,
      allBeginExpenseAmount: 0,
      allHappenIncomeAmount: 0,
      allHappenExpenseAmount: 0,
      allPaymentIncomeAmount: 0,
      allPaymentExpenseAmount: 0,
      allBalanceIncomeAmount: 0,
      allBalanceExpenseAmount: 0,

      wlRelate:'',
      wlOnlyRelate: '',
      wlType:'全部',
      typeUuid:'',
      isTop:'',
      wlRelationship:[],

  },
  chooseperiods: false,
  balanceTemp: {
      'childList': []
  },
  // 流水类别
  runningCategory: [
      {
          'childList': []
      }
  ],
  contactTypeTree: [
     {
         "childList": [],
     }
],
relationList:[],
  period: {
    closedmonth:"",
    closedyear:"",
    firstmonth:"",
    firstyear:"",
    lastmonth:"",
    lastyear:"",
  },
  issues:[],
  // 分页
  currentPage: 1,
  pageCount: 1,
  runningCount: 0
})

export default function handleLrb(state = wlyeState, action) {
    return ({
        [ActionTypes.INIT_WLYEB]                                      : () => wlyeState,
        [ActionTypes.GET_WL_BALANCE_LIST]  : () => {
            if (action.getPeriod === 'true') {
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            let selectList = []
            const looplist = (data) => data.map((item,i) => {
                if(item.childList && item.childList.length){
                    looplist(item.childList)
                }else{
                    selectList.push(item.uuid)
                }
            })
            if(action.typeUuid !== '' && action.wlRelate === '' && action.count > 500){
                action.receivedData && selectList.push(action.receivedData[0].uuid)
            }else{
                action.receivedData && looplist(action.receivedData)
                // action.receivedData && action.receivedData.forEach(v => selectList.push(v.uuid))
            }

            return state = state.setIn(['flags', 'typeUuid'],action.typeUuid)
                                .setIn(['flags', 'wlType'],action.wlType)
                                .setIn(['flags', 'isTop'],action.isTop)
                                .setIn(['flags', 'wlRelate'],action.wlRelate)
                                .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                                .setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
                                .setIn(['balanceTemp', 'childList'],fromJS(action.receivedData))
                                .setIn(['flags', 'runningShowChild'],fromJS(selectList))
                                .set('currentPage',action.currentPage)
                                .set('pageCount',action.pages)
                                .set('runningCount',action.count)
                                .setIn(['flags', 'allBeginIncomeAmount'],action.allBeginIncomeAmount)
                                .setIn(['flags', 'allBeginExpenseAmount'],action.allBeginExpenseAmount)
                                .setIn(['flags', 'allHappenIncomeAmount'],action.allHappenIncomeAmount)
                                .setIn(['flags', 'allHappenExpenseAmount'],action.allHappenExpenseAmount)
                                .setIn(['flags', 'allPaymentIncomeAmount'],action.allPaymentIncomeAmount)
                                .setIn(['flags', 'allPaymentExpenseAmount'],action.allPaymentExpenseAmount)
                                .setIn(['flags', 'allBalanceIncomeAmount'],action.allBalanceIncomeAmount)
                                .setIn(['flags', 'allBalanceExpenseAmount'],action.allBalanceExpenseAmount)
    },
    // 流水类别是否显示下级
    [ActionTypes.ACCOUNTCONF_WL_BALANCE_TRIANGLE_SWITCH]          : () => {
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
    [ActionTypes.CHANGE_WLYE_MORE_PERIODS] 	 : () => {
        if (action.chooseperiods) {
            return state.set('chooseperiods', true)
        } else {
            return state.update('chooseperiods', v => !v)
        }
    },
    // [ActionTypes.GET_WL_CONTACTS] 	 : () => {

    //     return state = state.setIn(['flags','wlRelate'],action.value)
    // },
    [ActionTypes.CHANGE_WLYEB_COMMON_STRING] 	 : () => {

        return state = state.setIn(action.place,action.value)
    },
    [ActionTypes.GET_WL_TYPE_LIST] 	 : () => {
        if (action.getPeriod === 'true') {
            state = state.set('period',fromJS(action.period))
                        .set('issues',fromJS(action.issues))
        }

        return state = state.setIn(['contactTypeTree',0,'childList'],action.receivedData)
    },
    [ActionTypes.GET_WL_RELATION_LIST] 	 : () => {
        if (action.getPeriod === 'true') {
            state = state.set('period',fromJS(action.period))
                        .set('issues',fromJS(action.issues))
        }
        if(action.receivedData.length < 3){
            state = state.setIn(['flags','wlRelate'],'')
        }
        return state = state.setIn(['flags','wlRelationship'],fromJS(action.receivedData))

    }




  }[action.type] || (() => state))()

}
