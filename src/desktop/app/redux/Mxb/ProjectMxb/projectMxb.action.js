import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { fromJS } from 'immutable'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

export const getPeriodAndProjectMxbBalanceList = (issuedate, endissuedate,needPeriod = 'true') => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])
    const currentCardItem = projectMxbState.getIn(['views','currentCardItem'])
    const searchContent = projectMxbState.getIn(['views','searchContent'])

    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        isType: false,
        analyse: '0',
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
                pageSize: Limit.MXB_CARD_PAGE_SIZE,
                needPeriod,
                showAccount: false,
                showStock: false,
                showCurrent: false,
                accountList: [],
                currentList: [],
                stockList: [],
                analyse: '0',
            }), json => {
                if (showMessage(json)) {
                    const openedissuedate = needPeriod === 'true' ? dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json)) : issuedate
                    needPeriod === 'true' && dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                            cardItem = currentCardItem.toJS()
                        } else {
                            cardItem = json.data.cardList[0]
                        }
                        const newRunningItem = fromJS({
                            jrCategoryUuid: '',
                            jrCategoryName: '全部',
                            direction: 'double_credit',
                            completeName: '',
                        })
                        const allCardUUidList = []
                        json.data.cardList.map(item => {
                          allCardUUidList.push(item.uuid)
                        })
                        fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
                            begin,
                            end,
                            cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                            analyse: '0',
                        }), jsonRunningCategory => {
                            if (showMessage(jsonRunningCategory)) {
                                const fetchDate = openedissuedate.substr(0, 4) + '-' + openedissuedate.substr(6, 2)
                                dispatch({
                                    type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                                    receivedData: jsonRunningCategory.data,
                                    currentRunningCategoryItem:newRunningItem
                                })
                                fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                                    begin: issuedate ? begin : fetchDate,
                                    end: endissuedate ? end : '',
                                    currentPage: 1,
                                    pageSize: Limit.MXB_PAGE_SIZE,
                                    direction: newRunningItem.get('direction'),

                                    jrAbstract: searchContent,
                                    cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                                    jrTypeUuid: '',
                                    jrCategoryUuid: '',
                                    showAccount: false,
                                    showStock: false,
                                    showCurrent: false,
                                    accountList: [],
                                    currentList: [],
                                    stockList: [],
                                    mergeStock: false,
                                    showAll: false,
                                }), reportList => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate: openedissuedate,
                                            endissuedate: endissuedate,
                                            currentProjectItem: newProjectItem,
                                            cardItem: cardItem,
                                            direction: newRunningItem.get('direction'),
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
                            direction: 'double_credit',
                            completeName: '',
                        })
                        dispatch({type:ActionTypes.PROJECT_MXB_CLEAR_CATEGORY_OR_TYPE})
                        dispatch({
                            type: ActionTypes.GET_PERIOD_AND_PROJECT_MXB_BALANCE_LIST,
                            receivedData: json.data,
                            reportData: '',
                            issuedate: openedissuedate,
                            endissuedate,
                            cardItem: null,
                            currentRunningCategoryItem: newRunningItem

                        })
                    }
                } else {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            })
        }
    })

}

export const getPeriodAndProjecTypetMxbBalanceList = (issuedate, endissuedate, needPeriod = 'true') => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])
    const currentCardItem = projectMxbState.getIn(['views','currentCardItem'])
    const searchContent = projectMxbState.getIn(['views','searchContent'])

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
                pageSize: Limit.MXB_CARD_PAGE_SIZE,
                needPeriod
            }), json => {
                if (showMessage(json)) {
                    const openedissuedate = needPeriod === 'true' ? dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json)) : issuedate
                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                            cardItem = currentCardItem.toJS()
                        } else {
                            cardItem = json.data.cardList[0]
                        }

                        const newTypeItem = fromJS({
                            jrJvTypeUuid: '',
                            typeName: '全部',
                            value: '全部',
                            direction: 'double_credit',
                            mergeName: '全部',
                        })
                        let allCardUUidList = []
                        json.data.cardList && json.data.cardList.map(item => {
                          allCardUUidList.push(item.uuid)
                        })
                        fetchApi('getProjectMxbType', 'POST', JSON.stringify({
                            begin,
                            end,
                            cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList
                        }), jsonType => {
                            if (showMessage(jsonType)) {
                                const fetchDate = openedissuedate.substr(0, 4) + '-' + openedissuedate.substr(6, 2)
                                dispatch({
                                    type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                                    receivedData: jsonType.data,
                                    currentRunningTypeItem: newTypeItem
                                })
                                fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                                    begin: issuedate ? begin : fetchDate,
                                    end: endissuedate ? end : '',
                                    currentPage: 1,
                                    pageSize: Limit.MXB_PAGE_SIZE,
                                    direction: newTypeItem.get('direction'),

                                    jrAbstract: searchContent,
                                    cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                                    jrTypeUuid: '',
                                    jrCategoryUuid: '',
                                    categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                                    cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                                }), reportList => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate: openedissuedate,
                                            endissuedate: endissuedate,
                                            currentProjectItem: newProjectItem,
                                            cardItem: cardItem,
                                            direction: newTypeItem.get('direction'),
                                            currentRunningTypeItem: newTypeItem
                                        })
                                    }
                                })
                            }
                        })

                    } else {
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        const newTypeItem = fromJS({
                            jrJvTypeUuid: '',
                            typeName: '全部',
                            value: '全部',
                            direction: 'double_credit',
                            completeName: '',
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
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            })
        }
    })

}
// 收支 刷新
export const getProjectMxbBalanceListFresh = () => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const searchContent = projectMxbState.getIn(['views', 'searchContent'])
    const selectType = projectMxbState.getIn(['views', 'selectType'])
    const currentProjectItem = projectMxbState.getIn(['views', 'currentProjectItem'])
    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    const direction = projectMxbState.getIn(['reportData', 'direction'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])
    const currentPage = projectMxbState.getIn(['reportData', 'currentPage'])
    // 筛选弹框
    const showAccount = projectMxbState.getIn(['commonCardObj', 'showAccount'])
    const showStock = projectMxbState.getIn(['commonCardObj', 'showStock'])
    const showCurrent = projectMxbState.getIn(['commonCardObj', 'showCurrent'])

    const accountList = projectMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const currentList = projectMxbState.getIn(['commonCardObj', 'chooseContactCard'])
    const stockList = projectMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const analyse = projectMxbState.getIn(['views', 'analysisValue'])
    const mergeStock = projectMxbState.getIn(['views', 'mergeStock'])
    const showAll = projectMxbState.getIn(['views', 'showAll'])

    const filterCardObj = {
        showAccount,
        showStock,
        showCurrent,
        accountList,
        currentList,
        stockList,
        analyse,
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
        begin: begin,
        end: end,
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
        needPeriod: 'true',
        ...filterCardObj,
    }), json => {
        if (showMessage(json)) {

            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))

            if (json.data.cardList.length) { // 有卡片
                let hasCardItem = false
                let allCardUUidList = []
                json.data.cardList.map(item => {
                    if(item.uuid == currentCardItem.get('uuid') || currentCardItem.get('uuid') === ''){
                        hasCardItem = true
                    }
                    allCardUUidList.push(item.uuid)

                })
                if(hasCardItem){
                    fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
                        begin,
                        end,
                        cardUuidList: currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList,
                        analyse,
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
                                if(!hasCategoryItem){//所选流水类别不变；若刷新后该流水类别不在列表中，重新定位到“全部流水类别”。
                                    jrCategoryUuid = ''
                                    runningCategoryItem = {
                                        jrCategoryUuid: '',
                                        jrCategoryName: '全部',
                                        direction: 'double_credit',
                                        completeName: '',
                                    }
                                    newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'

                                }

                            }else{
                                jrCategoryUuid == ''
                                runningCategoryItem = {
                                    jrCategoryUuid: '',
                                    jrCategoryName: '全部',
                                    direction: 'double_credit',
                                    completeName: '',
                                }
                                newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'
                            }

                            dispatch({
                                type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                                receivedData: jsonCategory.data,
                                currentRunningCategoryItem: fromJS(runningCategoryItem)
                            })
                            fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                                begin,
                                end,
                                currentPage,
                                pageSize: Limit.MXB_PAGE_SIZE,
                                direction: newDirection,
                                jrAbstract: searchContent,
                                cardUuidList: currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList,
                                selectType,
                                jrTypeUuid: selectType === 'type' ? currentRunningTypeItem.get('jrJvTypeUuid') : '',
                                jrCategoryUuid: selectType === 'type' ? '' : jrCategoryUuid,
                                ...filterCardObj,
                                mergeStock: analyse === '0' ? mergeStock: false,
                                showAll: analyse === '0' ? showAll: false,
                            }), reportList => {
                                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                if (showMessage(reportList)) {
                                    dispatch({
                                        type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_REFRESH,
                                        receivedData: json.data,
                                        reportData: reportList.data
                                    })
                                }
                            })
                        }
                    })

                    // 获取默认卡片下的流水类别和类型
                    // dispatch(getProjectMxbRunningCategoryFetch(issuedate, endissuedate, currentCardItem.get('uuid')))
                }else{
                    fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
                        begin,
                        end,
                        cardUuidList: [json.data.cardList[0].uuid],
                        analyse,

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
                                if(!hasCategoryItem){//所选流水类别不变；若刷新后该流水类别不在列表中，重新定位到“全部流水类别”。
                                    jrCategoryUuid = ''
                                    runningCategoryItem = {
                                        jrCategoryUuid: '',
                                        jrCategoryName: '全部',
                                        direction: 'double_credit',
                                        completeName: '',
                                    }
                                    newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'

                                }

                            }else{
                                jrCategoryUuid == ''
                                runningCategoryItem = {
                                    jrCategoryUuid: '',
                                    jrCategoryName: '全部',
                                    direction: 'double_credit',
                                    completeName: '',
                                }
                                newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'
                            }

                            dispatch({
                                type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                                receivedData: jsonCategory.data,
                                currentRunningCategoryItem: fromJS(runningCategoryItem)
                            })
                            fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                                begin,
                                end,
                                currentPage,
                                pageSize: Limit.MXB_PAGE_SIZE,
                                direction: newDirection,
                                jrAbstract: searchContent,
                                cardUuidList: [json.data.cardList[0].uuid],
                                selectType,
                                jrTypeUuid: selectType === 'type' ? currentRunningTypeItem.get('jrJvTypeUuid') : '',
                                jrCategoryUuid: selectType === 'type' ? '' : jrCategoryUuid,
                                ...filterCardObj,
                                mergeStock: analyse === '0' ? mergeStock: false,
                                showAll: analyse === '0' ? showAll: false,
                            }), reportList => {
                                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                if (showMessage(reportList)) {
                                    dispatch({
                                        type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_REFRESH,
                                        receivedData: json.data,
                                        reportData: reportList.data
                                    })
                                }
                            })
                        }
                    })
                }

            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                dispatch({
                    type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_REFRESH,
                    receivedData: json.data,
                    reportData: '',
                })
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })

    // 获取项目类别
    dispatch(getProjectMxbCategoryFetch(issuedate, endissuedate,false,analyse))
}
// 类型 刷新
export const getProjectTypeMxbBalanceListFresh = () => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const searchContent = projectMxbState.getIn(['views', 'searchContent'])
    const selectType = projectMxbState.getIn(['views', 'selectType'])
    const currentProjectItem = projectMxbState.getIn(['views', 'currentProjectItem'])
    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    const direction = projectMxbState.getIn(['reportData', 'direction'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])
    const currentPage = projectMxbState.getIn(['reportData', 'currentPage'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
        begin: begin,
        end: end,
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
        needPeriod: '',
    }), json => {
        if (showMessage(json)) {

            if (json.data.cardList.length) { // 有卡片
                let hasCardItem = false
                let allCardUUidList = []
                json.data.cardList.map(item => {
                    if(item.uuid == currentCardItem.get('uuid') || currentCardItem.get('uuid') === ''){
                        hasCardItem = true
                    }
                    allCardUUidList.push(item.uuid)
                })
                if(hasCardItem){
                    fetchApi('getProjectMxbType', 'POST', JSON.stringify({
                        begin,
                        end,
                        cardUuidList: currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList
                    }), jsonCategory => {
                        if (showMessage(jsonCategory)) {
                            let hasTypeItem = false
                            let runningTypeItem = currentRunningTypeItem
                            let jrJvTypeUuid = currentRunningTypeItem.get('jrJvTypeUuid')
                            let newDirection = chooseDirection
                            if (jsonCategory.data.childList.length) {
                                const loop = (data) => data.map(item => {
                                    if(item.jrJvTypeUuid == currentRunningTypeItem.get('jrJvTypeUuid')){
                                        hasTypeItem = true
                                    }
                                    if(item.childList.length > 0){
                                        loop(item.childList)
                                    }
                                })
                                loop(jsonCategory.data.childList)
                                if(!hasTypeItem){//所选流水类别不变；若刷新后该流水类别不在列表中，重新定位到“全部流水类别”。
                                    jrJvTypeUuid = ''
                                    runningTypeItem = {
                                        jrJvTypeUuid: '',
                                        typeName: '全部',
                                        direction: 'double_credit',
                                        completeName: '',
                                    }
                                    newDirection = currentRunningTypeItem.get('jrJvTypeUuid') == '' ? chooseDirection : 'double_credit'

                                }

                            }else{
                                jrJvTypeUuid == ''
                                runningTypeItem = {
                                    jrJvTypeUuid: '',
                                    typeName: '全部',
                                    direction: 'double_credit',
                                    completeName: '',
                                }
                                newDirection = currentRunningTypeItem.get('jrJvTypeUuid') == '' ? chooseDirection : 'double_credit'
                            }

                            dispatch({
                                type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                                receivedData: jsonCategory.data,
                                currentRunningTypeItem: fromJS(runningTypeItem)
                            })
                            fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                                begin,
                                end,
                                currentPage,
                                pageSize: Limit.MXB_PAGE_SIZE,
                                direction: newDirection,
                                jrAbstract: searchContent,
                                cardUuidList: currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList,
                                selectType,
                                jrTypeUuid: currentRunningTypeItem.get('jrJvTypeUuid'),
                                jrCategoryUuid: '',
                                categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
                                cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
                            }), reportList => {
                                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                if (showMessage(reportList)) {
                                    dispatch({
                                        type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_REFRESH,
                                        receivedData: json.data,
                                        reportData: reportList.data
                                    })
                                }
                            })
                        }
                    })

                    // 获取默认卡片下的流水类别和类型
                    // dispatch(getProjectMxbRunningCategoryFetch(issuedate, endissuedate, currentCardItem.get('uuid')))
                }else{
                    fetchApi('getProjectMxbType', 'POST', JSON.stringify({
                        begin,
                        end,
                        cardUuidList: [json.data.cardList[0].uuid]
                    }), jsonCategory => {
                        if (showMessage(jsonCategory)) {
                            let hasTypeItem = false
                            let runningTypeItem = currentRunningTypeItem
                            let jrJvTypeUuid = currentRunningTypeItem.get('jrJvTypeUuid')
                            let newDirection = chooseDirection
                            if (jsonCategory.data.childList.length) {
                                const loop = (data) => data.map(item => {
                                    if(item.jrJvTypeUuid == currentRunningTypeItem.get('jrJvTypeUuid')){
                                        hasTypeItem = true
                                    }
                                    if(item.childList.length > 0){
                                        loop(item.childList)
                                    }
                                })
                                loop(jsonCategory.data.childList)
                                if(!hasTypeItem){//所选流水类别不变；若刷新后该流水类别不在列表中，重新定位到“全部流水类别”。
                                    jrJvTypeUuid = ''
                                    runningTypeItem = {
                                        jrJvTypeUuid: '',
                                        typeName: '全部',
                                        direction: 'double_credit',
                                        completeName: '',
                                    }
                                    newDirection = currentRunningTypeItem.get('jrJvTypeUuid') == '' ? chooseDirection : 'double_credit'

                                }

                            }else{
                                jrJvTypeUuid == ''
                                runningTypeItem = {
                                    jrJvTypeUuid: '',
                                    typeName: '全部',
                                    direction: 'double_credit',
                                    completeName: '',
                                }
                                newDirection = currentRunningCategoryItem.get('jrJvTypeUuid') == '' ? chooseDirection : 'double_credit'
                            }

                            dispatch({
                                type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                                receivedData: jsonCategory.data,
                                currentRunningTypeItem: fromJS(runningTypeItem)
                            })
                            fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                                begin,
                                end,
                                currentPage,
                                pageSize: Limit.MXB_PAGE_SIZE,
                                direction: newDirection,
                                jrAbstract: searchContent,
                                cardUuidList: [json.data.cardList[0].uuid],
                                selectType,
                                jrTypeUuid: currentRunningTypeItem.get('jrJvTypeUuid'),
                                jrCategoryUuid: '',
                                categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
                                cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
                            }), reportList => {
                                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                if (showMessage(reportList)) {
                                    dispatch({
                                        type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_REFRESH,
                                        receivedData: json.data,
                                        reportData: reportList.data
                                    })
                                }
                            })
                        }
                    })
                }

            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                dispatch({
                    type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_REFRESH,
                    receivedData: json.data,
                    reportData: '',
                })
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })

    // 获取项目类别
    dispatch(getProjectMxbCategoryFetch(issuedate, endissuedate,true))
}
// 收支 Yeb 跳来的
export const getProjectMxbBalanceListFromProjectYeb = (issuedate, endissuedate, projectCardItem,currentRunningItem,currentProjectItem,analyse) => (dispatch, getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const projectYebState = getState().projectYebState
    const analysisValue = projectYebState.getIn(['views', 'analysisValue'])


    const filterCardObj = {
        showAccount: false,
        showStock: false,
        showCurrent: false,
        accountList: [],
        currentList: [],
        stockList: [],
        analyse
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
        begin: begin,
        end: end,
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
        needPeriod: 'true',
        ...filterCardObj,
    }), json => {
        if (showMessage(json)) {

            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))

            if (json.data.cardList.length) { // 有卡片
                let allCardUUidList = []
                json.data.cardList.map(item => {
                  allCardUUidList.push(item.uuid)
                })
                const cardUuidList = projectCardItem.get('uuid') ? [projectCardItem.get('uuid')] : allCardUUidList
                dispatch(needBranchClear())
                fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    currentPage: 1,
                    pageSize: Limit.MXB_PAGE_SIZE,
                    direction: currentRunningItem.get('direction'),

                    jrAbstract: '',
                    cardUuidList,
                    selectType: 'category',
                    jrTypeUuid: '',
                    jrCategoryUuid: currentRunningItem.get('jrCategoryUuid'),
                    ...filterCardObj,
                    mergeStock: false,
                    showAll: false,
                }), reportList => {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
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
                            analysisValue,
                        })
                    }
                })
                // 获取默认卡片下的流水类别和类型
                dispatch(getProjectMxbRunningCategoryFetch(issuedate, endissuedate, cardUuidList,currentRunningItem,analyse))
            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                dispatch({
                    type: ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB,
                    receivedData: json.data,
                    reportData: '',
                    issuedate,
                    endissuedate,
                    projectCardItem,
                    currentProjectItem,
                })
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })

    // 获取往来类别
    dispatch(getProjectMxbCategoryFetch(issuedate, endissuedate,false,analyse))
}
// 类型 Yeb 跳来的
export const getProjectTypeMxbBalanceListFromProjectYeb = (issuedate, endissuedate, projectCardItem,currentJrTypeItem,currentProjectItem) => (dispatch, getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const projectYebState = getState().projectYebState
    const analysisValue = projectYebState.getIn(['views', 'analysisValue'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
        begin: begin,
        end: end,
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
        needPeriod: 'true',
    }), json => {
        if (showMessage(json)) {

            json.data.periodDtoJson && dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            if (json.data.cardList.length) { // 有卡片
                let allCardUUidList = []
                json.data.cardList.map(item => {
                  allCardUUidList.push(item.uuid)
                })
                const cardUuidList = projectCardItem.get('uuid') ? [projectCardItem.get('uuid')] : allCardUUidList

                fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    currentPage: 1,
                    pageSize: Limit.MXB_PAGE_SIZE,
                    direction: currentJrTypeItem.get('direction'),

                    jrAbstract: '',
                    cardUuidList,
                    selectType: 'category',
                    jrTypeUuid: currentJrTypeItem.get('jrJvTypeUuid'),
                    jrCategoryUuid: '',
                    categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
                    cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
                }), reportList => {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    if (showMessage(reportList)) {
                        dispatch({
                            type: ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB,
                            receivedData: json.data,
                            reportData: reportList.data,
                            issuedate,
                            endissuedate,
                            projectCardItem,
                            currentProjectItem,
                            runningJrTypeItem:currentJrTypeItem,
                            tableName: 'Type',
                            analysisValue,
                        })
                    }
                })
                // 获取默认卡片下的流水类别和类型
                dispatch(getProjectMxbTypeFetch(issuedate, endissuedate, cardUuidList,currentJrTypeItem))
            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                dispatch({
                    type: ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB,
                    receivedData: json.data,
                    reportData: '',
                    issuedate,
                    endissuedate,
                    projectCardItem,
                    currentProjectItem,
                })
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })

    // 获取往来类别
    dispatch(getProjectMxbCategoryFetch(issuedate, endissuedate,true))
}
// 收支 切换账期
export const getProjectMxbBalanceListFromChangePeriod = (issuedate, endissuedate, currentCardItem, direction = 'credit') => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])
    // 筛选弹框
    const showAccount = projectMxbState.getIn(['commonCardObj', 'showAccount'])
    const showStock = projectMxbState.getIn(['commonCardObj', 'showStock'])
    const showCurrent = projectMxbState.getIn(['commonCardObj', 'showCurrent'])

    const accountList = projectMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const currentList = projectMxbState.getIn(['commonCardObj', 'chooseContactCard'])
    const stockList = projectMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const analyse = projectMxbState.getIn(['views', 'analysisValue'])
    const mergeStock = projectMxbState.getIn(['views', 'mergeStock'])
    const showAll = projectMxbState.getIn(['views', 'showAll'])

    const filterCardObj = {
        showAccount,
        showStock,
        showCurrent,
        accountList,
        currentList,
        stockList,
        analyse,
    }

    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        isType: false,
        analyse,
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
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
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data,
            })
            fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                currentPage: 1,
                pageSize: Limit.MXB_CARD_PAGE_SIZE,
                ...filterCardObj,

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
                            cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                            analyse,
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
                                        direction: 'double_credit',
                                        completeName: '',
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
                                    pageSize: Limit.MXB_PAGE_SIZE,
                                    direction: newRunningItem.get('direction'),

                                    jrAbstract: '',
                                    cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                                    jrTypeUuid: '',
                                    jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                                    ...filterCardObj,
                                    mergeStock: analyse === '0' ? mergeStock: false,
                                    showAll: analyse === '0' ? showAll: false,

                                }), reportList => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            direction: newRunningItem.get('direction'),
                                            currentProjectItem: newProjectItem,
                                            cardItem: cardItem,
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
                            direction: 'double_credit',
                            completeName: '',
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
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
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

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])

    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        isType: true
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
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
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data,
            })

            fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                currentPage: 1,
                pageSize: Limit.MXB_CARD_PAGE_SIZE,
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
                            begin,
                            end,
                            cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList
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
                                        typeName: '全部',
                                        value: '全部',
                                        direction: 'double_credit',
                                        completeName: '',
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
                                    pageSize: Limit.MXB_PAGE_SIZE,
                                    direction: newTypeItem.get('direction'),

                                    jrAbstract: '',
                                    cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                                    jrTypeUuid: newTypeItem.get('jrJvTypeUuid'),
                                    jrCategoryUuid: '',
                                    categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                                    cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                                }), reportList => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            direction: newTypeItem.get('direction'),
                                            currentProjectItem: newProjectItem,
                                            cardItem: cardItem,
                                            currentRunningTypeItem: newTypeItem
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        const newTypeItem = fromJS({
                            jrJvTypeUuid: '',
                            typeName: '全部',
                            value: '全部',
                            direction: 'double_credit',
                            completeName: '',
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
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            })
        }
    })
}
// 收支卡片分页
export const getProjectMxbBalanceListFromChangeCardList = (issuedate, endissuedate,projectItem,currentPage) => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    // 筛选弹框
    const projectMxbState = getState().projectMxbState
    const showAccount = projectMxbState.getIn(['commonCardObj', 'showAccount'])
    const showStock = projectMxbState.getIn(['commonCardObj', 'showStock'])
    const showCurrent = projectMxbState.getIn(['commonCardObj', 'showCurrent'])

    const accountList = projectMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const currentList = projectMxbState.getIn(['commonCardObj', 'chooseContactCard'])
    const stockList = projectMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const analyse = projectMxbState.getIn(['views', 'analysisValue'])

    const filterCardObj = {
        showAccount,
        showStock,
        showCurrent,
        accountList,
        currentList,
        stockList,
        analyse,
    }

    fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        currentPage,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
        ...filterCardObj,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CARD_LIST,
                receivedData: json.data,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
// 类型卡片分页
export const getProjectTypeMxbBalanceListFromChangeCardList = (issuedate, endissuedate,projectItem,currentPage) => dispatch => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        currentPage,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CARD_LIST,
                receivedData: json.data,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
// 切换项目收支-项目类别
export const getProjectMxbBalanceListFromProject = (projectItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const searchContent = projectMxbState.getIn(['views', 'searchContent'])
    const selectType = projectMxbState.getIn(['views', 'selectType'])

    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])

    // 筛选弹框
    const showAccount = projectMxbState.getIn(['commonCardObj', 'showAccount'])
    const showStock = projectMxbState.getIn(['commonCardObj', 'showStock'])
    const showCurrent = projectMxbState.getIn(['commonCardObj', 'showCurrent'])

    const accountList = projectMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const currentList = projectMxbState.getIn(['commonCardObj', 'chooseContactCard'])
    const stockList = projectMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const analyse = projectMxbState.getIn(['views', 'analysisValue'])
    const mergeStock = projectMxbState.getIn(['views', 'mergeStock'])
    const showAll = projectMxbState.getIn(['views', 'showAll'])

    const filterCardObj = {
        showAccount,
        showStock,
        showCurrent,
        accountList:[],
        currentList:[],
        stockList:[],
        analyse,
    }
    dispatch(filterCardClear())

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
        ...filterCardObj,
    }), json => {
        if (showMessage(json)) {
            if (json.data.cardList.length) { // 有卡片
                let cardItem = {}
                if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                    cardItem = currentCardItem.toJS()
                } else {
                    cardItem = json.data.cardList[0]
                }
                const newRunningItem = fromJS({
                    jrCategoryUuid: '',
                    jrCategoryName: '全部',
                    direction: 'double_credit',
                    completeName: '',
                })
                const allCardUUidList = []
                json.data.cardList.map(item => {
                  allCardUUidList.push(item.uuid)
                })
                fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
                    begin,
                    end,
                    cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                    analyse,
                }), jsonCategory => {
                    if (showMessage(jsonCategory)) {
                        let hasCategoryItem = false
                        let runningCategoryItem = currentRunningCategoryItem.toJS()
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
                            if(!hasCategoryItem){//所选流水类别不变；若刷新后该流水类别不在列表中，重新定位到“全部流水类别”。
                                jrCategoryUuid = ''
                                runningCategoryItem = {
                                    jrCategoryUuid: '',
                                    jrCategoryName: '全部',
                                    direction: 'double_credit',
                                    completeName: '',
                                }
                                newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'

                            }

                        }else{
                            jrCategoryUuid == ''
                            runningCategoryItem = {
                                jrCategoryUuid: '',
                                jrCategoryName: '全部',
                                direction: 'double_credit',
                                completeName: '',
                            }
                            newDirection = currentRunningCategoryItem.get('jrCategoryUuid') == '' ? chooseDirection : 'double_credit'
                        }

                        dispatch({
                            type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                            receivedData: jsonCategory.data,
                            currentRunningCategoryItem: fromJS(runningCategoryItem)
                        })
                        dispatch(changeProjectMxbReportDirection(newDirection))
                        fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
                            begin,
                            end,
                            currentPage: 1,
                            pageSize: Limit.MXB_PAGE_SIZE,
                            direction: newDirection,

                            jrAbstract: searchContent,
                            cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                            selectType,
                            jrTypeUuid: '',
                            jrCategoryUuid,
                            ...filterCardObj,
                            mergeStock: analyse === '0' ? mergeStock: false,
                            showAll: analyse === '0' ? showAll: false,
                        }), reportList => {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            if (showMessage(reportList)) {
                                dispatch({
                                    type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT,
                                    receivedData: json.data,
                                    reportData: reportList.data,
                                    projectItem,
                                    cardItem,
                                })
                            }
                        })
                    }
                })


                // 获取默认卡片下的流水类别和类型
                // dispatch(getProjectMxbRunningCategoryFetch(issuedate, endissuedate, [json.data.cardList[0].uuid]))
            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                dispatch({
                    type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT,
                    receivedData: json.data,
                    reportData: null,
                    projectItem,
                    cardItem: null
                })
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

// 切换项目类型项目类别
export const getProjectTypeMxbBalanceListFromProject = (projectItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const searchContent = projectMxbState.getIn(['views', 'searchContent'])
    const selectType = projectMxbState.getIn(['views', 'selectType'])

    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectTypeMxbCardList', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
        cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
        currentPage: 1,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
    }), json => {
        if (showMessage(json)) {
            if (json.data.cardList.length) { // 有卡片
                let cardItem = {}
                if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid'))) {
                    cardItem = currentCardItem.toJS()
                } else {
                    cardItem = json.data.cardList[0]
                }
                const newTypeItem = fromJS({
                    jrJvTypeUuid: '',
                    typeName: '全部',
                    value: '全部',
                    direction: 'double_credit',
                    mergeName: '全部',
                })
                let allCardUUidList = []
                json.data.cardList && json.data.cardList.map(item => {
                  allCardUUidList.push(item.uuid)
                })
                fetchApi('getProjectMxbType', 'POST', JSON.stringify({
                    begin,
                    end,
                    cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList
                }), jsonType => {
                    if (showMessage(jsonType)) {
                        let hasTypeItem = false
                        let runningTypeItem = currentRunningTypeItem.toJS()
                        let jrJvTypeUuid = currentRunningTypeItem.get('jrJvTypeUuid')
                        let newDirection = chooseDirection

                        if (jsonType.data.childList.length) {
                            const loop = (data) => data.map(item => {
                                if(item.jrJvTypeUuid == currentRunningTypeItem.get('jrJvTypeUuid')){
                                    hasTypeItem = true
                                }
                                if(item.childList.length > 0){
                                    loop(item.childList)
                                }
                            })
                            loop(jsonType.data.childList)
                            if(!hasTypeItem){//所选流水类别不变；若刷新后该流水类别不在列表中，重新定位到“全部流水类别”。
                                jrJvTypeUuid = ''
                                runningTypeItem = {
                                    jrJvTypeUuid: '',
                                    typeName: '全部',
                                    direction: 'double_credit',
                                    mergeName: '全部',
                                }
                                newDirection = currentRunningTypeItem.get('jrJvTypeUuid') == '' ? chooseDirection : 'double_credit'

                            }

                        }else{
                            jrJvTypeUuid == ''
                            runningTypeItem = {
                                jrJvTypeUuid: '',
                                typeName: '全部',
                                direction: 'double_credit',
                                mergeName: '全部',
                            }
                            newDirection = currentRunningTypeItem.get('jrJvTypeUuid') == '' ? chooseDirection : 'double_credit'
                        }
                        dispatch({
                            type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                            receivedData: jsonType.data,
                            currentRunningTypeItem: fromJS(runningTypeItem)
                        })
                        dispatch(changeProjectMxbReportDirection(newDirection))
                        fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
                            begin,
                            end,
                            currentPage: 1,
                            pageSize: Limit.MXB_PAGE_SIZE,
                            direction: newDirection,
                            jrAbstract: searchContent,
                            cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                            selectType,
                            jrTypeUuid: runningTypeItem.jrJvTypeUuid,
                            jrCategoryUuid: '',
                            categoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? projectItem.get('uuid') : ''),
                            cardCategoryUuid: projectItem.get('name') === '全部' ? '' : (projectItem.get('top') ? '' : projectItem.get('uuid')),
                        }), reportList => {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            if (showMessage(reportList)) {
                                dispatch({
                                    type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT,
                                    receivedData: json.data,
                                    reportData: reportList.data,
                                    projectItem,
                                    cardItem,
                                })
                            }
                        })


                    }
                })


                // 获取默认卡片下的流水类别和类型
                // dispatch(getProjectMxbTypeFetch(issuedate, endissuedate, [json.data.cardList[0].uuid]))
            } else {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                dispatch({
                    type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT,
                    receivedData: json.data,
                    reportData: null,
                    projectItem,
                    cardItem: null
                })
            }
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}
// 切换项目收支卡片
export const getProjectMxbBalanceListFromCardItem = (cardItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])

    const selectDirction = chooseDirection === 'double_debit' || chooseDirection === 'double_credit' ? chooseDirection : 'double_credit'

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    let newRunningItem = currentRunningCategoryItem
    let hasRunningItem = false

    // 筛选弹框
    const showAccount = projectMxbState.getIn(['commonCardObj', 'showAccount'])
    const showStock = projectMxbState.getIn(['commonCardObj', 'showStock'])
    const showCurrent = projectMxbState.getIn(['commonCardObj', 'showCurrent'])

    const accountList = projectMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const currentList = projectMxbState.getIn(['commonCardObj', 'chooseContactCard'])
    const stockList = projectMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const analyse = projectMxbState.getIn(['views', 'analysisValue'])
    const mergeStock = projectMxbState.getIn(['views', 'mergeStock'])
    const showAll = projectMxbState.getIn(['views', 'showAll'])

    const filterCardObj = {
        showAccount,
        showStock,
        showCurrent,
        accountList:[],
        currentList:[],
        stockList:[],
        analyse,
    }
    dispatch(filterCardClear())

    fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
        begin,
        end,
        cardUuidList: cardItem.get('uuid') ? [cardItem.get('uuid')] : allCardUUidList,
        analyse,
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
                    direction: chooseDirection,
                    completeName: '',
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
                pageSize: Limit.MXB_PAGE_SIZE,
                direction: newRunningItem.get('direction'),

                jrAbstract: '',
                cardUuidList: cardItem.get('uuid') ? [cardItem.get('uuid')] : allCardUUidList,
                jrTypeUuid: '',
                jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                ...filterCardObj,
                mergeStock: analyse === '0' ? mergeStock: false,
                showAll: analyse === '0' ? showAll: false,
            }), reportList => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                if (showMessage(reportList)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CARD_ITEM,
                        receivedData: reportList.data,
                        cardItem,
                        chooseDirection: newRunningItem.get('direction'),
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
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])

    const selectDirction = chooseDirection === 'double_debit' || chooseDirection === 'double_credit' ? chooseDirection : 'double_credit'

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    const currentProjectItem = projectMxbState.getIn(['views', 'currentProjectItem'])
    let newTypeItem = currentRunningTypeItem
    let hasTypeItem = false
    fetchApi('getProjectMxbType', 'POST', JSON.stringify({
        begin,
        end,
        cardUuidList: cardItem.get('uuid') ? [cardItem.get('uuid')] : allCardUUidList
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
                    typeName: '全部',
                    value: '全部',
                    direction: chooseDirection,
                    completeName: '',
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
                pageSize: Limit.MXB_PAGE_SIZE,
                direction: newTypeItem.get('direction'),

                jrAbstract: '',
                cardUuidList: cardItem.get('uuid') ? [cardItem.get('uuid')] : allCardUUidList,
                jrTypeUuid: newTypeItem.get('jrJvTypeUuid'),
                jrCategoryUuid: '',
                categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
                cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
            }), reportList => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                if (showMessage(reportList)) {
                    dispatch({
                        type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CARD_ITEM,
                        receivedData: reportList.data,
                        cardItem,
                        chooseDirection: newTypeItem.get('direction'),
                        currentRunningTypeItem: newTypeItem
                    })
                }
            })
        }
    })
}
// 收支按摘要筛选,分页
export const getProjectMxbBalanceListFromFilterOrPage = (searchContent, page) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const tableName = projectMxbState.getIn(['views', 'tableName'])
    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])
    const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])

    // 筛选弹框
    const showAccount = projectMxbState.getIn(['commonCardObj', 'showAccount'])
    const showStock = projectMxbState.getIn(['commonCardObj', 'showStock'])
    const showCurrent = projectMxbState.getIn(['commonCardObj', 'showCurrent'])

    const accountList = projectMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const currentList = projectMxbState.getIn(['commonCardObj', 'chooseContactCard'])
    const stockList = projectMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const analyse = projectMxbState.getIn(['views', 'analysisValue'])
    const mergeStock = projectMxbState.getIn(['views', 'mergeStock'])
    const showAll = projectMxbState.getIn(['views', 'showAll'])

    const filterCardObj = {
        showAccount,
        showStock,
        showCurrent,
        accountList,
        currentList,
        stockList,
        analyse,
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: page ? page : 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        direction: chooseDirection,
        jrAbstract: searchContent,
        cardUuidList: currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList,
        jrTypeUuid: tableName === 'Type' ? currentRunningTypeItem.get('jrTypeUuid') : '',
        jrCategoryUuid: tableName === 'Type' ? '' : currentRunningCategoryItem.get('jrCategoryUuid'),
        ...filterCardObj,
        mergeStock: analyse === '0' ? mergeStock: false,
        showAll: analyse === '0' ? showAll: false,
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_FILTER_OR_PAGE,
                receivedData: json.data,
            })
        }
    })
}
// 类型按摘要筛选,分页
export const getProjectTypeMxbBalanceListFromFilterOrPage = (searchContent, page) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const tableName = projectMxbState.getIn(['views', 'tableName'])
    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])
    const currentRunningCategoryItem = projectMxbState.getIn(['views', 'currentRunningCategoryItem'])
    const currentRunningTypeItem = projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    const currentProjectItem = projectMxbState.getIn(['views', 'currentProjectItem'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        direction: currentRunningTypeItem.get('direction'),

        jrAbstract: searchContent,
        cardUuidList: currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList,
        selectType: 'Type',
        jrTypeUuid: currentRunningTypeItem.get('jrJvTypeUuid'),
        jrCategoryUuid: '',
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CATEGORY_OR_TYPE,
                receivedData: json.data,
                selectType: 'Type',
                currentItem: currentRunningTypeItem,
            })
        }
    })
}

// 切换 类别
export const getProjectMxbBalanceListFromCategory = (selectType, currentItem) => (dispatch, getState) => {

    const projectMxbState = getState().projectMxbState
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const searchContent = projectMxbState.getIn(['views', 'searchContent'])
    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])

    // 筛选弹框
    const showAccount = projectMxbState.getIn(['commonCardObj', 'showAccount'])
    const showStock = projectMxbState.getIn(['commonCardObj', 'showStock'])
    const showCurrent = projectMxbState.getIn(['commonCardObj', 'showCurrent'])

    const accountList = projectMxbState.getIn(['commonCardObj', 'chooseAccountCard'])
    const currentList = projectMxbState.getIn(['commonCardObj', 'chooseContactCard'])
    const stockList = projectMxbState.getIn(['commonCardObj', 'chooseStockCard'])
    const analyse = projectMxbState.getIn(['views', 'analysisValue'])
    const mergeStock = projectMxbState.getIn(['views', 'mergeStock'])
    const showAll = projectMxbState.getIn(['views', 'showAll'])

    const filterCardObj = {
        showAccount,
        showStock,
        showCurrent,
        accountList:[],
        currentList:[],
        stockList:[],
        analyse,
    }
    dispatch(filterCardClear())

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        direction: currentItem.get('direction'),

        jrAbstract: searchContent,
        cardUuidList: currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList,
        selectType,
        jrTypeUuid: '',
        jrCategoryUuid: currentItem.get('jrCategoryUuid'),
        ...filterCardObj,
        mergeStock: analyse === '0' ? mergeStock: false,
        showAll: analyse === '0' ? showAll: false,
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
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
    const issuedate = projectMxbState.get('issuedate')
    const endissuedate = projectMxbState.get('endissuedate')
    const cardList = projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const searchContent = projectMxbState.getIn(['views', 'searchContent'])
    const currentCardItem = projectMxbState.getIn(['views', 'currentCardItem'])
    const chooseDirection = projectMxbState.getIn(['views', 'chooseDirection'])
    const currentProjectItem = projectMxbState.getIn(['views', 'currentProjectItem'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectTypeMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        direction: currentItem.get('direction'),

        jrAbstract: searchContent,
        cardUuidList: currentCardItem.get('uuid') ? [currentCardItem.get('uuid')] : allCardUUidList,
        selectType,
        jrTypeUuid: currentItem.get('jrJvTypeUuid'),
        jrCategoryUuid: '',
        categoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : ''),
        cardCategoryUuid: currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid')),
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
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

// 获取往来类别
export const getProjectMxbCategoryFetch = (issuedate, endissuedate,isType = false,analyse) => dispatch => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        isType,
        analyse,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: json.data
            })
        }
    })
}

// 获取某卡片下的流水类别和类型
export const getProjectMxbRunningCategoryFetch = (issuedate, endissuedate, cardUuid,currentRunningItem,analyse) => (dispatch,getState) => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const currentRunningCategoryItem = currentRunningItem ? currentRunningItem : getState().projectMxbState.getIn(['views', 'currentRunningCategoryItem'])

    const cardList = getState().projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    fetchApi('getProjectMxbRunningCategory', 'POST', JSON.stringify({
        begin,
        end,
        cardUuidList: cardUuid ? cardUuid : allCardUUidList,
        analyse,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY,
                receivedData: json.data,
                currentRunningCategoryItem
            })
        }
    })
}
export const getProjectMxbTypeFetch = (issuedate, endissuedate, cardUuid,currentJrTypeItem) => (dispatch,getState) => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const currentRunningTypeItem = currentJrTypeItem ? currentJrTypeItem : getState().projectMxbState.getIn(['views', 'currentRunningTypeItem'])
    const cardList = getState().projectMxbState.get('cardList')
    let allCardUUidList = []
    cardList && cardList.size && cardList.map(item => {
        allCardUUidList.push(item.get('uuid'))
    })
    fetchApi('getProjectMxbType', 'POST', JSON.stringify({
        begin,
        end,
        cardUuidList: cardUuid ? cardUuid : allCardUUidList
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_TYPE_FETCH,
                receivedData: json.data,
                currentRunningTypeItem
            })
        }
    })
}

export const changeProjectMxbTable = (value) => ({
    type: ActionTypes.CHANGE_PROJECT_MXB_TABLE,
    value
})

export const changeProjectMxbChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_PROJECT_MXB_CHOOSE_VALUE,
    chooseValue
})
export const changeCommonValue = (name,value) => ({
    type: ActionTypes.PROJECT_MXB_CHANGE_COMMON_VALUE,
    name,
    value,
})
export const changeProjectMxbReportDirection = (direction,tableName) => ({
    type: ActionTypes.CHANGE_PROJECT_MXB_REPORT_DIRECTION,
    direction,
    tableName
})
export const changeProjectMxbSearchContent = (value) => ({
    type: ActionTypes.CHANGE_PROJECT_MXB_SEARCH_CONTENT,
    value
})

export const changeProjectMxbAnalysisValue = (value) => ({
    type: ActionTypes.CHANGE_PROJECT_MXB_ANALYSIS_VALUE,
    value
})

export const changeFilterCardValue = (name,value) => ({
    type: ActionTypes.PROJECT_MXB_CHANGE_FILTER_CARD,
    name,
    value,
})

export const changeItemCheckboxCheck = (checked,uuid,curSelectUuidName) => ({
    type: ActionTypes.PROJECT_MXB_CHANGE_ITEM_CHECKBOX_CHECKED,
    checked,
    uuid,
    curSelectUuidName,
})

export const changeItemCheckboxCheckAll = (checked,allList,curSelectUuidName) => dispatch => {
    allList.map((v,index) => {
        dispatch(changeItemCheckboxCheck(checked,v.get('uuid'),curSelectUuidName))
    })
}

// 收支 切换项目分析
export const getProjectMxbBalanceListFromChangeAnalysisValue = (issuedate, endissuedate, currentCardItem, direction = 'credit',filterCardObj) => (dispatch,getState) => {

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    const projectMxbState = getState().projectMxbState
    const currentProjectItem = projectMxbState.getIn(['views','currentProjectItem'])
    const mergeStock = projectMxbState.getIn(['views', 'mergeStock'])
    const showAll = projectMxbState.getIn(['views', 'showAll'])

    fetchApi('getProjectReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        isType: false,
        analyse: filterCardObj.analyse,
    }), jsonCategory => {
        if (showMessage(jsonCategory)) {
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
            dispatch({
                type: ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH,
                receivedData: jsonCategory.data,
            })
            fetchApi('getProjectMxbCardList', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newProjectItem.get('top') ? newProjectItem.get('uuid') : '',
                cardCategoryUuid: newProjectItem.get('top') ? '' : newProjectItem.get('uuid'),
                currentPage: 1,
                pageSize: Limit.MXB_CARD_PAGE_SIZE,
                ...filterCardObj,
            }), json => {
                if (showMessage(json)) {

                    if (json.data.cardList.length) { // 有卡片
                        let cardItem = {}
                        if (json.data.cardList.some(v => v.uuid === currentCardItem.get('uuid') || currentCardItem.get('uuid') === '')) {
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
                            cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                            analyse:filterCardObj.analyse,
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
                                        direction: 'double_credit',
                                        completeName: '',
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
                                    pageSize: Limit.MXB_PAGE_SIZE,
                                    direction: newRunningItem.get('direction'),

                                    jrAbstract: '',
                                    cardUuidList: cardItem.uuid ? [cardItem.uuid] : allCardUUidList,
                                    jrTypeUuid: '',
                                    jrCategoryUuid: newRunningItem.get('jrCategoryUuid'),
                                    ...filterCardObj,
                                    mergeStock: filterCardObj.analyse === '0' ? mergeStock: false,
                                    showAll: filterCardObj.analyse === '0' ? showAll: false,
                                }), reportList => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if (showMessage(reportList)) {
                                        dispatch({
                                            type: ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD,
                                            receivedData: json.data,
                                            reportData: reportList.data,
                                            issuedate,
                                            endissuedate,
                                            direction: newRunningItem.get('direction'),
                                            currentProjectItem: newProjectItem,
                                            cardItem: cardItem,
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
                            direction: 'double_credit',
                            completeName: '',
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
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            })
        }
    })
}

export const filterCardClear = () => ({ type: ActionTypes.PROJECT_MXB_FILTER_CARD_CLEAR })
export const needBranchClear = () => ({ type: ActionTypes.PROJECT_MXB_NEED_BRANCH_CLEAR })
