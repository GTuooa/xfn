import React from 'react'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import { Container } from 'app/components'

import { Router, Route, Switch } from 'react-router-dom'
import SecurityApp from './app'
import PersonalSettings from './PersonalSettings'
import PasswordSetPage from './PasswordSetPage'

export default
class ProjectConfIndex extends React.Component {

    render() {

        return(
            <Container className="project-config">
                <Route path="/config/security/index" component={SecurityApp} />
                <Route path="/config/security/personalsettings" component={PersonalSettings} />
                <Route path="/config/security/passwordsetpage" component={PasswordSetPage} />
            </Container>
        )
    }
}
