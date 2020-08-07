import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, ChosenPicker, Row, Amount, XfInput } from 'app/components'
import Item from './InventoryOpenedItem.jsx'
import AssistSelect from './AssistSelect.jsx'

import { configCheck, decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class QuantityOnly extends React.Component {
    batchList = []
    state = {
        show: false,
        idx: '',
        oriBatch: [],//当前选中的批次
        oriAssistList: [],//当前选中的属性
    }

    componentDidMount() {
        thirdParty.setTitle({title: '期初余额'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})

        this.props.inventoryConfState.getIn(['inventoryCardTemp', 'financialInfo', 'batchList']).forEach(v => {
            const batch = v.get('batch')
            const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
            const keyStr = expirationDate ? `${batch}(${expirationDate})` : batch

            this.batchList.push({
                key: keyStr,
                value: v.get('batch'),
                batchUuid: v.get('batchUuid') ? v.get('batchUuid') : '',
                expirationDate: expirationDate,
            })
        })
    }
    componentWillUnmount () {
        let opened = 0, totalQuantity = 0
        this.props.inventoryConfState.getIn(['inventoryCardTemp', 'openList']).forEach(v => {
            const openedQuantity = v.get('openedQuantity') ? v.get('openedQuantity') : 0
            const openedAmount = v.get('openedAmount') ? v.get('openedAmount') : 0
            opened += Number(v.get('openedAmount'))
            totalQuantity += Number(v.get('openedQuantity'))
        })
        this.props.dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'opened'], decimal(opened, 2)))
        this.props.dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openedQuantity'], decimal(totalQuantity, 4)))
    }

    render() {

        const { dispatch, history, inventoryConfState, } = this.props
        const { show, idx, oriBatch, oriAssistList} = this.state

		const insertOrModify = inventoryConfState.getIn(['views','insertOrModify'])
        const usedOpenSerial = inventoryConfState.getIn(['views','usedOpenSerial'])
        const usedOpenBatch = inventoryConfState.getIn(['views','usedOpenBatch'])
		const inventoryCardTemp = inventoryConfState.get('inventoryCardTemp')
        const isOpenedQuantity = inventoryCardTemp.get('isOpenedQuantity')//是否启用数量管理
        const inventoryUuid = inventoryConfState.getIn(['inventoryCardTemp','uuid'])

		const opened = inventoryCardTemp.get('opened')
		const openedQuantity = inventoryCardTemp.get('openedQuantity')
		const unit = inventoryCardTemp.get('unit')
        const openList = inventoryCardTemp.get('openList')

        const financialInfo = inventoryCardTemp.get('financialInfo')
        const openAssist = financialInfo.get('openAssist')//属性
        const openSerial = financialInfo.get('openSerial')//序列号
        const openBatch = financialInfo.get('openBatch')//批次
        const openShelfLife = financialInfo.get('openShelfLife')//保质期
        const shelfLife = financialInfo.get('shelfLife')//默认保质期天数
        const assistClassificationList = financialInfo.get('assistClassificationList')//属性列表
console.log(financialInfo.toJS());

        return(
            <Container className="inventory-config">
                <div className='inventory-opened-title'>
                    <Row onClick={()=> {
                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList'], openList.push(fromJS({}))))
                    }}>
                        <span>期初选项 </span>
                        <Icon type="add-plus" />
                    </Row>
                    <div className='inventory-title-item'>数量({unit.get('name')})</div>
                    <div className='open-right'>期初余额(元)</div>
                </div>

                <ScrollView flex='1' className="border-top">
                    {
                        openList.map((v,i) => {
                            const openedQuantity = v.get('openedQuantity') ? v.get('openedQuantity') : ''
                            const openedAmount = v.get('openedAmount') ? v.get('openedAmount') : ''
                            const assistList = v.get('assistList') ? v.get('assistList') : fromJS([])
                            const batch = v.get('batch') ? v.get('batch') : ''
                            const batchUuid = v.get('batchUuid') ? v.get('batchUuid') : ''
                            const serialList = v.get('serialList') ? v.get('serialList') : fromJS([])
                            const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
                            const openUuid = v.get('openUuid') ? v.get('openUuid') : ''
                            let nameStr = ''
                            if (openAssist) { nameStr = assistList.reduce((p, c) => `${p}${p?';':''}${c.get('propertyName')}`, nameStr) }
                            if (openBatch && batch) { nameStr = `${nameStr}${nameStr?';':''}${batch}` }
                            if (openShelfLife && expirationDate) { nameStr = `${nameStr}(${expirationDate})` }

                            return (
                                <div key={i} className='open'>
                                    <div className='left'
                                        onClick={()=> {
                                            dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList'], openList.delete(i)))
                                        }}
                                        >
                                        <Icon type="delete-plus"/>
                                    </div>
                                    <div className='right'>
                                        <div className='top underline blue'
                                            style={{display: (openAssist || openBatch) ? '' : 'none'}}
                                            onClick={() => this.setState({
                                                show: true,
                                                idx: i,
                                                oriAssistList: assistList.toJS(),
                                                oriBatch: {batch,
                                                    batchUuid,
                                                    expirationDate,
                                                    keyStr: expirationDate ? `${batch}(${expirationDate})` : batch
                                                },
                                                })}
                                            >
                                            {nameStr ? nameStr : '点击选择'}
                                        </div>
                                        <div className='bottom'>
                                            <div className='underline blue' style={{display: (openSerial) ? '' : 'none'}}
                                                onClick={()=>{
                                                    if (openedQuantity && serialList.size==0 && usedOpenSerial) {
                                                        dispatch(inventoryConfAction.changeData('serial', fromJS({
                                                            serialList,
                                                            type: 'OPENLIST',
                                                            idx: i,
                                                        }), true))
                                                        dispatch(inventoryConfAction.getSerialList(inventoryUuid,openUuid))
                                                    } else {
                                                        dispatch(inventoryConfAction.changeData('serial', fromJS({
                                                            serialList,
                                                            type: 'OPENLIST',
                                                            idx: i,
                                                        }), true))
                                                    }
                                                    history.push('/config/inventory/serial')

                                                }}
                                                >
                                                {openedQuantity?<Amount decimalPlaces={4} decimalZero={false}>{openedQuantity}</Amount>:'点击输入'}
                                            </div>
                                            <div style={{display: (!openSerial) ? '' : 'none'}}>
                                                <XfInput.BorderInputItem
                                                    mode='number'
                                                    negativeAllowed={true}
                                                    textAlign="right"
                                                    value={openedQuantity}
                                                    onChange={value => {
                                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', i, 'openedQuantity'], value))
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <XfInput.BorderInputItem
                                                    mode='amount'
                                                    negativeAllowed={true}
                                                    textAlign="right"
                                                    value={openedAmount}
                                                    onChange={value => {
                                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', i, 'openedAmount'], value))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    }

					{/* <div className='inventory-opened-item'>
						<div className="inventory-warehouse inventory-warehouse-sub">
							<span className='name'>合计</span>
						</div>

						{isOpenedQuantity ? <div className='inventory-title-item'>
							<Amount showZero decimalPlaces={4} decimalZero={false}>{Number(openedQuantity)}</Amount>
						</div> : null }
						{!isUniformPrice ? <div className='inventory-title-item'>
							<Amount showZero decimalPlaces={2}>{Number(opened)}</Amount>
						</div> : null }
					</div> */}
                </ScrollView>

                <AssistSelect
                    show={show}
                    history={history}
                    insertOrModify={insertOrModify}
                    inventoryUuid={inventoryUuid}
                    openAssist={openAssist}
                    openBatch={openBatch}
                    assistList={assistClassificationList}
                    batchList={this.batchList}
                    oriBatch={oriBatch}
                    oriAssistList={oriAssistList}
                    onOk={(assistValue, batch) => {
                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', idx, 'assistList'], fromJS(assistValue)))
                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', idx, 'batchUuid'], batch['batchUuid']))
                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', idx, 'batch'], batch['batch']))
                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', idx, 'expirationDate'], batch['expirationDate']))
                        this.setState({show: false})
                    }}
                    addClick={() => {
                        const oriBatchList = financialInfo.get('batchList')
                        let batch = {batchList: oriBatchList, openShelfLife, shelfLife, editPage: 'inventory'}
                        if (insertOrModify=='insert') {
                            batch['batchType'] = 'INSERT-INSERT'
                        } else {
                            batch['batchType'] = usedOpenBatch ? 'MODIFY-INSERT' : 'INSERT-INSERT'
                            batch['inventoryUuid'] = inventoryUuid
                       }
                       dispatch(inventoryConfAction.changeData('batch', inventoryConfState.get('batch').merge(fromJS(batch)), true))
                       history.push('/config/inventory/batchSet')
                    }}
                    modifyClick={() => {
                        const oriBatchList = financialInfo.get('batchList')
                        let batch = {batchList: oriBatchList, openShelfLife, shelfLife, editPage: 'inventory'}
                        if (insertOrModify=='insert') {
                            batch['batchType'] = 'INSERT-MODIFY'
                        } else {
                            batch['batchType'] = usedOpenBatch ? 'MODIFY-MODIFY' : 'INSERT-MODIFY'
                            batch['inventoryUuid'] = inventoryUuid
                        }
                        dispatch(inventoryConfAction.changeData('batch', inventoryConfState.get('batch').merge(fromJS(batch)), true))
                        history.push('/config/inventory/batchSet')
                    }}
                />

                <ButtonGroup>
                    <Button onClick={() => {history.goBack()}}>
                        <Icon type="choose"/>
                        <span>确定</span>
                    </Button>
                </ButtonGroup>


            </Container>
        )
    }
}
