import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, ScrollView, XfInput } from 'app/components'

import { configCheck, decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

@connect(state => state)
export default
class Serial extends React.Component {
    state={
        sortType: true//正序
    }

    componentDidMount() {
        thirdParty.setTitle({title: '录入序列号'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})
    }

    render() {
        const { dispatch, history, inventoryConfState } = this.props
        const { sortType } = this.state

        const serial = inventoryConfState.get('serial')
        const serialList = inventoryConfState.getIn(['serial', 'serialList'])
        const type = serial.get('type')//OPENTREE OPENLIST JR_ENTRY
        const idx = serial.get('idx')

        let errorList = []

        return(
            <Container className="inventory-config border-top">
                <div className="serial serial-title">
                    <div className='serial-left'>序号</div>
                    <div className='serial-right serial-title-right'>
                        <span onClick={() => {
                            if (type=='JR_ENTRY' && serialList.size>100) {
                                return thirdParty.Alert('序列号数量不可超过100')
                            }
                            if (serialList.size>1000) {
                                return thirdParty.Alert('序列号数量不可超过1000')
                            }
                            history.push('/config/inventory/serialBatch')
                        }}>
                            序列号 <Icon type="add-add"/>
                        </span>
                        <span className='sort' onClick={() => {
                            this.setState({sortType: !sortType})
                            dispatch(inventoryConfAction.changeData(['serial', 'serialList'], fromJS(serialList.toJS().sort((a,b) => {
                                if (a['serialNumber'] > b['serialNumber']) {
                                    return sortType ? -1 : 1
                                } else {
                                    return sortType ? 1 : -1
                                }
                            }))))
                        }}>
                            {sortType ? '升序' : '倒序'} <Icon type='sort'/>
                        </span>
                    </div>
                </div>
                <ScrollView flex='1'>
                    {
                        serialList.map((v,i) => {
                            const serialNumber = v.get('serialNumber')
                            const disabled = v.get('canModify')===false
                            if (!serialNumber) {
                                errorList.push(`序号${i+1}未填写序列号`)
                            }

                            return (
                                <div key={i} className="serial">
                                    <div className='serial-left'
                                        onClick={() => {
                                            if (disabled) { return }
                                            dispatch(inventoryConfAction.changeData(['serial', 'serialList'], serialList.delete(i)))
                                        }}>
                                        <Icon type="delete-plus" className={disabled ? 'gray' : 'red'}/>
                                        {i+1}
                                    </div>
                                    <div className='serial-right'>
                                        <XfInput.BorderInputItem
                                            disabled={disabled}
                                            textAlign="right"
                                            value={serialNumber}
                                            onChange={value => {
                                                configCheck.inputCheck('serial', value, () => {
                                                    dispatch(inventoryConfAction.changeData(['serial', 'serialList', i, 'serialNumber'], value))
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    }
                </ScrollView>
                <div className='serial-add-button' onClick={(e) => {
                    e.stopPropagation()
                    if (type=='JR_ENTRY' && serialList.size>100) {
                        return thirdParty.Alert('序列号数量不可超过100')
                    }
                    if (serialList.size>1000) {
                        return thirdParty.Alert('序列号数量超过1000,不可新增')
                    }
                    dispatch(inventoryConfAction.changeData(['serial', 'serialList'], serialList.push(fromJS({
                        serialUuid: "",
                        serialNumber: ""
                    }))))
                }}>
                    <Icon type="add-small"/>
                </div>

                <ButtonGroup>
                    <Button onClick={() => history.goBack()}>
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>

                    <Button
                        onClick={() => {
                            if (type=='JR_ENTRY' && serialList.size>100) {
                                return thirdParty.Alert('序列号数量不可超过100')
                            }
                            if (serialList.size>1000) {
                                return thirdParty.Alert('序列号数量不可超过1000个')
                            }

                            if (errorList.length) {
                                return thirdParty.toast.info(errorList[0])
                            }

                            let serialNumberList = [], i = 0
                            for (let v of serialList) {
                                const serialNumber = v.get('serialNumber')
                                if (serialNumberList.includes(v.get('serialNumber'))) {
                                    const idx = serialList.findIndex(w => w.get('serialNumber')==serialNumber)
                                    return thirdParty.Alert(`序号${idx+1}, ${i+1}的序列号重复`)
                                } else {
                                    serialNumberList.push(serialNumber)
                                }
                                i++
                            }

                            const openedQuantity = serialList.size

                            if (type=='OPENLIST') {
                                dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', idx, 'serialList'], serialList))
                                dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', idx, 'openedQuantity'], openedQuantity))
                                history.goBack()
                            }
                            if (type=='OPENLIST_SERIAL') {//通过存货新增页面直接跳入
                                dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', idx, 'serialList'], serialList))
                                dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'openList', idx, 'openedQuantity'], openedQuantity))
                                dispatch(inventoryConfAction.changeCardContent('openedQuantity', openedQuantity))
                                history.goBack()
                            }
                            if (type=='OPENTREE') {
                                const openUuidList = serial.get('openUuidList')
                                const oldValue = serial.get('oldValue')

                                dispatch(inventoryConfAction.changeOpened('openedAssist', openUuidList.toJS(), {serialList: serialList.toJS()}, '', idx))
                                dispatch(inventoryConfAction.changeOpened('openedQuantity', openUuidList.toJS(), decimal(openedQuantity-oldValue, 4), openedQuantity, idx))
                                history.goBack()
                            }
                            if (type=='JR_ENTRY') {//流水入库卡片的新增
                                serial.get('afterAdd')(serialList)
                                history.goBack()
                            }
                        }}
                    >
                        <Icon type="save" />
                        <span>保存</span>
                    </Button>
                    <Button
                        onClick={() => {
                            thirdParty.Confirm({
                                message: `确认清空当前序列号吗？`,
                                title: '提示',
                                buttonLabels: ['取消', '确定'],
                                onSuccess : (result) => {
                                    if (result.buttonIndex==1) {
                                        dispatch(inventoryConfAction.changeData(['serial', 'serialList'], fromJS([])))
                                    }
                                },
                                onFail : (err) => {}
                           })
                        }}>
						<Icon type="clear"/>
						<span>清空</span>
					</Button>

                </ButtonGroup>
            </Container>
        )
    }
}
