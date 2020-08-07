import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator

class FlexItem extends React.Component{
	render() {
		const { type, className, line, onClick } = this.props

		return (
            <ul className={line%2 === 0 ? `${className} table-item-color table-item-flex-height` : `${className} table-item-flex-height`}>
				{this.props.children}
			</ul>
		)
	}
}
{/* <ul className={line !== 'hide' && line%2 === 0 ? `${className} table-item-color table-item` : `${className} table-item`} style={{display: line !== 'hide' ? '' : 'none'}} onClick={onClick}>
	{this.props.children}
</ul> */}
export default FlexItem;