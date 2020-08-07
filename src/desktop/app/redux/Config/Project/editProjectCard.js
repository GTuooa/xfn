import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { projectCardTemp } from '../common/originData.js'

//生产环境应当设置为空
const projectCardState = fromJS({
	views: {
		insertOrModify: 'insert',
		fromPage: 'project'
    },
    typeTree: [], // 卡片新增时使用
    projectCardTemp: {
		"name": "",
		"code": "",
		"selectUuid": '',
		"selectName": '',
		"categoryTypeList": [
			{
				"ctgyUuid": "",
				"subordinateUuid": ""
			}
		],
		projectProperty:'XZ_LOSS',
		projectPropertyName:'损益项目'
    }
})

export default function handleEditProjectCard(state = projectCardState, action) {
	return ({
		// 新增卡片之前
		[ActionTypes.BEFORE_ADD_PROJECT_CARD]                              : () => {
			if (!action.noFresh) {
				state = state.set('projectCardTemp', fromJS(projectCardState.get('projectCardTemp')))
							.setIn(['views', 'insertOrModify'], 'insert')
			}
			if (!action.noCode) {
				state = state.setIn(['projectCardTemp','code'], action.code)
			}
                state = state.set('typeTree', fromJS(action.data))
                         .setIn(['views', 'fromPage'], 'project')
			if (action.data[0].childList.length <= 0) {
				state = state.setIn(['projectCardTemp', 'selectUuid'], action.data[0].uuid)
						 	.setIn(['projectCardTemp', 'selectName'], action.data[0].name)
			} else if (action.noFresh) {
				state = state.setIn(['projectCardTemp', 'selectUuid'], '')
						 	.setIn(['projectCardTemp', 'selectName'], '')
			}
            return state
        },
		[ActionTypes.CHANGE_PROJECT_PROPERTY]                              : () => {
			if (action.data[0].childList.length <= 0) {
				state = state.setIn(['projectCardTemp', 'selectUuid'], action.data[0].uuid)
						 	.setIn(['projectCardTemp', 'selectName'], action.data[0].name)
			} else {
				state = state.setIn(['projectCardTemp', 'selectUuid'], '')
						 	.setIn(['projectCardTemp', 'selectName'], '')
			}
            return state.set('typeTree', fromJS(action.data))
						.setIn(['projectCardTemp','projectPropertyName'],action.projectPropertyName)
						.setIn(['projectCardTemp','projectProperty'],action.projectProperty)
        },

		// 录入流水的新增项目
		[ActionTypes.BEFORE_ADD_PROJECT_CARD_FROM_RUNNING]                              : () => {
            state = state.set('projectCardTemp', fromJS(projectCardTemp))
							.setIn(['projectCardTemp','code'], action.code)
							.set('typeTree', fromJS(action.receivedData))
							.setIn(['views', 'insertOrModify'], 'insert')
							.setIn(['views', 'fromPage'], 'otherPage')
							.setIn(['views', 'fromPosition'], action.fromPosition)
							.setIn(['projectCardTemp', 'categoryTypeList', 0, 'ctgyUuid'], action.ctgyUuid)
							.setIn(['projectCardTemp','projectProperty'],'XZ_LOSS')
							.setIn(['projectCardTemp','projectPropertyName'],'损益项目')
			if (action.receivedData[0].childList.length <= 0) {
				state = state.setIn(['projectCardTemp', 'selectUuid'], action.receivedData[0].uuid)
							.setIn(['projectCardTemp', 'selectName'], action.receivedData[0].name)
			}
            return state
        },

		[ActionTypes.BEFORE_EDIT_PROJECT_CARD]                   : () => {
			state = state.set('projectCardTemp', fromJS(action.data))
						.setIn(['views', 'insertOrModify'], 'modify')
						.setIn(['views', 'fromPage'], 'project')
						.set('projectCardTemp', fromJS(action.data))
						.set('typeTree', fromJS(action.data.categoryTypeList[0].options))
						.setIn(['projectCardTemp','selectUuid'], action.data.categoryTypeList[0].subordinateUuid)
						.setIn(['projectCardTemp','selectName'], action.data.categoryTypeList[0].subordinateName)
						.setIn(['projectCardTemp','projectPropertyName'], {XZ_LOSS:'损益项目',XZ_PRODUCE:'生产项目',XZ_CONSTRUCTION:'施工项目'}[action.data.projectProperty])
			return state
		},

		[ActionTypes.CHANGE_PROJECT_CARD_CONTENT]                          : () => {
            state = state.setIn(['projectCardTemp', action.name], action.value)
            return state
        },
		[ActionTypes.CHANGE_PROJECT_CARD_CATEGORY_TYPE]                    : () => {
            state = state.setIn(['projectCardTemp', 'selectUuid'], action.uuid)
						.setIn(['projectCardTemp', 'selectName'], action.name)
            return state
        },

		// 保存卡片之后
        [ActionTypes.SAVE_PROJECT_CARD]               : () => {
            if (action.flag === 'insertAndNew') {
                state = state.setIn(['projectCardTemp', 'name'], '')
                             .setIn(['projectCardTemp', 'code'], action.code)
            }
            return state
        },
		[ActionTypes.NEW_SAVE_PROJECT_CARD]               : () => {
            if (action.flag === 'insertAndNew') {
                state = state.setIn(['projectCardTemp', 'name'], '')
							.setIn(['projectCardTemp', 'basicProductOpen'], '')
							.setIn(['projectCardTemp', 'contractCostOpen'], '')
							.setIn(['projectCardTemp', 'engineeringSettlementOpen'], '')
							.setIn(['projectCardTemp', 'contractProfitOpen'], '')
                             .setIn(['projectCardTemp', 'code'], action.code)
            }
            return state
        },


	}[action.type] || (() => state))()
}
