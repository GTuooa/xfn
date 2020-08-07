import React from 'react'
import { toJS, fromJS } from 'immutable'

import { Form, XfInput, Icon } from 'app/components'
const { Item } = Form
import Purchase from './Purchase.jsx'
import Sale from './Sale.jsx'

import { configCheck } from 'app/utils'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

export default
class Price extends React.Component {

    render() {
        const {
            unit,
            purchasePriceList,
            salePriceList,
            dispatch,
		} = this.props

        const isStandard = unit.get('isStandard')
        const name = unit.get('name') ? unit.get('name') : ''
        let unitList = unit.get('unitList') ? unit.get('unitList').toJS() : []
        const moreUnit = unitList && unitList.length ? true : false

        let component = null

        if (moreUnit) {
            unitList.push({uuid: unit.get('uuid'), name: name})
            component = <div>
                <Purchase
                    dispatch={dispatch}
                    purchasePriceList={purchasePriceList}
                    unitList={unitList}
                />
                <Sale
                    dispatch={dispatch}
                    salePriceList={salePriceList}
                    unitList={unitList}
                />

            </div>
        } else {
            component = <div className='form-item-wrap'>
                <Item label={`默认采购价${name ? `(元/${name})` : ''}`} className="config-form-item-input-style">
                    <XfInput
                        mode='amount'
                        placeholder={"选填,请输入金额"}
                        value={purchasePriceList.getIn([0, 'defaultPrice'])}
                        onChange={value => dispatch(inventoryConfAction.changeData(['purchasePriceList', 0, 'defaultPrice'], value))}
                    />
                    &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                </Item>
                <Item label={`默认销售价${name ? `(元/${name})` : ''}`} className="config-form-item-input-style">
                    <XfInput
                        mode='amount'
                        placeholder={"选填,请输入金额"}
                        value={salePriceList.getIn([0, 'defaultPrice'])}
                        onChange={value => dispatch(inventoryConfAction.changeData(['salePriceList', 0, 'defaultPrice'], value))}
                    />

                    &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                </Item>
            </div>
        }

        return component
    }
}
