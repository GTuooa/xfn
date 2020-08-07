import Immutable, { fromJS } from 'immutable'
import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

const cxpzState = fromJS({
	allCheckboxDisplay: false,
	toolBarDisplayIndex: 1,
    lastvoucherid: '',
    issuedate: '',
	currentPage: '1',
	pageCount: '1',
	searchContentType: 'PROPERTY_ZONGHE',
	condition: '',
	modifyvc: false,
	vclist: [
		/*{
		selected: false,
		year: '',
		month: '',
		vcindex: '',
		vcdate: '',
		closedby: '',
		reviewedby: '',
		jvlist: [{
			jvindex: '',
			jvabstract: '',
			acid: '',
			acname: '',
			amount: '',
			direction: '',
			asslist: [{
				assid: '',
				assname: '',
				asscategory: ''
			}]
		}]
	}*/]
})

export default function handleCxpz(state = cxpzState, action) {

	return ({
		[ActionTypes.INIT_CXPZ]							: () => cxpzState,
		[ActionTypes.GET_VC_LIST_FETCH]                 : () => {
			const vclistLength = action.receivedData.data.length
			const pageCount = Math.ceil(vclistLength/20)
			return state.set('issuedate', action.issuedate).update('vclist', v => v.clear().merge(fromJS(action.receivedData.data))).set('currentPage', pageCount).set('pageCount', pageCount)
		},
		[ActionTypes.DELETE_VC_FETCH]                   : () => state.update('vclist', v => v.filter(v => !v.get('selected'))),
		// [ActionTypes.SORT_AND_CHANGE_VC_ID]             : () => state.update('vclist', v => v.sort((a, b) => parseInt(a.get('vcindex')) < parseInt(b.get('vcindex')) ? 0 : 1).map((v, i) => v.set('vcindex', i.toString()))),
		[ActionTypes.CHANGE_ALL_VC_CHECKBOX_DISPLAY]    : () => state.set('toolBarDisplayIndex', 2).set('allCheckboxDisplay', true),
		[ActionTypes.CANCEL_CHANGE_VC_CHECKBOX_DISPALY] : () => state.set('toolBarDisplayIndex', 1).update('vclist',v => v.map(w => w.set('selected', false))).set('allCheckboxDisplay', false),
		[ActionTypes.SELECT_VC_ALL]                     : () => {

			if (state.get('vclist').every(v => v.get('selected'))) {
				return state.update('vclist', v => v.map(w => w.set('selected', false)))
			} else {
				return state.update('vclist',v => v.map(w => w.set('selected', true)))
			}
		},
		[ActionTypes.SELECT_VC]                         : () => state.updateIn(['vclist', action.idx, 'selected'], v => v ? false : true),
		[ActionTypes.REVERSE_VC_LIST]					: () => state.update('vclist', v => v.reverse()),
		[ActionTypes.AFTER_PAGING_VC]					: () => {
			// if ((action.issuedate) === state.get('issuedate')) {
			if (action.currentPage !== 0) {
				state = state.update('vclist', v => state.get('vclist').concat(fromJS(action.receivedData.data.vcList)))
																			.set('currentPage', action.receivedData.data.currentPage)
																			.set('pageCount', action.receivedData.data.pageCount)
																			// .set('issuedate', action.issuedate)
			} else {
				state = state.update('vclist', v => v.clear().merge(fromJS(action.receivedData.data.vcList)))
							.set('currentPage', action.receivedData.data.currentPage)
							.set('pageCount', action.receivedData.data.pageCount)
							.set('issuedate', action.issuedate)
			}
			return state
		},
		[ActionTypes.CXPZ_CHANGE_DATA]                  : () => {
			return state.set(action.dataType, action.value)
		}
	}[action.type] || (() => state))()
}


/*
.update('selectedVcArray', v => v.setSize(state.get('vclist').size).map((v, i) => i))
*/
