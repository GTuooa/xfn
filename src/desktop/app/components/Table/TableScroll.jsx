import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

// 外币、数量余额表专用

@immutableRenderDecorator
export default
class TableScroll extends React.Component{
	render() {
		const { type, className } = this.props

		return (
            <div className="table-scroll-contaner-wrap">
                <div className={['table-scroll-contaner', className].join(' ')}>
                    {this.props.children}
                </div>
            </div>
		)
	}
}
