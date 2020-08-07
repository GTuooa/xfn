import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const fzhsState = fromJS({
	FzModelDisplay: false,
	aclistModalDisplay: false,
	assshowMessageMask: false,
	assiframeload: false,
	ass: {
		assid: '',
		assname: '',
		asscategory: '',
		handleAss: 'insertass',
		disableTime: ''
	},
	categorySelectedKeys: {
		'资产': [],
		'负债': [],
		'权益': [],
		'成本': [],
		'损益': []
	},
	asslistSelectedStatus: {},
	activeAssCategory: '客户',
	relatedAclist: [],
	activeAcTabKey: '资产',
	assimportresponlist : {
		'failJsonList': [],
		'successJsonList': []
	},
	assmessage: '',
	// 开通amb的列表
	ambAssCategroyList: {
		assCategroyList: ["阿米巴"],
        count: 1
	},
	//反悔
	showReversModal: false,
	reversAssConfirmShow: false,
	assMessage: [],
	reversAss: {
		assCategory: '',
		oldAssId: '',
		assName: '',
		assId: '',
	},
	oldName:'',
	newName:'',
	//分页
	currentPage: 1,
	pageCount: 1,
	importProgressInfo:{
		accessToken :'',
		total:0,
		progress:0,
		message:'',
		successList:[],
		failList:[],
		timestamp:'',
	},
	assCategoryModalVisible:false
})

export default function handleFzhs(state = fzhsState, action) {
	return ({
		[ActionTypes.INIT_FZHS]						: () => fzhsState,
		[ActionTypes.CHANGE_ACTIVE_ASS_CATEGORY]	: () => {
			let pageCount = 1
			const asslistSelectedStatus = {}
			const categorySelectedKeys = {
				'资产': [],
				'负债': [],
				'权益': [],
				'成本': [],
				'损益': []
			}
			if (action.asslist) {
				const currentPageList = action.asslist.get('asslist').slice((state.get('currentPage')-1) * Limit.FZHE_CURRENT_PAGE_SIZE, state.get('currentPage') * Limit.FZHE_CURRENT_PAGE_SIZE)
				pageCount = Math.ceil(action.asslist.get('asslist').size/Limit.FZHE_CURRENT_PAGE_SIZE)

				// action.asslist.get('asslist').map(v => asslistSelectedStatus[v.get('assid')] = false)
				currentPageList.map(v => asslistSelectedStatus[v.get('assid')] = false)
				action.asslist.get('aclist').map(v =>
					categorySelectedKeys[
						({
							'1': '资产',
							'2': '负债',
							'3': '权益',
							'4': '成本'
						})[v.get('acid').substr(0, 1)] || '损益'
					].push(v)
				)
			}

			return state.set('activeAssCategory', action.category)
				.update('asslistSelectedStatus', v => v.clear().merge(asslistSelectedStatus))
				.set('selectAssAll', false)
				.update('relatedAclist', v => action.asslist ? action.asslist.get('aclist') : v.clear())
				.set('categorySelectedKeys', fromJS(categorySelectedKeys))
				.set('pageCount', pageCount)
				.set('currentPage', 1)


		},
		[ActionTypes.SAVE_ENTER_ASSITE_MFETCH]      : () => state.update('FzModelDisplay', v => !v),
		// 点击编辑按钮时，弹出model框，记录原有信息
		[ActionTypes.CHANGE_FZ_MODAL_DISPLAY]		: () => {

			state = state.update('FzModelDisplay', v => !v)
			return action.ass && state.get('FzModelDisplay') ? state.update('ass',
				v => v.merge(action.ass)
					.set('asscategory', state.get('activeAssCategory'))
					.set('oldassid', action.ass.get('assid'))
					.set('handleAss', 'modifyass')
					.set('disableTime', action.ass.get('disableTime'))
					.set('disable', action.ass.get('disableTime') ? 'TRUE' : 'FALSE')
				// ) : state.update('ass', v => v.clear().set('handleAss', 'insertass'))
				) : state.set('ass', fzhsState.get('ass').set('handleAss', 'insertass'))
		},
		[ActionTypes.CHANGE_ACLIST_MODAL_DISPLAY]	: () => {
			state = state.update('aclistModalDisplay', v => !v)
			return state.get('aclistModalDisplay') ? state.update('relatedAclist', v => action.aclist || v) : state
		},
		[ActionTypes.MODIFY_ACLIST_IN_ASS_ITEM]		: () => {
			state = state.setIn(['categorySelectedKeys', state.get('activeAcTabKey')], fromJS(action.aclist))
			return state.set('relatedAclist', state.get('categorySelectedKeys').reduce((prev, v) => prev.concat(v)))

		},
		[ActionTypes.DELETE_AC_IN_ASS_ITEM]			: () => state.update('relatedAclist', v => v.filter(w => w.get('acid') != action.acid)),
		[ActionTypes.CHANGE_AC_IN_ASS_TAB_KEY]		: () => state.set('activeAcTabKey', action.key),
		[ActionTypes.RELATED_ACLIST_MODEL_DISAPEAR] : () => state.set('aclistModalDisplay', false),
		[ActionTypes.CHANGE_ASS_ID]					: () => {
			if (/^[A-Za-z0-9]*$/g.test(action.assid)) {
				return state.setIn(['ass', 'assid'], action.assid)
			}
			return state
		},

		[ActionTypes.CHANGE_ASS_NAME]				: () => state.setIn(['ass', 'assname'], action.assname),
		[ActionTypes.CHANGE_ASS_CATEGORY]			: () => state.setIn(['ass', 'asscategory'], action.asscategory),
		[ActionTypes.SELECT_ASS_ALL]				: () => {
			const selectAssAll = !state.get('selectAssAll')
			return state.update('selectAssAll', v => !v).update('asslistSelectedStatus', v => v.map(w => selectAssAll))

		},
		[ActionTypes.SELECT_ASS_ITEM]				: () => {
			state = state.updateIn(['asslistSelectedStatus', action.assid], v => !v)
			return state.set('selectAssAll', state.get('asslistSelectedStatus').every(v => v))
		},
		// 编辑操作后，将弹出的medol隐藏
		[ActionTypes.MODIFY_ASS_ITEM_FETCH]  		: () => state.set('FzModelDisplay', false),
		// 新增操作后，设置当前显示的类别为新增的类别
		[ActionTypes.INSERT_ASS_ITEM_FETCH]			: () => state.set('activeAssCategory', state.getIn(['ass', 'asscategory']))
				.setIn(['ass', 'assid'], action.save === undefined ? action.receivedData.data.newAssId : fzhsState.getIn(['ass', 'assid']))
				.setIn(['ass', 'assname'], fzhsState.getIn(['ass', 'assname'])),
		[ActionTypes.BEFORE_ASS_IMPORT]				: () => {
			state = state.set('assshowMessageMask', true)
						 .setIn(['importProgressInfo','progress'], 0)
						 .setIn(['importProgressInfo','message'], '')
						 .setIn(['importProgressInfo','successList'], fromJS([]))
						 .setIn(['importProgressInfo','failList'], fromJS([]))
			return state
		},
		[ActionTypes.CLOSE_ASS_IMPORT_CONTENT]		: () => state.set('assshowMessageMask', false).set('assiframeload', false).set('assimportresponlist', fzhsState.get('assimportresponlist')).set('assmessage', ''),
		[ActionTypes.AFTER_ASS_IMPORT]				: () => {
			state = !action.receivedData.code ?
				state.set('assimportresponlist', fromJS(action.receivedData.data)).set('assiframeload', true).set('assmessage', fromJS(action.receivedData.message)) :
				state.set('assiframeload', true).set('assmessage', fromJS(action.receivedData.message))

			state = state.setIn(['importProgressInfo','accessToken'],action.receivedData.data.accessToken)
					state.setIn(['importProgressInfo','total'],action.receivedData.data.total)
			return state
		},
		[ActionTypes.AFTER_ASSGETAMB_GET]			: () => state.set('ambAssCategroyList', fromJS(action.receivedData)),
		[ActionTypes.CHANGE_AMB_RELATE_ASSCATEGROY_LIST]	: () => {
			return state.setIn(['ambAssCategroyList', 'assCategroyList'], fromJS([action.assCategory]))
		},
		[ActionTypes.CHANGE_ASS_DISABLE_STATE]			: () => {
			if (action.value == 'FALSE') {
				return state.setIn(['ass', 'disable'], 'FALSE')
			} else {
				return state.setIn(['ass', 'disable'], 'TRUE')
			}
		},
		//反悔模式
		[ActionTypes.CHANGE_REVERS_ASS_MODAL]			: () => state.set('showReversModal', action.bool),
		[ActionTypes.CHANGE_REVERS_CATEGORY]			: () => state.set('assMessage', fzhsState.get('assMessage')).set('reversAss', fzhsState.get('reversAss')).setIn(['reversAss', 'assCategory'], action.category),
		[ActionTypes.SELECT_REVERS_ASS_CHECK]			: () => state.setIn(['reversAss', 'oldAssId'], action.assId).setIn(['reversAss', 'assName'], action.assName).set('assMessage', action.assMessage),
		[ActionTypes.CHANGE_REVERS_ASS_ID]				: () => {
			if (/^[A-Za-z0-9]*$/g.test(action.newAssId)) {
				return state.setIn(['reversAss', 'assId'], action.newAssId)
			}
			return state
		},
		[ActionTypes.CHANGE_REVERSASS_CONFIRM_SHOW]		: () => state.set('reversAssConfirmShow', action.bool),
		[ActionTypes.CLEAR_REVERS_ASS]					: () => state.set('assMessage', fzhsState.get('assMessage')).setIn(['reversAss', 'oldAssId'], '').setIn(['reversAss', 'assId'], '').setIn(['reversAss', 'assName'], ''),
		[ActionTypes.REVERS_ASS_FETCH]					: () => state.set('reversAssConfirmShow', false).set('showReversModal', false),
		[ActionTypes.CHANGE_CURRENT_PAGE_FZHE]			: () => {
			let asslistSelectedStatus = {}
			const currentPageList = action.assList.get('asslist').slice((action.value-1) * Limit.FZHE_CURRENT_PAGE_SIZE, action.value * Limit.FZHE_CURRENT_PAGE_SIZE)
			currentPageList.map(v => asslistSelectedStatus[v.get('assid')] = false)

			return state = state.set('currentPage', action.value).update('asslistSelectedStatus', v => v.clear().merge(asslistSelectedStatus))
		},
		[ActionTypes.GET_ASS_IMPORT_PROGRESS]	             : () => {
			state = state.setIn(['importProgressInfo','message'],action.receivedData.message)
						 .setIn(['importProgressInfo','progress'],action.receivedData.data.progress)
						 .setIn(['importProgressInfo','successList'],fromJS(action.receivedData.data.successList))
						 .setIn(['importProgressInfo','failList'],fromJS(action.receivedData.data.failList))
						 .setIn(['importProgressInfo','timestamp'],fromJS(action.receivedData.data.timestamp))
			return state
		},
		[ActionTypes.CHANGE_ASS_MESSAGEMASK]				     : () => state.set('assshowMessageMask', false),
		[ActionTypes.CHANGE_REVERSE_OLD_NAME]:()=>{
			return state.set('oldName',action.value)
		},
		[ActionTypes.CHANGE_REVERSE_NEW_NAME]:()=>{
			return state.set('newName',action.value)
		},
		[ActionTypes.CHANGE_ASS_CATEGORY_MODAL_VISIBLE]:()=>state.set('assCategoryModalVisible',action.visible)
	}[action.type] || (() => state))()
}
