import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const warehouseConfigState = fromJS({
	views: {
		insertOrModify: 'insert',
		showChild:[],
		selectItem:[],
		iframeload: false,
        showMessageMask: false,
        totalNumber: 0,
        curNumber: 0,
        importKey: '',
	},
	warehouseTemp: {
		insertParentDisabled:false,
        'openInfo': false,
		'cardList': [{
			childList:[],
			disableList:[]
			}],
	},
	insertCardTemp:{
		code:'',
		name:'',
		parentCard:{
			code:'',
			name:'',
			uuid:''
		}
	},
	importresponlist: {
        failJsonList: [],
        successJsonList: [],
        mediaId: ''
    },
	message: '',
})

export default function handleAccountConfig(state = warehouseConfigState, action) {
	return ({
		[ActionTypes.INIT_ACCOUNT_CONFIG]						    : () => warehouseConfigState,
		// 预置流水和账户新增时的数据
        [ActionTypes.BEFORE_INSERT_WAREHOUSECONF]                     : () => {
            state = state.setIn(['views', 'insertOrModify'], 'insert')
                        .setIn(['warehouseTemp','cardList'], fromJS(action.cardList))
						return state
		},
		[ActionTypes.GET_WAREHOUSE_TREE]                     : () => {
			if (action.first) {
				state = state.setIn(['views', 'showChild'], fromJS(action.cardList.map(v=> v.uuid)))
			}
			return state = state.setIn(['warehouseTemp','cardList'], fromJS(action.cardList))
        },
		[ActionTypes.AFTER_UPDATE_ACCOUNTCONF_ACCOUNT]              : () => {

            if (action.saveAndNew) {
                state = state.set('accountTemp', warehouseConfigState.get('accountTemp'))
            }

            return state
        },
		[ActionTypes.AFTER_INSERT_WAREHOUSE_CARD]              : () => {
			const parentCard = state.getIn(['insertCardTemp','parentCard'])
			state = state.set('insertCardTemp',warehouseConfigState.get('insertCardTemp'))
			if (action.saveAndNew) {
				state = state.setIn(['insertCardTemp','parentCard'],parentCard)
			}
			return state
		},
		[ActionTypes.CHANGE_WAREHOUSECONFIG_COMMON_STRING]              : () => {
			return state = state.setIn(action.placeArr,fromJS(action.value))
		},
		// 流水类别是否显示下级
        [ActionTypes.WAREHOUSE_TRIANGLE_SWITCH]          : () => {

            const showLowerList = state.getIn(['views', 'showChild'])

            if (!action.showChild) {
                // 原来不显示
                const newShowLowerList = showLowerList.push(action.uuid)
                return state.setIn(['views', 'showChild'], newShowLowerList)
            } else {
                // 原来显示
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                return state.setIn(['views', 'showChild'], newShowLowerList)
            }
        },
		[ActionTypes.WAREHOUSE_CHECKBOX_CHECK]          : () => {
			const upperArr = action.upperArr
			const item = action.item
			let selectList = state.getIn(['views', 'selectItem'])

			if (selectList.indexOf(item.get('uuid')) === -1) {

				const loop = data => data.map(v => {
						if (selectList.indexOf(v.get('uuid')) === -1) {
							selectList = selectList.push(v.get('uuid'))
							if (v.get('childList') && v.get('childList').size) {
								loop(v.get('childList'))
							}
							if (v.get('disableList') && v.get('disableList').size) {
								loop(v.get('disableList'))
							}
						}
				})

				selectList = selectList.push(item.get('uuid'))

				if (item.get('childList') && item.get('childList').size) {
					loop(item.get('childList'))
				}
				if (item.get('disableList') && item.get('disableList').size) {
					loop(item.get('disableList'))
				}
				state = state.setIn(['views', 'selectItem'], selectList)

				return state

			} else {
				const loopDel = data => data.map(v => {
						if (selectList.indexOf(v.get('uuid')) > -1) {
							const idx = selectList.findIndex(x => x === v.get('uuid'))
							selectList = selectList.splice(idx, 1)
						}
						if (v.get('childList') && v.get('childList').size) {
							loopDel(v.get('childList'))
						}
						if (v.get('disableList') && v.get('disableList').size) {
							loopDel(v.get('disableList'))
						}
				})
				const idx = selectList.findIndex(v => v === item.get('uuid'))
				selectList = selectList.splice(idx, 1)
				if (item.get('childList') && item.get('childList').size) {
					loopDel(item.get('childList'))
				}
				if (item.get('disableList') && item.get('disableList').size) {
					loopDel(item.get('disableList'))
				}
				selectList = selectList.filter(v => upperArr.indexOf(v) === -1)
				return state.setIn(['views', 'selectItem'], selectList)
			}
        },
		[ActionTypes.GET_WAREHOUSE_CARD]              : () => {
			return state = state.set('insertCardTemp',fromJS(action.data))
		},
		[ActionTypes.CHANGE_WAREHOUSE_ITEM_DISABLE_STATUS]  : () => {
			const cardList = state.getIn(['warehouseTemp','cardList'])
            let item = cardList.getIn([0,...action.placeArr]).toJS()
            const loop = (list) => {
                for(let i in list) {
                    list[i].canUse = !action.disabled
                    list[i].childList.length && loop (list[i].childList)
                    list[i].disableList && list[i].disableList.length && loop (list[i].disableList)
                }
            }
            item.childList && item.childList.length && loop (item.childList)
            item.disableList && item.disableList.length && loop (item.disableList)

            return state.setIn(['warehouseTemp','cardList',0,...action.placeArr],fromJS(item))
                        .setIn(['warehouseTemp','cardList',0,...action.placeArr,'canUse'],!action.disabled)
        },
		// 导入
		[ActionTypes.BEFORE_CK_IMPORT]						 : () => {
			state = state.setIn(['views', 'showMessageMask'], true)
			return state
		},
		[ActionTypes.CLOSE_CK_IMPORT_CONTENT]				 : () => {
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
		[ActionTypes.AFTER_CK_IMPORT]						 : () => {
			state = !action.receivedData.code ?
				state.set('importresponlist', fromJS(action.receivedData.data)).setIn(['views', 'iframeload'], true).set('message', fromJS(action.receivedData.message)) :
				state.setIn(['views', 'iframeload'], true).set('message', fromJS(action.receivedData.message))

			return state
		},
		[ActionTypes.CHANGE_CK_IMPORT_NUM]					 : () =>  state.setIn(['views', action.name], action.value),

	}[action.type] || (() => state))()
}
