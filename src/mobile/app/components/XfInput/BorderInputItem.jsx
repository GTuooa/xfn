import React, { Component, PropTypes }  from 'react'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import './style.less'

import Input from './Input'

@immutableRenderDecorator
export default
class BorderInputItem extends Component {

    render() {
        const {  className, textAlign, ...other } = this.props

        return (
            <span className={`antd-mobile-text-input-wrap${className ? ' ' + className : ''}${textAlign === 'right' ? ' ' + 'antd-mobile-text-input-text-align-right' : ''}`}>
                <Input
                    {...other}
                    className={''}
                />
            </span>
        )
    }
}
