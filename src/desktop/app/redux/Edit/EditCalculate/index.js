import { fromJS }	from 'immutable'
import { showMessage } from 'app/utils'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { message } from 'antd'
import { formatDate, formatMoney, numberCalculate } from 'app/utils'
//生产环境应当设置为空
const editCalculateState = fromJS({
	views: {
        // insertOrModify: 'insert',
		// circleStatus: true,
		// runningInsertOrModify: 'insert',
        // insertOrModify: 'insert',
		selectI:0,
		dealType:'',
		projectList:[],
		projectRange:[],
		propertyCostList:[],
		dealCategory:[],
		beProject: false,
        costStockList:[],
        selectList: [],
		indexList:[],//选中条目的索引数组
        totalAmount:0,
		SwitchUuidList: [],
		oriUuid: '',
		modalName: '',
		selectItem: [],
		chooseNumber: '-1', //可以选择的方式 0弹出款有两个选择  1-只有系统自动编号  2-只有插入
		encodeType: '', //选择的方式
		saveWay: false, //选择前保存的方式 true保存并新增
		jrIndex: '', //选择前流水号
		categoryMessage:{
			beProject: false,
			usedProject: false,
			propertyCostList:[]
		},
		paymentTypeStr:'内部转账',
		// 存货导入
		importList:[],
		errorList:[],
		//盘点
		stockTitleName: '存货',
		// 盘点结转
		warehouseTreeList:[],
		countInsert: true,	 //盘点单状态
		pdfInsertFirst: true,//首次保存pdf
		isCount: false,		 //盘点页面导入存货
		singleUrl: '',		 //盘点单打印地址
		hasNumber: true,
		isProduct: false,  //是否是成品(存货组装拆卸)
		isAssembly: false,  //是否是组装单(存货组装拆卸)

	},
	CostTransferTemp: {
		uuidList: [],
		dealTypeName: '',
		stockCardUuidList:[],
		categoryUuid: '',
		dealTypeUuid: '',
		costStockList:[],
		carryoverCategory:[],
		oriState: 'STATE_YYSR_XS',
		// oriState: 'STATE_YYSR_ZJ',
		// STATE_YYSR_XS STATE_YYSR_TS
		oriAbstract: '销售存货结转成本',
		carryoverAmount: '',

		categoryName: '',
		costTransferList: [],
		canModifyList:[],
		stockList: [],
		stockCardList:[{}],
		categoryNameAll:[],
		cardUuid:'',
		runningCategory: [
			{
				'childList': []
			}
		],
		beProject: false,
		usedProject: true,
		projectCard:[{
			cardUuid:'',
			name:'',
			code:'',
		}],
		canUseWarehouse: false,
		propertyCost:'',
		wareHouseCardList:[],

		cardPages: 1,
		currentCardPage: 1,
		modifycurrentPage: 1,
		pageSize: 20,
		totalNumber: 1,

		categoryUuidList: [],
		storeUuidList: [],
		condition:'',
		warehouseOptionList: [],
		wareHouseNameAll:[],
		wareHouseNameList:[],
		stockNameAll:[],
		stockNameList:[],
		stockUuidList:[],
		//盘点
		countStockCardList:[],

		chooseWareHouseCard: {
			cardUuid: '',
			name: '全部',
			isUniform: false,
		},
		oldChooseWareHouseCard:[],
		countWarehouseList:[],
		selectStockItem:[],
		selectStockUuidList: [],

	},
	InvoiceAuthTemp: {
		oriUuid:'',
		uuidList: [],
		amount:'',
		billAuthType: 'BILL_AUTH_TYPE_CG',
		// BILL_AUTH_TYPE_CG BILL_AUTH_TYPE_TG
		oriAbstract: '增值税专用发票认证',
		oriState: 'STATE_FPRZ_CG',
		// categoryUuid为发票认证类别uuid
		categoryUuid: '',
		invoiceAuthList: [],
	},
	InvoicingTemp: {
		oriUuid:'',
		uuidList: [],
		amount:'',
		billMakeOutType: 'BILL_MAKE_OUT_TYPE_XS',
		// BILL_MAKE_OUT_TYPE_XS BILL_MAKE_OUT_TYPE_TS
		oriAbstract: '收入开具发票',
		oriState: 'STATE_KJFP_XS',
		// categoryUuid为发票认证类别uuid
		categoryUuid: '',
		invoicingList: [],
		isInvoicingAmount: true,
	},
	TransferOutTemp: {
		uuidList: [],
		turnOutBusinessUuid: '',
		oriUuid:'',
		oriState:'STATE_ZCWJZZS',
		oriAbstract: '转出未交增值税',
		handleMonth: '',

		transferOutObj: {
			jrJvVatDtoList: [],
			inputAmount: '',
			inputCount: '',
			outputAmount: '',
			outputCount: ''
		},
	},
	InternalTransferTemp: {
		oriUuid:'',
		oriState:'STATE_ZZ',
		oriAbstract: '内部转账',
		amount: '',
		categoryType:'',
		categoryUuid:'',
		fromAccountUuid: "",
		toAccountUuid: "",
		accountChildList: [],
		poundage:{
			needPoundage:false,
		},
		poundageCurrentCardList:[],
		poundageProjectCardList:[],
		accountProjectRange:[],
		accountContactsRange:[],
		accountContactsRangeList:[],
		accountProjectList:[],
		chooseFirstWay: true,
		poundageRate: '',

	},
	DepreciationTemp: {
		oriUuid:'',
		oriState:'STATE_CQZC_ZJTX',
		oriAbstract: '资产折旧摊销',
		amount: '',
		categoryType:'',
		categoryUuid:'',
		assetType:'XZ_ZJTX',
		dealTypeList: [{
			childList:[]
		}],
		usedProject:true,
		projectCard: {
			name: '',
			code: '',
			cardUuid: '',
			amount: ''
		},
		propertyCost:'',

	},
	CommonChargeTemp:{
        projectCardList:[],
        paymentList:[],
        oriAbstract:'项目分摊',
		oriState: 'STATE_GGFYFT',
		projectList:[],
		propertyCostName: '',
		// 分页
		cardPages: 1,
		currentCardPage: 1,
		modifycurrentPage: 1,
		pageSize: 20,
		totalNumber: 1,
		tabName: '0'
    },
    CqzcTemp:{
		uuidList: [],
        projectRange:[],
        projectList:[],
		dealTypeList: [{
			childList:[]
		}],
		assets:{
			depreciationAmount:'',
			originalAssetsAmount:'',
		},
		projectCard:[{
			cardUuid:'',
			name:'',
			code:''
		}],
		oriAbstract:'长期资产处置损益',
		oriState:'STATE_CQZC_JZSY',
		businessList:[],
		usedProject:true,
		categoryName: '',
		diffAmount:''

    },
    JzjzsyTemp:{
		oriState:'STATE_XMJZ_XMJQ',
		amount:'',
        oriAbstract:'结转本期损益',
		pendingProfitAndLossCarryoverList: [],//所有仓库列表
		cardPages: 1,
		currentPage: 1,
		pageSize: 20,

		chooseProjectCard:[],
		curSelectProjectUuid: [],
		projectCardList: [],
		chooseJrCategoryCard:[],
		curSelectJrCategoryUuid: [],
		jrCategoryList: [],
		modalName: '',

    },
	SfglTemp:{
		isModeRunning: false,//判断是否是抹零流水
		paymentList:[],
		detail:[],
		debitTotal: 0,
		creditTotal: 0,
		runningIndex:0,
		categoryList:[
			{
				uuid:'',
				name:'',
				childList: []
			}
		],
		handlingAmount:'',
		condition:'',
        managerCategoryList:[],
		oriUuid: '',
		oriAbstract:'核销账款',
		contactsCardRange:{
			name:'',
			code:''
		},
		stockCardList:{
			name:'',
			code:''
		},
		categoryUuid:'',
		categoryName:'',
		categoryUuidList:[],
		categoryNameList:[''],
		categoryNameAll:[],
		cardUuidList:[],
		cardNameList:[''],
		cardNameAll:[],
		handleTypeCard: false,
		cardUuid:'',
		usedCard:{
			code:'',
			name:''
		},
		beMoed: false,
		moedAmount: '',
		cardPages: 1,
		currentCardPage: 1,
		modifycurrentPage: 1,
		pageSize: 20,
		totalNumber: 1,
		needUsedPoundage:false,
		poundageCurrentCardList:[],
		poundageProjectCardList:[],
		accountProjectRange:[],
		accountContactsRange:[],
		accountContactsRangeList:[],
		accountProjectList:[],
		poundage:{
			needPoundage:false,
		},
		writeOffType: '',
		writeOffTypeList: [],
		showDKModal: false,
		chooseWriteOffType: false,
		unAutomatic: false,//是否手动核销
		oriState:'',
		oldSelectItem: [],
		beginDate: '',
		endDate: '',
		usedAccounts: false,
		accounts: [{},{}],
    },
	StockTemp:{
		oriState:'STATE_CHDB',
        projectCardList:[],
        paymentList:[],
        oriAbstract:'存货调拨',
		stockCardList:[{}],//添加的存货
		stockCardUuidList: [],
		wareHouseCardList: [],
		chooseWareHouseCardList: [
			{
				cardUuid: '',
				name: '',
				warehouseStatus: 'WAREHOUSE_STATUS_FROM'
			},
			{
				cardUuid: '',
				name: '',
				warehouseStatus: 'WAREHOUSE_STATUS_TO'
			}
		],
		allStockCardList: [],//所有存货列表

    },
	BalanceTemp:{
		oriState:'STATE_CHYE_CK',
        projectCardList:[],
        paymentList:[],
        oriAbstract:'存货价值调整',
		canUseWarehouse: false,
		stockCardList:[{}],//添加的存货
		wareHouseList:[],
		oriStockList:[],//保存后的存货
		oriWareHouseList:[],//保存后的
		stockCardUuidList: [],
		wareHouseCardUuidList: [],
		wareHouseCardList: [],
		chooseWareHouseCard: {
			cardUuid: '',
			name: '全部',
			isUniform: false,
		},
		chooseStockCard: {
			cardUuid: '',
			name: '',
			isOpenedQuantity: false,
			isUniformPrice: false,

		},
		allStockCardList: [],//所有存货列表
		oriStockCardList:[],
		oriWarehouseCardList:[],
		countStockCardList:[
			// {
			// 	code: 1001,
			// 	name: '存货一',
			// 	beforeQuantity: 100,
			// 	afterQuantity: 60,
			// 	quantity: 40,
			// 	price: 0,
			// 	unitName: '个',
			// 	warehouseCardCode: 1001,
			// 	warehouseCardName: '仓库一',
			// 	childList:[{
			// 		warehouseCardCode: 1001,
			// 		warehouseCardName: '仓库一',
			// 		beforePrice: 100,
			// 		afterPrice: 60,
			// 		quantity: 40,
			// 		amount: '个',
			// 	}]
			// }
		],
		warehouseSelectedKeys: [],
		countWarehouseList:[],

    },
	TaxTransferTemp: {
		uuidList: [],
		dealTypeName: '',
		propertyCarryover:'',
		stockCardUuidList:[],
		categoryUuid: '',
		oriState: 'STATE_JXSEZC_FS',
		oriDate: formatDate(),
		oriAbstract: '进项税额转出',
		carryoverAmount: '',

		categoryName: '',
		taxTransferList: [],
		canModifyList:[],
		stockList: [],
		stockCardList:[
			{
				code: '',
				name: '',
				amount: '',
				cardUuid: '',
				warehouseCardUuid: '',
			}
		],
		cardUuid:'',
		runningCategory: [
			{
				'childList': []
			}
		],
		wareHouseCardList:[],
		projectCard:{},
		usedProject: true,
	},
	StockBuildUpTemp:{
        oriDate:formatDate().slice(0,10),
		oriState:'STATE_CHZZ_ZZCX',
        projectCardList:[],
        paymentList:[],
        oriAbstract:'存货组装',
		stockCardList:[{}],//添加的物料
		stockCardOtherList:[{}],//添加的成品
		wareHouseCardList:[{}],//
		stockCardUuidList: [],
		allStockCardList: [],//所有存货列表
		allWareHouseCardList: [],//所有仓库列表

		oriStockCardList:[],
		oriStockCardOtherList:[],
		curItemIsAvailable: true,

		assemblySheet: [],//组装单
		assemblyNumber: '',//组装数量
	},
	StockIntoProjectTemp:{
		oriState:'STATE_CHTRXM',
        projectCardList:[],
        paymentList:[],
        oriAbstract:'存货投入使用',
		stockCardList:[{}],//添加的存货
		stockCardUuidList: [],
		wareHouseCardList: [],
		allStockCardList: [],//所有存货列表
		allWareHouseCardList: [],//所有仓库列表
		projectCard:{
			cardUuid:'',
			name:'',
			code:'',
			projectProperty: ''
		},
		stockRange:[],
		categoryTypeObj:{},

    },
	ProjectCarryoverTemp:{
		oriState:'STATE_XMJZ_XMJQ',
        projectCardList:[],
        paymentList:[],
        oriAbstract:'项目结清',
		stockCardList:[{}],//添加的存货
		stockCardUuidList: [],
		wareHouseCardList: [],
		allStockCardList: [],//所有存货列表
		allWareHouseCardList: [],//所有仓库列表
		projectCard:{
			cardUuid:'',
			name:'',
			code:''
		},
		carryoverList:[],
		stockRange:[],
		categoryTypeObj:{},
		allHappenAmount:'',
		allStoreAmount:'',
		cardPages: 1,
		currentCardPage: 1,
		modifycurrentPage: 1,
		pageSize: 20,
		totalNumber: 1,

    },
	commonCardObj: {
		memberList:[],
		thingsList:[],
		selectItem: [],
		selectList: [],
		selectedKeys: [`all${Limit.TREE_JOIN_STR}1`],
		selectThingsList:[],
		showSingleModal: false,
		selectI: '',
		modalName:'',
		cardPageObj: {
			pages: 1,
			currentPage: 1,
			total: 1,
		}
	},
	// 附件上传

    vcKey: 0,  //后台传来的草稿的标识
})

export default function handleLrb(state = editCalculateState, action) {
	return ({
		[ActionTypes.INIT_EIDT_CALCULATE]						: () => editCalculateState,
		[ActionTypes.INIT_ENCODE_TYPE]        : () => {
			return state = state.setIn(['views','chooseNumber'],'-1')
								.setIn(['views','jrIndex'],'')
								.setIn(['views','saveWay'],false)
								.setIn(['views','encodeType'],'')
		},
		[ActionTypes.CHANGE_CAN_MODIFY_JRINDEX]        : () => {
			const encodeType = action.encodeType === '0' ? '1' : action.encodeType
			return state = state.setIn(['views','chooseNumber'],action.encodeType)
								.setIn(['views','jrIndex'],action.jrIndex)
								.setIn(['views','saveWay'],action.saveAndNew)
								.setIn(['views','encodeType'],encodeType)
		},
		[ActionTypes.CHANGE_EIDT_CALCULATE_COMMON_STATE]				: () => {
			return state.setIn([action.parent, action.position], action.value)
		},
		// 单选
		[ActionTypes.SELECT_EDIT_CALCULATE_ITEM]	                  : () => {
			let uuidList = state.getIn([action.Tem, 'uuidList'])
			let stockCardUuidList = state.getIn([action.Tem, 'stockCardUuidList'])
			if (uuidList.indexOf(action.uuid) === -1) {
                uuidList = uuidList.push(action.uuid)
                stockCardUuidList = stockCardUuidList ? stockCardUuidList.push({uuid:action.stockCardUuid,amount:action.amount,onlyId:action.uuid}) : []
            } else {
                const idx = uuidList.findIndex(v => v === action.uuid)
                const sidx = stockCardUuidList.findIndex(v => v.get('onlyId') === action.uuid)
                uuidList = uuidList.splice(idx, 1)
                stockCardUuidList = stockCardUuidList ? stockCardUuidList.splice(sidx, 1) : stockCardUuidList
            }
			const newStockCardUuidList = stockCardUuidList.size ? stockCardUuidList.toJS() : []
			state = state.setIn([action.Tem, 'uuidList'], uuidList)
						.setIn([action.Tem, 'stockCardUuidList'], fromJS(newStockCardUuidList))
			return state
		},
		[ActionTypes.SELECT_EDIT_CALCULATE_ITEM_ALL]                 : () => {

            if (action.selectAll) {
                // 全不选
                return state.setIn([action.Tem, 'uuidList'], fromJS([]))
							.setIn([action.Tem, 'stockCardUuidList'], fromJS([]))
            } else {
                // 全选
                const list = state.getIn([action.Tem,action.ListName])
                let selectAllList = [],stockCardUuidList = []
                list.forEach(v => {
					selectAllList.push(v.get('jrJvUuid'))
					stockCardUuidList.push({uuid:v.get('stockCardUuid'),amount:v.get('amount'),onlyId:v.get('jrJvUuid')})
				})
                return state.setIn([action.Tem, 'uuidList'], fromJS(selectAllList))
							.setIn([action.Tem, 'stockCardUuidList'], fromJS(stockCardUuidList))
            }
        },
		[ActionTypes.AFTER_GET_EDIT_CALCULATE_COMMON_LIST]						   : () => {
			const uuidList = state.getIn(['CostTransferTemp','uuidList'])
			const selectAllList = state.getIn(['views','selectList'])
			const selectAllItem = state.getIn(['views','selectItem'])
			const stockCardUuidList = state.getIn(['CostTransferTemp','stockCardUuidList']).toJS()
			let justUuidList = []
			stockCardUuidList && stockCardUuidList.size && stockCardUuidList.map(v => justUuidList.push(v.get('onlyId')))
			const list = action.temp === 'CostTransferTemp' ? action.receivedData.carryoverList : action.receivedData.result
			state = state.setIn([action.temp,action.ListName], fromJS(list))
			let newSelectList = selectAllList,
				newSelectItem = selectAllItem,
				newStockCardUuidList = stockCardUuidList

			if(action.temp === 'CostTransferTemp'){
				let newUuidList = []
				action.receivedData.carryoverList.map(item => {
					if(selectAllList.indexOf(item.jrJvUuid) > -1){
						newUuidList.push(item.jrJvUuid)

					}
					if(selectAllList.indexOf(item.jrJvUuid) > -1){
						newSelectList.push(item.jrJvUuid)
						newSelectItem.push(item)
						if(justUuidList.indexOf(item.jrJvUuid) === -1){
							newStockCardUuidList.push({uuid:item.stockCardUuid,amount:item.amount,onlyId:item.jrJvUuid,quantity: item.quantity,unitCardName:item.unitCardName,number: item.number,quantityAmount:item.quantityAmount})
						}

					}
				})
				state = state.setIn([action.temp, 'uuidList'], fromJS(newUuidList))
							.setIn([action.temp, 'stockCardUuidList'], fromJS(newStockCardUuidList))
							.setIn([action.temp, 'cardPages'], action.receivedData.pages)
							.setIn([action.temp, 'currentCardPage'], action.receivedData.currentPage)
							.setIn(['views', 'selectList'],fromJS(newSelectList))
							.setIn(['views', 'selectItem'],fromJS(newSelectItem))
			}else{
				state = state.setIn([action.temp, 'uuidList'], fromJS([]))
				.setIn([action.temp, 'stockCardUuidList'], fromJS([]))
				.setIn(['views', 'selectList'],fromJS([]))
				.setIn(['views', 'selectItem'],fromJS([]))
			}

			return state
		},
		[ActionTypes.GET_CARRYOVER_CATEGORY]						   : () => {
			state = state.setIn(['CostTransferTemp','carryoverCategory'], fromJS(action.receivedData.categoryList))
			if (!action.needSaveData) {
				state = state.setIn(['CostTransferTemp', 'dealTypeName'], '')
							.setIn(['CostTransferTemp', 'dealTypeUuid'], '')
			}
			return state
		},
		[ActionTypes.GET_CARRYOVER_WAREHOUSE]						   : () => {
			state = state.setIn(['CostTransferTemp','warehouseOptionList'], fromJS(action.receivedData.warehouseList))
			return state
		},
		[ActionTypes.GET_EDIT_CALCULATE_TRANSFER_OUT_LIST]						: () => {
			state = state.setIn(['TransferOutTemp','transferOutObj'], fromJS(action.receivedData))
			return state
		},
		[ActionTypes.INIT_CATEGORY_FROM_CHANGE_ORISTATE]						: () => {
			state = state.setIn(['CostTransferTemp','stockCardList'], fromJS([{}]))
						.setIn(['CostTransferTemp','costTransferList'], fromJS([]))
						.setIn(['CostTransferTemp','selectStockItem'], fromJS([]))
						.setIn(['CostTransferTemp','propertyCostList'], fromJS([]))
						.setIn(['CostTransferTemp','costStockList'], fromJS([]))
						.setIn(['CostTransferTemp','propertyCost'], '')
						.setIn(['views','selectList'], fromJS([]))
						.setIn(['views','selectItem'], fromJS([]))
						.set('commonCardObj', fromJS(
							{
								memberList:[],
								thingsList:[],
								selectItem: [],
								selectList: [],
								selectedKeys: [`all${Limit.TREE_JOIN_STR}1`],
								selectThingsList:[],
								showSingleModal: false,
								modalName:''
							}
						))
			return state
		},
		[ActionTypes.INIT_CATEGORY_FROM_GET_CATEGORY]						: () => {
			const selectItem  = state.getIn(['views','selectItem'])
			const selectList  = state.getIn(['views','selectList'])
			if(!action.notClearItem){
				state = state.setIn(['views','selectList'], fromJS([]))
							.setIn(['views','selectItem'], fromJS([]))
							.setIn(['CostTransferTemp','stockCardUuidList'], fromJS([]))
			}else{
				const stockUuidList = action.stockUuidList
				if(action.dealType === 'delete'){
					let newSelectItem = selectItem.filter(v => stockUuidList.indexOf(v.get('stockCardUuid')) > -1)
					let newSelectList = []
					newSelectItem && newSelectItem.map(v => newSelectList.push(v.get('jrJvUuid')))

					state = state.setIn(['views','selectList'], fromJS(newSelectList))
								.setIn(['views','selectItem'], newSelectItem)
								.setIn(['CostTransferTemp','stockCardUuidList'], newSelectItem)
				}
			}
			return state = state.setIn(['CostTransferTemp','carryoverCategory'], fromJS([]))
						.setIn(['CostTransferTemp','warehouseOptionList'], fromJS([]))
						.setIn(['CostTransferTemp','categoryNameAll'], fromJS([]))
						.setIn(['CostTransferTemp','wareHouseNameAll'], fromJS([]))
						.setIn(['CostTransferTemp','categoryUuidList'], fromJS([]))
						.setIn(['CostTransferTemp','storeUuidList'], fromJS([]))
						.setIn(['CostTransferTemp','condition'], '')

						.setIn(['CostTransferTemp','cardPages'], 1)
						.setIn(['CostTransferTemp','currentPage'], 1)

		},


		// 成功 新增或修改 内部转账
		[ActionTypes.AFTER_SUCCESS_INSERT_CALCULATE_LB_ZZ]		 : () => {
			if (action.saveAndNew) {
				state = state.setIn(['views', 'insertOrModify'], 'insert')
							.set('InternalTransferTemp', editCalculateState.get('InternalTransferTemp'))
			} else {
				state = state.setIn(['views', 'insertOrModify'], 'modify')
			}
			return state
		},

		// 修改选择账户
		[ActionTypes.CHANGE_EDIT_ACCOUNT_ACCOUNT_NAME]        : () => {

				const valueList = action.value.split(Limit.TREE_JOIN_STR)
				return state = state.setIn([`${action.tab}Temp`, action.placeUUid], valueList[0])
														.setIn([`${action.tab}Temp`, action.placeName], valueList[1])
		},
		// 刷新-初始化Temp
		[ActionTypes.INIT_EDIT_CALCULATE_TEMP]                       : () => {
			const hideCategoryList = state.get('hideCategoryList')
			// const paymentType = state.getIn(['views', 'paymentType'])

			const categoryMessage = {
				beProject: false,
				usedProject: false,
				propertyCostList:[]
			}
			const pageSize = state.getIn(['SfglTemp','pageSize'])

			if (action.strJudgeType === 'saveAndNew') {
				if(action.needCategoryUuid){
					state = state.setIn([action.temp, 'categoryUuid'], action.receivedData.get('categoryUuid'))
				}

				const Temp = editCalculateState.get(action.temp)
				state = state.setIn(['views', 'insertOrModify'], 'insert')
							.setIn(['views', 'runningInsertOrModify'], 'insert')
							.setIn(['views', 'dealType'], '')
							.setIn(['views', 'categoryMessage'], fromJS(categoryMessage))
							.setIn(['views', 'paymentTypeStr'], state.getIn(['views','paymentTypeStr']))
							.setIn(['views', 'indexList'], fromJS([]))
							.setIn(['views', 'selectList'], fromJS([]))
							.setIn(['views', 'selectItem'], fromJS([]))
							.setIn(['views', 'totalAmount'], 0)
							.set('enclosureList', fromJS([]))
							.set('label', fromJS([]))
							.set('needDeleteUrl', fromJS([]))
							.set(action.temp,Temp)
				if(action.temp==='StockBuildUpTemp'){
					state = state.setIn(['StockBuildUpTemp','categoryUuid'],action.receivedData.get('categoryUuid'))
				}
			}



			//afterSave：录入页面保存、查看页面
			if (action.strJudgeType === 'afterSave') {
				const receivedData = fromJS(action.receivedData)
				// const insertOrModify = state.getIn(['views', 'insertOrModify'])
				const jrUuid =  action.callBackObj.jrUuid ? action.callBackObj.jrUuid : state.getIn([action.temp, 'jrUuid'])
				state = state.set(action.temp, receivedData)
							.setIn(['views', 'insertOrModify'], 'modify')
							.setIn(['views', 'runningInsertOrModify'], 'modify')
							.setIn([action.temp, 'jrNumber'], action.callBackObj.jrNumber)
							.setIn([action.temp, 'jrIndex'], action.callBackObj.jrIndex)
							.setIn([action.temp, 'jrUuid'], jrUuid)
							.setIn([action.temp, 'oriUuid'], action.callBackObj.oriUuid)

			}
			if(action.temp === 'SfglTemp'){
				state = state.setIn(['SfglTemp', 'pageSize'], pageSize)
			}
			return state
		},
		// 查看内部转账 跳转到 录入内部转账
		[ActionTypes.TRANSFER_OUT_FROM_SEARCH_JUMP_TO_NBZZ]             : () => {
			const item = action.item
			const receivedData = fromJS(action.receivedData.jrOri)
			const accountChilds = fromJS(action.receivedData.jrOri.accounts)

			let accountFromName,accountToName,fromAccountUuid,toAccountUuid
			accountChilds && accountChilds.map((v,i) => {
				if(v.get('accountStatus') == 'ACCOUNT_STATUS_FROM'){
					accountFromName = v.get('accountName')
					fromAccountUuid = v.get('accountUuid')
				}
				if(v.get('accountStatus') == 'ACCOUNT_STATUS_TO') {
					accountToName = v.get('accountName')
					toAccountUuid = v.get('accountUuid')
				}
			})

			const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
									.setIn(['InternalTransferTemp', 'oriUuid'], item.get('oriUuid'))
									.setIn(['InternalTransferTemp', 'jrUuid'], receivedData.get('jrUuid'))
									.setIn(['InternalTransferTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['InternalTransferTemp', 'oriState'], receivedData.get('oriState'))
									.setIn(['InternalTransferTemp', 'amount'], receivedData.get('amount'))
									.setIn(['InternalTransferTemp', 'fromAccountName'], accountFromName)
									.setIn(['InternalTransferTemp', 'toAccountName'], accountToName)
									.setIn(['InternalTransferTemp', 'fromAccountUuid'], fromAccountUuid)
									.setIn(['InternalTransferTemp', 'toAccountUuid'], toAccountUuid)
									.setIn(['InternalTransferTemp', 'jrIndex'], receivedData.get('jrIndex'))
									.setIn(['views', 'switchUuidList'], action.uuidList)
									.setIn(['views', 'oriUuid'], item.get('oriUuid'))
									.setIn(['InternalTransferTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)

						return state
		},
		// 查看折旧摊销 跳转到 录入折旧摊销
		[ActionTypes.TRANSFER_OUT_FROM_SEARCH_JUMP_TO_ZJTX]             : () => {

			const item = action.item
			const DepreciationTemp = editCalculateState.get('DepreciationTemp').toJS()
			const receivedData = fromJS({...DepreciationTemp,...action.receivedData.category,...action.receivedData.jrOri})
			// const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['views', 'dealType'], receivedData.get('relationCategoryName'))
									.setIn(['views', 'projectRange'], action.receivedData.category.projectRange)
									.setIn(['views', 'beProject'], action.receivedData.category.beProject)
									.setIn(['views', 'propertyCostList'], receivedData.get('propertyCostList'))
									.set('DepreciationTemp', fromJS(receivedData))
									.setIn(['views', 'switchUuidList'], action.uuidList)
									.setIn(['views', 'oriUuid'], item.get('oriUuid'))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
									.setIn(['DepreciationTemp', 'projectCard'], fromJS(receivedData.getIn(['projectCardList',0])))
									.setIn(['DepreciationTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
									// .setIn(['DepreciationTemp','enclosureList'], enclosureList)

						return state
		},
		// 查看结转损益 跳转到 录入结转损益
		[ActionTypes.TRANSFER_OUT_FROM_SEARCH_JUMP_TO_SYJZ]             : () => {
			const item = action.item
			const JzjzsyTemp = editCalculateState.get('JzjzsyTemp').toJS()
			const receivedData = fromJS({...JzjzsyTemp,...action.receivedData.category,...action.receivedData.jrOri})

			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.set('JzjzsyTemp', fromJS(receivedData))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
									.setIn(['JzjzsyTemp', 'pendingProfitAndLossCarryoverList'], fromJS(receivedData.get('pendingProfitAndLossCarryoverList')))
									.setIn(['JzjzsyTemp', 'categoryName'], receivedData.get('relationCategoryName'))
									.setIn(['JzjzsyTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
									.setIn(['JzjzsyTemp', 'amount'], action.receivedData.jrOri.amount)
									.setIn(['JzjzsyTemp', 'projectCardList'], fromJS(action.receivedData.projectList))
									.setIn(['JzjzsyTemp', 'jrCategoryList'], fromJS(action.receivedData.categoryList))
									.setIn(['views', 'oriUuid'], item.get('oriUuid'))

						return state
		},
		// 结账生成流水 查看结账结转损益 跳转到 录入结账结转损益
		[ActionTypes.TRANSFER_OUT_FROM_SEARCH_JUMP_TO_JZSY]             : () => {
			const item = action.item
			const CqzcTemp = editCalculateState.get('CqzcTemp').toJS()
			const receivedData = fromJS({...CqzcTemp,...action.receivedData.category,...action.receivedData.jrOri})
			const assets = action.receivedData.jrOri.assets
			const depreciationAmount = assets.depreciationAmount
			const originalAssetsAmount = assets.originalAssetsAmount
			const loss = (Number(originalAssetsAmount) - Number(depreciationAmount)).toFixed(2)
			const diff = (loss - assets.cleaningAmount).toFixed(2)

			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.set('CqzcTemp', fromJS(receivedData))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
									.setIn(['CqzcTemp', 'projectRange'], action.receivedData.category.projectRange)
									.setIn(['CqzcTemp', 'beProject'], action.receivedData.category.beProject)
									.setIn(['CqzcTemp', 'projectCard'], fromJS(receivedData.get('projectCardList')))
									.setIn(['CqzcTemp', 'categoryName'], receivedData.get('relationCategoryName'))
									.setIn(['CqzcTemp', 'businessList'], fromJS(action.receivedData.jrOri.pendingStrongList))
									.setIn(['CqzcTemp', 'uuidList'], receivedData.get('pendingStrongList').map(v => v.get('oriUuid')) )
									.setIn(['CqzcTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
									.setIn(['CqzcTemp', 'diffAmount'], diff)
									.setIn(['views', 'switchUuidList'], action.uuidList)
									.setIn(['views', 'oriUuid'], item.get('oriUuid'))


						return state
		},
		// 查看成本结转 跳转到 录入成本结转
		[ActionTypes.COST_TRANSFER_FROM_SEARCH_JUMP_TO_LRLS]            : () => {

			const item = action.item
			const CostTransferTemp = editCalculateState.get('CostTransferTemp').toJS()
			const receivedData = fromJS({...CostTransferTemp,...action.receivedData.category,...action.receivedData.jrOri})
			const stockCardList = action.receivedData.jrOri.stockCardList
			const pageSize = CostTransferTemp.pageSize

			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['CostTransferTemp', 'canUseWarehouse'], item.get('canUseWarehouse'))
									.setIn(['views', 'projectRange'], receivedData.get('projectRange'))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
									.setIn(['CostTransferTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['CostTransferTemp', 'dealTypeUuid'], receivedData.get('relationCategoryUuid'))
									.setIn(['CostTransferTemp', 'categoryName'], receivedData.get('categoryName'))
									.setIn(['CostTransferTemp', 'dealTypeName'], receivedData.get('relationCategoryName'))
									.setIn(['CostTransferTemp', 'dealCategoryType'], action.receivedData.jrOri.relationCategoryType)
									.setIn(['CostTransferTemp', 'costStockList'], receivedData.get('stockCardList'))
									.setIn(['CostTransferTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
									.setIn(['CostTransferTemp', 'propertyCostList'], receivedData.get('propertyCostList'))
									.setIn(['CostTransferTemp', 'propertyCost'], receivedData.get('propertyCost'))
									// .setIn(['CostTransferTemp', 'cardUuid'], stockCardRange.uuid)
									.setIn(['CostTransferTemp', 'stockCardList'], fromJS(stockCardList))
									.setIn(['CostTransferTemp', 'selectStockItem'], fromJS(stockCardList))
									.setIn(['CostTransferTemp','totalNumber'], stockCardList.length)
			stockCardList && stockCardList.map((item,i) => {
				state = state.setIn(['CostTransferTemp', 'stockCardList',i,'allUnit'],fromJS(item.unit))
							.setIn(['CostTransferTemp', 'stockCardList',i,'unitCardName'],item.unit ? item.unit.name : '')
							.setIn(['CostTransferTemp', 'selectStockItem',i,'unitCardName'],item.unit ? item.unit.name : '')
			})


			if (action.insertOrModify === 'modify' || action.disabledChange) {
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['CostTransferTemp', 'oriUuid'], receivedData.get('oriUuid'))
							.setIn(['CostTransferTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['CostTransferTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['CostTransferTemp', 'carryoverAmount'], receivedData.get('notHandleAmount'))
							.setIn(['CostTransferTemp', 'uuidList'], receivedData.get('stockWeakList').map((v,i) => v.get('jrJvUuid')).slice(0,pageSize) )
							.setIn(['CostTransferTemp','projectCard'], receivedData.get('projectCardList'))
							.setIn(['CostTransferTemp','usedProject'], receivedData.get('usedProject'))
							.setIn(['CostTransferTemp','beProject'], receivedData.get('beProject'))
							.setIn(['CostTransferTemp','enclosureList'], enclosureList)
							.setIn(['CostTransferTemp','cardPages'], Math.ceil(receivedData.get('stockWeakList').size/pageSize))
							.setIn(['CostTransferTemp','currentCardPage'], 1)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))

				const stockCardUuidList = []
				if(receivedData.get('oriState') !== 'STATE_YYSR_ZJ'){
					receivedData.getIn(['stockWeakList']).map(item => {
						stockCardUuidList.push({uuid:item.get('stockCardUuid'),amount:item.get('amount'),onlyId:item.get('jrJvUuid'),quantity:item.get('quantity'),quantityAmount: item.get('quantityAmount'),number: item.get('number'),storeNumber: item.get('storeNumber') })
						stockCardList.forEach((v,i) => {
							if(v.cardUuid === item.get('stockCardUuid')){
								state = state.setIn(['CostTransferTemp', 'stockCardList',i,'unitCardName'],item.get('unitCardName') )
								state = state.setIn(['CostTransferTemp', 'selectStockItem',i,'unitCardName'],item.get('unitCardName') )
							}
						})
					})

					stockCardList && stockCardList.map((v,i) =>{
						let curStockUuid,curStockAmount=0,curNumber = 0,curStoreNumber = 0,curName='',curQuantityAmount = 0,curQuantity= 0
						stockCardUuidList && stockCardUuidList.map((item,j) => {
							if(item.uuid === v.cardUuid){
								curStockUuid = item.uuid
								curName = item.unitCardName
								curStockAmount = numberCalculate(curStockAmount,item.amount)
								curQuantity = numberCalculate(curQuantity,item.quantity,4,'add',4) //流水数量
								curNumber = numberCalculate(curNumber,item.number,4,'add',4) //统计数量
								curQuantityAmount = numberCalculate(curQuantityAmount,item.quantityAmount)
								curStoreNumber = item.storeNumber

							}
						})
						const unitPrice = (curNumber === 0 || numberCalculate(curQuantityAmount,curNumber,4,'divide',4) < 0)  ? 0 : numberCalculate(curQuantityAmount,curNumber,4,'divide',4)

						state = state.setIn(['CostTransferTemp','stockCardList',i,'referencePrice'],numberCalculate(curQuantityAmount,curNumber,4,'divide',4))
									.setIn(['CostTransferTemp','stockCardList',i,'referenceQuantity'],curStoreNumber)
									.setIn(['CostTransferTemp','selectStockItem',i,'referencePrice'],numberCalculate(curQuantityAmount,curNumber,4,'divide',4))
									.setIn(['CostTransferTemp','selectStockItem',i,'referenceQuantity'],curStoreNumber)


					})

				}else{
					stockCardList.forEach((v,i) => {
						state = state.setIn(['CostTransferTemp', 'stockCardList',i,'unitCardName'],v.unitName)
									.setIn(['CostTransferTemp', 'stockCardList',i,'unitUuid'],v.unitUuid)
									.setIn(['CostTransferTemp', 'stockCardList',i,'warehouseCardName'],v.warehouseCardName)
									.setIn(['CostTransferTemp', 'selectStockItem',i,'unitCardName'],v.unitName)
									.setIn(['CostTransferTemp', 'selectStockItem',i,'unitUuid'],v.unitUuid)
									.setIn(['CostTransferTemp', 'selectStockItem',i,'warehouseCardName'],v.warehouseCardName)
					})
				}


				state = state.setIn(['CostTransferTemp','costTransferList'], receivedData.get('stockWeakList'))
							.setIn(['CostTransferTemp','canModifyList'], receivedData.get('stockWeakList'))
							.setIn(['views','selectItem'], receivedData.get('stockWeakList'))
							.setIn(['views','selectList'], receivedData.get('stockWeakList').map(v => v.get('jrJvUuid')))
							.setIn(['CostTransferTemp', 'stockCardUuidList'], fromJS(stockCardUuidList))

			} else {
				state = state.setIn(['CostTransferTemp', 'oriUuid'], '')
							.setIn(['CostTransferTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['CostTransferTemp', 'carryoverAmount'], '')
							.setIn(['CostTransferTemp', 'uuidList'], fromJS([item.get('oriUuid')]))

				state = state.setIn(['CostTransferTemp','costTransferList'], fromJS([item]))

			}
            return state
        },
		// 查看发票认证 跳转到 录入发票认证
		[ActionTypes.INVOICE_AUTH_FROM_SEARCH_JUMP_TO_LRLS]          : () => {
			const item = action.item
			const InvoiceAuthTemp = editCalculateState.get('InvoiceAuthTemp').toJS()
			const receivedData = fromJS({...InvoiceAuthTemp,...action.receivedData.category,...action.receivedData.jrOri})
			let stockCardUuidList = []
			receivedData.get('pendingStrongList').map(v =>{
				stockCardUuidList.push({onlyId:v.get('oriUuid')})
			})
			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['InvoiceAuthTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['InvoiceAuthTemp', 'categoryUuid'], receivedData.get('categoryUuid'))
									.setIn(['InvoiceAuthTemp', 'oriState'], receivedData.get('oriState'))
									.setIn(['InvoiceAuthTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)

			if (action.insertOrModify === 'modify' || action.disabledChange) {
				// const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['InvoiceAuthTemp', 'oriUuid'], item.get('oriUuid'))
							// .setIn(['InvoiceAuthTemp','enclosureList'], enclosureList)
							.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
							.setIn(['InvoiceAuthTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['InvoiceAuthTemp', 'amount'], receivedData.get('amount'))
							.setIn(['InvoiceAuthTemp', 'billAuthType'], receivedData.get('oriState') === 'STATE_FPRZ_CG' ? 'BILL_AUTH_TYPE_CG': 'BILL_AUTH_TYPE_TG')
							.setIn(['InvoiceAuthTemp', 'uuidList'], receivedData.get('pendingStrongList').map(v => v.get('jrJvUuid')) )
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))
							.setIn(['InvoiceAuthTemp', 'stockCardUuidList'], fromJS(stockCardUuidList) )

				state = state.setIn(['InvoiceAuthTemp', 'invoiceAuthList'], receivedData.getIn(['pendingStrongList']))

			} else {
				state = state.setIn(['InvoiceAuthTemp', 'oriUuid'], '')
							.setIn(['InvoiceAuthTemp', 'billAuthType'], receivedData.get('oriState') === 'STATE_FPRZ_CG' ? 'BILL_AUTH_TYPE_CG': 'BILL_AUTH_TYPE_TG')
							.setIn(['InvoiceAuthTemp', 'uuidList'], fromJS([item.get('jrJvUuid')]))

				state = state.setIn(['InvoiceAuthTemp', 'invoiceAuthList'], fromJS([item]))
			}
            return state
		},
		// 查看开具发票 跳转到 录入开具发票
		[ActionTypes.INVOICING_FROM_SEARCH_JUMP_TO_LRLS]              : () => {
			const item = action.item
			const InvoicingTemp = editCalculateState.get('InvoicingTemp').toJS()
			const receivedData = fromJS({...InvoicingTemp,...action.receivedData.category,...action.receivedData.jrOri})
			let stockCardUuidList = []
			receivedData.get('pendingStrongList').map(v =>{
				stockCardUuidList.push({onlyId:v.get('oriUuid')})
			})
			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['InvoicingTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['InvoicingTemp', 'categoryUuid'], receivedData.get('categoryUuid'))
									.setIn(['InvoicingTemp', 'oriState'], receivedData.get('oriState'))
									.setIn(['InvoicingTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
			if (action.insertOrModify === 'modify' || action.disabledChange) {
				const billMakeOutType = receivedData.get('oriState') === 'STATE_KJFP_XS' ? 'BILL_MAKE_OUT_TYPE_XS' : 'BILL_MAKE_OUT_TYPE_TS'
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['InvoicingTemp', 'oriUuid'], item.get('oriUuid'))
							.setIn(['InvoicingTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
							.setIn(['InvoicingTemp', 'amount'], receivedData.get('amount'))
							.setIn(['InvoicingTemp','enclosureList'], enclosureList)
							.setIn(['InvoicingTemp', 'billMakeOutType'], billMakeOutType)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))
							.setIn(['InvoicingTemp', 'uuidList'], receivedData.get('pendingStrongList').map(v => v.get('jrJvUuid')) )
							.setIn(['InvoicingTemp', 'stockCardUuidList'], fromJS(stockCardUuidList) )

				state = state.setIn(['InvoicingTemp','invoicingList'], receivedData.getIn(['pendingStrongList']))

			} else {
				state = state.setIn(['InvoicingTemp', 'oriUuid'], '')
							.setIn(['InvoicingTemp', 'billMakeOutType'], receivedData.get('oriState') === 'STATE_KJFP_XS' ? 'BILL_MAKE_OUT_TYPE_XS': 'BILL_MAKE_OUT_TYPE_TS')
							.setIn(['InvoicingTemp', 'uuidList'], fromJS([receivedData.get('jrJvUuid')]))

				state = state.setIn(['InvoicingTemp','invoicingList'], fromJS([receivedData]))
			}
            return state
		},
		// 查看转出未交 跳转到 录入转出未交
		[ActionTypes.TRANSFER_OUT_FROM_SEARCH_JUMP_TO_LRLS]             : () => {
			const item = action.item
			const InvoicingTemp = editCalculateState.get('DepreciationTemp').toJS()
			const receivedData = fromJS({...InvoicingTemp,...action.receivedData.category,...action.receivedData.jrOri})

			// const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.set('TransferOutTemp', fromJS(receivedData))
									.setIn(['TransferOutTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
									.setIn(['TransferOutTemp', 'oriUuid'], item.get('oriUuid'))
									.setIn(['TransferOutTemp', 'jrIndex'], receivedData.get('jrIndex'))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
									.setIn(['TransferOutTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['TransferOutTemp', 'categoryUuid'], receivedData.get('categoryUuid'))
									.setIn(['TransferOutTemp', 'handleMonth'], receivedData.getIn(['pendingStrongList', 0, 'oriDate']).substr(0, 7))
									.setIn(['views', 'switchUuidList'], action.uuidList)
									.setIn(['views', 'oriUuid'], item.get('oriUuid'))
									.setIn(['TransferOutTemp', 'uuidList'], receivedData.get('pendingStrongList').map(v => v.get('oriUuid')) )
									// .setIn(['TransferOutTemp','enclosureList'], enclosureList)


			// 计算进税、销项额数 和 税额
			let inputAmount = 0
			let inputCount = 0
			let outputAmount = 0
			let outputCount = 0
			receivedData.get('pendingStrongList').forEach(v => {
				if (v.get('jrJvTypeName') === '销项税额') {
					outputCount = outputCount + 1
					outputAmount = outputAmount + v.get('handleAmount')
				} else {
					inputCount = inputCount + 1
					inputAmount = inputAmount + v.get('handleAmount')
				}
			})

			state = state.setIn(['TransferOutTemp','transferOutObj', 'jrJvVatDtoList'], receivedData.get('pendingStrongList'))
						.setIn(['TransferOutTemp','transferOutObj', 'inputAmount'], inputAmount)
						.setIn(['TransferOutTemp','transferOutObj', 'inputCount'], inputCount)
						.setIn(['TransferOutTemp','transferOutObj', 'outputAmount'], outputAmount)
						.setIn(['TransferOutTemp','transferOutObj', 'outputCount'], outputCount)

            return state
		},
		// 查看收付管理 跳转到 录入收付管理
		[ActionTypes.PAYMANAGE_FROM_SEARCH_JUMP_TO_LRLS]              : () => {
			const item = action.item
			const SfglTemp = editCalculateState.get('SfglTemp').toJS()
			const pageSize = item.get('pageSize') ? item.get('pageSize') : 20
			const receivedData = fromJS({...SfglTemp,...action.receivedData.category,...action.receivedData.jrOri})
			const isModeRunning = receivedData.get('oriState') === 'STATE_SFGL_ML' ? true : false
			const detail = action.receivedData.jrOri.pendingManageDto.pendingManageList
			const debitTotal = action.receivedData.jrOri.pendingManageDto.debitTotal
			const creditTotal = action.receivedData.jrOri.pendingManageDto.creditTotal
			let totalAmount = 0,newDetail = []
			detail && detail.length && detail.map((v, i) => {
				const direction = v.direction
				let showAmount
				let amount = Number(v.amount)
				showAmount = amount.toFixed(2)
				if(direction === 'debit') {
					totalAmount += Number(showAmount)
				}else {
					totalAmount -= Number(showAmount)
				}
				newDetail.push({
					...v,
					moedAmount: v.handleAmount
				})
			})
			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['SfglTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['SfglTemp', 'categoryUuid'], receivedData.getIn(['pendingManageDto','categoryUuid']))
									.setIn(['SfglTemp', 'categoryName'], receivedData.getIn(['pendingManageDto','categoryName']))
									.setIn(['SfglTemp', 'oriState'], receivedData.get('oriState'))
									.setIn(['SfglTemp', 'oriUuid'], receivedData.get('oriUuid'))
									.setIn(['SfglTemp', 'jrUuid'], receivedData.get('jrUuid'))
									.setIn(['SfglTemp', 'isModeRunning'], isModeRunning)
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
									.setIn(['SfglTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
			if (action.insertOrModify === 'modify' || action.disabledChange) {
				if(action.receivedData.jrOri.accounts.length === 1){
					state = state.setIn(['SfglTemp', 'accountUuid'], receivedData.getIn(['accounts',0,'accountUuid']))
								.setIn(['SfglTemp', 'accountName'], receivedData.getIn(['accounts',0,'accountName']))
								.setIn(['SfglTemp', 'accounts'], fromJS([action.receivedData.jrOri.accounts[0],{amount:''}]))
								.setIn(['SfglTemp', 'usedAccounts'], false)
				}else if(action.receivedData.jrOri.accounts.length > 1){
					state = state.setIn(['SfglTemp', 'accounts'], fromJS(action.receivedData.jrOri.accounts))
								.setIn(['SfglTemp', 'usedAccounts'], true)

				}
				const amountName = receivedData.get('oriState') === 'STATE_SFGL_ML' ? 'moedAmount' : 'handlingAmount'
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['SfglTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['SfglTemp', amountName], receivedData.get('amount'))
							.setIn(['SfglTemp', 'cardUuid'], receivedData.getIn(['currentCardList',0,'cardUuid']))
							.setIn(['SfglTemp', 'usedCard','code'], receivedData.getIn(['currentCardList',0,'code']))
							.setIn(['SfglTemp', 'usedCard','name'], receivedData.getIn(['currentCardList',0,'name']))

							.setIn(['SfglTemp','cardPages'], Math.ceil(receivedData.getIn(['pendingManageDto','pendingManageList']).size/pageSize))
							.setIn(['SfglTemp','currentCardPage'], 1)
							.setIn(['SfglTemp','pageSize'], pageSize)
							.setIn(['SfglTemp','totalNumber'], receivedData.getIn(['pendingManageDto','pendingManageList']).size)
							.setIn(['SfglTemp','debitTotal'], debitTotal)
							.setIn(['SfglTemp','creditTotal'], creditTotal)
							.setIn(['SfglTemp','unAutomatic'], receivedData.getIn(['pendingManageDto','isManualWriteOff']))
							.setIn(['SfglTemp','enclosureList'], enclosureList)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))
							.setIn(['views', 'selectList'], receivedData.getIn(['pendingManageDto','pendingManageList']).map(v => v.get('uuid')) )
							.setIn(['views', 'indexList'], receivedData.getIn(['pendingManageDto','pendingManageList']).map((v,i) => i) )
							.setIn(['views', 'selectItem'], fromJS(newDetail) )
							.setIn(['views', 'totalAmount'], totalAmount)

				state = state.setIn(['SfglTemp','detail'], fromJS(newDetail))

			} else {
				state = state.setIn(['SfglTemp', 'oriUuid'], '')
							.setIn(['views', 'selectList'], fromJS([]))
                            .setIn(['views', 'indexList'], fromJS([]))
                            .setIn(['views', 'selectItem'], fromJS([]))
							.setIn(['SfglTemp', 'uuidList'], fromJS([item.get('oriUuid')]))
							.setIn(['SfglTemp', 'debitTotal'], 0)
							.setIn(['SfglTemp', 'creditTotal'], 0)

				state = state.setIn(['SfglTemp','detail'], fromJS([receivedData]))
			}
            return state
		},
		// 查看费用分摊 跳转到 录入费用分摊
		[ActionTypes.COMMONCHARGE_FROM_SEARCH_JUMP_TO_LRLS]              : () => {
			const item = action.item
			const pageSize = item.get('pageSize') ? item.get('pageSize') : 20
			const CommonChargeTemp = editCalculateState.get('CommonChargeTemp').toJS()
			const receivedData = fromJS({...CommonChargeTemp,...action.receivedData.category,...action.receivedData.jrOri})

			state = editCalculateState.set('CommonChargeTemp', receivedData)
									.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
									.setIn(['CommonChargeTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['CommonChargeTemp', 'oriState'], receivedData.get('oriState'))
									.setIn(['CommonChargeTemp', 'oriUuid'], receivedData.get('oriUuid'))
									.setIn(['CommonChargeTemp', 'jrUuid'], receivedData.get('jrUuid'))
									.setIn(['CommonChargeTemp', 'tabName'], action.receivedData.jrOri.shareType)
									.setIn(['CommonChargeTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
			if (action.insertOrModify === 'modify' || action.disabledChange) {
				let amount = 0
				receivedData.get('pendingProjectShareList').map(item => {
					amount += item.get('amount')
				})
				state = state.setIn(['CommonChargeTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['CommonChargeTemp', 'amount'], amount)
							.setIn(['CommonChargeTemp','cardPages'], Math.ceil(receivedData.get('pendingProjectShareList').size/pageSize))
							.setIn(['CommonChargeTemp','modifycurrentPage'], 1)
							.setIn(['CommonChargeTemp','pageSize'], pageSize)
							.setIn(['CommonChargeTemp','totalNumber'], receivedData.get('pendingProjectShareList').size)
							.setIn(['views', 'selectItem'], receivedData.get('pendingProjectShareList'))
							.setIn(['views', 'selectList'], receivedData.get('pendingProjectShareList').map(v => v.get('jrJvUuid')))
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))

				state = state.setIn(['CommonChargeTemp','paymentList'], receivedData.get('pendingProjectShareList'))

			} else {
				state = state.setIn(['CommonChargeTemp', 'oriUuid'], '')
							.setIn(['views', 'selectList'], fromJS([]))
                            .setIn(['views', 'indexList'], fromJS([]))
							.setIn(['CommonChargeTemp', 'uuidList'], fromJS([item.get('oriUuid')]))

				state = state.setIn(['CommonChargeTemp','detail'], fromJS([receivedData]))
			}
            return state
		},
		// 查看存货调拨 跳转到 录入存货调拨
		[ActionTypes.INVENTORY_TRANSFER_FROM_SEARCH_JUMP_TO_LRLS]            : () => {

			const item = action.item
			const StockTemp = editCalculateState.get('StockTemp').toJS()
			const receivedData = fromJS({...StockTemp,...action.receivedData.category,...action.receivedData.jrOri})


			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['StockTemp', 'oriAbstract'], receivedData.get('oriAbstract'))

			if (action.insertOrModify === 'modify' || action.disabledChange) {
				let stockCardList = []
				action.receivedData.jrOri.stockCardList.map(item => {
					stockCardList.push({
						...item,
						unit:{
							uuid:item.unitUuid,
							name:item.unitName,
						}
					})
				})
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				const chooseWareHouseCardList = []
				action.receivedData.jrOri.warehouseCardList.map(item => {
					chooseWareHouseCardList.push({
						cardUuid: item.cardUuid,
						name:`${item.code} ${item.name}`,
						warehouseStatus: item.warehouseStatus
					})
				})
				state = state.setIn(['StockTemp', 'oriUuid'], receivedData.get('oriUuid'))
							.setIn(['StockTemp', 'jrUuid'], receivedData.get('jrUuid'))
							.setIn(['StockTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['StockTemp', 'oriState'], receivedData.get('oriState'))
							// .setIn(['StockTemp', 'uuidList'], receivedData.get('stockWeakList').map(v => v.get('jrJvUuid')) )
							.setIn(['StockTemp','chooseWareHouseCardList'], fromJS(chooseWareHouseCardList))
							.setIn(['StockTemp','enclosureList'], enclosureList)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))
							.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
							.setIn(['StockTemp', 'oriState'], 'STATE_CHDB')
							.setIn(['StockTemp', 'stockCardList'], fromJS(stockCardList))
							.setIn(['StockTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)

				const stockCardUuidList = []
				receivedData.getIn(['stockWeakList']).map(item => {
					stockCardUuidList.push({uuid:item.get('stockCardUuid'),amount:item.get('amount'),onlyId:item.get('jrJvUuid'),quantity:item.get('quantity'),quantityAmount: item.get('quantityAmount')})
				})
				state = state.setIn(['StockTemp','costTransferList'], receivedData.getIn(['stockWeakList']))
							.setIn(['StockTemp','canModifyList'], receivedData.getIn(['stockWeakList']))
							.setIn(['StockTemp', 'stockCardUuidList'], fromJS(stockCardUuidList))
							.setIn(['StockTemp','categoryUuid'], action.receivedData.category.uuid)

			} else {
				state = state.setIn(['StockTemp', 'oriUuid'], '')
							.setIn(['StockTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['StockTemp', 'carryoverAmount'], '')
							.setIn(['StockTemp', 'uuidList'], fromJS([item.get('oriUuid')]))
							.setIn(['StockTemp', 'stockCardList'], fromJS([]))

				state = state.setIn(['StockTemp','costTransferList'], fromJS([item]))

			}
            return state
        },
		// 查看存货余额调整 跳转到 录入存货余额调整
		[ActionTypes.INVENTORY_BALANCE_FROM_SEARCH_JUMP_TO_LRLS]            : () => {

			const item = action.item
			const BalanceTemp = editCalculateState.get('BalanceTemp').toJS()
			const receivedData = fromJS({...BalanceTemp,...action.receivedData.category,...action.receivedData.jrOri})
			const jrState = receivedData.get('jrState')

			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['BalanceTemp', 'canUseWarehouse'], item.get('canUseWarehouse'))
									.setIn(['BalanceTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['BalanceTemp', 'categoryUuid'], receivedData.get('categoryUuid'))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)

			if (action.insertOrModify === 'modify' || action.disabledChange) {
				let stockCardList = [], chooseStockCard = {}, oriStockCardList = [], oriWarehouseCardList = []
				action.receivedData.jrOri.stockCardList && action.receivedData.jrOri.stockCardList.map((item,i) => {
					oriStockCardList.push(item.cardUuid)
					stockCardList.push({
						...item,
						allUnit:{
							uuid:item.unitUuid,
							name:item.unitName,
						},
						price: numberCalculate(item.amount,item.quantity,4,'divide',4),
						afterAmount: numberCalculate(item.beforeAmount,item.amount),
						afterQuantity: numberCalculate(item.beforeQuantity,item.quantity,4,'add',4),
						beforePrice: numberCalculate(item.beforeAmount,item.beforeQuantity,4,'divide',4),
						afterPrice: numberCalculate(numberCalculate(item.beforeAmount,item.amount),numberCalculate(item.beforeQuantity,item.quantity,4,'add',4),4,'divide',4),
						warehouseCardName: item.warehouseCardName
					})



				})
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['BalanceTemp', 'oriUuid'], receivedData.get('oriUuid'))
							.setIn(['BalanceTemp', 'jrUuid'], receivedData.get('jrUuid'))
							.setIn(['BalanceTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['BalanceTemp', 'oriState'], receivedData.get('jrState'))
							.setIn(['BalanceTemp','chooseStockCard'], fromJS(chooseStockCard))
							.setIn(['BalanceTemp','enclosureList'], enclosureList)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))
							.setIn(['BalanceTemp', 'stockCardList'], fromJS(stockCardList))
							.setIn(['BalanceTemp', 'oriStockList'], fromJS(stockCardList))
							.setIn(['BalanceTemp', 'oriStockCardList'], fromJS(oriStockCardList))
							.setIn(['BalanceTemp', 'oriWarehouseCardList'], fromJS(oriWarehouseCardList))
							.setIn(['BalanceTemp','categoryUuid'], action.receivedData.category.uuid)
							.setIn(['BalanceTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)

			} else {
				state = state.setIn(['BalanceTemp', 'oriUuid'], '')
							.setIn(['BalanceTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['BalanceTemp', 'carryoverAmount'], '')
							.setIn(['BalanceTemp', 'uuidList'], fromJS([item.get('oriUuid')]))
							.setIn(['BalanceTemp', 'stockCardList'], fromJS([]))

			}
            return state
        },
		// 查看进项税额转出 跳转到 录入进项税额转出
		[ActionTypes.TAX_TRANSTER_FROM_SEARCH_JUMP_TO_LRLS]            : () => {

			const item = action.item
			const TaxTransferTemp = editCalculateState.get('TaxTransferTemp').toJS()
			const receivedData = fromJS({...TaxTransferTemp,...action.receivedData.category,...action.receivedData.jrOri})
			const stockCardList = action.receivedData.jrOri.stockCardList

			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['TaxTransferTemp', 'canUseWarehouse'], item.get('canUseWarehouse'))
									.setIn(['views', 'categoryMessage'], fromJS(action.receivedData.category))
									.setIn(['views', 'categoryMessage','categoryType'], action.receivedData.category.relationCategoryType)
									.setIn(['views', 'projectRange'], receivedData.get('projectRange'))
									.setIn(['TaxTransferTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['TaxTransferTemp', 'dealTypeUuid'], receivedData.get('relationCategoryUuid'))
									.setIn(['TaxTransferTemp', 'categoryName'], receivedData.get('categoryName'))
									.setIn(['TaxTransferTemp', 'dealTypeName'], receivedData.get('relationCategoryName'))
									// .setIn(['commonCardObj', 'thingsList'], receivedData.get('stockCardList'))
									.setIn(['TaxTransferTemp', 'beCertificate'], action.receivedData.jrOri.beCertificate)
									.setIn(['TaxTransferTemp', 'stockCardList'], fromJS(stockCardList))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)
			stockCardList && stockCardList.map((item,i) => {
				state = state.setIn(['TaxTransferTemp', 'stockCardList',i,'allUnit'],fromJS(item.unit))
				state = state.setIn(['TaxTransferTemp', 'stockCardList',i,'unitCardName'],item.unit ? item.unit.name : '')
			})


			if (action.insertOrModify === 'modify' || action.disabledChange) {
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				state = state.setIn(['TaxTransferTemp', 'oriUuid'], receivedData.get('oriUuid'))
							.setIn(['TaxTransferTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['TaxTransferTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['TaxTransferTemp','projectCard'], receivedData.getIn(['projectCardList',0]) ? receivedData.getIn(['projectCardList',0]) : fromJS({}))
							.setIn(['TaxTransferTemp','usedProject'], receivedData.get('usedProject'))
							.setIn(['TaxTransferTemp','amount'], receivedData.get('amount'))
							.setIn(['TaxTransferTemp','propertyCarryover'], receivedData.get('propertyCarryover'))
							.setIn(['TaxTransferTemp','propertyCost'], receivedData.get('propertyCost'))
							.setIn(['TaxTransferTemp','enclosureList'], enclosureList)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))

			} else {
				state = state.setIn(['TaxTransferTemp', 'oriUuid'], '')
							.setIn(['TaxTransferTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['TaxTransferTemp', 'uuidList'], fromJS([item.get('oriUuid')]))

				state = state.setIn(['TaxTransferTemp','taxTransferList'], fromJS([item]))

			}
            return state
        },
		// 查看存货组装拆卸 跳转到 录入存货组装拆卸
		[ActionTypes.STOCK_BUILDUP_FROM_SEARCH_JUMP_TO_LRLS]            : () => {

			const item = action.item
			const StockBuildUpTemp = editCalculateState.get('StockBuildUpTemp').toJS()
			const receivedData = fromJS({...StockBuildUpTemp,...action.receivedData.category,...action.receivedData.jrOri})
			const oriState = receivedData.get('oriState')
			const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])

			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['StockBuildUpTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)

			if (action.insertOrModify === 'modify' || action.disabledChange) {
				let stockCardList = [], stockCardOtherList = [], oriStockCardList = [], oriStockCardOtherList = []
				if(oriState === 'STATE_CHZZ_ZZCX'){
					action.receivedData.jrOri.stockCardList && action.receivedData.jrOri.stockCardList.map((item,i) => {
						let basicUnitQuantity = 1
						if(item.unit){
							if(item.unit.unitUuid === item.unitUuid){
								basicUnitQuantity = item.unit.basicUnitQuantity ? item.unit.basicUnitQuantity : 1
							}else{
								item.unit.unitList && item.unit.unitList.map(unitItem => {
									if(unitItem.uuid === item.unitUuid){
										basicUnitQuantity = unitItem.basicUnitQuantity ? unitItem.basicUnitQuantity : 1
									}
								})
							}
						}

						oriStockCardList.push(`${item.cardUuid}+${item.warehouseCardUuid}`)
						stockCardList.push({
							...item,
							price: numberCalculate(item.amount,item.quantity,4,'divide',4),
							basicUnitQuantity,
						})
					})

					action.receivedData.jrOri.stockCardOtherList && action.receivedData.jrOri.stockCardOtherList.map((item,i) => {
						oriStockCardOtherList.push(`${item.cardUuid}+${item.warehouseCardUuid}`)
						let basicUnitQuantity = 1
						if(item.unit){
							if(item.unit.unitUuid === item.unitUuid){
								basicUnitQuantity = item.unit.basicUnitQuantity ? item.unit.basicUnitQuantity : 1
							}else{
								item.unit.unitList && item.unit.unitList.map(unitItem => {
									if(unitItem.uuid === item.unitUuid){
										basicUnitQuantity = unitItem.basicUnitQuantity ? unitItem.basicUnitQuantity : 1
									}
								})
							}
						}

						stockCardOtherList.push({
							...item,
							basicUnitQuantity,
							price: numberCalculate(item.amount,item.quantity,4,'divide',4),
						})

					})
					state= state.setIn(['StockBuildUpTemp', 'stockCardList'], fromJS(stockCardList))
								.setIn(['StockBuildUpTemp', 'stockCardOtherList'], fromJS(stockCardOtherList))
								.setIn(['StockBuildUpTemp', 'oriStockCardList'], fromJS(oriStockCardList))
								.setIn(['StockBuildUpTemp', 'oriStockCardOtherList'], fromJS(oriStockCardOtherList))
				}else{
					stockCardList = action.receivedData.jrOri.stockCardList && action.receivedData.jrOri.stockCardList.map((item,index) => {
						return {
							...item,
							materialList: item.childCardList && item.childCardList.map(v => {
								oriStockCardList.push(`${index}+${item.cardUuid}+${item.warehouseCardUuid}`)
								let basicUnitQuantity = 1
								if(v.unit){
									if(v.unit.unitUuid === v.unitUuid){
										basicUnitQuantity = v.unit.basicUnitQuantity ? v.unit.basicUnitQuantity : 1
									}else{
										v.unit.unitList && v.unit.unitList.map(unitItem => {
											if(unitItem.uuid === v.unitUuid){
												basicUnitQuantity = unitItem.basicUnitQuantity ? unitItem.basicUnitQuantity : 1
											}
										})
									}
								}

								return {
									...v,
									materialUuid: v.cardUuid,
									isOpenQuantity: v.isOpenedQuantity,
									basicUnitQuantity
								}
							}) || [],
							uuid: item.cardUuid,
							productUuid: item.cardUuid,
							curQuantity: item.quantity
						}
					}) || []
					state = state.setIn(['StockBuildUpTemp', 'assemblySheet'], fromJS(stockCardList))
								.setIn(['StockBuildUpTemp', 'oriStockCardList'], fromJS(oriStockCardList))
				}
				state = state.setIn(['StockBuildUpTemp', 'oriUuid'], receivedData.get('oriUuid'))
							.setIn(['StockBuildUpTemp', 'jrUuid'], receivedData.get('jrUuid'))
							.setIn(['StockBuildUpTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['StockBuildUpTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['StockBuildUpTemp', 'beCertificate'], receivedData.get('beCertificate'))
							.setIn(['StockBuildUpTemp','enclosureList'], enclosureList)
							.setIn(['StockBuildUpTemp','categoryUuid'], action.receivedData.category.uuid)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))

			} else {
				state = state.setIn(['StockBuildUpTemp', 'oriUuid'], '')
							.setIn(['StockBuildUpTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['StockBuildUpTemp', 'uuidList'], fromJS([item.get('oriUuid')]))
							.setIn(['stockCardOtherList', 'stockCardList'], fromJS([]))
							.setIn(['StockBuildUpTemp', 'oriStockCardList'], fromJS([]))
							.setIn(['StockBuildUpTemp', 'oriStockCardOtherList'], fromJS([]))

			}
            return state
        },
		// 查看存货投入项目 跳转到 录入存货投入项目
		[ActionTypes.STOCK_INTO_PROJECT_FROM_SEARCH_JUMP_TO_LRLS]            : () => {

			const item = action.item
			const StockIntoProjectTemp = editCalculateState.get('StockIntoProjectTemp').toJS()
			const receivedData = fromJS({...StockIntoProjectTemp,...action.receivedData.category,...action.receivedData.jrOri})

			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['StockIntoProjectTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)

			if (action.insertOrModify === 'modify' || action.disabledChange) {
				let stockCardList = [],  oriStockCardList = []
				action.receivedData.jrOri.stockCardList && action.receivedData.jrOri.stockCardList.map((item,i) => {
					oriStockCardList.push(`${item.cardUuid}+${item.warehouseCardUuid}`)
					stockCardList.push({
						...item,
						price: numberCalculate(item.amount,item.quantity,4,'divide',4),
					})
				})
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])

				state = state.setIn(['StockIntoProjectTemp', 'oriUuid'], receivedData.get('oriUuid'))
							.setIn(['StockIntoProjectTemp', 'jrUuid'], receivedData.get('jrUuid'))
							.setIn(['StockIntoProjectTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['StockIntoProjectTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['StockIntoProjectTemp', 'beCertificate'], receivedData.get('beCertificate'))
							.setIn(['StockIntoProjectTemp','enclosureList'], enclosureList)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))
							.setIn(['StockIntoProjectTemp', 'stockCardList'], fromJS(stockCardList))
							.setIn(['StockIntoProjectTemp', 'oriStockCardList'], fromJS(oriStockCardList))
							.setIn(['StockIntoProjectTemp', 'projectCard'], fromJS(action.receivedData.jrOri.projectCardList[0]))

			} else {
				state = state.setIn(['StockIntoProjectTemp', 'oriUuid'], '')
							.setIn(['StockIntoProjectTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['StockIntoProjectTemp', 'uuidList'], fromJS([item.get('oriUuid')]))
							.setIn(['stockCardOtherList', 'stockCardList'], fromJS([]))
							.setIn(['StockIntoProjectTemp', 'oriStockCardList'], fromJS([]))
							.setIn(['StockIntoProjectTemp', 'oriStockCardOtherList'], fromJS([]))

			}
            return state
        },
		// 查看项目结转 跳转到 录入项目结转
		[ActionTypes.PROJECT_CARROVER_FROM_SEARCH_JUMP_TO_LRLS]            : () => {

			const item = action.item
			const ProjectCarryoverTemp = editCalculateState.get('ProjectCarryoverTemp').toJS()
			const receivedData = fromJS({...ProjectCarryoverTemp,...action.receivedData.category,...action.receivedData.jrOri})

			state = editCalculateState.setIn(['views', 'insertOrModify'], action.insertOrModify)
									.setIn(['ProjectCarryoverTemp', 'oriAbstract'], receivedData.get('oriAbstract'))
									.setIn(['views', 'paymentTypeStr'], action.receivedData.jrOri.categoryFullName)

			if (action.insertOrModify === 'modify' || action.disabledChange) {
				let stockCardList = [],  oriStockCardList = []
				action.receivedData.jrOri.stockCardList && action.receivedData.jrOri.stockCardList.map((item,i) => {
					oriStockCardList.push(`${item.cardUuid}+${item.warehouseCardUuid}`)
					stockCardList.push({
						...item,
						price: numberCalculate(item.amount,item.quantity,4,'divide',4),
					})
				})
				const enclosureList = receivedData.get('enclosureList') ? receivedData.get('enclosureList') : fromJS([])
				if(receivedData.get('oriState') === 'STATE_XMJZ_XMJQ'){
					state = state.setIn(['ProjectCarryoverTemp', 'carryoverList'], receivedData.get('pendingStrongList'))
				}

				state = state.setIn(['ProjectCarryoverTemp', 'oriUuid'], receivedData.get('oriUuid'))
							.setIn(['ProjectCarryoverTemp', 'jrUuid'], receivedData.get('jrUuid'))
							.setIn(['ProjectCarryoverTemp', 'jrIndex'], receivedData.get('jrIndex'))
							.setIn(['ProjectCarryoverTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['ProjectCarryoverTemp', 'beCertificate'], receivedData.get('beCertificate'))
							.setIn(['ProjectCarryoverTemp', 'allHappenAmount'], receivedData.get('allHappenAmount'))
							.setIn(['ProjectCarryoverTemp', 'allStoreAmount'], receivedData.get('allStoreAmount'))
							.setIn(['ProjectCarryoverTemp','enclosureList'], enclosureList)
							.setIn(['views', 'switchUuidList'], action.uuidList)
							.setIn(['views', 'oriUuid'], item.get('oriUuid'))
							.setIn(['ProjectCarryoverTemp', 'stockCardList'], fromJS(stockCardList))
							.setIn(['ProjectCarryoverTemp', 'oriStockCardList'], fromJS(oriStockCardList))
							.setIn(['ProjectCarryoverTemp', 'projectCard'], fromJS(action.receivedData.jrOri.projectCardList[0]))
							.setIn(['ProjectCarryoverTemp', 'receiveAmount'], fromJS(action.receivedData.jrOri.amount))
							.setIn(['ProjectCarryoverTemp', 'currentAmount'], fromJS(action.receivedData.jrOri.currentAmount))
							.setIn(['ProjectCarryoverTemp','cardPages'], Math.ceil(receivedData.get('pendingStrongList').size/Limit.EDIT_RUNNING_CHOOSE_TABLE))
							.setIn(['ProjectCarryoverTemp','currentCardPage'], 1)
							.setIn(['ProjectCarryoverTemp','pageSize'], Limit.EDIT_RUNNING_CHOOSE_TABLE)
							.setIn(['ProjectCarryoverTemp','totalNumber'], receivedData.get('pendingStrongList').size)

			} else {
				state = state.setIn(['ProjectCarryoverTemp', 'oriUuid'], '')
							.setIn(['ProjectCarryoverTemp', 'oriState'], receivedData.get('oriState'))
							.setIn(['ProjectCarryoverTemp', 'uuidList'], fromJS([item.get('oriUuid')]))
							.setIn(['stockCardOtherList', 'stockCardList'], fromJS([]))
							.setIn(['ProjectCarryoverTemp', 'oriStockCardList'], fromJS([]))
							.setIn(['ProjectCarryoverTemp', 'oriStockCardOtherList'], fromJS([]))

			}
            return state
        },
		[ActionTypes.XMJZ_GET_CARRYOVER_LIST]        : () => {
				state = state.setIn(['ProjectCarryoverTemp', 'carryoverList'], fromJS(action.receivedData.carryoverList))
									.setIn(['ProjectCarryoverTemp', 'allHappenAmount'], fromJS(action.receivedData.allHappenAmount))
									.setIn(['ProjectCarryoverTemp', 'allStoreAmount'], fromJS(action.receivedData.allStoreAmount))

				if(action.projectProperty === 'XZ_CONSTRUCTION'){
					state = state.setIn(['ProjectCarryoverTemp','cardPages'], Math.ceil(action.receivedData.carryoverList.length/Limit.EDIT_RUNNING_CHOOSE_TABLE))
								.setIn(['ProjectCarryoverTemp','currentCardPage'], 1)
								.setIn(['ProjectCarryoverTemp','pageSize'], Limit.EDIT_RUNNING_CHOOSE_TABLE)
								.setIn(['ProjectCarryoverTemp','totalNumber'], action.receivedData.carryoverList.length)
								.setIn(['ProjectCarryoverTemp','receiveAmount'], action.receivedData.allHappenAmount)
								.setIn(['ProjectCarryoverTemp','currentAmount'], action.receivedData.allStoreAmount)
				}
				return state

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
		// 处理类别
		[ActionTypes.GET_CALCULATE_DEAL_TYPE_CATEGORY]           : () => {
            state = state.setIn([action.temp, 'dealTypeList',0,'childList'], fromJS(action.receivedData[0].childList))

            return state
        },
		[ActionTypes.EDIT_CALCULATE_GAIN_OR_LOSS]           :() => {
          const { place, diff, deletePlace } = action
          return state.setIn(place, diff)
                      .deleteIn(deletePlace, diff)
        },
		[ActionTypes.EDIT_CALCULATE_CQZC_GAIN_OR_LOSS]           :() => {
			return state.setIn(action.place, action.diff)
        },
		[ActionTypes.CLEAR_FILTER_CONDITION]           :() => {
          return state.setIn(['SfglTemp','categoryNameAll'],fromJS([]))
                      .setIn(['SfglTemp','categoryUuidList'],fromJS([]))
                      .setIn(['SfglTemp','categoryNameList'],fromJS([]))
                      .setIn(['SfglTemp','chooseWriteOffType'],true)
        },
		[ActionTypes.CHANGE_PAYMENT_LIST_XMFT]           :() => {
          return state.setIn(['CommonChargeTemp','paymentList'],fromJS(action.paymentList))
                      .setIn(['CommonChargeTemp','currentPage'],action.currentPage)
                      .setIn(['CommonChargeTemp','pageSize'],action.pageSize)
                      .setIn(['CommonChargeTemp','cardPages'],action.cardPages)
                      .setIn(['CommonChargeTemp','totalNumber'],action.totalNumber)
        },
		// 获取收付管理列表
		[ActionTypes.GET_PAYMANAGE_LIST]  :() => {
			const detail = action.receivedData.pendingManageList
			const writeOffTypeList = action.receivedData.writeOffTypeList
			const writeOffType = action.receivedData.writeOffType ? action.receivedData.writeOffType : writeOffTypeList.length ? writeOffTypeList[0] : state.getIn(['SfglTemp', 'writeOffType'])
            state = state.setIn(['SfglTemp', 'detail'],fromJS(detail))
							.setIn(['SfglTemp', 'cardPages'],action.receivedData.pages)
							.setIn(['SfglTemp', 'currentCardPage'],action.receivedData.currentPage)
							.setIn(['SfglTemp', 'debitTotal'],action.receivedData.debitTotal)
							.setIn(['SfglTemp', 'creditTotal'],action.receivedData.creditTotal)
							.setIn(['SfglTemp', 'totalNumber'],action.receivedData.totalNumber)
							.setIn(['SfglTemp', 'condition'],action.condition)
							.setIn(['SfglTemp', 'writeOffType'],writeOffType)
							.setIn(['SfglTemp', 'beginDate'],action.begin)
							.setIn(['SfglTemp', 'endDate'],action.end)
			if(action.needWriteOffTypeList){
				state = state.setIn(['SfglTemp', 'writeOffTypeList'],fromJS(writeOffTypeList))
			}

			if(!action.fromPage){
				state = state.setIn(['views', 'selectList'], fromJS([]))
							.setIn(['views', 'indexList'], fromJS([]))
							.setIn(['views', 'selectItem'], fromJS([]))
				if(action.receivedData.writeOffType !== ''){
					state = state.setIn(['SfglTemp', 'handlingAmount'],0)
					state = state.setIn(['views', 'totalAmount'],numberCalculate(action.receivedData.debitTotal,action.receivedData.creditTotal,2,'subtract'))
				}else{
					state = state.setIn(['SfglTemp', 'handlingAmount'], '')
								.setIn(['views', 'totalAmount'], 0)
				}
			}else{
				let selectIndex = []
				const selectItem = state.getIn(['views','selectItem']).toJS()
				detail.map((item, index) => {
					selectItem.map(v => {
						if(item.uuid === v.uuid){
							selectIndex.push({index:index,item:v})
						}
					})
				})
				selectIndex.map(setItem => {
					state = state.setIn(['SfglTemp', 'detail',setItem.index],fromJS(setItem.item))
				})
			}
			return state
                      // .setIn(['calculateTemp', 'ass'],'')
        },
		[ActionTypes.ITIT_PAYMANAGE_LIST]  :() => {
            state = state.setIn(['SfglTemp', 'detail'],fromJS([]))
						.setIn(['SfglTemp', 'debitTotal'],0)
						.setIn(['SfglTemp', 'creditTotal'],0)
          return state.setIn(['views', 'selectList'], fromJS([]))
                        .setIn(['views', 'indexList'], fromJS([]))
                        .setIn(['views', 'totalAmount'], 0)
                        .setIn(['views', 'selectItem'], fromJS([]))
                      // .setIn(['calculateTemp', 'ass'],'')
        },
		[ActionTypes.INIT_WRITE_OFF_TYPE]        : () => {
			const writeOffTypeList = state.getIn(['SfglTemp','writeOffTypeList'])
			const writeOffType = writeOffTypeList.size ? writeOffTypeList.get(0) : ''
			return state = state.setIn(['SfglTemp','showDKModal'],false)
								.setIn(['SfglTemp','chooseWriteOffType'],false)
								// .setIn(['SfglTemp','writeOffType'],writeOffType)
		},
		[ActionTypes.EDITRUNNING_ITEM_CHECKBOX_CHECK]               : () => {
			const uuidName = action.uuidName
            const showLowerList = state.getIn(['views', 'selectList'])
            const selectItem = state.getIn(['views', 'selectItem'])
            if (!action.checked) {
                // 原来没选
                const newShowLowerList = showLowerList.push(action.item.get(uuidName))
                const newSelectItem = selectItem.push(fromJS({
					...(action.item.toJS()),
					handleAmount: action.item.get('amount')
				}))
                return state.setIn(['views', 'selectList'], newShowLowerList)
                            .setIn(['views', 'selectItem'], fromJS(newSelectItem))
            } else {
                // 原来选了
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.item.get(uuidName)), 1)
				const newSelectItem = selectItem.filter(item => item.get(uuidName)!== action.item.get(uuidName))
                return state.setIn(['views', 'selectList'], newShowLowerList)
                            .setIn(['views', 'selectItem'], newSelectItem)
            }

        },
		[ActionTypes.EDITRUNNING_ITEM_CHECKBOX_CHECK_ALL]               : () => {
			const uuidName = action.uuidName

            if (action.selectAll) {
                // 全不选
				const uuidList = []
				action.list.map( item => uuidList.push(item.get(uuidName)))
				const selectList = state.getIn(['views', 'selectList']).toJS()
				const selectItem = state.getIn(['views', 'selectItem'])

				const difference = (arr1, arr2) => {
					const set1 = new Set(arr1)
					const set2 = new Set(arr2)
					let subset = []
					for (let item of set1) {
						if (!set2.has(item)) {
							subset.push(item)
						}
					}
					return subset
				}

                return state.setIn(['views', 'selectList'], fromJS(difference(selectList,uuidList)))
                            .setIn(['views', 'selectItem'], selectItem.filter(item => uuidList.indexOf(item.get(uuidName)) === -1))
            } else {
                // 全选 accountList
                const accountList = action.list
                let selectAllList = state.getIn(['views', 'selectList']).toJS()
                // let selectAllIndex = []
				let selectAllItem = state.getIn(['views', 'selectItem']).toJS()
                accountList && accountList.size && accountList.forEach((v, i)=> {
					if(selectAllList.indexOf(v.get(uuidName)) === -1){
						selectAllList.push(v.get(uuidName))
						// selectAllIndex.push(i)
						selectAllItem.push({
							...v.toJS(),
							handleAmount: v.get('amount')

						})
					}
                })

                return state.setIn(['views', 'selectList'], fromJS(selectAllList))
                            // .setIn(['views', 'indexList'], fromJS(selectAllIndex))
                            .setIn(['views', 'selectItem'], fromJS(selectAllItem))
            }

        },
		// 选择项目单位
		[ActionTypes.COMMON_CHARGE_ITEM_CHECKBOX_SELECT]               : () => {
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
		[ActionTypes.SAVE_AND_NEW_COMMON_CHARGE]                           :() => {
            if (action.saveAndNew) {
                const CommonChargeTemp = editCalculateState.get('CommonChargeTemp')
                return state.set('CommonChargeTemp',CommonChargeTemp)
                           .set('enclosureList', fromJS([]))
                           .set('label', fromJS([]))
                           .set('needDeleteUrl', fromJS([]))
            }
           if(action.insertOrModify === 'insert') {
               state = state.setIn(['commonChargeTemp','oriUuid'], action.oriUuid)
                           .setIn(['commonChargeTemp','jrNumber'], action.jrNumber)
           }
            return state

        },
		// 获取仓库
		[ActionTypes.GET_CANUSE_WAREHOUSE_CARD_LIST]                           :() => {
            return state = state.setIn([action.temp,'wareHouseCardList'], fromJS(action.receivedData))
								.setIn([action.temp,'canUseWarehouse'], fromJS(action.canUseWarehouse))
        },
		[ActionTypes.CHANGE_CANUSE_STOCK_CARD_LIST]                           :() => {
			if(action.cardPageObj){
				state = state.setIn(['commonCardObj','cardPageObj'], fromJS(action.cardPageObj))
			}
            return state = state.setIn([action.temp,'allStockCardList'], fromJS(action.receivedData))
								.setIn([action.temp,'canUseWarehouse'], action.canUseWarehouse)
								.setIn(['commonCardObj','thingsList'], fromJS(action.receivedData))
        },
		[ActionTypes.CHANGE_CANUSE_WAREHOUSE_CARD_LIST]                           :() => {
			const chooseWareHouseCardList = state.getIn(['StockTemp','chooseWareHouseCardList'])
			let index = -1
			chooseWareHouseCardList.map((item,i) => {
				if(item.get('warehouseStatus') === action.warehouseStatus){
					index = i
				}
			})
            return state = state.setIn(['StockTemp','chooseWareHouseCardList',index,'cardUuid'], action.uuid)
								.setIn(['StockTemp','chooseWareHouseCardList',index,'name'], action.name)
        },
		[ActionTypes.CHANGE_ITEM_CHECKBOX_CHECKED]               : () => {
				const showLowerList = state.getIn(['commonCardObj', 'selectList'])
				const selectItemList = state.getIn(['commonCardObj', 'selectItem'])
				const item = action.item
				const uuid = action.isAssembly ? item.productUuid : item.cardUuid ? item.cardUuid : item.uuid
				if (!action.checked && showLowerList.findIndex(v => v === uuid) === -1) {
						// 原来没选
						const materialList = item.materialList ? item.materialList : []
						const newMaterialList = materialList.map(itemM => {
							let basicUnitQuantity = 1
							itemM.unitList && itemM.unitList.map(unitItem => {
								if(unitItem.uuid === itemM.unitUuid){
									basicUnitQuantity = unitItem.basicUnitQuantity ? unitItem.basicUnitQuantity : 1
								}
							})
							return {
								...itemM,
								basicUnitQuantity
							}

						})

						const newShowLowerList = showLowerList.push(uuid)
						const newSelectItemList = selectItemList.push(fromJS({
							...item,
							index: action.index,
							uuid:uuid,
							allUnit:item.unit ? item.unit : '',
							unitUuid:item.unitUuid ? item.unitUuid : item.unit ? item.unit.unitList.length ? '' : item.unit.uuid ? item.unit.uuid : '' : '',
							unitName:item.unitName ? item.unitName : item.unit ? item.unit.unitList.length ? '' : item.unit.name ? item.unit.name : '' : '',
							materialList: newMaterialList,
							oriMaterialList: newMaterialList ? newMaterialList : [],
							quantity: item.quantity ? item.quantity : '',
							afterQuantity: item.afterQuantity ? item.afterQuantity : ''
						}))

						return state.setIn(['commonCardObj', 'selectList'], newShowLowerList)
									.setIn(['commonCardObj', 'selectItem'], fromJS(newSelectItemList))
				} else if(action.checked) {
						// 原来选了
						const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === uuid), 1)
						const newSelectItemList = selectItemList.splice(showLowerList.findIndex(v => v === uuid), 1)

						return state.setIn(['commonCardObj', 'selectList'], newShowLowerList)
									.setIn(['commonCardObj', 'selectItem'], fromJS(newSelectItemList))
				}
				return state

		},

		[ActionTypes.SELECT_EDIT_CBJZ_ITEM_ALL]                 : () => {

			return state.setIn(['CostTransferTemp', 'uuidList'], fromJS(action.uuidList))
						// .setIn(['CostTransferTemp', 'stockCardUuidList'], fromJS(newStockCardUuidList))
						.setIn(['CostTransferTemp', 'selectStockItem'], fromJS(action.selectStockItem))
						.setIn(['views', 'selectList'], fromJS(action.selectList))
						.setIn(['views', 'selectItem'], action.newSelectItem)
        },
		[ActionTypes.GET_COST_CARRYOVER_CANUSE_WAREHOUSE_CARD]                           :() => {
                return state.setIn(['CostTransferTemp', 'stockCardList',action.index,'warehouseCardName'],action.changeWareHouseCard.wareHouseName)
							.setIn(['CostTransferTemp', 'stockCardList',action.index,'warehouseCardUuid'],action.changeWareHouseCard.uuid)
							.setIn(['CostTransferTemp', 'stockCardList',action.index,'uniformUuid'],action.changeWareHouseCard.uniformUuid)


        },
		// [ActionTypes.UPDATE_STOCK_LIST_ITEM]                           :() => {
        //         return state.updateIn([action.temp, 'stockCardList',action.index,action.valueName],action.value)
        // },
		[ActionTypes.CLEAR_BALANCETEMP]                           :() => {
			if(action.oriState === 'STATE_CHYE_CH'){
				const initWareHouseList = [
					{
						canUse: true,
						code: "",
						isUniform: true,
						name: "",
						uniformUuid: "",
						cardUuid: "",
					}
				]

				state = state.setIn(['BalanceTemp', 'wareHouseList'],fromJS(initWareHouseList))
			}else{
				state = state.setIn(['BalanceTemp', 'wareHouseList'],fromJS([]))
			}
                return state.setIn(['BalanceTemp', 'stockCardList'],fromJS([{}]))
							.setIn(['BalanceTemp', 'chooseWareHouseCard'],fromJS({cardUuid:'',name:''}))
							.setIn(['BalanceTemp', 'chooseStockCard'],fromJS({cardUuid:'',name:'',isOpenedQuantity: false,isUniformPrice: false}))


        },
		[ActionTypes.GET_MESSAGE_OF_CATEGORY]                           :() => {
                return state.setIn(['views', 'categoryMessage'],fromJS(action.message))
        },
		[ActionTypes.AFTER_GET_JXSE_STOCK_LIST]						   : () => {
			const uuidList = state.getIn(['TaxTransferTemp','uuidList'])
			state = state.setIn([action.temp,action.ListName], fromJS(action.receivedData.result))
			if(action.temp === 'TaxTransferTemp'){
				let newUuidList = [],newStockCardUuidList = []
				action.receivedData.result.map(item => {
					if(uuidList.indexOf(item.jrJvUuid) > -1){
						newUuidList.push(item.jrJvUuid)
						newStockCardUuidList.push({uuid:item.stockCardUuid,amount:item.amount,onlyId:item.jrJvUuid,quantity: item.quantity,unitCardName:item.unitCardName,number: item.number,quantityAmount:item.quantityAmount})
					}
				})
				state = state.setIn([action.temp, 'uuidList'], fromJS(newUuidList))
							.setIn([action.temp, 'stockCardUuidList'], fromJS(newStockCardUuidList))
			}else{
				state = state.setIn([action.temp, 'uuidList'], fromJS([]))
				.setIn([action.temp, 'stockCardUuidList'], fromJS([]))
			}

			return state
		},
		// 存货导入
		[ActionTypes.AFTER_CALCULATE_INVENTORY_IMPORT]						     : () => {

			state = !action.receivedData.data ?
				state.setIn(['views','iframeload'], true)
				.setIn(['views','showMessageMask'], false)
				.setIn(['views','acmessage'], fromJS(action.receivedData.message)) :
				state.setIn(['views','iframeload'], true)
				.setIn(['views','acmessage'], fromJS(action.receivedData.message))
				.setIn(['views','errorList'], fromJS(action.receivedData.data.errorList))
				.setIn(['views','importKey'], action.receivedData.data.importKey)
				.setIn(['views','importList'], fromJS(action.receivedData.data.importList))
			if(action.stockTemp === 'countStockCardList'){
				if (action.receivedData.data.stockList && action.receivedData.data.stockList.length){
					let stockList = []
					action.receivedData.data.stockList.forEach(v => {
						if(v.financialInfo && v.financialInfo.openSerial && !v.serialList){
							v.quantity = 0
						}
						const quantity = action.temp ==='BalanceTemp' ?  numberCalculate(v.quantity,v.referenceQuantity,4,'subtract',4) : numberCalculate(v.referenceQuantity,v.quantity,4,'subtract',4)
						stockList.push({
							...v,
							afterQuantity: v.quantity,
							quantity,
							price: v.referencePrice,
							amount: numberCalculate(v.referencePrice,quantity,4,'multiply'),
							cardUuid: v.inventoryUuid,
							warehouseCardUuid: v.warehouseUuid,
							warehouseCardName: v.warehouseName,
							warehouseCardCode: v.warehouseCode,
							expirationDate: v.expirationDate ? v.expirationDate : '',
							productionDate: v.productionDate ? v.productionDate : ''
						})
					})
					state = state.setIn([action.temp,action.stockTemp],fromJS(stockList))
				}
			}else if (action.stockTemp === 'assemblySheet') {
				const allStockCardList = state.getIn(['StockBuildUpTemp','allStockCardList'])
				let assemblySheet = []
				action.receivedData.data.importList.forEach(v => {
					let totalAmount = 0
					assemblySheet.push({
						...v,
						productUuid: v.inventoryUuid,
						uuid: v.inventoryUuid,
						curQuantity: v.quantity,
						warehouseCardUuid: v.warehouseUuid,
						warehouseCardName: v.warehouseName,
						warehouseCardCode: v.warehouseCode,
						expirationDate: v.expirationDate ? v.expirationDate : '',
						productionDate: v.productionDate ? v.productionDate : '',
						materialList: v.cardDetailList.map(k=>{
							if(k.financialInfo && k.financialInfo.openSerial && !k.serialList){
								k.quantity = 0
							}
							const curItem = allStockCardList.find(w => w.get('uuid') === k.inventoryUuid) || fromJS([])
							let referencePrice = 0
							const unit = curItem.get('unit')
							const unitList = unit.get('unitList') || fromJS([])
							if(unit){
								if( k.unitUuid === unit.get('uuid') ){
									referencePrice = k.referencePrice
								}else{
									const curUnit = unitList && unitList.find(w => w.get('uuid') === k.unitUuid)
									const basicUnitQuantity = curUnit.get('basicUnitQuantity') || 1
									referencePrice = numberCalculate(k.referencePrice,basicUnitQuantity,4,'multiply',4)
								}
							}
							const positivePrice = referencePrice > 0 ? referencePrice : ''
							totalAmount = numberCalculate(totalAmount,numberCalculate(positivePrice,k.quantity,4,'multiply'))
							return {
								...k,
								quantity: k.quantity,
								price: positivePrice,
								amount: referencePrice > 0 ? numberCalculate(referencePrice,k.quantity,4,'multiply') : '',
								isOpenQuantity: k.isOpenedQuantity,
								materialUuid: k.inventoryUuid,
								cardUuid: k.inventoryUuid,
								warehouseCardUuid: k.warehouseUuid,
								warehouseCardName: k.warehouseName,
								warehouseCardCode: k.warehouseCode,
								expirationDate: k.expirationDate ? k.expirationDate : '',
								productionDate: k.productionDate ? k.productionDate : ''
							}
						}),
						amount: totalAmount,
						price: numberCalculate(totalAmount,v.quantity,4,'divide',4)

					})
				})

				state = state.setIn([action.temp,action.stockTemp],fromJS(assemblySheet))

			}else{
				if (action.receivedData.data.importList && action.receivedData.data.importList.length) {
					state = state.setIn([action.temp,action.stockTemp],fromJS(action.receivedData.data.importList.map(v => {
										if(v.financialInfo && v.financialInfo.openSerial && !v.serialList){
											v.quantity = 0
										}
										v.warehouseCardUuid = v.warehouseCardUuid ? v.warehouseCardUuid : v.warehouseUuid ? v.warehouseUuid : ''
										v.warehouseCardName = v.warehouseCardName ? v.warehouseCardName : v.warehouseName ? v.warehouseName : ''
										v.warehouseCardCode = v.warehouseCardCode ? v.warehouseCardCode : v.warehouseCode ? v.warehouseCode : ''
										v.cardUuid = v.inventoryUuid
										v.uuid = v.inventoryUuid,
										v.expirationDate = v.expirationDate ? v.expirationDate : '',
										v.productionDate = v.productionDate ? v.productionDate : ''
										return v
									})))
									.setIn([action.temp,'carryoverCardList'],fromJS(action.receivedData.data.importList.map(v => {
										if(v.financialInfo && v.financialInfo.openSerial && !v.serialList){
											v.quantity = 0
										}
										v.amount =''
										v.warehouseCardUuid = v.warehouseCardUuid ? v.warehouseCardUuid : v.warehouseUuid ? v.warehouseUuid : ''
										v.warehouseCardName = v.warehouseCardName ? v.warehouseCardName : v.warehouseName ? v.warehouseName : ''
										v.warehouseCardCode = v.warehouseCardCode ? v.warehouseCardCode : v.warehouseCode ? v.warehouseCode : ''
										v.cardUuid = v.inventoryUuid
										v.uuid = v.inventoryUuid
										v.expirationDate = v.expirationDate ? v.expirationDate : '',
										v.productionDate = v.productionDate ? v.productionDate : ''
										return v
									})))
				}
			}

			return state
		},
		// 盘点
		// 盘点确定
		[ActionTypes.SAVE_CALCULATE_COUNT]						     : () => {
			if(action.needStockCardList){
				state = state.setIn([action.temp,'stockCardList'], fromJS(action.stockCardList))
			}
			state = state.setIn([action.temp,'countStockCardList'], fromJS([]))
						.setIn([action.temp,'chooseWareHouseCard'], fromJS(action.chooseWareHouseCard))
						.setIn(['commonCardObj','selectList'], fromJS([]))
						.setIn(['commonCardObj','selectItem'], fromJS([]))
						.setIn(['views','countInsert'], true)
						.setIn(['views','pdfInsertFirst'], true)

			return state
		},
		// 获取不同单价末级仓库列表
		[ActionTypes.GET_BALANCE_UNIFORM_PRICE]                           :() => {
			const data = action.receivedData
			state = state.setIn([action.temp,action.stockCardTemp,action.selectIndex,'price'],data.price)
			let newChildItem =[]
			data.priceList && data.priceList.length && data.priceList.map(item => {
				const quantity = item.quantity
				const amount = item.amount
				const newAmount = numberCalculate(numberCalculate(data.price,quantity,4,'multiply',4),amount,4,'subtract')
				newChildItem.push({
					...item,
					amount: newAmount,
					oldAmount: item.amount
				})
			})
			state = state.setIn([action.temp,action.stockCardTemp,action.selectIndex,'childList'],newChildItem.length ? fromJS(newChildItem) : fromJS([]))
			return state
        },
		// 获取不同单价末级仓库列表
		[ActionTypes.GET_CANUSE_WAREHOUSE_CARD_CHILD_LIST]                           :() => {
			const price = state.getIn([action.temp,action.stockCardTemp,action.selectIndex,'price'])
			let newChildItem =[]
			action.receivedData.map(item => {
				const quantity = item.quantity
				const amount = item.amount
				const newAmount = numberCalculate(numberCalculate(price,quantity,4,'multiply',4),amount,4,'subtract')
				newChildItem.push({
					...item,
					amount: newAmount,
					oldAmount: item.amount
				})
			})

            return state = state.setIn([action.temp,action.stockCardTemp,action.selectIndex,'childList'], fromJS(newChildItem))
								// .setIn([action.temp,'canUseWarehouse'], fromJS(action.canUseWarehouse))
        },
		// 获取统一单价末级仓库列表
		[ActionTypes.GET_CANUSE_WAREHOUSE_CARD_CHILD_LIST_FROM_UNIT]                           :() => {
			const cardList = action.receivedData
			const countStockCardList = state.getIn([action.temp,action.stockCardTemp])
			let cardListUuid = []
			cardList && cardList.length && cardList.map(v => cardListUuid.push(v.inventoryUuid))
			countStockCardList && countStockCardList.size && countStockCardList.map((item,index) => {
				if(cardListUuid.indexOf(item.get('cardUuid')) > -1){
					const selectIndex = cardListUuid.findIndex((v)=> v === item.get('cardUuid'))
					state = state.setIn([action.temp,action.stockCardTemp,index,'childList'], fromJS(cardList[selectIndex].childList))
								.setIn([action.temp,action.stockCardTemp,index,'price'], fromJS(cardList[selectIndex].price))
				}
			})
            return state
        },
		[ActionTypes.SELECT_EDIT_CBJZ_ITEM]	                  : () => {

			state= state.setIn(['views', 'selectList'], action.newShowLowerList)
						.setIn(['views', 'selectItem'], action.newSelectItem)
						.setIn(['CostTransferTemp', 'selectStockItem'], fromJS(action.selectStockItem))
						.setIn(['CostTransferTemp', 'selectStockUuidList'], fromJS(action.selectStockUuidList))

			state = state.setIn(['CostTransferTemp', 'uuidList'], action.uuidList)
			return state
		},

		[ActionTypes.SELECT_EDIT_CBJZ_ITEM_ALL]                 : () => {

			const stockCardList = state.getIn(['CostTransferTemp','stockCardList'])
			const list = state.getIn(['CostTransferTemp','costTransferList'])
			let uuidList = state.getIn(['CostTransferTemp', 'uuidList']).toJS()
			let stockCardUuidList = state.getIn(['CostTransferTemp', 'stockCardUuidList'])
			let stockCardUuidArr = []
			stockCardUuidList.map(v => stockCardUuidArr.push(v.get('onlyId')))

			if (action.selectAll) {
				// 全不选
				let newStockCardList = []
				const selectList = state.getIn(['views', 'selectList']).toJS()
				const selectItem = state.getIn(['views', 'selectItem'])

				stockCardUuidList = stockCardUuidList ? stockCardUuidList.filter(v => {
					if(uuidList.indexOf(v.get('onlyId')) === -1 ){
						return v
					}
				}) : fromJS([])


				const newUuidList = []
				list.map( item => newUuidList.push(item.get('jrJvUuid')))

				const difference = (arr1, arr2) => {
					const set1 = new Set(arr1)
					const set2 = new Set(arr2)
					let subset = []
					for (let item of set1) {
						if (!set2.has(item)) {
							subset.push(item)
						}
					}
					return subset
				}
				const newSelectItem = selectItem.filter(item => uuidList.indexOf(item.get('jrJvUuid')) === -1)
				let selectStockUuidList = [], selectStockItem=[]
				newSelectItem && newSelectItem.size && newSelectItem.map(item => {
					if(selectStockUuidList.indexOf(item.get('stockCardUuid')) > -1){
						const index = selectStockItem.findIndex(v => v.cardUuid === item.get('stockCardUuid'))
						selectStockItem[index]['quantity'] = numberCalculate(selectStockItem[index]['quantity'],item.get('quantity'))

					}else{
						selectStockUuidList.push(item.get('stockCardUuid'))
						selectStockItem.push({
							cardUuid: item.get('stockCardUuid'),
							quantity: item.get('quantity'),
							name: item.get('stockCardName'),
							code: item.get('stockCardCode'),
							amount: item.get('amount')

						})
					}
				})

				return state.setIn(['CostTransferTemp', 'uuidList'], fromJS([]))
							// .setIn(['CostTransferTemp', 'stockCardUuidList'], fromJS(newStockCardUuidList))
							.setIn(['CostTransferTemp', 'selectStockItem'], fromJS(selectStockItem))
							.setIn(['views', 'selectList'], fromJS(difference(selectList,uuidList)))
							.setIn(['views', 'selectItem'], newSelectItem)
			} else {
				// 全选
				let uuidAllList = []
				let newStockCardUuidList = stockCardUuidList.size ? stockCardUuidList.toJS() : []
				list.forEach(v => {
					uuidAllList.push(v.get('jrJvUuid'))
					stockCardUuidArr.indexOf(v.get('onlyId')) === -1 && newStockCardUuidList.push({uuid:v.get('stockCardUuid'),amount:v.get('amount'),onlyId:v.get('jrJvUuid'),quantity: v.get('quantity'),unitCardName:v.get('unitCardName'),number: v.get('number'),quantityAmount:v.get('quantityAmount'),storeNumber: v.get('storeNumber')})
				})

				let selectAllList = state.getIn(['views', 'selectList']).toJS()
				let selectAllItem = state.getIn(['views', 'selectItem']).toJS()
				list && list.size && list.forEach((v, i)=> {
					if(selectAllList.indexOf(v.get('jrJvUuid')) === -1){
						selectAllList.push(v.get('jrJvUuid'))
						// selectAllIndex.push(i)
						selectAllItem.push(v.toJS())
					}
				})
				let selectStockUuidList = [], selectStockItem=[]
				selectAllItem && selectAllItem.length && selectAllItem.map(item => {
					if(selectStockUuidList.indexOf(item.stockCardUuid) > -1){
						const index = selectStockItem.findIndex(v => v.cardUuid === item.stockCardUuid)
						selectStockItem[index]['quantity'] = numberCalculate(selectStockItem[index]['quantity'],item.quantity)

					}else{
						selectStockUuidList.push(item.stockCardUuid)
						selectStockItem.push({
							cardUuid: item.stockCardUuid,
							quantity: item.quantity,
							name: item.stockCardName,
							code: item.stockCardCode,
							amount: item.amount

						})
					}
				})
				return state.setIn(['CostTransferTemp', 'uuidList'], fromJS(uuidAllList))
							.setIn(['CostTransferTemp', 'stockCardUuidList'], fromJS(newStockCardUuidList))
							.setIn(['views', 'selectList'], fromJS(selectAllList))
							.setIn(['views', 'selectItem'], fromJS(selectAllItem))
							.setIn(['CostTransferTemp', 'selectStockItem'], fromJS(selectStockItem))
			}
		},
		// 结转跳转到成本结转
		[ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_JZCB]	                  : () => {
			return state.setIn(['views', 'paymentTypeStr'], '存货核算_存货成本结转')
		},
		// 修改参考单价
		[ActionTypes.CHANGE_STOCKCARD_REFERENCE_PRICE_QUNATITY]	                  : () => {
			const stockCardList = action.stockCardList
			const data = action.receivedData
			const oldData = state.getIn([`${action.temp}Temp`,action.stockTemp]).toJS()
			// let newData = []
			data.map((item,i) =>{
				state = state.setIn([`${action.temp}Temp`,action.stockTemp,i,'referencePrice'],data[i].price)
							.setIn([`${action.temp}Temp`,action.stockTemp,i,'referenceQuantity'],data[i].quantity)
			})

			return state
		},
		[ActionTypes.GET_COST_TRANSFER_PRICE]	                  : () => {
			let stockNameList = []
			const stockCardList =  action.stockCardList
			const stockPriceList =  action.stockPriceList
			const stockTemp =  action.stockTemp
			const uuidName =  action.uuidName
			const oriIndex =  action.oriIndex
			const temp =  action.temp
			const data = action.receivedData

            stockCardList.map((item,index) => {
                const quantity = item.get('quantity')
                const basicUnitQuantity = item.get('basicUnitQuantity')
                data && data.length && data.map((v,i) => {
                    // if(stockPriceList[i].isUniformPrice){
                    //     if (v.price < 0 || numberCalculate(v.amount, v.quantity, 2, 'divide') < 0) {
                    //         stockNameList.push(`${item.get('code')} ${item.get('cardName')}`)
                    //     }
                    // }
                    // if(stockNameList.length > 0){
                    //     stockNameList.map(value => {
                    //         return Modal.error({
                    //             title: `【${value}】的单价异常，请调整单价后再录入`,
                    //             content: '',
                    //             onOk() {},
                    //         })
                    //     })
					//
					//
                    // }
                    if(stockTemp === 'selectStockItem'){
                        if(item.get(uuidName) === v.cardUuid && oriIndex + i === index){
							if(v.price > 0){
								state = state.setIn([`${temp}Temp`,stockTemp,index,'price'],v.price)
											.setIn([`${temp}Temp`,stockTemp,index,'amount'],numberCalculate(v.price,quantity,2,'multiply'))
							}
							state = state.setIn([`${temp}Temp`,stockTemp,index,'referencePrice'],v.price)
										.setIn([`${temp}Temp`,stockTemp,index,'referenceQuantity'],v.quantity)

                        }
                    }else{
                        if(item.get(uuidName) === v.cardUuid && oriIndex + i === index){
                            const finallyPrice = basicUnitQuantity ? numberCalculate(basicUnitQuantity,v.price,4,'multiply',4) : v.price
                            const amount = basicUnitQuantity ? numberCalculate(quantity,finallyPrice,4,'multiply') : numberCalculate(quantity,v.price,4,'multiply')
							state = state.setIn([`${temp}Temp`,stockTemp,index,'referencePrice'],v.price)
										.setIn([`${temp}Temp`,stockTemp,index,'referenceQuantity'],v.quantity)
										.setIn([`${temp}Temp`,stockTemp,index,'price'],v.price > 0 ? finallyPrice : '')
										.setIn([`${temp}Temp`,stockTemp,index,'amount'], v.price > 0 ? amount : '')

                        }
                    }

                })

            })

			return state
		},
		[ActionTypes.CHANGE_BALANCE_ADJUST_PRICE]	                  : () => {
			let stockNameList = []
			const stockOrWarehouseCardList =  action.stockOrWarehouseCardList
			const stockPriceList =  action.stockPriceList
			const canUseWarehouse =  action.canUseWarehouse
			const isCardUuid =  action.isCardUuid
			const listName =  action.listName
			const temp =  action.temp
			const data = action.receivedData
			const numberRound = (number,digits=2) => {return (Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)}
            stockOrWarehouseCardList.map((item,index) => {
                const amount = state.getIn([`${temp}Temp`,listName,index,'amount'])
                const price = state.getIn([`${temp}Temp`,listName,index,'price'])
                const quantity = state.getIn([`${temp}Temp`,listName,index,'quantity'])

                data && data.length && data.map((v,i) => {
                    const resultUuid = listName === 'stockCardList' || isCardUuid ? v.cardUuid : v.storeUuid
                    if(item.get('cardUuid') === resultUuid && index === stockPriceList[i].index){
                        if(stockPriceList[i].isUniformPrice){ //按仓库、按存货统一单价
                            // if (v.price < 0 || numberCalculate(v.amount, v.quantity, 2, 'divide') < 0) {
                            //     stockNameList.push(`${item.get('code')} ${item.get('cardName')}`)
                            // }
							state = state.setIn([`${temp}Temp`,listName,index,'afterAmount'],numberCalculate(amount,v.amount))
										.setIn([`${temp}Temp`,listName,index,'price'],numberRound(v.price,4))
										.setIn([`${temp}Temp`,listName,index,'afterPrice'], numberRound(v.price,4))
                        }else if(canUseWarehouse || !canUseWarehouse){ //开启仓库的按仓库，按存货 或不开启仓库
							state = state.setIn([`${temp}Temp`,listName,index,'afterAmount'],numberCalculate(amount,v.amount))
										.setIn([`${temp}Temp`,listName,index,'afterPrice'], numberCalculate(price,v.price,4,'add',4))
                        }else{
							state = state.setIn([`${temp}Temp`,listName,index,'afterPrice'], numberCalculate(price,v.price,4,'add',4))
                        }
						if(listName !== 'countStockCardList'){
							state = state.setIn([`${temp}Temp`,listName,index,'afterQuantity'], numberCalculate(quantity,v.quantity,4,'add',4))
						}
						state = state.setIn([`${temp}Temp`,listName,index,'beforePrice'],numberRound(v.price,4))
									.setIn([`${temp}Temp`,listName,index,'beforeAmount'],numberRound(v.amount))
									.setIn([`${temp}Temp`,listName,index,'beforeQuantity'],numberRound(v.quantity,4))
									.setIn([`${temp}Temp`,listName,index,'referenceQuantity'], numberRound(v.quantity,4))
                    }
                    // if(stockNameList.length > 0){
                    //     stockNameList.map(value => {
                    //         return Modal.error({
                    //             title: `【${value}】的单价异常，请调整单价后再录入`,
                    //             content: '',
                    //             onOk() {},
                    //         })
                    //     })
                    // }

                })
            })

			return state
		},
		[ActionTypes.JZJZSY_CHANGE_FILTER_MODAL_CHECKED]	                  : () => {
			const showLowerList = state.getIn(['JzjzsyTemp','curSelectProjectUuid'])
			let newShowLowerList = showLowerList
			if(action.isAll){
				action.allList.map((v,index) => {
					if (!action.checked) {
						newShowLowerList = newShowLowerList.indexOf(v.get('cardUuid')) === -1 ? newShowLowerList.push(v.get('cardUuid')) : newShowLowerList
					} else {
						newShowLowerList = newShowLowerList.splice(newShowLowerList.findIndex(k => k === v.get('cardUuid')), 1)
					}
				})
				return state = state.setIn(['JzjzsyTemp','curSelectProjectUuid'], newShowLowerList)
			}else{
				if (!action.checked) {
					newShowLowerList = newShowLowerList.indexOf(action.uuid) === -1 ? showLowerList.push(action.uuid) : showLowerList
				} else {
					newShowLowerList = newShowLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
				}
				return state.setIn(['JzjzsyTemp','curSelectProjectUuid'], newShowLowerList)
			}
		},

	}[action.type] || (() => state))()
}
