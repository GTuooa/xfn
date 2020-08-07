import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
export const getInventoryYebData=(issuedate, endissuedate,needPeriod='true')=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi("getInventoryYebData",'POST',JSON.stringify({
        begin: issuedate?issuedate:"",
        end: endissuedate?endissuedate:"",
        isType:false,
        needPeriod
    }),resp=>{
        if(showMessage(resp)){
            //dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            const issuedateNew = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp))
            const endissuedateNew = endissuedate ? endissuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp))
            dispatch({
                type:ActionTypes.SET_INVENTORY_YEB_INIT_DATA,
                data:resp.data.balance,
                issuedate:issuedateNew,
                endissuedate:endissuedateNew
            })
            fetchApi('getStockQuantity',"POST",JSON.stringify({
                begin: issuedate?`${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`:"",
                end: endissuedate?`${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`:"",
                isType:false,
            }),json=>{
                if(showMessage(json)){
                    dispatch({
                         type:ActionTypes.SET_INVENTURY_QUANTITY_LIST,
                         data:json.data.quantityList,
                         stockQuantity:json.data.quantityList.length >0 ? json.data.quantityList[0].quantity:''
                    })
                    fetchApi('getStockCategory','POST',JSON.stringify({
                        begin: issuedate?`${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`:"",
                        end: endissuedate?`${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`:"",
                        isType:false,
                    }),data=>{
                        if(showMessage(data)){
                            dispatch({
                                type:ActionTypes.SET_INVENTORY_CATEGORY_LIST,
                                data:data.data.categoryList,
                                categoryValue:"全部",
                                topCategoryUuid:"",
                                subCategoryUuid:'',
                                isType:false,
                            })
                            fetchApi('getStockStore','POST',JSON.stringify({
                                begin:'',
                                end:'',
                                isType:false
                            }),list=>{
                                if(showMessage(list)){
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    dispatch({
                                         type:ActionTypes.SET_INVENTORY_STORE_TREE,
                                         data:list.data.storeList,
                                         storeCardUuid:list.data.storeList.length>0?list.data.storeList[0].uuid:''
                                     })
                                }
                            })
                        }
                    })
                }
            })
            dispatch(getDecimalScale())
        }
    })
}


export const changeInventoryShow=()=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_SHOW
    })
}
export const changeInventoryChoosePeridos=()=>dispatch=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_CHOOSE_PERIDOS
    })
}
//存货
export const getQuantityList =(issuedate, endissuedate,)=>(dispatch,getState)=>{
    let inventoryYebState = getState().inventoryYebState
    let stockQuantity = inventoryYebState.get('stockQuantity')
    let inventoryType = inventoryYebState.get('inventoryType')
    fetchApi('getStockQuantity',"POST",JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        isType:inventoryType==='Other'
    }),resp=>{
        if(showMessage(resp)){
            let arr = []
            for(let i in resp.data.quantityList){
                arr.push(resp.data.quantityList[i].quantity)
            }
            if(arr.includes(stockQuantity)){
                dispatch({
                     type:ActionTypes.SET_INVENTURY_QUANTITY_LIST,
                     data:resp.data.quantityList,
                     stockQuantity:stockQuantity,

                })
                dispatch(getStockCategoryTree(issuedate, endissuedate,stockQuantity))
            }else{
                stockQuantity=resp.data.quantityList.length>0?resp.data.quantityList[0].quantity:''
                dispatch({
                     type:ActionTypes.SET_INVENTURY_QUANTITY_LIST,
                     data:resp.data.quantityList,
                     stockQuantity:stockQuantity
                })
                dispatch(getStockCategoryTree(issuedate, endissuedate,stockQuantity))
            }
        }
    })
}
export const getInitStockCategoryTree=()=>(dispatch)=>{
    fetchApi('getStockCategory','POST',JSON.stringify({
        begin: "",
        end: "",
    }),resp=>{
        dispatch({
            type:ActionTypes.SET_INIT_STOCK_CATEGORY_LIST,
            data:resp.data.categoryList
        })
    })
}
//存货类别
export const getStockCategoryTree=(issuedate, endissuedate,stockQuantity)=>(dispatch,getState)=>{
    let inventoryYebState = getState().inventoryYebState
    let inventoryType = inventoryYebState.get('inventoryType')
    fetchApi('getStockCategory','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        stockQuantity:stockQuantity?stockQuantity:'',
        isType:inventoryType==='Other'
    }),resp=>{
        if(showMessage(resp)){
            let inventoryYebState = getState().inventoryYebState
            let categoryValue=inventoryYebState.get('categoryValue')
            let topCategoryUuid =inventoryYebState.get('topCategoryUuid')
            let subCategoryUuid =inventoryYebState.get('subCategoryUuid')
            let arr=[]
            if(resp.data.categoryList.length){
                const loop = (data, upperUuid) => data.map((item, i) => {
                    arr.push(`${upperUuid}-${item.uuid}`)
                    if (item.childList && item.childList.length) {
                        {loop(item.childList, `${upperUuid}-${item.uuid}`)}
                    }
                })
                loop(resp.data.categoryList,'')
                if(!arr.includes(categoryValue)){
                    categoryValue=`全部`
                    topCategoryUuid=''
                    subCategoryUuid=''
                }
            }else{
                categoryValue=`全部`
                topCategoryUuid=''
                subCategoryUuid=''
            }
            dispatch({
                type:ActionTypes.SET_INVENTORY_CATEGORY_LIST,
                data:resp.data.categoryList,
                categoryValue,
                topCategoryUuid,
                subCategoryUuid,
            })

            dispatch(getStockStoreTree(issuedate, endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid))
        }
    })
}
//仓库
export const getStockStoreTree=(issuedate, endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,)=>(dispatch,getState)=>{
    let inventoryYebState = getState().inventoryYebState
    let storeCardUuid= inventoryYebState.get('storeCardUuid')
    let inventoryType = inventoryYebState.get('inventoryType')
     fetchApi('getStockStore','POST',JSON.stringify({
         begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
         end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
         stockQuantity:stockQuantity?stockQuantity:'',
         topCategoryUuid:topCategoryUuid,
         subCategoryUuid:subCategoryUuid,
         isType:inventoryType==='Other'
     }),resp=>{
         if(showMessage(resp)){
            let arr= []
            const loop = (data ) => data.map((item, i) => {
                arr.push(`${item.uuid}`)
                if (item.childList && item.childList.length) {
                    {loop(item.childList)}
                }
             })
            loop(resp.data.storeList)
            if(inventoryType==='Other'){
                if(arr.includes(storeCardUuid)){
                    dispatch({
                        type:ActionTypes.SET_INVENTORY_STORE_TREE,
                        data:resp.data.storeList,
                        storeCardUuid:storeCardUuid
                    })
                    dispatch(getInventoryTypeList(issuedate, endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid))
                }else{
                    storeCardUuid = resp.data.storeList.length>0?resp.data.storeList[0].uuid:''
                    dispatch({
                         type:ActionTypes.SET_INVENTORY_STORE_TREE,
                         data:resp.data.storeList,
                         storeCardUuid:storeCardUuid
                     })
                     dispatch(getInventoryTypeList(issuedate, endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid))
                }
            }else{
                if(arr.includes(storeCardUuid)){
                    dispatch({
                        type:ActionTypes.SET_INVENTORY_STORE_TREE,
                        data:resp.data.storeList,
                        storeCardUuid:storeCardUuid
                    })
                    dispatch(getInventoryYebSelectedData(issuedate, endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid,''))
                }else{
                   storeCardUuid = resp.data.storeList.length>0?resp.data.storeList[0].uuid:''
                   dispatch({
                        type:ActionTypes.SET_INVENTORY_STORE_TREE,
                        data:resp.data.storeList,
                        storeCardUuid:storeCardUuid
                    })
                    dispatch(getInventoryYebSelectedData(issuedate, endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid,''))
                }
            }
         }
     })
 }
export const getInventoryTypeList=(issuedate,endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid)=>(dispatch,getState)=>{
    let inventoryYebState = getState().inventoryYebState
    let typeListValue= inventoryYebState.get('typeListValue')
    let inventoryType = inventoryYebState.get('inventoryType')
    fetchApi("getInventoryTypeList",'POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        stockQuantity:stockQuantity,
        topCategoryUuid:topCategoryUuid,
        subCategoryUuid:subCategoryUuid==="全部"?'':subCategoryUuid,
        storeCardUuid:storeCardUuid,
        isType:inventoryType==='Other'
    }),resp=>{
        if(showMessage(resp)){
            let arr= []
            const loop = (data ) => data.map((item, i) => {
                arr.push(`${item.acId}`)
                if (item.childList && item.childList.length) {
                    {loop(item.childList)}
                }
             })
            loop(resp.data.typeList)
            if(arr.includes(typeListValue)){
                dispatch({
                    type:ActionTypes.SET_INVENTORY_YEB_TYPE_LIST,
                    data:resp.data.typeList,
                    typeValue:typeListValue
                })
                dispatch(getInventoryYebSelectedData(issuedate, endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid,typeListValue))

            }else{
                dispatch({
                    type:ActionTypes.SET_INVENTORY_YEB_TYPE_LIST,
                    data:resp.data.typeList,
                    typeValue:"全部"
                })
                dispatch(getInventoryYebSelectedData(issuedate, endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid,''))

            }

        }
    })
}
export const getInventoryYebSelectedData=(issuedate,endissuedate,stockQuantity,topCategoryUuid,subCategoryUuid,storeCardUuid,acId)=>(dispatch,getState)=>{
     dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
     //const issuedate= getState().inventoryYebState.get('issuedate')
     //const endissuedate=getState().inventoryYebState.get('endissuedate')
     let inventoryYebState = getState().inventoryYebState
     let inventoryType = inventoryYebState.get('inventoryType')
     let request = {
         begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
         end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
         stockQuantity:stockQuantity,
         topCategoryUuid:topCategoryUuid,
         subCategoryUuid:subCategoryUuid==="全部"?'':subCategoryUuid,
         storeCardUuid:storeCardUuid,
         //acId:inventoryType==='Other'?acId:'',
         needPeriod:'true',
         isType:inventoryType==='Other'
     }
     if(inventoryType==='Other'){
         request.acId = acId
     }
     fetchApi("getInventoryYebData",'POST',JSON.stringify(request),resp=>{
         dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
         if(showMessage(resp)){
             dispatch({
                 type:ActionTypes.SET_INVENTORY_YEB_DATA,
                 data:resp.data.balance,
             })
             dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp))
         }
     })
 }

export const setInventoryStockQuantity = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_STOCK_QUANTITY,
        value
    })
}
export const setStoreCardUuid=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_STORE_CARD_UUID,
        value
    })
}
export const setCategoryUuid = (topCategoryUuid,subCategoryUuid)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_CATEGORY_UUID,
        topCategoryUuid,
        subCategoryUuid
    })
}
export const setCategoryValue = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_VALUE,
        value
    })
}
export const changeInventoryYebDate=(issuedate,endissuedate)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_YEB_DATE,
        issuedate,
        endissuedate
    })
}
export const handleInventoryYebShowChildList = (uuid, parentUuid,name) =>(dispatch,getState)=>{
    const inventoryYebState = getState().inventoryYebState
    const balanceList = inventoryYebState.get('inventoryData')
    let totalNumber = 0
    const loop = (data) => data.map(item =>{
        if (item.childList && item.childList.length) {
            loop(item.childList)
        }
        totalNumber++
    })
    loop(balanceList)

    console.log(name,parentUuid);

    dispatch({
        type:ActionTypes.SET_INVENTORY_YEB_SHOW_CHILD_LIST,
        uuid,
        parentUuid,
        totalNumber
    })
}
export const handleInventoryYebChooseStatus = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANDLE_INVENTORY_YEB_CHOOSE_STATUS,
        value
    })
}
export const changeInventoryType=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_YEB_TYPE,
        value
    })
}
export const changeInventoryYebTypeListValue=(value)=>(dispatch,getState)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_YEB_TYPE_LIST_VALUE,
        value
    })
}
export const changeInventoryYebQuantityScale=(value)=>(dispatch,getState)=>{
    dispatch({
        type:ActionTypes.CHANGE_DECIMAL_OF_QUANTITY,
        value
    })
}
export const changeInventoryYebPriceScale=(value)=>(dispatch,getState)=>{
    dispatch({
        type:ActionTypes.CHANGE_DECIMAL_OF_PRICE,
        value
    })
}

export const getDecimalScale=()=>(dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getInventoryYebDecimalScale','GET','',json=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        dispatch({
            type:ActionTypes.CHANGE_DECIMAL_OF_CONFIG,
            receiveData:json.data.scale
        })
    })
}
export const modifyDecimalScale=()=>(dispatch,getState)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const inventoryYebState = getState().inventoryYebState
    const quantityScale = inventoryYebState.get('quantityScale')
    const priceScale = inventoryYebState.get('priceScale')
    const issuedate = inventoryYebState.get('issuedate')
    const endissuedate = inventoryYebState.get('endissuedate')
    fetchApi('modifyInventoryYebDecimalScale','POST',JSON.stringify({
        quantityScale,
        priceScale,
    }),json=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        dispatch({
            type:ActionTypes.CHANGE_DECIMAL_OF_CONFIG,
            receiveData:json.data.scale
        })
        dispatch(getQuantityList(issuedate,endissuedate))
    })
}
