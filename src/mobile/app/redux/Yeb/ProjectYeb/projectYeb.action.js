import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

// 首次获取项目余额
export const getPeriodAndProjectYebBalanceList = (issuedate, endissuedate,tableName = 'Income') => dispatch =>  {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getProjectYebReport', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        categoryUuid: '',
        cardCategoryUuid: '',
        jrCategoryUuid: '',
        needPeriod: 'true',
        isType: false
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.GET_PERIOD_AND_PROJECT_YEB_BALANCE_LIST,
                receivedData: json.data.result,
                issuedate: issuedate ? issuedate : openedissuedate,
                endissuedate: endissuedate ? endissuedate : '',
                issues,
                needPeriod: 'true',
                tableName: 'Income'

            })
        }
	})
}

// 获取收支、类型余额表 项目类别、流水类别/类型
export const getProjectYebCategoryFetch = (issuedate, endissuedate,name , projectItem) => dispatch => {
    fetchApi(`getProjectYeb${name}Category`, 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
    }), json => {
        if (showMessage(json)) {
            if(name === 'Income'){
                dispatch({
                    type: ActionTypes.GET_PROJECT_YEB_CATEGORY_FETCH,
                    categoryList: json.data.cardCategory,
                    jrCategory: json.data.jrCategory
                })
            }else{
                dispatch({
                    type: ActionTypes.GET_PROJECT_YEB_TYPE_CATEGORY_FETCH,
                    categoryList: json.data.cardCategory,
                    jrType: json.data.jrType
                })
            }


        }
    })
}

export const projectBalanceTriangleSwitch = (showChild, uuid) => ({
    type: ActionTypes.PROJECT_BALANCE_TRIANGLE_SWITCH,
    showChild,
    uuid
})
// 收支 切换账期
export const getProjectYebBalanceListFromSwitchPeriod = (issuedate, endissuedate, projectItem,runningItem) => (dispatch,getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const oldCategory = getState().projectYebState.get('projectCategory')
    fetchApi(`getProjectYebIncomeCategory`, 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_YEB_CATEGORY_FETCH,
                categoryList: json.data.cardCategory,
                jrCategory: json.data.jrCategory
            })
            let newProjectItem = projectItem
            let hasItem = false
            const newCategory = json.data.cardCategory ? json.data.cardCategory : oldCategory.toJS()
            if(newCategory.length == 0){
                newProjectItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }else if(newCategory.length > 0) {
                const loop = ( data ) => data.map((item, i) => {

                    if(newProjectItem.get('uuid') === item.uuid){
                        hasItem = true
                    }
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }
                })
                loop(newCategory)
            }

            if(!hasItem){
                newProjectItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }


            let newRunningItem = runningItem
            let hasRunningItem = false
            if(json.data.jrCategory.length == 0){
                newRunningItem =  fromJS({
                    jrCategoryUuid: '',
                    jrCategoryName: '全部流水类别',
                    value: '全部流水类别',
                    direction: 'double_credit'
                })
            }else if(json.data.jrCategory.length > 0) {
                const loop = ( data ) => data.map((item, i) => {
                    if(newRunningItem.get('jrCategoryUuid') === item.jrCategoryUuid){
                        hasRunningItem = true
                    }
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }
                })
                loop(json.data.jrCategory)
            }
            if(!hasRunningItem){
                newRunningItem = fromJS({
                    jrCategoryUuid: '',
                    jrCategoryName: '全部流水类别',
                    value: '全部流水类别',
                    direction: 'double_credit'
                })

            }

            fetchApi('getProjectYebReport', 'POST', JSON.stringify({
                begin: issuedate ? issuedate : '',
                end: endissuedate ? endissuedate : '',
                categoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? newProjectItem.get('uuid') : ''),
                cardCategoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? '' : newProjectItem.get('uuid')),
                jrCategoryUuid: newRunningItem.get('name') === '全部流水类别' ? '' : newRunningItem.get('jrCategoryUuid') ,
                jrJvTypeUuid: '',
                isType: false
            }),json => {
                thirdParty.toast.hide()

                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT,
                        receivedData: json.data.result,
                        issuedate: issuedate,
                        endissuedate: endissuedate,
                        projectItem: newProjectItem,
                        runningItem: newRunningItem,
                        tableName: 'Income'
                    })
                }
            })



        }
    })
}
// 类型 切换账期
export const getProjectTypeBalanceListFromSwitchPeriod = (issuedate, endissuedate, projectItem,typeItem) => (dispatch,getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const oldCategory = getState().projectYebState.get('projectCategory')
    fetchApi(`getProjectYebTypeCategory`, 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_YEB_TYPE_CATEGORY_FETCH,
                categoryList: json.data.cardCategory,
                jrType: json.data.jrType
            })
            let newProjectItem = projectItem
            let hasItem = false
            const newCategory = json.data.cardCategory ? json.data.cardCategory : oldCategory.toJS()
            if(newCategory.length == 0){
                newProjectItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }else if(newCategory.length > 0) {
                const loop = ( data ) => data.map((item, i) => {
                    if(newProjectItem.get('uuid') === item.uuid){
                        hasItem = true
                    }
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }
                })
                loop(newCategory)
            }

            if(!hasItem){
                newProjectItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }

            const newCategroyList = json.data.jrType

            let newTypeItem = typeItem
            let hasTypeItem = false
            if(newCategroyList.length == 0){
                newTypeItem =  fromJS({
                    jrJvTypeUuid: '',
                    typeName: '全部类型',
                    value: '全部类型',
                    direction: 'double_credit'
                })
            }else if(newCategroyList.length > 0) {
                const loop = ( data ) => data.map((item, i) => {
                    if(newTypeItem.get('jrJvTypeUuid') === item.jrJvTypeUuid){
                        hasTypeItem = true
                    }
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }
                })
                loop(newCategroyList)
            }
            if(!hasTypeItem){
                newTypeItem = fromJS({
                    jrJvTypeUuid: '',
                    typeName: '全部类型',
                    value: '全部类型',
                    direction: 'double_credit'
                })

            }

            fetchApi('getProjectYebReport', 'POST', JSON.stringify({
                begin: issuedate ? issuedate : '',
                end: endissuedate ? endissuedate : '',
                categoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? newProjectItem.get('uuid') : ''),
                cardCategoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? '' : newProjectItem.get('uuid')),
                jrCategoryUuid: '',
                jrJvTypeUuid: newTypeItem.get('name') === '全部类型' ? '' : newTypeItem.get('jrJvTypeUuid'),
                isType: true
            }),json => {
                thirdParty.toast.hide()

                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT,
                        receivedData: json.data.result,
                        issuedate: issuedate,
                        endissuedate: endissuedate,
                        projectItem: newProjectItem,
                        typeItem: newTypeItem,
                        tableName: 'Type'
                    })
                }
            })



        }
    })
}

// 收支
export const getProjectYebBalanceListFromSwitchPeriodOrProject = (issuedate, endissuedate, projectItem, runningItem) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getProjectYebReport', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        jrCategoryUuid: runningItem.get('name') === '全部' ? '' : runningItem.get('jrCategoryUuid'),
        jrJvTypeUuid: '',
        isType: false
	}),json => {
        thirdParty.toast.hide()

        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT,
                receivedData: json.data.result,
                category: json.data.jrCategory,
                issuedate: issuedate,
                endissuedate: endissuedate,
                projectItem,
                runningItem,
                tableName: 'Income'
            })
        }
	})
}

// 类型
export const getProjectTypeBalanceListFromSwitchPeriodOrProject = (issuedate, endissuedate, projectItem, typeItem) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getProjectYebReport', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        jrJvTypeUuid: typeItem.get('name') === '全部' ? '' : typeItem.get('jrJvTypeUuid'),
        isType: true

	}),json => {
        thirdParty.toast.hide()

        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT,
                receivedData: json.data.result,
                category: json.data.jrType,
                issuedate: issuedate,
                endissuedate: endissuedate,
                projectItem,
                typeItem,
                tableName: 'Type'
            })
        }
	})
}

export const changeProjectYebTable = (issuedate, endissuedate,tableName) => (dispatch,getState) => {
    const projectYebState = getState().projectYebState
    const currentProjectItem = projectYebState.getIn(['views','currentProjectItem'])

    const newRunningItem = {
        jrCategoryUuid: '',
        jrCategoryName: '全部流水类别',
        value: '全部流水类别',
        direction: 'double_credit'
    }

    const newTypeItem = {
        jrJvTypeUuid: '',
        typeName: '全部类型',
        value: '全部类型',
        direction: 'double_credit'
    }
    const newProjectItem = {
        uuid: '',
        name: '全部',
        value: '全部',
        top: false,
    }
    if(tableName === 'Income'){
        dispatch(getProjectYebCategoryFetch(issuedate, endissuedate,'Type',currentProjectItem))
        dispatch(getProjectTypeBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, currentProjectItem, fromJS(newTypeItem)))
        dispatch({
            type: ActionTypes.CHANGE_PROJECT_YEB_TABLE,
            value:'Type'
        })
    }else{
        dispatch(getProjectYebCategoryFetch(issuedate, endissuedate,'Income',currentProjectItem))
        dispatch(getProjectYebBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, currentProjectItem, fromJS(newRunningItem)))
        dispatch({
            type: ActionTypes.CHANGE_PROJECT_YEB_TABLE,
            value:'Income'
        })
    }
}

export const changeProjectYebChooseValue = (value) => ({
      type: ActionTypes.CHANGE_PROJECT_YEB_CHOOSE_VALUE,
      value,
})

export const initState = () => ({
      type: ActionTypes.INIT_PROJECT_YEB
})
