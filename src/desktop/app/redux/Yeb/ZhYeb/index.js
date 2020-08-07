import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

const zhyeState = fromJS({
  flags: {
      issuedate: '',
      // bool， 已发生， 未发生
      // duty， reality， waitFor
      // '权责发生制', '收付实现制', '收付管理'
      main: 'duty',
      mainWater:'allWater',

      insertOrModify: 'insert',
      runningInsertOrModify: 'insert',
      payOrReceive: '收',

      runningSelect: [],

      runningShowChild: [],

      accountAssModalShow: false,

      curCategory: '全部',
      curAccountUuid: '',
      accountName:'全部',
      assId: '',
      assCategory: '',
      acId: '',
      selectList: [],
      showRunningInfo:{},
      allBeginAmount: 0,
      allIncomeAmount: 0,
      allExpenseAmount: 0,
      allBalanceAmount: 0

  },
  chooseperiods: false,
  balanceTemp: {

  },
  // 流水类别
  runningCategory: [
      {
          'childList': []
      }
  ],
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
})

export default function handleLrb(state = zhyeState, action) {
    return ({
        [ActionTypes.INIT_ZHYEB]                                      : () => zhyeState,
        [ActionTypes.GET_ZH_BALANCE_LIST]  : () => {
            if(action.isReflash) {
                // yezi
                state = state.set('balanceTemp', zhyeState)
            }

            if (action.getPeriod === 'true') {
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            let selectList = []
            action.receivedData.forEach(v => selectList.push(v.categoryUuid))

            return state.set('balanceTemp',fromJS(action.receivedData))
                  .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                  .setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
                  .setIn(['flags', 'runningShowChild'],fromJS(selectList))
                  .setIn(['flags', 'allBeginAmount'],action.allBeginAmount)
                  .setIn(['flags', 'allExpenseAmount'],action.allExpenseAmount)
                  .setIn(['flags', 'allIncomeAmount'],action.allIncomeAmount)
                  .setIn(['flags', 'allBalanceAmount'],action.allBalanceAmount)
    },
    // 流水类别是否显示下级
    [ActionTypes.ACCOUNTCONF_ZH_BALANCE_TRIANGLE_SWITCH]          : () => {
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
    }




  }[action.type] || (() => state))()

}
