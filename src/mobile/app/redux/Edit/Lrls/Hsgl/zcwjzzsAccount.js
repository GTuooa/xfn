import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const zcwjzzsAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_ZCWJZZS',
        categoryName: '转出未交增值税',
        categoryUuid: '',//流水列表的uuid
        runningDate: '',//日期
        runningAbstract: '转出未交增值税',//摘要
        handleMonth: '',
        turnOutBusinessUuid: ''
    },
    hxList: {
        flowDtoList:[],
        inputAmount: 0,//进项税合计
        inputCount: 0,
        outputAmount: 0,//销项税合计
        outputCount: 0
    }
})

// Reducer
export default function reducer(state = zcwjzzsAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_ZCWJZZS_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return zcwjzzsAccountState.setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                                    .setIn(['data' ,'categoryUuid'], arr[0])
                                    .setIn(['data' ,'categoryName'], arr[1])
                                    .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_ZCWJZZS_FROM_YLLS]					: () => {
            const hxList = action.state.getIn(['data', 'businessList'])
            const handleMonth = action.state.getIn(['data', 'businessList', 0, 'runningDate']).slice(0, 7)
            let outputCount = 0, inputCount = 0, outputAmount = 0, inputAmount = 0
            hxList.forEach(v => {
                if (v.get('billType') === 'bill_common') {//销项税
                    outputCount++
                    outputAmount += v.get('parentTax') ? v.get('parentTax') : v.get('tax')
                } else {
                    inputCount++
                    inputAmount += v.get('parentTax') ? v.get('parentTax') : v.get('tax')
                }
            })

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('data', action.state.get('data'))
                        .setIn(['data', 'handleMonth'], handleMonth)
                        .setIn(['hxList', 'flowDtoList'], hxList)
                        .setIn(['hxList', 'inputAmount'], inputAmount)
                        .setIn(['hxList', 'inputCount'], inputCount)
                        .setIn(['hxList', 'outputAmount'], outputAmount)
                        .setIn(['hxList', 'outputCount'], outputCount)
                        .setIn(['data', 'turnOutBusinessUuid'],  action.state.getIn(['data', 'uuid']))
        },

        [ActionTypes.CHANGE_WJZZS_DATA]					   : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.GET_WJZZS_LIST]				             : () => {
            return state = state.set('hxList', fromJS(action.receivedData))
        },
        [ActionTypes.AFTER_WJZZS_SAVE]                           : () => {
            if (action.saveAndNew) {
                const runningDate = state.getIn(['data', 'runningDate'])
                const categoryUuid = state.getIn(['data', 'categoryUuid'])
                const categoryName = state.getIn(['data', 'categoryName'])
                const handleMonth = state.getIn(['data', 'handleMonth'])

                state = zcwjzzsAccountState.setIn(['data', 'runningDate'], runningDate)
                                        .setIn(['data' ,'categoryUuid'], categoryUuid)
                                        .setIn(['data' ,'categoryName'], categoryName)
                                        .setIn(['data' ,'handleMonth'], handleMonth)
            } else {
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'turnOutBusinessUuid'], action.data.result)
            }

            return state
        },

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_ZCWJZZS_CARD_DETAIL: 'GET_LB_ZCWJZZS_CARD_DETAIL',
    GET_LB_ZCWJZZS_FROM_YLLS: 'GET_LB_ZCWJZZS_FROM_YLLS',
    CHANGE_WJZZS_DATA: 'CHANGE_WJZZS_DATA',
    GET_WJZZS_LIST: 'GET_WJZZS_LIST',
    AFTER_WJZZS_SAVE: 'AFTER_WJZZS_SAVE',
}

// Action
const zcwjzzsAccountActions = {
    changeWjzzsData: (dataType, value) => ({
        type: ActionTypes.CHANGE_WJZZS_DATA,
        dataType,
        value
    }),
    getWjzzsList: (runningDate) => (dispatch, getState) => {

        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getBusinessTurnoutList', 'POST', JSON.stringify({
            runningDate
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_WJZZS_LIST,
                    receivedData: json.data
                })
            }
        })

    },
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().zcwjzzsAccountState
        const url = state.getIn(['views', 'insertOrModify']) === 'insert' ? 'insertBusinessTurnoutItem' : 'modifyBusinessTurnoutItem'

        let uuidList = []
        const flowDtoList = state.getIn(['hxList', 'flowDtoList'])
        flowDtoList.forEach(v => {
            uuidList.push(v.get('uuid'))
        })

        //校验
        const data = state.get('data').toJS()

        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }

        if (data['handleMonth'] == '') {
            return thirdParty.toast.info('请选择处理税额月份')
        }
        if (!flowDtoList.size) {
            return thirdParty.toast.info('没有需要转出的流水')
        }
        const inputAmount = state.getIn(['hxList', 'inputAmount'])
        const outputAmount = state.getIn(['hxList', 'outputAmount'])
        if (inputAmount >= outputAmount) {
            return thirdParty.toast.info('进项税额大于销项税额，无需转出未交增值税')
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
                dispatch(zcwjzzsAccountActions.afterWjzzsSave(json.data, saveAndNew))
                if (saveAndNew) { //保存并新增
                    const month = data['handleMonth']
                    dispatch(zcwjzzsAccountActions.getWjzzsList(month))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())

                }
            }


        })
    },
    afterWjzzsSave: (data, saveAndNew) => ({
        type: ActionTypes.AFTER_WJZZS_SAVE,
        data,
        saveAndNew
    }),
}

export { zcwjzzsAccountActions }
