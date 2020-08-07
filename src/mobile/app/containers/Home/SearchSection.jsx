// import React, { Component, PropTypes }  from 'react'
// import { Link } from 'react-router-dom'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
//
// import { Row, Icon } from 'app/components'
// import { fromJS, toJS } from 'immutable'
// @immutableRenderDecorator
// export default
// class SearchSection extends Component {
//
//     render() {
// 
//         const { dispatch, Search } = this.props
//
//         const pageList = Search.get('pageList') ? Search.get('pageList') : fromJS([])
//
//         return (
//             <div className="home-tab-bar-item">
//                 <Row className="home-container-list">
//                     {
//                         pageList.some(v => v.get('key') === 'Cxpz') ?
//                         <Link
//                             className="home-container-item"
//                             to='/cxpz'
//                         >
//                             <Icon className="icon" type="search-voucher" size="36" color="blue"/>
//                             <p className="icon-text">查询凭证</p>
//                         </Link> : ''
//                     }
//                     {
//                         pageList.some(v => v.get('key') === 'Cxls') ?
//                         <Link className="home-container-item" to='/cxls'>
//                             <Icon className="icon" type="search-voucher" size="36" color="blue"/>
//                             <p className="icon-text">查询流水</p>
//                         </Link> : ''
//                     }
//                 </Row>
//             </div>
//         )
//     }
// }
