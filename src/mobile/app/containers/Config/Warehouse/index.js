import React from 'react'
import { toJS, fromJS } from 'immutable'
import { Container } from 'app/components'

import { Route } from 'react-router-dom'
import WarehouseConfApp from './app'
import WarehouseCard from './WarehouseCard'//卡片新增修改类别

export default
class WarehouseConfIndex extends React.Component {

    render() {

        return(
            <Container className="project-config">
                <Route path="/config/warehouse/index" component={WarehouseConfApp} />
                <Route path="/config/warehouse/card" component={WarehouseCard} />
            </Container>
        )
    }
}
