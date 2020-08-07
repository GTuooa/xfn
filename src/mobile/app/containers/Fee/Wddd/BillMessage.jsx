import React from 'react'
import { connect }	from 'react-redux'

import { Icon, Button, ButtonGroup, Container, Row, Form, ScrollView, TextInput, MonthPicker, SinglePicker } from 'app/components'
import { fromJS,toJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'
import '../style.less'

@connect(state => state)
export default
class BillMessage extends React.Component {//申请发票的信息

    componentDidMount() {
        thirdParty.setTitle({title: '发票信息填写'})
    }

    render() {
        const {
            dispatch,
            tcxqState,
            history
        } = this.props

        const views = tcxqState.get('views')
        const billMessageStatus = views.get('billMessageStatus')
        const avtiveItemId = views.get('avtiveItemId')
        const invoice = views.get('invoice')
        const invoiceStatus = views.get('invoiceStatus')
        const invoiceFormatStatus = views.get('invoiceFormatStatus')
        // const showPrompt = views.get('showPrompt')

        let subAmount = 0  //申请发票的总金额
        avtiveItemId ? avtiveItemId.map((v,i) => {
            subAmount += v.get("payAmount")
        }) : ''

        return (
            <Container>
                <ScrollView flex='1'>
                    <ul className="order-billMessage">
                        <li className="order-billMessage-item">
                            <span className="order-billMessage-item-lable">发票金额：</span>
                            <span className="order-billMessage-item-right" style={{color:"#e40000", fontWeight: 'bold'}}>¥{subAmount}</span>
                        </li>

                        <li className="order-billMessage-item">
                            <span className="order-billMessage-item-lable">发票类型：</span>
                            <span className="order-billMessage-item-right">增值税普通发票(电子发票)</span>
                        </li>

                        <li className="order-billMessage-item">
                            <span className="order-billMessage-item-lable">发票抬头：</span>
                            <TextInput
                                className="order-billMessage-input"
                                placeholder="请输入完整的公司名称，如：杭州小番网络科技有限公司"
                                value={invoice.get('invoiceTitle')}
                                onChange={(value) => dispatch(tcxqActions.changeInvoiceTitleOrder(value))}
                            />
                        </li>
                        <li
                            className="order-billMessage-prompt"
                            style={{'display': !invoiceStatus.get('invoiceTitleStatus') ? '' : 'none'}}
                        >
                            发票抬头不能为空!
                        </li>

                        <li className="order-billMessage-item">
                            <span className="order-billMessage-item-lable">税&nbsp;&nbsp;号：</span>
                            <TextInput
                                className="order-billMessage-input"
                                placeholder="请输入纳税人识别号"
                                value={invoice.get('dutyId')}
                                onChange={(value) =>dispatch(tcxqActions.changeDutyIdOrder(value))}
                            />
                        </li>
                        <li
                            className="order-billMessage-prompt"
                            style={{display: !invoiceStatus.get('dutyIdStatus') || !invoiceFormatStatus.get('dutyIdStatus') ? '' : 'none'}}
                        >
                            {!invoiceStatus.get('dutyIdStatus') ? '不能为空!' : '格式错误!'}
                        </li>

                        <li className="order-billMessage-item">
                            <span className="order-billMessage-item-lable">联系电话：</span>
                            <TextInput
                                className="order-billMessage-input"
                                placeholder="请输入电话号码"
                                value={invoice.get('telephone')}
                                onChange={(value) =>dispatch(tcxqActions.changeTelephoneOrder(value))}
                            />
                        </li>
                        <li
                            className="order-billMessage-prompt"
                            style={{display: !invoiceStatus.get('telephoneStatus') || !invoiceFormatStatus.get('telephoneStatus') ? '' : 'none'}}
                        >
                            {!invoiceStatus.get('telephoneStatus') ? '不能为空!' : '格式错误!'}
                        </li>

                        <li className="order-billMessage-item">
                            <span className="order-billMessage-item-lable">电子邮箱：</span>
                            <TextInput
                                className="order-billMessage-input"
                                placeholder="请输入发票接收邮箱地址"
                                value={invoice.get('email')}
                                onChange={(value) =>dispatch(tcxqActions.changeEmailOrder(value))}
                            />                            
                        </li>
                        <li
                            className="order-billMessage-prompt"
                            style={{display: !invoiceFormatStatus.get('emailStatus') ? '' : 'none'}}
                        >
                            格式错误!
                        </li>

                        <li className="order-billMessage-item">
                            <span className="order-billMessage-item-lable">备注信息：</span>
                            <TextInput
                                className="order-billMessage-input"
                                placeholder="选填"
                                value={invoice.get('remark')}
                                onChange={(value) =>dispatch(tcxqActions.changeRemarkOrder(value))}
                            />
                        </li>
                    </ul>
                </ScrollView>
                <ButtonGroup type='ghost' height={50}>
                    {/* selectAllStatus */}
                    <Button onClick={() => {
                        history.goBack()
                    }}><Icon type="cancel"/>取消</Button>
                    <Button onClick={() => {
                        if (invoice.get('remark').length <= 40) {
                            let orderNoList=[]
                            avtiveItemId.map(v => {
                                orderNoList.push(v.get('orderNo'))
                            })
                            let spaceArr = [];
                                invoice.map((v,i)=>{
                                    if (v == '') {
                                        spaceArr.push(i);
                                    }
                                })

                                if (spaceArr.length<1||(spaceArr.length==1&&spaceArr[0]=="remark") || invoice.get('email') =='') {//除了备注信息都不为空

                                    if (/[0-9A-Z]{15}|[0-9A-Z]{18}|[0-9A-Z]{20}/.test(invoice.get('dutyId'))) { //判断税号
                                        if (/(^(\d{3,4}-)?\d{7,8})$|(1[3|4|5|7|8][0-9]{9})/.test(invoice.get('telephone'))) { //判断电话

                                            // if (invoice.get('email')) {
                                            //     if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(invoice.get('email'))) { //显示弹窗
                                            //         dispatch(myOrderActions.showPrompt(orderNoList, invoice))
                                            //     }  else {
                                            //         dispatch(myOrderActions.showEmailOrder())  //邮箱格式不正确
                                            //     }
                                            // } else {
                                            //     dispatch(myOrderActions.showPrompt(orderNoList, invoice))
                                            // }
                                            if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(invoice.get('email'))) {
                                                // dispatch(tcxqActions.showPrompt(orderNoList, invoice))

                                                thirdParty.Confirm({
                                                    message: "提交发票信息成功，我们将于7～15个工作日发送至您的发票接收邮箱或通过钉钉消息发送给您，请注意查收。若有疑问请联系客服电话：0571-28121680。",
                                                    title: "提示",
                                                    buttonLabels: ['取消', '确定'],
                                                    onSuccess : (result) => {
                                                        if (result.buttonIndex === 1) {
                                                            // dispatch(tcxqActions.createInvoiceToserver( tcxqState.getIn(['views', 'orderNoList']), tcxqState.getIn(['views', 'invoice'])))
                                                            dispatch(tcxqActions.createInvoiceToserver(orderNoList, invoice, history))
                                                            // dispatch(tcxqActions.closeShowPrompt())
                                                        }
                                                    },
                                                    onFail : (err) => alert(err)
                                                })
                                            } else {
                                                dispatch(tcxqActions.showEmailOrder())  //邮箱格式不正确
                                            }
                                        } else {
                                            dispatch(tcxqActions.showTelephoneOrder())//联系电话格式不正确
                                        }
                                    } else {
                                        dispatch(tcxqActions.showDutyIdOrder())//税号格式不正确
                                    }
                                } else {//显示字段为空的提示信息
                                    dispatch(tcxqActions.showInvoiceStatus())
                                }
                            } else {
                                thirdParty.toast.info("备注最长为40个字符")
                                // message.error("备注最长为40个字符")
                            }
                        }
                    }><Icon type="save"/>确定</Button>
                </ButtonGroup>
            </Container>
        )
    }
}
