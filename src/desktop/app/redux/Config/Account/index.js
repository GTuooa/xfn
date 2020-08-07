import { fromJS }	from 'immutable'
import { showMessage } from 'app/utils'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const accountConfState = fromJS({
    flags: {
        currentPage: 'running',
        insertOrModify: 'insert',
        showModal: false,
        showZHModal: false,
        isTaxQuery:true,
        runningSelect: [],
        accountSelect: [],

        runningShowChild: [],

        currentAccount: {
            uuid: '',
            name: ''
        },

        currentAss: {
            assId: '',
            assCategory: '',
            assName: ''
        },
        selectAcList: [], //关联科目
        selectDepositedAcList: [], //定金管理科目
        selectCarryoverAcList: [], //成本科目
        selectStockAcList: [], //成本科目

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
            "beCarryover": true  // 是否结转成本
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
    accountTemp: {
        "uuid": '00000001',
        // 现金、一般户、基本户、支付宝、微信、其它
        // cash、general、basic、Alipay、WeChat、other
        "type": 'general',
        // “账户名称”为空时，则处填入“账户类型+账号后四位”
        "name": '',
        "openingName": "",
        "openingBank": "",
        "accountNumber": "",
        "beginAmount":"",
        // 库存现金、银行存款、其他货币资金中选择，所选关联科目不允许有辅助核算, 且不允许多个账户对应一个科目，提示：该科目已被其他账户关联
        "acId": "",
        "acFullName": "",
        "openInfo": false
    },
    taxRateTemp: {
        // 小规模纳税, 一般纳税人
        // small, general
        "scale": 'small',
        // 2221应交税费的末端科目
        "payableAcId": "",
        "payableAcFullName": "",
        "payableAssCategory": [],
        // 0%、3%、5%
        "payableRate": "3",
        // 暂未开票处理科目
        "notBillingAcId": "",
        "notBillingAcFullName": "",
        "notBillingAssCategory": [],
        // 进项税科目
        "inputAcId": "",
        "inputAcFullName": "",
        "inputAssCategory": [],
        // 待认证进项税科目
        "certifiedAcId": "",
        "certifiedAcFullName": "",
        "certifiedAssCategory": [],
        // 待转销项税科目
        "waitOutputAcId": "",
        "waitOutputAcFullName": "",
        "waitOutputAssCategory": [],
        // 销项税科目
        "outputAcId": "",
        "outputAcFullName": "",
        "outputAssCategory": [],
        // 转出未交增值税科目
        turnOutUnpaidAcId: '',
        turnOutUnpaidAcFullName: '',
        turnOutUnpaidAssCategory: '',
        // 未交增值税科目
        unpaidAcId: '',
        unpaidAcFullName: '',
        unpaidAssCategory: '',
        // 0%、3%、5%、6%、11%、17%
        "outputRate": "17"
    },

    // 流水类别
    runningCategory: [
        {
            'childList': []
        }
    ],
    regretCategory:[
        {
            'childList': []
        }
    ],
    regretTemp:{
        categoryName:'请选择流水类别',
        categoryUuid:'',
        isBalance:'',
        isBusiness:'',
        subordinateName:'',
        showConfirmModal:false,
        showModal:false
    },
    accountList: [
        {
            "uuid": '0000000',
            // 现金、一般户、基本户、支付宝、微信、其它
            "type": '',
            // “账户名称”为空时，则处填入“账户类型+账号后四位”
            "name": "全部",
            "openingName": "",
            "openingBank": "",
            "accountNumber": "",
            // 库存现金、银行存款、其他货币资金中选择，所选关联科目不允许有辅助核算
            "acId": "",
            "acFullName": "",
            childList: [
                // {
                //     "uuid": '00000001',
                //     // 现金、一般户、基本户、支付宝、微信、其它
                //     "type": 'basic',
                //     // “账户名称”为空时，则处填入“账户类型+账号后四位”
                //     "name": "基本户7221",
                //     "available": true,
                //     "openingName": "杭州小番网络科技有限sdfsdfsdfsdfsdfsdfsdfsdf",
                //     "openingBank": "中国民生银行杭州庆春支行",
                //     "accountNumber": "6212262201023557226",
                //     // 库存现金、银行存款、其他货币资金中选择，所选关联科目不允许有辅助核算
                //     "acId": "1002",
                //     "acFullName": "银行存款_基本"
                // },
                // {
                //     "uuid": '00000002',
                //     // 现金、一般户、基本户、支付宝、微信、其它
                //     // cash、general、basic、Alipay、WeChat、other
                //     "type": 'general',
                //     // “账户名称”为空时，则处填入“账户类型+账号后四位”
                //     "name": "一般户7222",
                //     "available": false,
                //     "openingName": "杭州小番网络科技有限",
                //     "openingBank": "中国民生银行杭州庆春支行",
                //     "accountNumber": "6212262201023557226",
                //     // 库存现金、银行存款、其他货币资金中选择，所选关联科目不允许有辅助核算
                //     "acId": "100202",
                //     "acFullName": "银行存款_农行"
                // }
            ]
        }
    ]
})


export default function handleLrb(state = accountConfState, action) {
	return ({
        [ActionTypes.INIT_ACCOUNTCONF]                         : () => accountConfState,
        [ActionTypes.GET_ACCOUNTCONF_ALL_SETTINGS]             : () => {

            return state = state.set('runningCategory', fromJS(action.receivedData.categoryList))
                                .set('accountList', fromJS(action.receivedData.accountList))
                                .set('taxRateTemp', fromJS(action.receivedData.rate))
        },
        [ActionTypes.GET_RUNNING_CATEGORY]                     : () => {
            let selectList = []
            action.receivedData.resultList[0]['childList'].forEach(v => selectList.push(v.uuid)) //默认展开一二级类别

            return state.set('runningCategory', fromJS(action.receivedData.resultList))
                        .setIn(['flags', 'runningShowChild'], fromJS(selectList))
                        .set('taxRateTemp', fromJS(action.receivedData.rate))
        },

        [ActionTypes.GET_RUNNING_ACCOUNT]                     : () => {
            return state.set('accountList', fromJS(action.receivedData.resultList))
        },

        [ActionTypes.GET_RUNNING_TAX_RATE]                     : () => {
            return state.set('taxRateTemp', fromJS(action.receivedData.result))
        },

        // 切换设置的页面
        [ActionTypes.CHANGE_ACCOUNTCONF_CURRENTPAGE]                     : () => {

            return state.setIn(['flags', 'currentPage'], action.currentPage)
        },
        // 预置流水和账户新增时的数据
        [ActionTypes.BEFORE_INSERT_ACCOUNTCONF]                     : () => {
            state = state.setIn(['flags', 'insertOrModify'], 'insert')
                        .set(`${action.currentPage}Temp`, accountConfState.get(`${action.currentPage}Temp`))
            if(action.currentPage === 'account'){
                state = state.setIn(['flags', 'showZHModal'], true)
            }else{
                if(action.insertFrom !== 'fromLrAccount'){
                    state = state.setIn(['flags', 'showModal'], true)
                }
            }

            if (action.data && action.currentPage === 'running') {
                const categoryType = action.data.categoryType
                const categoryTypeObj = {
        	        'LB_YYSR': 'acBusinessIncome',
        	        'LB_YYZC': 'acBusinessExpense',
        	        'LB_YYWSR': 'acBusinessOutIncome',
        	        'LB_YYWZC': 'acBusinessOutExpense',
        	        'LB_JK': 'acLoan',
        	        'LB_TZ': 'acInvest',
        	        'LB_ZB': 'acCapital',
        	        'LB_CQZC': 'acAssets',
        	        'LB_FYZC': 'acCost',
        	        'LB_ZSKX': 'acTemporaryReceipt',
        	        'LB_ZFKX': 'acTemporaryPay',
        	        'LB_XCZC': 'acPayment',
        	        'LB_SFZC': 'acTax',
        	    }[categoryType]
                if (action.data && action.currentPage === 'running') {
                    state = state.set(`${action.currentPage}Temp`, fromJS(action.data))
                                 .setIn([`${action.currentPage}Temp`, 'name'], '')
                                 .setIn([`${action.currentPage}Temp`, 'uuid'], '')
                                 .setIn([`${action.currentPage}Temp`, 'runningAbstract'], '')
                                 .setIn([`${action.currentPage}Temp`, 'level'], action.item.get('level'))
                                 .setIn([`${action.currentPage}Temp`, categoryTypeObj, 'currentContactsRange'], fromJS(action.data[categoryTypeObj].contactsRange))
                                 .setIn([`${action.currentPage}Temp`, categoryTypeObj, 'currentStockRange'], fromJS(action.data[categoryTypeObj].stockRange))
                                 .setIn([`${action.currentPage}Temp`, 'curPropertyCostList'], fromJS(action.data.propertyCostList))
                                 .setIn([`${action.currentPage}Temp`, 'currentProjectRange'], fromJS(action.data.projectRange))
                } else {

                }
                const insertOrModify = state.getIn(['flags','insertOrModify'])
                if (action.data.categoryType === 'LB_CQZC' && insertOrModify === 'insert' && action.data.name === '长期资产') {
                    if (action.data.propertyAssets === 'SX_GDZC' && !action.data.acAssets.canInsertFixed
                        || action.data.propertyAssets === 'SX_WXZC' && !action.data.acAssets.canInsertUnVisible
                        || action.data.propertyAssets === 'SX_TZXFDC' && !action.data.acAssets.canInsertEstate

                    ) {
                        state = state.setIn([`${action.currentPage}Temp`, 'propertyAssets'], '')

                    }
                }
                state = state.setIn([`${action.currentPage}Temp`, 'property'], action.data.property)
                            .setIn([`${action.currentPage}Temp`, 'parentUuid'], action.item.get('uuid'))
                            .setIn([`${action.currentPage}Temp`, 'parentName'], action.data.name)
                            .setIn([`${action.currentPage}Temp`, 'categoryType'], action.data.categoryType)
            }

            return state

        },
        [ActionTypes.BEFORE_MODIFY_ACCOUNTCONF_RUNNING_OLD]                     : () => {  // 出错

            if(action.currentPage === 'account'){
                state = state.setIn(['flags', 'showZHModal'], true)
            }else{
                state = state.setIn(['flags', 'showModal'], true)
            }
          if(action.old) {
            return state.setIn(['flags', 'insertOrModify'], 'modify')
                        .set(`${action.currentPage}Temp`, action.item)
          }
            return state.setIn(['flags', 'insertOrModify'], 'modify')
                        .set(`${action.currentPage}Temp`, fromJS(action.name))
                        .setIn([`${action.currentPage}Temp`, 'categoryType'], fromJS(action.name).get('categoryType'))
                        .setIn([`${action.currentPage}Temp`, 'parentUuid'], action.item.get('parentUuid'))
                        .setIn([`${action.currentPage}Temp`, 'parentName'], action.item.get('parentName'))
                        .setIn([`${action.currentPage}Temp`, 'currentPropertyPay'], action.item.get('propertyPay'))
                        .setIn([`${action.currentPage}Temp`, 'currentPropertyTax'], action.item.get('propertyTax'))
                        .setIn([`${action.currentPage}Temp`, 'currentPropertyAssets'], action.item.get('propertyAssets'))
                        .setIn([`runningTemp`, 'currentPropertyInvest'], action.item.get('propertyInvest'))
        },
        // 关闭流水和账户编辑Modal框
        [ActionTypes.CLOSE_ACCOUNTCONF_MODAL]                     : () => {

            return state.setIn(['flags', 'showModal'], false)
                        .setIn(['flags', 'showZHModal'], false)
        },

        // 流水类别是否显示下级
        [ActionTypes.ACCOUNTCONF_RUNNING_TRIANGLE_SWITCH]          : () => {

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

        // 流水类别checkBox选择
        [ActionTypes.ACCOUNTCONF_RUNNING_CHECKBOX_CHECK]          : () => {

            const upperArr = action.upperArr
            const item = action.item
            let selectList = state.getIn(['flags', 'runningSelect'])

            if (selectList.indexOf(item.get('uuid')) === -1) {

                const loop = data => data.map(v => {
                        if (selectList.indexOf(v.get('uuid')) === -1) {
                            selectList = selectList.push(v.get('uuid'))
                            if (v.get('childList') && v.get('childList').size) {
                                loop(v.get('childList'))
                            }
                            if (v.get('disableList') && v.get('disableList').size) {
                                loop(v.get('disableList'))
                            }
                        }
                })

                selectList = selectList.push(item.get('uuid'))

                if (item.get('childList') && item.get('childList').size) {
                    loop(item.get('childList'))
                }
                if (item.get('disableList') && item.get('disableList').size) {
                    loop(item.get('disableList'))
                }
                state = state.setIn(['flags', 'runningSelect'], selectList)

                return state

            } else {
                const loopDel = data => data.map(v => {
                        if (selectList.indexOf(v.get('uuid')) > -1) {
                            const idx = selectList.findIndex(x => x === v.get('uuid'))
                            selectList = selectList.splice(idx, 1)
                        }
                        if (v.get('childList') && v.get('childList').size) {
                            loopDel(v.get('childList'))
                        }
                        if (v.get('disableList') && v.get('disableList').size) {
                            loopDel(v.get('disableList'))
                        }
                })
                const idx = selectList.findIndex(v => v === item.get('uuid'))
                selectList = selectList.splice(idx, 1)
                if (item.get('childList') && item.get('childList').size) {
                    loopDel(item.get('childList'))
                }
                if (item.get('disableList') && item.get('disableList').size) {
                    loopDel(item.get('disableList'))
                }
                selectList = selectList.filter(v => upperArr.indexOf(v) === -1)
                return state.setIn(['flags', 'runningSelect'], selectList)
            }
        },
        // 流水全选
        // [ActionTypes.SELECT_OR_UNSELECT_RUNNING_ALL]                          : () => {
        //
        //     if (action.selectAll) {
        //         // 全不选
        //         return state.setIn(['flags', 'runningSelect'], fromJS([]))
        //     } else {
        //         // 全选 purchasingClassList
        //         const runningCategory = state.get('runningCategory')
        //         let selectAllList = []
        //         const loop = data => data.map(v => {
        //
        //             // 这俩不能被选中删除
        //             if (v.get('name') !== '工资支出' && v.get('name') !== '内部转账') {
        //                 selectAllList.push(v.get('uuid'))
        //             }
        //
        //             if (v.get('childList').size) {
        //                 loop(v.get('childList'))
        //             }
        //         })
        //         // 遍历得到所有节点集合
        //         loop(runningCategory)
        //
        //         return state.setIn(['flags', 'runningSelect'], fromJS(selectAllList))
        //     }
        // },
        // 账户全选
        [ActionTypes.SELECT_OR_UNSELECT_ACCOUNT_ALL]                          : () => {


            if (action.selectAll) {
                // 全不选
                return state.setIn(['flags', 'accountSelect'], fromJS([]))
            } else {
                // 全选 accountList
                const accountList = state.getIn(['accountList', 0, 'childList'])
                let selectAllList = []

                accountList.forEach(v => selectAllList.push(v.get('uuid')))

                return state.setIn(['flags', 'accountSelect'], fromJS(selectAllList))
            }
        },
        // 账户 checkBox
        [ActionTypes.ACCOUNTCONF_ACCOUNT_CHECKBOX_CHECK]          : () => {

            const showLowerList = state.getIn(['flags', 'accountSelect'])

            if (!action.checked) {
                // 原来没选
                const newShowLowerList = showLowerList.push(action.uuid)
                return state.setIn(['flags', 'accountSelect'], newShowLowerList)
            } else {
                // 原来选了
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                return state.setIn(['flags', 'accountSelect'], newShowLowerList)
            }
        },

        // 税率设置
        [ActionTypes.ACCOUNTCONF_TAX_RATE_SETTING_SCALE]            : () => {
            return state.setIn(['taxRateTemp', 'scale'], action.value)
        },


        [ActionTypes.SELECT_ACCOUNTCONF_UPPER_CATEGORY]             : () => {
            const valueList = action.value.split(Limit.TREE_JOIN_STR)

            return state.setIn(['runningTemp', 'parentUuid'], valueList[0])
                        .setIn(['runningTemp', 'parentName'], valueList[1])
                        .setIn(['runningTemp', 'property'], valueList[2])
                        .setIn(['runningTemp', 'categoryType'], valueList[3])
                        .setIn(['runningTemp', 'beSpecial'], valueList[1] === '业务收入' || valueList[1] === '成本支出' ? true : false)

        },

        [ActionTypes.CHANGE_ACCOUNTCONF_COMMON_STRING]             : () => {

            return state.setIn( action.placeArr, action.value)

        },

        [ActionTypes.CHANGE_ACCOUNTCONF_ACCOUNT_NUMBER]             : () => {

            const name = state.getIn(['accountTemp', 'name'])

            if (name === '') {
                state = state.setIn(['accountTemp', 'name'], action.accountType + '' + (action.value.length > 4 ? action.value.substr(action.value.length - 4) : action.value))
            }

            return state
        },

        [ActionTypes.SELECT_ACCOUNTCONF_ALL_AC]             : () => {

            return state.setIn([`${action.tab}Temp`, action.place ? `${action.place}AcId` : 'acId'], action.acId)
                        .setIn([`${action.tab}Temp`, action.place ? `${action.place}AcFullName` : 'acFullName'], action.acFullName)
                        .setIn([`${action.tab}Temp`, action.place ? `${action.place}AssCategory` : 'assCategoryList'], action.asscategorylist)
        },

        [ActionTypes.SELECT_ACCOUNTCONF_MULTIPLE_AC]        : () => {
            state = state.setIn( action.placeArr, fromJS(action.acList))

            //针对收付管理，定金管理科目做处理
            if (action.assPlace) {
                state = state.setIn(['runningTemp', action.assPlace], fromJS(action.assList))
            }

            return state
        },

        [ActionTypes.AFTER_UPDATE_ACCOUNTCONF_RUNNING_CATEGORY]  : () => {

            state = state.set('runningCategory', fromJS(action.receivedData.resultList))
                            .setIn(['flags', 'runningSelect'], fromJS([]))

            state = state.setIn(['flags', 'showModal'], false)
                         .setIn(['flags', 'showZHModal'], false)
            return state
        },

        [ActionTypes.AFTER_UPDATE_ACCOUNTCONF_ACCOUNT]  : () => {

            state = state.set('accountList', fromJS(action.receivedData.resultList))
            if (action.saveAndNew) {

                state = state.set('accountTemp', accountConfState.get('accountTemp'))

            } else {
                state = state.setIn(['flags', 'showModal'], false)
                             .setIn(['flags', 'showZHModal'], false)
            }

            return state
        },
        [ActionTypes.CHANGE_ACCOUNTCONF_PROPERTY]  : () => {
          state = state.setIn(action.placeArr, fromJS(action.valArr))
          return state
      },
        [ActionTypes.CHANGE_ITEM_DISABLE_STATUS]  : () => {
            let item = state.getIn(['runningCategory',0,...action.placeArr]).toJS()
            const loop = (list) => {
                for(let i in list) {
                    list[i].canUse = !action.disabled
                    list[i].childList.length && loop (list[i].childList)
                    list[i].disableList && list[i].disableList.length && loop (list[i].disableList)
                }
            }
            item.childList && item.childList.length && loop (item.childList)
            item.disableList && item.disableList.length && loop (item.disableList)

            return state.setIn(['runningCategory',0,...action.placeArr],fromJS(item))
                        .setIn(['runningCategory',0,...action.placeArr,'canUse'],!action.disabled)
        },
        [ActionTypes.GET_REGRET_CATEGORY]                     : () => {

            return state.set('regretCategory', fromJS(action.receivedData.result))
        },
        [ActionTypes.CHANGE_REGRET_ACCOUNT_ACCOUNT_NAME]        : () => {

            const valueList = action.value.split(Limit.TREE_JOIN_STR)
            return state = state.setIn([`${action.tab}Temp`, action.placeUUid], valueList[0])
                                .setIn([`${action.tab}Temp`, action.placeName], valueList[1])
                                .setIn([`${action.tab}Temp`, action.isBalance], valueList[2])
                                .setIn([`${action.tab}Temp`, action.isBusiness], valueList[3])
        },
        [ActionTypes.CHANGE_REGRET_ACCOUNT_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        [ActionTypes.CHANGE_REGRET_CANCLE]       : () => {
            return state = state.setIn(['regretTemp', 'categoryUuid'], '')
                                .setIn(['regretTemp', 'categoryName'], '请选择流水类别')
                                .setIn(['regretTemp', 'isBalance'], '')
                                .setIn(['regretTemp', 'isBusiness'], '')
                                .setIn(['regretTemp', 'subordinateName'], '')
                                .setIn(['regretTemp', 'showModal'], false)
                                .setIn(['regretTemp', 'showConfirmModal'], false)
        }

	}[action.type] || (() => state))()
}
