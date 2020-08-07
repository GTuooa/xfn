import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

const lsyeState = fromJS({
  flags: {
      issuedate: '',
      endissuedate:'',
      // bool， 已发生， 未发生
      // duty， reality， waitFor
      // '权责发生制', '收付实现制', '收付管理'
      main: 'duty',
      mainWater:'allWater',

        insertOrModify: 'insert',
        runningInsertOrModify: 'insert',
        payOrReceive: '收',

        runningSelect: [],

        runningShowChild: [],

        accountAssModalShow: false,

      curCategory: '全部',
      curAccountUuid: '',
      accountName:'全部',
      assId: '',
      assCategory: '',
      acId: '',
      selectList: [],
      showRunningInfo:{},

  },
  chooseperiods: false,
  balanceTemp: {

    },
    runningTemp: {
        // “经营性收入”,“其他收入”,“经营性支出”,“其他支出”,“转账”
        // income, otherIncome, pay, otherPay, virement
        "property": "",
        "uuid": "",
        "name": "",
        "parentUuid": "",
        "parentName": "",
        "runningAbstract": "",
        "propertyPay": "", // 薪酬属性
        "propertyAssets": "", // 资产属性
        "propertyCarryover": "", //成本属性
        "propertyCostList": [], //费用属性
        "propertyTax": "", // 税费属性
        "categoryType": "",//流水类别
        "propertyInvest": "",// 投资属性
        // "acId": "",
        // "acFullName": "",
        // "assCategoryList": [],
        "acList": [],
        // 科目是否可用
        canDelete: true,
        beSpecial: false, //是否属于业务收入和成本支出
        acAvailable: true,

        // 营业收入
        "acBusinessIncome": {
            "incomeAc": [],  // 收入 科目列表
            "incomeList": [],  // 收入 科目辅助核算
            "receivablesAc": [],  // 应收 科目列表
            "receivablesList": [],  // 应收 科目辅助核算
            "inAdvanceAc": [],  // 定金 科目列表
            "inAdvanceList": [],  // 定金 科目辅助核算
            "stockAc": [],  // 存货 科目列表
            "stockList": [],  // 存货 科目辅助核算
            "carryoverAc": [],  // 成本 科目列表
            "carryoverList": [],  // 成本 科目辅助核算
            "beManagemented": false,  // 是否收付管理
            "beDeposited": false,  // 是否定金管理
            "beCarryover": false  // 是否结转成本
        },
        // 营业支出
        "acBusinessExpense": {
            "payAc": [],  // 支出 科目列表
            "payList": [],  // 支出 科目辅助核算
            "deliveryAc": [],  // 应付 科目列表
            "deliveryList": [],  // 应付 科目辅助核算
            "inAdvanceAc": [],  // 定金 科目列表
            "inAdvanceList": [],  // 定金 科目辅助核算
            "beManagemented": false,  // 是否收付管理
            "beDeposited": false,  // 是否定金管理
        },

        // 营业外收入
        "acBusinessOutIncome": {
            "relationAc": [],  // 关联 科目列表
            "relationList": [],  // 关联 科目辅助核算
            "receivablesAc": [],  // 应收 科目列表
            "receivablesList": [],  // 应收 科目辅助核算
            "beManagemented": false,  // 是否收付管理
        },

        // 营业外支出
        "acBusinessOutExpense": {
            "relationAc": [],  // 关联 科目列表
            "relationList": [],  // 关联 科目辅助核算
            "deliveryAc": [],  // 应付 科目列表
            "deliveryList": [],  // 应付 科目辅助核算
            "beManagemented": false,  // 是否收付管理
        },
        //费用支出
        "acCost": {
            "saleAc": [],  // 类别uuid
            // {  // 销售科目列表
            //     "categoryUuid": "",  // 类别uuid
            //     "acId": "",  // 科目ID
            //     "acKey": "",  // 科目key
            //     "type": "",  // 科目类型
            //     "acFullName": "",  // 科目全称
            //     "assCategoryList": [""],  // 辅助核算类别列表
            // }
            "saleList": [{  // 销售科目辅助核算列表
                "assId": "",  // 辅助核算ID
                "assName": "",  // 辅助核算名称
                "assCategory": [""],  // 辅助核算类别
            }],  // 类别uuid
            "manageAc": [],  // 管理科目列表
            "manageList": [],  // 管理科目辅助核算
            "financeAc": [],  // 财务科目列表
            "financeList": [],  // 财务科目辅助核算
            "beManagemented": false,  // 是否收付管理
            "deliveryAc": [],  // 应付科目列表
            "deliveryList": [],
        },
        //薪酬支出
        "acPayment": {
            "saleAc": [],  // 销售 科目列表
            "saleList": [],  // 销售 科目辅助核算
            "manageAc": [],  // 管理 科目列表
            "manageList": [],  // 管理 科目辅助核算
            "accruedAc": [],  // 计提 科目列表
            "accruedList": [],  // 计提 科目辅助核算
            "fundAc": [],  // 公积金 科目列表
            "fundList": [],  // 公积金 科目辅助核算
            "socialSecurityAc": [],  // 社保 科目列表
            "socialSecurityList": [],  // 社保 科目辅助核算
            "incomeTaxAc": [],  // 个人所得税 科目列表
            "incomeTaxList": [],  // 个人所得税 科目辅助核算
            "welfareAc": [],  // 福利 科目列表
            "welfareList": [],  // 福利 科目辅助核算
            "beAccrued": false,  // 是否计提
            "beWithholding": false,  // 是否代扣代缴
            "beWelfare": false  // 是否过渡福利费
        },
        // 税费
        "acTax": {
            "accruedAc": [],  // 计提 科目列表
            "accruedList": [],  // 计提 科目辅助核算
            "payAc": [],  // 缴纳 科目列表
            "payList": [],  // 缴纳 科目辅助核算
            "turnOutAc": [],  // 转出 科目列表
            "turnOutList": [],  // 转出 科目辅助核算
            "inAdvanceAc": [],  // 预交 科目列表
            "inAdvanceList": [],  // 预交 科目辅助核算
            "beAccrued": false,  // 是否计提税费
            "beTurnOut": false,  // 是否转出未交税费
            "beInAdvance": false  // 是否预交增值税
        },
        // 暂收款项
        "acTemporaryReceipt": {
            "relationAc": [],  // 关联 科目列表
            "relationList": [],  // 关联 科目辅助核算
        },

        // 暂付款项
        "acTemporaryPay": {
            "relationAc": [],  // 关联 科目列表
            "relationList": [],  // 关联 科目辅助核算
        },
        // 借款
        "acLoan": {
            "loanAc": [],  // 借款 科目列表
            "loanList": [],  //  借款 科目辅助核算
            "interestAc": [],  // 利息 科目列表
            "interestList": [],  //  利息 科目辅助核算
            "unpaidInterestAc": [],  // 未付利息 科目列表
            "unpaidInterestList": [],  //  未付利息 科目辅助核算
            "beManagemented": false,  // 是否收付管理
        },
        // 投资
        "acInvest": {
            "investAc": [],  // 投资 科目列表
            "investList": [],  //  投资 科目辅助核算
            "profitAc": [],  // 收益 科目列表
            "profitList": [],  //  收益 科目辅助核算
            "uncollectedProfitAc": [],  // 未收利润 科目列表
            "uncollectedProfitList": [],  //  未收利润 科目辅助核算
            "uncollectedInterestAc":[],//未收利息
            "beManagemented": false,  // 是否收付管理
        },

        // 资本
        "acCapital": {
            "capitalAc": [],  // 资本 科目列表
            "capitalList": [],  //  资本 科目辅助核算
            "unassignedAc": [],  // 未分配 科目列表
            "unassignedList": [],  // 未分配 科目辅助核算
            "assignedAc": [],  // 分配 科目列表
            "assignedList": [],  //  分配 科目辅助核算
            "payableAc": [],  // 应付利润 科目列表
            "payableList": [],  //  应付利润 科目辅助核算
            "beManagemented": false,  // 是否收付管理
        },

        // 资产
        "acAssets": {
            "assetsAc": [],  //  资产 科目列表
            "assetsList": [],  // 资产 科目辅助核算
            "incomeAc": [],  //  收益 科目列表
            "incomeList": [],  // 收益 科目辅助核算
            "lossAc": [],  //  损失 科目列表
            "lossList": [],  // 损失 科目辅助核算
            "depreciationAc": [],  //  折旧 科目列表
            "depreciationList": [],  // 折旧 科目辅助核算
            "cleaningAc": [],  //  清理 科目列表
            "cleaningList": [],  // 清理 科目辅助核算
            "upgradeAc": [],  //  升级 科目列表
            "upgradeList": [],  // 升级 科目辅助核算
            "receivablesAc": [],  //  应收 科目列表
            "receivablesList": [],  // 应收 科目辅助核算
            "deliveryAc": [],  //  应付 科目列表
            "deliveryList": [],  // 应付 科目辅助核算
            "beManagemented": false,  // 是否收付管理
            "beCleaning": false  // 是否清理处置
        }
    },
    // 流水类别
    runningCategory: [
        {
          'childList': []
        }
    ],
    period: {
        closedmonth:"",
        closedyear:"",
        firstmonth:"",
        firstyear:"",
        lastmonth:"",
        lastyear:"",
    },
    issues:[],
    // 分页
    currentPage: 1,
    pageCount: 1,
})

export default function handleLrb(state = lsyeState, action) {
    return ({
        [ActionTypes.INIT_LSYEB]                                    : () => lsyeState,
        [ActionTypes.GET_BALANCE_LIST]                              : () => {

            // if(action.isReflash) {
            //     // yezi ??
            //     state = state.set('balanceTemp', cxlsState)
            // }

            if (action.getPeriod === 'true') {
                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            let selectList = []
            action.receivedData.forEach(v => selectList.push(v.categoryUuid))

            return state.set('balanceTemp',fromJS(action.receivedData))
                  .setIn(['flags', 'issuedate'],fromJS(action.issuedate))
                  .setIn(['flags', 'endissuedate'],fromJS(action.endissuedate))
                  .setIn(['flags', 'runningShowChild'],fromJS(selectList))
        },
        // 流水类别是否显示下级
        [ActionTypes.ACCOUNTCONF_BALANCE_TRIANGLE_SWITCH]          : () => {
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
        [ActionTypes.CHANGE_LSYE_MORE_PERIODS] 	 : () => {
            if (action.chooseperiods) {
                return state.set('chooseperiods', true)
            } else {
                return state.update('chooseperiods', v => !v)
            }
        },
    }[action.type] || (() => state))()
}
