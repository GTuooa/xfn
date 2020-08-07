import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'

@immutableRenderDecorator
export default
class OrderList extends React.Component {

	render() {
        const {
			key,
			idx,
			orderItem,
			dispatch,
			orderItemCheckedStatus,
			isInnerOneYear,
			history
		}= this.props

		const orderNo = orderItem.get('orderNo');
        const orderTime = orderItem.get('orderTime');//订单创建日期
        const activateAmount = orderItem.get('activateAmount');//可激活的(套餐类型)
        const validTime = orderItem.get('validTime');//订单有效期
        const payAmount = orderItem.get('payAmount');//订单金额
		const invoice = orderItem.get('invoice');//发票信息
		const tradeStatus = orderItem.get('tradeStatus');//发票信息
		const isRefund = orderItem.get('isRefund');//发票信息
		const isInvoice = orderItem.get('isInvoice') == 'YES' ? true : false  //发票状态

		let orderStatus = ''
		if (orderItem.get('isRefund') == 'YES') {
			orderStatus = '已退款'
		} else if (orderItem.get('isRefund') == 'ING'){
			orderStatus = '退款中'
		} else {
			orderStatus = tradeStatus == 'TRADE_SUCCESS' || tradeStatus =='TRADE_FINISHED' ? '交易成功' : tradeStatus == 'WAIT_BUYER_PAY' ? '待付款' : ''
		}

		let tip = ''
		if (tradeStatus == 'WAIT_BUYER_PAY') {
			tip = '待付款订单不能申请发票'
		} else {
			if (isInvoice) {
				tip = '已提交发票信息'
			} else {
				if (isRefund === 'ING') {
					tip = '退款中不能申请发票'
				} else if (isRefund === 'YES') {
					tip = '已退款不能申请发票'
				} else {
					if (!isInnerOneYear) {
						tip = '一年前的订单已过期，不能申请发票'
					}
				}
			}
		}


		return (
			<li className='order-table-item'>
				<div
					className='order-table-item-checkbox'
					onClick={() => {
						if (tip) {
							thirdParty.toast.info(tip, 1)
						}
					}}
				>
					<Checkbox
						disabled={isInvoice || tradeStatus == 'WAIT_BUYER_PAY' || orderItem.get('isRefund') != 'NO' || !isInnerOneYear}
						// 只有是未激活的才能被选中
						checked={orderItemCheckedStatus}
						onClick={() => {
							if (isInvoice || tradeStatus == 'WAIT_BUYER_PAY' || orderItem.get('isRefund') != 'NO' || !isInnerOneYear || tip) {
								return
							} else {
								dispatch(tcxqActions.selectOneButtonOrder(idx))
							}
						}}
					/>
				</div>
				<div className='order-table-item-detail'>
					<div className="order-table-item-detail-item">
						<span className="tcxq-main-font">{orderItem.get('subjectName')}</span>
						<span className="order-table-item-detail-payAmount">¥{payAmount}</span>
					</div>
					<div className="order-table-item-detail-item">
						<span className="order-table-item-detail-ordertime">{orderTime ? orderTime.replace(/\-n*/g,".") : ''}</span>
						<span
							className={tradeStatus == 'WAIT_BUYER_PAY' ? "order-table-item-detail-status order-table-item-detail-wait" : 'order-table-item-detail-status'}
							onClick={() => dispatch(tcxqActions.showOrderInfo(idx))}
						>
							{orderStatus}{isInvoice && orderItem.get('isRefund') == 'NO' ? '（已提交发票信息）' : ''}
						</span>
					</div>
				</div>
			</li>
		)
	}
}

// {/* {orderTime ? orderTime.replace(/\-n*/g,".") :''} */}
// {/* <li>
// 	{orderTime ? orderTime.replace(/\-n*/g,".") :''}
// </li>
// <li className="order-table-li">
// 	{orderItem.get('subjectName')}
// </li>
// <li>
// 	¥{payAmount}
// </li>
// <li
// 	style={{color: tradeStatus == 'WAIT_BUYER_PAY' ? '#2778b2' : '', textDecoration: tradeStatus == 'WAIT_BUYER_PAY' ? 'underline' : '' }}
// 	// onClick={() => dispatch(tcxqActions.showOrderInfo(idx))}
// 	onClick={() => {
// 		dispatch(tcxqActions.showOrderInfo(idx))
// 		// history.push('/ordermessage')
// 	}}
// >
// 	{orderStatus}
// 	{isInvoice && orderItem.get('isRefund') == 'NO' ? '（已提交发票信息）' : ''}
// </li> */}
