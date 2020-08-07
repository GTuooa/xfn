import { fromJS }	from 'immutable'
import { showMessage } from 'app/utils'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { message } from 'antd'
import { formatDate } from 'app/utils'
//生产环境应当设置为空
const lrCalculateState = fromJS({
	flags: {
		circleStatus: true,
		runningInsertOrModify: 'insert',
        insertOrModify: 'insert',
		selectI:0,
		dealType:'',
		projectList:[], 
		projectRange:[],
		propertyCostList:[],
		dealCategory:[],
		beProject: false
	},
	costTransferTemp: {
		carryoverBusinessUuid: '',
		uuidList: [],
		stockCardUuidList:[],
		categoryUuid: '',
		runningState: 'STATE_YYSR_XS',
		// STATE_YYSR_XS STATE_YYSR_TS
		runningDate: formatDate(),
		runningAbstract: '销售存货结转成本',
		carryoverAmount: '',

		categoryName: '',
		acList:[
			// {
			// 	"acId":"",
			// 	"acName": "",
			// 	"type":"AC_STOCK"
			// },
			// {
			// 	"acId":"",
			// 	"acName": "",
			// 	"type":"AC_CARRYOVER"
			// }
		],
		assList:[
			// {
			// 	"assId":"",
			// 	"assCategory": "",
			// 	"assName": "",
			// 	"type":"AC_STOCK"
			// },
			// {
			// 	"assId":"",
			// 	"assCategory": "",
			// 	"assName": "",
			// 	"type":"AC_CARRYOVER"
			// }
		],
		stockList: [],
		stockCardList:[
			{
				code: '',
				name: '',
				amount: ''
			}
		],
		cardUuid:'',
		runningCategory: [
			{
				'childList': []
			}
		],
		enclosureList:[],
		needDeleteUrl:[],//需要删除的图片地址
		tagModal:false,//标签组件的显示与否
		label:[],//附件标签
	},
	rateAcAndAsslist: {
		acList: [],
		assList: []
	},
	invoiceAuthTemp: {
		authBusinessUuid: '',
		uuidList: [],
		billAuthType: 'BILL_AUTH_TYPE_CG',
		// BILL_AUTH_TYPE_CG BILL_AUTH_TYPE_TG
		runningDate: formatDate(),
		runningAbstract: '增值税专用发票认证',
		// categoryUuid为发票认证类别uuid
		categoryUuid: '',
		acList:[
			// {
			// 	"acId":"",
			// 	"acName": "",
			// 	"type":"AC_STOCK"
			// },
			// {
			// 	"acId":"",
			// 	"acName": "",
			// 	"type":"AC_CARRYOVER"
			// }
		],
		assList:[
			// {
			// 	"assId":"",
			// 	"assCategory": "",
			// 	"assName": "",
			// 	"type":"AC_STOCK"
			// },
			// {
			// 	"assId":"",
			// 	"assCategory": "",
			// 	"assName": "",
			// 	"type":"AC_CARRYOVER"
			// }
		],
		enclosureList:[],
		needDeleteUrl:[],//需要删除的图片地址
		tagModal:false,//标签组件的显示与否
		label:[],//附件标签
	},
	invoicingTemp: {
		makeOutBusinessUuid: '',
		uuidList: [],
		billMakeOutType: 'BILL_MAKE_OUT_TYPE_XS',
		// BILL_MAKE_OUT_TYPE_XS BILL_MAKE_OUT_TYPE_TS
		runningDate: formatDate(),
		runningAbstract: '收入开具发票',
		// categoryUuid为发票认证类别uuid
		categoryUuid: '',
		acList:[
			// {
			// 	"acId":"",
			// 	"acName": "",
			// 	"type":"AC_STOCK"
			// },
			// {
			// 	"acId":"",
			// 	"acName": "",
			// 	"type":"AC_CARRYOVER"
			// }
		],
		assList:[
			// {
			// 	"assId":"",
			// 	"assCategory": "",
			// 	"assName": "",
			// 	"type":"AC_STOCK"
			// },
			// {
			// 	"assId":"",
			// 	"assCategory": "",
			// 	"assName": "",
			// 	"type":"AC_CARRYOVER"
			// }
		],
		enclosureList:[],
		needDeleteUrl:[],//需要删除的图片地址
		tagModal:false,//标签组件的显示与否
		label:[],//附件标签
	},
	transferOutTemp: {
		uuidList: [],
		turnOutBusinessUuid: '',
		runningDate: formatDate(),
		runningAbstract: '转出未交增值税',
		handleMonth: '',
		enclosureList:[],
		needDeleteUrl:[],//需要删除的图片地址
		tagModal:false,//标签组件的显示与否
		label:[],//附件标签
	},
	InternalTransferTemp: {
		uuid:'',
		runningState:'STATE_ZZ',
		runningDate: formatDate(),
		runningAbstract: '内部转账',
		amount: '',
		categoryType:'',
		categoryUuid:'',
		fromAccountUuid: "",
		toAccountUuid: "",
		accountChildList: [],
		enclosureList:[],
		needDeleteUrl:[],//需要删除的图片地址
		tagModal:false,//标签组件的显示与否
		label:[],//附件标签

	},
	DepreciationTemp: {
		uuid:'',
		runningState:'STATE_CQZC_ZJTX',
		runningDate: formatDate(),
		runningAbstract: '资产折旧摊销',
		amount: '',
		categoryType:'',
		categoryUuid:'',
		assetType:'XZ_ZJTX',
		dealTypeList: [{
			childList:[]
		}],
		usedProject:false,
		projectCard: {
			name: '',
			code: '',
			uuid: '',
			amount: ''
		},
		propertyCost:'',
		enclosureList:[],
		needDeleteUrl:[],//需要删除的图片地址
		tagModal:false,//标签组件的显示与否
		label:[],//附件标签

	},
	costTransferList: [
		// {
        //     "uuid": "70834051ade3400892ea512ebd06d8c8",
        //     "flowNumber": "20180514001", //流水号
        //     "categoryName": "货物 有收付 有定金 有结转", //类别名
        //     "runningDate": "2018-05-14", //日期
        //     "runningAbstract": "销售", //摘要
        //     "amount": 3000, //总金额
        //     "handleAmount": 2000,
        //     "notHandleAmount": 0
        // }
	],
	invoiceAuthList: [

	],
	invoicingList: [

	],
	transferOutObj: {
		flowDtoList: [],
		inputAmount: '',
		inputCount: '',
		outputAmount: '',
		outputCount: ''
	},
	// 附件上传

    vcKey: 0,  //后台传来的草稿的标识
})

export default function handleLrb(state = lrCalculateState, action) {
	return ({
		[ActionTypes.INIT_LR_CALCULATE_STATE]						: () => lrCalculateState,

		[ActionTypes.SET_INVOIC_ASSLIST_FROM_SETTINGS]				: () => {
			// 预置 开具发票，发票认证，转出未交增值税的辅助核算
			return state = initRateAcAndAsslist(action.rate, state)
		},
		[ActionTypes.CHANGE_LR_CALCULATE_COMMON_STATE]				: () => {
		return state.setIn([action.parent, action.position], action.value)
		},
		[ActionTypes.CHANGE_LR_COST_TRANSFER_CATEGORY_UUID_AND_NAME]	: () => {

			// 如果类别有开启结转，填入科目和辅助核算
			if (action.acBusinessIncome.beCarryover) {
				const carryoverAc = action.acBusinessIncome.carryoverAc[0]
				const stockAc = action.acBusinessIncome.stockAc[0]

				// 填入类别对应的科目
				state = state.setIn(['costTransferTemp', 'acList'], fromJS([{
					acId: carryoverAc.acId,
					acName: carryoverAc.acFullName,
					type: carryoverAc.type
				}])).updateIn(['costTransferTemp', 'acList'], v => v.push(fromJS({
					acId: stockAc.acId,
					acName: stockAc.acFullName,
					type: stockAc.type
				})))

				// 清除数据
				state = state.setIn(['costTransferTemp', 'assList'], fromJS([]))
				// 如果有成本科目的辅助核算填入
				if (carryoverAc.assCategoryList.length) {
					carryoverAc.assCategoryList.forEach(v => {
						state = state.updateIn(['costTransferTemp', 'assList'], w => w.push(
							fromJS({
								assId: '',
								assCategory: v,
								assName: '',
								type: carryoverAc.type
							})
						))
					})
				}
				// 如果有存货科目的辅助核算填入
				if (stockAc.assCategoryList.length) {
					stockAc.assCategoryList.forEach(v => {
						state = state.updateIn(['costTransferTemp', 'assList'], w => w.push(
							fromJS({
								assId: '',
								assCategory: v,
								assName: '',
								type: stockAc.type
							})
						))
					})
				}
			}
			state = state.setIn(['costTransferTemp', 'categoryUuid'], action.valueList[0])
						.setIn(['costTransferTemp', 'categoryName'], action.valueList[1])
						.setIn(['costTransferTemp', 'stockRange'], fromJS(action.acBusinessIncome.stockRange))
			return state
		},
		[ActionTypes.CHANGE_LR_COST_TRANSFER_RUNNING_ASSLIST]	  : () => {
			// 填入辅助核算
			const valueList = action.ass.split(Limit.TREE_JOIN_STR)
			state = state.setIn(['costTransferTemp', 'assList', action.index, 'assId'], valueList[0])
						.setIn(['costTransferTemp', 'assList', action.index, 'assName'], valueList[1])
			return state
		},
		[ActionTypes.CHANGE_LR_CALCULATE_RATE_ASSLIST]			  : () => {
			// 填入税费辅助核算
			const valueList = action.ass.split(Limit.TREE_JOIN_STR)
			state = state.setIn(['rateAcAndAsslist', 'assList', action.index, 'assId'], valueList[0])
						.setIn(['rateAcAndAsslist', 'assList', action.index, 'assName'], valueList[1])
			return state
		},
		// 单选
		[ActionTypes.SELECT_LR_CALCULATE_ITEM]	                  : () => {
			let uuidList = state.getIn([action.Tem, 'uuidList'])
			let stockCardUuidList = state.getIn([action.Tem, 'stockCardUuidList'])
			if (uuidList.indexOf(action.uuid) === -1) {
                uuidList = uuidList.push(action.uuid)
                stockCardUuidList = stockCardUuidList.push({uuid:action.stockCardUuid,amount:action.amount,onlyId:action.uuid})
            } else {
                const idx = uuidList.findIndex(v => v === action.uuid)
                const sidx = stockCardUuidList.findIndex(v => v.get('onlyId') === action.uuid)
                uuidList = uuidList.splice(idx, 1)
                stockCardUuidList = stockCardUuidList.splice(sidx, 1)
            }
			const newStockCardUuidList = stockCardUuidList.toJS()
			state = state.setIn([action.Tem, 'uuidList'], uuidList)
						.setIn([action.Tem, 'stockCardUuidList'], fromJS(newStockCardUuidList))
			return state
		},
		[ActionTypes.SELECT_LR_CALCULATE_ITEM_ALL]                 : () => {

            if (action.selectAll) {
                // 全不选
                return state.setIn([action.Tem, 'uuidList'], fromJS([]))
							.setIn([action.Tem, 'stockCardUuidList'], fromJS([]))
            } else {
                // 全选
                const list = state.get(action.ListName)
                let selectAllList = [],stockCardUuidList = []
                list.forEach(v => {
					selectAllList.push(v.get('uuid'))
					stockCardUuidList.push({uuid:v.get('stockCardUuid'),amount:v.get('amount')})
				})
                return state.setIn([action.Tem, 'uuidList'], fromJS(selectAllList))
							.setIn([action.Tem, 'stockCardUuidList'], fromJS(stockCardUuidList))
            }
        },
		[ActionTypes.AFTER_GET_COMMON_LIST]						   : () => {
			state = state.set(action.ListName, fromJS(action.receivedData.result))
						.setIn([action.temp, 'uuidList'], fromJS([]))
						.setIn([action.temp, 'stockCardUuidList'], fromJS([]))
			return state
		},
		[ActionTypes.AFTER_GET_TRANSFER_OUT_LIST]						: () => {
			state = state.set('transferOutObj', fromJS(action.receivedData))
			return state
		},
		// 成功 新增或修改 成本结转
		[ActionTypes.AFTER_SUCCESS_INSERT_CARRYOVER_ITEM]		   : () => {

			if (action.saveAndNew) {
				const runningDate = state.getIn(['costTransferTemp','runningDate'])
				state = state.setIn(['flags', 'insertOrModify'], 'insert')
							.set('costTransferTemp', lrCalculateState.get('costTransferTemp'))
							.setIn(['costTransferTemp','runningDate'],runningDate)
							.set('costTransferList', lrCalculateState.get('costTransferList'))
			} else {
				state = state.setIn(['flags', 'insertOrModify'], 'modify')
							.setIn(['costTransferTemp', 'carryoverBusinessUuid'], action.carryoverBusinessUuid)

			}
			return state
		},
		// 成功 新增或修改 发票认证
		[ActionTypes.AFTER_SUCCESS_INSERT_INVOICEAUTH_ITEM]			: () => {

			if (action.saveAndNew) {
				const runningDate = state.getIn(['invoiceAuthTemp','runningDate'])
				state = state.setIn(['flags', 'insertOrModify'], 'insert')
							.setIn(['invoiceAuthTemp','runningDate'], runningDate)
							.set('invoiceAuthTemp', lrCalculateState.get('invoiceAuthTemp'))
							.set('invoiceAuthList', lrCalculateState.get('invoiceAuthList'))
			} else {
				state = state.setIn(['flags', 'insertOrModify'], 'modify')
							.setIn(['invoiceAuthTemp', 'authBusinessUuid'], action.authBusinessUuid)
			}
			return state
		},
		// 成功 新增或修改 内部转账
		[ActionTypes.AFTER_SUCCESS_INSERT_INTERNALTRANSFER_ITEM]			: () => {

			if (action.saveAndNew) {
				state = state.setIn(['flags', 'insertOrModify'], 'insert')
							.set('InternalTransferTemp', lrCalculateState.get('InternalTransferTemp'))
			} else {
				state = state.setIn(['flags', 'insertOrModify'], 'modify')
							.set('InternalTransferTemp', lrCalculateState.get('InternalTransferTemp'))
			}
			return state
		},
		[ActionTypes.CHANGE_LR_ACCOUNT_ACCOUNT_NAME]        : () => {

				const valueList = action.value.split(Limit.TREE_JOIN_STR)
				return state = state.setIn([`${action.tab}Temp`, action.placeUUid], valueList[0])
														.setIn([`${action.tab}Temp`, action.placeName], valueList[1])
		},
		[ActionTypes.INIT_CLR_ACCOUNT]                       : () => {
				const hideCategoryList = state.get('hideCategoryList')
				const paymentType = state.getIn(['flags', 'paymentType'])

				if (action.strJudgeType === 'saveAndNew') {

					const runningDate = state.getIn([action.temp,'runningDate'])
					const Temp = lrCalculateState.get(action.temp)
					state = state.setIn(['flags', 'insertOrModify'], 'insert')
								.setIn(['flags', 'runningInsertOrModify'], 'insert')
								.setIn(['flags', 'dealType'], '')
								.set(action.temp,Temp)
								.setIn([action.temp, 'runningDate'], runningDate)
				}

				//afterSave：录入页面保存、查看页面
				if (action.strJudgeType === 'afterSave') {
						const receivedData = fromJS(action.receivedData)
						const insertOrModify = state.getIn(['flags', 'insertOrModify'])
						state = state.set(action.temp, receivedData)
						.setIn(['flags', 'insertOrModify'], 'modify')
						.setIn(['flags', 'runningInsertOrModify'], 'modify')
						.setIn([action.temp, 'flowNumber'], action.callBackObj.flowNumber)
						if(insertOrModify === 'insert') {
							state = state.setIn([action.temp, 'uuid'], action.callBackObj.uuid)
						}


				}

				return state
		},
		// 成功 新增或修改 开具发票
		[ActionTypes.AFTER_SUCCESS_INSERT_INVOICING_ITEM]			: () => {

			if (action.saveAndNew) {
				const runningDate = state.getIn(['invoicingTemp', 'runningDate'])
				state = state.setIn(['flags', 'insertOrModify'], 'insert')
							.set('invoicingTemp', lrCalculateState.get('invoicingTemp'))
							.setIn(['invoicingTemp', 'runningDate'],runningDate)
							.set('invoicingList', lrCalculateState.get('invoicingList'))
			} else {
				state = state.setIn(['flags', 'insertOrModify'], 'modify')
							.setIn(['invoicingTemp', 'makeOutBusinessUuid'], action.makeOutBusinessUuid)
			}
			return state
		},
		// 成功 新增或修改 转出未交
		[ActionTypes.AFTER_SUCCESS_INSERT_TRANSFER_OUT_ITEM]		 : () => {

			if (action.saveAndNew) {
				const runningDate = state.getIn(['transferOutTemp', 'runningDate'])
				state = state.setIn(['flags', 'insertOrModify'], 'insert')
				             .setIn(['transferOutTemp', 'runningDate'],runningDate)
							.set('transferOutTemp', lrCalculateState.get('transferOutTemp'))
							.set('transferOutObj', lrCalculateState.get('transferOutObj'))
			} else {
				state = state.setIn(['flags', 'insertOrModify'], 'modify')
							.setIn(['transferOutTemp', 'turnOutBusinessUuid'], action.turnOutBusinessUuid)
			}
			return state
		},
		[ActionTypes.AFTER_SUCCESS_INSERT_LB_ZZ_ITEM]		 : () => {

			if (action.saveAndNew) {
				const runningDate = state.getIn(['InternalTransferTemp', 'runningDate'])
				state = state.setIn(['flags', 'insertOrModify'], 'insert')
							.setIn(['InternalTransferTemp', 'runningDate'],runningDate)
							.set('InternalTransferTemp', lrCalculateState.get('InternalTransferTemp'))
							.set('InternalTransferTemp', lrCalculateState.get('InternalTransferTemp'))
			} else {
				state = state.setIn(['flags', 'insertOrModify'], 'modify')
			}
			return state
		},
		[ActionTypes.TRANSFER_OUT_FROM_CXLS_JUMP_TO_NBZZ]             : () => {
			const item = action.item
			const receivedData = fromJS(action.receivedData.result)
			const accountChilds = fromJS(action.receivedData.result.childList)
			// console.log(receivedData);
			let accountFromName,accountToName,fromAccountUuid,toAccountUuid
			accountChilds.map((v,i) => {
				if(v.get('runningType') == 'LX_NBZC'){
					accountFromName = v.get('accountName')
					fromAccountUuid = v.get('accountUuid')
				}
				if(v.get('runningType') == 'LX_NBZR') {
					accountToName = v.get('accountName')
					toAccountUuid = v.get('accountUuid')
				}
			})
			const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
			state = lrCalculateState.setIn(['flags', 'insertOrModify'], action.insertOrModify)
									.setIn(['InternalTransferTemp', 'uuid'], item.get('uuid'))
									.setIn(['InternalTransferTemp', 'runningDate'], item.get('runningDate'))
									.setIn(['InternalTransferTemp', 'runningAbstract'], item.get('runningAbstract'))
									.setIn(['InternalTransferTemp', 'runningState'], receivedData.get('runningState'))
									.setIn(['InternalTransferTemp', 'amount'], receivedData.get('amount'))
									.setIn(['InternalTransferTemp', 'fromAccountName'], accountFromName)
									.setIn(['InternalTransferTemp', 'toAccountName'], accountToName)
									.setIn(['InternalTransferTemp', 'fromAccountUuid'], fromAccountUuid)
									.setIn(['InternalTransferTemp', 'toAccountUuid'], toAccountUuid)
									.setIn(['InternalTransferTemp', 'flowNumber'], receivedData.get('flowNumber'))
									.setIn(['InternalTransferTemp','enclosureList'], enclosureList)

						return state
		},
		[ActionTypes.TRANSFER_OUT_FROM_CXLS_JUMP_TO_ZJTX]             : () => {
			const item = action.item
			const receivedData = fromJS(action.receivedData.result)
			const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
			state = lrCalculateState.setIn(['flags', 'insertOrModify'], action.insertOrModify)
									.setIn(['flags', 'dealType'], receivedData.get('categoryName'))
									.set(['DepreciationTemp'], fromJS(receivedData))
									.setIn(['DepreciationTemp', 'uuid'], item.get('uuid'))
									.setIn(['DepreciationTemp', 'propertyCost'], receivedData.get('propertyCost'))
									.setIn(['flags', 'propertyCostList'], receivedData.get('propertyCostList'))
									.setIn(['DepreciationTemp', 'usedProject'], receivedData.get('usedProject'))
									.setIn(['DepreciationTemp', 'categoryUuid'], receivedData.get('categoryUuid'))
									.setIn(['DepreciationTemp', 'projectCard'], receivedData.getIn(['projectCard',0]))
									.setIn(['DepreciationTemp', 'runningDate'], item.get('runningDate'))
									.setIn(['DepreciationTemp', 'runningAbstract'], item.get('runningAbstract'))
									.setIn(['DepreciationTemp', 'runningState'], receivedData.get('runningState'))
									.setIn(['DepreciationTemp', 'amount'], receivedData.get('amount'))
									.setIn(['DepreciationTemp', 'flowNumber'], receivedData.get('flowNumber'))
									.setIn(['flags', 'projectRange'], receivedData.get('projectRange'))
									.setIn(['DepreciationTemp','enclosureList'], enclosureList)

						return state
		},
		// 查看成本结转 跳转到 录入成本结转
		[ActionTypes.COST_TRANSFER_FROM_CXLS_JUMP_TO_LRLS]            : () => {

			const item = action.item
			const receivedData = fromJS(action.receivedData.result)
			const stockCardList = action.receivedData.result.acBusinessIncome.stockCardList

			state = lrCalculateState.setIn(['flags', 'insertOrModify'], action.insertOrModify)
									.setIn(['costTransferTemp', 'runningDate'], item.get('runningDate'))
									.setIn(['flags', 'projectRange'], receivedData.get('projectRange'))
									.setIn(['costTransferTemp', 'runningAbstract'], item.get('runningAbstract'))
									.setIn(['costTransferTemp', 'categoryUuid'], receivedData.get('categoryUuid'))
									.setIn(['costTransferTemp', 'categoryName'], receivedData.get('categoryName'))
									// .setIn(['costTransferTemp', 'cardUuid'], stockCardRange.uuid)
									.setIn(['costTransferTemp', 'stockCardList'], fromJS(stockCardList))

			if (action.insertOrModify === 'modify') {
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['costTransferTemp', 'carryoverBusinessUuid'], item.get('uuid'))
							.setIn(['costTransferTemp', 'flowNumber'], item.get('flowNumber'))
							.setIn(['costTransferTemp', 'runningState'], item.get('runningType') === "LX_JZCB" ? 'STATE_YYSR_XS' : 'STATE_YYSR_TS')
							.setIn(['costTransferTemp', 'carryoverAmount'], item.get('notHandleAmount'))
							.setIn(['costTransferTemp', 'uuidList'], receivedData.get('businessList').map(v => v.get('uuid')) )
							.setIn(['costTransferTemp','enclosureList'], enclosureList)

				const stockCardUuidList = []
				receivedData.getIn(['businessList']).map(item => {
					stockCardUuidList.push({uuid:item.get('stockCardUuid'),amount:item.get('amount')})
				})
				state = state.set('costTransferList', receivedData.getIn(['businessList']))
							.setIn(['costTransferTemp', 'stockCardUuidList'], fromJS(stockCardUuidList))
				const carryoverAc = receivedData.getIn(['acBusinessIncome', 'carryoverAc', 0])
				const stockAc = receivedData.getIn(['acBusinessIncome', 'stockAc', 0])
				const carryoverList = receivedData.getIn(['acBusinessIncome', 'carryoverList'])
				const stockList = receivedData.getIn(['acBusinessIncome', 'stockList'])

				// 填入类别对应的科目
				// state = state.updateIn(['costTransferTemp', 'acList'], v => v.push(fromJS({
				// 	acId: stockAc.get('acId'),
				// 	acName: stockAc.get('acFullName'),
				// 	type: stockAc.get('type')
				// })))

				// 如果有成本科目的辅助核算填入
				// if (carryoverAc.get('assCategoryList').size) {
				// 	carryoverAc.get('assCategoryList').forEach(v => {
				// 		state = state.updateIn(['costTransferTemp', 'assList'], w => {
				// 			const assItem = carryoverList.find(w => w.get('assCategory') === v)
				// 			return  w.push(
				// 				fromJS({
				// 					assId: assItem ? assItem.get('assId') : '',
				// 					assCategory: v,
				// 					assName: assItem ? assItem.get('assName') : '',
				// 					type: carryoverAc.get('type')
				// 				})
				// 			)
				// 		})
				// 	})
				// }
				// 如果有存货科目的辅助核算填入
				// if (stockAc.get('assCategoryList').size) {
				// 	stockAc.get('assCategoryList').forEach(v => {
				// 		state = state.updateIn(['costTransferTemp', 'assList'], w => {
				// 			const assItem = stockList.find(w => w.get('assCategory') === v)
				// 			return w.push(
				// 				fromJS({
				// 					assId: assItem ? assItem.get('assId') : '',
				// 					assCategory: v,
				// 					assName: assItem ? assItem.get('assName') : '',
				// 					type: stockAc.get('type')
				// 				})
				// 			)
				// 		})
				// 	})
				// }

			} else {
				state = state.setIn(['costTransferTemp', 'carryoverBusinessUuid'], '')
							.setIn(['costTransferTemp', 'runningState'], item.get('runningState'))
							.setIn(['costTransferTemp', 'carryoverAmount'], '')
							.setIn(['costTransferTemp', 'uuidList'], fromJS([item.get('uuid')]))

				state = state.set('costTransferList', fromJS([item]))

				const carryoverAc = receivedData.getIn(['acBusinessIncome', 'carryoverAc', 0])
				const stockAc = receivedData.getIn(['acBusinessIncome', 'stockAc', 0])

				// 填入类别对应的科目
				state = state.setIn(['costTransferTemp', 'acList'], fromJS([{
					acId: carryoverAc.get('acId'),
					acName: carryoverAc.get('acFullName'),
					type: carryoverAc.get('type')
				}])).updateIn(['costTransferTemp', 'acList'], v => v.push(fromJS({
					acId: stockAc.get('acId'),
					acName: stockAc.get('acFullName'),
					type: stockAc.get('type')
				})))
				// 如果有成本科目的辅助核算填入
				if (carryoverAc.get('assCategoryList').size) {
					carryoverAc.get('assCategoryList').forEach(v => {
						state = state.updateIn(['costTransferTemp', 'assList'], w => w.push(
							fromJS({
								assId: '',
								assCategory: v,
								assName: '',
								type: carryoverAc.get('type')
							})
						))
					})
				}
				// 如果有存货科目的辅助核算填入
				if (stockAc.get('assCategoryList').size) {
					stockAc.get('assCategoryList').forEach(v => {
						state = state.updateIn(['costTransferTemp', 'assList'], w => w.push(
							fromJS({
								assId: '',
								assCategory: v,
								assName: '',
								type: stockAc.get('type')
							})
						))
					})
				}
			}
            return state
        },
		// 查看发票认证 跳转到 录入发票认证
		[ActionTypes.INVOICE_AUTH_FROM_CXLS_JUMP_TO_LRLS]          : () => {
			const item = action.item
			const receivedData = fromJS(action.receivedData.result)

			state = lrCalculateState.setIn(['flags', 'insertOrModify'], action.insertOrModify)
									.setIn(['invoiceAuthTemp', 'runningDate'], item.get('runningDate'))
									.setIn(['invoiceAuthTemp', 'runningAbstract'], item.get('runningAbstract'))
									.setIn(['invoiceAuthTemp', 'categoryUuid'], receivedData.get('categoryUuid'))

			if (action.insertOrModify === 'modify') {
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['invoiceAuthTemp', 'authBusinessUuid'], item.get('uuid'))
							.setIn(['invoiceAuthTemp','enclosureList'], enclosureList)
							.setIn(['invoiceAuthTemp', 'flowNumber'], item.get('flowNumber'))
							.setIn(['invoiceAuthTemp', 'billAuthType'], item.get('runningType') === 'LX_FPRZ_CG' ? 'BILL_AUTH_TYPE_CG': 'BILL_AUTH_TYPE_TG')
							.setIn(['invoiceAuthTemp', 'uuidList'], receivedData.get('businessList').map(v => v.get('uuid')) )

				state = state.set('invoiceAuthList', receivedData.getIn(['businessList']))

				// 填写科目和辅助核算的值

				const billAcList = receivedData.get('billAcList')
				const billAssList = receivedData.get('billAssList')
				// 科目 辅助核算
				state = initRateAcAndAsslist(action.rate, state, billAcList, billAssList)

			} else {
				state = state.setIn(['invoiceAuthTemp', 'authBusinessUuid'], '')
							.setIn(['invoiceAuthTemp', 'billAuthType'], item.get('runningType') === 'LX_ZZS_WRZ' ? 'BILL_AUTH_TYPE_CG': 'BILL_AUTH_TYPE_TG')
							.setIn(['invoiceAuthTemp', 'uuidList'], fromJS([item.get('uuid')]))

				state = state.set('invoiceAuthList', fromJS([item]))
				// 科目 辅助核算
				state = initRateAcAndAsslist(action.rate, state)
			}
            return state
		},
		// 查看开具发票 跳转到 录入成本结转
		[ActionTypes.INVOICING_FROM_CXLS_JUMP_TO_LRLS]              : () => {
			const item = action.item
			const receivedData = fromJS(action.receivedData.result)

			state = lrCalculateState.setIn(['flags', 'insertOrModify'], action.insertOrModify)
									.setIn(['invoicingTemp', 'runningDate'], item.get('runningDate'))
									.setIn(['invoicingTemp', 'runningAbstract'], item.get('runningAbstract'))
									.setIn(['invoicingTemp', 'categoryUuid'], receivedData.get('categoryUuid'))

			if (action.insertOrModify === 'modify') {
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['invoicingTemp', 'makeOutBusinessUuid'], item.get('uuid'))
							.setIn(['invoicingTemp', 'flowNumber'], item.get('flowNumber'))
							.setIn(['invoiceAuthTemp','enclosureList'], enclosureList)
							.setIn(['invoicingTemp', 'billMakeOutType'], item.get('runningType') === 'LX_KJFP_XS' ? 'BILL_MAKE_OUT_TYPE_XS': 'BILL_MAKE_OUT_TYPE_TS')
							.setIn(['invoicingTemp', 'uuidList'], receivedData.get('businessList').map(v => v.get('uuid')) )

				state = state.set('invoicingList', receivedData.getIn(['businessList']))

				const billAcList = receivedData.get('billAcList')
				const billAssList = receivedData.get('billAssList')
				// 科目 辅助核算
				state = initRateAcAndAsslist(action.rate, state, billAcList, billAssList)

			} else {
				state = state.setIn(['invoicingTemp', 'makeOutBusinessUuid'], '')
							.setIn(['invoicingTemp', 'billMakeOutType'], item.get('runningType') === 'LX_ZZS_WKP' ? 'BILL_MAKE_OUT_TYPE_XS': 'BILL_MAKE_OUT_TYPE_TS')
							.setIn(['invoicingTemp', 'uuidList'], fromJS([item.get('uuid')]))

				state = state.set('invoicingList', fromJS([receivedData]))
				// 科目 辅助核算
				state = initRateAcAndAsslist(action.rate, state)
			}
            return state
		},
		// 查看转出未交 跳转到 录入成本结转
		[ActionTypes.TRANSFER_OUT_FROM_CXLS_JUMP_TO_LRLS]             : () => {
			const item = action.item
			const receivedData = fromJS(action.receivedData.result)
			const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
			state = lrCalculateState.setIn(['flags', 'insertOrModify'], action.insertOrModify)
									.setIn(['transferOutTemp', 'runningDate'], item.get('runningDate'))
									.setIn(['transferOutTemp', 'flowNumber'], item.get('flowNumber'))
									.setIn(['transferOutTemp', 'runningAbstract'], item.get('runningAbstract'))
									.setIn(['transferOutTemp', 'categoryUuid'], receivedData.get('categoryUuid'))
									.setIn(['transferOutTemp', 'turnOutBusinessUuid'], item.get('uuid'))
									.setIn(['transferOutTemp', 'handleMonth'], receivedData.getIn(['businessList', 0, 'runningDate']).substr(0, 7))
									.setIn(['transferOutTemp', 'uuidList'], receivedData.get('businessList').map(v => v.get('uuid')) )
									.setIn(['transferOutTemp','enclosureList'], enclosureList)

			const billAcList = receivedData.get('billAcList')
			const billAssList = receivedData.get('billAssList')
			// 科目 辅助核算
			state = initRateAcAndAsslist(action.rate, state, billAcList, billAssList)

			// 计算进税、销项额数 和 税额
			let inputAmount = 0
			let inputCount = 0
			let outputAmount = 0
			let outputCount = 0
			receivedData.get('businessList').forEach(v => {
				if (v.get('billType') === 'bill_common') {
					outputCount = outputCount + 1
					outputAmount = outputAmount + (v.get('parentTax')?v.get('parentTax'):v.get('tax'))
				} else {
					inputCount = inputCount + 1
					inputAmount = inputAmount + (v.get('parentTax')?v.get('parentTax'):v.get('tax'))
				}
			})

			state = state.setIn(['transferOutObj', 'flowDtoList'], receivedData.get('businessList'))
						.setIn(['transferOutObj', 'inputAmount'], inputAmount)
						.setIn(['transferOutObj', 'inputCount'], inputCount)
						.setIn(['transferOutObj', 'outputAmount'], outputAmount)
						.setIn(['transferOutObj', 'outputCount'], outputCount)

            return state
		},
		[ActionTypes.GET_COST_CATEGORY]        : () => {
				return state = state.setIn(['costTransferTemp', 'runningCategory'], fromJS(action.receivedData.categoryList))
		},
		[ActionTypes.CHANGE_CALCULATE_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
		[ActionTypes.CHANGE_CALCULATE_ENCLOSURE_LIST]			: () => { //改变附件列表的信息
            let enclosureList = [];
            state.getIn([action.place,'enclosureList']).map(v=>{
                enclosureList.push(v)
            })
            action.imgArr.forEach(v=>{
                enclosureList.push(v)
            })
            state = state.setIn([action.place,'enclosureList'], fromJS(enclosureList))
                        .setIn([action.place,'enclosureCountUser'], enclosureList.length)

            return state;
        },
		[ActionTypes.DELETE_CALCULATE_UPLOAD_FJ_URL]			: () => { //删除上传的附件
            let needDeleteUrl = [];
            state.getIn([action.place,'needDeleteUrl']).map(v=>{
                needDeleteUrl.push(v)
            })
            state.getIn([action.place,'enclosureList']).map((v,i)=>{
                if (i == action.index) {
                    needDeleteUrl.push(state.getIn([action.place,'enclosureList',i]).set('beDelete',true))
                    state = state.deleteIn([action.place,'enclosureList',i])
                }
            })
            state = state.setIn([action.place,'needDeleteUrl'], fromJS(needDeleteUrl))
                        .setIn([action.place,'enclosureCountUser'], state.getIn([action.place,'enclosureList']).size)

            return state;
        },
		[ActionTypes.GET_CAL_LABEL_FETCH]		: () => { //获取附件的标签
            state=state.setIn([action.setPlace,'label'],fromJS(action.receivedData.data))
            .set('tagModal',true)
            return state;
        },
		[ActionTypes.CHANGE_CAL_TAG_NAME]				: () => { //编辑标签名称
            state.getIn([action.setPlace,'enclosureList']).map((v,i)=>{
                if(i == action.index){
                    state = state.setIn([action.setPlace,'enclosureList',i,'label'],action.value)
                }
            })
            state=state.set('tagModal',false)
            return state;
		},
		[ActionTypes.GET_DEAL_TYPE_CATEGORY]           : () => {
            state = state.setIn(['DepreciationTemp', 'dealTypeList',0,'childList'], fromJS(action.receivedData[0].childList))

            return state
        },

	}[action.type] || (() => state))()
}

// 预置税费的科目和辅助核算 新增 和 编辑
function initRateAcAndAsslist (rate, state, billAcList, billAssList) {
	const scale = rate.scale

	let acList = []
	let assList = []

	// 通过税费设置，预置税费科目的辅助核算
	const handleList = scale === 'small' ?
		[
			{ name: 'payable', type: Limit.ACCOUNT_RATE_TYPE_OF_PAYABLE },
			{ name: 'notBilling', type: Limit.ACCOUNT_RATE_TYPE_OF_NOTBILLING }
		] :
		[
			{ name: 'input', type: Limit.ACCOUNT_RATE_TYPE_OF_INPUT },
			{ name: 'certified', type: Limit.ACCOUNT_RATE_TYPE_OF_CERTIFIED },
			{ name: 'waitOutput', type: Limit.ACCOUNT_RATE_TYPE_OF_WAITOUTPUT },
			{ name: 'output', type: Limit.ACCOUNT_RATE_TYPE_OF_OUTPUT },
			{ name: 'turnOutUnpaid', type: Limit.ACCOUNT_RATE_TYPE_OF_TURNOUTUNPAID },
			{ name: 'unpaid', type: Limit.ACCOUNT_RATE_TYPE_OF_UNPAID }
		]

	handleList.forEach(v => {
		acList.push({
			acId: rate[`${v.name}AcId`],
			acName: rate[`${v.name}AcFullName`],
			type: v.type
		})
		rate[`${v.name}AssCategory`].forEach(w => {
			assList.push({
				assId: '',
				assName: '',
				assCategory: w,
				type: v.type
			})
		})
	})

	let acListImutable = fromJS(acList)
	let assListImutable = fromJS(assList)
	// 如果是修改状态的跳转，有已填的，将已填的填入到列表
	if (billAcList && billAcList.size) {
		billAcList.forEach(v => {
			const type = v.get('type')
			acListImutable = acListImutable.update(w => w.map(u => u.get('type') === type ? u.set('acId', v.get('acId')).set('acName', v.get('acName')) : u))
		})
	}
	if (billAssList && billAssList.size) {
		billAssList.forEach(v => {
			const type = v.get('type')
			const assCategory = v.get('assCategory')
			assListImutable = assListImutable.update(w => w.map(u => {
				if (u.get('type') === type && u.get('assCategory') === assCategory) {
					return u.set('assId', v.get('assId')).set('assName', v.get('assName'))
				} else {
					return u
				}
			}))
		})
	}

	return state = state.setIn(['rateAcAndAsslist', 'acList'], acListImutable).setIn(['rateAcAndAsslist', 'assList'], assListImutable)
}
