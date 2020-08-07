import { fromJS } from 'immutable'
import * as ActionTypes from '../ActionTypes.js'

//生产环境应当设置为空
const approvalTemplateState = fromJS({
	views: {
		insertOrModify: 'insert'
	},
	approvalTemp: {
		"baseSetting": {
			"modelCode": "",
			"modelName": "",
			"jrCategoryType": "",
			"jrCategoryId": "",
			"jrCategoryName": "",
			"remark": "",
			"detailScope": [],
			"use": "BX",
			"selectPerson": false,
			"nature": "XSFY",
			"natureScope": [],
			"contact": "NO",
			"contactScope": [],
			"project": "NO",
			"projectScope": []
		},
		"financeSetting": null,
		"gmtCreate": '',
		"gmtModify": '',
		"formSetting": {
			"componentList": []
		},
		detailList: [],
		modelComponentList: []
	},
	categoryData: {

	},
	projectCardList: [],
	contactCardList: [],
	stockCardList: [],
	warehouseCardList: [],

	modalCategoryList: [],
	modalCardList: [],
	selectCardList: [],
})

export default function handleApprovalTemplate(state = approvalTemplateState, action) {
	return ({
		[ActionTypes.INIT_APPROVALTEMPLATE]: () => approvalTemplateState,
		[ActionTypes.CANCEL_MODIFY_APPROVAL_TEMPLATE]: () => {
			return state = state.set('approvalTemp', approvalTemplateState.get('approvalTemp'))
		},
		[ActionTypes.CHANGE_APPROVAL_BASE_SETTING_COMMON_STRING]: () => {
			return state = state.setIn(['approvalTemp', 'baseSetting', action.place], action.value)
		},
		[ActionTypes.CHANGE_APPROVAL_BASE_SETTING_JR_CATEGORY]: () => {
			state = state.setIn(['approvalTemp', 'baseSetting'], fromJS(action.baseSetting))
				.set('categoryData', fromJS(action.receivedData))
			return state
		},
		[ActionTypes.BEFOR_INSERT_OR_MODIFY_APPROVAL_TEMPLATE]: () => {
			state = state.set('approvalTemp', action.templateData ? fromJS(action.templateData) : approvalTemplateState.get('approvalTemp'))
				.set('categoryData', action.receivedData ? fromJS(action.receivedData) : approvalTemplateState.get('categoryData'))
				.setIn(['views', 'insertOrModify'], fromJS(action.insertOrModify))
			return state
		},
		[ActionTypes.ADD_APPROVAL_FORM_COMPONENT]: () => {
			state = state.updateIn(['approvalTemp', 'formSetting', 'componentList'], v => v.set(v.size, fromJS(action.component).set('orderValue', v.size)))
			return state
		},
		[ActionTypes.DELETE_APPROVAL_FORM_COMPONENT]: () => {
			state = state.updateIn(['approvalTemp', 'formSetting', 'componentList'], v => v.delete(action.index).map((v, i) => v.set('orderValue', i)))
			return state
		},
		[ActionTypes.CHANGE_APPROVAL_FORM_OPTION_STRING]: () => {
			state = state.setIn(action.arr, action.value)
			return state
		},
		[ActionTypes.ADJUST_POSITION_APPROVAL_FORM_COMPONENT]: () => {

			let fromItem = state.getIn(['approvalTemp', 'formSetting', 'componentList', action.fromPost])
			state = state.updateIn(['approvalTemp', 'formSetting', 'componentList'], v => v.delete(action.fromPost).insert(action.toPost, fromItem).map((v, i) => v.set('orderValue', i)))
			return state
		},
		[ActionTypes.AFTER_GET_APPROVAL_PROJECT_CARD_LIST]: () => {
			state = state.set('projectCardList', fromJS(action.receivedData))
			return state
		},
		[ActionTypes.AFTER_GET_APPROVAL_CONTACT_CARD_LIST]: () => {
			state = state.set('contactCardList', fromJS(action.receivedData))
			return state
		},
		[ActionTypes.AFTER_GET_APPROVAL_STOCK_CARD_LIST]: () => {
			state = state.set('stockCardList', fromJS(action.receivedData))
			return state
		},
		[ActionTypes.AFTER_GET_APPROVAL_WAREHOUSE_CARD_TREE]: () => {
			state = state.set('warehouseCardList', fromJS(action.receivedData))
			return state
		},
		[ActionTypes.CHANGE_APPROVAL_TEMP_COMMON_STRING]: () => {
			state = state.set(action.place, action.value)
			return state
		}

	}[action.type] || (() => state))()
}