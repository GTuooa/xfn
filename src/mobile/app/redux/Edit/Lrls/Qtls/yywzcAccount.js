import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const yywzcAccountState = fromJS({
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
        runningState: 'STATE_YYWZC_YF',//STATE_YYWZC_WF
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        // 营业收入
        "acBusinessOutExpense": {
            "beManagemented": false,  // 是否收付管理
            "contactsRange": [],
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
export default function reducer(state = yywzcAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_YYWZC_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')

            return yywzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data' ,'runningAbstract'], arr[1])
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['views' ,'insertOrModify'], 'insert')

        },
        [ActionTypes.GET_LB_YYWZC_FROM_YLLS]					: () => {
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
        },
        [ActionTypes.CHANGE_YYWZC_DATA]					: () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_YYWZC_CARD]					         : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.uuid = arr[0]
            item.code = arr[1]
            item.name = arr[2]

            return state.setIn(['data','acBusinessOutExpense', action.acType], fromJS(item))
        },
        [ActionTypes.CHANGE_YYWZC_ACCOUNT]			     : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.AFTER_YYWZC_SAVE]                : () => {
            if (action.saveAndNew) {
                state = yywzcAccountState

            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_YYWZC_CARDLIST]					         : () => {
            let cardList = []
            action.data.forEach(v => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })
            return state.set('contactsCardList', fromJS(cardList))
        },
        [ActionTypes.YYWZC_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])

            return yywzcAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data' ,'runningAbstract'], categoryName)
        }

    }[action.type] || (() => state))()
}



// Action Creators
const yywzcAccountActions = {
    changeYywzcData: (dataType, value) => ({
        type: ActionTypes.CHANGE_YYWZC_DATA,
        dataType,
        value
    }),
    changeYywzcCard: (value, acType) => ({
        type: ActionTypes.CHANGE_YYWZC_CARD,
        value,
        acType
    }),
    changeAccount: (value) => ({
        type: ActionTypes.CHANGE_YYWZC_ACCOUNT,
        value
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().yywzcAccountState
        let data = state.get('data').toJS()
        const runningState = data['runningState']
        const beManagemented = data['acBusinessOutExpense']['beManagemented']//收付管理

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
            const contactsCardRange = data['acBusinessOutExpense']['contactsCardRange']
            if (!contactsCardRange || contactsCardRange['uuid'] == '') {
                return thirdParty.toast.info('请选择往来单位')
            }
        }
        if (runningState === 'STATE_YYWZC_YF' && data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (usedProject) {
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
            url = 'insertOutExpense'
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
                    const categoryUuid = data['categoryUuid']
                    dispatch(yywzcAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    dispatch(yywzcAccountActions.afterYywzcSave(json.data, saveAndNew, isInsert))
                }
            }


        })
    },
    afterYywzcSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_YYWZC_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYywzcCardList: (cardType)=> (dispatch, getState) => {
        //contactsRange
        const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])
        const state = getState().yywzcAccountState
        const categoryList = state.getIn(['data', 'acBusinessOutExpense', cardType])
        //let property = ''// NEEDIN应收 PREIN预收 NEEDPAY应付 PREPAY预付  1：原材料，2：半成品，3：库存商品，4：易耗品  空则查全部

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getCurrentCardList', 'POST', JSON.stringify({
            sobId,
            property: 'NEEDPAY',
            categoryList
        }),json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YYWZC_CARDLIST,
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
                    type: ActionTypes.YYWZC_SAVE_AND_NEW,
                    receivedData: jsonData
                })

                const beManagemented = jsonData['acBusinessOutExpense']['beManagemented']//收付管理
                if (beManagemented) {
                    dispatch(yywzcAccountActions.getYywzcCardList('contactsRange'))
                }

            }
        })
    }

}

export const ActionTypes = {
    GET_LB_YYWZC_CARD_DETAIL: 'GET_LB_YYWZC_CARD_DETAIL',
    GET_LB_YYWZC_FROM_YLLS: 'GET_LB_YYWZC_FROM_YLLS',
    CHANGE_YYWZC_DATA: 'CHANGE_YYWZC_DATA',
    CHANGE_YYWZC_ACCOUNT: 'CHANGE_YYWZC_ACCOUNT',
    CHANGE_YYWZC_CARD: 'CHANGE_YYWZC_CARD',
    AFTER_YYWZC_SAVE: 'AFTER_YYWZC_SAVE',
    YYWZC_SAVE_AND_NEW: 'YYWZC_SAVE_AND_NEW',
    GET_YYWZC_CARDLIST: 'GET_YYWZC_CARDLIST'
}

export { yywzcAccountActions }
