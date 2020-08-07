import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Form, Switch, Row, Single } from 'app/components'
const { Label, Item } = Form
import Price from '../Price'

import { configCheck, DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class QuantitySet extends React.Component {

    render() {
        const { dispatch, history, homeState, inventoryConfState } = this.props

        const isOpenedWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理
        const moduleSerial = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('SERIAL')//开启了序列号
        const usedQuantity = inventoryConfState.getIn(['views', 'usedQuantity'])
        const usedOpened = inventoryConfState.getIn(['views', 'usedOpened'])
        const insertOrModify = inventoryConfState.getIn(['views','insertOrModify'])
        const inventoryCardTemp = inventoryConfState.get('inventoryCardTemp')
        const unitList = inventoryConfState.get('unitList').toJS()
        const purchasePriceList = inventoryConfState.get('purchasePriceList')//采购价列表
        const salePriceList = inventoryConfState.get('salePriceList')//销售价列表

        const isOpenedQuantity = inventoryCardTemp.get('isOpenedQuantity')//是否启用数量管理
        const assemblySheet = inventoryCardTemp.get('assemblySheet')
        const assemblyState = inventoryCardTemp.get('assemblyState')
        const unit = inventoryCardTemp.get('unit')//计量单位
        const unitName = inventoryCardTemp.getIn(['unit','fullName'])
        const financialInfo = inventoryCardTemp.get('financialInfo')
        const openSerial = inventoryCardTemp.getIn(['financialInfo', 'openSerial'])//是否启用序列号管理

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="数量管理">
                            <span className="noTextSwitch">
                                <Switch
                                    checked={isOpenedQuantity}
                                    onClick={()=> {
                                        if (isOpenedQuantity) {//由开启到关闭
                                            if (assemblySheet.get('materialList').size) {
                                                thirdParty.Confirm({
                                                    message: `关闭数量核算后，不可使用组装功能，组装单设置内容将被清空`,
                                                    title: '提示',
                                                    buttonLabels: ['取消', '确定'],
                                                    onSuccess : (result) => {
                                                        if (result.buttonIndex==1) {
                                                            dispatch(inventoryConfAction.changeCardContent('assemblyState','CLOSE'))
                                                            dispatch(inventoryConfAction.changeCardContent('assemblySheet', fromJS({
                                                                unitUuid: '',
                                                                unitName: '',
                                                                quantity: '',
                                                                materialList: []
                                                            })))

                                                            dispatch(inventoryConfAction.changeCardContent('isOpenedQuantity', false))
                                                            dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo'], financialInfo.merge(fromJS({
                                                                openSerial: false,
                                                                openAssist: false,
                                                                openBatch: false,
                                                            }))))
                                                            dispatch(inventoryConfAction.clearOpenedQuantity(isOpenedWarehouse ? 'OPENTREE' : 'OPENLIST'))
                                                        }
                                                    },
                                                    onFail : (err) => {}
                                                })
                                                return
                                            }
                                            dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo'], financialInfo.merge(fromJS({
                                                openSerial: false,
                                                openAssist: false,
                                                openBatch: false,
                                            }))))
                                        }

                                        dispatch(inventoryConfAction.changeCardContent('isOpenedQuantity', !isOpenedQuantity))
                                        dispatch(inventoryConfAction.clearOpenedQuantity(isOpenedWarehouse ? 'OPENTREE' : 'OPENLIST'))
                                        if (!isOpenedQuantity && unitList.length==0) {
                                            dispatch(inventoryConfAction.getUnit())
                                        }
                                    }}
                                />
                            </span>
                        </Item>

                        <Item label="计量单位" showAsterisk className='unit' style={{display: isOpenedQuantity ? '' : 'none'}}>
                            <div className='unit-add' onClick={() => {
                                if (insertOrModify == 'modify' && usedQuantity) {
                                    history.push('/config/inventory/unitModify')
                                } else {
                                    history.push('/config/inventory/unit')
                                }
                            }}>
                                <span>{insertOrModify == 'modify' && usedQuantity ? '修改' : '新增'}</span>
                            </div>
                            <div className='unit-select'>
                                <Single
                                    district={unitList}
                                    disabled={(insertOrModify == 'modify' && usedQuantity) ? true : false}
                                    //value={unit.get('uuid')}--uuid存在一样的情况
                                    onOk={value => {
                                        dispatch(inventoryConfAction.changeCardContent('unit', fromJS(value)))
                                        dispatch(inventoryConfAction.changeData('purchasePriceList',fromJS([{
                                            unitUuid: value['uuid'],
                                            name: value['name'],
                                            defaultPrice: '',
                                            type: '1'
                                        }]), true))
                                        dispatch(inventoryConfAction.changeData('salePriceList', fromJS([{
                                            unitUuid: value['uuid'],
                                            name: value['name'],
                                            defaultPrice: '',
                                            type: '2'
                                        }]), true))

                                        if (insertOrModify == 'insert' && assemblyState=='OPEN') {
                                            dispatch(inventoryConfAction.changeCardContent('assemblySheet', fromJS({
                                                unitUuid: value['uuid'],
                                                unitName: value['name'],
                                                quantity: assemblySheet.get('quantity'),
                                                materialList: assemblySheet.get('materialList'),
                                            })))
                                        }
                                    }}
                                >
                                    <Row className={unitName ? 'config-form-item-select-item' : 'config-form-item-select-item config-form-item-select-item-holder'}>
                                        {unitName ? unitName : '请选择'}
                                    </Row>
                                </Single>
                                &nbsp;<Icon type="arrow-right" size="14" />
                            </div>
                        </Item>

                        <Item label="启用序列号" className='margin-top margin-bottom' style={{display: moduleSerial && isOpenedQuantity ? '' : 'none'}}>
                            <span className="noTextSwitch">
                                <Switch
                                    checked={openSerial}
                                    onClick={()=> {
                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'openSerial'], !openSerial))
                                        dispatch(inventoryConfAction.clearOpenedQuantity(isOpenedWarehouse ? 'OPENTREE' : 'OPENLIST'))
                                    }}
                                />
                            </span>
                        </Item>

                        {isOpenedQuantity ? <Price
                            unit={unit}
                            purchasePriceList={purchasePriceList}
                            salePriceList={salePriceList}
                            dispatch={dispatch}
                        /> : null}
                    </Form>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => history.goBack()}>
						<Icon type="confirm"/>
						<span>确定</span>
					</Button>
                </ButtonGroup>
            </Container>
        )
    }
}
