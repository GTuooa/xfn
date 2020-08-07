import view from '../app.js';

import approvalState from 'app/redux/Config/Approval'
import approvalTemplateState from 'app/redux/Config/Approval/ApprovalTemplate'
import approvalCardState from 'app/redux/Config/Approval/ApprovalCard'

const reducer = {
    approvalState,
    approvalTemplateState,
    approvalCardState
}

export { reducer, view }
