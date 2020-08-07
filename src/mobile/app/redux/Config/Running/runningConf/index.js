import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { categoryTypeObj } from 'app/constants/editRunning.js'

//生产环境应当设置为空
const runningConfState = fromJS({
	views: {
		runningSelect: [],
		showModal: false,
        showZHModal: false,
		runningShowChild: [],
        insertOrModify: 'insert',
		allItemCheckBoxDisplay: false,
		allItemModifyButtonDisplay: false,
		toolBarDisplayIndex: 1,
		isChangePoistion: false,
        notShowRegretList:[],
		regretCategoryList: [],

		rangeSelectTitle: '',
		rangeSelectGroup: [],
		groupData: [],
	},
	regretTemp:{
		subordinateName: '',
        hasBalance: false,
        hasBusiness: false,
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
        "categoryType": "",//流水类型
        "propertyInvest": "",// 投资属性
        // "acId": "",
        // "acFullName": "",
        // "assCategoryList": [],
        "acList": [],
        // 科目是否可用
        "canDelete": true,
        "beSpecial": false, //是否属于业务收入和成本支出
        "acAvailable": true,

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
			"beZeroInventory": false //启用零库存模式
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

})

export default function handleRunningConfState(state = runningConfState, action) {
	return ({
		[ActionTypes.INIT_RUNNING_CONF]						         : () => runningConfState,
		[ActionTypes.CHANGE_RUNNING_CONF_STATUS]                     : () => {
			//let selectList = []
            //action.receivedData.resultList[0] && action.receivedData.resultList[0]['childList'].forEach(v => selectList.push(v.uuid)) //默认展开一二级类别

			return state.setIn(['views', 'runningShowChild'], fromJS([]))
                        .set('regretTemp',runningConfState.get('regretTemp'))
		},
		[ActionTypes.BEFORE_EDIT_RNNING_REGRET]                     : () => {
			return state.set('regretTemp',runningConfState.get('regretTemp'))
		},
		[ActionTypes.CHANGE_RUNNING_CONF_DATA]                     : () => {
			return state.setIn(action.dataType, action.value)
		},
		[ActionTypes.RUNNING_SHOW_ALL_ITEM_MODIFY_BUTTON]		: () => state.setIn(['views','toolBarDisplayIndex'], 3).setIn(['views','allItemModifyButtonDisplay'], true),
		[ActionTypes.RUNNING_HIDE_ALL_ITEM_MODIFY_BUTTON]		: () => state.setIn(['views','toolBarDisplayIndex'], 1).setIn(['views','allItemModifyButtonDisplay'], false).setIn(['views','isChangePoistion'], false),
		[ActionTypes.RUNNING_SHOW_ALL_ITEM_CHECKBOX]			: () => state.setIn(['views','toolBarDisplayIndex'], 2).setIn(['views','allItemCheckBoxDisplay'], true),
		[ActionTypes.UPDATE_RUNNINGCONF_RUNNING_CATEGORY]  : () => {
            state = state.setIn(['views', 'runningSelect'], fromJS([]))
						.setIn(['views', 'showModal'], false)
            return state
        },
		[ActionTypes.HIDE_CHOOSE_ITEM_CEHCKBOX]  :() => {
			return	state.setIn(['views','runningSelect'],fromJS([]))
						.setIn(['views','toolBarDisplayIndex'],1)
						.setIn(['views','allItemCheckBoxDisplay'],false)
		},
		// 流水类别checkBox选择
        [ActionTypes.RUNNINGCONF_RUNNING_CHECKBOX_CHECK]          : () => {

            const uuidList = action.uuidList
            const uuid = action.uuid
            let selectList = state.getIn(['views', 'runningSelect']).toJS()
            if (selectList.indexOf(uuid) === -1) {
                selectList = [...selectList,uuid]
				uuidList.forEach(v => {
					selectList.indexOf(v) === -1 && selectList.push(v)
				})
                state = state.setIn(['views', 'runningSelect'], fromJS(selectList))
                return state
            } else {
				selectList.splice(selectList.findIndex(w => w === uuid),1)
				uuidList.map(v => {
					const idx = selectList.findIndex(w => w === v)
					idx > -1 && selectList.splice(idx,1)
				})


                return state.setIn(['views', 'runningSelect'], fromJS(selectList))
            }
        },
		[ActionTypes.BEFORE_INSERT_RUNNING_CONF]                     : () => {
            state = state.setIn(['views', 'insertOrModify'], 'insert')
                        .set(`runningTemp`, runningConfState.get('runningTemp'))

            if (action.item) {
                if (action.data) {
                    state = state.set(`runningTemp`, fromJS(action.data))
                                 .setIn([`runningTemp`, 'name'], '')
                                 .setIn([`runningTemp`, 'uuid'], '')
                }
                const insertOrModify = state.getIn(['views','insertOrModify'])
                if (action.data.categoryType === 'LB_CQZC' && insertOrModify === 'insert' && action.data.name === '长期资产') {
                    if (action.data.propertyAssets === 'SX_GDZC' && !action.data.acAssets.canInsertFixed
                        || action.data.propertyAssets === 'SX_WXZC' && !action.data.acAssets.canInsertUnVisible
                        || action.data.propertyAssets === 'SX_TZXFDC' && !action.data.acAssets.canInsertEstate

                    ) {
                        state = state.setIn([`runningTemp`, 'propertyAssets'], '')

                    }
                }
                const categoryType = action.item.get('categoryType')
                const curCategoryTypeObj = categoryTypeObj[categoryType]
                state = state.setIn([`runningTemp`, 'property'], action.data.property)
                            .setIn([`runningTemp`, 'level'], action.item.get('level'))
                            .setIn([`runningTemp`, curCategoryTypeObj, 'currentContactsRange'], fromJS(action.data[curCategoryTypeObj].contactsRange))
                            .setIn([`runningTemp`, 'curPropertyCostList'], fromJS(action.data.propertyCostList))
                            .setIn([`runningTemp`, curCategoryTypeObj, 'currentStockRange'], fromJS(action.data[curCategoryTypeObj].stockRange))
                            .setIn([`runningTemp`, 'parentUuid'], action.item.get('uuid'))
                            .setIn([`runningTemp`, 'parentName'], action.data.name)
                            .setIn([`runningTemp`, 'categoryType'], action.data.categoryType)
                            .setIn([`runningTemp`, 'currentProjectRange'], fromJS(action.data.projectRange))
            }

            return state

        },
		[ActionTypes.BEFORE_MODIFY_RUNNING_CONF_RUNNING]                     : () => {
			const item = fromJS(action.item)
            const categoryType = item.get('categoryType')
            const curCategoryTypeObj = categoryTypeObj[categoryType]

            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .set(`runningTemp`, item)
                        .setIn([`runningTemp`, 'categoryType'], item.get('categoryType'))
                        .setIn([`runningTemp`, 'parentUuid'], item.get('parentUuid'))
                        .setIn([`runningTemp`, 'level'], item.get('level'))
                        .setIn([`runningTemp`, 'canUse'], item.get('canUse'))
                        .setIn([`runningTemp`, curCategoryTypeObj, 'currentContactsRange'], item.getIn([curCategoryTypeObj, 'contactsRange']))
                        .setIn([`runningTemp`, curCategoryTypeObj, 'currentStockRange'], item.getIn([curCategoryTypeObj, 'stockRange']))
                        .setIn([`runningTemp`, 'parentName'], item.get('parentName'))
                        .setIn([`runningTemp`, 'currentPropertyPay'], item.get('propertyPay'))
                        .setIn([`runningTemp`, 'currentPropertyTax'], item.get('propertyTax'))
                        .setIn([`runningTemp`, 'currentPropertyAssets'], item.get('propertyAssets'))
                        .setIn([`runningTemp`, 'currentPropertyInvest'], item.get('propertyInvest'))
                        .setIn([`runningTemp`, 'parentName'], action.parentName)
        },
		[ActionTypes.RUNNINGCONF_RUNNING_TRIANGLE_SWITCH]				: () => {
			const runningShowChild = state.getIn(['views', 'runningShowChild'])

			if (runningShowChild.indexOf(action.uuid) > -1)
				return state.updateIn(['views','runningShowChild'], v => v.map(w => w === action.uuid ? '' : w).filter(w => !!w))
			else
				return state.updateIn(['views','runningShowChild'], v => v.push(action.uuid))
		},
		[ActionTypes.CHANGE_RUNNING_TEMP]				: () => {
			return state.setIn(action.placeArr, action.value)
		},
		[ActionTypes.CHANGE_RUNNING_CONF_PROPERTY]  : () => {

			if (action.checked) {
				state = state.setIn(action.placeArr, fromJS([action.value]))
							.updateIn(['views', 'groupData'], v => v.push(action.value))
			} else {
				state = state.updateIn(action.placeArr, v => v.filter(w => w !== action.value))
							.updateIn(['views', 'groupData'], v => v.filter(w => w !== action.value))
			}
			return state
		},
		[ActionTypes.CHANGE_XCZC_RUNNING_CONF_PROPERTY]  : () => {
			if (action.checked) {
				state = state.setIn(action.placeArr, action.checked)
							.updateIn(['views', 'groupData'], v => v.push(action.value))
			} else {
				state = state.setIn(action.placeArr, action.checked)
							.updateIn(['views', 'groupData'], v => v.filter(w => w !== action.value))
			}
			return state
		},
		[ActionTypes.RUNNING_CONF_REGRET_CHANGE_CHILD]				: () => {
			const notShowRegretList = state.getIn(['views', 'notShowRegretList'])

			if (notShowRegretList.indexOf(action.uuid) > -1)
				return state.updateIn(['views','notShowRegretList'], v => v.map(w => w === action.uuid ? '' : w).filter(w => !!w))
			else
				return state.updateIn(['views','notShowRegretList'], v => v.push(action.uuid))
		},
		[ActionTypes.GET_REGRET_RUNNING_CATEGORY]                     : () => {
			return state.setIn(['views', 'regretCategoryList'], fromJS(action.receivedData.result))
		},

		[ActionTypes.RUNNING_CONFIG_SELECT_CARD_RANGE]                : () => {
			return state = state.setIn(['views', 'rangeSelectTitle'], action.rangeSelectTitle)
								.setIn(['views', 'rangeSelectGroup'], action.rangeSelectGroup)
								.setIn(['views', 'groupData'], action.groupData)
		}

	}[action.type] || (() => state))()
}
