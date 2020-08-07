import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

const qcyeState = fromJS({
	selectIdx: -1,
	tabSelectedIndex: 0,
	showedLowerAcIdList: [],
	isModified: false,
	acbalist: [{
		acid: '',
		acname: '',
		acfullname: '',
		direction: '',
		amount: '',
		beginCount:'',
		asslist: [
		// 	{
		// 	assid: '',
		// 	assname: '',
		// 	asscategory: ''
		// }
		]
	}]
})

export default function handle(state = qcyeState, action) {
	return ({
		[ActionTypes.INIT_QCYE]					: () => qcyeState,
		[ActionTypes.CHANGE_TAB_INDEX_QCCONFIG]	: () => state.set('tabSelectedIndex', action.idx),
		[ActionTypes.TOGGLE_LOWER_QC]: () => {
			const showedLowerAcIdList = state.get('showedLowerAcIdList')

			if (showedLowerAcIdList.indexOf(action.acid) > -1)
				return state.update('showedLowerAcIdList', v => v.map(w => w.indexOf(action.acid) > -1 ? '' : w).filter(w => !!w))
			else
				return state.update('showedLowerAcIdList', v => v.push(action.acid))
		},
		[ActionTypes.INSERT_AC_BA]			: () => {
			return state.update('acbalist',v => v.insert(action.idx + 1, action.ac))
		},
		[ActionTypes.DELETE_AC_BA]			: () => state.deleteIn(['acbalist', action.idx]),
		[ActionTypes.DELETE_AC_BA_ALL]		: () => state.update('acbalist',v => v.clear()),
		[ActionTypes.CHANGE_AC_BA_AMOUNT]	: () => {
			const ac = action.ac
			const acid = ac.get('acid')
			const amount = action.amount

			if (/^[-\d]\d*\.?\d{0,2}$/g.test(amount) || amount === '') {
				// 更新带有辅助核算的acba
				if (action.acbaidx) {
					return state.updateIn(['acbalist', action.acbaidx, 'amount'], v => amount)
				}

				const idx = state.get('acbalist').findIndex(v => v.get('acid') === acid)
				// 更新不带辅助核算的acba
				if (idx > -1) {
					return state.updateIn(['acbalist', idx, 'amount'], v => amount)
				}
				// 新增一条新的acba
				else {
					return state.update('acbalist', v => v.unshift(fromJS({
						acid: ac.get('acid'),
						acname: ac.get('acname'),
						acfullname: ac.get('acfullname'),
						direction: ac.get('direction'),
						amount: amount,
						asslist: []
					})))
				}
			} else {
				return state
			}
		},
		[ActionTypes.REVERSE_AC_BA_LIST]	    : () => state.update('acbalist', v => v.reverse()),
		[ActionTypes.GET_BA_INIT_LIST_FETCH]	: () => state.set('acbalist', fromJS(action.receivedData)),
		// [ActionTypes.SET_AC_BA_LIST_FETCH]	    : () => {
		// 	showMessage(action.receivedData, true)
		// 	return state
		// }
		[ActionTypes.CHENGE_QCYE_ISMODIFIED]	: () => state.set('isModified', action.bool),
		// 更改数量
		[ActionTypes.CHANGE_AC_BALANCE_COUNT]	 		: () => {
			const ac = action.ac
			const acid = ac.get('acid')

			const reg = new RegExp("^[-\\d]\\d*\\.?\\d{0," + Number(action.unitDecimalCount) + "}$","g")

			if (reg.test(action.count) || action.count === '') {
				// 更新带有辅助核算的acba
				if (action.acbaidx) {
					return state.updateIn(['acbalist', action.acbaidx, 'beginCount'], v => action.count)
				}

				const idx = state.get('acbalist').findIndex(v => v.get('acid') === acid)
				// 更新不带辅助核算的acba
				if (idx > -1) {
					state = state.updateIn(['acbalist', idx, 'beginCount'], v => action.count)
				}
				// 新增一条新的acba
				else {
					state =  state.update('acbalist', v => v.unshift(fromJS({
						acid: ac.get('acid'),
						acname: ac.get('acname'),
						acfullname: ac.get('acfullname'),
						direction: ac.get('direction'),
						amount: '',
						beginCount: action.count,
						asslist: []
					})))
				}
			} else {
				return state
			}
			return state
		}
	}[action.type] || (() => state))()
}
