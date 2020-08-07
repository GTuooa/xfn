import { fromJS }	from 'immutable'
import { DateLib, decimal } from 'app/utils'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import * as editRunning from 'app/constants/editRunning.js'
//重构新增
import { setDefault, changeStockCard } from './EditFunc/index.js';

//生产环境应当设置为空
const editRunningState = fromJS({
	views: {
		insertOrModify: 'insert',//流水是保存还是新增
		showJrPage: false,//是否跳转到流水列表页面
		idx: 0,//修改存货时的下标 RouterStock 页面用
		ylType: '',//COPY是复制
	},
	categoryTemp: {//类别的详细信息 切换状态时用

	},
	oriTemp: {
        categoryType: 'LB_HOME',//初始流水列别
        oriDate: '',//流水日期
		oriState: '',
		oriAbstract: '',
        categoryName: '请选择类别',//选中类别的name
        categoryUuid: '',
		usedAccounts: false,//是否开启多账户
        accounts: [{"accountUuid": "", "accountName": "", amount: ''}],
        amount: '',
		currentAmount: '',//本次收付款
		jrAmount: '',//获取的单据列表的金额总计
		jrTaxAmount: '',//价税合计总额
		pendingStrongList: [],//获取的单据列表
		usedProject: false,//流水中是否开启项目管理
		beCarryover: false,//流水是否开启结转成本
		usedCurrent: false,//流水中是否开启往来管理
		projectCardList: [{amount: ''}],
		currentCardList: [],//往来单位
		stockCardList: [{amount: ''}],//存货
		carryoverCardList: [{amount: ''}],//结转成本
		payment:{//薪酬支出的金额
			"actualAmount": "",
			"companyAccumulationAmount": "",
			"personAccumulationAmount": "",
			"companySocialSecurityAmount": "",
			"personSocialSecurityAmount": "",
			"incomeTaxAmount": ""
		},
		assets:{//结转损益金额
			originalAssetsAmount: '',
			depreciationAmount: '',
			cleaningAmount: ''
		},
		billList: [{//发票
			"billType": "bill_other",
			"billState": "",
			"taxRate": '',
			"tax": ''
		}],
		accumulationAmount: '',//个人公积金未处理金额
		socialSecurityAmount: '',//个人社保未处理金额
		preAmount: '',//预收款
		payableAmount: '',//应收款
		offsetAmount: '',//抵扣金额
		moedAmount: '',//抹零金额
		pendingManageDto: {//收付管理使用
			categoryUuid: [],
			categoryName: '不限制流水类别',
			isManualWriteOff: false,//false 自动核销 true 手动核销
		},
		deductedAmount: '',
		reduceAmount: '',
		beReduceTax: false,
		relationCategoryUuid: '',
		relationCategoryName: '请选择处理类别',
		usedStock: false,//服务加货物是否开启存货
		warehouseCardList: [//存货调拨仓库
			{cardUuid:'', code: '', name: '', warehouseStatus: 'WAREHOUSE_STATUS_FROM'},
			{cardUuid:'', code: '', name: '', warehouseStatus: 'WAREHOUSE_STATUS_TO'},
		],
		needUsedPoundage: false,
		poundageCurrent: false,//账户手续费项目
		poundageProject: false,
		includesPoundage: false,//金额包含了手续费
		poundageCurrentCardList: [],
		poundageProjectCardList: [],
		stockCardOtherList: [{amount: ''}],//存货组装成品卡片
		usedCarryoverProject: false,//营业支出结转的处理类别的项目
		carryoverProjectCardList: [],//营业支出结转的处理类别的项目
		beMoed: false,//收付管理是否开启抹零
		relationObj: {//处理类别的一些信息
			propertyCostList: [],
		},
		inputTax: true,
		taxTotal: '',//开具发票手动输入的价税合计
		shareType: '0',//0表示分摊支出；1表示分摊收入

    },
	projectList: [],//项目列表
	currentList: [],//往来卡片列表
	stockList: [],//存货卡片列表
	warehouseList: [],//仓库列表
	categoryList: [{uuid: '', childList: []}],//处理类别列表
	warehouseListTydj: [],//同一单价专用
	carryoverProject: [],//营业支出结转的处理类别的项目列表
	//手续费
	poundageCurrentList: [],
	poundageProjectList: [],
	poundageCurrentRange: [],
	poundageProjectRange: [],

	// 附件
    enclosureList: [],
	label: [],

    commonCardList: [],
	stockCategoryList: [],
    currentCategoryList: [],//往来类别树
	commonCurrentList: [],
	projectCategoryList: [],//项目类别树
	commonProjectList: [],

	cardAllList: {
		assemblyList: [],//存货组装单全部列表
		commonAssemblyList: [],//存货组装单列表
		warehouseList: [],//结转成本筛选单据列表时的仓库列表
		stockCardList: [],//结转成本筛选单据列表时的卡片列表
		warehouseCardList: [],//结转成本筛选单据列表时的选中的仓库列表
		projectShareType: [],//项目分摊oriState的列表
		batchList: [],//存货卡片批次列表
		serialList: []//所有的序列号列表
	}

});

export default function handleEditRunning(state = editRunningState, action) {
	return ({
		[ActionTypes.RUNNING_INIT_FJ_LIST]						: () => {
            return state.set('enclosureList', fromJS([]))
        },
		[ActionTypes.RUNNING_GET_LS_LABEL_FETCH]				: () => { //获取附件的标签
            let label = []
            action.receivedData.data.map((item) => {
                label.push({
                    label: item,
                    value: item
                })
            })
            state = state.set('label',fromJS(label))
						.set('tagModal',true)
            return state;
        },
		[ActionTypes.RUNNING_ACCOUNT_SAVE_AND_NEW]              : () => {
            return state.set('oriTemp', editRunningState.get('oriTemp'))
						.set('views', editRunningState.get('views'))
                        .setIn(['oriTemp', 'oriDate'], action.date)
        },
		[ActionTypes.RUNNING_CHANGE_LRLS_DATA]					: () => {
			if (action.set) {
				return state.set(action.dataType, action.value)
			}
            return state.setIn(action.dataType, action.value)
        },
		[ActionTypes.RUNNING_GET_HOMEACCOUNT_CARD_DETAIL]       : () => {
			let dataTemp = fromJS(action.receivedData)//新类别状态
			state = state.setIn(['views' ,'ylType'], '')

			if (action.isModify) {//特殊情况下修改流水类别
				const oriTemp = state.get('oriTemp')//原先的状态
				let billList = state.getIn(['oriTemp', 'billList'])
				if (billList && billList.size == 0) {
					billList = fromJS([{
						"billType": "bill_other",
						"billState": "",
						"taxRate": '',
						"tax": ''
					}])
				}

				let accounts = state.getIn(['oriTemp', 'accounts'])
				if (accounts && accounts.size == 0) {
					accounts = fromJS([{
						"accountUuid": "",
						"accountName": ""
					}])
				}
				let amount = state.getIn(['oriTemp', 'amount'])
				if (dataTemp.getIn(['category', 'categoryType'])!='LB_FYZC') {
					amount = Math.abs(amount)
				}

				const array_includes = (arr1, arr2)  =>  {//范围是否包含
					let temp = new Set([...arr1, ...arr2])
					return arr1.length === temp.size
				}

				let currentCardList = fromJS([])
				const categoryType = dataTemp.get('categoryType')
				const oriCategoryType = oriTemp.get('categoryType')
				let contactsManagement = dataTemp.getIn([editRunning.categoryTypeObj[categoryType], 'contactsManagement'])//新类别是否开启往来管理
				const usedCurrent = oriTemp.get('usedCurrent')
				if (contactsManagement && usedCurrent) {//新类别开启 当前状态也开启
					const contactsRange = dataTemp.getIn([editRunning.categoryTypeObj[categoryType], 'contactsRange']).toJS()//新往来单位范围
					const oriContactsRange = oriTemp.getIn([editRunning.categoryTypeObj[oriCategoryType], 'contactsRange']).toJS()//当前往来单位范围
					if (array_includes(contactsRange, oriContactsRange)) {
						currentCardList = oriTemp.get('currentCardList')
					}
				}

				let projectCardList = fromJS([{amount: ''}])
				let beProject = dataTemp.get('beProject')//新类别是否开启项目管理
				const usedProject = oriTemp.get('usedProject')
				if (beProject && usedProject) {//新类别开启 当前状态也开启
					const projectRange = dataTemp.get('projectRange').toJS()//新项目范围
					const oriProjectRange = oriTemp.get('projectRange').toJS()//当前项目范围
					if (array_includes(projectRange, oriProjectRange)) {
						projectCardList = oriTemp.get('projectCardList')
					}
				}

				state = state.set('categoryTemp', dataTemp)
				            .setIn(['views' ,'insertOrModify'], 'modify')
							.mergeIn(['oriTemp'], dataTemp)
							.mergeIn(['oriTemp'], fromJS({
								amount,
								billList,
								accounts,
								projectCardList,
								currentCardList,
								usedCurrent: false,
								oriUsedProject: false,
								oriUsedCurrent: false,
								categoryUuid: dataTemp.get('uuid'),
								categoryName: dataTemp.get('name'),
								stockCardList: [{amount: ''}],
							}))
							
				return setDefault(state, action.isOpenedWarehouse)

			} else {//新增
				state = state.set('categoryTemp', dataTemp)
							.set('oriTemp', dataTemp)
							.mergeIn(['oriTemp'], editRunningState.get('oriTemp'))
							.setIn(['oriTemp' ,'categoryUuid'], dataTemp.get('uuid'))
							.setIn(['oriTemp' ,'categoryName'], dataTemp.get('name'))
							.setIn(['oriTemp' ,'categoryType'], dataTemp.get('categoryType'))
							.setIn(['oriTemp' ,'oriDate'], state.getIn(['oriTemp', 'oriDate']))
							.setIn(['views' ,'insertOrModify'], 'insert')
							.set('cardAllList', editRunningState.get('cardAllList'))

				return setDefault(state, action.isOpenedWarehouse)
			}

        },
		[ActionTypes.RUNNING_CLEAR_CARDTEMP]       				: () => {
			const oriDate = state.getIn(['oriTemp', 'oriDate'])
			const categoryUuid = state.getIn(['oriTemp', 'categoryUuid'])
			const categoryName = state.getIn(['oriTemp', 'categoryName'])
			const categoryType = state.getIn(['oriTemp', 'categoryType'])
			const handleType = state.getIn(['oriTemp', 'handleType'])//oriState切换时处理类型不能清空
			let propertyCost = state.getIn(['oriTemp', 'propertyCost'])
			const propertyCostList = state.getIn(['oriTemp', 'propertyCostList'])
			if (propertyCost && ['XZ_SCCB', 'XZ_FZSCCB', 'XZ_ZZFY', 'XZ_HTCB', 'XZ_JJFY', 'XZ_JXZY'].includes(propertyCost) && propertyCostList && propertyCostList.size) {
				propertyCost = ''
				if (propertyCostList.size==1) {
					propertyCostList.get(0)
				}
			}
			if (categoryType=='LB_XMJZ') { return state }

			const isModify = state.getIn(['views', 'insertOrModify']) == 'modify'
			let stockCardList = fromJS([{amount: ''}])
			let amount = ''
			if (['LB_YYSR', 'LB_YYZC'].includes(categoryType) && isModify) {
				stockCardList = state.getIn(['oriTemp', 'stockCardList'])
				amount = state.getIn(['oriTemp', 'amount'])	
			}

            return  state.set('oriTemp', state.get('categoryTemp'))
						.mergeIn(['oriTemp'], editRunningState.get('oriTemp'))
						.mergeIn(['oriTemp'], fromJS({
							categoryUuid,
							categoryName, 
							categoryType,
							oriDate,
							handleType,
							propertyCost,
							stockCardList,
							amount,
						}))
        },
		[ActionTypes.RUNNING_CHANGE_LRLS_ACCOUNT]				: () => {
            const arr = action.value.value.split(Limit.TREE_JOIN_STR)
			const poundage = {
				needPoundage: action.value.needPoundage,
				poundage: action.value.poundage,
				poundageRate: action.value.poundageRate
			}
			if (action.accountStatus == 'ACCOUNT_STATUS_TO') {//内部转账的处理
				state = state.setIn(['oriTemp', 'accounts', 1, 'accountStatus'], 'ACCOUNT_STATUS_TO')
							.setIn(['oriTemp', 'accounts', 1, 'accountName'], arr[1])
							.setIn(['oriTemp', 'accounts', 1, 'accountUuid'], arr[0])
							.setIn(['oriTemp', 'accounts', 1, 'poundage'], fromJS(poundage))
			} else {
				state = state.setIn(['oriTemp', 'accounts', 0, 'accountName'], arr[1])
							.setIn(['oriTemp', 'accounts', 0, 'accountUuid'], arr[0])
							.setIn(['oriTemp', 'accounts', 0, 'poundage'], fromJS(poundage))

				if (action.accountStatus=='ACCOUNT_STATUS_FROM') {
					state = state.setIn(['oriTemp', 'accounts', 0, 'accountStatus'], 'ACCOUNT_STATUS_FROM')
				}
			}
            return state
        },
		[ActionTypes.RUNNING_GET_JRLIST]                      	: () => {
            return state.setIn(['oriTemp', 'pendingStrongList'], fromJS(action.receivedData))
                        .setIn(['oriTemp', 'jrAmount'], 0)
        },
		[ActionTypes.RUNNING_PENDINGSTRONGLIST_BESELECT]                   : () => {
            return state.setIn(['oriTemp', 'pendingStrongList', action.idx, 'beSelect'], action.value)
        },
		[ActionTypes.RUNNING_CHANGE_PROJECT_CARD]					       : () => {
            switch (action.dataType) {
                case 'card' : {
                    const arr = action.value['value'].split(Limit.TREE_JOIN_STR)
                    const amount = state.getIn(['oriTemp', 'projectCardList', action.idx, 'amount'])
                    state = state.setIn(['oriTemp', 'projectCardList', action.idx], fromJS({
						cardUuid: arr[0],
						code: arr[1],
						name: arr[2],
						projectProperty: action.value['projectProperty'],
						amount
					}))
                    break
                }
                case 'amount' : {
                    state = state.setIn(['oriTemp', 'projectCardList', action.idx, 'amount'], action.value)
                    break
                }
                case 'add' : {
                    state = state.setIn(['oriTemp', 'projectCardList', action.idx], fromJS({amount: ''}))
                    break
                }
                case 'delete' : {
                    state = state.deleteIn(['oriTemp', 'projectCardList', action.idx])
                    break
                }
				case 'poundageProject' : {
                    const arr = action.value.split(Limit.TREE_JOIN_STR)
                    state = state.setIn(['oriTemp', 'poundageProjectCardList', action.idx], fromJS({
						cardUuid: arr[0],
						code: arr[1],
						name: arr[2],
					}))
                    break
                }
				case 'carryoverProjectCardList': {
					const arr = action.value.split(Limit.TREE_JOIN_STR)
                    state = state.setIn(['oriTemp', 'carryoverProjectCardList', action.idx], fromJS({
						cardUuid: arr[0],
						code: arr[1],
						name: arr[2],
					}))
                    break
				}
            }
            return state

        },
		[ActionTypes.RUNNING_GET_PROJECT_CARDLIST]					       : () => {
            let cardList = [], commonCard, idx = null
            action.receivedData.forEach((v, i) => {
				v['key'] = `${v['code']} ${v['name']}`,
				v['oriName'] = v['name'],
				v['value'] = `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                cardList.push(v)
                if (v['name']=='项目公共费用') {
					v['key'] = v['name']
                    commonCard = v
                    idx = i
                }
				if (['COMNCRD','ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(v['code'])) {
					v['key'] = v['name']
				}
            })

            if (idx != null) {
                cardList.unshift(commonCard)
                cardList.splice(idx+1, 1)
            }

            return state.set(action.cardType, fromJS(cardList))

        },
		[ActionTypes.RUNNING_ORIRUNNING]                           		   : () => {
			
			//待完善 附件等
			const receivedData = fromJS(action.receivedData)
			state = state.setIn(['views', 'insertOrModify'], 'modify')
						.setIn(['views', 'showJrPage'], false)
						.set('oriTemp', editRunningState.get('oriTemp'))
						.mergeIn(['oriTemp'], fromJS(action.receivedData.jrOri))
						.mergeIn(['oriTemp'], fromJS(action.receivedData.category))
						.set('enclosureList', fromJS(action.receivedData.jrOri.enclosureList))
						.setIn(['views', 'ylType'], action.ylType)

			if (action.ylType=='COPY') {//复制流水
				state = state.setIn(['views', 'ylType'], 'COPY')
				.setIn(['oriTemp', 'oriDate'], new DateLib().valueOf())
				.setIn(['views', 'insertOrModify'], 'insert')
				.set('categoryTemp', receivedData.get('category'))

				if (state.getIn(['oriTemp', 'oriState'])=='STATE_XC_DJ') {
					state = state.setIn(['oriTemp', 'oriState'], 'STATE_XC_JN')
				}

				if (state.getIn(['oriTemp', 'oriState'])=='STATE_XC_JN') {
					if (state.getIn(['oriTemp', 'propertyPay'])=='SX_SHBX') {
						state = state.setIn(['oriTemp', 'payment', 'companySocialSecurityAmount'], receivedData.getIn(['jrOri','amount']))
						.setIn(['oriTemp', 'payment', 'personSocialSecurityAmount'], 0)
						.setIn(['oriTemp', 'payment', 'actualAmount'], receivedData.getIn(['jrOri','amount']))
					}
					if (state.getIn(['oriTemp', 'propertyPay'])=='SX_ZFGJJ') {
						state = state.setIn(['oriTemp', 'payment', 'companyAccumulationAmount'], receivedData.getIn(['jrOri','amount']))
						.setIn(['oriTemp', 'payment', 'personAccumulationAmount'], 0)
						.setIn(['oriTemp', 'payment', 'actualAmount'], receivedData.getIn(['jrOri','amount']))
					}
				}
				if (state.getIn(['oriTemp', 'propertyPay'])=='SX_GZXJ') {
					if (state.getIn(['oriTemp', 'oriState'])=='STATE_XC_FF') {
						state = state.setIn(['oriTemp', 'payment', 'actualAmount'], receivedData.getIn(['jrOri','amount']))
					}
				}


			}

			const billList = state.getIn(['oriTemp', 'billList'])
			const oriBillType = billList && billList.size ? billList.getIn([0, 'billType']) : ''

            let jrAmount = 0
			let pendingStrongList = receivedData.getIn(['jrOri', 'pendingStrongList'])
			if (pendingStrongList.size) {
				pendingStrongList = pendingStrongList.update(item => item.map(v => {
					let notHandleAmount = Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
					jrAmount += notHandleAmount
					return v.set('notHandleAmount', notHandleAmount)
				}))
			}

			let categoryType = state.getIn(['oriTemp', 'categoryType'])
			//项目
			if (!['LB_GGFYFT', 'LB_CHTRXM'].includes(categoryType) && !receivedData.getIn(['jrOri', 'usedProject'])) {//流水没开启项目
				state = state.setIn(['oriTemp', 'projectCardList'], fromJS([{amount: ''}]))
			}
			if (receivedData.getIn(['jrOri', 'usedProject'])) {//原流水开启项目 && action.ylType=='MODIFY'
				state = state.setIn(['oriTemp', 'oriUsedProject'], true)
			}
			if (receivedData.getIn(['jrOri', 'usedCurrent'])) {//原流水开启往来 && action.ylType=='MODIFY'
				state = state.setIn(['oriTemp', 'oriUsedCurrent'], true)
			}

			//是否是全收全付
			const isFullPayment = Math.abs(receivedData.getIn(['jrOri', 'amount'])) == Math.abs(receivedData.getIn(['jrOri', 'currentAmount'])) ? true : false

			//类别的处理
			const oriState = state.getIn(['oriTemp', 'oriState'])
			;({
				'STATE_CQZC_JZSY':  () => {
					categoryType = 'LB_JZSY'
					//两个调换位置
					let categoryUuid = state.getIn(['oriTemp', 'relationCategoryUuid'])
					let relationCategoryUuid = state.getIn(['oriTemp', 'categoryUuid'])
					state = state.setIn(['oriTemp', 'categoryUuid'], categoryUuid)
					state = state.setIn(['oriTemp', 'relationCategoryUuid'], relationCategoryUuid)
				},
				'STATE_CQZC_ZJTX':  () => {
					categoryType = 'LB_ZJTX'
					//两个调换位置
					let categoryUuid = state.getIn(['oriTemp', 'relationCategoryUuid'])
					let relationCategoryUuid = state.getIn(['oriTemp', 'categoryUuid'])
					state = state.setIn(['oriTemp', 'categoryUuid'], categoryUuid)
					state = state.setIn(['oriTemp', 'relationCategoryUuid'], relationCategoryUuid)
				},
				'STATE_ZCWJZZS': () => {
					state = state.setIn(['oriTemp', 'handleMonth'], pendingStrongList.getIn([0, 'oriDate']).substr(0, 7))
				}
			}[oriState] || (()=> null))()

			//收付管理
			if (categoryType=='LB_SFGL') {
				jrAmount = 0
				let allMoedAmount = 0
				pendingStrongList = receivedData.getIn(['jrOri', 'pendingManageDto', 'pendingManageList']).update(item => item.map(v => {
					if (v.get('direction')=='debit') {
						jrAmount += Number(v.get('amount'))
					} else {
						jrAmount -= Number(v.get('amount'))
					}
					if (oriState=='STATE_SFGL_ML') {
						v = v.set('moedAmount', v.get('handleAmount')).set('handleAmount', '')
						if (v.get('direction')=='debit') {//借方发生金额
							allMoedAmount += Number(v.get('moedAmount'))
						} else {//贷方发生金额
							allMoedAmount -= Number(v.get('moedAmount'))
						}
					}
					return v.set('beSelect', true)
				}))
				if (oriState=='STATE_SFGL_ML') {
					state = state.setIn(['oriTemp', 'moedAmount'], decimal(allMoedAmount))
				}

			}
			if (categoryType=='LB_JZCB') {
				jrAmount = 0
				pendingStrongList = receivedData.getIn(['jrOri', 'stockWeakList']).update(item => item.map(v => {
					jrAmount += Math.abs(Number(v.get('amount')))
					return v.set('beSelect', true)
				}))

				let stockList = [], cardUuidList = []
				receivedData.getIn(['jrOri', 'stockCardList']).map(v => {
					let item = v.toJS()
					item['key']=`${item['code']} ${item['name']}`
					item['value']=item['cardUuid']
					item['oriName']=item['name']
					if (cardUuidList.includes(item['cardUuid'])) {
						return
					}
					cardUuidList.push(item['cardUuid'])
					stockList.push(item)
				})

				let usedProject = false, beProject = false
				if (oriState=='STATE_YYSR_ZJ') {
					usedProject = state.getIn(['oriTemp', 'usedProject'])
					beProject = receivedData.getIn(['jrOri', 'beProject'])
					state = state.setIn(['oriTemp', 'projectRange'], fromJS(action.receivedData.jrOri.projectRange))
					.setIn(['oriTemp', 'relationCategoryType'], fromJS(action.receivedData.jrOri.relationCategoryType))
				}

				state = state.set('stockList', fromJS(stockList))
							.setIn(['oriTemp', 'beProject'], beProject)
							.setIn(['oriTemp', 'usedProject'], usedProject)
							.setIn(['oriTemp', 'propertyCostList'], fromJS(action.receivedData.jrOri.propertyCostList))
			}
			if (categoryType=='LB_GGFYFT') {
				jrAmount = 0
				pendingStrongList = receivedData.getIn(['jrOri', 'pendingProjectShareList']).update(item => item.map(v => {
					jrAmount += Number(v.get('amount'))
					return v.set('beSelect', true).set('notHandleAmount', v.get('amount'))
				}))
				//会把项目带来 此时不需要
				state = state.setIn(['oriTemp', 'usedProject'], false)
			}
			if (['LB_KJFP', 'LB_FPRZ'].includes(categoryType)) {
				let jrTaxAmount = 0
				pendingStrongList.forEach(v => {
					jrTaxAmount =+ Math.abs(v.get('oriAmount'))
				})
				let amount =  state.getIn(['oriTemp', 'amount'])
				state = state.setIn(['oriTemp', 'jrTaxAmount'], jrTaxAmount)
							.setIn(['oriTemp', 'amount'], Math.abs(amount))

			}
			if (categoryType=='LB_CHDB') {//存货调拨
				let warehouseCardList=[]
				receivedData.getIn(['jrOri', 'warehouseCardList']).map(v => {
					if (v.get('warehouseStatus')=='WAREHOUSE_STATUS_FROM') {
						warehouseCardList[0]=v
					}
					if (v.get('warehouseStatus')=='WAREHOUSE_STATUS_TO') {
						warehouseCardList[1]=v
					}
				})
				state = state.setIn(['oriTemp', 'warehouseCardList'], fromJS(warehouseCardList))
			}
			if (categoryType=='LB_CHYE') {
				const jrState = state.getIn(['oriTemp', 'jrState'])
				let oriState = jrState ? jrState : 'STATE_CHYE'
				state = state.setIn(['oriTemp', 'oriState'], oriState)
			}
			if (['STATE_JXSEZC_FS', 'STATE_JXSEZC_TFS'].includes(oriState)) {
				categoryType = 'LB_JXSEZC'
				let stockRange = [], propertyCostList = receivedData.getIn(['category', 'propertyCostList'])
				if (receivedData.getIn(['category', 'relationCategoryType'])=='LB_YYZC') {
					stockRange = receivedData.getIn(['category', 'acBusinessExpense', 'stockRange'])
					if (receivedData.getIn(['category', 'propertyCarryover'])=='SX_HW') {
						state = state.setIn(['oriTemp', 'beProject'], false)
					}
				}
				if (receivedData.getIn(['category', 'relationCategoryType'])=='LB_CQZC') {
					state = state.setIn(['oriTemp', 'beProject'], false)
					propertyCostList = fromJS([])
				}
				state = state.setIn(['oriTemp', 'stockRange'], stockRange)
				.setIn(['oriTemp', 'propertyCostList'], propertyCostList)
			}
			if (categoryType=='LB_XCZC' && oriState=='STATE_XC_DK') {
				const personAccumulationAmount = state.getIn(['oriTemp', 'payment', 'personAccumulationAmount'])
				const personSocialSecurityAmount = state.getIn(['oriTemp', 'payment', 'personSocialSecurityAmount'])
				const incomeTaxAmount = state.getIn(['oriTemp', 'payment', 'incomeTaxAmount'])

				if (personAccumulationAmount) {
					state = state.setIn(['oriTemp', 'acPayment', 'beWithholding'], true)
				}
				if (personSocialSecurityAmount) {
					state = state.setIn(['oriTemp', 'acPayment', 'beWithholdSocial'], true)
				}
				if (incomeTaxAmount) {
					state = state.setIn(['oriTemp', 'acPayment', 'beWithholdTax'], true)
				}
			}
			if (categoryType=='LB_CHTRXM') {
				state = state.setIn(['oriTemp', 'usedProject'], true)
				.setIn(['oriTemp', 'beProject'], true)
				.setIn(['oriTemp', 'oriState'], 'STATE_CHTRXM')
			}
			if (categoryType=='LB_XMJZ' && oriState=='STATE_XMJZ_XMJQ') {
				const allHappenAmount = receivedData.getIn(['jrOri', 'allHappenAmount'])
				const allStoreAmount = receivedData.getIn(['jrOri', 'allStoreAmount'])
				jrAmount = decimal(allHappenAmount-allStoreAmount)
			}


            return state.setIn(['oriTemp', 'pendingStrongList'], pendingStrongList)
                        .setIn(['oriTemp', 'jrAmount'], jrAmount)
						.setIn(['oriTemp', 'isFullPayment'], isFullPayment)
						.setIn(['oriTemp', 'categoryType'], categoryType)
						.setIn(['oriTemp', 'oriBillType'], oriBillType)
        },
		[ActionTypes.RUNNING_HANDLETYPE]                  		: () => {
            let oriState = ''
            ;({
                'JR_HANDLE_QDJK' : () => {
                    oriState = 'STATE_JK_YS'
                },
                'JR_HANDLE_CHLX' : () => {
                    oriState = 'STATE_JK_ZFLX'
                },
                'JR_HANDLE_CHBJ' : () => {
                    oriState = 'STATE_JK_YF'
                },
				'JR_HANDLE_DWTZ' : () => {
                    oriState = 'STATE_TZ_YF'
                },
                'JR_HANDLE_QDSY' : () => {
					const propertyInvest = state.getIn(['oriTemp', 'propertyInvest'])
					if (propertyInvest == 'SX_ZQ' ) {//债券
                        oriState = 'STATE_TZ_SRLX'
                    } else {//股权
                        oriState = 'STATE_TZ_SRGL'
                    }
                },
                'JR_HANDLE_SHTZ' : () => {
                    oriState = 'STATE_TZ_YS'
                },
				'JR_HANDLE_ZZ' : () => {
                    oriState = 'STATE_ZB_ZZ'
                },
                'JR_HANDLE_LRFP' : () => {
                    oriState = 'STATE_ZB_ZFLR'
                },
                'JR_HANDLE_JZ' : () => {
                    oriState = 'STATE_ZB_JZ'
				},
				'JR_HANDLE_ZBYJ' : () => {
                    oriState = 'STATE_ZB_ZBYJ'
                },
				'JR_HANDLE_GJ' : () => {
                    oriState = 'STATE_CQZC_YF'
                },
				'JR_HANDLE_CZ' : () => {
                    oriState = 'STATE_CQZC_YS'
                }
            }[action.value])()

            return state.setIn(['oriTemp', 'handleType'], action.value)
                        .setIn(['oriTemp', 'oriState'], oriState)
        },
		[ActionTypes.RUNNING_LRLS_AMOUNT]						: () => {
			const taxRate = state.getIn(['oriTemp', 'billList', 0, 'taxRate'])
            const amount = action.value
			let tax = ''
			if (taxRate == -1) {//自定义税额
				tax = amount
			} else if (taxRate == 100) {
				tax = amount / 2
			} else {
				tax = amount - amount / (1 + taxRate / 100)
			}
            return state.setIn(['oriTemp', 'amount'], amount)
                        .setIn(['oriTemp', 'billList', 0, 'tax'], decimal(tax))
        },
		[ActionTypes.RUNNING_TAXRATE]							: () => {
            const amount = state.getIn(['oriTemp', 'amount'])
            const taxRate = action.value
            let tax = ''
			if (taxRate == -1) {//自定义税额
				tax = ''
			} else if (taxRate == 100) {
				tax = amount / 2
			} else {
				tax = amount - amount / (1 + taxRate / 100)
			}
            return state.setIn(['oriTemp', 'billList', 0, 'taxRate'], taxRate)
                        .setIn(['oriTemp', 'billList', 0, 'tax'], tax ? decimal(tax) : '')
        },
		[ActionTypes.RUNNING_GET_CARDLIST]					    : () => {
            let cardList = []
            action.data.forEach(v => {
				let value = `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
				if (['carryoverStockRange', 'commonCardJzcbList'].includes(action.cardType)) {
					value = `${v['cardUuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
				}
				//保存所有的卡片信息
				v['key'] = `${v['code']} ${v['name']}`
				v['value'] = value
				v['oriName'] = v['name']
                cardList.push(v)
            })

            if (action.cardType === 'contactsRange') {
				state = state.set('currentList', fromJS(cardList))
            }
			if (['stockRange', 'carryoverStockRange'].includes(action.cardType)) {
				state = state.set('stockList', fromJS(cardList))
            }
			if (action.cardType == 'poundageCurrent') {
				state = state.set('poundageCurrentList', fromJS(cardList))
            }
			if (['commonCardList', 'commonCardJzcbList'].includes(action.cardType)) {
				state = state.set('commonCardList', fromJS(cardList))
            }
			if (action.cardType == 'commonCurrentList') {
				state = state.set('commonCurrentList', fromJS(cardList))
			}

            return state
        },

		[ActionTypes.RUNNING_CHANGE_CURRENT_CARDLIST]					 : () => {
            const arr = action.value.split(Limit.TREE_JOIN_STR)
            let item = {}
            item.cardUuid = arr[0]
            item.code = arr[1]
            item.name = arr[2]
			if (action.cardType=='poundageCurrent') {
				return state.setIn(['oriTemp','poundageCurrentCardList', 0], fromJS(item))
			}

            return state.setIn(['oriTemp','currentCardList', 0], fromJS(item))
        },
		[ActionTypes.RUNNING_AUTO_CQZC_CZAMOUNT]					     : () => {
            const originalAssetsAmount = state.getIn(['oriTemp', 'assets', 'originalAssetsAmount'])// 资产原值
            const depreciationAmount = state.getIn(['oriTemp', 'assets', 'depreciationAmount'])// 折旧累计
            const amount = state.getIn(['oriTemp', 'amount'])
            const tax = state.getIn(['oriTemp', 'billList', 0, 'tax'])
            const billType = state.getIn(['oriTemp', 'billList', 0, 'billType'])

            let totalAmount = 0
            if (billType === 'bill_common') {
                totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount) - Number(tax)
            } else {
                totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)
            }

            return state.setIn(['oriTemp', 'assets', 'cleaningAmount'], totalAmount)
        },
		[ActionTypes.RUNNING_CHANGE_YYSR_STOCKCARD]					     : () => {
			return changeStockCard(state, action)
        },
		[ActionTypes.RUNNING_XCZC_CALCULATE_AMOUNT]				         : () => {
            const companyAccumulationAmount = state.getIn(['oriTemp', 'payment','companyAccumulationAmount'])// 公积金(公司部分)
            const personAccumulationAmount = state.getIn(['oriTemp', 'payment','personAccumulationAmount'])// 公积金(个人部分)
            const companySocialSecurityAmount = state.getIn(['oriTemp', 'payment','companySocialSecurityAmount'])//社保(公司部分)
            const personSocialSecurityAmount = state.getIn(['oriTemp', 'payment','personSocialSecurityAmount']) // 社保(个人部分)
            const incomeTaxAmount = state.getIn(['oriTemp', 'payment','incomeTaxAmount']) // 个人所得税
			const jrAmount = state.getIn(['oriTemp', 'jrAmount']) // 列表合计金额
			let actualAmount = state.getIn(['oriTemp', 'payment', 'actualAmount'])

            switch (action.propertyPay) {
                case 'SX_GZXJ': {
					const isModify = state.getIn(['views', 'insertOrModify']) === 'modify' ? true : false
					if (isModify) {
						return state
					}
					const amount = decimal(Number(actualAmount) + Number(personAccumulationAmount) + Number(personSocialSecurityAmount) + Number(incomeTaxAmount))
					state = state.setIn(['oriTemp','amount'], amount)
                    break
				}
                case 'SX_ZFGJJ': {
					if (jrAmount < 0) {
						actualAmount = decimal(-Math.abs(Number(personAccumulationAmount)) + Number(companyAccumulationAmount))
					} else {
						actualAmount = decimal(Number(personAccumulationAmount) + Number(companyAccumulationAmount))
					}
					state = state.setIn(['oriTemp','payment','actualAmount'], actualAmount)
                    break
				}
                case 'SX_SHBX': {
					if (jrAmount < 0) {
						actualAmount = decimal(-Math.abs(Number(companySocialSecurityAmount)) + Number(personSocialSecurityAmount))
					} else {
						actualAmount = decimal(Number(companySocialSecurityAmount) + Number(personSocialSecurityAmount))
					}
					state = state.setIn(['oriTemp','payment','actualAmount'], actualAmount)
                    break
				}
                default:
                    actualAmount = 0
            }
            return state
        },
		[ActionTypes.RUNNING_GET_CQZC_CATEGORY]					         : () => {
            return state.set('categoryList', fromJS(action.receivedData))
						.setIn(['oriTemp', 'uuid'], '')
						.setIn(['oriTemp', 'name'], '请选择处理类别')
        },
		[ActionTypes.RUNNING_AUTO_JZSY_AMOUNT]							 : () => {
			const assets = state.getIn(['oriTemp', 'assets'])
			const originalAssetsAmount = assets.get('originalAssetsAmount')// 资产原值
			const depreciationAmount = assets.get('depreciationAmount')// 折旧累计
			const cleaningAmount = assets.get('cleaningAmount')
			const amountValue = Number(depreciationAmount) + Number(cleaningAmount) - Number(originalAssetsAmount)
			return state.setIn(['oriTemp', 'amount'], amountValue)

		},
		[ActionTypes.RUNNING_ZJTX_SELECT_CATEGORY]					     : () => {
            let propertyCost = ''
            const propertyCostList = action.data.get('propertyCostList')
            if (propertyCostList.size == 1) {
                propertyCost = propertyCostList.get(0)
            }
            return state.setIn(['oriTemp', 'relationCategoryUuid'], action.data.get('uuid'))
                        .setIn(['oriTemp', 'relationCategoryName'], action.data.get('name'))
                        .setIn(['oriTemp', 'beProject'], action.data.get('beProject'))
						.setIn(['oriTemp', 'usedProject'], action.data.get('beProject'))
                        .setIn(['oriTemp', 'propertyCost'], propertyCost)
                        .setIn(['oriTemp', 'propertyCostList'], propertyCostList)
						.setIn(['oriTemp', 'projectCardList'], fromJS([{amount: ''}]))
        },
		[ActionTypes.RUNNING_GET_SFGL_CATEGORYLIST]					            : () => {
            return state.set('categoryList', fromJS(action.data.childList ? action.data.childList : []))
						.setIn(['oriTemp', 'pendingManageDto'], editRunningState.getIn(['oriTemp', 'pendingManageDto']))
        },
		[ActionTypes.RUNNING_GET_JZCB_CATEGORYLIST]					            : () => {
			if (state.getIn(['views', 'ylType'])=='COPY') {//复制流水
				return state.set('categoryList', fromJS(action.data))
			}
            return state.set('categoryList', fromJS(action.data))
						.setIn(['oriTemp', 'relationCategoryUuid'], '')
						.setIn(['oriTemp', 'relationCategoryName'], '请选择处理类别')
        },
		[ActionTypes.RUNNING_CHANGE_GGFYFT_PROJECT_CARD]		     : () => {
            const totalAmount = state.getIn(['oriTemp', 'jrAmount'])
            switch (action.dataType) {
                case 'card' : {
					let list = []
					const currentItem = state.getIn(['oriTemp', 'projectCardList', action.idx])
					action.value.map((item, i) => {
						let amount = '', percent = ''
						if (i==0 && currentItem) {
							amount = currentItem.get('amount')
							percent = currentItem.get('percent')
							amount = amount ? amount : ''
							percent = percent ? percent : ''
						}
						list.push({
							cardUuid: item['uuid'],
							code: item['code'],
							name: item['oriName'],
							amount,
							percent,
							propertyCost: '',
						})
					})
					let projectCardList = state.getIn(['oriTemp', 'projectCardList']).toJS()
					projectCardList.splice(action.idx, 1, ...list)

					state = state.setIn(['oriTemp', 'projectCardList'], fromJS(projectCardList))
                    break
                }
                case 'amount' : {
                    let percent = decimal(action.value/totalAmount, 4)*100
					if (action.value=='-') {
						percent = 0
					}
                    state = state.setIn(['oriTemp', 'projectCardList', action.idx, 'amount'], action.value)
                                .setIn(['oriTemp', 'projectCardList', action.idx, 'percent'], percent)
                    break
                }
                case 'percent' : {
                    const amount = decimal(action.value*totalAmount/100)
                    state = state.setIn(['oriTemp', 'projectCardList', action.idx, 'amount'], amount)
                                .setIn(['oriTemp', 'projectCardList', action.idx, 'percent'], action.value)
                    break
                }
                case 'add' : {
                    state = state.setIn(['oriTemp', 'projectCardList', action.idx], fromJS({amount: '', percent: ''}))
                    break
                }
                case 'delete' : {
                    state = state.deleteIn(['oriTemp', 'projectCardList', action.idx])
                    break
                }
				case 'propertyCost' : {
                    state = state.setIn(['oriTemp', 'projectCardList', action.idx, 'propertyCost'], action.value)
                    break
                }
            }
            return state
        },
		[ActionTypes.RUNNING_GGFYFT_AUTO_CALCULATE]				     : () => {
            const jrAmount = state.getIn(['oriTemp', 'jrAmount'])
            return state.updateIn(['oriTemp', 'projectCardList'], item => item.map(v => {
                const percent = v.get('percent')
                const amount = decimal(jrAmount*percent/100) ? decimal(jrAmount*percent/100) : ''
                return v.set('amount', amount)
            }))
        },
		[ActionTypes.RUNNING_FILTER_JZCBLIST]						 : () => {
			const stockCardList = state.getIn(['oriTemp', 'stockCardList'])
			const stockWeakList = state.getIn(['oriTemp', 'stockWeakList'])

			const stockCardUuidList = stockCardList.map(v => v.get('cardUuid'))
			const pendingStrongList = stockWeakList.filter(v => stockCardUuidList.includes(v.get('stockCardUuid')))

			return state.setIn(['oriTemp', 'pendingStrongList'], pendingStrongList)
		},

		// 附件
		[ActionTypes.CHANGE_EDIT_RUNNING_ENCLOSURE_LIST]						: () => {
			let enclosureList = state.get('enclosureList').toJS()
            action.imgArr.forEach(v => {
                enclosureList.push(v)
            })
			state = state.set('enclosureList', fromJS(enclosureList))
            return state
		},
		[ActionTypes.DELETE_EDIT_RUNNING_UPLOAD_FJ_URL]							: () => {
            state.get('enclosureList').map((v,i) => {
                if (i == action.index) {
                    state = state.deleteIn(['enclosureList',i])
                }
            })
            state = state.set('enclosureCountUser', state.get('enclosureList').size)
            return state
		},
		[ActionTypes.EDIT_RUNNING_INIT_FJ_LIST]									: () => {
			state = state.set('enclosureList', fromJS([]))
			return state
		},
		[ActionTypes.EDIT_RUNNING_GET_LS_LABEL_FETCH]							: () => {
			let label = []
            action.receivedData.data.map((item) => {
                label.push({
                    key: item,
                    value: item
                })
            })
            state = state.set('label', fromJS(label))
            return state
		},
		[ActionTypes.CHANGE_EDIT_RUNNING_TAG_NAME]								: () => {
			state.get('enclosureList').map((v,i) => {
                if(i == action.index){
                    state = state.setIn(['enclosureList', i, 'label'], action.value)
                }
            })
            return state
		},
		[ActionTypes.RUNNING_ACCOUNT_MORE_CARD]					                : () => {
            switch (action.dataType) {
                case 'card' : {
					const arr = action.value.value.split(Limit.TREE_JOIN_STR)
					const poundage = {
						needPoundage: action.value.needPoundage,
						poundage: action.value.poundage,
						poundageRate: action.value.poundageRate
					}
                    const amount = state.getIn(['oriTemp', 'accounts', action.idx, 'amount'])
                    state = state.setIn(['oriTemp', 'accounts', action.idx], fromJS({
						accountUuid: arr[0],
						accountName: arr[1],
						amount,
						poundage,
					}))
                    break
                }
                case 'amount' : {
                    state = state.setIn(['oriTemp', 'accounts', action.idx, 'amount'], action.value)
					.setIn(['oriTemp', 'accounts', action.idx, 'isManual'], false)
                    break
                }
                case 'add' : {
                    state = state.setIn(['oriTemp', 'accounts', action.idx], fromJS({amount: ''}))
                    break
                }
                case 'delete' : {
                    state = state.deleteIn(['oriTemp', 'accounts', action.idx])
                    break
                }
            }
            return state

        },

		[ActionTypes.RUNNING_GET_WAREHOUSE]					       : () => {
            action.receivedData.forEach((v, i) => {
                v['key'] = `${v['code']} ${v['name']}`,
                v['value'] = v['uuid']
            })
			if (action.oriState=='STATE_CHYE_TYDJ') {
				return state.set('warehouseListTydj', fromJS(action.receivedData))
			}

            return state.set('warehouseList', fromJS(action.receivedData))

        },
		[ActionTypes.RUNNING_CHANGE_HANDLECATEGORY]				   : () => {
			const item = action.data

			let beProject = item['beProject']
			let usedProject = item['beProject']
			let usedStock = false
			let propertyCost = '', propertyCostList = []
			if ((item['propertyCarryover']=='SX_HW')) {
				beProject = false
				usedProject = false
				usedStock = true
			}
			if (item['categoryType']=='LB_CQZC') {
				beProject = false
				usedProject = false
			}
			if (item['categoryType']!='LB_CQZC' && item['propertyCostList'] && item['propertyCostList'].length) {
				propertyCost = item['propertyCostList'][0]
				propertyCostList = item['propertyCostList']
			}

            return state.setIn(['oriTemp', 'relationCategoryUuid'], item['uuid'])
			.setIn(['oriTemp', 'relationCategoryUuid'], item['uuid'])
			.setIn(['oriTemp', 'relationCategoryName'], item['name'])
			.setIn(['oriTemp', 'beProject'], beProject)
			.setIn(['oriTemp', 'usedProject'], usedProject)
			.setIn(['oriTemp', 'projectCardList'], fromJS([{amount: ''}]))
			.setIn(['oriTemp', 'usedStock'], usedStock)
			.setIn(['oriTemp', 'stockCardList'], fromJS([{amount: ''}]))
			.setIn(['oriTemp', 'propertyCost'], propertyCost)
			.setIn(['oriTemp', 'propertyCostList'], fromJS(propertyCostList))
			.set('categoryTemp', fromJS({
				usedStock: usedStock,
				beProject: beProject,
				propertyCarryover: item['propertyCarryover'],
				propertyCostList: item['propertyCostList'],
			}))

        },
		[ActionTypes.RUNNING_SET_JZCB_PRICE]                       : () => {
			const pendingStrongList = state.getIn(['oriTemp', 'pendingStrongList'])
			let stockCardList = [], uuidList = []

			pendingStrongList.forEach(w => {
				if (w.get('beSelect')) {
					let totalQuantityAmount = Number(w.get('quantityAmount'))
					let totalNumber = Number(w.get('number'))
					let totalQuantity = Number(w.get('quantity'))
					let amount = 0, unitPrice = 0

					const cardUuid = w.get('stockCardUuid')
					const warehouseCardUuid = w.get('storeCardUuid') ? w.get('storeCardUuid') : ''
                    const batch = w.get('batch') ? w.get('batch') : ''
                    const propertyList = w.get('assistList') ?  w.get('assistList').toJS().map(v => v['propertyUuid']).sort() : []
                    const allPropertyStr = `${cardUuid}_${warehouseCardUuid}_${batch}_${propertyList.join('_')}`

					if (uuidList.includes(allPropertyStr)) {//{原来有的
						const idx = uuidList.findIndex(v => v==allPropertyStr)
						totalQuantityAmount += Number(stockCardList[idx]['totalQuantityAmount'])
						totalNumber += Number(stockCardList[idx]['totalNumber'])
						totalQuantity += Number(stockCardList[idx]['totalNumber'])

						if (totalQuantityAmount*totalNumber > 0) {
							unitPrice = decimal(totalQuantityAmount/totalNumber)
							amount = decimal(totalQuantity*Number(unitPrice))
						}

						stockCardList[idx]['price'] = unitPrice ? unitPrice : ''
						stockCardList[idx]['amount'] = amount ? amount : ''
						stockCardList[idx]['quantity'] = totalQuantity
						stockCardList[idx]['totalQuantityAmount'] = totalQuantityAmount
						stockCardList[idx]['totalNumber'] = totalNumber
						stockCardList[idx]['totalQuantity'] = totalQuantity
					} else {//全新的卡片
						uuidList.push(allPropertyStr)
						if (totalQuantityAmount*totalNumber > 0) {
							unitPrice = decimal(totalQuantityAmount/totalNumber)
							amount = decimal(totalQuantity*Number(unitPrice))
						}

						stockCardList.push({
							cardUuid: w.get('stockCardUuid'),
							code: w.get('stockCardCode'),
							name: w.get('stockCardName'),
							isOpenedQuantity: w.get('isOpenedQuantity'),
							unitName: w.get('unitCardName'),
							unitUuid: w.get('unitCardUuid'),
							price: unitPrice ? unitPrice : '',
							amount: amount ? amount : '',
							quantity: totalQuantity,
							totalQuantityAmount,
							totalNumber,
							totalQuantity,
							warehouseCardCode: '',
							warehouseCardUuid: w.get('storeCardUuid'),
							warehouseCardName: w.get('storeCardName'),
							financialInfo: {
								openAssist: w.get('assistList').size ? true : false,
								openSerial: false,
								openBatch: batch ? true : false
							},
							assistList: w.get('assistList'),
							batch: w.get('batch'),
							batchUuid: w.get('batchUuid'),
							expirationDate: w.get('expirationDate'),
						})

					}

				}
			})

			return state.setIn(['oriTemp', 'stockCardList'], fromJS(stockCardList).sortBy(v => v.get('code')))

		},
		[ActionTypes.RUNNING_UPDATE_STOCK_BATCH]                   : () => {
			const oriState = state.getIn(['oriTemp', 'oriState'])
			state = state.updateIn(['oriTemp', 'stockCardList'], item => item.map(v => {
				if (v.get('cardUuid')==action.batch.get('cardUuid') && v.get('batchUuid')==action.batch.get('batchUuid')) {
					v = v.merge(action.batch)
				}
				if (oriState=='STATE_CHZZ_ZZD') {
					v = v.updateIn(['childCardList'], w => w.map(childItem => {
						if (childItem.get('cardUuid')==action.batch.get('cardUuid') && childItem.get('batchUuid')==action.batch.get('batchUuid')) {
							childItem = childItem.merge(action.batch)
						}
						return childItem
					}))
				}
				return v
			}))
			if (oriState=='STATE_CHZZ_ZZCX') {
				state = state.updateIn(['oriTemp', 'stockCardOtherList'], item => item.map(v => {
					if (v.get('cardUuid')==action.batch.get('cardUuid') && v.get('batchUuid')==action.batch.get('batchUuid')) {
						v = v.merge(action.batch)
					}
					return v
				}))
			}
			if (state.getIn(['views', 'insertOrModify'])=='insert' && ['STATE_YYSR_XS', 'STATE_YYSR_TS'].includes(oriState)) {
				state = state.updateIn(['oriTemp', 'carryoverCardList'], item => item.map(v => {
					if (v.get('cardUuid')==action.batch.get('cardUuid') && v.get('batchUuid')==action.batch.get('batchUuid')) {
						v = v.merge(action.batch)
					}
					return v
				}))
			}

			return state

		}

	}[action.type] || (() => state))();
}
