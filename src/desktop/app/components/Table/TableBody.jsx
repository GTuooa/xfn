import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator
export default
class TableBody extends React.Component{
	render() {
		const { type, className } = this.props

		return (
			// <div className={['table-normal', 'table-' + type, className].join(' ')}>
				<div className={[className, "table-body"].join(' ')}>
					{this.props.children}
				</div>
			// </div>
		)
	}
}
