import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const zhmxbState = fromJS({
	issues:[{
		value:'',
		key:''
	}],
	currentAcid: '',
	currentAss: '',

	detailsTemp:[],
	QcData:{},
	flags: {
		issuedate:'',
		endissuedate:'',
		accountName:'',//账户名
		curAccountUuid:'',
		paymentType:'',
		categoryType:'全部',//类别名称
		accountType:'请选择账户',//账户名称
		curCategory:'',//当前类别Uuid
		property:'',//方向
		amountType:'DETAIL_AMOUNT_TYPE_HAPPEN',//发生、收付
		allHappenAmount: 0,
        allHappenBalanceAmount: 0,
        allIncomeAmount: 0,
        allExpenseAmount: 0,
        allBalanceAmount: 0,
		menuLeftIdx: 0,
		menuType: '',
		bussinessShowChild:[]
	},
	pageCount:0,
	currentPage:1,

	runningCategory:[],
	accountList:[],
	ylDataList: []

})

export default function handleMxb(state = zhmxbState, action) {
	return ({
		[ActionTypes.INIT_MXB]						: () => zhmxbState,
		[ActionTypes.GET_MXB_ACLIST]				: () => state.set('mxbAclist', fromJS(action.receivedData.data)),

		[ActionTypes.REVERSE_LEDGER_JV_LIST]		: () => state.updateIn(['ledger', 'jvlist'], v => v.reverse()),
		[ActionTypes.CHANGE_MXB_BEGIN_DATE]			: () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},

		[ActionTypes.GET_ZH_DETAIL_LIST]  : () => {
			if (action.getPeriod === 'true') {
				const period = action.period

				state = state.set('period',fromJS(action.period))
							.set('issues',fromJS(action.issues))
			}
			let newList = []
			const receivedList = action.receivedData.filter(item => {
				if(!item.uuid){
					state = state.set('QcData',item)
				}
				return item.uuid
			})

			if(action.shouldConcat){
				let oldList = state.get('detailsTemp').toJS()
				newList = oldList.concat(receivedList)
			}else{
				newList = receivedList
			}
			let ylDataList = []
			newList.forEach((v, i)=> {
				const stringList = JSON.stringify(ylDataList)
				if(JSON.stringify(ylDataList).indexOf(JSON.stringify(v['uuid'])) === -1){
					ylDataList.push({idx: i, uuid: v['uuid']})
				}
			})
			if(action.categoryType){
				state = state.setIn(['flags','categoryType'],action.categoryType)
			}
			if(action.accountType){
				state = state.setIn(['flags','accountType'],action.accountType)
			}
			return state.set('detailsTemp',fromJS(newList))
						.set('currentPage',action.currentPage)
						.set('pageCount',action.pageCount)
						.setIn(['flags', 'issuedate'],fromJS(action.issuedate))
						.setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
						.setIn(['flags', 'curCategory'],fromJS(action.categorValue))
						.setIn(['flags', 'curAccountUuid'],fromJS(action.accountUuid))
						.setIn(['flags', 'property'],action.property)
						.setIn(['flags', 'allHappenAmount'],fromJS(action.allHappenAmount))
						.setIn(['flags', 'allHappenBalanceAmount'],fromJS(action.allHappenBalanceAmount))
						.setIn(['flags', 'allIncomeAmount'],fromJS(action.allIncomeAmount))
						.setIn(['flags', 'allExpenseAmount'],fromJS(action.allExpenseAmount))
						.setIn(['flags', 'allBalanceAmount'],fromJS(action.allBalanceAmount))
						.setIn(['flags', 'menuType'],'')
						.set('ylDataList', fromJS(ylDataList))
		},
		[ActionTypes.GET_ZH_RUNNING_CATEGORY_DETAIL]                     : () => {
            let selectList = []
            action.receivedData.result.forEach(v => selectList.push(v.uuid)) //默认展开一二级类别
			if(action.accountUuid && action.accountUuid !== '全部'){
				const valueList = action.accountUuid.split(Limit.TREE_JOIN_STR)
				state = state.setIn(['flags', 'accountName'],fromJS(valueList[1]))
							.setIn(['flags', 'curAccountUuid'],fromJS(action.accountUuid))
			}else{
				state = state.setIn(['flags', 'accountName'],'全部')
							.setIn(['flags', 'curAccountUuid'],'全部')
			}
			let categoryList = []
			const loop = (data, children) => data.forEach((item) => {
                if (item.get('childList') && item.get('childList').size) {//有子集
					children.push({
                        value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}`,
                        label: item.get('name'),
						children: getChild(item.get('childList'))
                    })
                } else {//无子集
                    children.push({
                        value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}`,
                        label: item.get('name'),
						children: []
                    })
                }
            })

            const getChild = (dataList) => {
                let child = []
                loop(dataList, child)
                return child
            }
			const topParent = action.receivedData.result[0]
			if(action.receivedData.result.length > 0 && topParent.name === '全部'){
				categoryList.push({
					value: `${topParent.uuid}${Limit.TREE_JOIN_STR}${topParent.name}${Limit.TREE_JOIN_STR}${topParent.propertyCost}`,
					label: topParent.name,
					children: [{
						value: `${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}${topParent.propertyCost}`,
						label:'全部'
					}]
				})
				const topChild = action.receivedData.result[0].childList
				fromJS(topChild).forEach(v => {
					if (v.get('childList').size) {
						// let childList = getChild(v.get('childList'))
						const firstChild = [{
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: getChild(v.get('childList'))
						}]
						// const newChildList = firstChild.concat(childList)
						categoryList.push({
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: firstChild
						})
					} else {
						categoryList.push({
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: [{
								value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
								label: v.get('name')
							}]
						})
					}
				})
			}else{
				fromJS(action.receivedData.result).forEach(v => {
					if (v.get('childList').size) {
						let childList = getChild(v.get('childList'))
						const firstChild = [{
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
						}]
						const newChildList = firstChild.concat(childList)

						categoryList.push({
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: newChildList
						})
					} else {
						categoryList.push({
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: [{
								value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
								label: v.get('name')
							}]
						})
					}
				})
			}
			return state.set('runningCategory', fromJS(categoryList))
                        .setIn(['flags', 'runningShowChild'], fromJS(selectList))

        },
		[ActionTypes.GET_RUNNING_CATEGORY_DETAIL]                     : () => {
			let selectList = []
			action.receivedData.result.forEach(v => selectList.push(v.uuid)) //默认展开一二级类别
			if(action.accountUuid && action.accountUuid !== '全部'){
				const valueList = action.accountUuid.split(Limit.TREE_JOIN_STR)
				state = state.setIn(['flags', 'accountName'],fromJS(valueList[1]))
				.setIn(['flags', 'curAccountUuid'],fromJS(action.accountUuid))
			}else{
				state = state.setIn(['flags', 'accountName'],'全部')
				.setIn(['flags', 'curAccountUuid'],'全部')
			}
			let categoryList = []
			const loop = (data, children) => data.forEach((item) => {
                if (item.get('childList') && item.get('childList').size) {//有子集
					children.push({
                        value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}`,
                        label: item.get('name'),
						children: getChild(item.get('childList'))
                    })
                } else {//无子集
                    children.push({
                        value: `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('name')}`,
                        label: item.get('name'),
						children: []
                    })
                }
            })

            const getChild = (dataList) => {
                let child = []
                loop(dataList, child)
                return child
            }
			const topParent = action.receivedData.result[0]
			if(action.receivedData.result.length > 0 && topParent.name === '全部'){
				categoryList.push({
					value: `${topParent.uuid}${Limit.TREE_JOIN_STR}${topParent.name}${Limit.TREE_JOIN_STR}${topParent.propertyCost}`,
					label: topParent.name,
					children: [{
						value: `${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}${topParent.propertyCost}`,
						label:'全部'
					}]
				})
				const topChild = action.receivedData.result[0].childList
				fromJS(topChild).forEach(v => {
					if (v.get('childList').size) {
						let childList = getChild(v.get('childList'))
						childList[0] = {
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
						}
						categoryList.push({
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: childList
						})
					} else {
						categoryList.push({
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: [{
								value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
								label: v.get('name')
							}]
						})
					}
				})
			}else{
				fromJS(action.receivedData.result).forEach(v => {
					if (v.get('childList').size) {
						let childList = getChild(v.get('childList'))
						childList[0] = {
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
						}
						categoryList.push({
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: childList
						})
					} else {
						categoryList.push({
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
							label: v.get('name'),
							children: [{
								value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
								label: v.get('name')
							}]
						})
					}
				})
			}
			return state.set('runningCategory', fromJS(categoryList))
		},
		[ActionTypes.ZHMX_GET_RUNNING_ACCOUNT]                     : () => {
            return state.set('accountList', fromJS(action.receivedData.resultList[0].childList))
        },
		[ActionTypes.CHANGE_ZHMX_COMMON_STRING]       : () => {
			if (action.placeArr) {
				state = state.setIn(action.placeArr, action.value)
			}
			if (action.place) {
				state = state.set(action.place, action.value)
			}
			return state
		},
		[ActionTypes.ZHMX_MENU_DATA]       : () => {
			return state.setIn(['flags', action.dataType], action.value)
		},
		[ActionTypes.ZHMX_DETAIL_TRIANGLE_SWITCH]          : () => {
            const showLowerList = state.getIn(['flags', 'bussinessShowChild'])
            if (!action.showChild) {
                // 原来不显示
                const newShowLowerList = showLowerList.push(action.uuid)
                return state.setIn(['flags', 'bussinessShowChild'], newShowLowerList)
            } else {
                // 原来显示
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                return state.setIn(['flags', 'bussinessShowChild'], newShowLowerList)
            }
        },
	}[action.type] || (() => state))()
}
