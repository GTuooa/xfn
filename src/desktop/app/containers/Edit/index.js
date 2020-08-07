import React from 'react'
import { connect }	from 'react-redux'

import { Button, Tabs, Spin } from 'antd'
const TabPane = Tabs.TabPane

import Lrpz from './Lrpz/index'
import Draft from './Draft/index/index.js'
import LrAccount from './LrAccount/index'
import EditRunning from './EditRunning/index'
// import EidtCalculate from './EidtCalculate/index'
import RunningPreview from 'app/containers/components/RunningPreview/index'
import FilePrint from 'app/containers/components/FilePrint/index'

import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class Edit extends React.Component {

    componentDidMount() {
	}

    shouldComponentUpdate(nextprops) {
        return this.props.homeState != nextprops.homeState
         || this.props.allState.getIn(['views', 'searchRunningPreviewVisibility']) != nextprops.allState.getIn(['views', 'searchRunningPreviewVisibility'])
         || this.props.filePrintState !== nextprops.filePrintState 
    }

    componentWillUnmount () {
        this.props.dispatch(allActions.freshEditPage())
    }

    // componentWillMount() {
	// 	injectAsyncReducer(store, reducer)
	// }

    render() {

        const { dispatch, currentPage, homeState, allState } = this.props

        const curentKey = 'Edit'
        const panes = homeState.get('panes')
        const searchRunningPreviewVisibility = allState.getIn(['views', 'searchRunningPreviewVisibility'])
        const currentPageKey = panes.find(v => v.get('key') === curentKey).get('content')
        const showPrintModal = allState.get('showPrintModal')

        const components = {
            'Lrpz': <Lrpz />,
            'Draft': <Draft />,
            'EditRunning': <EditRunning />,
            // '核算管理': <EidtCalculate />,
            'LrAccount': <LrAccount />,
        }

        const EditPanes = homeState.getIn(['allPanes', 'EditPanes'])

        return (
            <div className="all-main-page-wrap">
                <Tabs
                    hideAdd
                    type="editable-card"
                    activeKey={currentPageKey}
                >
                    {EditPanes.map(v => {
                        return (
                            <TabPane tab={v.get('title')} key={v.get('key')}>
                                {components[v.get('content')]}
                            </TabPane>
                        )
                    })}
                </Tabs>
                {searchRunningPreviewVisibility ? <RunningPreview /> : ''}
                { showPrintModal ? <FilePrint/> :''}
            </div>
        )
    }
}
