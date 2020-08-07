import { fromJS, toJS } from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const syxmbState = fromJS({
	view: {
		chooseperiods: false,
		// status: '损益',
		cardUuid:'',
		//assCategory: '',
		// didMount: false
		yearAmountSort: 1,
		currentAmountSort: 1,
		increaseAmountSort: 1,
		propYearAmountSort: 1,
		yearIncreaseAmountSort: 1,
		didMount: false,
		currentAc: '损益净额',
		tableShowChild: [],
		showCheck:false,
		needCategory:false,
		beCategory:true,
		cardName:'',
		allAssOrAc:'ac',
		unit:1
	},
	issuedate: '',
	endissuedate: '',
	initCardList:[],
	"cardList":[],
    "detailDrawing":{
        "incomeForMonth":[],
        "payForMonth":[]
    },
    "firstAcList":[],
    "gainAndLoss":{
        "ginAndLoss": 0,
        "income": 0,
        "pay": 0
    },
    "trendMap":{
        "ginAndLossForMonth":[],
        "incomeForMonth":[],
        "payForMonth":[]
    },
	"ambDetailTable":{
        "isForOneMonth": "TRUE",
		totalLine:{},
		acIdList: [],
        "acTable": [],
        "assTable":[]
    }
})
export default function handleLrb(state = syxmbState, action) {
	return({
		[ActionTypes.INTI_SYXMB]							: () => syxmbState,
		[ActionTypes.SET_SYXMB_CARD_LIST]					: () =>{
			let cardList =fromJS([{uuid:'',name:'全部',beCategory:true,cardList:[],categoryList:[]}].concat(action.cardlist))
			let hasChild=false
			action.cardlist.map((e) => {
				// if (e.categoryList.length > 0) {
				if (e.beCategory) {
					hasChild = true
				}
			})
			if (action.cardUuid === '') {
				state=state.setIn(['view', "beCategory"],true)
				if (hasChild) {
					state=state.setIn(['view', "showCheck"], true)
				} else {
					state=state.setIn(['view', "showCheck"], false)
				} 
			} else {
				if (action.haveCategory) {
					state=state.setIn(['view', "showCheck"], true)
				} else {
					state=state.setIn(['view', "showCheck"], false)
				}
			}
			return state.set('cardList',cardList).setIn(['view', 'cardUuid'], action.cardUuid)
		},
		[ActionTypes.GET_SYXM_INCOMESTATEMENT_FETCH]        : ()=>{
			state = state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate).setIn(['view', 'currentAc'], '损益净额')
			//let cardUuid =action.cardUuid
			//if(action.refreshCardList===true){
			//	state = state.set('cardList', fromJS([{uuid:'',name:'全部',beCategory:true,cardList:[],categoryList:[]}].concat(action.receivedData.cardList)))
					//			.set('initCardList',fromJS([{uuid:'',name:'全部',cardList:[],categoryList:[]}].concat(action.receivedData.cardList)))
			// if (cardUuid==='') {
			// 	state = state.setIn(['view', 'cardUuid'], '')
			// } else {
			// 	let hasItem = false
			// 	const loop = (list)=>list.map((e)=>{
			// 		if(e.uuid===cardUuid){
			// 			hasItem=true
			// 		}
			// 		if(e.categoryList.length>0){
			// 			loop(e.categoryList)
			// 		}
			// 		if(e.cardList.length>0){
			// 			loop(e.cardList)
			// 		}
			// 	})
			// 	loop(action.receivedData.cardList)
			// 	if(hasItem){
			// 		state = state.setIn(['view', 'cardUuid'], cardUuid)
			// 	}else{
			// 		state = state.setIn(['view', 'cardUuid'], '')
			// 	}
			// }

			//}else{
			//	state = state.setIn(['view', 'cardUuid'], action.cardUuid)
			//}
			// let hasChild=false
			// action.receivedData.cardList.map((e)=>{
			// 	if(e.categoryList.length>0){
			// 		hasChild=true
			// 	}
			// })
			// if(cardUuid===''&&hasChild){
			// 	state=state.setIn(['view', "showCheck"],true)
			// }


			// if (!action.assCategory) {
			// 	state = state.setIn(['view', 'assCategory'], action.receivedData.assList.length ? action.receivedData.assList[0].asscategory : '')
			// }

			state = state.set('gainAndLoss', fromJS(action.receivedData.gainAndLoss))
							.set('trendMap', fromJS(action.receivedData.trendMap))
							.set('detailDrawing', fromJS(action.receivedData.detailDrawing))
							.set('ambDetailTable', fromJS(action.receivedData.ambDetailTable))
							.setIn(['view', 'cardUuid'], action.cardUuid)
			return state
		},
		// 是否接收到后台数据，如果为true就可以开始渲染
		[ActionTypes.CHANGE_SYXM_CHAR_DIDMOUNT]					: () => state.setIn(['view', 'didMount'], action.bool),
		[ActionTypes.CHANGE_SYXMB_CHOOSE_MORE_PERIODS]          : () => state.updateIn(['view', 'chooseperiods'], v => !v),
		[ActionTypes.SELECT_SYXMB_CURRENT_AC]					: () => state.setIn(['view', 'currentAc'], action.info),
		[ActionTypes.SYXMB_SORT_BY_SORTNAME]                    : () => {
			// 三个排序通过传参不同统一转换排序
			const sortStandardStr = action.sortStandardStr //'yearAmountSort'
			const sortName = action.sortName //'yearAmount'
			const sortStandard = -state.getIn(['view', sortStandardStr])
			return state
				.updateIn(['view', sortStandardStr], v => -v)
				.updateIn(['ambDetailTable', 'assTable'], v => v.sort((a, b) => a.get(sortName) > b.get(sortName) ? sortStandard : - sortStandard))
		},
		// 科目树选择
		[ActionTypes.SYXMB_SELECT_AC]							: () => state.update('ambDetailTable', v => v.set('assTable', fromJS(action.receivedData.assTable)).set('isForOneMonth', action.receivedData.isForOneMonth).set('totalLine', fromJS(action.receivedData.totalLine))),
		[ActionTypes.CHANGE_SYXM_TABLE_SHOW_CHILD]:()=>{

			const tableShowChild = state.getIn(['view', 'tableShowChild'])

			if (tableShowChild.indexOf(action.id) > -1)
				return state.updateIn(['view', 'tableShowChild'], v => v.map(w => w.indexOf(action.id) > -1 ? '' : w).filter(w => !!w))
			else
				return state.updateIn(['view', 'tableShowChild'], v => v.push(action.id))
		},
		[ActionTypes.CHANGE_NEED_CATEGORY]:()=>{
			return state.setIn(['view', 'needCategory'],action.bool)
		},
		[ActionTypes.CHANGE_CHECKED_SHOW]:()=>{
			return state.setIn(['view', "showCheck"],action.bool)
		},
		[ActionTypes.SET_BE_CATEGORY]:()=>{
			return state.setIn(['view', 'beCategory'],action.bool)
		},
		[ActionTypes.SET_CARD_NAME]:()=>{
			return state.setIn(['view', 'cardName'],action.name)
		},
		[ActionTypes.CHANG_ASS_OR_AC]:()=>{
			return state.setIn(['view', 'allAssOrAc'],action.value)
		},
		[ActionTypes.CHANGE_UNIT]:()=>{
			return state.setIn(['view','unit'],action.value)
		}
	}[action.type] || (() => state))()
}
