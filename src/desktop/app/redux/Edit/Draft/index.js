import { fromJS, toJS }	from 'immutable'
import { formatMoney } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const draftState = fromJS({
	flags: {
		selectDraftType: '全部', //草稿列表的类型 '全部、未锁定、已锁定'
		searchValue: '', //关键字搜索
		selectDraftAll: false,  //全选
		indexSort: 1,
		dateSort: 1
	},
	allDraftList:[],
    draftList: [ 	//显示在页面上的列表
        // {
        //     checkboxDisplay:false,   // 复选框的状态
        //
        // },{
        //     checkboxDisplay:false,
        // }
    ],
	selectList:[],   //选择的列表
})

export default
function handleLrb(state = draftState, action) {
	return ({
		[ActionTypes.INIT_DRAFT]				: () => draftState,
		[ActionTypes.GET_DRAFT_LIST_FETCH]		: () => {
			state = draftState.setIn(['flags', 'selectDraftType'], action.selectDraftType)
					.set('allDraftList', fromJS(action.receivedData))
					.set('draftList', fromJS(action.receivedData))
			state.get('draftList').map((u,i) => {
                state = state.setIn(['draftList', i, 'checkboxDisplay'], false)
                state = state.setIn(['allDraftList', i, 'checkboxDisplay'], false)
            })
			return state
		},
		[ActionTypes.SELECT_DRAFT_ALL]: () => {
			return state.setIn(['flags','selectDraftAll'], !state.getIn(['flags','selectDraftAll']))
                        .update('draftList', v => v.map(w => w.set('checkboxDisplay', !state.getIn(['flags','selectDraftAll']))))

		},
		[ActionTypes.SELECT_DRAFT_ITEM]: () => {
			state = state.updateIn(['draftList', action.idx, 'checkboxDisplay'], v => !v)
			return state.setIn(['flags','selectDraftAll'], state.get('draftList').every(v => v.get('checkboxDisplay')))
		},
		[ActionTypes.CHANGE_DRAFT_INPUT_VALUE]: () => {
			return state.setIn(['flags', 'searchValue'], action.value)
		},
		[ActionTypes.SEARCH_DRAFT]: () =>{   //关键字搜索
			const searchValue = action.value;
            if (searchValue !== '') {
				return state.setIn(['flags', 'searchValue'], action.value).set('draftList', state.get('allDraftList'))
				.update('draftList', u => u.map(v => v.set('matchStr', `${v.get('vcdate')} 记${v.get('vcindex')}号 ${v.get('jvlist').map(w => `${w.get('jvabstract')} ${w.get('acid')}_${w.get('acname')} ${w.get('jvamount')} ${formatMoney(w.get('jvamount'), 2, '')} ${w.get('asslist').size ? w.get('asslist').map(m => `${m.get('assid')}_${m.get('assname')}`).join('_') : ''}`)} ${v.get('createdby')} ${v.get('closedby')}`)))
				.update('draftList', v => v.filter(v => v.get('matchStr').indexOf(searchValue) > -1))
			} else {
				return state.setIn(['flags', 'searchValue'], action.value).set('draftList', state.get('allDraftList'))
			}
        },
		[ActionTypes.NOT_SELECT_MODEL_ALL]: () => { //清除复选框
			state.get('draftList').map((u,i) => {
                state = state.setIn(['draftList', i, 'checkboxDisplay'], false)
            })
            state.get('allDraftList').map((u,i) => {
                state = state.setIn(['allDraftList', i, 'checkboxDisplay'], false)
            })
            return state.setIn(['flags','selectDraftAll'], false)
        },
		[ActionTypes.SORT_DRAFT_LIST_BY_DATE] : () => {
			const dateSort = -state.getIn(['flags', 'dateSort'])

			return state.updateIn(['flags', 'dateSort'], v => -v)
				.update('draftList', v => v.sort((a, b) => {
					if (a.get('vcdate') == b.get('vcdate')) {
						return a.get('vcindex') > b.get('vcindex') ? 1 : -1
					} else {
						return a.get('vcdate') > b.get('vcdate') ? dateSort : -dateSort
					}
				}))
		},
		[ActionTypes.REVERSE_DRAFT_LIST] : () => {
			const indexSort = -state.getIn(['flags', 'indexSort'])

			return state.updateIn(['flags', 'indexSort'], v => -v)
				.update('draftList', v => v.sort((a, b) => {
					if (a.get('vcindex') == b.get('vcindex')) {
						return a.get('vcdate') < b.get('vcdate') ? 1 : -1
					} else {
						return a.get('vcindex') > b.get('vcindex') ? indexSort : -indexSort
					}
				}))
		}
    }[action.type] || (() => state))()
}
