import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'

import { toJS } from 'immutable'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import * as thirdParty from 'app/thirdParty'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as assetsMxbActions from 'app/redux/Mxb/AssetsMxb/assetsMxb.action.js'

export const getAssetsListFetch = () => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('initclassification', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_ASSESTS_LIST_FETCH,
                receivedData: json.data
            })

            fetchApi('getlabelList', 'GET', '', json => {
                showMessage(json) && dispatch({
                    type: ActionTypes.GET_ASSESTS_TREE_FETCH,
                    receivedData: json.data
                })
            })

            fetchApi('getSortList', 'GET', '', json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_SORT_LIST_FETCH,
                        receivedData: json.data
                    })
                }
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeCardRemark = (remark) => ({
    type: ActionTypes.CHANGE_CARD_REMARK,
    remark
})

export const changeCardLables = (lables) => ({
    type: ActionTypes.CHANGE_CARD_LABLES,
    lables
})

export const addNewCardLable = (newLable) => ({
    type: ActionTypes.ADD_NEW_CARD_LABLE,
    newLable
})

export const assetsSortByStatusOrValue = (sortByValue, sortByStatus) => (dispatch, getState) => {

    const assetsCardGetBy = getState().assetsState.getIn(['flags', 'assetsCardGetBy'])
    const currentSelectedTitle = getState().assetsState.get('currentSelectedTitle')
    const currentSelectedKeys = getState().assetsState.get('currentSelectedKeys')

    if (assetsCardGetBy == 'number') {
        dispatch(getCardListFetch(currentSelectedKeys.get(0), sortByValue, sortByStatus))
    } else {
        dispatch(getCardListByLabelFetch(currentSelectedKeys.get(0), sortByValue, sortByStatus))
    }
}

//通过分类获取卡片列表
export const getCardListFetch = (number, sortByValue, sortByStatus) => (dispatch, getState) => {

    if (sortByValue === undefined) {
        sortByValue = getState().assetsState.getIn(['flags', 'sortByValue'])
        sortByStatus = getState().assetsState.getIn(['flags', 'sortByStatus'])
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getcardlist', 'POST', JSON.stringify({
        serialNumber: number,
        sortByValue,
        sortByStatus
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_CARD_LIST_FETCH,
                receivedData: json.data,
                number,
                sortByValue,
                sortByStatus,
                assetsCardGetBy: 'number'
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

//通过标签获取卡片列表
export const getCardListByLabelFetch = (number, sortByValue, sortByStatus) => (dispatch, getState) => {

    if (sortByValue === undefined) {
        sortByValue = getState().assetsState.getIn(['flags', 'sortByValue'])
        sortByStatus = getState().assetsState.getIn(['flags', 'sortByStatus'])
    }

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getcardlistbylabel', 'POST', JSON.stringify({
        label: number,
        sortByValue,
        sortByStatus
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_CARD_LIST_FETCH,
                receivedData: json.data,
                number,
                sortByValue,
                sortByStatus,
                assetsCardGetBy: 'label'
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeAssetschildshow = (serialNumber) => ({
    type: ActionTypes.CHANGE_ASSETSCHILDSHOW,
    serialNumber
})

export const changeClassificationModalDisplay = () => ({
    type: ActionTypes.CHANGE_CLASSIFICATION_MODAL_DISPLAY
})

export const changeClassAssetsModeDisplay = (mode) => ({
    type: ActionTypes.CHANGE_CLASS_ASSETS_MODE_DISPLAY,
    mode
})

export const selectAssetsClass = (idx) => ({
    type: ActionTypes.SELECT_ASSETS_CLASS,
    idx
})

export const selectAssetsClassAll = () => ({
    type: ActionTypes.SELECT_ASSETS_CLASS_ALL
})

export const getCardDetailFetch = (classNunber) => dispatch => {

    fetchApi('getassetscard', 'POST', JSON.stringify({cardNumber: classNunber}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_CARD_DETAIL_FETCH,
                receivedData: json.data
            })
        }
    })
}

// 编辑类别
export const changeAssetsclassNumber = (id, upperAssetsNumber) =>({
    type: ActionTypes.CHANGE_ASSETS_CLASS_NUMBER,
    id,
    upperAssetsNumber
})

export const changeAssetsclassName = (name) => ({
    type: ActionTypes.CHANGE_ASSETS_CLASS_NAME,
    name
})

export const changeAssetsClassTotalMonth = (month) => ({
    type: ActionTypes.CHANGE_ASSETS_CLASS_TOTALMONTH,
    month
})

export const changeAssetsClassSalvage = (value) => ({
    type: ActionTypes.CHANGE_ASSETS_CLASSS_ALVAGE,
    value
})

export const changeAssetsClassRemark = (value) => ({
    type: ActionTypes.CHANGE_ASSETS_CLASS_REMARK,
    value
})

// 选泽科目
export const selectAssetsAc = (acid, acname, asscategorylist, classOrCard, dirction) => ({
    type: ActionTypes.SELECT_ASSETS_AC,
    acid,
    acname,
    asscategorylist,
    classOrCard,
    dirction
})

export const selectAssetsAss = (assid, assname, idx, classOrCard, dirction) => ({
    type: ActionTypes.SELECT_ASSETS_ASS,
    assid,
    assname,
    idx,
    classOrCard,
    dirction
})

export const clearClassification = () => ({
    type: ActionTypes.CLEAR_CLASSIFICATION
})

// 上级编码、名字
export const beforeInsertClassification = (serialNumber, serialName, newSerialNumber) => dispatch => {
    fetchApi('getclassification', 'POST', JSON.stringify({serialNumber: serialNumber}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.BEFORE_INSERT_CLASSIFICATION,
                newSerialNumber,
                serialNumber,
                serialName,
                receivedData: json.data
            })
        }
    })
}

export const beforeModefyClassification = (serialNumber, serialName) => dispatch => {
    fetchApi('getclassification', 'POST', JSON.stringify({serialNumber: serialNumber}), json => {
       if (showMessage(json)) {
           dispatch({
                type: ActionTypes.BEFORE_MODYFY_CLASSIFICATION,
                receivedData: json.data
           })
       }
    })
}

// 保存并新增时传参，普通新增不用传入
export const enterAssetsClassFetch = (upperAssetsNumber, upperAssetsName, newSerialNumber) => (dispatch, getState) => {
    const classification = getState().assetsState.get('classification')
    const assetsConfigMode = getState().assetsState.getIn(['flags', 'assetsClassMode'])


    if (classification.get('serialName').length === 0)
        return thirdParty.Alert('辅助类别名称未输入')

    ;({
		//修改
		modify() {
            fetchApi('modifyclassification', 'POST', JSON.stringify(classification), json => {
                if (showMessage(json, 'show')) {
                    dispatch(getAssetsListFetch())
                    dispatch(changeClassificationModalDisplay())
                }
            })
		},
		//新增
		insert() {
            if (classification.get('serialNumber').length === 1)
                return thirdParty.Alert('不允许新增顶级科目')
                // return alert('顶级科目不允许新增')
            if (classification.get('serialNumber').length !== 3 || classification.get('serialNumber').substr(0,1) >= 6)
                return thirdParty.Alert('辅助编码长度为3，且要为1/2/3/4/5开头')
                // return alert('辅助编码长度为3，且要为1/2/3/4/5开头')

            fetchApi('insertclassification', 'POST', JSON.stringify(classification), json => {
                if (showMessage(json, 'show')) {
                    dispatch(getAssetsListFetch())

                    // 有upperAssetsNumber说明是保存并新增操作
                    if (upperAssetsNumber) {
                        dispatch(clearClassification())
                        dispatch(beforeInsertClassification(upperAssetsNumber, upperAssetsName, newSerialNumber))
                    } else {
                        dispatch(changeClassificationModalDisplay())
                    }
                }
            })
		}
	}[assetsConfigMode])() //编辑模式的类别
}


// cardValue
// export const changeCardCardNumer = (cardNumber) => ({
//     type: ActionTypes.CHANGE_CARD_CARDNUMER,
//     cardNumber
// })

export const getCardNumberFetch = () => (dispatch, getState) => {

    const period = getState().allState.get('period')
    const openedyear = period.get('openedyear')
    const openedmonth = period.get('openedmonth')
    const closedyear = period.get('closedyear')
    const closedmonth = period.get('closedmonth')

    const inputPeriod = ((openedyear, openedmonth, closedyear, closedmonth) => {
        if (openedyear) {
            return `${openedyear}年第${openedmonth}期`
        } else {
            if (closedmonth == '12') {
                return `${Number(closedyear)+1}年第01期`
            } else {
                return `${closedyear}年第${(Number(closedmonth)+1) > 10 ? (Number(closedmonth)+1) : '0' + (Number(closedmonth)+1)}期`
            }
        }
    })(openedyear, openedmonth, closedyear, closedmonth)

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getmaxcardnumber', 'GET', '', json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_CARDNUMBER_FETCH,
                receivedData: json.data,
                inputPeriod
            })
        } else if (json.code === 16308) {
            dispatch({
                type: ActionTypes.GET_CARDNUMBER_FETCH,
                receivedData: '',
                inputPeriod
            })
        }
    })
}

export const changeCardCardName = (value) => ({
    type: ActionTypes.CHANGE_CARD_CARDNAME,
    value
})
export const changeCardCardNumber = (value) => dispatch => {
    if (/^\d{0,4}$/g.test(value) || value === '') {
        dispatch({
            type: ActionTypes.CHANGE_CARD_CARDNUMBER,
            value
        })
    } else {
       message.info('卡片编码仅支持4位数字', 2) 
    }
}

export const selectCardAssetsOrClass = (value, choseType, assetsCardMode) => dispatch => {

    const serialNumber = choseType == 'assets' ? value.substr(0,1) : value.substr(0,3)

    fetchApi('getclassification', 'POST', JSON.stringify({serialNumber}), json => {

        const creditAssList = json.data.creditAssList
        const creditId = json.data.creditId
        const creditName = json.data.creditName

        const debitAssList = json.data.debitAssList
        const debitId = json.data.debitId
        const debitName = json.data.debitName

        const totalMonth = json.data.totalMonth
        const salvage = json.data.salvage

        dispatch({
            type: ActionTypes.SELECT_CARD_ASSETS_OR_CLASS,
            choseType,
            value,
            creditAssList,
            creditId,
            creditName,
            debitAssList,
            debitId,
            debitName,
            totalMonth,
            salvage,
            assetsCardMode
        })
    })
}

export const changeCardStartTime = (value, inputPeriod) => ({
    type: ActionTypes.CHANGE_CARD_STARTTIME,
    value,
    inputPeriod
})

export const changeCardTotalMonth = (value) => ({
    type: ActionTypes.CHANGE_CARD_TOTALMONTH,
    value
})

export const changeCardCardValue = (value) => ({
    type: ActionTypes.CHANGE_CARD_CARDVALUE,
    value
})

export const changeCardSalvage = (value) => ({
    type: ActionTypes.CHANGE_CARD_SALVAGE,
    value
})

export const enterCard = (residualValue, monthlyDepreciation, alreadyDepreciationTime, sumDepreciation, earlyNetWorth, currentSelectedKeys, saveAndnew) => (dispatch, getState) => {

    dispatch({
        type: ActionTypes.BEFORE_ENTER_CARD,
        residualValue,
        monthlyDepreciation,
        alreadyDepreciationTime,
        sumDepreciation,
        earlyNetWorth
    })

    const card = getState().assetsState.get('cardTemplate')
    const assetslist = getState().assetsState.get('assetslist')
    const sortByValue = getState().assetsState.getIn(['flags', 'sortByValue'])
    const sortByStatus = getState().assetsState.getIn(['flags', 'sortByStatus'])
    const assetsNumber = card.get('assetsNumber')
    const assetsCfList = assetslist.filter(v => v.get('serialNumber').indexOf(assetsNumber) === 0 && v.get('serialNumber').length === 3)
    const cardNumber = card.get('cardNumber')
    const classificationNumber = card.get('classificationNumber')

    // 新增卡片fetch前的前台数据校验
    if (card.get('assetsName') === '') {
        return thirdParty.Alert('资产分类未选择')
    } else {
        if (assetsCfList.size !== 0 && card.get('classificationName') === '') {
            return thirdParty.Alert('辅助分类未选择')
        }
    }
    if (card.get('cardNumber').length === 0)
        return thirdParty.Alert('卡片编码未输入')
    if (card.get('cardName').length === 0)
        return thirdParty.Alert('卡片名称未输入')
    if (card.get('cardValue') === '')
        return thirdParty.Alert('原值未输入')
    if (card.get('cardValue') === 0)
        return thirdParty.Alert('原值不能为0')
    if (card.get('remark').length > 45)
        return thirdParty.Alert('备注字数不能大于45个')
    if (card.get('salvage') === '')
        return thirdParty.Alert('残值率未输入')
    if (card.get('startTime') === '')
        return thirdParty.Alert('开始使用期间未输入')
    if (card.get('totalMonth') === '') {
        return thirdParty.Alert('默认使用总期限未输入')
    } else if (card.get('totalMonth') == 0) {
        return thirdParty.Alert('默认使用总期限不能为0')
    }
    if (card.get('debitName') === '')
        return thirdParty.Alert('财务处理借方科目未选择')
    if (card.get('creditName') === '')
        return thirdParty.Alert('财务处理贷方科目未选择')
    if (card.get('debitAssList').some(v => v.get('assCategory') && !v.get('assName'))) {
        return thirdParty.Alert('财务处理借方科目的辅助核算未选择')
    }
    if (card.get('creditAssList').some(v => v.get('assCategory') && !v.get('assName'))) {
        return thirdParty.Alert('财务处理借方科目的辅助核算未选择')
    }

    const assetsCardMode = getState().assetsState.getIn(['flags', 'assetsCardMode'])

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    ;({
		//修改
		modify() {
            fetchApi('modifyassetscard', 'POST', JSON.stringify(card), json => {
                if(showMessage(json, 'show')){
                    dispatch(aferSaveCardSuccess(saveAndnew, currentSelectedKeys, sortByValue, sortByStatus))
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
		},
		//新增
		insert() {
            fetchApi('insertassetscard', 'POST', JSON.stringify(card), json => {
                if (showMessage(json, 'show')) {
                    // 保存
                    dispatch(aferSaveCardSuccess(saveAndnew, currentSelectedKeys, sortByValue, sortByStatus))
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            })
		}
	}[assetsCardMode])() //编辑模式
}

const aferSaveCardSuccess = (saveAndnew, currentSelectedKeys, sortByValue, sortByStatus) => dispatch => {
    if (saveAndnew) {
        dispatch(getCardNumberFetch())
    } else {
        if (sessionStorage.getItem("assetsCardfrom") === 'Assets') {

            dispatch(getAssetsListFetch())

            // dispatch(getCardListFetch('1'))
            dispatch(afterModifyAssetsCard(currentSelectedKeys, sortByValue, sortByStatus))
            dispatch(showAssetsCard(false))
            
        } else if (sessionStorage.getItem("assetsCardfrom") === 'AssetsMxb') {
            // dispatch(showAssetsCard(false))
            dispatch(showAssetsCardOption(false))
        }
    }
}

export const copyCardFetch = (copyNum, currentSelectedKeys) => (dispatch, getState) => {
    const cardTemplate = getState().assetsState.get('cardTemplate')
    fetchApi('copyassetscard', 'POST', JSON.stringify({
        cardNumber: cardTemplate.get('cardNumber'),
        copyNum: copyNum
    }), json => {
        if (showMessage(json, 'show')) {
            dispatch(getCardListFetch(currentSelectedKeys))
        }
    })
}

export const copyCardMxbFetch = (copyNum, currentSelectedKeys, issuedate, endissuedate, currentMxbSelectedKeys) => (dispatch, getState) => {
    const cardTemplate = getState().assetsState.get('cardTemplate')
    fetchApi('copyassetscard', 'POST', JSON.stringify({
        cardNumber: cardTemplate.get('cardNumber'),
        copyNum: copyNum
    }), json => {
        if (showMessage(json, 'show')) {
            dispatch(assetsMxbActions.getMxListFetch(issuedate, endissuedate, currentMxbSelectedKeys))
        }
    })
}

export const clearCardFetch = (status, cardNumber, openedyear, openedmonth) => dispatch => {
    fetchApi('clearcard', 'POST', JSON.stringify({'cardNumber': cardNumber}), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_CARD_STATUS,
                status,
                openedyear,
                openedmonth
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

//改变选择的大类别的值
export const changeTabSelectedIndex = (value) => ({
    type: ActionTypes.CHANGE_TAB_SELECTED_INDEX,
    value
})
//点击卡片列表的复选框
export const selectOneCardButton = (itemID) => ({
    type: ActionTypes.SELECT_ONE_CARD_BUTTON,
    itemid:itemID
})
//点击卡片列表的全选复选框

export const selectAllCardButton = () => ({
    type: ActionTypes.SELECT_ALL_CARD_BUTTON
})
//显示delete组件
export const showDeleteModal = () => ({
    type: ActionTypes.SHOW_DELETE_MODAL
})
//关闭delete组件
export const closeDeleteModal = () => ({
    type: ActionTypes.CLOSE_DELETE_MODAL
})

//删除卡片
export const deleteCard = (avtiveItemId, currentSelectedKeys) => dispatch => {
    fetchApi('deletecard', 'POST', JSON.stringify({'cardNumList': avtiveItemId}), json => {

        if (showMessage(json)) {

            showError(json)

            dispatch({
                type: ActionTypes.DELETE_CARD
            })
            // dispatch(homeActions.removeTabpane('AssetsCardOption', 'AssetsCard'))
            dispatch(getCardListFetch(currentSelectedKeys))
            dispatch(getAssetsListFetch())
        }
    })
}

const showError = (json) => {
	const canNotDeletemassage = json.data.message
	if (canNotDeletemassage !== '') {
		message.warn(canNotDeletemassage)
	} else {
        message.info('操作成功')
	}
}

// 资产类别
//点击资产类别列表的复选框
export const selectOneSortButton = (itemID) => ({
    type: ActionTypes.SELECT_ONE_SORT_BUTTON,
    itemid:itemID
})
//点击资产类别列表的全选复选框
export const selectAllSortButton = () => ({
    type: ActionTypes.SELECT_ALL_SORT_BUTTON
})
//显示deleteSort组件
export const showDeleteSortModal = () => ({
    type: ActionTypes.SHOW_DELETE_SORT_MODAL
})
//关闭deleteSort组件
export const closeDeleteSortModal = () => ({
    type: ActionTypes.CLOSE_DELETE_SORT_MODAL
})
//删除资产类别
export const deleteSort = (avtiveSortItemId) => dispatch => {
    fetchApi('deletesort', 'POST', JSON.stringify({'cfNumList': avtiveSortItemId}), json => {
        // if (showMessage(json, 'show')) {
        if (!json.code) {
            dispatch({
                type: ActionTypes.DELETE_SORT
            })
            if (json.data && json.data.length) {
                message.warn(json.data.join(';'))
            } else {
                message.info('操作成功')
            }
            dispatch(getAssetsListFetch())
        } else {
            showMessage(json)
        }
    })
}

export const getFileUploadFetch = (form, url,openModal) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi(url, 'UPLOAD', form, json => {
        if(showMessage(json)){
            dispatch(afterAssetsImport(json))
            openModal()
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            const loop = function (accessToken) {
				const time = setTimeout(() => {
					let showMessageMask = getState().assetsState.getIn(['flags','assetsshowMessageMask'])
                    const tabSelectedIndex = getState().assetsState.get('tabSelectedIndex')
                	fetchApi('acImportProgress', 'GET', `accessToken=${accessToken}`, json => {
                		if(showMessage(json)){
                			dispatch({
                				type:ActionTypes.GET_ASSETS_IMPORT_PROGRESS,
                				receivedData:json
                			})

                			if ((json.data.progress >= 100) && (json.data.successList.length > 0)) {
                                if (tabSelectedIndex == "资产卡片") {
                                    dispatch(getCardListFetch('1'))
                                } else if (tabSelectedIndex == "资产类别") {
                                    dispatch(getAssetsListFetch())
                                }
                			}

                            if(showMessageMask && json.data.progress < 100){
								loop(accessToken)
							}
                		}
                	})
					clearTimeout(time)
				},500)
			}
			loop(json.data.accessToken)
        }else{
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
	})
}

export const beforeAssetsImport = () => ({
	type: ActionTypes.BEFORE_ASSETS_IMPORT
})

export const afterAssetsImport = (receivedData) => (dispatch, getState) => {
	dispatch({
		type: ActionTypes.AFTER_ASSETS_IMPORT,
		receivedData
	})
}

export const closeAssetsImportContent = () => ({
	type: ActionTypes.CLOSE_ASSETS_IMPORT_CONTENT
})

export const showAssDisableModal = (asscategory) => ({
    type: ActionTypes.SHOW_ASS_DISABLE_MODAL,
    asscategory
})

export const cancelAssDisableModal = () => ({
    type: ActionTypes.CANCEL_ASS_DISABLE_MODAL
})
export const showAssetsCard = (bool) => ({
	type: ActionTypes.SHOW_ASSETS_CARD,
    bool
})
export const showAssetsCardOption = (bool) => ({
	type: ActionTypes.SHOW_ASSETS_CARD_OPTION,
    bool
})

export const afterModifyAssetsCard = (number, sortByValue, sortByStatus) => (dispatch, getState) => {

    const assetsCardGetBy = getState().assetsState.getIn(['flags', 'assetsCardGetBy'])
    if (assetsCardGetBy === 'number') {
        dispatch(getCardListFetch(number, sortByValue, sortByStatus))
    } else {
        dispatch(getCardListByLabelFetch(number, sortByValue, sortByStatus))
    }
}

export const importProgress = () => (dispatch,getState) => {
	console.log(getState().assetsState.get('importProgressInfo').toJS());
	const accessToken = getState().assetsState.getIn(['importProgressInfo','accessToken'])

}

export const changeMessageMask = () => ({
	type: ActionTypes.CHANGE_ASSETS_MESSAGEMASK,
})
