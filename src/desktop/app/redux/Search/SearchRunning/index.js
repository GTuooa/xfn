import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { formatDate } from 'app/utils'
import { message,Modal } from 'antd'

const searchRunningState = fromJS({
    flags: {
        issuedate: '',
        // bool， 已发生， 未发生
        insertOrModify: 'insert',
        runningInsertOrModify: 'insert',
        payOrReceive: '收',
        accountAssModalShow: false,
        curCategory: '全部',
        curAccountUuid: '',
        accountName:'全部',
        assId: '',
        assCategory: '',
        acId: '',
        selectList: [],
        pzSelectAllList: [],
        pzDealNum: 0,
        pzDealStatus: false,
        showRunningInfo: {},
        currentYear: '',
        currentMonth: '',
        currentVcIndex: [],
        searchType: 'SEARCH_TYPE_ABSTRACT',
        managerCategoryList: [],
        pzDealType: '',
        projectList:[],
        inputValue: '',
        orderType: '',
        showChildList:[],
        allItemShow: false,
        chooseValue: 'MONTH',
        accountProjectRange:[],
        accountContactsRange:[],
        accountContactsRangeList:[],
        accountProjectList:[],
        selectItem:[]
    },
    orderByList: {
        dateSortType: false,
        indexSortType: false,
        categorySortType: false,
        nameSortType: false,
        certificateSortType: false,
        orderByArr: []
    },
    businessTemp: {},
    runningFlowTemp: {
        oriDate: formatDate().substr(0,10),
    },
    modalTemp: {
        oriDate: formatDate().substr(0,10),
        // uuidList: [],
    },
    period: {
        closedmonth: "",
        closedyear: "",
        firstmonth: "",
        firstyear: "",
        lastmonth: "",
        lastyear: "",
    },
    issues: [],
    // 分页
    currentPage: 1,
    pageCount: 1,
    pageSize: Limit.SEARCH_RUNNING_LINE_LENGTH,
})

export default function handleLrb(state = searchRunningState, action) {
    return ({
        [ActionTypes.INIT_SEARCH_RUNNING]						: () => searchRunningState,
        [ActionTypes.GET_SEARCH_BUSINESS_LIST]                    : () => {
            if(action.isReflash) {
                state = state.set('businessTemp', searchRunningState)
            }

            if (action.getPeriod === 'true') {

                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }

            if (action.accountUuid && action.isAccount) {
                    const valueList = action.accountUuid.split(Limit.TREE_JOIN_STR)
                    state = state.setIn(['flags', 'curAccountUuid'],fromJS(action.accountUuid))
                                .setIn(['flags', 'accountName'],fromJS(valueList[1]))
            } else {
              state = state.setIn(['flags', 'curAccountUuid'],'')
                         .setIn(['flags', 'accountName'],'')
            }
            const allItemShow = state.getIn(['flags','allItemShow'])
            let showChildList = []
            if(allItemShow){
                action.receivedData && action.receivedData.map(item => {
                    showChildList.push(item.oriUuid)
                })
                state = state.setIn(['flags','showChildList'],fromJS(showChildList))
            }
            const isAscFlag = typeof action.isAsc === 'boolean' ? action.isAsc : action.receivedExtra.isClose
            const isAscOther = typeof action.isAsc === 'boolean' ? action.isAsc : true

            switch (action.orderBy) {
                case 'SEARCH_ORDER_DATE':
                    state = state.setIn([ 'orderByList', 'dateSortType' ], isAscFlag)
                                .setIn(['orderByList', 'indexSortType'], isAscFlag)
                    break
                case 'SEARCH_ORDER_JR_INDEX':
                    state = state.setIn(['orderByList', 'indexSortType'], isAscFlag)
                    break
                case 'SEARCH_ORDER_CATEGORY_TYPE':
                    state = state.setIn(['orderByList', 'categorySortType'], isAscOther)
                                .setIn(['orderByList', 'indexSortType'], isAscOther)
                    break
                case 'SEARCH_ORDER_CERTIFICATE':
                    state = state.setIn(['orderByList', 'certificateSortType'], isAscOther)
                                .setIn(['orderByList', 'indexSortType'], isAscOther)
                    break
                case 'SEARCH_ORDER_CREATE_NAME':
                    state = state.setIn(['orderByList', 'nameSortType'], isAscOther)
                                .setIn(['orderByList', 'indexSortType'], isAscOther)
                    break
                default:
            }
            state = state.setIn(['flags', 'orderType'],action.orderBy)
            const { childList,...extra } = action.receivedExtra
            for(let key in extra) {
                state = state.setIn(['flags',key],extra[key])
            }
            return state.set('businessTemp',fromJS(action.receivedData))
                      .set('pageCount',action.pageCount)
                      .set('pageSize',action.pageSize)
                      .set('currentPage',action.currentPage)
                      .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                      .setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
                      .setIn(['flags', 'isAccount'],fromJS(action.isAccount))
                      .setIn(['flags', 'isAsc'],fromJS(isAscFlag))
                      .setIn(['flags', 'selectList'], fromJS([]))
                      .setIn(['flags', 'pzSelectAllList'], fromJS([]))
                      .setIn(['flags', 'currentVcIndex'], fromJS([]))
        },
        [ActionTypes.CHANGE_SEARCH_ACCOUNT_COMMON_STRING]            : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        // 全选
        [ActionTypes.SEARCH_ITEM_CHECKBOX_CHECK_ALL]               : () => {

            if (action.selectAll) {
                // 全不选
                return state.setIn(['flags', 'selectList'], fromJS([]))
                            .setIn(['flags', 'pzSelectAllList'], fromJS([]))
                            .setIn(['flags', 'currentVcIndex'], fromJS([]))
                            .setIn(['flags', 'selectItem'], fromJS([]))
            } else {
                // 全选 accountList
                const accountList = action.list
                let selectAllList = []
                let pzSelectAllList = []
                let deletePzSelectAllList = []
                accountList.forEach(v => {
                    selectAllList.push(v.get('oriUuid'))
                    const oriDate = v.get('oriDate')
                    if (!(v.get('vcList') && v.get('vcList').size)) {
                        pzSelectAllList.push(
                            fromJS({
                                oriUuid:v.get('oriUuid'),
                                jrNumber:v.get('jrIndex'),
                                oriDate:Date.parse(v.get('oriDate')),
                                currentYear: v.get('oriDate') ? v.get('oriDate').substr(0,4) : '',
                                currentMonth: v.get('oriDate') ? v.get('oriDate').substr(5,2) : ''
                            }))
                    } else {
                        v.get('vcList').map(t => {
                            deletePzSelectAllList.push({
                                year: oriDate.substr(0,4),
                                month: oriDate.substr(5,2),
                                vcIndex: t.get('vcIndex')
                            })
                            state = state.setIn(['flags', 'currentYear'],t.get('year'))
                                         .setIn(['flags', 'currentMonth'],t.get('month'))
                        })
                    }
                })

                return state.setIn(['flags', 'selectList'], fromJS(selectAllList))
                            .setIn(['flags', 'pzSelectAllList'], fromJS(pzSelectAllList))
                            .setIn(['flags', 'currentVcIndex'], fromJS(deletePzSelectAllList))
                            .setIn(['flags', 'selectItem'], action.list)
            }
        },
        // 选择要删除的卡片
        [ActionTypes.SEARCH_ITEM_CHECKBOX_CHECK]                  : () => {

            const showLowerList = state.getIn(['flags', 'selectList'])
            const showPzList = state.getIn(['flags', 'pzSelectAllList'])
            const selectItem = state.getIn(['flags', 'selectItem']).toJS()
            let currentVcIndex = state.getIn(['flags', 'currentVcIndex'])
            const chooseItem = action.item.toJS()

            if (!action.checked) {
                // 原来没选
                const newShowLowerList = showLowerList.push(action.item.get('oriUuid'))
                let newShowPzList = showPzList
                let newDeletePzList = currentVcIndex.toJS()
                if (!(action.item.get('vcList') && action.item.get('vcList').size)) {
                    newShowPzList = showPzList.push(
                        fromJS({
                            oriUuid:action.item.get('oriUuid'),
                            jrNumber:action.item.get('jrIndex'),
                            oriDate:Date.parse(action.item.get('oriDate')),
                            currentYear: action.item.get('oriDate') ? action.item.get('oriDate').substr(0,4) : '',
                            currentMonth: action.item.get('oriDate') ? action.item.get('oriDate').substr(5,2) : ''
                        }))
                } else {
                    action.item.get('vcList').map(v => {
                        newDeletePzList.push({
                            year: chooseItem.oriDate.substr(0,4),
                            month: chooseItem.oriDate.substr(5,2),
                            vcIndex: v.get('vcIndex')
                        })
                        state = state.setIn(['flags', 'currentYear'],v.get('year'))
                                     .setIn(['flags', 'currentMonth'],v.get('month'))
                    })

                }
                return state.setIn(['flags', 'selectList'], fromJS(newShowLowerList))
                            .setIn(['flags', 'pzSelectAllList'],fromJS(newShowPzList))
                            .setIn(['flags', 'currentVcIndex'], fromJS(newDeletePzList))
                            .setIn(['flags', 'selectItem'], fromJS(selectItem.concat([chooseItem])))
            } else {
                // 原来选了
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.item.get('oriUuid')), 1)
                let newShowPzList = showPzList
                let newDeletePzList = currentVcIndex.toJS()
                if (!(action.item.get('vcList') && action.item.get('vcList').size)) {
                    newShowPzList = showPzList.splice(showPzList.findIndex(v => v.get('oriUuid') === action.item.get('oriUuid')),1)
                } else {
                    action.item.get('vcList').map(v => {
                        // newDeletePzList = newDeletePzList.filter(v => v.get('year') === chooseItem.oriDate.substr(0,4) && v.get('month') === chooseItem.oriDate.substr(5,2) && v.get('vcIndex') === v.get('vcIndex'))
                        newDeletePzList = newDeletePzList.filter(w => !(v.get('year') === w.year && v.get('month') === w.month && v.get('vcIndex') === w.vcIndex))
                        // newDeletePzList = newDeletePzList.splice(newDeletePzList.findIndex(t => t === v.get('vcIndex')),1)
                    })
                }
                const newSelectItem = selectItem.filter(v => v.oriUuid !== action.item.get('oriUuid'))
                return state.setIn(['flags', 'selectList'], fromJS(newShowLowerList))
                            .setIn(['flags', 'pzSelectAllList'], fromJS(newShowPzList))
                            .setIn(['flags', 'currentVcIndex'], fromJS(newDeletePzList))
                            .setIn(['flags', 'selectItem'], newSelectItem ? fromJS(newSelectItem) : fromJS([]) )
            }

        },
        [ActionTypes.GET_SEARCH_CONF_ALL_SETTINGS]                  : () => {

            return state = state.set('runningCategory', fromJS(action.receivedData.categoryList))
                                .set('accountList', fromJS(action.receivedData.accountList))
                                .set('taxRateTemp', fromJS(action.receivedData.rate))
        },
        // [ActionTypes.SEARCH_SET_CURRENT_PZ]                             : () => {
        //     return state = state.setIn(['flags','currentYear'], action.year)
        //                         .setIn(['flags','currentMonth'], action.month)
        //                         .setIn(['flags','currentVcIndex'], fromJS(action.vcIndexList))
        // },
        [ActionTypes.SEARCH_CHANGE_PZ_COMMON_STRING]                    : () => {
            return state = state.setIn(action.name, action.value)
        },
        [ActionTypes.SEARCH_CALCULATE_GAIN_OR_LOSS]           :() => {
          const { place, diff, deletePlace } = action
          return state.setIn(place, diff)
                      .deleteIn(deletePlace, diff)
        },
        // 流水类别是否显示下级expenseAmount
		[ActionTypes.SEARCH_RUNNING_TRIANGLE_SWITCH]          : () => {
            const showLowerList = state.getIn(['flags', 'showChildList'])

            if (!action.showChild) {
				// 原来不显示
				const newShowLowerList = showLowerList.push(action.uuid)
				return state.setIn(['flags', 'showChildList'], newShowLowerList)
            } else {
				// 原来显示
				const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
				return state.setIn(['flags', 'showChildList'], newShowLowerList)
            }
		},
		[ActionTypes.SEARCH_RUNNING_ALL_TRIANGLE_SWITCH]          : () => {
            let showLowerList = []
            const businessTemp = state.get('businessTemp')
            businessTemp && businessTemp.size && businessTemp.map( v => {
				showLowerList.push(v.get('oriUuid'))
			})
            state = state.setIn(['flags', 'allItemShow'], action.allItemShow)
            if (action.allItemShow) {
				// 全部显示
				return state.setIn(['flags', 'showChildList'], fromJS(showLowerList))
            } else {
				// 全部不显示
				return state.setIn(['flags', 'showChildList'], fromJS([]))
            }
		},
        [ActionTypes.CHANGE_SEARCH_RUNNING_CHOOSE_VALUE] 	 : () => {
			return state.setIn(['flags', 'chooseValue'], action.chooseValue)
        }
    }[action.type] || (() => state))()
}
