import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator

class TableBody extends React.Component{
	render() {
		const { type, className } = this.props

		return (
			<div className={[className, "table-body"].join(' ')}>
				{this.props.children}
			</div>
		)
	}
}

export default TableBody;