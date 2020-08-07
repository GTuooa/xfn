import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const relativeMxbState = fromJS({
	views: {
		issuedate:'',
		endissuedate: '',
		categoryName: '全部',
		currentRelativeItem:{
			uuid: '',
			name: '损益项目',
			value: '损益项目',
			top: false,
		},
		selectRelativeItem:{
			uuid: '',
			name: '全部',
			value: '全部',
			top: false,
		},
		selectTypeValue: 'category', //流水类别、类型值
		runningCategory: [{key:'',label:'',childList:[]}], //流水类别
		runningCategoryName:'全部', //流水类别名称
		categoryOrTypeUuid:'', //流水类别或类型uuid
		typeName:'全部', // 类型名称
		contactsCategory:[{
			key:`${Limit.TREE_JOIN_STR}0`,
			label:'全部',
			childList:[]
		}], //往来卡片类别
		cardList:[], //往来卡片列表
		cardName:'请选择类别', //卡片名称
		cardUuid:'', //往来卡片uuid
		typeCategory:[], //类型列表
		openDetail:{}, //期初
		QcqmDirection:'', //期初方向
		currentPage: 1,
		pageCount: 1,
		chooseDirection: 'double_credit',
		chooseValue: 'ISSUE',

	},
	issues:[],

	QcData:[],
	QmData: {

	},
	detailsTemp:[]

})


export default function handleRelativeMxb(state = relativeMxbState, action) {
	return ({
		[ActionTypes.INIT_RELATIVE_MXB]							 : () => relativeMxbState,
		[ActionTypes.GET_RELATIVE_BALANCE_LIST]				 	: () => {
			if(action.receivedData.cardList){
				let cardListArr = [{name: '全部',uuid: ''}]
				action.receivedData.cardList && action.receivedData.cardList.map(item => {
					cardListArr.push({
						name: `${item.code} ${item.name}`,
						uuid: item.uuid
					})
				})
				state = state.setIn(['views','cardList'],fromJS(cardListArr))
				// state = state.setIn(['views','cardList'],fromJS(action.receivedData.cardList))
			}
			if(action.receivedData.typeList){
				let typeCategory = [{
					key: '全部',
					value: `${''}${Limit.TREE_JOIN_STR}${'全部'}${Limit.TREE_JOIN_STR}${'debit'}`
				}]
				action.receivedData.typeList && action.receivedData.typeList.map(item => {
					typeCategory.push({
						key: item.jrTypeName,
						value: `${item.jrTypeUuid}${Limit.TREE_JOIN_STR}${item.jrTypeName}${Limit.TREE_JOIN_STR}${item.jrDirection}`
					})
				})
				state = state.setIn(['views','typeCategory'],fromJS(typeCategory))
			}
			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}
			const {creditAmount, debitAmount, realCreditAmount, realDebitAmount, balance, direction} = action.reportData
			const QmData = {creditAmount, debitAmount, realCreditAmount, realDebitAmount, balance, direction}
			return state = state.setIn(['views','issuedate'],fromJS(action.issuedate))
								.setIn(['views','endissuedate'],fromJS(action.endissuedate))
								.setIn(['views','openDetail'],fromJS(action.openDetail))
								.set('detailsTemp',fromJS(action.reportData.detailList))
								.set('QcData', fromJS(action.reportData.openDetail))
								.set('QmData', fromJS(QmData))
								.setIn(['views','currentPage'],fromJS(action.reportData.currentPage))
								.setIn(['views','pageCount'],fromJS(action.reportData.pages))
								.setIn(['views','cardName'],fromJS(action.cardName))
								.setIn(['views','cardUuid'],fromJS(action.cardUuid))
								.setIn(['views','chooseDirection'],fromJS(action.chooseDirection))
		},
		[ActionTypes.GET_RELATIVE_BALANCE_LIST_FROM_CARD]				 	: () => {
			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}
			const {creditAmount, debitAmount, realCreditAmount, realDebitAmount, balance, direction} = action.reportData
			const QmData = {creditAmount, debitAmount, realCreditAmount, realDebitAmount, balance, direction}
			return state = state.setIn(['views','issuedate'],fromJS(action.issuedate))
								.setIn(['views','endissuedate'],fromJS(action.endissuedate))
								.setIn(['views','openDetail'],fromJS(action.openDetail))
								.set('detailsTemp',fromJS(action.reportData.detailList))
								.set('QcData', fromJS(action.reportData.openDetail))
								.set('QmData', fromJS(QmData))
								.setIn(['views','currentPage'],fromJS(action.reportData.currentPage))
								.setIn(['views','pageCount'],fromJS(action.reportData.pages))
								.setIn(['views','cardName'],fromJS(action.cardName))
								.setIn(['views','cardUuid'],fromJS(action.cardUuid))
								.setIn(['views','chooseDirection'],fromJS(action.chooseDirection))
		},

		[ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE]				 	: () => {
			let typeCategory = [{
				key: '全部',
				value: `${''}${Limit.TREE_JOIN_STR}${'全部'}${Limit.TREE_JOIN_STR}${'debit'}`
			}]
			action.receivedData.typeList.map(item => {
				typeCategory.push({
					key: item.jrTypeName,
					value: `${item.jrTypeUuid}${Limit.TREE_JOIN_STR}${item.jrTypeName}${Limit.TREE_JOIN_STR}${item.jrDirection}`
				})
			})
			let runningCategory = [{
				key:`${Limit.TREE_JOIN_STR}double_credit`,
				label:'全部',
				childList:[]
			}]

			const loop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.jrCategoryUuid}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v.jrCategoryName,
						childList: loop(v.childList)
					}
				} else {
					return {
						key: `${v.jrCategoryUuid}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v.jrCategoryName,
						childList: [],
					}
				}
			})
			const category = loop(action.receivedData.categoryList)

			if(action.newRunningItem){
				state = state.setIn(['views','categoryOrTypeUuid'],action.newRunningItem.categoryOrTypeUuid)
							.setIn(['views','runningCategoryName'],action.newRunningItem.runningCategoryName)
							.setIn(['views','chooseDirection'],action.newRunningItem.chooseDirection)
			}

			return state = state.setIn(['views','runningCategory'],fromJS(runningCategory.concat(category)))
								.setIn(['views','typeCategory'],fromJS(typeCategory))

		},
		[ActionTypes.GET_RELATIVE_MXB_CATEGORY]				 	: () => {
			let initCategory = [{
				key:`${Limit.TREE_JOIN_STR}0`,
				label:'全部',
				childList:[]
			}]
			const typeLoop = (item) => item.map((v, i) => {
				const level = v.top ? 0 : 1
				if (v.childList && v.childList.length) {
					return {
						key: `${v.uuid}${Limit.TREE_JOIN_STR}${level}`,
						label: v.name,
						childList: typeLoop(v.childList)
					}
				} else {
					return {
						key: `${v.uuid}${Limit.TREE_JOIN_STR}${level}`,
						label: v.name,
						childList: [],
					}
				}
			})
			const contactsCategory = typeLoop(action.receivedData)
			const newContactsCategory = initCategory.concat(contactsCategory)

			return state = state.setIn(['views','contactsCategory'],fromJS(newContactsCategory))
		},
		[ActionTypes.INIT_CATEGORY_AND_TYPE]				: () => {
			return state = state.setIn(['views','runningCategoryName'], '全部')
								.setIn(['views','categoryOrTypeUuid'], '')
								.setIn(['views','typeName'], '全部')
								.setIn(['views','categoryOrTypeUuid'], '')
								.setIn(['views','QcqmDirection'], '')
		},
		[ActionTypes.GET_RELATIVE_MXB_LIST_FROM_CATEGORY_OR_TYPE]				: () => {
			const {creditAmount, debitAmount, realCreditAmount, realDebitAmount, balance, direction} = action.receivedData
			const QmData = {creditAmount, debitAmount, realCreditAmount, realDebitAmount, balance, direction}
			return state = state.set('detailsTemp', fromJS(action.receivedData.detailList))
								.setIn(['views','selectTypeValue'], action.selectType)
								.setIn(['views','pageCount'], action.receivedData.pages)
								.setIn(['views','chooseDirection'], action.direction)
								.set('QcData', fromJS(action.receivedData.openDetail))
								.set('QmData', fromJS(QmData))
		},
		[ActionTypes.GET_RELATIVE_MXB_LIST_FROM_PAGE]				: () => {
			let newList = []
			if(action.shouldConcat){
				let oldList = state.get('detailsTemp').toJS()
				newList = oldList.concat(action.receivedData.detailList)
			}else{
				newList = action.receivedData.detailList
			}
			const {creditAmount, debitAmount, realCreditAmount, realDebitAmount, balance, direction} = action.receivedData
			const QmData = {creditAmount, debitAmount, realCreditAmount, realDebitAmount, balance, direction}
			return state = state.set('detailsTemp', fromJS(newList))
								.setIn(['views','currentPage'], action.currentPage)
								.setIn(['views','pageCount'], action.receivedData.pages)
								.set('QcData', fromJS(action.receivedData.openDetail))
								.set('QmData', fromJS(QmData))
		},
		[ActionTypes.CHANGE_RELATIVE_DETAIL_COMMON_STRING]				: () => {
			return state = state.setIn([action.parent, action.position], action.value)
		},
		[ActionTypes.CHANGE_RELATIVE_MXB_REPORT_DIRECTION]             : () => {
			if(action.changeData){
				if (state.get('QcData')) {
					state = state.updateIn(['QcData', 'balance'], v => -v)
				}
				if (state.get('QmData')) {
					state = state.updateIn(['QmData', 'balance'], v => -v)
				}
			}
			return state.setIn(['views', 'chooseDirection'], action.direction)
		},
		[ActionTypes.CHANGE_SELECT_CONTACTS_CATEGORY]				: () => {
			return state = state.setIn(['views','selectRelativeItem'], fromJS(action.selectRelativeItem))
		},
		[ActionTypes.CHANGE_CHOOSE_CONTACTS_CATEGORY]				: () => {
			return state = state.setIn(['views','currentRelativeItem'], state.getIn(['views','selectRelativeItem']))
		},
		[ActionTypes.CHANGE_RELATIVE_MXB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},
		[ActionTypes.GET_RELATIVE_MXB_FROM_RELATIVE_RELATIVE_YEB]          : () => {
			return state = state.setIn(['views','selectRelativeItem'],action.selectItem)
								.setIn(['views','currentRelativeItem'],action.selectItem)
		},

	}[action.type] || (() => state))()
}
