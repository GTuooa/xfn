import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'

const yysrAccountState = fromJS({
    views: {
        insertOrModify: 'insert',//流水是保存还是新增
        fromYl: false//是否从预览界面调入
    },
    data: {
        categoryType: '',//十四大类的一种
        categoryUuid: '',//选中类别的uuid
        categoryName: '请选择类别',//选中类别的name
        runningDate: '',//日期
        flowNumber: '',//流水号
        uuid: '',
        runningAbstract: '',//摘要
        amount: '',//金额
        runningState: 'STATE_YYSR_XS',//STATE_YYSR_DJ STATE_YYSR_XS STATE_YYSR_TS 收定金 1 销售 2 退售
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        currentAmount: '',//本次收款 本次付款
        beCarryover: false,//录入流水是否开启结转成本
        carryoverAmount: '',//成本金额
        billType: 'bill_other',//票据类型 发票 bill_common 其他票据 bill_other
        billStates: 'bill_states_not_make_out',// 未开票 bill_states_not_make_out make_out 未认证 not_auth 认证 auth
        billAssList: [],//相应发票科目的辅助核算
        billAcList: [],
        taxRate: 3,//税率
        tax: '',//税额
        offsetAmount: '',//应收 预收抵扣款
        paymentList: [],//核销情况
        beProject: false,//类别是否开启项目管理
        // 营业收入
        "acBusinessIncome": {
            "incomeAc": [],  // 收入 科目列表
            "incomeList": [],  // 收入 科目辅助核算
            "receivablesAc": [],  // 应收 科目列表
            "receivablesList": [],  // 应收 科目辅助核算
            "inAdvanceAc": [],  // 定金 科目列表
            "inAdvanceList": [],  // 定金 科目辅助核算
            "stockAc": [],  // 存货 科目列表
            "stockList": [],  // 存货 科目辅助核算
            "carryoverAc": [],  // 成本 科目列表
            "carryoverList": [],  // 成本 科目辅助核算
            "beManagemented": false,  // 是否收付管理
            "beDeposited": false,  // 是否定金管理
            "beCarryover": false,  // 是否结转成本
            "beSellOff": false,//是否支持退售流水
            "stockCardList": [],//多存货卡片
            "carryoverCardList": [],
            "contactsCardRange": {
                uuid: '',
                code: '',
                name: ''
            }
        }
    },
    preData: {//预收款金额状态
        preAmount: 0.00,//预收款
        receiveAmount: 0.00//应收款
    },
    stockCardList: [],//存货卡片列表
    contactsCardList: []//往来关系列表
})

// Reducer
export default function reducer(state = yysrAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_YYSR_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)

            const amount = action.data.get('amount')
            const taxRate = yysrAccountState.getIn(['data', 'taxRate'])
            let tax = amount - amount / (1 + taxRate / 100)
            const runningAbstract = `销售${action.receivedData['propertyCarryover'] === 'SX_HW' ? '存货' : ''}收入`

            return yysrAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .set('preData', yysrAccountState.get('preData'))
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['data' ,'tax'], decimal(tax))
                        .setIn(['data' ,'runningAbstract'], runningAbstract)
                        .setIn(['views' ,'insertOrModify'], 'insert')
                        .setIn(['data', 'acBusinessIncome','carryoverCardList'], fromJS([{amount: ''}]))


        },
        [ActionTypes.GET_LB_YYSR_FROM_YLLS]					: () => {
            //是否是全收全付
			const isFullPayment = Math.abs(action.state.getIn(['data', 'amount'])) == Math.abs(action.state.getIn(['data', 'currentAmount'])) ? true : false
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .set('preData', action.state.get('preData'))
                        .setIn(['data', 'acBusinessIncome','carryoverCardList'], fromJS([{amount: ''}]))
                        .setIn(['data', 'isFullPayment'], isFullPayment)
        },
        [ActionTypes.CHANGE_RUNNING_STATE]					: () => {

            return state.setIn(['data' ,'runningState'], action.key)
                        .setIn(['data', 'acBusinessIncome', 'contactsCardRange'], null)
        },
        [ActionTypes.CHANGE_YYSR_DATA]					: () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_ACLIST]					         : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.uuid = arr[0]
            item.code = arr[1]
            item.name = arr[2]

            return state.setIn(['data','acBusinessIncome', action.acType], fromJS(item))
        },
        [ActionTypes.CHANGE_AMOUNT]					: () => {
            const taxRate = state.getIn(['data', 'taxRate'])
            const amount = action.value
            let tax = amount - amount / (1 + taxRate / 100)
            return state.setIn(['data' ,'amount'], amount)
                        .setIn(['data' ,'tax'], decimal(tax))
        },
        [ActionTypes.CHANGE_ACCOUNT]			     : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.CHANGE_TAXRATE]					: () => {
            const amount = state.getIn(['data', 'amount'])
            const taxRate = action.value
            let tax = 0.00
            tax = amount - amount / (1 + taxRate / 100)
            return state.setIn(['data' ,'taxRate'], taxRate)
                        .setIn(['data' ,'tax'], decimal(tax))
        },
        [ActionTypes.CHANGE_BILLSTATES]					: () => {
            let oldBillStates = state.getIn(['data' ,'billStates'])
            let billStates = ''
            ;({
                'bill_states_not_make_out': () => billStates = 'bill_states_make_out',
                'bill_states_make_out': () => billStates = 'bill_states_not_make_out'
            }[oldBillStates] || (() => null))()

            return state.setIn(['data' ,'billStates'], billStates)
                        .setIn(['data' ,'billAssList'], fromJS([]))
                        .setIn(['data' ,'billAcList'], fromJS([]))
        },
        [ActionTypes.AFTER_LRACCOUNT_SAVE]                : () => {
            if (action.saveAndNew) {
                state = yysrAccountState

            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_YYSR_PREAMOUNT]					         : () => {
            return state.setIn(['preData', 'preAmount'], action.data.preAmount)
                        .setIn(['preData', 'receiveAmount'], action.data.amount)
        },
        [ActionTypes.GET_YYSR_CARDLIST]					         : () => {
            let cardList = []
            action.data.forEach(v => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })

            if (action.cardType === 'stockRange') {
                state = state.set('stockCardList', fromJS(cardList))
            } else {
                state = state.set('contactsCardList', fromJS(cardList))
            }
            return state
        },
        [ActionTypes.YYSR_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])
            const runningAbstract = `销售${action.receivedData['propertyCarryover'] === 'SX_HW' ? '存货' : ''}收入`

            return yysrAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data' ,'runningAbstract'], runningAbstract)
                                .setIn(['data', 'acBusinessIncome','carryoverCardList'], fromJS([{amount: ''}]))
        },
        [ActionTypes.CHANGE_YYSR_STOCKCARD]					      : () => {
            switch (action.dataType) {
                case 'card' : {
                    const arr = action.value.split(Limit.TREE_JOIN_STR)
                    const amount = state.getIn(['data', 'acBusinessIncome', 'stockCardList', action.idx, 'amount'])
                    state = state.setIn(['data', 'acBusinessIncome', 'stockCardList', action.idx], fromJS({uuid: arr[0], code: arr[1], name: arr[2], amount}))
                                .setIn(['data', 'acBusinessIncome', 'carryoverCardList', action.idx], fromJS({uuid: arr[0], code: arr[1], name: arr[2]}))
                    break
                }
                case 'amount' : {
                    state = state.setIn(['data', 'acBusinessIncome', 'stockCardList', action.idx, 'amount'], action.value)
                    break
                }
                case 'add' : {
                    state = state.setIn(['data', 'acBusinessIncome', 'stockCardList', action.idx], fromJS({amount: ''}))
                                .setIn(['data', 'acBusinessIncome', 'carryoverCardList', action.idx], fromJS({amount: ''}))
                    break
                }
                case 'delete' : {
                    state = state.deleteIn(['data', 'acBusinessIncome', 'stockCardList', action.idx])
                                .deleteIn(['data', 'acBusinessIncome', 'carryoverCardList', action.idx])
                    break
                }
                case 'carryoverCardList' : {
                    state = state.setIn(['data', 'acBusinessIncome', 'carryoverCardList', action.idx, 'amount'], action.value)
                    break
                }
            }
            return state

        },


    }[action.type] || (() => state))()
}



// Action Creators
const yysrAccountActions = {
    changeRunningState: (key) => ({
        type: ActionTypes.CHANGE_RUNNING_STATE,
        key
    }),
    changeYysrData: (dataType, value) => ({
        type: ActionTypes.CHANGE_YYSR_DATA,
        dataType,
        value
    }),
    changeAcList: (value, acType) => ({
        type: ActionTypes.CHANGE_ACLIST,
        value,
        acType
    }),
    changeAmount: (value) => ({
        type: ActionTypes.CHANGE_AMOUNT,
        value
    }),
    changeAccount: (value) => ({
        type: ActionTypes.CHANGE_ACCOUNT,
        value
    }),
    changeTaxRate: (value) => ({
        type: ActionTypes.CHANGE_TAXRATE,
        value
    }),
    changeBillStates: () => ({
        type: ActionTypes.CHANGE_BILLSTATES
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const state = getState().yysrAccountState
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)

        let data = state.get('data').toJS()
        const runningState = data['runningState']
        const beManagemented = data['acBusinessIncome']['beManagemented']//收付管理
        const propertyCarryover = data['propertyCarryover'] === 'SX_HW' ? true : false
        const runningBeCarryover = data['beCarryover']//流水是否启用结转成本
        const isInsert = state.getIn(['views', 'insertOrModify']) === 'insert' ? true : false

        //校验
        let amount = data['amount']
        if (amount <= 0) {
            return thirdParty.toast.info('请填写金额')
        }
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (usedProject && runningState != 'STATE_YYSR_DJ') {
            let uuidArr = [], hasEmptyAmount = false
            const hasEmpty = projectCard.every(v => {
                uuidArr.push(v['uuid'])
                if (v['amount'] <= 0) {
                    hasEmptyAmount = true
                }
                return v['uuid']
            })
            if (!hasEmpty) {
                return thirdParty.toast.info('有未选择的项目卡片')
            }
            if (!propertyCarryover && hasEmptyAmount) {
                return thirdParty.toast.info('项目卡片有未填写的金额')
            }
            let newArr = [...new Set(uuidArr)]
            if (newArr.length < uuidArr.length) {
                return thirdParty.toast.info('有重复的项目卡片')
            }
        }

        if (beManagemented) {
            const contactsCardRange = data['acBusinessIncome']['contactsCardRange']
            if (!contactsCardRange || contactsCardRange['uuid'] == '') {
                return thirdParty.toast.info('请选择往来单位')
            }
        } else {
            if (data['accountUuid'] == '') {
                return thirdParty.toast.info('请选择账户')
            }
        }
        if (runningState != 'STATE_YYSR_DJ' && propertyCarryover) {
            const stockCardRange = data['acBusinessIncome']['stockCardList']
            const carryoverCardList = data['acBusinessIncome']['carryoverCardList']
            let uuidArr = [], hasEmptyAmount = false, hasEmptyCarryAmount = false
            const hasEmpty = stockCardRange.every((v,i) => {
                uuidArr.push(v['uuid'])
                if (v['amount'] <= 0) {
                    hasEmptyAmount = true
                }
                if (isInsert && runningBeCarryover && carryoverCardList[i]['amount'] <= 0) {
                    hasEmptyCarryAmount = true
                }
                return v['uuid']
            })
            if (!hasEmpty) {
                return thirdParty.toast.info('有未选择的存货卡片')
            }
            if (hasEmptyAmount) {
                return thirdParty.toast.info('存货卡片有未填写的金额')
            }
            let newArr = [...new Set(uuidArr)]
            if (newArr.length < uuidArr.length) {
                return thirdParty.toast.info('有重复的存货卡片')
            }
            if (data['beCarryover'] && hasEmptyCarryAmount) {
                return thirdParty.toast.info('有未填写的成本金额')
            }
        }
        if (runningState === 'STATE_YYSR_DJ') {
            amount = -amount// 如果流水类别为预付，将金额处理为相反数
            if (data['accountUuid'] == '') {
                return thirdParty.toast.info('请选择账户')
            }
        } else {
            if (data['currentAmount'] > 0 && data['accountUuid'] == '') {
                return thirdParty.toast.info('请选择账户')
            }
            if (isInsert && (Number(data['currentAmount']) + Number(data['offsetAmount']) > amount)) {
                return thirdParty.toast.info('本次收(付)款金额+预收(付)抵扣不可大于总金额')
            }
        }

        let url = 'modifyRunningbusiness'
        if (isInsert) {
            delete data['uuid']//insert时不传uuid
            delete data['parentUuid']
            url = 'insertIncome'
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            amount,
            usedProject,
            projectCard,
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (json.code !== 0) {
                thirdParty.toast.fail(`${json.code} ${json.message}`)
            } else {
                thirdParty.toast.success('保存成功', 2)
                if (saveAndNew) { //保存并新增
                    const categoryUuid = data['categoryUuid']
                    dispatch(yysrAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    dispatch(yysrAccountActions.afterLrAccountSave(json.data, saveAndNew, isInsert))
                }
            }


        })
    },
    afterLrAccountSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_LRACCOUNT_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYysrPreAmount: () => (dispatch, getState) => {
        const state = getState().yysrAccountState
        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])
        const cardUuid = state.getIn(['data', 'acBusinessIncome', 'contactsCardRange', 'uuid'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`getRunningAccountInfo`, 'POST', JSON.stringify({
            categoryUuid,
            runningDate,
            cardUuid
        }),json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YYSR_PREAMOUNT,
                    data: json.data.result
                })
            }

        })
    },
    getYysrCardList: (cardType)=> (dispatch, getState) => {
        //stockRange contactsRange
        const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
        const state = getState().yysrAccountState
        const categoryList = state.getIn(['data', 'acBusinessIncome', cardType])
        const runningState = state.getIn(['data', 'runningState'])
        let property = ''// NEEDIN应收 PREIN预收 NEEDPAY应付 PREPAY预付  1：原材料，2：半成品，3：库存商品，4：易耗品  空则查全部
        let url = 'getCurrentCardList'
        if (runningState==='STATE_YYSR_DJ') {
            if (cardType=='stockRange') {
                property = '4'
                url = 'getStockCardList'
            } else {
                property = 'PREIN'
            }
        } else {
            if (cardType=='stockRange') {
                property = '4'
                url = 'getStockCardList'
            } else {
                property = 'NEEDIN'
            }
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            sobId,
            property,
            categoryList
        }),json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YYSR_CARDLIST,
                    data: json.data.result,
                    cardType
                })
            }

        })
    },
    getCardDetail: (uuid) => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningDetail', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                let jsonData = json.data.result
                delete jsonData['parentUuid']

                dispatch({
                    type: ActionTypes.YYSR_SAVE_AND_NEW,
                    receivedData: jsonData
                })

                const beManagemented = jsonData['acBusinessIncome']['beManagemented']//收付管理
                const propertyCarryover = jsonData['propertyCarryover'] === 'SX_HW' ? true : false
                if (beManagemented) {
                    dispatch(yysrAccountActions.getYysrCardList('contactsRange'))
                }
                if (propertyCarryover) {
                    dispatch(yysrAccountActions.getYysrCardList('stockRange'))
                }

            }
        })
    },
    changeYysrStockCard: (dataType, value, idx) => ({
        type: ActionTypes.CHANGE_YYSR_STOCKCARD,
        dataType,
        value,
        idx
    }),

}

export const ActionTypes = {
    GET_LB_YYSR_CARD_DETAIL: 'GET_LB_YYSR_CARD_DETAIL',
    GET_LB_YYSR_FROM_YLLS: 'GET_LB_YYSR_FROM_YLLS',
    CHANGE_RUNNING_STATE: 'CHANGE_RUNNING_STATE',
    CHANGE_YYSR_DATA: 'CHANGE_YYSR_DATA',
    CHANGE_AMOUNT: 'CHANGE_AMOUNT',
    CHANGE_ACCOUNT: 'CHANGE_ACCOUNT',
    CHANGE_ACLIST: 'CHANGE_ACLIST',
    CHANGE_TAXRATE: 'CHANGE_TAXRATE',
    CHANGE_BILLSTATES: 'CHANGE_BILLSTATES',
    AFTER_LRACCOUNT_SAVE: 'AFTER_LRACCOUNT_SAVE',
    GET_YYSR_PREAMOUNT: 'GET_YYSR_PREAMOUNT',
    YYSR_SAVE_AND_NEW: 'YYSR_SAVE_AND_NEW',
    GET_YYSR_CARDLIST: 'GET_YYSR_CARDLIST',
    CHANGE_YYSR_STOCKCARD: 'CHANGE_YYSR_STOCKCARD'
}

export { yysrAccountActions }
