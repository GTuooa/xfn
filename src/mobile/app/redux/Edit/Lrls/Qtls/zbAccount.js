import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const zbAccountState = fromJS({
    views: {
        insertOrModify: 'insert',//流水是保存还是新增
        fromYl: true
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
        propertyCost: 'XZ_ZZ',//增资 XZ_LRFP--利润分配  XZ_JZ--收回投资
        runningState: 'STATE_ZB_ZZ',//增资 STATE_ZB_LRFP-利润分配 STATE_ZB_ZFLR--支付利润 STATE_ZB_JZ--减资
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        paymentList: [],
        jtAmount: 0,//勾选的金额 beAccrued
        acCapital: {
            beAccrued: false//是否计提应付利息
        }
    }
})

// Reducer
export default function reducer(state = zbAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_ZB_CARD_DETAIL]                   : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')

            return zbAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data' ,'runningAbstract'], '增加注册资本')
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['views' ,'insertOrModify'], 'insert')

        },
        [ActionTypes.GET_LB_ZB_FROM_YLLS]					  : () => {
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
        [ActionTypes.CHANGE_ZB_DATA]                          : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_ZB_ACCOUNT]                       : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.CHANGE_ZB_PROPERTY_COST]                 : () => {
            let runningState = '', runningAbstract = ''
            ;({
                'XZ_ZZ' : () => {
                    runningState = 'STATE_ZB_ZZ'
                    runningAbstract = '增加注册资本'
                },
                'XZ_LRFP' : () => {
                    runningState = 'STATE_ZB_ZFLR'
                    runningAbstract = '支付分配利润'
                },
                'XZ_JZ' : () => {
                    runningState = 'STATE_ZB_JZ'
                    runningAbstract = '减少注册资本'
                }
            }[action.value])()

            return state.setIn(['data', 'propertyCost'], action.value)
                        .setIn(['data', 'runningState'], runningState)
                        .setIn(['data', 'runningAbstract'], runningAbstract)
        },
        [ActionTypes.GET_ZB_PAYMENTLIST]                      : () => {
            return state.setIn(['data', 'paymentList'], fromJS(action.receivedData))
                        .setIn(['data', 'jtAmount'], 0)
        },
        [ActionTypes.ZB_PAYMENTLIST_BESELECT]                 : () => {
            return state.setIn(['data', 'paymentList', action.idx, 'beSelect'], action.value)
        },
        [ActionTypes.AFTER_ZB_SAVE]                           : () => {
            if (action.saveAndNew) {
                state = zbAccountState

            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_YL_ZBSTATE]                           : () => {
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
        [ActionTypes.ZB_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])

            return zbAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data' ,'runningAbstract'], '增加注册资本')
        }

    }[action.type] || (() => state))()
}



// Action Creators
const zbAccountActions = {
    changeZbData: (dataType, value) => ({
        type: ActionTypes.CHANGE_ZB_DATA,
        dataType,
        value
    }),
    changeAccount: (value) => ({
        type: ActionTypes.CHANGE_ZB_ACCOUNT,
        value
    }),
    changePropertyCost: (value) => ({
        type: ActionTypes.CHANGE_ZB_PROPERTY_COST,
        value
    }),
    getZbPaymentList: () => (dispatch, getState) => {
        const state = getState().zbAccountState
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
                      type: ActionTypes.GET_ZB_PAYMENTLIST,
                      receivedData: json.data.resultList
                  })
              }
          })
    },
    paymentListBeSelect: (idx, value) => ({
        type: ActionTypes.ZB_PAYMENTLIST_BESELECT,
        value,
        idx
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().zbAccountState
        let data = state.get('data').toJS()
        const runningState = data['runningState']
        const beAccrued = data['acCapital']['beAccrued']//是否计提应付利息

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
        if (runningState != 'STATE_ZB_LRFP' && data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }
        if (beAccrued && runningState == 'STATE_ZB_ZFLR') {
            const beSelect = data['paymentList'].some(v => v['beSelect'])
            if (!beSelect) {
                return thirdParty.toast.info('请选择需要处理的流水')
            }
        }

        let url = 'modifyRunningbusiness'
        const isInsert = state.getIn(['views', 'insertOrModify']) === 'insert' ? true : false
        if (isInsert) {
            delete data['uuid']//insert时不传uuid
            delete data['parentUuid']
            url = 'insertCapital'
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (json.code !== 0) {
                thirdParty.toast.fail(`${json.code} ${json.message}`)
            } else {
                thirdParty.toast.success('保存成功', 2)
                if (saveAndNew) { //保存并新增
                    //dispatch(zbAccountActions.afterZbSave(json.data, saveAndNew, isInsert))
                    const categoryUuid = data['categoryUuid']
                    dispatch(zbAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    if (beAccrued && runningState === 'STATE_ZB_ZFLR') {//重新获取流水
                        const uuid = isInsert ? json.data.uuid : data['uuid']
                        dispatch(zbAccountActions.getYlZbState(uuid))
                    }
                    dispatch(zbAccountActions.afterZbSave(json.data, saveAndNew, isInsert))
                }
            }


        })
    },
    afterZbSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_ZB_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYlZbState: (uuid) => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YL_ZBSTATE,
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
                    type: ActionTypes.ZB_SAVE_AND_NEW,
                    receivedData: jsonData
                })

            }
        })
    }
}

export const ActionTypes = {
    GET_LB_ZB_CARD_DETAIL: 'GET_LB_ZB_CARD_DETAIL',
    GET_LB_ZB_FROM_YLLS: 'GET_LB_ZB_FROM_YLLS',
    CHANGE_ZB_DATA: 'CHANGE_ZB_DATA',
    CHANGE_ZB_ACCOUNT: 'CHANGE_ZB_ACCOUNT',
    AFTER_ZB_SAVE: 'AFTER_ZB_SAVE',
    ZB_SAVE_AND_NEW: 'ZB_SAVE_AND_NEW',
    ZB_PAYMENTLIST_BESELECT: 'ZB_PAYMENTLIST_BESELECT',
    GET_ZB_PAYMENTLIST: 'GET_ZB_PAYMENTLIST',
    GET_YL_ZBSTATE: 'GET_YL_ZBSTATE',
    CHANGE_ZB_PROPERTY_COST: 'CHANGE_ZB_PROPERTY_COST'
}

export { zbAccountActions }
