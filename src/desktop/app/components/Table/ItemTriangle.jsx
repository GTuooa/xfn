import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Icon } from 'app/components'
import './table.less'

@immutableRenderDecorator

class ItemTriangle extends React.Component {
	render() {
		const { showTriangle, onClick, showchilditem, style, IdOnClick, paddingLeft, isLink, className } = this.props

		return (
			<li className="table-item-with-triangle" onClick={showTriangle ? onClick : (() => {})}>
				<span
					style={{ paddingLeft: paddingLeft ? paddingLeft : '4px' }}
					className={isLink ? "table-item-cur" : ''}
					onClick={IdOnClick}
				>
					{this.props.children}
				</span>
				{showTriangle
					? <Icon
						className="table-item-triangle"
						type={showchilditem ? 'up' : 'down'}>
					</Icon>
					: ''
				}
			</li>
		)
	}
}

export default ItemTriangle;