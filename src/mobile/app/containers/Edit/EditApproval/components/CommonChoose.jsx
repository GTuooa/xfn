import { fromJS } from 'immutable'
import React from 'react'
import { Row, Icon, ChosenPicker, Single } from 'app/components'
import Star from './Star'
import CommonRow from './CommonRow'


export default
class CommonChoose extends React.Component {
    state = {
        visible: false,
    }
    render() {
        const {
            label,
            placeHolder,
            type='single',
            value,
            disabled,
            item=fromJS({}),
            district,
            onChange,
            dispatch,
            className
        } = this.props
        const { visible } = this.state
        const districtJ = district.size ? district.toJS():(item.get('selectValueList') || fromJS([])).toJS().map(v => ({
            key:v,
            value:v
        }))
        const valueArea = value
        return (
            <Single
                className={className}
                visible={visible}
                disabled={disabled}
                district={districtJ}
                onOk={value => {
                    onChange(value.value)
                }}
                onCancel={()=> { this.setState({visible: false}) }}
            >
                <CommonRow
                    multiple={type === 'multiple'}
                    value={item.get('value')}
                    label={label}
                    placeHolder={placeHolder}
                    onDelete={e => {
                        onChange('')
                    }}
                    StarDisabled={!item.get('required')}
                />
            </Single>
        )
    }
}
