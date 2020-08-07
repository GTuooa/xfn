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
        const tax = itemData.get('tax')
        const taxRate = itemData.get('taxRate')
        const billStates = itemData.get('billStates')
        const billType = itemData.get('billType')
        let billTypeName = billType?
            billType === 'bill_other'?
                '其他票据'
                :
                {
                    bill_common:`发票(税额${formatMoney(tax,2,'')}，税率${taxRate}%)`,
                    bill_special:`增值税发票(税额${formatMoney(tax,2,'')}，税率${taxRate}%)`,
                }[billType]
            :''
        return(
                billType?
                    <li><span>票据：</span><span>{billTypeName}</span></li>:''
        )
    }
}
