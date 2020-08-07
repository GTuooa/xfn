import React from 'react'
import { connect }	from 'react-redux'

import { Button, Tabs, Spin } from 'antd'
const TabPane = Tabs.TabPane

import Kmyeb from './Kmyeb/index'
import AssYeb from './AssYeb/index'
import AmountYeb from './AmountYeb/index'
import CurrencyYeb from './CurrencyYeb/index'
import AssetsYeb from './AssetsYeb/index'
// import LsYeb from './LsYeb/index'
import ZhYeb from './ZhYeb/index'
import XmYeb from './XmYeb/index'
import WlYeb from './WlYeb/index'

import RelativeYeb from './RelativeYeb/index'
import AccountYeb from './AccountYeb/index'
import ProjectYeb from './ProjectYeb/index'
import IncomeExpendYeb from './IncomeExpendYeb/index'
import RunningTypeYeb from './RunningTypeYeb/index'
import InventoryYeb  from './InventoryYeb/index'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class Yeb extends React.Component {

    componentDidMount() {
        console.log('Yeb');
	}

    shouldComponentUpdate(nextprops) {
		return this.props.homeState != nextprops.homeState
	}

    componentWillUnmount () {
        this.props.dispatch(allActions.freshYebPage())
    }

    render() {

        console.log('yuebiao');

        const { dispatch, history, currentPage, homeState } = this.props

        const curentKey = 'Yeb'
        const panes = homeState.get('panes')

        const currentPageKey = panes.find(v => v.get('key') === curentKey).get('content')

        const components = {
            'Kmyeb': <Kmyeb />,
            'AssYeb': <AssYeb />,
            'AmountYeb': <AmountYeb />,
            'CurrencyYeb': <CurrencyYeb />,
            'AssetsYeb': <AssetsYeb />,
            'AccountYeb': <AccountYeb />,
            'ProjectYeb': <ProjectYeb />,
            'RelativeYeb': <RelativeYeb />,
            'IncomeExpendYeb': <IncomeExpendYeb />,
            'RunningTypeYeb': <RunningTypeYeb />,
            'ZhYeb': <ZhYeb />,
            'XmYeb': <XmYeb />,
            'WlYeb': <WlYeb />,
            'InventoryYeb':<InventoryYeb/>
        }

        const YebPanes = homeState.getIn(['allPanes', 'YebPanes'])

        return (
            <div className="all-main-page-wrap">
                <Tabs
                    hideAdd
                    type="editable-card"
                    activeKey={currentPageKey}
                >
                    {YebPanes.map(v => {
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
