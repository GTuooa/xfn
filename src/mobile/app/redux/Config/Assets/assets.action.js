import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { toJS } from 'immutable'
import { showMessage, configCheck } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getAssestsListFetch = () => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('initclassification', 'GET', '', json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.GET_ASSESTS_LIST_FETCH,
                receivedData: json.data
            })

        }
    })
    fetchApi('getlabelList', 'GET', '', json => {
        showMessage(json) && dispatch({
            type: ActionTypes.GET_LABEL_LIST,
            receivedData: json
        })
    })
}

export const changeCardDetailList = (json) => ({
    type: ActionTypes.GET_ASSESTS_LIST_FETCH,
    receivedData: json
})

// 固定资产页面的action
export const showAllModifyButton = () => ({
    type: ActionTypes.SHOW_ALL_MODIFY_BUTTON
})
export const toggleLowerAssets = (id) => ({
    type: ActionTypes.TOGGLE_LOWER_ASSETS,
    id
})
export const changeTabIndexAssetsconfig = (idx) => ({
    type: ActionTypes.CHANGE_TAB_INDEX_ASSETSCONFIG,
    idx
})

export const changeSalvage = (value) => ({
    type: ActionTypes.CHANGE_SALVAGE,
    value
})
export const changeDefaultUseMonth = (value) => ({
    type: ActionTypes.CHANGE_DEFAULT_USE_MONTH,
    value
})
export const changeSerialName = (name) => ({
    type: ActionTypes.CHANGE_SERIAL_NAME,
    name
})

export const changeClassificationId = (id, upperAssetsNumber) => ({
    type: ActionTypes.CHANGE_CLASSIFICATION_ID,
    id,
    upperAssetsNumber
})

export const beforeInsertClassification = (currentassetsindex, newassetsId, upperAssetsName) => dispatch => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getclassification', 'POST', JSON.stringify({serialNumber: currentassetsindex}), json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.BEFORE_INSERT_CLASSIFICATION,
                currentassetsindex,
                newassetsId,
                upperAssetsName,
                receivedData: json.data
            })
        }
    })
}
export const changeRemark = (remark) => ({
    type: ActionTypes.CHANGE_REMARK,
    remark
})

export const assetsToAc = (selectAcIndex, classificationOrCard) => ({
	type: ActionTypes.ASSETS_TO_AC,
	selectAcIndex,
	classificationOrCard
})

export const assetsSelectAc = (acid, acfullname, acname, asscategorylist) => (dispatch, getState) => {

    const selectAcIndex = getState().assetsState.get('selectAcIndex')
    const classificationOrCard = getState().assetsState.get('classificationOrCard')

    dispatch({
        type: ActionTypes.ASSETS_SELECT_AC,
        acid,
        acname,
        asscategorylist,
        selectAcIndex,
        classificationOrCard
    })

    // const aclist = getState().allState.get('aclist').filter(v => v.get('selected'))
    // const selectAcIndex = getState().assetsState.get('selectAcIndex')
    // const classificationOrCard = getState().assetsState.get('classificationOrCard')
    //
    // if (aclist.size === 0) {
    //     alert('未选择科目')
    // } else if (aclist.size > 1) {
    //     alert('仅能选择一个科目')
    // } else {
    //     dispatch({
    //         type: ActionTypes.ASSETS_SELECT_AC,
    //         aclist,
    //         selectAcIndex,
    //         classificationOrCard
    //     })
    //     history.goBack()
    // }
}

export const getclassificationFetch = (serialNumber) => dispatch => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getclassification', 'POST', JSON.stringify({serialNumber: serialNumber}), json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.GET_CLASSIFICATION_FETCH,
                receivedData: json
            })
        }
    })
}

export const enterAssetsAsslist = (value) => ({
    type: ActionTypes.ENTER_ASSETS_ASSLIST,
    value
})
export const enterClassificationOrCardAsslist = (value, classificationOrCard, strAsslist, idx) => ({
    type: ActionTypes.ENTER_CLASSIFICATION_OR_CARD_ASSLIST,
    value,
    classificationOrCard,
    strAsslist,
    idx
})
export const selectAssetsItem = (idx) => ({
    type: ActionTypes.SELECT_ASSETS_ITEM,
    idx
})
export const changeAssetsCheckbox = () => ({
    type: ActionTypes.CHANGE_ASSETS_CHECKBOX
})
export const cancelAssetsCheckbox = (bool) => ({
    type: ActionTypes.CANCEL_ASSETS_CHECKBOX,
    bool
})

export const selectallAssetsCheckbox = () => ({
    type: ActionTypes.SELECT_ALL_ASSETS_CHECKBOX
})

export const enterClassification = (history) => (dispatch, getState) => {

    const classification = getState().assetsState.get('classification')
    const assetsConfigMode = getState().assetsState.get('assetsConfigMode')

    if (classification.get('serialName').length === 0)
        return showMessage('', '', '', '辅助类别名称未输入')
    
    if (configCheck.hasChiness(classification.get('serialName'))) {
        return showMessage('', '', '', `名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    ;({
		//修改
		modify() {
            fetchApi('modifyclassification', 'POST', JSON.stringify(classification), json => {

                if (showMessage(json)) {
                    thirdParty.toast.hide()
                    dispatch({
                        type: ActionTypes.AFTER_ENTER_CLASSIFICATION
                    })
                    history.goBack()
                }
            })
		},
		//新增
		insert() {
            fetchApi('insertclassification', 'POST', JSON.stringify(classification), json => {
                if (showMessage(json)) {
                    thirdParty.toast.hide()
                    dispatch({
                        type: ActionTypes.AFTER_ENTER_CLASSIFICATION
                    })
                    history.goBack()
                }
            })
		}
	}[assetsConfigMode])() //编辑模式的类别

}

export const deleteAssetsItem = () => (dispatch, getState) => {
    thirdParty.Confirm({
		message: "确定删除？",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                const assetsClassificationIdList = getState().assetsState.get('assetslist').filter(v => v.get('checked') && v.get('serialNumber').length === 3 ).map(v => v.get('serialNumber'))
                const assetsCardIdList = getState().assetsState.get('assetslist').filter(v => v.get('checked') && v.get('serialNumber').length === 7 ).map(v => v.get('serialNumber').substr(3))
                if (assetsClassificationIdList.size !== 0) {
                    fetchApi('deleteclassification', 'POST', JSON.stringify({cfNumList: assetsClassificationIdList}), json => {
                        if(showMessage(json)){
                            fetchApi('initclassification', 'GET', '', json => {
                                if (!json.code) {
                                    dispatch({
                                        type: ActionTypes.GET_ASSESTS_LIST_FETCH,
                                        receivedData: json.data
                                    })
                                } else {
                                    showMessage(json)
                                }
                            })
                            showDeleteError(json)
                            dispatch(cancelAssetsCheckbox(false))
                        }
                    })
                } else if (assetsCardIdList.size !== 0) {
                    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                    fetchApi('deleteassetscard', 'POST', JSON.stringify({cardNumList: assetsCardIdList}), json => {
                        // console.log('删除资产卡片项目json', json, 'assetsCardIdList', assetsCardIdList.toJS())
                        if(showMessage(json)){
                            fetchApi('initclassification', 'GET', '', json => {
                                if (!json.code) {
                                    // thirdParty.toast.hide()
                                    dispatch({
                                        type: ActionTypes.GET_ASSESTS_LIST_FETCH,
                                        receivedData: json.data
                                    })
                                } else {
                                    showMessage(json)
                                }
                            })
                            showError(json)
                            dispatch(cancelAssetsCheckbox(false))
                        }
                    })
                }
			}
		},
		onFail : (err) => alert(err)
	})
}

// card
// 删除单张卡片
export const deleteSingleCard = (cardNumber, history) => {
    thirdParty.Confirm({
		message: "确定删除？",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
                thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
                fetchApi('deleteassetscard', 'POST', JSON.stringify({cardNumList: [cardNumber]}), json => {
                    if (!json.code) {
                        // thirdParty.toast.hide()
                        showError(json)
                        history.goBack()
                    } else {
                        showMessage(json)
                    }
                })
            }
        }
	})
}

const showError = (json) => {

	const canNotDeletemassage = json.data.message

	if (canNotDeletemassage) {
		thirdParty.toast.fail(canNotDeletemassage, 2)
	} else {
        thirdParty.toast.success('删除成功', 2)
	}
}

const showDeleteError = (json) => {
    if (json.data && json.data.length) {
        thirdParty.Alert(json.data.join(';'))
    } else {
        thirdParty.toast.success('删除成功', 2)
    }
}

export const getCardNumberFetch = (cardInputPeriod) => dispatch => {

    // 新增卡片时获取卡片的最大编码
    if (cardInputPeriod) {
        dispatch({
            type: ActionTypes.CHANGE_CARD_PERIOD,
            cardInputPeriod
        })
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getmaxcardnumber', 'GET', '', json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.GET_CARDNUMBER_FETCH,
                receivedData: json
            })
        } else if (json.code === 16308) {
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.GET_CARDNUMBER_FETCH,
                receivedData: {
                    data: ''
                }
            })
        }
    })
}

// 通过cardNumber, oldSerialNumber获取卡片详情
export const getAssetsCardFetch = (cardNumber, oldSerialNumber, history) => dispatch => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getassetscard', 'POST', JSON.stringify({cardNumber: cardNumber}), json => {
        if(showMessage(json)){
            thirdParty.toast.hide()
            dispatch({
                type: ActionTypes.GET_ASSETS_CARD_FETCH,
                receivedData: json,
                oldSerialNumber
            })
            setTimeout(() => history.push('/assets/assetsoption/card'), 0)
        }
    })
}

export const changeCardName = (name) => ({
    type: ActionTypes.CHANGE_CARD_NAME,
    name
})

export const changeCardNunber = (value) => dispatch => {
    if (/^\d{0,4}$/g.test(value) || value === '') {
        dispatch({
            type: ActionTypes.CHANGE_CARD_NUNBER,
            value
        })
    } else {
       thirdParty.toast.info('卡片编码仅支持4位数字', 1)
    }
}

export const changeCardSalvage = (salvage) => ({
    type: ActionTypes.CHANGE_CARD_SALVAGE,
    salvage
})
export const changeCardOriginalValue = (cardValue) => ({
    type: ActionTypes.CHANGE_CARD_ORIGINAL_VALUE,
    cardValue
})

export const changeUseMonth = (monthValue) => ({
    type: ActionTypes.CHANGE_USE_MONTH,
    monthValue
})
export const changeStartUseTime = (value, issuedate) => ({
    type: ActionTypes.CHANGE_START_USE_TIME,
    value,
    issuedate
})
export const changeCardAssetsName = (value) => dispatch => {
    const valueValue = value.split('_')
    dispatch({
        type: ActionTypes.CHANGE_CARD_ASSETS_NAME,
        value
    })

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getclassification', 'POST', JSON.stringify({'serialNumber': valueValue[0]}), json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
            // 补全上级科目
            dispatch({
                type: ActionTypes.CARD_AFTER_GET_CLASSIFICATION,
                receivedData: json
            })
        }
    })
}
export const changeCardClassificationName = (value) => dispatch => {
    const valueValue = value.split('_')
    dispatch({
        type: ActionTypes.CHANGE_CARD_CLASSIFICATION_NAME,
        value
    })

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getclassification', 'POST', JSON.stringify({'serialNumber': valueValue[0]}), json => {
        if (showMessage(json)) {
            thirdParty.toast.hide()
        // 补全上级科目
            dispatch({
                type: ActionTypes.CARD_AFTER_GET_CLASSIFICATION,
                receivedData: json
            })
        }
    })
}
export const enterCard = (residualValue, monthlyDepreciation, alreadyDepreciationTime, sumDepreciation, earlyNetWorth, save, history) => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.BEFORE_ENTER_CARD,
        residualValue,
        monthlyDepreciation,
        alreadyDepreciationTime,
        sumDepreciation,
        earlyNetWorth
    })

    const card = getState().assetsState.get('card')
    const assetslist = getState().assetsState.get('assetslist')
    const assetsNumber = card.get('assetsNumber')
    const assetsCfList = assetslist.filter(v => v.get('serialNumber').indexOf(assetsNumber) === 0 && v.get('serialNumber').length === 3)
    const cardNumber = card.get('cardNumber')
    const classificationNumber = card.get('classificationNumber')

    // 新增卡片fetch前的前台数据校验
    if (card.get('assetsName') === '') {
        return showMessage('', '', '', '资产分类未选择')
    } else {
        if (assetsCfList.size !== 0 && card.get('classificationName') === '') {
            return showMessage('', '', '', '辅助分类未选择')
        }
    }
    if (card.get('cardNumber').length === 0)
        return showMessage('', '', '', '卡片编码未输入')
    if (card.get('cardName').length === 0)
        return showMessage('', '', '', '卡片名称未输入')
    if (configCheck.hasChiness(card.get('cardName')))
        return showMessage('', '', '', `名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
    if (card.get('remark').length > 45)
        return thirdParty.Alert('备注字数不能大于45个')
    if (card.get('cardValue') === '')
        return showMessage('', '', '', '原值未输入')
    if (card.get('cardValue') === 0)
        return showMessage('', '', '', '原值不能为0')
    if (card.get('salvage') === '')
        return showMessage('', '', '', '残值率未输入')
    if (card.get('startTime') === '')
        return showMessage('', '', '', '开始使用期间未输入')
    if (card.get('totalMonth') === '' ) {
        return showMessage('', '', '', '默认使用总期限未输入')
    } else if (card.get('totalMonth') == 0) {
        return showMessage('', '', '', '默认使用总期限不能为0')
    }
    if (card.get('debitName') === '')
        return showMessage('', '', '', '财务处理借方科目未选择')
    if (card.get('creditName') === '')
        return showMessage('', '', '', '财务处理贷方科目未选择')
    const assetsCardMode = getState().assetsState.get('assetsCardMode')

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    ;({
		//修改
		modify() {
            fetchApi('modifyassetscard', 'POST', JSON.stringify(card), json => {
                if(showMessage(json)){
                    thirdParty.toast.hide()
                    dispatch(getAssetsCardFetch(cardNumber, classificationNumber, history))
                }
            })
		},
		//新增
		insert() {
            fetchApi('insertassetscard', 'POST', JSON.stringify(card), json => {
                if (showMessage(json) && save === 'save') {
                    thirdParty.toast.hide()
                    // 保存并新增
                    dispatch(getCardNumberFetch())
                } else if (showMessage(json) && save !== 'save') {
                    // 保存
                    history.goBack()
                }
            })
		}
	}[assetsCardMode])() //编辑模式
}
export const beforeMofifyCard = () => ({
    type: ActionTypes.BEFORE_MOFIFY_CARD
})

export const changeCardRemark = (remark) => ({
    type: ActionTypes.CHANGE_CARD_REMARK,
    remark
})

export const changeDetailCard = () => ({
    type: ActionTypes.CHANGE_DETAIL_CARD
})

export const clearCardFetch = (status, cardNumber, openedmonth, openedyear) => dispatch => {
    fetchApi('clearcard', 'POST', JSON.stringify({'cardNumber': cardNumber}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_CARD_STATUS,
                status,
                openedmonth,
                openedyear
            })
        }
    })
}

export const cancelClearCard = (status, cardNumber) => dispatch => {
    fetchApi('cancelclearcard', 'POST', JSON.stringify({'cardNumber': cardNumber}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_CARD_STATUS,
                status
            })
        }
    })
}

export const copyCardFetch = (copyNum, history) => (dispatch, getState) => {
    const card = getState().assetsState.get('card')
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('copyassetscard', 'POST', JSON.stringify({
        cardNumber: card.get('cardNumber'),
        copyNum: copyNum
    }), json => {
        if (showMessage(json)) {
            history.goBack()
        }
    })
}
export const initAssetsStatus = () => ({
    type: ActionTypes.INIT_ASSETS_STATUS
})
export const changeSelectLabelStatus = (status) => ({
    type: ActionTypes.CHANGE_SELECTLABEL_STATUS,
    status
})
export const changeLabelInput = (value, labelList) => ({
    type: ActionTypes.CHANGE_LABELINPUT,
    value,
    labelList
})
export const changeLabelFromSelect = (value, labelList) => ({
    type: ActionTypes.CHANGE_LABEL_FROM_SELECT,
    value,
    labelList
})
export const changeSelectLabeListAllDisplay = () => ({
    type: ActionTypes.CHANGE_SELECT_LABELIST_ALL_DISPLAY
})
