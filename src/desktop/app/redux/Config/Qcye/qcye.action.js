import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { toJS } from 'immutable'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'

export const changeQcyeTabPane = (category) => ({
	type: ActionTypes.CHANGE_QCYE_TAB_PANE,
	category
})

export const getBaInitListFetch = (closedyear) => dispatch => {
	fetchApi('getbainitlist', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.AFTER_GET_BA_INIT_LIST,
				receivedData: json
			})
			dispatch(chengeQcyeIsModified(false))

			if (closedyear) {
				thirdParty.Alert('该账期已结账，反结账后即可修改期初值')
			}
		}
	})
}

export const changeAcBalanceAmount = (amount, idx) => ({
	type: ActionTypes.CHANGE_AC_BALANCE_AMOUNT,
	amount,
	idx
})

export const changeAcBalanceCount = (count, idx) => ({
	type: ActionTypes.CHANGE_AC_BALANCE_COUNT,
	count,
	idx
})

export const insertAcBalanceItem = (amount, acid, acname, acfullname, direction) => ({
	type: ActionTypes.INSERT_AC_BALANCE_ITEM,
	amount,
	acid,
	acname,
	acfullname,
	direction
})

export const insertAcBalanceItemCount = (count, acid, acname, acfullname, direction) => ({
	type: ActionTypes.INSERT_AC_BALANCE_ITEM_COUNT,
	count,
	acid,
	acname,
	acfullname,
	direction
})

export const setAcBalanceFetch = (acbalist) => dispatch => {
	const acba = acbalist.filter(v => v.get('amount') !== '' && v.get('acid'))

	fetchApi('getbainit', 'POST', JSON.stringify({
		balanceaclist: acba
	}), json => showMessage(json, 'show') && dispatch(getBaInitListFetch())
	)
}

export const beforeInsertAssAcBalanceItem = (asscategorylist, acid) => ({
	type: ActionTypes.BEFORE_INSERT_ASS_AC_BALANCE_ITEM,
	asscategorylist,
	acid
})

export const afterenterQcAssText = () => ({
	type: ActionTypes.AFTER_ENTER_QC_ASS_TEXT
})

export const changeQcAssText = (value, idx) => ({
	type: ActionTypes.CHANGE_QC_ASS_TEXT,
	value,
	idx
})

export const enterQcAssText = () => ({
	type: ActionTypes.ENTER_QC_ASS_TEXT
})

export const cancleEnterQcModal = () => ({
	type: ActionTypes.CENCLE_ENTER_QC_MODAL
})

export const deleteAcBalanceItem = (idx) => ({
	type: ActionTypes.DELETE_AC_BALANCE_ITEM,
	idx
})

export const getFileUploadFetch = (form,openModal) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('periodBaImport', 'UPLOAD', form, json => {
		if(showMessage(json)){
			dispatch(afterQcyeImport(json))
			openModal()
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			const loop = function (accessToken) {
				const time = setTimeout(() => {
					let showMessageMask = getState().qcyeState.getIn(['flags','qcshowMessageMask'])
					fetchApi('acImportProgress', 'GET', `accessToken=${accessToken}`, json => {
						if(showMessage(json)){
							dispatch({
								type:ActionTypes.GET_QCYE_IMPORT_PROGRESS,
								receivedData:json
							})
							if ((json.data.progress >= 100) && (json.data.successList.length > 0)) {
								dispatch(getBaInitListFetch())
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

export const beforeQcyeImport = () => ({
	type: ActionTypes.BEFORE_QCYE_IMPORT
})

export const afterQcyeImport = (receivedData) => dispatch => {
	dispatch({
		type: ActionTypes.AFTER_QCYE_IMPORT,
		receivedData
	})
}

export const closeQcyeImportContent = () => ({
	type: ActionTypes.CLOSE_QCYE_IMPORT_CONTENT
})

export const getTrailBalanceFetch = () => dispatch => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('gettrailbalance', 'GET', '', json => {
		if (showMessage(json)) {
			thirdParty.Alert(json.message)
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const chengeQcyeIsModified = (bool) => ({
	type: ActionTypes.CHENGE_QCYE_IS_MODIFIED,
	bool
})
export const showQcye = (value) => ({
	type: ActionTypes.SHOW_QCYE,
	value
})
export const changeMessageMask = () => ({
	type: ActionTypes.CHANGE_QCYE_MESSAGEMASK,
})
