import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import { showMessage } from 'app/utils'
import { formatMoney } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

const fjglState = fromJS({
	flags: {
		selectedVcItemArray: [],
		selectVcAll: false,
		maxVoucherId: '0',
		lastvcindex: '',
		vcindexSort: 1, //根据vcindex进行排序 ， 1为递增排序， －1为递减排序
		vcdateSort: 1,
		showMessageMask: false,
		iframeload: false,
		serchValue: '',
		preview:false,//图片预览的显示与否
		labelModal:false//修改标签的modal状态
	},
	issuedate: '',
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
	totalSize:1,//总容量G
	useSizeBySob:0,//账套已用
	useSizeByCorp:0,//公司已用
	needDeleteUrl:[],//[{},{},{},{}]
	vcIndexArray:[],
	needDownLoad:[],//需要下载的地址['','','']
	previewImgArr:[],//需要预览的图片的数据[{},{},{},{}]
	previewSrcIdx:0,//当前需要预览的图片地址的下标
	label:[],//顶部选择框标签列表
	labelValue:'全部',//当前选中的标签
	fjLabel:[],//数据标签列表
	currentLabel:'',//当前的标签名
	vcIdx:'',//需要被改标签的vcidx
	fjIdx:'',//需要被改标签的fjidx
	updatePath:''
})

let hide = null
export default function handleCxpz(state = fjglState, action) {

	return ({
		[ActionTypes.INIT_FJGL]								 : () => fjglState,
		[ActionTypes.CHANGE_FJGL_ISSUEDATE]                  : () => state.set('issuedate', action.issuedate),
		[ActionTypes.CHANGE_LABEL_VALUE]                  : () => state.set('labelValue', action.labelValue),
		[ActionTypes.GET_FJGL_DATA]                      : () => {
			const lastVc = action.receivedData
			let fjLabel = action.receivedData.labelArray;
			let label = ['全部'].concat(fjLabel)
			state =  state.update('vclist', v => v.clear().merge(fromJS(action.receivedData.jsonArray)))
				.setIn(['flags', 'maxVoucherId'], lastVc.length ? lastVc.pop().vcindex : 0)
				.setIn(['flags', 'selectVcAll'], false)
				.set('totalSize', action.receivedData.totalSize)
				.set('useSizeByCorp', action.receivedData.useSizeByCorp)
				.set('useSizeBySob', action.receivedData.useSizeBySob)
				.set('label',label)
				.set('fjLabel',fjLabel)
			return state

		},
		[ActionTypes.SELECT_FJ_VC_ALL]                  		 : () => {//全选
			const selectVcAll = !state.getIn(['flags', 'selectVcAll'])

			state=state.updateIn(['flags', 'selectVcAll'], v => !v);
			let newVclist=[];
			state.get('vclist').toJS().forEach(v => {
				v.checkboxDisplay = selectVcAll;
				v['enclosureList'].forEach(w=>{
					w.checkboxFjDisplay = selectVcAll;
				})
				newVclist.push(v)
			})
			return state.set('vclist',fromJS(newVclist));
		},
		[ActionTypes.CLOSE_PREVIEW]                  		 : () => state.setIn(['flags', 'preview'], false),
		[ActionTypes.SELECT_FJ_VC_ITEM]                 		 : () => {//单击vc
			let checkboxDisplay=!state.getIn(['vclist', action.idx, 'checkboxDisplay']);
			let currentVc=state.getIn(['vclist', action.idx]).toJS();
			currentVc['checkboxDisplay'] = checkboxDisplay;
			currentVc['enclosureList'].forEach(v => {
				v['checkboxFjDisplay'] = checkboxDisplay;
			})

			state=state.updateIn(['vclist', action.idx], v => fromJS(currentVc))
			return state;
		},
		[ActionTypes.SELECT_FJ_ITEM]                 		 : () => {//单击附件
			state = state.updateIn(['vclist', action.idx, 'enclosureList',action.fjIdx,'checkboxFjDisplay'], v => v ? false : true)

			return state.setIn(['vclist', action.idx, 'checkboxDisplay'], state.getIn(['vclist',action.idx,'enclosureList']).every(v => v.get('checkboxFjDisplay')))
		},
		[ActionTypes.SORT_FJ_VC_LIST_BY_DATE]			 		 : () => {
			const vcdateSort = -state.getIn(['flags', 'vcdateSort'])
			return state
				.updateIn(['flags', 'vcdateSort'], v => -v)
				.update('vclist', v => v.sort((a, b) => {
					if (a.get('vcdate') == b.get('vcdate')) {
						return a.get('vcindex') > b.get('vcindex') ? 1 : -1
					} else {
						return a.get('vcdate') > b.get('vcdate') ? vcdateSort : -vcdateSort
					}
				}))
		},
		[ActionTypes.REVERSE_FJ_VC_LIST]				 		 : () => {
			const vcindexSort = -state.getIn(['flags', 'vcindexSort'])
			return state
				.updateIn(['flags', 'vcindexSort'], v => -v)
				.update('vclist', v => v.sort((a, b) => a.get('vcindex') > b.get('vcindex') ? vcindexSort : - vcindexSort))
		},
		[ActionTypes.PREWIEW_IMAGE]                 		 : () => {//获取图片预览的src
			let previewImgArr = []//所有附件的图片列表
			state.get('vclist').forEach(v => v.get('enclosureList').forEach(w =>{
				if (w.get('imageOrFile') === 'TRUE' || w.get('mimeType') == 'application/pdf'){
					previewImgArr.push(w)
				}
			}))
			let previewSrcIdx = 0
			let clickEnclosurekey = state.getIn(['vclist', action.idx, 'enclosureList',action.fjIdx,'enclosureKey'])
			previewImgArr.forEach((v,i)=>{
				if(v.get('enclosureKey') == clickEnclosurekey ){
					previewSrcIdx = i
					return
				}
			})
			state = state.setIn(['flags', 'preview'], true)
			.set('previewSrcIdx', previewSrcIdx)
			.set('previewImgArr', fromJS(previewImgArr))
			return state;
		},
		[ActionTypes.GET_DELETE_DATA]                 		 : () => {//获取需要删除的列表
			let enclosureListArr = [];//所有的附件列表[{},{},{}]
			state.get('vclist').map(v => {
				v.get('enclosureList').map(w => enclosureListArr.push(w))
			})
			let needDeleteVcArr = [];//需要删除附件的vcIndex列表['','','']
			state.get('vclist').forEach(v => {
				v.get('enclosureList').forEach(w => {
					if(w.get('checkboxFjDisplay')==true){
						needDeleteVcArr.push(v.get('vcindex'))
						return;
					}

				})
			})
			return state.set('needDeleteUrl',fromJS(enclosureListArr).filter(w => w.get('checkboxFjDisplay')==true)).set('vcIndexArray',Array.from(new Set(needDeleteVcArr)))
		},
		[ActionTypes.GET_DOWNLOAD_DATA]                 		 : () => {//获取需要下载的列表
			let enclosureListArr = [];//所有的附件列表[{},{},{}]
			state.get('vclist').map(v => {
				v.get('enclosureList').map(w => enclosureListArr.push(w))
			})
			let needDownLoad=[];//所有要下载的附件列表[{},{},{}]
			fromJS(enclosureListArr).filter(w => w.get('checkboxFjDisplay')==true).map(w => needDownLoad.push({
			"url": w.get('signedUrl'),
			'fileName':w.get('fileName')
			}));
			return state.set('needDownLoad',fromJS(needDownLoad))
		},
		[ActionTypes.OPEN_LABEL_MODAL]                 		 : () => {//打开修改标签的modal
			state = state.setIn(['flags', 'labelModal'], true)
			.set('currentLabel',state.getIn(['vclist', action.idx, 'enclosureList',action.fjIdx,'label']))
			.set('updatePath',state.getIn(['vclist', action.idx, 'enclosureList',action.fjIdx,'enclosureKey']))
			.set('vcIdx',action.idx)
			.set('fjIdx',action.fjIdx)
			return state;

		},
		[ActionTypes.CLOSE_LABEL_MODAL]                 	  : () => {//关闭修改标签的modal
			state = state.setIn(['flags', 'labelModal'], false)
			.set('currentLabel','')
			.set('vcIdx','')
			.set('fjIdx','')
			return state;
		},
		[ActionTypes.CHANGE_CURRENT_LABEL]                 		 : () => {//修改标签
			const vcIdx=state.get('vcIdx');
			const fjIdx=state.get('fjIdx');
			state = state.setIn(['vclist', vcIdx, 'enclosureList',fjIdx,'label'],action.currentLabel)
			.set('currentLabel',action.currentLabel)

			return state;
		},
		[ActionTypes.CHANGE_PREVIEW_SRC_IDX]                 		 : () => {//预览切换上下一张
			let previewSrcIdx = state.get('previewSrcIdx')
			if(action.value==='pre'){
				--previewSrcIdx
			}else{
				++previewSrcIdx
			}
			return state.set('previewSrcIdx',previewSrcIdx);
		}
	}[action.type] || (() => state))();
}
