import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

const currencyState = fromJS({
	allCheckboxDisplay: false,
	toolBarDisplayIndex: 1,
	handleCurrency: 'insert',
    relatedAclist: [],		//用户选择的关联科目列表
	acRelateFCList: [],		//从后台获取的关联科目列表
    currencyList: [],	//币别列表
	currencyModelList: [], //币别列表模板
	currency: {  //新增／修改
		fcNumber: '',
		name: '',
		exchange: '',
		standard:''
	},
	fcTabSelectedIndex: 0,

})

export default function handleCxpz(state = currencyState, action) {

	return ({
		[ActionTypes.INIT_CURRENCY]							: () => currencyState,
        [ActionTypes.GET_FC_LIST_FETCH]						: () => state.set('currencyList', fromJS(action.receivedData)).set('currency', currencyState.get('currency')),
		[ActionTypes.GET_FC_RELATE_AC_LIST_FETCH]			: () => {
			let arr = []
			fromJS(action.receivedData).map((u,i) => {
				arr.push({
					acid: u.get('acid'),
					acname: u.get('acname'),
					acfullname: u.get('acfullname')
				})
			})
			const receivedData = fromJS(arr)
			const categorySelectedKeys = {
				'资产': [],
				'负债': [],
				'权益': [],
				'成本': [],
				'损益': []
			}
			if (receivedData) {
				receivedData.map(v =>
					categorySelectedKeys[
						({
							'1': '资产',
							'2': '负债',
							'3': '权益',
							'4': '成本'
						})[v.get('acid').substr(0, 1)] || '损益'
					].push(v)
				)
			}
			return state.set('acRelateFCList', receivedData).set('relatedAclist', receivedData).set('categorySelectedKeys', fromJS(categorySelectedKeys))
		},
		[ActionTypes.GET_MODEL_FC_LIST_FETCH]			: () => state.set('currencyModelList', fromJS(action.receivedData)),
		[ActionTypes.SHOW_ALL_CURRENCY_CHECKBOX]		: () => state.set('allCheckboxDisplay', true),
		[ActionTypes.HIDE_ALL_CURRENCY_CHECKBOX]		: () => state.set('allCheckboxDisplay', false).update('currencyList', v => v.map(w => w.set('selected', false))),
		[ActionTypes.SELECT_CURRENCY_ITEM]				: () => state.setIn(['currencyList', action.idx, 'selected'], !state.getIn(['currencyList', action.idx, 'selected'])),
		[ActionTypes.SELECT_ALL_CURRENCY_CHECKBOX]		: () => state.update('currencyList', v => v.map(w => w.set('selected', !w.get('selected')))),
		[ActionTypes.MODIFY_CURRENCY]					: () => state.setIn(['currency', 'fcNumber'], action.fcNumber).setIn(['currency', 'exchange'], action.exchange).set('handleCurrency', 'modify'),
		[ActionTypes.CHANGE_FC_NUMBER]					: () => {
			const standard = state.get('currencyModelList').filter(v => v.get('fcNumber') === action.fcNumber).getIn([0, 'standard'])
			return state.setIn(['currency', 'fcNumber'], action.fcNumber).setIn(['currency', 'standard'], standard).setIn(['currency', 'name'], action.name)
		},
		[ActionTypes.CHANGE_EXCHANGE]					: () => {
			if ((/^\d*\.?\d{0,4}$/g.test(action.value)) || action.value === '' ) {
				return state.setIn(['currency', 'exchange'], action.value)
			}
			return state
		},
		[ActionTypes.INSERT_CURRENCY]					: () => state.set('handleCurrency', 'insert').set('currency', currencyState.get('currency')),
		[ActionTypes.CANCEL_SAVE_CURRENCY]				: () => state.set('currency', currencyState.get('currency')),
		[ActionTypes.CHANGE_TAB_INDEX_CURRENCY]			: () => state.set('fcTabSelectedIndex', action.idx),



	}[action.type] || (() => state))()
}
