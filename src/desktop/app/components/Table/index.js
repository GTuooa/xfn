import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator

class TableWrap extends React.Component{
	render() {
		const { type, className, changeStyle, notPosition } = this.props

		return (
			notPosition ?
				<div className={['table-contaner', className].join(' ')} style={{position:'relative'}}>
					{this.props.children}
				</div>
			:
			changeStyle ?
				<div className={[className, "position-contaner"].join(' ')} style={{top:20,position:'relative'}}>
					{this.props.children}
				</div>
			:
				<div className={[className, "position-contaner"].join(' ')}>
					{this.props.children}
				</div>
		)
	}
}

export default TableWrap;