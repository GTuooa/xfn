import React from 'react'
import { connect }	from 'react-redux'

import thirdParty from 'app/thirdParty'
import { Checkbox, Button, Modal } from 'antd'
import Title from '../components/Title'
import OrderList from './OrderList'
import EquityList from './EquityList'
import OrderMessage from './OrderMessage'
import BillMessage from './BillMessage'
import InvalidEquity from './InvalidEquity'
import ContainerWrap from 'app/components/Container/ContainerWrap'

import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'
import { feeActions } from 'app/redux/Fee'
import { fromJS } from 'immutable'
import './style.less'

// import moment from 'moment'
import { DateLib, judgeIsInnerOneYear } from 'app/utils'

@connect(state => state)
export default
class Tcxq extends React.Component {

    shouldComponentUpdate(nextprops) {
		return this.props.tcxqState != nextprops.tcxqState
	}

    render() {

        const { tcxqState, dispatch, homeState } = this.props

        const corpId = tcxqState.getIn(['data', 'corpInfo', 'corpId'])
        const corpName = tcxqState.getIn(['data', 'corpInfo', 'corpName'])
        const currentPackage = tcxqState.getIn(['data', 'corpInfo', 'currentPackage'])
        const ddUserId = homeState.getIn(['data', 'userInfo', 'dduserid'])
        const equityList = tcxqState.getIn(['data', 'corpInfo', 'equityList'])
        const invalidEquityList = tcxqState.getIn(['data', 'corpInfo', 'invalidEquityList'])
        const orderInfoList = tcxqState.getIn(['data', 'corpInfo', 'orderInfoList'])
        const invalidOrder = tcxqState.getIn(['data', 'corpInfo', 'invalidOrder'])


        const views = tcxqState.get('views')
        const showOrderInfoStatus = views.get('showOrderInfoStatus')
        const invoiceMessage = views.get('invoiceMessage')
        const selectAllStatus = views.get('selectAllStatus')
        const applyStatus = views.get('applyStatus')
        const billMessageStatus = views.get('billMessageStatus')
        const avtiveItemId = views.get('avtiveItemId')
        const invoice = views.get('invoice')
        const invoiceStatus = views.get('invoiceStatus')
        const invoiceFormatStatus = views.get('invoiceFormatStatus')
        const showPrompt = views.get('showPrompt')

        let subAmount = 0  //申请发票的总金额
        avtiveItemId ? avtiveItemId.map((v,i) => {
            subAmount += v.get("payAmount")
        }) : ''

        return (
            <ContainerWrap type="config-one" className="layer-small tcxq">
                {
                    // <Title
                    //     activeTab={0}
                    //     onClick={(page) => dispatch(feeActions.switchFeeActivePage(page))}
                    // />
                }
                <div className="tcxq-fresh">
                    <Button onClick={() => {
                        this.props.dispatch(tcxqActions.getPackageAmountListAndgetAdminCorpinfoFetch())
                    }}>刷新</Button>
                </div>
                <div className="tcxq-name-wrap">
                    <span className="tcxq-label">企业名称：</span>
                    <span className="tcxq-corp-name">{corpName}</span>
                </div>
                <div className="tcxq-name-wrap">
                    <span className="tcxq-label">当前套餐：</span>
                    <span className="tcxq-corp-name">{currentPackage}</span>
                </div>

                {
                    equityList.size ?
                    <div className="tcxq-equity">
                        <span className="tcxq-label">当前功能：</span>
                        <EquityList
                            equityList={equityList}
                            dispatch={dispatch}
                        />
                    </div>
                    : null
                }
                
                {
                    invalidEquityList.size ?
                    <div className="tcxq-invalid-equity">
                        <span className="tcxq-label">未购买功能：</span>
                        <InvalidEquity
                            invalidEquityList={invalidEquityList}
                            dispatch={dispatch}
                        />
                    </div> : ''
                }
                

                {/* 申请发票 */}
				<BillMessage
					dispatch={dispatch}
					billMessageStatus={billMessageStatus}
					subAmount={subAmount}
					invoice={invoice ? invoice : fromJS({})}
					avtiveItemId={avtiveItemId}
					invoiceStatus={invoiceStatus}
					invoiceFormatStatus={invoiceFormatStatus}
                />
                
                {
                    // <div className="tcxq-remark">
                    //     <span>备注：每个增值模块可申请试用，最大试用期为1个月，当正式订单生效时，试用期将即时停止。</span>
                    // </div>
                }
                
                <div className="tcxq-cut-off-rule"></div>

                <div className="tcxq-order-title">
                    <span>订单</span>
                    <Button
                        className="order-title-bill"
                        disabled={applyStatus}
                        onClick={() => dispatch(tcxqActions.showBillMessage())}
                    >获取发票</Button>
                </div>
                <div className="order-table-title-wrap">
					<ul className="order-table-title clearfix order-table-item">
						<li>
							<Checkbox
								onClick={() => dispatch(tcxqActions.selectAllButtonOrder())}
								checked={selectAllStatus}
							/>
						</li>
						<li>创建日期</li>
						<li>套餐类型</li>
						<li>订单金额</li>
						<li>订单状态</li>
					</ul>
				</div>
                <div className="order-table">
					{orderInfoList.size > 0 ?
						orderInfoList.map((u,i) => {

							const orderItemCheckedStatus = tcxqState.getIn(['views', 'orderItemStatus', i ,'checkboxDisplay'])
                            const orderTime = u.get('orderTime')
                            const orderDay = orderTime.split(' ')
                            const isInnerOneYear = judgeIsInnerOneYear(orderDay[0])

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
								/>
                            )
						})
                        : ''
					}
				</div>

                {/* 订单信息 */}
				<OrderMessage
					dispatch={dispatch}
					showOrderInfoStatus={showOrderInfoStatus}
					invoiceMessage={invoiceMessage}
					corpId={corpId}
					ddUserId={ddUserId}
				/>

                {/* 提示信息 */}
				<Modal
					title="提示"
                    visible={showPrompt}
                    footer=""
                    onCancel={() => dispatch(tcxqActions.closeShowPrompt())}
				>
					<div className="order-prompt">
						<p>提交发票信息成功，我们将于7～15个工作日发送至您的发票接收邮箱或通过钉钉消息发送给您，请注意查收。若有疑问请联系客服电话：0571-28121680。</p>
						<p
							onClick={() => {
                                dispatch(tcxqActions.createInvoiceToserver( tcxqState.getIn(['views', 'orderNoList']), tcxqState.getIn(['views', 'invoice'])))
                                dispatch(tcxqActions.closeShowPrompt())
                            }}
                        >
                            确定
                        </p>
					</div>
				</Modal>
            </ContainerWrap>
        )
    }
}


// {/* <div className="tcxq-wait-equity">
//                     <span className="tcxq-label">待生效订单：</span>
//                     <span>
//                         {
//                             invalidOrder && invalidOrder.get('equityName') ? `${invalidOrder.get('equityName')}，订单生效日期为 ${invalidOrder.get('effectiveDate')}，订单有效期至 ${invalidOrder.get('expirationDate')}` : '无'
//                         }
//                     </span>
//                 </div> */}
