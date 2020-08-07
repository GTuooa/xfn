import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const fprzAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_FPRZ',
        categoryName: '发票认证',
        categoryUuid: '',//流水列表的uuid
        runningDate: '',//日期
        runningAbstract: '增值税专用发票认证',//摘要
        billAuthType: 'BILL_AUTH_TYPE_CG',//'BILL_AUTH_TYPE_CG', BILL_AUTH_TYPE_TG
        authBusinessUuid: '',
        totalAmount: ''
    },
    hxList: []
})

// Reducer
export default function reducer(state = fprzAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_FPRZ_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return fprzAccountState.setIn(['data' ,'categoryUuid'], arr[0])
                                    .setIn(['data' ,'categoryName'], arr[1])
                                    .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                                    .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_FPRZ_FROM_YLLS]					: () => {
            let hxList = action.state.getIn(['data', 'businessList']).update(v => v.map(item => item.set('isCheck', true)))
            const runningState = action.state.getIn(['data', 'runningState'])
            const billAuthType = runningState == 'STATE_FPRZ_CG' ? 'BILL_AUTH_TYPE_CG' : 'BILL_AUTH_TYPE_TG'
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .set('hxList', hxList)
                        .setIn(['data', 'totalAmount'], action.state.getIn(['data', 'tax']))
                        .setIn(['data', 'billAuthType'], billAuthType)
        },
        [ActionTypes.CHANGE_FPRZ_RUNNING_STATE]					: () => {
            const runningAbstract = action.key == 'BILL_AUTH_TYPE_CG' ? '增值税专用发票认证' : '退购红字发票认证'
            return state.setIn(['data' ,'billAuthType'], action.key).setIn(['data' ,'runningAbstract'], runningAbstract)
        },
        [ActionTypes.CHANGE_FPRZ_DATA]					     : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.GET_FPRZ_LIST]				             : () => {
            return state = state.set('hxList', fromJS(action.receivedData))
        },
        [ActionTypes.FPRZ_HXLIST_BECHECK]					 : () => {
            return state.setIn(['hxList', action.idx, 'isCheck'], action.value)
        },
        [ActionTypes.FPRZ_HXLIST_BEALLCHECK]				 : () => {
            return state.update('hxList', item => item.map(v => v.set('isCheck', action.value)))
        },
        [ActionTypes.AFTER_FPRZ_SAVE]                        : () => {
            if (action.saveAndNew) {
                const runningDate = state.getIn(['data', 'runningDate'])
                const categoryUuid = state.getIn(['data', 'categoryUuid'])
                const categoryName = state.getIn(['data', 'categoryName'])

                state = fprzAccountState.setIn(['data', 'runningDate'], runningDate)
                                        .setIn(['data' ,'categoryUuid'], categoryUuid)
                                        .setIn(['data' ,'categoryName'], categoryName)
            } else {
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'authBusinessUuid'], action.data.result)
            }

            return state
        },

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_FPRZ_CARD_DETAIL: 'GET_LB_FPRZ_CARD_DETAIL',
    GET_LB_FPRZ_FROM_YLLS: 'GET_LB_FPRZ_FROM_YLLS',
    CHANGE_FPRZ_RUNNING_STATE: 'CHANGE_FPRZ_RUNNING_STATE',
    CHANGE_FPRZ_DATA: 'CHANGE_FPRZ_DATA',
    GET_FPRZ_LIST: 'GET_FPRZ_LIST',
    FPRZ_HXLIST_BECHECK: 'FPRZ_HXLIST_BECHECK',
    FPRZ_HXLIST_BEALLCHECK: 'FPRZ_HXLIST_BEALLCHECK',
    AFTER_FPRZ_SAVE: 'AFTER_FPRZ_SAVE',
}

// Action
const fprzAccountActions = {
    changeFprzRunningState: (key) => ({
        type: ActionTypes.CHANGE_FPRZ_RUNNING_STATE,
        key
    }),
    changeFprzData: (dataType, value) => ({
        type: ActionTypes.CHANGE_FPRZ_DATA,
        dataType,
        value
    }),
    getFprzList: () => (dispatch, getState) => {
        const state = getState().fprzAccountState
        const data = state.get('data')
        const runningDate = data.get('runningDate')
        const billAuthType = data.get('billAuthType')
        if (runningDate && billAuthType) {
            thirdParty.toast.loading('加载中...', 0)
            fetchApi('getBusinessAuthList', 'POST', JSON.stringify({
                runningDate,
                billAuthType
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_FPRZ_LIST,
                        receivedData: json.data.result
                    })
                }
            })
        }

    },
    fprzHxListBeCheck: (idx, value) => ({
        type: ActionTypes.FPRZ_HXLIST_BECHECK,
        idx,
        value
    }),
    fprzHxListBeAllCheck: (value) => ({
        type: ActionTypes.FPRZ_HXLIST_BEALLCHECK,
        value
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {//待测试
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().fprzAccountState
        const url = state.getIn(['views', 'insertOrModify']) === 'insert' ? 'insertBusinessAuthItem' : 'modifyBusinessAuthItem'

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
        const data = state.get('data').toJS()
        if (data['billAuthType'] == '') {
            return thirdParty.toast.info('请选择流水状态')
        }
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (!hasChecked) {
            return thirdParty.toast.info('请选择需要认证的列表')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            uuidList,
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (json.code !== 0) {
                thirdParty.toast.fail(`${json.code} ${json.message}`)
            } else {
                thirdParty.toast.success('保存成功', 2)
                dispatch(fprzAccountActions.afterFprzSave(json.data, saveAndNew))
                if (saveAndNew) { //保存并新增
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                }
            }

        })
    },
    afterFprzSave: (data, saveAndNew) => ({
        type: ActionTypes.AFTER_FPRZ_SAVE,
        data,
        saveAndNew
    }),
}

export { fprzAccountActions }
