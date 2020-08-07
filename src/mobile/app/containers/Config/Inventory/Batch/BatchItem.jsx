import React from 'react'
import { toJS, fromJS } from 'immutable'

import { Form, Icon, Single, Row } from 'app/components'
const { Item, Label } = Form

import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

export default
class BatchItem extends React.Component {

    render() {
        const { history, dispatch, financialInfo, isModify } = this.props

        const openBatch = financialInfo.get('openBatch')
        const isBatchUniform = financialInfo.get('isBatchUniform')
        const openShelfLife = financialInfo.get('openShelfLife')
        const shelfLife = financialInfo.get('shelfLife')

        return (
            <div className='form-item-wrap'>
                <Item label="启用批次" className='margin-top'>
                    <div onClick={() => history.push('/config/inventory/batch')}>
                        <span className='gray'>{openBatch ? '已开启' : '未开启'}</span>
                    </div>
                    &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                </Item>

                <div className='gray assist-item' style={{display: openBatch && openShelfLife ? '' : 'none'}}>
                    已开启保质期管理：保质期({shelfLife}天)
                </div>

                <Item label="批次管理" 
                    style={{display: openBatch ? '' : 'none'}}
                    onClick={() => history.push('/config/inventory/batchList')}
                >
                    <Row className='config-form-item-select-item gray'>
                       点击管理批次号
                    </Row>
                    &nbsp;<Icon type="arrow-right" size="14" />
                </Item>

                <Item label="单价模式"  style={{display: openBatch ? '' : 'none'}}>
                    <Single
                        district={[{key: '全部批次统一单价', value: true}, {key: '不同批次不同单价', value: false}]}
                        value={isBatchUniform}
                        onOk={value => {
                            dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'isBatchUniform'], value.value))
                        }}
                    >
                        <Row className= 'config-form-item-select-item'>
                            {isBatchUniform ? '不同批次统一单价' : '不同批次不同单价'}
                        </Row>
                    </Single>
                    &nbsp;<Icon type="arrow-right" size="14" />
                </Item>
            </div>
        )
    }
}
