import { fromJS } from 'immutable'
import React from 'react'
import { Row, Icon, ChosenPicker, Single, Multiple } from 'app/components'
import Star from './Star'
import CommonRow from './CommonRow'


export default
class MultiChoose extends React.Component {
    state = {
        visible: false,
    }
    render() {
        const {
            label,
            placeHolder,
            type='single',
            disabled,
            item=fromJS({}),
            district,
            onChange,
            dispatch,
            className,
            placeArr
        } = this.props
        const { visible } = this.state
        const value = item.get('value') ? item.get('value').toJS() : ''
        const districtJ = district.size ? district.toJS():(item.get('selectValueList') || fromJS([])).toJS().map(v => ({
            key:v,
            value:v,
        }))
        return (
            <Multiple
                className={className}
                visible={visible}
                disabled={disabled}
                district={districtJ}
                value={value}
                onOk={value => {
                    onChange(fromJS(value.map(v => v.key)))
                }}
                onCancel={()=> { this.setState({visible: false}) }}
            >
                <CommonRow
                    type={'multiple'}
                    value={value}
                    label={label}
                    placeHolder={placeHolder}
                    onDelete={e => {
                        onChange('')
                    }}
                    StarDisabled={!item.get('required')}
                />
            </Multiple>
        )
    }
}
