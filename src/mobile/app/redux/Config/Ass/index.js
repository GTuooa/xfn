import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const assconfigState = fromJS({
	toolBarDisplayIndex: 1,
	tabSelectedIndex: 0,
	assTabSelectedIndex: 0,
	allAssCheckBoxDisplay: false,
	assConfigMode: 'insert',
	modifyIdx: -1,
	ass: {
		assid: '',
		assname: '',
		asscategory: ''
	},
	// amb
	ambCount: '1',
	amAassCategoryList: [],
	//反悔
	showReversModal: false,
	assMessage: [],
	reversAss: {
		assCategory: '',
		oldAssId: '',
		assName: '',
		assId: ''
	},
	ifAssConfig:true,
	oldName:'',
	newName:'',
	showAssTypeChangeConfirmModal:false
})

export default function handleAssConfig(state = assconfigState, action) {
	return ({
		[ActionTypes.INIT_ASSCONFIG]				: () => assconfigState,
		[ActionTypes.CHANGE_TAB_INDEX_ASSCONFIG]	: () => state.set('tabSelectedIndex', action.idx),
		[ActionTypes.CHANGE_TAB_INDEX_AC_ASSCONFIG]	: () => state.set('assTabSelectedIndex', action.idx),
		[ActionTypes.CHANGE_ASS_ID]					: () => /^[A-Za-z0-9]*$/g.test(action.assid) ? state.setIn(['ass', 'assid'], action.assid) : state,

		[ActionTypes.CHANGE_ASS_NAME]				: () => state.setIn(['ass', 'assname'], action.assname),
		[ActionTypes.CHANGE_ASS_CATEGORY]			: () => state.setIn(['ass', 'asscategory'], action.asscategory),
		[ActionTypes.BEFORE_MODIFY_ASS]				: () => state.set('assConfigMode', 'modify')
																	.set('ass', action.ass)
																	.setIn(['ass', 'oldassid'], action.ass.get('assid'))
																	.setIn(['ass', 'disable'], action.ass.get('disableTime') ? 'TRUE' : 'FALSE')
																	.set('modifyIdx', action.idx),
		[ActionTypes.BEFORE_INSERT_ASS]				: () => state.set('assConfigMode', 'insert').set('ass', assconfigState.get('ass')).setIn(['ass', 'asscategory'], action.tab),
		[ActionTypes.MODIFY_ASS_FETCH]  			: () => state.set('FzModelDisplay', false),
		[ActionTypes.INSERT_ASS_FETCH]				: () => state.set('activeAssCategory', state.getIn(['ass', 'asscategory'])).set('ass', assconfigState.get('ass')),
		[ActionTypes.SHOW_ALL_ASS_CHECKBOX]			: () => state.set('toolBarDisplayIndex', 2).set('allAssCheckBoxDisplay', true),
		[ActionTypes.HIDE_ALL_ASS_CHECKBOX]			: () => state.set('toolBarDisplayIndex', 1).set('allAssCheckBoxDisplay', false),

		// amb
		[ActionTypes.AFTER_ASSGETAMB_GET]			: () => state.set('amAassCategoryList', fromJS(action.receivedData.assCategroyList)).set('ambCount', action.receivedData.count),
		[ActionTypes.SET_ASSRELATE_AMB]				: () => state.set('amAassCategoryList', fromJS([action.asscategory])),
		//启用、禁用
		[ActionTypes.CHANGE_ASS_DISABLE_STATE]		: () => state.updateIn(['ass', 'disable'], v => v === 'TRUE' ? 'FALSE' : 'TRUE' ),

		//反悔
		[ActionTypes.CHANGE_REVERS_ASS_CATEGORY]	: () => state.set('reversAss', assconfigState.get('reversAss')).setIn(['reversAss', 'assCategory'], action.assCategory),
		[ActionTypes.CHECK_REVERS_ASS_ID_CHECK]		: () => state.setIn(['reversAss', 'oldAssId'], action.assId).setIn(['reversAss', 'assName'], action.assName).setIn(['reversAss', 'assId'], '').set('assMessage', action.assMessage),
		[ActionTypes.CHANGE_REVERS_NEW_ASS_ID]		: () => state.setIn(['reversAss', 'assId'], action.newAssId),
		[ActionTypes.SHOW_REVERS_CONFIR_MODAL]		: () => state.set('showReversModal', action.bool),
		[ActionTypes.CHANGE_ASS_CONFIG_SHOW_TYPE]   :() => state.update('ifAssConfig', v => !v),
		[ActionTypes.SET_ASS_CONFIG_OLD_NAME]        :()=>{
			return state.set('oldName',action.value)
		},
		[ActionTypes.SET_ASS_CONFIG_NEW_NAME]        :()=>{
			return state.set('newName',action.value)
		},
		[ActionTypes.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE]:()=>state.set('showAssTypeChangeConfirmModal',action.visible)
	}[action.type] || (() => state))()
}
