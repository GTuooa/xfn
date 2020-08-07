import React, { Component } from 'react'
import { Picker, List } from 'antd-mobile'
// import { createForm } from 'rc-form'
import { fromJS, toJS } from 'immutable'
import './style.less'

class SinglePicker extends Component {

    render() {

        // const { getFieldProps } = this.props.form
        const { district, value, lableName, onOk, extra, disabled, className, key, style } = this.props

        const data = district.map(v => {return {label: v.key, value: v.value}})

        return (
            <div key={key} className={`antd-single-picker ${className ? className : ''}`} style={style}>
                <Picker

                    // {...getFieldProps('district', {
                    //     initialValue: ['yu'],
                    // })}
                    // className={"antd-select-wrap"}
                    disabled={disabled}
                    extra={extra}
                    data={data}
                    cols={1}
                    value={[value]}
                    onOk={value => {
                        const valueStr = value[0]
                        const result = district.find(v => v.value === valueStr)
                        onOk(result)
                    }}
                >
                    {
                        this.props.children ?
                        this.props.children :
                        <List.Item arrow="horizontal" disabled={disabled}>
                            <span>
                                {lableName || '选择框'}
                            </span>
                            <span>{value}</span>
                        </List.Item>
                    }
                </Picker>
            </div>
        )
    }
}

// const SinglePicker = createForm()(AntdSinglePicker)
export default SinglePicker
