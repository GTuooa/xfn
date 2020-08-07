import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as ActionTypes from './ActionTypes.js'
import { DateLib } from 'app/utils'

const sobConfigState = fromJS({
    sobConfigMode: 'insert',
    allCheckboxDisplay: false,
    xuanzeboxDisplay: false,
    toolBarDisplayIndex: 1,
    sobSelectedIndex: -1,
    currentCopySobId: '',
    isIdentifyingCode: false,
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
        accountModelList: [],
        smartRoleInfo: [],
        accountingRoleInfo: [],
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
                "level":2
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

        ],
        "flowReviewList": [],
        "reviewList": [],
        "vcReviewList": []
	},
	sobList: [],
    mySobDetailList: [],
	log: {
		showLog: false,//是否显示日志页面
		pageCount: 0,
		currentPage:1,
		backSobId:'',
		logList:[]
    },
    copyModuleMapItem: {
		"PROJECT":{
			"moduleCode":"PROJECT",
			"moduleName":"项目设置",
			"beOpen":false,
			"beOverdue":false,
			"level":1
		},
		"ACCOUNT":{
			"moduleCode":"ACCOUNT",
			"moduleName":"账户设置",
			"beOpen":false,
			"beOverdue":false,
			"level":1
		},
		"CONTACT":{
			"moduleCode":"CONTACT",
			"moduleName":"往来设置",
			"beOpen":false,
			"beOverdue":false,
			"level":1
		},
		"WAREHOUSE":{
			"moduleCode":"WAREHOUSE",
			"moduleName":"仓库设置",
			"beOpen":false,
			"beOverdue":false,
			"level":1
		},
		"INVENTORY":{
			"moduleCode":"INVENTORY",
			"moduleName":"存货设置",
			"beOpen":false,
			"beOverdue":false,
			"level":1
		},
		"QUANTITY":{
			"moduleCode":"QUANTITY",
			"moduleName":"数量核算",
			"beOpen":false,
			"beOverdue":false,
			"level":1
		},
		"RUNNING":{
			"moduleCode":"RUNNING",
			"moduleName":"流水设置",
			"beOpen":false,
			"beOverdue":false,
			"level":1
		},
		"SOB_ALL":{
			"moduleCode":"SOB_ALL",
			"moduleName":"全部",
			"beOpen":false,
			"beOverdue":false,
			"level":1
		}
	},
    identifyingCodeList: [],
    copyModuleIsNewJr: true
})

export default function handleConfigSob(state = sobConfigState, action) {
    return ({
        [ActionTypes.INIT_SOBCONFIG]                         : () => sobConfigState,

        [ActionTypes.GET_SOB_LIST]							 : () => {

            const sobList = fromJS(action.receivedData)
            const mySobList = action.mySobList

            const mySobDetailList = sobList.filter(v => mySobList.some(w => w.get('sobId') == v.get('sobid')))

			state = state.set('sobList', sobList)
                            .set('mySobDetailList', mySobDetailList)
			return state
		},

        [ActionTypes.BEFORE_INSERT_OR_MODIFY_SOB]            : () => {

            if (action.history) {
                setTimeout(() => action.history.push('/config/sob/option'), 0)
                state = state.set('sobConfigMode', action.receivedData.sobid == '' ? 'insert' : 'modify')
            }

            const sobid = action.receivedData.sobid
            state = state.set('tempSob', fromJS(action.receivedData))

            if (sobid) { // 修改
                state = state.setIn(['tempSob', 'oldModuleInfo'], fromJS(action.receivedData.moduleInfo))
							.setIn(['tempSob', 'oldTemplate'], fromJS(action.receivedData.template))
            } else {
                const running = action.receivedData.moduleInfo.RUNNING
                const template = sobid ? action.receivedData.template : (running ? '3' : '4')
                const today = new DateLib()

                state = state.setIn(['tempSob', 'template'], template)
                            .setIn(['tempSob', 'moduleInfo', template === '3' ? 'RUNNING' : 'GL', 'beOpen'], true)
                            .setIn(['tempSob', 'sobname'], action.sobName ? action.sobName : '')
                            .setIn(['tempSob', 'firstyear'], today.getYear())
							.setIn(['tempSob', 'firstmonth'], today.getMonth())
                if (running) { // 智能版默认开启智能总账
                    state = state.setIn(['tempSob', 'moduleInfo', 'RUNNING_GL', 'beOpen'], true)
					const jrModelList = action.receivedData.jrModelList
					if (jrModelList && jrModelList[0] && !jrModelList[0].customize) {
                        state = state.setIn(['tempSob', 'sobModel'], fromJS(jrModelList[0]))
                        if (jrModelList[0].newJr === true) {
                            if (jrModelList[0].moduleMap.INVENTORY) {
								state = state.setIn(['tempSob', 'moduleInfo', 'INVENTORY', 'beOpen'], fromJS(jrModelList[0].moduleMap.INVENTORY.beOpen))
							}
							if (jrModelList[0].moduleMap.PROJECT) {
								state = state.setIn(['tempSob', 'moduleInfo', 'PROJECT', 'beOpen'], fromJS(jrModelList[0].moduleMap.PROJECT.beOpen))
							}
							if (jrModelList[0].moduleMap.QUANTITY) {
								state = state.setIn(['tempSob', 'moduleInfo', 'QUANTITY', 'beOpen'], fromJS(jrModelList[0].moduleMap.QUANTITY.beOpen))
							}
							if (jrModelList[0].moduleMap.WAREHOUSE) {
								state = state.setIn(['tempSob', 'moduleInfo', 'WAREHOUSE', 'beOpen'], fromJS(jrModelList[0].moduleMap.WAREHOUSE.beOpen))
                            }
                            if (jrModelList[0].moduleMap.SCXM) {
								state = state.setIn(['tempSob', 'moduleInfo', 'SCXM', 'beOpen'], fromJS(jrModelList[0].moduleMap.SCXM.beOpen))
                            }
                            if (jrModelList[0].moduleMap.SGXM) {
								state = state.setIn(['tempSob', 'moduleInfo', 'SGXM', 'beOpen'], fromJS(jrModelList[0].moduleMap.SGXM.beOpen))
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
        [ActionTypes.CHANGE_SOBNAME]                         : () => state.setIn(['tempSob', 'sobname'], action.sobname),
        [ActionTypes.CHANGE_ZN_SOBMODEL]                         : () => state.setIn(['tempSob', 'sobModel'], action.sobModel),
        [ActionTypes.CHANGE_SOB_FIRST_YEAR_MONTH]            : () => state.setIn(['tempSob', 'firstyear'], action.firstyear).setIn(['tempSob', 'firstmonth'], action.firstmonth),
        [ActionTypes.CHANGE_SOB_TEMPLATE]                        : () => {
            // if (action.template === '2') {
                // return state.setIn(['tempSob', 'template'], action.template)
            // } else {
            //     return state.setIn(['tempSob', 'template'], action.template)
            // }
            const templateTypeZN = ['3']
            // 流水模块是1，总账模块是2
			const leve = templateTypeZN.indexOf(action.template) > -1 ? 2 : 1
			const moduleName = templateTypeZN.indexOf(action.template) > -1 ? 'RUNNING' : 'GL'
			// 切换template时关闭另一个模块的东西

			state = state.updateIn(['tempSob', 'moduleInfo'], v => v.map(w => w.get('level') === leve ? w.set('beOpen', false) : w))
						.setIn(['tempSob', 'template'], action.template)
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
        // [ActionTypes.SOB_OPTION_CHANGE_FUN_MODUEL]							: () => {

		// 	state = state.setIn(['tempSob', 'moduleInfo', action.moduleCode, 'beOpen'], action.value)
        //     const moduleInfo = state.getIn(['tempSob', 'moduleInfo'])
		// 	if (action.moduleCode === 'RUNNING') {
		// 		if (action.value) {
        //             if (moduleInfo.get('ASS')) {
        //                 state = state.setIn(['tempSob','moduleInfo','ASS','beOpen'],false)
        //             }
		// 			if (moduleInfo.get('AMB')) {
        //                 state = state.setIn(['tempSob','moduleInfo','AMB','beOpen'],false)
        //             }
		// 		} else {
		// 			state.getIn(['tempSob','moduleInfo']).map((item) =>{
		// 				if (item.get('level') === 1 ) {
		// 					state = state.setIn(['tempSob','moduleInfo',item.get('moduleCode'),'beOpen'],false)
		// 				}
		// 			})
		// 		}
		// 	}
		// 	if (action.moduleCode === 'GL' && !action.value) {
		// 		state.getIn(['tempSob','moduleInfo']).map((item) => {
		// 			if(item.get('level') === 2){
		// 				state = state.setIn(['tempSob','moduleInfo',item.get('moduleCode'),'beOpen'],false)
		// 			}
		// 		})
		// 	}
		// 	if (action.moduleCode === 'ASS' && !action.value) {
        //         if (moduleInfo.get('AMB')) {
        //             state = state.setIn(['tempSob','moduleInfo','AMB','beOpen'],action.value)
        //         }
        //     }
		// 	return state
		// },
        [ActionTypes.SOB_OPTION_CHANGE_FUN_MULTIPLE_MODUEL]              : () => {
            const valueArr = action.valueArr // 勾选了的模块
            const selectModalList = action.selectModalList // 所有可选模块的可选模式
           
            let errlist = []
            selectModalList.map(v => {
                if (valueArr.includes(v.value)) {
                    if (v.value === 'AMB') {
                        if (valueArr.includes('ASS')) {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                        } else {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                            errlist.push('启用阿米巴必须开启辅助核算')
                        }
                    } else if (v.value === 'SCXM') {
                        if (valueArr.includes('PROJECT')) {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                        } else {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                            errlist.push('启用生产项目必须开启项目管理')
                        }
                    } else if (v.value === 'SGXM') {
                        if (valueArr.includes('PROJECT')) {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                        } else {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                            errlist.push('启用施工项目必须开启项目管理')
                        }
                    } else if (v.value === 'QUANTITY') {
                        if (valueArr.includes('INVENTORY')) {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                        } else {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                            errlist.push('启用数量核算必须开启存货管理')
                        }
                    } else if (v.value === 'WAREHOUSE') {
                        if (valueArr.includes('INVENTORY')) {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                        } else {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                            errlist.push('启用仓库核算必须开启存货管理')
                        }
                    } else  if (v.value === 'ASSIST') {
                        if (valueArr.includes('INVENTORY') && valueArr.includes('QUANTITY')) {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                        } else {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                            errlist.push('启用辅助属性必须开启数量核算')
                        }
                    } else  if (v.value === 'SERIAL') {
                        if (valueArr.includes('INVENTORY') && valueArr.includes('QUANTITY')) {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                        } else {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                            errlist.push('启用序列号管理必须开启数量核算')
                        }
                    } else  if (v.value === 'BATCH') {
                        if (valueArr.includes('INVENTORY') && valueArr.includes('QUANTITY')) {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                        } else {
                            state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                            errlist.push('启用批次管理必须开启数量核算')
                        }
                    } else {
                        state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], true)
                    }
                } else {
                    state = state.setIn(['tempSob', 'moduleInfo', v.value, 'beOpen'], false)
                }
            })
            errlist.length && thirdParty.toast.info(errlist.join(';'), 3)

            return state
        },
        [ActionTypes.SOB_OPTION_ROLE_DELETE]							 : () => {
			state = state.updateIn(['tempSob',action.listName], v => v.delete(action.index))
			return state
		},
        [ActionTypes.SOB_OPTION_ROLE_CHECK_STATE]					     : () => {
			state = state.setIn(['tempSob', action.listName, action.index, 'openReview'], !action.lastStatus)
			return state
		},
        [ActionTypes.CHANGE_SOB_PERMISSION_LIST]						 : () => {
			return state.setIn(['tempSob', action.listName, action.index, 'userList'], fromJS(action.list))
		},
        [ActionTypes.CHANGE_SOB_CURRENCYMODEL]                           : () => state.setIn(['tempSob', 'currency'], action.currency),
        [ActionTypes.CHANGE_SOB_REVIEW_PERMISSION_LIST]                  : () => {

            let list = state.getIn(['tempSob', action.listName])
            const resultlist = action.resultlist

            if (list.size > 0) {
                for (let i = 0; list.size > i; i++) {
                    list = list.setIn([i, 'openReview'], false)
                }
            }

            resultlist.forEach(v => {
                const index = list.findIndex(w => w.get('emplId') === v.emplId)
                if (index > -1) {
                    list = list.setIn([index, 'openReview'], true)
                } else {
                    list = list.push(fromJS(v))
                }
            })

            state = state.setIn(['tempSob', action.listName], list)
            return state
        },
        // [ActionTypes.CANCEL_ENTER_SOB_FETCH]    : () => {
        //
        //         // console.log(`history: ${history}`)
        //     return state
        // }, //将当前状态还原
        // [ActionTypes.BEFORE_MODIFY_SOB]         : () => {
        //     setTimeout(() => history.push('/config/sob/option'), 0)
        //     return state.set('sob', action.sob)
        //         .set('sobConfigMode', 'modify') //设置模式更改为modify
        //         .set('sobSelectedIndex', action.idx) //设置当前选择的科目
        //         .setIn(['sob', 'oldYear'], action.sob.get('firstyear'))
        //         .setIn(['sob', 'oldMonth'], action.sob.get('firstmonth'))
        // },
        // [ActionTypes.BEFORE_INSERT_SOB]         : () => {
        //     setTimeout(() => history.push('/config/sob/option'), 0)
        //
        //     state = state.set('sob', sobConfigState.get('sob'))
        //         .set('sobConfigMode', 'insert') //设置模式更改为insert
        //     return state
        // },
        [ActionTypes.SHOW_ALL_SOB_CHECKBOX]     : () => state.set('toolBarDisplayIndex', 2).set('allCheckboxDisplay', true).set('xuanzeboxDisplay', false),
        [ActionTypes.HIDE_ALL_SOB_CHECKBOX]     : () => state.set('toolBarDisplayIndex', 1).set('allCheckboxDisplay', false),

        [ActionTypes.CHANGE_ADMIN_LIST]         : () => state.setIn(['sob', 'adminlist'], fromJS(action.adminlist)),
        [ActionTypes.CHANGE_OBSERVER_LIST]      : () => state.setIn(['sob', 'observerlist'], fromJS(action.observerlist)),
        [ActionTypes.CHANGE_OPERATOR_LIST]      : () => state.setIn(['sob', 'operatorlist'], fromJS(action.operatorlist)),

        // [ActionTypes.CHANGE_SOB_FIRSTMONTH]     : () => state.setIn(['sob', 'firstmonth'], action.firstmonth),
        [ActionTypes.CHANGE_XUANZEBOX_STATUS]   : () => state.update('xuanzeboxDisplay', v => !v),

        [ActionTypes.AFTER_GET_IDENTIFYING_CODE_LIST]					  : () => {
			return state.set('identifyingCodeList', fromJS(action.receivedData))
		},
		[ActionTypes.INIT_IDENTIFYING_CODE_TEMP]						  : () => {
			return state.set('copyModuleMapItem', sobConfigState.get('copyModuleMapItem')).set('currentCopySobId', '').set('isIdentifyingCode', true).set('copyModuleIsNewJr', true)
		},
		[ActionTypes.SET_SOB_CHANGE_COPY_MODULE_ITEM]					  : () => {
			return state.set('copyModuleMapItem', action.item.get('copyModuleMap')).set('currentCopySobId', action.sobId).set('isIdentifyingCode', action.isIdentifyingCode).set('copyModuleIsNewJr', action.item.get('newJr'))
		},
		[ActionTypes.SOB_OPTION_CHANGE_COPY_MODULE_ITEM]				  : () => {
            

			state = state.setIn(['copyModuleMapItem', action.moduleCode, 'beOpen'], action.value)

			// if ((action.moduleCode === 'QUANTITY' || action.moduleCode === 'WAREHOUSE') && action.value){
			// 	state = state.setIn(['copyModuleMapItem', 'INVENTORY', 'beOpen'], true)
			// }

			// if (action.moduleCode === 'INVENTORY' && !action.value) {
			// 	if (state.getIn(['copyModuleMapItem', 'QUANTITY'])) {
			// 		state = state.setIn(['copyModuleMapItem', 'QUANTITY', 'beOpen'], action.value)
			// 	}
			// 	if (state.getIn(['copyModuleMapItem', 'WAREHOUSE'])) {
			// 		state = state.setIn(['copyModuleMapItem', 'WAREHOUSE', 'beOpen'], action.value)
			// 	}
			// }

			return state
		}


    }[action.type] || (() => state))()
}
