import { fromJS, toJS, is }	from 'immutable'
import { message } from 'antd'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const lsqcState = fromJS({
	flags: {
		currentacid: '',
		currentasscategorylist: [],
		entertext: [],
		qcshowMessageMask: false,
		qciframeload: false,
		isModified: false,
		property:'',
		inventoryNature:'',
		// runningShowChild:['75cafb2f21dd4f3a920a7ebb5e17263c','fb0026daa23b417abe5897cc63440f2f','4f78e4d91bd54b749af92414e39173d1','5f78e4d91bd54b749af92414e39173d2','6f78e4d91bd54b749af92414e39173d3','6f78e4d91bd54b749af92414e39173d4','7f78e4d91bd54b749af92414e39173d5','8f78e4d91bd54b749af92414e39173d6','9f78e4d91bd54b749af92414e39173d7'],
		balanceShowChild:[],

		selectList:[],
		selectItem:[],
		curModifyBtn:'',
		isDefinite:'',
		isCheckOut:false,
		curCategoryUuid:'',
		level:'',
		notClearItem:{},
		issuedate:'',
		issues:[],
		QcUuid:'',
		cardPageObj: {
			pages: 1,
			currentPage: 1,
			total: 1,
		}
	},
	firstChildToggle:{
		AccountDisplay: 'none',
		TaxDisplay: 'none',
		SalaryDisplay: 'none',
		ContactsDisplay: 'none',
		OthersDisplay: 'none',
		StockDisplay: 'none',
		LongTermDisplay: 'none',
		CIBDisplay: 'none',
		ProjectDisplay: 'none',

	},
	acbalist: [{
		idx: '',
		amount: '',
		beginCount:'',
		acfullname: '',
		acname: '',

		direction: ''
	}],
	Qcdate:'2018年07月',
	QcList : {
		//账户
		Account:{
			status:true,
			List:{
				name:'账户',
				childList:[]
			}
		},
		// 薪酬
		Salary:{
			status:true,
			List:{
				name:'薪酬',
				childList:[]
			}
		},
		// 税费
		Tax:{
			status:true,
			List:{
				name:'税费',
				childList:[]
			}
		},
		// 往来款
		Contacts:{
			status:true,
			List:{
				name:'往来款',
				childList:[]
			}
		},
		// 存货
		Stock:{
			status:true,
			List:{
				name:'存货',
				childList:[]
			}
		},
		// 项目
		Project:{
			status:true,
			List:{
				name:'项目',
				childList:[]
			}
		},
		// 其他应收、应付
		Others:{
			status:true,
			List:{
				name:'其他应收、应付',
				childList:[]
			}
		},
		// 长期资产
		LongTerm:{
			status:true,
			List:{
				name:'长期资产',
				childList:[]
			}
		},
		// 资本、投资、借款 Capital, investment, borrowing
		CIB:{
			status:true,
			List:{
				name:'资本、投资与借款',
				childList:[]
			}
		}
	},
	QcTotalNumber:{
		Account:'',
		Tax:'',
		Salary:'',
		Contacts:'',
		Others:'',
		Stock:'',
		LongTerm:'',
		CIB:'',

	},
	changeQcList:[],
	addItem:{},
	qcimportresponlist : {
		'failJsonList': [],
		'successJsonList': []
	},
	cantChooseList:[],
	qcmessage: '',
	showQcye: false,
	showContactsModal: false,
	hasSearchContent: false,
	MemberList:[{
		advanceOpened:100,
		code:"1",
		name:"客户 供应商1",
		payableOpened:100,
		prepaidOpened:100,
		receivableOpened:100,
		uuid:"468359664556310528",
	}],
	thingsList:[],
	searchList:[],
	contactsCategory: [{
		"childList":[],
	}]
})

export default function handleItem(state = lsqcState, action) {
	return ({
		[ActionTypes.INIT_LSQC]							: () => lsqcState,
		[ActionTypes.SHOW_LSQC]							: () =>{
			return state = state.set('showQcye', action.value)
		},
		[ActionTypes.LSQC_COMMON_CHANGE]							: () =>{
			return state = state.set(action.changeType, action.value)
		},
		[ActionTypes.MODIFY_PERIOD_ACCOUNT]							: () =>{
			return state = state.setIn(['flags','issuedate'], action.issuedate)
		},
		[ActionTypes.INIT_MODULE_ALL_SHOW]: () => {
			const value = action.isShow ? 'block' : 'none'
			return state = state.setIn(['firstChildToggle','AccountDisplay'],value)
								.setIn(['firstChildToggle','TaxDisplay'],value)
								.setIn(['firstChildToggle','SalaryDisplay'],value)
								.setIn(['firstChildToggle','ContactsDisplay'],value)
								.setIn(['firstChildToggle','OthersDisplay'],value)
								.setIn(['firstChildToggle','StockDisplay'],value)
								.setIn(['firstChildToggle','LongTermDisplay'],value)
								.setIn(['firstChildToggle','CIBDisplay'],value)
								.setIn(['firstChildToggle','ProjectDisplay'],value)
								.setIn(['firstChildToggle','isShow'],action.isShow)
		},
		// 期初列表
		[ActionTypes.GET_BEGINNING_LIST]          : () => {
			const listData = action.receivedData.result
			let selectBalance = []
			const loop = data => data.map(item => {
				if(item.childList.length > 0){
					selectBalance.push(item.relationUuid)
					loop(item.childList)
				}
			})
			let arr
			if(!action.receivedData.result.isSimplify){
				arr = [listData.rateBalance,listData.paymentBalance,listData.amountBalance,
				listData.otherBalance,listData.mixingBalance]
			}else{
				arr = [listData.accountBalance,listData.rateBalance,listData.paymentBalance,listData.amountBalance,
				listData.otherBalance,listData.stockBalance,listData.assetsBalance,listData.mixingBalance,listData.projectBalance]
				state = state.setIn(['QcList','Account','List'], fromJS(listData.accountBalance))
							.setIn(['QcList','Account','status'],true)
							.setIn(['QcList','LongTerm','List'], fromJS(listData.assetsBalance))
							.setIn(['QcList','LongTerm','status'],true)
							.setIn(['QcList','Stock','List'], fromJS(listData.stockBalance))
							.setIn(['QcList','Stock','status'],true)
			}
			arr.map(item => {
				item.childList.length ? loop(item.childList) : ''
			})
			if(action.isPerid){
				state = state.setIn(['flags','balanceShowChild'],fromJS(selectBalance))
			}

                const period = listData.balancePeriod
                const firstyear = Number(period.firstYear)
                const lastyear = Number(period.lastYear)
                const firstmonth = Number(period.firstMonth)
                const lastmonth = Number(period.lastMonth)
                const issues= []

                for (let year = lastyear; year >= firstyear; -- year) {
                    if (firstyear === 0)
                        break
                    for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month) {
                        issues.push(`${year}年第${month < 10 ? '0' + month : month}期`)
                    }
                }


			state = state.setIn(['flags','issues'],fromJS(issues))
						.setIn(['flags','issuedate'],`${period.year}年第${period.month}月`)
						.setIn(['flags','QcUuid'],fromJS(period.uuid))
						.setIn(['QcList','Tax','List'], fromJS(listData.rateBalance))
						.setIn(['QcList','Tax','status'],true)
						.setIn(['QcList','Salary','List'], fromJS(listData.paymentBalance))
						.setIn(['QcList','Salary','status'],true)
						.setIn(['QcList','Contacts','List'], fromJS(listData.amountBalance))
						.setIn(['QcList','Contacts','status'],true)
						.setIn(['QcList','Others','List'], fromJS(listData.otherBalance))
						.setIn(['QcList','Others','status'],true)
						.setIn(['QcList','CIB','List'], fromJS(listData.mixingBalance))
						.setIn(['QcList','CIB','status'],true)
						.setIn(['QcList','Project','List'], fromJS(listData.projectBalance))
						.setIn(['QcList','Project','status'],true)
						.setIn(['flags','curModifyBtn'],'')
						.setIn(['flags','isCheckOut'],period.isCheckOut)
						.setIn(['flags','selectItem'],fromJS([]))
						.setIn(['flags','selectList'],fromJS([]))
						.set('changeQcList',fromJS([]))
						.set('addItem',fromJS({}))
			let ContactsArr = [],StockArr=[]
			const ContactsList = state.getIn(['QcList','Contacts','List','childList'])
			const StockList = state.getIn(['QcList','Stock','List','childList'])
			ContactsList.map((item,i) => {
				if(item.get('childList')){
					item.get('childList').map(v => {
						if(!v.get('isDefinite')){
							let amountName = v.get('direction') == 'debit' ? 'debitBeginAmount' : 'creditBeginAmount'
							ContactsArr.push({index:i,amount:v.get(amountName)})
						}
					})
				}
			})
			StockList.map((item,i) => {
				if(item.get('childList')){
					item.get('childList').map(v => {
						if(!v.get('isDefinite')){
							let amountName = v.get('direction') == 'debit' ? 'debitBeginAmount' : 'creditBeginAmount'
							StockArr.push({index:i,amount:v.get(amountName)})
						}
					})
				}
			})
			// const StockList = state.getIn(['QcList','Stock','List','childList'])
			// StockList.map((item,i) => {
			// 	if(!item.get('isDefinite')){
			// 		let amountName = item.get('direction') == 'debit' ? 'debitBeginAmount' : 'creditBeginAmount'
			// 		StockArr.push({amount:item.get(amountName)})
			// 	}
			// })

			state = state.setIn(['notdefined','ContactsArr'],fromJS(ContactsArr))
                         .setIn(['notdefined','StockArr'],fromJS(StockArr))
			return state
		},
		// 往来单位类别
		[ActionTypes.GET_BEGINNING_CATEGORY]                     : () => {
			// let selectList = []
			// action.receivedData.result.forEach(v => selectList.push(v.uuid)) //默认展开一二级类别
				const memberOrStock = action.cardType === 'Contacts' ? 'MemberList' : 'thingsList'
				let cantChooseList = []
				let property = ''
				if(action.item.get('inventoryNature')){
					property = 'stock'
				}else{
					property = action.item.get('property')
				}
				const isCheckOut = state.getIn(['flags','isCheckOut'])
				const cardPageObj = {
					currentPage: action.receivedData.currentPage ? action.receivedData.currentPage : 1,
					pages: action.receivedData.pages ? action.receivedData.pages : 1,
					total: action.receivedData.total ? action.receivedData.total : 1,
				}
				action.receivedData.resultList.map(v => {
					let amountNum
						switch(property){
							case 'NEEDIN':
								amountNum = v.receivableOpened
								break
							case 'PREIN':
								amountNum = v.advanceOpened
								break
							case 'NEEDPAY':
								amountNum = v.payableOpened
								break
							case 'PREPAY':
								amountNum = v.prepaidOpened
								break
							case 'stock':
								amountNum = v.opened
								break
							case 'CARD_PROPERTY_BASIC':
								amountNum = v.basicProductOpen
								break
							case 'CARD_PROPERTY_CONTRACT_COST':
								amountNum = v.contractCostOpen
								break
							case 'CARD_PROPERTY_CONTRACT_PROFIT':
								amountNum = v.contractProfitOpen
								break
							case 'CARD_PROPERTY_ENGINEER':
								amountNum = v.engineeringSettlementOpen
								break
							default:
						}
					if(amountNum != 0 && !isCheckOut){
						cantChooseList.push(v.uuid)
					}
				})
				state = state.set('contactsCategory', fromJS(action.receivedData.typeList))
							.set(memberOrStock,fromJS(action.receivedData.resultList))
							.setIn(['flags','inventoryNature'],action.item.get('inventoryNature'))
							.setIn(['flags','property'],property)
							.setIn(['flags','cardPageObj'],fromJS(cardPageObj))
							.set('cantChooseList',fromJS(cantChooseList))
							.set('addItem',action.item)
				return state
		},
		// 所选类别下 往来单位列表
		[ActionTypes.GET_CONTACTS_MEMBERS_LIST]                     : () => {
			const memberOrStock = action.cardType === 'Contacts' ? 'MemberList' : 'thingsList'
			state = state.set(memberOrStock, fromJS(action.receivedData.resultList))
			let selectList = []
			action.receivedData.resultList.map((v) => {
				if(v.code.indexOf(action.searchCardContent) > -1 || v.name.indexOf(action.searchCardContent) > -1){
					selectList.push(v)
				}
			})
			if(action.searchCardContent === ''){
				state = state.set('searchList',fromJS([]))
			}else{
				state = state.set('searchList',fromJS(selectList))
			}
			const property = state.getIn(['flags','property'])
			const isCheckOut = state.getIn(['flags','isCheckOut'])
			let cantChooseList = []
			action.receivedData.resultList.map(v => {
				let amountNum
				switch(property){
					case 'NEEDIN':
						amountNum = v.receivableOpened
						break
					case 'PREIN':
						amountNum = v.advanceOpened
						break
					case 'NEEDPAY':
						amountNum = v.payableOpened
						break
					case 'PREPAY':
						amountNum = v.prepaidOpened
						break
					case 'stock':
						amountNum = v.opened
						break
					case 'CARD_PROPERTY_BASIC':
						amountNum = v.basicProductOpen
						break
					case 'CARD_PROPERTY_CONTRACT_COST':
						amountNum = v.contractCostOpen
						break
					case 'CARD_PROPERTY_CONTRACT_PROFIT':
						amountNum = v.contractProfitOpen
						break
					case 'CARD_PROPERTY_ENGINEER':
						amountNum = v.engineeringSettlementOpen
						break
					default:
				}
				if(amountNum!=0 && !isCheckOut){
				cantChooseList.push(v.uuid)
				}
			})
			if(action.cardPageObj){
				state = state.setIn(['flags','cardPageObj'],fromJS(action.cardPageObj))
			}
			state = state.set('cantChooseList',fromJS(cantChooseList))
						.setIn(['flags','curCategoryUuid'],fromJS(action.Uuid))
						.setIn(['flags','level'],fromJS(action.level))
			return state
		},
		[ActionTypes.BEGINNING_TRIANGLE_SWITCH]          : () => {
        const showLowerList = state.getIn(['flags', 'balanceShowChild'])

        if (!action.showChild) {
            // 原来不显示
            const newShowLowerList = showLowerList.push(action.uuid)
            return state.setIn(['flags', 'balanceShowChild'], newShowLowerList)
        } else {
            // 原来显示
            const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
            return state.setIn(['flags', 'balanceShowChild'], newShowLowerList)
        }
    },
	[ActionTypes.CHANGE_BEGINNING_LIST]          : () => {
			const number = action.number === '' ? 0 : action.number
			let newItem = action.item.set(action.amountName,number)
			let newListItem

			// 更新改变的list
			let changeQcList = state.get('changeQcList')
			changeQcList = changeQcList.filter((item,index) => {
				return (
					item.get('uuid') !== action.item.get('uuid') ||
					item.get('uuid') === action.item.get('uuid') && item.get('property')!== action.item.get('property')
				)
			})
			let operateType = action.item.get('add') ? '1' : '3'

			const newChangeQcList = changeQcList.push(fromJS({
				uuid:action.item.get('uuid'),
				name:action.item.get('name'),
				amount:number,
				operateType:operateType,
				balanceGroup:action.item.get('balanceGroup') ? action.item.get('balanceGroup') :'',
				property: action.item.get('property'),
				inventoryNature: action.item.get('inventoryNature')
			}))

			state = state.set('changeQcList',fromJS(newChangeQcList))

			let changeList = state.getIn(['QcList',action.listName,'List','childList'])
			const isCheckOut = state.getIn(['flags','isCheckOut'])

			if(isCheckOut){
				//已结账对未明确对象处理
				let newChildList = action.listItem.get('childList').toJS()
				const listLoop = (data) => data.map((item,i) => {
					let imItem = fromJS(item)
					if(is(imItem,action.item)){
						item[action.amountName] = number
					}else{
						if(item.childList && item.childList.length){
							listLoop(item.childList)
						}
					}
				})
				listLoop(newChildList)
				state= state.setIn(['QcList',action.listName,'List','childList'],fromJS(newChildList))

				let addItems = state.get('changeQcList').filter(item => {
					return item.get('operateType') == '1'
				})

				let index,notDefinedIndex,notDefinedItem
				// if(action.listName === 'Contacts'){
					changeList.map((item,i) => {
						if(item.get('childList') && item.get('childList').size){
							item.get('childList').map((v,j) => {
								if(v.get('uuid') === action.item.get('uuid') && v.get('property') === action.item.get('property') && action.listName === 'Contacts' ||  v.get('uuid') === action.item.get('uuid') && v.get('inventoryNature') === action.item.get('inventoryNature') && action.listName === 'Stock'){
									index = i
								}
							})
						}
					})
					const notDefined = changeList.getIn([index,'childList']).map((item,i) => {
						if(!item.get('isDefinite')){
							notDefinedIndex = i
							return item
						}
					})

					notDefinedItem = notDefined.get(notDefinedIndex)
				// }else{
				// 	const notDefined = changeList.map((item,i) => {
				// 		if(!item.get('isDefinite')){
				// 			notDefinedIndex = i
				// 			return item
				// 		}
				// 	})
				// 	notDefinedItem = notDefined.get(notDefinedIndex)
				// }


				let initAmount = 0
				addItems.map(item => {
					if(action.item.get('property') === item.get('property') && action.listName === 'Contacts' || action.item.get('inventoryNature') === item.get('inventoryNature') && action.listName === 'Stock'){
						let itemAmount = item.get('amount') ? item.get('amount') : 0
						initAmount += parseFloat(itemAmount)
					}
				})
				const notdefinedArr = action.listName === 'Contacts' ? state.getIn(['notdefined','ContactsArr']) : state.getIn(['notdefined','StockArr'])
				let oldNotDefinedAmount = 0
				notdefinedArr.map(item => {
					if(item.get('index') === index){
						oldNotDefinedAmount = item.get('amount')
					}
				})
				const notDefinedAmount = initAmount

				if(oldNotDefinedAmount < notDefinedAmount){
					// 期初值大于未明确对象期初,将输入值改为0
					let changeQcList = state.get('changeQcList')
					changeQcList = changeQcList.filter((item,index) => {
						return item.get('uuid') !== action.item.get('uuid')
					})
					const newChangeQcList = changeQcList.push(fromJS({
						uuid:action.item.get('uuid'),
						name:action.item.get('name'),
						amount:0,
						operateType:'1',
						balanceGroup:action.item.get('balanceGroup') ? action.item.get('balanceGroup') :'',
						property: action.item.get('property'),
						inventoryNature: action.item.get('inventoryNature'),
					}))

					state = state.set('changeQcList',fromJS(newChangeQcList))
					// 恢复未明确初始值
					let restoreList = action.listItem.get('childList').toJS()
					let addQcNumber = 0
					const restoreLoop = (data) => data.map((item,i) => {
						if(is(fromJS(item),action.item)){
							item[action.amountName] = 0
						}else{
							if(item.childList && item.childList.length){
								restoreLoop(item.childList)
							}
						}
						if(item.add && !is(fromJS(item),action.item)){
							addQcNumber += parseFloat(item[action.amountName])
						}
					})
					restoreLoop(restoreList)
					let addItems = state.get('changeQcList').filter(item => {
						return item.get('operateType') == '1'
					})
					let initAmount = 0
					addItems.map(item => {
						let itemAmount = item.get('amount') ? item.get('amount') : 0
						initAmount += parseFloat(itemAmount)
					})
					state= state.setIn(['QcList',action.listName,'List','childList'],fromJS(restoreList))

					// if(action.listName === 'Contacts'){
						state = state.setIn(['QcList',action.listName,'List','childList',index,'childList',notDefinedIndex,action.amountName],oldNotDefinedAmount-addQcNumber)
					// }else{
					// 	state = state.setIn(['QcList',action.listName,'List','childList',notDefinedIndex,action.amountName],oldNotDefinedAmount-addQcNumber)
					// }


					return message.warn('新增期初值不能大于未明确对象期初值') && state
				}

				// state = action.listName === 'Contacts' ?
				state = state.setIn(['QcList',action.listName,'List','childList',index,'childList',notDefinedIndex,action.amountName],oldNotDefinedAmount-notDefinedAmount)
				// :
				// state.setIn(['QcList',action.listName,'List','childList',notDefinedIndex,action.amountName],oldNotDefinedAmount-notDefinedAmount)

				let changeQcList = state.get('changeQcList')
				changeQcList = changeQcList.filter((item,index) => {
					return item.get('uuid') !== notDefinedItem.get('uuid')
				})
				const newChangeQcList = changeQcList.push(fromJS({
					uuid:notDefinedItem.get('uuid'),
					name:notDefinedItem.get('name'),
					amount:notDefinedAmount,
					operateType:'3',
					balanceGroup:notDefinedItem.get('balanceGroup'),
					property: notDefinedItem.get('property'),
					inventoryNature: notDefinedItem.get('inventoryNature')
				}))
				state = state.set('changeQcList',fromJS(newChangeQcList))


			}else{
				const newNumber = action.number === '' ? 0 : action.number
				let newChildList = state.getIn(['QcList',action.listName,'List']).toJS()
				const list = [newChildList]
				const loop = (data) => data.map((item,i) => {
					if(item.uuid === action.item.get('uuid') && item.property === action.item.get('property')){
						item[action.amountName] = newNumber
					}
					if(item.childList && item.childList.length > 0){
						loop(item.childList)
					}
				})
				loop(list)
				const list1 = list[0]

				state = state.setIn(['QcList',action.listName,'List'],fromJS(list1))
			}


			return state

		},
		[ActionTypes.CHANGE_QCMODAL_SHOW_HIDE]          : () => {
			if(!action.value){
				state= state.setIn(['flags', 'selectList'], fromJS([]))
							.setIn(['flags','selectItem'],fromJS([]))
							.set('cantChooseList', fromJS([]))
			}
			return state = state.set('showContactsModal', action.value)
								.setIn(['flags', 'isDefinite'], action.isDefinite)
								.setIn(['flags', 'notClearItem'], action.item)
								.setIn(['flags', 'level'], '')
								.setIn(['flags', 'curCategoryUuid'], '')
		},
		[ActionTypes.DELETE_BEGINNING_LIST_ITEM]          : () => { //operateType 1新增，2删除，3修改
			const changeQcList = state.get('changeQcList')
			let newChangeQcList
			if(changeQcList.size){
				// let index = 0
				// changeQcList.forEach((item,i) => {
				// 	index++
				// 	if(item.get('uuid') === action.item.get('uuid') && item.get('property') === action.item.get('property')){
				// 		newChangeQcList = changeQcList.delete(i)
				// 		state = state.set('cantChooseList',state.get('cantChooseList').filter(v =>{
				// 			v !== item.get('uuid')
				// 		}))
				// 		return false
				// 	}
				// 	if(index === changeQcList.size){
				// 		newChangeQcList = changeQcList.push(fromJS({
				// 			uuid:action.item.get('uuid'),
				// 			relationUuid:action.item.get('relationUuid'),
				// 			name:action.item.get('name'),
				// 			amount:'',
				// 			operateType:'2',
				// 			balanceGroup:action.item.get('balanceGroup') ? action.item.get('balanceGroup') :'',
				// 			property: action.item.get('property'),
				// 			inventoryNature: action.item.get('inventoryNature')
				// 		}))
				// 		state = state.set('cantChooseList',state.get('cantChooseList').filter(v =>{
				// 			v !== action.item.get('uuid')
				// 		}))
				// 	}
				// })
				let hasFlag = false
				const changeLoop = data => data.map((item,i) => {
					if(item.get('uuid') === action.item.get('uuid') && item.get('property') === action.item.get('property')){
						newChangeQcList = changeQcList.filter(v => !(v.get('uuid') === action.item.get('uuid') && v.get('property') === action.item.get('property')))
						state = state.set('cantChooseList',state.get('cantChooseList').filter(v =>{
							v !== item.get('uuid')
						}))
						hasFlag = true
					}
					if(item.get('childList') && item.get('childList').size){
						changeLoop(item.get('childList'))
					}
				})
				changeLoop(changeQcList)
				if(!hasFlag){
					newChangeQcList = changeQcList.push(fromJS({
						uuid:action.item.get('uuid'),
						relationUuid:action.item.get('relationUuid'),
						name:action.item.get('name'),
						amount:'',
						operateType:'2',
						balanceGroup:action.item.get('balanceGroup') ? action.item.get('balanceGroup') :'',
						property: action.item.get('property'),
						inventoryNature: action.item.get('inventoryNature')
					}))
					state = state.set('cantChooseList',state.get('cantChooseList').filter(v =>{
						v !== action.item.get('uuid')
					}))
				}

			}else{
				newChangeQcList = changeQcList.push(fromJS({
					uuid:action.item.get('uuid'),
					relationUuid:action.item.get('relationUuid'),
					name:action.item.get('name'),
					amount:'',
					operateType:'2',
					balanceGroup:action.item.get('balanceGroup') ? action.item.get('balanceGroup') :'',
					property: action.item.get('property'),
					inventoryNature: action.item.get('inventoryNature')
				}))
				state = state.set('cantChooseList',state.get('cantChooseList').filter(v =>{
					v !== action.item.get('uuid')
				}))
			}
			let QcListItem = state.getIn(['QcList',action.listName,'List','childList'])
			const addItem = state.get('addItem')
			// QcListItem = QcListItem.map((item,i) => {
			// 	item = item.set('childList',item.get('childList').filter(v => {
			// 				return v.get('uuid') !== action.item.get('uuid') || v.get('uuid') === action.item.get('uuid') && v.get('property') !== action.item.get('property')
			//
			// 			}))
			// 	state = state.setIn(['QcList',action.listName,'List','childList',i],item)
			// })

			const oriPlaceArr = ['QcList',action.listName,'List','childList']
			const deleteLoop = (data,placeArr) => data.map((item,i) => {
				item = item.get('childList') ? item.set('childList',item.get('childList').filter(v => {
							return v.get('uuid') !== action.item.get('uuid') || v.get('uuid') === action.item.get('uuid') && v.get('property') !== action.item.get('property')

						})) : item
				state = state.setIn(placeArr.concat(i),item)
				if(item.get('childList') && item.get('childList').size){
					deleteLoop(item.get('childList'),placeArr.concat([i,'childList']))
				}
			})
			deleteLoop(QcListItem,oriPlaceArr)


        return state = state.set('changeQcList', newChangeQcList)
		// .setIn(['QcList',action.listName,'List','childList'], QcListItem)
    },
		[ActionTypes.CHANGE_QCBUTTON_MODIFY_SAVE]          : () => {
			let selectBalance = []
				let balanceShowChild = state.getIn(['flags','balanceShowChild']).toJS()
				const loop = data => data.map(item => {
					if(item.childList.length > 0){
						if(!(balanceShowChild.indexOf(item.relationUuid) > -1)){
							balanceShowChild.push(item.relationUuid)
						}
						loop(item.childList)
					}
				})
			const modifyList = state.getIn(['QcList',action.name,'List']).toJS()
			modifyList.childList.length ? loop(modifyList.childList) : ''

			return state = state.setIn(['QcList',action.name,'status'], action.value)
								.setIn(['flags','curModifyBtn'],action.name)
								.setIn(['flags','balanceShowChild'],fromJS(balanceShowChild))
								.setIn(['firstChildToggle',`${action.name}Display`],'block')


    },
		[ActionTypes.LSQC_RESTORE_MODIFICATION]          : () => {
			state = state.setIn(['QcList',action.curModifyBtn,'status'], true)
				     .setIn(['flags','curModifyBtn'],'')
				     .set('changeQcList',fromJS([]))

        return state

    },
		[ActionTypes.FIRST_CHILD_TOGGLE]          : () => {
			const newDisplay = state.getIn(['firstChildToggle',`${action.listName}Display`]) == 'none' ? 'block' : 'none'
			state = state.setIn(['firstChildToggle',`${action.listName}Display`],newDisplay)

        return state

    },
		// 选择往来单位
		[ActionTypes.CONTACTS_ITEM_CHECKBOX_SELECT]               : () => {

				const showLowerList = state.getIn(['flags', 'selectList']).toJS()
				const selectItemList = state.getIn(['flags', 'selectItem']).toJS()
				if (!action.checked) {
						// 原来没选
						showLowerList.push(action.uuid)
						selectItemList.push({uuid:action.uuid,name:`${action.code} ${action.name}`,oriName:action.name,oriCode:action.code})

						return state.setIn(['flags', 'selectList'],  fromJS(showLowerList))
									.setIn(['flags', 'selectItem'], fromJS(selectItemList))
				} else {
						// 原来选了

						const newShowLowerList = showLowerList.filter(v => v != action.uuid)
						const newSelectItemList = selectItemList.filter(v => v.uuid != action.uuid)

						return state.setIn(['flags', 'selectList'], fromJS(newShowLowerList))
									.setIn(['flags', 'selectItem'], fromJS(newSelectItemList))
				}

		},
		// 全选
		[ActionTypes.CONTACTS_ITEM_CHECKBOX_CHECK_ALL]               : () => {
			const allList = action.showMemberList

				if (action.selectAll) {
						// 全不选
						const showLowerList = state.getIn(['flags', 'selectList']).toJS()
						const selectItemList = state.getIn(['flags', 'selectItem']).toJS()
						let newShowLowerList = showLowerList,newSelectItemList = selectItemList
						allList && allList.size && allList.map(item => {
							newShowLowerList = newShowLowerList.filter(v => v != item.get('uuid'))
							newSelectItemList = newSelectItemList.filter(v => v.uuid != item.get('uuid'))
						})
						return state.setIn(['flags', 'selectList'],  fromJS(newShowLowerList))
									.setIn(['flags', 'selectItem'], fromJS(newSelectItemList))
				} else {
						// 全选 accountList
						const contactsList = allList
						let selectAllList = state.getIn(['flags', 'selectList']).toJS(),
							selectItemAllList = state.getIn(['flags', 'selectItem']).toJS(),
							cantLists = [],
							deleteLists = []
						const cantSelectList = state.get('cantChooseList')
						const changeQcList = state.get('changeQcList')
						changeQcList.map(item => {
							if(item.get('operateType') === '1' && (item.get('property') == action.addItemProperty || item.get('property')=="stock")){
								cantLists.push(item.get('uuid'))
							}
							if(item.get('operateType') === '2' && cantSelectList.indexOf(item.get('relationUuid')) > -1 ){
								deleteLists.push(item.get('relationUuid'))
							}
						})



						contactsList.forEach(v => {
							if(!(cantSelectList.indexOf(v.get('uuid')) > -1 && !(deleteLists.indexOf(v.get('uuid')) > -1) || cantLists.indexOf(v.get('uuid')) > -1)){
								console.log(selectAllList.indexOf(v.get('uuid')) === -1);
								if(selectAllList.indexOf(v.get('uuid')) === -1){
									selectAllList.push(v.get('uuid'))
									selectItemAllList.push({uuid:v.get('uuid'),name:`${v.get('code')} ${v.get('name')}`,oriName:v.get('name'),oriCode:v.get('code')})
								}
							}

						})
						return state.setIn(['flags', 'selectList'], fromJS(selectAllList))
									.setIn(['flags', 'selectItem'], fromJS(selectItemAllList))
				}

		},
		[ActionTypes.LSQC_SEARCH_CARD_LIST]               : () => {

				state = action.searchValue ? state.set('hasSearchContent',true) : state.set('hasSearchContent',false)
				const memberOrStock = action.cardType === 'Contacts' ? state.get('MemberList') : state.get('thingsList')
				let selectList = []
				memberOrStock.map((v) => {
					if(v.get('code').indexOf(action.searchValue) > -1 || v.get('name').indexOf(action.searchValue) > -1){
					selectList.push(v)
					}
				})
				if(action.searchValue === ''){
					state = state.set('searchList',fromJS([]))
				}else{
					state = state.set('searchList',fromJS(selectList))
				}
				return state

		},
		[ActionTypes.LSQC_ADD_RUNNING_BEGIN]               : () => {
			const selectList = state.getIn(['flags','selectItem']).toJS()
			const isDefinite = state.getIn(['flags','isDefinite'])
			let balanceShowChild = state.getIn(['flags','balanceShowChild']).toJS()
			balanceShowChild.push(action.addShowChilidUuid)
			let newItem
			let changeList = state.getIn(['QcList',action.addItemType,'List','childList'])
			let newChangeQcList,direction,balanceGroup,property,inventoryNature

			if(isDefinite){
				let newItem = []

				selectList.forEach((v,i) => {
					const changeQcList = state.get('changeQcList')
					let oldItem = state.get('addItem')
					if(action.addItemType == 'Stock'){
						direction = 'debit'
						balanceGroup = 'BALANCE_GROUP_STOCK'
						property = 'stock'
						inventoryNature = oldItem.get('inventoryNature')

					}else{
						direction = oldItem.get('direction')
						balanceGroup = oldItem.get('balanceGroup')
						property = oldItem.get('property')
						inventoryNature = ''
					}
					newItem = oldItem.get('childList').push(fromJS({
						uuid:v.uuid,
						name:v.name,
						balanceGroup:balanceGroup,
						property:property,
						inventoryNature,
						direction:direction,
						add:true,
						creditBeginAmount:0,
						debitBeginAmount:0
					}))
					newChangeQcList = changeQcList.push(fromJS({
						uuid:v.uuid,
						name:v.name,
						amount:0,
						operateType:'1',
						balanceGroup: balanceGroup,
						property: property,
						inventoryNature

					}))
					state = state.setIn(['addItem','childList'],newItem)
								.set('changeQcList',newChangeQcList)
				})
				const addItem = state.get('addItem')
				// if(action.addItemType == 'Stock'){
				// 	state = state.setIn(['QcList',action.addItemType,'List'],addItem)
				// }else{
					// changeList.map((item,i) => {
					// 	if(item.get('uuid') === addItem.get('uuid')){
					// 		state = state.setIn(['QcList',action.addItemType,'List','childList',i],addItem)
					// 	}
					//
					// })
				// }

				const setFlag = (item,index,parentPlace) => {
					item.parentPlace = parentPlace
					if (item.childList && item.childList.length) {
						for (let i = 0;i < item.childList.length; i++) {
							const newParentLevel = index === '' ? item.parentPlace.concat([i]) : item.parentPlace.concat(['childList',i])
							setFlag(item.childList[i],i,newParentLevel)
						}
					}
				}
				let flagChangeList = {childList: changeList.toJS()}
				setFlag(flagChangeList,'',['QcList',action.addItemType,'List','childList'])

				const loop = (data) => data.map((item,i) => {
					if(item.get('childList') && item.get('childList').size){
						loop(item.get('childList'))
					}
					if(item.get('uuid') === addItem.get('uuid')){
						state = state.setIn(item.get('parentPlace'),addItem)
					}
				})
				loop(fromJS(flagChangeList.childList))

			}else{

				// 未明确对象
				let index,changeQcListItem,direction,property,inventoryNature
				let oldItem = state.get('addItem')
				changeList.map((item,i) => {
					item.get('childList') && item.get('childList').map((v,j) => {
						if(v.get('uuid') === oldItem.get('uuid')){
							index = i
						}
					})
				})
				selectList.map(v => {
					let changeList = state.getIn(['QcList',action.addItemType,'List','childList'])
					let oldItem = state.get('addItem')
					const changeQcList = state.get('changeQcList')
					if(action.addItemType == 'Stock'){
						direction = 'debit'
						balanceGroup = 'BALANCE_GROUP_STOCK'
						property = 'stock'
						inventoryNature = oldItem.get('inventoryNature')

						changeQcListItem = changeList.getIn([index,'childList']).push(fromJS({
							uuid:v.uuid,
							name:v.name,
							balanceGroup: balanceGroup,
							property:property,
							inventoryNature,
							direction:direction,
							add:true,
							isDefinite: true,
							creditBeginAmount:0,
							debitBeginAmount:0
						}))

					}else{
						direction = oldItem.get('direction')
						balanceGroup = oldItem.get('balanceGroup')
						property = oldItem.get('property')

						changeQcListItem = changeList.getIn([index,'childList']).push(fromJS({
							uuid:v.uuid,
							name:v.name,
							balanceGroup: balanceGroup,
							property:property,
							inventoryNature: '',
							direction:direction,
							add:true,
							isDefinite: true,
							creditBeginAmount:0,
							debitBeginAmount:0
						}))
					}
					newChangeQcList = changeQcList.push(fromJS({
						uuid:v.uuid,
						name:v.name,
						amount:0,
						operateType:'1',
						balanceGroup:balanceGroup,
						property: property,
						inventoryNature

					}))
					// if(action.addItemType == 'Stock'){
					// 	state = state.setIn(['QcList',action.addItemType,'List','childList'],changeQcListItem)
					// }else{
						state = state.setIn(['QcList',action.addItemType,'List','childList',index,'childList'],changeQcListItem)
					// }
					state = state.set('changeQcList',fromJS(newChangeQcList))
				})

			}

			return state = state.setIn(['flags','selectItem'],fromJS([]))
								.setIn(['flags','balanceShowChild'],fromJS(balanceShowChild))
		}
	}[action.type] || (() => state))()
}
