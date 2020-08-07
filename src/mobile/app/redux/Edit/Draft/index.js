import { fromJS, toJS }	from 'immutable'
import { formatMoney } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

const draftState = fromJS({
    flags: {
        selectDraftType: '全部', //草稿列表的类型 '全部、未锁定、已锁定'
        searchValue: '',  //关键字搜索

    },
    allDraftList:[],
    draftList: []

})

export default function handleItem(state = draftState, action) {
	return ({
        [ActionTypes.INIT_DRAFT]                            : () => draftState,
        [ActionTypes.GET_DRAFT_LIST_FETCH]                  : () => state.setIn(['flags', 'selectDraftType'], action.selectDraftType).set('draftList', fromJS(action.receivedData)).set('allDraftList', fromJS(action.receivedData)),
        [ActionTypes.SEARCH_DRAFT_ITEM]                     : () => {
            const searchValue = action.value

            if (searchValue !== '') {
				state = state.set('draftList', state.get('allDraftList'))
				.update('draftList', u => u.map(v => v.set('matchStr', `${v.get('vcdate')} 记${v.get('vcindex')}号 ${v.get('jvlist').map(w => `${w.get('jvabstract')} ${w.get('acid')}_${w.get('acname')} ${formatMoney(w.get('jvamount'), 2, '')} ${w.get('asslist').size ? w.get('asslist').map(m => `${m.get('assid')}_${m.get('assname')}`).join('_') : ''}`)} ${v.get('createdby')} ${v.get('closedby')}`)))
				.update('draftList', v => v.filter(v => v.get('matchStr').indexOf(searchValue) > -1))
			} else {
				state = state.set('draftList', state.get('allDraftList'))
			}
            return state.setIn(['flags', 'searchValue'], searchValue)
        }


	}[action.type] || (() => state))()
}
