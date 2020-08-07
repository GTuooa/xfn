import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { inventoryHighTypeTemp, inventoryCardTypeTemp, inventoryCard, inventorySettingBtnStatus } from '../common/originData.js'

//生产环境应当设置为空
const inventoryConfState = fromJS({
	views: {
        iframeload: false,
        showMessageMask: false,
        totalNumber: 0,
        curNumber: 0,
        importKey: '',
		activeTapKey: '全部',
		activeTapKeyUuid: '',  // 当前高亮的大类别
		activeInventoryType: '', // 当前高亮的大类别
		activeInventoryTypeUuid: '', // 新增大类别高亮的类别
		activeTreeKeyUuid: '', // 新增大类别高亮的类别
		typeTreeSelectList: [],
		cardSelectList: [],  // 选中的卡片的uuid
		selectTypeId: '',  // 树形选择选中的
		selectTypeName: '', // 树形选择选中的
		chImportantStatus: '',
		searchContent:'',
		currentPage:1,
		pageCount:1,
		regretResultList:[],
		regretResultIndex:0,
		usedCardList:[],
		cardTypeList:[],
		cardList:[],
		categoryList:[],

    },
    'originTags': [],
	'cardList': [],
	'typeTree': [],
    'inventoryHighTypeTemp': {
        "name": '',
        "isAppliedSale": false,
        "isAppliedPurchase": false,
        'isAppliedProduce': false, // 后端删除
        "isAppliedWater": false,
        "isAppliedInvoicing": false,
    },
    'inventoryCardTypeTemp':{
        "parentUuid": '',
        "name": '',
        "remark": '',
        "ctgyUuid" : '',
        "parentName": '',
        "uuid": ''
    },
    'inventorySettingBtnStatus':{
        isAdd: false,
        isDelete: false,
        treeUuid: '',
        treeName: '全部',
        isUp: false,
        isDown: false,
        upUuid: '',
        downUuid: '',
        isEdit: false,
        parentUuid: ''
    },

    importresponlist: {
        failJsonList: [],
        successJsonList: [],
        mediaId: ''
    },
    message: '',
})

export default function handleInventoryConfState(state = inventoryConfState, action) {
	return ({
		[ActionTypes.INIT_INVENTORY_CONF]						          : () => inventoryConfState,
		// 获取存货数据
		[ActionTypes.GET_INVENTORY_CONFIG_INIT]                           : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid': ''})
            state = state.set('originTags', fromJS(action.title))
						.set('cardList', fromJS(action.cardList))
						.set('views', inventoryConfState.get('views'))
						.setIn(['views','enableWarehouse'],action.enableWarehouse)
						.setIn(['views','pageCount'],action.pageCount)
            return state
        },
		[ActionTypes.CHANGE_ACTIVE_INVENTORY_CONF_HIGH_TYPE]            : () => {
			state = state.setIn(['views', 'activeInventoryType'], action.name)
						.setIn(['views', 'activeInventoryTypeUuid'], action.uuid)
						.setIn(['views', 'activeTapKey'], action.name)
						.setIn(['views', 'activeTapKeyUuid'], action.uuid)
						.setIn(['views', 'selectTypeId'], '')
						.setIn(['views', 'selectTypeName'], '')
						.setIn(['views', 'cardSelectList'], fromJS([]))
						.setIn(['views', 'currentPage'], action.currentPage || 1)
						.setIn(['views', 'pageCount'], action.pageCount || 1)
						.setIn(['views', 'searchContent'], action.condition)
						.setIn(['views', 'enableWarehouse'], action.enableWarehouse || state.getIn(['views', 'enableWarehouse']))
						.set('cardList', fromJS(action.cardList))
						.set('typeTree', fromJS(action.treeList))

			if (action.setDefault) {
				state = state.setIn(['views', 'selectTypeId'], action.treeList[0].uuid)
							.setIn(['views', 'selectTypeName'], action.treeList[0].name)
			}
			return state
		},
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_USED_STATUS]           : () => {
            state.get('cardList').map((item, index) => {
                if (item.get('uuid') === action.uuid) {
                    state = state.setIn(['cardList', index, 'used'], action.used)
                }
            })
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_ASSEMBLY_STATUS]           : () => {
			state.get('cardList').map((item, index) => {
                if (item.get('uuid') === action.uuid) {
                    state = state.setIn(['cardList', index, 'assemblyState'], action.used?'OPEN':'CLOSE')
                }
            })
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_BOX_STATUS]            : () => {
            const cardList = state.get('cardList')
            const cardSelectList = state.getIn(['views', 'cardSelectList'])
            cardList.find((item, index) => {
                if (item.get('uuid') === action.uuid) {
                    state = state.setIn(['cardList', index, 'checked'], action.status)
                }
            })
            if (action.status) {
                state = state.setIn(['views', 'cardSelectList'], state.getIn(['views', 'cardSelectList']).push(fromJS({'uuid': action.uuid})))
            } else {
                cardSelectList.forEach((item, index) => {
                    if (item.get('uuid') === action.uuid) {
                        state = state.setIn(['views', 'cardSelectList'], state.getIn(['views', 'cardSelectList']).delete(index))
                    }
                })
            }
            return state
        },
		[ActionTypes.SELECT_INVENTORY_CONF_CARD_ALL]         : () => {
            if (action.value) {
                state = state.setIn(['views', 'cardSelectList'], fromJS([]))
                state.get('cardList'). map((item,index) => {
                    state = state.setIn(['cardList',index,'checked'], false)
                })
            } else {
                state.get('cardList').map((item,index) => {
                    state = state.setIn(['views', 'cardSelectList'], state.getIn(['views', 'cardSelectList']).push(fromJS({'uuid': item.get('uuid')})))
                    state = state.setIn(['cardList', index, 'checked'], true)
                })
            }
            return state
        },
		[ActionTypes.DELETE_INVENTORY_CONF_CARD_LIST]                   : () => {
            state = state.set('cardList', fromJS(action.list))
                         .setIn(['views', 'cardSelectList'], fromJS([]))
                         .set('typeTree', fromJS(action.treeList))
            return state
        },
		[ActionTypes.SELECT_INVENTORY_CONF_CARD_BY_TYPE]                : () => {
            state = state.setIn(['views', 'selectTypeId'], action.uuid)
                         .setIn(['views', 'selectTypeName'], action.name)
                         .set('cardList', fromJS(action.list))
						 .setIn(['views', 'currentPage'], action.currentPage || 1)
						 .setIn(['views', 'pageCount'], action.pageCount || 1)
						 .setIn(['views', 'searchContent'], action.condition)
            return state
        },
		[ActionTypes.GET_INVENTORY_CONF_HIGH_TYPE_LIST]         : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid':''})
            state = state.set('originTags', fromJS(action.title))
            return state
        },
		// 大类别
		[ActionTypes.BEFORE_EDIT_INVENETORY_HIGH_TYPE]                     : () => {
			state = state.set('inventoryHighTypeTemp', fromJS(action.receivedData))
						.setIn(['views', 'activeInventoryType'], action.activeName)
						.setIn(['views', 'activeInventoryTypeUuid'], action.activeUuid)
			return state
		},
		[ActionTypes.BEFORE_INSERT_INVENTORY_CONF_HGIH_TYPE]            : () => {
			state = state.setIn(['views', 'activeInventoryType'], 'plus')
						.setIn(['views', 'activeInventoryTypeUuid'], '')
						.set('inventoryHighTypeTemp', fromJS(inventoryHighTypeTemp))
			return state
		},
		[ActionTypes.CHANGE_INVENTORY_CONF_HIGH_TYPE_CONTENT]           : () => {
			state = state.setIn(['inventoryHighTypeTemp', action.name], action.value)
			return state
		},
		[ActionTypes.AFTER_SAVE_INVENTORYSETTING_CONTENT]                  : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid':''})
            state = state.set('originTags', fromJS(action.title))

			if (action.insertOrModify === 'insert') {
				state = state.set('inventoryHighTypeTemp', fromJS(inventoryHighTypeTemp))
			}
            return state
        },
		[ActionTypes.DELETE_INVENTORY_CONF_HGIH_TYPE]                   : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid':''})
            state = state.set('originTags', fromJS(action.title))
						.setIn(['views', 'activeInventoryType'], '')
						.setIn(['views', 'activeInventoryTypeUuid'], '')
						.set('inventoryHighTypeTemp', fromJS(inventoryHighTypeTemp))
            return state
        },
		[ActionTypes.DELETE_CURRENT_INVENTORY_CONF_HGIH_TYPE]           : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid':''})
            state = state.set('originTags', fromJS(action.title))
						.set('views', inventoryConfState.get('views').set('activeInventoryType', '').set('activeInventoryTypeUuid', ''))
						.set('inventoryHighTypeTemp', fromJS(inventoryHighTypeTemp))
						.set('cardList', fromJS(action.cardList))
						.set('typeTree', fromJS(action.treeList))
            return state
        },

		// 保存存货卡片
		[ActionTypes.SAVE_INVENTORY_CONF_CARD_INVENTORY]                         : () => {
            // state = state.set('cardList', fromJS(action.list))
            return state
        },

		// 小类别
		[ActionTypes.BEFORE_ADD_INVENTORY_CONF_CARD_TYPE]             : () => {
            let typeTree = state.get('typeTree').toJS()

            const loop = (data) => data.map((item) => {
                item.checked = false
				if (item.childList.length) {
					loop(item.childList)
				}
            })

            loop(typeTree)

            state = state.set('typeTree', fromJS(typeTree))
						.setIn(['views', 'typeTreeSelectList'], fromJS([]))
						.set('inventorySettingBtnStatus', fromJS(inventorySettingBtnStatus))
						.setIn(['inventorySettingBtnStatus', 'treeUuid'], state.getIn(['typeTree', 0, 'uuid']))
						.setIn(['inventorySettingBtnStatus', 'parentUuid'], state.getIn(['typeTree', 0, 'uuid']))
            return state
        },
		[ActionTypes.BEFORE_INSERT_INVENTORY_CONF_CARD_TYPE]          : () => {
            state = state.set('inventoryCardTypeTemp', fromJS(inventoryCardTypeTemp))
                         .setIn(['inventoryCardTypeTemp', 'parentUuid'], state.getIn(['inventorySettingBtnStatus', 'treeUuid']))
                         .setIn(['inventoryCardTypeTemp', 'parentName'], state.getIn(['inventorySettingBtnStatus', 'treeName']))
                         .setIn(['inventorySettingBtnStatus', 'isAdd'], true)
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_TYPE_CONTENT]         : () => {
            state = state.setIn(['inventoryCardTypeTemp', action.name], action.value)
            return state
        },
		[ActionTypes.SELECT_INVENTORY_CONF_CARD_TYPE]                 : () => {
            state = state.setIn(['inventoryCardTypeTemp', 'parentName'], action.parentName)
                         .setIn(['inventoryCardTypeTemp', 'parentUuid'], action.parentUuid)
            return state
        },
		[ActionTypes.GET_INVENTORY_CONF_TYPE_CONTENT]                 : () => {
            state = state.set('inventoryCardTypeTemp', fromJS(action.data))
                         .setIn(['inventorySettingBtnStatus', 'isAdd'], false)
            if (action.isAll) {
                state = state.setIn(['inventorySettingBtnStatus', 'isEdit'], false)
                             .setIn(['inventorySettingBtnStatus', 'treeUuid'], action.uuid)
                             .setIn(['inventorySettingBtnStatus', 'treeName'], state.getIn(['typeTree', 0, 'name']))
                             .setIn(['inventorySettingBtnStatus', 'isUp'], false)
                             .setIn(['inventorySettingBtnStatus', 'isDown'], false)
            } else {
                state = state.setIn(['inventorySettingBtnStatus', 'isEdit'], true)
                state = checkTreeNodeIsUpDown(state, action.uuid)
            }
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_TYPE_BOX_STATUS]      : () => {
            state = state.setIn(['views', 'typeTreeSelectList'], fromJS(action.list))
            return state
        },
		[ActionTypes.INVENTORY_CONF_TYPE_DELETE_BTN_SHOW]             : () => {
            state = state.setIn(['inventorySettingBtnStatus', 'isDelete'], true)
            return state
        },
		[ActionTypes.CONFIRM_DELETE_INVENTORY_CONF_TYPE]              : () => {

            state = state.set('typeTree', fromJS(action.data))
            const treeUuid = state.getIn(['inventorySettingBtnStatus', 'treeUuid'])
            let treeNodeExit = false
            const loop = data => data.map((item) => {
                if (item.uuid === treeUuid) {
                    treeNodeExit = true
                }
                if (item.childList.length > 0) {
                    loop(item.childList)
                }
            })

            loop(action.data)

            if (!treeNodeExit) {
                state = state.set('inventorySettingBtnStatus', fromJS(inventorySettingBtnStatus))
							.setIn(['inventorySettingBtnStatus', 'treeUuid'], action.data[0].uuid)
            } else {
                state = checkTreeNodeIsUpDown(state, treeUuid)
            }
            state = state.setIn(['inventorySettingBtnStatus', 'isDelete'], false)
                         .setIn(['views', 'typeTreeSelectList'], fromJS([]))
            return state
        },
		[ActionTypes.CHANGE_INVENTORY_CONF_TYPE_POSITION]             : () => {
            state = state.set('typeTree', fromJS(action.list))
            const uuid = state.getIn(['inventorySettingBtnStatus', 'treeUuid'])
            state = checkTreeNodeIsUpDown(state, uuid)
            return state
        },
		[ActionTypes.CANCLE_INVENTORY_CONF_TYPE_BTN]                  : () => {
            state = state.setIn(['inventorySettingBtnStatus','isAdd'], false)
                         .setIn(['inventorySettingBtnStatus','isDelete'], false)
                         .set('inventoryCardTypeTemp', fromJS(action.data))
                         .setIn(['views', 'typeTreeSelectList'], fromJS([]))
            return state
        },
		[ActionTypes.INVENTORY_CONF_TYPE_DELETE_BTN_SHOW]            : () => {
            state = state.setIn(['inventorySettingBtnStatus', 'isDelete'], true)
            return state
        },
		[ActionTypes.SAVE_INVENTORY_CONF_CARD_TYPE]                  : () => {
            state = state.set('typeTree', fromJS(action.typeTree))
            if (action.btnFlag != 'new') { // 保存
                state = checkTreeNodeIsUpDown(state, action.uuid)
            } else {
                state = state.set('inventoryCardTypeTemp', fromJS(action.typeInfo))
                             .setIn(['inventorySettingBtnStatus', 'treeUuid'], action.typeInfo.uuid)
                             .setIn(['inventorySettingBtnStatus', 'isAdd'], false)
                             .setIn(['inventorySettingBtnStatus', 'isEdit'], true)
                state = checkTreeNodeIsUpDown(state, action.typeInfo.uuid)
            }
            return state
        },
		// 调整
        [ActionTypes.ADJUST_INVENTORY_CONF_CARD_TYPE_LIST]           : () => {
            state = state.set('cardList',fromJS(action.list))
                         .setIn(['views', 'cardSelectList'],fromJS([]))
            return state
        },

		// 导入
        [ActionTypes.BEFORE_CH_IMPORT]						            : () => state.setIn(['views', 'showMessageMask'], true),
        [ActionTypes.CLOSE_CH_IMPORT_CONTENT]				            : () => {
			state = state.setIn(['views', 'showMessageMask'], false)
						.setIn(['views', 'iframeload'], false)
						.setIn(['importresponlist','failJsonList'], fromJS([]))
						.setIn(['importresponlist','successJsonList'], fromJS([]))
						.setIn(['importresponlist','successSize'], 0)
						.setIn(['importresponlist','errorSize'], 0)
						.setIn(['importresponlist','allSize'], 0)
						.set('message', '')
			return state
		},
        [ActionTypes.AFTER_CH_IMPORT]						           : () => {
			state = !action.receivedData.code ?
				state.set('importresponlist', fromJS(action.receivedData.data)).setIn(['views', 'iframeload'], true).set('message', fromJS(action.receivedData.message)) :
				state.setIn(['views', 'iframeload'], true).set('message', fromJS(action.receivedData.message))

			return state
		},
        [ActionTypes.CHANGE_CH_IMPORT_NUM]					         : () =>  state.setIn(['views',action.name], action.value),
        [ActionTypes.CHANGE_CH_IMPORT_STATUS]					     : () =>  state.setIn(['views', 'chImportantStatus'], action.value),
		[ActionTypes.CHANGE_INVENTORY_CONF_CARD_CONTENT]              : () => {
            state = state.setIn(['views', action.name], action.value)
            return state
        },
		[ActionTypes.ADJUST_CATEGORY_ORDER_INVENTORY]                          :()=>{
			state = state.set('originTags', fromJS(action.payload))
			return state
		}
	}[action.type] || (() => state))()
}

const checkTreeNodeIsUpDown = (state, uuid) => {
    //获取选中节点名称，下标，父级uuid
    const list = state.get('typeTree').toJS()
    if (uuid != list[0].uuid) {
        let name = ''
        let selectList = []
        let selectIndex = ''
        let parentUuid = ''

        const loop = (data) => data.map((item,index) => {
            if (item.uuid === uuid) {
                name = item.name
                selectIndex = index
                parentUuid = item.parentUuid
            }
            if (item.childList.length > 0) {
                loop(item.childList)
            }
        })

        loop(list)

        state = state.setIn(['inventorySettingBtnStatus', 'treeUuid'], uuid)
                     .setIn(['inventorySettingBtnStatus', 'treeName'], name)
                     .setIn(['inventorySettingBtnStatus', 'parentUuid'], parentUuid ? parentUuid : '')

        //选中父级的子列表
		const loopParent = (data) => data.map((item,index) => {
			if (item.uuid === parentUuid) {
				selectList = item.childList
			}
			if (item.childList.length > 0) {
				loopParent(item.childList)
			}
		})

		loopParent(list)

		let upIndex = Number(selectIndex) - 1
		let downIndex = Number(selectIndex) + 1
		if (selectIndex === 0 || name === '未分类') {
			state = state.setIn(['inventorySettingBtnStatus','isUp'], false)
						.setIn(['inventorySettingBtnStatus','upUuid'], '')
		} else {
			state = state.setIn(['inventorySettingBtnStatus','isUp'], true)
						.setIn(['inventorySettingBtnStatus','upUuid'], selectList[upIndex].uuid)
		}

		if (selectIndex === selectList.length -1 || selectList[downIndex].name === '未分类') {
			state = state.setIn(['inventorySettingBtnStatus','isDown'], false)
						.setIn(['inventorySettingBtnStatus','downUuid'], '')
		} else {
			state = state.setIn(['inventorySettingBtnStatus','isDown'], true)
						.setIn(['inventorySettingBtnStatus','downUuid'], selectList[downIndex].uuid)
		}
	}
	return state
}
