import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator

class JxcTableAll extends React.Component{
	render() {
		const { type, shadowTop, style, page } = this.props

		return (
			<div className={['table-normal-jxc']} style={style}>
				{this.props.children}
			</div>
		)
	}
}

export default JxcTableAll;