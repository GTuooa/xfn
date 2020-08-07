import { toJS, is ,fromJS } from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import { getCategorynameByType } from 'app/containers/Edit/EditRunning/common/common'
import * as Limit from 'app/constants/Limit.js'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { showMessage, numberCalculate, formatDate } from 'app/utils'
import { message, Modal } from 'antd'
//生产环境应当设置为空
const editRunningState = fromJS({
	views: {

	},
	flags: {
		selectList: [],
		indexList: [],//选中条目的索引数组
		managerCategoryList: [],
		stockThingsList: [],
		contactsThingsList: [],
		costStockList: [],
		selectItem: [],
		// insertOrModify: 'insert',
		// PageTab: 'business',
		dropManageFetchAllowed: true,//是否允许下拉框加载数据
		selectedKeys: '',
		// paymentType: '',
		switchUuidList:[],
		poundage:{
			needPoundage:false
		},
		accountContactsRange:[],
		accountProjectRange:[],
		accountProjectList:[],
		accountContactsRangeList:[],
		carryoverCategoryList:[],
		carryoverProjectList:[],
		importList:[],
		errorList:[],
		batchList:[],
		serialList:[],
	},
	oriTemp: {
		accounts: [{},{}],
		oriDate: new DateLib().toString(),
		pendingStrongList: [],
		projectCardList: [{}],
		currentCardList: [],
		carryoverCardList: [{}],
		carryoverStrongList:[],
		stockCardList:[{}],
		stockStrongList:[],
		usedProject: true,
		usedCurrent:true,
		usedStock:true,
		billList: [{
			billType: 'bill_other',
			billState: ''
		}],
		billStrongList: [],
		strongList: [],
		payment: {},
		cardAllList:[],
		poundageCurrentCardList:[],
		poundageProjectCardList:[],
		assistList:[],
		serialList:[],
	},
	categoryTemp: {

	},
	projectList: [],
	contactsList: [],
	warehouseList:[],
	stockList:[],
	hideCategoryList: [],
	MemberList: [],
	selectThingsList: [],
	thingsList: [],
	// // 附件上传
    // enclosureList: [],
    // // previewImageList: [], //预览图片的地址的数组
    // needDeleteUrl: [],//需要删除的图片地址
    // // tagModal: false,//标签组件的显示与否
    // label: [],//附件标签
})

export default function handleEditRunning(state = editRunningState, action) {
	return ({
		[ActionTypes.INIT_EDIT_RUNNING]						: () => editRunningState,
		[ActionTypes.BEFORE_INSERT_RUNNING]				    : () => {
			return editRunningState.setIn(['oriTemp', 'oriDate'], action.date)
		},
		[ActionTypes.SWITCH_EDIT_RUNNING_SWITCH_PAGETAB]    : () => {
			const oriDate = state.getIn(['oriTemp','oriDate'])
			if (action.value === 'business') {
				state = state.set('flags', editRunningState.get('flags'))
							.set('oriTemp', editRunningState.get('oriTemp'))
							.setIn(['oriTemp','oriDate'],oriDate)
			}
			//  else {
			// 	state = state.setIn(['flags', 'paymentType'], 'LB_ZZ')
			// }
			return state
		},
		[ActionTypes.SELECT_EDIT_RUNNING_CATEGORY]       : () => {
			const oriTemp = editRunningState.get('oriTemp').toJS()
			const oriAbstract = state.getIn(['oriTemp','oriAbstract'])
			const oriDate = state.getIn(['oriTemp','oriDate'])
			const categoryUuid = action.name.uuid
			state = state.setIn(['flags', 'showModal'], true)
						.setIn(['flags', 'switchUuidList'], fromJS([]))
						.set('oriTemp', fromJS({...oriTemp,...action.name}))
						.set('categoryTemp', fromJS(action.name))
			if (action.name.beProject) {
				state = state.setIn(['oriTemp','usedProject'], true)
							.setIn(['oriTemp','projectCardList'], fromJS([{uuid:''}]))
			}


			if (action.isFresh) {
					state = state.setIn(['oriTemp','oriAbstract'], oriAbstract)
			}
			return  state.setIn(['oriTemp','categoryUuid'], categoryUuid)
						.setIn(['oriTemp','oriDate'], oriDate)
        },
		[ActionTypes.SELECT_MODIFY_RUNNING_CATEGORY]       : () => {
			const oriTemp = editRunningState.get('oriTemp').toJS()
			const oriAbstract = state.getIn(['oriTemp','oriAbstract'])
			const jrIndex = state.getIn(['oriTemp','jrIndex'])
			const oriDate = state.getIn(['oriTemp','oriDate'])
			let amount = state.getIn(['oriTemp','amount'])
			const accounts = state.getIn(['oriTemp','accounts'])
			const currentAmount = state.getIn(['oriTemp','currentAmount'])
			const enclosureList = state.get('enclosureList')
			const oriUuid = state.getIn(['oriTemp','oriUuid'])
			const propertyCost = state.getIn(['oriTemp','propertyCost'])
			const billList = state.getIn(['oriTemp','billList'])
			const canBeModifyCategory = state.getIn(['oriTemp','canBeModifyCategory'])
			const currentCardList = state.getIn(['oriTemp','currentCardList'])
			const categoryType = action.name.categoryType
			const propertyCarryover = action.name.propertyCarryover
			let projectCardList = state.getIn(['oriTemp','projectCardList'])
			const preCategoryType = state.getIn(['oriTemp','categoryType'])
			const { categoryTypeObj } = getCategorynameByType(categoryType)
			if (action.name.beProject && !projectCardList.size) {
				projectCardList = fromJS([{}])
			} else if (!action.name.beProject) {
				projectCardList = fromJS([])
			}
			if (amount < 0 && categoryType !== 'LB_FYZC') {
				amount = Math.abs(amount)
			}
			const categoryUuid = action.name.uuid
			state = state.setIn(['flags', 'showModal'], true)
						.setIn(['flags', 'dropManageFetchAllowed'], true)
						.setIn(['flags', 'switchUuidList'], fromJS([]))
						.set('oriTemp', fromJS({
							...oriTemp,
							...action.name,
							oriAbstract,
							jrIndex,
							oriDate,
							amount,
							accounts,
							enclosureList,
							oriUuid,
							propertyCost,
							billList,
							projectCardList,
							canBeModifyCategory,
							categoryUuid,
							currentAmount,
							isChangeCategory:true
							}))
						.set('categoryTemp', fromJS(action.name))
			if (action.isFresh) {
					state = state.setIn(['oriTemp','oriAbstract'], oriAbstract)
			}
			if (action.name[categoryTypeObj].contactsManagement) {
				state = state.setIn(['oriTemp','currentCardList'], currentCardList)
			} else {
				state = state.setIn(['oriTemp','currentCardList'], fromJS([]))
							.setIn(['oriTemp','usedCurrent'], false)
			}
			return state
        },
		[ActionTypes.CHANGE_MODIFY_RUNNING_CATEGORY]       : () => {
			const categoryTemp = state.get('categoryTemp').toJS()
			const oriTemp = editRunningState.get('oriTemp').toJS()
			const oriAbstract = state.getIn(['oriTemp','oriAbstract'])
			const jrIndex = state.getIn(['oriTemp','jrIndex'])
			const oriDate = state.getIn(['oriTemp','oriDate'])
			const amount = state.getIn(['oriTemp','amount'])
			const accounts = state.getIn(['oriTemp','accounts'])
			const enclosureList = state.get('enclosureList')
			const oriUuid = state.getIn(['oriTemp','oriUuid'])
			const propertyCost = state.getIn(['oriTemp','propertyCost'])
			const categoryUuid = state.getIn(['oriTemp','categoryUuid'])
			const usedProject = state.getIn(['oriTemp','usedProject'])
			const oriState = action.oriState
			return state.setIn(['flags', 'showModal'], true)
						.setIn(['flags', 'switchUuidList'], fromJS([]))
						.set('oriTemp', fromJS({
							...oriTemp,
							...categoryTemp,
							oriAbstract,
							jrIndex,
							oriDate,
							amount,
							accounts,
							enclosureList,
							oriUuid,
							categoryUuid,
							oriState,
							propertyCost,
							usedProject,
							}))
		},
		[ActionTypes.CHANGE_EDIT_RUNNING_COMMON_STRING]       : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
		[ActionTypes.CHANGE_EDIT_RUNNING_ACCOUNT_NAME]       : () => {
			return state.setIn(['oriTemp','accounts',0,'accountUuid'],action.accountUuid)
						.setIn(['oriTemp','accounts',0,'poundage'],action.poundage)
						.setIn(['oriTemp','accounts',0,'accountName'],action.accountName)

		},
		[ActionTypes.GET_JR_ORI]							: () => {
			const oriTemp = editRunningState.get('oriTemp').toJS()
			const amount = action.receivedData.amount
			const currentAmount = action.receivedData.currentAmount
			const switchUuidList = action.uuidList || state.getIn(['flags','switchUuidList'])
			const payment = action.receivedData.payment || {}
			return state.set('oriTemp',fromJS({...oriTemp,...action.receivedData,...action.category}))
						.set('categoryTemp',fromJS({...oriTemp,...action.category}))
						.setIn(['flags','switchUuidList'],switchUuidList)
						.setIn(['oriTemp','currentBillList'],fromJS(action.receivedData.billList))
						.setIn(['oriTemp','currentProjectCardList'],fromJS(action.receivedData.projectCardList))
						.setIn(['oriTemp','curcurrentCardList'],fromJS(action.receivedData.currentCardList))
						.setIn(['oriTemp','currentOriDate'],fromJS(action.receivedData.oriDate))
						.setIn(['oriTemp','currentpersonSocialSecurityAmount'],(payment.personSocialSecurityAmount || 0))
						.setIn(['oriTemp','currentpersonAccumulationAmount'],(payment.personAccumulationAmount || 0))
						.setIn(['oriTemp','currentpincomeTaxAmount'],(payment.incomeTaxAmount || 0))
		},
		[ActionTypes.CHANGE_STATE_INIT_ORITEMP]							: () => {
			const initCardTmpe = editRunningState.get('oriTemp').toJS()
			const categoryTemp = state.get('categoryTemp').toJS()
			const oriDate = state.getIn(['oriTemp','oriDate'])
			const oriAbstract = state.getIn(['oriTemp','oriAbstract'])
			const handleType = state.getIn(['oriTemp','handleType'])
			const categoryUuid = state.getIn(['oriTemp','categoryUuid'])
			const propertyCost = state.getIn(['oriTemp','propertyCost'])
			return state.set('oriTemp',fromJS({...initCardTmpe,...categoryTemp}))
						.setIn(['oriTemp','oriAbstract'],oriAbstract)
						.setIn(['oriTemp','oriDate'],oriDate)
						.setIn(['oriTemp','handleType'],handleType)
						.setIn(['oriTemp','categoryUuid'],categoryUuid)
						.setIn(['oriTemp','propertyCost'],propertyCost)
						.setIn(['oriTemp','oriState'],action.state)
						.setIn(['flags','dropManageFetchAllowed'],true)
		},
		// [ActionTypes.CHANGE_EDIT_RUNNING_ENCLOSURE_LIST]			: () => { //改变附件列表的信息
		// 	let enclosureList = [];
		// 	state.get('enclosureList').map(v=>{
		// 		enclosureList.push(v)
		// 	})
		// 	action.imgArr.forEach(v=>{
		// 		enclosureList.push(v)
		// 	})
		// 	state = state.set('enclosureList', fromJS(enclosureList))
		// 				.set('enclosureCountUser', enclosureList.length)
		//
		// 	return state;
		// },
		// [ActionTypes.GET_EDIT_RUNNING_LABEL_FETCH]		: () => { //获取附件的标签
        //     state = state.set('label', fromJS(action.receivedData.data))
        //     return state
        // },
		// [ActionTypes.CHANGE_RUNNING_TAG_NAME]		: () => { //修改附件的标签
		// 	state.get('enclosureList').map((v,i) => {
        //         if (i == action.index) {
        //             state = state.setIn(['enclosureList', i, 'label'], action.value)
        //         }
        //     })
        //     return state
        // },
		// [ActionTypes.DELETE_RUNNING_ENCLOSURE_URL]			: () => { //删除上传的附件
        //     let needDeleteUrl = []
        //     state.get('needDeleteUrl').map(v => {
        //         needDeleteUrl.push(v)
        //     })
        //     state.get('enclosureList').map((v, i) => {
        //         if (i == action.index) {
        //             needDeleteUrl.push(state.getIn(['enclosureList', i]).set('beDelete', true))
        //             state = state.deleteIn(['enclosureList', i])
        //         }
        //     })
        //     state = state.set('needDeleteUrl', fromJS(needDeleteUrl))
        //                 .set('enclosureCountUser', state.get('enclosureList').size)
		//
        //     return state
        // },
		[ActionTypes.INIT_EDIT_RUNNING_SETTINGS]                                  : () => {
            state = state.setIn(['taxRateTemp', 'payableRate'], action.rate.payableRate)
                        .setIn(['taxRateTemp', 'outputRate'], action.rate.outputRate)
                        .setIn(['taxRateTemp', 'scale'], action.rate.scale)
                        .set('hideCategoryList', fromJS(action.hideCategoryList))

            return state
        },
		[ActionTypes.CHANGE_EDIT_BILL_STATES]                                  : () => {
				return state.setIn(['oriTemp','billList',0,'billState'],action.billState)
							.setIn(['oriTemp','billList',0,'tax'],action.tax)
							.setIn(['oriTemp','billList',0,'taxRate'],action.taxRate)
		},
		[ActionTypes.EDIT_CALCULATE_GAIN_OR_LOSS]           :() => {
          const { place, diff, deletePlace } = action
          return state.setIn(place, diff)
                      .deleteIn(deletePlace, diff)
        },
		[ActionTypes.CHANGE_RUNNING_TAX_RATE]               : () => {
			let amount = action.amount || state.getIn(['oriTemp', 'amount']) || 0
			if (action.value == '-1') {
				return state.setIn(['oriTemp','billList',0,'tax'],'')
							.setIn(['oriTemp','billList',0,'taxRate'], action.value)
			} else {
				return state.setIn(['oriTemp','billList',0,'tax'],(Number(amount) /(1 + Number(action.value)/100) * Number(action.value)/100).toFixed(2))
							.setIn(['oriTemp','billList',0,'taxRate'], action.value)
			}

        },
		[ActionTypes.EDIT_RUNNING_CALCULATE_AMOUNT]                    :()=>{
			const companyAccumulationAmount = state.getIn(['oriTemp', 'payment','companyAccumulationAmount']) || 0// 公积金(公司部分)
			const personAccumulationAmount = state.getIn(['oriTemp', 'payment','personAccumulationAmount']) || 0// 公积金(个人部分)
			const companySocialSecurityAmount = state.getIn(['oriTemp', 'payment','companySocialSecurityAmount']) || 0//社保(公司部分)
			const personSocialSecurityAmount = state.getIn(['oriTemp', 'payment','personSocialSecurityAmount']) || 0 // 社保(个人部分)
			const incomeTaxAmount = state.getIn(['oriTemp', 'payment','incomeTaxAmount']) || 0 // 个人所得税
			const amount = state.getIn(['oriTemp','amount']) || 0
			const actualAmount = state.getIn(['oriTemp','payment','actualAmount']) || 0
			const categoryType = state.getIn(['oriTemp','categoryType'])
			const propertyPay = state.getIn(['oriTemp', 'propertyPay'])
			const oriState = state.getIn(['oriTemp', 'oriState'])
			const beAccrued = state.getIn(['oriTemp','acPayment', 'beAccrued'])
			const beWithholdTax = state.getIn(['oriTemp','acPayment', 'beWithholdTax'])
			const beWithholding = state.getIn(['oriTemp','acPayment', 'beWithholding'])
			const beWithholdSocial = state.getIn(['oriTemp','acPayment', 'beWithholdSocial'])
			let midAmount
				switch (propertyPay) {
					case 'SX_GZXJ':
						action.totalNotHandleAmount < 0?
						midAmount = (Number(actualAmount) - Number(personAccumulationAmount) - Number(personSocialSecurityAmount) - Number(incomeTaxAmount)).toFixed(2)
						:midAmount = (Number(actualAmount) + Number(personAccumulationAmount) + Number(personSocialSecurityAmount) + Number(incomeTaxAmount)).toFixed(2)
						break
					case 'SX_ZFGJJ':
						action.totalNotHandleAmount < 0?
						midAmount = (Number(personAccumulationAmount) - Number(companyAccumulationAmount)).toFixed(2)
						:
						midAmount = (Number(personAccumulationAmount) + Number(companyAccumulationAmount)).toFixed(2)
						break
					case 'SX_SHBX':
						action.totalNotHandleAmount < 0?
						midAmount = (-Number(companySocialSecurityAmount) + Number(personSocialSecurityAmount)).toFixed(2)
						:
						midAmount = (Number(companySocialSecurityAmount) + Number(personSocialSecurityAmount)).toFixed(2)
						break
					case 'SX_QTXC':
						midAmount = amount
						break
					default:
						midAmount = 0
				}
			if (propertyPay === 'SX_GZXJ' && beAccrued && !beWithholdTax && !beWithholding && !beWithholdSocial) {
				return state = state.setIn(['oriTemp','payment','actualAmount'],Math.abs(action.totalNotHandleAmount).toFixed(2))
			} else if ((propertyPay === 'SX_ZFGJJ' || propertyPay === 'SX_SHBX') && action.insertOrModify === 'insert') {
				return state = state.setIn(['oriTemp','payment','actualAmount'],midAmount)
			} else {
				return state = state.setIn(['oriTemp','amount'],midAmount)
			}

        },
		[ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_EDIT]                       : () => {
            const uuidList = state.getIn(['flags','uuidList'])

            // state = state.setIn(['flags', 'PageTab'], action.PageTab)
            //             .setIn(['flags', 'paymentType'], action.pageType)

            return state
        },
		[ActionTypes.GET_PREAMOUNT_INFO]                       : () => {
			return state = state.setIn(['oriTemp','preAmount'], action.preAmount)
								.setIn(['oriTemp','payableAmount'], action.payableAmount)
		},
		[ActionTypes.CHANGE_ORITEMP_ORIDATE]                       : () => {
			return state = state.setIn(['oriTemp','oriDate'], action.date)
		},
		// 清空存货列表
		[ActionTypes.INIT_COST_STOCK_ARRAY]                       : () => {
			return state = state.setIn(['flags','costStockList'], fromJS([]))
		},
		// 选择项目单位
		[ActionTypes.COMMON_CHARGE_ITEM_CHECKBOX_SELECT]               : () => {
				const showLowerList = state.getIn(['flags', 'selectList'])
				const selectItemList = state.getIn(['flags', 'selectItem'])
				const {
					uuid,
					name,
					code,
					isOpenedQuantity,
					unit={unitList:[]},
					unitPriceList=[],
					financialInfo
					} = action.item
				if (!action.checked && showLowerList.findIndex(v => v === uuid) === -1) {
						// 原来没选
						const newShowLowerList = showLowerList.push(uuid)
						const newSelectItemList = selectItemList.push(fromJS({uuid,
						name,
						code,
						isOpenedQuantity,
						unit,
						unitPriceList,
						financialInfo
						}))
						return state.setIn(['flags', 'selectList'], newShowLowerList)
									.setIn(['flags', 'selectItem'], fromJS(newSelectItemList))
				} else if (action.checked) {
						// 原来选了
						const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === uuid), 1)
						const newSelectItemList = selectItemList.splice(showLowerList.findIndex(v => v === uuid), 1)

						return state.setIn(['flags', 'selectList'], newShowLowerList)
									.setIn(['flags', 'selectItem'], fromJS(newSelectItemList))
				}
				return state
		},
		[ActionTypes.AFTER_INVENTORY_IMPORT]						     : () => {
			const importList = action.receivedData.data.importList.map(v => {
				if (v.exchange && v.exchange.indexOf('仓库非末级') > -1) {
					v.warehouseCardCode = ''
					v.warehouseCardName = ''
				} else {
					v.warehouseCardCode = v.warehouseCode
					v.warehouseCardName = v.warehouseName
					v.warehouseCardUuid = v.warehouseUuid

				}
				if (!v.batchUuid) {
					v.batch = ''
				}
				v.cardUuid = v.inventoryUuid
				return v
				})
			state = !action.receivedData.data ?
				state.setIn(['flags','iframeload'], true)
				.setIn(['flags','showMessageMask'], false)
				.setIn(['flags','acmessage'], fromJS(action.receivedData.message))
				:
				state.setIn(['flags','iframeload'], true)
				.setIn(['flags','acmessage'], fromJS(action.receivedData.message))
				.setIn(['flags','errorList'], fromJS(action.receivedData.data.errorList))
				.setIn(['flags','importKey'], action.receivedData.data.importKey)
				.setIn(['flags','importList'], fromJS(importList))
			if (importList && importList.length) {
				const amount = importList.reduce((pre,cur) => pre+=(cur.amount ||0),0) || 0
				state = state.setIn(['oriTemp','stockCardList'],fromJS(importList))
								.setIn(['oriTemp','carryoverCardList'],fromJS(importList.map(v => {
									v.amount =''
									return v
									})))
								.setIn(['oriTemp','amount'],(amount || 0).toFixed(2))
			}
			return state
		},
		[ActionTypes.CHANGE_PRICE_LIST]						     : () => {
			action.data.map((v,i) => {
				if (action.stockPriceList[i].storeUuid && action.stockPriceList[i].cardUuid) {
					state = state.setIn(['oriTemp','stockCardList',i,'currentQuantity'],v.quantity)
					state = state.setIn(['oriTemp','stockCardList',i,'showQuantity'], true)
				}
                if(action.stockPriceList[i].isUniformPrice){
                    if (v.price < 0 || numberCalculate(v.amount, v.quantity, 2, 'divide') < 0) {
                        return Modal.error({
                            title: `【${v.code} ${v.cardName}】的单价异常，请调整单价后再录入`,
                            content: '',
                            onOk() {},
                        })
                    }
                }
				state = state.setIn(['oriTemp','carryoverCardList',i,'referencePrice'], v.price)
            })
			return state
		},

	}[action.type] || (() => state))()
}
