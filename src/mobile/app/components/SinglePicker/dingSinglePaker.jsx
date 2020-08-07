import React, { Component } from 'react'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty/dingding'

export default
class SinglePicker extends Component {

    render() {
        const { district, value, lableName, onOk, extra, disabled, className, key, style } = this.props

        // console.log('AntdSinglePicker', value, district);

        return (
            <div key={key} className={`antd-single-picker ${className ? className : ''}`} style={style}>
                <div onClick={() => {
                        !disabled && thirdParty.chosen({
                            source: district,
                            onSuccess: onOk
                        })
                    }}
                >
                    {
                        this.props.children ?
                        this.props.children :
                        <div>
                            <span>
                                {lableName || '选择框'}
                            </span>
                            <span>{value}</span>
                        </div>
                    }
                </div>
            </div>

        )
    }
}

{/* <List.Item arrow="horizontal" disabled={disabled}>
    <span>
        {lableName || '选择框'}
    </span>
    <span>{value}</span>
</List.Item> */}
