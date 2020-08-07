import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const amountMxbState = fromJS({
	views: {
		queryByAss: false,
		currentPage: 1,
	},
	issuedate: '',
	endissuedate: '',
	currentAcid: '',
	currentAss: '',
	mxAssObj: {
		assCategory: '',
		assId: '',
		assName: '',
		acId: '',
		acName: '',
		assCategoryTwo: '',
		assIdTwo: '',
		assNameTwo: '',
	},
	acTree: [],
	assTree: [],
	amountmxbAclist: [],
	ledger: {
		acfullname: '',
		acid: '',
		acname: '',
		acunit: '',
		acunitOpen: '',
		assid: '',
		assname: '',
		begincount: 0,
		closeingprice: 0,
		closingDirection: '',
		closingbalance: 0,
		closingcount: 0,
		credit:	0,
		creditcount: 0,
		creditprice: 0,
		debit: 0,
		debitcount:	0,
		debitprice: 0,
		direction: '',
		openingDirection: '',
		openingbalance: '',
		openingprice: '',
		jvlist: [
			/*{
				vcindex: '',
				vcdate: '',
				jvabstract: '',
				jvamount: '',
				jvdirection: '',
				closingbalance: ''
			}*/
		]
	}

})

export default function handleKmyeb(state = amountMxbState, action) {
	return ({
		[ActionTypes.INIT_AMOUNTMXB]							: () => amountMxbState,
		[ActionTypes.GET_AMOUNT_MXB_ACLIST] 					: () => state.set('amountmxbAclist', fromJS(action.receivedData.data)),
		[ActionTypes.GET_AMOUNT_MXB_SUBSIDIARY_LEDGER_FETCH] 	: () => state.update('issuedate',v => action.issuedate)
																		.update('ledger', v => v.merge(fromJS(action.receivedData)))
																		.set('currentAcid', action.currentAcid)
																		.set('currentAss', action.currentAss)
																		.set('endissuedate', action.endissuedate)
																		.setIn(['views', 'currentPage'], 1),
		[ActionTypes.CHANGE_DATA_AMOUNTMXB]						: () => {
			return state.setIn(action.dataType, action.value)
		},
		[ActionTypes.CHANGE_SHORT_DATA_AMOUNTMXB]				: () => {
			return state.set(action.dataType, action.value)
		}
	}[action.type] || (() => state))()
}
