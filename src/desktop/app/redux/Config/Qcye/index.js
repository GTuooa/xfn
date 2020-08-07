import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

const qcyeState = fromJS({
	flags: {
		tabSelectedIndex: '资产',
		currentacid: '',
		currentasscategorylist: [],
		qcModalDisplay: false,
		entertext: [],
		qcshowMessageMask: false,
		qciframeload: false,
		isModified: false
	},
	acbalist: [{
		idx: '',
		amount: '',
		beginCount:'',
		acfullname: '',
		acname: '',
		acid: '',
		asslist: [
			/*{
				assid: '',
				assname: '',
				asscategory: ''
			}*/
		],
		direction: ''
	}],
	qcimportresponlist : {
		'failJsonList': [],
		'successJsonList': []
	},
	qcmessage: '',
	showQcye: false,
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

export default function handleItem(state = qcyeState, action) {
	return ({
		[ActionTypes.INIT_QCYE]							: () => qcyeState,
		[ActionTypes.CHANGE_QCYE_TAB_PANE]   			: () => state.setIn(['flags', 'tabSelectedIndex'], action.category),
		// 初始化balanceaclist
		[ActionTypes.AFTER_GET_BA_INIT_LIST]			: () => {
			const _acbalist = fromJS(action.receivedData.data)
			const acbalist = _acbalist.map((v, i) => v.set('idx', i))

			return state.set('acbalist', acbalist)
		},
		// 更改已存在的acbalist的金额
		[ActionTypes.CHANGE_AC_BALANCE_AMOUNT]	 		: () => {
			// state = state.setIn(['acbalist', action.idx, 'amount'], action.amount)
			state = state.update('acbalist', v => v.map(w => w.get('idx') === action.idx ? w.set('amount', action.amount) : w))
			return state
		},
		// 更改已存在的acbalist的数量
		[ActionTypes.CHANGE_AC_BALANCE_COUNT]	 		: () => {
			// state = state.setIn(['acbalist', action.idx, 'beginCount'], action.count)
			state = state.update('acbalist', v => v.map(w => w.get('idx') === action.idx ? w.set('beginCount', action.count) : w))
			return state
		},
		// 通过Amount新增acbalist
		[ActionTypes.INSERT_AC_BALANCE_ITEM]     		: () => {
			const acbalistSize = state.get('acbalist').size
			return state.update('acbalist', v => v.push(fromJS({
				idx: acbalistSize,
				amount: action.amount,
				acfullname: action.acfullname,
				acname: action.acname,
				acid: action.acid,
				asslist: [],
				direction: action.direction,
				beginCount: ''
			})))
		},
		// 通过Count新增acbalist
		[ActionTypes.INSERT_AC_BALANCE_ITEM_COUNT]     		: () => {

			if (/^[-\d]\d*\.?\d{0,2}$/g.test(action.count) || action.count === '') {
				const acbalistSize = state.get('acbalist').size
				state = state.update('acbalist', v => v.push(fromJS({
					idx: acbalistSize,
					amount: '',
					acfullname: action.acfullname,
					acname: action.acname,
					acid: action.acid,
					asslist: [],
					direction: action.direction,
					beginCount: action.count
				})))
			}
			return state
		},
		[ActionTypes.CHANGE_QC_ASS_TEXT] 				: () => state.setIn(['flags', 'entertext', action.idx], action.value),
		[ActionTypes.DELETE_AC_BALANCE_ITEM]     		: () => state.set('acbalist', state.get('acbalist').filter(v => v.get('idx') !== action.idx)),
		[ActionTypes.CENCLE_ENTER_QC_MODAL]				: () => state.deleteIn(['acbalist', state.get('acbalist').size-1]).setIn(['flags', 'qcModalDisplay'], false).setIn(['flags', 'entertext'], fromJS([])),
		[ActionTypes.BEFORE_INSERT_ASS_AC_BALANCE_ITEM] : () => state.setIn(['flags', 'qcModalDisplay'], true)
																	.setIn(['flags', 'currentasscategorylist'], action.asscategorylist)
																	.setIn(['flags', 'currentacid'], action.acid),
		[ActionTypes.AFTER_ENTER_QC_ASS_TEXT] 					: () => state.setIn(['flags', 'qcModalDisplay'], false)
																	.setIn(['flags', 'currentasscategorylist'], [])
																	.setIn(['flags', 'entertext'], fromJS([]))
																	.setIn(['flags', 'currentacid'], ''),
		[ActionTypes.ENTER_QC_ASS_TEXT] 				: () => {

			const currentacid = state.getIn(['flags', 'currentacid'])
			// 找到相同的acid的期初设置
			const acbalist = state.get('acbalist').filter(v => v.get('acid') === currentacid && v.get('asslist').size !== 0)
			const acbalistSize = state.get('acbalist').size
			const entertext = state.getIn(['flags', 'entertext'])

			const assExi = acbalist.some(v => v.get('asslist').every((w, i) => entertext.indexOf(w.get('assid')+ Limit.TREE_JOIN_STR + w.get('assname')) > -1))

			if (assExi) {
				thirdParty.Alert('带该辅助核算的期初值已存在')
				return state.deleteIn(['acbalist', acbalistSize - 1])
			} else {
				const asslist = []
				state.getIn(['flags', 'currentasscategorylist']).forEach((v, i) => {
					asslist.push({assid: entertext.get(i).split(Limit.TREE_JOIN_STR)[0], assname: entertext.get(i).split(Limit.TREE_JOIN_STR)[1], asscategory: v})
				})

				return state.setIn(['acbalist', acbalistSize - 1, 'asslist'], fromJS(asslist))
			}
		},
		[ActionTypes.BEFORE_QCYE_IMPORT]				: () => state.setIn(['flags', 'qcshowMessageMask'], true),
		[ActionTypes.CLOSE_QCYE_IMPORT_CONTENT]		    : () => state.setIn(['flags', 'qcshowMessageMask'], false).setIn(['flags', 'qciframeload'], false).set('qcimportresponlist', qcyeState.get('qcimportresponlist')).set('qcmessage', ''),
		[ActionTypes.AFTER_QCYE_IMPORT]				    : () => {
			state = !action.receivedData.code ?
				state.set('qcimportresponlist', fromJS(action.receivedData.data)).setIn(['flags', 'qciframeload'], true).set('qcmessage', fromJS(action.receivedData.message)) :
				state.setIn(['flags', 'qciframeload'], true).set('qcmessage', fromJS(action.receivedData.message))
			return state
		},
		[ActionTypes.CHENGE_QCYE_IS_MODIFIED]			: () => state.setIn(['flags', 'isModified'], action.bool),
		[ActionTypes.SHOW_QCYE]							: () => state.set('showQcye', action.value),
		[ActionTypes.CHANGE_QCYE_MESSAGEMASK]			: () => state.setIn(['flags','qcshowMessageMask'],false),
		[ActionTypes.GET_QCYE_IMPORT_PROGRESS]	             : () => {
			state = state.setIn(['importProgressInfo','message'],action.receivedData.message)
						 .setIn(['importProgressInfo','progress'],action.receivedData.data.progress)
						 .setIn(['importProgressInfo','successList'],fromJS(action.receivedData.data.successList))
						 .setIn(['importProgressInfo','failList'],fromJS(action.receivedData.data.failList))
						 .setIn(['importProgressInfo','timestamp'],fromJS(action.receivedData.data.timestamp))
			return state
		}
	}[action.type] || (() => state))()
}
