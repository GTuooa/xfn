import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Input } from 'antd'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class XfnInput extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
			inputIsFocus: false
		}
	}

    emitEmpty = () => {
        this.userNameInput && this.userNameInput.focus()
    }

    emitSelect = () => {
        this.userNameInput && this.userNameInput.input.select()
    }

	render() {
		const {
            type,
            className,
			onChange,
            disabled,
            value,
            onBlur,
            onFocus,
            prefix,
            suffix,
            autoSelect,
            showFormatMoney,
            decimalPlaces
		} = this.props
        const { inputIsFocus } = this.state

        const decimalPlacesNum = decimalPlaces ? Number(decimalPlaces) : 2

        let showValue = ''
        if (showFormatMoney) {
            showValue = value || value === 0 ? (inputIsFocus ? value : formatMoney(value, decimalPlacesNum, '')) : ''
        } else {
            showValue = value
        }

		return (
            <Input
                className={className ? className : ''}
                disabled={disabled}
                prefix={prefix ? prefix : null}
                suffix={suffix ? suffix : null}
                value={showValue}
                onBlur={e => {
                    if (onBlur) {
                        onBlur(e)
                    }
                    this.setState({inputIsFocus: false})
                }}
                onFocus={e => {
                    if (autoSelect) {
                        this.setState({inputIsFocus: true}, () => {this.emitSelect()})
                    } else {
                        this.setState({inputIsFocus: true})
                        if (onFocus) {
                            onFocus(e)
                        }
                    } 
                }}
                onChange={e => {
                    if (onChange) {
                        if (type == 'number') {
                            const reg = new RegExp("^[-\\d]\\d*\\.?\\d{0," + decimalPlacesNum + "}$","g")
                            if (reg.test(e.target.value) || e.target.value == '') {
                                onChange(e)
                            }
                        } else {
                            onChange(e)
                        }
                    }
                }}
                ref={node => this.userNameInput = node}
            />
		)
	}
}
