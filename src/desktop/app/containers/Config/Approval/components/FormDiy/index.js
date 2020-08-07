import React from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import './style.less'

import { componentName } from '../common'
import * as components from './FormTypeOption'

import { Button, Input, Icon, Menu, Dropdown } from 'antd'

@immutableRenderDecorator
export default
    class FormDiy extends React.Component {

    static displayName = 'FormDiy'

    constructor(props) {
        super(props)
        this.state = {
            currentSelectIndex: -1,
        }
    }

    render() {
        const { page, componentList, addComponent, deleteComponent, adjustPosition, changeOptionString, basicComponentList } = this.props
        const { currentSelectIndex } = this.state

        const formDiyList = basicComponentList ? basicComponentList.toJS(): []
        
        const menu = (
            <Menu>
                {
                    formDiyList.map((v, i) => <Menu.Item key={i}>
                        <span
                            className="approval-from-click-area setting-common-ant-dropdown-menu-item"
                            onClick={() => {
                                addComponent(v)
                                this.setState({
                                    currentSelectIndex: componentList.size
                                })
                            }}
                        >{componentName[v.componentType]}</span>
                    </Menu.Item>)
                }
            </Menu>
        );
        
        const currentSetting = componentList.get(currentSelectIndex) ? componentList.get(currentSelectIndex) : fromJS({})
        const Component = components[currentSetting.get('componentType')]

        return (
            <div className="approval-form-diy-wrap">
                <div className="approval-form-diy-left">
                    <ul className="approval-form-diy-list">
                        {
                            componentList.map((v, i) => {

                                const labelPart = (type) => {
                                    if (type === 'NumberField') {
                                        return (v.get('label') + (v.get('unit') ? `(${v.get('unit')})` : ''))
                                    } else {
                                        return v.get('label')
                                    }
                                }

                                return (
                                    <li className={`approval-form-diy-item ${currentSelectIndex == i || (currentSelectIndex == -1 && componentList.size-1 == i) ? ' approval-form-diy-item-cur' : ''}`} key={i} onClick={() => {
                                        this.setState({
                                            currentSelectIndex: v.get('orderValue')
                                        })
                                    }}>
                                        <span className="approval-form-diy-item-sort">
                                            {
                                                i === 0 ? <i className='go-up'></i> :
                                                    <Icon
                                                        type='arrow-up'
                                                        className='go-up'
                                                        onClick={(e) => {
                                                            adjustPosition(i, i - 1)
                                                        }}
                                                    >
                                                    </Icon>
                                            }
                                            {
                                                componentList.size - 1 === i ? null :
                                                    <Icon
                                                        type='arrow-down'
                                                        className='go-down'
                                                        onClick={(e) => {
                                                            adjustPosition(i, i + 1)
                                                        }}
                                                    ></Icon>
                                            }
                                        </span>
                                        <span className="approval-form-diy-item-name">
                                            {labelPart(v.get('componentType'))}
                                        </span>
                                        <span className="approval-form-diy-item-type">
                                            {componentName[v.get('componentType')]}
                                        </span>
                                        <span className="approval-form-diy-item-delete">
                                            {
                                                v.get('canDelete') ?
                                                    <div className="approval-form-diy-item-delete-Icon" onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteComponent(i)
                                                        if (currentSelectIndex.toString() === i.toString()) {
                                                            this.setState({
                                                                currentSelectIndex: -1
                                                            })
                                                        }
                                                    }}>
                                                        <Icon type="close" />
                                                    </div>
                                                    : null
                                            }
                                        </span>
                                    </li>
                                )
                            })
                        }
                        <li className="approval-form-diy-item—add">
                            <Dropdown overlay={menu} placement="topCenter" trigger={['click']} disabled={page==='MX'}>
                                <span className={page==='MX' ? "approval-form-diy-item—add-btn approval-form-diy-item—add-btn-disabled" : "approval-form-diy-item—add-btn"}>
                                    <Icon type="plus" /> 添加字段
                                </span>
                            </Dropdown>
                        </li>
                    </ul>
                </div>
                <div className="approval-form-diy-right">
                    {Component ? <Component
                        changeOptionString={changeOptionString}
                        currentSetting={currentSetting}
                        page={page}
                    /> : null}
                </div>
            </div>
        )
    }
}