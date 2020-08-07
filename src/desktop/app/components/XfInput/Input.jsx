import React from 'react';
import PropTypes from 'prop-types'
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import { Input, message } from 'antd';
import { formatMoney, formatFour } from 'app/utils';

const reg = /^\d{0,14}(\.\d{0,2})?$/; // 正数金额
const regNegative = /^-{0,1}\d{0,14}(\.\d{0,2})?$/; // 负数数金额
const regFour = /^\d{0,14}(\.\d{0,4})?$/;
const regNegativeFour = /^-{0,1}\d{0,14}(\.\d{0,4})?$/;
const integer = /^\d{0,14}?$/;
const integerNegative = /^-{0,1}\d{0,14}?$/;

@immutableRenderDecorator

class XfInput extends React.Component {
    state = {
        formate: true
    };

    static propTypes = {
		mode: PropTypes.string,
        negativeAllowed: PropTypes.bool,
        tipTit: PropTypes.string,
	}

    static defaultProps = {
        mode: 'text',  //number, amount 3种
        negativeAllowed: false, // 是否允许负数
        tipTit: '',  // mode：number 时的提示语头部
    }

    onChange = e => {
        const { negativeAllowed, onChange, mode, tipTit, onKeyDown } = this.props;

        let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value;
        value = value.replace(/,/g, '');
        if(value.includes('=') && onKeyDown){
            return
        }
        let regReg = reg
        let NegativeReg = regNegative
        switch(mode) {
            case 'number':
            regReg = regFour
            NegativeReg = regNegativeFour
            break
            case 'integer':
            regReg = integer
            NegativeReg = integerNegative
            break
            default:
        }

        if (value.indexOf('-') === 0 && !negativeAllowed) {
            switch(mode) {
                case 'number':
                message.info( `${tipTit ? tipTit : ''}仅支持输入正数`)
                break
                case 'integer':
                message.info( `${tipTit ? tipTit : ''}仅支持输入正整数`)
                break
                default:
                message.info( `金额仅支持输入正数`)
            }
        } else if (negativeAllowed ? !NegativeReg.test(value) : !regReg.test(value)) {
            switch(mode) {
                case 'number':
                message.info( `${tipTit ? tipTit : ''}只能输入小于14位数四位小数的数字`)
                break
                case 'integer':
                message.info( `${tipTit ? tipTit : ''}只能输入小于14位数的整数`)
                break
                default:
                message.info( `金额只能输入小于14位数两位小数的数字`)
            }
        } else if (!isNaN(value) || value === '.' || value === '-' || value === '-.') {
            if (value === '.') {
                e.target.value = '0.'
                onChange(e);
            } else if (value === '-.') {
                e.target.value = '-0.'
                onChange(e);
            } else {
                e.target.value = value
                onChange(e);
            }
        }
    };

    onFocus = (e) => {
        typeof this.props.onFocus === 'function' && this.props.onFocus(e);
        this.nameInput && this.nameInput.select();
    };
    onNumberFocus = (e) => {
        typeof this.props.onFocus === 'function' && this.props.onFocus(e);
        this.setState({ formate: false }, () => {
            this.nameInput && this.nameInput.select();
        });
    };

    onBlur = e => {
        typeof this.props.onBlur === 'function' && this.props.onBlur(e);
    };
    onNumberBlur = (e) => {
        const { value, onChange } = this.props;
        let valueTemp = value;
        if (typeof value === 'string') {
            if (value.charAt(value.length - 1) === '.' || value === '-') {
                valueTemp = value.slice(0, -1);
            }
            e.target.value = valueTemp.replace(/0*(\d+)/, '$1')
            onChange(e);
        }
        typeof this.props.onBlur === 'function' && this.props.onBlur(e);
        this.setState({ formate: true });
    };

    render() {
        const { value, mode, className, negativeAllowed, onChange, tipTit, ...other } = this.props;
        let formatStr = value
        const _value = this.state.formate ? formatStr : value;
        switch(mode) {
            case 'text':
            return (
                <Input
                    {...other}
                    value={value}
                    onChange={onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    ref={(node) => this.nameInput = node}
                />
            )
            case 'number':
            case 'amount':
            case 'integer':
            formatStr = {
                number:value ? (value !== '-' ? formatFour(value) : '-') : '',
                amount:value ? (value !== '-' ? formatMoney(value, 2) : '-') : ''
            }[mode]
            return(
                <Input
                    {...other}
                    value={_value || ''}
                    onChange={this.onChange}
                    onFocus={this.onNumberFocus}
                    onBlur={this.onNumberBlur}
                    ref={(node) => this.nameInput = node}

                />
            )
        }
        // if (mode === 'text') { // 默认文本框
        //     return (
        //         <Input
        //             {...this.props}
        //             onFocus={this.onFocus}
        //             onBlur={this.onBlur}
        //             ref={(node) => this.nameInput = node}
        //         />
        //     )
        //
        // } else if (mode === 'number' || mode === 'amount') {  // 14位4位小数 14位2位小数
        //     let formatStr = value;
        //     if (mode === 'number') { // 4位小数
        //         formatStr = value ? (value !== '-' ? formatFour(value) : '-') : '';
        //     } else if (mode === 'amount') { // 2位小数
        //         formatStr = value ? (value !== '-' ? formatMoney(value, 2) : '-') : '';
        //     }
        //
        //     const _value = this.state.formate ? formatStr : value;
        //
        //     return (
        //         <Input
        //             {...this.props}
        //             value={_value || ''}
        //             onChange={this.onChange}
        //             onFocus={this.onNumberFocus}
        //             onBlur={this.onNumberBlur}
        //         />
        //     )
        // }
    }
}

export default XfInput;