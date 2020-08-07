import * as ActionTypes	from './ActionTypes.js'
import { fromJS }	from 'immutable'

import { showMessage } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import { formatDate } from 'app/utils'

//生产环境应当设置为空
const lrAccountState = fromJS({
    flags: {
        issuedate: '',
        main: 'duty',
        insertOrModify: 'insert',
        runningInsertOrModify: 'insert',
        paymentInsertOrModify: 'insert',
        payOrReceive: '收',
        accountAssModalShow: false,
        curCategory: '全部',
        curAccountUuid: '全部',
        assId: '',
        assCategory: '',
        acId: '',
        selectList: [],
        showRunningInfo:{},
        PageTab:'business',//支付流水或业务流水
        paymentType:'',//支付流水或结转流水类别
        paymentUuid:'',
        isQuery:false,//支付流水是否未查看状态
        isQueryByBusiness:false,//业务流水是否未查看状态
        modify:false,//支付流水是否是修改状态
        indexList:[],//选中条目的索引数组
        "personAccumulationAmountchecked": true, // 公积金(个人部分)checked
        "personSocialSecurityAmountchecked": true, // 社保(个人部分)checked
        "incomeTaxAmountchecked": true, // 个人所得税checked
        "pzFailedButtonShow": false,
        "specialStateforAccrued":false,  //计提的特殊查看状态
        "specialStateforAssets":false,  //长期资产处置损益状态
        showContactsModal:false,
        MemberList:[],
        thingsList:[],
        selectThingsList:[],
        managerCategoryList:[],
        amount:0,
        showAccountModal:false,
        stockThingsList:[],
        contactsThingsList:[],
        needRelaList:false,
        uuidList:[],
        costStockList:[],
        selectItem:[],
        totalAmount:0,

    },
    iuManageTypeCard:{
        isPayUnit:true,
        isReceiveUnit:true,
        insertOrModify:'insert',
        categoryTypeList:[],
        "receivableOpened":"0",
        "advanceOpened":"0",
        "payableOpened":"0",
        "prepaidOpened":"0",
        "name":"",
        "code":"",

        "companyAddress":"",
        "companyTel":"",
        "financeName":"",
        "financeTel":"",
        "remark":"",
        "contacterInfo":false,
        enableAdvanceAc:true,
        enablePrepaidAc:true

    },
    inventorySettingCard:{
        isAppliedPurchase:true,
        isAppliedSale:true,
        insertOrModify:'insert',
        categoryTypeList:[],
        "receivableOpened":"0",
        "advanceOpened":"0",
        "payableOpened":"0",
        "prepaidOpened":"0",
        "name":"",
        "code":"",
        isOpenedQuantity:false

        // "companyAddress":"",
        // "companyTel":"",
        // "financeName":"",
        // "financeTel":"",
        // "remark":"",
        // "contacterInfo":false,
        // enableAdvanceAc:true,
        // enablePrepaidAc:false,
        // 'isAppliedProduce':false,
    },
    tags:[],
    tagsStock:[],
    //核算管理
    //收付管理
    calculateTemp:{
      paymentList:[],
      detail:[],
      runningIndex:0,
      usedCard:{
          code:'',
          name:''
      },
      runningDate:formatDate(),
      runningAbstract:'核销账款',
      contactsCardRange:{
          name:'',
          code:''
      },
      stockCardList:{
          name:'',
          code:''
      }
    },
    //公共分摊费用
    commonChargeTemp:{
        runningDate:formatDate().slice(0,10),
        projectCard:[],
        paymentList:[],
        runningAbstract:'公共费用分摊',

    },
    CqzcTemp:{
        projectRange:[],
        assetsCategory:[{
            childList:[]
        }],
        projectList:[],
        detail:{
            acAssets:{
                depreciationAmount:'',
                originalAssetsAmount:'',
            },
            projectCard:[{
                uuid:'',
                name:'',
                code:''
            }],
            runningDate:formatDate().slice(0,10),
            runningAbstract:'长期资产处置损益',
            businessList:[],

        },

    },
    //日期列表
    issues:[],
    // 用来生成卡片
    cardTemp: {
      paymentList:[],
      "uuid": "",  // 类别uuid
      "name": "",  // 类别名称
      "property": "",  // 流水性质
      "flowNumber": "",  // 流水号
      "runningAbstract": "",  // 摘要
      "acAvailable": true,  // 是否可改科目
      "canDelete": false,  // 是否可删除
      "runningIndex": 0,  // 流水序号(出现在父子流水中)
      "categoryType": "", // 类别类型
      "propertyCost": "", // 费用性质
      "beCarryover": false, // 是否结转
      "runningState": "", // 流水状态
      "runningDate": formatDate(), // 流水发生时间
      "billType": "", // 发票类类型
      "billStates": "",  // 发票状态
      "priceTaxTotal": '', // 价税合计
      "taxRate": 0, // 税率
      "tax": '', // 税额
      "amount": "", // 金额
      "handleAmount": "", // 已处理金额(新增时，放本次付款)
      "notHandleAmount": "", // 未处理金额
      "offsetAmount": "", // 预收／付金额
      "childList": [],  // 子类别列表 结构与类别结构一样
      "running": [],  // 核销流水列表
      "taxPayState": "",  // 单选框的值
      "propertyCostList": [],  // 费用性质
      accountName: "",
      accountUuid: "",
      "beCertified": false,
      "carryoverAmount": "", // 成本金额
      "propertyPay": "", // 薪酬属性
      "propertyAssets": "", // 资产属性
      "propertyCarryover": "", //成本属性
      "propertyTax": "", // 税费属性
      "propertyInvest": "",// 投资属性
      "billAcList":[],
      "billAssList":[],
      "queryObj":{
          "amount":0,
          "handleAmount":0,
          "companyAccumulationAmount": 0, // 公积金(公司部分)
          "personAccumulationAmount": 0, // 公积金(个人部分)
          "companySocialSecurityAmount": 0, // 社保(公司部分)
          "personSocialSecurityAmount": 0, // 社保(个人部分)
          "incomeTaxAmount": 0, // 个人所得税

      },


      // 费用支出类别科目详情
      "acCost": {
          "saleAc": [{  // 销售科目列表
              "categoryUuid": "",  // 类别uuid
              "acId": "",  // 科目ID
              "acKey": "",  // 科目key
              "type": "",  // 科目类型
              "acFullName": "",  // 科目全称
              "assCategoryList": [],  // 辅助核算类别列表
          }],  // 类别uuid

          "saleList": [{  // 销售科目辅助核算列表
              "assId": "",  // 辅助核算ID
              "assName": "",  // 辅助核算名称
              "assCategory": [],  // 辅助核算类别
          }],  // 类别uuid
          "manageAc": [],  // 管理科目列表
          "manageList": [],  // 管理科目辅助核算
          "financeAc": [],  // 财务科目列表
          "financeList": [],  // 财务科目辅助核算
          "deliveryAc": [],  // 应付 科目列表
          "deliveryList": [],  // 应付 科目辅助核算
          "beManagemented": false  // 是否收付管理
      },

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
          "beCarryover": false,  // 是否结转成本
          "stockCardList":{
                  uuid:''
          }

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

      // 薪酬
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
          "beWelfare": false , // 是否过渡福利费
          "actualAmount": 0, // 实际支付
          "companyAccumulationAmount": '', // 公积金(公司部分)
          "personAccumulationAmount": '', // 公积金(个人部分)
          "companySocialSecurityAmount": '', // 社保(公司部分)
          "personSocialSecurityAmount": '', // 社保(个人部分)
          "incomeTaxAmount": '', // 个人所得税
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

      // 借款
      "acLoan": {
          "loanAc": [],  // 借款 科目列表
          "loanList": [],  //  借款 科目辅助核算
          "interestAc": [],  // 利息 科目列表
          "interestList": [],  //  利息 科目辅助核算
          "unpaidInterestAc": [],  // 未付利息 科目列表
          "unpaidInterestList": [],  //  未付利息 科目辅助核算
          "beAccrued": false,  // 是否计提
      },

      // 投资
      "acInvest": {
          "investAc": [],  // 投资 科目列表
          "investList": [],  //  投资 科目辅助核算
          "profitAc": [],  // 收益 科目列表
          "profitList": [],  //  收益 科目辅助核算
          "uncollectedProfitAc": [],  // 未收利润 科目列表
          "uncollectedProfitList": [],  //  未收利润 科目辅助核算
          "uncollectedInterestAc":[],
          "beAccrued": false,  // 是否计提
          "uncollectedInterestAc":[],//未收利润


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
          "beAccrued": false,  // 是否计提
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
          "payableAc": [],  //  应付 科目列表
          "payableList": [],  // 应付 科目辅助核算
          "beManagemented": false,  // 是否收付管理
          "beCleaning": false , // 是否清理处置
          "netProfitAmount": '', // 净收益金额
          "originalAssetsAmount": '', // 资产原值
          "depreciationAmount":'' , // 折旧累计
          "cleaningAmount":'' , // 清理费用
          "upgradingAmount":'' , // 升级改造
      }
  },
  // 附件上传
  enclosureList:[],
  previewImageList: [], //预览图片的地址的数组
  needDeleteUrl:[],//需要删除的图片地址
  tagModal:false,//标签组件的显示与否
  label:[],//附件标签
})


export default function handleLrb(state = lrAccountState, action) {
	return ({
        [ActionTypes.INIT_LR_ACOUNT_STATE]						: () => lrAccountState,
        [ActionTypes.INIT_LR_ACCOUNT]                       : () => {
            const hideCategoryList = state.get('hideCategoryList')
            const paymentType = state.getIn(['flags', 'paymentType'])
            //init：初始化
            if (action.strJudgeType === 'init') {
                const issues = state.get('issues')
                state = lrAccountState.set('issues', issues)
                                        // .set('hideCategoryList',hideCategoryList)
            }

            if (action.strJudgeType === 'saveAndNew') {
                const cardTemp = lrAccountState.get('cardTemp')
                const payableRate = state.getIn(['cardTemp', 'payableRate'])
                const outputRate = state.getIn(['cardTemp', 'outputRate'])
                const scale = state.getIn(['cardTemp', 'scale'])
                const runningDate = state.getIn(['cardTemp', 'runningDate'])
                const categoryType = state.getIn(['cardTemp', 'categoryType'])
                const name = state.getIn(['cardTemp', 'name'])
                state = state.setIn(['flags', 'insertOrModify'], 'insert')
                             .setIn(['flags', 'runningInsertOrModify'], 'insert')
                              .set('cardTemp',cardTemp)
                              .setIn(['cardTemp', 'payableRate'], payableRate)
                              .setIn(['cardTemp', 'outputRate'], outputRate)
                              .setIn(['cardTemp', 'categoryType'], categoryType)
                              .setIn(['cardTemp', 'scale'], scale)
                              .setIn(['cardTemp', 'runningDate'], runningDate)
                              .setIn(['cardTemp', 'name'], name)
                              .setIn(['flags', 'isQueryByBusiness'], false)
                              .setIn(['flags', 'specialStateforAssets'], false)
                              .setIn(['flags', 'specialStateforAccrued'], false)
                              .setIn(['flags', 'needRelaList'], false)
                              .setIn(['flags', 'uuidList'], fromJS([]))
                              .setIn(['flags', 'isQuery'], false)
                              .set('enclosureList', fromJS([]))
                              .set('label', fromJS([]))
                              .set('needDeleteUrl', fromJS([]))
            }
            //afterSave：录入页面保存、查看页面
            else if (action.strJudgeType === 'afterSave') {
                const receivedData = fromJS(action.receivedData)
                const runningInsertOrModify = state.getIn(['flags', 'runningInsertOrModify'])
                const runningState = state.getIn(['cardTemp', 'runningState'])
                state = state.set('cardTemp', receivedData)
                             .setIn(['flags', 'insertOrModify'], 'modify')
                             .setIn(['flags', 'amount'], receivedData.get('amount'))
                             .setIn(['flags', 'runningInsertOrModify'], 'modify')
                             .setIn(['flags', 'isQuery'], true)
              if(action.callBackObj.flowNumber){
                state = state.setIn(['cardTemp', 'flowNumber'], action.callBackObj.flowNumber)
              }
                if(runningInsertOrModify === 'insert') {
                  if(action.callBackObj.uuid){
                    state = state.setIn(['cardTemp', 'uuid'], action.callBackObj.uuid)
                  }
              }
                if (runningState === 'STATE_JK_ZFLX'
                 || runningState === 'STATE_TZ_SRGL'
                 || runningState === 'STATE_TZ_SRLX'
                 || runningState === 'STATE_ZB_ZFLR'
                 || runningState === 'STATE_XC_FF'
                 || runningState === 'STATE_XC_JN'
                 || runningState === 'STATE_SF_JN'
                 || runningState === 'STATE_ZS_TH'
                 || runningState === 'STATE_ZF_SH'
                 || runningState === 'STATE_SF_SFJM') {
                    state = state.setIn(['flags', 'specialStateforAccrued'], true)

                }

            }
            else if (action.strJudgeType === 'fromCxAccount') {
                const receivedData = fromJS(action.receivedData.result)
                const enclosureList = receivedData.get('enclosureList') ? fromJS(receivedData.get('enclosureList')) : fromJS([])
                const runningState = receivedData.get('runningState')
                const scale = state.getIn(['cardTemp', 'scale'])
                const uuidList = state.getIn(['flags','uuidList'])
                const paymentType = state.getIn(['flags','paymentType'])
                const calculateTemp = state.get('calculateTemp')
                state = lrAccountState.set('cardTemp', receivedData)
                            .set('calculateTemp',calculateTemp)
                            .setIn(['flags', 'PageTab'], 'business')
                            .setIn(['flags', 'insertOrModify'], 'modify')
                           .setIn(['flags', 'paymentType'], paymentType)
                           .setIn(['flags', 'runningInsertOrModify'], 'modify')
                           .setIn(['flags', 'amount'], receivedData.get('amount'))
                           .setIn(['flags', 'isQuery'], true)
                           .setIn(['cardTemp','name'], receivedData.get('categoryName'))
                           .set('hideCategoryList',hideCategoryList)
                           .set('enclosureList',enclosureList)
                           .setIn(['cardTemp','queryObj', 'amount'], receivedData.get('amount'))
                           .setIn(['cardTemp','queryObj', 'handleAmount'], receivedData.get('handleAmount'))
                           .setIn(['cardTemp','queryObj', 'offsetAmount'], receivedData.get('offsetAmount'))
               if (receivedData.get('categoryType') === 'LB_XCZC') {
                   state = state.setIn(['cardTemp','queryObj', 'personAccumulationAmount'], receivedData.getIn(['acPayment', 'personAccumulationAmount']))
                                .setIn(['cardTemp','queryObj', 'personSocialSecurityAmount'], receivedData.getIn(['acPayment', 'personSocialSecurityAmount']))
                                .setIn(['cardTemp','queryObj', 'incomeTaxAmount'], receivedData.getIn(['acPayment', 'incomeTaxAmount']))
                                .setIn(['cardTemp','queryObj', 'companySocialSecurityAmount'], receivedData.getIn(['acPayment', 'companySocialSecurityAmount']))
                                .setIn(['cardTemp','queryObj', 'companyAccumulationAmount'], receivedData.getIn(['acPayment', 'companyAccumulationAmount']))
               }
               if ((runningState === 'STATE_JK_ZFLX'
               || runningState === 'STATE_TZ_SRGL'
               || runningState === 'STATE_TZ_SRLX'
               || runningState === 'STATE_ZB_ZFLR'
               || runningState === 'STATE_XC_FF'
               || runningState === 'STATE_XC_JN'
               || runningState === 'STATE_SF_JN'
               || runningState === 'STATE_ZS_TH'
               || runningState === 'STATE_ZF_SH'
               || runningState === 'STATE_SF_SFJM')
               && receivedData.get('paymentList').size) {
                   state = state.setIn(['flags', 'specialStateforAccrued'], true)
               }
               if (action.uuidList || uuidList.size) {
                   state = state.setIn(['flags','needRelaList'],true)
               }
               if (action.uuidList) {
                   state = state.setIn(['flags', 'uuidList'], action.uuidList)
               } else if (uuidList.size) {
                   state = state.setIn(['flags', 'uuidList'], uuidList)
               }
               if (Number(receivedData.get('amount')) === Number(receivedData.get('currentAmount'))) {
                   state = state.setIn(['flags', 'allGetFlow'], true)
               }
                state = state.setIn(['flags', 'isQueryByBusiness'], true)
                             .setIn(['cardTemp', 'scale'], scale)
                             .setIn(['flags','currentSwitchUuid'],action.uuid)
            }

            return state
        },
        // by yezi
        [ActionTypes.INIT_LR_ACCOUNT_SETTINGS]                                  : () => {
            state = state.setIn(['cardTemp', 'payableRate'], action.rate.payableRate)
                        .setIn(['cardTemp', 'outputRate'], action.rate.outputRate)
                        .setIn(['cardTemp', 'scale'], action.rate.scale)
                        .set('hideCategoryList', fromJS(action.hideCategoryList))

            return state
        },
        // 废除单个单个修改状态
        [ActionTypes.COST_TRANSFER_FROM_CXLS_JUMP_TO_LRLS]                       : () => {
            const uuidList = state.getIn(['flags','uuidList'])
            state = lrAccountState.setIn(['cardTemp', 'payableRate'], action.rate.payableRate)
                        .setIn(['cardTemp', 'outputRate'], action.rate.outputRate)
                        .setIn(['cardTemp', 'scale'], action.rate.scale)
                        .set('hideCategoryList', fromJS(action.hideCategoryList))
                        .setIn(['flags','currentSwitchUuid'],action.item.get('uuid'))

            state = state.setIn(['flags', 'PageTab'], 'payment')
                        .setIn(['flags', 'paymentType'], 'LB_JZCB')

            if(action.fromRefresh){
                state = state.setIn(['flags','isQueryByBusiness'],true)
                            .setIn(['flags','runningInsertOrModify'],'modify')
            }
            if (action.uuidList || uuidList.size) {
                state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
                state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
                state = state.setIn(['flags', 'uuidList'], uuidList)
            }
            return state
        },
        [ActionTypes.INVOICE_AUTH_FROM_CXLS_JUMP_TO_LRLS]                       : () => {
            const uuidList = state.getIn(['flags','uuidList'])
            state = lrAccountState.setIn(['cardTemp', 'payableRate'], action.rate.payableRate)
                        .setIn(['cardTemp', 'outputRate'], action.rate.outputRate)
                        .setIn(['cardTemp', 'scale'], action.rate.scale)
                        .set('hideCategoryList', fromJS(action.hideCategoryList))
                        .setIn(['flags','currentSwitchUuid'],action.item.get('uuid'))
            state = state.setIn(['flags', 'PageTab'], 'payment')
                        .setIn(['flags', 'paymentType'], 'LB_FPRZ')
            if(action.fromRefresh){
                state = state.setIn(['flags','isQueryByBusiness'],true)
                             .setIn(['flags','runningInsertOrModify'],'modify')
            }
            if (action.uuidList || uuidList.size) {
                state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
                state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
                state = state.setIn(['flags', 'uuidList'], uuidList)
            }
            return state
        },
        [ActionTypes.CALCULATE_FROM_CXLS_JUMP_TO_LRLS]                       : () => {
            const uuidList = state.getIn(['flags','uuidList'])
            state = lrAccountState.setIn(['cardTemp', 'payableRate'], action.rate.payableRate)
                        .setIn(['cardTemp', 'outputRate'], action.rate.outputRate)
                        .setIn(['cardTemp', 'scale'], action.rate.scale)
                        .set('hideCategoryList', fromJS(action.hideCategoryList))

            state = state.setIn(['flags', 'PageTab'], 'payment')
                        .setIn(['flags', 'paymentType'], action.pageType)
            if(action.fromRefresh){
                state = state.setIn(['flags','isQueryByBusiness'],true)
                             .setIn(['flags','runningInsertOrModify'],'modify')
            }
            if (action.uuidList || uuidList.size) {
                state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
                state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
                state = state.setIn(['flags', 'uuidList'], uuidList)
            }

            return state
        },
        [ActionTypes.CALCULATE_CHANGE_QUERY]                       : () => {

            state = state.setIn(['flags','isQueryByBusiness'],true)
                         .setIn(['flags','runningInsertOrModify'],'modify')

            return state
        },
        [ActionTypes.INVOICING_FROM_CXLS_JUMP_TO_LRLS]                       : () => {
            const uuidList = state.getIn(['flags','uuidList'])
            state = lrAccountState.setIn(['cardTemp', 'payableRate'], action.rate.payableRate)
                        .setIn(['cardTemp', 'outputRate'], action.rate.outputRate)
                        .setIn(['cardTemp', 'scale'], action.rate.scale)
                        .set('hideCategoryList', fromJS(action.hideCategoryList))
                        .setIn(['flags','currentSwitchUuid'],action.item.get('uuid'))
            state = state.setIn(['flags', 'PageTab'], 'payment')
                        .setIn(['flags', 'paymentType'], 'LB_KJFP')

            if(action.fromRefresh){
                state = state.setIn(['flags','isQueryByBusiness'],true)
                             .setIn(['flags','runningInsertOrModify'],'modify')
            }
            if (action.uuidList || uuidList.size) {
                state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
                state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
                state = state.setIn(['flags', 'uuidList'], uuidList)
            }
            return state
        },
        [ActionTypes.SELECT_ACCOUNT_RUNNING_CATEGORY]       : () => {
              state = state.setIn(['flags', 'insertOrModify'], 'modify')
                          .setIn(['flags', 'showModal'], true)
                          .mergeIn(['cardTemp'], fromJS(action.name))
                          .deleteIn(['cardTemp', 'parentUuid'])
                          .setIn(['cardTemp', 'assetType'],'')
              if (action.name.beProject) {
                state = state.setIn(['cardTemp','usedProject'], true)
                             .setIn(['cardTemp','projectCard'], fromJS([{uuid:''}]))
              }
              const categoryUuid = state.getIn(['cardTemp' ,'uuid'])
              return  state.setIn(['cardTemp','categoryUuid'], categoryUuid)


        },
        [ActionTypes.TRANSFER_OUT_FROM_CXLS_JUMP_TO_LRLS]   : () => {
            const uuidList = state.getIn(['flags','uuidList'])
            if (action.uuidList || uuidList.size) {
                state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
                state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
                state = state.setIn(['flags', 'uuidList'], uuidList)
            }
            return state.setIn(['flags','currentSwitchUuid'],action.item.get('uuid'))
        },
        [ActionTypes.TRANSFER_OUT_FROM_CXLS_JUMP_TO_NBZZ]   :() => {
            const uuidList = state.getIn(['flags','uuidList'])
            if (action.uuidList || uuidList.size) {
                state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
                state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
                state = state.setIn(['flags', 'uuidList'], uuidList)
            }
            return state.setIn(['flags','currentSwitchUuid'],action.item.get('uuid'))
        },
        [ActionTypes.TRANSFER_OUT_FROM_CXLS_JUMP_TO_ZJTX]   :() => {
            const uuidList = state.getIn(['flags','uuidList'])
            if (action.uuidList || uuidList.size) {
                state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
                state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
                state = state.setIn(['flags', 'uuidList'], uuidList)
            }
            return state.setIn(['flags','currentSwitchUuid'],action.item.get('uuid'))
        },
        [ActionTypes.TRANSFER_OUT_FROM_CXLS_JUMP_TO_ZJTX]   :() => {
            const uuidList = state.getIn(['flags','uuidList'])
            if (action.uuidList || uuidList.size) {
                state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
                state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
                state = state.setIn(['flags', 'uuidList'], uuidList)
            }
            return state.setIn(['flags','currentSwitchUuid'],action.item.get('uuid'))
        },
        [ActionTypes.SELECT_RUNNING_AC_INFO]                : () => {
            state = state.setIn(['cardTemp', action.idPlace], action.acid)
                        .setIn(['cardTemp', action.namePlace], action.acFullName)
                        .setIn(['cardTemp', action.assPlace], fromJS([]))

            return state
        },

        // 修改辅助核算
        [ActionTypes.SELECT_ACCOUNT_ASS]                    : () => {

            const assCategory = action.assCategory
            const assList = state.getIn(['cardTemp', action.place])
            const index = assList.findIndex(v => v.get('assCategory') === assCategory)

            if (index === -1) {
                state = state.updateIn(['cardTemp', action.place], v => v.set(v.size, fromJS({
                    assId: action.assId,
                    assName: action.assName,
                    assCategory
                })))
            } else {
                state = state.updateIn(['cardTemp', action.place], v => v.setIn([index, 'assId'], action.assId).setIn([index, 'assName'], action.assName))
            }

            return state
        },

        [ActionTypes.CHANGE_LR_ACCOUNT_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },

        [ActionTypes.GET_RUNNING_ACCOUNT_INFO]              : () => {
            switch (action.wordType) {
              case 'VAT':
                state = state.setIn(['cardTemp', 'paymentList'], fromJS(action.receivedData.resultList))
                break
              case 'socialSecurity':
                state = state.setIn(['cardTemp', 'socialSecurityAmount'], action.receivedData.socialSecurityAmount)
                break
              case 'fund':
                state = state.setIn(['cardTemp', 'accumulationAmount'], action.receivedData.accumulationAmount)
                break
              case 'sfAmount':
                state = state.setIn(['cardTemp', 'sfAmount'], action.receivedData.amount)
                break
              case 'other':
                state = state.setIn(['cardTemp', 'paymentList'], fromJS(action.receivedData.resultList))
            case 'accruedZZS':
              state = state.setIn(['cardTemp', 'preAmount'], action.receivedData.amount)
              break
              default:
                state = state.setIn(['cardTemp', 'payableAmount'], action.receivedData.amount)
                             .setIn(['cardTemp', 'preAmount'], action.receivedData.preAmount)
            }


            return state
        },

        [ActionTypes.CHANGE_LR_ACCOUNT_ACCOUNT_NAME]        : () => {

            const valueList = action.value.split(Limit.TREE_JOIN_STR)
            return state = state.setIn([`${action.tab}Temp`, action.placeUUid], valueList[0])
                                .setIn([`${action.tab}Temp`, action.placeName], valueList[1])
        },

        [ActionTypes.CHANGE_ACCOUNT_BILL_TYPE]              : () => {
          let taxRate = state.getIn(['cardTemp', 'taxRate'])
          if(taxRate){
            state = state.setIn(['cardTemp', 'tax'],(Number(taxRate) * Number(action.value)/100).toFixed(2))
          }
            state = state.setIn(['cardTemp', 'amount'], action.value)

            return state
        },

        [ActionTypes.AUTO_CALCULATE_BILL_INFO]              : () => {
            // 自动计算发票金额信息
            const strJudgeType = action.strJudgeType

            return autoCalculateBillInfo(strJudgeType, state)
        },
        [ActionTypes.CHANGE_ACCOUNT_TAX_RATE]               : () => {
            let amount = state.getIn(['cardTemp', 'amount'])


            if(action.value){
              state = state.setIn(['cardTemp', 'taxRate'], action.value)
            }
            let taxRate =state.getIn(['cardTemp', 'taxRate'])
            if(amount) {
                if (taxRate == 100) {
                    state = state.setIn(['cardTemp', 'tax'],amount)

                } else {
                    state = state.setIn(['cardTemp', 'tax'],(Number(amount) /(1 + Number(taxRate)/100) * Number(taxRate)/100).toFixed(2))
                }
            }

            return state
        },
        [ActionTypes.CHANGE_ACCOUNT_FZHS_MODAL_DISPLAY]     : () => state.updateIn(['flags', 'accountAssModalShow'], v => !v),
        [ActionTypes.CHANGE_ACCOUNT_ASS_CATEGORY]           : () => state.setIn(['ass', 'asscategory'], action.assCategory),
        [ActionTypes.CHANGE_ACCOUNT_FZHS_MODAL_CLEAR]       : () => state.set('ass', lrAccountState.get('ass')).updateIn(['flags', 'accountAssModalShow'], v => !v),
        [ActionTypes.CHANGE_ACCOUNT_ASSID]                  : () => state.setIn(['ass', 'assid'], action.value),
        [ActionTypes.CHANGE_ACCOUNT_ASSNAME]                : () => state.setIn(['ass', 'assname'], action.value),
        [ActionTypes.CHANGE_ACCOUNT_SALARY]                : () => {
          state = state.setIn(['cardTemp','acPayment',action.place], action.value)
          if(action.checkplace){
              state = state.setIn(['flags',action.checkplace],action.checked)

          }
          return state
        },
        [ActionTypes.CALCULATE_AMOUNT]                    :()=>{
          const companyAccumulationAmount = state.getIn(['cardTemp', 'acPayment','companyAccumulationAmount'])// 公积金(公司部分)
          const personAccumulationAmount = state.getIn(['cardTemp', 'acPayment','personAccumulationAmount'])// 公积金(个人部分)
          const companySocialSecurityAmount = state.getIn(['cardTemp', 'acPayment','companySocialSecurityAmount'])//社保(公司部分)
          const personSocialSecurityAmount = state.getIn(['cardTemp', 'acPayment','personSocialSecurityAmount']) // 社保(个人部分)
          const incomeTaxAmount = state.getIn(['cardTemp', 'acPayment','incomeTaxAmount']) // 个人所得税
          const amount = state.getIn(['cardTemp','amount'])
          const categoryType = state.getIn(['cardTemp','categoryType'])
          const propertyPay = state.getIn(['cardTemp', 'propertyPay'])
          let actualAmount
          switch (propertyPay) {
            case 'SX_GZXJ':
              actualAmount = (Number(amount) -Number(personAccumulationAmount) - Number(personSocialSecurityAmount) - Number(incomeTaxAmount)).toFixed(2)
              break
            case 'SX_ZFGJJ':
              actualAmount = (Number(personAccumulationAmount) + Number(companyAccumulationAmount)).toFixed(2)
              break
            case 'SX_SHBX':
              actualAmount = (Number(companySocialSecurityAmount) + Number(personSocialSecurityAmount)).toFixed(2)
              break
            default:
              actualAmount = 0
          }
          state = state.setIn(['cardTemp','acPayment','actualAmount'],actualAmount)
          return state
        },
        [ActionTypes.UPDATE_ACCOUNT_LIST]               :() => {
          let index
          if(action.empty) {
            return state.setIn([...action.placeArr], fromJS([]))
          }
          const hasSameAssCategory = state.getIn(action.placeArr).toJS().some((v, i)=> {
            if(v.assCategory === action.value.assCategory){
              index = i
              return true
            }
          })
            if(hasSameAssCategory){
            state = state.setIn([...action.placeArr, index], fromJS(action.value))
          }else{
              state = state.updateIn(action.placeArr, (list) => {
                return list.push(fromJS(action.value))
              })
          }
          return state
        },
        [ActionTypes.CALCULATE_GAIN_OR_LOSS]           :() => {
          const { place, diff, deletePlace } = action
          return state.setIn(place, diff)
                      .deleteIn(deletePlace, diff)
        },
        [ActionTypes.INIT_PAYMENT_STATE]   :() => {
            const uuidList = state.getIn(['flags','uuidList'])
            state =  state.set('calculateTemp', action.item)
                        .setIn(['flags', 'PageTab'], 'payment')
                        .mergeIn(['calculateTemp'], fromJS(action.result))
                        .setIn(['flags', 'selectList'], fromJS([]))
                        .setIn(['flags', 'indexList'], fromJS([]))
                        .setIn(['flags', 'paymentType'], 'LB_SFGL')
                        .setIn(['calculateTemp', 'ass'], action.assName)
                        .setIn(['flags', 'modify'], false)
                        .setIn(['flags', 'paymentInsertOrModify'], 'modify')
                        .setIn(['calculateTemp', 'runningAbstract2'], action.item.get('runningAbstract')) //单笔流水摘要维护2次
                        .setIn(['calculateTemp', 'runningDate2'], action.item.get('runningDate')) //单笔流水日期维护2次
                        .setIn(['flags','currentSwitchUuid'],action.item.get('uuid'))
                        .setIn(['flags', 'isQuery'], true)
                        .set('enclosureList', fromJS(action.result.enclosureList))
            if (action.stateType === 'state_ts') {
                state = state.updateIn(['calculateTemp', 'handleAmount'], v => -Math.abs(v))
                             .updateIn(['calculateTemp', 'notHandleAmount'], v => -Math.abs(v))
            }
            if (action.uuidList || uuidList.size) {
               state = state.setIn(['flags','needRelaList'],true)
            }
            if (action.uuidList) {
               state = state.setIn(['flags', 'uuidList'], action.uuidList)
            } else if (uuidList.size) {
               state = state.setIn(['flags', 'uuidList'], uuidList)
            }
            if (action.fromCxls && action.result.detail && action.result.detail.length ) {
                const selectList = []
                const indexList = []
                action.result.detail.map((v,i) => {
                    selectList.push(v.uuid)
                    indexList.push(i)
                })
                state =  state.setIn(['flags', 'selectList'], fromJS(selectList))
                                .setIn(['flags', 'indexList'], fromJS(indexList))
            }
            return state
        },
        [ActionTypes.GET_PAYMENT_PERIOD]  :() => {
            state = state.setIn(['calculateTemp', 'detail'],fromJS(action.receivedData))
                          .setIn(['flags', 'isQuery'], false)
          return state.setIn(['flags', 'selectList'], fromJS([]))
                        .setIn(['flags', 'indexList'], fromJS([]))
                        .setIn(['flags', 'totalAmount'], 0)
                      // .setIn(['calculateTemp', 'ass'],'')
        },
        // 全选
        [ActionTypes.LRACCOUNT_ITEM_CHECKBOX_CHECK_ALL]               : () => {

            if (action.selectAll) {
                // 全不选
                return state.setIn(['flags', 'selectList'], fromJS([]))
                            .setIn(['flags', 'indexList'], fromJS([]))
            } else {
                // 全选 accountList
                const accountList = action.list
                let selectAllList = []
                let selectAllIndex = []
                accountList && accountList.size && accountList.forEach((v, i)=> {
                  selectAllList.push(v.get('uuid'))
                  selectAllIndex.push(i)

                })

                return state.setIn(['flags', 'selectList'], fromJS(selectAllList))
                            .setIn(['flags', 'indexList'], fromJS(selectAllIndex))
            }

        },
        // 选择要删除的卡片
        [ActionTypes.LRACCOUNT_ITEM_CHECKBOX_CHECK]               : () => {

            const showLowerList = state.getIn(['flags', 'selectList'])
            const showIndexList = state.getIn(['flags', 'indexList'])
            if (!action.checked) {
                // 原来没选
                const newShowLowerList = showLowerList.push(action.uuid)
                const newShowIndexList = showIndexList.push(action.index)
                return state.setIn(['flags', 'selectList'], newShowLowerList)
                            .setIn(['flags', 'indexList'], newShowIndexList)
            } else {
                // 原来选了
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                const newShowIndexList = showIndexList.splice(showIndexList.findIndex(v => v === action.index), 1)
                return state.setIn(['flags', 'selectList'], newShowLowerList)
                            .setIn(['flags', 'indexList'], newShowIndexList)
            }

        },
        [ActionTypes.INIT_LR_ACCOUNT_PAYMENT]                   :() => {
          if(action.saveAndNew) {
              const runningDate = state.getIn(['calculateTemp','runningDate'])
            state = state.set('calculateTemp',lrAccountState.get('calculateTemp'))
                          .setIn(['calculateTemp', 'runningDate'],runningDate)
                          .setIn(['flags', 'isQuery'],false)
                          .setIn(['flags','modify'],false)
                          .setIn(['flags', 'paymentInsertOrModify'], 'insert')
                          .setIn(['flags', 'indexList'], fromJS([]))
                          .setIn(['flags', 'selectList'], fromJS([]))
                          .setIn(['flags', 'totalAmount'], 0)
                          .setIn(['flags', 'accountType'], 'notSingle')
                          .set('enclosureList', fromJS([]))
                          .set('label', fromJS([]))
                          .set('needDeleteUrl', fromJS([]))
          }else {
              if(action.paymentInsertOrModify === 'insert') {
                  state = state.setIn(['calculateTemp','uuid'], action.currentUuid)
              }
            state = state.setIn(['flags','isQuery'], true)
                        .setIn(['flags','modify'],false)
                        .setIn(['flags', 'paymentInsertOrModify'], 'modify')

          }
          return state

      },
      [ActionTypes.AFTER_SAVE_ACCOUNT_PAYMENT]      : () => {
          const enclosureList = action.result.enclosureList ? action.result.enclosureList : []
          return state.set('calculateTemp', fromJS(action.result))
                        .setIn(['flags', 'accountType'], 'notSingle')
                        .set('enclosureList', fromJS(enclosureList))
                        .setIn(['flags', 'isQuery'], true)
                        .setIn(['flags', 'modify'], false)
                        .setIn(['calculateTemp', 'uuid'], action.currentUuid)
                        .setIn(['flags', 'paymentInsertOrModify'], 'modify')

      },
      [ActionTypes.LRACCOUNT_ITEM_SEARCH_CARD_LIST]  :() => {
          if(action.isSearch) {
            let selectList = action.list.map(v => {
                  const code = v.string.split(Limit.TREE_JOIN_STR)[0]
                  const name = v.string.split(Limit.TREE_JOIN_STR)[1]
                  const uuid = v.uuid
                  return fromJS({code,name,uuid})
              })
            return state.setIn(['flags', 'selectThingsList'], fromJS(selectList))
          } else {
          return state.setIn(['flags', 'selectThingsList'], fromJS(action.list))
          }
      },
      [ActionTypes.ACCOUNT_IUMANAGE_LIST_TITLE]         : () => {
         return state.set('tags',fromJS(action.data))



     },
     [ActionTypes.CHANGE_ACCOUNT_MANAGE_CARD_RELATION]         : () => {
         let reserveTags = state.get('tags');
         let subordinateUuid = '';
         reserveTags.find((value,index) =>{
             if(value.get('uuid') === action.tag.get('uuid')){
                 reserveTags = reserveTags.setIn([index,'checked'],action.checked)
                 if(value.get('selectUuid')){
                     subordinateUuid = value.get('selectUuid')
                 }
                 if(action.checked){
                     reserveTags = reserveTags.setIn([index,'tree'],fromJS(action.tree))
                     if(action.tree[0].childList.length === 0){
                         reserveTags = reserveTags.setIn([index,'selectUuid'],action.tree[0].uuid)
                                                  .setIn([index,'selectName'],action.tree[0].name)
                         subordinateUuid = action.tree[0].uuid
                     }
                 }
             }
         })
         if(action.checked){
             state = state.setIn(['iuManageTypeCard','categoryTypeList'],state.getIn(['iuManageTypeCard','categoryTypeList'])
                          .push(fromJS({'ctgyUuid':action.tag.get('uuid'),'subordinateUuid':subordinateUuid})))
         }else{
             let index = state.getIn(['iuManageTypeCard','categoryTypeList']).findIndex((value,index) =>{
                 return value.get('ctgyUuid') === action.tag.get('uuid')
             })
             state = state.setIn(['iuManageTypeCard','categoryTypeList'],state.getIn(['iuManageTypeCard','categoryTypeList']).delete(index))
         }

         state = state.set('tags',reserveTags)
         return state
     },
     [ActionTypes.ACCOUNT_SAVE_IUMANAGE_TYPE_CARD]         : () => {
         if(action.flag === 'insertAndNew'){
             state = state.setIn(['iuManageTypeCard','code'],action.code)
                          .setIn(['iuManageTypeCard','name'],'')
         } else {
             const iuManageTypeCard = lrAccountState.get('iuManageTypeCard')
             state = state.set('iuManageTypeCard', iuManageTypeCard)
         }
         return state
     },
     [ActionTypes.ACCOUNT_CHANGE_IUMANAGE_CARD_AC]         : () => {
         state = state.setIn([action.place,action.acId],action.uuid)
                      .setIn([action.place,action.acName],action.name)
         return state
     },
     [ActionTypes.CHANGE_ACCOUNT_CARD_RELATION_TYPE]         : () => {
         state.getIn(['iuManageTypeCard','categoryTypeList']).find((value,index) =>{
             if(value.get('ctgyUuid') === action.tag.get('uuid')){
                 state = state.setIn(['iuManageTypeCard','categoryTypeList',index,'subordinateUuid'],action.uuid)
             }
         })

         state.get('tags').find((value,index) =>{
             if(value.get('uuid') === action.tag.get('uuid')){
                 state = state.set('tags',state.get('tags')
                              .setIn([index,'selectUuid'],action.uuid)
                              .setIn([index,'selectName'],action.name))
             }
         })
         return state
     },

     //存货
     [ActionTypes.ACCOUNT_CHANGE_INVENTORY_CARD_NATURE]         : () => {
         state = state.setIn(['inventorySettingCard',action.name],action.value)
        //  const clearAllStatus = () =>{
        //      state.get('tagsStock').map((item,index) =>{
        //          state = state.setIn(['tagsStock',index,'checked'],false)
        //      })
        //      state = state.setIn(['inventorySettingCard','categoryTypeList'],fromJS([]))
        //  }
         //
        //  const clearAotherStatus = (item,index) =>{
        //      state = state.setIn(['tagsStock',index,'checked'],false)
        //      let curIndex = state.getIn(['inventorySettingCard','categoryTypeList']).findIndex((v,i) =>{
        //          return v.get('ctgyUuid') === item.get('uuid')
        //      })
        //      if(curIndex > -1){
        //          state = state.setIn(['inventorySettingCard','categoryTypeList'],state.getIn(['inventorySettingCard','categoryTypeList']).delete(curIndex))
        //      }
        //  }
         //
        //  if(action.value === 1){
        //      state = state.setIn(['inventorySettingCard','isAppliedPurchase'],true)
        //       state.get('tagsStock').map((item,index) =>{
        //           if(!item.get('isAppliedPurchase')){
        //               clearAotherStatus(item,index)
        //           }
        //       })
         //
        //  }else if(action.value === 3){
        //      state = state.setIn(['inventorySettingCard','isAppliedSale'],true)
        //       state.get('tagsStock').map((item,index) =>{
        //           if(!item.get('isAppliedSale')){
        //               clearAotherStatus(item,index)
        //           }
        //       })
        //  }
         return state
     },
     [ActionTypes.ACCOUNT_CHANGE_INVENTORY_CARD_CATEGORY_STATUS]         : () => {
         let subordinateUuid = '';
         state.get('tagsStock').find((v,i)=>{
             if(v.get('uuid') === action.item.get('uuid')){
                 state = state.setIn(['tagsStock',i,'checked'],action.value)
                              .setIn(['tagsStock',i,'tree'],fromJS(action.list))
                 if(v.get('selectUuid')){
                     subordinateUuid = v.get('selectUuid')
                 }
                 if(action.value){
                     if(action.list[0].childList.length === 0){
                         state = state.setIn(['tagsStock',i,'selectUuid'],action.list[0].uuid)
                                      .setIn(['tagsStock',i,'selectName'],action.list[0].name)
                         subordinateUuid = action.list[0].uuid
                     }
                 }
                 return
             }
         })

         if(action.value){
             let info = fromJS({'ctgyUuid':action.item.get('uuid'),'subordinateUuid':subordinateUuid})
             let list = state.getIn(['inventorySettingCard','categoryTypeList']).push(info)
             state = state.setIn(['inventorySettingCard','categoryTypeList'],list)
         }else{
             let curIndex = state.getIn(['inventorySettingCard','categoryTypeList']).findIndex((v,i) =>{
                 return v.get('ctgyUuid') === action.item.get('uuid')
             })
             let list = state.getIn(['inventorySettingCard','categoryTypeList']).delete(curIndex)
             state = state.setIn(['inventorySettingCard','categoryTypeList'],list)
         }
         return state
     },
     [ActionTypes.ACCOUNT_CHANGE_INVENTORY_CARD_CATEGORY_TYPE]         : () => {
         state.get('tagsStock').map((v,i) =>{
             if(v.get('uuid') === action.item.get('uuid')){
                 state = state.setIn(['tagsStock',i,'selectUuid'],action.uuid)
                              .setIn(['tagsStock',i,'selectName'],action.name)
                 return ;
             }
         })
         state.getIn(['inventorySettingCard','categoryTypeList']).map((v,i) =>{
             if(v.get('ctgyUuid') === action.item.get('uuid')){
                 state = state.setIn(['inventorySettingCard','categoryTypeList',i,'subordinateUuid'],action.uuid)
             }
         })
         return state
     },
     [ActionTypes.ACCOUNT_SAVE_INVENTORY_SETTING_CARD]         : () => {
         state = state.set('cardList',fromJS(action.list))

         if(action.flag === 'insertAndNew'){
             state = state.setIn(['inventorySettingCard','name'],'')
                          .setIn(['inventorySettingCard','code'],action.autoIncrementCode)
         }else{
             state = state.set('tagsStock',state.get('originTags'))
         }
         return state
     },
     [ActionTypes.ACCOUNT_INVENTORY_SETTING_INIT]         : () => {
         action.title.unshift({'name':state.get('anotherTabName'),'uuid':''})
         state = state.set('tagsStock',fromJS(action.title))
                      .set('originTags',fromJS(action.title))
                      .set('cardList',fromJS(action.cardList))
         return state
     },
     [ActionTypes.INIT_RELA_CARD]    :() => {
         const iuManageTypeCard = lrAccountState.get('iuManageTypeCard')
         const propertyCost = state.getIn(['cardTemp','propertyCost'])
         const assetType = state.getIn(['cardTemp','assetType'])
         state.get('tags').map((item,index) =>{
             state = state.setIn(['tags',index,'checked'],false)
         })
         state = state.set('iuManageTypeCard',iuManageTypeCard)
                      .setIn(['iuManageTypeCard','advanceAcId'],action.data.defaultAc.advanceAcId)
                      .setIn(['iuManageTypeCard','advanceAcName'],action.data.defaultAc.advanceAcName)
                      .setIn(['iuManageTypeCard','receivableAcId'],action.data.defaultAc.receivableAcId)
                      .setIn(['iuManageTypeCard','receivableAcName'],action.data.defaultAc.receivableAcName)
                      .setIn(['iuManageTypeCard','payableAcId'],action.data.defaultAc.payableAcId)
                      .setIn(['iuManageTypeCard','payableAcName'],action.data.defaultAc.payableAcName)
                      .setIn(['iuManageTypeCard','prepaidAcId'],action.data.defaultAc.prepaidAcId)
                      .setIn(['iuManageTypeCard','prepaidAcName'],action.data.defaultAc.prepaidAcName)
                      .setIn(['iuManageTypeCard','code'],action.data.code)
         if(assetType === 'XZ_CZZC') {
             state = state.setIn(['iuManageTypeCard','isPayUnit'], false)
                            .setIn(['iuManageTypeCard','isReceiveUnit'], true)
         } else if (assetType === 'XZ_GJZC') {
             state = state.setIn(['iuManageTypeCard','isPayUnit'], true)
                            .setIn(['iuManageTypeCard','isReceiveUnit'], false)
         } else if (action.direction === 'debit') {
             state = state.setIn(['iuManageTypeCard','isPayUnit'], false)
                            .setIn(['iuManageTypeCard','isReceiveUnit'], true)
         } else {
             state = state.setIn(['iuManageTypeCard','isPayUnit'], true)
                            .setIn(['iuManageTypeCard','isReceiveUnit'], false)
         }
         return state
     },
     [ActionTypes.INIT_STOCK_CARD]    :() => {
         const inventorySettingCard = lrAccountState.get('inventorySettingCard')
         state.get('tagsStock').map((item,index) =>{
             state = state.setIn(['tagsStock',index,'checked'],false)
         })
         state = state.set('inventorySettingCard',inventorySettingCard)
                      .setIn(['inventorySettingCard','inventoryAcId'],action.data.defaultAc.inventoryAcId)
                      .setIn(['inventorySettingCard','inventoryAcName'],action.data.defaultAc.inventoryAcName)
                      .setIn(['inventorySettingCard','code'],action.data.code)
         if (action.direction === 'debit') {
             state = state.setIn(['inventorySettingCard','isAppliedPurchase'], false)
                            .setIn(['inventorySettingCard','isAppliedSale'], true)
         } else {
             state = state.setIn(['inventorySettingCard','isAppliedPurchase'], true)
                            .setIn(['inventorySettingCard','isAppliedSale'], false)
         }
         return state
     },
     [ActionTypes.CLOSE_ACCOUNTCONF_MODAL_LR]                     : () => {

         return state.setIn(['flags', 'showAccountModal'], false)
     },
     // 选择项目单位
     [ActionTypes.CHARGE_ITEM_CHECKBOX_SELECT]               : () => {

             const showLowerList = state.getIn(['flags', 'selectList'])
             const selectItemList = state.getIn(['flags', 'selectItem'])
             if (!action.checked) {
                     // 原来没选
                     const newShowLowerList = showLowerList.push(action.uuid)
                     const newSelectItemList = selectItemList.push(fromJS({uuid:action.uuid,name:action.name,code:action.code}))

                     return state.setIn(['flags', 'selectList'], newShowLowerList)
                                 .setIn(['flags', 'selectItem'], fromJS(newSelectItemList))
             } else {
                     // 原来选了
                     const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                     const newSelectItemList = selectItemList.splice(showLowerList.findIndex(v => v.uuid === action.uuid), 1)

                     return state.setIn(['flags', 'selectList'], newShowLowerList)
                                 .setIn(['flags', 'selectItem'], fromJS(newSelectItemList))
             }

     },
     [ActionTypes.INIT_COMMON_CHARGE]                           :() => {
         const paymentInsertOrModify = lrAccountState.getIn(['flags','paymentInsertOrModify'])
         if (action.saveAndNew) {
             const flags = lrAccountState.get('flags')
             const runningDate = state.getIn(['commonChargeTemp','runningDate'])
             const commonChargeTemp = lrAccountState.get('commonChargeTemp')

             return state.set('commonChargeTemp',commonChargeTemp)
                         .setIn(['commonChargeTemp', 'runningDate'],runningDate)
                        .setIn(['flags', 'isQuery'],false)
                        .setIn(['flags','modify'],false)
                        .setIn(['flags', 'paymentInsertOrModify'], 'insert')
                        .setIn(['flags', 'indexList'], fromJS([]))
                        .setIn(['flags', 'selectList'], fromJS([]))
                        .set('enclosureList', fromJS([]))
                        .set('label', fromJS([]))
                        .set('needDeleteUrl', fromJS([]))
         }
        if(paymentInsertOrModify === 'insert') {
            state = state.setIn(['commonChargeTemp','uuid'], action.uuid)
                        .setIn(['commonChargeTemp','flowNumber'], action.flowNumber)
        }
         return state.setIn(['flags', 'paymentInsertOrModify'], 'modify')
                    .setIn(['flags','modify'],true)

     },
     [ActionTypes.INIT_COMMON_CHARGE_FROM_CXLS]                     :() => {
         const uuidList = state.getIn(['flags','uuidList'])
         if (action.uuidList || uuidList.size) {
             state = state.setIn(['flags','needRelaList'],true)
         }
         if (action.uuidList) {
             state = state.setIn(['flags', 'uuidList'], action.uuidList)
         } else if (action.uuidList.size) {
             state = state.setIn(['flags', 'uuidList'], action.uuidList)
         }
         const enclosureList = action.data.enclosureList ? action.data.enclosureList : []
         return state.set('commonChargeTemp',fromJS(action.data))
                    .set('enclosureList', fromJS(enclosureList))
                    .setIn(['flags', 'PageTab'], 'payment')
                    .setIn(['flags', 'paymentType'], 'LB_GGFYFT')
                    .setIn(['flags', 'modify'], true)
                    .setIn(['flags', 'paymentInsertOrModify'], 'modify')
                    .setIn(['flags','currentSwitchUuid'],action.uuid)
     },
     [ActionTypes.CHANGE_RUNNING_ENCLOSURE_LIST]			: () => { //改变附件列表的信息
         let enclosureList = [];
         state.get('enclosureList').map(v=>{
             enclosureList.push(v)
         })
         action.imgArr.forEach(v=>{
             enclosureList.push(v)
         })
         state = state.set('enclosureList', fromJS(enclosureList))
                     .set('enclosureCountUser', enclosureList.length)

         return state;
     },
     [ActionTypes.DELETE_UPLOAD_FJ_URL]			: () => { //删除上传的附件
         let needDeleteUrl = [];
         state.get('needDeleteUrl').map(v=>{
             needDeleteUrl.push(v)
         })
         state.get('enclosureList').map((v,i)=>{
             if (i == action.index) {
                 needDeleteUrl.push(state.getIn(['enclosureList',i]).set('beDelete',true))
                 state = state.deleteIn(['enclosureList',i])
             }
         })
         state = state.set('needDeleteUrl', fromJS(needDeleteUrl))
                     .set('enclosureCountUser', state.get('enclosureList').size)

         return state;
     },
     [ActionTypes.GET_LS_LABEL_FETCH]		: () => { //获取附件的标签
         state=state.set('label',fromJS(action.receivedData.data))
         .set('tagModal',true)
         return state;
     },
     [ActionTypes.CHANGE_LS_TAG_NAME]				: () => { //编辑标签名称
         state.get('enclosureList').map((v,i)=>{
             if(i == action.index){
                 state = state.setIn(['enclosureList',i,'label'],action.value)
             }
         })
         state=state.set('tagModal',false)
         return state;
     },
     [ActionTypes.AFTER_INSERT_JZSY]                        :() => {
        const paymentInsertOrModify = lrAccountState.getIn(['flags','paymentInsertOrModify'])
         const CqzcTemp = lrAccountState.get('CqzcTemp')
         const runningDate = state.getIn(['CqzcTemp','detail','runningDate'])
         if (action.saveAndNew) {
           return state.set('CqzcTemp',CqzcTemp)
                       .setIn(['CqzcTemp', 'detail', 'runningDate'],runningDate)
                      .setIn(['flags', 'isQuery'],false)
                      .setIn(['flags','modify'],false)
                      .setIn(['flags', 'paymentInsertOrModify'], 'insert')
                      .set('enclosureList', fromJS([]))
                      .set('label', fromJS([]))
                      .set('needDeleteUrl', fromJS([]))
         }
         if(paymentInsertOrModify === 'insert') {
             state = state.setIn(['CqzcTemp', 'detail','uuid'], action.uuid)
                         .setIn(['CqzcTemp', 'detail','flowNumber'], action.flowNumber)
         }
         return state.setIn(['flags', 'paymentInsertOrModify'], 'modify')
                    .setIn(['flags','modify'],true)
     },
     [ActionTypes.INIT_JZSY_FROM_CXLS] :() => {
         const uuidList = state.getIn(['flags','uuidList'])
         if (action.uuidList || uuidList.size) {
             state = state.setIn(['flags','needRelaList'],true)
         }
         if (action.uuidList) {
             state = state.setIn(['flags', 'uuidList'], action.uuidList)
         } else if (uuidList.size) {
             state = state.setIn(['flags', 'uuidList'], uuidList)
         }
         return state.setIn(['CqzcTemp','detail'],fromJS(action.data))
                    .setIn(['flags', 'PageTab'], 'payment')
                    .setIn(['flags', 'paymentType'], 'LB_JZSY')
                    .setIn(['flags', 'modify'], true)
                    .setIn(['flags', 'paymentInsertOrModify'], 'modify')
                    .setIn(['flags','currentSwitchUuid'],action.uuid)
                    .set('enclosureList', fromJS(action.data.enclosureList))
     }

	}[action.type] || (() => state))()
}

// 自动计算价税合计、税额、税率之间关系
function autoCalculateBillInfo(strJudgeType, state) {

    let priceTaxTotal = state.getIn(['cardTemp', 'priceTaxTotal'])
    let taxRate = Number(state.getIn(['cardTemp', 'taxRate'])) / 100
    let tax = state.getIn(['cardTemp', 'tax'])

    if (strJudgeType == 'priceTaxTotal') { //修改价税合计，计算税额
        tax = Number(priceTaxTotal) - Number(priceTaxTotal) / (1 + taxRate)
    } else if (strJudgeType == 'taxRate') { //修改税率，计算税额
        if (priceTaxTotal == '') {
            tax = ''
        } else {
            tax = Number(priceTaxTotal) - Number(priceTaxTotal) / (1 + taxRate)
        }
    }

    state = state.setIn(['cardTemp', 'tax'], Number(tax).toFixed(2))

    return state

}
