import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const zskxAccountState = fromJS({
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
        runningState: 'STATE_ZS_SQ',//STATE_ZS_TH
        accountName: '',//账户名称
        accountUuid: '',//账户uuid
        paymentList: [],
        jtAmount: 0//勾选的金额
    }
})

// Reducer
export default function reducer(state = zskxAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_ZSKX_CARD_DETAIL]                   : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            const amount = action.data.get('amount')

            return zskxAccountState.mergeIn(['data'], fromJS(action.receivedData))
                        .setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data' ,'runningAbstract'], '暂收款')
                        .setIn(['data', 'accountName'], action.data.get('accountName'))
                        .setIn(['data', 'accountUuid'], action.data.get('accountUuid'))
                        .setIn(['data', 'amount'], amount)
                        .setIn(['views' ,'insertOrModify'], 'insert')

        },
        [ActionTypes.GET_LB_ZSKX_FROM_YLLS]					    : () => {
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
        [ActionTypes.CHANGE_ZSKX_DATA]                          : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_ZSKX_ACCOUNT]                       : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return state.setIn(['data', 'accountName'], arr[1])
                        .setIn(['data', 'accountUuid'], arr[0])
        },
        [ActionTypes.GET_ZSKX_PAYMENTLIST]                      : () => {
            return state.setIn(['data', 'paymentList'], fromJS(action.receivedData))
                        .setIn(['data', 'jtAmount'], 0)
        },
        [ActionTypes.ZSKX_PAYMENTLIST_BESELECT]                 : () => {
            return state.setIn(['data', 'paymentList', action.idx, 'beSelect'], action.value)
        },
        [ActionTypes.AFTER_ZSKX_SAVE]                           : () => {
            if (action.saveAndNew) {
                state = zskxAccountState

            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_YL_ZSKXSTATE]                           : () => {
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
        [ActionTypes.ZSKX_SAVE_AND_NEW]					         : () => {
            const runningDate = state.getIn(['data', 'runningDate'])
            const categoryUuid = state.getIn(['data', 'categoryUuid'])
            const categoryName = state.getIn(['data', 'categoryName'])

            return zskxAccountState.mergeIn(['data'], fromJS(action.receivedData))
                                .setIn(['data', 'runningDate'], runningDate)
                                .setIn(['data' ,'categoryUuid'], categoryUuid)
                                .setIn(['data' ,'categoryName'], categoryName)
                                .setIn(['data' ,'runningAbstract'], '暂收款')
        }

    }[action.type] || (() => state))()
}



// Action Creators
const zskxAccountActions = {
    changeZskxData: (dataType, value) => ({
        type: ActionTypes.CHANGE_ZSKX_DATA,
        dataType,
        value
    }),
    changeAccount: (value) => ({
        type: ActionTypes.CHANGE_ZSKX_ACCOUNT,
        value
    }),
    getZskxPaymentList: () => (dispatch, getState) => {
        const state = getState().zskxAccountState
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
                      type: ActionTypes.GET_ZSKX_PAYMENTLIST,
                      receivedData: json.data.resultList,
                  })
              }
          })
    },
    paymentListBeSelect: (idx, value) => ({
        type: ActionTypes.ZSKX_PAYMENTLIST_BESELECT,
        value,
        idx
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().zskxAccountState
        let data = state.get('data').toJS()
        const runningState = data['runningState']

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
        if (data['accountUuid'] == '') {
            return thirdParty.toast.info('请选择账户')
        }
        if (runningState == 'STATE_ZS_TH') {
            const beSelect = data['paymentList'].some(v => v['beSelect'])
            if (!beSelect) {
                return thirdParty.toast.info('请选择需要处理的流水')
            }
        }

        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (usedProject && runningState == 'STATE_ZS_SQ') {
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
            url = 'insertTemporaryReceipt'
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
                    //dispatch(zskxAccountActions.afterZskxSave(json.data, saveAndNew, isInsert))
                    const categoryUuid = data['categoryUuid']
                    dispatch(zskxAccountActions.getCardDetail(categoryUuid))
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存
                    if (runningState === 'STATE_ZS_TH') {//重新获取流水
                        const uuid = isInsert ? json.data.uuid : data['uuid']
                        dispatch(zskxAccountActions.getYlZskxState(uuid))
                    }
                    dispatch(zskxAccountActions.afterZskxSave(json.data, saveAndNew, isInsert))
                }
            }


        })
    },
    afterZskxSave: (data, saveAndNew, isInsert) => ({
        type: ActionTypes.AFTER_ZSKX_SAVE,
        data,
        saveAndNew,
        isInsert
    }),
    getYlZskxState: (uuid) => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YL_ZSKXSTATE,
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
                    type: ActionTypes.ZSKX_SAVE_AND_NEW,
                    receivedData: jsonData
                })

            }
        })
    }
}

export const ActionTypes = {
    GET_LB_ZSKX_CARD_DETAIL: 'GET_LB_ZSKX_CARD_DETAIL',
    GET_LB_ZSKX_FROM_YLLS: 'GET_LB_ZSKX_FROM_YLLS',
    CHANGE_ZSKX_DATA: 'CHANGE_ZSKX_DATA',
    CHANGE_ZSKX_ACCOUNT: 'CHANGE_ZSKX_ACCOUNT',
    AFTER_ZSKX_SAVE: 'AFTER_ZSKX_SAVE',
    ZSKX_SAVE_AND_NEW: 'ZSKX_SAVE_AND_NEW',
    ZSKX_PAYMENTLIST_BESELECT: 'ZSKX_PAYMENTLIST_BESELECT',
    GET_ZSKX_PAYMENTLIST: 'GET_ZSKX_PAYMENTLIST',
    GET_YL_ZSKXSTATE: 'GET_YL_ZSKXSTATE'
}

export { zskxAccountActions }
