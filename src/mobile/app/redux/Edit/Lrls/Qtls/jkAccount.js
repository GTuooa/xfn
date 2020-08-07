import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const jkAccountState = fromJS({
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
        propertyCost: 'XZ_QDJK',//取得借款 XZ_CHLX--偿还利息  XZ_CHBJ--偿还本金
        runningState: 'STATE_JK_YS',//取得借款-已收 STATE_JK_JTLX-计提利息 STATE_JK_ZFLX--支付利息 STATE_JK_YF--偿还本金 已付
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        paymentList: [],
        jtAmount: 0,//勾选的金额 beAccrued
        acLoan: {
            beAccrued: false//是否计提应付利息
        }
    }
})

// Reducer
export default function reducer(state = jkAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_JK_CARD_DETAIL]                   : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')

            return jkAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data' ,'runningAbstract'], '收到借款')
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['views' ,'insertOrModify'], 'insert')

        },
        [ActionTypes.GET_LB_JK_FROM_YLLS]					    : () => {
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
        [ActionTypes.CHANGE_JK_DATA]                          : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_JK_ACCOUNT]                       : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.CHANGE_JK_PROPERTY_COST]                  : () => {
            let runningState = '', runningAbstract = ''
            ;({
                'XZ_QDJK' : () => {
                    runningState = 'STATE_JK_YS'
                    runningAbstract = '收到借款'
                },
                'XZ_CHLX' : () => {
                    runningState = 'STATE_JK_ZFLX'
                    runningAbstract = '支付借款利息'
                },
                'XZ_CHBJ' : () => {
                    runningState = 'STATE_JK_YF'
                    runningAbstract = '偿还本金支出'
                }
            }[action.value])()

            return state.setIn(['data', 'propertyCost'], action.value)
                        .setIn(['data', 'runningState'], runningState)
                        .setIn(['data', 'runningAbstract'], runningAbstract)
        },
        [ActionTypes.GET_JK_PAYMENTLIST]                      : () => {
            return state.setIn(['data', 'paymentList'], fromJS(action.receivedData))
                        .setIn(['data', 'jtAmount'], 0)
        },
        [ActionTypes.JK_PAYMENTLIST_BESELECT]                 : () => {
            return state.setIn(['data', 'paymentList', action.idx, 'beSelect'], action.value)
        },
        [ActionTypes.AFTER_JK_SAVE]                           : () => {
            if (action.saveAndNew) {
                state = jkAccountState

            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_YL_JKSTATE]                           : () => {
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
        [ActionTypes.JK_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])


            return jkAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data' ,'runningAbstract'], '收到借款')
        }

    }[action.type] || (() => state))()
}



// Action Creators
const jkAccountActions = {
    changeJkData: (dataType, value) => ({
        type: ActionTypes.CHANGE_JK_DATA,
        dataType,
        value
    }),
    changeAccount: (value) => ({
        type: ActionTypes.CHANGE_JK_ACCOUNT,
        value
    }),
    changePropertyCost: (value) => ({
        type: ActionTypes.CHANGE_JK_PROPERTY_COST,
        value
    }),
    getJkPaymentList: () => (dispatch, getState) => {
        const state = getState().jkAccountState
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
                      type: ActionTypes.GET_JK_PAYMENTLIST,
                      receivedData: json.data.resultList,
                  })
              }
          })
    },
    paymentListBeSelect: (idx, value) => ({
        type: ActionTypes.JK_PAYMENTLIST_BESELECT,
        value,
        idx
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().jkAccountState
        let data = state.get('data').toJS()
        const runningState = data['runningState']
        const beAccrued = data['acLoan']['beAccrued']//是否计提应付利息

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
        if (runningState != 'STATE_JK_JTLX' && data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }
        // if (beAccrued && runningState == 'STATE_JK_ZFLX') {
        //     const beSelect = data['paymentList'].some(v => v['beSelect'])
        //     if (!beSelect) {
        //         return thirdParty.toast.info('请选择需要处理的流水')
        //     }
        // }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (usedProject && (runningState == 'STATE_JK_JTLX' || (!beAccrued && runningState == 'STATE_JK_ZFLX'))) {
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
            url = 'insertLoan'
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
                    // dispatch(jkAccountActions.afterJkSave(json.data, saveAndNew, isInsert))
                    const categoryUuid = data['categoryUuid']
                    dispatch(jkAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    if (beAccrued && runningState === 'STATE_JK_ZFLX') {//重新获取流水
                        const uuid = isInsert ? json.data.uuid : data['uuid']
                        dispatch(jkAccountActions.getYlJkState(uuid))
                    }
                    dispatch(jkAccountActions.afterJkSave(json.data, saveAndNew, isInsert))
                }
            }


        })
    },
    afterJkSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_JK_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYlJkState: (uuid) => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YL_JKSTATE,
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
                    type: ActionTypes.JK_SAVE_AND_NEW,
                    receivedData: jsonData
                })

            }
        })
    }
}

export const ActionTypes = {
    GET_LB_JK_CARD_DETAIL: 'GET_LB_JK_CARD_DETAIL',
    GET_LB_JK_FROM_YLLS: 'GET_LB_JK_FROM_YLLS',
    CHANGE_JK_DATA: 'CHANGE_JK_DATA',
    CHANGE_JK_ACCOUNT: 'CHANGE_JK_ACCOUNT',
    AFTER_JK_SAVE: 'AFTER_JK_SAVE',
    JK_SAVE_AND_NEW: 'JK_SAVE_AND_NEW',
    JK_PAYMENTLIST_BESELECT: 'JK_PAYMENTLIST_BESELECT',
    GET_JK_PAYMENTLIST: 'GET_JK_PAYMENTLIST',
    GET_YL_JKSTATE: 'GET_YL_JKSTATE',
    CHANGE_JK_PROPERTY_COST: 'CHANGE_JK_PROPERTY_COST'
}

export { jkAccountActions }
