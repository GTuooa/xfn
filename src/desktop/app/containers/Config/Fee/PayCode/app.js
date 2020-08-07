import React from 'react'
import { ROOT } from 'app/constants/fetch.constant.js'

export default
class PayCodeHome extends React.Component {

	componentDidMount() {
		const userForm = this.refs['userForm']
		userForm.submit()
	}

	render() {

		// 从路由地址获取提交的订单信息
		const href = location.href
		const start = href.indexOf('?')
		let serverMessage = location.href.slice(start+1).split('&')
		const corpId = serverMessage[0].slice(7)
		const ddUserId = serverMessage[1].slice(9)
		const orderNo = serverMessage[2].slice(8)

		return (
			<div>
				<span>扫码支付</span>
				<form ref="userForm" id="userForm" name="userForm" action={`${ROOT}/pay/aliPayPage`} method="POST">
					<input type="hidden" id="corpId" name="corpId" value={`${corpId}`} />
					<input type="hidden" id="ddUserId" name="ddUserId" value={`${ddUserId}`} />
					<input type="hidden" id="orderNo" name="orderNo" value={`${orderNo}`} />
				</form>
			</div>
		)
	}
}
