import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const editRunningModalState = fromJS({
    views: {
        showStockModal: false
    },
    editRunningModalTemp: {
        carryoverCardList: [{}],
    },
    categoryData:{

    },
    projectCardList: [],
    contactCardList: [],
    invetoryCardList: [],
    warehouseCardList: [],

    // 存货的批量选择
    MemberList: [],
    selectThingsList: [],
    thingsList: [],
    selectedKeys: '',
    selectList: [],
    selectItem: [],

    datailList: []
})

export default function handleEditRunningModalState(state = editRunningModalState, action) {
    return ({
        [ActionTypes.CLEAR_SEARCH_APPROVAL_TEMP]: () => editRunningModalState,
        [ActionTypes.GET_APPROVAL_PROCESS_DETAIL_INFO]: () => {

            state = state.set('editRunningModalTemp', fromJS(action.receivedData))
                            .set('categoryData', fromJS(action.categoryData))
            if (action.datailList.length) {
                state = state.set('datailList', fromJS(action.datailList))
            }
                            
            return state
        },
        [ActionTypes.CHANGE_APPROVAL_PROCESS_DETAIL_INFO_CATEGORY]: () => {

            state = state.set('editRunningModalTemp', action.editRunningModalTemp)
                            .set('categoryData', fromJS(action.categoryData))
            return state
        },
        [ActionTypes.CHANGE_APPROVAL_PROCESS_DETAIL_INFO_COMMON_STRING]: () => {
            state = state.setIn(['editRunningModalTemp', action.place], action.value)
            return state
        },
        [ActionTypes.CHANGE_APPROVAL_PROCESS_DETAIL_INFO_BILL_COMMON_STRING]: () => {
            state = state.setIn(['editRunningModalTemp', 'billList', 0, action.place], action.value)
            return state
        },
        [ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_PROJECT_CARD_LIST]: () => {
            state = state.set('projectCardList', fromJS(action.receivedData))
			return state
        },
        [ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_CONTACT_CARD_LIST]: () => {
            state = state.set('contactCardList', fromJS(action.receivedData))
			return state
        },
        [ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_STOCK_CARD_LIST]: () => {
            state = state.set('invetoryCardList', fromJS(action.receivedData))
			return state
        },
        [ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_WAREHOUSE_CARD_LIST]: () => {
            state = state.set('warehouseCardList', fromJS(action.receivedData))
			return state
        },
        [ActionTypes.SEARCH_APPROVAL_CHANGE_RUNNING_TAX_RATE]               : () => {
            let amount = action.amount || state.getIn(['editRunningModalTemp', 'jrAmount']) || 0
			if (action.value == '-1') {
				return state.setIn(['editRunningModalTemp', 'billList',0, 'tax'],'')
							.setIn(['editRunningModalTemp', 'billList',0, 'taxRate'], action.value)
			} else {
                console.log('sddf', (Number(amount) /(1 + Number(action.value)/100) * Number(action.value)/100).toFixed(2));
                
				return state.setIn(['editRunningModalTemp', 'billList',0, 'tax'], (Number(amount) /(1 + Number(action.value)/100) * Number(action.value)/100).toFixed(2))
							.setIn(['editRunningModalTemp', 'billList',0, 'taxRate'], action.value)
			}

        },
        [ActionTypes.CHANGE_SEARCH_APPROAL_EDIT_BILL_STATES]                  : () => {
            return state.setIn(['editRunningModalTemp','billList',0,'billState'],action.billState)
                        .setIn(['editRunningModalTemp','billList',0,'tax'],action.tax)
                        .setIn(['editRunningModalTemp','billList',0,'taxRate'],action.taxRate)
        },
        [ActionTypes.CHANGE_SEARCH_APPROVAL_STRING]                             : () => {
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        [ActionTypes.CHANGE_SEARCH_RUNNING_CALCULATE_COMMON_STRING]		       : () => {
            
            if (action.placeArr) {
                state = state.setIn(action.placeArr, action.value)
            }
            if (action.place) {
                state = state.set(action.place, action.value)
            }

            return state
        },
        // 选择项目单位
		[ActionTypes.CHARGE_SEARCH_APPROVAL_ITEM_CHECKBOX_CHECK]               : () => {
            const showLowerList = state.get('selectList')
            const selectItemList = state.get('selectItem')
            const {
                uuid,
                name,
                code,
                isOpenQuantity,
                unit,
                unitPriceList
                } = action
            if (!action.checked && showLowerList.findIndex(v => v === action.uuid) === -1) {
                    // 原来没选
                    const newShowLowerList = showLowerList.push(action.uuid)
                    const newSelectItemList = selectItemList.push(fromJS({uuid,
                    name,
                    code,
                    isOpenQuantity,
                    unit,
                    unitPriceList
                    }))
                    return state.set('selectList', newShowLowerList)
                                .set('selectItem', fromJS(newSelectItemList))
            } else if (action.checked) {
                    // 原来选了
                    const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                    const newSelectItemList = selectItemList.splice(showLowerList.findIndex(v => v === action.uuid), 1)

                    return state.set('selectList', newShowLowerList)
                                .set('selectItem', fromJS(newSelectItemList))
            }
            return state
        },
        [ActionTypes.CHANGE_SEARCH_APPROVAL_HIDE_CATEGORY_ITEM_CHECKBOX_CHECK]: () => {
            const showLowerList = state.get('selectList')
            const selectItemList = state.get('selectItem')
            const item = action.item
            const uuid = action.isAssembly ? item.productUuid : item.cardUuid ? item.cardUuid : item.uuid
            if (!action.checked && showLowerList.findIndex(v => v === uuid) === -1) {
                    // 原来没选
                    const materialList = item.materialList ? item.materialList : []
                    const newMaterialList = materialList.map(itemM => {
                        let basicUnitQuantity = 1
                        itemM.unitList && itemM.unitList.map(unitItem => {
                            if(unitItem.uuid === itemM.unitUuid){
                                basicUnitQuantity = unitItem.basicUnitQuantity ? unitItem.basicUnitQuantity : 1
                            }
                        })
                        return {
                            ...itemM,
                            basicUnitQuantity
                        }

                    })

                    const newShowLowerList = showLowerList.push(uuid)
                    const newSelectItemList = selectItemList.push(fromJS({
                        ...item,
                        index: action.index,
                        uuid:uuid,
                        allUnit:item.unit ? item.unit : '',
                        unitUuid:item.unitUuid ? item.unitUuid : item.unit ? item.unit.unitList.length ? '' : item.unit.uuid ? item.unit.uuid : '' : '',
                        unitName:item.unitName ? item.unitName : item.unit ? item.unit.unitList.length ? '' : item.unit.name ? item.unit.name : '' : '',
                        materialList: newMaterialList,
                        oriMaterialList: newMaterialList ? newMaterialList : [],
                        quantity: item.quantity ? item.quantity : '',
                        afterQuantity: item.afterQuantity ? item.afterQuantity : ''
                    }))
                    return state.set('selectList', newShowLowerList)
                                .set('selectItem', fromJS(newSelectItemList))
            } else if(action.checked) {
                    // 原来选了
                    const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === uuid), 1)
                    const newSelectItemList = selectItemList.splice(showLowerList.findIndex(v => v === uuid), 1)

                    return state.set('selectList', newShowLowerList)
                                .set('selectItem', fromJS(newSelectItemList))
            }
            return state
        },
        [ActionTypes.CHANGE_SEARCH_APPROVAL_HIDE_CATEGORY_ITEM_CHECKBOX_CHECK_ALL]: () => {


            

            if (action.checked) {
                // 原来全选
                return state.set('selectList', fromJS([]))
                                .set('selectItem', fromJS([]))
            } else {

                let newShowLowerList = fromJS([])
                let newSelectItemList = fromJS([])

                action.allList && action.allList.forEach(v => {
                    const item = v
                    const uuid = action.isAssembly ? item.productUuid : item.cardUuid ? item.cardUuid : item.uuid
                    const materialList = item.materialList ? item.materialList : []
                    const newMaterialList = materialList.map(itemM => {
                        let basicUnitQuantity = 1
                        itemM.unitList && itemM.unitList.map(unitItem => {
                            if(unitItem.uuid === itemM.unitUuid){
                                basicUnitQuantity = unitItem.basicUnitQuantity ? unitItem.basicUnitQuantity : 1
                            }
                        })
                        return {
                            ...itemM,
                            basicUnitQuantity
                        }

                    })

                    newShowLowerList = newShowLowerList.push(uuid)
                    newSelectItemList = newSelectItemList.push(fromJS({
                        ...item,
                        index: action.index,
                        uuid:uuid,
                        allUnit:item.unit ? item.unit : '',
                        unitUuid:item.unitUuid ? item.unitUuid : item.unit ? item.unit.unitList.length ? '' : item.unit.uuid ? item.unit.uuid : '' : '',
                        unitName:item.unitName ? item.unitName : item.unit ? item.unit.unitList.length ? '' : item.unit.name ? item.unit.name : '' : '',
                        materialList: newMaterialList,
                        oriMaterialList: newMaterialList ? newMaterialList : [],
                        quantity: item.quantity ? item.quantity : '',
                        afterQuantity: item.afterQuantity ? item.afterQuantity : ''
                    }))
                })

                
                return state.set('selectList', newShowLowerList)
                            .set('selectItem', fromJS(newSelectItemList))

            }
            return state
        },

    }[action.type] || (() => state))()
}