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
    previewApprovalModalTemp: {
        carryoverCardList: [{}],
    },
    categoryData:{

    },
    allContactList: [],
    allProjectList: [],
    allInvetoryList: [],

    // 选择框里的类别和卡片
    contactSourceCategoryList: [],
    contactSourceCardList: [],
    projectSourceCategoryList: [],
    projectSourceCardList: [],
    invetorySourceCategoryList: [],
    invetorySourceCardList: [],
    warehouseSourceCategoryList: [],
   
    currentEditInvetoryIndex: 0,

    datailUuidList: [],
    jrUuidList: []
})

export default function handleEditRunningModalState(state = editRunningModalState, action) {
    return ({
        // [ActionTypes.CLEAR_SEARCH_APPROVAL_TEMP]      : () => editRunningModalState,
        [ActionTypes.CLEAR_SEARCH_APPROVAL_TEMP]      : () => {
            return state = state.set('contactSourceCategoryList', fromJS([]))
                                .set('contactSourceCardList', fromJS([]))
                                .set('projectSourceCategoryList', fromJS([]))
                                .set('projectSourceCardList', fromJS([]))
                                .set('invetorySourceCategoryList', fromJS([]))
                                .set('invetorySourceCardList', fromJS([]))
                                .set('warehouseSourceCategoryList', fromJS([]))
                                .set('allContactList', fromJS([]))
                                .set('allProjectList', fromJS([]))
                                .set('allInvetoryList', fromJS([]))

        },
        [ActionTypes.GET_APPROVAL_PROCESS_DETAIL_INFO]: () => {

            state = state.set('editRunningModalTemp', fromJS(action.receivedData))
                            .set('categoryData', fromJS(action.categoryData))
            
            if (action.datailList.length) {
                state = state.set('datailUuidList', fromJS(action.datailList))
            }

            return state
        },
        [ActionTypes.GET_APPROVAL_PROCESS_PREVIEW_DETAIL_INFO]: () => {

            state = state.set('previewApprovalModalTemp', fromJS(action.receivedData))
                            .set('categoryData', fromJS(action.categoryData))
            
            if (action.datailList.length) {
                state = state.set('datailUuidList', fromJS(action.datailList))
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
        // [ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_PROJECT_CARD_LIST]: () => {
        //     state = state.set('projectCardList', fromJS(action.receivedData))
		// 	return state
        // },
        // [ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_CONTACT_CARD_LIST]: () => {
        //     state = state.set('contactSourceCardList', fromJS(action.receivedData))
		// 	return state
        // },
        // [ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_STOCK_CARD_LIST]: () => {
        //     state = state.set('invetoryCardList', fromJS(action.receivedData))
		// 	return state
        // },
        [ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_WAREHOUSE_CARD_LIST]: () => {
            action.receivedData.forEach((v, i) => {
                v['cardName'] = v['name']
                v['key'] = `${v['code']} ${v['name']}`,
                v['value'] = v['uuid']
            })
            
            state = state.set('warehouseSourceCategoryList', fromJS(action.receivedData))
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
        // [ActionTypes.CHANGE_SEARCH_RUNNING_CALCULATE_COMMON_STRING]		       : () => {
            
        //     if (action.placeArr) {
        //         state = state.setIn(action.placeArr, action.value)
        //     }
        //     if (action.place) {
        //         state = state.set(action.place, action.value)
        //     }

        //     return state
        // },
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

    }[action.type] || (() => state))()
}