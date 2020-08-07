import React from 'react'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import { Container } from 'app/components'

import { Router, Route, Switch } from 'react-router-dom'
import SobConfApp from './app'
import SobOption from './SobOption'
import CopyModules from './CopyModules'

export default
class SobConfIndex extends React.Component {

    render() {

        return(
            <Container className="project-config">
                <Route path="/config/sob/index" component={SobConfApp} />
                <Route path="/config/sob/option" component={SobOption} />
                <Route path="/config/sob/copymodule" component={CopyModules} />
            </Container>
        )
    }
}
