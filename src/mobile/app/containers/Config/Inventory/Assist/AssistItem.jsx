import React from 'react'
import { toJS, fromJS } from 'immutable'

import { Form, Icon, ChosenPicker } from 'app/components'
const { Item, Label } = Form

import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'

export default
class AssistItem extends React.Component {
    state = {
        visible: false,
        categoryValue: 'UNIFORM',
    }
    componentDidMount() {
        if (this.props.assistClassificationList.some(v => !v.get('isUniform'))) {
            this.setState({categoryValue: 'UN-UNIFORM'})
        }
    }

    render() {
        const { history, dispatch, openAssist, assistClassificationList } = this.props
        const { visible, categoryValue } = this.state

        let isUniform = categoryValue=='UNIFORM' ? true : false//全部属性统一单价
        let district = [
            {key: 'UNIFORM', label: '全部属性统一单价', disabled: '', childList:[]},
            {key: 'UN-UNIFORM', label: '不同属性不同单价', disabled: '', childList:[]}
        ]
        let cardList=[{uuid:'UNIFORM', name:'全部属性统一单价'}]
        let cardValue = ['UNIFORM'], cardName = ['全部属性统一单价']
        if (categoryValue=='UN-UNIFORM') {
            cardList = []
            cardValue = []
            cardName = []
        }

        return (
            <div className='form-item-wrap'>
                <Item label="辅助属性" className='margin-top'>
                    <div onClick={() => history.push('/config/inventory/assist')}>
                        <span className='gray'>{openAssist ? '已开启' : '未开启'}</span>
                    </div>
                    &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                </Item>
                <div className='gray assist-item' style={{display: openAssist ? '' : 'none'}}>
                    {
                        assistClassificationList.map(v => {
                            const propertyName = v.get('propertyList').map(value => value.get('name'))
                            if (categoryValue=='UN-UNIFORM') {
                                cardList.push({uuid:v.get('uuid'), name:`不同${v.get('name')}不同单价`})
                                if (!v.get('isUniform')) {
                                    cardValue.push(v.get('uuid'))
                                    cardName.push(`不同${v.get('name')}`)
                                }
                            }
                            return (
                                <div key={v.get('uuid')}>
                                    {v.get('name')}: {propertyName.join('；')}
                                </div>
                            )
                        })
                    }
                </div>
                <Item label="单价模式" style={{display: openAssist ? '' : 'none'}}>
                    <div className="config-form-item-auto-height-row-item overElli" onClick={() => this.setState({visible: true})}>
                        <span className="config-form-item-type-choose-lable" style={{'paddingLeft': '8px'}}>
                            {isUniform ? '全部属性统一单价' : `${cardName.length ? `按${cardName.join('、')}不同单价` : ''}`}
                        </span>
                    </div>
                    &nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
                </Item>

                <ChosenPicker
                    visible={visible}
                    type='card'
                    multiSelect={categoryValue=='UN-UNIFORM' ? true : false}
                    title='请选择单价模式'
                    district={district}
                    cardList={cardList}
                    value={categoryValue}
                    cardValue={cardValue}
                    onChange={(value) => {
                        this.setState({categoryValue: value.key})
                        if (value.key=='UNIFORM') {
                            let newList = assistClassificationList.map(v => v.set('isUniform', true))
                            dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'assistClassificationList'], fromJS(newList)))
                        }
                    }}
                    onOk={value => {
                        
                        let newList = []
                        if (value.length==0 || value[0]['uuid']=='UNIFORM') {//"全部属性统一单价"
                            newList = assistClassificationList.map(v => v.set('isUniform', true))
                            this.setState({categoryValue: 'UNIFORM'})
                        } else {
                            const uuidList = value.map(v => v['uuid'])
                            newList = assistClassificationList.map(v => {
                                v = v.set('isUniform', true)
                                if (uuidList.includes(v.get('uuid'))) {
                                    v = v.set('isUniform', false)
                                }
                                return v
                            })
                        }
                        dispatch(inventoryConfAction.changeData(['inventoryCardTemp', 'financialInfo', 'assistClassificationList'], fromJS(newList)))

                    }}
                    onCancel={()=> { this.setState({visible: false}) }}
                >
                    <span></span>
                </ChosenPicker>
            </div>
        )
    }
}
