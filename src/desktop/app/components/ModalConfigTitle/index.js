import React, { Component } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './style.less'

@immutableRenderDecorator

class ModalConfigTitle extends Component {

	render() {
		const {
			title,
			style
		} = this.props

		return (
            <div className="jxc-config-title" style={style}>
				<span className="jxc-config-title-title">{title}</span>
				{this.props.children}
            </div>
		)
	}
}
export default ModalConfigTitle;