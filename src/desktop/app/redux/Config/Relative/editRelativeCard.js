import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { relativeCardTemp } from '../common/originData.js'

//生产环境应当设置为空
const relativeCardState = fromJS({
	views: {
		insertOrModify: 'insert',
		fromPage: 'relative'
    },
    tags: [], // 卡片新增时使用
    relativeCardTemp: {
		name: "",
		code: "",
		isPayUnit: false,
		isReceiveUnit: false,
		payableAcName: "应付账款", // 后端删除
		receivableAcName: "应收账款", // 后端删除
		advanceAcName: "预收账款", // 后端删除
		prepaidAcName: "预付账款", // 后端删除
		payableAcId: "2202", // 后端删除
		receivableAcId: "1122", // 后端删除
		advanceAcId: "2203", // 后端删除
		prepaidAcId: "1123", // 后端删除
		companyAddress: "",
		companyTel: "",
		financeName: "",
		financeTel: "",
		remark: "",
		receivableOpened: "",
		advanceOpened: "",
		payableOpened: "",
		prepaidOpened: "",
		categoryTypeList: [],
		insertFrom: '',
		enablePrepaidAc: false,
		enableAdvanceAc: false,
		contacterInfo: false,
		isCheckOut: false,
    }
})

export default function handleEditRelativeCard(state = relativeCardState, action) {
	return ({
		// 新增卡片之前----存货
		[ActionTypes.BEFORE_ADD_RELATIVE_CARD]        : () => {
            state = state.set('relativeCardTemp', fromJS(relativeCardTemp))
                         .set('tags', action.originTags)
                         .setIn(['views', 'insertOrModify'], 'insert')
                         .setIn(['views', 'fromPage'], 'relative')
						 .setIn(['relativeCardTemp', 'isCheckOut'], action.data.isCheckOut)
                         .setIn(['relativeCardTemp', 'code'], action.code)
            return state
        },
		// 新增卡片之前----流水
		[ActionTypes.BEFORE_ADD_RELATIVE_CARD_FROM_RUNNING]        : () => {

            state = state.set('relativeCardTemp', fromJS(relativeCardTemp))
						.set('tags', action.originTags)
						.setIn(['views', 'insertOrModify'], 'insert')
						.setIn(['views', 'fromPage'], 'otherPage')
						.setIn(['views', 'fromPosition'], action.fromPosition)
						.setIn(['relativeCardTemp', 'isCheckOut'], action.isCheckOut)
						.setIn(['relativeCardTemp', 'code'], action.receivedData.code)
						.setIn(['views', 'range'], action.range)

			// if (action.payOrReceive === 'payAndReceive') {
			// 	state = state.setIn(['relativeCardTemp', 'enableAdvanceAc'], true)
			// 				.setIn(['relativeCardTemp', 'isReceiveUnit'], true)
			// 				.setIn(['relativeCardTemp', 'enablePrepaidAc'], true)
			// 				.setIn(['relativeCardTemp', 'isPayUnit'], true)
			// }
			// if (action.payOrReceive === 'pay') {
			// 	state = state.setIn(['relativeCardTemp', 'enableAdvanceAc'], false)
			// 				.setIn(['relativeCardTemp', 'isReceiveUnit'], false)
			// 				.setIn(['relativeCardTemp', 'enablePrepaidAc'], true)
			// 				.setIn(['relativeCardTemp', 'isPayUnit'], true)
			// }
			// if (action.payOrReceive === 'receive') {
			// 	state = state.setIn(['relativeCardTemp', 'enableAdvanceAc'], true)
			// 				.setIn(['relativeCardTemp', 'isReceiveUnit'], true)
			// 				.setIn(['relativeCardTemp', 'enablePrepaidAc'], false)
			// 				.setIn(['relativeCardTemp', 'isPayUnit'], false)
			// }

            return state
        },

		[ActionTypes.BEFORE_EDIT_RELATIVE_CARD]                   : () => {
			state = state.set('relativeCardTemp', fromJS(action.data))
						.setIn(['views', 'insertOrModify'], 'modify')
						.setIn(['views', 'fromPage'], 'relative')
						.set('tags', fromJS(action.originTags))
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

		[ActionTypes.CHANGE_RELATIVE_CARD_CONTENT]              : () => {
            state = state.setIn(['relativeCardTemp', action.name], action.value)
            return state
        },
		// [ActionTypes.CHANGE_RELATIVE_CARD_RELATIVE]               : () => {
		// 	// 修改往来性质
		// 	state = state.setIn(['relativeCardTemp', action.name], action.value)
		//
		// 	if (!action.value) { // 取消勾选存货用途东西
		//
		// 		const clearAllStatus = () => {
		// 			state.get('tags').map((item, index) =>{
		// 				state = state.setIn(['tags', index, 'checked'], false)
		// 			})
		// 			state = state.setIn(['relativeCardTemp', 'categoryTypeList'], fromJS([]))
		// 		}
		//
		// 		const clearAotherStatus = (item, index) => {
		// 			state = state.setIn(['tags', index, 'checked'], false)
		// 			let curIndex = state.getIn(['relativeCardTemp', 'categoryTypeList']).findIndex((v, i) => {
		// 				return v.get('ctgyUuid') === item.get('uuid')
		// 			})
		// 			if (curIndex > -1) {
		// 				state = state.setIn(['relativeCardTemp', 'categoryTypeList'],state.getIn(['inventoryCard','categoryTypeList']).delete(curIndex))
		// 			}
		// 		}
		//
		// 		if (action.name === 'isPayUnit') {
		// 			state = state.setIn(['relativeCardTemp', 'enablePrepaidAc'], false)
		// 			let isReceiveUnit = state.getIn(['relativeCardTemp', 'isReceiveUnit'])
		// 			if (isReceiveUnit) {
		// 				state.get('tags').map((item, index) => {
		// 					if (!item.get('isReceiveUnit')) {
		// 						clearAotherStatus(item, index)
		// 					}
		// 				})
		// 			} else {
		// 				clearAllStatus()
		// 			}
		// 		}
		// 		if (action.name === 'isReceiveUnit') {
		// 			state = state.setIn(['relativeCardTemp', 'enableAdvanceAc'], false)
		// 			let isPayUnit = state.getIn(['relativeCardTemp', 'isPayUnit'])
		// 			if (isPayUnit) {
		// 				state.get('tags').map((item,index) => {
		// 					if (!item.get('isPayUnit')) {
		// 						clearAotherStatus(item, index)
		// 					}
		// 				})
		// 			} else {
		// 				clearAllStatus()
		// 			}
		// 		}
		// 	}
		// 	return state
        // },
		[ActionTypes.CHANGE_RELATIVE_CARD_CATEGORY_STATUS]         : () => {
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
                let list = state.getIn(['relativeCardTemp', 'categoryTypeList']).push(info)
                state = state.setIn(['relativeCardTemp', 'categoryTypeList'],list)
            } else {
                let curIndex = state.getIn(['relativeCardTemp', 'categoryTypeList']).findIndex((v, i) => v.get('ctgyUuid') === action.item.get('uuid'))
                let list = state.getIn(['relativeCardTemp', 'categoryTypeList']).delete(curIndex)
                state = state.setIn(['relativeCardTemp', 'categoryTypeList'],list)
            }

            return state
        },
		[ActionTypes.CHANGE_RELATIVE_CARD_CATEGORY_TYPE]           : () => {
            state.get('tags').map((v, i) => {
                if (v.get('uuid') === action.item.get('uuid')) {
                    state = state.setIn(['tags', i, 'selectUuid'], action.uuid)
                                 .setIn(['tags', i, 'selectName'], action.name)
                    return
                }
            })
            state.getIn(['relativeCardTemp', 'categoryTypeList']).map((v, i) => {
                if (v.get('ctgyUuid') === action.item.get('uuid')) {
                    state = state.setIn(['relativeCardTemp', 'categoryTypeList' , i, 'subordinateUuid'], action.uuid)
                }
            })
            return state
        },

		// 保存卡片之后----存货
        [ActionTypes.SAVE_RELATIVE_CARD]                         : () => {
            if (action.flag === 'insertAndNew') {
                state = state.setIn(['relativeCardTemp', 'name'], '')
							.setIn(['relativeCardTemp', 'code'], action.autoIncrementCode)
							.setIn(['relativeCardTemp', 'companyAddress'], '')
							.setIn(['relativeCardTemp', 'companyTel'], '')
							.setIn(['relativeCardTemp', 'financeName'], '')
							.setIn(['relativeCardTemp', 'financeTel'], '')
							.setIn(['relativeCardTemp', 'receivableOpened'], '')
							.setIn(['relativeCardTemp', 'advanceOpened'], '')
							.setIn(['relativeCardTemp', 'payableOpened'], '')
							.setIn(['relativeCardTemp', 'prepaidOpened'], '')
            }
            return state
        },

	}[action.type] || (() => state))()
}
