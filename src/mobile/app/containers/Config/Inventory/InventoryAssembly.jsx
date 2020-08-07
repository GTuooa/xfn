import React, { Component } from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Container, ScrollView, Row, Single, Icon, Form, Switch, XfInput, ButtonGroup, Button, ChosenPicker } from 'app/components'
import { decimal, configCheck } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { check } from './check/unit.js'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'
import fetchApi from 'app/constants/fetch.running.js'

const { Label, Item } = Form

@connect(state => state)
export default class InventoryUnit extends Component {
    state = {
        visible: false,
        idx: -1,
        categoryValue: 'ALL',
        materialList: [{
            materialUuid: '',
            unitUuid: '',
            quantity: '',
        }],
        "unitUuid": "",//成品的单位
        "unitName": "",//成品的单位名称
        "quantity": '',//成品的数量
    }

    componentDidMount() {
        const insertOrModify = this.props.inventoryConfState.getIn(['views','insertOrModify'])
        const assemblySheet = this.props.inventoryConfState.getIn(['inventoryCardTemp', 'assemblySheet'])
        const unit = this.props.inventoryConfState.getIn(['inventoryCardTemp', 'unit'])

        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
        thirdParty.setTitle({title: `${insertOrModify === 'insert' ? '组装单设置' : '组装单修改'}`})

        if (assemblySheet.get('materialList').size) {
            this.setState({
                materialList:  assemblySheet.get('materialList').toJS()
            })
        }
        this.setState({
            unitUuid:  assemblySheet.get('unitUuid'),
            unitName:  assemblySheet.get('unitName'),
            quantity:  assemblySheet.get('quantity'),
        })
        if (unit.get('unitList').size==0) {
            this.setState({
                unitUuid:  unit.get('uuid'),
                unitName:  unit.get('name'),
            })
        }

        this.props.dispatch(inventoryConfAction.getStockCategoryTree())
        this.props.dispatch(inventoryConfAction.getStockListByCategory({top: true, uuid: ''}))
    }

    render () {
        const { dispatch, history, inventoryConfState } = this.props
        const { visible, idx, categoryValue, materialList, unitUuid, unitName, quantity, } = this.state

        const inventoryCardTemp = inventoryConfState.get('inventoryCardTemp')
        const code = inventoryCardTemp.get('code')
        const name = inventoryCardTemp.get('name')
        const unit = inventoryCardTemp.get('unit')

        let unitList = [{key: unit.get('name'), value: unit.get('uuid')}]
        unit.get('unitList').map(v => {
            unitList.push({key: v.get('name'), value: v.get('uuid')})
        })

        const stockCategoryTree = inventoryConfState.get('stockCategoryTree').toJS()
        const isOne = materialList.length==1 ? true : false
        let stockList  = inventoryConfState.get('stockList').toJS()
        stockList.map(v => {
            if (v['uuid']==inventoryCardTemp.get('uuid')) {
                v['disabled']=true
            }
        })

        return (
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <div className='inventory-add-card'>
                            <ChosenPicker
                                visible={visible}
                                type='card'
                                multiSelect={true}
                                title='请选择存货'
                                district={stockCategoryTree}
                                cardList={stockList}
                                value={categoryValue}
                                onChange={(value) => {
                                    this.setState({categoryValue: value['key']})
                                    dispatch(inventoryConfAction.getStockListByCategory(value))
                                }}
                                onOk={value => {
                                    if (value.length==0) { return }
                                    let list = []
                                    value.map((item, i) => {
                                        let unitName = '', unitUuid = ''
                                        if (item['isOpenedQuantity'] && item['unit']['unitList'].length==0) {
                                            unitName = item['unit']['name']
                                            unitUuid = item['unit']['uuid']
                                        }

                                        list.push({
                                            materialUuid: item['uuid'],
                                            code: item['code'],
                                            name: item['oriName'],
                                            isOpenedQuantity: item['isOpenedQuantity'],
                                            unitName,
                                            unitUuid,
                                            quantity: '',
                                        })
                                    })
                                    materialList.splice(idx, 1, ...list)
                                    this.setState({materialList: materialList})
                                }}
                                onCancel={()=> { this.setState({visible: false}) }}
                            >
                                <span></span>
                            </ChosenPicker>

                            <div>
                                {
                                    materialList.map((v, i) => {
                                        let unitList = []
                                        for (const item of stockList) {
                                            if (item['uuid']==v['materialUuid']) {
                                                unitList.push({
                                                    key: item['unit']['name'],
                                                    value: item['unit']['uuid'],
                                                })
                                                item['unit']['unitList'].map(unitItem => {
                                                    unitList.push({
                                                        key: unitItem['name'],
                                                        value: unitItem['uuid'],
                                                    })
                                                })
                                                break
                                            }
                                        }
                                        const code = v['code'] ? v['code'] : ''
                                        const name = v['name'] ? v['name'] : ''

                                        return (
                                            <div key={i} style={{paddingBottom: '10px'}}>
                                                <div className='title'>
                                                    <span>物料明细({i+1})</span>
                                                    <span
                                                        className='blue'
                                                        onClick={() => {
                                                            if (isOne) {
                                                                this.setState({materialList: [{
                                                                    materialUuid: '',
                                                                    unitUuid: '',
                                                                    quantity: '',
                                                                }]})
                                                            } else {
                                                                materialList.splice(i,1)
                                                                this.setState({materialList: materialList})
                                                            }
                                                        }}
                                                    >
                                                            删除
                                                    </span>
                                                </div>

                                                <div className='item' style={{paddingBottom: '10px'}}>
                                                    <div className='item-title'>
                                                        存货:
                                                    </div>
                                                    <div className='item-stock'
                                                        onClick={() => {
                                                            this.setState({
                                                                visible: true,
                                                                idx: i,
                                                            })
                                                        }}
                                                    >
                                                        <Row className={v['materialUuid'] ? 'overElli black' : 'overElli'}>
                                                            {v['materialUuid'] ? `${code} ${name}` : '点击选择存货卡片'}
                                                        </Row>
                                                        <Icon type="triangle"/>
                                                   </div>
                                                </div>

                                                <div className='item'>
                                                    <div className='item-title'>数量:</div>
                                                    <div className='item-right item-stock-input'>
                                                        <XfInput
                                                            mode='number'
                                                            disabled={v['materialUuid'] ? false : true}
                                                            placeholder='填写数量'
                                                            value={v['quantity']}
                                                            onChange={value => {
                                                                if (value=='-' || value<0) {
                                                                    return thirdParty.Alert(`数量不支持负数`)
                                                                }
                                                                
                                                                materialList[i]['quantity'] = value
                                                                this.setState({materialList: materialList})
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{padding: '0 .05rem'}}></div>
                                                    <Single
                                                        className='item-stock'
                                                        district={unitList}
                                                        value={v['unitUuid']}
                                                        onOk={value => {
                                                            materialList[i]['unitUuid'] = value['value']
                                                            materialList[i]['unitName'] = value['key']
                                                            this.setState({materialList: materialList})
                                                        }}
                                                    >
                                                        <Row className={v['unitUuid'] ? 'overElli black' : 'overElli'}>
                                                            {v['unitUuid'] ? v['unitName'] : '选择数量单位'}
                                                        </Row>
                                                        <Icon type="triangle" />
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
                                    <div className='blue'
                                        onClick={() => {
                                        this.setState({ visible: true, idx: materialList.length })
                                    }}>
                                        +添加物料明细
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='inventory-add-card' style={{marginTop: '.1rem'}}>
                            <div className='item' style={{paddingBottom: '10px'}}>
                                <div className='item-title'>组装成品:</div>
                                <div className='black'> {`${code} ${name}`} </div>
                            </div>
                            <div className='item'>
                                <div className='item-title'>存货:</div>
                                <div className='item-right item-stock-input'>
                                    <XfInput
                                        mode='number'
                                        placeholder='填写数量'
                                        value={quantity}
                                        onChange={value => {
                                            this.setState({quantity: value})
                                        }}
                                    />
                                </div>
                                <div style={{padding: '0 .05rem'}}></div>
                                <Single
                                    className='item-stock'
                                    district={unitList}
                                    onOk={value => {
                                        this.setState({unitUuid: value['value'], unitName: value['key']})
                                    }}
                                >
                                    <Row className={unitName ? 'overElli black' : 'overElli'}>
                                        {unitName ? unitName : '选择数量单位'}
                                    </Row>
                                    <Icon type="triangle" />
                                </Single>
                            </div>
                        </div>
                    </Form>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => {
                        let errorList = []
                        materialList.forEach((v, i) => {
                            if (!v['materialUuid']) {
                                materialList.splice(i,1)
                                return
                            }
                            if (!v['unitUuid']) {
                                errorList.push(`物料明细${i+1}未选择单位`)
                            }
                            if (v['quantity'] <= 0) {
                                errorList.push(`物料明细${i+1}未填写数量`)
                            }
                        })
                        if (materialList.length) {
                            if (!unitName) {
                                errorList.push(`组装成品未选择单位`)
                            }
                            if (quantity <= 0) {
                                errorList.push(`组装成品未填写数量`)
                            }
                        }


                        if (errorList.length) {
                            return thirdParty.toast.info(errorList[0])
                        }

                        dispatch(inventoryConfAction.changeCardContent('assemblySheet', fromJS({
                            unitUuid,
                            unitName,
                            quantity,
                            materialList
                        })))
                        history.goBack()
                    }}>
                        <Icon type="choose" />
                        <span>确定</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }

}
