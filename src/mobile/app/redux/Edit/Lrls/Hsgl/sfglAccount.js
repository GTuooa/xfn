import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'

const sfglAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_SFGL',//十四大类的一种
        categoryName: '收付管理',//选中类别的name
        categoryUuid: '',
        runningDate: '',//日期
        runningAbstract: '核销账款',//摘要
        amount: '',//付款金额
        flowNumber: '',
        accountName: '',//账户
        accountUuid: '',
        uuid: '',//保存后的uuid
        contactsCardRange: null,
        cardUuid: '',//往来单位uuid
        totalAmount: '',//待核销收款金额
        beMoed: false,//抹零
        moedAmount: ''//抹零金额
    },
    cardList: [],//往来单位列表
    manageList: {//核算列表
        childList: []
    }
})

// Reducer
export default function reducer(state = sfglAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_SFGL_CARD_DETAIL]                       : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return sfglAccountState.setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data', 'amount'], action.data.get('amount'))
                        .setIn(['views' ,'insertOrModify'], 'insert')

        },
        [ActionTypes.GET_LB_SFGL_FROM_YLLS]					         : () => {
            let totalAmount = 0
            let manageList = action.state.getIn(['data', 'detail']).update(item => item.map(v => {
                let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
                const flowType = v.get('flowType')
				const direction = v.get('direction')
                const runningState = v.get('runningState')
				if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') {
					notHandleAmount = -Math.abs(notHandleAmount)
				}
				if (flowType == 'FLOW_INADVANCE') {
					if (direction=='credit') {
						totalAmount += notHandleAmount
					} else {
						totalAmount -= notHandleAmount
					}
				} else {
					if (direction=='credit') {
						totalAmount -= notHandleAmount
					} else {
						totalAmount += notHandleAmount
					}
				}
                return v = v.set('isCheck', true).set('notHandleAmount', Math.abs(notHandleAmount))
            }))

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .setIn(['data', 'flowNumber'], action.state.getIn(['data', 'flowNumber']))
                        .setIn(['data', 'uuid'], action.state.getIn(['data', 'uuid']))
                        .setIn(['data', 'categoryUuid'], action.state.getIn(['data', 'categoryUuid']))
                        .setIn(['data', 'accountName'], action.state.getIn(['data', 'accountName']))
                        .setIn(['data', 'accountUuid'], action.state.getIn(['data', 'accountUuid']))
                        .setIn(['data', 'runningDate'], action.state.getIn(['data', 'runningDate']))
                        .setIn(['data', 'runningAbstract'], action.state.getIn(['data', 'runningAbstract']))
                        .setIn(['data', 'amount'], action.state.getIn(['data', 'amount']))
                        .setIn(['data', 'totalAmount'], totalAmount)
                        .setIn(['data', 'contactsCardRange'], action.state.getIn(['data', 'usedCard']))
                        .setIn(['data', 'cardUuid'], action.state.getIn(['data', 'usedCard', 'uuid']))
                        .setIn(['data', 'beMoed'], action.state.getIn(['data', 'beMoed']))
                        .setIn(['data', 'moedAmount'], action.state.getIn(['data', 'moedAmount']))
                        .setIn(['manageList', 'childList'], manageList)
                        .set('cardList', fromJS([]))
        },
        [ActionTypes.CHANGE_SFGL_DATA]					            : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_SFGL_ACCOUNT]                           : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.AFTER_SFGL_SAVE]                               : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])

            return sfglAccountState.setIn(['data', 'runningDate'], runningDate)
                                    .setIn(['data' ,'categoryUuid'], categoryUuid)
                                    .setIn(['data' ,'categoryName'], categoryName)
        },
        [ActionTypes.GET_YL_SFGLSTATE]                              : () => {
            let totalAmount = 0
            let manageList = fromJS(action.receivedData.detail).update(item => item.map(v => {
                let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
                const flowType = v.get('flowType')
				const direction = v.get('direction')
                const runningState = v.get('runningState')
				if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') {
					notHandleAmount = -Math.abs(notHandleAmount)
				}
				if (flowType == 'FLOW_INADVANCE') {
					if (direction=='credit') {
						totalAmount += notHandleAmount
					} else {
						totalAmount -= notHandleAmount
					}
				} else {
					if (direction=='credit') {
						totalAmount -= notHandleAmount
					} else {
						totalAmount += notHandleAmount
					}
				}
                return v = v.set('isCheck', true).set('notHandleAmount', Math.abs(notHandleAmount))
            }))

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['data', 'flowNumber'], action.receivedData.flowNumber)
                        .setIn(['data', 'uuid'], action.receivedData.uuid)
                        .setIn(['data', 'categoryUuid'], action.receivedData.categoryUuid)
                        .setIn(['data', 'accountName'], action.receivedData.accountName)
                        .setIn(['data', 'accountUuid'], action.receivedData.accountUuid)
                        .setIn(['data', 'runningDate'], action.receivedData.runningDate)
                        .setIn(['data', 'runningAbstract'], action.receivedData.runningAbstract)
                        .setIn(['data', 'amount'], action.receivedData.amount)
                        .setIn(['data', 'totalAmount'], totalAmount)
                        .setIn(['data', 'contactsCardRange'], fromJS(action.receivedData.usedCard))
                        .set(['data', 'cardUuid'], action.receivedData.usedCard.uuid)
                        .setIn(['data', 'beMoed'], action.receivedData.beMoed)
                        .setIn(['data', 'moedAmount'], action.receivedData.moedAmount)
                        .setIn(['manageList', 'childList'], manageList)
                        .set('cardList', fromJS([]))
        },
        [ActionTypes.GET_SFGL_CARDLIST]					            : () => {
            let cardList = []
            action.data.forEach(v => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })

            return state.set('cardList', fromJS(cardList))
                        .setIn(['data', 'contactsCardRange'], null)
                        .set('manageList', fromJS({childList: []}))
                        .set(['data', 'cardUuid'], '')
        },
        [ActionTypes.CHANGE_SFGL_CARD]					            : () => {
            const arr = action.card.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.uuid = arr[0]
            item.code = arr[1]
            item.name = arr[2]

            return state.setIn(['data', 'contactsCardRange'], fromJS(item))
                        .set('manageList', fromJS(action.data))
                        .setIn(['data', 'cardUuid'], arr[0])
        },
        [ActionTypes.SFGL_MANAGELIST_CHECKDED]					    : () => {
            return state.setIn(['manageList', 'childList', action.idx, 'isCheck'], action.value)
        },
        [ActionTypes.GET_SFGL_CATEGORYLIST]					        : () => {
            let categoryList = []
            action.data.forEach(v => {
                categoryList.push({
                    key: `${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })
            return state.setIn(['manageList', 'childList', action.idx, 'categoryList'], fromJS(categoryList))
        },
        [ActionTypes.SFGL_MANAGELIST_CATETORY]					    : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['manageList', 'childList', action.idx, 'categoryName'], arr[1])
                        .setIn(['manageList', 'childList', action.idx, 'categoryUuid'], arr[0])
        },
        [ActionTypes.SFGL_MANAGELIST_ALLCHECK]					    : () => {
            return state.updateIn(['manageList', 'childList'], item => item.map(v => v.set('isCheck', action.value)))
        }

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_SFGL_CARD_DETAIL: 'GET_LB_SFGL_CARD_DETAIL',
    GET_LB_SFGL_FROM_YLLS: 'GET_LB_SFGL_FROM_YLLS',
    CHANGE_SFGL_DATA: 'CHANGE_SFGL_DATA',
    CHANGE_SFGL_ACCOUNT: 'CHANGE_SFGL_ACCOUNT',
    AFTER_SFGL_SAVE: 'AFTER_SFGL_SAVE',
    GET_SFGL_CARDLIST: 'GET_SFGL_CARDLIST',
    CHANGE_SFGL_CARD: 'CHANGE_SFGL_CARD',
    SFGL_MANAGELIST_CHECKDED: 'SFGL_MANAGELIST_CHECKDED',
    GET_SFGL_CATEGORYLIST: 'GET_SFGL_CATEGORYLIST',
    SFGL_MANAGELIST_CATETORY: 'SFGL_MANAGELIST_CATETORY',
    SFGL_MANAGELIST_ALLCHECK: 'SFGL_MANAGELIST_ALLCHECK',
    GET_YL_SFGLSTATE: 'GET_YL_SFGLSTATE'
}

// Action
const sfglAccountActions = {
    changeSfglData: (dataType, value) => ({
        type: ActionTypes.CHANGE_SFGL_DATA,
        dataType,
        value
    }),
    changeSfglAccount: (value) => ({
        type: ActionTypes.CHANGE_SFGL_ACCOUNT,
        value
    }),
    getSfglCardList: (runningDate) => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getBusinessManagerCardList', 'POST', JSON.stringify({
            runningDate
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_SFGL_CARDLIST,
                    data: json.data.cardList
                })
            }
        })
    },
    changeSfglCard: (card, cardType, runningDate) => (dispatch) => {
        const arr = card.split(Limit.TREE_JOIN_STR)
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getManageList', 'POST', JSON.stringify({
            runningDate,
            cardUuid: arr[0],
            isCheck: false
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.CHANGE_SFGL_CARD,
                    card,
                    data: json.data.result
                })
            }
        })
    },
    manageListCheckded: (idx, value) => ({
        type: ActionTypes.SFGL_MANAGELIST_CHECKDED,
        idx,
        value
    }),
    getSfglCategoryList: (idx, assType) => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getManagerCategoryList', 'POST', JSON.stringify({
            assType
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_SFGL_CATEGORYLIST,
                    idx,
                    data: json.data
                })
            }
        })
    },
    sfglManageListCatetory: (idx, value) => ({
        type: ActionTypes.SFGL_MANAGELIST_CATETORY,
        idx,
        value
    }),
    manageListAllCheck: (value) => ({
        type: ActionTypes.SFGL_MANAGELIST_ALLCHECK,
        value
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const state = getState().sfglAccountState
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const isInsert = state.getIn(['views', 'insertOrModify']) === 'insert' ? true : false
        let url = 'modifyRunningpayment'
        if (isInsert) {
            url = 'insertRunningpayment'
        }

        let uuidList = []
        let hasChecked = false//未选择核算列表
        let selectCategory = false//有期初未选择类别
        const manageList = state.getIn(['manageList', 'childList'])
        manageList.forEach(v => {
            if (v.get('isCheck')) {
                hasChecked = true
                if (v.get('beOpened')) {
                    if (v.get('categoryUuid')==undefined || v.get('categoryUuid').length==0) {
                        selectCategory = true//未选择类别
                    }
                    uuidList.push({
                        beOpened: true,
                        categoryUuid: v.get('categoryUuid'),
                        uuid: v.get('uuid'),
                        assType: v.get('assType')
                    })
                } else {
                    uuidList.push({
                        uuid: v.get('uuid'),
                        assType: v.get('assType')
                    })
                }
            }
        })

        let data = state.get('data').toJS()
        let amount = Math.abs(data['amount'])
        let totalAmount = Math.abs(data['totalAmount'])
        let beMoed = data['beMoed']
        let moedAmount = beMoed ? Number(data['moedAmount']) : 0

        //校验
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (!data['cardUuid']) {
            return thirdParty.toast.info('请选择往来单位')
        }

        if (amount + moedAmount > totalAmount) {
            return thirdParty.toast.info('收付金额大于您所有业务的所有未处理金额')
        }
        if (amount + moedAmount == 0) {
            return thirdParty.toast.info('请填写金额')
        }
        if (amount > 0 && data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }

        if (!hasChecked) {
            return thirdParty.toast.info('请选择需要核算的列表')
        }
        if (selectCategory) {
            return thirdParty.toast.info('请选择需要核算的列表的类别')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            amount,
            uuidList,
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                thirdParty.toast.success('保存成功', 2)
                if (saveAndNew) { //保存并新增
                    const runningDate = data['runningDate']
                    dispatch(sfglAccountActions.afterSfglSave())
                    dispatch(sfglAccountActions.getSfglCardList(runningDate))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    const uuid = isInsert ? json.data : data['uuid']
                    dispatch(sfglAccountActions.getYlSfglState(uuid))
                }
            }
        })
    },
    afterSfglSave: () => ({
        type: ActionTypes.AFTER_SFGL_SAVE
    }),
    getYlSfglState: (uuid) => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YL_SFGLSTATE,
                    receivedData: json.data.result
                })
                json.data.result.detail.forEach((v,i) => {
                    if (v['beOpened']) {
                        dispatch(sfglAccountActions.getSfglCategoryList(i, v['assType']))
                    }
                })
            }
        })
    }
}

export { sfglAccountActions }
