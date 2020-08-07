import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
const inventoryMxbState=fromJS({
    chooseperiods: false,
    issuedate:'',
    endissuedate:'',
    chooseValue:'MONTH',

    cardList:[],
    cardValue:"",

    dataList:[],
    balanceData:{},
    categoryList:[],
    categoryValue:"全部",
    topCategoryUuid:"",
    subCategoryUuid:"",

    stockStoreList:[],
    stockStoreValue:'',
    stockStoreLabel:"",

    jrAbstract:"",

    inventoryType:'Inventory',
    typeList:[],
    typeListValue:'全部',

    otherTypeStockStoreList:[],
    otherTypeStockStoreValue:'',
    allBalanceDirection: "debit",
    balanceChanged:false,

    quantityScale: '',
    priceScale: '',

    showAssist: false,
    showBatch: false,
    modalName: '',

    stockCardMessage:{
        stockCardUuid:'',
        openAssist: false,
        openBatch: false,
        openSerial: false,
        openShelfLife: false,
        sockCardName: "",
    },

    // 筛选批次
    batchList: [],
    chooseBatchCard:[],
    curSelectBatchUuid: [],

    // 筛选属性
    assistList: [],
    curSelectAssistUuid:[],
    chooseAssistCard: [],

    serialList:[],
    serialFollow:{},
    showSerialDrawer: false,
    chooseSerialUuid:'',

    // 分页
    detailCurrentPage: 1,
    detailPages: 1,
    cardPages: 1,
    cardPageNum: 1,

})

export default function handleInventoryMxbState(state = inventoryMxbState, action) {
    return({
        [ActionTypes.INIT_INVENTORY_MXB]:()=>inventoryMxbState,
        [ActionTypes.SET_INVENTORY_MXB_INIT_DATA]:()=>{
            return state.set("issuedate",action.issuedate)
                        .set("endissuedate",action.endissuedate)
                        .set("cardList",action.cardList)
                        .set("dataList",action.dataList)
                        .set("balanceData",action.balanceData)
                        .set('cardValue',action.cardValue)
                        .set('cardPageNum',action.cardPageNum)
                        .set('cardPages',action.cardPages)
                        .set('detailCurrentPage',action.detailCurrentPage)
                        .set('detailPages',action.detailPages)
        },
        [ActionTypes.SET_INVENTORY_MXB_CATEGORY_LIST]:()=>{
            return state.set('categoryList',action.data)
                        .set("categoryValue",'全部')
                        .set('topCategoryUuid','')
                        .set('subCategoryUuid','')
                        .set('issuedate',action.issuedate)
                        .set('endissuedate',action.endissuedate)
        },
        [ActionTypes.SET_INVENTORY_MXB_DATE]:()=>{
            return state.set("issuedate",action.issuedate).set('endissuedate',action.endissuedate)
        },
        [ActionTypes.CHANGE_INVENTORY_MXB_CHOOSE_MORE_PERIODS]:() => state.update('chooseperiods', v => !v),
        [ActionTypes.SET_INVENTORY_MXB_CARD_VALUE] :()=>{
            return state.set('cardValue',action.value.stockCardUuid)
                        .set('stockCardMessage',fromJS(action.value))
        },
        [ActionTypes.SET_INVENTORY_MXB_STOCK_STORE] :()=>{
            if(action.data.length>0){
                return state.set('stockStoreList',action.data).set('stockStoreValue',action.data[0].uuid).set('stockStoreLabel',action.data[0].name)
            }else{
                return state.set('stockStoreList',action.data).set('stockStoreValue','').set('stockStoreLabel','')
            }

        },
        [ActionTypes.SET_INVENTORY_MXB_STOCK_STORE_VALUE]:()=>{
            return state.set('stockStoreValue',action.value).set('stockStoreLabel',action.name)
        },
        [ActionTypes.SET_INVENTORY_MXB_CATEGORY_VALUE]:()=>{
            return state.set("categoryValue",action.value)
                        .set('topCategoryUuid',action.topCategoryUuid)
                        .set('subCategoryUuid',action.subCategoryUuid)
        },
        [ActionTypes.SET_INVENTORY_MXB_CARD_LIST]:()=>{
            let arr=[]
            for(let i in action.cardList){
                arr.push(action.cardList[i].stockCardUuid)
            }
            if(action.cardList.length){
                state = state.set('cardPageNum',action.cardPageNum)
                            .set('cardPages',action.cardPages)
                if(arr.includes(state.get('cardValue'))){
                    return state.set("cardList",action.cardList)
                }else{
                    return state.set("cardList",action.cardList)
                                .set('cardValue',action.cardList.length > 1 ? (action.cardList[0].stockCardUuid ? action.cardList[0].stockCardUuid : action.cardList[1].stockCardUuid) : '')
                                .set('chooseBatchCard', fromJS([]))
                                .set('chooseAssistCard', fromJS([]))
                                .set('showAssist', false)
                                .set('showBatch', false)
                                .set('stockCardMessage',fromJS(action.cardList.length > 1 ? (action.cardList[0].stockCardUuid ? action.cardList[0] : action.cardList[1]) : fromJS({
                                    stockCardUuid:'',
                                    openAssist: false,
                                    openBatch: false,
                                    openSerial: false,
                                    openShelfLife: false,
                                    sockCardName: "",
                                })))
                }
            }else{
                return state.set("cardList",action.cardList)
                            .set('cardValue','')
                            .set('chooseBatchCard', fromJS([]))
                            .set('chooseAssistCard', fromJS([]))
                            .set('showAssist', false)
                            .set('showBatch', false)
                            .set('stockCardMessage',fromJS({
                                stockCardUuid:'',
                                openAssist: false,
                                openBatch: false,
                                openSerial: false,
                                openShelfLife: false,
                                sockCardName: "",
                            }))
                            .set('cardPageNum',1)
                            .set('cardPages',1)
            }

        },
        [ActionTypes.SET_INVENTORY_MXB_DATA]:()=>{
            return state.set('dataList',action.dataList)
                        .set('balanceData',action.balanceData)
                        .set('detailCurrentPage',action.detailCurrentPage)
                        .set('detailPages',action.detailPages)
        },
        [ActionTypes.REFRESH_INVENTORY_MXB]:()=>{
            return state.set("dataList",action.dataList)
                        .set("balanceData",action.balanceData)
                        .set('detailCurrentPage',action.detailCurrentPage)
                        .set('detailPages',action.detailPages)
        },
        [ActionTypes.REFRESH_INVENORT_MXB_STOCK_STORE]:()=>{
            return state.set('stockStoreList',action.data)
        },
        [ActionTypes.REFRESH_INVENTORY_MXB_CARD_LIST]:()=>{
            return state.set("cardList",action.cardList)
                        .set('cardValue',action.cardValue)
                        .set('stockCardMessage',fromJS(action.stockCardMessage))
                        .set('cardPageNum',action.cardPageNum)
                        .set('cardPages',action.cardPages)
        },
        [ActionTypes.GET_INVENTORY_MXB_FROM_YEB]:()=>{
            return state.set("issuedate",action.issuedate)
                        .set("endissuedate",action.endissuedate)
                        .set("cardList",action.cardList)
                        .set("dataList",action.dataList)
                        .set("balanceData",action.balanceData)
                        .set('cardValue',action.cardValue)
                        .set("stockStoreList",action.stockStoreList)
                        .set('stockStoreValue',action.stockStoreValue)
                        .set('stockStoreLabel',action.stockStoreLabel)
                        .set('topCategoryUuid',action.topCategoryUuid)
                        .set('subCategoryUuid',action.subCategoryUuid)
                        .set('categoryValue',action.categoryValue)
                        .set('chooseValue',action.chooseValue)
                        .set('chooseValue',action.chooseValue)
                        .set('cardPageNum',action.cardPageNum)
                        .set('cardPages',action.cardPages)
                        .set('detailCurrentPage',action.detailCurrentPage)
                        .set('detailPages',action.detailPages)
        },
        [ActionTypes.SET_INVENTORY_MXB_CATEGORY]:()=>{
            return state.set('categoryList',action.data)
                        .set("categoryValue",'全部')
                        .set('topCategoryUuid','')
                        .set('subCategoryUuid','')
        },
        [ActionTypes.CHANGE_INVENTORY_MXB_JR_ABSTRACT]:()=>{
            return state.set('jrAbstract',action.value)
        },
        [ActionTypes.HANDLE_INVENTORY_MXB_CHOOSE_STATUS]:()=>{
            return state.set('chooseValue',action.value)
        },
        [ActionTypes.SET_INVENTORY_MXB_CATEGORY_REFRESH]:()=>{
            return state.set('categoryList',action.data)
                        .set("categoryValue",action.categoryValue)
                        .set('topCategoryUuid',action.topCategoryUuid)
                        .set('subCategoryUuid',action.subCategoryUuid)
        },
        [ActionTypes.CHANGE_INVENTORY_MXB_TYPE]:()=>{
            return state.set("inventoryType",action.value)
        },
        [ActionTypes.SET_OTHER_TYPE_MXB_INIT_DATA]:()=>{
            return state.set('typeListValue',action.typeListValue)
                        .set('otherTypeStockStoreValue',action.otherTypeStockStoreValue)
                        .set('categoryValue',action.categoryValue)
                        .set('cardValue',action.cardValue)
                        .set('topCategoryUuid',action.topCategoryUuid)
                        .set('subCategoryUuid',action.subCategoryUuid)
                        .set('chooseValue',action.chooseValue)
        },
        [ActionTypes.SET_OTHER_TYPE_STOCK_STORE_LIST]:()=>{
            return state.set('otherTypeStockStoreList',action.list)
                        .set('otherTypeStockStoreValue',action.value)
        },
        [ActionTypes.SET_OTHER_TYPE_MXB_STOCK_TYPE_LIST]:()=>{
            return state.set('typeListValue',action.typeListValue)
                        .set('typeList',action.list)
        },
        [ActionTypes.SET_OTHER_TYPE_MXB_STOCK_TYPE_LIST_VALUE]:()=>{
            return state.set('typeListValue',action.value)
        },
        [ActionTypes.SET_OTHER_TYPE_MXB_STOCK_STORE_VALUE]:()=>{
            return state.set('otherTypeStockStoreValue',action.value)
        },
        [ActionTypes.SET_OTHER_TYPE_MXB_BALANCE_DIRECTION]:()=>{
            return state.set('allBalanceDirection',action.value)
                        .set('balanceChanged',action.changed)
        },
        [ActionTypes.CHANGE_DECIMAL_OF_CONFIG_MXB]:()=>{
            return state.set('quantityScale',action.receiveData.quantityScale)
                        .set('priceScale',action.receiveData.priceScale)
        },
        [ActionTypes.INVENTORY_MXB_CHANGE_COMMON_VALUE]               : () => {
			return state.set(action.name, action.value)
		},
        [ActionTypes.GET_INVENTORY_MXB_BATCH_LIST]               : () => {
            const list = action.receiveData
            let batchList = []
            list && list.length && list.map(item => {
                batchList.push({
                    uuid: item.batchUuid,
                    code: item.batch,
                    name: item.expirationDate ? `(${item.expirationDate})` : ''
                })
            })
			return state = state.set('batchList', fromJS(batchList))
		},
        [ActionTypes.GET_INVENTORY_MXB_ASSIST_LIST]               : () => {
			return state = state.set('assistList', fromJS(action.receiveData))
		},
        [ActionTypes.INVENTORY_MXB_CHANGE_ITEM_CHECKBOX_CHECKED]               : () => {
                const showLowerList = state.get(action.curSelectUuidName)
                let newShowLowerList = showLowerList
                if(action.isAll){
                    action.allList.map((v,index) => {
                        if (!action.checked) {
                            newShowLowerList = newShowLowerList.indexOf(v.get('uuid')) === -1 ? newShowLowerList.push(v.get('uuid')) : newShowLowerList
                        } else {
                            newShowLowerList = newShowLowerList.splice(newShowLowerList.findIndex(k => k === v.get('uuid')), 1)
                        }
                    })
                    return state = state.set(action.curSelectUuidName, newShowLowerList)
                }else{
                    if (!action.checked) {
                        newShowLowerList = newShowLowerList.indexOf(action.uuid) === -1 ? showLowerList.push(action.uuid) : showLowerList
                    } else {
                        newShowLowerList = newShowLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                    }
                    return state.set(action.curSelectUuidName, newShowLowerList)
                }


        },
        [ActionTypes.INVENTORY_MXB_FILTER_CARD_CLEAR]         : () => {

			state = state.set('chooseBatchCard', fromJS([]))
						.set('chooseAssistCard', fromJS([]))

			return state
		},
        [ActionTypes.CHANGE_INVENTORY_MXB_CARD_VALUE]                             : () => {
			state = state.set('showAssist', false)
						.set('showBatch', false)
						.set('chooseBatchCard', fromJS([]))
						.set('chooseAssistCard', fromJS([]))
			return state
		},

        [ActionTypes.CHANGE_INVENTORY_COMMON_VALUE]       : () => {
            state = state.setIn([...action.place], action.value.toJS())
            // console.log(action.place);
            return state
        },
        [ActionTypes.CHANGE_INVENTORY_DETAIL_PAGES_VALUE]         : () => {
			state = state.set('detailCurrentPage', action.value)

			return state
		},
    }[action.type] || (() => state))()
}
