import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const yjsfbState = fromJS({
	issuedate: '',
	endissuedate: '',
	showedProfitLineBlockIdxList: [],//[3]
	initPeriodList: [],
	showChildList:[],
	issues:[]
})

export default function handleLrb(state = yjsfbState, action) {
	return ({
		[ActionTypes.INIT_YJSFB]					     : () => yjsfbState,
		[ActionTypes.CHANGE_YJSFB_ISSUDATE]				 : () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate),
		[ActionTypes.TOGGLE_PROFIT_SFB_LINE_DISPLAY]     : () => {
			const showedProfitLineBlockIdxList = state.get('showedProfitLineBlockIdxList')
			if (!action.blockIdx)
				return state.update('showedProfitLineBlockIdxList', v => v.size ? v.clear() : yjsfbState.get('showedProfitLineBlockIdxList'))
			else if (showedProfitLineBlockIdxList.indexOf(action.blockIdx) > -1)
				return state.update('showedProfitLineBlockIdxList', v => v.map(w => w === action.blockIdx ? -1 : w).filter(w => w !== -1))
			else
				return state.update('showedProfitLineBlockIdxList', v => v.push(action.blockIdx))
		},
		[ActionTypes.GET_SFB_DATA]			              : () => {
				if (action.issues) {
					state = state.set('issues', fromJS(action.issues))
				}
				return state.set('initPeriodList', fromJS(action.receivedData))
		},
		[ActionTypes.CHANGE_YJSFB_BEGIN_DATE]				: () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},
		[ActionTypes.HANDLE_YJSFB_SHOW_CHILD_LIST]:()=>{
			let lineIndex = action.lineIndex
			let showChildList = state.get("showChildList").toJS()
			let newShowChildProfitList
			if(showChildList.includes(lineIndex)){
				let index =showChildList.findIndex((value,index)=>{
					return value ==lineIndex
				})
				showChildList.splice(index,1)
				newShowChildProfitList = showChildList
			}else{
				newShowChildProfitList = showChildList.concat(lineIndex)
			}
			return state.set("showChildList",fromJS(newShowChildProfitList))
		}
	}[action.type] || (() => state))()
}
