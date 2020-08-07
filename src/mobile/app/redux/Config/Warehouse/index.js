import { fromJS } from 'immutable'
import * as ActionTypes from './ActionTypes.js'

const warehouseState = fromJS({
    views: {
        insertOrModify: 'insert',
        isAdd: false,
    },
    data: {//新增卡片的数据
        code: '',
        name: '',
        uuid: '',
        canUse: true,
        parentCard: {
            uuid: '',
            code: '',
            name: ''
        }

    },
    treeList: [],//类别树列表
    deleteList: [],//要删除的卡片列表
    showChildList: [],//展开的卡片的uuid
})

// Reducer
export default function reducer(state = warehouseState, action = {}) {
    return ({
        [ActionTypes.INIT_WAREHOUSE]                          : () => warehouseState,
        [ActionTypes.GET_WAREHOUSE_TREE]				      : () => {
            return state.set('treeList', fromJS(action.data))
                        .set('deleteList', fromJS([]))
        },
        [ActionTypes.CHANGE_WAREHOUSE_DATA]					  : () => {
            return state.setIn(action.dataType, action.value)
        },
        [ActionTypes.WAREHOUSE_TOGGLELOWER]				      : () => {
			const showChildList = state.get('showChildList')

            if (showChildList.indexOf(action.uuid) > -1) {
                return state.update('showChildList', v => v.map(w => w.indexOf(action.uuid) > -1 ? '' : w).filter(w => !!w))
            } else {
                return state.update('showChildList', v => v.push(action.uuid))
            }
		},
        [ActionTypes.GET_WAREHOUSE_SINGLE_CARD]				: () => {
            return state.set('data', fromJS(action.data))
                        .setIn(['views', 'insertOrModify'], 'modify')
        },
        [ActionTypes.CHECKED_WAREHOUSE_CARD]				: () => {
            let deleteList = state.get('deleteList').toJS()
            const treeList = state.get('treeList').toJS()
            let uuidList = [action.uuid]//所有的下级
            let parentUuid = []//所有上级
            let findChecked = false
            const loop = (list, isFind) => {
                list.map(data => {
                    if (isFind) {
                        uuidList.push(data['uuid'])
                        loop(data['childList'], true)
                        loop(data['disableList'], true)
                    } else {
                        if (data['uuid']==action.uuid) {
                            findChecked = true
                            loop(data['childList'], true)
                            loop(data['disableList'], true)
                        } else {
                            if (!findChecked) {
                                parentUuid.push(data['uuid'])
                            }
                            loop(data['childList'], false)
                            loop(data['disableList'], false)
                        }

                    }
                    if (!findChecked) {
                        parentUuid.pop()
                    }
                })
            }
            loop(treeList,false)

            if (deleteList.includes(action.uuid)) {//删除
                uuidList.forEach(item => {//删除下级
                    deleteList = deleteList.filter(v => v!=item)
                })
                parentUuid.forEach(item => {//删除上级
                    deleteList = deleteList.filter(v => v!=item)
                })
            } else {
                uuidList.forEach(item => {
                    deleteList.push(item)
                })
            }

            return state.set('deleteList', fromJS(deleteList))
        },
        [ActionTypes.ADD_WAREHOUSE_CARD]				    : () => {
            return state.setIn(['views', 'insertOrModify'], 'insert')
                        .set('data', fromJS({
                            code: '',
                            name: '',
                            uuid: '',
                            canUse: true,
                            parentCard: action.parentCard
                        }))
        },
        [ActionTypes.CLEAR_WAREHOUSE_CHECKED]				  : () => {
            return state.set('deleteList', fromJS([]))
        },



    }[action.type] || (() => state))()
}
