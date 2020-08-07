import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { formatDate } from 'app/utils'

const cxlsState = fromJS({
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
        searchType: 'SEARCH_TYPE_CATEGORY_TYPE',
        managerCategoryList: [],
        pzDealType: '',
        projectList:[],
    },
    orderByList: {
        dateSortType: false,
        categorySortType: false,
        amountSortType: false,
        nameSortType: false,
        orderByArr: []
    },
    businessTemp: {},
    runningFlowTemp: {},
    modalTemp: {
        runningDate: formatDate(),
        uuidList: [],
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
    pageCount: 1
})

export default function handleLrb(state = cxlsState, action) {
    return ({
        [ActionTypes.INIT_CXLS]                            : () => cxlsState,
        [ActionTypes.GET_BUSINESS_LIST]                    : () => {
            if(action.isReflash) {
                state = state.set('businessTemp', cxlsState)
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

            switch (action.orderBy) {
                case 'SEARCH_ORDER_DATE':
                    state = state.setIn([ 'orderByList', 'dateSortType' ], action.isAsc)
                    break
                case 'SEARCH_ORDER_CATEGORY_TYPE':
                    state = state.setIn(['orderByList', 'categorySortType'], action.isAsc)
                    break
                case 'SEARCH_ORDER_AMOUNT':
                    state = state.setIn(['orderByList', 'amountSortType'], action.isAsc)
                    break
                case 'SEARCH_ORDER_CREATE_NAME':
                    state = state.setIn(['orderByList', 'nameSortType'], action.isAsc)
                    break
                default:
            }
            const { childList,...extra } = action.receivedExtra
            for(let key in extra) {
                state = state.setIn(['flags',key],extra[key])
            }
            return state.set('businessTemp',fromJS(action.receivedData))
                      .set('pageCount',action.pageCount)
                      .set('currentPage',action.currentPage)
                      .setIn(['flags', 'mainWater'],fromJS(action.waterType))
                      .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                      .setIn(['flags', 'isAccount'],fromJS(action.isAccount))
                      .setIn(['flags', 'isAsc'],fromJS(action.isAsc))
                      .setIn(['flags', 'selectList'], fromJS([]))
                      .setIn(['flags', 'pzSelectAllList'], fromJS([]))
                      .setIn(['flags', 'currentVcIndex'], fromJS([]))
        },
        [ActionTypes.CHANGE_CX_ACCOUNT_COMMON_STRING]            : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        // 全选
        [ActionTypes.CXLS_ITEM_CHECKBOX_CHECK_ALL]               : () => {

            if (action.selectAll) {
                // 全不选
                return state.setIn(['flags', 'selectList'], fromJS([]))
                            .setIn(['flags', 'pzSelectAllList'], fromJS([]))
                            .setIn(['flags', 'currentVcIndex'], fromJS([]))
            } else {
                // 全选 accountList
                const accountList = action.list
                let selectAllList = []
                let pzSelectAllList = []
                let deletePzSelectAllList = []
                accountList.forEach(v => {
                    selectAllList.push(v.get('uuid'))
                    if (!(v.get('vcList') && v.get('vcList').size)) {
                        pzSelectAllList.push(fromJS({uuid:v.get('uuid'),flowNumber:v.get('flowNumber')}))
                    } else {
                        v.get('vcList').map(t => {
                            deletePzSelectAllList.push(t.get('vcIndex'))
                            state = state.setIn(['flags', 'currentYear'],t.get('year'))
                                         .setIn(['flags', 'currentMonth'],t.get('month'))
                        })
                    }
                })

                return state.setIn(['flags', 'selectList'], fromJS(selectAllList))
                            .setIn(['flags', 'pzSelectAllList'], fromJS(pzSelectAllList))
                            .setIn(['flags', 'currentVcIndex'], fromJS(deletePzSelectAllList))
            }
        },
        // 选择要删除的卡片
        [ActionTypes.CXLS_ITEM_CHECKBOX_CHECK]                  : () => {

            const showLowerList = state.getIn(['flags', 'selectList'])
            const showPzList = state.getIn(['flags', 'pzSelectAllList'])
            let currentVcIndex = state.getIn(['flags', 'currentVcIndex'])

            if (!action.checked) {
                // 原来没选
                const newShowLowerList = showLowerList.push(action.item.get('uuid'))
                let newShowPzList = showPzList
                let newDeletePzList = currentVcIndex
                if (!(action.item.get('vcList') && action.item.get('vcList').size)) {
                    newShowPzList = showPzList.push(fromJS({uuid:action.item.get('uuid'),flowNumber:action.item.get('flowNumber')}))
                } else {
                    action.item.get('vcList').map(v => {
                        newDeletePzList = newDeletePzList.push(v.get('vcIndex'))
                        state = state.setIn(['flags', 'currentYear'],v.get('year'))
                                     .setIn(['flags', 'currentMonth'],v.get('month'))
                    })

                }
                return state.setIn(['flags', 'selectList'], fromJS(newShowLowerList))
                            .setIn(['flags', 'pzSelectAllList'],fromJS(newShowPzList))
                            .setIn(['flags', 'currentVcIndex'], fromJS(newDeletePzList))
            } else {
                // 原来选了
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.item.get('uuid')), 1)
                let newShowPzList = showPzList
                let newDeletePzList = currentVcIndex
                if (!(action.item.get('vcList') && action.item.get('vcList').size)) {
                    newShowPzList = showPzList.splice(showPzList.findIndex(v => v.get('uuid') === action.item.get('uuid')),1)
                } else {
                    action.item.get('vcList').map(v => {
                        newDeletePzList = newDeletePzList.splice(newDeletePzList.findIndex(t => t === v.get('vcIndex')),1)
                    })
                }
                return state.setIn(['flags', 'selectList'], fromJS(newShowLowerList))
                            .setIn(['flags', 'pzSelectAllList'], fromJS(newShowPzList))
                            .setIn(['flags', 'currentVcIndex'], fromJS(newDeletePzList))
            }

        },
        [ActionTypes.GET_CXLSCONF_ALL_SETTINGS]                  : () => {

            return state = state.set('runningCategory', fromJS(action.receivedData.categoryList))
                                .set('accountList', fromJS(action.receivedData.accountList))
                                .set('taxRateTemp', fromJS(action.receivedData.rate))
        },
        [ActionTypes.SET_CURRENT_PZ]                             : () => {
            return state = state.setIn(['flags','currentYear'], action.year)
                                .setIn(['flags','currentMonth'], action.month)
                                .setIn(['flags','currentVcIndex'], fromJS(action.vcIndexList))
        },
        [ActionTypes.CHANGE_PZ_COMMON_STRING]                    : () => {
            return state = state.setIn(action.name, action.value)
        },
        [ActionTypes.CXLS_CALCULATE_GAIN_OR_LOSS]           :() => {
          const { place, diff, deletePlace } = action
          return state.setIn(place, diff)
                      .deleteIn(deletePlace, diff)
        },
    }[action.type] || (() => state))()
}
