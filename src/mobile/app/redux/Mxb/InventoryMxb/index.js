import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
//生产环境应当设置为空
const inventoryMxbState = fromJS({
    issuedate: '',
    endissuedate: '',
    baseData:{},
    listData:[],
    beginningData:{},
    stockQuantity:'',

    cardList:[],
    cardValue:'',
    cardName:'',

    stockCategoryList:[],
    stockCategoryValue:{
        key:''
    },
    stockCategorylabel:'',
    topCategoryUuid:'',
    subCategoryUuid:'',

    stockStoreList:[],
    stockStoreValue:'',
    stockStoreLabel:'',

    chooseValue: '',
    inventoryType:'',

    stockStoreListOther:[],
    stockStoreListOtherValue:'',
    stockStoreListOtherLabel:'',

    typeList:[],
    typeListValue:'',
    typeListLabel:'',

    balanceDeirection:'',
    showReverseAmount:false,

    quantityScale: '',
    priceScale: '',
})
export default function handleMxb(state = inventoryMxbState, action) {
    return ({
        [ActionTypes.INIT_INVENTORY_MXB]							 : () => inventoryMxbState,
        [ActionTypes.SET_INVENTORY_MXB_INIT_DATA]:()=>{
            let cardListArr = []
            action.cardList && action.cardList.map((item,index) => {
                cardListArr.push({
                    name: item.sockCardName,
                    uuid: item.stockCardUuid,
                })
            })
            return state.set('issuedate',action.issuedate)
                        .set('endissuedate',action.endissuedate)
                        .set('baseData',action.baseData)
                        .set('beginningData',action.baseData.detailList.length>0?action.baseData.detailList[0]:{})
                        .set('listData', action.baseData.detailList.splice(1,action.baseData.detailList.length))
                        .set('cardList',cardListArr)
                        .set('cardValue',action.uuid)
                        .set('cardName',action.name)
                        .set('stockCategoryList',action.stockCategoryList)
                        .set("topCategoryUuid",action.topCategoryUuid)
                        .set("subCategoryUuid",action.subCategoryUuid)
                        .set('stockCategoryValue',fromJS(action.stockCategoryValue))
                        .set('stockStoreList',action.stockStoreList)
                        .set("stockStoreValue",action.stockStoreList.length>0?action.stockStoreValue:'')
                        .set('stockStoreLabel',action.stockStoreList.length>0?action.stockStoreLabel:'')
                        .set("stockQuantity",action.stockQuantity)
                        .set('chooseValue',action.chooseValue)
                        .set('stockCategorylabel',action.stockCategorylabel)
                        .set('inventoryType',action.inventoryType)
        },
        [ActionTypes.SET_OTHER_TYPE_INVENTORY_MXB_INIT_DATA]:()=>{
            return state.set('issuedate',action.issuedate)
                        .set('endissuedate',action.endissuedate)
                        .set('chooseValue',action.chooseValue)
                        .set("stockStoreListOtherValue",action.stockStoreValue)
                        .set('stockStoreListOtherLabel',action.stockStoreLabel)
                        .set("topCategoryUuid",action.topCategoryUuid)
                        .set("subCategoryUuid",action.subCategoryUuid)
                        .set('stockCategoryValue',fromJS(action.stockCategoryValue))
                        .set('stockCategorylabel',action.stockCategorylabel)
                        .set('cardValue',action.uuid)
                        .set('cardName',action.name)
                        .set('inventoryType',action.inventoryType)
                        .set("typeListValue",action.typeListValue)
                        .set("typeListLabel",action.typeListLabel)
        },
        [ActionTypes.CHANGE_INVENTORY_MXB_CARDLIST]:()=>{
            return state.set('cardValue',action.value)
                        .set('cardName',action.name)
        },
        [ActionTypes.SET_INVENTORY_MXB_DATE]:()=>{
            return state.set('issuedate',action.issuedate)
                        .set('endissuedate',action.endissuedate)
        },
        [ActionTypes.SET_INVENTORY_MXB_STOCK_CARDLIST]:()=>{
            if(!action.cardList.length){
                state = state.set('stockCategoryValue',`${Limit.TREE_JOIN_STR}`)
                            .set('stockCategoryList',[])
            }
            return state.set('cardList',action.cardList)
                        .set('cardValue',action.cardValue)
                        .set('cardName',action.cardName)
        },
        [ActionTypes.SET_INVENTORY_MXB_STOCK_STORE]:()=>{
            return state.set('stockStoreList',action.stockStoreList)
                        .set('stockStoreValue',action.stockStoreValue)
                        .set('stockStoreLabel',action.stockStoreLabel)
        },
        [ActionTypes.SET_INVENTORY_MXB_SELECTED_DATA]:()=>{
            return state.set('baseData',action.baseData)
                        .set('beginningData',action.baseData.detailList.length>0?action.baseData.detailList[0]:{})
                        .set('listData', action.baseData.detailList.splice(1,action.baseData.detailList.length))

        },
        [ActionTypes.CHANGE_INVENTORY_MXB_STOCK_CATEGORY_LIST]:()=>{
            return state.set('stockCategoryValue',fromJS(action.stockCategoryValue))
                        .set("topCategoryUuid",action.topCategoryUuid)
                        .set("subCategoryUuid",action.subCategoryUuid)
        },
        [ActionTypes.CHANGE_INVENTORY_MXB_STOCK_STORE_LIST]:()=>{
            return state.set('stockStoreValue',action.stockStoreValue)
                        .set('stockStoreLabel',action.stockStoreLabel)
        },
        [ActionTypes.HANDLE_INVENTORY_MXB_DATE_CHOOSE_VALUE]:()=>{
            return state.set('chooseValue',action.value)
        },
        [ActionTypes.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST]:()=>{
            return state.set('stockStoreListOther',action.stockStoreListOther)
                        .set('stockStoreListOtherValue',action.stockStoreListOtherValue)
                        .set('stockStoreListOtherLabel',action.stockStoreListOtherLabel)
        },
        [ActionTypes.SET_INVENTORY_MXB_CATEGORY_LIST]:()=>{
            return state.set('stockCategoryList',action.stockCategoryList)
                        .set('stockCategoryValue',fromJS(action.stockCategoryValue))
                        .set('stockCategorylabel',action.stockCategorylabel)
                        .set("topCategoryUuid",action.topCategoryUuid)
                        .set("subCategoryUuid",action.subCategoryUuid)
        },
        [ActionTypes.SET_INVENTORY_MXB_TYPE_LIST]:()=>{
            return state.set('typeList',action.typeList)
                        .set("typeListValue",action.typeListValue)
                        .set('typeListLabel',action.typeListLabel)
        },
        [ActionTypes.SET_INVENTORY_MXB_TYPE]:()=>{
            return state.set('inventoryType',action.value)
        },
        [ActionTypes.SET_INVENTORY_MXB_OTHER_TYPE_STOCK_STORE_VALUE]:()=>{
            return state.set('stockStoreListOtherValue',action.value)
                        .set('stockStoreListOtherLabel',action.label)
        },
        [ActionTypes.SET_INVENTPRY_MXB_TYPE_LIST_VALUE]:()=>{
            return state.set("typeListValue",action.value)
                        .set('typeListLabel',action.label)
        },
        [ActionTypes.SET_INVENTORY_MXB_BALANCE_DIRECTION]:()=>{
            return state.set('balanceDeirection',action.value)
        },
        [ActionTypes.CHANGE_REVERSE_AMOUNT_TYPE]:()=>{
            return state.set("showReverseAmount",action.value)
        },
        [ActionTypes.CHANGE_DECIMAL_OF_CONFIG_MXB]:()=>{
            return state.set('quantityScale',action.receiveData.quantityScale)
                        .set('priceScale',action.receiveData.priceScale)
        }
    }[action.type] || (() => state))()
}
