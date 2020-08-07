import React, { Component, PropTypes }  from 'react'
import { fromJS, toJS } from 'immutable'
import { TextareaItem, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import './style.less'

class AntdTextareaItem extends Component {

    render() {
        const { getFieldProps } = this.props.form

        const { onChange, value, placeholder, className, ...other } = this.props

        return (
            <List className={`my-textarea${className ? ' ' + className : ''}`}>
                <TextareaItem
                    {...other}
                    {...getFieldProps('control')}
                    value={value}
                    placeholder={placeholder}
                    autoHeight={true}
                    prefixListCls={'my-textarea'}
                    onChange={value => {
                        onChange(value)
                    }}
                />
            </List>
        )
    }
}

const AntdTextarea = createForm()(AntdTextareaItem)
export default AntdTextarea
