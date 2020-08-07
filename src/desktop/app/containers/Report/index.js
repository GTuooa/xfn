import React from 'react'
import { connect }	from 'react-redux'

import { Button, Tabs, Spin } from 'antd'
const TabPane = Tabs.TabPane

import Lrb from './Lrb/index'
import Zcfzb from './Zcfzb/index'
import Xjllb from './Xjllb/index'
import Yjsfb from './Yjsfb/index'
import Ambsyb from './Ambsyb/index'
import InitLrb from './InitLrb/index'
import InitZcfzb from './InitZcfzb/index'
import InitXjllb from './InitXjllb/index'
import Syxmb from './Syxmb/index'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class Report extends React.Component {

    componentDidMount() {
        console.log('Report');
	}

    // shouldComponentUpdate(nextprops) {
	// 	return this.props.feeState != nextprops.feeState || this.props.homeState != nextprops.homeState
	// }

    componentWillUnmount () {
        this.props.dispatch(allActions.freshReportPage())
    }

    render() {

        const { dispatch, history, homeState } = this.props

        const curentKey = 'Report'
        const panes = homeState.get('panes')

        const currentPageKey = panes.find(v => v.get('key') === curentKey).get('content')

        const components = {
            'Lrb': <Lrb />,
            'Zcfzb': <Zcfzb />,
            'Xjllb': <Xjllb />,
            'Yjsfb': <Yjsfb />,
            'Ambsyb': <Ambsyb />,
            'InitLrb': <InitLrb />,
            'InitZcfzb': <InitZcfzb />,
            'InitXjllb': <InitXjllb />,
            'Syxmb':<Syxmb />
        }

        const ReportPanes = homeState.getIn(['allPanes', 'ReportPanes'])

        return (
            <div className="all-main-page-wrap">
                <Tabs
                    hideAdd
                    type="editable-card"
                    activeKey={currentPageKey}
                >
                    {ReportPanes.map(v => {
                        return (
                            <TabPane tab={v.get('title')} key={v.get('key')}>
                                {components[v.get('content')]}
                            </TabPane>
                        )
                    })}
                </Tabs>
            </div>
        )
    }
}
