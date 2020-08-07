import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { fromJS } from 'immutable'
import './style.less'
import { message } from 'antd'

@immutableRenderDecorator
export default
class TabTitle extends React.Component {

	render() {

		const { list, activeTab, onClick, disabledKey, disabled, tipMessage } = this.props

		// const list = [
		// 	{
		// 		name: '套餐详情与订单',
		// 		key: 'Tcxq'

		// 	}, {
		// 		name: '套餐购买与升级',
		// 		key: 'Tcgm'
		// 	}
		// ]

		return (
			<div className="fee-title-wrap">
                <ul className="fee-title-list">
					{
						list.map((v, i) => {
							return (
								<li
									key={i}
									className={`fee-title-item${activeTab === v.key ? ' fee-title-item-cur' : ''}`}
									onClick={() => {
										if (activeTab !== v.key) {
											if (disabledKey && disabledKey === v.key && disabled) {
												message.info(tipMessage)
											} else {
												onClick(v.key)
											}
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
