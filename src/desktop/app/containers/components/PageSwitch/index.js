import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Menu, Dropdown, Icon }	from 'antd'
import { XfnIcon } from 'app/components'
import './style.less'

@immutableRenderDecorator
export default
class PageSwitch extends React.Component {

	render() {

		const { pageItem, onClick } = this.props


		const menu = (
			<Menu>
				{
					pageItem.get('pageList').map((v, i) => {
						return (
							<Menu.Item key={v.get('key')}>
								<span className="page-switch-item setting-common-ant-dropdown-menu-item" onClick={() => {
                                    onClick(pageItem.get('key'), v.get('name'), v.get('key'))
									// dispatch(homeActions.addHomeTabpane(pageItem.get('key'), v.get('name')))
								}}>{v.get('name')}</span>
							</Menu.Item>
						)
					})
				}
			</Menu>
		)

		return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <div className="page-switch-button">
                        <XfnIcon type='Menu'/>
                    </div>
                </Dropdown>
            </div>
		)
	}
}
