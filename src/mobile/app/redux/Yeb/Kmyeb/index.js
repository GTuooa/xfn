import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const kmyebState = fromJS({
	views: {
		chooseValue: 'ISSUE',
	},
	issuedate: '',
	showedLowerAcIdList: [],
	balist: {
		"allBeginDebitAmount": 0, //借方期初合计
		"allBeginCreditAmount": 0, //贷方期初合计
		"allHappenDebitAmount": 0, //借方发生合计
		"allHappenCreditAmount": 0, //贷方发生合计
		"allYearDebitAmount": 0, //借方本年合计
		"allYearCreditAmount": 0, //贷方本年合计
		"allEndDebitAmount": 0, //借方期末合计
		"allEndCreditAmount": 0, //贷方期末合计
		"detailList": []
	}
})

export default function handleKmyeb(state = kmyebState, action) {
	return ({
		[ActionTypes.INIT_KMYEB]				: () => kmyebState,
		[ActionTypes.TOGGLE_LOWER_BA]			: () => {
			const showedLowerAcIdList = state.get('showedLowerAcIdList')

			if (showedLowerAcIdList.indexOf(action.acid) > -1)
				return state.update('showedLowerAcIdList', v => v.map(w => w.indexOf(action.acid) > -1 ? '' : w).filter(w => !!w))
			else
				return state.update('showedLowerAcIdList', v => v.push(action.acid))
		},
		[ActionTypes.GET_AC_BA_LIST_FETCH]		: () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate).set('balist', fromJS(action.receivedData)),
		[ActionTypes.CHANGE_AC_YEB_CHOOSE_VALUE]: () => {
			return state = state.setIn(['views','chooseValue'], action.value)
		},
	}[action.type] || (() => state))()
}
