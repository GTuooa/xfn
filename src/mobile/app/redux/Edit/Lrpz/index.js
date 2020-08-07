import { fromJS, toJS }	from 'immutable'
import thirdParty from 'app/thirdParty'
import { showMessage, DateLib } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

const lrpzState = fromJS({
	flags:{
		selectComponentDisplay: false,
		jvSelectedIdx: 0,
		debitTotal: '0.00',
		creditTotal: '0.00',
		showckpz: false,
		vcindexList: [],
		vcIdx: 0,//当前voucher在可浏览的vclist 中的索引值，从cxpz到lrpz为该月的所有凭证，从mxb到lrpz则为当月相关科目的所有凭证
		locked: '',
		currencyList:[],  //外币列表
		currencyListArr:[]	//外币－－只有编码
	},
	oldvcindex: '',
	oldyear: '',
	oldmonth: '',
	oldvcdate: '',
	vcindex: '',
	year: '',
	month: '',
	vcdate: '',
	createdtime: '',
    modifiedtime: '',
	createdby: '',
	exchange: '',
	closeby: '',
    reviewedby: '',
	enclosureCountUser: '',
	jvlist: [{
		jvdirection: 'debit',
		jvabstract: '',
		acid: '',
		acname: '',
		acfullname: '',
		jvamount: '',
		asslist: [],
		acunitOpen: '0',	//是否开启数量核算
		jvcount: '',		//数量
		price: '',		    //单价
		jvunit: '',		    //单位
		fcStatus: '0',  //外币
		fcNumber: '',
		exchange: '',
		standardAmount: ''
	}],
	vckey: 0,  //后台传来的草稿的标识
	enclosureList: [],	//上传附件
	// previewImageList:[], //预览的地址
	label:[],//附件标签
	needDeleteUrl:[],//需要删除的图片地址
	vcList:[]
})

export default function handle(state = lrpzState, action) {
	return ({
		[ActionTypes.INIT_LRPZ]				: () => lrpzState.set('year', state.get('year')).set('month', state.get('month')).set('vcdate', state.get('vcdate')).set('vcindex', state.get('vcindex')),
		[ActionTypes.SET_CKPZ_IS_SHOW] 		: () => state.setIn(['flags', 'showckpz'], action.bool),
		[ActionTypes.CHANGE_SELECT_COMPONENT_DISPLAY]: () => state.updateIn(['flags', 'selectComponentDisplay'], v => !v),
		[ActionTypes.SELECT_JV]				: () => state.setIn(['flags', 'jvSelectedIdx'], action.idx),
		[ActionTypes.INSERT_JV]				: () => {
			const handleState = count(state)
			//计算借贷差
			// js浮点数计算bug：避免两个小数相减出现多位小数
			const balance = handleState.getIn(['flags', 'debitTotal']) - handleState.getIn(['flags', 'creditTotal'])

			//插入分录，并保持凭证借贷平衡
			return count(state.update('jvlist', v => v.insert(action.idx + 1,
				v.get(action.idx)
				.update('jvdirection', v => balance > 0 ? 'credit' : 'debit')
				.set('jvamount', Math.abs(balance).toFixed(2) - 0 || '')
				.set('acid', '')
				.set('acname', '')
				.set('acfullname', '')
				.set('asslist', [])
				.set('acunitOpen', '0')
				.set('jvcount', '')
				.set('price', '')
				.set('jvunit', '')
				.set('fcStatus', '0')
				.set('fcNumber', '')
				.set('exchange', '')
				.set('standardAmount', '')

			)))
		},
		[ActionTypes.DELETE_JV]				: () => count(state.get('jvlist').size > 1 ? state.deleteIn(['jvlist', action.idx]) : state),
		[ActionTypes.DELETE_JV_ALL]			: () => count(state.update('jvlist',v => v.clear())),
		[ActionTypes.CHANGE_VC_ID]			: () => state.set('vcindex', Number(action.vcindex)),
		[ActionTypes.CHANGE_JV_ABSTRACT]	: () => state.setIn(['jvlist', action.idx, 'jvabstract'], action.jvabstract),
		[ActionTypes.CHANGE_JV_ACID_AND_ACNAME_AND_ASSCATEGORYLIST]: () => {

			const asslist = action.asscategorylist.map(v => fromJS({
				assid: '',
				assname: '',
				asscategory: v
			}))

			//console.log('asslist----------', asslist)
			return state.updateIn(['jvlist', action.idx], v =>
				v.set('acid', action.acid)
				.set('acfullname', action.acfullname)
				.set('acname', action.acname)
				.set('asslist', asslist)

			)
		},
		[ActionTypes.CHANGE_JV_AMOUNT]	     : () => {
			if ((/^[-\d]\d*\.?\d{0,2}$/g.test(action.jvamount)) || action.jvamount === '' ) {
				state = state.setIn(['jvlist', action.idx, 'jvamount'], action.jvamount)
				state = count(state)
			}
			return state
		},
		[ActionTypes.CHANGE_JV_DIRECTION]    : () => count(state.updateIn(['jvlist', action.idx, 'jvdirection'], v => v == 'credit' ? 'debit' : 'credit')),
			// 修改jv的辅助核算列表中的相关类别的assid 以及assname
		[ActionTypes.CHANGE_JV_ASSID_AND_ASSNAME]: () => state.updateIn(['jvlist', action.idx, 'asslist'], v => v.map(w => w.get('asscategory') == action.asscategory ? w.set('assid', action.assid).set('assname', action.assname) : w)),
		[ActionTypes.PUSH_VOUCHER_TO_LRPZ_REDUCER]: () => {
			if (!action.voucher)
				return state
			const voucher = fromJS(action.voucher)
			return count(
				state.merge(voucher)
					.set('oldvcindex', voucher.get('vcindex'))
					.set('oldyear', voucher.get('year'))
					.set('oldmonth', voucher.get('month'))
					.set('oldvcdate', voucher.get('vcdate'))
			)
		},
		[ActionTypes.GET_LAST_VC_ID_FETCH]    : () => state.set('month', action.vcdate.getMonth())
													.set('year', action.vcdate.getYear())
													.set('vcdate', action.vcdate.toString())
													.set('vcindex', action.receivedData.data),
													// .set('vcindex', action.receivedData.data + 1),
		[ActionTypes.MODIFY_VCDATE]			  : () => {
			const oldvcdate = state.get('oldvcdate')
			const date = action.date
			// if (oldvcdate.indexOf(date.substr(0,7)) === 0) {
			// 	state = state.set('vcdate', date.toString())
			// } else {
			// 	thirdParty.Alert({
			// 		message: '不允许跨月修改凭证',
			// 		buttonName: '确认'
			// 	})
			// }
			return state.set('vcdate', date.toString())
		},
		[ActionTypes.ENTER_JVITEM_FETCH]      : () => {
			// thirdparty.toast({icon: 'success', text:'保存成功'})
			const data = action.data

			if (sessionStorage.getItem('lrpzHandleMode') === 'modify')
				state = state.setIn(['flags', 'showckpz'], true)

			if (sessionStorage.getItem('lrpzHandleMode') === 'insert')
				state = state.set('createdtime', action.createdtime).set('createdby', action.createdby)

			if (action.refresh) {
				state = count(state.set('jvlist', lrpzState.get('jvlist')).set('vcindex', action.NewVcIndex))
				// setTimeout(() => window.location.reload(), 0)
			}

			return state.set('vckey', 0).set(['flags', 'locked', ''])
		},
		[ActionTypes.REVIEWED_JVLIST]				: () => state.set('reviewedby', action.reviewedby),
		[ActionTypes.CANCEL_REVIEWED_JVLIST]		: () => state.set('reviewedby', ''),
		// 草稿
		[ActionTypes.DRAFT_SAVE_FETCH] 				: () => state.set('vckey', action.receivedData),
		[ActionTypes.GET_DRAFT_ITEM_FETCH] : () => {
			if (action.judgeLocked) { //已锁定
				state = lrpzState.set('vcindex', action.receivedData+1)
						.set('vcdate', action.vcDate.toString())
						.set('year', action.vcDate.getYear())
						.set('month', action.vcDate.getMonth())
			} else { //未锁定
				state = lrpzState.set('vcindex', action.getDraftItem.vcindex)
						.set('vcdate', action.getDraftItem.vcdate)
						.set('year', action.getDraftItem.year)
						.set('month', action.getDraftItem.month)
			}
			return count (state.set('jvlist', fromJS(action.getDraftItem.jvlist))
						.set('vckey', action.getDraftItem.vckey)
						.set('enclosureCountUser', action.getDraftItem.enclosureCountUser)
						.setIn(['flags', 'locked'], action.getDraftItem.locked)
						.setIn(['flags', 'showckpz'], true))
        },
		[ActionTypes.LRPZ_LOCE_DRAFT]				: () => state.setIn(['flags', 'locked'], '1'),
		[ActionTypes.LRPZ_UN_LOCE_DRAFT]			: () => state.setIn(['flags', 'locked'], '0'),
		// 数量核算
		[ActionTypes.GET_AMOUNT_DATA]				: () => {

			state = state.setIn(['jvlist', action.idx, 'jvunit'], action.receivedData.acunit)
					.setIn(['jvlist', action.idx, 'acunitOpen'], action.receivedData.acunitOpen)
					.setIn(['jvlist', action.idx, 'jvcount'], '')

			if (!state.getIn(['jvlist', action.idx, 'jvdirection'])) { //没有方向在把获取的方向添加进去
			  state = state.setIn(['jvlist', action.idx, 'jvdirection'], action.receivedData.direction)
			}
			if (action.receivedData.price == 0) {
				state = state.setIn(['jvlist', action.idx, 'price'], '')
			} else {
				state = state.setIn(['jvlist', action.idx, 'price'], action.receivedData.price)
			}
			return state;

			// if (action.receivedData.acunitOpen == "1") {
			//    state = state.setIn(['jvlist', action.idx, 'jvunit'], action.receivedData.acunit)
			// 		   .setIn(['jvlist', action.idx, 'price'], action.receivedData.price)
			// 		   .setIn(['jvlist', action.idx, 'acunitOpen'], action.receivedData.acunitOpen)
			//
			//    if (!state.getIn(['jvlist', action.idx, 'jvdirection'])) { //没有方向在把获取的方向添加进去
			// 	 state = state.setIn(['jvlist', action.idx, 'jvdirection'], action.receivedData.direction)
			//    }
			//    return state;
			//  } else {
			//    state = state.setIn(['jvlist', action.idx, 'jvunit'],'')
			// 		   .setIn(['jvlist', action.idx, 'price'],'')
			// 		   .setIn(['jvlist', action.idx, 'acunitOpen'],'0')
			 //
			//    if (!state.getIn(['jvlist', action.idx, 'jvdirection'])) { //没有方向在把获取的方向添加进去
			// 	 state = state.setIn(['jvlist', action.idx, 'jvdirection'], action.receivedData.direction)
			//    }
			//    return state;
			//  }
		},
		[ActionTypes.CHANGE_JV_COUNT]				: () => {
			const reg = new RegExp("^[-\\d]\\d*\\.?\\d{0," + Number(action.unitDecimalCount) + "}$","g")
			// if ((reg.test(action.jvCount)) || action.jvCount === '' ) {
				if(Number(action.jvCount) > 1000000 || Number(action.jvCount) < -1000000){
					return alert(`数量不能超过${Limit.LRPZ_COUNT_LENGTH}位`);
				}
				return state.setIn(['jvlist', action.idx, 'jvcount'], action.jvCount)
			// }
			// return state
		},
		[ActionTypes.CHANGE_JV_PRICE]				: () => {
			if ((/^[-\d]\d*\.?\d{0,2}$/g.test(action.jvPrice)) || action.jvPrice === '' ) {
				if(Number(action.jvPrice) < 0){
					alert('单价不允许为负数')
					action.jvPrice = -Number(action.jvPrice)
				}
				if( Number(action.jvPrice) > 1000000000 || Number(action.jvPrice) < -1000000000){
					return alert(`单价不能超过${Limit.LRPZ_PRICE_LENGTH}位`);
				}
				return state.setIn(['jvlist', action.idx, 'price'], action.jvPrice)
			}
			return state
		},
		[ActionTypes.AUTO_CALCULATE]				: () => {
			let price = state.getIn(['jvlist', action.idx, 'price']);
			let jvCount = state.getIn(['jvlist', action.idx, 'jvcount']);
			let jvAmount = state.getIn(['jvlist', action.idx, 'jvamount']);
			if(action.value=="count" || action.value=="price"){	//数量或单价的值发生改变
				if(Number(jvCount) && Number(price)){	//数量和单价都有值－－计算金额
					// 数量的符号总是与金额的符号保持一致
					if(Number(jvAmount)<0 && jvCount){
						jvCount = -Math.abs(jvCount);
					}else if(Number(jvAmount)>0 && jvCount){
						jvCount = Math.abs(jvCount);
					}
					// 数量小数点的位数
					if(Number(jvCount)%1 == 0){	//整数或带.00的数
						jvCount = Math.floor(jvCount);	//去掉无意义的0
					}else{
						jvCount=parseFloat(Number(jvCount).toFixed(2));
					}
					// 价格小数点的位数
					if(Number(price)%1 == 0){
						price = Math.floor(price);
					}else{
						price = parseFloat(Number(price).toFixed(2));
					}
					state = state.setIn(['jvlist', action.idx, 'price'],price)
								.setIn(['jvlist', action.idx, 'jvcount'],jvCount)
								.setIn(['jvlist', action.idx, 'jvamount'], (jvCount * price).toFixed(2))
				}else {
					if(price == '' && jvCount && jvAmount){ //三者都有值后 用户把单价置为空－－计算单价
						price = jvAmount/jvCount;
						// 确定价格小数点的位数
						if(Number(price)%1 == 0){
							price = Math.floor(price);
						}else{
							price = parseFloat(Number(price).toFixed(2));
						}
						state = state.setIn(['jvlist', action.idx, 'price'],price)
					}else if(jvCount == '' && price && jvAmount){	//三者都有值后 用户把数量置为空－－计算数量
						jvCount = parseFloat((jvAmount/price).toFixed(action.unitDecimalCount))
						// 数量小数点的位数
						if(Number(jvCount)%1 == 0){
							jvCount = Math.floor(jvCount)
						}
						state = state.setIn(['jvlist', action.idx, 'jvcount'],jvCount)
					}else if(!(jvCount == 0) && jvAmount){	//数量，总额有值－－计算单价
						price = jvAmount/jvCount
						// 确定价格小数点的位数
						if(Number(price)%1 == 0){
							price = Math.floor(price)
						}else{
							price = parseFloat(Number(price).toFixed(2));
						}
						state = state.setIn(['jvlist', action.idx, 'price'], price)
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
					price = jvAmount/jvCount;
					// 确定价格小数点的位数
					if(Number(price)%1 == 0){
						price = Math.floor(price);
					}else{
						price=parseFloat(Number(price).toFixed(2));
					}
					state = state.setIn(['jvlist', action.idx, 'price'],price)
								.setIn(['jvlist', action.idx, 'jvcount'],jvCount)
				}else{
					return state;
				}
			}
			return count(state);
		},
		[ActionTypes.CLEAR_AC_UNIT_OPEN] : () => {
			return state.setIn(['jvlist', action.idx, 'acunitOpen'], '0')

		},
		[ActionTypes.GET_FJ_DATA] : () => {
			if (!action.receivedData)
				return state
			const voucher = fromJS(action.receivedData)
			// let previewImageList=[];
			// voucher.get('enclosureList').map(v=>{
			// 	if(v.get('imageOrFile')=='TRUE'){
			// 		previewImageList.push(v.get('enclosurepath'))
			// 	}
			// })
			// previewImageList=previewImageList.slice(0,9);
			return count(
				state.merge(voucher)
					.set('oldvcindex', voucher.get('vcindex'))
					.set('oldyear', voucher.get('year'))
					.set('oldmonth', voucher.get('month'))
					.set('oldvcdate', voucher.get('vcdate'))
					// .set('previewImageList', fromJS(previewImageList))
			)

		},
		[ActionTypes.CHANGE_ENCLOSURE_LIST]		: () => {//修改上传图片的信息
			let enclosureList=[];
			state.get('enclosureList').map(v=>{
				enclosureList.push(v)
			})
			action.imgArr.forEach(v=>{
				enclosureList.push(v)
			})
			enclosureList=enclosureList.slice(0,9);
			state=state.set('enclosureList', fromJS(enclosureList))
						.set('enclosureCountUser', enclosureList.length)

			// let previewImageList=[];
			// state.get('enclosureList').map(v => {
			// 	if (v.get('imageOrFile') == 'TRUE') {
			// 		previewImageList.push(v.get('enclosurepath'))
			// 	}
			// })
			// previewImageList=previewImageList.slice(0,9);
			// state=state.set('previewImageList', fromJS(previewImageList))

			// if(action.length === state.get('enclosureCountUser') || state.get('enclosureCountUser') === 9){
            //     thirdParty.toast.hide()
            // }
            return state
		},

		[ActionTypes.DELETE_UPLOAD_IMG_URL]		: () => {//删除上传的图片
			state.get('enclosureList').map((v,i)=>{
				if(i==action.index){
					state=state.deleteIn(['enclosureList',i])
				}
			})
			// let previewImageList=[];
			// state.get('enclosureList').map(v=>{
			// 	if (v.get('imageOrFile') == 'TRUE') {
			// 		previewImageList.push(v.get('enclosurepath'))
			// 	}
			// })
			// previewImageList=previewImageList.slice(0,9);
			state=state.set('enclosureCountUser', state.get('enclosureList').size)
					// .set('previewImageList', fromJS(previewImageList))

			return state;
		},
		[ActionTypes.GET_UPLOAD]			: () => { //获取上传的附件
			state = state.set('enclosureList',fromJS(action.receivedData));
			return state;
		},
		[ActionTypes.CHANGE_VC_ENCLOSURE_COUNT_USER] : () => state.set('enclosureCountUser', action.value),
		[ActionTypes.GET_LABEL_FETCH]	: () => { //获取附件的标签
			let label = [];
			action.receivedData.data.forEach((v,i)=>{
				label.push({key:v,value:i})
			})
			state=state.set('label',label)
			return state;
		},
		[ActionTypes.CHANGE_TAG_NAME]				: () => { //编辑标签名称
			state.get('enclosureList').map((v,i)=>{
				if(i == action.index){
					state = state.setIn(['enclosureList',i,'label'],action.value)
				}
			})
			return state;
		},
		/********* 外币核算 *********/
		[ActionTypes.GET_FC_LIST_DATA_FETCH]		: () =>	{
			const receivedData = fromJS(action.receivedData)
			let currencyListArr = []
			receivedData.map((u,i) => {
				return currencyListArr.push(u.get('fcNumber'))
			})

			const item = receivedData.filter(v => v.get('standard') == '1')
			const fcNumber = item.getIn([0, 'fcNumber'])
			const exchange = item.getIn([0, 'exchange'])

			if (action.idx != 'modify') {
				state = state.setIn(['jvlist', action.idx, 'fcStatus'], '1')
				.setIn(['jvlist', action.idx, 'fcNumber'], fcNumber)
				.setIn(['jvlist', action.idx, 'exchange'], exchange)
				.setIn(['jvlist', action.idx, 'jvdirection'], 'debit')
			}
			return state.setIn(['flags', 'currencyList'], receivedData).setIn(['flags', 'currencyListArr'], currencyListArr)
		},
		[ActionTypes.CLEAR_FC_LIST_DATA]			: () => state.setIn(['jvlist', action.idx, 'fcStatus'], '0').setIn(['jvlist', action.idx, 'fcNumber'], '').setIn(['jvlist', action.idx, 'exchange'], '').setIn(['jvlist', action.idx, 'standardAmount'], ''),
		[ActionTypes.CHANGE_JV_NUMBER]				: () => state.setIn(['jvlist', action.idx, 'fcNumber'], action.fcNumber).setIn(['jvlist', action.idx, 'exchange'], action.exchange),
		[ActionTypes.CHANGE_JV_EXCHANGE]		: () => {
			if ((/^\d*\.?\d{0,4}$/g.test(action.value)) || action.value === '' ) {
				return state.setIn(['jvlist', action.idx, 'exchange'], action.value)
			}
			return state
		},
		[ActionTypes.CHANGE_JV_STANDARDAMOUNT]		: () => {
			if ((/^[-\d]\d*\.?\d{0,2}$/g.test(action.value)) || action.value === '' ) {
				return state.setIn(['jvlist', action.idx, 'standardAmount'], action.value)
			}
			return state
		},
		[ActionTypes.AUTO_CALCULATE_ALL]				: () => {

			let price = state.getIn(['jvlist', action.idx, 'price'])
			let jvCount = state.getIn(['jvlist', action.idx, 'jvcount'])
			let standardAmount = state.getIn(['jvlist', action.idx, 'standardAmount'])
			let exchange = state.getIn(['jvlist', action.idx, 'exchange'])
			let jvAmount = state.getIn(['jvlist', action.idx, 'jvamount'])

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
						state = state.setIn(['jvlist', action.idx, 'exchange'], exchange)

					}
					// else if(standardAmount == '' && exchange && jvAmount ){	//三者都有值后 用户把原币置为空－－计算原币
					// 	standardAmount = parseFloat((jvAmount/exchange).toFixed(2))
					//
					// }
					else if(standardAmount && jvAmount){	//原币，金额有值－－计算汇率
						exchange = jvAmount/standardAmount

					}
					// else{
					// 	state = state
					// }
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

			state = state.setIn(['jvlist', action.idx, 'standardAmount'], standardAmount === 0 ? '' : standardAmount)
						.setIn(['jvlist', action.idx, 'exchange'], exchange)
						.setIn(['jvlist', action.idx, 'price'], price)
						.setIn(['jvlist', action.idx, 'jvcount'], jvCount)
						.setIn(['jvlist', action.idx, 'jvamount'], jvAmount)
			return count(state)
		},
		[ActionTypes.SET_LRPX_VCLIST]:()=>{
			return state.set("vcList",action.vcList)
		}



	}[action.type] || (() => state))()
}


function count(state) {
	let creditTotal = 0,
		debitTotal = 0
	state.get('jvlist').map(v => {
		if (v.get('jvdirection') === 'credit')
			creditTotal = creditTotal + Number(v.get('jvamount'))
		else if (v.get('jvdirection') === 'debit')
			debitTotal = debitTotal + Number(v.get('jvamount'))
	})
	state = state.setIn(['flags','creditTotal'], creditTotal ? creditTotal.toFixed(2).toString() : '0.00')
	state = state.setIn(['flags','debitTotal'], debitTotal ? debitTotal.toFixed(2).toString() : '0.00')
	return state
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
