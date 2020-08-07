import React, { Component }  from 'react'
import { fromJS, toJS } from 'immutable'
import { PickerView } from 'antd-mobile'

export default
class AntdPickerView extends Component {

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

        const { onChange, onScrollChange, value, seasons } = this.props

        return (
            <PickerView
                onChange={onChange}
                onScrollChange={onScrollChange}
                value={value}
                data={seasons}
                cascade={false}
            />
        )
    }
}
