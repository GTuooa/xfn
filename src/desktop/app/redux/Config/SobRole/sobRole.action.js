import fetchApi from 'app/constants/fetch.constant.js'
import fetchApiRunning from 'app/constants/fetch.account.js'
import * as ActionTypes from './ActionTypes.js'
import { fromJS } from 'immutable'
import { showMessage } from 'app/utils'
import { message } from 'antd'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

// 通用的简单的修改设置的方法
export const changeSobRoleCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_SOB_ROLE_COMMON_STRING,
    place,
    value
})

// 
export const setSobRoleModuleListValue = (place, value) => dispatch => {

	dispatch({
		type: ActionTypes.SET_SOB_ROLE_MODULE_LIST_VALUE,
		place,
		value
	})
}

// 账套设置页面获取角色列表
export const getSobRoleListFromSobConfig = (sobId, sobType, sobName) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	fetchApi('getrolelist', 'GET', `sobId=${sobId}&sobType=${sobType}`, json => {
		if (showMessage(json)) {
			
			fetchApi('getrolepermission', 'GET', `sobId=${sobId}&roleId=${json.data.roleList[0].roleId}`, role => {
				dispatch({
					type: ActionTypes.GET_SOB_ROLE_LIST_FROM_SOB_OPTION,
					sobType,
					sobId,
					sobName,
					receivedData: json.data,
					roleData: role.data
				})
			})
			if (sobType === 'SMART') {
				// 先获取一波卡片和范围
				dispatch(getProjectAllCard(sobId))
				dispatch(getProcessModelList(sobId))
			}
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const switchSobRoleCurrentRole = (role) => (dispatch, getState) => {

	const sobRoleState = getState().sobRoleState
	const views = sobRoleState.get('views')

	fetchApi('getrolepermission', 'GET', `sobId=${views.get('sobId')}&roleId=${role.get('roleId')}`, json => {
		dispatch({
			type: ActionTypes.SWITCH_SOB_ROLE_CURRENT_ROLE,
			role,
			receivedData: json.data
		})
	})
}

export const beforeEditSobRole = (status) => dispatch => {
	dispatch({
		type: ActionTypes.BEFORE_EDIT_SOB_ROLE,
		status
	})	
}

// 修改角色
export const saveSobRole = (roleInputName, roleTemp, insertOrModify, index) => (dispatch, getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const sobRoleState = getState().sobRoleState
	const views = sobRoleState.get('views')

	if (insertOrModify === 'insert') {
		fetchApi('addrole', 'POST', JSON.stringify({
			sobId: views.get('sobId'),
			sobType: views.get('sobType'),
			roleName: roleInputName,                       
		}), json => {
			if (showMessage(json)) {
				fetchApi('getrolelist', 'GET', `sobId=${views.get('sobId')}&sobType=${views.get('sobType')}`, rolelListJson => {
					dispatch({
						type: ActionTypes.AFTER_EDIT_SOB_ROLE,
						receivedData: json.data,
						roleList: rolelListJson.data.roleList,
						roleTemp: {
							roleId: json.data.roleId,
							roleInfo: "",
							roleName: json.data.roleName,
						}
					})
				})
				dispatch(refreshSobOption(views.get('sobId')))
			}
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		})
	} else if (insertOrModify === 'modify') {
		fetchApi('modifyrolename', 'POST', JSON.stringify({
			sobId: views.get('sobId'),
			sobType: views.get('sobType'),
			roleName: roleInputName,
			roleId: roleTemp.get('roleId')                      
		}), json => {
			if (showMessage(json)) {
				const newRoleTemp = json.data.roleList.find(v => v.roleName === roleInputName)
				dispatch({
					type: ActionTypes.AFTER_EDIT_SOB_ROLE,
					editType: 'modify',
					index,
					roleTemp: newRoleTemp
				})
			}
			dispatch(refreshSobOption(views.get('sobId')))
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		})
	}
	
}

// 修改角色权限
export const modifySobRoleModule = (callback) => (dispatch, getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const sobRoleState = getState().sobRoleState
	const views = sobRoleState.get('views')
	const roleTemp = sobRoleState.get('roleTemp')
	const roleModuleTemp = sobRoleState.get('roleModuleTemp')

	fetchApi('modifyrole', 'POST', JSON.stringify({
		sobId: views.get('sobId'),
		sobType: views.get('sobType'),
		roleId: roleTemp.get('roleId'),
		roleName: roleTemp.get('roleName'),
		defaultRole: roleModuleTemp.get('defaultRole') ,
		moduleList: roleModuleTemp.get('moduleList')                                      
	}), json => {
		if (showMessage(json, 'show')) {
			dispatch({
				type: ActionTypes.AFTER_MODIFY_SOB_ROLE,
				bool: false.value,
				receivedData: json.data,
			})
			callback && callback()
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

// 删除角色
export const deleteSobRole = (roleTemp, callback) => (dispatch, getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

	const sobRoleState = getState().sobRoleState
	const views = sobRoleState.get('views')

	fetchApi('deleterole', 'POST', JSON.stringify({
		sobId: views.get('sobId'),
		roleId: roleTemp.get('roleId'),                                  
	}), json => {
		callback(json)
		if (json.code === 0) {
			// 判断如果成功重新获取
			message.success('操作成功')
			dispatch(getSobRoleListFromSobConfig(views.get('sobId'), views.get('sobType')))

			dispatch(refreshSobOption(views.get('sobId')))

		} else if (json.code !== 3004) {
			showMessage(json)
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const refreshSobOption = (sobId) => dispatch => {
	fetchApi('sobOptionInit', 'GET', `sobId=${sobId}`, json => {
		if(showMessage(json)){
			dispatch({
				type: ActionTypes.SOB_OPTION_INIT,
				receivedData: json.data,
			})
		}
	})
}


// 获取项目可选范围
export const getProjectAllCard = (sobId, callBack) => (dispatch, getState) => {

	fetchApiRunning(`getProjectConfigHighTypeSob`, 'GET', `sobId=${sobId}`, list => {
        if (showMessage(list)) {
			const categoryList = list.data.map(v => v.uuid)
			dispatch(changeSobRoleCommonString('categoryRange', fromJS(categoryList)))

			fetchApiRunning('getProjectCardList', 'POST', JSON.stringify({
				sobId,
				categoryList: categoryList,
				needCommonCard: true,
				needAssist:true,
				needMake:true,
				needIndirect:true,
				needMechanical:true
			}), json => {
				if (showMessage(json)) {
					dispatch(changeSobRoleCommonString('allCardListL', fromJS(json.data.result)))
					callBack && callBack()
				}
			})

		}
	})
}

// 获取项目可选范围
export const getProcessModelList = (sobId) => (dispatch, getState) => {

	fetchApiRunning('getApprovalModelList', 'GET', `sobId=${sobId}`, json => {
		if (showMessage(json)) {
			dispatch(changeSobRoleCommonString('processModelList', fromJS(json.data)))
		}
	})
}

export const getProjectTreeList = (range, callBack) => (dispatch, getState) => {

	const sobRoleState = getState().sobRoleState
	const views = sobRoleState.get('views')
	const sobId = views.get('sobId')

	fetchApiRunning('getProjectTreeList', 'POST', JSON.stringify({
		sobId,
		categoryList: range,
	}), json => {
		if (showMessage(json)) {
			dispatch(changeSobRoleCommonString('modalCategoryList', fromJS(json.data.typeList))) 
			const allCardListL = getState().sobRoleState.get('allCardListL')
			dispatch(changeSobRoleCommonString('modalCardList', allCardListL)) 
			dispatch(changeSobRoleCommonString('selectCardList', fromJS([])))
			callBack && callBack()
		}
	})
}

// 获取存货的选择里的类别和
export const getProjectAllCardList = (categoryList, modalName, leftNotNeed, callBack) => (dispatch, getState) => {

    const sobRoleState = getState().sobRoleState
	const views = sobRoleState.get('views')
	const sobId = views.get('sobId')

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if(!leftNotNeed) {
        fetchApiRunning('getProjectTreeList','POST', JSON.stringify({
            sobId,
            categoryList,
        }), json => {
            if (showMessage(json)) {
                dispatch(changeSobRoleCommonString('modalCategoryList', fromJS(json.data.typeList)))
            }
        })
    }
    fetchApiRunning('getProjectCardList','POST', JSON.stringify({
        sobId,
        categoryList,
        needCommonCard: true,
        needAssist: true,
        needMake: true,
        needIndirect: true,
        needMechanical: true,
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(changeSobRoleCommonString('modalCardList', fromJS(json.data.result)))
            callBack && callBack()
        }
    })
    
}

// 往来选择框里选择类别下的卡片
export const getProjectSomeCardList = (uuid, level) =>  (dispatch,getState) => {

	const sobRoleState = getState().sobRoleState
	const views = sobRoleState.get('views')
	const sobId = views.get('sobId')

    if (level == 1) {
        fetchApiRunning('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            categoryUuid:uuid,
            listByCategory:true,
            subordinateUuid:'',
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSobRoleCommonString('modalCardList', fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApiRunning('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            subordinateUuid:uuid,
            listByCategory:false,
            categoryUuid:uuid,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSobRoleCommonString('modalCardList', fromJS(json.data.resultList)))
            }
        })
    }
}