import React from 'react'
// import { Router, Route, Link } from 'react-router-dom'
import { Router, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router';
// import asyncComponent from './AsyncComponent'
// import { Breadcrumb } from 'antd'

// import createHistory from 'history/createHashHistory'
// const history = createHistory()
// export { history }
import { history } from 'app/utils'

import Home from './Home'
// import SideBar from './Search/Cxls/SideBar'
// import PayCode from 'bundle-loader?lazy&name=PayCode!./Config/Fee/PayCode'
// import PaySuccess from 'bundle-loader?lazy&name=PaySuccess!./Config/Fee/PayCode/PaySuccess'
// import Page10006 from 'bundle-loader?lazy&name=Page10006!./Other/Page10006'

import PayCode from './Config/Fee/PayCode/index/index.js'
import PaySuccess from './Config/Fee/PaySuccess/index/index.js'
import Page10006 from './Other/Page10006/index/index.js'
import BrowserIndex from './Other/BrowserIndex/index/index.js'

// const PayCode = lazyLoad(() => import(/* webpackChunkName: "PayCode" */ './Config/Fee/PayCode'))
// const PaySuccess = lazyLoad(() => import(/* webpackChunkName: "PaySuccess" */ './Config/Fee/PayCode/PaySuccess'))
// const Page10006 = lazyLoad(() => import(/* webpackChunkName: "Page10006" */ './Other/Page10006'))

import '../style/app.css'

const CreateRouter = () => (
    <ConnectedRouter history={history}>
        <div className="all-wrap">
            <Route path="/" exact component={Home} />
            <Route path="/paycode" component={PayCode} />
            <Route path="/paysuccess" component={PaySuccess} />
            <Route path="/page10006" component={Page10006} />
            <Route path="/browserindex" component={BrowserIndex} />
        </div>
    </ConnectedRouter>
)

export default CreateRouter