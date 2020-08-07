import React from 'react';
import { Tabs } from 'antd-mobile'

export default
class AntdTabs extends React.Component {

	render() {
		const { tabs, ...other } = this.props

		return (
			<Tabs tabs={tabs} {...other}>
				{ this.props.children }
			</Tabs>
		)
	}
}
AntdTabs.DefaultTabBar = Tabs.DefaultTabBar
