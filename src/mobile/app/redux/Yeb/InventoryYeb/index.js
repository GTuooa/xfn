import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
const inventoryYebState = fromJS({
    issuedate: '',
    endissuedate:'',
    dataList:[],

    stockQuabtityList:[],
    stockQuantity:'',
    stockQuantityName:'',

    stockCategoryList:[],
    stockCategoryValue:"",
    stockCategorylabel:'',
    topCategoryUuid:'',
    subCategoryUuid:'',

    stockStoreList:[],
    stockStoreValue:'',
    stockStoreLabel:'',

    showChildList:[],
    chooseValue: 'ISSUE',
    inventoryType:'Inventory',

    typeList:[],
    typeListValue:'',
    typeListLabel:'全部类型',

    quantityScale: '',
    priceScale: '',
})
export default function handleInventoryYeb(state = inventoryYebState, action) {
    return ({
        [ActionTypes.SET_INVENTORY_YEB_INIT_DATA]:()=>{
            return state.set('issuedate',action.issuedate)
                        .set('dataList',action.dataList)
                        .set('endissuedate','')
                        .set('chooseValue','ISSUE')
        },
        [ActionTypes.SET_INVENTORT_YEB_DATE]:()=>{
            return state.set('issuedate',action.issuedate)
                        .set('endissuedate',action.endissuedate)
        },
        [ActionTypes.SET_INVENTORY_YEB_STOCK_QUANTITY_LIST]:()=>{
            let list = []
            let hasItem = false
            let stockQuantity = state.get('stockQuantity')
            if(action.list.length > 0){
                for(let i in action.list){
                    if(action.list[i].quantity===stockQuantity){
                        hasItem = true
                    }
                    list.push({
                        key:action.list[i].name,
                        value:action.list[i].quantity,
                    })
                }
                if(hasItem){
                    return state.set('stockQuabtityList',list)
                }else{
                    return state.set('stockQuabtityList',list)
                                .set('stockQuantity',list[0].value)
                                .set('stockQuantityName',list[0].key)
                }
            }else{
                return state.set('stockQuabtityList',list)
            }
        },
        [ActionTypes.CHANGE_INVENTPRY_YEB_STOCK_QUANTITY]:()=>{
            return state.set('stockQuantity',action.value)
                        .set('stockQuantityName',action.label)
        },
        [ActionTypes.SET_INVENTORY_YEB_STOCK_CATEGORY_LIST]:()=>{
            const initCategory = [{label:'全部类别',key:'-:-',childList:[]}]
            let stockCategoryValue = state.get('stockCategoryValue')
            let stockCategorylabel = state.get('stockCategorylabel')

            let hasItem = false
			const loop = (item,uuid) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
                    if(`${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`===stockCategoryValue){
                        hasItem = true
                    }
					return {
						key: `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`,
						label: v.name,
						childList: loop(v.childList, `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`)
					}
				} else {
                    if(`${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`===stockCategoryValue){
                        hasItem = true
                    }
					return {
						key: `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`,
						label: v.name,
						childList: [],
					}
				}
			})

			const receivedData = loop(action.categoryList,'')

			const stockCategoryList = initCategory.concat(receivedData)

            if(hasItem){
                return state.set('stockCategoryList', stockCategoryList)
                            .set('stockCategoryValue',stockCategoryValue)
                            .set('stockCategorylabel',stockCategorylabel)
            }else{
                return state.set('stockCategoryList', stockCategoryList)
                            .set('stockCategoryValue',stockCategoryList[0].key)
                            .set('stockCategorylabel',stockCategoryList[0].label)
            }

        },
        [ActionTypes.SET_INVENTORY_YEB_STOCK_CATEGORY_UUID]:()=>{
            return state.set('stockCategoryValue',action.key)
                        .set('stockCategorylabel',action.label)
                        .set('topCategoryUuid',action.topCategoryUuid)
                        .set('subCategoryUuid',action.subCategoryUuid)
        },
        [ActionTypes.SET_INVENTORY_YEB_STOCK_STORE_LIST]:()=>{
            const stockStoreValue =  state.get('stockStoreValue')
            const stockStoreLabel =  state.get('stockStoreLabel')
            let hasItem = false
            const loop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
                    if(stockStoreValue===v.uuid){
                        hasItem = true
                    }
					return {
						key: `${v.uuid}`,
						label: v.name,
						childList: loop(v.childList)
					}
				} else {
                    if(stockStoreValue===v.uuid){
                        hasItem = true
                    }
					return {
						key: `${v.uuid}`,
						label: v.name,
						childList: [],
					}
				}
			})
            const list = loop(action.list)
            if(list.length > 0 ){
                const storelist = [{label:list[0].label,key:list[0].key,childList: []}].concat(list[0].childList)
                if(hasItem){
                    return state.set('stockStoreList',storelist)
                                .set("stockStoreValue",stockStoreValue)
                                .set('stockStoreLabel',stockStoreLabel)
                }else{
                    return state.set('stockStoreList',storelist)
                                .set("stockStoreValue",list[0].key)
                                .set('stockStoreLabel',list[0].label)
                }
            }else{
                return state.set('stockStoreList',[])
            }
        },
        [ActionTypes.SET_INVENTORY_YEB_STOCK_STORE_VALUE]:()=>{
            return state.set('stockStoreValue',action.value)
                        .set('stockStoreLabel',action.label)
        },
        [ActionTypes.SET_INVENTORY_YEB_SELECTED_DATA] :()=>{
            return state.set('dataList',action.dataList)
        },
        [ActionTypes.HANGLE_INVENTORY_YEB_SHOW_CHILD_LIST]:()=>{
            let showChildList = state.get("showChildList")
            let newShowChildList
            if(showChildList.includes(action.uuid)){
                let index =showChildList.findIndex((value,index)=>{
					return value === action.uuid
				})
                newShowChildList = showChildList.splice(index,1)
            }else{
                newShowChildList=showChildList.concat(action.uuid)
            }
            return state.set('showChildList',newShowChildList)
        },
        [ActionTypes.SET_INVENTORY_YEB_INIT_STOCK_CATEGORY_LIST]:()=>{
            const initCategory = [{label:'全部类别',key:'-:-',childList:[]}]
            const loop = (item,uuid) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`,
						label: v.name,
						childList: loop(v.childList, `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`)
					}
				} else {
					return {
						key: `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`,
						label: v.name,
						childList: [],
					}
				}
			})
			const receivedData = loop(action.categoryList,'')
			const stockCategoryList = initCategory.concat(receivedData)
            return state.set('stockCategoryList', stockCategoryList)
                        .set('stockCategoryValue',stockCategoryList[0].key)
                        .set('stockCategorylabel',stockCategoryList[0].label)
        },
        [ActionTypes.SET_INVENTORY_YEB_INIT_STOCK_STORE_LIST]:()=>{
            const loop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.uuid}`,
						label: v.name,
						childList: loop(v.childList)
					}
				} else {
					return {
						key: `${v.uuid}`,
						label: v.name,
						childList: [],
					}
				}
			})
            const list = loop(action.list)

            if(list.length > 0 ){
                const storelist = [{label:list[0].label,key:list[0].key,childList: []}].concat(list[0].childList)
                return state.set('stockStoreList',storelist)
                            .set("stockStoreValue",list[0].key)
                            .set('stockStoreLabel',list[0].label)

            }else{
                return state.set('stockStoreList',[])
            }
        },
        [ActionTypes.SET_INVENTORY_YEB_INIT_STOCK_QUANTITY_LIST]:()=>{
            let list = []
            if(action.list.length > 0){
                for(let i in action.list){
                    list.push({
                        key:action.list[i].name,
                        value:action.list[i].quantity,
                    })
                }
                return state.set('stockQuabtityList',list)
                            .set('stockQuantity',list[0].value)
                            .set('stockQuantityName',list[0].key)
            }else{
                return state.set('stockQuabtityList',list)
            }
        },
        [ActionTypes.CHANGE_INVENTPORY_YEB_TYPE]:()=>{
            return state.set('inventoryType',action.value)
        },
        [ActionTypes.CHANGE_INVENTORY_YEB_CHOOSE_VALUE]:()=>{
            return state.set('chooseValue',action.value)
        },
        [ActionTypes.SET_INVENTORY_YEB_TYPE_LIST]:()=>{
            const initCategory = [{label:'全部类型',key:'',childList:[]}]
            return state.set("typeList",initCategory.concat(action.list))
                        .set('typeListValue',action.value)
                        .set("typeListLabel",action.label)
        },
        [ActionTypes.SET_INVENTORY_YEB_TYPE_LIST_VALUE]:()=>{
            return state.set('typeListValue',action.value)
                        .set("typeListLabel",action.label)
        },
        [ActionTypes.CHANGE_DECIMAL_OF_CONFIG]:()=>{
            return state.set('quantityScale',action.receiveData.quantityScale)
                        .set('priceScale',action.receiveData.priceScale)
        }
    }[action.type] || (() => state))()
}
