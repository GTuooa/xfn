import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Form, Switch, XfInput } from 'app/components'
const { Label, Item } = Form

import { configCheck } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class Bach extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '批次管理'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
    }

    render() {
        const { dispatch, history, homeState, inventoryConfState } = this.props

        const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
        const isOpenedWarehouse = moduleInfo.includes('WAREHOUSE')//开启了仓库管理
        // const moduleShelfLife = moduleInfo.includes('SHELF_LIFE')//权限是否开启保质期管理
        const financialInfo = inventoryConfState.getIn(['inventoryCardTemp','financialInfo'])
        const openBatch = financialInfo.get('openBatch')
        const openShelfLife = financialInfo.get('openShelfLife')
        const shelfLife = financialInfo.get('shelfLife')
        const allBatchList = inventoryConfState.getIn(['batch', 'allBatchList'])
        

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="批次管理">
                            <span className="noTextSwitch">
                                <Switch
                                    checked={openBatch}
                                    onClick={()=> {
                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'openBatch'], !openBatch))
                                        dispatch(inventoryConfAction.clearOpenedQuantity(isOpenedWarehouse ? 'OPENTREE' : 'OPENLIST'))
                                        if (openBatch) {
                                            dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'openShelfLife'], false))
                                        }
                                    }}
                                />
                            </span>
                        </Item>

                        <Item label="保质期管理" className='margin-top' style={{display: openBatch ? '' : 'none'}}>
                            <span className="noTextSwitch">
                                <Switch
                                    checked={openShelfLife}
                                    onClick={()=> {
                                        if (allBatchList.size) {
                                            return thirdParty.Alert('请先删除原有批次')
                                        }
                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'openShelfLife'], !openShelfLife))
                                    }}
                                />
                            </span>
                        </Item>

                        <Item label="保质日期" className="config-form-item-input-style"
                            style={{display: openBatch && openShelfLife ? '' : 'none'}}
                        >
                            <XfInput
                                placeholder="支持数字"
                                value={shelfLife}
                                onChange={value => configCheck.inputCheck('shelfLife', value, () => {dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'shelfLife'], value))})}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                    </Form>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => {history.goBack()}}>
						<Icon type="confirm"/>
						<span>确定</span>
					</Button>
                </ButtonGroup>
            </Container>
        )
    }
}
