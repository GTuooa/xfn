// import React, { Component, PropTypes }  from 'react'
// import { Link } from 'react-router-dom'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
//
// import { Row, DatePicker, Icon } from 'app/components'
// import { fromJS, toJS } from 'immutable'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
// import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
// import * as allActions from 'app/redux/Home/All/aclist.actions'
//
// @immutableRenderDecorator
// export default
// class EditSection extends Component {
//
//     render() {
//
//         const { allState, dispatch, Edit } = this.props
//
//         const period = allState.get('period')
// 		const year = period.get('openedyear')
// 		const month = period.get('openedmonth')
//         const pageList = Edit.get('pageList') ? Edit.get('pageList') : fromJS([])
//
//         return (
//             <div className="home-tab-bar-item">
//                 <Row className="home-container-list">
//                     {
//                         pageList.some(v => v.get('key') === 'Lrpz') ?
//                         <Link
//                             className="home-container-item"
//                             to='/lrpz'
//                             onClick={() => {
//
//                                 sessionStorage.setItem("lrpzHandleMode", "insert")
//                                 sessionStorage.removeItem('enterDraft')
//
//                                 // 提取
//                                 const now = new Date()
//                                 const nowYear = now.getFullYear()
//                                 const nowMonth = now.getMonth() + 1
//
//                                 let vcdate = ''
//                                 if (!year) {
//                                     vcdate = new Date()
//                                 }
//                                 else {
//                                 const lastDate = new Date(year, month, 0)
//                                 const currentDate = new Date()
//                                     vcdate = nowYear == year && nowMonth == month ? currentDate : lastDate
//                                 }
//
//                                 dispatch(lrpzExportActions.initLrpz())
//                                 // dispatch(allActions.getAcListandAsslistFetch())
//                                 dispatch(lrpzExportActions.getLastVcIdFetch(vcdate))
//                                 dispatch(lrpzExportActions.setCkpzIsShow(false))
//                             }}
//                         >
//                             <Icon className="icon" type="import-voucher" size="36" color="green"/>
//                             <p className="icon-text">录入凭证</p>
//                         </Link> : ''
//                     }
//                     {
//                         pageList.some(v => v.get('key') === 'Lrls') ?
//                         <Link
//                             className="home-container-item"
//                             to='/lrls'
//                             onClick={() => {
//                                 // dispatch(allActions.getAcListandAsslistFetch())
//                             }}
//                         >
//                             <Icon className="icon" type="import-voucher" size="36" color="green"/>
//                             <p className="icon-text">录入流水</p>
//                         </Link> : ''
//                     }
//                 </Row>
//             </div>
//         )
//     }
// }
