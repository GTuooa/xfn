import * as ActionTypes from './ActionTypes'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage, showError } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import * as assAllActions from 'app/redux/Home/All/asslist.actions'
import * as Limit from 'app/constants/Limit.js'

//获取科目列表
export const getAcListFetch = () => dispatch => {
	fetchApi('getaclist', 'GET', '', json =>
		showMessage(json) &&
		dispatch({
			type: ActionTypes.GET_AC_LIST_FETCH,
			receivedData: json.data
		})
	)
}

export const getAcListandAsslistFetch = () => dispatch => {
	fetchApi('getaclist', 'GET', '', json => {
		showMessage(json) &&
		dispatch({
			type: ActionTypes.GET_AC_LIST_FETCH,
			receivedData: json.data
		})
		dispatch(assAllActions.getAssListFetch())
	})
}


//确认编辑
export const enterAcFetch = (fromfirts, history) => (dispatch, getState) => {
	const state = getState().acconfigState

	let ac = state.get('ac')

	const acid = ac.get('acid')

	//当编辑后科目编码、名称、类别、方向或与编辑前编码相等时return

	if (state.get('acConfigMode') === 'insert' && fromfirts && acid.length !== 4 )
		return showMessage('', '', '', '一级科目仅允许4位编码，且必须为1/2/3/4/5开头')
	if (state.get('acConfigMode') === 'insert' && !fromfirts && acid.length === 5 || acid.length === 7 || acid.length === 9)
		return showMessage('', '', '', '子级科目长度仅限6/8/10位数字')
	if (state.get('acConfigMode') === 'modify' && acid.length === 5 || acid.length === 7 || acid.length === 9) {
		return showMessage('', '', '', '子级科目长度仅限6/8/10位数字')
	}
	if (acid.substr(-2) === '00')
		return showMessage('', '', '', '科目编码不能以00结束，该编码为系统预留')
	if (!acid)
		return showMessage('', '', '', '科目编码未输入')
	if (!ac.get('acname'))
		return showMessage('', '', '', '科目名称未输入')
	if (!ac.get('category'))
		return showMessage('', '', '', '科目类别未输入')
	if (!ac.get('direction'))
		return showMessage('', '', '', '科目方向未输入')
	if (acid.length !== 4 && !ac.get('upperid'))
		return showMessage('', '', '', '上级科目不存在，不允许添加子科目')

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

	;({
		//确认修改
		modify() {
			const acSelectedIndex = state.get('acSelectedIndex')
			// 为了后端校验
			const asscategorylist = ac.get('asscategorylist')
			ac = ac.delete('asscategorylist')
			fetchApi('modifyac', 'POST', JSON.stringify(ac), json => {
				if (showMessage(json, 'show')) {
					ac = ac.set('asscategorylist', asscategorylist)
					dispatch(modifyAc(json, ac, acSelectedIndex))
					history.goBack()
				}
			})
		},
		//确认新增
		insert() {
			fetchApi('insertac', 'POST', JSON.stringify(ac.merge({
				action: 'MANAGER-AC_SETTING-CUD_AC_SETTING'
			})), json => {
				if (showMessage(json, 'show')) {
					dispatch(insertAc(json, ac))
					history.goBack()
				}
			})
		}
	}[state.get('acConfigMode')])() //编辑模式
}

const modifyAc = (receivedData, ac, idx) => ({
	type: ActionTypes.MODIFY_AC,
	receivedData,
	ac,
	idx
})

const insertAc = (receivedData, ac) => ({
	type: ActionTypes.INSERT_AC,
	receivedData,
	ac
})

export const deleteAcFetch = () => (dispatch, getState) => {
	thirdParty.Confirm({
		message: "确定删除？",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {
			const acidlist = getState().allState.get('aclist').filter(v => v.get('selected')).map(v => v.get('acid'))
			if (result.buttonIndex === 1) {

				thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
				fetchApi('deleteac', 'POST', JSON.stringify({acidlist}), json => {
					if (showMessage(json)) {
						thirdParty.toast.hide()
						const undeleteable = showError(json, 'acid')
						dispatch({
							type: ActionTypes.DELETE_AC_FETCH,
							receivedData: json,
							undeleteable
						})
						// if (undeleteable.length !== 0)
						// 	dispatch(unselectAcAll())
						dispatch(unselectAcAll())
						dispatch(acconfigActions.hideAllAcCheckBox())
					}
				})
			}
		},
		onFail : (err) => alert(err)
	})
}

export const selectAc = (idx) => ({
	type: ActionTypes.SELECT_AC,
	idx
})

export const selectAcChilrens  = (acid) => ({
	type : ActionTypes.SELECT_AC_CHILRENS,
	acid
})

export const selectAcAll = (tabSelectedSubTags) => ({
	type: ActionTypes.SELECT_AC_ALL,
	tabSelectedSubTags
})

export const unselectAcAll = () => ({
	type: ActionTypes.UNSELECT_AC_ALL
})


export const selectAcAllByAssCategory = (asscategory) => ({
	type: ActionTypes.SELECT_AC_BY_ASSCATEGORY,
	asscategory
})

// 外币关联科目
export const selectAcAllByCurrency = (list) => ({
	type: ActionTypes.SELECT_AC_BY_CURRENCY,
	list
})

export const selectAcCurrency = (idx) => ({
	type: ActionTypes.SELECT_AC_CURRENCY,
	idx
})
