import * as ActionTypes from './ActionTypes.js'
import { fromJS, toJS } from 'immutable'
import fetchApi from 'app/constants/fetch.account.js'
import { XFNVERSION } from 'app/constants/fetch.constant.js'
import { ROOTPKT } from 'app/constants/fetch.account.js'
import { showMessage, numberCalculate } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

import { notification, Modal } from 'antd'

import { NotificationModal } from 'app/containers/components/NotificationModal'

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

export const getCalaulateStockAmount = () => (dispatch,getState) => {
    const stockCardList = getState().editCalculateState.getIn(['CalculateTemp','stockCardList'])
    let amount = stockCardList.reduce((total,cur) => {
        const amount = cur.get('amount') && cur.get('amount')!=='.' ? Number(cur.get('amount')) : 0
        return  (total * 100 + amount * 100) / 100
    },0)
    dispatch(changeEditCalculateCommonString('Calculate','amount', amount.toFixed(2)))

}
export const changeCalculateStock = (stockCardList,index,dealType = 'add') => dispatch => {
    let stockCardListJ = stockCardList.toJS()
    if(dealType === 'add'){
        stockCardListJ.splice(index+1,0,{amount:'',uuid:''})
    }else{
        stockCardListJ.splice(index,1)
        dispatch(getCalaulateStockAmount())
    }
    dispatch(changeEditCalculateCommonString('Calculate','stockCardList',  fromJS(stockCardListJ)))
}

export const changeEditCalculateCommonString = (tab, place, value) => (dispatch) => {
    let placeArr = typeof place === 'string' ? [`${tab}Temp`, place] : [`${tab}Temp`, ...place ]
    if (place[0] === 'views') {
        placeArr = place
    }
    dispatch({
        type: ActionTypes.CHANGE_CALCULATE_COMMON_STRING,
        tab,
        placeArr,
        value
    })

}
export const getModifyStockPrice = (oriDate,stockPriceList,temp='',stockTemp = 'stockCardList',isAssembly = 'Assembly',newitem,isInsert = false) => (dispatch,getState) => {
    const editCalculateState = getState().editCalculateState
    const stockCardList = editCalculateState.getIn([`${temp}Temp`,stockTemp])
    const stockCardOtherList = editCalculateState.getIn([`${temp}Temp`,'stockCardOtherList'])
    const stockCardListSize = stockCardList.size
    const assemblySheet = editCalculateState.getIn(['StockBuildUpTemp','assemblySheet'])
    let hasCardUuid = false, postStockList = []
    let stockTempStoreUuid = ''
    if(temp === 'Stock'){
        const chooseWareHouseCardList = editCalculateState.getIn([`${temp}Temp`,'chooseWareHouseCardList'])
        const stockTempStore = chooseWareHouseCardList.find(v => v.get('warehouseStatus') === 'WAREHOUSE_STATUS_FROM').toJS()
        stockTempStoreUuid = stockTempStore.cardUuid || ''

    }
    stockPriceList && stockPriceList.map(item => {
        if(item.cardUuid){
            hasCardUuid = true
        }
        postStockList.push(
            {
                ...item,
                assistList: item.assistList ? item.assistList : [],
                batchUuid: item.batchUuid ? item.batchUuid : '',
                storeUuid: temp === 'Stock' ? stockTempStoreUuid : item.storeUuid
            }
        )
    })
    hasCardUuid && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    hasCardUuid && fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
        oriDate,
        stockPriceList: postStockList,
        canNegate: true
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            if(isAssembly === 'Assembly'){
                if(stockPriceList.length === 1){
                    assemblySheet.map((item,index) => {
                        let amount = 0
                        item.get('materialList').map((itemM,mIndex) => {
                            stockPriceList.length && stockPriceList.map((v,i) => {
                                if(itemM.get('materialUuid') === v.cardUuid && v.productIndex === index && v.materialIndex === mIndex){
                                    dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'materialList',mIndex,'referencePrice'], json.data[i].price))
                                    dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'materialList',mIndex,'referenceQuantity'], json.data[i].quantity))
                                }
                            })

                        })
                    })
                }else{
                    stockPriceList.length && stockPriceList.map((v,i) => {
                        const quantity = v.quantity
                        let basicUnitQuantity = 1
                        if(v.unit){
                            if(v.unit.unitUuid === v.unitUuid){
                                basicUnitQuantity = v.unit.basicUnitQuantity ? v.unit.basicUnitQuantity : 1
                            }else{
                                v.unit.unitList && v.unit.unitList.map(unitItem => {
                                    if(unitItem.uuid === v.unitUuid){
                                        basicUnitQuantity = unitItem.basicUnitQuantity ? unitItem.basicUnitQuantity : 1
                                    }
                                })
                            }
                        }
                        let positiveAmount = v.amount
                        // v.price = json.data[i].price
                        const finallyPrice = basicUnitQuantity ? numberCalculate(basicUnitQuantity,json.data[i].price,4,'multiply',4) : json.data[i].price
                        const positivePrice = finallyPrice > 0 ? finallyPrice : ''
                        const materialAmount = basicUnitQuantity ? numberCalculate(quantity,finallyPrice,4,'multiply') : numberCalculate(quantity,json.data[i].price,4,'multiply')
                        positiveAmount = finallyPrice > 0 ? materialAmount : ''

                        if(isInsert){
                            console.log(1111);
                            v.price = positivePrice
                            v.amount = positiveAmount
                        }
                        v.referencePrice = json.data[i].price
                        v.referenceQuantity = json.data[i].quantity
                        v.isOpenQuantity = v.isOpenQuantity ? v.isOpenQuantity : v.isOpenedQuantity
                        v.materialUuid = v.materialUuid ? v.materialUuid : v.cardUuid
                        v.basicUnitQuantity = basicUnitQuantity
                        newitem[v.parentIndex].uuid = newitem[v.parentIndex].uuid ? newitem[v.parentIndex].uuid : newitem[v.parentIndex].cardUuid
                        newitem[v.parentIndex].productUuid = newitem[v.parentIndex].productUuid ? newitem[v.parentIndex].productUuid : newitem[v.parentIndex].cardUuid
                        newitem[v.parentIndex].curQuantity = newitem[v.parentIndex].curQuantity ? newitem[v.parentIndex].curQuantity : newitem[v.parentIndex].quantity
                        newitem[v.parentIndex].materialList = newitem[v.parentIndex].materialList ? newitem[v.parentIndex].materialList : newitem[v.parentIndex].childCardList
                        newitem[v.parentIndex].amount = numberCalculate(newitem[v.parentIndex].amount ? newitem[v.parentIndex].amount : 0 ,v.amount)
                        newitem[v.parentIndex].price = numberCalculate(newitem[v.parentIndex].amount,newitem[v.parentIndex].curQuantity,4,'divide',4)
                    })
                    dispatch(editCalculateActions.changeEditCalculateCommonState('StockBuildUpTemp', 'assemblySheet', fromJS(newitem)))
                }

            }else if(isAssembly === 'stock'){
                stockCardList.map((item,index) => {
                    dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'referencePrice'], json.data[index].price))
                    dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'referenceQuantity'], json.data[index].quantity))
                })
                stockCardOtherList.map((item,index) => {
                    dispatch(changeEditCalculateCommonString(temp, ['stockCardOtherList',index,'referencePrice'], json.data[index+stockCardListSize].price))
                    dispatch(changeEditCalculateCommonString(temp, ['stockCardOtherList',index,'referenceQuantity'], json.data[index+stockCardListSize].quantity))
                })

            }else{
                dispatch({
                    type: ActionTypes.CHANGE_STOCKCARD_REFERENCE_PRICE_QUNATITY,
                    temp,
                    stockTemp,
                    stockCardList,
                    receivedData: json.data
                })

            }


        }
    })
}

//存货导入
export const getFileUploadFetch = (form,categoryUuid,oriDate,temp,isCount,isProduct,isAssembly) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const stockCardList = getState().editCalculateState.getIn([`${temp}Temp`,'stockCardList'])
    const oriState = getState().editCalculateState.getIn([`${temp}Temp`,'oriState'])
    // const beJZ = 'beJZ=' +  (oriState === 'STATE_YYSR_ZJ' ? true : false)
    const beJZ = 'beJZ=' + (isCount ? false : true)

    const chooseWareHouseCardList = getState().editCalculateState.getIn([`${temp}Temp`,'chooseWareHouseCardList'])
    let warehouseUuid = []
    chooseWareHouseCardList && chooseWareHouseCardList.map( v => {
        if(v.get('warehouseStatus') && v.get('warehouseStatus') === 'WAREHOUSE_STATUS_FROM'){
            warehouseUuid = v.get('cardUuid')
        }
    })
    let source = 'source=desktop'
    let network = 'network=wifi'
    const psiSobId = `psiSobId=${sessionStorage.getItem('psiSobId')}`
	const psiCorpId = `psiCorpId=${sessionStorage.getItem('corpId')}`

	const isPlayStr = `isPlay=${global.isPlay}`
	const version = `version=${XFNVERSION}`
	const timestamp = `timestamp=${new Date().getTime()}`
    categoryUuid = 'categoryUuid=' + categoryUuid
    oriDate = 'oriDate=' + oriDate
	let ssid = `ssid=''`

	if (global.isInWeb) {
		source = 'source=webDesktop'
	}

	if (global.ssid) {
		ssid = `ssid=${global.ssid}`
	}
    const baseUrl = isCount ? '/data/import/jr/inventory/adjustment?' : //盘点
                    (
                        isAssembly ? '/data/import/jr/inventory/assembly?' :
                        (
                            temp === 'Stock' ? `/data/import/stock/jr/inventory/transfer?warehouseUuid=${warehouseUuid}&` : //存货调拨
                                (
                                    temp === 'Balance' ? `/data/import/stock/with/insert?jrState=${oriState}&` :
                                    '/data/import/stock/with/insert?'
                                )
                        )
                    )

    const url = `${ROOTPKT}` + baseUrl + [oriDate, network, source, psiSobId, version, timestamp, isPlayStr, ssid, categoryUuid, beJZ].join('&')
    const option = {
        method: 'POST',
        credentials: 'include',
        body: form
    }
	fetch(url, option)
	.then(res => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		if (res.status === 200) {
            return res.json()
		} else {
			return {
				code: '-2',
				message: `通信异常，服务器返回码${res.status}`
			}
		}

	})
    .then(json => {
        if (json.code === 1) {
            notification.open({
                key: 'errNotification',
                message: '系统发生了未知错误',
                placement: 'bottomRight',
                duration: null,
                description: NotificationModal(url, '200', json.code, json.message),
            });
        } else {
            if (!json.data) {
                Modal.confirm({
                    title: '提示',
                    content: json.message,
                  })
                 dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showMessageMask', false))
            }else{
                dispatch({
                    type: ActionTypes.AFTER_CALCULATE_INVENTORY_IMPORT,
                    receivedData:json,
                    temp: `${temp}Temp`,
                    stockTemp: isCount ? 'countStockCardList' : (isAssembly ? 'assemblySheet' : (isProduct ?  'stockCardOtherList' : 'stockCardList' ))
                })

            }
        }
    })
	.catch(err => {
		return {
			code: '-2',
			message: `系统无响应`
		}
	})
}

// 盘点
export const saveCountList = (countStockCardList,chooseWareHouseCard,needStockCardList,temp = 'BalanceTemp') => dispatch => {
    dispatch({
        type: ActionTypes.SAVE_CALCULATE_COUNT,
        stockCardList: countStockCardList,
        chooseWareHouseCard,
        needStockCardList,
        temp,
    })
}

// 存货辅助属性

// 修改时获取序列号
export const getSerialList = (item,index,type,cb) => (dispatch,getState) => {
    const inventoryUuid = item.get('cardUuid')
    const jrOriCardUuid = item.get('jrOriCardUuid')
    let objStr = type === 'in' ? 'inJrOriCardUuid' : 'outJrOriCardUuid'
    if (!jrOriCardUuid) {
        cb && cb()
        return;
    }
    fetchApi('getSerialList','POST',JSON.stringify({inventoryUuid,[objStr]:jrOriCardUuid}),json => {
        if (showMessage(json)) {
            cb && cb(json.data)
        }
    })
}
// 获取批次
export const getStockBatchList = (stockObj) => (dispatch,getState) => {
    const {inventoryUuid,sectionTemp,stockTemplate,index, materIndex } = stockObj
    const isAssembly = stockTemplate === 'material' ? true : false
    const batchList = getState().editRunningState.getIn(['flags','batchList'])
    fetchApi('getBatchList','POST',JSON.stringify({
        inventoryUuid,
        canUse: true
    }),json => {
        if (showMessage(json)) {
            isAssembly ?
            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'batchList'],fromJS(json.data.batchList) )) :
            dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,index,'batchList'],fromJS(json.data.batchList) ))
        }
    })
}
// 修改批次
export const modifyBatch = (stockObj,cb) => (dispatch,getState) => {
    const { batch,batchUuid,productionDate,expirationDate,inventoryUuid,sectionTemp,stockTemplate,index, materIndex,isAssembly, isProduct } = stockObj
    fetchApi('batchUsedCheck','GET',`inventoryUuid=${inventoryUuid}&batchUuid=${batchUuid}`,json => {
            if(showMessage(json)) {
                if (json.data.used) {
                    Modal.confirm({
                        title:'提示',
                        content:'原批次在期初值或流水中已被使用，修改后所有信息将同步修改。确认更改该批次的信息吗？',
                        className:'inventory-are-for-dom',
                        onOk() {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            fetchApi('modifyBatch','POST',JSON.stringify({
                                batch,
                                productionDate,
                                expirationDate,
                                inventoryUuid,
                                batchUuid
                                }),json => {
                                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                    if(showMessage(json,'show')) {
                                        cb && cb()
                                        isAssembly ?
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'batchList'],fromJS(json.data.batchList) )) :
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,index,'batchList'],fromJS(json.data.batchList) ))
                                    }
                            })
                        }
                    })
                } else {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    fetchApi('modifyBatch','POST',JSON.stringify({
                        batch,
                        productionDate,
                        expirationDate,
                        inventoryUuid,
                        batchUuid
                        }),json => {
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                            if(showMessage(json,'show')) {
                                cb && cb()
                                isAssembly ?
                                    isProduct ?
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'batchList'],fromJS(json.data.batchList) )) :
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'batchList'],fromJS(json.data.batchList) )) :
                                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,index,'batchList'],fromJS(json.data.batchList) ))
                            }
                    })
                }
            }
        })
}

//新增存货属性
export const insertAssist = (assistObj,cb) => dispatch => {
    const { classificationUuid,name,inventoryUuid, sectionTemp, stockTemplate, isAssembly, index, materIndex,assIndex, isProduct } = assistObj
    fetchApi('insertAssist','POST',JSON.stringify({
        name,
        classificationUuid,
        inventoryUuid
        }),json => {
            if(showMessage(json,'show')) {
                cb && cb(json.data,name)
                isAssembly ?
                    isProduct ?
                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'financialInfo','assistClassificationList',assIndex,'propertyList'],fromJS(json.data) )) :
                    dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, ['assemblySheet',index,'materialList',materIndex,'financialInfo','assistClassificationList',assIndex,'propertyList'],fromJS(json.data) )) :
                dispatch(editCalculateActions.changeEditCalculateCommonString(sectionTemp, [stockTemplate,index,'financialInfo','assistClassificationList',assIndex,'propertyList' ],fromJS(json.data) ))
            }
        })
}

// 获取存货卡片（分页）
export const getStockCardList = (stockCardObj) => (dispatch, getState) => {
    const { temp = 'StockTemp', isUniform = false, openQuantity = false, warehouseUuid = '', currentPage = 0 } = stockCardObj
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    const oriState = getState().editCalculateState.getIn([temp, 'oriState'])
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    const basicData = {
        sobId,
        categoryList: [],
        property: '0',
        isUniform: null,
        openQuantity,
        pageSize: Limit.MXB_CARD_PAGE_SIZE,
        currentPage
    }
    const data = warehouseUuid ?
    {
        ...basicData,
        haveQuantity:true,
        warehouseUuid,
    } : basicData
    fetchApi('getStockCategoryList', 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch({
                type: ActionTypes.CHANGE_CANUSE_STOCK_CARD_LIST,
                receivedData: json.data.result,
                canUseWarehouse: json.data.enableWarehouse,
                cardPageObj,
                temp,
            })
        }
    })

}
