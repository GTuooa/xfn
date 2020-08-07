import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { fromJS } from 'immutable'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

// getRelativeReportCategory 获取往来明细表类别列表
// getRelativeMxbCardList 往来明细表卡片列表
// getRelativeMxbReport 往来明细表 获取往来明细表
// getRelativeMxbCategoryAndType 往来明细表流水类别和类型列表

export const getPeriodAndRelativeMxbBalanceList = () => dispatch => {

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK,
        loadingType: 'add'
    })

    fetchApi('getRelativeMxbCardList', 'POST', JSON.stringify({
        begin: '',
        end: '',
        categoryUuid: '',
        cardCategoryUuid: '',
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
        analysisType: ''
    }), json => {
        if (showMessage(json)) {
            const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))

            if (json.data.cardList.length) { // 有卡片

                const fetchDate = openedissuedate.substr(0, 4) + '-' + openedissuedate.substr(6, 2)

                fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
                    begin: fetchDate,
                    end: fetchDate,
                    currentPage: 1,
                    pageSize: Limit.MXB_PAGE_SIZE,
                    direction: 'credit',
                    needBranch: false,
                    jrAbstract: '',
                    cardUuid: json.data.cardList[0].uuid,
                    selectType: 'category',
                    jrTypeUuid: '',
                    jrCategoryUuid: '',
                    categoryUuid: '',
                    cardCategoryUuid: '',
                    analysisType: '',
                    showAccount: false,
                    showStock: false,
                    showProject: false,
                    showJrCategory: false,
                    accountList: [],
                    projectList: [],
                    stockList: [],
                    jrCategoryList: [],
                    mergeStockBranch: false,
                }), reportList => {

                    dispatch({
                        type: ActionTypes.SWITCH_LOADING_MASK,
                        loadingType: 'minus'
                    })

                    if (showMessage(reportList)) {
                        dispatch({
                            type: ActionTypes.GET_PERIOD_AND_RELATIVE_MXB_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: reportList.data,
                            issuedate: openedissuedate,
                            endissuedate: openedissuedate,
                            cardItem: json.data.cardList[0],
                            analysisType: ''
                        })
                    }
                })
                // 获取默认卡片下的流水类别和类型
                dispatch(getRelativeMxbCategoryAndTypeFetch(openedissuedate, openedissuedate, json.data.cardList[0].uuid))
            } else {
                dispatch({
                    type: ActionTypes.SWITCH_LOADING_MASK,
                    loadingType: 'minus'
                })

                dispatch({
                    type: ActionTypes.GET_PERIOD_AND_RELATIVE_MXB_BALANCE_LIST,
                    receivedData: json.data,
                    reportData: '',
                    issuedate: openedissuedate,
                    endissuedate: openedissuedate,
                    cardItem: null,
                    analysisType: ''
                })
            }
        } else {
            dispatch({
                type: ActionTypes.SWITCH_LOADING_MASK,
                loadingType: 'minus'
            })
        }
    })

    // 获取往来类别
    dispatch(getRelativeMxbCategoryFetch())
}

// 刷新
export const getRelativeMxbBalanceListFresh = () => (dispatch, getState) => {

    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.get('issuedate')
    const endissuedate = relativeMxbState.get('endissuedate')
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }
    const searchContent = relativeMxbState.getIn(['views', 'searchContent'])
    const selectType = relativeMxbState.getIn(['views', 'selectType'])
    const currentRelativeItem = relativeMxbState.getIn(['views', 'currentRelativeItem'])
    const currentCardItem = relativeMxbState.getIn(['views', 'currentCardItem'])
    const currentRunningCategoryItem = relativeMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const currentRunningTypeItem = relativeMxbState.getIn(['views', 'currentRunningTypeItem'])
    const direction = relativeMxbState.getIn(['reportData', 'direction'])
    const chooseDirection = relativeMxbState.getIn(['views', 'chooseDirection'])
    const currentPage = relativeMxbState.getIn(['reportData', 'currentPage'])

    const showAccount = relativeMxbState.getIn(['views', 'showAccount'])
    const showStock = relativeMxbState.getIn(['views', 'showStock'])
    const showProject = relativeMxbState.getIn(['views', 'showProject'])
    const showJrCategory = relativeMxbState.getIn(['views', 'showJrCategory'])

    const accountList = relativeMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const projectList = relativeMxbState.getIn(['commonCardObj', 'chooseProjectCard'])
    const stockList = relativeMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const jrCategoryList = relativeMxbState.getIn(['commonCardObj', 'chooseJrCategoryCard'])
    const analysisType = relativeMxbState.getIn(['views', 'analysisType'])
    const mergeStockBranch = relativeMxbState.getIn(['views', 'mergeStockBranch'])
    const needBranch = relativeMxbState.getIn(['views', 'needBranch'])

    const filterCardObj = {
        showAccount,
        showStock,
        showProject,
        showJrCategory,
        accountList,
        projectList,
        stockList,
        jrCategoryList,
        analysisType
    }

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK,
        loadingType: 'add'
    })

    fetchApi('getRelativeMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
        analysisType,
    }), json => {
        if (showMessage(json)) {

            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))

            if (json.data.cardList.length) { // 有卡片
                let hasCardItem = false
                json.data.cardList.map(item => {
                    if(item.uuid == currentCardItem.get('uuid')){
                        hasCardItem = true
                    }

                })

                if(hasCardItem){//所选卡片不变,若刷新后该卡片不在列表中,重新定位到第一张卡片

                    fetchApi('getRelativeMxbCategoryAndType', 'POST', JSON.stringify({
                        begin,
                        end,
                        cardUuid:currentCardItem.get('uuid'),
                        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
                        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
                        analysisType,
                    }), jsonCategory => {
                        if (showMessage(jsonCategory)) {
                            let hasCategoryItem = false
                            let runningCategoryItem = currentRunningCategoryItem
                            let jrCategoryUuid = currentRunningCategoryItem.get('jrCategoryUuid')
                            let newDirection = chooseDirection
                            if (jsonCategory.data.categoryList.length) {
                                const loop = (data) => data.map(item => {
                                    if(item.jrCategoryUuid == currentRunningCategoryItem.get('jrCategoryUuid')){
                                        hasCategoryItem = true
                                    }
                                    if(item.childList.length > 0){
                                        loop(item.childList)
                                    }
                                })
                                loop(jsonCategory.data.categoryList)
                                if(!hasCategoryItem){//所选流水类别不变；若刷新后该流水类别不在列表中,重新定位到“全部流水类别”。
                                    jrCategoryUuid = ''
                                    runningCategoryItem = {
                                        jrCategoryUuid: '',
                                        jrCategoryName: '全部',
                                        direction: 'double_credit'
                                    }
                                    newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'

                                }

                            }else{
                                jrCategoryUuid == ''
                                runningCategoryItem = {
                                    jrCategoryUuid: '',
                                    jrCategoryName: '全部',
                                    direction: 'double_credit'
                                }
                                newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'
                            }
                            dispatch({
                                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH,
                                receivedData: jsonCategory.data,
                                currentRunningCategoryItem: fromJS(runningCategoryItem)
                            })
                            fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
                                begin,
                                end,
                                currentPage,
                                pageSize: Limit.MXB_PAGE_SIZE,
                                direction: newDirection,
                                jrAbstract: searchContent,
                                cardUuid: currentCardItem.get('uuid'),
                                selectType,
                                needBranch: filterCardObj.analysisType === '' ? needBranch : false,
                                jrTypeUuid: selectType === 'type' ? currentRunningTypeItem.get('jrTypeUuid') : '',
                                jrCategoryUuid: selectType === 'type' ? '' : jrCategoryUuid,
                                categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
                                cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
                                ...filterCardObj,
                                mergeStockBranch: filterCardObj.analysisType === '' ? mergeStockBranch: false,
                            }), reportList => {
                                dispatch({
                                    type: ActionTypes.SWITCH_LOADING_MASK,
                                    loadingType: 'minus'
                                })
                                if (showMessage(reportList)) {
                                    dispatch({
                                        type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_REFRESH,
                                        receivedData: json.data,
                                        reportData: reportList.data
                                    })
                                }
                            })


                        }
                    })


                } else {
                    fetchApi('getRelativeMxbCategoryAndType', 'POST', JSON.stringify({
                        begin,
                        end,
                        cardUuid: '',
                        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
                        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
                        analysisType,
                    }), jsonCategory => {
                        if (showMessage(jsonCategory)) {
                            let hasCategoryItem = false
                            let runningCategoryItem = currentRunningCategoryItem
                            let jrCategoryUuid = currentRunningCategoryItem.get('jrCategoryUuid')
                            let newDirection = chooseDirection
                            if (jsonCategory.data.categoryList.length) {
                                const loop = (data) => data.map(item => {
                                    if(item.jrCategoryUuid == currentRunningCategoryItem.get('jrCategoryUuid')){
                                        hasCategoryItem = true
                                    }
                                    if(item.childList.length > 0){
                                        loop(item.childList)
                                    }
                                })
                                loop(jsonCategory.data.categoryList)
                                if(!hasCategoryItem){//所选流水类别不变；若刷新后该流水类别不在列表中,重新定位到“全部流水类别”。
                                    jrCategoryUuid == ''
                                    runningCategoryItem = {
                                        jrCategoryUuid: '',
                                        jrCategoryName: '全部',
                                        direction: 'double_credit'
                                    }
                                    newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'
                                }

                            }else{
                                jrCategoryUuid == ''
                                runningCategoryItem = {
                                    jrCategoryUuid: '',
                                    jrCategoryName: '全部',
                                    direction: 'double_credit'
                                }
                                newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'
                            }
                            dispatch({
                                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH,
                                receivedData: jsonCategory.data,
                                currentRunningCategoryItem: fromJS(runningCategoryItem)
                            })
                            fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
                                begin,
                                end,
                                currentPage,
                                pageSize: Limit.MXB_PAGE_SIZE,
                                direction: newDirection,
                                jrAbstract: searchContent,
                                cardUuid: '',
                                selectType,
                                needBranch: filterCardObj.analysisType === '' ? needBranch : false,
                                jrTypeUuid: selectType === 'type' ? currentRunningTypeItem.get('jrTypeUuid') : '',
                                jrCategoryUuid: selectType === 'type' ? '' : jrCategoryUuid,
                                categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
                                cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
                                ...filterCardObj,
                                mergeStockBranch: filterCardObj.analysisType === '' ? mergeStockBranch: false,
                            }), reportList => {
                                dispatch({
                                    type: ActionTypes.SWITCH_LOADING_MASK,
                                    loadingType: 'minus'
                                })
                                if (showMessage(reportList)) {
                                    dispatch({
                                        type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_REFRESH,
                                        receivedData: json.data,
                                        reportData: reportList.data
                                    })
                                }
                            })


                        }
                    })
                }

            } else {
                dispatch({
                    type: ActionTypes.SWITCH_LOADING_MASK,
                    loadingType: 'minus'
                })

                dispatch({
                    type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_REFRESH,
                    receivedData: json.data,
                    reportData: '',
                })
            }
        } else {
            dispatch({
                type: ActionTypes.SWITCH_LOADING_MASK,
                loadingType: 'minus'
            })
        }
    })

    // 获取往来类别
    dispatch(getRelativeMxbCategoryFetch(issuedate, endissuedate))
}

// Yeb 跳来的
export const getRelativeMxbBalanceListFromRelativeYeb = (issuedate, endissuedate, relativeCardItem, runningItem, currentRelativeItem) => (dispatch, getState) => {

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }
    dispatch(changeRelativeMxbReportDirection('double_credit'))
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const relativeYebState = getState().relativeYebState
    const relativeMxbState = getState().relativeMxbState
    const analysisType = relativeYebState.getIn(['views', 'analysisType'])
    const needBranch = relativeYebState.getIn(['views', 'needBranch'])


    const mergeStockBranch = relativeMxbState.getIn(['views', 'mergeStockBranch'])
    const filterCardObj = {
        showAccount: false,
        showStock: false,
        showProject: false,
        showJrCategory: false,
        accountList:[],
        projectList: [],
        stockList: [],
        jrCategoryList: [],
        analysisType
    }
    dispatch(filterCardClear())
    dispatch(needBranchClear())

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK,
        loadingType: 'add'
    })
    fetchApi('getRelativeMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
        analysisType,
    }), json => {
        if (showMessage(json)) {

            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))

            if (json.data.cardList.length) { // 有卡片
                let cardItem = {}
                if (json.data.cardList.some(v => v.uuid === relativeCardItem.get('uuid'))) {
                    cardItem = relativeCardItem.toJS()
                } else {
                    cardItem = {
                        uuid: '',
                        name: '全部',
                        code:''
                    }
                }
                let newRunningItem = runningItem
                let hasRunningItem = false
                fetchApi('getRelativeMxbCategoryAndType', 'POST', JSON.stringify({
                    begin,
                    end,
                    cardUuid: cardItem.uuid,
                    categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
                    cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
                    analysisType,
                }), jsonRunningCategory => {
                    if (showMessage(json)) {
                        const loop = (data) => data && data.map(item => {
                            if(item.jrCategoryUuid === runningItem.get('jrCategoryUuid')){
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
                                jrCategoryName: '全部',
                                direction: 'double_credit'
                            })

                        }
                        dispatch({
                            type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH,
                            receivedData: jsonRunningCategory.data,
                            currentRunningCategoryItem: newRunningItem
                        })
                        fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
                            begin,
                            end,
                            currentPage: 1,
                            pageSize: Limit.MXB_PAGE_SIZE,
                            direction: newRunningItem.get('direction'),
                            selectType: 'category',
                            jrAbstract: '',
                            cardUuid: cardItem.uuid,
                            jrTypeUuid: '',
                            needBranch: false,
                            jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                            categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
                            cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
                            ...filterCardObj,
                            mergeStockBranch: false,
                        }), reportList => {
                            dispatch({
                                type: ActionTypes.SWITCH_LOADING_MASK,
                                loadingType: 'minus'
                            })
                            if (showMessage(reportList)) {
                                dispatch({
                                    type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                    receivedData: json.data,
                                    reportData: reportList.data,
                                    issuedate,
                                    endissuedate,
                                    cardItem: cardItem,
                                    direction: newRunningItem.get('direction'),
                                    currentRelativeItem: currentRelativeItem,
                                    currentRunningCategoryItem: newRunningItem
                                })
                            }
                        })
                    }
                })
            } else {
                dispatch({
                    type: ActionTypes.SWITCH_LOADING_MASK,
                    loadingType: 'minus'
                })

                dispatch({
                    type: ActionTypes.GET_RELATIVEMXB_BALANCE_LIST_FROM_RELATIVEYEB,
                    receivedData: json.data,
                    reportData: '',
                    issuedate,
                    endissuedate,
                    relativeCardItem,
                    currentRelativeItem,
                })
            }
        } else {
            dispatch({
                type: ActionTypes.SWITCH_LOADING_MASK,
                loadingType: 'minus'
            })
        }
    })

    // 获取往来类别
    dispatch(getRelativeMxbCategoryFetch(issuedate, endissuedate))
}

// 切换账期
export const getRelativeMxbBalanceListFromChangePeriod = (issuedate, endissuedate, currentCardItem, direction = 'credit') => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''


    const relativeMxbState = getState().relativeMxbState
    const currentRelativeItem = relativeMxbState.getIn(['views','currentRelativeItem'])
    const showAccount = relativeMxbState.getIn(['views', 'showAccount'])
    const showStock = relativeMxbState.getIn(['views', 'showStock'])
    const showProject = relativeMxbState.getIn(['views', 'showProject'])
    const showJrCategory = relativeMxbState.getIn(['views', 'showJrCategory'])

    const accountList = relativeMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const projectList = relativeMxbState.getIn(['commonCardObj', 'chooseProjectCard'])
    const stockList = relativeMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const jrCategoryList = relativeMxbState.getIn(['commonCardObj', 'chooseJrCategoryCard'])
    const analysisType = relativeMxbState.getIn(['views', 'analysisType'])
    const mergeStockBranch = relativeMxbState.getIn(['views', 'mergeStockBranch'])
    const needBranch = relativeMxbState.getIn(['views', 'needBranch'])

    const filterCardObj = {
        showAccount,
        showStock,
        showProject,
        showJrCategory,
        accountList,
        projectList,
        stockList,
        jrCategoryList,
        analysisType
    }

    fetchApi('getRelativeReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        analysisType,
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
            let newRelativeItem = currentRelativeItem
            let hasItem = false
            const loop = (data) => data.map(item => {
                if(item.uuid === currentRelativeItem.get('uuid')){
                    hasItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonCategory.data.cardCategory)
            if(!hasItem){
                newRelativeItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data.cardCategory
            })
            fetchApi('getRelativeMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                currentPage: 1,
                pageSize: Limit.MXB_PAGE_SIZE,
                analysisType,
            }), json => {
                if (showMessage(json)) {

                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                            cardItem = currentCardItem.toJS()
                        } else {
                            cardItem = json.data.cardList[0]
                        }

                        const currentRunningCategoryItem = relativeMxbState.getIn(['views', 'currentRunningCategoryItem'])
                        let newRunningItem = currentRunningCategoryItem
                        let hasRunningItem = false
                        fetchApi('getRelativeMxbCategoryAndType', 'POST', JSON.stringify({
                            begin,
                            end,
                            cardUuid: cardItem.uuid,
                            categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                            cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                            analysisType,
                        }), jsonRunningCategory => {
                            if (showMessage(json)) {
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
                                        jrCategoryName: '全部',
                                        direction: 'double_credit'
                                    })

                                }
                                dispatch({
                                    type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH,
                                    receivedData: jsonRunningCategory.data,
                                    currentRunningCategoryItem: newRunningItem
                                })
                                fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
                                    begin,
                                    end,
                                    currentPage: 1,
                                    pageSize: Limit.MXB_PAGE_SIZE,
                                    direction: newRunningItem.get('direction'),
                                    selectType: 'category',
                                    jrAbstract: '',
                                    cardUuid: cardItem.uuid,
                                    jrTypeUuid: '',
                                    needBranch: filterCardObj.analysisType === '' ? needBranch : false,
                                    jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                                    categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                                    cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                                    ...filterCardObj,
                                    mergeStockBranch: filterCardObj.analysisType === '' ? mergeStockBranch: false,
                                }), reportList => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            cardItem: cardItem,
                                            direction: newRunningItem.get('direction'),
                                            currentRelativeItem: newRelativeItem,
                                            currentRunningCategoryItem: newRunningItem
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        const newRunningItem = fromJS({
                            jrCategoryUuid: '',
                            jrCategoryName: '全部',
                            direction: 'double_credit'
                        })
                        dispatch({type:ActionTypes.RELATIVE_MXB_CLEAR_CATEGORY_OR_TYPE})
                        dispatch({
                            type: ActionTypes.GET_PERIOD_AND_RELATIVE_MXB_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: '',
                            issuedate,
                            endissuedate,
                            cardItem: null,
                            currentRunningCategoryItem: newRunningItem,
                            analysisType,
                        })
                    }
                } else {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            })

        }
    })
}

export const getRelativeMxbBalanceListFromChangeCardList = (issuedate, endissuedate,relativeItem,currentPage) => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const relativeMxbState = getState().relativeMxbState
    const analysisType = relativeMxbState.getIn(['views','analysisType'])

    fetchApi('getRelativeMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? relativeItem.get('uuid') : ''),
        cardCategoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? '' : relativeItem.get('uuid')),
        currentPage,
        pageSize: Limit.MXB_PAGE_SIZE,
        analysisType,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CARD_LIST,
                receivedData: json.data,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 切换往来类别
export const getRelativeMxbBalanceListFromRelative = (relativeItem) => (dispatch, getState) => {

    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.get('issuedate')
    const endissuedate = relativeMxbState.get('endissuedate')

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const searchContent = relativeMxbState.getIn(['views', 'searchContent'])
    const selectType = relativeMxbState.getIn(['views', 'selectType'])
    const chooseDirection = relativeMxbState.getIn(['views', 'chooseDirection'])
    const relativeCardItem = relativeMxbState.getIn(['views', 'currentCardItem'])
    const runningItem = relativeMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const showAccount = relativeMxbState.getIn(['views', 'showAccount'])
    const showStock = relativeMxbState.getIn(['views', 'showStock'])
    const showProject = relativeMxbState.getIn(['views', 'showProject'])
    const showJrCategory = relativeMxbState.getIn(['views', 'showJrCategory'])

    const analysisType = relativeMxbState.getIn(['views', 'analysisType'])
    const mergeStockBranch = relativeMxbState.getIn(['views', 'mergeStockBranch'])
    const needBranch = relativeMxbState.getIn(['views', 'needBranch'])

    const filterCardObj = {
        showAccount,
        showStock,
        showProject,
        showJrCategory,
        accountList:[],
        projectList:[],
        stockList:[],
        jrCategoryList: [],
        analysisType
    }

    dispatch(filterCardClear())
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRelativeMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? relativeItem.get('uuid') : ''),
        cardCategoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? '' : relativeItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        analysisType,
    }), json => {
        if (showMessage(json)) {
            if (json.data.cardList.length) { // 有卡片
                let cardItem = {}
                if (json.data.cardList.some(v => v.uuid === relativeCardItem.get('uuid'))) {
                    cardItem = relativeCardItem.toJS()
                } else {
                    cardItem = json.data.cardList[0]
                }
                let newRunningItem = runningItem
                let hasRunningItem = false
                fetchApi('getRelativeMxbCategoryAndType', 'POST', JSON.stringify({
                    begin,
                    end,
                    cardUuid: cardItem.uuid,
                    categoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? relativeItem.get('uuid') : ''),
                    cardCategoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? '' : relativeItem.get('uuid')),
                    analysisType,
                }), jsonRunningCategory => {
                    if (showMessage(json)) {
                        const loop = (data) => data && data.map(item => {
                            if(item.jrCategoryUuid === runningItem.get('jrCategoryUuid')){
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
                                jrCategoryName: '全部',
                                direction: 'double_credit'
                            })

                        }
                        dispatch({
                            type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH,
                            receivedData: jsonRunningCategory.data,
                            currentRunningCategoryItem: newRunningItem
                        })
                        fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
                            begin,
                            end,
                            currentPage: 1,
                            pageSize: Limit.MXB_PAGE_SIZE,
                            direction: newRunningItem.get('direction'),
                            selectType: 'category',
                            jrAbstract: '',
                            cardUuid: cardItem.uuid,
                            jrTypeUuid: '',
                            needBranch: filterCardObj.analysisType === '' ? needBranch : false,
                            jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                            categoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? relativeItem.get('uuid') : ''),
                            cardCategoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? '' : relativeItem.get('uuid')),
                            ...filterCardObj,
                            mergeStockBranch: filterCardObj.analysisType === '' ? mergeStockBranch: false,
                        }), reportList => {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            if (showMessage(reportList)) {
                                dispatch({
                                    type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                    receivedData: json.data,
                                    reportData: reportList.data,
                                    issuedate,
                                    endissuedate,
                                    cardItem: cardItem,
                                    direction: newRunningItem.get('direction'),
                                    currentRelativeItem: relativeItem,
                                    currentRunningCategoryItem: newRunningItem
                                })
                            }
                        })
                    }
                })

            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                dispatch({
                    type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_RELATIVE,
                    receivedData: json.data,
                    reportData: null,
                    relativeItem,
                    cardItem: null
                })
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

// 切换往来卡片
export const getRelativeMxbBalanceListFromCardItem = (cardItem) => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.get('issuedate')
    const endissuedate = relativeMxbState.get('endissuedate')

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const searchContent = relativeMxbState.getIn(['views', 'searchContent'])
    const selectType = relativeMxbState.getIn(['views', 'selectType'])
    const chooseDirection = relativeMxbState.getIn(['views', 'chooseDirection'])
    const needBranch = relativeMxbState.getIn(['views', 'needBranch'])
    const currentRelativeItem = relativeMxbState.getIn(['views', 'currentRelativeItem'])

    const selectDirction = chooseDirection === 'double_debit' || chooseDirection === 'double_credit' ? chooseDirection : 'double_credit'

    const currentRunningCategoryItem = relativeMxbState.getIn(['views', 'currentRunningCategoryItem'])
    let newRunningItem = currentRunningCategoryItem
    let hasRunningItem = false

    // 往来分析
    const showAccount = relativeMxbState.getIn(['views', 'showAccount'])
    const showStock = relativeMxbState.getIn(['views', 'showStock'])
    const showProject = relativeMxbState.getIn(['views', 'showProject'])
    const showJrCategory = relativeMxbState.getIn(['views', 'showJrCategory'])
    const analysisType = relativeMxbState.getIn(['views', 'analysisType'])
    const mergeStockBranch = relativeMxbState.getIn(['views', 'mergeStockBranch'])

    const filterCardObj = {
        showAccount,
        showStock,
        showProject,
        showJrCategory,
        accountList:[],
        projectList:[],
        stockList:[],
        jrCategoryList: [],
        analysisType
    }

    dispatch(filterCardClear())
    fetchApi('getRelativeMxbCategoryAndType', 'POST', JSON.stringify({
        begin,
        end,
        cardUuid: cardItem.get('uuid'),
        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
        analysisType,
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
                    jrCategoryName: '全部',
                    direction: 'double_credit'
                })

            }
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH,
                receivedData: jsonRunningCategory.data,
                currentRunningCategoryItem: newRunningItem
            })
            fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
                begin,
                end,
                currentPage: 1,
                pageSize: Limit.MXB_PAGE_SIZE,
                direction: newRunningItem.get('direction'),
                jrAbstract: searchContent,
                cardUuid: cardItem.get('uuid'),
                selectType,
                jrTypeUuid: '',
                needBranch: filterCardObj.analysisType === '' ? needBranch : false,
                jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
                cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
                ...filterCardObj,
                mergeStockBranch: filterCardObj.analysisType === '' ? mergeStockBranch: false,
            }), json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CARD_ITEM,
                        receivedData: json.data,
                        cardItem,
                        chooseDirection: newRunningItem.get('direction'),
                    })
                }
            })

        }
    })


}

// 按摘要筛选
export const getRelativeMxbBalanceListFromFilterOrPage = (searchContent, page) => (dispatch, getState) => {

    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.get('issuedate')
    const endissuedate = relativeMxbState.get('endissuedate')
    const chooseDirection = relativeMxbState.getIn(['views', 'chooseDirection'])
    const currentRelativeItem = relativeMxbState.getIn(['views', 'currentRelativeItem'])

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const selectType = relativeMxbState.getIn(['views', 'selectType'])
    const currentCardItem = relativeMxbState.getIn(['views', 'currentCardItem'])
    const currentRunningCategoryItem = relativeMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const currentRunningTypeItem = relativeMxbState.getIn(['views', 'currentRunningTypeItem'])
    const showAccount = relativeMxbState.getIn(['views', 'showAccount'])
    const showStock = relativeMxbState.getIn(['views', 'showStock'])
    const showProject = relativeMxbState.getIn(['views', 'showProject'])
    const showJrCategory = relativeMxbState.getIn(['views', 'showJrCategory'])

    const accountList = relativeMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const projectList = relativeMxbState.getIn(['commonCardObj', 'chooseProjectCard'])
    const stockList = relativeMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const jrCategoryList = relativeMxbState.getIn(['commonCardObj', 'chooseJrCategoryCard'])
    const analysisType = relativeMxbState.getIn(['views', 'analysisType'])
    const mergeStockBranch = relativeMxbState.getIn(['views', 'mergeStockBranch'])
    const needBranch = relativeMxbState.getIn(['views', 'needBranch'])

    const filterCardObj = {
        showAccount,
        showStock,
        showProject,
        showJrCategory,
        accountList,
        projectList,
        stockList,
        jrCategoryList,
        analysisType
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: page ? page : 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        direction: chooseDirection,
        needBranch: filterCardObj.analysisType === '' ? needBranch : false,
        jrAbstract: searchContent,
        cardUuid: currentCardItem.get('uuid'),
        selectType,
        jrTypeUuid: selectType === 'type' ? currentRunningTypeItem.get('jrTypeUuid') : '',
        jrCategoryUuid: selectType === 'type' ? '' : currentRunningCategoryItem.get('jrCategoryUuid'),
        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
        ...filterCardObj,
        mergeStockBranch: filterCardObj.analysisType === '' ? mergeStockBranch: false,
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_FILTER_OR_PAGE,
                receivedData: json.data,
            })
        }
    })
}
// 切换 类别 或 类型
export const getRelativeMxbBalanceListFromCategoryOrType = (selectType, currentItem) => (dispatch, getState) => {

    const relativeMxbState = getState().relativeMxbState
    const issuedate = relativeMxbState.get('issuedate')
    const endissuedate = relativeMxbState.get('endissuedate')

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const searchContent = relativeMxbState.getIn(['views', 'searchContent'])
    const currentCardItem = relativeMxbState.getIn(['views', 'currentCardItem'])
    const chooseDirection = relativeMxbState.getIn(['views', 'chooseDirection'])
    const needBranch = relativeMxbState.getIn(['views', 'needBranch'])
    const currentRelativeItem = relativeMxbState.getIn(['views', 'currentRelativeItem'])

    const showAccount = relativeMxbState.getIn(['views', 'showAccount'])
    const showStock = relativeMxbState.getIn(['views', 'showStock'])
    const showProject = relativeMxbState.getIn(['views', 'showProject'])
    const showJrCategory = relativeMxbState.getIn(['views', 'showJrCategory'])

    const accountList = relativeMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const projectList = relativeMxbState.getIn(['commonCardObj', 'chooseProjectCard'])
    const stockList = relativeMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const jrCategoryList = relativeMxbState.getIn(['commonCardObj', 'chooseJrCategoryCard'])
    const analysisType = relativeMxbState.getIn(['views', 'analysisType'])
    const mergeStockBranch = relativeMxbState.getIn(['views', 'mergeStockBranch'])

    const filterCardObj = {
        showAccount,
        showStock,
        showProject,
        showJrCategory,
        projectList:[],
        accountList:[],
        stockList:[],
        jrCategoryList: [],
        analysisType
    }
    dispatch(filterCardClear())

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        direction: selectType === 'type' ? currentItem.get('jrDirection') : currentItem.get('direction'),

        jrAbstract: searchContent,
        cardUuid: currentCardItem.get('uuid'),
        selectType,
        jrTypeUuid: selectType === 'type' ? currentItem.get('jrTypeUuid') : '',
        jrCategoryUuid: selectType === 'type' ? '' : currentItem.get('jrCategoryUuid'),
        needBranch,
        ...filterCardObj,
        mergeStockBranch: analysisType === '' ? mergeStockBranch: false,
        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CATEGORY_OR_TYPE,
                receivedData: json.data,
                selectType,
                currentItem,
            })
        }
    })
}


// 获取往来类别
export const getRelativeMxbCategoryFetch = (issuedate, endissuedate) => (dispatch,getState) => {

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK,
        loadingType: 'add'
    })

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const relativeMxbState = getState().relativeMxbState
    const analysisType = relativeMxbState.getIn(['views','analysisType'])
    fetchApi('getRelativeReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        analysisType
    }), json => {

        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK,
            loadingType: 'minus'
        })

        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_FETCH,
                receivedData: json.data.cardCategory
            })
        }
    })
}

// 获取某卡片下的流水类别和类型
export const getRelativeMxbCategoryAndTypeFetch = (issuedate, endissuedate, cardUuid) => (dispatch,getState) => {

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK,
        loadingType: 'add'
    })

    const currentRunningCategoryItem = getState().relativeMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const currentRelativeItem = getState().relativeMxbState.getIn(['views', 'currentRelativeItem'])
    const analysisType = getState().relativeMxbState.getIn(['views', 'analysisType'])
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getRelativeMxbCategoryAndType', 'POST', JSON.stringify({
        begin,
        end,
        cardUuid,
        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
        analysisType,

    }), json => {

        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK,
            loadingType: 'minus'
        })

        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH,
                receivedData: json.data,
                currentRunningCategoryItem
            })
        }
    })
}

export const changeRelativeMxbChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_RELATIVE_MXB_CHOOSE_VALUE,
    chooseValue
})
export const changeCommonValue = (name,value) => ({
    type: ActionTypes.RELATIVE_MXB_CHANGE_COMMON_VALUE,
    name,
    value,
})
export const changeRelativeMxbReportDirection = (direction,changeData = true) => ({
    type: ActionTypes.CHANGE_RELATIVE_MXB_REPORT_DIRECTION,
    direction,
    changeData
})
export const changeRelativeMxbSearchContent = (value) => ({
    type: ActionTypes.CHANGE_RELATIVE_MXB_SEARCH_CONTENT,
    value
})

export const changeRelativeMxbAnalysisValue = (value) => ({
    type: ActionTypes.CHANGE_RELATIVE_MXB_ANALYSIS_VALUE,
    value
})

export const changeFilterCardValue = (name,value) => ({
    type: ActionTypes.RELATIVE_MXB_CHANGE_FILTER_CARD,
    name,
    value,
})

export const changeItemCheckboxCheck = (checked,uuid,curSelectUuidName) => ({
    type: ActionTypes.RELATIVE_MXB_CHANGE_ITEM_CHECKBOX_CHECKED,
    checked,
    uuid,
    curSelectUuidName,
})

export const changeItemCheckboxCheckAll = (checked,allList,curSelectUuidName) => dispatch => {
    allList.map((v,index) => {
        dispatch(changeItemCheckboxCheck(checked,v.get('uuid'),curSelectUuidName))
    })
}

// 切换往来分析
export const getRelativeMxbBalanceListFromChangeAnalysisValue = (issuedate, endissuedate, currentCardItem, direction = 'credit',filterCardObj) => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常,请刷新再试', 2)
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''


    const relativeMxbState = getState().relativeMxbState
    const currentRelativeItem = relativeMxbState.getIn(['views','currentRelativeItem'])
    const needBranch = relativeMxbState.getIn(['views','needBranch'])
    const analysisType = relativeMxbState.getIn(['views','analysisType'])

    fetchApi('getRelativeReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        analysisType,
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
            let newRelativeItem = currentRelativeItem
            let hasItem = false
            const loop = (data) => data.map(item => {
                if(item.uuid === currentRelativeItem.get('uuid')){
                    hasItem = true
                }
                if(item.childList && item.childList.length){
                    loop(item.childList)
                }
            })
            loop(jsonCategory.data.cardCategory)
            if(!hasItem){
                newRelativeItem = fromJS({
                    uuid: '',
                    name: '全部',
                    value: '全部',
                    top: false,
                })
            }
            dispatch({
                type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data.cardCategory
            })
            fetchApi('getRelativeMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                currentPage: 1,
                pageSize: Limit.MXB_PAGE_SIZE,
                analysisType,
            }), json => {
                if (showMessage(json)) {

                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid') || currentCardItem.get('uuid') === '')) {
                            cardItem = currentCardItem.toJS()
                        } else {
                            cardItem = json.data.cardList[0]
                        }

                        const currentRunningCategoryItem = relativeMxbState.getIn(['views', 'currentRunningCategoryItem'])
                        let newRunningItem = currentRunningCategoryItem
                        let hasRunningItem = false
                        fetchApi('getRelativeMxbCategoryAndType', 'POST', JSON.stringify({
                            begin,
                            end,
                            cardUuid: cardItem.uuid,
                            categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                            cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                            analysisType,

                        }), jsonRunningCategory => {
                            if (showMessage(json)) {
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
                                        jrCategoryName: '全部',
                                        direction: 'double_credit'
                                    })

                                }
                                dispatch({
                                    type: ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH,
                                    receivedData: jsonRunningCategory.data,
                                    currentRunningCategoryItem: newRunningItem
                                })
                                fetchApi('getRelativeMxbReport', 'POST', JSON.stringify({
                                    begin,
                                    end,
                                    currentPage: 1,
                                    pageSize: Limit.MXB_PAGE_SIZE,
                                    direction: newRunningItem.get('direction'),
                                    selectType: 'category',
                                    jrAbstract: '',
                                    cardUuid: cardItem.uuid,
                                    jrTypeUuid: '',
                                    needBranch: false,
                                    jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                                    categoryUuid: newRelativeItem.get('top') ? newRelativeItem.get('uuid') : '',
                                    cardCategoryUuid: newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid'),
                                    mergeStockBranch: filterCardObj.mergeStockBranch ? filterCardObj.mergeStockBranch : false,
                                    ...filterCardObj,
                                }), reportList => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            cardItem: cardItem,
                                            direction: newRunningItem.get('direction'),
                                            currentRelativeItem: newRelativeItem,
                                            currentRunningCategoryItem: newRunningItem
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        const newRunningItem = fromJS({
                            jrCategoryUuid: '',
                            jrCategoryName: '全部',
                            direction: 'double_credit'
                        })
                        dispatch({type:ActionTypes.RELATIVE_MXB_CLEAR_CATEGORY_OR_TYPE})
                        dispatch({
                            type: ActionTypes.GET_PERIOD_AND_RELATIVE_MXB_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: '',
                            issuedate,
                            endissuedate,
                            cardItem: null,
                            currentRunningCategoryItem: newRunningItem,
                            analysisType
                        })
                    }
                } else {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            })

        }
    })
}


export const filterCardClear = () => ({ type: ActionTypes.RELATIVE_MXB_FILTER_CARD_CLEAR })
export const needBranchClear = () => ({ type: ActionTypes.RELATIVE_MXB_NEED_BRANCH_CLEAR })
