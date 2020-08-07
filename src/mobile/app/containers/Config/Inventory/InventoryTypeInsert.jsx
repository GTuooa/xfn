import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, XfInput, Checkbox, Form } from 'app/components'
import thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
const { Label, Control, Item } = Form
import TypeTreeSelect from 'app/containers/components/TypeTreeSelect'

import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class InventoryTypeInsert extends React.Component {

	static displayName = 'InventoryTypeInsert'

	static propTypes = {
		dispatch: PropTypes.func
	}

    constructor(props) {
		super(props)
		this.state = {
            showTypeModal: false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '子类别设置'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
    }

    render() {

        const {
			dispatch,
			history,
            inventoryConfState
		} = this.props
        const { showTypeModal } = this.state

        const inventoryTypeTemp = inventoryConfState.get('inventoryTypeTemp')
        const name = inventoryTypeTemp.get('name')
        const parentUuid = inventoryTypeTemp.get('parentUuid')
        const parentName = inventoryTypeTemp.get('parentName')
        const typeList = inventoryConfState.get('typeList')

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="类别名称" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="最长30个字符"
                                value={name}
                                onChange={(value)=> dispatch(inventoryConfAction.changeCardTypeContent('name',value))}
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
                            typeList={typeList}
							parentDisabled={false}
                            onCancel={() => this.setState({showTypeModal: false})}
                            onChange={(item) => {
                                const uuid = item.key
                                const name = item.label
                                dispatch(inventoryConfAction.changeCardTypeSelect(uuid, name))
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
							configCheck.beforeSaveCheck(checkList, () =>dispatch(inventoryConfAction.saveInventoryCardType(toInventoryType)))
                        }}
                    >
                        <Icon type="select" />
                        <span>保存</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
