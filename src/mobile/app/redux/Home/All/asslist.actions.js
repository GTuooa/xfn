import * as ActionTypes from './ActionTypes'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage, showError, DateLib, configCheck } from 'app/utils'
import { fromJS, toJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import * as Limit from 'app/constants/Limit.js'

export const getAssListFetch = () => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getacasslist', 'GET', '', json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_AC_ASS_LIST_FETCH,
				receivedData: json.data
			})
		}
	})
}

export const getAssListUnderFetch = () => dispatch => {
	fetchApi('getacasslist', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_AC_ASS_LIST_FETCH,
				receivedData: json.data
			})
		}
	})
}

export const modifyRelatedAclistFetch = (history) => (dispatch, getState) => {
	const { assconfigState, allState } = getState()
	// const tabSelectedIndex = assconfigState.get('tabSelectedIndex')
	// const assTags = allState.get('assTags')
	// const asscategory = assTags.get(tabSelectedIndex)
	const tabSelectedIndex = assconfigState.get('tabSelectedIndex')
	const assTags = allState.get('assTags')
	const asscategory = assTags.get(tabSelectedIndex)
	const acidlist = allState.get('aclist').toSeq().filter(v => v.get('selected')).map(v => v.get('acid'))
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('relateass', 'POST', JSON.stringify({
		asscategory,
		acidlist
	}), json => {
		if (showMessage(json, 'show')) {
			dispatch(getAssListFetch())
			showError(json)
			history.goBack()
		}
	})
}

export const deleteAssFetch = () => (dispatch, getState) => {
	thirdParty.Confirm({
		message: "确定删除？",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				const { assconfigState, allState } = getState()
				const tabSelectedIndex = assconfigState.get('tabSelectedIndex')
				const assTags = allState.get('assTags')
				const asscategory = assTags.get(tabSelectedIndex)
				const assidlist = allState
					.get('acasslist')
					.toSeq()
					.reduce((p, v) => p.concat(v.get('asslist')), fromJS([]))
					.filter(v => v.get('selected'))
					.map(v => v.get('assid'))
				thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
				fetchApi('deleteass', 'POST', JSON.stringify({
					asscategory,
					assidlist
				}), json => {
					if (showMessage(json)) {
						thirdParty.toast.hide()
						showError(json)
						dispatch(getAssListFetch())

						dispatch(assconfigActions.hideAllAssCheckBox())
					}
				})
			}
		},
		onFail : (err) => alert(err)
	})
}

export const enterAssFetch = (history) => (dispatch, getState) => {
	const state = getState().assconfigState
	const allState = getState().allState

	// const ass = state.get('ass')
	let ass = state.get('ass')
	ass =  ass.set('asscategory', ass.get('asscategory').replace(/(^\s*)|(\s*$)/g, ''))
			.set('assname', ass.get('assname').replace(/(^\s*)|(\s*$)/g, ''))

	//当编辑后科目编码、名称、类别、方向或与编辑前编码相等时return
	if (!ass.get('assid'))
		return showMessage('', '', '' ,'辅助核算编码未输入')

	if (!ass.get('asscategory'))
		return showMessage('', '', '' ,'辅助核算类别未输入')

	if (!ass.get('assname'))
		return showMessage('', '', '' ,'辅助核算名称未输入')

	if (ass.get('assid').length > Limit.CODE_LENGTH)
		return showMessage('', '', '' ,`辅助核算编码位数不超过${Limit.CODE_LENGTH}位`)

	if (configCheck.hasChiness(ass.get('assname'))) {
	    return showMessage('', '', '', `名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
	}


	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

	const newAssCategory = ass.get('asscategory')
	const acAssList = allState.get('acasslist').filter(v => v.get('asscategory') === newAssCategory)

	// 校验是否有有已存在的辅助核算项目
	if (acAssList.size) {  // 如果有长度，说明本来是存在这个类别的， 否则就是新增的，不需要校验

		const asslist = acAssList.getIn([0, 'asslist'])
		if (state.get('assConfigMode') === 'insert') {
			if (asslist.some(v => v.get('assname') === ass.get('assname'))) {
				dispatch(confirmInsertSameAss(ass, state, history))
			} else {
				dispatch(insertAssItem(ass, state, history))
			}
		} else if (state.get('assConfigMode') === 'modify') {
			const modifyIdx = state.get('modifyIdx')
			if (asslist.getIn([modifyIdx, 'assname']) !== ass.get('assname')) { // 改了名字的
				if (asslist.some((v, i) => v.get('assname') === ass.get('assname') && modifyIdx !== i)) {
					dispatch(confirmInsertSameAss(ass, state, history))
				} else {
					dispatch(insertAssItem(ass, state, history))
				}
			} else {
				dispatch(insertAssItem(ass, state, history))
			}
		}

	} else {
		dispatch(insertAssItem(ass, state, history))
	}
}

const confirmInsertSameAss = (ass, state, history) => dispatch => {
	thirdParty.Confirm({
		message: "已存在名称相同的核算对象，是否确定保存？",
		title: "提示",
		buttonLabels: ['取消', '保存'],
		onSuccess : (result) => {
			if (result.buttonIndex === 1) {
				dispatch(insertAssItem(ass, state, history))
			} else {
				return
			}
		}
	})
}

const insertAssItem = (ass, state, history) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	;({
		//确认修改
		modify() {
			const assSelectedIndex = state.get('assSelectedIndex')
			fetchApi('modifyass', 'POST', JSON.stringify(ass), json => {
				if (showMessage(json, 'show')) {
					dispatch(modifyAss(json, ass, assSelectedIndex))
					history.goBack()

					if (json.data && json.data.length) {  //禁用辅助核算时提示信息
						thirdParty.Alert(json.data[0])
					}
				}
			})
		},
		//确认新增
		insert() {
			fetchApi('insertass', 'POST', JSON.stringify(ass.merge({
				action: 'MANAGER-ASS_SETTING-CUD_ASS'
			})), json => {
				if (showMessage(json, 'show')) {
					dispatch(insertAss(json, ass))
					history.goBack()
				}
			})
		}
	}[state.get('assConfigMode')])() //编辑模式
}

export const modifyAss = (receivedData, ass, idx) => dispatch =>{
	dispatch({
		type: ActionTypes.MODIFY_ASS_FETCH,
		receivedData,
		ass,
		idx
	})
}

export const insertAss = (receivedData, ass) => ({
	type: ActionTypes.INSERT_ASS_FETCH,
	receivedData,
	ass
})

export const selectAss = (acAssSelectedIndex, idx) => ({
	type: ActionTypes.SELECT_ASS,
	acAssSelectedIndex,
	idx
})

export const selectAssAll = (acAssSelectedIndex) => ({
	type: ActionTypes.SELECT_ASS_ALL,
	acAssSelectedIndex
})

export const unselectAssAll = (acAssSelectedIndex) => ({
	type: ActionTypes.UNSELECT_ASS_ALL,
	acAssSelectedIndex
})
