import { fromJS, toJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const wlmxState = fromJS({
    flags: {
        issuedate: '',
        endissuedate: '',
        categoryName: '全部',
        curCardUuid: '',
        allHappenAmount: 0,
        allHappenBalanceAmount: 0,
        allIncomeAmount: 0,
        allExpenseAmount: 0,
        allBalanceAmount: 0,

        selectList: [],
        runningShowChild: [],
        showRunningInfo:{},
        selectCategory:'',
        wlRelate:'3',
        wlType:'全部',
        typeUuid:'',
        isTop:'',
        categoryUuid: '',
        selectedCard:'',
        searchContent: ''
    },
    cardList:[

    ],
    chooseperiods: false,

  // 流水类别
  runningCategory: [
      {childList:[]}
  ],
    detailsTemp:[

    ],
contactTypeTree: [
],
    period: {
      closedmonth:"",
      closedyear:"",
      firstmonth:"",
      firstyear:"",
      lastmonth:"",
      lastyear:"",
    },
    //日期列表
    issues:[],
    // 分页
    currentPage: 1,
    pageCount: 0,
    cardPages: 0,
    cardCurPage: 1

})


export default function handleLrb(state = wlmxState, action) {
	return ({
        [ActionTypes.INIT_WLMXB]                                      : () => wlmxState,
        [ActionTypes.GET_WLMX_DETAIL_LIST]  : () => {
            if (action.getPeriod === 'true') {
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            if(action.endissuedate){
                state = state.set('chooseperiods',true)
            }
            // typeUuid可以为空
            if(action.typeUuid !== undefined){
                state = state.setIn(['flags', 'typeUuid'],action.typeUuid)
                            .setIn(['flags', 'wlType'],action.wlType)
            }else{
                state = state.setIn(['flags', 'wlType'],state.getIn(['flags', 'wlType']))
            }
            return state.set('detailsTemp',fromJS(action.receivedData))
                  .set('pageCount',action.pageNum)
                  .set('currentPage',action.curPage)
                  .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                  .setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
                  .setIn(['flags', 'curCardUuid'],fromJS(action.curCardUuid))
                  .setIn(['flags', 'allHappenIncomeAmount'],fromJS(action.allHappenIncomeAmount))
                  .setIn(['flags', 'allHappenExpenseAmount'],fromJS(action.allHappenExpenseAmount))
                  .setIn(['flags', 'allPaymentIncomeAmount'],fromJS(action.allPaymentIncomeAmount))
                  .setIn(['flags', 'allPaymentExpenseAmount'],fromJS(action.allPaymentExpenseAmount))
                  .setIn(['flags', 'allBalanceAmount'],fromJS(action.allBalanceAmount))
                  .setIn(['flags', 'direction'],fromJS(action.direction))
                  .setIn(['flags', 'wlRelate'],fromJS(action.wlRelate))
                  .setIn(['flags', 'searchContent'],fromJS(action.searchContent))
        },

        [ActionTypes.CHANGE_WLMX_DETAIL_ACCOUNT_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        [ActionTypes.CHANGE_WLMX_MORE_PERIODS] 	 : () => {
			if (action.chooseperiods) {
				return state.set('chooseperiods', true)
			} else {
				return state.update('chooseperiods', v => !v)
			}
		},
        [ActionTypes.GET_WLMX_TYPE_LIST] 	 : () => {
            if (action.getPeriod === 'true') {
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }

            return state = state.setIn(['contactTypeTree'],fromJS(action.receivedData))
        },
        [ActionTypes.GET_WLMX_CARD_LIST] 	 : () => {
            if (action.getPeriod === 'true') {
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }

            return state = state.set('cardList',fromJS(action.receivedData))
                                .set('cardPages',fromJS(action.cardPages))
                                .set('cardCurPage',fromJS(action.cardCurPage))
        },
        [ActionTypes.GET_WLMX_RUNNING_CATEGORY] 	 : () => {
            if (action.getPeriod === 'true') {
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }

            return state = state.set('runningCategory',fromJS(action.receivedData))
        },
	}[action.type] || (() => state))()
}
