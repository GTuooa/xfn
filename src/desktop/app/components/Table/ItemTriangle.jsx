import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import {  Icon } from 'antd'
import './table.less'

@immutableRenderDecorator
export default
class ItemTriangle extends React.Component{
	render() {
		const { showTriangle, onClick, showchilditem, style, IdOnClick, paddingLeft, isLink, className } = this.props

		return (

			<li className="table-item-with-triangle" onClick={showTriangle ? onClick : ()=>{}}>
				<span
				style={{paddingLeft: paddingLeft ? paddingLeft : '4px'}}
				className={isLink ? "table-item-cur" : ''}
				onClick={IdOnClick}
				>{this.props.children}</span>
				{showTriangle ?
					<Icon
						className="table-item-triangle"
						type={showchilditem ? 'up' : 'down'}>
					</Icon> : ''
				}
			</li>
		)
	}
}
{/* <li className={["table-item-with-triangle", className].join(' ')} onClick={showTriangle ? onClick : ''}>
	<span style={{paddingLeft: paddingLeft ? paddingLeft : '4px'}}>{this.props.children}</span>
	{showTriangle ?
		<Icon
			className="table-item-triangle"
			type={showchilditem ? 'up' : 'down'}>
		</Icon> : ''
	}
</li> */}
