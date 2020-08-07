import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView,Checkbox } from 'app/components'
import thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class InventoryHighType extends React.Component {

    static displayName = 'InventoryHighType'

    constructor(props) {
		super(props)
		this.state = {
            showCheckBox:false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '类别管理'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
    }

    render() {
        const {
			dispatch,
			history,
            inventoryConfState,
            homeState
		} = this.props

        const { showCheckBox } = this.state

        const highTypeList = inventoryConfState.get('highTypeList').delete(0)
        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
        console.log(highTypeList.toJS());

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    {
                        highTypeList.map((v,i) =>
                            <div
                                className='config-list-item-wrap-style'
                                key = {v.get('uuid')}
                                onClick={() => {
                                    if (!showCheckBox) {//跳入子类别管理页面
                                        dispatch(inventoryConfAction.getHighTypeTree(v))
                                        history.push('/config/inventory/inventoryType')
                                    } else {
                                        dispatch(inventoryConfAction.changeHighTypeBoxStatus(!v.get('checked'),v.get('uuid')))
                                    }
                                }}
                            >
                                <div className="config-list-item-style">
                                    <span className='config-list-item-checkbox-style' style={{display:showCheckBox ? '' : 'none'}}>
                                        <Checkbox checked={v.get('checked')}/>
                                    </span>
                                    <span className='config-list-item-info-style'>
                                        {v.get('name')}
                                    </span>
                                    <span className="config-list-item-arrow-style">
                                        <Icon type="arrow-right" />
                                    </span>
                                </div>
                            </div>
						)
                    }
                </ScrollView>

                <ButtonGroup style={{display:showCheckBox ? 'none' : 'flex'}}>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                            dispatch(inventoryConfAction.beforeAddModalHighType())
                            thirdParty.Prompt({
                                title: '新增主类别',
                                message: '请输入类别名称:',
                                buttonLabels: ['取消', '确认'],
                                onSuccess: (result) => {
                                    if (result.buttonIndex === 1) {
                                        const checkList = [{type: 'topestName', value: result.value}]
                                        configCheck.beforeSaveCheck(checkList, () => {
                                            dispatch(inventoryConfAction.changeHighTypeContent('name', result.value))
                                            dispatch(inventoryConfAction.saveInventorySettingContent(result.value))
                                        })
                                    }
                                }
                            })

                    }}>
                        <Icon type="add-plus"/>
                        <span>新增</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => this.setState({showCheckBox:true})}
                        >
                        <Icon type="select" />
                        <span>选择</span>
                    </Button>
                </ButtonGroup>
                <ButtonGroup style={{display:showCheckBox ? 'flex' : 'none'}}>
                    <Button
                        onClick={() => {
                            dispatch(inventoryConfAction.clearCardSelectList('highTypeList'))
                            this.setState({showCheckBox:false})
                        }}
                    >
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                        const closeModal = () => this.setState({showCheckBox:false})
                        dispatch(inventoryConfAction.deleteHighType(closeModal))
                    }}>
                        <Icon type="select" />
                        <span>删除</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
