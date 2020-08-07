import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import * as qcyeActions	from 'app/redux/Config/Qcye/qcye.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

// 刷新时，所有选中的选择框都变为未选中状态
export const initConfig = (aclist) => ({
	type: ActionTypes.INIT_CONFIG,
	aclist
})

//取消时，将当前状态还原
export const cancelEnterAcItemFetch = () => ({
	type: ActionTypes.CANCEL_ENTER_AC_ITEM_FETCH
})

// 对输入的科目编码进行判断，有上级科目和类别的要智能的显示，并付给state
export const changeAcCodeText = (acid, aclist) => ({
	type: ActionTypes.CHANGE_ACID_TEXT,
	acid,
	aclist
})

// 将输入的科目名称赋给state
export const changeAcNameText = (acname) => ({
	type: ActionTypes.CHANGE_ACNAME_TEXT,
	acname
})

// 将输入的科目类别赋给state
export const changeCategoryText = (category) => ({
	type: ActionTypes.CHANGE_CATEGORY_TEXT,
	category
})

// 将余额方向赋给state
export const changeAcDirectionText = (idx) => ({
	type: ActionTypes.CHANGE_DIRECTION_TEXT,
	idx
})
// 是否开启数量核算
export const changeAcAmountStateText = (acConfigMode) => ({
	type: ActionTypes.CHANGE_AMOUNT_TEXT,
	acConfigMode
})
// 将计算单位赋给state
export const changeAcUnitText = (unit,conversion) => ({
	type: ActionTypes.CHANGE_UNIT_TEXT,
	unit,
	conversion
})


export const changeAcconfigAcunit = (acunit) => ({
	type: ActionTypes.CHANGE_ACCONFIG_ACUNIT,
	acunit
})

// 编辑操作，将修改后的状态赋给state
export const modifyAcItem = AcItem => ({
	type: ActionTypes.MODIFY_AC_ITEM,
	AcItem
})

// 新增操作，设置tempAcItem的各项
export const insertAcItem = (AcItem, acid) => ({
	type: ActionTypes.INSERT_AC_ITEM,
	AcItem,
	acid
})

// 单个选择框被点击中后，更新当前acStatus为相反状态，当所有的acStatus都为true时，将selectall设为true
export const selectAcItem = idx => ({
	type: ActionTypes.SELECT_AC_ITEM,
	idx
})

// 让每一条的acStatus都与selectall的值相等，来达到选择全部的目的
export const selectAcAll = () => ({
	type: ActionTypes.SELECT_AC_ALL
})

// 改变类别时改变tabSelectedIndex为点击的类别，acStatus，selectall都为false
export const changeTabPane = (category, aclist) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_TAB_PANE,
		category,
		aclist
	})
	dispatch(clearAcChildshow())
}

export const clearAcChildshow = () => ({
	type: ActionTypes.CLEAR_AC_CHILDSHOW
})


// 改变model框的显示为相反状态
export const changeModalDisplay = () => ({
	type: ActionTypes.CHANGE_MODAL_DISPLAY
})

export const getFileUploadFetch = (form,openModal) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('acImport', 'UPLOAD', form, json => {
		if(showMessage(json)){
			dispatch(afterAcImport(json))
			openModal()
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			const loop = function (accessToken) {
				const time = setTimeout(() => {
					let showMessageMask = getState().configState.get('acshowMessageMask')
					fetchApi('acImportProgress', 'GET', `accessToken=${accessToken}`, json => {
						if(showMessage(json)){
							dispatch({
								type:ActionTypes.GET_IMPORT_PROGRESS,
								receivedData:json
							})
							if ((json.data.progress >= 100) && (json.data.successList.length > 0)) {
								dispatch(allActions.getAcListFetch())
							}
							if(showMessageMask && json.data.progress < 100){
								loop(accessToken)
							}
						}
					})
					clearTimeout(time)
				},500)
			}
			loop(json.data.accessToken)
		}else{
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		}
	})
}

export const beforeAcImport = () => ({
	type: ActionTypes.BEFORE_AC_IMPORT
})

export const afterAcImport = (receivedData) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_AC_IMPORT,
		receivedData
	})
}

export const closeAcImportContent = () => ({
	type: ActionTypes.CLOSE_AC_IMPORT_CONTENT
})

export const changeAcChildShow = (acid) => ({
	type: ActionTypes.CHANGE_AC_CHILDSHOW,
	acid
})

// 反悔模式
export const getReportAcReverseCheck = (type, acid, callback) => dispatch => {

	fetchApi(type === 'class' ? 'reportacregretcheck' : 'acregretcheckNum1', 'POST', JSON.stringify({acid}), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_REPORT_REVERSE_AC,
				receivedData: json.data
			})
			callback(acid)
			dispatch(changeAcReverseModifiable(true))
		} else {
			callback('请选择科目')
			dispatch(changeAcReverseModifiable(false))
		}
	})
}

export const getAcIdReverseAble = (acid, newAcid, callback) => dispatch => {

	fetchApi('acregretcheckNum2', 'POST', JSON.stringify({source: acid, target: newAcid}), json => {
		if (json.code === 11006) {
			dispatch({
				type: ActionTypes.CHANGE_CANCHANGECLASSID,
				canChangeClassId: '科目已存在'
			})
		} else if (showMessage(json)) {
			dispatch({
				type: ActionTypes.CHANGE_CANCHANGECLASSID,
				canChangeClassId: 'true'
			})
		}
	})
}

export const getReportAcRegretUse = (upperid, acid, acname, callback) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('reportacregretuse', 'POST', JSON.stringify({
		upperid,
		acid,
		acname
	}), json => {
		if (showMessage(json, 'show')) {
			callback()
			dispatch(allActions.getAcListFetch())
			dispatch(qcyeActions.getBaInitListFetch())
			dispatch(changeAcReverseModifiable(false))
			dispatch(switchReverseConfirmModalShow())
			dispatch(switchReverseModifiModalShow())
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const getReportAcRegretIdUse = (acid, newAcid, callback) => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('acregretuseNum', 'POST', JSON.stringify({
		source: acid,
		target: newAcid
	}), json => {
		if (showMessage(json, 'show')) {
			callback()
			dispatch(allActions.getAcListFetch())
			dispatch(qcyeActions.getBaInitListFetch())
			dispatch(changeAcReverseModifiable(false))
			dispatch(switchReverseConfirmModalShow())
			dispatch(switchReverseModifiModalShow())
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const changeIdNewAcReverseId = (id) => ({
	type: ActionTypes.CHANGE_ID_NEWACREVERSEID,
	id
})

export const switchReverseConfirmModalShow = () => ({
	type: ActionTypes.SWITCH_REVERSE_CONFIRM_MODAL_SHOW
})

export const switchReverseModifiModalShow = () => ({
	type: ActionTypes.SWITCH_REVERSE_MODIFI_MODAL_SHOW
})

export const switchReverseAcSelectModaShow = () => ({
	type: ActionTypes.SWITCH_REVERSE_AC_SELECT_MODAL_SHOW
})

export const createNewAcId = (id, upperid) => ({
	type: ActionTypes.CREATE_NEW_AC_ID,
	id,
	upperid
})

export const createNewAcName = (acname) => ({
	type: ActionTypes.CREATE_NEW_AC_NAME,
	acname
})

export const changeAcReverseModifiable = (bool) => ({
	type: ActionTypes.CHANGE_AC_REVERSE_MODIFIABLE,
	bool
})

export const changeMessageMask = () => ({
	type: ActionTypes.CHANGE_AC_MESSAGEMASK,
})
