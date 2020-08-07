import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const ammxbState = fromJS({
	issuedate: '',
	currentAcid: '',
	currentSupportPos: '',
	currentAsscategory: '',
	aclist: [], //mxb另获取的aclist
	asslist:[],
	cascadeDisplay: false,
	chooseperiods: false,
	endissuedate: '',
	currentPage: 1,
	pageCount: 0,
	assCategory:'',
	beSupport:false,
	assIdTwo:'',
	assCategoryTwo:'',
	ledger: {
		openingbalance: 0,
		closingbalance: 0,
		debit: 0,
		credit: 0,
		direction: '',
		acid: '',
		acname: '',
		assid: '',
		assname: '',
		jvlist: [/*{
			vcindex: 0,
			vcdate: '',
			jvabstract: '',
			jvamount: 0,
			jvdirection: '',
			balance: 0
		}*/]
	}
})


export default function handleMxb(state = ammxbState, action) {
	return ({
		[ActionTypes.INIT_AMMXB]							 : () => ammxbState.set('issuedate', action.issuedate ? action.issuedate : '').set('endissuedate', action.endissuedate ? action.endissuedate : ''),
		[ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_AM_FETCH]  : () => {
			const ledger = fromJS(action.receivedData)
			if (action.beSupport) {
				state = state.set('acId',action.acId)
							.set('acName',action.acName)
							.set('assName',action.assName)
							.set('assId',action.assId)
							.set('assCategory',action.assCategory)
							.set('assIdTwo',action.assIdTwo)
							.set('assTwoName',action.assTwoName)
							.set('assCategoryTwo',action.assCategoryTwo)
							.set('beSupport',action.beSupport)
							.set('currentSupportPos',action.pos)
							.set('currentPage', action.currentPage) 
				            .set('pageCount', action.pageCount)
			}
			if (action.endissuedate && action.issuedate !== action.endissuedate) {
				state = state.set('chooseperiods',true)
			} else {
				state = state.set('chooseperiods',false)
			}
			return state
				.set('issuedate', action.issuedate)
				.set('endissuedate', action.endissuedate)
				.set('ledger', ledger)
				.set('currentAcid', action.acId)
				.set('currentAsscategory', action.currentAsscategory)
				.set('currentPage', action.currentPage) 
				.set('pageCount', action.pageCount)
		},
		[ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_FETCH_NOAC_AM] : () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate).set('ledger', ammxbState.get('ledger')),
		[ActionTypes.GET_AMMXB_ACLIST]					 : () => state.set('aclist', fromJS(action.receivedData)).set('beSupport',false),
		[ActionTypes.GET_AMMXB_ASSLIST]					 : () => state.set('asslist', fromJS(action.receivedData))
																		.set('beSupport',true)
																		.set('assCategory',action.assCategory),
		[ActionTypes.CHANGE_AMXB_CHOOSE_MORE_PERIODS] 	 : () => {
			if (action.chooseperiods) {
				return state.set('chooseperiods', true)
			} else {
				return state.update('chooseperiods', v => !v)
			}
		}
	}[action.type] || (() => state))()
}
