import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator

class CxpzTableItem extends React.Component{
	render() {
		const { type, className, line, onClick, style } = this.props

		return (
            <ul className={line%2 === 0 ? `${className} table-item-color vc-table-item` : `${className} vc-table-item`} style={style}>
				{this.props.children}
			</ul>
		)
	}
}

export default CxpzTableItem;