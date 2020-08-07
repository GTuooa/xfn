import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

const configState = fromJS({
	selectAcAll: false,
	acStatus: [],
	tabSelectedIndex: '资产',
	modalDisplay: false,
	qcModalDisplay: false,
	acshowMessageMask: false,
	aciframeload: false,
	acConfigMode: '',
	tempAcItem: {
		limitLength: 0,
		nextac: false,
		oldacid: '',
		acid: '',
		acname: '',
		category: '',
		upperinfo: '无',
		upperid: '',
		direction: 'debit',
		asscategorylist: [],
		upperAcunit:'0',//是否有子级科目开启数量核算
		acunitOpen:'0',//是否开启数量核算
		acunit:'',//计算单位
		conversion:'1'//换算关系

	},
	amountState:false,//是否开启数量核算
	acimportresponlist : {
		'failJsonList': [],
		'successJsonList': []
	},
	acmessage: '',
	acChildShow: [],

	reverseconfirmModalshow: false,
	reverseModifiModalshow: false,
	reverseAcselectModalshow: false,
	reverseModifiable: false,
	canChangeClassId: '',
	NewAcReverseId: '',
	idNewAcReverseId: '',
	NewAcReverseName: '',
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
	importProgressInfo:{
		accessToken :'',
		total:0,
		progress:0,
		message:'',
		successList:[],
		failList:[],
		timestamp:'',
	}
})

export default function handleConfig(state = configState, action) {
	return ({
		// [ActionTypes.INIT_CONFIG]								 : () => configState,
		[ActionTypes.INIT_AC_CONFIG]							 : () => configState,
		[ActionTypes.CANCEL_ENTER_AC_ITEM_FETCH]    			 : () => state,
		[ActionTypes.CHANGE_TAB_PANE]							 : () => state.set('tabSelectedIndex', action.category).set('selectAcAll', false).update('acStatus', v => fromJS(action.aclist.map(w => false))),
		[ActionTypes.CHANGE_ACNAME_TEXT]                     	 : () => state.setIn(['tempAcItem', 'acname'], action.acname),
		[ActionTypes.CHANGE_CATEGORY_TEXT]                 		 : () => state.setIn(['tempAcItem', 'category'], action.category),
		[ActionTypes.CHANGE_MODAL_DISPLAY]						 : () => state.update('modalDisplay', v => !v),
		[ActionTypes.INIT_CONFIG]								 : () => state.update('acStatus', v => fromJS(action.aclist.map(w => false))),
		[ActionTypes.SELECT_AC_ALL]                          	 : () => state.update('acStatus', v => v.map(w => !state.get('selectAcAll'))).update('selectAcAll', v => !v),
		[ActionTypes.CHANGE_DIRECTION_TEXT]                  	 : () => state.updateIn(['tempAcItem', 'direction'], v => v === 'credit' ? 'debit' : 'credit'),
		[ActionTypes.CHANGE_AMOUNT_TEXT]                  	 : () => {
			if(state.getIn(['tempAcItem', 'acunitOpen'])=='0'){
				state=state.setIn(['tempAcItem', 'acunitOpen'], '1')
			}else{
				//修改的话不能清空acunit
				state=state.setIn(['tempAcItem', 'acunitOpen'], '0')
				if(action.acConfigMode == 'insert'){//新增的话需要在关闭时清空acunit
					state=state.setIn(['tempAcItem', 'acunit'], '')
				}
				//.setIn(['tempAcItem', 'acunit'], '')
			}
			return state;
		},
		[ActionTypes.CHANGE_UNIT_TEXT]                  	     : () => state.setIn(['tempAcItem', 'acunit'], action.unit).setIn(['tempAcItem', 'conversion'], action.conversion ? action.conversion : '1'),
		[ActionTypes.CHANGE_ACCONFIG_ACUNIT] 				     : () => state.setIn(['tempAcItem', 'acunit'], action.acunit),
		[ActionTypes.GET_PRIMARY_ACUNIT]                 		 : () => state.updateIn(['tempAcItem', 'acunit'], action.receivedData),//重新开启数量核算时获取acunit
		[ActionTypes.CHANGE_ACID_TEXT]							 : () => {
			const len = action.acid.length
			const limit = state.getIn(['tempAcItem', 'limitLength'])
			const maxLength = limit || 10
			const minLength = limit == 4 ? 1 : limit - 2

			if (!/^\d*$/.test(action.acid) || (!len && limit) || len == 11)
				return state

			if (limit) {
				return len > maxLength || len < minLength ? state : state.setIn(['tempAcItem', 'acid'], action.acid)
			} else {
				if (len > 4 && len % 2 === 0) {
					const upperid = action.acid.substr(0, len - 2)
					const upperAcItem = action.aclist.find(v => v.get('acid') == upperid)

					state = state.update('tempAcItem', v =>
						v.set('upperid', upperAcItem ? upperAcItem.get('acid') : '')
						.set('upperinfo', upperAcItem ? upperAcItem.get('acid') + ' ' + upperAcItem.get('acname') : '无')
						.set('category', upperAcItem ? upperAcItem.get('category') : '')
						.update('direction', w => upperAcItem ? upperAcItem.get('direction') : w)
					)
				} else if (len <= 4) {
					state = state.update('tempAcItem', v => v.set('upperid', '').set('upperinfo', '无').set('category', ''))
				}
				return state.setIn(['tempAcItem', 'acid'], action.acid)
			}
		},
		[ActionTypes.MODIFY_AC_ITEM]							 : () => state.set('acConfigMode', 'modify')
			.set('tempAcItem', fromJS(action.AcItem))
			.setIn(['tempAcItem', 'limitLength'], action.AcItem.get('acid').length)
			.setIn(['tempAcItem', 'oldacid'], action.AcItem.get('acid'))
			.setIn(['tempAcItem', 'oldAcunit'], action.AcItem.get('acunit'))
			.setIn(['tempAcItem', 'upperinfo'], action.AcItem.get('upperinfo') || '无')
			.setIn(['tempAcItem', 'conversion'], '1'),
		[ActionTypes.INSERT_AC_ITEM]							 : () => {
			state = state.set('acConfigMode', 'insert')
			//console.log(action.AcItem.toJS())
			return action.AcItem ? state.update('tempAcItem', v => v.clear().merge(action.AcItem)
				.set('limitLength', action.AcItem.get('acid').length + 2)
				.set('acid', action.acid + '')
				.set('upperid', action.AcItem.get('acid'))
				.set('upperinfo', action.AcItem.get('acid') ? `${action.AcItem.get('acid')} ${action.AcItem.get('acname')}` : '无')
				.set('acname', '')
				.set('upperAcunit', '0')
				.set('acunitOpen', action.AcItem.get('acunitOpen'))
				.set('acunit', action.AcItem.get('acunit'))
				.set('conversion', '1'))
				.set('modalDisplay', true)
				: state.set('tempAcItem', configState.get('tempAcItem'))
		},
		[ActionTypes.AFTER_ENTER_AC_ITEM_FETCH]					 : () => action.nextacid ? state.update('tempAcItem', v => v.set('acid', action.nextacid).set('acname', '')) : state.set('modalDisplay', false),
		[ActionTypes.SELECT_AC_ITEM]                        	 : () => {
			state = state.updateIn(['acStatus', action.idx], v => !v)
			return state.set('selectAcAll', state.get('acStatus').every(v => v))
		},
		[ActionTypes.BEFORE_AC_IMPORT]						     : () => {
			state = state.set('acshowMessageMask', true)
						 .setIn(['importProgressInfo','progress'], 0)
						 .setIn(['importProgressInfo','message'], '')
						 .setIn(['importProgressInfo','successList'], fromJS([]))
						 .setIn(['importProgressInfo','failList'], fromJS([]))
			return state
		},
		[ActionTypes.CLOSE_AC_IMPORT_CONTENT]				     : () => state.set('acshowMessageMask', false).set('aciframeload', false).set('acimportresponlist', configState.get('acimportresponlist')).set('acmessage', ''),
		[ActionTypes.CHANGE_AC_MESSAGEMASK]				     : () => state.set('acshowMessageMask', false),
		[ActionTypes.AFTER_AC_IMPORT]						     : () => {
			state = !action.receivedData.code ?
				state.set('acimportresponlist', fromJS(action.receivedData.data)).set('aciframeload', true).set('acmessage', fromJS(action.receivedData.message)) :
				state.set('aciframeload', true).set('acmessage', fromJS(action.receivedData.message))

			state = state.setIn(['importProgressInfo','accessToken'],action.receivedData.data.accessToken)
					state.setIn(['importProgressInfo','total'],action.receivedData.data.total)
			return state
		},
		[ActionTypes.CHANGE_AC_CHILDSHOW]					     : () => {
			const acChildShow = state.get('acChildShow')
			if (acChildShow.indexOf(action.acid) === -1) {
				const newAcChildShow = acChildShow.push(action.acid)
				return state.set('acChildShow', newAcChildShow)
			} else {
				const newAcChildShow = acChildShow.splice(acChildShow.findIndex(v => v === action.acid), 1)
				return state.set('acChildShow', newAcChildShow)
			}
		},
		[ActionTypes.CLEAR_AC_CHILDSHOW]					     : () => state.set('acChildShow', fromJS([])),

		// 反悔模式

		[ActionTypes.SWITCH_REVERSE_CONFIRM_MODAL_SHOW]          : () => state.update('reverseconfirmModalshow', v => !v),
		[ActionTypes.SWITCH_REVERSE_MODIFI_MODAL_SHOW]           : () => state.update('reverseModifiModalshow', v => !v),
		[ActionTypes.SWITCH_REVERSE_AC_SELECT_MODAL_SHOW]        : () => state.update('reverseAcselectModalshow', v => !v),
		[ActionTypes.CREATE_NEW_AC_ID]				: () => {
			const id = action.id
			const upperid = action.upperid

			var re = eval("/^[0-9]*$/g")
			if (re.test(id) && id.length < 3) {
				state = state.set('NewAcReverseId', id)
			}
			return state
		},
		[ActionTypes.CHANGE_ID_NEWACREVERSEID]					 : () => state.set('idNewAcReverseId', action.id).set('canChangeClassId', ''),
		[ActionTypes.CHANGE_CANCHANGECLASSID]					 : () => state.set('canChangeClassId', action.canChangeClassId),
		[ActionTypes.GET_REPORT_REVERSE_AC]			             : () => state.set('reverseAc', fromJS(action.receivedData)).set('NewAcReverseId', '01').set('NewAcReverseName', '').set('idNewAcReverseId', ''),
		[ActionTypes.CREATE_NEW_AC_NAME]			             : () => state.set('NewAcReverseName', action.acname),
		[ActionTypes.CHANGE_AC_REVERSE_MODIFIABLE]	             : () => {

			if (!action.bool)
				state = state.set('reverseAc', configState.get('reverseAc')).set('NewAcReverseId', '').set('canChangeClassId', '').set('NewAcReverseName', '').set('idNewAcReverseId', '')

			return state.set('reverseModifiable', action.bool)
		},
		[ActionTypes.GET_IMPORT_PROGRESS]	             : () => {
			state = state.setIn(['importProgressInfo','message'],action.receivedData.message)
						 .setIn(['importProgressInfo','progress'],action.receivedData.data.progress)
						 .setIn(['importProgressInfo','successList'],fromJS(action.receivedData.data.successList))
						 .setIn(['importProgressInfo','failList'],fromJS(action.receivedData.data.failList))
						 .setIn(['importProgressInfo','timestamp'],fromJS(action.receivedData.data.timestamp))
			return state
		}
	}[action.type] || (() => state))()
}
