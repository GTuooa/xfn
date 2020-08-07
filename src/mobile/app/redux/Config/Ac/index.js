import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
// import { history } from 'app/containers/router'

const acconfigState = fromJS({
	selectedAcAll: false,
	showedLowerAcIdList: [],
	allAcModifyButtonDisplay: false,
	allAcCheckBoxDisplay: false,
	toolBarDisplayIndex: 1,
	tabSelectedIndex: 0,
	acConfigMode: '',
	fromfirts: false,
	showReverseModal: false,
	reverseSeved: false,
	// NewAcReverseId: '',
	// NewAcReverseName: '',
	// reverseAc: {
	// 	"acid": "",
	// 	"categoryList": [],
	// 	"acCount": 1,
	// 	"openingbalance": 1
	// },
	ac: {
		oldacid: '',
		acid: '',
		acname: '',
		category: '',
		upperinfo: '无',
		upperid: '',
		direction: 'debit',
		asscategorylist: [],
		upperAcunit: '0',	//是否有子级科目开启数量核算
		acunitOpen: '0',	//是否开启数量核算
		acunit: '',		//计算单位
		conversion:'1'	//换算关系
	},
	//反悔模式
	showInfoAffirmStatus: false,
	reverseTitleName: ['修改科目等级', '修改科目编码'],
	type: 'class',     //class, id
	reverseTitleIndex: 0,
	selectAcId: '', //选中的科目
	isSelect: false,  //是否选中的科目
	reverseAc: {
		"acid": "",
		"acname": "",
		"categoryList": [],
		"acCount": 0,
		"openingbalance": 0,
		"category": '',
		"direction": '',
		"upAcName": '',
		upperId: '',
		acunitOpen: '',
		cardNum: '',
		hasChildren: '0'
	},
	NewAcReverseId: '',
	NewAcReverseName: '',
	idNewAcReverseId: '',
	canChangeClassId: '',
	// canChangeClassId: ''
})

/**
 *
 * @param  {Immutable} [state=acconfigState] [description]
 * @param  {object} action                [description]
 * @return {[type]}                       [description]
 */
export default function handleAcConfig(state = acconfigState, action) {
	return ({
		[ActionTypes.INIT_ACCONFIG]					: () => acconfigState,
		[ActionTypes.CANCEL_ENTER_AC_FETCH]			: () =>  {
			action.history.goBack()
			return state
		},
		[ActionTypes.TOGGLE_LOWER_AC]				: () => {
			const showedLowerAcIdList = state.get('showedLowerAcIdList')

			if (showedLowerAcIdList.indexOf(action.acid) > -1)
				return state.update('showedLowerAcIdList', v => v.map(w => w.indexOf(action.acid) > -1 ? '' : w).filter(w => !!w))
			else
				return state.update('showedLowerAcIdList', v => v.push(action.acid))
		},
		[ActionTypes.BEFORE_MODIFY_AC]				: () => {
			setTimeout(() => action.history.push('/config/option/ac'), 0)

			const uppername = action.uppername

			return state.set('ac', action.ac)
						.setIn(['ac', 'oldacid'], action.ac.get('acid'))
						.set('acSelectedIndex', action.idx)//设置当前选择的科目
						.set('acConfigMode', 'modify')	//设置模式更改为modify
						.setIn(['ac', 'conversion'], '1')
						.setIn(['ac', 'oldAcunit'], action.ac.get('acunit'))
						.setIn(['ac', 'upperinfo'], uppername ? action.ac.get('upperid') + ' ' + uppername : '无')
		},
		[ActionTypes.BEFORE_INSERT_AC]				: () => {
			setTimeout(() => action.history.push('/config/option/ac'), 0)
			const uppername = action.uppername

			let newAc
			if (action.ac) {
				let acid = action.ac.get('acid')
				let currAcid = acid + '01'
				action.currTabAcList.forEach(v => {
					if (v.get('acid') === currAcid) {
						currAcid = (Number(currAcid) + 1).toString()
					}
				})
				newAc = action.ac.set('acid', currAcid).set('upperid', acid).set('acname', '').set('upperinfo', acid + ' ' + action.ac.get('acname'))
			} else {
				newAc = acconfigState.get('ac')
			}

			return state.set('ac', newAc)
						.set('acConfigMode', 'insert')
						.set('fromfirts', action.first === 'first' ? true : false)	//设置模式更改为modify
		},
		[ActionTypes.CHANGE_ACID]					: () => {
			if (!/^\d*$/.test(action.acid))
				return state

			let len = action.acid.length

			if (len > 4 && len % 2 === 0) {
				const upperid = action.acid.substr(0, len - 2)
				const upperAc = action.aclistSeq.find(v => v.get('acid') == upperid)
				state = state.update('ac', v =>
					v.set('upperid', upperAc ? upperid : '')
					.set('upperinfo', upperAc ? upperAc.get('acid') + ' ' + upperAc.get('acname') : '无')
					.set('category', upperAc ? upperAc.get('category') : '')
					.set('direction', upperAc ? upperAc.get('direction') : 'debit')
				)
			} else if (len <= 4) {
				state = state.update('ac', v => v.set('upperid', ''))
			}
			// else if (action.acid === '') {
			// 	state = state.update('ac', v => v.set('category', ''))
			// }

			return state.update('ac', v => v.set('acid', action.acid))
		},
		[ActionTypes.CHANGE_TAB_INDEX_ACCONFIG]		: () => state.set('tabSelectedIndex', action.idx),
		[ActionTypes.SHOW_ALL_AC_MODIFY_BUTTON]		: () => state.set('toolBarDisplayIndex', 3).set('allAcModifyButtonDisplay', true),
		[ActionTypes.HIDE_ALL_AC_MODIFY_BUTTON]		: () => state.set('toolBarDisplayIndex', 1).set('allAcModifyButtonDisplay', false),
		[ActionTypes.SHOW_ALL_AC_CHECKBOX]			: () => state.set('toolBarDisplayIndex', 2).set('allAcCheckBoxDisplay', true),
		[ActionTypes.HIDE_ALL_AC_CHECKBOX]			: () => state.set('toolBarDisplayIndex', 1).set('allAcCheckBoxDisplay', false),
		[ActionTypes.CHANGE_ACNAME]					: () => {
			// if (action.acname.length <= 20) {
				state = state.setIn(['ac', 'acname'], action.acname)
			// }
			return state
		},
		[ActionTypes.CHANGE_CATEGORY]				: () => state.setIn(['ac', 'category'], action.category),
		[ActionTypes.CHANGE_DIRECTION]				: () => state.updateIn(['ac', 'direction'], v => v === 'debit' ? 'credit' : 'debit'),
		[ActionTypes.CREATE_NEW_AC_ID]				: () => {
			const id = action.id
			const upperid = action.upperid

			var re = eval("/^[0-9]*$/g")
			if (re.test(id) && id.length < 3) {

				state = state.set('NewAcReverseId', id)
			}
			return state
		},
		// [ActionTypes.GET_REPORT_REVERSE_AC]			: () => state.set('reverseAc', fromJS(action.receivedData)).set('NewAcReverseId', '01').set('NewAcReverseName', ''),
		[ActionTypes.CHANGE_AC_SHOW_REVERSE_MODAL]	: () => state.set('showReverseModal', action.bool),
		[ActionTypes.CHANGE_AC_REVERSESEVED] 		: () => state.set('reverseSeved', action.bool),
		[ActionTypes.CHANGE_AC_AMOUNT_TEXT]			: ()=> {

			if (state.getIn(['ac', 'acunitOpen']) == '0') {
				state = state.setIn(['ac', 'acunitOpen'], '1')
			} else {
				//修改的话不能清空acunit
				state = state.setIn(['ac', 'acunitOpen'], '0')
				if (action.acConfigMode == 'insert' || action.prevAcunit== '') { //新增的话需要在关闭时清空acunit
					state=state.setIn(['ac', 'acunit'], '')
				}
			}
			return state.setIn(['ac', 'upperAcunit'], '').setIn(['ac', 'conversion'], '1')
		},
		[ActionTypes.CHANGE_AC_ACCONFIG_ACUNIT]		: () => state.setIn(['ac', 'acunit'], action.acunit),
		[ActionTypes.CHANGE_UNIT_TEXT]				: () => {
			console.log(action.unit)
			return state.setIn(['ac', 'acunit'], action.unit).setIn(['ac', 'conversion'], action.conversion ? action.conversion : '1')
		},
		//反悔模式
		[ActionTypes.CHANGE_REVERSE_TIT] 	: () => state.set('reverseTitleIndex', action.idx)
												.set('type', action.idx === 0 ? 'class' : 'id')
												.set('reverseAc', acconfigState.get('reverseAc'))
												.set('isSelect', false)
												.set('NewAcReverseId', '')
												.set('NewAcReverseName', '')
												.set('idNewAcReverseId', ''),
		[ActionTypes.CANCEL_REVERSE] 		: () => {
			state = state.set('reverseAc', acconfigState.get('reverseAc'))
					.set('isSelect', false)
					.set('NewAcReverseId', '')
					.set('NewAcReverseName', '')
					.set('canChangeClassId', '')
					// 	.set('selectBtnIndex', '0')

			action.history.goBack()
			return state
		},
		[ActionTypes.SELECT_AC_REVERSE]		: () => state.set('selectAcId', action.acId),
		[ActionTypes.GET_REPORT_REVERSE_AC]		: () => {
			state = state.set('reverseAc', fromJS(action.receivedData))
					.set('NewAcReverseId', '01')
					.set('NewAcReverseName', '')
					.set('idNewAcReverseId', '')
					.set('canChangeClassId', '')
			action.history.goBack()
			return state
		},
		[ActionTypes.CREATE_NEW_AC_NAME]			: () => state.set('NewAcReverseName', action.acname),
		[ActionTypes.IS_CLEAR_AC_REVERSE_INFO]	: () => {
			if (!action.bool) {
				state = state.set('reverseAc', acconfigState.get('reverseAc'))
						.set('isSelect', false)
						.set('NewAcReverseId', '')
						.set('NewAcReverseName', '')
						.set('idNewAcReverseId', '')
						.set('canChangeClassId', '')
			}
			return state.set('isSelect', action.bool)
		},
		[ActionTypes.CHANGE_ID_NEWACREVERSEID]					: () => state.set('idNewAcReverseId', action.id).set('canChangeClassId', ''),
		[ActionTypes.CHANGE_CANCHANGECLASSID]					: () => state.set('canChangeClassId', action.canChangeClassId),
		[ActionTypes.SHOW_INFO_AFFIRM]							: () => state.set('showInfoAffirmStatus', action.bool)



	}[action.type] || (() => state))()
}
