import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.account'
import * as ActionTypes from './ActionTypes.js'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { fromJS } from 'immutable'
export const getInventoryMxbDataFromYeb = (issuedate,endissuedate,uuid,name,stockCategoryValue,
    topCategoryUuid,subCategoryUuid,stockCategorylabel,stockCategoryList,stockQuantity,stockStoreList,stockStoreValue,
    stockStoreLabel,chooseValue,inventoryType,typeListValue,typeListLabel)=>(dispatch,getState)=>{
        dispatch(getDecimalScale())
    if(inventoryType==='Other'){
        dispatch({
            type:ActionTypes.SET_OTHER_TYPE_INVENTORY_MXB_INIT_DATA,
            issuedate,
            endissuedate,
            chooseValue,
            stockStoreValue:stockStoreValue?stockStoreValue:'',
            stockStoreLabel:stockStoreLabel?stockStoreLabel:'',
            topCategoryUuid,
            subCategoryUuid,
            stockCategoryValue,
            stockCategorylabel,
            uuid,
            name,
            inventoryType,
            typeListValue,
            typeListLabel
        })
        dispatch(getOtherTypeStockStore(issuedate,endissuedate))
    }else{
        thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
        fetchApi('getInventoryMxbStockCard','POST',JSON.stringify({
            begin: issuedate?issuedate:'',
            end:  endissuedate?endissuedate:'' ,
            topCategoryUuid:topCategoryUuid,
            subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
            isType:false,
        }),resp=>{
            if (showMessage(resp)) {
                fetchApi('getInventoryMxbStockDetail','POST',JSON.stringify({
                    begin: issuedate?issuedate:'',
                    end:  endissuedate?endissuedate:'' ,
                    topCategoryUuid:topCategoryUuid,
                    subCategoryUuid:subCategoryUuid,
                    stockCardUuid:uuid,
                    storeCardUuid:stockStoreValue,
                    isType:false,
                }),json=>{
                    if (showMessage(json)) {
                        thirdParty.toast.hide()
                        dispatch({
                            type:ActionTypes.SET_INVENTORY_MXB_INIT_DATA,
                            cardList:resp.data.cardList,
                            stockCategoryList:stockCategoryList,
                            issuedate,
                            endissuedate,
                            uuid,
                            name,
                            topCategoryUuid,
                            subCategoryUuid,
                            stockStoreList,
                            stockStoreValue:stockStoreValue?stockStoreValue:'',
                            stockStoreLabel:stockStoreLabel?stockStoreLabel:'',
                            baseData:json.data.detail,
                            stockQuantity,
                            stockCategoryValue,
                            chooseValue,
                            stockCategorylabel,
                            inventoryType
                        })
                    }
                })
            }
        })
    }

}
export const setInventoryMxbDate=(issuedate,endissuedate)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_MXB_DATE,
        issuedate,
        endissuedate
    })
}
export const changeCardList=(value,name)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_MXB_CARDLIST,
        value,name
    })
}
export const changeStockCategoryValue = (stockCategoryValue,topCategoryUuid,subCategoryUuid)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_MXB_STOCK_CATEGORY_LIST,
        stockCategoryValue,topCategoryUuid,subCategoryUuid
    })
}
export const changeStockStoreList=(stockStoreValue,stockStoreLabel)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_MXB_STOCK_STORE_LIST,
        stockStoreValue,stockStoreLabel
    })
}
export const getInventoryMxbStockCategory=(issuedate,endissuedate)=>(dispatch,getState)=>{
    const stockQuantity = getState().inventoryMxbState.get('stockQuantity')
    const stockCategoryValue = getState().inventoryMxbState.get('stockCategoryValue')
    const stockCategorylabel = getState().inventoryMxbState.get('stockCategorylabel')
    fetchApi('getInventoryYebstockCategory','POST',JSON.stringify({
        begin: issuedate?issuedate:'',
        end:  endissuedate?endissuedate:'' ,
        stockQuantity,
        isType:false
    }),resp=>{
        if (showMessage(resp)) {
            const initCategory = [{label:'全部',key:'-:-',childList:[]}]
            let hasItem =false
			const loop = (item,uuid) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
                    if(`${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`===stockCategoryValue){
                        hasItem =true
                    }
					return {
						key: `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`,
						label: v.name,
						childList: loop(v.childList, `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`)
					}
				} else {
                    if(`${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`===stockCategoryValue){
                        hasItem =true
                    }
					return {
						key: `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`,
						label: v.name,
						childList: [],
					}
				}
			})
			const receivedData = loop(resp.data.categoryList,'')
            const stockCategoryList = initCategory.concat(receivedData)
            if(hasItem){
                const topCategoryUuid = getState().inventoryMxbState.get('topCategoryUuid')
                const subCategoryUuid = getState().inventoryMxbState.get('subCategoryUuid')
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_LIST,
                    stockCategoryList:stockCategoryList,
                    stockCategoryValue:stockCategoryValue,
                    stockCategorylabel:stockCategorylabel,
                    topCategoryUuid:topCategoryUuid,
                    subCategoryUuid:subCategoryUuid,
                })
                dispatch(getInventoryMxbStockDetailCard(topCategoryUuid,subCategoryUuid))
            }else{
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_LIST,
                    stockCategoryList:stockCategoryList,
                    stockCategoryValue:'',
                    stockCategorylabel:'全部',
                    topCategoryUuid:'',
                    subCategoryUuid:'',
                })
                dispatch(getInventoryMxbStockDetailCard('',''))
            }
        }
    })
}
export const getInventoryMxbStockDetailCard= (topCategoryUuid,subCategoryUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get('issuedate')
    const endissuedate = getState().inventoryMxbState.get('endissuedate')
    fetchApi("getInventoryMxbStockCard",'POST',JSON.stringify({
        begin: issuedate?issuedate:'',
        end: endissuedate?endissuedate:'' ,
        topCategoryUuid:topCategoryUuid,
        subCategoryUuid:subCategoryUuid,
        isType:false
    }),resp=>{
        if (showMessage(resp)) {
            let cardListArr = []
            let hasItem = false
            const cardValue = getState().inventoryMxbState.get('cardValue')
            const cardName = getState().inventoryMxbState.get('cardName')
            resp.data.cardList && resp.data.cardList.map((item,index) => {
                cardListArr.push({
                    name: item.sockCardName,
                    uuid: item.stockCardUuid,
                })
                if(item.stockCardUuid===cardValue){
                     hasItem = true
                }
            })
            if(hasItem){
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_STOCK_CARDLIST,
                    cardList:cardListArr,
                    cardValue:cardValue,
                    cardName:cardName
                })
                dispatch(getInventoryStockStore(cardValue))
            }else{
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_STOCK_CARDLIST,
                    cardList:cardListArr,
                    cardValue:cardListArr[0].uuid,
                    cardName:cardListArr[0].name,
                })
                dispatch(getInventoryStockStore(cardListArr[0].uuid))
            }
        }
    })
}
export const getInventoryStockStore=(stockCardUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get('issuedate')
    const endissuedate = getState().inventoryMxbState.get('endissuedate')
    const stockQuantity = getState().inventoryMxbState.get('stockQuantity')
    const topCategoryUuid = getState().inventoryMxbState.get('topCategoryUuid')
    const subCategoryUuid = getState().inventoryMxbState.get('subCategoryUuid')
    fetchApi('getInventoryYebStockStore','POST',JSON.stringify({
        begin: issuedate?issuedate:'',
        end: endissuedate?endissuedate:'' ,
        topCategoryUuid:topCategoryUuid,
        subCategoryUuid:subCategoryUuid,
        stockQuantity:stockQuantity,
        stockCardUuid:stockCardUuid,
        isType:false
    }),resp=>{
        if (showMessage(resp)) {
            const stockStoreValue = getState().inventoryMxbState.get('stockStoreValue')
            const stockStoreLabel = getState().inventoryMxbState.get('stockStoreLabel')
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
            //const storeList =loop(resp.data.storeList)
            const list = resp.data.storeList.length ? loop(resp.data.storeList) : []
            const storelist = list.length ? [{label:list[0].label,key:list[0].key,childList: []}].concat(list[0].childList) : []
            if(hasItem){
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                    stockStoreList:storelist,
                    stockStoreValue:stockStoreValue,
                    stockStoreLabel:stockStoreLabel
                })
                dispatch(getInventoryMxbSelectedData(stockStoreValue))
            }else{
                if(storelist.length>0){
                    dispatch({
                        type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                        stockStoreList:storelist,
                        stockStoreValue:resp.data.storeList.length ? resp.data.storeList[0].uuid : '',
                        stockStoreLabel:resp.data.storeList.length ? resp.data.storeList[0].name : ''
                    })
                    dispatch(getInventoryMxbSelectedData(resp.data.storeList.length ? resp.data.storeList[0].uuid : ''))
                }else{
                    dispatch({
                        type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                        stockStoreList:storelist,
                        stockStoreValue:'',
                        stockStoreLabel:''
                    })
                    dispatch(getInventoryMxbSelectedData(''))
                }
            }
        }
    })
}
export const getInventoryMxbSelectedData=(storeCardUuid)=>(dispatch,getState)=>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const issuedate = getState().inventoryMxbState.get('issuedate')
    const endissuedate = getState().inventoryMxbState.get('endissuedate')
    const stockCardUuid = getState().inventoryMxbState.get('cardValue')
    const topCategoryUuid = getState().inventoryMxbState.get('topCategoryUuid')
    const subCategoryUuid = getState().inventoryMxbState.get('subCategoryUuid')
    fetchApi('getInventoryMxbStockDetail','POST',JSON.stringify({
        begin: issuedate?issuedate:'',
        end:  endissuedate?endissuedate:'' ,
        topCategoryUuid:topCategoryUuid,
        subCategoryUuid:subCategoryUuid,
        stockCardUuid:stockCardUuid,
        storeCardUuid:storeCardUuid,
        isType:false
    }),resp=>{
        if(showMessage(resp)){
            thirdParty.toast.hide()
            dispatch({
                type:ActionTypes.SET_INVENTORY_MXB_SELECTED_DATA,
                baseData:resp.data.detail
            })
        }
    })
}
export const handleInventoryMxbDateChooseValue=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANDLE_INVENTORY_MXB_DATE_CHOOSE_VALUE,
        value
    })
}

export const getOtherTypeStockStore=(issuedate,endissuedate)=>(dispatch,getState)=>{
    fetchApi('getInventoryYebStockStore',"POST",JSON.stringify({
        begin: issuedate?issuedate:'',
        end:  endissuedate?endissuedate:'' ,
        isType:true,
    }),resp=>{
        if(showMessage(resp)){
            const stockStoreValue = getState().inventoryMxbState.get('stockStoreListOtherValue')
            const stockStoreLabel = getState().inventoryMxbState.get('stockStoreListOtherLabel')
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
            //const storeList =loop(resp.data.storeList)
            const list = loop(resp.data.storeList)

            if(hasItem){
                const storelist = [{label:list[0].label,key:list[0].key,childList: []}].concat(list[0].childList)
                dispatch({
                    type:ActionTypes.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST,
                    stockStoreListOther:storelist,
                    stockStoreListOtherValue:stockStoreValue,
                    stockStoreListOtherLabel:stockStoreLabel
                })
                dispatch(getOtherTypeStockCategory(stockStoreValue))
            }else{
                if(resp.data.storeList.length>0){
                    const storelist = [{label:list[0].label,key:list[0].key,childList: []}].concat(list[0].childList)
                    dispatch({
                        type:ActionTypes.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST,
                        stockStoreListOther:storelist,
                        stockStoreListOtherValue:resp.data.storeList[0].uuid,
                        stockStoreListOtherLabel:resp.data.storeList[0].name
                    })
                    dispatch(getOtherTypeStockCategory(resp.data.storeList[0].uuid))
                }else{
                    dispatch({
                        type:ActionTypes.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST,
                        stockStoreListOther:[],
                        stockStoreListOtherValue:'',
                        stockStoreListOtherLabel:''
                    })
                    dispatch(getOtherTypeStockCategory(''))
                }
            }
        }
    })
}
export const getOtherTypeStockCategory=(storeCardUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get('issuedate')
    const endissuedate = getState().inventoryMxbState.get('endissuedate')
    fetchApi('getInventoryYebstockCategory','POST',JSON.stringify({
        begin: issuedate?issuedate:'',
        end: endissuedate?endissuedate:'' ,
        storeCardUuid:storeCardUuid?storeCardUuid:'',
        isType:true
    }),resp=>{
        if(showMessage(resp)){
            const initCategory = [{label:'全部',key:'-:-',childList:[]}]
            const stockCategoryValue = getState().inventoryMxbState.get('stockCategoryValue')
            const stockCategorylabel = getState().inventoryMxbState.get('stockCategorylabel')
            let hasItem =false
			const loop = (item,uuid) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
                    if(`${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`===stockCategoryValue){
                        hasItem =true
                    }
					return {
						key: `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`,
						label: v.name,
						childList: loop(v.childList, `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`)
					}
				} else {
                    if(`${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`===stockCategoryValue){
                        hasItem =true
                    }
					return {
						key: `${uuid}${Limit.TREE_JOIN_STR}${v.uuid}`,
						label: v.name,
						childList: [],
					}
				}
			})
			const receivedData = loop(resp.data.categoryList,'')
            const stockCategoryList = initCategory.concat(receivedData)
            if(hasItem){
                const topCategoryUuid = getState().inventoryMxbState.get('topCategoryUuid')
                const subCategoryUuid = getState().inventoryMxbState.get('subCategoryUuid')
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_LIST,
                    stockCategoryList:stockCategoryList,
                    stockCategoryValue:stockCategoryValue,
                    stockCategorylabel:stockCategorylabel,
                    topCategoryUuid:topCategoryUuid,
                    subCategoryUuid:subCategoryUuid,
                })
                dispatch(getOtherTypeStockCardDetail(topCategoryUuid,subCategoryUuid))
            }else{
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_LIST,
                    stockCategoryList:stockCategoryList,
                    stockCategoryValue:'',
                    stockCategorylabel:'全部',
                    topCategoryUuid:'',
                    subCategoryUuid:'',
                })
                dispatch(getOtherTypeStockCardDetail('',''))
            }
        }
    })
}
export const getOtherTypeStockCardDetail=(topCategoryUuid,subCategoryUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get('issuedate')
    const endissuedate = getState().inventoryMxbState.get('endissuedate')
    const stockStoreListOtherValue = getState().inventoryMxbState.get('stockStoreListOtherValue')
    fetchApi("getInventoryMxbStockCard",'POST',JSON.stringify({
        begin: issuedate?issuedate:'',
        end: endissuedate?endissuedate:'' ,
        topCategoryUuid:topCategoryUuid?topCategoryUuid:'',
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        storeCardUuid:stockStoreListOtherValue?stockStoreListOtherValue:'',
        isType:true
    }),resp=>{
        if(showMessage(resp)){
            let cardListArr = []
            let hasItem = false
            const cardValue = getState().inventoryMxbState.get('cardValue')
            const cardName = getState().inventoryMxbState.get('cardName')
            resp.data.cardList && resp.data.cardList.map((item,index) => {
                cardListArr.push({
                    name: item.sockCardName,
                    uuid: item.stockCardUuid,
                })
                if(item.stockCardUuid===cardValue){
                     hasItem = true
                }
            })
            if(hasItem){
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_STOCK_CARDLIST,
                    cardList:cardListArr,
                    cardValue:cardValue,
                    cardName:cardName
                })
                dispatch(getOtherTypeStockTypeList(cardValue))
            }else{
                if(cardListArr.length===0){
                    dispatch({
                        type:ActionTypes.SET_INVENTORY_MXB_STOCK_CARDLIST,
                        cardList:cardListArr,
                        cardValue:'',
                        cardName:'',
                    })
                    dispatch(getOtherTypeStockTypeList(''))
                }else{
                    dispatch({
                        type:ActionTypes.SET_INVENTORY_MXB_STOCK_CARDLIST,
                        cardList:cardListArr,
                        cardValue:cardListArr[0].uuid,
                        cardName:cardListArr[0].name,
                    })
                    dispatch(getOtherTypeStockTypeList(cardListArr[0].uuid))
                }
            }
        }
    })
}
export const getOtherTypeStockTypeList=(stockCardUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get('issuedate')
    const endissuedate = getState().inventoryMxbState.get('endissuedate')
    const stockStoreListOtherValue = getState().inventoryMxbState.get('stockStoreListOtherValue')
    const topCategoryUuid = getState().inventoryMxbState.get('topCategoryUuid')
    const subCategoryUuid = getState().inventoryMxbState.get('subCategoryUuid')
    fetchApi('getInventoryYebTypeList','POST',JSON.stringify({
        begin: issuedate?issuedate:'',
        end: endissuedate?endissuedate:'' ,
        topCategoryUuid:topCategoryUuid?topCategoryUuid:'',
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        storeCardUuid:stockStoreListOtherValue?stockStoreListOtherValue:'',
        stockCardUuid:stockCardUuid?stockCardUuid:'',
        isType:true
    }),resp=>{
        if(showMessage(resp)){
            const typeListValue = getState().inventoryMxbState.get('typeListValue')
            const typeListLabel = getState().inventoryMxbState.get('typeListLabel')
            let hasItem=false
            let initItem = {
                key:'',
                label:'全部',
                childList: [],
            }
            const loop = (item) => item.map((v, i) => {
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
						childList: [],
					}
				}
			})
            const list =loop(resp.data.typeList)
            const typeList = [initItem].concat(list)
            if(hasItem){
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_TYPE_LIST,
                    typeList:typeList,
                    typeListValue:typeListValue,
                    typeListLabel:typeListLabel,
                })
                dispatch(getOtherTypeMxbData(typeListValue))
            }else{
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_TYPE_LIST,
                    typeList:typeList,
                    typeListValue:'',
                    typeListLabel:'全部',
                })
                dispatch(getOtherTypeMxbData(''))
            }
        }
    })
}
export const getOtherTypeMxbData = (acId)=>(dispatch,getState)=>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    const issuedate = getState().inventoryMxbState.get('issuedate')
    const endissuedate = getState().inventoryMxbState.get('endissuedate')
    const stockStoreListOtherValue = getState().inventoryMxbState.get('stockStoreListOtherValue')
    const topCategoryUuid = getState().inventoryMxbState.get('topCategoryUuid')
    const subCategoryUuid = getState().inventoryMxbState.get('subCategoryUuid')
    const cardValue = getState().inventoryMxbState.get('cardValue')
    fetchApi('getInventoryMxbStockDetail','POST',JSON.stringify({
        begin: issuedate?issuedate:'',
        end: endissuedate?endissuedate:'' ,
        topCategoryUuid:topCategoryUuid?topCategoryUuid:'',
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        storeCardUuid:stockStoreListOtherValue?stockStoreListOtherValue:'',
        stockCardUuid:cardValue?cardValue:'',
        acId:acId?acId:'',
        isType:true
    }),resp=>{
        thirdParty.toast.hide()
        dispatch({
            type:ActionTypes.SET_INVENTORY_MXB_SELECTED_DATA,
            baseData:resp.data.detail
        })
        dispatch({
            type:ActionTypes.SET_INVENTORY_MXB_BALANCE_DIRECTION,
            value:resp.data.detail.detailList.length ? resp.data.detail.detailList[0].balanceDirection : 'debit'
        })
        dispatch({
            type:ActionTypes.CHANGE_REVERSE_AMOUNT_TYPE,
            value:false
        })
    })
}
export const changeInventoryYebType=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_MXB_TYPE,
        value:value==='Inventory'?'Other':'Inventory'
    })
}
export const changeOtherTypeStockStoreValue=(value,label)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_MXB_OTHER_TYPE_STOCK_STORE_VALUE,
        value,label
    })
}
export const changeTypeListValue = (value,label)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTPRY_MXB_TYPE_LIST_VALUE,
        value,label
    })
}
export const changeInventoryMxbBalanceDirection = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_MXB_BALANCE_DIRECTION,
        value:value==='debit'?'credit':'debit'
    })
}
export const changeReverseAmount = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_REVERSE_AMOUNT_TYPE,
        value:!value
    })
}

export const getDecimalScale=()=>(dispatch)=>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getInventoryYebDecimalScale','GET','',json=>{
        thirdParty.toast.hide()
        dispatch({
            type:ActionTypes.CHANGE_DECIMAL_OF_CONFIG_MXB,
            receiveData:json.data.scale
        })
    })
}
