import React, { Component, PropTypes }  from 'react'
import { fromJS, toJS } from 'immutable'
import { InputItem, List } from 'antd-mobile'
// import { createForm } from 'rc-form'
import './style.less'
import thirdParty from 'app/thirdParty'

class TextInput extends Component {

    render() {
        // const { getFieldProps } = this.props.form

        const { onChange, onBlur, value, disabled, placeholder, clear, className, editable, textAlign, onFocus, onClick, ...other } = this.props

        return (
            <List className={`antd-mobile-text-input-wrap${className ? ' ' + className : ''}${textAlign === 'right' ? ' ' + 'antd-mobile-text-input-text-align-right' : ''}`}>
                <InputItem
                    {...other}
                    // {...getFieldProps('autofocus')}
                    disabled={disabled}
                    placeholder={placeholder}
                    editable={editable}
                    onChange={value => {
                        if (['.', '-.'].includes(value)) {
                            return thirdParty.toast.info('请输入有效的数值')
                        }
                        onChange(value)
                    }}
                    onBlur={onBlur}
                    clear={clear}
                    value={value}
                    onFocus={onFocus}
                    onClick={onClick}
                    name='antd-mobile-text-input'
                />
            </List>
        )
    }
}

// const TextInput = createForm()(TextInputItem)
export default TextInput
