import React, { Component, PropTypes } from 'react'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './container.less'

// @immutableRenderDecorator
export default
class Container extends Component {
	// static propTypes = {
	// 	source: PropTypes.oneOfType([PropTypes.array]),
	// 	onOk: PropTypes.func,
	// 	onCancel: PropTypes.func
	// }
	render() {
		const {
			children,
			className,
			overflow,
			...other
		} = this.props
		const style = this.props.style || {}
		return (
			<div className={["home-wrap container", className].join(' ')} {...other} style={{...style,overflow}}>
				{children}
			</div>
		)
	}
}
