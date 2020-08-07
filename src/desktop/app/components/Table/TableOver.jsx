import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator
export default
class TableOver extends React.Component{
	render() {
		const { type, className, titleList, onClick, textAlign, isLink, liOnClice } = this.props

		return (
			<li onClick={liOnClice}>
				<span
					className={["over-ellipsis", className].join(' ')}
					style={{textAlign: textAlign ? textAlign : 'center', padding: '0 0 0 4px'}}
					>
					<span
						className={isLink ? `table-item-cur` : ''}
						onClick={onClick}
						>
						{this.props.children}
					</span>
				</span>
			</li>
		)
	}
}
