import React, { Component, PropTypes }  from 'react'
import { Link } from 'react-router-dom'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { SinglePicker, Row, NoticeSwitchBar, Icon }  from 'app/components'
import { fromJS, toJS } from 'immutable'

import { homeActions } from 'app/redux/Home/home.js'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import * as cxlsExportActions from 'app/redux/Search/Cxls/cxlsExport.action.js'

import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'

@immutableRenderDecorator
export default
class HomeSection extends Component {

    render() {

        const { userInfo, dispatch, history, pageList, period } = this.props

        const time = 3000
        const sobInfo = userInfo.get('sobInfo')
        const sobList = userInfo.get('sobList')
        // const openProcess = userInfo.get('openProcess')
        // const defaultsobid = userInfo.get('defaultsobid')
        const noticeList = userInfo.get('noticeList')
        const newJr = sobInfo ? sobInfo.get('newJr') : false
        const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 : false

        const defaultsobid = sobInfo ? sobInfo.get('sobId') : ''
		const defaultsobname = sobInfo ? sobInfo.get('sobName') : '请点击［账套编辑］创建账套'

		const year = period.get('openedyear')
		const month = period.get('openedmonth')

        const editList = pageList.getIn(['Edit', 'pageList']) ? pageList.getIn(['Edit', 'pageList']) : fromJS([])
        const searchList = pageList.getIn(['Search', 'pageList']) ? pageList.getIn(['Search', 'pageList']) : fromJS([])
        const reportList = pageList.getIn(['Report', 'pageList']) ? pageList.getIn(['Report', 'pageList']) : fromJS([])
        const yebList = pageList.getIn(['Yeb', 'pageList']) ? pageList.getIn(['Yeb', 'pageList']) : fromJS([])

        const firstList = editList.concat(searchList)

        return (
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    <div className="swiper-slide home-tab-bar-item">
                        <div className="home-tab-bar-item-top" id="homeTabBarSet">
                            <SinglePicker
                                className="home-tab-bar-sob-select-wrap"
                                extra="请选择(可选)"
                                value={defaultsobid}
                                district={sobList.map(v => {return {key: v.get('sobName'), value: v.get('sobId')}}).toJS()}
                                onOk={value => dispatch(homeActions.modifyDefaultSobIdFetch(value.value, history))}
                            >
                                <div className="home-tab-bar-sob-select">
                                    <div><span>{defaultsobname}</span><Icon type="arrow-down"/> </div>
                                </div>
                            </SinglePicker>
                            <span className="home-tab-bar-sob-setting" onClick={() => {
                                dispatch(homeActions.homePageGetSobList(sobList))
                                history.push('/config/sob/index')
                            }}><Icon type="setting"/></span>
                        </div>
                        <div className="home-notice-switch-wrap" style={{display: noticeList.size ? '' : 'none'}}>
                            <NoticeSwitchBar
                                itemlist={noticeList}
                                time={time}
                                history={history}
                            />
                        </div>
                       <div className="home-body-wrap">
                            {
                                firstList.size ?
                                <Row className="home-container-list">
                                    <div className="home-container-list-title">录入/查询</div>
                                    <div className="tab-list">
                                        {
                                            editList.some(v => v.get('key') === 'EditApproval') ?
                                            <Link
                                                className="home-container-item"
                                                to='/editApproval/index'
                                            >
                                                <Icon className="icon" type="fqsp" size="40" color="#f45d51"/>
                                                <p className="icon-text">发起审批</p>
                                            </Link> : ''
                                        }
                                        {
                                            searchList.some(v => v.get('key') === 'SearchApproval') ?
                                            <Link
                                                className="home-container-item"
                                                to='/searchapproval/index'
                                                onClick={() => {
                                                    // dispatch({type: ActionTypes.INIT_CXLS})
                                                    // dispatch(cxlsExportActions.initCxls())
                                                }}
                                            >
                                                <Icon className="icon" type="search-shenpi" size="40" color="#f45d51"/>
                                                <p className="icon-text">查询审批</p>
                                            </Link> : ''
                                        }
                                        {
                                            editList.some(v => v.get('key') === 'Lrls') ?
                                            <Link
                                                className="home-container-item"
                                                to='/lrls'
                                            >
                                                <Icon className="icon" type="import-running" size="40" color="#5d81d1"/>
                                                <p className="icon-text">录入流水</p>
                                            </Link> : ''
                                        }
                                        {
                                            editList.some(v => v.get('key') === 'EditRunning') ?
                                            <Link
                                                className="home-container-item"
                                                to='/editrunning/index'
                                            >
                                                <Icon className="icon" type="import-running" size="40" color="#5d81d1"/>
                                                <p className="icon-text">录入流水</p>
                                            </Link> : ''
                                        }

                                        {
                                            searchList.some(v => v.get('key') === 'Cxls') ?
                                            <Link
                                                className="home-container-item"
                                                to='/cxls'
                                                onClick={() => {
                                                    // dispatch({type: ActionTypes.INIT_CXLS})
                                                    dispatch(cxlsExportActions.initCxls())
                                                }}
                                            >
                                                <Icon className="icon" type="search-running" size="40" color="#5d81d1"/>
                                                <p className="icon-text">查询流水</p>
                                            </Link> : ''
                                        }
                                        {
                                            searchList.some(v => v.get('key') === 'SearchRunning') ?
                                            <Link
                                                className="home-container-item"
                                                to='/searchrunning/index'
                                                onClick={() => {
                                                }}
                                            >
                                                <Icon className="icon" type="search-running" size="40" color="#5d81d1"/>
                                                <p className="icon-text">查询流水</p>
                                            </Link> : ''
                                        }
                                        {
                                            editList.some(v => v.get('key') === 'Lrpz') ?
                                            <Link
                                                className="home-container-item"
                                                to='/lrpz'
                                                onClick={() => {

                                                    sessionStorage.removeItem('enterDraft')

                                                    // // 提取
                                                    // const now = new Date()
                                                    // const nowYear = now.getFullYear()
                                                    // const nowMonth = now.getMonth() + 1
                                                    //
                                                    // let vcdate = ''
                                                    // if (!year) {
                                                    //     vcdate = new Date()
                                                    // } else {
                                                    //     const lastDate = new Date(year, month, 0)
                                                    //     const currentDate = new Date()
                                                    //     vcdate = nowYear == year && nowMonth == month ? currentDate : lastDate
                                                    // }
                                                    //
                                                    // dispatch(lrpzExportActions.initLrpz())
                                                    // dispatch(lrpzExportActions.getLastVcIdFetch(vcdate))
                                                    // dispatch(lrpzExportActions.setCkpzIsShow(false))
                                                }}
                                            >
                                            <Icon className="icon" type="import-voucher" size="40" color="#5d81d1"/>
                                            <p className="icon-text">录入凭证</p>
                                            </Link> : ''
                                        }
                                        {
                                            searchList.some(v => v.get('key') === 'Cxpz') ?
                                            <Link
                                                className="home-container-item"
                                                to='/cxpz'
                                            >
                                                <Icon className="icon" type="search-voucher" size="40" color={isRunning ? "#fa7954" : "#5d81d1"}/>
                                                <p className="icon-text">查询凭证</p>
                                            </Link> : ''
                                        }
                                    </div>
                                </Row>
                                : ''
                            }
                            {
                                reportList.size ?
                                <Row className="home-container-list home-container-list-margin-top">
                                    <div className="home-container-list-title">报表</div>
                                    <div className="tab-list">


                                        {
                                            reportList.some(v => v.get('key') === 'Lrb') ?
                                            <Link className="home-container-item" to='/lrb'>
                                                <Icon className="icon" type="profit" size="35" color={isRunning && newJr?'rgb(93, 129, 209)':"#fa7954"}/>
                                                <p className="icon-text">利润表</p>
                                            </Link> : ''
                                        }

                                        {
                                            reportList.some(v => v.get('key') === 'Zcfzb') ?
                                            <Link className="home-container-item" to='/zcfzb'>
                                                <Icon className="icon" type="balance" size="35" color={isRunning && newJr?'rgb(93, 129, 209)':"#fa7954"}/>
                                                <p className="icon-text">资产负债表</p>
                                            </Link> : ''
                                        }
                                        {
                                        reportList.some(v => v.get('key') === 'Xjllb') ?
                                            <Link className="home-container-item" to='/xjllb'>
                                                <Icon className="icon" type="xjllb" size="35" color={isRunning && newJr?'rgb(93, 129, 209)':"#fa7954"}/>
                                                <p className="icon-text">现金流量表</p>
                                            </Link> : ''
                                        }
                                        {
                                            reportList.some(v => v.get('key') === 'Yjsfb') ?
                                            <Link className="home-container-item" to='/yjsfb'>
                                                <Icon className="icon" type="yjsfb" size="35" color={isRunning && newJr?'rgb(93, 129, 209)':"#fa7954"}/>
                                                <p className="icon-text">应交税费表</p>
                                            </Link> : ''
                                        }
                                        {
                                            reportList.some(v => v.get('key') === 'Syxmb') ?
                                            <Link className="home-container-item" to='/syxmb'>
                                                <Icon className="icon" type="ambsyb" size="35" color="#5e81d1"/>
                                                <p className="icon-text">阿米巴损益表</p>
                                            </Link> : ''
                                        }
                                        {
                                            reportList.some(v => v.get('key') === 'Ambsyb') ?
                                            <Link className="home-container-item" to='/ambsyb'>
                                                <Icon className="icon" type="ambsyb" size="35" color="#fa7954"/>
                                                <p className="icon-text">阿米巴报表</p>
                                            </Link> : ''
                                        }
                                        {
                                            reportList.some(v => v.get('key') === 'Boss') && isRunning && newJr ?
                                            <Link className="home-container-item" to='/jr/boss'>
                                                <Icon className="icon" type="report" size="35" color="rgb(93, 129, 209)"/>
                                                <p className="icon-text">老板表</p>
                                            </Link> : ''
                                        }
                                        {
                                            reportList.some(v => v.get('key') === 'Boss') && (!isRunning || !newJr)?
                                            <Link className="home-container-item" to='/boss'>
                                                <Icon className="icon" type="report" size="35" color="#fa7954"/>
                                                <p className="icon-text">老板表</p>
                                            </Link> : ''
                                        }

                                    </div>
                                </Row>
                                : ''
                            }
                            {
                                yebList.size ?
                                <Row className="home-container-list">
                                <div className="home-container-list-title">余额表/明细表</div>
                                    <div className="tab-list">
                                        {
                                            yebList.some(v => v.get('key') === 'ZhYeb') ?
                                            <Link className="home-container-item" to='/zhyeb'>
                                                <Icon className="icon" type="zhyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">账户余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'AccountYeb') ?
                                            <Link className="home-container-item" to='/accountyeb'>
                                                <Icon className="icon" type="zhyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">账户余额表</p>
                                            </Link> : ''
                                        }

                                        {
                                            yebList.some(v => v.get('key') === 'WlYeb') ?
                                            <Link className="home-container-item" to='/wlyeb'>
                                                <Icon className="icon" type="wlyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">往来余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'RelativeYeb') ?
                                            <Link className="home-container-item" to='/relativeyeb'>
                                                <Icon className="icon" type="wlyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">往来余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'XmYeb') ?
                                            <Link className="home-container-item" to='/xmyeb'>
                                                <Icon className="icon" type="xmyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">项目余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'ProjectYeb') ?
                                            <Link className="home-container-item" to='/projectyeb'>
                                                <Icon className="icon" type="xmyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">项目余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'InventoryYeb') ?
                                            <Link className="home-container-item" to='/inventoryyeb'>
                                                <Icon className="icon" type="kcyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">存货余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'IncomeExpendYeb') ?
                                            <Link className="home-container-item" to='/incomeExpendyeb'>
                                                <Icon className="icon" type="other-expenses" size="35" color="#5d81d1"/>
                                                <p className="icon-text">收支余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'RunningTypeYeb') ?
                                            <Link className="home-container-item" to='/runningTypeyeb'>
                                                <Icon className="icon" type="lxyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">类型余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'kmyeb') ?
                                            <Link className="home-container-item" to='/kmyeb'>
                                                <Icon className="icon" type="purse" size="35" color={isRunning ? "#fa7954" : "#5d81d1"}/>
                                                <p className="icon-text">科目余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'AssYeb') ?
                                            <Link className="home-container-item" to='/assyeb'>
                                                <Icon className="icon" type="rmb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">辅助余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'AssetsYeb') ?
                                            <Link className="home-container-item" to='/assetsyeb'>
                                                <Icon className="icon" type="assets-look" size="35" color="#5d81d1"/>
                                                <p className="icon-text">资产余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'CurrencyYeb') ?
                                            <Link className="home-container-item" to='/currencyyeb'>
                                                <Icon className="icon" type="wbyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">外币余额表</p>
                                            </Link> : ''
                                        }
                                        {
                                            yebList.some(v => v.get('key') === 'AmountYeb') ?
                                            <Link className="home-container-item" to='/amountyeb'>
                                                <Icon className="icon" type="slyeb" size="35" color="#5d81d1"/>
                                                <p className="icon-text">数量余额表</p>
                                            </Link> : ''
                                        }

                                    </div>
                                </Row>
                                : ''
                            }
                        </div>
                    </div>
                </div>
                <div className="swiper-scrollbar"></div>
            </div>
        )
    }
}
