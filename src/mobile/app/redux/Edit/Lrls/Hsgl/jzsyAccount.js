import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const jzsyAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_JZSY',
        categoryName: '请选择类别',
        categoryUuid: '',//处理类别的uuid
        topCategoryName: '长期资产处置损益',
        topCategoryUuid: '',
        runningDate: '',//日期
        runningAbstract: '处置损益',//摘要
        amount: '',
        beProject: false,
        "acAssets":{
            "originalAssetsAmount": "",
            "depreciationAmount": ""
        },
        flowNumber: ''
    },
    hxList: [],
    categoryList: [{uuid: '',childList: []}]
})

// Reducer
export default function reducer(state = jzsyAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_JZSY_CARD_DETAIL]					: () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)

            return jzsyAccountState.setIn(['data' ,'topCategoryUuid'], arr[0])
                                    .setIn(['data' ,'topCategoryName'], arr[1])
                                    .setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                                    .setIn(['views' ,'insertOrModify'], 'insert')
        },
        [ActionTypes.GET_LB_JZSY_FROM_YLLS]					: () => {
            let hxList = action.state.getIn(['data', 'businessList'])
            const amount = action.state.getIn(['data', 'acAssets', 'cleaningAmount'])//列表的合计
            const data = action.state.get('data')
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .setIn(['data', 'categoryUuid'], data.get('categoryUuid'))
                        .setIn(['data', 'categoryName'], data.get('categoryName'))
                        .setIn(['data', 'runningDate'], data.get('runningDate'))
                        .setIn(['data', 'beProject'], data.get('beProject'))
                        .setIn(['data', 'runningAbstract'], data.get('runningAbstract'))
                        .setIn(['data', 'amount'], data.getIn(['acAssets', 'cleaningAmount']))
                        .setIn(['data', 'acAssets', 'originalAssetsAmount'], data.getIn(['acAssets', 'originalAssetsAmount']))
                        .setIn(['data', 'acAssets', 'depreciationAmount'], data.getIn(['acAssets', 'depreciationAmount']))
                        .setIn(['data', 'uuid'], data.get('uuid'))
                        .setIn(['data', 'flowNumber'], data.get('flowNumber'))
                        .set('hxList', hxList)
        },
        [ActionTypes.CHANGE_JZSY_DATA]					     : () => {
            return state.setIn(action.dataType, action.value)
        },
        [ActionTypes.GET_JZSY_LIST]				             : () => {
            return state = state.set('hxList', fromJS(action.receivedData))
        },
        [ActionTypes.JZSY_HXLIST_BECHECK]					 : () => {
            return state.setIn(['hxList', action.idx, 'beSelect'], action.value)
        },
        [ActionTypes.AFTER_JZSY_SAVE]                        : () => {
            if (action.saveAndNew) {
                const runningDate = state.getIn(['data', 'runningDate'])
                state = jzsyAccountState.setIn(['data', 'runningDate'], runningDate)
            } else {//修改后列表只出现被选中的
                const hxList = state.get('hxList').filter(v => v.get('beSelect'))
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'uuid'], action.data.uuid)
                            .setIn(['data', 'flowNumber'], action.data.flowNumber)
                            .set('hxList', hxList)
            }

            return state
        },
        [ActionTypes.GET_JZSY_CATEGORY]					 : () => {
            return state.set('categoryList', fromJS(action.receivedData))
        }

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_JZSY_CARD_DETAIL: 'GET_LB_JZSY_CARD_DETAIL',
    GET_LB_JZSY_FROM_YLLS: 'GET_LB_JZSY_FROM_YLLS',
    CHANGE_JZSY_DATA: 'CHANGE_JZSY_DATA',
    GET_JZSY_LIST: 'GET_JZSY_LIST',
    JZSY_HXLIST_BECHECK: 'JZSY_HXLIST_BECHECK',
    AFTER_JZSY_SAVE: 'AFTER_JZSY_SAVE',
    GET_JZSY_CATEGORY: 'GET_JZSY_CATEGORY'
}

// Action
const jzsyAccountActions = {
    changeJzsyData: (dataType, value) => ({
        type: ActionTypes.CHANGE_JZSY_DATA,
        dataType,
        value
    }),
    getJzsyList: () => (dispatch, getState) => {
        const state = getState().jzsyAccountState
        const data = state.get('data')
        const runningDate = data.get('runningDate')
        const categoryUuid = data.get('categoryUuid')
        if (runningDate && categoryUuid) {
            thirdParty.toast.loading('加载中...', 0)
            fetchApi('getJzsyList', 'POST', JSON.stringify({
                runningDate,
                categoryUuid
            }), json => {
                thirdParty.toast.hide()
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_JZSY_LIST,
                        receivedData: json.data.result
                    })
                }
            })
        }

    },
    getCategoryList: () => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi('getCategoryList', 'POST', JSON.stringify({
            type: 'LB_JZSY'
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_JZSY_CATEGORY,
                    receivedData: json.data.result
                })
            }
        })
    },
    jzsyHxListBeCheck: (idx, value) => ({
        type: ActionTypes.JZSY_HXLIST_BECHECK,
        idx,
        value
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const state = getState().jzsyAccountState
        const url = state.getIn(['views', 'insertOrModify']) === 'insert' ? 'insertJzsy' : 'modifyJzsy'
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        let hasChecked = false//未选择核算列表
        const hxList = state.get('hxList')
        hxList.forEach(v => {
            if (v.get('beSelect')) {
                hasChecked = true
            }
        })

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
        if (data['runningAbstract'] == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (data['runningAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (!hasChecked) {
            return thirdParty.toast.info('请选择需要处理的流水')
        }
        const originalAssetsAmount = data['acAssets']['originalAssetsAmount']
        const depreciationAmount = data['acAssets']['depreciationAmount']
        if ( originalAssetsAmount <= 0) {
            return thirdParty.toast.info('请填写资产原值')
        }
        if (depreciationAmount <= 0) {
            return thirdParty.toast.info('请填写累计折旧')
        }
        if (Number(depreciationAmount) > Number(originalAssetsAmount)) {
            return thirdParty.toast.info('折旧额不能大于原值')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            ...data,
            usedProject,
            projectCard: projectCard,
            businessList: hxList.toJS(),
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (json.code !== 0) {
                thirdParty.toast.fail(`${json.code} ${json.message}`)
            } else {
                thirdParty.toast.success('保存成功', 2)
                dispatch(jzsyAccountActions.afterJzsySave(json.data, saveAndNew))
                if (saveAndNew) {
                    dispatch(jzsyAccountActions.getCategoryList())
                    dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                }
            }

        })
    },
    afterJzsySave: (data, saveAndNew) => ({
        type: ActionTypes.AFTER_JZSY_SAVE,
        data,
        saveAndNew
    }),
}

export { jzsyAccountActions }
