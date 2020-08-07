import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Input } from 'antd'
// import placeholderText from 'app/containers/Config/jxcConfig/placehoderText'
import { jxcConfigCheck } from 'app/utils'

// jxcConfig 专用 将中文状态下的“。”换成英文的‘.’
@immutableRenderDecorator

class NumberInput extends React.Component {
	render() {
		const {
			type,
			value,
            onChange,
			placeholder,
			disabled,
			style,
			className
		} = this.props

		return (
            <Input
				className={className}
				style={style}
                placeholder={placeholder}
                value={value}
				disabled={disabled}
				onFocus={(e) => e.target.select()}
                onChange={e => {
                    if (e.target.value.indexOf('。') > -1) {
                        jxcConfigCheck.inputCheck(type, e.target.value.replace('。', '.'), () => onChange(e.target.value.replace('。', '.')))
                    } else {
                        jxcConfigCheck.inputCheck(type, e.target.value, () => onChange(e.target.value))
                    }
                }}
            />
		)
    }
}
export default NumberInput;