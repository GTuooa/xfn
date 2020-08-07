import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const yyzcAccountState = fromJS({
    views: {
        insertOrModify: 'insert',//流水是保存还是新增
        fromYl: false
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
        runningState: 'STATE_YYZC_GJ',//STATE_YYZC_DJ STATE_YYZC_GJ STATE_YYZC_TG 付定金 1 购进 2 退购
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        currentAmount: '',//本次收款 本次付款
        billType: 'bill_other',//票据类型 增值税专用发票 bill_special 其他票据 bill_other
        billStates: 'bill_states_not_auth',//未认证 bill_states_not_auth 认证 auth
        billAssList: [],//相应发票科目的辅助核算
        billAcList: [],
        taxRate: 3,//税率
        tax: '',//税额
        offsetAmount: 0.00,//预收款
        paymentList: [],
        projectCard:[{}],
        // 营业支出
        "acBusinessExpense": {
            "payAc": [],  // 支出 科目列表
            "payList": [],  // 支出 科目辅助核算
            "deliveryAc": [],  // 应付 科目列表
            "deliveryList": [],  // 应付 科目辅助核算
            "inAdvanceAc": [],  // 定金 科目列表
            "inAdvanceList": [],  // 定金 科目辅助核算
            "beManagemented": false,  // 是否收付管理
            "beDeposited": false,  // 是否定金管理
            "stockCardList": [],
            "contactsCardRange": {
                uuid: '',
                code: '',
                name: ''
            },
        }
    },
    preData: {//预收款金额状态
        preAmount: 0.00,//预付款
        receiveAmount: 0.00//应付款
    },
    stockCardList: [],//存货卡片列表
    contactsCardList: []//往来关系列表
})

// Reducer
export default function reducer(state = yyzcAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_YYZC_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')
            const taxRate = yyzcAccountState.getIn(['data', 'taxRate'])
            let tax = amount - amount / (1 + taxRate / 100)
            const runningAbstract = `采购${action.receivedData['propertyCarryover'] === 'SX_HW' ? '存货' : ''}支出`

            return yyzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .set('preData', yyzcAccountState.get('preData'))
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data' ,'runningAbstract'], runningAbstract)
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['data' ,'tax'], decimal(tax))
                        .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_YYZC_FROM_YLLS]					: () => {
            //是否是全收全付
			const isFullPayment = Math.abs(action.state.getIn(['data', 'amount'])) == Math.abs(action.state.getIn(['data', 'currentAmount'])) ? true : false
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .setIn(['data', 'isFullPayment'], isFullPayment)
        },
        [ActionTypes.CHANGE_YYZC_DATA]					         : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_YYZC_RUNNING_STATE]					 : () => {

            return state.setIn(['data' ,'runningState'], action.key)
                        .setIn(['data', 'acBusinessExpense', 'contactsCardRange'], null)
        },
        [ActionTypes.CHANGE_YYZC_ASSLIST]					      : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.uuid = arr[0]
            item.code = arr[1]
            item.name = arr[2]

            return state.setIn(['data' ,'acBusinessExpense', action.acType], fromJS(item))
        },
        [ActionTypes.CHANGE_YYZC_ACCOUNT]			     : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.GET_YYZC_PREAMOUNT]				 : () => {
            return state.setIn(['preData', 'preAmount'], action.data.preAmount)
                        .setIn(['preData', 'receiveAmount'], action.data.amount)
                        .setIn(['data', 'offsetAmount'], '')

        },
        [ActionTypes.CHANGE_YYZCDATE]					 : () => {
            return state.setIn(['data' ,'runningDate'], action.date)
        },
        [ActionTypes.CHANGE_YYZC_BILLASSLIST]			 : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.assId = arr[0]
            item.assName = arr[1]
            item.assCategory = arr[2]
            return state.setIn(['data', 'billAssList', action.idx], fromJS(item))
                        .setIn(['data', 'billAcList', 0], fromJS({acId: action.billAcId}))
        },
        [ActionTypes.CHANGE_YYZC_TAXRATE_OR_AMOUNT]				  : () => {
            let tax = 0.00
            if (action.dataType === 'amount') {
                const taxRate = state.getIn(['data' ,'taxRate'])
                const amount = action.value

                tax = amount - amount / (1 + taxRate / 100)
                state = state.setIn(['data' ,'amount'], amount)
            } else {
                const amount = state.getIn(['data', 'amount'])
                const taxRate = action.value

                tax = amount - amount / (1 + taxRate / 100)
                state = state.setIn(['data' ,'taxRate'], taxRate)
            }
            return state.setIn(['data' ,'tax'], decimal(tax))

        },
        [ActionTypes.CHANGE_YYZC_BILLSTATES]					: () => {
            let oldBillStates = state.getIn(['data' ,'billStates'])
            let billStates = ''
            ;({
                'bill_states_not_auth': () => billStates = 'bill_states_auth',
                'bill_states_auth': () => billStates = 'bill_states_not_auth'
            }[oldBillStates] || (() => null))()

            return state.setIn(['data' ,'billStates'], billStates)
                        .setIn(['data' ,'billAssList'], fromJS([]))
                        .setIn(['data' ,'billAcList'], fromJS([]))
        },
        [ActionTypes.AFTER_YYZC_SAVE]                           : () => {
            if (action.saveAndNew) {
                state = yyzcAccountState
            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_YYZC_CARDLIST]					         : () => {
            let cardList = []
            action.data.forEach(v => {
                cardList.push({key: `${v['code']} ${v['name']}`, value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`})
            })

            if (action.cardType === 'stockRange') {
                state = state.set('stockCardList', fromJS(cardList))
            } else {
                state = state.set('contactsCardList', fromJS(cardList))
            }
            return state
        },
        [ActionTypes.YYZC_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])
            const runningAbstract = `采购${action.receivedData['propertyCarryover'] === 'SX_HW' ? '存货' : ''}支出`

            return yyzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data' ,'runningAbstract'], runningAbstract)
        },
        [ActionTypes.CHANGE_YYZC_STOCKCARD]					      : () => {
            switch (action.dataType) {
                case 'card' : {
                    const arr = action.value.split(Limit.TREE_JOIN_STR)
                    const amount = state.getIn(['data', 'acBusinessExpense', 'stockCardList', action.idx, 'amount'])
                    state = state.setIn(['data', 'acBusinessExpense', 'stockCardList', action.idx], fromJS({uuid: arr[0], code: arr[1], name: arr[2], amount}))
                    break
                }
                case 'amount' : {
                    state = state.setIn(['data', 'acBusinessExpense', 'stockCardList', action.idx, 'amount'], action.value)
                    break
                }
                case 'add' : {
                    state = state.setIn(['data', 'acBusinessExpense', 'stockCardList', action.idx], fromJS({amount: ''}))
                    break
                }
                case 'delete' : {
                    state = state.deleteIn(['data', 'acBusinessExpense', 'stockCardList', action.idx])
                    break
                }
            }
            return state

        },

    }[action.type] || (() => state))()
}



// Action Creators
const yyzcAccountActions = {
    changeYyzcData: (dataType, value) => ({
        type: ActionTypes.CHANGE_YYZC_DATA,
        dataType,
        value
    }),
    changeYyzcRunningState: (key) => ({
        type: ActionTypes.CHANGE_YYZC_RUNNING_STATE,
        key
    }),
    changeYyzcAssList: (value, acType) => ({
        type: ActionTypes.CHANGE_YYZC_ASSLIST,
        value,
        acType
    }),
    changeYyzcAccount: (value) => ({
        type: ActionTypes.CHANGE_YYZC_ACCOUNT,
        value
    }),
    getYyzcPreAmount: () => (dispatch, getState) => {
        const state = getState().yyzcAccountState
        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])
        const cardUuid = state.getIn(['data', 'acBusinessExpense', 'contactsCardRange', 'uuid'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`getRunningAccountInfo`, 'POST', JSON.stringify({
            categoryUuid,
            cardUuid,
            runningDate,
        }),json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YYZC_PREAMOUNT,
                    data: json.data.result
                })
            }

        })
    },
    changeYyzcDate: (date) => ({
        type: ActionTypes.CHANGE_YYZCDATE,
        date
    }),
    changeYyzcBillAssList: (idx, value, billAcId) => ({
        type: ActionTypes.CHANGE_YYZC_BILLASSLIST,
        value,
        idx,
        billAcId
    }),
    changeYyzcTaxRateOrAmount: (dataType, value) => ({
        type: ActionTypes.CHANGE_YYZC_TAXRATE_OR_AMOUNT,
        dataType,
        value
    }),
    changeYyzcBillStates: () => ({
        type: ActionTypes.CHANGE_YYZC_BILLSTATES
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const state = getState().yyzcAccountState
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        let data = state.get('data').toJS()
        const runningState = data['runningState']
        const beManagemented = data['acBusinessExpense']['beManagemented']//收付管理
        const propertyCarryover = data['propertyCarryover'] === 'SX_HW' ? true : false

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
        if (beManagemented) {
            const contactsCardRange = data['acBusinessExpense']['contactsCardRange']
            if (!contactsCardRange || contactsCardRange['uuid'] == '') {
                return thirdParty.toast.info('请选择往来单位')
            }
        } else {
            if (data['accountUuid'] == '') {
                return thirdParty.toast.info('请选择账户')
            }
        }
        if (runningState != 'STATE_YYZC_DJ' && propertyCarryover) {
            const stockCardRange = data['acBusinessExpense']['stockCardList']
            let uuidArr = [], hasEmptyAmount = false
            const hasEmpty = stockCardRange.every(v => {
                uuidArr.push(v['uuid'])
                if (v['amount'] <= 0) {
                    hasEmptyAmount = true
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
        }
        if (runningState === 'STATE_YYZC_DJ') {
            amount = -Math.abs(amount)// 如果流水类别为预付，将金额处理为相反数
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
        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (!propertyCarryover && usedProject && runningState != 'STATE_YYZC_DJ') {
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

        let url = 'modifyRunningbusiness'
        const isInsert = state.getIn(['views', 'insertOrModify']) === 'insert' ? true : false
        if (isInsert) {
            delete data['uuid']//insert时不传uuid
            delete data['parentUuid']
            url = 'insertExpense'
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
            if (showMessage(json)) {
                thirdParty.toast.success('保存成功', 2)
                if (saveAndNew) { //保存并新增
                    const categoryUuid = data['categoryUuid']
                    dispatch(yyzcAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    dispatch(yyzcAccountActions.afterYyzcSave(json.data, saveAndNew, isInsert))
                }
            }
        })
    },
    afterYyzcSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_YYZC_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYyzcCardList: (cardType)=> (dispatch, getState) => {
        //stockRange contactsRange
        const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
        const state = getState().yyzcAccountState
        const categoryList = state.getIn(['data', 'acBusinessExpense', cardType])
        const runningState = state.getIn(['data', 'runningState'])
        let property = ''// NEEDIN应收 PREIN预收 NEEDPAY应付 PREPAY预付  1：原材料，2：半成品，3：库存商品，4：易耗品  空则查全部
        let url = 'getCurrentCardList'
        if (runningState==='STATE_YYZC_DJ') {
            if (cardType=='stockRange') {
                property = '5'
                url = 'getStockCardList'
            } else {
                property = 'PREPAY'
            }
        } else {
            if (cardType=='stockRange') {
                property = '5'
                url = 'getStockCardList'
            } else {
                property = 'NEEDPAY'
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
                    type: ActionTypes.GET_YYZC_CARDLIST,
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
                    type: ActionTypes.YYZC_SAVE_AND_NEW,
                    receivedData: jsonData
                })

                const beManagemented = jsonData['acBusinessExpense']['beManagemented']//收付管理
                const propertyCarryover = jsonData['propertyCarryover'] === 'SX_HW' ? true : false
                if (beManagemented) {
                    dispatch(yyzcAccountActions.getYyzcCardList('contactsRange'))
                }
                if (propertyCarryover) {
                    dispatch(yyzcAccountActions.getYyzcCardList('stockRange'))
                }

            }
        })
    },
    changeYyzcStockCard: (dataType, value, idx) => ({
        type: ActionTypes.CHANGE_YYZC_STOCKCARD,
        dataType,
        value,
        idx
    }),

}

export const ActionTypes = {
    GET_LB_YYZC_CARD_DETAIL: 'GET_LB_YYZC_CARD_DETAIL',
    GET_LB_YYZC_FROM_YLLS: 'GET_LB_YYZC_FROM_YLLS',
    CHANGE_YYZC_DATA: 'CHANGE_YYZC_DATA',
    CHANGE_YYZC_RUNNING_STATE: 'CHANGE_YYZC_RUNNING_STATE',
    CHANGE_YYZC_ASSLIST: 'CHANGE_YYZC_ASSLIST',
    CHANGE_YYZC_ACCOUNT: 'CHANGE_YYZC_ACCOUNT',
    GET_YYZC_PREAMOUNT: 'GET_YYZC_PREAMOUNT',
    CHANGE_YYZCDATE: 'CHANGE_YYZCDATE',
    CHANGE_YYZC_BILLASSLIST: 'CHANGE_YYZC_BILLASSLIST',
    CHANGE_YYZC_TAXRATE_OR_AMOUNT: 'CHANGE_YYZC_TAXRATE_OR_AMOUNT',
    CHANGE_YYZC_BILLSTATES: 'CHANGE_YYZC_BILLSTATES',
    AFTER_YYZC_SAVE: 'AFTER_YYZC_SAVE',
    GET_YYZC_CARDLIST: 'GET_YYZC_CARDLIST',
    YYZC_SAVE_AND_NEW: 'YYZC_SAVE_AND_NEW',
    CHANGE_YYZC_STOCKCARD: 'CHANGE_YYZC_STOCKCARD'
}

export { yyzcAccountActions }
