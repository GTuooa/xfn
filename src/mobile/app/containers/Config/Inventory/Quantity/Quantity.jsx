import React from 'react'
import { toJS, fromJS } from 'immutable'

import { Form, Icon, Row } from 'app/components'
const { Item, Label } = Form

import { formatMoney } from 'app/utils'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

export default
class Quantity extends React.Component {

    render() {
        const { history, dispatch, inventoryCardTemp, purchasePriceList, salePriceList } = this.props

        const isOpenedQuantity = inventoryCardTemp.get('isOpenedQuantity')//是否启用数量管理
        const unit = inventoryCardTemp.get('unit')//计量单位
        const isStandard = unit.get('isStandard')
        const unitName = unit.get('fullName')
        const openSerial = inventoryCardTemp.getIn(['financialInfo', 'openSerial'])//是否启用序列号管理

        return (
            <div className='form-item-wrap'>
                <Item label="启用数量核算">
                    <div onClick={() => history.push('/config/inventory/quantity')}>
                        <span className='gray'>{isOpenedQuantity ? '已开启' : '未开启'}</span>
                    </div>
                    &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                </Item>

                <div className='gray assist-item' style={{display: isOpenedQuantity ? '' : 'none'}}>
                    <div>计量单位：{unitName}</div>
                    <div>{openSerial ? '启用序列号' : null}</div>
                    <div>
                        <span>默认采购价：</span>
                        <span>
                            {purchasePriceList.reduce((p, c) => `${p?p:''}${p?';':''}${formatMoney(c.get('defaultPrice'), 2, '')}元/${c.get('name')}`, '')}
                        </span>
                    </div>
                    <div>
                        <span>默认销售价：</span>
                        <span>
                            {salePriceList.reduce((p, c) => `${p?p:''}${p?';':''}${formatMoney(c.get('defaultPrice'), 2, '')}元/${c.get('name')}`, '')}
                        </span>
                    </div>

                </div>
            </div>
        )
    }
}
