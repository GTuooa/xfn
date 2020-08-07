import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

// 首次进入
export const getPeriodAndAccountMxbBalanceList = () => dispatch => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getAccountMxbReport', 'POST', JSON.stringify({
        begin: '',
        end: '',
        accountUuid: '',
        accountType: '',
        accountDetailType: 'ACCOUNT_CATEGORY', // OTHER_CATEGORY,  OTHER_TYPE
        typeUuid: '',
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
        jrAbstract:'',
    }), json => {
        if (showMessage(json)) {
            const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_PERIOD_AND_ACCOUNT_MXB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: openedissuedate,
                endissuedate: openedissuedate,
                jrAbstract:'',
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 切换账期 或 切换账户 重新获取列表
export const getAccountMxbBalanceListFromSwitchPeriodOrAccount = (issuedate, endissuedate, currentAccoountUuid, accountDetailType, jrAbstract = '', accountType='') => (dispatch, getState) => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getAccountMxbCategory', 'POST', JSON.stringify({
        begin,
        end,
        accountUuid: currentAccoountUuid,
        accountType,
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_ACCOUNT_MXB_TREE,
                receivedData: json.data
            })

            let typeUuid = ''
            const currentTreeSelectItem = getState().accountMxbState.getIn(['views', 'currentTreeSelectItem'])
            if (currentTreeSelectItem.get('uuid')) {
                const currentTree = {
                    'ACCOUNT_CATEGORY': json.data.accountCategory,
                    'OTHER_CATEGORY': json.data.otherCategory,
                    'OTHER_TYPE': json.data.otherType,
                }[accountDetailType]

                let haveChildItem = false
                const loop = item => item.forEach(v => {
                    if (v.uuid === currentTreeSelectItem.get('uuid')) {
                        haveChildItem = true
                    } else {
                        if (v.childList && v.childList.length) {
                            loop(v.childList)
                        }
                    }
                })
                loop(currentTree.childList)

                if (haveChildItem) {
                    typeUuid = currentTreeSelectItem.get('uuid')
                }
            }

            fetchApi('getAccountMxbReport', 'POST', JSON.stringify({
                begin,
                end,
                accountUuid: currentAccoountUuid,
                accountType,
                accountDetailType, // OTHER_CATEGORY,  OTHER_TYPE
                typeUuid: typeUuid,
                currentPage: 1,
                pageSize: Limit.MXB_PAGE_SIZE,
                jrAbstract
            }), json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_ACCOUNT,
                        receivedData: json.data,
                        issuedate: issuedate,
                        endissuedate: endissuedate,
                        currentAccoountUuid,
                        typeUuid,
                        jrAbstract
                    })
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}
// // 切换账期 或 切换账户 重新获取列表 状态全部清空
// export const getAccountMxbBalanceListFromSwitchPeriodOrAccount = (issuedate, endissuedate, currentAccoountUuid) => dispatch => {
//
//     if (!issuedate) {
//         return message.info('账期异常，请刷新再试', 2)
//     }
//
//     dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
//     fetchApi('getAccountMxbReport', 'POST', JSON.stringify({
//         begin,
//         end,
//         accountUuid: currentAccoountUuid,
//         accountDetailType: 'ACCOUNT_CATEGORY', // OTHER_CATEGORY,  OTHER_TYPE
//         typeUuid: '',
//         currentPage: 1,
//         pageSize: Limit.MXB_PAGE_SIZE
//     }), json => {
//         if (showMessage(json)) {
//             dispatch({
//                 type: ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_ACCOUNT,
//                 receivedData: json.data,
//                 issuedate: issuedate,
//                 endissuedate: endissuedate,
//                 currentAccoountUuid
//             })
//         }
//         dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
//     })
// }

// 切换树节点或页数 重新获取列表
export const getAccountMxbBalanceListFromTreeOrPage = (issuedate, endissuedate, currentAccoountUuid, accountDetailType, treeData, currentPage, reflash, jrAbstract) => (dispatch,getState) => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const accountMxbState = getState().accountMxbState
    const accountType = accountMxbState.get('accountType')
    let options = {
        begin,
        end,
        accountUuid: currentAccoountUuid,
        accountType,
        accountDetailType, // OTHER_CATEGORY,  OTHER_TYPE
        typeUuid: treeData.get('uuid'),
        currentPage,
        pageSize: Limit.MXB_PAGE_SIZE,
        jrAbstract
    }

    if (accountDetailType === 'OTHER_TYPE') {
        options.direction = treeData.get('direction')
    }

    if (reflash === 'reflash') {
        options.needPeriod = 'true'
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getAccountMxbReport', 'POST', JSON.stringify(options), json => {

        if (reflash === 'reflash') {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
        }

        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_TREE_OR_PAGE,
                receivedData: json.data,
                treeData,
                jrAbstract
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 获取3个类别树 （单纯需要刷新类别树时调用）
export const getAccountMxbTree = (issuedate, endissuedate, currentAccoountUuid,accountType='',currentPage = 1) => dispatch => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getAccountMxbCategory', 'POST', JSON.stringify({
        begin,
        end,
        accountUuid: currentAccoountUuid,
        accountType,
        currentPage,
        pageSize: Limit.MXB_PAGE_SIZE
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_ACCOUNT_MXB_TREE,
                receivedData: json.data
            })
        }
    })
}

// 三个类别树切换
export const changeAccountMxbActiveTab = (place, value) => (dispatch, getState) => {

    const accountMxbState = getState().accountMxbState
    const issuedate = accountMxbState.get('issuedate')
    const endissuedate = accountMxbState.get('endissuedate')
    const currentAccoountUuid = accountMxbState.getIn(['views', 'currentAccoountUuid'])
    const categoryOrType = accountMxbState.getIn(['views', 'categoryOrType'])
    const jrAbstract = accountMxbState.getIn(['views', 'jrAbstract'])
    const accountType = accountMxbState.getIn(['views', 'accountType'])

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }

    let accountDetailType = ''
    if (place === 'currentTab' && value === 'left') {
        accountDetailType = 'ACCOUNT_CATEGORY'
    } else if (place === 'currentTab' && value === 'right') {
        accountDetailType = categoryOrType === 'category' ? 'OTHER_CATEGORY' : 'OTHER_TYPE'
    } else if (place === 'categoryOrType' && value === 'category') {
        accountDetailType = 'OTHER_CATEGORY'
    } else if (place === 'categoryOrType' && value === 'type') {
        accountDetailType = 'OTHER_TYPE'
    } else {
        console.log('意外');
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getAccountMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        accountUuid: currentAccoountUuid,
        accountType,
        accountDetailType, // ACCOUNT_CATEGORY OTHER_CATEGORY,  OTHER_TYPE
        typeUuid: '',
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        jrAbstract
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_ACCOUNT_MXB_ACTIVE_TAB,
                receivedData: json.data,
                place,
                value
            })
            dispatch(changeAccountMxbSearchContent(jrAbstract))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

// 从余额表跳明细表
export const getAccountMxbBalanceListFromAccountYeb = (issuedate, endissuedate, currentAccoountUuid) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getAccountMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        accountUuid: currentAccoountUuid,
        accountType:'',
        accountDetailType: 'ACCOUNT_CATEGORY', // OTHER_CATEGORY,  OTHER_TYPE
        typeUuid: '',
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
        jrAbstract:''
    }), json => {
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_ACCOUNT_MXB_BALANCE_LIST_FROM_ACCOUNTYEB,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
                currentAccoountUuid,
                jrAbstract:'',
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeAccountMxbChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_ACCOUNT_MXB_CHOOSE_VALUE,
    chooseValue
})

export const changeAccountMxbSearchContent = (value) => ({
    type: ActionTypes.CHANGE_ACCOUNT_MXB_SEARCH_CONTENT,
    value
})
export const changeAccountMxbAccountType = (value) => ({
    type: ActionTypes.CHANGE_ACCOUNT_MXB_ACCOUNT_TYPE,
    value
})

// 账户卡片分页
// export const getRelativeMxbBalanceListFromChangeCardList = (issuedate, endissuedate,relativeItem,currentPage) => (dispatch,getState) => {
//
//     if (!issuedate)  {
//         return message.info('账期异常,请刷新再试', 2)
//     }
//
//     dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
//     const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
//     const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
//     const relativeMxbState = getState().relativeMxbState
//     const analysisType = relativeMxbState.getIn(['views','analysisType'])
//
//     fetchApi('getRelativeMxbCardList', 'POST', JSON.stringify({
//         begin,
//         end,
//         categoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? relativeItem.get('uuid') : ''),
//         cardCategoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? '' : relativeItem.get('uuid')),
//         currentPage,
//         pageSize: Limit.MXB_PAGE_SIZE,
//         analysisType,
//     }), json => {
//         if (showMessage(json)) {
//             dispatch({
//                 type: ActionTypes.GET_RELATIVE_MXB_CARD_LIST,
//                 receivedData: json.data,
//             })
//         }
//         dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
//     })
// }
