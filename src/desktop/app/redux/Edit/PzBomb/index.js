import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const pzBombState = fromJS({
	flags: {
		debitTotal: '0.00',//当前借方合计
		creditTotal: '0.00',//当前贷方合计
		voucherIndexList: [],
		voucherIdx: 0//当前voucher在可浏览的vclist 中的索引值，从cxpz到lrpz为该月的所有凭证，从mxb到lrpz则为当月相关科目的所有凭证
	},
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
	jvList: [
	// 	{
	// 	jvdirection: '',
	// 	jvabstract: '',
	// 	acid: '',
	// 	acfullname: '',
	// 	jvamount: '',
	// 	asslist: [],
	// 	acunitOpen: '0',	//是否开启数量核算
	// 	jvcount: '',	//数量
	// 	price: '',	//单价
	// 	jvunit: '',	//单位
	// 	fcStatus: '0',  //外币
	// 	fcNumber: '',
	// 	exchange: '',
	// 	standardAmount: ''

	// }, {
	// 	jvdirection: '',	//debit
	// 	jvabstract: '',
	// 	acid: '',
	// 	acfullname: '',
	// 	jvamount: '',
	// 	asslist: [],
	// 	acunitOpen: '0',
	// 	jvcount: '',
	// 	price: '',
	// 	jvunit: '',
	// 	fcStatus: '0',  //外币
	// 	fcNumber: '',
	// 	exchange: '',
	// 	standardAmount:''
	// }, {
	// 	jvdirection: '',
	// 	jvabstract: '',
	// 	acid: '',
	// 	acfullname: '',
	// 	jvamount: '',
	// 	asslist: [],
	// 	acunitOpen: '0',
	// 	jvcount: '',
	// 	price: '',
	// 	jvunit: '',
	// 	fcStatus: '0',  //外币
	// 	fcNumber: '',
	// 	exchange: '',
	// 	standardAmount:''
	// }, {
	// 	jvdirection: '',
	// 	jvabstract: '',
	// 	acid: '',
	// 	acfullname: '',
	// 	jvamount: '',
	// 	asslist: [],
	// 	acunitOpen: '0',
	// 	jvcount: '',
	// 	price: '',
	// 	jvunit: '',
	// 	fcStatus: '0',  //外币
	// 	fcNumber: '',
	// 	exchange: '',
	// 	standardAmount:''
	// }
	],
	enclosureList: [],	//上传图片

})

export default function handlePzBomb(state = pzBombState, action) {
	return ({
		[ActionTypes.INIT_PZ_BOMB]						: () => {

			let jvlist = action.receivedData.jvlist
			if (jvlist.length < 5) {
				let length = jvlist.length
				let addList = []
				for (let i = 0; i < 5-length; i++) {
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
			state = state.set('jvList', fromJS(jvlist))

			return state = count(state)
			.set('createdBy', action.receivedData.createdby)
			.set('closedBy', action.receivedData.closedby)
			.set('reviewedBy', action.receivedData.reviewedby)
			.set('vcDate', action.receivedData.vcdate)
			.set('vcIndex', action.receivedData.vcindex)
			.set('year', action.receivedData.year)
			.set('month', action.receivedData.month)
			.set('createdTime', action.receivedData.createdtime)
			.set('modifiedTime', action.receivedData.modifiedtime)
			.set('enclosureList', fromJS(action.receivedData.enclosureList))
			.set('enclosureCountUser', action.receivedData.enclosureCountUser)
			.setIn(['flags', 'voucherIndexList'], action.voucherIndexList)
			.setIn(['flags', 'voucherIdx'], action.voucherIdx)
			.set('receivedData', fromJS(action.receivedData))
			// .update('jvList', v => pzBombState.get('jvList').merge(v))
		},
		/*  凭证审核  */
		[ActionTypes.PZBOMB_REVIEWEDBY_VC]					: () => state.set('reviewedBy', action.reviewedBy).setIn(['receivedData','reviewedby'], action.reviewedBy),
		/*  凭证反审核  */
		[ActionTypes.CANCEL_PZBOMB_REVIEWEDBY_VC]			: () => state.set('reviewedBy', '').setIn(['receivedData','reviewedby'], ''),

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
