import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import { PopUp } from 'app/components'

@immutableRenderDecorator
export default
class UntreatedOrder extends React.Component {

    render() {
        const {
            dispatch,
            untreatedOrderMessage,
            untreatedOrderVisible,
            untreatedOrderList,
            untreatedOrderSize,
            untreatedOrderNo
        } = this.props

        return (
            <PopUp
                title={untreatedOrderMessage}
                cancelText={"我知道了"}
                okText={"取消订单"}
                visible={untreatedOrderVisible}
                footerVisible={true}
                onCancel={() => dispatch(tcgmActions.cancelUntreatedOrderTc())}
                onOk={() => dispatch(tcgmActions.cancelOrderTc(untreatedOrderNo))}
                >
                {
                    untreatedOrderList.map((u, i) =>{
                        return (
                            <div key={i} className="untreatedOrderItem" style={{borderBottom: untreatedOrderSize == 1 ? '' : i != untreatedOrderSize ? '1px solid #ccc' : '' }}>
                                <p>公司名称：{u.corpName}</p>
                                <p>创建人：{u.payPerson}</p>
                                <p>创建时间：{u.orderTime}</p>
                                <p>套餐类型：{u.subjectName}</p>
                                <p>订单金额：{u.payAmount}元</p>
                                <p>订单编号：{u.orderNo}</p>
                            </div>
                        )
                    })
                }
            </PopUp>
        )
    }
}
