import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const AmyebState = fromJS({
	issuedate: '',
	endissuedate: '',
	chooseperiods: false,
	isShow:false,
	beSupport:false,
	assCategory:'',
	acId:'',
	balanceaclist: [{
		acid: '',
		acname: '',
		direction: '',
		beginbalance: '',
		debit: '',
		credit: '',
		balance: ''
		// showchilditem: false //一级科目且有下级科目到才有
	}],
	kmBalanceaclist:[{
		acId: '',
		acname: '',
		direction: '',
		beginbalance: '',
		debit: '',
		credit: '',
		balance: ''
		// showchilditem: false //一级科目且有下级科目到才有
	}],
	amountYebChildShow: [],
	amountYebKmChildShow:[],
	assCategoryList:[],
	assTree:[],
	assTwoCategory:'',
	assTwoTree:[],
	secondAssKey:'',
	assSecondName:''
})

export default function handleAmyeb(state = AmyebState, action) {
	return ({
		[ActionTypes.INIT_AMOUNT_KMYEB]                      : () => AmyebState,
		[ActionTypes.GET_AC_AM_BA_LIST_FETCH]                : () => state.set('balanceaclist', fromJS(action.receivedData))
																			.set('issuedate', action.issuedate)
																			.set('endissuedate', action.endissuedate),
		// [ActionTypes.SHOW_CHILD_ITIEM_AM]					 : () => {
		// 	return state.updateIn(['balanceaclist', action.idx, 'showchilditem'], v => !v)
		// },
		[ActionTypes.CHANGE_AMOUNTYEB_CHILD_SHOW]                 : () => {
			if (action.clear)
				return state.set('amountYebChildShow', fromJS([]))

			const amountYebChildShow = state.get('amountYebChildShow')
			if (amountYebChildShow.indexOf(action.acid) === -1) {
				const newAmountYebChildShow = amountYebChildShow.push(action.acid)
				return state.set('amountYebChildShow', newAmountYebChildShow)
			} else {
				const newAmountYebChildShow = amountYebChildShow.splice(amountYebChildShow.findIndex(v => v === action.acid), 1)
				return state.set('amountYebChildShow', newAmountYebChildShow)
			}
		},
		[ActionTypes.CHANGE_AMMYE_CHOOSE_MORE_PERIODS]       : () => state.update('chooseperiods', v => !v),
		[ActionTypes.CHANGE_AMMYE_SHOW]                      : () => state.update('isShow', v => !v),
		[ActionTypes.GET_AMOUNT_KM_LIST]            		: () => {
			return state.set('kmBalanceaclist', fromJS(action.receivedData))
						.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('beSupport', action.beSupport)
						.set('assCategory', action.assCategory)
						.set('acId', action.acId)
		},
		[ActionTypes.INIT_AMOUNT_KM_STATE]            		: () => {
			return state.set('beSupport', false)
						.set('acId','')
						.set('assCategory',action.assCategory)

		},
		[ActionTypes.CHANGE_AMOUNTYEB_KM_CHILD_SHOW]                 : () => {
			if (action.clear)
				return state.set('amountYebKmChildShow', fromJS([]))

			const amountYebKmChildShow = state.get('amountYebKmChildShow')
			if (amountYebKmChildShow.indexOf(action.acid) === -1) {
				const newAmountYebKmChildShow = amountYebKmChildShow.push(action.acid)
				return state.set('amountYebKmChildShow', newAmountYebKmChildShow)
			} else {
				const newAmountYebKmChildShow = amountYebKmChildShow.splice(amountYebKmChildShow.findIndex(v => v === action.acid), 1)
				return state.set('amountYebKmChildShow', newAmountYebKmChildShow)
			}
		},
		[ActionTypes.CHANGE_AMOUNT_YEB_STRING]                 : () => {
			if (action.palce instanceof Array) {
				return state.setIn(action.palce,fromJS(action.value))
			} else {
				return state.set(action.palce,fromJS(action.value))
			}
		},

	}[action.type] || (() => state))()
}
