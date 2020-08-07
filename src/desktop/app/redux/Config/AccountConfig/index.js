import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const accountConfigState = fromJS({
	views: {
		insertOrModify: 'insert',
		accountSelect: [],
	},
	accountTemp: {
		'uuid': '00000001',
        // 现金、一般户、基本户、支付宝、微信、其它
        // cash、general、basic、Alipay、WeChat、other
        'type': 'general',
        // “账户名称”为空时，则处填入“账户类型+账号后四位”
        'name': '',
        'openingName': "",
        'openingBank': "",
        'accountNumber': "",
        'beginAmount': "",
        // 库存现金、银行存款、其他货币资金中选择，所选关联科目不允许有辅助核算, 且不允许多个账户对应一个科目，提示：该科目已被其他账户关联
        'acId': "",
        'acFullName': "",
        'openInfo': false,
		'needPoundage':false,
		'poundage':'',
		'poundageRate':''
	},
	poundageTemp:{
		categoryUuid:'',
		poundageNeedProject:'',
		poundageNeedCurrent:'',
		item:{},
		insertOrModify:'insert'
	},
	regretTemp:{
		accountRegretList:[]

	},
	accountList:[]
})

export default function handleAccountConfig(state = accountConfigState, action) {
	return ({
		[ActionTypes.INIT_ACCOUNT_CONFIG]						    : () => accountConfigState,
		// 预置流水和账户新增时的数据
        [ActionTypes.BEFORE_INSERT_ACCOUNTCONF]                     : () => {
            state = state.setIn(['views', 'insertOrModify'], 'insert')
                        .set('accountTemp', accountConfigState.get('accountTemp'))
            // if (action.currentPage === 'account') {
            //     // state = state.setIn(['views', 'showZHModal'], true)
            // } else {
            //     if (action.insertFrom !== 'fromLrAccount') {
            //         state = state.setIn(['views', 'showModal'], true)
            //     }
            // }

            // if (action.data && action.currentPage === 'running') {
            //     const categoryType = action.data.categoryType
            //     const categoryTypeObj = {
			// 		'LB_YYSR': 'acBusinessIncome',
			// 		'LB_YYZC': 'acBusinessExpense',
			// 		'LB_YYWSR': 'acBusinessOutIncome',
			// 		'LB_YYWZC': 'acBusinessOutExpense',
			// 		'LB_JK': 'acLoan',
			// 		'LB_TZ': 'acInvest',
			// 		'LB_ZB': 'acCapital',
			// 		'LB_CQZC': 'acAssets',
			// 		'LB_FYZC': 'acCost',
			// 		'LB_ZSKX': 'acTemporaryReceipt',
			// 		'LB_ZFKX': 'acTemporaryPay',
			// 		'LB_XCZC': 'acPayment',
			// 		'LB_SFZC': 'acTax',
			// 	}[categoryType]
            //     if (action.data && action.currentPage === 'running') {
            //         state = state.set(`${action.currentPage}Temp`, fromJS(action.data))
            //                      .setIn([`${action.currentPage}Temp`, 'name'], '')
            //                      .setIn([`${action.currentPage}Temp`, 'uuid'], '')
            //                      .setIn([`${action.currentPage}Temp`, 'runningAbstract'], '')
            //                      .setIn([`${action.currentPage}Temp`, 'level'], action.item.get('level'))
            //                      .setIn([`${action.currentPage}Temp`, categoryTypeObj, 'currentContactsRange'], fromJS(action.data[categoryTypeObj].contactsRange))
            //                      .setIn([`${action.currentPage}Temp`, categoryTypeObj, 'currentStockRange'], fromJS(action.data[categoryTypeObj].stockRange))
            //                      .setIn([`${action.currentPage}Temp`, 'curPropertyCostList'], fromJS(action.data.propertyCostList))
            //                      .setIn([`${action.currentPage}Temp`, 'currentProjectRange'], fromJS(action.data.projectRange))
            //     } else {
			//
            //     }
            //     const insertOrModify = state.getIn(['views','insertOrModify'])
            //     if (action.data.categoryType === 'LB_CQZC' && insertOrModify === 'insert' && action.data.name === '长期资产') {
            //         if (action.data.propertyAssets === 'SX_GDZC' && !action.data.acAssets.canInsertFixed
            //             || action.data.propertyAssets === 'SX_WXZC' && !action.data.acAssets.canInsertUnVisible
            //             || action.data.propertyAssets === 'SX_TZXFDC' && !action.data.acAssets.canInsertEstate
			//
            //         ) {
            //             state = state.setIn([`${action.currentPage}Temp`, 'propertyAssets'], '')
			//
            //         }
            //     }
            //     state = state.setIn([`${action.currentPage}Temp`, 'property'], action.data.property)
            //                 .setIn([`${action.currentPage}Temp`, 'parentUuid'], action.item.get('uuid'))
            //                 .setIn([`${action.currentPage}Temp`, 'parentName'], action.data.name)
            //                 .setIn([`${action.currentPage}Temp`, 'categoryType'], action.data.categoryType)
            // }

            return state

        },
		[ActionTypes.AFTER_UPDATE_ACCOUNTCONF_ACCOUNT]              : () => {

            if (action.saveAndNew) {
                state = state.set('accountTemp', accountConfigState.get('accountTemp'))
            }

            return state
        },
		// 账户全选
        [ActionTypes.SELECT_OR_UNSELECT_ACCOUNT_ALL]                          : () => {


            if (action.selectAll) {
                // 全不选
                return state.setIn(['views', 'accountSelect'], fromJS([]))
            } else {
                // 全选 accountList
                let selectAllList = []
                action.accountList.forEach(v => selectAllList.push(v.get('uuid')))
				action.disableList.forEach(v => selectAllList.push(v.get('uuid')))
                return state.setIn(['views', 'accountSelect'], fromJS(selectAllList))
            }
        },
		// 账户 checkBox
        [ActionTypes.ACCOUNTCONF_ACCOUNT_CHECKBOX_CHECK]          : () => {

            const showLowerList = state.getIn(['views', 'accountSelect'])

            if (!action.checked) {
                // 原来没选
                const newShowLowerList = showLowerList.push(action.uuid)
                return state.setIn(['views', 'accountSelect'], newShowLowerList)
            } else {
                // 原来选了
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                return state.setIn(['views', 'accountSelect'], newShowLowerList)
            }
        },

		[ActionTypes.BEFORE_MODIFY_ACCOUNTCONF_RUNNING]                     : () => {
            return state.setIn(['views', 'insertOrModify'], 'modify')
                        .set('accountTemp', action.item)
        },
		[ActionTypes.CLOSE_ACCOUNTCONF_MODAL_LR]                     : () => {

            return state.setIn(['views', 'showAccountModal'], false)
        },
		[ActionTypes.CHANGE_ACCOUNTCONF_ACCOUNT_NUMBER]             : () => {

            const name = state.getIn(['accountTemp', 'name'])

            if (name === '') {
                state = state.setIn(['accountTemp', 'name'], action.accountType + '' + (action.value.length > 4 ? action.value.substr(action.value.length - 4) : action.value))
            }

            return state
        },
		[ActionTypes.CHANGE_ACCOUNTCONFIG_COMMON_STRING]             : () => {
            return state.setIn(action.placeArr, action.value)
        },
		[ActionTypes.CLOSE_ACCOUNTCONF_MODAL]                     : () => {

            return state.setIn(['views', 'showModal'], false)
                        .setIn(['views', 'showZHModal'], false)
        },
		[ActionTypes.INIT_POUNDAGE_TEMP]                     : () => {
			const poundageTemp = accountConfigState.get('poundageTemp')
			return state.set('poundageTemp',poundageTemp)
        },
		[ActionTypes.GET_POUNDGE_ACCOUNT]                     : () => {
			state = state.set('poundageTemp',fromJS(action.data))
						.setIn(['poundageTemp','item'],fromJS({}))
			if (action.data.uuid) {
				state = state.setIn(['poundageTemp','insertOrModify'],'modify')
			} else {
				state = state.setIn(['poundageTemp','insertOrModify'],'insert')
			}
			return state

        },
		[ActionTypes.INIT_REGRETTEMP]					: () => {
			return state.set('regretTemp',accountConfigState.get('regretTemp'))
		},
		[ActionTypes.GET_ACCOUNT_CONFIG_LIST]					: () => {
			return state.set('accountList', fromJS(action.list))
					.setIn(['views', 'pageCount'], action.pageCount || 1)
					.setIn(['views', 'currentPage'], action.currentPage || 1)
		},
		[ActionTypes.CHANGE_ACCOUNT_CARD_USED_STATUS]           : () => {
            state.getIn(['accountList',0,'disableList']).map((item, index) => {
                if (item.get('uuid') === action.accountUuid) {
                    state = state.setIn(['accountList',0,'disableList',index,'canUse'], action.used)
                }
            })
			state.getIn(['accountList',0,'childList']).map((item, index) => {
                if (item.get('uuid') === action.accountUuid) {
                    state = state.setIn(['accountList',0,'childList',index,'canUse'], action.used)
                }
            })
            return state
        },


	}[action.type] || (() => state))()
}
