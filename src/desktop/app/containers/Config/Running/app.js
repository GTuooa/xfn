import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style/index.less'

import { Button, message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import Running from './Running'
import Tax from './Tax'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'

@connect(state => state)
export default
class EditRunning extends React.Component {

	static displayName = 'EditRunning'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			showModal: false
		}
	}

	componentDidMount() {
		this.props.dispatch(allRunningActions.getRunningCategory())
		this.props.dispatch(lsqcActions.showQcye(false))
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.homeState !== nextprops.homeState ||
				this.props.taxConfState !== nextprops.taxConfState ||
				this.props.runningIndexState !== nextprops.runningIndexState ||
				this.props.runningConfState !== nextprops.runningConfState ||
				this.props.allState !== nextprops.allState
	}

	render() {

		const { allState, dispatch, runningIndexState, runningConfState,taxConfState,homeState } = this.props
		const { showModal } = this.state

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const enableProject = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('PROJECT') > -1
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])

		const currentPage = runningIndexState.getIn(['views','currentPage'])
		const taxRateTemp = allState.get('taxRate')
		const regretCategory = runningConfState.get('regretCategory')
		const isTaxQuery = taxConfState.getIn(['views', 'isTaxQuery'])
		const runningTemp = runningConfState.get('runningTemp')
		const flags = runningConfState.get('views')
		const regretTemp = runningConfState.get('regretTemp')
		const runningCategory = allState.get('runningCategory')
		const enableInventory = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('INVENTORY') > -1
		const mainContainer = currentPage === 'running' ?
			<Running
				dispatch={dispatch}
				editPermission={editPermission}
				pageList={pageList}
				isSpread={isSpread}
				currentPage={currentPage}
				regretCategory={regretCategory}
				taxRateTemp={taxRateTemp}
				runningTemp={runningTemp}
				regretTemp={regretTemp}
				runningCategory={runningCategory}
				flags={flags}
				newJr={newJr}
				enableInventory={enableInventory}
				enableProject={enableProject}
			/> :
			<Tax
				dispatch={dispatch}
				editPermission={editPermission}
				taxConfState={taxConfState}
				isSpread={isSpread}
				pageList={pageList}
				currentPage={currentPage}
				taxRateTemp={taxRateTemp}
				isTaxQuery={isTaxQuery}
			/>

		return (
			<div>
			{mainContainer}
			</div>
		)
	}
}
