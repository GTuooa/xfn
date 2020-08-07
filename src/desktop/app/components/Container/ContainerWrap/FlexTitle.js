import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './index.less'

@immutableRenderDecorator
class FlexTitle extends React.Component{
	render() {
		return (
			<div className="flex-title">
				{this.props.children}
			</div>
		)
	}
}

export default FlexTitle