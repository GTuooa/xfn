import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const lsmxbState = fromJS({
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
		categoryType:'请选择类别',//类别名称
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
		menuType: ''
	},
	pageCount:0,
	currentPage:1,

	runningCategory:[],
	accountList:[],
	ylDataList: []

})

export default function handleMxb(state = lsmxbState, action) {
	return ({
		[ActionTypes.INIT_LS_MXB]					: () => lsmxbState,
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

		[ActionTypes.GET_DETAIL_LIST]  : () => {
			if (action.getPeriod === 'true') {
				const period = action.period
				const firstyear = Number(period.firstyear)
				const lastyear = Number(period.lastyear)
				const firstmonth = Number(period.firstmonth)
				const lastmonth = Number(period.lastmonth)
				const issues= []

				for (let year = lastyear; year >= firstyear; -- year) {
					if (firstyear === 0)
						break
					for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month) {
						issues.push({value:`${year}-${month < 10 ? '0' + month : month}`,key:`${year}年第${month < 10 ? '0' + month : month}期`})
					}
				}
				state = state.set('period',fromJS(action.period))
							.set('issues',fromJS(issues))
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
				ylDataList.push({idx: i, uuid: v['uuid']})
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
	              .setIn(['flags', 'curCategory'],fromJS(action.categorValue))
				  .setIn(['flags', 'curAccountUuid'],fromJS(action.accountUuid))
	              .setIn(['flags', 'property'],action.property)
	              .setIn(['flags', 'amountType'],action.amountType)
	              .setIn(['flags', 'allHappenAmount'],fromJS(action.allHappenAmount))
	              .setIn(['flags', 'allHappenBalanceAmount'],fromJS(action.allHappenBalanceAmount))
	              .setIn(['flags', 'allIncomeAmount'],fromJS(action.allIncomeAmount))
	           	  .setIn(['flags', 'allExpenseAmount'],fromJS(action.allExpenseAmount))
	           	  .setIn(['flags', 'allBalanceAmount'],fromJS(action.allBalanceAmount))
				  .set('ylDataList', fromJS(ylDataList))
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
			if(action.receivedData.result.length > 0 && action.amountType == 'DETAIL_AMOUNT_TYPE_BALANCE' && topParent.name === '全部'){
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
		[ActionTypes.LSMX_GET_RUNNING_ACCOUNT]                     : () => {
            return state.set('accountList', fromJS(action.receivedData.resultList[0].childList))
        },
		[ActionTypes.CHANGE_LSMX_COMMON_STRING]       : () => {
			if (action.placeArr) {
				state = state.setIn(action.placeArr, action.value)
			}
			if (action.place) {
				state = state.set(action.place, action.value)
			}
			return state
		},
		[ActionTypes.LSMX_MENU_DATA]       : () => {
			return state.setIn(['flags', action.dataType], action.value)
		}
	}[action.type] || (() => state))()
}
