import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

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
			<div className="fee-title-wrap">
                <ul className="fee-title-list">
					{
						list.map((v, i) => {
							return (
								<li
									key={i}
									className={`fee-title-item${activeTab === i ? ' fee-title-item-cur' : ''}`}
									onClick={() => {
										if (activeTab !== i) {
											onClick(v.key)
										}
									}}
								>
									{v.name}
								</li>
							)
						})
					}
                </ul>
			</div>
		)
	}
}
