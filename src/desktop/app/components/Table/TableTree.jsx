import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'


@immutableRenderDecorator
export default
class TableTree extends React.Component{
	render() {
		const { type, className, titleList, onClick, textAlign, style } = this.props

		return (
			<div className={className ? `table-tree-container ${className}` : "table-tree-container"} style={style}>
                {this.props.children}
            </div>
		)
	}
}
