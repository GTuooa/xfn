// import React, { Component, PropTypes }  from 'react'
// import { Link } from 'react-router-dom'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
//
// import { Row, Icon } from 'app/components'
// import { fromJS, toJS } from 'immutable'
// @immutableRenderDecorator
// export default
// class ReportSection extends Component {
//
//     render() {
//
//         const { dispatch, Report, Mxb, Yeb } = this.props
//
//         const reportPageList = Report.get('pageList')
//         const yebPageList = Yeb.get('pageList')
//
//         return (
//             <div className="home-tab-bar-item">
//
//                 <Row className="home-container-list">
//                     {
//                         reportPageList.some(v => v.get('key') === 'Lrb') ?
//                         <Link className="home-container-item" to='/lrb'>
//                             <Icon className="icon" type="profit" size="26" color="#FD7857"/>
//                             <p className="icon-text">利润表</p>
//                         </Link> : ''
//                     }
//                     {
//                         reportPageList.some(v => v.get('key') === 'Zcfzb') ?
//                         <Link className="home-container-item" to='/zcfzb'>
//                             <Icon className="icon" type="balance" size="26" color="#FD7857"/>
//                             <p className="icon-text">资产负债表</p>
//                         </Link> : ''
//                     }
//                     {
//                         reportPageList.some(v => v.get('key') === 'Xjllb') ?
//                         <Link className="home-container-item" to='/xjllb'>
//                             <Icon className="icon" type="xjllb" size="26" color="#FD7857"/>
//                             <p className="icon-text">现金流量表</p>
//                         </Link> : ''
//                     }
//                     {
//                         reportPageList.some(v => v.get('key') === 'Yjsfb') ?
//                         <Link className="home-container-item" to='/yjsfb'>
//                             <Icon className="icon" type="yjsfb" size="26" color="#FD7857"/>
//                             <p className="icon-text">应交税费表</p>
//                         </Link> : ''
//                     }
//                     {
//                         reportPageList.some(v => v.get('key') === 'Boss') ?
//                         <Link className="home-container-item" to='/boss'>
//                             <Icon className="icon" type="report" size="26" color="#FD7857"/>
//                             <p className="icon-text">老板表</p>
//                         </Link> : ''
//                     }
//                     {
//                         reportPageList.some(v => v.get('key') === 'Ambsyb') ?
//                         <Link className="home-container-item" to='/ambsyb'>
//                             <Icon className="icon" type="ambsyb" size="26" color="#FD7857"/>
//                             <p className="icon-text">阿米巴损益表</p>
//                         </Link> : ''
//                     }
//                 </Row>
//                 <Row className="home-container-list">
//                     {
//                         yebPageList.some(v => v.get('key') === 'kmyeb') ?
//                         <Link className="home-container-item" to='/kmyeb'>
//                             <Icon className="icon" type="purse" size="26" color="#1eb3bc"/>
//                             <p className="icon-text">科目余额表</p>
//                         </Link> : ''
//                     }
//                     {
//                         yebPageList.some(v => v.get('key') === 'AssYeb') ?
//                         <Link className="home-container-item" to='/assyeb'>
//                             <Icon className="icon" type="rmb" size="26" color="#1eb3bc"/>
//                             <p className="icon-text">辅助核算余额表</p>
//                         </Link> : ''
//
//                     }
//                     {
//                         yebPageList.some(v => v.get('key') === 'AssetsYeb') ?
//                         <Link className="home-container-item" to='/assetsyeb'>
//                             <Icon className="icon" type="assets-look" size="26" color="#2AACB4"/>
//                             <p className="icon-text">资产余额表</p>
//                         </Link> : ''
//                     }
//                     {
//                         yebPageList.some(v => v.get('key') === 'CurrencyYeb') ?
//                         <Link className="home-container-item" to='/currencyyeb'>
//                             <Icon className="icon" type="wbyeb" size="26" color="#2AACB4"/>
//                             <p className="icon-text">外币余额表</p>
//                         </Link> : ''
//                     }
//                     {
//                         yebPageList.some(v => v.get('key') === 'AmountYeb') ?
//                         <Link className="home-container-item" to='/amountyeb'>
//                             <Icon className="icon" type="slyeb" size="26" color="#2AACB4"/>
//                             <p className="icon-text">数量余额表</p>
//                         </Link> : ''
//                     }
//                     {
//                         yebPageList.some(v => v.get('key') === 'LsYeb') ?
//                         <Link className="home-container-item" to='/lsyeb'>
//                             <Icon className="icon" type="rmb" size="26" color="#1eb3bc"/>
//                             <p className="icon-text">流水余额表</p>
//                         </Link> : ''
//                     }
//                 </Row>
//             </div>
//         )
//     }
// }
