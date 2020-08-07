import { showMessage } from 'app/utils'
import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getWarehouseTree =  () => (dispatch) => {
    fetchApi(`getWarehouseTree`, 'POST', JSON.stringify({uuidList: []}), json => {
        if (showMessage(json, '', '', '', true)) {
            dispatch({
                type: ActionTypes.GET_WAREHOUSE_TREE,
                data: json.data.cardList
            })
        }
    })
}

export const warehouseEnable =  () => (dispatch) => {
    fetchApi(`warehouseEnable`, 'GET', '', json => {
    })
}

export const changeWarehouseData = (dataType, value) => ({
    type: ActionTypes.CHANGE_WAREHOUSE_DATA,
    dataType,
    value
})

export const toggleLowerItem = (uuid) => ({
    type: ActionTypes.WAREHOUSE_TOGGLELOWER,
    uuid
})

export const checkedWarehouseCard = (uuid) => ({
    type: ActionTypes.CHECKED_WAREHOUSE_CARD,
    uuid
})

export const getWarehouseSingleCard = (uuid, history) => (dispatch) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`getWarehouseSingleCard`, 'GET', `uuid=${uuid}`, json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_WAREHOUSE_SINGLE_CARD,
                data: json.data
            })
            history.push('/config/warehouse/card')
        }
    })
}

export const deleteWarehouseCard = (deleteList, callBack) => (dispatch) => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`deleteWarehouseCard`, 'POST', JSON.stringify({
        deleteList
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if (json.data.errorChild) {
                thirdParty.toast.info(`${json.data.errorChild}存在下级,不允许删除`)
            } if (json.data.errorOpen) {
                thirdParty.toast.info(`${json.data.errorOpen}已设置期初值`)
            } else {
                thirdParty.toast.success('删除成功')
            }
            dispatch(getWarehouseTree())
            callBack()

        }
    })
}

export const addWarehouseCard = (parentCard) => ({
    type: ActionTypes.ADD_WAREHOUSE_CARD,
    parentCard
})

export const checkWarehouseCard = (history, saveAndNew) => (dispatch, getState) => {
    const state = getState().warehouseState
    const name = state.getIn(['data', 'name'])
    const uuid = state.getIn(['data', 'uuid'])

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('warehouseCardNameRepeat', 'POST', JSON.stringify({
        name,
        uuid,
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if (json.data.codeList.length) {
                thirdParty.Confirm({
                    message: `卡片名称与[编码：${json.data.codeList[0]}]卡片重复，确定保存吗？`,
                    title: "名称重复",
                    buttonLabels: ['取消', '确定'],
                    onSuccess : (result) => {
                        if (result.buttonIndex === 1) {
                            dispatch(saveWarehouseCard(history, saveAndNew))
                        }
                    },
                    onFail : (err) => alert(err)
                })
            } else {
                dispatch(saveWarehouseCard(history, saveAndNew))
            }
        }
    })
}

export const saveWarehouseCard = (history, saveAndNew) => (dispatch, getState) => {
    const state = getState().warehouseState
    const data = state.get('data').toJS()
    const isInsert = state.getIn(['views', 'insertOrModify']) == 'insert' ? true : false

    if (isInsert) {
        data.action = 'MANAGER-WAREHOUSE_SETTING-CUD_CARD'
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(`${isInsert ? 'insertWarehouseCard' : 'modifyWarehouseCard'}`, 'POST', JSON.stringify(data), json => {
        thirdParty.toast.hide()
        if (showMessage(json, 'show')) {
            dispatch(getWarehouseTree())
            if (saveAndNew) {
                dispatch(changeWarehouseData(['data', 'name'], ''))
                dispatch(changeWarehouseData(['data', 'code'], ''))
                dispatch(changeWarehouseData(['data', 'uuid'], ''))
            } else {
                history.goBack()
            }
        }
    })
}

export const clearWarehouseChecked = () => ({
    type: ActionTypes.CLEAR_WAREHOUSE_CHECKED
})
