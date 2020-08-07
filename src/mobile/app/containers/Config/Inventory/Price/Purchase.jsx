import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Single, Icon, XfInput } from 'app/components'
import * as thirdParty from 'app/thirdParty'

import { configCheck } from 'app/utils'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'


export default class Purchase extends Component {
    render () {
        const {
            dispatch,
            purchasePriceList,
            unitList,
        } = this.props

        const isOne = purchasePriceList.size==1 ? true : false

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
                        purchasePriceList.map((v, i) => {
                            return (
                                <div key={i}>
                                    <div className='title'>
                                        <span>默认采购价({i+1})</span>
                                        <span
                                            className='blue'
                                            style={{display: isOne ? 'none' : ''}}
                                            onClick={() => {
                                                const arr = purchasePriceList.delete(i)
                                                dispatch(inventoryConfAction.changeData('purchasePriceList', arr, true))
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
                                                dispatch(inventoryConfAction.changeData(['purchasePriceList', i, 'defaultPrice'], value))
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
                                                dispatch(inventoryConfAction.changeData(['purchasePriceList', i, 'unitUuid'], value['uuid']))
                                                dispatch(inventoryConfAction.changeData(['purchasePriceList', i, 'name'], value['name']))

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
                            dispatch(inventoryConfAction.changeData(['purchasePriceList', purchasePriceList.size],fromJS({
                                unitUuid: '',
                                name: '',
                                defaultPrice: '',
                                type: '1'
                            })))
                        }}>
                            +添加默认采购价
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}
