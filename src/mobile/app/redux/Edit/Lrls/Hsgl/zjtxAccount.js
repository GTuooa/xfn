import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const zjtxAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_ZJTX',
        categoryName: '请选择类别',
        categoryUuid: '',//处理类别的uuid
        topCategoryName: '长期资产折旧摊销',
        topCategoryUuid: '',
        runningDate: '',//日期
        runningAbstract: '资产折旧摊销',//摘要
        assetType: 'XZ_ZJTX',
        runningState: 'STATE_CQZC_ZJTX',
        amount: '',
        beProject: false,//类别开启项目管理
        acAssets: {},
        propertyCost: '',
        propertyCostList: [],
        flowNumber: ''
    },
    categoryList: [{uuid: '', childList: []}]
})

// Reducer
export default function reducer(state = zjtxAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_ZJTX_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)

            return zjtxAccountState.setIn(['data' ,'topCategoryUuid'], arr[0])
                                    .setIn(['data' ,'topCategoryName'], arr[1])
                                    .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                                    .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_ZJTX_FROM_YLLS]					    : () => {
            const data = action.state.get('data')
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .setIn(['data', 'categoryUuid'], data.get('categoryUuid'))
                        .setIn(['data', 'categoryName'], data.get('categoryName'))
                        .setIn(['data', 'runningDate'], data.get('runningDate'))
                        .setIn(['data', 'runningAbstract'], data.get('runningAbstract'))
                        .setIn(['data', 'amount'], data.get('amount'))
                        .setIn(['data', 'beProject'], data.get('beProject'))
                        .setIn(['data', 'acAssets'], data.get('acAssets'))
                        .setIn(['data', 'propertyCost'], data.get('propertyCost'))
                        .setIn(['data', 'propertyCostList'], data.get('propertyCostList'))
                        .setIn(['data', 'uuid'], data.get('uuid'))
                        .setIn(['data', 'flowNumber'], data.get('flowNumber'))
        },
        [ActionTypes.CHANGE_ZJTX_DATA]					        : () => {
            return state.setIn(action.dataType, action.value)
        },
        [ActionTypes.AFTER_ZJTX_SAVE]                           : () => {
            if (action.saveAndNew) {
                const runningDate = state.getIn(['data', 'runningDate'])
                state = zjtxAccountState.setIn(['data', 'runningDate'], runningDate)
            } else {
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'uuid'], action.data.uuid)
                            .setIn(['data', 'flowNumber'],action.data.flowNumber)
            }

            return state
        },
        [ActionTypes.GET_ZJTX_CATEGORY]					        : () => {
            return state.set('categoryList', fromJS(action.receivedData))
        },
        [ActionTypes.SELECT_ZJTX_CATEGORY]					    : () => {
            let propertyCost = ''
            const propertyCostList = action.data.get('propertyCostList')
            if (propertyCostList.size == 1) {
                propertyCost = propertyCostList.get(0)
            }
            return state.setIn(['data', 'categoryUuid'], action.data.get('uuid'))
                        .setIn(['data', 'categoryName'], action.data.get('name'))
                        .setIn(['data', 'beProject'], action.data.get('beProject'))
                        .setIn(['data', 'propertyCost'], propertyCost)
                        .setIn(['data', 'propertyCostList'], propertyCostList)
                        .setIn(['data', 'acAssets'], action.data.get('acAssets'))
        }

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_ZJTX_CARD_DETAIL: 'GET_LB_ZJTX_CARD_DETAIL',
    GET_LB_ZJTX_FROM_YLLS: 'GET_LB_ZJTX_FROM_YLLS',
    CHANGE_ZJTX_DATA: 'CHANGE_ZJTX_DATA',
    AFTER_ZJTX_SAVE: 'AFTER_ZJTX_SAVE',
    GET_ZJTX_CATEGORY: 'GET_ZJTX_CATEGORY',
    SELECT_ZJTX_CATEGORY: 'SELECT_ZJTX_CATEGORY'
}

// Action
const zjtxAccountActions = {
    changeZjtxData: (dataType, value) => ({
        type: ActionTypes.CHANGE_ZJTX_DATA,
        dataType,
        value
    }),
    getCategoryList: () => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getCategoryList', 'POST', JSON.stringify({
            type: 'LB_ZJTX'
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_ZJTX_CATEGORY,
                    receivedData: json.data.result
                })
            }
        })
    },
    selectCategory: (data) => ({
        type: ActionTypes.SELECT_ZJTX_CATEGORY,
        data
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const state = getState().zjtxAccountState
        const url = state.getIn(['views', 'insertOrModify']) === 'insert' ? 'insertAssets' : 'modifyRunningbusiness'
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const project = getState().homeAccountState.get('project').toJS()
        const usedProject = project['usedProject']
        const projectCard = project['projectCard']
        if (usedProject) {
            const hasEmpty = projectCard.every(v => {
                return v['uuid']
            })
            if (!hasEmpty) {
                return thirdParty.toast.info('有未选择的项目卡片')
            }
        }

        //校验
        const data = state.get('data').toJS()
        if (data['categoryUuid'] == '') {
            return thirdParty.toast.info('请选择处理类别')
        }
        if (data['propertyCost']=='') {
            return thirdParty.toast.info('请选择费用性质')
        }
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (data['amount'] <= 0) {
            return thirdParty.toast.info('请填写金额')
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
                dispatch(zjtxAccountActions.afterZjtxSave(json.data, saveAndNew))
                if (saveAndNew) {
                    dispatch(zjtxAccountActions.getCategoryList())
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                }
            }

        })
    },
    afterZjtxSave: (data, saveAndNew) => ({
        type: ActionTypes.AFTER_ZJTX_SAVE,
        data,
        saveAndNew
    }),
}

export { zjtxAccountActions }
