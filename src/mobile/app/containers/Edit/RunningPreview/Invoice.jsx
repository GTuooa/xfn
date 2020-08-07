import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Row, Amount, Icon } from 'app/components'

@immutableRenderDecorator
export default class Invoice extends React.Component {

    render() {
        const { billList, isEnable, categoryType, oriState } = this.props

        let component = null

        if (billList && billList.size) {
            const tax = billList.getIn([0, 'tax'])
            const taxRate = billList.getIn([0, 'taxRate']) == -1 ? '**' : billList.getIn([0, 'taxRate'])
            const billState = billList.getIn([0, 'billState'])
            const billType = billList.getIn([0, 'billType'])
            const billStateName = {
                bill_states_make_out: '已开票',
                bill_states_not_make_out:'未开票',
                bill_states_auth: '已认证',
                bill_states_not_auth: '未认证',
            }[billState]

            if (isEnable == 'small' && ['LB_YYZC', 'LB_FYZC', 'LB_YYWZC'].includes(categoryType) && ['', 'bill_other'].includes(billType)) {
                return null
            }
            if (isEnable == 'small' && oriState=='STATE_CQZC_YF' && ['', 'bill_other'].includes(billType)) {
                return null
            }
            if (isEnable == 'isEnable' && ['', 'bill_other'].includes(billType)) {
                return null
            }

            component = (
                <div className='running-preview-item'>
                    <div className='running-preview-item-title'>票据：</div>
                    <div className='running-preview-item-content'>其他票据</div>
                </div>
            )

            if (['bill_common','bill_special'].includes(billType)) {
                component = (
                    <div className='running-preview-item'>
                        <div className='running-preview-item-title'>票据：</div>
                        <div className='running-preview-item-content'>
                            {billType == 'bill_common' ? '发票' : '增值税发票'}(税额：<Amount showZero>{tax}</Amount>;税率：{ `${taxRate}%` })
                        </div>
                    </div>
                )
            }
        }

        return component
    }
}
