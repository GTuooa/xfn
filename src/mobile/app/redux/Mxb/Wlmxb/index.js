import { fromJS, toJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const wlmxState = fromJS({
    flags: {
        issuedate: '',
        endissuedate: '',
        categoryName: '全部',
        curCardUuid: '',
        allHappenAmount: 0,
        allHappenBalanceAmount: 0,
        allIncomeAmount: 0,
        allExpenseAmount: 0,
        allBalanceAmount: 0,

        selectList: [],
        runningShowChild: [],
        showRunningInfo:{},
        selectCategory:'',
        wlRelate:'3',
        wlType:'全部',
        typeUuid:'',
        isTop:'',
        categoryUuid: '',
        selectedCard:'',
		menuLeftIdx:0,
        lbMenuLeftIdx:0,
        curCardName:'请选择卡片'
    },
    cardList:[

    ],
    chooseperiods: false,

  // 流水类别
  runningCategory: [
      {children:[]}
  ],
    detailsTemp:[

    ],
contactTypeTree: [
],
    period: {
      closedmonth:"",
      closedyear:"",
      firstmonth:"",
      firstyear:"",
      lastmonth:"",
      lastyear:"",
    },
    //日期列表
    issues:[],
    // 分页
    currentPage: 1,
    pageCount: 0,
    cardPages: 0,
    cardCurPage: 1,
    QcData:{
        direction: '应收'
    },
    ylDataList:[]

})


export default function handleLrb(state = wlmxState, action) {
	return ({
        [ActionTypes.INIT_WLMXB]                                      : () => wlmxState,
        [ActionTypes.GET_WLMX_DETAIL_LIST]  : () => {
            if (action.getPeriod === 'true') {
                const period = action.period
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            let newList = []
            const receivedList = action.receivedData.filter(item => {
				if(!item.uuid){
					state = state.set('QcData',fromJS(item))
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
            if(action.endissuedate){
                state = state.set('chooseperiods',true)
            }
            // typeUuid可以为空
            if(action.typeUuid !== undefined){
                state = state.setIn(['flags', 'typeUuid'],action.typeUuid)
                            .setIn(['flags', 'wlType'],action.wlType)
            }else{
                state = state.setIn(['flags', 'wlType'],state.getIn(['flags', 'wlType']))
            }
            if(action.curCardName){
                state = state.setIn(['flags', 'curCardName'],action.curCardName)
            }
            return state.set('detailsTemp',fromJS(newList))
                  .set('pageCount',action.pageNum)
                  .set('currentPage',action.curPage)
                  .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                  .setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
                  .setIn(['flags', 'curCardUuid'],fromJS(action.curCardUuid))
                  .setIn(['flags', 'allHappenIncomeAmount'],fromJS(action.allHappenIncomeAmount))
                  .setIn(['flags', 'allHappenExpenseAmount'],fromJS(action.allHappenExpenseAmount))
                  .setIn(['flags', 'allPaymentIncomeAmount'],fromJS(action.allPaymentIncomeAmount))
                  .setIn(['flags', 'allPaymentExpenseAmount'],fromJS(action.allPaymentExpenseAmount))
                  .setIn(['flags', 'allBalanceAmount'],fromJS(action.allBalanceAmount))
                  .setIn(['flags', 'direction'],fromJS(action.direction))
                  .setIn(['flags', 'wlRelate'],fromJS(action.wlRelate))
                  .set('ylDataList', fromJS(ylDataList))
        },

        [ActionTypes.CHANGE_WLMX_DETAIL_ACCOUNT_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        [ActionTypes.CHANGE_WLMX_MORE_PERIODS] 	 : () => {
			if (action.chooseperiods) {
				return state.set('chooseperiods', true)
			} else {
				return state.update('chooseperiods', v => !v)
			}
		},
        [ActionTypes.GET_WLMX_TYPE_LIST] 	 : () => {
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
        [ActionTypes.GET_WLMX_CARD_LIST] 	 : () => {
            if (action.getPeriod === 'true') {
                const period = action.period

                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }

            return state = state.set('cardList',fromJS(action.receivedData))
                                .set('cardPages',fromJS(action.cardPages))
                                .set('cardCurPage',fromJS(action.cardCurPage))
        },
        [ActionTypes.GET_WLMX_RUNNING_CATEGORY] 	 : () => {
            if (action.getPeriod === 'true') {
                const period = action.period

                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
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
			const topParent = action.receivedData[0]
			if(action.receivedData.length > 0 && topParent.name === '全部'){
				categoryList.push({
					value: `${topParent.uuid}${Limit.TREE_JOIN_STR}${topParent.name}${Limit.TREE_JOIN_STR}${topParent.propertyCost}`,
					label: topParent.name,
					children: [{
						value: `${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}${topParent.propertyCost}`,
						label:'全部'
					}]
				})
				const topChild = action.receivedData[0].childList
				fromJS(topChild).forEach(v => {
                    if (v.get('childList').size) {
						let childList = getChild(v.get('childList'))
                        const firstChild = [{
                            value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                            label: v.get('name'),
                            children: childList
                        }]

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
				fromJS(action.receivedData).forEach(v => {
                    if (v.get('childList').size) {
                        let childList = getChild(v.get('childList'))
                        const firstChild = [{
                            value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('propertyCost')}`,
                            label: v.get('name'),
                            children: childList
                        }]
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
			}

            return state = state.set('runningCategory',fromJS(categoryList))
        },
        [ActionTypes.WLMX_MENU_DATA]       : () => {
			return state.setIn(['flags', action.dataType], action.value)
		}
	}[action.type] || (() => state))()
}
