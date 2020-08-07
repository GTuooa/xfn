import { fromJS } from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const currencyYebState = fromJS({
    issuedate: '',
    endissuedate: '',
    isShow: false,
    chooseperiods: false,
    currencyList:[
        // {
        //     acid: '',
        //     baFcKey: '',
        //     credit: '',
        //     creditClosingBalance: '',
        //     creditOpeningBalance: '',
        //     debit: '',
        //     debitClosingBalance: '',
        //     debitOpeningBalance: '',
        //     fcCredit: '',
        //     fcCreditClosingBalance: '',
        //     fcCreditOpeningBalance: '',
        //     fcDebit: '',
        //     fcDebitClosingBalance: '',
        //     fcDebitOpeningBalance: '',
        //     fcNumber: '',
        //     numberName: '',
        //     sumCredit: '',
        //     sumDebit: '',
        //     sumFcCredit: '',
        //     sumFcDebit: ''
        // }
    ],
    childitemlist:[],

})

export default function handleLrb(state = currencyYebState, action) {
	return ({
        [ActionTypes.INIT_CURRENCYYEB]                  : () => currencyYebState,
        [ActionTypes.ALL_GET_CURRENCY_YEB_LIST_FETCH]   : () => state.set('currencyList', fromJS(action.receivedData)).set('issuedate', action.issuedate).set('endissuedate', action.endissuedate),
        [ActionTypes.SHOW_CURRENCY_CHILD_ITIEM]         : () => {
            let childitemlist = state.get('childitemlist').toJS()
            if(childitemlist.indexOf(action.fcNumber) > -1){
                childitemlist.splice( childitemlist.indexOf(action.fcNumber),1)
                state = state.set('childitemlist',fromJS(childitemlist))
            }else{
                childitemlist.push(action.fcNumber)
                state = state.set('childitemlist',fromJS(childitemlist))
            }
            return state
        },       
        [ActionTypes.CHANGE_CURRENCY_YEB_SHOW]          : () => state.update('isShow', v=> !v),
        [ActionTypes.CHANGE_FC_YEB_CHOOSE_MORE_PERIODS] : () => state.update('chooseperiods', v => !v),

	}[action.type] || (() => state))()
}
