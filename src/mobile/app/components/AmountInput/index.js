import React, { Component, PropTypes }  from 'react'
import { fromJS, toJS } from 'immutable'
import { List, InputItem } from 'antd-mobile'
// import { createForm } from 'rc-form'
import './style.less'

// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
// const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
// let moneyKeyboardWrapProps
// if (isIPhone) {
//     moneyKeyboardWrapProps = {
//         onTouchStart: e => e.preventDefault(),
//     }
// }

class AmountInput extends Component {

    render() {
        // const { getFieldProps } = this.props.form
        const { onChange, onBlur, value, disabled, moneyKeyboardAlign, className, placeholder, editable, onFocus, decimalPlaces } = this.props

        const decimalPlacesNum = decimalPlaces ? Number(decimalPlaces): 2
        // maxLength

        return (
            <InputItem
                type={'text'}
                value={value}
                placeholder={placeholder}
                clear={false}
                editable={editable}
                onChange={v => {
                    const reg = new RegExp("^[-\\d]\\d*\\.?\\d{0," + Number(decimalPlacesNum) + "}$","g")
                    if (v && !reg.test(v)) {
                        if (v === '.') {
                            onChange('0.')
                         } else {
                            return
                         }

                    } else {
                        onChange(v)
                    }
                }}
                onBlur={v => onBlur ? onBlur(v) : {}}
                onFocus={v => onFocus ? onFocus(v) : {}}
                moneyKeyboardAlign={moneyKeyboardAlign}
                // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            />
            // <span className={`antd-mobile-amount-input-wrap${className ? ' ' + className : ''}`}>
             // <List>
                // <InputItem
                //     // {
                //     //     ...getFieldProps('control', {
                //     //         normalize: (v, prev) => {
                //     //             if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                //     //                 if (v === '.') {
                //     //                     return '0.';
                //     //                 }
                //     //                 return prev;
                //     //             }
                //     //             return v;
                //     //         },
                //     //         initialValue: value
                //     //     })
                //     // }
                //     editable={editable}
                //     className={className}
                //     disabled={disabled}
                //     moneyKeyboardAlign={moneyKeyboardAlign}
                //     type="money"
                //     placeholder={placeholder}
                //     // ref={el => this.inputRef = el}
                //     onChange={value => {
                //         if (value && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(value)) {
                //             if (value === '.') {
                //                 onChange('0.')
                //             } else {
                //                 return
                //             }
                //         } else {
                //             onChange(value)
                //         }
                //     }}
                //     onBlur={v => onBlur ? onBlur(v) : {}}
                //     clear={false}
                //     value={value}
                //     onFocus={v => onFocus ? onFocus(v) : {}}
                //     moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                // />
            // </List>
            // </span>
        )
    }
}

// const AmountInput = createForm()(AmountInputItem)
export default AmountInput
