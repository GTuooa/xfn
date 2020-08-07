import React, { Component, PropTypes }  from 'react'
import { fromJS, toJS } from 'immutable'
import { DatePicker, List } from 'antd-mobile'
import thirdParty from 'app/thirdParty'
import browserNavigator from 'app/utils/browserNavigator'
import { DateLib } from 'app/utils'

export default
class AntdDatePicker extends Component {

	// constructor(props) {
    //     super(props);
    //     this.state = {
    //         value: null,
    //     }
    // }

    // onChange = (value) => {
    //     console.log(value);
    //     this.setState({
    //         value,
    //     });
    // }
    // onScrollChange = (value) => {
    //     console.log(value);
    // }

    render() {

        const { onChange, lableName, title, value, className, format = '', mode } = this.props
        //
        return browserNavigator.versions.DingTalk && !global.isplayground?
            <div
                className={className}
                onClick={() => {
                    format.toUpperCase() === 'YYYY-MM-DD HH:MM'?
                    thirdParty.datetimepicker({
                         format: 'yyyy-MM-dd HH:mm',
                         value: value, //默认显示日期
                        onSuccess: result => {
                            if (typeof result.value === 'string') {
                                onChange(result.value)
                            } else {
                                const date = new DateLib(result.value).toString()
                                onChange(date)
                            }
                        },
                        onFail: function(err) {//取消会走到这里
                            //alert('resulterr:'+ JSON.stringify(err) )
                        }
                    })
                    :
                    thirdParty.datepicker({
                        format: format || 'yyyy-MM-dd',
                        value: value, //默认显示日期
                        onSuccess: result => {
                            if (typeof result.value === 'string') {
                                onChange(result.value)
                            } else {
                                const date = new DateLib(result.value).toString()
                                onChange(date)
                            }
                        },
                        onFail: function(err) {//取消会走到这里
                            //alert('resulterr:'+ JSON.stringify(err) )
                        }
                    })
                }}
            >
                {this.props.children || <List.Item arrow="horizontal">{lableName ? lableName : '日期'}</List.Item>}
            </div>
            :
            <DatePicker
                mode={format === 'yyyy-MM-dd hh:mm' ? 'datetime': "date"}
                title={title ? title : '日期选择'}
                // extra="Optional"
                value={new Date(value)}
                onChange={onChange}
            >
                {
                    this.props.children ?
                            <div className={className}>{this.props.children}</div> :
                            <List.Item arrow="horizontal">{lableName ? lableName : '日期'}</List.Item>
                }
            </DatePicker>
    }
}
