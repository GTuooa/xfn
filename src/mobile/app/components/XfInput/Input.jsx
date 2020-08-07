import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import { InputItem } from 'antd-mobile'
import { formatMoney, formatNumber } from 'app/utils'
import thirdParty from 'app/thirdParty'

const reg = /^\d{0,14}(\.\d{0,2})?$/; // 正数金额
const regNegative = /^-{0,1}\d{0,14}(\.\d{0,2})?$/; // 负数数金额
const regFour = /^\d{0,14}(\.\d{0,4})?$/;
const regNegativeFour = /^-{0,1}\d{0,14}(\.\d{0,4})?$/;

@immutableRenderDecorator
export default
class XfInput extends Component {

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

    onChange = value => {
        const { negativeAllowed, onChange, mode, tipTit } = this.props;

        value = value.indexOf('。') > -1 ? value.replace('。', '.') : value;
        value = value.replace(/,/g, '');

        let regReg = reg
        let NegativeReg = regNegative

        if (mode === 'number') {
            regReg = regFour
            NegativeReg = regNegativeFour
        }
        
        if (value.indexOf('-') === 0 && !negativeAllowed) {
            thirdParty.toast.info(mode === 'number' ? `${tipTit ? tipTit : ''}仅支持输入正数` : '金额仅支持输入正数', 1);
        } else if (negativeAllowed ? !NegativeReg.test(value) : !regReg.test(value)) {
            thirdParty.toast.info(mode === 'number' ? `${tipTit ? tipTit : ''}只能输入小于14位数四位小数的数字` : '金额只能输入小于14位数两位小数的数字', 1);
        } else if (!isNaN(value) || value === '.' || value === '-' || value === '-.') {
            if (value === '.') {
                // e.target.value = '0.'
                onChange('0.');
            } else if (value === '-.') {
                // e.target.value = '-0.'
                onChange('-0.');
            } else {
                onChange(value);
            }
        }
    };

    onFocus = (e) => {
        typeof this.props.onFocus === 'function' && this.props.onFocus(e);
    };
    onNumberFocus = (e) => {
        typeof this.props.onFocus === 'function' && this.props.onFocus(e);
        this.setState({ formate: false });
    };

    onBlur = (e) => {
        typeof this.props.onBlur === 'function' && this.props.onBlur(e);
    };
    onNumberBlur = (e) => {
        const { value, onChange } = this.props;
        let valueTemp = value;
        if (typeof value === 'string') {
            if (value.charAt(value.length - 1) === '.' || value === '-') {
                valueTemp = value.slice(0, -1);
            }
            onChange(valueTemp.replace(/0*(\d+)/, '$1'));
        }
        typeof this.props.onBlur === 'function' && this.props.onBlur(e);
        this.setState({ formate: true });
    };

    render() {
        const { value, mode, className, negativeAllowed, onChange, tipTit, ...other } = this.props;
        /*
            mode: text 文本(默认值), number 4位小数, amount 2位小数
            negativeAllowed: false, true 允不允许负数(默认false)
        */

        if (mode === 'text') { // 默认文本框
            return (
                <InputItem
                    {...other}
                    value={value}
                    onChange={onChange}
                    className={this.props.className ? ['xf-input', className].join(' ') : ''}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            )
        } else if (mode === 'number' || mode === 'amount') {  // 14位4位小数 14位2位小数
            let formatStr = value;
            if (mode === 'number') { // 4位小数
                formatStr = value ? (value !== '-' ? formatNumber(value) : '-') : '';
            } else if (mode === 'amount') { // 2位小数
                formatStr = value ? (value !== '-' ? formatMoney(value, 2) : '-') : '';
            };
    
            const _value = this.state.formate ? formatStr : value;
            console.log('vale', formatStr, value);

            return (
                <InputItem
                    {...other}
                    className={this.props.className ? ['xf-input', className].join(' ') : ''}
                    value={_value || ''}
                    onChange={this.onChange}
                    onFocus={this.onNumberFocus}
                    onBlur={this.onNumberBlur}
                />
            )
        }
    }
}