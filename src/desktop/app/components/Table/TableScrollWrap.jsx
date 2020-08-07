import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

// 外币、数量余额表专用

@immutableRenderDecorator

class TableScrollWrap extends React.Component{
	render() {
		const { type, className } = this.props

		return (
			<div className={[className, "table-scroll-wrap"].join(' ')}>
				{this.props.children}
			</div>
		)
	}
}

export default TableScrollWrap;