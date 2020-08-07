import { fromJS, toJS  }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const syxmbState = fromJS({
	view: {
		status: '损益',
		assId: '',
		assCategory: '',
		didMount: false
	},
	issuedate: '',
	endissuedate: '',
	cardName:'全部',
	cardUuid:'',
	cardList:[],
	initCardList:[],
	beCategory:true,
	needCategory:false,
	showCheck:true,
	assList: [],
	gainAndLoss: {
		"income": 0,
        "pay": 0,
        "ginAndLoss": 0
	},
	trendMap: {
		"incomeForMonth":[],
            "payForMonth":[],
            "ginAndLossForMonth":[]
		},
		"detailDrawing":{
			"incomeForMonth":[],
			"payForMonth":[],
			"ginAndLossForMonth":[]
		}
	}
)

export default function handleLrb(state = syxmbState, action) {
	return ({
		[ActionTypes.INIT_AMBSYB]				      	: () => syxmbState,
		[ActionTypes.CHANGE_CHAR_DIDMOUNT]				: () => state.setIn(['view', 'didMount'], action.bool),
		[ActionTypes.SWITCH_CHAR_STATUS]				: () => state.setIn(['view', 'status'], action.nextStatus),
		[ActionTypes.SET_AMB_ASSID]						: () => state.setIn(['view', 'assId'], action.assId),
		[ActionTypes.SET_AMB_ASSCATEGORY]			    : () => state.setIn(['view', 'assCategory'], action.assCategory),
		[ActionTypes.SET_SYXMB_CARD_LIST]               : () =>{
			let initCardList = [{uuid:'',name:'全部',beCategory:true,cardList:[],categoryList:[]}].concat(action.cardlist)
			let hasChild = false
			action.cardlist.map((e) => {
				// if(e.categoryList.length>0){
				if(e.beCategory){
					hasChild=true
				}
			})
			if(action.cardUuid===''){
				state=state.set("beCategory",true)
				if (hasChild) {
					state=state.set("showCheck",true)
				} else {
					state=state.set("showCheck",false)
				}
			} else {
				if (action.haveCategory) {
					state=state.set("showCheck",true)
				} else {
					state=state.set("showCheck",false)
				}
			}
			const loop = (item) => item.map((v, i) => {
				if (v.categoryList && v.categoryList.length) {
					return {
						key: `${v.uuid}`,
						label: v.name,
						childList: loop(v.categoryList)
					}
				} else if(v.cardList && v.cardList.length){
					return {
						key: `${v.uuid}`,
						label: v.name,
						childList: loop(v.cardList)
					}
				}
				else {
					return {
						key: `${v.uuid}`,
						label: v.name,
						childList: [],
					}
				}
			})
			let cardList=loop(initCardList)
			return state.set('cardList',fromJS(cardList)).set('cardUuid', action.cardUuid).set('initCardList',initCardList)

		},
		[ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH]		: () => {

			// if (!action.assId) {
			// 	state = state.set('assList', fromJS(action.receivedData.assList)).setIn(['view', 'assId'], '').setIn(['view', 'assCategory'], action.receivedData.assList.length ? action.receivedData.assList[0].asscategory : '')
			// } else {
			// 	state = state.setIn(['view', 'assId'], action.assId)
			// }
			//
			// if (!action.assCategory) {
			// 	state = state.setIn(['view', 'assCategory'], action.receivedData.assList.length ? action.receivedData.assList[0].asscategory : '')
			// }
			state = state.set('gainAndLoss', fromJS(action.receivedData.gainAndLoss))
			.set('trendMap', fromJS(action.receivedData.trendMap))
			.set('detailDrawing', fromJS(action.receivedData.detailDrawing))
			.set('issuedate', action.issuedate)
			.set('endissuedate', action.endissuedate)
			.set('cardUuid', action.cardUuid)
			.set("beCategory",action.beCategory)
			return state
		},
		[ActionTypes.CHANGE_AMB_BEGIN_DATE]				: () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},
		[ActionTypes.SET_CARD_NAME]:()=>{
			return state.set("cardName",action.name)
		},
		[ActionTypes.HANDLE_CHECKBOX_SHOW]:()=>{
			return state.set("showCheck",action.bool)
		},
		[ActionTypes.CHANGE_NEED_CATEGORY]:()=>{
			return state.set('needCategory',action.bool)
		}

	}[action.type] || (() => state))()
}
