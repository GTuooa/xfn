import React from 'react'
import { toJS, Map, fromJS } from 'immutable'
import { Container } from 'app/components'

import { Router, Route, Switch } from 'react-router-dom'
import AccountConfApp from './app'
import AccountCardEdit from './card'
import Poundage from './Poundage'
import Regret from './Regret'//账户反悔模式
import { ConnectedRouter } from 'connected-react-router';
import { history } from 'app/utils'


export default
class AccountConfIndex extends React.Component {

    render() {

        return(
            <ConnectedRouter history={history}>
                <Container>
                    <Route path="/config/account/index" component={AccountConfApp} />
                    <Route path="/config/account/card/edit" component={AccountCardEdit} />
                    <Route path="/config/account/poundage" component={Poundage} />
                    <Route path="/config/account/regret" component={Regret} />
                </Container>
            </ConnectedRouter>
        )
    }
}
