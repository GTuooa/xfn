import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

export const getPeriodAndProjectYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
	fetchApi('getProjectYebReport', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: '',
        cardCategoryUuid: '',
        jrCategoryUuid: '',
        needPeriod: 'true',
        isType: false,
        analyse: '0'
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

        if (showMessage(json)) {
            const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_PERIOD_AND_PROJECT_YEB_BALANCE_LIST,
                receivedData: json.data.result,
                issuedate: issuedate ? issuedate : openedissuedate,
                endissuedate: endissuedate ? endissuedate : openedissuedate
            })
        }
	})
}
// 收支
export const getProjectYebBalanceListFromSwitchPeriodOrProject = (issuedate, endissuedate, projectItem, runningItem,analyse) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getProjectYebReport', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        jrCategoryUuid: runningItem.get('name') === '全部' ? '' : runningItem.get('jrCategoryUuid'),
        jrJvTypeUuid: '',
        isType: false,
        analyse
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT,
                receivedData: json.data.result,
                category: json.data.jrCategory,
                issuedate: issuedate,
                endissuedate: endissuedate,
                projectItem,
                runningItem,
                tableName: 'Income',
            })
        }
	})
}
export const getProjectYebBalanceListFromSwitchPeriod = (issuedate, endissuedate, projectItem,runningItem,analyse) => (dispatch,getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const oldCategory = getState().projectYebState.get('categoryList')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getProjectYebIncomeCategory`, 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        analyse
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
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }else{
                        if(newProjectItem.get('uuid') === item.uuid){
                            hasItem = true
                        }
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
                    jrCategoryName: '全部',
                    value: '全部',
                    direction: 'double_credit'
                })
            }else if(json.data.jrCategory.length > 0) {
                const loop = ( data ) => data.map((item, i) => {
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }else{
                        if(newRunningItem.get('jrCategoryUuid') === item.jrCategoryUuid){
                            hasRunningItem = true
                        }
                    }
                })
                loop(json.data.jrCategory)
            }
            if(!hasItem){
                newRunningItem = fromJS({
                    jrCategoryUuid: '',
                    jrCategoryName: '全部',
                    value: '全部',
                    direction: 'double_credit'
                })

            }

            fetchApi('getProjectYebReport', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? newProjectItem.get('uuid') : ''),
                cardCategoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? '' : newProjectItem.get('uuid')),
                jrCategoryUuid: newRunningItem.get('name') === '全部' ? '' : newRunningItem.get('jrCategoryUuid') ,
                jrJvTypeUuid: '',
                isType: false,
                analyse
            }),json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT,
                        receivedData: json.data.result,
                        issuedate: issuedate,
                        endissuedate: endissuedate,
                        projectItem: newProjectItem,
                        runningItem: newRunningItem,
                        tableName: 'Income',
                        category: json.data.jrCategory
                    })
                }
            })



        }
    })
}
// 类型
export const getProjectTypeBalanceListFromSwitchPeriodOrProject = (issuedate, endissuedate, projectItem, typeItem) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getProjectYebReport', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        jrJvTypeUuid: typeItem.get('name') === '全部' ? '' : typeItem.get('jrJvTypeUuid'),
        isType: true

	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

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
export const getProjectTypeBalanceListFromSwitchPeriod = (issuedate, endissuedate, projectItem,typeItem) => (dispatch,getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const oldCategory = getState().projectYebState.get('categoryList')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getProjectYebTypeCategory`, 'POST', JSON.stringify({
        begin,
        end,
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
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }else{
                        if(newProjectItem.get('uuid') === item.uuid){
                            hasItem = true
                        }
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
                    typeName: '全部',
                    value: '全部',
                    direction: 'double_credit'
                })
            }else if(newCategroyList.length > 0) {
                const loop = ( data ) => data.map((item, i) => {
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }else{
                        if(newTypeItem.get('jrJvTypeUuid') === item.jrJvTypeUuid){
                            hasTypeItem = true
                        }
                    }
                })
                loop(newCategroyList)
            }
            if(!hasItem){
                newTypeItem = fromJS({
                    jrJvTypeUuid: '',
                    typeName: '全部',
                    value: '全部',
                    direction: 'double_credit'
                })

            }

            fetchApi('getProjectYebReport', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? newProjectItem.get('uuid') : ''),
                cardCategoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? '' : newProjectItem.get('uuid')),
                jrCategoryUuid: '',
                jrJvTypeUuid: newTypeItem.get('name') === '全部' ? '' : newTypeItem.get('jrJvTypeUuid'),
                isType: true
            }),json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT,
                        receivedData: json.data.result,
                        issuedate: issuedate,
                        endissuedate: endissuedate,
                        projectItem: newProjectItem,
                        typeItem: newTypeItem,
                        tableName: 'Type',
                        category: json.data.jrType
                    })
                }
            })



        }
    })
}

export const getProjectYebBalanceListRefresh = (issuedate, endissuedate, currentProjectItem,typeOrCategoryItem,tableName = 'Income',analyse) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getProjectYebReport', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
        jrCategoryUuid: typeOrCategoryItem.get('name') === '全部' ? '' : tableName === 'Income' ? typeOrCategoryItem.get('jrCategoryUuid') :  '',
        jrJvTypeUuid: typeOrCategoryItem.get('name') === '全部' ? '' : tableName === 'Income' ? '' : typeOrCategoryItem.get('jrJvTypeUuid'),
        needPeriod: 'true',
        isType: tableName === 'Income' ? false : true,
        analyse

	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_REFRESH,
                receivedData: json.data.result,
                tableName,
                category: tableName === 'Income' ? json.data.jrCategory : json.data.jrType
            })
        }
	})
}

export const getProjectYebCategoryFetch = (issuedate, endissuedate,name,fromReflash = false,projectItem,analyse) => dispatch => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi(`getProjectYeb${name}Category`, 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        analyse
    }), json => {
        if (showMessage(json)) {
            if(name === 'Income'){
                dispatch({
                    type: ActionTypes.GET_PROJECT_YEB_CATEGORY_FETCH,
                    categoryList: json.data.cardCategory,
                    jrCategory: json.data.jrCategory,
                    fromReflash
                })
            }else{
                dispatch({
                    type: ActionTypes.GET_PROJECT_YEB_TYPE_CATEGORY_FETCH,
                    categoryList: json.data.cardCategory,
                    jrType: json.data.jrType,
                    fromReflash
                })
            }


        }
    })
}
export const changeTabIncomeOrType = (issuedate, endissuedate,tableName,projectItem,runningItem,analyse) => (dispatch,getState) => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const oldCategory = getState().projectYebState.get('categoryList')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getProjectYeb${tableName}Category`, 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        analyse
    }), json => {
        if (showMessage(json)) {
            if(tableName === 'Income'){
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
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }
                    if(newProjectItem.get('uuid') === item.uuid){
                        hasItem = true
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

            fetchApi('getProjectYebReport', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? newProjectItem.get('uuid') : ''),
                cardCategoryUuid: newProjectItem.get('name') === '全部' ? '' : (newProjectItem.get('top') ? '' : newProjectItem.get('uuid')),
                jrCategoryUuid: tableName === 'Income' ? runningItem.get('name') === '全部' ? '' : runningItem.get('jrCategoryUuid') : '',
                jrJvTypeUuid: tableName === 'Type' ? runningItem.get('name') === '全部' ? '' : runningItem.get('jrCategoryUuid') : '',
                isType: tableName === 'Income' ? false : true,
                analyse
            }),json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT,
                        receivedData: json.data.result,
                        issuedate: issuedate,
                        endissuedate: endissuedate,
                        projectItem: newProjectItem,
                        runningItem,
                        typeItem: runningItem,
                        tableName,
                        category: tableName === 'Income' ? json.data.jrCategory : json.data.jrType
                    })
                }
            })



        }else{
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}
// export const getProjectYebJrTypeFetch = (issuedate, endissuedate) => dispatch => {
//     fetchApi('getProjectReportRunningCategory', 'POST', JSON.stringify({
//         begin,
//         end,
//         cardUuid: ''
//     }), json => {
//         if (showMessage(json)) {
//             dispatch({
//                 type: ActionTypes.GET_PROJECT_YEB_RUNNING_CATEGORY_FETCH,
//                 receivedData: json.data.categoryList
//             })
//
//         }
//     })
// }

export const changeProjectYebChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_PROJECT_YEB_CHOOSE_VALUE,
    chooseValue
})

export const changeProjectYebChildItemShow = (key, parentKey) => (dispatch,getState) =>{
    const projectYebState = getState().projectYebState
    const balanceList = projectYebState.getIn(['balanceReport','childList'])
    let totalNumber = 0
    const loop = (data) => data.map(item =>{
        if (item.get('childList') && item.get('childList').size) {
            loop(item.get('childList'))
        }
        totalNumber++
    })
    loop(balanceList)
    dispatch({
        type: ActionTypes.CHANGE_PROJECT_YEB_CHILD_ITEM_SHOW,
        key,
        parentKey,
        totalNumber,
    })
}

export const changeProjectYebTable = (value) => ({
    type: ActionTypes.CHANGE_PROJECT_YEB_TABLE,
    value
})

export const changeProjectYebAnalysisValue = (value) => ({
    type: ActionTypes.CHANGE_PROJECT_YEB_ANALYSIS_VALUE,
    value
})
