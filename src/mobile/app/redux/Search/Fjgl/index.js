import Immutable, { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

const fjglState = fromJS({
	allCheckboxDisplay: false,
	toolBarDisplayIndex: 1,
    lastvoucherid: '',
    issuedate: '',
	currentPage: '1',
	pageCount: '1',
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
	}*/],
	totalSize:1,//总容量G
	useSizeBySob:0,//帐套已用
	useSizeByCorp:0,//公司已用
	needDeleteUrl:[],//[{},{},{},{}]
	vcIndexArray:[],
	needDownLoad:[],//需要下载的地址['','','']
	previewSrc:'',//当前需要预览的图片地址
	label:[],//顶部选择框标签列表
	labelValue:'全部',//当前选中的标签
	fjLabel:[],//数据标签列表
	currentLabel:'',//当前的标签名
	vcIdx:'',//需要被改标签的vcidx
	fjIdx:'',//需要被改标签的fjidx
	updatePath:''
})

export default function handleCxpz(state = fjglState, action) {

	return ({
		[ActionTypes.INIT_CXPZ]							 : () => fjglState,
		[ActionTypes.CHANGE_FJGL_ISSUEDATE]              : () => state.set('issuedate', action.issuedate),
		[ActionTypes.GET_FJGL_DATA]                      : () => {
			const lastVc = action.receivedData
			let fjLabel =[];
			action.receivedData.labelArray.forEach((v,i)=>{
				fjLabel.push({key:v,value:v})
			})
			let label = [{key:'全部',value:'全部'}].concat(fjLabel)
			state =  state.update('vclist', v => v.clear().merge(fromJS(action.receivedData.jsonArray)))
				.set('totalSize', action.receivedData.totalSize)
				.set('useSizeByCorp', action.receivedData.useSizeByCorp)
				.set('useSizeBySob', action.receivedData.useSizeBySob)
				.set('label',fromJS(label))
				.set('fjLabel',fromJS(fjLabel))
			return state

		},
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
		[ActionTypes.OPEN_LABEL_MODAL]                 		 : () => {//打开修改标签的modal
			state = state.set('vcIdx',action.idx)
			.set('fjIdx',action.fjIdx)
			return state;
		},
		[ActionTypes.CHANGE_CURRENT_LABEL]                 		 : () => {//修改标签
			const vcIdx=state.get('vcIdx');
			const fjIdx=state.get('fjIdx');
			state = state.setIn(['vclist', vcIdx, 'enclosureList',fjIdx,'label'],action.currentLabel)
			.set('currentLabel',action.currentLabel)
			return state;
		},
		[ActionTypes.CHANGE_LABEL_VALUE]                  : () => {
			state=state.set('labelValue', action.labelValue)
			return state;
		},
		[ActionTypes.GET_DOWNLOAD_DATA]                 		 : () => {//获取需要下载的列表
			let enclosureListArr = [];//所有的附件列表[{},{},{}]
			state.get('vclist').map(v => {
				v.get('enclosureList').map(w => enclosureListArr.push(w))
			})
			let needDownLoad=[];//所有要下载的附件列表[{},{},{}]
			fromJS(enclosureListArr).filter(w => w.get('checkboxFjDisplay')==true).map(w => needDownLoad.push({
			"url": w.get('enclosurepath'),
			'fileName':w.get('fileName')
			}));
			return state.set('needDownLoad',fromJS(needDownLoad))
		},
		[ActionTypes.CHANGE_ALL_FJ_CHECKBOX_DISPLAY]    : () => state.set('toolBarDisplayIndex', 2).set('allCheckboxDisplay', true),
		[ActionTypes.CANCEL_CHANGE_FJ_CHECKBOX_DISPALY] : () => state.set('toolBarDisplayIndex', 1).update('vclist',v => v.map(w => w.set('selected', false))).set('allCheckboxDisplay', false)
	}[action.type] || (() => state))()
}
