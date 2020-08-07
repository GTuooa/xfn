import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, XfInput, Form } from 'app/components'
import thirdParty from 'app/thirdParty'
const { Item } = Form
import TypeTreeSelect from 'app/containers/components/TypeTreeSelect'

import * as projectConfActions from 'app/redux/Config/Project/projectConf.action.js'

@connect(state => state)
export default
class ProjectTypeInsert extends React.Component {

	static displayName = 'ProjectTypeInsert'

    constructor(props) {
		super(props)
		this.state = {
            showTypeModal: false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '类别设置'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
    }

    render() {
        const { dispatch, projectConfState, history } = this.props
        const { showTypeModal } = this.state

        const currentType = projectConfState.getIn(['highTypeData', 'uuid'])
        const treeList = projectConfState.getIn(['highTypeData','treeList'])
        const treeData = projectConfState.get('treeData')

        return(
            <Container className="project-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="类别名称" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder='最长30个字符'
                                value={treeData.get('name')}
                                onChange={(value) => {
                                    dispatch(projectConfActions.changeProjectData(['treeData', 'name'], value))
                                }}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="上级类别" showAsterisk>
                            <div
                                onClick={() => {
                                    this.setState({showTypeModal: true})
                                }}
                            >
                                <span className="text-flow">{treeData.get('parentName')}</span>
                            </div>
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <TypeTreeSelect
                            visible={showTypeModal}
                            dispatch={dispatch}
                            typeList={treeList}
                            onCancel={() => this.setState({showTypeModal: false})}
                            onChange={(item) => {
                                const uuid = item.key
                                const name = item.label
                                dispatch(projectConfActions.changeProjectData(['treeData', 'parentUuid'], uuid))
                                dispatch(projectConfActions.changeProjectData(['treeData', 'parentName'], name))
                                this.setState({showTypeModal: false})
                            }}
                        >
                            <span></span>
                        </TypeTreeSelect>
                    </Form>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => {
                        history.goBack()
                    }}>
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                    <Button onClick={() => {
                        dispatch(projectConfActions.saveProjectTypeInsert(currentType, treeData, history))
                    }}>
                        <Icon type="save"/><span>保存</span>
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}
