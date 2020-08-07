import React from 'react'
import { connect }	from 'react-redux'

import { Button, Tabs, Spin } from 'antd'
const TabPane = Tabs.TabPane

import PzBomb from 'app/containers/components/PzBomb/index'
import RunningPreview from 'app/containers/components/RunningPreview/index'
import FilePrint from 'app/containers/components/FilePrint/index'

import Kmmxb from './Kmmxb/index/index'
import AssMxb from './AssMxb/index/index'
import AmountMxb from './AmountMxb/index/index'
import CurrencyMxb from './CurrencyMxb/index/index'
import AssetsMxb from './AssetsMxb/index/index'
// import LsMxb from './LsMxb/index/index'
import ZhMxb from './ZhMxb/index/index'
import XmMx from './Xmmx/index/index'
import WlMxb from './WlMxb/index/index'

import AccountMxb from './AccountMxb/index/index'
import RelativeMxb from './RelativeMxb/index/index'
import ProjectMxb from './ProjectMxb/index/index'
import IncomeExpendMxb from './IncomeExpendMxb/index/index'
import RunningTypeMxb from './RunningTypeMxb/index/index'
import InventoryMxb from './InventoryMxb/index/index'
import * as allActions from 'app/redux/Home/All/all.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@connect(state => state)
export default
class Mxb extends React.Component {

    componentDidMount() {
        // this.props.dispatch(allActions.getAcListFetch())
        // this.props.dispatch(allActions.getAssListFetch())
	}

    // shouldComponentUpdate(nextprops) {
	// 	return this.props.homeState != nextprops.homeState
	// }

    componentWillUnmount () {
        this.props.dispatch(allActions.freshMxbPage())
    }

    componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.props.allState.getIn(['views', 'mxbRunningPreviewVisibility']) === true) {
			this.props.dispatch(previewRunningActions.closePreviewRunning(false))
		}
	}

    render() {

        const { dispatch, homeState, allState } = this.props

        const showPzBomb = allState.get('showPzBomb')
        const showPrintModal = allState.get('showPrintModal')
        const mxbRunningPreviewVisibility = allState.getIn(['views', 'mxbRunningPreviewVisibility'])
        const mxbSerialDrawerVisibility = allState.getIn(['views', 'mxbSerialDrawerVisibility'])

        const curentKey = 'Mxb'
        const panes = homeState.get('panes')
        const currentPageKey = panes.find(v => v.get('key') === curentKey).get('content')

        const components = {
            'Kmmxb': <Kmmxb />,
            'AssMxb': <AssMxb />,
            'AmountMxb': <AmountMxb />,
            'CurrencyMxb': <CurrencyMxb />,
            'AssetsMxb': <AssetsMxb />,
            // '流水明细表': <LsMxb />,
            'AccountMxb': <AccountMxb />,
            'ProjectMxb': <ProjectMxb />,
            'RelativeMxb': <RelativeMxb />,
            'IncomeExpendMxb': <IncomeExpendMxb />,
            'RunningTypeMxb': <RunningTypeMxb />,
            'ZhMxb': <ZhMxb />,
            'XmMxb': <XmMx />,
            'WlMxb': <WlMxb />,
            'InventoryMxb':<InventoryMxb/>
        }

        const MxbPanes = homeState.getIn(['allPanes', 'MxbPanes'])

        return (
            <div style={{height:'100%'}}>
                <div className="all-main-page-wrap"
                    onClick={() => {
                        // 为了流水预览可以点击除了流水号外关闭流水预览抽屉
                        // 流水号做阻止冒泡事件
                        if (mxbRunningPreviewVisibility || mxbSerialDrawerVisibility) {
                            dispatch(previewRunningActions.closePreviewRunning())
                        }
                    }}>
                    <Tabs
                        hideAdd
                        type="editable-card"
                        activeKey={currentPageKey}
                    >
                        {MxbPanes.map(v => {
                            return (
                                <TabPane tab={v.get('title')} key={v.get('key')}>
                                    {components[v.get('content')]}
                                </TabPane>
                            )
                        })}
                    </Tabs>
                </div>
                {showPzBomb ? <PzBomb /> : ''}
                { showPrintModal ? <FilePrint/> :''}
                {/* 流水预览不能同时出现两个，否则会PDF预览会有问题 */}
                { mxbRunningPreviewVisibility ? <RunningPreview /> : '' }
            </div>
        )
    }
}
