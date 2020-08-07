import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as allActions from 'app/redux/Home/All/aclist.actions'
import * as qcyeActions from 'app/redux/Config/Qcye/qcye.action'
import * as Limit from 'app/constants/Limit.js'
// 科目设置页
// 根据输入的科目编码实时判断，显示科目的上级科目、方向、类别
// 当科目编码长度符合要求时，将tempAcItem填写完整
export const changeAcId = (acid, aclistSeq) => ({
	type: ActionTypes.CHANGE_ACID,
	acid,
	aclistSeq
})

// 将填入的科目名称填入tempAcItem
export const changeAcName = (acname) => ({
	type: ActionTypes.CHANGE_ACNAME,
	acname
})

// 将填入的科目类别填入tempAcItem
export const changeCategory = (category) => ({
	type: ActionTypes.CHANGE_CATEGORY,
	category
})

// 将科目方向填入tempAcItem
export const changeJvDirection = () => ({
	type: ActionTypes.CHANGE_DIRECTION
})

export const beforeModifyAc = (ac, idx, uppername, history) => ({
	type: ActionTypes.BEFORE_MODIFY_AC,
	ac,
	idx,
	uppername,
	history
})

export const beforeInsertAc = (ac, currTabAcList, first, history) => ({
	type: ActionTypes.BEFORE_INSERT_AC,
	ac,
	currTabAcList,
	first,
	history
})

export const changeTabIndexAcConfig = (idx) => ({
	type: ActionTypes.CHANGE_TAB_INDEX_ACCONFIG,
	idx
})

export const showAllAcCheckBox = () => ({
	type: ActionTypes.SHOW_ALL_AC_CHECKBOX
})

export const hideAllAcCheckBox = () => ({
	type: ActionTypes.HIDE_ALL_AC_CHECKBOX
})

export const showAllAcModifyButton = () => ({
	type: ActionTypes.SHOW_ALL_AC_MODIFY_BUTTON
})

export const hideAllAcModifyButton = () => ({
	type: ActionTypes.HIDE_ALL_AC_MODIFY_BUTTON
})

export const cancelEnterAcFetch = (history) => ({
	type: ActionTypes.CANCEL_ENTER_AC_FETCH,
	history
})

export const toggleLowerAc = (acid) => ({
	type: ActionTypes.TOGGLE_LOWER_AC,
	acid
})

// 反悔模式
// export const getReportAcReverseCheck = (acid) => dispatch => {
// 	fetchApi('reportacregretcheck', 'POST', JSON.stringify({acid}), json => {
// 		if (showMessage(json)) {
// 			dispatch({
// 				type: ActionTypes.GET_REPORT_REVERSE_AC,
// 				receivedData: json.data
// 			})
// 			dispatch(changeAcShowReverseModal(true))
// 			dispatch(changeAcReverseseved(false))
// 		}
// 	})
// }
//
// export const getReportAcRegretUse = (upperid, acid, acname) => dispatch => {
//
// 	if (acid.length !== upperid.length+2)
// 		return showMessage('', '', '', '科目编码的长度应为' + `${upperid.length+2}`)
// 	if (acname === '')
// 		return showMessage('', '', '', '科目名称不能为空')
//
// 	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
//
// 	fetchApi('reportacregretuse', 'POST', JSON.stringify({
// 		upperid,
// 		acid,
// 		acname
// 	}), json => {
// 		if (showMessage(json, 'show')) {
// 			dispatch(changeAcReverseseved(true))
// 			history.goBack()
// 		}
// 		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
// 	})
// }

export const createNewAcId = (id, upperid) => ({
	type: ActionTypes.CREATE_NEW_AC_ID,
	id,
	upperid
})

export const createNewAcName = (acname) => ({
	type: ActionTypes.CREATE_NEW_AC_NAME,
	acname
})

export const changeAcShowReverseModal = (bool) => ({
	type: ActionTypes.CHANGE_AC_SHOW_REVERSE_MODAL,
	bool
})

export const changeAcReverseseved = (bool) => ({
	type: ActionTypes.CHANGE_AC_REVERSESEVED,
	bool
})

// 是否开启数量核算
export const changeAcAmountStateText = (acConfigMode, prevAcunit) => ({
	type: ActionTypes.CHANGE_AC_AMOUNT_TEXT,
	acConfigMode,
	prevAcunit
})

export const changeAcconfigAcunit = (acunit) => ({
	type: ActionTypes.CHANGE_AC_ACCONFIG_ACUNIT,
	acunit
})

// 将计算单位赋给state (修改单位时)
export const changeAcUnitText = (unit,conversion) => ({
	type: ActionTypes.CHANGE_UNIT_TEXT,
	unit,
	conversion
})

//反悔模式
export const changeReverseTit = (idx) => ({
	type: ActionTypes.CHANGE_REVERSE_TIT,
	idx
})

// 取消
export const cancelReverse = (history) => ({
	type: ActionTypes.CANCEL_REVERSE,
	history
})

//选择科目
export const selectAcReverse = (acId) => ({
	type: ActionTypes.SELECT_AC_REVERSE,
	acId
})

export const getReportAcReverseCheck = (type, acid, history) => dispatch => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(type === 'class' ? 'reportacregretcheck' : 'acregretcheckNum1', 'POST', JSON.stringify({acid}), json => {
		if (json.code === 0) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_REPORT_REVERSE_AC,
				receivedData: json.data,
				history
			})
			dispatch(isClearAcReverseInfo(true))
		} else {
			thirdParty.toast.hide()
			dispatch(isClearAcReverseInfo(false))
			const classInfo = `${acid}科目不需要使用反悔模式，可直接在"科目设置"中增其下级科目`
			const idInfo = `${acid}科目不需要使用反悔模式，可直接在"科目设置"中修改其科目编码`

			thirdParty.Confirm({
				message: type === 'class' ? classInfo : idInfo,
				title: "提示",
				buttonLabels: ['取消', '重新选择'],
				onSuccess : (result) => {
					if (result.buttonIndex === 0) {
						history.goBack()
					} else if (result.buttonIndex === 1) {

					}
				}
			})
		}
	})
}

export const getAcIdReverseAble = (acid, newAcid, history) => dispatch => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('acregretcheckNum2', 'POST', JSON.stringify({
		source: acid,
		target: newAcid
	}), json => {
		if (json.code === 11006) {

			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.CHANGE_CANCHANGECLASSID,
				canChangeClassId: '科目已存在'
			})
			thirdParty.Alert('科目已存在', '确定')

		} else if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.CHANGE_CANCHANGECLASSID,
				canChangeClassId: 'true'
			})
		}
	})
}

//信息确认
export const getReportAcRegretUse = (upperid, acid, acname, history) => dispatch => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('reportacregretuse', 'POST', JSON.stringify({
		upperid,
		acid,
		acname
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch(allActions.getAcListFetch())
			dispatch(qcyeActions.getAcBalanceFetch())
			dispatch(isClearAcReverseInfo(false))
			thirdParty.toast.success('科目修改成功')
			history.push('/config/ac')
		}
	})
}

export const getReportAcRegretIdUse = (acid, newAcid) => dispatch => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('acregretuseNum', 'POST', JSON.stringify({
		source: acid,
		target: newAcid
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch(allActions.getAcListFetch())
			dispatch(qcyeActions.getAcBalanceFetch())
			dispatch(isClearAcReverseInfo(false))
			thirdParty.toast.success('科目修改成功')
			history.push('/config/ac')

		}
	})
}

export const isClearAcReverseInfo = (bool) => ({
	type: ActionTypes.IS_CLEAR_AC_REVERSE_INFO,
	bool
})

export const changeIdNewAcReverseId = (id) => ({
	type: ActionTypes.CHANGE_ID_NEWACREVERSEID,
	id
})

export const showInfoAffirm = (bool) => ({
	type: ActionTypes.SHOW_INFO_AFFIRM,
	bool
})







//
