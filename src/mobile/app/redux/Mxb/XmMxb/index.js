import { fromJS, toJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const xmmxState = fromJS({
    flags: {
        issuedate: '',
        endissuedate: '',
        insertOrModify: 'insert',
        runningInsertOrModify: 'insert',
        paymentInsertOrModify: 'insert',
        property: '',
        accountType:'全部',
        assCategory: '',
        acId: '',
        propertyCost:'',
        detailsTemp:[],
        selectList: [],
        selectCategory:'',
        projectTypeTree:[],
        runningCategory:[
            {
                uuid:'',
                name:'全部',
            }
        ],
        xmType:'损益项目',
        amountType:'DETAIL_AMOUNT_TYPE_HAPPEN',
        amountTypeName:'收支发生额',
        currentPage: 1,
        pageCount: 1,
        menuLeftIdx: 0,
        lbmenuLeftIdx: 0,
        curCardName:'选择卡片',
        categoryName:'全部',
        selectedIndex: 0

    },
    ylDataList:[],
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


})


export default function handleLrb(state = xmmxState, action) {
	return ({
        [ActionTypes.INIT_XMMXB]                                      : () => xmmxState,
        [ActionTypes.INIT_ZH_DETAIL_ACCOUNT_LIST]                                  : () => {
            state = state.set('hideCategoryList', fromJS(action.hideCategoryList))

            return state
        },
        [ActionTypes.GET_ZH_RUNNING_CATEGORY_DETAIL]                     : () => {
            let selectList = []
            action.receivedData.result.forEach(v => selectList.push(v.uuid)) //默认展开一二级类别
            if(action.accountUuid && action.accountUuid !== '全部'){
              const PageTab = state.getIn(['flags','PageTab'])
              const valueList = action.accountUuid.split(Limit.TREE_JOIN_STR)
              // if(PageTab == 'business'){
                state = state.setIn(['flags', 'accountName'],fromJS(valueList[1]))
              // }else{
              //   state = state.setIn(['flags', 'transferAccountName'],fromJS(valueList[1]))
              // }
            state = state.setIn(['flags', 'curAccountUuid'],fromJS(action.accountUuid))

            }else{
              state = state.setIn(['flags', 'accountName'],'全部')
              .setIn(['flags', 'transferAccountName'],'全部')
              .setIn(['flags', 'curAccountUuid'],'全部')
            }
            if(action.defaultCategory){
                if(action.receivedData.result[0].uuid){
                    state = state.setIn(['flags','defaultCategory'],action.receivedData.result[0].uuid+Limit.TREE_JOIN_STR+action.receivedData.result[0].name+Limit.TREE_JOIN_STR+action.receivedData.result[0].categoryType+Limit.TREE_JOIN_STR+action.receivedData.result[0].propertyCost)
                }else{
                    state = state.setIn(['flags','defaultCategory'],'init')
                }
            }else{
                state = state.setIn(['flags','defaultCategory'],'')
            }
            return state.set('runningCategory', fromJS(action.receivedData.result))
                        .setIn(['flags', 'runningShowChild'], fromJS(selectList))

        },

        [ActionTypes.CHANGE_XM_DETAIL_ACCOUNT_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        // [ActionTypes.CHANGE_ZHMX_MORE_PERIODS] 	 : () => {
		// 	if (action.chooseperiods) {
		// 		return state.set('chooseperiods', true)
		// 	} else {
		// 		return state.update('chooseperiods', v => !v)
		// 	}
		// },
        [ActionTypes.ACCOUNTCONF_DETAIL_TRIANGLE_SWITCH]          : () => {
            const showLowerList = state.getIn(['flags', 'runningShowChild'])
            if (!action.showChild) {
                // 原来不显示
                const newShowLowerList = showLowerList.push(action.uuid)
                return state.setIn(['flags', 'runningShowChild'], newShowLowerList)
            } else {
                // 原来显示
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                return state.setIn(['flags', 'runningShowChild'], newShowLowerList)
            }
        },
        [ActionTypes.GET_XMMX_PROJECT_LIST]                         :() => {
            if (action.getPeriod === 'true') {
                if (action.endissuedate) {
                    state = state.setIn(['flags','chooseperiods'],true)
                }
                if (action.categoryUuid) {
                    state = state.setIn(['flags','showRunningType'],true)
                }
                state = state.setIn(['flags','period'],fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            let newList = []
            if(action.shouldConcat){
				let oldList = state.getIn(['flags','detailsTemp']).toJS()
				newList = oldList.concat(action.detailList)
			}else{
				newList = action.detailList
			}
            let ylDataList = []
			newList.forEach((v, i)=> {
				const stringList = JSON.stringify(ylDataList)
				if(JSON.stringify(ylDataList).indexOf(JSON.stringify(v['uuid'])) === -1){
					ylDataList.push({idx: i, uuid: v['uuid']})
				}
			})
            return state.setIn(['flags','detailsTemp'],fromJS(action.detailList))
                        .setIn(['flags','debitSum'],action.debitSum)
                        .setIn(['flags','creditSum'],action.creditSum)
                        .setIn(['flags','total'],action.total)
                        .setIn(['flags','issuedate'],action.issuedate)
                        .setIn(['flags','endissuedate'],action.endissuedate)
                        .setIn(['flags','curCardUuid'],action.curCardUuid)
                        .setIn(['flags','isTop'],action.isTop)
                        .setIn(['flags','categoryUuid'],action.categoryUuid)
                        .setIn(['flags','propertyCost'],action.propertyCost)
                        .setIn(['flags','currentPage'],action.pageNum)
                        .setIn(['flags','cardPageNum'],action.cardPageNum)
                        .setIn(['flags','pageCount'],action.pages)
                        .setIn(['flags','amountType'],action.amountType)
                        .setIn(['flags','typeUuid'],action.typeUuid)
                        .set('ylDataList',fromJS(ylDataList))

        },
        [ActionTypes.CLEAR_XM_STATE]          :() => {
            return state.setIn(['flags','detailsTemp'],fromJS([]))
                        .setIn(['flags','cardList'],fromJS([]))
                        .setIn(['flags','runningCategory'],xmmxState.getIn(['flags','runningCategory']))
                        .setIn(['flags','debitSum'],'')
                        .setIn(['flags','creditSum'],'')
                        .setIn(['flags','total'],'')
        },
        [ActionTypes.XMMX_MENU_DATA]       : () => {
			return state.setIn(['flags', action.dataType], action.value)
		}


	}[action.type] || (() => state))()
}
