import { fromJS, toJS } from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

const sobRoleState = fromJS({
	views: {
		sobId: '',
		sobType: '',
		sobName: '',

		insertOrModify: 'insert',

		haveChanged: false,
	},
	roleTemp: {}, 
	roleList: [],
	roleModuleTemp: { 
		moduleList: {}
	},


	categoryRange: [],
	allCardListL: [],
	modalCategoryList: [],
	modalCardList: [],
	selectCardList: [],

	processModelList: [],
})

export default function handleSobLog(state = sobRoleState, action) {
	return ({
		[ActionTypes.INIT_SOB_ROLE]									 : () => sobRoleState,
		// 从账套编辑跳转
		[ActionTypes.GET_SOB_ROLE_LIST_FROM_SOB_OPTION]				 : () => {

			state = state.setIn(['views', 'sobId'], action.sobId)
						.setIn(['views', 'sobType'], action.sobType)
						.updateIn(['views', 'sobName'], v => action.sobName ? action.sobName : v)
						.setIn(['views', 'haveChanged'], false)
						.set('roleTemp', fromJS(action.receivedData.roleList[0]))
						.set('roleList', fromJS(action.receivedData.roleList))
						.set('roleModuleTemp', fromJS(action.roleData))
			return state
		},
		// 切换身份
		[ActionTypes.SWITCH_SOB_ROLE_CURRENT_ROLE]				      : () => {

			state = state.set('roleTemp', action.role).set('roleModuleTemp', fromJS(action.receivedData)).setIn(['views', 'haveChanged'], false)
			return state
		},
		// 修改 roleModuleTemp moduleList 的值
		[ActionTypes.SET_SOB_ROLE_MODULE_LIST_VALUE]				  : () => {
			state = state.setIn(['roleModuleTemp', 'moduleList', ...action.place], action.value).setIn(['views', 'haveChanged'], true)
			return state
		},
		// 新增或修改角色
		[ActionTypes.BEFORE_EDIT_SOB_ROLE]				              : () => {

			state = state.setIn(['views', 'insertOrModify'], action.status)
			return state
		},
		// 新增或修改角色成功后
		[ActionTypes.AFTER_EDIT_SOB_ROLE]				              : () => {

			if (action.editType === 'modify') {
				state = state.setIn(['roleList', action.index], fromJS(action.roleTemp))
							.set('roleTemp', fromJS(action.roleTemp))
							.setIn(['views', 'haveChanged'], false)
				
			} else {
				state = state.set('roleList', fromJS(action.roleList))
							.set('roleModuleTemp', fromJS(action.receivedData))
							.set('roleTemp', fromJS(action.roleTemp))
							.setIn(['views', 'haveChanged'], false)
			}
			return state
		},
		[ActionTypes.AFTER_MODIFY_SOB_ROLE]				              : () => {

			const roleList = state.get('roleList')

			const index = roleList.findIndex(v => v.get('roleName') === action.receivedData.roleName)
			if (index > -1) {
				state = state.setIn(['roleList', index, 'roleId'], action.receivedData.roleId)
			}

			state = state.set('roleModuleTemp', fromJS(action.receivedData))
						.setIn(['roleTemp', 'roleId'], action.receivedData.roleId)
						.setIn(['roleTemp', 'roleName'], action.receivedData.roleName)
						.setIn(['views', 'haveChanged'], false)
			return state
		},
		[ActionTypes.CHANGE_SOB_ROLE_COMMON_STRING]                   : () => {
			state = state.set(action.place, action.value)
			return state
		}

	}[action.type] || (() => state))()
}
