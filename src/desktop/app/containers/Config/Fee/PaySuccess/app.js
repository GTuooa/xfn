import React from 'react'
import { connect }	from 'react-redux'

import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'

import * as thirdParty from 'app/thirdParty'
import { Icon, Button } from 'antd'
import './style.less'

@connect(state => state)
export default
class PaySuccess extends React.Component {

	constructor() {
		super()
		this.state = {setintervalNum: 0}
	}

	render() {

		const {
			tcgmState,
            dispatch,
			history
		} = this.props
		const { setintervalNum } = this.state

        const orderNumber = tcgmState.getIn(['views', 'orderNumber'])
        const orderAmount = tcgmState.getIn(['views', 'orderAmount'])

		return (
			<div className="pay-success-submit-box">
				<div className="pay-success-goback">
					<Button onClick={() => history.goBack()}>返回</Button>
				</div>
                <div className="submit-center clearfix">
					<div className="center-left">
						<Icon type="check-circle" style={{fontSize: '34px'}} />
						<p>订单提交成功，请尽快支付<br /><span>订单编号：{orderNumber}</span></p>
					</div>
					<div className="center-right">
						支付金额：<span>¥{orderAmount}</span>
					</div>
				</div>
				<div className="submit-footer">
					<p>支付:¥{orderAmount}元</p>
					<p>请在新开支付宝页面中完成支付，请勿在支付完成前关闭此窗口</p>
					<p>如遇支付出现问题，请<span>联系客服：0571-28121680</span></p>
					<div className="submit-btn">
						<span
							onClick={() => {
								if (orderNumber) {
									dispatch(tcxqActions.completePayOrder(orderNumber))
								} else {
									thirdParty.Alert('没有需要验证的订单')
								}
							}}
						>验证支付</span>
						<span
							onClick={() => {
								if (orderNumber) {
									dispatch(tcxqActions.cancelWaitPayOrder(orderNumber))
								} else {
									thirdParty.Alert('没有需要取消的订单')
								}
							}}
						>取消订单</span>
					</div>
				</div>
			</div>
		)
	}
}
