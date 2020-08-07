import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const inventoryYebState = fromJS({
    isShow:false,
    choosePeriods:false,
    chooseValue:'MONTH',
    inventoryData:[],
    baseData:{},
    issuedate:"",
    endissuedate:'',
    quantityList:[],
    stockQuantity:'',

    categoryList:[],
    topCategoryUuid:'',
    subCategoryUuid:'',
    categoryValue:"全部",

    stockStoreList:[],
    storeCardUuid:"",
    showChildList:[],

    inventoryType:'Inventory',
    typeList:[],
    typeListValue:'全部',

    quantityScale: '',
    priceScale: '',
})
export default function handleRelativeYeb(state = inventoryYebState, action) {
    return ({
        [ActionTypes.INIT_INVENTORY_YEB]:()=> inventoryYebState,
        [ActionTypes.CHANGE_INVENTORY_SHOW]:()=> state.update('isShow', v => !v),
        [ActionTypes.CHANGE_INVENTORY_CHOOSE_PERIDOS]:()=> state.update('choosePeriods', v => !v),
        [ActionTypes.SET_INVENTORY_YEB_DATE]:()=>{
            return state.set("issuedate",action.issuedate)
                        .set('endissuedate',action.endissuedate)
        },
        [ActionTypes.SET_INVENTORY_YEB_INIT_DATA]:()=>{
            return state.set("issuedate",action.issuedate)
                        .set('endissuedate',action.endissuedate)
                        .set("inventoryData",action.data.childList)
                        .set("baseData",action.data)
        },
        [ActionTypes.SET_INVENTORY_YEB_DATA]:()=>{
            return state.set("inventoryData",action.data.childList)
                        .set("baseData",action.data)
        },
        [ActionTypes.SET_INVENTURY_QUANTITY_LIST] :()=>{
            return state.set("quantityList",action.data).set('stockQuantity',action.stockQuantity)
        },
        [ActionTypes.SET_INIT_STOCK_CATEGORY_LIST]:()=>{
            return state.set('categoryList',action.data)
        },
        [ActionTypes.SET_INVENTORY_CATEGORY_LIST]:()=>{
            return state.set('categoryList',action.data)
                        .set('categoryValue',action.categoryValue)
                        .set('topCategoryUuid',action.topCategoryUuid)
                        .set('subCategoryUuid',action.subCategoryUuid)
        },
        [ActionTypes.SET_INVENTORY_STORE_TREE]:()=>{
                return state.set('stockStoreList',action.data).set('storeCardUuid',action.storeCardUuid)
        },
        [ActionTypes.SET_INVENTORY_STOCK_QUANTITY]:()=>{
            return state.set('stockQuantity',action.value)
        },
        [ActionTypes.SET_INVENTORY_STORE_CARD_UUID]:()=>{
            return state.set('storeCardUuid',action.value)
        },
        [ActionTypes.SET_INVENTORY_CATEGORY_UUID] :()=>{
            return state.set('topCategoryUuid',action.topCategoryUuid).set('subCategoryUuid',action.subCategoryUuid)
        },
        [ActionTypes.SET_INVENTORY_VALUE] :()=>{
            return state.set('categoryValue',action.value)
        },
        [ActionTypes.SET_INVENTORY_YEB_SHOW_CHILD_LIST]:()=>{
            let showChildList = state.get('showChildList')
            let newShowChildList
            if(showChildList.includes(action.uuid)){
                let index =showChildList.findIndex((value,index)=>{
					return value === action.uuid
				})
                newShowChildList = showChildList.splice(index,1)
            }else{
                if(action.totalNumber > Limit.YEB_EXPAND_MAX_NUMBER){
                    newShowChildList = fromJS(action.parentUuid)
                }else{
                    newShowChildList=showChildList.concat(action.uuid)
                }

            }
            return state.set('showChildList',newShowChildList)
        },
        [ActionTypes.HANDLE_INVENTORY_YEB_CHOOSE_STATUS]:()=>{
            return state.set('chooseValue',action.value)
        },
        [ActionTypes.CHANGE_INVENTORY_YEB_TYPE]:()=>{
            return state.set('inventoryType',action.value)
        },
        [ActionTypes.SET_INVENTORY_YEB_TYPE_LIST]:()=>{
            return state.set('typeList',action.data)
                        .set('typeListValue',action.typeValue)
        },
        [ActionTypes.SET_INVENTORY_YEB_TYPE_LIST_VALUE]:()=>{
            return state.set('typeListValue',action.value)
        },
        [ActionTypes.CHANGE_DECIMAL_OF_CONFIG]:()=>{
            return state.set('quantityScale',action.receiveData.quantityScale)
                        .set('priceScale',action.receiveData.priceScale)
        },
        [ActionTypes.CHANGE_DECIMAL_OF_QUANTITY]:()=>{
            return state.set('quantityScale',action.value)
        },
        [ActionTypes.CHANGE_DECIMAL_OF_PRICE]:()=>{
            return state.set('priceScale',action.value)
        },
    }[action.type] || (() => state))()
}
