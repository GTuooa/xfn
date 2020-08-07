import * as ActionTypes	from './ActionTypes.js'
import { fromJS } from 'immutable'

//生产环境应当设置为空
const tcxqState = fromJS({
	views: {
		orderItemStatus: false,
		orderItemStatusFals: false,
		applyStatus: false,
		selectAllStatus: false,
		avtiveItemId: [],
		showOrderInfoStatus: false,
		billMessageStatus: false,
		showSuccessSubmit: false,
		showPrompt: false,
		orderNoList: [],
		//orderItemStatus:[{{'indexId':i,'isInvoice':false,'orderNo':v.get('orderNo')}},{},{}...]－－所有发票的信息
		//orderItemStatusFalse:[indexId]--所有未开发票在数据中的位置信息
		invoice:{//填写的发票信息
			// invoiceType: "增值税普通发票",//发票类型
			invoiceTitle: '', //发票抬头
			dutyId: '', //税号
			email: '', //邮箱
			//   bank:'',//开户银行
			//   bankAccount:'',//开户账号
			//   registeredAddress:'',//注册地址
			//   registeredTel:'',//注册电话
			//   receiveAddress:'',//寄送地址
			//   receiver:'',//收件人
			telephone: '',//联系电话
			remark: ''//备注
		},
		invoiceStatus:{//填写的发票的提示信息的状态
			// invoiceType:true,//发票类型
			invoiceTitleStatus:true,//发票抬头
			dutyIdStatus:true,//税号
			//   bankStatus:true,//开户银行
			//   bankAccountStatus:true,//开户账号
			//   registeredAddressStatus:true,//注册地址
			//   registeredTelStatus:true,//注册电话
			//   receiveAddressStatus:true,//寄送地址
			//   receiverStatus:true,//收件人
			telephoneStatus:true,//联系电话
			emailStatus: true, //邮箱
			remarkStatus:true//备注
		},
		invoiceFormatStatus:{//填写的发票的格式错误的提示信息的状态
			dutyIdStatus:true,//税号
			bankAccountStatus:true,//开户账号
			registeredTelStatus:true,//注册电话
			telephoneStatus:true,//联系电话
			emailStatus: true, //邮箱
		},
		invoiceMessage: { //显示订单详情
			orderNo: '',
			orderTime: '',
			tradeStatus: '',
			activateAmount: '',
			validTime: '',
			payAmount: '',
			isInvoice: '',
			isRefund: '',
			createName: '',
			orderType: '',
			payTime: '',
			payMonth: '',
			invoice: {
				invoiceType: '', //发票类型
				invoiceTitle: '', //发票抬头
				dutyId: '', //税号
				//   bank: '', //开户银行
				//   bankAccount: '', //开户账号
				//   registeredAddress: '', //注册地址
				//   registeredTel: '', //注册电话
				//   receiveAddress: '', //寄送地址
				//   receiver: '', //收件人
				telephone: '', //联系电话
				email: '',
				remark: '' //备注
			}
		}
    },
	data: {
        corpInfo: {
			"corpId": "",
			"corpName": "",
			"equityList": [],
			"invalidEquityList": [],
			"orderInfoList": [],
		}
	}
})

export default function handleHome(state = tcxqState, action) {
	return ({
		[ActionTypes.GET_ADMIN_CORPINFO_EQUITY]			   : () => {

			state = tcxqState.setIn(['data', 'corpInfo'], fromJS(action.receivedData))

			let orderItemStatus = []  //每一条订单的一些状态
            let orderItemStatusFalse = []  //值是所有未开发票的订单在数据中下标
			state.getIn(['data', 'corpInfo', 'orderInfoList']).map((v,i) => {   //把所有发票的数据存入orderItemStatus中包括indexId，isInvoice,orderNo
                orderItemStatus.push({
                    'indexId': i,
                    'checkboxDisplay': false,
                    'orderNo': v.get('orderNo'),
                    'payAmount': v.get('payAmount'),
                    'orderType': v.get('orderType')
                })
                if (v.get('isInvoice') == "NO" && v.get('tradeStatus') !== 'WAIT_BUYER_PAY' && v.get('isRefund') == "NO"){
                    orderItemStatusFalse.push(i)
                }
			})
            return state.setIn(['views', 'orderItemStatus'], fromJS(orderItemStatus))
                .setIn(['views', 'orderItemStatusFalse'], fromJS(orderItemStatusFalse))
                .setIn(['views', 'invoice'], tcxqState.getIn(['views', 'invoice']))
                .setIn(['views', 'invoice', 'invoiceType'], "增值税普通发票")
                .setIn(['views', 'billMessageStatus'],false)
                .setIn(['views', 'applyStatus'], true)
                .setIn(['views', 'selectAllStatus'],false)
                .setIn(['views', 'showSuccessSubmit'], false)
        },

		[ActionTypes.SHOW_ORDER_INFO]               	   : () => {
			return state.setIn(['views', 'invoiceMessage'], state.getIn(['data', 'corpInfo', 'orderInfoList', action.idx])).setIn(['views', 'showOrderInfoStatus'], true)
		},

		[ActionTypes.CANCEL_SHOW_ORDER_INFO]               : () => {
			return state.setIn(['views', 'showOrderInfoStatus'], false)
		},
		[ActionTypes.CANCEL_WAIT_PAY_ORDER]                : () => {
			return state.setIn(['views', 'showOrderInfoStatus'], false)
		},

		[ActionTypes.SELECT_ONE_BUTTON_ORDER]           : () =>{
            // 单击单个按钮后当前状态取反
            state.getIn(['views', 'orderItemStatus']).map((v,i) => {
                if (v.get('indexId') == action.itemID) {
                    state = state.setIn(['views', 'orderItemStatus', action.itemID, 'checkboxDisplay'], !state.getIn(['views', 'orderItemStatus', action.itemID, 'checkboxDisplay']))
                }
            })

            if (state.getIn(['views', 'orderItemStatus']).some(v => v.get("checkboxDisplay"))) {
                //只要orderItemStatus中的状态有真，就返回false（可见状态）来改变applyStatus的状态
                state = state.setIn(['views', 'applyStatus'], false)
            } else {
                //如果orderItemStatus中的状态全为假，就使全选按钮未选中
                state = state.setIn(['views', 'selectAllStatus'], false).setIn(['views', 'applyStatus'], true)
            }
             //获取选中的每个item的状态的数据的ID
            let avtiveItemId = [];
            state.getIn(['views', 'orderItemStatus']).map((v,i) => {
                if(v.get('checkboxDisplay')){
                  avtiveItemId.push({
                      'orderNo': v.get("orderNo"),
                      'payAmount': v.get("payAmount")
                  })
                }
             })
             state = state.setIn(['views', 'avtiveItemId'],fromJS(avtiveItemId))
             return state
        },

		[ActionTypes.SELECT_ALL_BUTTON_ORDER]           : () => {
            // 单击全选按钮后当前状态取反
            state = state.setIn(['views', 'selectAllStatus'], !state.getIn(['views', 'selectAllStatus']))
            state.getIn(['views', 'orderItemStatus']).map((v,i) => {
                state.getIn(['views', 'orderItemStatusFalse']).map((value) => {
                    //把所有的未激活的checkboxDisplay变为和selectAllStatus的状态一样
                    if(value == i){
                        state = state.setIn(['views', 'orderItemStatus', i, 'checkboxDisplay'], state.getIn(['views', 'selectAllStatus']))
                    }
                })
            })

			if (state.getIn(['views', 'orderItemStatus']).some(v => v.get("checkboxDisplay"))) {
                //只要orderItemStatus中的状态有真，就返回false（可见状态）来改变applyStatus的状态
                state = state.setIn(['views', 'applyStatus'], false)
            } else {
                //如果orderItemStatus中的状态全为假，就使全选按钮未选中
                state = state.setIn(['views', 'selectAllStatus'], false).setIn(['views', 'applyStatus'], true)
            }

            //获取选中的每个item的状态的数据的orderNo和payAmount
			let avtiveItemId = [];
            state.getIn(['views', 'orderItemStatus']).map((v,i) => {
                if(v.get('checkboxDisplay')){
					avtiveItemId.push({
						'orderNo': v.get("orderNo"),
						'payAmount': v.get("payAmount")
					})
                }
            })
			state = state.setIn(['views', 'avtiveItemId'], fromJS(avtiveItemId))
			return state
        },

		[ActionTypes.CANCEL_SELECT_ALL_BUTTON_ORDER]           : () => {

			state = state.setIn(['views', 'avtiveItemId'], fromJS([]))
						.updateIn(['views', 'orderItemStatus'], v => v.map(w => w.set('checkboxDisplay', false)))
						.setIn(['views', 'applyStatus'], true)
			return state
		},

		[ActionTypes.SOW_BILL_MESSAGE]                   : () => state.setIn(['views', 'billMessageStatus'], true),

		[ActionTypes.CLOSE_BILL_MESSAGE]            : () => {
            return state.setIn(['views', 'invoice'], tcxqState.getIn(['views', 'invoice']))     //清空发票信息
						.setIn(['views', 'invoiceStatus'], tcxqState.getIn(['views', 'invoiceStatus']))  //清空发票信息的提示状态
						.setIn(['views', 'invoiceFormatStatus'], tcxqState.getIn(['views', 'invoiceFormatStatus']))  //清空格式错误的提示状态
						.setIn(['views', 'invoice','invoiceType'], "增值税普通发票")
						.setIn(['views', 'billMessageStatus'], false)
        },

		// [ActionTypes.SHOW_PROMPT]                      : () => state.setIn(['views', 'showPrompt'], true).setIn(['views', 'orderNoList'], action.orderNoList).setIn(['views', 'invoice'], action.invoice),
		// [ActionTypes.SHOW_PROMPT]                      : () => state.setIn(['views', 'orderNoList'], action.orderNoList).setIn(['views', 'invoice'], action.invoice),
        // [ActionTypes.CLOSE_SHOW_PROMPT]                : () => state.setIn(['views', 'showPrompt'], false),

		[ActionTypes.SHOW_EMAIL_ORDER]                 : () => state.setIn(['views', 'invoiceFormatStatus', 'emailStatus'], false),
		[ActionTypes.SHOW_TELEPHONE_ORDER]             : () => state.setIn(['views', 'invoiceFormatStatus','telephoneStatus'],false),
		[ActionTypes.SHOW_DUTY_ID_ORDER]               : () => state.setIn(['views', 'invoiceFormatStatus','dutyIdStatus'],false),
		[ActionTypes.SHOW_INVOICE_STATUS]              : () => { //显示字段为空的提示信息
            state = state.setIn(['views', 'invoiceStatus'], state.getIn(['views', 'invoiceStatus']).map((value, i) => {
                for (let v in state.getIn(['views', 'invoice']).toJS()){
                    if(v+"Status" == i){
                        if(state.getIn(['views', 'invoice']).toJS()[v] == ''){
                            return value = false;
                        }else{
                            return value;
                        }
                    }
                }
            }))
            return state
		},
		[ActionTypes.CHANGE_INVOICE_TITLE_ORDER]           : () =>{//改变invoiceTitle的值
			if(action.value == ""){//判断是否有空值
				state = state.setIn(['views', 'invoiceStatus', 'invoiceTitleStatus'], false)
			}else{
				state = state.setIn(['views', 'invoiceStatus', 'invoiceTitleStatus'], true)
			}
			return state.setIn(['views', 'invoice', 'invoiceTitle'], action.value);
		},
		[ActionTypes.CHANGE_DUTY_ID_ORDER]                  : () => { //改变dutyId的值
			if (action.value == "") { //判断是否有空值
				state = state.setIn(['views', 'invoiceStatus', 'dutyIdStatus'], false)
							.setIn(['views', 'invoiceFormatStatus', 'dutyIdStatus'], true) //隐藏格式错误的提示
			} else {
				state = state.setIn(['views', 'invoiceStatus', 'dutyIdStatus'], true)
				//  if(/^\d{15}|\d{18}|\d{20}$/.test(action.value)){ //格式正确
				if (/[0-9A-Z]{15}|[0-9A-Z]{18}|[0-9A-Z]{20}/.test(action.value)) { //格式正确
					state = state.setIn(['views', 'invoiceFormatStatus', 'dutyIdStatus'], true) //隐藏格式错误的提示
				} else {//格式错误
					state = state.setIn(['views', 'invoiceFormatStatus', 'dutyIdStatus'], false) //显示格式错误的提示
				}
			}
			return state.setIn(['views', 'invoice', 'dutyId'], action.value);
		},
		[ActionTypes.CHANGE_TELEPHONE_ORDER]            : () =>{ //改变telephone的值
			if (action.value == "") { //判断是否有空值
				state = state.setIn(['views', 'invoiceStatus', 'telephoneStatus'] ,false)
							.setIn(['views', 'invoiceFormatStatus', 'telephoneStatus'], true) //隐藏格式错误的提示
			} else {
				state = state.setIn(['views', 'invoiceStatus','telephoneStatus'], true)
				if (/(^(\d{3,4}-)?\d{7,8})$|(^1[3|4|5|7|8][0-9]{9}$)/.test(action.value)) { //格式正确
					state = state.setIn(['views', 'invoiceFormatStatus', 'telephoneStatus'], true) //隐藏格式错误的提示
				} else {//格式错误
					state = state.setIn(['views', 'invoiceFormatStatus', 'telephoneStatus'], false) //显示格式错误的提示
				}
			}
			return state.setIn(['views', 'invoice', 'telephone'], action.value);
		},
		[ActionTypes.CHANGE_EMAIL_ORDER]               : () => { //改变邮箱的值
			if (action.value == "") { //判断是否有空值
				state = state.setIn(['views', 'invoiceStatus','emailStatus'], false)
							.setIn(['views', 'invoiceFormatStatus','eamilStatus'], true) //隐藏格式错误的提示
				// state = state.setIn(['invoiceFormatStatus','eamilStatus'], true) //隐藏格式错误的提示
			} else {
				state = state.setIn(['views', 'invoiceStatus','emailStatus'],true)
				if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(action.value)) { //格式正确
					state = state.setIn(['views', 'invoiceFormatStatus','emailStatus'],true) //隐藏格式错误的提示
				} else {//格式错误
					state = state.setIn(['views', 'invoiceFormatStatus','emailStatus'],false) //显示格式错误的提示
				}
			}
			return state.setIn(['views', 'invoice','email'], action.value);
		},
		[ActionTypes.CHANGE_REMARK_ORDER]              : () => state.setIn(['views', 'invoice', 'remark'], action.value),
		[ActionTypes.CREATE_INVOICE_TO_SERVER]         : () => state.setIn(['views', 'billMessageStatus'], false),

		[ActionTypes.GET_ORDER_LIST_FETCH_ORDER]    : () => {

			state = tcxqState.setIn(['data', 'orderInfoList'], fromJS(action.receivedData))
			let orderItemStatus = []  //每一条订单的一些状态
			let orderItemStatusFalse = []  //值是所有未开发票的订单在数据中下标
			state.getIn(['data', 'orderInfoList']).map((v,i) => {   //把所有发票的数据存入orderItemStatus中包括indexId，isInvoice,orderNo
				orderItemStatus.push({
					'indexId': i,
					'checkboxDisplay': false,
					'orderNo': v.get('orderNo'),
					'payAmount': v.get('payAmount'),
					'orderType': v.get('orderType')
				})
				if (v.get('isInvoice') == "NO" && v.get('tradeStatus') !== 'WAIT_BUYER_PAY' && v.get('isRefund') == "NO") {
					orderItemStatusFalse.push(i)
				}
			})
			return state.setIn(['views', 'orderItemStatus'], fromJS(orderItemStatus))
						.setIn(['views', 'orderItemStatusFalse'], fromJS(orderItemStatusFalse))
						.setIn(['views', 'invoice'], tcxqState.getIn(['invoice']))
						.setIn(['views', 'invoice', 'invoiceType'], "增值税普通发票")
						.setIn(['views', 'billMessageStatus'],false)
						.setIn(['views', 'applyStatus'], true)
						.setIn(['views', 'selectAllStatus'],false)
						.setIn(['views', 'showSuccessSubmit'], false)
		}

	}[action.type] || (() => state))()
}
