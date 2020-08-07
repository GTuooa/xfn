import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const accountState = fromJS({
    flags: {
        issuedate: '2018年第01期',
        // bool， 已发生， 未发生
        // duty， reality， waitFor
        // '权责发生制', '收付实现制', '收付管理'
        main: 'duty',
        mainWater: 'allWater',
        accountingType: 'manages',

        insertOrModify: 'insert',
        runningInsertOrModify: 'insert',
        payOrReceive: '收',

        accountAssModalShow: false,

        curCategory: '全部',
        curAccountUuid: '全部',
        assId: '',
        assCategory: '',
        acId: '',
        selectList: [],
        showRunningInfo:{},

    },

    mediumAcAssList: {
        acList: [
            // {
            //     acId: '',
            //     acName: ''
            // }
        ],
        category: []
    },

    ass: {
		assid: '',
		assname: '',
		asscategory: '',
		handleAss: 'insertass'
	},
    // 用来生成卡片
    cardTemp: {

        // 流水号， 系统自动生成
        "uuid": '',

        // 所选类别的属性
        "categoryUuid": "",
        "categoryName": "",
        // “经营性收入”,“其他收入”,“经营性支出”,“其他支出”,“转账”
        "property": '',
        // 收入还是支出
        "beSpecial": false,
        // 定金
        "beDeposited": false,

        "acId": "",
        "acFullName": "",
        "assList": [
            // {
            //     assId: '',
            //     assCategory: '',
            //     assName: ''
            // }
        ],
        "beManagemented": false,

        // 通过property收入还是支出
        "direction": '',

        // 退购----return
        // 预收预付---- inAdvance
        // 付款--withPayment
        // 未付--withNotPayment
        // 转账--virement

        "runningState": 'withPayment',

        "runningDate": '', // 2018-01-08
        "runningAbstract": '',
        "amount": '',
        // 本次处理金额
        // 已发生未处理的处理了的金额
        "handleAmount": 0,
        // 直接流水才有
        "accountUuid": '',
        "accountName": '',
        // 预流水才有
        // 应收账款、应付账款、其他应收款、其他应付款、预收账款、预付账款的末端科目
        "mediumAcId": "",
        "mediumAcFullName": "",
        "mediumAssList": [],

        "carryoverAcId": "",  //成本科目
        "carryoverAcFullName": "",
        "carryoverAssList": [],
        "carryoverAmount": 0,

        "stockAcId": "", //存货科目
        "stockAcFullName": "",
        "stockAssList": [],

        "depositAcId": "", //定金管理
        "depositAcFullName": "",
        "depositAssList": [],

        // 抵扣金额
        "offsetAmount": 0,
        // 直接流水,预流水才有
        // “票据类型”默认“其他票据”。一般纳税人可选：“增专”、“增普”、“其他票据”；小规模纳税人可选：“增普”、“其他票据”；“工资发放”、“内部转账”流水类别，“票据类型”仅可选“其他票据”
        // 增专-special， 增普-common， 其他票据-other
        "billType": '',
        // 是否认证 支出类流水，且“票据类型”为专票时才显示
        "beCertified": false,

        // 选择“普票”、“专票”才有
        "priceTaxTotal": '',
        "taxRate": '',
        "tax": '',

        "payableAssList": [],
        "inputAssList": [],
        "certifiedAssList": [],
        "outputAssList": [],

        // 支付或收款流水 已支付未收款
        "running": [

        ]
    },

    runningTemp: {

        "runningDate": '', // 2018-01-08
        "runningAbstract": '',
        "amount": 0,
        "accountUuid": '',
        "accountName": '',

        "forHandleAmount": 0,
        "handleAmount": 0,

        "uuidList" : []
    },

    // 已发生的--- 权责发生制

    dutyList: {
        closed: 0,
        creditSum: 0,
        debitSum: 0,
        opened: 0,
        childList: [
        ]
    },

    // 收付款生成的 支付或收款流水
    realityList: [
        {
            "date": '2018-01-08', // 2018-01-08
            "abstract": '处理第一笔',
            "amount": '500',
            "accountUuid": '00001',
            "accountName": '基本户7221',
            // 处理金额
            "handleAmount": '',

            "vcdata": '2018-01-08',
            "vcId": '5',

            "mediumAcId": "2221",
            "mediumAcFullName": "应收账款",
            "mediumAssList": []
        }
        //  转账不出现
    ],
    // 未收款未付款的集合
    waitPayList: {
        closed: 0,
        creditSum: 0,
        debitSum: 0,
        opened: 0,
        childList: [
        ]
    },
    // 未出账
    budgetList: {
        closed: 0,
        creditSum: 0,
        debitSum: 0,
        opened: 0,
        childList: [
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
    businessTemp: {

    }
})


export default function handleLrb(state = accountState, action) {
	return ({
        [ActionTypes.ACCOUNT_CHANGE_VIEW_DIMENSION]          : () => {
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
        [ActionTypes.CHANGE_ACCOUNT_COMMON_STRING]           : () => {

            state = state.setIn([`${action.tab}Temp`, action.place], action.value)

            return state
        },
        // [ActionTypes.BEFORE_INSERT_RUNNING_ACCOUNT]           : () => state.set('cardTemp', accountState.get('cardTemp')).setIn(['flags', 'insertOrModify'], 'insert'),
        [ActionTypes.CHANGE_ACCOUNT_ACCOUNT_NAME]             : () => {

            const valueList = action.value.split(Limit.TREE_JOIN_STR)

            return state = state.setIn([`${action.tab}Temp`, action.placeUUid], valueList[0])
                                .setIn([`${action.tab}Temp`, action.placeName], valueList[1])
        },

        [ActionTypes.BEFORE_RUNNING_PAY_OR_RECEIVE]             : () => {

            state = state.setIn(['flags', 'runningInsertOrModify'], 'insert')
                        .setIn(['flags', 'payOrReceive'], action.payDirection)
                        .set('runningTemp', accountState.get('runningTemp'))
                        .setIn(['runningTemp', 'runningAbstract'], `${action.payDirection === '收' ? '收到' : '支付'}${action.assList}款项`)
                        // .setIn(['runningTemp', 'forHandleAmount'], action.item.get('notHandleAmount'))
                        // .updateIn(['runningTemp', 'uuidList'], v => v.push(action.item.get('uuid')))
                        .setIn(['runningTemp', 'forHandleAmount'], action.notHandleAmount)
                        .setIn(['runningTemp', 'uuidList'], fromJS(action.uuidList))
                        .setIn(['runningTemp', 'detail'], action.runningList)

            return state
        },
        // 选择要删除的卡片
        [ActionTypes.ACCOUNT_ITEM_CHECKBOX_CHECK]               : () => {

            const showLowerList = state.getIn(['flags', 'selectList'])

            if (!action.checked) {
                // 原来没选
                const newShowLowerList = showLowerList.push(action.uuid)
                return state.setIn(['flags', 'selectList'], newShowLowerList)
            } else {
                // 原来选了
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                return state.setIn(['flags', 'selectList'], newShowLowerList)
            }

        },
        // 全选
        [ActionTypes.ACCOUNT_ITEM_CHECKBOX_CHECK_ALL]               : () => {

            if (action.selectAll) {
                // 全不选
                return state.setIn(['flags', 'selectList'], fromJS([]))
            } else {
                // 全选 accountList
                const accountList = state.getIn([action.listName, 'childList'])
                let selectAllList = []

                accountList.forEach(v => selectAllList.push(v.get('uuid')))

                return state.setIn(['flags', 'selectList'], fromJS(selectAllList))
            }

        },
        [ActionTypes.INIT_RUNNING_BUSINESS_OR_PAY_CARD]                     : () => {

            return state.set(action.tempName, accountState.get(action.tempName))
        },
        [ActionTypes.MODIFY_RUNNING_PAYMENT]                 : () => {

            let paymentData = state.getIn(['flags', 'showRunningInfo'])

            let forHandleAmount = 0
            paymentData = paymentData.get('detail')&&paymentData.get('detail').size ?  paymentData.update('detail', v => v.map(u => {
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
