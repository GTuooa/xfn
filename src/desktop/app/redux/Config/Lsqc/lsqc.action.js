import * as ActionTypes from './ActionTypes.js'
import { fromJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import * as thirdParty from 'app/thirdParty'
import * as allActions from 'app/redux/Home/All/all.action'
import * as Limit from 'app/constants/Limit.js'


export const showQcye = (value) => dispatch => {
	if (value) {
		// dispatch(getBeginningList())
	}
	dispatch({type: ActionTypes.SHOW_LSQC, value})
}

	// add
// 获取期初列表
export const getBeginningList = (isPerid = false,isFromConfig = false) => (dispatch,getState) => {
	const homeState = getState().homeState
	const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
	const isSimplify = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? false : true) : false

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getBeginAllList', 'POST', JSON.stringify({
		isSimplify
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_BEGINNING_LIST,
				receivedData: json.data,
				isPerid,
			})
			if(isFromConfig && json.data.result.balancePeriod.isCheckOut){
				thirdParty.Alert('该账期已结账，反结账后即可修改期初值')
			}
		}
	})
}
export const modifyPeriod = (issuedate) => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('modifyBeginPeriod', 'POST', JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : ''
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.MODIFY_PERIOD_ACCOUNT,
				issuedate
			})
		}
	})
}
// 获取往来单位/存货类别
export const getDetailsListInfo = (cardType,sobId,item,currentPage = 1) => (dispatch, getState) => {
	const property = item.get('property') == '1' || item.get('property') == '2' || item.get('property') == '3' ? '' : item.get('property')
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi(`getBegin${cardType}List`, 'POST', JSON.stringify({
			sobId:sessionStorage.getItem('sobId'),
			property:property,
			inventoryNature: item.get('inventoryNature'),
			projectProperty: item.get('property') === 'CARD_PROPERTY_BASIC' ? 'XZ_PRODUCE' : 'XZ_CONSTRUCTION',
			used: true,
			currentPage,
			pageSize: Limit.MXB_CARD_PAGE_SIZE
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_BEGINNING_CATEGORY,
				receivedData: json.data,
				cardType,
				item
			})
			dispatch(showContactsModal(true,item.get('isDefinite'),item))
		}
	})
}

// 获取所选类别下某一项  往来单位/存货
export const getContactsMember = (cardType,Uuid,sobId,property,level,inventoryNature,searchCardContent,currentPage = 1) => dispatch => {
	let subordinateUuid,categoryUuid,listByCategory
	if(level == '0'){
		categoryUuid = Uuid
		subordinateUuid = ''
		listByCategory = true
	}else if (level == '') {
		listByCategory = true
		categoryUuid = ''
		subordinateUuid = ''
	}else{
		categoryUuid = ''
		subordinateUuid = Uuid
		listByCategory = false
	}
	const curProperty = cardType === 'Contacts' ? property : ''
	fetchApi(`getBegin${cardType}MemberList`, 'POST', JSON.stringify({
		categoryUuid,
		subordinateUuid,
		sobId,
		property:curProperty,
		inventoryNature,
		listByCategory,
		projectProperty: property === 'CARD_PROPERTY_BASIC' ? 'XZ_PRODUCE' : 'XZ_CONSTRUCTION',
		used: true,
		currentPage,
		pageSize: Limit.MXB_CARD_PAGE_SIZE,
	}), json => {
		if (showMessage(json)) {
			const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
			dispatch({
				type: ActionTypes.GET_CONTACTS_MEMBERS_LIST,
				receivedData: json.data,
				cardType,
				Uuid,
				level,
				searchCardContent,
				cardPageObj
			})
		}
	})

}
// 保存修改的期初余额
export const saveBeginningBalance = (curModifyBtn,list) => (dispatch,getState) => {
	const lsqcState = getState().lsqcState
	const modifyList = list ? fromJS(list) : lsqcState.get('changeQcList')
	if (modifyList.some(v => v.get('amount') === '-')) {
		return message.info('请输入有效的数值')
	}
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi(`ModifyBegin${curModifyBtn}`, 'POST', JSON.stringify({
			operateList: modifyList,
			isClear: list ? true : false,
	}), json => {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (showMessage(json)) {
			if(json.code !== 0) {
				message.info(json.code + ' ' + json.message)
			}else{
				if (json.message) {
					if(json.data.errorList.length) {
						const error = json.data.errorList.join(',')
						message.error(error)
					}
					else{
						message.success(json.message)
					}
				}
				dispatch(restoreModification(curModifyBtn))
			}
		}
			dispatch(getBeginningList())
	})
}

// 删除往来单位、存货
export const deleteBeginningMembers = (item,listName) => (dispatch, getState) => {
	dispatch({
		type: ActionTypes.DELETE_BEGINNING_LIST_ITEM,
		item,
		listName
	})
}

export const QCTriangleSwitch = (showChild, uuid) => ({
	type: ActionTypes.BEGINNING_TRIANGLE_SWITCH,
	showChild,
	uuid
 })

export const changeQcList = (listItem, item, number, leve,listName,amountName) => ({
	type: ActionTypes.CHANGE_BEGINNING_LIST,
	listItem,
	item,
	number,
	leve,
	listName,
	amountName
 })

export const showContactsModal = (value,isDefinite=true,item='') => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_QCMODAL_SHOW_HIDE,
		value,
		isDefinite,
		item
	})
	dispatch(searchCardList())
}
export const changeModifyBtn = (name,value) => ({
	type: ActionTypes.CHANGE_QCBUTTON_MODIFY_SAVE,
	name,
	value
})
export const contactsItemCheckboxCheck = (checked, uuid,name,code) => ({
	type: ActionTypes.CONTACTS_ITEM_CHECKBOX_SELECT,
	checked,
	uuid,
	name,
	code
})
export const contactsItemCheckboxCheckAll = (selectAll, listName,addItemProperty,showMemberList) => ({
	type: ActionTypes.CONTACTS_ITEM_CHECKBOX_CHECK_ALL,
	selectAll,
	listName,
	addItemProperty,
	showMemberList
})
export const restoreModification = (curModifyBtn) => ({
	type: ActionTypes.LSQC_RESTORE_MODIFICATION,
	curModifyBtn
})
export const searchCardList = (cardType,searchValue) => ({
	type: ActionTypes.LSQC_SEARCH_CARD_LIST,
	searchValue,
	cardType
})
export const addRunningBeginItem = (addItemType,isDefinite,addShowChilidUuid='') => dispatch => {
	dispatch({
		type: ActionTypes.LSQC_ADD_RUNNING_BEGIN,
		addItemType,
		addShowChilidUuid
	})
		dispatch(showContactsModal(false,isDefinite))
}
export const firstChildToggle = (listName) => dispatch => {
	dispatch({
		type: ActionTypes.FIRST_CHILD_TOGGLE,
		listName
	})
}
export const initAllShow = (isShow) => ({
	type: ActionTypes.INIT_MODULE_ALL_SHOW,
	isShow
})
// 清空期初值
export const changeAllQcListInMoudle = (listName) => (dispatch,getState) => {
	let list = []
	const projectAddBtnArr = ['PROJECT_PRODUCT_BASIC_CATEGORY_UUID','PROJECT_CONSTRUCTION_COST_CATEGORY_UUID','PROJECT_CONSTRUCTION_PROFIT_CATEGORY_UUID','PROJECT_SETTLEMENT_CATEGORY_UUID']
	const lsqcState = getState().lsqcState
	const moudleList = lsqcState.getIn(['QcList',listName,'List','childList'])
	const loop = (data,level) => data.map((item,i) => {
		if(item.childList && item.childList.length>0){
			loop(item.childList,level+1)
		}else{
			if(
				(listName === 'Contacts' || listName === 'Stock') && level > 1 ||
				(listName !== 'Contacts' && listName !== 'Stock') && projectAddBtnArr.indexOf(item.relationUuid) === -1
			){
				list.push({
					uuid:item.uuid,
					name: item.name,
					amount: 0,
					operateType: listName === 'Contacts' || listName === 'Stock' || listName === 'Project' ? '2' : '3',
					balanceGroup: item.balanceGroup ?  item.balanceGroup :'',
					property:  item.property,
					inventoryNature:  item.inventoryNature
				})
			}

		}
	})
	loop(moudleList ? moudleList.toJS() : [],1)
	dispatch(saveBeginningBalance(listName,list))

}
