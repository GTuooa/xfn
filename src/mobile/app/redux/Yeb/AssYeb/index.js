import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const assYebState = fromJS({
	issuedate: '',
	endissuedate: '',
	// showedLowerAcIdList: [],
	kmyeAssCategory: '客户',
	assKmyebList: [
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
	assTree:[],//科目树
	kmyeAssAcId: '全部',//显示的acid acname的组合
	acId: '',//acid 科目树的id
	isDouble: false,//是否是双辅助
	assIdTwo: '',
	doubleAssCategory: '',
	doubleAss: []//第二个辅助核算的列表
})

export default function handleKmyeb(state = assYebState, action) {
	return ({
		[ActionTypes.INIT_ASSKMYEB]				    : () => assYebState,
		[ActionTypes.GET_ASS_KMYEB_LIST_FETCH]		: () => {
			const assbalanceaclist = action.receivedData.data
			let newAssBalanceList = []
			assbalanceaclist.forEach((v,i) => {
				if (v.assBaDtoList.length) {
					v.showchilditem = false
				}
				v.isWrap = true
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
						w.upperAssid = v.upperAssid
						w.firstLength = firstlength
						w.disableTime = v.disableTime
						const nextlength = j+1 == assBaDtoListLength ? firstlength : v.assBaDtoList[j+1].acid.length
						if (w.acid.length == firstlength && nextlength > firstlength) {
							w.showchilditem = false
							w.isFirstChild = true
						} else if (w.acid.length == firstlength) {
							w.isFirstAndLast = true
						}
						newAssBalanceList.push(w)
					})
				}
			})
			state = state.set('issuedate', action.issuedate)
			.set('assKmyebList', fromJS(newAssBalanceList))
			.set('kmyeAssCategory', action.kmyeAssCategory)
			.set('kmyeAssAcId', action.kmyeAssAcId)
			.set('endissuedate', action.endissuedate)

			if(action.assIdTwo === '' || action.assIdTwo){
				return state.set('assIdTwo', action.assIdTwo)

			}else{
				return state.set('doubleAss', fromJS([]))
				.set('doubleAssCategory', '')
				.set('isDouble', false)
				.set('assIdTwo', '')

			}
		},
		[ActionTypes.GET_ASS_TREE]				     : () => {
			let assTree=[];
			action.receivedData.data.forEach((v)=>{
				assTree.push({
					key: `${v['acid']} ${v['acname']}`,
					value: v['acid']
				})
			})
			assTree.unshift({key:'全部',value:''})
			state = state.set('assTree',fromJS(assTree))
			return state
		},
		[ActionTypes.SHOW_ASS_KMYEB_CHILD_ITIEM]		: () => state.updateIn(['assKmyebList', action.idx, 'showchilditem'], v => !v),
		[ActionTypes.CHANGE_KMYE_ASS_ACID]				: () => state.set('kmyeAssAcId', action.key).set('acId', action.value),
		[ActionTypes.CHANGE_ASS_YEB_BEGIN_DATE]			: () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},
		[ActionTypes.CHECK_HAVE_DOUBLE_ASS]            		: () => {//科目是否挂有两个辅助核算


			return state.set('isDouble', action.isDouble)
			.set('doubleAss', fromJS(action.doubleAss))
			.set('doubleAssCategory', action.doubleAssCategory)
		}
	}[action.type] || (() => state))()
}
