import { fromJS }	from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const assYebState = fromJS({
	issuedate: '',
	endissuedate: '',
	chooseperiods: false,
	kmyeAssCategory: '客户',
	kmyeAssAcId: '',
	acId: '',
	currentPage: 1,
	pageCount: 0,
	assbalanceaclist: [
		// {
		// 	"assid": "",
		// 	"assname": "",
		// 	"asscategory": "",
		// 	"direction": "",
		// 	"debit": 0,
		// 	"credit": 0,
		// 	"debitSum": 0,
		// 	"creditSum": 0,
		// 	"debitopeningbalance": 0,
		// 	"creditopeningbalance": 0,
		// 	"debitclosingbalance": 0,
		// 	"creditclosingbalance": 0
		// }
	],
	assTree: [],
	isDouble: false,//是否是双辅助
	assIdTwo: '',
	assCategoryTwo: '',
	doubleAssCategory: '',
	doubleAss: [],//第二个辅助核算的列表
	isAllExpand:false,
	ackey:'',
	acname:'',

})

export default function handleKmyeb(state = assYebState, action) {
	return ({
		[ActionTypes.INIT_ASS_KMYEB]                    		: () => assYebState,
		[ActionTypes.SHOW_ASS_KMYEB_CHILD_ITIEM]				: () => {

			const oldItem = state.getIn(['assbalanceaclist', action.idx])
			const oldStatue = oldItem.get('showchilditem')
			const isWrap = oldItem.get('isWrap')
			
			if(oldStatue){//由展开变为合拢－－true -> false
				const assid = state.getIn(['assbalanceaclist', action.idx, 'assid'])
				const wrapId = state.getIn(['assbalanceaclist', action.idx, 'wrapId'])
				const assidLength = assid.length

				const assbalanceaclist = state.get('assbalanceaclist')
				assbalanceaclist.forEach((v,i)=>{//收拢时把下一级的也收拢
					// if (assid == wrapId) {//点击的是最外一层时
					if (isWrap) {//点击的是最外一层时
						//所有有showchilditem属性的值都变为false
						if(v.has('showchilditem') && v.get('wrapId') == wrapId){
							state = state.updateIn(['assbalanceaclist', i, 'showchilditem'], w => false)
						}
					} else if ((v.get('wrapId') == wrapId && !v.get('isWrap')) && v.get('assid').substr(0,assidLength)==assid && v.has('showchilditem')) {
						//点击的不是最外层 把有共同的wrap的所有下级的showchilditem属性的值变为false
						state = state.updateIn(['assbalanceaclist', i, 'showchilditem'], w => false)
					}
				})
			} else {//由合拢变为展开－－false -> true
				state = state.updateIn(['assbalanceaclist', action.idx, 'showchilditem'], v => !v)
			}
			return state
		},
		[ActionTypes.CHANGE_ASS_KMYE_CHOOSE_MORE_PERIODS]	 	: () => state.update('chooseperiods', v => !v),
		[ActionTypes.GET_ASS_TREE]				                : () => {
			let assTree=action.receivedData.data;
			action.receivedData.data.unshift({acid:'0000',acname:'全部'})
			state = state.set('assTree',fromJS(action.receivedData.data))
			return state;
		},
		[ActionTypes.GET_ASS_KMYEB_LIST_FETCH] 		 			: () => {

			const assbalanceaclist = action.receivedData.data.pageData

			let newAssBalanceList = []

			assbalanceaclist.forEach((v,i) => {

				if (v.assBaDtoList.length) {
					v.showchilditem = false
				}

				v.isWrap = true //最外面包裹的
				v.wrapId = v.assid
				v.wrapName = v.assname

				newAssBalanceList.push(v)

				const assBaDtoListLength = v.assBaDtoList.length

				if (v.assBaDtoList.length) {

					const firstlength = v.assBaDtoList[0].acid.length

					v.assBaDtoList.forEach((w,j) => {
						w.assid = w.acid
						w.assname = w.acName
						w.wrapId = v.assid
						w.wrapName = v.assname
						w.firstLength = firstlength
						w.disableTime = v.disableTime

						if(w.acid.length == firstlength){//一级的上一级是包裹他的upperid
							w.upperAssid = v.upperAssid
						}else{//其他的是本身的字段
							w.upperAssid = w.upperid
						}
						if((j+1) !== assBaDtoListLength){
							if(w.acid === v.assBaDtoList[j+1].upperid){
								w.showchilditem = false
							}
						}

						newAssBalanceList.push(w)
					})
				}
			})
			let kmyeAssAcId = ''
			let assTree = state.get('assTree')
			if (action.kmyeAssAcId) {
					const item = assTree.find(v => v.get('acid') == action.kmyeAssAcId)
					kmyeAssAcId = item ? `${item.get('acid')} ${item.get('acname')}` : ''

			} else {
				kmyeAssAcId = ''
			}
			if (state.get('isAllExpand') && action.isFilterZero) {
				newAssBalanceList = newAssBalanceList.map((v,i) => {
					if(v.hasOwnProperty('showchilditem')) {
						v.showchilditem = true
					}
					return v
				})

			}
			state = state.set('assbalanceaclist', fromJS(newAssBalanceList))
			.set('issuedate', action.issuedate)
			.set('endissuedate', action.endissuedate)
			.set('kmyeAssCategory', action.kmyeAssCategory)
			.set('kmyeAssAcId', kmyeAssAcId)
			.set('acId', action.kmyeAssAcId)
			.set('condition', action.condition)
			.set('filterZero', action.filterZero)
			.set('currentPage', action.receivedData.data.currentPage)
			.set('pageCount', action.receivedData.data.pageCount)

			if(action.assIdTwo === '' || action.assIdTwo){
				const doubleAss = state.get('doubleAss')
				const item = doubleAss.find(v => v.get('assid') == action.assIdTwo)
				const assCategoryTwo = `${item.get('assid')}${Limit.TREE_JOIN_STR}${item.get('assname')}`
				return state.set('assIdTwo', action.assIdTwo)
				.set('assCategoryTwo', assCategoryTwo)

			}else{
				return state.set('doubleAss', fromJS([]))
				.set('doubleAssCategory', fromJS([]))
				.set('isDouble', false)
				.set('assCategoryTwo', '全部')
				.set('assIdTwo', '')
			}
		},
		[ActionTypes.ASS_YEB_SHOW_ALL]	 					 : () => {//是否全部展开
			const assbalanceaclist = state.get('assbalanceaclist')

			assbalanceaclist.forEach((v,i) => {
				if(v.has('showchilditem')){
					state = state.setIn(['assbalanceaclist', i, 'showchilditem'], action.value)
				}
			})
			return state.set('isAllExpand',action.value)
		},
		[ActionTypes.CHECK_HAVE_DOUBLE_ASS]            		: () => {//科目是否挂有两个辅助核算
			let doubleAss = action.receivedData.asslist
			const isDouble = doubleAss.length ? true : false
			action.receivedData.asslist.unshift({assid:'',assname:'全部'})
			return state.set('isDouble', isDouble)
			.set('doubleAss', fromJS(doubleAss))
			.set('assCategoryTwo', '全部')
			.set('doubleAssCategory', action.receivedData.asscategory)
		}
	}[action.type] || (() => state))()
}
