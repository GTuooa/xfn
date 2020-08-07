import React,{ Fragment } from 'react'
import { Row, Icon, ChosenPicker, Single, DatePicker } from 'app/components'
import CommonRow from './CommonRow'
import { DateLib } from 'app/utils'

export default
class DateComp extends React.Component {
    state = {
        visible: false,
    }
    render() {
        const {
            disabled,
            district,
            className,
            onChange,
            item,
            style
        } = this.props
        const { visible } = this.state
        return (
            <div onClick={() => this.setState({visible: true})} className={className} style={style}>
                <DatePicker
                    visible={visible}
                    disabled={disabled}
                    district={district}
                    format={item.get('dateFormat')}
                    value={item.get('value')}
                    onChange={date => {
                        if (item.get('dateFormat') === 'yyyy-MM-dd hh:mm') {
                            onChange(date)
                        } else {
                            onChange(new DateLib(new Date(date)).valueOf())
                        }
                    }}
                    onCancel={()=> { this.setState({visible: false}) }}
                >
                    <CommonRow
                        value={item.get('value')}
                        label={item.get('label')}
                        placeHolder={item.get('placeHolder')}
                        onDelete={onChange}
                        StarDisabled={!item.get('required')}
                    />
                </DatePicker>
            </div>
        )
    }
}
