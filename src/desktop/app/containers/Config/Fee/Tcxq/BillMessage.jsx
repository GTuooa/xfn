import React from 'react'
import { Modal, Input, Radio, message, Button } from 'antd'
const RadioGroup = Radio.Group;
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS,toJS } from 'immutable'
import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'


@immutableRenderDecorator
export default
class BillMessage extends React.Component {//申请发票的信息
    render() {
        const {
            dispatch,
            billMessageStatus,
            subAmount,
            invoice,
            avtiveItemId,
            invoiceStatus,
            invoiceFormatStatus
        } = this.props

        return (
            <Modal
                visible={billMessageStatus}
                // onOk={() => dispatch(tcxqActions.showBillMessage()) }
                onCancel={() => dispatch(tcxqActions.closeBillMessage())}
                title="发票信息填写"
                // okText="确定"
                // cancelText="取消"
                width="651px"
                footer={[
                    <Button
                        type="ghost"
                        key="cancel"
                        onClick={() => dispatch(tcxqActions.closeBillMessage())}
                    >
                        取消
                    </Button>,
                    <Button
                        type="primary"
                        key="ok"
                        onClick={() => {
                            if (invoice.get('remark').length <= 40) {
                                let orderNoList = []
                                avtiveItemId.map(v => {
                                    orderNoList.push(v.get('orderNo'))
                                })
                                let spaceArr = []
                                invoice.map((v,i) => {
                                    if (v=='') {
                                        spaceArr.push(i);
                                    }
                                })

                                if (spaceArr.length<1 || (spaceArr.length==1&&spaceArr[0]=="remark") || invoice.get('email') == '') {//除了备注信息都不为空

                                    if(/[0-9A-Z]{15}|[0-9A-Z]{18}|[0-9A-Z]{20}/.test(invoice.get('dutyId'))){ //判断税号
                                        if(/(^(\d{3,4}-)?\d{7,8})$|(1[3|4|5|7|8][0-9]{9})/.test(invoice.get('telephone'))){ //判断电话
                                            if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(invoice.get('email'))) {
                                                dispatch(tcxqActions.showPrompt(orderNoList, invoice))
                                            } else {
                                                dispatch(tcxqActions.showEmailOrder())  //邮箱格式不正确
                                            }
                                        } else {
                                            dispatch(tcxqActions.showTelephoneOrder())//联系电话格式不正确
                                        }
                                    } else {
                                        dispatch(tcxqActions.showDutyIdOrder())//税号格式不正确
                                    }
                                } else { //显示字段为空的提示信息
                                    dispatch(tcxqActions.showInvoiceStatus())
                                }
                            } else {
                                message.error("备注最长为40个字符")
                            }
                        }}
                    >
                        确定
                    </Button>
                ]}
            >
        		<ul className="order-billMessage clearfix">
        			<li>发票金额：<b style={{color:"#e40000"}}>¥{subAmount}</b></li>
        			<li>
        				<span>发票类型：</span>
        				<RadioGroup
                            defaultValue={1}>
        			        <Radio value={1}>增值税普通发票（电子发票）</Radio>
        			    </RadioGroup>
        			</li>
        			<li>
        				<span>发票抬头：</span>
        				<Input
                            className="order-billMessage-input"
                            placeholder="请输入完整的公司名称，如：杭州小番网络科技有限公司"
                            value={invoice.get('invoiceTitle')}
                            onChange={(e) => dispatch(tcxqActions.changeInvoiceTitleOrder(e.target.value))}
                        />
                        <span className="order-billMessage-prompt"  style={{'color':'#e40000','display':invoiceStatus.get('invoiceTitleStatus')?'none':''}}>发票抬头不能为空!</span>
        			</li>
        			<li>
        				<span>税&nbsp;&nbsp;号：</span>
        				<Input
                            className="order-billMessage-input"
                            placeholder="请输入纳税人识别号"
                            value={invoice.get('dutyId')}
                            onChange={(e) =>dispatch(tcxqActions.changeDutyIdOrder(e.target.value))}
                        />
                        <span className="order-billMessage-prompt" style={{'color':'#e40000','display':invoiceStatus.get('dutyIdStatus')?'none':''}}>不能为空!</span>
                        <span className="order-billMessage-prompt" style={{'color':'#e40000','display':invoiceFormatStatus.get('dutyIdStatus')?'none':''}}>格式错误!</span>
        			</li>
        			<li>
        				<span>联系电话：</span>
        				<Input
                            className="order-billMessage-input"
                            placeholder="请输入电话号码"
                            value={invoice.get('telephone')}
                            onChange={(e) =>dispatch(tcxqActions.changeTelephoneOrder(e.target.value))}
                        />
                        <span className="order-billMessage-prompt" style={{'color':'#e40000','display':invoiceStatus.get('telephoneStatus')?'none':''}}>不能为空!</span>
                        <span className="order-billMessage-prompt" style={{'color':'#e40000','display':invoiceFormatStatus.get('telephoneStatus')?'none':''}}>格式错误!</span>
        			</li>
                    <li>
        				<span>电子邮箱：</span>
        				<Input
                            className="order-billMessage-input"
                            placeholder="请输入发票接收邮箱地址"
                            value={invoice.get('email')}
                            onChange={(e) =>dispatch(tcxqActions.changeEmailOrder(e.target.value))}
                        />
                        {/* <span className="order-billMessage-prompt" style={{'color':'#e40000','display': invoiceStatus.get('emailStatus') ? 'none' : ''}}>不能为空!</span> */}
                        <span className="order-billMessage-prompt" style={{'color':'#e40000','display': invoiceFormatStatus.get('emailStatus') ? 'none' : ''}}>格式错误!</span>
        			</li>
        			<li>
        				<span>备注信息：</span>
        				<Input
                            className="order-billMessage-input"
                            placeholder="选填"
                            value={invoice.get('remark')}
                            onChange={(e) =>dispatch(tcxqActions.changeRemarkOrder(e.target.value))}
                        />
        			</li>
        		</ul>
            </Modal>
        )
    }
}
