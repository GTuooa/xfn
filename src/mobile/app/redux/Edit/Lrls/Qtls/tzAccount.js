import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const tzAccountState = fromJS({
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
        propertyCost: 'XZ_DWTZ',//对外投资 XZ_QDSY--取得收益  XZ_SHTZ--收回投资
        runningState: 'STATE_TZ_YF',//对外投资-已付 STATE_TZ_JTGL-计提股利 STATE_TZ_SRGL--收入股利 STATE_TZ_YS--收回投资 已收
        propertyInvest: '',//投资属性 SX_ZQ 债权  SX_GQ 股权
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        paymentList: [],
        jtAmount: 0,//勾选的金额 beAccrued
        acInvest: {
            beAccrued: false//是否计提应付利息
        }
    }
})

// Reducer
export default function reducer(state = tzAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_TZ_CARD_DETAIL]                   : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')

            return tzAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data' ,'runningAbstract'], '对外投资支出')
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['views' ,'insertOrModify'], 'insert')

        },
        [ActionTypes.GET_LB_TZ_FROM_YLLS]					  : () => {
            let jtAmount = 0
            let paymentList = action.state.getIn(['data', 'paymentList']).update(item => item.map(v => {
                let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
				jtAmount += notHandleAmount
                return v.set('notHandleAmount', notHandleAmount)
            }))

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .setIn(['data', 'paymentList'], paymentList)
                        .setIn(['data', 'jtAmount'], jtAmount)
        },
        [ActionTypes.CHANGE_TZ_DATA]                          : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_TZ_ACCOUNT]                       : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.CHANGE_TZ_PROPERTY_COST]                 : () => {
            let runningState = '', runningAbstract = ''
            const propertyInvest = state.getIn(['data', 'propertyInvest'])

            ;({
                'XZ_DWTZ' : () => {
                    runningState = 'STATE_TZ_YF',
                    runningAbstract = '对外投资支出'
                },
                'XZ_QDSY' : () => {
                    if (propertyInvest == 'SX_ZQ' ) {//债券
                        runningState = 'STATE_TZ_SRLX'
                    } else {//股权
                        runningState = 'STATE_TZ_SRGL'
                    }
                    runningAbstract = '收到投资收益'
                },
                'XZ_SHTZ' : () => {
                    runningState = 'STATE_TZ_YS'
                    runningAbstract = '收回投资款'
                }
            }[action.value])()

            return state.setIn(['data', 'propertyCost'], action.value)
                        .setIn(['data', 'runningState'], runningState)
                        .setIn(['data', 'runningAbstract'], runningAbstract)
        },
        [ActionTypes.GET_TZ_PAYMENTLIST]                      : () => {
            return state.setIn(['data', 'paymentList'], fromJS(action.receivedData))
                        .setIn(['data', 'jtAmount'], 0)
        },
        [ActionTypes.TZ_PAYMENTLIST_BESELECT]                 : () => {
            return state.setIn(['data', 'paymentList', action.idx, 'beSelect'], action.value)
        },
        [ActionTypes.AFTER_TZ_SAVE]                           : () => {
            if (action.saveAndNew) {
                state = tzAccountState

            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_YL_TZSTATE]                           : () => {
            let jtAmount = 0
            let paymentList = fromJS(action.receivedData.paymentList).update(item => item.map(v => {
                let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
				jtAmount += notHandleAmount
                return v.set('notHandleAmount', notHandleAmount)
            }))

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .set('data', fromJS(action.receivedData))
                        .setIn(['data', 'paymentList'], paymentList)
                        .setIn(['data', 'jtAmount'], jtAmount)
        },
        [ActionTypes.TZ_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])


            return tzAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data' ,'runningAbstract'], '对外投资支出')
        }

    }[action.type] || (() => state))()
}



// Action Creators
const tzAccountActions = {
    changeTzData: (dataType, value) => ({
        type: ActionTypes.CHANGE_TZ_DATA,
        dataType,
        value
    }),
    changeAccount: (value) => ({
        type: ActionTypes.CHANGE_TZ_ACCOUNT,
        value
    }),
    changePropertyCost: (value) => ({
        type: ActionTypes.CHANGE_TZ_PROPERTY_COST,
        value
    }),
    getTzPaymentList: () => (dispatch, getState) => {
        const state = getState().tzAccountState
        const categoryUuid = state.getIn(['data', 'categoryUuid'])
        const runningDate = state.getIn(['data', 'runningDate'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getPaymentTaxInfo', 'POST', JSON.stringify({
            categoryUuid,
            runningDate,
            acId:'',
            assId1: '',
            assCategory1: '',
            assId2: '',
            assCategory2: ''
          }) , json => {
              thirdParty.toast.hide()
              if (showMessage(json)) {
                  dispatch({
                      type: ActionTypes.GET_TZ_PAYMENTLIST,
                      receivedData: json.data.resultList,
                  })
              }
          })
    },
    paymentListBeSelect: (idx, value) => ({
        type: ActionTypes.TZ_PAYMENTLIST_BESELECT,
        value,
        idx
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().tzAccountState
        let data = state.get('data').toJS()
        const runningState = data['runningState']
        const beAccrued = data['acInvest']['beAccrued']//是否计提应付利息

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
        if ((runningState != 'STATE_TZ_JTGL' && runningState != 'STATE_TZ_JTLX') && data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }
        // if (beAccrued && runningState == 'STATE_TZ_SRGL') {
        //     const beSelect = data['paymentList'].some(v => v['beSelect'])
        //     if (!beSelect) {
        //         return thirdParty.toast.info('请选择需要处理的流水')
        //     }
        // }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (usedProject && ((runningState == 'STATE_TZ_JTGL' || runningState == 'STATE_TZ_JTLX') || (!beAccrued && (runningState == 'STATE_TZ_SRGL' || runningState == 'STATE_TZ_SRLX')))) {
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
                    // dispatch(tzAccountActions.afterTzSave(json.data, saveAndNew, isInsert))
                    const categoryUuid = data['categoryUuid']
                    dispatch(tzAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    if (beAccrued && runningState === 'STATE_TZ_SRGL') {//重新获取流水
                        const uuid = isInsert ? json.data.uuid : data['uuid']
                        dispatch(tzAccountActions.getYlTzState(uuid))
                    }
                    dispatch(tzAccountActions.afterTzSave(json.data, saveAndNew, isInsert))
                }
            }


        })
    },
    afterTzSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_TZ_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYlTzState: (uuid) => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YL_TZSTATE,
                    receivedData: json.data.result
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
                    type: ActionTypes.TZ_SAVE_AND_NEW,
                    receivedData: jsonData
                })

            }
        })
    }
}

export const ActionTypes = {
    GET_LB_TZ_CARD_DETAIL: 'GET_LB_TZ_CARD_DETAIL',
    GET_LB_TZ_FROM_YLLS: 'GET_LB_TZ_FROM_YLLS',
    CHANGE_TZ_DATA: 'CHANGE_TZ_DATA',
    CHANGE_TZ_ACCOUNT: 'CHANGE_TZ_ACCOUNT',
    AFTER_TZ_SAVE: 'AFTER_TZ_SAVE',
    TZ_SAVE_AND_NEW: 'TZ_SAVE_AND_NEW',
    TZ_PAYMENTLIST_BESELECT: 'TZ_PAYMENTLIST_BESELECT',
    GET_TZ_PAYMENTLIST: 'GET_TZ_PAYMENTLIST',
    GET_YL_TZSTATE: 'GET_YL_TZSTATE',
    CHANGE_TZ_PROPERTY_COST: 'CHANGE_TZ_PROPERTY_COST'
}

export { tzAccountActions }
