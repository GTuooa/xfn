import React, { Component } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import {  Modal  } from 'antd'
import './style.less'

@immutableRenderDecorator
class AlertModal extends Component {

	render() {
		const {
			visible,
			message,
			onOk,
			onOkText
		} = this.props

		return (
			<Modal
				width="300px"
				visible={visible}
				title="提示"
				footer=''
				onCancel={onOk}
				style={{boxShadow: 'rgba(0, 0, 0, 0.14902) 0px 1px 3px 1px'}}
				maskClosable={false}
				>
				<div className="info">
					<div>{this.props.children}</div>

					<div className="info-content">
						{ message.map((u,i) => <p>{u}</p>) }
					</div>

					<div className="info-btn" onClick={onOk} >
						{onOkText ? onOkText : '确定'}
					</div>
				</div>
			</Modal>
		)
	}
}
export default AlertModal;