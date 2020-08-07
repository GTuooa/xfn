import React, { Component, PropTypes } from 'react'
import './btn-group.less'
import Button from '../Button'

export default
class ButtonGroup extends React.Component {

	// getDefaultProps() {
	// 	return {
	// 		type: 'ghost',
	// 		style: {}
	// 	}
	// },
	// propTypes: {
	// 	type: React.PropTypes.string,
	// 	style: React.PropTypes.object,
	// 	className: React.PropTypes.string
	// },
	render() {
		// 初始化界面
		const { children, className, type, ...other } = this.props
		const availableChildren = children.length ? children : [children]

		return (
			<div
				{...other}
				className={['btn-group', className].join(' ')}
				>
				{availableChildren.map((v, i) =>
					<Button
						{...v.props}
						key={i}
						type={v.props.type ? v.props.type : type}
						>
					</Button>
				)}
			</div>
		)
	}
}
