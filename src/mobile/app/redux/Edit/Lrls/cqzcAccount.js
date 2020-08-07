import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const cqzcAccountState = fromJS({
    views: {
        insertOrModify: 'insert',//流水是保存还是新增
        fromYl: false,//从预览界面跳入
        shouldJzsy: false,//从预览界面跳入并去结转损益
    },
    data: {
        categoryType: '',//十四大类的一种
        categoryUuid: '',//选中类别的uuid
        categoryName: '请选择类别',//选中类别的name
        runningDate: '',//日期
        flowNumber: '',//流水号
        uuid: '',
        runningAbstract: '购进资产支出',//摘要
        amount: '',//金额
        assetType: 'XZ_GJZC',//购进资产 XZ_CZZC 处置 XZ_ZJTX 资产折旧摊销
        runningState: 'STATE_CQZC_YF',//STATE_CQZC_WF STATE_CQZC_YS STATE_CQZC_WS
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        beCarryover: false,//是否结转损益
        carryoverAmount: '',//成本金额
        billType: 'bill_other',//票据类型 发票 bill_common 其他票据 bill_other 专用发票 bill_special
        billStates: 'bill_states_not_auth',// 未开票 bill_states_not_make_out make_out 未认证 not_auth 认证 auth
        billAssList: [],//相应发票科目的辅助核算
        billAcList: [],
        taxRate: 3,//税率
        tax: '',//税额
        propertyCostList: [],
        propertyCost: '',
        "acAssets": {
            "beManagemented": false,  // 是否收付管理
            "beCleaning": false,  // 清理处置
            netProfitAmount: 0,//净收益金额
            lossAmount: 0,//净损失金额
            originalAssetsAmount: 0,//资产原值
            depreciationAmount: 0,//累计折旧
            "contactsCardRange": {
                uuid: '',
                code: '',
                name: ''
            }
        }
    },
    contactsCardList: []//往来关系列表
})

// Reducer
export default function reducer(state = cqzcAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_CQZC_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)

            const amount = action.data.get('amount')
            const taxRate = cqzcAccountState.getIn(['data', 'taxRate'])
            let tax = amount - amount / (1 + taxRate / 100)

            let propertyCost = ''
            const propertyCostList = action.receivedData.propertyCostList
            if (propertyCostList.length == 1) {
                propertyCost = propertyCostList[0]
            }

            return cqzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .set('preData', cqzcAccountState.get('preData'))
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['data','tax'], decimal(tax))
                        .setIn(['data', 'propertyCost'], propertyCost)
                        .setIn(['data', 'runningAbstract'], '购进资产支出')
                        .setIn(['views' ,'insertOrModify'], 'insert')
                        .setIn(['views' ,'fromYl'], false)
                        .setIn(['views' ,'shouldJzsy'], false)

        },
        [ActionTypes.GET_LB_CQZC_FROM_YLLS]					: () => {
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
        },
        [ActionTypes.CHANGE_CQZC_VIEWS]					    : () => {
            return state.setIn(['views', 'shouldJzsy'], true)
                        .setIn(['views', 'insertOrModify'], 'insert')
                        .setIn(['data', 'runningAbstract'], '处置资产处置损益')
        },
        [ActionTypes.CHANGE_CQZC_PROPERTY_COST]             : () => {
            let runningState = '', billStates = '', runningAbstract = ''

            ;({
                'XZ_GJZC' : () => {
                    runningState = 'STATE_CQZC_YF'
                    billStates = 'bill_states_not_auth'
                    runningAbstract = '购进资产支出'
                },
                'XZ_CZZC' : () => {
                    runningState = 'STATE_CQZC_YS'
                    billStates = 'bill_states_not_make_out'
                    runningAbstract = '处置资产收入'
                },
                'XZ_ZJTX' : () => {
                    runningState = 'STATE_CQZC_ZJTX'
                    billStates = 'bill_states_not_make_out'
                    runningAbstract = '资产折旧摊销'
                }
            }[action.value])()

            return state.setIn(['data', 'assetType'], action.value)
                        .setIn(['data', 'runningState'], runningState)
                        .setIn(['data' ,'beCarryover'], false)
                        .setIn(['data' ,'billStates'], billStates)
                        .setIn(['data' ,'runningAbstract'], runningAbstract)
        },
        [ActionTypes.CHANGE_CQZC_DATA]					: () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_CQZC_ACLIST]					         : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.uuid = arr[0]
            item.code = arr[1]
            item.name = arr[2]

            return state.setIn(['data','acAssets', action.acType], fromJS(item))
        },
        [ActionTypes.CHANGE_CQZC_AMOUNT]					: () => {
            const taxRate = state.getIn(['data', 'taxRate'])
            const amount = action.value
            let tax = amount - amount / (1 + taxRate / 100)
            return state.setIn(['data' ,'amount'], amount)
                        .setIn(['data' ,'tax'], decimal(tax))
        },
        [ActionTypes.CHANGE_CQZC_ACCOUNT]			     : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.CHANGE_CQZC_BECARRYOVER]					: () => {
            return state.updateIn(['data' ,'beCarryover'], v => !v)
        },
        [ActionTypes.CHANGE_CQZC_TAXRATE]					: () => {
            const amount = state.getIn(['data', 'amount'])
            const taxRate = action.value
            let tax = 0.00
            tax = amount - amount / (1 + taxRate / 100)
            return state.setIn(['data' ,'taxRate'], taxRate)
                        .setIn(['data' ,'tax'], decimal(tax))
        },
        [ActionTypes.CHANGE_CQZC_BILLSTATES]					: () => {
            let oldBillStates = state.getIn(['data' ,'billStates'])
            let billStates = ''
            ;({
                'bill_states_not_make_out': () => billStates = 'bill_states_make_out',
                'bill_states_make_out': () => billStates = 'bill_states_not_make_out',
                'bill_states_not_auth': () => billStates = 'bill_states_auth',
                'bill_states_auth': () => billStates = 'bill_states_not_auth'
            }[oldBillStates] || (() => null))()

            return state.setIn(['data' ,'billStates'], billStates)
        },
        [ActionTypes.AFTER_CQZC_SAVE]                : () => {
            if (action.isInsert) {
                state = state.setIn(['data', 'uuid'], action.data.uuid)
            }
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['data', 'flowNumber'], action.data.flowNumber)
        },
        [ActionTypes.CHANGE_CQZC_CZAMOUNT]					         : () => {
            return state.setIn(['data', 'acAssets', action.dataType], action.value)
        },
        [ActionTypes.AUTO_CQZC_CZAMOUNT]					         : () => {
            const originalAssetsAmount = state.getIn(['data', 'acAssets', 'originalAssetsAmount'])// 资产原值
            const depreciationAmount = state.getIn(['data', 'acAssets', 'depreciationAmount'])// 折旧累计
            const amount = state.getIn(['data', 'amount'])
            const tax = state.getIn(['data', 'tax'])
            const billType = state.getIn(['data', 'billType'])

            let netProfitAmount = 0, lossAmount = 0, totalAmount = 0
            if (billType === 'bill_common') {
                totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount) - Number(tax)
            } else {
                totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)
            }

            if (totalAmount >= 0) {
                state = state.deleteIn(['data', 'acAssets', 'lossAmount'])
                            .setIn(['data', 'acAssets', 'netProfitAmount'], totalAmount)
            } else {
                state = state.deleteIn(['data', 'acAssets', 'netProfitAmount'])
                            .setIn(['data', 'acAssets', 'lossAmount'], -totalAmount)
            }

            return state
        },

        [ActionTypes.GET_CQZC_CARDLIST]					         : () => {
            let cardList = []
            action.data.forEach(v => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })

            if (!state.getIn(['views' ,'fromYl'])) {//从预览跳进来不需要清空卡片
                state = state.setIn(['data', 'acAssets', 'contactsCardRange'], null)
            }

            return state.set('contactsCardList', fromJS(cardList))

        },
        [ActionTypes.CQZC_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])

            let propertyCost = ''
            const propertyCostList = action.receivedData.propertyCostList
            if (propertyCostList.length == 1) {
                propertyCost = propertyCostList[0]
            }

            return cqzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data', 'propertyCost'], propertyCost)
                                .setIn(['data', 'runningAbstract'], '购进资产支出')
        }

    }[action.type] || (() => state))()
}



// Action Creators
const cqzcAccountActions = {
    changeCqzcData: (dataType, value) => ({
        type: ActionTypes.CHANGE_CQZC_DATA,
        dataType,
        value
    }),
    changePropertyCost: (value) => ({
        type: ActionTypes.CHANGE_CQZC_PROPERTY_COST,
        value
    }),
    changeAcList: (value, acType) => ({
        type: ActionTypes.CHANGE_CQZC_ACLIST,
        value,
        acType
    }),
    changeAmount: (value) => ({
        type: ActionTypes.CHANGE_CQZC_AMOUNT,
        value
    }),
    changeAccount: (value) => ({
        type: ActionTypes.CHANGE_CQZC_ACCOUNT,
        value
    }),
    changeBeCarryover: () => ({
        type: ActionTypes.CHANGE_CQZC_BECARRYOVER
    }),
    changeTaxRate: (value) => ({
        type: ActionTypes.CHANGE_CQZC_TAXRATE,
        value
    }),
    changeBillStates: () => ({
        type: ActionTypes.CHANGE_CQZC_BILLSTATES
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().cqzcAccountState
        let data = state.get('data').toJS()
        const runningState = data['runningState']
        const beManagemented = data['acAssets']['beManagemented']//收付管理
        const beCarryover = data['beCarryover']//结转损益
        const assetType = data['assetType']

        //校验
        if (data['amount'] <= 0) {
            return thirdParty.toast.info('请填写金额')
        }
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (assetType == 'XZ_ZJTX' && data['propertyCost']=='') {
            return thirdParty.toast.info('请选择费用性质')
        }
        if (runningState != 'STATE_CQZC_WF' && runningState != 'STATE_CQZC_WS' && assetType != 'XZ_ZJTX' && data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }
        if (runningState != 'STATE_CQZC_JZSY' && assetType != 'XZ_ZJTX' && beManagemented) {//结转损益 折旧摊销 不需要校验卡片
            const contactsCardRange = data['acAssets']['contactsCardRange']
            if (!contactsCardRange || contactsCardRange['uuid'] == '') {
                return thirdParty.toast.info('请选择往来单位')
            }
        }
        if (beCarryover) {
            const originalAssetsAmount = data['acAssets']['originalAssetsAmount']
            const depreciationAmount = data['acAssets']['depreciationAmount']

            if (originalAssetsAmount <= 0) {
                return thirdParty.toast.info('请填写资产原值')
            }
            if (depreciationAmount <= 0) {
                return thirdParty.toast.info('请填写累计折旧')
            }
            if (Number(depreciationAmount) > Number(originalAssetsAmount)) {
                return thirdParty.toast.info('折旧额不能大于原值')
            }
        }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (usedProject && (beCarryover || assetType == 'XZ_ZJTX')) {
            let uuidArr = []
            const hasEmpty = projectCard.every(v => {
                uuidArr.push(v['uuid'])
                return v['uuid']
            })
            if (!hasEmpty) {
                return thirdParty.toast.info('有未选择的项目卡片')
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
            url = 'insertAssets'
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
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
                    //dispatch(cqzcAccountActions.afterLrAccountSave(json.data, saveAndNew, isInsert))
                    const categoryUuid = data['categoryUuid']
                    dispatch(cqzcAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    dispatch(cqzcAccountActions.afterLrAccountSave(json.data, isInsert))
                }
            }


        })
    },
    afterLrAccountSave: (data, isInsert) => ({
        type: ActionTypes.AFTER_CQZC_SAVE,
        data,
        isInsert
    }),
    changeCqzcCzAmount: (dataType, value) => ({
        type: ActionTypes.CHANGE_CQZC_CZAMOUNT,
        dataType,
        value
    }),
    autoCqzcCzAmount: () => ({
        type: ActionTypes.AUTO_CQZC_CZAMOUNT
    }),
    getCqzcCardList: (cardType)=> (dispatch, getState) => {
        //stockRange contactsRange
        const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
        const state = getState().cqzcAccountState
        const categoryList = state.getIn(['data', 'acAssets', cardType])
        const assetType = state.getIn(['data', 'assetType'])
        const property = assetType === 'XZ_GJZC' ? 'NEEDPAY' : 'NEEDIN'// NEEDIN应收 PREIN预收 NEEDPAY应付 PREPAY预付

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getCurrentCardList', 'POST', JSON.stringify({
            sobId,
            property,
            categoryList
        }),json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_CQZC_CARDLIST,
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
                    type: ActionTypes.CQZC_SAVE_AND_NEW,
                    receivedData: jsonData
                })

                const beManagemented = jsonData['acAssets']['beManagemented']//收付管理
                if (beManagemented) {
                    dispatch(cqzcAccountActions.getCqzcCardList('contactsRange'))
                }

            }
        })
    },
    changeCqzcViews: () => ({
        type: ActionTypes.CHANGE_CQZC_VIEWS
    })

}

export const ActionTypes = {
    GET_LB_CQZC_CARD_DETAIL: 'GET_LB_CQZC_CARD_DETAIL',
    GET_LB_CQZC_FROM_YLLS: 'GET_LB_CQZC_FROM_YLLS',
    CHANGE_CQZC_DATA: 'CHANGE_CQZC_DATA',
    CHANGE_CQZC_AMOUNT: 'CHANGE_CQZC_AMOUNT',
    CHANGE_CQZC_ACCOUNT: 'CHANGE_CQZC_ACCOUNT',
    CHANGE_CQZC_ACLIST: 'CHANGE_CQZC_ACLIST',
    CHANGE_CQZC_BECARRYOVER: 'CHANGE_CQZC_BECARRYOVER',
    CHANGE_CQZC_TAXRATE: 'CHANGE_CQZC_TAXRATE',
    CHANGE_CQZC_BILLSTATES: 'CHANGE_CQZC_BILLSTATES',
    AFTER_CQZC_SAVE: 'AFTER_CQZC_SAVE',
    CHANGE_CQZC_CZAMOUNT: 'CHANGE_CQZC_CZAMOUNT',
    AUTO_CQZC_CZAMOUNT: 'AUTO_CQZC_CZAMOUNT',
    CQZC_SAVE_AND_NEW: 'CQZC_SAVE_AND_NEW',
    GET_CQZC_CARDLIST: 'GET_CQZC_CARDLIST',
    CHANGE_CQZC_PROPERTY_COST: 'CHANGE_CQZC_PROPERTY_COST',
    CHANGE_CQZC_VIEWS: 'CHANGE_CQZC_VIEWS'
}

export { cqzcAccountActions }
