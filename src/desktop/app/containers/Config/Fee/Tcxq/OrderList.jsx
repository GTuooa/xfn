import React from 'react'
import { Checkbox } from 'antd'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'

import { Tooltip } from 'antd'

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
			isInnerOneYear
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
			<ul className='order-table-list clearfix order-table-item '>
				<li>
					<Tooltip placement="right" title={tip}>
						<Checkbox
							disabled={isInvoice || tradeStatus == 'WAIT_BUYER_PAY' || orderItem.get('isRefund') != 'NO' || !isInnerOneYear}
							// 只有是未激活的才能被选中
							checked={orderItemCheckedStatus}
							onClick={() => dispatch(tcxqActions.selectOneButtonOrder(idx))}
						/>
					</Tooltip>
				</li>
				<li>
					{orderTime ? orderTime.replace(/\-n*/g,".") :''}
				</li>
				<li className="order-table-li">
					{orderItem.get('subjectName')}
				</li>
				<li>
					¥{payAmount}
				</li>
				<li
					style={{color: tradeStatus == 'WAIT_BUYER_PAY' ? '#2778b2' : '', textDecoration: tradeStatus == 'WAIT_BUYER_PAY' ? 'underline' : '' }}
					onClick={() => dispatch(tcxqActions.showOrderInfo(idx))}
					>
					{orderStatus}
					{isInvoice && orderItem.get('isRefund') == 'NO' ? '（已提交发票信息）' : ''}
				</li>
			</ul>
		)
	}
}

// {/* {orderTime ? orderTime.replace(/\-n*/g,".") :''} */}
