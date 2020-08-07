import { toJS, fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import { showMessage } from 'app/utils'
import fetchApi from 'app/constants/fetch.running.js'
import fetchGlApi from 'app/constants/fetch.constant.js'

import { getCardList, getProjectCardList, getBatchList, getStockListByCategory } from 'app/redux/Edit/EditRunning/editRunning.action.js'
import { getRelativeAllCardList, getProjectAllCardList, getStockAllCardList } from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const beforeAddManageTypeCardFromEditRunning = (range, history, otherPageName) => (dispatch,getState) => {
    const getIUManageListTitle =  new Promise(resolve => {
        fetchApi(`getIUManageListTitle`, 'GET', '', json => {
            if (showMessage(json)) {
                resolve(json.data)
            }
        })
    })

    const getIsCheckOut = new Promise(resolve => {
        fetchApi(`getIUManageCardLimitAndAc`, 'GET', '', json => {
            if (showMessage(json)) {
                resolve(json.data.isCheckOut)
            }
        })
    })

    const getInitRelaCard =  new Promise(resolve => {
        fetchApi(`getInitRelaCard`, 'GET', '', json => {
            if (showMessage(json)) {
                resolve(json.data)
            }
        })
    })

        let promises = [getIUManageListTitle, getIsCheckOut, getInitRelaCard]
        Promise.all(promises).then(results => {
            let originTags = results[0]
            let isCheckOut = results[1]
            let receivedData = results[2]

            receivedData['isCheckOut'] = isCheckOut
            originTags.unshift({'name': '全部', 'uuid': ''})
            dispatch({
                type: ActionTypes.BEFORE_ADD_MANAGE_TYPE_CARD_FROM_EDIT_RUNNING,
                receivedData: receivedData,
                originTags: fromJS(originTags),
                otherPageName: otherPageName ? otherPageName : 'editRunning', // 录入流水不传 otherPageName: editRunning \ searchApproval
            })
            history.push('/config/relative/relativeCardInsert')
        })
}

export const beforeAddInventoryCardFromEditRunning = (range, history, otherPageName) => (dispatch,getState) => {

    fetchApi(`getInventoryHighTypeList`, 'GET', '', tagList => {
        if (showMessage(tagList)) {
            fetchApi(`getInitStockCard`, 'GET', '', json => {
                if (showMessage(json)) {
                    let originTags = tagList.data.filter(v => range.indexOf(v.uuid) > -1)
                    originTags = originTags.length ? originTags : tagList.data
                    // const str = saleOrPurchase == 'sale' ? 'isAppliedPurchase' : 'isAppliedSale'
                    // 将顶级类别处理成只受销售或采购影响
                    // originTags = originTags.map(v => {
                    //     v[str] = false
                    //     return v
                    // })

                    dispatch({
                        type: ActionTypes.BEFORE_ADD_INVENTORY_CARD_FROM_EDIT_RUNNING,
                        receivedData: json.data,
                        originTags: fromJS(originTags),
                        otherPageName: otherPageName ? otherPageName : 'editRunning', // 录入流水不传 otherPageName: editRunning \ searchApproval
                    })
                    history.push('/config/inventory/inventoryInsert')
                }
            })
        }
    })

    const isOpenedWarehouse = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理
    if (isOpenedWarehouse) {
        fetchApi(`getWarehouseTree`, 'POST', JSON.stringify({uuidList:[], inventoryUuid:''}), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_INVENTORY_WAREHOUSE_TREE,
                    data: json.data.cardList,
                    checkedWarehouse: false
                })
            }
        })
    }

    fetchApi(`inventoryAssistList`, 'GET', '', json => {//获取存货辅助属性结构列表
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.CHANGE_INVENTORY_DATA,
                dataType: 'assistClassificationList',
                value: fromJS(json.data.assistClassificationList),
                short: true
            })
        }
    })

}

export const beforeAddProjectCardFromEditRunning = (history, range, otherPageName) => (dispatch,getState) => {
    range = range || getState().editRunningState.getIn(['oriTemp', 'projectRange'])

    function projectHighType () {
        return new Promise(resolve => {
            fetchApi(`getProjectConfigHighType`, 'GET', '', json => {
                if (showMessage(json)) {
                    resolve(json.data)
                }
            })
        })
    }
    function getCode () {
        return new Promise(resolve => {
            fetchApi(`getProjectCardCode`, 'GET', ``, json => {
                if (showMessage(json)) {
                    resolve(json.data.code)
                }
            })
        })
    }
    function getProjectTree () {
        return new Promise(resolve => {
            fetchApi(`getProjectTree`, 'GET', `uuid=${range.get(0)}`, json => {
                if (showMessage(json)) {
                    resolve(json.data)
                }
            })
        })
    }

    let promises = [projectHighType, getCode, getProjectTree].map(v => v())
    Promise.all(promises).then(results => {
        let highTypeList = results[0]
        let code = results[1]
        let receivedData = results[2]

        dispatch({
            type: ActionTypes.BEFORE_ADD_PROJECT_CARD_FROM_EDIT_RUNNING,
            receivedData: receivedData.resultList,
            ctgyUuid: range.get(0),
            code,
            highTypeList,
            otherPageName: otherPageName ? otherPageName : 'editRunning', // 录入流水不传 otherPageName: editRunning \ searchApproval
        })
        history.push('/config/project/projectCard')
    })
}

// 新增存货之后
export const getInventoryCardListForchangeConfig = () => (dispatch,getState) => {
    const otherPageName = getState().inventoryConfState.getIn(['views','otherPageName'])
    if (otherPageName == 'editRunning') {
        const categoryType = getState().editRunningState.getIn(['oriTemp', 'categoryType'])
        if (categoryType=='LB_CHZZ') {
            dispatch(getStockListByCategory({top: true, uuid: ''}, 'stockRange'))
            return
        }
        dispatch(getCardList('stockRange'))
    } else if (otherPageName == 'searchApproval') {
        dispatch(getStockAllCardList(null, 'project', ''))
    }
}

// 新增往来之后
export const getRelativeCardListForchangeConfig = () => (dispatch,getState) => {
    const otherPageName = getState().relativeConfState.getIn(['views','otherPageName'])
    if (otherPageName == 'editRunning') {
        dispatch(getCardList('contactsRange'))
    } else if (otherPageName == 'searchApproval') {
        dispatch(getRelativeAllCardList(null, 'contact', ''))
    }
}
// 新增项目之后
export const getPrejectCardListForchangeConfig = () => (dispatch,getState) => {
    const otherPageName = getState().projectConfState.getIn(['views','otherPageName'])
    if (otherPageName == 'editRunning') {
        const projectRange = getState().editRunningState.getIn(['oriTemp', 'projectRange'])
        dispatch(getProjectCardList(projectRange))
    } else if (otherPageName == 'searchApproval') {
        dispatch(getProjectAllCardList(null, 'stock', ''))
    }
}

export const beforAddAccontfromEditRunning = (dataType, value) => ({
    type: ActionTypes.BEFOR_ADD_ACCONT_FROM_EDIT_RUNNING,
    dataType,
    value
})

//存货卡片新增修改批次
export const editInventoryBatch = (batchType, inventoryUuid, openShelfLife, shelfLife=0) => (dispatch, getState) => {
    let bitch = {batchType, inventoryUuid, openShelfLife, shelfLife, editPage: 'editRunning'}
    if (batchType=='MODIFY-MODIFY') {
        const batchList = getState().editRunningState.getIn(['cardAllList','batchList'])//批次列表
        bitch['batchList']=batchList
    }
    dispatch(changeInventoryData('batch', fromJS(bitch), true))
    global.routerHistory.push('/config/inventory/batchSet')
}

export const changeInventoryData = (dataType, value, short) => ({
    type:ActionTypes.CHANGE_INVENTORY_DATA,
    dataType,
    value,
    short
})

//新增或修改批次之后
export const updateStockBatch = (batch) => ({
    type: ActionTypes.RUNNING_UPDATE_STOCK_BATCH,
    batch: fromJS(batch)
})
