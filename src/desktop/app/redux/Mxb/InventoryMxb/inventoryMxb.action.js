import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'

import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { fromJS } from 'immutable'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

const getAssistObj = (newChooseObj) => {

    let assistClassificationUuid1 = '',
        assistPropertyUuid1List = [],
        assistClassificationUuid2 = '',
        assistPropertyUuid2List = [],
        assistClassificationUuid3 = '',
        assistPropertyUuid3List = []
    newChooseObj && newChooseObj.size && newChooseObj.map(item => {
        const index = item.get('index')
        switch(index){
            case 0 :
                assistClassificationUuid1 = item.get('assistClassificationUuid')
                item.get('propertyList') && item.get('propertyList').size && item.get('propertyList').map(v => {
                    assistPropertyUuid1List.push(v.get('assistPropertyUuid'))
                })
                break;
            case 1 :
                assistClassificationUuid2 = item.get('assistClassificationUuid')
                item.get('propertyList') && item.get('propertyList').size && item.get('propertyList').map(v => {
                    assistPropertyUuid2List.push(v.get('assistPropertyUuid'))
                })
                break;
            case 2 :
                assistClassificationUuid3 = item.get('assistClassificationUuid')
                item.get('propertyList') && item.get('propertyList').size && item.get('propertyList').map(v => {
                    assistPropertyUuid3List.push(v.get('assistPropertyUuid'))
                })
                break;
            default:
                break;
        }
    })
    const assistObj = {
        assistClassificationUuid1,
        assistPropertyUuid1List,
        assistClassificationUuid2,
        assistPropertyUuid2List,
        assistClassificationUuid3,
        assistPropertyUuid3List
    }
    return assistObj
}
export const getInventoryMxbInitData=()=>(dispatch)=>{
    dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getInventoryMxbCardDetail','POST',JSON.stringify({
        begin:'',
        end:"",
        needPeriod:'true',
        pageNum: 1,
        pageSize: Limit.MXB_CARD_PAGE_SIZE
    }),resp=>{
        if(showMessage(resp)){
            const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp))
            const endissuedateNew = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp))
            if (resp.data.cardList.length>0) {
                const fetchDate = openedissuedate.substr(0, 4) + '-' + openedissuedate.substr(6, 2)
                const firstCardValue = resp.data.cardList.length > 1 ? (resp.data.cardList[0].stockCardUuid ? resp.data.cardList[0].stockCardUuid : resp.data.cardList[1].stockCardUuid) : ''
                fetchApi('getInventoryStockDetail', 'POST', JSON.stringify({
                    begin: fetchDate,
                    end: fetchDate,
                    stockCardUuid:firstCardValue,
                    pageNum: 1,
                    pageSize: Limit.MXB_PAGE_SIZE,
                }),json=>{
                    if (showMessage(json)) {
                        // dispatch(filterCardClear())
                        dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
                        dispatch({
                            type:ActionTypes.SET_INVENTORY_MXB_INIT_DATA,
                            issuedate:openedissuedate,
                            endissuedate:endissuedateNew,
                            cardList:resp.data.cardList,
                            dataList:json.data.detail.detailList,
                            balanceData:json.data.detail,
                            cardValue:firstCardValue,
                            cardPageNum: resp.data.currentPage ? resp.data.currentPage : 1,
                            cardPages: resp.data.pages ? resp.data.pages : 1,
                            detailCurrentPage: json.data.detail.currentPage ? json.data.detail.currentPage : 1,
                            detailPages: json.data.detail.pages ? json.data.detail.pages : 1
                        })
                        dispatch(getInventoryStockStore(fetchDate,fetchDate,'','',firstCardValue))
                    }
                })
                dispatch(getInventoryMxbStockCategory())
            }else{
                dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_INIT_DATA,
                    issuedate:openedissuedate,
                    endissuedate:endissuedateNew,
                    cardList:[],
                    dataList:[],
                    balanceData:{},
                    cardValue:'',
                    cardPageNum: 1,
                    cardPages: 1,
                    detailCurrentPage: 1,
                    detailPages: 1
                })
            }
            dispatch(getDecimalScale())
        }
    })

}
//Yeb跳过来
export const getInventoryMxbDataFromYeb=(issuedate, endissuedate,cardName,cardUuid,categoryValue,storeCardUuid,chooseValue,inventoryType,typeList,typeListValue)=>(dispatch,getState)=>{
    let topCategoryUuid = ''
    let subCategoryUuid =''
    if(categoryValue !=="全部"){
        topCategoryUuid = categoryValue.split('-')[1]
        subCategoryUuid = categoryValue.split('-')[categoryValue.split('-').length - 1]
    }
    dispatch({type:ActionTypes.CHANGE_INVENTORY_MXB_TYPE,value:inventoryType})
    dispatch(getDecimalScale())
    if(inventoryType==='Inventory'){
        fetchApi('getInventoryMxbCardDetail','POST',JSON.stringify({
            begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
            end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
            topCategoryUuid:topCategoryUuid,
            subCategoryUuid:topCategoryUuid===subCategoryUuid?'':subCategoryUuid,
            needPeriod:'true',
            isType:false,
            pageNum: 1,
            pageSize: Limit.MXB_CARD_PAGE_SIZE

        }),json=>{
            if(showMessage(json)){
                dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
                if(json.data.cardList.length){//有卡片
                    fetchApi('getInventoryMxbStockStore', 'POST', JSON.stringify({
                        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
                        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
                        stockCardUuid:cardUuid,
                        isType:false
                    }),resp=>{  //获取仓库列表
                        if(showMessage(resp)){
                            if(resp.data.storeList.length){//有仓库
                                fetchApi('getInventoryStockDetail', 'POST', JSON.stringify({
                                    begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
                                    end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
                                    topCategoryUuid:topCategoryUuid,
                                    subCategoryUuid:topCategoryUuid===subCategoryUuid?'':subCategoryUuid,
                                    stockCardUuid:cardUuid,
                                    storeCardUuid:storeCardUuid,
                                    isType:false,
                                    pageNum: 1,
                                    pageSize: Limit.MXB_PAGE_SIZE,
                                }),data=>{
                                    if(showMessage(data)){
                                        // dispatch(filterCardClear())
                                        let name=''
                                        const loop = (data) => data.map(item => {
                                            if(item.uuid == storeCardUuid){
                                                name = item.name
                                            }
                                            if(item.childList.length > 0){
                                                loop(item.childList)
                                            }
                                        })
                                        loop(resp.data.storeList)
                                        dispatch({
                                            type:ActionTypes.GET_INVENTORY_MXB_FROM_YEB,
                                            issuedate:issuedate,
                                            endissuedate:endissuedate,
                                            dataList:data.data.detail.detailList,
                                            balanceData:data.data.detail,
                                            cardList:json.data.cardList,
                                            cardValue:cardUuid,
                                            stockStoreList:resp.data.storeList,
                                            stockStoreValue:storeCardUuid,
                                            stockStoreLabel:name,
                                            topCategoryUuid:topCategoryUuid,
                                            subCategoryUuid:topCategoryUuid===subCategoryUuid?'':subCategoryUuid,
                                            categoryValue:categoryValue,
                                            chooseValue:chooseValue,
                                            cardPageNum: json.data.currentPage ? json.data.currentPage : 1,
                                            cardPages: json.data.pages ? json.data.pages : 1,
                                            detailCurrentPage: data.data.detail.currentPage ? data.data.detail.currentPage : 1,
                                            detailPages: data.data.detail.pages ? data.data.detail.pages : 1
                                        })
                                    }
                                })
                            }else{//没有仓库
                                fetchApi('getInventoryStockDetail', 'POST', JSON.stringify({
                                    begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
                                    end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
                                    topCategoryUuid:topCategoryUuid,
                                    subCategoryUuid:topCategoryUuid===subCategoryUuid?'':subCategoryUuid,
                                    stockCardUuid:cardUuid,
                                    isType:false
                                }),data=>{
                                    if(showMessage(data)){
                                        // dispatch(filterCardClear())
                                        dispatch({
                                            type:ActionTypes.GET_INVENTORY_MXB_FROM_YEB,
                                            issuedate:issuedate,
                                            endissuedate:endissuedate,
                                            dataList:data.data.detail.detailList,
                                            balanceData:data.data.detail,
                                            cardList:json.data.cardList,
                                            cardValue:cardUuid,
                                            stockStoreList:[],
                                            stockStoreValue:'',
                                            stockStoreLabel:'',
                                            topCategoryUuid:topCategoryUuid,
                                            subCategoryUuid:topCategoryUuid===subCategoryUuid?'':subCategoryUuid,
                                            categoryValue:categoryValue,
                                            chooseValue:chooseValue,
                                            cardPageNum: json.data.currentPage ? json.data.currentPage : 1,
                                            cardPages: json.data.pages ? json.data.pages : 1,
                                            detailCurrentPage: data.data.detail.currentPage ? data.data.detail.currentPage : 1,
                                            detailPages: data.data.detail.pages ? data.data.detail.pages : 1
                                        })
                                    }
                                })
                            }
                        }
                    })
                }else{ // 没有卡片

                }
            }
        })
        dispatch(getInventoryMxbStockCategory(issuedate, endissuedate,false))
    }else{
        //调过来的类型是 其他类型
        dispatch({
            type:ActionTypes.SET_OTHER_TYPE_MXB_INIT_DATA,
            otherTypeStockStoreValue:storeCardUuid,
            chooseValue:chooseValue,
            typeListValue,
            categoryValue,
            cardValue:cardUuid,
            topCategoryUuid:topCategoryUuid,
            subCategoryUuid:topCategoryUuid===subCategoryUuid?'':subCategoryUuid,
        })
        dispatch({type:ActionTypes.SET_INVENTORY_MXB_DATE,issuedate,endissuedate})
        dispatch(getOtherTypeStockStore())
    }
}
//刷新
export const refreshInventoryMxbList = ()=>(dispatch,getState)=>{
    dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
    dispatch(getDecimalScale())
    const inventoryMxbState = getState().inventoryMxbState
    const issuedate = inventoryMxbState.get('issuedate')
    const endissuedate = inventoryMxbState.get('endissuedate')

    if (!issuedate)  {
        return message.info('账期异常，请刷新再试', 2)
    }

    //const topCategoryUuid = inventoryMxbState.get('topCategoryUuid')
    //const subCategoryUuid = inventoryMxbState.get('subCategoryUuid')
    const stockCardUuid = inventoryMxbState.get('cardValue')
    const stockCardMessage = inventoryMxbState.get('stockCardMessage')
    const storeCardUuid	 = inventoryMxbState.get('stockStoreValue')
    const jrAbstract= inventoryMxbState.get('jrAbstract')
    const categoryValue = inventoryMxbState.get("categoryValue")
    const chooseAssistCard = inventoryMxbState.get("chooseAssistCard")
    const chooseBatchCard = inventoryMxbState.get("chooseBatchCard")
    const currentPage = inventoryMxbState.get("cardPageNum")
    const detailCurrentPage = inventoryMxbState.get("detailCurrentPage")
    const {
        assistClassificationUuid1,
        assistPropertyUuid1List,
        assistClassificationUuid2,
        assistPropertyUuid2List,
        assistClassificationUuid3,
        assistPropertyUuid3List
    } = getAssistObj(chooseAssistCard)

    fetchApi('getInventoryMxbStockCategory','POST',JSON.stringify({
        begin:issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`:'',
        end: endissuedate?endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`:'',
    }),resp=>{
        if (showMessage(resp)) {
            let hasItem = false
            let topCategoryUuid =''
            let subCategoryUuid = ''
            const loop = (data, upperUuid) => data.map((item, i) => {
                if(`${upperUuid}-${item.uuid}`=== categoryValue){
                    hasItem = true
                }
                if (item.childList && item.childList.length) {
                    loop(item.childList,`${upperUuid}-${item.uuid}`)
                }

            })
            loop(resp.data.categoryList,'')
            if(hasItem){
                topCategoryUuid = inventoryMxbState.get('topCategoryUuid')
                subCategoryUuid = inventoryMxbState.get('subCategoryUuid')
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_REFRESH,
                    data:resp.data.categoryList,
                    categoryValue,
                    topCategoryUuid,
                    subCategoryUuid
                })
            }else{
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_REFRESH,
                    data:resp.data.categoryList,
                    categoryValue:'全部',
                    topCategoryUuid:'',
                    subCategoryUuid:''
                })
            }
            fetchApi('getInventoryMxbCardDetail','POST',JSON.stringify({
                begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
                end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
                topCategoryUuid,
                subCategoryUuid,
                needPeriod: 'true',
                pageNum:currentPage,
                pageSize: Limit.MXB_CARD_PAGE_SIZE,
            }),resp=>{
                if (showMessage(resp)) {
                    if (resp.data.cardList.length) { // 有卡片
                        dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp))

                        let hasCardItem = false
                        resp.data.cardList.map(item => {
                            if(item.stockCardUuid == stockCardUuid){
                                hasCardItem = true
                            }
                        })
                        if(hasCardItem){//所选卡片不变
                            dispatch({
                                type:ActionTypes.REFRESH_INVENTORY_MXB_CARD_LIST,
                                cardList:resp.data.cardList,
                                cardValue:stockCardUuid,
                                stockCardMessage,
                                cardPageNum: resp.data.currentPage ? resp.data.currentPage : 1,
                                cardPages: resp.data.pages ? resp.data.pages : 1,
                            })
                            fetchApi('getInventoryMxbStockStore','POST',JSON.stringify({
                                begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
                                end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
                                topCategoryUuid:topCategoryUuid?topCategoryUuid:"",
                                subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
                                stockCardUuid:stockCardUuid?stockCardUuid:'',
                            }),json=>{
                                if (showMessage(json)) {
                                    let hasStoreItem = false
                                    if(json.data.storeList.length){
                                        const loop = (data) => data.map(item => {
                                            if(item.uuid == storeCardUuid){
                                                hasStoreItem = true
                                            }
                                            if(item.childList.length > 0){
                                                loop(item.childList)
                                            }
                                        })
                                        loop(json.data.storeList)
                                        if(!hasStoreItem){
                                            dispatch({
                                                type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                                                data:json.data.storeList
                                            })
                                        }else{
                                            dispatch({
                                                type:ActionTypes.REFRESH_INVENORT_MXB_STOCK_STORE,
                                                data:json.data.storeList
                                            })
                                        }
                                    }else{
                                        dispatch({
                                            type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                                            data:json.data.storeList
                                        })
                                    }
                                    fetchApi('getInventoryStockDetail', 'POST', JSON.stringify({
                                        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
                                        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
                                        topCategoryUuid:topCategoryUuid?topCategoryUuid:"",
                                        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
                                        stockCardUuid,
                                        storeCardUuid:hasStoreItem?storeCardUuid:json.data.storeList.length?json.data.storeList[0].uuid:'',
                                        jrAbstract:jrAbstract?jrAbstract:'',
                                        assistClassificationUuid1,
                                        assistPropertyUuid1List,
                                        assistClassificationUuid2,
                                        assistPropertyUuid2List,
                                        assistClassificationUuid3,
                                        assistPropertyUuid3List,
                                        batchUuidList: chooseBatchCard,
                                        pageNum: detailCurrentPage,
                                        pageSize: Limit.MXB_PAGE_SIZE,
                                    }),data=>{
                                        if (showMessage(data)) {
                                            dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
                                            dispatch({
                                                type:ActionTypes.REFRESH_INVENTORY_MXB,
                                                dataList:data.data.detail.detailList,
                                                balanceData:data.data.detail,
                                                detailCurrentPage: data.data.detail.currentPage ? data.data.detail.currentPage : 1,
                                                detailPages: data.data.detail.pages ? data.data.detail.pages : 1
                                            })
                                        }
                                    })
                                }
                            })
                        }else{//卡片定位到第一个
                            const firstCardValue = resp.data.cardList.length > 1 ? (resp.data.cardList[0].stockCardUuid ? resp.data.cardList[0].stockCardUuid : resp.data.cardList[1].stockCardUuid) : ''
                            dispatch({
                                type:ActionTypes.REFRESH_INVENTORY_MXB_CARD_LIST,
                                cardList:resp.data.cardList,
                                cardValue: firstCardValue,
                                stockCardMessage: resp.data.cardList.length > 1 ? (resp.data.cardList[0].stockCardUuid ? resp.data.cardList[0] : resp.data.cardList[1]) : '',
                                cardPageNum: resp.data.currentPage ? resp.data.currentPage : 1,
                                cardPages: resp.data.pages ? resp.data.pages : 1,
                            })
                            fetchApi('getInventoryMxbStockStore','POST',JSON.stringify({
                                begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
                                end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
                                topCategoryUuid:topCategoryUuid?topCategoryUuid:"",
                                subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
                                stockCardUuid: firstCardValue
                            }),json=>{
                                if(showMessage(json)){
                                    let hasStoreItem = false
                                    if(json.data.storeList.length){
                                        const loop = (data) => data.map(item => {
                                            if(item.uuid == storeCardUuid){
                                                hasStoreItem = true
                                            }
                                            if(item.childList.length > 0){
                                                loop(item.childList)
                                            }
                                        })
                                        loop(json.data.storeList)
                                        if(!hasStoreItem){
                                            dispatch({
                                                type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                                                data:json.data.storeList
                                            })
                                        }else{
                                            dispatch({
                                                type:ActionTypes.REFRESH_INVENORT_MXB_STOCK_STORE,
                                                data:json.data.storeList
                                            })
                                        }
                                    }else{
                                        dispatch({
                                            type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                                            data:json.data.storeList
                                        })
                                    }
                                    fetchApi('getInventoryStockDetail', 'POST', JSON.stringify({
                                        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
                                        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
                                        topCategoryUuid:topCategoryUuid?topCategoryUuid:"",
                                        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
                                        stockCardUuid: firstCardValue,
                                        storeCardUuid:hasStoreItem?storeCardUuid:json.data.storeList.length?json.data.storeList[0].uuid:'',
                                        jrAbstract:jrAbstract?jrAbstract:'',
                                        assistClassificationUuid1,
                                        assistPropertyUuid1List,
                                        assistClassificationUuid2,
                                        assistPropertyUuid2List,
                                        assistClassificationUuid3,
                                        assistPropertyUuid3List,
                                        batchUuidList: chooseBatchCard,
                                        pageNum: detailCurrentPage,
                                        pageSize: Limit.MXB_PAGE_SIZE,
                                    }),data=>{
                                        if (showMessage(data)) {
                                            dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
                                            dispatch({
                                                type:ActionTypes.REFRESH_INVENTORY_MXB,
                                                dataList:data.data.detail.detailList,
                                                balanceData:data.data.detail,
                                                detailCurrentPage: data.data.detail.currentPage ? data.data.detail.currentPage : 1,
                                                detailPages: data.data.detail.pages ? data.data.detail.pages : 1
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    //    dispatch(getInventoryMxbStockCategory(issuedate,endissuedate))
                    }else{
                        dispatch({type:ActionTypes.SWITCH_LOADING_MASK})

                    }
                }else{
                    dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
                }
            })
        }
    })


}
export const changeInventoryYebChooseMorePeriods = ()=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_MXB_CHOOSE_MORE_PERIODS,
    })
}
export const getInventoryMxbStockCategory = (issuedate,endissuedate,isType) =>(dispatch,getState)=>{
    const categoryValue = getState().inventoryMxbState.get(categoryValue)
    fetchApi('getInventoryMxbStockCategory','POST',JSON.stringify({
        begin:issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`:'',
        end: endissuedate?endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`:'',
        isType:isType?isType:false
    }),resp=>{
        if (showMessage(resp)) {
            let hasItem = false
            const loop = (data) => data.map(item => {
                if(item.uuid == categoryValue){
                    hasItem = true
                }
                if(item.childList.length > 0){
                    loop(item.childList)
                }
            })
            loop(resp.data.categoryList)
            dispatch({
                type:ActionTypes.SET_INVENTORY_MXB_CATEGORY,
                data:resp.data.categoryList,
            })
        }
    })
}
export const setInventoryCardValue=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_MXB_CARD_VALUE,
        value
    })
}
export const getInventoryStockStore=(issuedate,endissuedate,topCategoryUuid,subCategoryUuid,stockCardUuid)=>(dispatch)=>{
    fetchApi('getInventoryMxbStockStore','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        topCategoryUuid:topCategoryUuid?topCategoryUuid:"",
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        stockCardUuid:stockCardUuid?stockCardUuid:''
    }),resp=>{
        if (showMessage(resp)) {
            dispatch({
                type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                data:resp.data.storeList
            })
        }
    })
}
export const setStockStoreValue=(value,name)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE_VALUE,
        value,
        name
    })
}
export const setCategoryValue=(value,topCategoryUuid,subCategoryUuid)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_VALUE,
        value,
        topCategoryUuid,
        subCategoryUuid
    })
}

export const setInventoryMxbDate=(issuedate,endissuedate)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_INVENTORY_MXB_DATE,
        issuedate,endissuedate
    })
}
export const getInventoryMxbStockCategoryTree=(issuedate,endissuedate)=>(dispatch)=>{
    fetchApi('getInventoryMxbStockCategory','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        isType:false
    }),resp=>{
        if (showMessage(resp)) {
            dispatch({
                type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_LIST,
                data:resp.data.categoryList,
                issuedate:issuedate,
                endissuedate:endissuedate,
            })
            dispatch(getStockDetailCard('',''))
        }
    })
}
export const getStockDetailCard=(topCategoryUuid,subCategoryUuid,currentPage = 1)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get("issuedate")
    const endissuedate = getState().inventoryMxbState.get("endissuedate")
    fetchApi('getInventoryMxbCardDetail','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        topCategoryUuid,
        subCategoryUuid,
        isType:false,
        pageNum:currentPage,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
    }),resp=>{
        if (showMessage(resp)) {
            dispatch({
                type:ActionTypes.SET_INVENTORY_MXB_CARD_LIST,
                cardList:resp.data.cardList,
                cardPageNum: resp.data.currentPage ? resp.data.currentPage : 1,
                cardPages: resp.data.pages ? resp.data.pages : 1,
            })
            const cardValue = getState().inventoryMxbState.get("cardValue")
            dispatch(getStockStoreTree(topCategoryUuid,subCategoryUuid,cardValue))
        }
    })
}
export const getStockStoreTree=(topCategoryUuid,subCategoryUuid,stockCardUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get("issuedate")
    const endissuedate = getState().inventoryMxbState.get("endissuedate")
    fetchApi('getInventoryMxbStockStore','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        topCategoryUuid:topCategoryUuid?topCategoryUuid:"",
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        stockCardUuid:stockCardUuid?stockCardUuid:'',
        isType:false
    }),resp=>{
        if (showMessage(resp)) {
            dispatch({
                type:ActionTypes.SET_INVENTORY_MXB_STOCK_STORE,
                data:resp.data.storeList
            })
            const stockStoreValue = getState().inventoryMxbState.get("stockStoreValue")
            dispatch(getInventoryMxbData(topCategoryUuid,subCategoryUuid,stockCardUuid,stockStoreValue))
        }
    })
}
export const getInventoryMxbData=(topCategoryUuid,subCategoryUuid,stockCardUuid,stockStoreValue)=>(dispatch,getState)=>{
    dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
    const inventoryMxbState = getState().inventoryMxbState
    const issuedate = inventoryMxbState.get("issuedate")
    const endissuedate = inventoryMxbState.get("endissuedate")
    const jrAbstract = inventoryMxbState.get('jrAbstract')
    const chooseAssistCard = inventoryMxbState.get("chooseAssistCard")
    const chooseBatchCard = inventoryMxbState.get("chooseBatchCard")
    const detailCurrentPage = inventoryMxbState.get("detailCurrentPage")
    const {
        assistClassificationUuid1,
        assistPropertyUuid1List,
        assistClassificationUuid2,
        assistPropertyUuid2List,
        assistClassificationUuid3,
        assistPropertyUuid3List
    } = getAssistObj(chooseAssistCard)

    fetchApi("getInventoryStockDetail",'POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        topCategoryUuid:topCategoryUuid?topCategoryUuid:"",
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        stockCardUuid:stockCardUuid?stockCardUuid:'',
        storeCardUuid:stockStoreValue?stockStoreValue:'',
        jrAbstract:jrAbstract?jrAbstract:'',
        isType:false,
        assistClassificationUuid1,
        assistPropertyUuid1List,
        assistClassificationUuid2,
        assistPropertyUuid2List,
        assistClassificationUuid3,
        assistPropertyUuid3List,
        batchUuidList: chooseBatchCard,
        pageNum: detailCurrentPage,
        pageSize: Limit.MXB_PAGE_SIZE,
    }),resp=>{
        if (showMessage(resp)) {
            dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
            dispatch({
                type:ActionTypes.SET_INVENTORY_MXB_DATA,
                dataList:resp.data.detail.detailList,
                balanceData:resp.data.detail,
                detailCurrentPage: resp.data.detail.currentPage ? resp.data.detail.currentPage : 1,
                detailPages: resp.data.detail.pages ? resp.data.detail.pages : 1,
            })
        }
    })
}
export const changeJrAbstract = (value) =>dispatch=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_MXB_JR_ABSTRACT,
        value
    })
}
export const handleInventoryMxbChooseStatus = (value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANDLE_INVENTORY_MXB_CHOOSE_STATUS,
        value
    })
}
export const changeInventoryMxbType=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CHANGE_INVENTORY_MXB_TYPE,
        value
    })
}
export const getOtherTypeStockStore = () => (dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get("issuedate")
    const endissuedate = getState().inventoryMxbState.get("endissuedate")
    dispatch(getDecimalScale())
    fetchApi('getInventoryMxbStockStore','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        isType:true
    }),resp=>{
        if(showMessage(resp)){
            const otherTypeStockStoreValue = getState().inventoryMxbState.get('otherTypeStockStoreValue')
            let hasItem = false
            const loop = (data)=>data.map(item=>{
                if(item.uuid == otherTypeStockStoreValue){
                    hasItem = true
                }
                if(item.childList.length > 0){
                    loop(item.childList)
                }
            })
            loop(resp.data.storeList)
            if(hasItem){
                dispatch({
                    type:ActionTypes.SET_OTHER_TYPE_STOCK_STORE_LIST,
                    list:resp.data.storeList,
                    value:otherTypeStockStoreValue
                })
                dispatch(getOtherTypeStockCategory(otherTypeStockStoreValue))
            }else{
                let storeCardUuid = resp.data.storeList.length?resp.data.storeList[0].uuid:''
                dispatch({
                    type:ActionTypes.SET_OTHER_TYPE_STOCK_STORE_LIST,
                    list:resp.data.storeList,
                    value:storeCardUuid
                })
                dispatch(getOtherTypeStockCategory(storeCardUuid))
            }
        }
    })
}
export const getOtherTypeStockCategory = (storeCardUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get("issuedate")
    const endissuedate = getState().inventoryMxbState.get("endissuedate")
    fetchApi('getInventoryMxbStockCategory','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        isType:true,
        storeCardUuid:storeCardUuid?storeCardUuid:""
    }),resp=>{
        if(showMessage(resp)){
            let hasItem = false
            const inventoryMxbState = getState().inventoryMxbState
            const categoryValue = inventoryMxbState.get('categoryValue')
            const loop = (data, upperUuid) => data.map((item, i) => {
                if(`${upperUuid}-${item.uuid}`=== categoryValue){
                    hasItem = true
                }
                if (item.childList && item.childList.length) {
                    loop(item.childList,`${upperUuid}-${item.uuid}`)
                }
            })
            loop(resp.data.categoryList,'')
            if(hasItem){
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_REFRESH,
                    data:resp.data.categoryList,
                    categoryValue,
                    topCategoryUuid:inventoryMxbState.get('topCategoryUuid'),
                    subCategoryUuid:inventoryMxbState.get('subCategoryUuid')
                })
                dispatch(getOtherTypeStockCardDetail(storeCardUuid,inventoryMxbState.get('topCategoryUuid'),inventoryMxbState.get('subCategoryUuid')))
            }else{
                dispatch({
                    type:ActionTypes.SET_INVENTORY_MXB_CATEGORY_REFRESH,
                    data:resp.data.categoryList,
                    categoryValue:'全部',
                    topCategoryUuid:'',
                    subCategoryUuid:''
                })
                dispatch(getOtherTypeStockCardDetail(storeCardUuid,'',''))
            }
        }
    })
}
export const getOtherTypeStockCardDetail=(storeCardUuid,topCategoryUuid,subCategoryUuid,currentPage = 1)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get("issuedate")
    const endissuedate = getState().inventoryMxbState.get("endissuedate")
    fetchApi('getInventoryMxbCardDetail','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        isType:true,
        storeCardUuid:storeCardUuid?storeCardUuid:'',
        topCategoryUuid:topCategoryUuid?topCategoryUuid:'',
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        needPeriod:'true',
        pageNum:currentPage,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
    }),resp=>{
        if(showMessage(resp)){
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp))
            const stockCardUuid = getState().inventoryMxbState.get("cardValue")
            const stockCardMessage = getState().inventoryMxbState.get("stockCardMessage")
            let hasCardItem = false
            resp.data.cardList.map(item => {
                if(item.stockCardUuid == stockCardUuid){
                    hasCardItem = true
                }
            })
            if(hasCardItem){
                dispatch({
                    type:ActionTypes.REFRESH_INVENTORY_MXB_CARD_LIST,
                    cardList:resp.data.cardList,
                    cardValue:stockCardUuid,
                    stockCardMessage,
                    cardPageNum: resp.data.currentPage ? resp.data.currentPage : 1,
                    cardPages: resp.data.pages ? resp.data.pages : 1,
                })
                dispatch(getOtherTypeStockTypeList(storeCardUuid,topCategoryUuid,subCategoryUuid,stockCardUuid))
            }else{
                dispatch(changeInventoryMxbCardInit())
                // let cardValue = resp.data.cardList.length?resp.data.cardList[0].stockCardUuid:''
                const firstCardValue = resp.data.cardList.length > 1 ? (resp.data.cardList[0].stockCardUuid ? resp.data.cardList[0].stockCardUuid : resp.data.cardList[1].stockCardUuid) : ''
                dispatch({
                    type:ActionTypes.REFRESH_INVENTORY_MXB_CARD_LIST,
                    cardList:resp.data.cardList,
                    cardValue:firstCardValue,
                    stockCardMessage: resp.data.cardList.length > 1 ? (resp.data.cardList[0].stockCardUuid ? resp.data.cardList[0] : resp.data.cardList[1]) : {
                        stockCardUuid:'',
                        openAssist: false,
                        openBatch: false,
                        openSerial: false,
                        openShelfLife: false,
                        sockCardName: "",
                    },
                    cardPageNum: resp.data.currentPage ? resp.data.currentPage : 1,
                    cardPages: resp.data.pages ? resp.data.pages : 1,
                })
                dispatch(getOtherTypeStockTypeList(storeCardUuid,topCategoryUuid,subCategoryUuid,firstCardValue))

            }
        }
    })
}
export const getOtherTypeStockTypeList = (storeCardUuid,topCategoryUuid,subCategoryUuid,stockCardUuid)=>(dispatch,getState)=>{
    const issuedate = getState().inventoryMxbState.get("issuedate")
    const endissuedate = getState().inventoryMxbState.get("endissuedate")
    fetchApi('getInventoryTypeList','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        isType:true,
        storeCardUuid:storeCardUuid?storeCardUuid:'',
        topCategoryUuid:topCategoryUuid?topCategoryUuid:'',
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        stockCardUuid:stockCardUuid?stockCardUuid:'',
    }),resp=>{
        if(showMessage(resp)){
            let typeListValue = getState().inventoryMxbState.get("typeListValue")
            let hasItem = false
            const loop = (data)=>data.map(item=>{
                if(item.acId === typeListValue){
                    hasItem =true
                }
                if (item.childList && item.childList.length) {
                    loop(item.childList)
                }
            })
            loop(resp.data.typeList)
            if(hasItem){
                dispatch({
                    type:ActionTypes.SET_OTHER_TYPE_MXB_STOCK_TYPE_LIST,
                    typeListValue:typeListValue,
                    list:resp.data.typeList
                })
                dispatch(getOtherTypeMxbDataList(storeCardUuid,topCategoryUuid,subCategoryUuid,stockCardUuid,typeListValue))
            }else{
                dispatch({
                    type:ActionTypes.SET_OTHER_TYPE_MXB_STOCK_TYPE_LIST,
                    typeListValue:"全部",
                    list:resp.data.typeList
                })
                dispatch(getOtherTypeMxbDataList(storeCardUuid,topCategoryUuid,subCategoryUuid,stockCardUuid,''))
            }
        }
    })
}
export const getOtherTypeMxbDataList=(storeCardUuid,topCategoryUuid,subCategoryUuid,stockCardUuid,acId,currentPage)=>(dispatch,getState)=>{
    dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
    const inventoryMxbState = getState().inventoryMxbState
    const issuedate = inventoryMxbState.get("issuedate")
    const endissuedate = inventoryMxbState.get("endissuedate")
    const jrAbstract = inventoryMxbState.get('jrAbstract')
    const balanceChanged = inventoryMxbState.get('balanceChanged')
    const chooseAssistCard = inventoryMxbState.get("chooseAssistCard")
    const chooseBatchCard = inventoryMxbState.get("chooseBatchCard")
    const detailCurrentPage = inventoryMxbState.get("detailCurrentPage")
    const {
        assistClassificationUuid1,
        assistPropertyUuid1List,
        assistClassificationUuid2,
        assistPropertyUuid2List,
        assistClassificationUuid3,
        assistPropertyUuid3List
    } = getAssistObj(chooseAssistCard)

    fetchApi('getInventoryStockDetail','POST',JSON.stringify({
        begin:issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
        end: endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}`,
        isType:true,
        storeCardUuid:storeCardUuid?storeCardUuid:'',
        topCategoryUuid:topCategoryUuid?topCategoryUuid:'',
        subCategoryUuid:subCategoryUuid?subCategoryUuid:'',
        stockCardUuid:stockCardUuid?stockCardUuid:'',
        acId:acId ? acId:'',
        jrAbstract:jrAbstract?jrAbstract:'',
        assistClassificationUuid1,
        assistPropertyUuid1List,
        assistClassificationUuid2,
        assistPropertyUuid2List,
        assistClassificationUuid3,
        assistPropertyUuid3List,
        batchUuidList: chooseBatchCard,
        pageNum: detailCurrentPage,
        pageSize: Limit.MXB_PAGE_SIZE,

    }),resp=>{
        if(showMessage(resp)){
            dispatch({type:ActionTypes.SWITCH_LOADING_MASK})
            dispatch({
                type:ActionTypes.SET_INVENTORY_MXB_DATA,
                dataList:resp.data.detail.detailList,
                balanceData:resp.data.detail,
                detailCurrentPage: resp.data.detail.currentPage ? resp.data.detail.currentPage : 1,
                detailPages: resp.data.detail.pages ? resp.data.detail.pages : 1,
            })
            dispatch({
                type:ActionTypes.SET_OTHER_TYPE_MXB_BALANCE_DIRECTION,
                value:resp.data.detail.allBalanceDirection,
                changed:false
            })

        }
    })
}
export const setOtherTypeListValue=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_OTHER_TYPE_MXB_STOCK_TYPE_LIST_VALUE,
        value
    })
}
export const setOtherTypeStockStoreValue=(value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_OTHER_TYPE_MXB_STOCK_STORE_VALUE,
        value
    })
}
export const changeOtherTypeBalanceDirection=(value,changed)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_OTHER_TYPE_MXB_BALANCE_DIRECTION,
        value,
        changed
    })
}

export const getDecimalScale=()=>(dispatch)=>{
    // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getInventoryYebDecimalScale','GET','',json=>{
        // dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        dispatch({
            type:ActionTypes.CHANGE_DECIMAL_OF_CONFIG_MXB,
            receiveData:json.data.scale
        })
    })
}

export const changeCommonValue = (name,value) => ({
    type: ActionTypes.INVENTORY_MXB_CHANGE_COMMON_VALUE,
    name,
    value,
})
//获取存货明细表筛选批次列表
export const getInventoryMxbBatchList=( begin, end, stockCardUuid, storeCardUuid, inventoryType )=>(dispatch)=>{
    fetchApi('getInventoryMxbBatchList','POST',JSON.stringify({
        begin,
        end,
        stockCardUuid,
        storeCardUuid,
        isType: inventoryType === 'Inventory' ? false : true,
    }),json=>{
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.GET_INVENTORY_MXB_BATCH_LIST,
                receiveData:json.data.batchList
            })
        }

    })
}
//获取存货明细表筛选属性列表
export const getInventoryMxbAssistList=( begin, end, stockCardUuid, storeCardUuid, inventoryType )=>(dispatch)=>{
    fetchApi('getInventoryMxbAssistList','POST',JSON.stringify({
        begin,
        end,
        stockCardUuid,
        storeCardUuid,
        isType: inventoryType === 'Inventory' ? false : true,
        needPeriod: false,
    }),json=>{
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK,loadingType: 'minus'})
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.GET_INVENTORY_MXB_ASSIST_LIST,
                receiveData:json.data.assistList
            })
        }

    })
}
export const changeItemCheckboxCheck = (checked,uuid,curSelectUuidName,allList,isAll) => ({
    type: ActionTypes.INVENTORY_MXB_CHANGE_ITEM_CHECKBOX_CHECKED,
    checked,
    uuid,
    curSelectUuidName,
    allList,
    isAll,
})

export const filterCardClear = () => ({ type: ActionTypes.INVENTORY_MXB_FILTER_CARD_CLEAR })

export const changeInventoryMxbCardInit = (value) => ({
    type: ActionTypes.CHANGE_INVENTORY_MXB_CARD_VALUE,
    value
})
//获取序列号
export const getSerialList = (item,inventoryUuid,type,cb) => (dispatch,getState) => {
    const jrJvUuid = item.jrJvUuid
    let objStr = type === 'in' ? 'inUuid' : 'outJrJvUuid'
    if (!jrJvUuid) {
        cb && cb()
        return;
    }
    fetchApi('getSerialList','POST',JSON.stringify({inventoryUuid,[objStr]:jrJvUuid}),json => {
        if (showMessage(json)) {
            cb && cb(json.data)
        }
    })
}

export const changeInventoryMxbCommonValue = (place, value) => (dispatch) => {
    dispatch({
        type: ActionTypes.CHANGE_INVENTORY_COMMON_VALUE,
        place,
        value
    })

}

export const getSerialListRunningFollow = (stockCardUuid,serialUuid) => dispatch => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi('getInventoryMxbSerialListFollow', 'POST', JSON.stringify({
        stockCardUuid,
        serialUuid
    }), json => {
        if (showMessage(json)) {
            dispatch(changeCommonValue('serialFollow',fromJS(json.data.serialFollow)))
            dispatch(changeCommonValue('chooseSerialUuid',serialUuid))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeDetailCurrentPages = (value) => (dispatch) => {
    dispatch({
        type: ActionTypes.CHANGE_INVENTORY_DETAIL_PAGES_VALUE,
        value
    })

}
