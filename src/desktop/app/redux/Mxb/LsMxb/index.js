import { fromJS, toJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const lsmxState = fromJS({
    flags: {
        issuedate: '',
        endissuedate:'',
        main: 'duty',
        insertOrModify: 'insert',
        runningInsertOrModify: 'insert',
        paymentInsertOrModify: 'insert',
        payOrReceive: '收',
        accountAssModalShow: false,
        curCategory: '全部',//当前类别
        curAccountUuid: '全部',
        selectCategoryUuid:'',
        assId: '',
        accountName: '全部',
        transferaccountName: '全部',
        categoryName: '',
        allHappenAmount: 0,
        allHappenBalanceAmount: 0,
        allIncomeAmount: 0,
        allExpenseAmount: 0,
        allBalanceAmount: 0,
        amountType:'DETAIL_AMOUNT_TYPE_BALANCE',
        property: '',
        accountType:'全部',
        assCategory: '',
        acId: '',
        propertyCost:'',

        selectList: [],
        runningShowChild: [],
        showRunningInfo:{},
        PageTab:'business',//支付流水或业务流水
        paymentType:'LB_ZZ',//支付流水或结转流水类别
        isQuery:false,//支付流水是否未查看状态
        isQueryByBusiness:false,//业务流水是否未查看状态
        modify:false,//支付流水是否是修改状态
        indexList:[],//选中条目的索引数组
        "personAccumulationAmountchecked": true, // 公积金(个人部分)checked
        "personSocialSecurityAmountchecked": true, // 社保(个人部分)checked
        "incomeTaxAmountchecked": true, // 个人所得税checked
        "pzFailedButtonShow": false,
        defaultCategory:'init',
        selectCategory:''

    },
    chooseperiods: false,
    ass: {
		assid: '',
		assname: '',
		asscategory: '',
		handleAss: 'insertass'
	},
    // 流水类别
    runningCategory: [
        {
            'childList': []
        }
    ],
    detailsTemp:{

    },
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
    pageCount: 1

})


export default function handleLrb(state = lsmxState, action) {
	return ({
        [ActionTypes.INIT_LSMXB]                                      : () => lsmxState,
        [ActionTypes.GET_DETAIL_LIST]                                 : () => {
            if (action.getPeriod === 'true') {
                if(action.propertyCost){
                    state = state.setIn(['flags','propertyCost'],action.propertyCost)
                }
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            if(action.accountUuid && action.accountUuid !== '全部'){
              const PageTab = state.getIn(['flags','PageTab'])
              const valueList = action.accountUuid.split(Limit.TREE_JOIN_STR)
              if(PageTab == 'business'){
                state = state.setIn(['flags', 'accountName'],fromJS(valueList[1]))
              }else{
                state = state.setIn(['flags', 'transferAccountName'],fromJS(valueList[1]))
              }
            state = state.setIn(['flags', 'curAccountUuid'],fromJS(action.accountUuid))

            }else{
              state = state.setIn(['flags', 'accountName'],'全部')
              .setIn(['flags', 'transferAccountName'],'全部')
              .setIn(['flags', 'curAccountUuid'],'全部')
            }
            if(action.categoryType){
              state = state.setIn(['flags','paymentType'],action.categoryType)
            }
            if(action.accountType){
              state = state.setIn(['flags','accountType'],action.accountType)
            }
            if(action.endissuedate){
                state = state.set('chooseperiods',true)
            }
            return state.set('detailsTemp',fromJS(action.receivedData))
                  .set('pageCount',action.pageCount)
                  .set('currentPage',action.currentPage)
                  .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                  .setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
                  .setIn(['flags', 'curCategory'],fromJS(action.categorValue))
                  .setIn(['flags', 'property'],action.property)
                  .setIn(['flags', 'amountType'],action.amountType)
                  .setIn(['flags', 'allHappenAmount'],fromJS(action.allHappenAmount))
                  .setIn(['flags', 'allHappenBalanceAmount'],fromJS(action.allHappenBalanceAmount))
                  .setIn(['flags', 'allIncomeAmount'],fromJS(action.allIncomeAmount))
                  .setIn(['flags', 'allExpenseAmount'],fromJS(action.allExpenseAmount))
                  .setIn(['flags', 'allBalanceAmount'],fromJS(action.allBalanceAmount))
        },
        [ActionTypes.INIT_DETAIL_ACCOUNT_LIST]                        : () => {
            state = state.set('hideCategoryList', fromJS(action.hideCategoryList))

            return state
        },
        [ActionTypes.GET_RUNNING_CATEGORY_DETAIL]                     : () => {
            let selectList = []
            action.receivedData.result.forEach(v => selectList.push(v.uuid)) //默认展开一二级类别
            if(action.accountUuid && action.accountUuid !== '全部'){
              const PageTab = state.getIn(['flags','PageTab'])
              const valueList = action.accountUuid.split(Limit.TREE_JOIN_STR)
              if(PageTab == 'business'){
                state = state.setIn(['flags', 'accountName'],fromJS(valueList[1]))
              }else{
                state = state.setIn(['flags', 'transferAccountName'],fromJS(valueList[1]))
              }
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

        [ActionTypes.CHANGE_DETAIL_ACCOUNT_COMMON_STRING]             : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        [ActionTypes.CHANGE_LSMX_MORE_PERIODS] 	 : () => {
			if (action.chooseperiods) {
				return state.set('chooseperiods', true)
			} else {
				return state.update('chooseperiods', v => !v)
			}
		}

	}[action.type] || (() => state))()
}
