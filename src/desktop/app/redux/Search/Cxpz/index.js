import { fromJS, toJS }	from 'immutable'
import { formatMoney } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

const cxpzState = fromJS({
	flags: {
		selectedVcItemArray: [],
		selectVcAll: false,
		maxVoucherId: '0',
		vclistSize: 0,
		lastvcindex: '',
		vcindexSort: 1, //根据vcindex进行排序 ， 1为递增排序， －1为递减排序
		vcdateSort: 1,
		vcreviewedSort: 1,
		showMessageMask: false,
		iframeload: false,
		serchValue: '',
		currentPage: 1,
		pageCount: 0,
		pageSize:Limit.SEARCH_CXPZ_LINE_LENGTH,
	},
	issuedate: '',
	allVclist: [], //通过匹配展示的vc，若没有匹配内容就是全部的vc
	vclist: [/*{
		checkboxDisplay: false,
		year: '',
		month: '',
		vcindex: 0,
		vcdate: '',
		closeby: '',
		createdtime: '',
		modifiedtime: '',
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
	}*/],
	importresponlist : {
		'failJsonList': [],
		'successJsonList': []
	},
	message: '',
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

let hide = null
export default function handleCxpz(state = cxpzState, action) {

	return ({
		[ActionTypes.INIT_CXPZ]								 : () => cxpzState,
		[ActionTypes.BEFORE_GET_VC_LIST_FETCH] 				 : () => (hide = message.loading('正在加载中...')) && state,
		[ActionTypes.BEFORE_DELETE_VC_ITEM_FETCH] 			 : () => state,
		[ActionTypes.GET_VC_LIST_FETCH]                      : () => {

			const lastVc = action.receivedData
			const serchValue = state.getIn(['flags', 'serchValue'])

			state =  state
				.update('allVclist', v => v.clear().merge(fromJS(action.receivedData)))
				.update('vclist', v => v.clear().merge(fromJS(action.receivedData)))
				.set('issuedate', action.issuedate)
				.setIn(['flags', 'vclistSize'], action.receivedData.length)
				.setIn(['flags', 'maxVoucherId'], lastVc.length ? lastVc.pop().vcindex : 0)
				.setIn(['flags', 'currentPage'], action.currentPage)
				.setIn(['flags', 'pageSize'], action.pageSize)
				.setIn(['flags', 'pageCount'], action.pageCount)
				.setIn(['flags', 'selectVcAll'], false)

			return state
		},
		// [ActionTypes.AFTER_DELETE_VC_ITEM_FETCH]             : () => state.update('vclist', v => v.filter(v => !v.get('checkboxDisplay'))),
		[ActionTypes.SELECT_VC_ALL]                  		 : () => {
			const selectVcAll = !state.getIn(['flags', 'selectVcAll'])
			return state.updateIn(['flags', 'selectVcAll'], v => !v).update('vclist', v => v.map(w => w.set('checkboxDisplay', selectVcAll)))
		},
		[ActionTypes.NOT_SELECT_VC_ALL]                  		 : () => state.setIn(['flags', 'selectVcAll'], false).update('vclist', v => v.map(w => w.set('checkboxDisplay', false))),
		[ActionTypes.SELECT_VC_ITEM]                 		 : () => {
			state = state.updateIn(['vclist', action.idx, 'checkboxDisplay'], v => v ? false : true)
			return state.setIn(['flags', 'selectVcAll'], state.get('vclist').every(v => v.get('checkboxDisplay')))
		},
		[ActionTypes.SORT_VC_LIST_BY_DATE]			 		 : () => {
			const vcdateSort = -state.getIn(['flags', 'vcdateSort'])
			return state
				.updateIn(['flags', 'vcdateSort'], v => -v)
				// .update('vclist', v => v.sort((a, b) => {
				// 	if (a.get('vcdate') == b.get('vcdate')) {
				// 		return a.get('vcindex') > b.get('vcindex') ? 1 : -1
				// 	} else {
				// 		return a.get('vcdate') > b.get('vcdate') ? vcdateSort : -vcdateSort
				// 	}
				// }))
		},
		[ActionTypes.REVERSE_VC_LIST]				 		 : () => {
			const vcindexSort = -state.getIn(['flags', 'vcindexSort'])
			return state
				.updateIn(['flags', 'vcindexSort'], v => -v)
				// .update('vclist', v => v.sort((a, b) => a.get('vcindex') > b.get('vcindex') ? vcindexSort : - vcindexSort))
		},
		[ActionTypes.CLEAR_CXPZ_STATE] 						 : () => state.update('vclist', v => v.clear()).setIn(['flags', 'selectVcAll'], false).set('issuedate', ''),
		[ActionTypes.BEFORE_VC_IMPORT]						 : () => state.setIn(['flags', 'showMessageMask'], true),
		[ActionTypes.CLOSE_VC_IMPORT_CONTENT]				 : () => {
			state = state.setIn(['importProgressInfo','message'],'')
						 .setIn(['importProgressInfo','progress'],0)
						 .setIn(['importProgressInfo','successList'],fromJS([]))
						 .setIn(['importProgressInfo','failList'],fromJS([]))
						 .setIn(['importProgressInfo','timestamp'],'')
						 .setIn(['importProgressInfo','accessToken'],'')
						 .setIn(['flags', 'showMessageMask'], false).setIn(['flags', 'iframeload'], false).set('importresponlist', cxpzState.get('importresponlist')).set('message', '')
			return state
		},
		[ActionTypes.AFTER_VC_IMPORT]						 : () => {
			state = !action.receivedData.code ?
				state.set('importresponlist', fromJS(action.receivedData.data)).setIn(['flags', 'iframeload'], true).set('message', fromJS(action.receivedData.message)) :
				state.setIn(['flags', 'iframeload'], true).set('message', fromJS(action.receivedData.message))

			return state
		},
		[ActionTypes.SORT_VC_LIST_BY_REVIEWED]				  : () => state.updateIn(['flags', 'vcreviewedSort'], v => -v),
		[ActionTypes.GET_CXPZ_IMPORT_PROGRESS]	             : () => {
			state = state.setIn(['importProgressInfo','message'],action.receivedData.message)
						 .setIn(['importProgressInfo','progress'],action.receivedData.data.progress)
						 .setIn(['importProgressInfo','successList'],fromJS(action.receivedData.data.successList))
						 .setIn(['importProgressInfo','failList'],fromJS(action.receivedData.data.failList))
						 .setIn(['importProgressInfo','timestamp'],fromJS(action.receivedData.data.timestamp))
						 .setIn(['importProgressInfo','accessToken'],fromJS(action.accessToken))
			return state
		},
		[ActionTypes.CHANGE_CXPZ_MESSAGEMASK]				     : () => {
			state = state.setIn(['importProgressInfo','message'],'')
						 .setIn(['importProgressInfo','progress'],0)
						 .setIn(['importProgressInfo','successList'],fromJS([]))
						 .setIn(['importProgressInfo','failList'],fromJS([]))
						 .setIn(['importProgressInfo','timestamp'],'')
						 .setIn(['importProgressInfo','accessToken'],'')
						 .setIn(['flags','showMessageMask'], false)
			return state
		},
	}[action.type] || (() => state))();
}
