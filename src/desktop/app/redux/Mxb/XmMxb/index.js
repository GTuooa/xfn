import { fromJS, toJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const xmmxState = fromJS({
    flags: {
        issuedate: '',
        endissuedate: '',
        insertOrModify: 'insert',
        runningInsertOrModify: 'insert',
        paymentInsertOrModify: 'insert',
        property: '',
        accountType:'全部',
        assCategory: '',
        acId: '',
        propertyCost:'',
        detailsTemp:[],
        selectList: [],
        selectCategory:'',
        projectTypeTree:[],
        runningCategory:[
            {
                uuid:'',
                name:'全部',
            }
        ],
        xmType:'损益项目',
        amountType:'DETAIL_AMOUNT_TYPE_HAPPEN',
        amountTypeName:'收支发生额',
        currentPage: 1,
        pageCount: 1,
        searchContent: ''

    },
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


})


export default function handleLrb(state = xmmxState, action) {
	return ({
        [ActionTypes.INIT_XMMXB]                                      : () => xmmxState,
        [ActionTypes.INIT_ZH_DETAIL_ACCOUNT_LIST]                                  : () => {
            state = state.set('hideCategoryList', fromJS(action.hideCategoryList))

            return state
        },

        [ActionTypes.CHANGE_XM_DETAIL_ACCOUNT_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        [ActionTypes.CHANGE_ZHMX_MORE_PERIODS] 	 : () => {
			if (action.chooseperiods) {
				return state.set('chooseperiods', true)
			} else {
				return state.update('chooseperiods', v => !v)
			}
		},
        [ActionTypes.XM_ACCOUNTCONF_DETAIL_TRIANGLE_SWITCH]          : () => {
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
        [ActionTypes.GET_XMMX_PROJECT_LIST]                         :() => {
            if (action.getPeriod === 'true') {
                if (action.endissuedate) {
                    state = state.setIn(['flags','chooseperiods'],true)
                }
                if (action.categoryUuid) {
                    state = state.setIn(['flags','showRunningType'],true)
                }
                state = state.setIn(['flags','period'],fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            return state.setIn(['flags','detailsTemp'],fromJS(action.detailList))
                        .setIn(['flags','debitSum'],action.debitSum)
                        .setIn(['flags','creditSum'],action.creditSum)
                        .setIn(['flags','total'],action.total)
                        .setIn(['flags','issuedate'],action.issuedate)
                        .setIn(['flags','endissuedate'],action.endissuedate)
                        .setIn(['flags','curCardUuid'],action.curCardUuid)
                        .setIn(['flags','isTop'],action.isTop)
                        .setIn(['flags','categoryUuid'],action.categoryUuid)
                        .setIn(['flags','propertyCost'],action.propertyCost)
                        .setIn(['flags','currentPage'],action.currentPage)
                        .setIn(['flags','cardPageNum'],action.cardPageNum)
                        .setIn(['flags','pageCount'],action.pages)
                        .setIn(['flags','amountType'],action.amountType)
                        .setIn(['flags','typeUuid'],action.typeUuid)
                        .setIn(['flags','searchContent'],action.searchContent)

        },
        [ActionTypes.CLEAR_XM_STATE]          :() => {
            return state.setIn(['flags','detailsTemp'],fromJS([]))
                        .setIn(['flags','cardList'],fromJS([]))
                        .setIn(['flags','runningCategory'],xmmxState.getIn(['flags','runningCategory']))
                        .setIn(['flags','debitSum'],'')
                        .setIn(['flags','creditSum'],'')
                        .setIn(['flags','total'],'')
        }


	}[action.type] || (() => state))()
}
