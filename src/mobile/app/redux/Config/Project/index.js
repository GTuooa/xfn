import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'

const projectConfState = fromJS({
    views: {
        currentType: '',//当前的顶级类别的uuid
        currentTypeName: '全部',//当前的顶级类别的name
        ctgyUuid: '',//损益项目的uuid
        treeName: '全部',//查看卡片的类别名称
        treeUuid: '',//按类别查看卡片的类别uuid
        highTypeIdx: 0,//查看主类别详情的idx
        insertOrModify: 'insert',
        fromPage: 'project',
        otherPageName: '',
        treeSelect: {//通过类别筛选卡片的信息
            'treeTwoList': [],
            'treeThreeList': [],
            'selectUuid': ['', '', ''],
            'selectName': '',//末级名称
            'selectEndUuid': '',//末级类别的uuid
        },
    },
    data: {//新增卡片的数据
        psiData: {
            code: '',
            name: '',
            selectName: '',//类别名
            selectUuid: '',
            categoryTypeList: [],
            typeList: [],//类别列表
            used: true,
            uuid: '',
            projectProperty: "XZ_LOSS",//XZ_LOSS 损益  XZ_PRODUCE 生产,
            basicProductOpen: "", //基本生产成本期初
            contractCostOpen: "", //合同成本期初
            contractProfitOpen: "", //合同毛利期初
            engineeringSettlementOpen: "", //工程结算期初
        }

    },
    highTypeList: [],//项目顶级类别 全部 损益项目
    cardList: [],//卡片列表
    treeList: [],//按类别查看卡片的类别树列表
    highTypeData: {//顶级类别详情
        commonFee: false,
        name: "",
        uuid: '',
        beAssist: false,//辅助生产成本
        beMake: true,//制造费用
        treeList: [],//顶级类别下的树
    },
    deleteList: [],//要删除的类别列表
    treeData: {//单个类别详情
        name: "",
        parentName: "",
        parentUuid: "",
        uuid: ""
    }
})

// Reducer
export default function reducer(state = projectConfState, action = {}) {
    return ({
        [ActionTypes.INIT_PROJECT]                          : () => projectConfState,
        [ActionTypes.INIT_PROJECT_DATA]                     : () => {
            return state.set(action.dataType, projectConfState.get(action.dataType))
                        .setIn(['views', 'fromPage'], action.fromPage || 'project')
        },
        [ActionTypes.PROJECT_HIGH_TYPE]					    : () => {
            const highTypeList = action.list
            highTypeList.unshift({'name': '全部', 'uuid': ''})

            return state.set('highTypeList', fromJS(highTypeList))
                        .setIn(['views', 'ctgyUuid'], highTypeList[1]['uuid'])
        },
        [ActionTypes.CHANGE_PROJECT_DATA]					: () => {
            return state.setIn(action.dataType, action.value)
        },
        [ActionTypes.CHANGE_PROJECT_TOP_DATA]				: () => {
            return state.set(action.dataType, action.value)
        },
        [ActionTypes.AFTER_SUCCESS_EDIT_PROJECT_CARD]	    : () => {
            return state.set('cardList', fromJS(action.receivedData))
        },
        [ActionTypes.GET_PROJECT_LIST_AND_TREE]				: () => {
            const treeUuid = action.data.typeList.length ? action.data.typeList[0]['uuid'] : ''

            return state.set('cardList', fromJS(action.data.resultList))
                        .set('treeList', fromJS(action.data.typeList))
                        .mergeIn(['views'], fromJS({
                            treeUuid: treeUuid,
                            treeName: '全部',
                            treeSelect: projectConfState.getIn(['views', 'treeSelect'])
                        }))
        },
        [ActionTypes.CHECKED_PROJECT_CATEGORY]				: () => {
            let treeList = state.getIn(['highTypeData', 'treeList']).toJS()

            const loop = (data, isChild) => data.map((item, index) => {
                    let isTreeChild = isChild
                    if (item['uuid'] == action.uuid || isChild) {
                        item['checked'] = action.value
                        isTreeChild = true
                    }
                    if (item['childList'].length > 0) {
                        loop(item['childList'], isTreeChild)
                    }
                })

            loop(treeList, false)
            return state.setIn(['highTypeData', 'treeList'], fromJS(treeList))
        },
        [ActionTypes.GET_PROJECT_CARD_ONE]				    : () => {
            const selectName = action.data['categoryTypeList'][0]['subordinateName']
            const selectUuid = action.data['categoryTypeList'][0]['subordinateUuid']
            //const ctgyUuid = state.getIn(['highTypeList', 1, 'uuid'])//损益项目uuid

            return state.mergeIn(['data', 'psiData'], fromJS(action.data))
                        .setIn(['views', 'insertOrModify'], 'modify')
                        .setIn(['data', 'psiData', 'selectName'], selectName)
                        .setIn(['data', 'psiData', 'selectUuid'], selectUuid)
                        .setIn(['data', 'psiData', 'typeList'], fromJS(action.data['categoryTypeList'][0]['options']))
                        .setIn(['views', 'fromPage'], 'project')
                        .set('treeList', fromJS(action.data['categoryTypeList'][0]['options']))

        },
        [ActionTypes.UNCHECKED_PROJECT]				        : () => {
            if (action.dataType == 'card') {
                const cardList = state.get('cardList')
                state = state.update('cardList', v => v.map(w => w.set('checked', false)))
            } else {//category
                let treeList = state.get('treeList').toJS()

                const loop = (data) => data.map((item, index) => {
                        item['checked'] = false
                        if (item['childList'].length > 0) {
                            loop(item['childList'])
                        }
                    })

                loop(treeList)
                state = state.set('treeList', fromJS(treeList))
            }
            return state
        },
        [ActionTypes.BEFORE_ADD_PROJECT_CARD_FROM_EDIT_RUNNING] : () => {
            state = state.set('data', projectConfState.get('data'))
							.set('treeList', fromJS(action.receivedData))
							.setIn(['views', 'insertOrModify'], 'insert')
							.setIn(['views', 'fromPage'], action.otherPageName)
							.setIn(['views', 'otherPageName'], action.otherPageName)
							.setIn(['views', 'ctgyUuid'], action.ctgyUuid)
                            .set('highTypeList', fromJS(action.highTypeList))
                            .setIn(['data', 'psiData','code'], action.code)
                            .setIn(['data', 'psiData', 'categoryTypeList', 0], fromJS({
                                ctgyUuid: action.ctgyUuid,
                                subordinateUuid: '',
                            }))
			if (action.receivedData[0].childList.length <= 0) {
				state = state.setIn(['data', 'psiData', 'selectUuid'], action.receivedData[0].uuid)
							.setIn(['data', 'psiData', 'selectName'], action.receivedData[0].name)
                            .setIn(['data', 'psiData', 'categoryTypeList', 0, 'subordinateUuid'], action.receivedData[0].uuid)
			}
            action.highTypeList.map(v => {
                if (v['uuid']==action.ctgyUuid && v['name']=='生产项目') {
                    state = state.setIn(['data', 'psiData', 'projectProperty'], 'XZ_PRODUCE')
                }
            })

            return state
        },
        [ActionTypes.BEFORE_ADD_PROJECT_CARD_GET_CODE]          : () => {
            return state.setIn(['data', 'psiData','code'], action.value)
        },


    }[action.type] || (() => state))()
}
