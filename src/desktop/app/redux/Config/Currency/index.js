import { fromJS, toJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const currencyState = fromJS({
	currencyModel: false,		//新增弹框
	acListModalDisplay: false,    //关联科目弹框
	showCurrencyModal: false,
	showCurrencyInfo: [],

	activeAcTabKey:'资产',    //
	relatedAclist: [],		//关联科目
	categorySelectedKeys: {
		'资产': [],
		'负债': [],
		'权益': [],
		'成本': [],
		'损益': []
	},
	currencyList: [],	//币别列表
	// currencyModelList: [], //币别列表模板
	acRelateFCList:[],
	insertCurrencyList:{   //新增/修改
		fcNumber: '',
		name: '',
		exchange: '',
		standard:''
	}
})

export default function handleLrb(state = currencyState, action) {
	return ({
		[ActionTypes.INIT_CURRENCY_CONFIG]					: () => currencyState,
		[ActionTypes.GET_FC_LIST_FETCH]						: () => state.set('currencyList', fromJS(action.receivedData)).set('currencyModel', false).set('insertCurrencyList', currencyState.get('insertCurrencyList')),
		// [ActionTypes.GET_MODEL_FC_LIST_FETCH]	    		: () => state.set('currencyModelList', fromJS(action.receivedData)),
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
		[ActionTypes.CHANGE_CURRENCY_MODAL_DISPLAY] 		: () => {
			if (sessionStorage.getItem('handleCurrency') == 'modify') {
				state = state.setIn(['insertCurrencyList', 'fcNumber'], action.fcNumber).setIn(['insertCurrencyList', 'exchange'], action.exchange)
			}
			return state.set('currencyModel', !state.get('currencyModel'))
		},
		[ActionTypes.CANCEL_CURRENCY_MODAL_DISPLAY]			: () => state.set('currencyModel', !state.get('currencyModel')).set('insertCurrencyList', currencyState.get('insertCurrencyList')).set('currencyModel', !state.get('currencyModel')),
		[ActionTypes.CHANGE_CURRENCY]						: () => {
			if (action.item) {
				return state.setIn(['insertCurrencyList', 'fcNumber'], action.item.get('fcNumber'))
				.setIn(['insertCurrencyList', 'name'], action.item.get('name'))
				.setIn(['insertCurrencyList', 'standard'], action.item.get('standard'))
			} else {
				return state.setIn(['insertCurrencyList', 'fcNumber'], '')
				.setIn(['insertCurrencyList', 'name'], '')
				.setIn(['insertCurrencyList', 'standard'], '')
			}
		},

		[ActionTypes.CHANGE_SELECT_AC_LIST_MODAL_DISPLAY]	: () => state.set('acListModalDisplay', !state.get('acListModalDisplay')),
		[ActionTypes.MODIFY_RELATED_AC_LIST]				: () => {
			state = state.setIn(['categorySelectedKeys', state.get('activeAcTabKey')], fromJS(action.selectedAclist))
			return state.set('relatedAclist', state.get('categorySelectedKeys').reduce((prev, v) => prev.concat(v)))
		},
		[ActionTypes.CHANGE_AC_TAB_KEY]						: () => state.set('activeAcTabKey', action.key),
		[ActionTypes.SAVE_CURRENCY_FETCH]					: () => state.set('currencyModel', !state.get('currencyModel')),
		[ActionTypes.CHANGE_INSERT_EXCHANGE]				: () => state.setIn(['insertCurrencyList', 'exchange'], action.exchangeValue),
		[ActionTypes.DELETE_RELATE_AC_ITEM]					: () => state.update('relatedAclist', v => v.filter(w => w.get('acid') != action.acid)),
		[ActionTypes.SHOW_NOT_CANCEL_CURRENCY_INFO]			: () => state.set('showCurrencyModal', !state.get('showCurrencyModal')).set('showCurrencyInfo', action.data ? fromJS(action.data) : fromJS([]))
	}[action.type] || (() => state))()
}
