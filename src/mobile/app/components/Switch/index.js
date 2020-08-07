import React, { Component, PropTypes }  from 'react'
import { fromJS, toJS } from 'immutable'
import { Switch } from 'antd-mobile'
import { createForm } from 'rc-form'
import './index.less'
import * as thirdParty from 'app/thirdParty'
class SwitchItem extends Component {

    render() {
        const { getFieldProps } = this.props.form
        const { onClick, disabled, checked, disabledToast, ...other } = this.props

        return (
            <Switch
                // {...getFieldProps('Switch1', {
                //     initialValue: true,
                //     valuePropName: 'checked',
                // })}
                disabled={disabled}
                checked={checked}
                onClick={()=>{
                    if (disabled) {
                        if (disabledToast) {
                            thirdParty.toast.info(disabledToast,1)
                        }
                        return
                    }
                    onClick()
                }}
                {...other}
            />
        )
    }
}

const AntdSwitch = createForm()(SwitchItem)
export default AntdSwitch
