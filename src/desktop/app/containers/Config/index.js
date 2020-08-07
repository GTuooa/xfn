import React from 'react'
import { connect }	from 'react-redux'
import { fromJS } from 'immutable'

import { Button, Tabs, Spin } from 'antd'

import Fee from './Fee/index/index.js'
import Ac from './Ac/index/index.js'
import Ass from './Ass/index/index.js'
import Assets from './Assets/index/index.js'
import Currency from './Currency/index/index.js'
import Jz from './Jz/index/index.js'
import Qcye from './Qcye/index/index.js'
import Lsqc from './Lsqc/index/index.js'
import Sob from './Sob/index/index.js'
import SobOption from './Sob/index/SobOptionIndex.js'
import SobLog from './Log/index'
import SobRole from './SobRole/index'
import Security from './Security/index/index.js'
import Approval from './Approval/index/index.js'
// import Account from './Account/index/index.js'

import Running from './Running/index/index.js'

// import IntercourseUnitConfig from './baseConf/IntercourseUnitConfig/index/index.js'
// import InventorySetting from './baseConf/InventorySetting/index/index.js'
// import ProjectConfig from './baseConf/ProjectConfig/index/index.js'

import AccountConfig from './AccountConfig/index/index.js'
import WarehouseConfig from './WarehouseConfig/index/index.js'
import InventoryConf from './Inventory/index/index.js'
import ProjectConf from './Project/index/index.js'
import RelativeConf from './Relative/index/index.js'

import * as allActions from 'app/redux/Home/All/all.action'
const TabPane = Tabs.TabPane

@connect(state => state)
export default
class Config extends React.Component {

    componentDidMount() {
        console.log('Config');
	}

    shouldComponentUpdate(nextprops) {
		return this.props.homeState != nextprops.homeState
	}

    componentWillUnmount () {
        this.props.dispatch(allActions.closeConfigPage())
    }

    render() {

        const { dispatch, homeState } = this.props

        const curentKey = 'Config'
        const panes = homeState.get('panes')

        const currentPageKey = panes.find(v => v.get('key') === curentKey).get('content')

        const ConfigPanes = homeState.getIn(['allPanes', 'ConfigPanes'])

        const components = {
            'Ac': <Ac />,
            'Ass': <Ass />,
            'Assets': <Assets />,
            'Currency': <Currency />,
            'Jz': <Jz />,
            'Qcye': <Qcye />,
            'Sob': <Sob />,
            'SobOption': <SobOption />,
            'SobLog': <SobLog />,
            'SobRole': <SobRole />,
            // '流水设置': <Account />,

            'Running': <Running />,

            'Lsqc': <Lsqc />,
            'Fee': <Fee />,
            'Security': <Security />,

            'ProjectConf': <ProjectConf />,
            'InventoryConf': <InventoryConf />,
            'RelativeConf': <RelativeConf />,
            'AccountConfig': <AccountConfig />,
            'Approval': <Approval />,
            'WarehouseConf': <WarehouseConfig />,
        }

        return (
            <div className="all-main-page-wrap">
                <Tabs
                    hideAdd
                    type="editable-card"
                    activeKey={currentPageKey}
                >
                    {ConfigPanes.map(v => {
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
