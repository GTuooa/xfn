import React from 'react'
import { connect }	from 'react-redux'

import { Button, Tabs, Spin } from 'antd'
const TabPane = Tabs.TabPane
import PzBomb from 'app/containers/components/PzBomb/index'
import RunningPreview from 'app/containers/components/RunningPreview/index'
import FilePrint from 'app/containers/components/FilePrint/index'

import Cxpz from './Cxpz/index'
import Fjgl from './Fjgl/index/index'
import Cxls from './Cxls/index'
import Calculation from './Calculation/index'
import SearchRunning from './SearchRunning/index'
import RunningEnclosure from "./RunningEnclosure/index"
import ExportRecording from "./ExportRecording/index"
import SearchApproval from "./SearchApproval/index"

import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class Search extends React.Component {

    componentDidMount() {
        // console.log('Search');
	}

    shouldComponentUpdate(nextprops) {
		return this.props.homeState != nextprops.homeState || this.props.allState != nextprops.allState
	}

    componentWillUnmount () {
        this.props.dispatch(allActions.freshSearchPage())
    }

    render() {

        const { dispatch, homeState, allState } = this.props

        const showPzBomb = allState.get('showPzBomb')
        const showPrintModal = allState.get('showPrintModal')
        const searchRunningPreviewVisibility = allState.getIn(['views', 'searchRunningPreviewVisibility'])
        const curentKey = 'Search'
        const panes = homeState.get('panes')

        const currentPageKey = panes.find(v => v.get('key') === curentKey).get('content')

        const components = {
            'Cxpz': <Cxpz />,
            'Fjgl': <Fjgl />,
            'SearchRunning': <SearchRunning />,
            'Cxls': <Cxls />,
            'Calculation': <Calculation />,
            'RunningEnclosure':<RunningEnclosure />,
            'ExportRecording':<ExportRecording />,
            'SearchApproval':<SearchApproval />
        }

        const SearchPanes = homeState.getIn(['allPanes', 'SearchPanes'])

        return (
            <div className="all-main-page-wrap">
                <Tabs
                    hideAdd
                    type="editable-card"
                    activeKey={currentPageKey}
                >
                    {SearchPanes.map(v => {
                        return (
                            <TabPane tab={v.get('title')} key={v.get('key')}>
                                {components[v.get('content')]}
                            </TabPane>
                        )
                    })}
                </Tabs>
                { showPzBomb ? <PzBomb/> : '' }
                { showPrintModal ? <FilePrint/> :''}
                {/* 流水预览不能同时出现两个，否则会PDF预览会有问题 */}
                { searchRunningPreviewVisibility ? <RunningPreview /> : '' }
            </div>
        )
    }
}
