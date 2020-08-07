import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'


const fyzcAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
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
        runningState: 'STATE_FY_YF',//STATE_FY_YF STATE_FY_WF STATE_FY_DJ
        propertyList: [],
        propertyCost: '',//费用性质  XZ_FINANCE XZ_SALE XZ_MANAGE  财务 销售 管理
        propertyCostList: [],
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        billType: 'bill_other',//票据类型 增值税专用发票 bill_special 其他票据 bill_other
        billStates: 'bill_states_not_auth',//未认证 bill_states_not_auth 认证 auth
        billAssList: [],//相应发票科目的辅助核算
        billAcList: [],
        taxRate: 3,//税率
        tax: 0.00,//税额
        paymentList: [],
        "acCost": {// 费用支出
            "saleAc": [],  // 销售科目列表
            "saleList": [], // 销售科目辅助核算列表
            "manageAc": [],  // 管理科目列表
            "manageList": [],  // 管理科目辅助核算
            "financeAc": [],  // 财务科目列表
            "financeList": [],  // 财务科目辅助核算
            "deliveryAc": [],  // 应收/付 科目列表
            "deliveryList": [],  // 应收/付 科目辅助核算
            "beManagemented": false,  // 是否收付管理
            "contactsCardRange": {uuid: '', code: '', name: ''}
        }
    },
    contactsCardList: []//往来关系列表
})

// Reducer
export default function reducer(state = fyzcAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_FYZC_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')
            const taxRate = fyzcAccountState.getIn(['data', 'taxRate'])
            let tax = amount - amount / (1 + taxRate / 100)
            const runningAbstract = `${action.receivedData['name']}支出`

            let propertyCost = ''
            const propertyCostList = action.receivedData.propertyCostList
            if (propertyCostList.length == 1) {
                propertyCost = propertyCostList[0]
            }

            return fyzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data' ,'runningAbstract'], runningAbstract)
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['data' ,'tax'], decimal(tax))
                        .setIn(['data', 'propertyCost'], propertyCost)
                        .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_FYZC_FROM_YLLS]					: () => {
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
        },
        [ActionTypes.CHANGE_FYZC_DATA]					         : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_FYZC_RUNNING_STATE]					 : () => {
            return state.setIn(['data' ,'runningState'], action.key)
        },
        [ActionTypes.CHANGE_FYZC_ASSLIST]					      : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.uuid = arr[0]
            item.code = arr[1]
            item.name = arr[2]
            return state.setIn(['data' ,'acCost', action.acType], fromJS(item))
        },
        [ActionTypes.CHANGE_FYZC_ACCOUNT]			     : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.CHANGE_FYZCDATE]					 : () => {
            return state.setIn(['data' ,'runningDate'], action.date)
        },
        [ActionTypes.CHANGE_FYZC_BILLASSLIST]			 : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.assId = arr[0]
            item.assName = arr[1]
            item.assCategory = arr[2]
            return state.setIn(['data', 'billAssList', action.idx], fromJS(item))
                        .setIn(['data', 'billAcList', 0], fromJS({acId: action.billAcId}))
        },
        [ActionTypes.CHANGE_FYZC_TAXRATE_OR_AMOUNT]				  : () => {
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
        [ActionTypes.CHANGE_FYZC_BILLSTATES]					: () => {
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
        [ActionTypes.AFTER_FYZC_SAVE]                           : () => {
            if (action.saveAndNew) {
                state = fyzcAccountState
            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_FYZC_CARDLIST]					         : () => {
            let cardList = []
            action.data.forEach(v => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })

            return state.set('contactsCardList', fromJS(cardList))
        },
        [ActionTypes.FYZC_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])
            const runningAbstract = `${action.receivedData['name']}支出`

            let propertyCost = ''
            const propertyCostList = action.receivedData.propertyCostList
            if (propertyCostList.length == 1) {
                propertyCost = propertyCostList[0]
            }


            return fyzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data', 'propertyCost'], propertyCost)
                                .setIn(['data', 'runningAbstract'], runningAbstract)

        }

    }[action.type] || (() => state))()
}



// Action Creators
const fyzcAccountActions = {
    changeFyzcData: (dataType, value) => ({
        type: ActionTypes.CHANGE_FYZC_DATA,
        dataType,
        value
    }),
    changeFyzcRunningState: (key) => ({
        type: ActionTypes.CHANGE_FYZC_RUNNING_STATE,
        key
    }),
    changeFyzcAssList: (value, acType) => ({
        type: ActionTypes.CHANGE_FYZC_ASSLIST,
        value,
        acType
    }),
    changeFyzcAccount: (value) => ({
        type: ActionTypes.CHANGE_FYZC_ACCOUNT,
        value
    }),
    changeFyzcDate: (date) => ({
        type: ActionTypes.CHANGE_FYZCDATE,
        date
    }),
    changeFyzcBillAssList: (idx, value, billAcId) => ({
        type: ActionTypes.CHANGE_FYZC_BILLASSLIST,
        value,
        idx,
        billAcId
    }),
    changeFyzcTaxRateOrAmount: (dataType, value) => ({
        type: ActionTypes.CHANGE_FYZC_TAXRATE_OR_AMOUNT,
        dataType,
        value
    }),
    changeFyzcBillStates: () => ({
        type: ActionTypes.CHANGE_FYZC_BILLSTATES
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().fyzcAccountState
        let data = state.get('data').toJS()
        const runningState = data['runningState']
        const beManagemented = data['acCost']['beManagemented']//收付管理

        //校验
        if (runningState != 'STATE_FY_WF' && runningState != 'STATE_FY_DJ' && data['propertyCost']=='') {
            return thirdParty.toast.info('请选择费用性质')
        }
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (beManagemented) {
            const contactsCardRange = data['acCost']['contactsCardRange']
            if (!contactsCardRange || contactsCardRange['uuid'] == '') {
                return thirdParty.toast.info('请选择往来单位')
            }
        }
        if (data['amount'] == 0) {
            return thirdParty.toast.info('请填写金额')
        }
        if (runningState != 'STATE_FY_WF' && data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (usedProject && runningState != 'STATE_FY_DJ') {
            let uuidArr = [], hasEmptyAmount = false
            const hasEmpty = projectCard.every(v => {
                uuidArr.push(v['uuid'])
                if (v['amount'] == 0) {
                    hasEmptyAmount = true
                }
                return v['uuid']
            })
            if (!hasEmpty) {
                return thirdParty.toast.info('有未选择的项目卡片')
            }
            if (hasEmptyAmount) {
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
            url = 'insertCost'
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            usedProject,
            projectCard,
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                thirdParty.toast.success('保存成功', 2)
                if (saveAndNew) { //保存并新增
                    //dispatch(fyzcAccountActions.afterFyzcSave(json.data, saveAndNew, isInsert))
                    //dispatch(homeAccountActions.accountSaveAndNew())
                    const categoryUuid = data['categoryUuid']
                    dispatch(fyzcAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    dispatch(fyzcAccountActions.afterFyzcSave(json.data, saveAndNew, isInsert))
                }
            }


        })
    },
    afterFyzcSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_FYZC_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getFyzcCardList: (cardType)=> (dispatch, getState) => {
        // contactsRange
        const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
        const state = getState().fyzcAccountState
        const categoryList = state.getIn(['data', 'acCost', cardType])
        const runningState = state.getIn(['data', 'runningState'])
        let property = runningState == 'STATE_FY_DJ' ? 'PREPAY' : 'NEEDPAY'// NEEDIN应收 PREIN预收 NEEDPAY应付 PREPAY预付

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getCurrentCardList', 'POST', JSON.stringify({
            sobId,
            property,
            categoryList
        }),json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_FYZC_CARDLIST,
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
                    type: ActionTypes.FYZC_SAVE_AND_NEW,
                    receivedData: jsonData
                })

                const beManagemented = jsonData['acCost']['beManagemented']//收付管理
                if (beManagemented) {
                    dispatch(fyzcAccountActions.getFyzcCardList('contactsRange'))
                }
            }
        })
    }

}

export const ActionTypes = {
    GET_LB_FYZC_CARD_DETAIL: 'GET_LB_FYZC_CARD_DETAIL',
    GET_LB_FYZC_FROM_YLLS: 'GET_LB_FYZC_FROM_YLLS',
    CHANGE_FYZC_DATA: 'CHANGE_FYZC_DATA',
    CHANGE_FYZC_RUNNING_STATE: 'CHANGE_FYZC_RUNNING_STATE',
    CHANGE_FYZC_ASSLIST: 'CHANGE_FYZC_ASSLIST',
    CHANGE_FYZC_ACCOUNT: 'CHANGE_FYZC_ACCOUNT',
    CHANGE_FYZCDATE: 'CHANGE_FYZCDATE',
    CHANGE_FYZC_BILLASSLIST: 'CHANGE_FYZC_BILLASSLIST',
    CHANGE_FYZC_TAXRATE_OR_AMOUNT: 'CHANGE_FYZC_TAXRATE_OR_AMOUNT',
    CHANGE_FYZC_BILLSTATES: 'CHANGE_FYZC_BILLSTATES',
    AFTER_FYZC_SAVE: 'AFTER_FYZC_SAVE',
    GET_FYZC_CARDLIST: 'GET_FYZC_CARDLIST',
    FYZC_SAVE_AND_NEW: 'FYZC_SAVE_AND_NEW'
}

export { fyzcAccountActions }
