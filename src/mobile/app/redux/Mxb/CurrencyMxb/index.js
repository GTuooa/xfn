import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

const currencyMxbState = fromJS({
	issuedate: '',
	endissuedate: '',
	currentFcNumber: '',
    currentPage: 1,

	currentAcId: '',
    acid:'',
    acName:'',
	currencyAcList:[
        /*{
            number: '',
            name: '',
            'acList': [
                {
                    sobid: '',
                    acid : '',
                    acname : '',
                    category : '',
                    direction : '',
                    upperid : '',
                    acunit : '',
                    acunitOpen : ''
                }
            ]
        }*/
    ],
    currencyDetailList: {
            acid: '',
            name: '',
            number: '',
            direction: '',
            debit: '',
            credit: '',
            fcDebit: '',
            fcCredit: '',
            openingBalance: '',
            closingBalance: '',
            fcOpeningBalance: '',
            fcClosingBalance: '',
            jvList: []
        }


})

export default function handleCxpz(state = currencyMxbState, action) {

	return ({
		[ActionTypes.INIT_CURRENCY_MXB]							: () => currencyMxbState,
		[ActionTypes.GET_CURRENCY_MXB_ACLIST]					: () => state.set('currencyAcList', fromJS(action.receivedData)),
		[ActionTypes.GET_CURRENCY_DETAIL_FETCH]					: () => state.set('currencyDetailList', fromJS(action.receivedData)).set('issuedate', action.issuedate)
		.set('currentFcNumber', action.fcNumber)
		.set('currentAcId', action.acid)
		.set('endissuedate', action.endissuedate)
		.set('currentPage', 1),
        [ActionTypes.GET_CURRENCY_MXB_ACNAME]							: () => state.set('acid',action.acid).set('acName',action.acName),
		[ActionTypes.CHANGE_CUR_MXB_BEGIN_DATE]				    : () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
        },
        [ActionTypes.CHANGE_CURRENCY_CURRENTPAGE]               : () => {
            return state = state.set('currentPage', action.currentPage)
        }

	}[action.type] || (() => state))()
}
