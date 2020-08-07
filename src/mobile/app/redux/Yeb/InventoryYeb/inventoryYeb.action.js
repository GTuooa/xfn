import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.account'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import * as allActions from 'app/redux/Home/All/other.action'
export const getInventoryYebInitData = ()=>(dispatch)=>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getInventoryYebData','POST',JSON.stringify({
        begin:'',
        end:'',
        isType:false,
        needPeriod:'true'
    }),resp=>{
        if(showMessage(resp)){
            dispatch({
                type:ActionTypes.CHANGE_INVENTPORY_YEB_TYPE,
                value:'Inventory'
            })
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(resp))
            dispatch({
                type:ActionTypes.SET_INVENTORY_YEB_INIT_DATA,
                issuedate:openedissuedate,
                dataList:resp.data.balance.childList
            })
            //dispatch(getInventoryYebStockQuantity(openedissuedate,openedissuedate))
            dispatch(getInventoryYebstockCategory(openedissuedate,openedissuedate,''))
            dispatch(getInventoryYebStockStore(openedissuedate,openedissuedate))
            dispatch(getDecimalScale())
        }

    })
}
// export const getInventoryYebStockQuantity=(issuedate,endissuedate)=>(dispatch)=>{
//     fetchApi('getInventoryYebStockQuantity','POST',JSON.stringify({
//         begin: issuedate ? issuedate: '',
//         end: endissuedate ? endissuedate : '',
//         isType:false,
//     }),resp=>{
//         if(showMessage(resp)){
//             dispatch({
//                 type:ActionTypes.SET_INVENTORY_YEB_INIT_STOCK_QUANTITY_LIST,
//                 list:resp.data.quantityList
//             })
//         }
//     })
// }
export const setStockQuantityValue=(label,value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTPRY_YEB_STOCK_QUANTITY,
        label,
        value
    })
}
export const getInventoryYebstockCategory = (issuedate,endissuedate,stockQuantity)=>(dispatch)=>{
    fetchApi('getInventoryYebstockCategory','POST',JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        isType:false,
        stockQuantity:stockQuantity?stockQuantity:''
    }),resp=>{
            if(showMessage(resp)){
                dispatch({
                    type:ActionTypes.SET_INVENTORY_YEB_INIT_STOCK_CATEGORY_LIST,
                    categoryList:resp.data.categoryList
                })
            }
    })
}
export const setStockCategoryUuid=(key,label,topCategoryUuid,subCategoryUuid)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_YEB_STOCK_CATEGORY_UUID,
        key,label,
        topCategoryUuid,
        subCategoryUuid
    })
}
export const getInventoryYebStockStore=(issuedate,endissuedate)=>(dispatch)=>{
    fetchApi('getInventoryYebStockStore','POST',JSON.stringify({
        begin: issuedate ? issuedate: '',
        end: endissuedate ? endissuedate : '',
        isType:false,
    }),resp=>{
        if(showMessage(resp)){
            thirdParty.toast.hide()
            dispatch({
                type:ActionTypes.SET_INVENTORY_YEB_INIT_STOCK_STORE_LIST,
                list:resp.data.storeList
            })
        }
    })
}
export const setStockStoreValue=(value,label)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_YEB_STOCK_STORE_VALUE,
        value,label
    })
}
export const setInventoryYebDate=(issuedate,endissuedate)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORT_YEB_DATE,
        issuedate,
        endissuedate
    })
}
// export const getInventoryYebSelectedStockQuantity=(issuedate,endissuedate)=>(dispatch,getState)=>{
//     const stockQuantity = getState().inventoryYebState.get('stockQuantity')
//     let hasItem = false
//     fetchApi('getInventoryYebStockQuantity','POST',JSON.stringify({
//         begin: issuedate ? issuedate: '',
//         end: endissuedate ? endissuedate: '',
//     }),resp=>{
//         if(showMessage(resp)){
//             dispatch({
//                 type:ActionTypes.SET_INVENTORY_YEB_STOCK_QUANTITY_LIST,
//                 list:resp.data.quantityList
//             })
//             if(resp.data.quantityList.length>0){
//                 for(let i in resp.data.quantityList){
//                     if(stockQuantity === resp.data.quantityList[i].quantity){
//                         hasItem = true
//                     }
//                 }
//                 if(hasItem){
//                     dispatch(getInventoryYebSelectedStockCategory(stockQuantity))
//                 }else{
//                     dispatch(getInventoryYebSelectedStockCategory(resp.data.quantityList[0].quantity))
//                 }
//             }else{
//                 dispatch(getInventoryYebSelectedStockCategory(''))
//             }
//         }
//     })
// }
export const getInventoryYebSelectedStockCategory=(issuedate,endissuedate)=>(dispatch,getState)=>{
    //const issuedate = getState().inventoryYebState.get('issuedate')
    //const endissuedate = getState().inventoryYebState.get('endissuedate')
    const stockCategoryValue = getState().inventoryYebState.get('stockCategoryValue')
    const topCategoryUuid = getState().inventoryYebState.get('topCategoryUuid')
    const subCategoryUuid = getState().inventoryYebState.get('subCategoryUuid')
    const inventoryType = getState().inventoryYebState.get('inventoryType')
    let hasItem = false
    fetchApi('getInventoryYebstockCategory','POST',JSON.stringify({
        begin: issuedate ? issuedate : '',
        end: endissuedate ? endissuedate : '',
        isType:inventoryType==='Other'
    }),resp=>{
        if(showMessage(resp)){
            dispatch({
                type:ActionTypes.SET_INVENTORY_YEB_STOCK_CATEGORY_LIST,
                categoryList:resp.data.categoryList
            })
            const loop = (item,uuid) => item.map((v, i) => {
                if (v.childList && v.childList.length) {
                    if( stockCategoryValue===`${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`){
                        hasItem = true
                    }
                    loop(v.childList, `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`)
                } else {
                    if( stockCategoryValue===`${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`){
                        hasItem = true
                    }
                }
            })
            loop(resp.data.categoryList,'')
            if(hasItem){
                dispatch(getInventoryYebSeclectedStockStore(topCategoryUuid,subCategoryUuid))
            }else{
                dispatch(getInventoryYebSeclectedStockStore('',''))
            }

        }
    })
}
export const getInventoryYebSeclectedStockStore = (topCategoryUuid,subCategoryUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryYebState.get('issuedate')
    const endissuedate = getState().inventoryYebState.get('endissuedate')
    const stockStoreValue = getState().inventoryYebState.get('stockStoreValue')
    const inventoryType = getState().inventoryYebState.get('inventoryType')
    fetchApi('getInventoryYebStockStore','POST',JSON.stringify({
        begin: issuedate ? issuedate: '',
        end: endissuedate ? endissuedate : '',
        topCategoryUuid:topCategoryUuid,
        subCategoryUuid:subCategoryUuid,
        isType:inventoryType==='Other'
    }),resp=>{
        if(showMessage(resp)){
            dispatch({
                type:ActionTypes.SET_INVENTORY_YEB_STOCK_STORE_LIST,
                list:resp.data.storeList
            })
            let hasItem=false
            const loop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
                    if(stockStoreValue===v.uuid){
                        hasItem = true
                    }
					loop(v.childList)
				} else {
                    if(stockStoreValue===v.uuid){
                        hasItem = true
                    }
				}
			})
            loop(resp.data.storeList)
            if(inventoryType==='Other'){
                if(resp.data.storeList.length>0){
                    if(hasItem){
                        dispatch(getInventoryYebTypeList(topCategoryUuid,subCategoryUuid,stockStoreValue))
                    }else{
                        dispatch(getInventoryYebTypeList(topCategoryUuid,subCategoryUuid,resp.data.storeList[0].uuid))
                    }
                }else{
                    dispatch(getInventoryYebTypeList(topCategoryUuid,subCategoryUuid,''))
                }
            }else{
                if(resp.data.storeList.length>0){
                    if(hasItem){
                        dispatch(getInventoryYebSelectedList(topCategoryUuid,subCategoryUuid,stockStoreValue))
                    }else{
                        dispatch(getInventoryYebSelectedList(topCategoryUuid,subCategoryUuid,resp.data.storeList[0].uuid))
                    }
                }else{
                    dispatch(getInventoryYebSelectedList(topCategoryUuid,subCategoryUuid,''))
                }
            }

        }
    })
}
export const getInventoryYebSelectedList = (topCategoryUuid,subCategoryUuid,storeCardUuid,acId)=>(dispatch,getState)=>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const issuedate = getState().inventoryYebState.get('issuedate')
    const endissuedate = getState().inventoryYebState.get('endissuedate')
    const inventoryType = getState().inventoryYebState.get('inventoryType')
    fetchApi('getInventoryYebData','POST',JSON.stringify({
        begin: issuedate ? issuedate: '',
        end: endissuedate ? endissuedate : '',
        topCategoryUuid:topCategoryUuid,
        subCategoryUuid:subCategoryUuid,
        storeCardUuid:storeCardUuid,
        isType:inventoryType==='Other',
        acId:acId?acId:""
    }),resp=>{
        if(showMessage(resp)){
            thirdParty.toast.hide()
            dispatch({
                type:ActionTypes.SET_INVENTORY_YEB_SELECTED_DATA,
                dataList:resp.data.balance.childList
            })
        }
    })
}
export const getInventoryYebTypeList=(topCategoryUuid,subCategoryUuid,storeCardUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryYebState.get('issuedate')
    const endissuedate = getState().inventoryYebState.get('endissuedate')
    const inventoryType = getState().inventoryYebState.get('inventoryType')
    const typeListValue = getState().inventoryYebState.get('typeListValue')
    const typeListLabel = getState().inventoryYebState.get('typeListLabel')
    fetchApi('getInventoryYebTypeList','POST',JSON.stringify({
        begin: issuedate ? issuedate: '',
        end: endissuedate ? endissuedate : '',
        topCategoryUuid:topCategoryUuid,
        subCategoryUuid:subCategoryUuid,
        storeCardUuid:storeCardUuid?storeCardUuid:'',
        isType:inventoryType==='Other'
    }),resp=>{
        if(showMessage(resp)){
            let hasItem=false
            const loop = (item,acId) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
                    if(typeListValue===v.acId){
                        hasItem = true
                    }
                    return {
						key: `${v.acId}`,
						label: v.name,
						childList: loop(v.childList)
					}
				} else {
                    if(typeListValue===v.acId){
                        hasItem = true
                    }
                    return {
						key: `${v.acId}`,
						label: v.name,
						childList: []
					}
				}
			})
            let typeList = loop(resp.data.typeList)
            if(hasItem){
                dispatch({
                    type:ActionTypes.SET_INVENTORY_YEB_TYPE_LIST,
                    list:typeList,
                    value:typeListValue,
                    label:typeListLabel
                })
                dispatch(getInventoryYebSelectedList(topCategoryUuid,subCategoryUuid,storeCardUuid,typeListValue))
            }else{
                dispatch({
                    type:ActionTypes.SET_INVENTORY_YEB_TYPE_LIST,
                    list:typeList,
                    value:'',
                    label:"全部类型"
                })
                dispatch(getInventoryYebSelectedList(topCategoryUuid,subCategoryUuid,storeCardUuid,''))
            }
        }
    })
}
export const handleInventoryYebShowChildList=(uuid)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANGLE_INVENTORY_YEB_SHOW_CHILD_LIST,
        uuid
    })
}
export const handleInventoryYebDateSelectValue=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANDLE_INVENTORY_YEB_DATE_SELECT_VALUE,
        value
    })
}
export const changeInventoryYebType = (value) =>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTPORY_YEB_TYPE,
        value:value==='Inventory'?'Other':'Inventory'
    })
}
export const changeInventoryChooseValue = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_YEB_CHOOSE_VALUE,
        value
    })
}
export const setTypeListValue=(value,label)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_YEB_TYPE_LIST_VALUE,
        value,label
    })
}

export const getDecimalScale=()=>(dispatch)=>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getInventoryYebDecimalScale','GET','',json=>{
        thirdParty.toast.hide()
        dispatch({
            type:ActionTypes.CHANGE_DECIMAL_OF_CONFIG,
            receiveData:json.data.scale
        })
    })
}
