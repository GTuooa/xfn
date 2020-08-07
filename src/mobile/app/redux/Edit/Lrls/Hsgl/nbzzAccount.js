import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'

const nbzzAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_ZZ',//十四大类的一种
        categoryName: '内部转账',//选中类别的name
        categoryUuid: '',
        amount: '',
        runningDate: '',//日期
        runningAbstract: '内部转账',//摘要
        runningState: 'STATE_ZZ',
        fromAccountName: '',//转出账户
        fromAccountUuid: '',
        toAccountName: '',//转入账户
        toAccountUuid: '',
        flowNumber: '',
        uuid: ''
    }
})

// Reducer
export default function reducer(state = nbzzAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_ZZ_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return nbzzAccountState.setIn(['data' ,'categoryUuid'], arr[0])
                        .setIn(['data' ,'categoryName'], arr[1])
                        .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                        .setIn(['data', 'amount'], action.data.get('amount'))
                        .setIn(['views' ,'insertOrModify'], 'insert')

        },
        [ActionTypes.GET_LB_ZZ_FROM_YLLS]					: () => {
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .setIn(['data', 'fromAccountName'], action.state.getIn(['data', 'childList', 0, 'accountName']))
                        .setIn(['data', 'fromAccountUuid'], action.state.getIn(['data', 'childList', 0, 'accountUuid']))
                        .setIn(['data', 'toAccountName'], action.state.getIn(['data', 'childList', 1, 'accountName']))
                        .setIn(['data', 'toAccountUuid'], action.state.getIn(['data', 'childList', 1, 'accountUuid']))

        },
        [ActionTypes.CHANGE_NBZZ_DATA]					   : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.CHANGE_NBZZ_ACCOUNT]			       : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            if (action.accountType==='fromAccount') {
                state = state.setIn(['data', 'fromAccountName'], arr[1])
                            .setIn(['data', 'fromAccountUuid'], arr[0])
            } else {
                state = state.setIn(['data', 'toAccountName'], arr[1])
                            .setIn(['data', 'toAccountUuid'], arr[0])
            }
            return state
        },
        [ActionTypes.AFTER_NBZZ_SAVE]                : () => {
            if (action.saveAndNew) {
                const runningDate = state.getIn(['data', 'runningDate'])
                const categoryUuid = state.getIn(['data', 'categoryUuid'])
                const categoryName = state.getIn(['data', 'categoryName'])

                state = nbzzAccountState.setIn(['data', 'runningDate'], runningDate)
                                        .setIn(['data' ,'categoryUuid'], categoryUuid)
                                        .setIn(['data' ,'categoryName'], categoryName)
            } else {
                if (action.isInsert) {
                    state = state.setIn(['data', 'uuid'], action.data.uuid)
                }
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
            }
            return state
        },
        [ActionTypes.GET_YL_NBZZSTATE]               : () => {

            return  state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['data', 'uuid'], action.receivedData.uuid)
                        .setIn(['data', 'flowNumber'], action.receivedData.flowNumber)
                        .setIn(['data', 'categoryUuid'], action.receivedData.categoryUuid)
                        .setIn(['data', 'runningDate'], action.receivedData.runningDate)
                        .setIn(['data', 'runningAbstract'], action.receivedData.runningAbstract)
                        .setIn(['data', 'amount'], action.receivedData.amount)
                        .setIn(['data', 'fromAccountUuid'], action.receivedData.childList[0]['accountUuid'])
                        .setIn(['data', 'fromAccountName'], action.receivedData.childList[0]['accountName'])
                        .setIn(['data', 'toAccountUuid'], action.receivedData.childList[1]['accountUuid'])
                        .setIn(['data', 'toAccountName'], action.receivedData.childList[1]['accountName'])
        },

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_ZZ_CARD_DETAIL: 'GET_LB_ZZ_CARD_DETAIL',
    GET_LB_ZZ_FROM_YLLS: 'GET_LB_ZZ_FROM_YLLS',
    CHANGE_NBZZ_DATA: 'CHANGE_NBZZ_DATA',
    CHANGE_NBZZ_ACCOUNT: 'CHANGE_NBZZ_ACCOUNT',
    AFTER_NBZZ_SAVE: 'AFTER_NBZZ_SAVE',
    GET_YL_NBZZSTATE: 'GET_YL_NBZZSTATE'
}

// Action
const nbzzAccountActions = {
    changeNbzzData: (dataType, value) => ({
        type: ActionTypes.CHANGE_NBZZ_DATA,
        dataType,
        value
    }),
    changeNbzzAccount: (accountType, value) => ({
        type: ActionTypes.CHANGE_NBZZ_ACCOUNT,
        accountType,
        value
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {//未调路由也不对
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().nbzzAccountState
        let data = state.get('data').toJS()

        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (data['amount'] <=0) {
            return thirdParty.toast.info('请填写金额')
        }
        if (data['fromAccountUuid'] == '') {
            return thirdParty.toast.info('请选择转出账户')
        }
        if (data['toAccountUuid'] == '') {
            return thirdParty.toast.info('请选择转入账户')
        }
        if (data['toAccountUuid'] == data['fromAccountUuid']) {
            return thirdParty.toast.info('转出账户和转入账户不能相同')
        }

        const isInsert = state.getIn(['views', 'insertOrModify']) === 'insert' ? true : false
        const url = isInsert ? 'insertVirement' : 'modifyRunningbusiness'

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            accountChildList: [],
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (json.code !== 0) {
                thirdParty.toast.fail(`${json.code} ${json.message}`)
            } else {
                thirdParty.toast.success('保存成功', 2)
                if (saveAndNew) { //保存并新增
                    dispatch(nbzzAccountActions.afterNbzzSave(saveAndNew, isInsert, json.data))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                } else { //保存完后 重新获取数据
                    //dispatch(nbzzAccountActions.getYlNbzzState(isInsert ? json.data.uuid : uuid))
                    dispatch(nbzzAccountActions.afterNbzzSave(saveAndNew, isInsert, json.data))
                }
            }


        })
    },
    getYlNbzzState: (uuid) => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_YL_NBZZSTATE,
                    receivedData: json.data.result
                })
            }
        })
    },
    afterNbzzSave: (saveAndNew, isInsert, data) => ({
        type: ActionTypes.AFTER_NBZZ_SAVE,
        data,
        isInsert,
        saveAndNew
    })
}

export { nbzzAccountActions }
