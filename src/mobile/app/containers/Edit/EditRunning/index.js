import React from 'react'
import { Container } from 'app/components'
import { Router, Route } from 'react-router-dom'

import EditRunningIndex from './app'
import RouterSfgl from './RouterSfgl.jsx'//收付管理手动核销
import RouterStock from './RouterStock.jsx'//选择修改存货
import RouterPoundage from './RouterPoundage.jsx'//转账手续费


export default
class EditRunning extends React.Component {

    render() {

        return(
            <Container>
                <Route path="/editrunning/index" component={EditRunningIndex} />
                <Route path="/editrunning/sfgl" component={RouterSfgl} />
                <Route path="/editrunning/stock" component={RouterStock} />
                <Route path="/editrunning/poundage" component={RouterPoundage} />
            </Container>
        )
    }
}
