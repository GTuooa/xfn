import React from 'react'
import { Container } from 'app/components'

import { Router, Route } from 'react-router-dom'

import RelativeConfApp from './app'
import RelativeCardInsert from './RelativeCardInsert'
import RelativeHighType from './RelativeHighType'
import RelativeType from './RelativeType'
import RelativeTypeInsert from './RelativeTypeInsert'

export default
class ProjectConfIndex extends React.Component {

    render() {

        return(
            <Container className="relative-config">
                <Route path="/config/relative/index" component={RelativeConfApp} />
                <Route path="/config/relative/relativeCardInsert" component={RelativeCardInsert} />
                <Route path="/config/relative/relativeHighType" component={RelativeHighType} />
                <Route path="/config/relative/relativeType" component={RelativeType} />
                <Route path="/config/relative/relativeTypeInsert" component={RelativeTypeInsert} />
            </Container>
        )
    }
}
