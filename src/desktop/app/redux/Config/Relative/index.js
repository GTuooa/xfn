import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { relativeHighTypeTemp, relativeTypeBtnStatus, relativeTypeTemp } from '../common/originData.js'

//生产环境应当设置为空
const relativeConfState = fromJS({
	views: {
		activeTapKey: '全部',
		activeTapKeyUuid: '',  // 当前高亮的大类别
		activeRelativeType: '', // 当前高亮的大类别
		activeRelativeTypeUuid: '', // 新增大类别高亮的类别
		activeTreeKeyUuid: '', // 新增大类别高亮的类别
		typeTreeSelectList: [],
		cardSelectList: [],  // 选中的卡片的uuid
		selectTypeId: '',  // 树形选择选中的
		selectTypeName: '', // 树形选择选中的

		wlImportantStatus: '',
		iframeload: false,
        showMessageMask: false,
        totalNumber: 0,
        curNumber: 0,
        importKey: '',
		searchContent:'',
		categoryList:[],
		cardList:[],
		currentPage:'',
		pageCount:1,
		regretResultList:[],
		regretResultIndex:0,
		usedCardList:[],
		cardTypeList:[]
    },
    // 'tags': [], // 卡片新增时使用
    'originTags': [],
	'cardList': [],
	'typeTree': [],
    'relativeHighTypeTemp': {
		isPayUnit: false,
		isReceiveUnit: false,
		isAppliedWater: true,
		isAppliedInvoicing: false, // 后端删除
		isAppliedLedger: false, // 后端删除
		name: '',
		payableAcName: '', // 后端删除
		payableAcId: '', // 后端删除
		receivableAcName: '', // 后端删除
		receivableAcId: '', // 后端删除
		advanceAcName: '', // 后端删除
		advanceAcId: '', // 后端删除
		prepaidAcName: '', // 后端删除
		prepaidAcId: '', // 后端删除
    },
    'relativeTypeTemp':{
		name:'',
		remark:'',
		parentName:'全部',
		parentUuid:'',
		uuid:'',
    },
    'relativeTypeBtnStatus':{
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

export default function handleRelativeConfState(state = relativeConfState, action) {
	return ({
		[ActionTypes.INIT_RELATIVE_CONF]						          : () => relativeConfState,
		// 获取存货数据
		[ActionTypes.GET_RELATIVE_CONF_INIT]                              : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid': ''})
            state = state.set('originTags', fromJS(action.title))
						.set('cardList', fromJS(action.cardList))
						.set('views', relativeConfState.get('views'))
						.setIn(['views', 'currentPage'], action.currentPage || 1)
						.setIn(['views', 'pageCount'], action.pageCount || 1)
						.setIn(['views', 'searchContent'], action.condition)
            return state
        },
		[ActionTypes.CHANGE_ACTIVE_RELATIVE_CONF_HIGH_TYPE]            : () => {
			state = state.setIn(['views', 'activeRelativeType'], action.name)
						.setIn(['views', 'activeRelativeTypeUuid'], action.uuid)
						.setIn(['views', 'activeTapKey'], action.name)
						.setIn(['views', 'activeTapKeyUuid'], action.uuid)
						.setIn(['views', 'selectTypeId'], '')
						.setIn(['views', 'selectTypeName'], '')
						.setIn(['views', 'cardSelectList'], fromJS([]))
						.setIn(['views', 'currentPage'], action.currentPage || 1)
						.setIn(['views', 'pageCount'], action.pageCount || 1)
						.setIn(['views', 'searchContent'], action.condition)
						.set('cardList', fromJS(action.cardList))
						.set('typeTree', fromJS(action.treeList))

			if (action.setDefault) {
				state = state.setIn(['views', 'selectTypeId'], action.treeList[0].uuid)
							.setIn(['views', 'selectTypeName'], action.treeList[0].name)
			}
			return state
		},
		[ActionTypes.CHANGE_RELATIVE_CARD_USED_STATUS]           : () => {
            state.get('cardList').map((item, index) => {
                if (item.get('uuid') === action.uuid) {
                    state = state.setIn(['cardList', index, 'used'], action.used)
                }
            })
            return state
        },
		[ActionTypes.CHANGE_RELATIVE_CARD_BOX_STATUS]            : () => {
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
		[ActionTypes.SELECT_RELATIVE_CARD_ALL]         : () => {
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
		[ActionTypes.DELETE_RELATIVE_CARD_LIST]                   : () => {
            state = state.set('cardList', fromJS(action.list))
                         .setIn(['views', 'cardSelectList'], fromJS([]))
                         .set('typeTree', fromJS(action.treeList))
            return state
        },
		[ActionTypes.SELECT_RELATIVE_CARD_BY_TYPE]                : () => {
            state = state.setIn(['views', 'selectTypeId'], action.uuid)
                         .setIn(['views', 'selectTypeName'], action.name)
						 .setIn(['views', 'currentPage'], action.currentPage || 1)
 						.setIn(['views', 'pageCount'], action.pageCount || 1)
 						.setIn(['views', 'searchContent'], action.condition)
                         .set('cardList', fromJS(action.list))
            return state
        },
		[ActionTypes.GET_INVENTORY_SETTING_HIGH_TYPE_LIST]         : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid':''})
            state = state.set('originTags', fromJS(action.title))
            return state
        },
		// 大类别
		[ActionTypes.BEFORE_EDIT_RELATIVE_HIGH_TYPE]                     : () => {
			state = state.set('relativeHighTypeTemp', fromJS(action.receivedData))
						.setIn(['views', 'activeRelativeType'], action.activeName)
						.setIn(['views', 'activeRelativeTypeUuid'], action.activeUuid)
			return state
		},
		[ActionTypes.BEFORE_INSERT_RELATIVE_HGIH_TYPE]            : () => {
			state = state.setIn(['views', 'activeRelativeType'], 'plus')
						.setIn(['views', 'activeRelativeTypeUuid'], '')
						.set('relativeHighTypeTemp', fromJS(relativeHighTypeTemp))
			return state
		},
		[ActionTypes.CHANGE_RELATIVE_HIGH_TYPE_CONTENT]           : () => {
			state = state.setIn(['relativeHighTypeTemp', action.name], action.value)
			return state
		},
		[ActionTypes.AFTER_SAVE_RELATIVE_HIGH_TYPE]                  : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid':''})
            state = state.set('originTags', fromJS(action.title))

			if (action.insertOrModify === 'insert') {
				state = state.set('relativeHighTypeTemp', fromJS(relativeHighTypeTemp))
			}
            return state
        },
		[ActionTypes.DELETE_RELATIVE_HGIH_TYPE]                   : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid':''})
            state = state.set('originTags', fromJS(action.title))
						.setIn(['views', 'activeRelativeType'], '')
						.setIn(['views', 'activeRelativeTypeUuid'], '')
						.set('relativeHighTypeTemp', fromJS(relativeHighTypeTemp))
            return state
        },
		[ActionTypes.DELETE_CURRENT_RELATIVE_HGIH_TYPE]           : () => {
            action.title.unshift({'name': Limit.ALL_TAB_NAME_STR, 'uuid':''})
            state = state.set('originTags', fromJS(action.title))
						.set('views', relativeConfState.get('views').set('activeRelativeType', '').set('activeRelativeTypeUuid', ''))
						.set('relativeHighTypeTemp', fromJS(relativeHighTypeTemp))
						.set('cardList', fromJS(action.cardList))
						.set('typeTree', fromJS(action.treeList))
            return state
        },

		// 保存存货卡片
		[ActionTypes.SAVE_RELATIVE_CARD]                         : () => {
            state = state.set('cardList', fromJS(action.list))
            return state
        },

		// 小类别
		[ActionTypes.BEFORE_ADD_RELATIVE_CARD_TYPE]             : () => {
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
						.set('relativeTypeBtnStatus', fromJS(relativeTypeBtnStatus))
						.setIn(['relativeTypeBtnStatus', 'treeUuid'], state.getIn(['typeTree', 0, 'uuid']))
						.setIn(['relativeTypeBtnStatus', 'parentUuid'], state.getIn(['typeTree', 0, 'uuid']))
            return state
        },
		[ActionTypes.BEFORE_INSERT_RELATIVE_CARD_TYPE]          : () => {
            state = state.set('relativeTypeTemp', fromJS(relativeTypeTemp))
                         .setIn(['relativeTypeTemp', 'parentUuid'], state.getIn(['relativeTypeBtnStatus', 'treeUuid']))
                         .setIn(['relativeTypeTemp', 'parentName'], state.getIn(['relativeTypeBtnStatus', 'treeName']))
                         .setIn(['relativeTypeBtnStatus', 'isAdd'], true)
            return state
        },
		[ActionTypes.CHANGE_RELATIVE_TYPE_CONTENT]         : () => {
            state = state.setIn(['relativeTypeTemp', action.name], action.value)
            return state
        },
		[ActionTypes.SELECT_RELATIVE_TYPE_PARENT]                 : () => {
            state = state.setIn(['relativeTypeTemp', 'parentName'], action.parentName)
                         .setIn(['relativeTypeTemp', 'parentUuid'], action.parentUuid)
            return state
        },
		[ActionTypes.GET_RELATIVE_TYPE_CONTENT]                 : () => {
            state = state.set('relativeTypeTemp', fromJS(action.data))
                         .setIn(['relativeTypeBtnStatus', 'isAdd'], false)
            if (action.isAll) {
                state = state.setIn(['relativeTypeBtnStatus', 'isEdit'], false)
                             .setIn(['relativeTypeBtnStatus', 'treeUuid'], action.uuid)
                             .setIn(['relativeTypeBtnStatus', 'treeName'], state.getIn(['typeTree', 0, 'name']))
                             .setIn(['relativeTypeBtnStatus', 'isUp'], false)
                             .setIn(['relativeTypeBtnStatus', 'isDown'], false)
            } else {
                state = state.setIn(['relativeTypeBtnStatus', 'isEdit'], true)
                state = checkTreeNodeIsUpDown(state, action.uuid)
            }
            return state
        },
		[ActionTypes.CHANGE_RELATIVE_TYPE_BOX_STATUS]      : () => {
            state = state.setIn(['views', 'typeTreeSelectList'], fromJS(action.list))
            return state
        },
		[ActionTypes.RELATIVE_TYPE_DELETE_BTN_SHOW]             : () => {
            state = state.setIn(['relativeTypeBtnStatus', 'isDelete'], true)
            return state
        },
		[ActionTypes.CONFIRM_DELETE_RELATIVE_TYPE]              : () => {

            state = state.set('typeTree', fromJS(action.data))
            const treeUuid = state.getIn(['relativeTypeBtnStatus', 'treeUuid'])
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
                state = state.set('relativeTypeBtnStatus', fromJS(relativeTypeBtnStatus))
							.setIn(['relativeTypeBtnStatus', 'treeUuid'], action.data[0].uuid)
            } else {
                state = checkTreeNodeIsUpDown(state, treeUuid)
            }
            state = state.setIn(['relativeTypeBtnStatus', 'isDelete'], false)
                         .setIn(['views', 'typeTreeSelectList'], fromJS([]))
            return state
        },
		[ActionTypes.CHANGE_RELATIVE_TYPE_POSITION]             : () => {
            state = state.set('typeTree', fromJS(action.list))
            const uuid = state.getIn(['relativeTypeBtnStatus', 'treeUuid'])
            state = checkTreeNodeIsUpDown(state, uuid)
            return state
        },
		[ActionTypes.CANCLE_RELATIVE_TYPE_BTN]                  : () => {
            state = state.setIn(['relativeTypeBtnStatus','isAdd'], false)
                         .setIn(['relativeTypeBtnStatus','isDelete'], false)
                         .set('relativeTypeTemp', fromJS(action.data))
                         .setIn(['views', 'typeTreeSelectList'], fromJS([]))
            return state
        },
		[ActionTypes.INVENTORY_SETTING_TYPE_DELETE_BTN_SHOW]            : () => {
            state = state.setIn(['relativeTypeBtnStatus', 'isDelete'], true)
            return state
        },
		[ActionTypes.SAVE_RELATIVE_CARD_TYPE]                  : () => {
            state = state.set('typeTree', fromJS(action.typeTree))
            if (action.btnFlag != 'new') { // 保存
                state = checkTreeNodeIsUpDown(state, action.uuid)
            } else {
                state = state.set('relativeTypeTemp', fromJS(action.typeInfo))
                             .setIn(['relativeTypeBtnStatus', 'treeUuid'], action.typeInfo.uuid)
                             .setIn(['relativeTypeBtnStatus', 'isAdd'], false)
                             .setIn(['relativeTypeBtnStatus', 'isEdit'], true)
                state = checkTreeNodeIsUpDown(state, action.typeInfo.uuid)
            }
            return state
        },
		// 调整
        [ActionTypes.ADJUST_RELATIVE_CONF_CARD_TYPE_LIST]           : () => {
            state = state.set('cardList',fromJS(action.list))
                         .setIn(['views', 'cardSelectList'],fromJS([]))
            return state
        },

		// 导入
		[ActionTypes.BEFORE_WL_IMPORT]						 : () => {
			state = state.setIn(['views', 'showMessageMask'], true)
			return state
		},
        [ActionTypes.CLOSE_WL_IMPORT_CONTENT]				 : () => {
			state = state.setIn(['views', 'showMessageMask'], false)
						.setIn(['views', 'iframeload'], false)
						.setIn(['importresponlist','failJsonList'], [])
						.setIn(['importresponlist','successJsonList'], [])
						.setIn(['importresponlist','successSize'], 0)
						.setIn(['importresponlist','errorSize'], 0)
						.setIn(['importresponlist','allSize'], 0)
						.set('message', '')
			return state
		},
        [ActionTypes.AFTER_WL_IMPORT]						 : () => {
			state = !action.receivedData.code ?
				state.set('importresponlist', fromJS(action.receivedData.data)).setIn(['views', 'iframeload'], true).set('message', fromJS(action.receivedData.message)) :
				state.setIn(['views', 'iframeload'], true).set('message', fromJS(action.receivedData.message))

			return state
		},
        [ActionTypes.CHANGE_WL_IMPORT_NUM]					 : () =>  state.setIn(['views', action.name], action.value),
        [ActionTypes.CHANGE_WL_IMPORT_STATUS]				 : () =>  state.setIn(['views', 'wlImportantStatus'], action.value),
		[ActionTypes.CHANGE_RELATIVE_VIEWS_CONTENT]              : () => {
            state = state.setIn(['views', action.name], action.value)
            return state
        },

		[ActionTypes.ADJUST_CATEGORY_ORDER_RELATIVE]         :()=>{
			state = state.set('originTags', fromJS(action.payload))
			return state
		}
	}[action.type] || (() => state))()
}

const checkTreeNodeIsUpDown = (state, uuid) => {
    const list = state.get('typeTree').toJS()
    if (uuid != list[0].uuid) {
        let name = ''
        let selectList = []
        let selectIndex = ''
        let parentUuid = ''

        //获取子级元素及父级uuid
        const loop = (data) => data.map((item,index) =>{
            if(item.uuid === uuid){
                name = item.name
                selectIndex = index
                parentUuid = item.parentUuid
            }
            if(item.childList.length > 0){
                loop(item.childList)
            }
        })

        loop(list)

        state = state.setIn(['relativeTypeBtnStatus', 'treeUuid'], uuid)
                     .setIn(['relativeTypeBtnStatus', 'treeName'], name)
                     .setIn(['relativeTypeBtnStatus', 'parentUuid'], parentUuid ? parentUuid : '')

        //通过父级UUID选择子级所在的数组
         const loopParent = (data) => data.map((item, index) => {
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
			state = state.setIn(['relativeTypeBtnStatus', 'isUp'], false)
						.setIn(['relativeTypeBtnStatus', 'upUuid'], '')
		} else {
			state = state.setIn(['relativeTypeBtnStatus', 'isUp'], true)
						.setIn(['relativeTypeBtnStatus', 'upUuid'], selectList[upIndex].uuid)
		}

		if (selectIndex === selectList.length -1 || selectList[downIndex].name === '未分类') {
			state = state.setIn(['relativeTypeBtnStatus', 'isDown'], false)
						.setIn(['relativeTypeBtnStatus', 'downUuid'], '')
		} else {
			state = state.setIn(['relativeTypeBtnStatus', 'isDown'], true)
						.setIn(['relativeTypeBtnStatus', 'downUuid'], selectList[downIndex].uuid)
		}
	}
	return state
}
