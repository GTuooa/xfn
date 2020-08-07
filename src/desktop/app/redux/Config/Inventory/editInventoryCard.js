import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { inventoryCardTemp } from '../common/originData.js'

//生产环境应当设置为空
const inventoryCardState = fromJS({
	views: {
		insertOrModify: 'insert',
		fromPage: 'inventory', // 哪个页面的新增
		standardList:[],
		customList:[],
		warehouseList:[],
		selectedKeys:[],
		stockList:[],
		selectList: [],
		selectItem: [],
		MemberList:[],
		thingsList:[],
		allAssistClassificationList:[],
		materialSelectedKeys:'all',
		serialPlaceArr:[],
		serialList:[],
		batchList:[]
    },
    tags: [], // 卡片新增时使用
    inventoryCardTemp: {
        code: "",
        name: "",
        inventoryNature: 5,
		inventoryAcId:'1405',
		inventoryAcName: '库存商品',
        opened: '',
        remark: '',
        isAppliedSale: false,
        isAppliedPurchase: false,
        isAppliedProduce: false, // 后端删除
        categoryTypeList: [],
		contacterInfo: false,
		isCheckOut: false,
		warehouseList:[],
		openList:[],
		isOpenedQuantity:false,
		isUniformPrice:true,
		unit:{
			name:'',
			isStandard:false,
			uuid:'',
			unitList:[]
		},
		CurUnit:{},
		openedQuantity:'',
		unitPriceList:[{type:1},{type:2}],
		financialInfo:{
			assistClassificationList:[],
			batchList:[],
		},
    }
})

export default function handleEditInventoryCard(state = inventoryCardState, action) {
	return ({
		[ActionTypes.INIT_ADD_INVENTORY_STATE]        : () => state.set('inventoryCardTemp', fromJS(inventoryCardState.get('inventoryCardTemp'))),
		[ActionTypes.BEFORE_ADD_INVENTORY_CONF_CARD_INVENTORY]        : () => {
            state = state.set('tags', action.originTags)
							.setIn(['views', 'insertOrModify'], 'insert')
							.set('inventoryCardTemp',inventoryCardState.get('inventoryCardTemp'))
							.setIn(['inventoryCardTemp', 'isCheckOut'], action.data.isCheckOut)
							.setIn(['inventoryCardTemp', 'defaultAc'], fromJS(action.data.defaultAc))
							.setIn(['inventoryCardTemp', 'code'], fromJS(action.code))
							.setIn(['inventoryCardTemp', 'acId'], fromJS(action.code))
            return state
        },
        // 新增卡片之前----录入流水
		[ActionTypes.BEFORE_ADD_INVENTORY_CONF_CARD_RUNNING]          : () => {
            state = state.set('inventoryCardTemp', fromJS(inventoryCardState.get('inventoryCardTemp')))
						.set('tags', action.originTags)
						.setIn(['views', 'insertOrModify'], 'insert')
						.setIn(['inventoryCardTemp', 'code'], action.receivedData.code)
						.setIn(['views', 'fromPage'], 'otherPage')
						.setIn(['inventoryCardTemp','defaultAc'], fromJS(action.receivedData.defaultAc))
						// .setIn(['inventoryCardTemp', 'isCheckOut'], false)
            return state
        },
		[ActionTypes.BEFORE_EDIT_INVENTORY_CONF_CARD]                   : () => {
			const openList = action.data.openList
			const list = openList && openList.length && openList[0].childList && openList[0].childList.length ? openList[0].childList : []
			state = state.set('inventoryCardTemp', fromJS(action.data))
						.setIn(['views', 'insertOrModify'], 'modify')
						.setIn(['views', 'fromPage'], 'inventory')
						.setIn(['views', 'initOpenBatch'], action.data.financialInfo?action.data.financialInfo.openBatch:false)
						.setIn(['views', 'fromOpen'], action.fromOpen)
						.set('tags', fromJS(action.originTags))
						.setIn(['inventoryCardTemp','openList'],fromJS(action.enableWarehouse?list:openList))
						.setIn(['inventoryCardTemp','assemblyState'],action.assemblyState)
			if (action.data.isOpenedQuantity) {
				state = state.setIn(['inventoryCardTemp','CurUnit'], fromJS(action.data.unit))
			}
			if (action.assemblyState === 'OPEN' && !action.data.assemblySheet) {
				state = state.setIn(['inventoryCardTemp','assemblySheet'], fromJS({materialList:[{}]}))

			} else if (action.assemblyState === 'OPEN' && action.data.assemblySheet && !action.data.assemblySheet.materialList) {
				state = state.setIn(['inventoryCardTemp','assemblySheet','materialList'], fromJS([{}]))
			}
			action.data.categoryTypeList.map((item, index) => {
				state.get('tags').map((v, i) => {
					if (item.ctgyUuid === v.get('uuid')) {
						state = state.setIn(['tags', i, 'checked'], true)
									.setIn(['tags', i, 'selectUuid'], item.subordinateUuid)
									.setIn(['tags', i, 'selectName'], item.subordinateName)
									.setIn(['tags', i, 'tree'], fromJS(item.options))
						return
					}
				})
			})
			return state
		},
		[ActionTypes.CHANGE_INVENTORY_CARD_CONTENT]              : () => {
			if (typeof action.name === 'object') {
				state = state.setIn(['inventoryCardTemp', ...action.name], action.value)
			} else {
				state = state.setIn(['inventoryCardTemp', action.name], action.value)
			}
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_VIEWS]              : () => {
            state = state.setIn(['views', action.name], action.value)
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_NATURE]               : () => {
			// 修改存货性质
            state = state.setIn(['inventoryCardTemp', action.name], action.value)
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_INNER_STRING]               : () => {
			// 修改存货性质
            state = state.setIn(['inventoryCardTemp', ...action.arr], action.value)
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_CATEGORY_STATUS]         : () => {
            let subordinateUuid = ''
            state.get('tags').find((v, i) => {
                if (v.get('uuid') === action.item.get('uuid')) {
                    state = state.setIn(['tags', i, 'checked'], action.value)
                                 .setIn(['tags', i, 'tree'], fromJS(action.list))
                    if (v.get('selectUuid')) {
                        subordinateUuid = v.get('selectUuid')
                    }
                    if (action.value) { // 勾选
                        if (action.list[0].childList.length === 0) { //没有子类别默认为 全部
                            state = state.setIn(['tags', i, 'selectUuid'], action.list[0].uuid)
                                         .setIn(['tags', i, 'selectName'], action.list[0].name)
                            subordinateUuid = action.list[0].uuid
                        }
                    }
                    return
                }
            })

            if (action.value) {
                let info = fromJS({'ctgyUuid': action.item.get('uuid'), 'subordinateUuid': subordinateUuid})
                let list = state.getIn(['inventoryCardTemp', 'categoryTypeList']).push(info)
                state = state.setIn(['inventoryCardTemp', 'categoryTypeList'],list)
            } else {
                let curIndex = state.getIn(['inventoryCardTemp', 'categoryTypeList']).findIndex((v, i) => v.get('ctgyUuid') === action.item.get('uuid'))
                let list = state.getIn(['inventoryCardTemp', 'categoryTypeList']).delete(curIndex)
                state = state.setIn(['inventoryCardTemp', 'categoryTypeList'],list)
            }

            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_CATEGORY_TYPE]           : () => {
            state.get('tags').map((v, i) => {
                if (v.get('uuid') === action.item.get('uuid')) {
                    state = state.setIn(['tags', i, 'selectUuid'], action.uuid)
                                 .setIn(['tags', i, 'selectName'], action.name)
                    return
                }
            })
            state.getIn(['inventoryCardTemp', 'categoryTypeList']).map((v, i) => {
                if (v.get('ctgyUuid') === action.item.get('uuid')) {
                    state = state.setIn(['inventoryCardTemp', 'categoryTypeList' , i, 'subordinateUuid'], action.uuid)
                }
            })
            return state
        },

		// 保存卡片之后----存货
        [ActionTypes.SAVE_INVENTORY_CONF_CARD_INVENTORY]                         : () => {
            if (action.flag === 'insertAndNew') {
				const defaultAc = state.getIn(['inventoryCardTemp','defaultAc'])
                state = state.set('inventoryCardTemp',inventoryCardState.get('inventoryCardTemp'))
							.setIn(['inventoryCardTemp', 'defaultAc'], state.getIn(['inventoryCardTemp', 'defaultAc']))
							.setIn(['inventoryCardTemp', 'categoryTypeList'], state.getIn(['inventoryCardTemp', 'categoryTypeList']))
							.setIn(['inventoryCardTemp', 'code'], action.autoIncrementCode)
            }
            return state
        },
        // 保存卡片之后----录入流水
		[ActionTypes.SAVE_INVENTORY_CONF_CARD_RUNNING]                         : () => {
            // state = state.set('cardList', fromJS(action.list))

            if (action.flag === 'insertAndNew') {
                state = state.setIn(['inventoryCardTemp', 'name'], '')
                             .setIn(['inventoryCardTemp', 'code'], action.autoIncrementCode)
            }
            return state
        },
		// [ActionTypes.INIT_UNIT_STATE]                         : () => {
        //     return state.set('unit',inventoryCardState.getIn(['inventoryCardTemp','unit']))
        // },
		// 选择项目单位
		[ActionTypes.IVNENTORY_CHARGE_ITEM_CHECKBOX_SELECT]               : () => {
				const showLowerList = state.getIn(['views', 'selectList'])
				const selectItemList = state.getIn(['views', 'selectItem'])
				const {
					uuid,
					name,
					code,
					unitList,
					} = action
				if (!action.checked && showLowerList.findIndex(v => v === action.uuid) === -1) {
						// 原来没选
						const newShowLowerList = showLowerList.push(action.uuid)
						const newSelectItemList = selectItemList.push(fromJS({uuid,
						name,
						code,
						unitList
						}))
						return state.setIn(['views', 'selectList'], newShowLowerList)
									.setIn(['views', 'selectItem'], fromJS(newSelectItemList))
				} else if (action.checked) {
						// 原来选了
						const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
						const newSelectItemList = selectItemList.splice(showLowerList.findIndex(v => v === action.uuid), 1)

						return state.setIn(['views', 'selectList'], newShowLowerList)
									.setIn(['views', 'selectItem'], fromJS(newSelectItemList))
				}
				return state
		},
		[ActionTypes.CHOOSE_ASSIST_UNIFORM]               : () => {
			const assistClassificationList = state.getIn(['inventoryCardTemp','financialInfo', 'assistClassificationList']) || fromJS([])
			const newAssistClassificationList = assistClassificationList.map(v => {
				if (action.uuidList.some(w => w === v.get('uuid'))) {
					v = v.set('isUniform',action.bool)
				} else {
					v = v.set('isUniform',!action.bool)
				}

				return v
			})
			return state.setIn(['inventoryCardTemp','financialInfo', 'assistClassificationList'],newAssistClassificationList)
		},
		[ActionTypes.EMPTY_WAREHOUSE_LIST_QUANTITY]               : () => {
			const warehouseList = state.getIn(['inventoryCardTemp','openList']) || fromJS([])
			const loop = (list) => {
				return list.map(v => {
					if (v.get('childList') && v.get('childList').size) {
						return v.set('childList',loop(v.get('childList')))
					} else {
						return v.set('openedQuantity',0)
					}
					})
			}
			const list = loop(warehouseList)
			return state.setIn(['inventoryCardTemp','openList'],list)

		},



	}[action.type] || (() => state))()
}
