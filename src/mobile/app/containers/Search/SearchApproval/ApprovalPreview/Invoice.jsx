import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Amount } from 'app/components'

@immutableRenderDecorator
export default class Invoice extends React.Component {

    render() {
        const { billList, isEnable, categoryType, oriState } = this.props

        let component = null

        if (billList && billList.size) {
            const tax = billList.getIn([0, 'tax'])
            const taxRate = billList.getIn([0, 'taxRate']) == -1 ? '**' : billList.getIn([0, 'taxRate'])
            const billType = billList.getIn([0, 'billType'])

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
                <li className="search-approval-preview-detail-item">
                    <label className="search-approval-preview-detail-label">票据：</label>
                    <span className="search-approval-preview-detail-text">其他票据</span>
                </li>
            )
           

            if (['bill_common','bill_special'].includes(billType)) {
                component = (
                    <li className="search-approval-preview-detail-item">
                        <label className="search-approval-preview-detail-label">票据：</label>
                        <span className="search-approval-preview-detail-text">
                            {billType == 'bill_common' ? '发票' : '增值税发票'}(税额:<Amount showZero>{tax}</Amount>;税率:{ `${taxRate}%` })
                        </span>
                    </li>
                )
            }
        }

        return component
    }
}
