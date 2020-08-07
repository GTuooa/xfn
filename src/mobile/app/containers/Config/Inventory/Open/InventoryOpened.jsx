import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, ChosenPicker, Row, Amount } from 'app/components'

import Item from './InventoryOpenedItem.jsx'
import AssistSelect from './AssistSelect.jsx'
import * as thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class InventoryOpened extends React.Component {
    batchList = []
    state = {
        show: false,
        idx: '',
        openUuidList: [],
        oriBatch: [],//当前选中的批次
        oriAssistList: [],//当前选中的属性
    }
    componentDidMount() {
        thirdParty.setTitle({title: '期初余额'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})

        this.props.inventoryConfState.getIn(['inventoryCardTemp', 'financialInfo', 'batchList']).forEach(v => {
            const batch = v.get('batch')
            const productionDate = v.get('productionDate') ? v.get('productionDate') : ''
            const expirationDate = v.get('expirationDate') ? v.get('expirationDate') : ''
            const keyStr = expirationDate ? `${batch}(${expirationDate})` : batch

            this.batchList.push({
                key: keyStr,
                value: v.get('batch'),
                batchUuid: v.get('batchUuid') ? v.get('batchUuid') : '',
                productionDate,
                expirationDate,
            })
        })
    }

    render() {

        const {dispatch, history, inventoryConfState, } = this.props
        const { show, idx, openUuidList, oriBatch, oriAssistList } = this.state

		const insertOrModify = inventoryConfState.getIn(['views','insertOrModify'])
        const usedOpenSerial = inventoryConfState.getIn(['views','usedOpenSerial'])
        const usedOpenBatch = inventoryConfState.getIn(['views','usedOpenBatch'])
        const warehouseTree = inventoryConfState.get('warehouseTree').toJS()
		const inventoryCardTemp = inventoryConfState.get('inventoryCardTemp')
        const isOpenedQuantity = inventoryCardTemp.get('isOpenedQuantity')//是否启用数量管理
		const openList = inventoryCardTemp.get('openList')//包含期初数量 期初余额的仓库树
		const opened = inventoryCardTemp.get('opened')
		const openedQuantity = inventoryCardTemp.get('openedQuantity')
		const unit = inventoryCardTemp.get('unit')
        const inventoryUuid = inventoryConfState.getIn(['inventoryCardTemp','uuid'])

        const financialInfo = inventoryCardTemp.get('financialInfo')
        const openAssist = financialInfo.get('openAssist')//属性
        const openSerial = financialInfo.get('openSerial')//序列号
        const openBatch = financialInfo.get('openBatch')//批次
        const openShelfLife = financialInfo.get('openShelfLife')//保质期
        const assistClassificationList = financialInfo.get('assistClassificationList')//属性列表

		const showChildList = inventoryConfState.get('showChildList')//期初页面展开的uuid


		const loop = (data, leve, parentUuidList) => {

			let elementList = []
			data && data.forEach((item, i) => {
				const showChild = showChildList.includes(item.get('warehouseUuid'))
				const childListSize = item.get('childList').size
                const isEnd = item.get('isEnd')//末级仓库

				let allUuidList = [...parentUuidList]
				allUuidList.push(item.get('warehouseUuid'))

				if (childListSize) {
					elementList.push(
						<div key={item.get('warehouseUuid')}>
							<Item
								leve={leve}
                                idx={i}
								hasSub={true}
								isExpanded={showChild}
								item={item}
								dispatch={dispatch}
								isOpenedQuantity={isOpenedQuantity}
								parentUuidList={allUuidList}
                                openAssist={openAssist}
                                openSerial={openSerial}
                                openBatch={openBatch}
                                openShelfLife={openShelfLife}
							/>
							{ (showChild || isEnd) ? loop(item.get('childList'), leve+1, allUuidList) : ''}
						</div>
					)
				} else {
                    const assistList = item.get('assistList') ? item.get('assistList') : fromJS([])
                    const batch = item.get('batch') ? item.get('batch') : ''
                    const batchUuid = item.get('batchUuid') ? item.get('batchUuid') : ''
                    const productionDate = item.get('productionDate') ? item.get('productionDate') : ''
                    const expirationDate = item.get('expirationDate') ? item.get('expirationDate') : ''

					elementList.push(
						<Item
							leve={leve}
                            idx={i}
							hasSub={false}
							key={`${item.get('warehouseUuid')}_${i}`}
							item={item}
							dispatch={dispatch}
							isOpenedQuantity={isOpenedQuantity}
							parentUuidList={allUuidList}
                            openAssist={openAssist}
                            openSerial={openSerial}
                            openBatch={openBatch}
                            openShelfLife={openShelfLife}
                            assistClick={() => this.setState({
                                show: true,
                                idx: i,
                                openUuidList: allUuidList,
                                oriAssistList: assistList.toJS(),
                                oriBatch: {batch,
                                    batchUuid,
                                    productionDate,
                                    expirationDate,
                                    keyStr: expirationDate ? `${batch}(${expirationDate})` : batch
                                },
                            })}
                            serialClick={() => {
                                const openedQuantity = item.get('openedQuantity') ? item.get('openedQuantity') : 0
                                const serialList = item.get('serialList') ? item.get('serialList') : fromJS([])
                                const openUuid = item.get('openUuid')

                                if (openedQuantity && serialList.size==0 && usedOpenSerial) {
                                    dispatch(inventoryConfAction.changeData('serial', fromJS({
                                        serialList: [],
                                        type: 'OPENTREE',
                                        idx: i,
                                        openUuidList: allUuidList,
                                        oldValue: openedQuantity,
                                    }), true))
                                    dispatch(inventoryConfAction.getSerialList(inventoryUuid,openUuid))
                                } else {
                                    dispatch(inventoryConfAction.changeData('serial', fromJS({
                                        serialList,
                                        type: 'OPENTREE',
                                        idx: i,
                                        openUuidList: allUuidList,
                                        oldValue: openedQuantity,
                                    }), true))
                                }
                                history.push('/config/inventory/serial')

                            }}
						/>
					)

				}
			})
			return elementList
		}

        let selectWarehouse = []
        const findSelectWarehouse = (data) => {
            data.forEach(v => {
                if (!v['isEnd'] && v['childList'].length) {
                    findSelectWarehouse(v['childList'])
                } else {
                    selectWarehouse.push({
                        key: v['warehouseUuid'],
                        label: v['warehouseName']
                    })
                }
            })
        }
        findSelectWarehouse(openList.toJS())


        return(
            <Container className="inventory-config">
                <div className='inventory-opened-title'>
                    <ChosenPicker
                        className='flex-four'
                        multiSelect={true}
                        value={selectWarehouse}
                        district={warehouseTree}
                        onOk={(value) => {
							const uuidList = value.map(v => v['uuid'])
							let uuid = ''
							if (insertOrModify=='modify') {
								uuid = inventoryCardTemp.get('uuid')
							}
							dispatch(inventoryConfAction.getOpenWarehouseTree(uuidList, uuid))
                        }}
                    >
                        <Row>
                            <span>仓库</span>
                            <Icon type="triangle" />
                        </Row>
                    </ChosenPicker>
                    {isOpenedQuantity ? <div className='inventory-title-item flex-three overElli'>数量({unit.get('name')})</div> : null}
                    <div className='inventory-title-item flex-three'>期初余额(元)</div>
                </div>

                <ScrollView flex='1' className="border-top">
					{loop(openList, 1, [])}
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
                        batch['assistList'] = assistValue
                        dispatch(inventoryConfAction.changeOpened('openedAssist', openUuidList, batch, '', idx))
                        this.setState({show: false})
                    }}
                    addClick={() => {
                        const oriBatchList = financialInfo.get('batchList')
                        const shelfLife = financialInfo.get('shelfLife')//默认保质期天数
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
                        const shelfLife = financialInfo.get('shelfLife')//默认保质期天数
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
