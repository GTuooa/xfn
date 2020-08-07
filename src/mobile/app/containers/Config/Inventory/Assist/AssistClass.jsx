import React from 'react'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Form } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { configCheck } from 'app/utils'
const { Label, Control, Item } = Form

import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class AssistClass extends React.Component {

    render() {
        const {dispatch, history, inventoryConfState, } = this.props

        const assist = inventoryConfState.get('assist')
        const classificationUuid = assist.get('classificationUuid')
        const classificationName = assist.get('classificationName')
		const propertyList = assist.get('propertyList')
		const uuid = assist.get('uuid')
		const name = assist.get('name')
		const type = assist.get('type')

		const showPrompt = () => {
            thirdParty.Prompt({
                title: type=='assistClassModify' ? '属性分类' : '属性',
                message: type=='assistClassModify' ? '请输入属性分类名称:' : '请输入属性名称:',
                buttonLabels: ['取消', '确认'],
                onSuccess: (result) => {
                    if (result.buttonIndex === 1) {
						const checkList = [{
							type:'topestName',
							value: result.value,
						}]
                        const changeType = type=='assistClassModify' ? 'classificationName' : 'name'
						configCheck.beforeSaveCheck(checkList, () => {
							dispatch(inventoryConfAction.changeData(['assist', changeType], result.value))
							dispatch(inventoryConfAction.saveInventoryAssist(()=>{}))
						})
                    }
                }
            })
        }

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="分类名称" className="config-form-item-input-style"
                            onClick={() => {
                                dispatch(inventoryConfAction.changeData(['assist', 'type'], 'assistClassModify'))
                                showPrompt()
                            }}
                        >
                            <span>{classificationName}</span>
                        </Item>
                    </Form>

                    <ul className="inventory-config-card margin-top">
                        {
                            propertyList.map((v,index) =>{
                                return (
                                    <li key={v.get('uuid')} className='config-list-item-wrap-style'>
                                        <div className="config-list-item-style" >
                                            <span className='config-list-item-checkbox-style red margin-right'
                                                onClick={(e)=> {
                                                    dispatch(inventoryConfAction.changeData(['assist', 'uuid'], v.get('uuid')))
                                                    dispatch(inventoryConfAction.changeData(['assist', 'type'], 'assistPropertyDelete'))
                                                    dispatch(inventoryConfAction.deleteInventoryAssist(()=>{}))
                                                }}
                                            >
                                                <Icon type="delete-plus"/>
                                            </span>
                                            <span className='config-list-item-info-style'
                                                onClick={(e)=> {
                                                    dispatch(inventoryConfAction.changeData(['assist', 'uuid'], v.get('uuid')))
                                                    dispatch(inventoryConfAction.changeData(['assist', 'type'], 'assistPropertyModify'))
                                                    showPrompt()
                                                }}
                                            >
                                                {v.get('name')}
                                            </span>
                                        </div>
                                    </li>
                                )
                            })
                        }
                        <li className='config-list-item-wrap-style' onClick={(e)=> {
                            dispatch(inventoryConfAction.changeData(['assist', 'type'], 'assistPropertyInsert'))
							showPrompt()
                        }}>
                            <div className="config-list-item-style blue">
                                <span className='config-list-item-checkbox-style margin-right'>
                                    <Icon type="add-small"/>
                                </span>
                                <span className='config-list-item-info-style blue'>
                                    新增属性
                                </span>
                            </div>
                        </li>
                    </ul>

                    <div className='assist-card margin-top'
                        onClick={() => {
                            dispatch(inventoryConfAction.changeData(['assist', 'type'], 'assistClassDelete'))
                            dispatch(inventoryConfAction.deleteInventoryAssist(()=>{history.goBack()}))
                        }}>
                        <span className='red'>删除属性分类</span>
                    </div>
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
