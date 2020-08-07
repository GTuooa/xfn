import React from 'react'
import { connect }	from 'react-redux'

import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, XfInput, Form } from 'app/components'
const { Item, Label } = Form

import * as thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class serialBatch extends React.Component {
    state = {
        left: '',
        idx: '',
        step: '',
        number: ''
    }
    componentDidMount() {
        thirdParty.setTitle({title: '批量添加序列号'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
    }

    render() {
        const { dispatch, history, inventoryConfState } = this.props
        const { left, idx, step, number} = this.state

        const serial = inventoryConfState.get('serial')
        const serialList = inventoryConfState.getIn(['serial', 'serialList'])
        const type = serial.get('type')//OPENTREE OPENLIST

        const addClick = (addNew) => {
            if (step < 1) {
                return thirdParty.Alert('请输入递增量')
            }
            if (number < 1) {
                return thirdParty.Alert('请输入个数')
            }
            if (number > 1000) {
                return thirdParty.Alert('个数不可大于1000')
            }

            let last = `${left}${Number(idx)+number*Number(step)}`
            if (last.length>20) {
                return thirdParty.Alert('序列号的位数不可超过20位')
            }
            let numberLength = String(Number(idx)+number*Number(step)).length
            let arr=[]
            for (let i=0; i<number ; i++) {
                let currentNumber = String(Number(idx)+i*Number(step))
                arr.push({
                    serialNumber: `${left}${currentNumber.padStart(numberLength,'0')}`,
                    serialUuid: '',
                })
            }

            dispatch(inventoryConfAction.changeData(['serial', 'serialList'], serialList.concat(fromJS(arr))))
            if (addNew) {
                this.setState({
                    left: '',
                    idx: '',
                    step: '',
                    number: ''
                })
            } else {
                history.goBack()
            }
        }

        return (
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="前缀" className="config-form-item-input-style">
                            <XfInput
                                placeholder="请输入前缀"
                                value={left}
                                onChange={value => {
                                    if (/^[^\u4e00-\u9fa5]{0,20}$/g.test(value)) {//非中文
                                        this.setState({left: value})
                                    }
                                }}
                            />
                        </Item>
                        <Item label="起始号" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="请输入起始号"
                                value={idx}
                                onChange={value => {
                                    if (/^[0-9]*$/g.test(value)) {
                                        this.setState({idx: value})
                                    }

                                }}
                            />
                        </Item>
                        <Item label="递增量" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="请输入递增量"
                                value={step}
                                onChange={value => {
                                    if (/^[0-9]*$/g.test(value)) {
                                        this.setState({step: value})
                                    }
                                }}
                            />
                        </Item>
                        <Item label="个数" showAsterisk className="config-form-item-input-style">
                            <XfInput
                                placeholder="支持数字"
                                value={number}
                                onChange={value => {
                                    if (/^[0-9]*$/g.test(value)) {
                                        this.setState({number: value})
                                    }
                                }}
                            />
                        </Item>
                    </Form>
                </ScrollView>
                <ButtonGroup>
                    <Button onClick={() => history.goBack()}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>

                    <Button onClick={() => { addClick() }}>
                        <Icon type="save" />
                        <span>添加</span>
                    </Button>
                    <Button onClick={() => addClick(true)}>
						<Icon type="new"/>
						<span>添加并继续</span>
					</Button>

                </ButtonGroup>
            </Container>
        )
    }
}
