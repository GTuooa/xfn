import React from 'react'
import { toJS, Map, fromJS } from 'immutable'
import { Container } from 'app/components'

import { Router, Route, Switch } from 'react-router-dom'
import Approval from './app'

export default
class ApprovalIndex extends React.Component {

    render() {

        return(
            <Container className="inventory-config">
                <Route path="/config/approval/index" component={ApprovalConfApp} />
            </Container>
        )
    }
}
