import { fromJS }	from 'immutable'
import { showMessage, formatDate } from 'app/utils'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const calculationState = fromJS({
    flags: {
        // issuedate: '2018年第01期',
        issuedate: '',

        accountingType: 'manages',

        payOrReceive: '收',

        accountAssModalShow: false,

        curCategory: '全部',
        curAccountUuid: '全部',
        curbject:'',
        assId: '',
        assCategory: '',
        acId: '',
        selectList: [],
        selectDateList: [],
        selectDate: '1970-01-01',
        showRunningInfo:{},

        categoryUuid:'',
        isCheck: false,

		debitSum: 0,
		creditSum: 0,
        debitAmount: 0,
        creditAmount: 0,

        showCalculateModal: false,
        totalAmount: '',
        runningShowChild: [],
        invoicingType:'',
        certifiedType:'',
        costTransferType:'',
        searchType:'SEARCH_TYPE_DATE',
        manageModal:false
    },
    // 流水类别
    runningCategory: [
        {
            'childList': []
        }
    ],

    mediumAcAssList: {
        acList: [
            // {
            //     acId: '',
            //     acName: ''
            // }
        ],
        category: [
            // {
            //     category: '',
            //     assList: [
            //         // {
            //         //     assId: '',
            //         //     assName: '',
            //         //     assCategory: ''
            //         // }
            //     ]
            // }
        ]
    },

    period: {
        closedmonth:"",
        closedyear:"",
        firstmonth:"",
        firstyear:"",
        lastmonth:"",
        lastyear:"",
    },
    issues:[],
    //核算管理
    calculateTemp:{
        ass: {
            assid: '',
            acId:'',
            totalName:'全部',
            assname: '',
            asscategory: '',
            handleAss: 'insertass',
            NotAmountSumReceive: 0,
            NotAmountSumPay: 0,
            AmountSumReceive: 0,
            AmountSumPay: 0,
            runningAbstract:'',
            handlingAmount:'',
            accountName:'',
      },
      detail:[],
      assList:[],
      cardUuid:'',
      usedCard:{
          name:'',
          code:'全部'
      },
      cardList:[],
      typeList:[],
      stockThingsList:[],
      stockUuid:'',
      stockCard:{
          name:'',
          code:'全部'
        },
        acList:[],

        runningIndex:0
    },

    payManageList:{
        childList:[]
    },
    invoicingList:{
        billMakeOutType:'',
        childList:[]
    },
    costTransferList:{
        runningState:'',
        childList:[]
    },
    certificationList:{
        billAuthType:'',
        childList:[]
    },
    runningFlowTemp:{

    },
    modalTemp:{
        runningDate:formatDate()
    }
})


export default function handleLrb(state = calculationState, action) {
	return ({
        [ActionTypes.INIT_SEARCH_CALCULATION]                         : () => calculationState,
        [ActionTypes.ACCOUNT_CHANGE_VIEW_DIMENSION]                   : () => {
            if (action.dutyList) {
                state = state.set('dutyList', fromJS(action.dutyList.result))
            }

            if (action.realityList) {
                state = state.set('realityList', fromJS(action.realityList.result))
                state = state.updateIn(['realityList', 'childList'], v => v.map((u,i) => u.set('showItemChild', true)))
            }

            if (action.waitPayList) {
                state = state.set('waitPayList', fromJS(action.waitPayList.result))
                if (!action.assId && !action.assCategory && !action.acId) {
                    state = state.set('mediumAcAssList', fromJS(action.waitPayList.ass))
                }
            }

            return state.setIn(['flags', 'issuedate'], action.issuedate)
                        .setIn(['flags', 'main'], action.main)
                        .setIn(['flags', 'curCategory'], action.categoryUuid)
                        .setIn(['flags', 'curAccountUuid'], action.accountUuid)
                        .setIn(['flags', 'assId'], action.assId)
                        .setIn(['flags', 'assCategory'], action.assCategory)
                        .setIn(['flags', 'acId'], action.acId)
                        .setIn(['flags', 'selectList'], fromJS([]))
        },
        [ActionTypes.GET_MANAGE_CATEGORY_DETAIL]                     : () => {
            let selectList = []
            action.receivedData.result.forEach(v => selectList.push(v.uuid)) //默认展开一二级类别

              state = state.setIn(['calculateTemp', 'accountName'],'全部')

            return state.set('runningCategory', fromJS(action.receivedData.result))
                        .setIn(['flags', 'runningShowChild'], fromJS(selectList))
        },
        [ActionTypes.GET_CALCULATE_LIST]                            : () => {
            if (action.getPeriod === 'true') {

                state = state.set('period',fromJS(action.period))
                            // .set('issues',fromJS(action.issues))
                            .setIn(['calculateTemp', 'ass','totalName'],'全部')
            }
            return state.setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                  .setIn(['flags', 'selectList'],fromJS([]))
                  .setIn(['flags', 'debitSum'],fromJS(action.receivedData.debitSum))
                  .setIn(['flags', 'creditSum'],fromJS(action.receivedData.creditSum))
                  .setIn(['flags', 'debitAmount'],fromJS(action.receivedData.debitAmount))
                  .setIn(['flags', 'creditAmount'],fromJS(action.receivedData.creditAmount))
                  .setIn(['flags', 'isCheck'],fromJS(action.isCheck))
                  .setIn(['flags', 'accountingType'],fromJS(action.accountingType))
                  .setIn(['payManageList', 'childList'],fromJS(action.receivedData.childList))
                  .setIn(['calculateTemp', 'ass','assid'],fromJS(action.assId))
                  .setIn(['calculateTemp', 'ass','acId'],fromJS(action.acId))
                  .setIn(['calculateTemp', 'ass','asscategory'],fromJS(action.assCategory))
                  .setIn(['flags', 'curCategory'],fromJS(action.curCategory))
                  .setIn(['flags', 'searchType'],fromJS(action.searchType))
        },
        [ActionTypes.GET_CALCULATE_INVOICING_LIST]                     : () => {
            return state.setIn(['invoicingList', 'billMakeOutType'],fromJS(action.billMakeOutType))
                  .setIn(['flags', 'selectList'],fromJS([]))
                  // .setIn(['flags', 'debitSum'],fromJS(action.receivedData.debitSum))
                  // .setIn(['flags', 'creditSum'],fromJS(action.receivedData.creditSum))
                  .setIn(['invoicingList', 'childList'],fromJS(action.receivedData))
                  .setIn(['flags', 'curCategory'],fromJS(action.curCategory))
                  .setIn(['flags', 'searchType'],fromJS(action.searchType))
        },
        [ActionTypes.GET_CALCULATE_CERTIFICATE_LIST]  : () => {
            return state.setIn(['certificationList', 'billAuthType'],fromJS(action.billAuthType))
                  .setIn(['flags', 'selectList'],fromJS([]))
                  // .setIn(['flags', 'debitSum'],fromJS(action.receivedData.debitSum))
                  // .setIn(['flags', 'creditSum'],fromJS(action.receivedData.creditSum))
                  .setIn(['certificationList', 'childList'],fromJS(action.receivedData))
                  .setIn(['flags', 'curCategory'],fromJS(action.curCategory))
                  .setIn(['flags', 'searchType'],fromJS(action.searchType))
        },
        [ActionTypes.GET_CALCULATE_COST_LIST]  : () => {
            return state.setIn(['costTransferList', 'runningState'],fromJS(action.runningState))
                  .setIn(['flags', 'selectList'],fromJS([]))
                  // .setIn(['flags', 'debitSum'],fromJS(action.receivedData.debitSum))
                  // .setIn(['flags', 'creditSum'],fromJS(action.receivedData.creditSum))
                  .setIn(['costTransferList', 'childList'],fromJS(action.receivedData))
                  .setIn(['flags', 'curCategory'],fromJS(action.curCategory))
                  .setIn(['flags', 'searchType'],fromJS(action.searchType))
        },
        [ActionTypes.CHANGE_CALCULATE_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        [ActionTypes.CHANGE_ACCOUNT_AMOUNT_SUM]       : () => {

            return state = state.setIn(['calculateTemp','NotAmountSumReceive'],action.NotAmountSumReceive)
            .setIn(['calculateTemp','NotAmountSumPay'],action.NotAmountSumPay)
            .setIn(['calculateTemp','AmountSumReceive'],action.AmountSumReceive)
            .setIn(['calculateTemp','AmountSumPay'],action.AmountSumPay)

        },
        [ActionTypes.CHANGE_ACCOUNT_COMMON_STRING]           : () => {

            state = state.setIn([`${action.tab}Temp`, action.place], action.value)

            return state
        },
        [ActionTypes.CHANGE_ACCOUNT_ACCOUNT_NAME]             : () => {

            const valueList = action.value.split(Limit.TREE_JOIN_STR)

            return state = state.setIn([`${action.tab}Temp`, action.placeUUid], valueList[0])
                                .setIn([`${action.tab}Temp`, action.placeName], valueList[1])
        },

        [ActionTypes.BEFORE_RUNNING_PAY_OR_RECEIVE]             : () => {

            state = state.setIn(['flags', 'runningInsertOrModify'], 'insert')
                        .setIn(['flags', 'payOrReceive'], action.payDirection)
                        .set('runningTemp', calculationState.get('runningTemp'))
                        .setIn(['runningTemp', 'runningAbstract'], `${action.payDirection === '收' ? '收到' : '支付'}${action.assList}款项`)
                        // .setIn(['runningTemp', 'forHandleAmount'], action.item.get('notHandleAmount'))
                        // .updateIn(['runningTemp', 'uuidList'], v => v.push(action.item.get('uuid')))
                        .setIn(['runningTemp', 'forHandleAmount'], action.notHandleAmount)
                        .setIn(['runningTemp', 'uuidList'], fromJS(action.uuidList))
                        .setIn(['runningTemp', 'detail'], action.runningList)

            return state
        },
        // 选择要删除的卡片
        [ActionTypes.ACCOUNT_ITEM_CHECKBOX_SELECT]               : () => {

            const showLowerList = state.getIn(['flags', 'selectList'])
            const showDateList = state.getIn(['flags', 'selectDateList'])
            const showDate = state.getIn(['flags', 'selectDate'])
            if (!action.checked) {
                // 原来没选
                const newShowLowerList = showLowerList.push(action.uuid)
                const newSelectDateList = showDateList.push(action.runningDate)
                new Date(action.runningDate).getTime() > new Date(showDate).getTime() ?
                state = state.setIn(['flags', 'selectDate'], action.runningDate) :
                state = state.setIn(['flags', 'selectDate'], showDate)

                return state.setIn(['flags', 'selectList'], newShowLowerList)
                            .setIn(['flags', 'selectDateList'], newSelectDateList)
            } else {
                // 原来选了
                state = state.setIn(['flags', 'selectDate'], '1970-01-01')
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                const newSelectDateList = showDateList.splice(showDateList.findIndex(v => v === action.runningDate), 1)

                newSelectDateList.forEach(v => {
                    let nowSelectDate = state.getIn(['flags', 'selectDate'])
                    new Date(v).getTime() > new Date(nowSelectDate).getTime() ?
                            state = state.setIn(['flags', 'selectDate'], v) :
                            state = state.setIn(['flags', 'selectDate'], nowSelectDate)

                })

                return state.setIn(['flags', 'selectList'], newShowLowerList)
                            .setIn(['flags', 'selectDateList'], newSelectDateList)
            }

        },
        // 全选
        [ActionTypes.PAY_RECEIVE_ITEM_CHECKBOX_CHECK_ALL]               : () => {
            if (action.selectAll) {
                // 全不选
                return state.setIn(['flags', 'selectList'], fromJS([]))
                            .setIn(['flags', 'selectDateList'], fromJS([]))
                            .setIn(['flags', 'selectDate'], '1970-01-01')
            } else {
                // 全选 accountList
                const accountList = state.getIn([action.listName, 'childList'])
                let selectAllList = []

                let selectAllDate = []

                accountList.forEach(v => {
                    let selectDate = state.getIn(['flags', 'selectDate'])
                    selectAllList.push(v.get('uuid'))
                    selectAllDate.push(v.get('runningDate'))
                    new Date(v.get('runningDate')).getTime() > new Date(selectDate).getTime() ?
                            state = state.setIn(['flags', 'selectDate'], v.get('runningDate')) :
                            state = state.setIn(['flags', 'selectDate'], selectDate)
                })

                return state.setIn(['flags', 'selectList'], fromJS(selectAllList))
                            .setIn(['flags', 'selectDateList'], fromJS(selectAllDate))
            }

        },
        // [ActionTypes.INIT_RUNNING_BUSINESS_OR_PAY_CARD]                     : () => {
        //
        //     return state.set(action.tempName, accountState.get(action.tempName))
        // },
        [ActionTypes.MODIFY_RUNNING_PAYMENT]                : () => {

            let paymentData = state.getIn(['flags', 'showRunningInfo'])

            let forHandleAmount = 0
            paymentData = paymentData.get('detail')&&paymentData.get('detail').size ? paymentData.update('detail', v => v.map(u => {
                const amount = Number(u.get('handleAmount')) + Number(u.get('notHandleAmount'))
                forHandleAmount = forHandleAmount + Math.abs(amount)
                return u.set('notHandleAmount', amount)
            })) : paymentData
            paymentData = paymentData.set('forHandleAmount', forHandleAmount)

            return state.set('runningTemp', paymentData).setIn(['flags', 'runningInsertOrModify'], 'modify')

        },
        [ActionTypes.SHOW_RELATE_PAYMENT_FETCH]             : () => {
            const receivedData = fromJS(action.receivedData)
            return state.setIn(['flags', 'showRunningInfo'], receivedData).setIn(['flags', 'payOrReceive'], receivedData.get('direction') === 'debit' ? '收' : '付')
        },

        [ActionTypes.CHANGE_ITEM_CHILD_SHOW]                : () => {
            const showItemChild = state.getIn(['realityList', 'childList', action.idx, 'showItemChild'])
            state = state.setIn(['realityList','childList', action.idx, 'showItemChild'], !showItemChild)

            return state
        },
        [ActionTypes.CHANGE_TYPE_OF_SEARCH]                : () => {
            return state = state.setIn(action.placeArr, action.value)
        }

	}[action.type] || (() => state))()
}
