import React from 'react'
// import { Router, Route, Link } from 'react-router-dom'
import { Router, Route } from 'react-router-dom'
// import asyncComponent from './AsyncComponent'
// import { Breadcrumb } from 'antd'

import createHistory from 'history/createHashHistory'
const history = createHistory()
export { history }
const location = history.location

import Home from './Home'
// import SideBar from './Search/Cxls/SideBar'
// const PayCode = asyncComponent('Config/Fee/PayCode')
// const PaySuccess = asyncComponent('Config/Fee/PayCode/PaySuccess')
// const Page10006 = asyncComponent('Other/Page10006/index.js')

// import PayCode from 'bundle-loader?lazy&name=PayCode!./Config/Fee/PayCode'
// import PaySuccess from 'bundle-loader?lazy&name=PaySuccess!./Config/Fee/PayCode/PaySuccess'
// import Page10006 from 'bundle-loader?lazy&name=Page10006!./Other/Page10006'

// const Home = lazyLoad(() => import(/* webpackChunkName: "Home" */ './Home'))

import PayCode from './Config/Fee/PayCode/index/index.js'
import PaySuccess from './Config/Fee/PaySuccess/index/index.js'
import Page10006 from './Other/Page10006/index/index.js'
import BrowserIndex from './Other/BrowserIndex/index/index.js'

// const PayCode = lazyLoad(() => import(/* webpackChunkName: "PayCode" */ './Config/Fee/PayCode'))
// const PaySuccess = lazyLoad(() => import(/* webpackChunkName: "PaySuccess" */ './Config/Fee/PayCode/PaySuccess'))
// const Page10006 = lazyLoad(() => import(/* webpackChunkName: "Page10006" */ './Other/Page10006'))

import '../style/app.css'

const CreateRouter = () => (
    <Router history={history}>
        <div className="all-wrap">
            <Route path="/" exact component={Home} />
            <Route path="/paycode" component={PayCode} />
            <Route path="/paysuccess" component={PaySuccess} />
            <Route path="/page10006" component={Page10006} />
            <Route path="/browserindex" component={BrowserIndex} />
            {/* <Route path="/sidebar" component={SideBar} /> */}
            {/* <Switch>
                <Route path="/voucher" component={Voucher} />
                <Route component={Home} />
            </Switch> */}
            {/*
            <Route path="/voucher" component={Voucher}/> */}
        </div>
    </Router>
)

export default CreateRouter



// const LrModule = () => (
//     <ul>
//         <li>
//             <Link to="/lr/pz">凭证</Link>
//             <Link to="/lr/ls">流水账</Link>
//         </li>
//     </ul>
// )
//
// const CxModule = () => (
//     <ul>
//         <li>
//             <Link to="/cx/pz">凭证</Link>
//             <Link to="/cx/ls">流水账</Link>
//         </li>
//     </ul>
// )
//
// const breadcrumbNameMap = {
//   '/apps': 'Application List',
//   '/apps/1': 'Application1',
//   '/apps/2': 'Application2',
//   '/apps/1/detail': 'Detail2',
//   '/apps/2/detail': 'Detail3'
// }
//
// const Home = withRouter((props) => {
//
//     const { location } = props
//     const pathSnippets = location.pathname.split('/').filter(i => i)
//
//     const extraBreadcrumbItems = pathSnippets.map((_, index) => {
//         const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
//         return (
//             <Breadcrumb.Item key={url}>
//                 <Link to={url}>
//                     {breadcrumbNameMap[url]}
//                 </Link>
//             </Breadcrumb.Item>
//         )
//     })
//     const breadcrumbItems = [(
//         <Breadcrumb.Item key="home">
//             <Link to="/">Home</Link>
//         </Breadcrumb.Item>
//     )].concat(extraBreadcrumbItems)
//
//     return (
//         <div className="demo">
//             <div className="demo-nav">
//                 <Link to="/">首页</Link>
//                 <Link to="/lr">录入</Link>
//                 <Link to="/cx">查询</Link>
//                 <Link to="/ye">余额</Link>
//                 <Link to="/mx">明细</Link>
//                 <Link to="/sz">设置</Link>
//             </div>
//             <Switch>
//                 <Route path="/lr" component={LrModule} />
//                 <Route path="/cx" component={CxModule} />
//                 <Route render={() => <span>Home Page</span>} />
//             </Switch>
//             <Switch>
//                 <Route path="/lr/pz" component={Lrpz} />
//                 <Route path="/lr/ls" component={Lrls} />
//             </Switch>
//             <Switch>
//                 <Route path="/cx/pz" component={Cxpz} />
//                 <Route path="/cx/ls" component={Cxls} />
//             </Switch>
//
//         </div>
//     )
// })
// "d:dev": "export NODE_DEVICE=desktop NODE_ENV=development && webpack-dev-server --hot --inline --color --config ./webpack/webpack.dev.config.js",