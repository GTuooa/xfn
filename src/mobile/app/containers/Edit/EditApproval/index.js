import React from 'react'
import { Container } from 'app/components'
import { Router, Route } from 'react-router-dom'

import EditApprovalIndex from './app'
import EditApprovalDetail from './EditApprovalDetail'
import ApprovalStock from './ApprovalStock'
import ChooseRealtive from './Spd/ChooseRealtive'
import SearchContent from './Spd/SearchContent'
import SearchType from './Spd/SearchType'


export default
class EditApproval extends React.Component {
    // componentDidMount() {
    //     const body = document.getElementsByTagName('head')[0]
    //     const script1 = document.createElement("script")
    //     const script2 = document.createElement("script")
    //     script2.src = 'https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js'
    //     script2.innerHTML = 'var vConsole = new VConsole();'
    // }
    render() {

        return(
            <Container>
                <Route path="/editApproval/index" component={EditApprovalIndex} />
                <Route path="/editApproval/detail" component={EditApprovalDetail} />
                <Route path="/editApproval/stock" component={ApprovalStock} />
                <Route path="/editApproval/choose/related" component={ChooseRealtive} />
                <Route path="/editApproval/search/content" component={SearchContent} />
                <Route path="/editApproval/search/type" component={SearchType} />

            </Container>
        )
    }
}
