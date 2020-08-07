import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { fromJS } from 'immutable'

import * as allActions from 'app/redux/Home/All/other.action'

// 收支 Yeb 跳来的
export const getProjectMxbBalanceListFromProjectYeb = (issuedate, endissuedate, projectCardItem,currentRunningItem,currentProjectItem,history) => (dispatch, getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }
    const projectYebState = getState().projectYebState
    // const currentProjectItem = projectYebState.getIn(['views', 'currentProjectItem'])

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
        currentPage: 1,
        pageSize: '',
        needPeriod: 'true',
    }), json => {
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []

            if (json.data.cardList.length) { // 有卡片
                let allCardUUidList = []
                json.data.cardList.map(item => {
                    allCardUUidList.push(item.uuid)
                })
                fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                    begin: issuedate,
                    end: endissuedate,
                    currentPage: 1,
                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                    direction: currentRunningItem.get('direction'),

                    jrAbstract: '',
                    cardUuidList: projectCardItem.get('uuid') ? typeof projectCardItem.get('uuid') === 'string' ? [projectCardItem.get('uuid')] : projectCardItem.get('uuid') : allCardUUidList,
                    jrTypeUuid: '',
                    jrCategoryUuid: currentRunningItem.get('jrCategoryUuid'),
                }), reportList => {
                    thirdParty.toast.hide()
                    if (showMessage(reportList)) {
                        dispatch({
                            type: ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB,
                            receivedData: json.data,
                            reportData: reportList.data,
                            issuedate,
                            endissuedate,
                            projectCardItem,
                            currentProjectItem,
                            runningJrTypeItem:currentRunningItem,
                            tableName: 'Income',
                            needPeriod: 'true',
                            issues
                        })
                    }
                })
                // 获取默认卡片下的流水类别和类型
                dispatch(getProjectMxbRunningCategoryFetch(issuedate, endissuedate, projectCardItem.get('uuid'),currentRunningItem))
            } else {
                thirdParty.toast.hide()

                dispatch({
                    type: ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB,
                    receivedData: json.data,
                    reportData: '',
                    issuedate,
                    endissuedate,
                    projectCardItem,
                    currentProjectItem,
                    tableName: 'Income',
                    needPeriod: 'true',
                    issues
                })
            }
        } else {
            thirdParty.toast.hide()
        }
    })

    // 获取往来类别
    dispatch(getProjectMxbCategoryFetch(issuedate, endissuedate))

    history.push('projectmxb')
}
// 类型 Yeb 跳来的
export const getProjectTypeMxbBalanceListFromProjectYeb = (issuedate, endissuedate, projectCardItem,currentJrTypeItem,currentProjectItem,history) => (dispatch, getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate: ''
    const projectYebState = getState().projectYebState
    // const currentProjectItem = projectYebState.getIn(['views', 'currentProjectItem'])

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
        begin: begin,
        end: end,
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
        currentPage: 1,
        pageSize: '',
        needPeriod: 'true',
    }), json => {
        if (showMessage(json)) {

            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            const runningJrTypeItem = fromJS({
                ...currentJrTypeItem.toJS(),
                // mergeName: currentJrTypeItem.get('typeName'),
            })
            if (json.data.cardList.length) { // 有卡片
                let allCardUUidList = []
                json.data.cardList.map(item => {
                  allCardUUidList.push(item.uuid)
                })
                fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    currentPage: 1,
                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                    direction: currentJrTypeItem.get('direction'),

                    jrAbstract: '',
                    cardUuidList: projectCardItem.get('uuid') ? typeof projectCardItem.get('uuid') === 'string' ? [projectCardItem.get('uuid')] : projectCardItem.get('uuid') : allCardUUidList,
                    jrTypeUuid: currentJrTypeItem.get('jrJvTypeUuid'),
                    jrCategoryUuid: '',
                    categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
                    cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
                }), reportList => {
                    thirdParty.toast.hide()
                    if (showMessage(reportList)) {

                        dispatch({
                            type: ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB,
                            receivedData: json.data,
                            reportData: reportList.data,
                            issuedate,
                            endissuedate,
                            projectCardItem,
                            currentProjectItem,
                            runningJrTypeItem,
                            tableName: 'Type',
                            needPeriod: 'true',
                            issues
                        })
                    }
                })
                // 获取默认卡片下的流水类别和类型
                dispatch(getProjectMxbTypeFetch(issuedate, endissuedate, projectCardItem.get('uuid'),runningJrTypeItem))
            } else {
                thirdParty.toast.hide()

                dispatch({
                    type: ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB,
                    receivedData: json.data,
                    reportData: '',
                    issuedate,
                    endissuedate,
                    projectCardItem,
                    currentProjectItem,
                    tableName: 'Type',
                    needPeriod: 'true',
                    issues
                })
            }
        } else {
            thirdParty.toast.hide()
        }
    })

    // 获取往来类别
    dispatch(getProjectMxbCategoryFetch(issuedate, endissuedate,true))

    history.push('projectmxb')
}

// 获取某卡片下的流水类别和类型
export const getProjectMxbRunningCategoryFetch = (issuedate, endissuedate, cardUuid,currentRunningItem) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const currentRunningCategoryItem = currentRunningItem ? currentRunningItem : getState().projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const cardList = getState().projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        cardUuidList: cardUuid ? typeof cardUuid === 'string' ? [cardUuid] : cardUuid : allCardUUidList
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                receivedData: json.data,
                currentRunningCategoryItem
            })
        }
    })
}
export const getProjectMxbTypeFetch = (issuedate, endissuedate, cardUuid, currentJrTypeItem) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const currentRunningTypeItem = currentJrTypeItem ? currentJrTypeItem : getState().projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    const cardList = getState().projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    fetchApi('getProjectMxbType', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        cardUuidList: cardUuid ? typeof cardUuid === 'string' ? [cardUuid] : cardUuid  : allCardUUidList
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                receivedData: json.data,
                currentRunningTypeItem
            })
        }
    })
}

// 获取项目类别
export const getProjectMxbCategoryFetch = (issuedate, endissuedate,isType = false) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        isType
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: json.data
            })
        }
    })
}

// 收支 切换账期
export const getProjectMxbBalanceListFromChangePeriod = (issuedate, endissuedate, currentCardItem, direction = 'credit') => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate: ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])

    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        isType: false
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data
            })
            let newProjectItem = currentProjectItem
            let hasItem = false
            const loop = (data) => data.map(item => {
                if(item.uuid === currentProjectItem.get('uuid')){
                    hasItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonCategory.data)
            if(!hasItem){
                newProjectItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }

            fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                currentPage: 1,
                pageSize: '',
            }), json => {
                if (showMessage(json)) {

                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                            cardItem = currentCardItem.toJS()
                        } else {
                            cardItem = json.data.cardList[0]
                        }
                        let allCardUUidList = []
                        json.data.cardList.map(item => {
                            allCardUUidList.push(item.uuid)
                        })

                        const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
                        let newRunningItem = currentRunningCategoryItem
                        let hasRunningItem = false
                        fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
                            begin,
                            end,
                            cardUuidList: cardItem.uuid ? typeof cardItem.uuid === 'string' ? [cardItem.uuid] : cardItem.uuid : allCardUUidList
                        }), jsonRunningCategory => {
                            if (showMessage(jsonRunningCategory)) {
                                const loop = (data) => data && data.map(item => {
                                    if(item.jrCategoryUuid === currentRunningCategoryItem.get('jrCategoryUuid')){
                                        hasRunningItem = true
                                    }
                                    if(item.childList && item.childList.length){
                                        loop(item.childList)
                                    }
                                })
                                loop(jsonRunningCategory.data.categoryList)
                                if(!hasRunningItem){
                                    newRunningItem = fromJS({
                                        jrCategoryUuid: '',
                                        jrCategoryName: '全部流水类别',
                                        direction: 'double_credit'
                                    })

                                }
                                dispatch({
                                    type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                                    receivedData: jsonRunningCategory.data,
                                    currentRunningCategoryItem: newRunningItem
                                })
                                fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                                    begin,
                                    end,
                                    currentPage: 1,
                                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                                    direction: newRunningItem.get('direction'),

                                    jrAbstract: '',
                                    cardUuidList: cardItem.uuid ? typeof cardItem.uuid === 'string' ? [cardItem.uuid] : cardItem.uuid : allCardUUidList,
                                    jrTypeUuid: '',
                                    jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                                }), reportList => {
                                    thirdParty.toast.hide()
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            direction: newRunningItem.get('direction'),
                                            cardItem: cardItem,
                                            currentRunningCategoryItem: newRunningItem,
                                            currentProjectItem: newProjectItem
                                        })
                                    }
                                })
                            }
                        })

                    } else {
                        thirdParty.toast.hide()
                        const newRunningItem = fromJS({
                            jrCategoryUuid: '',
                            jrCategoryName: '全部流水类别',
                            direction: 'double_credit'
                        })
                        dispatch({type:ActionTypes.PROJECT_MXB_CLEAR_CATEGORY_OR_TYPE})
                        dispatch({
                            type: ActionTypes.GET_PERIOD_AND_PROJECT_MXB_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: '',
                            issuedate,
                            endissuedate,
                            cardItem: null,
                            currentRunningCategoryItem: newRunningItem

                        })
                    }
                } else {
                    thirdParty.toast.hide()
                }
            })
        }
    })
}
// 类型 切换账期
export const getProjectTypeMxbBalanceListFromChangePeriod = (issuedate, endissuedate, currentCardItem, direction = 'credit') => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate: ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])

    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        isType: true
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data
            })
            let newProjectItem = currentProjectItem
            let hasItem = false
            const loop = (data) => data && data.map(item => {
                if(item.uuid === currentProjectItem.get('uuid')){
                    hasItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonCategory.data)
            if(!hasItem){
                newProjectItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }

            fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                currentPage: 1,
                pageSize: '',
            }), json => {
                if (showMessage(json)) {

                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                            cardItem = currentCardItem.toJS()
                        } else {
                            cardItem = json.data.cardList[0]
                        }
                        const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])
                        let newTypeItem = currentRunningTypeItem
                        let hasTypeItem = false
                        let allCardUUidList = []
                        json.data.cardList.map(item => {
                            allCardUUidList.push(item.uuid)
                        })
                        fetchApi('getProjectMxbType', 'POST', JSON.stringify({
                            begin: issuedate ? issuedate : '',
                            end: endissuedate ? endissuedate : '',
                            cardUuidList: cardItem.uuid ? typeof cardItem.uuid === 'string' ? [cardItem.uuid] : cardItem.uuid : allCardUUidList
                        }), jsonType => {
                            if (showMessage(jsonType)) {
                                const loop = (data) => data && data.map(item => {
                                    if(item.jrJvTypeUuid === currentRunningTypeItem.get('jrJvTypeUuid')){
                                        hasTypeItem = true
                                    }
                                    if(item.childList && item.childList.length){
                                        loop(item.childList)
                                    }
                                })
                                loop(jsonType.data.childList)
                                if(!hasTypeItem){
                                    newTypeItem = fromJS({
                                        jrJvTypeUuid: '',
                                        typeName: '全部类型',
                                        value: '全部类型',
                                        direction: 'double_credit'
                                    })

                                }
                                dispatch({
                                    type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                                    receivedData: jsonType.data,
                                    currentRunningTypeItem: newTypeItem
                                })
                                fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                                    begin,
                                    end,
                                    currentPage: 1,
                                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                                    direction: newTypeItem.get('direction'),

                                    jrAbstract: '',
                                    cardUuidList: cardItem.uuid ? typeof cardItem.uuid === 'string' ? [cardItem.uuid] : cardItem.uuid : allCardUUidList,
                                    jrTypeUuid: newTypeItem.get('jrJvTypeUuid'),
                                    jrCategoryUuid: '',
                                    categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                                    cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                                }), reportList => {
                                    thirdParty.toast.hide()
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            cardItem: cardItem,
                                            direction: newTypeItem.get('direction'),
                                            currentProjectItem: newProjectItem,
                                            currentRunningTypeItem: newTypeItem
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        thirdParty.toast.hide()
                        const newTypeItem = fromJS({
                            jrJvTypeUuid: '',
                            typeName: '全部类型',
                            value: '全部类型',
                            direction: 'double_credit'
                        })
                        dispatch({
                            type: ActionTypes.GET_PERIOD_AND_PROJECT_MXB_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: '',
                            issuedate,
                            endissuedate,
                            cardItem: null,
                            currentRunningTypeItem: newTypeItem
                        })
                    }
                } else {
                    thirdParty.toast.hide()
                }
            })
        }
    })
}



export const getPeriodAndProjectMxbBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate : ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])
    const currentCardItem = projectMxbState.getIn(['views','currentCardItem'])

    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        isType: false
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data
            })
            let newProjectItem = currentProjectItem
            let hasItem = false
            const loop = (data) => data.map(item => {
                if(item.uuid === currentProjectItem.get('uuid')){
                    hasItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonCategory.data)
            if(!hasItem){
                newProjectItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }

            fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                currentPage: 1,
                pageSize: '',
                needPeriod: 'true'
            }), json => {
                if (showMessage(json)) {
                    const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
                    const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
                    const fetchDate = openedissuedate.substr(0, 4) + '-' + openedissuedate.substr(5, 2)
                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                            cardItem = currentCardItem.toJS()
                        } else {
                            cardItem = json.data.cardList[0]
                        }
                        const newRunningItem = fromJS({
                            jrCategoryUuid: '',
                            jrCategoryName: '全部流水类别',
                            direction: 'double_credit'
                        })
                        let allCardUUidList = []
                        json.data.cardList.map(item => {
                            allCardUUidList.push(item.uuid)
                        })
                        fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
                            begin: issuedate ? begin : fetchDate,
                            end: endissuedate ? end : '',
                            cardUuidList: cardItem.uuid ? typeof cardItem.uuid === 'string' ? [cardItem.uuid] : cardItem.uuid : allCardUUidList
                        }), jsonRunningCategory => {
                            if (showMessage(jsonRunningCategory)) {

                                dispatch({
                                    type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                                    receivedData: jsonRunningCategory.data,
                                    currentRunningCategoryItem:newRunningItem
                                })
                                fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                                    begin: issuedate ? begin : fetchDate,
                                    end: endissuedate ? end : '',
                                    currentPage: 1,
                                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                                    direction: newRunningItem.get('direction'),

                                    jrAbstract: '',
                                    cardUuidList: cardItem.uuid ? typeof cardItem.uuid === 'string' ? [cardItem.uuid] : cardItem.uuid : allCardUUidList,
                                    jrTypeUuid: '',
                                    jrCategoryUuid: '',
                                }), reportList => {
                                    thirdParty.toast.hide()
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            cardItem: cardItem,
                                            direction: newRunningItem.get('direction'),
                                            currentProjectItem: newProjectItem,
                                            currentRunningCategoryItem: newRunningItem
                                        })
                                    }
                                })
                            }
                        })

                    } else {
                        thirdParty.toast.hide()
                        const newRunningItem = fromJS({
                            jrCategoryUuid: '',
                            jrCategoryName: '全部流水类别',
                            direction: 'double_credit'
                        })
                        dispatch({type:ActionTypes.PROJECT_MXB_CLEAR_CATEGORY_OR_TYPE})
                        dispatch({
                            type: ActionTypes.GET_PERIOD_AND_PROJECT_MXB_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: '',
                            issuedate,
                            endissuedate,
                            cardItem: null,
                            currentRunningCategoryItem: newRunningItem

                        })
                    }
                } else {
                    thirdParty.toast.hide()
                }
            })
        }
    })

}

export const getPeriodAndProjecTypetMxbBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate: ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])
    const currentCardItem = projectMxbState.getIn(['views','currentCardItem'])

    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        isType: true
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data
            })
            let newProjectItem = currentProjectItem
            let hasItem = false
            const loop = (data) => data.map(item => {
                if(item.uuid === currentProjectItem.get('uuid')){
                    hasItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonCategory.data)
            if(!hasItem){
                newProjectItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }

            fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                currentPage: 1,
                pageSize: '',
            }), json => {
                if (showMessage(json)) {

                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                            cardItem = currentCardItem.toJS()
                        } else {
                            cardItem = json.data.cardList[0]
                        }
                        let allCardUUidList = []
                        json.data.cardList.map(item => {
                            allCardUUidList.push(item.uuid)
                        })
                        const newTypeItem = fromJS({
                            jrJvTypeUuid: '',
                            typeName: '全部类型',
                            value: '全部类型',
                            direction: 'double_credit'
                        })
                        fetchApi('getProjectMxbType', 'POST', JSON.stringify({
                            begin,
                            end,
                            cardUuidList: cardItem.uuid ? typeof cardItem.uuid === 'string' ? [cardItem.uuid] : cardItem.uuid : allCardUUidList
                        }), jsonType => {
                            if (showMessage(jsonType)) {

                                dispatch({
                                    type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                                    receivedData: jsonType.data,
                                    currentRunningTypeItem: newTypeItem
                                })
                                fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                                    begin,
                                    end,
                                    currentPage: 1,
                                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                                    direction: newTypeItem.get('direction'),

                                    jrAbstract: '',
                                    cardUuidList: cardItem.uuid ? typeof cardItem.uuid === 'string' ? [cardItem.uuid] : cardItem.uuid : allCardUUidList,
                                    jrTypeUuid: '',
                                    jrCategoryUuid: '',
                                    categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                                    cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                                }), reportList => {
                                    thirdParty.toast.hide()
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            cardItem: cardItem,
                                            direction: newTypeItem.get('direction'),
                                            currentProjectItem: newProjectItem,
                                            currentRunningCategoryItem: newTypeItem
                                        })
                                    }
                                })
                            }
                        })

                    } else {
                        thirdParty.toast.hide()
                        const newTypeItem = fromJS({
                            jrJvTypeUuid: '',
                            typeName: '全部类型',
                            value: '全部类型',
                            direction: 'double_credit'
                        })
                        dispatch({type:ActionTypes.PROJECT_MXB_CLEAR_CATEGORY_OR_TYPE})
                        dispatch({
                            type: ActionTypes.GET_PERIOD_AND_PROJECT_MXB_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: '',
                            issuedate,
                            endissuedate,
                            cardItem: null,
                            currentRunningTypeItem: newTypeItem

                        })
                    }
                } else {
                    thirdParty.toast.hide()
                }
            })
        }
    })

}

// 切换表格
export const changeProjectMxbTable = () => (dispatch,getState) => {
    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.getIn(['views','issuedate'])
    const endissuedate = projectMxbState.getIn(['views','endissuedate'])
    const tableName = projectMxbState.getIn(['views','tableName'])
    if(tableName === 'Income'){
        dispatch(getPeriodAndProjecTypetMxbBalanceList(issuedate,endissuedate))
        dispatch({
            type: ActionTypes.CHANGE_PROJECT_MXB_TABLE,
            value: 'Type'
        })
    }else{
        dispatch(getPeriodAndProjectMxbBalanceList(issuedate,endissuedate))
        dispatch({
            type: ActionTypes.CHANGE_PROJECT_MXB_TABLE,
            value: 'Income'
        })
    }

}

// 切换往来收支项目类别
export const getProjectMxbBalanceListFromProject = (projectItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.getIn(['views','issuedate'])
    const endissuedate = projectMxbState.getIn(['views','endissuedate'])

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate : ''

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        currentPage: 1,
        pageSize: '',
    }), json => {
        if (showMessage(json)) {
            if (json.data.cardList.length) { // 有卡片

                fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    currentPage: 1,
                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                    direction: 'credit',
                    jrAbstract: '',
                    cardUuidList: [json.data.cardList[0].uuid],
                    jrTypeUuid: '',
                    jrCategoryUuid: '',
                }), reportList => {
                    thirdParty.toast.hide()
                    if (showMessage(reportList)) {
                        dispatch({
                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT,
                            receivedData: json.data,
                            reportData: reportList.data,
                            projectItem,
                            cardItem: json.data.cardList[0],
                        })
                    }
                })
                // 获取默认卡片下的流水类别和类型
                dispatch(getProjectMxbRunningCategoryFetch(issuedate, endissuedate, json.data.cardList[0].uuid))
            } else {
                thirdParty.toast.hide()

                dispatch({
                    type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT,
                    receivedData: json.data,
                    reportData: null,
                    projectItem,
                    cardItem: null
                })
            }
        } else {
            thirdParty.toast.hide()
        }
    })
}

// 切换往来类型项目类别
export const getProjectTypeMxbBalanceListFromProject = (projectItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.getIn(['views','issuedate'])
    const endissuedate = projectMxbState.getIn(['views','endissuedate'])

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate : ''

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.REPORT_LIMIE_LENGTH,
    }), json => {
        if (showMessage(json)) {
            if (json.data.cardList.length) { // 有卡片

                fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    currentPage: 1,
                    pageSize: Limit.REPORT_LIMIE_LENGTH,
                    direction: 'credit',
                    jrAbstract: '',
                    cardUuidList: [json.data.cardList[0].uuid],
                    jrTypeUuid: '',
                    jrCategoryUuid: '',
                    categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
                    cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
                }), reportList => {
                    thirdParty.toast.hide()
                    if (showMessage(reportList)) {
                        dispatch({
                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT,
                            receivedData: json.data,
                            reportData: reportList.data,
                            projectItem,
                            cardItem: json.data.cardList[0],
                        })
                    }
                })
                // 获取默认卡片下的流水类别和类型
                dispatch(getProjectMxbTypeFetch(issuedate, endissuedate, json.data.cardList[0].uuid))
            } else {
                thirdParty.toast.hide()

                dispatch({
                    type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT,
                    receivedData: json.data,
                    reportData: null,
                    projectItem,
                    cardItem: null
                })
            }
        } else {
            thirdParty.toast.hide()
        }
    })
}
// 切换项目收支卡片
export const getProjectMxbBalanceListFromCardItem = (cardItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.getIn(['views','issuedate'])
    const endissuedate = projectMxbState.getIn(['views','endissuedate'])
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        item.get('uuid') && allCardUUidList.push(item.get('uuid'))
    })

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate : issuedate ? issuedate : ''

    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])

    const selectDirction = chooseDirection === 'double_debit' || chooseDirection === 'double_credit' ? chooseDirection : 'double_credit'

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    let newRunningItem = currentRunningCategoryItem
    let hasRunningItem = false
    fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
        begin,
        end,
        cardUuidList: cardItem.get('uuid') ? typeof cardItem.get('uuid') === 'string' ? [cardItem.get('uuid')] : cardItem.get('uuid') : allCardUUidList
    }), jsonRunningCategory => {
        if (showMessage(jsonRunningCategory)) {
            const loop = (data) => data && data.map(item => {
                if(item.jrCategoryUuid === currentRunningCategoryItem.get('jrCategoryUuid')){
                    hasRunningItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonRunningCategory.data.categoryList)
            if(!hasRunningItem){
                newRunningItem = fromJS({
                    jrCategoryUuid: '',
                    jrCategoryName: '全部流水类别',
                    direction: 'double_credit'
                })

            }
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                receivedData: jsonRunningCategory.data,
                currentRunningCategoryItem: newRunningItem
            })
            fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                begin,
                end,
                currentPage: 1,
                pageSize: Limit.REPORT_LIMIE_LENGTH,
                direction: newRunningItem.get('direction'),

                jrAbstract: '',
                cardUuidList: cardItem.get('uuid') ? typeof cardItem.get('uuid') === 'string' ? [cardItem.get('uuid')] : cardItem.get('uuid') : allCardUUidList,                jrTypeUuid: '',
                jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
            }), reportList => {
                thirdParty.toast.hide()
                if (showMessage(reportList)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CARD_ITEM,
                        receivedData: reportList.data,
                        cardItem,
                        chooseDirection: selectDirction,
                        currentRunningCategoryItem: newRunningItem
                    })
                }
            })
        }
    })
}
// 切换项目类型卡片
export const getProjectTypeMxbBalanceListFromCardItem = (cardItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.getIn(['views','issuedate'])
    const endissuedate = projectMxbState.getIn(['views','endissuedate'])
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        item.get('uuid') && allCardUUidList.push(item.get('uuid'))
    })
    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate : issuedate ? issuedate : ''

    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])
    const currentProjectItem = projectMxbState.getIn(['views', 'currentProjectItem'])

    const selectDirction = chooseDirection === 'double_debit' || chooseDirection === 'double_credit' ? chooseDirection : 'double_credit'

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    let newTypeItem = currentRunningTypeItem
    let hasTypeItem = false
    fetchApi('getProjectMxbType', 'POST', JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        cardUuidList: cardItem.get('uuid') ? typeof cardItem.get('uuid') === 'string' ? [cardItem.get('uuid')] : cardItem.get('uuid') : allCardUUidList
    }), jsonType => {
        if (showMessage(jsonType)) {
            const loop = (data) => data && data.map(item => {
                if(item.jrJvTypeUuid === currentRunningTypeItem.get('jrJvTypeUuid')){
                    hasTypeItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonType.data.typeList)
            if(!hasTypeItem){
                newTypeItem = fromJS({
                    jrJvTypeUuid: '',
                    typeName: '全部类型',
                    value: '全部类型',
                    direction: 'double_credit'
                })

            }
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                receivedData: jsonType.data,
                currentRunningTypeItem: newTypeItem
            })
            fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                begin,
                end,
                currentPage: 1,
                pageSize: Limit.REPORT_LIMIE_LENGTH,
                direction: newTypeItem.get('direction'),

                jrAbstract: '',
                cardUuidList: cardItem.get('uuid') ? typeof cardItem.get('uuid') === 'string' ? [cardItem.get('uuid')] : cardItem.get('uuid') : allCardUUidList,
                jrTypeUuid: newTypeItem.get('jrJvTypeUuid'),
                jrCategoryUuid: '',
                categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
                cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
            }), reportList => {
                thirdParty.toast.hide()
                if (showMessage(reportList)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CARD_ITEM,
                        receivedData: reportList.data,
                        cardItem,
                        chooseDirection: selectDirction,
                        currentRunningTypeItem: newTypeItem
                    })
                }
            })
        }
    })
}

// 切换 类别
export const getProjectMxbBalanceListFromCategory = (selectType, currentItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.getIn(['views','issuedate'])
    const endissuedate = projectMxbState.getIn(['views','endissuedate'])
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate : ''

    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: 1,
        pageSize: Limit.REPORT_LIMIE_LENGTH,
        direction: currentItem.get('direction'),

        jrAbstract: '',
        cardUuidList: currentCardItem.get('uuid') ? typeof currentCardItem.get('uuid') === 'string' ? [currentCardItem.get('uuid')] : currentCardItem.get('uuid') : allCardUUidList,
        jrTypeUuid: '',
        jrCategoryUuid: currentItem.get('jrCategoryUuid'),
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CATEGORY_OR_TYPE,
                receivedData: json.data,
                selectType,
                currentItem,
            })
        }
    })
}
// 切换 类型
export const getProjectMxbBalanceListFromType = (selectType, currentItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.getIn(['views','issuedate'])
    const endissuedate = projectMxbState.getIn(['views','endissuedate'])
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate : ''

    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])
    const currentProjectItem = projectMxbState.getIn(['views', 'currentProjectItem'])

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: 1,
        pageSize: Limit.REPORT_LIMIE_LENGTH,
        direction: currentItem.get('direction'),

        jrAbstract: '',
        cardUuidList: currentCardItem.get('uuid') ? typeof currentCardItem.get('uuid') === 'string' ? [currentCardItem.get('uuid')] : currentCardItem.get('uuid') : allCardUUidList,
        jrTypeUuid: currentItem.get('jrJvTypeUuid'),
        jrCategoryUuid: '',
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CATEGORY_OR_TYPE,
                receivedData: json.data,
                selectType,
                currentItem,
            })
        }
    })
}

// 分页
export const getProjectMxbBalanceListFromFilterOrPage = (tableName,currentPage=1,shouldConcat, isScroll,_self) => (dispatch, getState) => {
    !isScroll && thirdParty.toast.loading('加载中...', 0)
    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.getIn(['views','issuedate'])
    const endissuedate = projectMxbState.getIn(['views','endissuedate'])

    const begin = issuedate ? issuedate : ''
    const end = endissuedate ? endissuedate : ''
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    const tableName = projectMxbState.getIn(['views', 'tableName'])
    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])
    const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    const currentProjectItem = projectMxbState.getIn(['views', 'currentProjectItem'])
    const url = tableName === 'Type' ? 'getProjectTypeMxbReport' : 'getProjectMxbReport'
    fetchApi(url, 'POST', JSON.stringify({
        begin,
        end,
        currentPage,
        pageSize: Limit.REPORT_LIMIE_LENGTH,
        direction: chooseDirection,
        jrAbstract: '',
        cardUuidList: currentCardItem.get('uuid') ? typeof currentCardItem.get('uuid') === 'string' ? [currentCardItem.get('uuid')] : currentCardItem.get('uuid') : allCardUUidList,
        jrTypeUuid: tableName === 'Type' ? currentRunningTypeItem.get('jrTypeUuid') : '',
        jrCategoryUuid: tableName === 'Type' ? '' : currentRunningCategoryItem.get('jrCategoryUuid'),
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
    }), json => {
        !isScroll && thirdParty.toast.hide()
        if (showMessage(json)) {
            if(isScroll) {
                _self.setState({
                    isLoading: false
                })
            }
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_FILTER_OR_PAGE,
                receivedData: json.data,
                shouldConcat
            })
        }
    })
}

export const changeProjectMxbReportDirection = (direction) => ({
    type: ActionTypes.CHANGE_PROJECT_MXB_REPORT_DIRECTION,
    direction
})

export const changeProjectMxbChooseValue = (value) => ({
      type: ActionTypes.CHANGE_PROJECT_MXB_CHOOSE_VALUE,
      value,
})
