import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const amountYebState = fromJS({
	views: {
		queryByAss: false,//是否按辅助类别查询
		currentPage: 1,
	},
	issuedate: '',
	endissuedate: '',
	amountYebList: [],
	amountYebChildShow: [],//旧数据用
	assChildShow: [],//queryByAss用
	assObject: {
		assCategory: '科目',
		assKey: 'ac',
		queryBySingleAc: false,//是否按单科目查询
		assSecondCategory: '',
		secondAssKey: '',
		secondAssName: '全部',
		secondAssId: '',
		acId: '',
		acName: '全部科目',
		acKey: '',

	},
	acTree: [{key: '', label: '全部科目', acid: '', acname: '全部科目', ackey: '', childList: []}],
	assTree: [{uuid: '', name: '全部', asskey: '', assname: '全部'}],
	assCategoryList: [],
})

export default function handleKmyeb(state = amountYebState, action) {
	return ({
		[ActionTypes.INIT_AMOUNTYEB]						 : () => amountYebState,
		[ActionTypes.GET_PERIOD_AND_COUNT_LIST_FETCH] 		 : () => {
			return state.set('issuedate', action.issuedate)
			.set('endissuedate', action.endissuedate)
			.set('amountYebList', fromJS(action.receivedData))
			.setIn(['views', 'currentPage'], 1)
		},
		[ActionTypes.TOGGLE_LOWER_AMOUNTYEB]				  : () => {
			if (action.queryByAss) {
				const assChildShow = state.get('assChildShow')

				if (assChildShow.indexOf(action.acid) > -1)
					return state.update('assChildShow', v => v.map(w => w.indexOf(action.acid) > -1 ? '' : w).filter(w => !!w))
				else {
					return state.update('assChildShow', v => v.push(action.acid))
				}
			} else {
				const amountYebChildShow = state.get('amountYebChildShow')

				if (amountYebChildShow.indexOf(action.acid) > -1)
					return state.update('amountYebChildShow', v => v.map(w => w.indexOf(action.acid) > -1 ? '' : w).filter(w => !!w))
				else {
					return state.update('amountYebChildShow', v => v.push(action.acid))
				}
			}
		},
		[ActionTypes.CHANGE_AMOUNT_YEB_BEGIN_DATE]				: () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},
		[ActionTypes.CHANGE_DATA_AMOUNTYEB]				: () => {
			return state.setIn(action.dataType, action.value)
		},
		[ActionTypes.CHANGE_SHORT_DATA_AMOUNTYEB]		: () => {
			return state.set(action.dataType, fromJS(action.value))
		},



	}[action.type] || (() => state))()
}
