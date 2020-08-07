import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const kjfpAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_KJFP',
        categoryName: '开具发票',
        categoryUuid: '',//流水列表的uuid
        runningDate: '',//日期
        runningAbstract: '收入开具发票',//摘要
        billMakeOutType: 'BILL_MAKE_OUT_TYPE_XS',//'BILL_MAKE_OUT_TYPE_XS', BILL_MAKE_OUT_TYPE_TS
        makeOutBusinessUuid: '',
        totalAmount: ''
    },
    hxList: []
})

// Reducer
export default function reducer(state = kjfpAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_KJFP_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return kjfpAccountState.setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                                    .setIn(['data' ,'categoryUuid'], arr[0])
                                    .setIn(['data' ,'categoryName'], arr[1])
                                    .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_KJFP_FROM_YLLS]					: () => {
            let hxList = action.state.getIn(['data', 'businessList']).update(v => v.map(item => {
                return item.set('isCheck', true)
            }))
            const runningState = action.state.getIn(['data', 'runningState'])
            const billMakeOutType = runningState == 'STATE_KJFP_XS' ? 'BILL_MAKE_OUT_TYPE_XS' : 'BILL_MAKE_OUT_TYPE_TS'
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .set('hxList', hxList)
                        .setIn(['data', 'totalAmount'], action.state.getIn(['data', 'tax']))
                        .setIn(['data', 'billMakeOutType'], billMakeOutType)
                        .setIn(['data', 'makeOutBusinessUuid'], action.state.getIn(['data', 'uuid']))
        },
        [ActionTypes.CHANGE_KJFP_RUNNING_STATE]					: () => {
            const runningAbstract = action.key == 'BILL_MAKE_OUT_TYPE_XS' ? '收入开具发票' : '退销开具红字发票'
            return state.setIn(['data' ,'billMakeOutType'], action.key).setIn(['data' ,'runningAbstract'], runningAbstract)
        },
        [ActionTypes.CHANGE_KJFP_DATA]					   : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.GET_KJFP_LIST]				             : () => {
            return state = state.set('hxList', fromJS(action.receivedData))
        },
        [ActionTypes.KJFP_HXLIST_BECHECK]					 : () => {
            return state.setIn(['hxList', action.idx, 'isCheck'], action.value)
        },
        [ActionTypes.KJFP_HXLIST_BEALLCHECK]				 : () => {
            return state.update('hxList', item => item.map(v => v.set('isCheck', action.value)))
        },
        [ActionTypes.AFTER_KJFP_SAVE]                        : () => {
            if (action.saveAndNew) {
                const runningDate = state.getIn(['data', 'runningDate'])
                const categoryUuid = state.getIn(['data', 'categoryUuid'])
                const categoryName = state.getIn(['data', 'categoryName'])

                state = kjfpAccountState.setIn(['data', 'runningDate'], runningDate)
                                        .setIn(['data' ,'categoryUuid'], categoryUuid)
                                        .setIn(['data' ,'categoryName'], categoryName)
            } else {
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'makeOutBusinessUuid'], action.data.result)
            }

            return state
        },

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_KJFP_CARD_DETAIL: 'GET_LB_KJFP_CARD_DETAIL',
    GET_LB_KJFP_FROM_YLLS: 'GET_LB_KJFP_FROM_YLLS',
    CHANGE_KJFP_RUNNING_STATE: 'CHANGE_KJFP_RUNNING_STATE',
    CHANGE_KJFP_DATA: 'CHANGE_KJFP_DATA',
    GET_KJFP_LIST: 'GET_KJFP_LIST',
    KJFP_HXLIST_BECHECK: 'KJFP_HXLIST_BECHECK',
    KJFP_HXLIST_BEALLCHECK: 'KJFP_HXLIST_BEALLCHECK',
    AFTER_KJFP_SAVE: 'AFTER_KJFP_SAVE',
}

// Action
const kjfpAccountActions = {
    changeKjfpRunningState: (key) => ({
        type: ActionTypes.CHANGE_KJFP_RUNNING_STATE,
        key
    }),
    changeKjfpData: (dataType, value) => ({
        type: ActionTypes.CHANGE_KJFP_DATA,
        dataType,
        value
    }),
    getKjfpList: () => (dispatch, getState) => {
        const state = getState().kjfpAccountState
        const data = state.get('data')
        const runningDate = data.get('runningDate')
        const billMakeOutType = data.get('billMakeOutType')
        if (runningDate && billMakeOutType) {
            thirdParty.toast.loading('加载中...', 0)
            fetchApi('getBusinessMakeoutList', 'POST', JSON.stringify({
                runningDate,
                billMakeOutType
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_KJFP_LIST,
                        receivedData: json.data.result
                    })
                }
            })
        }

    },
    kjfpHxListBeCheck: (idx, value) => ({
        type: ActionTypes.KJFP_HXLIST_BECHECK,
        idx,
        value
    }),
    kjfpHxListBeAllCheck: (value) => ({
        type: ActionTypes.KJFP_HXLIST_BEALLCHECK,
        value
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {//待测试
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().kjfpAccountState
        const url = state.getIn(['views', 'insertOrModify']) === 'insert' ? 'insertBusinessMakeoutItem' : 'modifyBusinessMakeoutItem'

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

        if (data['billMakeOutType'] == '') {
            return thirdParty.toast.info('请选择流水状态')
        }
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (!hasChecked) {
            return thirdParty.toast.info('请选择需要开具发票的列表')
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
                dispatch(kjfpAccountActions.afterKjfpSave(json.data, saveAndNew))
                if (saveAndNew) { //保存并新增
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                }
            }


        })
    },
    afterKjfpSave: (data, saveAndNew) => ({
        type: ActionTypes.AFTER_KJFP_SAVE,
        data,
        saveAndNew
    }),
}

export { kjfpAccountActions }
