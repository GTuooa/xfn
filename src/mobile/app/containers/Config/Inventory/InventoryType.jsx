import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Form } from 'app/components'
const { Item } = Form
import * as thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
import TreeCom from 'app/containers/components/TreeCom/index.js'

import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class InventoryType extends React.Component {

    static displayName = 'InventoryType'

    constructor(props) {
		super(props)
		this.state = {
            showCheckBox:false,
			swapPosition : false,
            addType : false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '类别管理'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({
            showIcon: false
        })
    }

    componentWillUnmount(){
        const state = this.props.inventoryConfState
        const activeTabKeyUuid = state.getIn(['views', 'activeTabKeyUuid'])
        const uuid = state.getIn(['inventoryHighTypeTemp', 'uuid'])
        const name = state.getIn(['inventoryHighTypeTemp', 'name'])

        if (activeTabKeyUuid==uuid) {
            this.props.dispatch(inventoryConfAction.changeActiveHighType(fromJS({uuid,name})))
        }
    }

    render() {

        const {
			dispatch,
			history,
            inventoryConfState
		} = this.props

        const { showCheckBox, swapPosition, addType } = this.state

        const inventoryHighTypeTemp = inventoryConfState.get('inventoryHighTypeTemp')
        const treeList = inventoryHighTypeTemp.get('treeList')
        const name = inventoryHighTypeTemp.get('name')

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form style={{marginBottom: '.1rem'}}>
                        <Item label="主类别名称" showAsterisk className="config-form-item-input-style">
                            <div onClick={() => {
                                thirdParty.Prompt({
                                    title: '修改主类别名称',
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
                                {name}&nbsp;<Icon type="arrow-right" size="14" />
                            </div>
                        </Item>
                    </Form>
                    <TreeCom
                        dispatch={dispatch}
                        treeList={treeList}
                        itemClick={(uuid, name) => {
                            if (name=='全部') {
                                return
                            }
                            dispatch(inventoryConfAction.getInvetTypeInfo(uuid))
                            history.push('/config/inventory/inventoryTypeInsert')
                        }}
                        isSort={swapPosition}
                        sortClick={(selectedUuid, swappedUuid) => {
                            dispatch(inventoryConfAction.typeSwapPosition(selectedUuid, swappedUuid))
                        }}
                        isAdd={addType}
                        addClick={(uuid, name)=>{
                            dispatch(inventoryConfAction.insertAddInventoryCardType(uuid, name))
                            history.push('/config/inventory/inventoryTypeInsert')
                        }}
                        isDelete={showCheckBox}
                        deleteClick={(uuid, name, value) => {
                            if (name != '全部') {
                                dispatch(inventoryConfAction.changeTypeSelectList(uuid, value))
                            }
                        }}
                    />
                </ScrollView>

                <ButtonGroup style={{display:showCheckBox || swapPosition || addType ? 'none' : 'flex'}}>
                    <Button onClick={() => { this.setState({addType:true})}}>
                        <Icon type="add-plus"/>
                        <span>新增</span>
                    </Button>
                    <Button onClick={() => this.setState({showCheckBox:true})}>
                        <Icon type="select" />
                        <span>选择</span>
                    </Button>
                    <Button onClick={() => this.setState({swapPosition:true})}>
                        <Icon type="swap-position-small" />
                        <span>调整顺序</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display:showCheckBox ? 'flex' : 'none'}}>
                    <Button
                        onClick={() => {
                            dispatch(inventoryConfAction.clearCardSelectList('treeList'))
                            this.setState({showCheckBox:false})
                        }}
                    >
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button onClick={() => {
                        const closeModal = () => this.setState({showCheckBox:false})
                        dispatch(inventoryConfAction.confirmDeleteType(treeList, closeModal))
                    }}>
                        <Icon type="select" />
                        <span>删除</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display:swapPosition ? 'flex' : 'none'}}>
                    <Button onClick={() => this.setState({ swapPosition: false })}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display:addType ? 'flex' : 'none'}}>
                    <Button onClick={() => { this.setState({addType: false}) }}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
