import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, XfInput, Form } from 'app/components'
import thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
const { Item } = Form
import TypeTreeSelect from 'app/containers/components/TypeTreeSelect'

import * as relativeConfAction from 'app/redux/Config/Relative/relativeConf.action.js'

@connect(state => state)
export default
class RelativeTypeInsert extends React.Component {

	static displayName = 'RelativeTypeInsert'

    constructor(props) {
		super(props)
		this.state = {
            showTypeModal: false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '类别设置'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
    }

    render() {

        const { dispatch, history, relativeConfState } = this.props
        const { showTypeModal } = this.state

        const relativeTypeTemp = relativeConfState.get('relativeTypeTemp')
        const name = relativeTypeTemp.get('name')
        const parentName = relativeTypeTemp.get('parentName')

        const relativeHighTypeTemp = relativeConfState.get('relativeHighTypeTemp')
        const treeList = relativeHighTypeTemp.get('treeList')


        return(
            <Container className="relative-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="类别名称" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="必填（最长30个字符）"
                                value={name}
                                onChange={(value)=> dispatch(relativeConfAction.changeRelativeTypeContent('name',value))}
                            />
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <Item label="上级类别" showAsterisk>
                            <div
                                onClick={() => {
                                    this.setState({showTypeModal: true})
                                }}
                            >
                                <span className="text-flow">{parentName}</span>
                            </div>
                            &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                        </Item>
                        <TypeTreeSelect
                            visible={showTypeModal}
                            dispatch={dispatch}
                            typeList={treeList}
							parentDisabled={false}
                            onCancel={() => this.setState({showTypeModal: false})}
                            onChange={(item) => {
                                const uuid = item.key
                                const name = item.label
                                dispatch(relativeConfAction.changeRelativeTypeSelect(uuid, name))
                                this.setState({showTypeModal: false})
                            }}
                        >
                            <span></span>
                        </TypeTreeSelect>
                    </Form>
                </ScrollView>

                <ButtonGroup>
                    <Button onClick={() => history.goBack()}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button
                        onClick={() => {
                            const checkList = [{
								type:'name',
								value:name,
								limitLength: 30,
							}]
                            if (name=='全部') {
                                return thirdParty.toast.info('类别名称不能为全部')
                            }
                            const toInventoryType = () => history.goBack()
							configCheck.beforeSaveCheck(checkList, () =>dispatch(relativeConfAction.saveRelativeType(toInventoryType)))
                        }}
                    >
                        <Icon type="save" />
                        <span>保存</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
