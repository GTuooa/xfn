import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import * as Limit from 'app/constants/Limit.js'
import { showMessage, decimal } from 'app/utils'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

const ggfyftAccountState = fromJS({
    views: {
        insertOrModify: 'insert'//流水是保存还是新增
    },
    data: {
        categoryType: 'LB_GGFYFT',//十四大类的一种
        categoryName: '项目公共费用分摊',
        categoryUuid: '',
        runningDate: '',//日期
        runningAbstract: '公共费用分摊',//摘要
        totalAmount: '',
        selectCardList: [{}],
        uuid: ''
    },
    hxList: [],
    projectCardList: []
})

// Reducer
export default function reducer(state = ggfyftAccountState, action = {}) {
    return ({
        [ActionTypes.GET_LB_GGFYFT_CARD_DETAIL]				 : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            return ggfyftAccountState.setIn(['data' ,'runningDate'], action.data.get('runningDate'))
                                    .setIn(['views' ,'insertOrModify'], 'insert')
                                    .setIn(['data' ,'categoryUuid'], arr[0])
        },
        [ActionTypes.GET_LB_GGFYFT_FROM_YLLS]					 : () => {
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['views', 'fromYl'], true)
                        .set('hxList', fromJS(action.state.getIn(['data', 'paymentList'])))
                        .setIn(['data', 'totalAmount'], action.state.getIn(['data', 'amount']))
                        .setIn(['data', 'categoryName'], '项目公共费用分摊')
                        .setIn(['data', 'runningDate'], action.state.getIn(['data', 'runningDate']))
                        .setIn(['data', 'runningAbstract'], action.state.getIn(['data', 'runningAbstract']))
                        .setIn(['data', 'selectCardList'], fromJS(action.state.getIn(['data', 'projectCard'])))
                        .setIn(['data', 'uuid'], action.state.getIn(['data', 'uuid']))
        },
        [ActionTypes.CHANGE_GGFYFT_DATA]					 : () => {
            return state.setIn(['data', action.dataType], action.value)
        },
        [ActionTypes.GET_GGFYFT_LIST]				         : () => {
            return state = state.set('hxList', fromJS(action.receivedData))
        },
        [ActionTypes.GGFYFT_HXLIST_BESELECT]				 : () => {
            return state.setIn(['hxList', action.idx, 'beSelect'], action.value)
        },
        [ActionTypes.GGFYFT_AUTO_CALCULATE]				     : () => {
            const totalAmount = state.getIn(['data', 'totalAmount'])
            return state.updateIn(['data', 'selectCardList'], item => item.map(v => {
                const percent = v.get('percent')
                const amount = decimal(totalAmount*percent/100) ? decimal(totalAmount*percent/100) : ''
                return v.set('amount', amount)
            }))
        },
        [ActionTypes.AFTER_GGFYFT_SAVE]                      : () => {
            if (action.saveAndNew) {
                const runningDate = state.getIn(['data', 'runningDate'])
                state = ggfyftAccountState.setIn(['data', 'runningDate'], runningDate)

            } else {
                state = state.setIn(['views', 'insertOrModify'], 'modify')
                            .setIn(['data', 'uuid'], action.data.uuid)
            }

            return state
        },
        [ActionTypes.GET_GGFYFT_PROJECTLIST]			     : () => {
            let cardList = []
            action.receivedData.forEach(v => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })

            return state.set('projectCardList', fromJS(cardList))
        },
        [ActionTypes.CHANGE_GGFYFT_PROJECT_CARD]		     : () => {
            const totalAmount = state.getIn(['data', 'totalAmount'])
            switch (action.dataType) {
                case 'card' : {
                    const arr = action.value.split(Limit.TREE_JOIN_STR)
                    state = state.setIn(['data', 'selectCardList', action.idx], fromJS({
                        uuid: arr[0],
                        code: arr[1],
                        name: arr[2],
                        amount: '',
                        percent: ''
                    }))
                    break
                }
                case 'amount' : {
                    const percent = decimal(action.value/totalAmount, 4)*100
                    state = state.setIn(['data', 'selectCardList', action.idx, 'amount'], action.value)
                                .setIn(['data', 'selectCardList', action.idx, 'percent'], percent)
                    break
                }
                case 'percent' : {
                    const amount = decimal(action.value*totalAmount/100)
                    state = state.setIn(['data', 'selectCardList', action.idx, 'amount'], amount)
                                .setIn(['data', 'selectCardList', action.idx, 'percent'], action.value)
                    break
                }
                case 'add' : {
                    state = state.setIn(['data', 'selectCardList', action.idx], fromJS({amount: '', percent: 0}))
                    break
                }
                case 'delete' : {
                    state = state.deleteIn(['data', 'selectCardList', action.idx])
                    break
                }
            }
            return state

        },

    }[action.type] || (() => state))()
}


export const ActionTypes = {
    GET_LB_GGFYFT_CARD_DETAIL: 'GET_LB_GGFYFT_CARD_DETAIL',
    GET_LB_GGFYFT_FROM_YLLS: 'GET_LB_GGFYFT_FROM_YLLS',
    CHANGE_GGFYFT_DATA: 'CHANGE_GGFYFT_DATA',
    AFTER_GGFYFT_SAVE: 'AFTER_GGFYFT_SAVE',
    GET_GGFYFT_LIST: 'GET_GGFYFT_LIST',
    GGFYFT_HXLIST_BESELECT: 'GGFYFT_HXLIST_BESELECT',
    GET_GGFYFT_PROJECTLIST: 'GET_GGFYFT_PROJECTLIST',
    CHANGE_GGFYFT_PROJECT_CARD: 'CHANGE_GGFYFT_PROJECT_CARD',
    GGFYFT_AUTO_CALCULATE: 'GGFYFT_AUTO_CALCULATE'
}

// Action
const ggfyftAccountActions = {
    changeGgfyftData: (dataType, value) => ({
        type: ActionTypes.CHANGE_GGFYFT_DATA,
        dataType,
        value
    }),
    getGgfyftProjectList: () => (dispatch) => {
        thirdParty.toast.loading('加载中...', 0)
        fetchApi(`getProjectListAndTree`, 'GET', 'listFrom=&treeFrom=', json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_GGFYFT_PROJECTLIST,
                    receivedData: json.data.resultList
                })

            }
        })

    },
    changeGgfyftProjectCard: (dataType, value, idx) => ({
        type: ActionTypes.CHANGE_GGFYFT_PROJECT_CARD,
        dataType,
        value,
        idx
    }),
    getGgfyftList: () => (dispatch, getState) => {
        const state = getState().ggfyftAccountState
        const data = state.get('data')
        const runningDate = data.get('runningDate')

        if (runningDate) {
            fetchApi('getProjectShareList', 'POST', JSON.stringify({
                runningDate
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_GGFYFT_LIST,
                        receivedData: json.data
                    })
                }
            })
        }

    },
    hxListBeSelect: (idx, value) => ({
        type: ActionTypes.GGFYFT_HXLIST_BESELECT,
        idx,
        value
    }),
    saveRunningbusiness: (saveAndNew) => (dispatch, getState) => {
        const homeState = getState().homeAccountState
        const oldEnclosureList = homeState.get('enclosureList').toJS()
        const needDeleteUrl = homeState.get('needDeleteUrl').toJS()
        const enclosureList = oldEnclosureList.concat(needDeleteUrl)
        const state = getState().ggfyftAccountState
        const url = state.getIn(['views', 'insertOrModify']) === 'insert' ? 'insertProjectShare' : 'modifyProjectShare'
        const data = state.get('data').toJS()

        let paymentList = []
        let hasChecked = false//未选择核算列表
        const hxList = state.get('hxList')
        hxList.forEach(v => {
            if (v.get('beSelect')) {
                hasChecked = true
                paymentList.push({uuid: v.get('uuid'), beSelect: true})
            }
        })

        //校验
        const runningAbstract = data['runningAbstract']
        if (runningAbstract == '') {
            return thirdParty.toast.info('请填写摘要')
        }
        if (runningAbstract.length > Limit.RUNNING_ABSTRACT_LENGTH) {
            return thirdParty.toast.info(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
        }
        if (!hasChecked) {
            return thirdParty.toast.info('请选择需要核算的列表')
        }

        let uuidArr = [], hasEmptyAmount = false, projectCard = [], cardAmount = 0
        const selectCardList = data['selectCardList']
        const hasEmpty = selectCardList.every((v,i) => {
            uuidArr.push(v['uuid'])
            if (v['amount'] == 0 || v['amount'] == undefined) {
                hasEmptyAmount = true
            } else {
                cardAmount += Number(v['amount'])
                projectCard.push(v)
            }
            return v['uuid']
        })
        if (!hasEmpty) {
            return thirdParty.toast.info('有未选择的项目卡片')
        }
        if (hasEmptyAmount) {
            return thirdParty.toast.info('有未填写的项目金额')
        }
        let newArr = [...new Set(uuidArr)]
        if (newArr.length < uuidArr.length) {
            return thirdParty.toast.info('有重复的项目卡片')
        }
        const totalAmount = data['totalAmount']
        if (totalAmount != cardAmount) {
            return thirdParty.toast.info('分摊金额合计不等于待分摊金额')
        }

        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi(url, 'POST', JSON.stringify({
            runningAbstract,
            runningDate: data['runningDate'],
            uuid: data['uuid'],
            paymentList,
            projectCard,
            enclosureList
        }), json => {
            thirdParty.toast.hide()
            if (showMessage(json)) {
                thirdParty.toast.success('保存成功', 2)
                dispatch(ggfyftAccountActions.afterGgfyftSave(json.data, saveAndNew))
                if (saveAndNew) {
                    dispatch(ggfyftAccountActions.getGgfyftList())
                    dispatch(ggfyftAccountActions.getGgfyftProjectList())
                    dispatch(homeAccountActions.changeLrlsEnclosureList())
                }
            }
        })
    },
    afterGgfyftSave: (data, saveAndNew) => ({
        type: ActionTypes.AFTER_GGFYFT_SAVE,
        data,
        saveAndNew
    }),
    autoCalculate: () => ({
        type: ActionTypes.GGFYFT_AUTO_CALCULATE
    })
}

export { ggfyftAccountActions }
