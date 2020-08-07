import React from 'react'
import { Container } from 'app/components'

import { Router, Route } from 'react-router-dom'

import SearchRunningApp from './Cxls'
import Sfgl from './Hsgl/Sfgl'
import Kjfp from './Hsgl/Kjfp'
import Fprz from './Hsgl/Fprz'
import Jzsy from './Hsgl/Jzsy'
import Xczc from './Hsgl/Xczc'
import Defray from './Hsgl/Defray'
import Zsfkx from './Hsgl/Zsfkx'

export default
class SearchRunningIndex extends React.Component {

    render() {
        return(
            <Container className="relative-config">
                <Route path="/searchrunning/index" component={SearchRunningApp} />
                <Route path="/searchrunning/sfgl" component={Sfgl} />
                <Route path="/searchrunning/kjfp" component={Kjfp} />
                <Route path="/searchrunning/fprz" component={Fprz} />
                <Route path="/searchrunning/jzsy" component={Jzsy} />
                <Route path="/searchrunning/xczc" component={Xczc} />
                <Route path="/searchrunning/defray" component={Defray} />
                <Route path="/searchrunning/Zsfkx" component={Zsfkx} />
            </Container>
        )
    }
}
