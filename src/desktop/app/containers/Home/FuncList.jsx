import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as middleActions from 'app/redux/Home/middle.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
// import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
// import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'

import { message } from 'antd'
import XfnIcon from 'app/components/Icon'

@immutableRenderDecorator
export default
class FuncList extends React.Component {

	// constructor() {
	// 	super()
	// 	this.state = {
	// 		showModal: false
	// 	}
	// }

	render() {
		const { pageList, navbarList, dispatch, year, month, allPanes, isRunning, GLCanUse, newJr } = this.props

        const editList = pageList.getIn(['Edit', 'pageList']) ? pageList.getIn(['Edit', 'pageList']) : fromJS([])
        const searchList = pageList.getIn(['Search', 'pageList']) ? pageList.getIn(['Search', 'pageList']) : fromJS([])
        const reportList = pageList.getIn(['Report', 'pageList']) ? pageList.getIn(['Report', 'pageList']) : fromJS([])
        const mxbList = pageList.getIn(['Mxb', 'pageList']) ? pageList.getIn(['Mxb', 'pageList']) : fromJS([])
        const yebList = pageList.getIn(['Yeb', 'pageList']) ? pageList.getIn(['Yeb', 'pageList']) : fromJS([])

        const firstList = editList.concat(searchList)

		return (
			<div className="home-func">
                {
                    firstList.size > 0 ?
                    <dl className="home-func-section">
                        <dt className="home-func-title">录入/查询 ({`${firstList.size}`})</dt>
						<div className="home-func-list">
							{
                                firstList.some(v => v.get('key') === 'SearchApproval') ?
								<dd
									className="home-func-item"
									onClick={() => {
										// if (allPanes.get('SearchPanes').indexOf('查询凭证') > -1) {
										// 	dispatch(homeActions.addPageTabPane('SearchPanes', '查询凭证', '查询凭证', '查询凭证'))
										// 	dispatch(homeActions.addHomeTabpane('Search', '查询凭证'))
										// } else {
										// 	// dispatch(homeActions.initCxpz())
										// 	// dispatch(homeActions.addTabpane('Cxpz'))
										dispatch(homeActions.addPageTabPane('SearchPanes', 'SearchApproval', 'SearchApproval', '查询审批'))
										dispatch(homeActions.addHomeTabpane('Search', 'SearchApproval', '查询审批'))
										// }
									}}
								>
									<XfnIcon className="home-icon" type="searchApproval" style={{'background': '#f45d51'}}/>
									<p className="home-table-name">查询审批</p>
								</dd>
								: ''
                            }
							{
								firstList.some(v => v.get('key') === 'LrAccount') ?
								<dd
									// className={sessionStorage.getItem("firstload") == 'first' ? "home-func-item home-func-item-animat" : "home-func-item"}
									className={"home-func-item"}
									onClick={() => {
										// 旧入口
										// 待修改， 可在页面关闭时统一清理状态
										dispatch(middleActions.getRunningSettingInfo())
										if (allPanes.get('SearchPanes').indexOf('录入流水') === -1) {
											dispatch(middleActions.initLrAccount('init'))
											dispatch(middleActions.initLrCalculate('init'))
										}
										dispatch(homeActions.addPageTabPane('EditPanes', 'LrAccount', 'LrAccount', '录入流水'))
										dispatch(homeActions.addHomeTabpane('Edit', 'LrAccount', '录入流水'))
										}}
									>
									<XfnIcon className="home-icon" type="lrls" style={{'background': '#5e81d1'}}/>
									<p className="home-table-name">录入流水</p>
								</dd>
								: ''
							}
							{
								firstList.some(v => v.get('key') === 'EditRunning') ?
								<dd
									className={"home-func-item"}
									onClick={() => {
										// 新入口
										sessionStorage.setItem('previousPage', 'home')
										dispatch(homeActions.addPageTabPane('EditPanes', 'EditRunning', 'EditRunning', '录入流水'))
										dispatch(homeActions.addHomeTabpane('Edit', 'EditRunning', '录入流水'))
									}}
								>
									<XfnIcon className="home-icon" type="lrls" style={{'background': '#5e81d1'}}/>
									<p className="home-table-name">录入流水</p>
								</dd>
								: ''
							}
							{
								firstList.some(v => v.get('key') === 'Lrpz') ?
								<dd
									className="home-func-item"
									onClick={() => {

										// dispatch(allActions.usersUseLog('lrpz'))
										sessionStorage.setItem('previousPage', 'home')
										dispatch(homeActions.addPageTabPane('EditPanes', 'Lrpz', 'Lrpz', '录入凭证'))
										dispatch(homeActions.addHomeTabpane('Edit', 'Lrpz', '录入凭证'))

										// dispatch(allActions.sendMessageToDeveloper({
										// 	title: '进入录入凭证',
										// 	message: '正常进入',
										// 	remark: '首页',
										// }))
									}}
								>
									<XfnIcon className="home-icon" type="lrpz" style={{'background': '#5e81d1'}}/>
									<p className="home-table-name">录入凭证</p>
								</dd>
								: ''
							}

							{
								firstList.some(v => v.get('key') === 'Cxls') ?
								<dd
									// className={sessionStorage.getItem("firstload") == 'first' ? "home-func-item home-func-item-animat" : "home-func-item"}
									className={"home-func-item"}
									onClick={() => {
										// 旧入口
										// if (panes.some(v => v === 'Cxls')) {
											// dispatch(homeActions.addTabpane('Cxls'))
										// } else {
											// dispatch(homeActions.initCxpz())
											// dispatch(homeActions.addTabpane('Cxls'))
										// }
										dispatch(homeActions.addPageTabPane('SearchPanes', 'Cxls', 'Cxls', '查询流水'))
										dispatch(homeActions.addHomeTabpane('Search', 'Cxls', '查询流水'))
									}}
									>
									{/* <XfnIcon className="home-icon-bata" type="beta" size='50' style={{color: '#5e81d1'}}/> */}
									<XfnIcon className="home-icon" type="cxls" style={{'background': '#5e81d1'}}/>
									<p className="home-table-name">查询流水</p>
								</dd>
								: ''
							}
							{
								firstList.some(v => v.get('key') === 'SearchRunning') ?
								<dd
									// className={sessionStorage.getItem("firstload") == 'first' ? "home-func-item home-func-item-animat" : "home-func-item"}
									className={"home-func-item"}
									onClick={() => {
										// 新入口
										// if (panes.some(v => v === 'Cxls')) {
											// dispatch(homeActions.addTabpane('Cxls'))
										// } else {
											// dispatch(homeActions.initCxpz())
											// dispatch(homeActions.addTabpane('Cxls'))
										// }
										dispatch(homeActions.addPageTabPane('SearchPanes', 'SearchRunning', 'SearchRunning', '查询流水'))
										dispatch(homeActions.addHomeTabpane('Search', 'SearchRunning', '查询流水'))
									}}
									>
									{/* <XfnIcon className="home-icon-bata" type="beta" size='50' style={{color: '#5e81d1'}}/> */}
									<XfnIcon className="home-icon" type="cxls" style={{'background': '#5e81d1'}}/>
									<p className="home-table-name">查询流水</p>
								</dd>
								: ''
							}
                            {
                                firstList.some(v => v.get('key') === 'Cxpz') ?
								<dd
									className="home-func-item"
									onClick={() => {
										// if (allPanes.get('SearchPanes').indexOf('查询凭证') > -1) {
										// 	dispatch(homeActions.addPageTabPane('SearchPanes', '查询凭证', '查询凭证', '查询凭证'))
										// 	dispatch(homeActions.addHomeTabpane('Search', '查询凭证'))
										// } else {
										// 	// dispatch(homeActions.initCxpz())
										// 	// dispatch(homeActions.addTabpane('Cxpz'))
										dispatch(homeActions.addPageTabPane('SearchPanes', 'Cxpz', 'Cxpz', '查询凭证'))
										dispatch(homeActions.addHomeTabpane('Search', 'Cxpz', '查询凭证'))
										// }
									}}
								>
									<XfnIcon className="home-icon" type="cxpz" style={{'background': isRunning ? '#ff8350' : '#5e81d1'}}/>
									<p className="home-table-name">查询凭证</p>
								</dd>
								: ''
                            }
						</div>
                    </dl>
                    : ''
                }
				{
                    reportList.size > 0 ?
                    <dl className="home-func-section">
                        <dt className="home-func-title">报表 ({`${reportList.size}`})</dt>
						<div className="home-func-list">
							{
                                reportList.some(v => v.get('key') === 'Lrb') && isRunning && newJr?
								<dd
									className="home-func-item"
									onClick={() => {
										dispatch(homeActions.addPageTabPane('ReportPanes', 'Lrb', 'Lrb', '利润表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Lrb', '利润表'))
									}}
								>
									<XfnIcon className="home-icon" type="lr" style={{'background': 'rgb(94, 129, 209)'}}/>
									<p className="home-table-name">利润表</p>
								</dd>
								: ''
                            }
							{
								reportList.some(v => v.get('key') === 'Zcfzb') && isRunning && newJr ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('ReportPanes', 'Zcfzb', 'Zcfzb', '资产负债表'))
											dispatch(homeActions.addHomeTabpane('Report', 'Zcfzb', '资产负债表'))
										}}
										>
											<XfnIcon className="home-icon" type="zcfz" style={{'background': 'rgb(94, 129, 209)'}}/>
											<p className="home-table-name">资产负债表</p>
										</dd>
									: ''
							}
							{
                                reportList.some(v => v.get('key') === 'Xjllb') && isRunning && newJr?
								<dd
									className="home-func-item"
									onClick={() => {
										dispatch(homeActions.addPageTabPane('ReportPanes', 'Xjllb', 'Xjllb', '现金流量表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Xjllb', '现金流量表'))
									}}
								>
									<XfnIcon className="home-icon" type="xjllb" style={{'background': 'rgb(94, 129, 209)'}}/>
									<p className="home-table-name">现金流量表</p>
								</dd>
								: ''
                            }
							{
                                reportList.some(v => v.get('key') === 'Yjsfb') && isRunning && newJr?
								<dd
									className="home-func-item"
									onClick={() => {
										dispatch(homeActions.addPageTabPane('ReportPanes', 'Yjsfb', 'Yjsfb', '应交税费表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Yjsfb', '应交税费表'))
									}}
								>
									<XfnIcon className="home-icon" type="yjsfb" style={{'background': 'rgb(94, 129, 209)'}}/>
									<p className="home-table-name">应交税费表</p>
								</dd>
								: ''
                            }
							{
								reportList.some(v => v.get('key') === 'Syxmb') ?
								<dd
									className="home-func-item"
									onClick={() => {
										// if (allPanes.get('ReportPanes').indexOf('损益项目表') === -1) {
										// 	dispatch(middleActions.changeSYXMCharDidmount(false))
										// }

										dispatch(homeActions.addPageTabPane('ReportPanes', 'Syxmb', 'Syxmb', ' 阿米巴损益表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Syxmb', '阿米巴损益表'))
									}}
								>
									<XfnIcon className="home-icon" type="ambsyb" style={{'background': '#5e81d1'}}/>
									<p className="home-table-name">阿米巴损益表</p>
								</dd>
								: ''
							}




                            {
                                reportList.some(v => v.get('key') === 'Lrb') && (!isRunning || !newJr) ?
								<dd
									className="home-func-item"
									onClick={() => {
										dispatch(homeActions.addPageTabPane('ReportPanes', 'Lrb', 'Lrb', '利润表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Lrb', '利润表'))
									}}
								>
									<XfnIcon className="home-icon" type="lr" style={{'background': '#ff8350'}}/>
									<p className="home-table-name">利润表</p>
								</dd>
								: ''
                            }
                            {
								reportList.some(v => v.get('key') === 'Zcfzb')  && (!isRunning || !newJr)?
                                // reportList.some(v => v.get('key') === 'Zcfzb') ?
								<dd
									className="home-func-item"
									onClick={() => {
										dispatch(homeActions.addPageTabPane('ReportPanes', 'Zcfzb', 'Zcfzb', '资产负债表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Zcfzb', '资产负债表'))
									}}
								>
									<XfnIcon className="home-icon" type="zcfz" style={{'background': '#ff8350'}}/>
									<p className="home-table-name">资产负债表</p>
								</dd>
								: ''
                            }
							{
                                reportList.some(v => v.get('key') === 'Xjllb') && (!isRunning || !newJr) ?
								<dd
									className="home-func-item"
									onClick={() => {
										dispatch(homeActions.addPageTabPane('ReportPanes', 'Xjllb', 'Xjllb', '现金流量表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Xjllb', '现金流量表'))
									}}
								>
									<XfnIcon className="home-icon" type="xjllb" style={{'background': '#ff8350'}}/>
									<p className="home-table-name">现金流量表</p>
								</dd>
								: ''
                            }
							{
                                reportList.some(v => v.get('key') === 'Yjsfb') && (!isRunning || !newJr) ?
								<dd
									className="home-func-item"
									onClick={() => {
										dispatch(homeActions.addPageTabPane('ReportPanes', 'Yjsfb', 'Yjsfb', '应交税费表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Yjsfb', '应交税费表'))
									}}
								>
									<XfnIcon className="home-icon" type="yjsfb" style={{'background': '#ff8350'}}/>
									<p className="home-table-name">应交税费表</p>
								</dd>
								: ''
                            }
							{
                                reportList.some(v => v.get('key') === 'Ambsyb') ?
								<dd
									className="home-func-item"
									onClick={() => {
										if (allPanes.get('ReportPanes').indexOf('阿米巴损益表') === -1) {
											dispatch(middleActions.changeCharDidmount(false))
										}

										dispatch(homeActions.addPageTabPane('ReportPanes', 'Ambsyb', 'Ambsyb', '阿米巴损益表'))
										dispatch(homeActions.addHomeTabpane('Report', 'Ambsyb', '阿米巴损益表'))
									}}
								>
									<XfnIcon className="home-icon" type="ambsyb" style={{'background': '#ff8350'}}/>
									<p className="home-table-name">阿米巴损益表</p>
								</dd>
								: ''
                            }

						</div>
                    </dl>
                    : ''
                }
				{
                    yebList.size > 0 ?
                    <dl className="home-func-section">
                        <dt className="home-func-title">余额表/明细表 ({`${yebList.size + mxbList.size}`})</dt>
						<div className="home-func-list-mx-yue home-func-list-mx-yue-together">
							<div>
								{/* {
									yebList.some(v => v.get('key') === 'LsYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', '流水余额表', '流水余额表', '流水余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', '流水余额表'))
										}}
									>
										<XfnIcon className="home-icon-bata" type="beta" size='50' style={{color: '#5e81d1'}}/>
										<XfnIcon className="home-icon" type="lsyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">流水余额表</p>
									</dd>
									: ''
								} */}
								{
									yebList.some(v => v.get('key') === 'ZhYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'ZhYeb', 'ZhYeb', '账户余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'ZhYeb', '账户余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="zhyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">账户余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'AccountYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'AccountYeb', 'AccountYeb', '账户余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'AccountYeb', '账户余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="zhyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">账户余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'WlYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'WlYeb', 'WlYeb', '往来余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'WlYeb', '往来余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="wlyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">往来余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'RelativeYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'RelativeYeb', 'RelativeYeb', '往来余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'RelativeYeb', '往来余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="wlyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">往来余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'XmYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'XmYeb', 'XmYeb', '项目余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'XmYeb', '项目余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="xmyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">项目余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'ProjectYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'ProjectYeb', 'ProjectYeb', '项目余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'ProjectYeb', '项目余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="xmyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">项目余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'InventoryYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'InventoryYeb', 'InventoryYeb', '存货余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'InventoryYeb', '存货余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="inventoryYeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">存货余额表</p>
									</dd>
									:''
								}
								{
									yebList.some(v => v.get('key') === 'IncomeExpendYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'IncomeExpendYeb', 'IncomeExpendYeb', '收支余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'IncomeExpendYeb', '收支余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="lsyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">收支余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'RunningTypeYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'RunningTypeYeb', 'RunningTypeYeb', '类型余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'RunningTypeYeb', '类型余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="typeyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">类型余额表</p>
									</dd>
									: ''
								}

								{
									yebList.some(v => v.get('key') === 'Kmyeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'Kmyeb', 'Kmyeb', '科目余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'Kmyeb', '科目余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="kmye" style={{'background': isRunning ? '#ff8350' : '#5e81d1'}}/>
										<p className="home-table-name">科目余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'AssYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'AssYeb', 'AssYeb', '辅助余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'AssYeb', '辅助余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="asskmye" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">辅助余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'AssetsYeb') ?
									<dd
										className={"home-func-item"}
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'AssetsYeb', 'AssetsYeb', '资产余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'AssetsYeb', '资产余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="assetskmyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">资产余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'CurrencyYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'CurrencyYeb', 'CurrencyYeb', '外币余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'CurrencyYeb', '外币余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="wbyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">外币余额表</p>
									</dd>
									: ''
								}
								{
									yebList.some(v => v.get('key') === 'AmountYeb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('YebPanes', 'AmountYeb', 'AmountYeb', '数量余额表'))
											dispatch(homeActions.addHomeTabpane('Yeb', 'AmountYeb', '数量余额表'))
										}}
									>
										<XfnIcon className="home-icon" type="slyeb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">数量余额表</p>
									</dd>
									: ''
								}

							</div>
							<div>
								{/* {
									mxbList.some(v => v.get('key') === 'LsMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('MxbPanes', '流水明细表', '流水明细表', '流水明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', '流水明细表'))
										}}
									>
										<XfnIcon className="home-icon-bata" type="beta" size='50' style={{color: '#5e81d1'}}/>
										<XfnIcon className="home-icon" type="lsmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">流水明细表</p>
									</dd>
									: ''
								} */}
								{
									mxbList.some(v => v.get('key') === 'ZhMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('MxbPanes', 'ZhMxb', 'ZhMxb', '账户明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'ZhMxb', '账户明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="zhmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">账户明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'AccountMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'AccountMxb', 'AccountMxb', '账户明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'AccountMxb', '账户明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="zhmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">账户明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'WlMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											dispatch(homeActions.addPageTabPane('MxbPanes', 'WlMxb', 'WlMxb', '往来明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'WlMxb', '往来明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="wlmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">往来明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'RelativeMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'RelativeMxb', 'RelativeMxb', '往来明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'RelativeMxb', '往来明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="wlmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">往来明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'XmMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'XmMxb', 'XmMxb', '项目明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'XmMxb', '项目明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="xmmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">项目明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'ProjectMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'ProjectMxb', 'ProjectMxb', '项目明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'ProjectMxb', '项目明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="xmmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">项目明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'InventoryMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'InventoryMxb', 'InventoryMxb', '存货明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'InventoryMxb', '存货明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="inventoryMxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">存货明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'IncomeExpendMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'IncomeExpendMxb', 'IncomeExpendMxb', '收支明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'IncomeExpendMxb', '收支明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="lsmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">收支明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'RunningTypeMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'RunningTypeMxb', 'RunningTypeMxb', '类型明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'RunningTypeMxb', '类型明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="typemxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">类型明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'Kmmxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'Kmmxb', 'Kmmxb', '科目明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'Kmmxb', '科目明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="mx" style={{'background': isRunning ? '#ff8350' : '#5e81d1'}}/>
										<p className="home-table-name">科目明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'AssMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'AssMxb', 'AssMxb', '辅助明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'AssMxb', '辅助明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="assmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">辅助明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'AssetsMxb') ?
									<dd
										className={"home-func-item"}
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'AssetsMxb', 'AssetsMxb', '资产明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'AssetsMxb', '资产明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="assetsmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">资产明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'CurrencyMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'CurrencyMxb', 'CurrencyMxb', '外币明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'CurrencyMxb', '外币明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="wbmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">外币明细表</p>
									</dd>
									: ''
								}
								{
									mxbList.some(v => v.get('key') === 'AmountMxb') ?
									<dd
										className="home-func-item"
										onClick={() => {
											sessionStorage.setItem('previousPage', 'home')
											dispatch(homeActions.addPageTabPane('MxbPanes', 'AmountMxb', 'AmountMxb', '数量明细表'))
											dispatch(homeActions.addHomeTabpane('Mxb', 'AmountMxb', '数量明细表'))
										}}
									>
										<XfnIcon className="home-icon" type="slmxb" style={{'background': '#5e81d1'}}/>
										<p className="home-table-name">数量明细表</p>
									</dd>
									: ''
								}
							</div>
						</div>
                    </dl>
                    : ''
                }
			</div>
		)
	}
}
