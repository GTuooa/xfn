import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Single, Icon, XfInput } from 'app/components'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

//营业收入存货卡片
export default class Sale extends Component {
    render () {
        const {
            dispatch,
            salePriceList,
            unitList,
        } = this.props

        const isOne = salePriceList.size==1 ? true : false

        let singleUnitList = []
        unitList.map(v => {
            v['key'] = v['name']
            v['value'] = v['uuid']
            singleUnitList.push(v)
        })


        return (
            <div className='inventory-add-card'>
                <div>
                    {
                        salePriceList.map((v, i) => {
                            return (
                                <div key={i}>
                                    <div className='title'>
                                        <span>默认销售价({i+1})</span>
                                        <span
                                            className='blue'
                                            style={{display: isOne ? 'none' : ''}}
                                            onClick={() => {
                                                const arr = salePriceList.delete(i)
                                                dispatch(inventoryConfAction.changeData('salePriceList', arr, true))
                                            }}
                                        >
                                                删除
                                        </span>
                                    </div>
                                    <div className='item item-price'>
                                        <div className='left'>金额(元):</div>
                                        <XfInput
                                            mode='number'
                                            className='item-right'
                                            placeholder='选填, 请输入金额'
                                            value={v.get('defaultPrice')}
                                            onChange={value => {
                                                dispatch(inventoryConfAction.changeData(['salePriceList', i, 'defaultPrice'], value))
                                            }}
                                        />
                                    </div>
                                    <div className='item item-price'>
                                        <div className='left'>单位</div>
                                        <Single
                                            className='item-right'
                                            district={singleUnitList}
                                            // value={v.get('unitUuid')}
                                            onOk={value => {
                                                dispatch(inventoryConfAction.changeData(['salePriceList', i, 'unitUuid'], value['uuid']))
                                                dispatch(inventoryConfAction.changeData(['salePriceList', i, 'name'], value['name']))

                                            }}
                                        >
                                           <div className='item-price-unit'>
                                              <span className='name'>{v.get('name') ? v.get('name'): '请选择单位' }</span>
                                              <Icon type="triangle"/>
                                          </div>
                                        </Single>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className='bottom'>
                    <div></div>
                    <div className='right'>
                        <div className='blue' onClick={() => {
                            dispatch(inventoryConfAction.changeData(['salePriceList', salePriceList.size],fromJS({
                                unitUuid: '',
                                name: '',
                                defaultPrice: '',
                                type: '2'
                            })))
                        }}>
                            +添加默认销售价
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}
