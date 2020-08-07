import { fromJS, toJS } from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import { DateLib } from 'app/utils'

const sobOptionState = fromJS({
	sobOptionModal: 'insert',
	tempSob: {
		"sobid":'',
        "sobname":'',
        "companyname":'',
        "vcname":'',
        "currency":'',
        "template":'3',
        "firstyear":'',
		"firstmonth":'',
		"periodStartMonth": '',
		customizeList: [],
		accountModelList: [],
		accountingRoleInfo: [],
		smartRoleInfo: [],
		jrModelList: [
			// {
			// 	modelId: "RUNNING_SIMPLE_MODEL",
			// 	modelName: "一号智能版",
			// 	modelNumber: "3",
			// 	type: "JR_MODEL",
			// }
		],
		sobModel: {

		},
        "adminlist":[

        ],
        "observerlist":[

        ],
        "operatorlist":[

        ],
		"reviewList": [

		],
		"vcReviewList": [

		],
		"flowReviewList": [

		],
        "moduleInfo":{
            "ENCLOSURE_RUN":{
                "moduleCode":"ENCLOSURE_RUN",
                "moduleName":"附件",
                "beOpen":true,
                "level":1
            },
            "ASSETS":{
                "moduleCode":"ASSETS",
                "moduleName":"资产管理",
                "beOpen":false,
                "level":2
            },
            "CURRENCY":{
                "moduleCode":"CURRENCY",
                "moduleName":"外币核算",
                "beOpen":false,
                "level":2
            },
            "ASS":{
                "moduleCode":"ASS",
                "moduleName":"辅助核算",
                "beOpen":false,
                "level":2
            },
            "RUNNING":{
                "moduleCode":"RUNNING",
                "moduleName":"智能流水",
                "beOpen":true,
                "level":1
            },
            "GL":{
                "moduleCode":"GL",
                "moduleName":"总账",
                "beOpen":false,
                "level":1
            },
            "AMB":{
                "moduleCode":"AMB",
                "moduleName":"阿米巴报表",
                "beOpen":false,
                "level":2
            },
            "ENCLOSURE_GL":{
                "moduleCode":"ENCLOSURE_GL",
                "moduleName":"附件",
                "beOpen":false,
                "level":2
            },
            "NUMBER":{
                "moduleCode":"NUMBER",
                "moduleName":"数量核算",
                "beOpen":false,
                "level":2
            }
        },
        "vcObserverList":[

        ],
        "cashierList":[

        ],
        "flowObserverList":[

        ]
	},
	copyModuleIsNewJr: true,
	copyModuleMapItem: {
		COPY_BASIS_SETTING: {
			beOpen: true,
			beOverdue: false,
			canModify: false,
			level: 1,
			moduleCode: "COPY_BASIS_SETTING",
			moduleName: "基础设置",
		},
	},
	identifyingCodeList: []
})

export default function handleConfigSob(state = sobOptionState, action) {
	return ({
		[ActionTypes.SOB_OPTION_INIT]							        : () => {

			const sobid = action.receivedData.sobid
			state = state.set('tempSob',fromJS(action.receivedData))
						.set('sobOptionModal', sobid ? 'modify' : 'insert')

			if (sobid) { // 修改
				state = state.setIn(['tempSob', 'oldModuleInfo'], fromJS(action.receivedData.moduleInfo))
							.setIn(['tempSob', 'oldTemplate'], fromJS(action.receivedData.template))
			} else {
				const running = action.receivedData.moduleInfo.RUNNING
				const template = sobid ? action.receivedData.template : (running ? '3' : '4')
				const today = new DateLib()

				state = state.setIn(['tempSob', 'template'], template)
							.setIn(['tempSob', 'sobname'], action.sobname ? action.sobname : '')
							.setIn(['tempSob', 'firstyear'], today.getYear())
							.setIn(['tempSob', 'firstmonth'], today.getMonth())

				if (running) { // 智能版默认开启智能总账
					state = state.setIn(['tempSob', 'moduleInfo', 'RUNNING_GL', 'beOpen'], true)
					const jrModelList = action.receivedData.jrModelList
					if (jrModelList && jrModelList[0] && !jrModelList[0].customize) {
						state = state.setIn(['tempSob', 'sobModel'], fromJS(jrModelList[0]))
						if (jrModelList[0].newJr === true) {
							if (jrModelList[0].moduleMap.INVENTORY) {
								state = state.setIn(['tempSob', 'moduleInfo', 'INVENTORY', 'beOpen'], jrModelList[0].moduleMap.INVENTORY.beOpen)
							}
							if (jrModelList[0].moduleMap.PROJECT) {
								state = state.setIn(['tempSob', 'moduleInfo', 'PROJECT', 'beOpen'], jrModelList[0].moduleMap.PROJECT.beOpen)
							}
							if (jrModelList[0].moduleMap.QUANTITY) {
								state = state.setIn(['tempSob', 'moduleInfo', 'QUANTITY', 'beOpen'], jrModelList[0].moduleMap.QUANTITY.beOpen)
							}
							if (jrModelList[0].moduleMap.WAREHOUSE) {
								state = state.setIn(['tempSob', 'moduleInfo', 'WAREHOUSE', 'beOpen'], jrModelList[0].moduleMap.WAREHOUSE.beOpen)
							}
							if (jrModelList[0].moduleMap.SCXM) {
								state = state.setIn(['tempSob', 'moduleInfo', 'SCXM', 'beOpen'], jrModelList[0].moduleMap.SCXM.beOpen)
							}
							if (jrModelList[0].moduleMap.SGXM) {
								state = state.setIn(['tempSob', 'moduleInfo', 'SGXM', 'beOpen'], jrModelList[0].moduleMap.SGXM.beOpen)
							}
							state = state.setIn(['tempSob', 'moduleMap'], fromJS(jrModelList[0].moduleMap))
						}
					}
				} else {
					if (action.receivedData.moduleInfo.ASS) {
						state = state.setIn(['tempSob', 'moduleInfo', 'ASS', 'beOpen'], true)
					}
					if (action.receivedData.moduleInfo.ASSETS) {
						state = state.setIn(['tempSob', 'moduleInfo', 'ASSETS', 'beOpen'], true)
					}
				}
			}

			return state
		},
		[ActionTypes.SOB_OPTION_CHANGE_CONTENT]							: () => {
			state = state.setIn(['tempSob',action.name],action.value)
			return state
		},
		[ActionTypes.SOB_OPTION_CHANGE_SOB_TEMPLATE]					: () => {

			// 流水模块是1，总账模块是2
			const templateTypeZN = ['3']
			const leve = templateTypeZN.indexOf(action.value) > -1 ? 2 : 1
			const moduleName = templateTypeZN.indexOf(action.value) > -1 ? 'RUNNING' : 'GL'
			// 切换template时关闭另一个模块的东西

			state = state.updateIn(['tempSob', 'moduleInfo'], v => v.map(w => w.get('level') === leve ? w.set('beOpen', false) : w))
						.setIn(['tempSob', 'template'], action.value)
						.setIn(['tempSob', 'moduleInfo', moduleName, 'beOpen'], true)

			if (moduleName === 'RUNNING') {
				state = state.setIn(['tempSob', 'moduleInfo', 'RUNNING_GL', 'beOpen'], true)
				// 切换后重置 sobModel
				const jrModelList = state.getIn(['tempSob', 'jrModelList'])
				if (jrModelList && jrModelList.get(0) && !jrModelList.getIn([0, 'customize'])) {
					state = state.setIn(['tempSob', 'sobModel'], jrModelList.get(0))
					if (jrModelList.getIn([0, 'newJr']) === true) { // 有些模块必须开启
						if (jrModelList.getIn([0, 'moduleMap', 'INVENTORY'])) {
							state = state.setIn(['tempSob', 'moduleInfo', 'INVENTORY', 'beOpen'], jrModelList.getIn([0, 'moduleMap', 'INVENTORY', 'beOpen']))
						}
						if (jrModelList.getIn([0, 'moduleMap', 'PROJECT'])) {
							state = state.setIn(['tempSob', 'moduleInfo', 'PROJECT', 'beOpen'], jrModelList.getIn([0, 'moduleMap', 'PROJECT', 'beOpen']))
						}
						if (jrModelList.getIn([0, 'moduleMap', 'QUANTITY'])) {
							state = state.setIn(['tempSob', 'moduleInfo', 'QUANTITY', 'beOpen'], jrModelList.getIn([0, 'moduleMap', 'QUANTITY', 'beOpen']))
						}
						if (jrModelList.getIn([0, 'moduleMap', 'WAREHOUSE'])) {
							state = state.setIn(['tempSob', 'moduleInfo', 'WAREHOUSE', 'beOpen'], jrModelList.getIn([0, 'moduleMap', 'WAREHOUSE', 'beOpen']))
						}
						if (jrModelList.getIn([0, 'moduleMap', 'SCXM'])) {
							state = state.setIn(['tempSob', 'moduleInfo', 'SCXM', 'beOpen'], jrModelList.getIn([0, 'moduleMap', 'SCXM', 'beOpen']))
						}
						if (jrModelList.getIn([0, 'moduleMap', 'SGXM'])) {
							state = state.setIn(['tempSob', 'moduleInfo', 'SGXM', 'beOpen'], jrModelList.getIn([0, 'moduleMap', 'SGXM', 'beOpen']))
						}
					}
				}
				
			} else if (moduleName === 'GL') {
				// 切换后重置 sobModel
				const accountModelList = state.getIn(['tempSob', 'accountModelList'])
				if (accountModelList && accountModelList.get(0)) {
					state = state.setIn(['tempSob', 'sobModel'], accountModelList.get(0))
				}
				if (state.getIn(['tempSob', 'moduleInfo', 'ASS'])) {
					state = state.setIn(['tempSob', 'moduleInfo', 'ASS', 'beOpen'], true)
				}
				if (state.getIn(['tempSob', 'moduleInfo', 'ASSETS'])) {
					state = state.setIn(['tempSob', 'moduleInfo', 'ASSETS', 'beOpen'], true)
				}
			}

			return state
		},

		[ActionTypes.SOB_OPTION_CHANGE_TIME]							: () => {
			state = state.setIn(['tempSob','firstyear'],action.firstyear)
						.setIn(['tempSob','firstmonth'],action.firstmonth)
			return state
		},
		[ActionTypes.SOB_OPTION_CHANGE_FUN_MODUEL]						: () => {
			state = state.setIn(['tempSob','moduleInfo',action.moduleCode,'beOpen'], action.value)
			const moduleInfo = state.getIn(['tempSob', 'moduleInfo'])

			if (action.moduleCode === 'RUNNING') {
				if (action.value) {
					if (moduleInfo.get('ASS')) {
						state = state.setIn(['tempSob', 'moduleInfo', 'ASS', 'beOpen'], false)
					}
					if (moduleInfo.get('AMB')) {
						state = state.setIn(['tempSob', 'moduleInfo', 'AMB', 'beOpen'], false)
					}
				} else {
					state.getIn(['tempSob','moduleInfo']).map((item) => {
						if (item.get('level') === 1) {
							state = state.setIn(['tempSob','moduleInfo',item.get('moduleCode'),'beOpen'],false)
						}
					})
				}
			}
			if (action.moduleCode === 'GL' && !action.value) {
				state.getIn(['tempSob','moduleInfo']).map((item) => {
					if (item.get('level') === 2) {
						state = state.setIn(['tempSob', 'moduleInfo', item.get('moduleCode'), 'beOpen'], false)
					}
				})
			}
			if(action.moduleCode === 'ASS' && !action.value){
				if (moduleInfo.get('AMB')) {
					state = state.setIn(['tempSob', 'moduleInfo', 'AMB', 'beOpen'], action.value)
				}
			}
			if(action.moduleCode === 'INVENTORY' && !action.value){
				if (moduleInfo.get('QUANTITY')) {
					state = state.setIn(['tempSob', 'moduleInfo', 'QUANTITY', 'beOpen'], action.value)
				}
				if (moduleInfo.get('WAREHOUSE')) {
					state = state.setIn(['tempSob', 'moduleInfo', 'WAREHOUSE', 'beOpen'], action.value)
				}
			}
			if(action.moduleCode === 'PROJECT' && !action.value){
				if (moduleInfo.get('SCXM')) {
					state = state.setIn(['tempSob', 'moduleInfo', 'SCXM', 'beOpen'], action.value)
				}
				if (moduleInfo.get('SGXM')) {
					state = state.setIn(['tempSob', 'moduleInfo', 'SGXM', 'beOpen'], action.value)
				}
			}
			if(action.moduleCode === 'QUANTITY' && !action.value){
				if (moduleInfo.get('ASSIST')) {
					state = state.setIn(['tempSob', 'moduleInfo', 'ASSIST', 'beOpen'], action.value)
				}
				if (moduleInfo.get('SERIAL')) {
					state = state.setIn(['tempSob', 'moduleInfo', 'SERIAL', 'beOpen'], action.value)
				}
				if (moduleInfo.get('BATCH')) {
					state = state.setIn(['tempSob', 'moduleInfo', 'BATCH', 'beOpen'], action.value)
				}
			}
			return state
		},
		[ActionTypes.SOB_OPTION_ROLE_CHECK_STATE]					      : () => {
			state = state.setIn(['tempSob', action.listName, action.index, 'openReview'], !action.lastStatus)
			return state
		},
		[ActionTypes.SOB_OPTION_ROLE_DELETE]							  : () => {
			state = state.updateIn(['tempSob', action.listName, action.listIndex, 'userList'], v =>  v.delete(action.index))
			return state
		},
		[ActionTypes.CHANGE_SOB_PERMISSION_LIST]						  : () => {
			return state.setIn(['tempSob', action.listName, action.index, 'userList'], fromJS(action.list))
		},
		[ActionTypes.AFTER_GET_IDENTIFYING_CODE_LIST]					  : () => {
			return state.set('identifyingCodeList', fromJS(action.receivedData))
		},
		[ActionTypes.INIT_IDENTIFYING_CODE_TEMP]						  : () => {
			return state.set('copyModuleMapItem', sobOptionState.get('copyModuleMapItem')).set('copyModuleIsNewJr', true)
		},
		[ActionTypes.SET_SOB_CHANGE_COPY_MODULE_ITEM]						  : () => {
			return state.set('copyModuleMapItem', action.item).set('copyModuleIsNewJr', action.newJr)
		},
		[ActionTypes.SOB_OPTION_CHANGE_COPY_MODULE_ITEM]				  : () => {
			return state = state.setIn(['copyModuleMapItem', action.moduleCode, 'beOpen'], action.value)
		}
	}[action.type] || (() => state))()
}
