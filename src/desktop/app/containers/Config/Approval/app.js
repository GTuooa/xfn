import React from 'react'
import { connect }	from 'react-redux'

import ApprovalTemplate from './ApprovalTemplate'
import ApprovalCard from './ApprovalCard'

import { approvalActions } from 'app/redux/Config/Approval/index.js'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class Approval extends React.Component {

    componentDidMount() {
        this.props.dispatch(approvalActions.getProcessSelectModel())
        this.props.dispatch(approvalActions.getApprovalBasicComponentList())
        this.props.dispatch(allRunningActions.getRunningCategory())
	}
    //
    shouldComponentUpdate(nextprops, nextstate) {
		return this.props.approvalState !== nextprops.approvalState || this.state !== nextstate
	}

    render() {

        const { approvalState, dispatch } = this.props

        const currentPage = approvalState.getIn(['views', 'currentPage'])

        const conponent = ({
            'ApprovalTemplate': () => <ApprovalTemplate />,
            'ApprovalCard': () => <ApprovalCard />
        }[currentPage] || (() => <div></div>))()

        return conponent
    }
}
