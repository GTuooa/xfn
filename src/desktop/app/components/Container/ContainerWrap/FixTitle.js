import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './index.less'

@immutableRenderDecorator
export default
class FixTitle extends React.Component{
	render() {
		return (
			<div className="fix-title">
				{this.props.children}
			</div>
		)
	}
}
