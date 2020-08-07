import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Collapse, Icon } from 'antd'
import { formatNum, formatMoney } from 'app/utils'

@immutableRenderDecorator
export default class Invoice extends React.Component {

    render() {
        const {
            itemData
        } = this.props

        const tax = itemData.getIn([0, 'tax'])
        const taxRate = itemData.getIn([0, 'taxRate'])
        const billStates = itemData.getIn([0, 'billStates'])
        const billType = itemData.getIn([0, 'billType'])
        let billTypeName = billType ?
                billType === 'bill_other' ?
                    '其他票据'
                    :
                    {
                        bill_common:`发票(税额${formatMoney(tax, 2, '')}，税率${taxRate == -1 ?'**':taxRate}%)`,
                        bill_special:`增值税发票(税额${formatMoney(tax, 2, '')}，税率${taxRate == -1 ?'**':taxRate}%)`,
                    }[billType]
                : ''

        return (
            billType ?
                    <li>
                        <span>票据：</span><span>{billTypeName}</span>
                    </li>
                    : ''
        )
    }
}
