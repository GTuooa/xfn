import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, Form, Switch } from 'app/components'
const { Label, Item } = Form

import { configCheck } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class Assist extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '辅助属性'})
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

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
        const isOpenedWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')//开启了仓库管理
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
        const assistClassificationList = inventoryConfState.get('assistClassificationList')//所有的属性列表

        const inventoryCardTemp = inventoryConfState.get('inventoryCardTemp')
        const openAssist = inventoryCardTemp.getIn(['financialInfo', 'openAssist'])
        const cardAssistClassificationList = inventoryCardTemp.getIn(['financialInfo', 'assistClassificationList'])//卡片选中的列表

        let assistClassList = []//选中的属性类别列表
        let classPropertyList = []//属性列表和属性类别列表一一对应
        let assistPropertyList = []//选中的所有属性列表
        cardAssistClassificationList.map((v, i) => {
            assistClassList.push(v.get('uuid'))
            let arr = []
            v.get('propertyList').forEach(w => {
                assistPropertyList.push(w.get('uuid'))
                arr.push(w.get('uuid'))
            })
            classPropertyList.push(arr)
        })

        return(
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="辅助属性">
                            <span className="noTextSwitch">
                                <Switch
                                    checked={openAssist}
                                    onClick={()=> {
                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'openAssist'], !openAssist))
                                        dispatch(inventoryConfAction.clearOpenedQuantity(isOpenedWarehouse ? 'OPENTREE' : 'OPENLIST'))
                                    }}
                                />
                            </span>
                        </Item>
                    </Form>
                    {
                        openAssist && assistClassificationList.map((v, i) => {//渲染所有的属性
                            const classificationUuid = v.get('uuid')
                            const classificationName = v.get('name')

                            return (
                                <div key={classificationUuid} className='config-list-item-wrap-style margin-top'>
                                    <div className="config-list-item-style"
                                        onClick={() => {
                                            dispatch(inventoryConfAction.changeData(['assist', 'classificationUuid'], v.get('uuid')))
                                            dispatch(inventoryConfAction.changeData(['assist', 'classificationName'], v.get('name')))
                                            dispatch(inventoryConfAction.changeData(['assist', 'propertyList'], v.get('propertyList')))
                                            history.push('/config/inventory/assistClass')
                                        }}
                                    >
                                        <span className='config-list-item-info-style'>
                                            {v.get('name')}
                                        </span>
                                        <span className="config-list-item-arrow-style black">
                                            <Icon type="arrow-right" />
                                        </span>
                                    </div>

                                    <div className="border-top padding-top" style={{display: v.get('propertyList').size ? '' : 'none'}}>
                                        { v.get('propertyList').map(property => {
                                            const propertyUuid = property.get('uuid')
                                            const propertyName = property.get('name')
                                            let classStr = 'assist-button', disabled = false, select = false

                                            if (assistPropertyList.includes(propertyUuid)) {
                                                select = true
                                                classStr = 'assist-button assist-select'
                                            } else {
                                                if (assistClassList.length > 2 && (!assistClassList.includes(classificationUuid))) {
                                                    disabled = true
                                                    classStr = 'assist-button gray'
                                                }
                                            }
                                            return (
                                                <span className={classStr}
                                                    key={propertyUuid}
                                                    onClick={() => {
                                                        if (disabled) { return }

                                                        let newList = []
                                                        if (select) {//取消选中
                                                            const classIdx = assistClassList.findIndex(uuid => uuid == classificationUuid)
                                                            const propertyIdx = classPropertyList[classIdx].findIndex(uuid => uuid == propertyUuid)

                                                            if (classPropertyList[classIdx].length==1) {//最后一个
                                                                newList = cardAssistClassificationList.delete(classIdx)
                                                            } else {
                                                                newList = cardAssistClassificationList.deleteIn([classIdx, 'propertyList', propertyIdx])
                                                            }
                                                        } else {//选中
                                                            if (assistClassList.includes(classificationUuid)) {//分类已存在
                                                                const classIdx = assistClassList.findIndex(uuid => uuid == classificationUuid)
                                                                newList = cardAssistClassificationList.setIn([classIdx, 'propertyList', classPropertyList[classIdx].length], fromJS({uuid: propertyUuid, name: propertyName}))
                                                            } else {
                                                                newList = cardAssistClassificationList.push(fromJS({
                                                                    uuid: classificationUuid,
                                                                    name: classificationName,
                                                                    isUniform: true,
                                                                    propertyList: [{uuid: propertyUuid, name: propertyName}]
                                                                }))
                                                            }

                                                        }
                                                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'assistClassificationList'], newList))
                                                    }}
                                                >
                                                    {propertyName}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className='assist-card margin-top'
                        style={{display: openAssist ? '' : 'none'}}
                        onClick={() => {
                            thirdParty.Prompt({
                                title: '属性分类',
                                message: '请输入属性分类名称:',
                                buttonLabels: ['取消', '确认'],
                                onSuccess: (result) => {
                                    if (result.buttonIndex === 1) {
                                        const checkList = [{
                                            type:'topestName',
                                            value: result.value,
                                        }]
                                        configCheck.beforeSaveCheck(checkList, () => {
                                            dispatch(inventoryConfAction.changeData(['assist', 'classificationName'], result.value))
                                            dispatch(inventoryConfAction.changeData(['assist', 'type'], 'assistClassInsert'))
                                            dispatch(inventoryConfAction.saveInventoryAssist(()=>{}))
                                        })
                                    }
                                }
                            })
                        }}>
                        <span className='blue'><Icon type="add"/>新增属性分类</span>
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
