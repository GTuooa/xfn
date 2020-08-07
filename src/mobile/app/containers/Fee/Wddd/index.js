import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import thirdParty from 'app/thirdParty'
import moment from 'moment'
import { DateLib } from 'app/utils'
import OrderList from './OrderList'

import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'

@immutableRenderDecorator
export default
class Tcxq extends React.Component {

    render() {

        const { tcxqState, dispatch, homeState, history } = this.props

        const corpId = tcxqState.getIn(['data', 'corpInfo', 'corpId'])
        const corpName = tcxqState.getIn(['data', 'corpInfo', 'corpName'])
        const orderInfoList = tcxqState.getIn(['data', 'corpInfo', 'orderInfoList'])
        const views = tcxqState.get('views')
        const ddUserId = homeState.getIn(['data', 'userInfo', 'dduserid'])
        const applyStatus = views.get('applyStatus')

        return (
            <div className="order-table">
                <div className="order-table-title">
                    <span className="order-table-title-text">订单</span>
                    <span
                        className={applyStatus ? 'order-table-get-btn order-table-get-btn-disabled' : 'order-table-get-btn'}
                        onClick={() => {
                            if (!applyStatus) {
                                history.push('/billmessage')
                            }
                        }}
                    >
                        获取发票
                    </span>
                </div>
                <ul className="order-table-list">
                    {orderInfoList.size > 0 ?
                        orderInfoList.map((u,i) => {

                            const orderItemCheckedStatus = tcxqState.getIn(['views', 'orderItemStatus', i ,'checkboxDisplay'])

                            const today = new DateLib()
                            const year = today.getYear()
                            const month = today.getMonth()
                            const day = today.getDay()

                            const tomorrow = new DateLib(new Date(moment().add(1, 'days')._d))
                            const tomorrowYear = tomorrow.getYear()
                            const tomorrowMonth = tomorrow.getMonth()
                            const tomorrowDay = tomorrow.getDay()

                            // 获取一年前到现在的时间区间
                            const fromDay = `${Number(year)-1}-${month}-${day}`
                            const endDay = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`

                            const orderTime = u.get('orderTime')
                            const orderDay = orderTime.split(' ')

                            // 用moment的 isBetween
                            const isInnerOneYear = moment(orderDay[0]).isBetween(fromDay, endDay)

                            return (
                                <OrderList
                                    key={i}
                                    idx={i}
                                    orderItem={u}
                                    dispatch={dispatch}
                                    orderItemCheckedStatus={orderItemCheckedStatus}
                                    corpId={corpId}
                                    ddUserId={ddUserId}
                                    isInnerOneYear={isInnerOneYear}
                                    history={history}
                                    // tabBtnIndex={tabBtnIndex}
                                />
                            )
                        })
                        : ''
                    }
                </ul>

                {/* <ButtonGroup className="order-apply-bill" style={{display: tabBtnIndex === '0' ? '' : 'none'}}>
					<p className="order-apply-bill-btn" onClick={() => this.setState({tabBtnIndex: '1'})}>获取发票</p>
				</ButtonGroup>
                <ButtonGroup style={{display: tabBtnIndex === '0' ? 'none' : ''}}>
					<Button onClick={() => {
                        dispatch(tcxqActions.selectAllButtonOrder())
                    }}><Icon type="cancel"/>全选</Button>
                    <Button onClick={() => {
                        this.setState({tabBtnIndex: '0'})
                        dispatch(tcxqActions.cancelSelectAllButtonOrder())
                    }}><Icon type='cancel'/><span>取消</span></Button>
					<Button disabled={applyStatus} onClick={() => {
                        // dispatch(tcxqActions.showBillMessage())
                        history.push('/billmessage')
                    }}><Icon type="cancel"/>确定</Button>
				</ButtonGroup> */}
            </div>
        )
    }
}
