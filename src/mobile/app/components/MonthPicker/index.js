import React, { Component }  from 'react'
import { fromJS, toJS } from 'immutable'
import { DatePicker, List } from 'antd-mobile'

export default
class AntdMonthPicker extends Component {
    render() {

        const { onChange, lableName, title, value, className, format, minDate, maxDate, disabled } = this.props

        return (
            <DatePicker
                mode="month"
                title={title ? title : '请选择月份'}
                // extra="Optional"
                // value={new Date(value)}
                value={value ? new Date(value) : ''}
                onChange={onChange}
                format={format}
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
            >
                {
                    this.props.children ?
                            <div className={className}>{this.props.children}</div> :
                            <List.Item arrow="horizontal">{lableName ? lableName : '月份'}</List.Item>
                }
            </DatePicker>
        )
    }
}
