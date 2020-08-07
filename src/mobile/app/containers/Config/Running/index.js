import React from 'react'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import { Container } from 'app/components'

import { Router, Route, Switch } from 'react-router-dom'

import RunningConfApp from './app'
import RunningInsert from './Running/RunningInsert'
import RangeSelect from './Running/RangeSelect'
import RangeStock from './Running/RangeStock'//收入性质存货范围选择
import RangeManagement from './Running/RangeManagement'//收付管理
import RangeContacts from './Running/RangeContacts'//往来管理
import RangeProject from './Running/RangeProject'//项目管理
import RangeAccrued from './Running/RangeAccrued'//计提税费
import RangeGzxj from './Running/RangeGzxj'//计提工资薪金

import RegretPattern from './Running/RepentCategory/index.js'
import TaxRate from './Tax/TaxRate.js'

@connect(state => state)
export default
class RunningConfIndex extends React.Component {

    render() {

        return(
            <Container className="running-config">
                <Route path="/config/running/index" component={RunningConfApp} />
                <Route path="/config/running/insert" component={RunningInsert} />
                <Route path="/config/running/rangeselect" component={RangeSelect} />
                <Route path="/config/running/regret" component={RegretPattern} />
                <Route path="/config/running/taxRate" component={TaxRate} />
                <Route path="/config/running/stock" component={RangeStock} />
                <Route path="/config/running/management" component={RangeManagement} />
                <Route path="/config/running/contacts" component={RangeContacts} />
                <Route path="/config/running/project" component={RangeProject} />
                <Route path="/config/running/accrued" component={RangeAccrued} />
                <Route path="/config/running/gzxj" component={RangeGzxj} />
            </Container>
        )
    }
}
