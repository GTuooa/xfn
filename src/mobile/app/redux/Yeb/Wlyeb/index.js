import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const wlyebState = fromJS({
	flags: {
		wlRelate:'',
		wlOnlyRelate: '',
		wlType:'全部',
		typeUuid:'',
		isTop:'',
		wlRelationship:[],
		selectList: [],
		allBeginIncomeAmount: 0,
		allBeginExpenseAmount: 0,
		allHappenIncomeAmount: 0,
		allHappenExpenseAmount: 0,
		allPaymentIncomeAmount: 0,
		allPaymentExpenseAmount: 0,
		allBalanceIncomeAmount: 0,
		allBalanceExpenseAmount: 0,
		menuType:'',
		menuLeftIdx:0,
		lbMenuLeftIdx:0
	},
	issues:[{
		value:'',
		key:''
	}],
	issuedate: '',
	endissuedate:'',
	runningShowChild: [],

	showedLowerAcIdList: [],
	balanceTemp: [],
    contactTypeTree: [
        {children:[],value:''}
    ],

	relationList:[],
	// 分页
    currentPage: 1,
    pageCount: 1,
    runningCount: 0
})

export default function handleLsyeb(state = wlyebState, action) {
	return ({
		[ActionTypes.INIT_WLYEB]				: () => wlyebState,
		[ActionTypes.GET_WL_BALANCE_LIST]  : () => {
            if(action.isReflash) {
                // yezi
                state = state.set('balanceTemp', wlyebState)
            }

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


            let selectList = []
			const looplist = (data) => data.map((item,i) => {
                if(item.childList && item.childList.length){
                    looplist(item.childList)
                }else{
                    selectList.push(item.uuid)
                }
            })
            if(action.typeUuid !== '' && action.wlRelate === '' && action.count > 500){
                action.receivedData && selectList.push(action.receivedData[0].uuid)
            }else{
                action.receivedData && looplist(action.receivedData)
                // action.receivedData && action.receivedData.forEach(v => selectList.push(v.uuid))
            }
            return state.set('balanceTemp',fromJS(newList))
						.set('issuedate',fromJS(action.issuedate))
						.set('endissuedate',fromJS(action.endissuedate))
						.set('allBeginAmount',action.allBeginAmount)
						.set('allExpenseAmount',action.allExpenseAmount)
						.set('allIncomeAmount',action.allIncomeAmount)
						.set('allBalanceAmount',action.allBalanceAmount)
						.set('typeUuid',action.typeUuid)
						.setIn(['flags', 'wlType'],action.wlType)
						.setIn(['flags', 'isTop'],action.isTop)
						.setIn(['flags', 'wlRelate'],action.wlRelate)
						// .setIn(['balanceTemp', 'childList'],fromJS(action.receivedData))
						.setIn(['flags', 'runningShowChild'],fromJS(selectList))
						.set('currentPage',action.currentPage)
						.set('pageCount',action.pages)
						.set('runningCount',action.count)
						.setIn(['flags', 'allBeginIncomeAmount'],action.allBeginIncomeAmount)
						.setIn(['flags', 'allBeginExpenseAmount'],action.allBeginExpenseAmount)
						.setIn(['flags', 'allHappenIncomeAmount'],action.allHappenIncomeAmount)
						.setIn(['flags', 'allHappenExpenseAmount'],action.allHappenExpenseAmount)
						.setIn(['flags', 'allPaymentIncomeAmount'],action.allPaymentIncomeAmount)
						.setIn(['flags', 'allPaymentExpenseAmount'],action.allPaymentExpenseAmount)
						.setIn(['flags', 'allBalanceIncomeAmount'],action.allBalanceIncomeAmount)
						.setIn(['flags', 'allBalanceExpenseAmount'],action.allBalanceExpenseAmount)
						.set('ylDataList', fromJS(ylDataList))
    },
		// 流水类别是否显示下级
		[ActionTypes.ACCOUNTCONF_WL_BALANCE_TRIANGLE_SWITCH]          : () => {
			const showLowerList = state.get('runningShowChild')
			if (!action.showChild) {
				// 原来不显示
				const newShowLowerList = showLowerList.push(action.uuid)
				return state.set('runningShowChild', newShowLowerList)
			} else {
				// 原来显示
				const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
				return state.set('runningShowChild', newShowLowerList)
			}
		},
		[ActionTypes.CHANGE_WLYE_MORE_PERIODS] 	 : () => {
			if (action.chooseperiods) {
				return state.set('chooseperiods', true)
			} else {
				return state.update('chooseperiods', v => !v)
			}
		},
		[ActionTypes.GET_WL_CONTACTS] 	 : () => {

			return state = state.setIn(['flags','wlRelate'],action.value)
		},
		[ActionTypes.CHANGE_WLYEB_COMMON_STRING] 	 : () => {

			return state = state.setIn(action.place,action.value)
		},
		[ActionTypes.GET_WL_TYPE_LIST] 	 : () => {
			if (action.getPeriod === 'true') {
				const period = action.period

				state = state.set('period',fromJS(action.period))
							.set('issues',fromJS(action.issues))
			}

			let categoryList = [{
				value: `${Limit.TREE_JOIN_STR}全部`,
				label: '全部',
				children: [{
					value: `${Limit.TREE_JOIN_STR}全部`,
					label: '全部',
				}]
			}]
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
			fromJS(action.receivedData).forEach(v => {
				if (v.get('childList').size) {
					let childList = getChild(v.get('childList'))
					const firstChild = [{
						value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
						label: v.get('name'),
						children:childList
					}]

					categoryList.push({
						value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
						label: v.get('name'),
						children: firstChild
					})
				} else {
					categoryList.push({
						value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
						label: v.get('name'),
						children: [{
							value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('top')}`,
							label: v.get('name')
						}]
					})
				}
			})

			return state = state.setIn(['contactTypeTree'],fromJS(categoryList))
		},
		[ActionTypes.GET_WL_RELATION_LIST] 	 : () => {
			if (action.getPeriod === 'true') {
				const period = action.period

				state = state.set('period',fromJS(action.period))
							.set('issues',fromJS(action.issues))
			}
			if(action.receivedData.length < 3){
				state = state.setIn(['flags','wlRelate'],'')
			}
			return state = state.setIn(['flags','wlRelationship'],fromJS(action.receivedData))

		},
		[ActionTypes.WLYE_MENU_DATA]       : () => {
			return state.setIn(['flags', action.dataType], action.value)
		}


	}[action.type] || (() => state))()
}
