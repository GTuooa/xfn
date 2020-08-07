import { fromJS } from 'immutable'
import { DateLib } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const lrbState = fromJS({
	issuedate: '',
	endissuedate: '',

	selectAssId: 0,
	assSelectableList: [],
	showedProfitLineBlockIdxList: [],//[1, 21, 30, 32],
	incomestatement: [{
		closingbalance: '',
		hashname: '',
		line: '',
		total: ''
	}],
	ifSelfTypeList:true,
	selfListData:[],
	showChildProfitList:[],
	referBegin:'',
	referEnd:'',
	referChooseValue:'YEAR_TOTAL',
	extraMessage:[],
	proportionDifference:'increaseDecreasePercent',//shareDifference amountDifference  increaseDecreasePrecent
	issues:[],
})

export default function handleLrb(state = lrbState, action) {
	return ({
		[ActionTypes.INIT_LRB]					         : () => lrbState,

		[ActionTypes.CHANGE_SELECTASSID]				 : () => state.set('selectAssId', action.selectAssId),
		[ActionTypes.CHANGE_ASSSELECTABLELIST]			 : () => state.set('assSelectableList', fromJS(action.assSelectableList)),
		[ActionTypes.CHANGE_ISSUDATE]					 : () => state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate),
		[ActionTypes.CHANGE_INCOME_STATEMENT]			 : () => state.set('incomestatement', fromJS(action.receivedData)),

		// [ActionTypes.GET_INCOME_STATEMENT_FETCH]: () => state.set('issuedate', action.issuedate).set('incomestatement', fromJS(action.receivedData.data)),

		[ActionTypes.TOGGLE_PROFIT_LINE_DISPLAY]: () => {
			const showedProfitLineBlockIdxList = state.get('showedProfitLineBlockIdxList')
			if (!action.blockIdx)
				return state.update('showedProfitLineBlockIdxList', v => v.size ? v.clear() : lrbState.get('showedProfitLineBlockIdxList'))
			else if (showedProfitLineBlockIdxList.indexOf(action.blockIdx) > -1)
				return state.update('showedProfitLineBlockIdxList', v => v.map(w => w === action.blockIdx ? -1 : w).filter(w => w !== -1))
			else
				return state.update('showedProfitLineBlockIdxList', v => v.push(action.blockIdx))
		},
		[ActionTypes.CHANGE_LRB_BEGIN_DATE]				   : () => state.set('issuedate', action.begin),
		[ActionTypes.CHANGE_LIST_TYPE]	:()=>{
			return state.set('ifSelfTypeList',action.bool)
		},
		[ActionTypes.SET_SELF_TYPE_LIST_DATA] :()=>{
			if (action.issues) {
				state = state.set('issues',fromJS(action.issues))
			}
			return state.set("selfListData",fromJS(action.selfListData))
						.set("extraMessage",fromJS(action.extraMessage))
		},
		[ActionTypes.CHANGE_SHOW_CHILD_PROFIT_LIST]:()=>{
			let uniqueId = action.payload
			let showChildProfitList = state.get("showChildProfitList").toJS()
			let newShowChildProfitList
			if(showChildProfitList.includes(uniqueId)){
				let index =showChildProfitList.findIndex((value,index)=>{
					return value ==uniqueId
				})
				showChildProfitList.splice(index,1)
				newShowChildProfitList = showChildProfitList
			}else{
				newShowChildProfitList = showChildProfitList.concat(uniqueId)
			}
			return state.set("showChildProfitList",fromJS(newShowChildProfitList))

		},
		[ActionTypes.SET_REFER_DATE]:()=>{
			return state.set('referBegin',action.referBegin).set("referEnd",action.referEnd)
		},
		[ActionTypes.SET_REFER_CHOOSE_VALUE]:()=>{
			return state.set('referChooseValue',action.value)
		},
		[ActionTypes.SET_SELF_LIST_EXTRA_MESSAGE]:()=>{
			return state.set("extraMessage",action.data)
		},
		[ActionTypes.CHANGE_DIFFERENCE_TYPE]:()=>{
			return state.set('proportionDifference',action.value)
		}
	}[action.type] || (() => state))()
}
