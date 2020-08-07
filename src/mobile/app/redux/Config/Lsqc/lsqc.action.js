import * as ActionTypes from './ActionTypes.js'
import { fromJS,toJS } from 'immutable'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

export const showQcye = (value) => dispatch => {
	if (value) {
		// dispatch(getBeginningList())
	}
	dispatch({type: ActionTypes.SHOW_LSQC, value})
}
export const initBolck = () => ({
	type: ActionTypes.LSQC_INIT_BLOCK
})
export const changeFlagsCommonValue = (changeType,value) => dispatch =>{
	dispatch({type: ActionTypes.LSQC_COMMON_CHANGE, changeType, value})
}
export const clearMemberList = () => ({
	type: ActionTypes.LSQC_CLEAR_MEMBER_LIST
})

	// add
// 获取期初列表
export const getBeginningList = (isPerid = false,isChangeBtn=false) => (dispatch,getState) => {
	const homeState = getState().homeState
	const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
	const isSimplify = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? false : true) : false

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getBeginAllList', 'POST', JSON.stringify({
		isSimplify
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_BEGINNING_LIST,
				receivedData: json.data,
				isPerid,
				isChangeBtn
			})
		}
	})
}
export const modifyPeriod = (issuedate) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('modifyBeginPeriod', 'POST', JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : ''
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.MODIFY_PERIOD_ACCOUNT,
				issuedate
			})
		}
	})
}
// 获取往来单位/存货类别
export const getDetailsListInfo = (cardType,sobId,item) => (dispatch, getState) => {
	const lsqcState = getState().lsqcState
	const property = item.get('property') == '1' || item.get('property') == '2' || item.get('property') == '3' ? '' : item.get('property')
	const inventoryNature = item.get('inventoryNature')
	const cantChooseList = lsqcState.get('cantChooseList')
	const changeQcList = lsqcState.get('changeQcList')
	const addItemProperty = lsqcState.getIn(['flags','property'])
	const addItemInventoryNature = lsqcState.getIn(['flags','inventoryNature'])
	const isCheckOut = lsqcState.getIn(['flags','isCheckOut'])
	const isDefinite = lsqcState.getIn(['flags','isDefinite'])
	const cardTypeList =  cardType == 'Contacts' ?
										lsqcState.getIn(['QcList',cardType,'List','childList']).filter(v=>v.get('property') === item.get('property')).getIn([0,'childList']) :
										lsqcState.getIn(['QcList',cardType,'List','childList'])
	let cantLists = [],//已在新增列表
		deleteLists = []//已在删除列表
	let newCantChooseList = cantChooseList
	changeQcList.map(item => {
		if(item.get('operateType') === '1' && (item.get('property') == addItemProperty || item.get('property') == 'stock' && item.get('inventoryNature') == addItemInventoryNature)){
			cantLists.push(item.get('uuid'))
		}
		if(item.get('operateType') === '2' && cantChooseList.indexOf(item.get('relationUuid')) > -1 ){
			deleteLists.push(item.get('relationUuid'))
		}
	})
	cantLists = fromJS(cantLists)
	deleteLists = fromJS(deleteLists)

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(`getBegin${cardType}List`, 'POST', JSON.stringify({
			sobId:sessionStorage.getItem('psiSobId'),
			property:property,
			inventoryNature,
			projectProperty: item.get('property') === 'CARD_PROPERTY_BASIC' ? 'XZ_PRODUCE' : 'XZ_CONSTRUCTION',
			used: true,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_BEGINNING_CATEGORY,
				receivedData: json.data,
				cardType,
				item
			})
			const resultList = fromJS(json.data.resultList)
			const cardList = !isCheckOut ? resultList.map(v => {return {key: `${v.get('code') === 'UDFNCRD' || v.get('code') === 'IDFNCRD' ? '' : v.get('code')} ${v.get('name')}`, value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('code')}`}}) :
										resultList.filter(v => v.get('code') !== 'UDFNCRD' && v.get('code') !== 'IDFNCRD')
													.map(v => {return {key: `${v.get('code') === 'UDFNCRD' || v.get('code') === 'IDFNCRD'? '' : v.get('code')} ${v.get('name')}`, value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('code')}`}})
			// if(cardList.size > 0){
			// 	thirdParty.chosen({
			// 		source : cardList.toJS(),
			// 		onSuccess(result) {
			// 			if(result){
			// 				const valueList = result.value.split(Limit.TREE_JOIN_STR)
			// 				let hasFlag = false
			// 				cardTypeList.map(v => {
			// 					if(v.get('uuid') === valueList[0] || v.get('relationUuid') === valueList[0])
			// 					hasFlag = true
			// 				})
			//
			// 				if(hasFlag){
			// 					return thirdParty.Alert('该对象已添加')
			// 				}else{
			// 					dispatch(addRunningBeginItem(valueList[0],valueList[1],valueList[2],cardType,isDefinite))
			// 				}
			// 			}
			// 		}
			// 	})
			// }else{
			// 	thirdParty.toast.info('无可选对象')
			// }
			if(cardList.size === 0){
				thirdParty.toast.info('无可选对象')
			}else{
				dispatch(showContactsModal(true,item.get('isDefinite'),item))
			}

		}
	})
}
// 获取所选类别下某一项  往来单位/存货
export const getContactsMember = (cardType,Uuid,sobId,property,level,inventoryNature) => dispatch => {
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
	}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_CONTACTS_MEMBERS_LIST,
				receivedData: json.data,
				cardType,
				Uuid,
				level
			})
		}
	})

}
// 保存修改的期初余额
export const saveBeginningBalance = (curModifyBtn,history,list) => (dispatch,getState) => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	const lsqcState = getState().lsqcState
	const modifyList = list ? list : lsqcState.get('changeQcList')
	fetchApi(`ModifyBegin${curModifyBtn}`, 'POST', JSON.stringify({
			operateList: modifyList,
			isClear: list ? true : false,
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			if(json.code !== 0) {
				thirdParty.toast.info(json.code + ' ' + json.message)
			}else{
				if (json.message) {
					if(json.data.errorList.length > 1) {
						const error = json.data.errorList.join(',')
						thirdParty.toast.info(error)
					}else if(json.data.errorList.length == 1){
						thirdParty.toast.info(json.data.errorList[0])
					}else{
						thirdParty.toast.info(json.message)
						history.goBack()
						// dispatch(getBeginningList(false,false))
					}

				}

				// dispatch(restoreModification(curModifyBtn))
			}
		}

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
export const QCEditTriangleSwitch = (showChild, uuid) => ({
	type: ActionTypes.BEGINNING_TRIANGLE_SWITCH_EDIT,
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
export const contactsItemCheckboxCheck = (uuid,name,code) => ({
	type: ActionTypes.CONTACTS_ITEM_CHECKBOX_SELECT,
	uuid,
	name,
	code
})
export const contactsItemCheckboxCheckAll = (selectAll, listName,addItemProperty) => ({
	type: ActionTypes.CONTACTS_ITEM_CHECKBOX_CHECK_ALL,
	selectAll,
	listName,
	addItemProperty
})
export const restoreModification = (curModifyBtn) => ({
	type: ActionTypes.LSQC_RESTORE_MODIFICATION,
	curModifyBtn
})
export const changeCategory = (value) => ({
	type: ActionTypes.LSQC_CHANGE_CATEGORY,
	value
})
export const searchCardList = (cardType,searchValue) => ({
	type: ActionTypes.LSQC_SEARCH_CARD_LIST,
	searchValue,
	cardType
})
export const addRunningBeginItem = (uuid,name,code,addItemType,isDefinite) => dispatch => {
	dispatch({
		type: ActionTypes.LSQC_ADD_RUNNING_BEGIN,
		uuid,
		name,
		code,
		addItemType
	})
		dispatch(showContactsModal(false,isDefinite))
}
export const firstChildToggle = (listName) => dispatch => {
	dispatch({
		type: ActionTypes.FIRST_CHILD_TOGGLE,
		listName
	})
}
export const InitAllShow = () => ({
	type: ActionTypes.INIT_MODULE_ALL_SHOW
})

// 清空期初值
export const changeAllQcListInMoudle = (listName,history) => (dispatch,getState) => {
	let list = []
	const lsqcState = getState().lsqcState
	const projectAddBtnArr = ['PROJECT_PRODUCT_BASIC_CATEGORY_UUID','PROJECT_CONSTRUCTION_COST_CATEGORY_UUID','PROJECT_CONSTRUCTION_PROFIT_CATEGORY_UUID','PROJECT_SETTLEMENT_CATEGORY_UUID']
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
	dispatch(saveBeginningBalance(listName,history,list))

}
