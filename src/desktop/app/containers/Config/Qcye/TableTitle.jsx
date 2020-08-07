import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class TableTitle extends React.Component {

	render() {
		return (
			<ul className="qcye-table-title" id="qcye">
				<li>编码</li>
				<li>名称</li>
				<li>余额方向</li>
				<li>
					<ul>
						<li>期初余额</li>
						<li>数量</li>
						<li>金额</li>
					</ul>
				</li>
			</ul>
		)
	}
}
