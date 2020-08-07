import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

const currencyYebState = fromJS({
	issuedate: '',
	endissuedate: '',
	currencyList: [],
	childitemlist:[],

})

export default function handleCxpz(state = currencyYebState, action) {

	return ({
		[ActionTypes.INIT_CURRENCY_YEB]							: () => currencyYebState,
		[ActionTypes.ALL_GET_CURRENCY_YEB_LIST_FETCH]			: () => state.set('currencyList', fromJS(action.receivedData)).set('issuedate', action.issuedate).set('endissuedate', action.endissuedate),
		[ActionTypes.CHANGE_CUR_YEB_BEGIN_DATE]				    : () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},
		[ActionTypes.SHOW_CURRENCY_BACHILD_ITIEM]         : () => {
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

	}[action.type] || (() => state))()
}
