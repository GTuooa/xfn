import { fromJS } from 'immutable'
import * as ActionTypes from '../ActionTypes.js'

//生产环境应当设置为空
const approvalCardState = fromJS({
	views: {
		insertOrModify: 'insert',
	},
	cardData: {
		detailCode: '',
		detailLabel: '',
		placeHolder: '',
		formSetting: {
			componentList: []
		},
		gmtCreate: '',
		gmtModify: '',
		modelList: [],
		modelScope: [],
	}
})

export default function handleApproval(state = approvalCardState, action) {
	return ({
		[ActionTypes.INIT_APPROVAL_CARD]: () => approvalCardState,
		[ActionTypes.CANCEL_MODIFY_APPROVAL_CARD]: () => {
			return state = state.set('cardData', approvalCardState.get('cardData'))
		},
		[ActionTypes.BEFORE_INSERT_OR_MODIFY_DETAIL]: () => {
			return state.set('cardData', fromJS(action.receivedData))
						.setIn(['views', 'insertOrModify'], action.insertOrMidify)
		},
		[ActionTypes.CHANGE_APPROVAL_CARD_COMMON_STRING]: () => {
			return state = state.setIn(['cardData', action.place], action.value)
		},
		[ActionTypes.ADD_APPROVAL_CARD_FORM_COMPONENT]: () => {
			state = state.updateIn(['cardData', 'formSetting', 'componentList'], v => v.set(v.size, fromJS(action.component).set('orderValue', v.size)))
			return state
		},
		[ActionTypes.DELETE_APPROVAL_CARD_FORM_COMPONENT]: () => {
			state = state.updateIn(['cardData', 'formSetting', 'componentList'], v => v.delete(action.index).map((v, i) => v.set('orderValue', i)))
			return state
		},
		[ActionTypes.CHANGE_APPROVAL_CARD_FORM_OPTION_STRING]: () => {
			state = state.setIn(action.arr, action.value)
			return state
		},
		[ActionTypes.ADJUST_POSITION_APPROVAL_CARD_COMPONENT]: () => {
		
			const fromItem = state.getIn(['cardData', 'formSetting', 'componentList', action.fromPost])
			state = state.updateIn(['cardData', 'formSetting', 'componentList'], v => v.delete(action.fromPost).insert(action.toPost, fromItem).map((v, i) => v.set('orderValue', i)))
			return state
		}

	}[action.type] || (() => state))()
}