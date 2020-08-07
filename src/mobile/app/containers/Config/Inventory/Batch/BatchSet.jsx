import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Form, Switch, XfInput, DatePicker, Single } from 'app/components'
const { Label, Item } = Form

import { configCheck, DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class BatchSet extends React.Component {
    district = []//批次列表
    batchList = []//批次号列表
    state = {
        batch: '',
        productionDate: '',
        expirationDate: '',//截止日期
        oriBatch: '',//需要修改的批次号
        oriProductionDate: '',//需要修改的生产日期
        oriExpirationDate: '',//截止日期
        batchUuid: '',
        keyStr: '',
    }

    componentDidMount() {
        const batch = this.props.inventoryConfState.get('batch')
        const batchType = batch.get('batchType')
        const editPage =  batch.get('editPage')
        thirdParty.setTitle({title: batchType.includes('-INSERT') ? '新增批次': '修改批次'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})

        if (batchType.includes('-MODIFY')) {//修改时
            batch.get('batchList').forEach(v => {
                const batch = v.get('batch')
                const productionDate = v.get('productionDate') ? v.get('productionDate') : ''
                const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                const keyStr = expirationDate ? `${batch}(${expirationDate})` : batch

                this.district.push({
                    key: keyStr,
                    value: v.get('batch'),
                    batchUuid: v.get('batchUuid') ? v.get('batchUuid') : '',
                    productionDate: productionDate,
                    expirationDate,
                })
                this.batchList.push(v.get('batch'))
            })
        }

        // if (batch.get('openShelfLife')) {
        //     this.setState({ productionDate: new DateLib().valueOf() })
        // }

        if (editPage=='inventoryBatchList' && batchType.includes('-MODIFY')) {//批次管理页面的修改
            this.setState({
                oriBatch: batch.get('batch'),
                oriProductionDate: batch.get('productionDate'),
                productionDate: batch.get('productionDate'),
                expirationDate: batch.get('expirationDate'),
                oriExpirationDate: batch.get('expirationDate'),
                batchUuid: batch.get('batchUuid'),
                keyStr: batch.get('batch'),
                batch: batch.get('batch'),
            })
        }
    }

    render() {
        const { dispatch, history, inventoryConfState } = this.props
        const { batch, productionDate, oriBatch, oriProductionDate, batchUuid, keyStr, expirationDate } = this.state

        const batchObj = inventoryConfState.get('batch')
        const batchType = batchObj.get('batchType')
        const isInsert = batchType.includes('-INSERT')
        const openShelfLife = batchObj.get('openShelfLife')//是否开启保质期
        const shelfLife = batchObj.get('shelfLife')//默认保质期天数
        const oriBatchList = inventoryConfState.getIn(['inventoryCardTemp', 'financialInfo', 'batchList'])
        const editPage = batchObj.get('editPage')
        const isBatchListModify = editPage=='inventoryBatchList' && batchType.includes('-MODIFY')

        let actualShelfLife = 0//实际保质天数
        if (productionDate && expirationDate) {
            const  startDate = Date.parse(productionDate)
            const  endDate = Date.parse(expirationDate);
            actualShelfLife = (endDate - startDate)/(1*24*60*60*1000);
        }

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="原批次号" style={{display: isInsert || isBatchListModify ? 'none' : ''}}>
                            <Single
                                district={this.district}
                                value={oriBatch}
                                onOk={value => {
                                    this.setState({
                                        oriBatch: value['value'],
                                        oriProductionDate: value['productionDate'],
                                        productionDate: value['productionDate'],
                                        expirationDate: value['expirationDate'],
                                        batchUuid: value['batchUuid'],
                                        keyStr: value['key'],
                                        batch: value['value'],

                                    })
                                }}
                            >
                                <div className={oriBatch ? 'config-form-item-select-item' : 'config-form-item-select-item config-form-item-select-item-holder'}>
                                    {oriBatch ? keyStr : '请选择批次号'}
                                </div>
                            </Single>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>

                        <Item label={isInsert ? '批次号' : '新批次号'} showAsterisk
                            className={isInsert || isBatchListModify ? "config-form-item-input-style" : 'config-form-item-input-style margin-top'}
                            style={{display: isInsert ? '' : (oriBatch ? '' : 'none')}}
                        >
                            <XfInput
                                placeholder="支持数字"
                                value={batch}
                                onChange={value => configCheck.inputCheck('batch', value, () => {this.setState({batch: value})})}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>

                        <Item label="生产日期" style={{display: (openShelfLife && (isInsert ? true : (oriBatch ? true : false))) ? '' : 'none'}}>
                            <DatePicker
                                value={productionDate}
                                onChange={(date) => {
                                    this.setState({productionDate: new DateLib(date).valueOf()})
                                    
                                    if (date && !expirationDate && shelfLife) {
                                        const newDate = new Date(date.setDate(date.getDate() + Number(shelfLife)))
                                        this.setState({expirationDate: new DateLib(newDate).valueOf()})
                                    }
                                }}
                            >
                                <div className={productionDate ? '' : 'config-form-item-select-item-holder'}>
                                    {productionDate ? productionDate : '请选择生产日期'}
                                </div>
                            </DatePicker>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>

                        <Item label="截止日期" showAsterisk style={{display: (openShelfLife && (isInsert ? true : (oriBatch ? true : false))) ? '' : 'none'}}>
                            <DatePicker
                                value={expirationDate}
                                onChange={(date) => {
                                    const value = new DateLib(date).valueOf()
                                    if (value && productionDate && value < productionDate) {
                                        return thirdParty.toast.info('截止日期不应小于生产日期')
                                    }
                                    this.setState({expirationDate: new DateLib(date).valueOf()})
                                }}
                            >
                                <div className={expirationDate ? '' : 'config-form-item-select-item-holder'}>
                                    {expirationDate ? expirationDate : '请选择截止日期'}
                                </div>
                            </DatePicker>
                            &nbsp;<Icon type="arrow-right" size="14" />
                        </Item>

                        <Item label="" style={{display: (openShelfLife && (shelfLife || actualShelfLife)) ? '' : 'none'}}>
                            <div className='config-form-item-select-item-holder' style={{flex: 1}}>
                                {shelfLife ? `默认保质期: ${shelfLife}天` : null}
                                {shelfLife && actualShelfLife ? ' ; ' : null}
                                {actualShelfLife ? `实际保质期: ${actualShelfLife}天` : null}
                            </div>
                        </Item>

                    </Form>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => history.goBack()}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button onClick={() => {
                        if (!batch) {
                            return thirdParty.toast.info('请填写批次号')
                        }
                        if (openShelfLife && (!expirationDate)) {
                            return thirdParty.toast.info('请选择截止日期')
                        }

                        ({
                            'INSERT-INSERT': () => {
                                if (this.batchList.includes(batch)) {
                                    return thirdParty.toast.info('批次号重复')
                                }
                                dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'batchList'], oriBatchList.push(fromJS({batch, productionDate, expirationDate}))))
                                history.goBack()
                            },
                            'INSERT-MODIFY': () => {
                                if (oriBatch != batch && this.batchList.includes(batch)) {
                                    return thirdParty.toast.info('批次号重复')
                                }
                                const idx = oriBatchList.findIndex(v => v.get('batch')==batch)
                                dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'batchList', idx], fromJS({batch, productionDate, expirationDate})))
                                history.goBack()
                            },
                            'MODIFY-INSERT': () => {
                                if (this.batchList.includes(batch)) {
                                    return thirdParty.toast.info('批次号重复')
                                }
                                dispatch(inventoryConfAction.changeData(['batch', 'batch'], batch))
                                dispatch(inventoryConfAction.changeData(['batch', 'productionDate'], productionDate))
                                dispatch(inventoryConfAction.changeData(['batch', 'expirationDate'], expirationDate))
                                dispatch(inventoryConfAction.saveInventoryBatch(() => history.goBack()))
                            },
                            'MODIFY-MODIFY': () => {
                                if (oriBatch != batch && this.batchList.includes(batch)) {
                                    return thirdParty.toast.info('批次号重复')
                                }
                                dispatch(inventoryConfAction.changeData(['batch', 'batch'], batch))
                                dispatch(inventoryConfAction.changeData(['batch', 'batchUuid'], batchUuid))
                                dispatch(inventoryConfAction.changeData(['batch', 'productionDate'], productionDate))
                                dispatch(inventoryConfAction.changeData(['batch', 'expirationDate'], expirationDate))
                                dispatch(inventoryConfAction.saveInventoryBatch(() => history.goBack()))
                            }
                        }[batchType]())
                    }}>
						<Icon type="confirm"/>
						<span>确定</span>
					</Button>
                </ButtonGroup>
            </Container>
        )
    }
}
