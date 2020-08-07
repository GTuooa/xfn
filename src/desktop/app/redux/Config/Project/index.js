import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { projectHighTypeTemp, projectTypeBtnStatus, projectTypeTemp } from '../common/originData.js'

//生产环境应当设置为空
const projectConfState = fromJS({
	views: {
        // iframeload: false,
        // showMessageMask: false,
        // totalNumber: 0,
        // curNumber: 0,
        // importKey: '',
		activeTapKey: '全部',
		activeTapKeyUuid: '',  // 当前高亮的大类别
		activeProjectType: '', // 当前高亮的大类别
		activeProjectTypeUuid: '', // 新增大类别高亮的类别
		activeTreeKeyUuid: '', // 新增大类别高亮的类别
		typeTreeSelectList: [],
		cardSelectList: [],  // 选中的卡片的uuid
		selectTypeId: '',  // 树形选择选中的
		selectTypeName: '', // 树形选择选中的
		searchContent:'',
		regretResultList:[],
		regretResultIndex:0,
		usedCardList:[],
		cardTypeList:[],
		cardList:[],
		categoryList:[],
    },
    // 'tags': [], // 卡片新增时使用
    'originTags': [],
	'cardList': [],
	'typeTree': [],
    'projectHighTypeTemp': {
		'name': '',
		'commonFee': false,
		'uuid': ''
    },
    'projectTypeTemp':{
		name:'',
		remark:'',
		parentName:'全部',
		parentUuid:'',
		uuid:'',
    },
    'projectTypeBtnStatus': {
		'isAdd':false,
		'isDelete':false,
		'treeUuid':'',
		'treeName':'全部',
		'isUp':false,
		'isDown':false,
		'upUuid':'',
		'downUuid':'',
		'isEdit':false,
		'parentUuid':''
    },

    // importresponlist: {
    //     failJsonList: [],
    //     successJsonList: [],
    //     mediaId: ''
    // },
    // message: '',
})

export default function handleProjectConfState(state = projectConfState, action) {
	return ({
		[ActionTypes.INIT_PROJECT_CONF]						          : () => projectConfState,
		// 获取存货数据
		[ActionTypes.PROJECT_GET_HTIGH_TYPE]							  : () => {
			action.list.unshift({'uuid':'','name':'全部'})
			state = state.set('originTags', fromJS(action.list))
						.set('views', projectConfState.get('views'))
			return state
		},
		[ActionTypes.GET_PROJECT_LIST_AND_TREE]                           : () => {
			state = state.set('cardList', fromJS(action.cardList)).set('typeTree', fromJS(action.treeList))
			if (action.isFresh === true) {
				const typeTree = state.get('typeTree')
				state = state.setIn(['views', 'selectTypeId'], typeTree.getIn([0, 'uuid'])).setIn(['views', 'selectTypeName'], typeTree.getIn([0, 'name']))
			}
			return state.setIn(['views', 'parentUuid'],'' )
						.setIn(['views', 'currentPage'], action.currentPage || 1)
						.setIn(['views', 'pageCount'], action.pageCount || 1)
						.setIn(['views', 'searchContent'], action.condition||'')
		},

		[ActionTypes.CHANGE_ACTIVE_PROJECT_HIGH_TYPE]                     : () => {
			state = state.setIn(['views', 'activeProjectType'], action.name)
						.setIn(['views', 'activeProjectTypeUuid'], action.uuid)
						.setIn(['views', 'activeTapKey'], action.name)
						.setIn(['views', 'activeTapKeyUuid'], action.uuid)
						.setIn(['views', 'selectTypeId'], '')
						.setIn(['views', 'selectTypeName'], '')
						.setIn(['views', 'cardSelectList'], fromJS([]))
						.set('cardList', fromJS(action.cardList))
						.set('typeTree', fromJS(action.treeList))
						.setIn(['views', 'currentPage'], action.currentPage || 1)
						.setIn(['views', 'pageCount'], action.pageCount || 1)
						.setIn(['views', 'searchContent'], '')
						.setIn(['views', 'parentUuid'],'' )

			if (action.name !== Limit.ALL_TAB_NAME_STR) {
				state = state.setIn(['views', 'selectTypeId'], action.treeList[0].uuid)  // 设置默认的选中的树节点
							.setIn(['views', 'selectTypeName'], action.treeList[0].name)  // 设置默认的选中的树节点
			}

			return state
		},
		[ActionTypes.CHANGE_PEOJECT_CONF_CARD_USED_STATUS]                 : () => {
            state.get('cardList').map((item, index) => {
                if (item.get('uuid') === action.uuid) {
                    state = state.setIn(['cardList', index, 'used'], action.used)
                }
            })
            return state
        },
		[ActionTypes.CHANGE_PEOJECT_CONF_CARD_BOX_STATUS]                  : () => {
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

		[ActionTypes.SELECT_PEOJECT_CONF_CARD_ALL]                         : () => {
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
		[ActionTypes.DELETE_PROJECT_CONF_CARD]                             : () => {
            state = state.set('cardList', fromJS(action.list))
                         .setIn(['views', 'cardSelectList'], fromJS([]))
                         .set('typeTree', fromJS(action.treeList))
            return state
        },
		[ActionTypes.SELECT_PROJECT_CARD_BY_TYPE]                          : () => {
            state = state.setIn(['views', 'selectTypeId'], action.uuid)
						 .setIn(['views', 'parentUuid'], action.parentUuid)
                         .setIn(['views', 'selectTypeName'], action.name)
                         .set('cardList', fromJS(action.list))
						 .setIn(['views', 'currentPage'], action.currentPage || 1)
 						.setIn(['views', 'pageCount'], action.pageCount || 1)
 						.setIn(['views', 'searchContent'], action.condition||'')
            return state
        },
		// 大类别
		[ActionTypes.GET_PROJECT_HIGH_TYPE_ONE]                            : () => {
			state = state.set('projectHighTypeTemp', fromJS(action.data))
						.setIn(['views', 'activeProjectType'], action.name)
						.setIn(['views', 'activeProjectTypeUuid'], action.uuid)
			return state
		},
		[ActionTypes.CHANGE_PREJECT_HIGH_TYPE_CONTENT]                    : () => {
            state = state.setIn(['projectHighTypeTemp', action.name], action.value)
            return state
        },

		// 保存存货卡片
		[ActionTypes.SAVE_PROJECT_CARD]                         : () => {
            state = state.set('cardList',fromJS(action.cardlist))
                         .set('typeTree',fromJS(action.treeList))
            return state
        },

		// 小类别
		[ActionTypes.BEFORE_ADD_PROJECT_CONFIG_CARD_TYPE]             : () => {
            let typeTree = state.get('typeTree').toJS()

            const loop = (data) => data.map((item) => {
                item.checked = false
				if (item.childList.length) {
					loop(item.childList)
				}
            })

            loop(typeTree)

            state = state.set('typeTree', fromJS(typeTree))
						.set('projectTypeBtnStatus', fromJS(projectTypeBtnStatus))
						.setIn(['views', 'typeTreeSelectList'], fromJS([]))
						.setIn(['projectTypeBtnStatus', 'treeUuid'], state.getIn(['typeTree', 0, 'uuid']))
						.setIn(['projectTypeTemp', 'parentUuid'], state.getIn(['typeTree', 0, 'uuid']))
            return state
        },
		[ActionTypes.BEFORE_INSERT_PROJECT_CONF_CARD_TYPE]          : () => {
            state = state.set('projectTypeTemp', fromJS(projectTypeTemp))
                         .setIn(['projectTypeTemp', 'parentUuid'], state.getIn(['projectTypeBtnStatus', 'treeUuid']))
                         .setIn(['projectTypeTemp', 'parentName'], state.getIn(['projectTypeBtnStatus', 'treeName']))
                         .setIn(['projectTypeBtnStatus', 'isAdd'], true)
            return state
        },
		[ActionTypes.CHANGE_PROJECT_CONF_CARD_TYPE_CONTENT]         : () => {
            state = state.setIn(['projectTypeTemp', action.name], action.value)
            return state
        },
		[ActionTypes.SELECT_PROJECT_CONF_CARD_TYPE]                 : () => {
            state = state.setIn(['projectTypeTemp', 'parentName'], action.parentName)
                         .setIn(['projectTypeTemp', 'parentUuid'], action.parentUuid)
            return state
        },
		[ActionTypes.GET_PROJECT_CONF_TYPE_CONTENT]                 : () => {
            state = state.set('projectTypeTemp', fromJS(action.data))
                         .setIn(['projectTypeBtnStatus', 'isAdd'], false)
            if (action.isAll) {
                state = state.setIn(['projectTypeBtnStatus', 'isEdit'], false)
                             .setIn(['projectTypeBtnStatus', 'treeUuid'], action.uuid)
                             .setIn(['projectTypeBtnStatus', 'treeName'], state.getIn(['typeTree', 0, 'name']))
                             .setIn(['projectTypeBtnStatus', 'isUp'], false)
                             .setIn(['projectTypeBtnStatus', 'isDown'], false)
            } else {
                state = state.setIn(['projectTypeBtnStatus', 'isEdit'], true)
                state = checkTreeNodeIsUpDown(state, action.uuid)
            }
            return state
        },
		[ActionTypes.CHANGE_PROJECT_CONF_CARD_TYPE_BOX_STATUS]      : () => {
            state = state.setIn(['views', 'typeTreeSelectList'], fromJS(action.list))
            return state
        },
		[ActionTypes.PROJECT_CONF_DELETE_BTN_SHOW]             : () => {
            state = state.setIn(['projectTypeBtnStatus', 'isDelete'], true)
            return state
        },
		[ActionTypes.CONFIRM_DELETE_PROJECT_CONF_TYPE]              : () => {

            state = state.set('typeTree', fromJS(action.data))
            const treeUuid = state.getIn(['projectTypeBtnStatus', 'treeUuid'])
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
                state = state.set('projectTypeBtnStatus', fromJS(projectTypeBtnStatus))
							.setIn(['projectTypeBtnStatus', 'treeUuid'], action.data[0].uuid)
            } else {
                state = checkTreeNodeIsUpDown(state, treeUuid)
            }
            state = state.setIn(['projectTypeBtnStatus', 'isDelete'], false)
                         .setIn(['views', 'typeTreeSelectList'], fromJS([]))
            return state
        },
		[ActionTypes.CHANGE_PROJECT_CONF_TYPE_POSITION]             : () => {
            state = state.set('typeTree', fromJS(action.list))
			let curItem
			const loop = (list) => list.map(v => {
				if (v.uuid === action.selectedSubordinateUuid) {
					curItem = v
					return
				}
				loop(v.childList)
				})
				loop(action.list)
            const uuid = state.getIn(['projectTypeBtnStatus', 'treeUuid'])
            state = checkTreeNodeIsUpDown(state, uuid)
            return state.set('projectTypeTemp',fromJS(curItem))
        },
		[ActionTypes.CANCLE_PROJECT_CONF_TYPE_BTN]                  : () => {
            state = state.setIn(['projectTypeBtnStatus','isAdd'], false)
                         .setIn(['projectTypeBtnStatus','isDelete'], false)
                         .set('projectTypeTemp', fromJS(action.data))
                         .setIn(['views', 'typeTreeSelectList'], fromJS([]))
            return state
        },
		[ActionTypes.PROJECT_CONF_TYPE_DELETE_BTN_SHOW]            : () => {
            state = state.setIn(['projectTypeBtnStatus', 'isDelete'], true)
            return state
        },
		[ActionTypes.SAVE_PROJECT_CONF_CARD_TYPE]                  : () => {
            state = state.set('typeTree', fromJS(action.typeTree))
            if (action.btnFlag != 'new') { // 保存
                state = checkTreeNodeIsUpDown(state, action.uuid)
            } else {
                state = state.set('projectTypeTemp', fromJS(action.typeInfo))
                             .setIn(['projectTypeBtnStatus', 'treeUuid'], action.typeInfo.uuid)
                             .setIn(['projectTypeBtnStatus', 'isAdd'], false)
                             .setIn(['projectTypeBtnStatus', 'isEdit'], true)
                state = checkTreeNodeIsUpDown(state, action.typeInfo.uuid)
            }
            return state
        },
		// 调整
        [ActionTypes.ADJUST_PROJECT_CONF_CARD_TYPE_LIST]           : () => {
            state = state.set('cardList',fromJS(action.list))
                         .setIn(['views', 'cardSelectList'], fromJS([]))
            return state
        },
		[ActionTypes.CHANGE_PROJECT_VIEWS_CONTENT]                          : () => {
            state = state.setIn(['views', action.name], action.value)
            return state
        },
		// 导入
        // [ActionTypes.BEFORE_CH_IMPORT]						            : () => state.setIn(['views', 'showMessageMask'], true),
        // [ActionTypes.CLOSE_CH_IMPORT_CONTENT]				            : () => {
		// 	state = state.setIn(['views', 'showMessageMask'], false)
		// 				.setIn(['views', 'iframeload'], false)
		// 				.setIn(['importresponlist','failJsonList'], [])
		// 				.setIn(['importresponlist','successJsonList'], [])
		// 				.setIn(['importresponlist','successSize'], 0)
		// 				.setIn(['importresponlist','errorSize'], 0)
		// 				.setIn(['importresponlist','allSize'], 0)
		// 				.set('message', '')
		// },
        // [ActionTypes.AFTER_CH_IMPORT]						           : () => {
		// 	state = !action.receivedData.code ?
		// 		state.set('importresponlist', fromJS(action.receivedData.data)).setIn(['views', 'iframeload'], true).set('message', fromJS(action.receivedData.message)) :
		// 		state.setIn(['views', 'iframeload'], true).set('message', fromJS(action.receivedData.message))
		//
		// 	return state
		// },
        // [ActionTypes.CHANGE_CH_IMPORT_NUM]					         : () =>  state.setIn(['views',action.name], action.value),
        // [ActionTypes.CHANGE_CH_IMPORT_STATUS]					     : () =>  state.setIn(['views','chImportantStatus'], action.value),
	}[action.type] || (() => state))()
}

const checkTreeNodeIsUpDown = (state, uuid) => {
    const list = state.get('typeTree').toJS()
    if (uuid != list[0].uuid) {
        let name = ''
        let selectList = []
        let selectIndex = ''
        let parentUuid = ''

        //确定父级元素id及新增name及新增id所处位置
        const loop = (data) => data.map((item, index) => {
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

        state = state.setIn(['projectTypeBtnStatus', 'treeUuid'], uuid)
                    .setIn(['projectTypeBtnStatus', 'treeName'], name)
                    .setIn(['projectTypeBtnStatus', 'parentUuid'], parentUuid ? parentUuid : '')

        //获取父级下的子级类别
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
            state = state.setIn(['projectTypeBtnStatus', 'isUp'], false)
                        .setIn(['projectTypeBtnStatus', 'upUuid'], '')
        } else {
            state = state.setIn(['projectTypeBtnStatus', 'isUp'], true)
                        .setIn(['projectTypeBtnStatus', 'upUuid'], selectList[upIndex].uuid)
        }

        if (selectIndex === selectList.length -1 || selectList[downIndex].name === '未分类') {
            state = state.setIn(['projectTypeBtnStatus', 'isDown'], false)
                        .setIn(['projectTypeBtnStatus', 'downUuid'], '')
        } else {
            state = state.setIn(['projectTypeBtnStatus', 'isDown'],true)
                        .setIn(['projectTypeBtnStatus', 'downUuid'], selectList[downIndex].uuid)
        }
    }
    return state
}
