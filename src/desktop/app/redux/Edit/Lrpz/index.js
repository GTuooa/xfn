import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import { arrUniq, ToCDB } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

global.fromJS = fromJS

const lrpzState = fromJS({
	flags: {
		focusBack: false,//焦点是否回退
		assDropListFull: false, // 标识ass 下拉列表是否填写完整
		acModalDisplay: false,	//科目的弹框选择器，可能值为两类，弹框显示则为点击时所在的 jvitem 的索引，为 number，弹框隐藏则为 false
		lrfzhsModalDisplay: false,	//新增辅助核算弹窗的状态
		lrAcModalDisplay: false,	//新增科目弹窗的状态
		showLrModalMask: false, //导入时，导入结果弹窗是否显示
		lrIframeload: false,	//导入时，后台返回结果，变为true
		shortCut: false,   //快捷键说明显示的状态
		titleFixed: true,
		isEnterDraft: false,	//从草稿进入
		changeDraftIdx: 0,
		draftList: [],
		locked: '',

		focusRef: 'abstract-0', //当前聚焦在那一个input，该值由 ‘abstract／select／cr／de/’ ＋ idx 组成, 初始化页面后默认选中首个摘要输入框
		voucherIndexList: [],
		voucherIdx: 0,//当前voucher在可浏览的vclist 中的索引值，从cxpz到lrpz为该月的所有凭证，从mxb到lrpz则为当月相关科目的所有凭证
		totalBalance: 0,// debitTotal - creditTotal 的差
		debitTotal: '0.00',//当前借方合计
		creditTotal: '0.00',//当前贷方合计
		acModalSelectedContent:'',//当前科目弹框选择的内容
		accategory: '',
		currencyList:[],  //外币列表
		currencyListArr:[],	//外币－－只有编码
		showAssDisableInfo: [],
		showAssDisableModal: false
	},
	oldVcIndex: '',//以下数据为一张凭证所需的标准数据，详情见通信协议
	oldYear: '',
	oldMonth: '',

	vcIndex: '',
	year: '',
	month: '',
	vcDate: '',
	createdTime: '',
    modifiedTime: '',
	createdBy: '',
	closedBy: '',
    reviewedBy: '',
    enclosureCountUser: '',
	jvList: [{
		//copy: false, //当前摘要是否执行过自动复制
		jvdirection: '',
		jvabstract: '',
		acid: '',
		//acname: '',
		acfullname: '',
		jvamount: '',
		asslist: [
			// {
			// 	assid: '',
			// 	assname: '',
			// 	asscategory: ''
			// }
		],
		acunitOpen: '0',	//是否开启数量核算
		jvcount: '',	//数量
		price: '',	//单价
		jvunit: '',	//单位
		fcStatus: '0',  //外币
		fcNumber: '',
		exchange: '',
		standardAmount: ''


	}, {
		jvdirection: '',	//debit
		jvabstract: '',
		acid: '',
		//acname: '',
		acfullname: '',
		jvamount: '',
		asslist: [],
		acunitOpen: '0',
		jvcount: '',
		price: '',
		jvunit: '',
		fcStatus: '0',  //外币
		fcNumber: '',
		exchange: '',
		standardAmount:''
	}, {
		jvdirection: '',
		jvabstract: '',
		acid: '',
		//acname: '',
		acfullname: '',
		jvamount: '',
		asslist: [],
		acunitOpen: '0',
		jvcount: '',
		price: '',
		jvunit: '',
		fcStatus: '0',  //外币
		fcNumber: '',
		exchange: '',
		standardAmount:''
	}, {
		jvdirection: '',
		jvabstract: '',
		acid: '',
		//acname: '',
		acfullname: '',
		jvamount: '',
		asslist: [],
		acunitOpen: '0',
		jvcount: '',
		price: '',
		jvunit: '',
		fcStatus: '0',  //外币
		fcNumber: '',
		exchange: '',
		standardAmount:''
	}],
	ass: {
		assid: '',
		assname: '',
		asscategory: '',
		handleAss: 'insertass'
	},
	increaseAcItem: {
		limitLength: 0,
		acid: '',
		acname: '',
		acfullname: '',
		category: '',
		upperinfo: '无',
		upperid: '',
		direction: 'debit',
		asscategorylist: [],
		upperAcunit:'0',	//是否有子级科目开启数量核算
		acunitOpen:'0',	//是否开启数量核算
		acunit:''	//计算单位
		// conversion:'1'//换算关系
	},
	importResponList : {
		'failJsonList': [],
		'successJsonList': []
	},
	message: '',
	enclosureList: [],	//上传图片
	previewImageList: [], //预览图片的地址的数组
	needDeleteUrl:[],//需要删除的图片地址
	tagModal:false,//标签组件的显示与否
	label:[],//附件标签
	vcKey: 0,  //后台传来的草稿的标识
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


export default function handleItem(state = lrpzState, action) {
	return ({
		/********* 0.跳转 *********/
		[ActionTypes.INIT_LRPZ]								: () => {
			// initAndGetLastVcIdFetch：初始化、获取日期和最大凭证号 ---> 凭证页面－保存并新增、home、查询凭证－新增
			// getLastVcIdFetch：获取日期和最大凭证号 ---> 改变凭证日期，日期不在账期内时
			const titleFixed = state.getIn(['flags', 'titleFixed'])
			if (action.strJudgeEnter == 'initAndGetLastVcIdFetch' || action.strJudgeEnter == 'getLastVcIdFetch' || action.strJudgeEnter == 'initAndGetLastVcIdFetchAndVcList' ) {

				if(action.strJudgeEnter == 'initAndGetLastVcIdFetch'){
					state = lrpzState.setIn(['flags', 'titleFixed'], titleFixed)
				}

				if (action.strJudgeEnter == 'initAndGetLastVcIdFetchAndVcList') {
					let voucherIndexList = state.getIn(['flags', 'voucherIndexList'])
					const vcListSize = state.getIn(['flags', 'voucherIndexList']).size
					//判断voucherIndexList 是否已经存在 voucherValueStart
					if (voucherIndexList.indexOf(action.data.voucherValueStart) > -1) {
						voucherIndexList = voucherIndexList.set(vcListSize, action.data.voucherValueEnd)
					} else {
						voucherIndexList = voucherIndexList.set(vcListSize, action.data.voucherValueStart)
						voucherIndexList = voucherIndexList.set(vcListSize+1, action.data.voucherValueEnd)
					}
					voucherIndexList = arrUniq(voucherIndexList.toJS())

					state = lrpzState.setIn(['flags', 'titleFixed'], titleFixed).setIn(['flags', 'voucherIndexList'], fromJS(voucherIndexList))
					state = state.setIn(['flags', 'voucherIdx'], state.getIn(['flags', 'voucherIndexList']).size-1)
				}

				if (action.strJudgeEnter != 'getLastVcIdFetch') {
					state = state.set('enclosureList', fromJS([]))
				}

				return state.set('month', action.data.vcDate.getMonth())
						.set('year', action.data.vcDate.getYear())
						.set('vcDate', action.data.vcDate.toString())
						// .set('vcIndex', action.data.receivedData + 1)
						.set('vcIndex', action.data.receivedData)
						// .set('enclosureList', fromJS([]))
			}

			// getVcFetch：获取一张凭证 ---> 查询凭证、明细表、凭证页面－保存
			if (action.strJudgeEnter == 'getVcFetch' || action.strJudgeEnter == 'getVc' ) {
				const currencyList = state.getIn(['flags', 'currencyList'])
				const currencyListArr = state.getIn(['flags', 'currencyListArr'])
				// const voucherIndexList = fromJS(action.data.vcIndexList).size ? fromJS(action.data.vcIndexList) : state.getIn(['flags', 'voucherIndexList'])
				const voucherIndexList = (action.data.vcIndexList && fromJS(action.data.vcIndexList).size!=0) ? fromJS(action.data.vcIndexList) : state.getIn(['flags', 'voucherIndexList'])
				const changedIdx = action.data.changedIdx!=='' ? action.data.changedIdx : state.getIn(['flags', 'voucherIdx'])


				if (action.strJudgeEnter == 'getVc') {
					const info = voucherIndexList.get(changedIdx)

					state = lrpzState.setIn(['flags', 'titleFixed'], titleFixed)
									.set('vcDate', info.split('_')[0])
									.set('vcIndex', info.split('_')[1])
									.set('year', info.split('_')[0].substr(0, 4))	//时间格式：2017-02
									.set('month', info.split('_')[0].substr(5, 2))
									.setIn(['flags', 'voucherIndexList'], voucherIndexList)
					return count(
						state.setIn(['flags', 'voucherIdx'], changedIdx)
							  .setIn(['flags', 'currencyList'], currencyList)
							  .setIn(['flags', 'currencyListArr'], currencyListArr)

					)
				}
				if (action.data) {
					
					let jvlist = fromJS(action.data.receivedData.jvlist)
					if (jvlist.size < 4) {
						let length = jvlist.size
						
						for (let i = 0; i < 4-length; i++) {
							console.log(i);
							jvlist = jvlist.push(fromJS({
								jvdirection: '',
								jvabstract: '',
								acid: '',
								acfullname: '',
								jvamount: '',	
								asslist: [],
								acunitOpen: '0',
								jvcount: '',
								price: '',
								jvunit: '',
								fcStatus: '0',  //外币
								fcNumber: '',
								exchange: '',
								standardAmount:''
							}))
						}
					}

				   	state = action.data.receivedData ?
						   lrpzState.set('oldVcIndex', action.data.receivedData.vcindex)
								  .set('oldYear', action.data.receivedData.year)
								  .set('oldMonth', action.data.receivedData.month)
								  .set('createdBy', action.data.receivedData.createdby)
								  .set('closedBy', action.data.receivedData.closedby)
								  .set('reviewedBy', action.data.receivedData.reviewedby)
								  .set('vcDate', action.data.receivedData.vcdate)
								  .set('vcIndex', action.data.receivedData.vcindex)
								  .set('year', action.data.receivedData.year)
								  .set('month', action.data.receivedData.month)
								  .set('createdTime', action.data.receivedData.createdtime)
								  .set('modifiedTime', action.data.receivedData.modifiedtime)
								  .setIn(['flags', 'voucherIndexList'], voucherIndexList)

								  .set('jvList', jvlist)
								//   .set('jvList', fromJS(action.data.receivedData.jvlist))
								//   .update('jvList', v => lrpzState.get('jvList').merge(v))

								  .set('enclosureList',fromJS(action.data.receivedData.enclosureList))
								  .set('enclosureCountUser', action.data.receivedData.enclosureCountUser)
								  : lrpzState.setIn(['flags', 'titleFixed'], titleFixed);
					return count(
						state.setIn(['flags', 'voucherIdx'], changedIdx)
							  .setIn(['flags', 'currencyList'], currencyList)
							  .setIn(['flags', 'currencyListArr'], currencyListArr)

					)

				}
			}
 			//从 ‘一键收款’ 进来
			if (action.strJudgeEnter == 'oneKeyCollection') {
				return count(lrpzState.set('jvList', action.data.jvList)
						.set('month', action.data.vcDate.getMonth())
						.set('year', action.data.vcDate.getYear())
						.set('vcDate', action.data.vcDate.toString())
						// .set('vcIndex', action.data.receivedData + 1)
						.set('vcIndex', action.data.receivedData)
					)
			}

			//从 ‘草稿箱’ 进来
			if (action.strJudgeEnter == 'getDraftItemFetch' || action.strJudgeEnter == 'getVcIdAndGetDraftItemFetch') {

				let jvlist = action.data.receivedData.jvlist
					if (jvlist.length < 4) {
						let length = jvlist.length
						let addList = []
						
						for (let i = 0; i < 4-length; i++) {
							console.log(i);
							addList.push({
								jvdirection: '',
								jvabstract: '',
								acid: '',
								acfullname: '',
								jvamount: '',	
								asslist: [],
								acunitOpen: '0',
								jvcount: '',
								price: '',
								jvunit: '',
								fcStatus: '0',  //外币
								fcNumber: '',
								exchange: '',
								standardAmount:''
							})
						}
						jvlist = jvlist.concat(addList)
					}


				state = count(
					// lrpzState.set('jvList', fromJS(action.data.receivedData.jvlist))
					lrpzState.set('jvList', fromJS(jvlist))
					   .set('vcDate', action.data.receivedData.vcdate)
					   .set('vcIndex', action.data.receivedData.vcindex)
					   .set('year', action.data.receivedData.year)
					   .set('month', action.data.receivedData.month)
					//    .update('jvList', v => lrpzState.get('jvList').merge(v))
					   .setIn(['flags', 'draftList'], fromJS(action.data.draftList) || state.getIn(['flags', 'draftList']))
					   .setIn(['flags', 'isEnterDraft'], true)
					   .setIn(['flags', 'locked'], action.data.receivedData.locked)
					   .setIn(['flags', 'changeDraftIdx'], action.data.changeDraftIdx)
					   .set('vcKey', action.data.vcKey)
					   .set('enclosureCountUser', action.data.receivedData.enclosureCountUser)
				   )
			   if ( action.strJudgeEnter == 'getVcIdAndGetDraftItemFetch') {
				   state = state.set('month', action.data.vcDate.getMonth())
						   .set('year', action.data.vcDate.getYear())
						   .set('vcDate', action.data.vcDate.toString())
						//    .set('vcIndex', action.data.vcIndex + 1)
						   .set('vcIndex', action.data.vcIndex)
						   .set('enclosureCountUser', action.data.receivedData.enclosureCountUser)
			   }
			   return state
			}
			return lrpzState
		},

		/********* 1.凭证操作 *********/
		/*  凭证头部  */
		[ActionTypes.CHANGE_VC_ID]						: () => {
			if(/^-?[1-9]\d*$/g.test(action.vcIndex)){
				if( action.vcIndex.toString().length > Limit.LRPZ_VCID_LENGTH){
					message.warn(`凭证号位数不能超过${Limit.LRPZ_VCID_LENGTH}位`);
					return state;
				} else {
					state = state.set('vcIndex', action.vcIndex)
				}
			} else {
				state = state.set('vcIndex', '')
				message.warn(`凭证号只能是整数`);
			}
			return state;

		},
		[ActionTypes.CHANGE_VOUCHER_DATE]				: () => state.set('vcDate', action.vcDate),

		/*  凭证分录  */
		[ActionTypes.INSERT_JV_ITEM]					: () => state.update('jvList',v => v.insert(action.idx + 1, lrpzState.getIn(['jvList', 0]))).setIn(['jvList', action.idx+1, 'isInsert'], 'true'),
		[ActionTypes.DELETE_JV_ITEM]					: () => count(state.get('jvList').size > 2 ? state.deleteIn(['jvList', action.idx]) : state),
		[ActionTypes.CHANGE_JV_ABSTRACT]				: () => {
			let abstract = action.jvAbstract
			if (action.bIfTrueLostFocus) {
				abstract.length > Limit.LRPZ_ABSTRACT_LENGTH ? message.warn(`摘要长度不能超过${Limit.LRPZ_ABSTRACT_LENGTH}个字符`) : ''
				// abstract = abstract.length > Limit.LRPZ_ABSTRACT_LENGTH ? abstract.substr(0, Limit.LRPZ_ABSTRACT_LENGTH) : abstract
			}
			return state.setIn(['jvList', action.idx, 'jvabstract'], abstract)
		},
		[ActionTypes.COPY_JV_ABSTRACT]					: () => {
			if (state.getIn(['jvList', action.idx, 'jvabstract']) == '') {
				return state.updateIn(['jvList', action.idx], v => v.set('jvabstract', state.getIn(['jvList', action.idx-1, 'jvabstract'])).set('copy', !state.getIn(['jvList', action.idx, 'copy'])))
			}
			return state
		},
		[ActionTypes.CHANGE_JV_DIRECTION]				: () => count(state.updateIn(['jvList', action.idx], v => v.get('jvdirection') == action.jvDirection ? v : v.set('jvdirection', action.jvDirection).set('jvamount', ''))),
		[ActionTypes.CHANGE_JV_AMOUNT]					: () => {
			state = state.setIn(['jvlist', action.idx, 'jvdirection'], action.jvDirection);

			//JS把全角转为半角的函数
			action.amount = ToCDB(action.amount)

			if (action.amount == '=' || action.amount == '＝') {	//自动输入金额
				state = count(state.setIn(['jvList', action.idx, 'jvamount'], 0))
				const balance = state.getIn(['flags', 'totalBalance'])
				return balance ? (count(state.setIn(['jvList', action.idx, 'jvamount'], state.getIn(['jvList', action.idx, 'jvdirection']) == 'credit' ? balance + '' : (- balance) + '')) ) : state
			}

			return ( (/^[-\d]\d*\.?\d{0,2}$/g.test(action.amount) &&
					 	parseInt(action.amount).toString().replace(/-/, '').length < Limit.LRPZ_MONEY_LENGTH
				 	 ) || action.amount === ''
				   )
				   ?
				   count(state.setIn(['jvList', action.idx, 'jvamount'], action.amount)) : state
		},
		[ActionTypes.REFRESH_ACITEM_ASSLIST]			: () => {
			const id = action.idx.split('-')[1]
			const newAsslist = action.newAsslist
			const jvItemAsslist = state.getIn(['jvList', id, 'asslist'])

			let asslist = []

			// 如果在录入凭证的过程中有新关联的辅助核算类别就清空那个科目，
			// 如果是删除某个辅助核算类别关联，就删除对应的辅助核算
			if (action.assDropListFull) {

				newAsslist.forEach(v => {

					const oldAsslistItem = jvItemAsslist.filter(w => w.get('asscategory') == v.get('asscategory'))

					oldAsslistItem.size && oldAsslistItem.getIn([0, 'assid']) ? asslist.push({
						asscategory: v.get('asscategory'),
						assid: oldAsslistItem.getIn([0, 'assid']),
						assname: oldAsslistItem.getIn([0, 'assname'])
					}) : asslist.push({asscategory: v.get('asscategory')})
				})

			} else {

				// if (newAsslist.size < jvItemAsslist.size) { // 新增了辅助核算的关联

				// 	newAsslist.forEach(v => {

				// 		const oldAsslistItem = jvItemAsslist.filter(w => w.get('asscategory') == v.get('asscategory'))

				// 		oldAsslistItem.size && oldAsslistItem.getIn([0, 'assid']) ? asslist.push({
				// 			asscategory: v.get('asscategory'),
				// 			assid: oldAsslistItem.getIn([0, 'assid']),
				// 			assname: oldAsslistItem.getIn([0, 'assname'])
				// 		}) : asslist.push({asscategory: v.get('asscategory')})
				// 	})
				// } else if (newAsslist.size > 0) {
				// 	newAsslist.forEach(v => {
				// 		asslist.push({asscategory: v.get('asscategory')})
				// 	})
				// }

				if (newAsslist.size > 0) {
					newAsslist.forEach(v => {
						const oldAsslistItem = jvItemAsslist.filter(w => w.get('asscategory') == v.get('asscategory'))
						oldAsslistItem.size && oldAsslistItem.getIn([0, 'assid']) ? asslist.push({
							asscategory: v.get('asscategory'),
							assid: oldAsslistItem.getIn([0, 'assid']),
							assname: oldAsslistItem.getIn([0, 'assname'])
						}) : asslist.push({asscategory: v.get('asscategory')})
					})
				}
			}

			state = asslist.length ? state.updateIn(['jvList', id, 'asslist'], v => fromJS(asslist)) : state.updateIn(['jvList', id], v => v.set('asslist', fromJS([])))
			// state = asslist.length ? state.updateIn(['jvList', id, 'asslist'], v => fromJS(asslist)) : state.updateIn(['jvList', id], v => v.set('acid', '').set('acfullname', '').set('asslist', fromJS([])))
			return state
		},
		[ActionTypes.CHANGE_JV_AC]						: () => {

			// const assCategoryList =  action.selectAcList.find(v => v.get('acid') == action.acId && v.get('acfullname') == action.acFullName)
			// const finnalAssList =  action.allAssList.filter(v => (assCategoryList ? assCategoryList.get('asscategorylist') : []).includes(v.get('asscategory')))
			// let showAssDisableInfo = []
			// finnalAssList.map((u,i) => {
			// 	if (u.get('asslist').every(v => v.get('disableTime'))) {
			// 		showAssDisableInfo.push(true)
			// 	} else {
			// 		showAssDisableInfo.push(false)
			// 	}
			// })
			// state = state.setIn(['flags', 'showAssDisableInfo'], fromJS(showAssDisableInfo))

			if (state.getIn(['jvList', action.idx]) === undefined) {
				message.info('录入异常，请刷新')
				return state
			}

			let assList = []
			action.assCategorys ? action.assCategorys.forEach(v => assList.push({asscategory: v})) : assList
			//如果存在数量核算，清空数据
			if (state.getIn(['jvList', action.idx, 'acunitOpen']) == '1') {
				state = state.updateIn(['jvList', action.idx], v =>
					v.set('acunitOpen', '0').set('jvcount', '').set('price', '').set('jvunit', '')
				)
			}
			//如果存在外币核算，清空数据
			if (state.getIn(['jvList', action.idx, 'fcStatus']) == '1') {
				state = state.updateIn(['jvList', action.idx], v =>
					v.set('fcStatus', '0').set('fcNumber', '').set('standardAmount', '').set('exchange', '')
				)
			}
			state = state.setIn(['jvList', action.idx, 'closingbalance'], undefined)

			return state.update('flags', v => v.set('focusRef', 'select-' + action.idx).set('assDropListFull', !!assList.length))
				.updateIn(['jvList', action.idx], v => v.set('acid', action.acId).set('acname', action.acName).set('acfullname', action.acFullName).set('asslist', fromJS(assList)))
				.setIn(['jvList', action.idx, 'acunitOpen'], action.acunitOpen)

		},
		/*  凭证分录 -- ass */
		[ActionTypes.CHANGE_JV_ASS]						: () => {

			const assinfo = action.value.split(Limit.ASS_ID_AND_NAME_CONNECT)
			state = state.updateIn(['jvList', action.idx, 'asslist'], v =>
				v.map(w => w.get('asscategory') == action.assCategory ? w.set('assid', assinfo[0]).set('assname', assinfo[1]) : w))
			return state.setIn(['flags', 'assDropListFull'], state.getIn(['jvList', action.idx, 'asslist']).some(v => !v.get('assid')))

		},
		[ActionTypes.CANCLE_ASS_INPUT]					: () => {
			// const acinfo = action.value.split(Limit.ASS_ID_AND_NAME_CONNECT)
			// const index = action.value.indexOf(' ')
			// const acid = action.value.substr(0, index)
			// const acname = action.value.substr(index)


			//ass 下拉列表显示时通过修改科目内容，取消 ass 下拉列表显示
			state = state.getIn(['jvList', action.idx]) ? state.updateIn(['jvList', action.idx], v =>
					// v.set('acid', acid).set('acfullname', acname).update('asslist', v => v.clear())) : state
					v.set('acid', '').set('acfullname', '').update('asslist', v => v.clear())) : state

			//如果存在数量核算，清空数据
			if (state.getIn(['jvList', action.idx, 'acunitOpen']) == '1') {
				state = state.updateIn(['jvList', action.idx], v =>
					v.set('acunitOpen', '0').set('jvcount', '').set('price', '').set('jvunit', '')
				)
			}

			return state.update('flags', v => v.set('assDropListFull', false))
		},
		// [ActionTypes.CHANGE_SHOW_ASS_DISABLE_INFO]		: () => state.setIn(['flags', 'showAssDisableInfo', action.idx], false),
		// [ActionTypes.CHANGE_LRPZ_ASS_INFO]				: () => {
		// 	//录凭证时去辅助核算设置中禁用一个项目，需要重新给出提示语
		// 	const relatedAclist = action.relatedAclist.toJS()
		// 	const showAssDisableInfo = state.getIn(['flags', 'showAssDisableInfo'])
		// 	const jvList = state.get('jvList')
		// 	const focusRefArr = state.getIn(['flags', 'focusRef']).split('-')
		// 	if (relatedAclist.indexOf(jvList.setIn([focusRefArr[1], 'acid']))) {
		// 		showAssDisableInfo.map((u,i) => {
		// 			state = state.updateIn(['flags', 'showAssDisableInfo', i], v => true)
		// 		})
		// 	}
		// 	return state
		// },
		[ActionTypes.SHOW_LRPZ_ASS_DISABLE_MODAL]		: () => state.setIn(['flags', 'showAssDisableModal'], !state.getIn(['flags', 'showAssDisableModal'])).setIn(['flags', 'showAssDisableInfo'], fromJS([action.asscategory+'中所有的核算项目为禁用状态，您可以：', '1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；', '2、在当前页面，“新增”新的核算项目'])),

		/*  凭证分录 -- ac */
		[ActionTypes.CHANGE_AC_MODAL_DISPLAY]			: () => state.updateIn(['flags', 'acModalDisplay'], v => v === false ? action.idx : false),
		[ActionTypes.CHANGE_TREE_SELECT_CONTENT]		: () => state.updateIn(['flags', 'acModalSelectedContent'], v => action.info || v),

		/*  凭证审核  */
		[ActionTypes.REVIEWEDBY_VC]					: () => state.set('reviewedBy', action.reviewedBy),
		/*  凭证反审核  */
		[ActionTypes.CANCEL_REVIEWEDBY_VC]			: () => state.set('reviewedBy', ''),
		/*  凭证清空  */
		[ActionTypes.CLEAR_LRPZ]					: () => state.set('jvList', lrpzState.get('jvList')).setIn(['flags', 'debitTotal'], '0').setIn(['flags' ,'creditTotal'], '0').set('enclosureList', fromJS([])),

		/********* 1.1 草稿 *********/
		[ActionTypes.TEMPORARY_SAVE_FETCH]			: () => state.set('vcKey', action.receivedData),

		/********* 2.附件 *********/

		[ActionTypes.GET_LABEL_FETCH]		: () => { //获取附件的标签
			state=state.set('label',action.receivedData.data)
			.set('tagModal',true)
			return state;
		},
		[ActionTypes.CHANGE_TAG_NAME]				: () => { //编辑标签名称
			state.get('enclosureList').map((v,i)=>{
				if(i == action.index){
					state = state.setIn(['enclosureList',i,'label'],action.value)
				}
			})
			state=state.set('tagModal',false)
			return state;
		},
		[ActionTypes.DELETE_UPLOAD_IMG_URL]			: () => { //删除上传的附件
			let needDeleteUrl = [];
			state.get('needDeleteUrl').map(v=>{
				needDeleteUrl.push(v)
			})
			state.get('enclosureList').map((v,i)=>{
				if (i == action.index) {
					needDeleteUrl.push(state.getIn(['enclosureList',i]).set('beDelete',true))
					state = state.deleteIn(['enclosureList',i])
				}
			})
			state = state.set('enclosureCountUser', state.get('enclosureList').size)
						.set('needDeleteUrl', fromJS(needDeleteUrl))

			return state;
		},
		[ActionTypes.CHANGE_ENCLOSURE_LIST]			: () => { //改变附件列表的信息
			let enclosureList = [];
			state.get('enclosureList').map(v=>{
				enclosureList.push(v)
			})
			action.imgArr.forEach(v=>{
				enclosureList.push(v)
			})
			state = state.set('enclosureList', fromJS(enclosureList))
						.set('enclosureCountUser', enclosureList.length)

			return state;
		},
		[ActionTypes.GET_UPLOAD]			: () => { //获取上传的附件
			state=state.set('enclosureList',fromJS(action.receivedData));
			return state;
		},
		[ActionTypes.CHANGE_VC_ENCLOSURE_COUNT_USER]			: () => {
			state = state.set('enclosureCountUser', action.value)
			return state;
		},

		/********* 3. *********/
		/*  科目新增  */
		[ActionTypes.CHANGE_LR_AC_MODAL_DISPLAY]     	: () => state.updateIn(['flags', 'lrAcModalDisplay'], v => !v),
		[ActionTypes.CHANGE_LR_AC_MODAL_CLEAR]          : () => state.set('increaseAcItem', lrpzState.get('increaseAcItem')).updateIn(['flags', 'lrAcModalDisplay'], v => !v),
		[ActionTypes.CHANGE_LR_ACID_TEXT]			 	: () => {
			const length = action.acId.length
			if (!/^\d*$/.test(action.acId) || length == 11)
				return state

			if (length > Limit.MIN_AC_ID_LENGTH && length % 2 === 0) {
				const upperId = action.acId.substr(0, length - 2)
				const upperAcItem = action.acList.find(v => v.get('acid') == upperId)

				state = state.update('increaseAcItem', v =>
					v.set('upperid', upperAcItem ? upperAcItem.get('acid') : '')
					.set('upperinfo', upperAcItem ? upperAcItem.get('acid') + ' ' + upperAcItem.get('acname') : '无')
					.set('category', upperAcItem ? upperAcItem.get('category') : '')
					.update('direction', w => upperAcItem ? upperAcItem.get('direction') : w)
				)
			} else if (length <= Limit.MIN_AC_ID_LENGTH) {
				state = state.update('increaseAcItem', v => v.set('upperid', '').set('upperinfo', '无').set('category', ''))
			}
			return state.setIn(['increaseAcItem', 'acid'], action.acId)
		},
		[ActionTypes.CHANGE_LR_ACNAME_TEXT]           : () => state.setIn(['increaseAcItem', 'acname'], action.acName),
		[ActionTypes.CHANGE_LR_CATEGORY_TEXT]         : () => {
			const accategory = {
				'流动资产': '资产',
				'非流动资产': '资产',
				'流动负债': '负债',
				'非流动负债': '负债',
				'所有者权益': '权益',
				'成本': '成本'
			}[action.category] || '损益'
			return state.setIn(['increaseAcItem', 'category'], action.category).setIn(['flags', 'accategory'], accategory)
		},
		[ActionTypes.CHANGE_LR_AC_DIRECTON_TEXT]      : () => state.updateIn(['increaseAcItem', 'direction'], v => v === 'credit' ? 'debit' : 'credit'),
		[ActionTypes.CHANGE_LR_AMOUNT_TEXT]           : () => {
			if (state.getIn(['increaseAcItem', 'acunitOpen']) == '0') {
				state = state.setIn(['increaseAcItem', 'acunitOpen'], '1')
			}else{
				state = state.setIn(['increaseAcItem', 'acunitOpen'], '0').setIn(['increaseAcItem', 'acunit'], '')
			}
			return state;
		},
		[ActionTypes.CHANGE_LR_AC_UNIT_TEXT]                  	 : () => state.updateIn(['increaseAcItem', 'acunit'], v => v = action.unit),

		/*  辅助核算新增  */
		[ActionTypes.CHANGE_LR_FZHS_MODAL_DISPLAY] 	 : () => state.updateIn(['flags', 'lrfzhsModalDisplay'], v => !v),
		[ActionTypes.CHANGE_LR_ASS_CATEGORY] 	 	 : () => state.setIn(['ass', 'asscategory'], action.asscategory),
		[ActionTypes.CHANGE_LR_FZHS_MODAL_CLEAR]     : () => state.set('ass', lrpzState.get('ass')).updateIn(['flags', 'lrfzhsModalDisplay'], v => !v),
		// [ActionTypes.CHANGE_LR_ASS_ID]				 : () => /^\d*$/g.test(action.assId) ? state.setIn(['ass', 'assid'], action.assId) : state,
		[ActionTypes.CHANGE_LR_ASS_ID]				 : () => {
			if (/^[A-Za-z0-9]*$/g.test(action.assId)) {
				return state.setIn(['ass', 'assid'], action.assId)
			}
			return state
		},

		[ActionTypes.CHANGE_LR_ASS_NAME]			 : () => state.setIn(['ass', 'assname'], action.assName),

		/********* 3.1 数量核算 *********/
		[ActionTypes.GET_AMOUNT_DATA]					: () => {
			if (action.receivedData.acunitOpen == "1") {
				state = state.setIn(['jvList', action.idx, 'jvunit'], action.receivedData.acunit)
							.setIn(['jvList', action.idx, 'price'], action.receivedData.price)
							.setIn(['jvList', action.idx, 'acunitOpen'], action.receivedData.acunitOpen)

				if (!state.getIn(['jvList', action.idx, 'jvdirection'])) {//没有方向在把获取的方向添加进去
					state = state.setIn(['jvList', action.idx, 'jvdirection'], action.receivedData.direction)
				}
				return state;
			} else {
				state = state.setIn(['jvList', action.idx, 'jvunit'],'')
					.setIn(['jvList', action.idx, 'price'],'')
					.setIn(['jvList', action.idx, 'acunitOpen'],'0')

				if (!state.getIn(['jvList', action.idx, 'jvdirection'])) {//没有方向在把获取的方向添加进去
					state = state.setIn(['jvList', action.idx, 'jvdirection'], action.receivedData.direction)
				}
				return state;
			}
		},
		[ActionTypes.GET_AMOUNT_TYPE_MXB_DATA]					: () => {

			if (action.receivedData.acunitOpen == "1") {
				state = state.setIn(['jvList', action.idx, 'jvunit'], action.receivedData.acunit)
							.setIn(['jvList', action.idx, 'price'], '')
							.setIn(['jvList', action.idx, 'acunitOpen'], action.receivedData.acunitOpen)
							.setIn(['jvList', action.idx, 'jvcount'], '')

				return state
			} else {
				return state
			}
		},
		[ActionTypes.CHANGE_JV_COUNT]				: () => {
			const reg = new RegExp("^[-\\d]\\d*\\.?\\d{0," + Number(action.unitDecimalCount) + "}$","g")
			if (reg.test(action.jvCount) || action.jvCount == '') {
				state = state.setIn(['jvList', action.idx, 'jvcount'], action.jvCount)
			}
			return state
		},
		[ActionTypes.CHANGE_JV_PRICE]				: () => {
			const reg = new RegExp("^[-\\d]\\d*\\.?\\d{0,2}$","g")
			if (reg.test(action.jvPrice) || action.jvPrice == '') {
				state = state.setIn(['jvList', action.idx, 'price'],action.jvPrice)
			}
			return state
		},
		[ActionTypes.AUTO_CALCULATE]				: () => {
			let price = state.getIn(['jvList', action.idx, 'price']);
			let jvCount = state.getIn(['jvList', action.idx, 'jvcount']);
			let jvAmount = state.getIn(['jvList', action.idx, 'jvamount']);
			if(action.value=="count" || action.value=="price"){	//数量或单价的值发生改变
 				if(Number(jvCount) && Number(price)){	//数量和单价都有值－－计算金额
					// 数量的符号总是与金额的符号保持一致
					if(Number(jvAmount)<0 && jvCount){
						jvCount = -Math.abs(jvCount)
					}else if(Number(jvAmount)>0 && jvCount){
						jvCount = Math.abs(jvCount)
					}
					// 数量小数点的位数
					if(Number(jvCount)%1 == 0){	//整数或带.00的数
						jvCount = Math.floor(jvCount)	//去掉无意义的0
					}else{
						jvCount=parseFloat(Number(jvCount).toFixed(action.unitDecimalCount))
					}
					// 价格小数点的位数
					if(Number(price)%1 == 0){
						price = Math.floor(price)
					}else{
						price = parseFloat(Number(price).toFixed(2))
					}
					state = state.setIn(['jvList', action.idx, 'price'], price)
								.setIn(['jvList', action.idx, 'jvcount'], jvCount)
								.setIn(['jvList', action.idx, 'jvamount'], (jvCount * price).toFixed(2))
				}else {

					if(price == '' && jvCount && jvAmount){ //三者都有值后 用户把单价置为空－－计算单价
						price = jvAmount/jvCount
						// 确定价格小数点的位数
						if(Number(price)%1 == 0){
							price = Math.floor(price)
						}else{
							price = parseFloat(Number(price).toFixed(2))
						}
						state = state.setIn(['jvList', action.idx, 'price'], price)
					}
					// else if(jvCount == '' && price && jvAmount){	//三者都有值后 用户把数量置为空－－计算数量
					// 	jvCount = parseFloat((jvAmount/price).toFixed(2))
					// 	// 数量小数点的位数
					// 	if(Number(jvCount)%1 == 0){
					// 		jvCount = Math.floor(jvCount)
					// 	}
					// 	state = state.setIn(['jvList', action.idx, 'jvcount'],jvCount)
					// }
					else if(!(jvCount == 0) && jvAmount){	//数量，总额有值－－计算单价
						price = jvAmount/jvCount
						// 确定价格小数点的位数
						if(Number(price)%1 == 0){
							price = Math.floor(price)
						}else{
							price = parseFloat(Number(price).toFixed(2))
						}
						state = state.setIn(['jvList', action.idx, 'price'], price)
					}else{
						return state
					}
				}
			}else if(action.value == "amount"){ //金额的值发生改变
				if(jvCount && jvAmount){	//数量和金额都有值－－计算单价
					// 数量的符号随金额的改变而改变
					if(Number(jvAmount)<0 && jvCount){
						jvCount = -Math.abs(jvCount);
					}else if(Number(jvAmount)>0 && jvCount){
						jvCount = Math.abs(jvCount);
					}
					//计算单价
					price = jvAmount/jvCount
					// 确定价格小数点的位数
					if(Number(price)%1 == 0){
						price = Math.floor(price)
					}else{
						price=parseFloat(Number(price).toFixed(2))
					}
					state = state.setIn(['jvList', action.idx, 'price'], price)
								.setIn(['jvList', action.idx, 'jvcount'], jvCount)
				}else{
					return state
				}
			}
			return count(state)
		},

		/********* 3.1.1 科目余额 *********/
		[ActionTypes.GET_AC_CLOSE_BALANCE]			: () =>	{
			const closingbalance = action.receivedData.closingBalance
			return state.setIn(['jvList', action.idx, 'closingbalance'], closingbalance)
		},

		/********* 3.2 外币核算 *********/
		[ActionTypes.GET_FC_LIST_DATA_FETCH]			: () =>	{
			const receivedData = fromJS(action.receivedData)
			let currencyListArr = []
			receivedData.map((u,i) => {
				return currencyListArr.push(u.get('fcNumber'))
			})

			const item = receivedData.filter(v => v.get('standard') == '1')
			const fcNumber = item.getIn([0, 'fcNumber'])
			const exchange = item.getIn([0, 'exchange'])

			if (action.idx != 'modify') {
				state = state.setIn(['jvList', action.idx, 'fcStatus'], '1')
				.setIn(['jvList', action.idx, 'fcNumber'], fcNumber)
				.setIn(['jvList', action.idx, 'exchange'], exchange)
				.setIn(['jvList', action.idx, 'jvdirection'], 'debit')
			}
			state =  state.setIn(['flags', 'currencyList'], receivedData).setIn(['flags', 'currencyListArr'], currencyListArr)
			return state

		},
		[ActionTypes.GET_FC_LIST_DATA_FETCH]			: () =>	{
			const receivedData = fromJS(action.receivedData)
			let currencyListArr = []
			receivedData.map((u,i) => {
				return currencyListArr.push(u.get('fcNumber'))
			})

			const item = receivedData.filter(v => v.get('standard') == '1')
			const fcNumber = item.getIn([0, 'fcNumber'])
			const exchange = item.getIn([0, 'exchange'])

			if (action.idx != 'modify') {
				state = state.setIn(['jvList', action.idx, 'fcStatus'], '1')
				.setIn(['jvList', action.idx, 'fcNumber'], fcNumber)
				.setIn(['jvList', action.idx, 'exchange'], exchange)
				.setIn(['jvList', action.idx, 'jvdirection'], 'debit')
			}
			state =  state.setIn(['flags', 'currencyList'], receivedData).setIn(['flags', 'currencyListArr'], currencyListArr)
			return state

		},
		[ActionTypes.GET_FC_LIST_DATA_MXB_FETCH]			: () =>	{

			const receivedData = fromJS(action.receivedData)
			let currencyListArr = []
			receivedData.map((u,i) => {
				return currencyListArr.push(u.get('fcNumber'))
			})

			state = state.setIn(['flags', 'currencyList'], receivedData).setIn(['flags', 'currencyListArr'], currencyListArr)
			return state

		},
		[ActionTypes.CHANGE_JV_ITEM_NUMBER]				: () => {
			const preNumber = state.getIn(['jvList', action.idx, 'fcNumber'])
			const currencyListArr = state.getIn(['flags', 'currencyListArr'])
			let numberIdx = currencyListArr.indexOf(preNumber)
			numberIdx = action.value == 'pre' ? numberIdx-1 : numberIdx+1

			if (numberIdx >= 0 && numberIdx <= currencyListArr.length-1) {
				const fcNumber = currencyListArr[numberIdx]
				const exchange = state.getIn(['flags', 'currencyList']).filter(v => v.get('fcNumber') == fcNumber).getIn(['0', 'exchange'])
				state = state.setIn(['jvList', action.idx, 'fcNumber'], fcNumber).setIn(['jvList', action.idx, 'exchange'], exchange)
			}
			return state

		},
		[ActionTypes.CHANGE_JV_STANDAR_AMOUNT]			: () => state.setIn(['jvList', action.idx, 'standardAmount'], action.value),
		[ActionTypes.CHANGE_JV_EXCHANGE]				: () => state.setIn(['jvList', action.idx, 'exchange'], action.value),
		[ActionTypes.AUTO_CALCULATE_ALL]				: () => {

			let price = state.getIn(['jvList', action.idx, 'price'])
			let jvCount = state.getIn(['jvList', action.idx, 'jvcount'])
			let standardAmount = state.getIn(['jvList', action.idx, 'standardAmount'])
			let exchange = state.getIn(['jvList', action.idx, 'exchange'])
			let jvAmount = state.getIn(['jvList', action.idx, 'jvamount'])

			if (price && jvCount && standardAmount && exchange) {  //数量、单价、原币、汇率都有值
				if (action.value == 'count') {  //改变数量－－－>修改金额、汇率
					// 数量的符号总是与金额的符号保持一致
					jvCount = changeMark(jvCount, jvAmount)
					standardAmount = changeMark(standardAmount, jvAmount)
					jvAmount = (jvCount * price).toFixed(2)
					exchange = jvAmount/standardAmount

				} else if (action.value == 'price') { //改变单价－－－>修改金额、汇率
					jvAmount = (jvCount * price).toFixed(2)
					exchange = jvAmount/standardAmount

				} else if (action.value == 'standardAmount') { //改变原币－－－>修改金额、单价
					// 原币的符号总是与金额的符号保持一致
					jvCount = changeMark(jvCount, jvAmount)
					standardAmount = changeMark(standardAmount, jvAmount)
					jvAmount = (standardAmount * exchange).toFixed(2)
					price = jvAmount/jvCount

				} else if (action.value == 'exchange') {  //改变汇率－－－>修改金额、单价
					jvAmount = (standardAmount * exchange).toFixed(2)
					price = jvAmount/jvCount

				} else if (action.value == 'amount') {	//改变金额－－－>修改汇率、单价
					jvCount = changeMark(jvCount, jvAmount)
					standardAmount = changeMark(standardAmount, jvAmount)
					if (jvAmount) {
						price = Number(jvAmount)/jvCount
						exchange = Number(jvAmount)/standardAmount
					}
				}

			} else if (action.value == 'count' || action.value == 'price') {   //数量、单价
				if (Number(jvCount) && price) {	//数量和单价都有值－－计算金额
					// 数量的符号总是与金额的符号保持一致
					jvCount = changeMark(jvCount, jvAmount)
					jvAmount = (Number(jvCount) * price).toFixed(2)

				} else {
					if(price == '' && jvCount && jvAmount){ //三者都有值后 用户把单价置为空－－计算单价
						price = jvAmount/jvCount

					}
					// else if(jvCount == '' && price && jvAmount){	//三者都有值后 用户把数量置为空－－计算数量
					// 	jvCount = parseFloat((jvAmount/price).toFixed(2))
					//
					// }
					else if(!(jvCount == 0) && jvAmount){	//数量，总额有值－－计算单价
						price = jvAmount/jvCount

					}else{
						state = state
					}
				}

				if (Number(standardAmount)) { //原币不为0/空，计算汇率
					exchange = jvAmount/standardAmount
				}

			} else if (action.value == 'standardAmount' || action.value == 'exchange') {  //原币、汇率

				if(Number(standardAmount) && exchange){	//原币、汇率都有值－－计算金额
					// 原币的符号总是与金额的符号保持一致
					standardAmount = changeMark(standardAmount, jvAmount)
					jvAmount = (Number(standardAmount) * exchange).toFixed(2)

				}else {
					if(exchange == '' && standardAmount && jvAmount){ //三者都有值后 用户把汇率置为空－－计算汇率
						exchange = jvAmount/standardAmount
						// 确定汇率小数点的位数
						if(exchange % 1 == 0){
							exchange = Math.floor(exchange)
						}else{
							exchange = parseFloat(exchange.toFixed(4))
						}
						state = state.setIn(['jvList', action.idx, 'exchange'], exchange)

					}
					// else if(standardAmount == '' && exchange && jvAmount ){	//三者都有值后 用户把原币置为空－－计算原币
					// 	standardAmount = parseFloat((jvAmount/exchange).toFixed(2))
					//
					// }
					else if(standardAmount && jvAmount){	//原币，金额有值－－计算汇率
						exchange = jvAmount/standardAmount

					}else{
						state = state
					}
				}
				if (Number(jvCount)) { //数量不为0/空，计算单价
					price = jvAmount/jvCount
				}

			} else if (action.value == "amount") {  //金额
				// 数量的符号随金额的改变而改变
				jvCount = changeMark(jvCount, jvAmount)
				standardAmount = changeMark(standardAmount, jvAmount)

				if (jvAmount) {
					if (!standardAmount && jvCount) { //原币为空，数量不为空
						price = Number(jvAmount)/jvCount
					} else if (standardAmount && !jvCount) {
						exchange = Number(jvAmount)/standardAmount
					} else if (standardAmount && jvCount) {
						price = Number(jvAmount)/jvCount
						exchange = Number(jvAmount)/standardAmount
					}

				}
			}

			// 改变小数点的位数
			if(Number(jvCount)%1 == 0){	//整数或带.00的数
				jvCount = Math.floor(jvCount)	//去掉无意义的0
			}else{
				jvCount = parseFloat(Number(jvCount).toFixed(action.unitDecimalCount))
			}
			if(Number(standardAmount)%1 == 0){
				standardAmount = Math.floor(standardAmount)
			}else{
				standardAmount = parseFloat(Number(standardAmount).toFixed(2))
			}
			if(Number(price)%1 == 0){
				price = Math.floor(price)
			}else{
				price = parseFloat(Number(price).toFixed(2))
			}

			if(Number(exchange)%1 == 0){
				exchange = Math.floor(exchange)
			}else{
				exchange = parseFloat(Number(exchange).toFixed(4))
			}

			state = state.setIn(['jvList', action.idx, 'standardAmount'], standardAmount === 0 ? '' : standardAmount)
						.setIn(['jvList', action.idx, 'exchange'], exchange)
						.setIn(['jvList', action.idx, 'price'], price)
						.setIn(['jvList', action.idx, 'jvcount'], jvCount)
						.setIn(['jvList', action.idx, 'jvamount'], jvAmount)
			return count(state)
		},


		/********* 4. 导入、复制 *********/
		[ActionTypes.BEFORE_LR_VC_IMPORT]				: () => state.setIn(['flags', 'showLrModalMask'], true),
		[ActionTypes.CLOSE_LR_IMPORT_CONTENT]			: () => {
			state = state.setIn(['importProgressInfo','message'],'')
						 .setIn(['importProgressInfo','progress'],0)
						 .setIn(['importProgressInfo','successList'],fromJS([]))
						 .setIn(['importProgressInfo','failList'],fromJS([]))
						 .setIn(['importProgressInfo','timestamp'],'')
						 .setIn(['importProgressInfo','accessToken'],'')
						 .setIn(['flags', 'showLrModalMask'], false)
						 .setIn(['flags', 'lrIframeload'], false)
						 .set('importResponList', lrpzState.get('importResponList'))
						 .set('message', '');
			return state ;
		},
		[ActionTypes.AFTER_LR_VC_IMPORT]				: () => {
			state = !action.receivedData.code ?
				state.set('importResponList', fromJS(action.receivedData.data)).setIn(['flags', 'lrIframeload'], true).set('message', fromJS(action.receivedData.message)) :
				state.setIn(['flags', 'lrIframeload'], true).set('message', fromJS(action.receivedData.message))

			return state
		},
		[ActionTypes.AFTER_COPY_CLICL]					: () => {
			message.success('复制成功')
			return count(lrpzState.set('jvList', action.jvList))

		},
		[ActionTypes.JUDGE_TITLE_FIXED]					: () => {
			return state.updateIn(['flags', 'titleFixed'], v => !v)
		},

		/********* 5.快捷键 *********/
		[ActionTypes.SHORT_CUT]							: () => state.updateIn(['flags', 'shortCut'], v => !v),
		[ActionTypes.CHANGE_JV_DIRECTION_BY_KEY]		: () => { //切换贷借方金额
			if(action.direction == 'debit'){
				state = state.setIn(['jvList', action.idx, 'jvdirection'],'credit')
			}else if(action.direction == 'credit'){
				state = state.setIn(['jvList', action.idx, 'jvdirection'],'debit')
			}
			if(state.getIn(['flags', 'focusRef']) == 'cr-'+action.idx){
				state = state.setIn(['flags', 'focusRef'],'de-' + action.idx)
			}else if(state.getIn(['flags', 'focusRef']) == 'de-'+action.idx){
				state = state.setIn(['flags', 'focusRef'],'cr-' + action.idx)
			}
			return count(state);
		},
		[ActionTypes.CHANGE_FOCUS_INPUT]				: () => {
			let focusRef = state.getIn(['flags', 'focusRef'])
			const currentFocusRef = focusRef.split('-') // 当前焦点输入框的相关信息
			const idx = Number(currentFocusRef[1])// 当前焦点输入框在第 idx 行

			if (action.ref === Limit.SHIFT_KEY_CODE){
				return state.updateIn(['flags', 'focusBack'], v => !v)
			}

			//asslist里如果有未填的项，焦点不变
			if (action.ref === Limit.ENTER_KEY_CODE) {
				if ((state.getIn(['jvList', idx, 'asslist']) || []).some(v => !v.get('assid'))){
					return state
				}
			}
			
			//点击时转换焦点
			if (typeof action.ref == 'string') {
				return state.setIn(['flags', 'focusRef'], action.ref)
			}

			//根据当前点击的是哪一类的input 来决定焦点input框的修改
			if (state.getIn(['flags', 'focusBack'])) {
				focusRef = ({
					'abstract' 	 : () => idx ? ['cr', idx - 1].join('-') : focusRef,
					'select'   	 : () => ['abstract', idx].join('-'),
					'amount' 	 : () => ['select', idx].join('-'),
					'price' 	 : () => ['amount', idx].join('-'),
					// 'de'	     : () => {
					// 	if (state.getIn(['jvList', idx, 'acunitOpen'])=='1') {
					// 		return ['price', idx].join('-')
					// 	}else{
					// 		return ['select', idx].join('-')
					// 	}
					// },
					'standardAmount'	: () =>	{
						if (state.getIn(['jvList', idx, 'acunitOpen'])=='1') {
							return ['price', idx].join('-')
						}else{
							return ['select', idx].join('-')
						}
					},
					'exchange'    		: () => ['standardAmount', idx].join('-'),
					'de'	     : () => {
						if (state.getIn(['jvList', idx, 'fcStatus'])=='1') { //判断外币是否存在
							return ['exchange', idx].join('-')
						}else if (state.getIn(['jvList', idx, 'acunitOpen'])=='1'){ //判断数量是否存在
							return ['price', idx].join('-')
						} else {
							return ['select', idx].join('-')
						}
					},
					'cr' 	   	: () => ['de', idx].join('-')

				}[currentFocusRef[0]])()
			} else {
				focusRef = ({
					'abstract' : () => ['select', idx].join('-'),
					'select'   : () => {
						// if(state.getIn(['jvList', idx, 'acunitOpen'])=='1'){
						// 	return ['amount', idx].join('-')
						// }else{
						// 	return ['de', idx].join('-')
						// }
						if(state.getIn(['jvList', idx, 'acunitOpen'])=='1'){
							return ['amount', idx].join('-')
						}else if(state.getIn(['jvList', idx, 'fcStatus'])=='1'){
							return ['standardAmount', idx].join('-')
						} else {
							return ['de', idx].join('-')
						}
					},
					'amount'   : () => ['price', idx].join('-'),
					// 'price'    : () => ['de', idx].join('-'),
					'price'    : () => {
						if(state.getIn(['jvList', idx, 'fcStatus'])=='1'){
							return ['standardAmount', idx].join('-')
						}else{
							return ['de', idx].join('-')
						}
					},
					'standardAmount'	: () =>	['exchange', idx].join('-'),
					'exchange'    		: () => ['de', idx].join('-'),
					'de'	  			: () => ['cr', idx].join('-'),
					'cr' 	   			: () => ['abstract', idx + 1].join('-')

				}[currentFocusRef[0]])()
			}

			if (focusRef.split('-')[0] == 'abstract') {
				if (state.getIn(['jvList', Number(focusRef.split('-')[1]), 'jvabstract']) == '') {
					state = state.setIn(['jvList', Number(focusRef.split('-')[1]), 'jvabstract'], state.getIn(['jvList', Number(focusRef.split('-')[1]-1), 'jvabstract']))
								.setIn(['jvList', Number(focusRef.split('-')[1]), 'copy'], !state.getIn(['jvList', Number(focusRef.split('-')[1]), 'copy']))
				}
			}
			// state = state.setIn(['jvList', Number(focusRef.split('-')[1]), 'copy'], !state.getIn(['jvList', Number(focusRef.split('-')[1]), 'copy']))
			return state.setIn(['flags', 'focusRef'], focusRef)
		},
		[ActionTypes.GET_LRPZ_IMPORT_PROGRESS]	             : () => {
			state = state.setIn(['importProgressInfo','message'],action.receivedData.message)
						 .setIn(['importProgressInfo','progress'],action.receivedData.data.progress)
						 .setIn(['importProgressInfo','successList'],fromJS(action.receivedData.data.successList))
						 .setIn(['importProgressInfo','failList'],fromJS(action.receivedData.data.failList))
						 .setIn(['importProgressInfo','timestamp'],fromJS(action.receivedData.data.timestamp))
						 .setIn(['importProgressInfo','accessToken'],fromJS(action.accessToken))
			return state
		},
		[ActionTypes.CHANGE_LRPZ_MESSAGEMASK]				     : () => {
			state = state.setIn(['importProgressInfo','message'],'')
						 .setIn(['importProgressInfo','progress'],0)
						 .setIn(['importProgressInfo','successList'],fromJS([]))
						 .setIn(['importProgressInfo','failList'],fromJS([]))
						 .setIn(['importProgressInfo','timestamp'],'')
						 .setIn(['importProgressInfo','accessToken'],'')
						 .setIn(['flags','showLrModalMask'], false)
			return state;
		},
	}[action.type] || (() => state))()
}

function count(state) {
	let creditTotal = 0,
		debitTotal = 0

	state.get('jvList').forEach(v => {
		if (v.get('jvdirection') == 'credit')
			creditTotal += Number(v.get('jvamount'))
		else if (v.get('jvdirection') == 'debit')
			debitTotal += Number(v.get('jvamount'))
	})

	state = state.setIn(['flags','creditTotal'], creditTotal ? creditTotal.toFixed(2).toString() : '0.00')
	state = state.setIn(['flags','debitTotal'], debitTotal ? debitTotal.toFixed(2).toString() : '0.00')
	return state.setIn(['flags', 'totalBalance'], Number((debitTotal - creditTotal).toFixed(2)))
}

// 数量、原币的符号总是与金额的符号保持一致
function changeMark(count, jvAmount) {
	let value = '';
	if (Number(jvAmount)<0 && count) {
		value = -Math.abs(count)
	} else if (Number(jvAmount)>0 && count) {
		value = Math.abs(count)
	} else {
		value = count
	}
	return value
}
