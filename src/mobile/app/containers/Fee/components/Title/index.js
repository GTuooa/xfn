import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Row } from 'app/components'
import { fromJS } from 'immutable'
import './style.less'

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {

		const { activeTab, onClick } = this.props

		const list = [
			{
				name: '套餐详情与订单',
				key: 'Tcxq'
			}, {
				name: '套餐购买与升级',
				key: 'Tcgm'
			}
		]

		return (
			<Row>
				<ul className="sob-option-sob-type">
					{
						list.map((v, i) => {
							return (
								<li
									className={v.key === activeTab ? 'sob-option-sob-type-current' : ''}
									onClick={() => onClick(v.key)}
								>
									{v.name}
								</li>
							)
						})
					}
				</ul>
			</Row>
		)
	}
}
