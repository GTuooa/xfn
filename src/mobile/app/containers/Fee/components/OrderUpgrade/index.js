import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { PopUp } from 'app/components'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import { fromJS } from 'immutable'

@immutableRenderDecorator
export default
class OrderUpgrade extends React.Component {

	render() {
        const {
            corpName,
			dispatch,
            orderWindowShow,
            orderNumber,
			amount,
			subjectName
		} = this.props

		return (
            <PopUp
                title={'订单详情'}
                onCancel={() => dispatch(tcgmActions.cancelShowOrderTcsj())}
                visible={orderWindowShow}
                footerVisible={false}
			>
                <div className="orderform">
                    <p>企业名称：{corpName}</p>
                    <p>购买套餐：{subjectName}</p>
                    <p>金额：{Math.floor(amount)}元</p>
                    <p>订单编号：{orderNumber}</p>
                    <p
                        className="orderform-btn"
                        onClick={() => {
                            dispatch(tcgmActions.successSubmitTc())
                            // dispatch(tcgmActions.payment(corpId, ddUserId, orderNumber))
                            dispatch(tcgmActions.payment(orderNumber))
							// history.push('/paysuccess')
                        }}
                    >
                        <span>去支付</span>
                    </p>
                </div>
				{/* 本地调试需要 */}
				{/* <form  className="orderform" action="https://fannixddfe1.hz.taeapp.com/XFN-MF/pay/aliPayPage"  method="POST" target="_blank">
					<p>企业名称：{corpName}</p>
					<p>购买套餐：{payAmount}／年</p>
					<p>购买时长：1年</p>
					<p>金额：{payAmount}元</p>
					<p>订单编号：{orderNo}</p>
					<input type="hidden" id="orderNo" name="orderNo" value={orderNo} />
					<input type="hidden" id="corpId" name="corpId" value={corpId} />
					<input type="hidden" id="ddUserId" name="ddUserId" value={ddUserId} />
					<p>
						<input
							type="submit"
							className="orderform-btn"
							value="去支付"
						    onClick={() => {
							   console.log('去支付')
							   dispatch(tcgmActions.successSubmit())
							   // dispatch(tcgmActions.payment())
						    }}
				   		/>
			   		</p>
				</form> */}
            </PopUp>
		)
	}
}
