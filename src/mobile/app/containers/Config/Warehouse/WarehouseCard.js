import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, TextInput, Switch, Row, Form } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
const { Item } = Form

import * as warehouseConfActions from 'app/redux/Config/Warehouse/WarehouseConf.action.js'

@connect(state => state)
export default
class WarehouseCard extends React.Component {

	static displayName = 'WarehouseCard'

	static propTypes = {
		dispatch: PropTypes.func
	}

    constructor(props) {
		super(props)
		this.state = {}
    }

    componentDidMount() {
        thirdParty.setTitle({title: '仓库卡片'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
    }

    render() {
        const { dispatch, warehouseState, history, homeState } = this.props

        const insertOrModify = warehouseState.getIn(['views', 'insertOrModify'])
		const fromPage = warehouseState.getIn(['views','fromPage'])
        const data = warehouseState.get('data')
        const canUse = data.get('canUse')
        const isInsert = warehouseState.getIn(['views', 'insertOrModify']) == 'insert' ? true : false
        const treeList = warehouseState.get('treeList')

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        return(
            <Container className="warehouse-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="仓库编码" showAsterisk className="config-form-item-input-style">
                            <TextInput
                                placeholder='支持数字和英文大小写'
                                value={data.get('code')}
                                onChange={value => configCheck.inputCheck('code', value, () => {
                                    dispatch(warehouseConfActions.changeWarehouseData(['data','code'], value))
                                })}
                            />
                        </Item>
                        <Item label="仓库名称" showAsterisk className="config-form-item-input-style">
                            <TextInput
                                placeholder='填写名称'
                                value={data.get('name')}
                                onChange={(value) => {
                                    dispatch(warehouseConfActions.changeWarehouseData(['data','name'], value))
                                }}
                            />
                        </Item>

                        <Item label="上级仓库">
                            {data.getIn(['parentCard', 'code'])=='ALLCRD' ? '无' : data.getIn(['parentCard', 'name'])}
                        </Item>

						<Item label="启用/停用" style={{display: insertOrModify == 'insert' ? 'none' : ''}}>
                            <span className="noTextSwitchShort">
                                <Switch
                                    checked={canUse}
                                    onClick={()=> {
										dispatch(warehouseConfActions.changeWarehouseData(['data','canUse'], !canUse))
                                    }}
                                />
                            </span>
                        </Item>
                    </Form>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => {
                        history.goBack()
                    }}>
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
							configCheck.beforeSaveCheck([
								{
									type: 'name',
									value: data.get('name')
								}, {
									type: 'code',
									value: data.get('code')
								}
							], () => {
								dispatch(warehouseConfActions.checkWarehouseCard(history))
							})
                    }}>
                        <Icon type="save"/><span>保存</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        style={{display: insertOrModify == 'insert' && fromPage !== 'otherPage' ? '' : 'none'}}
                        onClick={() => {
                            configCheck.beforeSaveCheck([
                                {
                                    type: 'name',
                                    value: data.get('name')
                                }, {
                                    type: 'code',
                                    value: data.get('code')
                                }
                            ], () => {
                                dispatch(warehouseConfActions.checkWarehouseCard(history, true))
                            })
                    }}>
                        <Icon type="new"/><span>保存并新增</span>
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}
