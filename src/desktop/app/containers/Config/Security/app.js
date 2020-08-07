import React, { PropTypes } from 'react'
import { Map, List, toJS } from 'immutable'
import { connect } from 'react-redux'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as securityActions from 'app/redux/Config/Security/security.action'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action.js'
import * as middleActions from 'app/redux/Home/middle.action.js'

import CompanySettings from './CompanySettings';
import PersonalSettings from './PersonalSettings';
import TabTitle from 'app/containers/components/TabTitle/index.js'
import * as thirdParty from 'app/thirdParty'
import { Button, Tooltip, Icon, Input } from 'antd'
import './style.less'


@connect(state => state)
export default
class Security extends React.Component {

    constructor() {
		super()
		this.state = {
            currentPage: 'personalSettings'
        }
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.homeState != nextprops.homeState || this.props.securityState != nextprops.securityState || nextstate != this.state
	}

	render() {

        const { dispatch, allState, homeState, securityState } = this.props
        const { currentPage } = this.state

        const setting = securityState.get('setting')
        const adminList = setting.get('adminList')
        const financeList = setting.get('financeList')
        const informList = setting.get('informList')

		const userInfo = homeState.getIn(['data', 'userInfo'])
		const isAdmin = userInfo.get('isAdmin')
		const isDdAdmin = userInfo.get('isDdAdmin')
		const isDdPriAdmin = userInfo.get('isDdPriAdmin')
		const isFinance = userInfo.get('isFinance')
		const savePermission = isAdmin === 'TRUE' || isDdAdmin === 'TRUE'

		return (
			<div className="security-wrap">
                <TabTitle
                    list = {[
                    	{
                    		name: '个人设置',
                    		key: 'personalSettings'
            
                    	}, {
                    		name: '公司设置',
                    		key: 'companySettings'
                    	}
                    ]}
					activeTab={currentPage}
                    onClick={(page) => {
                        this.setState({currentPage: page})
					}}
					disabledKey="companySettings"
					disabled={!(isAdmin === 'TRUE' || isFinance === 'TRUE' || isDdAdmin === 'TRUE' || isDdPriAdmin === 'TRUE')}
					tipMessage="您没有权限"
                />
                {
                    currentPage === 'personalSettings' ?
                    <PersonalSettings/>
                    :
                    <CompanySettings/>
                }
			</div>
		)
	}
}
