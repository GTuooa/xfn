import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const jzcbAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_JZCB',//十四大类的一种
        lsCategoryName: '货物成本结转',
        categoryName: '请选择流水类别',//流水列表的类别
        categoryUuid: '',//流水列表的uuid
        runningDate: '',//日期
        runningAbstract: '销售存货结转成本',//摘要
        runningState: 'STATE_YYSR_XS',
        carryoverBusinessUuid: '',
        totalAmount: '',
        stockCardRange: [{}]
    },
    hxList: [],
    stockCardList: [],
    yysrCategory: []
})

// Reducer
export default function reducer(state = jzcbAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_JZCB_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return jzcbAccountState.setIn(['data' ,'categoryUuid'], arr[0])
                                    .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                                    .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_JZCB_FROM_YLLS]					: () => {
            let totalAmount = 0
            let hxList = action.state.getIn(['data', 'businessList']).update(v => v.map(item => {
                totalAmount += item.get('amount')
                return item.set('isCheck', true)
            }))
            const runningType = action.state.getIn(['data', 'runningType'])
            const runningState = runningType == 'LX_JZCB' ? 'STATE_YYSR_XS' : 'STATE_YYSR_TS'
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('hxList', hxList)
                        .setIn(['data', 'totalAmount'], totalAmount)
                        .setIn(['data', 'lsCategoryName'], '货物成本结转')
                        .setIn(['data', 'runningState'], runningState)
                        .setIn(['data', 'runningDate'], action.state.getIn(['data', 'runningDate']))
                        .setIn(['data', 'runningAbstract'], action.state.getIn(['data', 'runningAbstract']))
                        .setIn(['data', 'stockCardRange'], action.state.getIn(['data', 'acBusinessIncome', 'stockCardList']))
                        .setIn(['data', 'carryoverBusinessUuid'], action.state.getIn(['data', 'uuid']))
        },
        [ActionTypes.CHANGE_JZCB_RUNNING_STATE]					: () => {
            const runningAbstract = action.key == 'STATE_YYSR_XS' ? '销售存货结转成本' : '销货退回结转成本'
            return state.setIn(['data' ,'runningState'], action.key)
                        .setIn(['data' ,'runningAbstract'], runningAbstract)
        },
        [ActionTypes.CHANGE_JZCB_DATA]					     : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.GET_JZCB_LIST]				             : () => {
            return state = state.set('hxList', fromJS(action.receivedData))
        },
        [ActionTypes.JZCB_HXLIST_BECHECK]					 : () => {
            state = state.setIn(['hxList', action.idx, 'isCheck'], action.value)

            if (!action.value) {//变为未选中
                const stockCardRange = state.getIn(['data', 'stockCardRange'])
                const hxList = state.get('hxList')

                stockCardRange.forEach((v, i)=> {
                    let hasChecked = false
                    hxList.forEach(w => {
                        if (w.get('isCheck') && (w.get('stockCardUuid') == v.get('uuid'))) {
                            hasChecked = true
                        }
                    })

                    if (!hasChecked) {//该卡片没有选中的单据
                        state = state.setIn(['data', 'stockCardRange', action.idx, 'amount'], '')
                    }

                })
            }

            return state
        },
        [ActionTypes.JZCB_HXLIST_BEALLCHECK]				 : () => {
            return state.update('hxList', item => item.map(v => v.set('isCheck', action.value)))
        },
        [ActionTypes.AFTER_JZCB_SAVE]                        : () => {
            if (action.saveAndNew) {
                const runningDate = state.getIn(['data', 'runningDate'])
                state = jzcbAccountState.setIn(['data', 'runningDate'], runningDate)

            } else {
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'carryoverBusinessUuid'], action.data.result)
            }

            return state
        },
        [ActionTypes.GET_JZCB_CARDLIST]					     : () => {
            let cardList = []
            action.receivedData.forEach(v => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })

            return state.set('stockCardList', fromJS(cardList))
                        .set('hxList', fromJS([]))
                        .setIn(['data', 'stockCardRange'], fromJS([{}]))

        },
        [ActionTypes.CHANGE_JZCB_CARD]					      : () => {
            switch (action.dataType) {
                case 'card' : {
                    const arr = action.value.split(Limit.TREE_JOIN_STR)
                    state = state.setIn(['data', 'stockCardRange', action.idx], fromJS({uuid: arr[0], code: arr[1], name: arr[2], amount: ''}))
                    break
                }
                case 'amount' : {
                    state = state.setIn(['data', 'stockCardRange', action.idx, 'amount'], action.value)
                    break
                }
                case 'add' : {
                    state = state.setIn(['data', 'stockCardRange', action.idx], fromJS({amount: ''}))
                    break
                }
                case 'delete' : {
                    state = state.deleteIn(['data', 'stockCardRange', action.idx])
                    break
                }
            }
            return state

        },

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_JZCB_CARD_DETAIL: 'GET_LB_JZCB_CARD_DETAIL',
    GET_LB_JZCB_FROM_YLLS: 'GET_LB_JZCB_FROM_YLLS',
    CHANGE_JZCB_RUNNING_STATE: 'CHANGE_JZCB_RUNNING_STATE',
    CHANGE_JZCB_DATA: 'CHANGE_JZCB_DATA',
    AFTER_JZCB_SAVE: 'AFTER_JZCB_SAVE',
    GET_JZCB_LIST: 'GET_JZCB_LIST',
    JZCB_HXLIST_BECHECK: 'JZCB_HXLIST_BECHECK',
    JZCB_HXLIST_BEALLCHECK: 'JZCB_HXLIST_BEALLCHECK',
    GET_JZCB_CARDLIST: 'GET_JZCB_CARDLIST',
    CHANGE_JZCB_CARD: 'CHANGE_JZCB_CARD'
}

// Action
const jzcbAccountActions = {
    changeJzcbRunningState: (key) => ({
        type: ActionTypes.CHANGE_JZCB_RUNNING_STATE,
        key
    }),
    changeJzcbData: (dataType, value) => ({
        type: ActionTypes.CHANGE_JZCB_DATA,
        dataType,
        value
    }),
    getJzcbCardList: () => (dispatch, getState) => {
        const state = getState().jzcbAccountState
        const data = state.get('data')
        const runningDate = data.get('runningDate')
        const runningState = data.get('runningState')
        // const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo', 'sobId'])

        if (runningDate && runningState) {
            thirdParty.toast.loading('加载中...', 0)
            fetchApi('getCostStock', 'POST', JSON.stringify({
                runningDate,
                runningState
                // sobId
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_JZCB_CARDLIST,
                        receivedData: json.data.result
                    })
                }
            })
        }

    },
    changeJzcbCard: (dataType, value, idx) => ({
        type: ActionTypes.CHANGE_JZCB_CARD,
        dataType,
        value,
        idx
    }),
    getJzcbList: () => (dispatch, getState) => {
        const state = getState().jzcbAccountState
        const data = state.get('data')
        const runningDate = data.get('runningDate')
        const runningState = data.get('runningState')
        const cardUuidList = data.get('stockCardRange').map(v => v.get('uuid'))
        if (runningDate && runningState) {
            thirdParty.toast.loading('加载中...', 0)
            fetchApi('getCarryoverList', 'POST', JSON.stringify({
                runningDate,
                runningState,
                cardUuidList
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_JZCB_LIST,
                        receivedData: json.data.result
                    })
                }
            })
        }

    },
    jzcbHxListBeCheck: (idx, value) => ({
        type: ActionTypes.JZCB_HXLIST_BECHECK,
        idx,
        value
    }),
    jzcbHxListBeAllCheck: (value) => ({
        type: ActionTypes.JZCB_HXLIST_BEALLCHECK,
        value
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().jzcbAccountState
        const url = state.getIn(['views', 'insertOrModify']) === 'insert' ? 'insertCarryoverItem' : 'modifyCarryoverItem'
        const data = state.get('data').toJS()

        let uuidList = []
        let hasChecked = false//未选择核算列表
        const hxList = state.get('hxList')
        hxList.forEach(v => {
            if (v.get('isCheck')) {
                hasChecked = true
                uuidList.push(v.get('uuid'))
            }
        })

        //校验
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (!hasChecked) {
            return thirdParty.toast.info('请选择需要核算的列表')
        }

        let uuidArr = [], hasEmptyAmount = false, cardList = []
        const stockCardRange = data['stockCardRange']
        const hasEmpty = stockCardRange.every((v,i) => {
            uuidArr.push(v['uuid'])
            if (v['amount'] <= 0) {
                hasEmptyAmount = true
            } else {
                cardList.push({
                    uuid: v['uuid'],
                    amount: v['amount']
                })
            }
            return v['uuid']
        })
        if (!hasEmpty) {
            return thirdParty.toast.info('有未选择的存货卡片')
        }
        if (hasEmptyAmount) {
            return thirdParty.toast.info('有未填写的成本金额')
        }
        let newArr = [...new Set(uuidArr)]
        if (newArr.length < uuidArr.length) {
            return thirdParty.toast.info('有重复的存货卡片')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            uuidList,
            cardList,
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch(jzcbAccountActions.afterJzcbSave(json.data, saveAndNew))
                if (saveAndNew) { //保存并新增
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                }
            }
        })
    },
    afterJzcbSave: (data, saveAndNew) => ({
        type: ActionTypes.AFTER_JZCB_SAVE,
        data,
        saveAndNew
    }),
}

export { jzcbAccountActions }
