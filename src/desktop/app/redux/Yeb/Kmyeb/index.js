import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const kmyebState = fromJS({
	views: {
		chooseValue: 'MONTH',
		showchildList: [],
	},
	issuedate: '',
	endissuedate: '',
	chooseperiods: false,
	balanceaclist:  {
		"allBeginDebitAmount": 0, //借方期初合计
		"allBeginCreditAmount": 0, //贷方期初合计
		"allHappenDebitAmount": 0, //借方发生合计
		"allHappenCreditAmount": 0, //贷方发生合计
		"allYearDebitAmount": 0, //借方本年合计
		"allYearCreditAmount": 0, //贷方本年合计
		"allEndDebitAmount": 0, //借方期末合计
		"allEndCreditAmount": 0, //贷方期末合计
		"detailList": [],
	}
})

export default function handleKmyeb(state = kmyebState, action) {
	return ({
		[ActionTypes.INIT_KMYEB]                             : () => kmyebState,
		// 修改是否多选账期修改
		[ActionTypes.CHANGE_AC_YEB_CHOOSE_VALUE] 	 : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},
		[ActionTypes.GET_AC_BA_LIST_FETCH] 		 : () => {

			state = state.set('issuedate', action.issuedate).set('endissuedate', action.endissuedate)
			// const balist = action.receivedData
			// const balistLength = balist.length

			// balist.map((v, i) => {//添加upperid
			// 	if(v['acid'].length > 4){
			// 		v['upperid'] = v['acid'].substr(0,v['acid'].length-2)
			// 	}else{
			// 		v['upperid'] = ''
			// 	}
			// })
			// balist.map((v, i) => {//给有下级的加标识
			// 	if((i+1) !== balistLength){
			// 		if(v.acid === balist[i+1].upperid){
			// 			v.showchilditem = false
			// 		}
			// 	}
			// })

			return state.set('balanceaclist', fromJS(action.receivedData))

		},
		[ActionTypes.SHOW_CHILD_ITIEM]					 : () => {
			// const oldStatue = state.getIn(['balanceaclist', action.idx, 'showchilditem'])
			// if(oldStatue){//由展开变为合拢－－true -> false
			// 	const acid = state.getIn(['balanceaclist', action.idx, 'acid'])
			// 	const acidLength = acid.length
			// 	const balanceaclist = state.get('balanceaclist')

			// 	balanceaclist.forEach((v,i)=>{//收拢时把下级的也收拢
			// 		if(v.get('acid').substr(0,acidLength)==acid && v.has('showchilditem')){
			// 			state = state.updateIn(['balanceaclist', i, 'showchilditem'], w => false)
			// 		}
			// 	})
			// }else{
			// 	state = state.updateIn(['balanceaclist', action.idx, 'showchilditem'], v => !v)
			// }

			let showchildList = state.getIn(['views', 'showchildList'])

			if (showchildList.indexOf(action.acId) > -1) {
				showchildList = showchildList.filter(v => v !== action.acId)
				state = state.setIn(['views', 'showchildList'], showchildList)
			} else {
				showchildList = showchildList.push(action.acId)
				state = state.setIn(['views', 'showchildList'], showchildList)
			}

			return state
		},
		[ActionTypes.CHANGE_KMYE_CHOOSE_MORE_PERIODS]	 : () => state.update('chooseperiods', v => !v),
		[ActionTypes.IS_SHOW_ALL]	 					 : () => {//是否全部展开
			const balist = state.getIn(['balanceaclist', 'detailList'])
			// balist.forEach((v, i) => {
			// 	if(v.has('showchilditem')){
			// 		state = state.setIn(['balanceaclist', i, 'showchilditem'], action.value)
			// 	}
			// })
			
			if (action.value) {
				let showlist = []
				const loop = data => data.map(item => {
					showlist.push(item.get('acId'))
					if (item.get('childList') && item.get('childList').size) {
						loop(item.get('childList'))
					}
				})
				loop(balist)
				
				state = state.setIn(['views', 'showchildList'], fromJS(showlist))
			} else {
				state = state.setIn(['views', 'showchildList'], fromJS([]))
			}
			return state
		}
	}[action.type] || (() => state))()
}
