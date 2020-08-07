import { fromJS }	from 'immutable'
import { combineReducers }	from 'redux'
import * as ActionTypes from './ActionTypes.js'

const xjllbState = fromJS({
	issuedate: '',
	endissuedate: '',
	showedLineBlockIdxList: [],	//需要显示的列 --> [7, 13, 19, 20, 21, 22， 23, 24, 25]
	cachFlowList: [{    //每列的数据
        lineIndex: '',
		lineName: '',
        amount: '',
        sumAmount: ''
	}],
	issues:[]
})

export default function handleLrb(state = xjllbState, action) {
	return ({
		[ActionTypes.INIT_XJLLB]				      : () => xjllbState,
		[ActionTypes.GET_CACH_FLOW_FETCH]             : () => state.set('cachFlowList', fromJS(action.receivedData)),
		[ActionTypes.CHANGE_XJLLB_ISSUDATE]           : () => {
			if (action.issues) {
				state = state.set('issues', fromJS(action.issues))
			}
			return state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate)
		},
		[ActionTypes.TOGGLE_CACH_FLOW_LINE_DISPLAY]   : () => {
			const showedLineBlockIdxList = state.get('showedLineBlockIdxList')
			if (!action.blockIdx)
				return state.update('showedLineBlockIdxList', v => v.size ? v.clear() : xjllbState.get('showedLineBlockIdxList'))
			else if (showedLineBlockIdxList.indexOf(action.blockIdx) > -1)
				return state.update('showedLineBlockIdxList', v => v.map(w => w === action.blockIdx ? -1 : w).filter(w => w !== -1))
			else
				return state.update('showedLineBlockIdxList', v => v.push(action.blockIdx))

		},
		[ActionTypes.CHANGE_XJLLB_BEGIN_DATE]		  : () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		}
	}[action.type] || (() => state))()
}
