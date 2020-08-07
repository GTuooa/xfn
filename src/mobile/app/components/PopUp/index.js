import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon } from 'app/components'
import './style.less'

@immutableRenderDecorator
export default
class PopUp extends React.Component {

    render() {
        const {
            title,
            onOk,
            onCancel,
            visible,
            okText,   //确认按钮文字
            cancelText,  //取消按钮文字
            footerVisible, //底部按钮是否显示
            footer     //自定义底部
        } = this.props

        return (
            <div className="popup"
                style={{display: visible ? '' : 'none'}}
                >
                <div className="popup-wrap">

                    <div className="popup-title">
                        <span style={{fontSize: title.length> 19 ? '.11rem' : ''}}>{title}</span>
                        <span onClick={onCancel}>
                            <Icon type="close" className="popup-title-icon"/>
                        </span>
                    </div>
                    <div className="popup-content">
                        {this.props.children}
                    </div>
                    <div className="popup-btn" style={{display: footerVisible ? '' : 'none'}}>
                        <p onClick={onCancel}>{cancelText ? cancelText : '取消'}</p>
                        <p onClick={onOk}>{okText ? okText : '确定'}</p>
                    </div>
                    <div className="popup-btn-footer" style={{display: footer ? '' : 'none'}}>
                        {(footer || []).map(u =>u)}
                    </div>
                </div>


            </div>

        )
    }
}
