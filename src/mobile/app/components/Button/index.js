import React, { Component, PropTypes } from 'react'
import './button.less'

export default
class Button extends React.Component {


	// getDefaultProps() {
	// 	return {
	// 		style: {},
	// 		onClick: () => {}
	// 	}
	// }

	render() {
		const { disabled, onClick, type, className, ...other } = this.props;

		return (
			<a
				{...other}
				href="javascript:void(0)"
				onClick={() => disabled ? false : onClick()}
				className={`${disabled ? 'disabled' : type || 'button'}${className ? ' ' + className : ''}`}
				>
				{this.props.children || '按钮'}
			</a>
		)
	}
}
