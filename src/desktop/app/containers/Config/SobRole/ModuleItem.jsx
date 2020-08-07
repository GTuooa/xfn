import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

import { Icon, Checkbox, Button, Radio, Tooltip }	from 'antd'

@immutableRenderDecorator
export default
class ModuleItem extends React.Component {

	render() {

        const { dispatch, moduleItem, moduleItemName, rangeDisabled, addRange, disabled, rangeNotAvailable, extraCallback, noRange } = this.props

        if (moduleItem) {
            return (
                <li className="sob-role-detail-item">
                    <div className="sob-role-detail-item-title">{moduleItem.get('moduleName')}</div>
                    <div className="sob-role-detail-item-wrap">
                        <div className="sob-role-detail-item-radio-wrap">
                            <Radio.Group
                                disabled={disabled}
                                className="sob-role-detail-item-radio"
                                value={moduleItem.get('limitAuthority')}
                                onChange={e => {
                                    dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, 'limitAuthority'], e.target.value))

                                    if (e.target.value === '部分权限') {
                                        extraCallback && extraCallback()
                                    }
                                }}
                            >
                                <Radio value={'无权限'}>无权限</Radio>
                                <Radio value={'全部权限'}>全部权限</Radio>
                                <Radio value={'部分权限'}>部分权限</Radio>
                            </Radio.Group>
                            {
                                noRange ? null :
                                <Tooltip title={rangeDisabled ? "暂不支持" : ''} placement="topRight">
                                    <span
                                        className={rangeDisabled ? "sob-role-detail-item-range sob-role-detail-item-range-disabled" : (rangeNotAvailable ? "sob-role-detail-item-range sob-role-detail-item-range-disabled" : "sob-role-detail-item-range")}
                                        onClick={() => {
                                            if (!rangeNotAvailable) {
                                                addRange()
                                            }
                                        }}
                                    >
                                        添加限制范围
                                    </span>
                                </Tooltip>
                            }
                            
                        </div>
                        <div className="sob-role-detail-item-checkbox-wrap" style={{display: moduleItem.get('limitAuthority') === '部分权限' ? '' : 'none'}}>
                            {this.props.children ? this.props.children : null}
                        </div>
                    </div>
                </li>
            )
        } else {
            return null
        }
	}
}
