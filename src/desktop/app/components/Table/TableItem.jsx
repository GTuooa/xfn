import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator

class TableItem extends React.Component{
	render() {
		const { type, className, line, onClick, heightAuto } = this.props

		const heightClass = heightAuto ? ' ' : ' table-item-height '

		return (
            <ul className={(line !== 'hide' && line%2 === 0) ? `table-item-color table-item ${className}${heightClass}` : `table-item ${className}${heightClass}`} style={{display: line !== 'hide' ? '' : 'none'}} onClick={onClick}>
				{this.props.children}
			</ul>
		)
	}
}
{/* <ul className={line !== 'hide' && line%2 === 0 ? `${className} table-item-color table-item` : `${className} table-item`} style={{display: line !== 'hide' ? '' : 'none'}} onClick={onClick}>
	{this.props.children}
</ul> */}
export default TableItem;