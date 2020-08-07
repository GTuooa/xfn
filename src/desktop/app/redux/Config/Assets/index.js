import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import * as ActionTypes from './ActionTypes.js'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const assetsState = fromJS({
	flags: {
		assetsChildShow: ['1', '2', '3', '4', '5'],
		assetsClassMode: 'insert',
		assetsCardMode: 'insert',
		classModalShow: false,
		selectAssetsList: [],
		selectLables: [],
		assetsshowMessageMask: false,
		assetsiframeload: false,
		showAssDisableModal: false,
		showAssDisableInfo: [],
		showAssetsCard: false,
		showAssetsCardOption: false,
		assetsCardGetBy: 'number',  //label
		sortByValue: Limit.ASSETS_SORT_BY_VALUE_DESC, // '-1'
		sortByStatus: Limit.ASSETS_SORT_BY_STATUS_DESC   // '-1'
	},
	currentSelectedKeys: ['1'],//当前被选中的卡片
	currentSelectedTitle: '1_固定资产',//当前被选中的卡片
	tabSelectedIndex: "资产类别",
	assetslist:[ //所有的类别和卡片
		// { 
		// 	serialNumber: '1',
		// 	serialName: '固定资产',
		// 	upperAssetsNumber: '',
		// 	checked: false,
		// 	idx: 0
		// }
	],
	cardList:[], // 资产卡片的显示列表
	classification: {
		serialNumber: '',
		serialName: '',
		upperAssetsName: '',
		upperAssetsNumber: '',
		depreciationMethod: '平均年限法',
		totalMonth: '',
		salvage: '',
		assetsAcId: '',
		assetsAcName: '',
		assetsAcAssList: [
			// {
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: ''
			// }
		],
		debitId: '',
		debitName: '',
		debitAssList: [
			// {
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: ''
			// }
		],
		creditId: '',
		creditName: '',
		creditAssList: [
			// {
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: ''
			// }
		],
		remark: ''
	},
	cardTemplate:{
		serialNumber: '',
		oldSerialNumber: '',
		cardNumber: '',
		cardName: '',
		assetsName: '',
		assetsNumber: '',
		classificationName: '',
		classificationNumber: '',
		label: [],// 标签list
		startTime: '',//开始使用期间
		inputPeriod: '',//录入期间
		depreciationMethod: '平均年限法',
		totalMonth: '',
		debitId: '',
		debitName: '',
		debitAssList: [
			// {
			// 	asskey: '',
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: '',
			// }
		],
		creditId: '',
		creditName: '',
		creditAssList: [
			// {
			// 	asskey: '',
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: '',
			// }
		],
		cardValue: '',// 原值
		salvage: '',// 残值率
		residualValue: '',// 预计残值
		monthlyDepreciation: '',// 月折旧
		alreadyDepreciationTime: '',// 已折旧期间
		sumDepreciation: '',// 累计折旧
		earlyNetWorth: '',// 期初
		// 卡片状态：
		// 0:正常使用、
		// 1:清理中
		// 2:已清理
		// 3:折旧完毕
		// 4:已删除
		status: '0',
		remark: '',
		currentCardTime: ''// 本期期间(当前卡片期间)
	},
	cardDetailList: {
		'1': [],
		'2': [],
		'3': [],
		'4': [],
		'5': []
	},
	labelTree:[],
	// cardItemStatus:[{'itemId':i,'status':false,'cardNumber':'cardNumber'},{},{}],
	cardItemStatus:[],
	avtiveItemId:[],//选中的每个列表的cardNumber
	view:{
		cardCheckedAll:false,//资产卡片全选的状态
		deleteModalStatus:false,//资产卡片删除组件的状态
		sortCheckedAll:false,//资产类别全选的状态
		deleteSortModalStatus:false//资产类别删除组件的状态
	},
	// sortList
	sortList:[],
	avtiveSortItemId:[],//选中的每个列表的serialNumber
	// 导入
	assetsimportresponlist : {
		'failJsonList': [],
		'successJsonList': []
	},
	assetsmessage: '',
	importProgressInfo:{
		accessToken :'',
		total:0,
		progress:0,
		message:'',
		successList:[],
		failList:[],
		timestamp:'',
	}
})

export default function handleAssets(state = assetsState, action) {
	return ({
		[ActionTypes.INIT_ASSETS_CONFIG]						         : () => assetsState,

		[ActionTypes.BEFORE_ASSETS_IMPORT]						 : () => {
			state = state.setIn(['flags', 'assetsshowMessageMask'], true)
						 .setIn(['importProgressInfo','progress'], 0)
						 .setIn(['importProgressInfo','message'], '')
						 .setIn(['importProgressInfo','successList'], fromJS([]))
						 .setIn(['importProgressInfo','failList'], fromJS([]))
			return state
		},
		[ActionTypes.CLOSE_ASSETS_IMPORT_CONTENT]				 : () => state.setIn(['flags', 'assetsshowMessageMask'], false).setIn(['flags', 'assetsiframeload'], false).set('assetsimportresponlist', assetsState.get('assetsimportresponlist')).set('assetsmessage', ''),
		[ActionTypes.AFTER_ASSETS_IMPORT]						 : () => {
			state = !action.receivedData.code ?
				state.set('assetsimportresponlist', fromJS(action.receivedData.data)).setIn(['flags', 'assetsiframeload'], true).set('assetsmessage', fromJS(action.receivedData.message)) :
				state.setIn(['flags', 'assetsiframeload'], true).set('assetsmessage', fromJS(action.receivedData.message))

			state = state.setIn(['importProgressInfo','accessToken'],action.receivedData.data.accessToken)
					state.setIn(['importProgressInfo','total'],action.receivedData.data.total)
			return state
		},

		[ActionTypes.GET_ASSESTS_LIST_FETCH] 			  : () => state.set('assetslist', fromJS(action.receivedData)),
		[ActionTypes.GET_ASSESTS_TREE_FETCH] 			  : () => state.set('labelTree', fromJS(action.receivedData)).setIn(['flags', 'selectLables'], fromJS(action.receivedData)),

		[ActionTypes.CHANGE_CARD_REMARK]				  : () => state.setIn(['cardTemplate', 'remark'], action.remark),
		[ActionTypes.CHANGE_CARD_LABLES]				  : () => state.setIn(['cardTemplate', 'label'], fromJS(action.lables)),
		[ActionTypes.ADD_NEW_CARD_LABLE]				  : () => {

			let lables = state.getIn(['flags', 'selectLables'])

			if (lables.every(v => v !== action.newLable)) {
				lables = lables.push(action.newLable)
				state = state.setIn(['flags', 'selectLables'], lables)
				message.info('标签添加成功')
			} else {
				message.info('标签已存在')
			}

			return state
		},
		[ActionTypes.CHANGE_ASSETSCHILDSHOW]			  : () => {
			const assetsChildShow = state.getIn(['flags' ,'assetsChildShow'])
			if (assetsChildShow.indexOf(action.serialNumber) === -1) {
				const newAssetsChildShow = assetsChildShow.push(action.serialNumber)
				return state.setIn(['flags', 'assetsChildShow'], newAssetsChildShow)
			} else {
				const newAssetsChildShow = assetsChildShow.splice(assetsChildShow.findIndex(v => v === action.serialNumber), 1)
				return state.setIn(['flags', 'assetsChildShow'], newAssetsChildShow)
			}
		},
		[ActionTypes.CHANGE_CLASSIFICATION_MODAL_DISPLAY]  : () => state.updateIn(['flags', 'classModalShow'], v => !v),
		[ActionTypes.CHANGE_CLASS_ASSETS_MODE_DISPLAY]	   : () => state.setIn(['flags', 'assetsClassMode'], action.mode),
		[ActionTypes.SELECT_ASSETS_CLASS]			       : () => state.updateIn(['assetslist', action.idx, 'select'], v => !v),
		[ActionTypes.SELECT_ASSETS_CLASS_ALL]			   : () => {
			const assetslist = state.get('assetslist')
			const selectAllStatu = assetslist.some(v => v.get('select') === false)
			return state.set('classification', assetslist.forEach(v => v.set('select', selectAllStatu)))
		},
		// 新增、修改类别
		[ActionTypes.CLEAR_CLASSIFICATION]					  : () => state.set('classification', assetsState.get('classification')),

		[ActionTypes.BEFORE_INSERT_CLASSIFICATION]			  : () => {

			const assetslist = state.get('assetslist')
			const upperItem = assetslist.find(v => v.get('serialNumber') === action.serialNumber)
			const sameUpperClassList = assetslist.filter(v => v.get('serialNumber').length === 3 && v.get('serialNumber').indexOf(action.serialNumber) === 0)

			let newSerialNumber = action.newSerialNumber

			if (!newSerialNumber)
				newSerialNumber = sameUpperClassList.size ? `${1 + Number(sameUpperClassList.getIn([-1, 'serialNumber']))}` : `${action.serialNumber}01`

			return state.set('classification', fromJS(action.receivedData))
						.setIn(['classification', 'upperAssetsName'], action.serialName)
						.setIn(['classification', 'upperAssetsNumber'], action.serialNumber)
						.setIn(['classification', 'serialNumber'], newSerialNumber)
						.setIn(['classification', 'remark'], '')
						.setIn(['classification', 'serialName'], '')
		},
		[ActionTypes.BEFORE_MODYFY_CLASSIFICATION]			  : () => state.set('classification', fromJS(action.receivedData)),

		[ActionTypes.CHANGE_ASSETS_CLASS_NUMBER]			  : () => {
			const assetslist = state.get('assetslist')
			const id = action.id
			const upperAssetsNumber = action.upperAssetsNumber

			const re = eval("/^" + upperAssetsNumber + "[0-9]*$/g")

			if (re.test(id) && id.length <= 3) {
				const upperClass = id === '' ? fromJS({}) : assetslist.find(v => v.get('serialNumber') == id.substr(0, 1))
				state = state.setIn(['classification', 'serialNumber'], id).setIn(['classification', 'upperAssetsNumber'], upperClass ? upperClass.get('serialNumber') : '').setIn(['classification', 'upperAssetsName'], upperClass ? upperClass.get('serialName') : '')
			}
			return state
		},
		[ActionTypes.CHANGE_ASSETS_CLASS_NAME]			  : () => state.setIn(['classification', 'serialName'], action.name),
		[ActionTypes.CHANGE_ASSETS_CLASS_REMARK]		  : () => state.setIn(['classification', 'remark'], action.value),
		[ActionTypes.CHANGE_ASSETS_CLASS_TOTALMONTH]	  : () => {
			const re = eval("/^[0-9]*$/g")

			const month = action.month

			if (re.test(month)) {
				return state.setIn(['classification', 'totalMonth'], month)
			} else {
				return state
			}
		},
		[ActionTypes.CHANGE_ASSETS_CLASSS_ALVAGE]	   : () => {
			const re = eval("/^[0-9]*$/g")

			const value = action.value

			if (re.test(value) && value < 100) {
				return state.setIn(['classification', 'salvage'], value)
			} else {
				return state
			}
		},
		[ActionTypes.SELECT_ASSETS_AC]					: () => {
			const acid = action.acid
			const acname = action.acname
			const asscategorylist = action.asscategorylist
			const classOrCard = action.classOrCard
			const dirction = action.dirction

			if (acid) {
				state = state.setIn([classOrCard, `${dirction}Id`], acid).setIn([classOrCard, `${dirction}Name`], acname)
				if (asscategorylist.size) {
					return state.setIn([classOrCard, `${dirction}AssList`], fromJS(asscategorylist.map(v => {return fromJS({'assCategory': v})})))
				} else {
					return state.updateIn([classOrCard, `${dirction}AssList`], v => v.clear())
				}
			} else {
				state = state.setIn([classOrCard, `${dirction}Id`], '').setIn([classOrCard, `${dirction}Name`], '')
				return state.updateIn([classOrCard, `${dirction}AssList`], v => v.clear())
			}
		},
		[ActionTypes.SELECT_ASSETS_ASS] 				 : () => {
			const assid = action.assid
			const assname = action.assname
			const classOrCard = action.classOrCard
			const dirction = action.dirction

			return state.setIn([classOrCard, `${dirction}AssList`, action.idx, 'assId'], assid).setIn([classOrCard, `${dirction}AssList`, action.idx, 'assName'], assname)
		},


		// card
		[ActionTypes.GET_CARD_DETAIL_FETCH]				  : () => {
			return state.set('cardTemplate', fromJS(action.receivedData))
						.setIn(['flags', 'assetsCardMode'], 'modify')
						.setIn(['cardTemplate', 'oldCardNumber'], action.receivedData.cardNumber)
		},
		// 编辑card
		[ActionTypes.GET_CARDNUMBER_FETCH]				  : () => state.set('cardTemplate', assetsState.get('cardTemplate').set('cardNumber', action.receivedData).set('inputPeriod', action.inputPeriod)).setIn(['flags', 'assetsCardMode'], 'insert'),
		[ActionTypes.CHANGE_CARD_CARDNAME]				: () => state.setIn(['cardTemplate', 'cardName'], action.value),
		[ActionTypes.CHANGE_CARD_CARDNUMBER]			: () => state.setIn(['cardTemplate', 'cardNumber'], action.value),
		[ActionTypes.SELECT_CARD_ASSETS_OR_CLASS]				: () => {

			const value = action.value.split(' ')

			if (action.assetsCardMode ===  'modify') {
				if (action.choseType == 'assets') {
					state = state.setIn(['cardTemplate', 'assetsNumber'], value[0])
								.setIn(['cardTemplate', 'assetsName'], value[1])
								.setIn(['cardTemplate', 'classificationNumber'], '')
								.setIn(['cardTemplate', 'classificationName'], '')
								.setIn(['cardTemplate', 'serialNumber'], `${value[0]}00`)

				} else if (action.choseType == 'class') {
					state = state.setIn(['cardTemplate', 'classificationNumber'], value[0])
								.setIn(['cardTemplate', 'classificationName'], value[1])
								.setIn(['cardTemplate', 'serialNumber'], `${value[0]}`)
				}
			} else {
				if (action.choseType == 'assets') {
					state = state.setIn(['cardTemplate', 'assetsNumber'], value[0])
								.setIn(['cardTemplate', 'assetsName'], value[1])
								.setIn(['cardTemplate', 'classificationNumber'], '')
								.setIn(['cardTemplate', 'classificationName'], '')
								.setIn(['cardTemplate', 'serialNumber'], `${value[0]}00`)

				} else if (action.choseType == 'class') {
					state = state.setIn(['cardTemplate', 'classificationNumber'], value[0])
								.setIn(['cardTemplate', 'classificationName'], value[1])
								.setIn(['cardTemplate', 'serialNumber'], `${value[0]}`)
				}

				state = state.setIn(['cardTemplate', 'creditId'], action.creditId ? action.creditId : '')
							.setIn(['cardTemplate', 'creditName'], action.creditName ? action.creditName : '')
							.setIn(['cardTemplate', 'creditAssList'], action.creditAssList ? fromJS(action.creditAssList) : fromJS([]))
							.setIn(['cardTemplate', 'debitId'], action.debitId ? action.debitId : '')
							.setIn(['cardTemplate', 'debitName'], action.debitName ? action.debitName : '')
							.setIn(['cardTemplate', 'debitAssList'], action.debitAssList ? fromJS(action.debitAssList) : fromJS([]))
							.setIn(['cardTemplate', 'totalMonth'], action.totalMonth ? action.totalMonth : '')
							.setIn(['cardTemplate', 'salvage'], action.salvage ? action.salvage : '')
			}
			return state
		},
		[ActionTypes.CHANGE_CARD_STARTTIME]				: () => {

			const valueDate = action.value._d

			const year = `${valueDate.getFullYear()}`
			const month = `${valueDate.getMonth() > 8 ? valueDate.getMonth() + 1 : '0' + (valueDate.getMonth() + 1)}`
			const day = `${valueDate.getDate() >= 10 ? valueDate.getDate() : '0' + valueDate.getDate()}`
			const date = `${year}/${month}/${day}`

			const issuedateyear = action.inputPeriod.substr(0,4)
			const issuedatemonth = action.inputPeriod.substr(6,2)

			if (year > issuedateyear || (year === issuedateyear && month > issuedatemonth)) {
				thirdParty.Alert('日期不合法，不能超过录入日期')
				return state
			} else {
				return state.setIn(['cardTemplate', 'startTime'], date)
			}

			// const year = action.value.getFullYear()
			// const month = action.value.getMonth() + 1
			// const day = action.value.getDate()
			// return state.setIn(['cardTemplate', 'startTime'], `${year}-${month > 10 ? month : '0' + month}-${day > 10 ? day : '0' + day}`)
		},
		[ActionTypes.CHANGE_CARD_TOTALMONTH] 			: () => {
			const re = eval("/^[0-9]*$/g")

			const value = action.value

			if (re.test(value)) {
				return state.setIn(['cardTemplate', 'totalMonth'], value)
			} else {
				return state
			}

		},
		[ActionTypes.CHANGE_CARD_CARDVALUE]       : () => {
			const re = eval("/^\.?\d{0,2}$/g")

			const value = action.value

			if (/^[\d]\d*\.?\d{0,2}$/g.test(value) || value == '') {
				return state.setIn(['cardTemplate', 'cardValue'], value)
			} else {
				return state
			}
		},
		[ActionTypes.CHANGE_CARD_SALVAGE]       : () =>  {
			const re = eval("/^[0-9]*$/g")

			const value = action.value

			if (re.test(value) && value.length < 3) {
				return state.setIn(['cardTemplate', 'salvage'], value)
			} else {
				return state
			}
		},
		[ActionTypes.BEFORE_ENTER_CARD] 								: () => state.setIn(['cardTemplate', 'residualValue'], action.residualValue)
																					.setIn(['cardTemplate', 'monthlyDepreciation'], action.monthlyDepreciation)
																					.setIn(['cardTemplate', 'alreadyDepreciationTime'], action.alreadyDepreciationTime)
																					.setIn(['cardTemplate', 'sumDepreciation'], action.sumDepreciation)
																					.setIn(['cardTemplate', 'earlyNetWorth'], action.earlyNetWorth),
		[ActionTypes.CHANGE_CARD_STATUS]								: () => {
			if (action.status === '0') {
				state = state.setIn(['cardTemplate', 'clearCardMonth'], '0')
							.setIn(['cardTemplate', 'clearCardYear'], '0')
			} else if (action.status === '1')  {
				state = state.setIn(['cardTemplate', 'clearCardMonth'], action.openedmonth)
							.setIn(['cardTemplate', 'clearCardYear'], action.openedyear)
			}
			return state = state.setIn(['cardTemplate', 'status'], action.status)
		},
		/*********************************卡片列表**********************************************************/
		[ActionTypes.GET_CARD_LIST_FETCH]								: () => {//通过分类获取卡片列表
			state = state.set('cardList',fromJS(action.receivedData))
						.setIn(['flags', 'assetsCardGetBy'], action.assetsCardGetBy)
						.setIn(['flags', 'sortByValue'], action.sortByValue)
						.setIn(['flags', 'sortByStatus'], action.sortByStatus)

			let cardItemStatus=[];//每一条数据的一些状态
			state.get('cardList').map((v,i)=>{
                //把每一条的数据存入cardItemStatus中包括itemId，status都为false，cardNumber
                cardItemStatus.push({'itemId':i,'status':false,'cardNumber':v.get('cardNumber')})
			})
			state = state.set('cardItemStatus', fromJS(cardItemStatus))
			.setIn(['currentSelectedKeys',0], action.number)
			.set('avtiveItemId', fromJS([]))
			.setIn(['view', 'cardCheckedAll'], false)
			// state.get('assetslist').map(v=>{
			// 	if(v.get('serialNumber')==action.number){
			// 		state=state.set('currentSelectedTitle',v.get('serialNumber')+'_'+v.get('serialName'))
			// 	}
			// })

			if(isNaN(action.number)){//搜索框的值
				state=state.set('currentSelectedTitle',action.number)
			}else{
				state.get('assetslist').map(v=>{
					if(v.get('serialNumber')==action.number){
						state=state.set('currentSelectedTitle',v.get('serialNumber')+'_'+v.get('serialName'))
					}
				})
			}
			return state;
		},
		[ActionTypes.CHANGE_TAB_SELECTED_INDEX]								: () => {

			if (action.value === '资产卡片') {
				state = state.set('avtiveSortItemId', fromJS([]))
			} else if (action.value === '资产类别') {
				state = state.set('avtiveItemId', fromJS([]))
			}

			return state.set('tabSelectedIndex', action.value).setIn(['flags', 'sortByStatus'], Limit.ASSETS_SORT_BY_STATUS_DESC).setIn(['flags', 'sortByValue'], '')
		},
		[ActionTypes.SELECT_ONE_CARD_BUTTON]								: () => {//单击卡片列表的选框
			// 单击单个按钮后当前状态取反
            state.get('cardItemStatus').map((v,i) => {
                if(v.get('itemId') == action.itemid){
                    state = state.setIn(['cardItemStatus', action.itemid, 'status'], !state.getIn(['cardItemStatus', action.itemid, 'status']))
                }
            })
			//只要cardItemStatus中的状态有假，就返回false（可见状态）来改变cardCheckedAll的状态
            state = state.setIn(['view', 'cardCheckedAll'], state.get('cardItemStatus').every(v => v.get("status")) || state.get('cardItemStatus').length)
			//获取选中的每个item的状态的数据的ID
			let avtiveItemId=[];
			state.get('cardItemStatus').map((v,i)=>{
				if(v.get('status')){
					avtiveItemId.push(v.get("cardNumber"));
				}
			})
			state = state.set('avtiveItemId', fromJS(avtiveItemId))
			return state;
		},
		[ActionTypes.SELECT_ALL_CARD_BUTTON]								: () => {//单击卡片列表的全选框
			// 单击单个按钮后当前状态取反

            state = state.setIn(['view','cardCheckedAll'], !state.getIn(['view','cardCheckedAll']))
			//改变每条数据的状态
			state.get('cardItemStatus').map((v,i)=>{
				state = state.setIn(['cardItemStatus', i, 'status'], state.getIn(['view', 'cardCheckedAll']))
			})
			//获取的每个item的状态的数据的ID
			let avtiveItemId = [];
			state.get('cardItemStatus').map((v,i) => {
				if(v.get('status')){
					avtiveItemId.push(v.get("cardNumber"));
				}
			})
			state = state.set('avtiveItemId', fromJS(avtiveItemId))
			return state;
		},
		[ActionTypes.SHOW_DELETE_MODAL]								: () => state.setIn(['view','deleteModalStatus'],true),
		[ActionTypes.CLOSE_DELETE_MODAL]							: () => state.setIn(['view','deleteModalStatus'],false),
		[ActionTypes.DELETE_CARD]								    : () => state.setIn(['view','deleteModalStatus'],false).setIn(['view', 'cardCheckedAll'], false),//删除卡片

/***********************************＊＊＊＊＊＊＊＊＊＊＊＊＊资产类别的处理＊＊＊＊＊***********************************/
		[ActionTypes.GET_SORT_LIST_FETCH] 			  : () => {//资产类别的初始数据
			state = state.set('sortList', fromJS(action.receivedData))
			let sortItemStatus=[];//每一条数据的一些状态
			state.get('sortList').map((v,i)=>{
                //把每一条的数据存入cardItemStatus中包括itemId，status都为false，cardNumber
                sortItemStatus.push({'itemId':i,'status':false,'serialNumber':v.get('serialNumber')})
			})
			state = state.set('sortItemStatus',fromJS(sortItemStatus))
			return state;
		},
		[ActionTypes.SELECT_ALL_SORT_BUTTON]								: () => {//单击资产列表的全选框
			// 单击单个按钮后当前状态取反
             state=state.setIn(['view','sortCheckedAll'],!state.getIn(['view','sortCheckedAll']))
			//改变每条数据的状态
			state.get('sortItemStatus').map((v,i)=>{
				if(v.get("serialNumber").length > 1){//父类是不允许被选中的（1，2，3，4，5）
					state=state.setIn(['sortItemStatus',i,'status'],state.getIn(['view','sortCheckedAll']))
				}
			})
			//获取的每个item的状态的数据的ID
			let avtiveSortItemId=[];
			state.get('sortItemStatus').map((v,i)=>{
				if(v.get('status')){
					avtiveSortItemId.push(v.get("serialNumber"));
				}
			})
			state=state.set('avtiveSortItemId',fromJS(avtiveSortItemId))

			return state;
		},
		[ActionTypes.SELECT_ONE_SORT_BUTTON]								: () => {//单击卡片列表的选框
			// 单击单个按钮后当前状态取反
			//console.log(action.itemid)
             state.get('sortItemStatus').map((v,i)=>{
                 if(v.get('itemId') == action.itemid && v.get("serialNumber").length > 1){//父类是不允许被选中的（1，2，3，4，5）
                      state = state.setIn(['sortItemStatus',action.itemid,'status'],!state.getIn(['sortItemStatus',action.itemid,'status']))
                 }
             })
			//只要cardItemStatus中的状态有假，就返回false（可见状态）来改变cardCheckedAll的状态
              state = state.setIn(['view','sortCheckedAll'],state.get('sortItemStatus').every(v=>v.get("status")))
			//获取选中的每个item的状态的数据的ID
			let avtiveSortItemId = [];
			state.get('sortItemStatus').map((v,i)=>{
				if(v.get('status')){
					avtiveSortItemId.push(v.get("serialNumber"));
				}
			})
			state = state.set('avtiveSortItemId',fromJS(avtiveSortItemId))
			return state;
		},
		//显示delete组件
		[ActionTypes.SHOW_DELETE_SORT_MODAL]								: () => state.setIn(['view','deleteSortModalStatus'],true),
		//关闭delete组件
		[ActionTypes.CLOSE_DELETE_SORT_MODAL]								: () => state.setIn(['view','deleteSortModalStatus'],false),
		[ActionTypes.DELETE_SORT]								            : () => state.setIn(['view','deleteSortModalStatus'],false),
		//辅助核算禁用提示信息
		[ActionTypes.SHOW_ASS_DISABLE_MODAL]								: () => state.setIn(['flags', 'showAssDisableModal'], true).setIn(['flags', 'showAssDisableInfo'], fromJS([action.asscategory+'中所有的核算项目为禁用状态，您可以：', '1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；', '2、在当前页面，“新增”新的核算项目'])),
		[ActionTypes.CANCEL_ASS_DISABLE_MODAL]								: () => state.setIn(['flags', 'showAssDisableModal'], false).setIn(['flags', 'showAssDisableInfo'], fromJS([])),
		[ActionTypes.SHOW_ASSETS_CARD]								        : () => state.setIn(['flags','showAssetsCard'], action.bool),
		[ActionTypes.SHOW_ASSETS_CARD_OPTION]								: () => state.setIn(['flags','showAssetsCardOption'], action.bool),
		[ActionTypes.GET_ASSETS_IMPORT_PROGRESS]	             : () => {
			state = state.setIn(['importProgressInfo','message'],action.receivedData.message)
						 .setIn(['importProgressInfo','progress'],action.receivedData.data.progress)
						 .setIn(['importProgressInfo','successList'],fromJS(action.receivedData.data.successList))
						 .setIn(['importProgressInfo','failList'],fromJS(action.receivedData.data.failList))
						 .setIn(['importProgressInfo','timestamp'],fromJS(action.receivedData.data.timestamp))
			return state
		},
		[ActionTypes.CHANGE_ASSETS_MESSAGEMASK]				     : () => state.setIn(['flags','assetsshowMessageMask'], false),
	}[action.type] || (() => state))()
}
