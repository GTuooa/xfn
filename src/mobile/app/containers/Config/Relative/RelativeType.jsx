import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, Form, ScrollView } from 'app/components'
const { Item } = Form
import thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
import TreeCom from 'app/containers/components/TreeCom/index.js'

import * as relativeConfAction from 'app/redux/Config/Relative/relativeConf.action.js'

@connect(state => state)
export default
class RelativeType extends React.Component {

    static displayName = 'RelativeType'

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
        thirdParty.setIcon({showIcon: false})
    }
    componentWillUnmount(){
        const state = this.props.relativeConfState
        const activeTapKeyUuid = state.getIn(['views', 'activeTapKeyUuid'])
        const uuid = state.getIn(['relativeHighTypeTemp', 'uuid'])
        const name = state.getIn(['relativeHighTypeTemp', 'name'])

        if ([uuid].includes(activeTapKeyUuid)) {
            this.props.dispatch(relativeConfAction.getRelativeListAndTree(fromJS({'uuid': activeTapKeyUuid, 'name': activeTapKeyUuid ? name : '全部'})))
        }
    }

    render() {

        const {
			dispatch,
			history,
            relativeConfState
		} = this.props

        const { showCheckBox, swapPosition, addType } = this.state

        const relativeHighTypeTemp = relativeConfState.get('relativeHighTypeTemp')
        const treeList = relativeHighTypeTemp.get('treeList')
        const name = relativeHighTypeTemp.get('name')

        return(
            <Container className="iuManage-config">
                <ScrollView flex='1' className='iuManage-type-tree border-top'>
                <Form style={{marginBottom: '.1rem'}}>
                        <Item label="主类别名称" showAsterisk className="config-form-item-input-style">
                            <div onClick={() => {
                                thirdParty.Prompt({
                                    title: `修改主类别名称(${name})`,
                                    message: '请输入类别名称:',
                                    buttonLabels: ['取消', '确认'],
                                    onSuccess: (result) => {
                                        if (result.buttonIndex === 1) {
                                            const checkList = [{type: 'topestName', value: result.value}]
                                            configCheck.beforeSaveCheck(checkList, () => {
                                                dispatch(relativeConfAction.changeRelativeHighTypeContent('name',result.value))
                                                dispatch(relativeConfAction.saveRelativeHighTypeContent())
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
                            dispatch(relativeConfAction.getRelativeTypeInfo(uuid))
                            history.push('/config/relative/relativeTypeInsert')
                        }}
                        isSort={swapPosition}
                        sortClick={(selectedUuid, swappedUuid) => {
                            dispatch(relativeConfAction.typeSwapPosition(selectedUuid, swappedUuid))
                        }}
                        isAdd={addType}
                        addClick={(uuid, name)=>{
                            dispatch(relativeConfAction.insertRelativeType(uuid, name))
                            history.push('/config/relative/relativeTypeInsert')
                        }}
                        isDelete={showCheckBox}
                        deleteClick={(uuid, name, value) => {
                            if (name != '全部') {
                                dispatch(relativeConfAction.changeTypeSelectList(uuid, value))
                            }
                        }}
                    />
                </ScrollView>

                <ButtonGroup style={{display:showCheckBox || swapPosition || addType? 'none' : 'flex'}}>
                    <Button
                        onClick={() => {
                            this.setState({addType:true})
                        }}
                    >
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
                    <Button onClick={() => {
                        this.setState({showCheckBox:false})
                        dispatch(relativeConfAction.clearCardSelectList('relativeTree'))
                    }}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button onClick={() => {
                        const closeModal = () => this.setState({showCheckBox:false})
                        dispatch(relativeConfAction.confirmDeleteRelativeType(treeList, closeModal))
                    }}>
                        <Icon type="select" />
                        <span>删除</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display:swapPosition ? 'flex' : 'none'}}>
                    <Button onClick={() => {
                            this.setState({swapPosition:false})
                        }}
                    >
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup style={{display: addType ? 'flex' : 'none'}}>
                    <Button onClick={() => {
                            this.setState({addType:false})
                        }}
                    >
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
