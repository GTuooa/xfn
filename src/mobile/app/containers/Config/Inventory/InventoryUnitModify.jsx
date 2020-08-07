import React, { Component } from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Container, ScrollView, Row, Single, Icon, Form, Switch, XfInput, ButtonGroup, Button } from 'app/components'
import { decimal, configCheck } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { check } from './check/unit.js'
import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

const { Label, Item } = Form

//寻找标准单位
const findStandard = (isStandard, uuid, standardList) => {
    let standardObj = {
        oriBasicUnitQuantity: '',
        basicUnitUuid: '',
    }
    if (isStandard) {
        for (let item of standardList) {
            if (item['uuid']==uuid) {
                standardObj = item
                break
            }
        }
    }
    return standardObj
}


@connect(state => state)
export default class InventoryUnitModify extends Component {
    state = {
        isStandard: true,
        uuid: '',
        name: '',
        unitList: [],
        basicUnitQuantity: 1,
        modifyUnit: false,//是否修改基本单位
    }
    componentDidMount() {
        thirdParty.setTitle({title: '修改计量单位'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})

        const unit = this.props.inventoryConfState.getIn(['inventoryCardTemp', 'unit'])
        const standardList = this.props.inventoryConfState.get('standardList').toJS()//标准单位列表
        let unitList = unit.get('unitList').toJS()
        unitList.forEach(v => {
            if (v['isStandard']) {
                const standardObj = findStandard(true, v['uuid'], standardList)
                v['basicUnitUuid'] = standardObj['basicUnitUuid']
                v['oriBasicUnitQuantity'] = standardObj['basicUnitQuantity']
            }
        })

        this.setState({
            isStandard: unit.get('isStandard'),
            uuid: unit.get('uuid'),
            name: unit.get('name'),
            unitList: unitList,
        })
    }

    render () {
        const { dispatch, history, inventoryConfState } = this.props
        const { uuid, isStandard, name, unitList, basicUnitQuantity, modifyUnit } = this.state

        const allUnitList = inventoryConfState.get('unitList')
        const standardList = inventoryConfState.get('standardList').toJS()//标准单位列表
        const unit = inventoryConfState.getIn(['inventoryCardTemp', 'unit'])

        const isOne = unitList.length==1 ? true : false
        //标准单位所有的信息
        const standardObj = findStandard(isStandard, uuid, standardList)
        const basicUnitUuid = standardObj['basicUnitUuid']
        const oriBasicUnitQuantity = standardObj['basicUnitQuantity']

        //单位的选择列表
        let unitCardList = allUnitList.toJS().filter(v => v['unitList']==0)//基本单位选择列表(只能是单单位)
        unitCardList.unshift({'key': '输入新单位', value: 'INPUT'})
        let moreUnitList = []//多单位选择列表
        if (isStandard && unitList.length) {
            moreUnitList = standardList.filter(v => {
                if (v['basicUnitUuid']==standardObj['basicUnitUuid'] && Number(v['basicUnitQuantity']) >= Number(oriBasicUnitQuantity)) {
                    return v
                }
            })
            moreUnitList.unshift({'key': '输入新单位', value: 'INPUT'})
        } else {
            moreUnitList = unitCardList
        }

        const showPrompt = (moreUnit, idx) => {
            thirdParty.Prompt({
                title: '自定义单位',
                message: '请输入单位名称:',
                buttonLabels: ['取消', '确认'],
                onSuccess: (result) => {
                    if (result.buttonIndex === 1) {
                        if (result.value == '') {
                            thirdParty.toast.info('请输入单位名称')
                            return
                        } else {
                            if (moreUnit) {//多单位点击
                                unitList[idx] = {
                                    name: result.value,
                                    basicUnitQuantity: '',
                                    isStandard:  false,
                                    uuid:  '',
                                    unitList: [],
                                }
                                this.setState({unitList: unitList})
                            } else {//自定义基本单位
                                this.setState({
                                    name: result.value,
                                    basicUnitQuantity: 1,
                                    isStandard: false,
                                    uuid:  '',
                                })
                            }

                        }
                    }
                }
            })
        }


        return (
            <Container className="inventory-config">
                <ScrollView flex='1' className="border-top">
                    <Form>
                        <Item label="基本单位" className='unit' showAsterisk>
                            <div className='unit-add' onClick={() => {
                                this.setState({
                                    modifyUnit: true,
                                    name: '',
                                })
                            }}>
                                <span>修改</span>
                            </div>
                            <div className='unit-select'>
                                {unit.get('name')}
                                &nbsp;<Icon type="arrow-right" size="14" />
                            </div>
                        </Item>

                        <div className='inventory-add-card' style={{display: modifyUnit ? '' : 'none'}}>
                            <div className='item'>
                                <div className='item-center'>
                                    {unit.get('name')} =
                                </div>

                                <Single
                                    className='item-left'
                                    district={unitCardList}
                                    onOk={value => {
                                        if (value.value=='INPUT') {//用户输入
                                            showPrompt()
                                        } else {
                                            this.setState({
                                                isStandard:  value['isStandard'],
                                                uuid:  value['uuid'],
                                                name:  value['name'],
                                                basicUnitQuantity: '',
                                            })
                                        }

                                    }}
                                >
                                   <Row>
                                      {name ? name : '新单位' }
                                   </Row>
                                </Single>

                                <div className='item-center'>
                                    *
                                </div>

                                <div className='item-right'>
                                    <XfInput
                                        mode='number'
                                        placeholder='请输入数量关系'
                                        value={basicUnitQuantity}
                                        onChange={value => {
                                            this.setState({basicUnitQuantity: value})
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <Item label="多单位" style={{display: unitList.length == 0 ? '' : 'none'}}>
                            <span className="noTextSwitch">
                                <Switch
                                    checked={false}
                                    onClick={()=> {
                                        unitList.push({
                                            basicUnitQuantity: '',
                                            basicUnitUuid: '',
                                            isStandard: true,
                                            uuid: '',
                                            name: '',
                                            unitList: [],
                                        })
                                        this.setState({unitList: unitList})
                                    }}
                                />
                            </span>
                        </Item>

                        <div className='inventory-add-card'  style={{display: unitList.length ? '' : 'none'}}>
                            <div>
                                {
                                    unitList.map((v, i) => {
                                        const unitListStandardObj = findStandard(v['isStandard'], v['uuid'], standardList)
                                        return (
                                            <div key={i} style={{paddingBottom: '10px'}}>
                                                <div className='title'>
                                                    <span>多单位({i+1})</span>
                                                    <span
                                                        className='blue'
                                                        style={{display: isOne ? 'none' : ''}}
                                                        onClick={() => {
                                                            unitList.splice(i,1)
                                                            this.setState({unitList: unitList})

                                                        }}
                                                    >
                                                            删除
                                                    </span>
                                                </div>

                                                <div className='item'>
                                                    <Single
                                                        className='item-left'
                                                        district={moreUnitList}
                                                        value={v['uuid']}
                                                        onOk={value => {
                                                            if (value.value=='INPUT') {//用户输入
                                                                showPrompt(true, i)
                                                            } else {
                                                                const standardObj = findStandard(value['isStandard'], value['uuid'], standardList)
                                                                unitList[i] = value
                                                                //保留原来的标准单位的换算关系
                                                                unitList[i]['oriBasicUnitQuantity'] = standardObj['basicUnitQuantity']
                                                                unitList[i]['basicUnitUuid'] = standardObj['basicUnitUuid']
                                                                unitList[i]['basicUnitQuantity'] = ''
                                                                if (isStandard) {//基本单位是标准单位
                                                                    unitList[i]['basicUnitQuantity'] = standardObj['oriBasicUnitQuantity']/oriBasicUnitQuantity
                                                                }
                                                                this.setState({unitList: unitList})
                                                            }
                                                        }}
                                                    >
                                                       <Row>
                                                          {v['name'] ? v['name']: '请选择/输入单位' }
                                                       </Row>
                                                    </Single>

                                                    <div className='item-center'>
                                                        = {name} *
                                                    </div>

                                                    <div className='item-right'>
                                                        <XfInput
                                                            mode='amount'
                                                            disabled={basicUnitUuid && unitListStandardObj['basicUnitUuid']==basicUnitUuid ? true : false}
                                                            placeholder='请输入数量值'
                                                            value={v['basicUnitQuantity']}
                                                            onChange={value => {
                                                                unitList[i]['basicUnitQuantity'] = value
                                                                this.setState({unitList: unitList})
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className='bottom'>
                                <div></div>
                                <div className='right'>
                                    <div className={unitList.length < 2 ? 'blue' : 'gray'}
                                        onClick={() => {
                                            if (unitList.length >= 2) {
                                                return
                                            }
                                        unitList.push({
                                            name: '',
                                            uuid: '',
                                            isStandard: false,
                                            basicUnitUuid: '',
                                            basicUnitQuantity: '',
                                            unitList: [],
                                        })
                                        this.setState({unitList: unitList})
                                    }}>
                                        +添加单位
                                    </div>
                                    <div className='noTextSwitch'>
                                        <Switch
                                            checked={true}
                                            onClick={() => {
                                                this.setState({unitList: []})
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Form>
                </ScrollView>
                <ButtonGroup>
                    <Button onClick={() => {
                        //缺少校验
                        const errorList = check(this.state)
                        if (errorList.length) {
                            return thirdParty.toast.info(errorList[0])
                        }

                        const onOk = () => {
                            let nameList = [name], basicUnitQuantityList = [1]
                            if (unitList && unitList.length) {
                                unitList.map(v => {
                                    nameList.push(v['name'])
                                    basicUnitQuantityList.push(v['basicUnitQuantity'])
                                })
                            }
                            dispatch(inventoryConfAction.changeCardContent('unit', fromJS({
                                basicUnitQuantity,
                                basicUnitUuid,
                                isStandard,
                                uuid,
                                name,
                                unitList,
                                fullName: unitList.length ? `${name}(${nameList.join(':')}=${basicUnitQuantityList.join(':')})`: name
                            })))
                            dispatch(inventoryConfAction.changeData('purchasePriceList',fromJS([{
                                unitUuid: uuid,
                                name: name,
                                defaultPrice: '',
                                type: '1'
                            }]), true))
                            dispatch(inventoryConfAction.changeData('salePriceList',fromJS([{
                                unitUuid: uuid,
                                name: name,
                                defaultPrice: '',
                                type: '2'
                            }]), true))

                            //组装单的单位
                            const assemblyState = inventoryConfState.getIn(['inventoryCardTemp', 'assemblyState'])
                            if (assemblyState=='OPEN') {
                                const assemblySheet = inventoryConfState.getIn(['inventoryCardTemp', 'assemblySheet'])
                                const unitName = assemblySheet.get('unitName')
                                const quantity = assemblySheet.get('quantity')
                                const unitUuid = assemblySheet.get('unitUuid')
                                const materialList = assemblySheet.get('materialList')

                                let newQuantity = quantity, newUnitName = unitName, newUnitUuid = unitUuid

                                if (nameList.includes(unitName)) {
                                    let list = [{name, basicUnitQuantity}]
                                    unitList.map(v => {
                                        list.push({name: v['name'], basicUnitQuantity: v['basicUnitQuantity']})
                                    })

                                    if (Number(quantity)) {
                                        list.map(v => {
                                            if (v['name']==unitName) {
                                                newQuantity = decimal(Number(quantity)/Number(v['basicUnitQuantity']))
                                            }
                                        })
                                    }
                                } else {
                                    newUnitName = name
                                    newUnitUuid = uuid
                                }

                                dispatch(inventoryConfAction.changeCardContent('assemblySheet', fromJS({
                                    unitUuid: newUnitUuid,
                                    unitName: newUnitName,
                                    quantity: newQuantity,
                                    materialList
                                })))

                            }

                            history.goBack()
                        }

                        if (name != unit.get('name') || unitList.length) {
                            thirdParty.Confirm({
                                title: '信息确认',
                                message: `所有历史单据中，该商品的单位将统一转换为基本单位`,
                                buttonLabels: ['取消', '确定'],
                                onSuccess : (result) => {
                                    if (result.buttonIndex==1) {
                                        onOk()
                                    }
                                },
                                onFail : (err) => {}
                           })
                       } else {
                           onOk()
                       }

                    }}>
                        <Icon type="choose" />
                        <span>确定</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }

}
