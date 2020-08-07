import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.running.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

const accountConfigState = fromJS({
    views: {
        flags: 'insert',//预览 insert modify
        fromPage: 'account',
        // deleteList: [],
    },
    data: {
        "beginAmount": "",
        "openingName": "",
        "name": "",
        "openingBank": "",
        "accountNumber": "",
        "openInfo": false,
        "type": "general",
        "uuid": "",
        "acFullName": "",
        "acId": "",
        "assCategoryList": [],
        'canUse': true,
        needPoundage: false,//是否开启手续费
        poundage: '',
        poundageRate: '',
    },
    poundageData: {
        flags: 'insert',
        categoryUuid: '',
        categoryName: '请选择处理类别',
        beProject: false,
        contactsManagement: false,
        poundageNeedCurrent: false,
        poundageNeedProject: false,
    },
    regret: {
        regretList: [],
    }
})

// Reducer
export default function reducer(state = accountConfigState, action = {}) {
    return ({
        [ActionTypes.INIT_ACCOUNT_SETTING]                      : accountConfigState,
        [ActionTypes.ACCOUNT_SETTING_POUNDAGE]					: () => {
            if (action.flags=='insert') {
                return state.set('poundageData', accountConfigState.get('poundageData'))
            }

            const data = action.data
            let flags = state.getIn(['poundageData', 'flags'])
            let poundageNeedCurrent = false
            let poundageNeedProject = false

            if (action.flags=='modify') {
                flags = 'modify'
                if (data['beProject']) {
                    poundageNeedProject = state.getIn(['poundageData', 'poundageNeedProject'])
                }
                if (data['acCost']['contactsManagement']) {
                    poundageNeedCurrent = state.getIn(['poundageData', 'poundageNeedCurrent'])
                }
            }

            return state.setIn(['poundageData', 'categoryUuid'], data['uuid'])
            .setIn(['poundageData', 'categoryName'], data['name'])
            .setIn(['poundageData', 'beProject'], data['beProject'])
            .setIn(['poundageData', 'contactsManagement'], data['acCost']['contactsManagement'])
            .setIn(['poundageData', 'poundageNeedCurrent'], poundageNeedCurrent)
            .setIn(['poundageData', 'poundageNeedProject'], poundageNeedProject)
            .setIn(['poundageData', 'flags'], flags)
        },
        [ActionTypes.CHANGE_ACCOUNT_SETTING_DATA]			    : () => {
            if (action.value == 'insert') {
                state = state.set('data', accountConfigState.get('data'))
                            .setIn(['views', 'fromPage'], 'account')
            }
            return state.setIn(action.dataType, action.value)
        },
        [ActionTypes.BEFOR_ADD_ACCONT_FROM_EDIT_RUNNING]	    : () => {
            if (action.value == 'insert') {
                state = state.set('data', accountConfigState.get('data'))
                            // .setIn(['views', 'fromPage'], 'other')
                            .setIn(['views', 'fromPage'], 'editRunning')
            }
            return state.setIn(action.dataType, action.value)
        },
        [ActionTypes.ACCOUNT_SETTING_MIDIFY]					: () => {
            return state.set('data', action.item)
                        .setIn(['views', 'flags'], 'modify')
                        .setIn(['views', 'fromPage'], 'account')
        }

    }[action.type] || (() => state))()
}

export const ActionTypes = {
    ACCOUNT_SETTING_POUNDAGE: 'ACCOUNT_SETTING_POUNDAGE',
    CHANGE_ACCOUNT_SETTING_DATA: 'CHANGE_ACCOUNT_SETTING_DATA',
    BEFOR_ADD_ACCONT_FROM_EDIT_RUNNING: 'BEFOR_ADD_ACCONT_FROM_EDIT_RUNNING', // 录入
    ACCOUNT_SETTING_MIDIFY: 'ACCOUNT_SETTING_MIDIFY',
    INIT_ACCOUNT_SETTING: 'INIT_ACCOUNT_SETTING',
}

// Action
export const accountConfigActions = {
    getCardDetail: (uuid, flags) => (dispatch, getState) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getRunningDetail', 'GET', `uuid=${uuid}`, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.ACCOUNT_SETTING_POUNDAGE,
                    data: json.data.result,
                    flags
                })

            }
        })
    },
    accountSettingMidify: (item) => ({
        type: ActionTypes.ACCOUNT_SETTING_MIDIFY,
        item
    }),
    changeAccountSettingData: (dataType, value) => ({
        type: ActionTypes.CHANGE_ACCOUNT_SETTING_DATA,
        dataType,
        value
    }),
    saveAccountPoundage: (history) => (dispatch, getState) => {
        const state = getState().accountConfigState
        const flags = state.getIn(['poundageData', 'flags'])
        const categoryUuid = state.getIn(['poundageData', 'categoryUuid'])
        const poundageNeedCurrent = state.getIn(['poundageData', 'poundageNeedCurrent'])
        const poundageNeedProject = state.getIn(['poundageData', 'poundageNeedProject'])

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(`${flags}AccountPoundage`, 'POST', JSON.stringify({
            categoryUuid,
            poundageNeedCurrent,
            poundageNeedProject,
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json, 'show')) {
                history.goBack()
            }
        })
    },
    getAccountPoundage: () => (dispatch) => {
        //thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getAccountPoundage', 'GET', ``, json => {
            //thirdParty.toast.hide()
            if (showMessage(json)) {
                if (json.data.canUsed && json.data.uuid) {//修改
                    dispatch(accountConfigActions.changeAccountSettingData(['poundageData', 'poundageNeedProject'], json.data.poundageNeedProject))
                    dispatch(accountConfigActions.changeAccountSettingData(['poundageData', 'poundageNeedCurrent'], json.data.poundageNeedCurrent))
                    dispatch(accountConfigActions.getCardDetail(json.data.categoryUuid, 'modify'))
                } else {//新增
                    dispatch({
                        type: ActionTypes.ACCOUNT_SETTING_POUNDAGE,
                        flags: 'insert'
                    })
                }
                if (!json.data.canUsed && json.data.uuid) {
                    thirdParty.Alert('处理类别失效，请重新选择')
                    dispatch(accountConfigActions.changeAccountSettingData(['poundageData', 'flags'], 'modify'))
                }
            }
        })
    },
    getRegretList: () => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getAccountRegretList', 'GET', ``, json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                json.data.accountRegretList.forEach(v => {
                    v['key'] = v['name']
                    v['value'] = v['uuid']
                })

                dispatch(accountConfigActions.changeAccountSettingData(['regret', 'regretList'], fromJS(json.data.accountRegretList)))

            }
        })
    },
    accountRegret: (data, history) => (dispatch) => {
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('accountRegret', 'POST', JSON.stringify(data), json => {
            thirdParty.toast.hide()
            if (showMessage(json, 'show')) {
                history.goBack()
                dispatch(allRunningActions.getRunningAccount())
            }
        })
    }
}
