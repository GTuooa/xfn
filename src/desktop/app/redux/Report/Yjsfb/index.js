import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const yjsfbState = fromJS({
	issuedate: '',
	endissuedate: '',
	chooseperiods: false,
	sfbRuleModal: false,
	initPeriodList: [],
	showChildList:[],
	issues:[]
})


export default function handleSfb(state = yjsfbState, action) {
	return ({
		[ActionTypes.INIT_SJB]							 : () => yjsfbState,
		[ActionTypes.CHANGE_SFB_ISSUDATE]				 : () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate),
		[ActionTypes.CHANGE_SFB_RULE_MODAL]				 : () => state.update('sfbRuleModal', v => !v),
		[ActionTypes.GET_SFB_DATA]			             : () => {
			if (action.issues) {
        		state = state.set('issues',fromJS(action.issues))
			}
			return state.set('initPeriodList', fromJS(action.receivedData))
		},
		[ActionTypes.CHANGE_SFB_CHOOSE_MORE_PERIODS]	 : () => state.update('chooseperiods', v => !v),
		[ActionTypes.HANDLE_YJSFB_SHOW_CHILD_LIST]       : () =>{
			let lineIndex = action.lineIndex

			let showChildList = state.get("showChildList").toJS()
			let newShowChildList
			if (showChildList.includes(lineIndex)) {
				let index = showChildList.findIndex((value,index) => {
					return value === lineIndex
				})
				showChildList.splice(index,1)
				newShowChildList = showChildList
			}else{
				newShowChildList = showChildList.concat(lineIndex)
			}

			return state.set("showChildList",fromJS(newShowChildList))
		}
	}[action.type] || (() => state))()
}
