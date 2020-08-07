import React from 'react'
import { connect }	from 'react-redux'

import { Icon, Button, ButtonGroup, Container, Row, ScrollView, PopUp } from 'app/components'
import { fromJS, toJS } from 'immutable'
import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import moment from 'moment'
import { currentDate } from 'app/utils'

@connect(state => state)
export default
class OrderMessage extends React.Component {// 订单详情


    render() {
        const {
            tcxqState,
            dispatch,
            homeState,
            history
        } = this.props

        const corpId = tcxqState.getIn(['data', 'corpInfo', 'corpId'])
        const ddUserId = homeState.getIn(['data', 'userInfo', 'dduserid'])

        const views = tcxqState.get('views')
        const showOrderInfoStatus = views.get('showOrderInfoStatus')
        const invoiceMessage = views.get('invoiceMessage')

        const isInvoice = invoiceMessage ? (invoiceMessage.get('isInvoice') == "YES" ? true : false) : ''//是否有发票
        const tradeStatus = invoiceMessage.get('tradeStatus')
        const payTime = invoiceMessage.get('payTime') ? invoiceMessage.get('payTime').slice(0,10).replace(/\./g, '-') : ''
        const currentTime = currentDate()

        let orderStatus = ''
        if (invoiceMessage.get('isRefund') == 'YES') {
            orderStatus = '已退款'
        } else if (invoiceMessage.get('isRefund') == 'ING'){
            orderStatus = '退款中'
        } else {
            orderStatus = tradeStatus == 'TRADE_SUCCESS' || tradeStatus =='TRADE_FINISHED' ? '交易成功' : tradeStatus == 'WAIT_BUYER_PAY' ? '待付款' : ''
        }

        const isRefundTime = payTime ?
                    ( moment(currentTime).diff(payTime, 'day')<=7 ? true : false )
                    : ''

        return (
            // <Container>
            //     <ScrollView flex='1'>
            // {/* <Modal
                // visible={showOrderInfoStatus}
                // onCancel={() => dispatch(tcxqActions.cancelShowOrderInfo())}
                // title="订单详情"
                // footer={null}
            //    > */}
            <PopUp
                title={'订单详情'}
                onCancel={() => dispatch(tcxqActions.cancelShowOrderInfo())}
                visible={showOrderInfoStatus}
                footerVisible={false}
                >
                    <ul className="order-detail">
                        <li>
                            <span>订单状态：</span>
                            <span>
                                {orderStatus}
                            </span>
                        </li>
                        <li className="order-detail-create">
                            <span>创建人：</span>
                            <span>{invoiceMessage.get('createName')}</span>
                        </li>
                        <li>
                            <span>套餐类型：</span>
                            <span>{invoiceMessage.get('subjectName')}</span>
                        </li>
                        <li>
                            <span>创建时间：</span>
                            <span>{invoiceMessage.get('orderTime').replace(/\-n*/g,".")}</span>

                        </li>
                        <li>
                            <span>订单金额：</span>
                            <span>¥ {invoiceMessage.get('payAmount')} 元</span>
                        </li>
                        <li>
                            <span>订单编号：</span>
                            <span>{invoiceMessage.get('orderNo')}</span>
                        </li>
                        <li className="order-detail-fonts" style={{display: tradeStatus == 'WAIT_BUYER_PAY' ? 'none' : '' }}>
                            <span>支付宝交易号：</span>
                            <span>{invoiceMessage.get('tradeNo')}</span>
                        </li>
                        <li style={{display: tradeStatus == 'WAIT_BUYER_PAY' ? 'none' : '' }}>
                            <span>成交时间：</span>
                            <span>{invoiceMessage.get('payTime')}</span>
                        </li>
                        <li className="order-detail-refund" style={{display: isRefundTime && invoiceMessage.get('isRefund') == 'NO' ? '' : 'none'}}>
                            <b onClick={() => dispatch(tcxqActions.applyRefund(invoiceMessage.get('orderNo')))}>申请退款</b>
                        </li>
                        <li
                            className="order-detail-reimburse" style={{display: tradeStatus == 'WAIT_BUYER_PAY' ? '' : 'none' }}
                            >
                                <b className="order-detail-reimburse-btn"
                                    onClick={() => {
                                        if (tradeStatus == 'WAIT_BUYER_PAY') {
                                            dispatch(tcxqActions.cancelWaitPayOrder(invoiceMessage.get('orderNo')))
                                       } else {
                                           return false
                                       }
                                    }}
                                >
                                    取消订单
                                </b>
                            <b className="order-detail-reimburse-btn"
                                onClick={() => {
                                    if (tradeStatus == 'WAIT_BUYER_PAY') {

                                        // weiwancheng
                                        dispatch(tcxqActions.successSubmitOrder(invoiceMessage.get('payAmount') , invoiceMessage.get('orderNo')))

                                        // dispatch(tcgmActions.payment(corpId, ddUserId, invoiceMessage.get('orderNo')))
                                        dispatch(tcgmActions.payment(invoiceMessage.get('orderNo')))
                                        // history.push('/paysuccess')

                                    } else {
                                       return false
                                    }
                                }}
                            >
                                    去支付
                            </b>
                        </li>
                    </ul>
                    {/* 增值税普通发票 */}
                    <ul className='order-detail'
                        style={{display: isInvoice && invoiceMessage.get('isRefund') == 'NO' ? '' : 'none'}}
                        >
                        <li>
                          <b className="order-detail-bill-tit">发票信息</b>
                        </li>
                        <li>
                            <span>发票类型：</span>
                            <span>{invoiceMessage.getIn(['invoice','invoiceType'])}（电子发票）</span>
                        </li>
                        <li>
                            <span>发票金额：</span>
                            <span>¥{invoiceMessage.getIn(['invoice','totalAccount'])}元</span>
                        </li>
                        <li>
                            <span>发票抬头：</span>
                            <span>{invoiceMessage.getIn(['invoice','invoiceTitle'])}</span>
                        </li>
                        <li className="order-detail-fonts">
                            <span>纳税人识别号：</span>
                            <span>{invoiceMessage.getIn(['invoice','dutyId'])}</span>
                        </li>
                        <li>
                            <span>联系电话：</span>
                            <span>{invoiceMessage.getIn(['invoice','telephone'])}</span>
                        </li>
                        <li className="order-detail-fonts">
                            <span>发票接收邮箱：</span>
                            <span>{invoiceMessage.getIn(['invoice','email'])}</span>
                        </li>
                        <li className="order-detail-remark">
                            <span>备 注：</span>
                            <span>{invoiceMessage.getIn(['invoice','remark'])}</span>
                        </li>
                    </ul>
            </PopUp>
        )
    }
}
