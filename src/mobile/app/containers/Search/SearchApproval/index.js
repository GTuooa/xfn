import React from 'react'
import { Container } from 'app/components'

import { Router, Route } from 'react-router-dom'

import SearchApprovalApp from './app.js'
import ApprovalPreview from './ApprovalPreview'
import EditApproval from './EditApproval'
import ReceiveApproval from './common/ReceiveApproval'
import PayApproval from './common/PayApproval'
import BookKeepingApproval from './common/BookKeepingApproval'
import AccountApproval from './common/AccountApproval'
import StockComEdit from './EditApproval/StockComEdit'
import hideGategoryStockComEdit from './EditApproval/HideGateStockComEdit'

export default
class SearchRunningIndex extends React.Component {

    render() {
        return(
            <Container className="search-approval">
                <Route path="/searchapproval/index" component={SearchApprovalApp} />
                <Route path="/searchapproval/approvalpreview" component={ApprovalPreview} />
                <Route path="/searchapproval/editapproval" component={EditApproval} />
                <Route path="/searchapproval/receiveapproval" component={ReceiveApproval} />
                <Route path="/searchapproval/payapproval" component={PayApproval} />
                <Route path="/searchapproval/accountapproval" component={AccountApproval} />
                <Route path="/searchapproval/stockedit" component={StockComEdit} />
                <Route path="/searchapproval/hidegategorystockcomedit" component={hideGategoryStockComEdit} />
                <Route path="/searchapproval/bookKeepingapproval" component={BookKeepingApproval} />
            </Container>
        )
    }
}
